'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { IconAlertTriangle, IconClick, IconDeviceDesktop, IconDeviceMobile, IconGift, IconMicrophone, IconTrash, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { PLAYER_TYPES, type Campaign, type ResearchSession, type TaskResult } from '../types'
import { audioKey } from '../audio-storage'
import { suspicionFlags } from '../reward-rules'
import { ReplayPlayer } from './replay-player'

interface SessionModalProps {
  session: ResearchSession
  results: TaskResult[]
  campaign: Campaign | undefined
  onClose: () => void
  onDelete: () => void
}

/** Full session detail in a modal: participant, device, then task-by-task answers with audio. */
export function SessionModal({ session, results, campaign, onClose, onDelete }: SessionModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const flags = campaign ? suspicionFlags(campaign, results) : []
  const totalMs = session.finishedAt ? new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime() : null
  const labelFor = (taskId: string | null, qid: string) => {
    const task = campaign?.tasks.find((t) => t.id === taskId)
    return task?.questions.find((q) => q.id === qid)?.label ?? campaign?.finalQuestions.find((q) => q.id === qid)?.label ?? qid
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1c] text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-semibold">{session.tester.name}</h2>
              <SessionStatus status={session.status} />
            </div>
            <p className="truncate text-sm text-white/55">{session.tester.email}</p>
            {session.tester.profile && <PersonaLine profile={session.tester.profile} />}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
              {session.rewardEarned !== null && (
                <span className={cn('inline-flex items-center gap-1 font-medium', session.rewardEarned ? 'text-[#58cc83]' : 'text-amber-300')}>
                  <IconGift className="size-3.5" />
                  {session.rewardEarned ? 'Reward earned' : 'Reward withheld'}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                {session.device.isMobile ? <IconDeviceMobile className="size-3.5" /> : <IconDeviceDesktop className="size-3.5" />}
                {session.device.isMobile ? 'Mobile' : 'Desktop'} · {session.device.viewport}
              </span>
              <span>{fmtDate(session.startedAt)}</span>
              {totalMs !== null && <span>{fmtMs(totalMs)} total</span>}
              {session.ip && <span className="font-mono">{session.ip}</span>}
              <span className="font-mono text-white/30">{session.id}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => window.confirm('Delete this session and its results?') && onDelete()}
              aria-label="Delete session"
              className="flex size-8 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-[#ff6b6b]"
            >
              <IconTrash className="size-4" />
            </button>
            <button type="button" onClick={onClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white">
              <IconX className="size-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {flags.length > 0 && (
            <div className="border-b border-white/10 bg-amber-400/[0.06] px-5 py-3">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                <IconAlertTriangle className="size-3.5" />
                Check this session
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-amber-100/80">
                {flags.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </div>
          )}
          <ol className="divide-y divide-white/[0.06]">
            {results.length === 0 && <li className="px-5 py-8 text-sm text-white/45">No tasks recorded.</li>}
            {results.map((r) => (
              <li key={r.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold tabular-nums text-white/60">{r.taskIndex + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{r.instruction}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/55">
                      <OutcomePill outcome={r.outcome} />
                      <span className="tabular-nums">{fmtMs(r.durationMs)}</span>
                      {r.easeRating !== null && (
                        <span>
                          Ease <strong className="text-white">{r.easeRating}</strong>/5
                        </span>
                      )}
                      {r.detectedAutomatically && <span className="text-[#b7a8ff]">auto-detected</span>}
                    </div>
                    {r.pathsVisited.length > 1 && (
                      <p className="mt-1.5 truncate font-mono text-[11px] text-white/40" title={r.pathsVisited.join(' → ')}>
                        {r.pathsVisited.join(' → ')}
                      </p>
                    )}
                    <AnswerList answers={r.answers} labelFor={(qid) => labelFor(r.taskId, qid)} />
                    <ActivityLog result={r} />
                    {r.replayUrl && <ReplayPlayer url={r.replayUrl} label="Session replay" />}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {(Object.keys(session.finalAnswers ?? {}).length > 0 || session.overallRating !== null || session.overallComments) && (
            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Final questions</p>
              <AnswerList
                answers={Object.keys(session.finalAnswers ?? {}).length ? session.finalAnswers : { overall: session.overallRating ?? '', comments: session.overallComments }}
                labelFor={(qid) => labelFor(null, qid)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Pieces ───────────────────────────────────────────────────

/** One-line player persona from onboarding: "Casino · 25–34 · London · $50–$200/mo · loves live blackjack". */
function PersonaLine({ profile }: { profile: NonNullable<ResearchSession['tester']['profile']> }) {
  const plays = PLAYER_TYPES.find((t) => t.id === profile.plays)?.label
  const bits = [plays, profile.age, profile.location, profile.monthlyDeposit ? `${profile.monthlyDeposit}/mo` : null].filter(Boolean)
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
      {bits.map((b) => (
        <span key={String(b)} className="rounded bg-[#7c5cff]/15 px-1.5 py-0.5 font-medium text-[#b7a8ff]">
          {b}
        </span>
      ))}
      {profile.favourite && <span className="text-white/50">loves {profile.favourite}</span>}
      {profile.hobbies && <span className="text-white/35">· {profile.hobbies}</span>}
    </div>
  )
}

/** Compact, expandable list of what the tester did during a task. */
function ActivityLog({ result }: { result: TaskResult }) {
  const [open, setOpen] = useState(false)
  const events = result.events ?? []
  const clicks = events.filter((e) => e.type === 'click').length
  const navs = events.filter((e) => e.type === 'nav').length - 1
  const scroll = Math.max(0, ...events.filter((e) => e.type === 'scroll').map((e) => Number(e.value) || 0))
  if (!events.length) return <p className="mt-2 text-[11px] text-white/35">No interaction data recorded for this task.</p>
  return (
    <div className="mt-2">
      <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-2 text-[11px] text-white/55 hover:text-white">
        <IconClick className="size-3.5" />
        {clicks} click{clicks === 1 ? '' : 's'}
        {navs > 0 && ` · ${navs} page change${navs === 1 ? '' : 's'}`}
        {scroll > 0 && ` · scrolled ${Math.round(scroll * 100)}%`}
        <span className="text-white/35">{open ? '▴ hide' : '▾ show'}</span>
      </button>
      {open && (
        <ol className="mt-1.5 max-h-56 space-y-0.5 overflow-y-auto rounded-lg bg-black/30 p-2 font-mono text-[11px] leading-relaxed text-white/70">
          {events.map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-12 shrink-0 text-right tabular-nums text-white/35">{(e.t / 1000).toFixed(1)}s</span>
              <span
                className={cn(
                  'w-12 shrink-0 uppercase',
                  e.type === 'click' && 'text-[#b7a8ff]',
                  e.type === 'nav' && 'text-[#58cc83]',
                  e.type === 'scroll' && 'text-white/40',
                  e.type === 'input' && 'text-amber-300'
                )}
              >
                {e.type}
              </span>
              <span className="min-w-0 truncate">
                {e.type === 'nav' ? e.path : e.type === 'scroll' ? `${Math.round((Number(e.value) || 0) * 100)}%` : e.type === 'key' ? String(e.value) : e.target}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function AnswerList({ answers, labelFor }: { answers: Record<string, unknown>; labelFor: (qid: string) => string }) {
  const entries = Object.entries(answers ?? {}).filter(([k, v]) => !k.endsWith(':audio') && v !== '' && v !== undefined && v !== null)
  if (!entries.length) return null
  return (
    <div className="mt-2 space-y-2">
      {entries.map(([k, v]) => {
        const audio = answers[audioKey(k)]
        return (
          <div key={k} className="rounded-lg border-l-2 border-[#7c5cff]/60 bg-white/[0.03] px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{labelFor(k)}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-white/85">
              {typeof v === 'number' ? (
                <>
                  <strong>{v}</strong>/5
                </>
              ) : typeof v === 'boolean' ? (
                v ? 'Yes' : 'No'
              ) : (
                String(v)
              )}
            </p>
            {typeof audio === 'string' && (
              <div className="mt-1.5 flex items-center gap-2">
                <IconMicrophone className="size-3.5 shrink-0 text-[#b7a8ff]" />
                <audio controls preload="none" src={audio} className="h-8 w-full max-w-sm" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function SessionStatus({ status }: { status: ResearchSession['status'] }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        status === 'completed' && 'bg-[#1fae4b]/15 text-[#58cc83]',
        status === 'in_progress' && 'bg-amber-400/15 text-amber-300',
        status === 'abandoned' && 'bg-white/10 text-white/55'
      )}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

export function OutcomePill({ outcome }: { outcome: TaskResult['outcome'] }) {
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        outcome === 'completed' && 'bg-[#1fae4b]/15 text-[#58cc83]',
        outcome === 'skipped' && 'bg-white/10 text-white/60',
        outcome === 'gave_up' && 'bg-[#ee3536]/15 text-[#ff6b6b]'
      )}
    >
      {outcome.replace('_', ' ')}
    </span>
  )
}

export const fmtDate = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
export const fmtMs = (ms: number) => {
  const s = Math.round(ms / 1000)
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${(s % 60).toString().padStart(2, '0')}s`
}
