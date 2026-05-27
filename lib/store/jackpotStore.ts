import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  JACKPOT_TICKER_TIERS,
  JACKPOT_TIERS,
  type JackpotTierId,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'

type TierAmounts = Record<JackpotTierId, number>
type TickerAmounts = Record<JackpotTickerTierId, number>

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

interface JackpotState {
  optedIn: boolean
  amounts: TierAmounts
  tickerAmounts: TickerAmounts
  mustDropDeadline: number
  mustDropAmount: number
  mustDropDrawerOpen: boolean
  setOptedIn: (optedIn: boolean) => void
  toggleOptedIn: () => void
  setMustDropDrawerOpen: (open: boolean) => void
  tickAmounts: () => void
}

export const useJackpotStore = create<JackpotState>()(
  persist(
    (set, get) => ({
      optedIn: true,
      amounts: buildInitialAmounts(),
      tickerAmounts: buildInitialTickerAmounts(),
      mustDropDeadline: Date.now() + 10 * 60 * 60 * 1000 + 44 * 1000,
      mustDropAmount: 12342.5,
      mustDropDrawerOpen: false,

      setOptedIn: (optedIn) => set({ optedIn }),
      toggleOptedIn: () => set({ optedIn: !get().optedIn }),
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
      partialize: (state) => ({ optedIn: state.optedIn }),
    }
  )
)
