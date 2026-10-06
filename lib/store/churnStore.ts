'use client'

import { create } from 'zustand'

/**
 * Demo churn-prevention journey.
 *
 * 1. Closing a game costs GAME_CLOSE_LOSS. If the player then looks like a
 *    churn risk → "Recommended games" modal (low volatility picks), at most
 *    once per page load (state is in-memory, so a refresh resets the journey).
 * 2. Playing a game from that modal runs the balance down to
 *    BALANCE_AFTER_RECOMMENDED_PLAY. Closing it shows the "balance running
 *    low" toast under the header balance with 50 free spins on the next deposit.
 * 3. When that deposit lands the spins become a claimable "Free Spins" reward
 *    in the VIP Hub (the header crown wiggles until it's claimed).
 */
export const DEPOSIT_FREE_SPINS_REWARD_ID = 'deposit-free-spins'
export const GAME_CLOSE_LOSS = 8
export const BALANCE_AFTER_RECOMMENDED_PLAY = 1
export const LOW_BALANCE_THRESHOLD = 25
export const CHURN_LOSING_STREAK = 3
export const FREE_SPINS_ON_NEXT_DEPOSIT = 50

type GameSession = { title: string; closedAt: number }

type ChurnState = {
  /** Recent closed game sessions (newest last). */
  sessions: GameSession[]
  /** Set once the "balance running low" toast has fired; cleared on deposit. */
  lowBalanceNotified: boolean
  /** 50 free spins promised for the next deposit. */
  freeSpinsOffer: number | null
  /** Spins unlocked by a deposit, waiting to be claimed in the VIP Hub. */
  freeSpinsAwarded: number
  /** Timestamp the Recommended games modal was last shown. */
  recommendedShownAt: number | null
  /** Header "balance running low" toast is on screen (not persisted). */
  lowBalanceToastVisible: boolean
  recordSessionClose: (title: string) => void
  markLowBalanceNotified: () => void
  hideLowBalanceToast: () => void
  /** Deposit landed: turn the pending offer into a VIP Hub reward. Returns spins awarded (0 if none). */
  awardFreeSpinsOnDeposit: () => number
  markRecommendedShown: () => void
  clearOffer: () => void
  reset: () => void
}

export const useChurnStore = create<ChurnState>()((set, get) => ({
  sessions: [],
  lowBalanceNotified: false,
  freeSpinsOffer: null,
  freeSpinsAwarded: 0,
  recommendedShownAt: null,
  lowBalanceToastVisible: false,
  recordSessionClose: (title) =>
    set((s) => ({
      sessions: [...s.sessions, { title, closedAt: Date.now() }].slice(-10),
    })),
  markLowBalanceNotified: () =>
    set({
      lowBalanceNotified: true,
      lowBalanceToastVisible: true,
      freeSpinsOffer: FREE_SPINS_ON_NEXT_DEPOSIT,
    }),
  hideLowBalanceToast: () => set({ lowBalanceToastVisible: false }),
  awardFreeSpinsOnDeposit: () => {
    const spins = get().freeSpinsOffer ?? 0
    if (spins > 0) {
      set({ freeSpinsOffer: null, lowBalanceNotified: false, freeSpinsAwarded: spins })
    }
    return spins
  },
  markRecommendedShown: () => set({ recommendedShownAt: Date.now() }),
  clearOffer: () => set({ freeSpinsOffer: null, lowBalanceNotified: false }),
  reset: () =>
    set({
      sessions: [],
      lowBalanceNotified: false,
      freeSpinsOffer: null,
      freeSpinsAwarded: 0,
      recommendedShownAt: null,
      lowBalanceToastVisible: false,
    }),
}))

/**
 * Churn heuristic: the player has just closed a game and is either nearly
 * out of funds or on a losing streak. Only fires once per session.
 */
export function isChurnRisk(balanceAfterClose: number): boolean {
  const { sessions, recommendedShownAt } = useChurnStore.getState()
  if (recommendedShownAt) return false
  if (balanceAfterClose < LOW_BALANCE_THRESHOLD) return true
  const recent = sessions.filter(
    (s) => Date.now() - s.closedAt < 30 * 60 * 1000,
  )
  return recent.length >= CHURN_LOSING_STREAK
}
