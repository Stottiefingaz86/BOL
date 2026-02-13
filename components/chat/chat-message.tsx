"use client"

import { cn } from "@/lib/utils"
import { useChatStore, type ChatMessage as ChatMessageType, type ChatUser } from "@/lib/store/chatStore"
import { IconStar, IconShield, IconDiamond, IconCoin, IconCloud, IconCopy, IconFlame, IconHandStop, IconMoodSmile, IconCheck } from "@tabler/icons-react"
import { useState } from "react"

// ─── Badge Component ─────────────────────────────────────
function UserBadge({ badge, vipLevel }: { badge?: string | null; vipLevel?: number }) {
  if (!badge) return null

  if (badge === 'vip') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
        <IconStar className="w-2.5 h-2.5" />
        VIP{vipLevel ? ` ${vipLevel}` : ''}
      </span>
    )
  }

  if (badge === 'mod') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        <IconShield className="w-2.5 h-2.5" />
        MOD
      </span>
    )
  }

  if (badge === 'high-roller') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
        <IconDiamond className="w-2.5 h-2.5" />
      </span>
    )
  }

  return null
}

// ─── Timestamp Formatter ─────────────────────────────────
function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Tip Message ─────────────────────────────────────────
function TipMessage({ message }: { message: ChatMessageType }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 mx-2 my-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20">
        <IconCoin className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[12px] text-emerald-400">
          <span className="font-semibold">{message.username}</span>
          {' tipped '}
          <span className="font-semibold">{message.tipRecipient}</span>
          {' '}
          <span className="font-bold text-emerald-300">${message.tipAmount}</span>
        </span>
      </div>
    </div>
  )
}

// ─── Rain Message ────────────────────────────────────────
function RainMessage({ message }: { message: ChatMessageType }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 mx-2 my-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20">
        <IconCloud className="w-4 h-4 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[12px] text-blue-400 font-semibold">
          🌧️ {message.username} made it rain!
        </span>
      </div>
    </div>
  )
}

// ─── Bet Share Message ───────────────────────────────────
function BetShareMessage({ message }: { message: ChatMessageType }) {
  const [copied, setCopied] = useState(false)
  if (!message.betSlip) return null

  const handleCopyToSlip = () => {
    if (copied || !message.betSlip) return
    const { copyBetToSlip } = useChatStore.getState()
    copyBetToSlip(message.betSlip.legs)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-2 my-1">
      <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#1a2332] to-[#151c28]">
        {/* Header */}
        <div className="px-3 py-2 flex items-center gap-2 border-b border-white/5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
            {message.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-[11px] font-semibold text-white/90">{message.username}</span>
          <UserBadge badge={message.badge} />
          <span className="text-[10px] text-white/30 ml-auto">
            {message.betSlip.type === 'parlay' ? 'Parlay Bet' : 'Single Bet'}
          </span>
        </div>
        
        {/* Legs */}
        <div className="px-3 py-2 space-y-1.5">
          {message.betSlip.legs.map((leg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/60 truncate">{leg.event}</p>
                <p className="text-[12px] text-white font-medium">{leg.selection} <span className="text-white/50">({leg.odds})</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
          <div>
            {message.betSlip.combinedOdds && (
              <p className="text-[11px] text-white/50">Combined: <span className="text-emerald-400 font-semibold">{message.betSlip.combinedOdds}</span></p>
            )}
            {message.betSlip.potentialWin && (
              <p className="text-[11px] text-white/50">Win: <span className="text-white font-semibold">{message.betSlip.potentialWin}</span></p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyToSlip}
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
                copied
                  ? "bg-emerald-500/20 border border-emerald-500/30"
                  : "bg-white/5 hover:bg-white/10"
              )}
              title="Copy to betslip"
            >
              {copied ? (
                <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <IconCopy className="w-3.5 h-3.5 text-white/50" />
              )}
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <IconFlame className="w-3.5 h-3.5 text-orange-400/70" />
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <IconHandStop className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── System Message ──────────────────────────────────────
function SystemMessage({ message }: { message: ChatMessageType }) {
  return (
    <div className="flex items-center justify-center px-4 py-1.5 my-0.5">
      <span className="text-[10px] text-white/30 text-center">{message.content}</span>
    </div>
  )
}

// ─── Highlight @mentions ─────────────────────────────────
function highlightMentions(content: string): React.ReactNode {
  const parts = content.split(/(@\w+)/g)
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return (
        <span key={i} className="text-[#ee3536] font-medium cursor-pointer hover:underline">
          {part}
        </span>
      )
    }
    return part
  })
}

// ─── Main ChatMessage Component ──────────────────────────
export default function ChatMessage({ 
  message, 
  onUserClick 
}: { 
  message: ChatMessageType
  onUserClick?: (user: Partial<ChatUser>) => void 
}) {
  // Special message types
  if (message.type === 'tip') return <TipMessage message={message} />
  if (message.type === 'rain') return <RainMessage message={message} />
  if (message.type === 'bet-share') return <BetShareMessage message={message} />
  if (message.type === 'system') return <SystemMessage message={message} />

  return (
    <div className="group flex items-start gap-2 px-3 py-1.5 hover:bg-white/[0.02] transition-colors">
      {/* Avatar */}
      <button
        onClick={() => onUserClick?.({ id: message.userId, username: message.username, badge: message.badge })}
        className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white cursor-pointer hover:ring-2 hover:ring-white/20 transition-all mt-0.5"
      >
        {message.username.charAt(0).toUpperCase()}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onUserClick?.({ id: message.userId, username: message.username, badge: message.badge })}
            className={cn(
              "text-[12px] font-semibold cursor-pointer hover:underline",
              message.badge === 'mod' ? 'text-emerald-400' :
              message.badge === 'vip' ? 'text-amber-400' :
              message.badge === 'high-roller' ? 'text-purple-400' :
              'text-white/90'
            )}
          >
            {message.username}
          </button>
          <UserBadge badge={message.badge} />
          <span className="text-[10px] text-white/25">{formatTimestamp(message.timestamp)}</span>
        </div>
        <p className="text-[13px] text-white/75 leading-relaxed break-words">
          {highlightMentions(message.content)}
        </p>
      </div>

      {/* Hover actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
        <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
          <IconMoodSmile className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>
    </div>
  )
}
