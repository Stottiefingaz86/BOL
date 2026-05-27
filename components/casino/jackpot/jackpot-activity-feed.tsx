'use client'

import { CasinoActivityTable } from '@/components/casino/casino-activity-table'
import { cn } from '@/lib/utils'

export function JackpotActivityFeed({
  className,
  compact: _compact,
  maxItems = 6,
}: {
  className?: string
  compact?: boolean
  maxItems?: number
}) {
  return (
    <CasinoActivityTable
      className={cn('w-full', className)}
      title="Activity"
      defaultTab="Jackpot Winners"
      maxRows={maxItems}
    />
  )
}
