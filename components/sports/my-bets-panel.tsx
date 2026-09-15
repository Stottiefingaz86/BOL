'use client'

import { IconTicket } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { cn } from '@/lib/utils'

/** Placed bets list for the "My Bets" sidebar feature — same card styling as the event cards. */
export function MyBetsPanel({ onBrowse, className }: { onBrowse?: () => void; className?: string }) {
  const placedBets = useBetslipStore((s) => s.placedBets)
  const sorted = [...placedBets].sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime())

  return (
    <div className={cn('w-full space-y-4 px-4 pb-10 pt-4 md:px-6 md:pt-5', className)}>
      <div className="flex h-7 items-center gap-1">
        <span className="inline-flex size-7 items-center justify-center text-[var(--ds-fg)]">
          <IconTicket className="size-4" strokeWidth={1.5} />
        </span>
        <h2 className="text-lg font-semibold leading-7 text-[var(--ds-fg)]">My Bets</h2>
        {sorted.length > 0 && (
          <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded bg-white/10 px-1.5 text-[11px] font-semibold tabular-nums text-white/80">
            {sorted.length}
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-[10px] border border-white/[0.06] bg-[#262626] px-4 py-12 text-center">
          <p className="text-sm text-[var(--ds-fg-muted)]">You haven&apos;t placed any bets yet.</p>
          {onBrowse && (
            <Button
              variant="ghost"
              className="mt-4 h-auto rounded-small border border-white/20 px-3 py-1.5 text-xs text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
              onClick={onBrowse}
            >
              Browse events
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((bet) => (
            <article
              key={`${bet.id}-${bet.placedAt.getTime()}`}
              className="flex items-center gap-3 rounded-[10px] border border-white/[0.06] bg-[#262626] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-[var(--ds-fg)]">{bet.selection}</span>
                  <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/80">
                    Pending
                  </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-[var(--ds-fg-muted)]">
                  {bet.marketTitle} · {bet.eventName}
                </div>
                <div className="mt-0.5 text-[10px] text-[var(--ds-fg-muted)]">
                  Placed{' '}
                  {bet.placedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">{bet.odds}</div>
                <div className="text-xs tabular-nums text-[var(--ds-fg-muted)]">
                  ${bet.stake.toFixed(2)} stake
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
