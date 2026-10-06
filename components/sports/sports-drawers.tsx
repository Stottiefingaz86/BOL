'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NumberFlow from '@number-flow/react'
import {
  IconBell,
  IconChevronLeft,
  IconCrown,
  IconCurrencyDollar,
  IconFileText,
  IconLogout,
  IconTicket,
  IconUser,
} from '@tabler/icons-react'
import { AccountDrawerHeaderActions } from '@/components/account/account-drawer-header-actions'
import { AccountDrawerIdentity } from '@/components/account/account-drawer-identity'
import { NotificationHub } from '@/components/account/notification-hub'
import { QuickDepositDrawer } from '@/components/deposit/quick-deposit-drawer'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHandle,
  DrawerHeader,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { BetAndGet } from '@/components/vip/bet-and-get'
import { CashDropCode } from '@/components/vip/cash-drop-code'
import { MyBenefitsAccordion } from '@/components/vip/my-benefits-accordion'
import { VipDailyRaces } from '@/components/vip/vip-daily-races'
import { VipHubOverview } from '@/components/vip/vip-hub-overview'
import { VipHubScrollBody } from '@/components/vip/vip-hub-scroll-body'
import { useIsMobile } from '@/hooks/use-mobile'
import { useChatStore } from '@/lib/store/chatStore'
import { cn } from '@/lib/utils'

export type SportsDrawerId = 'account' | 'vip' | 'deposit' | null

const VIP_TABS = ['VIP', 'Daily Races', 'Bet & Get', 'Cash Drop Codes', 'Benefits']

/**
 * Header drawers for the sports page — the same Account / VIP Hub / Wallet panels
 * the casino, home and account pages render, built from the shared pieces.
 * One drawer open at a time (panel exclusivity), matching the other pages.
 */
export function useSportsDrawers() {
  const [open, setOpen] = useState<SportsDrawerId>(null)
  const [vipTab, setVipTab] = useState('VIP')

  const toggle = useCallback(
    (id: Exclude<SportsDrawerId, null>) => {
      setOpen((cur) => {
        if (cur === id) return null
        useChatStore.getState().setIsOpen(false)
        return id
      })
    },
    []
  )

  // Global events other components dispatch (sidebar promos, VIP cards, deposit CTAs)
  useEffect(() => {
    const onVip = (e: Event) => {
      const tab = (e as CustomEvent<{ tab?: string } | undefined>).detail?.tab
      if (tab && VIP_TABS.includes(tab)) setVipTab(tab)
      setOpen((cur) => (cur === 'vip' && !tab ? null : 'vip'))
    }
    const onVipClose = () => setOpen((cur) => (cur === 'vip' ? null : cur))
    const onDeposit = () => setOpen((cur) => (cur === 'deposit' ? null : 'deposit'))
    window.addEventListener('vip:open-drawer', onVip)
    window.addEventListener('vip:close-drawer', onVipClose)
    window.addEventListener('deposit:open-drawer', onDeposit)
    return () => {
      window.removeEventListener('vip:open-drawer', onVip)
      window.removeEventListener('vip:close-drawer', onVipClose)
      window.removeEventListener('deposit:open-drawer', onDeposit)
    }
  }, [])

  return {
    open,
    setOpen,
    vipTab,
    setVipTab,
    openAccount: () => toggle('account'),
    openVip: () => toggle('vip'),
    openDeposit: () => toggle('deposit'),
  }
}

interface SportsDrawersProps {
  open: SportsDrawerId
  setOpen: (id: SportsDrawerId) => void
  vipTab: string
  setVipTab: (tab: string) => void
  balance: number
  displayBalance: number
  onDeposited: (amount: number) => void
}

export function SportsDrawers({
  open,
  setOpen,
  vipTab,
  setVipTab,
  displayBalance,
  onDeposited,
}: SportsDrawersProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [accountView, setAccountView] = useState<'account' | 'notifications'>('account')

  // Quick-deposit state (same shape as the other pages)
  const [depositAmount, setDepositAmount] = useState(25)
  const [useManualAmount, setUseManualAmount] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bitcoin')
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false)
  const [depositStep, setDepositStep] = useState<'started' | 'processing' | 'almost' | 'complete'>('started')
  const [transactionId, setTransactionId] = useState('')
  const [isDepositLoading, setIsDepositLoading] = useState(false)
  const [stepLoading, setStepLoading] = useState({ started: false, processing: false, almost: false, complete: false })

  const resetDeposit = () => {
    setShowDepositConfirmation(false)
    setDepositStep('started')
    setTransactionId('')
    setIsDepositLoading(false)
    setStepLoading({ started: false, processing: false, almost: false, complete: false })
  }

  const goAccount = (section: string) => {
    setOpen(null)
    router.push(`/account?section=${section}`)
  }

  const mobileSheet = isMobile ? { height: '90vh', maxHeight: '90vh', top: 'auto', bottom: 0 } : undefined

  return (
    <>
      {/* ═══ Wallet / Deposit ═══ */}
      <QuickDepositDrawer
        open={open === 'deposit'}
        onOpenChange={(o) => {
          setOpen(o ? 'deposit' : null)
          if (!o) resetDeposit()
        }}
        isMobile={isMobile}
        currencySymbol="$"
        walletAvailableBalance={displayBalance}
        walletFreeBet={500}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        useManualAmount={useManualAmount}
        setUseManualAmount={setUseManualAmount}
        showDepositConfirmation={showDepositConfirmation}
        setShowDepositConfirmation={setShowDepositConfirmation}
        depositStep={depositStep}
        setDepositStep={setDepositStep}
        stepLoading={stepLoading}
        setStepLoading={setStepLoading}
        transactionId={transactionId}
        setTransactionId={setTransactionId}
        isDepositLoading={isDepositLoading}
        setIsDepositLoading={setIsDepositLoading}
        onPlayNow={() => {
          setOpen(null)
          resetDeposit()
          setTimeout(() => onDeposited(depositAmount), 300)
        }}
      />

      {/* ═══ Account ═══ */}
      <Drawer
        open={open === 'account'}
        onOpenChange={(o) => {
          setOpen(o ? 'account' : null)
          if (!o) setAccountView('account')
        }}
        direction={isMobile ? 'bottom' : 'right'}
        shouldScaleBackground={false}
      >
        <DrawerContent
          showOverlay={isMobile}
          className={cn(
            'flex w-full flex-col border-l border-[var(--ds-border)] bg-[var(--ds-page-bg)] text-[var(--ds-fg)] sm:max-w-md',
            isMobile && 'rounded-t-[10px]'
          )}
          style={mobileSheet}
        >
          {isMobile && <DrawerHandle variant="dark" />}
          <DrawerHeader className="flex-shrink-0 px-4 pb-3 pt-4">
            {accountView === 'notifications' ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setAccountView('account')}
                  className="-ml-1 h-9 w-9 p-0 hover:bg-[var(--ds-control-hover)]"
                  aria-label="Back"
                >
                  <IconChevronLeft className="h-5 w-5 text-[var(--ds-fg-muted)]" stroke={2} />
                </Button>
                <h2 className="text-base font-semibold text-[var(--ds-fg)]">Notifications</h2>
              </div>
            ) : (
              <div className="flex w-full items-center gap-2">
                <DrawerClose asChild>
                  <button
                    type="button"
                    className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-hover)]"
                    aria-label="Back"
                  >
                    <IconChevronLeft className="h-5 w-5" stroke={2} />
                  </button>
                </DrawerClose>
                <AccountDrawerIdentity name="ch" accountId="b1767721" />
                <AccountDrawerHeaderActions onBeforeNavigate={() => setOpen(null)} />
              </div>
            )}
          </DrawerHeader>

          <div className={cn('flex-1 overflow-y-auto px-4 pb-4', isMobile ? 'pt-4' : 'pt-6')}>
            {accountView === 'account' ? (
              <>
                <div className="mb-4">
                  <div className="space-y-3 rounded-xl border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--ds-fg-muted)]">Available Balance</span>
                      <span className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                        $
                        <NumberFlow
                          value={displayBalance}
                          format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--ds-fg-muted)]">Free Bet</span>
                      <span className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">$25.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--ds-fg-muted)]">Level</span>
                      <span className="text-sm font-semibold text-[var(--ds-fg-muted)]">Gold · 62</span>
                    </div>
                  </div>
                </div>

                <Separator className="mb-3 bg-[var(--ds-control-hover)]" />

                <div className="mb-3 w-full space-y-0.5">
                  <Button
                    variant="ghost"
                    className="h-10 w-full justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                    onClick={() => setAccountView('notifications')}
                  >
                    <IconBell className="mr-3 size-5 shrink-0 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left">Notifications</span>
                  </Button>
                </div>

                <Separator className="mb-6 bg-[var(--ds-control-hover)]" />

                <div className="mb-2 w-full space-y-1">
                  {[
                    { icon: IconUser, label: 'My Account', section: 'dashboard' },
                    { icon: IconFileText, label: 'Pending Bets', section: 'bet-history' },
                    { icon: IconCurrencyDollar, label: 'Transactions History', section: 'transactions' },
                    { icon: IconTicket, label: 'Bet History', section: 'bet-history' },
                  ].map(({ icon: Icon, label, section }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      className="h-12 w-full min-w-0 justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                      onClick={() => goAccount(section)}
                    >
                      <Icon className="mr-3 size-5 shrink-0 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left">{label}</span>
                    </Button>
                  ))}

                  <Separator className={cn('bg-[var(--ds-control-hover)]', isMobile ? 'my-3' : 'my-4')} />

                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                    onClick={() => setOpen('vip')}
                  >
                    <IconCrown className="mr-3 size-5 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left">VIP Hub</span>
                  </Button>

                  <Separator className="my-2 bg-[var(--ds-control-hover)]" />

                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                  >
                    <IconLogout className="mr-3 size-5 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left">Log Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <NotificationHub />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* ═══ VIP Hub ═══ */}
      <Drawer
        open={open === 'vip'}
        onOpenChange={(o) => setOpen(o ? 'vip' : null)}
        direction={isMobile ? 'bottom' : 'right'}
        shouldScaleBackground={false}
      >
        <DrawerContent
          showOverlay={isMobile}
          className={cn(
            'dark relative flex w-full flex-col overflow-hidden border-l border-[var(--ds-border)] bg-[var(--ds-page-bg)] text-[var(--ds-fg)] sm:max-w-md',
            isMobile && 'rounded-t-[10px]'
          )}
          style={mobileSheet ?? { display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          {isMobile && <DrawerHandle variant="light" />}
          <div className="relative z-50 flex flex-shrink-0 items-center gap-2 px-4 pb-2 pt-4">
            <DrawerClose asChild>
              <button
                type="button"
                className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-control-hover)]"
                aria-label="Back"
              >
                <IconChevronLeft className="h-5 w-5" stroke={2} />
              </button>
            </DrawerClose>
            <h2 className="text-base font-semibold text-[var(--ds-fg)]">VIP Hub</h2>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className={cn('relative z-10 flex-shrink-0 pb-3 pt-2', isMobile ? 'pl-3' : 'pl-4')}>
              <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
                <div className="flex h-auto w-max items-center gap-1 rounded-3xl bg-[var(--ds-control-bg)] p-0.5 backdrop-blur-xl" style={{ marginRight: 16 }}>
                  {VIP_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setVipTab(tab)}
                      className={cn(
                        'relative h-9 shrink-0 whitespace-nowrap rounded-2xl px-4 py-1 text-xs font-medium transition-all duration-300',
                        vipTab === tab
                          ? 'bg-[#fef3c7] text-black'
                          : 'bg-transparent text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <VipHubScrollBody isMobile={isMobile}>
              {vipTab === 'VIP' && <VipHubOverview />}
              {vipTab === 'Benefits' && <MyBenefitsAccordion />}
              {vipTab === 'Daily Races' && <VipDailyRaces />}
              {vipTab === 'Bet & Get' && <BetAndGet />}
              {vipTab === 'Cash Drop Codes' && <CashDropCode />}
            </VipHubScrollBody>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
