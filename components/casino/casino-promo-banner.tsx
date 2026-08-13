'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { IconLoader2 } from '@tabler/icons-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type CasinoPromoBannerProps = {
  src: string
  alt?: string
  /** Mock claim / load delay before returning to idle */
  delayMs?: number
  className?: string
  width?: number
  height?: number
}

/**
 * Lobby promo banner mock: click fades + shows a spinner (like game tiles),
 * then clears after `delayMs` with no navigation.
 */
export function CasinoPromoBanner({
  src,
  alt = 'Casino Banner',
  delayMs = 1200,
  className,
  width = 340,
  height = 164,
}: CasinoPromoBannerProps) {
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = () => {
    if (loading) return
    setLoading(true)
    timerRef.current = setTimeout(() => setLoading(false), delayMs)
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={loading ? 'Claiming offer' : alt}
      aria-busy={loading}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      className={cn(
        'relative flex-shrink-0 cursor-pointer overflow-hidden rounded-small border-0 transition-opacity',
        loading ? 'opacity-100' : 'hover:opacity-90',
        className
      )}
      style={{ width, height }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-200',
          loading && 'opacity-40'
        )}
        unoptimized
      />
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-black/55 transition-opacity duration-200',
          loading ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {loading ? (
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <IconLoader2 className="h-6 w-6 animate-spin" strokeWidth={2.25} aria-hidden />
          </span>
        ) : null}
      </div>
    </Card>
  )
}
