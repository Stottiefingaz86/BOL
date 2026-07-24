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
} from '@tabler/icons-react'
import { fireConfetti } from '@/lib/confetti'
import { playSound } from '@/lib/sounds'
import { toast } from 'sonner'
import { useAuthSession } from '@/hooks/use-auth-session'
import { requestLogin } from '@/lib/auth-session'
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

type HubSectionId = 'rakeback' | 'scheduled' | 'locked' | 'on-demand'

/** Tier bands from HUB-SORTING.pdf final views */
export type VipHubTierBand = 'bronze' | 'silver-gold' | 'platinum'

type HubRow =
  | {
      id: string
      name: string
      info?: string
      icon: IconKind
      kind: 'claim'
      amount?: number
      subtitle?: string
      /** On-demand rows disappear after claim (except multi-release Special Reload) */
      removeOnClaim?: boolean
      /** After claim, show a live countdown then become claimable again */
      claimCooldownMs?: number
    }
  | {
      id: string
      name: string
      info?: string
      icon: IconKind
      kind: 'cooldown'
      subtitle?: string
      cooldownLabel: string
    }
  | {
      id: string
      name: string
      info?: string
      icon: IconKind
      kind: 'locked'
      unlockTier: string
    }
  | {
      id: string
      name: string
      info?: string
      icon: IconKind
      kind: 'login'
      subtitle?: string
    }

const RAKEBACK_COOLDOWN_MS = 15 * 60 * 1000

function formatCooldownMmSs(ms: number) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

type HubSection = {
  id: HubSectionId
  title: string | null
  rows: HubRow[]
}

/**
 * Build VIP hub sections per HUB-SORTING.pdf:
 * 1. Rakeback (always top)
 * 2. Scheduled — active (tier naming: Reload below Platinum, Boost at Platinum+)
 * 3. Locked — future VIP levels
 * 4. On-demand — Special Reload pinned, then others by expiry
 */
function buildHubSections(tier: VipHubTierBand): HubSection[] {
  const rakeback: HubRow = {
    id: 'rakeback',
    name: 'Rakeback',
    info: 'Claim a share of every bet back, every 15 minutes. Terms & Conditions',
    icon: 'rakeback',
    kind: 'claim',
    amount: 0.2,
    claimCooldownMs: RAKEBACK_COOLDOWN_MS,
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
      info: 'Claim free spins from on-demand VIP campaigns.',
      icon: 'free-spins',
      kind: 'claim',
      removeOnClaim: true,
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
    { id: 'scheduled', title: 'SCHEDULED', rows: scheduled },
  ]

  if (locked.length > 0) {
    sections.push({ id: 'locked', title: 'LOCKED', rows: locked })
  }

  sections.push({ id: 'on-demand', title: 'ON DEMAND', rows: onDemand })

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
  ...props
}: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
      className={cn(
        'relative h-9 shrink-0 overflow-hidden rounded-lg px-3 text-[11px] font-bold uppercase tracking-wider text-white transition-[filter] duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-80',
        className
      )}
      {...props}
      disabled={disabled}
      onClick={onClick}
    >
      {!disabled ? (
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
}: {
  row: HubRow
  onClaimed?: (id: string, remove: boolean) => void
}) {
  const { isLoggedIn } = useAuthSession()
  const rowRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const claimCooldownMs = row.kind === 'claim' ? row.claimCooldownMs : undefined

  const [claimed, setClaimed] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [showClaimedFlash, setShowClaimedFlash] = useState(false)
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null)
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(0)

  useEffect(() => {
    if (!cooldownEndsAt) {
      setCooldownRemainingMs(0)
      return
    }

    const tick = () => {
      const left = Math.max(0, cooldownEndsAt - Date.now())
      setCooldownRemainingMs(left)
      if (left <= 0) {
        setCooldownEndsAt(null)
        setClaimed(false)
        setShowClaimedFlash(false)
      }
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [cooldownEndsAt])

  useEffect(() => {
    if (!showClaimedFlash) return
    const t = window.setTimeout(() => setShowClaimedFlash(false), 2200)
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

  const handleClaim = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (claimed || claiming || row.kind !== 'claim' || cooldownEndsAt) return
      buttonRef.current = e.currentTarget
      setClaiming(true)

      // Simulate pending DB / claim API round-trip
      const delayMs = 1100 + Math.floor(Math.random() * 500)
      window.setTimeout(() => {
        playSound('redeem')
        fireClaimConfetti(buttonRef.current)
        const amount = row.amount
        window.setTimeout(() => {
          playSound('button-click')
          toast.success(
            amount != null ? `Claimed $${amount.toFixed(2)}` : `Claimed ${row.name}`,
            {
              description: `${row.name} has been added to your balance.`,
              duration: 3500,
            }
          )
        }, 2000)
        if (typeof window !== 'undefined' && amount != null && amount > 0) {
          window.dispatchEvent(
            new CustomEvent('notification:claim-reward', { detail: { amount } })
          )
        }
        setClaiming(false)
        setClaimed(true)
        if (claimCooldownMs) {
          const endsAt = Date.now() + claimCooldownMs
          setCooldownEndsAt(endsAt)
          setShowClaimedFlash(true)
        }
        onClaimed?.(row.id, Boolean(row.removeOnClaim))
      }, delayMs)
    },
    [claimed, claiming, claimCooldownMs, cooldownEndsAt, onClaimed, row]
  )

  const handleLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    playSound('redeem')
    fireClaimConfetti(e.currentTarget)
    requestLogin()
  }, [])

  const onCooldown = Boolean(cooldownEndsAt && cooldownRemainingMs > 0)

  const showClaimHighlight =
    !isLoggedIn ||
    row.kind === 'login' ||
    (row.kind === 'claim' && !claimed && !onCooldown)

  const claimLabel =
    row.kind === 'claim' && row.amount != null
      ? `Claim $${row.amount.toFixed(2)}`
      : 'Claim'

  return (
    <div
      ref={rowRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative flex items-center gap-3 overflow-visible rounded-xl border bg-[var(--ds-overlay)] px-3 py-3 transition-colors duration-200',
        showClaimHighlight
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
          <span className="truncate text-sm font-semibold text-[var(--ds-fg)]">{row.name}</span>
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
                  className="z-[200] max-w-[240px] border-[var(--ds-border)] bg-[var(--ds-surface)] text-xs text-[var(--ds-fg)]"
                >
                  {row.info}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        {'subtitle' in row && row.subtitle && (isLoggedIn || row.kind === 'login') ? (
          <p className="mt-0.5 text-[11px] text-[var(--ds-fg-subtle)]">{row.subtitle}</p>
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
          <div className="flex h-9 items-center justify-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <IconCheck className="size-3.5" />
            Claimed
          </div>
        ) : onCooldown ? (
          <div
            className="flex h-9 min-w-[4.5rem] items-center justify-center rounded-lg bg-[var(--ds-control-bg)] px-2.5 text-[11px] font-semibold tabular-nums tracking-wide text-[var(--ds-fg-muted)]"
            aria-live="polite"
            aria-label={`Available in ${formatCooldownMmSs(cooldownRemainingMs)}`}
          >
            {formatCooldownMmSs(cooldownRemainingMs)}
          </div>
        ) : claimed ? (
          <div className="flex h-9 items-center justify-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <IconCheck className="size-3.5" />
            Claimed
          </div>
        ) : (
          <ClaimStyleButton
            disabled={claiming}
            className="min-w-[7.5rem]"
            onClick={handleClaim}
            aria-busy={claiming}
          >
            {claiming ? (
              <span className="inline-flex items-center gap-1.5">
                <IconLoader2 className="size-3.5 animate-spin" aria-hidden />
                Claiming
              </span>
            ) : (
              claimLabel
            )}
          </ClaimStyleButton>
        )}
      </div>
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
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set())

  const sections = useMemo(() => {
    const base = buildHubSections(tier)
    const withAuth = isLoggedIn ? base : asLoginRows(base)
    if (removedIds.size === 0) return withAuth
    return withAuth
      .map((section) => ({
        ...section,
        rows: section.rows.filter((row) => !removedIds.has(row.id)),
      }))
      .filter((section) => section.rows.length > 0)
  }, [isLoggedIn, removedIds, tier])

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
              <BenefitRow key={row.id} row={row} onClaimed={handleClaimed} />
            ))}
          </div>
        ))}
      </div>

      {isLoggedIn ? <TelegramCta /> : null}
    </div>
  )
}

export default VipHubOverview
