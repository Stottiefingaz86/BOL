"use client"

import { IconMessageCircle2 } from "@tabler/icons-react"
import { useChatStore } from "@/lib/store/chatStore"
import { cn } from "@/lib/utils"

/**
 * Chat toggle button for the main nav header.
 * Sits next to the DEPOSIT button. Shows online indicator when chat is closed.
 */
export default function ChatNavToggle() {
  const { isOpen, toggleChat } = useChatStore()

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleChat()
      }}
      className={cn(
        "flex items-center justify-center rounded-small transition-colors relative cursor-pointer",
        "h-[32px] w-[32px]",
        isOpen
          ? "bg-[#ee3536]/20 border border-[#ee3536]/40 hover:bg-[#ee3536]/30"
          : "bg-white/5 hover:bg-white/10 border border-transparent"
      )}
      style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative' }}
      aria-label="Toggle Chat"
    >
      <IconMessageCircle2
        className={cn(
          "w-4 h-4 transition-colors",
          isOpen ? "text-[#ee3536]" : "text-white/70"
        )}
        strokeWidth={2}
      />
      {/* Online pulse dot */}
      {!isOpen && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#2d2d2d] animate-pulse" />
      )}
    </button>
  )
}
