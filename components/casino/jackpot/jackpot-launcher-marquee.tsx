'use client'

import {
  JACKPOT_TICKER_TIERS,
  formatJackpotCompact,
  type JackpotTickerTierConfig,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { useMegaTickerDisplayAmount } from '@/components/casino/jackpot/use-mega-ticker-display-amount'
import { cn } from '@/lib/utils'

function TierAmount({
  tier,
  amount,
  compact = false,
  flowDuration,
}: {
  tier: JackpotTickerTierConfig
  amount: number
  compact?: boolean
  flowDuration?: number
}) {
  return (
    <>
      <span
        className={cn(
          'font-medium',
          compact ? 'text-[10px] md:text-[11px]' : 'text-[10px] md:text-xs'
        )}
        style={{ color: tier.accent }}
      >
        {tier.label}
      </span>
      {compact ? (
        <span className="text-[11px] font-semibold tabular-nums text-white md:text-xs">
          {formatJackpotCompact(amount)}
        </span>
      ) : (
        <JackpotTickingAmount
          value={amount}
          size="xs"
          flowDuration={flowDuration}
          className="text-[11px] font-semibold text-white md:text-xs"
        />
      )}
    </>
  )
}

function MarqueeItem({
  tier,
  amount,
  copy,
  flowDuration,
}: {
  tier: JackpotTickerTierConfig
  amount: number
  copy: 'a' | 'b'
  flowDuration?: number
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 px-4 md:px-6"
      aria-hidden={copy === 'b' ? true : undefined}
    >
      <TierAmount tier={tier} amount={amount} flowDuration={flowDuration} />
      <span className="text-white/20" aria-hidden>
        ·
      </span>
    </span>
  )
}

interface JackpotLauncherMarqueeProps {
  className?: string
}

export function JackpotLauncherMarquee({ className }: JackpotLauncherMarqueeProps) {
  const tickerAmounts = useJackpotStore((s) => s.tickerAmounts)
  const { amount: megaDisplayAmount, isRolling: megaIsRolling } =
    useMegaTickerDisplayAmount()

  const amountForTier = (tierId: JackpotTickerTierConfig['id']) =>
    tierId === 'mega' ? megaDisplayAmount : tickerAmounts[tierId]

  const megaFlowDuration = megaIsRolling ? 90 : undefined

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop + reduced-motion: full-width static grid */}
      <div className="hidden h-7 w-full grid-cols-4 divide-x divide-white/10 md:grid max-md:motion-reduce:grid">
        {JACKPOT_TICKER_TIERS.map((tier) => (
          <div
            key={tier.id}
            className="flex min-w-0 items-center justify-center gap-1.5 px-2"
          >
            <TierAmount
              tier={tier}
              amount={amountForTier(tier.id)}
              flowDuration={tier.id === 'mega' ? megaFlowDuration : undefined}
            />
          </div>
        ))}
      </div>

      {/* Mobile: left-aligned infinite marquee */}
      <div
        className="relative h-7 w-full overflow-hidden md:hidden motion-reduce:hidden"
        aria-label="Live jackpot amounts"
      >
        <div className="jackpot-marquee-track absolute left-0 top-0 flex h-full items-center">
          {(['a', 'b'] as const).map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 'b'}>
              {JACKPOT_TICKER_TIERS.map((tier) => (
                <MarqueeItem
                  key={`${tier.id}-${copy}`}
                  tier={tier}
                  amount={amountForTier(tier.id)}
                  copy={copy}
                  flowDuration={tier.id === 'mega' ? megaFlowDuration : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
