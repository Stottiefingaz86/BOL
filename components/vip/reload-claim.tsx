'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconCheck, IconCurrencyDollar } from '@tabler/icons-react'

interface ReloadClaimProps {
  reloadAmount?: number
  totalDays?: number
  completedDays?: number
  expiresAt?: string
  onClaim?: () => void
}

export function ReloadClaim({
  reloadAmount = 25.00,
  totalDays = 5,
  completedDays = 2,
  expiresAt = '24/25/2024, 8:00 PM ET',
  onClaim,
}: ReloadClaimProps) {
  const [claimed, setClaimed] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 23, minutes: 59, seconds: 59 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) return prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0 }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const timerExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0
  const canClaim = timerExpired && !claimed

  const handleClaim = useCallback(() => {
    if (!canClaim) return
    setClaimed(true)
    onClaim?.()
  }, [canClaim, onClaim])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="space-y-4">
      {/* Main card */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 space-y-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-white">Claim your Reload:</h3>

        {/* Countdown Timer */}
        <div className="rounded-lg bg-white/[0.05] border border-white/[0.06] p-4">
          <div className="flex items-center justify-center gap-3">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Seconds' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white tabular-nums leading-none mb-1">
                  {pad(item.value)}
                </div>
                <div className="text-[10px] text-white/50 font-medium uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day Tracker — matches streak counter style */}
        <div className="space-y-2">
          {/* Day labels */}
          <div className={`grid gap-1`} style={{ gridTemplateColumns: `repeat(${totalDays}, 1fr)` }}>
            {Array.from({ length: totalDays }, (_, i) => (
              <div key={i} className="text-center text-xs font-medium text-white/40">
                {i + 1}d
              </div>
            ))}
          </div>

          {/* Day circles with gradient bar behind */}
          <div className="relative">
            {/* Gradient bar behind the circles */}
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 rounded-full"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.01) 100%)',
              }}
            />

            <div className={`relative grid gap-1`} style={{ gridTemplateColumns: `repeat(${totalDays}, 1fr)` }}>
              {Array.from({ length: totalDays }, (_, i) => {
                const isCompleted = i < completedDays
                const isCurrent = i === completedDays

                return (
                  <div key={i} className="flex items-center justify-center">
                    <motion.div
                      initial={false}
                      animate={{ scale: isCompleted ? 1 : isCurrent ? 1 : 0.9 }}
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
                        <IconCheck className="w-3.5 h-3.5 text-green-400" strokeWidth={3} />
                      ) : isCurrent ? (
                        <IconCurrencyDollar className="w-3.5 h-3.5 text-[#b8d435]" strokeWidth={2} />
                      ) : (
                        <IconCurrencyDollar className="w-3.5 h-3.5 text-white/20" strokeWidth={2} />
                      )}
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className={`
          rounded-lg p-3 text-center font-semibold text-white text-lg
          ${canClaim
            ? 'bg-white/[0.06] border border-white/[0.08]'
            : 'bg-white/[0.04] border border-white/[0.06]'
          }
        `}>
          ${reloadAmount.toFixed(2)} USD
        </div>

        {/* Claim Button */}
        <AnimatePresence mode="wait">
          {claimed ? (
            <motion.div
              key="claimed"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold text-center"
            >
              Reload Claimed! ✅
            </motion.div>
          ) : (
            <motion.button
              key="claim-btn"
              onClick={handleClaim}
              disabled={!canClaim}
              className={`
                w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all
                ${canClaim
                  ? 'bg-[#b8d435] hover:bg-[#c5e03a] text-black cursor-pointer'
                  : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
                }
              `}
            >
              Claim Now
            </motion.button>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Expiry */}
        <p className="text-xs text-white/40 text-center">
          Reload expires at {expiresAt}
        </p>
      </div>
    </div>
  )
}
