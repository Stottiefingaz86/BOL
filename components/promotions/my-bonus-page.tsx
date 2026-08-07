'use client'

import { Fragment, useId, useMemo, useRef, useState } from 'react'
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
  PlayIcon,
} from 'lucide-react'
import {
  IconFilter,
  IconGift,
  IconChevronDown,
} from '@tabler/icons-react'
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
import { requestLogin } from '@/lib/auth-session'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import {
  FREE_SPIN_GAME_OPTIONS,
  FreeSpinsGamePicker,
  type FreeSpinGameOption,
} from '@/components/vip/free-spins-game-picker'
import { playSound } from '@/lib/sounds'
import { toast } from 'sonner'
import { launchCasinoGame } from '@/lib/casino/launch-game'
import { motion } from 'framer-motion'
import {
  Tabs as AnimateTabs,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'

export type BonusTab = 'Casino' | 'Sports' | 'Cash Rewards'

export type RewardType =
  | 'rakeback'
  | 'referral'
  | 'reload'
  | 'free-spins'
  | 'free-bets'
  | 'boost'
  | 'other'

export type RewardStatus = 'AVAILABLE' | 'CLAIMED' | 'EXPIRED' | 'USED'

export type RewardGame = {
  name: string
  image: string
  provider?: string
}

export type RewardItem = {
  id: string
  type: RewardType
  name: string
  dateAwarded: string
  dateClaimed: string | null
  /** Expiry date for the reward, e.g. free spins window. */
  dateExpires: string | null
  /** Cash / free-bet amount claimed, e.g. "$12.50". Null when amount is spins-only. */
  amountClaimed: string | null
  status: RewardStatus
  /** Remaining free spins when type is free-spins */
  freeSpinsLeft?: number
  freeSpinsTotal?: number
  /** Assigned game for free-spins rewards (ops-selected, one title) */
  game?: RewardGame
  /** Multi-game free spins — player picks from eligible titles */
  chooseGame?: boolean
  /** Casino bonus code */
  code?: string
  /** Casino bonus funds balance */
  bonusFunds?: string
  /** Rollover progress, e.g. "$0.00/$500.00" */
  rollover?: string
  /** Casino / sports CTA label */
  actionLabel?: string
  detail?: string
}

const BONUS_TABS: BonusTab[] = ['Casino', 'Sports', 'Cash Rewards']

const REWARD_TYPE_LABEL: Record<RewardType, string> = {
  rakeback: 'Rakeback',
  referral: 'Refer a Friend',
  reload: 'Reload',
  'free-spins': 'Free Spins',
  'free-bets': 'Free Bet',
  boost: 'Boost',
  other: 'Reward',
}

const CASH_TYPE_FILTER_OPTIONS: RewardType[] = [
  'rakeback',
  'referral',
  'reload',
  'boost',
]

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

const DEMO_FS_GAME = FREE_SPIN_GAME_OPTIONS[0]
const DEMO_FS_GAME_2 = FREE_SPIN_GAME_OPTIONS[2]

/** Seeded hub claim history — rakebacks, RAF, reloads, free spins, free bets */
const SEED_REWARDS: RewardItem[] = [
  {
    id: 'fs-1',
    type: 'free-spins',
    name: 'VIP Free Spins',
    dateAwarded: '03/12/2026',
    dateClaimed: '03/12/2026',
    dateExpires: '03/19/2026',
    amountClaimed: null,
    status: 'CLAIMED',
    freeSpinsLeft: 42,
    freeSpinsTotal: 50,
    code: '1888100',
    bonusFunds: '$0.00',
    rollover: '$0.00/$0.00',
    actionLabel: 'PLAY',
    game: {
      name: DEMO_FS_GAME.name,
      image: DEMO_FS_GAME.image,
      provider: DEMO_FS_GAME.provider,
    },
    detail: `Play on ${DEMO_FS_GAME.name}.`,
  },
  {
    id: 'fs-choice',
    type: 'free-spins',
    name: 'Free Spins',
    dateAwarded: '03/12/2026',
    dateClaimed: '03/12/2026',
    dateExpires: '03/26/2026',
    amountClaimed: null,
    status: 'CLAIMED',
    freeSpinsLeft: 25,
    freeSpinsTotal: 50,
    chooseGame: true,
    code: '453339004567',
    bonusFunds: '$0.00',
    rollover: '$0.00/$0.00',
    actionLabel: 'PICK A GAME',
    detail: 'Pick any eligible game to play your free spins.',
  },
  {
    id: 'fb-1',
    type: 'free-bets',
    name: 'Sports Free Bet',
    dateAwarded: '03/11/2026',
    dateClaimed: '03/11/2026',
    dateExpires: '03/25/2026',
    amountClaimed: '$25.00',
    status: 'CLAIMED',
    code: 'FreeBet25',
    rollover: '$0.00/$25.00',
    detail: 'Use on any sports market. Stake not returned.',
  },
  {
    id: 'fb-2',
    type: 'free-bets',
    name: 'NFL Free Bet',
    dateAwarded: '03/01/2026',
    dateClaimed: '03/01/2026',
    dateExpires: '03/15/2026',
    amountClaimed: '$10.00',
    status: 'CLAIMED',
    code: 'NFLFree10',
    rollover: '$0.00/$10.00',
    detail: 'NFL games only. Min odds −110.',
  },
  {
    id: 'rb-1',
    type: 'rakeback',
    name: 'Rakeback',
    dateAwarded: '03/12/2026',
    dateClaimed: '03/12/2026',
    dateExpires: null,
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
    dateExpires: null,
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
    dateExpires: null,
    amountClaimed: '$5.00',
    status: 'CLAIMED',
    detail: 'On-demand VIP reload. 1 of 7 claimed.',
  },
  {
    id: 'rb-2',
    type: 'rakeback',
    name: 'Rakeback',
    dateAwarded: '03/07/2026',
    dateClaimed: '03/07/2026',
    dateExpires: null,
    amountClaimed: '$3.15',
    status: 'CLAIMED',
  },
  {
    id: 'fs-2',
    type: 'free-spins',
    name: 'Gold Tier Free Spins',
    dateAwarded: '02/28/2026',
    dateClaimed: '03/01/2026',
    dateExpires: '03/08/2026',
    amountClaimed: null,
    status: 'CLAIMED',
    freeSpinsLeft: 8,
    freeSpinsTotal: 25,
    code: '1888100',
    bonusFunds: '$5.00',
    rollover: '$0.00/$125.00',
    actionLabel: 'PLAY',
    game: {
      name: DEMO_FS_GAME_2.name,
      image: DEMO_FS_GAME_2.image,
      provider: DEMO_FS_GAME_2.provider,
    },
    detail: `Play on ${DEMO_FS_GAME_2.name}.`,
  },
  {
    id: 'fb-3',
    type: 'free-bets',
    name: 'Welcome Free Bet',
    dateAwarded: '02/10/2026',
    dateClaimed: '02/10/2026',
    dateExpires: '02/24/2026',
    amountClaimed: '$50.00',
    status: 'USED',
    code: 'Welcome50',
    rollover: '$50.00/$50.00',
    detail: 'Fully used.',
  },
  {
    id: 'rl-2',
    type: 'reload',
    name: 'Monthly Reload',
    dateAwarded: '02/01/2026',
    dateClaimed: '02/01/2026',
    dateExpires: null,
    amountClaimed: '$25.00',
    status: 'CLAIMED',
  },
  {
    id: 'boost-1',
    type: 'boost',
    name: 'Weekly Boost',
    dateAwarded: '01/20/2026',
    dateClaimed: '01/20/2026',
    dateExpires: null,
    amountClaimed: '$10.00',
    status: 'CLAIMED',
  },
  {
    id: 'fs-3',
    type: 'free-spins',
    name: 'Free Spins',
    dateAwarded: '01/05/2026',
    dateClaimed: '01/05/2026',
    dateExpires: '01/12/2026',
    amountClaimed: null,
    status: 'USED',
    freeSpinsLeft: 0,
    freeSpinsTotal: 20,
    code: '1888100',
    bonusFunds: '$0.00',
    rollover: '$0.00/$0.00',
    actionLabel: 'PLAY',
    game: {
      name: DEMO_FS_GAME.name,
      image: DEMO_FS_GAME.image,
      provider: DEMO_FS_GAME.provider,
    },
    detail: 'All spins used.',
  },
  {
    id: 'raf-2',
    type: 'referral',
    name: 'Refer a Friend Commission',
    dateAwarded: '12/15/2025',
    dateClaimed: '12/16/2025',
    dateExpires: null,
    amountClaimed: '$12.50',
    status: 'CLAIMED',
  },
  {
    id: 'rl-3',
    type: 'reload',
    name: 'Post-Monthly Reload',
    dateAwarded: '11/01/2025',
    dateClaimed: null,
    dateExpires: '11/15/2025',
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
    item.game?.name ?? '',
    item.code ?? '',
    item.bonusFunds ?? '',
    item.rollover ?? '',
    item.amountClaimed ?? '',
    item.dateExpires ?? '',
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

function formatSpinsCell(item: RewardItem) {
  const left = item.freeSpinsLeft ?? 0
  const total = item.freeSpinsTotal ?? left
  return `${left}/${total}`
}

function formatAmountCell(item: RewardItem) {
  if (item.type === 'free-spins') {
    return formatSpinsCell(item)
  }
  return item.amountClaimed ?? '—'
}

function StatusBadge({ status }: { status: RewardStatus }) {
  const colors = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        'inline-flex rounded border px-2 py-0.5 text-[11px] font-normal',
        colors.text,
        colors.border,
        colors.bg
      )}
    >
      {status}
    </span>
  )
}

function canPlayFreeSpins(item: RewardItem) {
  return (
    item.type === 'free-spins' &&
    (item.freeSpinsLeft ?? 0) > 0 &&
    (Boolean(item.game) || Boolean(item.chooseGame)) &&
    (item.status === 'CLAIMED' || item.status === 'AVAILABLE')
  )
}

function canUseFreeBet(item: RewardItem) {
  return (
    item.type === 'free-bets' &&
    Boolean(item.amountClaimed) &&
    (item.status === 'CLAIMED' || item.status === 'AVAILABLE')
  )
}

function PlayGameButton({
  onClick,
  className,
  label = 'Play game',
}: {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-md p-0',
        'border border-[var(--ds-primary,#ee3536)]/45 bg-[var(--ds-primary,#ee3536)]/10',
        'text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-primary,#ee3536)]/18',
        'hover:border-[var(--ds-primary,#ee3536)]/70',
        className
      )}
    >
      <PlayIcon className="size-3.5 fill-current" aria-hidden="true" />
    </button>
  )
}

function tabForItem(item: RewardItem): BonusTab {
  if (item.type === 'free-spins') return 'Casino'
  if (item.type === 'free-bets') return 'Sports'
  return 'Cash Rewards'
}

type MyBonusPageProps = {
  brandPrimary?: string
  setShowVipRewards?: (show: boolean) => void
}

export function MyBonusPage({ setShowVipRewards }: MyBonusPageProps) {
  const id = useId()
  const isMobile = useIsMobile()
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [activeTab, setActiveTab] = useState<BonusTab>('Casino')
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const [pickerItem, setPickerItem] = useState<RewardItem | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<RewardType[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'dateAwarded', desc: true },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const [data] = useState<RewardItem[]>(SEED_REWARDS)

  // Reset filters when switching tabs — columns differ per tab
  const handleTabChange = (value: string) => {
    const tab = value as BonusTab
    setActiveTab(tab)
    setExpandedRowId(null)
    setPickerItem(null)
    setSelectedTypes([])
    setColumnFilters([])
    setSorting([
      {
        id:
          tab === 'Cash Rewards' || tab === 'Sports'
            ? 'dateAwarded'
            : 'name',
        desc: true,
      },
    ])
  }

  const typeCounts = useMemo(() => {
    const counts = new Map<RewardType, number>()
    for (const type of CASH_TYPE_FILTER_OPTIONS) counts.set(type, 0)
    for (const item of data) {
      if (!CASH_TYPE_FILTER_OPTIONS.includes(item.type)) continue
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1)
    }
    return counts
  }, [data])

  const tabData = useMemo(
    () => data.filter((item) => tabForItem(item) === activeTab),
    [activeTab, data]
  )

  const filteredByType = useMemo(() => {
    if (activeTab !== 'Cash Rewards' || selectedTypes.length === 0) return tabData
    return tabData.filter((r) => selectedTypes.includes(r.type))
  }, [activeTab, selectedTypes, tabData])

  const handleTypeChange = (checked: boolean, value: RewardType) => {
    setSelectedTypes((prev) => {
      if (checked) return prev.includes(value) ? prev : [...prev, value]
      return prev.filter((type) => type !== value)
    })
  }

  const launchFreeSpinGame = (
    item: RewardItem,
    game: Pick<FreeSpinGameOption, 'name' | 'image' | 'provider'>
  ) => {
    setShowVipRewards?.(false)
    setPickerItem(null)
    launchCasinoGame({
      title: game.name,
      image: game.image,
      provider: game.provider,
      features: ['Free spins applied'],
    })
    playSound('redeem')
    toast.success(`Playing ${game.name}`, {
      description: 'Free spins applied to your game.',
      duration: 3500,
    })
  }

  const playAssignedGame = (item: RewardItem) => {
    if (item.chooseGame || item.actionLabel === 'PICK A GAME') {
      setPickerItem(item)
      return
    }
    const game = item.game
    if (!game) return
    launchFreeSpinGame(item, game)
  }

  const handlePickerSelect = (game: FreeSpinGameOption) => {
    if (!pickerItem) return
    launchFreeSpinGame(pickerItem, game)
  }

  const useFreeBet = (item: RewardItem) => {
    playSound('redeem')
    toast.success('Free bet ready', {
      description: `${item.amountClaimed ?? 'Free bet'} applied — place your sports wager.`,
      duration: 3500,
    })
  }

  const columns: ColumnDef<RewardItem>[] = useMemo(() => {
    const nameCol: ColumnDef<RewardItem> = {
      header: 'Reward',
      accessorKey: 'name',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-[var(--ds-fg)]">
              {item.name}
            </div>
            <div className="mt-0.5 truncate text-[11px] text-[var(--ds-fg-subtle)]">
              {REWARD_TYPE_LABEL[item.type]}
            </div>
          </div>
        )
      },
      size: 200,
      filterFn: searchFilterFn,
      enableHiding: false,
    }

    const expCol: ColumnDef<RewardItem> = {
      header: 'Exp:',
      accessorKey: 'dateExpires',
      cell: ({ row }) => (
        <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
          {(row.getValue('dateExpires') as string | null) ?? '—'}
        </div>
      ),
      size: 120,
    }

    const statusCol: ColumnDef<RewardItem> = {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      size: 110,
      filterFn: statusFilterFn,
    }

    if (activeTab === 'Casino') {
      return [
        {
          header: 'Code',
          accessorKey: 'code',
          cell: ({ row }) => (
            <div className="truncate text-sm text-[var(--ds-fg-muted)]">
              {row.original.code ?? '—'}
            </div>
          ),
          size: 140,
          filterFn: searchFilterFn,
          enableHiding: false,
        },
        {
          header: 'Name',
          accessorKey: 'name',
          cell: ({ row }) => (
            <div className="truncate text-sm font-medium text-[var(--ds-fg)]">
              {row.original.name}
            </div>
          ),
          size: 160,
        },
        {
          id: 'bonusFunds',
          header: 'Bonus Funds',
          accessorFn: (row) => row.bonusFunds ?? '—',
          cell: ({ row }) => (
            <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
              {row.original.bonusFunds ?? '—'}
            </div>
          ),
          size: 110,
        },
        {
          header: 'Exp:',
          accessorKey: 'dateExpires',
          cell: ({ row }) => (
            <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
              {row.original.dateExpires ?? '—'}
            </div>
          ),
          size: 110,
        },
        {
          id: 'rollover',
          header: 'Rollover',
          accessorFn: (row) => row.rollover ?? '—',
          cell: ({ row }) => (
            <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
              {row.original.rollover ?? '—'}
            </div>
          ),
          size: 130,
        },
        {
          id: 'spins',
          header: 'Spins',
          accessorFn: (row) => formatSpinsCell(row),
          cell: ({ row }) => (
            <div className="text-sm font-medium tabular-nums text-[var(--ds-fg)]">
              {formatSpinsCell(row.original)}
            </div>
          ),
          size: 90,
        },
        {
          id: 'action',
          header: () => (
            <span className="flex w-full justify-center">Action</span>
          ),
          cell: ({ row }) => {
            const item = row.original
            if (!canPlayFreeSpins(item)) {
              return (
                <div className="flex w-full justify-center">
                  <span className="text-xs text-[var(--ds-fg-subtle)]">—</span>
                </div>
              )
            }
            const label =
              item.actionLabel ?? (item.chooseGame ? 'PICK A GAME' : 'PLAY')
            return (
              <div className="flex w-full justify-center">
                <button
                  type="button"
                  onClick={() => playAssignedGame(item)}
                  className="inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded px-3 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                >
                  {label}
                </button>
              </div>
            )
          },
          size: 128,
          enableSorting: false,
        },
        {
          id: 'more',
          header: () => (
            <span className="flex w-full justify-center">More</span>
          ),
          cell: ({ row }) => {
            const open = expandedRowId === row.original.id
            return (
              <div className="flex w-full justify-center">
                <button
                  type="button"
                  aria-label={open ? 'Collapse details' : 'Expand details'}
                  onClick={() =>
                    setExpandedRowId(open ? null : row.original.id)
                  }
                  className="inline-flex size-8 shrink-0 items-center justify-center"
                >
                  <IconChevronDown
                    className={cn(
                      'size-4 text-[var(--ds-fg-muted)] transition-transform',
                      open && 'rotate-180'
                    )}
                  />
                </button>
              </div>
            )
          },
          size: 64,
          enableSorting: false,
          enableHiding: false,
        },
      ]
    }

    if (activeTab === 'Sports') {
      return [
        {
          header: 'Code',
          accessorKey: 'code',
          cell: ({ row }) => (
            <div className="truncate text-sm text-[var(--ds-fg-muted)]">
              {row.original.code ?? row.original.name}
            </div>
          ),
          size: 180,
          filterFn: searchFilterFn,
          enableHiding: false,
        },
        {
          id: 'amountClaimed',
          header: 'Amount',
          accessorFn: (row) => row.amountClaimed ?? '—',
          cell: ({ row }) => (
            <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
              {row.original.amountClaimed ?? '—'}
            </div>
          ),
          size: 120,
        },
        {
          id: 'rollover',
          header: 'Rollover',
          accessorFn: (row) => row.rollover ?? '—',
          cell: ({ row }) => (
            <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
              {row.original.rollover ?? '—'}
            </div>
          ),
          size: 120,
        },
        {
          header: 'Date',
          accessorKey: 'dateAwarded',
          cell: ({ row }) => (
            <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
              {row.original.dateAwarded}
            </div>
          ),
          size: 120,
        },
        statusCol,
        {
          id: 'more',
          header: () => (
            <span className="flex w-full justify-center">More</span>
          ),
          cell: ({ row }) => {
            const open = expandedRowId === row.original.id
            return (
              <div className="flex w-full justify-center">
                <button
                  type="button"
                  aria-label={open ? 'Collapse details' : 'Expand details'}
                  onClick={() =>
                    setExpandedRowId(open ? null : row.original.id)
                  }
                  className="inline-flex size-8 shrink-0 items-center justify-center"
                >
                  <IconChevronDown
                    className={cn(
                      'size-4 text-[var(--ds-fg-muted)] transition-transform',
                      open && 'rotate-180'
                    )}
                  />
                </button>
              </div>
            )
          },
          size: 64,
          enableSorting: false,
          enableHiding: false,
        },
      ]
    }

    // Cash Rewards — same ledger, no free spins / free bets
    return [
      nameCol,
      {
        header: 'Date Awarded',
        accessorKey: 'dateAwarded',
        cell: ({ row }) => (
          <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
            {row.getValue('dateAwarded')}
          </div>
        ),
        size: 130,
      },
      {
        header: 'Date Claimed',
        accessorKey: 'dateClaimed',
        cell: ({ row }) => (
          <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
            {(row.getValue('dateClaimed') as string | null) ?? '—'}
          </div>
        ),
        size: 130,
      },
      expCol,
      {
        id: 'amountClaimed',
        header: 'Amount Claimed',
        accessorFn: (row) => formatAmountCell(row),
        cell: ({ row }) => (
          <div className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
            {formatAmountCell(row.original)}
          </div>
        ),
        size: 140,
      },
      statusCol,
    ]
  }, [activeTab, expandedRowId, setShowVipRewards])

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

  const appliedFilterCount =
    (activeTab === 'Cash Rewards' ? selectedTypes.length : 0) +
    selectedStatuses.length

  const emptyLabel =
    activeTab === 'Casino'
      ? 'No free spins yet.'
      : activeTab === 'Sports'
        ? 'No free bets yet.'
        : 'No cash rewards yet.'

  return (
    <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
      <div className="w-full px-4 pb-28 pt-6 md:px-6 md:pb-8 md:pt-8">
        <div className="w-full">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-[var(--ds-fg)] md:text-3xl">
                My Bonus
              </h1>
              <p className="mt-1 max-w-xl text-sm text-[var(--ds-fg-subtle)]">
                Free spins, free bets, and cash rewards claimed from the hub.
              </p>
            </div>
            <div
              className="flex w-fit shrink-0 items-center gap-1 self-start rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-bg)] p-0.5"
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
                    Sign in to track free spins, free bets, and cash rewards
                    claimed from the hub.
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
              <div className="mb-4 md:mb-5">
                <AnimateTabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <AnimateTabsList className="relative h-auto gap-1 rounded-3xl border-0 bg-white/5 p-0.5 transition-colors duration-300">
                    {BONUS_TABS.map((tab) => (
                      <TabsTab
                        key={tab}
                        value={tab}
                        className="relative z-10 flex h-9 items-center gap-1.5 rounded-2xl px-4 py-1 text-xs font-medium text-[var(--ds-fg-muted)] transition-colors duration-300 ease-in-out hover:bg-white/5 hover:text-[var(--ds-fg)] focus-visible:outline-none focus-visible:ring-0 data-[state=active]:text-white"
                      >
                        {activeTab === tab && (
                          <motion.div
                            layoutId="activeBonusTab"
                            className="absolute inset-0 -z-10 rounded-2xl"
                            style={{
                              backgroundColor: 'var(--ds-primary, #ee3536)',
                            }}
                            initial={false}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 40,
                            }}
                          />
                        )}
                        <span className="relative z-10">{tab}</span>
                      </TabsTab>
                    ))}
                  </AnimateTabsList>
                </AnimateTabs>
              </div>

              {isMobile ? (
                <Popover>
                  <div className="mb-4 flex items-center gap-3">
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--ds-fg-muted)]"
                      >
                        <IconFilter className="h-4 w-4 text-[var(--ds-fg-subtle)]" />
                        Add Filter
                      </button>
                    </PopoverTrigger>
                    <div className="h-5 w-px bg-[var(--ds-control-hover)]" />
                    <span className="text-sm text-[var(--ds-fg-subtle)]">
                      {appliedFilterCount > 0
                        ? `${appliedFilterCount} filter${appliedFilterCount > 1 ? 's' : ''} applied`
                        : 'No filters applied'}
                    </span>
                  </div>
                  <PopoverContent
                    className="w-auto min-w-44 border-[var(--ds-border)] bg-[var(--ds-surface-raised)] p-3"
                    align="start"
                  >
                    <div className="space-y-4">
                      {activeTab === 'Cash Rewards' ? (
                        <div className="space-y-3">
                          <div className="text-xs font-medium text-[var(--ds-fg-muted)]">
                            Filter by Type
                          </div>
                          <div className="space-y-3">
                            {CASH_TYPE_FILTER_OPTIONS.map((type, i) => (
                              <div key={type} className="flex items-center gap-2">
                                <Checkbox
                                  id={`${id}-m-type-${i}`}
                                  checked={selectedTypes.includes(type)}
                                  onCheckedChange={(checked: boolean) =>
                                    handleTypeChange(checked, type)
                                  }
                                  className="border-white/20"
                                />
                                <Label
                                  htmlFor={`${id}-m-type-${i}`}
                                  className="flex grow justify-between gap-2 font-normal text-[var(--ds-fg)]"
                                >
                                  {REWARD_TYPE_LABEL[type]}{' '}
                                  <span className="ms-2 text-xs text-[var(--ds-fg-subtle)]">
                                    {typeCounts.get(type) ?? 0}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <div className="space-y-3">
                        <div className="text-xs font-medium text-[var(--ds-fg-muted)]">
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
                                <span className="ms-2 text-xs text-[var(--ds-fg-subtle)]">
                                  {statusCounts.get(value)}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Input
                      id={`${id}-input`}
                      ref={inputRef}
                      className={cn(
                        'peer min-w-60 border-[var(--ds-border)] bg-[var(--ds-control-bg)] ps-9 text-sm text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)]',
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
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-[var(--ds-fg-subtle)] peer-disabled:opacity-50">
                      <ListFilterIcon size={16} aria-hidden="true" />
                    </div>
                    {Boolean(table.getColumn('name')?.getFilterValue()) && (
                      <button
                        type="button"
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-[var(--ds-fg-subtle)] outline-none hover:text-[var(--ds-fg)]"
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
                        aria-label={
                          appliedFilterCount > 0
                            ? `Filters, ${appliedFilterCount} applied`
                            : 'Filters'
                        }
                        className="relative h-9 w-9 shrink-0 border-[var(--ds-border)] bg-[var(--ds-control-bg)] p-0 text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)]"
                      >
                        <FilterIcon
                          className="opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                        {appliedFilterCount > 0 && (
                          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-white/20 bg-[var(--ds-control-hover)] px-1 text-[0.625rem] font-medium text-[var(--ds-fg-muted)]">
                            {appliedFilterCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto min-w-44 border-[var(--ds-border)] bg-[var(--ds-surface-raised)] p-3"
                      align="start"
                    >
                      <div className="space-y-4">
                        {activeTab === 'Cash Rewards' ? (
                          <div className="space-y-3">
                            <div className="text-xs font-medium text-[var(--ds-fg-muted)]">
                              Type
                            </div>
                            <div className="space-y-3">
                              {CASH_TYPE_FILTER_OPTIONS.map((type, i) => (
                                <div
                                  key={type}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    id={`${id}-type-${i}`}
                                    checked={selectedTypes.includes(type)}
                                    onCheckedChange={(checked: boolean) =>
                                      handleTypeChange(checked, type)
                                    }
                                    className="border-white/20"
                                  />
                                  <Label
                                    htmlFor={`${id}-type-${i}`}
                                    className="flex grow justify-between gap-2 font-normal text-[var(--ds-fg)]"
                                  >
                                    {REWARD_TYPE_LABEL[type]}{' '}
                                    <span className="ms-2 text-xs text-[var(--ds-fg-subtle)]">
                                      {typeCounts.get(type) ?? 0}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        <div className="space-y-3">
                          <div className="text-xs font-medium text-[var(--ds-fg-muted)]">
                            Status
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
                                  <span className="ms-2 text-xs text-[var(--ds-fg-subtle)]">
                                    {statusCounts.get(value)}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Toggle columns"
                        className="h-9 w-9 shrink-0 border-[var(--ds-border)] bg-[var(--ds-control-bg)] p-0 text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)]"
                      >
                        <Columns3Icon
                          className="opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-[var(--ds-border)] bg-[var(--ds-surface-raised)]"
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
                <div className="space-y-2.5">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      const item = row.original
                      const expanded = expandedRowId === item.id
                      const showPlayGame = canPlayFreeSpins(item)
                      const actionLabel =
                        item.actionLabel ??
                        (item.chooseGame ? 'PICK A GAME' : 'PLAY')

                      if (activeTab === 'Casino') {
                        return (
                          <div
                            key={row.id}
                            className="overflow-hidden rounded-xl border border-[var(--ds-border)] bg-[var(--ds-control-bg)]"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedRowId(expanded ? null : item.id)
                              }
                              className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[var(--ds-fg)]">
                                  {item.name}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] tabular-nums text-[var(--ds-fg-subtle)]">
                                  {item.code ?? '—'}
                                  {' · '}
                                  {formatSpinsCell(item)} spins
                                </p>
                              </div>
                              {showPlayGame ? (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    playAssignedGame(item)
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      playAssignedGame(item)
                                    }
                                  }}
                                  className="inline-flex h-8 shrink-0 items-center justify-center rounded px-3 text-[10px] font-semibold uppercase tracking-wide text-white"
                                  style={{
                                    backgroundColor:
                                      'var(--ds-primary, #ee3536)',
                                  }}
                                >
                                  {actionLabel}
                                </span>
                              ) : null}
                              <IconChevronDown
                                className={cn(
                                  'size-4 shrink-0 text-[var(--ds-fg-subtle)] transition-transform',
                                  expanded && 'rotate-180'
                                )}
                              />
                            </button>
                            {expanded ? (
                              <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] px-3.5 py-3 text-sm">
                                <div>
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Bonus Funds
                                  </span>
                                  <p className="font-medium tabular-nums text-[var(--ds-fg)]">
                                    {item.bonusFunds ?? '—'}
                                  </p>
                                </div>
                                <div>
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Exp:
                                  </span>
                                  <p className="font-medium tabular-nums text-[var(--ds-fg)]">
                                    {item.dateExpires ?? '—'}
                                  </p>
                                </div>
                                <div>
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Rollover
                                  </span>
                                  <p className="font-medium tabular-nums text-[var(--ds-fg)]">
                                    {item.rollover ?? '—'}
                                  </p>
                                </div>
                                <div>
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Spins
                                  </span>
                                  <p className="font-medium tabular-nums text-[var(--ds-fg)]">
                                    {formatSpinsCell(item)}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Available on
                                  </span>
                                  <p className="text-[var(--ds-fg)]">
                                    {item.chooseGame
                                      ? 'Select a game to apply free spins'
                                      : item.game?.name ?? item.detail ?? '—'}
                                  </p>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )
                      }

                      if (activeTab === 'Sports') {
                        return (
                          <div
                            key={row.id}
                            className="overflow-hidden rounded-xl border border-[var(--ds-border)] bg-[var(--ds-control-bg)]"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedRowId(expanded ? null : item.id)
                              }
                              className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[var(--ds-fg)]">
                                  {item.code ?? item.name}
                                </p>
                                <p className="mt-0.5 text-[12px] tabular-nums text-[var(--ds-fg-muted)]">
                                  {item.dateAwarded}
                                </p>
                              </div>
                              <StatusBadge status={item.status} />
                              <IconChevronDown
                                className={cn(
                                  'size-4 shrink-0 text-[var(--ds-fg-subtle)] transition-transform',
                                  expanded && 'rotate-180'
                                )}
                              />
                            </button>
                            {expanded ? (
                              <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] px-3.5 py-3 text-sm">
                                <div>
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Amount
                                  </span>
                                  <p className="font-medium tabular-nums text-[var(--ds-fg)]">
                                    {item.amountClaimed ?? '—'}
                                  </p>
                                </div>
                                <div>
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Rollover
                                  </span>
                                  <p className="font-medium tabular-nums text-[var(--ds-fg)]">
                                    {item.rollover ?? '—'}
                                  </p>
                                </div>
                                <div>
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Exp:
                                  </span>
                                  <p className="font-medium tabular-nums text-[var(--ds-fg)]">
                                    {item.dateExpires ?? '—'}
                                  </p>
                                </div>
                                <div>
                                  <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                    Name
                                  </span>
                                  <p className="text-[var(--ds-fg)]">{item.name}</p>
                                </div>
                                {item.detail ? (
                                  <div className="col-span-2">
                                    <span className="block text-[11px] text-[var(--ds-fg-subtle)]">
                                      Details
                                    </span>
                                    <p className="text-[var(--ds-fg)]">
                                      {item.detail}
                                    </p>
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        )
                      }

                      return (
                        <div
                          key={row.id}
                          className="rounded-xl border border-[var(--ds-border)] bg-[var(--ds-control-bg)] p-3.5"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-snug text-[var(--ds-fg)]">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-[12px] text-[var(--ds-fg-subtle)]">
                              {REWARD_TYPE_LABEL[item.type]}
                            </p>
                            <p className="mt-1 text-[12px] font-medium tabular-nums text-[var(--ds-fg)]">
                              {formatAmountCell(item)}
                            </p>
                            <div className="mt-2">
                              <StatusBadge status={item.status} />
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/[0.06] pt-2.5 text-[11px] text-[var(--ds-fg-subtle)]">
                            <span>
                              Awarded{' '}
                              <span className="tabular-nums text-[var(--ds-fg-muted)]">
                                {item.dateAwarded}
                              </span>
                            </span>
                            <span className="text-white/15" aria-hidden>
                              ·
                            </span>
                            <span>
                              Claimed{' '}
                              <span className="tabular-nums text-[var(--ds-fg-muted)]">
                                {item.dateClaimed ?? '—'}
                              </span>
                            </span>
                            <span className="text-white/15" aria-hidden>
                              ·
                            </span>
                            <span>
                              Exp:{' '}
                              <span className="tabular-nums text-[var(--ds-fg-muted)]">
                                {item.dateExpires ?? '—'}
                              </span>
                            </span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="rounded-xl border border-[var(--ds-border)] bg-[var(--ds-control-bg)] px-4 py-10 text-center text-sm text-[var(--ds-fg-subtle)]">
                      {emptyLabel}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-4 overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-control-bg)]">
                  <div className="overflow-x-auto">
                    <Table
                      className={cn(
                        'table-fixed',
                        activeTab === 'Casino' ? 'min-w-[1020px]' : 'min-w-[860px]'
                      )}
                    >
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow
                            key={headerGroup.id}
                            className="border-[var(--ds-border)] hover:bg-transparent"
                          >
                            {headerGroup.headers.map((header) => (
                              <TableHead
                                key={header.id}
                                style={{ width: `${header.getSize()}px` }}
                                className="h-11 text-xs font-normal text-[var(--ds-fg-muted)]"
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
                                          className="shrink-0 text-[var(--ds-fg)] opacity-60"
                                          size={16}
                                          aria-hidden="true"
                                        />
                                      ),
                                      desc: (
                                        <ChevronDownIcon
                                          className="shrink-0 text-[var(--ds-fg)] opacity-60"
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
                          table.getRowModel().rows.map((row) => {
                            const item = row.original
                            const expanded =
                              (activeTab === 'Casino' ||
                                activeTab === 'Sports') &&
                              expandedRowId === item.id
                            return (
                              <Fragment key={row.id}>
                                <TableRow className="border-[var(--ds-border)] hover:bg-white/[0.02]">
                                  {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </TableCell>
                                  ))}
                                </TableRow>
                                {expanded ? (
                                  <TableRow className="border-[var(--ds-border)]">
                                    <TableCell
                                      colSpan={columns.length}
                                      className="bg-white/[0.03] py-4"
                                    >
                                      {activeTab === 'Casino' ? (
                                        <div className="grid grid-cols-2 gap-4 pl-2 text-sm md:grid-cols-4">
                                          <div>
                                            <span className="mb-0.5 block text-[11px] text-[var(--ds-fg-subtle)]">
                                              Awarded
                                            </span>
                                            <span className="tabular-nums text-[var(--ds-fg)]">
                                              {item.dateAwarded}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="mb-0.5 block text-[11px] text-[var(--ds-fg-subtle)]">
                                              Status
                                            </span>
                                            <StatusBadge status={item.status} />
                                          </div>
                                          <div>
                                            <span className="mb-0.5 block text-[11px] text-[var(--ds-fg-subtle)]">
                                              Spins
                                            </span>
                                            <span className="tabular-nums text-[var(--ds-fg)]">
                                              {formatSpinsCell(item)}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="mb-0.5 block text-[11px] text-[var(--ds-fg-subtle)]">
                                              Available on
                                            </span>
                                            <span className="text-[var(--ds-fg)]">
                                              {item.chooseGame
                                                ? 'Select a game to apply free spins'
                                                : item.game?.name ??
                                                  item.detail ??
                                                  '—'}
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-2 gap-4 pl-2 text-sm md:grid-cols-3">
                                          <div>
                                            <span className="mb-0.5 block text-[11px] text-[var(--ds-fg-subtle)]">
                                              Exp:
                                            </span>
                                            <span className="tabular-nums text-[var(--ds-fg)]">
                                              {item.dateExpires ?? '—'}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="mb-0.5 block text-[11px] text-[var(--ds-fg-subtle)]">
                                              Name
                                            </span>
                                            <span className="text-[var(--ds-fg)]">
                                              {item.name}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="mb-0.5 block text-[11px] text-[var(--ds-fg-subtle)]">
                                              Details
                                            </span>
                                            <span className="text-[var(--ds-fg)]">
                                              {item.detail ?? '—'}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ) : null}
                              </Fragment>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center text-[var(--ds-fg-muted)]"
                            >
                              {emptyLabel}
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
        open={Boolean(pickerItem)}
        onOpenChange={(open) => {
          if (!open) setPickerItem(null)
        }}
        spinsLeft={pickerItem?.freeSpinsLeft}
        onSelect={handlePickerSelect}
      />
    </SidebarInset>
  )
}

export default MyBonusPage
