'use client'

import { cn } from '@/lib/utils'

interface AccountDrawerIdentityProps {
  loggedIn?: boolean
  name?: string
  accountId?: string
  className?: string
}

/**
 * Account drawer header identity — name and account id.
 */
export function AccountDrawerIdentity({
  loggedIn = true,
  name = 'ch',
  accountId = 'b1767721',
  className,
}: AccountDrawerIdentityProps) {
  if (!loggedIn) {
    return (
      <div className={cn('flex min-w-0 flex-1 flex-col', className)}>
        <div className="truncate text-left text-sm font-medium text-[var(--ds-fg)]">Guest</div>
        <div className="truncate text-left text-xs text-[var(--ds-fg-subtle)]">Not signed in</div>
      </div>
    )
  }

  return (
    <div className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}>
      <div className="truncate text-left text-sm font-medium text-[var(--ds-fg)]">{name}</div>
      <div className="truncate text-left text-xs text-[var(--ds-fg-subtle)]">{accountId}</div>
    </div>
  )
}
