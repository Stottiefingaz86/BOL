'use client'

import Link from 'next/link'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JACKPOT_TIERS } from '@/lib/jackpot/constants'
import { JackpotLiveAmount } from '@/components/casino/jackpot/jackpot-live-amount'
import { JackpotSwitch } from '@/components/casino/jackpot/jackpot-switch'
import { cn } from '@/lib/utils'
import { IconChevronRight, IconCoins } from '@tabler/icons-react'

interface JackpotWidgetProps {
  variant?: 'banner' | 'inline'
  className?: string
  onViewAll?: () => void
}

/** Compact jackpot summary for sidebars, cards, or promo slots */
export function JackpotWidget({
  variant = 'banner',
  className,
  onViewAll,
}: JackpotWidgetProps) {
  const amounts = useJackpotStore((s) => s.amounts)
  const network = amounts.network
  const mega = amounts.mega

  const content = (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10',
        variant === 'banner' ? 'p-4' : 'p-3',
        className
      )}
      style={{
        background:
          'linear-gradient(145deg, color-mix(in srgb, var(--ds-primary, #ee3536) 10%, rgba(255,255,255,0.04)) 0%, rgba(255,255,255,0.02) 100%)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <IconCoins className="w-4 h-4 text-[var(--ds-primary,#ee3536)]" />
          <span className="text-sm font-semibold text-white">Jackpots</span>
        </div>
        <JackpotSwitch variant="pill" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {JACKPOT_TIERS.slice(0, 4).map((tier) => (
          <div key={tier.id} className="min-w-0">
            <p
              className="text-[9px] font-semibold tracking-wider uppercase mb-0.5"
              style={{ color: tier.accent }}
            >
              {tier.label}
            </p>
            <JackpotLiveAmount value={amounts[tier.id]} size="sm" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div>
          <p className="text-[9px] text-white/40 uppercase tracking-wider">
            Network
          </p>
          <JackpotLiveAmount value={network} size="sm" />
        </div>
        <div className="text-right">
          <p className="text-[9px] text-amber-400/80 uppercase tracking-wider">
            Mega
          </p>
          <JackpotLiveAmount value={mega} size="sm" accent="#fbbf24" />
        </div>
      </div>
      {(onViewAll || variant === 'banner') && (
        <div className="mt-3 flex items-center justify-end">
          {onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs text-white/60 hover:text-white flex items-center gap-0.5"
            >
              Details
              <IconChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/casino/jackpots"
              className="text-xs text-white/60 hover:text-white flex items-center gap-0.5"
            >
              Details
              <IconChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  )

  return content
}
