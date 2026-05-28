'use client'

import { useRef, useState } from 'react'
import {
  JACKPOT_TICKER_TIERS,
  type JackpotTickerTierConfig,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface JackpotTickerBarProps {
  className?: string
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
  compact,
}: {
  tier: JackpotTickerTierConfig
  amount: number
  onClick: () => void
  compact?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hoverGlow, setHoverGlow] = useState({ x: 50, y: 50, on: false })
  const glow = tierGlowColor(tier.accent)

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setHoverGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      on: true,
    })
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`${tier.label} jackpot`}
      onMouseMove={handleMove}
      onMouseEnter={handleMove}
      onMouseLeave={() => setHoverGlow((g) => ({ ...g, on: false }))}
      className={cn(
        'relative min-w-0 w-full overflow-hidden',
        'flex flex-col items-center justify-center gap-0.5',
        'cursor-pointer transition-colors hover:bg-white/[0.04]',
        compact ? 'px-1 py-2.5' : 'px-2 py-3'
      )}
    >
      <span
        className="absolute inset-x-0 top-0 h-[2px] z-[3] pointer-events-none"
        style={{ backgroundColor: glow }}
      />
      <span
        className="absolute inset-x-0 top-0 h-5 pointer-events-none z-0"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${glow} 10%, transparent), transparent)`,
        }}
      />
      <span
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-[1]"
        style={{
          opacity: hoverGlow.on ? 1 : 0,
          background: `radial-gradient(72px circle at ${hoverGlow.x}% ${hoverGlow.y}%, color-mix(in srgb, ${glow} 14%, transparent), transparent 70%)`,
        }}
      />
      <span
        className={cn(
          'relative z-[2] w-full text-center font-semibold uppercase truncate',
          compact
            ? 'text-[7px] tracking-wide mt-1 px-0.5'
            : 'text-[8px] tracking-[0.12em] mt-1.5 px-1'
        )}
        style={{ color: tier.accent }}
      >
        {tier.shortLabel}
      </span>
      <span className="relative z-[2] flex w-full min-h-[20px] items-center justify-center overflow-hidden">
        <JackpotTickingAmount
          value={amount}
          size={compact ? 'xs' : 'sm'}
          className="max-w-full min-w-0 justify-center leading-none md:text-base"
        />
      </span>
    </button>
  )
}

export function JackpotTickerBar({
  className,
  onNavigateToJackpots,
}: JackpotTickerBarProps) {
  const isMobile = useIsMobile()
  const tickerAmounts = useJackpotStore((s) => s.tickerAmounts)

  const handleTierClick = (_tierId: JackpotTickerTierId) => {
    if (onNavigateToJackpots) {
      onNavigateToJackpots()
    }
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border border-white/10 bg-white/5 overflow-hidden w-full min-w-0',
        className
      )}
    >
      <div className="relative grid grid-cols-4 w-full divide-x divide-white/10">
        {JACKPOT_TICKER_TIERS.map((tier) => (
          <TickerCell
            key={tier.id}
            tier={tier}
            amount={tickerAmounts[tier.id]}
            onClick={() => handleTierClick(tier.id)}
            compact={isMobile}
          />
        ))}
      </div>
    </div>
  )
}
