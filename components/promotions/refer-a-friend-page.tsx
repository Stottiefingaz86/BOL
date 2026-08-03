'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  IconBrandX,
  IconChevronDown,
  IconCopy,
  IconCurrencyDollar,
  IconInfinity,
  IconLink,
  IconShare2,
  IconTopologyStar3,
  IconUsers,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SpotlightOverlay, useCursorSpotlight } from '@/components/ui/cursor-spotlight'
import { requestLogin } from '@/lib/auth-session'
import {
  REFERRAL_REWARD_ID,
  useReferralStore,
  type ReferralRow,
} from '@/lib/store/referralStore'
import { cn } from '@/lib/utils'

/** @deprecated Prefer `REFERRAL_REWARD_ID` from `@/lib/store/referralStore` */
export { REFERRAL_REWARD_ID }
/** @deprecated Prefer store claimable amount */
export const REFERRAL_CLAIMABLE_AMOUNT = 40

const REFERRAL_LINK = 'https://www.betonline.ag/?RAF=7NNSD1Q5'

const PAGE_SIZE = 10

const LANDING_FEATURES = [
  {
    title: 'Lifetime commission',
    description:
      'Keep earning as long as your friends play. No expiry on referrals that stick.',
    icon: IconInfinity,
  },
  {
    title: 'No earnings cap',
    description:
      'The more they wager, the more you make, with no artificial limits.',
    icon: IconTopologyStar3,
  },
  {
    title: 'Sports + Casino',
    description: 'Commission follows real play across the products they use.',
    icon: IconUsers,
  },
]

const LANDING_GETTING_STARTED = [
  {
    title: 'Share your link',
    description:
      'Share your unique signup link by email, social, or anywhere you connect.',
    cta: 'Get started',
  },
  {
    title: 'Friends play',
    description:
      'Earn commission on every wager your friends place on Sports and Casino, win or lose.',
    cta: 'Log in',
  },
  {
    title: 'Claim anytime',
    description:
      'Commissions are ready to claim instantly from VIP Hub whenever you want.',
    cta: 'Open VIP Hub',
  },
]

/** Match My Account hub cards: soft fill + hairline stroke */
const cardClass =
  'rounded-xl border border-black/[0.06] bg-black/[0.03] dark:border-white/[0.05] dark:bg-white/[0.03]'

const controlClass =
  'h-11 rounded-[10px] border border-black/[0.06] bg-black/[0.03] text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)] shadow-none ring-offset-0 focus-visible:border-black/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-0 dark:border-white/[0.06] dark:bg-white/[0.04] dark:focus-visible:border-white/22 dark:focus-visible:ring-white/15'

const hairline = 'border-black/[0.06] dark:border-white/[0.04]'
const softFill = 'bg-black/[0.03] dark:bg-white/[0.03]'
const controlSurface =
  'border border-black/[0.06] bg-black/[0.03] dark:border-white/[0.06] dark:bg-white/[0.04]'

function openVipReferClaim() {
  window.dispatchEvent(
    new CustomEvent('vip:open-drawer', {
      detail: { focusRewardId: REFERRAL_REWARD_ID },
    })
  )
}

function DemoAuthToggle({
  isLoggedIn,
  onChange,
}: {
  isLoggedIn: boolean
  onChange: (loggedIn: boolean) => void
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-bg)] p-0.5"
      role="group"
      aria-label="Demo auth scenario"
    >
      {(
        [
          { label: 'Log in scenario', loggedIn: true },
          { label: 'Log out scenario', loggedIn: false },
        ] as const
      ).map(({ label, loggedIn }) => {
        const active = isLoggedIn === loggedIn
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(loggedIn)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'bg-[var(--ds-primary,#ee3536)] text-white'
                : 'text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]'
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof IconUsers
  label: string
  value: string
}) {
  return (
    <div className={cn('flex h-full min-w-0 flex-1 flex-col gap-2.5 p-4', cardClass)}>
      <div className="flex items-center gap-2.5">
        <Icon
          className="size-[18px] text-[var(--ds-fg-subtle)]"
          strokeWidth={1.8}
          aria-hidden
        />
        <p className="text-[13px] font-semibold text-[var(--ds-fg-muted)]">{label}</p>
      </div>
      <p className="mt-auto text-[28px] font-bold leading-none tracking-tight text-[var(--ds-fg)]">
        {value}
      </p>
    </div>
  )
}

function StatusPill({ status }: { status: ReferralRow['status'] }) {
  if (status === 'pending') {
    return (
      <span className="inline-flex rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
        Pending
      </span>
    )
  }
  return (
    <span className="inline-flex rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
      Joined
    </span>
  )
}

function CommissionPill({ amount, pending }: { amount: number; pending?: boolean }) {
  if (pending) {
    return (
      <span className="inline-flex rounded-full bg-black/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--ds-fg-subtle)] dark:bg-white/[0.04]">
        —
      </span>
    )
  }
  const positive = amount > 0
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
        positive
          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
          : 'bg-black/[0.04] text-[var(--ds-fg-muted)] dark:bg-white/[0.04]'
      )}
    >
      ${amount.toFixed(2)}
    </span>
  )
}

function ReferLanding({ onLogin }: { onLogin: () => void }) {
  const {
    ref: heroSpotlightRef,
    handleMouseMove: handleHeroMouseMove,
    handleMouseLeave: handleHeroMouseLeave,
    spotlightSurfaceStyle: heroSpotlightStyle,
  } = useCursorSpotlight()

  const handleStepCta = (cta: string) => {
    if (cta === 'Open VIP Hub') {
      onLogin()
      openVipReferClaim()
      return
    }
    onLogin()
  }

  return (
    <div className="w-full">
      {/* HERO — same structure as poker lander */}
      <section className="relative w-full px-3 pb-8 pt-4 sm:px-4 md:px-7 md:pb-12 md:pt-8">
        <div
          ref={heroSpotlightRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          style={heroSpotlightStyle}
          className="relative w-full overflow-hidden rounded-2xl bg-[#222] md:rounded-3xl"
        >
          <SpotlightOverlay radiusPx={320} mixPercent={22} />
          <div className="relative z-[2] flex min-h-0 flex-col md:min-h-[470px] md:flex-row md:items-stretch">
            <div className="relative z-10 flex w-full flex-col gap-6 px-4 py-8 text-center sm:px-6 md:w-[min(100%,560px)] md:shrink-0 md:items-start md:gap-6 md:py-14 md:pl-14 md:pr-0 md:text-left">
              <h1 className="w-full text-[1.75rem] font-bold leading-tight text-white sm:text-3xl md:text-[48px] md:leading-[1.15]">
                <span className="block">Refer friends.</span>
                <span className="block">Earn 10% for life.</span>
              </h1>
              <p className="mx-auto max-w-md text-sm leading-6 text-white/60 md:mx-0 md:max-w-none md:text-base">
                Share your link once. Earn commission on every Sports and Casino wager
                your friends place, with no expiry.
              </p>

              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:w-auto md:justify-start">
                <Button
                  type="button"
                  onClick={onLogin}
                  className="h-10 w-full rounded-lg border-0 px-6 text-sm font-medium text-white sm:w-auto"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                >
                  Log in to start referring
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => requestLogin()}
                  className="h-10 w-full rounded-lg border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-white hover:bg-white/[0.08] hover:text-white sm:w-auto"
                >
                  Create account
                </Button>
              </div>

              <Separator className="hidden w-full bg-white/[0.08] md:block" />

              <p className="text-sm text-white/45 md:text-left">
                Lifetime commission · No earnings cap · Sports + Casino
              </p>
            </div>

            {/* Art — animated mark, flush right like poker hero art */}
            <div className="relative flex aspect-[5/4] w-full items-end justify-center overflow-hidden px-4 pb-8 pt-10 md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[min(58%,720px)] md:items-center md:justify-end md:px-0 md:py-14 md:pr-10 lg:pr-16">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                animate={{ opacity: [0.45, 0.75, 0.45] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background:
                    'radial-gradient(ellipse at 70% 48%, rgba(238,53,54,0.32), transparent 58%)',
                }}
              />
              <motion.div
                className="relative z-[1] flex flex-col items-center md:items-end"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="block overflow-visible bg-gradient-to-b from-white via-white to-white/35 bg-clip-text py-[0.12em] text-[5.5rem] font-black leading-none tracking-tighter text-transparent sm:text-[7rem] md:text-[8.5rem] lg:text-[10rem]"
                  animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(238,53,54,0.35))',
                  }}
                >
                  10%
                </motion.span>
                <motion.span
                  className="mt-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/50"
                  animate={{ opacity: [0.45, 0.8, 0.45] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <IconInfinity
                    className="size-5 text-[var(--ds-primary,#ee3536)]"
                    strokeWidth={2}
                  />
                  for life
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — compact overlay cards (same language as Getting Started) */}
      <section className="scroll-mt-20 bg-white/[0.02] py-12">
        <div className="mb-8 px-4 text-center md:px-6">
          <h2 className="mb-2 text-2xl font-bold text-[var(--ds-fg)] md:text-3xl">
            Why Refer-A-Friend
          </h2>
          <p className="mx-auto max-w-lg text-sm text-[var(--ds-fg-subtle)]">
            One invite can keep paying as your friends play, month after month.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 px-4 sm:grid-cols-3 md:gap-4 md:px-6">
          {LANDING_FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="flex flex-col gap-3 rounded-xl bg-[var(--ds-overlay)] px-5 py-5 transition-colors hover:bg-white/[0.06]"
              >
                <div
                  className="flex size-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                >
                  <Icon className="size-5" strokeWidth={1.8} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-[var(--ds-fg)]">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--ds-fg-subtle)]">
                    {feature.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* GETTING STARTED — numbered rows like poker */}
      <section className="scroll-mt-20 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-[var(--ds-fg)] md:text-3xl">
              Getting Started
            </h2>
            <p className="mx-auto max-w-xl text-sm text-[var(--ds-fg-subtle)]">
              Three quick steps from invite to lifetime commission.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {LANDING_GETTING_STARTED.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-col gap-4 rounded-xl bg-[var(--ds-overlay)] px-4 py-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5"
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                >
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-[var(--ds-fg)]">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ds-fg-subtle)]">
                    {step.description}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 shrink-0 rounded-small border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-[var(--ds-fg)] hover:bg-white/[0.08] sm:self-center"
                  onClick={() => handleStepCta(step.cta)}
                >
                  {step.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA — same centered close as poker integrity / download */}
      <section className="scroll-mt-20 bg-white/[0.02] px-4 py-12 md:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-[var(--ds-fg)] md:text-3xl">
            Ready to earn on every invite?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm text-[var(--ds-fg-subtle)]">
            Log in to grab your referral link, track friends, and claim commission from VIP Hub.
          </p>
          <Button
            type="button"
            onClick={onLogin}
            className="h-11 rounded-small px-10 text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
          >
            Log in
          </Button>
        </div>
      </section>
    </div>
  )
}

export function ReferAFriendPage() {
  const [demoLoggedIn, setDemoLoggedIn] = useState(true)
  const claimableAmount = useReferralStore((s) => s.claimableAmount)
  const referrals = useReferralStore((s) => s.referrals)
  const addPendingInvite = useReferralStore((s) => s.addPendingInvite)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const [page, setPage] = useState(0)

  const canClaim = claimableAmount > 0
  const canSendInvite =
    firstName.trim().length > 0 && lastName.trim().length > 0 && email.trim().length > 0
  const joinedCount = useMemo(
    () => referrals.filter((row) => row.status === 'joined').length,
    [referrals]
  )
  const sentCount = referrals.length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [demoLoggedIn])

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(referrals.length / PAGE_SIZE) - 1)
    if (page > maxPage) setPage(maxPage)
  }, [page, referrals.length])

  const pageRows = useMemo(() => {
    const start = page * PAGE_SIZE
    return referrals.slice(start, start + PAGE_SIZE)
  }, [page, referrals])

  const rangeLabel = useMemo(() => {
    if (referrals.length === 0) return '0-0 of 0'
    const start = page * PAGE_SIZE + 1
    const end = Math.min(referrals.length, (page + 1) * PAGE_SIZE)
    return `${start}-${end} of ${referrals.length}`
  }, [page, referrals.length])

  const handleClaim = useCallback(() => {
    if (!demoLoggedIn) {
      requestLogin()
      return
    }
    if (!canClaim) return
    openVipReferClaim()
  }, [canClaim, demoLoggedIn])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK)
      setCopied(true)
      toast.success('Referral link copied')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy link')
    }
  }, [])

  const handleSendEmail = useCallback(() => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('Add a name and email to send')
      return
    }
    const row = addPendingInvite({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    })
    if (!row) {
      toast.error('That email already has a pending invite')
      return
    }
    toast.success(`Invite sent to ${email.trim()}`)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPage(0)
  }, [addPendingInvite, email, firstName, lastName])

  const handleShareX = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      'Join me on BetOnline and play with my referral link:'
    )}&url=${encodeURIComponent(REFERRAL_LINK)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
      {!demoLoggedIn ? (
        <div className="w-full pb-10">
          <div className="flex items-center justify-end px-3 pt-4 sm:px-4 md:px-7">
            <DemoAuthToggle isLoggedIn={demoLoggedIn} onChange={setDemoLoggedIn} />
          </div>
          <ReferLanding
            onLogin={() => {
              setDemoLoggedIn(true)
              requestLogin()
            }}
          />
        </div>
      ) : (
        <div className="w-full px-3 pb-10 pt-6 md:px-6 md:pt-8">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--ds-fg)]">
                Refer-A-Friend
              </h1>
              <p className="max-w-2xl text-sm text-[var(--ds-fg-muted)]">
                Share your unique link and earn rewards when friends join and start playing.
              </p>
            </div>
            <DemoAuthToggle isLoggedIn={demoLoggedIn} onChange={setDemoLoggedIn} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className={cn('flex flex-col gap-3 p-5', cardClass)}>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--ds-fg)]">Your referral link</h2>
                  <p className="text-[13px] text-[var(--ds-fg-muted)]">
                    Copy and share anywhere friends will see it.
                  </p>
                </div>
                <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div
                    className={cn(
                      'flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[10px] px-3',
                      controlSurface
                    )}
                  >
                    <IconLink
                      className="size-[18px] shrink-0 text-[var(--ds-fg-subtle)]"
                      strokeWidth={1.8}
                    />
                    <p className="truncate text-sm text-[var(--ds-fg)]">{REFERRAL_LINK}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopy}
                    className={cn(
                      'h-11 shrink-0 gap-2 rounded-[10px] px-3.5 text-[var(--ds-fg)] hover:text-[var(--ds-fg)]',
                      controlSurface,
                      'hover:bg-black/[0.05] dark:hover:bg-white/[0.05]'
                    )}
                  >
                    <IconCopy className="size-[18px]" strokeWidth={1.8} />
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </section>

              <section className={cn('flex flex-col gap-3 p-5', cardClass)}>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--ds-fg)]">Share on social</h2>
                  <p className="text-[13px] text-[var(--ds-fg-muted)]">
                    Post your link on X in one click.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleShareX}
                  aria-label="Share on X"
                  className={cn(
                    'mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] text-sm font-semibold text-[var(--ds-fg)] transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.05]',
                    controlSurface
                  )}
                >
                  <IconBrandX className="size-5" strokeWidth={1.8} />
                  Share on X
                </button>
              </section>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex min-w-0 flex-col gap-6">
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                  className={cn(
                    'relative flex h-full min-w-0 flex-col gap-3 overflow-hidden p-4',
                    cardClass,
                    canClaim && 'border-[var(--ds-primary,#ee3536)]/30'
                  )}
                >
                  {canClaim ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 animate-[shimmer_2s_infinite]"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(238,53,54,0.14) 45%, transparent 100%)',
                        backgroundSize: '200% 100%',
                      }}
                    />
                  ) : null}
                  <div className="relative z-[1] flex items-center gap-2.5">
                    <IconCurrencyDollar
                      className={cn(
                        'size-[18px]',
                        canClaim
                          ? 'text-[var(--ds-primary,#ee3536)]'
                          : 'text-[var(--ds-fg-subtle)]'
                      )}
                      strokeWidth={1.8}
                      aria-hidden
                    />
                    <p className="text-[13px] font-semibold text-[var(--ds-fg-muted)]">Claim</p>
                  </div>
                  <p className="relative z-[1] text-[28px] font-bold leading-none tracking-tight text-[var(--ds-fg)]">
                    ${claimableAmount.toFixed(2)}
                  </p>
                  <Button
                    type="button"
                    onClick={handleClaim}
                    disabled={!canClaim}
                    className="relative z-[1] mt-auto h-9 w-full rounded-lg border-0 bg-[var(--ds-primary,#ee3536)] text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:bg-black/[0.05] disabled:text-[var(--ds-fg-subtle)] disabled:opacity-100 disabled:hover:brightness-100 dark:disabled:bg-white/[0.06]"
                  >
                    {canClaim ? 'Claim' : 'Claimed'}
                  </Button>
                </div>
                <StatCard icon={IconUsers} label="Joined" value={String(joinedCount)} />
                <StatCard icon={IconShare2} label="Referrals Sent" value={String(sentCount)} />
                <StatCard icon={IconTopologyStar3} label="Lifetime Commission" value="$20,000" />
              </section>

              <section className={cn('min-w-0 overflow-hidden', cardClass)}>
                <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.04]">
                  <h2 className="text-sm font-medium text-[var(--ds-fg)]">Your referrals</h2>
                  <p className="text-[11px] text-[var(--ds-fg-subtle)]">{referrals.length} total</p>
                </div>

                <div className="divide-y divide-black/[0.06] dark:divide-white/[0.04] md:hidden">
                  {pageRows.length === 0 ? (
                    <p className="px-4 py-8 text-center text-xs text-[var(--ds-fg-subtle)]">
                      No referrals yet. Send an invite to get started.
                    </p>
                  ) : (
                    pageRows.map((row) => (
                      <div
                        key={row.id}
                        className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-xs font-medium text-[var(--ds-fg)]">{row.nick}</p>
                            {row.status === 'pending' ? <StatusPill status="pending" /> : null}
                          </div>
                          <p className="mt-0.5 truncate text-[10px] text-[var(--ds-fg-subtle)]">
                            {row.status === 'pending' ? 'Invite sent' : row.registered}
                            {' · '}
                            {row.vipLevel}
                            {' · '}
                            {row.rate}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-[var(--ds-fg-muted)]">
                            Deposits {row.totalDeposits}
                            {' · '}
                            Wagered {row.wagered}
                            {' · '}
                            Claimed {row.claimed}
                          </p>
                        </div>
                        <div className="shrink-0 pt-0.5">
                          <CommissionPill
                            amount={row.commission}
                            pending={row.status === 'pending'}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="hidden md:block">
                  <table className="w-full table-fixed border-collapse text-left">
                    <thead>
                      <tr className={cn('border-b', hairline)}>
                        {(
                          [
                            { label: 'User', w: 'w-[16%]' },
                            { label: 'Registered', w: 'w-[12%]' },
                            { label: 'VIP', w: 'w-[10%]' },
                            { label: 'Deposits', w: 'w-[12%]' },
                            { label: 'Wagered', w: 'w-[12%]' },
                            { label: 'Rate', w: 'w-[8%]' },
                            { label: 'Claimed', w: 'w-[12%]' },
                            { label: 'Commission', w: 'w-[18%]' },
                          ] as const
                        ).map((col) => (
                          <th
                            key={col.label}
                            className={cn(
                              'px-2 py-2 text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]',
                              softFill,
                              col.w
                            )}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((row, index) => (
                        <tr
                          key={row.id}
                          className={cn(
                            'border-b transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]',
                            hairline,
                            index % 2 === 1 ? softFill : 'bg-transparent'
                          )}
                        >
                          <td className="px-2 py-2 text-xs font-medium text-[var(--ds-fg)]">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span className="truncate">{row.nick}</span>
                              {row.status === 'pending' ? <StatusPill status="pending" /> : null}
                            </div>
                          </td>
                          <td className="truncate px-2 py-2 text-[11px] text-[var(--ds-fg-muted)]">
                            {row.status === 'pending' ? 'Invite sent' : row.registered}
                          </td>
                          <td className="truncate px-2 py-2 text-[11px] text-[var(--ds-fg-muted)]">
                            {row.vipLevel}
                          </td>
                          <td className="truncate px-2 py-2 text-[11px] tabular-nums text-[var(--ds-fg-muted)]">
                            {row.totalDeposits}
                          </td>
                          <td className="truncate px-2 py-2 text-[11px] tabular-nums text-[var(--ds-fg-muted)]">
                            {row.wagered}
                          </td>
                          <td className="truncate px-2 py-2 text-[11px] tabular-nums text-[var(--ds-fg-muted)]">
                            {row.rate}
                          </td>
                          <td className="truncate px-2 py-2 text-[11px] tabular-nums text-[var(--ds-fg-muted)]">
                            {row.claimed}
                          </td>
                          <td className="px-2 py-2">
                            <CommissionPill
                              amount={row.commission}
                              pending={row.status === 'pending'}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div
                  className={cn(
                    'flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5 text-[11px] text-[var(--ds-fg-muted)]',
                    hairline
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <span className="inline-flex items-center gap-1 font-medium text-[var(--ds-fg)]">
                      {PAGE_SIZE}
                      <IconChevronDown className="size-4 opacity-60" aria-hidden />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums text-[var(--ds-fg)]">{rangeLabel}</span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="h-8 px-2 text-[var(--ds-fg-muted)] hover:bg-black/[0.04] hover:text-[var(--ds-fg)] dark:hover:bg-white/[0.04]"
                      >
                        Prev
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={(page + 1) * PAGE_SIZE >= referrals.length}
                        onClick={() => setPage((p) => p + 1)}
                        className="h-8 px-2 text-[var(--ds-fg-muted)] hover:bg-black/[0.04] hover:text-[var(--ds-fg)] dark:hover:bg-white/[0.04]"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
              </div>

              <section
                className={cn(
                  'flex h-fit w-full flex-col gap-4 p-5 lg:sticky lg:top-20 lg:self-start',
                  cardClass
                )}
              >
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-[var(--ds-fg)]">Share to Email</h2>
                  <p className="text-[13px] text-[var(--ds-fg-muted)]">
                    Send your referral link to friends via email.
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-[var(--ds-fg-muted)]">First Name</span>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className={controlClass}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-[var(--ds-fg-muted)]">Last Name</span>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className={controlClass}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-[var(--ds-fg-muted)]">Email</span>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className={controlClass}
                    />
                  </label>
                </div>
                <Button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={!canSendInvite}
                  className={cn(
                    'h-11 w-full rounded-lg text-sm font-semibold transition-colors',
                    canSendInvite
                      ? 'border-0 bg-[var(--ds-primary,#ee3536)] text-white hover:brightness-110'
                      : 'border border-black/15 bg-transparent text-[var(--ds-fg-muted)] hover:bg-transparent disabled:opacity-100 dark:border-white/20'
                  )}
                >
                  Send
                </Button>
              </section>
            </div>
          </div>
        </div>
      )}
    </SidebarInset>
  )
}

export default ReferAFriendPage
