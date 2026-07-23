'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  IconCalendarEvent,
  IconChevronRight,
  IconClockFilled,
  IconSparkles,
  IconTrophy,
} from '@tabler/icons-react'
import { SidebarInset } from '@/components/ui/sidebar'
import {
  Tabs as AnimateTabs,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CONTEST_LOBBIES = [
  'Main Lobby',
  'Squares Lobby',
  "Pick'Em",
  'Bracket',
  'Parlay',
  'Survivor',
  'Props',
  'Help',
] as const

type ContestLobby = (typeof CONTEST_LOBBIES)[number]

type ContestCardData = {
  id: string
  lobby: ContestLobby
  name: string
  prize: string
  contestType: string
  entryFee: string
  entries: string
  myRank?: number
  free?: boolean
  league: { label: string; icon: string }
  image: string
  /** When entry opens. If in the future → “Opens in …” */
  startDate: Date
  /** When contest closes. Past → Closed; soon → Finishes soon; else Open */
  endDate: Date
}

function hoursFromNow(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

function minutesFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000)
}

const CONTESTS: ContestCardData[] = [
  {
    id: '1',
    lobby: 'Main Lobby',
    name: 'Road to Superbowl',
    prize: '$200,000',
    contestType: "Pick'Em",
    entryFee: 'Free',
    entries: '1,234',
    myRank: 88,
    free: true,
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-01.png',
    startDate: hoursFromNow(-24),
    endDate: minutesFromNow(20),
  },
  {
    id: '2',
    lobby: 'Main Lobby',
    name: 'Pre Season Showdown',
    prize: '$50,000',
    contestType: 'Squares',
    entryFee: 'Free',
    entries: '842',
    free: true,
    league: { label: 'NBA', icon: '/banners/sports_league/nba.svg' },
    image: '/banners/contests/card-02.png',
    startDate: hoursFromNow(-12),
    endDate: hoursFromNow(48),
  },
  {
    id: '3',
    lobby: 'Main Lobby',
    name: 'Weekly Guaranteed',
    prize: '$10,000',
    contestType: 'Bracket',
    entryFee: '$5',
    entries: '2,104',
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-03.png',
    startDate: hoursFromNow(48),
    endDate: hoursFromNow(120),
  },
  {
    id: '3b',
    lobby: 'Main Lobby',
    name: 'Thursday Night Heat',
    prize: '$35,000',
    contestType: 'Parlay',
    entryFee: 'Free',
    entries: '677',
    myRank: 12,
    free: true,
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-04.png',
    startDate: hoursFromNow(-72),
    endDate: hoursFromNow(-2),
  },
  {
    id: '3c',
    lobby: 'Main Lobby',
    name: 'Prime Time Picks',
    prize: '$12,500',
    contestType: 'Survivor',
    entryFee: '$2',
    entries: '1,902',
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-05.png',
    startDate: hoursFromNow(-6),
    endDate: hoursFromNow(30),
  },
  {
    id: '3d',
    lobby: 'Main Lobby',
    name: 'Road to US Champions',
    prize: '$7,500',
    contestType: 'Props',
    entryFee: 'Free',
    entries: '511',
    free: true,
    league: { label: 'NCAAF', icon: '/sports_icons/football.svg' },
    image: '/banners/contests/card-06.png',
    startDate: hoursFromNow(-1),
    endDate: minutesFromNow(45),
  },
  {
    id: '10',
    lobby: 'Main Lobby',
    name: 'FIFA World Cup',
    prize: '$250,000',
    contestType: 'Bracket',
    entryFee: '$10',
    entries: '3,420',
    league: { label: 'FIFA', icon: '/sports_icons/World-Cup-2022.svg' },
    image: '/banners/contests/fifa-world-cup.png',
    startDate: hoursFromNow(-48),
    endDate: hoursFromNow(216),
  },
  {
    id: '11',
    lobby: 'Main Lobby',
    name: 'NBA Playoffs',
    prize: '$100,000',
    contestType: 'Bracket',
    entryFee: 'Free',
    entries: '2,108',
    free: true,
    league: { label: 'NBA', icon: '/banners/sports_league/nba.svg' },
    image: '/banners/contests/nba-playoffs.png',
    startDate: hoursFromNow(-12),
    endDate: hoursFromNow(96),
  },
  {
    id: '12',
    lobby: 'Main Lobby',
    name: 'NHL Playoffs',
    prize: '$75,000',
    contestType: 'Bracket',
    entryFee: '$5',
    entries: '1,455',
    league: { label: 'NHL', icon: '/banners/sports_league/NHL.svg' },
    image: '/banners/contests/nhl-playoffs.png',
    startDate: hoursFromNow(36),
    endDate: hoursFromNow(180),
  },
  {
    id: '4',
    lobby: 'Squares Lobby',
    name: 'Super Bowl Grid',
    prize: '$25,000',
    contestType: 'Squares',
    entryFee: '$25',
    entries: '400',
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-07.png',
    startDate: hoursFromNow(-24),
    endDate: hoursFromNow(72),
  },
  {
    id: '5',
    lobby: "Pick'Em",
    name: 'Week 12 Challenge',
    prize: '$15,000',
    contestType: "Pick'Em",
    entryFee: 'Free',
    entries: '1,560',
    free: true,
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-08.png',
    startDate: hoursFromNow(24),
    endDate: hoursFromNow(96),
  },
  {
    id: '6',
    lobby: 'Bracket',
    name: 'March Madness',
    prize: '$100,000',
    contestType: 'Bracket',
    entryFee: '$10',
    entries: '980',
    league: { label: 'NBA', icon: '/banners/sports_league/nba.svg' },
    image: '/banners/contests/nba-playoffs.png',
    startDate: hoursFromNow(-48),
    endDate: hoursFromNow(-1),
  },
  {
    id: '6b',
    lobby: 'Bracket',
    name: 'FIFA World Cup',
    prize: '$250,000',
    contestType: 'Bracket',
    entryFee: '$10',
    entries: '3,420',
    league: { label: 'FIFA', icon: '/sports_icons/World-Cup-2022.svg' },
    image: '/banners/contests/fifa-world-cup.png',
    startDate: hoursFromNow(-48),
    endDate: hoursFromNow(216),
  },
  {
    id: '6c',
    lobby: 'Bracket',
    name: 'NHL Playoffs',
    prize: '$75,000',
    contestType: 'Bracket',
    entryFee: '$5',
    entries: '1,455',
    league: { label: 'NHL', icon: '/banners/sports_league/NHL.svg' },
    image: '/banners/contests/nhl-playoffs.png',
    startDate: hoursFromNow(36),
    endDate: hoursFromNow(180),
  },
  {
    id: '7',
    lobby: 'Parlay',
    name: 'Same Game Heat',
    prize: '$5,000',
    contestType: 'Parlay',
    entryFee: 'Free',
    entries: '320',
    free: true,
    league: { label: 'NBA', icon: '/banners/sports_league/nba.svg' },
    image: '/banners/contests/card-02.png',
    startDate: hoursFromNow(-2),
    endDate: hoursFromNow(12),
  },
  {
    id: '8',
    lobby: 'Survivor',
    name: 'Last Team Standing',
    prize: '$75,000',
    contestType: 'Survivor',
    entryFee: '$20',
    entries: '611',
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-05.png',
    startDate: hoursFromNow(-24),
    endDate: hoursFromNow(120),
  },
  {
    id: '9',
    lobby: 'Props',
    name: 'Player Props Pool',
    prize: '$8,000',
    contestType: 'Props',
    entryFee: 'Free',
    entries: '445',
    free: true,
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-03.png',
    startDate: hoursFromNow(-4),
    endDate: minutesFromNow(35),
  },
]

type ContestStatusKind = 'upcoming' | 'open' | 'finishing' | 'closed'

type ContestStatus = {
  kind: ContestStatusKind
  label: string
}

function formatOpensIn(ms: number): string {
  const mins = Math.max(1, Math.ceil(ms / (1000 * 60)))
  if (mins < 60) return `Opens in ${mins} min`
  const hours = Math.ceil(ms / (1000 * 60 * 60))
  if (hours < 48) return `Opens in ${hours} ${hours === 1 ? 'Hour' : 'Hours'}`
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return `Opens in ${days} ${days === 1 ? 'Day' : 'Days'}`
}

function formatOpenLeft(ms: number): string {
  const mins = Math.max(1, Math.ceil(ms / (1000 * 60)))
  if (mins < 60) return `Open - ${mins}min left`
  const hours = Math.ceil(ms / (1000 * 60 * 60))
  if (hours < 48) return `Open - ${hours}h left`
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return `Open - ${days}d left`
}

function formatFinishingLeft(ms: number): string {
  const mins = Math.max(1, Math.ceil(ms / (1000 * 60)))
  return `Finishes soon - ${mins}min left`
}

function getContestStatus(startDate: Date, endDate: Date, now: number): ContestStatus {
  if (now >= endDate.getTime()) {
    return { kind: 'closed', label: 'Closed' }
  }
  if (now < startDate.getTime()) {
    return { kind: 'upcoming', label: formatOpensIn(startDate.getTime() - now) }
  }
  const remaining = endDate.getTime() - now
  if (remaining <= 60 * 60 * 1000) {
    return { kind: 'finishing', label: formatFinishingLeft(remaining) }
  }
  return { kind: 'open', label: formatOpenLeft(remaining) }
}

const STATUS_STYLES: Record<ContestStatusKind, string> = {
  upcoming: 'border-black bg-white text-black',
  open: 'border-[#5B8DEF] bg-[#E8F0FE] text-[#2F6FED]',
  finishing: 'border-[#C4842D] bg-[#FBF3E8] text-[#B56E1A]',
  closed: 'border-[#D1D1D1] bg-[#F2F2F2] text-black',
}

function ContestStatusBadge({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const status = getContestStatus(startDate, endDate, now)

  return (
    <div
      className={cn(
        'inline-flex w-fit max-w-full self-start items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none',
        STATUS_STYLES[status.kind]
      )}
    >
      {status.kind === 'upcoming' && (
        <IconCalendarEvent className="h-3 w-3 shrink-0" strokeWidth={2} />
      )}
      {status.kind === 'open' && (
        <IconSparkles className="h-3 w-3 shrink-0" strokeWidth={2} />
      )}
      {status.kind === 'finishing' && <IconClockFilled className="h-3 w-3 shrink-0" />}
      {status.kind === 'closed' && (
        <IconTrophy className="h-3 w-3 shrink-0" strokeWidth={2} />
      )}
      <span className="truncate">{status.label}</span>
    </div>
  )
}

function ContestCard({
  contest,
  index,
}: {
  contest: ContestCardData
  index: number
}) {
  const status = getContestStatus(contest.startDate, contest.endDate, Date.now())
  const canEnter = status.kind === 'open' || status.kind === 'finishing'
  const ctaLabel = canEnter
    ? contest.entryFee === 'Free'
      ? 'Free Entry'
      : `${contest.entryFee} Purchase`
    : status.kind === 'closed'
      ? 'Closed'
      : 'Soon'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        type: 'spring',
        bounce: 0.2,
      }}
      whileHover={{ y: -3 }}
      className="group relative flex min-h-[180px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1a1a] transition-colors duration-300 hover:border-white/[0.14] active:border-white/[0.14]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 tile-shimmer"
        aria-hidden
      />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-2.5 p-3.5 pr-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-white/[0.08]">
            <Image
              src={contest.league.icon}
              alt={contest.league.label}
              width={16}
              height={16}
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-semibold leading-snug text-white">
              {contest.name}
            </h3>
            <p className="mt-0.5 text-[22px] font-black leading-none tracking-tight text-white tabular-nums">
              {contest.prize}
            </p>
          </div>
        </div>

        <ContestStatusBadge startDate={contest.startDate} endDate={contest.endDate} />

        <div className="space-y-1">
          {[
            { label: 'Type', value: contest.contestType },
            { label: 'Entry', value: contest.entryFee },
            { label: 'Entries', value: contest.entries },
          ].map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-2 text-[11px] leading-none"
            >
              <span className="text-white/40">{row.label}</span>
              <span className="font-medium text-white/75">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <button
            type="button"
            className="flex h-8 shrink-0 items-center rounded-md bg-white/[0.06] px-2.5 text-[10px] font-semibold text-white/55 transition-colors hover:bg-white/[0.1] hover:text-white/80"
          >
            Rules
          </button>
          {contest.myRank != null && (
            <button
              type="button"
              className="flex h-8 shrink-0 items-center gap-0.5 rounded-md bg-white/[0.06] px-2.5 text-[10px] font-semibold text-white/55 transition-colors hover:bg-white/[0.1] hover:text-white/80"
            >
              My Entries
              <IconChevronRight className="h-3 w-3 opacity-50" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      <div className="pointer-events-none relative w-[34%] max-w-[118px] shrink-0 self-stretch overflow-hidden">
        <Image
          src={contest.image}
          alt=""
          fill
          className="object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
          sizes="118px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/70 to-transparent" />
      </div>

      {canEnter ? (
        <button
          type="button"
          className="absolute bottom-3 right-3 z-30 flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-xs font-bold whitespace-nowrap text-white shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
        >
          {ctaLabel}
        </button>
      ) : (
        <span className="absolute bottom-3 right-3 z-30 flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#2a2a2a]/90 px-3 text-xs font-semibold text-white/45 shadow-lg backdrop-blur-sm">
          {ctaLabel}
        </span>
      )}
    </motion.div>
  )
}

export function ContestsPage() {
  const [lobby, setLobby] = useState<ContestLobby>('Main Lobby')

  const visibleContests = useMemo(() => {
    if (lobby === 'Help') return []
    if (lobby === 'Main Lobby') {
      return CONTESTS.filter((c) => c.lobby === 'Main Lobby')
    }
    return CONTESTS.filter((c) => c.lobby === lobby)
  }, [lobby])

  return (
    <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
      <div className="w-full px-3 pb-10 pt-6 md:px-6 md:pt-8">
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-[var(--ds-fg)] md:text-3xl">
            Contests
          </h1>

          <div className="overflow-x-auto scrollbar-hide">
            <AnimateTabs
              value={lobby}
              onValueChange={(value) => setLobby(value as ContestLobby)}
              className="w-max min-w-full"
            >
              <AnimateTabsList className="relative h-auto gap-1 rounded-3xl border-0 bg-[var(--ds-control-bg)] p-0.5 transition-colors duration-300">
                {CONTEST_LOBBIES.flatMap((tab, index) => {
                  const items = []
                  if (index === 1) {
                    items.push(
                      <span
                        key="lobby-divider"
                        aria-hidden
                        className="mx-0.5 h-4 w-px shrink-0 self-center bg-[var(--ds-fg-subtle)]/35"
                      />
                    )
                  }
                  items.push(
                    <TabsTab
                      key={tab}
                      value={tab}
                      className={cn(
                        'relative z-10 flex h-9 items-center gap-1.5 rounded-2xl px-4 py-1 text-xs font-medium transition-colors duration-300 ease-in-out',
                        'text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]',
                        'data-[state=active]:text-white',
                        'focus-visible:outline-none focus-visible:ring-0 active:bg-transparent active:outline-none',
                        'whitespace-nowrap'
                      )}
                    >
                      {lobby === tab && (
                        <motion.div
                          layoutId="activeContestLobbyTab"
                          className="absolute inset-0 -z-10 rounded-2xl"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">{tab}</span>
                    </TabsTab>
                  )
                  return items
                })}
              </AnimateTabsList>
            </AnimateTabs>
          </div>
        </div>

        {lobby === 'Help' ? (
          <div className="rounded-xl border border-[var(--ds-border)] bg-[var(--ds-overlay)] px-6 py-12 text-center">
            <h2 className="mb-2 text-lg font-semibold text-[var(--ds-fg)]">
              Contest Help
            </h2>
            <p className="mx-auto max-w-md text-sm text-[var(--ds-fg-muted)]">
              Learn how entries, scoring, and payouts work across Main Lobby,
              Squares, Pick&apos;Em, Brackets, and more.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-white/20 bg-transparent text-[var(--ds-fg)] hover:bg-white/10"
            >
              View FAQ
            </Button>
          </div>
        ) : visibleContests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/20 px-6 py-16 text-center text-sm text-[var(--ds-fg-subtle)]">
            No contests in {lobby} right now. Check Main Lobby for live games.
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}
          >
            {visibleContests.map((contest, index) => (
              <ContestCard key={contest.id} contest={contest} index={index} />
            ))}
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
