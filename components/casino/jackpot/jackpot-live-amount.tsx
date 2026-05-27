'use client'

import { useEffect, useState } from 'react'
import { formatJackpotAmount } from '@/lib/jackpot/constants'
import { cn } from '@/lib/utils'

interface JackpotLiveAmountProps {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
  accent?: string
}

export function JackpotLiveAmount({
  value,
  size = 'md',
  className,
  accent,
}: JackpotLiveAmountProps) {
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    setDisplay(value)
  }, [value])

  const sizeClass = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold tracking-tight',
    lg: 'text-3xl md:text-4xl font-bold tracking-tight',
    hero: 'text-4xl md:text-5xl font-bold tracking-tight',
  }[size]

  return (
    <span
      className={cn('tabular-nums text-white', sizeClass, className)}
      style={accent ? { color: accent } : undefined}
    >
      {formatJackpotAmount(display)}
    </span>
  )
}
