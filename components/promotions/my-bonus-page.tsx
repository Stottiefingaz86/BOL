'use client'

import { useId, useMemo, useRef, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleXIcon,
  Columns3Icon,
  FilterIcon,
  ListFilterIcon,
} from 'lucide-react'
import {
  IconFilter,
  IconGift,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tabs as AnimateTabs,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import { requestLogin } from '@/lib/auth-session'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import {
  FreeSpinsGamePicker,
  type FreeSpinGameOption,
} from '@/components/vip/free-spins-game-picker'
import { playSound } from '@/lib/sounds'
import { toast } from 'sonner'
import { launchCasinoGame } from '@/lib/casino/launch-game'

export type RewardType =
  | 'rakeback'
  | 'referral'
  | 'reload'
  | 'free-spins'
  | 'boost'
  | 'other'

export type RewardStatus = 'AVAILABLE' | 'CLAIMED' | 'EXPIRED' | 'USED'

export type RewardItem = {
  id: string
  type: RewardType
  name: string
  dateAwarded: string
  dateClaimed: string | null
  /** Cash amount claimed, e.g. "$12.50". Null when amount is spins-only. */
  amountClaimed: string | null
  status: RewardStatus
  /** Remaining free spins when type is free-spins */
  freeSpinsLeft?: number
  freeSpinsTotal?: number
  detail?: string
}

const REWARD_TYPE_LABEL: Record<RewardType, string> = {
  rakeback: 'Rakeback',
  referral: 'Refer a Friend',
  reload: 'Reload',
  'free-spins': 'Free Spins',
  boost: 'Boost',
  other: 'Reward',
}

const STATUS_STYLES: Record<
  RewardStatus,
  { text: string; border: string; bg: string }
> = {
  AVAILABLE: {
    text: 'text-[var(--ds-fg-muted)]',
    border: 'border-white/20',
    bg: 'bg-white/[0.04]',
  },
  CLAIMED: {
    text: 'text-emerald-400/80',
    border: 'border-emerald-400/25',
    bg: 'bg-emerald-500/5',
  },
  EXPIRED: {
    text: 'text-orange-400/70',
    border: 'border-orange-400/25',
    bg: 'bg-orange-500/5',
  },
  USED: {
    text: 'text-[var(--ds-fg-subtle)]',
    border: 'border-white/15',
    bg: 'bg-white/[0.03]',
  },
}

/** Seeded hub claim history — rakebacks, RAF, reloads, free spins */
const SEED_REWARDS: RewardItem[] = [
  {
    id: 'fs-1',
    type: 'free-spins',
    name: 'VIP Free Spins',
    dateAwarded: '03/12/2026',
    dateClaimed: '03/12/2026',
    amountClaimed: null,
    status: 'AVAILABLE',
    freeSpinsLeft: 42,
    freeSpinsTotal: 50,
    detail: 'Select a game to play your remaining free spins.',
  },
  {
    id: 'rb-1',
    type: 'rakeback',
    name: 'Rakeback',
    dateAwarded: '03/12/2026',
    dateClaimed: '03/12/2026',
    amountClaimed: '$8.40',
    status: 'CLAIMED',
    detail: 'Claimed from VIP Hub every 15 minutes.',
  },
  {
    id: 'raf-1',
    type: 'referral',
    name: 'Refer a Friend Commission',
    dateAwarded: '03/10/2026',
    dateClaimed: '03/11/2026',
    amountClaimed: '$40.00',
    status: 'CLAIMED',
    detail: 'Commission from referred friends’ wagers.',
  },
  {
    id: 'rl-1',
    type: 'reload',
    name: 'Special Reload',
    dateAwarded: '03/08/2026',
    dateClaimed: '03/08/2026',
    amountClaimed: '$5.00',
    status: 'CLAIMED',
    detail: 'On-demand VIP reload — 1 of 7 claimed.',
  },
  {
    id: 'rb-2',
    type: 'rakeback',
    name: 'Rakeback',
    dateAwarded: '03/07/2026',
    dateClaimed: '03/07/2026',
    amountClaimed: '$3.15',
    status: 'CLAIMED',
  },
  {
    id: 'fs-2',
    type: 'free-spins',
    name: 'Gold Tier Free Spins',
    dateAwarded: '02/28/2026',
    dateClaimed: '03/01/2026',
    amountClaimed: null,
    status: 'AVAILABLE',
    freeSpinsLeft: 8,
    freeSpinsTotal: 25,
    detail: 'Select a game to play your remaining free spins.',
  },
  {
    id: 'rl-2',
    type: 'reload',
    name: 'Monthly Reload',
    dateAwarded: '02/01/2026',
    dateClaimed: '02/01/2026',
    amountClaimed: '$25.00',
    status: 'CLAIMED',
  },
  {
    id: 'boost-1',
    type: 'boost',
    name: 'Weekly Boost',
    dateAwarded: '01/20/2026',
    dateClaimed: '01/20/2026',
    amountClaimed: '$10.00',
    status: 'CLAIMED',
  },
  {
    id: 'fs-3',
    type: 'free-spins',
    name: 'Free Spins',
    dateAwarded: '01/05/2026',
    dateClaimed: '01/05/2026',
    amountClaimed: null,
    status: 'USED',
    freeSpinsLeft: 0,
    freeSpinsTotal: 20,
    detail: 'All spins used.',
  },
  {
    id: 'raf-2',
    type: 'referral',
    name: 'Refer a Friend Commission',
    dateAwarded: '12/15/2025',
    dateClaimed: '12/16/2025',
    amountClaimed: '$12.50',
    status: 'CLAIMED',
  },
  {
    id: 'rl-3',
    type: 'reload',
    name: 'Post-Monthly Reload',
    dateAwarded: '11/01/2025',
    dateClaimed: null,
    amountClaimed: null,
    status: 'EXPIRED',
    detail: 'Offer expired before claim.',
  },
]

const searchFilterFn: FilterFn<RewardItem> = (row, _columnId, filterValue) => {
  const q = String(filterValue ?? '').toLowerCase()
  if (!q) return true
  const item = row.original
  const hay = [
    item.name,
    REWARD_TYPE_LABEL[item.type],
    item.amountClaimed ?? '',
    item.freeSpinsLeft != null ? String(item.freeSpinsLeft) : '',
    item.status,
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

const statusFilterFn: FilterFn<RewardItem> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  return filterValue.includes(row.getValue(columnId) as string)
}

function formatAmountCell(item: RewardItem) {
  if (item.type === 'free-spins') {
    const left = item.freeSpinsLeft ?? 0
    const total = item.freeSpinsTotal
    if (left > 0) {
      return total != null ? `${left} of ${total} left` : `${left} left`
    }
    return total != null ? `${total} used` : '0 left'
  }
  return item.amountClaimed ?? '—'
}

function StatusBadge({ status }: { status: RewardStatus }) {
  const colors = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        'inline-flex px-2 py-0.5 rounded text-[11px] font-normal border',
        colors.text,
        colors.border,
        colors.bg
      )}
    >
      {status}
    </span>
  )
}

function ChooseGameButton({
  onClick,
  className,
}: {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-md px-3 text-[11px] font-semibold tracking-wide',
        'border border-[var(--ds-primary,#ee3536)]/45 bg-[var(--ds-primary,#ee3536)]/10',
        'text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-primary,#ee3536)]/18',
        'hover:border-[var(--ds-primary,#ee3536)]/70 whitespace-nowrap',
        className
      )}
    >
      Choose Game
    </button>
  )
}

type MyBonusPageProps = {
  brandPrimary?: string
  setShowVipRewards?: (show: boolean) => void
}

export function MyBonusPage({ setShowVipRewards }: MyBonusPageProps) {
  const id = useId()
  const isMobile = useIsMobile()
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [typeFilter, setTypeFilter] = useState<'All' | RewardType>('All')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'dateAwarded', desc: true },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<RewardItem[]>(SEED_REWARDS)
  const [gamePickerOpen, setGamePickerOpen] = useState(false)
  const [pickerRewardId, setPickerRewardId] = useState<string | null>(null)

  const filteredByType = useMemo(() => {
    if (typeFilter === 'All') return data
    return data.filter((r) => r.type === typeFilter)
  }, [data, typeFilter])

  const pickerSpinsLeft = useMemo(() => {
    if (!pickerRewardId) return undefined
    return data.find((r) => r.id === pickerRewardId)?.freeSpinsLeft
  }, [data, pickerRewardId])

  const goChooseGame = (rewardId?: string) => {
    setPickerRewardId(rewardId ?? null)
    setGamePickerOpen(true)
  }

  const handleGameSelect = (game: FreeSpinGameOption) => {
    setGamePickerOpen(false)
    setShowVipRewards?.(false)
    launchCasinoGame({
      title: game.name,
      image: game.image,
      provider: game.provider,
      features: ['Free spins applied'],
    })
    playSound('redeem')
    toast.success(`Playing ${game.name}`, {
      description: 'Free spins applied to your selected game.',
      duration: 3500,
    })
    if (pickerRewardId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === pickerRewardId
            ? {
                ...item,
                detail: `Playing on ${game.name}.`,
              }
            : item
        )
      )
    }
    setPickerRewardId(null)
  }

  const columns: ColumnDef<RewardItem>[] = useMemo(
    () => [
      {
        header: 'Reward',
        accessorKey: 'name',
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--ds-fg)] truncate">
                {item.name}
              </div>
              <div className="text-[11px] text-[var(--ds-fg-subtle)] mt-0.5">
                {REWARD_TYPE_LABEL[item.type]}
              </div>
            </div>
          )
        },
        size: 200,
        filterFn: searchFilterFn,
        enableHiding: false,
      },
      {
        header: 'Date Awarded',
        accessorKey: 'dateAwarded',
        cell: ({ row }) => (
          <div className="text-sm text-[var(--ds-fg-muted)] tabular-nums">
            {row.getValue('dateAwarded')}
          </div>
        ),
        size: 130,
      },
      {
        header: 'Date Claimed',
        accessorKey: 'dateClaimed',
        cell: ({ row }) => (
          <div className="text-sm text-[var(--ds-fg-muted)] tabular-nums">
            {(row.getValue('dateClaimed') as string | null) ?? '—'}
          </div>
        ),
        size: 130,
      },
      {
        id: 'amountClaimed',
        header: 'Amount Claimed',
        accessorFn: (row) => formatAmountCell(row),
        cell: ({ row }) => {
          const item = row.original
          const isSpins =
            item.type === 'free-spins' && (item.freeSpinsLeft ?? 0) > 0
          return (
            <div
              className={cn(
                'text-sm tabular-nums',
                isSpins
                  ? 'text-[var(--ds-fg)] font-medium'
                  : 'text-[var(--ds-fg-muted)]'
              )}
            >
              {formatAmountCell(item)}
            </div>
          )
        },
        size: 140,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const item = row.original
          if (
            item.type === 'free-spins' &&
            (item.freeSpinsLeft ?? 0) > 0 &&
            item.status === 'AVAILABLE'
          ) {
            return <ChooseGameButton onClick={() => goChooseGame(item.id)} />
          }
          return <StatusBadge status={item.status} />
        },
        size: 130,
        filterFn: statusFilterFn,
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredByType,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn('status')
    if (!statusColumn) return []
    return Array.from(statusColumn.getFacetedUniqueValues().keys()).sort()
  }, [table.getColumn('status')?.getFacetedUniqueValues()])

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn('status')
    if (!statusColumn) return new Map()
    return statusColumn.getFacetedUniqueValues()
  }, [table.getColumn('status')?.getFacetedUniqueValues()])

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn('status')?.getFilterValue() as
      | string[]
      | undefined
    return filterValue ?? []
  }, [table.getColumn('status')?.getFilterValue()])

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn('status')?.getFilterValue() as
      | string[]
      | undefined
    const next = filterValue ? [...filterValue] : []
    if (checked) {
      next.push(value)
    } else {
      const index = next.indexOf(value)
      if (index > -1) next.splice(index, 1)
    }
    table
      .getColumn('status')
      ?.setFilterValue(next.length ? next : undefined)
  }

  const typeTabs: Array<'All' | RewardType> = [
    'All',
    'rakeback',
    'referral',
    'reload',
    'free-spins',
  ]

  const typeTabLabel = (t: 'All' | RewardType) =>
    t === 'All' ? 'All' : REWARD_TYPE_LABEL[t]

  return (
    <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
      <div className="w-full px-3 md:px-6 pt-6 md:pt-8 pb-8">
        <div className="w-full">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--ds-fg)] md:text-3xl">
                My Bonus
              </h1>
              <p className="mt-1 text-sm text-[var(--ds-fg-subtle)]">
                Every reward you claim from the hub — rakeback, referrals,
                reloads, and free spins.
              </p>
            </div>
            <div
              className="flex items-center gap-1 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-bg)] p-0.5"
              role="group"
              aria-label="Demo login state"
            >
              {(['Log in', 'Log out'] as const).map((label) => {
                const loggedIn = label === 'Log in'
                const active = isLoggedIn === loggedIn
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setIsLoggedIn(loggedIn)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                      active
                        ? 'bg-[var(--ds-control-hover)] text-[var(--ds-fg)] ring-1 ring-white/10'
                        : 'text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]'
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <AnimateTabs
              value={typeFilter}
              onValueChange={(v) =>
                setTypeFilter(v as 'All' | RewardType)
              }
              className="w-full"
            >
              <AnimateTabsList className="bg-[var(--ds-control-bg)] p-0.5 h-auto gap-1 rounded-3xl border-0 relative flex-wrap">
                {typeTabs.map((tab) => (
                  <TabsTab
                    key={tab}
                    value={tab}
                    className="relative z-10 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] rounded-2xl px-3.5 py-1 h-9 text-xs font-medium transition-colors data-[state=active]:text-[var(--ds-fg)] focus-visible:outline-none focus-visible:ring-0"
                  >
                    {typeFilter === tab && (
                      <motion.div
                        layoutId="activeBonusTypeTab"
                        className="absolute inset-0 rounded-2xl -z-10 bg-[var(--ds-control-hover)] ring-1 ring-white/10"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 40,
                        }}
                      />
                    )}
                    <span className="relative z-10">{typeTabLabel(tab)}</span>
                  </TabsTab>
                ))}
              </AnimateTabsList>
            </AnimateTabs>
          </div>

          {!isLoggedIn ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-[var(--ds-border)] bg-[var(--ds-overlay)] px-6 py-12 md:min-h-[360px] md:px-8">
              <div className="flex max-w-md flex-col items-center gap-4 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ds-control-hover)]">
                  <IconGift
                    className="h-5 w-5 text-[var(--ds-fg-subtle)]"
                    aria-hidden
                  />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-lg font-semibold text-[var(--ds-fg)] md:text-xl">
                    Log in to view your rewards
                  </h2>
                  <p className="text-sm leading-relaxed text-white/55">
                    Sign in to track rakeback, referral commissions, reloads,
                    and free spins claimed from the hub.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => requestLogin()}
                  className="h-10 rounded-lg border border-[var(--ds-primary,#ee3536)]/50 bg-[var(--ds-primary,#ee3536)]/15 px-6 text-sm font-semibold text-[var(--ds-fg)] hover:bg-[var(--ds-primary,#ee3536)]/25"
                >
                  Log in
                </Button>
              </div>
            </div>
          ) : (
            <>
              {isMobile ? (
                <Popover>
                  <div className="flex items-center gap-3 mb-4">
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-semibold text-[var(--ds-fg-muted)] uppercase tracking-wide"
                      >
                        <IconFilter className="w-4 h-4 text-[var(--ds-fg-subtle)]" />
                        Add Filter
                      </button>
                    </PopoverTrigger>
                    <div className="h-5 w-px bg-[var(--ds-control-hover)]" />
                    <span className="text-sm text-[var(--ds-fg-subtle)]">
                      {selectedStatuses.length > 0
                        ? `${selectedStatuses.length} filter${selectedStatuses.length > 1 ? 's' : ''} applied`
                        : 'No filters applied'}
                    </span>
                  </div>
                  <PopoverContent
                    className="w-auto min-w-36 p-3 bg-[var(--ds-surface-raised)] border-[var(--ds-border)]"
                    align="start"
                  >
                    <div className="space-y-3">
                      <div className="text-[var(--ds-fg-muted)] text-xs font-medium">
                        Filter by Status
                      </div>
                      <div className="space-y-3">
                        {uniqueStatusValues.map((value, i) => (
                          <div key={value} className="flex items-center gap-2">
                            <Checkbox
                              id={`${id}-m-${i}`}
                              checked={selectedStatuses.includes(value)}
                              onCheckedChange={(checked: boolean) =>
                                handleStatusChange(checked, value)
                              }
                              className="border-white/20"
                            />
                            <Label
                              htmlFor={`${id}-m-${i}`}
                              className="flex grow justify-between gap-2 font-normal text-[var(--ds-fg)]"
                            >
                              {value}{' '}
                              <span className="text-[var(--ds-fg-subtle)] ms-2 text-xs">
                                {statusCounts.get(value)}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="relative">
                    <Input
                      id={`${id}-input`}
                      ref={inputRef}
                      className={cn(
                        'peer min-w-60 ps-9 bg-[var(--ds-control-bg)] border-[var(--ds-border)] text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)] text-sm',
                        Boolean(table.getColumn('name')?.getFilterValue()) &&
                          'pe-9'
                      )}
                      value={
                        (table.getColumn('name')?.getFilterValue() ??
                          '') as string
                      }
                      onChange={(e) =>
                        table.getColumn('name')?.setFilterValue(e.target.value)
                      }
                      placeholder="Filter by reward or amount..."
                      type="text"
                      aria-label="Filter by reward or amount"
                    />
                    <div className="text-[var(--ds-fg-subtle)] pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <ListFilterIcon size={16} aria-hidden="true" />
                    </div>
                    {Boolean(table.getColumn('name')?.getFilterValue()) && (
                      <button
                        type="button"
                        className="text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)] absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md outline-none"
                        aria-label="Clear filter"
                        onClick={() => {
                          table.getColumn('name')?.setFilterValue('')
                          inputRef.current?.focus()
                        }}
                      >
                        <CircleXIcon size={16} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[var(--ds-control-bg)] border-[var(--ds-border)] text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)] h-9 px-3 text-xs"
                      >
                        <FilterIcon
                          className="-ms-1 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                        Status
                        {selectedStatuses.length > 0 && (
                          <span className="bg-[var(--ds-control-hover)] text-[var(--ds-fg-muted)] -me-1 inline-flex h-5 max-h-full items-center rounded border border-white/20 px-1 font-[inherit] text-[0.625rem] font-medium">
                            {selectedStatuses.length}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto min-w-36 p-3 bg-[var(--ds-surface-raised)] border-[var(--ds-border)]"
                      align="start"
                    >
                      <div className="space-y-3">
                        <div className="text-[var(--ds-fg-muted)] text-xs font-medium">
                          Filters
                        </div>
                        <div className="space-y-3">
                          {uniqueStatusValues.map((value, i) => (
                            <div
                              key={value}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`${id}-${i}`}
                                checked={selectedStatuses.includes(value)}
                                onCheckedChange={(checked: boolean) =>
                                  handleStatusChange(checked, value)
                                }
                                className="border-white/20"
                              />
                              <Label
                                htmlFor={`${id}-${i}`}
                                className="flex grow justify-between gap-2 font-normal text-[var(--ds-fg)]"
                              >
                                {value}{' '}
                                <span className="text-[var(--ds-fg-subtle)] ms-2 text-xs">
                                  {statusCounts.get(value)}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[var(--ds-control-bg)] border-[var(--ds-border)] text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)] h-9 px-3 text-xs"
                      >
                        <Columns3Icon
                          className="-ms-1 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                        View
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)]"
                    >
                      <DropdownMenuLabel className="text-[var(--ds-fg)]">
                        Toggle columns
                      </DropdownMenuLabel>
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize text-[var(--ds-fg)]"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                            onSelect={(event) => event.preventDefault()}
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {isMobile ? (
                <div
                  className="bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-lg overflow-hidden mb-4"
                  style={{ touchAction: 'pan-y' }}
                >
                  <div className="flex items-center px-4 py-3 border-b border-[var(--ds-border)]">
                    <span className="flex-1 text-sm font-medium text-[var(--ds-fg-muted)]">
                      Reward
                    </span>
                    <span className="w-[88px] text-sm font-medium text-[var(--ds-fg-muted)]">
                      Claimed
                    </span>
                    <span className="w-[100px] text-sm font-medium text-[var(--ds-fg-muted)] text-center">
                      Status
                    </span>
                  </div>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      const item = row.original
                      const showChooseGame =
                        item.type === 'free-spins' &&
                        (item.freeSpinsLeft ?? 0) > 0 &&
                        item.status === 'AVAILABLE'
                      return (
                        <div
                          key={row.id}
                          className="flex items-center w-full px-4 py-4 border-b border-white/5"
                          style={{ touchAction: 'pan-y' }}
                        >
                          <span className="flex-1 min-w-0 pr-2">
                            <span className="block text-sm font-semibold text-[var(--ds-fg)] truncate">
                              {item.name}
                            </span>
                            <span className="block text-[11px] text-[var(--ds-fg-subtle)] mt-0.5">
                              {formatAmountCell(item)}
                            </span>
                          </span>
                          <span className="w-[88px] text-sm text-[var(--ds-fg-muted)] shrink-0 tabular-nums">
                            {item.dateClaimed ?? '—'}
                          </span>
                          <span className="w-[100px] flex justify-center shrink-0">
                            {showChooseGame ? (
                              <ChooseGameButton
                                onClick={() => goChooseGame(item.id)}
                                className="h-7 px-2 text-[10px]"
                              />
                            ) : (
                              <StatusBadge status={item.status} />
                            )}
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="px-4 py-8 text-center text-[var(--ds-fg-subtle)] text-sm">
                      No rewards yet.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-lg overflow-hidden mb-4">
                  <div className="overflow-x-auto">
                    <Table className="table-fixed min-w-[720px]">
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow
                            key={headerGroup.id}
                            className="hover:bg-transparent border-[var(--ds-border)]"
                          >
                            {headerGroup.headers.map((header) => (
                              <TableHead
                                key={header.id}
                                style={{ width: `${header.getSize()}px` }}
                                className="h-11 text-[var(--ds-fg-muted)] text-xs font-normal"
                              >
                                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                  <div
                                    className={cn(
                                      header.column.getCanSort() &&
                                        'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                                    )}
                                    onClick={header.column.getToggleSortingHandler()}
                                    onKeyDown={(e) => {
                                      if (
                                        header.column.getCanSort() &&
                                        (e.key === 'Enter' || e.key === ' ')
                                      ) {
                                        e.preventDefault()
                                        header.column
                                          .getToggleSortingHandler()
                                          ?.(e)
                                      }
                                    }}
                                    tabIndex={
                                      header.column.getCanSort() ? 0 : undefined
                                    }
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    {{
                                      asc: (
                                        <ChevronUpIcon
                                          className="shrink-0 opacity-60 text-[var(--ds-fg)]"
                                          size={16}
                                          aria-hidden="true"
                                        />
                                      ),
                                      desc: (
                                        <ChevronDownIcon
                                          className="shrink-0 opacity-60 text-[var(--ds-fg)]"
                                          size={16}
                                          aria-hidden="true"
                                        />
                                      ),
                                    }[
                                      header.column.getIsSorted() as string
                                    ] ?? null}
                                  </div>
                                ) : (
                                  flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )
                                )}
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              className="border-[var(--ds-border)] hover:bg-white/[0.02]"
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center text-[var(--ds-fg-muted)]"
                            >
                              No rewards yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FreeSpinsGamePicker
        open={gamePickerOpen}
        onOpenChange={(open) => {
          setGamePickerOpen(open)
          if (!open) setPickerRewardId(null)
        }}
        spinsLeft={pickerSpinsLeft}
        onSelect={handleGameSelect}
      />
    </SidebarInset>
  )
}

export default MyBonusPage
