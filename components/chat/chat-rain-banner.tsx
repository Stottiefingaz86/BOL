"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/store/chatStore"
import { IconCloudRain, IconClock } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ChatRainBanner() {
  const { activeRain, joinRain } = useChatStore()
  const [timeLeft, setTimeLeft] = useState(0)
  const [hasJoined, setHasJoined] = useState(false)
  const lastRainId = useRef<string | null>(null)

  // Reset hasJoined when a new rain event starts
  useEffect(() => {
    if (!activeRain) {
      lastRainId.current = null
      setHasJoined(false)
      return
    }

    if (activeRain.id !== lastRainId.current) {
      lastRainId.current = activeRain.id
      setHasJoined(activeRain.participants.includes('current-user'))
      setTimeLeft(activeRain.countdown)
    }
  }, [activeRain])

  // Countdown timer
  useEffect(() => {
    if (!activeRain) return
    setTimeLeft(activeRain.countdown)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeRain?.id])

  // Keep hasJoined in sync with participants
  useEffect(() => {
    if (activeRain && activeRain.participants.includes('current-user') && !hasJoined) {
      setHasJoined(true)
    }
  }, [activeRain?.participants?.length])

  const handleJoin = () => {
    joinRain('current-user')
    setHasJoined(true)
  }

  if (!activeRain || !activeRain.isActive) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="mx-2 mb-2 rounded-xl overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 shadow-lg shadow-blue-500/10"
      >
        {/* Rain animation background */}
        <div className="relative px-3 py-2.5">
          {/* Rain drops decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-blue-400/40 rounded-full"
                style={{
                  height: `${8 + Math.random() * 12}px`,
                  left: `${3 + i * 10}%`,
                  top: '-10px',
                  animation: `rain-drop ${0.8 + Math.random() * 0.6}s linear infinite`,
                  animationDelay: `${Math.random() * 1}s`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 relative z-10">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 animate-pulse flex-shrink-0">
              <IconCloudRain className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-blue-200">
                🌧️ Rain — ${activeRain.amount}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <IconClock className="w-3 h-3 text-blue-400/60" />
                <span className="text-[11px] text-blue-400/80 font-medium">
                  {timeLeft > 0 ? `${timeLeft}s left` : 'Distributing...'}
                </span>
                <span className="text-[10px] text-white/40 ml-1">
                  {activeRain.participants.length} joined
                </span>
              </div>
            </div>
            <button
              onClick={handleJoin}
              disabled={hasJoined || timeLeft === 0}
              className={cn(
                "px-4 py-2 rounded-lg text-[12px] font-bold transition-all flex-shrink-0",
                hasJoined
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : timeLeft === 0
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600 cursor-pointer shadow-lg shadow-blue-500/30 animate-pulse"
              )}
            >
              {hasJoined ? '✓ Joined' : timeLeft === 0 ? 'Ended' : '🌧️ JOIN'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
