'use client'

import { useEffect, useRef } from 'react'
import {
  IconArrowUp,
  IconCalendarStats,
  IconCrown,
  IconGift,
  IconRefresh,
} from '@tabler/icons-react'
import { rewardAccentStyle } from '@/components/vip/reward-accent'
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

/** Idle crawl speed — matches VIP Hub Level Up reel feel */
const IDLE_MS_PER_TILE = 900

function TierTile({
  tier,
  width,
  compact,
}: {
  tier: TierName
  width: number
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col items-center justify-center rounded-lg bg-white/[0.06]',
        compact ? 'gap-1.5 px-1 py-3' : 'gap-2 py-4'
      )}
      style={{ width }}
    >
      <IconCrown
        className={compact ? 'h-7 w-7' : 'h-9 w-9'}
        strokeWidth={1.8}
        style={{ color: TIER_ACCENT[tier] }}
      />
      <span
        className={cn(
          'font-medium text-white/70',
          compact ? 'text-[10px] leading-none' : 'text-xs'
        )}
      >
        {tier}
      </span>
    </div>
  )
}

/**
 * Continuous idle crown reel — same pattern as VIP Hub Level Up spinner crawl.
 * Duplicated strip + translateX loop, no jump cuts.
 * Must stay inside overflow-hidden + min-w-0 ancestors or the strip blows out mobile width.
 */
export function CrownSlotReel({ compact }: { compact?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const strip = [...TIERS, ...TIERS]
  const tileW = compact ? 76 : 104
  const tileGap = compact ? 8 : 12
  const step = tileW + tileGap
  const loopWidth = TIERS.length * step
  const focusW = tileW + 4

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
    <div className="relative w-full min-w-0 max-w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0.5 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-[var(--ds-primary,#ee3536)]/40"
        style={{ width: focusW }}
      />

      <div
        className="w-full min-w-0 overflow-hidden py-1"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max max-w-none will-change-transform"
          style={{ gap: tileGap }}
        >
          {strip.map((tier, i) => (
            <TierTile
              key={`${tier}-${i}`}
              tier={tier}
              width={tileW}
              compact={compact}
            />
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
    <div
      className={cn(
        'mb-6 w-full max-w-full min-w-0',
        isMobile ? 'px-3' : 'px-6',
        className
      )}
    >
      <div
        className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-white/10"
        style={{ backgroundColor: 'rgba(20, 20, 20, 0.85)' }}
      >
        <div
          className={cn(
            'grid w-full min-w-0 items-center p-4',
            isMobile ? 'gap-5' : 'gap-6 md:grid-cols-2 md:gap-8 md:p-6'
          )}
        >
          {/* Benefits — 2×2; min-w-0 so grid tracks can shrink on narrow screens */}
          <div
            className={cn(
              'grid w-full min-w-0 grid-cols-2 gap-2',
              isMobile ? 'order-2' : 'order-1 md:gap-2.5'
            )}
          >
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.id}
                  className={cn(
                    'min-w-0 overflow-hidden rounded-xl bg-white/[0.04]',
                    isMobile ? 'p-2.5' : 'p-3'
                  )}
                >
                  <div
                    className={cn(
                      'mb-2 flex items-center justify-center rounded-xl text-white/95',
                      isMobile ? 'h-9 w-9' : 'mb-2.5 h-12 w-12'
                    )}
                    style={rewardAccentStyle(benefit.id)}
                  >
                    <Icon
                      className={isMobile ? 'h-[18px] w-[18px]' : 'h-6 w-6'}
                      strokeWidth={1.6}
                    />
                  </div>
                  <div
                    className={cn(
                      'break-words font-semibold leading-snug text-white',
                      isMobile ? 'mb-0.5 text-[12px]' : 'mb-1 text-[13px]'
                    )}
                  >
                    {benefit.title}
                  </div>
                  <p
                    className={cn(
                      'break-words leading-snug text-white/45',
                      isMobile ? 'line-clamp-2 text-[10px]' : 'text-xs'
                    )}
                  >
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* CTA + crown reel — first on mobile; w-full min-w-0 contains the reel */}
          <div
            className={cn(
              'flex w-full min-w-0 flex-col items-center justify-center text-center',
              isMobile ? 'order-1 gap-4' : 'order-2 gap-5'
            )}
          >
            <h3
              className={cn(
                'w-full max-w-[320px] font-semibold leading-snug text-white',
                isMobile ? 'text-[15px]' : 'text-base md:text-lg'
              )}
            >
              Become a VIP the moment
              <br />
              you place your first bet.
            </h3>

            <CrownSlotReel compact={isMobile} />

            {!isMobile && (
              <p className="max-w-[300px] text-sm text-white/50">
                Climb every VIP rank from Bronze to Obsidian and unlock bigger
                rewards along the way.
              </p>
            )}

            <button
              type="button"
              onClick={onExplore}
              style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
              className={cn(
                'h-10 w-full rounded-md font-bold uppercase tracking-wider text-white transition-[filter] duration-150 hover:brightness-110',
                isMobile ? 'text-[11px]' : 'max-w-[240px] text-xs'
              )}
            >
              Explore VIP Rewards
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
