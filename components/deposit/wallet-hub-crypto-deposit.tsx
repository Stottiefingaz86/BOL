'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconCurrencyDollar,
  IconSearch,
} from '@tabler/icons-react'

import {
  CRYPTO_COINS,
  CryptoCoinIcon,
  WalletHubCategoryPills,
  type CryptoCoinId,
  type CryptoCoinOption,
  type DepositCategory,
} from '@/components/deposit/wallet-hub-home'
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
}: {
  coin: CryptoCoinOption
  category: DepositCategory
  onCategoryChange: (c: DepositCategory) => void
  onSelectCoin: (coin: CryptoCoinOption) => void
  currencySymbol?: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)
  const [fiatStr, setFiatStr] = useState('')
  const [cryptoStr, setCryptoStr] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  const rate = USD_RATES[coin.id] ?? 1
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
    setFiatStr('')
    setCryptoStr('')
    setMenuOpen(false)
    setSearch('')
  }, [coin.id])

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=252x252&data=${encodeURIComponent(DEMO_DEPOSIT_ADDRESS)}`

  return (
    <div className="flex min-h-full w-full flex-col gap-6 pt-5 pb-1">
      <WalletHubCategoryPills active={category} onChange={onCategoryChange} />

      <div ref={rootRef} className="relative w-full">
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

        <div className="flex items-center gap-2 pt-1">
          <div className="relative min-w-0 flex-1">
            <div className="pointer-events-none absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/40">
              <IconCurrencyDollar className="size-3.5 text-emerald-400" stroke={2.5} />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={fiatStr}
              onChange={(e) => {
                const s = e.target.value
                setFiatStr(s)
                const n = parseDecimalInput(s)
                if (n === null) return
                setCryptoStr(formatCrypto(n / rate))
              }}
              placeholder="0.00"
              aria-label={`Amount in ${currencySymbol}`}
              className="h-10 w-full rounded-lg border-0 bg-[var(--ds-control-bg)] pl-10 pr-2.5 text-sm font-medium tabular-nums text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)] outline-none ring-1 ring-white/[0.06] focus:ring-white/20"
            />
          </div>
          <span className="shrink-0 text-sm font-medium text-[var(--ds-fg-subtle)]" aria-hidden>
            =
          </span>
          <div className="relative min-w-0 flex-1">
            <div className="pointer-events-none absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full">
              <CryptoCoinIcon id={coin.id} size={28} />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={cryptoStr}
              onChange={(e) => {
                const s = e.target.value
                setCryptoStr(s)
                const n = parseDecimalInput(s)
                if (n === null) return
                setFiatStr(formatFiat(n * rate))
              }}
              placeholder="0.00"
              aria-label={`Amount in ${coin.ticker}`}
              className="h-10 w-full rounded-lg border-0 bg-[var(--ds-control-bg)] pl-10 pr-2.5 text-sm font-medium tabular-nums text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)] outline-none ring-1 ring-white/[0.06] focus:ring-white/20"
            />
          </div>
        </div>
      </div>

      <a
        href="https://www.betonline.ag/crypto-tutorial"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--ds-overlay)] px-4 transition-colors hover:bg-white/[0.07]"
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
