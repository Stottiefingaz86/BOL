'use client'

import { useEffect, useState } from 'react'
import { AuthLoginBridge } from '@/components/auth/auth-login-bridge'
import DynamicIsland from '@/components/dynamic-island'
import { SiteHeader } from '@/components/navigation/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SportChipNav } from '@/components/sports/sport-chip-nav'
import { SportsDrawers, useSportsDrawers } from '@/components/sports/sports-drawers'
import { MyBetsPanel } from '@/components/sports/my-bets-panel'
import { SportsHome } from '@/components/sports/sports-home'
import { SportsSidebar, type SportsFeatureId } from '@/components/sports/sports-sidebar'
import { SPORT_CHIPS, type SportId } from '@/components/sports/mock-data'
import { requestLogin, requestRegister } from '@/lib/auth-session'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useIsMobile } from '@/hooks/use-mobile'
import { useRainBalance } from '@/hooks/use-rain-balance'
import { useTracking } from '@/hooks/use-tracking'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'

function SportsPageContent() {
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
  const openBetslip = () => {
    const st = useBetslipStore.getState()
    st.setManuallyClosed(false)
    st.setMinimized(false)
    st.setOpen(true)
  }
  const [activeSport, setActiveSport] = useState<SportId>('home')
  const [activeFeature, setActiveFeature] = useState<SportsFeatureId>('home')

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
        style={{ marginTop: '64px' }}
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
          onSelectSport={(id) => {
            setActiveSport(id)
            setActiveFeature('home')
          }}
          onSelectFeature={(id) => {
            setActiveFeature(id)
            if (id === 'home') setActiveSport('home')
            if (id === 'my-bets') useBetslipStore.getState().setMyBetsAlertCount(0)
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
              'fixed z-[90] border-b border-white/10 bg-[var(--ds-page-bg)]/60 py-3 backdrop-blur-xl',
              isMobile ? 'px-0' : 'px-6'
            )}
            style={{
              top: 64,
              left: isMobile ? 0 : sidebarOpen ? '16rem' : '3rem',
              right: 0,
            }}
          >
            <SportChipNav
              chips={SPORT_CHIPS}
              activeId={activeSport}
              onSelect={(id) => {
                setActiveSport(id)
                setActiveFeature('home')
              }}
              className="pb-0"
              edgeInset={isMobile ? 12 : 0}
            />
          </div>
          {/* Spacer for the fixed sub-nav (py-3 + 51px tabs + 1px border) */}
          <div aria-hidden className="h-[76px] shrink-0" />

          {activeFeature === 'my-bets' ? (
            <MyBetsPanel
              onBrowse={() => {
                setActiveFeature('home')
                setActiveSport('home')
              }}
            />
          ) : (
            <SportsHome activeSport={activeSport} onActiveSportChange={setActiveSport} />
          )}
          <SiteFooter />
        </SidebarInset>
      </div>

      {/* Mobile dock — betslip / my bets, same as the legacy sportsbook (hidden while the betslip is open) */}
      {isMobile && !betslipOpen && (
        <DynamicIsland
          onBetslipClick={openBetslip}
          onMyBetsClick={() => {
            setActiveFeature('my-bets')
            useBetslipStore.getState().setMyBetsAlertCount(0)
          }}
          myBetsAlertCount={useBetslipStore.getState().myBetsAlertCount}
          isMyBetsActive={activeFeature === 'my-bets'}
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

export default function SportsPage() {
  return (
    <SidebarProvider defaultOpen>
      <SportsPageContent />
    </SidebarProvider>
  )
}
