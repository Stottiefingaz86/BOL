-- ─── Research overlay schema ──────────────────────────────────────────
-- Run once in the Supabase SQL Editor for the project in NEXT_PUBLIC_SUPABASE_URL:
-- https://supabase.com/dashboard → SQL Editor → New Query → Paste → Run
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS research_sessions (
  id              TEXT PRIMARY KEY,
  journey_id      TEXT NOT NULL,
  journey_title   TEXT NOT NULL,
  tester_name     TEXT NOT NULL,
  tester_email    TEXT NOT NULL,
  consent         BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at      TIMESTAMPTZ NOT NULL,
  finished_at     TIMESTAMPTZ,
  device          JSONB NOT NULL DEFAULT '{}',
  overall_rating  SMALLINT CHECK (overall_rating BETWEEN 1 AND 5),
  overall_comments TEXT NOT NULL DEFAULT '',
  replay_url      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS research_task_results (
  id                     TEXT PRIMARY KEY,
  session_id             TEXT NOT NULL REFERENCES research_sessions(id) ON DELETE CASCADE,
  task_id                TEXT NOT NULL,
  task_index             SMALLINT NOT NULL,
  instruction            TEXT NOT NULL,
  outcome                TEXT NOT NULL CHECK (outcome IN ('completed', 'skipped', 'gave_up')),
  detected_automatically BOOLEAN NOT NULL DEFAULT FALSE,
  started_at             TIMESTAMPTZ NOT NULL,
  completed_at           TIMESTAMPTZ NOT NULL,
  duration_ms            INTEGER NOT NULL,
  ease_rating            SMALLINT CHECK (ease_rating BETWEEN 1 AND 5),
  would_change           TEXT NOT NULL DEFAULT '',
  follow_up_answer       TEXT NOT NULL DEFAULT '',
  paths_visited          JSONB NOT NULL DEFAULT '[]',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_sessions_journey ON research_sessions (journey_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_sessions_started ON research_sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_task_results_session ON research_task_results (session_id, task_index);
CREATE INDEX IF NOT EXISTS idx_research_task_results_task ON research_task_results (task_id);

-- ─── RLS ──────────────────────────────────────────────────────────────
-- The overlay writes with the anon key from the browser; the admin page reads with it too.
-- This mirrors tracking_events (demo project). Tighten to authenticated-only before real PII use.
ALTER TABLE research_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_task_results  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "research_sessions_anon_all" ON research_sessions;
CREATE POLICY "research_sessions_anon_all" ON research_sessions
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "research_task_results_anon_all" ON research_task_results;
CREATE POLICY "research_task_results_anon_all" ON research_task_results
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- keep updated_at fresh
CREATE OR REPLACE FUNCTION research_touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_research_sessions_updated ON research_sessions;
CREATE TRIGGER trg_research_sessions_updated BEFORE UPDATE ON research_sessions
  FOR EACH ROW EXECUTE FUNCTION research_touch_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- v2 — campaigns, participant de-dupe, custom answers, voice answers
-- (safe to re-run; everything is IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS research_campaigns (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  description       TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL CHECK (status IN ('draft', 'live', 'ended')) DEFAULT 'draft',
  start_path        TEXT NOT NULL DEFAULT '/',
  estimated_minutes SMALLINT NOT NULL DEFAULT 5,
  tasks             JSONB NOT NULL DEFAULT '[]',
  final_questions   JSONB NOT NULL DEFAULT '[]',
  outro             TEXT NOT NULL DEFAULT '',
  reward            JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one campaign may be live at a time.
CREATE UNIQUE INDEX IF NOT EXISTS idx_research_campaigns_one_live ON research_campaigns ((status)) WHERE status = 'live';

ALTER TABLE research_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "research_campaigns_anon_all" ON research_campaigns;
CREATE POLICY "research_campaigns_anon_all" ON research_campaigns
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS trg_research_campaigns_updated ON research_campaigns;
CREATE TRIGGER trg_research_campaigns_updated BEFORE UPDATE ON research_campaigns
  FOR EACH ROW EXECUTE FUNCTION research_touch_updated_at();

-- Sessions: tester IP (participant de-dupe) + answers to custom final questions
ALTER TABLE research_sessions ADD COLUMN IF NOT EXISTS ip TEXT;
ALTER TABLE research_sessions ADD COLUMN IF NOT EXISTS final_answers JSONB NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_research_sessions_ip ON research_sessions (journey_id, ip);
CREATE INDEX IF NOT EXISTS idx_research_sessions_email ON research_sessions (journey_id, lower(tester_email));

-- Task results: every answer keyed by question id (text, rating, yes/no, and `<qid>:audio` URLs)
ALTER TABLE research_task_results ADD COLUMN IF NOT EXISTS answers JSONB NOT NULL DEFAULT '{}';

-- Voice answers: public-read storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-audio', 'research-audio', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "research_audio_public_read" ON storage.objects;
CREATE POLICY "research_audio_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'research-audio');

DROP POLICY IF EXISTS "research_audio_anon_upload" ON storage.objects;
CREATE POLICY "research_audio_anon_upload" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'research-audio');

DROP POLICY IF EXISTS "research_audio_anon_update" ON storage.objects;
CREATE POLICY "research_audio_anon_update" ON storage.objects
  FOR UPDATE TO anon, authenticated USING (bucket_id = 'research-audio');

-- ═══════════════════════════════════════════════════════════════════
-- v3 — interaction log, session replay, reward gating
-- ═══════════════════════════════════════════════════════════════════
ALTER TABLE research_task_results ADD COLUMN IF NOT EXISTS events JSONB NOT NULL DEFAULT '[]';
ALTER TABLE research_task_results ADD COLUMN IF NOT EXISTS replay_url TEXT;
ALTER TABLE research_sessions     ADD COLUMN IF NOT EXISTS reward_earned BOOLEAN;

INSERT INTO storage.buckets (id, name, public)
VALUES ('research-replays', 'research-replays', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "research_replays_public_read" ON storage.objects;
CREATE POLICY "research_replays_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'research-replays');
DROP POLICY IF EXISTS "research_replays_anon_upload" ON storage.objects;
CREATE POLICY "research_replays_anon_upload" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'research-replays');
DROP POLICY IF EXISTS "research_replays_anon_update" ON storage.objects;
CREATE POLICY "research_replays_anon_update" ON storage.objects
  FOR UPDATE TO anon, authenticated USING (bucket_id = 'research-replays');

-- ═══════════════════════════════════════════════════════════════════
-- v4 — tester persona (onboarding profile)
-- ═══════════════════════════════════════════════════════════════════
ALTER TABLE research_sessions ADD COLUMN IF NOT EXISTS tester_profile JSONB;
