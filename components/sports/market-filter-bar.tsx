'use client'

import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { MarketFilter } from './mock-data'
import { PillTabs, type PillTab } from './pill-tabs'

const FILTERS: PillTab<MarketFilter>[] = [
  { id: 'events', label: 'Events' },
  { id: 'outrights', label: 'Outrights' },
  { id: 'leagues', label: 'All Leagues' },
]

interface MarketFilterBarProps {
  value: MarketFilter
  onChange: (value: MarketFilter) => void
  className?: string
}

/** Same pill tab group used by CasinoActivityPanel (All Bets / Jackpot Winners / Daily Race). */
export function MarketFilterBar({ value, onChange, className }: MarketFilterBarProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <PillTabs tabs={FILTERS} value={value} onChange={onChange} layoutId="sports-market-filter-pill" />
      <button
        type="button"
        aria-label="Filter markets"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ds-control-bg)] text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]"
      >
        <IconAdjustmentsHorizontal className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
