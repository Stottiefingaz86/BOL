"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/store/chatStore"
import {
  IconX,
  IconShield,
  IconDiamond,
  IconCoin,
  IconAt,
  IconBan,
  IconFlag,
  IconMessage,
  IconMoneybag,
  IconReceipt,
  IconCloudRain,
  IconExternalLink,
  IconCrown,
} from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Badge Component ─────────────────────────────────────
function VipBadge({ badge, vipLevel }: { badge?: string | null; vipLevel?: number }) {
  if (!badge) return null

  if (badge === 'vip') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/60 border border-white/10">
        <IconCrown className="w-3 h-3 text-amber-400/70" />
        VIP {vipLevel || 1}
      </span>
    )
  }
  if (badge === 'mod') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/60 border border-white/10">
        <IconShield className="w-3 h-3 text-emerald-400/70" />
        MOD
      </span>
    )
  }
  if (badge === 'high-roller') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/60 border border-white/10">
        <IconDiamond className="w-3 h-3 text-purple-400/70" />
        HIGH ROLLER
      </span>
    )
  }
  return null
}

// ─── Stat Item ───────────────────────────────────────────
function StatItem({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.06]">
        <Icon className="w-3.5 h-3.5 text-white/40" />
      </div>
      <span className="text-[10px] text-white/30 text-center leading-tight">{label}</span>
      <span className="text-[12px] font-semibold text-white/80">{typeof value === 'number' ? value.toLocaleString() : value}</span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────
export default function ChatUserProfile() {
  const { profileState, closeUserProfile, openTipModal, setInputMessage, inputMessage } = useChatStore()
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    let el = document.getElementById('overlay-portal-root')
    if (!el) {
      el = document.createElement('div')
      el.id = 'overlay-portal-root'
      document.body.appendChild(el)
    }
    setPortalEl(el)
  }, [])

  if (!profileState.isOpen || !profileState.user) return null

  const user = profileState.user

  const handleSendTip = () => {
    closeUserProfile()
    openTipModal({
      id: user.id,
      username: user.username,
      badge: user.badge,
      vipLevel: user.vipLevel,
      isOnline: user.isOnline,
    })
  }

  const handleMention = () => {
    closeUserProfile()
    const mention = `@${user.username} `
    setInputMessage(inputMessage + mention)
  }

  const content = (
    <AnimatePresence>
      {profileState.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ pointerEvents: 'auto', zIndex: 100000 }}>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeUserProfile}
          />

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-[380px] max-h-[85vh] overflow-y-auto bg-[#1c1c1c] border border-white/[0.08] rounded-2xl shadow-2xl"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}
          >
            {/* Close button */}
            <button
              onClick={closeUserProfile}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <IconX className="w-4 h-4 text-white/50" />
            </button>

            {/* ── Header / Avatar Area ── */}
            <div className="relative">
              {/* Subtle top gradient */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent rounded-t-2xl" />

              <div className="relative flex flex-col items-center pt-8 pb-4 px-4">
                {/* Avatar */}
                <div className="relative mb-3">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#2a2a2a] border-2 border-white/[0.08] flex items-center justify-center text-xl font-bold text-white/80">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {/* Online indicator */}
                  {user.isOnline && (
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[2.5px] border-[#1c1c1c]" />
                  )}
                </div>

                {/* Username + Badge */}
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-lg font-bold text-white">
                    {user.username}
                  </h2>
                  <VipBadge badge={user.badge} vipLevel={user.vipLevel} />
                </div>

                {/* Registration + Wagered */}
                <p className="text-[11px] text-white/30 mb-0.5">
                  Registered: <span className="text-white/50">{user.registeredDate}</span>
                </p>
                <p className="text-[11px] text-white/30">
                  Total Wagered: <span className="text-white/60 font-medium">{user.totalWagered.crypto}</span>
                  <span className="text-white/20"> / </span>
                  <span className="text-white/40">{user.totalWagered.usd}</span>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mx-4" />

            {/* ── Statistics ── */}
            <div className="px-4 py-4">
              <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Statistics</h3>
              <div className="grid grid-cols-4 gap-2">
                <StatItem icon={IconMessage} label="Messages Sent" value={user.stats.messagesSent} />
                <StatItem icon={IconMoneybag} label="Tips Given" value={user.stats.tipsGiven} />
                <StatItem icon={IconReceipt} label="Tips Received" value={user.stats.tipsReceived} />
                <StatItem icon={IconCloudRain} label="Rain Won" value={user.stats.rainWon} />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mx-4" />

            {/* ── Action Buttons ── */}
            <div className="px-4 py-3 flex items-center gap-2">
              <button
                onClick={handleSendTip}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white/80 border border-white/[0.06] transition-colors"
              >
                <IconCoin className="w-3.5 h-3.5" />
                Tip
              </button>
              <button
                onClick={handleMention}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white/80 border border-white/[0.06] transition-colors"
              >
                <IconAt className="w-3.5 h-3.5" />
                Mention
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-red-400/70 hover:text-red-400 border border-white/[0.06] transition-colors">
                <IconBan className="w-3.5 h-3.5" />
                Block
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/60 border border-white/[0.06] transition-colors">
                <IconFlag className="w-3.5 h-3.5" />
                Report
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mx-4" />

            {/* ── Recent Activity ── */}
            <div className="px-4 py-4">
              <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {user.recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-white/20 mt-0.5 flex-shrink-0 font-mono">{activity.time}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-white/50 leading-relaxed">
                          <span className="font-semibold text-white/70">
                            {user.username}
                          </span>
                          {activity.type === 'message' && `: ${activity.content.split(': ').slice(1).join(': ')}`}
                          {activity.type === 'tip' && ` ${activity.content.split(user.username).slice(1).join('')}`}
                          {activity.type === 'bet-share' && ' shared a bet:'}
                        </p>
                        {/* Bet details card */}
                        {activity.betDetails && (
                          <div className="mt-2 rounded-md bg-white/[0.02] border border-white/[0.04] px-3 py-2 flex items-center gap-2">
                            <span className="text-base">🎰</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-white/40">
                                Big Win on &apos;{activity.betDetails.game}&apos; - Multiplier {activity.betDetails.multiplier}!
                              </p>
                              <p className="text-[10px] text-white/30">
                                Wager: <span className="text-white/50">{activity.betDetails.wager}</span>, Payout: <span className="text-white/60 font-semibold">{activity.betDetails.payout}</span>
                              </p>
                            </div>
                            <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/60 text-[10px] font-semibold transition-colors border border-white/[0.06]">
                              View Bet
                              <IconExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom padding */}
            <div className="h-2" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  // Render via dedicated overlay portal root — has z-index: 100000 (above header)
  // and is excluded from vaul's pointer-events: none rules
  if (!portalEl) return null
  return createPortal(content, portalEl)
}
