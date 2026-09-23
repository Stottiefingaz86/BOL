'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { IconArrowDown, IconArrowLeft, IconArrowUp, IconBroadcast, IconCheck, IconEye, IconLoader2, IconPlus, IconTrash } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { getCampaign, saveCampaign, setCampaignStatus } from '@/components/research/campaign-storage'
import { DEFAULT_REWARD_RULES, DEFAULT_TASK_QUESTIONS, newId, type Campaign, type CompletionRule, type JourneyTask, type TaskQuestion } from '@/components/research/types'
import { RButton, RInput, RLabel, RTextarea } from '@/components/research/ui'
import { StatusBadge } from '@/components/research/admin/status-badge'

/** Campaign editor: details, tasks (instruction + completion rule + questions), final questions, reward. */
export default function CampaignEditorPage() {
  const { id } = useParams<{ id: string }>()
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const dirty = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getCampaign(id).then((c) => setCampaign(c ?? null))
  }, [id])

  // Autosave (debounced) on every change.
  const update = (patch: Partial<Campaign> | ((c: Campaign) => Campaign)) => {
    setCampaign((c) => {
      if (!c) return c
      const next = typeof patch === 'function' ? patch(c) : { ...c, ...patch }
      dirty.current = true
      if (timer.current) clearTimeout(timer.current)
      setSaveState('saving')
      timer.current = setTimeout(async () => {
        await saveCampaign(next)
        dirty.current = false
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 1500)
      }, 600)
      return next
    })
  }

  if (campaign === undefined) return <main className="p-12 text-sm text-white/50">Loading…</main>
  if (campaign === null)
    return (
      <main className="p-12 text-sm text-white/60">
        Campaign not found. <Link href="/research" className="underline">Back to campaigns</Link>
      </main>
    )

  const canGoLive = campaign.tasks.some((t) => t.instruction.trim())

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/research" className="flex size-9 items-center justify-center rounded-full border border-white/15 hover:bg-white/[0.06]">
            <IconArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{campaign.title || 'Untitled campaign'}</h1>
              <StatusBadge status={campaign.status} />
            </div>
            <p className="text-xs text-white/45">
              {saveState === 'saving' ? (
                <span className="inline-flex items-center gap-1"><IconLoader2 className="size-3 animate-spin" /> Saving…</span>
              ) : saveState === 'saved' ? (
                <span className="inline-flex items-center gap-1"><IconCheck className="size-3" /> Saved</span>
              ) : (
                'Changes save automatically'
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RButton variant="outline" onClick={() => (window.location.href = `${campaign.startPath}?research=${campaign.id}`)}>
            <IconEye className="size-4" />
            Preview
          </RButton>
          {campaign.status !== 'live' ? (
            <RButton
              disabled={!canGoLive}
              onClick={async () => {
                await setCampaignStatus(campaign.id, 'live')
                setCampaign((c) => (c ? { ...c, status: 'live' } : c))
              }}
            >
              <IconBroadcast className="size-4" />
              Set live
            </RButton>
          ) : (
            <RButton
              variant="outline"
              onClick={async () => {
                await setCampaignStatus(campaign.id, 'ended')
                setCampaign((c) => (c ? { ...c, status: 'ended' } : c))
              }}
            >
              End campaign
            </RButton>
          )}
        </div>
      </header>

      {/* Details */}
      <Section title="Details">
        <Field label="Title">
          <RInput value={campaign.title} onChange={(e) => update({ title: e.target.value })} placeholder="e.g. Loyalty hub — first visit" />
        </Field>
        <Field label="Description (internal)">
          <RTextarea value={campaign.description} onChange={(e) => update({ description: e.target.value })} className="min-h-[60px]" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start page" hint="Tester is sent here when they press Start">
            <RInput value={campaign.startPath} onChange={(e) => update({ startPath: e.target.value || '/' })} placeholder="/" />
          </Field>
          <Field label="Estimated minutes">
            <RInput type="number" min={1} value={campaign.estimatedMinutes} onChange={(e) => update({ estimatedMinutes: Math.max(1, Number(e.target.value) || 1) })} />
          </Field>
        </div>
      </Section>

      {/* Tasks */}
      <Section title={`Tasks (${campaign.tasks.length})`} hint="Each task is one instruction. Questions are asked after the tester finishes it.">
        <div className="space-y-4">
          {campaign.tasks.map((task, i) => (
            <TaskEditor
              key={task.id}
              index={i}
              task={task}
              total={campaign.tasks.length}
              onChange={(t) => update((c) => ({ ...c, tasks: c.tasks.map((x) => (x.id === t.id ? t : x)) }))}
              onMove={(dir) =>
                update((c) => {
                  const tasks = [...c.tasks]
                  const j = i + dir
                  if (j < 0 || j >= tasks.length) return c
                  ;[tasks[i], tasks[j]] = [tasks[j], tasks[i]]
                  return { ...c, tasks }
                })
              }
              onRemove={() => update((c) => ({ ...c, tasks: c.tasks.filter((x) => x.id !== task.id) }))}
            />
          ))}
        </div>
        <RButton
          variant="outline"
          className="mt-4"
          onClick={() => update((c) => ({ ...c, tasks: [...c.tasks, { id: newId('task'), instruction: '', complete: { type: 'manual' }, questions: DEFAULT_TASK_QUESTIONS }] }))}
        >
          <IconPlus className="size-4" />
          Add task
        </RButton>
      </Section>

      {/* Final questions */}
      <Section title="Final questions" hint="Asked once after the last task. Leave empty to skip.">
        <QuestionsEditor questions={campaign.finalQuestions} onChange={(finalQuestions) => update({ finalQuestions })} />
      </Section>

      {/* Completion */}
      <Section title="Completion">
        <Field label="Thank-you message">
          <RInput value={campaign.outro} onChange={(e) => update({ outro: e.target.value })} />
        </Field>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={Boolean(campaign.reward)}
            onChange={(e) => update({ reward: e.target.checked ? { code: '', label: '' } : null })}
            className="size-4 accent-[#7c5cff]"
          />
          Give a cash drop code on completion
        </label>
        {campaign.reward && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Code">
              <RInput
                value={campaign.reward.code}
                onChange={(e) => update({ reward: { ...campaign.reward!, code: e.target.value.toUpperCase().replace(/\s+/g, '') } })}
                placeholder="RESEARCH5"
                className="font-mono"
              />
            </Field>
            <Field label="What it's worth">
              <RInput value={campaign.reward.label} onChange={(e) => update({ reward: { ...campaign.reward!, label: e.target.value } })} placeholder="$5 cash drop" />
            </Field>
          </div>
        )}
        {campaign.reward && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/45">Only give the reward when…</p>
            <p className="mt-1 text-[11px] text-white/40">Stops testers skipping straight through to the code. Sessions that fail are still recorded and flagged in results.</p>
            {(() => {
              const rules = { ...DEFAULT_REWARD_RULES, ...(campaign.rewardRules ?? {}) }
              const setRules = (patch: Partial<typeof rules>) => update({ rewardRules: { ...rules, ...patch } })
              return (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Tasks completed (not skipped)">
                    <div className="flex items-center gap-2">
                      <input type="range" min={0} max={100} step={10} value={Math.round(rules.minCompletedRatio * 100)} onChange={(e) => setRules({ minCompletedRatio: Number(e.target.value) / 100 })} className="flex-1 accent-[#7c5cff]" />
                      <span className="w-12 text-right text-sm tabular-nums">{Math.round(rules.minCompletedRatio * 100)}%</span>
                    </div>
                  </Field>
                  <Field label="Minimum time on tasks (seconds)">
                    <RInput type="number" min={0} value={rules.minTotalSeconds} onChange={(e) => setRules({ minTotalSeconds: Math.max(0, Number(e.target.value) || 0) })} />
                  </Field>
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-white/80 sm:col-span-2">
                    <input type="checkbox" checked={rules.requireAutoDetected} onChange={(e) => setRules({ requireAutoDetected: e.target.checked })} className="mt-0.5 size-4 accent-[#7c5cff]" />
                    <span>
                      Tasks with automatic detection must actually be detected
                      <span className="block text-[11px] text-white/40">e.g. “Deposit with Bitcoin” only counts if the deposit really completed, not because Done was pressed.</span>
                    </span>
                  </label>
                </div>
              )
            })()}
          </div>
        )}
      </Section>

      <Section title="Recording" hint="Everything the tester does is logged per task. Replay records the screen like Hotjar (inputs are masked).">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
          <input type="checkbox" checked={campaign.recordReplay !== false} onChange={(e) => update({ recordReplay: e.target.checked })} className="size-4 accent-[#7c5cff]" />
          Record session replay
        </label>
      </Section>
    </main>
  )
}

// ─── Task editor ──────────────────────────────────────────────

const RULE_TYPES: { value: CompletionRule['type']; label: string; help: string }[] = [
  { value: 'manual', label: 'Tester presses Done', help: 'No automatic detection.' },
  { value: 'auth', label: 'User logs in / registers', help: 'Completes when the site’s auth state flips to logged in.' },
  { value: 'route', label: 'Visits a page', help: 'Completes when the URL starts with the path below.' },
  { value: 'event', label: 'App event', help: 'Completes when the app emits this research event (e.g. deposit:completed, game:launched, vip:opened).' },
]

function TaskEditor({
  index,
  task,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  index: number
  task: JourneyTask
  total: number
  onChange: (t: JourneyTask) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}) {
  const rule: CompletionRule = task.complete ?? { type: 'manual' }
  const setRule = (r: CompletionRule) => onChange({ ...task, complete: r })
  const matchText = rule.type === 'event' && rule.match ? Object.entries(rule.match).map(([k, v]) => `${k}=${v}`).join(', ') : ''

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-[#7c5cff]/20 text-xs font-semibold text-[#c9bfff]">{index + 1}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-white/45">Task</span>
        <div className="ml-auto flex items-center gap-0.5">
          <IconBtn label="Move up" disabled={index === 0} onClick={() => onMove(-1)}><IconArrowUp className="size-4" /></IconBtn>
          <IconBtn label="Move down" disabled={index === total - 1} onClick={() => onMove(1)}><IconArrowDown className="size-4" /></IconBtn>
          <IconBtn label="Remove task" onClick={onRemove} danger><IconTrash className="size-4" /></IconBtn>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <Field label="Instruction to the tester">
          <RInput value={task.instruction} onChange={(e) => onChange({ ...task, instruction: e.target.value })} placeholder="e.g. Deposit $50 using Bitcoin." />
        </Field>
        <Field label="Hint (optional)">
          <RInput value={task.hint ?? ''} onChange={(e) => onChange({ ...task, hint: e.target.value || undefined })} placeholder="Shown under the instruction" />
        </Field>

        <Field label="Counts as done when…">
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
            <select
              value={rule.type}
              onChange={(e) => {
                const t = e.target.value as CompletionRule['type']
                setRule(t === 'manual' ? { type: 'manual' } : t === 'auth' ? { type: 'auth', loggedIn: true } : t === 'route' ? { type: 'route', match: '/' } : { type: 'event', name: '' })
              }}
              className="h-10 rounded-lg border border-white/12 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-white/30"
            >
              {RULE_TYPES.map((r) => (
                <option key={r.value} value={r.value} className="bg-[#1c1c1c]">
                  {r.label}
                </option>
              ))}
            </select>
            {rule.type === 'route' && <RInput value={rule.match} onChange={(e) => setRule({ type: 'route', match: e.target.value })} placeholder="/casino" className="font-mono" />}
            {rule.type === 'event' && (
              <div className="space-y-2">
                <RInput value={rule.name} onChange={(e) => setRule({ ...rule, name: e.target.value.trim() })} placeholder="deposit:completed" className="font-mono" />
                <RInput
                  defaultValue={matchText}
                  onBlur={(e) => {
                    const match: Record<string, string> = {}
                    for (const pair of e.target.value.split(',')) {
                      const [k, ...v] = pair.split('=')
                      if (k?.trim() && v.length) match[k.trim()] = v.join('=').trim()
                    }
                    setRule({ ...rule, match: Object.keys(match).length ? match : undefined })
                  }}
                  placeholder="method=bitcoin (optional filter)"
                  className="font-mono"
                />
              </div>
            )}
          </div>
          <p className="mt-1 text-[11px] text-white/40">{RULE_TYPES.find((r) => r.value === rule.type)?.help}</p>
        </Field>

        <Field label="Questions after this task">
          <QuestionsEditor questions={task.questions} onChange={(questions) => onChange({ ...task, questions })} />
        </Field>
      </div>
    </div>
  )
}

// ─── Questions editor ─────────────────────────────────────────

function QuestionsEditor({ questions, onChange }: { questions: TaskQuestion[]; onChange: (q: TaskQuestion[]) => void }) {
  const set = (id: string, patch: Partial<TaskQuestion>) => onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  return (
    <div className="space-y-2">
      {questions.map((q) => (
        <div key={q.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/[0.08] bg-black/20 p-2">
          <select
            value={q.type}
            onChange={(e) => set(q.id, { type: e.target.value as TaskQuestion['type'] })}
            className="h-9 rounded-md border border-white/12 bg-white/[0.04] px-2 text-xs text-white outline-none"
          >
            <option value="rating" className="bg-[#1c1c1c]">Rating 1–5</option>
            <option value="text" className="bg-[#1c1c1c]">Text / voice</option>
            <option value="yesno" className="bg-[#1c1c1c]">Yes / No</option>
          </select>
          <RInput value={q.label} onChange={(e) => set(q.id, { label: e.target.value })} placeholder="Question" className="h-9 min-w-[180px] flex-1 text-sm" />
          {q.type === 'rating' && (
            <>
              <RInput value={q.low ?? ''} onChange={(e) => set(q.id, { low: e.target.value })} placeholder="Low label" className="h-9 w-28 text-xs" />
              <RInput value={q.high ?? ''} onChange={(e) => set(q.id, { high: e.target.value })} placeholder="High label" className="h-9 w-28 text-xs" />
            </>
          )}
          <label className="inline-flex items-center gap-1.5 text-xs text-white/60">
            <input type="checkbox" checked={Boolean(q.required)} onChange={(e) => set(q.id, { required: e.target.checked })} className="size-3.5 accent-[#7c5cff]" />
            Required
          </label>
          <IconBtn label="Remove question" onClick={() => onChange(questions.filter((x) => x.id !== q.id))} danger>
            <IconTrash className="size-3.5" />
          </IconBtn>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...questions, { id: newId('q'), label: '', type: 'text' }])}
        className="inline-flex items-center gap-1 text-xs font-medium text-[#b7a8ff] hover:text-white"
      >
        <IconPlus className="size-3.5" />
        Add question
      </button>
    </div>
  )
}

// ─── Layout bits ──────────────────────────────────────────────

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45">{title}</h2>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
      <div className="mt-3 rounded-2xl border border-white/10 bg-[#1c1c1c] p-5">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="[&+&]:mt-3">
      <RLabel>{label}</RLabel>
      {children}
      {hint && <p className="mt-1 text-[11px] text-white/40">{hint}</p>}
    </div>
  )
}

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn('flex size-8 items-center justify-center rounded-md text-white/45 hover:bg-white/10 hover:text-white disabled:opacity-30', danger && 'hover:text-[#ff6b6b]')}
    >
      {children}
    </button>
  )
}
