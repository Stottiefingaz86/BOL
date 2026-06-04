"use client"

import { useEffect } from "react"

type BalanceSetter = React.Dispatch<React.SetStateAction<number>>

function animateDisplayBalance(
  amount: number,
  setBalance: BalanceSetter,
  setDisplayBalance: BalanceSetter,
  duration: number
) {
  setBalance((prev) => {
    const newBal = +(prev + amount).toFixed(2)
    setDisplayBalance((currentDisplay) => {
      const start = currentDisplay
      const end = newBal
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayBalance(+(start + (end - start) * eased).toFixed(2))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
      return currentDisplay
    })

    return newBal
  })
}

/**
 * Listens for balance events and animates the header NumberFlow display.
 * - `rain:win` — chat rain payouts
 * - `notification:claim-reward` — VIP benefit claims (rakeback, etc.)
 *
 * Usage:
 *   useRainBalance(setBalance, setDisplayBalance)
 */
export function useRainBalance(
  setBalance: BalanceSetter,
  setDisplayBalance: BalanceSetter
) {
  useEffect(() => {
    const onRainWin = (e: Event) => {
      const amount = (e as CustomEvent).detail?.amount
      if (typeof amount === 'number' && amount > 0) {
        animateDisplayBalance(amount, setBalance, setDisplayBalance, 600)
      }
    }

    const onClaimReward = (e: Event) => {
      const amount = (e as CustomEvent<{ amount?: number }>).detail?.amount
      if (typeof amount === 'number' && amount > 0) {
        // Slower roll-up so it's visible while the VIP drawer stays open.
        animateDisplayBalance(amount, setBalance, setDisplayBalance, 1500)
      }
    }

    window.addEventListener('rain:win', onRainWin)
    window.addEventListener('notification:claim-reward', onClaimReward as EventListener)
    return () => {
      window.removeEventListener('rain:win', onRainWin)
      window.removeEventListener('notification:claim-reward', onClaimReward as EventListener)
    }
  }, [setBalance, setDisplayBalance])
}
