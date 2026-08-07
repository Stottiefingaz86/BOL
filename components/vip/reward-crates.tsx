'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  IconGift,
  IconTrophy,
  IconFlame,
  IconCrown,
  IconCurrencyDollar,
  IconConfetti,
  IconSparkles,
  IconBolt,
  IconCoin,
  IconStar,
  IconLock,
  IconChevronRight,
  IconArrowLeft,
  IconX,
  IconShield,
  IconShare,
} from '@tabler/icons-react'
import { useChatStore } from '@/lib/store/chatStore'
import { useAuthSession } from '@/hooks/use-auth-session'
import { VipLoggedOutCta } from '@/components/vip/vip-logged-out-cta'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CrateRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'

export type CrateSource =
  | 'level-up'
  | 'first-deposit'
  | 'streak'
  | 'challenge'
  | 'mission'
  | 'gift'

export type CrateState = 'ready' | 'locked' | 'opened'

export interface CrateReward {
  label: string
  /** Cash value when this reward represents a balance change. Used to drive the balance count-up. */
  cashValue?: number
  /** Optional rarity / chance percentage (0-100). */
  chance?: number
  icon?: React.ComponentType<{ className?: string }>
}

export interface RewardCrate {
  id: string
  title: string
  subtitle?: string
  rarity: CrateRarity
  source: CrateSource
  state?: CrateState
  rewards: CrateReward[]
  earnedAt?: string
}

interface RewardCratesProps {
  /** `compact` = stacked list (drawer). `grid` = responsive grid (VIP page). */
  variant?: 'compact' | 'grid'
  heading?: string
  crates?: RewardCrate[]
  /** When provided, clicking a crate calls this instead of running the reveal sequence — used to deep-link from the VIP Rewards page back into the VIP Hub. */
  onCrateClick?: (crate: RewardCrate) => void
  onViewAll?: () => void
  /** Starting balance for the reveal balance counter. Defaults to a mock $1,247.50. */
  initialBalance?: number
  /** Hide the section heading + helper line. Useful when used as the only content on a tab. */
  hideHeader?: boolean
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const SOURCE_ICONS: Record<CrateSource, React.ComponentType<{ className?: string }>> = {
  'level-up': IconCrown,
  'first-deposit': IconCurrencyDollar,
  streak: IconFlame,
  challenge: IconTrophy,
  mission: IconBolt,
  gift: IconGift,
}

const SOURCE_LABEL: Record<CrateSource, string> = {
  'level-up': 'Level Up Reward',
  'first-deposit': 'First Deposit',
  streak: 'Streak Reward',
  challenge: 'Challenge Complete',
  mission: 'Mission Complete',
  gift: 'Gift',
}

interface RarityStyle {
  label: string
  // tailwind utility strings
  badgeBg: string
  badgeText: string
  border: string
  iconText: string
  // raw colors used for SVG / canvas
  primary: string
  secondary: string
  accent: string
  glowRgb: string
  confetti: string[]
  // PNG asset rendered for the crate visual
  image: string
}

const RARITY_STYLES: Record<CrateRarity, RarityStyle> = {
  common: {
    label: 'Common',
    badgeBg: 'bg-white/10',
    badgeText: 'text-white/80',
    border: 'border-white/15',
    iconText: 'text-white/80',
    primary: '#cbd5e1',
    secondary: '#64748b',
    accent: '#f8fafc',
    glowRgb: '203,213,225',
    confetti: ['#cbd5e1', '#94a3b8', '#e2e8f0', '#ffffff'],
    image: '/lootbox/common.svg',
  },
  rare: {
    label: 'Rare',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-300',
    border: 'border-blue-500/30',
    iconText: 'text-blue-300',
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#bfdbfe',
    glowRgb: '59,130,246',
    confetti: ['#3b82f6', '#1d4ed8', '#93c5fd', '#bfdbfe', '#ffffff'],
    image: '/lootbox/rare.svg',
  },
  epic: {
    label: 'Epic',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    border: 'border-orange-500/30',
    iconText: 'text-orange-200',
    primary: '#ea580c',
    secondary: '#9a3412',
    accent: '#fdba74',
    glowRgb: '234,88,12',
    confetti: ['#ea580c', '#c2410c', '#fdba74', '#fed7aa', '#ffffff'],
    image: '/lootbox/epic.svg',
  },
  legendary: {
    label: 'Legendary',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    border: 'border-amber-500/30',
    iconText: 'text-amber-200',
    primary: '#fbbf24',
    secondary: '#d97706',
    accent: '#fde68a',
    glowRgb: '251,191,36',
    confetti: ['#fbbf24', '#f59e0b', '#fde68a', '#fcd34d', '#ffffff'],
    image: '/lootbox/legend.svg',
  },
  mythic: {
    label: 'Mythic',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-300',
    border: 'border-cyan-500/30',
    iconText: 'text-cyan-200',
    primary: '#22d3ee',
    secondary: '#0e7490',
    accent: '#a5f3fc',
    glowRgb: '34,211,238',
    confetti: ['#22d3ee', '#06b6d4', '#a5f3fc', '#cffafe', '#ffffff'],
    image: '/lootbox/mythic.svg',
  },
}

// ---------------------------------------------------------------------------
// "Earned crate" event payload
// ---------------------------------------------------------------------------

/**
 * Payload for the `notification:earn-crate` window event. The Level Up reel
 * dispatches this when a spin lands on Case L / Case XL so the new crate
 * shows up immediately in the Loot Crates tab.
 */
export interface EarnCrateDetail {
  kind: 'case-l' | 'case-xl' | 'case-s' | 'case-m'
  source?: CrateSource
  tier?: string
  subLevel?: number
  /** Override the default rarity / rewards for this earn. */
  rarity?: CrateRarity
  rewards?: CrateReward[]
  title?: string
  subtitle?: string
}

const EARNED_RARITY_BY_KIND: Record<EarnCrateDetail['kind'], CrateRarity> = {
  'case-s': 'common',
  'case-m': 'rare',
  'case-l': 'epic',
  'case-xl': 'legendary',
}

const EARNED_TITLE_BY_KIND: Record<EarnCrateDetail['kind'], string> = {
  'case-s': 'Case S',
  'case-m': 'Case M',
  'case-l': 'Case L',
  'case-xl': 'Case XL',
}

// Reward pools per case size — inline here so we don't depend on additional
// data tables. Tweak when product nails down the exact economy.
const EARNED_REWARDS_BY_KIND: Record<EarnCrateDetail['kind'], CrateReward[]> = {
  'case-s': [
    { label: '$5 Cash', cashValue: 5, chance: 60, icon: IconCurrencyDollar },
    { label: '10 Free Spins', chance: 30, icon: IconSparkles },
    { label: '$25 Cash', cashValue: 25, chance: 10, icon: IconCoin },
  ],
  'case-m': [
    { label: '$10 Cash', cashValue: 10, chance: 50, icon: IconCurrencyDollar },
    { label: '25 Free Spins', chance: 30, icon: IconSparkles },
    { label: '$50 Cash', cashValue: 50, chance: 15, icon: IconCoin },
    { label: 'Risk-Free $25 Bet', chance: 5, icon: IconShield },
  ],
  'case-l': [
    { label: '$15 Cash', cashValue: 15, chance: 45, icon: IconCurrencyDollar },
    { label: '50 Free Spins', chance: 30, icon: IconSparkles },
    { label: 'Risk-Free $50 Bet', chance: 15, icon: IconShield },
    { label: '$100 Cash', cashValue: 100, chance: 8, icon: IconCoin },
    { label: '$500 Cash', cashValue: 500, chance: 2, icon: IconCoin },
  ],
  'case-xl': [
    { label: '$50 Cash', cashValue: 50, chance: 40, icon: IconCurrencyDollar },
    { label: '100 Free Spins', chance: 30, icon: IconSparkles },
    { label: 'Risk-Free $100 Bet', chance: 15, icon: IconShield },
    { label: '$400 Cash', cashValue: 400, chance: 10, icon: IconCoin },
    { label: '$2,500 Cash', cashValue: 2500, chance: 4, icon: IconCoin },
    { label: '$10,000 Cash', cashValue: 10000, chance: 1, icon: IconCoin },
  ],
}

function buildEarnedCrate(detail: EarnCrateDetail): RewardCrate {
  const rarity = detail.rarity ?? EARNED_RARITY_BY_KIND[detail.kind]
  const rewards = detail.rewards ?? EARNED_REWARDS_BY_KIND[detail.kind]
  const baseTitle = detail.title ?? EARNED_TITLE_BY_KIND[detail.kind]
  const subtitle =
    detail.subtitle ??
    (detail.tier && detail.subLevel != null
      ? `From ${detail.tier} ${detail.subLevel} Level Up`
      : detail.source === 'level-up'
        ? 'From your Level Up spin'
        : undefined)
  return {
    id: `${detail.kind}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: baseTitle,
    subtitle,
    rarity,
    source: detail.source ?? 'level-up',
    state: 'ready',
    earnedAt: 'just now',
    rewards,
  }
}

// ---------------------------------------------------------------------------
// Default crates
// ---------------------------------------------------------------------------

const DEFAULT_CRATES: RewardCrate[] = [
  {
    id: 'level-up-gold',
    title: 'Level Up Reward',
    subtitle: 'Gold I → Gold II',
    rarity: 'legendary',
    source: 'level-up',
    state: 'ready',
    earnedAt: 'Today',
    rewards: [
      { label: '$50 Cash', cashValue: 50, chance: 35, icon: IconCurrencyDollar },
      { label: '50 Free Spins', chance: 25, icon: IconSparkles },
      { label: 'Risk-Free $25 Bet', chance: 20, icon: IconShield },
      { label: '$250 Cash', cashValue: 250, chance: 15, icon: IconCurrencyDollar },
      { label: '$1,000 Cash', cashValue: 1000, chance: 5, icon: IconCoin },
    ],
  },
  {
    id: 'streak-7',
    title: '7 Day Streak',
    subtitle: 'Logged in 7 days in a row',
    rarity: 'epic',
    source: 'streak',
    state: 'ready',
    earnedAt: '2h ago',
    rewards: [
      { label: '$25 Cash', cashValue: 25, chance: 45, icon: IconCurrencyDollar },
      { label: '25 Free Spins', chance: 30, icon: IconSparkles },
      { label: 'Risk-Free $50 Bet', chance: 20, icon: IconShield },
      { label: '$500 Cash', cashValue: 500, chance: 5, icon: IconCoin },
    ],
  },
  {
    id: 'first-deposit',
    title: 'First Deposit',
    subtitle: 'Welcome aboard',
    rarity: 'rare',
    source: 'first-deposit',
    state: 'ready',
    earnedAt: 'Yesterday',
    rewards: [
      { label: '$50 Cash', cashValue: 50, chance: 50, icon: IconCurrencyDollar },
      { label: '50 Free Spins', chance: 35, icon: IconSparkles },
      { label: '$100 Cash', cashValue: 100, chance: 15, icon: IconCoin },
    ],
  },
  {
    id: 'challenge-blackjack',
    title: 'Challenge Complete',
    subtitle: '"Win 5 hands of Blackjack"',
    rarity: 'common',
    source: 'challenge',
    state: 'ready',
    earnedAt: '3d ago',
    rewards: [
      { label: '$10 Cash', cashValue: 10, chance: 60, icon: IconCurrencyDollar },
      { label: '10 Free Spins', chance: 30, icon: IconSparkles },
      { label: '$50 Cash', cashValue: 50, chance: 10, icon: IconCoin },
    ],
  },
  {
    id: 'mission-monthly',
    title: 'Monthly Mission',
    subtitle: 'Wager $10K this month',
    rarity: 'mythic',
    source: 'mission',
    state: 'locked',
    rewards: [
      { label: '$1,000 Cash', cashValue: 1000, chance: 40, icon: IconCurrencyDollar },
      { label: '500 Free Spins', chance: 30, icon: IconSparkles },
      { label: 'Risk-Free $250 Bet', chance: 20, icon: IconShield },
      { label: '$10,000 Cash', cashValue: 10000, chance: 10, icon: IconCoin },
    ],
  },
]

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function RewardCrates({
  variant = 'compact',
  heading = 'Reward Crates',
  crates: cratesProp,
  onCrateClick,
  onViewAll,
  initialBalance = 1247.5,
  hideHeader = false,
}: RewardCratesProps) {
  const { isLoggedIn } = useAuthSession()
  const [crates, setCrates] = useState<RewardCrate[]>(cratesProp ?? DEFAULT_CRATES)
  const [opening, setOpening] = useState<{ crate: RewardCrate; reward: CrateReward } | null>(null)
  const [balance, setBalance] = useState(initialBalance)

  // Reveal sound effect, played on the user-gesture inside `handleOpen`.
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playOpenSound = useCallback(() => {
    if (typeof window === 'undefined') return
    if (!audioRef.current) {
      audioRef.current = new Audio(
        encodeURI('/lootbox/ES_Musical, Loop, Logo, Magic, Modern 02 - Epidemic Sound.mp3')
      )
      audioRef.current.volume = 0.6
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }, [])
  const stopOpenSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  // Stop audio when the component unmounts.
  useEffect(() => () => stopOpenSound(), [stopOpenSound])

  // Keep external crate list in sync if it changes.
  useEffect(() => {
    if (cratesProp) setCrates(cratesProp)
  }, [cratesProp])

  // Listen for crates earned from the Level Up reel (or any other surface
  // that wants to drop a crate into the user's collection). The event is
  // dispatched with `{ kind: 'case-l' | 'case-xl', source, tier, subLevel }`
  // — see `components/vip/level-up-spinner.tsx`.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (evt: Event) => {
      const detail = (evt as CustomEvent<EarnCrateDetail>).detail
      const newCrate = buildEarnedCrate(detail)
      setCrates((prev) => [newCrate, ...prev])
    }
    window.addEventListener('notification:earn-crate', handler as EventListener)
    return () =>
      window.removeEventListener('notification:earn-crate', handler as EventListener)
  }, [])

  const readyCount = crates.filter((c) => (c.state ?? 'ready') === 'ready').length

  const handleOpen = useCallback(
    (crate: RewardCrate) => {
      if (crate.state === 'locked' || crate.state === 'opened') return

      // Deep-link mode — defer to parent.
      if (onCrateClick) {
        onCrateClick(crate)
        return
      }

      // Pick a weighted reward.
      const total = crate.rewards.reduce((sum, r) => sum + (r.chance ?? 1), 0)
      let roll = Math.random() * total
      let chosen = crate.rewards[0]
      for (const r of crate.rewards) {
        const weight = r.chance ?? 1
        if (roll < weight) {
          chosen = r
          break
        }
        roll -= weight
      }

      playOpenSound()
      setOpening({ crate, reward: chosen })
    },
    [onCrateClick, playOpenSound]
  )

  const handleClaim = useCallback(() => {
    if (!opening) return
    if (typeof opening.reward.cashValue === 'number') {
      setBalance((b) => b + (opening.reward.cashValue ?? 0))
    }
    // Drop the crate from the list once it's claimed.
    setCrates((prev) => prev.filter((c) => c.id !== opening.crate.id))
    stopOpenSound()
    setOpening(null)
  }, [opening, stopOpenSound])

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        {!hideHeader && (
          <>
            <h3 className="text-lg font-semibold text-white">{heading}</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Earn crates by leveling up, hitting streaks, completing missions and challenges. Open
              them for instant rewards.
            </p>
          </>
        )}
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <IconGift className="h-6 w-6 text-white/40" />
          </div>
          <p className="text-sm font-semibold text-white">Unlock reward crates</p>
          <p className="mt-1.5 text-xs leading-relaxed text-white/50">
            Log in to collect crates from level-ups, streaks, missions, and challenges.
          </p>
          <div className="mx-auto mt-4 max-w-[200px]">
            <VipLoggedOutCta />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {!hideHeader && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{heading}</h3>
              {readyCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full bg-amber-400 text-black">
                  {readyCount}
                </span>
              )}
            </div>
            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="text-xs font-medium text-white/60 hover:text-white transition-colors flex items-center gap-1"
              >
                View all
                <IconChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Earn crates by leveling up, hitting streaks, completing missions and challenges. Open
            them for instant rewards.
          </p>
        </>
      )}

      <div
        className={
          variant === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5'
            : 'flex flex-col gap-2.5'
        }
      >
        <AnimatePresence initial={false}>
          {crates.map((crate) => (
            <CrateCard
              key={crate.id}
              crate={crate}
              onOpen={handleOpen}
              isLink={!!onCrateClick}
            />
          ))}
        </AnimatePresence>

        {crates.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
            <div className="text-sm font-medium text-white/70">No crates right now</div>
            <p className="text-xs text-white/40 mt-1">
              Keep playing. New crates drop from level-ups, streaks and challenges.
            </p>
          </div>
        )}
      </div>

      {/* Reveal overlay (covers the parent scroll container with a portal-free absolute layer) */}
      <AnimatePresence>
        {opening && (
          <CrateOpener
            key={opening.crate.id}
            crate={opening.crate}
            reward={opening.reward}
            balance={balance}
            onClose={() => {
              stopOpenSound()
              setOpening(null)
            }}
            onClaim={handleClaim}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default RewardCrates

// ---------------------------------------------------------------------------
// Crate Card (list item)
// ---------------------------------------------------------------------------

interface CrateCardProps {
  crate: RewardCrate
  onOpen: (crate: RewardCrate) => void
  isLink: boolean
}

function CrateCard({ crate, onOpen, isLink }: CrateCardProps) {
  const styles = RARITY_STYLES[crate.rarity]
  const isLocked = crate.state === 'locked'
  const canOpen = !isLocked

  // Cursor-following spotlight (matches VIP benefit tile aesthetic).
  const ref = useRef<HTMLDivElement | null>(null)

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

  // Sort rewards by chance descending so the most likely show first.
  const sortedRewards = useMemo(
    () => [...crate.rewards].sort((a, b) => (b.chance ?? 0) - (a.chance ?? 0)),
    [crate.rewards]
  )

  return (
    <motion.div
      ref={ref}
      onMouseMove={canOpen ? handleMouseMove : undefined}
      onMouseLeave={canOpen ? handleMouseLeave : undefined}
      layout
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 0.92,
        filter: 'blur(4px)',
        transition: { duration: 0.35, ease: 'easeOut' },
      }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-xl bg-white/[0.04] border transition-colors duration-200 ${
        isLocked
          ? 'border-white/[0.06] opacity-60'
          : 'border-white/[0.06] hover:border-white/15'
      }`}
      style={
        {
          '--spot-x': '50%',
          '--spot-y': '50%',
          '--spot-opacity': '0',
        } as React.CSSProperties
      }
    >
      {/* Cursor-following spotlight, tinted with the crate's rarity colour */}
      {!isLocked && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            background: `radial-gradient(220px circle at var(--spot-x) var(--spot-y), rgba(${styles.glowRgb}, 0.18), transparent 60%)`,
            opacity: 'var(--spot-opacity)',
          }}
        />
      )}

      {/* Subtle top rarity accent — much lighter than before, just a hint */}
      {!isLocked && (
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-[2px] pointer-events-none opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${styles.glowRgb}, 0.65), transparent)`,
          }}
        />
      )}

      {/* Header row */}
      <div className="relative p-3 flex items-center gap-3">
        <div className="flex-shrink-0">
          <MiniCrate rarity={crate.rarity} idle={canOpen} dim={!canOpen} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-white truncate leading-tight tracking-tight">
            {crate.title}
          </div>
          {crate.subtitle && (
            <div className="text-[12.5px] text-white/55 truncate leading-snug mt-0.5">
              {crate.subtitle}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[10px] mt-1.5">
            <span
              className="font-bold uppercase tracking-[0.12em]"
              style={{ color: styles.primary }}
            >
              {styles.label}
            </span>
            {crate.earnedAt && (
              <>
                <span className="text-white/20">·</span>
                <span className="text-white/45">{crate.earnedAt}</span>
              </>
            )}
          </div>
        </div>

        {isLocked ? (
          <div className="flex-shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md text-[11px] font-medium bg-white/[0.03] border border-white/[0.06] text-white/45">
            <IconLock className="w-3 h-3" />
            Locked
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpen(crate)}
            aria-label={isLink ? 'View crate' : 'Open crate'}
            style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
            className="flex-shrink-0 inline-flex items-center gap-1 h-9 px-3.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white hover:brightness-110 transition-[filter] duration-150 active:scale-[0.97]"
          >
            {isLink ? 'View' : 'Open'}
            <IconChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Rewards list — separated by a hairline divider for hierarchy */}
      <div className="relative px-3 pb-3 pt-2.5 mt-0 border-t border-white/[0.04] space-y-0.5">
        {sortedRewards.map((reward, idx) => {
          const Icon = reward.icon ?? IconCoin
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-1 py-1 rounded-md"
            >
              <Icon
                className="w-4 h-4 flex-shrink-0 text-white/40"
                aria-hidden
              />
              <span className="flex-1 truncate text-[10.5px] font-semibold text-white/40">
                {reward.label}
              </span>
              {typeof reward.chance === 'number' && (
                <span className="text-[10.5px] tabular-nums font-semibold text-white/40 flex-shrink-0">
                  {reward.chance}%
                </span>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Mini crate visual (used in list cards)
// ---------------------------------------------------------------------------

function MiniCrate({
  rarity,
  idle = true,
  dim = false,
}: {
  rarity: CrateRarity
  idle?: boolean
  dim?: boolean
}) {
  const s = RARITY_STYLES[rarity]
  return (
    <div
      className={`relative w-14 h-14 flex items-center justify-center ${
        dim ? 'opacity-60' : ''
      }`}
    >
      <motion.img
        src={s.image}
        alt=""
        draggable={false}
        className="w-14 h-14 object-contain select-none pointer-events-none"
        animate={
          idle && !dim
            ? { y: [0, -2, 0] }
            : { y: 0 }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Big crate visual — PNG with wobble + pulse + speed lines (used in opener)
// ---------------------------------------------------------------------------

function BigCrate({
  rarity,
  size = 240,
  active = true,
  opened = false,
}: {
  rarity: CrateRarity
  size?: number
  /** When true, the crate squeezes + wobbles + emits speed lines. */
  active?: boolean
  /** When true, the crate fades out (after the prize emerges). */
  opened?: boolean
}) {
  const s = RARITY_STYLES[rarity]

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Soft halo behind the box */}
      <motion.span
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.95,
          height: size * 0.95,
          background: `radial-gradient(circle, rgba(${s.glowRgb}, 0.32) 0%, rgba(${s.glowRgb}, 0.08) 50%, transparent 75%)`,
        }}
        animate={
          active
            ? { opacity: [0.65, 1, 0.65], scale: [0.92, 1.08, 0.92] }
            : { opacity: 0, scale: 1.4 }
        }
        transition={
          active
            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.5, ease: 'easeOut' }
        }
      />

      {/*
        The crate SVG — strong squeeze animation while active.
        Layered: rotate + scaleX/scaleY (squeeze) + small bob.
      */}
      <motion.img
        src={s.image}
        alt=""
        draggable={false}
        className="relative select-none pointer-events-none"
        style={{
          width: size * 0.78,
          height: size * 0.78,
          objectFit: 'contain',
          filter: `drop-shadow(0 14px 28px rgba(0,0,0,0.55)) drop-shadow(0 0 22px rgba(${s.glowRgb}, 0.45))`,
        }}
        animate={
          opened
            ? { rotate: 0, scale: 1.3, opacity: 0, y: -8, scaleX: 1, scaleY: 1 }
            : active
              ? {
                  rotate: [-5, 5, -3, 4, -4, 0],
                  scaleX: [1, 1.12, 0.92, 1.1, 0.95, 1],
                  scaleY: [1, 0.86, 1.12, 0.9, 1.05, 1],
                  y: [0, -2, 1, -3, 0, 0],
                }
              : { rotate: 0, scale: 1, y: 0 }
        }
        transition={
          opened
            ? { duration: 0.4, ease: 'easeIn' }
            : {
                rotate: { duration: 0.55, repeat: Infinity, ease: 'easeInOut' },
                scaleX: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
                scaleY: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      />

      {/* Floor shadow — squashes/stretches in sync with the box */}
      <motion.span
        aria-hidden
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: 4,
          width: size * 0.55,
          height: 10,
          background: 'rgba(0,0,0,0.55)',
          filter: 'blur(8px)',
        }}
        animate={
          active
            ? { scaleX: [1, 1.15, 0.85, 1.1, 1], opacity: [0.6, 0.4, 0.7, 0.45, 0.6] }
            : { scaleX: 1, opacity: 0 }
        }
        transition={
          active
            ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.4 }
        }
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Crate Opener — full reveal sequence (overlay inside the same scroll area)
// ---------------------------------------------------------------------------

interface CrateOpenerProps {
  crate: RewardCrate
  reward: CrateReward
  balance: number
  onClose: () => void
  onClaim: () => void
}

type Phase = 'idle' | 'shake' | 'open' | 'reveal' | 'balance' | 'done'

function CrateOpener({ crate, reward, balance, onClose, onClaim }: CrateOpenerProps) {
  const styles = RARITY_STYLES[crate.rarity]
  const [phase, setPhase] = useState<Phase>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const swapRef = useRef<HTMLDivElement>(null)
  const containedCanvasRef = useRef<HTMLCanvasElement>(null)

  // Share win to chat — mirrors the jackpot overlay flow. Opens the chat,
  // posts a "bet"-shaped payload describing the crate + reward, then claims
  // so the modal dismisses cleanly.
  const handleShareToChat = useCallback(() => {
    const chatStore = useChatStore.getState()
    chatStore.setIsOpen(true)
    chatStore.shareBetToChat([
      {
        eventName: `📦 ${crate.title}: ${reward.label}`,
        selection: `${styles.label} Crate Reward`,
        odds: '🎁',
        stake: reward.cashValue ?? 0,
      },
    ])
    onClaim()
  }, [crate.title, reward.label, reward.cashValue, styles.label, onClaim])

  // Phase progression.
  const advance = useCallback(() => {
    setPhase('shake')
    // ~2.4s of squeeze + speed-line anticipation, then a sharp pop+vanish
    // hand-off into the prize reveal.
    window.setTimeout(() => setPhase('open'), 2200)
    window.setTimeout(() => setPhase('reveal'), 2360)
    window.setTimeout(() => setPhase('balance'), 3060)
    window.setTimeout(() => setPhase('done'), 3600)
  }, [])

  // Auto-start the sequence the moment the opener mounts.
  useEffect(() => {
    const t = window.setTimeout(() => advance(), 250)
    return () => window.clearTimeout(t)
  }, [advance])

  // ─── Radial speed-line particle system (anticipation) ──────────────────
  // Custom canvas-2D drawing where each line is rotated to point along its
  // direction of travel (outward from the box). Mix of long and short for
  // visual rhythm, fades naturally as it travels outward.
  useEffect(() => {
    if (phase !== 'shake' && phase !== 'open') return
    const canvas = containedCanvasRef.current
    const swap = swapRef.current
    if (!canvas || !swap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Backing-store size accounts for device pixel ratio for crisp lines.
    const dpr = window.devicePixelRatio || 1
    const cssW = canvas.clientWidth || 550
    const cssH = canvas.clientHeight || 420
    canvas.width = cssW * dpr
    canvas.height = cssH * dpr
    ctx.scale(dpr, dpr)

    type Particle = {
      angle: number
      distance: number
      speed: number
      length: number
      thickness: number
      alpha: number
      fadeRate: number
      color: string
      glow: string
    }

    let particles: Particle[] = []
    let raf = 0
    let lastSpawn = 0

    const colors = ['#ffffff', '#ffffff', styles.primary, styles.accent]
    const glows = ['255,255,255', '255,255,255', styles.glowRgb, styles.glowRgb]
    const innerR = 90 // start radius from box center

    const spawn = () => {
      const count = 5
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * colors.length)
        // Random length bucket — short, medium, or long
        const bucket = Math.random()
        const length =
          bucket < 0.5
            ? 18 + Math.random() * 20 // short
            : bucket < 0.85
              ? 40 + Math.random() * 35 // medium
              : 80 + Math.random() * 50 // long
        particles.push({
          angle: Math.random() * Math.PI * 2,
          distance: innerR + Math.random() * 20,
          speed: 3 + Math.random() * 6,
          length,
          thickness: 1.5 + Math.random() * 2.5,
          alpha: 0.85 + Math.random() * 0.15,
          fadeRate: 0.022 + Math.random() * 0.018,
          color: colors[idx],
          glow: glows[idx],
        })
      }
    }

    const tick = (now: number) => {
      if (!ctx) return
      // Recompute box center each frame so lines track layout shifts.
      const swapRect = swap.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      const cx = swapRect.left + swapRect.width / 2 - canvasRect.left
      const cy = swapRect.top + swapRect.height / 2 - canvasRect.top

      ctx.clearRect(0, 0, cssW, cssH)

      if (now - lastSpawn > 70) {
        spawn()
        lastSpawn = now
      }

      for (const p of particles) {
        const sx = cx + Math.cos(p.angle) * p.distance
        const sy = cy + Math.sin(p.angle) * p.distance
        const ex = cx + Math.cos(p.angle) * (p.distance + p.length)
        const ey = cy + Math.sin(p.angle) * (p.distance + p.length)

        // Tapered gradient stroke — bright centre, transparent ends.
        const grad = ctx.createLinearGradient(sx, sy, ex, ey)
        grad.addColorStop(0, `rgba(${p.glow}, 0)`)
        grad.addColorStop(0.5, p.color)
        grad.addColorStop(1, `rgba(${p.glow}, 0)`)

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.strokeStyle = grad
        ctx.lineWidth = p.thickness
        ctx.lineCap = 'round'
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(${p.glow}, 0.85)`
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
        ctx.stroke()
        ctx.restore()

        p.distance += p.speed
        p.alpha -= p.fadeRate
      }

      // Cull dead particles (faded out or off-canvas).
      particles = particles.filter(
        (p) => p.alpha > 0 && p.distance < Math.max(cssW, cssH) / 2
      )

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles = []
    }
  }, [phase, styles.primary, styles.accent, styles.glowRgb])

  // ─── Massive layered explosion when the prize reveals ──────────────────
  // Three rapid concentric bursts with different velocities/scales create a
  // dense, full-volume blast (instead of one ring of particles). Uses the
  // GLOBAL confetti canvas so particles can blast outside the modal.
  useEffect(() => {
    if (phase !== 'reveal') return
    const node = containerRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 3) / window.innerHeight,
    }

    // Jackpot-style palette — gold/amber with white + brand red. Decoupled
    // from the crate's rarity colour so the celebration always feels
    // celebratory (rather than tinted by whatever rarity the box happens
    // to be).
    const baseOpts = {
      spread: 360,
      ticks: 280,
      gravity: 0.6,
      zIndex: 100000,
      colors: ['#FFD700', '#FFA500', '#FFDF00', '#DAA520', '#ffffff', '#ee3536'],
      origin,
    }

    // Inner core — fast, bright, fills the centre
    confetti({
      ...baseOpts,
      particleCount: 240,
      startVelocity: 55,
      scalar: 1.0,
    })
    // Mid ring — main body, slower so it lingers
    confetti({
      ...baseOpts,
      particleCount: 320,
      startVelocity: 85,
      scalar: 1.3,
    })
    // Outer shockwave — flies furthest
    confetti({
      ...baseOpts,
      particleCount: 180,
      startVelocity: 115,
      scalar: 1.5,
    })
    // Trailing puff — staggered for a "second wave" feel
    window.setTimeout(() => {
      confetti({
        ...baseOpts,
        particleCount: 180,
        startVelocity: 70,
        scalar: 1.1,
      })
    }, 130)
  }, [phase])

  const showPrize = phase === 'reveal' || phase === 'balance' || phase === 'done'

  const cashValue = reward.cashValue ?? 0
  const RewardIcon = reward.icon ?? IconCoin

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
      style={{
        background: 'rgba(10,10,12,0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Animated radial backdrop colored by rarity */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `radial-gradient(ellipse at center, rgba(${styles.glowRgb}, 0.28) 0%, rgba(${styles.glowRgb}, 0.08) 35%, transparent 70%)`,
        }}
      />

      {/* Brand B lockup */}
      <motion.div
        aria-hidden
        className="absolute top-5 inset-x-0 z-10 pointer-events-none flex items-center justify-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <svg
          viewBox="0 0 114 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="h-7 w-auto block"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z"
            fill="#ee3536"
          />
        </svg>
      </motion.div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center justify-center z-10"
      >
        <IconX className="w-4 h-4" />
      </button>

      {/* Stage content */}
      <div className="relative w-full max-w-md flex flex-col items-center text-center">
        {/* Crate ↔ Prize card swap */}
        <div ref={swapRef} className="relative w-full flex items-center justify-center">
          {/*
            Contained canvas for the anticipation streaks. Sized to a
            generous box (550 × 420) centered on the swap container so the
            blade-streaks emanate from the lootbox but die at the edges of
            this canvas — they never escape the hub area.
          */}
          <canvas
            ref={containedCanvasRef}
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              width: 550,
              height: 420,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/*
            Reveal flash — bright radial bloom that briefly washes out the
            stage at the exact moment the box exits and the prize enters.
            Masks the swap so the disappearance reads as an explosion of
            light rather than a fade-out.
          */}
          <AnimatePresence>
            {phase === 'reveal' && (
              <motion.div
                aria-hidden
                key="reveal-flash"
                className="absolute pointer-events-none"
                style={{
                  width: 520,
                  height: 420,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(${styles.glowRgb}, 0.55) 22%, rgba(${styles.glowRgb}, 0.18) 45%, transparent 70%)`,
                  mixBlendMode: 'screen',
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{
                  opacity: [0, 1, 0.6, 0],
                  scale: [0.4, 1.1, 1.3, 1.5],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.55,
                  times: [0, 0.18, 0.4, 1],
                  ease: 'easeOut',
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!showPrize ? (
              <motion.div
                key="anticipation"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 1.45,
                  filter: 'blur(8px)',
                  transition: {
                    duration: 0.18,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {/* Tier label */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] ${styles.badgeBg} ${styles.badgeText} mb-2`}
                >
                  <IconStar className="w-3 h-3" />
                  {styles.label}
                </span>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {crate.title}
                </h2>
                {crate.subtitle && (
                  <p className="text-sm text-white/60 mt-1">{crate.subtitle}</p>
                )}

                {/* Big crate (squeezing) */}
                <div className="my-6">
                  <BigCrate rarity={crate.rarity} size={260} active opened={false} />
                </div>

                <div className="text-sm text-white/55 flex items-center gap-2">
                  <IconConfetti className="w-4 h-4 animate-pulse" />
                  {phase === 'idle' || phase === 'shake'
                    ? 'Opening crate…'
                    : 'Revealing…'}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 18,
                  mass: 0.7,
                }}
                className="relative w-full max-w-[340px] flex flex-col items-center"
              >
                {/* Soft glow halo behind the prize card (pulses) */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 -m-16 rounded-[50%] pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, rgba(${styles.glowRgb}, 0.5) 0%, rgba(${styles.glowRgb}, 0.18) 30%, transparent 65%)`,
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Prize card */}
                <PrizeCard
                  styles={styles}
                  reward={reward}
                  RewardIcon={RewardIcon}
                  context={crate.subtitle ?? crate.title}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="mt-7 w-full flex flex-col gap-2 items-stretch">
          {phase === 'done' ? (
            <>
              <button
                type="button"
                onClick={handleShareToChat}
                className="w-full h-11 rounded-xl bg-white hover:bg-white/90 text-black text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <IconShare className="w-4 h-4" />
                Share to Chat
              </button>
              <button
                type="button"
                onClick={onClaim}
                className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold flex items-center justify-center gap-1.5"
              >
                <IconArrowLeft className="w-4 h-4" />
                Back
              </button>
            </>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Prize card — shown when the crate opens (centered, contained card layout)
// ---------------------------------------------------------------------------

function PrizeCard({
  styles,
  reward,
  RewardIcon,
  context,
}: {
  styles: RarityStyle
  reward: CrateReward
  RewardIcon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  context?: string
}) {
  return (
    <motion.div
      className="relative w-full rounded-2xl bg-white/[0.04] backdrop-blur-sm px-6 py-7 text-center"
      style={{
        border: `1px solid rgba(${styles.glowRgb}, 0.35)`,
        boxShadow: `0 0 60px rgba(${styles.glowRgb}, 0.18), inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-[0.28em]"
        style={{ color: styles.primary }}
      >
        {styles.label} Reward
      </div>

      {/* Icon container */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 18,
          delay: 0.15,
        }}
        className="mx-auto my-5 w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: `rgba(${styles.glowRgb}, 0.14)`,
          border: `1px solid rgba(${styles.glowRgb}, 0.4)`,
          boxShadow: `0 0 24px rgba(${styles.glowRgb}, 0.35), inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <RewardIcon className="w-8 h-8" style={{ color: styles.primary }} />
      </motion.div>

      <motion.div
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
      >
        {reward.label}
      </motion.div>

      {context && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="text-sm text-white/55 mt-1.5"
        >
          {context}
        </motion.div>
      )}
    </motion.div>
  )
}
