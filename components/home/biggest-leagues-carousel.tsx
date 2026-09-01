'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IconChevronRight, IconLoader2 } from '@tabler/icons-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

const BIGGEST_MARKETS = [
  {
    id: 'nfl',
    name: 'NFL',
    icon: '/banners/sports_league/NFL.svg',
    href: '/sports/football/nfl',
  },
  {
    id: 'nba',
    name: 'NBA',
    icon: '/banners/sports_league/nba.svg',
    href: '/sports/basketball/nba',
  },
  {
    id: 'mlb',
    name: 'MLB',
    icon: '/banners/sports_league/MLB.svg',
    href: '/sports/baseball/mlb',
  },
  {
    id: 'nhl',
    name: 'NHL',
    icon: '/banners/sports_league/NHL.svg',
    href: '/sports/hockey/nhl',
  },
  {
    id: 'premier-league',
    name: 'Premier League',
    icon: '/banners/sports_league/prem.svg',
    href: '/sports/soccer/premier-league',
  },
  {
    id: 'la-liga',
    name: 'La Liga',
    icon: '/banners/sports_league/laliga.svg',
    href: '/sports/soccer/la-liga',
  },
  {
    id: 'mls',
    name: 'MLS',
    icon: '/banners/sports_league/mls.svg',
    href: '/sports/soccer/mls',
  },
  {
    id: 'atp',
    name: 'ATP',
    icon: '/banners/sports_league/ATP.svg',
    href: '/sports/tennis/atp',
  },
  {
    id: 'f1',
    name: 'Formula 1',
    icon: '/banners/sports_league/f1.svg',
    href: '/sports/football',
  },
] as const

const TILE = 120

export type BiggestLeaguesCarouselProps = {
  className?: string
}

/**
 * Homepage strip — square market tiles (league logos).
 */
export function BiggestLeaguesCarousel({ className }: BiggestLeaguesCarouselProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  return (
    <div className={cn('mb-6', className)}>
      <div className={cn('mb-4 flex items-center justify-between', isMobile ? 'px-3' : 'px-6')}>
        <h2 className="min-w-0 flex-1 truncate text-lg font-semibold text-[var(--ds-fg)]">
          The Biggest Markets
        </h2>
        <button
          type="button"
          onClick={() => router.push('/sports/football')}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[#ee3536] transition-colors hover:text-[#ff5555]"
        >
          View All
          <IconChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      <div className={cn('relative', isMobile ? '-mx-3' : '-mx-6')}>
        <Carousel
          className="relative w-full"
          opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
        >
          <CarouselContent className={cn(isMobile ? 'ml-3 pr-3' : 'ml-6 pr-6')}>
            {BIGGEST_MARKETS.map((market, index) => {
              const isLoading = loadingId === market.id
              return (
                <CarouselItem
                  key={market.id}
                  className={cn(
                    'basis-auto flex-shrink-0 pr-0',
                    index === 0 ? (isMobile ? 'pl-3' : 'pl-6') : 'pl-2 md:pl-3'
                  )}
                >
                  <button
                    type="button"
                    aria-label={market.name}
                    disabled={isLoading}
                    onClick={() => {
                      setLoadingId(market.id)
                      router.push(market.href)
                    }}
                    className={cn(
                      'group relative flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition-colors hover:border-white/20 hover:bg-white/[0.08]',
                      isLoading && 'pointer-events-none opacity-60'
                    )}
                    style={{ width: TILE, height: TILE }}
                  >
                    {isLoading ? (
                      <IconLoader2 className="h-5 w-5 animate-spin text-white/50" />
                    ) : (
                      <Image
                        src={market.icon}
                        alt={market.name}
                        width={72}
                        height={72}
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    )}
                  </button>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
