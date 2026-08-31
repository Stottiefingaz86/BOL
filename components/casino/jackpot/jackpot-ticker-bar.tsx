'use client'

import { useEffect, useState } from 'react'
import {
  JACKPOT_TICKER_TIERS,
  formatJackpotCompact,
  type JackpotTickerTierConfig,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { cn } from '@/lib/utils'
import { IconHourglass } from '@tabler/icons-react'

interface JackpotTickerBarProps {
  className?: string
  /** Readable compact strip for game launcher header */
  dense?: boolean
  /** Flat single-line cells — embed beside opt-in in launcher row */
  embedded?: boolean
  onNavigateToJackpots?: () => void
}

function useCountdown(deadline: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()))

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
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
  tier: Pick<JackpotTickerTierConfig, 'label' | 'shortLabel' | 'accent'>
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
  const personalAmount = useJackpotStore((s) => s.personalAmount)
  const mustDropAmount = useJackpotStore((s) => s.mustDropAmount)
  const mustDropDeadline = useJackpotStore((s) => s.mustDropDeadline)
  const valueAmount = useJackpotStore((s) => s.valueMustDropAmount)
  const valueThreshold = useJackpotStore((s) => s.valueMustDropThreshold)
  const countdown = useCountdown(mustDropDeadline)

  const handleTierClick = () => {
    if (onNavigateToJackpots) {
      onNavigateToJackpots()
    }
  }

  const personalTier = {
    label: 'Personal Pot',
    shortLabel: 'YOURS',
    accent: 'var(--ds-primary, #ee3536)',
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
      <div className="grid w-full grid-cols-5 divide-x divide-white/10">
        <TickerCell
          tier={personalTier}
          amount={personalAmount}
          onClick={handleTierClick}
          dense={dense}
          embedded={embedded}
        />
        {JACKPOT_TICKER_TIERS.map((tier) => (
          <TickerCell
            key={tier.id}
            tier={tier}
            amount={tickerAmounts[tier.id]}
            onClick={handleTierClick}
            dense={dense}
            embedded={embedded}
          />
        ))}
      </div>
      <div className="grid w-full grid-cols-2 divide-x divide-white/10 border-t border-white/10">
        <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-2 py-1.5 leading-none">
          <span className="inline-flex items-center gap-0.5">
            <IconHourglass className="h-3 w-3 shrink-0 text-sky-300/85" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-sky-200/80">
              Must Drop
            </span>
          </span>
          <span className="inline-flex max-w-full items-baseline gap-1">
            <span className="text-[11px] font-semibold tabular-nums text-white">
              {formatJackpotCompact(mustDropAmount)}
            </span>
            <span className="text-[9px] tabular-nums text-white/40">{countdown}</span>
          </span>
        </div>
        <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-2 py-1.5 leading-none">
          <span className="inline-flex items-center gap-0.5">
            <IconHourglass className="h-3 w-3 shrink-0 text-amber-300/85" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-200/80">
              Must Drop
            </span>
          </span>
          <span className="inline-flex max-w-full items-baseline gap-1">
            <span className="text-[11px] font-semibold tabular-nums text-white">
              {formatJackpotCompact(valueAmount)}
            </span>
            <span className="truncate text-[9px] text-white/40">
              before {formatJackpotCompact(valueThreshold)}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
