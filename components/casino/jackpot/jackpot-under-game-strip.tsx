'use client'

import { useActiveMustDrop } from '@/lib/jackpot/use-active-must-drop'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { cn } from '@/lib/utils'
import { IconHourglass } from '@tabler/icons-react'

interface JackpotUnderGameStripProps {
  className?: string
  visible?: boolean
}

/**
 * Under-game strip (mobile): active must-drop only.
 */
export function JackpotUnderGameStrip({
  className,
  visible = true,
}: JackpotUnderGameStripProps) {
  const mustDrop = useActiveMustDrop()

  if (!visible || !mustDrop.isVisible) return null

  const isTime = mustDrop.tone === 'time'

  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[var(--ds-page-bg)]/90',
        className
      )}
      aria-label="Must-drop jackpot"
    >
      <div
        className={cn(
          'flex min-w-0 items-center gap-1.5 px-3 py-2',
          isTime
            ? 'bg-gradient-to-b from-sky-400/[0.1] to-transparent'
            : 'bg-gradient-to-b from-amber-400/[0.1] to-transparent'
        )}
      >
        <IconHourglass
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: mustDrop.accent }}
          strokeWidth={1.75}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/70">
            Must Drop
          </p>
          <JackpotTickingAmount
            value={mustDrop.amount}
            size="xs"
            className="max-w-full justify-start text-[11px] leading-none"
          />
          <p className="mt-0.5 truncate text-[9px] tabular-nums text-white/45">
            {mustDrop.sublabel}
          </p>
        </div>
      </div>
    </div>
  )
}
