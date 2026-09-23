'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Answers, Campaign, ResearchSession, TaskOutcome, TaskResult, Tester } from './types'
import { newId } from './types'
import { saveSession, saveTaskResult } from './research-storage'
import { sessionRecorder } from './session-recorder'
import { evaluateReward } from './reward-rules'

export type ResearchPhase = 'idle' | 'intake' | 'task' | 'feedback' | 'summary' | 'done'

interface PendingCompletion {
  outcome: TaskOutcome
  detectedAutomatically: boolean
  completedAt: string
}

interface ResearchState {
  /** Snapshot of the campaign being run (null = overlay hidden). */
  campaign: Campaign | null
  phase: ResearchPhase
  session: ResearchSession | null
  taskIndex: number
  taskStartedAt: string | null
  pathsVisited: string[]
  /** Set when a task is finished (auto-detected or manual) and we're collecting feedback. */
  pending: PendingCompletion | null
  results: TaskResult[]
  widgetCollapsed: boolean

  activate: (campaign: Campaign) => void
  deactivate: () => void
  beginSession: (tester: Tester, ip: string | null) => void
  startTask: (index: number) => void
  recordPath: (path: string) => void
  completeTask: (outcome: TaskOutcome, detectedAutomatically: boolean) => void
  submitFeedback: (answers: Answers) => Promise<void>
  submitSummary: (answers: Answers) => void
  setWidgetCollapsed: (v: boolean) => void
}

function deviceInfo(): ResearchSession['device'] {
  if (typeof window === 'undefined') return { userAgent: '', viewport: '', isMobile: false }
  return {
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    isMobile: window.innerWidth < 768,
  }
}

const num = (v: unknown) => (typeof v === 'number' ? v : null)
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export const useResearchStore = create<ResearchState>()(
  persist(
    (set, get) => ({
      campaign: null,
      phase: 'idle',
      session: null,
      taskIndex: 0,
      taskStartedAt: null,
      pathsVisited: [],
      pending: null,
      results: [],
      widgetCollapsed: false,

      activate: (campaign) => {
        const s = get()
        // Resume if the same campaign is mid-flight; otherwise fresh intake.
        if (s.campaign?.id === campaign.id && s.session && s.phase !== 'idle' && s.phase !== 'done') {
          set({ campaign })
          return
        }
        set({
          campaign,
          phase: 'intake',
          session: null,
          taskIndex: 0,
          taskStartedAt: null,
          pathsVisited: [],
          pending: null,
          results: [],
          widgetCollapsed: false,
        })
      },

      deactivate: () => {
        sessionRecorder.stop()
        const { session, phase } = get()
        if (session && phase !== 'done' && session.status === 'in_progress') {
          void saveSession({ ...session, status: 'abandoned', finishedAt: new Date().toISOString() })
        }
        set({
          campaign: null,
          phase: 'idle',
          session: null,
          taskIndex: 0,
          taskStartedAt: null,
          pathsVisited: [],
          pending: null,
          results: [],
        })
      },

      beginSession: (tester, ip) => {
        const { campaign } = get()
        if (!campaign) return
        const session: ResearchSession = {
          id: newId('rs'),
          journeyId: campaign.id,
          journeyTitle: campaign.title,
          tester,
          ip,
          startedAt: new Date().toISOString(),
          finishedAt: null,
          status: 'in_progress',
          device: deviceInfo(),
          overallRating: null,
          overallComments: '',
          finalAnswers: {},
          replayUrl: null,
          rewardEarned: null,
        }
        void saveSession(session)
        set({ session, results: [], taskIndex: 0 })
        void sessionRecorder.start({ replay: campaign.recordReplay !== false }).then(() => sessionRecorder.startTask())
        get().startTask(0)
      },

      startTask: (index) => {
        if (sessionRecorder.isActive) sessionRecorder.startTask()
        set({
          taskIndex: index,
          phase: 'task',
          taskStartedAt: new Date().toISOString(),
          pathsVisited: typeof window !== 'undefined' ? [window.location.pathname] : [],
          pending: null,
        })
      },

      recordPath: (path) => {
        const { phase, pathsVisited } = get()
        if (phase !== 'task') return
        if (pathsVisited[pathsVisited.length - 1] === path) return
        set({ pathsVisited: [...pathsVisited, path] })
      },

      completeTask: (outcome, detectedAutomatically) => {
        if (get().phase !== 'task') return
        set({
          phase: 'feedback',
          pending: { outcome, detectedAutomatically, completedAt: new Date().toISOString() },
          widgetCollapsed: false,
        })
      },

      submitFeedback: async (answers) => {
        const { campaign, session, taskIndex, taskStartedAt, pending, pathsVisited, results } = get()
        if (!campaign || !session || !pending) return
        const task = campaign.tasks[taskIndex]
        const startedAt = taskStartedAt ?? pending.completedAt
        const rec = sessionRecorder.isActive ? await sessionRecorder.finishTask(session.id, taskIndex) : { events: [], replayUrl: null }
        const result: TaskResult = {
          id: newId('rt'),
          sessionId: session.id,
          taskId: task.id,
          taskIndex,
          instruction: task.instruction,
          outcome: pending.outcome,
          detectedAutomatically: pending.detectedAutomatically,
          startedAt,
          completedAt: pending.completedAt,
          durationMs: Math.max(0, new Date(pending.completedAt).getTime() - new Date(startedAt).getTime()),
          easeRating: num(answers.ease),
          wouldChange: str(answers.change),
          followUpAnswer: '',
          answers,
          pathsVisited,
          events: rec.events,
          replayUrl: rec.replayUrl,
        }
        void saveTaskResult(result)
        const nextResults = [...results, result]
        const next = taskIndex + 1
        if (next >= campaign.tasks.length) {
          if (campaign.finalQuestions.length) set({ results: nextResults, phase: 'summary', pending: null })
          else {
            set({ results: nextResults, pending: null })
            get().submitSummary({})
          }
        } else {
          set({ results: nextResults })
          get().startTask(next)
        }
      },

      submitSummary: (answers) => {
        const { session, campaign, results } = get()
        if (!session || !campaign) return
        sessionRecorder.stop()
        const rewardEarned = campaign.reward ? evaluateReward(campaign, results).earned : null
        const finished: ResearchSession = {
          ...session,
          status: 'completed',
          finishedAt: new Date().toISOString(),
          overallRating: num(answers.overall),
          overallComments: str(answers.comments),
          finalAnswers: answers,
          rewardEarned,
        }
        void saveSession(finished)
        set({ session: finished, phase: 'done' })
      },

      setWidgetCollapsed: (v) => set({ widgetCollapsed: v }),
    }),
    {
      name: 'research:overlay:v2',
      partialize: (s) => ({
        campaign: s.campaign,
        phase: s.phase,
        session: s.session,
        taskIndex: s.taskIndex,
        taskStartedAt: s.taskStartedAt,
        pathsVisited: s.pathsVisited,
        pending: s.pending,
        results: s.results,
        widgetCollapsed: s.widgetCollapsed,
      }),
    }
  )
)
