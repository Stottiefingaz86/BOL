'use client'

import { useEffect, useState } from 'react'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { formatJackpotAmount, formatJackpotCompact } from '@/lib/jackpot/constants'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { IconHourglass, IconInfoCircle, IconUser } from '@tabler/icons-react'

const PERSONAL_POT_INFO =
  'Your own balance that grows as you play opted-in jackpot games. Paid only to you when your personal jackpot triggers on a qualifying spin.'
const MUST_DROP_TIME_INFO =
  'A shared pool that is guaranteed to drop before the countdown ends. Any opted-in player on a qualifying spin can win it when it drops.'
const MUST_DROP_VALUE_INFO =
  'A shared pool that is guaranteed to drop before it reaches the listed amount. Opted-in players can win it on a qualifying spin when the must-drop hits.'

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

function JackpotInfoTip({ label, info }: { label: string; info: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="relative z-10 -m-0.5 shrink-0 rounded-full p-0.5 text-white/55 transition-colors hover:text-white"
            aria-label={`${label} info`}
            onClick={(e) => e.stopPropagation()}
          >
            <IconInfoCircle className="size-3.5" strokeWidth={2} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          portal
          className="z-[200] max-w-[260px] border-[var(--ds-border)] bg-[var(--ds-surface)] text-xs text-[var(--ds-fg)]"
        >
          <p>{info}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface JackpotExtrasSectionProps {
  className?: string
  isMobile?: boolean
}

/**
 * Personal pot + must-drop promises on the Jackpots tab (display only).
 * Mobile: equal 3-up compact cells. Desktop: wider horizontal cards.
 */
export function JackpotExtrasSection({ className }: JackpotExtrasSectionProps) {
  const personalAmount = useJackpotStore((s) => s.personalAmount)
  const mustDropAmount = useJackpotStore((s) => s.mustDropAmount)
  const mustDropDeadline = useJackpotStore((s) => s.mustDropDeadline)
  const valueAmount = useJackpotStore((s) => s.valueMustDropAmount)
  const valueThreshold = useJackpotStore((s) => s.valueMustDropThreshold)
  const { h, m, s } = useCountdown(mustDropDeadline)
  const countdown = `${pad2(h)}:${pad2(m)}:${pad2(s)}`

  return (
    <section className={cn('w-full', className)} aria-label="Personal and must-drop jackpots">
      {/* Mobile: compact equal columns */}
      <div className="grid grid-cols-3 gap-1.5 sm:hidden">
        <div
          className={cn(
            'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-1.5 py-2 text-center',
            'border-white/15 bg-[var(--ds-promo-card-bg,#141414)]'
          )}
        >
          <div className="inline-flex items-center justify-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/70">
            Personal Pot
            <JackpotInfoTip label="Personal Pot" info={PERSONAL_POT_INFO} />
          </div>
          <JackpotTickingAmount
            value={personalAmount}
            size="xs"
            className="justify-center text-[11px] leading-none"
          />
        </div>

        <div
          className={cn(
            'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-1.5 py-2 text-center',
            'border-sky-400/30 bg-[var(--ds-promo-card-bg,#141414)]',
            'bg-gradient-to-b from-sky-400/[0.12] to-transparent'
          )}
        >
          <div className="inline-flex items-center justify-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/75">
            <IconHourglass className="h-3 w-3 text-sky-300" strokeWidth={1.75} />
            Must Drop
            <JackpotInfoTip label="Must Drop time" info={MUST_DROP_TIME_INFO} />
          </div>
          <p className="text-[11px] font-semibold tabular-nums leading-none text-white">
            {formatJackpotCompact(mustDropAmount)}
          </p>
          <p className="text-[9px] tabular-nums text-white/45">in {countdown}</p>
        </div>

        <div
          className={cn(
            'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-1.5 py-2 text-center',
            'border-amber-400/35 bg-[var(--ds-promo-card-bg,#141414)]',
            'bg-gradient-to-b from-amber-400/[0.12] to-transparent'
          )}
        >
          <div className="inline-flex items-center justify-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/75">
            <IconHourglass className="h-3 w-3 text-amber-300" strokeWidth={1.75} />
            Must Drop
            <JackpotInfoTip label="Must Drop value" info={MUST_DROP_VALUE_INFO} />
          </div>
          <p className="text-[11px] font-semibold tabular-nums leading-none text-white">
            {formatJackpotCompact(valueAmount)}
          </p>
          <p className="max-w-full truncate text-[9px] text-white/45">
            before {formatJackpotCompact(valueThreshold)}
          </p>
        </div>
      </div>

      {/* Desktop / tablet: horizontal cards */}
      <div className="hidden gap-2 sm:grid sm:grid-cols-3">
        <div
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5',
            'border-white/15 bg-[var(--ds-promo-card-bg,#141414)]'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
            <IconUser className="h-4 w-4 text-white/70" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">
              Personal Pot
              <JackpotInfoTip label="Personal Pot" info={PERSONAL_POT_INFO} />
            </div>
            <p className="mt-0.5 text-xs text-white/45">balance</p>
          </div>
          <JackpotTickingAmount value={personalAmount} size="xs" className="shrink-0" />
        </div>

        <div
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5',
            'border-sky-400/30 bg-[var(--ds-promo-card-bg,#141414)] bg-gradient-to-br from-sky-400/[0.12] to-transparent'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-500/15">
            <IconHourglass className="h-4 w-4 text-sky-300/90" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75">
              Must drop
              <JackpotInfoTip label="Must Drop time" info={MUST_DROP_TIME_INFO} />
            </div>
            <p className="mt-0.5 text-xs text-white/45">In {countdown}</p>
          </div>
          <JackpotTickingAmount value={mustDropAmount} size="xs" className="shrink-0" />
        </div>

        <div
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5',
            'border-amber-400/35 bg-[var(--ds-promo-card-bg,#141414)] bg-gradient-to-br from-amber-400/[0.12] to-transparent'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15">
            <IconHourglass className="h-4 w-4 text-amber-300/90" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75">
              Must drop
              <JackpotInfoTip label="Must Drop value" info={MUST_DROP_VALUE_INFO} />
            </div>
            <p className="mt-0.5 truncate text-xs text-white/45">
              Before {formatJackpotAmount(valueThreshold)}
            </p>
          </div>
          <JackpotTickingAmount value={valueAmount} size="xs" className="shrink-0" />
        </div>
      </div>
    </section>
  )
}
