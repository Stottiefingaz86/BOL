'use client'

import { useEffect, useState } from 'react'
import { IconAlertTriangle, IconCheck, IconLoader2, IconSparkles, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { Campaign, ResearchSession, TaskResult } from '../types'
import { RButton } from '../ui'

export interface SynthesisReport {
  headline: string
  verdict: 'pass' | 'pass_with_issues' | 'fail' | 'inconclusive'
  verdictReason: string
  summary: string
  metrics: { participants: number; completionRate: number; avgEase: number | null; medianMinutes: number | null }
  taskFindings: {
    taskId: string
    instruction: string
    severity: 'none' | 'low' | 'medium' | 'high' | 'critical'
    whatHappened: string
    whyItMatters: string
    quotes: string[]
    recommendation: string
  }[]
  themes: { title: string; detail: string; evidence: string[] }[]
  positives: string[]
  recommendations: { priority: 'now' | 'next' | 'later'; action: string; rationale: string }[]
  openQuestions: string[]
  confidence: 'low' | 'medium' | 'high'
  confidenceReason: string
}

interface Stored {
  report: SynthesisReport
  meta: { model: string; generatedAt: string; sessions: number; results: number }
}

const key = (campaignId: string) => `research:synthesis:${campaignId}`

/** "Synthesise with AI" — generates and caches a structured write-up for one campaign. */
export function SynthesisPanel({ campaign, sessions, results }: { campaign: Campaign; sessions: ResearchSession[]; results: TaskResult[] }) {
  const [stored, setStored] = useState<Stored | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setStored(JSON.parse(localStorage.getItem(key(campaign.id)) ?? 'null'))
    } catch {
      setStored(null)
    }
    setError(null)
  }, [campaign.id])

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/research/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign, sessions, results }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      const next: Stored = { report: json.report, meta: json.meta }
      localStorage.setItem(key(campaign.id), JSON.stringify(next))
      setStored(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Synthesis failed')
    } finally {
      setLoading(false)
    }
  }

  const stale = stored && (stored.meta.sessions !== sessions.length || stored.meta.results !== results.length)

  return (
    <section className="mt-8 rounded-2xl border border-[#7c5cff]/35 bg-gradient-to-br from-[#7c5cff]/[0.12] to-transparent p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#c9bfff]">
            <IconSparkles className="size-4" />
            AI synthesis
          </h2>
          <p className="mt-1 text-xs text-white/50">
            {stored
              ? `Generated ${new Date(stored.meta.generatedAt).toLocaleString('en-GB')} from ${stored.meta.sessions} participants · ${stored.meta.model}${stale ? ' · new data since — regenerate' : ''}`
              : 'Reads every answer, timing and path, then writes up findings, a verdict and recommendations.'}
          </p>
        </div>
        <RButton onClick={run} disabled={loading || results.length === 0}>
          {loading ? <IconLoader2 className="size-4 animate-spin" /> : <IconSparkles className="size-4" />}
          {loading ? 'Synthesising…' : stored ? 'Regenerate' : 'Synthesise results'}
        </RButton>
      </div>

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          <IconAlertTriangle className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {stored && <Report report={stored.report} />}
    </section>
  )
}

// ─── Report rendering ─────────────────────────────────────────

const VERDICT: Record<SynthesisReport['verdict'], { label: string; cls: string }> = {
  pass: { label: 'Pass', cls: 'bg-[#1fae4b]/20 text-[#58cc83] border-[#1fae4b]/40' },
  pass_with_issues: { label: 'Pass with issues', cls: 'bg-amber-400/15 text-amber-300 border-amber-400/40' },
  fail: { label: 'Fail', cls: 'bg-[#ee3536]/15 text-[#ff6b6b] border-[#ee3536]/40' },
  inconclusive: { label: 'Inconclusive', cls: 'bg-white/10 text-white/70 border-white/20' },
}

const SEVERITY: Record<string, string> = {
  none: 'bg-white/10 text-white/50',
  low: 'bg-[#1fae4b]/15 text-[#58cc83]',
  medium: 'bg-amber-400/15 text-amber-300',
  high: 'bg-orange-500/20 text-orange-300',
  critical: 'bg-[#ee3536]/20 text-[#ff6b6b]',
}

const PRIORITY: Record<string, string> = {
  now: 'bg-[#ee3536]/20 text-[#ff6b6b]',
  next: 'bg-amber-400/15 text-amber-300',
  later: 'bg-white/10 text-white/55',
}

function Report({ report }: { report: SynthesisReport }) {
  const v = VERDICT[report.verdict] ?? VERDICT.inconclusive
  return (
    <div className="mt-5 space-y-6">
      {/* Headline + verdict */}
      <div className="rounded-xl border border-white/10 bg-[#1c1c1c] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-2xl text-lg font-semibold leading-snug">{report.headline}</p>
          <span className={cn('shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide', v.cls)}>{v.label}</span>
        </div>
        <p className="mt-2 text-sm text-white/70">{report.verdictReason}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi label="Participants" value={String(report.metrics.participants)} />
          <Kpi label="Completion" value={`${Math.round(report.metrics.completionRate * (report.metrics.completionRate <= 1 ? 100 : 1))}%`} />
          <Kpi label="Avg ease" value={report.metrics.avgEase !== null ? `${report.metrics.avgEase.toFixed(1)}/5` : '–'} />
          <Kpi label="Median time" value={report.metrics.medianMinutes !== null ? `${report.metrics.medianMinutes} min` : '–'} />
        </div>
        <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/80">{report.summary}</div>
        <p className="mt-3 text-xs text-white/45">
          Confidence: <span className="font-semibold text-white/70">{report.confidence}</span> — {report.confidenceReason}
        </p>
      </div>

      {/* Per task */}
      <Block title="Task by task">
        <ol className="divide-y divide-white/[0.06]">
          {report.taskFindings.map((f, i) => (
            <li key={f.taskId ?? i} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/35 tabular-nums">{i + 1}.</span>
                <p className="font-medium">{f.instruction}</p>
                <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide', SEVERITY[f.severity] ?? SEVERITY.none)}>{f.severity}</span>
              </div>
              <p className="mt-2 text-sm text-white/80">{f.whatHappened}</p>
              <p className="mt-1 text-sm text-white/55">{f.whyItMatters}</p>
              {f.quotes?.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {f.quotes.map((q, j) => (
                    <li key={j} className="border-l-2 border-[#7c5cff]/60 pl-3 text-sm italic text-white/70">
                      {q}
                    </li>
                  ))}
                </ul>
              )}
              {f.recommendation && (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-[#c9bfff]">
                  <IconCheck className="mt-0.5 size-4 shrink-0" />
                  {f.recommendation}
                </p>
              )}
            </li>
          ))}
        </ol>
      </Block>

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Themes">
          <ul className="space-y-3">
            {report.themes.map((t, i) => (
              <li key={i}>
                <p className="text-sm font-medium">{t.title}</p>
                <p className="mt-0.5 text-sm text-white/65">{t.detail}</p>
                {t.evidence?.length > 0 && <p className="mt-1 text-xs text-white/40">{t.evidence.join(' · ')}</p>}
              </li>
            ))}
          </ul>
        </Block>
        <Block title="What worked">
          <ul className="space-y-1.5">
            {report.positives.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                <IconCheck className="mt-0.5 size-4 shrink-0 text-[#58cc83]" />
                {p}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <Block title="Recommendations">
        <ul className="space-y-2">
          {report.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={cn('mt-0.5 w-12 shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide', PRIORITY[r.priority] ?? PRIORITY.later)}>{r.priority}</span>
              <div>
                <p className="text-sm font-medium">{r.action}</p>
                <p className="text-sm text-white/55">{r.rationale}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      {report.openQuestions?.length > 0 && (
        <Block title="Open questions / test next">
          <ul className="space-y-1.5">
            {report.openQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                <IconX className="mt-0.5 size-4 shrink-0 rotate-45 text-white/35" />
                {q}
              </li>
            ))}
          </ul>
        </Block>
      )}
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1c1c1c] p-5">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-white/45">{title}</h3>
      {children}
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}
