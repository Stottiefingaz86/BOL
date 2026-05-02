'use client'

import { useEffect, useState } from 'react'
import NumberFlow from '@number-flow/react'
import { cn } from '@/lib/utils'

/** Keeps each column a stable width so NumberFlow digit animations don’t overlap. */
const TWO_DIGIT = { minimumIntegerDigits: 2, maximumFractionDigits: 0 } as const

export type NumberFlowCountdownProps = {
  hours: number
  minutes: number
  seconds: number
  className?: string
  colonClassName?: string
}

/**
 * Hours / minutes / seconds with zero-padded pairs and isolated digit layers
 * (fixes visual glitches in tight headers when values tick).
 */
export function NumberFlowCountdown({
  hours,
  minutes,
  seconds,
  className,
  colonClassName,
}: NumberFlowCountdownProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 tabular-nums [font-variant-numeric:tabular-nums]',
        className
      )}
    >
      <span className="inline-flex min-w-[2.25ch] justify-end overflow-hidden leading-none">
        <NumberFlow value={hours} format={TWO_DIGIT} isolate />
      </span>
      <span className={cn('shrink-0 opacity-75', colonClassName)} aria-hidden>
        :
      </span>
      <span className="inline-flex min-w-[2.25ch] justify-end overflow-hidden leading-none">
        <NumberFlow value={minutes} format={TWO_DIGIT} isolate />
      </span>
      <span className={cn('shrink-0 opacity-75', colonClassName)} aria-hidden>
        :
      </span>
      <span className="inline-flex min-w-[2.25ch] justify-end overflow-hidden leading-none">
        <NumberFlow value={seconds} format={TWO_DIGIT} isolate />
      </span>
    </div>
  )
}

export type DailyRacesTimerProps = {
  className?: string
  colonClassName?: string
}

/** Demo countdown used on casino / sports hero carousels (local mock clock). */
export function DailyRacesTimer({ className, colonClassName }: DailyRacesTimerProps = {}) {
  const [hours, setHours] = useState(6)
  const [minutes, setMinutes] = useState(54)
  const [seconds, setSeconds] = useState(31)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s === 0) {
          setMinutes((m) => {
            if (m === 0) {
              setHours((h) => (h === 0 ? 23 : h - 1))
              return 59
            }
            return m - 1
          })
          return 59
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <NumberFlowCountdown
      hours={hours}
      minutes={minutes}
      seconds={seconds}
      className={cn(
        'justify-end text-xl font-bold text-gray-800 transition-colors duration-300 dark:text-white',
        className
      )}
      colonClassName={colonClassName ?? 'text-gray-600 dark:text-white/70'}
    />
  )
}
