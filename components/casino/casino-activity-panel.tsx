'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { IconCoins, IconDeviceGamepad2, IconTrophy } from '@tabler/icons-react'
import { NumberFlowCountdown } from '@/components/daily-races-timer'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export type CasinoActivityTabKey = 'All Bets' | 'Jackpot Winners' | 'High Rollers' | 'Daily Race'

export type CasinoJackpotWinnerRow = {
  id: string
  user: string
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
  time: string
  betAmount: string
  winAmount?: string
  gameImage?: string
}

export type CasinoRaceLeaderboardEntry = {
  rank: number
  nickname: string
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
      <Separator className="mb-6 bg-white/10" />
      <h2 className="mb-4 text-lg font-semibold text-white">{heading}</h2>

      <div className="scrollbar-hide mb-4 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="inline-flex h-auto w-max gap-1 rounded-3xl border-0 bg-white/5 p-0.5 backdrop-blur-xl dark:bg-white/5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onCasinoActivityTabChange(tab)}
              className={cn(
                'relative flex h-9 shrink-0 items-center whitespace-nowrap rounded-2xl px-4 py-1 text-xs font-medium transition-all duration-300',
                casinoActivityTab === tab
                  ? 'text-white'
                  : 'border border-transparent bg-transparent text-white/70 hover:bg-white/5 hover:text-white'
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

      <Card className="overflow-hidden rounded-small border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="scrollbar-hide max-h-[500px] overflow-y-auto">
            {casinoActivityTab === 'Daily Race' ? (
              <div className="overflow-hidden rounded-lg border border-white/10 bg-[#2d2d2d] dark:bg-[#2d2d2d]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="text-xs text-white/70">Ends in</span>
                  <NumberFlowCountdown
                    hours={casinoRaceHours}
                    minutes={casinoRaceMinutes}
                    seconds={casinoRaceSeconds}
                    className="text-sm font-bold text-white"
                    colonClassName="text-white/50"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Nickname</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-white/70">Wagered</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-white/70">Prize</th>
                      </tr>
                    </thead>
                    <tbody>
                      {casinoRaceLeaderboardData.map((entry) => (
                        <tr key={entry.rank} className="border-b border-white/10 transition-colors hover:bg-white/10">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {entry.medal === 'gold' && <IconTrophy className="h-5 w-5 text-yellow-400" />}
                              {entry.medal === 'silver' && <IconTrophy className="h-5 w-5 text-gray-400" />}
                              {entry.medal === 'bronze' && <IconTrophy className="h-5 w-5 text-orange-400" />}
                              {!entry.medal && <span className="text-sm text-white/70">{entry.rank}th</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-white">{entry.nickname}</td>
                          <td className="px-4 py-3 text-right text-sm text-white">{entry.wagered}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-white">{entry.prize}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-white/20 bg-white/5">
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-white">{casinoUserRacePosition.rank}th</span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-white">{casinoUserRacePosition.nickname}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-white">{casinoUserRacePosition.wagered}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-white">{casinoUserRacePosition.prize}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : casinoActivityTab === 'Jackpot Winners' ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-white/70">Game</TableHead>
                    <TableHead className="text-xs font-medium text-white/70">User</TableHead>
                    <TableHead className="text-xs font-medium text-white/70">Time</TableHead>
                    <TableHead className="text-xs font-medium text-white/70">Jackpot Won</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {casinoJackpotWinnersData.map((winner, idx) => (
                    <TableRow
                      key={winner.id}
                      className={cn(
                        'border-b border-white/10 transition-colors hover:bg-white/5',
                        idx === 0 && 'bg-amber-500/5'
                      )}
                    >
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {winner.gameImage ? (
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-small">
                              <Image
                                src={winner.gameImage}
                                alt={winner.game}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                                quality={75}
                                unoptimized
                              />
                            </div>
                          ) : (
                            <IconDeviceGamepad2 className="h-4 w-4 text-white/70" />
                          )}
                          <span
                            className="max-w-[200px] cursor-pointer truncate text-sm text-white transition-colors hover:text-white/80"
                            onClick={() => {
                              if (winner.gameImage) {
                                onSelectGame({ title: winner.game, image: winner.gameImage })
                              }
                            }}
                          >
                            {winner.game}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className={cn('text-sm', winner.user === 'Hidden' ? 'text-white/50' : 'text-white')}>
                          {winner.user}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-sm text-white/60">{winner.time}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <IconTrophy className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-sm font-semibold text-amber-400">{winner.amount}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-white/70">Game</TableHead>
                    <TableHead className="text-xs font-medium text-white/70">User</TableHead>
                    <TableHead className="text-xs font-medium text-white/70">Time</TableHead>
                    <TableHead className="text-xs font-medium text-white/70">Bet Amount</TableHead>
                    <TableHead className="text-xs font-medium text-white/70">Win Amount</TableHead>
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
                          'border-b border-white/10 transition-colors hover:bg-white/5',
                          idx === 0 && 'bg-white/5'
                        )}
                      >
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {activity.gameImage ? (
                              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-small">
                                <Image
                                  src={activity.gameImage}
                                  alt={activity.event}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                  quality={75}
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <IconDeviceGamepad2 className="h-4 w-4 text-white/70" />
                            )}
                            <span
                              className="max-w-[200px] cursor-pointer truncate text-sm text-white transition-colors hover:text-white/80"
                              onClick={() => {
                                if (activity.gameImage) {
                                  onSelectGame({ title: activity.event, image: activity.gameImage })
                                }
                              }}
                            >
                              {activity.event}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className={cn('text-sm', activity.user === 'Hidden' ? 'text-white/50' : 'text-white')}>
                            {activity.user}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className="text-sm text-white/60">{activity.time}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <IconCoins className="h-3.5 w-3.5 text-green-400" />
                            <span className="text-sm font-medium text-white">{activity.betAmount}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {activity.winAmount ? (
                            <span className="text-sm font-medium text-green-400">{activity.winAmount}</span>
                          ) : (
                            <span className="text-sm text-white/30">-</span>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
