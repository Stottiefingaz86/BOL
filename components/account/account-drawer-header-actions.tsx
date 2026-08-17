'use client'

import { cn } from '@/lib/utils'
import { AccountDrawerThemeToggle } from '@/components/account/account-drawer-theme-toggle'

interface AccountDrawerHeaderActionsProps {
  /** Kept for callers that previously closed the drawer before settings. */
  onBeforeNavigate?: () => void
  className?: string
}

/** Theme toggle — place after identity in the account drawer header. */
export function AccountDrawerHeaderActions({
  className,
}: AccountDrawerHeaderActionsProps) {
  return (
    <div className={cn('ml-auto flex shrink-0 items-center gap-2', className)}>
      <AccountDrawerThemeToggle />
    </div>
  )
}
