'use client'

import { useEffect, useState } from 'react'
import { IconMinus, IconPlus, IconArrowUpRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import {
  FEATURED_EVENTS,
  LOBBY_BANNERS,
  LOBBY_PROMOS,
  QUICK_SEATS,
  type QuickSeat,
} from '@/lib/poker-app/mock-data'
import {
  pokerBtnAction,
  pokerBtnGhost,
  pokerGlowAccent,
  pokerGlowCard,
  pokerHairline,
  pokerInset,
} from '@/components/poker-app/ui'

function BuyInStepper({
  value,
  onChange,
  step = 5,
  min = 5,
  max = 200,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
}) {
  return (
    <div className={cn('flex h-7 w-[96px] items-center justify-between rounded-md px-0.5', pokerInset)}>
      <button
        type="button"
        aria-label="Decrease buy-in"
        onClick={() => onChange(Math.max(min, value - step))}
        className="flex size-6 items-center justify-center text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)]"
      >
        <IconMinus className="size-3" strokeWidth={2} />
      </button>
      <span className="font-mono text-[12px] tabular-nums text-[var(--ds-fg)]">
        ${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}
      </span>
      <button
        type="button"
        aria-label="Increase buy-in"
        onClick={() => onChange(Math.min(max, value + step))}
        className="flex size-6 items-center justify-center text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)]"
      >
        <IconPlus className="size-3" strokeWidth={2} />
      </button>
    </div>
  )
}

function QuickSeatRow({ seat }: { seat: QuickSeat }) {
  const [buyIn, setBuyIn] = useState(seat.buyIn)
  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 px-4 py-3',
        'border-b last:border-b-0',
        pokerHairline,
        'hover:bg-white/[0.03]'
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-medium text-[var(--ds-fg)]">{seat.game}</p>
          {seat.badge ? (
            <span className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-[var(--ds-fg-subtle)]">
              {seat.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 font-mono text-[11px] text-[var(--ds-fg-subtle)]">
          {seat.label} · {seat.stakes}
        </p>
      </div>
      <BuyInStepper value={buyIn} onChange={setBuyIn} />
      <button type="button" className={pokerBtnAction('h-7 px-3 text-[12px]')}>
        {seat.action === 'join' ? 'Join' : 'Register'}
      </button>
    </div>
  )
}

function LobbyBannerCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setIndex(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api) return
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext()
      else api.scrollTo(0)
    }, 6000)
    return () => window.clearInterval(id)
  }, [api])

  return (
    <div className={cn('relative border-b', pokerHairline)}>
      <Carousel setApi={setApi} opts={{ loop: true, duration: 20 }} className="w-full">
        <CarouselContent className="ml-0">
          {LOBBY_BANNERS.map((banner) => (
            <CarouselItem key={banner.id} className="pl-0 basis-full">
              <div
                className="relative min-h-[168px] overflow-hidden px-5 py-6 md:min-h-[200px] md:px-8 md:py-8"
                style={{ background: banner.wash }}
              >
                <div className="relative z-[1] max-w-xl space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                    {banner.eyebrow}
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-white md:text-[28px]">
                    {banner.title}
                  </h2>
                  <p className="max-w-md text-[13px] leading-relaxed text-white/60 md:text-sm">
                    {banner.body}
                  </p>
                  <button type="button" className={pokerBtnAction('mt-2')}>
                    {banner.cta}
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 hidden h-8 w-8 border-white/15 bg-black/50 text-white hover:bg-black/70 hover:text-white md:flex" />
        <CarouselNext className="right-2 hidden h-8 w-8 border-white/15 bg-black/50 text-white hover:bg-black/70 hover:text-white md:flex" />
      </Carousel>

      <div className="absolute bottom-3 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5">
        {LOBBY_BANNERS.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index
                ? 'w-5 bg-[var(--ds-primary,#ee3536)]'
                : 'w-1.5 bg-white/25 hover:bg-white/40'
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function LobbyView() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto">
      <LobbyBannerCarousel />

      {/* Promo strip */}
      <div className={cn('px-4 py-3', 'border-b', pokerHairline)}>
        <div className="flex gap-2.5 overflow-x-auto pb-0.5">
          {LOBBY_PROMOS.map((promo) => (
            <button
              key={promo.id}
              type="button"
              className={cn(
                'flex min-w-[140px] flex-1 flex-col items-start gap-0.5 px-3.5 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-primary,#ee3536)]/40',
                promo.tone === 'accent' || promo.value ? pokerGlowAccent : pokerGlowCard
              )}
            >
              <span className="text-[11px] text-[var(--ds-fg-subtle)]">{promo.subtitle ?? 'Promo'}</span>
              <span className="text-[13px] font-medium text-[var(--ds-fg)]">{promo.title}</span>
              {promo.value ? (
                <span className="mt-0.5 font-mono text-[14px] tabular-nums text-[var(--ds-fg)]">
                  {promo.value}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className={cn('border-b lg:border-b-0 lg:border-r', pokerHairline)}>
          <div className={cn('flex items-center justify-between px-4 py-3', 'border-b', pokerHairline)}>
            <h2 className="text-[13px] font-medium text-[var(--ds-fg)]">Quick seats</h2>
            <button type="button" className={pokerBtnGhost('h-7 text-[12px]')}>
              View all
            </button>
          </div>
          <div>
            {QUICK_SEATS.map((seat) => (
              <QuickSeatRow key={seat.id} seat={seat} />
            ))}
          </div>
        </section>

        <section className="flex flex-col">
          <div className={cn('px-4 py-3', 'border-b', pokerHairline)}>
            <h2 className="text-[13px] font-medium text-[var(--ds-fg)]">Featured tournaments</h2>
          </div>
          <ul>
            {FEATURED_EVENTS.map((event) => (
              <li
                key={event.id}
                className={cn(
                  'flex items-center gap-3 px-4 py-3',
                  'border-b last:border-b-0',
                  pokerHairline,
                  'hover:bg-white/[0.03]'
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-[var(--ds-fg)]">{event.title}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--ds-fg-subtle)]">
                    {event.game}
                    <span className="mx-1.5 text-white/20">·</span>
                    <span className="font-mono text-[11px]">in {event.startsIn}</span>
                  </p>
                </div>
                <button type="button" className={pokerBtnGhost('h-7 gap-1 text-[12px]')}>
                  {event.buyIn}
                  <IconArrowUpRight className="size-3 opacity-50" strokeWidth={1.8} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
