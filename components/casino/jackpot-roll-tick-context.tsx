'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@number-flow/react'

const JackpotRollTickContext = createContext(0)

const TICK_INTERVAL_MS = 260

/** Drives synced “always ticking” jackpot amounts wherever this wraps the UI. */
export function JackpotRollingTickProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => {
      setTick((t) => t + 1)
    }, TICK_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion])

  return (
    <JackpotRollTickContext.Provider value={reduceMotion ? 0 : tick}>{children}</JackpotRollTickContext.Provider>
  )
}

export function useJackpotRollTick() {
  return useContext(JackpotRollTickContext)
}
