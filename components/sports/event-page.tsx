'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconArrowLeft,
  IconBell,
  IconChartDots3,
  IconChevronDown,
  IconChevronRight,
  IconDeviceTv,
  IconPlayerPlayFilled,
  IconVolume,
} from '@tabler/icons-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { EventSwitcher } from './event-switcher'
import { EventDock, LiveStreamPlayer, MatchTrackerBody, useDockWidth } from './match-tracker-panel'
import { buildEventMarkets, type EventMarket, type GridMarket, type MarketColumnHeader, type MarketGroup, type PlayerPropsMarket, type TableMarket, type TwoWayMarket } from './event-markets'
import type { LeagueGroup, OddsCell, SportsEvent } from './mock-data'
import { OddsButton } from './odds-button'
import { PillTabs, type PillTab } from './pill-tabs'
import { useSportsBetslip } from './use-sports-betslip'

type MarketTab = MarketGroup

const TABS: PillTab<MarketTab>[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'builder', label: 'Bet Builder' },
  { id: 'players', label: 'Players' },
  { id: 'quarters', label: 'Quarters' },
  { id: 'halves', label: 'Halves' },
  { id: 'team', label: 'Team Props' },
  { id: 'specials', label: 'Specials' },
]

interface EventPageProps {
  event: SportsEvent
  league: LeagueGroup
}

/**
 * Event page — markets on the left (same odds buttons as the sports home),
 * live stream + match tracker locked in a resizable right-side dock.
 */
export function EventPage({ event, league }: EventPageProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [tab, setTab] = useState<MarketTab>('popular')
  const [trackerOpen, setTrackerOpen] = useState(true)
  const [media, setMedia] = useState<'stream' | 'tracker'>(event.isLive ? 'stream' : 'tracker')
  const [dockWidth, setDockWidth] = useDockWidth()
  const { selectedIds, toggleOdds } = useSportsBetslip()

  const allMarkets = useMemo(() => buildEventMarkets(event, league), [event, league])
  const markets = useMemo(() => allMarkets.filter((m) => m.groups.includes(tab)), [allMarkets, tab])
  const tabLabel = TABS.find((t) => t.id === tab)?.label ?? ''

  const back = () => router.push(`/sports?sport=${league.sport}`)

  return (
    <div className={cn('w-full', isMobile && 'pb-24')}>
      {isMobile ? (
        /* Mobile header — compact bet365-style scoreline: back · league · switcher, then crest | score | crest */
        <div className="relative px-4 pb-4 pt-3" style={
          event.isLive
            ? {
                backgroundImage:
                  'radial-gradient(ellipse 70% 120% at 50% 0%, rgba(238,53,54,0.16) 0%, rgba(238,53,54,0.05) 55%, rgba(238,53,54,0) 100%)',
              }
            : undefined
        }>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={back}
              aria-label={`Back to ${league.title}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
            >
              <IconArrowLeft className="size-4" strokeWidth={2} />
            </button>
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-xs text-[var(--ds-fg-muted)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={league.icon} alt="" className="size-3.5 shrink-0 object-contain" />
              <span className="truncate">
                {league.subtitle} - {league.title}
              </span>
            </span>
            <EventSwitcher event={event} league={league} variant="icon" />
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex min-w-0 items-center justify-end gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.home.logo} alt="" className="size-8 shrink-0 object-contain" />
              <span className="truncate text-right text-sm font-semibold text-[var(--ds-fg)]">{shortName(event.home.name)}</span>
            </div>
            <div className="flex flex-col items-center">
              {event.isLive ? (
                <>
                  <span className="text-[26px] font-bold leading-none tabular-nums text-[var(--ds-fg)]">
                    {event.home.score} - {event.away.score}
                  </span>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#e87c79]">
                    <span className="flex size-3.5 items-center justify-center rounded-full bg-[#3a3a3a] text-white">
                      <IconPlayerPlayFilled className="size-1.5" />
                    </span>
                    {event.clock}
                  </span>
                </>
              ) : (
                <span className="text-center text-xs text-[var(--ds-fg-muted)]">
                  {event.clock}
                  {event.clockSub ? <><br />{event.clockSub}</> : null}
                </span>
              )}
            </div>
            <div className="flex min-w-0 items-center justify-start gap-2">
              <span className="truncate text-sm font-semibold text-[var(--ds-fg)]">{shortName(event.away.name)}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.away.logo} alt="" className="size-8 shrink-0 object-contain" />
            </div>
          </div>
        </div>
      ) : (
        /* Desktop header — soft red tint (same as the live rows) fading into the page */
        <div
          className="relative px-4 pb-6 pt-6 md:px-6 md:pt-8"
          style={
            event.isLive
              ? {
                  backgroundImage:
                    'radial-gradient(ellipse 70% 120% at 50% 0%, rgba(238,53,54,0.16) 0%, rgba(238,53,54,0.05) 55%, rgba(238,53,54,0) 100%)',
                }
              : undefined
          }
        >
          <button
            type="button"
            onClick={back}
            aria-label={`Back to ${league.title}`}
            className="absolute left-4 top-6 flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] md:left-6 md:top-8"
          >
            <IconArrowLeft className="size-4" strokeWidth={2} />
          </button>

          <div className="flex flex-col items-center gap-3 px-12 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--ds-fg-muted)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={league.icon} alt="" className="size-3.5 object-contain" />
              {league.subtitle} - {league.title}
            </span>

            {/* Crests + title */}
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.home.logo} alt="" className="size-10 shrink-0 object-contain md:size-12" />
              <EventSwitcher event={event} league={league} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.away.logo} alt="" className="size-10 shrink-0 object-contain md:size-12" />
            </div>

            <span className="flex items-center gap-2 text-xs">
              {event.isLive ? (
                <>
                  <span className="font-medium text-[#e87c79]">{event.clock}</span>
                  <span className="flex size-4 items-center justify-center rounded-full bg-[#3a3a3a] text-white">
                    <IconPlayerPlayFilled className="size-2" />
                  </span>
                  <span className="text-lg font-bold tabular-nums leading-none text-[var(--ds-fg)]">
                    {event.home.score} - {event.away.score}
                  </span>
                </>
              ) : (
                <span className="text-[var(--ds-fg-muted)]">
                  {event.clock}
                  {event.clockSub ? ` · ${event.clockSub}` : ''}
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Mobile: stream / tracker switcher above the markets — actions live on this line */}
      {isMobile && (
        <div className="border-b border-white/10">
          <div className="flex items-center justify-between gap-2 pl-1 pr-3">
            <div className="flex items-center" role="tablist" aria-label="Match media">
              {event.isLive && (
                <MediaTab active={trackerOpen && media === 'stream'} onClick={() => { setMedia('stream'); setTrackerOpen(true) }}>
                  <IconDeviceTv className="size-4" strokeWidth={1.5} />
                  Stream
                </MediaTab>
              )}
              <MediaTab active={trackerOpen && media === 'tracker'} onClick={() => { setMedia('tracker'); setTrackerOpen(true) }}>
                <IconChartDots3 className="size-4" strokeWidth={1.5} />
                Tracker
              </MediaTab>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <IconButton label="Commentary" size="sm">
                <IconVolume className="size-4" strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Notifications" size="sm">
                <IconBell className="size-4" strokeWidth={1.5} />
              </IconButton>
              <IconButton label={trackerOpen ? 'Hide media' : 'Show media'} size="sm" onClick={() => setTrackerOpen((v) => !v)}>
                <IconChevronDown className={cn('size-4 transition-transform', !trackerOpen && '-rotate-90')} strokeWidth={1.5} />
              </IconButton>
            </div>
          </div>
          {trackerOpen &&
            (media === 'stream' && event.isLive ? (
              <LiveStreamPlayer event={event} />
            ) : (
              <div className="max-h-[360px] overflow-y-auto border-t border-white/[0.06] scrollbar-hide">
                <MatchTrackerBody event={event} league={league} hideScoreboard />
              </div>
            ))}
        </div>
      )}

      {/* Market tabs — same pill group as the sports home market filter */}
      <div className={cn('flex items-center gap-2 px-4 md:px-6', isMobile && 'pt-4')}>
        <PillTabs
          tabs={TABS}
          value={tab}
          onChange={setTab}
          layoutId="sports-event-market-tabs"
          className="min-w-0 flex-1"
          edgeInset={isMobile ? 16 : undefined}
        />
        {!isMobile && (
          <div className="flex shrink-0 items-center gap-1">
            <IconButton label="Commentary">
              <IconVolume className="size-4" strokeWidth={1.5} />
            </IconButton>
            <IconButton label="Notifications">
              <IconBell className="size-4" strokeWidth={1.5} />
            </IconButton>
          </div>
        )}
      </div>

      {/* Markets */}
      <div className="space-y-3 px-4 py-4 md:space-y-4 md:py-6 md:px-6">
        {markets.length === 0 ? (
          <div className="rounded-[10px] border border-white/[0.06] bg-[#262626] px-4 py-10 text-center text-sm text-[var(--ds-fg-muted)]">
            {tabLabel} markets coming soon.
          </div>
        ) : (
          markets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              event={event}
              selectedIds={selectedIds}
              onSelect={(cell) => toggleOdds(cell, event, market.name)}
            />
          ))
        )}
      </div>

      {/* Desktop: locked right-side dock */}
      {!isMobile && <EventDock event={event} league={league} width={dockWidth} onResize={setDockWidth} />}
    </div>
  )
}

/** "Seattle Seahawks" → "Seahawks" for the compact mobile scoreline. */
function shortName(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? parts[parts.length - 1] : name
}

function MediaTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative flex h-11 items-center gap-1.5 px-3 text-xs font-medium outline-none transition-colors focus-visible:text-[var(--ds-fg)]',
        active ? 'text-[var(--ds-fg)]' : 'text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]'
      )}
    >
      {children}
      {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--ds-primary,#ee3536)]" />}
    </button>
  )
}

function IconButton({
  label,
  onClick,
  active,
  size = 'md',
  children,
}: {
  label: string
  onClick?: () => void
  active?: boolean
  /** `sm` = borderless ghost button for inline toolbars (mobile media line). */
  size?: 'sm' | 'md'
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-full outline-none transition-colors',
        size === 'md'
          ? 'h-9 w-9 bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)]'
          : 'h-8 w-8 hover:bg-white/[0.06]',
        active ? 'text-[var(--ds-fg)]' : 'text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]'
      )}
    >
      {children}
    </button>
  )
}

/** Market card — same chrome as the home event cards; body layout depends on the market kind. */
function MarketCard({
  market,
  event,
  selectedIds,
  onSelect,
}: {
  market: EventMarket
  event: SportsEvent
  selectedIds: Set<string>
  onSelect: (cell: OddsCell) => void
}) {
  const [open, setOpen] = useState(true)
  const isSel = (c: OddsCell) => selectedIds.has(c.id)

  return (
    <section className="overflow-hidden rounded-[10px] border border-white/[0.06] bg-[#262626] shadow-[0_0_16px_rgba(0,0,0,0.25)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-11 w-full items-center gap-2 px-4 text-left"
      >
        <span className="flex-1 text-sm font-semibold leading-4 text-[var(--ds-fg)]">{market.name}</span>
        <IconChevronRight
          className={cn('size-4 text-[var(--ds-fg-muted)] transition-transform', open && 'rotate-90')}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="border-t border-white/[0.06]">
          {market.kind === 'two-way' && <TwoWayBody market={market} isSel={isSel} onSelect={onSelect} />}
          {market.kind === 'table' && <TableBody market={market} isSel={isSel} onSelect={onSelect} />}
          {market.kind === 'grid' && <GridBody market={market} isSel={isSel} onSelect={onSelect} />}
          {market.kind === 'players' && <PlayersBody market={market} isSel={isSel} onSelect={onSelect} />}
        </div>
      )}
    </section>
  )
}

type BodyProps<M> = { market: M; isSel: (c: OddsCell) => boolean; onSelect: (c: OddsCell) => void }

/** Spread / Moneyline / Total — team logo + name on the left, odds button on the right. */
function TwoWayBody({ market, isSel, onSelect }: BodyProps<TwoWayMarket>) {
  return (
    <div className="px-4 py-2">
      {market.rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between gap-3 py-1.5">
          <div className="flex min-w-0 items-center gap-2">
            {row.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.logo} alt="" className="size-5 shrink-0 object-contain" />
            )}
            <span className="truncate text-xs text-[var(--ds-fg)]">{row.label}</span>
          </div>
          <OddsButton line={row.cell.line} odds={row.cell.odds} selected={isSel(row.cell)} onClick={() => onSelect(row.cell)} />
        </div>
      ))}
    </div>
  )
}

function ColumnHeader({ header, className }: { header: MarketColumnHeader; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-1.5 text-[11px] font-medium text-[var(--ds-fg-muted)]', className)}>
      {header.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={header.logo} alt="" className="size-4 shrink-0 object-contain" />
      )}
      <span className="truncate">{header.label}</span>
    </div>
  )
}

/** Row label + N odds columns (Over / Under, Home / Away, Over / Exactly / Under). */
function TableBody({ market, isSel, onSelect }: BodyProps<TableMarket>) {
  const cols = market.columns.length
  const grid = { gridTemplateColumns: `minmax(0,1fr) repeat(${cols}, 77px)` }
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="min-w-max px-4 pb-3 pt-1 md:min-w-0">
        <div className="grid items-center gap-x-2 py-2" style={grid}>
          <span />
          {market.columns.map((c, i) => (
            <ColumnHeader key={i} header={c} />
          ))}
        </div>
        {market.rows.map((row) => (
          <div key={row.id} className="grid items-center gap-x-2 py-1.5" style={grid}>
            <span className="truncate text-xs text-[var(--ds-fg)]">{row.label}</span>
            {row.cells.map((c, i) =>
              c ? (
                <OddsButton key={c.id} line={c.line} odds={c.odds} selected={isSel(c)} onClick={() => onSelect(c)} />
              ) : (
                <span key={i} />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Home | Tie | Away stacks (winning margin / correct score). */
function GridBody({ market, isSel, onSelect }: BodyProps<GridMarket>) {
  return (
    <div className="grid grid-cols-3 gap-x-3 px-4 pb-3 pt-2">
      {market.columns.map((col, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <ColumnHeader header={col.header} className="h-8 max-w-full px-1 text-[var(--ds-fg)]" />
          {col.cells.map((c) => (
            <OddsButton key={c.id} line={c.line} odds={c.odds} selected={isSel(c)} onClick={() => onSelect(c)} />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Player rows with an escalating ladder of selections; team tabs filter the list. */
function PlayersBody({ market, isSel, onSelect }: BodyProps<PlayerPropsMarket>) {
  const [teamCode, setTeamCode] = useState(market.teams[0].code)
  const [showAll, setShowAll] = useState(false)
  const team = market.teams.find((t) => t.code === teamCode) ?? market.teams[0]
  const rows = market.players.filter((p) => p.teamCode === teamCode)
  const visible = showAll ? rows : rows.slice(0, 3)

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-white/[0.06] px-4" role="tablist" aria-label="Team">
        {market.teams.map((t) => {
          const active = t.code === teamCode
          return (
            <button
              key={t.code}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setTeamCode(t.code)
                setShowAll(false)
              }}
              className={cn(
                'relative flex h-9 items-center gap-1.5 px-2 text-xs font-medium transition-colors',
                active ? 'text-[var(--ds-fg)]' : 'text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.logo} alt="" className="size-4 object-contain" />
              {t.name}
              {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--ds-primary,#ee3536)]" />}
            </button>
          )
        })}
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-max px-4 py-2 md:min-w-0">
          {visible.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-1.5">
              <div className="flex w-[160px] min-w-0 shrink-0 items-center gap-2 md:w-[200px]">
                <span className="relative flex size-7 shrink-0 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={team.logo} alt="" className="size-6 object-contain opacity-90" />
                  <span className="absolute -bottom-0.5 -right-1 rounded-sm bg-[#3a3a3a] px-1 text-[8px] font-bold leading-3 text-white">
                    {p.number}
                  </span>
                </span>
                <span className="truncate text-xs text-[var(--ds-fg)]">{p.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {p.cells.map((c) => (
                  <OddsButton key={c.id} line={c.line} odds={c.odds} selected={isSel(c)} onClick={() => onSelect(c)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {rows.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="flex h-9 w-full items-center justify-center gap-1 border-t border-white/[0.06] text-xs font-medium text-[var(--ds-fg-muted)] transition-colors hover:text-[var(--ds-fg)]"
        >
          {showAll ? 'Show less' : 'Show more'}
          <IconChevronRight className={cn('size-3.5 transition-transform', showAll ? '-rotate-90' : 'rotate-90')} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
