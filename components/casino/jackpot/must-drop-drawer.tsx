'use client'

import { useEffect, useState } from 'react'
import NumberFlow from '@number-flow/react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHandle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { formatJackpotAmount } from '@/lib/jackpot/constants'
import { MUST_DROP_RECENT } from '@/lib/jackpot/mock-data'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { IconClock, IconPlayerPlay, IconX } from '@tabler/icons-react'

function CountdownTimer({ deadline }: { deadline: number }) {
  const [h, setH] = useState(0)
  const [m, setM] = useState(0)
  const [s, setS] = useState(0)

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, deadline - Date.now())
      setH(Math.floor(diff / 3600000))
      setM(Math.floor((diff % 3600000) / 60000))
      setS(Math.floor((diff % 60000) / 1000))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  return (
    <div className="rounded-lg bg-white/[0.05] border border-white/[0.06] p-4">
      <div className="flex items-center justify-center gap-2">
        {[
          { value: h, label: 'Hrs' },
          { value: m, label: 'Min' },
          { value: s, label: 'Sec' },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-white/30 text-lg font-light -mt-4">:</span>
            )}
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-white tabular-nums leading-none mb-1">
                <NumberFlow value={item.value} format={{ minimumIntegerDigits: 2 }} />
              </div>
              <div className="text-[10px] text-white/50 font-medium uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface MustDropDrawerProps {
  onPlay?: () => void
}

export function MustDropDrawer({ onPlay }: MustDropDrawerProps) {
  const isMobile = useIsMobile()
  const open = useJackpotStore((s) => s.mustDropDrawerOpen)
  const setOpen = useJackpotStore((s) => s.setMustDropDrawerOpen)
  const mustDropAmount = useJackpotStore((s) => s.mustDropAmount)
  const mustDropDeadline = useJackpotStore((s) => s.mustDropDeadline)

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? 'bottom' : 'right'}
      shouldScaleBackground={false}
    >
      <DrawerContent
        showOverlay={isMobile}
        className={cn(
          'bg-[#1a1a1a] text-white flex flex-col relative',
          'w-full sm:max-w-md border-l border-white/10 overflow-hidden',
          isMobile && 'rounded-t-[10px]'
        )}
        style={
          isMobile
            ? { height: '85vh', maxHeight: '85vh', top: 'auto', bottom: 0 }
            : { display: 'flex', flexDirection: 'column', overflow: 'hidden' }
        }
      >
        {isMobile && <DrawerHandle variant="light" />}

        {!isMobile && (
          <div className="relative px-4 pt-4 pb-2 flex-shrink-0 flex items-center justify-between z-50">
            <h2 className="text-base font-semibold text-white">Daily Must Drop</h2>
            <DrawerClose asChild>
              <button
                type="button"
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <IconX className="h-4 w-4 text-white/70" />
              </button>
            </DrawerClose>
          </div>
        )}

        <div
          className={cn(
            'overflow-y-auto flex-1 min-h-0 space-y-4',
            isMobile ? 'px-4 pt-2 pb-8' : 'px-4 pt-2 pb-6'
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
            paddingBottom: isMobile
              ? 'max(2rem, env(safe-area-inset-bottom))'
              : undefined,
          }}
        >
          {isMobile && (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Daily Must Drop
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Guaranteed before 00:00 UTC
                </p>
              </div>
              <DrawerClose asChild>
                <button
                  type="button"
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
                >
                  <IconX className="h-4 w-4 text-white/70" />
                </button>
              </DrawerClose>
            </div>
          )}

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-4">
              <div>
                <CardTitle className="text-sm text-white/70 mb-1">
                  Must drop before 00:00 UTC
                </CardTitle>
                <p className="text-xs text-white/50">
                  The longer it waits, the heavier it grows.
                </p>
              </div>
              <div className="flex items-baseline justify-center gap-1 py-1">
                <span className="text-2xl font-bold text-white">$</span>
                <span className="text-3xl font-bold text-white tabular-nums">
                  <NumberFlow
                    value={mustDropAmount}
                    format={{
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                    transformTiming={{ duration: 600, easing: 'ease-out' }}
                  />
                </span>
              </div>
              <CountdownTimer deadline={mustDropDeadline} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Avg drop', value: '$6,422' },
              { label: 'Avg time', value: '21:34 UTC' },
              { label: 'Your odds', value: '1 in 4.1K' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-white/[0.05] border border-white/[0.06] p-3 text-center"
              >
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="text-xs font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <Button
            className="w-full rounded-small text-white font-semibold h-11 hover:opacity-90"
            style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
            onClick={() => {
              setOpen(false)
              onPlay?.()
            }}
          >
            <IconPlayerPlay className="w-4 h-4 mr-2" />
            Play to qualify for tonight&apos;s drop
          </Button>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Recent drops</h3>
              <span className="text-[10px] text-white/40 px-2 py-0.5 rounded-small border border-white/10 bg-white/5">
                Last 5 days
              </span>
            </div>
            <div className="space-y-2">
              {MUST_DROP_RECENT.map((drop) => (
                <div
                  key={drop.id}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <IconClock className="w-4 h-4 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {drop.username}
                    </p>
                    <p className="text-xs text-white/40 truncate">{drop.game}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">
                      {drop.droppedAt}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white tabular-nums flex-shrink-0">
                    {formatJackpotAmount(drop.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
