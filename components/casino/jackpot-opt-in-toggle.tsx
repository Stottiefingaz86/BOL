'use client'

import { IconCoins } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export type JackpotOptInToggleProps = {
  checked: boolean
  onCheckedChange: (next: boolean) => void
  /** Shown when off, e.g. per-spin surcharge */
  spinCostLabel?: string
  variant?: 'default' | 'compact'
  className?: string
}


export function JackpotOptInToggle({
  checked,
  onCheckedChange,
  spinCostLabel = '+$0.10/spin',
  variant = 'default',
  className,
}: JackpotOptInToggleProps) {
  const compact = variant === 'compact'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'inline-flex items-center rounded-full border border-transparent text-left outline-none transition-[background-color,border-color,box-shadow,color] duration-200',
        'focus-visible:border-white/[0.1] focus-visible:ring-[1px] focus-visible:ring-white/15',
        compact ? 'gap-1' : 'gap-1.5',
        compact
          ? 'h-6 max-w-[min(100%,220px)] pl-1.5 pr-0.5'
          : 'h-7 max-w-[min(100%,300px)] pl-2 pr-1',
        checked
          ? cn(
              'border border-white/[0.055]',
              'bg-[#262628]',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
            )
          : cn(
              'border border-white/[0.05]',
              'bg-[#1d1d1f]',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]',
              'hover:border-white/[0.08] hover:bg-[#202022]'
            ),
        className
      )}
    >
      <IconCoins
        className={cn(
          'shrink-0',
          compact ? 'h-2.5 w-2.5' : 'h-3 w-3',
          checked ? 'text-[color:var(--ds-primary,#ee3536)]' : 'text-neutral-500'
        )}
        stroke={compact ? 1.5 : 1.35}
      />
      <span
        className={cn(
          'min-w-0 flex-1 truncate leading-none',
          compact ? 'text-[9px]' : 'text-[10px]',
        )}
      >
        {checked ? (
          <span className="font-medium tracking-tight text-white">
            On<span className="mx-0.5 text-neutral-500">·</span>
            <span className="font-normal text-neutral-500">{spinCostLabel}</span>
          </span>
        ) : (
          <span className="font-medium tracking-tight text-neutral-400">
            Off<span className="mx-0.5 text-neutral-500">·</span>
            <span className="font-normal text-neutral-500">{spinCostLabel}</span>
          </span>
        )}
      </span>
      <span
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200',
          compact ? 'h-[13px] min-h-[13px] w-[26px] px-px' : 'h-[15px] min-h-[15px] w-[32px] px-px',
          checked ? 'justify-end bg-[color-mix(in_srgb,var(--ds-primary,#ee3536)_94%,#1a0505)]' : 'justify-start bg-[#454548]',
        )}
        style={{
          boxShadow: checked
            ? 'inset 0 1px 2px rgba(0,0,0,0.35)'
            : 'inset 0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        <span
          className={cn(
            'rounded-full bg-white shadow-sm transition-transform duration-200',
            compact ? 'size-2.5' : 'size-[13px]',
            'ring-[0.5px] ring-black/15',
          )}
        />
      </span>
    </button>
  )
}
