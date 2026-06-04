'use client'

import { IconCoins } from '@tabler/icons-react'
import type { JackpotTierId } from '@/lib/jackpot/constants'
import { cn } from '@/lib/utils'

interface JackpotNetworkBadgeProps {
  /** Kept for call-site compatibility; display is a single “Jackpot” tag */
  tier?: JackpotTierId
  className?: string
}

export function JackpotNetworkBadge({ className }: JackpotNetworkBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-md border border-white/15 bg-black/55 px-1.5 py-0.5 backdrop-blur-sm',
        className
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
  )
}
