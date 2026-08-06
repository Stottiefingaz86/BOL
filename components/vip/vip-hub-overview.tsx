'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  IconBrandTelegram,
  IconCheck,
  IconInfoCircle,
  IconLoader2,
  IconLock,
  IconRefresh,
  IconSparkles,
  IconUserPlus,
} from '@tabler/icons-react'
import { fireConfetti } from '@/lib/confetti'
import { playSound } from '@/lib/sounds'
import { toast } from 'sonner'
import { useAuthSession } from '@/hooks/use-auth-session'
import { requestLogin } from '@/lib/auth-session'
import {
  REFERRAL_REWARD_ID,
  useReferralStore,
} from '@/lib/store/referralStore'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { rewardAccentStyle } from '@/components/vip/reward-accent'
import { VipTierProgressCard } from '@/components/vip/vip-tier-progress-card'
import {
  FreeSpinsGamePicker,
  type FreeSpinGameOption,
} from '@/components/vip/free-spins-game-picker'
import { launchCasinoGame } from '@/lib/casino/launch-game'
import {
  VipIconMonthly,
  VipIconPostMonthly,
  VipIconSpecial,
  VipIconWeekly,
} from '@/components/vip/vip-row-icons'

type IconKind =
  | 'rakeback'
  | 'reload-30'
  | 'reload-15'
  | 'reload-star'
  | 'boost-7'
  | 'boost-15'
  | 'boost-30'
  | 'boost-star'
  | 'free-spins'
  | 'refer-a-friend'

type HubSectionId = 'rakeback' | 'referral' | 'scheduled' | 'locked' | 'on-demand'

/** Tier bands from HUB-SORTING.pdf final views */
export type VipHubTierBand = 'bronze' | 'silver-gold' | 'platinum'

type HubRow =
  | {
      id: string
      name: string
      info?: string
      infoLinkHref?: string
      infoLinkLabel?: string
      icon: IconKind
      kind: 'claim'
      amount?: number
      subtitle?: string
      /** On-demand rows disappear after claim (except multi-release Special Reload) */
      removeOnClaim?: boolean
      /** Override default Claim / Claim $X button label */
      ctaLabel?: string
      /** Remaining free spins (Choose Game flow) */
      spinsLeft?: number
    }
  | {
      id: string
      name: string
      info?: string
      infoLinkHref?: string
      infoLinkLabel?: string
      icon: IconKind
      kind: 'cooldown'
      subtitle?: string
      cooldownLabel: string
    }
  | {
      id: string
      name: string
      info?: string
      infoLinkHref?: string
      infoLinkLabel?: string
      icon: IconKind
      kind: 'locked'
      unlockTier: string
    }
  | {
      id: string
      name: string
      info?: string
      infoLinkHref?: string
      infoLinkLabel?: string
      icon: IconKind
      kind: 'login'
      subtitle?: string
    }

const CLAIMED_FLASH_MS = 3000

type HubSection = {
  id: HubSectionId
  title: string | null
  rows: HubRow[]
}

/**
 * Build VIP hub rows (no SCHEDULED / LOCKED / ON DEMAND section titles).
 * 1. Rakeback
 * 2. Refer-A-Friend
 * 3. Scheduled rewards (tier-based)
 * 4. Locked rewards (tier-based)
 * 5. On-demand
 */
function buildHubSections(
  tier: VipHubTierBand,
  referralClaimable = 0
): HubSection[] {
  const rakeback: HubRow = {
    id: 'rakeback',
    name: 'Rakeback',
    info: 'Claim a share of every bet back, every 15 minutes. Terms & Conditions',
    icon: 'rakeback',
    kind: 'claim',
    amount: 0.2,
  }

  const weeklyBoostActive: HubRow = {
    id: 'weekly-boost',
    name: 'Weekly Boost',
    info: 'Boost your balance every week as you climb the VIP ladder.',
    icon: 'boost-7',
    kind: 'cooldown',
    cooldownLabel: '2 DAYS',
  }

  const monthlyReload: HubRow = {
    id: 'monthly-reload',
    name: 'Monthly Reload',
    info: 'Reload bonus available once per month based on your VIP tier.',
    icon: 'reload-30',
    kind: 'cooldown',
    subtitle: '2 of 3 claimed',
    cooldownLabel: '10 DAYS',
  }

  const postMonthlyReload: HubRow = {
    id: 'post-monthly-reload',
    name: 'Post-Monthly Reload',
    info: 'An extra reload window after your monthly bonus resets.',
    icon: 'reload-15',
    kind: 'claim',
    amount: 1,
    subtitle: '4 of 5 claimed',
  }

  const monthlyBoostActive: HubRow = {
    id: 'monthly-boost',
    name: 'Monthly Boost',
    info: 'Monthly VIP boost based on your tier and play.',
    icon: 'boost-30',
    kind: 'claim',
    amount: 10,
  }

  const postMonthlyBoostActive: HubRow = {
    id: 'post-monthly-boost',
    name: 'Post-Monthly Boost',
    info: 'A boost available after your monthly cycle completes.',
    icon: 'boost-15',
    kind: 'cooldown',
    cooldownLabel: '10 DAYS',
  }

  const weeklyBoostLocked: HubRow = {
    id: 'weekly-boost-locked',
    name: 'Weekly Boost',
    info: 'Unlocks at Silver VIP and above.',
    icon: 'boost-7',
    kind: 'locked',
    unlockTier: 'SILVER',
  }

  const monthlyBoostLocked: HubRow = {
    id: 'monthly-boost-locked',
    name: 'Monthly Boost',
    info: 'Unlocks at Platinum VIP and above.',
    icon: 'boost-30',
    kind: 'locked',
    unlockTier: 'PLATINUM',
  }

  const postMonthlyBoostLocked: HubRow = {
    id: 'post-monthly-boost-locked',
    name: 'Post-Monthly Boost',
    info: 'Unlocks at Platinum VIP and above.',
    icon: 'boost-15',
    kind: 'locked',
    unlockTier: 'PLATINUM',
  }

  const referAFriend: HubRow = {
    id: REFERRAL_REWARD_ID,
    name: 'Refer-A-Friend',
    info: 'Claim commission earned when friends you referred wager on sports and casino.',
    infoLinkHref: '/promotions/refer-a-friend',
    infoLinkLabel: 'Open Refer-A-Friend',
    icon: 'refer-a-friend',
    kind: 'claim',
    amount: referralClaimable,
    subtitle:
      referralClaimable > 0
        ? 'Commission ready'
        : 'No commission ready — earn more as friends play',
  }

  const onDemand: HubRow[] = [
    {
      id: 'special-reload',
      name: 'Special Reload',
      info: 'Limited-time reload offers for VIP members. Multi-release — older campaigns stay pinned first.',
      icon: 'reload-star',
      kind: 'claim',
      amount: 5,
      subtitle: '0 of 7 claimed',
    },
    {
      id: 'special-boost',
      name: 'Special Boost',
      info: 'Exclusive boosts for special VIP campaigns.',
      icon: 'boost-star',
      kind: 'claim',
      amount: 3,
      removeOnClaim: true,
    },
    {
      id: 'free-spins',
      name: 'Free Spins',
      info: 'Choose a game to play free spins from on-demand VIP campaigns.',
      icon: 'free-spins',
      kind: 'claim',
      subtitle: '50 spins ready',
      ctaLabel: 'Choose Game',
      spinsLeft: 50,
    },
  ]

  let scheduled: HubRow[]
  let locked: HubRow[]

  if (tier === 'bronze') {
    scheduled = [monthlyReload, postMonthlyReload]
    locked = [weeklyBoostLocked, monthlyBoostLocked, postMonthlyBoostLocked]
  } else if (tier === 'silver-gold') {
    scheduled = [weeklyBoostActive, monthlyReload, postMonthlyReload]
    locked = [monthlyBoostLocked, postMonthlyBoostLocked]
  } else {
    scheduled = [weeklyBoostActive, monthlyBoostActive, postMonthlyBoostActive]
    locked = []
  }

  const sections: HubSection[] = [
    { id: 'rakeback', title: null, rows: [rakeback] },
    { id: 'referral', title: null, rows: [referAFriend] },
    { id: 'scheduled', title: null, rows: scheduled },
  ]

  if (locked.length > 0) {
    sections.push({ id: 'locked', title: null, rows: locked })
  }

  sections.push({ id: 'on-demand', title: null, rows: onDemand })

  return sections
}

function asLoginRows(sections: HubSection[]): HubSection[] {
  return sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => {
      if (row.kind === 'locked') return row
      return {
        id: row.id,
        name: row.name,
        info: row.info,
        infoLinkHref: row.infoLinkHref,
        infoLinkLabel: row.infoLinkLabel,
        icon: row.icon,
        kind: 'login' as const,
        subtitle: 'subtitle' in row ? row.subtitle : undefined,
      }
    }),
  }))
}

function RowIcon({ type }: { type: IconKind }) {
  const cls = 'size-5 text-white'

  switch (type) {
    case 'rakeback':
      return <IconRefresh className={cls} strokeWidth={1.75} />
    case 'reload-30':
    case 'boost-30':
      return <VipIconMonthly className={cls} />
    case 'reload-15':
    case 'boost-15':
      return <VipIconPostMonthly className={cls} />
    case 'boost-7':
      return <VipIconWeekly className={cls} />
    case 'reload-star':
    case 'boost-star':
      return <VipIconSpecial className={cls} />
    case 'free-spins':
      return <IconSparkles className={cls} strokeWidth={1.75} />
    case 'refer-a-friend':
      return <IconUserPlus className={cls} strokeWidth={1.75} />
    default:
      return <IconRefresh className={cls} strokeWidth={1.75} />
  }
}

function fireClaimConfetti(buttonEl: HTMLElement | null) {
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
}

/** Red claim / log-in CTA with hover brightness + intermittent shimmer */
function ClaimStyleButton({
  children,
  onClick,
  disabled,
  className,
  subtle = false,
  ...props
}: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  /** Soft outline CTA (e.g. Choose Game) instead of solid primary fill */
  subtle?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      style={
        subtle
          ? undefined
          : { backgroundColor: 'var(--ds-primary, #ee3536)' }
      }
      className={cn(
        'relative h-9 shrink-0 overflow-hidden rounded-lg px-3 text-[11px] font-bold uppercase tracking-wider transition-[filter,colors] duration-150 disabled:cursor-not-allowed disabled:opacity-80',
        subtle
          ? 'border border-[var(--ds-primary,#ee3536)]/45 bg-[var(--ds-primary,#ee3536)]/10 text-[var(--ds-fg)] hover:bg-[var(--ds-primary,#ee3536)]/18 hover:border-[var(--ds-primary,#ee3536)]/70'
          : 'text-white hover:brightness-110',
        className
      )}
      {...props}
      disabled={disabled}
      onClick={onClick}
    >
      {!disabled && !subtle ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-wallet-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  )
}

function BenefitRow({
  row,
  onClaimed,
  highlighted = false,
}: {
  row: HubRow
  onClaimed?: (id: string, remove: boolean) => void
  highlighted?: boolean
}) {
  const { isLoggedIn } = useAuthSession()
  const rowRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const [claiming, setClaiming] = useState(false)
  const [showClaimedFlash, setShowClaimedFlash] = useState(false)
  const [claimInactive, setClaimInactive] = useState(
    () =>
      row.kind === 'claim' &&
      !row.ctaLabel &&
      typeof row.amount === 'number' &&
      row.amount <= 0
  )
  const [gamePickerOpen, setGamePickerOpen] = useState(false)
  const [spinsLeft, setSpinsLeft] = useState(() =>
    row.kind === 'claim' && typeof row.spinsLeft === 'number' ? row.spinsLeft : 0
  )

  const isChooseGame = row.kind === 'claim' && Boolean(row.ctaLabel)
  const freeSpinsExhausted = isChooseGame && spinsLeft <= 0
  const nothingToClaim =
    row.kind === 'claim' &&
    !isChooseGame &&
    typeof row.amount === 'number' &&
    row.amount <= 0
  const isClaimDisabled = claimInactive || nothingToClaim

  // Grey out when nothing to claim; re-enable only when amount goes from 0 → >0 (e.g. new RAF commission)
  const prevAmountRef = useRef(
    row.kind === 'claim' ? row.amount : undefined
  )
  useEffect(() => {
    if (row.kind !== 'claim' || isChooseGame) return
    const amount = row.amount
    const prev = prevAmountRef.current
    prevAmountRef.current = amount
    if (typeof amount === 'number' && amount <= 0) {
      setClaimInactive(true)
      return
    }
    if (
      typeof amount === 'number' &&
      amount > 0 &&
      typeof prev === 'number' &&
      prev <= 0
    ) {
      setClaimInactive(false)
    }
  }, [isChooseGame, row])

  useEffect(() => {
    if (!showClaimedFlash) return
    const t = window.setTimeout(() => {
      setShowClaimedFlash(false)
      setClaimInactive(true)
    }, CLAIMED_FLASH_MS)
    return () => window.clearTimeout(t)
  }, [showClaimedFlash])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = rowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    el.style.setProperty('--spot-opacity', '1')
  }, [])

  const handleMouseLeave = useCallback(() => {
    rowRef.current?.style.setProperty('--spot-opacity', '0')
  }, [])

  const completeClaim = useCallback(
    (opts?: {
      game?: FreeSpinGameOption
      buttonEl?: HTMLButtonElement | null
      spinsUsed?: number
    }) => {
      if (row.kind !== 'claim') return
      playSound('redeem')
      fireClaimConfetti(opts?.buttonEl ?? buttonRef.current)
      const amount = row.amount
      const remainingAfter =
        opts?.spinsUsed != null
          ? Math.max(0, spinsLeft - opts.spinsUsed)
          : spinsLeft

      window.setTimeout(() => {
        playSound('button-click')
        if (opts?.game) {
          toast.success(`Playing ${opts.game.name}`, {
            description:
              remainingAfter > 0
                ? `${opts.spinsUsed ?? 0} spins used · ${remainingAfter} left — choose another game anytime.`
                : `Last spins used on ${opts.game.name}.`,
            duration: 3500,
          })
        } else {
          toast.success(
            amount != null ? `Claimed $${amount.toFixed(2)}` : `Claimed ${row.name}`,
            {
              description: `${row.name} has been added to your balance.`,
              duration: 3500,
            }
          )
        }
      }, 2000)
      if (typeof window !== 'undefined' && amount != null && amount > 0) {
        window.dispatchEvent(
          new CustomEvent('notification:claim-reward', { detail: { amount } })
        )
      }
      if (row.id === REFERRAL_REWARD_ID) {
        useReferralStore.getState().claimCommission()
      }
      setClaiming(false)
      if (opts?.spinsUsed != null) {
        setSpinsLeft(remainingAfter)
      } else {
        // Claimed flash → then inactive grey Claim (no timer)
        setShowClaimedFlash(true)
        onClaimed?.(row.id, Boolean(row.removeOnClaim))
      }
    },
    [onClaimed, row, spinsLeft]
  )

  const handleClaim = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (
        claiming ||
        showClaimedFlash ||
        isClaimDisabled ||
        freeSpinsExhausted ||
        row.kind !== 'claim'
      )
        return
      buttonRef.current = e.currentTarget

      if (isChooseGame) {
        setGamePickerOpen(true)
        return
      }

      setClaiming(true)
      const delayMs = 1100 + Math.floor(Math.random() * 500)
      window.setTimeout(() => {
        completeClaim({ buttonEl: buttonRef.current })
      }, delayMs)
    },
    [
      claiming,
      completeClaim,
      freeSpinsExhausted,
      isChooseGame,
      isClaimDisabled,
      row.kind,
      showClaimedFlash,
    ]
  )

  const handleGameSelect = useCallback(
    (game: FreeSpinGameOption) => {
      setGamePickerOpen(false)
      const spinsUsed = Math.min(10, spinsLeft)
      launchCasinoGame({
        title: game.name,
        image: game.image,
        provider: game.provider,
        features: [`${spinsUsed} free spins applied`],
      })
      setClaiming(true)
      window.setTimeout(() => {
        completeClaim({
          game,
          buttonEl: buttonRef.current,
          spinsUsed,
        })
      }, 400)
    },
    [completeClaim, spinsLeft]
  )

  const handleLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    playSound('redeem')
    fireClaimConfetti(e.currentTarget)
    requestLogin()
  }, [])

  const showClaimHighlight =
    !isLoggedIn ||
    row.kind === 'login' ||
    (row.kind === 'claim' &&
      !showClaimedFlash &&
      !isClaimDisabled &&
      !freeSpinsExhausted)

  const claimLabel =
    row.kind === 'claim' && row.ctaLabel
      ? row.ctaLabel
      : row.kind === 'claim' && row.amount != null && row.amount > 0
        ? `Claim $${row.amount.toFixed(2)}`
        : 'Claim'

  const rowSubtitle = isChooseGame
    ? spinsLeft > 0
      ? `${spinsLeft} spin${spinsLeft === 1 ? '' : 's'} left`
      : 'All spins used'
    : 'subtitle' in row
      ? row.subtitle
      : undefined

  return (
    <div
      ref={rowRef}
      data-reward-id={row.id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative flex items-center gap-3 overflow-visible rounded-xl border bg-[var(--ds-overlay)] px-3 py-3 transition-colors duration-200',
        highlighted
          ? 'border-[var(--ds-primary,#ee3536)] ring-2 ring-[var(--ds-primary,#ee3536)]/35'
          : showClaimHighlight
            ? 'border-[var(--ds-control-border)] hover:border-[var(--ds-primary,#ee3536)]/50'
            : 'border-[var(--ds-control-border)] hover:border-[var(--ds-border-strong)]'
      )}
      style={
        {
          '--spot-x': '50%',
          '--spot-y': '50%',
          '--spot-opacity': '0',
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          background:
            'radial-gradient(220px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, var(--ds-primary, #ee3536) 22%, transparent), transparent 60%)',
          opacity: 'var(--spot-opacity)',
        }}
      />

      <div
        className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
        style={rewardAccentStyle(row.name)}
      >
        <RowIcon type={row.icon} />
      </div>
      <div className="relative z-20 min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-[var(--ds-fg)]">
            {row.name}
          </span>
          {row.info ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="relative z-30 text-[var(--ds-fg-subtle)] transition-colors hover:text-[var(--ds-fg-muted)]"
                    aria-label={`${row.name} info`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconInfoCircle className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="z-[200] max-w-[260px] border-[var(--ds-border)] bg-[var(--ds-surface)] text-xs text-[var(--ds-fg)]"
                >
                  <p>{row.info}</p>
                  {row.infoLinkHref ? (
                    <a
                      href={row.infoLinkHref}
                      className="mt-1.5 inline-block font-semibold text-[var(--ds-primary,#ee3536)] underline-offset-2 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.dispatchEvent(new CustomEvent('vip:close-drawer'))
                      }}
                    >
                      {row.infoLinkLabel ?? 'Learn more'}
                    </a>
                  ) : null}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        {rowSubtitle && (isLoggedIn || row.kind === 'login') ? (
          <p className="mt-0.5 text-[11px] text-[var(--ds-fg-subtle)]">
            {rowSubtitle}
          </p>
        ) : null}
      </div>

      <div className="relative z-10 shrink-0">
        {row.kind === 'locked' ? (
          <div className="flex h-9 min-w-[44px] items-center justify-center gap-1.5 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] px-2.5 text-[11px] font-bold uppercase tracking-wider text-[var(--ds-fg-muted)]">
            <IconLock className="size-3.5 shrink-0" strokeWidth={2} />
            {row.unlockTier}
          </div>
        ) : !isLoggedIn || row.kind === 'login' ? (
          <ClaimStyleButton onClick={handleLogin}>Log in</ClaimStyleButton>
        ) : row.kind === 'cooldown' ? (
          <div className="flex h-9 min-w-[44px] items-center justify-center rounded-lg bg-[var(--ds-control-bg)] px-2.5 text-[11px] font-semibold uppercase tabular-nums tracking-wide text-[var(--ds-fg-muted)]">
            {row.cooldownLabel}
          </div>
        ) : showClaimedFlash ? (
          <div className="flex h-9 min-w-[7.5rem] items-center justify-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <IconCheck className="size-3.5" />
            Claimed
          </div>
        ) : freeSpinsExhausted ? (
          <div className="flex h-9 items-center justify-center gap-1 rounded-lg border border-white/15 bg-white/[0.03] px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ds-fg-muted)]">
            Used
          </div>
        ) : isClaimDisabled ? (
          <button
            type="button"
            disabled
            className="flex h-9 min-w-[7.5rem] cursor-not-allowed items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ds-fg-subtle)] opacity-55"
          >
            Claim
          </button>
        ) : (
          <ClaimStyleButton
            disabled={claiming}
            className="min-w-[7.5rem]"
            subtle={isChooseGame}
            onClick={handleClaim}
            aria-busy={claiming}
          >
            {claiming ? (
              <span className="inline-flex items-center gap-1.5">
                <IconLoader2 className="size-3.5 animate-spin" aria-hidden />
                {isChooseGame ? 'Opening' : 'Claiming'}
              </span>
            ) : (
              claimLabel
            )}
          </ClaimStyleButton>
        )}
      </div>

      {isChooseGame && spinsLeft > 0 ? (
        <FreeSpinsGamePicker
          open={gamePickerOpen}
          onOpenChange={setGamePickerOpen}
          spinsLeft={spinsLeft}
          onSelect={handleGameSelect}
        />
      ) : null}
    </div>
  )
}

function ProgressCard({ tier }: { tier: VipHubTierBand }) {
  if (tier === 'platinum') {
    return <VipTierProgressCard fromTier="Platinum I" toTier="Platinum II" percent={40} />
  }
  if (tier === 'silver-gold') {
    return <VipTierProgressCard fromTier="Silver" toTier="Gold" percent={55} />
  }
  return <VipTierProgressCard fromTier="Bronze" toTier="Silver" percent={25} />
}

function TelegramCta() {
  return (
    <a
      href="https://t.me/betonline"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-[#229ED9]/25 bg-gradient-to-r from-[#229ED9]/10 to-[#229ED9]/5 p-3.5 transition-colors hover:border-[#229ED9]/45"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#229ED9]/20 transition-colors group-hover:bg-[#229ED9]/30">
        <IconBrandTelegram className="size-5 text-[#229ED9]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--ds-fg)]">Get Telegram</p>
        <p className="mt-0.5 text-[11px] leading-snug text-[var(--ds-fg-subtle)]">
          Get exclusive Cash Drop codes, promotions & rewards delivered straight to you.
        </p>
      </div>
      <span className="shrink-0 rounded-lg bg-[#229ED9] px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-[#1a8bc2]">
        Join
      </span>
    </a>
  )
}

export function VipHubOverview({
  className,
  /** Demo / preview band — defaults to Bronze (matches progress card). */
  tier = 'bronze',
}: {
  className?: string
  tier?: VipHubTierBand
}) {
  const { isLoggedIn } = useAuthSession()
  const referralClaimable = useReferralStore((s) => s.claimableAmount)
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set())
  const [focusedRewardId, setFocusedRewardId] = useState<string | null>(null)

  useEffect(() => {
    const handler = (evt: Event) => {
      const id = (evt as CustomEvent<{ focusRewardId?: string }>).detail?.focusRewardId
      if (!id) return
      setFocusedRewardId(id)
      window.setTimeout(() => {
        document
          .querySelector(`[data-reward-id="${id}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 180)
      window.setTimeout(() => setFocusedRewardId((current) => (current === id ? null : current)), 4200)
    }
    window.addEventListener('vip:open-drawer', handler)
    return () => window.removeEventListener('vip:open-drawer', handler)
  }, [])

  const sections = useMemo(() => {
    const base = buildHubSections(tier, referralClaimable)
    const withAuth = isLoggedIn ? base : asLoginRows(base)
    if (removedIds.size === 0) return withAuth
    return withAuth
      .map((section) => ({
        ...section,
        rows: section.rows.filter((row) => !removedIds.has(row.id)),
      }))
      .filter((section) => section.rows.length > 0)
  }, [isLoggedIn, referralClaimable, removedIds, tier])

  const handleClaimed = useCallback((id: string, remove: boolean) => {
    if (!remove) return
    setRemovedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  return (
    <div className={cn('space-y-3', className)}>
      {isLoggedIn ? <ProgressCard tier={tier} /> : null}

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="space-y-2">
            {section.title ? (
              <p className="px-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ds-fg-subtle)]">
                {section.title}
              </p>
            ) : null}
            {section.rows.map((row) => (
              <BenefitRow
                key={row.id}
                row={row}
                onClaimed={handleClaimed}
                highlighted={focusedRewardId === row.id}
              />
            ))}
          </div>
        ))}
      </div>

      {isLoggedIn ? <TelegramCta /> : null}
    </div>
  )
}

export default VipHubOverview
