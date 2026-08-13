'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconRosetteFilled,
  IconUser,
} from '@tabler/icons-react'
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

type LiveGameType = 'blackjack' | 'roulette' | 'baccarat'

type LiveGame = {
  title: string
  type: LiveGameType
  limit: string
  seats?: { occupied: number; total: number }
}

type CasinoGame = {
  title: string
  image: string
  provider: string
}

const EXCLUSIVE_GAMES: CasinoGame[] = [
  { title: 'Gemhalla Xtreme', image: '/casino_slots_tiles/slot-39.png', provider: 'BetSoft' },
  { title: 'Alien Fruits 2', image: '/casino_slots_tiles/slot-40.png', provider: 'BetSoft' },
  { title: 'Recycle Riches', image: '/casino_slots_tiles/slot-41.png', provider: 'Nucleus' },
  { title: 'Merge Up 2', image: '/casino_slots_tiles/slot-42.png', provider: 'KA Gaming' },
  { title: 'Zeus Goes Wild', image: '/casino_slots_tiles/slot-43.png', provider: 'Onlyplay' },
  { title: 'Multi Rush', image: '/casino_slots_tiles/slot-44.png', provider: 'Popiplay' },
  { title: 'Sweet Samurai', image: '/casino_slots_tiles/slot-45.png', provider: 'Mascot Gaming' },
  { title: 'Heart of Tiki', image: '/casino_slots_tiles/slot-46.png', provider: 'BetSoft' },
  { title: 'Temple of Power', image: '/casino_slots_tiles/slot-47.png', provider: 'Rival' },
  { title: 'Fortune Trio', image: '/casino_slots_tiles/slot-48.png', provider: 'Blaze' },
  { title: 'Money Maker', image: '/casino_slots_tiles/slot-49.png', provider: 'Spinthron' },
  { title: 'Hot Chilli Bells 100', image: '/casino_slots_tiles/slot-50.png', provider: 'Revolver Gaming' },
  { title: 'Fiesta Clusters', image: '/casino_slots_tiles/slot-51.png', provider: "Arrow's Edge" },
  { title: 'Gemhalla Xtreme', image: '/casino_slots_tiles/slot-39.png', provider: 'BetSoft' },
  { title: 'Alien Fruits 2', image: '/casino_slots_tiles/slot-40.png', provider: 'BetSoft' },
  { title: 'Recycle Riches', image: '/casino_slots_tiles/slot-41.png', provider: 'Nucleus' },
  { title: 'Merge Up 2', image: '/casino_slots_tiles/slot-42.png', provider: 'KA Gaming' },
  { title: 'Zeus Goes Wild', image: '/casino_slots_tiles/slot-43.png', provider: 'Onlyplay' },
]

const LIVE_CASINO_GAMES: LiveGame[] = [
  { title: 'Classic Blackjack', type: 'blackjack', limit: '$25 - $500', seats: { occupied: 2, total: 7 } },
  { title: 'Lightning Roulette', type: 'roulette', limit: '$1 - $500' },
  { title: 'Speed Baccarat', type: 'baccarat', limit: '$10 - $5,000' },
  { title: 'Speed Blackjack', type: 'blackjack', limit: '$100 - $1,000', seats: { occupied: 5, total: 7 } },
  { title: 'Auto Roulette', type: 'roulette', limit: '$0.50 - $250' },
  { title: 'Baccarat Lounge', type: 'baccarat', limit: '$25 - $10,000' },
  { title: 'Infinite Blackjack', type: 'blackjack', limit: '$10 - $500', seats: { occupied: 1, total: 7 } },
  { title: 'Immersive Roulette', type: 'roulette', limit: '$1 - $1,000' },
  { title: 'Dragon Tiger', type: 'baccarat', limit: '$5 - $2,500' },
  { title: 'Blackjack Party', type: 'blackjack', limit: '$50 - $250', seats: { occupied: 3, total: 6 } },
  { title: 'XXXtreme Lightning', type: 'roulette', limit: '$0.20 - $100' },
  { title: 'No Commission Baccarat', type: 'baccarat', limit: '$25 - $5,000' },
]

const LIVE_IMAGES: Record<LiveGameType, string> = {
  blackjack: '/games/BLACKJACK RECTANGLE.png',
  roulette: '/games/roulette_square.png',
  baccarat: '/games/baccartae_rectangle.png',
}

const LIVE_VENDORS = [
  { name: 'VIG', logo: '/vendot_logos/vig.svg' },
  { name: 'Fresh Deck', logo: '/vendot_logos/deckfresh.svg' },
]

const ROULETTE_REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i)
const BACCARAT_OPTIONS = ['B', 'B', 'P', 'B', 'P', 'T', 'P', 'B']

function rouletteColor(num: number) {
  if (num === 0) return 'bg-emerald-600'
  if (ROULETTE_REDS.includes(num)) return 'bg-red-600'
  return 'bg-zinc-700'
}

function getRouletteResults(index: number): number[] {
  const base = [8, 20, 13, 0, 10, 32, 5, 19, 36, 2, 14, 7, 28, 11, 3, 26, 15, 4, 22, 17]
  const offset = (index * 3) % base.length
  return Array.from({ length: 5 }, (_, i) => base[(offset + i) % base.length])
}

function getBaccaratResults(index: number): string[] {
  const base = ['B', 'B', 'P', 'B', 'P', 'T', 'P', 'B', 'B', 'P', 'B', 'P']
  const offset = (index * 2) % base.length
  return Array.from({ length: 5 }, (_, i) => base[(offset + i) % base.length])
}

function RouletteHistory({ results: initialResults }: { results: number[] }) {
  const [items, setItems] = useState(() => initialResults.map((num, i) => ({ id: i, num })))
  const nextId = useRef(initialResults.length)

  useEffect(() => {
    const delay = 3000 + Math.random() * 5000
    const interval = setInterval(() => {
      const newNum = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)]
      nextId.current += 1
      setItems((prev) => [{ id: nextId.current, num: newNum }, ...prev].slice(0, 5))
    }, delay)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-0.5 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0, opacity: 0, width: 0 }}
            animate={{ scale: 1, opacity: 1, width: 14 }}
            exit={{ scale: 0, opacity: 0, width: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
            className={cn(
              'flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-[7px] font-semibold text-white',
              rouletteColor(item.num)
            )}
          >
            {item.num}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function BaccaratHistory({ results: initialResults }: { results: string[] }) {
  const [items, setItems] = useState(() => initialResults.map((r, i) => ({ id: i, result: r })))
  const nextId = useRef(initialResults.length)

  useEffect(() => {
    const delay = 3000 + Math.random() * 5000
    const interval = setInterval(() => {
      const newResult = BACCARAT_OPTIONS[Math.floor(Math.random() * BACCARAT_OPTIONS.length)]
      nextId.current += 1
      setItems((prev) => [{ id: nextId.current, result: newResult }, ...prev].slice(0, 5))
    }, delay)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-0.5 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0, opacity: 0, width: 0 }}
            animate={{ scale: 1, opacity: 1, width: 14 }}
            exit={{ scale: 0, opacity: 0, width: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
            className={cn(
              'flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-[7px] font-semibold text-white',
              item.result === 'B' ? 'bg-red-600' : item.result === 'P' ? 'bg-blue-600' : 'bg-emerald-600'
            )}
          >
            {item.result}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function BlackjackSeats({ occupied, total }: { occupied: number; total: number }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-sm">
      <IconUser className="h-3 w-3 text-white/70" />
      <span className="text-[10px] font-semibold text-white">
        {occupied}/{total}
      </span>
    </div>
  )
}

function ExclusiveCasinoTile({
  game,
  onClick,
}: {
  game: CasinoGame
  onClick?: () => void
}) {
  return (
    <div className="group relative h-[160px] w-[160px] flex-shrink-0 cursor-pointer overflow-hidden rounded-small bg-white/5 transition-all duration-300 hover:bg-white/10">
      <Image
        src={game.image}
        alt={game.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="160px"
      />
      <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex items-center gap-0.5 rounded-full border border-indigo-400/60 bg-indigo-950/80 px-1.5 py-[3px] backdrop-blur-sm">
        <IconRosetteFilled className="h-3 w-3 text-indigo-300" />
        <span className="text-[9px] font-semibold leading-none text-white">Exclusive</span>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 tile-shimmer" />
      <GameTilePlayOverlay favoriteTitle={game.title} onLaunch={() => onClick?.()} />
    </div>
  )
}

function LiveTile({
  game,
  index,
  onClick,
}: {
  game: LiveGame
  index: number
  onClick?: () => void
}) {
  const vendor = LIVE_VENDORS[index % LIVE_VENDORS.length]
  const imageSrc = LIVE_IMAGES[game.type]

  return (
    <div
      className="group relative h-[160px] w-[240px] flex-shrink-0 cursor-pointer overflow-hidden rounded-small bg-white/5 transition-all duration-300 hover:bg-white/10"
    >
      <Image
        src={imageSrc}
        alt={game.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="240px"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

      <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex max-w-[calc(100%-12px)] items-center gap-1 rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 backdrop-blur-md">
        <div className="relative h-1.5 w-1.5 flex-shrink-0">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
          <div className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
        </div>
        <span className="truncate text-[9px] font-medium text-white">{game.limit}</span>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-2.5">
        <div className="mb-1">
          <div className="mb-0.5 text-[9px] font-medium uppercase tracking-wider text-white/60">Live</div>
          <div className="line-clamp-1 text-sm font-bold leading-tight text-white">{game.title}</div>
        </div>

        <div className="mb-1.5">
          {game.type === 'roulette' && <RouletteHistory results={getRouletteResults(index)} />}
          {game.type === 'baccarat' && <BaccaratHistory results={getBaccaratResults(index)} />}
          {game.type === 'blackjack' && game.seats && (
            <BlackjackSeats occupied={game.seats.occupied} total={game.seats.total} />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm">
              <Image
                src={vendor.logo}
                alt={vendor.name}
                width={12}
                height={12}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="truncate text-[9px] font-medium text-white/50">{vendor.name}</span>
          </div>
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
            <IconInfoCircle className="h-3 w-3 text-white/60" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="pointer-events-none tile-shimmer absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <GameTilePlayOverlay favoriteTitle={game.title} onLaunch={() => onClick?.()} />
    </div>
  )
}

function SectionHeader({
  title,
  count,
  onAllGames,
  api,
  canScrollPrev,
  canScrollNext,
}: {
  title: string
  count: number
  onAllGames: () => void
  api?: CarouselApi
  canScrollPrev: boolean
  canScrollNext: boolean
}) {
  const isMobile = useIsMobile()

  return (
    <div className={cn('mb-4 flex items-center justify-between', isMobile ? 'px-3' : 'px-6')}>
      <h2 className="text-lg font-semibold text-white">
        {title} ({count})
      </h2>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="h-auto rounded-small border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white"
          onClick={onAllGames}
        >
          All Games
        </Button>
        {!isMobile && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-small border border-white/20 bg-[#1a1a1a]/90 text-white backdrop-blur-sm hover:border-white/30 hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50"
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
              className="h-8 w-8 rounded-small border border-white/20 bg-[#1a1a1a]/90 text-white backdrop-blur-sm hover:border-white/30 hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50"
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
  )
}

function useCarouselNav() {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

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

  return { api, setApi, canScrollPrev, canScrollNext }
}

export interface VipTablesSectionProps {
  onSelectGame?: (game: {
    title: string
    image: string
    provider?: string
    features?: string[]
  }) => void
  /** Rendered between Exclusives and Live Casino (e.g. Activity feed) */
  betweenSections?: ReactNode
  className?: string
}

export function VipTablesSection({
  onSelectGame,
  betweenSections,
  className,
}: VipTablesSectionProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const exclusives = useCarouselNav()
  const live = useCarouselNav()

  return (
    <div className={className}>
      <div className="mb-6">
        <SectionHeader
          title="Exclusives"
          count={18}
          onAllGames={() => router.push('/casino')}
          api={exclusives.api}
          canScrollPrev={exclusives.canScrollPrev}
          canScrollNext={exclusives.canScrollNext}
        />
        <div className={cn('relative', isMobile ? '-mx-3' : '-mx-6')}>
          <Carousel
            setApi={exclusives.setApi}
            className="relative w-full"
            opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
          >
            <CarouselContent className={cn(isMobile ? 'ml-3 mr-0' : 'ml-6 mr-0')}>
              {EXCLUSIVE_GAMES.map((game, index) => (
                <CarouselItem
                  key={`${game.title}-${index}`}
                  className={cn(
                    'basis-auto flex-shrink-0 pr-0',
                    index === 0 ? (isMobile ? 'pl-3' : 'pl-6') : 'pl-2 md:pl-3'
                  )}
                >
                  <ExclusiveCasinoTile
                    game={game}
                    onClick={() =>
                      onSelectGame?.({
                        title: game.title,
                        image: game.image,
                        provider: game.provider,
                        features: ['Exclusive Title', 'High RTP', 'Bonus Features'],
                      })
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {betweenSections}

      <div className="mb-6">
        <SectionHeader
          title="Live Casino"
          count={24}
          onAllGames={() => router.push('/casino?tab=live')}
          api={live.api}
          canScrollPrev={live.canScrollPrev}
          canScrollNext={live.canScrollNext}
        />
        <div className={cn('relative', isMobile ? '-mx-3' : '-mx-6')}>
          <Carousel
            setApi={live.setApi}
            className="relative w-full"
            opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
          >
            <CarouselContent className={cn(isMobile ? 'ml-3 mr-0' : 'ml-6 mr-0')}>
              {LIVE_CASINO_GAMES.map((game, index) => {
                const vendor = LIVE_VENDORS[index % LIVE_VENDORS.length]
                return (
                  <CarouselItem
                    key={game.title}
                    className={cn(
                      'basis-auto flex-shrink-0 pr-0',
                      index === 0 ? (isMobile ? 'pl-3' : 'pl-6') : 'pl-2 md:pl-3'
                    )}
                  >
                    <LiveTile
                      game={game}
                      index={index}
                      onClick={() =>
                        onSelectGame?.({
                          title: game.title,
                          image: LIVE_IMAGES[game.type],
                          provider: vendor.name,
                          features: [
                            'Live Dealer Experience',
                            'Real-Time Gameplay',
                            'Professional Dealers',
                          ],
                        })
                      }
                    />
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  )
}
