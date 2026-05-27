'use client'

import type { ComponentProps } from 'react'
import NumberFlow from '@number-flow/react'
import { cn } from '@/lib/utils'
import type { JackpotTierId } from '@/components/casino/jackpot-tiers'
import { formatJackpotTileAmountParts, jackpotRollNumeric } from '@/components/casino/jackpot-roll'
import { useJackpotRollTick } from '@/components/casino/jackpot-roll-tick-context'

export type JackpotRollAmountDisplayProps = {
  tierId: JackpotTierId
  className?: string
  /** Tighter type for game-tile jackpot pills */
  compact?: boolean
}

type FlowProps = ComponentProps<typeof NumberFlow>

/**
 * Rolling jackpot dollar display (`@number-flow/react`).
 * Use under `JackpotRollingTickProvider` for synced ticking; otherwise tick is 0 (static bases).
 */
export function JackpotRollAmountDisplay({ tierId, className, compact }: JackpotRollAmountDisplayProps) {
  const tick = useJackpotRollTick()
  const value = jackpotRollNumeric(tierId, tick)

  let props: FlowProps

  switch (tierId) {
    case 'minor':
      props = {
        value,
        format: {
          notation: 'standard',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        },
      }
      break
    case 'mega':
      props = {
        value,
        format: {
          notation: 'standard',
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        },
        suffix: 'M',
      }
      break
    case 'major':
    case 'daily':
      props = {
        value,
        format: {
          notation: 'standard',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
        suffix: 'K',
      }
      break
    default:
      props = {
        value,
        format: {
          notation: 'standard',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      }
      break
  }

  return (
    <span
      className={cn(
        'inline-flex tabular-nums tracking-tight text-inherit font-inherit leading-none',
        compact && 'text-[9px] font-bold tracking-tight',
        className
      )}
    >
      $<NumberFlow {...props} />
    </span>
  )
}

export type JackpotTileRollAmountProps = {
  tierId: JackpotTierId
  /** Main numeric line scale (tiles are tiny; carousel gets smaller type) */
  size?: 'carousel' | 'grid'
}

/**
 * Game-card jackpot line: bold white body + last digit superscript + hairline beneath,
 * matching common Megaways-style tiles (avoid full NumberFlow jitter on fractional cells).
 */
export function JackpotTileRollAmount({ tierId, size = 'carousel' }: JackpotTileRollAmountProps) {
  const tick = useJackpotRollTick()
  const value = jackpotRollNumeric(tierId, tick)
  const { dollarBody, supDigit, scaleSuffix } = formatJackpotTileAmountParts(tierId, value)

  const mainCls =
    size === 'grid'
      ? 'text-[12px] font-extrabold leading-none md:text-[13px]'
      : 'text-[11px] font-extrabold leading-none md:text-[12px]'
  const supCls =
    size === 'grid' ? 'translate-y-[-2px] text-[8px]' : 'translate-y-[-2px] text-[7px]'

  return (
    <span
      aria-label={`Jackpot amount ${dollarBody}${supDigit}${scaleSuffix}`}
      className="inline-flex flex-nowrap items-baseline justify-center gap-px tabular-nums tracking-tight text-white"
    >
      <span className={mainCls}>{dollarBody}</span>
      <span className={`inline-flex flex-col items-center font-extrabold leading-none ${supCls}`}>
        <span aria-hidden>{supDigit}</span>
        <span className="mt-px block h-[0.5px] w-[95%] min-w-[6px] max-w-[0.95em] bg-white/38" aria-hidden />
      </span>
      {scaleSuffix ? (
        <span className={cn(mainCls)}>{scaleSuffix}</span>
      ) : null}
    </span>
  )
}
