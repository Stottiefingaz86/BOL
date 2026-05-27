'use client'

import { JackpotTickerBar } from '@/components/casino/jackpot/jackpot-ticker-bar'
import { MustDropDrawer } from '@/components/casino/jackpot/must-drop-drawer'
import { useJackpotTicker } from '@/components/casino/jackpot/use-jackpot-ticker'
import { cn } from '@/lib/utils'

/** Ticker strip only — place under banners; game carousel lives in page layout. */
interface JackpotTickerStripProps {
  isMobile?: boolean
  className?: string
}

export function JackpotTickerStrip({ isMobile, className }: JackpotTickerStripProps) {
  useJackpotTicker(1400)

  return (
    <div
      className={cn(
        'relative z-0 max-w-[1400px] mx-auto w-full',
        isMobile ? 'px-3' : 'px-6',
        className
      )}
    >
      <MustDropDrawer />
      <JackpotTickerBar />
    </div>
  )
}

/** @deprecated Use JackpotTickerStrip under banners + standard game carousel in page */
export const JackpotCarouselSection = JackpotTickerStrip
