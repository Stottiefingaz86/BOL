'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { IconArrowLeft, IconCloud, IconCloudOff, IconDeviceDesktop, IconDeviceMobile, IconDownload, IconMicrophone, IconRefresh, IconUsers } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { listCampaigns } from '@/components/research/campaign-storage'
import { deleteSession, isLocalIp, loadDataset, type ResearchDataset } from '@/components/research/research-storage'
import { AGE_BANDS, DEPOSIT_BANDS, PLAYER_TYPES, type Campaign, type ResearchSession, type TaskResult } from '@/components/research/types'
import { RButton } from '@/components/research/ui'
import { StatusBadge } from '@/components/research/admin/status-badge'
import { SessionModal, SessionStatus, fmtDate, fmtMs } from '@/components/research/admin/session-modal'
import { SynthesisPanel } from '@/components/research/admin/synthesis-panel'
import { suspicionFlags } from '@/components/research/reward-rules'
import { IconAlertTriangle, IconGift } from '@tabler/icons-react'

export default function ResearchAdminPage() {
  return (
    <Suspense fallback={<main className="p-12 text-sm text-white/50">Loading…</main>}>
      <ResultsPage />
    </Suspense>
  )
}

function ResultsPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [data, setData] = useState<ResearchDataset | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    const [ds, cl] = await Promise.all([loadDataset(), listCampaigns()])
    setData(ds)
    setCampaigns(cl.campaigns)
    setLoading(false)
  }
  useEffect(() => {
    void refresh()
  }, [])

  // Campaign filter: ?campaign=<id>, defaulting to the live one (or the first with data).
  const campaignId = useMemo(() => {
    const q = params.get('campaign')
    if (q) return q
    return campaigns.find((c) => c.status === 'live')?.id ?? campaigns[0]?.id ?? 'all'
  }, [params, campaigns])
  const setCampaignId = (id: string) => router.replace(id === 'all' ? '/research/admin' : `/research/admin?campaign=${id}`)
  const campaign = campaigns.find((c) => c.id === campaignId)

  const sessions = useMemo(() => (data?.sessions ?? []).filter((s) => campaignId === 'all' || s.journeyId === campaignId), [data, campaignId])
  const sessionIds = useMemo(() => new Set(sessions.map((s) => s.id)), [sessions])
  const results = useMemo(() => (data?.results ?? []).filter((r) => sessionIds.has(r.sessionId)), [data, sessionIds])
  const participants = useMemo(() => groupParticipants(sessions), [sessions])
  const selectedSession = sessions.find((s) => s.id === selected) ?? null

  // KPIs
  const completed = sessions.filter((s) => s.status === 'completed')
  const completionRate = sessions.length ? completed.length / sessions.length : null
  const avgEase = mean(results.map((r) => r.easeRating).filter(isNum))
  const medianMin = median(completed.filter((s) => s.finishedAt).map((s) => new Date(s.finishedAt!).getTime() - new Date(s.startedAt).getTime()))
  const voiceCount = results.reduce((n, r) => n + Object.keys(r.answers ?? {}).filter((k) => k.endsWith(':audio')).length, 0)

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/research" className="flex size-9 items-center justify-center rounded-full border border-white/15 hover:bg-white/[0.06]">
            <IconArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Results</h1>
            <p className="flex items-center gap-2 text-xs text-white/50">
              {data?.source === 'supabase' ? (
                <span className="inline-flex items-center gap-1"><IconCloud className="size-3.5 text-[#58cc83]" /> Supabase</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-300/90"><IconCloudOff className="size-3.5" /> Local only{data?.error ? ` · ${data.error}` : ''}</span>
              )}
              {data && data.pendingCount > 0 && <span className="text-amber-300">· {data.pendingCount} unsynced</span>}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)} className="h-10 max-w-[280px] rounded-lg border border-white/15 bg-[#1c1c1c] px-3 text-sm outline-none">
            <option value="all">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}{c.status === 'live' ? ' · live' : ''}
              </option>
            ))}
          </select>
          <RButton variant="outline" onClick={refresh} disabled={loading}>
            <IconRefresh className={cn('size-4', loading && 'animate-spin')} />
            Refresh
          </RButton>
          <RButton variant="outline" onClick={() => downloadCsv(sessions, results)} disabled={!results.length}>
            <IconDownload className="size-4" />
            CSV
          </RButton>
        </div>
      </header>

      {campaign && (
        <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
          <StatusBadge status={campaign.status} />
          <span>{campaign.title}</span>
          <span className="text-white/30">·</span>
          <Link href={`/research/campaigns/${campaign.id}`} className="text-[#b7a8ff] hover:underline">
            Edit campaign
          </Link>
        </div>
      )}

      {/* KPIs */}
      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi label="Participants" value={String(participants.length)} sub={sessions.length !== participants.length ? `${sessions.length} sessions` : undefined} />
        <Kpi label="Completed" value={completionRate !== null ? `${Math.round(completionRate * 100)}%` : '–'} sub={`${completed.length} of ${sessions.length}`} tone={completionRate === null ? undefined : completionRate >= 0.8 ? 'good' : completionRate >= 0.5 ? 'warn' : 'bad'} />
        <Kpi label="Avg ease" value={avgEase !== null ? `${avgEase.toFixed(1)}/5` : '–'} tone={avgEase === null ? undefined : avgEase >= 4 ? 'good' : avgEase >= 3 ? 'warn' : 'bad'} />
        <Kpi label="Median time" value={medianMin ? fmtMs(medianMin) : '–'} sub="completed sessions" />
        <Kpi label="Voice answers" value={String(voiceCount)} icon={<IconMicrophone className="size-3.5" />} />
      </section>

      {/* AI synthesis */}
      {campaign && <SynthesisPanel campaign={campaign} sessions={sessions} results={results} />}

      {/* Personas */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45">Who took part</h2>
        <Personas sessions={participants.map((p) => p.sessions[0])} />
      </section>

      {/* Per-task */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45">By task</h2>
        <TaskAggregates results={results} />
      </section>

      {/* Participants */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-white/45">
            <IconUsers className="size-4" />
            Participants
          </h2>
          <p className="text-xs text-white/40">Grouped by email / IP · click a row for the full session</p>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1c]">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wide text-white/45">
              <tr className="border-b border-white/10">
                <th className="px-4 py-2.5 font-medium">Participant</th>
                <th className="px-3 py-2.5 font-medium">When</th>
                <th className="px-3 py-2.5 font-medium">Device</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 text-right font-medium">Tasks</th>
                <th className="px-3 py-2.5 text-right font-medium">Ease</th>
                <th className="px-3 py-2.5 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {participants.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-white/45">
                    {loading ? 'Loading…' : 'No sessions yet. Share the tester link from the campaigns page.'}
                  </td>
                </tr>
              )}
              {participants.map((p) =>
                p.sessions.map((s, i) => {
                  const sr = results.filter((r) => r.sessionId === s.id)
                  const avg = mean(sr.map((r) => r.easeRating).filter(isNum))
                  const total = s.finishedAt ? new Date(s.finishedAt).getTime() - new Date(s.startedAt).getTime() : null
                  const taskTotal = campaigns.find((c) => c.id === s.journeyId)?.tasks.length
                  return (
                    <tr key={s.id} onClick={() => setSelected(s.id)} className="cursor-pointer transition-colors hover:bg-white/[0.04]">
                      <td className="px-4 py-2.5">
                        {i === 0 ? (
                          <>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-white/50">
                              {p.email}
                              {p.sessions.length > 1 && <span className="ml-2 rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">{p.sessions.length} sessions</span>}
                            </p>
                          </>
                        ) : (
                          <p className="pl-3 text-xs text-white/40">↳ repeat attempt</p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-white/70">{fmtDate(s.startedAt)}</td>
                      <td className="px-3 py-2.5 text-white/70">
                        <span className="inline-flex items-center gap-1">
                          {s.device.isMobile ? <IconDeviceMobile className="size-3.5" /> : <IconDeviceDesktop className="size-3.5" />}
                          {s.device.isMobile ? 'Mobile' : 'Desktop'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          <SessionStatus status={s.status} />
                          {(() => {
                            const c = campaigns.find((x) => x.id === s.journeyId)
                            const flags = c && s.status === 'completed' ? suspicionFlags(c, sr) : []
                            return flags.length ? (
                              <span title={flags.join('\n')} className="inline-flex items-center gap-0.5 rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                                <IconAlertTriangle className="size-3" />
                                {flags.length}
                              </span>
                            ) : null
                          })()}
                          {s.rewardEarned && <IconGift className="size-3.5 text-[#58cc83]" title="Reward earned" />}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-white/70">{sr.length}{taskTotal ? `/${taskTotal}` : ''}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{avg !== null ? <EaseChip value={avg} /> : <span className="text-white/35">–</span>}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-white/70">{total !== null ? fmtMs(total) : '–'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          results={results.filter((r) => r.sessionId === selectedSession.id).sort((a, b) => a.taskIndex - b.taskIndex)}
          campaign={campaigns.find((c) => c.id === selectedSession.journeyId)}
          onClose={() => setSelected(null)}
          onDelete={async () => {
            await deleteSession(selectedSession.id)
            setSelected(null)
            await refresh()
          }}
        />
      )}
    </main>
  )
}

// ─── Pieces ───────────────────────────────────────────────────

function Kpi({ label, value, sub, tone, icon }: { label: string; value: string; sub?: string; tone?: 'good' | 'warn' | 'bad'; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3">
      <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/40">
        {icon}
        {label}
      </p>
      <p className={cn('mt-1 text-2xl font-semibold tabular-nums', tone === 'good' && 'text-[#58cc83]', tone === 'warn' && 'text-amber-300', tone === 'bad' && 'text-[#ff6b6b]')}>{value}</p>
      {sub && <p className="text-xs text-white/40">{sub}</p>}
    </div>
  )
}

/** Persona breakdown from onboarding answers — one bar chart per dimension. */
function Personas({ sessions }: { sessions: ResearchSession[] }) {
  const profiles = sessions.map((s) => s.tester.profile).filter((p): p is NonNullable<ResearchSession['tester']['profile']> => Boolean(p))
  if (!profiles.length) {
    return <p className="mt-3 rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-white/40">No persona data yet — collected in the onboarding steps.</p>
  }
  const count = (pick: (p: (typeof profiles)[number]) => string | null | undefined, order?: readonly string[]) => {
    const m = new Map<string, number>()
    profiles.forEach((p) => {
      const k = pick(p)
      if (k) m.set(k, (m.get(k) ?? 0) + 1)
    })
    const keys = order ? order.filter((k) => m.has(k)) : [...m.keys()].sort((a, b) => (m.get(b) ?? 0) - (m.get(a) ?? 0))
    return keys.map((k) => ({ label: k, n: m.get(k) ?? 0 }))
  }
  const dims = [
    { title: 'Plays', rows: count((p) => PLAYER_TYPES.find((t) => t.id === p.plays)?.label, PLAYER_TYPES.map((t) => t.label)) },
    { title: 'Age', rows: count((p) => p.age, AGE_BANDS) },
    { title: 'Deposits / month', rows: count((p) => p.monthlyDeposit, DEPOSIT_BANDS) },
    { title: 'Location', rows: count((p) => p.location.trim() || null).slice(0, 6) },
  ]
  const favourites = profiles.map((p) => p.favourite.trim()).filter(Boolean)
  const hobbies = profiles.map((p) => p.hobbies.trim()).filter(Boolean)
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {dims.map((d) => (
        <div key={d.title} className="rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{d.title}</p>
          <ul className="mt-2 space-y-1.5">
            {d.rows.length === 0 && <li className="text-xs text-white/35">—</li>}
            {d.rows.map((r) => (
              <li key={r.label} className="text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-white/75">{r.label}</span>
                  <span className="tabular-nums text-white/45">{r.n}</span>
                </div>
                <div className="mt-0.5 h-1 rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-[#7c5cff]" style={{ width: `${(r.n / profiles.length) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {(favourites.length > 0 || hobbies.length > 0) && (
        <div className="rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 md:col-span-2 xl:col-span-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">Favourite things to do</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {favourites.map((f, i) => (
                  <span key={i} className="rounded-full bg-[#7c5cff]/15 px-2 py-0.5 text-xs text-[#b7a8ff]">{f}</span>
                ))}
                {!favourites.length && <span className="text-xs text-white/35">—</span>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">Hobbies</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {hobbies.map((h, i) => (
                  <span key={i} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/70">{h}</span>
                ))}
                {!hobbies.length && <span className="text-xs text-white/35">—</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EaseChip({ value }: { value: number }) {
  return (
    <span className={cn('rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums', value >= 4 ? 'bg-[#1fae4b]/15 text-[#58cc83]' : value >= 3 ? 'bg-amber-400/15 text-amber-300' : 'bg-[#ee3536]/15 text-[#ff6b6b]')}>
      {value.toFixed(1)}
    </span>
  )
}

function TaskAggregates({ results }: { results: TaskResult[] }) {
  const groups = useMemo(() => {
    const m = new Map<string, TaskResult[]>()
    for (const r of results) m.set(r.taskId, [...(m.get(r.taskId) ?? []), r])
    return [...m.entries()]
      .map(([taskId, rs]) => ({
        taskId,
        instruction: rs[0].instruction,
        index: rs[0].taskIndex,
        n: rs.length,
        completion: rs.filter((r) => r.outcome === 'completed').length / rs.length,
        gaveUp: rs.filter((r) => r.outcome === 'gave_up').length,
        auto: rs.filter((r) => r.detectedAutomatically).length,
        ease: mean(rs.map((r) => r.easeRating).filter(isNum)),
        medianMs: median(rs.map((r) => r.durationMs)),
        comments: rs.filter((r) => r.wouldChange || Object.keys(r.answers ?? {}).some((k) => k.endsWith(':audio'))).length,
      }))
      .sort((a, b) => a.index - b.index)
  }, [results])

  if (!groups.length) return <p className="mt-3 text-sm text-white/45">No task data yet.</p>

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1c]">
      <table className="w-full text-sm">
        <thead className="text-left text-[11px] uppercase tracking-wide text-white/45">
          <tr className="border-b border-white/10">
            <th className="px-4 py-2.5 font-medium">Task</th>
            <th className="px-3 py-2.5 text-right font-medium">n</th>
            <th className="px-3 py-2.5 text-right font-medium">Completed</th>
            <th className="px-3 py-2.5 text-right font-medium">Gave up</th>
            <th className="px-3 py-2.5 text-right font-medium">Ease</th>
            <th className="px-3 py-2.5 text-right font-medium">Median time</th>
            <th className="px-3 py-2.5 text-right font-medium">Comments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {groups.map((g) => (
            <tr key={g.taskId}>
              <td className="px-4 py-2.5">
                <span className="mr-2 tabular-nums text-white/35">{g.index + 1}.</span>
                {g.instruction}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-white/70">{g.n}</td>
              <td className="px-3 py-2.5 text-right">
                <span className={cn('rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums', g.completion >= 0.8 ? 'bg-[#1fae4b]/15 text-[#58cc83]' : g.completion >= 0.5 ? 'bg-amber-400/15 text-amber-300' : 'bg-[#ee3536]/15 text-[#ff6b6b]')}>
                  {Math.round(g.completion * 100)}%
                </span>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-white/70">{g.gaveUp || '–'}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{g.ease !== null ? <EaseChip value={g.ease} /> : <span className="text-white/35">–</span>}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-white/70">{fmtMs(g.medianMs)}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-white/70">{g.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Participants (de-dupe by email, then IP) ─────────────────

interface Participant {
  key: string
  name: string
  email: string
  sessions: ResearchSession[]
}

function groupParticipants(sessions: ResearchSession[]): Participant[] {
  const byKey = new Map<string, Participant>()
  const ipToKey = new Map<string, string>()
  const sorted = [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  for (const s of sorted) {
    const email = s.tester.email.trim().toLowerCase()
    let key = email || (s.ip && !isLocalIp(s.ip) ? `ip:${s.ip}` : s.id)
    if (s.ip && !isLocalIp(s.ip)) {
      const existing = ipToKey.get(s.ip)
      if (existing && existing !== key && !byKey.has(key)) key = existing
      else ipToKey.set(s.ip, key)
    }
    const p = byKey.get(key) ?? { key, name: s.tester.name, email: s.tester.email, sessions: [] }
    p.sessions.push(s)
    byKey.set(key, p)
  }
  return [...byKey.values()]
}

// ─── Utils ────────────────────────────────────────────────────

const isNum = (v: number | null): v is number => typeof v === 'number'
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)
const median = (xs: number[]) => {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

function downloadCsv(sessions: ResearchSession[], results: TaskResult[]) {
  const byId = new Map(sessions.map((s) => [s.id, s]))
  const head = [
    'session_id', 'campaign', 'tester_name', 'tester_email', 'plays', 'age', 'location', 'monthly_deposit', 'favourite', 'hobbies', 'ip', 'device', 'session_status', 'session_started',
    'task_index', 'task_id', 'instruction', 'outcome', 'auto_detected', 'duration_s', 'ease_rating',
    'answers', 'audio_urls', 'paths', 'overall_rating', 'final_answers',
  ]
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = results
    .sort((a, b) => a.sessionId.localeCompare(b.sessionId) || a.taskIndex - b.taskIndex)
    .map((r) => {
      const s = byId.get(r.sessionId)
      const text = Object.entries(r.answers ?? {}).filter(([k]) => !k.endsWith(':audio')).map(([k, v]) => `${k}: ${v}`).join(' | ')
      const audio = Object.entries(r.answers ?? {}).filter(([k]) => k.endsWith(':audio')).map(([, v]) => v).join(' ')
      const finals = Object.entries(s?.finalAnswers ?? {}).filter(([k]) => !k.endsWith(':audio')).map(([k, v]) => `${k}: ${v}`).join(' | ')
      return [
        r.sessionId, s?.journeyTitle, s?.tester.name, s?.tester.email, s?.tester.profile?.plays ?? '', s?.tester.profile?.age ?? '', s?.tester.profile?.location ?? '', s?.tester.profile?.monthlyDeposit ?? '', s?.tester.profile?.favourite ?? '', s?.tester.profile?.hobbies ?? '', s?.ip ?? '', s?.device.isMobile ? 'mobile' : 'desktop', s?.status, s?.startedAt,
        r.taskIndex + 1, r.taskId, r.instruction, r.outcome, r.detectedAutomatically, Math.round(r.durationMs / 1000), r.easeRating ?? '',
        text, audio, r.pathsVisited.join(' > '), s?.overallRating ?? '', finals,
      ].map(esc).join(',')
    })
  const blob = new Blob([[head.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `research-results-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
