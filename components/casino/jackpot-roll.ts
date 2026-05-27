import type { JackpotTierId } from '@/components/casino/jackpot-tiers'

/** Base display numbers (before $ / K / M); tick steps keep values climbing indefinitely. */
const ROLL_BASE: Record<JackpotTierId, number> = {
  mini: 493.04,
  minor: 6248,
  /** Shown as $XK */
  major: 72.79,
  /** Shown as $X.M */
  mega: 1.312,
  /** Shown as $XK */
  daily: 12.89,
}

const ROLL_STEP: Record<JackpotTierId, number> = {
  mini: 0.019,
  minor: 1.85,
  major: 0.003,
  mega: 0.000045,
  daily: 0.007,
}

export function jackpotRollNumeric(tier: JackpotTierId, tick: number): number {
  const base = ROLL_BASE[tier]
  const step = ROLL_STEP[tier]
  const raw = base + tick * step

  switch (tier) {
    case 'minor':
      return Math.round(raw)
    case 'mega':
      return Number(raw.toFixed(3))
    default:
      return Number(raw.toFixed(2))
  }
}

/** Split display for game-tile chips: big body + superscript “ticker” digit (Megaways-style). */
export type JackpotTileAmountParts = {
  /** Includes leading `$`, excludes last digit */
  dollarBody: string
  /** Last numeric digit before K/M suffix */
  supDigit: string
  scaleSuffix: '' | 'K' | 'M'
}

export function formatJackpotTileAmountParts(tier: JackpotTierId, value: number): JackpotTileAmountParts {
  let scaleSuffix: '' | 'K' | 'M' = ''
  let numCore: string

  switch (tier) {
    case 'minor':
      numCore = Math.round(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      break
    case 'mega':
      scaleSuffix = 'M'
      numCore = value.toFixed(3)
      break
    case 'major':
    case 'daily':
      scaleSuffix = 'K'
      numCore = value.toFixed(2)
      break
    default:
      numCore = value.toFixed(2)
      break
  }

  let i = numCore.length - 1
  while (i >= 0 && !/\d/.test(numCore[i] ?? '')) i -= 1

  const supDigit = i >= 0 ? (numCore[i] as string) : '0'
  const beforeDigits = i >= 0 ? numCore.slice(0, i) : numCore

  return {
    dollarBody: `$${beforeDigits}`,
    supDigit,
    scaleSuffix,
  }
}
