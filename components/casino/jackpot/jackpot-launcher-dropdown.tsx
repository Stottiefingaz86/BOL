'use client'

import { useMemo } from 'react'
import { IconChevronDown, IconCoins } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  JACKPOT_TIERS,
  formatJackpotCompact,
  formatJackpotSpinAddon,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { cn } from '@/lib/utils'

interface JackpotLauncherDropdownProps {
  compact?: boolean
  /** “JP” + chevron — compact mobile game bar (avoids deposit-like coin icon) */
  iconOnly?: boolean
  className?: string
}

function TierToggle({
  enabled,
  onToggle,
  label,
}: {
  enabled: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label} jackpots ${enabled ? 'on' : 'off'}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-white/25',
        enabled ? 'bg-[var(--ds-primary,#ee3536)]' : 'bg-white/25'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-[left] duration-200',
          enabled ? 'left-[18px]' : 'left-0.5'
        )}
      />
    </button>
  )
}

export function JackpotLauncherDropdown({
  compact = false,
  iconOnly = false,
  className,
}: JackpotLauncherDropdownProps) {
  const tierOptIns = useJackpotStore((s) => s.tierOptIns)
  const amounts = useJackpotStore((s) => s.amounts)
  const toggleTierOptIn = useJackpotStore((s) => s.toggleTierOptIn)
  const spinAddonTotal = useJackpotStore((s) => s.getSpinAddonTotal())
  const activeCount = useMemo(
    () => JACKPOT_TIERS.filter((t) => tierOptIns[t.id]).length,
    [tierOptIns]
  )

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={
            iconOnly
              ? activeCount > 0
                ? `Jackpot tiers, ${activeCount} active`
                : 'Jackpot tiers'
              : activeCount > 0
                ? `Jackpots, ${activeCount} tier${activeCount === 1 ? '' : 's'} active`
                : 'Jackpots'
          }
          className={cn(
            'inline-flex items-center rounded-full border border-white/10 transition-colors',
            'text-white/90 hover:bg-white/10 outline-none',
            'focus-visible:ring-2 focus-visible:ring-white/25',
            iconOnly
              ? 'relative h-7 shrink-0 gap-1 px-2 text-[11px] font-semibold tracking-wide'
              : compact
                ? 'h-7 gap-1 px-2 text-[11px] font-medium'
                : 'h-8 gap-1 px-2.5 text-xs font-medium',
            activeCount > 0 && 'border-[color-mix(in_srgb,var(--ds-primary,#ee3536)_40%,transparent)] bg-white/[0.06]',
            className
          )}
        >
          {iconOnly ? (
            <>
              <IconCoins
                className={cn(
                  'h-3 w-3 shrink-0',
                  activeCount > 0
                    ? 'text-[var(--ds-primary,#ee3536)]'
                    : 'text-white/50'
                )}
                aria-hidden
              />
              <span
                className={cn(
                  activeCount > 0
                    ? 'text-[var(--ds-primary,#ee3536)]'
                    : 'text-white/90'
                )}
              >
                JP
              </span>
              <IconChevronDown className="h-3 w-3 shrink-0 text-white/45" aria-hidden />
              {activeCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--ds-primary,#ee3536)] px-0.5 text-[8px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </>
          ) : (
            <>
              <IconCoins
                className={cn(
                  compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
                  activeCount > 0 ? 'text-[var(--ds-primary,#ee3536)]' : 'text-white/50'
                )}
              />
              <span>Jackpots</span>
              {activeCount > 0 && (
                <span className="tabular-nums text-white/50">
                  ({activeCount})
                </span>
              )}
              <IconChevronDown
                className={cn(compact ? 'h-3 w-3' : 'h-3.5 w-3.5', 'text-white/45')}
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        data-jackpot-launcher-dropdown
        className="jackpot-launcher-dropdown w-[min(18rem,calc(100vw-2rem))] border-white/10 bg-[#2d2d2d] p-0 text-white shadow-2xl"
      >
        <div className="border-b border-white/10 px-3 py-2.5">
          <p className="text-xs font-semibold text-white">Jackpot opt-in</p>
          <p className="text-[10px] text-white/50 leading-snug mt-0.5">
            Choose tiers to enter. Each adds to your stake per spin.
          </p>
        </div>
        <ul className="py-1 max-h-[min(320px,50vh)] overflow-y-auto">
          {JACKPOT_TIERS.map((tier) => {
            const enabled = tierOptIns[tier.id]
            return (
              <li
                key={tier.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: tier.accent }}
                    >
                      {tier.label}
                    </span>
                    <span className="text-[10px] text-white/40 tabular-nums">
                      {formatJackpotCompact(amounts[tier.id])}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/45 mt-0.5">
                    +{formatJackpotSpinAddon(tier.spinAddon)}/spin
                  </p>
                </div>
                <TierToggle
                  enabled={enabled}
                  onToggle={() => toggleTierOptIn(tier.id)}
                  label={tier.label}
                />
              </li>
            )
          })}
        </ul>
        <div className="border-t border-white/10 px-3 py-2.5 bg-white/[0.03]">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-white/55">Added to stake / spin</span>
            <span className="font-semibold text-white tabular-nums">
              {spinAddonTotal > 0
                ? `+${formatJackpotSpinAddon(spinAddonTotal)}`
                : '$0.00'}
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
