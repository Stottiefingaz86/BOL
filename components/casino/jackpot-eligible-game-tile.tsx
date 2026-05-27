'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { IconClock, IconFlame, IconRosetteDiscountCheck, IconSparkles } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { JackpotTierConfig } from '@/components/casino/jackpot-tiers'
import { JackpotTileJackpotChip } from '@/components/casino/jackpot-tile-jackpot-chip'

export type TopTagKind = 'exclusive' | 'new' | 'hot' | 'early'

const TOP_TAG_STYLES: Record<TopTagKind, string> = {
  exclusive: 'border border-violet-400/35 bg-violet-500/45 text-white shadow-sm backdrop-blur-sm',
  new: 'border border-amber-300/35 bg-amber-500/50 text-black shadow-sm backdrop-blur-sm',
  hot: 'border border-red-400/35 bg-red-600/40 text-white shadow-sm backdrop-blur-sm',
  early: 'border border-emerald-400/35 bg-emerald-600/42 text-white shadow-sm backdrop-blur-sm',
}

const TOP_TAG_ICON: Record<TopTagKind, ReactNode> = {
  exclusive: <IconRosetteDiscountCheck className="h-2.5 w-2.5 shrink-0" strokeWidth={2} aria-hidden />,
  new: <IconSparkles className="h-2.5 w-2.5 shrink-0" strokeWidth={2} aria-hidden />,
  hot: <IconFlame className="h-2.5 w-2.5 shrink-0" strokeWidth={2} aria-hidden />,
  early: <IconClock className="h-2.5 w-2.5 shrink-0" strokeWidth={2} aria-hidden />,
}

export type JackpotEligibleGameTileProps = {
  image: string
  title: string
  tier: JackpotTierConfig
  topTag?: { kind: TopTagKind; label: string }
  onClick?: () => void
  className?: string
}

export function JackpotEligibleGameTile({
  image,
  title,
  tier,
  topTag,
  onClick,
  className,
}: JackpotEligibleGameTileProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      data-content-item
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        'group relative h-[160px] w-[160px] shrink-0 cursor-pointer overflow-hidden rounded-small',
        'bg-white/5 transition-all duration-300 hover:bg-white/10',
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="z-0 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="160px"
        />
      ) : null}

      {topTag && (
        <div
          className={cn(
            'absolute left-1.5 top-1.5 z-20 flex max-w-[calc(100%-12px)] items-center gap-1 rounded-full px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-wide',
            TOP_TAG_STYLES[topTag.kind]
          )}
        >
          {TOP_TAG_ICON[topTag.kind]}
          <span className="truncate">{topTag.label}</span>
        </div>
      )}

      <JackpotTileJackpotChip tier={tier} size="carousel" />
    </div>
  )
}
