'use client'

import type { JackpotTierId } from '@/lib/jackpot/constants'
import { JACKPOT_TIERS } from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { cn } from '@/lib/utils'

interface JackpotNetworkBadgeProps {
  tier: JackpotTierId
  className?: string
}

export function JackpotNetworkBadge({ tier, className }: JackpotNetworkBadgeProps) {
  const config = JACKPOT_TIERS.find((t) => t.id === tier)
  const accent = config?.accent ?? '#fbbf24'
  const amount = useJackpotStore((s) => s.amounts[tier])

  return (
    <div
      className={cn(
        'flex items-center justify-center px-1.5 py-0.5 rounded-md border backdrop-blur-sm min-w-[44px]',
        className
      )}
      style={{
        backgroundColor: 'rgba(0,0,0,0.62)',
        borderColor: `${accent}55`,
      }}
    >
      <JackpotTickingAmount value={amount} size="badge" />
    </div>
  )
}
