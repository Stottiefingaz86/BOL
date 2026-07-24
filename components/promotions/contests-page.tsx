'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconCircleDashed,
  IconClockFilled,
  IconExternalLink,
  IconFilter,
  IconFlame,
  IconLayoutGrid,
  IconPlus,
  IconShoppingCart,
  IconSparkles,
  IconStarFilled,
  IconTicket,
  IconTrophy,
  IconX,
} from '@tabler/icons-react'
import * as Dialog from '@radix-ui/react-dialog'
import { SidebarInset } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tabs as AnimateTabs,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const CONTEST_LOBBIES = [
  'Lobby',
  'My Entries',
  'Squares Lobby',
  "Pick'Em",
  'Bracket',
  'Parlay',
  'Survivor',
  'Props',
  'Help',
] as const

type ContestLobby = (typeof CONTEST_LOBBIES)[number]

/** Lobbies that open in a dedicated window/popup instead of filtering this page. */
const EXTERNAL_LOBBY_TABS = new Set<ContestLobby>(['Squares Lobby'])

const SQUARES_LOBBY_TAB_INDEX = CONTEST_LOBBIES.indexOf('Squares Lobby')

type ContestEntryStatus = 'incomplete' | 'submitted' | 'finished'

type ContestEntry = {
  id: string
  label: string
  status: ContestEntryStatus
  /** Shown for submitted / finished */
  score?: string
  rank?: number
}

type ContestCardData = {
  id: string
  lobby: ContestLobby
  name: string
  prize: string
  contestType: string
  entryFee: string
  entries: string
  myEntries?: ContestEntry[]
  free?: boolean
  featured?: boolean
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
    lobby: 'Lobby',
    name: 'Road to Superbowl',
    prize: '$200,000',
    contestType: "Pick'Em",
    entryFee: 'Free',
    entries: '1,234',
    free: true,
    featured: true,
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-01.png',
    startDate: hoursFromNow(-24),
    endDate: minutesFromNow(20),
    myEntries: [
      { id: 'e1', label: 'Entry #1', status: 'submitted', score: '12/16' },
      { id: 'e2', label: 'Entry #2', status: 'incomplete' },
      { id: 'e3', label: 'Entry #3', status: 'submitted', score: '9/16' },
    ],
  },
  {
    id: '2',
    lobby: 'Lobby',
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
    lobby: 'Lobby',
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
    lobby: 'Lobby',
    name: 'Thursday Night Heat',
    prize: '$35,000',
    contestType: 'Parlay',
    entryFee: 'Free',
    entries: '677',
    free: true,
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    image: '/banners/contests/card-04.png',
    startDate: hoursFromNow(-72),
    endDate: hoursFromNow(-2),
    myEntries: [
      { id: 'e1', label: 'Entry #1', status: 'finished', score: '18 pts', rank: 12 },
      { id: 'e2', label: 'Entry #2', status: 'finished', score: '11 pts', rank: 84 },
      { id: 'e3', label: 'Entry #3', status: 'incomplete' },
    ],
  },
  {
    id: '3c',
    lobby: 'Lobby',
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
    lobby: 'Lobby',
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
    lobby: 'Lobby',
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
    lobby: 'Lobby',
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
    lobby: 'Lobby',
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

/** One game can expose multiple square pools — each pool has its own price per square. */
type SquaresPool = {
  id: string
  /** Charged for each square added from this pool’s board */
  pricePerSquare: string
  prize: string
  squaresLeft: number
  playing: number
  featured?: boolean
  mySquaresPurchased?: number
}

type SquaresSettledWin = {
  label: 'Q1' | 'Q2' | 'HALF' | 'Q3' | 'FINAL'
  awayScore: number
  homeScore: number
}

type SquaresLive = {
  /** Current game period */
  period: 'q1' | 'q2' | 'half' | 'q3' | 'q4' | 'final'
  /** Period scores; null = not played yet */
  awayQ: [number | null, number | null, number | null, number | null]
  homeQ: [number | null, number | null, number | null, number | null]
  /** Paid checkpoints already decided */
  settled: SquaresSettledWin[]
  /** Still selling open squares for upcoming prizes */
  buyingFor?: string
}

type SquaresGame = {
  id: string
  league: { label: string; icon: string }
  matchup: string
  awayTeam: string
  homeTeam: string
  /** Optional team marks for live scoreboard header */
  awayLogo?: string
  homeLogo?: string
  awayAbbr?: string
  homeAbbr?: string
  kickoffLabel: string
  playing: number
  squaresLeft: number
  mySquaresPurchased?: number
  startDate: Date
  endDate: Date
  pools: SquaresPool[]
  /** When true, use explicit axisTop/axisLeft; otherwise digits are seeded per pool. */
  numbersLocked?: boolean
  axisTop?: number[]
  axisLeft?: number[]
  /** In-progress game (numbers locked, quarter wins, mid-game buying). */
  live?: SquaresLive
}

type SquareCellKind =
  | 'open'
  | 'taken'
  | 'mine'
  | 'basket'
  | 'win-q1'
  | 'win-q2'
  | 'win-half'
  | 'win-q3'
  | 'win-end'
  | 'win'

type ContestPurchaseRequest = {
  contest: ContestCardData
  /** Pre-select quantity (e.g. squares in basket) */
  initialQty?: number
  /** When true, quantity cannot be changed (locked to basket size) */
  lockQty?: boolean
  /** Shown in cart for squares picks */
  squareKeys?: string[]
  onSuccess?: (contestId: string, qty: number) => void
}

const SQUARES_GAMES: SquaresGame[] = [
  {
    id: 'sg-vikings-rams',
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    matchup: 'Vikings @ Rams',
    awayTeam: 'Vikings',
    homeTeam: 'Rams',
    awayAbbr: 'MIN',
    homeAbbr: 'LAR',
    awayLogo: '/team/nfl/min.svg',
    homeLogo: '/team/nfl/la.svg',
    kickoffLabel: 'Live · Q2 in progress',
    playing: 251,
    squaresLeft: 41,
    mySquaresPurchased: 2,
    startDate: hoursFromNow(-2),
    endDate: hoursFromNow(3),
    numbersLocked: true,
    axisTop: [0, 3, 2, 5, 4, 9, 8, 1, 6, 7],
    axisLeft: [8, 6, 0, 4, 7, 1, 3, 5, 2, 9],
    live: {
      period: 'q2',
      buyingFor: 'Q2',
      // Q1 period scores; Q2–Q4 not played yet
      awayQ: [14, null, null, null],
      homeQ: [7, null, null, null],
      settled: [{ label: 'Q1', awayScore: 14, homeScore: 7 }],
    },
    pools: [
      {
        id: 'sg-vikings-rams-2',
        pricePerSquare: '$2',
        prize: '$250',
        squaresLeft: 18,
        playing: 23,
        mySquaresPurchased: 2,
      },
      {
        id: 'sg-vikings-rams-5',
        pricePerSquare: '$5',
        prize: '$500',
        squaresLeft: 14,
        playing: 41,
      },
      {
        id: 'sg-vikings-rams-10',
        pricePerSquare: '$10',
        prize: '$1,500',
        squaresLeft: 9,
        playing: 55,
      },
      {
        id: 'sg-vikings-rams-20',
        pricePerSquare: '$20',
        prize: '$20,000',
        squaresLeft: 0,
        playing: 72,
        featured: true,
      },
    ],
  },
  {
    id: 'sg-mavs-warriors',
    league: { label: 'NBA', icon: '/banners/sports_league/nba.svg' },
    matchup: 'Mavericks vs. Warriors',
    awayTeam: 'Mavericks',
    homeTeam: 'Warriors',
    kickoffLabel: 'Monday, Jan. 13 - 8:00 PM ET',
    playing: 251,
    squaresLeft: 137,
    mySquaresPurchased: 2,
    startDate: hoursFromNow(-20),
    endDate: minutesFromNow(50),
    pools: [
      {
        id: 'sg-mavs-warriors-1',
        pricePerSquare: '$1',
        prize: '$150',
        squaresLeft: 44,
        playing: 61,
        mySquaresPurchased: 1,
      },
      {
        id: 'sg-mavs-warriors-5',
        pricePerSquare: '$5',
        prize: '$750',
        squaresLeft: 33,
        playing: 70,
        mySquaresPurchased: 1,
      },
      {
        id: 'sg-mavs-warriors-20',
        pricePerSquare: '$20',
        prize: '$5,000',
        squaresLeft: 18,
        playing: 82,
        featured: true,
      },
    ],
  },
  {
    id: 'sg-ohio-georgia',
    league: { label: 'NCAAF', icon: '/banners/sports_league/NFL.svg' },
    matchup: 'Ohio State @ Georgia',
    awayTeam: 'Ohio St',
    homeTeam: 'Georgia',
    kickoffLabel: 'Saturday, Jan. 11 - 7:30 PM ET',
    playing: 188,
    squaresLeft: 92,
    startDate: hoursFromNow(-6),
    endDate: hoursFromNow(30),
    pools: [
      {
        id: 'sg-ohio-georgia-5',
        pricePerSquare: '$5',
        prize: '$2,500',
        squaresLeft: 48,
        playing: 52,
      },
      {
        id: 'sg-ohio-georgia-20',
        pricePerSquare: '$20',
        prize: '$10,000',
        squaresLeft: 22,
        playing: 78,
        featured: true,
      },
    ],
  },
  {
    id: 'sg-oilers-panthers',
    league: { label: 'NHL', icon: '/banners/sports_league/NHL.svg' },
    matchup: 'Oilers @ Panthers',
    awayTeam: 'Oilers',
    homeTeam: 'Panthers',
    kickoffLabel: 'Tuesday, Jan. 14 - 8:00 PM ET',
    playing: 140,
    squaresLeft: 61,
    mySquaresPurchased: 1,
    startDate: hoursFromNow(-10),
    endDate: hoursFromNow(36),
    numbersLocked: true,
    axisTop: [3, 7, 1, 9, 0, 5, 2, 8, 4, 6],
    axisLeft: [8, 2, 5, 0, 9, 1, 6, 3, 7, 4],
    pools: [
      {
        id: 'sg-oilers-panthers-2',
        pricePerSquare: '$2',
        prize: '$400',
        squaresLeft: 39,
        playing: 61,
        mySquaresPurchased: 1,
      },
      {
        id: 'sg-oilers-panthers-20',
        pricePerSquare: '$20',
        prize: '$4,000',
        squaresLeft: 22,
        playing: 78,
        featured: true,
      },
    ],
  },
  {
    id: 'sg-chiefs-bills',
    league: { label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    matchup: 'Chiefs @ Bills',
    awayTeam: 'Chiefs',
    homeTeam: 'Bills',
    kickoffLabel: 'Sunday, Jan. 19 - 6:30 PM ET',
    playing: 310,
    squaresLeft: 204,
    startDate: hoursFromNow(12),
    endDate: hoursFromNow(96),
    pools: [
      {
        id: 'sg-chiefs-bills-free',
        pricePerSquare: 'Free',
        prize: '$1,000',
        squaresLeft: 88,
        playing: 12,
      },
      {
        id: 'sg-chiefs-bills-10',
        pricePerSquare: '$10',
        prize: '$5,000',
        squaresLeft: 70,
        playing: 30,
      },
      {
        id: 'sg-chiefs-bills-20',
        pricePerSquare: '$20',
        prize: '$25,000',
        squaresLeft: 46,
        playing: 54,
        featured: true,
      },
    ],
  },
]

function poolToContestCard(game: SquaresGame, pool: SquaresPool): ContestCardData {
  return {
    id: pool.id,
    lobby: 'Squares Lobby',
    name: `${game.matchup} · ${pool.pricePerSquare}/sq`,
    prize: pool.prize,
    contestType: 'Squares',
    entryFee: pool.pricePerSquare,
    entries: String(pool.playing),
    free: pool.pricePerSquare === 'Free',
    league: game.league,
    image: '/banners/contests/card-07.png',
    startDate: game.startDate,
    endDate: game.endDate,
  }
}

/** Deterministic 0–9 shuffle so every pool board has real X/Y digits. */
function shuffleDigits(seed: string): number[] {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  for (let i = digits.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0
    const j = h % (i + 1)
    const tmp = digits[i]
    digits[i] = digits[j]
    digits[j] = tmp
  }
  return digits
}

/** Demo board occupancy for a selected pool (row-col keys). */
function buildDemoBoard(poolId: string): Record<string, SquareCellKind> {
  const seed = poolId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const cells: Record<string, SquareCellKind> = {}
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const n = (seed + r * 11 + c * 7) % 17
      if (n === 0) cells[`${r}-${c}`] = 'mine'
      else if (n <= 6) cells[`${r}-${c}`] = 'taken'
      else cells[`${r}-${c}`] = 'open'
    }
  }
  return cells
}

/** Last digit of a score — how Squares winners are decided. */
function lastDigit(score: number) {
  return Math.abs(score) % 10
}

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
  upcoming: 'border-white/35 bg-white/5 text-white/85',
  open: 'border-white/20 bg-white/[0.08] text-white/85',
  finishing: 'border-[#C4842D]/45 bg-[#C4842D]/15 text-[#F0C48A]',
  closed: 'border-white/15 bg-white/8 text-white/70',
}

function ContestStatusBadge({
  startDate,
  endDate,
  featured,
}: {
  startDate: Date
  endDate: Date
  featured?: boolean
}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const status = getContestStatus(startDate, endDate, now)
  const fireFinish = featured && status.kind === 'finishing'

  return (
    <div
      className={cn(
        'relative inline-flex w-fit max-w-full self-start items-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none',
        fireFinish
          ? 'border-[#E07A2F]/50 bg-[#E07A2F]/18 text-[#FFB078]'
          : STATUS_STYLES[status.kind]
      )}
    >
      {fireFinish && (
        <span
          className="pointer-events-none absolute inset-0 tile-shimmer-fire opacity-80"
          aria-hidden
        />
      )}
      {status.kind === 'upcoming' && (
        <IconCalendarEvent className="relative h-3 w-3 shrink-0" strokeWidth={2} />
      )}
      {status.kind === 'open' && (
        <IconSparkles className="relative h-3 w-3 shrink-0" strokeWidth={2} />
      )}
      {status.kind === 'finishing' && (
        <IconClockFilled className="relative h-3 w-3 shrink-0" />
      )}
      {status.kind === 'closed' && (
        <IconTrophy className="relative h-3 w-3 shrink-0" strokeWidth={2} />
      )}
      <span className="relative truncate">{status.label}</span>
    </div>
  )
}

function entryStatusMeta(status: ContestEntryStatus) {
  switch (status) {
    case 'incomplete':
      return {
        label: 'Incomplete',
        className: 'text-amber-300/90',
        icon: (
          <IconCircleDashed
            className="h-3.5 w-3.5 shrink-0 text-amber-300/90"
            strokeWidth={2}
          />
        ),
      }
    case 'submitted':
      return {
        label: 'Submitted',
        className: 'text-sky-300/90',
        icon: (
          <IconCircleCheck
            className="h-3.5 w-3.5 shrink-0 text-sky-300/90"
            strokeWidth={2}
          />
        ),
      }
    case 'finished':
      return {
        label: 'Finished',
        className: 'text-emerald-300/90',
        icon: (
          <IconTrophy
            className="h-3.5 w-3.5 shrink-0 text-emerald-300/90"
            strokeWidth={2}
          />
        ),
      }
  }
}

function MyEntriesPopover({ entries }: { entries: ContestEntry[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-8 shrink-0 items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-[10px] font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white"
        >
          My Entries
          <IconChevronDown className="h-3 w-3 opacity-50" strokeWidth={2} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        className="dark z-[80] w-[260px] border-white/10 bg-[#2d2d2d] p-0 text-white shadow-xl"
      >
        <div className="border-b border-white/10 px-3 py-2">
          <p className="text-[11px] font-semibold text-white">My Entries</p>
          <p className="text-[10px] text-white/45">
            {entries.length} for this contest
          </p>
        </div>
        <ul className="max-h-[220px] overflow-y-auto py-1">
          {entries.map((entry) => {
            const meta = entryStatusMeta(entry.status)
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  {meta.icon}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[12px] font-medium text-white">
                        {entry.label}
                      </span>
                      <span className={cn('shrink-0 text-[10px] font-medium', meta.className)}>
                        {meta.label}
                      </span>
                    </div>
                    {(entry.score != null || entry.rank != null) && (
                      <p className="mt-0.5 text-[10px] text-white/45">
                        {entry.score}
                        {entry.score != null && entry.rank != null ? ' · ' : ''}
                        {entry.rank != null ? `Rank #${entry.rank}` : ''}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

/** Bulk pricing scaled from the $20 reference tiers in product screenshots */
const ENTRY_TIER_TOTALS = [20, 35, 50, 65, 80, 90, 100, 110] as const

function parseEntryFee(entryFee: string): number {
  if (entryFee === 'Free') return 0
  const n = Number(entryFee.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatMoney(amount: number) {
  if (amount === 0) return 'Free'
  const hasCents = Math.abs(amount % 1) > 0.001
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })}`
}

function getCartTotals(unitPrice: number, qty: number) {
  const safeQty = Math.max(1, qty)
  const list = unitPrice * safeQty
  if (unitPrice === 0) {
    return { list, total: 0, discount: 0, perEntry: 0 }
  }
  if (safeQty > ENTRY_TIER_TOTALS.length) {
    return { list, total: list, discount: 0, perEntry: unitPrice }
  }
  const scale = unitPrice / 20
  const total = Math.round(ENTRY_TIER_TOTALS[safeQty - 1] * scale)
  const discount = Math.max(0, list - total)
  return { list, total, discount, perEntry: total / safeQty }
}

/** Squares: flat price per square × count (no bulk contest tiers). */
function getSquaresCartTotals(pricePerSquare: number, qty: number) {
  const safeQty = Math.max(0, qty)
  const list = pricePerSquare * safeQty
  return {
    list,
    total: list,
    discount: 0,
    perEntry: pricePerSquare,
  }
}

function ContestPurchaseDialog({
  purchase,
  open,
  onOpenChange,
  onPurchased,
}: {
  purchase: ContestPurchaseRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchased: (contestId: string, qty: number) => void
}) {
  const contest = purchase?.contest ?? null
  const lockQty = purchase?.lockQty ?? false
  const squareKeys = purchase?.squareKeys
  const [qty, setQty] = useState(1)
  const [qtyOpen, setQtyOpen] = useState(false)
  const [step, setStep] = useState<'cart' | 'complete'>('cart')
  const [purchasedQty, setPurchasedQty] = useState(1)
  const [purchasedTotal, setPurchasedTotal] = useState(0)

  useEffect(() => {
    if (open && purchase) {
      const nextQty = Math.max(1, purchase.initialQty ?? 1)
      setQty(nextQty)
      setQtyOpen(false)
      setStep('cart')
    }
  }, [open, purchase])

  if (!contest) return null

  const unitPrice = parseEntryFee(contest.entryFee)
  const isFree = unitPrice === 0
  const isSquaresPick = Boolean(squareKeys?.length)
  const { list, total, discount, perEntry } = isSquaresPick
    ? getSquaresCartTotals(unitPrice, qty)
    : getCartTotals(unitPrice, qty)

  const handlePurchase = () => {
    setPurchasedQty(qty)
    setPurchasedTotal(total)
    onPurchased(contest.id, qty)
    purchase?.onSuccess?.(contest.id, qty)
    setStep('complete')
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={typeof document !== 'undefined' ? document.body : undefined}>
        {/* Header is ~100002 on desktop — must sit above it (same as auth modal) */}
        <Dialog.Overlay
          data-contest-purchase-overlay=""
          className="fixed inset-0 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ zIndex: 100010, pointerEvents: 'auto' }}
        />
        <div
          className="fixed inset-0 flex items-center justify-center p-3 pointer-events-none"
          style={{ zIndex: 100011 }}
        >
          <Dialog.Content
            data-contest-purchase-content=""
            className="pointer-events-auto w-full max-w-[420px] max-h-[min(90vh,640px)] overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-[#1c1c1c] text-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            style={{ zIndex: 100011, pointerEvents: 'auto' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <Dialog.Title className="flex items-center gap-2 text-sm font-semibold">
                {step === 'cart' ? (
                  <>
                    <IconShoppingCart className="h-4 w-4 text-white/70" strokeWidth={2} />
                    {isFree ? 'Confirm Entry' : 'Your Cart'}
                  </>
                ) : (
                  <>
                    <IconCircleCheck className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                    Purchase Complete
                  </>
                )}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <IconX className="h-4 w-4" strokeWidth={2} />
                </button>
              </Dialog.Close>
            </div>

            {step === 'cart' ? (
              <>
                <div className="relative h-28 w-full overflow-hidden bg-[#111]">
                  <Image
                    src={contest.image}
                    alt=""
                    fill
                    className="object-cover object-[center_20%]"
                    sizes="420px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <p className="text-[11px] font-medium text-white/60">{contest.contestType}</p>
                    <p className="text-base font-bold leading-tight text-white">{contest.name}</p>
                    <p className="mt-0.5 text-sm font-black tabular-nums text-white">{contest.prize}</p>
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
                          Cart item
                        </p>
                        <p className="mt-1 truncate text-sm font-medium text-white">
                          {isSquaresPick
                            ? `${qty} square${qty === 1 ? '' : 's'} · ${contest.name}`
                            : `${contest.name} entry`}
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/45">
                          {isSquaresPick
                            ? `${formatMoney(unitPrice)} per square · add on the board, then buy`
                            : isFree
                              ? 'Free entry — no charge to your balance'
                              : `List price ${formatMoney(unitPrice)} each · buy more to save`}
                        </p>
                        {isSquaresPick && squareKeys ? (
                          <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-sky-300/80">
                            {squareKeys
                              .slice(0, 12)
                              .map((k) => {
                                const [r, c] = k.split('-')
                                return `(${r},${c})`
                              })
                              .join(' ')}
                            {squareKeys.length > 12 ? ` +${squareKeys.length - 12}` : ''}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-sm font-bold tabular-nums text-white">
                        {formatMoney(isFree ? 0 : perEntry)}
                        <span className="text-[10px] font-medium text-white/40">
                          {isSquaresPick ? ' /sq' : ' /ea'}
                        </span>
                      </p>
                    </div>

                    <div className="relative mt-3">
                      {lockQty ? (
                        <div className="flex h-11 w-full items-center justify-between rounded-lg border border-white/12 bg-[#141414] px-3 text-sm text-white">
                          <span>
                            {qty} {isSquaresPick ? (qty === 1 ? 'Square' : 'Squares') : qty === 1 ? 'Entry' : 'Entries'}
                          </span>
                          <span className="font-semibold tabular-nums">{formatMoney(total)}</span>
                        </div>
                      ) : (
                        <>
                      <button
                        type="button"
                        onClick={() => setQtyOpen((v) => !v)}
                        className="flex h-11 w-full items-center justify-between rounded-lg border border-white/12 bg-[#141414] px-3 text-sm text-white transition-colors hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                      >
                        <span>
                          {qty} {qty === 1 ? 'Entry' : 'Entries'}
                        </span>
                        <span className="flex items-center gap-2 font-semibold tabular-nums">
                          {formatMoney(total)}
                          <IconChevronDown
                            className={cn(
                              'h-4 w-4 text-white/50 transition-transform',
                              qtyOpen && 'rotate-180'
                            )}
                            strokeWidth={2}
                          />
                        </span>
                      </button>
                      {qtyOpen && (
                        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-48 overflow-y-auto rounded-lg border border-white/12 bg-[#222] py-1 shadow-xl">
                          {ENTRY_TIER_TOTALS.map((_, i) => {
                            const n = i + 1
                            const tier = getCartTotals(unitPrice, n)
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() => {
                                  setQty(n)
                                  setQtyOpen(false)
                                }}
                                className={cn(
                                  'flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-white/[0.06]',
                                  qty === n && 'bg-white/[0.08]'
                                )}
                              >
                                <span>
                                  {n} {n === 1 ? 'Entry' : 'Entries'}
                                </span>
                                <span className="font-semibold tabular-nums">
                                  {formatMoney(tier.total)}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[12px]">
                    <div className="flex justify-between text-white/55">
                      <span>
                        Subtotal ({qty} {qty === 1 ? 'entry' : 'entries'})
                      </span>
                      <span className="tabular-nums">{formatMoney(list)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400/90">
                        <span>Bulk discount</span>
                        <span className="tabular-nums">−{formatMoney(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-white/10 pt-1.5 text-sm font-bold text-white">
                      <span>Total</span>
                      <span className="tabular-nums">{formatMoney(total)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-white/40">
                    {isSquaresPick
                      ? isFree
                        ? `You're confirming ${qty} free square${qty === 1 ? '' : 's'} for ${contest.name}.`
                        : `You're buying ${qty} square${qty === 1 ? '' : 's'} for ${contest.name}. ${formatMoney(total)} will be deducted from your balance.`
                      : isFree
                        ? `You're confirming ${qty} free ${qty === 1 ? 'entry' : 'entries'} for ${contest.name}.`
                        : `You're buying ${qty} ${qty === 1 ? 'entry' : 'entries'} for ${contest.name}. ${formatMoney(total)} will be deducted from your balance.`}
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center px-3 text-xs font-semibold uppercase tracking-wide text-white/55 transition-colors hover:text-white"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      type="button"
                      onClick={handlePurchase}
                      className="inline-flex h-10 min-w-[9rem] items-center justify-center rounded-md px-4 text-xs font-bold uppercase leading-none tracking-wide text-white transition-all hover:brightness-110 active:scale-[0.98]"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    >
                      {isFree ? 'Confirm' : 'Purchase'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center px-6 py-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">
                  <IconCheck className="h-7 w-7 text-emerald-400" strokeWidth={2.5} />
                </div>
                <p className="text-lg font-bold text-white">Purchase Complete</p>
                <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-white/55">
                  {purchasedQty} {purchasedQty === 1 ? 'entry' : 'entries'} for{' '}
                  <span className="font-medium text-white/80">{contest.name}</span>
                  {purchasedTotal > 0 ? (
                    <>
                      {' '}
                      — charged{' '}
                      <span className="font-semibold tabular-nums text-white">
                        {formatMoney(purchasedTotal)}
                      </span>
                    </>
                  ) : (
                    ' — free'
                  )}
                  .
                </p>
                <div className="mt-5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-[12px]">
                  <div className="flex justify-between text-white/50">
                    <span>Contest</span>
                    <span className="max-w-[60%] truncate text-right text-white/80">
                      {contest.name}
                    </span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-white/50">
                    <span>Entries</span>
                    <span className="tabular-nums text-white/80">{purchasedQty}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between border-t border-white/10 pt-1.5 font-semibold text-white">
                    <span>Paid</span>
                    <span className="tabular-nums">{formatMoney(purchasedTotal)}</span>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-xs font-bold uppercase leading-none tracking-wide text-white transition-all hover:brightness-110"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                  >
                    Done
                  </button>
                </Dialog.Close>
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function ContestCard({
  contest,
  index,
  myEntries,
  onPurchase,
}: {
  contest: ContestCardData
  index: number
  myEntries: ContestEntry[]
  onPurchase: (contest: ContestCardData) => void
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
      className={cn(
        'contest-card dark group relative flex min-h-[200px] overflow-hidden rounded-xl border bg-[#1a1a1a] text-white transition-[border-color,transform] duration-300 sm:min-h-[180px]',
        contest.featured
          ? 'border-[#ff6b35]/35 hover:border-[#ff6b35]/55'
          : 'border-white/10 hover:border-white/20'
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100',
          contest.featured ? 'tile-shimmer-fire opacity-60 group-hover:opacity-100' : 'tile-shimmer'
        )}
        aria-hidden
      />
      {contest.featured && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top_left,rgba(255,107,53,0.12),transparent_55%)]"
          aria-hidden
        />
      )}

      {/* Right art — mask fades into dark card surface */}
      <div className="contest-card-art pointer-events-none absolute inset-y-0 right-0 z-0 w-[52%] overflow-hidden sm:w-[42%] sm:max-w-[168px]">
        <Image
          src={contest.image}
          alt=""
          fill
          className={cn(
            'contest-card-art-img scale-105 object-cover object-[70%_center] transition-transform duration-500 group-hover:scale-110 sm:object-[center_18%]',
            !canEnter && 'opacity-80 grayscale-[0.2]'
          )}
          sizes="(max-width: 640px) 52vw, 168px"
          unoptimized
        />
        <div className="contest-card-art-fade absolute inset-0" aria-hidden />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-2.5 p-3.5 pr-[48%] sm:pr-[38%]">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-white/5">
              <Image
                src={contest.league.icon}
                alt={contest.league.label}
                width={16}
                height={16}
                className="object-contain"
                unoptimized
              />
            </div>
            {contest.featured && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] text-[#ff6b35]"
                    aria-label="Featured contest"
                  >
                    <IconFlame className="h-3.5 w-3.5" fill="currentColor" stroke={1.5} />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  portal
                  side="top"
                  className="dark z-[200] border-white/10 bg-[#2d2d2d] px-2.5 py-1 text-xs text-white"
                >
                  Featured contest
                </TooltipContent>
              </Tooltip>
            )}
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

        <ContestStatusBadge
          startDate={contest.startDate}
          endDate={contest.endDate}
          featured={contest.featured}
        />

        <div className="space-y-1.5">
          {[
            { label: 'Type', value: contest.contestType },
            { label: 'Entry', value: contest.entryFee },
            { label: 'Entries', value: contest.entries },
          ].map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[3.25rem_1fr] items-baseline gap-x-3 text-[11px] leading-none"
            >
              <span className="text-white/45">{row.label}</span>
              <span className="font-semibold text-white/70">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-1 pr-14 sm:pr-0">
          <button
            type="button"
            className="flex h-8 shrink-0 items-center rounded-md border border-white/10 bg-white/5 px-2.5 text-[10px] font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white"
          >
            Rules
          </button>
          {myEntries.length > 0 && <MyEntriesPopover entries={myEntries} />}
        </div>
      </div>

      {canEnter ? (
        <button
          type="button"
          onClick={() => onPurchase(contest)}
          className="absolute bottom-3 right-3 z-30 flex h-8 max-w-[calc(100%-1.5rem)] shrink-0 items-center justify-center rounded-md px-2.5 text-[11px] font-bold whitespace-nowrap text-white shadow-[0_2px_8px_rgba(238,53,54,0.35)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] sm:px-3 sm:text-xs"
          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
        >
          {ctaLabel}
        </button>
      ) : (
        <span className="absolute bottom-3 right-3 z-30 flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/10 px-2.5 text-[11px] font-semibold text-white/45 sm:px-3 sm:text-xs">
          {ctaLabel}
        </span>
      )}
    </motion.div>
  )
}

export function ContestsPage() {
  const [lobby, setLobby] = useState<ContestLobby>('Lobby')
  const [squaresLobbyOpen, setSquaresLobbyOpen] = useState(false)
  const [purchase, setPurchase] = useState<ContestPurchaseRequest | null>(null)
  const [entriesByContest, setEntriesByContest] = useState<Record<string, ContestEntry[]>>(() => {
    const seed: Record<string, ContestEntry[]> = {}
    for (const c of CONTESTS) {
      if (c.myEntries?.length) seed[c.id] = c.myEntries
    }
    return seed
  })

  const visibleContests = useMemo(() => {
    if (lobby === 'Help') return []
    if (lobby === 'My Entries') {
      return CONTESTS.filter((c) => (entriesByContest[c.id]?.length ?? 0) > 0)
    }
    if (lobby === 'Lobby' || EXTERNAL_LOBBY_TABS.has(lobby)) {
      return CONTESTS.filter((c) => c.lobby === 'Lobby')
    }
    return CONTESTS.filter((c) => c.lobby === lobby)
  }, [lobby, entriesByContest])

  const openExternalLobby = (tab: ContestLobby) => {
    if (tab === 'Squares Lobby') setSquaresLobbyOpen(true)
  }

  const handlePurchased = (contestId: string, qty: number) => {
    setEntriesByContest((prev) => {
      const existing = prev[contestId] ?? []
      const start = existing.length + 1
      const added: ContestEntry[] = Array.from({ length: qty }, (_, i) => ({
        id: `${contestId}-buy-${Date.now()}-${i}`,
        label: `Entry #${start + i}`,
        status: 'submitted' as const,
      }))
      return { ...prev, [contestId]: [...existing, ...added] }
    })
  }

  return (
    <TooltipProvider delayDuration={200}>
    <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
      <div className="w-full px-3 pb-10 pt-6 md:px-6 md:pt-8">
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-[var(--ds-fg)] md:text-3xl">
            Contests
          </h1>

          <div className="overflow-x-auto scrollbar-hide">
            <AnimateTabs
              value={lobby}
              onValueChange={(value) => {
                const next = value as ContestLobby
                if (EXTERNAL_LOBBY_TABS.has(next)) {
                  openExternalLobby(next)
                  return
                }
                setLobby(next)
              }}
              className="w-max min-w-full"
            >
              <AnimateTabsList className="relative h-auto gap-1 rounded-3xl border-0 bg-[var(--ds-control-bg)] p-0.5 transition-colors duration-300">
                {CONTEST_LOBBIES.flatMap((tab, index) => {
                  const items = []
                  if (index === SQUARES_LOBBY_TAB_INDEX) {
                    items.push(
                      <span
                        key="lobby-divider"
                        aria-hidden
                        className="mx-0.5 h-4 w-px shrink-0 self-center bg-[var(--ds-fg-subtle)]/35"
                      />
                    )
                  }
                  const isExternal = EXTERNAL_LOBBY_TABS.has(tab)
                  items.push(
                    <TabsTab
                      key={tab}
                      value={tab}
                      onClick={(e) => {
                        if (!isExternal) return
                        e.preventDefault()
                        openExternalLobby(tab)
                      }}
                      className={cn(
                        'relative z-10 flex h-9 items-center gap-1.5 rounded-2xl px-4 py-1 text-xs font-medium transition-colors duration-300 ease-in-out',
                        'text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]',
                        'data-[state=active]:text-white',
                        'focus-visible:outline-none focus-visible:ring-0 active:bg-transparent active:outline-none',
                        'whitespace-nowrap'
                      )}
                    >
                      {lobby === tab && !isExternal && (
                        <motion.div
                          layoutId="activeContestLobbyTab"
                          className="absolute inset-0 -z-10 rounded-2xl"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">{tab}</span>
                      {isExternal ? (
                        <IconExternalLink
                          className="relative z-10 size-3.5 shrink-0 opacity-60"
                          strokeWidth={2}
                          aria-hidden
                        />
                      ) : null}
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
              Learn how entries, scoring, and payouts work across Lobby,
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
            {lobby === 'My Entries'
              ? 'No entries yet. Join a contest from Lobby to see them here.'
              : `No contests in ${lobby} right now. Check Lobby for live games.`}
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}
          >
            {visibleContests.map((contest, index) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                index={index}
                myEntries={entriesByContest[contest.id] ?? []}
                onPurchase={(contest) => setPurchase({ contest })}
              />
            ))}
          </div>
        )}
      </div>

      <SquaresLobbyDialog
        open={squaresLobbyOpen}
        onOpenChange={setSquaresLobbyOpen}
        games={SQUARES_GAMES}
        entriesByContest={entriesByContest}
        onPurchase={(req) => setPurchase(req)}
      />

      <ContestPurchaseDialog
        purchase={purchase}
        open={purchase != null}
        onOpenChange={(open) => {
          if (!open) setPurchase(null)
        }}
        onPurchased={handlePurchased}
      />
    </SidebarInset>
    </TooltipProvider>
  )
}

function SquaresLobbyDialog({
  open,
  onOpenChange,
  games,
  entriesByContest,
  onPurchase,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  games: SquaresGame[]
  entriesByContest: Record<string, ContestEntry[]>
  onPurchase: (req: ContestPurchaseRequest) => void
}) {
  type SquaresView = 'lobby' | 'squares' | 'mine' | 'rules'
  type SportFilter = 'ALL' | 'NFL' | 'NCAAF' | 'NBA' | 'NHL'

  const SPORT_FILTERS: {
    id: SportFilter
    label: string
    icon?: string
  }[] = [
    { id: 'ALL', label: 'All leagues' },
    { id: 'NFL', label: 'NFL', icon: '/banners/sports_league/NFL.svg' },
    { id: 'NCAAF', label: 'NCAAF', icon: '/sports_icons/football.svg' },
    { id: 'NBA', label: 'NBA', icon: '/banners/sports_league/nba.svg' },
    { id: 'NHL', label: 'NHL', icon: '/banners/sports_league/NHL.svg' },
  ]

  const [view, setView] = useState<SquaresView>('squares')
  const [sport, setSport] = useState<SportFilter>('ALL')
  const selectedSportMeta =
    SPORT_FILTERS.find((f) => f.id === sport) ?? SPORT_FILTERS[0]
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [enteredPoolId, setEnteredPoolId] = useState<string | null>(null)
  const [statsOpen, setStatsOpen] = useState(false)
  const [boards, setBoards] = useState<Record<string, Record<string, SquareCellKind>>>({})
  /** Selected squares awaiting purchase, keyed by pool id */
  const [basketByPool, setBasketByPool] = useState<Record<string, string[]>>({})
  /** Hovered cell for row/column crosshair (classic squares UX) */
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(
    null
  )

  const filteredGames = useMemo(() => {
    const list =
      sport === 'ALL' ? games : games.filter((g) => g.league.label === sport)
    if (view === 'mine') {
      return list.filter(
        (g) =>
          (g.mySquaresPurchased ?? 0) > 0 ||
          g.pools.some(
            (p) =>
              (p.mySquaresPurchased ?? 0) > 0 ||
              (entriesByContest[p.id]?.length ?? 0) > 0
          )
      )
    }
    return list
  }, [entriesByContest, games, sport, view])

  useEffect(() => {
    if (!open) return
    setView('squares')
    setSport('ALL')
    setStatsOpen(false)
    setEnteredPoolId(null)
    setSelectedGameId(null)
  }, [open])

  useEffect(() => {
    if (filteredGames.length === 0) {
      setSelectedGameId(null)
      setEnteredPoolId(null)
      return
    }
    // Drop selection if the active game disappears from the current filter
    if (selectedGameId && !filteredGames.some((g) => g.id === selectedGameId)) {
      setSelectedGameId(null)
      setEnteredPoolId(null)
    }
  }, [filteredGames, selectedGameId])

  const selectedGame =
    filteredGames.find((g) => g.id === selectedGameId) ?? null

  useEffect(() => {
    if (!selectedGame) {
      setEnteredPoolId(null)
      return
    }
    if (
      enteredPoolId &&
      !selectedGame.pools.some((p) => p.id === enteredPoolId)
    ) {
      setEnteredPoolId(null)
    }
  }, [selectedGame, enteredPoolId])

  const selectedPool =
    selectedGame?.pools.find((p) => p.id === enteredPoolId) ?? null
  const boardReady = Boolean(selectedGame && selectedPool)

  useEffect(() => {
    if (!selectedPool) return
    setBoards((prev) => {
      if (prev[selectedPool.id]) return prev
      return { ...prev, [selectedPool.id]: buildDemoBoard(selectedPool.id) }
    })
  }, [selectedPool])

  const board = selectedPool ? boards[selectedPool.id] ?? {} : {}
  const basketKeys = selectedPool ? basketByPool[selectedPool.id] ?? [] : []
  const basketSet = useMemo(() => new Set(basketKeys), [basketKeys])
  const axisTop = useMemo(() => {
    if (!selectedPool) return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    if (selectedGame?.numbersLocked && selectedGame.axisTop) {
      return selectedGame.axisTop
    }
    return shuffleDigits(`${selectedPool.id}-top`)
  }, [selectedPool, selectedGame])
  const axisLeft = useMemo(() => {
    if (!selectedPool) return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    if (selectedGame?.numbersLocked && selectedGame.axisLeft) {
      return selectedGame.axisLeft
    }
    return shuffleDigits(`${selectedPool.id}-left`)
  }, [selectedPool, selectedGame])

  /** Settled quarter wins on locked boards (last-digit intersections). */
  const settledWins = useMemo(() => {
    const live = selectedGame?.live
    if (!live?.settled?.length) return []
    return live.settled.flatMap((w) => {
      const row = axisLeft.indexOf(lastDigit(w.awayScore))
      const col = axisTop.indexOf(lastDigit(w.homeScore))
      if (row < 0 || col < 0) return []
      return [
        {
          ...w,
          row,
          col,
          awayDigit: lastDigit(w.awayScore),
          homeDigit: lastDigit(w.homeScore),
        },
      ]
    })
  }, [selectedGame, axisLeft, axisTop])

  const winAt = (row: number, col: number) =>
    settledWins.find((w) => w.row === row && w.col === col) ?? null

  const liveTotals = useMemo(() => {
    const live = selectedGame?.live
    if (!live) return null
    const sum = (qs: (number | null)[]) =>
      qs.reduce<number>((a, n) => a + (n ?? 0), 0)
    return { away: sum(live.awayQ), home: sum(live.homeQ) }
  }, [selectedGame])

  useEffect(() => {
    setHoverCell(null)
  }, [enteredPoolId])

  useEffect(() => {
    if (selectedGame?.live && enteredPoolId) setStatsOpen(true)
  }, [selectedGame?.id, selectedGame?.live, enteredPoolId])

  const cellDisplayKind = (key: string): SquareCellKind => {
    const base = board[key] ?? 'open'
    if (base === 'open' && basketSet.has(key)) return 'basket'
    return base
  }

  const handleCellClick = (row: number, col: number) => {
    if (!selectedPool) return
    if (winAt(row, col)) return
    const key = `${row}-${col}`
    const base = board[key] ?? 'open'
    if (base !== 'open') return

    setBasketByPool((prev) => {
      const current = prev[selectedPool.id] ?? []
      const inBasket = current.includes(key)
      const next = inBasket
        ? current.filter((k) => k !== key)
        : [...current, key]
      return { ...prev, [selectedPool.id]: next }
    })
  }

  const clearBasket = () => {
    if (!selectedPool) return
    setBasketByPool((prev) => ({ ...prev, [selectedPool.id]: [] }))
  }

  const checkoutBasket = () => {
    if (!selectedGame || !selectedPool || basketKeys.length === 0) return
    const keys = [...basketKeys]
    const qty = keys.length
    onPurchase({
      contest: poolToContestCard(selectedGame, selectedPool),
      initialQty: qty,
      lockQty: true,
      squareKeys: keys,
      onSuccess: () => {
        setBoards((prev) => {
          const poolBoard = { ...(prev[selectedPool.id] ?? {}) }
          for (const k of keys) poolBoard[k] = 'mine'
          return { ...prev, [selectedPool.id]: poolBoard }
        })
        setBasketByPool((prev) => ({
          ...prev,
          [selectedPool.id]: [],
        }))
      },
    })
  }

  const basketUnit = selectedPool ? parseEntryFee(selectedPool.pricePerSquare) : 0
  const basketTotals =
    basketKeys.length > 0 ? getSquaresCartTotals(basketUnit, basketKeys.length) : null

  const gamePurchasedCount = (game: SquaresGame) => {
    const fromPools = game.pools.reduce(
      (sum, p) => sum + (p.mySquaresPurchased ?? 0) + (entriesByContest[p.id]?.length ?? 0),
      0
    )
    return Math.max(game.mySquaresPurchased ?? 0, fromPools)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={typeof document !== 'undefined' ? document.body : undefined}>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ zIndex: 100010, pointerEvents: 'auto' }}
        />
        <div
          className="fixed inset-0 flex items-center justify-center p-3 pointer-events-none sm:p-3 md:p-4"
          style={{ zIndex: 100011 }}
        >
          <Dialog.Content
            className="pointer-events-auto flex h-[calc(100dvh-1.5rem)] w-full max-w-[90rem] max-h-[1040px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] text-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:h-[min(96vh,1040px)] sm:rounded-xl"
            style={{ zIndex: 100011, pointerEvents: 'auto' }}
          >
            <Dialog.Title className="sr-only">Squares Lobby</Dialog.Title>
            <Dialog.Description className="sr-only">
              Browse games with multiple square pools, enter a pool, and pick squares on the board.
            </Dialog.Description>

            <div
              className={cn(
                'items-center gap-1 border-b border-white/10 px-2 pt-2 sm:px-4',
                boardReady ? 'hidden lg:flex' : 'flex'
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-0 overflow-x-auto scrollbar-hide">
                {(
                  [
                    { id: 'lobby' as const, label: 'Lobby' },
                    { id: 'squares' as const, label: 'Squares Lobby' },
                    { id: 'mine' as const, label: 'My Squares' },
                    { id: 'rules' as const, label: 'Rules' },
                  ] as const
                ).map((tab) => {
                  const active = view === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        if (tab.id === 'lobby') {
                          onOpenChange(false)
                          return
                        }
                        setView(tab.id)
                      }}
                      className={cn(
                        'relative flex h-11 shrink-0 items-center gap-1.5 px-3 text-sm font-medium transition-colors sm:px-4',
                        active
                          ? 'text-[var(--ds-primary,#ee3536)]'
                          : 'text-white/45 hover:text-white/75'
                      )}
                    >
                      {tab.label}
                      {tab.id === 'squares' ? (
                        <IconExternalLink
                          className="size-3.5 opacity-60"
                          strokeWidth={2}
                          aria-hidden
                        />
                      ) : null}
                      {active ? (
                        <span
                          className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                        />
                      ) : null}
                    </button>
                  )
                })}
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close Squares Lobby"
                >
                  <IconX className="size-4" strokeWidth={2} />
                </button>
              </Dialog.Close>
            </div>

            {view === 'rules' ? (
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
                <h3 className="text-lg font-semibold">Squares Rules</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/65">
                  <li>
                    A Squares board is a 10×10 grid (100 squares). Home team digits run across the
                    top; away team digits run down the side.
                  </li>
                  <li>
                    Buy squares at the pool price, then numbers 0–9 are randomly locked to each
                    axis (usually when the board fills or at kickoff).
                  </li>
                  <li>
                    Winners are the square where the last digit of each team&apos;s score meets —
                    typically paid at Q1, half, Q3, and final.
                  </li>
                  <li>
                    Example: away 14, home 27 → look for away digit 4 and home digit 7. That
                    intersection wins.
                  </li>
                  <li>Each game can offer multiple pools at different prices per square.</li>
                </ul>
              </div>
            ) : (
              <div
                className={cn(
                  'flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden',
                  boardReady ? 'overflow-hidden' : 'overflow-y-auto overscroll-contain lg:overflow-hidden'
                )}
              >
                {/* Left: filters + games — full-screen on mobile until Enter */}
                <aside
                  className={cn(
                    'flex min-w-0 shrink-0 flex-col border-white/10 bg-[#141414] lg:h-full lg:shrink-0 lg:border-r',
                    boardReady
                      ? 'hidden w-full lg:flex lg:w-[300px] xl:w-[320px]'
                      : 'w-full min-h-0 flex-1 lg:w-[min(100%,28rem)]'
                  )}
                >
                  <div className="shrink-0 border-b border-white/10 px-3 py-3">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex h-10 w-full items-center gap-2.5 rounded-xl border border-white/12 bg-[#1c1c1c] px-3 text-left text-sm font-medium text-white outline-none transition-colors hover:border-white/25 hover:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-white/25 data-[state=open]:border-white/30 data-[state=open]:bg-white/[0.04]"
                        >
                          {selectedSportMeta.icon ? (
                            <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/5">
                              <Image
                                src={selectedSportMeta.icon}
                                alt=""
                                width={16}
                                height={16}
                                className="object-contain"
                                unoptimized
                              />
                            </span>
                          ) : (
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/55">
                              <IconFilter className="size-3.5" strokeWidth={2} />
                            </span>
                          )}
                          <span className="min-w-0 flex-1 truncate">
                            {selectedSportMeta.label}
                          </span>
                          <IconChevronDown
                            className="size-4 shrink-0 text-white/45"
                            strokeWidth={2}
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        sideOffset={6}
                        className="z-[100020] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[280px] border-white/12 bg-[#1c1c1c] p-1.5 text-white shadow-2xl"
                      >
                        {SPORT_FILTERS.map((filter) => {
                          const active = sport === filter.id
                          return (
                            <DropdownMenuItem
                              key={filter.id}
                              onSelect={() => setSport(filter.id)}
                              className={cn(
                                'cursor-pointer gap-2.5 rounded-lg px-2.5 py-2.5 text-sm focus:bg-white/[0.06] focus:text-white',
                                active && 'bg-white/[0.08] text-white'
                              )}
                            >
                              {filter.icon ? (
                                <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/5">
                                  <Image
                                    src={filter.icon}
                                    alt=""
                                    width={18}
                                    height={18}
                                    className="object-contain"
                                    unoptimized
                                  />
                                </span>
                              ) : (
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/55">
                                  <IconFilter className="size-4" strokeWidth={2} />
                                </span>
                              )}
                              <span className="flex-1 font-medium">{filter.label}</span>
                              {active ? (
                                <IconCheck
                                  className="size-4 text-white/70"
                                  strokeWidth={2.5}
                                />
                              ) : null}
                            </DropdownMenuItem>
                          )
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-3">
                    <p className="mb-2 px-1 text-[11px] text-white/40 lg:hidden">
                      Expand a game, then tap Enter on a pool to open the board.
                    </p>
                    {filteredGames.length === 0 ? (
                      <p className="px-2 py-8 text-center text-xs text-white/40">
                        No games for this filter.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {filteredGames.map((game) => {
                          const expanded = game.id === selectedGameId
                          const purchased = gamePurchasedCount(game)
                          return (
                            <li key={game.id}>
                              <div
                                className={cn(
                                  'rounded-xl border bg-[#1a1a1a] text-white transition-[border-color] duration-200',
                                  expanded
                                    ? 'border-white/20'
                                    : 'overflow-hidden border-white/10 hover:border-white/20'
                                )}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (game.id === selectedGameId) {
                                      setSelectedGameId(null)
                                      setEnteredPoolId(null)
                                      return
                                    }
                                    setEnteredPoolId(null)
                                    setSelectedGameId(game.id)
                                  }}
                                  className={cn(
                                    'flex w-full items-start gap-2.5 px-3 py-3 text-left transition-colors',
                                    expanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.03]'
                                  )}
                                >
                                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/5 ring-1 ring-white/10">
                                    <Image
                                      src={game.league.icon}
                                      alt=""
                                      width={18}
                                      height={18}
                                      className="object-contain"
                                      unoptimized
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="truncate text-[13px] font-semibold text-white">
                                        {game.matchup}
                                      </p>
                                      {game.live ? (
                                        <span className="rounded-md border border-[var(--ds-primary,#ee3536)]/40 bg-[var(--ds-primary,#ee3536)]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--ds-primary,#ee3536)]">
                                          Live ·{' '}
                                          {game.live.period === 'q2'
                                            ? 'Q2'
                                            : game.live.period.toUpperCase()}
                                        </span>
                                      ) : null}
                                      {expanded ? (
                                        <ContestStatusBadge
                                          startDate={game.startDate}
                                          endDate={game.endDate}
                                        />
                                      ) : null}
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-white/55">
                                      {expanded
                                        ? game.kickoffLabel
                                        : `${game.league.label} · ${game.pools.length} pools · ${game.squaresLeft} left`}
                                    </p>
                                    {expanded ? (
                                      <p className="mt-0.5 text-[11px] text-white/45">
                                        {game.playing} playing / {game.squaresLeft} Squares Left
                                      </p>
                                    ) : null}
                                    {purchased > 0 ? (
                                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-white/55">
                                        <IconTicket className="size-3 text-white/40" strokeWidth={2} />
                                        {purchased} squares purchased
                                      </p>
                                    ) : null}
                                  </div>
                                  <IconChevronDown
                                    className={cn(
                                      'mt-1 size-4 shrink-0 transition-transform',
                                      expanded ? 'rotate-180 text-white/70' : 'text-white/35'
                                    )}
                                    strokeWidth={2}
                                  />
                                </button>

                                {expanded ? (
                                  <div className="border-t border-white/[0.05] p-2">
                                    <div className="overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]">
                                      <div className="flex items-center gap-2 border-b border-white/[0.04] bg-black/15 px-3 py-2 text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">
                                        <span className="min-w-0 flex-1">Pool</span>
                                        <span className="w-14 shrink-0 text-right">Left</span>
                                        <span className="w-[4.75rem] shrink-0 text-right">
                                          Action
                                        </span>
                                      </div>
                                      <ul className="divide-y divide-white/[0.04]">
                                        {game.pools.map((pool) => {
                                          const active = pool.id === enteredPoolId
                                          const poolEntries =
                                            entriesByContest[pool.id] ?? []
                                          const poolPurchased =
                                            (pool.mySquaresPurchased ?? 0) +
                                            poolEntries.length
                                          const enterPool = () => {
                                            setSelectedGameId(game.id)
                                            setEnteredPoolId(pool.id)
                                            setStatsOpen(false)
                                          }
                                          return (
                                            <li
                                              key={pool.id}
                                              className={cn(
                                                'flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-white/[0.03]',
                                                active && 'bg-white/[0.04]'
                                              )}
                                            >
                                              <button
                                                type="button"
                                                onClick={enterPool}
                                                className="min-w-0 flex-1 text-left"
                                              >
                                                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                                  <span className="text-sm font-medium tabular-nums text-[var(--ds-fg)]">
                                                    {pool.pricePerSquare}
                                                    <span className="ml-0.5 text-[11px] font-normal text-[var(--ds-fg-subtle)]">
                                                      /sq
                                                    </span>
                                                  </span>
                                                  <span className="inline-flex items-center gap-1 text-sm font-medium tabular-nums text-[var(--ds-fg)]">
                                                    {pool.featured ? (
                                                      <IconStarFilled className="size-3.5 text-[#ff6b35]" />
                                                    ) : null}
                                                    {pool.prize}
                                                  </span>
                                                </span>
                                                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[var(--ds-fg-subtle)]">
                                                  {pool.playing > 0 ? (
                                                    <span>{pool.playing} playing</span>
                                                  ) : null}
                                                  {poolPurchased > 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-white/50">
                                                      <IconTicket
                                                        className="size-3 text-white/35"
                                                        strokeWidth={2}
                                                      />
                                                      {poolPurchased} yours
                                                    </span>
                                                  ) : null}
                                                </span>
                                              </button>
                                              <span className="w-14 shrink-0 text-right text-sm tabular-nums text-[var(--ds-fg-muted)]">
                                                {pool.squaresLeft}
                                              </span>
                                              <button
                                                type="button"
                                                onClick={enterPool}
                                                className={cn(
                                                  'h-8 w-[4.75rem] shrink-0 rounded-md text-[11px] font-bold uppercase tracking-wide text-white transition-all duration-200 active:scale-[0.98]',
                                                  active
                                                    ? 'border border-white/[0.08] bg-white/[0.04] text-[var(--ds-fg-muted)] hover:bg-white/[0.06]'
                                                    : 'hover:brightness-110'
                                                )}
                                                style={
                                                  active
                                                    ? undefined
                                                    : {
                                                        backgroundColor:
                                                          'var(--ds-primary, #ee3536)',
                                                      }
                                                }
                                              >
                                                {active ? 'Playing' : 'Enter'}
                                              </button>
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </aside>

                {/* Right: desktop onboarding / board — mobile board-only when Entered */}
                <div
                  className={cn(
                    'min-w-0 flex-col bg-[#1a1a1a] lg:min-h-0 lg:flex-1 lg:overflow-hidden',
                    boardReady
                      ? 'flex min-h-0 flex-1 overflow-hidden'
                      : 'hidden lg:flex'
                  )}
                >
                  {selectedGame && selectedPool ? (
                    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
                      {/* Mobile board chrome — one compact row */}
                      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-2 py-1.5 lg:hidden">
                        <button
                          type="button"
                          onClick={() => setEnteredPoolId(null)}
                          className="flex h-9 shrink-0 items-center gap-1 rounded-lg px-1.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10"
                          aria-label="Back to games"
                        >
                          <IconArrowLeft className="size-4" strokeWidth={2.5} />
                        </button>
                        <div className="min-w-0 flex-1">
                          {selectedGame.live ? (
                            <p className="truncate text-[12px] font-semibold text-white/70">
                              {selectedPool.pricePerSquare}/sq · {selectedPool.prize}
                            </p>
                          ) : (
                            <>
                              <p className="truncate text-[13px] font-semibold text-white">
                                {selectedGame.matchup}
                              </p>
                              <p className="truncate text-[10px] text-white/45">
                                {selectedPool.pricePerSquare}/sq · {selectedPool.prize}
                              </p>
                            </>
                          )}
                        </div>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="Close"
                          >
                            <IconX className="size-4" strokeWidth={2} />
                          </button>
                        </Dialog.Close>
                      </div>

                      {/* Live scoreboard */}
                      {selectedGame.live && liveTotals ? (
                        <div
                          className="shrink-0 border-b border-white/[0.04] px-3 py-3 sm:px-4 sm:py-3.5"
                          style={{
                            background:
                              'linear-gradient(180deg, #1e1e1e 0%, #171717 50%, #121212 100%)',
                          }}
                        >
                          <div className="flex items-center justify-between gap-1 sm:gap-3">
                              {/* Away: logo + abbr + score */}
                              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                                <div className="flex shrink-0 flex-col items-center gap-1">
                                  <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/30 sm:size-14">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={
                                        selectedGame.awayLogo ??
                                        selectedGame.league.icon
                                      }
                                      alt=""
                                      className="size-7 object-contain sm:size-9"
                                    />
                                  </span>
                                  <span className="text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
                                    {selectedGame.awayAbbr ??
                                      selectedGame.awayTeam.slice(0, 3)}
                                  </span>
                                </div>
                                <span className="text-[28px] font-black tabular-nums leading-none text-white sm:text-[34px]">
                                  {liveTotals.away}
                                </span>
                              </div>

                              {/* Center status */}
                              <div className="flex shrink-0 flex-col items-center px-1">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--ds-primary,#ee3536)] sm:text-[11px]">
                                  <span className="size-1.5 animate-pulse rounded-full bg-[var(--ds-primary,#ee3536)]" />
                                  Live ·{' '}
                                  {selectedGame.live.period === 'q2'
                                    ? 'Q2'
                                    : selectedGame.live.period.toUpperCase()}
                                </span>
                                <p className="mt-1 hidden text-center text-[10px] text-white/45 sm:block">
                                  {settledWins[0]
                                    ? `${settledWins[0].label} paid · ${selectedGame.live.buyingFor ?? 'open'}+ open`
                                    : selectedPool.pricePerSquare + '/sq'}
                                </p>
                              </div>

                              {/* Home: score + logo + abbr */}
                              <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
                                <span className="text-[28px] font-black tabular-nums leading-none text-white sm:text-[34px]">
                                  {liveTotals.home}
                                </span>
                                <div className="flex shrink-0 flex-col items-center gap-1">
                                  <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/30 sm:size-14">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={
                                        selectedGame.homeLogo ??
                                        selectedGame.league.icon
                                      }
                                      alt=""
                                      className="size-7 object-contain sm:size-9"
                                    />
                                  </span>
                                  <span className="text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
                                    {selectedGame.homeAbbr ??
                                      selectedGame.homeTeam.slice(0, 3)}
                                  </span>
                                </div>
                              </div>
                          </div>
                        </div>
                      ) : (
                        <div className="hidden shrink-0 border-b border-white/10 px-3 py-2.5 lg:block">
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-1.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={selectedGame.league.icon}
                                alt=""
                                className="size-full object-contain"
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="truncate text-sm font-semibold tracking-tight text-white">
                                  {selectedGame.matchup}
                                </h4>
                                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/70">
                                  {selectedPool.pricePerSquare}/sq
                                </span>
                                <span className="text-[15px] font-black tabular-nums tracking-tight text-white">
                                  {selectedPool.prize}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Board + basket: stacked on phone, basket right from md up */}
                      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
                        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-1 pb-3 pt-1 md:px-3 md:pb-4 md:pt-2 md:pr-2">
                          {/* Legend — desktop only; keep mobile focused on the board */}
                          <div className="mb-1.5 hidden shrink-0 flex-col items-center gap-1.5 px-1 md:flex">
                            <p className="text-center text-[11px] font-medium text-white/70">
                              {selectedGame.live?.buyingFor ? (
                                <>
                                  Q1 paid · Tap{' '}
                                  <span className="text-white">+</span> to buy for{' '}
                                  {selectedGame.live.buyingFor}+
                                </>
                              ) : (
                                <>
                                  Tap any <span className="text-white">+</span> square
                                  to add it to your basket
                                </>
                              )}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-white/45">
                              <span className="inline-flex items-center gap-1.5">
                                <span className="flex size-4 items-center justify-center rounded-[2px] border border-white/15 bg-[#1a1a1a] text-[10px] font-bold text-white/55">
                                  +
                                </span>
                                Available
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <span className="flex size-4 items-center justify-center rounded-[2px] bg-[var(--ds-primary,#ee3536)]/40 text-[7px] font-bold text-white">
                                  YOU
                                </span>
                                Owned
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <span className="size-4 rounded-[2px] bg-[#161616] ring-1 ring-white/[0.08]" />
                                Taken
                              </span>
                            </div>
                          </div>

                          <div
                            className="mx-auto flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-0.5 pb-2"
                            onMouseLeave={() => setHoverCell(null)}
                          >
                            <div className="flex h-auto max-h-full w-full max-w-[min(100%,640px)] aspect-square flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#141414] p-2 md:rounded-2xl md:p-2.5">
                              {/* Home team — top of grid */}
                              <div className="mb-1 flex shrink-0 items-center justify-center gap-1.5 md:mb-1.5 md:gap-2">
                                {selectedGame.homeLogo ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={selectedGame.homeLogo}
                                    alt=""
                                    className="size-4 object-contain md:size-5"
                                  />
                                ) : null}
                                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/75 md:text-[11px]">
                                  {selectedGame.homeTeam}
                                </span>
                              </div>

                              <div className="flex min-h-0 min-w-0 flex-1 gap-1 md:gap-1.5">
                                {/* Away team — side of grid */}
                                <div
                                  className="flex w-5 shrink-0 flex-col items-center justify-center gap-1 overflow-visible md:w-7"
                                  aria-hidden
                                >
                                  {selectedGame.awayLogo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={selectedGame.awayLogo}
                                      alt=""
                                      className="size-3.5 shrink-0 object-contain md:size-4"
                                    />
                                  ) : null}
                                  <span className="-rotate-90 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.14em] text-white/75 md:text-[10px]">
                                    {selectedGame.awayTeam}
                                  </span>
                                </div>
                                <div
                                  className="grid min-h-0 min-w-0 flex-1 gap-px overflow-hidden rounded-md bg-white/[0.035] p-px md:rounded-lg"
                                  style={{
                                    gridTemplateColumns:
                                      '1rem repeat(10, minmax(0, 1fr))',
                                    gridTemplateRows:
                                      '0.95rem repeat(10, minmax(0, 1fr))',
                                  }}
                                >
                                    <div className="bg-[#141414]" />
                                    {axisTop.map((n, i) => {
                                      const lit = hoverCell?.col === i
                                      return (
                                        <div
                                          key={`top-${i}`}
                                          className={cn(
                                            'flex items-center justify-center bg-[#141414] text-[10px] font-bold tabular-nums sm:text-xs',
                                            lit ? 'text-white' : 'text-white/45'
                                          )}
                                        >
                                          {n}
                                        </div>
                                      )
                                    })}
                                    {Array.from({ length: 10 }, (_, row) => (
                                      <div key={`row-${row}`} className="contents">
                                        <div
                                          className={cn(
                                            'flex items-center justify-center bg-[#141414] text-[10px] font-bold tabular-nums sm:text-xs',
                                            hoverCell?.row === row
                                              ? 'text-white'
                                              : 'text-white/45'
                                          )}
                                        >
                                          {axisLeft[row]}
                                        </div>
                                        {Array.from({ length: 10 }, (_, col) => {
                                          const key = `${row}-${col}`
                                          const kind = cellDisplayKind(key)
                                          return (
                                            <SquareCellButton
                                              key={key}
                                              kind={kind}
                                              winLabel={null}
                                              rowLit={hoverCell?.row === row}
                                              colLit={hoverCell?.col === col}
                                              focused={
                                                hoverCell?.row === row &&
                                                hoverCell?.col === col
                                              }
                                              onClick={() =>
                                                handleCellClick(row, col)
                                              }
                                              onHover={() =>
                                                setHoverCell({ row, col })
                                              }
                                              label={`Square ${axisLeft[row]}–${axisTop[col]}`}
                                            />
                                          )
                                        })}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        {/* Basket — bottom on phone, right rail from md */}
                        <aside
                          className={cn(
                            'flex shrink-0 flex-col border-white/10 bg-[#141414]',
                            'border-t md:w-[220px] md:border-l md:border-t-0 lg:w-[248px]',
                            basketKeys.length > 0 &&
                              'bg-[var(--ds-primary,#ee3536)]/[0.07] md:bg-[#1a1a1a]'
                          )}
                          style={{
                            paddingBottom:
                              'max(0.25rem, env(safe-area-inset-bottom))',
                          }}
                        >
                          <div className="hidden border-b border-white/10 px-3 py-3 md:block">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                              Basket
                            </p>
                            <p className="mt-0.5 text-xs text-white/40">
                              {selectedPool.pricePerSquare}/sq
                            </p>
                          </div>

                          <div className="flex min-h-0 flex-1 flex-col px-2.5 py-2 md:px-3 md:py-3">
                            <div className="flex items-center gap-2 md:block">
                              <div className="flex min-w-0 flex-1 items-center gap-2 md:mb-1 md:items-start">
                                <IconShoppingCart
                                  className={cn(
                                    'size-4 shrink-0 md:mt-0.5',
                                    basketKeys.length > 0
                                      ? 'text-[var(--ds-primary,#ee3536)]'
                                      : 'text-white/45'
                                  )}
                                  strokeWidth={2}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white">
                                    {basketKeys.length === 0
                                      ? 'Empty'
                                      : `${basketKeys.length} square${basketKeys.length === 1 ? '' : 's'}`}
                                  </p>
                                  <p className="truncate text-[11px] text-white/45 md:whitespace-normal">
                                    {basketKeys.length === 0
                                      ? 'Tap + to buy'
                                      : `${selectedPool.pricePerSquare} × ${basketKeys.length} = ${formatMoney(basketTotals?.total ?? 0)}`}
                                  </p>
                                </div>
                              </div>

                              <div className="flex shrink-0 items-center gap-1.5 md:mt-auto md:hidden">
                                {basketKeys.length > 0 ? (
                                  <button
                                    type="button"
                                    onClick={clearBasket}
                                    className="h-10 rounded-lg px-2 text-xs font-semibold uppercase tracking-wide text-white/55 hover:bg-white/10 hover:text-white"
                                  >
                                    Clear
                                  </button>
                                ) : null}
                                <Button
                                  type="button"
                                  disabled={basketKeys.length === 0}
                                  className="h-10 bg-[var(--ds-primary,#ee3536)] px-3.5 text-xs font-bold uppercase text-white hover:brightness-110 disabled:opacity-40"
                                  onClick={checkoutBasket}
                                >
                                  Buy
                                  {basketKeys.length > 0
                                    ? ` · ${formatMoney(basketTotals?.total ?? 0)}`
                                    : ''}
                                </Button>
                              </div>
                            </div>

                            <div className="mt-3 hidden min-h-0 flex-1 overflow-y-auto md:block">
                              {basketKeys.length === 0 ? (
                                <p className="rounded-lg border border-dashed border-white/12 px-2.5 py-4 text-center text-[11px] text-white/35">
                                  Tap a + square on the board to buy it
                                </p>
                              ) : (
                                <ul className="space-y-1">
                                  {basketKeys.map((key) => {
                                    const [r, c] = key.split('-').map(Number)
                                    const label = `${axisLeft[r]}–${axisTop[c]}`
                                    return (
                                      <li key={key}>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCellClick(r, c)
                                          }
                                          className="flex w-full items-center justify-between rounded-lg border border-[var(--ds-primary,#ee3536)]/35 bg-[var(--ds-primary,#ee3536)]/10 px-2.5 py-1.5 text-left text-xs font-semibold text-white transition-colors hover:bg-[var(--ds-primary,#ee3536)]/20"
                                        >
                                          <span className="tabular-nums">
                                            {label}
                                          </span>
                                          <span className="text-[10px] font-medium uppercase tracking-wide text-white/45">
                                            Remove
                                          </span>
                                        </button>
                                      </li>
                                    )
                                  })}
                                </ul>
                              )}
                            </div>

                            <div className="mt-3 hidden gap-2 md:flex md:flex-col">
                              {basketKeys.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={clearBasket}
                                  className="h-10 rounded-lg border border-white/12 text-xs font-semibold uppercase tracking-wide text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                  Clear all
                                </button>
                              ) : null}
                              <Button
                                type="button"
                                disabled={basketKeys.length === 0}
                                className="h-11 w-full bg-[var(--ds-primary,#ee3536)] text-xs font-bold uppercase text-white shadow-[0_4px_16px_rgba(238,53,54,0.25)] hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
                                onClick={checkoutBasket}
                              >
                                Buy
                                {basketKeys.length > 0
                                  ? ` · ${formatMoney(basketTotals?.total ?? 0)}`
                                  : ''}
                              </Button>
                            </div>
                          </div>
                        </aside>
                      </div>
                    </section>
                  ) : (
                    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                      {/* Ambient wash */}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,255,255,0.06), transparent 70%)',
                        }}
                        aria-hidden
                      />

                      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10">
                        {filteredGames.length === 0 ? (
                          <div className="relative w-full max-w-[380px]">
                            <SquaresIdleBoard />
                            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[#1a1a1a]/75 px-6 text-center backdrop-blur-[2px]">
                              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                                <IconTrophy
                                  className="size-7 text-[var(--ds-primary,#ee3536)]"
                                  strokeWidth={1.6}
                                />
                              </div>
                              <p className="mt-4 text-sm font-semibold text-white">
                                No Squares contests right now
                              </p>
                              <p className="mt-1 max-w-[240px] text-xs text-white/45">
                                Check back when new games go live.
                              </p>
                              <Button
                                type="button"
                                className="mt-5 bg-[var(--ds-primary,#ee3536)] text-white hover:brightness-110"
                                onClick={() => onOpenChange(false)}
                              >
                                Back to Lobby
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full max-w-[420px]">
                            <SquaresIdleBoard />
                            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#1a1a1a]/20 via-[#1a1a1a]/80 to-[#1a1a1a]/95 px-6 text-center">
                              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
                                <IconLayoutGrid
                                  className="size-7 text-white/70"
                                  strokeWidth={1.6}
                                />
                              </div>
                              <p className="mt-4 text-base font-semibold tracking-tight text-white">
                                Your board opens here
                              </p>
                              <p className="mt-1.5 max-w-[280px] text-sm leading-relaxed text-white/55">
                                Pick a game on the{' '}
                                <span className="font-semibold text-white/70">
                                  left
                                </span>
                                , choose a price, then tap{' '}
                                <span className="font-semibold text-[var(--ds-primary,#ee3536)]">
                                  Enter
                                </span>
                                .
                              </p>
                              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-[#1a1a1a]/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
                                <IconArrowLeft className="size-3.5" strokeWidth={2.5} />
                                Select from the left
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SquaresIdleBoard() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
      aria-hidden
    >
      <div className="mb-1.5 flex items-center justify-center rounded-md border border-dashed border-white/10 bg-[#1a1a1a]/40 py-1">
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
          Home
        </span>
      </div>
      <div className="flex gap-1">
        <div className="flex w-4 shrink-0 items-center justify-center">
          <span className="-rotate-90 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
            Away
          </span>
        </div>
        <div
          className="min-w-0 flex-1 grid gap-1"
          style={{
            aspectRatio: '1 / 1',
            gridTemplateColumns: '1.1rem repeat(10, minmax(0, 1fr))',
            gridTemplateRows: '1rem repeat(10, minmax(0, 1fr))',
          }}
        >
          <div />
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={`idle-top-${i}`}
              className="flex items-center justify-center text-[9px] font-bold tabular-nums text-white/30"
            >
              ·
            </div>
          ))}
          {Array.from({ length: 10 }, (_, row) => (
            <div key={`idle-row-${row}`} className="contents">
              <div className="flex items-center justify-center text-[9px] font-bold tabular-nums text-white/30">
                ·
              </div>
              {Array.from({ length: 10 }, (_, col) => (
                <div
                  key={`idle-${row}-${col}`}
                  className="rounded-[3px] border border-dashed border-white/12 bg-white/[0.02]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SquareCellButton({
  kind,
  winLabel,
  rowLit,
  colLit,
  focused,
  onClick,
  onHover,
  label,
}: {
  kind: SquareCellKind
  winLabel?: string | null
  rowLit?: boolean
  colLit?: boolean
  focused?: boolean
  onClick: () => void
  onHover?: () => void
  label: string
}) {
  const isWin = kind === 'win' || kind.startsWith('win-')
  const isOpen = kind === 'open'
  const isBasket = kind === 'basket'
  const isTaken = kind === 'taken'
  const isMine = kind === 'mine'
  const clickable = isOpen || isBasket
  const crossLit = Boolean(rowLit || colLit)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      disabled={!clickable && !isWin}
      aria-label={label}
      className={cn(
        'relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden outline-none transition-colors duration-100 focus-visible:outline-none',
        clickable && 'cursor-pointer',
        isWin
          ? 'bg-[var(--ds-primary,#ee3536)] text-white'
          : isBasket
            ? 'bg-[var(--ds-primary,#ee3536)]/45 text-white ring-1 ring-inset ring-[var(--ds-primary,#ee3536)]'
            : isMine
              ? 'bg-[var(--ds-primary,#ee3536)]/22 text-white'
              : isTaken
                ? 'cursor-default bg-[#161616]'
                : 'bg-[#1a1a1a] text-white/40 hover:bg-white/[0.04] hover:text-white/65',
        !isWin && crossLit && 'bg-white/[0.035]',
        focused && isOpen && 'z-[1] ring-1 ring-inset ring-white/30'
      )}
    >
      {isWin ? (
        <span className="text-[7px] font-bold uppercase leading-none sm:text-[9px]">
          {winLabel ?? 'WIN'}
        </span>
      ) : isMine ? (
        <span className="text-[8px] font-bold uppercase tracking-wide sm:text-[10px]">
          You
        </span>
      ) : isBasket ? (
        <IconShoppingCart className="size-3 sm:size-3.5" strokeWidth={2.5} />
      ) : isTaken ? null : (
        <IconPlus className="size-2.5 opacity-55 sm:size-3" strokeWidth={2.5} />
      )}
    </button>
  )
}
