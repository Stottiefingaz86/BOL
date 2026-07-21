'use client'

import { IconTrophy } from '@tabler/icons-react'
import { DailyRacesTimer } from '@/components/daily-races-timer'
import { cn } from '@/lib/utils'

/** Compact Daily Races panel for the VIP Hub drawer */
export function VipDailyRaces({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-500/[0.12] to-transparent p-4">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15">
              <IconTrophy strokeWidth={1.8} className="size-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-amber-100">$25K Daily Race</p>
              <p className="mt-0.5 text-[11px] text-amber-200/60">Ends in</p>
            </div>
          </div>
          <DailyRacesTimer
            className="text-xl font-bold tabular-nums text-amber-200"
            colonClassName="text-amber-300/80"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg border border-amber-400/25 bg-amber-500/[0.08] p-2.5">
            <div className="mb-0.5 font-semibold text-amber-100">3rd</div>
            <div className="text-[10px] text-amber-200/70">Position</div>
          </div>
          <div className="rounded-lg border border-amber-400/25 bg-amber-500/[0.08] p-2.5">
            <div className="mb-0.5 font-semibold text-amber-100">$80.00</div>
            <div className="text-[10px] text-amber-200/70">Wagered</div>
          </div>
          <div className="rounded-lg border border-amber-400/35 bg-amber-500/[0.12] p-2.5">
            <div className="mb-0.5 font-semibold text-amber-50">$160.00</div>
            <div className="text-[10px] text-amber-200/80">Current Prize</div>
          </div>
        </div>
      </div>

      <p className="px-0.5 text-[11px] leading-relaxed text-white/40">
        Place bets across Sportsbook, Casino, Poker, Racebook or Esports to climb the leaderboard.
        Everyone qualifies — you&apos;re enrolled as soon as you start wagering.
      </p>
    </div>
  )
}

export default VipDailyRaces
