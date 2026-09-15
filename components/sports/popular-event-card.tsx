'use client'

import Image from 'next/image'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { PopularEvent } from './mock-data'

interface PopularEventCardProps {
  event: PopularEvent
  className?: string
}

export function PopularEventCard({ event, className }: PopularEventCardProps) {
  return (
    <article
      className={cn(
        'flex h-[160px] w-[340px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-white/[0.06] bg-[#262626]',
        className
      )}
      style={
        event.isLive
          ? {
              // Same live tint as the legacy Top Events cards, swept left → right
              backgroundImage:
                'linear-gradient(to right, rgba(238,53,54,0.07) 0%, rgba(238,53,54,0.025) 45%, rgba(255,255,255,0.02) 100%)',
            }
          : undefined
      }
    >
      <header className="flex items-center justify-between px-3 pt-2">
        <div className="flex min-w-0 items-center gap-1">
          <span className="relative size-4 shrink-0">
            <Image src={event.leagueIcon} alt="" fill className="object-contain" sizes="16px" />
          </span>
          <span className="truncate text-xs text-[var(--ds-fg)]">{event.league}</span>
          <span className="text-xs text-[var(--ds-fg-muted)]">|</span>
          <span className="truncate text-xs text-[var(--ds-fg-muted)]">{event.country}</span>
        </div>
        {event.isLive && (
          <div className="relative flex items-center gap-0.5">
            <span className="relative text-[10px] font-medium text-[#e87c79]">{event.clock}</span>
            <span className="relative ml-0.5 flex size-4 items-center justify-center rounded-full bg-[#3a3a3a] text-white">
              <IconPlayerPlayFilled className="size-2" />
            </span>
          </div>
        )}
      </header>

      <div className="flex flex-1 items-center gap-1 px-3 py-3">
        <TeamBlock name={event.home.name} logo={event.home.logo} />
        <div className="flex items-center gap-2 px-1">
          <span className="w-[30px] text-center text-base font-semibold tabular-nums text-[var(--ds-fg)]">
            {event.home.score}
          </span>
          <span className="text-base font-semibold text-[var(--ds-fg-muted)]">-</span>
          <span className="w-[30px] text-center text-base font-semibold tabular-nums text-[var(--ds-fg)]">
            {event.away.score}
          </span>
        </div>
        <TeamBlock name={event.away.name} logo={event.away.logo} />
      </div>

      <footer className="px-3 pb-2">
        <div className="flex h-0.5 w-full overflow-hidden rounded-full">
          <div className="h-full bg-white/70" style={{ width: `${event.home.percent}%` }} />
          <div className="h-full bg-white/15" style={{ width: `${event.away.percent}%` }} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px]">
          <span className="w-16 font-medium text-[var(--ds-fg)]">
            {event.home.code} {event.home.percent}%
          </span>
          <span className="text-[var(--ds-fg-muted)]">{event.marketLabel}</span>
          <span className="w-16 text-right font-medium text-[var(--ds-fg)]">
            {event.away.code} {event.away.percent}%
          </span>
        </div>
      </footer>
    </article>
  )
}

function TeamBlock({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <span className="relative size-9 shrink-0">
        <Image src={logo} alt="" fill className="object-contain" sizes="36px" unoptimized />
      </span>
      <p className="max-w-[112px] truncate text-center text-xs font-medium text-[var(--ds-fg)]">
        {name}
      </p>
    </div>
  )
}
