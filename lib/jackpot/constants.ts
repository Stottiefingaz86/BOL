export type JackpotTierId = 'mini' | 'minor' | 'major' | 'mega' | 'network'
export type JackpotTickerTierId = 'mini' | 'minor' | 'major' | 'mega' | 'daily'

export interface JackpotTierConfig {
  id: JackpotTierId
  label: string
  shortLabel: string
  description: string
  seedAmount: number
  tickMin: number
  tickMax: number
  accent: string
  accentMuted: string
  borderColor: string
}

export interface JackpotTickerTierConfig {
  id: JackpotTickerTierId
  label: string
  shortLabel: string
  seedAmount: number
  tickMin: number
  tickMax: number
  accent: string
  /** Opens must-drop drawer when true */
  opensDrawer?: boolean
}

export const JACKPOT_TICKER_TIERS: JackpotTickerTierConfig[] = [
  {
    id: 'mini',
    label: 'Mini',
    shortLabel: 'MINI',
    seedAmount: 485.73,
    tickMin: 0.01,
    tickMax: 0.12,
    accent: '#34d399',
  },
  {
    id: 'minor',
    label: 'Minor',
    shortLabel: 'MINOR',
    seedAmount: 6225,
    tickMin: 0.05,
    tickMax: 0.35,
    accent: '#38bdf8',
  },
  {
    id: 'major',
    label: 'Major',
    shortLabel: 'MAJOR',
    seedAmount: 72700,
    tickMin: 0.2,
    tickMax: 1.5,
    accent: '#a78bfa',
  },
  {
    id: 'mega',
    label: 'Mega',
    shortLabel: 'MEGA',
    seedAmount: 1312000,
    tickMin: 0.8,
    tickMax: 5,
    accent: '#fbbf24',
  },
  {
    id: 'daily',
    label: 'Daily',
    shortLabel: 'DAILY',
    seedAmount: 11890,
    tickMin: 0.1,
    tickMax: 0.65,
    accent: 'var(--ds-primary, #ee3536)',
    opensDrawer: true,
  },
]

export const JACKPOT_TIERS: JackpotTierConfig[] = [
  {
    id: 'mini',
    label: 'Mini',
    shortLabel: 'MINI',
    description: 'Hits often — keeps the action going',
    seedAmount: 485.73,
    tickMin: 0.01,
    tickMax: 0.12,
    accent: '#34d399',
    accentMuted: 'rgba(52, 211, 153, 0.15)',
    borderColor: 'rgba(52, 211, 153, 0.35)',
  },
  {
    id: 'minor',
    label: 'Minor',
    shortLabel: 'MINOR',
    description: 'Regular wins across the lobby',
    seedAmount: 6225,
    tickMin: 0.05,
    tickMax: 0.35,
    accent: '#38bdf8',
    accentMuted: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  {
    id: 'major',
    label: 'Major',
    shortLabel: 'MAJOR',
    description: 'Bigger pools, bigger moments',
    seedAmount: 72700,
    tickMin: 0.2,
    tickMax: 1.5,
    accent: '#a78bfa',
    accentMuted: 'rgba(167, 139, 250, 0.15)',
    borderColor: 'rgba(167, 139, 250, 0.35)',
  },
  {
    id: 'mega',
    label: 'Mega',
    shortLabel: 'MEGA',
    description: 'Life-changing top tier',
    seedAmount: 1312000,
    tickMin: 0.8,
    tickMax: 5,
    accent: '#fbbf24',
    accentMuted: 'rgba(251, 191, 36, 0.18)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  {
    id: 'network',
    label: 'Network',
    shortLabel: 'NETWORK',
    description: 'Shared across all brands',
    seedAmount: 2480000,
    tickMin: 2,
    tickMax: 12,
    accent: 'var(--ds-primary, #ee3536)',
    accentMuted: 'color-mix(in srgb, var(--ds-primary, #ee3536) 18%, transparent)',
    borderColor: 'color-mix(in srgb, var(--ds-primary, #ee3536) 45%, transparent)',
  },
]

export const JACKPOT_CONTRIBUTION_RATE = 0.01
export const JACKPOT_MIN_QUALIFYING_BET = 1
/** Added to base game stake per spin when opted into jackpots */
export const JACKPOT_PER_SPIN_ADDON = 0.1
/** Jackpots tab — only jackpot-network games, capped count */
export const JACKPOT_ELIGIBLE_GAME_LIMIT = 12

/** Compact display: $485.73 · $6,225 · $72.70K · $1.312M */
export function formatJackpotCompact(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000
    return `$${m >= 10 ? m.toFixed(2) : m.toFixed(3)}M`
  }
  if (value >= 10_000) {
    const k = value / 1_000
    return `$${k.toFixed(2)}K`
  }
  if (value >= 1_000) {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatJackpotAmount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Numeric value + suffix for NumberFlow compact display */
export function jackpotCompactParts(value: number): {
  prefix: string
  number: number
  suffix: string
  decimals: number
} {
  if (value >= 1_000_000) {
    const n = value / 1_000_000
    return {
      prefix: '$',
      number: n,
      suffix: 'M',
      decimals: n >= 10 ? 2 : 3,
    }
  }
  if (value >= 10_000) {
    return {
      prefix: '$',
      number: value / 1_000,
      suffix: 'K',
      decimals: 2,
    }
  }
  if (value >= 1_000) {
    return { prefix: '$', number: Math.round(value), suffix: '', decimals: 0 }
  }
  return { prefix: '$', number: value, suffix: '', decimals: 2 }
}
