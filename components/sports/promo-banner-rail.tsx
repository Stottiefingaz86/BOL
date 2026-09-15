'use client'

import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import type { PromoBanner } from './mock-data'

interface PromoBannerRailProps {
  banners: PromoBanner[]
  className?: string
}

const TONE_BG: Record<PromoBanner['tone'], string> = {
  red: 'from-[#7f1d1d] via-[#b91c1c] to-[#dc2626]',
  dark: 'from-[#1f2937] via-[#111827] to-[#0b1220]',
  gold: 'from-[#78350f] via-[#b45309] to-[#d97706]',
}

export function PromoBannerRail({ banners, className }: PromoBannerRailProps) {
  return (
    <Carousel
      opts={{ align: 'start', dragFree: true }}
      className={cn('w-full', className)}
      wheelGestures
    >
      <CarouselContent className="-ml-3">
        {banners.map((banner) => (
          <CarouselItem key={banner.id} className="basis-[340px] pl-3">
            <div
              className={cn(
                'relative flex h-[164px] overflow-hidden rounded-[10px] border border-[var(--ds-border)] bg-gradient-to-br p-4',
                TONE_BG[banner.tone]
              )}
            >
              <div className="relative z-10 flex max-w-[58%] flex-col justify-between">
                <div>
                  <p className="text-xl font-semibold leading-tight text-white">{banner.title}</p>
                  <p className="mt-1 text-sm text-white/80">{banner.subtitle}</p>
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex h-8 w-fit items-center rounded-md bg-white px-3 text-xs font-semibold text-[#111] transition-opacity hover:opacity-90"
                >
                  {banner.cta}
                </button>
              </div>
              <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[48%]">
                <Image
                  src={banner.image}
                  alt=""
                  fill
                  className="object-contain object-right-bottom opacity-90"
                  sizes="160px"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
