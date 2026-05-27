'use client'

import { useJackpotStore } from '@/lib/store/jackpotStore'
import { JACKPOT_PER_SPIN_ADDON } from '@/lib/jackpot/constants'
import { cn } from '@/lib/utils'
import { IconCoins } from '@tabler/icons-react'

interface JackpotSwitchProps {
  variant?: 'launcher' | 'pill' | 'section'
  /** Coin-only pill (tight game header) */
  minimal?: boolean
  baseStake?: number
  className?: string
}

function formatStake(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const COMPACT_W = 'w-[188px]'

/** Opt-in switch — compact expanded strip in headers, coin-only in game bar */
export function JackpotSwitch({
  variant = 'pill',
  minimal = false,
  baseStake = 1,
  className,
}: JackpotSwitchProps) {
  const optedIn = useJackpotStore((s) => s.optedIn)
  const toggleOptedIn = useJackpotStore((s) => s.toggleOptedIn)

  const isLauncher = variant === 'launcher' || variant === 'section'
  const addon = formatStake(JACKPOT_PER_SPIN_ADDON)
  const total = formatStake(baseStake + (optedIn ? JACKPOT_PER_SPIN_ADDON : 0))

  if (isLauncher && !minimal) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={optedIn}
        aria-label={
          optedIn
            ? `Jackpots on, ${addon} per spin, ${total} total`
            : `Jackpots off, add ${addon} per spin to opt in`
        }
        onClick={(e) => {
          e.stopPropagation()
          toggleOptedIn()
        }}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05]',
          'px-2 h-8 flex-shrink-0 transition-colors duration-200 hover:bg-white/[0.08]',
          'outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]',
          COMPACT_W,
          className
        )}
      >
        <IconCoins
          className={cn(
            'w-3.5 h-3.5 flex-shrink-0',
            optedIn ? 'text-[var(--ds-primary,#ee3536)]' : 'text-white/45'
          )}
        />
        <span className="flex-1 min-w-0 text-[10px] leading-none text-left truncate text-white/80">
          {optedIn ? (
            <>
              <span className="text-white font-medium">On</span>
              <span className="text-white/45"> · +{addon}/spin</span>
            </>
          ) : (
            <>
              <span className="text-white/55">Off</span>
              <span className="text-white/40"> · +{addon}/spin</span>
            </>
          )}
        </span>
        <span
          className={cn(
            'relative flex-shrink-0 w-7 h-3.5 rounded-full transition-colors',
            optedIn ? 'bg-[var(--ds-primary,#ee3536)]' : 'bg-white/25'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-[left] duration-200',
              optedIn ? 'left-[14px]' : 'left-0.5'
            )}
          />
        </span>
      </button>
    )
  }

  if (isLauncher) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={optedIn}
        aria-label={optedIn ? 'Jackpots on' : 'Jackpots off'}
        onClick={(e) => {
          e.stopPropagation()
          toggleOptedIn()
        }}
        className={cn(
          'flex items-center gap-1 rounded-full border border-white/10 transition-colors duration-200',
          'flex-shrink-0 px-1.5 h-7 w-[52px] outline-none',
          'focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2d2d2d]',
          optedIn
            ? 'bg-white/[0.06] border-[color-mix(in_srgb,var(--ds-primary,#ee3536)_35%,transparent)]'
            : 'bg-transparent hover:bg-white/5',
          className
        )}
      >
        <IconCoins
          className={cn(
            'w-3 h-3 flex-shrink-0',
            optedIn ? 'text-[var(--ds-primary,#ee3536)]' : 'text-white/40'
          )}
        />
        <span
          className={cn(
            'relative flex-shrink-0 w-7 h-3.5 rounded-full transition-colors',
            optedIn ? 'bg-[var(--ds-primary,#ee3536)]' : 'bg-white/25'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-[left] duration-200',
              optedIn ? 'left-[14px]' : 'left-0.5'
            )}
          />
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optedIn}
      aria-label={optedIn ? 'Jackpots on' : 'Jackpots off'}
      onClick={(e) => {
        e.stopPropagation()
        toggleOptedIn()
      }}
      className={cn(
        'relative flex-shrink-0 w-9 h-5 rounded-full transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2',
        optedIn ? 'bg-[var(--ds-primary,#ee3536)]' : 'bg-white/20',
        className
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-[left] duration-200',
          optedIn ? 'left-[18px]' : 'left-0.5'
        )}
      />
    </button>
  )
}
