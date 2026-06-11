'use client'

import { useEffect, useState } from 'react'
import { useJackpotStore } from '@/lib/store/jackpotStore'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function useMegaTickerDisplayAmount() {
  const megaWinRoll = useJackpotStore((s) => s.megaWinRoll)
  const tickerMega = useJackpotStore((s) => s.tickerAmounts.mega)
  const completeMegaWinRoll = useJackpotStore((s) => s.completeMegaWinRoll)
  const [displayAmount, setDisplayAmount] = useState(tickerMega)

  useEffect(() => {
    if (!megaWinRoll) {
      setDisplayAmount(tickerMega)
      return
    }

    let frame = 0
    const animate = () => {
      const elapsed = Date.now() - megaWinRoll.startedAt
      const progress = Math.min(1, Math.max(0, elapsed / megaWinRoll.durationMs))
      const eased = easeOutCubic(progress)
      const next =
        megaWinRoll.fromAmount - eased * megaWinRoll.winAmount
      setDisplayAmount(next)

      if (progress >= 1) {
        completeMegaWinRoll()
        return
      }

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [megaWinRoll, tickerMega, completeMegaWinRoll])

  return {
    amount: displayAmount,
    isRolling: megaWinRoll != null,
  }
}
