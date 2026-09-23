import { cn } from '@/lib/utils'
import type { CampaignStatus } from '../types'

export function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        status === 'live' && 'bg-[#7c5cff]/25 text-[#c9bfff]',
        status === 'draft' && 'bg-white/10 text-white/60',
        status === 'ended' && 'bg-white/[0.06] text-white/40'
      )}
    >
      {status === 'live' && <span className="size-1.5 animate-pulse rounded-full bg-[#b7a8ff]" />}
      {status}
    </span>
  )
}
