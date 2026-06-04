'use client'

import { IconCoins } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { JackpotTierConfig } from '@/components/casino/jackpot-tiers'

export type JackpotTileJackpotChipProps = {
  /** Kept for call-site compatibility */
  tier?: JackpotTierConfig
  size?: 'carousel' | 'grid'
  className?: string
}

/** Bottom-center “Jackpot” tag on game artwork */
export function JackpotTileJackpotChip({ className }: JackpotTileJackpotChipProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-1.5 bottom-1.5 z-20 flex justify-center',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center gap-1 rounded-md border border-white/15 bg-black/55 px-1.5 py-0.5 backdrop-blur-[7px]',
          'shadow-[0_2px_8px_rgba(0,0,0,0.35)]'
        )}
      >
        <IconCoins
          className="h-2.5 w-2.5 shrink-0 text-amber-200/90"
          stroke={2}
          aria-hidden
        />
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/90">
          Jackpot
        </span>
      </div>
    </div>
  )
}
