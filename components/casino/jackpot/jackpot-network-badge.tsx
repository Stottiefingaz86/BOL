'use client'

import type { JackpotTierId } from '@/lib/jackpot/constants'
import { JACKPOT_TIERS } from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { IconCoins } from '@tabler/icons-react'
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
        'flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-md border backdrop-blur-sm min-w-[52px]',
        className
      )}
      style={{
        backgroundColor: 'rgba(0,0,0,0.62)',
        borderColor: `${accent}55`,
      }}
    >
      <div className="flex items-center gap-0.5 leading-none">
        <IconCoins className="w-2 h-2 flex-shrink-0" style={{ color: accent }} />
        <span
          className="text-[7px] font-bold uppercase tracking-wide"
          style={{ color: accent }}
        >
          {config?.shortLabel ?? 'JP'}
        </span>
      </div>
      <JackpotTickingAmount value={amount} size="badge" />
    </div>
  )
}
