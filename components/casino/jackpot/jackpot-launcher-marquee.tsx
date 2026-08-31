'use client'

import { useEffect, useState } from 'react'
import {
  JACKPOT_TICKER_TIERS,
  formatJackpotCompact,
  type JackpotTickerTierConfig,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { useMegaTickerDisplayAmount } from '@/components/casino/jackpot/use-mega-ticker-display-amount'
import { cn } from '@/lib/utils'
import { IconHourglass, IconUser } from '@tabler/icons-react'

const MUST_TIME_ACCENT = '#7dd3fc'
const MUST_VALUE_ACCENT = '#fcd34d'

const TIER_LOOP_COPIES = 4

function useCountdown(deadline: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()))

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

type Chip =
  | { key: string; kind: 'balance'; amount: number }
  | { key: string; kind: 'must'; amount: number; detail: string; accent: string }
  | { key: string; kind: 'tier'; label: string; accent: string; amount: number }

function ChipView({ chip }: { chip: Chip }) {
  if (chip.kind === 'balance') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <IconUser className="h-3 w-3 text-white/70" strokeWidth={1.75} />
        <span className="text-[10px] font-medium text-white/80">Personal Pot</span>
        <span className="text-[11px] font-semibold tabular-nums text-white">
          {formatJackpotCompact(chip.amount)}
        </span>
      </span>
    )
  }

  if (chip.kind === 'must') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <IconHourglass
          className="h-3 w-3 shrink-0"
          style={{ color: chip.accent }}
          strokeWidth={1.75}
        />
        <span className="text-[10px] font-medium" style={{ color: chip.accent }}>
          Must Drop
        </span>
        <span className="text-[11px] font-semibold tabular-nums text-white">
          {formatJackpotCompact(chip.amount)}
        </span>
        <span className="text-[10px] tabular-nums text-white/45">{chip.detail}</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[10px] font-medium" style={{ color: chip.accent }}>
        {chip.label}
      </span>
      <span className="text-[11px] font-semibold tabular-nums text-white">
        {formatJackpotCompact(chip.amount)}
      </span>
    </span>
  )
}

function LoopTrack({
  chips,
  animatedTiers,
}: {
  chips: Chip[]
  animatedTiers?: boolean
}) {
  return (
    <div className="jackpot-marquee-track absolute inset-y-0 left-0 flex items-center">
      {(['a', 'b'] as const).map((copy) => (
        <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 'b'}>
          {chips.map((chip) => (
            <span
              key={`${chip.key}-${copy}`}
              className="inline-flex shrink-0 items-center gap-1.5 px-3"
            >
              {chip.kind === 'tier' && animatedTiers ? (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-medium md:text-xs"
                    style={{ color: chip.accent }}
                  >
                    {chip.label}
                  </span>
                  <JackpotTickingAmount
                    value={chip.amount}
                    size="xs"
                    className="text-[11px] font-semibold text-white md:text-xs"
                  />
                </span>
              ) : (
                <ChipView chip={chip} />
              )}
              <span className="text-white/20" aria-hidden>
                ·
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function PersonalDesktop({ amount }: { amount: number }) {
  return (
    <span className="inline-flex h-full min-w-[11.5rem] items-center gap-2.5 px-3 leading-none">
      <IconUser className="h-4 w-4 shrink-0 text-white/80" strokeWidth={1.75} />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
          Personal Pot
        </span>
        <span className="mt-1 block text-[11px] text-white/50">balance</span>
      </span>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-white">
        {formatJackpotCompact(amount)}
      </span>
    </span>
  )
}

function MustDesktop({
  accent,
  amount,
  detail,
  tone,
}: {
  accent: string
  amount: number
  detail: string
  tone: 'time' | 'value'
}) {
  return (
    <span className="inline-flex h-full min-w-[11.5rem] items-center gap-2.5 px-3 leading-none">
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
          tone === 'time' ? 'bg-sky-500/15' : 'bg-amber-500/15'
        )}
      >
        <IconHourglass className="h-4 w-4" style={{ color: accent }} strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
          Must Drop
        </span>
        <span className="mt-1 block truncate text-[11px] tabular-nums text-white/55">
          {detail}
        </span>
      </span>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-white">
        {formatJackpotCompact(amount)}
      </span>
    </span>
  )
}

interface JackpotLauncherMarqueeProps {
  className?: string
}

/**
 * Desktop: Personal + Musts pinned, Mini–Mega marquee.
 * Mobile: one looping ticker — Balance, Musts, then Mini–Mega (nothing clipped).
 */
export function JackpotLauncherMarquee({ className }: JackpotLauncherMarqueeProps) {
  const tickerAmounts = useJackpotStore((s) => s.tickerAmounts)
  const personalAmount = useJackpotStore((s) => s.personalAmount)
  const mustDropAmount = useJackpotStore((s) => s.mustDropAmount)
  const mustDropDeadline = useJackpotStore((s) => s.mustDropDeadline)
  const valueAmount = useJackpotStore((s) => s.valueMustDropAmount)
  const valueThreshold = useJackpotStore((s) => s.valueMustDropThreshold)
  const countdown = useCountdown(mustDropDeadline)
  const { amount: megaDisplayAmount } = useMegaTickerDisplayAmount()

  const amountForTier = (tierId: JackpotTickerTierConfig['id']) =>
    tierId === 'mega' ? megaDisplayAmount : tickerAmounts[tierId]

  const mustTimeDetail = `in ${countdown}`
  const mustValueDetail = `before ${formatJackpotCompact(valueThreshold)}`

  const mobileSequence: Chip[] = [
    { key: 'balance', kind: 'balance', amount: personalAmount },
    {
      key: 'must-time',
      kind: 'must',
      amount: mustDropAmount,
      detail: mustTimeDetail,
      accent: MUST_TIME_ACCENT,
    },
    {
      key: 'must-value',
      kind: 'must',
      amount: valueAmount,
      detail: mustValueDetail,
      accent: MUST_VALUE_ACCENT,
    },
    ...JACKPOT_TICKER_TIERS.map(
      (tier): Chip => ({
        key: tier.id,
        kind: 'tier',
        label: tier.label,
        accent: tier.accent,
        amount: amountForTier(tier.id),
      })
    ),
  ]

  const mobileLooped = Array.from({ length: TIER_LOOP_COPIES }, (_, loop) =>
    mobileSequence.map((chip) => ({ ...chip, key: `${chip.key}-${loop}` }))
  ).flat()

  const desktopTiers: Chip[] = Array.from({ length: TIER_LOOP_COPIES }, (_, loop) =>
    JACKPOT_TICKER_TIERS.map(
      (tier): Chip => ({
        key: `${tier.id}-${loop}`,
        kind: 'tier',
        label: tier.label,
        accent: tier.accent,
        amount: amountForTier(tier.id),
      })
    )
  ).flat()

  return (
    <div className={cn('w-full', className)} aria-label="Live jackpot amounts">
      {/* Mobile: full-width scrolling ticker */}
      <div className="relative h-9 w-full overflow-hidden md:hidden">
        <LoopTrack chips={mobileLooped} />
      </div>

      {/* Desktop: pinned cards + tier marquee */}
      <div className="hidden h-12 w-full items-stretch divide-x divide-white/10 md:flex">
        <div className="flex shrink-0 items-stretch">
          <PersonalDesktop amount={personalAmount} />
        </div>
        <div className="flex shrink-0 items-stretch">
          <MustDesktop
            accent={MUST_TIME_ACCENT}
            amount={mustDropAmount}
            detail={mustTimeDetail}
            tone="time"
          />
        </div>
        <div className="flex shrink-0 items-stretch">
          <MustDesktop
            accent={MUST_VALUE_ACCENT}
            amount={valueAmount}
            detail={mustValueDetail}
            tone="value"
          />
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <LoopTrack chips={desktopTiers} animatedTiers />
        </div>
      </div>
    </div>
  )
}
