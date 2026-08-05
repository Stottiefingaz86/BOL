'use client'

import { useState } from 'react'
import { IconUsers } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { SNG_ROWS, WINDFALL_CARDS } from '@/lib/poker-app/mock-data'
import {
  pokerBtnAction,
  pokerBtnOutline,
  pokerHairline,
  pokerSurface,
} from '@/components/poker-app/ui'

export function SngView() {
  const [selectedId, setSelectedId] = useState(SNG_ROWS[0]?.id)
  const selected = SNG_ROWS.find((r) => r.id === selectedId) ?? SNG_ROWS[0]

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-5 md:flex-row md:p-6">
      <div className={cn('min-h-0 min-w-0 flex-1 overflow-hidden', pokerSurface)}>
        <div className="overflow-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
            <thead>
              <tr className={cn('border-b text-[11px] uppercase tracking-wide text-white/35', pokerHairline)}>
                <th className="px-3 py-2.5 font-medium">Name</th>
                <th className="px-3 py-2.5 font-medium">Game</th>
                <th className="px-3 py-2.5 font-medium">Buy-in</th>
                <th className="px-3 py-2.5 font-medium">Seats</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {SNG_ROWS.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={cn(
                    'cursor-pointer border-b transition-colors',
                    pokerHairline,
                    row.id === selected?.id
                      ? 'bg-white/[0.04] shadow-[inset_2px_0_0_0_rgba(255,255,255,0.35)]'
                      : 'hover:bg-white/[0.03]'
                  )}
                >
                  <td className="px-3 py-2.5 font-medium text-white">{row.name}</td>
                  <td className="px-3 py-2.5 text-white/60">{row.game}</td>
                  <td className="px-3 py-2.5 tabular-nums text-white/75">{row.buyIn}</td>
                  <td className="px-3 py-2.5 tabular-nums text-white/55">{row.seats}</td>
                  <td className="px-3 py-2.5 text-white/50">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <aside className={cn('flex w-full shrink-0 flex-col md:w-[300px]', pokerSurface)}>
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-semibold text-white">{selected.name}</p>
            <p className="mt-0.5 text-[12px] text-white/45">{selected.game}</p>
          </div>
          <dl className="space-y-2.5 px-4 py-4 text-[12px]">
            {[
              ['Buy-in', selected.buyIn],
              ['Type', 'Sit & Go'],
              ['Seats', selected.seats],
              ['Status', selected.status],
              ['Starting stack', '1,500'],
              ['Blind levels', '4 minutes'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-white/40">{k}</dt>
                <dd className="font-medium text-white/85">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto space-y-2 border-t border-white/[0.06] p-4">
            <button type="button" className={pokerBtnAction('w-full')}>
              Register {selected.buyIn}
            </button>
            <button type="button" className={pokerBtnOutline('w-full')}>
              Tournament lobby
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  )
}

export function WindfallsView() {
  const [selectedId, setSelectedId] = useState(WINDFALL_CARDS[0]?.id)
  const selected = WINDFALL_CARDS.find((c) => c.id === selectedId) ?? WINDFALL_CARDS[0]

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-5 md:flex-row md:p-6">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {WINDFALL_CARDS.map((card) => {
            const active = card.id === selectedId
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedId(card.id)}
                className={cn(
                  'flex flex-col overflow-hidden text-left transition-colors',
                  pokerSurface,
                  active
                    ? 'ring-1 ring-white/25'
                    : 'hover:bg-[#1f1f1f]'
                )}
              >
                <div className="border-b border-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/45">
                  {card.game}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-3.5">
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-white">{card.buyIn}</p>
                    <p className="mt-1 text-[12px] text-white/45">
                      Win up to <span className="font-semibold text-white/80">{card.winUpTo}</span>
                    </p>
                  </div>
                  <div
                    aria-hidden
                    className="mx-auto h-10 w-16 rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(34,120,70,0.55),rgba(12,40,24,0.9))] shadow-[0_0_18px_rgba(40,140,80,0.25)]"
                  />
                  <p className="mt-auto flex items-center gap-1.5 text-[12px] text-white/45">
                    <IconUsers className="size-3.5" strokeWidth={1.8} />
                    {card.seated}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className={cn('overflow-hidden p-5', pokerSurface)}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Windfalls Sit & Go Jackpots
          </p>
          <p className="mt-1 max-w-xl text-sm text-white/55">
            Three-handed SNGs with a shared progressive jackpot. Same table glow — quieter lobby chrome.
          </p>
        </div>
      </div>

      <aside className={cn('flex w-full shrink-0 flex-col md:w-[280px]', pokerSurface)}>
        <div className="border-b border-white/[0.06] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
            Recent winners
          </p>
        </div>
        <ul className="flex-1 space-y-0 overflow-auto">
          {[
            { ago: '22h ago', amount: '$2,400', name: 'acehigh' },
            { ago: '1d ago', amount: '$890', name: 'riverbed' },
            { ago: '1d ago', amount: '$1,120', name: 'foldequity' },
            { ago: '2d ago', amount: '$3,050', name: 'nitroace' },
          ].map((w) => (
            <li
              key={w.name + w.ago}
              className={cn('flex items-center justify-between gap-3 px-4 py-3', 'border-b', pokerHairline)}
            >
              <div className="flex items-center gap-2.5">
                <span className="size-8 rounded-full bg-white/[0.06] ring-1 ring-white/10" />
                <div>
                  <p className="text-[13px] font-medium text-white/85">{w.name}</p>
                  <p className="text-[11px] text-white/35">{w.ago}</p>
                </div>
              </div>
              <p className="text-[13px] font-semibold tabular-nums text-white/90">{w.amount}</p>
            </li>
          ))}
        </ul>
        {selected ? (
          <div className="border-t border-white/[0.06] p-4">
            <button type="button" className={pokerBtnAction('w-full')}>
              Register {selected.buyIn}
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
