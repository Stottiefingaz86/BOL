'use client'

import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { cn } from '@/lib/utils'
import { IconChevronRight, IconClock } from '@tabler/icons-react'

export function JackpotMustDropCard({ className }: { className?: string }) {
  const setOpen = useJackpotStore((s) => s.setMustDropDrawerOpen)
  const amount = useJackpotStore((s) => s.mustDropAmount)

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        'w-full flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left transition-colors',
        'hover:bg-white/[0.08] hover:border-white/15',
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0 border border-white/10 bg-white/10">
        <IconClock className="w-4 h-4 text-white/60" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/50">
          Must drop daily
        </p>
        <p className="text-xs text-white/75 mt-0.5">Guaranteed before midnight</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <JackpotTickingAmount value={amount} size="xs" />
        <IconChevronRight className="w-4 h-4 text-white/30" />
      </div>
    </button>
  )
}
