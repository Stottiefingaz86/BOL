"use client"

import { cn } from "@/lib/utils"
import { useChatStore, ChatRoom } from "@/lib/store/chatStore"
import { IconX, IconUsers, IconBallFootball, IconDice } from "@tabler/icons-react"

function formatCount(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export default function ChatHeader({ onClose }: { onClose?: () => void }) {
  const {
    activeRoom,
    setActiveRoom,
    casinoOnlineCount,
    sportsOnlineCount,
    showUserList,
    setShowUserList,
  } = useChatStore()

  const onlineCount = activeRoom === 'casino' ? casinoOnlineCount : sportsOnlineCount

  return (
    <div className="flex-shrink-0 border-b border-white/10">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          {/* Segmented toggle */}
          <div className="flex items-center h-7 rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden">
            <button
              onClick={() => setActiveRoom('sports')}
              className={cn(
                "flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium transition-all duration-150",
                activeRoom === 'sports'
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <IconBallFootball className="w-3.5 h-3.5" strokeWidth={1.8} />
              Sports Chat
            </button>
            {/* Vertical separator */}
            <div className="w-px h-3.5 bg-white/10 flex-shrink-0" />
            <button
              onClick={() => setActiveRoom('casino')}
              className={cn(
                "flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium transition-all duration-150",
                activeRoom === 'casino'
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <IconDice className="w-3.5 h-3.5" strokeWidth={1.8} />
              Casino Chat
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Users icon with count */}
          <button
            onClick={() => setShowUserList(!showUserList)}
            className={cn(
              "flex items-center gap-1 px-1.5 h-7 rounded-lg transition-colors",
              showUserList ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60 hover:bg-white/5"
            )}
          >
            <IconUsers className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">{formatCount(onlineCount)}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
