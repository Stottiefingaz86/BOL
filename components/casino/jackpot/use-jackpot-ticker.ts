'use client'

import { useEffect } from 'react'
import { useJackpotStore } from '@/lib/store/jackpotStore'

export function useJackpotTicker(intervalMs = 1200) {
  const tickAmounts = useJackpotStore((s) => s.tickAmounts)

  useEffect(() => {
    const id = setInterval(tickAmounts, intervalMs)
    return () => clearInterval(id)
  }, [tickAmounts, intervalMs])
}
