'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  IconCoins,
  IconCrown,
  IconDeviceGamepad2,
  IconLoader2,
  IconTrophy,
} from '@tabler/icons-react'
import { NumberFlowCountdown } from '@/components/daily-races-timer'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getVipLevelTagTone } from '@/lib/chat/vipLevels'
import { cn } from '@/lib/utils'

/** Match Refer-a-Friend / My Account hub tables */
const hairline = 'border-black/[0.06] dark:border-white/[0.04]'
const softFill = 'bg-black/[0.03] dark:bg-white/[0.03]'
const hubCard =
  'overflow-hidden rounded-xl border border-black/[0.06] bg-black/[0.03] dark:border-white/[0.05] dark:bg-white/[0.03]'
const thClass =
  'h-10 px-4 text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]'
const rowHover =
  'transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'

/** Map display labels (incl. Elite II / Black I) onto chat VIP tone ranks */
function vipToneRankFromLabel(label: string): number {
  const base = label.split(/\s+/)[0]?.toLowerCase() ?? 'bronze'
  switch (base) {
    case 'bronze':
      return 1
    case 'silver':
      return 2
    case 'gold':
      return 3
    case 'platinum':
      return 4
    case 'diamond':
      return 5
    case 'elite':
      return 6
    case 'black':
      return 7
    case 'obsidian':
      return 8
    default:
      return 1
  }
}

function ActivityUserCell({
  vipLevel,
}: {
  user?: string
  vipLevel?: string
}) {
  const tone = vipLevel ? getVipLevelTagTone(vipToneRankFromLabel(vipLevel)) : null

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="truncate text-sm text-[var(--ds-fg-subtle)]">Hidden</span>
      {vipLevel && tone ? (
        <IconCrown
          className="h-3.5 w-3.5 shrink-0"
          style={tone.iconStyle}
          aria-label={vipLevel}
          strokeWidth={1.75}
        />
      ) : null}
    </div>
  )
}

/** Clickable game thumb + title; spinner on the tile while launching */
function ActivityGameCell({
  title,
  image,
  onLaunch,
}: {
  title: string
  image?: string
  onLaunch: (game: { title: string; image: string }) => void
}) {
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleLaunch = () => {
    if (loading || !image) return
    setLoading(true)
    timerRef.current = setTimeout(() => {
      onLaunch({ title, image })
      timerRef.current = setTimeout(() => setLoading(false), 400)
    }, 850)
  }

  return (
    <button
      type="button"
      disabled={loading || !image}
      aria-label={loading ? `Loading ${title}` : `Play ${title}`}
      aria-busy={loading}
      className={cn(
        'group flex max-w-full items-center gap-2 text-left transition-opacity',
        image ? 'cursor-pointer' : 'cursor-default opacity-70',
        loading && 'cursor-wait'
      )}
      onClick={handleLaunch}
    >
      {image ? (
        <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={title}
            width={36}
            height={36}
            className="h-full w-full object-cover"
            quality={75}
            unoptimized
          />
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-black/65 transition-opacity duration-200',
              loading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            {loading ? (
              <IconLoader2
                className="h-4 w-4 animate-spin text-white"
                strokeWidth={2.25}
                aria-hidden
              />
            ) : null}
          </span>
        </span>
      ) : (
        <IconDeviceGamepad2 className="h-4 w-4 flex-shrink-0 text-[var(--ds-fg-muted)]" />
      )}
      <span className="max-w-[200px] truncate text-sm font-medium text-[var(--ds-fg)] transition-colors group-hover:text-[var(--ds-fg-muted)] group-disabled:text-[var(--ds-fg)]">
        {loading ? 'Loading…' : title}
      </span>
    </button>
  )
}

export type CasinoActivityTabKey = 'All Bets' | 'Jackpot Winners' | 'High Rollers' | 'Daily Race'

export type CasinoJackpotWinnerRow = {
  id: string
  user: string
  vipLevel?: string
  game: string
  amount: string
  time: string
  gameImage?: string
}

export type CasinoActivityFeedRow = {
  id: string
  type: string
  event: string
  user: string
  vipLevel?: string
  betAmount: string
  multiplier: string
  /** Positive payout string like `$4.05`, or loss like `-$20.48` */
  payout: string
  /** True when payout is a win (green) */
  isWin: boolean
  gameImage?: string
}

export type CasinoRaceLeaderboardEntry = {
  rank: number
  nickname: string
  vipLevel?: string
  wagered: string
  prize: string
  medal?: 'gold' | 'silver' | 'bronze'
}

export type CasinoUserRaceSummary = {
  rank: number
  nickname: string
  wagered: string
  prize: string
}

export type CasinoActivityPanelProps = {
  isMobile: boolean
  heading: string
  /** Separate layout IDs if two panels could mount concurrently (normally only one branch is active). */
  tabLayoutId: string
  casinoActivityTab: CasinoActivityTabKey
  onCasinoActivityTabChange: (tab: CasinoActivityTabKey) => void
  casinoRaceHours: number
  casinoRaceMinutes: number
  casinoRaceSeconds: number
  casinoRaceLeaderboardData: readonly CasinoRaceLeaderboardEntry[]
  casinoUserRacePosition: CasinoUserRaceSummary
  casinoJackpotWinnersData: readonly CasinoJackpotWinnerRow[]
  casinoActivityFeed: readonly CasinoActivityFeedRow[]
  onSelectGame: (game: { title: string; image: string }) => void
}

export function CasinoActivityPanel({
  isMobile,
  heading,
  tabLayoutId,
  casinoActivityTab,
  onCasinoActivityTabChange,
  casinoRaceHours,
  casinoRaceMinutes,
  casinoRaceSeconds,
  casinoRaceLeaderboardData,
  casinoUserRacePosition,
  casinoJackpotWinnersData,
  casinoActivityFeed,
  onSelectGame,
}: CasinoActivityPanelProps) {
  const tabs: CasinoActivityTabKey[] = ['All Bets', 'Jackpot Winners', 'High Rollers', 'Daily Race']

  return (
    <div className={cn('mb-8', isMobile ? 'px-3' : 'px-6')}>
      <Separator className="mb-6 bg-[var(--ds-border)]" />
      <h2 className="mb-4 text-lg font-semibold text-[var(--ds-fg)]">{heading}</h2>

      <div className="scrollbar-hide mb-4 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="inline-flex h-auto w-max gap-1 rounded-3xl border-0 bg-[var(--ds-control-bg)] p-0.5 backdrop-blur-xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onCasinoActivityTabChange(tab)}
              className={cn(
                'relative flex h-9 shrink-0 items-center whitespace-nowrap rounded-2xl px-4 py-1 text-xs font-medium transition-all duration-300',
                casinoActivityTab === tab
                  ? 'text-white'
                  : 'border border-transparent bg-transparent text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]'
              )}
            >
              {casinoActivityTab === tab && (
                <motion.div
                  layoutId={tabLayoutId}
                  className="absolute inset-0 -z-10 rounded-2xl"
                  style={{ backgroundColor: '#ee3536' }}
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 40,
                  }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={hubCard}>
        <div className="scrollbar-hide max-h-[500px] overflow-y-auto">
          {casinoActivityTab === 'Daily Race' ? (
            <>
              <div
                className={cn(
                  'flex items-center justify-between border-b px-4 py-3',
                  hairline,
                  softFill
                )}
              >
                <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">
                  Ends in
                </span>
                <NumberFlowCountdown
                  hours={casinoRaceHours}
                  minutes={casinoRaceMinutes}
                  seconds={casinoRaceSeconds}
                  className="text-sm font-bold text-[var(--ds-fg)]"
                  colonClassName="text-[var(--ds-fg-muted)]"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className={cn('border-b', hairline)}>
                      <th className={cn(thClass, softFill)}>Rank</th>
                      <th className={cn(thClass, softFill)}>Nickname</th>
                      <th className={cn(thClass, softFill, 'text-right')}>Wagered</th>
                      <th className={cn(thClass, softFill, 'text-right')}>Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casinoRaceLeaderboardData.map((entry, index) => (
                      <tr
                        key={entry.rank}
                        className={cn(
                          'border-b',
                          hairline,
                          rowHover,
                          index % 2 === 1 ? softFill : 'bg-transparent'
                        )}
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            {entry.medal === 'gold' && (
                              <IconTrophy className="h-5 w-5 text-yellow-400" />
                            )}
                            {entry.medal === 'silver' && (
                              <IconTrophy className="h-5 w-5 text-gray-400" />
                            )}
                            {entry.medal === 'bronze' && (
                              <IconTrophy className="h-5 w-5 text-orange-400" />
                            )}
                            {!entry.medal && (
                              <span className="text-sm text-[var(--ds-fg-muted)]">
                                {entry.rank}th
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <ActivityUserCell vipLevel={entry.vipLevel} />
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm tabular-nums text-[var(--ds-fg-muted)]">
                          {entry.wagered}
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                          {entry.prize}
                        </td>
                      </tr>
                    ))}
                    <tr className={cn('border-t-2 bg-black/[0.04] dark:bg-white/[0.05]', hairline)}>
                      <td className="px-4 py-2.5">
                        <span className="text-sm font-semibold text-[var(--ds-fg)]">
                          {casinoUserRacePosition.rank}th
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm font-semibold text-[var(--ds-fg)]">
                        {casinoUserRacePosition.nickname}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                        {casinoUserRacePosition.wagered}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                        {casinoUserRacePosition.prize}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : casinoActivityTab === 'Jackpot Winners' ? (
            <Table>
              <TableHeader>
                <TableRow className={cn('border-b hover:bg-transparent', hairline)}>
                  <TableHead className={cn(thClass, softFill)}>Game</TableHead>
                  <TableHead className={cn(thClass, softFill)}>User</TableHead>
                  <TableHead className={cn(thClass, softFill)}>Time</TableHead>
                  <TableHead className={cn(thClass, softFill)}>Jackpot Won</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {casinoJackpotWinnersData.map((winner, idx) => (
                  <TableRow
                    key={winner.id}
                    className={cn(
                      'border-b',
                      hairline,
                      rowHover,
                      idx % 2 === 1 ? softFill : 'bg-transparent'
                    )}
                  >
                    <TableCell className="px-4 py-2.5">
                      <ActivityGameCell
                        title={winner.game}
                        image={winner.gameImage}
                        onLaunch={onSelectGame}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <ActivityUserCell vipLevel={winner.vipLevel} />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <span className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
                        {winner.time}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <IconTrophy className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-sm font-semibold tabular-nums text-amber-400">
                          {winner.amount}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className={cn('border-b hover:bg-transparent', hairline)}>
                  <TableHead className={cn(thClass, softFill)}>User</TableHead>
                  <TableHead className={cn(thClass, softFill)}>Game</TableHead>
                  <TableHead className={cn(thClass, softFill)}>Bet Amount</TableHead>
                  <TableHead className={cn(thClass, softFill)}>Multiplier</TableHead>
                  <TableHead className={cn(thClass, softFill)}>Payout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {casinoActivityFeed.map((activity, idx) => (
                    <motion.tr
                      key={activity.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className={cn(
                        'border-b',
                        hairline,
                        rowHover,
                        idx % 2 === 1 ? softFill : 'bg-transparent'
                      )}
                    >
                      <TableCell className="px-4 py-2.5">
                        <ActivityUserCell vipLevel={activity.vipLevel} />
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <ActivityGameCell
                          title={activity.event}
                          image={activity.gameImage}
                          onLaunch={onSelectGame}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <IconCoins className="h-3.5 w-3.5 text-green-400" />
                          <span className="text-sm font-medium tabular-nums text-[var(--ds-fg)]">
                            {activity.betAmount}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <span className="text-sm tabular-nums text-[var(--ds-fg)]">
                          {activity.multiplier}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <span
                          className={cn(
                            'text-sm font-medium tabular-nums',
                            activity.isWin
                              ? 'text-green-400'
                              : 'text-[var(--ds-fg-muted)]'
                          )}
                        >
                          {activity.payout}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
