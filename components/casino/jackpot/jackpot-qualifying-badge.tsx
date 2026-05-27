'use client'

import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JACKPOT_MIN_QUALIFYING_BET } from '@/lib/jackpot/constants'
import { cn } from '@/lib/utils'
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react'

interface JackpotQualifyingBadgeProps {
  betAmount?: number
  className?: string
}

export function JackpotQualifyingBadge({
  betAmount = 2,
  className,
}: JackpotQualifyingBadgeProps) {
  const optedIn = useJackpotStore((s) => s.optedIn)
  const qualifies = optedIn && betAmount >= JACKPOT_MIN_QUALIFYING_BET

  if (!optedIn) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border border-white/15 text-white/45 bg-white/5',
          className
        )}
      >
        <IconCircleX className="w-3 h-3" />
        Not opted in
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border',
        qualifies
          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
          : 'border-amber-500/40 text-amber-300 bg-amber-500/10',
        className
      )}
    >
      {qualifies ? (
        <IconCircleCheck className="w-3 h-3" />
      ) : (
        <IconCircleX className="w-3 h-3" />
      )}
      {qualifies ? 'Qualifying bet' : `Min $${JACKPOT_MIN_QUALIFYING_BET} to qualify`}
    </span>
  )
}
