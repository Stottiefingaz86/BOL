'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

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
            'radial-gradient(60% 80% at 50% 100%, rgba(238,53,54,0.22), rgba(238,53,54,0.06) 45%, rgba(20,20,20,0) 75%)',
        }}
      />

      {/* Header: lettermark only */}
      <header className="relative z-10 flex h-16 items-center px-6 sm:px-10">
        <Link href="/" aria-label="BetOnline home" className="opacity-90 transition-opacity hover:opacity-100">
          <Image src="/logos/BetOnline/lettermark/white.svg" alt="" width={24} height={24} className="h-6 w-auto" priority />
        </Link>
      </header>

      {/* Body */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="nf-glitch relative select-none font-semibold leading-[0.9] tracking-[-0.06em]"
          style={{ fontSize: 'clamp(120px, 22vw, 220px)' }}
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

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease }}
          className="mt-8 text-2xl font-semibold tracking-tight sm:text-[28px]"
        >
          Page not found
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          className="mt-2 max-w-[380px] text-[15px] leading-relaxed text-white/50"
        >
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26, ease }}
          className="mt-8 flex items-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg bg-[#ee3536] px-5 text-sm font-semibold text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
          >
            Back to home
          </Link>
          <Link
            href="/casino"
            className="inline-flex h-11 items-center rounded-lg border border-white/[0.12] px-5 text-sm font-semibold text-white/85 transition-colors hover:border-white/25 hover:text-white"
          >
            Casino lobby
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10 flex h-16 items-center justify-between px-6 text-xs text-white/35 sm:px-10"
      >
        <span>Error 404</span>
        <a
          href="https://www.betonline.ag/help-center"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-white"
        >
          Contact support
        </a>
      </motion.footer>
    </main>
  )
}
