'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconCheck, IconChevronDown, IconChevronUp, IconFlask, IconGripVertical, IconPlayerSkipForward, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { Answers, Campaign, TaskOutcome, TaskQuestion } from '../types'
import { useResearchStore } from '../research-store'
import { RButton, RLabel, RProgress, RRating, RTextarea } from '../ui'
import { RewardCard } from './reward-card'
import { VoiceAnswer } from './voice-answer'
import { audioKey } from '../audio-storage'

interface TaskWidgetProps {
  campaign: Campaign
  onExit: () => void
}

/**
 * The floating tester panel. Bottom-left on desktop (draggable), bottom sheet on mobile.
 * Renders the current phase: task → feedback → summary → done.
 */
export function TaskWidget({ campaign, onExit }: TaskWidgetProps) {
  const phase = useResearchStore((s) => s.phase)
  const taskIndex = useResearchStore((s) => s.taskIndex)
  const pending = useResearchStore((s) => s.pending)
  const collapsed = useResearchStore((s) => s.widgetCollapsed)
  const setCollapsed = useResearchStore((s) => s.setWidgetCollapsed)
  const completeTask = useResearchStore((s) => s.completeTask)
  const submitFeedback = useResearchStore((s) => s.submitFeedback)
  const submitSummary = useResearchStore((s) => s.submitSummary)
  const rewardEarned = useResearchStore((s) => s.session?.rewardEarned ?? null)

  const constraintsRef = useRef<HTMLDivElement>(null)
  const task = campaign.tasks[taskIndex]
  const total = campaign.tasks.length
  const isMobile = useIsSmallScreen()

  return (
    <>
      {/* Drag bounds = viewport */}
      <div ref={constraintsRef} className="pointer-events-none fixed inset-3 z-[100030]" />
      <motion.div
        data-research-ignore
        drag={!isMobile}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0.05}
        className={cn(
          'fixed z-[100040] flex max-h-[min(70vh,640px)] flex-col select-none overflow-hidden rounded-2xl border border-[#7c5cff]/35 bg-[#181433] text-white shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(124,92,255,0.25)]',
          'inset-x-3 bottom-[88px] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[min(360px,calc(100vw-2rem))]',
          collapsed && 'inset-x-auto right-3 w-auto sm:left-4 sm:right-auto sm:w-auto'
        )}
        style={{ touchAction: isMobile ? 'auto' : 'none' }}
      >
        {/* Header / drag handle */}
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <IconGripVertical className="hidden size-4 cursor-grab text-white/30 sm:block" />
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#b7a8ff]">
            <IconFlask className="size-3.5" />
            Research
          </span>
          {phase === 'task' || phase === 'feedback' ? (
            <span className="text-[11px] text-white/45">
              Task {taskIndex + 1}/{total}
            </span>
          ) : null}
          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              aria-label={collapsed ? 'Expand' : 'Collapse'}
              onClick={() => setCollapsed(!collapsed)}
              className="flex size-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
            >
              {collapsed ? <IconChevronUp className="size-4" /> : <IconChevronDown className="size-4" />}
            </button>
            <button
              type="button"
              aria-label="Exit test"
              onClick={onExit}
              className="flex size-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
            >
              <IconX className="size-4" />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {!collapsed && (
            <motion.div
              key={`${phase}-${taskIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="min-h-0 overflow-y-auto px-4 pb-4 pt-3"
            >
              {(phase === 'task' || phase === 'feedback') && <RProgress current={taskIndex} total={total} />}

              {phase === 'task' && task && (
                <TaskStep
                  instruction={task.instruction}
                  hint={task.hint}
                  onDone={() => completeTask('completed', false)}
                  onSkip={() => completeTask('skipped', false)}
                  onGaveUp={() => completeTask('gave_up', false)}
                />
              )}

              {phase === 'feedback' && task && (
                <QuestionsStep
                  key={task.id}
                  scope={task.id}
                  heading={pending?.detectedAutomatically ? 'Looks like you did it' : pending?.outcome === 'completed' ? 'Nice one' : 'No problem'}
                  outcome={pending?.outcome ?? 'completed'}
                  questions={task.questions}
                  submitLabel={taskIndex + 1 >= total ? 'Finish' : 'Next task'}
                  onSubmit={submitFeedback}
                />
              )}

              {phase === 'summary' && (
                <QuestionsStep scope="final" heading="Last thing" outcome="completed" questions={campaign.finalQuestions} submitLabel="Submit" onSubmit={submitSummary} />
              )}

              {phase === 'done' && (
                <div className="pt-1">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#7c5cff]">
                    <IconCheck className="size-6 text-white" strokeWidth={3} />
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold">All done</p>
                  <p className="mt-1 text-center text-xs leading-relaxed text-white/55">{campaign.outro || 'Thanks for taking part.'}</p>
                  {campaign.reward && rewardEarned && <RewardCard reward={campaign.reward} className="mt-4" />}
                  {campaign.reward && rewardEarned === false && (
                    <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs leading-relaxed text-white/60">
                      The {campaign.reward.label} is for fully completed tests, so it isn&apos;t available this time.
                    </p>
                  )}
                  <RButton variant={campaign.reward ? 'ghost' : 'outline'} className="mt-3 w-full" onClick={onExit}>
                    Close
                  </RButton>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

// ─── Steps ────────────────────────────────────────────────────

function TaskStep({
  instruction,
  hint,
  onDone,
  onSkip,
  onGaveUp,
}: {
  instruction: string
  hint?: string
  onDone: () => void
  onSkip: () => void
  onGaveUp: () => void
}) {
  const [elapsed, setElapsed] = useState(0)
  const startedAt = useResearchStore((s) => s.taskStartedAt)
  useEffect(() => {
    const t = setInterval(() => {
      if (startedAt) setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(t)
  }, [startedAt])

  return (
    <div className="mt-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-white/45">Your task</p>
      <p className="mt-1 text-[15px] font-semibold leading-snug">{instruction}</p>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-white/55">{hint}</p>}
      <div className="mt-4 flex items-center gap-2">
        <RButton className="flex-1" onClick={onDone}>
          <IconCheck className="size-4" />
          Done
        </RButton>
        <span className="w-12 text-right text-[11px] tabular-nums text-white/40">{fmt(elapsed)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <button type="button" onClick={onGaveUp} className="text-white/45 hover:text-white">
          I couldn&apos;t do it
        </button>
        <button type="button" onClick={onSkip} className="inline-flex items-center gap-1 text-white/45 hover:text-white">
          Skip <IconPlayerSkipForward className="size-3" />
        </button>
      </div>
    </div>
  )
}

/** Renders a campaign-defined list of questions. Used for per-task feedback and the final summary. */
function QuestionsStep({
  scope,
  heading,
  outcome,
  questions,
  submitLabel,
  onSubmit,
}: {
  scope: string
  heading: string
  outcome: TaskOutcome
  questions: TaskQuestion[]
  submitLabel: string
  onSubmit: (answers: Answers) => void
}) {
  const [answers, setAnswers] = useState<Answers>({})
  const [uploading, setUploading] = useState(0)
  const sessionId = useResearchStore((s) => s.session?.id ?? 'anon')
  const skipped = outcome !== 'completed'
  // When the tester skipped / gave up, a rating of "how easy" makes no sense — ask what happened instead.
  const visible = skipped ? questions.filter((q) => q.type !== 'rating') : questions
  const list: TaskQuestion[] = skipped
    ? [{ id: 'change', label: 'What got in the way?', type: 'text' }, ...visible.filter((q) => q.id !== 'change')]
    : visible
  // A required text question is satisfied by typed text OR a voice clip.
  const answered = (q: TaskQuestion) =>
    q.type === 'text' ? Boolean((answers[q.id] as string | undefined)?.trim()) || Boolean(answers[audioKey(q.id)]) : answers[q.id] !== undefined
  const ready = uploading === 0 && list.every((q) => !q.required || answered(q))
  const set = (id: string, v: Answers[string]) => setAnswers((a) => ({ ...a, [id]: v }))
  const unset = (id: string) =>
    setAnswers((a) => {
      const next = { ...a }
      delete next[id]
      return next
    })

  return (
    <div className="mt-3 space-y-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-white/45">{heading}</p>
      {list.map((q, i) => (
        <div key={q.id}>
          {q.type === 'rating' ? (
            <>
              <p className={cn('font-semibold leading-snug', i === 0 ? 'text-[15px]' : 'text-sm')}>{q.label}</p>
              <div className="mt-2">
                <RRating value={typeof answers[q.id] === 'number' ? (answers[q.id] as number) : null} onChange={(v) => set(q.id, v)} low={q.low} high={q.high} />
              </div>
            </>
          ) : q.type === 'yesno' ? (
            <>
              <RLabel>{q.label}</RLabel>
              <div className="grid grid-cols-2 gap-1.5">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    onClick={() => set(q.id, v)}
                    className={cn(
                      'h-10 rounded-lg border text-sm font-medium transition-colors',
                      answers[q.id] === v ? 'border-[#7c5cff] bg-[#7c5cff] text-white' : 'border-white/12 bg-white/[0.04] text-white/70 hover:border-white/30 hover:text-white'
                    )}
                  >
                    {v ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <RLabel>{q.label}</RLabel>
              <RTextarea
                value={typeof answers[q.id] === 'string' ? (answers[q.id] as string) : ''}
                onChange={(e) => set(q.id, e.target.value)}
                placeholder={q.required ? '' : 'Optional'}
                className={i > 0 ? 'min-h-[60px]' : undefined}
              />
              <VoiceAnswer
                className="mt-1.5"
                storagePath={`${sessionId}/${scope}-${q.id}`}
                onTranscript={(t) => set(q.id, t)}
                onAudio={(url) => (url ? set(audioKey(q.id), url) : unset(audioKey(q.id)))}
                onUploadingChange={(u) => setUploading((n) => (u ? n + 1 : Math.max(0, n - 1)))}
              />
            </>
          )}
        </div>
      ))}
      <RButton className="w-full" disabled={!ready} onClick={() => onSubmit(answers)}>
        {submitLabel}
      </RButton>
    </div>
  )
}

function useIsSmallScreen() {
  const [small, setSmall] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setSmall(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return small
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}
