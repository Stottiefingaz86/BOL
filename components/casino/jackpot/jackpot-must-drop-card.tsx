'use client'

import { useActiveMustDrop } from '@/lib/jackpot/use-active-must-drop'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { cn } from '@/lib/utils'
import { IconHourglass } from '@tabler/icons-react'

/** Display-only must-drop summary row. */
export function JackpotMustDropCard({ className }: { className?: string }) {
  const mustDrop = useActiveMustDrop()

  if (!mustDrop.isVisible) return null

  return (
    <div
      className={cn(
        'w-full flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5',
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0 border border-white/10 bg-white/10">
        <IconHourglass
          className="w-4 h-4"
          style={{ color: mustDrop.accent }}
          strokeWidth={1.75}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/50">
          Must drop
        </p>
        <p className="text-xs text-white/75 mt-0.5 truncate">{mustDrop.detailLong}</p>
      </div>
      <JackpotTickingAmount value={mustDrop.amount} size="xs" />
    </div>
  )
}
