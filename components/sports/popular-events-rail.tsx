'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { PopularEventCard } from './popular-event-card'
import type { PopularEvent } from './mock-data'

interface PopularEventsRailProps {
  events: PopularEvent[]
  /** Pass negative margins (e.g. `-mx-6`) so the rail bleeds to the content edges like the casino carousels. */
  className?: string
}

/** Full-bleed horizontal rail — same Carousel/drag behaviour as the casino lobby banners. */
export function PopularEventsRail({ events, className }: PopularEventsRailProps) {
  const isMobile = useIsMobile()

  return (
    <div className={cn('relative z-0 overflow-visible', className)}>
      <Carousel
        className="relative w-full overflow-visible"
        opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
      >
        {!isMobile && (
          <>
            <CarouselPrevious className="!left-2 !-translate-x-0 z-20 h-8 w-8 rounded-full border border-[var(--ds-border-strong)] bg-[var(--ds-surface)] text-[var(--ds-fg)] backdrop-blur-sm hover:bg-[var(--ds-surface-raised)]" />
            <CarouselNext className="!right-2 !-translate-x-0 z-20 h-8 w-8 rounded-full border border-[var(--ds-border-strong)] bg-[var(--ds-surface)] text-[var(--ds-fg)] backdrop-blur-sm hover:bg-[var(--ds-surface-raised)]" />
          </>
        )}
        <CarouselContent className="ml-0 pr-4 md:pr-6">
          {events.map((event, index) => (
            <CarouselItem
              key={event.id}
              className={cn(
                'basis-auto flex-shrink-0',
                index === 0 ? (isMobile ? 'pl-4' : 'pl-6') : 'pl-2 md:pl-3'
              )}
            >
              <PopularEventCard event={event} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
