'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  IconBroadcast,
  IconCoins,
  IconCrown,
  IconDeviceGamepad2,
  IconLoader2,
  IconPlayerPause,
  IconTrophy,
} from '@tabler/icons-react'
import { NumberFlowCountdown } from '@/components/daily-races-timer'
import { Separator } from '@/components/ui/separator'
import {
  JACKPOT_TICKER_TIERS,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'
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
const activityRowClass = cn(
  'grid h-14 items-center border-b bg-transparent',
  hairline,
  rowHover
)
const allBetsCols =
  'grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)_minmax(0,1.05fr)_minmax(0,0.8fr)_minmax(0,1fr)]'
const jackpotCols =
  'grid-cols-[minmax(0,0.95fr)_minmax(0,1.5fr)_minmax(0,0.95fr)_minmax(0,1.35fr)]'
const raceCols =
  'grid-cols-[minmax(0,1.35fr)_5.5rem_minmax(0,1.1fr)_minmax(0,1.15fr)_9.5rem]'
const stickyHeaderClass = cn(
  'sticky top-0 z-20 border-b backdrop-blur-md',
  hairline,
  softFill,
  'bg-[var(--ds-bg)]/95 dark:bg-[#141414]/95'
)
const DAILY_RACE_POOL = 25_000

function formatRacePrize(prizePercent: string): { cash: string; percent: string } {
  const pct = Number.parseFloat(prizePercent.replace('%', ''))
  const cash = Number.isFinite(pct) ? (DAILY_RACE_POOL * pct) / 100 : 0
  return {
    percent: prizePercent,
    cash: `$${cash.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  }
}

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

export type CasinoActivityTabKey = 'All Bets' | 'Jackpot Winners' | 'Daily Race'

export type CasinoJackpotWinnerRow = {
  id: string
  user: string
  vipLevel?: string
  game: string
  amount: string
  /** Calendar date, e.g. `Mar 12, 2026` */
  date: string
  tier: JackpotTickerTierId
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
  /** Pause live feed inserts while the user is interacting with the table (click games). */
  onLiveFeedHoverChange?: (hovering: boolean) => void
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
  onLiveFeedHoverChange,
}: CasinoActivityPanelProps) {
  const tabs: { key: CasinoActivityTabKey; label: string }[] = [
    { key: 'All Bets', label: 'All Bets' },
    { key: 'Jackpot Winners', label: 'Jackpot Winners' },
    { key: 'Daily Race', label: '25k Daily Race' },
  ]
  const [feedPaused, setFeedPaused] = useState(false)
  const showLiveStatus = casinoActivityTab === 'All Bets'

  useEffect(() => {
    if (!showLiveStatus) {
      setFeedPaused(false)
      onLiveFeedHoverChange?.(false)
    }
  }, [showLiveStatus, onLiveFeedHoverChange])

  const handleLiveFeedHoverChange = (hovering: boolean) => {
    setFeedPaused(hovering)
    onLiveFeedHoverChange?.(hovering)
  }

  return (
    <div className={cn('mb-8', isMobile ? 'px-3' : 'px-6')}>
      <Separator className="mb-6 bg-[var(--ds-border)]" />
      <h2 className="mb-4 text-lg font-semibold text-[var(--ds-fg)]">{heading}</h2>

      <div className="scrollbar-hide mb-4 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="inline-flex h-auto w-max gap-1 rounded-3xl border-0 bg-[var(--ds-control-bg)] p-0.5 backdrop-blur-xl">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onCasinoActivityTabChange(key)}
              className={cn(
                'relative flex h-9 shrink-0 items-center whitespace-nowrap rounded-2xl px-4 py-1 text-xs font-medium transition-all duration-300',
                casinoActivityTab === key
                  ? 'text-white'
                  : 'border border-transparent bg-transparent text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]'
              )}
            >
              {casinoActivityTab === key && (
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
              <span className="relative z-10 whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={hubCard}>
        <div className="scrollbar-hide max-h-[500px] overflow-y-auto">
          {casinoActivityTab === 'Daily Race' ? (
            <>
              <div className={cn('grid min-w-0', stickyHeaderClass, raceCols)}>
                {(['User', 'Rank', 'Wagered', 'Prize'] as const).map((label) => (
                  <div key={label} className={cn(thClass, 'flex items-center')}>
                    {label}
                  </div>
                ))}
                <div className="flex h-10 items-center justify-end gap-1.5 pr-3">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">
                    Ends in
                  </span>
                  <NumberFlowCountdown
                    hours={casinoRaceHours}
                    minutes={casinoRaceMinutes}
                    seconds={casinoRaceSeconds}
                    className="text-xs font-bold tabular-nums text-[var(--ds-fg)]"
                    colonClassName="text-[var(--ds-fg-muted)]"
                  />
                </div>
              </div>

              {casinoRaceLeaderboardData.map((entry) => {
                const { cash, percent } = formatRacePrize(entry.prize)
                return (
                  <div
                    key={entry.rank}
                    className={cn(activityRowClass, raceCols)}
                  >
                    <div className="min-w-0 px-4">
                      <ActivityUserCell vipLevel={entry.vipLevel} />
                    </div>
                    <div className="flex items-center gap-1.5 px-4">
                      {entry.medal === 'gold' && (
                        <IconTrophy className="h-4 w-4 shrink-0 text-yellow-400" />
                      )}
                      {entry.medal === 'silver' && (
                        <IconTrophy className="h-4 w-4 shrink-0 text-gray-400" />
                      )}
                      {entry.medal === 'bronze' && (
                        <IconTrophy className="h-4 w-4 shrink-0 text-orange-400" />
                      )}
                      <span className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
                        {entry.medal ? entry.rank : `${entry.rank}th`}
                      </span>
                    </div>
                    <div className="min-w-0 px-4">
                      <span className="text-sm tabular-nums text-[var(--ds-fg)]">
                        {entry.wagered}
                      </span>
                    </div>
                    <div className="min-w-0 px-4">
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                          {cash}
                        </span>
                        <span className="text-[10px] tabular-nums text-[var(--ds-fg-subtle)]">
                          {percent} of $25k
                        </span>
                      </div>
                    </div>
                    <div aria-hidden />
                  </div>
                )
              })}

              {(() => {
                const { cash, percent } = formatRacePrize(
                  casinoUserRacePosition.prize
                )
                return (
                  <div
                    className={cn(
                      activityRowClass,
                      raceCols,
                      'sticky bottom-0 z-20 border-t-2 backdrop-blur-md',
                      'bg-[var(--ds-bg)]/95 dark:bg-[#141414]/95',
                      'border-black/[0.08] dark:border-white/[0.08]'
                    )}
                  >
                    <div className="min-w-0 px-4">
                      <span className="text-sm font-semibold text-[var(--ds-fg)]">
                        {casinoUserRacePosition.nickname}
                      </span>
                    </div>
                    <div className="px-4">
                      <span className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                        {casinoUserRacePosition.rank}th
                      </span>
                    </div>
                    <div className="min-w-0 px-4">
                      <span className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                        {casinoUserRacePosition.wagered}
                      </span>
                    </div>
                    <div className="min-w-0 px-4">
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                          {cash}
                        </span>
                        <span className="text-[10px] tabular-nums text-[var(--ds-fg-subtle)]">
                          {percent} of $25k
                        </span>
                      </div>
                    </div>
                    <div aria-hidden />
                  </div>
                )
              })()}
            </>
          ) : casinoActivityTab === 'Jackpot Winners' ? (
            <>
              <div className={stickyHeaderClass}>
                <div className={cn('grid min-w-0', jackpotCols)}>
                  {(['User', 'Game', 'Date', 'Jackpot Won'] as const).map((label) => (
                    <div key={label} className={cn(thClass, 'flex items-center')}>
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {casinoJackpotWinnersData.map((winner) => {
                const tierMeta =
                  JACKPOT_TICKER_TIERS.find((t) => t.id === winner.tier) ??
                  JACKPOT_TICKER_TIERS[0]

                return (
                  <div
                    key={winner.id}
                    className={cn(activityRowClass, jackpotCols)}
                  >
                    <div className="min-w-0 px-4">
                      <ActivityUserCell vipLevel={winner.vipLevel} />
                    </div>
                    <div className="min-w-0 px-4">
                      <ActivityGameCell
                        title={winner.game}
                        image={winner.gameImage}
                        onLaunch={onSelectGame}
                      />
                    </div>
                    <div className="min-w-0 px-4">
                      <span className="text-sm tabular-nums text-[var(--ds-fg-muted)]">
                        {winner.date}
                      </span>
                    </div>
                    <div className="min-w-0 px-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                          style={{
                            color: tierMeta.accent,
                            backgroundColor: `${tierMeta.accent}22`,
                          }}
                        >
                          {tierMeta.shortLabel}
                        </span>
                        <span
                          className="truncate text-sm font-semibold tabular-nums"
                          style={{ color: tierMeta.accent }}
                        >
                          {winner.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div
              onMouseEnter={() => handleLiveFeedHoverChange(true)}
              onMouseLeave={() => handleLiveFeedHoverChange(false)}
            >
              <div className={cn(stickyHeaderClass, 'relative')}>
                <div className={cn('grid min-w-0', allBetsCols)}>
                  {(['User', 'Game', 'Bet Amount', 'Multiplier', 'Payout'] as const).map(
                    (label) => (
                      <div key={label} className={cn(thClass, 'flex items-center')}>
                        {label}
                      </div>
                    )
                  )}
                </div>
                <span
                  className={cn(
                    'absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md',
                    feedPaused
                      ? 'bg-white/10 text-[var(--ds-fg-muted)]'
                      : 'bg-red-500/15 text-red-400'
                  )}
                  aria-label={feedPaused ? 'Paused' : 'Live'}
                  aria-live="polite"
                >
                  {feedPaused ? (
                    <IconPlayerPause className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <IconBroadcast className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                </span>
              </div>

              <div
                className="relative overflow-hidden"
                style={{ height: 'calc(6 * 3.5rem)' }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {casinoActivityFeed.map((activity) => (
                    <motion.div
                      key={activity.id}
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12, transition: { duration: 0.18 } }}
                      transition={{
                        duration: 0.25,
                        ease: [0.22, 1, 0.36, 1],
                        layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                      }}
                      className={cn(activityRowClass, allBetsCols)}
                    >
                      <div className="min-w-0 px-4">
                        <ActivityUserCell vipLevel={activity.vipLevel} />
                      </div>
                      <div className="min-w-0 px-4">
                        <ActivityGameCell
                          title={activity.event}
                          image={activity.gameImage}
                          onLaunch={onSelectGame}
                        />
                      </div>
                      <div className="min-w-0 px-4">
                        <div className="flex items-center gap-1.5">
                          <IconCoins className="h-3.5 w-3.5 shrink-0 text-green-400" />
                          <span className="truncate text-sm font-medium tabular-nums text-[var(--ds-fg)]">
                            {activity.betAmount}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 px-4">
                        <span className="text-sm tabular-nums text-[var(--ds-fg)]">
                          {activity.multiplier}
                        </span>
                      </div>
                      <div className="min-w-0 px-4">
                        <span
                          className={cn(
                            'block truncate text-sm font-medium tabular-nums',
                            activity.isWin
                              ? 'text-green-400'
                              : 'text-[var(--ds-fg-muted)]'
                          )}
                        >
                          {activity.payout}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
