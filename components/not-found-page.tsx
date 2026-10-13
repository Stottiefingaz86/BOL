'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Roboto_Mono } from 'next/font/google'
import { motion } from 'framer-motion'
import { IconRefresh } from '@tabler/icons-react'

/** Mono numeral with a slashed zero for the big "404". */
const mono = Roboto_Mono({ subsets: ['latin'], weight: ['700'], display: 'swap' })

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Brand 404. Used for the root `not-found` boundary and the `/404` route.
 * The numeral has a subtle, infrequent glitch (see `nf-glitch-*` keyframes in globals.css).
 */
export function NotFoundPage() {
  return (
    <main
      data-not-found-page=""
      className="relative flex min-h-dvh flex-col bg-[#141414] text-white"
    >
      {/* Single soft stage light from below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh]"
        style={{
          background:
            'radial-gradient(55% 70% at 50% 100%, rgba(238,53,54,0.16), rgba(238,53,54,0.04) 45%, rgba(20,20,20,0) 75%)',
        }}
      />

      {/* Header: lettermark, centred */}
      <header className="relative z-10 flex h-20 items-center justify-center">
        <Link href="/" aria-label="BetOnline home" className="opacity-90 transition-opacity hover:opacity-100">
          <Image src="/logos/BetOnline/lettermark/primary.svg" alt="" width={37} height={28} className="h-7 w-auto" priority />
        </Link>
      </header>

      {/* Body */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className={`nf-glitch relative select-none font-bold leading-none tracking-[-0.03em] ${mono.className}`}
          style={{ fontSize: 'clamp(72px, 9vw, 104px)' }}
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

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="mt-7 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40"
        >
          Casino
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease }}
          className="mt-2.5 text-[26px] font-semibold tracking-tight"
        >
          This table isn&apos;t here
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          className="mt-2.5 max-w-[360px] text-[15px] leading-relaxed text-white/50"
        >
          That game or page may have moved. Browse the lobby for something else to spin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26, ease }}
          className="mt-7 flex items-center gap-3"
        >
          <Link
            href="/casino"
            className="inline-flex h-11 items-center rounded-lg bg-[#ee3536] px-5 text-sm font-semibold text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
          >
            Open casino
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            aria-label="Try again"
            title="Try again"
            className="group inline-flex size-11 items-center justify-center rounded-lg border border-white/[0.12] text-white/70 transition-colors hover:border-white/25 hover:text-white"
          >
            <IconRefresh className="size-[18px] transition-transform duration-500 group-hover:rotate-180" stroke={2} />
          </button>
        </motion.div>
      </section>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10 flex h-20 items-center justify-center"
      >
        <a
          href="https://www.betonline.ag/help-center"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-white/40 transition-colors hover:text-white"
        >
          Need help? Contact support
        </a>
      </motion.footer>

    </main>
  )
}
