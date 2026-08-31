'use client'

import { useEffect, useState } from 'react'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { formatJackpotCompact } from '@/lib/jackpot/constants'
import { cn } from '@/lib/utils'
import { IconHourglass } from '@tabler/icons-react'

function useCountdown(deadline: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()))

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  return { h, m, s }
}

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

interface JackpotUnderGameStripProps {
  className?: string
  visible?: boolean
}

/**
 * Under-game strip (mobile): personal + must-drops.
 * Mirrors values also shown in the header ticker.
 */
export function JackpotUnderGameStrip({
  className,
  visible = true,
}: JackpotUnderGameStripProps) {
  const personalAmount = useJackpotStore((s) => s.personalAmount)
  const mustDropAmount = useJackpotStore((s) => s.mustDropAmount)
  const mustDropDeadline = useJackpotStore((s) => s.mustDropDeadline)
  const valueAmount = useJackpotStore((s) => s.valueMustDropAmount)
  const valueThreshold = useJackpotStore((s) => s.valueMustDropThreshold)
  const { h, m, s } = useCountdown(mustDropDeadline)

  if (!visible) return null

  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[var(--ds-page-bg)]/90',
        className
      )}
      aria-label="Personal and must-drop jackpots"
    >
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <div
          className={cn(
            'flex min-w-0 flex-col items-center justify-center gap-0.5 px-2 py-2',
            'bg-transparent'
          )}
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/70">
            Personal
          </span>
          <JackpotTickingAmount
            value={personalAmount}
            size="xs"
            className="max-w-full justify-center text-[11px] leading-none"
          />
        </div>

        <div
          className={cn(
            'flex min-w-0 items-center gap-1.5 px-2 py-2',
            'bg-gradient-to-b from-sky-400/[0.1] to-transparent'
          )}
        >
          <IconHourglass className="h-3.5 w-3.5 shrink-0 text-sky-300/85" strokeWidth={1.75} />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/70">
              Must Drop
            </p>
            <p className="truncate text-[11px] font-semibold tabular-nums leading-none text-white">
              {formatJackpotCompact(mustDropAmount)}
            </p>
            <p className="mt-0.5 text-[9px] tabular-nums text-white/45">
              {pad2(h)}:{pad2(m)}:{pad2(s)}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'flex min-w-0 items-center gap-1.5 px-2 py-2',
            'bg-gradient-to-b from-amber-400/[0.1] to-transparent'
          )}
        >
          <IconHourglass className="h-3.5 w-3.5 shrink-0 text-amber-300/85" strokeWidth={1.75} />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/70">
              Must Drop
            </p>
            <p className="truncate text-[11px] font-semibold tabular-nums leading-none text-white">
              {formatJackpotCompact(valueAmount)}
            </p>
            <p className="mt-0.5 truncate text-[9px] text-white/45">
              before {formatJackpotCompact(valueThreshold)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
