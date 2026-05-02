'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconTrophy,
  IconTicket,
  IconTargetArrow,
  IconChevronRight,
  IconChevronDown,
  IconRocket,
  type Icon as TablerIcon,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// SidebarPromos
// Promotion stack rendered at the top of the product sidebars (casino,
// sports, etc.). Modeled on the "Daily Race" pattern from competitor sites
// — a glanceable list of active money pools the player can join.
//
// This is intentionally self-contained so it can be dropped in / removed
// from any sidebar with a single line change.
// ---------------------------------------------------------------------------

type PromoTone = 'amber' | 'red' | 'violet' | 'emerald' | 'sky'

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
}

// Mock end dates relative to "now" so the timers always read sensibly during
// design QA. In production these would come from a promotions API.
function buildPromoData(): PromoItem[] {
  const now = new Date()

  // Daily race ends at next midnight UTC
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

  // Full-page Promotions on casino (`vipRewardsPage=true`); `section` must match
  // `vipActiveSidebarItem` ids (see casino sidebar). Does not open the VIP hub drawer.
  const promoPage = (section: string) =>
    `/casino?vipRewardsPage=true&section=${encodeURIComponent(section)}`

  return [
    {
      id: 'daily-race',
      prize: '$25K',
      label: 'Daily Race',
      icon: IconTrophy,
      tone: 'amber',
      endsAt: nextMidnightUtc,
      href: promoPage('Cash Races'),
    },
    {
      id: 'weekly-raffle',
      prize: '$20K',
      label: 'Weekly Raffle',
      icon: IconTicket,
      tone: 'emerald',
      badge: '5d',
      href: promoPage('Raffles'),
    },
    {
      id: 'challenges',
      prize: '$31K',
      label: 'Challenges',
      icon: IconTargetArrow,
      tone: 'sky',
      badge: '18 active',
      href: promoPage('Challenges'),
    },
  ]
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

const COLLAPSE_STORAGE_KEY = 'sidebar-promos-open'

export function SidebarPromos({
  collapsed = false,
  items,
  onItemClick,
}: SidebarPromosProps) {
  const router = useRouter()
  const [data] = useState(() => items ?? buildPromoData())
  const [isOpen, setIsOpen] = useState(true)

  const handleItemClick = (item: PromoItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      router.push(item.href)
    }
    onItemClick?.(item)
  }

  // Restore the user's last open/closed preference once on mount.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY)
      if (stored !== null) setIsOpen(stored === 'true')
    } catch {
      /* ignore — localStorage may be unavailable */
    }
  }, [])

  const toggle = () => {
    setIsOpen((curr) => {
      const next = !curr
      try {
        window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  // When the surrounding sidebar collapses to icon-only mode, hide the
  // promo block entirely — there's no good way to represent it as icons
  // without re-introducing label clutter.
  if (collapsed) return null

  return (
    <div className="px-2 pt-2 pb-1 min-w-0 max-w-full">
      <div className="rounded-lg bg-white/[0.025] border border-white/[0.06] overflow-hidden min-w-0">
        {/* Toggle bar — rocket + "Promotions" + chevron (matches Promotion nav). */}
        <button
          type="button"
          onClick={toggle}
          aria-label={isOpen ? 'Collapse promotions' : 'Expand promotions'}
          aria-expanded={isOpen}
          className="w-full h-9 flex items-center gap-2 px-2.5 hover:bg-white/[0.03] transition-colors"
        >
          <IconRocket
            strokeWidth={1.8}
            className="w-4 h-4 text-white/55 flex-shrink-0"
          />
          <span className="flex-1 text-left text-[13px] font-medium text-white/75">
            Promotions
          </span>
          <IconChevronDown
            strokeWidth={2}
            className={cn(
              'w-3.5 h-3.5 text-white/45 transition-transform duration-200',
              !isOpen && '-rotate-90'
            )}
          />
        </button>

        {/* Collapsible body */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="promos-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-0.5 px-1 pb-1">
                {data.map((item) => (
                  <PromoRow
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                  />
                ))}

                <button
                  type="button"
                  onClick={() =>
                    router.push('/promotions')
                  }
                  className="mt-1 mx-1 flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <span className="w-full text-left">All Promotions</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function PromoRow({ item, onClick }: { item: PromoItem; onClick?: () => void }) {
  const styles = TONE_STYLES[item.tone]
  const Icon = item.icon
  const countdown = useCountdown(item.endsAt)
  const badge = countdown ?? item.badge

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full max-w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors text-left overflow-hidden"
    >
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: styles.iconBg }}
      >
        <Icon
          strokeWidth={1.8}
          className="w-4 h-4"
          style={{ color: styles.iconColor }}
        />
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="text-sm font-bold text-white leading-tight tabular-nums truncate">
          {item.prize}
        </div>
        <div className="text-[11px] text-white/55 leading-tight truncate">
          {item.label}
        </div>
      </div>

      {badge && (
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums whitespace-nowrap flex-shrink-0"
          style={{
            background: styles.badgeBg,
            color: styles.badgeText,
          }}
        >
          {badge}
        </span>
      )}

      <IconChevronRight
        className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 -ml-0.5"
      />
    </button>
  )
}
