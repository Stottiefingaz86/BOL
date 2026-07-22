'use client'

import Image from 'next/image'
import {
  IconArrowUp,
  IconHistory,
  IconSettings,
} from '@tabler/icons-react'

import { cn } from '@/lib/utils'

export type WalletHubActionTab =
  | 'deposit'
  | 'withdrawal'
  | 'history'
  | 'settings'

export type DepositCategory = 'crypto' | 'card' | 'others'

export type CryptoCoinId =
  | 'btc'
  | 'eth'
  | 'ltc'
  | 'usdc'
  | 'usdt'
  | 'xrp'
  | 'avax'
  | 'ada'
  | 'xlm'
  | 'doge'
  | 'matic'
  | 'bch'
  | 'shib'
  | 'sol'
  | 'bnb'
  | 'trx'
  | 'trump'
  | 'scor'

export type CryptoCoinOption = {
  id: CryptoCoinId
  name: string
  ticker: string
  methodId: string
}

export const CRYPTO_COINS: CryptoCoinOption[] = [
  { id: 'btc', name: 'Bitcoin', ticker: 'BTC', methodId: 'bitcoin' },
  { id: 'eth', name: 'Ethereum', ticker: 'ETH', methodId: 'eth' },
  { id: 'ltc', name: 'Litecoin', ticker: 'LTC', methodId: 'ltc' },
  { id: 'usdc', name: 'USD Coin', ticker: 'USDC', methodId: 'usdc' },
  { id: 'usdt', name: 'Tether', ticker: 'USDT', methodId: 'usdt' },
  { id: 'xrp', name: 'Ripple', ticker: 'XRP', methodId: 'xrp' },
  { id: 'avax', name: 'Avalanche', ticker: 'AVAX', methodId: 'avax' },
  { id: 'ada', name: 'Cardano', ticker: 'ADA', methodId: 'ada' },
  { id: 'xlm', name: 'Stellar', ticker: 'XLM', methodId: 'xlm' },
  { id: 'doge', name: 'Dogecoin', ticker: 'DOGE', methodId: 'doge' },
  { id: 'matic', name: 'Polygon', ticker: 'MATIC', methodId: 'matic' },
  { id: 'bch', name: 'Bitcoin Cash', ticker: 'BCH', methodId: 'bch' },
  { id: 'shib', name: 'Shiba', ticker: 'SHIB', methodId: 'shib' },
  { id: 'sol', name: 'Solana', ticker: 'SOL', methodId: 'sol' },
  { id: 'bnb', name: 'Binance Coin', ticker: 'BNB', methodId: 'bnb' },
  { id: 'trx', name: 'Tron', ticker: 'TRX', methodId: 'trx' },
  { id: 'trump', name: 'Trump Coin', ticker: 'TRUMP', methodId: 'trump' },
  { id: 'scor', name: 'Scor', ticker: 'SCOR', methodId: 'scor' },
]

const COIN_SRC: Record<CryptoCoinId, string> = {
  btc: '/icons/crypto/btc.svg',
  eth: '/icons/crypto/eth.svg',
  ltc: '/icons/crypto/ltc.svg',
  usdc: '/icons/crypto/usdc-full.png',
  usdt: '/icons/crypto/usdt.svg',
  xrp: '/icons/crypto/xrp.svg',
  avax: '/icons/crypto/avax.svg',
  ada: '/icons/crypto/ada.svg',
  xlm: '/icons/crypto/xlm.svg',
  doge: '/icons/crypto/doge.svg',
  matic: '/icons/crypto/matic.svg',
  bch: '/icons/crypto/bch.svg',
  shib: '/icons/crypto/shib.png',
  sol: '/icons/crypto/sol-full.png',
  bnb: '/icons/crypto/bnb.svg',
  trx: '/icons/crypto/trx.svg',
  trump: '/icons/crypto/trump-full.png',
  scor: '/icons/crypto/scor-full.png',
}

export function CryptoCoinIcon({
  id,
  className,
  size = 28,
}: {
  id: CryptoCoinId
  className?: string
  size?: number
}) {
  return (
    <span
      className={cn('relative inline-block shrink-0 overflow-hidden rounded-full', className)}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COIN_SRC[id]}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0 size-full object-cover"
      />
    </span>
  )
}

export function CryptoTutorialIcon({
  className,
  size = 18,
}: {
  className?: string
  size?: number
}) {
  return (
    <span
      className={cn('relative inline-block shrink-0 overflow-hidden rounded-full', className)}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/crypto/tutorial-full.png"
        alt=""
        width={size}
        height={size}
        className="absolute inset-0 size-full object-cover"
      />
    </span>
  )
}

const CATEGORIES: { id: DepositCategory; label: string }[] = [
  { id: 'crypto', label: 'Crypto' },
  { id: 'card', label: 'Credit Card' },
  { id: 'others', label: 'Others' },
]

export function WalletHubActionTabs({
  active,
  onChange,
}: {
  active: WalletHubActionTab
  onChange: (tab: WalletHubActionTab) => void
}) {
  /** Match header-user-controls: 36px height, radius 8, border white/6 */
  const controlH = 'h-9 min-h-9 max-h-9 box-border'
  const inactiveSurface =
    'border border-white/[0.06] bg-white/[0.05] text-white/80 hover:brightness-110'

  const primaryBtn = (tab: 'deposit' | 'withdrawal') =>
    cn(
      'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold capitalize transition-colors',
      controlH,
      active === tab
        ? 'border border-[var(--ds-primary,#ee3536)] bg-[var(--ds-primary,#ee3536)] text-white'
        : inactiveSurface,
    )

  const iconBtn = (tab: 'history' | 'settings') =>
    cn(
      'relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors',
      controlH,
      active === tab
        ? 'border border-[var(--ds-primary,#ee3536)] bg-[var(--ds-primary,#ee3536)] text-white'
        : inactiveSurface,
    )

  return (
    <div className="flex w-full items-center gap-3">
      <button
        type="button"
        onClick={() => onChange('deposit')}
        className={primaryBtn('deposit')}
      >
        <span className="relative flex size-4 items-center justify-center">
          <Image
            src="/icons/header/wallet.svg"
            alt=""
            width={16}
            height={16}
            className="size-4"
            unoptimized
          />
        </span>
        Deposit
      </button>
      <button
        type="button"
        onClick={() => onChange('withdrawal')}
        className={primaryBtn('withdrawal')}
      >
        <IconArrowUp className="size-4" stroke={2} />
        Withdraw
      </button>
      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange('history')}
          className={iconBtn('history')}
          aria-label="History"
        >
          <IconHistory className="size-4" stroke={1.75} />
        </button>
        <button
          type="button"
          onClick={() => onChange('settings')}
          className={iconBtn('settings')}
          aria-label="Settings"
        >
          <IconSettings className="size-4" stroke={1.75} />
        </button>
      </div>
    </div>
  )
}


export function WalletHubCategoryPills({
  active,
  onChange,
}: {
  active: DepositCategory
  onChange: (category: DepositCategory) => void
}) {
  return (
    <div className="flex w-full items-center justify-start">
      <div className="inline-flex items-center gap-1 rounded-3xl bg-white/5 p-0.5">
        {CATEGORIES.map((c) => {
          const isActive = active === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              data-active={isActive}
              className={cn(
                'relative flex h-9 shrink-0 items-center justify-center rounded-2xl px-4 text-xs font-medium transition-colors duration-300',
                isActive
                  ? 'text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )}
            >
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute inset-0 -z-0 rounded-2xl"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                />
              ) : null}
              <span className="relative z-10 whitespace-nowrap">{c.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function WalletHubCryptoGrid({
  selectedId,
  onSelect,
}: {
  selectedId?: CryptoCoinId
  onSelect: (coin: CryptoCoinOption) => void
}) {
  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {CRYPTO_COINS.map((coin) => {
        const selected = selectedId === coin.id
        return (
          <button
            key={coin.id}
            type="button"
            onClick={() => onSelect(coin)}
            className={cn(
              'flex h-[100px] flex-col items-center justify-center gap-1 rounded-lg bg-white/[0.04] p-2 text-center transition-colors',
              'hover:bg-white/[0.07]',
              selected &&
                'bg-white/[0.08] ring-1 ring-[var(--ds-primary,#ee3536)]',
            )}
          >
            <CryptoCoinIcon id={coin.id} size={28} />
            <span className="flex w-full flex-col items-center leading-[1.47]">
              <span className="w-full text-xs font-semibold text-white">{coin.name}</span>
              <span className="w-full text-xs font-normal text-white/65">({coin.ticker})</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function WalletHubCryptoTutorialLink() {
  return (
    <a
      href="https://www.betonline.ag/crypto-tutorial"
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 w-full items-center justify-center rounded-lg bg-white/[0.04] px-4 transition-colors hover:bg-white/[0.07]"
    >
      <span className="flex items-center justify-center gap-2">
        <CryptoTutorialIcon size={18} />
        <span className="text-xs text-white/80">
          New to Crypto? <span className="text-[#6ea8ff]">Get Started Here</span>
        </span>
      </span>
    </a>
  )
}

/** Figma crypto deposit home layout, styled like account hub (dark) */
export function WalletHubDepositHome({
  category,
  onCategoryChange,
  selectedCoinId,
  onSelectCoin,
  otherMethods,
  selectedOtherId,
  onSelectOther,
  onSelectCard,
}: {
  category: DepositCategory
  onCategoryChange: (c: DepositCategory) => void
  selectedCoinId?: CryptoCoinId
  onSelectCoin: (coin: CryptoCoinOption) => void
  otherMethods: { id: string; label: string; feeLabel: string }[]
  selectedOtherId?: string
  onSelectOther: (id: string) => void
  onSelectCard: () => void
}) {
  return (
    <div className="flex w-full flex-col gap-6 pt-5">
      <WalletHubCategoryPills active={category} onChange={onCategoryChange} />

      <div className="flex w-full flex-col items-center gap-3">
        {category === 'crypto' ? (
          <>
            <WalletHubCryptoGrid selectedId={selectedCoinId} onSelect={onSelectCoin} />
            <WalletHubCryptoTutorialLink />
          </>
        ) : null}

        {category === 'card' ? (
          <button
            type="button"
            onClick={onSelectCard}
            className="flex h-[100px] w-full flex-col items-center justify-center gap-2 rounded-lg bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.07]"
          >
            <span className="text-xs font-semibold text-white">Credit / Debit Card</span>
            <span className="text-[10px] text-white/50">Min $25 · Fee 9.75%</span>
          </button>
        ) : null}

        {category === 'others' ? (
          <div className="grid w-full grid-cols-2 gap-2">
            {otherMethods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectOther(m.id)}
                className={cn(
                  'flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-lg bg-white/[0.04] p-3 text-center transition-colors hover:bg-white/[0.07]',
                  selectedOtherId === m.id &&
                    'bg-white/[0.08] ring-1 ring-[var(--ds-primary,#ee3536)]',
                )}
              >
                <span className="text-xs font-semibold text-white">{m.label}</span>
                <span className="text-[10px] text-white/50">Fee {m.feeLabel}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
