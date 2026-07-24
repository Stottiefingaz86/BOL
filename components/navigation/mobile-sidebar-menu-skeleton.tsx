'use client'

import { Skeleton } from '@/components/ui/skeleton'

/** Placeholder rows while mobile sidebar product menu swaps (Casino ↔ Poker ↔ Promotions). */
export function MobileSidebarMenuSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <div
      className="flex flex-col gap-2 px-3 py-3"
      aria-busy="true"
      aria-label="Loading menu"
    >
      <Skeleton className="mb-1 h-3 w-20 rounded bg-white/10" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg px-1 py-1.5">
          <Skeleton className="size-7 shrink-0 rounded-md bg-white/10" />
          <Skeleton
            className="h-4 rounded bg-white/10"
            style={{ width: `${56 + ((i * 17) % 32)}%` }}
          />
        </div>
      ))}
    </div>
  )
}
