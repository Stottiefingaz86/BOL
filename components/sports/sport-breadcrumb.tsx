'use client'

import { useState } from 'react'
import { IconArrowLeft, IconChevronDown } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const COUNTRIES = ['USA', 'Canada', 'England', 'Spain', 'Germany', 'Australia']
const LEAGUES: Record<string, string[]> = {
  football: ['NFL', 'NCAAF', 'CFL', 'UFL'],
  basketball: ['NBA', 'WNBA', 'NCAAB', 'EuroLeague'],
}

interface SportBreadcrumbProps {
  sportLabel: string
  sportId: string
  onBack: () => void
  className?: string
}

/** Figma sport page header: ← back, "Sport / Select Country ⌄ / Select League ⌄". */
export function SportBreadcrumb({ sportLabel, sportId, onBack, className }: SportBreadcrumbProps) {
  const [country, setCountry] = useState<string | null>(null)
  const [league, setLeague] = useState<string | null>(null)
  const leagues = LEAGUES[sportId] ?? ['All leagues']

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-3 text-sm', className)}>
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to Sports Home"
        className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
      >
        <IconArrowLeft className="size-3.5" strokeWidth={2} />
      </button>

      <ol className="flex min-w-0 items-center gap-2">
        <li className="shrink-0 font-medium text-[var(--ds-fg)]">{sportLabel}</li>
        <Slash />
        <li>
          <Crumb
            label={country ?? 'Select Country'}
            items={COUNTRIES}
            selected={country}
            onSelect={(v) => {
              setCountry(v)
              setLeague(null)
            }}
          />
        </li>
        <Slash />
        <li>
          <Crumb label={league ?? 'Select League'} items={leagues} selected={league} onSelect={setLeague} />
        </li>
      </ol>
    </nav>
  )
}

function Slash() {
  return (
    <li aria-hidden className="text-[var(--ds-fg-muted)]">
      /
    </li>
  )
}

function Crumb({
  label,
  items,
  selected,
  onSelect,
}: {
  label: string
  items: string[]
  selected: string | null
  onSelect: (value: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 whitespace-nowrap rounded-small px-1 py-0.5 transition-colors hover:text-[var(--ds-fg)] data-[state=open]:text-[var(--ds-fg)]',
            selected ? 'text-[var(--ds-fg)]' : 'text-[var(--ds-fg-muted)]'
          )}
        >
          {label}
          <IconChevronDown className="size-3.5" strokeWidth={2} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="z-[120] w-[180px] border-[var(--ds-border)] bg-[var(--ds-surface-raised)]"
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item}
            onSelect={() => onSelect(item)}
            className={cn(
              'text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]',
              selected === item && 'text-[var(--ds-fg)]'
            )}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
