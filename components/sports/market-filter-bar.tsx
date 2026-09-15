'use client'

import { motion } from 'framer-motion'
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { MarketFilter } from './mock-data'

const FILTERS: { id: MarketFilter; label: string }[] = [
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
      <div className="scrollbar-hide overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="inline-flex h-auto w-max gap-1 rounded-3xl border-0 bg-[var(--ds-control-bg)] p-0.5 backdrop-blur-xl">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                'relative flex h-9 shrink-0 items-center whitespace-nowrap rounded-2xl px-4 py-1 text-xs font-medium transition-all duration-300',
                value === id
                  ? 'text-white'
                  : 'border border-transparent bg-transparent text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]'
              )}
            >
              {value === id && (
                <motion.div
                  layoutId="sports-market-filter-pill"
                  className="absolute inset-0 -z-10 rounded-2xl"
                  style={{ backgroundColor: '#ee3536' }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>
      </div>
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
