'use client'

import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotSwitch } from '@/components/casino/jackpot/jackpot-switch'
import { cn } from '@/lib/utils'
import { IconDiamond } from '@tabler/icons-react'

export function JackpotOptInCard({ className }: { className?: string }) {
  const optedIn = useJackpotStore((s) => s.optedIn)

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-3 py-2.5',
        optedIn
          ? 'border-white/10 bg-white/5'
          : 'border-amber-500/35 bg-white/5',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-md border flex-shrink-0',
          optedIn
            ? 'border-white/10 bg-white/5'
            : 'border-amber-500/30 bg-amber-500/10'
        )}
      >
        <IconDiamond
          className={cn(
            'w-4 h-4',
            optedIn ? 'text-white/50' : 'text-amber-400/90'
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-[9px] font-semibold uppercase tracking-[0.14em]',
            optedIn ? 'text-emerald-400/90' : 'text-amber-400/90'
          )}
        >
          {optedIn ? 'Qualified' : 'Not qualified'}
        </p>
        <p className="text-xs text-white/80 leading-snug mt-0.5">
          {optedIn
            ? 'Contributing to jackpot pools on qualifying bets'
            : 'Opt in to play for the jackpots'}
        </p>
      </div>
      <JackpotSwitch variant="pill" />
    </div>
  )
}
