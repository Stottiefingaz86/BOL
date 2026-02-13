"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/store/chatStore"
import { IconCloudRain, IconClock } from "@tabler/icons-react"

export default function ChatRainBanner() {
  const { activeRain, joinRain } = useChatStore()
  const [timeLeft, setTimeLeft] = useState(0)
  const [hasJoined, setHasJoined] = useState(false)

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
  }, [activeRain])

  if (!activeRain || !activeRain.isActive) return null

  const handleJoin = () => {
    joinRain('current-user')
    setHasJoined(true)
  }

  return (
    <div className="mx-2 my-2 rounded-xl overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 animate-in slide-in-from-top-2">
      {/* Rain animation background */}
      <div className="relative px-3 py-2.5">
        {/* Rain drops decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-blue-400/20 rounded-full"
              style={{
                height: `${8 + Math.random() * 12}px`,
                left: `${10 + i * 16}%`,
                top: '-10px',
                animation: `rain-drop ${1 + Math.random() * 0.5}s linear infinite`,
                animationDelay: `${Math.random() * 1}s`,
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 animate-pulse">
            <IconCloudRain className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-blue-300">
              🌧️ Rain Event — ${activeRain.amount}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <IconClock className="w-3 h-3 text-blue-400/60" />
              <span className="text-[11px] text-blue-400/70">
                {timeLeft > 0 ? `${timeLeft}s remaining` : 'Distributing...'}
              </span>
              <span className="text-[10px] text-white/30 ml-1">
                {activeRain.participants.length} joined
              </span>
            </div>
          </div>
          <button
            onClick={handleJoin}
            disabled={hasJoined || timeLeft === 0}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
              hasJoined
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                : timeLeft === 0
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer shadow-lg shadow-blue-500/20"
            )}
          >
            {hasJoined ? '✓ Joined' : timeLeft === 0 ? 'Ended' : 'Join Rain'}
          </button>
        </div>
      </div>
    </div>
  )
}
