'use client'

import { tierByIndex } from '@/components/casino/jackpot-tiers'
import { JackpotTileJackpotChip } from '@/components/casino/jackpot-tile-jackpot-chip'

/** Bottom jackpot chip for full-width grid tiles on the Jackpots wallpaper page. */
export function JackpotGridPillOverlay({ index }: { index: number }) {
  const tier = tierByIndex(index)
  return <JackpotTileJackpotChip tier={tier} size="grid" />
}
