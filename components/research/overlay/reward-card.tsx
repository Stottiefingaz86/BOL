'use client'

import { useState } from 'react'
import { IconCheck, IconCopy, IconGift } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { CampaignReward } from '../types'

/**
 * Completion reward: just the cash-drop code, tap to copy.
 * Redemption happens on the real site (VIP Hub → Cash Drop Codes), not in the demo.
 */
export function RewardCard({ reward, className }: { reward: CampaignReward; className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reward.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }
  return (
    <div className={cn('rounded-xl border border-[#7c5cff]/40 bg-[#7c5cff]/10 p-3', className)}>
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#b7a8ff]">
        <IconGift className="size-3.5" />
        Your reward · {reward.label}
      </div>
      <button
        type="button"
        onClick={copy}
        className="mt-2 flex w-full items-center justify-between rounded-lg border border-dashed border-white/25 bg-black/30 px-3 py-2.5 text-left font-mono text-lg font-bold tracking-[0.18em] text-white hover:border-white/50"
        aria-label="Copy code"
      >
        {reward.code}
        {copied ? <IconCheck className="size-4 text-[#b7a8ff]" /> : <IconCopy className="size-4 text-white/50" />}
      </button>
      <p className="mt-2 text-xs leading-relaxed text-white/60">
        {copied ? 'Copied. ' : 'Tap to copy. '}
        Redeem it on the real site under <span className="font-medium text-white/85">VIP Hub → Cash Drop Codes</span>.
      </p>
    </div>
  )
}
