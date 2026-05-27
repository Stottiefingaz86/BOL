'use client'

import { motion } from 'framer-motion'
import type { JackpotTierConfig } from '@/lib/jackpot/constants'
import { JackpotLiveAmount } from '@/components/casino/jackpot/jackpot-live-amount'
import { cn } from '@/lib/utils'
import { IconTrophy } from '@tabler/icons-react'

interface JackpotTierCardProps {
  tier: JackpotTierConfig
  amount: number
  variant?: 'default' | 'compact' | 'carousel'
  className?: string
  onClick?: () => void
}

export function JackpotTierCard({
  tier,
  amount,
  variant = 'default',
  className,
  onClick,
}: JackpotTierCardProps) {
  const isCompact = variant === 'compact' || variant === 'carousel'
  const isCarousel = variant === 'carousel'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative text-left overflow-hidden rounded-xl border transition-colors',
        isCarousel ? 'w-[200px] h-[148px]' : isCompact ? 'w-full' : 'w-full min-h-[120px]',
        !isCompact && 'min-h-[132px]',
        className
      )}
      style={{
        borderColor: tier.borderColor,
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top right, ${tier.accentMuted}, transparent 65%)`,
        }}
      />
      <div
        className={cn(
          'relative z-10 flex flex-col h-full',
          isCompact ? 'p-3 gap-1.5' : 'p-4 gap-2'
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: tier.accent }}
          >
            {tier.shortLabel}
          </span>
          <IconTrophy
            className="w-3.5 h-3.5 opacity-50 group-hover:opacity-80 transition-opacity"
            style={{ color: tier.accent }}
          />
        </div>
        <JackpotLiveAmount
          value={amount}
          size={isCarousel ? 'md' : isCompact ? 'sm' : 'md'}
          accent={tier.id === 'network' ? undefined : tier.accent}
        />
        {!isCompact && (
          <p className="text-[11px] text-white/45 leading-snug line-clamp-2">
            {tier.description}
          </p>
        )}
      </div>
      <span
        className="absolute bottom-0 left-0 right-0 h-px opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)`,
        }}
      />
    </motion.button>
  )
}
