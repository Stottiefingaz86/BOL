'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconBrandTelegram, IconCheck, IconGift } from '@tabler/icons-react'

interface CashDropCodeProps {
  onClaim?: (code: string) => void
  telegramUrl?: string
}

export function CashDropCode({
  onClaim,
  telegramUrl = 'https://t.me/betonline',
}: CashDropCodeProps) {
  const [code, setCode] = useState('')
  const [claimed, setClaimed] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill when arriving via a "Redeem" link (e.g. the research overlay's reward).
  useEffect(() => {
    const apply = (raw: string | null | undefined) => {
      if (!raw) return
      setCode(raw.toUpperCase())
      setError('')
    }
    try {
      const prefill = sessionStorage.getItem('cashdrop:prefill')
      if (prefill) {
        sessionStorage.removeItem('cashdrop:prefill')
        apply(prefill)
      }
    } catch {
      /* ignore */
    }
    // Also handle the case where this panel is already mounted when Redeem is pressed.
    const onPrefill = (evt: Event) => apply((evt as CustomEvent<{ code?: string }>).detail?.code)
    window.addEventListener('cashdrop:prefill', onPrefill)
    return () => window.removeEventListener('cashdrop:prefill', onPrefill)
  }, [])

  const handleClaim = useCallback(() => {
    if (!code.trim()) {
      setError('Please enter a code')
      return
    }
    setError('')
    setClaimed(true)
    onClaim?.(code)
    setTimeout(() => {
      setClaimed(false)
      setCode('')
    }, 3000)
  }, [code, onClaim])

  return (
    <div className="space-y-4">
      {/* Cash Drop Code Card */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <IconGift className="w-5 h-5 text-[#fef3c7]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Cash Drop Code</h3>
            <p className="text-xs text-white/40">Enter a promo code to claim rewards</p>
          </div>
        </div>

        {/* Code Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Enter Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              if (error) setError('')
            }}
            placeholder="CODE"
            className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.10] text-white placeholder:text-white/20 font-medium text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all"
            style={{ fontSize: '16px' }}
            maxLength={20}
          />
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>

        <p className="text-xs text-white/40 leading-relaxed">
          Find Cash Drop Codes on our social media accounts and email campaigns.
        </p>

        {/* Claim Button */}
        <AnimatePresence mode="wait">
          {claimed ? (
            <motion.div
              key="claimed"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="w-full py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold text-center flex items-center justify-center gap-2"
            >
              <IconCheck className="w-4 h-4" /> Code Claimed! 🎉
            </motion.div>
          ) : (
            <motion.button
              key="claim-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClaim}
              disabled={!code.trim()}
              className={`
                w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all
                ${code.trim()
                  ? 'bg-[#fef3c7] hover:bg-[#fde68a] text-black cursor-pointer'
                  : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
                }
              `}
            >
              Claim Now
            </motion.button>
          )}
        </AnimatePresence>

        {/* Terms */}
        <button className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors">
          Terms & Conditions
        </button>
      </div>

      {/* Telegram CTA */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-xl bg-gradient-to-r from-[#229ED9]/10 to-[#229ED9]/5 border border-[#229ED9]/20 hover:border-[#229ED9]/40 p-4 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-[#229ED9]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#229ED9]/30 transition-colors">
          <IconBrandTelegram className="w-6 h-6 text-[#229ED9]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-0.5">Join our Telegram</p>
          <p className="text-xs text-white/40 leading-snug">
            Get exclusive Cash Drop codes, promotions & rewards delivered straight to you.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-[#229ED9] text-white text-xs font-semibold group-hover:bg-[#1a8bc2] transition-colors">
            Join
          </div>
        </div>
      </a>
    </div>
  )
}
