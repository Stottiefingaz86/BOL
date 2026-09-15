'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface PillTab<T extends string> {
  id: T
  label: string
}

interface PillTabsProps<T extends string> {
  tabs: PillTab<T>[]
  value: T
  onChange: (value: T) => void
  /** Unique framer-motion layoutId so several tab groups on one page don't share the pill. */
  layoutId: string
  className?: string
  /**
   * Full-bleed mode: the track scrolls edge-to-edge (negative margins) while the
   * pills start/end `edgeInset`px in — same pattern as the sport chip nav / casino carousels.
   */
  edgeInset?: number
}

/** Same pill tab group used by CasinoActivityPanel / MarketFilterBar (blurred track, red sliding pill). */
export function PillTabs<T extends string>({ tabs, value, onChange, layoutId, className, edgeInset }: PillTabsProps<T>) {
  return (
    <div
      className={cn('scrollbar-hide overflow-x-auto', className)}
      style={{
        WebkitOverflowScrolling: 'touch',
        ...(edgeInset ? { marginLeft: -edgeInset, marginRight: -edgeInset } : null),
      }}
    >
      <div
        className="inline-flex h-auto w-max gap-1 rounded-3xl border-0 bg-[var(--ds-control-bg)] p-0.5 backdrop-blur-xl"
        style={edgeInset ? { marginLeft: edgeInset, marginRight: edgeInset } : undefined}
      >
        {tabs.map(({ id, label }) => {
          const isActive = id === value
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(id)}
              className={cn(
                'relative flex h-9 shrink-0 items-center whitespace-nowrap rounded-2xl px-4 py-1 text-xs font-medium outline-none transition-all duration-300',
                isActive
                  ? 'text-white'
                  : 'border border-transparent bg-transparent text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 -z-10 rounded-2xl"
                  style={{ backgroundColor: '#ee3536' }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
