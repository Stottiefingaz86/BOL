'use client'

import { useState } from 'react'
import {
  CircleCheck,
  Info,
  OctagonX,
  TriangleAlert,
  X,
} from 'lucide-react'
import { toast as sonnerToast } from 'sonner'
import { cn } from '@/lib/utils'

export type AppToastVariant = 'success' | 'error' | 'info' | 'warning' | 'message'

const VARIANT_STYLES: Record<
  AppToastVariant,
  {
    shell: string
    icon: string
    progress: string
    Icon: typeof CircleCheck
  }
> = {
  success: {
    shell:
      'bg-[var(--ds-toast-success-bg)] border-[var(--ds-toast-success-border)]',
    icon: 'text-[var(--ds-toast-success)]',
    progress: 'var(--ds-toast-success)',
    Icon: CircleCheck,
  },
  error: {
    shell:
      'bg-[var(--ds-toast-destructive-bg)] border-[var(--ds-toast-destructive-border)]',
    icon: 'text-[var(--ds-toast-destructive)]',
    progress: 'var(--ds-toast-destructive)',
    Icon: OctagonX,
  },
  warning: {
    shell:
      'bg-[var(--ds-toast-warning-bg)] border-[var(--ds-toast-warning-border)]',
    icon: 'text-[var(--ds-toast-warning)]',
    progress: 'var(--ds-toast-warning)',
    Icon: TriangleAlert,
  },
  info: {
    shell: 'bg-[var(--ds-toast-info-bg)] border-[var(--ds-toast-info-border)]',
    icon: 'text-[var(--ds-toast-info)]',
    progress: 'var(--ds-toast-info)',
    Icon: Info,
  },
  message: {
    shell:
      'bg-[var(--ds-toast-neutral-bg)] border-[var(--ds-toast-neutral-border)]',
    icon: 'text-[var(--ds-toast-fg-muted)]',
    progress: 'var(--ds-toast-fg-muted)',
    Icon: Info,
  },
}

export type AppToastProps = {
  id: string | number
  variant: AppToastVariant
  message: React.ReactNode
  description?: React.ReactNode
  duration: number
}

/** Lumen Sonnar — Figma Refer-A-Friend tokens, countdown progress bar. */
export function AppToast({
  id,
  variant,
  message,
  description,
  duration,
}: AppToastProps) {
  const [paused, setPaused] = useState(false)
  const styles = VARIANT_STYLES[variant]
  const Icon = styles.Icon

  return (
    <div
      className={cn(
        'flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3 rounded-[var(--ds-toast-radius)] border px-3.5 py-4 backdrop-blur-[32px]',
        styles.shell
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-start gap-2">
        <Icon
          className={cn('mt-px size-5 shrink-0', styles.icon)}
          strokeWidth={2}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-5 text-[var(--ds-toast-fg)]">
            {message}
          </p>
          {description ? (
            <p className="mt-1 text-[13px] leading-snug text-[var(--ds-toast-fg-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => sonnerToast.dismiss(id)}
          className="shrink-0 rounded-lg p-1.5 text-[var(--ds-toast-fg-muted)] transition-colors hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-toast-fg)]"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-toast-track)]"
        aria-hidden
      >
        <div
          className="h-full rounded-l-full"
          style={{
            backgroundColor: styles.progress,
            width: '100%',
            animation: `toast-countdown ${duration}ms linear forwards`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      </div>
    </div>
  )
}
