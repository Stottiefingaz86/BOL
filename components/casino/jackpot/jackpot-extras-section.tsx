'use client'

import { JackpotLauncherMarquee } from '@/components/casino/jackpot/jackpot-launcher-marquee'
import { cn } from '@/lib/utils'

interface JackpotExtrasSectionProps {
  className?: string
  isMobile?: boolean
}

/**
 * Jackpots tab — Must Drop + Mini–Mega in one inline strip (matches game launcher).
 */
export function JackpotExtrasSection({ className }: JackpotExtrasSectionProps) {
  return (
    <JackpotLauncherMarquee
      className={cn(
        'overflow-hidden rounded-xl border border-white/10 bg-black/20',
        className
      )}
    />
  )
}
