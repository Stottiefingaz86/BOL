'use client'

import { useEffect, useRef } from 'react'
import {
  IconArrowUp,
  IconCalendarStats,
  IconCrown,
  IconGift,
  IconRefresh,
} from '@tabler/icons-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

type TierName =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Elite'
  | 'Black'
  | 'Obsidian'

/** Mirror `components/vip/level-up-spinner.tsx` */
const TIER_ACCENT: Record<TierName, string> = {
  Bronze: '#d97706',
  Silver: '#9ca3af',
  Gold: '#facc15',
  Platinum: '#22d3ee',
  Diamond: '#34d399',
  Elite: '#c084fc',
  Black: '#94a3b8',
  Obsidian: '#a855f7',
}

const TIERS: TierName[] = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Elite',
  'Black',
  'Obsidian',
]

const BENEFITS = [
  {
    id: 'weekly-monthly',
    title: 'Weekly & Monthly Rewards',
    description: 'Boosts and bonuses that scale as you climb the VIP ladder.',
    icon: IconCalendarStats,
  },
  {
    id: 'cash-drops',
    title: 'Cash Drops',
    description: 'Exclusive codes from socials and campaigns. Grab them fast.',
    icon: IconGift,
  },
  {
    id: 'reloads',
    title: 'Reloads',
    description: 'Deposit boosts to keep your bankroll rolling.',
    icon: IconRefresh,
  },
  {
    id: 'level-up',
    title: 'Level Up Bonus',
    description: 'Hit a new rank and unlock cash, crates, and more.',
    icon: IconArrowUp,
  },
] as const

const TILE_W = 104
const TILE_GAP = 12
const STEP = TILE_W + TILE_GAP
/** Idle crawl speed — matches VIP Hub Level Up reel feel */
const IDLE_MS_PER_TILE = 900

function TierTile({ tier }: { tier: TierName }) {
  return (
    <div
      className="flex shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] py-4"
      style={{ width: TILE_W }}
    >
      <IconCrown
        className="h-9 w-9"
        strokeWidth={1.8}
        style={{ color: TIER_ACCENT[tier] }}
      />
      <span className="text-xs font-medium text-white/70">{tier}</span>
    </div>
  )
}

/**
 * Continuous idle crown reel — same pattern as VIP Hub Level Up spinner crawl.
 * Duplicated strip + translateX loop, no jump cuts.
 */
function CrownSlotReel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const strip = [...TIERS, ...TIERS]
  const loopWidth = TIERS.length * STEP

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    let raf = 0
    let start: number | null = null
    const duration = TIERS.length * IDLE_MS_PER_TILE

    const tick = (now: number) => {
      if (start === null) start = now
      const t = ((now - start) % duration) / duration
      el.style.transform = `translate3d(${-t * loopWidth}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [loopWidth])

  return (
    <div className="relative w-full max-w-[380px]">
      {/* Center focus — hub primary ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1/2 z-10 w-[108px] -translate-x-1/2 rounded-lg border border-[var(--ds-primary,#ee3536)]/40"
      />

      <div
        className="overflow-hidden py-1"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 14%, black 86%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 14%, black 86%, transparent)',
        }}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: TILE_GAP, width: 'max-content' }}
        >
          {strip.map((tier, i) => (
            <TierTile key={`${tier}-${i}`} tier={tier} />
          ))}
        </div>
      </div>
    </div>
  )
}

export interface VipRewardsPromoProps {
  onExplore: () => void
  className?: string
}

export function VipRewardsPromo({ onExplore, className }: VipRewardsPromoProps) {
  const isMobile = useIsMobile()

  return (
    <div className={cn(isMobile ? 'px-3' : 'px-6', 'mb-6', className)}>
      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="grid items-center gap-6 p-4 md:grid-cols-2 md:gap-8 md:p-6">
          {/* Left — hub benefit tile surface */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3"
                >
                  <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mb-1 text-[13px] font-semibold leading-snug text-white">
                    {benefit.title}
                  </div>
                  <p className="text-xs leading-snug text-white/45">{benefit.description}</p>
                </div>
              )
            })}
          </div>

          {/* Right — slot reel of crowns */}
          <div className="flex flex-col items-center justify-center gap-5 text-center">
            <h3 className="max-w-[320px] text-base font-semibold leading-snug text-white md:text-lg">
              Become a VIP the moment you place your first bet.
            </h3>

            <CrownSlotReel />

            <p className="max-w-[300px] text-sm text-white/50">
              Climb every VIP rank from Bronze to Obsidian and unlock bigger rewards along the way.
            </p>

            <button
              type="button"
              onClick={onExplore}
              style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
              className="h-10 w-full max-w-[240px] rounded-md text-xs font-bold uppercase tracking-wider text-white transition-[filter] duration-150 hover:brightness-110"
            >
              Explore VIP Rewards
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
