'use client'

import { JackpotCountersStrip } from '@/components/casino/jackpot-counters-strip'
import { JackpotOptInToggle } from '@/components/casino/jackpot-opt-in-toggle'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export type JackpotCategoryWallpaperBarProps = {
  isMobile: boolean
  jackpotOptIn: boolean
  onJackpotOptInChange: (next: boolean) => void
}

/**
 * Jackpots wallpaper masthead — tier strip + title row (matches For You / Megaways section headers).
 */
export function JackpotCategoryWallpaperBar({
  isMobile,
  jackpotOptIn,
  onJackpotOptInChange,
}: JackpotCategoryWallpaperBarProps) {
  return (
    <div className={cn('mb-6', isMobile ? 'px-3' : 'px-6')}>
      <JackpotCountersStrip className="mb-5" />
      <div className="flex flex-wrap items-center gap-3">
        <motion.h2
          className="text-lg font-semibold text-white md:text-xl"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          Jackpots
        </motion.h2>
        <JackpotOptInToggle variant="compact" checked={jackpotOptIn} onCheckedChange={onJackpotOptInChange} />
      </div>
    </div>
  )
}
