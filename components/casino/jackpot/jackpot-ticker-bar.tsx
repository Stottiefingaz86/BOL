'use client'

import {
  JACKPOT_TICKER_TIERS,
  type JackpotTickerTierConfig,
} from '@/lib/jackpot/constants'
import { useActiveMustDrop } from '@/lib/jackpot/use-active-must-drop'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import {
  JackpotInlineStrip,
  type InlineJackpotItem,
} from '@/components/casino/jackpot/jackpot-inline-strip'
import { useMegaTickerDisplayAmount } from '@/components/casino/jackpot/use-mega-ticker-display-amount'
import { cn } from '@/lib/utils'

interface JackpotTickerBarProps {
  className?: string
  /** Readable compact strip for game launcher header */
  dense?: boolean
  /** Flat single-line cells — embed beside opt-in in launcher row */
  embedded?: boolean
  onNavigateToJackpots?: () => void
}

export function JackpotTickerBar({
  className,
  dense = false,
  embedded = false,
  onNavigateToJackpots,
}: JackpotTickerBarProps) {
  const tickerAmounts = useJackpotStore((s) => s.tickerAmounts)
  const mustDrop = useActiveMustDrop()
  const { amount: megaDisplayAmount } = useMegaTickerDisplayAmount()

  const amountForTier = (tierId: JackpotTickerTierConfig['id']) =>
    tierId === 'mega' ? megaDisplayAmount : tickerAmounts[tierId]

  const mustDropItem: InlineJackpotItem | null = mustDrop.isVisible
    ? {
        key: 'must-drop',
        label: 'MUST DROP',
        accent: mustDrop.accent,
        amount: mustDrop.displayAmount,
        detail: mustDrop.sublabel,
        icon: mustDrop.isHeatingUp ? 'flame' : 'hourglass',
        heatingUp: mustDrop.isHeatingUp,
        critical: mustDrop.isCritical,
        isFinale: mustDrop.isFinale,
        heatFade: mustDrop.heatFade,
        isExiting: mustDrop.isExiting,
        amountFlowDuration: mustDrop.amountFlowDuration,
        finaleSeconds: mustDrop.finaleSeconds,
      }
    : null

  const items = mustDropItem
    ? [mustDropItem, ...JACKPOT_TICKER_TIERS.map((tier) => ({
        key: tier.id,
        label: tier.shortLabel,
        accent: tier.accent,
        amount: amountForTier(tier.id),
      }))]
    : JACKPOT_TICKER_TIERS.map((tier) => ({
        key: tier.id,
        label: tier.shortLabel,
        accent: tier.accent,
        amount: amountForTier(tier.id),
      }))

  return (
    <button
      type="button"
      onClick={onNavigateToJackpots}
      className={cn(
        'relative w-full min-w-0 overflow-hidden text-left',
        embedded
          ? 'bg-transparent'
          : 'rounded-lg border border-white/10 bg-[#121212]/80',
        onNavigateToJackpots && 'cursor-pointer hover:bg-white/[0.02]',
        className
      )}
      aria-label="Live jackpot amounts"
    >
      <JackpotInlineStrip
        items={items}
        heightClass={dense || embedded ? 'h-9' : 'h-10'}
      />
    </button>
  )
}
