'use client'

import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export type SidebarMenuSkeletonLayout = 'casino' | 'poker' | 'promotions'

type SkeletonSection = {
  /** Optional section label bar (e.g. “CASINO MENU”) */
  showLabel?: boolean
  rows: number
  /** Two-line last row (e.g. Last Game Played) */
  tallLast?: boolean
}

const LAYOUTS: Record<SidebarMenuSkeletonLayout, SkeletonSection[]> = {
  // All Promotions, My Bonus, Contests, Refer A Friend
  promotions: [{ rows: 4 }],
  // PLAY NOW (2) + nav (5)
  poker: [
    { showLabel: true, rows: 2 },
    { rows: 5 },
  ],
  // Top actions (3, last is two-line) + category list (8)
  casino: [
    { showLabel: true, rows: 3, tallLast: true },
    { rows: 8 },
  ],
}

function SkeletonBar({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn('animate-pulse rounded', className)}
      style={{ backgroundColor: 'rgba(255,255,255,0.12)', ...style }}
    />
  )
}

/**
 * Placeholder rows shaped like the destination product menu so the sidebar
 * height doesn’t jump when CMS titles load in.
 */
export function SidebarMenuSkeleton({
  layout = 'casino',
  collapsed = false,
  className,
}: {
  layout?: SidebarMenuSkeletonLayout
  collapsed?: boolean
  rows?: number
  className?: string
}) {
  const sections = LAYOUTS[layout]
  const totalRows = sections.reduce((n, s) => n + s.rows, 0)

  // Icon-rail mode: only centered squares, matching collapsed sidebar buttons
  if (collapsed) {
    return (
      <div
        className={cn(
          'flex w-full flex-col items-center gap-1 px-0 py-2',
          className
        )}
        aria-busy="true"
        aria-label="Loading menu"
      >
        {Array.from({ length: totalRows }, (_, i) => (
          <div
            key={i}
            className="flex h-10 w-full items-center justify-center"
          >
            <SkeletonBar className="size-7 rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('flex flex-col px-2 py-2', className)}
      aria-busy="true"
      aria-label="Loading menu"
    >
      {sections.map((section, sIdx) => (
        <div key={sIdx} className={cn('flex flex-col', sIdx > 0 && 'mt-1')}>
          {sIdx > 0 && (
            <div
              className="mx-2 mb-2 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
          )}
          {section.showLabel && (
            <SkeletonBar className="mb-2 ml-2 mt-1 h-3 w-20" />
          )}
          <div className="flex flex-col gap-0.5">
            {Array.from({ length: section.rows }, (_, i) => {
              const tall = Boolean(section.tallLast && i === section.rows - 1)
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 rounded-small px-2',
                    tall ? 'h-11 py-1' : 'h-10'
                  )}
                >
                  <SkeletonBar className="size-7 shrink-0 rounded-md" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <SkeletonBar
                      className="h-3.5 rounded"
                      style={{ width: `${52 + ((i * 17 + sIdx * 11) % 30)}%` }}
                    />
                    {tall && (
                      <SkeletonBar
                        className="h-2.5 rounded"
                        style={{ width: '38%' }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/** @deprecated Prefer `SidebarMenuSkeleton` — kept for existing imports. */
export function MobileSidebarMenuSkeleton(props: {
  rows?: number
  layout?: SidebarMenuSkeletonLayout
  collapsed?: boolean
}) {
  return (
    <SidebarMenuSkeleton
      layout={props.layout ?? 'casino'}
      collapsed={props.collapsed}
    />
  )
}
