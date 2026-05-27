'use client'

import { useCallback, useRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

const spotlightSurfaceStyle = {
  '--spot-x': '50%',
  '--spot-y': '50%',
  '--spot-opacity': '0',
} as CSSProperties

/**
 * Cursor-following radial glow (matches VIP Hub benefit tiles in `vip-benefit-tiles.tsx`).
 */
export function useCursorSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    el.style.setProperty('--spot-opacity', '1')
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--spot-opacity', '0')
  }, [])

  return {
    ref,
    handleMouseMove,
    handleMouseLeave,
    spotlightSurfaceStyle,
  }
}

export type SpotlightOverlayProps = {
  radiusPx?: number
  /** Tailwind-independent: `color-mix` tint strength at cursor center. */
  mixPercent?: number
  /**
   * Tier / section accent for the glow (e.g. jackpot MINI green, MINOR cyan).
   * Omit to keep brand primary red (VIP-style default).
   */
  accentColor?: string
  className?: string
}

export function SpotlightOverlay({
  radiusPx = 220,
  mixPercent = 32,
  accentColor,
  className,
}: SpotlightOverlayProps) {
  const centerTint = accentColor
    ? `color-mix(in srgb, ${accentColor} ${mixPercent}%, transparent)`
    : `color-mix(in srgb, var(--ds-primary, #ee3536) ${mixPercent}%, transparent)`

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 z-[1] transition-opacity duration-200',
        className
      )}
      style={{
        background: `radial-gradient(${radiusPx}px circle at var(--spot-x) var(--spot-y), ${centerTint}, transparent 62%)`,
        opacity: 'var(--spot-opacity)',
      }}
    />
  )
}
