'use client'

import { JACKPOT_TIERS } from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTierCard } from '@/components/casino/jackpot/jackpot-tier-card'
import { cn } from '@/lib/utils'

interface JackpotTiersGridProps {
  className?: string
  onTierClick?: (tierId: string) => void
}

export function JackpotTiersGrid({ className, onTierClick }: JackpotTiersGridProps) {
  const amounts = useJackpotStore((s) => s.amounts)

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3',
        className
      )}
    >
      {JACKPOT_TIERS.map((tier) => (
        <JackpotTierCard
          key={tier.id}
          tier={tier}
          amount={amounts[tier.id]}
          onClick={onTierClick ? () => onTierClick(tier.id) : undefined}
        />
      ))}
    </div>
  )
}
