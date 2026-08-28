'use client'

import { VipHubScrollBody } from '@/components/vip/vip-hub-scroll-body'
import { SiteFooter } from '@/components/site-footer'
import { HeaderUserControls } from '@/components/navigation/header-user-controls'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import React, { Suspense } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTracking } from '@/hooks/use-tracking'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {
  IconLayoutDashboard,
  IconFileText,
  IconCurrencyDollar,
  IconGift,
  IconCreditCard,
  IconUserPlus,
  IconRocket,
  IconCrown,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconX,
  IconMenu2,
  IconWallet,
  IconUser,
  IconLifebuoy,
  IconHome,
  IconBallFootball,
  IconSearch,
  IconLoader2,
  IconCheck,
  IconTicket,
  IconClock,
  IconArrowRight,
  IconDownload,
  IconBell,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconShare,
  IconSettings,
  IconLock,
  IconShield,
  IconHistory,
  IconBuilding,
  IconHelpCircle,
  IconFilter,
  IconMessageCircle2,
  IconBrandTelegram,
  IconCoins,
  IconTrophy,
  IconFlame,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconLogout,
} from '@tabler/icons-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MobileOtherNavLinks } from '@/components/navigation/mobile-other-nav-links'
import {
  DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS,
  SIDEBAR_FOOTER_NEED_HELP,
  SIDEBAR_FOOTER_PROMOTIONS,
  SIDEBAR_FOOTER_VIP_HUB,
  SIDEBAR_FOOTER_WALLET,
} from '@/lib/sidebar-footer-nav'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerHandle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { QuickDepositDrawer } from '@/components/deposit/quick-deposit-drawer'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import {
  Tabs as AnimateTabs,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import NumberFlow from '@number-flow/react'
import DynamicIsland from '@/components/dynamic-island'
import ChatNavToggle from '@/components/chat/chat-nav-toggle'
import { NotificationHub } from '@/components/account/notification-hub'
import { AccountDrawerIdentity } from '@/components/account/account-drawer-identity'
import { AccountDrawerHeaderActions } from '@/components/account/account-drawer-header-actions'
import { useChatStore } from '@/lib/store/chatStore'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { useRainBalance } from '@/hooks/use-rain-balance'
import { colorTokenMap } from '@/lib/agent/designSystem'
import type { ProductToggles } from '@/components/design-customizer'
import { StreakCounter } from '@/components/vip/streak-counter'
import { VipBenefitTiles } from '@/components/vip/vip-benefit-tiles'
import { VipHubOverview } from '@/components/vip/vip-hub-overview'
import { VipDailyRaces } from '@/components/vip/vip-daily-races'
import { LevelUpSpinner } from '@/components/vip/level-up-spinner'
import { RedeemPromoCode } from '@/components/vip/redeem-promo-code'
import { MyBenefitsAccordion } from '@/components/vip/my-benefits-accordion'
import { ReloadClaim } from '@/components/vip/reload-claim'
import { CashDropCode } from '@/components/vip/cash-drop-code'
import { BetAndGet } from '@/components/vip/bet-and-get'
import { RewardCrates } from '@/components/vip/reward-crates'
import { VipTierProgressCard } from '@/components/vip/vip-tier-progress-card'
import { DailySpinCard } from '@/components/promotions/daily-spin-card'
import { SidebarPromos } from '@/components/sidebar-promos'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { NavNewBadge } from '@/components/navigation/nav-new-badge'
import { BrandLogoPlaceholder } from '@/components/brand/brand-logo-placeholder'

// ═══════════════════════════════════════════════════════════
// My Account Page
// ═══════════════════════════════════════════════════════════

type AccountSection = 'dashboard' | 'bet-history' | 'transactions' | 'my-bonus' | 'payments' | 'refer' | 'security' | 'profile'

// ─── Sample bet data (matching sports pages) ───
const sampleBets: Array<{
  id: number; amount: number; selection: string; market: string; odds: string;
  status: string | null; wonAmount?: number; cashedOutAmount?: number; cashOutValue?: number;
  sport: string; type: 'single' | 'parlay'; legCount?: number;
  team1: string; team2: string; league: string; country: string;
  isLive: boolean; liveInfo?: { period: string; time: string; score: { team1: number; team2: number } };
  finalScore?: { team1: number; team2: number };
  betId: string; datePlaced: string;
  legs?: Array<{ selection: string; market: string; team1: string; team2: string; odds: string; league: string; isLive?: boolean; liveInfo?: { period: string; time: string; score: { team1: number; team2: number } } }>;
}> = [
  { id: 1, amount: 10, selection: 'Chernomorets Odessa', market: '3 Way - Regulation', odds: '+9900', status: null, sport: 'soccer', type: 'single', team1: 'Chernomorets Odessa', team2: 'Dynamo Kyiv', league: 'Ukrainian Premier League', country: 'Ukraine', isLive: false, betId: '765735663537735', datePlaced: '25 Oct 2024, 11:21:54am CET' },
  { id: 2, amount: 10, selection: 'Tottenham', market: 'Match Winner', odds: '+120', status: 'won', wonAmount: 20, sport: 'soccer', type: 'single', team1: 'Tottenham', team2: 'Newcastle', league: 'Premier League', country: 'England', isLive: false, finalScore: { team1: 3, team2: 1 }, betId: '765735663537736', datePlaced: '25 Oct 2024, 10:15:22am CET' },
  { id: 3, amount: 10, selection: '2-Team Parlay', market: 'B. Krejcikova +3.5, Manchester United FC', odds: '+352', status: null, sport: 'tennis', type: 'parlay', team1: '', team2: '', league: '', country: '', isLive: true, liveInfo: { period: '2nd Set', time: '4-3', score: { team1: 1, team2: 0 } }, betId: '765735663537737', datePlaced: '25 Oct 2024, 11:00:00am CET', cashOutValue: 4.20, legs: [{ selection: 'B. Krejcikova +3.5', market: 'Game Spread', team1: 'B. Krejcikova', team2: 'A. Sabalenka', odds: '+150', league: 'Roland Garros', isLive: true, liveInfo: { period: '2nd Set', time: '4-3', score: { team1: 1, team2: 0 } } }, { selection: 'Manchester United FC', market: 'Match Winner', team1: 'Manchester United', team2: 'Wolverhampton', odds: '-110', league: 'Premier League' }] },
  { id: 4, amount: 10, selection: 'LA Clippers +12.5', market: 'Match Spread', odds: '+120', status: 'lost', sport: 'basketball', type: 'single', team1: 'LA Clippers', team2: 'Boston Celtics', league: 'NBA', country: 'USA', isLive: false, finalScore: { team1: 98, team2: 121 }, betId: '765735663537738', datePlaced: '24 Oct 2024, 09:30:00pm CET' },
  { id: 5, amount: 10, selection: '3-Team Parlay', market: 'Robin Pacha To Win Set 3, Under 16.5 Games', odds: '+4630', status: null, sport: 'tennis', type: 'parlay', legCount: 1, team1: '', team2: '', league: '', country: '', isLive: false, betId: '765735663537739', datePlaced: '25 Oct 2024, 10:45:00am CET', legs: [{ selection: 'Robin Pacha To Win Set 3', market: 'Set Winner', team1: 'Robin Pacha', team2: 'J. Sinner', odds: '+200', league: 'Roland Garros' }, { selection: 'Under 16.5 Games', market: 'Total Games', team1: 'Robin Pacha', team2: 'J. Sinner', odds: '+180', league: 'Roland Garros' }, { selection: 'Liverpool', market: 'Match Winner', team1: 'Liverpool', team2: 'Brighton', odds: '-120', league: 'Premier League' }] },
  { id: 6, amount: 10, selection: 'Atletico Madrid', market: 'Match Winner', odds: '+120', status: null, sport: 'soccer', type: 'single', team1: 'Atletico Madrid', team2: 'Leganes', league: 'La Liga', country: 'Spain', isLive: true, liveInfo: { period: '2nd Half', time: "50'", score: { team1: 0, team2: 2 } }, betId: '765735663537740', datePlaced: '25 Oct 2024, 11:21:54am CET', cashOutValue: 1.21 },
  { id: 7, amount: 10, selection: 'Chelsea', market: 'Match Winner', odds: '+120', status: null, sport: 'soccer', type: 'single', team1: 'Chelsea', team2: 'West Ham', league: 'Premier League', country: 'England', isLive: true, liveInfo: { period: '1st Half', time: "44'", score: { team1: 0, team2: 2 } }, betId: '765735663537741', datePlaced: '25 Oct 2024, 11:21:54am CET', cashOutValue: 3.45 },
  { id: 8, amount: 10, selection: 'Carlos Alcaraz', market: 'Next Set', odds: '+120', status: null, sport: 'tennis', type: 'single', team1: 'Carlos Alcaraz', team2: 'N. Djokovic', league: 'Roland Garros', country: 'France', isLive: true, liveInfo: { period: '4th Set', time: '5-4', score: { team1: 2, team2: 1 } }, betId: '765735663537742', datePlaced: '25 Oct 2024, 11:05:00am CET', cashOutValue: 6.80 },
  { id: 9, amount: 10, selection: 'Cadiz', market: 'Match Winner', odds: '+120', status: 'cashed_out', cashedOutAmount: 9, sport: 'soccer', type: 'single', team1: 'Cadiz', team2: 'Sevilla', league: 'La Liga', country: 'Spain', isLive: false, finalScore: { team1: 1, team2: 2 }, betId: '765735663537743', datePlaced: '24 Oct 2024, 08:00:00pm CET' },
  { id: 10, amount: 10, selection: 'Manchester City', market: 'Match Winner', odds: '+120', status: null, sport: 'soccer', type: 'single', team1: 'Manchester City', team2: 'Aston Villa', league: 'Premier League', country: 'England', isLive: false, betId: '765735663537744', datePlaced: '25 Oct 2024, 09:00:00am CET' },
  { id: 11, amount: 10, selection: 'Golden State Warriors', market: 'Money Line', odds: '-110', status: null, sport: 'basketball', type: 'single', team1: 'Golden State Warriors', team2: 'LA Lakers', league: 'NBA', country: 'USA', isLive: false, betId: '765735663537745', datePlaced: '25 Oct 2024, 08:30:00am CET' },
  { id: 12, amount: 10, selection: 'New York Yankees', market: 'Run Line -1.5', odds: '+145', status: 'won', wonAmount: 24.50, sport: 'baseball', type: 'single', team1: 'New York Yankees', team2: 'Houston Astros', league: 'MLB', country: 'USA', isLive: false, finalScore: { team1: 7, team2: 3 }, betId: '765735663537746', datePlaced: '24 Oct 2024, 07:00:00pm CET' },
  { id: 13, amount: 10, selection: 'Kansas City Chiefs', market: 'Point Spread -3.5', odds: '-105', status: 'lost', sport: 'football', type: 'single', team1: 'Kansas City Chiefs', team2: 'Buffalo Bills', league: 'NFL', country: 'USA', isLive: false, finalScore: { team1: 20, team2: 27 }, betId: '765735663537747', datePlaced: '24 Oct 2024, 06:00:00pm CET' },
]

const sportIconMap: Record<string, string> = {
  soccer: '/sports_icons/soccer.svg',
  tennis: '/sports_icons/tennis.svg',
  basketball: '/sports_icons/Basketball.svg',
  baseball: '/sports_icons/baseball.svg',
  football: '/sports_icons/football.svg',
  hockey: '/sports_icons/Hockey.svg',
  mma: '/sports_icons/mma.svg',
  rugby: '/sports_icons/rugby.svg',
}

const paymentMethodIconMap: Record<string, string> = {
  Bitcoin: '/icons/crypto/btc.svg',
  Ethereum: '/icons/crypto/eth.svg',
  'Credit Card': '',
  'Wire Transfer': '',
  System: '',
}

function PreviewRowIcon({
  src,
  fallback,
}: {
  src?: string | null
  fallback: React.ReactNode
}) {
  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] ring-1 ring-white/[0.06]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-3.5 object-contain opacity-80" />
      ) : (
        fallback
      )}
    </div>
  )
}

// ─── Bonus data ───
type BonusItem = {
  id: string; code: string; amount: string; rollover: string; date: string; status: string; statusColor: string;
}
const bonusData: BonusItem[] = [
  { id: '1', code: '1000Happy', amount: '$4.00', rollover: '$0.00', date: '11/04/2014', status: 'ACTIVE', statusColor: 'bg-green-500' },
  { id: '2', code: 'No Promo Code', amount: '$5.00', rollover: '$0.00', date: '11/04/2014', status: 'EXPIRED', statusColor: 'bg-orange-500' },
  { id: '3', code: 'No Promo Code', amount: '$5.00', rollover: '$0.00', date: '11/04/2014', status: 'EXPIRED', statusColor: 'bg-orange-500' },
  { id: '4', code: 'Sports2025', amount: '$10.00', rollover: '$8.00', date: '11/04/2014', status: 'CANCELLED', statusColor: 'bg-gray-400' },
  { id: '5', code: '1000Happy', amount: '$4.00', rollover: '$0.00', date: '11/04/2014', status: 'COMPLETE', statusColor: 'bg-blue-500' },
  { id: '6', code: '1000Happy', amount: '$4.00', rollover: '$0.00', date: '11/04/2014', status: 'ACTIVE', statusColor: 'bg-green-500' },
  { id: '7', code: 'No Promo Code', amount: '$5.00', rollover: '$0.00', date: '11/04/2014', status: 'EXPIRED', statusColor: 'bg-orange-500' },
  { id: '8', code: 'Sports2025', amount: '$10.00', rollover: '$8.00', date: '11/04/2014', status: 'CANCELLED', statusColor: 'bg-gray-400' },
]

/** Dashboard refer widget — cash from GGR share on referred friends’ play/deposits */
const referralDashboardStats = {
  ggrSharePercent: 25,
  friendsReferred: 3,
  totalEarned: 184.5,
  friendsDeposited: 2460,
  pending: 12.4,
}

// ─── Transactions data ───
type Transaction = {
  id: string; date: string; type: string; method: string; amount: string; status: string; reference: string;
}
const transactionsData: Transaction[] = [
  { id: '1', date: '02/18/2026', type: 'Deposit', method: 'Bitcoin', amount: '+$500.00', status: 'COMPLETED', reference: 'TXN-8847291' },
  { id: '2', date: '02/15/2026', type: 'Withdrawal', method: 'Bitcoin', amount: '-$200.00', status: 'COMPLETED', reference: 'TXN-8847290' },
  { id: '3', date: '02/12/2026', type: 'Deposit', method: 'Credit Card', amount: '+$100.00', status: 'COMPLETED', reference: 'TXN-8847289' },
  { id: '4', date: '02/10/2026', type: 'Bonus', method: 'System', amount: '+$25.00', status: 'CREDITED', reference: 'TXN-8847288' },
  { id: '5', date: '02/08/2026', type: 'Withdrawal', method: 'Bitcoin', amount: '-$1,000.00', status: 'PENDING', reference: 'TXN-8847287' },
  { id: '6', date: '02/05/2026', type: 'Deposit', method: 'Ethereum', amount: '+$250.00', status: 'COMPLETED', reference: 'TXN-8847286' },
  { id: '7', date: '02/01/2026', type: 'Deposit', method: 'Bitcoin', amount: '+$1,500.00', status: 'COMPLETED', reference: 'TXN-8847285' },
  { id: '8', date: '01/28/2026', type: 'Withdrawal', method: 'Wire Transfer', amount: '-$500.00', status: 'COMPLETED', reference: 'TXN-8847284' },
]

// ═══════════════════════════════════════════════════════════
// Dashboard — Favourite casino games data
// ═══════════════════════════════════════════════════════════
const favouriteCasinoGames = [
  { title: 'Gold Nugget Rush', image: '/games/square/goldNuggetRush.png', provider: 'Betsoft' },
  { title: 'MegaCrush', image: '/games/square/megacrush.png', provider: 'Betsoft' },
  { title: 'Mr Mammoth', image: '/games/square/mrMammoth.png', provider: 'Betsoft' },
  { title: 'Cocktail Wheel', image: '/games/square/cocktailWheel.png', provider: 'House' },
  { title: 'Take The Bank', image: '/games/square/takeTheBank.png', provider: 'Betsoft' },
  { title: 'Hooked on Fishing', image: '/games/square/hookedOnFishing.png', provider: 'Betsoft' },
  { title: 'Roulette', image: '/games/square/roulette.png', provider: 'Fresh Deck' },
  { title: 'Blackjack', image: '/games/square/blackjack.png', provider: 'Fresh Deck' },
  { title: 'Baccarat', image: '/games/square/baccarat.png', provider: 'VIG' },
  { title: 'Gold Nugget Rush 2', image: '/games/square/goldNuggetRush2.png', provider: 'Betsoft' },
]

const accountPnlByWeek = {
  thisWeek: [
    { day: 'Mon', date: 'Mar 02', amount: 140 },
    { day: 'Tue', date: 'Mar 03', amount: -60 },
    { day: 'Wed', date: 'Mar 04', amount: 95 },
    { day: 'Thu', date: 'Mar 05', amount: -20 },
    { day: 'Fri', date: 'Mar 06', amount: 170 },
    { day: 'Sat', date: 'Mar 07', amount: 75 },
    { day: 'Sun', date: 'Mar 08', amount: 130 },
  ],
  lastWeek: [
    { day: 'Mon', date: 'Feb 24', amount: 35 },
    { day: 'Tue', date: 'Feb 25', amount: -110 },
    { day: 'Wed', date: 'Feb 26', amount: 65 },
    { day: 'Thu', date: 'Feb 27', amount: -85 },
    { day: 'Fri', date: 'Feb 28', amount: 120 },
    { day: 'Sat', date: 'Mar 01', amount: -30 },
    { day: 'Sun', date: 'Mar 02', amount: 90 },
  ],
}

// ═══════════════════════════════════════════════════════════
// Total Rewards Card — exact copy from casino/page.tsx
// ═══════════════════════════════════════════════════════════
function TotalRewardsCard() {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const targetValue = 673.28

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldAnimate) {
            setShouldAnimate(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
      observer.disconnect()
    }
  }, [shouldAnimate])

  return (
    <div ref={containerRef} className="flex-shrink-0 w-full md:w-[280px]">
      <Card className="bg-[var(--ds-control-bg)] dark:bg-[var(--ds-control-bg)] bg-gray-100 dark:bg-[var(--ds-control-bg)] border-[var(--ds-border)] dark:border-[var(--ds-border)] border-gray-200 dark:border-[var(--ds-border)] transition-colors duration-300 h-full">
        <CardContent className="p-4 flex flex-col justify-center items-center h-full text-center">
          <CardTitle className="text-xs text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-800 dark:text-[var(--ds-fg-muted)] mb-2 transition-colors duration-300">Total Rewards Claimed</CardTitle>
          <div className="text-2xl font-bold text-[var(--ds-fg)] dark:text-[var(--ds-fg)] text-gray-900 dark:text-[var(--ds-fg)] transition-colors duration-300">
            $<NumberFlow 
              value={shouldAnimate ? targetValue : 0}
              format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Dashboard — Recent Transactions Data
// ═══════════════════════════════════════════════════════════
const recentTransactions = [
  { id: 1, type: 'deposit' as const, method: 'Bitcoin', amount: 500, date: 'Feb 18', status: 'completed' as const },
  { id: 2, type: 'withdraw' as const, method: 'Bitcoin', amount: 200, date: 'Feb 15', status: 'completed' as const },
  { id: 3, type: 'deposit' as const, method: 'Credit Card', amount: 100, date: 'Feb 12', status: 'completed' as const },
  { id: 4, type: 'deposit' as const, method: 'Bonus', amount: 25, date: 'Feb 10', status: 'completed' as const },
  { id: 5, type: 'withdraw' as const, method: 'Bitcoin', amount: 1000, date: 'Feb 8', status: 'processing' as const },
]

// ═══════════════════════════════════════════════════════════
// Dashboard Section — Built from VIP Rewards page layout
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// Dashboard Bet History (last 10 bets with filters)
// ═══════════════════════════════════════════════════════════
function DashboardBetHistory({ onNavigate }: { onNavigate: (section: AccountSection) => void }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cash_out' | 'in_play' | 'pending' | 'graded'>('all')
  const [expandedBetId, setExpandedBetId] = useState<number | null>(null)
  const filterTabs = [
    { key: 'all' as const, label: 'All', count: sampleBets.length },
    { key: 'cash_out' as const, label: 'Cash Out', count: sampleBets.filter((b) => b.cashOutValue || b.status === 'cashed_out').length },
    { key: 'in_play' as const, label: 'In-Play', count: sampleBets.filter((b) => b.isLive && !b.status).length },
    { key: 'pending' as const, label: 'Pending', count: sampleBets.filter((b) => !b.status && !b.isLive).length },
    { key: 'graded' as const, label: 'Graded', count: null },
  ]

  const filteredBets = sampleBets.filter(bet => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'cash_out') return bet.cashOutValue || bet.status === 'cashed_out'
    if (activeFilter === 'in_play') return bet.isLive && !bet.status
    if (activeFilter === 'pending') return !bet.status && !bet.isLive
    if (activeFilter === 'graded') return bet.status === 'won' || bet.status === 'lost' || bet.status === 'void' || bet.status === 'cashed_out'
    return true
  }).slice(0, 10)

  const getStatusBadge = (bet: typeof sampleBets[0]) => {
    if (bet.status === 'won') return <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 whitespace-nowrap">WON {'$'}{bet.wonAmount?.toFixed(2)}</span>
    if (bet.status === 'lost') return <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full border border-red-500/30 text-red-400 bg-red-500/10 whitespace-nowrap">LOST</span>
    if (bet.status === 'cashed_out') return <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 whitespace-nowrap">CASHED OUT {'$'}{bet.cashedOutAmount?.toFixed(2)}</span>
    return null
  }

  const getPotentialReturns = (amount: number, odds: string) => {
    const oddsNum = parseInt(odds)
    if (oddsNum > 0) return amount + (amount * oddsNum / 100)
    return amount + (amount * 100 / Math.abs(oddsNum))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[var(--ds-fg)]">Recent Bets</h2>
        <Button
          variant="ghost"
          onClick={() => onNavigate('bet-history')}
          className="text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto rounded-small"
        >
          View All
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto scrollbar-hide">
        {filterTabs.map((tab) => (
            <button
            key={tab.key}
            onClick={() => { setActiveFilter(tab.key); setExpandedBetId(null) }}
              className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0",
              activeFilter === tab.key
                ? "bg-[var(--ds-control-hover)] text-[var(--ds-fg)] border border-white/20"
                : "text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] border border-transparent"
              )}
            >
            {tab.label}
            {tab.count !== null && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                activeFilter === tab.key ? "bg-white/15 text-[var(--ds-fg)]" : "bg-[var(--ds-control-bg)] text-[var(--ds-fg-subtle)]"
              )}>
                {tab.count}
              </span>
              )}
            </button>
          ))}
      </div>

      {/* Bet list */}
      <Card className="bg-[var(--ds-control-bg)] border-[var(--ds-border)] overflow-hidden">
        <div className="divide-y divide-white/[0.06]">
          {filteredBets.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--ds-fg-subtle)]">No bets found</div>
          ) : (
            filteredBets.map((bet) => (
              <div key={bet.id}>
                <div
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                  onClick={() => setExpandedBetId(expandedBetId === bet.id ? null : bet.id)}
                >
                  {/* Sport icon */}
                  <div className="w-7 h-7 rounded-small flex-shrink-0 bg-[var(--ds-overlay)] flex items-center justify-center">
                    <img src={sportIconMap[bet.sport] || '/sports_icons/soccer.svg'} alt={bet.sport} className="w-4 h-4 opacity-50" />
                  </div>

                  {/* Bet info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[var(--ds-fg)] truncate">{bet.selection}</span>
                      {bet.isLive && !bet.status && (
                        <span className="flex items-center gap-0.5 px-1 py-0.5 text-[8px] font-bold rounded border border-red-500/30 bg-red-500/10">
                          <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-red-500">LIVE</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--ds-fg-subtle)]">{bet.market} · {bet.odds}</span>
                  </div>

                  {/* Status / amount */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusBadge(bet) || (
                      !bet.status && !bet.isLive ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10">PENDING</span>
                      ) : null
                    )}
                    <span className="text-xs font-semibold text-[var(--ds-fg)] tabular-nums">${bet.amount.toFixed(2)}</span>
                    <IconChevronDown className={cn(
                      "w-3.5 h-3.5 text-white/30 transition-transform duration-200",
                      expandedBetId === bet.id && "rotate-180"
                    )} />
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedBetId === bet.id && (
          <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 bg-white/[0.02] px-4 py-3">
                        {bet.type === 'parlay' && bet.legs ? (
                          <div className="mb-2">
                            <div className="text-[10px] font-semibold text-[var(--ds-fg-subtle)] uppercase tracking-wide mb-2">{bet.legs.length}-Leg Parlay</div>
                            <div className="relative ml-[2px]">
                              <div className="absolute left-[3px] top-[6px] bottom-[6px] w-[1px] bg-white/15" />
                              <div className="space-y-2">
                                {bet.legs.map((leg, i) => (
                                  <div key={i} className="relative pl-4">
                                    <div className="absolute left-0 top-[5px] w-[7px] h-[7px] rounded-full bg-emerald-500 ring-1 ring-emerald-500/20" />
                                    <div className="text-xs font-medium text-[var(--ds-fg)] leading-tight">{leg.selection}</div>
                                    <div className="text-[10px] text-[var(--ds-fg-subtle)]">{leg.team1} v {leg.team2} · {leg.league}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-2">
                            <div className="text-[10px] text-[var(--ds-fg-subtle)]">{bet.team1} v {bet.team2}</div>
                            <div className="text-[10px] text-[var(--ds-fg-subtle)]">{bet.league}{bet.country ? `, ${bet.country}` : ''}</div>
                          </div>
        )}

                        {bet.isLive && bet.liveInfo && bet.type !== 'parlay' && (
                          <div className="mb-2 rounded-lg border border-[var(--ds-border)] bg-white/[0.03] overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-1.5">
                              <span className="text-[11px] text-[var(--ds-fg-muted)]">{bet.team1}</span>
                              <span className="text-[11px] font-bold text-[var(--ds-fg)]">{bet.liveInfo.score.team1}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5">
                              <span className="text-[11px] text-[var(--ds-fg-muted)]">{bet.team2}</span>
                              <span className="text-[11px] font-bold text-[var(--ds-fg)]">{bet.liveInfo.score.team2}</span>
                            </div>
                          </div>
                        )}

                        {!bet.isLive && bet.finalScore && bet.type !== 'parlay' && (
                          <div className="mb-2 rounded-lg border border-[var(--ds-border)] bg-white/[0.03] overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-1 bg-white/[0.02]">
                              <span className="text-[9px] font-semibold text-[var(--ds-fg-subtle)] uppercase tracking-wide">Final Result</span>
                              <span className="text-[9px] font-semibold text-[var(--ds-fg-subtle)] uppercase tracking-wide">FT</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5">
                              <span className={cn("text-[11px]", bet.status === 'won' && bet.selection.toLowerCase().includes(bet.team1.toLowerCase()) ? "text-emerald-400 font-semibold" : "text-[var(--ds-fg-muted)]")}>{bet.team1}</span>
                              <span className={cn("text-[11px] font-bold", bet.finalScore.team1 > bet.finalScore.team2 ? "text-[var(--ds-fg)]" : "text-[var(--ds-fg-muted)]")}>{bet.finalScore.team1}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5">
                              <span className={cn("text-[11px]", bet.status === 'won' && bet.selection.toLowerCase().includes(bet.team2.toLowerCase()) ? "text-emerald-400 font-semibold" : "text-[var(--ds-fg-muted)]")}>{bet.team2}</span>
                              <span className={cn("text-[11px] font-bold", bet.finalScore.team2 > bet.finalScore.team1 ? "text-[var(--ds-fg)]" : "text-[var(--ds-fg-muted)]")}>{bet.finalScore.team2}</span>
                            </div>
                          </div>
                        )}

                        {!bet.status && bet.cashOutValue && (
                          <div className="mb-2">
                            <button className="py-1.5 px-3 rounded-md text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all">
                              CASH OUT {'$'}{bet.cashOutValue.toFixed(2)}
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-white/30 pt-1 border-t border-white/5">
                          <span>Risk: <span className="text-[var(--ds-fg-muted)] font-semibold">${bet.amount.toFixed(2)}</span></span>
                          <span>
                            {bet.status === 'won' && bet.wonAmount ? (
                              <span className="text-emerald-400 font-semibold">Won ${bet.wonAmount.toFixed(2)}</span>
                            ) : bet.status === 'lost' ? (
                              <span className="text-red-400 font-semibold">Lost ${bet.amount.toFixed(2)}</span>
                            ) : bet.status === 'cashed_out' && bet.cashedOutAmount ? (
                              <span className="text-emerald-400 font-semibold">Cashed ${bet.cashedOutAmount.toFixed(2)}</span>
                            ) : (
                              <span className="text-[var(--ds-fg-muted)] font-semibold">Returns ${getPotentialReturns(bet.amount, bet.odds).toFixed(2)}</span>
                            )}
                          </span>
                        </div>
                      </div>
          </motion.div>
        )}
      </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

// Payment Logo Component with fallback
function PaymentLogo({ method, className }: { method: string; className?: string }) {
  const [imageError, setImageError] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const normalizedMethod = method.toLowerCase().replace(/\s+/g, '')
  const imagePath = useFallback 
    ? `/logos/payment/${normalizedMethod}.png`
    : `/logos/payment/${normalizedMethod}.svg`
  
  return (
    <div className={`flex items-center justify-center h-8 px-2 ${className || ''}`}>
      {!imageError ? (
        <Image
          src={imagePath}
          alt={method}
          width={60}
          height={20}
          className="object-contain opacity-80 hover:opacity-100 transition-opacity"
          onError={() => {
            if (!useFallback) {
              setUseFallback(true)
            } else {
              setImageError(true)
            }
          }}
        />
      ) : (
        <span className="text-xs font-semibold text-[var(--ds-fg-muted)]">{method}</span>
      )}
      </div>
  )
}

// Security Badge Component with fallback
function SecurityBadge({ name, iconPath, className }: { name: string; iconPath: string; className?: string }) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      {!imageError ? (
        <Image
          src={iconPath}
          alt={name}
          width={52}
          height={20}
          className="object-contain opacity-80 hover:opacity-100 transition-opacity"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-xs font-semibold text-[var(--ds-fg-muted)]">{name}</span>
      )}
          </div>
  )
}

function DashboardSection({
  onNavigate,
  onOpenVipHub,
  onOpenWallet,
  onOpenNotifications,
  unreadNotifications = 0,
}: {
  onNavigate: (section: AccountSection) => void
  onOpenVipHub?: () => void
  onOpenWallet?: () => void
  onOpenNotifications?: () => void
  unreadNotifications?: number
}) {
  const isMobile = useIsMobile()
  const [favCarouselApi, setFavCarouselApi] = React.useState<any>(null)
  const [favCanScrollPrev, setFavCanScrollPrev] = React.useState(false)
  const [favCanScrollNext, setFavCanScrollNext] = React.useState(true)
  const [pnlRange, setPnlRange] = useState<'thisWeek' | 'lastWeek'>('thisWeek')

  React.useEffect(() => {
    if (!favCarouselApi) return
    const onSelect = () => {
      setFavCanScrollPrev(favCarouselApi.canScrollPrev())
      setFavCanScrollNext(favCarouselApi.canScrollNext())
    }
    onSelect()
    favCarouselApi.on('select', onSelect)
    favCarouselApi.on('reInit', onSelect)
    return () => {
      favCarouselApi.off('select', onSelect)
      favCarouselApi.off('reInit', onSelect)
    }
  }, [favCarouselApi])

  const selectedPnlData = useMemo(() => accountPnlByWeek[pnlRange], [pnlRange])

  const pnlSummary = useMemo(() => {
    const net = selectedPnlData.reduce((sum, day) => sum + day.amount, 0)
    return { net }
  }, [selectedPnlData])

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pt-6">

      {/* Profile + Wallet */}
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        {/* Card 1 — name & VIP */}
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-12 shrink-0 border border-white/[0.04]">
                <AvatarFallback className="bg-white/[0.06] text-sm font-semibold text-[var(--ds-fg)]">
                  C
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-[var(--ds-fg)]">Christopher</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--ds-fg-muted)]">
                  <span>B3375823</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText('B3375823')}
                    className="inline-flex size-4 items-center justify-center rounded hover:bg-white/[0.03]"
                    title="Copy account number"
                  >
                    <IconCopy className="size-3 text-[var(--ds-fg-subtle)]" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => onOpenNotifications?.()}
                className="relative flex size-8 items-center justify-center rounded-md text-[var(--ds-fg-muted)] hover:bg-white/[0.03] hover:text-[var(--ds-fg)]"
                aria-label="Open notifications"
              >
                <IconBell className="size-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute right-1 top-1 size-1.5 rounded-full bg-[var(--ds-primary,#ee3536)]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="flex size-8 items-center justify-center rounded-md text-[var(--ds-fg-muted)] hover:bg-white/[0.03] hover:text-[var(--ds-fg)]"
                aria-label="Open profile settings"
              >
                <IconSettings className="size-4" />
              </button>
            </div>
          </div>

          <VipTierProgressCard
            className="mt-5"
            fromTier="Gold"
            toTier="Platinum I"
            percent={45}
            updatedLabel="Until Platinum I: $2,750 · Level 62"
            onClick={() => onOpenVipHub?.()}
          />
        </div>

        {/* Card 2 — balances & wallet */}
        <div className="flex flex-col rounded-xl border border-white/[0.04] bg-white/[0.02] p-5">
          <div className="text-[10px] uppercase tracking-wide text-[var(--ds-fg-subtle)]">Available Balance</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-[var(--ds-fg)]">
            $100,000.00
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-4">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--ds-fg-subtle)]">Free Bet</div>
              <div className="mt-0.5 text-lg font-medium tabular-nums text-[var(--ds-fg)]">$25.00</div>
            </div>
            <button
              type="button"
              onClick={() => window.location.assign('/sports')}
              className="inline-flex h-8 items-center justify-center rounded-md border border-white/[0.06] px-3 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.04] hover:text-[var(--ds-fg)]"
            >
              Use
            </button>
          </div>

          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={() => onOpenWallet?.()}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/[0.06] bg-transparent text-sm font-medium text-[var(--ds-fg)] hover:bg-white/[0.04]"
            >
              <Image
                src="/icons/header/wallet.svg"
                alt=""
                width={16}
                height={16}
                className="size-4"
                unoptimized
              />
              Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Daily Figures — own section */}
      <div className="mb-6">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-medium text-[var(--ds-fg)]">Daily Figures</h3>
          <AnimateTabs
            value={pnlRange}
            onValueChange={(value) => setPnlRange(value as 'thisWeek' | 'lastWeek')}
            className="w-auto self-start"
          >
            <AnimateTabsList className="relative h-auto gap-0.5 rounded-md border border-white/[0.04] bg-transparent p-0.5">
              {[
                { value: 'lastWeek', label: 'Last Week' },
                { value: 'thisWeek', label: 'This Week' },
              ].map((tab) => (
                <TabsTab
                  key={tab.value}
                  value={tab.value}
                  className="relative z-10 h-7 rounded px-3 text-[11px] font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] focus-visible:outline-none focus-visible:ring-0"
                >
                  {pnlRange === tab.value && (
                    <motion.div
                      layoutId="dailyFiguresWeekTab"
                      className="absolute inset-0 -z-10 rounded"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    />
                  )}
                  <span className={cn('relative z-10', pnlRange === tab.value && 'text-white')}>
                    {tab.label}
                  </span>
                </TabsTab>
              ))}
            </AnimateTabsList>
          </AnimateTabs>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02]">
          <div className="px-4 py-2 md:hidden">
            {selectedPnlData.map((day) => {
              const dayLabel =
                day.day === 'Mon' ? 'Monday' :
                day.day === 'Tue' ? 'Tuesday' :
                day.day === 'Wed' ? 'Wednesday' :
                day.day === 'Thu' ? 'Thursday' :
                day.day === 'Fri' ? 'Friday' :
                day.day === 'Sat' ? 'Saturday' :
                'Sunday'
              return (
                <div
                  key={`${day.day}-${day.date}`}
                  className="flex items-center justify-between border-b border-white/[0.04] py-2 last:border-b-0"
                >
                  <span className="text-sm text-[var(--ds-fg-muted)]">{dayLabel}</span>
                  <span className="text-sm font-medium tabular-nums text-[var(--ds-fg)]">
                    {day.amount > 0 ? '+' : ''}{day.amount.toFixed(2)}
                  </span>
                </div>
              )
            })}
            <div className="flex items-center justify-between border-t border-white/[0.06] py-2.5">
              <span className="text-sm font-medium text-[var(--ds-fg)]">Total</span>
              <span className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                {pnlSummary.net >= 0 ? '+' : ''}{pnlSummary.net.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Wk</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">M</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">T</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">W</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">T</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">F</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">S</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">S</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-3 text-center text-sm font-medium tabular-nums text-[var(--ds-fg-muted)]">
                    {pnlRange === 'thisWeek' ? '35' : '34'}
                  </td>
                  {selectedPnlData.map((day) => (
                    <td
                      key={`${day.day}-${day.date}`}
                      className="px-2 py-3 text-center text-sm font-medium tabular-nums text-[var(--ds-fg)]"
                    >
                      {day.amount > 0 ? '+' : ''}{day.amount.toFixed(2)}
                    </td>
                  ))}
                  <td className="px-2 py-3 text-center text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                    {pnlSummary.net >= 0 ? '+' : ''}{pnlSummary.net.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-[var(--ds-fg-subtle)]">
          Sample EST figures · Sports, Live, Racebook, Esports, Casino
        </p>
      </div>

      {/* Activity previews — scrollable lists, dig into full sections */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {/* Bet History preview */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.03]">
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.05] bg-black/15 px-4 py-3">
            <div className="flex items-center gap-2">
              <IconTicket className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
              <h3 className="text-sm font-medium text-[var(--ds-fg)]">Bet History</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('bet-history')}
              className="text-[11px] font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]"
            >
              View all
            </button>
          </div>
          <div className="flex flex-col">
            {sampleBets.slice(0, 5).map((bet) => {
              const statusLabel =
                bet.status === 'won' ? 'Won' :
                bet.status === 'lost' ? 'Lost' :
                bet.status === 'cashed_out' ? 'Cashed' :
                bet.status === 'void' ? 'Void' :
                bet.isLive ? 'Live' : 'Pending'
              const amountLabel =
                bet.status === 'won' && bet.wonAmount != null ? `+$${bet.wonAmount.toFixed(2)}` :
                bet.status === 'cashed_out' && bet.cashedOutAmount != null ? `$${bet.cashedOutAmount.toFixed(2)}` :
                `$${bet.amount.toFixed(2)}`
              return (
                <button
                  key={bet.id}
                  type="button"
                  onClick={() => onNavigate('bet-history')}
                  className="flex w-full items-center gap-2.5 border-b border-white/[0.04] px-3 py-2.5 text-left last:border-b-0 hover:bg-white/[0.03]"
                >
                  <PreviewRowIcon
                    src={sportIconMap[bet.sport]}
                    fallback={<IconBallFootball className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.5} />}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-[var(--ds-fg)]">{bet.selection}</div>
                    <div className="mt-0.5 truncate text-[10px] text-[var(--ds-fg-subtle)]">
                      {bet.market} · {bet.odds}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-medium tabular-nums text-[var(--ds-fg)]">{amountLabel}</div>
                    <div className="mt-0.5 text-[10px] text-[var(--ds-fg-muted)]">{statusLabel}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Transactions preview */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.03]">
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.05] bg-black/15 px-4 py-3">
            <div className="flex items-center gap-2">
              <IconHistory className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
              <h3 className="text-sm font-medium text-[var(--ds-fg)]">Transactions</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('transactions')}
              className="text-[11px] font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]"
            >
              View all
            </button>
          </div>
          <div className="flex flex-col">
            {transactionsData.slice(0, 5).map((tx) => {
              const methodSrc = paymentMethodIconMap[tx.method]
              const typeFallback =
                tx.type === 'Deposit' ? (
                  <IconArrowDownLeft className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
                ) : tx.type === 'Withdrawal' ? (
                  <IconArrowUpRight className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
                ) : (
                  <IconGift className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
                )
              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => onNavigate('transactions')}
                  className="flex w-full items-center gap-2.5 border-b border-white/[0.04] px-3 py-2.5 text-left last:border-b-0 hover:bg-white/[0.03]"
                >
                  <PreviewRowIcon
                    src={methodSrc || null}
                    fallback={
                      tx.method === 'Credit Card' ? (
                        <IconCreditCard className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
                      ) : tx.method === 'Wire Transfer' ? (
                        <IconBuilding className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
                      ) : (
                        typeFallback
                      )
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-[var(--ds-fg)]">{tx.type}</div>
                    <div className="mt-0.5 truncate text-[10px] text-[var(--ds-fg-subtle)]">
                      {tx.method} · {tx.date}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-medium tabular-nums text-[var(--ds-fg)]">{tx.amount}</div>
                    <div className="mt-0.5 text-[10px] text-[var(--ds-fg-muted)]">{tx.status}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Payments preview */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.03]">
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.05] bg-black/15 px-4 py-3">
            <div className="flex items-center gap-2">
              <IconCreditCard className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
              <h3 className="text-sm font-medium text-[var(--ds-fg)]">Payments</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('payments')}
              className="text-[11px] font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]"
            >
              View all
            </button>
          </div>
          <div className="flex flex-col">
            {transactionsData
              .filter((tx) => tx.type === 'Deposit' || tx.type === 'Withdrawal')
              .slice(0, 5)
              .map((tx) => {
                const methodSrc = paymentMethodIconMap[tx.method]
                return (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => onNavigate('payments')}
                    className="flex w-full items-center gap-2.5 border-b border-white/[0.04] px-3 py-2.5 text-left last:border-b-0 hover:bg-white/[0.03]"
                  >
                    <PreviewRowIcon
                      src={methodSrc || null}
                      fallback={
                        tx.method === 'Credit Card' ? (
                          <IconCreditCard className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
                        ) : tx.method === 'Wire Transfer' ? (
                          <IconBuilding className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
                        ) : (
                          <IconWallet className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
                        )
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-[var(--ds-fg)]">{tx.method}</div>
                      <div className="mt-0.5 truncate text-[10px] text-[var(--ds-fg-subtle)]">
                        {tx.type} · {tx.date}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs font-medium tabular-nums text-[var(--ds-fg)]">{tx.amount}</div>
                      <div className="mt-0.5 text-[10px] text-[var(--ds-fg-muted)]">{tx.status}</div>
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      </div>

      {/* Security Central */}
      <div className="mb-6 overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.03]">
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.05] bg-black/15 px-4 py-3">
          <div className="flex items-center gap-2">
            <IconShield className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
            <h3 className="text-sm font-medium text-[var(--ds-fg)]">Security Central</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('security')}
            className="text-[11px] font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]"
          >
            Manage
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: IconLock, label: 'Password', status: 'Protected', ok: true },
            { icon: IconShield, label: 'Two-Factor Auth', status: 'Off', ok: false },
            { icon: IconHistory, label: 'Login History', status: '3 devices', ok: true },
            { icon: IconSettings, label: 'Sessions', status: '2 active', ok: true },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate('security')}
              className="flex w-full items-center gap-2.5 border-b border-white/[0.04] px-3 py-3 text-left last:border-b-0 hover:bg-white/[0.03] sm:border-r sm:border-b-0 sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
            >
              <PreviewRowIcon
                fallback={<item.icon className="size-3.5 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-[var(--ds-fg)]">{item.label}</div>
                <div className="mt-0.5 truncate text-[10px] text-[var(--ds-fg-subtle)]">{item.status}</div>
              </div>
              <IconChevronRight className="size-3.5 shrink-0 text-white/25" />
            </button>
          ))}
        </div>
      </div>

      {/* Favourites */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--ds-fg)]">Favourites</h2>
          <div className="flex shrink-0 items-center gap-1">
            {!isMobile && (
              <>
                <Button variant="ghost" size="icon" className="size-7 text-[var(--ds-fg-muted)] hover:bg-white/[0.03] hover:text-[var(--ds-fg)] disabled:opacity-40" onClick={() => { if (favCarouselApi) favCarouselApi.scrollTo(Math.max(0, favCarouselApi.selectedScrollSnap() - 2)) }} disabled={!favCarouselApi || !favCanScrollPrev}><IconChevronLeft className="size-4" strokeWidth={2} /></Button>
                <Button variant="ghost" size="icon" className="size-7 text-[var(--ds-fg-muted)] hover:bg-white/[0.03] hover:text-[var(--ds-fg)] disabled:opacity-40" onClick={() => { if (favCarouselApi) favCarouselApi.scrollTo(Math.min(favCarouselApi.scrollSnapList().length - 1, favCarouselApi.selectedScrollSnap() + 2)) }} disabled={!favCarouselApi || !favCanScrollNext}><IconChevronRight className="size-4" strokeWidth={2} /></Button>
              </>
            )}
          </div>
        </div>
        <div className="relative" style={{ overflow: 'visible' }}>
          <Carousel setApi={setFavCarouselApi} className="relative w-full" style={{ overflow: 'visible' }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
            <CarouselContent className="-mr-2 ml-0 md:-mr-3">
              {favouriteCasinoGames.map((game, i) => (
                <CarouselItem key={i} className={cn('basis-auto flex-shrink-0 pr-0', i === 0 ? 'pl-0' : 'pl-2 md:pl-3')}>
                  <div className="group relative h-[112px] w-[112px] flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-[var(--ds-control-bg)]">
                    <Image src={game.image} alt={game.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="112px" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-1.5">
                      <div className="truncate text-[10px] font-medium leading-tight text-[var(--ds-fg)]">{game.title}</div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Bet History Section
// ═══════════════════════════════════════════════════════════
function BetHistoryContent({ initialFilter }: { initialFilter?: 'all' | 'cash_out' | 'in_play' | 'pending' | 'graded' }) {
  const isMobile = useIsMobile()
  const [activeFilter, setActiveFilter] = useState<'all' | 'cash_out' | 'in_play' | 'pending' | 'graded'>(initialFilter || 'all')
  const [expandedBetId, setExpandedBetId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [pnlRange, setPnlRange] = useState<'thisWeek' | 'lastWeek'>('thisWeek')
  const [isDailyFiguresMinimized, setIsDailyFiguresMinimized] = useState(false)
  const [selectedPnlDay, setSelectedPnlDay] = useState<string | null>(null)
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('Status')
  const [dateRangePreset, setDateRangePreset] = useState('Last 7 Days')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [wagerTypeFilters, setWagerTypeFilters] = useState<string[]>([])

  React.useEffect(() => {
    if (initialFilter) {
      setActiveFilter(initialFilter)
      setCurrentPage(1)
      setExpandedBetId(null)
    }
  }, [initialFilter])

  const filteredBets = sampleBets.filter(bet => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'cash_out') return bet.cashOutValue || bet.status === 'cashed_out'
    if (activeFilter === 'in_play') return bet.isLive && !bet.status
    if (activeFilter === 'pending') return !bet.status && !bet.isLive
    if (activeFilter === 'graded') return bet.status === 'won' || bet.status === 'lost' || bet.status === 'void' || bet.status === 'cashed_out'
    return true
  })

  const betsFilteredByPnlDay = React.useMemo(() => {
    if (!selectedPnlDay) return filteredBets
    return filteredBets.filter((bet) => {
      const datePart = bet.datePlaced.split(',')[0]?.trim()
      if (!datePart) return false
      const parsed = new Date(datePart)
      if (Number.isNaN(parsed.getTime())) return false
      const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parsed.getDay()]
      return weekday === selectedPnlDay
    })
  }, [filteredBets, selectedPnlDay])

  const totalPages = Math.max(1, Math.ceil(betsFilteredByPnlDay.length / rowsPerPage))
  const paginatedBets = betsFilteredByPnlDay.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const selectedPnlData = accountPnlByWeek[pnlRange]
  const pnlSummary = React.useMemo(() => {
    const net = selectedPnlData.reduce((sum, day) => sum + day.amount, 0)
    return { net }
  }, [selectedPnlData])

  const getStatusBadge = (bet: typeof sampleBets[0]) => {
    if (bet.status === 'won') return (
      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 whitespace-nowrap">
        WON {'$'}{bet.wonAmount?.toFixed(2)}
      </span>
    )
    if (bet.status === 'lost') return (
      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border border-red-500/30 text-red-400 bg-red-500/10 whitespace-nowrap">
        LOST
      </span>
    )
    if (bet.status === 'void') return (
      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border border-white/20 text-[var(--ds-fg-muted)] bg-[var(--ds-control-bg)] whitespace-nowrap">
        VOID
      </span>
    )
    if (bet.status === 'cashed_out') return (
      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 whitespace-nowrap">
        CASHED OUT {'$'}{bet.cashedOutAmount?.toFixed(2)}
      </span>
    )
    return null
  }

  const getPendingTag = () => (
    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10 whitespace-nowrap">
      PENDING
    </span>
  )

  const getLiveTag = () => (
    <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded border border-red-500/30 bg-red-500/10 whitespace-nowrap">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      <span className="text-red-500 uppercase">Live</span>
    </span>
  )

  const getPotentialReturns = (amount: number, odds: string) => {
    const oddsNum = parseInt(odds)
    if (oddsNum > 0) return amount + (amount * oddsNum / 100)
    return amount + (amount * 100 / Math.abs(oddsNum))
  }

  const handleShareToChat = (bet: typeof sampleBets[0]) => {
    const { shareBetToChat } = useChatStore.getState()
    if (bet.type === 'parlay' && bet.legs) {
      shareBetToChat(bet.legs.map(leg => ({
        eventName: `${leg.team1} v ${leg.team2}`,
        selection: leg.selection,
        odds: leg.odds,
        stake: bet.amount,
      })))
    } else {
      shareBetToChat([{
        eventName: `${bet.team1} v ${bet.team2}`,
        selection: bet.selection,
        odds: bet.odds,
        stake: bet.amount,
      }])
    }
  }

  const toggleWagerTypeFilter = (value: string) => {
    setWagerTypeFilters((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const formatDateChip = (value: string) => {
    if (!value) return ''
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const renderExpandedBet = (bet: typeof sampleBets[0]) => {
    const potentialReturns = getPotentialReturns(bet.amount, bet.odds)
    const isGraded = bet.status === 'won' || bet.status === 'lost' || bet.status === 'void'

  return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="border-t border-white/5 bg-white/[0.02]">
          {bet.type === 'parlay' && bet.legs ? (
            <div className="px-4 pt-3 pb-2">
              <div className="text-[10px] font-semibold text-[var(--ds-fg-subtle)] uppercase tracking-wide mb-2">
                {bet.legs.length}-Leg Parlay
              </div>
              <div className="relative ml-[2px] mb-1">
                <div className="absolute left-[3px] top-[6px] bottom-[6px] w-[1px] bg-white/15" />
                <div className="space-y-3">
                  {bet.legs.map((leg, i) => (
                    <div key={i} className="relative pl-4">
                      <div className="absolute left-0 top-[5px] w-[7px] h-[7px] rounded-full bg-emerald-500 ring-1 ring-emerald-500/20" />
                      <div className="text-xs font-medium text-[var(--ds-fg)] leading-tight">{leg.selection}</div>
                      <div className="text-[10px] text-[var(--ds-fg-subtle)] leading-tight">{leg.market}</div>
                      <div className="text-[10px] text-[var(--ds-fg-subtle)] leading-tight">{leg.team1} v {leg.team2}</div>
                      <div className="text-[10px] text-[var(--ds-fg-subtle)]">{leg.league}</div>
                      {leg.isLive && leg.liveInfo && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {getLiveTag()}
                          <span className="text-[10px] text-[var(--ds-fg-muted)]">{leg.liveInfo.period}, {leg.liveInfo.time}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 pt-3 pb-2">
              <div className="text-xs font-medium text-[var(--ds-fg)]">{bet.selection}</div>
              <div className="text-[10px] text-[var(--ds-fg-subtle)]">{bet.market}</div>
              <div className="text-[10px] text-[var(--ds-fg-subtle)]">{bet.team1} v {bet.team2}</div>
              <div className="text-[10px] text-[var(--ds-fg-subtle)]">{bet.league}{bet.country ? `, ${bet.country}` : ''}</div>
              {bet.isLive && bet.liveInfo && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  {getLiveTag()}
                  <span className="text-[10px] text-[var(--ds-fg-muted)]">{bet.liveInfo.period}, {bet.liveInfo.time}</span>
                </div>
              )}
            </div>
          )}

          {bet.isLive && bet.liveInfo && bet.type !== 'parlay' && (
            <div className="mx-4 mb-2 rounded-lg border border-[var(--ds-border)] bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs text-[var(--ds-fg-muted)]">{bet.team1}</span>
                <span className="text-xs font-bold text-[var(--ds-fg)]">{bet.liveInfo.score.team1}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
                <span className="text-xs text-[var(--ds-fg-muted)]">{bet.team2}</span>
                <span className="text-xs font-bold text-[var(--ds-fg)]">{bet.liveInfo.score.team2}</span>
              </div>
            </div>
          )}

          {!bet.isLive && bet.finalScore && bet.type !== 'parlay' && (
            <div className="mx-4 mb-2 rounded-lg border border-[var(--ds-border)] bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.02]">
                <span className="text-[10px] font-semibold text-[var(--ds-fg-subtle)] uppercase tracking-wide">Final Result</span>
                <span className="text-[10px] font-semibold text-[var(--ds-fg-subtle)] uppercase tracking-wide">FT</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
                <span className={cn("text-xs", bet.status === 'won' && bet.selection.toLowerCase().includes(bet.team1.toLowerCase()) ? "text-emerald-400 font-semibold" : "text-[var(--ds-fg-muted)]")}>{bet.team1}</span>
                <span className={cn("text-xs font-bold", bet.finalScore.team1 > bet.finalScore.team2 ? "text-[var(--ds-fg)]" : "text-[var(--ds-fg-muted)]")}>{bet.finalScore.team1}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
                <span className={cn("text-xs", bet.status === 'won' && bet.selection.toLowerCase().includes(bet.team2.toLowerCase()) ? "text-emerald-400 font-semibold" : "text-[var(--ds-fg-muted)]")}>{bet.team2}</span>
                <span className={cn("text-xs font-bold", bet.finalScore.team2 > bet.finalScore.team1 ? "text-[var(--ds-fg)]" : "text-[var(--ds-fg-muted)]")}>{bet.finalScore.team2}</span>
              </div>
            </div>
          )}

          {!bet.status && bet.cashOutValue && (
            <div className="px-4 mb-2">
              <button className="w-full sm:w-auto py-2.5 sm:py-1.5 px-4 rounded-md text-xs sm:text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-200">
                CASH OUT {'$'}{bet.cashOutValue.toFixed(2)}
              </button>
            </div>
          )}

          <div className="px-4 py-2.5 border-t border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[var(--ds-fg-subtle)]">Risk</span>
              <span className="text-[11px] text-[var(--ds-fg-subtle)]">{isGraded ? 'Result' : 'Potential Returns'}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[var(--ds-fg)]">{'$'}{bet.amount.toFixed(2)}</span>
              {bet.status === 'won' && bet.wonAmount ? (
                <span className="text-sm font-bold text-emerald-400">+{'$'}{bet.wonAmount.toFixed(2)}</span>
              ) : bet.status === 'lost' ? (
                <span className="text-sm font-bold text-red-400">-{'$'}{bet.amount.toFixed(2)}</span>
              ) : bet.status === 'cashed_out' && bet.cashedOutAmount ? (
                <span className="text-sm font-bold text-emerald-400">{'$'}{bet.cashedOutAmount.toFixed(2)}</span>
              ) : (
                <span className="text-sm font-bold text-[var(--ds-fg)]">{'$'}{potentialReturns.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/30">
              <span>Bet ID: {bet.betId}</span>
              <span>Date Placed: {bet.datePlaced}</span>
            </div>
          </div>

          <div className="px-4 pb-3 pt-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleShareToChat(bet) }}
              className="inline-flex items-center gap-1.5 py-1 px-3 rounded-md text-[11px] font-medium text-[var(--ds-fg-muted)] border border-[var(--ds-border)] bg-white/[0.03] hover:bg-white/[0.08] hover:text-[var(--ds-fg)] transition-all duration-200"
            >
              <IconMessageCircle2 className="w-3.5 h-3.5" />
              SHARE TO CHAT
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <div className="px-4 md:px-6 pb-4 w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2 pt-4">
        <h1 className="text-lg font-semibold text-[var(--ds-fg)]">Bet History</h1>
        <IconInfoCircle className="size-4 text-[var(--ds-fg-subtle)]" />
      </div>

      {/* Daily Figures in place of old bet-state subnav */}
      <div className="mb-4 overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.03]">
        <div className="flex flex-col gap-3 border-b border-white/[0.05] bg-black/15 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-[var(--ds-fg)]">Daily Figures</h3>
            <button
              type="button"
              onClick={() => setIsDailyFiguresMinimized((prev) => !prev)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--ds-fg-muted)] hover:bg-white/[0.04] hover:text-[var(--ds-fg)]"
              aria-label={isDailyFiguresMinimized ? 'Expand daily figures' : 'Minimize daily figures'}
            >
              {isDailyFiguresMinimized ? <IconChevronDown className="h-3.5 w-3.5" /> : <IconChevronUp className="h-3.5 w-3.5" />}
            </button>
          </div>
          <AnimateTabs
            value={pnlRange}
            onValueChange={(value) => {
              setPnlRange(value as 'thisWeek' | 'lastWeek')
              setSelectedPnlDay(null)
              setCurrentPage(1)
            }}
            className="w-auto self-start sm:ml-auto"
          >
            <AnimateTabsList className="relative h-auto gap-0.5 rounded-md border border-white/[0.06] bg-transparent p-0.5">
              {[
                { value: 'lastWeek', label: 'Last Week' },
                { value: 'thisWeek', label: 'This Week' },
              ].map((tab) => (
                <TabsTab
                  key={tab.value}
                  value={tab.value}
                  className="relative z-10 h-7 rounded px-3 text-[11px] font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {pnlRange === tab.value && (
                    <motion.div
                      layoutId="betHistoryDailyFiguresRangeTab"
                      className="absolute inset-0 -z-10 rounded"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 450, damping: 40 }}
                    />
                  )}
                  <span className={cn('relative z-10', pnlRange === tab.value && 'text-white')}>{tab.label}</span>
                </TabsTab>
              ))}
            </AnimateTabsList>
          </AnimateTabs>
        </div>

        {!isDailyFiguresMinimized && (
          <div className="overflow-x-auto px-2 py-2 md:px-3">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Wk</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">M</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">T</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">W</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">T</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">F</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">S</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">S</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-3 text-center text-sm font-medium tabular-nums text-[var(--ds-fg-muted)]">
                    {pnlRange === 'thisWeek' ? '35' : '34'}
                  </td>
                  {selectedPnlData.map((day) => (
                    <td key={`${day.day}-${day.date}`} className="px-1 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPnlDay((prev) => (prev === day.day ? null : day.day))
                          setCurrentPage(1)
                          setExpandedBetId(null)
                        }}
                        className={cn(
                          'w-full rounded-md px-1 py-1 text-sm font-medium tabular-nums text-[var(--ds-fg)] transition-colors',
                          selectedPnlDay === day.day && 'bg-white/[0.06] ring-1 ring-white/15'
                        )}
                        title={`Filter bets placed on ${day.day}`}
                      >
                        {day.amount > 0 ? '+' : ''}{day.amount.toFixed(2)}
                      </button>
                    </td>
                  ))}
                  <td className="px-2 py-3 text-center text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                    {pnlSummary.net >= 0 ? '+' : ''}{pnlSummary.net.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Filter trigger */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setFiltersPanelOpen(true)}
          className="flex items-center gap-1.5 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] transition-colors"
        >
          <IconFilter className="w-4 h-4" />
          <span className="font-medium">APPLY FILTERS</span>
        </button>
        <span className="text-white/30">|</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center h-7 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-3 text-xs font-medium text-white/85">
            Last 7 Days
          </span>
          {selectedStatus !== 'Status' && (
            <button
              type="button"
              onClick={() => setSelectedStatus('Status')}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08] transition-colors"
            >
              {selectedStatus}
              <IconX className="h-3 w-3" />
            </button>
          )}
          {selectedPnlDay && (
            <button
              type="button"
              onClick={() => setSelectedPnlDay(null)}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08] transition-colors"
            >
              {selectedPnlDay}
              <IconX className="h-3 w-3" />
            </button>
          )}
          {fromDate && (
            <button
              type="button"
              onClick={() => setFromDate('')}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08] transition-colors"
            >
              From {formatDateChip(fromDate)}
              <IconX className="h-3 w-3" />
            </button>
          )}
          {toDate && (
            <button
              type="button"
              onClick={() => setToDate('')}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08] transition-colors"
            >
              To {formatDateChip(toDate)}
              <IconX className="h-3 w-3" />
            </button>
          )}
          {wagerTypeFilters.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setWagerTypeFilters((prev) => prev.filter((item) => item !== type))}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08] transition-colors"
            >
              {type}
              <IconX className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Content: Bet List with inline accordion */}
      <div>
        <div className="flex-1 min-w-0">
          <div className="border border-white/[0.05] rounded-xl overflow-hidden bg-white/[0.02]">
            {paginatedBets.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--ds-fg-subtle)]">
                {selectedPnlDay
                  ? `No bets found for ${selectedPnlDay}.`
                  : 'No bets found.'}
              </div>
            ) : (
              paginatedBets.map((bet, index) => {
                const isExpanded = expandedBetId === bet.id
                return (
                  <div key={bet.id} className={cn(index !== 0 && "border-t border-white/5")}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedBetId(isExpanded ? null : bet.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                      isExpanded ? "bg-[var(--ds-control-bg)]" : "hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Sport Icon */}
                    <div className="w-7 h-7 rounded-full bg-[var(--ds-control-bg)] flex items-center justify-center flex-shrink-0">
                      <img
                        src={sportIconMap[bet.sport] || '/sports_icons/soccer.svg'}
                        alt={bet.sport}
                        className="w-3.5 h-3.5 object-contain opacity-70"
                      />
                </div>

                    {/* Bet Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[var(--ds-fg)]">{'$'}{bet.amount.toFixed(2)}</span>
                        <span className="text-sm text-[var(--ds-fg)] truncate">{bet.selection}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[var(--ds-fg-subtle)] truncate">{bet.market}</span>
                        {bet.legCount && (
                          <span className="w-4 h-4 rounded-full bg-[var(--ds-control-hover)] flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] text-[var(--ds-fg-muted)] font-medium">+{bet.legCount}</span>
                      </span>
                    )}
                  </div>
                      {bet.type !== 'parlay' && bet.team1 && bet.team2 && (
                        <div className="text-[11px] text-[var(--ds-fg-subtle)] mt-0.5 truncate">
                          {bet.team1} v {bet.team2} · {bet.league}
                  </div>
                      )}
                      {bet.isLive && bet.liveInfo && bet.type !== 'parlay' && (
                        <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                          <span className="text-[11px] text-[var(--ds-fg-muted)] truncate">{bet.team1}</span>
                          <span className="text-[11px] font-bold text-[var(--ds-fg)] flex-shrink-0 whitespace-nowrap">{bet.liveInfo.score.team1} - {bet.liveInfo.score.team2}</span>
                          <span className="text-[11px] text-[var(--ds-fg-muted)] truncate">{bet.team2}</span>
                          <span className="text-[10px] text-[var(--ds-fg-subtle)] ml-auto flex-shrink-0 whitespace-nowrap">{bet.liveInfo.period} {bet.liveInfo.time}</span>
                </div>
                      )}
                      {!bet.isLive && bet.finalScore && bet.type !== 'parlay' && (
                        <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                          <span className="text-[11px] text-[var(--ds-fg-subtle)] flex-shrink-0">FT:</span>
                          <span className="text-[11px] text-[var(--ds-fg-muted)] truncate">{bet.team1}</span>
                          <span className="text-[11px] font-bold text-[var(--ds-fg)] flex-shrink-0 whitespace-nowrap">{bet.finalScore.team1} - {bet.finalScore.team2}</span>
                          <span className="text-[11px] text-[var(--ds-fg-muted)] truncate">{bet.team2}</span>
              </div>
                      )}
              </div>

                    {/* Tags + Odds + Chevron */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {bet.status ? getStatusBadge(bet) : (
                        bet.isLive ? getLiveTag() : getPendingTag()
                      )}
                      <span className="text-sm font-medium text-[var(--ds-fg-muted)] min-w-[45px] text-right">{bet.odds}</span>
                <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                        <IconChevronRight className="w-4 h-4 text-white/30" />
                      </motion.div>
                      </div>
                      </div>

                  <AnimatePresence>
                    {isExpanded && renderExpandedBet(bet)}
            </AnimatePresence>
                  </div>
                )
              })
            )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-2 text-xs text-[var(--ds-fg-subtle)]">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
            className="bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded px-1.5 py-0.5 text-[var(--ds-fg)] text-xs focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--ds-fg-subtle)]">
          <span>{currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-[var(--ds-control-bg)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
              <IconChevronLeft className="w-4 h-4" />
            </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-[var(--ds-control-bg)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
              <IconChevronRight className="w-4 h-4" />
            </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <AnimatePresence>
        {filtersPanelOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters panel"
              className="fixed inset-0 z-[70] bg-black/85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersPanelOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-[360px] flex-col border-l border-white/10 bg-[var(--ds-page-bg)] text-[var(--ds-fg)] shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  type="button"
                  onClick={() => setFiltersPanelOpen(false)}
                  className="rounded-md p-1 text-[var(--ds-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--ds-fg)]"
                  aria-label="Close filters"
                >
                  <IconX className="size-5" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                <div>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Status</p>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 text-sm text-[var(--ds-fg)] focus:outline-none"
                  >
                    <option>Status</option>
                    <option>Open</option>
                    <option>Settled</option>
                    <option>Won</option>
                    <option>Lost</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Date range</p>
                  <select
                    value={dateRangePreset}
                    onChange={(e) => setDateRangePreset(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 text-sm text-[var(--ds-fg)] focus:outline-none"
                  >
                    <option>Last 7 Days</option>
                    <option>Last 15 Day</option>
                    <option>Last 30 Day</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>Custom</option>
                  </select>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="h-10 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-2 text-sm text-[var(--ds-fg)] focus:outline-none"
                    />
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="h-10 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-2 text-sm text-[var(--ds-fg)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Wager type</p>
                  <div className="overflow-hidden rounded-xl border border-[var(--ds-control-border)] bg-[var(--ds-overlay)]">
                    {['SportsBook', 'Spread', 'Spread FB', 'Money Line', 'Total'].map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center gap-3 border-b border-white/[0.04] px-3 py-2.5 text-sm text-[var(--ds-fg)] last:border-b-0 hover:bg-white/[0.03]"
                      >
                        <input
                          type="checkbox"
                          checked={wagerTypeFilters.includes(type)}
                          onChange={() => toggleWagerTypeFilter(type)}
                          className="size-4 rounded border-white/20 bg-transparent accent-[var(--ds-primary,#ee3536)]"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-white/[0.08] p-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus('Status')
                    setDateRangePreset('Last 7 Days')
                    setFromDate('')
                    setToDate('')
                    setWagerTypeFilters([])
                  }}
                  className="h-10 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] text-sm font-medium text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-control-hover)]"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersPanelOpen(false)}
                  className="h-10 rounded-lg text-sm font-semibold text-white transition-[filter] hover:brightness-110"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                >
                  Apply
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ═══════════════════════════════════════════════════════════
// My Bonus Section
// ═══════════════════════════════════════════════════════════
function BonusContent() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('Sports')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4 px-4 pb-8 pt-4 md:px-6 md:pt-6">
      <h2 className="text-lg font-semibold text-[var(--ds-fg)]">My Bonus</h2>

      <div>
        <AnimateTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AnimateTabsList className="relative h-auto gap-0.5 rounded-md border border-white/[0.06] bg-transparent p-0.5">
            {['Sports', 'Casino'].map((tab) => (
              <TabsTab
                key={tab}
                value={tab}
                className="relative z-10 h-8 rounded px-4 text-xs font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] focus-visible:outline-none focus-visible:ring-0"
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="accountBonusTab"
                    className="absolute inset-0 -z-10 rounded"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  />
                )}
                <span className={cn('relative z-10', activeTab === tab && 'text-white')}>{tab}</span>
              </TabsTab>
            ))}
          </AnimateTabsList>
        </AnimateTabs>
      </div>

      <div className={cn('overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]', isMobile && 'overflow-x-auto')}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.04] bg-black/15 hover:bg-black/15">
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Code</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Amount</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Rollover</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Date</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Status</TableHead>
              {!isMobile && <TableHead className="w-[40px]" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonusData.map((bonus) => (
              <React.Fragment key={bonus.id}>
                <TableRow
                  className="cursor-pointer border-white/[0.04] hover:bg-white/[0.03]"
                  onClick={() => setExpandedRow(expandedRow === bonus.id ? null : bonus.id)}
                >
                  <TableCell className="text-sm text-[var(--ds-fg)]">{bonus.code}</TableCell>
                  <TableCell className="text-sm tabular-nums text-[var(--ds-fg)]">{bonus.amount}</TableCell>
                  <TableCell className="text-sm tabular-nums text-[var(--ds-fg)]">{bonus.rollover}</TableCell>
                  <TableCell className="text-sm text-[var(--ds-fg-muted)]">{bonus.date}</TableCell>
                  <TableCell>
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-[var(--ds-fg-muted)]">
                      {bonus.status}
                    </span>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <IconChevronDown className={cn('h-4 w-4 text-white/30 transition-transform', expandedRow === bonus.id && 'rotate-180')} />
                    </TableCell>
                  )}
                </TableRow>
                {expandedRow === bonus.id && (
                  <TableRow className="border-white/[0.04]">
                    <TableCell colSpan={6} className="bg-black/10 py-3">
                      <div className="space-y-1 text-xs text-[var(--ds-fg-subtle)]">
                        <p>Bonus Code: {bonus.code}</p>
                        <p>Wagering Requirement: {bonus.rollover} remaining</p>
                        <p>Expiry: {bonus.date}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Transactions Section
// ═══════════════════════════════════════════════════════════
function TransactionsContent() {
  const isMobile = useIsMobile()
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'All' | 'Deposit' | 'Withdrawal' | 'Bonus'>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'COMPLETED' | 'PENDING' | 'CREDITED'>('All')
  const [methodFilter, setMethodFilter] = useState<'All' | string>('All')
  const [dateRangePreset, setDateRangePreset] = useState('Last 30 Days')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const methods = useMemo(
    () => ['All', ...Array.from(new Set(transactionsData.map((tx) => tx.method)))],
    []
  )

  const parseTxDate = (dateStr: string) => {
    // MM/DD/YYYY
    const [mm, dd, yyyy] = dateStr.split('/').map(Number)
    return new Date(yyyy, (mm || 1) - 1, dd || 1)
  }

  const filteredTransactions = useMemo(() => {
    return transactionsData.filter((tx) => {
      if (typeFilter !== 'All' && tx.type !== typeFilter) return false
      if (statusFilter !== 'All' && tx.status !== statusFilter) return false
      if (methodFilter !== 'All' && tx.method !== methodFilter) return false

      const txDate = parseTxDate(tx.date)
      if (fromDate) {
        const from = new Date(fromDate)
        if (txDate < from) return false
      }
      if (toDate) {
        const to = new Date(toDate)
        to.setHours(23, 59, 59, 999)
        if (txDate > to) return false
      }
      return true
    })
  }, [typeFilter, statusFilter, methodFilter, fromDate, toDate])

  const clearFilters = () => {
    setTypeFilter('All')
    setStatusFilter('All')
    setMethodFilter('All')
    setDateRangePreset('Last 30 Days')
    setFromDate('')
    setToDate('')
  }

  const hasActiveFilters =
    typeFilter !== 'All' ||
    statusFilter !== 'All' ||
    methodFilter !== 'All' ||
    !!fromDate ||
    !!toDate

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4 px-4 pb-8 pt-4 md:px-6 md:pt-6">
      <h2 className="text-lg font-semibold text-[var(--ds-fg)]">Transactions</h2>

      {/* Filter trigger + chips */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setFiltersPanelOpen(true)}
          className="flex items-center gap-1.5 text-[var(--ds-fg-muted)] transition-colors hover:text-[var(--ds-fg)]"
        >
          <IconFilter className="size-4" />
          <span className="font-medium">APPLY FILTERS</span>
        </button>
        <span className="text-white/30">|</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex h-7 items-center rounded-full border border-white/15 bg-[var(--ds-overlay)] px-3 text-xs font-medium text-white/85">
            {dateRangePreset}
          </span>
          {typeFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setTypeFilter('All')}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08]"
            >
              {typeFilter}
              <IconX className="size-3" />
            </button>
          )}
          {statusFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setStatusFilter('All')}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08]"
            >
              {statusFilter}
              <IconX className="size-3" />
            </button>
          )}
          {methodFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setMethodFilter('All')}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08]"
            >
              {methodFilter}
              <IconX className="size-3" />
            </button>
          )}
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={() => { setFromDate(''); setToDate('') }}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-[var(--ds-overlay)] px-2.5 text-xs font-medium text-[var(--ds-fg-muted)] hover:bg-white/[0.08]"
            >
              Custom dates
              <IconX className="size-3" />
            </button>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Quick type tabs */}
      <div className="flex flex-wrap gap-1.5">
        {(['All', 'Deposit', 'Withdrawal', 'Bonus'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTypeFilter(type)}
            className={cn(
              'h-8 rounded-md border px-3 text-xs font-medium transition-colors',
              typeFilter === type
                ? 'border-white/20 bg-white/[0.08] text-[var(--ds-fg)]'
                : 'border-white/[0.06] bg-transparent text-[var(--ds-fg-muted)] hover:bg-white/[0.04] hover:text-[var(--ds-fg)]'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className={cn('overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]', isMobile && 'overflow-x-auto')}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.04] bg-black/15 hover:bg-black/15">
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Date</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Type</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Method</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Amount</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Status</TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow className="border-white/[0.04] hover:bg-transparent">
                <TableCell colSpan={6} className="py-8 text-center text-sm text-[var(--ds-fg-subtle)]">
                  No transactions match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-white/[0.04] hover:bg-white/[0.03]">
                  <TableCell className="text-sm text-[var(--ds-fg-muted)]">{tx.date}</TableCell>
                  <TableCell className="text-sm text-[var(--ds-fg)]">{tx.type}</TableCell>
                  <TableCell className="text-sm text-[var(--ds-fg-muted)]">{tx.method}</TableCell>
                  <TableCell className="text-sm font-medium tabular-nums text-[var(--ds-fg)]">{tx.amount}</TableCell>
                  <TableCell>
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-[var(--ds-fg-muted)]">
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[var(--ds-fg-subtle)]">{tx.reference}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AnimatePresence>
        {filtersPanelOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters panel"
              className="fixed inset-0 z-[70] bg-black/85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersPanelOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-[360px] flex-col border-l border-white/10 bg-[var(--ds-page-bg)] text-[var(--ds-fg)] shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setFiltersPanelOpen(false)}
                    className="rounded-md p-1 text-[var(--ds-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--ds-fg)]"
                    aria-label="Close filters"
                  >
                    <IconX className="size-5" />
                  </button>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                  <div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Type</p>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                      className="h-10 w-full rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 text-sm text-[var(--ds-fg)] focus:outline-none"
                    >
                      <option value="All">All</option>
                      <option value="Deposit">Deposit</option>
                      <option value="Withdrawal">Withdrawal</option>
                      <option value="Bonus">Bonus</option>
                    </select>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Status</p>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                      className="h-10 w-full rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 text-sm text-[var(--ds-fg)] focus:outline-none"
                    >
                      <option value="All">All</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="PENDING">Pending</option>
                      <option value="CREDITED">Credited</option>
                    </select>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Method</p>
                    <select
                      value={methodFilter}
                      onChange={(e) => setMethodFilter(e.target.value)}
                      className="h-10 w-full rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 text-sm text-[var(--ds-fg)] focus:outline-none"
                    >
                      {methods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Date range</p>
                    <select
                      value={dateRangePreset}
                      onChange={(e) => {
                        const value = e.target.value
                        setDateRangePreset(value)
                        if (value !== 'Custom') {
                          setFromDate('')
                          setToDate('')
                        }
                      }}
                      className="h-10 w-full rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 text-sm text-[var(--ds-fg)] focus:outline-none"
                    >
                      <option>Last 7 Days</option>
                      <option>Last 15 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Month</option>
                      <option>Last Month</option>
                      <option>Custom</option>
                    </select>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                          setFromDate(e.target.value)
                          setDateRangePreset('Custom')
                        }}
                        className="h-10 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-2 text-sm text-[var(--ds-fg)] focus:outline-none"
                      />
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                          setToDate(e.target.value)
                          setDateRangePreset('Custom')
                        }}
                        className="h-10 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-2 text-sm text-[var(--ds-fg)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-white/[0.08] p-5">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="h-10 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] text-sm font-medium text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)]"
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersPanelOpen(false)}
                    className="h-10 rounded-lg text-sm font-semibold text-white hover:brightness-110"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                  >
                    Apply
                  </button>
                </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Refer a Friend Section
// ═══════════════════════════════════════════════════════════
function ReferFriendContent({ onOpenVipHub }: { onOpenVipHub?: () => void }) {
  const [copied, setCopied] = useState(false)
  const referralCode = 'BOL-CHRIS-2026'
  const referralLink = `https://www.betonline.ag/ref/${referralCode}`
  const openVip = () => {
    if (onOpenVipHub) onOpenVipHub()
    else if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('vip:open-drawer'))
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4 px-4 pb-8 pt-4 md:px-6 md:pt-6">
      <h2 className="text-lg font-semibold text-[var(--ds-fg)]">Refer a Friend</h2>

      <div className="space-y-3 rounded-xl border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wide text-[var(--ds-fg-subtle)]">Cash earned</div>
            <div className="mt-0.5 text-3xl font-semibold tabular-nums tracking-tight text-[var(--ds-fg)]">
              ${referralDashboardStats.totalEarned.toFixed(2)}
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-[var(--ds-fg-muted)]">
              {referralDashboardStats.ggrSharePercent}% GGR on friends you refer — earn cash as they deposit and play.
            </p>
          </div>
          <button
            type="button"
            onClick={openVip}
            className="relative mt-0.5 h-9 shrink-0 overflow-hidden rounded-lg px-3 text-[11px] font-bold uppercase tracking-wider text-white transition-[filter] hover:brightness-110"
            style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-wallet-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <span className="relative">Claim</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] px-3 py-2.5 text-center">
            <p className="text-lg font-semibold tabular-nums text-[var(--ds-fg)]">{referralDashboardStats.friendsReferred}</p>
            <p className="mt-0.5 text-[10px] text-[var(--ds-fg-subtle)]">Friends</p>
          </div>
          <div className="rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] px-3 py-2.5 text-center">
            <p className="text-lg font-semibold tabular-nums text-[var(--ds-fg)]">{referralDashboardStats.ggrSharePercent}%</p>
            <p className="mt-0.5 text-[10px] text-[var(--ds-fg-subtle)]">GGR share</p>
          </div>
          <div className="rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] px-3 py-2.5 text-center">
            <p className="text-lg font-semibold tabular-nums text-[var(--ds-fg)]">${referralDashboardStats.pending.toFixed(2)}</p>
            <p className="mt-0.5 text-[10px] text-[var(--ds-fg-subtle)]">Pending</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-[var(--ds-fg-subtle)]">Your Referral Link</label>
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1 truncate rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] px-3 py-2.5 font-mono text-xs text-[var(--ds-fg)]">
              {referralLink}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(referralLink)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] px-3 py-2.5 text-xs font-medium text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)]"
            >
              {copied ? <IconCheck className="size-3.5" /> : <IconCopy className="size-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={openVip}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] text-sm font-semibold text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)]"
        >
          <IconUserPlus className="size-4 text-[var(--ds-fg-muted)]" strokeWidth={1.75} />
          Refer Now
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Payments Section
// ═══════════════════════════════════════════════════════════
function PaymentsContent() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('Deposit')
  const [statusFilter, setStatusFilter] = useState<'All' | 'COMPLETED' | 'PENDING'>('All')

  const paymentRows = useMemo(() => {
    const type = activeTab === 'Deposit' ? 'Deposit' : 'Withdrawal'
    return transactionsData.filter((tx) => {
      if (tx.type !== type) return false
      if (statusFilter !== 'All' && tx.status !== statusFilter) return false
      return true
    })
  }, [activeTab, statusFilter])

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4 px-4 pb-8 pt-4 md:px-6 md:pt-6">
      <h2 className="text-lg font-semibold text-[var(--ds-fg)]">Payments</h2>

      <div>
        <AnimateTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AnimateTabsList className="relative h-auto gap-0.5 rounded-md border border-white/[0.06] bg-transparent p-0.5">
            {['Deposit', 'Withdraw'].map((tab) => (
              <TabsTab
                key={tab}
                value={tab}
                className="relative z-10 h-8 rounded px-4 text-xs font-medium text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] focus-visible:outline-none focus-visible:ring-0"
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="accountPaymentTab"
                    className="absolute inset-0 -z-10 rounded"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  />
                )}
                <span className={cn('relative z-10', activeTab === tab && 'text-white')}>{tab}</span>
              </TabsTab>
            ))}
          </AnimateTabsList>
        </AnimateTabs>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'Deposit' && (
          <motion.div key="deposit-methods" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            <div className="space-y-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
              <p className="text-xs text-[var(--ds-fg-subtle)]">Select a method to deposit</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[
                  { label: 'Bitcoin', src: '/icons/crypto/btc.svg' },
                  { label: 'Ethereum', src: '/icons/crypto/eth.svg' },
                  { label: 'Credit Card', icon: IconCreditCard },
                  { label: 'Wire Transfer', icon: IconBuilding },
                  { label: 'Cashier Check', icon: IconFileText },
                  { label: 'P2P', icon: IconUserPlus },
                ].map((method) => (
                  <button
                    key={method.label}
                    type="button"
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-2 py-2.5 transition-colors hover:bg-[var(--ds-control-bg)]"
                  >
                    {'src' in method && method.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={method.src} alt="" className="size-5 object-contain" />
                    ) : method.icon ? (
                      <method.icon className="size-4 text-[var(--ds-fg-muted)]" strokeWidth={1.5} />
                    ) : null}
                    <span className="text-center text-[10px] leading-tight text-[var(--ds-fg-muted)]">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'Withdraw' && (
          <motion.div key="withdraw-methods" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            <div className="space-y-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 py-2.5">
                <div>
                  <span className="text-[10px] uppercase tracking-wide text-[var(--ds-fg-subtle)]">Available</span>
                  <p className="text-base font-semibold tabular-nums text-[var(--ds-fg)]">$100,000.00</p>
                </div>
                <Image src="/icons/header/wallet.svg" alt="" width={18} height={18} className="size-4.5 opacity-70" unoptimized />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Bitcoin', src: '/icons/crypto/btc.svg' },
                  { label: 'Wire Transfer', icon: IconBuilding },
                  { label: 'Cashier Check', icon: IconFileText },
                  { label: 'P2P', icon: IconUserPlus },
                ].map((method) => (
                  <button
                    key={method.label}
                    type="button"
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-2 py-2.5 transition-colors hover:bg-[var(--ds-control-bg)]"
                  >
                    {'src' in method && method.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={method.src} alt="" className="size-5 object-contain" />
                    ) : method.icon ? (
                      <method.icon className="size-4 text-[var(--ds-fg-muted)]" strokeWidth={1.5} />
                    ) : null}
                    <span className="text-center text-[10px] leading-tight text-[var(--ds-fg-muted)]">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payments history table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-[var(--ds-fg)]">
            {activeTab === 'Deposit' ? 'Deposit history' : 'Withdrawal history'}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'COMPLETED', 'PENDING'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'h-7 rounded-md border px-2.5 text-[11px] font-medium transition-colors',
                  statusFilter === status
                    ? 'border-white/20 bg-white/[0.08] text-[var(--ds-fg)]'
                    : 'border-white/[0.06] text-[var(--ds-fg-muted)] hover:bg-white/[0.04] hover:text-[var(--ds-fg)]'
                )}
              >
                {status === 'All' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className={cn('overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]', isMobile && 'overflow-x-auto')}>
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.04] bg-black/15 hover:bg-black/15">
                <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Date</TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Method</TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Amount</TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Status</TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentRows.length === 0 ? (
                <TableRow className="border-white/[0.04] hover:bg-transparent">
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-[var(--ds-fg-subtle)]">
                    No {activeTab === 'Deposit' ? 'deposits' : 'withdrawals'} found.
                  </TableCell>
                </TableRow>
              ) : (
                paymentRows.map((tx) => (
                  <TableRow key={tx.id} className="border-white/[0.04] hover:bg-white/[0.03]">
                    <TableCell className="text-sm text-[var(--ds-fg-muted)]">{tx.date}</TableCell>
                    <TableCell className="text-sm text-[var(--ds-fg)]">{tx.method}</TableCell>
                    <TableCell className="text-sm font-medium tabular-nums text-[var(--ds-fg)]">{tx.amount}</TableCell>
                    <TableCell>
                      <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-[var(--ds-fg-muted)]">
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[var(--ds-fg-subtle)]">{tx.reference}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Security Central Section
// ═══════════════════════════════════════════════════════════
function SecurityContent() {
  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4 px-4 pb-8 pt-4 md:px-6 md:pt-6">
      <h2 className="text-lg font-semibold text-[var(--ds-fg)]">Security Central</h2>
      <div className="overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]">
        {[
          { icon: IconLock, label: 'Change Password', desc: 'Update your account password' },
          { icon: IconShield, label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
          { icon: IconHistory, label: 'Login History', desc: 'View recent login activity' },
          { icon: IconSettings, label: 'Session Management', desc: 'Manage active sessions' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3 border-b border-white/[0.04] px-4 py-3 text-left last:border-b-0 hover:bg-white/[0.03]"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/[0.04] ring-1 ring-white/[0.06]">
              <item.icon className="size-4 text-[var(--ds-fg-muted)]" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--ds-fg)]">{item.label}</p>
              <p className="mt-0.5 text-[11px] text-[var(--ds-fg-subtle)]">{item.desc}</p>
            </div>
            <IconChevronRight className="size-4 shrink-0 text-white/25" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Profile Settings Section
// ═══════════════════════════════════════════════════════════
function ProfileContent() {
  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4 px-4 pb-8 pt-4 md:px-6 md:pt-6">
      <h2 className="text-lg font-semibold text-[var(--ds-fg)]">Profile Settings</h2>
      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: 'Username', value: 'christopher' },
            { label: 'Email', value: 'chris@example.com' },
            { label: 'Phone', value: '+1 (555) 123-4567' },
            { label: 'Member Since', value: 'January 2023' },
            { label: 'Account Status', value: 'Verified' },
            { label: 'VIP Level', value: 'Gold' },
          ].map((item) => (
            <div key={item.label}>
              <span className="text-[10px] uppercase tracking-wider text-[var(--ds-fg-subtle)]">{item.label}</span>
              <p className="mt-0.5 text-sm font-medium text-[var(--ds-fg)]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]">
        {[
          { icon: IconBell, label: 'Notification Preferences', desc: 'Manage email & push notifications' },
          { icon: IconDownload, label: 'Download My Data', desc: 'Export your account data' },
          { icon: IconShare, label: 'Connected Accounts', desc: 'Manage linked accounts' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3 border-b border-white/[0.04] px-4 py-3 text-left last:border-b-0 hover:bg-white/[0.03]"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/[0.04] ring-1 ring-white/[0.06]">
              <item.icon className="size-4 text-[var(--ds-fg-muted)]" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--ds-fg)]">{item.label}</p>
              <p className="mt-0.5 text-[11px] text-[var(--ds-fg-subtle)]">{item.desc}</p>
            </div>
            <IconChevronRight className="size-4 shrink-0 text-white/25" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Main Account Page Content
// ═══════════════════════════════════════════════════════════
// VIP Drawer Content Component (copied from casino page)
function VipDrawerContent({
  vipActiveTab,
  setVipActiveTab,
  canScrollVipLeft,
  setCanScrollVipLeft,
  canScrollVipRight,
  setCanScrollVipRight,
  vipTabsContainerRef,
  vipDrawerOpen,
  brandPrimary,
  claimedBoosts,
  setClaimedBoosts,
  boostProcessing,
  setBoostProcessing,
  boostClaimMessage,
  setBoostClaimMessage,
  onBoostClaimed
}: {
  vipActiveTab: string
  setVipActiveTab: (tab: string) => void
  canScrollVipLeft: boolean
  setCanScrollVipLeft: (can: boolean) => void
  canScrollVipRight: boolean
  setCanScrollVipRight: (can: boolean) => void
  vipTabsContainerRef: React.RefObject<HTMLDivElement>
  vipDrawerOpen: boolean
  brandPrimary: string
  claimedBoosts: Set<string>
  setClaimedBoosts: (boosts: Set<string> | ((prev: Set<string>) => Set<string>)) => void
  boostProcessing: string | null
  setBoostProcessing: (id: string | null) => void
  boostClaimMessage: { amount: number } | null
  setBoostClaimMessage: (message: { amount: number } | null) => void
  onBoostClaimed: (amount: number) => void
}) {
  const isMobile = useIsMobile()

  const [profitBoostOptedIn, setProfitBoostOptedIn] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      setProfitBoostOptedIn(localStorage.getItem('profitBoostOptedIn') === 'true')
    } catch {}
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('profitBoostOptedIn', profitBoostOptedIn ? 'true' : 'false')
    } catch {}
  }, [profitBoostOptedIn])
  const checkScroll = useCallback(() => {
    const container = vipTabsContainerRef.current
    if (!container) {
      setCanScrollVipLeft(false)
      setCanScrollVipRight(false)
      return
    }
    const { scrollLeft, scrollWidth, clientWidth } = container
    const canScroll = scrollWidth > clientWidth
    setCanScrollVipLeft(canScroll && scrollLeft > 5)
    setCanScrollVipRight(canScroll && scrollLeft < scrollWidth - clientWidth - 5)
  }, [vipTabsContainerRef, setCanScrollVipLeft, setCanScrollVipRight])

  useEffect(() => {
    if (!vipDrawerOpen) {
      setCanScrollVipLeft(false)
      setCanScrollVipRight(false)
      return
    }
    const container = vipTabsContainerRef.current
    if (!container) {
      setCanScrollVipLeft(false)
      setCanScrollVipRight(false)
      return
    }
    const timeoutId = setTimeout(() => { checkScroll() }, 100)
    const handleScroll = () => { checkScroll() }
    const handleResize = () => { checkScroll() }
    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeoutId)
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [vipDrawerOpen, checkScroll, vipTabsContainerRef, setCanScrollVipLeft, setCanScrollVipRight])

  useEffect(() => {
    if (!vipDrawerOpen) return
    const container = vipTabsContainerRef.current
    if (!container) return
    const tabs = ['VIP', 'Benefits', 'Daily Races', 'Bet & Get', 'Cash Drop Codes']
    const activeIndex = tabs.indexOf(vipActiveTab)
    if (activeIndex === -1) return
    const tabButtons = container.querySelectorAll('button')
    const activeButton = tabButtons[activeIndex]
    if (activeButton) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      const scrollLeft = container.scrollLeft
      const buttonLeft = buttonRect.left - containerRect.left + scrollLeft
      const buttonWidth = buttonRect.width
      const containerWidth = containerRect.width
      const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2)
      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
      setTimeout(() => { checkScroll() }, 500)
    }
  }, [vipActiveTab, vipDrawerOpen, checkScroll, vipTabsContainerRef])

  const scrollVipLeft = () => {
    if (vipTabsContainerRef.current) {
      vipTabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
      setTimeout(() => checkScroll(), 300)
    }
  }

  const scrollVipRight = () => {
    if (vipTabsContainerRef.current) {
      vipTabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
      setTimeout(() => checkScroll(), 300)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Tab Carousel */}
      <div className={cn("pt-2 pb-3 relative z-10 flex-shrink-0 overflow-visible", isMobile ? "pl-3 pr-0" : "pl-4 pr-0")}>
        {!isMobile && canScrollVipLeft && (
          <button
            onClick={scrollVipLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
            style={{ pointerEvents: 'auto', marginLeft: '12px' }}
          >
            <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
        <div
          ref={vipTabsContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            overscrollBehaviorX: 'auto',
            scrollSnapType: 'x mandatory',
            width: '100%',
            minWidth: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0,
            position: 'relative',
            left: 0,
            transform: 'translateX(0)',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
          onScroll={checkScroll}
        >
          <div
            className="bg-[var(--ds-control-bg)] p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300 backdrop-blur-xl flex items-center"
            style={{
              minWidth: 'max-content',
              width: 'max-content',
              flexShrink: 0,
              marginRight: '16px',
              touchAction: 'pan-x',
              pointerEvents: 'auto'
            }}
          >
            {['VIP', 'Benefits', 'Daily Races', 'Bet & Get', 'Cash Drop Codes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setVipActiveTab(tab)}
                className={cn(
                  "relative px-4 py-1 h-9 text-xs font-medium rounded-2xl transition-all duration-300 whitespace-nowrap flex-shrink-0",
                  vipActiveTab === tab
                    ? "text-black bg-[#fef3c7]"
                    : "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] bg-transparent"
                )}
                style={{ scrollSnapAlign: 'start', touchAction: 'manipulation' }}
              >
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
        {!isMobile && canScrollVipRight && (
          <button
            onClick={scrollVipRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
            style={{ pointerEvents: 'auto', marginRight: '8px' }}
          >
            <IconChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>

      <VipHubScrollBody isMobile={isMobile}>
        {vipActiveTab === 'VIP' && (
          <VipHubOverview />
        )}

        {vipActiveTab === 'Benefits' && (
          <div className="space-y-3">
            <MyBenefitsAccordion />
          </div>
        )}

        {vipActiveTab === 'Daily Races' && (
          <VipDailyRaces />
        )}

        {vipActiveTab === 'Bet & Get' && (
          <div className="space-y-3">
            <BetAndGet />
          </div>
        )}

        {vipActiveTab === 'Cash Drop Codes' && (
          <div className="space-y-3">
            <CashDropCode />
          </div>
        )}


        {vipActiveTab === 'Reloads' && <ReloadClaim />}
        {vipActiveTab === 'Cash Drop' && <CashDropCode />}
      </VipHubScrollBody>
    </div>
  )
}

function AccountPageContent() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { trackNav, trackClick, trackAction, trackSidebar } = useTracking('account')
  const { state: sidebarState, open: sidebarOpen, setOpen, openMobile, setOpenMobile, toggleSidebar } = useSidebar()
  const [activeSection, setActiveSection] = useState<AccountSection>('dashboard')
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [quickLinksOpen, setQuickLinksOpen] = useState(true)
  const [loadingQuickLink, setLoadingQuickLink] = useState<string | null>(null)
  const lastScrollYRef = useRef(0)
  const [balance, setBalance] = useState(10)
  const [displayBalance, setDisplayBalance] = useState(10)
  useRainBalance(setBalance, setDisplayBalance)
  const pendingBalanceRef = useRef(0)
  const brandPrimary = 'var(--ds-primary, #ee3536)'

  // Deep-link: /account?section=transactions | bet-history | payments | ...
  useEffect(() => {
    const section = searchParams.get('section')
    const valid: AccountSection[] = [
      'dashboard',
      'bet-history',
      'transactions',
      'my-bonus',
      'payments',
      'refer',
      'security',
      'profile',
    ]
    if (section && valid.includes(section as AccountSection)) {
      if (section === 'my-bonus') {
        router.replace('/promotions/my-bonus')
        return
      }
      if (section === 'refer') {
        router.replace('/promotions/refer-a-friend')
        return
      }
      setActiveSection(section as AccountSection)
    }
  }, [router, searchParams])

  // ─── Drawer state ───
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false)
  const [accountDrawerView, setAccountDrawerView] = useState<'account' | 'notifications'>('account')
  const webInboxUnreadCount = 2
  const [depositDrawerOpen, setDepositDrawerOpen] = useState(false)
  const [vipDrawerOpen, setVipDrawerOpen] = useState(false)
  const [vipActiveTab, setVipActiveTab] = useState('VIP')
  const [profitBoostOptedIn, setProfitBoostOptedIn] = useState(false)
  const profitBoostRequiredBetMarket = 'Premier League'
  const profitBoostRequiredBetStake = 50

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      setProfitBoostOptedIn(localStorage.getItem('profitBoostOptedIn') === 'true')
    } catch {}
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('profitBoostOptedIn', profitBoostOptedIn ? 'true' : 'false')
    } catch {}
  }, [profitBoostOptedIn])

  const [canScrollVipLeft, setCanScrollVipLeft] = useState(false)
  const [canScrollVipRight, setCanScrollVipRight] = useState(false)
  const vipTabsContainerRef = useRef<HTMLDivElement>(null)
  const [claimedBoosts, setClaimedBoosts] = useState<Set<string>>(new Set())
  const [boostProcessing, setBoostProcessing] = useState<string | null>(null)
  const [boostClaimMessage, setBoostClaimMessage] = useState<{ amount: number } | null>(null)

  const handleBoostClaimed = useCallback((amount: number) => {
    pendingBalanceRef.current += amount
  }, [])

  // Deposit-related state
  const [depositAmount, setDepositAmount] = useState(25)
  const [useManualAmount, setUseManualAmount] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bitcoin')
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false)
  const [depositStep, setDepositStep] = useState<'started' | 'processing' | 'almost' | 'complete'>('started')
  const [transactionId, setTransactionId] = useState<string>('')
  const [isDepositLoading, setIsDepositLoading] = useState(false)
  const [stepLoading, setStepLoading] = useState<{started: boolean, processing: boolean, almost: boolean, complete: boolean}>({
    started: false,
    processing: false,
    almost: false,
    complete: false,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // ─── Drawer open helpers (panel exclusivity) ───
  const openAccountDrawer = useCallback(() => {
    if (accountDrawerOpen) {
      setAccountDrawerOpen(false)
      return
    }
    trackClick('account-drawer', 'My Account')
    setVipDrawerOpen(false)
    setDepositDrawerOpen(false)
    setAccountDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [accountDrawerOpen, trackClick])
  const openVipDrawer = useCallback(() => {
    if (vipDrawerOpen) {
      setVipDrawerOpen(false)
      return
    }
    trackClick('vip-hub', 'VIP')
    setAccountDrawerOpen(false)
    setDepositDrawerOpen(false)
    setVipDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [vipDrawerOpen, trackClick])

  // Listen for the global VIP Hub open event so sub-component nav handlers
  // can launch the drawer without needing to thread `openVipDrawer` down
  // through props.
  useEffect(() => {
    const handler = () => {
      setVipDrawerOpen((open) => {
        if (open) return false
        queueMicrotask(() => {
          setAccountDrawerOpen(false)
          setDepositDrawerOpen(false)
          useChatStore.getState().setIsOpen(false)
        })
        return true
      })
    }
    if (typeof window === 'undefined') return
    window.addEventListener('vip:open-drawer', handler)
    return () => window.removeEventListener('vip:open-drawer', handler)
  }, [])

  // Daily Spin (and other promo popups) dispatch this event so the VIP hub
  // doesn't stay stacked behind their dialog. Keeps each modal feeling like
  // the primary thing on screen.
  useEffect(() => {
    const handler = () => setVipDrawerOpen(false)
    if (typeof window === 'undefined') return
    window.addEventListener('vip:close-drawer', handler)
    return () => window.removeEventListener('vip:close-drawer', handler)
  }, [])
  const openDepositDrawer = useCallback(() => {
    if (depositDrawerOpen) {
      setDepositDrawerOpen(false)
      return
    }
    trackClick('deposit', 'Deposit')
    setAccountDrawerOpen(false)
    setVipDrawerOpen(false)
    setDepositDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [depositDrawerOpen, trackClick])

  useEffect(() => {
    const handler = () => openDepositDrawer()
    if (typeof window === 'undefined') return
    window.addEventListener('deposit:open-drawer', handler)
    return () => window.removeEventListener('deposit:open-drawer', handler)
  }, [openDepositDrawer])
  const openNotificationsDrawer = useCallback(() => {
    setAccountDrawerView('notifications')
    openAccountDrawer()
  }, [openAccountDrawer])

  const handleDepositDrawerOpenChange = useCallback((open: boolean) => {
    setDepositDrawerOpen(open)
    if (!open) {
      setShowDepositConfirmation(false)
      setDepositStep('started')
      setTransactionId('')
      setIsDepositLoading(false)
      setStepLoading({started: false, processing: false, almost: false, complete: false})
    } else {
      setAccountDrawerOpen(false)
      setVipDrawerOpen(false)
    }
  }, [])

  const handleVipDrawerOpenChange = useCallback((open: boolean) => {
    if (!open) {
      const pendingAmount = pendingBalanceRef.current
      if (pendingAmount > 0) {
        pendingBalanceRef.current = 0
        setTimeout(() => {
          setBalance(prev => {
            const newBal = +(prev + pendingAmount).toFixed(2)
            setDisplayBalance(newBal)
            return newBal
          })
        }, 300)
      }
    }
    setVipDrawerOpen(open)
    if (open) {
      setAccountDrawerOpen(false)
      setDepositDrawerOpen(false)
    }
  }, [])

  // ─── Product visibility (from Design Customizer brand toggles) ───
  const ALL_ON: ProductToggles = { sports: true, liveBetting: true, casino: true, liveCasino: true, poker: true, vipRewards: true }
  const [visibleProducts, setVisibleProducts] = useState<ProductToggles>(ALL_ON)

  useEffect(() => {
    setMounted(true)
    try {
      const brandId = localStorage.getItem('__ds-active-brand') || 'betonline'
      const overrides = JSON.parse(localStorage.getItem('__ds-brand-products') || '{}')
      if (overrides[brandId]) {
        setVisibleProducts(overrides[brandId])
      }
    } catch { /* ignore */ }
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as ProductToggles
      if (detail) setVisibleProducts(detail)
    }
    window.addEventListener('brand:products-changed', handler)
    return () => window.removeEventListener('brand:products-changed', handler)
  }, [])

  // Footer clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Mobile: Quick links scroll handler — show when scrolling up, hide only on sustained downward scroll
  useEffect(() => {
    if (!isMobile) return

    const SCROLL_THRESHOLD = 8 // minimum delta to count as intentional scroll

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const prevScrollY = lastScrollYRef.current
      const delta = currentScrollY - prevScrollY

      if (currentScrollY < 10) {
        setQuickLinksOpen(true)
      } else if (delta < -SCROLL_THRESHOLD) {
        // Scrolling up with enough intent
        setQuickLinksOpen(true)
      } else if (delta > SCROLL_THRESHOLD && currentScrollY > 80) {
        // Scrolling down with enough intent and past initial area
        setQuickLinksOpen(false)
      }
      // Ignore tiny deltas (layout shifts, animations, etc.)

      lastScrollYRef.current = currentScrollY
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Panel exclusivity: when chat opens, close all drawers + collapse sidebar
  useEffect(() => {
    const handleChatOpened = () => {
      setAccountDrawerOpen(false)
      setVipDrawerOpen(false)
      setDepositDrawerOpen(false)
      setOpen(false)
      setOpenMobile(false)
    }
    window.addEventListener('panel:chat-opened', handleChatOpened)
    return () => window.removeEventListener('panel:chat-opened', handleChatOpened)
  }, [])

  // Brand logo placeholder
  const bolLogo = <BrandLogoPlaceholder variant="full" className="h-full w-full" />

  // Sidebar items — My Bonus & Refer a Friend live under Promotions / VIP Hub
  const sidebarItems = [
    { id: 'dashboard' as const, icon: IconUser, label: 'My Account' },
    { id: 'bet-history' as const, icon: IconTicket, label: 'Bet History' },
    { id: 'transactions' as const, icon: IconCurrencyDollar, label: 'Transactions' },
    { id: 'payments' as const, icon: IconCreditCard, label: 'Payments' },
    { id: 'security' as const, icon: IconShield, label: 'Security Central' },
    { id: 'profile' as const, icon: IconSettings, label: 'Profile Settings' },
  ]

  if (!mounted) {
    return (
      <div className="w-full bg-[var(--ds-page-bg)] text-[var(--ds-fg)] font-figtree overflow-x-hidden min-h-screen flex items-center justify-center">
        <div className="text-[var(--ds-fg-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div
      data-page-bg
      className="w-full bg-[var(--ds-page-bg)] text-[var(--ds-fg)] font-figtree overflow-x-hidden min-h-screen"
      style={{
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        backgroundColor: 'var(--ds-page-bg, #1a1a1a)',
      } as React.CSSProperties}
    >
      {/* ═══ Mobile Quick Links Bar ═══ */}
      {isMobile && (
        <motion.div
          className="fixed left-0 right-0 z-[102] bg-[#2D2E2C] overflow-x-auto scrollbar-hide"
          style={{ backgroundColor: 'var(--ds-nav-bg, #2D2E2C)', height: 40, top: 0 }}
          initial={false}
          animate={{ y: quickLinksOpen ? 0 : -40 }}
          transition={{ type: "tween", ease: "linear", duration: 0.3 }}
        >
          <div className="flex items-center h-full px-3 gap-2 min-w-max">
            {[
              { label: 'Home', onClick: () => { trackNav('home', 'Home'); router.push('/') } },
              ...(visibleProducts.sports ? [{ label: 'Sports', onClick: () => { trackNav('sports', 'Sports'); router.push('/sports/football') } }] : []),
              ...(visibleProducts.liveBetting ? [{ label: 'Live Betting', onClick: () => { trackNav('live-betting', 'Live Betting'); window.location.href = '/live-betting' } }] : []),
              ...(visibleProducts.casino ? [{ label: 'Casino', onClick: () => { trackNav('casino', 'Casino'); router.push('/casino') } }] : []),
              ...(visibleProducts.liveCasino ? [{ label: 'Live Casino', onClick: () => { trackNav('casino', 'Live Casino'); router.push('/casino') } }] : []),
              ...(visibleProducts.poker ? [{ label: 'Poker', onClick: () => { trackNav('poker', 'Poker'); router.push('/casino?poker=true') } }] : []),
              ...(visibleProducts.casino ? [{ label: 'Promotions', onClick: () => { trackNav('promotions', 'Promotions'); router.push('/casino?vipRewardsPage=true') } }] : []),
            ].map((item) => (
              <button
                key={item.label}
                onClick={(e) => { e.stopPropagation(); setLoadingQuickLink(item.label); item.onClick(); setTimeout(() => setLoadingQuickLink(null), 1200) }}
                className="flex-shrink-0 px-3 py-1.5 rounded-small text-xs font-medium transition-colors text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] relative"
              >
                <span className={cn("transition-opacity duration-150", loadingQuickLink === item.label ? "opacity-0" : "opacity-100")}>{item.label}</span>
                {loadingQuickLink === item.label && (
                  <span className="absolute inset-0 flex items-center justify-center"><IconLoader2 className="w-3.5 h-3.5 text-[var(--ds-fg)] animate-spin" /></span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ Global Header — Same as casino / sports pages ═══ */}
      <motion.header
        data-nav-header
        className={cn(
          "border-b border-[var(--ds-border)] h-16 flex items-center justify-between z-[101] fixed right-0 transition-[left,background-color] duration-200 ease-linear",
          isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6"),
          isMobile && quickLinksOpen && "border-t-0"
        )}
        initial={false}
        animate={{
          top: isMobile ? (quickLinksOpen ? 40 : 0) : 0
        }}
        transition={isMobile ? {
          type: "tween",
          ease: "linear",
          duration: 0.3
        } : {}}
        style={{
          backgroundColor: 'var(--ds-nav-bg, #2D2E2C)',
          pointerEvents: 'auto',
          zIndex: 101,
          position: 'fixed',
          boxShadow: '0 -200px 0 0 var(--ds-nav-bg, #2D2E2C)',
        }}
      >
        <div className={cn('flex items-center', isMobile ? 'gap-1.5' : 'gap-6')}>
          {/* Hamburger + Logo — mobile only */}
          {isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!openMobile) {
                    useChatStore.getState().setIsOpen(false)
                  }
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
                {bolLogo}
              </div>
            </>
          )}

          {/* Navigation Menu - Desktop only — exact casino pattern */}
          {!isMobile && (
            <nav className="flex-1 flex items-center z-[110] -ml-1" style={{ pointerEvents: 'auto' }}>
              <SidebarMenu className="flex flex-row items-center gap-2">
                {/* Sidebar collapse toggle */}
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
                </Button>
                <div className="w-px h-5 shrink-0 bg-white/25" aria-hidden />
              </div>

                {visibleProducts.casino && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                      "text-[var(--ds-fg-muted)] cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); trackNav('casino', 'Casino'); router.push('/casino') }}
                  >
                    <span className="relative z-10">Casino</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}


                {visibleProducts.sports && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                      "text-[var(--ds-fg-muted)] cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); trackNav('sports', 'Sports'); router.push('/sports/football') }}
                  >
                    <span className="relative z-10">Sports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}


                {visibleProducts.poker && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                      "text-[var(--ds-fg-muted)] cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); trackNav('poker', 'Poker'); router.push('/casino?poker=true') }}
                  >
                    <span className="relative z-10">Poker</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}


                {visibleProducts.casino && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                      "text-[var(--ds-fg-muted)] cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      trackNav('promotions', 'Promotions')
                      setVipDrawerOpen(false)
                      router.push('/casino?vipRewardsPage=true')
                    }}
                  >
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                        Promotions
                        <NavNewBadge />
                      </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}

                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                          "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                          "text-[var(--ds-fg-muted)] data-[state=open]:text-[var(--ds-fg)] data-[state=open]:bg-[var(--ds-control-hover)]"
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
                      <DropdownMenuItem className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]">
                          <a href="/promotions/contests" className="w-full">Contests</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]">
                          <a href="/esports" className="w-full">Esports</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]">
                          <a href="/racebook" className="w-full">Racebook</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]">
                          <a href="/casino?vipRewardsPage=true" className="w-full">VIP Rewards</a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          )}
        </div>

        {/* Right side — shared header controls */}
        <HeaderUserControls
          isLoggedIn
          balance={displayBalance}
          currencySymbol="$"
          vipDrawerOpen={vipDrawerOpen}
          onOpenAccount={openAccountDrawer}
          onOpenVip={openVipDrawer}
          onOpenDeposit={openDepositDrawer}
        />
      </motion.header>

      {/* ═══ Layout: Sidebar + Content ═══ */}
      <div className="flex w-full min-h-screen bg-[var(--ds-page-bg)] relative" style={{ marginTop: '64px' }} data-sidebar-full-height>
        {/* Persistent sidebar backdrop — prevents black flash during page transitions */}
        {!isMobile && (
          <>
            <div
              className="fixed top-0 left-0 z-[101] h-screen transition-[width] duration-200 ease-linear"
              style={{
                width: sidebarOpen ? '16rem' : '3rem',
                backgroundColor: '#2d2d2d',
              }}
            />
            <div
              aria-hidden
              data-sidebar-rail
              className="transition-[left] duration-200 ease-linear"
              style={{
                left: sidebarOpen ? 'calc(16rem - 1px)' : 'calc(3rem - 1px)',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
              }}
            />
          </>
        )}
        {/* Sidebar — full height, above main nav — same as casino/poker */}
        <Sidebar
          collapsible="icon"
          variant="sidebar"
          mobileOverlay
          mobileNoDrag
          mobileBg="#2d2d2d"
          mobileOverlayClassName="!bg-black/30 !backdrop-blur-sm"
          className="!bg-[#2d2d2d] !border-r-0 text-[var(--ds-fg)] [&>div]:!bg-[#2d2d2d] !h-screen !top-0 !z-[102]"
        >
          {/* Sidebar Header — logo with collapse animation */}
          <SidebarHeader
            className="px-4 h-16 flex items-center flex-shrink-0 overflow-hidden sticky top-0 z-20"
            style={{
              backdropFilter: isMobile ? 'none' : 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: isMobile ? 'none' : 'blur(16px) saturate(180%)',
              backgroundColor: isMobile ? '#2d2d2d' : 'rgba(45, 45, 45, 0.75)',
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close button — right side on mobile (absolute so logo stays centred) */}
              {isMobile && (
                <button
                  onClick={() => setOpenMobile(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)] rounded-lg hover:bg-[var(--ds-control-hover)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
                </button>
              )}
              <div onClick={() => router.push('/')} className="cursor-pointer">
                <AnimatePresence mode="wait" initial={false}>
                  {(sidebarState === 'collapsed' && !isMobile) ? (
                    <motion.div
                      key="b-lockup-desktop"
                      className="flex items-center justify-center"
                      initial={{ opacity: 0, y: 16, scale: 0.75 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, transition: { duration: 0.08 } }}
                      transition={{ type: "spring", stiffness: 400, damping: 18, mass: 0.6, delay: 0.2 }}
                    >
                      <BrandLogoPlaceholder variant="lockup" className="w-6 h-6" />
                    </motion.div>
                  ) : isMobile ? (
                    <motion.div
                      key="b-lockup-mobile"
                      className="flex items-center justify-center"
                      initial={{ opacity: 0, y: 12, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.6, delay: 0.05 }}
                    >
                      <BrandLogoPlaceholder variant="lockup" className="w-7 h-7" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="full-logo"
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.05 } }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="h-5 w-[110px] flex-shrink-0">
                        {bolLogo}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SidebarHeader>

          {/* Quick Links — mobile only, below logo, sticky + glass */}
          {isMobile && (
            <div 
              className="sticky top-16 z-20 border-b border-white/5"
              style={{
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                backgroundColor: 'rgba(45, 45, 45, 0.92)',
              }}
            >
              <div 
                className="flex items-center gap-0 scrollbar-hide w-full px-1"
                style={{ overflowX: 'auto', overflowY: 'hidden', touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}
              >
                {[
                  { label: 'Home', page: 'home' as const },
                  ...(visibleProducts.casino ? [{ label: 'Casino', page: 'casino' as const }] : []),
                  ...(visibleProducts.sports ? [{ label: 'Sports', page: 'sports' as const }] : []),
                  ...(visibleProducts.poker ? [{ label: 'Poker', page: 'poker' as const }] : []),
                  ...(visibleProducts.casino ? [{ label: 'Promotions', page: 'promotions' as const }] : []),
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      trackNav(item.page, item.label)
                      setOpenMobile(false)
                      if (item.page === 'sports') {
                        router.push('/sports/football')
                      } else if (item.page === 'home') {
                        router.push('/')
                      } else if (item.page === 'casino') {
                        router.push('/casino')
                      } else if (item.page === 'poker') {
                        router.push('/casino?poker=true')
                      } else if (item.page === 'promotions') {
                        setVipDrawerOpen(false)
                        router.push('/casino?vipRewardsPage=true')
                      }
                    }}
                    className={cn(
                      "flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative",
                      "text-white/35 font-medium hover:text-[var(--ds-fg-muted)]"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <MobileOtherNavLinks />
              </div>
            </div>
          )}

            <SidebarContent className="overflow-y-auto flex flex-col">
            <TooltipProvider delayDuration={0}>
              {/* Top section — My Account with square icon style, highlighted */}
              <SidebarGroup className="mt-3">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {/* My Account — square icon highlight style like poker Play Now */}
                    <SidebarMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            isActive={activeSection === 'dashboard'}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setActiveSection('dashboard')
                              if (isMobile) setOpenMobile(false)
                            }}
                            className={cn(
                              "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                              "data-[active=true]:text-white data-[active=true]:font-medium",
                              "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                            )}
                            style={activeSection === 'dashboard' ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                          >
                            <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", activeSection === 'dashboard' ? "bg-white/20" : "bg-[var(--ds-control-hover)]")}>
                              <IconUser strokeWidth={1.5} className="w-4 h-4" />
                            </div>
                            <span>My Account</span>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {sidebarState === 'collapsed' && (
                          <TooltipContent side="right" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
                            <p>My Account</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <Separator className="mx-2 bg-[var(--ds-border-strong)]" />

              {/* Account nav items */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.filter(item => item.id !== 'dashboard').map((item) => {
                      const Icon = item.icon
                      const isActive = activeSection === item.id
                      return (
                        <SidebarMenuItem key={item.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                isActive={isActive}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  trackSidebar(item.id, item.label)
                                  trackAction('account-section', item.label, { section: item.id, from: activeSection })
                                  setActiveSection(item.id)
                                  if (isMobile) setOpenMobile(false)
                                }}
                                className={cn(
                                  "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                  "data-[active=true]:text-white data-[active=true]:font-medium",
                                  "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                )}
                                style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                              >
                                <Icon strokeWidth={1.5} className="w-5 h-5" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {sidebarState === 'collapsed' && (
                              <TooltipContent side="right" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
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

              {/* Spacer to push bottom items down */}
              <div className="flex-1" />

              <Separator className="mx-2 bg-[var(--ds-border-strong)]" />

              {/* Bottom section — VIP Hub, Promotions, Wallet, Need Help */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <SidebarMenuItem key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (isMobile) setOpenMobile(false)
                                  if (item.label === SIDEBAR_FOOTER_VIP_HUB) {
                                    openVipDrawer()
                                  } else if (item.label === SIDEBAR_FOOTER_PROMOTIONS) {
                                  router.push('/promotions')
                                  } else if (item.label === SIDEBAR_FOOTER_WALLET) {
                                    setActiveSection('payments')
                                  } else if (item.label === SIDEBAR_FOOTER_NEED_HELP) {
                                    console.log('Need Help clicked')
                                  }
                                }}
                                className={cn(
                                  "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                  "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                )}
                              >
                                <Icon strokeWidth={1.5} className="w-5 h-5" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {sidebarState === 'collapsed' && (
                              <TooltipContent side="right" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
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
            </TooltipProvider>
            {/* Spacer for Safari bottom bar on mobile */}
            {isMobile && <div className="flex-shrink-0 h-24" />}
          </SidebarContent>
        </Sidebar>

        {/* ═══ Main Content ═══ */}
        <SidebarInset
          className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)] overflow-x-hidden"
          style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}
        >
          {/* Sub-nav — AnimateTabs pill style, mobile only (desktop uses sidebar) */}
          {isMobile && (
          <motion.div
            className="fixed left-0 right-0 z-[90] bg-[var(--ds-page-bg)]/60 backdrop-blur-xl border-b border-[var(--ds-border)] py-3 px-4 overflow-x-auto overflow-y-visible scrollbar-hide"
            initial={false}
            animate={{ top: quickLinksOpen ? 104 : 64 }}
            transition={{ type: "tween", ease: "linear", duration: 0.3 }}
          >
            <div>
              <AnimateTabs
                value={activeSection}
                onValueChange={(v) => {
                  trackClick('account-tab', v, { section: 'sub-nav', from: activeSection, to: v })
                  setActiveSection(v as AccountSection)
                }}
                className="w-max"
              >
                <AnimateTabsList className="bg-[var(--ds-control-bg)] p-0.5 h-auto gap-1 rounded-3xl border-0 relative">
                  {sidebarItems.map((item) => (
                    <TabsTab
                      key={item.id}
                      value={item.id}
                      className="relative z-10 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none whitespace-nowrap"
                    >
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="accountSubNav"
                          className="absolute inset-0 rounded-2xl -z-10"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </TabsTab>
                  ))}
                </AnimateTabsList>
              </AnimateTabs>
            </div>
          </motion.div>
          )}
          {/* Spacer for fixed sub-nav on mobile */}
          {isMobile && <div style={{ height: 52 }} />}

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.15 }}
              >
              {activeSection === 'dashboard' && (
                <DashboardSection
                  onNavigate={setActiveSection}
                  onOpenVipHub={openVipDrawer}
                  onOpenWallet={openDepositDrawer}
                  onOpenNotifications={openNotificationsDrawer}
                  unreadNotifications={webInboxUnreadCount}
                />
              )}
              {activeSection === 'bet-history' && <BetHistoryContent />}
              {activeSection === 'transactions' && <TransactionsContent />}
              {activeSection === 'payments' && <PaymentsContent />}
              {activeSection === 'security' && <SecurityContent />}
              {activeSection === 'profile' && <ProfileContent />}
            </motion.div>
          </AnimatePresence>

          {/* ═══ Global Footer ═══ */}
          <SiteFooter />
        </SidebarInset>
      </div>

      {/* Mobile: Dynamic Island */}
      {isMobile && (
        <DynamicIsland
          showSearch={false}
          showFavorites={false}
        />
      )}

      {/* ═══ Deposit Drawer ═══ */}
      <QuickDepositDrawer
        open={depositDrawerOpen}
        onOpenChange={handleDepositDrawerOpenChange}
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
          setShowDepositConfirmation(false)
          setDepositDrawerOpen(false)
          setDepositStep('started')
          setStepLoading({started: false, processing: false, almost: false, complete: false})
          setTimeout(() => {
            const newBalance = balance + depositAmount
            setBalance(newBalance)
            const startBalance = displayBalance
            const endBalance = newBalance
            const duration = 1000
            const startTime = Date.now()
            const animate = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / duration, 1)
              const easeOutCubic = 1 - Math.pow(1 - progress, 3)
              const currentBalance = Math.round(startBalance + (endBalance - startBalance) * easeOutCubic)
              setDisplayBalance(currentBalance)
              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setToastMessage(`Deposit of $${depositAmount.toFixed(2)} was successful`)
                setShowToast(true)
                setTimeout(() => setShowToast(false), 3000)
              }
            }
            requestAnimationFrame(animate)
          }, 300)
        }}
      />

      {/* ═══ Account Details Drawer ═══ */}
      <Drawer
        open={accountDrawerOpen}
        onOpenChange={(open) => {
          setAccountDrawerOpen(open)
          if (!open) {
            setAccountDrawerView('account')
          } else {
            setDepositDrawerOpen(false)
            setVipDrawerOpen(false)
          }
        }}
        direction={isMobile ? "bottom" : "right"}
        shouldScaleBackground={false}
      >
        <DrawerContent
          showOverlay={isMobile}
          className={cn(
            "w-full sm:max-w-md bg-[var(--ds-page-bg)] text-[var(--ds-fg)] flex flex-col",
            "border-l border-[var(--ds-border)]",
            isMobile && "rounded-t-[10px]"
          )}
          style={isMobile ? {
            height: '90vh',
            maxHeight: '90vh',
            top: 'auto',
            bottom: 0,
          } : undefined}
        >
          {isMobile && <DrawerHandle variant="dark" />}
          <DrawerHeader className={cn("flex-shrink-0", isMobile ? "px-4 pt-4 pb-3" : "px-4 pt-4 pb-3")}>
              {accountDrawerView === 'notifications' ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setAccountDrawerView('account')}
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
                  <AccountDrawerIdentity
                    name="ch"
                    accountId="b1767721"
                  />
                  <AccountDrawerHeaderActions
                    onBeforeNavigate={() => setAccountDrawerOpen(false)}
                  />
                </div>
              )}
            </DrawerHeader>

          <div className={cn("flex-1 overflow-y-auto", isMobile ? "px-4 pt-4 pb-4" : "px-4 pt-6 pb-4")}>
            {accountDrawerView === 'account' ? (
              <>
                {/* Balance Information — match site account hub */}
                <div className="mb-4">
                  <div className="space-y-3 rounded-xl border border-[var(--ds-control-border)] bg-[var(--ds-overlay)] px-3 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--ds-fg-muted)]">Available Balance</span>
                      <span className="text-sm font-semibold tabular-nums text-[var(--ds-fg)]">
                        $<NumberFlow value={displayBalance} format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
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
                    onClick={() => setAccountDrawerView('notifications')}
                  >
                    <IconBell className="mr-3 size-5 shrink-0 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left text-[var(--ds-fg)]">Notifications</span>
                    {webInboxUnreadCount > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--ds-primary,#ee3536)] px-1.5 text-[10px] font-bold text-white">
                        {webInboxUnreadCount}
                      </span>
                    )}
                  </Button>
                </div>

                <Separator className="mb-6 bg-[var(--ds-control-hover)]" />

                <div className="mb-2 w-full space-y-1">
                  <Button
                    variant="ghost"
                    className="h-12 w-full min-w-0 justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('dashboard')
                    }}
                  >
                    <IconUser className="mr-3 size-5 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left text-[var(--ds-fg)]">My Account</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 w-full min-w-0 justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('bet-history')
                    }}
                  >
                    <IconFileText className="mr-3 size-5 shrink-0 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left text-[var(--ds-fg)]">Pending Bets</span>
                    <span className="ml-auto flex items-center gap-1.5 text-sm text-[var(--ds-fg-muted)]">
                      <span className="flex size-5 items-center justify-center rounded-full bg-[var(--ds-control-hover)] text-[10px] font-bold text-[var(--ds-fg-muted)]">
                        4
                      </span>
                      $40.00
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('transactions')
                    }}
                  >
                    <IconCurrencyDollar className="mr-3 size-5 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left text-[var(--ds-fg)]">Transactions History</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('bet-history')
                    }}
                  >
                    <IconTicket className="mr-3 size-5 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left text-[var(--ds-fg)]">Bet History</span>
                  </Button>

                  <Separator className={cn('bg-[var(--ds-control-hover)]', isMobile ? 'my-3' : 'my-4')} />

                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      openVipDrawer()
                    }}
                  >
                    <IconCrown className="mr-3 size-5 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left text-[var(--ds-fg)]">VIP Hub</span>
                  </Button>

                  <Separator className="my-2 bg-[var(--ds-control-hover)]" />

                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start px-3 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                  >
                    <IconLogout className="mr-3 size-5 text-[var(--ds-fg-muted)]" />
                    <span className="flex-1 text-left text-[var(--ds-fg)]">Log Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <NotificationHub />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* ═══ VIP Rewards Drawer ═══ */}
      <Drawer
        open={vipDrawerOpen}
        onOpenChange={handleVipDrawerOpenChange}
        direction={isMobile ? "bottom" : "right"}
        shouldScaleBackground={false}
      >
        <DrawerContent
          showOverlay={isMobile}
          className={cn(
            "dark bg-[var(--ds-page-bg)] text-[var(--ds-fg)] flex flex-col relative",
            "w-full sm:max-w-md border-l border-[var(--ds-border)] overflow-hidden",
            isMobile && "rounded-t-[10px]"
          )}
          style={isMobile ? {
            height: '90vh',
            maxHeight: '90vh',
            top: 'auto',
            bottom: 0,
          } : { display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}
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
            <VipDrawerContent
              vipActiveTab={vipActiveTab}
              setVipActiveTab={setVipActiveTab}
              canScrollVipLeft={canScrollVipLeft}
              setCanScrollVipLeft={setCanScrollVipLeft}
              canScrollVipRight={canScrollVipRight}
              setCanScrollVipRight={setCanScrollVipRight}
              vipTabsContainerRef={vipTabsContainerRef}
              vipDrawerOpen={vipDrawerOpen}
              brandPrimary={brandPrimary}
              claimedBoosts={claimedBoosts}
              setClaimedBoosts={setClaimedBoosts}
              boostProcessing={boostProcessing}
              setBoostProcessing={setBoostProcessing}
              boostClaimMessage={boostClaimMessage}
              setBoostClaimMessage={setBoostClaimMessage}
              onBoostClaimed={handleBoostClaimed}
            />
        </DrawerContent>
      </Drawer>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 z-[300] flex max-w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-page-bg)] px-4 py-3 text-[var(--ds-fg)] shadow-2xl"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#059669]">
                <IconCheck className="h-4 w-4 text-[var(--ds-fg)]" />
              </div>
              <span className="min-w-0 text-sm font-medium">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-[var(--ds-control-bg)] text-white/55 transition-colors hover:bg-white/[0.12] hover:text-[var(--ds-fg)]"
              aria-label="Dismiss notification"
            >
              <IconX className="h-4 w-4" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Page Export
// ═══════════════════════════════════════════════════════════
export default function AccountPage() {
  return (
    <Suspense fallback={<div className="w-full bg-[var(--ds-page-bg)] min-h-screen" />}>
      <SidebarProvider>
        <AccountPageContent />
      </SidebarProvider>
    </Suspense>
  )
}
