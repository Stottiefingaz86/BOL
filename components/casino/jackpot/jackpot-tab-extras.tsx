'use client'

import { MustDropDrawer } from '@/components/casino/jackpot/must-drop-drawer'
import { JackpotTickerBar } from '@/components/casino/jackpot/jackpot-ticker-bar'
import { useJackpotTicker } from '@/components/casino/jackpot/use-jackpot-ticker'
import { cn } from '@/lib/utils'

/** Ticker (Daily = must-drop + drawer) — above the Jackpots page title */
export function JackpotTabTicker({ className }: { className?: string }) {
  useJackpotTicker(1400)

  return (
    <div
      className={cn(
        'w-full px-3 md:px-6 mb-3 md:mb-4 max-md:-mt-4 md:mt-0',
        className
      )}
    >
      <MustDropDrawer />
      <JackpotTickerBar className="w-full" />
    </div>
  )
}

/** @deprecated Activity feed is in the game grid; above-header UI is JackpotTabTicker */
export function JackpotTabExtras(_props: { isMobile?: boolean }) {
  return null
}
