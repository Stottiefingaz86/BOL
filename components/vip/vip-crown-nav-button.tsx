'use client'

import { IconCrown } from '@tabler/icons-react'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useChatStore } from '@/lib/store/chatStore'
import { cn } from '@/lib/utils'

type VipCrownNavButtonProps = {
  active?: boolean
  className?: string
  onClick?: () => void
}

export function VipCrownNavButton({ active = false, className, onClick }: VipCrownNavButtonProps) {
  const { isLoggedIn } = useAuthSession()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    useChatStore.getState().setIsOpen(false)
    if (onClick) {
      onClick()
      return
    }
    window.dispatchEvent(new CustomEvent('vip:open-drawer'))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isLoggedIn ? 'Open VIP Hub' : 'Open VIP Hub — log in to claim rewards'}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
        isLoggedIn
          ? 'border-yellow-400/30 bg-yellow-400/20 hover:border-yellow-400/40 hover:bg-yellow-400/30 active:bg-gray-500/20'
          : 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15 active:bg-white/20',
        active && isLoggedIn && 'border-yellow-400/40 bg-yellow-400/30',
        active && !isLoggedIn && 'border-white/30 bg-white/15',
        className
      )}
      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
    >
      <IconCrown className={cn('h-4 w-4', isLoggedIn ? 'text-yellow-400' : 'text-white/35')} />
    </button>
  )
}
