"use client"

import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/store/chatStore"
import { IconMessageCircle2 } from "@tabler/icons-react"

export default function ChatToggle({ className }: { className?: string }) {
  const { isOpen, toggleChat, activeRoom, casinoOnlineCount, sportsOnlineCount } = useChatStore()
  const onlineCount = activeRoom === 'casino' ? casinoOnlineCount : sportsOnlineCount

  return (
    <button
      onClick={toggleChat}
      className={cn(
        "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
        isOpen
          ? "bg-[#ee3536] text-white shadow-lg shadow-[#ee3536]/20"
          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      <IconMessageCircle2 className="w-4 h-4" />
      <span className="text-[12px] font-medium hidden sm:inline">Chat</span>
      
      {/* Online indicator dot */}
      {!isOpen && (
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1a1a1a] animate-pulse" />
      )}
    </button>
  )
}
