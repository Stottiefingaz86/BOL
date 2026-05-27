import type { JackpotTierId } from '@/lib/jackpot/constants'

const NETWORK_TIERS: JackpotTierId[] = ['mini', 'minor', 'major', 'mega']

/** Deterministic: ~72% of games participate in the jackpot network */
export function isJackpotNetworkGame(index: number): boolean {
  return (index * 13 + 7) % 10 < 7
}

/** Highest tier this game can contribute toward (for tile badge) */
export function getJackpotNetworkTier(index: number): JackpotTierId | null {
  if (!isJackpotNetworkGame(index)) return null
  const roll = (index * 17 + 3) % 100
  if (roll < 40) return 'mini'
  if (roll < 65) return 'minor'
  if (roll < 85) return 'major'
  return 'mega'
}
