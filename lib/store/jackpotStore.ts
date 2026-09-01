import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  JACKPOT_TICKER_TIERS,
  JACKPOT_TIERS,
  getJackpotSpinAddonTotal,
  type JackpotTierId,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'

type TierAmounts = Record<JackpotTierId, number>
type TickerAmounts = Record<JackpotTickerTierId, number>
type TierOptIns = Record<JackpotTierId, boolean>

export type MustDropType = 'time' | 'value'

function buildInitialAmounts(): TierAmounts {
  return JACKPOT_TIERS.reduce((acc, tier) => {
    acc[tier.id] = tier.seedAmount
    return acc
  }, {} as TierAmounts)
}

function buildInitialTickerAmounts(): TickerAmounts {
  return JACKPOT_TICKER_TIERS.reduce((acc, tier) => {
    acc[tier.id] = tier.seedAmount
    return acc
  }, {} as TickerAmounts)
}

function buildDefaultTierOptIns(optedIn = true): TierOptIns {
  return JACKPOT_TIERS.reduce((acc, tier) => {
    acc[tier.id] = optedIn
    return acc
  }, {} as TierOptIns)
}

function optedInFromTiers(tierOptIns: TierOptIns): boolean {
  return JACKPOT_TIERS.every((tier) => tierOptIns[tier.id])
}

export interface MegaWinRoll {
  fromAmount: number
  winAmount: number
  startedAt: number
  durationMs: number
}

interface JackpotState {
  optedIn: boolean
  tierOptIns: TierOptIns
  amounts: TierAmounts
  tickerAmounts: TickerAmounts
  mustDropDeadline: number
  mustDropAmount: number
  /** Value-based must-drop: current pool toward a hard threshold. */
  valueMustDropAmount: number
  valueMustDropThreshold: number
  mustDropDrawerOpen: boolean
  /** Which must-drop variant is active — only one is shown at a time. */
  activeMustDropType: MustDropType
  /** Player's own accumulating pot (personal jackpot). */
  personalAmount: number
  personalSeed: number
  megaWinRoll: MegaWinRoll | null
  lastWinAmount: number
  /** Demo toggle — preview must-drop “last hour” heat state. */
  mustDropHeatPreview: boolean
  /** Demo sub-state — final 5-second drain preview (requires heat preview). */
  mustDropFinalePreview: boolean
  /** Seed amount after a time-based must-drop completes. */
  mustDropSeed: number
  /** False after a must-drop is won — UI hidden until a new one is launched. */
  mustDropLaunched: boolean
  /** True while the exit animation plays — display frozen at $0. */
  mustDropExiting: boolean
  /** True once finale countdown hits zero — prevents fallback to live deadline/amount. */
  mustDropDrained: boolean
  /** Pot value captured when finale begins — UI drains from this, not live store ticks. */
  mustDropFinaleStartAmount: number
  toggleMustDropHeatPreview: () => void
  beginMustDropExit: () => void
  completeMustDropWin: () => void
  launchMustDrop: () => void
  setOptedIn: (optedIn: boolean) => void
  toggleOptedIn: () => void
  setTierOptIn: (tierId: JackpotTierId, enabled: boolean) => void
  toggleTierOptIn: (tierId: JackpotTierId) => void
  getSpinAddonTotal: () => number
  setMustDropDrawerOpen: (open: boolean) => void
  startMegaWinRoll: (durationMs: number, delayMs?: number, winAmount?: number) => void
  completeMegaWinRoll: () => void
  cancelMegaWinRoll: () => void
  /** Pay out a won tier: returns the won pot and resets that tier back to its seed. */
  registerJackpotWin: (tier: JackpotTickerTierId) => number
  /** Pay out personal jackpot and reset to seed. */
  registerPersonalWin: () => number
  tickAmounts: () => void
}

export const useJackpotStore = create<JackpotState>()(
  persist(
    (set, get) => ({
      optedIn: true,
      tierOptIns: buildDefaultTierOptIns(true),
      amounts: buildInitialAmounts(),
      tickerAmounts: buildInitialTickerAmounts(),
      mustDropDeadline: Date.now() + 10 * 60 * 60 * 1000 + 44 * 1000,
      mustDropAmount: 12342.5,
      valueMustDropAmount: 7840.25,
      valueMustDropThreshold: 10000,
      mustDropDrawerOpen: false,
      activeMustDropType: 'time',
      personalAmount: 42.18,
      personalSeed: 1,
      megaWinRoll: null,
      lastWinAmount: 0,
      mustDropHeatPreview: false,
      mustDropFinalePreview: false,
      mustDropSeed: 8500,
      mustDropLaunched: true,
      mustDropExiting: false,
      mustDropDrained: false,
      mustDropFinaleStartAmount: 12342.5,

      toggleMustDropHeatPreview: () => {
        const { mustDropHeatPreview, mustDropFinalePreview, mustDropLaunched, mustDropExiting } =
          get()
        if (!mustDropLaunched || mustDropExiting) return
        if (!mustDropHeatPreview) {
          set({ mustDropHeatPreview: true, mustDropFinalePreview: false })
        } else if (!mustDropFinalePreview) {
          set({
            mustDropFinalePreview: true,
            mustDropFinaleStartAmount: get().mustDropAmount,
          })
        }
      },

      beginMustDropExit: () => {
        if (get().mustDropExiting) return
        set({
          mustDropDrained: true,
          mustDropExiting: true,
          mustDropHeatPreview: false,
          mustDropFinalePreview: false,
          mustDropAmount: 0,
        })
      },

      completeMustDropWin: () =>
        set({
          mustDropExiting: false,
          mustDropDrained: false,
          mustDropHeatPreview: false,
          mustDropFinalePreview: false,
          mustDropLaunched: false,
          mustDropAmount: 0,
          mustDropFinaleStartAmount: get().mustDropSeed,
        }),

      launchMustDrop: () =>
        set({
          mustDropLaunched: true,
          mustDropExiting: false,
          mustDropDrained: false,
          mustDropAmount: get().mustDropSeed,
          mustDropFinaleStartAmount: get().mustDropSeed,
          mustDropDeadline: Date.now() + 10 * 60 * 60 * 1000 + 44 * 1000,
          mustDropHeatPreview: false,
          mustDropFinalePreview: false,
        }),

      setOptedIn: (optedIn) =>
        set({
          optedIn,
          tierOptIns: buildDefaultTierOptIns(optedIn),
        }),

      toggleOptedIn: () => {
        const next = !get().optedIn
        set({
          optedIn: next,
          tierOptIns: buildDefaultTierOptIns(next),
        })
      },

      setTierOptIn: (_tierId, enabled) => {
        get().setOptedIn(enabled)
      },

      toggleTierOptIn: (_tierId) => {
        get().toggleOptedIn()
      },

      getSpinAddonTotal: () => getJackpotSpinAddonTotal(get().tierOptIns),

      setMustDropDrawerOpen: (open) => set({ mustDropDrawerOpen: open }),

      startMegaWinRoll: (durationMs, delayMs = 0, winAmount) => {
        const fromAmount = get().tickerAmounts.mega
        const payout = winAmount ?? fromAmount
        const startedAt = Date.now() + delayMs
        set({
          lastWinAmount: payout,
          megaWinRoll: {
            fromAmount,
            winAmount: payout,
            startedAt,
            durationMs,
          },
        })
      },

      completeMegaWinRoll: () => {
        const roll = get().megaWinRoll
        if (!roll) return

        const nextMega = +Math.max(0, roll.fromAmount - roll.winAmount).toFixed(2)
        set({
          megaWinRoll: null,
          tickerAmounts: {
            ...get().tickerAmounts,
            mega: nextMega,
          },
          amounts: {
            ...get().amounts,
            mega: nextMega,
          },
        })
      },

      cancelMegaWinRoll: () => {
        if (get().megaWinRoll) {
          get().completeMegaWinRoll()
        }
      },

      registerJackpotWin: (tier) => {
        const payout = get().tickerAmounts[tier]
        const seed =
          JACKPOT_TICKER_TIERS.find((t) => t.id === tier)?.seedAmount ?? 0
        const tickerAmounts = { ...get().tickerAmounts, [tier]: seed }
        const amounts = { ...get().amounts }
        if (tier in amounts) {
          amounts[tier as JackpotTierId] = seed
        }
        set({ lastWinAmount: payout, tickerAmounts, amounts })
        return payout
      },

      registerPersonalWin: () => {
        const payout = get().personalAmount
        const seed = get().personalSeed
        set({ lastWinAmount: payout, personalAmount: seed })
        return payout
      },

      tickAmounts: () => {
        const amounts = { ...get().amounts }
        JACKPOT_TIERS.forEach((tier) => {
          if (tier.id === 'mega' && get().megaWinRoll) return
          const delta =
            tier.tickMin + Math.random() * (tier.tickMax - tier.tickMin)
          amounts[tier.id] = +(amounts[tier.id] + delta).toFixed(2)
        })

        const tickerAmounts = { ...get().tickerAmounts }
        JACKPOT_TICKER_TIERS.forEach((tier) => {
          if (tier.id === 'mega' && get().megaWinRoll) return
          const delta =
            tier.tickMin + Math.random() * (tier.tickMax - tier.tickMin)
          tickerAmounts[tier.id] = +(tickerAmounts[tier.id] + delta).toFixed(2)
        })

        const personalDelta = 0.02 + Math.random() * 0.18
        const valueMustDelta = 0.8 + Math.random() * 4.5

        set({
          amounts,
          tickerAmounts,
          mustDropAmount:
            !get().mustDropLaunched ||
            get().mustDropExiting ||
            get().mustDropDrained ||
            get().mustDropFinalePreview ||
            get().mustDropHeatPreview
              ? get().mustDropAmount
              : +(
                  get().mustDropAmount +
                  Math.random() * 8 +
                  1
                ).toFixed(2),
          valueMustDropAmount: +Math.min(
            get().valueMustDropThreshold - 0.01,
            get().valueMustDropAmount + valueMustDelta
          ).toFixed(2),
          personalAmount: +(get().personalAmount + personalDelta).toFixed(2),
        })
      },
    }),
    {
      name: 'bol-jackpot',
      partialize: (state) => ({
        optedIn: state.optedIn,
        tierOptIns: state.tierOptIns,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<JackpotState> | undefined
        if (!p) return current
        const optedIn = p.optedIn ?? optedInFromTiers(p.tierOptIns ?? current.tierOptIns)
        const tierOptIns = buildDefaultTierOptIns(optedIn)
        return {
          ...current,
          ...p,
          tierOptIns,
          optedIn,
        }
      },
    }
  )
)
