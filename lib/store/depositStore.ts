'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Deposit history for the demo account. Persisted so "first-time depositor"
 * surfaces (the welcome-offer card in the wallet) stay consistent across reloads.
 */
type DepositRecord = { amount: number; method: string; at: number }

type DepositStore = {
  deposits: DepositRecord[]
  recordDeposit: (amount: number, method: string) => void
  reset: () => void
}

export const useDepositStore = create<DepositStore>()(
  persist(
    (set) => ({
      deposits: [],
      recordDeposit: (amount, method) =>
        set((state) => ({ deposits: [...state.deposits, { amount, method, at: Date.now() }] })),
      reset: () => set({ deposits: [] }),
    }),
    { name: 'bol-deposits' }
  )
)

/** True until the account has completed its first deposit. */
export function useIsFirstTimeDepositor() {
  return useDepositStore((s) => s.deposits.length === 0)
}
