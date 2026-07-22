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
        <div className="truncate text-left text-sm font-medium text-white">Guest</div>
        <div className="truncate text-left text-xs text-white/50">Not signed in</div>
      </div>
    )
  }

  return (
    <div className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}>
      <div className="truncate text-left text-sm font-medium text-white">{name}</div>
      <div className="truncate text-left text-xs text-white/50">{accountId}</div>
    </div>
  )
}
