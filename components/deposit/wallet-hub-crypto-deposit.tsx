'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconExternalLink,
  IconSearch,
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'

import {
  CRYPTO_COINS,
  CryptoCoinIcon,
  WalletHubCategoryPills,
  WalletHubWelcomeOffer,
  type CryptoCoinId,
  type CryptoCoinOption,
  type DepositCategory,
} from '@/components/deposit/wallet-hub-home'
import { fireConfetti } from '@/lib/confetti'
import {
  REQUIRED_CONFIRMATIONS,
  useDepositTrackerStore,
  type TrackedDeposit,
} from '@/lib/store/depositTrackerStore'
import { cn } from '@/lib/utils'

const DEMO_DEPOSIT_ADDRESS =
  '0x3c690f9497afbe256a4fa94e0f863d191e1531497afbe256aa94e0fDFG690'

const USD_RATES: Partial<Record<CryptoCoinId, number>> = {
  btc: 67_496.35,
  eth: 3_420.12,
  ltc: 92.4,
  usdc: 1,
  usdt: 1,
  xrp: 0.62,
  avax: 38.5,
  ada: 0.48,
  xlm: 0.12,
  doge: 0.16,
  matic: 0.55,
  bch: 420,
  shib: 0.000018,
  sol: 148.2,
  bnb: 580,
  trx: 0.14,
  trump: 12.5,
  scor: 0.08,
}

function parseDecimalInput(s: string): number | null {
  const t = s.replace(/,/g, '').trim()
  if (t === '' || t === '.' || t === '-') return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

function formatFiat(n: number): string {
  if (!Number.isFinite(n)) return ''
  return n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
}

function shortHash(h: string) {
  return `${h.slice(0, 10)}…${h.slice(-8)}`
}

/**
 * Blockchain "polling" view shown after the player says they've sent funds.
 * State lives in `useDepositTrackerStore` so it survives closing the wallet.
 */
function CryptoDepositTracker({
  coin,
  tracked,
  currencySymbol,
  onDone,
}: {
  coin: CryptoCoinOption
  tracked: TrackedDeposit
  currencySymbol: string
  onDone: () => void
}) {
  const { stage, confirmations, txHash, amountUsd, startedAt } = tracked
  const [now, setNow] = useState(() => Date.now())
  const celebratedRef = useRef(false)
  const rate = USD_RATES[coin.id] ?? 1

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (stage !== 'confirmed' || celebratedRef.current) return
    celebratedRef.current = true
    fireConfetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 35,
      origin: { x: 0.82, y: 0.45 },
      colors: ['#ee3536', '#ffffff', '#34d399'],
      ticks: 200,
    })
  }, [stage])

  const elapsed = Math.max(0, Math.floor(((tracked.confirmedAt ?? now) - startedAt) / 1000))
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  const title =
    stage === 'waiting'
      ? 'Waiting for your transaction'
      : stage === 'detected'
        ? 'Transaction detected'
        : stage === 'confirming'
          ? 'Confirming on the blockchain'
          : 'Deposit confirmed'
  const subtitle =
    stage === 'waiting'
      ? `Scanning the ${coin.ticker} network for a transfer to your deposit address…`
      : stage === 'detected'
        ? 'We found your transfer. Waiting for the network to confirm it.'
        : stage === 'confirming'
          ? `${confirmations} of ${REQUIRED_CONFIRMATIONS} confirmations — usually a few minutes.`
          : `${currencySymbol}${formatFiat(amountUsd)} has been added to your balance.`

  const done = stage === 'confirmed'

  return (
    <div data-crypto-tracker="" className="flex min-h-full w-full flex-col gap-5 pt-5 pb-1">
      {/* status hero */}
      <div className="flex flex-col items-center pt-4 text-center">
        <div className="relative flex size-20 items-center justify-center">
          {!done ? (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-[#ee3536]/20 [animation-duration:1.8s]" />
              <span className="absolute inset-1.5 animate-pulse rounded-full bg-[#ee3536]/15" />
              <span className="absolute inset-0 rounded-full border-2 border-dashed border-white/15 [animation:spin_14s_linear_infinite]" />
            </>
          ) : (
            <span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md" />
          )}
          <span
            className={cn(
              'relative flex size-14 items-center justify-center overflow-hidden rounded-full ring-2',
              done ? 'bg-emerald-500 ring-emerald-400/60' : 'bg-[var(--ds-overlay)] ring-white/10',
            )}
          >
            {done ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 16 }}>
                <IconCheck className="size-7 text-white" stroke={3} />
              </motion.span>
            ) : (
              <CryptoCoinIcon id={coin.id} size={40} />
            )}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <p className="text-lg font-bold text-[var(--ds-fg)]">{title}</p>
            <p className="mx-auto mt-1 max-w-[280px] text-xs leading-relaxed text-[var(--ds-fg-muted)]">{subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* confirmations */}
      <div className="rounded-xl border border-white/[0.08] bg-[var(--ds-overlay)] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ds-fg-subtle)]">Confirmations</span>
          <span className="text-xs font-semibold tabular-nums text-[var(--ds-fg)]">
            {confirmations}/{REQUIRED_CONFIRMATIONS}
          </span>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {Array.from({ length: REQUIRED_CONFIRMATIONS }).map((_, i) => {
            const filled = i < confirmations
            const active = !done && i === confirmations && stage === 'confirming'
            return (
              <span key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                <motion.span
                  className={cn('absolute inset-y-0 left-0 rounded-full', done ? 'bg-emerald-400' : 'bg-[#ee3536]')}
                  initial={false}
                  animate={{ width: filled ? '100%' : active ? ['0%', '85%'] : '0%' }}
                  transition={filled ? { duration: 0.35 } : { duration: 1.8, ease: 'easeInOut' }}
                />
              </span>
            )
          })}
        </div>
      </div>

      {/* details */}
      <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[var(--ds-overlay)]">
        <Row label="Amount">
          {stage === 'waiting' ? (
            <span className="inline-block h-3.5 w-20 animate-pulse rounded bg-white/10" />
          ) : (
            <span className="tabular-nums">
              {formatCrypto(amountUsd / rate)} {coin.ticker}
              <span className="ml-1.5 text-[var(--ds-fg-subtle)]">≈ {currencySymbol}{formatFiat(amountUsd)}</span>
            </span>
          )}
        </Row>
        <Row label="Network">BEP20</Row>
        <Row label="Transaction">
          {stage === 'waiting' ? (
            <span className="inline-block h-3.5 w-28 animate-pulse rounded bg-white/10" />
          ) : (
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-[#6ea8ff] hover:underline"
            >
              {shortHash(txHash)}
              <IconExternalLink className="size-3" />
            </a>
          )}
        </Row>
        <Row label="Elapsed">
          <span className="tabular-nums">{mm}:{ss}</span>
        </Row>
      </div>

      {!done ? (
        <p className="text-center text-[11px] leading-relaxed text-[var(--ds-fg-subtle)]">
          You can close this panel — we&apos;ll keep tracking under your balance and credit you the moment the
          network confirms.
        </p>
      ) : null}

      <button
        type="button"
        onClick={onDone}
        className={cn(
          'mt-auto flex h-11 w-full shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
          done
            ? 'bg-[#ee3536] text-white hover:bg-[#ff4647]'
            : 'bg-[var(--ds-overlay)] text-[var(--ds-fg-muted)] hover:bg-white/[0.07] hover:text-[var(--ds-fg)]',
        )}
      >
        {done ? 'Close' : 'Close and keep tracking'}
      </button>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
      <span className="text-xs text-[var(--ds-fg-muted)]">{label}</span>
      <span className="min-w-0 text-right text-xs font-medium text-[var(--ds-fg)]">{children}</span>
    </div>
  )
}

function formatCrypto(n: number): string {
  if (!Number.isFinite(n)) return ''
  const s = n.toFixed(8)
  return s.replace(/\.?0+$/, '') || '0'
}

export function WalletHubCryptoDeposit({
  coin,
  category,
  onCategoryChange,
  onSelectCoin,
  currencySymbol = '$',
  onDone,
}: {
  coin: CryptoCoinOption
  category: DepositCategory
  onCategoryChange: (c: DepositCategory) => void
  onSelectCoin: (coin: CryptoCoinOption) => void
  currencySymbol?: string
  /** "Start playing" (confirmed) or "Close and keep tracking" from the tracker. */
  onDone?: (confirmed: boolean) => void
}) {
  const tracked = useDepositTrackerStore((s) => s.active)
  const startTracking = useDepositTrackerStore((s) => s.start)
  const dismissTracking = useDepositTrackerStore((s) => s.dismiss)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const label = `${coin.name} (${coin.ticker})`

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return CRYPTO_COINS
    return CRYPTO_COINS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q),
    )
  }, [search])

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
    setSearch('')
  }, [coin.id])

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=252x252&data=${encodeURIComponent(DEMO_DEPOSIT_ADDRESS)}`

  if (tracked && tracked.coinId === coin.id) {
    const confirmed = tracked.stage === 'confirmed'
    return (
      <CryptoDepositTracker
        coin={coin}
        tracked={tracked}
        currencySymbol={currencySymbol}
        onDone={() => {
          if (confirmed) dismissTracking()
          onDone?.(confirmed)
        }}
      />
    )
  }

  return (
    <div className="flex min-h-full w-full flex-col gap-6 pt-5 pb-1">
      <WalletHubCategoryPills active={category} onChange={onCategoryChange} />
      <WalletHubWelcomeOffer />

      <div ref={rootRef} className="relative w-full shrink-0">
        <fieldset className="rounded-lg border border-white/[0.08] px-3 pb-2.5 pt-1">
          <legend className="px-1 text-[11px] font-medium text-[var(--ds-fg-muted)]">
            Select Crypto
          </legend>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex w-full items-center gap-2 py-1 text-left"
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
          >
            <CryptoCoinIcon id={coin.id} size={22} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--ds-fg)]">
              {label}
            </span>
            <IconChevronDown
              className={cn(
                'size-4 shrink-0 text-[var(--ds-fg-subtle)] transition-transform',
                menuOpen && 'rotate-180',
              )}
              stroke={2}
            />
          </button>
        </fieldset>

        {menuOpen ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-[var(--ds-border-strong)] bg-[var(--ds-surface-raised)] shadow-xl">
            <div className="border-b border-[var(--ds-border)] p-2">
              <div className="relative">
                <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[var(--ds-fg-subtle)]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="h-9 w-full rounded-md border-0 bg-[var(--ds-control-bg)] pl-9 pr-3 text-sm text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)] outline-none ring-1 ring-white/10 focus:ring-white/25"
                  autoFocus
                />
              </div>
            </div>
            <ul
              role="listbox"
              className="max-h-56 overflow-y-auto py-1"
              aria-label="Cryptocurrencies"
            >
              {filtered.map((c) => {
                const selected = c.id === coin.id
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onSelectCoin(c)
                        setMenuOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors',
                        selected ? 'bg-[var(--ds-control-hover)]' : 'hover:bg-[var(--ds-control-bg)]',
                      )}
                    >
                      <CryptoCoinIcon id={c.id} size={28} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-[var(--ds-fg)]">
                          {c.name} ({c.ticker})
                        </span>
                        <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                          Min: $10 Fee: 0%
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-center text-xs text-[var(--ds-fg-subtle)]">
                  No coins found
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex justify-center pt-1">
          <div className="relative flex size-[140px] items-center justify-center overflow-hidden rounded-lg bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt={`Deposit QR for ${label}`}
              width={126}
              height={126}
              className="size-[126px]"
            />
            <div className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm ring-2 ring-white">
              <CryptoCoinIcon id={coin.id} size={28} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(DEMO_DEPOSIT_ADDRESS)
              setCopied(true)
              window.setTimeout(() => setCopied(false), 2000)
            } catch {
              /* ignore */
            }
          }}
          className="w-full rounded-lg bg-[var(--ds-control-bg)] px-3 py-3.5 text-left transition-colors hover:bg-white/[0.09] active:bg-white/[0.11]"
          aria-label={copied ? 'Address copied' : 'Copy deposit address'}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ds-fg-subtle)]">
            Deposit Address
          </p>
          <div className="mt-2 flex items-start gap-2">
            <p className="min-w-0 flex-1 break-all font-mono text-sm leading-relaxed text-[var(--ds-fg)]">
              {DEMO_DEPOSIT_ADDRESS}
            </p>
            <span
              className="flex size-9 shrink-0 items-center justify-center text-[var(--ds-fg-muted)]"
              aria-hidden
            >
              {copied ? (
                <IconCheck className="size-5 text-emerald-400" stroke={2} />
              ) : (
                <IconCopy className="size-5" stroke={1.75} />
              )}
            </span>
          </div>
        </button>

        <div className="flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-[var(--ds-border-strong)] bg-[var(--ds-control-hover)] px-1.5 py-0.5 pr-2">
            <IconAlertCircle className="size-3 text-[var(--ds-fg-muted)]" stroke={2} />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/85">
              Important
            </span>
          </span>
          <p className="text-[11px] leading-snug text-[var(--ds-fg)]">
            Send only{' '}
            <span className="font-semibold">{label}</span>
            {' '}on{' '}
            <span className="font-semibold">BEP20</span>
            . Min deposit{' '}
            <span className="font-semibold">$10 USD</span>.
          </p>
        </div>

      </div>

      <button
        type="button"
        data-crypto-sent-cta=""
        onClick={() => startTracking({ id: coin.id, name: coin.name, ticker: coin.ticker })}
        className="mt-auto flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#ee3536] text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(238,53,54,0.6)] transition-colors hover:bg-[#ff4647]"
      >
        <IconCheck className="size-4" stroke={2.5} />
        I&apos;ve sent the {coin.ticker}
      </button>

      <a
        href="https://www.betonline.ag/crypto-tutorial"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--ds-overlay)] px-4 transition-colors hover:bg-white/[0.07]"
      >
        <CryptoCoinIcon id={coin.id} size={18} />
        <span className="text-xs text-[var(--ds-fg-muted)]">
          New to {label}?{' '}
          <span className="text-[#6ea8ff]">Get Started Here</span>
        </span>
      </a>
    </div>
  )
}
