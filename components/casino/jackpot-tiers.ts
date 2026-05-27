export type JackpotTierId = 'mini' | 'minor' | 'major' | 'mega' | 'daily'

export type JackpotTierConfig = {
  id: JackpotTierId
  label: string
  /** Top accent / tag color (Tailwind-friendly hex) */
  accent: string
  /** Demo display amount */
  amountLabel: string
  /** Optional subline (e.g. daily must-drop) */
  subline?: string
}

/** Static demo values for design / prototype — replace with live feed later. */
export const JACKPOT_TIERS: readonly JackpotTierConfig[] = [
  { id: 'mini', label: 'MINI', accent: '#22c55e', amountLabel: '$493.04' },
  { id: 'minor', label: 'MINOR', accent: '#38bdf8', amountLabel: '$6,248' },
  { id: 'major', label: 'MAJOR', accent: '#a855f7', amountLabel: '$72.79K' },
  { id: 'mega', label: 'MEGA', accent: '#eab308', amountLabel: '$1.312M' },
  {
    id: 'daily',
    label: 'DAILY',
    accent: '#ef4444',
    amountLabel: '$12.89K',
    subline: 'MUST DROP - BEFORE MIDNIGHT',
  },
] as const

export function tierByIndex(i: number): JackpotTierConfig {
  return JACKPOT_TIERS[i % JACKPOT_TIERS.length]!
}
