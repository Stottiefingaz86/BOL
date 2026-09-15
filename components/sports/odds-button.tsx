'use client'

import { cn } from '@/lib/utils'

interface OddsButtonProps {
  odds: string
  line?: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

/** Figma "Domain Button" — 42px tall, line above semibold price. */
export function OddsButton({ odds, line, selected = false, onClick, className }: OddsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[42px] w-[77px] items-center justify-center rounded-lg border px-2 py-1 text-xs transition-colors',
        selected
          ? 'border-[var(--ds-primary,#ee3536)] bg-[var(--ds-primary,#ee3536)] text-white'
          : 'border-white/[0.06] bg-white/[0.04] text-[var(--ds-fg)] hover:bg-white/[0.08]',
        className
      )}
    >
      <span className="flex flex-col items-center gap-px leading-4">
        {line && (
          <span className={cn('whitespace-nowrap font-normal', selected ? 'text-white/85' : 'text-[var(--ds-fg)]/90')}>
            {line}
          </span>
        )}
        <span className="font-semibold tabular-nums">{odds}</span>
      </span>
    </button>
  )
}
