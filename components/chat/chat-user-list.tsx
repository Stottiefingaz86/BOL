"use client"

import { cn } from "@/lib/utils"
import { useChatStore, type ChatUser } from "@/lib/store/chatStore"
import { IconStar, IconShield, IconDiamond, IconCoin, IconAt } from "@tabler/icons-react"

function UserBadgeSmall({ badge, vipLevel }: { badge?: string | null; vipLevel?: number }) {
  if (!badge) return null
  if (badge === 'vip') return <IconStar className="w-3 h-3 text-amber-400" />
  if (badge === 'mod') return <IconShield className="w-3 h-3 text-emerald-400" />
  if (badge === 'high-roller') return <IconDiamond className="w-3 h-3 text-purple-400" />
  return null
}

export default function ChatUserList({ onUserClick }: { onUserClick?: (user: ChatUser) => void }) {
  const { activeRoom, casinoUsers, sportsUsers, showUserList } = useChatStore()

  if (!showUserList) return null

  const users = activeRoom === 'casino' ? casinoUsers : sportsUsers
  const onlineUsers = users.filter(u => u.isOnline)
  const offlineUsers = users.filter(u => !u.isOnline)

  return (
    <div className="absolute inset-0 top-0 bg-[#222222] z-20 flex flex-col">
      <div className="px-3 py-2.5 border-b border-white/10">
        <h4 className="text-[13px] font-semibold text-white">Active Users ({onlineUsers.length})</h4>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Online */}
        {onlineUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserClick?.(user)}
            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left"
          >
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#222222]" />
            </div>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className={cn(
                "text-[12px] font-medium truncate",
                user.badge === 'mod' ? 'text-emerald-400' :
                user.badge === 'vip' ? 'text-amber-400' :
                user.badge === 'high-roller' ? 'text-purple-400' :
                'text-white/80'
              )}>
                {user.username}
              </span>
              <UserBadgeSmall badge={user.badge} vipLevel={user.vipLevel} />
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <IconCoin className="w-3.5 h-3.5 text-white/30" />
              <IconAt className="w-3.5 h-3.5 text-white/30" />
            </div>
          </button>
        ))}

        {/* Offline */}
        {offlineUsers.length > 0 && (
          <>
            <div className="px-3 py-2 border-t border-white/5">
              <span className="text-[11px] text-white/30 font-medium">Offline ({offlineUsers.length})</span>
            </div>
            {offlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2.5 px-3 py-2 opacity-40"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-[12px] text-white/50 truncate">{user.username}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
