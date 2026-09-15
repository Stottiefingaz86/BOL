'use client'

import { Fragment } from 'react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { EventRow } from './event-row'
import type { LeagueGroup, OddsCell, SportsEvent } from './mock-data'

interface EventListCardProps {
  league: LeagueGroup
  layout?: 'desktop' | 'mobile'
  selectedIds?: Set<string>
  onSelectOdds?: (cell: OddsCell, event: SportsEvent, marketTitle: string) => void
  className?: string
}

/** Figma `card-sportsbook` with `event-row/header` + stacked `event-row/scoreboard` rows. */
export function EventListCard({
  league,
  layout = 'desktop',
  selectedIds,
  onSelectOdds,
  className,
}: EventListCardProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-[10px] border border-white/[0.06] bg-[#262626]',
        className
      )}
    >
      <header className="flex h-[34px] items-center gap-1 px-3 pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={league.icon} alt="" className="size-4 shrink-0 object-contain" />
        <span className="text-xs leading-4 text-[var(--ds-fg)]">{league.title}</span>
        <span className="mx-0.5 h-3 w-px bg-[var(--ds-border-strong)]" aria-hidden />
        <span className="text-xs leading-4 text-[var(--ds-fg-muted)]">{league.subtitle}</span>
      </header>

      <div>
        {league.events.map((event, index) => (
          <Fragment key={event.id}>
            {index > 0 && <Separator className="bg-white/[0.06]" />}
            <EventRow
              event={event}
              layout={layout}
              selectedIds={selectedIds}
              onSelectOdds={onSelectOdds}
            />
          </Fragment>
        ))}
      </div>
    </section>
  )
}
