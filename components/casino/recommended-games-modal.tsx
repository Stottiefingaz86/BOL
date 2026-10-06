'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { IconSparkles, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { GameTilePlayOverlay } from '@/components/casino/game-tile-play-overlay'

export type RecommendedGame = {
  title: string
  provider: string
  image: string
  rtp: string
}

/** Low-volatility picks — frequent small wins, longer sessions. */
export const LOW_VOLATILITY_GAMES: RecommendedGame[] = [
  { title: 'Starburst', provider: 'NetEnt', image: '/casino_slots_tiles/slot-39.png', rtp: '96.1%' },
  { title: 'Blood Suckers', provider: 'NetEnt', image: '/casino_slots_tiles/slot-41.png', rtp: '98.0%' },
  { title: 'Jack and the Beanstalk', provider: 'NetEnt', image: '/casino_slots_tiles/slot-43.png', rtp: '96.3%' },
  { title: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: '/casino_slots_tiles/slot-45.png', rtp: '96.7%' },
  { title: 'Fruit Shop', provider: 'NetEnt', image: '/casino_slots_tiles/slot-47.png', rtp: '96.7%' },
  { title: 'Thunderstruck', provider: 'Microgaming', image: '/casino_slots_tiles/slot-49.png', rtp: '96.1%' },
]

type RecommendedGamesModalProps = {
  open: boolean
  onClose: () => void
  onPlay: (game: RecommendedGame) => void
  games?: RecommendedGame[]
}

export function RecommendedGamesModal({
  open,
  onClose,
  onPlay,
  games = LOW_VOLATILITY_GAMES,
}: RecommendedGamesModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="recommended-games"
          data-recommended-games-modal=""
          className="fixed inset-0 z-[100060] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="recommended-games-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={cn(
              'relative flex w-full max-h-[92dvh] flex-col overflow-hidden border border-white/[0.08] bg-[#1c1c1c] text-[var(--ds-fg)] shadow-2xl',
              'rounded-t-2xl sm:max-w-[640px] sm:rounded-2xl',
            )}
          >
            {/* Header */}
            <div className="relative shrink-0 overflow-hidden px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[#ee3536]/25 blur-3xl"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close recommended games"
                className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full bg-white/[0.06] text-[var(--ds-fg-muted)] transition-colors hover:bg-white/[0.12] hover:text-[var(--ds-fg)]"
              >
                <IconX className="size-4" stroke={2} />
              </button>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff8a8a]">
                <IconSparkles className="size-3.5" stroke={2} />
                Picked for you
              </div>
              <h2
                id="recommended-games-title"
                className="mt-1.5 text-[22px] font-bold leading-tight sm:text-2xl"
              >
                Recommended games
              </h2>
              <p className="mt-1.5 max-w-[460px] text-sm leading-snug text-[var(--ds-fg-muted)]">
                Low volatility picks that pay out more often, so your balance stretches
                further and the fun lasts longer.
              </p>
            </div>

            {/* Grid */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {games.map((game) => (
                  <div key={game.title} className="group flex flex-col gap-2">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--ds-control-bg)]">
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                      <GameTilePlayOverlay
                        favoriteTitle={game.title}
                        onLaunch={() => onPlay(game)}
                      />
                    </div>
                    <div className="min-w-0 px-0.5">
                      <p className="truncate text-sm font-semibold leading-tight">{game.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-[var(--ds-fg-muted)]">
                        {game.provider} · RTP {game.rtp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-3.5 sm:px-6">
              <p className="text-xs text-[var(--ds-fg-muted)]">
                Based on how you've been playing today.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-sm font-medium text-[var(--ds-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--ds-fg)]"
              >
                Not now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
