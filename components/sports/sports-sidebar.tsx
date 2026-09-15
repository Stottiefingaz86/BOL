'use client'

import { useState, type ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  IconBolt,
  IconChevronRight,
  IconHome,
  IconRocket,
  IconSettings,
  IconStar,
  IconTicket,
  IconTrophy,
} from '@tabler/icons-react'
import { BrandLogoPlaceholder } from '@/components/brand/brand-logo-placeholder'
import { MobileOtherNavLinks } from '@/components/navigation/mobile-other-nav-links'
import { NavNewBadge } from '@/components/navigation/nav-new-badge'
import { SidebarPromos } from '@/components/sidebar-promos'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { cn } from '@/lib/utils'
import type { SportId } from './mock-data'

export type SportsFeatureId =
  | 'home'
  | 'my-bets'
  | 'live'
  | 'world-cup'
  | 'boosters'
  | 'sgp'
  | 'mega'

type TablerIconComp = ComponentType<{ className?: string; strokeWidth?: number | string }>

const FEATURES: { id: SportsFeatureId; label: string; icon: TablerIconComp | string }[] = [
  { id: 'home', label: 'Sports Home', icon: IconHome },
  { id: 'my-bets', label: 'My Bets', icon: IconTicket },
  { id: 'live', label: 'Live Betting', icon: IconBolt },
  { id: 'world-cup', label: 'World Cup 2026', icon: IconTrophy },
  { id: 'boosters', label: 'Odds Boosters', icon: IconRocket },
  { id: 'sgp', label: 'Same Game Parlays', icon: '/sports_icons/Same Game Parlays.svg' },
  { id: 'mega', label: 'Mega Parlays', icon: '/sports_icons/Mega Parlays.svg' },
]

const TOP_LEAGUES = [
  { label: 'NBA', icon: '/banners/sports_league/nba.svg', sport: 'basketball' as SportId },
  { label: 'NFL', icon: '/banners/sports_league/NFL.svg', sport: 'football' as SportId },
  { label: 'MLB', icon: '/banners/sports_league/MLB.svg', sport: 'baseball' as SportId },
]

const TOP_SPORTS: { id: SportId; label: string; icon: string }[] = [
  { id: 'baseball', label: 'Baseball', icon: '/sports_icons/baseball.svg' },
  { id: 'basketball', label: 'Basketball', icon: '/sports_icons/Basketball.svg' },
  { id: 'football', label: 'Football', icon: '/sports_icons/football.svg' },
  { id: 'soccer', label: 'Soccer', icon: '/sports_icons/soccer.svg' },
]

const AZ_SPORTS: { id: SportId; label: string; icon: string }[] = [
  { id: 'baseball', label: 'Baseball', icon: '/sports_icons/baseball.svg' },
  { id: 'basketball', label: 'Basketball', icon: '/sports_icons/Basketball.svg' },
  { id: 'mma', label: 'Boxing', icon: '/sports_icons/mma.svg' },
  { id: 'football', label: 'Football', icon: '/sports_icons/football.svg' },
  { id: 'golf', label: 'Golf', icon: '/sports_icons/Golf.svg' },
  { id: 'hockey', label: 'Hockey', icon: '/sports_icons/Hockey.svg' },
  { id: 'racing', label: 'Horse Racing', icon: '/sports_icons/Horse-Racing-101.svg' },
  { id: 'home', label: 'Lacrosse', icon: '/sports_icons/lacrosse.svg' },
  { id: 'mma', label: 'MMA', icon: '/sports_icons/mma.svg' },
  { id: 'home', label: 'Pool', icon: '/sports_icons/pool.svg' },
  { id: 'home', label: 'Rugby', icon: '/sports_icons/rugby.svg' },
  { id: 'soccer', label: 'Soccer', icon: '/sports_icons/soccer.svg' },
  { id: 'home', label: 'Table Tennis', icon: '/sports_icons/table_tennis.svg' },
  { id: 'tennis', label: 'Tennis', icon: '/sports_icons/tennis.svg' },
  { id: 'home', label: 'Volleyball', icon: '/sports_icons/volley.svg' },
]

const MENU_BTN =
  'w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer data-[active=true]:text-white data-[active=true]:font-medium data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]'

const TOOLTIP_CLS = 'bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]'

interface SportsSidebarProps {
  activeSport?: SportId
  activeFeature?: SportsFeatureId
  onSelectSport?: (id: SportId) => void
  onSelectFeature?: (id: SportsFeatureId) => void
}

export function SportsSidebar({
  activeSport = 'home',
  activeFeature = 'home',
  onSelectSport,
  onSelectFeature,
}: SportsSidebarProps) {
  const router = useRouter()
  const { isMobile, setOpenMobile, state: sidebarState } = useSidebar()
  const [topLeaguesOpen, setTopLeaguesOpen] = useState(true)
  // Placed-bet counter on "My Bets" (same badge as the legacy sportsbook nav)
  const placedCount = useBetslipStore((s) => s.placedBets.length)
  const collapsed = sidebarState === 'collapsed' && !isMobile

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false)
  }

  const pickSport = (id: SportId) => {
    onSelectSport?.(id)
    closeMobile()
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      mobileOverlay
      mobileNoDrag
      mobileBg="#2d2d2d"
      mobileOverlayClassName="!bg-black/30 !backdrop-blur-sm"
      className="!bg-[var(--ds-sidebar-bg,#2d2d2d)] !border-r-0 text-white [&>div]:!bg-[var(--ds-sidebar-bg,#2d2d2d)] !h-screen !top-0 !z-[102]"
    >
      {/* Header — logo, same as casino */}
      <SidebarHeader
        className="px-4 h-16 flex items-center flex-shrink-0 overflow-hidden sticky top-0 z-20"
        style={{
          backdropFilter: isMobile ? 'none' : 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: isMobile ? 'none' : 'blur(16px) saturate(180%)',
          backgroundColor: 'var(--ds-sidebar-bg, #2d2d2d)',
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isMobile && (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)] rounded-lg hover:bg-[var(--ds-control-hover)] transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          )}
          <div onClick={() => router.push('/')} className="cursor-pointer">
            <AnimatePresence mode="wait" initial={false}>
              {collapsed ? (
                <motion.div
                  key="b-lockup-sports-desktop"
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: 16, scale: 0.75 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, transition: { duration: 0.08 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18, mass: 0.6, delay: 0.2 }}
                >
                  <BrandLogoPlaceholder variant="lockup" className="w-6 h-6" />
                </motion.div>
              ) : isMobile ? (
                <motion.div
                  key="b-lockup-sports-mobile"
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: 12, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20, mass: 0.6, delay: 0.05 }}
                >
                  <BrandLogoPlaceholder variant="lockup" className="w-7 h-7" />
                </motion.div>
              ) : (
                <motion.div
                  key="full-logo-sports"
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  transition={{ duration: 0.1 }}
                >
                  <BrandLogoPlaceholder variant="full" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SidebarHeader>

      {/* Quick Links — mobile only, same as casino */}
      {isMobile && (
        <div
          className="sticky top-16 z-20 border-b border-white/5"
          style={{
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            backgroundColor: 'var(--ds-sidebar-bg, #2d2d2d)',
          }}
        >
          <div
            className="flex items-center gap-0 scrollbar-hide w-full px-1"
            style={{ overflowX: 'auto', overflowY: 'hidden', touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}
          >
            {[
              { label: 'Home', href: '/' },
              { label: 'Casino', href: '/casino' },
              { label: 'Sports', href: '/sports' },
              { label: 'Poker', href: '/casino?poker=true' },
              { label: 'Promotions', href: '/casino?vipRewardsPage=true' },
            ].map((item) => {
              const isCurrentPage = item.label === 'Sports'
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setOpenMobile(false)
                    if (!isCurrentPage) router.push(item.href)
                  }}
                  className={cn(
                    'flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative',
                    isCurrentPage
                      ? 'text-[var(--ds-fg)] font-bold'
                      : 'text-white/35 font-medium hover:text-[var(--ds-fg-muted)]'
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    {item.label === 'Promotions' && <NavNewBadge />}
                  </span>
                  {isCurrentPage && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    />
                  )}
                </button>
              )
            })}
            <MobileOtherNavLinks />
          </div>
        </div>
      )}

      <SidebarContent className="overflow-y-auto overflow-x-hidden flex flex-col">
        <TooltipProvider>
          <SidebarPromos collapsed={collapsed} />
          <Separator className="bg-[var(--ds-control-hover)] mx-2 group-data-[collapsible=icon]:hidden" />

          {/* FEATURES — square-icon style, same as casino top items */}
          <SidebarGroup className="mt-3">
            <SidebarGroupLabel className="px-2 py-1 text-xs text-[var(--ds-fg-subtle)]">FEATURES</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {FEATURES.map((item) => {
                  const isActive = activeFeature === item.id
                  const Icon = typeof item.icon === 'string' ? null : item.icon
                  const badge = item.id === 'my-bets' ? placedCount : 0
                  return (
                    <SidebarMenuItem key={item.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              onSelectFeature?.(item.id)
                              closeMobile()
                            }}
                            className={MENU_BTN}
                            style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                          >
                            <div
                              className={cn(
                                'relative w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0',
                                isActive ? 'bg-white/20' : 'bg-[var(--ds-control-hover)]'
                              )}
                              style={{ overflow: 'visible' }}
                            >
                              {Icon ? (
                                <Icon strokeWidth={1.5} className="w-4 h-4" />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.icon as string}
                                  alt=""
                                  className="w-4 h-4 object-contain"
                                  style={{ filter: 'brightness(0) invert(1)' }}
                                />
                              )}
                              <AnimatePresence>
                                {badge > 0 && (
                                  <motion.span
                                    key="badge"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                    className="absolute -right-1 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-0.5 shadow-lg"
                                  >
                                    <span className="text-[8px] font-bold leading-none text-white">
                                      {badge > 9 ? '9+' : badge}
                                    </span>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" className={TOOLTIP_CLS}>
                            <p>{item.label}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="bg-[var(--ds-control-hover)] mx-2" />

          {/* TOP LEAGUES — expandable, same chevron pattern as casino sports categories */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="group/collapsible">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setTopLeaguesOpen((v) => !v)
                        }}
                        className={MENU_BTN}
                      >
                        <IconStar strokeWidth={1.5} className="w-5 h-5" />
                        <span>Top Leagues</span>
                        <IconChevronRight
                          className={cn(
                            'w-4 h-4 ml-auto transition-transform duration-300',
                            topLeaguesOpen && 'rotate-90'
                          )}
                        />
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className={TOOLTIP_CLS}>
                        <p>Top Leagues</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <AnimatePresence>
                    {topLeaguesOpen && !collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <SidebarMenuSub>
                          {TOP_LEAGUES.map((league) => (
                            <SidebarMenuSubItem key={league.label}>
                              <SidebarMenuSubButton
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  pickSport(league.sport)
                                }}
                                className="pl-8 text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer flex items-center"
                              >
                                <div className="flex items-center gap-2">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={league.icon} alt="" className="w-3.5 h-3.5 object-contain" />
                                  {league.label}
                                </div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* TOP SPORTS */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 py-1 text-xs text-[var(--ds-fg-subtle)]">TOP SPORTS</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {TOP_SPORTS.map((sport) => {
                  const isActive = activeSport === sport.id && activeFeature === 'home'
                  return (
                    <SidebarMenuItem key={sport.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              pickSport(sport.id)
                            }}
                            className={MENU_BTN}
                            style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={sport.icon} alt="" className="w-5 h-5 object-contain" />
                            <span>{sport.label}</span>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" className={TOOLTIP_CLS}>
                            <p>{sport.label}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* A - Z */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 py-1 text-xs text-[var(--ds-fg-subtle)]">A - Z</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {AZ_SPORTS.map((sport) => (
                  <SidebarMenuItem key={sport.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            pickSport(sport.id)
                          }}
                          className={MENU_BTN}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sport.icon} alt="" className="w-5 h-5 object-contain" />
                          <span>{sport.label}</span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className={TOOLTIP_CLS}>
                          <p>{sport.label}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Settings — same as legacy sportsbook */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton className={MENU_BTN} onClick={closeMobile}>
                        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 bg-[var(--ds-control-hover)]">
                          <IconSettings strokeWidth={1.5} className="w-4 h-4" />
                        </div>
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className={TOOLTIP_CLS}>
                        <p>Settings</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </TooltipProvider>
        {isMobile && <div className="flex-shrink-0 h-24" />}
      </SidebarContent>
    </Sidebar>
  )
}
