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

interface JackpotLauncherMarqueeProps {
  className?: string
}

/** Must Drop + Mini–Mega on one line — game launcher and Jackpots tab. */
export function JackpotLauncherMarquee({ className }: JackpotLauncherMarqueeProps) {
  const tickerAmounts = useJackpotStore((s) => s.tickerAmounts)
  const launchMustDrop = useJackpotStore((s) => s.launchMustDrop)
  const mustDrop = useActiveMustDrop()
  const { amount: megaDisplayAmount } = useMegaTickerDisplayAmount()

  const amountForTier = (tierId: JackpotTickerTierConfig['id']) =>
    tierId === 'mega' ? megaDisplayAmount : tickerAmounts[tierId]

  const tierItems: InlineJackpotItem[] = JACKPOT_TICKER_TIERS.map((tier) => ({
    key: tier.id,
    label: tier.shortLabel,
    accent: tier.accent,
    amount: amountForTier(tier.id),
  }))

  const mustDropItem: InlineJackpotItem | null = mustDrop.isVisible
    ? {
        key: 'must-drop',
        label: 'MUST DROP',
        accent: mustDrop.accent,
        amount: mustDrop.displayAmount,
        detail: mustDrop.detailShort,
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

  const items = mustDropItem ? [mustDropItem, ...tierItems] : tierItems

  return (
    <div
      className={cn('w-full', className)}
      aria-label="Live jackpot amounts"
      onDoubleClick={() => {
        if (!mustDrop.isVisible) launchMustDrop()
      }}
    >
      <JackpotInlineStrip items={items} heightClass="h-9 md:h-12" />
    </div>
  )
}
