'use client'

import { JackpotLauncherMarquee } from '@/components/casino/jackpot/jackpot-launcher-marquee'
import { cn } from '@/lib/utils'

interface GameLauncherJackpotRowProps {
  visible: boolean
  className?: string
}

export function GameLauncherJackpotRow({
  visible,
  className,
}: GameLauncherJackpotRowProps) {
  if (!visible) return null

  return (
    <div className={cn('border-t border-white/10 bg-black/10', className)}>
      <JackpotLauncherMarquee className="w-full py-0" />
    </div>
  )
}
