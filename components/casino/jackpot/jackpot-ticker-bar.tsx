'use client'

import {
  JACKPOT_TICKER_TIERS,
  formatJackpotCompact,
  type JackpotTickerTierConfig,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { cn } from '@/lib/utils'

interface JackpotTickerBarProps {
  className?: string
  /** Readable compact strip for game launcher header */
  dense?: boolean
  /** Flat single-line cells — embed beside opt-in in launcher row */
  embedded?: boolean
  onNavigateToJackpots?: () => void
}

function tierGlowColor(accent: string): string {
  if (accent.startsWith('var(')) return '#ee3536'
  return accent
}

function TickerCell({
  tier,
  amount,
  onClick,
  dense,
  embedded,
}: {
  tier: JackpotTickerTierConfig
  amount: number
  onClick: () => void
  dense?: boolean
  embedded?: boolean
}) {
  const glow = tierGlowColor(tier.accent)
  const formatted = formatJackpotCompact(amount)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${tier.label} jackpot ${amount}`}
      className={cn(
        'relative min-w-0 w-full overflow-hidden text-center transition-colors',
        embedded
          ? 'flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 hover:bg-white/[0.03] md:gap-0 md:px-1 md:py-1'
          : cn(
              'flex flex-col items-center justify-center',
              dense
                ? 'gap-1.5 px-2 py-2.5 hover:bg-white/[0.03]'
                : 'gap-1 px-2 py-3 hover:bg-white/[0.04]'
            )
      )}
    >
      <span
        className={cn(
          'absolute inset-x-0 top-0 z-[1] pointer-events-none',
          embedded ? 'h-px' : 'h-0.5'
        )}
        style={{ backgroundColor: glow }}
      />
      {embedded ? (
        <>
          <span
            className="relative z-[2] text-[10px] font-bold uppercase leading-none tracking-wide md:text-[9px]"
            style={{ color: glow }}
          >
            {tier.shortLabel}
          </span>
          <span className="relative z-[2] max-w-full truncate text-[11px] font-semibold tabular-nums leading-none text-white md:text-[10px]">
            {formatted}
          </span>
        </>
      ) : (
        <>
          <span
            className={cn(
              'relative z-[2] w-full font-bold uppercase tracking-[0.14em] leading-none',
              dense ? 'text-[11px] sm:text-xs' : 'text-[11px]'
            )}
            style={{ color: glow }}
          >
            {tier.shortLabel}
          </span>
          <span className="relative z-[2] flex w-full items-center justify-center px-0.5">
            {dense ? (
              <span className="max-w-full truncate text-xs font-semibold tabular-nums leading-none text-white sm:text-[13px]">
                {formatted}
              </span>
            ) : (
              <JackpotTickingAmount
                value={amount}
                size="sm"
                className="max-w-full min-w-0 justify-center leading-none text-white text-sm"
              />
            )}
          </span>
        </>
      )}
    </button>
  )
}

export function JackpotTickerBar({
  className,
  dense = false,
  embedded = false,
  onNavigateToJackpots,
}: JackpotTickerBarProps) {
  const tickerAmounts = useJackpotStore((s) => s.tickerAmounts)

  const handleTierClick = (_tierId: JackpotTickerTierId) => {
    if (onNavigateToJackpots) {
      onNavigateToJackpots()
    }
  }

  return (
    <div
      className={cn(
        'relative w-full min-w-0 overflow-hidden',
        embedded
          ? 'bg-transparent'
          : 'rounded-lg border border-white/10 bg-[#121212]/80',
        className
      )}
    >
      <div className="grid w-full grid-cols-4 divide-x divide-white/10">
        {JACKPOT_TICKER_TIERS.map((tier) => (
          <TickerCell
            key={tier.id}
            tier={tier}
            amount={tickerAmounts[tier.id]}
            onClick={() => handleTierClick(tier.id)}
            dense={dense}
            embedded={embedded}
          />
        ))}
      </div>
    </div>
  )
}
