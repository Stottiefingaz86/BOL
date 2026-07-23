'use client'

import Image from 'next/image'
import NumberFlow from '@number-flow/react'
import { useChatStore } from '@/lib/store/chatStore'
import { CHAT_ENABLED } from '@/lib/chat/feature'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

/** Figma Loyalty Hub header — VIP gold (opacity-vip / level-1) */
const VIP_GOLD = '227, 158, 61'

/** Theme-aware control fill — uses --ds-control-bg from globals. */
const BTN_BG = 'var(--ds-control-bg)'

export type HeaderUserControlsProps = {
  isLoggedIn: boolean
  balance: number
  currencySymbol?: string
  vipDrawerOpen?: boolean
  /** Show red notification indicator on My Account */
  hasNotifications?: boolean
  onOpenAccount: () => void
  onOpenVip: () => void
  onOpenDeposit: () => void
  onLogin?: () => void
  onRegister?: () => void
  className?: string
}

/**
 * Figma: Header → Right-side container (node 135:109252 / 41784:41728)
 * [Account] [VIP Crown] [ Balance | Wallet ] [Chat]
 * gap 12px · controls 36×36 · radius 8px
 */
export function HeaderUserControls({
  isLoggedIn,
  balance,
  currencySymbol = '$',
  vipDrawerOpen = false,
  hasNotifications = true,
  onOpenAccount,
  onOpenVip,
  onOpenDeposit,
  onLogin,
  onRegister,
  className,
}: HeaderUserControlsProps) {
  const isMobile = useIsMobile()
  const { isOpen: chatOpen, toggleChat } = useChatStore()

  const openVip = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    useChatStore.getState().setIsOpen(false)
    onOpenVip()
  }

  /** Figma control height — 36px; keep icon + balance pills identical */
  const controlH = 'h-9 min-h-9 max-h-9 box-border'
  const iconBtn = cn(
    'relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--ds-control-border)] p-2.5 transition-colors hover:brightness-110',
    controlH
  )

  return (
    <div
      className={cn('relative flex shrink-0 items-center justify-end gap-3', className)}
      style={{ pointerEvents: 'auto', zIndex: 101 }}
      data-name="Right-side container"
    >
      {isLoggedIn ? (
        <>
          {/* My Account — Figma IconButton (account icon replaces bell) */}
          <button
            type="button"
            data-drawer-toggle="account"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onOpenAccount()
            }}
            aria-label={hasNotifications ? 'My Account — new notifications' : 'My Account'}
            className={cn(iconBtn, 'overflow-visible')}
            style={{ pointerEvents: 'auto', cursor: 'pointer', backgroundColor: BTN_BG }}
          >
            <span className="relative flex size-4 items-center justify-center overflow-hidden">
              <Image
                src="/icons/header/account.svg"
                alt=""
                width={16}
                height={16}
                className="size-4"
                unoptimized
              />
            </span>
            {hasNotifications && (
              <Badge
                variant="destructive"
                aria-hidden
                className="absolute -right-1 -top-1 size-2.5 min-w-0 rounded-full border-2 border-[var(--ds-nav-bg)] bg-[var(--ds-primary)] p-0 hover:bg-[var(--ds-primary)]"
              />
            )}
          </button>

          {/* VIP Crown — gold fill + border */}
          <button
            type="button"
            data-drawer-toggle="vip"
            onClick={openVip}
            aria-label={vipDrawerOpen ? 'Close VIP Hub' : 'Open VIP Hub'}
            className={cn(
              'relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border p-2.5 transition-colors',
              controlH,
              vipDrawerOpen && 'brightness-110'
            )}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              backgroundColor: `rgba(${VIP_GOLD}, 0.2)`,
              borderColor: `rgba(${VIP_GOLD}, 0.6)`,
            }}
          >
            <span className="relative flex size-4 items-center justify-center overflow-hidden">
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

          {/* Balance + Wallet — joined Domain Buttons (same 36px height as icon buttons) */}
          <div
            className={cn(
              'relative flex shrink-0 items-stretch overflow-hidden rounded-lg border border-[var(--ds-control-border)]',
              controlH
            )}
            data-name="container"
          >
            <button
              type="button"
              data-drawer-toggle="deposit"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpenDeposit()
              }}
              aria-label="Account balance"
              className={cn(
                'relative flex h-full min-h-0 shrink-0 items-center justify-center gap-1.5 border-0 px-1.5 transition-colors hover:brightness-110',
                controlH
              )}
              style={{ pointerEvents: 'auto', cursor: 'pointer', backgroundColor: BTN_BG }}
            >
              <span className="flex items-center gap-0.5 whitespace-nowrap text-xs font-medium leading-none text-[var(--ds-fg-muted)]">
                <span>{currencySymbol}</span>
                <NumberFlow
                  value={balance}
                  format={{
                    notation: 'standard',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
              </span>
            </button>
            <button
              type="button"
              data-drawer-toggle="deposit"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpenDeposit()
              }}
              aria-label="Wallet"
              className={cn(
                'relative flex h-full min-h-0 shrink-0 items-center justify-center overflow-hidden border-0 border-l border-[var(--ds-control-border)] bg-[var(--ds-control-hover)] px-2.5',
                controlH
              )}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 animate-wallet-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="relative flex size-4 items-center justify-center">
                <Image
                  src="/icons/header/wallet.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                  unoptimized
                />
              </span>
            </button>
          </div>

          {/* Chat — desktop only (Figma mobile omits it). Toggle via CHAT_ENABLED. */}
          {CHAT_ENABLED && !isMobile && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleChat()
              }}
              aria-label="Toggle Chat"
              className={cn(
                iconBtn,
                chatOpen && 'border-[#ee3536]/40 !bg-[#ee3536]/20 hover:!brightness-100'
              )}
              style={{
                pointerEvents: 'auto',
                cursor: 'pointer',
                zIndex: 101,
                backgroundColor: chatOpen ? undefined : BTN_BG,
              }}
            >
              <span className="relative flex size-4 -scale-x-100 items-center justify-center overflow-hidden">
                <Image
                  src="/icons/header/chat.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                  unoptimized
                />
              </span>
            </button>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            data-drawer-toggle="vip"
            onClick={openVip}
            aria-label={vipDrawerOpen ? 'Close VIP Hub' : 'Open VIP Hub'}
            className={iconBtn}
            style={{ pointerEvents: 'auto', cursor: 'pointer', backgroundColor: BTN_BG }}
          >
            <span className="relative flex size-4 items-center justify-center overflow-hidden opacity-40">
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
          <div className={cn('flex items-center', isMobile ? 'gap-1.5' : 'gap-2')}>
            <Button
              variant="ghost"
              onClick={onLogin}
              className={cn(
                'h-9 rounded-lg border border-white/45 bg-transparent font-semibold text-white hover:bg-white/10',
                isMobile ? 'px-2.5 text-[11px]' : 'px-3 text-xs'
              )}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              onClick={onRegister}
              className={cn(
                'h-9 rounded-lg border border-emerald-600 bg-emerald-600 font-semibold text-white hover:border-emerald-500 hover:bg-emerald-500',
                isMobile ? 'px-2.5 text-[11px]' : 'px-3 text-xs'
              )}
            >
              Create Account
            </Button>
          </div>
          {CHAT_ENABLED && !isMobile && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleChat()
              }}
              aria-label="Toggle Chat"
              className={iconBtn}
              style={{ pointerEvents: 'auto', cursor: 'pointer', backgroundColor: BTN_BG }}
            >
              <span className="relative flex size-4 -scale-x-100 items-center justify-center overflow-hidden">
                <Image
                  src="/icons/header/chat.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                  unoptimized
                />
              </span>
            </button>
          )}
        </>
      )}
    </div>
  )
}
