'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { IconArrowRight, IconBallAmericanFootball, IconBallBasketball, IconRocket } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { Top10GamesCarousel } from '@/components/casino/top-10-games-carousel'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { EventListCard } from './event-list-card'
import { MarketFilterBar } from './market-filter-bar'
import { PopularEventsRail } from './popular-events-rail'
import { SportBreadcrumb } from './sport-breadcrumb'
import { SportsPromoCarousel } from './sports-promo-carousel'
import {
  FOOTBALL_LEAGUES,
  POPULAR_EVENTS,
  BASKETBALL_LEAGUES,
  SPORT_CHIPS,
  type LeagueGroup,
  type MarketFilter,
  type OddsCell,
  type SportId,
  type SportsEvent,
} from './mock-data'

export function SportsHome({
  activeSport: controlledSport,
  onActiveSportChange,
}: {
  activeSport?: SportId
  onActiveSportChange?: (id: SportId) => void
} = {}) {
  const [uncontrolledSport, setUncontrolledSport] = useState<SportId>('home')
  const activeSport = controlledSport ?? uncontrolledSport
  const setActiveSport = onActiveSportChange ?? setUncontrolledSport
  const isMobile = useIsMobile()
  const router = useRouter()
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('events')

  const bets = useBetslipStore((s) => s.bets)
  const addBet = useBetslipStore((s) => s.addBet)
  const removeBet = useBetslipStore((s) => s.removeBet)
  const setOpen = useBetslipStore((s) => s.setOpen)
  const setMinimized = useBetslipStore((s) => s.setMinimized)
  const setManuallyClosed = useBetslipStore((s) => s.setManuallyClosed)

  const selectedIds = useMemo(() => new Set(bets.map((b) => b.id)), [bets])

  const footballLeagues = useMemo(
    () => visibleLeagues(FOOTBALL_LEAGUES, activeSport, 'football'),
    [activeSport]
  )
  const basketballLeagues = useMemo(
    () => visibleLeagues(BASKETBALL_LEAGUES, activeSport, 'basketball'),
    [activeSport]
  )

  const showFootball =
    activeSport === 'home' || activeSport === 'football'
  const showBasketball = activeSport === 'home' || activeSport === 'basketball'
  const showPopular = activeSport === 'home' || activeSport === 'football'
  // Sport-specific page (any chip other than Sports Home): breadcrumbs instead of casino banners
  const isSportPage = activeSport !== 'home'
  const sportLabel = SPORT_CHIPS.find((c) => c.id === activeSport)?.label ?? 'Sport'

  const handleSelectOdds = (cell: OddsCell, event: SportsEvent, marketTitle: string) => {
    if (selectedIds.has(cell.id)) {
      removeBet(cell.id)
      return
    }
    addBet({
      id: cell.id,
      eventId: hashEventId(event.id),
      eventName: `${event.home.name} vs ${event.away.name}`,
      marketTitle,
      selection: cell.line ?? cell.odds,
      odds: cell.odds,
      stake: 0,
    })
    setManuallyClosed(false)
    setMinimized(false)
    setOpen(true)
  }

  return (
    <div className="w-full space-y-5 px-4 pb-10 pt-4 md:px-6 md:pt-5">
      {isSportPage ? (
        <SportBreadcrumb
          sportId={activeSport}
          sportLabel={sportLabel}
          onBack={() => setActiveSport('home')}
        />
      ) : (
        /* VIP Hub / Daily Races / promo banners — same carousel as the casino lobby (full-bleed) */
        <SportsPromoCarousel className={isMobile ? '-mx-4' : '-mx-6'} />
      )}

      {showPopular && (
        <section className="space-y-3">
          <SectionHeader
            fallbackIcon={<IconRocket className="size-4" strokeWidth={1.5} />}
            title="Popular Events"
            onSeeAll={() => setActiveSport('football')}
          />
          <PopularEventsRail events={POPULAR_EVENTS} className={isMobile ? '-mx-4' : '-mx-6'} />
        </section>
      )}

      {(showFootball || showBasketball) && !isMobile && (
        <MarketFilterBar value={marketFilter} onChange={setMarketFilter} />
      )}

      {marketFilter === 'events' && showFootball && (
        <section className="space-y-3">
          <SectionHeader
            iconSrc="/sports_icons/football.svg"
            fallbackIcon={<IconBallAmericanFootball className="size-4" />}
            title="Football Events"
            onSeeAll={isSportPage ? undefined : () => setActiveSport('football')}
          />

          <div className="space-y-3">
            {footballLeagues.map((league) => (
              <EventListCard
                key={league.id}
                league={league}
                layout={isMobile ? 'mobile' : 'desktop'}
                selectedIds={selectedIds}
                onSelectOdds={handleSelectOdds}
              />
            ))}
          </div>

        </section>
      )}

      {/* Top 10 casino games — same carousel as the casino lobby, full-bleed */}
      {!isSportPage && marketFilter === 'events' && (
        <Top10GamesCarousel
          className={cn('mb-0', isMobile ? '-mx-4' : '-mx-6')}
          onSelectGame={() => router.push('/casino')}
        />
      )}

      {marketFilter === 'events' && showBasketball && (
        <section className="space-y-3">
          <SectionHeader
            iconSrc="/sports_icons/Basketball.svg"
            fallbackIcon={<IconBallBasketball className="size-4" />}
            title="Basketball Events"
            onSeeAll={isSportPage ? undefined : () => setActiveSport('basketball')}
          />

          <div className="space-y-3">
            {basketballLeagues.map((league) => (
              <EventListCard
                key={league.id}
                league={league}
                layout={isMobile ? 'mobile' : 'desktop'}
                selectedIds={selectedIds}
                onSelectOdds={handleSelectOdds}
              />
            ))}
          </div>

        </section>
      )}

      {marketFilter !== 'events' && (
        <div className="rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-surface)] px-4 py-10 text-center text-sm text-[var(--ds-fg-muted)]">
          {marketFilter === 'outrights'
            ? 'Outrights markets coming soon.'
            : 'Browse all leagues from the sport chips above.'}
        </div>
      )}

      {!showFootball && !showBasketball && (
        <div className="rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-surface)] px-4 py-10 text-center text-sm text-[var(--ds-fg-muted)]">
          {sportLabel} events coming soon.
        </div>
      )}
    </div>
  )
}

function SectionHeader({
  title,
  iconSrc,
  fallbackIcon,
  onSeeAll,
}: {
  title: string
  iconSrc?: string
  fallbackIcon: ReactNode
  onSeeAll?: () => void
}) {
  return (
    <div className="relative z-10 flex items-center justify-between gap-3">
      <div className="flex h-7 min-w-0 items-center gap-1">
        <span className="relative inline-flex size-7 shrink-0 items-center justify-center text-[var(--ds-fg)]">
          {iconSrc ? (
            <span className="relative size-4">
              <Image src={iconSrc} alt="" fill className="object-contain" sizes="16px" />
            </span>
          ) : (
            fallbackIcon
          )}
        </span>
        <h2 className="truncate text-lg font-semibold leading-7 text-[var(--ds-fg)]">{title}</h2>
      </div>
      {onSeeAll && (
        // Same "View All" button as the casino carousel headers
        <Button
          variant="ghost"
          className="relative z-10 h-auto shrink-0 whitespace-nowrap rounded-small border border-white/20 px-3 py-1.5 text-xs text-[var(--ds-fg-muted)] transition-colors duration-300 hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
          onClick={onSeeAll}
        >
          <span className="inline-flex items-center gap-1.5">
            See All
            <IconArrowRight className="size-3.5" strokeWidth={2} />
          </span>
        </Button>
      )}
    </div>
  )
}

function visibleLeagues(leagues: LeagueGroup[], activeSport: SportId, sport: SportId): LeagueGroup[] {
  if (activeSport !== 'home' && activeSport !== sport) return []
  // Sport page: everything. Home: first league full, further leagues trimmed ("See All" opens the sport page)
  if (activeSport === sport) return leagues
  return leagues.map((league, index) =>
    index === 0
      ? league
      : { ...league, events: league.events.slice(0, 1) }
  )
}

function hashEventId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return Math.abs(hash)
}
