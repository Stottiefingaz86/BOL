"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { useChatStore, type ChatMessage } from "@/lib/store/chatStore"
import { IconCoin, IconX, IconStar, IconShield, IconDiamond } from "@tabler/icons-react"

const PRESET_AMOUNTS = [5, 10, 25, 50, 100]

export default function ChatTipModal() {
  const { tipState, closeTipModal, activeRoom, addMessage } = useChatStore()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [tipMessage, setTipMessage] = useState('')
  const [sending, setSending] = useState(false)
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

  if (!tipState.isOpen || !tipState.targetUser) return null

  const amount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0)
  const user = tipState.targetUser

  const handleSend = () => {
    if (amount <= 0) return
    setSending(true)

    // Simulate sending
    setTimeout(() => {
      const tipMsg: ChatMessage = {
        id: `tip-${Date.now()}`,
        userId: 'current-user',
        username: 'You',
        content: tipMessage || '',
        timestamp: new Date(),
        type: 'tip',
        tipAmount: amount,
        tipRecipient: user.username,
      }
      addMessage(activeRoom, tipMsg)
      setSending(false)
      closeTipModal()
      setSelectedAmount(null)
      setCustomAmount('')
      setTipMessage('')
    }, 800)
  }

  const content = (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ pointerEvents: 'auto', zIndex: 100000 }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeTipModal} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#1c1c1c] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <IconCoin className="w-5 h-5 text-white/50" />
            <h3 className="text-[15px] font-semibold text-white">Send Tip</h3>
          </div>
          <button onClick={closeTipModal} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
            <IconX className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02]">
          <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-white/[0.06] flex items-center justify-center text-sm font-bold text-white/70">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-white">
                {user.username}
              </span>
              {user.badge === 'vip' && <IconStar className="w-3.5 h-3.5 text-amber-400/60" />}
              {user.badge === 'mod' && <IconShield className="w-3.5 h-3.5 text-emerald-400/60" />}
              {user.badge === 'high-roller' && <IconDiamond className="w-3.5 h-3.5 text-purple-400/60" />}
            </div>
            <p className="text-[11px] text-white/30">Sending tip to this user</p>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="px-4 py-3 space-y-3">
          <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Amount</label>
          <div className="grid grid-cols-5 gap-1.5">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => { setSelectedAmount(amt); setCustomAmount('') }}
                className={cn(
                  "py-2 rounded-lg text-[13px] font-semibold transition-all",
                  selectedAmount === amt
                    ? "bg-[#ee3536] text-white"
                    : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70 border border-white/[0.06]"
                )}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/30">$</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
              placeholder="Custom amount"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 pl-7 py-2.5 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Optional message */}
          <input
            type="text"
            value={tipMessage}
            onChange={(e) => setTipMessage(e.target.value)}
            placeholder="Add a message (optional)"
            maxLength={50}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Send Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleSend}
            disabled={amount <= 0 || sending}
            className={cn(
              "w-full py-3 rounded-xl text-[14px] font-semibold transition-all",
              amount > 0 && !sending
                ? "bg-[#ee3536] text-white hover:bg-[#d42f30] cursor-pointer"
                : "bg-white/[0.04] text-white/20 cursor-not-allowed"
            )}
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : amount > 0 ? (
              `Send $${amount} Tip`
            ) : (
              'Select Amount'
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Render via dedicated overlay portal root — has z-index: 100000 (above header)
  // and is excluded from vaul's pointer-events: none rules
  if (!portalEl) return null
  return createPortal(content, portalEl)
}
