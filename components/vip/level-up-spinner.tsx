'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  IconCashBanknote,
  IconChevronDown,
  IconChevronUp,
  IconCrown,
  IconLock,
} from '@tabler/icons-react'
import { fireConfetti } from '@/lib/confetti'
import { cn } from '@/lib/utils'
import { playSound, stopSound } from '@/lib/sounds'
import { toast } from 'sonner'
import { useAuthSession } from '@/hooks/use-auth-session'
import { VipLoggedOutCta } from '@/components/vip/vip-logged-out-cta'

// ---------------------------------------------------------------------------
// Tier data
// ---------------------------------------------------------------------------

// Tier order + colour mirror `components/vip/my-benefits-accordion.tsx`
// (the canonical source of truth for the VIP ladder). Keep them in sync if
// the accordion ever changes.
export type TierName =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Elite'
  | 'Black'
  | 'Obsidian'

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

const TIER_RANK: Record<TierName, number> = {
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Platinum: 4,
  Diamond: 5,
  Elite: 6,
  Black: 7,
  Obsidian: 8,
}

const SUB_LEVELS: Record<TierName, number> = {
  Bronze: 5,
  Silver: 5,
  Gold: 5,
  Platinum: 3,
  Diamond: 3,
  Elite: 3,
  Black: 3,
  Obsidian: 3,
}

/**
 * Per-tier "gem" SVG used as the background of the reel cards.
 * The tier *selector* uses a crown icon instead so the top row stays clean.
 *
 * `null` means we don't have an asset yet — the component falls back to a
 * CSS-rendered gem in the tier's accent colour. Drop a real SVG into
 * `public/lootbox/levels/` (or update the path here) to replace the fallback.
 */
const TIER_IMAGE: Record<TierName, string | null> = {
  Bronze: '/lootbox/levels/bronze.svg',
  Silver: '/lootbox/levels/silver.svg',
  Gold: '/lootbox/levels/gold.svg',
  Platinum: '/lootbox/levels/platinum.svg',
  Diamond: '/lootbox/levels/diamond.svg',
  // No SVG yet — falls through to the CSS-rendered gem in Elite's purple.
  Elite: null,
  Black: '/lootbox/levels/black.svg',
  // File on disk is `obsideon .svg` (typo + trailing space) — URL-encode the
  // space so the asset still resolves. Rename the file to clean this up.
  Obsidian: '/lootbox/levels/obsideon%20.svg',
}

// Crown / gem accent colours — Tailwind hexes from the accordion classes.
// Black + Obsidian are lifted slightly so the crowns are visible against the
// dark drawer background while preserving their tier identity.
const TIER_ACCENT: Record<TierName, { core: string; edge: string; glow: string }> = {
  Bronze: { core: '#d97706', edge: '#7a3d10', glow: '217, 119, 6' }, // amber-600
  Silver: { core: '#9ca3af', edge: '#5e6878', glow: '156, 163, 175' }, // gray-400
  Gold: { core: '#facc15', edge: '#aa7d10', glow: '250, 204, 21' }, // yellow-400
  Platinum: { core: '#22d3ee', edge: '#0e7490', glow: '34, 211, 238' }, // cyan-400
  Diamond: { core: '#34d399', edge: '#047857', glow: '52, 211, 153' }, // emerald-400
  Elite: { core: '#c084fc', edge: '#6b21a8', glow: '192, 132, 252' }, // purple-400
  Black: { core: '#94a3b8', edge: '#1f2937', glow: '148, 163, 184' }, // gray-800 lifted to slate-400
  Obsidian: { core: '#a855f7', edge: '#4c1d95', glow: '168, 85, 247' }, // purple-900 lifted to purple-500
}

// ---------------------------------------------------------------------------
// Reward data
// ---------------------------------------------------------------------------

type RewardKind =
  | 'cash'
  | 'crate-common'
  | 'crate-rare'
  | 'crate-legendary'

type CrateRewardKind = Exclude<RewardKind, 'cash'>

interface Reward {
  id: string
  kind: RewardKind
  /** Long-form label used in the rewards odds table (e.g. "Common Crate"). */
  label: string
  /** Short hero text shown on the reel card (e.g. "$15" or "Common"). */
  amount: string
  /** Numeric cash value — only set for cash rewards. */
  amountRaw?: number
  chance: number
}

/**
 * Same `/lootbox/*.svg` assets as `components/vip/reward-crates.tsx` (MiniCrate / CrateCard).
 */
const CRATE_PAGE_IMAGE: Record<CrateRewardKind, string> = {
  'crate-common': '/lootbox/common.svg',
  'crate-rare': '/lootbox/rare.svg',
  'crate-legendary': '/lootbox/legend.svg',
}

/** Earn-crate event kinds — Common → case-s, Rare → case-m, Legendary → case-xl. */
const CRATE_DISPATCH_KIND: Record<CrateRewardKind, 'case-s' | 'case-m' | 'case-xl'> = {
  'crate-common': 'case-s',
  'crate-rare': 'case-m',
  'crate-legendary': 'case-xl',
}

// Mirrors the Bronze 1 odds in the design reference. For now every
// (tier, sub-level) shares the same pool — easy to differentiate later by
// keying off `${tier}-${subLevel}`.
const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1',  kind: 'cash',             label: 'Cash',             amount: '$1,000',   amountRaw: 1000, chance: 0.05 },
  { id: 'r2',  kind: 'crate-legendary',  label: 'Legendary Crate',  amount: 'Legendary',                  chance: 0.15 },
  { id: 'r3',  kind: 'cash',             label: 'Cash',             amount: '$500',     amountRaw: 500,  chance: 0.4 },
  { id: 'r4',  kind: 'cash',             label: 'Cash',             amount: '$200',     amountRaw: 200,  chance: 1.5 },
  { id: 'r5',  kind: 'crate-rare',       label: 'Rare Crate',       amount: 'Rare',                       chance: 3 },
  { id: 'r6',  kind: 'cash',             label: 'Cash',             amount: '$75',      amountRaw: 75,   chance: 5 },
  { id: 'r7',  kind: 'crate-common',     label: 'Common Crate',     amount: 'Common',                     chance: 8 },
  { id: 'r8',  kind: 'cash',             label: 'Cash',             amount: '$30',      amountRaw: 30,   chance: 12 },
  { id: 'r9',  kind: 'cash',             label: 'Cash',             amount: '$7',       amountRaw: 7,    chance: 28 },
  { id: 'r10', kind: 'cash',             label: 'Cash',             amount: '$1.5',     amountRaw: 1.5,  chance: 41.9 },
]

// ---------------------------------------------------------------------------
// Reel constants
// ---------------------------------------------------------------------------

const CARD_WIDTH = 78
const CARD_HEIGHT = 92
/** Breathing room between gem tiles — keeps the strip readable while spinning */
const CARD_GAP = 18
const STRIP_LENGTH = 60
const SPIN_DURATION_MS = 5500
const SPIN_EASING = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
/** One full copy of the idle strip width (~pixels); animation runs this far for a seamless loop */
function idleStripWidthPx(cardCount: number): number {
  if (cardCount <= 0) return CARD_WIDTH
  return cardCount * (CARD_WIDTH + CARD_GAP) - CARD_GAP
}
/** Keep scroll speed roughly constant when strip length changes (e.g. after a spin) */
const IDLE_MS_PER_CARD = 780

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickWeighted(rewards: Reward[]): Reward {
  const total = rewards.reduce((s, r) => s + r.chance, 0)
  let roll = Math.random() * total
  for (const r of rewards) {
    if (roll < r.chance) return r
    roll -= r.chance
  }
  return rewards[rewards.length - 1]
}

function buildStrip(rewards: Reward[], length: number): Reward[] {
  return Array.from({ length }, () => pickWeighted(rewards))
}

/**
 * Celebratory confetti burst rising from the centre of the reel. Matches the
 * VIP benefit-tile claim flow — same colour palette, same z-index above the
 * Vaul drawer, same multi-burst rhythm.
 */
function fireSpinConfetti(reelEl: HTMLElement | null) {
  let primary = '#ee3536'
  if (typeof window !== 'undefined') {
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue('--ds-primary')
      .trim()
    if (computed) primary = computed
  }
  const colors = [primary, '#ffffff', '#fef3c7', '#fde68a']

  const origin =
    reelEl && typeof window !== 'undefined'
      ? (() => {
          const r = reelEl.getBoundingClientRect()
          return {
            x: (r.left + r.width / 2) / window.innerWidth,
            y: (r.top + r.height / 2) / window.innerHeight,
          }
        })()
      : { x: 0.5, y: 0.5 }

  // `fireConfetti` (lib/confetti.ts) owns a dedicated canvas pinned at the
  // top of the stacking order, so bursts always render above the Vaul drawer.
  fireConfetti({
    particleCount: 90,
    startVelocity: 42,
    spread: 80,
    ticks: 220,
    gravity: 0.9,
    scalar: 0.9,
    origin,
    colors,
  })
  setTimeout(() => {
    fireConfetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: Math.max(0, origin.x - 0.18), y: origin.y },
      colors,
    })
    fireConfetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: Math.min(1, origin.x + 0.18), y: origin.y },
      colors,
    })
  }, 140)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface LevelUpSpinnerProps {
  /** The user's current tier. Defaults to Bronze. */
  currentTier?: TierName
  /** The user's current sub-level (1-N within their tier). */
  currentSubLevel?: number
  className?: string
}

export function LevelUpSpinner({
  currentTier = 'Bronze',
  currentSubLevel = 1,
  className,
}: LevelUpSpinnerProps) {
  const { isLoggedIn } = useAuthSession()
  const [selectedTier, setSelectedTier] = useState<TierName>(currentTier)
  const [selectedSubLevel, setSelectedSubLevel] = useState<number>(currentSubLevel)

  const [strip, setStrip] = useState<Reward[]>(() => buildStrip(DEFAULT_REWARDS, 14))
  const [reelOffset, setReelOffset] = useState(0)
  const [reelTransition, setReelTransition] = useState('none')
  const [spinning, setSpinning] = useState(false)
  /** After a spin lands, hold transform (no idle crawl) until Spin again or hub remount. */
  const [reelFrozenAfterWin, setReelFrozenAfterWin] = useState(false)
  const [winner, setWinner] = useState<Reward | null>(null)

  const reelRef = useRef<HTMLDivElement | null>(null)
  const tierCarouselRef = useRef<HTMLDivElement | null>(null)
  const tierBtnRefs = useRef<Partial<Record<TierName, HTMLButtonElement | null>>>({})

  const idleShiftPx = useMemo(() => idleStripWidthPx(strip.length), [strip.length])
  const idleDurationMs = useMemo(
    () => Math.max(22_000, strip.length * IDLE_MS_PER_CARD),
    [strip.length],
  )

  const isLocked = useMemo(() => {
    const userRank = TIER_RANK[currentTier]
    const selectedRank = TIER_RANK[selectedTier]
    if (userRank > selectedRank) return false
    if (userRank < selectedRank) return true
    return currentSubLevel < selectedSubLevel
  }, [currentTier, currentSubLevel, selectedTier, selectedSubLevel])

  const handleSpin = useCallback(() => {
    if (spinning || isLocked) return

    setReelFrozenAfterWin(false)

    const winningReward = pickWeighted(DEFAULT_REWARDS)
    const winningIndex = STRIP_LENGTH - 8

    const newStrip = buildStrip(DEFAULT_REWARDS, STRIP_LENGTH)
    newStrip[winningIndex] = winningReward
    setStrip(newStrip)
    setWinner(null)
    setSpinning(true)

    // Spin whirr — fires immediately on press and is cut off the moment the
    // reel lands on the result (see stopSound below). If the audio file is
    // shorter than SPIN_DURATION_MS it'll just finish naturally.
    playSound('spin', { volume: 0.55 })

    // Reset position to the start instantly, then trigger the transition on
    // the next frame so the browser actually animates to the target.
    setReelTransition('none')
    setReelOffset(0)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const containerWidth = reelRef.current?.clientWidth ?? 360
        const slotWidth = CARD_WIDTH + CARD_GAP
        const centerOffset = containerWidth / 2 - CARD_WIDTH / 2
        // Small jitter so the reel doesn't always stop dead-centre on the
        // winning card — feels more like a real prize wheel.
        const jitter = (Math.random() - 0.5) * CARD_WIDTH * 0.5
        const target = -(winningIndex * slotWidth - centerOffset) + jitter
        setReelTransition(`transform ${SPIN_DURATION_MS}ms ${SPIN_EASING}`)
        setReelOffset(target)
      })
    })

    window.setTimeout(() => {
      setSpinning(false)
      setWinner(winningReward)
      setReelTransition('none')
      setReelFrozenAfterWin(true)

      // Cut the whirr the instant the reel lands on the prize.
      stopSound('spin')

      // Celebration confetti — rises from the centre of the reel where the
      // winning card has just settled.
      fireSpinConfetti(reelRef.current)

      // Reveal: redeem cue immediately, then the confirmation toast a beat
      // later (with its own click cue) so two distinct sounds mark the two
      // distinct moments — celebration vs confirmation.
      playSound('redeem')

      const isCrate = winningReward.kind !== 'cash'

      window.setTimeout(() => {
        playSound('button-click')
        if (isCrate) {
          toast.success(`You won a ${winningReward.label}!`, {
            description: 'Added to your Loot Crates — open it any time.',
            duration: 3500,
          })
        } else {
          toast.success(`You won ${winningReward.amount}!`, {
            description: `${winningReward.label} from your ${selectedTier} ${selectedSubLevel} spin.`,
            duration: 3500,
          })
        }
      }, 800)

      if (typeof window === 'undefined') return

      if (isCrate) {
        // Hand the prize off to the Loot Crates tab. RewardCrates listens
        // for this event globally and prepends the new crate to its list.
        window.dispatchEvent(
          new CustomEvent('notification:earn-crate', {
            detail: {
              kind: CRATE_DISPATCH_KIND[winningReward.kind as CrateRewardKind],
              source: 'level-up',
              tier: selectedTier,
              subLevel: selectedSubLevel,
            },
          })
        )
      } else if (winningReward.amountRaw && winningReward.amountRaw > 0) {
        // Cash prize — top up the user's balance via the shared event every
        // page already listens for.
        window.dispatchEvent(
          new CustomEvent('notification:claim-reward', {
            detail: { amount: winningReward.amountRaw },
          })
        )
      }
    }, SPIN_DURATION_MS + 50)
  }, [spinning, isLocked, selectedTier, selectedSubLevel])

  // Reset the resting reel whenever the user swaps tier / sub-level so the
  // visible cards always match the active gem styling.
  useEffect(() => {
    if (spinning) return
    setStrip(buildStrip(DEFAULT_REWARDS, 14))
    setReelTransition('none')
    setReelOffset(0)
    setWinner(null)
    setReelFrozenAfterWin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTier, selectedSubLevel])

  // Keep the active tier centred in the carousel when it changes.
  useEffect(() => {
    const btn = tierBtnRefs.current[selectedTier]
    const container = tierCarouselRef.current
    if (!btn || !container) return
    const targetLeft =
      btn.offsetLeft - container.clientWidth / 2 + btn.clientWidth / 2
    container.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }, [selectedTier])

  const showIdleCrawl = !spinning && !reelFrozenAfterWin

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tier selector — horizontal carousel of crown tiles tinted by tier
          colour. Escapes the drawer's px-4 padding so it can scroll edge to
          edge with subtle fades hinting at the off-screen tiers. */}
      <div className="relative -mx-4">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-6 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(13,13,16,1), rgba(13,13,16,0))',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-6 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(13,13,16,1), rgba(13,13,16,0))',
          }}
        />
        <div
          ref={tierCarouselRef}
          className="flex gap-2 overflow-x-auto px-4 py-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', scrollSnapType: 'x proximity' }}
        >
          {TIERS.map((tier) => {
            const active = selectedTier === tier
            const accent = TIER_ACCENT[tier]
            return (
              <button
                key={tier}
                ref={(el) => {
                  tierBtnRefs.current[tier] = el
                }}
                type="button"
                onClick={() => setSelectedTier(tier)}
                style={{ scrollSnapAlign: 'center' }}
                className={cn(
                  'shrink-0 w-[80px] relative flex flex-col items-center gap-1.5 py-3 px-1 rounded-lg transition-all',
                  'bg-white/[0.03] border',
                  active
                    ? 'border-[var(--ds-primary,#ee3536)]/60 bg-white/[0.06]'
                    : 'border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]'
                )}
                aria-label={`${tier} tier`}
                aria-pressed={active}
              >
                <IconCrown
                  className="w-6 h-6"
                  strokeWidth={1.8}
                  style={{
                    color: accent.core,
                    filter: `drop-shadow(0 0 6px rgba(${accent.glow}, 0.4))`,
                  }}
                />
                <span
                  className={cn(
                    'text-[11px] font-medium leading-none',
                    active ? 'text-white' : 'text-white/55'
                  )}
                >
                  {tier}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sub-level tabs */}
      <div
        className="flex gap-3 overflow-x-auto -mx-1 px-1 pb-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {Array.from({ length: SUB_LEVELS[selectedTier] }, (_, i) => i + 1).map((lvl) => {
          const active = selectedSubLevel === lvl
          return (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedSubLevel(lvl)}
              className={cn(
                'shrink-0 text-[12px] font-semibold whitespace-nowrap transition-colors py-1 px-1 border-b-2',
                active
                  ? 'text-white border-white'
                  : 'text-white/35 hover:text-white/60 border-transparent'
              )}
            >
              {selectedTier} {lvl}
            </button>
          )
        })}
      </div>

      {/* Reel — chevrons anchored to the strip edges (not the section bottom) so
          the lower marker cannot drift over the Spin CTA; pb-8 reserves its height in flow */}
      <div className="relative -mx-4 overflow-visible pt-2 pb-8" ref={reelRef}>
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2"
          >
            <IconChevronDown
              className="h-5 w-5 text-white"
              strokeWidth={3}
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.85))' }}
            />
          </div>

          <div className="overflow-hidden" style={{ height: CARD_HEIGHT }}>
            <div
              className={cn(
                'flex h-full items-center',
                showIdleCrawl &&
                  'motion-safe:animate-vip-reel-idle motion-reduce:animate-none',
              )}
              style={{
                gap: CARD_GAP,
                ...(showIdleCrawl
                  ? {
                      ['--reel-idle-shift' as string]: `${idleShiftPx}px`,
                      ['--reel-idle-ms' as string]: `${idleDurationMs}ms`,
                    }
                  : {
                      transform: `translateX(${reelOffset}px)`,
                      transition: reelTransition,
                      willChange: 'transform',
                    }),
              }}
            >
              {showIdleCrawl ? (
                <>
                  {strip.map((r, idx) => (
                    <ReelCard
                      key={`idle-a-${idx}-${r.id}`}
                      tier={selectedTier}
                      reward={r}
                    />
                  ))}
                  {strip.map((r, idx) => (
                    <ReelCard
                      key={`idle-b-${idx}-${r.id}`}
                      tier={selectedTier}
                      reward={r}
                    />
                  ))}
                </>
              ) : (
                strip.map((r, idx) => (
                  <ReelCard key={`${idx}-${r.id}`} tier={selectedTier} reward={r} />
                ))
              )}
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2"
          >
            <IconChevronUp
              className="h-5 w-5 text-white"
              strokeWidth={3}
              style={{ filter: 'drop-shadow(0 -1px 2px rgba(0,0,0,0.85))' }}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      {!isLoggedIn ? (
        <VipLoggedOutCta className="!h-11 !rounded-lg !text-sm" />
      ) : isLocked ? (
        <button
          type="button"
          disabled
          className="w-full h-11 rounded-lg bg-[#0e6a8a]/30 border border-[#0e6a8a]/50 text-white/55 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <IconLock className="w-4 h-4" />
          Level up to spin
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSpin}
          disabled={spinning}
          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
          className={cn(
            'w-full h-11 rounded-lg text-white font-bold text-sm uppercase tracking-wider',
            'hover:brightness-110 transition-[filter] duration-150 active:scale-[0.99]',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {spinning ? 'Spinning…' : winner ? 'Spin again' : 'Spin'}
        </button>
      )}

      {/* Reward odds table */}
      <div className="grid grid-cols-2 gap-1.5">
        {DEFAULT_REWARDS.map((r) => (
          <div
            key={r.id}
            className="rounded-md bg-white/[0.03] border border-white/[0.06] px-2 py-2 flex items-center gap-2 min-h-[52px]"
          >
            <RewardIcon kind={r.kind} small />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[12px] font-semibold text-white truncate">{r.label}</span>
                <span className="text-[10px] tabular-nums font-medium text-white/40 shrink-0">
                  {r.chance}%
                </span>
              </div>
              {r.kind === 'cash' ? (
                <div className="text-[12px] font-bold text-white tabular-nums leading-tight">
                  {r.amount}
                </div>
              ) : (
                <div className="text-[10px] font-medium text-white/45 leading-tight">
                  Random reward
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** CSS-rendered fallback gem when a tier has no SVG asset. */
function CssGem({ tier, size = 32 }: { tier: TierName; size?: number }) {
  const c = TIER_ACCENT[tier]
  return (
    <div
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 38%, ${c.core}, ${c.edge})`,
        clipPath:
          'polygon(18% 0, 82% 0, 100% 18%, 100% 82%, 82% 100%, 18% 100%, 0 82%, 0 18%)',
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 12px rgba(${c.glow}, 0.3)`,
      }}
      aria-hidden
    />
  )
}

function ReelCard({ tier, reward }: { tier: TierName; reward: Reward }) {
  const tierBgSrc = TIER_IMAGE[tier]

  if (reward.kind !== 'cash') {
    const kind = reward.kind as CrateRewardKind
    const crateSrc = CRATE_PAGE_IMAGE[kind]
    return (
      <div
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        className="relative shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 shadow-md shadow-black/30"
      >
        {tierBgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tierBgSrc}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
          />
        ) : (
          <CssGem tier={tier} size={Math.max(CARD_WIDTH, CARD_HEIGHT)} />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0) 75%)',
          }}
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-1 pb-4 pt-0.5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={crateSrc}
            alt=""
            draggable={false}
            className="h-12 w-12 shrink-0 object-contain pointer-events-none select-none"
            style={{
              filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.55))',
            }}
          />
          <span
            className={cn(
              'mt-1 text-[10px] font-extrabold uppercase leading-none tracking-tight',
              CRATE_STYLE[kind].text
            )}
            style={{
              textShadow:
                '0 2px 8px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,0.7)',
            }}
          >
            {reward.amount}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      className="relative shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 shadow-md shadow-black/30"
    >
      {tierBgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tierBgSrc}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
        />
      ) : (
        <CssGem tier={tier} size={Math.max(CARD_WIDTH, CARD_HEIGHT)} />
      )}

      {/* Centred radial dim — softly darkens the middle of the gem so the
          prize amount stays crisp without flattening the gem's edges. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0) 75%)',
        }}
      />

      {/* Hero amount — dead-centred, with a small icon stacked above it.
          Cash prizes render the dollar value in white. */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-1.5 text-center">
        <ReelGlyph />
        <span
          className="mt-1 text-[16px] font-extrabold leading-none tracking-tight text-white tabular-nums"
          style={{
            textShadow:
              '0 2px 8px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.9)',
          }}
        >
          {reward.amount}
        </span>
      </div>
    </div>
  )
}

// Per-rarity styling for the Loot Crate rewards. Mirrors the palette used by
// `components/vip/reward-crates.tsx` so a "Common" win on the spinner reads
// the same as a "Common" crate in the Loot Crates tab.
const CRATE_STYLE: Record<CrateRewardKind, { text: string; chip: string }> = {
  'crate-common':    { text: 'text-slate-200', chip: 'rgba(203, 213, 225, 0.22)' },
  'crate-rare':      { text: 'text-blue-300',  chip: 'rgba(59, 130, 246, 0.28)' },
  'crate-legendary': { text: 'text-amber-300', chip: 'rgba(251, 191, 36, 0.28)' },
}

/** Cash-only glyph above the dollar amount on gem tiles */
function ReelGlyph() {
  return (
    <IconCashBanknote
      className="h-3 w-3 text-emerald-300"
      strokeWidth={2.25}
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.75))' }}
    />
  )
}

/** Chip-style icon used in the rewards table below the reel. */
function RewardIcon({ kind, small = false }: { kind: Reward['kind']; small?: boolean }) {
  const sz = small ? 'w-4 h-4' : 'w-5 h-5'
  if (kind === 'cash') {
    return (
      <span
        className={cn('rounded p-0.5 flex items-center justify-center', !small && 'mb-0.5')}
        style={{ backgroundColor: 'rgba(16, 185, 129, 0.22)' }}
      >
        <IconCashBanknote className={cn(sz, 'text-emerald-300')} strokeWidth={2} />
      </span>
    )
  }
  const crateKind = kind as CrateRewardKind
  const src = CRATE_PAGE_IMAGE[crateKind]
  return (
    <span
      className={cn('flex items-center justify-center rounded p-0.5', !small && 'mb-0.5')}
      style={{ backgroundColor: CRATE_STYLE[crateKind].chip }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className={cn(sz, 'object-contain')}
      />
    </span>
  )
}

export default LevelUpSpinner
