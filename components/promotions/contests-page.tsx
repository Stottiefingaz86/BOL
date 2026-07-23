'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  IconCalendarEvent,
  IconCheck,
  IconChevronDown,
  IconCircleCheck,
  IconCircleDashed,
  IconClockFilled,
  IconFlame,
  IconShoppingCart,
  IconSparkles,
  IconTrophy,
  IconX,
} from '@tabler/icons-react'
import * as Dialog from '@radix-ui/react-dialog'
import { SidebarInset } from '@/components/ui/sidebar'
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
    lobby: 'Main Lobby',
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
          ? 'border-[#E07A2F] bg-[#FFF0E0] text-[#C45A12]'
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
        icon: <IconCircleDashed className="h-3.5 w-3.5 shrink-0 text-amber-300/90" strokeWidth={2} />,
      }
    case 'submitted':
      return {
        label: 'Submitted',
        className: 'text-sky-300/90',
        icon: <IconCircleCheck className="h-3.5 w-3.5 shrink-0 text-sky-300/90" strokeWidth={2} />,
      }
    case 'finished':
      return {
        label: 'Finished',
        className: 'text-emerald-300/90',
        icon: <IconTrophy className="h-3.5 w-3.5 shrink-0 text-emerald-300/90" strokeWidth={2} />,
      }
  }
}

function MyEntriesPopover({ entries }: { entries: ContestEntry[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-8 shrink-0 items-center gap-0.5 rounded-md bg-white/[0.06] px-2.5 text-[10px] font-semibold text-white/55 transition-colors hover:bg-white/[0.1] hover:text-white/80 data-[state=open]:bg-white/[0.1] data-[state=open]:text-white/80"
        >
          My Entries
          <IconChevronDown className="h-3 w-3 opacity-50" strokeWidth={2} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        className="z-[80] w-[260px] border-white/10 bg-[#222] p-0 text-white shadow-xl"
      >
        <div className="border-b border-white/10 px-3 py-2">
          <p className="text-[11px] font-semibold text-white/80">My Entries</p>
          <p className="text-[10px] text-white/40">{entries.length} for this contest</p>
        </div>
        <ul className="max-h-[220px] overflow-y-auto py-1">
          {entries.map((entry) => {
            const meta = entryStatusMeta(entry.status)
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
                >
                  {meta.icon}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[12px] font-medium text-white/90">
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
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function getCartTotals(unitPrice: number, qty: number) {
  const list = unitPrice * qty
  if (unitPrice === 0) {
    return { list, total: 0, discount: 0, perEntry: 0 }
  }
  const scale = unitPrice / 20
  const total = Math.round(ENTRY_TIER_TOTALS[Math.min(qty, ENTRY_TIER_TOTALS.length) - 1] * scale)
  const discount = Math.max(0, list - total)
  return { list, total, discount, perEntry: total / qty }
}

function ContestPurchaseDialog({
  contest,
  open,
  onOpenChange,
  onPurchased,
}: {
  contest: ContestCardData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchased: (contestId: string, qty: number) => void
}) {
  const [qty, setQty] = useState(1)
  const [qtyOpen, setQtyOpen] = useState(false)
  const [step, setStep] = useState<'cart' | 'complete'>('cart')
  const [purchasedQty, setPurchasedQty] = useState(1)
  const [purchasedTotal, setPurchasedTotal] = useState(0)

  useEffect(() => {
    if (open) {
      setQty(1)
      setQtyOpen(false)
      setStep('cart')
    }
  }, [open, contest?.id])

  if (!contest) return null

  const unitPrice = parseEntryFee(contest.entryFee)
  const isFree = unitPrice === 0
  const { list, total, discount, perEntry } = getCartTotals(unitPrice, qty)

  const handlePurchase = () => {
    setPurchasedQty(qty)
    setPurchasedTotal(total)
    onPurchased(contest.id, qty)
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
                          {contest.name} entry
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/45">
                          {isFree
                            ? 'Free entry — no charge to your balance'
                            : `List price ${formatMoney(unitPrice)} each · buy more to save`}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold tabular-nums text-white">
                        {formatMoney(isFree ? 0 : perEntry)}
                        <span className="text-[10px] font-medium text-white/40"> /ea</span>
                      </p>
                    </div>

                    <div className="relative mt-3">
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
                    {isFree
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
        "group relative flex min-h-[200px] overflow-hidden rounded-xl border bg-[#1a1a1a] transition-colors duration-300 sm:min-h-[180px]",
        contest.featured
          ? "border-[#ff6b35]/35 hover:border-[#ff6b35]/55 active:border-[#ff6b35]/55"
          : "border-white/[0.08] hover:border-white/[0.14] active:border-white/[0.14]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100",
          contest.featured ? "tile-shimmer-fire opacity-60 group-hover:opacity-100" : "tile-shimmer"
        )}
        aria-hidden
      />
      {contest.featured && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top_left,rgba(255,107,53,0.12),transparent_55%)]"
          aria-hidden
        />
      )}

      {/* Full-bleed right art — wider on mobile so athletes aren't sliced */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[48%] max-w-none overflow-hidden sm:w-[38%] sm:max-w-[140px]">
        <Image
          src={contest.image}
          alt=""
          fill
          className="scale-105 object-cover object-[70%_center] transition-transform duration-500 group-hover:scale-110 sm:object-[center_20%]"
          sizes="(max-width: 640px) 48vw, 140px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] from-[8%] via-[#1a1a1a]/75 via-[42%] to-transparent to-[75%]" />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-2.5 p-3.5 pr-[46%] sm:pr-[36%]">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
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
                  className="z-[200] border-white/10 bg-[#2d2d2d] px-2.5 py-1 text-xs text-white"
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

        <div className="mt-auto flex items-center gap-1.5 pt-1 pr-14 sm:pr-0">
          <button
            type="button"
            className="flex h-8 shrink-0 items-center rounded-md bg-white/[0.06] px-2.5 text-[10px] font-semibold text-white/55 transition-colors hover:bg-white/[0.1] hover:text-white/80"
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
          className="absolute bottom-3 right-3 z-30 flex h-8 max-w-[calc(100%-1.5rem)] shrink-0 items-center justify-center rounded-md px-2.5 text-[11px] font-bold whitespace-nowrap text-white shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98] sm:px-3 sm:text-xs"
          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
        >
          {ctaLabel}
        </button>
      ) : (
        <span className="absolute bottom-3 right-3 z-30 flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#2a2a2a]/90 px-2.5 text-[11px] font-semibold text-white/45 shadow-lg backdrop-blur-sm sm:px-3 sm:text-xs">
          {ctaLabel}
        </span>
      )}
    </motion.div>
  )
}

export function ContestsPage() {
  const [lobby, setLobby] = useState<ContestLobby>('Main Lobby')
  const [purchaseContest, setPurchaseContest] = useState<ContestCardData | null>(null)
  const [entriesByContest, setEntriesByContest] = useState<Record<string, ContestEntry[]>>(() => {
    const seed: Record<string, ContestEntry[]> = {}
    for (const c of CONTESTS) {
      if (c.myEntries?.length) seed[c.id] = c.myEntries
    }
    return seed
  })

  const visibleContests = useMemo(() => {
    if (lobby === 'Help') return []
    if (lobby === 'Main Lobby') {
      return CONTESTS.filter((c) => c.lobby === 'Main Lobby')
    }
    return CONTESTS.filter((c) => c.lobby === lobby)
  }, [lobby])

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
              <ContestCard
                key={contest.id}
                contest={contest}
                index={index}
                myEntries={entriesByContest[contest.id] ?? []}
                onPurchase={setPurchaseContest}
              />
            ))}
          </div>
        )}
      </div>

      <ContestPurchaseDialog
        contest={purchaseContest}
        open={purchaseContest != null}
        onOpenChange={(open) => {
          if (!open) setPurchaseContest(null)
        }}
        onPurchased={handlePurchased}
      />
    </SidebarInset>
    </TooltipProvider>
  )
}
