'use client'

import Image from 'next/image'
import NumberFlow from '@number-flow/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  IconBrandTelegram,
  IconCalendar,
  IconCheck,
  IconInfoCircle,
  IconRefresh,
  IconStar,
  IconStopwatch,
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

type IconKind =
  | 'rakeback'
  | 'reload-30'
  | 'reload-15'
  | 'reload-star'
  | 'boost-7'
  | 'boost-15'
  | 'boost-30'
  | 'boost-star'

type HubRow =
  | {
      id: string
      name: string
      info?: string
      icon: IconKind
      kind: 'claim'
      amount: number
      subtitle?: string
    }
  | {
      id: string
      name: string
      info?: string
      icon: IconKind
      kind: 'cooldown'
      subtitle: string
      cooldownLabel: string
    }
  | {
      id: string
      name: string
      info?: string
      icon: IconKind
      kind: 'login'
    }

/** Logged-in VIP tab — progress + claimable rows + Telegram */
const LOGGED_IN_ROWS: HubRow[] = [
  {
    id: 'rakeback',
    name: 'Rakeback',
    info: 'Claim a share of every bet back, every 7 minutes. Terms & Conditions',
    icon: 'rakeback',
    kind: 'claim',
    amount: 0.2,
  },
  {
    id: 'monthly-reload',
    name: 'Monthly Reload',
    info: 'Reload bonus available once per month based on your VIP tier.',
    icon: 'reload-30',
    kind: 'cooldown',
    subtitle: '2 of 3 claimed',
    cooldownLabel: '10d',
  },
  {
    id: 'pre-monthly-reload',
    name: 'Pre-Monthly Reload',
    info: 'An early reload window before your monthly bonus resets.',
    icon: 'reload-15',
    kind: 'claim',
    amount: 1,
    subtitle: '2 of 5 claimed',
  },
]

/** Logged-out VIP tab — full reward list with Log in CTAs (Figma) */
const LOGGED_OUT_ROWS: HubRow[] = [
  {
    id: 'rakeback',
    name: 'Rakeback',
    info: 'Claim a share of every bet back, every 7 minutes. Terms & Conditions',
    icon: 'rakeback',
    kind: 'login',
  },
  {
    id: 'monthly-reload',
    name: 'Monthly Reload',
    info: 'Reload bonus available once per month based on your VIP tier.',
    icon: 'reload-30',
    kind: 'login',
  },
  {
    id: 'pre-monthly-reload',
    name: 'Pre-Monthly Reload',
    info: 'An early reload window before your monthly bonus resets.',
    icon: 'reload-15',
    kind: 'login',
  },
  {
    id: 'special-reload',
    name: 'Special Reload',
    info: 'Limited-time reload offers for VIP members.',
    icon: 'reload-star',
    kind: 'login',
  },
  {
    id: 'weekly-boost',
    name: 'Weekly Boost',
    info: 'Boost your balance every week as you climb the VIP ladder.',
    icon: 'boost-7',
    kind: 'login',
  },
  {
    id: 'post-monthly-boost',
    name: 'Post-Monthly Boost',
    info: 'A boost available after your monthly cycle completes.',
    icon: 'boost-15',
    kind: 'login',
  },
  {
    id: 'monthly-boost',
    name: 'Monthly Boost',
    info: 'Monthly VIP boost based on your tier and play.',
    icon: 'boost-30',
    kind: 'login',
  },
  {
    id: 'special-boost',
    name: 'Special Boost',
    info: 'Exclusive boosts for special VIP campaigns.',
    icon: 'boost-star',
    kind: 'login',
  },
]

function RowIcon({ type }: { type: IconKind }) {
  if (type === 'rakeback') {
    return <IconRefresh className="size-5 text-white/80" strokeWidth={1.75} />
  }

  if (type.startsWith('reload')) {
    const label =
      type === 'reload-30' ? '30' : type === 'reload-15' ? '15' : null
    return (
      <span className="relative flex size-5 items-center justify-center text-white/80">
        <IconStopwatch className="size-5" strokeWidth={1.5} />
        <span className="absolute inset-0 flex items-center justify-center pt-0.5 text-[8px] font-bold tabular-nums leading-none">
          {label ?? <IconStar className="size-2.5 fill-current" strokeWidth={0} />}
        </span>
      </span>
    )
  }

  const label =
    type === 'boost-7' ? '7' : type === 'boost-15' ? '15' : type === 'boost-30' ? '30' : null
  return (
    <span className="relative flex size-5 items-center justify-center text-white/80">
      <IconCalendar className="size-5" strokeWidth={1.5} />
      <span className="absolute inset-0 flex items-center justify-center pt-1 text-[8px] font-bold tabular-nums leading-none">
        {label ?? <IconStar className="size-2.5 fill-current" strokeWidth={0} />}
      </span>
    </span>
  )
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
}: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
      className={cn(
        'relative h-9 shrink-0 overflow-hidden rounded-lg px-3 text-[11px] font-bold uppercase tracking-wider text-white transition-[filter] duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-wallet-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <span className="relative">{children}</span>
    </button>
  )
}

function BenefitRow({ row }: { row: HubRow }) {
  const { isLoggedIn } = useAuthSession()
  const rowRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [claimed, setClaimed] = useState(false)

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
      if (claimed || row.kind !== 'claim') return
      playSound('redeem')
      fireClaimConfetti(buttonRef.current)
      const amount = row.amount
      window.setTimeout(() => {
        playSound('button-click')
        toast.success(`Claimed $${amount.toFixed(2)}`, {
          description: `${row.name} has been added to your balance.`,
          duration: 3500,
        })
      }, 2000)
      if (typeof window !== 'undefined' && amount > 0) {
        window.dispatchEvent(
          new CustomEvent('notification:claim-reward', { detail: { amount } })
        )
      }
      setClaimed(true)
    },
    [claimed, row]
  )

  const handleLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    playSound('redeem')
    fireClaimConfetti(e.currentTarget)
    requestLogin()
  }, [])

  const showClaimHighlight =
    !isLoggedIn || row.kind === 'login' || (row.kind === 'claim' && !claimed)

  return (
    <div
      ref={rowRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative flex items-center gap-3 overflow-hidden rounded-xl border bg-white/[0.04] px-3 py-3 transition-colors duration-200',
        showClaimHighlight
          ? 'border-white/[0.06] hover:border-[var(--ds-primary,#ee3536)]/50'
          : 'border-white/[0.06] hover:border-white/15'
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

      <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
        <RowIcon type={row.icon} />
      </div>
      <div className="relative z-10 min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-white">{row.name}</span>
          {row.info ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-white/35 transition-colors hover:text-white/60"
                    aria-label={`${row.name} info`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconInfoCircle className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[240px] border-white/10 bg-[#f5f5f5] text-xs text-[#1a1a1a]"
                >
                  {row.info}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        {'subtitle' in row && row.subtitle && isLoggedIn ? (
          <p className="mt-0.5 text-[11px] text-white/45">{row.subtitle}</p>
        ) : null}
      </div>

      <div className="relative z-10 shrink-0">
        {!isLoggedIn || row.kind === 'login' ? (
          <ClaimStyleButton onClick={handleLogin}>Log in</ClaimStyleButton>
        ) : row.kind === 'cooldown' ? (
          <div className="flex h-9 min-w-[44px] items-center justify-center rounded-lg bg-white/[0.06] px-2.5 text-xs font-semibold tabular-nums text-white/70">
            {row.cooldownLabel}
          </div>
        ) : claimed ? (
          <div className="flex h-9 items-center justify-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <IconCheck className="size-3.5" />
            Claimed
          </div>
        ) : (
          <ClaimStyleButton
            onClick={(e) => {
              buttonRef.current = e.currentTarget
              handleClaim(e)
            }}
          >
            Claim ${row.amount.toFixed(2)}
          </ClaimStyleButton>
        )}
      </div>
    </div>
  )
}

function ProgressCard() {
  const [animatedPercent, setAnimatedPercent] = useState(0)
  const value = 25

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setAnimatedPercent(value * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3.5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 flex-col items-center justify-center gap-1">
          <Image
            src="/icons/header/crown.svg"
            alt=""
            width={22}
            height={22}
            className="size-[22px]"
            unoptimized
          />
          <span className="h-px w-5 bg-[#EAAF6D]/70" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Bronze to Silver</p>
          <div className="mt-2 flex items-center gap-2.5">
            <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[#EAAF6D]"
                initial={false}
                animate={{ width: `${animatedPercent}%` }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium tabular-nums text-white/80">
              <NumberFlow value={Math.round(animatedPercent)} />%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-white/40">Updated 24/25/2024, 8:00 PM ET</p>
        </div>
      </div>
    </div>
  )
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
        <p className="text-sm font-semibold text-white">Get Telegram</p>
        <p className="mt-0.5 text-[11px] leading-snug text-white/45">
          Get exclusive Cash Drop codes, promotions & rewards delivered straight to you.
        </p>
      </div>
      <span className="shrink-0 rounded-lg bg-[#229ED9] px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-[#1a8bc2]">
        Join
      </span>
    </a>
  )
}

export function VipHubOverview({ className }: { className?: string }) {
  const { isLoggedIn } = useAuthSession()
  const rows = isLoggedIn ? LOGGED_IN_ROWS : LOGGED_OUT_ROWS

  return (
    <div className={cn('space-y-3', className)}>
      {isLoggedIn ? <ProgressCard /> : null}

      <div className="space-y-2">
        {rows.map((row) => (
          <BenefitRow key={row.id} row={row} />
        ))}
      </div>

      {isLoggedIn ? <TelegramCta /> : null}
    </div>
  )
}

export default VipHubOverview
