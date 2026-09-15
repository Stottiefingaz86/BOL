'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { IconChevronDown, IconX } from '@tabler/icons-react'
import { BrandLogoPlaceholder } from '@/components/brand/brand-logo-placeholder'
import { HeaderUserControls } from '@/components/navigation/header-user-controls'
import { NavNewBadge } from '@/components/navigation/nav-new-badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { useChatStore } from '@/lib/store/chatStore'
import { cn } from '@/lib/utils'

export type SiteHeaderProduct = 'casino' | 'sports' | 'poker' | 'promotions' | null

interface SiteHeaderProps {
  /** Which top-level product pill is highlighted. */
  active: SiteHeaderProduct
  isLoggedIn: boolean
  balance: number
  vipDrawerOpen?: boolean
  onOpenAccount: () => void
  onOpenVip: () => void
  onOpenDeposit: () => void
  onLogin?: () => void
  onRegister?: () => void
  trackNav?: (id: string, label: string) => void
  /** Mobile: shifts header down when the quick-links strip is open. */
  quickLinksOpen?: boolean
}

const NAV_BTN = cn(
  'h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial',
  'hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors',
  'text-[var(--ds-fg-muted)] cursor-pointer'
)

/**
 * Global shell header — the same fixed top nav used on casino / account / home.
 * Left: sidebar collapse toggle + divider + product pills (Casino / Sports / Poker / Promotions / Other).
 * Right: HeaderUserControls.
 */
export function SiteHeader({
  active,
  isLoggedIn,
  balance,
  vipDrawerOpen = false,
  onOpenAccount,
  onOpenVip,
  onOpenDeposit,
  onLogin,
  onRegister,
  trackNav,
  quickLinksOpen = false,
}: SiteHeaderProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const { open: sidebarOpen, openMobile, setOpenMobile, toggleSidebar } = useSidebar()

  const go = (id: string, label: string, href: string) => {
    trackNav?.(id, label)
    router.push(href)
  }

  const pill = (
    <motion.div
      layoutId="siteNavPill"
      layout="position"
      className="absolute inset-0 rounded-small"
      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
      initial={false}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    />
  )

  return (
    <motion.header
      data-nav-header
      className={cn(
        'border-b border-[var(--ds-border)] h-16 flex items-center justify-between z-[101] fixed right-0 transition-[left,background-color] duration-200 ease-linear',
        isMobile ? 'left-0 px-3' : sidebarOpen ? 'left-[16rem] px-6' : 'left-[3rem] px-6',
        isMobile && quickLinksOpen && 'border-t-0'
      )}
      initial={false}
      animate={{ top: isMobile ? (quickLinksOpen ? 40 : 0) : 0 }}
      transition={isMobile ? { type: 'tween', ease: 'linear', duration: 0.3 } : {}}
      style={{
        backgroundColor: 'var(--ds-nav-bg, #2D2E2C)',
        pointerEvents: 'auto',
        zIndex: 101,
        position: 'fixed',
        boxShadow: '0 -200px 0 0 var(--ds-nav-bg, #2D2E2C)',
      }}
    >
      <div className={cn('flex items-center', isMobile ? 'gap-1.5' : 'gap-6')}>
        {isMobile && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!openMobile) useChatStore.getState().setIsOpen(false)
                setOpenMobile(!openMobile)
              }}
            >
              {openMobile ? (
                <IconX className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <svg className="h-4 w-4 text-[var(--ds-fg)]" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="2.75" width="14" height="2" rx="1" fill="currentColor" />
                  <rect x="1" y="7" width="10" height="2" rx="1" fill="currentColor" />
                  <rect x="1" y="11.25" width="6" height="2" rx="1" fill="currentColor" />
                </svg>
              )}
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <div
              className="relative flex h-8 w-[110px] shrink-0 cursor-pointer items-center"
              onClick={() => router.push('/')}
            >
              <BrandLogoPlaceholder variant="full" className="h-full w-full" />
            </div>
          </>
        )}

        {!isMobile && (
          <nav className="flex-1 flex items-center z-[110] -ml-1" style={{ pointerEvents: 'auto' }}>
            <SidebarMenu className="flex flex-row items-center gap-2">
              <div className="flex items-center gap-1.5 mr-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSidebar()}
                  className="h-8 w-8 text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)] focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
                <div className="w-px h-5 shrink-0 bg-white/25" aria-hidden />
              </div>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(NAV_BTN, active === 'casino' && '!text-white')}
                  data-active={active === 'casino'}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); go('casino', 'Casino', '/casino') }}
                >
                  {active === 'casino' && pill}
                  <span className="relative z-10">Casino</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(NAV_BTN, active === 'sports' && '!text-white')}
                  data-active={active === 'sports'}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); go('sports', 'Sports', '/sports') }}
                >
                  {active === 'sports' && pill}
                  <span className="relative z-10">Sports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(NAV_BTN, active === 'poker' && '!text-white')}
                  data-active={active === 'poker'}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); go('poker', 'Poker', '/casino?poker=true') }}
                >
                  {active === 'poker' && pill}
                  <span className="relative z-10">Poker</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(NAV_BTN, 'min-w-[100px]', active === 'promotions' && '!text-white')}
                  data-active={active === 'promotions'}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    go('promotions', 'Promotions', '/casino?vipRewardsPage=true')
                  }}
                >
                  {active === 'promotions' && pill}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    Promotions
                    <NavNewBadge />
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        'h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center',
                        'hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors',
                        'text-[var(--ds-fg-muted)] data-[state=open]:text-[var(--ds-fg)] data-[state=open]:bg-[var(--ds-control-hover)]'
                      )}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <span className="flex items-center gap-1">
                        Other
                        <IconChevronDown className="h-3 w-3" />
                      </span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={5}
                    className="w-[200px] bg-[var(--ds-surface-raised)] border-[var(--ds-border)] z-[120]"
                    style={{ zIndex: 120 }}
                  >
                    {[
                      ['Contests', '/promotions/contests'],
                      ['Esports', '/esports'],
                      ['Racebook', '/racebook'],
                      ['VIP Rewards', '/casino?vipRewardsPage=true'],
                    ].map(([label, href]) => (
                      <DropdownMenuItem
                        key={label}
                        className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                      >
                        <a href={href} className="w-full">{label}</a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </nav>
        )}
      </div>

      <HeaderUserControls
        isLoggedIn={isLoggedIn}
        balance={balance}
        currencySymbol="$"
        vipDrawerOpen={vipDrawerOpen}
        onOpenAccount={onOpenAccount}
        onOpenVip={onOpenVip}
        onOpenDeposit={onOpenDeposit}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    </motion.header>
  )
}
