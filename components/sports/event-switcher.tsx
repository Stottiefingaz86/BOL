'use client'

import { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconChevronDown, IconPlayerPlayFilled, IconX } from '@tabler/icons-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ALL_LEAGUES, SPORT_CHIPS, type LeagueGroup, type SportsEvent } from './mock-data'

interface EventSwitcherProps {
  event: SportsEvent
  league: LeagueGroup
  /** `title` = full "Home v Away" text trigger (desktop); `icon` = compact round chevron (mobile header). */
  variant?: 'title' | 'icon'
}

/**
 * Event title with a chevron — opens a list of the other events in this sport
 * (live first, grouped by league) so you can jump between matches without leaving the page.
 */
export function EventSwitcher({ event, league, variant = 'title' }: EventSwitcherProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const sportLabel = SPORT_CHIPS.find((c) => c.id === league.sport)?.label ?? 'Sport'
  const leagues = ALL_LEAGUES.filter((l) => l.sport === league.sport)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === 'icon' ? (
          <button
            type="button"
            aria-label="Switch event"
            className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[var(--ds-fg-muted)] outline-none transition-colors hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] focus-visible:ring-1 focus-visible:ring-white/20 data-[state=open]:bg-[var(--ds-control-bg)] data-[state=open]:text-[var(--ds-fg)]"
          >
            <IconChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} strokeWidth={2} />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Switch event"
            className="inline-flex items-center gap-1.5 rounded-small px-2 py-1 text-lg font-semibold text-[var(--ds-fg)] outline-none transition-colors hover:bg-white/[0.06] focus-visible:ring-1 focus-visible:ring-white/20 data-[state=open]:bg-white/[0.06] md:text-xl"
          >
            {event.home.name} v {event.away.name}
            <IconChevronDown
              className={cn('size-4 text-[var(--ds-primary,#ee3536)] transition-transform', open && 'rotate-180')}
              strokeWidth={2}
            />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={8}
        className="z-[120] w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[10px] border-white/[0.06] bg-[#262626] p-0 text-[var(--ds-fg)] shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="relative flex h-11 items-center justify-center border-b border-white/[0.06] px-10">
          <span className="text-sm font-semibold">{sportLabel}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-2 flex size-7 items-center justify-center rounded-full text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
          >
            <IconX className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
          {leagues.map((l) => {
            const events = [...l.events].sort((a, b) => Number(b.isLive) - Number(a.isLive))
            return (
              <Fragment key={l.id}>
                <div className="flex items-center justify-center gap-1.5 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-[var(--ds-fg)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.icon} alt="" className="size-3.5 object-contain" />
                  {l.subtitle} - {l.title}
                </div>
                {events.map((e) => {
                  const current = e.id === event.id
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        if (!current) router.push(`/sports/event/${e.id}`)
                      }}
                      aria-current={current ? 'page' : undefined}
                      className={cn(
                        'flex w-full flex-col items-center gap-1 border-b border-white/[0.06] px-3 py-2.5 transition-colors last:border-b-0',
                        current ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                      )}
                    >
                      <span className="flex items-center gap-1 text-[10px]">
                        <span className={e.isLive ? 'font-medium text-[#e87c79]' : 'text-[var(--ds-fg-muted)]'}>
                          {e.clock}
                          {!e.isLive && e.clockSub ? ` · ${e.clockSub}` : ''}
                        </span>
                        {e.isLive && (
                          <span className="flex size-3.5 items-center justify-center rounded-full bg-[#3a3a3a] text-white">
                            <IconPlayerPlayFilled className="size-1.5" />
                          </span>
                        )}
                      </span>
                      <span className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm font-semibold">
                        <span className="truncate text-right">{e.home.name}</span>
                        <span className="flex items-center gap-2 tabular-nums text-[#f5d300]">
                          {e.isLive ? (
                            <>
                              <span>{e.home.score}</span>
                              <span>{e.away.score}</span>
                            </>
                          ) : (
                            <span className="text-xs font-medium text-[var(--ds-fg-muted)]">v</span>
                          )}
                        </span>
                        <span className="truncate text-left">{e.away.name}</span>
                      </span>
                    </button>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
