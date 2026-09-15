'use client'

import { IconLogin2 } from '@tabler/icons-react'
import { CasinoPromoBanner } from '@/components/casino/casino-promo-banner'
import { DailyRacesTimer } from '@/components/daily-races-timer'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { VipTierProgressCard } from '@/components/vip/vip-tier-progress-card'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

const BANNERS = [
  '/banners/casino/casino_banner1.svg',
  '/banners/casino/casino_banner2.svg',
  '/banners/casino/casino_banner 3.svg',
  '/banners/casino/casino_banner4.svg',
  '/banners/casino/casino_Banner5.svg',
]

function openVip(tab?: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('vip:open-drawer', { detail: tab ? { tab } : undefined }))
}

const CARD_CLS =
  'group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-0 bg-[#eeeeee] shadow-none transition-colors dark:bg-white/[0.06]'

/** Same VIP Hub + Daily Races + promo banner carousel as the casino lobby. */
export function SportsPromoCarousel({ className }: { className?: string }) {
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
          {/* VIP Hub card */}
          <CarouselItem className={cn('basis-auto flex-shrink-0 pr-0', isMobile ? 'pl-3' : 'pl-6')}>
            <Card className={CARD_CLS} style={{ width: '300px', height: '164px' }} onClick={() => openVip()}>
              <CardContent className="relative z-10 flex h-full min-h-0 flex-col p-4">
                <div className="flex shrink-0 items-start justify-between gap-2">
                  <CardTitle className="text-base font-bold leading-tight text-[#1a1a1a] dark:text-white">
                    VIP Hub
                  </CardTitle>
                  <IconLogin2 className="mt-0.5 h-4 w-4 shrink-0 text-black/40 dark:text-white/45" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="flex min-h-0 flex-1 flex-col justify-center">
                  <VipTierProgressCard
                    fromTier="Bronze"
                    toTier="Silver"
                    percent={25}
                    className="border-0 bg-transparent p-0 shadow-none"
                  />
                </div>
              </CardContent>
              <span className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full dark:via-white/15" />
            </Card>
          </CarouselItem>

          {/* Daily Races card */}
          <CarouselItem className="basis-auto flex-shrink-0 pl-2 md:pl-4">
            <Card className={CARD_CLS} style={{ width: '300px', height: '164px' }} onClick={() => openVip('Daily Races')}>
              <CardContent className="relative z-10 flex h-full min-h-0 flex-col justify-between p-4">
                <div className="flex shrink-0 items-start justify-between gap-2">
                  <CardTitle className="mb-0 text-base font-bold leading-tight text-[#1a1a1a] dark:text-white">
                    Daily Races
                  </CardTitle>
                  <DailyRacesTimer
                    className="text-base font-bold tabular-nums text-[#1a1a1a] dark:text-white"
                    colonClassName="text-black/40 dark:text-white/50"
                  />
                </div>
                <div className="grid w-full grid-cols-3 gap-2">
                  {[
                    ['3rd', 'Position'],
                    ['$80.000', 'Wagered'],
                    ['$160.000', 'Current Prize'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-xl bg-white px-2.5 py-2.5 dark:bg-white/[0.08]">
                      <div className="text-sm font-bold tabular-nums text-[#1a1a1a] dark:text-white">{value}</div>
                      <div className="mt-0.5 text-[11px] font-medium text-black/45 dark:text-white/50">{label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <span className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full dark:via-white/15" />
            </Card>
          </CarouselItem>

          {BANNERS.map((src) => (
            <CarouselItem key={src} className="basis-auto flex-shrink-0 pl-2 md:pl-4">
              <CasinoPromoBanner src={src} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
