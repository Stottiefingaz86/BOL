"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useChatStore, type ChatMessage } from "@/lib/store/chatStore"
import { IconMoodSmile, IconSend, IconPhoto } from "@tabler/icons-react"

// Common emojis for quick access
const QUICK_EMOJIS = ['😀', '😂', '🔥', '💰', '🎰', '🏆', '👏', '🤔', '❤️', '💎', '🎯', '⚡', '🌧️', '🎉', '👀', '😎']

export default function ChatInput() {
  const { inputMessage, setInputMessage, addMessage, showEmojiPicker, setShowEmojiPicker } = useChatStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleSend = useCallback(() => {
    const trimmed = inputMessage.trim()
    if (!trimmed) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: 'current-user',
      username: 'You',
      content: trimmed,
      timestamp: new Date(),
      type: 'message',
      mentions: trimmed.match(/@\w+/g)?.map(m => m.slice(1)) || undefined,
    }

    addMessage('sports', newMessage)
    setInputMessage('')
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }, [inputMessage, addMessage, setInputMessage, setShowEmojiPicker])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insertEmoji = (emoji: string) => {
    setInputMessage(inputMessage + emoji)
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 right-0 mb-1 p-2 bg-[#1e1e1e] border border-white/10 rounded-lg shadow-xl z-10">
          <div className="grid grid-cols-8 gap-1">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-base"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-1.5 bg-[#1a1a1a] border-t border-white/10 transition-colors",
        isFocused && "border-t-[#ee3536]/50"
      )}>
        {/* Emoji button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-colors flex-shrink-0",
            showEmojiPicker ? "bg-[#ee3536]/20 text-[#ee3536]" : "text-white/40 hover:text-white/60 hover:bg-white/5"
          )}
        >
          <IconMoodSmile className="w-4.5 h-4.5" />
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { setIsFocused(true); setShowEmojiPicker(false) }}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-[13px] text-white/90 placeholder:text-white/25 outline-none min-w-0"
          maxLength={500}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!inputMessage.trim()}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-all flex-shrink-0",
            inputMessage.trim()
              ? "bg-[#ee3536] text-white hover:bg-[#ee3536]/80 cursor-pointer"
              : "text-white/20 cursor-not-allowed"
          )}
        >
          <IconSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
