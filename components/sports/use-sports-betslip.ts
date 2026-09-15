'use client'

import { useMemo } from 'react'
import { useBetslipStore } from '@/lib/store/betslipStore'
import type { OddsCell, SportsEvent } from './mock-data'

/** Toggle odds cells in the global betslip — shared by the sports home rows and the event page markets. */
export function useSportsBetslip() {
  const bets = useBetslipStore((s) => s.bets)
  const addBet = useBetslipStore((s) => s.addBet)
  const removeBet = useBetslipStore((s) => s.removeBet)
  const setOpen = useBetslipStore((s) => s.setOpen)
  const setMinimized = useBetslipStore((s) => s.setMinimized)
  const setManuallyClosed = useBetslipStore((s) => s.setManuallyClosed)

  const selectedIds = useMemo(() => new Set(bets.map((b) => b.id)), [bets])

  const toggleOdds = (cell: OddsCell, event: SportsEvent, marketTitle: string) => {
    if (selectedIds.has(cell.id)) {
      removeBet(cell.id)
      return
    }
    addBet({
      id: cell.id,
      eventId: hashEventId(event.id),
      eventName: `${event.home.name} vs ${event.away.name}`,
      marketTitle,
      selection: cell.line ?? cell.odds,
      odds: cell.odds,
      stake: 0,
    })
    setManuallyClosed(false)
    setMinimized(false)
    setOpen(true)
  }

  return { selectedIds, toggleOdds }
}

export function hashEventId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h)
}
