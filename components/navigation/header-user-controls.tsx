'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import NumberFlow from '@number-flow/react'
import { IconAlertTriangle, IconCheck, IconChevronRight, IconLoader2, IconX } from '@tabler/icons-react'
import { useChatStore } from '@/lib/store/chatStore'
import { CHAT_ENABLED } from '@/lib/chat/feature'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useVipClaimableCount } from '@/components/vip/vip-hub-overview'
import { REQUIRED_CONFIRMATIONS, useDepositTrackerStore } from '@/lib/store/depositTrackerStore'
import { DEPOSIT_FREE_SPINS_REWARD_ID, FREE_SPINS_ON_NEXT_DEPOSIT, useChurnStore } from '@/lib/store/churnStore'
import { useVipRewardsStore } from '@/lib/store/vipRewardsStore'

/**
 * Small toast anchored under the balance while a crypto deposit is being tracked
 * and the wallet drawer is closed. Clicking it reopens the wallet on the tracker.
 */
function DepositTrackingToast({
  anchorRef,
  currencySymbol,
  onOpen,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>
  currencySymbol: string
  onOpen: () => void
}) {
  const tracked = useDepositTrackerStore((s) => s.active)
  const walletOpen = useDepositTrackerStore((s) => s.walletOpen)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const visible = mounted && !!tracked && !walletOpen
  const rect = useBelowBalanceRect(anchorRef, visible)

  if (!mounted) return null

  const done = tracked?.stage === 'confirmed'
  const label = !tracked
    ? ''
    : tracked.stage === 'waiting'
      ? 'Looking for your transaction'
      : tracked.stage === 'detected'
        ? 'Transaction detected'
        : tracked.stage === 'confirming'
          ? `Confirming ${tracked.confirmations}/${REQUIRED_CONFIRMATIONS}`
          : `+${currencySymbol}${tracked.amountUsd.toLocaleString('en-US')} added to balance`

  return createPortal(
    <AnimatePresence>
      {visible && tracked && rect ? (
        <motion.button
          type="button"
          data-deposit-tracking-toast=""
          onClick={() => {
            useDepositTrackerStore.getState().setOpenRequested(true)
            onOpen()
          }}
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          style={{ position: 'fixed', top: rect.top, right: rect.right, zIndex: 400 }}
          className={cn(
            'flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors',
            done
              ? 'border-emerald-400/30 bg-[#1c1c1c]/95 hover:border-emerald-400/50'
              : 'border-white/10 bg-[#1c1c1c]/95 hover:border-white/20'
          )}
          aria-label={done ? 'Deposit confirmed — open wallet' : 'Deposit pending — open wallet for details'}
        >
          <span
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-full',
              done ? 'bg-emerald-500 text-white' : 'bg-white/[0.06] text-[#ff5a5a] ring-1 ring-white/10'
            )}
          >
            {done ? (
              <IconCheck className="size-4" stroke={3} />
            ) : (
              <IconLoader2 className="size-4 animate-spin" stroke={2.25} />
            )}
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/45">
              {done ? 'Deposit confirmed' : `${tracked.ticker} deposit pending`}
            </span>
            <span className={cn('text-xs font-semibold tabular-nums', done ? 'text-emerald-300' : 'text-white')}>
              {label}
            </span>
          </span>
          {!done ? (
            <span className="ml-1 flex gap-0.5">
              {Array.from({ length: REQUIRED_CONFIRMATIONS }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 w-3 rounded-full',
                    i < tracked.confirmations ? 'bg-[#ee3536]' : 'bg-white/15'
                  )}
                />
              ))}
            </span>
          ) : null}
          <IconChevronRight className="size-4 shrink-0 text-white/35" />
        </motion.button>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}

/** Fixed position just below the header, right-aligned with the balance pill. */
function useBelowBalanceRect(
  anchorRef: React.RefObject<HTMLDivElement | null>,
  visible: boolean,
  offsetTop = 0
) {
  const [rect, setRect] = useState<{ top: number; right: number } | null>(null)
  useLayoutEffect(() => {
    if (!visible) return
    const update = () => {
      const el = anchorRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      // Sit just below the whole header bar (not just the balance pill) so nothing overlaps it.
      const headerBottom = el.closest('header')?.getBoundingClientRect().bottom ?? r.bottom
      setRect({
        top: Math.max(r.bottom, headerBottom) + 8 + offsetTop,
        right: window.innerWidth - r.right,
      })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [visible, anchorRef, offsetTop])
  return rect
}

const LOW_BALANCE_TOAST_MS = 12000

/**
 * "Balance running low" toast under the header balance (churn journey step 2).
 * Clicking opens the wallet; auto-hides after a while.
 */
function LowBalanceToast({
  anchorRef,
  onOpen,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>
  onOpen: () => void
}) {
  const show = useChurnStore((s) => s.lowBalanceToastVisible)
  const hide = useChurnStore((s) => s.hideLowBalanceToast)
  const depositToastVisible = useDepositTrackerStore(
    (s) => !!s.active && !s.walletOpen
  )
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const visible = mounted && show
  const rect = useBelowBalanceRect(anchorRef, visible, depositToastVisible ? 56 : 0)

  useEffect(() => {
    if (!visible) return
    const t = window.setTimeout(hide, LOW_BALANCE_TOAST_MS)
    return () => window.clearTimeout(t)
  }, [visible, hide])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {visible && rect ? (
        <motion.div
          data-low-balance-toast=""
          role="status"
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          style={{ position: 'fixed', top: rect.top, right: rect.right, zIndex: 400 }}
          className="flex w-[min(340px,calc(100vw-1.5rem))] items-start gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1c]/95 px-3 py-2.5 text-left shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md"
        >
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[#ff5a5a] ring-1 ring-white/10">
            <IconAlertTriangle className="size-4" stroke={2.25} />
          </span>
          <button
            type="button"
            onClick={() => {
              hide()
              onOpen()
            }}
            className="flex min-w-0 flex-1 flex-col text-left leading-tight"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/45">
              Balance running low
            </span>
            <span className="mt-0.5 text-xs font-semibold text-white">
              {FREE_SPINS_ON_NEXT_DEPOSIT} Free Spins on your next deposit
            </span>
            <span className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#ff7a7a]">
              Deposit now
              <IconChevronRight className="size-3.5" stroke={2.25} />
            </span>
          </button>
          <button
            type="button"
            onClick={hide}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <IconX className="size-3.5" stroke={2.25} />
          </button>
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#ee3536]/70"
            style={{ animation: `toast-countdown ${LOW_BALANCE_TOAST_MS}ms linear forwards` }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}

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
  const vipClaimable = useVipClaimableCount()
  const depositSpinsAwarded = useChurnStore((s) => s.freeSpinsAwarded)
  const depositSpinsClaimed = useVipRewardsStore((s) => s.claimedIds.includes(DEPOSIT_FREE_SPINS_REWARD_ID))
  const crownWiggle = isLoggedIn && depositSpinsAwarded > 0 && !depositSpinsClaimed
  const balanceRef = useRef<HTMLDivElement>(null)

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

          {/* VIP Crown — gold fill + border. Wiggles while deposit-bonus free spins wait to be claimed. */}
          <motion.button
            type="button"
            data-drawer-toggle="vip"
            data-vip-wiggle={crownWiggle ? '' : undefined}
            animate={
              crownWiggle && !vipDrawerOpen
                ? { rotate: [0, -6, 5, -3, 0] }
                : { rotate: 0 }
            }
            transition={
              crownWiggle && !vipDrawerOpen
                ? { duration: 0.7, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.8 }
                : { duration: 0.2 }
            }
            onClick={openVip}
            aria-label={
              vipDrawerOpen
                ? 'Close VIP Hub'
                : vipClaimable > 0
                  ? `Open VIP Hub — ${vipClaimable} reward${vipClaimable === 1 ? '' : 's'} to claim`
                  : 'Open VIP Hub'
            }
            className={cn(
              'relative flex size-9 shrink-0 items-center justify-center overflow-visible rounded-lg border p-2.5 transition-colors',
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
            <AnimatePresence>
              {vipClaimable > 0 && (
                <motion.span
                  key="vip-count"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  aria-hidden
                  className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[var(--ds-nav-bg)] bg-[var(--ds-primary)] px-1 text-[10px] font-bold leading-none text-white tabular-nums"
                >
                  {vipClaimable > 9 ? '9+' : vipClaimable}
                </motion.span>
              )}
            </AnimatePresence>
            {crownWiggle && !vipDrawerOpen ? (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-lg"
                style={{ boxShadow: `0 0 0 1px rgba(${VIP_GOLD}, 0.9), 0 0 14px rgba(${VIP_GOLD}, 0.45)` }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
              />
            ) : null}
          </motion.button>

          {/* Balance + Wallet — joined Domain Buttons (same 36px height as icon buttons) */}
          <div
            ref={balanceRef}
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
          <DepositTrackingToast anchorRef={balanceRef} currencySymbol={currencySymbol} onOpen={onOpenDeposit} />
          <LowBalanceToast anchorRef={balanceRef} onOpen={onOpenDeposit} />

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
                'h-9 rounded-lg border-0 bg-[#ee3536] font-semibold text-white hover:bg-[#d42f30]',
                isMobile ? 'px-2.5 text-[11px]' : 'px-3 text-xs'
              )}
            >
              Join
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
