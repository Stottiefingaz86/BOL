import { DEFAULT_REWARD_RULES, type Campaign, type TaskResult } from './types'

export interface RewardEvaluation {
  earned: boolean
  /** Human-readable reasons it failed (empty when earned). */
  reasons: string[]
  completedRatio: number
  totalSeconds: number
  autoMissed: number
}

/**
 * Did the tester genuinely do the study? Shared by the overlay (show the code or not)
 * and the admin (flag suspicious sessions). Pure function — easy to tune.
 */
export function evaluateReward(campaign: Campaign, results: TaskResult[]): RewardEvaluation {
  const rules = { ...DEFAULT_REWARD_RULES, ...(campaign.rewardRules ?? {}) }
  const total = campaign.tasks.length || 1
  const completed = results.filter((r) => r.outcome === 'completed').length
  const completedRatio = completed / total
  const totalSeconds = results.reduce((s, r) => s + r.durationMs, 0) / 1000
  const autoTasks = campaign.tasks.filter((t) => t.complete && t.complete.type !== 'manual').map((t) => t.id)
  const autoMissed = results.filter((r) => autoTasks.includes(r.taskId) && r.outcome === 'completed' && !r.detectedAutomatically).length

  const reasons: string[] = []
  if (completedRatio < rules.minCompletedRatio) reasons.push(`Only ${completed} of ${total} tasks completed (needs ${Math.round(rules.minCompletedRatio * 100)}%)`)
  if (totalSeconds < rules.minTotalSeconds) reasons.push(`Finished in ${Math.round(totalSeconds)}s (minimum ${rules.minTotalSeconds}s)`)
  if (rules.requireAutoDetected && autoMissed > 0) reasons.push(`${autoMissed} task${autoMissed === 1 ? '' : 's'} marked done without the app detecting it`)
  return { earned: reasons.length === 0, reasons, completedRatio, totalSeconds, autoMissed }
}

/** Extra heuristics for the admin's "suspicious" flag, beyond the reward rules. */
export function suspicionFlags(campaign: Campaign, results: TaskResult[]): string[] {
  const flags = [...evaluateReward(campaign, results).reasons]
  const noClicks = results.filter((r) => r.outcome === 'completed' && (r.events?.filter((e) => e.type === 'click').length ?? 0) === 0)
  if (noClicks.length) flags.push(`${noClicks.length} completed task${noClicks.length === 1 ? '' : 's'} with zero clicks`)
  const tooFast = results.filter((r) => r.outcome === 'completed' && r.durationMs < 3000)
  if (tooFast.length) flags.push(`${tooFast.length} task${tooFast.length === 1 ? '' : 's'} completed in under 3s`)
  return [...new Set(flags)]
}
