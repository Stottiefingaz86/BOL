'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { pokerInset } from '@/components/poker-app/ui'

export function PokerOptionsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [section, setSection] = useState('Avatars')
  const sections = [
    'Table',
    'Bet slider',
    'Chat',
    'Themes',
    'Buy-In',
    'Avatars',
    'Audio',
    'Animation',
    'Hot Keys',
    'Other',
  ]

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
      <div className="flex max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--ds-surface-inset,#252525)] shadow-2xl">
        <aside className="flex w-[160px] shrink-0 flex-col border-r border-white/[0.06] bg-[var(--ds-page-bg,#1a1a1a)]">
          <nav className="flex-1 space-y-0.5 p-2">
            {sections.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                className={cn(
                  'w-full rounded-lg px-2.5 py-2 text-left text-[12px] font-medium transition-colors',
                  section === s
                    ? 'bg-[var(--ds-primary,#ee3536)] text-white'
                    : 'text-[var(--ds-fg-muted)] hover:bg-white/[0.04] hover:text-[var(--ds-fg)]'
                )}
              >
                {s}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="m-2 rounded-lg border border-white/10 px-2.5 py-2 text-[12px] text-[var(--ds-fg-subtle)] hover:bg-white/[0.04]"
          >
            Default
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--ds-fg)]">Options · {section}</p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)]"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {section === 'Avatars' ? (
              <div className="space-y-4">
                <div className={cn('flex items-center gap-3 p-3', pokerInset)}>
                  <span className="size-12 rounded-full bg-white/[0.06]" />
                  <div>
                    <p className="text-[13px] font-medium text-[var(--ds-fg)]">Custom avatar</p>
                    <button type="button" className="text-[12px] text-[var(--ds-primary,#ee3536)]">
                      Upload image
                    </button>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-[var(--ds-fg-muted)]">Default avatars</p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
                  {Array.from({ length: 21 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={cn(
                        'aspect-square rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] ring-1 ring-white/10 transition-colors hover:ring-white/25',
                        i === 0 && 'ring-[var(--ds-primary,#ee3536)]'
                      )}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[var(--ds-fg-muted)]">
                {section} settings use the same controls as the rest of the client.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-white/[0.06] px-4 py-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 rounded-lg bg-white/[0.06] px-4 text-[12px] font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.09]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 rounded-lg bg-[var(--ds-primary,#ee3536)] px-4 text-[12px] font-medium text-white hover:brightness-110"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
