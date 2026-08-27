'use client'

import { useState } from 'react'
import { IconSettings } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { LOBBY_STATS, type PokerTab } from '@/lib/poker-app/mock-data'
import { LobbyView } from '@/components/poker-app/lobby-view'
import { CashGamesView, TourneysView } from '@/components/poker-app/cash-tourneys-views'
import { SngView, WindfallsView } from '@/components/poker-app/sng-windfalls-views'
import { PokerOptionsDialog } from '@/components/poker-app/options-dialog'
import { pokerBtnAction, pokerHairline } from '@/components/poker-app/ui'

const TABS: { id: PokerTab; label: string }[] = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'cash', label: 'Cash' },
  { id: 'tourneys', label: 'Tourneys' },
  { id: 'sng', label: 'Sit & Go' },
  { id: 'windfalls', label: 'Windfalls' },
]

export function PokerAppShell() {
  const [tab, setTab] = useState<PokerTab>('lobby')
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [balance] = useState(0)
  const [inPlay] = useState(0)

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[var(--ds-page-bg,#1a1a1a)] text-[var(--ds-fg)] antialiased">
      <header
        className={cn(
          'flex h-12 shrink-0 items-center gap-4 bg-[var(--ds-surface-raised,#2d2d2d)] px-3',
          'border-b',
          pokerHairline
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-[var(--ds-primary,#ee3536)] text-[11px] font-bold text-white">
            B
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-[13px] font-semibold text-[var(--ds-fg)]">Brand A Poker</p>
            <p className="text-[11px] text-[var(--ds-fg-subtle)]">nitroace</p>
          </div>
        </div>

        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {TABS.map(({ id, label }) => {
            const active = tab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  'shrink-0 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                  'outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-primary,#ee3536)]/40',
                  active
                    ? 'bg-[var(--ds-primary,#ee3536)] text-white'
                    : 'text-[var(--ds-fg-muted)] hover:bg-white/[0.05] hover:text-[var(--ds-fg)]'
                )}
              >
                {label}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden text-right text-[11px] leading-tight sm:block">
            <p className="text-[var(--ds-fg-subtle)]">
              Balance{' '}
              <span className="font-semibold tabular-nums text-[var(--ds-fg)]">
                ${balance.toFixed(0)}
              </span>
            </p>
            <p className="text-[var(--ds-fg-subtle)]">
              In play{' '}
              <span className="font-semibold tabular-nums text-[var(--ds-fg)]">
                ${inPlay.toFixed(0)}
              </span>
            </p>
          </div>
          <button type="button" className={pokerBtnAction('h-8 px-3 text-[12px]')}>
            Deposit
          </button>
          <button
            type="button"
            aria-label="Settings"
            onClick={() => setOptionsOpen(true)}
            className="flex size-8 items-center justify-center rounded-lg text-[var(--ds-fg-subtle)] outline-none hover:bg-white/[0.05] hover:text-[var(--ds-fg)] focus-visible:ring-2 focus-visible:ring-[var(--ds-primary,#ee3536)]/40"
          >
            <IconSettings className="size-4" strokeWidth={1.6} />
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden">
        {tab === 'lobby' ? <LobbyView /> : null}
        {tab === 'cash' ? (
          <div className="h-full overflow-auto">
            <CashGamesView />
          </div>
        ) : null}
        {tab === 'tourneys' ? (
          <div className="h-full overflow-auto">
            <TourneysView />
          </div>
        ) : null}
        {tab === 'sng' ? (
          <div className="h-full overflow-auto">
            <SngView />
          </div>
        ) : null}
        {tab === 'windfalls' ? (
          <div className="h-full overflow-auto">
            <WindfallsView />
          </div>
        ) : null}
      </main>

      <footer
        className={cn(
          'flex h-8 shrink-0 items-center justify-between gap-3 bg-[var(--ds-surface-raised,#2d2d2d)] px-3 text-[11px] text-[var(--ds-fg-subtle)]',
          'border-t',
          pokerHairline
        )}
      >
        <p className="tabular-nums">
          {LOBBY_STATS.players} players · {LOBBY_STATS.tables} tables · {LOBBY_STATS.tournaments}{' '}
          tournaments
        </p>
        <p className="text-[var(--ds-fg-subtle)]">Brand A Poker</p>
      </footer>

      <PokerOptionsDialog open={optionsOpen} onOpenChange={setOptionsOpen} />
    </div>
  )
}
