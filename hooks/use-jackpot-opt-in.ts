'use client'

import { useCallback, useEffect, useState } from 'react'

export const JACKPOT_OPT_IN_STORAGE_KEY = 'bol-casino-jackpot-opt-in'

/** Persists jackpot “play for jackpot” preference for casino + launcher. */
export function useJackpotOptIn() {
  const [optIn, setOptInState] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(JACKPOT_OPT_IN_STORAGE_KEY)
      if (stored === 'true') setOptInState(true)
    } catch {
      /* ignore */
    }
  }, [])

  const setOptIn = useCallback((next: boolean) => {
    setOptInState(next)
    try {
      window.localStorage.setItem(JACKPOT_OPT_IN_STORAGE_KEY, next ? 'true' : 'false')
    } catch {
      /* ignore */
    }
  }, [])

  return [optIn, setOptIn] as const
}
