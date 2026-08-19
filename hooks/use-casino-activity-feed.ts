'use client'

import { useEffect, useState } from 'react'
import {
  CASINO_ACTIVITY_GAMES,
  JACKPOT_ACTIVITY_ROWS,
  type CasinoActivityRow,
  type CasinoActivityTab,
} from '@/lib/casino/activity'

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function generateBetRow(tab: CasinoActivityTab): CasinoActivityRow {
  const users = [
    'Gurvinderdeo',
    'Eruyarr4545',
    'JadrankaB',
    'VUDEMMADHU',
    'Dzikiti123',
    'Player1',
    'GamerX',
    'LuckyBet',
    'HighRoller',
    'CasinoKing',
  ]
  const game =
    CASINO_ACTIVITY_GAMES[Math.floor(Math.random() * CASINO_ACTIVITY_GAMES.length)]
  const user = users[Math.floor(Math.random() * users.length)]
  const displayUser = Math.random() < 0.6 ? 'Hidden' : user

  const betRaw = Math.random() * 5000 + 10

  const betAmount = `$${betRaw.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  const winAmount =
    Math.random() > 0.35
      ? `$${(betRaw * (Math.random() * 5 + 1)).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : undefined

  return {
    id: `bet-${Date.now()}-${Math.random()}`,
    game: game.name,
    user: displayUser,
    time: formatTime(new Date()),
    betAmount,
    winAmount,
    gameImage: game.image,
  }
}

function seedRowsForTab(tab: CasinoActivityTab, maxRows: number): CasinoActivityRow[] {
  if (tab === 'Jackpot Winners') {
    return JACKPOT_ACTIVITY_ROWS.slice(0, maxRows)
  }
  return Array.from({ length: maxRows }, () => generateBetRow(tab))
}

export function useCasinoActivityFeed(
  tab: CasinoActivityTab,
  maxRows = 6
): CasinoActivityRow[] {
  const [rows, setRows] = useState<CasinoActivityRow[]>(() =>
    seedRowsForTab(tab, maxRows)
  )

  useEffect(() => {
    setRows(seedRowsForTab(tab, maxRows))
    if (tab === 'Jackpot Winners') return

    let timeoutId: ReturnType<typeof setTimeout>
    let cancelled = false

    const scheduleNext = () => {
      const delay = 550 + Math.random() * 550
      timeoutId = setTimeout(() => {
        if (cancelled) return
        setRows((prev) => [generateBetRow(tab), ...prev.slice(0, maxRows - 1)])
        scheduleNext()
      }, delay)
    }

    scheduleNext()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [tab, maxRows])

  return rows
}
