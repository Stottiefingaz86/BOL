/**
 * Research overlay — shared types.
 *
 * The overlay is product-agnostic: it only knows about a Campaign (ordered tasks + questions)
 * and how to detect when a task is complete. Anything product-specific lives in the campaign
 * definition or in `emitResearchEvent()` calls from the host app.
 */

/** How the overlay knows a task is done without the tester saying so. */
export type CompletionRule =
  | { type: 'manual' }
  /** Host app auth state flips to the given value. */
  | { type: 'auth'; loggedIn: boolean }
  /** Current pathname matches (string prefix or regex source). */
  | { type: 'route'; match: string; regex?: boolean }
  /** A named research event fired by the host app, optionally with a payload subset match. */
  | { type: 'event'; name: string; match?: Record<string, string | number | boolean> }

export type QuestionType = 'rating' | 'text' | 'yesno'

/** A question asked after a task (or at the end of the campaign). */
export interface TaskQuestion {
  id: string
  label: string
  type: QuestionType
  required?: boolean
  /** Rating end labels. */
  low?: string
  high?: string
}

export type AnswerValue = number | string | boolean
export type Answers = Record<string, AnswerValue>

export interface JourneyTask {
  id: string
  /** What the tester is asked to do — written as a direct instruction. */
  instruction: string
  /** Optional extra context shown under the instruction. */
  hint?: string
  /** Rough expectation for the researcher; shown in admin, not to testers. */
  successCriteria?: string
  complete?: CompletionRule
  /** Questions asked once the task is finished. */
  questions: TaskQuestion[]
}

export type CampaignStatus = 'draft' | 'live' | 'ended'

export interface CampaignReward {
  /** Cash drop / promo code shown on the completion screen. */
  code: string
  /** Short label, e.g. "$5 free bet". */
  label: string
}

/** When is the completion reward actually shown? Stops people skipping straight to the code. */
export interface RewardRules {
  /** Share of tasks that must be 'completed' (not skipped / gave up). 0–1. */
  minCompletedRatio: number
  /** Minimum total time on tasks, in seconds. */
  minTotalSeconds: number
  /** Every task with an automatic completion rule must have been auto-detected (not just "Done" pressed). */
  requireAutoDetected: boolean
}

export const DEFAULT_REWARD_RULES: RewardRules = { minCompletedRatio: 0.8, minTotalSeconds: 60, requireAutoDetected: true }

export interface Campaign {
  id: string
  title: string
  description: string
  status: CampaignStatus
  /** Where the tester should start (the overlay navigates here on start). */
  startPath: string
  estimatedMinutes: number
  tasks: JourneyTask[]
  /** Asked once after the last task. */
  finalQuestions: TaskQuestion[]
  outro: string
  reward: CampaignReward | null
  rewardRules?: RewardRules
  /** Record a Hotjar-style DOM replay of the session (rrweb). Default true. */
  recordReplay?: boolean
  createdAt: string
  updatedAt: string
}

/** @deprecated alias kept for the seed template. */
export type Journey = Campaign

// ─── Session data ─────────────────────────────────────────────

export type PlayerType = 'casino' | 'sports' | 'both' | 'new'
export const PLAYER_TYPES: { id: PlayerType; label: string; hint: string }[] = [
  { id: 'casino', label: 'Casino', hint: 'Slots, live, originals' },
  { id: 'sports', label: 'Sports', hint: 'Betting on games' },
  { id: 'both', label: 'Both', hint: 'A bit of everything' },
  { id: 'new', label: 'New here', hint: 'First time trying' },
]
export const AGE_BANDS = ['18–24', '25–34', '35–44', '45–54', '55+'] as const
export const DEPOSIT_BANDS = ['Nothing yet', 'Under $50', '$50–$200', '$200–$500', '$500–$1k', '$1k+'] as const

/** Who the tester is as a player — collected once in onboarding, used to build personas. */
export interface TesterProfile {
  plays: PlayerType | null
  favourite: string
  age: (typeof AGE_BANDS)[number] | null
  location: string
  monthlyDeposit: (typeof DEPOSIT_BANDS)[number] | null
  hobbies: string
}

export interface Tester {
  name: string
  email: string
  consent: boolean
  profile?: TesterProfile
}

export type TaskOutcome = 'completed' | 'skipped' | 'gave_up'

/** One thing the tester did while a task was active. */
export interface InteractionEvent {
  /** ms since task start */
  t: number
  type: 'click' | 'nav' | 'scroll' | 'input' | 'key'
  /** Human-readable target: button text, aria-label, link href, game title… */
  target?: string
  path?: string
  /** For scroll: max depth 0–1 reached so far. */
  value?: number | string
}

export interface TaskResult {
  id: string
  sessionId: string
  taskId: string
  taskIndex: number
  instruction: string
  outcome: TaskOutcome
  /** Detected automatically vs. tester pressed "Done". */
  detectedAutomatically: boolean
  startedAt: string
  completedAt: string
  durationMs: number
  /** Convenience copies of the standard questions for aggregates (null if the campaign didn't ask them). */
  easeRating: number | null
  wouldChange: string
  followUpAnswer: string
  /** Every answer keyed by question id. */
  answers: Answers
  /** Routes visited while the task was active. */
  pathsVisited: string[]
  /** Clicks / navigation / scroll while the task was active. */
  events: InteractionEvent[]
  /** rrweb replay chunk for this task (storage URL), if recorded. */
  replayUrl: string | null
}

export interface ResearchSession {
  id: string
  /** Campaign id (column name kept as journey_id in the DB). */
  journeyId: string
  journeyTitle: string
  tester: Tester
  ip: string | null
  startedAt: string
  finishedAt: string | null
  status: 'in_progress' | 'completed' | 'abandoned'
  device: {
    userAgent: string
    viewport: string
    isMobile: boolean
  }
  overallRating: number | null
  overallComments: string
  finalAnswers: Answers
  /** Optional link to a session replay (PostHog etc.) if the host app sets one. */
  replayUrl: string | null
  /** Did this session meet the campaign's reward rules? null = no reward configured. */
  rewardEarned: boolean | null
}

// ─── Defaults ─────────────────────────────────────────────────

export const DEFAULT_TASK_QUESTIONS: TaskQuestion[] = [
  { id: 'ease', label: 'How easy was that?', type: 'rating', required: true, low: 'Very hard', high: 'Very easy' },
  { id: 'change', label: 'Would you change anything?', type: 'text' },
]

export const DEFAULT_FINAL_QUESTIONS: TaskQuestion[] = [
  { id: 'overall', label: 'How was it overall?', type: 'rating', required: true, low: 'Frustrating', high: 'Great' },
  { id: 'comments', label: 'Anything else?', type: 'text' },
]

export function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
