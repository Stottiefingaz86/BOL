'use client'

import { useEffect, useState } from 'react'
import { IconChevronDown, IconCoins, IconSettings } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  JACKPOT_TIERS,
  JACKPOT_PER_SPIN_ADDON,
  formatJackpotCompact,
  formatJackpotSpinAddon,
  type JackpotTierId,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { cn } from '@/lib/utils'

interface JackpotLauncherDropdownProps {
  layout?: 'pill' | 'strip' | 'inline' | 'mobile-bar' | 'header'
  className?: string
  tickerVisible?: boolean
  onTickerToggle?: () => void
}

const LAUNCHER_TIER_IDS: JackpotTierId[] = ['mini', 'minor', 'major', 'mega']

function formatStake(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function GlobalOptInToggle({
  enabled,
  onToggle,
  label,
  size = 'default',
}: {
  enabled: boolean
  onToggle: () => void
  label: string
  size?: 'small' | 'default' | 'large'
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label} ${enabled ? 'on' : 'off'}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        'relative shrink-0 rounded-full transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-white/25',
        size === 'large' ? 'h-6 w-11' : size === 'small' ? 'h-4 w-7' : 'h-5 w-9',
        enabled ? 'bg-[var(--ds-primary,#ee3536)]' : 'bg-white/25'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 rounded-full bg-white shadow-sm transition-[left] duration-200',
          size === 'large' ? 'h-5 w-5' : size === 'small' ? 'h-3 w-3' : 'h-4 w-4',
          enabled
            ? size === 'large'
              ? 'left-[22px]'
              : size === 'small'
                ? 'left-[14px]'
                : 'left-[18px]'
            : 'left-0.5'
        )}
      />
    </button>
  )
}

function useCountdownLabel(deadline: number) {
  const [label, setLabel] = useState(() => formatCountdown(deadline))

  useEffect(() => {
    const tick = () => setLabel(formatCountdown(deadline))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  return label
}

function formatCountdown(deadline: number) {
  const remaining = Math.max(0, deadline - Date.now())
  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const MUST_TIME_ACCENT = '#7dd3fc'
const MUST_VALUE_ACCENT = '#fcd34d'

function LiveJackpotRow({
  label,
  amount,
  accent,
  detail,
  meta,
}: {
  label: string
  amount: string
  accent?: string
  detail?: string
  meta?: string
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2">
      <span className="min-w-0">
        <span
          className="block text-xs font-semibold"
          style={accent ? { color: accent } : undefined}
        >
          {label}
          {meta ? (
            <span className="ml-1.5 font-normal tabular-nums text-white/40">{meta}</span>
          ) : null}
        </span>
        {detail ? (
          <span className="mt-0.5 block text-[10px] font-normal tabular-nums text-white/45">
            {detail}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-white">{amount}</span>
    </li>
  )
}

const TIER_HOW_TO_WIN: Record<
  (typeof LAUNCHER_TIER_IDS)[number],
  { blurb: string; how: string }
> = {
  mini: {
    blurb: 'Hits often — keeps the action going.',
    how: 'Won randomly on opted-in spins. Most frequent tier.',
  },
  minor: {
    blurb: 'Regular wins across the lobby.',
    how: 'Won randomly on opted-in spins. Mid-frequency wins with a larger pool than Mini.',
  },
  major: {
    blurb: 'Bigger pools, bigger moments.',
    how: 'Won randomly on opted-in spins. Less common than Mini/Minor; higher payout.',
  },
  mega: {
    blurb: 'Life-changing top tier.',
    how: 'Won randomly on opted-in spins. Rarest tier with the largest shared pool.',
  },
}

function JackpotOptInDetails({
  optedIn,
  toggleOptedIn,
  amounts,
  spinAddonTotal,
  tickerVisible,
  onTickerToggle,
}: {
  optedIn: boolean
  toggleOptedIn: () => void
  amounts: Record<string, number>
  spinAddonTotal: number
  tickerVisible?: boolean
  onTickerToggle?: () => void
}) {
  const launcherTiers = JACKPOT_TIERS.filter((t) => LAUNCHER_TIER_IDS.includes(t.id))
  const personalAmount = useJackpotStore((s) => s.personalAmount)
  const mustDropAmount = useJackpotStore((s) => s.mustDropAmount)
  const mustDropDeadline = useJackpotStore((s) => s.mustDropDeadline)
  const valueMustDropAmount = useJackpotStore((s) => s.valueMustDropAmount)
  const valueMustDropThreshold = useJackpotStore((s) => s.valueMustDropThreshold)
  const countdown = useCountdownLabel(mustDropDeadline)
  // Flat opt-in cost — one amount unlocks every jackpot.
  const totalAddon =
    spinAddonTotal > 0 ? spinAddonTotal : JACKPOT_PER_SPIN_ADDON

  return (
    <div className="max-h-[min(75vh,32rem)] overflow-y-auto text-sm">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-white">Jackpot opt-in</p>
            <p className="mt-1 text-xs leading-relaxed text-white/55">
              Opt in once to play for every jackpot. Adds{' '}
              <span className="font-semibold tabular-nums text-white/75">
                {formatJackpotSpinAddon(totalAddon)}
              </span>{' '}
              to your stake per spin.
            </p>
          </div>
          <GlobalOptInToggle
            enabled={optedIn}
            onToggle={toggleOptedIn}
            label="All jackpot tiers"
          />
        </div>
      </div>

      {onTickerToggle != null && (
        <div className="border-b border-white/10 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-white">Jackpot ticker</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                {tickerVisible
                  ? 'Hide the live amounts bar below the header'
                  : 'Show live jackpot amounts below the header'}
              </p>
            </div>
            <GlobalOptInToggle
              enabled={tickerVisible ?? true}
              onToggle={onTickerToggle}
              label="Jackpot ticker"
            />
          </div>
        </div>
      )}

      <div className="border-b border-white/10 px-4 py-3">
        <p className="mb-2 font-semibold text-white">Live jackpots</p>
        <ul className="space-y-1.5">
          <LiveJackpotRow
            label="Personal Pot"
            amount={formatJackpotCompact(personalAmount)}
          />
          <LiveJackpotRow
            label="Must Drop"
            accent={MUST_TIME_ACCENT}
            detail={`in ${countdown}`}
            amount={formatJackpotCompact(mustDropAmount)}
          />
          <LiveJackpotRow
            label="Must Drop"
            accent={MUST_VALUE_ACCENT}
            detail={`before ${formatJackpotCompact(valueMustDropThreshold)}`}
            amount={formatJackpotCompact(valueMustDropAmount)}
          />
          {launcherTiers.map((tier) => (
            <LiveJackpotRow
              key={tier.id}
              label={tier.label}
              accent={tier.accent}
              amount={formatJackpotCompact(amounts[tier.id])}
            />
          ))}
        </ul>
      </div>

      <div className="px-4 py-3">
        <p className="mb-2 font-semibold text-white">Jackpot info</p>
        <ul className="space-y-3">
          <li className="text-xs leading-relaxed text-white/55">
            <span className="font-medium text-white">Personal Pot:</span> Your own balance that
            grows as you play opted-in jackpot games. Paid only to you when your personal jackpot
            triggers on a qualifying spin.
          </li>
          <li className="text-xs leading-relaxed text-white/55">
            <span className="font-medium" style={{ color: MUST_TIME_ACCENT }}>
              Must Drop (time):
            </span>{' '}
            A shared pool that is guaranteed to drop before the countdown ends. Any opted-in player
            on a qualifying spin can win it when it drops.
          </li>
          <li className="text-xs leading-relaxed text-white/55">
            <span className="font-medium" style={{ color: MUST_VALUE_ACCENT }}>
              Must Drop (value):
            </span>{' '}
            A shared pool that is guaranteed to drop before it reaches the listed amount. Opted-in
            players can win it on a qualifying spin when the must-drop hits.
          </li>
          {launcherTiers.map((tier) => {
            const copy = TIER_HOW_TO_WIN[tier.id as (typeof LAUNCHER_TIER_IDS)[number]]
            return (
              <li key={tier.id} className="text-xs leading-relaxed text-white/55">
                <span className="font-medium" style={{ color: tier.accent }}>
                  {tier.label}:
                </span>{' '}
                {copy.blurb} {copy.how}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function DetailsMenu({
  compact = false,
  touchFriendly = false,
  triggerClassName,
  optedIn,
  toggleOptedIn,
  amounts,
  spinAddonTotal,
  tickerVisible,
  onTickerToggle,
}: {
  compact?: boolean
  touchFriendly?: boolean
  triggerClassName?: string
  optedIn: boolean
  toggleOptedIn: () => void
  amounts: Record<string, number>
  spinAddonTotal: number
  tickerVisible?: boolean
  onTickerToggle?: () => void
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Jackpot opt-in details"
          className={cn(
            'inline-flex shrink-0 items-center justify-center text-white/55 transition-colors outline-none',
            'hover:text-white/85 focus-visible:ring-2 focus-visible:ring-white/25',
            !triggerClassName &&
              cn(
                'rounded-md border border-white/10 bg-white/[0.04]',
                'hover:bg-white/[0.08]',
                compact ? (touchFriendly ? 'h-9 w-9' : 'h-6 w-6') : 'h-8 w-8'
              ),
            triggerClassName
          )}
        >
          <IconChevronDown
            className={cn(
              compact ? (touchFriendly ? 'h-4 w-4' : 'h-3 w-3') : 'h-4 w-4'
            )}
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        data-jackpot-launcher-dropdown
        className="jackpot-launcher-dropdown w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-0 text-white shadow-2xl"
      >
        <JackpotOptInDetails
          optedIn={optedIn}
          toggleOptedIn={toggleOptedIn}
          amounts={amounts}
          spinAddonTotal={spinAddonTotal}
          tickerVisible={tickerVisible}
          onTickerToggle={onTickerToggle}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderOptInControl({
  className,
  tickerVisible,
  onTickerToggle,
}: {
  className?: string
  tickerVisible?: boolean
  onTickerToggle?: () => void
}) {
  const optedIn = useJackpotStore((s) => s.optedIn)
  const toggleOptedIn = useJackpotStore((s) => s.toggleOptedIn)
  const amounts = useJackpotStore((s) => s.amounts)
  const spinAddonTotal = useJackpotStore((s) => s.getSpinAddonTotal())
  const addon = formatStake(
    spinAddonTotal > 0 ? spinAddonTotal : JACKPOT_PER_SPIN_ADDON
  )

  return (
    <DropdownMenu modal={false}>
      <div
        className={cn(
          'inline-flex h-7 shrink-0 items-center rounded-full border border-white/10 bg-white/[0.05] p-0.5',
          optedIn &&
            'border-[color-mix(in_srgb,var(--ds-primary,#ee3536)_35%,transparent)] bg-white/[0.07]',
          className
        )}
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Jackpot opt-in details"
            className={cn(
              'flex h-6 items-center gap-1.5 rounded-full pl-2.5 pr-2 text-left transition-colors',
              'hover:bg-white/[0.06] outline-none focus-visible:ring-2 focus-visible:ring-white/25',
              optedIn && 'pl-2 pr-1.5'
            )}
          >
            <span
              className={cn(
                'whitespace-nowrap text-[10px] font-medium leading-none text-white/75',
                optedIn && 'hidden'
              )}
            >
              Jackpot opt-in
            </span>
            {optedIn ? (
              <span className="whitespace-nowrap text-[10px] font-semibold tabular-nums leading-none text-white">
                +{addon}/spin
              </span>
            ) : null}
            <IconSettings
              className="h-3.5 w-3.5 shrink-0 text-white/45"
              aria-hidden
            />
          </button>
        </DropdownMenuTrigger>
        <span className="mx-0.5 h-3.5 w-px shrink-0 bg-white/10" aria-hidden />
        <div className="flex items-center pr-1">
          <GlobalOptInToggle
            enabled={optedIn}
            onToggle={toggleOptedIn}
            label="Jackpot opt-in"
            size="small"
          />
        </div>
      </div>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        data-jackpot-launcher-dropdown
        className="jackpot-launcher-dropdown w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-0 text-white shadow-2xl"
      >
        <JackpotOptInDetails
          optedIn={optedIn}
          toggleOptedIn={toggleOptedIn}
          amounts={amounts}
          spinAddonTotal={spinAddonTotal}
          tickerVisible={tickerVisible}
          onTickerToggle={onTickerToggle}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function JackpotLauncherDropdown({
  layout = 'pill',
  className,
  tickerVisible,
  onTickerToggle,
}: JackpotLauncherDropdownProps) {
  const optedIn = useJackpotStore((s) => s.optedIn)
  const toggleOptedIn = useJackpotStore((s) => s.toggleOptedIn)
  const amounts = useJackpotStore((s) => s.amounts)
  const spinAddonTotal = useJackpotStore((s) => s.getSpinAddonTotal())
  const addon = formatStake(
    spinAddonTotal > 0 ? spinAddonTotal : JACKPOT_PER_SPIN_ADDON
  )

  if (layout === 'header') {
    return (
      <HeaderOptInControl
        className={className}
        tickerVisible={tickerVisible}
        onTickerToggle={onTickerToggle}
      />
    )
  }

  if (layout === 'mobile-bar') {
    return (
      <div
        className={cn(
          'flex w-full min-w-0 items-center gap-3 border-t border-white/10 px-3 py-2.5',
          className
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium leading-tight text-white">Jackpot opt-in</p>
          {optedIn ? (
            <p className="mt-0.5 text-[11px] font-semibold tabular-nums leading-tight text-[var(--ds-primary,#ee3536)]">
              +{addon}/spin
            </p>
          ) : (
            <p className="mt-0.5 text-[11px] leading-tight text-white/45">Off</p>
          )}
        </div>
        <GlobalOptInToggle
          enabled={optedIn}
          onToggle={toggleOptedIn}
          label="Jackpot opt-in"
          size="large"
        />
        <DetailsMenu
          compact
          touchFriendly
          optedIn={optedIn}
          toggleOptedIn={toggleOptedIn}
          amounts={amounts}
          spinAddonTotal={spinAddonTotal}
        />
      </div>
    )
  }

  if (layout === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 sm:gap-2',
          className
        )}
      >
        <div className="flex min-w-0 flex-col items-end leading-tight">
          <span className="whitespace-nowrap text-[10px] font-medium text-white/90 sm:text-[11px]">
            Jackpot opt-in
          </span>
          {optedIn ? (
            <span className="whitespace-nowrap text-[9px] font-semibold tabular-nums text-[var(--ds-primary,#ee3536)] sm:text-[10px]">
              +{addon}/spin
            </span>
          ) : (
            <span className="whitespace-nowrap text-[9px] text-white/45 sm:text-[10px]">
              Off
            </span>
          )}
        </div>
        <GlobalOptInToggle
          enabled={optedIn}
          onToggle={toggleOptedIn}
          label="Jackpot opt-in"
        />
        <DetailsMenu
          compact
          optedIn={optedIn}
          toggleOptedIn={toggleOptedIn}
          amounts={amounts}
          spinAddonTotal={spinAddonTotal}
        />
      </div>
    )
  }

  if (layout === 'strip') {
    return (
      <div
        className={cn(
          'flex w-full min-w-0 items-center gap-2.5 border-t border-white/10 bg-black/25 px-3 py-2.5 sm:gap-3 sm:px-4',
          className
        )}
      >
        <IconCoins
          className={cn(
            'h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]',
            optedIn ? 'text-[var(--ds-primary,#ee3536)]' : 'text-white/40'
          )}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <span className="shrink-0 text-xs font-medium text-white/90 sm:text-sm">
            Jackpot opt-in
          </span>
          {optedIn ? (
            <span className="min-w-0 truncate rounded-md border border-white/10 bg-white/[0.08] px-2 py-0.5 text-xs font-semibold tabular-nums text-white">
              +{addon}/spin
            </span>
          ) : (
            <span className="text-xs text-white/45">Off</span>
          )}
        </div>
        <GlobalOptInToggle
          enabled={optedIn}
          onToggle={toggleOptedIn}
          label="Jackpot opt-in"
        />
        <DetailsMenu
          optedIn={optedIn}
          toggleOptedIn={toggleOptedIn}
          amounts={amounts}
          spinAddonTotal={spinAddonTotal}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1.5',
        optedIn &&
          'border-[color-mix(in_srgb,var(--ds-primary,#ee3536)_35%,transparent)] bg-white/[0.06]',
        className
      )}
    >
      <IconCoins
        className={cn(
          'h-4 w-4 shrink-0',
          optedIn ? 'text-[var(--ds-primary,#ee3536)]' : 'text-white/45'
        )}
        aria-hidden
      />
      <span className="text-xs font-medium text-white/90 whitespace-nowrap">
        Jackpot opt-in
      </span>
      {optedIn && (
        <span className="rounded-md border border-white/10 bg-white/[0.08] px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white whitespace-nowrap">
          +{addon}/spin
        </span>
      )}
      <GlobalOptInToggle
        enabled={optedIn}
        onToggle={toggleOptedIn}
        label="Jackpot opt-in"
      />
      <DetailsMenu
        optedIn={optedIn}
        toggleOptedIn={toggleOptedIn}
        amounts={amounts}
        spinAddonTotal={spinAddonTotal}
      />
    </div>
  )
}
