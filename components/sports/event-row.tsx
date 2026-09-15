'use client'

import type { CSSProperties } from 'react'
import { IconChevronRight, IconPlayerPlayFilled } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { OddsButton } from './odds-button'
import type { MarketColumn, OddsCell, SportsEvent } from './mock-data'

interface EventRowProps {
  event: SportsEvent
  layout?: 'desktop' | 'mobile'
  selectedIds?: Set<string>
  onSelectOdds?: (cell: OddsCell, event: SportsEvent, marketTitle: string) => void
  onOpen?: (event: SportsEvent) => void
  className?: string
}

/**
 * Figma `event-row/scoreboard` + `event-row/picks`.
 * Desktop: [status | teams+scores | ›] then a horizontally scrolling strip of market columns.
 * Mobile:  same, but markets wrap onto a strip below the teams.
 */
export function EventRow({
  event,
  layout = 'desktop',
  selectedIds,
  onSelectOdds,
  onOpen,
  className,
}: EventRowProps) {
  const isSelected = (id: string) => selectedIds?.has(id) ?? false

  const markets = (
    <div
      className={cn(
        'flex items-end gap-1 overflow-x-auto scrollbar-hide',
        layout === 'desktop' ? 'pb-3 pl-3 pt-1' : 'pb-3 pl-1 pr-3'
      )}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {event.markets.map((market) => (
        <MarketCol
          key={market.id}
          market={market}
          isSelected={isSelected}
          onSelect={(cell) => onSelectOdds?.(cell, event, market.name)}
        />
      ))}
    </div>
  )

  if (layout === 'mobile') {
    return (
      <div className={cn('relative flex flex-col', className)} style={liveTint(event.isLive)}>
        {/* Scoreboard */}
        <div className="flex items-center gap-2 px-3 pt-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 py-2">
            <StatusColumn clock={event.clock} clockSub={event.clockSub} isLive={event.isLive} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <TeamLine name={event.home.name} logo={event.home.logo} score={event.home.score} />
              <TeamLine name={event.away.name} logo={event.away.logo} score={event.away.score} />
            </div>
          </div>
          <button
            type="button"
            aria-label="Open event"
            onClick={() => onOpen?.(event)}
            className="flex shrink-0 items-center justify-center rounded-lg p-1.5 text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
          >
            <IconChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Picks — team abbreviations pinned left, market columns scroll */}
        <div className="flex items-end">
          <div className="flex shrink-0 flex-col gap-1 pb-3 pl-3">
            <TeamAbbr code={event.home.code} logo={event.home.logo} />
            <TeamAbbr code={event.away.code} logo={event.away.logo} />
          </div>
          <div className="min-w-0 flex-1">{markets}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative flex items-stretch gap-2 px-4', className)} style={liveTint(event.isLive)}>
      {/* Status + teams + chevron */}
      <div className="relative flex w-[309px] shrink-0 items-center gap-2 pt-5">
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 py-3">
          <StatusColumn clock={event.clock} clockSub={event.clockSub} isLive={event.isLive} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <TeamLine name={event.home.name} logo={event.home.logo} score={event.home.score} />
            <TeamLine name={event.away.name} logo={event.away.logo} score={event.away.score} />
          </div>
        </div>
        <button
          type="button"
          aria-label="Open event"
          onClick={() => onOpen?.(event)}
          className="flex shrink-0 items-center justify-center rounded-lg p-1.5 text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
        >
          <IconChevronRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Markets */}
      <div className="relative flex min-w-0 flex-1 items-end overflow-hidden">{markets}</div>
    </div>
  )
}

/** Soft red glow anchored to the left edge; fades in every direction so it never forms an edge/line. */
function liveTint(isLive: boolean): CSSProperties | undefined {
  return isLive
    ? {
        backgroundImage:
          'radial-gradient(ellipse 260px 70% at 0% 50%, rgba(238,53,54,0.07) 0%, rgba(238,53,54,0.025) 45%, rgba(238,53,54,0) 100%)',
      }
    : undefined
}

/** Mobile picks gutter — logo above abbreviation, one per participant, aligned with the 42px odds buttons. */
function TeamAbbr({ code, logo }: { code: string; logo: string }) {
  return (
    <div className="flex h-[42px] w-11 flex-col items-center justify-center gap-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="" className="size-5 object-contain" />
      <span className="text-[11px] font-semibold leading-3 text-[var(--ds-fg)]">{code}</span>
    </div>
  )
}

function StatusColumn({
  clock,
  clockSub,
  isLive,
}: {
  clock: string
  clockSub?: string
  isLive: boolean
}) {
  return (
    <div className="relative flex w-14 shrink-0 flex-col items-center justify-center gap-0.5">
      <span
        className={cn(
          'relative truncate text-center text-[10px] font-medium leading-[14px]',
          isLive ? 'text-[#e87c79]' : 'text-[var(--ds-fg-muted)]'
        )}
      >
        {clock}
      </span>
      {isLive ? (
        <span className="relative flex size-4 items-center justify-center rounded-full bg-[#3a3a3a] text-white">
          <IconPlayerPlayFilled className="size-2" />
        </span>
      ) : clockSub ? (
        <span className="relative text-center text-[10px] leading-[14px] text-[var(--ds-fg-muted)]">{clockSub}</span>
      ) : null}
    </div>
  )
}

function TeamLine({ name, logo, score }: { name: string; logo: string; score?: number }) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" className="size-5 shrink-0 object-contain" />
        <span className="min-w-0 max-w-[197px] flex-1 truncate text-xs font-medium leading-4 text-[var(--ds-fg)]">
          {name}
        </span>
      </div>
      {typeof score === 'number' && (
        <span className="shrink-0 text-center text-xs font-medium leading-4 tabular-nums text-[var(--ds-fg)]">
          {score}
        </span>
      )}
    </div>
  )
}

function MarketCol({
  market,
  isSelected,
  onSelect,
}: {
  market: MarketColumn
  isSelected: (id: string) => boolean
  onSelect: (cell: OddsCell) => void
}) {
  return (
    <div className="flex shrink-0 flex-col items-start justify-end gap-0.5">
      <span className="w-[77px] text-center text-[10px] leading-[14px] text-[var(--ds-fg-muted)]">{market.name}</span>
      <div className="flex flex-col gap-1">
        {market.cells.map((cell) => (
          <OddsButton
            key={cell.id}
            line={cell.line}
            odds={cell.odds}
            selected={isSelected(cell.id)}
            onClick={() => onSelect(cell)}
          />
        ))}
      </div>
    </div>
  )
}
