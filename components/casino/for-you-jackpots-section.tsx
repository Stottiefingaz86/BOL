'use client'

import { useMemo, useState } from 'react'
import type { EmblaCarouselType } from 'embla-carousel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { JackpotCountersStrip } from '@/components/casino/jackpot-counters-strip'
import { JackpotEligibleGameTile } from '@/components/casino/jackpot-eligible-game-tile'
import { JackpotOptInToggle } from '@/components/casino/jackpot-opt-in-toggle'
import { tierByIndex } from '@/components/casino/jackpot-tiers'
import { cn } from '@/lib/utils'

export type ForYouJackpotsSectionProps = {
  isMobile: boolean
  squareTileImages: string[]
  jackpotOptIn: boolean
  onJackpotOptInChange: (next: boolean) => void
  onPlayGame: (game: {
    title: string
    image: string
    provider?: string
    features?: string[]
  }) => void
  /** Optional — e.g. open Jackpots category grid */
  onViewAll?: () => void
}

const FOR_YOU_NAMES = [
  'Big Bass Bonanza',
  'Wolf Gold',
  'Sweet Bonanza',
  'The Dog House',
  'Gates of Olympus',
  'Sugar Rush',
  'Fruit Party',
  'Starlight Princess',
]

const FOR_YOU_PROVIDERS = ['Pragmatic Play', 'Pragmatic Play', 'Pragmatic Play', 'Pragmatic Play']

const CAROUSEL_NAV_BTN =
  'h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed'

export function ForYouJackpotsSection({
  isMobile,
  squareTileImages,
  jackpotOptIn,
  onJackpotOptInChange,
  onPlayGame,
  onViewAll,
}: ForYouJackpotsSectionProps) {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const tiles = useMemo(() => {
    return FOR_YOU_NAMES.map((title, i) => {
      const image = squareTileImages[(i + 3) % squareTileImages.length] ?? ''
      const tier = tierByIndex(i + 1)
      return {
        key: `fy-jackpot-${i}`,
        title,
        image,
        tier,
        provider: FOR_YOU_PROVIDERS[i % FOR_YOU_PROVIDERS.length],
      }
    })
  }, [squareTileImages])

  const bindApi = (api: EmblaCarouselType | undefined) => {
    setEmblaApi(api ?? null)
    if (!api) return
    const sync = () => {
      setCanPrev(api.canScrollPrev())
      setCanNext(api.canScrollNext())
    }
    sync()
    api.on('select', sync)
    api.on('reInit', sync)
  }

  const scrollBy = (direction: 'prev' | 'next') => {
    if (!emblaApi) return
    const currentIndex = emblaApi.selectedScrollSnap()
    const slideCount = emblaApi.scrollSnapList().length
    const delta = 2
    const target =
      direction === 'prev'
        ? Math.max(0, currentIndex - delta)
        : Math.min(slideCount - 1, currentIndex + delta)
    emblaApi.scrollTo(target)
  }

  return (
    <section
      className={cn('relative z-0 w-full overflow-visible', isMobile ? 'mb-8' : 'mb-10')}
      aria-label="Eligible for jackpots"
    >
      <JackpotCountersStrip dense className={cn('mb-5', isMobile ? 'mx-3' : 'mx-6')} />

      {/* Same header pattern as New Games / BlackJack carousels on this page */}
      <div
        className={cn(
          'mb-6 flex items-center justify-between gap-3',
          isMobile ? 'px-3' : 'px-6'
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <h2 className="shrink-0 text-lg font-semibold text-white">Eligible for jackpots</h2>
          <JackpotOptInToggle
            variant="compact"
            checked={jackpotOptIn}
            onCheckedChange={onJackpotOptInChange}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {onViewAll && (
            <Button
              type="button"
              variant="ghost"
              className="h-auto whitespace-nowrap rounded-small border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white"
              onClick={onViewAll}
            >
              View all
            </Button>
          )}
          {!isMobile && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={CAROUSEL_NAV_BTN}
                disabled={!emblaApi || !canPrev}
                onClick={() => scrollBy('prev')}
                aria-label="Previous games"
              >
                <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={CAROUSEL_NAV_BTN}
                disabled={!emblaApi || !canNext}
                onClick={() => scrollBy('next')}
                aria-label="Next games"
              >
                <IconChevronRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </>
          )}
        </div>
      </div>

      <div
        className="relative w-full overflow-visible"
        style={{ overflow: 'visible' }}
      >
        <Carousel
          setApi={bindApi}
          className="relative w-full"
          style={{ overflow: 'visible' }}
          opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
        >
          <CarouselContent className="ml-0 -mr-2 md:-mr-4">
            {tiles.map((t, index) => (
              <CarouselItem
                key={t.key}
                className={cn(
                  'basis-auto shrink-0 pr-0',
                  index === 0 ? (isMobile ? 'pl-3' : 'pl-6') : 'pl-2 md:pl-4'
                )}
              >
                <JackpotEligibleGameTile
                  image={t.image}
                  title={t.title}
                  tier={t.tier}
                  topTag={index % 3 === 0 ? { kind: 'hot', label: 'Hot' } : undefined}
                  onClick={() =>
                    onPlayGame({
                      title: t.title,
                      image: t.image,
                      provider: t.provider,
                      features: ['Jackpot eligible', `${t.tier.label} pool`],
                    })
                  }
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
