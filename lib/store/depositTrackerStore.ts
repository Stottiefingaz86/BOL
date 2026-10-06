'use client'

import { create } from 'zustand'

import { useDepositStore } from '@/lib/store/depositStore'
import { useChurnStore } from '@/lib/store/churnStore'
import { toast } from '@/components/ui/sonner'

/**
 * Demo "blockchain polling" for a crypto deposit the player says they've sent.
 *
 * Lives in a store (not component state) so tracking keeps running when the
 * wallet drawer is closed — the header toast reads from here and the wallet
 * re-attaches to it when reopened.
 */
export const REQUIRED_CONFIRMATIONS = 3
/** Demo: every confirmed crypto deposit credits this much. */
export const DEMO_CRYPTO_DEPOSIT_USD = 500
/** Matches the claim-reward roll-up duration in hooks/use-rain-balance.ts */
const BALANCE_ROLLUP_MS = 1500

export type TrackStage = 'waiting' | 'detected' | 'confirming' | 'confirmed'

export type TrackedDeposit = {
  coinId: string
  coinName: string
  ticker: string
  amountUsd: number
  startedAt: number
  stage: TrackStage
  confirmations: number
  txHash: string
  confirmedAt: number | null
  /** Set when the header toast is clicked, so the wallet opens on the tracker even if already confirmed. */
  openRequested?: boolean
}

type DepositTrackerStore = {
  active: TrackedDeposit | null
  /** True while the wallet drawer is open — the header toast hides itself then. */
  walletOpen: boolean
  start: (coin: { id: string; name: string; ticker: string }, amountUsd?: number) => void
  dismiss: () => void
  setWalletOpen: (open: boolean) => void
  setOpenRequested: (v: boolean) => void
}

function randomTxHash() {
  const hex = '0123456789abcdef'
  let out = '0x'
  for (let i = 0; i < 64; i++) out += hex[Math.floor(Math.random() * 16)]
  return out
}

let timers: number[] = []
function clearTimers() {
  timers.forEach((t) => window.clearTimeout(t))
  timers = []
}

export const useDepositTrackerStore = create<DepositTrackerStore>((set, get) => ({
  active: null,
  walletOpen: false,

  start: (coin, amountUsd = DEMO_CRYPTO_DEPOSIT_USD) => {
    clearTimers()
    set({
      active: {
        coinId: coin.id,
        coinName: coin.name,
        ticker: coin.ticker,
        amountUsd,
        startedAt: Date.now(),
        stage: 'waiting',
        confirmations: 0,
        txHash: randomTxHash(),
        confirmedAt: null,
      },
    })

    const patch = (p: Partial<TrackedDeposit>) =>
      set((s) => (s.active ? { active: { ...s.active, ...p } } : s))

    // Demo timings: detected after ~2.5s, then one confirmation every ~2s.
    timers.push(window.setTimeout(() => patch({ stage: 'detected' }), 2500))
    timers.push(window.setTimeout(() => patch({ stage: 'confirming' }), 3600))
    for (let i = 1; i <= REQUIRED_CONFIRMATIONS; i++) {
      timers.push(window.setTimeout(() => patch({ confirmations: i }), 3600 + i * 2000))
    }
    timers.push(
      window.setTimeout(() => {
        const a = get().active
        if (!a) return
        patch({ stage: 'confirmed', confirmedAt: Date.now() })
        // Credit the balance the same way every other reward does, so each page's balance picks it up.
        window.dispatchEvent(new CustomEvent('notification:claim-reward', { detail: { amount: a.amountUsd } }))
        useDepositStore.getState().recordDeposit(a.amountUsd, a.coinId)
        {
          const spins = useChurnStore.getState().awardFreeSpinsOnDeposit()
          if (spins > 0) {
            window.setTimeout(() => {
              toast.success(`${spins} free spins unlocked`, {
                description: 'Claim them in the VIP Hub to start spinning.',
                duration: 6000,
              })
            }, 900)
          }
        }
        // If nobody is looking at the wallet, the header toast goes away as soon as the
        // balance roll-up (1.5s, see use-rain-balance) has finished.
        timers.push(
          window.setTimeout(() => {
            const cur = get()
            if (cur.active?.stage === 'confirmed' && !cur.walletOpen) set({ active: null })
          }, BALANCE_ROLLUP_MS + 400),
        )
      }, 3600 + REQUIRED_CONFIRMATIONS * 2000 + 500),
    )
  },

  dismiss: () => {
    clearTimers()
    set({ active: null })
  },

  setWalletOpen: (open) => set({ walletOpen: open }),
  setOpenRequested: (v) => set((s) => (s.active ? { active: { ...s.active, openRequested: v } } : s)),
}))
