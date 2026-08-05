'use client'

import { useMemo, useState } from 'react'
import {
  IconEye,
  IconFilter,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { CASH_ROWS, TOURNEY_ROWS, type TourneyRow } from '@/lib/poker-app/mock-data'
import {
  pokerBtnAction,
  pokerBtnGhost,
  pokerBtnOutline,
  pokerHairline,
  pokerInset,
  pokerSurface,
  statusLabel,
  statusTone,
} from '@/components/poker-app/ui'
import { PokerFilterDialog } from '@/components/poker-app/filter-dialog'

const CASH_FILTERS = ['Boost', "Hold'em", 'Omaha', 'More'] as const
const TOURNEY_FILTERS = ['All games', "Hold'em", 'Main events', 'Satellites'] as const

function MoneyToggle({
  value,
  onChange,
}: {
  value: 'real' | 'play'
  onChange: (v: 'real' | 'play') => void
}) {
  return (
    <div className={cn('inline-flex p-0.5', pokerInset)}>
      {(['real', 'play'] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors',
            value === opt
              ? 'bg-[var(--ds-primary,#ee3536)] text-white'
              : 'text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg-muted)]'
          )}
        >
          {opt === 'real' ? 'Real money' : 'Play money'}
        </button>
      ))}
    </div>
  )
}

function SubTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            'rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors',
            value === tab
              ? 'bg-[var(--ds-primary,#ee3536)] text-white'
              : 'text-[var(--ds-fg-subtle)] hover:bg-white/[0.04] hover:text-[var(--ds-fg-muted)]'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export function CashGamesView() {
  const [sub, setSub] = useState<string>('Boost')
  const [money, setMoney] = useState<'real' | 'play'>('real')
  const [tablesToJoin, setTablesToJoin] = useState<Record<string, number>>({})

  return (
    <div className="flex h-full min-h-0 flex-col gap-0 p-0 md:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={cn('flex flex-wrap items-center justify-between gap-3 px-4 py-3', 'border-b', pokerHairline)}>
          <SubTabs tabs={CASH_FILTERS} value={sub} onChange={setSub} />
          <div className="flex flex-wrap items-center gap-2">
            <MoneyToggle value={money} onChange={setMoney} />
            <button type="button" className={pokerBtnGhost('gap-1.5 text-[12px]')}>
              <IconFilter className="size-3.5" strokeWidth={1.5} />
              Filter
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className={cn('flex items-center justify-between px-4 py-2', 'border-b', pokerHairline)}>
            <label className="flex items-center gap-2 text-[12px] text-zinc-500">
              <input type="checkbox" defaultChecked className="accent-zinc-400" />
              Show empty
            </label>
            <button type="button" className={pokerBtnGhost('size-7 p-0')} aria-label="Refresh">
              <IconRefresh className="size-3.5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
              <thead>
                <tr className={cn('border-b text-[11px] text-zinc-500', pokerHairline)}>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Game</th>
                  <th className="px-4 py-2.5 font-medium">Stakes</th>
                  <th className="px-4 py-2.5 font-medium">Players</th>
                  <th className="px-4 py-2.5 font-medium">Tables</th>
                  <th className="px-4 py-2.5 font-medium" />
                </tr>
              </thead>
              <tbody>
                {CASH_ROWS.map((row) => {
                  const qty = tablesToJoin[row.id] ?? 1
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        'border-b transition-colors hover:bg-white/[0.02]',
                        pokerHairline,
                        row.featured && 'bg-white/[0.015]'
                      )}
                    >
                      <td className="px-4 py-2.5">
                        <span className="inline-flex size-6 items-center justify-center rounded-md border border-white/[0.08] font-mono text-[11px] text-zinc-300">
                          {row.max}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-zinc-100">{row.game}</td>
                      <td className="px-4 py-2.5 font-mono text-[12px] tabular-nums text-zinc-400">
                        {row.stakes}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[12px] tabular-nums text-zinc-500">
                        {row.players}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className={cn('inline-flex h-7 items-center gap-1 rounded-md px-1', pokerInset)}>
                          <button
                            type="button"
                            className="flex size-5 items-center justify-center text-zinc-500 hover:text-zinc-200"
                            onClick={() =>
                              setTablesToJoin((s) => ({ ...s, [row.id]: Math.max(1, qty - 1) }))
                            }
                          >
                            <IconMinus className="size-3" />
                          </button>
                          <span className="w-4 text-center font-mono text-[12px] tabular-nums text-zinc-200">
                            {qty}
                          </span>
                          <button
                            type="button"
                            className="flex size-5 items-center justify-center text-zinc-500 hover:text-zinc-200"
                            onClick={() =>
                              setTablesToJoin((s) => ({ ...s, [row.id]: Math.min(6, qty + 1) }))
                            }
                          >
                            <IconPlus className="size-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            className={pokerBtnAction('h-7 px-2.5 text-[12px]')}
                          >
                            Join
                          </button>
                          <button
                            type="button"
                            className={pokerBtnOutline('h-7 w-7 p-0')}
                            aria-label="Watch"
                          >
                            <IconEye className="size-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <aside className={cn('flex w-full shrink-0 flex-col border-t md:w-[260px] md:border-l md:border-t-0', pokerHairline)}>
        <div className={cn('px-4 py-4', 'border-b', pokerHairline)}>
          <p className="text-[12px] text-zinc-500">Bad Beat Jackpot</p>
          <p className="mt-1 font-mono text-[24px] font-medium tracking-tight tabular-nums text-zinc-50">
            $18,033
          </p>
          <p className="mt-1 text-[12px] text-zinc-600">NLHE $50 · live</p>
        </div>
        <div className="flex flex-1 flex-col px-4 py-4">
          <p className="text-[13px] font-medium text-zinc-200">Mystery Bounty</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500">
            Progressive bounty pool across eligible cash tables.
          </p>
          <button type="button" className={pokerBtnOutline('mt-4 self-start h-7 text-[12px]')}>
            Learn more
          </button>
        </div>
      </aside>
    </div>
  )
}

export function TourneysView() {
  const [sub, setSub] = useState('All games')
  const [money, setMoney] = useState<'real' | 'play'>('real')
  const [selectedId, setSelectedId] = useState(TOURNEY_ROWS[0]?.id)
  const [filterOpen, setFilterOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = useMemo(
    () => TOURNEY_ROWS.find((r) => r.id === selectedId) ?? TOURNEY_ROWS[0],
    [selectedId]
  )

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TOURNEY_ROWS
    return TOURNEY_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.game.toLowerCase().includes(q) ||
        r.buyIn.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={cn('flex flex-wrap items-center justify-between gap-3 px-4 py-3', 'border-b', pokerHairline)}>
        <SubTabs tabs={TOURNEY_FILTERS} value={sub} onChange={setSub} />
        <div className="flex flex-wrap items-center gap-2">
          <MoneyToggle value={money} onChange={setMoney} />
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={pokerBtnGhost('gap-1.5 text-[12px]')}
          >
            <IconFilter className="size-3.5" strokeWidth={1.5} />
            Filter
          </button>
          <div className={cn('flex h-8 w-[200px] items-center gap-2 rounded-md px-2.5', pokerInset)}>
            <IconSearch className="size-3.5 shrink-0 text-zinc-600" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tournaments"
              className="min-w-0 flex-1 bg-transparent text-[12px] text-zinc-200 outline-none placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead className="sticky top-0 z-[1] bg-black">
              <tr className={cn('border-b text-[11px] text-zinc-500', pokerHairline)}>
                <th className="px-4 py-2.5 font-medium">Start</th>
                <th className="px-4 py-2.5 font-medium">Game</th>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Buy-in</th>
                <th className="px-4 py-2.5 font-medium">Players</th>
                <th className="px-4 py-2.5 font-medium">Prize</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <TourneyTableRow
                  key={row.id}
                  row={row}
                  selected={row.id === selected?.id}
                  onSelect={() => setSelectedId(row.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {selected ? (
          <aside className={cn('flex w-full shrink-0 flex-col border-t lg:w-[280px] lg:border-l lg:border-t-0', pokerHairline)}>
            <div className={cn('px-4 py-3', 'border-b', pokerHairline)}>
              <p className="text-[13px] font-medium text-zinc-100">{selected.name}</p>
              <p className="mt-0.5 text-[12px] text-zinc-500">{selected.game}</p>
            </div>
            <dl className="space-y-2.5 px-4 py-4 text-[12px]">
              {[
                ['Start', selected.start],
                ['Buy-in', selected.buyIn],
                ['Players', selected.players],
                ['Prize pool', selected.prize],
                ['Status', statusLabel(selected.status)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3">
                  <dt className="text-zinc-500">{k}</dt>
                  <dd className="text-right font-mono text-[12px] text-zinc-200">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="px-4 text-[12px] leading-relaxed text-zinc-600">
              Qualify via satellites or buy in directly. Late registration through level 6.
            </p>
            <div className={cn('mt-auto space-y-2 p-4', 'border-t', pokerHairline)}>
              <button type="button" className={pokerBtnAction('w-full')}>
                Register {selected.buyIn === 'Ticket' ? 'by ticket' : selected.buyIn}
              </button>
              <button type="button" className={pokerBtnOutline('w-full')}>
                Tournament lobby
              </button>
            </div>
          </aside>
        ) : null}
      </div>

      <PokerFilterDialog open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  )
}

function TourneyTableRow({
  row,
  selected,
  onSelect,
}: {
  row: TourneyRow
  selected: boolean
  onSelect: () => void
}) {
  return (
    <tr
      onClick={onSelect}
      className={cn(
        'cursor-pointer border-b transition-colors',
        pokerHairline,
        selected
          ? 'bg-white/[0.03] shadow-[inset_2px_0_0_0_rgba(255,255,255,0.45)]'
          : 'hover:bg-white/[0.02]'
      )}
    >
      <td className="px-4 py-2.5 font-mono text-[12px] text-zinc-500">{row.start}</td>
      <td className="px-4 py-2.5 text-zinc-400">{row.game}</td>
      <td className="px-4 py-2.5 font-medium text-zinc-100">{row.name}</td>
      <td className="px-4 py-2.5 font-mono text-[12px] tabular-nums text-zinc-400">{row.buyIn}</td>
      <td className="px-4 py-2.5 font-mono text-[12px] tabular-nums text-zinc-500">{row.players}</td>
      <td className="px-4 py-2.5 font-mono text-[12px] tabular-nums text-zinc-300">{row.prize}</td>
      <td className="px-4 py-2.5">
        <span className={cn('text-[12px] font-medium', statusTone(row.status))}>
          {statusLabel(row.status)}
        </span>
      </td>
    </tr>
  )
}
