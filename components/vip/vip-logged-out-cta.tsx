'use client'

import { IconLock } from '@tabler/icons-react'
import { requestLogin } from '@/lib/auth-session'
import { cn } from '@/lib/utils'

type VipLoggedOutCtaProps = {
  className?: string
  compact?: boolean
}

export function VipLoggedOutCta({ className, compact }: VipLoggedOutCtaProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        requestLogin()
      }}
      className={cn(
        'flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-control-hover)] font-bold uppercase tracking-wider text-white/75 transition-colors hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]',
        compact ? 'h-9 text-[11px]' : 'h-10 text-xs',
        className
      )}
    >
      <IconLock className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} strokeWidth={2} />
      Log in
    </button>
  )
}
