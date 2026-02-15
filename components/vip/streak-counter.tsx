'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconShare } from '@tabler/icons-react'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const

interface StreakCounterProps {
  /** Current streak count in days */
  streakDays?: number
  /** Which days of the current week are completed (0=Mon, 6=Sun) */
  completedDays?: number[]
  /** Current day index in the week (0=Mon, 6=Sun) */
  currentDayIndex?: number
  /** Whether the weekly reward can be claimed */
  canClaimReward?: boolean
  /** Reward amount when claiming a full week */
  rewardAmount?: number
  /** Called when user claims the weekly reward */
  onClaimReward?: () => void
  /** Called when user taps share */
  onShare?: () => void
}

export function StreakCounter({
  streakDays = 25,
  completedDays = [0, 1, 2, 3],
  currentDayIndex = 4,
  canClaimReward = false,
  rewardAmount = 10,
  onClaimReward,
  onShare,
}: StreakCounterProps) {
  const [claimed, setClaimed] = useState(false)

  const handleClaim = useCallback(() => {
    setClaimed(true)
    onClaimReward?.()
  }, [onClaimReward])

  return (
    <div className="h-full">
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 space-y-3 h-full">
        {/* Main streak card */}
        <div className="rounded-lg bg-white/[0.06] border border-white/[0.06] p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Big streak number */}
            <div className="relative">
              <motion.span
                key={streakDays}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[40px] font-bold leading-none text-white tracking-tight"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {streakDays}
              </motion.span>
              {/* Fire emoji overlapping bottom-right */}
              <span className="absolute -bottom-0.5 -right-2.5 text-lg">🔥</span>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-0">
              <span className="text-white font-semibold text-sm leading-tight">Days Streak!!</span>
              <span className="text-white/50 text-xs leading-tight">Every day counts!</span>
              <span className="text-white/50 text-xs leading-tight">Keep the moment going!</span>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={onShare}
            className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <IconShare className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>

        {/* Weekly tracker */}
        <div className="space-y-2">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-white/40">
                {day}
              </div>
            ))}
          </div>

          {/* Day circles with gradient bar behind */}
          <div className="relative">
            {/* Grey gradient bar behind the circles */}
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 rounded-full"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.01) 100%)',
              }}
            />

            <div className="relative grid grid-cols-7 gap-1">
              {DAYS.map((_, i) => {
                const isCompleted = completedDays.includes(i)
                const isCurrent = i === currentDayIndex

                return (
                  <div key={i} className="flex items-center justify-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCompleted ? 1 : isCurrent ? 1 : 0.9,
                      }}
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${isCompleted
                          ? 'bg-white/[0.06] border border-white/[0.08]'
                          : isCurrent
                            ? 'bg-transparent border-2 border-white/30'
                            : 'bg-transparent border border-white/[0.06]'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <span className="text-sm">🔥</span>
                      ) : null}
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Claim reward button — only shows when all 7 days are completed */}
        <AnimatePresence>
          {canClaimReward && !claimed && (
            <motion.button
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onClick={handleClaim}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              Claim ${rewardAmount.toFixed(2)} Reward 🎉
            </motion.button>
          )}
          {claimed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium text-center"
            >
              Reward Claimed! ✅
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
