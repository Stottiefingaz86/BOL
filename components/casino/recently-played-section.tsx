'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  IconArrowsShuffle,
  IconFlame,
  IconLoader2,
  IconRosetteFilled,
  IconSparkles,
  IconStopwatch,
} from '@tabler/icons-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { GameTilePlayOverlay } from '@/components/casino/game-tile-play-overlay'
import {
  BrandTagIconPlaceholder,
  BrandVendorPlaceholder,
  isBrandVendor,
} from '@/components/brand/brand-logo-placeholder'
import { cn } from '@/lib/utils'

const SQUARE_TILE_IMAGES = [
  '/casino_slots_tiles/slot-39.png',
  '/casino_slots_tiles/slot-40.png',
  '/casino_slots_tiles/slot-41.png',
  '/casino_slots_tiles/slot-42.png',
  '/casino_slots_tiles/slot-43.png',
  '/casino_slots_tiles/slot-44.png',
  '/casino_slots_tiles/slot-45.png',
  '/casino_slots_tiles/slot-46.png',
  '/casino_slots_tiles/slot-47.png',
  '/casino_slots_tiles/slot-48.png',
  '/casino_slots_tiles/slot-49.png',
  '/casino_slots_tiles/slot-50.png',
  '/casino_slots_tiles/slot-51.png',
]

const SLOT_TILE_IMG_CLASS =
  'object-cover object-center transition-transform duration-300 group-hover:scale-105'

const TILE_VENDORS = [
  'BetSoft',
  'Dragon Gaming',
  'KA Gaming',
  'Onlyplay',
  'Mascot Gaming',
  'Nucleus',
  'Blaze',
  'Lucky',
]

const META_TAGS = ['Early', 'Hot', 'Exclusive', 'New'] as const
type MetaTag = (typeof META_TAGS)[number] | 'Original'

const RECENTLY_PLAYED_GAMES = [
  { title: 'Gemhalla Xtreme', image: SQUARE_TILE_IMAGES[0] },
  { title: 'Money Maker', image: SQUARE_TILE_IMAGES[10] },
  { title: 'Heart of Tiki', image: SQUARE_TILE_IMAGES[7] },
  { title: 'Fiesta Clusters', image: SQUARE_TILE_IMAGES[12] },
] as const

const RANDOM_GAME_NAMES = [
  'Gold Nugget Rush',
  'Mega Fortune',
  'Starburst',
  'Book of Dead',
  "Gonzo's Quest",
  'Dead or Alive',
  'Immortal Romance',
  'Thunderstruck',
  'Avalon',
  'Blood Suckers',
]

export type RecentlyPlayedGameSelection = {
  title: string
  image: string
  provider: string
  features: string[]
}

function getTileVendor(index: number): string {
  return TILE_VENDORS[(index * 7 + 5) % TILE_VENDORS.length]
}

function getMetaTag(index: number): MetaTag {
  return META_TAGS[(index * 7 + 3) % 4]
}

function getVendorIconPath(vendorName: string): string {
  const map: Record<string, string> = {
    'Dragon Gaming': 'Dragon gaming.svg',
    BetSoft: 'betsoft.svg',
    Blaze: 'blaze.svg',
    'KA Gaming': 'kagaming.svg',
    Lucky: 'lucky.svg',
    'Mascot Gaming': 'mascotgaming.svg',
    Nucleus: 'nucleus.svg',
    Onlyplay: 'onlyplay.svg',
  }
  const file = map[vendorName] ?? 'betsoft.svg'
  return `/vendot_logos/${file}`
}

function TagIcon({ tag, className }: { tag: MetaTag; className?: string }) {
  switch (tag) {
    case 'Early':
      return <IconStopwatch className={cn('h-3 w-3', className)} strokeWidth={2.5} />
    case 'Hot':
      return <IconFlame className={cn('h-3 w-3', className)} strokeWidth={2.5} />
    case 'Exclusive':
      return <IconRosetteFilled className={cn('h-3 w-3', className)} />
    case 'New':
      return <IconSparkles className={cn('h-3 w-3', className)} strokeWidth={2.5} />
    case 'Original':
      return <BrandTagIconPlaceholder />
    default:
      return null
  }
}

function getTagConfig(tag: MetaTag) {
  switch (tag) {
    case 'Early':
      return {
        bg: 'bg-emerald-900/80',
        border: 'border-emerald-500/60',
        text: 'text-white',
        iconColor: 'text-emerald-400',
      }
    case 'Hot':
      return {
        bg: 'bg-red-950/80',
        border: 'border-red-500/60',
        text: 'text-white',
        iconColor: 'text-red-400',
      }
    case 'Exclusive':
      return {
        bg: 'bg-indigo-950/80',
        border: 'border-indigo-400/60',
        text: 'text-[var(--ds-fg)]',
        iconColor: 'text-indigo-300',
      }
    case 'New':
      return {
        bg: 'bg-yellow-900/80',
        border: 'border-yellow-500/60',
        text: 'text-[var(--ds-fg)]',
        iconColor: 'text-yellow-400',
      }
    default:
      return {
        bg: 'bg-[var(--ds-control-hover)]',
        border: 'border-white/20',
        text: 'text-[var(--ds-fg)]',
        iconColor: 'text-[var(--ds-fg)]',
      }
  }
}

function VendorBadge({ vendor }: { vendor: string }) {
  const [imageError, setImageError] = useState(false)
  if (isBrandVendor(vendor)) {
    return <BrandVendorPlaceholder className="size-4" />
  }
  const iconPath = getVendorIconPath(vendor)
  return (
    <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-black/50 backdrop-blur-sm">
      {!imageError ? (
        <Image
          src={iconPath}
          alt={vendor}
          width={12}
          height={12}
          className="object-contain"
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <span className="text-[8px] font-bold leading-none text-[var(--ds-fg-muted)]">
          {vendor.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

function GameTagBadge({ tag, vendor }: { tag: MetaTag; vendor: string }) {
  const config = getTagConfig(tag)
  return (
    <div className="pointer-events-none absolute left-1.5 top-1.5 z-30 flex items-center gap-1">
      <VendorBadge vendor={vendor} />
      <div
        className={cn(
          'flex items-center gap-0.5 rounded-full border px-1.5 py-[3px] backdrop-blur-sm',
          config.bg,
          config.border
        )}
      >
        <TagIcon tag={tag} className={config.iconColor} />
        <span className={cn('text-[9px] font-semibold leading-none', config.text)}>{tag}</span>
      </div>
    </div>
  )
}

function PlayRandomTile({ onLaunch }: { onLaunch: () => void }) {
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
    timerRef.current = setTimeout(() => {
      onLaunch()
      timerRef.current = setTimeout(() => setLoading(false), 400)
    }, 850)
  }

  return (
    <button
      type="button"
      data-content-item
      aria-label={loading ? 'Loading random game' : 'Play Random'}
      aria-busy={loading}
      disabled={loading}
      className={cn(
        'group relative flex h-[160px] w-[160px] flex-shrink-0 cursor-pointer flex-col items-center overflow-hidden rounded-small border bg-transparent px-2 pb-3 pt-4 transition-colors duration-200 disabled:cursor-wait',
        'border-white/15 text-[var(--ds-fg-muted)]',
        'hover:border-white/40 hover:text-[var(--ds-fg)]',
        loading && 'border-white/40 text-[var(--ds-fg)]'
      )}
      onClick={handleClick}
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 tile-shimmer" />
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center">
        {loading ? (
          <IconLoader2 className="h-10 w-10 animate-spin" strokeWidth={1.5} />
        ) : (
          <IconArrowsShuffle className="h-10 w-10" strokeWidth={1.5} />
        )}
      </div>
      <span className="relative z-10 shrink-0 text-xs font-semibold">
        {loading ? 'Loading…' : 'Play Random'}
      </span>
    </button>
  )
}

export type RecentlyPlayedSectionProps = {
  isMobile?: boolean
  className?: string
  /** Skip outer horizontal padding when the parent already pads (e.g. account). */
  flush?: boolean
  titleClassName?: string
  onSelectGame?: (game: RecentlyPlayedGameSelection) => void
}

/**
 * Same Recently Played strip used on Casino lobby — square tiles with
 * vendor/tag badges, play overlay, and Play Random.
 */
export function RecentlyPlayedSection({
  isMobile = false,
  className,
  flush = false,
  titleClassName,
  onSelectGame,
}: RecentlyPlayedSectionProps) {
  const edgePad = flush ? 'px-0' : isMobile ? 'px-3' : 'px-6'
  const firstItemPad = flush ? 'pl-0' : isMobile ? 'pl-3' : 'pl-6'

  return (
    <div className={cn(className)}>
      <div className={cn('relative z-10 mb-6 flex items-center justify-between', edgePad)}>
        <h2
          className={cn(
            'min-w-0 flex-1 truncate text-lg font-semibold text-black transition-colors duration-300 dark:text-[var(--ds-fg)]',
            titleClassName
          )}
        >
          Recently Played ({RECENTLY_PLAYED_GAMES.length})
        </h2>
      </div>

      <div
        className="relative w-full min-w-0 max-w-full"
        style={{ overflow: 'visible', boxSizing: 'border-box' }}
      >
        <Carousel
          className="relative w-full min-w-0 max-w-full"
          style={{ overflow: 'visible' }}
          opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
        >
          <CarouselContent className="ml-0 pr-4 md:pr-6">
            {RECENTLY_PLAYED_GAMES.map((game, index) => {
              const tag = getMetaTag(index + 30)
              const vendor = getTileVendor(index + 30)
              return (
                <CarouselItem
                  key={`recently-played-${index}`}
                  className={cn(
                    'basis-auto flex-shrink-0 pr-0',
                    index === 0 ? firstItemPad : 'pl-2 md:pl-4'
                  )}
                >
                  <div
                    data-content-item
                    className="group relative h-[160px] w-[160px] flex-shrink-0 cursor-pointer overflow-hidden rounded-small bg-[var(--ds-control-bg)] transition-all duration-300 hover:bg-[var(--ds-control-hover)]"
                  >
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      className={SLOT_TILE_IMG_CLASS}
                      sizes="160px"
                    />
                    <GameTagBadge tag={tag} vendor={vendor} />
                    <GameTilePlayOverlay
                      favoriteTitle={game.title}
                      onLaunch={() =>
                        onSelectGame?.({
                          title: game.title,
                          image: game.image,
                          provider: vendor,
                          features: [
                            'Recently Played',
                            'Quick Resume',
                            'Continue Where You Left Off',
                          ],
                        })
                      }
                    />
                  </div>
                </CarouselItem>
              )
            })}
            <CarouselItem
              key="recently-played-random"
              className="basis-auto flex-shrink-0 pr-0 pl-2 md:pl-4"
            >
              <PlayRandomTile
                onLaunch={() => {
                  const randomIndex = Math.floor(Math.random() * SQUARE_TILE_IMAGES.length)
                  onSelectGame?.({
                    title: RANDOM_GAME_NAMES[randomIndex % RANDOM_GAME_NAMES.length],
                    image: SQUARE_TILE_IMAGES[randomIndex],
                    provider: 'Evolution Gaming',
                    features: ['Random Pick!', 'Surprise Game Feature'],
                  })
                }}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
