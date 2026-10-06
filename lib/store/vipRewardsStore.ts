'use client'

import { create } from 'zustand'

/**
 * Which VIP Hub rewards have been claimed this session.
 * Shared so the header crown badge, the hub rows and anything else agree on what still needs attention.
 */
type VipRewardsStore = {
  claimedIds: string[]
  markClaimed: (id: string) => void
  /** Re-arm a reward (e.g. new referral commission accrued, rakeback window reopened). */
  unclaim: (id: string) => void
  reset: () => void
}

export const useVipRewardsStore = create<VipRewardsStore>((set) => ({
  claimedIds: [],
  markClaimed: (id) =>
    set((state) => (state.claimedIds.includes(id) ? state : { claimedIds: [...state.claimedIds, id] })),
  unclaim: (id) => set((state) => ({ claimedIds: state.claimedIds.filter((x) => x !== id) })),
  reset: () => set({ claimedIds: [] }),
}))
