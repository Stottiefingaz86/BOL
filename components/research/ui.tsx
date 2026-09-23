'use client'

import { type ButtonHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Self-contained primitives for the research overlay. Deliberately not using the host app's
 * design-system components so the overlay can be dropped on any project unchanged.
 */

export const R = {
  accent: '#7c5cff',
  panel: '#181433',
  panelBorder: 'rgba(255,255,255,0.08)',
}

export function RButton({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-medium outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' && 'bg-[#7c5cff] text-white hover:bg-[#6b4cf0] focus-visible:ring-2 focus-visible:ring-[#7c5cff]/50',
        variant === 'outline' && 'border border-white/15 text-white hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white/20',
        variant === 'ghost' && 'text-white/70 hover:bg-white/[0.06] hover:text-white',
        className
      )}
    />
  )
}

export function RInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-10 w-full rounded-lg border border-white/12 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.06]',
        className
      )}
    />
  )
}

export function RTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-[80px] w-full resize-none rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-sm leading-relaxed text-white outline-none placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.06]',
        className
      )}
    />
  )
}

export function RLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <label className={cn('mb-1.5 block text-xs font-medium text-white/60', className)}>{children}</label>
}

/** 1–5 rating with labelled ends. */
export function RRating({
  value,
  onChange,
  low = 'Very hard',
  high = 'Very easy',
}: {
  value: number | null
  onChange: (v: number) => void
  low?: string
  high?: string
}) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5" role="radiogroup">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = value === n
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(n)}
              className={cn(
                'h-10 rounded-lg border text-sm font-semibold tabular-nums outline-none transition-colors',
                active
                  ? 'border-[#7c5cff] bg-[#7c5cff] text-white'
                  : 'border-white/12 bg-white/[0.04] text-white/70 hover:border-white/30 hover:text-white'
              )}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wide text-white/40">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  )
}

export function RProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Task ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-1 flex-1 rounded-full transition-colors',
            i < current ? 'bg-[#7c5cff]' : i === current ? 'bg-white/60' : 'bg-white/15'
          )}
        />
      ))}
    </div>
  )
}
