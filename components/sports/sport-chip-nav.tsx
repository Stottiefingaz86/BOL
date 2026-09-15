'use client'

import { cn } from '@/lib/utils'
import type { SportChip, SportId } from './mock-data'

interface SportChipNavProps {
  chips: SportChip[]
  activeId: SportId
  onSelect: (id: SportId) => void
  className?: string
  /** Inset the first/last chip using spacer elements (padding on the scroller is overridden by the global mobile sub-nav CSS). */
  edgeInset?: number
}

/** Same sport tab strip as the legacy sportsbook header (icon over label, red underline when active). */
export function SportChipNav({ chips, activeId, onSelect, className, edgeInset = 0 }: SportChipNavProps) {
  return (
    <div
      className={cn('flex items-center gap-1.5 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide', className)}
      style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
      role="tablist"
      aria-label="Sports"
    >
      {edgeInset > 0 && <div aria-hidden className="shrink-0" style={{ width: edgeInset }} />}
      {chips.map((chip) => {
        const isActive = chip.id === activeId
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(chip.id)}
            className={cn(
              'relative flex min-w-[60px] shrink-0 flex-col items-center justify-center gap-1 rounded-small px-2 py-1.5 transition-all duration-300',
              'hover:bg-white/5 active:bg-white/15',
              isActive && 'bg-white/10'
            )}
            style={{ overflow: 'visible' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chip.icon}
              alt=""
              className={cn(
                'h-5 w-5 object-contain transition-opacity duration-300',
                isActive ? 'opacity-100' : 'opacity-70'
              )}
            />
            <span
              className={cn(
                'whitespace-nowrap text-[10px] font-medium transition-colors duration-300',
                isActive ? 'text-white' : 'text-white/70'
              )}
            >
              {chip.label}
            </span>
            <div
              className={cn(
                'absolute -bottom-2 left-1/2 z-10 h-0.5 -translate-x-1/2 rounded-full transition-all duration-300 ease-in-out',
                isActive ? 'w-8 opacity-100' : 'w-0 opacity-0'
              )}
              style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
            />
          </button>
        )
      })}
      {edgeInset > 0 && <div aria-hidden className="shrink-0" style={{ width: edgeInset }} />}
    </div>
  )
}
