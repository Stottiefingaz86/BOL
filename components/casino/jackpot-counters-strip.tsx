'use client'

import { cn } from '@/lib/utils'
import { JACKPOT_TIERS, type JackpotTierConfig } from '@/components/casino/jackpot-tiers'
import { JackpotRollAmountDisplay } from '@/components/casino/jackpot-roll-amount'

export type JackpotCountersStripProps = {
  className?: string
  /** Tighter padding for embedding under banners */
  dense?: boolean
}

function mutedTier(accent: string) {
  return `color-mix(in srgb, ${accent} 72%, rgb(148 148 154))`
}

function JackpotCounterCell({
  tier,
  dense,
}: {
  tier: JackpotTierConfig
  dense?: boolean
}) {
  return (
    <div
      className={cn(
        'group relative flex flex-col items-center justify-center overflow-hidden text-center transition-colors duration-200',
        'bg-transparent',
        dense ? 'px-1.5 py-[3px]' : 'px-2 py-1 md:py-[6px]',
        'border-b border-white/[0.04] last:border-b-0 sm:[&:nth-child(2)]:border-b-0 sm:border-b-0 md:border-b-0'
      )}
    >
      {/* Hairline edge only — no heavy “frame” stroke */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex flex-col">
        <div className="h-px w-full" style={{ backgroundColor: tier.accent }} />
        <div
          className="mx-auto h-2.5 w-[70%] max-w-none opacity-60 sm:w-[60%]"
          style={{
            background: `linear-gradient(to bottom, color-mix(in srgb, ${tier.accent} 28%, transparent) 0%, transparent 100%)`,
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-[3] flex min-h-0 w-full flex-col items-center justify-center px-0.5 py-px leading-none">
        {tier.subline && (
          <p className="mb-0 max-w-[10.5rem] px-0.5 text-[6px] font-medium uppercase leading-tight tracking-wide text-white/40">
            {tier.subline}
          </p>
        )}
        <p
          className="text-[6.5px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: mutedTier(tier.accent) }}
        >
          {tier.label}
        </p>
        <p className="mt-0.5 flex h-[12px] items-center justify-center overflow-hidden tabular-nums text-white/[0.93]">
          <JackpotRollAmountDisplay
            tierId={tier.id}
            compact
            className="text-[10px] font-semibold md:text-[11px]"
          />
        </p>
      </div>
    </div>
  )
}

export function JackpotCountersStrip({ className, dense }: JackpotCountersStripProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-md bg-[#151517]',
        'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.03)]',
        className,
      )}
    >
      <div
        className={cn(
          'grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
          'md:divide-x md:divide-white/[0.03]'
        )}
      >
        {JACKPOT_TIERS.map((tier) => (
          <JackpotCounterCell key={tier.id} tier={tier} dense={dense} />
        ))}
      </div>
    </div>
  )
}
