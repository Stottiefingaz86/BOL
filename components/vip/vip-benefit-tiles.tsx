'use client'

import React, { useCallback, useRef, useState } from 'react'
import { fireConfetti } from '@/lib/confetti'
import { toast } from 'sonner'
import { playSound } from '@/lib/sounds'
import {
  IconArrowUp,
  IconBolt,
  IconCalendarStats,
  IconCheck,
  IconChartBar,
  IconDiamond,
  IconGift,
  IconLock,
  IconRefresh,
  IconRotateClockwise,
  IconSoccerField,
  IconSparkles,
} from '@tabler/icons-react'
import { useAuthSession } from '@/hooks/use-auth-session'
import { VipLoggedOutCta } from '@/components/vip/vip-logged-out-cta'
import { rewardAccentStyle } from '@/components/vip/reward-accent'
import { cn } from '@/lib/utils'

type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Host'

export interface VipBenefitTile {
  id: string
  name: string
  icon: React.ReactNode
  /** Amount currently claimable (in dollars). When >= 0 and no requiredTier, the CTA is the claim button. */
  claimable?: number
  /** Tier required to unlock. Locked tiles render a "Reach <Tier>" gated state. */
  requiredTier?: Tier
  /** When true, renders a dashed-border + "Host to add" gated state. */
  hostGated?: boolean
}

interface VipBenefitTilesProps {
  tiles?: VipBenefitTile[]
  onClaim?: (tile: VipBenefitTile) => void
  onTileClick?: (tile: VipBenefitTile) => void
  className?: string
}

const DEFAULT_TILES: VipBenefitTile[] = [
  {
    id: 'instant-rakeback',
    name: 'Instant Rakeback',
    icon: <IconArrowUp className="w-6 h-6" />,
    claimable: 42.5,
  },
  {
    id: 'weekly-boost',
    name: 'Weekly Boost',
    icon: <IconGift className="w-6 h-6" />,
    requiredTier: 'Silver',
  },
  {
    id: 'monthly-bonus',
    name: 'Monthly Bonus',
    icon: <IconDiamond className="w-6 h-6" />,
    requiredTier: 'Bronze',
  },
  {
    id: 'post-monthly',
    name: 'Post-Monthly',
    icon: <IconCalendarStats className="w-6 h-6" />,
    requiredTier: 'Bronze',
  },
  {
    id: 'quarterly-bonus',
    name: 'Quarterly Bonus',
    icon: <IconChartBar className="w-6 h-6" />,
    requiredTier: 'Silver',
  },
  {
    id: 'free-bet',
    name: 'Free Bet',
    icon: <IconSoccerField className="w-6 h-6" />,
    requiredTier: 'Gold',
  },
  {
    id: 'free-spins',
    name: 'Free Spins',
    icon: <IconRotateClockwise className="w-6 h-6" />,
    requiredTier: 'Gold',
  },
  {
    id: 'reloads',
    name: 'Reloads',
    icon: <IconRefresh className="w-6 h-6" />,
    requiredTier: 'Platinum',
  },
  {
    id: 'lossback',
    name: 'Lossback',
    icon: <IconBolt className="w-6 h-6" />,
    requiredTier: 'Platinum',
  },
  {
    id: 'vip-bonus',
    name: 'VIP Bonus',
    icon: <IconSparkles className="w-6 h-6" />,
    hostGated: true,
  },
]

function formatClaim(value: number): string {
  return `$${value.toFixed(2)}`
}

function fireClaimConfetti(buttonEl: HTMLElement | null) {
  // Resolve the brand color at runtime so confetti picks up per-page primary
  // overrides (sports themes, etc.).
  let primary = '#ee3536'
  if (typeof window !== 'undefined') {
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue('--ds-primary')
      .trim()
    if (computed) primary = computed
  }
  const colors = [primary, '#ffffff', '#fef3c7', '#fde68a']

  const origin =
    buttonEl && typeof window !== 'undefined'
      ? (() => {
          const r = buttonEl.getBoundingClientRect()
          return {
            x: (r.left + r.width / 2) / window.innerWidth,
            y: (r.top + r.height / 2) / window.innerHeight,
          }
        })()
      : { x: 0.5, y: 0.6 }

  // `fireConfetti` routes through `lib/confetti.ts`, which owns its own
  // canvas at the maximum z-index — guaranteed to render above the Vaul
  // drawer (z-index 9999) regardless of which feature fired confetti first.
  fireConfetti({
    particleCount: 70,
    startVelocity: 38,
    spread: 70,
    ticks: 200,
    gravity: 0.9,
    scalar: 0.9,
    origin,
    colors,
  })
  setTimeout(() => {
    fireConfetti({
      particleCount: 35,
      angle: 60,
      spread: 55,
      origin: { x: Math.max(0, origin.x - 0.15), y: origin.y },
      colors,
    })
    fireConfetti({
      particleCount: 35,
      angle: 120,
      spread: 55,
      origin: { x: Math.min(1, origin.x + 0.15), y: origin.y },
      colors,
    })
  }, 120)
}

interface TileProps {
  tile: VipBenefitTile
  onClaim?: (tile: VipBenefitTile) => void
  onClick?: (tile: VipBenefitTile) => void
}

function Tile({ tile, onClaim, onClick }: TileProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [claimed, setClaimed] = useState(false)
  const { isLoggedIn } = useAuthSession()

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    el.style.setProperty('--spot-opacity', '1')
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--spot-opacity', '0')
  }, [])

  const handleClaim = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (claimed) return

      const amount = tile.claimable ?? 0

      // 1) Sound — redeem cue.
      playSound('redeem')

      // 2) Confetti
      fireClaimConfetti(buttonRef.current)

      // 3) Toast — delayed so it lands as the confetti winds down rather
      //    than competing with the celebration. The click sound plays at
      //    toast time as a separate cue from the redeem sound.
      window.setTimeout(() => {
        playSound('button-click')
        toast.success(`Claimed ${formatClaim(amount)}`, {
          description: `${tile.name} has been added to your balance.`,
          duration: 3500,
        })
      }, 2000)

      // 4) Increase the global balance — every page already listens for this
      //    event and updates its rain/display balance accordingly.
      if (typeof window !== 'undefined' && amount > 0) {
        window.dispatchEvent(
          new CustomEvent('notification:claim-reward', { detail: { amount } })
        )
      }

      // 5) Local claimed state — the button flips to "Claimed".
      setClaimed(true)

      // 5) Forward to consumer.
      onClaim?.(tile)
    },
    [claimed, tile, onClaim]
  )

  const isClaimable = typeof tile.claimable === 'number' && !tile.requiredTier && !tile.hostGated
  const isHostGated = !!tile.hostGated
  const isLocked = !isClaimable && !isHostGated

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick?.(tile)}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-[var(--ds-overlay)] p-3 transition-colors duration-200',
        'border',
        isHostGated
          ? 'border-dashed border-[var(--ds-border-strong)]'
          : 'border-[var(--ds-control-border)] hover:border-[var(--ds-border-strong)]',
        isLocked && 'opacity-95'
      )}
      style={{
        // CSS vars used by the spotlight overlay below.
        // @ts-expect-error -- custom CSS vars
        '--spot-x': '50%',
        '--spot-y': '50%',
        '--spot-opacity': '0',
      }}
    >
      {/* Hover spotlight that follows the cursor — tinted with brand primary */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          background:
            'radial-gradient(220px circle at var(--spot-x) var(--spot-y), rgba(238, 53, 54, 0.18), transparent 60%)',
          opacity: 'var(--spot-opacity)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center min-h-[148px]">
        {/* Colored gradient chip — unique per reward for scannability */}
        <div
          className={cn(
            'mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl text-[var(--ds-fg)]',
            isHostGated && 'opacity-45 grayscale',
            isLocked && !isHostGated && 'opacity-70'
          )}
          style={rewardAccentStyle(tile.name)}
        >
          {tile.icon}
        </div>

        {/* Name — allowed to wrap up to 2 lines */}
        <div
          className={cn(
            'text-[13px] font-semibold leading-snug mb-3 px-1',
            'line-clamp-2 break-words',
            isHostGated ? 'text-[var(--ds-fg-subtle)]' : 'text-[var(--ds-fg)]'
          )}
        >
          {tile.name}
        </div>

        {/* CTA pinned to the bottom of the card */}
        <div className="relative z-10 mt-auto w-full">
          {!isLoggedIn ? (
            <VipLoggedOutCta compact />
          ) : isClaimable ? (
            claimed ? (
              <div className="w-full h-9 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-400">
                <IconCheck className="w-3.5 h-3.5" />
                Claimed
              </div>
            ) : (
              <button
                ref={buttonRef}
                type="button"
                onClick={handleClaim}
                style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                className={cn(
                  'w-full h-9 rounded-md text-[11px] font-bold uppercase tracking-wider',
                  'text-[var(--ds-fg)] hover:brightness-110 transition-[filter] duration-150'
                )}
              >
                Claim {formatClaim(tile.claimable ?? 0)}
              </button>
            )
          ) : isHostGated ? (
            <div className="w-full h-9 rounded-md text-[11px] font-medium flex items-center justify-center gap-1.5 bg-white/[0.03] border border-dashed border-[var(--ds-border-strong)] text-[var(--ds-fg-subtle)]">
              <IconLock className="w-3 h-3" />
              Host to add
            </div>
          ) : (
            <div className="w-full h-9 rounded-md text-[11px] font-medium flex items-center justify-center gap-1.5 bg-white/[0.03] border border-[var(--ds-control-border)] text-[var(--ds-fg-subtle)]">
              <IconLock className="w-3 h-3" />
              Reach {tile.requiredTier}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function VipBenefitTiles({
  tiles = DEFAULT_TILES,
  onClaim,
  onTileClick,
  className,
}: VipBenefitTilesProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2.5', className)}>
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} onClaim={onClaim} onClick={onTileClick} />
      ))}
    </div>
  )
}

export default VipBenefitTiles
