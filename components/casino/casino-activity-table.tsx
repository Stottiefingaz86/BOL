'use client'

import { useState } from 'react'
import { IconCoins } from '@tabler/icons-react'
import {
  CASINO_ACTIVITY_TABS,
  type CasinoActivityTab,
} from '@/lib/casino/activity'
import { useCasinoActivityFeed } from '@/hooks/use-casino-activity-feed'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface CasinoActivityTableProps {
  className?: string
  title?: string
  defaultTab?: CasinoActivityTab
  maxRows?: number
}

const DESKTOP_COLUMNS = [
  'Game',
  'User',
  'Time',
  'Bet Amount',
  'Win Amount',
] as const

const MOBILE_COLUMNS = ['Game', 'User', 'Time'] as const

function splitTimeDisplay(time: string): { primary: string; period: string } {
  const match = time.match(/^(.+?)\s+(AM|PM)$/i)
  if (match) {
    return { primary: match[1], period: match[2].toUpperCase() }
  }
  return { primary: time, period: '' }
}

export function CasinoActivityTable({
  className,
  title = 'Activity',
  defaultTab = 'All Bets',
  maxRows = 6,
}: CasinoActivityTableProps) {
  const isMobile = useIsMobile()
  const [tab, setTab] = useState<CasinoActivityTab>(defaultTab)
  const rows = useCasinoActivityFeed(tab, maxRows)
  const columns = isMobile ? MOBILE_COLUMNS : DESKTOP_COLUMNS

  return (
    <div
      className={cn(
        'w-full min-w-0 rounded-lg border border-white/10 bg-[#1a1a1a] overflow-hidden',
        className
      )}
    >
      <div className={cn('pt-4 pb-3 space-y-3', isMobile ? 'px-3' : 'px-4')}>
        <h3
          className={cn(
            'font-semibold text-white',
            isMobile ? 'text-base' : 'text-sm'
          )}
        >
          {title}
        </h3>
        <div
          className={cn(
            'flex gap-2',
            isMobile
              ? 'flex-nowrap overflow-x-auto scrollbar-hide -mx-3 px-3 pb-0.5'
              : 'flex-wrap'
          )}
        >
          {CASINO_ACTIVITY_TABS.map((t) => {
            const active = tab === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  'rounded-full font-medium transition-colors flex-shrink-0',
                  isMobile ? 'px-3 py-1.5 text-xs' : 'px-3 py-1.5 text-xs',
                  active
                    ? 'text-white'
                    : 'bg-white/5 text-white/55 hover:text-white/80 hover:bg-white/[0.08]'
                )}
                style={
                  active
                    ? { backgroundColor: 'var(--ds-primary, #ee3536)' }
                    : undefined
                }
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      <div className={cn(!isMobile && 'overflow-x-auto')}>
        <table
          className={cn(
            'w-full text-left border-collapse',
            !isMobile && 'min-w-[640px]'
          )}
        >
          <thead>
            <tr className="border-t border-white/10">
              {columns.map((col) => (
                <th
                  key={col}
                  className={cn(
                    'font-medium text-white/40 whitespace-nowrap',
                    isMobile ? 'px-3 py-2 text-[11px]' : 'px-4 py-2.5 text-[11px]',
                    !isMobile &&
                      (col === 'Bet Amount' || col === 'Win Amount') &&
                      'text-right',
                    isMobile && col === 'Time' && 'text-right w-[52px]'
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { primary, period } = splitTimeDisplay(row.time)
              const isHidden = row.user === 'Hidden'

              return (
                <tr
                  key={row.id}
                  className="border-t border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                >
                  <td className={cn(isMobile ? 'px-3 py-2.5' : 'px-4 py-3')}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={cn(
                          'relative rounded-md overflow-hidden flex-shrink-0 bg-white/5',
                          isMobile ? 'w-7 h-7' : 'w-8 h-8'
                        )}
                      >
                        <img
                          src={row.gameImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={cn(
                          'text-white truncate',
                          isMobile ? 'text-xs' : 'text-sm'
                        )}
                      >
                        {row.game}
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      'whitespace-nowrap',
                      isMobile ? 'px-3 py-2.5 text-xs' : 'px-4 py-3 text-sm',
                      isHidden ? 'text-white/45' : 'text-white'
                    )}
                  >
                    {row.user}
                  </td>
                  <td
                    className={cn(
                      'whitespace-nowrap',
                      isMobile
                        ? 'px-3 py-2.5 text-right align-middle'
                        : 'px-4 py-3 text-sm text-white'
                    )}
                  >
                    {isMobile ? (
                      <div className="inline-flex flex-col items-end leading-tight text-white text-xs tabular-nums">
                        <span>{primary}</span>
                        {period ? (
                          <span className="text-[10px] text-white/90">
                            {period}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      row.time
                    )}
                  </td>
                  {!isMobile && (
                    <>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="inline-flex items-center justify-end gap-1.5 text-sm text-white tabular-nums">
                          <IconCoins
                            className="w-4 h-4 text-emerald-400 flex-shrink-0"
                            stroke={1.75}
                          />
                          {row.betAmount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {row.winAmount ? (
                          <span className="text-sm font-medium text-emerald-400 tabular-nums">
                            {row.winAmount}
                          </span>
                        ) : (
                          <span className="text-sm text-white/50">—</span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
