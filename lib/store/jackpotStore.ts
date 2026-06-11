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

interface JackpotState {
  optedIn: boolean
  tierOptIns: TierOptIns
  amounts: TierAmounts
  tickerAmounts: TickerAmounts
  mustDropDeadline: number
  mustDropAmount: number
  mustDropDrawerOpen: boolean
  setOptedIn: (optedIn: boolean) => void
  toggleOptedIn: () => void
  setTierOptIn: (tierId: JackpotTierId, enabled: boolean) => void
  toggleTierOptIn: (tierId: JackpotTierId) => void
  getSpinAddonTotal: () => number
  setMustDropDrawerOpen: (open: boolean) => void
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
      mustDropDrawerOpen: false,

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

      tickAmounts: () => {
        const amounts = { ...get().amounts }
        JACKPOT_TIERS.forEach((tier) => {
          const delta =
            tier.tickMin + Math.random() * (tier.tickMax - tier.tickMin)
          amounts[tier.id] = +(amounts[tier.id] + delta).toFixed(2)
        })

        const tickerAmounts = { ...get().tickerAmounts }
        JACKPOT_TICKER_TIERS.forEach((tier) => {
          const delta =
            tier.tickMin + Math.random() * (tier.tickMax - tier.tickMin)
          tickerAmounts[tier.id] = +(tickerAmounts[tier.id] + delta).toFixed(2)
        })

        set({
          amounts,
          tickerAmounts,
          mustDropAmount: +(
            get().mustDropAmount +
            Math.random() * 8 +
            1
          ).toFixed(2),
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
