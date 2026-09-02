'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconTrophy,
  IconChevronRight,
  IconHourglass,
  IconFlame,
  type Icon as TablerIcon,
} from '@tabler/icons-react'
import { formatJackpotCompact } from '@/lib/jackpot/constants'
import { useActiveMustDrop } from '@/lib/jackpot/use-active-must-drop'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// SidebarPromos
// Glanceable promo rows at the top of product sidebars (Daily Race, Must Drop).
// ---------------------------------------------------------------------------

type PromoTone = 'amber' | 'red' | 'violet' | 'emerald' | 'sky' | 'orange'

interface PromoItem {
  id: string
  prize: string
  label: string
  icon: TablerIcon
  tone: PromoTone
  /** Static badge (e.g. "4d", "18 active"). Ignored when `endsAt` is set. */
  badge?: string
  /** When set, renders a live countdown to this future Date instead of badge. */
  endsAt?: Date
  /** Default URL to navigate to when clicked. Overridden by `onClick`. */
  href?: string
  onClick?: () => void
  heatingUp?: boolean
  critical?: boolean
}

const TONE_STYLES: Record<
  PromoTone,
  { iconBg: string; iconColor: string; badgeBg: string; badgeText: string }
> = {
  amber: {
    iconBg: 'rgba(245, 158, 11, 0.12)',
    iconColor: '#fbbf24',
    badgeBg: 'rgba(245, 158, 11, 0.14)',
    badgeText: '#fcd34d',
  },
  red: {
    iconBg: 'rgba(238, 53, 54, 0.14)',
    iconColor: '#ff5b5c',
    badgeBg: 'rgba(238, 53, 54, 0.14)',
    badgeText: '#ffb1b2',
  },
  violet: {
    iconBg: 'rgba(139, 92, 246, 0.14)',
    iconColor: '#c4b5fd',
    badgeBg: 'rgba(139, 92, 246, 0.14)',
    badgeText: '#ddd6fe',
  },
  emerald: {
    iconBg: 'rgba(16, 185, 129, 0.14)',
    iconColor: '#6ee7b7',
    badgeBg: 'rgba(16, 185, 129, 0.14)',
    badgeText: '#a7f3d0',
  },
  sky: {
    iconBg: 'rgba(14, 165, 233, 0.14)',
    iconColor: '#7dd3fc',
    badgeBg: 'rgba(14, 165, 233, 0.14)',
    badgeText: '#bae6fd',
  },
  orange: {
    iconBg: 'rgba(251, 146, 60, 0.14)',
    iconColor: '#fb923c',
    badgeBg: 'rgba(251, 146, 60, 0.16)',
    badgeText: '#fdba74',
  },
}

function buildDailyRaceItem(): PromoItem {
  const now = new Date()
  const nextMidnightUtc = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0
    )
  )

  return {
    id: 'daily-race',
    prize: '$25K',
    label: 'Daily Race',
    icon: IconTrophy,
    tone: 'amber',
    endsAt: nextMidnightUtc,
    onClick: () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('vip:open-drawer', { detail: { tab: 'Daily Races' } })
        )
      }
    },
  }
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function useCountdown(target?: Date): string | null {
  const [, force] = useState(0)
  useEffect(() => {
    if (!target) return
    const id = window.setInterval(() => force((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [target])

  if (!target) return null
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return '00:00:00'
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`
}

interface SidebarPromosProps {
  /** When true (sidebar collapsed to icons-only), the promos hide entirely. */
  collapsed?: boolean
  /** Override the default promo list. */
  items?: PromoItem[]
  onItemClick?: (item: PromoItem) => void
}

export function SidebarPromos({
  collapsed = false,
  items,
  onItemClick,
}: SidebarPromosProps) {
  const router = useRouter()
  const mustDrop = useActiveMustDrop()
  const [dailyRace] = useState(buildDailyRaceItem)

  const data = useMemo(() => {
    if (items) return items

    const next: PromoItem[] = [dailyRace]
    if (mustDrop.isVisible && !mustDrop.isExiting) {
      next.push({
        id: 'must-drop',
        prize: formatJackpotCompact(mustDrop.displayAmount),
        label: 'Must Drop',
        icon: mustDrop.isHeatingUp ? IconFlame : IconHourglass,
        tone: mustDrop.isHeatingUp ? 'orange' : 'sky',
        badge: mustDrop.countdown || undefined,
        heatingUp: mustDrop.isHeatingUp && !mustDrop.isFinale,
        critical: mustDrop.isCritical && !mustDrop.isFinale,
        onClick: () => {
          router.push('/casino?tab=jackpots')
        },
      })
    }
    return next
  }, [
    dailyRace,
    items,
    mustDrop.countdown,
    mustDrop.displayAmount,
    mustDrop.isCritical,
    mustDrop.isExiting,
    mustDrop.isFinale,
    mustDrop.isHeatingUp,
    mustDrop.isVisible,
    router,
  ])

  const handleItemClick = (item: PromoItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      router.push(item.href)
    }
    onItemClick?.(item)
  }

  if (collapsed) return null

  return (
    <div className="px-2 pt-2 pb-1 min-w-0 max-w-full">
      <div className="min-w-0 overflow-visible rounded-lg border border-white/[0.06] bg-white/[0.025]">
        <div className="flex flex-col gap-0.5 px-1 py-1">
          {data.map((item) => (
            <PromoRow
              key={item.id}
              item={item}
              onClick={() => handleItemClick(item)}
            />
          ))}

          <button
            type="button"
            onClick={() => router.push('/casino?vipRewardsPage=true')}
            className="mx-1 mt-0.5 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <span className="w-full text-left">All Promotions</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function PromoRow({ item, onClick }: { item: PromoItem; onClick?: () => void }) {
  const styles = TONE_STYLES[item.tone]
  const Icon = item.icon
  const countdown = useCountdown(item.endsAt)
  const badge = countdown ?? item.badge
  const heating = Boolean(item.heatingUp)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex w-full max-w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white/[0.04]',
        heating && 'jackpot-must-drop-heat',
        heating &&
          (item.critical
            ? 'jackpot-must-drop-shake-intense'
            : 'jackpot-must-drop-shake')
      )}
    >
      {heating ? (
        <span
          className="jackpot-must-drop-flames pointer-events-none absolute inset-0"
          aria-hidden
        />
      ) : null}

      <div
        className="relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-md"
        style={{ background: styles.iconBg }}
      >
        <Icon
          strokeWidth={1.8}
          className={cn('size-4', heating && 'jackpot-must-drop-label-heat')}
          style={{ color: styles.iconColor }}
        />
      </div>

      <div className="relative z-[1] min-w-0 flex-1 overflow-hidden">
        <div
          className={cn(
            'truncate text-sm font-bold leading-tight tabular-nums text-white',
            heating && 'jackpot-must-drop-amount-heat'
          )}
        >
          {item.prize}
        </div>
        <div
          className={cn(
            'truncate text-[11px] leading-tight text-white/55',
            heating && 'jackpot-must-drop-label-heat'
          )}
        >
          {item.label}
        </div>
      </div>

      {badge ? (
        <span
          className={cn(
            'relative z-[1] shrink-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
            heating && 'jackpot-must-drop-countdown-heat'
          )}
          style={
            heating
              ? undefined
              : {
                  background: styles.badgeBg,
                  color: styles.badgeText,
                }
          }
        >
          {badge}
        </span>
      ) : null}

      <IconChevronRight className="relative z-[1] -ml-0.5 size-3.5 shrink-0 text-white/20 transition-colors group-hover:text-white/50" />
    </button>
  )
}
