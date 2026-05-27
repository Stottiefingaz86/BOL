'use client'

import { useRef, useState } from 'react'
import {
  JACKPOT_TICKER_TIERS,
  type JackpotTickerTierConfig,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
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
  isFirst,
  isMustDrop,
}: {
  tier: JackpotTickerTierConfig
  amount: number
  onClick: () => void
  isFirst?: boolean
  /** Daily column — must-drop pool + drawer */
  isMustDrop?: boolean
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
      aria-label={
        isMustDrop
          ? 'Daily must-drop jackpot — guaranteed before midnight. Open details.'
          : `${tier.label} jackpot`
      }
      onMouseMove={handleMove}
      onMouseEnter={handleMove}
      onMouseLeave={() => setHoverGlow((g) => ({ ...g, on: false }))}
      className={cn(
        'relative min-w-0 w-full overflow-hidden py-2.5 px-2',
        'flex flex-col items-center justify-center gap-1',
        'cursor-pointer transition-colors hover:bg-white/[0.04]',
        !isFirst && 'border-l border-white/10'
      )}
    >
      {/* Per-tier top accent line */}
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
        className="relative z-[2] text-[8px] font-semibold uppercase tracking-[0.16em] mt-1.5 truncate max-w-full px-1"
        style={{ color: tier.accent }}
      >
        {tier.shortLabel}
      </span>
      {isMustDrop && (
        <span className="relative z-[2] text-[7px] font-medium uppercase tracking-[0.1em] text-white/40 leading-none -mt-0.5 text-center px-0.5">
          Must drop · before midnight
        </span>
      )}
      <span className="relative z-[2] w-full max-w-full overflow-hidden flex justify-center min-h-[14px]">
        <JackpotTickingAmount
          value={amount}
          size="xs"
          className="max-w-full"
        />
      </span>
    </button>
  )
}

export function JackpotTickerBar({
  className,
  onNavigateToJackpots,
}: JackpotTickerBarProps) {
  const tickerAmounts = useJackpotStore((s) => s.tickerAmounts)
  const mustDropAmount = useJackpotStore((s) => s.mustDropAmount)
  const setMustDropDrawerOpen = useJackpotStore((s) => s.setMustDropDrawerOpen)

  const handleTierClick = (tierId: JackpotTickerTierId) => {
    if (tierId === 'daily') {
      setMustDropDrawerOpen(true)
      return
    }
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
      <div className="relative grid grid-cols-5 w-full">
        {JACKPOT_TICKER_TIERS.map((tier, i) => {
          const isDaily = tier.id === 'daily'
          return (
            <TickerCell
              key={tier.id}
              tier={tier}
              amount={isDaily ? mustDropAmount : tickerAmounts[tier.id]}
              onClick={() => handleTierClick(tier.id)}
              isFirst={i === 0}
              isMustDrop={isDaily}
            />
          )
        })}
      </div>
    </div>
  )
}
