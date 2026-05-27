'use client'

import { IconCoins } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { JackpotTierConfig } from '@/components/casino/jackpot-tiers'
import { JackpotTileRollAmount } from '@/components/casino/jackpot-roll-amount'

export type JackpotTileJackpotChipProps = {
  tier: JackpotTierConfig
  /** Carousel tiles are 160px; grid tiles are larger */
  size?: 'carousel' | 'grid'
  className?: string
}

/**
 * Bottom-center jackpot readout on game artwork (Megaways-style reference):
 * frosted pill, gold tier row, amount with superscript ticker digit.
 */
export function JackpotTileJackpotChip({ tier, size = 'carousel', className }: JackpotTileJackpotChipProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-1.5 bottom-1.5 z-20 flex justify-center',
        className
      )}
    >
      <div
        className={cn(
          'flex w-max max-w-full flex-col items-center gap-0.5 rounded-md px-2 py-1',
          'bg-black/50 backdrop-blur-[7px]',
          /* No hard stroke — soft edge only */
          'shadow-[0_2px_8px_rgba(0,0,0,0.35)]'
        )}
      >
        <div className="flex items-center gap-0.5">
          <IconCoins className="h-2.5 w-2.5 shrink-0 text-amber-200/90" stroke={2} aria-hidden />
          <span className="text-[7.5px] font-bold uppercase tracking-[0.14em] text-amber-200/90 md:text-[8px]">
            {tier.label}
          </span>
        </div>
        <div className="-mt-px text-center leading-none">
          <JackpotTileRollAmount tierId={tier.id} size={size} />
        </div>
      </div>
    </div>
  )
}
