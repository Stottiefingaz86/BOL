'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconHeart } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export type GameTileFavoriteButtonProps = {
  favorited: boolean
  onToggle: () => void
  className?: string
  size?: 'sm' | 'md'
  /**
   * tile — absolute circle on game art
   * toolbar — launcher header control
   * inline — icon-only for composing in rows
   * menu — full-width launcher menu row with label
   */
  variant?: 'tile' | 'toolbar' | 'inline' | 'menu'
  /** Label for menu variant */
  label?: string
}

/** Native Twitter sprite frame size (px). */
const SPRITE_SIZE = 100

/**
 * Favourite control — Tabler heart stays fixed size (matches nav).
 * On like: portals Twitter sprite ring + particles only (center heart masked out)
 * so the icon never grows.
 */
export function GameTileFavoriteButton({
  favorited,
  onToggle,
  className,
  size = 'md',
  variant = 'tile',
  label,
}: GameTileFavoriteButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [animating, setAnimating] = useState(false)
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(
    null
  )
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const willFavorite = !favorited
    onToggle()
    if (willFavorite) {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) {
        setBurstOrigin({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
      setAnimating(true)
    } else {
      setAnimating(false)
      setBurstOrigin(null)
    }
  }

  const shellClass =
    variant === 'tile'
      ? cn(
          'absolute right-1.5 top-1.5 z-40 flex size-8 items-center justify-center overflow-visible',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
        )
      : variant === 'toolbar'
        ? cn(
            'relative flex size-8 items-center justify-center overflow-visible rounded-full',
            'transition-colors hover:bg-[var(--ds-control-hover)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30'
          )
        : variant === 'menu'
          ? cn(
              'relative flex w-full items-center gap-2.5 overflow-visible px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10',
              'focus-visible:outline-none'
            )
          : cn(
              'relative inline-flex size-8 shrink-0 items-center justify-center overflow-visible',
              'focus-visible:outline-none'
            )

  const idleColor =
    variant === 'tile'
      ? 'text-white'
      : variant === 'toolbar'
        ? 'text-[var(--ds-fg-muted)]'
        : 'text-white/60'

  const menuLabel =
    label ??
    (favorited ? 'Remove from Favourites' : 'Add to Favourites')

  const showTileChrome = variant === 'tile'

  const burst =
    mounted &&
    animating &&
    burstOrigin &&
    createPortal(
      <span
        className="twitter-heart-sprite is-animating pointer-events-none fixed z-[100200]"
        style={{
          left: burstOrigin.x,
          top: burstOrigin.y,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          marginLeft: -SPRITE_SIZE / 2,
          marginTop: -SPRITE_SIZE / 2,
        }}
        onAnimationEnd={() => {
          setAnimating(false)
          setBurstOrigin(null)
        }}
        aria-hidden
      />,
      document.body
    )

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
        aria-pressed={favorited}
        className={cn(shellClass, className)}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick(e)
        }}
      >
        {showTileChrome ? (
          <span
            className="pointer-events-none absolute inset-0 rounded-full border border-white/15 bg-black/45 shadow-[0_4px_12px_rgba(0,0,0,0.35)] backdrop-blur-md"
            aria-hidden
          />
        ) : null}

        {/* Fixed-size heart — never scales; sprite burst is particles only */}
        <IconHeart
          className={cn(
            'relative z-10 size-4 shrink-0',
            favorited ? 'fill-pink-500 text-pink-500' : idleColor
          )}
          strokeWidth={2}
          aria-hidden
        />

        {variant === 'menu' ? <span>{menuLabel}</span> : null}
      </button>
      {burst}
    </>
  )
}
