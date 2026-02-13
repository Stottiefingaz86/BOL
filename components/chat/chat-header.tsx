"use client"

import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/store/chatStore"
import { IconX, IconUsers } from "@tabler/icons-react"

function formatCount(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export default function ChatHeader({ onClose }: { onClose?: () => void }) {
  const { casinoOnlineCount, sportsOnlineCount, showUserList, setShowUserList } = useChatStore()

  const onlineCount = casinoOnlineCount + sportsOnlineCount

  return (
    <div className="flex-shrink-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-white">Community Chat</h3>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400">{formatCount(onlineCount)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowUserList(!showUserList)}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
              showUserList ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60 hover:bg-white/5"
            )}
          >
            <IconUsers className="w-4 h-4" />
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
