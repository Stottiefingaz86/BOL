'use client'

import { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { GameTilePlayOverlay } from '@/components/casino/game-tile-play-overlay'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export type Top10Game = {
  title: string
  image: string
  provider?: string
  badge?: string
}

/** Slot art — square posters matching other casino slot tiles */
const DEFAULT_TOP_10: Top10Game[] = [
  { title: 'Gemhalla Xtreme', image: '/casino_slots_tiles/slot-39.png', provider: 'BetSoft', badge: 'Hot' },
  { title: 'Alien Fruits 2', image: '/casino_slots_tiles/slot-40.png', provider: 'BetSoft' },
  { title: 'Recycle Riches', image: '/casino_slots_tiles/slot-41.png', provider: 'BetSoft', badge: 'New' },
  { title: 'Merge Up 2', image: '/casino_slots_tiles/slot-42.png', provider: 'BetSoft' },
  { title: 'Zeus Goes Wild', image: '/casino_slots_tiles/slot-43.png', provider: 'BetSoft', badge: 'Hot' },
  { title: 'Multi Rush', image: '/casino_slots_tiles/slot-44.png', provider: 'BetSoft' },
  { title: 'Heart of Tiki', image: '/casino_slots_tiles/slot-46.png', provider: 'BetSoft', badge: 'New' },
  { title: 'Money Maker', image: '/casino_slots_tiles/slot-49.png', provider: 'BetSoft', badge: 'Hot' },
  { title: 'Hot Chilli Bells 100', image: '/casino_slots_tiles/slot-50.png', provider: 'BetSoft' },
  { title: 'Fiesta Clusters', image: '/casino_slots_tiles/slot-51.png', provider: 'BetSoft', badge: 'New' },
]

/**
 * Netflix-style ranks on square slot tiles.
 * Digits sit left of the poster and tuck slightly behind it.
 * Rank “1” is nudged right (narrow glyph) so it still sits under the card.
 */
const TILE = 160
/** How much of the rank sits left of the poster */
const PEEK = 72
/** Space between one poster and the next rank */
const GAP = 44
/** Extra height so oversized ranks aren’t clipped by embla */
const RANK_BLEED = 14

/**
 * Netflix Top 10 rank — dark fill (matches bg) + metallic stroke
 * that reads bright at the top and dies into the void at the bottom.
 */
function RankNumber({ rank }: { rank: number }) {
  const rawId = useId()
  const uid = rawId.replace(/:/g, '')
  const fillId = `top10-fill-${uid}`
  const strokeId = `top10-stroke-${uid}`
  const isTen = rank === 10
  const isOne = rank === 1
  const svgH = TILE + RANK_BLEED
  const svgW = isTen ? PEEK + 120 : PEEK + 64
  const fontSize = isTen ? 168 : 186
  // “1” is a skinny glyph — slight nudge right so it still tucks under the tile
  const x = isOne ? 22 : 0

  const sharedText = {
    y: svgH - 2,
    fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif',
    fontWeight: 900 as const,
    fontSize,
    strokeLinejoin: 'miter' as const,
    fill: `url(#${fillId})`,
    stroke: `url(#${strokeId})`,
    strokeWidth: 3.25,
    paintOrder: 'stroke fill' as const,
  }

  return (
    <svg
      aria-hidden
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="pointer-events-none absolute bottom-0 left-0 z-0 select-none"
      style={{ overflow: 'visible' }}
      preserveAspectRatio="xMinYMax meet"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
        <linearGradient id={strokeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="12%" stopColor="#e8e8e8" />
          <stop offset="28%" stopColor="#bdbdbd" />
          <stop offset="48%" stopColor="#7a7a7a" />
          <stop offset="68%" stopColor="#3a3a3a" />
          <stop offset="85%" stopColor="#1c1c1c" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>

      {isTen ? (
        <>
          <text x={0} {...sharedText}>
            1
          </text>
          <text x={52} {...sharedText}>
            0
          </text>
        </>
      ) : (
        <text x={x} letterSpacing={-4} {...sharedText}>
          {rank}
        </text>
      )}
    </svg>
  )
}

export interface Top10GamesCarouselProps {
  games?: Top10Game[]
  title?: string
  onSelectGame?: (game: {
    title: string
    image: string
    provider?: string
    features?: string[]
  }) => void
  className?: string
}

export function Top10GamesCarousel({
  games = DEFAULT_TOP_10,
  title = 'Top 10 Games This Week',
  onSelectGame,
  className,
}: Top10GamesCarouselProps) {
  const isMobile = useIsMobile()
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const top10 = games.slice(0, 10)

  useEffect(() => {
    if (!api) return
    const sync = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }
    sync()
    api.on('select', sync)
    api.on('reInit', sync)
    return () => {
      api.off('select', sync)
      api.off('reInit', sync)
    }
  }, [api])

  return (
    <div className={cn('mb-6', className)}>
      <div
        className={cn(
          'relative z-10 mb-4 flex items-center justify-between',
          isMobile ? 'px-3' : 'px-6'
        )}
      >
        <h2 className="min-w-0 flex-1 truncate text-lg font-semibold text-black dark:text-[var(--ds-fg)]">
          {title}
        </h2>
        <div className="ml-2 flex flex-shrink-0 items-center gap-2">
          {!isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-small border border-[var(--ds-border-strong)] bg-[var(--ds-surface)] text-[var(--ds-fg)] backdrop-blur-sm hover:bg-[var(--ds-surface-raised)] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  if (!api) return
                  api.scrollTo(Math.max(0, api.selectedScrollSnap() - 2))
                }}
                disabled={!api || !canScrollPrev}
              >
                <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-small border border-[var(--ds-border-strong)] bg-[var(--ds-surface)] text-[var(--ds-fg)] backdrop-blur-sm hover:bg-[var(--ds-surface-raised)] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  if (!api) return
                  const slides = api.scrollSnapList().length
                  api.scrollTo(Math.min(slides - 1, api.selectedScrollSnap() + 2))
                }}
                disabled={!api || !canScrollNext}
              >
                <IconChevronRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="relative w-full min-w-0">
        <Carousel
          setApi={setApi}
          className="relative w-full"
          opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
        >
          {/* Item height includes RANK_BLEED so tops aren’t sheared by overflow:hidden */}
          <CarouselContent className="ml-0">
            {top10.map((game, index) => {
              const rank = index + 1
              const isTen = rank === 10
              const peek = isTen ? PEEK + 28 : PEEK
              const itemW = peek + TILE
              const itemH = TILE + RANK_BLEED
              const edgePad = isMobile ? 12 : 24
              // Match section header inset (px-3 / px-6)
              const firstPad = isMobile ? 12 : 24

              return (
                <CarouselItem
                  key={`${rank}-${game.title}`}
                  className="basis-auto pl-0"
                  style={{
                    marginLeft: index === 0 ? firstPad : GAP,
                    marginRight: index === top10.length - 1 ? edgePad : 0,
                  }}
                >
                  <div
                    className="relative shrink-0 overflow-visible"
                    style={{ width: itemW, height: itemH }}
                  >
                    <RankNumber rank={rank} />

                    <div
                      className="group absolute bottom-0 right-0 z-10 overflow-hidden rounded-md bg-[var(--ds-control-bg)] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                      style={{ width: TILE, height: TILE }}
                    >
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        sizes={`${TILE}px`}
                      />
                      <GameTilePlayOverlay
                        favoriteTitle={game.title}
                        onLaunch={() =>
                          onSelectGame?.({
                            title: game.title,
                            image: game.image,
                            provider: game.provider ?? 'BetSoft',
                            features: ['Top 10 This Week', 'Popular Pick', 'Trending Now'],
                          })
                        }
                      />
                      {game.badge ? (
                        <span className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 -translate-x-1/2 rounded-[2px] bg-[#ee3536] px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none text-white shadow-md">
                          {game.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
