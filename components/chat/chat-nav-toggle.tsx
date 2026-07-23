"use client"

import Image from "next/image"
import { useChatStore } from "@/lib/store/chatStore"
import { CHAT_ENABLED } from "@/lib/chat/feature"
import { cn } from "@/lib/utils"

/** Matches Figma Header IconButton — 36px, radius 8 */
export default function ChatNavToggle() {
  const { isOpen, toggleChat } = useChatStore()

  if (!CHAT_ENABLED) return null

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleChat()
      }}
      className={cn(
        "relative flex size-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border p-2.5 transition-colors",
        isOpen
          ? "border-[#ee3536]/40 bg-[#ee3536]/20 hover:bg-[#ee3536]/30"
          : "border-white/[0.06] bg-white/5 hover:brightness-110"
      )}
      style={{ pointerEvents: "auto", zIndex: 101, position: "relative" }}
      aria-label="Toggle Chat"
    >
      <span className="relative flex size-4 -scale-x-100 items-center justify-center overflow-hidden">
        <Image
          src="/icons/header/chat.svg"
          alt=""
          width={16}
          height={16}
          className="size-4"
          unoptimized
        />
      </span>
    </button>
  )
}
