'use client'

import { cn } from '@/lib/utils'
import { AccountDrawerSettingsButton } from '@/components/account/account-drawer-settings-button'
import { AccountDrawerThemeToggle } from '@/components/account/account-drawer-theme-toggle'

interface AccountDrawerHeaderActionsProps {
  /** Close the account drawer before navigating to settings. */
  onBeforeNavigate?: () => void
  className?: string
}

/** Theme toggle + settings gear — place after identity in the account drawer header. */
export function AccountDrawerHeaderActions({
  onBeforeNavigate,
  className,
}: AccountDrawerHeaderActionsProps) {
  return (
    <div className={cn('ml-auto flex shrink-0 items-center gap-2', className)}>
      <AccountDrawerThemeToggle />
      <AccountDrawerSettingsButton onBeforeNavigate={onBeforeNavigate} className="ml-0" />
    </div>
  )
}
