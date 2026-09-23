'use client'

import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { SEED_CAMPAIGNS } from './journeys'
import type { Campaign } from './types'

/**
 * Campaign persistence. Supabase (`research_campaigns`) with a localStorage mirror so the editor
 * and the overlay keep working before the migration has been run. Only one campaign may be live.
 */

const LOCAL_KEY = 'research:campaigns:v1'
const SEEDED_KEY = 'research:campaigns:seeded'

function readLocal(): Campaign[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as Campaign[]) : []
  } catch {
    return []
  }
}

function writeLocal(list: Campaign[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
}

function toRow(c: Campaign) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    status: c.status,
    start_path: c.startPath,
    estimated_minutes: c.estimatedMinutes,
    tasks: c.tasks,
    final_questions: c.finalQuestions,
    outro: c.outro,
    reward: c.reward,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  }
}

function fromRow(r: Record<string, unknown>): Campaign {
  return {
    id: String(r.id),
    title: String(r.title),
    description: String(r.description ?? ''),
    status: r.status as Campaign['status'],
    startPath: String(r.start_path ?? '/'),
    estimatedMinutes: Number(r.estimated_minutes ?? 5),
    tasks: (r.tasks as Campaign['tasks']) ?? [],
    finalQuestions: (r.final_questions as Campaign['finalQuestions']) ?? [],
    outro: String(r.outro ?? ''),
    reward: (r.reward as Campaign['reward']) ?? null,
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  }
}

const remote = () => (isSupabaseConfigured() && supabase ? supabase : null)

async function seedIfEmpty(list: Campaign[]): Promise<Campaign[]> {
  if (list.length) return list
  if (typeof window !== 'undefined' && window.localStorage.getItem(SEEDED_KEY)) return list
  for (const c of SEED_CAMPAIGNS) await saveCampaign(c)
  if (typeof window !== 'undefined') window.localStorage.setItem(SEEDED_KEY, '1')
  return readLocal()
}

export interface CampaignList {
  campaigns: Campaign[]
  source: 'supabase' | 'local'
  error?: string
}

export async function listCampaigns(): Promise<CampaignList> {
  const sb = remote()
  if (sb) {
    const { data, error } = await sb.from('research_campaigns').select('*').order('updated_at', { ascending: false })
    if (!error) {
      const campaigns = (data ?? []).map(fromRow)
      // Mirror remote → local so the overlay can resolve campaigns offline-ish.
      writeLocal(campaigns)
      return { campaigns: await seedIfEmpty(campaigns), source: 'supabase' }
    }
    return { campaigns: await seedIfEmpty(readLocal()), source: 'local', error: error.message }
  }
  return { campaigns: await seedIfEmpty(readLocal()), source: 'local', error: 'Supabase not configured' }
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const local = readLocal().find((c) => c.id === id)
  const sb = remote()
  if (sb) {
    const { data, error } = await sb.from('research_campaigns').select('*').eq('id', id).maybeSingle()
    if (!error && data) return fromRow(data)
  }
  if (local) return local
  // Fresh device with no reachable remote: fall back to the seeded campaigns so a tester link still works.
  const seeded = await seedIfEmpty(readLocal())
  return seeded.find((c) => c.id === id) ?? null
}

export async function getLiveCampaign(): Promise<Campaign | null> {
  const { campaigns } = await listCampaigns()
  return campaigns.find((c) => c.status === 'live') ?? null
}

export async function saveCampaign(campaign: Campaign): Promise<{ ok: boolean; error?: string }> {
  const c: Campaign = { ...campaign, updatedAt: new Date().toISOString() }
  const list = readLocal()
  const idx = list.findIndex((x) => x.id === c.id)
  if (idx >= 0) list[idx] = c
  else list.unshift(c)
  writeLocal(list)

  const sb = remote()
  if (!sb) return { ok: false, error: 'Supabase not configured' }
  const { error } = await sb.from('research_campaigns').upsert(toRow(c), { onConflict: 'id' })
  return error ? { ok: false, error: error.message } : { ok: true }
}

/** Make one campaign live; whatever was live becomes `ended`. */
export async function setLiveCampaign(id: string): Promise<void> {
  const { campaigns } = await listCampaigns()
  for (const c of campaigns) {
    if (c.id === id && c.status !== 'live') await saveCampaign({ ...c, status: 'live' })
    else if (c.id !== id && c.status === 'live') await saveCampaign({ ...c, status: 'ended' })
  }
}

export async function setCampaignStatus(id: string, status: Campaign['status']): Promise<void> {
  if (status === 'live') return setLiveCampaign(id)
  const c = await getCampaign(id)
  if (c) await saveCampaign({ ...c, status })
}

export async function deleteCampaign(id: string): Promise<void> {
  writeLocal(readLocal().filter((c) => c.id !== id))
  const sb = remote()
  if (sb) await sb.from('research_campaigns').delete().eq('id', id)
}
