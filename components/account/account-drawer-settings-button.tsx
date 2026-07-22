'use client'

import { useRouter } from 'next/navigation'
import { IconSettings } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface AccountDrawerSettingsButtonProps {
  /** Close the account drawer before navigating. */
  onBeforeNavigate?: () => void
  className?: string
}

/** Wallet-matched gear control — opens the My Account page. */
export function AccountDrawerSettingsButton({
  onBeforeNavigate,
  className,
}: AccountDrawerSettingsButtonProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        onBeforeNavigate?.()
        router.push('/account')
      }}
      className={cn(
        'ml-auto inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
        'border border-white/[0.06] bg-white/[0.05] text-white/80',
        'transition-[filter] hover:brightness-110',
        className,
      )}
      aria-label="My Account"
    >
      <IconSettings className="size-4" stroke={1.75} />
    </button>
  )
}
