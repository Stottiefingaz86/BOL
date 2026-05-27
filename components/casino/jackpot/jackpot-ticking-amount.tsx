'use client'

import NumberFlow from '@number-flow/react'
import { jackpotCompactParts } from '@/lib/jackpot/constants'
import { cn } from '@/lib/utils'

interface JackpotTickingAmountProps {
  value: number
  className?: string
  size?: 'badge' | 'xs' | 'sm' | 'md' | 'lg' | 'hero'
}

export function JackpotTickingAmount({
  value,
  className,
  size = 'md',
}: JackpotTickingAmountProps) {
  const { prefix, number, suffix, decimals } = jackpotCompactParts(value)

  const sizeClass = {
    badge: 'text-[9px] font-semibold leading-none',
    xs: 'text-[11px] font-semibold',
    sm: 'text-sm font-bold',
    md: 'text-base font-bold tracking-tight',
    lg: 'text-xl md:text-2xl font-bold tracking-tight',
    hero: 'text-4xl md:text-5xl font-bold tracking-tight',
  }[size]

  return (
    <span
      className={cn(
        'tabular-nums text-white inline-flex items-baseline max-w-full',
        (size === 'xs' || size === 'badge') && 'overflow-hidden',
        sizeClass,
        className
      )}
    >
      <span>{prefix}</span>
      <NumberFlow
        value={number}
        isolate
        format={{
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping: number >= 1000 && suffix === '',
        }}
        transformTiming={{ duration: 550, easing: 'ease-out' }}
      />
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
