'use client'

import Image from 'next/image'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useChatStore } from '@/lib/store/chatStore'
import { cn } from '@/lib/utils'

const VIP_GOLD = '227, 158, 61'

type VipCrownNavButtonProps = {
  active?: boolean
  className?: string
  onClick?: () => void
}

/** Matches Figma Header IconButton (VIP) — 36px, radius 8, gold fill/border */
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
      data-drawer-toggle="vip"
      onClick={handleClick}
      aria-label={
        active
          ? 'Close VIP Hub'
          : isLoggedIn
            ? 'Open VIP Hub'
            : 'Open VIP Hub — log in to claim rewards'
      }
      className={cn(
        'relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border p-2.5 transition-colors',
        active && 'brightness-110',
        className
      )}
      style={{
        pointerEvents: 'auto',
        cursor: 'pointer',
        backgroundColor: isLoggedIn ? `rgba(${VIP_GOLD}, 0.2)` : 'rgba(255,255,255,0.05)',
        borderColor: isLoggedIn ? `rgba(${VIP_GOLD}, 0.6)` : 'rgba(255,255,255,0.06)',
      }}
    >
      <span className={cn('relative flex size-4 items-center justify-center overflow-hidden', !isLoggedIn && 'opacity-40')}>
        <Image
          src="/icons/header/crown.svg"
          alt=""
          width={16}
          height={16}
          className="size-4"
          unoptimized
        />
      </span>
    </button>
  )
}
