'use client'

import { useEffect, useState, type ElementType } from 'react'
import Image from 'next/image'
import {
  IconBallAmericanFootball,
  IconChevronLeft,
  IconChevronRight,
  IconEgg,
  IconGhost,
  IconTree,
} from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { RainBackground } from '@/components/rain-background'
import { SnowBackground } from '@/components/snow-background'
import { GameTilePlayOverlay } from '@/components/casino/game-tile-play-overlay'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export type SeasonalEventId =
  | 'halloween'
  | 'christmas'
  | 'superbowl'
  | 'easter'

type SeasonalEvent = {
  id: SeasonalEventId
  label: string
  title: string
  description: string
  badgeClass: string
  icon: ElementType
  /** Optional photo backdrop — drop files into public/banners/events/ later */
  image?: string
  atmosphere: 'rain' | 'snow' | 'stadium' | 'pastel'
  gameNames: string[]
  features: string[]
}

const EVENTS: SeasonalEvent[] = [
  {
    id: 'halloween',
    label: 'Halloween',
    title: 'HALLOWEEN GAMES',
    description:
      'Get spooky with our collection of Halloween-themed games! Spin the reels and win big with haunted slots and eerie jackpots.',
    badgeClass: 'bg-orange-600/80 text-white',
    icon: IconGhost,
    atmosphere: 'rain',
    // Optional: /banners/events/halloween.jpg
    gameNames: [
      'Spooky Slots',
      'Haunted Mansion',
      "Witch's Brew",
      'Pumpkin Jack',
      'Ghostly Reels',
      'Trick or Treat',
    ],
    features: [
      'Halloween Theme',
      'Spooky Bonus Features',
      'Special Halloween Promotions',
    ],
  },
  {
    id: 'christmas',
    label: 'Christmas',
    title: 'CHRISTMAS GAMES',
    description:
      'Unwrap festive wins with holiday slots, snowy jackpots, and merry bonus rounds built for the season.',
    badgeClass: 'bg-emerald-600/85 text-white',
    icon: IconTree,
    atmosphere: 'snow',
    image: '/banners/events/christmas.jpg',
    gameNames: [
      'Santa Spins',
      'Winter Wonder',
      'Candy Cane Cash',
      'North Pole Nights',
      'Stocking Stuffer',
      'Frosty Fortunes',
    ],
    features: [
      'Christmas Theme',
      'Festive Bonus Features',
      'Holiday Promotions',
    ],
  },
  {
    id: 'superbowl',
    label: 'Superbowl',
    title: 'SUPERBOWL GAMES',
    description:
      'Game-day energy meets big-play slots. Chase stadium jackpots and fourth-quarter bonus features.',
    badgeClass: 'bg-amber-500/90 text-black',
    icon: IconBallAmericanFootball,
    atmosphere: 'stadium',
    image: '/banners/nfl_bg.avif',
    gameNames: [
      'Gridiron Gold',
      'Touchdown Trails',
      'Blitz Bonus',
      'End Zone Spins',
      'Hail Mary Hits',
      'Field Goal Frenzy',
    ],
    features: [
      'Superbowl Theme',
      'Stadium Jackpots',
      'Game Day Promotions',
    ],
  },
  {
    id: 'easter',
    label: 'Easter',
    title: 'EASTER GAMES',
    description:
      'Hunt for pastel prizes and egg-citing free spins across spring-themed slots and soft jackpot trails.',
    badgeClass: 'bg-pink-500/85 text-white',
    icon: IconEgg,
    atmosphere: 'pastel',
    image: '/banners/events/easter.jpg',
    gameNames: [
      'Bunny Bucks',
      'Egg Hunt Express',
      'Pastel Pays',
      'Spring Spin',
      'Carrot Cascade',
      'Jellybean Jackpot',
    ],
    features: ['Easter Theme', 'Spring Bonus Features', 'Seasonal Promotions'],
  },
]

const TAGS = ['New', 'Exclusive', 'Hot', 'Early', 'New', 'Exclusive'] as const

function EventAtmosphere({
  event,
  children,
}: {
  event: SeasonalEvent
  children: React.ReactNode
}) {
  if (event.atmosphere === 'rain') {
    return (
      <RainBackground
        className="min-h-[400px] rounded-lg"
        count={150}
        intensity={1}
        angle={15}
        color="rgba(174, 194, 224, 0.5)"
        lightning
      >
        {children}
      </RainBackground>
    )
  }

  if (event.atmosphere === 'snow') {
    return (
      <SnowBackground className="min-h-[400px] rounded-lg" count={110}>
        {children}
      </SnowBackground>
    )
  }

  const gradients: Record<'stadium' | 'pastel', string> = {
    stadium:
      'linear-gradient(145deg, #0d1a0f 0%, #1a3320 45%, #243018 100%)',
    pastel:
      'linear-gradient(145deg, #2a1f2e 0%, #3a2a3f 40%, #2f3348 75%, #243040 100%)',
  }

  return (
    <div
      className="relative min-h-[400px] overflow-hidden rounded-lg"
      style={{ background: gradients[event.atmosphere] }}
    >
      {event.image ? (
        <div className="pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- optional event art may 404 until supplied */}
          <img
            src={event.image}
            alt=""
            className="h-full w-full object-cover opacity-45"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/30" />
        </div>
      ) : null}

      {event.atmosphere === 'stadium' ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0 46px, rgba(255,255,255,0.06) 46px 48px)',
          }}
          aria-hidden
        />
      ) : null}

      {event.atmosphere === 'pastel' ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, rgba(255,180,200,0.25), transparent 40%), radial-gradient(circle at 80% 20%, rgba(180,210,255,0.22), transparent 45%), radial-gradient(circle at 60% 80%, rgba(200,255,190,0.18), transparent 40%)',
          }}
          aria-hidden
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, transparent 45%, rgba(0,0,0,0.45) 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}

export interface SeasonalEventGamesBlockProps {
  tileImages: string[]
  onBrowseAll?: (event: SeasonalEventId) => void
  onSelectGame?: (game: {
    title: string
    image: string
    provider?: string
    features?: string[]
  }) => void
  className?: string
}

export function SeasonalEventGamesBlock({
  tileImages,
  onBrowseAll,
  onSelectGame,
  className,
}: SeasonalEventGamesBlockProps) {
  const isMobile = useIsMobile()
  const [eventId, setEventId] = useState<SeasonalEventId>('halloween')
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const event = EVENTS.find((e) => e.id === eventId) ?? EVENTS[0]
  const Icon = event.icon

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

  // Reset carousel when the theme changes so the strip feels fresh
  useEffect(() => {
    api?.scrollTo(0, true)
  }, [eventId, api])

  return (
    <div
      className={cn(
        'relative mx-3 mb-8 max-w-full overflow-hidden rounded-lg md:-mx-6',
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={event.id}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.2 }}
          transition={{ duration: 0.28 }}
        >
          <EventAtmosphere event={event}>
            <div className="relative z-10 min-w-0 max-w-full p-6 md:p-8 md:pb-8 md:pl-14 md:pr-8">
              {/* Event switcher — top right */}
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span
                    className={cn(
                      'mb-2 inline-block rounded-small px-3 py-1 text-xs font-semibold',
                      event.badgeClass
                    )}
                  >
                    {event.label}
                  </span>
                  <h2 className="mb-3 text-2xl font-bold text-[var(--ds-fg)] md:text-3xl lg:text-4xl">
                    {event.title}
                  </h2>
                  <p className="mb-0 max-w-2xl text-sm text-white/90 md:text-base">
                    {event.description}
                  </p>
                </div>

                <div
                  className="flex shrink-0 flex-wrap justify-end gap-1 rounded-lg border border-white/15 bg-black/35 p-1 backdrop-blur-md"
                  role="tablist"
                  aria-label="Seasonal event"
                >
                  {EVENTS.map((item) => {
                    const active = item.id === eventId
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setEventId(item.id)}
                        className={cn(
                          'rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors sm:text-xs',
                          active
                            ? 'bg-white text-black'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between pointer-events-auto">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-small border border-white/20 px-6 py-2.5 text-sm text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                  onClick={() => onBrowseAll?.(event.id)}
                >
                  <Icon className="h-4 w-4" />
                  All Games
                </Button>
                {!isMobile ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small border border-white/20 bg-black/40 text-white backdrop-blur-sm hover:border-white/30 hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() =>
                        api?.scrollTo(Math.max(0, api.selectedScrollSnap() - 2))
                      }
                      disabled={!api || !canScrollPrev}
                    >
                      <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small border border-white/20 bg-black/40 text-white backdrop-blur-sm hover:border-white/30 hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => {
                        if (!api) return
                        const slides = api.scrollSnapList().length
                        api.scrollTo(
                          Math.min(slides - 1, api.selectedScrollSnap() + 2)
                        )
                      }}
                      disabled={!api || !canScrollNext}
                    >
                      <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="pointer-events-auto -mx-6">
                <Carousel
                  setApi={setApi}
                  className="relative w-full"
                  opts={{
                    dragFree: true,
                    containScroll: 'trimSnaps',
                    duration: 15,
                  }}
                >
                  <CarouselContent className="ml-0 pr-4 md:pr-6">
                    {Array.from({ length: 15 }).map((_, index) => {
                      const imageSrc =
                        tileImages[index % Math.max(tileImages.length, 1)] ||
                        '/casino_slots_tiles/slot-39.png'
                      const title =
                        event.gameNames[index % event.gameNames.length]
                      const tag = TAGS[index % TAGS.length]

                      return (
                        <CarouselItem
                          key={`${event.id}-${index}`}
                          className={cn(
                            'basis-auto flex-shrink-0 pr-0',
                            index === 0
                              ? isMobile
                                ? 'pl-3'
                                : 'pl-8'
                              : 'pl-2 md:pl-3'
                          )}
                        >
                          <div className="group relative h-[160px] w-[240px] flex-shrink-0 cursor-pointer overflow-hidden rounded-small border border-white/20 bg-[var(--ds-control-hover)] transition-all duration-300">
                            <Image
                              src={imageSrc}
                              alt={title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="240px"
                            />
                            <span
                              className={cn(
                                'pointer-events-none absolute left-1.5 top-1.5 z-10 rounded-[2px] px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none text-white shadow-md',
                                tag === 'Hot' && 'bg-[#ee3536]',
                                tag === 'New' && 'bg-orange-500',
                                tag === 'Exclusive' && 'bg-indigo-600',
                                tag === 'Early' && 'bg-emerald-600'
                              )}
                            >
                              {tag}
                            </span>
                            <GameTilePlayOverlay
                              favoriteTitle={title}
                              onLaunch={() =>
                                onSelectGame?.({
                                  title,
                                  image: imageSrc,
                                  provider: 'BetSoft',
                                  features: event.features,
                                })
                              }
                            />
                          </div>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </EventAtmosphere>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
