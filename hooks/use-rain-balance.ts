"use client"

import { useEffect } from "react"

/**
 * Listens for `rain:win` events dispatched by the chat simulator
 * and tops up the page's displayed balance when the user wins.
 *
 * Usage:
 *   useRainBalance(setBalance, setDisplayBalance)
 */
export function useRainBalance(
  setBalance: React.Dispatch<React.SetStateAction<number>>,
  setDisplayBalance: React.Dispatch<React.SetStateAction<number>>
) {
  useEffect(() => {
    const handler = (e: Event) => {
      const amount = (e as CustomEvent).detail?.amount
      if (typeof amount === 'number' && amount > 0) {
        setBalance((prev) => {
          const newBal = +(prev + amount).toFixed(2)
          // Animate the display balance from current → new
          setDisplayBalance((currentDisplay) => {
            const start = currentDisplay
            const end = newBal
            const duration = 600
            const startTime = performance.now()

            const animate = (now: number) => {
              const elapsed = now - startTime
              const progress = Math.min(elapsed / duration, 1)
              // ease-out
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = start + (end - start) * eased
              setDisplayBalance(+current.toFixed(2))
              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }
            requestAnimationFrame(animate)
            return currentDisplay // return current value, animation will update
          })

          return newBal
        })
      }
    }

    window.addEventListener('rain:win', handler)
    return () => window.removeEventListener('rain:win', handler)
  }, [setBalance, setDisplayBalance])
}
