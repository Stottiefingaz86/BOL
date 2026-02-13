"use client"

import { cn } from "@/lib/utils"
import { useChatStore, type ChatRoom } from "@/lib/store/chatStore"
import { IconX, IconUsers, IconDice5, IconBallFootball } from "@tabler/icons-react"

function formatCount(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export default function ChatHeader({ onClose }: { onClose?: () => void }) {
  const { activeRoom, setActiveRoom, casinoOnlineCount, sportsOnlineCount, showUserList, setShowUserList } = useChatStore()

  const onlineCount = activeRoom === 'casino' ? casinoOnlineCount : sportsOnlineCount

  const rooms: { id: ChatRoom; label: string; icon: React.ReactNode }[] = [
    { id: 'casino', label: 'Casino', icon: <IconDice5 className="w-3.5 h-3.5" /> },
    { id: 'sports', label: 'Sports', icon: <IconBallFootball className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="flex-shrink-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-white">Chat</h3>
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

      {/* Room Tabs */}
      <div className="flex items-center px-2 py-1.5 gap-1 border-b border-white/5">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all flex-1 justify-center",
              activeRoom === room.id
                ? "bg-[#ee3536] text-white shadow-lg shadow-[#ee3536]/20"
                : "text-white/50 hover:text-white/70 hover:bg-white/5"
            )}
          >
            {room.icon}
            {room.label}
          </button>
        ))}
      </div>
    </div>
  )
}
