'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { AuthLoginBridge } from '@/components/auth/auth-login-bridge'
import DynamicIsland from '@/components/dynamic-island'
import { SiteHeader } from '@/components/navigation/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SportChipNav } from '@/components/sports/sport-chip-nav'
import { SportsDrawers, useSportsDrawers } from '@/components/sports/sports-drawers'
import { SportsSidebar, type SportsFeatureId } from '@/components/sports/sports-sidebar'
import { SPORT_CHIPS, type SportId } from '@/components/sports/mock-data'
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { requestLogin, requestRegister } from '@/lib/auth-session'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useIsMobile } from '@/hooks/use-mobile'
import { useRainBalance } from '@/hooks/use-rain-balance'
import { useTracking } from '@/hooks/use-tracking'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { cn } from '@/lib/utils'

/** Header (64) + fixed sport chip sub-nav (76) */
export const SPORTS_HEADER_HEIGHT = 64
export const SPORTS_SUBNAV_HEIGHT = 76
export const SPORTS_TOP_OFFSET = SPORTS_HEADER_HEIGHT + SPORTS_SUBNAV_HEIGHT

interface SportsShellProps {
  activeSport: SportId
  activeFeature: SportsFeatureId
  onSelectSport: (id: SportId) => void
  onSelectFeature: (id: SportsFeatureId) => void
  /** Hide the site footer (e.g. event page with a sticky tracker column). */
  hideFooter?: boolean
  children: ReactNode
}

/**
 * Shared chrome for every /sports route: global SiteHeader, sports sidebar,
 * fixed sport chip sub-nav, header drawers (account / VIP / wallet) and the mobile dock.
 */
export function SportsShell(props: SportsShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <SportsShellContent {...props} />
    </SidebarProvider>
  )
}

function SportsShellContent({
  activeSport,
  activeFeature,
  onSelectSport,
  onSelectFeature,
  hideFooter = false,
  children,
}: SportsShellProps) {
  const isMobile = useIsMobile()
  const { trackNav } = useTracking('sports')
  const { open: sidebarOpen } = useSidebar()
  const { isLoggedIn } = useAuthSession()
  const [balance, setBalance] = useState(10)
  const [displayBalance, setDisplayBalance] = useState(10)
  useRainBalance(setBalance, setDisplayBalance)

  // Same mounted gate as the account page — isMobile differs between server and client
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const drawers = useSportsDrawers()
  const betCount = useBetslipStore((s) => s.bets.length)
  const betslipOpen = useBetslipStore((s) => s.isOpen)
  const myBetsAlertCount = useBetslipStore((s) => s.myBetsAlertCount)
  const openBetslip = () => {
    const st = useBetslipStore.getState()
    st.setManuallyClosed(false)
    st.setMinimized(false)
    st.setOpen(true)
  }

  const handleDeposited = (amount: number) => {
    const start = displayBalance
    const end = +(balance + amount).toFixed(2)
    setBalance(end)
    const t0 = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - t0) / 1000, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayBalance(+(start + (end - start) * eased).toFixed(2))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  if (!mounted) {
    return <div className="min-h-screen w-full bg-[var(--ds-page-bg)]" />
  }

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-[var(--ds-page-bg)]">
      <AuthLoginBridge />

      {/* Global shell header — same as casino / account */}
      <SiteHeader
        active="sports"
        isLoggedIn={isLoggedIn}
        balance={displayBalance}
        vipDrawerOpen={drawers.open === 'vip'}
        trackNav={trackNav}
        onOpenAccount={() => (isLoggedIn ? drawers.openAccount() : requestLogin())}
        onOpenVip={drawers.openVip}
        onOpenDeposit={() => (isLoggedIn ? drawers.openDeposit() : requestLogin())}
        onLogin={() => requestLogin()}
        onRegister={() => requestRegister()}
      />

      {/* Layout: sidebar + content, below the fixed 64px header */}
      <div
        className="relative flex min-h-screen w-full bg-[var(--ds-page-bg)]"
        style={{ marginTop: `${SPORTS_HEADER_HEIGHT}px` }}
        data-sidebar-full-height
      >
        {!isMobile && (
          <>
            <div
              className="fixed left-0 top-0 z-[101] h-screen transition-[width] duration-200 ease-linear"
              style={{
                width: sidebarOpen ? '16rem' : '3rem',
                backgroundColor: 'var(--ds-sidebar-bg, #2d2d2d)',
              }}
            />
            <div
              aria-hidden
              data-sidebar-rail
              className="transition-[left] duration-200 ease-linear"
              style={{ left: sidebarOpen ? 'calc(16rem - 1px)' : 'calc(3rem - 1px)' }}
            />
          </>
        )}

        <SportsSidebar
          activeSport={activeSport}
          activeFeature={activeFeature}
          onSelectSport={onSelectSport}
          onSelectFeature={(id) => {
            if (id === 'my-bets') useBetslipStore.getState().setMyBetsAlertCount(0)
            onSelectFeature(id)
          }}
        />

        <SidebarInset
          className="overflow-x-hidden bg-[var(--ds-page-bg)] text-[var(--ds-fg)]"
          style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}
        >
          {/* Sub-nav — same fixed glass bar as the casino sub-nav (globals.css pins [data-sub-nav] fixed), holding the sport tabs */}
          <div
            data-sub-nav
            className={cn(
              'fixed z-[90] border-b border-white/10 bg-[var(--ds-page-bg)]/60 pb-1 pt-3 backdrop-blur-xl',
              isMobile ? 'px-0' : 'px-6'
            )}
            style={{
              top: SPORTS_HEADER_HEIGHT,
              left: isMobile ? 0 : sidebarOpen ? '16rem' : '3rem',
              right: 0,
            }}
          >
            <SportChipNav
              chips={SPORT_CHIPS}
              activeId={activeFeature === 'home' ? activeSport : ('' as SportId)}
              onSelect={onSelectSport}
              edgeInset={isMobile ? 12 : 0}
            />
          </div>
          {/* Spacer for the fixed sub-nav (pt-3 + 59px tabs incl. underline + pb-1 + 1px border) */}
          <div aria-hidden className="shrink-0" style={{ height: SPORTS_SUBNAV_HEIGHT }} />

          {children}
          {!hideFooter && <SiteFooter />}
        </SidebarInset>
      </div>

      {/* Mobile dock — betslip / my bets, same as the legacy sportsbook (hidden while the betslip is open) */}
      {isMobile && !betslipOpen && (
        <DynamicIsland
          onBetslipClick={openBetslip}
          onMyBetsClick={() => {
            useBetslipStore.getState().setMyBetsAlertCount(0)
            onSelectFeature('my-bets')
          }}
          isMyBetsActive={activeFeature === 'my-bets'}
          myBetsAlertCount={myBetsAlertCount}
          showBetslip
          betCount={betCount}
          showChat={false}
          showFavorites={false}
          showSearch={false}
        />
      )}

      <SportsDrawers
        open={drawers.open}
        setOpen={drawers.setOpen}
        vipTab={drawers.vipTab}
        setVipTab={drawers.setVipTab}
        balance={balance}
        displayBalance={displayBalance}
        onDeposited={handleDeposited}
      />
    </div>
  )
}
