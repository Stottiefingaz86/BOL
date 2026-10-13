'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  IconArrowLeft,
  IconBallFootball,
  IconCards,
  IconCrown,
  IconGift,
  IconHeadset,
  IconHome,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

const QUICK_LINKS = [
  { href: '/casino', label: 'Casino', Icon: IconCards },
  { href: '/sports', label: 'Sports', Icon: IconBallFootball },
  { href: '/promotions', label: 'Promotions', Icon: IconGift },
  { href: '/vip-rewards', label: 'VIP', Icon: IconCrown },
]

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Brand 404. Used for the root `not-found` boundary and the `/404` route.
 * The "404" has a subtle, infrequent glitch (see `nf-glitch-*` keyframes in globals.css).
 */
export function NotFoundPage() {
  return (
    <main
      data-not-found-page=""
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#141414] px-6 py-16 text-white"
    >
      {/* Backdrop: brand red bloom + fine grid + vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[42%] size-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
          style={{
            background:
              'radial-gradient(closest-side, rgba(238,53,54,0.28), rgba(238,53,54,0.10) 45%, rgba(20,20,20,0) 72%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(20,20,20,0.75) 100%)',
          }}
        />
      </div>

      {/* Lettermark */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="absolute left-1/2 top-8 -translate-x-1/2"
      >
        <Link href="/" aria-label="BetOnline home" className="block opacity-80 transition-opacity hover:opacity-100">
          <Image src="/logos/BetOnline/lettermark/white.svg" alt="" width={28} height={28} className="h-7 w-auto" priority />
        </Link>
      </motion.div>

      <div className="relative flex w-full max-w-[560px] flex-col items-center text-center">
        {/* Rings + 404 */}
        <div className="relative mb-10 flex size-[300px] items-center justify-center sm:size-[340px]">
          <span
            aria-hidden
            className="nf-ring-slow absolute inset-0 rounded-full border border-dashed border-white/[0.10]"
          />
          <span
            aria-hidden
            className="nf-ring-fast absolute inset-[26px] rounded-full border border-dashed border-[#ee3536]/40"
          />
          <span
            aria-hidden
            className="absolute inset-[54px] rounded-full border border-white/[0.05] bg-white/[0.015] shadow-[inset_0_0_60px_rgba(238,53,54,0.12)]"
          />
          {/* Orbiting chip */}
          <span aria-hidden className="nf-ring-slow absolute inset-0">
            <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ee3536] shadow-[0_0_14px_rgba(238,53,54,0.9)]" />
          </span>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease }}
            className="nf-glitch relative select-none font-black leading-none tracking-[-0.04em]"
            style={{ fontSize: 'clamp(96px, 18vw, 136px)' }}
            aria-label="404"
          >
            <span aria-hidden className="nf-glitch-layer nf-glitch-layer--a">
              404
            </span>
            <span aria-hidden className="nf-glitch-layer nf-glitch-layer--b">
              404
            </span>
            <span className="nf-glitch-base relative">404</span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff8a8a]"
        >
          Page not found
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease }}
          className="mt-3 text-[30px] font-bold leading-tight sm:text-[36px]"
        >
          This table isn&apos;t here
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease }}
          className="mt-3 max-w-[400px] text-[15px] leading-relaxed text-white/55"
        >
          The page you&apos;re looking for has moved, expired or never existed. Your balance and
          bets are safe. Pick a game and get back to the action.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/casino"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#ee3536] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(238,53,54,0.8)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
          >
            <IconCards className="size-4" stroke={2} />
            Open casino
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.10] bg-white/[0.04] px-5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
          >
            <IconHome className="size-4" stroke={2} />
            Go home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <IconArrowLeft className="size-4" stroke={2} />
            Back
          </button>
        </motion.div>

        {/* Quick links */}
        <motion.nav
          aria-label="Popular sections"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease }}
          className="mt-10 flex w-full flex-col items-center gap-3"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Or jump to
          </span>
          <ul className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
            {QUICK_LINKS.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'group flex h-14 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm font-medium text-white/75 transition-colors',
                    'hover:border-[#ee3536]/40 hover:bg-[#ee3536]/10 hover:text-white'
                  )}
                >
                  <Icon className="size-4 text-white/45 transition-colors group-hover:text-[#ff7a7a]" stroke={1.75} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.a
          href="https://www.betonline.ag/help-center"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.48 }}
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white"
        >
          <IconHeadset className="size-3.5" stroke={1.75} />
          Need help? Contact support
        </motion.a>
      </div>
    </main>
  )
}
