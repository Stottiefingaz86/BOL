'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { pokerBtnGhost, pokerBtnOutline, pokerInset, pokerSurface } from '@/components/poker-app/ui'

const GROUPS: { title: string; options: string[] }[] = [
  {
    title: 'Limits',
    options: ['No limit', 'Pot limit', 'Limit', 'Pot limit Hi-Lo', 'Limit Hi-Lo'],
  },
  {
    title: 'Speeds',
    options: ['Hyper', 'Turbo', 'Fast', 'Regular', 'Grind', 'Marathon'],
  },
  {
    title: 'Players per table',
    options: ['Heads Up', '4 max', '6 max', '8 max', '9 max'],
  },
  {
    title: 'Formats',
    options: ['Re-entry', 'Knockout', 'Bounty jackpot', 'Satellite', 'Freeroll', 'Discard'],
  },
  {
    title: 'Status',
    options: ['Announced', 'Registering', 'Late Registration', 'Running', 'Completed'],
  },
]

export function PokerFilterDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="poker-filter-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#161616] text-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 id="poker-filter-title" className="text-base font-semibold text-white">
            Scheduled tournaments filter
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-[12px] text-white/45 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="grid gap-3 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className={cn('space-y-3 p-3.5', pokerSurface)}>
            <p className="text-[12px] font-semibold text-white/70">Buy-in</p>
            <div className="grid grid-cols-2 gap-2">
              {['Min', 'Max'].map((label) => (
                <label key={label} className="space-y-1">
                  <span className="text-[11px] text-white/40">{label}</span>
                  <div
                    className={cn(
                      'flex h-9 items-center px-2.5 text-[12px] text-white/70',
                      pokerInset
                    )}
                  >
                    Any
                  </div>
                </label>
              ))}
            </div>
            <div className="space-y-2">
              {['Cash', 'TM', 'Tickets'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-[12px] text-white/70">
                  <Checkbox defaultChecked={opt === 'Cash'} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {GROUPS.map((group) => (
            <div key={group.title} className={cn('space-y-2.5 p-3.5', pokerSurface)}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-semibold text-white/70">{group.title}</p>
                <div className="flex gap-2 text-[11px]">
                  <button type="button" className="text-white/40 hover:text-white/70">
                    All
                  </button>
                  <button type="button" className="text-white/40 hover:text-white/70">
                    None
                  </button>
                </div>
              </div>
              <div className="max-h-[160px] space-y-2 overflow-y-auto pr-1">
                {group.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-[12px] text-white/70">
                    <Checkbox defaultChecked />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-3">
          <button
            type="button"
            className={pokerBtnGhost('text-[12px] text-white/45 hover:text-white/70')}
          >
            Reset filters
          </button>
          <button type="button" onClick={() => onOpenChange(false)} className={pokerBtnOutline()}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
