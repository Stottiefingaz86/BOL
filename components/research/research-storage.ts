'use client'

import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { ResearchSession, TaskResult } from './types'

/**
 * Persistence for research sessions.
 *
 * Primary: Supabase (`research_sessions`, `research_task_results` — see scripts/research-migration.sql).
 * Fallback: a localStorage outbox. Every write lands in the outbox first, then we try to flush it to
 * Supabase. If Supabase is missing/unconfigured/table-less, nothing is lost and the admin page still
 * reads the local copy (flagged "local only").
 */

const OUTBOX_KEY = 'research:outbox:v1'

interface Outbox {
  sessions: Record<string, ResearchSession>
  results: Record<string, TaskResult>
  /** ids still waiting to reach Supabase */
  pendingSessions: string[]
  pendingResults: string[]
}

function readOutbox(): Outbox {
  if (typeof window === 'undefined') return { sessions: {}, results: {}, pendingSessions: [], pendingResults: [] }
  try {
    const raw = window.localStorage.getItem(OUTBOX_KEY)
    if (raw) return { sessions: {}, results: {}, pendingSessions: [], pendingResults: [], ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { sessions: {}, results: {}, pendingSessions: [], pendingResults: [] }
}

function writeOutbox(box: Outbox) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(box))
}

// ─── Row mappers ──────────────────────────────────────────────

function sessionToRow(s: ResearchSession) {
  return {
    id: s.id,
    journey_id: s.journeyId,
    journey_title: s.journeyTitle,
    tester_name: s.tester.name,
    tester_email: s.tester.email,
    consent: s.tester.consent,
    tester_profile: s.tester.profile ?? null,
    ip: s.ip,
    status: s.status,
    started_at: s.startedAt,
    finished_at: s.finishedAt,
    device: s.device,
    overall_rating: s.overallRating,
    overall_comments: s.overallComments,
    final_answers: s.finalAnswers,
    replay_url: s.replayUrl,
    reward_earned: s.rewardEarned,
  }
}

function rowToSession(r: Record<string, unknown>): ResearchSession {
  return {
    id: String(r.id),
    journeyId: String(r.journey_id),
    journeyTitle: String(r.journey_title),
    tester: { name: String(r.tester_name), email: String(r.tester_email), consent: Boolean(r.consent), profile: (r.tester_profile as ResearchSession['tester']['profile']) ?? undefined },
    ip: (r.ip as string | null) ?? null,
    status: r.status as ResearchSession['status'],
    startedAt: String(r.started_at),
    finishedAt: (r.finished_at as string | null) ?? null,
    device: (r.device as ResearchSession['device']) ?? { userAgent: '', viewport: '', isMobile: false },
    overallRating: (r.overall_rating as number | null) ?? null,
    overallComments: String(r.overall_comments ?? ''),
    finalAnswers: (r.final_answers as ResearchSession['finalAnswers']) ?? {},
    replayUrl: (r.replay_url as string | null) ?? null,
    rewardEarned: (r.reward_earned as boolean | null) ?? null,
  }
}

function resultToRow(t: TaskResult) {
  return {
    id: t.id,
    session_id: t.sessionId,
    task_id: t.taskId,
    task_index: t.taskIndex,
    instruction: t.instruction,
    outcome: t.outcome,
    detected_automatically: t.detectedAutomatically,
    started_at: t.startedAt,
    completed_at: t.completedAt,
    duration_ms: t.durationMs,
    ease_rating: t.easeRating,
    would_change: t.wouldChange,
    follow_up_answer: t.followUpAnswer,
    answers: t.answers,
    paths_visited: t.pathsVisited,
    events: t.events,
    replay_url: t.replayUrl,
  }
}

function rowToResult(r: Record<string, unknown>): TaskResult {
  return {
    id: String(r.id),
    sessionId: String(r.session_id),
    taskId: String(r.task_id),
    taskIndex: Number(r.task_index),
    instruction: String(r.instruction),
    outcome: r.outcome as TaskResult['outcome'],
    detectedAutomatically: Boolean(r.detected_automatically),
    startedAt: String(r.started_at),
    completedAt: String(r.completed_at),
    durationMs: Number(r.duration_ms),
    easeRating: (r.ease_rating as number | null) ?? null,
    wouldChange: String(r.would_change ?? ''),
    followUpAnswer: String(r.follow_up_answer ?? ''),
    answers: (r.answers as TaskResult['answers']) ?? {},
    pathsVisited: (r.paths_visited as string[]) ?? [],
    events: (r.events as TaskResult['events']) ?? [],
    replayUrl: (r.replay_url as string | null) ?? null,
  }
}

// ─── Writes ───────────────────────────────────────────────────

export async function saveSession(session: ResearchSession) {
  const box = readOutbox()
  box.sessions[session.id] = session
  if (!box.pendingSessions.includes(session.id)) box.pendingSessions.push(session.id)
  writeOutbox(box)
  void flushOutbox()
}

export async function saveTaskResult(result: TaskResult) {
  const box = readOutbox()
  box.results[result.id] = result
  if (!box.pendingResults.includes(result.id)) box.pendingResults.push(result.id)
  writeOutbox(box)
  void flushOutbox()
}

let flushing = false

/** Push anything pending to Supabase. Safe to call often. */
export async function flushOutbox(): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) return { ok: false, error: 'Supabase not configured' }
  if (flushing) return { ok: true }
  flushing = true
  try {
    const box = readOutbox()
    if (box.pendingSessions.length) {
      const rows = box.pendingSessions.map((id) => box.sessions[id]).filter(Boolean).map(sessionToRow)
      const { error } = await supabase.from('research_sessions').upsert(rows, { onConflict: 'id' })
      if (error) return { ok: false, error: error.message }
      box.pendingSessions = []
      writeOutbox(box)
    }
    if (box.pendingResults.length) {
      const rows = box.pendingResults.map((id) => box.results[id]).filter(Boolean).map(resultToRow)
      const { error } = await supabase.from('research_task_results').upsert(rows, { onConflict: 'id' })
      if (error) return { ok: false, error: error.message }
      box.pendingResults = []
      writeOutbox(box)
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'flush failed' }
  } finally {
    flushing = false
  }
}

// ─── Reads (admin) ────────────────────────────────────────────

export interface ResearchDataset {
  sessions: ResearchSession[]
  results: TaskResult[]
  /** 'supabase' when remote read succeeded, else 'local' with the reason. */
  source: 'supabase' | 'local'
  error?: string
  pendingCount: number
}

export async function loadDataset(): Promise<ResearchDataset> {
  const box = readOutbox()
  const pendingCount = box.pendingSessions.length + box.pendingResults.length
  const local: ResearchDataset = {
    sessions: Object.values(box.sessions),
    results: Object.values(box.results),
    source: 'local',
    pendingCount,
  }

  if (!isSupabaseConfigured() || !supabase) return { ...local, error: 'Supabase not configured' }

  await flushOutbox()
  const [s, r] = await Promise.all([
    supabase.from('research_sessions').select('*').order('started_at', { ascending: false }).limit(500),
    supabase.from('research_task_results').select('*').order('task_index', { ascending: true }).limit(5000),
  ])
  if (s.error || r.error) return { ...local, error: (s.error ?? r.error)?.message }

  // Merge: remote wins, but include anything still only local.
  const sessions = new Map<string, ResearchSession>()
  for (const row of s.data ?? []) sessions.set(String(row.id), rowToSession(row))
  for (const sess of local.sessions) if (!sessions.has(sess.id)) sessions.set(sess.id, sess)
  const results = new Map<string, TaskResult>()
  for (const row of r.data ?? []) results.set(String(row.id), rowToResult(row))
  for (const res of local.results) if (!results.has(res.id)) results.set(res.id, res)

  return {
    sessions: [...sessions.values()].sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    results: [...results.values()],
    source: 'supabase',
    pendingCount: readOutbox().pendingSessions.length + readOutbox().pendingResults.length,
  }
}

export async function deleteSession(id: string): Promise<void> {
  const box = readOutbox()
  delete box.sessions[id]
  for (const [rid, r] of Object.entries(box.results)) if (r.sessionId === id) delete box.results[rid]
  box.pendingSessions = box.pendingSessions.filter((x) => x !== id)
  box.pendingResults = box.pendingResults.filter((x) => box.results[x])
  writeOutbox(box)
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('research_sessions').delete().eq('id', id)
  }
}

// ─── Duplicate participants ───────────────────────────────────

/**
 * Has this person (same email, or same IP) already finished this campaign?
 * Checks Supabase when available, otherwise the local outbox.
 */
export async function findPriorSession(
  campaignId: string,
  opts: { email?: string; ip?: string | null }
): Promise<ResearchSession | null> {
  const email = opts.email?.trim().toLowerCase()
  const ip = opts.ip && !isLocalIp(opts.ip) ? opts.ip : null
  const matches = (s: ResearchSession) =>
    s.journeyId === campaignId &&
    s.status === 'completed' &&
    ((email && s.tester.email.trim().toLowerCase() === email) || (ip && s.ip === ip))

  if (isSupabaseConfigured() && supabase) {
    const q = supabase.from('research_sessions').select('*').eq('journey_id', campaignId).eq('status', 'completed')
    const ors: string[] = []
    if (email) ors.push(`tester_email.ilike.${email}`)
    if (ip) ors.push(`ip.eq.${ip}`)
    if (ors.length) {
      const { data, error } = await q.or(ors.join(',')).limit(1)
      if (!error && data?.length) return rowToSession(data[0])
    }
  }
  return Object.values(readOutbox().sessions).find(matches) ?? null
}

export function isLocalIp(ip: string | null | undefined) {
  return !ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === 'unknown'
}
