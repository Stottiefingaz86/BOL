'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import { JackpotTickingAmount } from '@/components/casino/jackpot/jackpot-ticking-amount'
import { formatJackpotCompact } from '@/lib/jackpot/constants'
import { MUST_DROP_TIME_ACCENT } from '@/lib/jackpot/use-active-must-drop'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { cn } from '@/lib/utils'
import { IconFlame, IconHourglass } from '@tabler/icons-react'

export type InlineJackpotItem = {
  key: string
  label: string
  accent: string
  amount: number
  detail?: string
  icon?: 'hourglass' | 'flame'
  heatingUp?: boolean
  critical?: boolean
  isFinale?: boolean
  /** 0 = cool, 1 = full heat — drains with pot during finale. */
  heatFade?: number
  isExiting?: boolean
  amountFlowDuration?: number
  /** Seconds remaining during finale — drives rolling countdown. */
  finaleSeconds?: number
}

interface JackpotInlineStripProps {
  items: InlineJackpotItem[]
  className?: string
  heightClass?: string
  rotateIntervalMs?: number
}

const ROTATE_MS = 4500

/** Mobile reel roll in/out duration. */
const REEL_ROLL_MS = 520

/** Slot-style deceleration as each tier lands. */
const REEL_EASE = [0.14, 0.82, 0.18, 1] as const

const STRIP_EASE = [0.22, 1, 0.36, 1] as const

const STRIP_EXIT_MS = 180

const STRIP_ZAP_EASE = [0.4, 0, 1, 1] as const

function InlineJackpotCell({
  item,
  compact,
  mobileSingle,
  exiting,
}: {
  item: InlineJackpotItem
  compact?: boolean
  mobileSingle?: boolean
  exiting?: boolean
}) {
  const toggleMustDropHeatPreview = useJackpotStore((s) => s.toggleMustDropHeatPreview)
  const isMega = item.key === 'mega'
  const isMustDrop = item.key === 'must-drop'
  const isMustDropHeat = isMustDrop && item.heatingUp && !exiting && !item.isExiting
  const isClosing = exiting || item.isExiting
  const heatFade = item.heatFade ?? (isMustDropHeat ? 1 : 0)
  /** Hourglass only in the cool pre-heat state — never during heat, finale, or exit. */
  const showHourglass = isMustDrop && !isMustDropHeat && !item.isFinale && !isClosing
  /** Must-drop uses static text only at $0 or while zapping out — never bounce via NumberFlow. */
  const mustDropStaticAmount =
    isMustDrop && (isClosing || item.isExiting || (!item.isFinale && item.amount <= 0))
  const iconSizeClass = mobileSingle
    ? 'h-4 w-4'
    : compact
      ? 'h-3.5 w-3.5 md:h-4 md:w-4'
      : 'h-4 w-4 md:h-4 md:w-4'

  const className = cn(
    'relative flex min-w-0 items-center justify-center gap-1.5 leading-none overflow-hidden',
    isMustDropHeat && item.isFinale && 'jackpot-must-drop-heat-finale',
    isMustDropHeat &&
      !item.isFinale &&
      (item.critical ? 'jackpot-must-drop-shake-intense' : 'jackpot-must-drop-shake'),
    isMustDrop &&
      !isClosing &&
      'w-full cursor-pointer border-0 bg-transparent outline-none focus-visible:outline-none',
    isMustDrop && !isClosing && !isMustDropHeat && 'transition-colors hover:bg-white/[0.04]',
    mobileSingle
      ? 'w-full gap-2 px-3 py-1'
      : cn(
          'h-full min-w-0 w-full flex-1 gap-1.5 self-stretch md:gap-2',
          compact ? 'px-1.5 py-1 md:px-2' : 'px-2 py-1.5 md:px-2.5'
        )
  )

  const content = (
    <>
      {isMustDropHeat ? (
        <>
          <span
            className="jackpot-must-drop-heat pointer-events-none absolute inset-0 transition-opacity duration-150"
            style={{ opacity: item.isFinale ? heatFade : 1 }}
            aria-hidden
          />
          <span
            className="jackpot-must-drop-flames pointer-events-none absolute inset-0 transition-opacity duration-150"
            style={{ opacity: heatFade }}
            aria-hidden
          />
        </>
      ) : null}
      <motion.div
        className="relative z-[1] flex min-w-0 items-center justify-center gap-1.5 leading-none"
        animate={
          isClosing
            ? { opacity: 0, scale: 0.94, filter: 'brightness(1.4)' }
            : { opacity: 1, scale: 1, filter: 'brightness(1)' }
        }
        transition={{
          duration: isClosing ? STRIP_EXIT_MS / 1000 : 0.2,
          ease: isClosing ? STRIP_ZAP_EASE : STRIP_EASE,
        }}
      >
      {isMustDrop && !isClosing ? (
        <span className={cn('relative z-[1] shrink-0', iconSizeClass)} aria-hidden>
          {isMustDropHeat ? (
            <IconFlame
              className={cn(
                'text-orange-400 transition-opacity duration-150',
                iconSizeClass
              )}
              style={{ opacity: heatFade }}
              strokeWidth={2}
            />
          ) : showHourglass ? (
            <IconHourglass
              className={iconSizeClass}
              style={{ color: MUST_DROP_TIME_ACCENT }}
              strokeWidth={2}
            />
          ) : null}
        </span>
      ) : null}
      <>
          <span
            className={cn(
              'relative z-[1] shrink-0 font-black uppercase tracking-wide',
              isMega && 'jackpot-mega-label',
              isMustDropHeat && heatFade > 0.2 && 'jackpot-must-drop-label-heat',
              mobileSingle
                ? 'text-base'
                : compact
                  ? 'text-xs md:text-sm'
                  : 'text-sm md:text-base'
            )}
            style={
              isMega || (isMustDropHeat && heatFade > 0.2)
                ? undefined
                : { color: item.accent, opacity: isMustDropHeat ? 0.35 + heatFade * 0.65 : 1 }
            }
          >
            {item.label}
          </span>
          {mustDropStaticAmount ? (
            <span
              className={cn(
                'relative z-[1] min-w-0 shrink font-black leading-none tracking-tight tabular-nums text-white',
                isMustDropHeat && heatFade > 0.15 && 'jackpot-must-drop-amount-heat',
                mobileSingle
                  ? 'text-xl'
                  : compact
                    ? 'text-sm md:text-base'
                    : 'text-base md:text-lg'
              )}
            >
              {formatJackpotCompact(item.amount)}
            </span>
          ) : (
            <JackpotTickingAmount
              value={item.amount}
              flowDuration={item.amountFlowDuration}
              size={mobileSingle ? 'lg' : compact ? 'sm' : 'md'}
              className={cn(
                'relative z-[1] min-w-0 shrink font-black leading-none tracking-tight',
                isMustDropHeat && heatFade > 0.15 && 'jackpot-must-drop-amount-heat',
                mobileSingle
                  ? 'text-xl'
                  : compact
                    ? 'text-sm md:text-base'
                    : 'text-base md:text-lg'
              )}
            />
          )}
          {item.detail ? (
            isMustDrop && item.isFinale && item.finaleSeconds !== undefined ? (
              <span
                className={cn(
                  'relative z-[1] inline-flex min-w-0 items-baseline gap-0 font-semibold tabular-nums',
                  'jackpot-must-drop-countdown-heat',
                  mobileSingle
                    ? 'text-xs'
                    : cn(
                        'hidden sm:inline-flex',
                        compact ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm'
                      )
                )}
              >
                <span>in 00:00:</span>
                <NumberFlow
                  value={item.finaleSeconds}
                  isolate
                  format={{ minimumIntegerDigits: 2, maximumFractionDigits: 0 }}
                  transformTiming={{ duration: 100, easing: 'ease-out' }}
                />
              </span>
            ) : (
              <span
                className={cn(
                  'relative z-[1] min-w-0 truncate font-semibold tabular-nums',
                  isMustDropHeat && heatFade > 0.2
                    ? 'jackpot-must-drop-countdown-heat inline sm:inline'
                    : 'text-white/45',
                  mobileSingle
                    ? 'text-xs'
                    : cn(
                        'hidden sm:inline',
                        compact ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm'
                      )
                )}
              >
                {item.detail}
              </span>
            )
          ) : null}
        </>
      </motion.div>
    </>
  )

  if (isMustDrop) {
    return (
      <button
        type="button"
        className={className}
        onClick={isClosing ? undefined : toggleMustDropHeatPreview}
        aria-label="Preview must drop finale"
        disabled={isClosing}
        style={
          isMustDropHeat && item.isFinale
            ? ({ '--heat-fade': heatFade } as React.CSSProperties)
            : undefined
        }
      >
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}

function DesktopInlineStrip({
  items,
  compact,
  heightClass,
}: {
  items: InlineJackpotItem[]
  compact: boolean
  heightClass: string
}) {
  const reduceMotion = useReducedMotion()
  const completeMustDropWin = useJackpotStore((s) => s.completeMustDropWin)
  const mustDropItem = items.find((item) => item.key === 'must-drop') ?? null
  const tierItems = items.filter((item) => item.key !== 'must-drop')
  const isClosing = mustDropItem?.isExiting ?? false
  const closeDoneRef = useRef(false)

  useEffect(() => {
    if (isClosing) closeDoneRef.current = false
  }, [isClosing])

  const handleCloseComplete = () => {
    if (!isClosing || closeDoneRef.current) return
    closeDoneRef.current = true
    completeMustDropWin()
  }

  const exitTransition = {
    duration: reduceMotion ? 0.08 : STRIP_EXIT_MS / 1000,
    ease: STRIP_ZAP_EASE,
  }

  return (
    <LayoutGroup id="jackpot-desktop-strip">
      <motion.div
        layout
        className={cn(
          'hidden w-full min-w-0 items-stretch divide-x divide-white/10 md:flex',
          heightClass
        )}
        transition={{ layout: exitTransition }}
      >
        {mustDropItem ? (
          <motion.div
            layout
            className="flex min-w-0 shrink-0 items-stretch self-stretch overflow-hidden [&>button]:h-full [&>button]:w-full"
            initial={false}
            animate={
              isClosing
                ? { width: 0, opacity: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }
                : { width: 'auto', opacity: 1 }
            }
            style={{ flex: isClosing ? '0 0 auto' : '1.15 1 0%' }}
            transition={exitTransition}
            onAnimationComplete={handleCloseComplete}
          >
            <InlineJackpotCell item={mustDropItem} compact={compact} exiting={isClosing} />
          </motion.div>
        ) : null}

        {tierItems.map((item) => (
          <motion.div
            key={item.key}
            layout
            transition={{ layout: exitTransition }}
            className="flex min-w-0 flex-1 items-stretch self-stretch"
          >
            <InlineJackpotCell item={item} compact={compact} />
          </motion.div>
        ))}
      </motion.div>
    </LayoutGroup>
  )
}

function MobileRotatingStrip({
  items,
  heightClass,
  intervalMs,
}: {
  items: InlineJackpotItem[]
  heightClass: string
  intervalMs: number
}) {
  const reduceMotion = useReducedMotion()
  const completeMustDropWin = useJackpotStore((s) => s.completeMustDropWin)
  const [index, setIndex] = useState(0)
  const closeDoneRef = useRef(false)

  const safeItems = useMemo(() => items.filter(Boolean), [items])
  const count = safeItems.length
  const active = safeItems[index % Math.max(count, 1)]
  const exitingMustDrop = items.find((item) => item.key === 'must-drop' && item.isExiting)

  useEffect(() => {
    setIndex(0)
  }, [count])

  useEffect(() => {
    if (count <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [count, intervalMs])

  useEffect(() => {
    if (exitingMustDrop) closeDoneRef.current = false
  }, [exitingMustDrop])

  if (!active && !exitingMustDrop) return null

  const exitTransition = {
    duration: reduceMotion ? 0.08 : STRIP_EXIT_MS / 1000,
    ease: STRIP_ZAP_EASE,
  }

  return (
    <div
      className={cn('mobile-jackpot-reel relative w-full overflow-hidden md:hidden', heightClass)}
      aria-live="polite"
      aria-atomic
      aria-label={active ? `${active.label} jackpot ${active.amount}` : 'Jackpot amounts'}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-2 bg-gradient-to-b from-[#141414] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2 bg-gradient-to-t from-[#141414] to-transparent"
        aria-hidden
      />

      <AnimatePresence initial={false} mode="sync">
        {active && !exitingMustDrop ? (
          reduceMotion ? (
            <div
              key={active.key}
              className="absolute inset-0 flex items-center justify-center"
            >
              <InlineJackpotCell item={active} mobileSingle />
            </div>
          ) : (
            <motion.div
              key={active.key}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ y: '108%', rotateX: 24, opacity: 0.25, scale: 0.96 }}
              animate={{ y: 0, rotateX: 0, opacity: 1, scale: 1 }}
              exit={{ y: '-108%', rotateX: -24, opacity: 0.25, scale: 0.96 }}
              transition={{
                duration: REEL_ROLL_MS / 1000,
                ease: REEL_EASE,
              }}
            >
              <InlineJackpotCell item={active} mobileSingle />
            </motion.div>
          )
        ) : null}
      </AnimatePresence>

      {exitingMustDrop && !reduceMotion ? (
        <motion.div
          key="must-drop-close"
          className="absolute inset-0 z-[2] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={exitTransition}
          onAnimationComplete={() => {
            if (closeDoneRef.current) return
            closeDoneRef.current = true
            completeMustDropWin()
          }}
        >
          <InlineJackpotCell item={exitingMustDrop} mobileSingle exiting />
        </motion.div>
      ) : null}
    </div>
  )
}

/** Desktop: all jackpots on one line. Mobile: one at a time with rotation. */
export function JackpotInlineStrip({
  items,
  className,
  heightClass = 'h-9 md:h-12',
  rotateIntervalMs = ROTATE_MS,
}: JackpotInlineStripProps) {
  const compact = heightClass.includes('h-9') || heightClass.includes('h-10')

  if (!items.length) return null

  return (
    <div className={cn('w-full min-w-0 overflow-hidden', className)} aria-label="Live jackpot amounts">
      <MobileRotatingStrip
        items={items}
        heightClass={heightClass}
        intervalMs={rotateIntervalMs}
      />

      <DesktopInlineStrip items={items} compact={compact} heightClass={heightClass} />
    </div>
  )
}
