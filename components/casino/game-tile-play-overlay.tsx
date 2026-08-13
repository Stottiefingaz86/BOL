'use client'

import { useEffect, useRef, useState } from 'react'
import { IconLoader2, IconPlayerPlay } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { GameTileFavoriteButton } from '@/components/casino/game-tile-favorite-button'
import { useCasinoFavoritesOptional } from '@/components/casino/casino-favorites'

export type GameTilePlayOverlayProps = {
  onLaunch: () => void
  /** How long the preloader shows before opening the game */
  delayMs?: number
  className?: string
  /** Visual size of the play / loader control */
  size?: 'sm' | 'md' | 'lg'
  /**
   * When set (and favorites context is present), shows a top-right heart
   * with Twitter-style like animation.
   */
  favoriteTitle?: string
}

/**
 * Hover: faded scrim + play control.
 * Click: play morphs into a spinner, then `onLaunch` fires.
 * Works without hover too (whole tile is the hit target).
 */
export function GameTilePlayOverlay({
  onLaunch,
  delayMs = 850,
  className,
  size = 'md',
  favoriteTitle,
}: GameTilePlayOverlayProps) {
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const favorites = useCasinoFavoritesOptional()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const startLaunch = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    setLoading(true)
    timerRef.current = setTimeout(() => {
      onLaunch()
      // Reset after launch so reopening the tile works once the launcher closes
      timerRef.current = setTimeout(() => setLoading(false), 400)
    }, delayMs)
  }

  const btn =
    size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'
  const icon = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'
  const showFavorite = Boolean(favoriteTitle && favorites)

  return (
    <>
      {showFavorite && favoriteTitle && favorites ? (
        <GameTileFavoriteButton
          favorited={favorites.has(favoriteTitle)}
          onToggle={() => favorites.toggle(favoriteTitle)}
          size={size === 'lg' ? 'md' : 'sm'}
        />
      ) : null}
      <div
        role="button"
        tabIndex={0}
        aria-label={loading ? 'Loading game' : 'Play game'}
        aria-busy={loading}
        className={cn('absolute inset-0 z-20 cursor-pointer', className)}
        onClick={startLaunch}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') startLaunch(e)
        }}
      >
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-200',
            loading
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
          )}
        >
          <span
            className={cn(
              'flex items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-transform duration-200',
              'group-hover:scale-100',
              loading ? 'scale-100' : 'scale-95',
              btn
            )}
          >
            {loading ? (
              <IconLoader2 className={cn(icon, 'animate-spin')} strokeWidth={2.25} aria-hidden />
            ) : (
              <IconPlayerPlay
                className={cn(icon, 'fill-white translate-x-[1px]')}
                strokeWidth={0}
                aria-hidden
              />
            )}
          </span>
        </div>
      </div>
    </>
  )
}
