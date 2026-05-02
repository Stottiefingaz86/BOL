'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import React, { Suspense } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTracking } from '@/hooks/use-tracking'
import { useRouter } from 'next/navigation'
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
} from '@tabler/icons-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
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
import { useChatStore } from '@/lib/store/chatStore'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { useRainBalance } from '@/hooks/use-rain-balance'
import { colorTokenMap } from '@/lib/agent/designSystem'
import type { ProductToggles } from '@/components/design-customizer'
import { StreakCounter } from '@/components/vip/streak-counter'
import { VipBenefitTiles } from '@/components/vip/vip-benefit-tiles'
import { LevelUpSpinner } from '@/components/vip/level-up-spinner'
import { RedeemPromoCode } from '@/components/vip/redeem-promo-code'
import { MyBenefitsAccordion } from '@/components/vip/my-benefits-accordion'
import { ReloadClaim } from '@/components/vip/reload-claim'
import { CashDropCode } from '@/components/vip/cash-drop-code'
import { BetAndGet } from '@/components/vip/bet-and-get'
import { RewardCrates } from '@/components/vip/reward-crates'
import { VipTierProgressBar } from '@/components/vip/vip-tier-progress-bar'
import { DailyRacesTimer } from '@/components/daily-races-timer'
import { SidebarPromos } from '@/components/sidebar-promos'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
  { title: 'Cocktail Wheel', image: '/games/square/cocktailWheel.png', provider: 'BetOnline' },
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
      <Card className="bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 transition-colors duration-300 h-full">
        <CardContent className="p-4 flex flex-col justify-center items-center h-full text-center">
          <CardTitle className="text-xs text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-2 transition-colors duration-300">Total Rewards Claimed</CardTitle>
          <div className="text-2xl font-bold text-white dark:text-white text-gray-900 dark:text-white transition-colors duration-300">
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
        <h2 className="text-lg font-semibold text-white">Recent Bets</h2>
        <Button
          variant="ghost"
          onClick={() => onNavigate('bet-history')}
          className="text-white/50 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto rounded-small"
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
                ? "bg-white/10 text-white border border-white/20"
                : "text-white/50 hover:text-white/70 hover:bg-white/5 border border-transparent"
              )}
            >
            {tab.label}
            {tab.count !== null && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                activeFilter === tab.key ? "bg-white/15 text-white" : "bg-white/5 text-white/40"
              )}>
                {tab.count}
              </span>
              )}
            </button>
          ))}
      </div>

      {/* Bet list */}
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <div className="divide-y divide-white/[0.06]">
          {filteredBets.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-white/40">No bets found</div>
          ) : (
            filteredBets.map((bet) => (
              <div key={bet.id}>
                <div
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                  onClick={() => setExpandedBetId(expandedBetId === bet.id ? null : bet.id)}
                >
                  {/* Sport icon */}
                  <div className="w-7 h-7 rounded-small flex-shrink-0 bg-white/[0.04] flex items-center justify-center">
                    <img src={sportIconMap[bet.sport] || '/sports_icons/soccer.svg'} alt={bet.sport} className="w-4 h-4 opacity-50" />
                  </div>

                  {/* Bet info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate">{bet.selection}</span>
                      {bet.isLive && !bet.status && (
                        <span className="flex items-center gap-0.5 px-1 py-0.5 text-[8px] font-bold rounded border border-red-500/30 bg-red-500/10">
                          <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-red-500">LIVE</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/40">{bet.market} · {bet.odds}</span>
                  </div>

                  {/* Status / amount */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusBadge(bet) || (
                      !bet.status && !bet.isLive ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10">PENDING</span>
                      ) : null
                    )}
                    <span className="text-xs font-semibold text-white tabular-nums">${bet.amount.toFixed(2)}</span>
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
                            <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-2">{bet.legs.length}-Leg Parlay</div>
                            <div className="relative ml-[2px]">
                              <div className="absolute left-[3px] top-[6px] bottom-[6px] w-[1px] bg-white/15" />
                              <div className="space-y-2">
                                {bet.legs.map((leg, i) => (
                                  <div key={i} className="relative pl-4">
                                    <div className="absolute left-0 top-[5px] w-[7px] h-[7px] rounded-full bg-emerald-500 ring-1 ring-emerald-500/20" />
                                    <div className="text-xs font-medium text-white leading-tight">{leg.selection}</div>
                                    <div className="text-[10px] text-white/40">{leg.team1} v {leg.team2} · {leg.league}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-2">
                            <div className="text-[10px] text-white/40">{bet.team1} v {bet.team2}</div>
                            <div className="text-[10px] text-white/40">{bet.league}{bet.country ? `, ${bet.country}` : ''}</div>
                          </div>
        )}

                        {bet.isLive && bet.liveInfo && bet.type !== 'parlay' && (
                          <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-1.5">
                              <span className="text-[11px] text-white/80">{bet.team1}</span>
                              <span className="text-[11px] font-bold text-white">{bet.liveInfo.score.team1}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5">
                              <span className="text-[11px] text-white/80">{bet.team2}</span>
                              <span className="text-[11px] font-bold text-white">{bet.liveInfo.score.team2}</span>
                            </div>
                          </div>
                        )}

                        {!bet.isLive && bet.finalScore && bet.type !== 'parlay' && (
                          <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-1 bg-white/[0.02]">
                              <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wide">Final Result</span>
                              <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wide">FT</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5">
                              <span className={cn("text-[11px]", bet.status === 'won' && bet.selection.toLowerCase().includes(bet.team1.toLowerCase()) ? "text-emerald-400 font-semibold" : "text-white/80")}>{bet.team1}</span>
                              <span className={cn("text-[11px] font-bold", bet.finalScore.team1 > bet.finalScore.team2 ? "text-white" : "text-white/60")}>{bet.finalScore.team1}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5">
                              <span className={cn("text-[11px]", bet.status === 'won' && bet.selection.toLowerCase().includes(bet.team2.toLowerCase()) ? "text-emerald-400 font-semibold" : "text-white/80")}>{bet.team2}</span>
                              <span className={cn("text-[11px] font-bold", bet.finalScore.team2 > bet.finalScore.team1 ? "text-white" : "text-white/60")}>{bet.finalScore.team2}</span>
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
                          <span>Risk: <span className="text-white/60 font-semibold">${bet.amount.toFixed(2)}</span></span>
                          <span>
                            {bet.status === 'won' && bet.wonAmount ? (
                              <span className="text-emerald-400 font-semibold">Won ${bet.wonAmount.toFixed(2)}</span>
                            ) : bet.status === 'lost' ? (
                              <span className="text-red-400 font-semibold">Lost ${bet.amount.toFixed(2)}</span>
                            ) : bet.status === 'cashed_out' && bet.cashedOutAmount ? (
                              <span className="text-emerald-400 font-semibold">Cashed ${bet.cashedOutAmount.toFixed(2)}</span>
                            ) : (
                              <span className="text-white/60 font-semibold">Returns ${getPotentialReturns(bet.amount, bet.odds).toFixed(2)}</span>
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
        <span className="text-xs font-semibold text-white/70">{method}</span>
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
        <span className="text-xs font-semibold text-white/70">{name}</span>
      )}
          </div>
  )
}

function DashboardSection({
  onNavigate,
  onOpenVipHub,
  onOpenNotifications,
  unreadNotifications = 0,
}: {
  onNavigate: (section: AccountSection) => void
  onOpenVipHub?: () => void
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
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-8 w-full max-w-[1200px] mx-auto">

      {/* ═══ Account Overview ═══ */}
      <Card className="bg-white/5 border-white/10 mb-4 overflow-hidden">
        <CardContent className="p-0">
          {/* Top section — profile + actions */}
          <div className="flex items-center justify-between gap-3 p-4 md:px-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <Avatar className="w-11 h-11 border-2 border-white/10">
                  <AvatarFallback className="bg-[#2d2d2d] text-white text-sm font-semibold">C</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1a1a1a]" />
            </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Christopher</span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400">
                    <IconCrown className="w-2.5 h-2.5" /> VIP Gold
                  </span>
            </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-white/40">ID: B3375823</span>
                  <button
                    onClick={() => navigator.clipboard.writeText('B3375823')}
                    className="inline-flex items-center justify-center h-4 w-4 rounded hover:bg-white/10 transition-colors"
                    title="Copy account number"
                  >
                    <IconCopy className="h-3 w-3 text-white/30 hover:text-white/60" />
                  </button>
          </div>
        </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => onOpenNotifications?.()}
                className="relative w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Open notifications"
              >
                <IconBell className="w-4 h-4 text-white/40" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center border border-[#1a1a1a]">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Open profile settings"
              >
                <IconSettings className="w-4 h-4 text-white/40" />
              </button>
            </div>
      </div>

          {/* Balance section — darker inset */}
          <div className="bg-white/[0.03] border-t border-white/[0.06] px-4 md:px-5 py-4">
            <div className="grid grid-cols-2 gap-3 mb-4 max-w-[760px]">
              <div className="bg-[#2d2d2d] rounded-lg p-3 border border-white/[0.06]">
                <div className="text-[11px] text-white/40 mb-1">Available Balance</div>
                <div className="text-xl font-bold text-white tabular-nums leading-tight">$100,000.00</div>
                <div className="mt-3 grid grid-cols-2 gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => onNavigate('payments')}
                    className="inline-flex items-center justify-center gap-1.5 h-8 rounded-md text-[11px] font-semibold text-white transition-colors"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                  >
                    <IconWallet className="h-3.5 w-3.5" />
                    Deposit
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('payments')}
                    className="inline-flex items-center justify-center gap-1.5 h-8 rounded-md border border-white/15 bg-white/[0.04] text-[11px] font-semibold text-white/75 hover:bg-white/[0.08] hover:text-white transition-colors"
                  >
                    <IconCreditCard className="h-3.5 w-3.5" />
                    Withdraw
                  </button>
                </div>
            </div>
              <div className="bg-[#2d2d2d] rounded-lg p-3 border border-white/[0.06]">
                <div className="text-[11px] text-white/40 mb-1">Free Bet</div>
                <div className="text-xl font-bold text-emerald-400 tabular-nums leading-tight">$25.00</div>
                <button
                  type="button"
                  onClick={() => window.location.assign('/sports')}
                  className="mt-3 inline-flex h-8 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-3 text-[11px] font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  Use Now
                </button>
        </div>
      </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══ Engagement Row — exact casino banner cards ═══ */}
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        {/* VIP Rewards Card — matches casino banner */}
        <Card 
          className="group relative flex-shrink-0 cursor-pointer overflow-hidden border border-gray-200 bg-gray-100 bg-white/5 transition-colors duration-300 dark:border-white/10 dark:bg-white/5 w-full md:w-[300px]" 
          style={{ height: '164px' }}
          onClick={() => onOpenVipHub?.()}
        >
          <CardContent className="relative z-10 flex h-full min-h-0 flex-col p-3">
            <CardTitle className="shrink-0 mb-0 text-xs font-semibold text-white leading-tight">
              Gold To Platinum I
            </CardTitle>
            <div className="mt-5 flex min-h-0 flex-1 flex-col">
              <VipTierProgressBar
                value={45}
                variant="compact"
                bannerTile
                showOriginalsNote
                nextTierLabel="Platinum I"
                wagerRemaining="$2,750"
                className="mt-0"
              />
            </div>
          </CardContent>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
        </Card>

        {/* Daily Races Card — matches casino banner */}
        <Card 
          className="group relative cursor-pointer overflow-hidden border border-amber-400/30 bg-gradient-to-br from-amber-500/[0.12] to-transparent bg-white/5 transition-colors duration-300 dark:border-amber-400/35 dark:from-amber-400/[0.08] dark:bg-white/5 w-full md:w-[300px] md:flex-none" 
          style={{ height: '164px' }}
        >
          <CardContent className="relative z-10 flex h-full min-h-0 flex-col p-3">
            <div className="mb-2 flex shrink-0 items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                  style={{ background: 'rgba(245, 158, 11, 0.12)' }}
                >
                  <IconTrophy
                    strokeWidth={1.8}
                    className="h-4 w-4 text-amber-400"
                  />
                </div>
                <CardTitle className="mb-0 text-sm font-semibold text-amber-100 dark:text-amber-100 leading-tight">
                  $25K Daily Race
                </CardTitle>
              </div>
              <div className="shrink-0 text-right">
                <DailyRacesTimer
                  className="text-xl font-bold text-amber-600 tabular-nums dark:text-amber-200"
                  colonClassName="text-amber-500/70 dark:text-amber-300/80"
                />
              </div>
            </div>
            <div className="flex min-h-0 flex-1 items-center">
              <div className="grid w-full grid-cols-3 gap-2 text-xs">
                <div className="rounded-small border border-amber-400/25 bg-amber-500/[0.08] p-2.5 dark:border-amber-400/30">
                  <div className="text-amber-100 font-semibold mb-0.5">3rd</div>
                  <div className="text-[10px] text-amber-200/70">Position</div>
                </div>
                <div className="rounded-small border border-amber-400/25 bg-amber-500/[0.08] p-2.5 dark:border-amber-400/30">
                  <div className="text-amber-100 font-semibold mb-0.5">$80.000</div>
                  <div className="text-[10px] text-amber-200/70">Wagered</div>
                </div>
                <div className="rounded-small border border-amber-400/35 bg-amber-500/[0.12] p-2.5 dark:border-amber-400/40">
                  <div className="text-amber-50 font-semibold mb-0.5">$160.000</div>
                  <div className="text-[10px] text-amber-200/80">Current Prize</div>
                </div>
              </div>
            </div>
          </CardContent>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
        </Card>

        {/* Days Streak */}
        <div className="w-full md:flex-1">
        </div>
      </div>



      <Separator className="bg-white/10 mb-4" />

      {/* ═══ Daily Figures (Weekly) ═══ */}
      <Card className="bg-white/5 border-white/10 mb-4 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-white/10">
            <h3 className="text-base font-semibold text-white">Daily Figures</h3>
            <AnimateTabs
              value={pnlRange}
              onValueChange={(value) => setPnlRange(value as 'thisWeek' | 'lastWeek')}
              className="w-auto self-start sm:ml-auto"
            >
              <AnimateTabsList className="bg-[#1f1f1f] border border-white/15 p-0.5 h-auto gap-1 rounded-small relative">
                {[
                  { value: 'lastWeek', label: 'Last Week' },
                  { value: 'thisWeek', label: 'This Week' },
                ].map((tab) => (
                  <TabsTab
                    key={tab.value}
                    value={tab.value}
                    className="relative z-10 h-8 px-4 rounded-[8px] text-xs font-semibold text-white/75 hover:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    {pnlRange === tab.value && (
                      <motion.div
                        layoutId="dailyFiguresWeekTab"
                        className="absolute inset-0 rounded-[8px] -z-10"
                        style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </TabsTab>
                ))}
              </AnimateTabsList>
            </AnimateTabs>
          </div>

          <div className="px-4 py-3">
            <div className="md:hidden rounded-small border border-white/10 bg-[#2d2d2d] p-4">
                <div className="space-y-0.5">
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
                      <div key={`${day.day}-${day.date}`} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                        <span className="text-base text-white/90">{dayLabel}</span>
                        <span
                          className={cn(
                            'text-base font-semibold tabular-nums',
                            day.amount > 0 ? 'text-emerald-400' : day.amount < 0 ? 'text-red-400' : 'text-white/60'
                          )}
                        >
                          {day.amount > 0 ? '+' : ''}{day.amount.toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[26px] text-white/95 font-semibold">Total</span>
                  <span
                    className={cn(
                      'text-[26px] font-bold tabular-nums',
                      pnlSummary.net >= 0 ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {pnlSummary.net >= 0 ? '+' : ''}{pnlSummary.net.toFixed(2)}
                  </span>
                </div>
              </div>
            <div className="hidden md:block rounded-small border border-white/10 bg-[#2d2d2d] overflow-hidden">
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">Wk</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">M</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">T</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">W</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">T</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">F</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">S</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">S</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-3 text-center text-sm text-white/85 font-semibold tabular-nums">
                        {pnlRange === 'thisWeek' ? '35' : '34'}
                      </td>
                      {selectedPnlData.map((day) => (
                        <td
                          key={`${day.day}-${day.date}`}
                          className={cn(
                            'px-3 py-3 text-center text-sm font-semibold tabular-nums',
                            day.amount > 0 ? 'text-emerald-400' : day.amount < 0 ? 'text-red-400' : 'text-white/60'
                          )}
                        >
                          {day.amount > 0 ? '+' : ''}{day.amount.toFixed(2)}
                        </td>
                      ))}
                      <td
                        className={cn(
                          'px-3 py-3 text-center text-sm font-bold tabular-nums',
                          pnlSummary.net >= 0 ? 'text-emerald-400' : 'text-red-400'
                        )}
                      >
                        {pnlSummary.net >= 0 ? '+' : ''}{pnlSummary.net.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            <div className="mt-2 text-[11px] text-white/45 leading-relaxed">
              * Daily figures are sample values shown in EST.
            </div>
            <div className="text-[11px] text-white/35">
              * Includes Sports, Live Betting, Racebook, Esports and Casino transactions.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══ Favourites Carousel ═══ */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">My Favourites</h2>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isMobile && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (favCarouselApi) favCarouselApi.scrollTo(Math.max(0, favCarouselApi.selectedScrollSnap() - 2)) }} disabled={!favCarouselApi || !favCanScrollPrev}><IconChevronLeft className="h-4 w-4" strokeWidth={2} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (favCarouselApi) favCarouselApi.scrollTo(Math.min(favCarouselApi.scrollSnapList().length - 1, favCarouselApi.selectedScrollSnap() + 2)) }} disabled={!favCarouselApi || !favCanScrollNext}><IconChevronRight className="h-4 w-4" strokeWidth={2} /></Button>
              </>
            )}
          </div>
        </div>
        <div className="relative" style={{ overflow: 'visible' }}>
          <Carousel setApi={setFavCarouselApi} className="w-full relative" style={{ overflow: 'visible' }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
            <CarouselContent className="ml-0 -mr-2 md:-mr-3">
              {favouriteCasinoGames.map((game, i) => (
                <CarouselItem key={i} className={cn("pr-0 basis-auto flex-shrink-0", i === 0 ? "pl-0" : "pl-2 md:pl-3")}>
                  <div className="w-[140px] h-[140px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0">
                    <Image src={game.image} alt={game.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="140px" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-2">
                      <div className="text-white text-[11px] font-bold truncate leading-tight mb-0.5">{game.title}</div>
                      <div className="text-white/60 text-[9px] truncate">{game.provider}</div>
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
      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border border-white/20 text-white/60 bg-white/5 whitespace-nowrap">
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
              <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-2">
                {bet.legs.length}-Leg Parlay
              </div>
              <div className="relative ml-[2px] mb-1">
                <div className="absolute left-[3px] top-[6px] bottom-[6px] w-[1px] bg-white/15" />
                <div className="space-y-3">
                  {bet.legs.map((leg, i) => (
                    <div key={i} className="relative pl-4">
                      <div className="absolute left-0 top-[5px] w-[7px] h-[7px] rounded-full bg-emerald-500 ring-1 ring-emerald-500/20" />
                      <div className="text-xs font-medium text-white leading-tight">{leg.selection}</div>
                      <div className="text-[10px] text-white/50 leading-tight">{leg.market}</div>
                      <div className="text-[10px] text-white/40 leading-tight">{leg.team1} v {leg.team2}</div>
                      <div className="text-[10px] text-white/40">{leg.league}</div>
                      {leg.isLive && leg.liveInfo && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {getLiveTag()}
                          <span className="text-[10px] text-white/60">{leg.liveInfo.period}, {leg.liveInfo.time}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 pt-3 pb-2">
              <div className="text-xs font-medium text-white">{bet.selection}</div>
              <div className="text-[10px] text-white/50">{bet.market}</div>
              <div className="text-[10px] text-white/40">{bet.team1} v {bet.team2}</div>
              <div className="text-[10px] text-white/40">{bet.league}{bet.country ? `, ${bet.country}` : ''}</div>
              {bet.isLive && bet.liveInfo && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  {getLiveTag()}
                  <span className="text-[10px] text-white/60">{bet.liveInfo.period}, {bet.liveInfo.time}</span>
                </div>
              )}
            </div>
          )}

          {bet.isLive && bet.liveInfo && bet.type !== 'parlay' && (
            <div className="mx-4 mb-2 rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs text-white/80">{bet.team1}</span>
                <span className="text-xs font-bold text-white">{bet.liveInfo.score.team1}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
                <span className="text-xs text-white/80">{bet.team2}</span>
                <span className="text-xs font-bold text-white">{bet.liveInfo.score.team2}</span>
              </div>
            </div>
          )}

          {!bet.isLive && bet.finalScore && bet.type !== 'parlay' && (
            <div className="mx-4 mb-2 rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.02]">
                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wide">Final Result</span>
                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wide">FT</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
                <span className={cn("text-xs", bet.status === 'won' && bet.selection.toLowerCase().includes(bet.team1.toLowerCase()) ? "text-emerald-400 font-semibold" : "text-white/80")}>{bet.team1}</span>
                <span className={cn("text-xs font-bold", bet.finalScore.team1 > bet.finalScore.team2 ? "text-white" : "text-white/60")}>{bet.finalScore.team1}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
                <span className={cn("text-xs", bet.status === 'won' && bet.selection.toLowerCase().includes(bet.team2.toLowerCase()) ? "text-emerald-400 font-semibold" : "text-white/80")}>{bet.team2}</span>
                <span className={cn("text-xs font-bold", bet.finalScore.team2 > bet.finalScore.team1 ? "text-white" : "text-white/60")}>{bet.finalScore.team2}</span>
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
              <span className="text-[11px] text-white/40">Risk</span>
              <span className="text-[11px] text-white/40">{isGraded ? 'Result' : 'Potential Returns'}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">{'$'}{bet.amount.toFixed(2)}</span>
              {bet.status === 'won' && bet.wonAmount ? (
                <span className="text-sm font-bold text-emerald-400">+{'$'}{bet.wonAmount.toFixed(2)}</span>
              ) : bet.status === 'lost' ? (
                <span className="text-sm font-bold text-red-400">-{'$'}{bet.amount.toFixed(2)}</span>
              ) : bet.status === 'cashed_out' && bet.cashedOutAmount ? (
                <span className="text-sm font-bold text-emerald-400">{'$'}{bet.cashedOutAmount.toFixed(2)}</span>
              ) : (
                <span className="text-sm font-bold text-white">{'$'}{potentialReturns.toFixed(2)}</span>
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
              className="inline-flex items-center gap-1.5 py-1 px-3 rounded-md text-[11px] font-medium text-white/60 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-all duration-200"
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
      <div className="flex items-center gap-3 pt-4 mb-2">
        <h1 className="text-lg font-bold text-white">Bet History</h1>
        <IconInfoCircle className="w-4 h-4 text-white/40 cursor-pointer hover:text-white/60 transition-colors" />
      </div>

      {/* Daily Figures in place of old bet-state subnav */}
      <div className="mb-4 rounded-lg border border-white/10 bg-white/5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Daily Figures</h3>
            <button
              type="button"
              onClick={() => setIsDailyFiguresMinimized((prev) => !prev)}
              className="inline-flex h-6 w-6 items-center justify-center rounded border border-white/20 text-white/70 hover:text-white hover:border-white/30 transition-colors"
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
            <AnimateTabsList className="bg-[#1f1f1f] border border-white/15 p-0.5 h-auto gap-1 rounded-small relative">
              {[
                { value: 'lastWeek', label: 'Last Week' },
                { value: 'thisWeek', label: 'This Week' },
              ].map((tab) => (
                <TabsTab
                  key={tab.value}
                  value={tab.value}
                  className="relative z-10 h-8 px-4 rounded-[8px] text-xs font-semibold text-white/75 hover:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {pnlRange === tab.value && (
                    <motion.div
                      layoutId="betHistoryDailyFiguresRangeTab"
                      className="absolute inset-0 rounded-[8px] -z-10"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 450, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </TabsTab>
              ))}
            </AnimateTabsList>
          </AnimateTabs>
        </div>

        {!isDailyFiguresMinimized && (
          <div className="px-4 py-3">
            <div className="rounded-small border border-white/10 bg-[#2d2d2d] overflow-hidden">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">Wk</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">M</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">T</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">W</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">T</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">F</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">S</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">S</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/70">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-3 text-center text-sm text-white/85 font-semibold tabular-nums">
                      {pnlRange === 'thisWeek' ? '35' : '34'}
                    </td>
                    {selectedPnlData.map((day) => (
                      <td key={`${day.day}-${day.date}`} className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPnlDay((prev) => (prev === day.day ? null : day.day))
                            setCurrentPage(1)
                            setExpandedBetId(null)
                          }}
                          className={cn(
                            'w-full rounded-[6px] px-1 py-1 text-sm font-semibold tabular-nums transition-colors',
                            day.amount > 0 ? 'text-emerald-400' : day.amount < 0 ? 'text-red-400' : 'text-white/60',
                            selectedPnlDay === day.day && 'bg-white/10 ring-1 ring-white/20'
                          )}
                          title={`Filter bets placed on ${day.day}`}
                        >
                          {day.amount > 0 ? '+' : ''}{day.amount.toFixed(2)}
                        </button>
                      </td>
                    ))}
                    <td
                      className={cn(
                        'px-3 py-3 text-center text-sm font-bold tabular-nums',
                        pnlSummary.net >= 0 ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {pnlSummary.net >= 0 ? '+' : ''}{pnlSummary.net.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Filter trigger */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setFiltersPanelOpen(true)}
          className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
        >
          <IconFilter className="w-4 h-4" />
          <span className="font-medium">APPLY FILTERS</span>
        </button>
        <span className="text-white/30">|</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center h-7 rounded-full border border-white/15 bg-white/[0.04] px-3 text-xs font-medium text-white/85">
            Last 7 Days
          </span>
          {selectedStatus !== 'Status' && (
            <button
              type="button"
              onClick={() => setSelectedStatus('Status')}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-white/[0.04] px-2.5 text-xs font-medium text-white/80 hover:bg-white/[0.08] transition-colors"
            >
              {selectedStatus}
              <IconX className="h-3 w-3" />
            </button>
          )}
          {selectedPnlDay && (
            <button
              type="button"
              onClick={() => setSelectedPnlDay(null)}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-white/[0.04] px-2.5 text-xs font-medium text-white/80 hover:bg-white/[0.08] transition-colors"
            >
              {selectedPnlDay}
              <IconX className="h-3 w-3" />
            </button>
          )}
          {fromDate && (
            <button
              type="button"
              onClick={() => setFromDate('')}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-white/[0.04] px-2.5 text-xs font-medium text-white/80 hover:bg-white/[0.08] transition-colors"
            >
              From {formatDateChip(fromDate)}
              <IconX className="h-3 w-3" />
            </button>
          )}
          {toDate && (
            <button
              type="button"
              onClick={() => setToDate('')}
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-white/[0.04] px-2.5 text-xs font-medium text-white/80 hover:bg-white/[0.08] transition-colors"
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
              className="inline-flex items-center gap-1 h-7 rounded-full border border-white/15 bg-white/[0.04] px-2.5 text-xs font-medium text-white/80 hover:bg-white/[0.08] transition-colors"
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
          <div className="border border-white/10 rounded-lg overflow-hidden">
            {paginatedBets.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-white/45">
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
                      isExpanded ? "bg-white/5" : "hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Sport Icon */}
                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <img
                        src={sportIconMap[bet.sport] || '/sports_icons/soccer.svg'}
                        alt={bet.sport}
                        className="w-3.5 h-3.5 object-contain opacity-70"
                      />
                </div>

                    {/* Bet Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">{'$'}{bet.amount.toFixed(2)}</span>
                        <span className="text-sm text-white truncate">{bet.selection}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-white/50 truncate">{bet.market}</span>
                        {bet.legCount && (
                          <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] text-white/60 font-medium">+{bet.legCount}</span>
                      </span>
                    )}
                  </div>
                      {bet.type !== 'parlay' && bet.team1 && bet.team2 && (
                        <div className="text-[11px] text-white/40 mt-0.5 truncate">
                          {bet.team1} v {bet.team2} · {bet.league}
                  </div>
                      )}
                      {bet.isLive && bet.liveInfo && bet.type !== 'parlay' && (
                        <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                          <span className="text-[11px] text-white/60 truncate">{bet.team1}</span>
                          <span className="text-[11px] font-bold text-white flex-shrink-0 whitespace-nowrap">{bet.liveInfo.score.team1} - {bet.liveInfo.score.team2}</span>
                          <span className="text-[11px] text-white/60 truncate">{bet.team2}</span>
                          <span className="text-[10px] text-white/40 ml-auto flex-shrink-0 whitespace-nowrap">{bet.liveInfo.period} {bet.liveInfo.time}</span>
                </div>
                      )}
                      {!bet.isLive && bet.finalScore && bet.type !== 'parlay' && (
                        <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                          <span className="text-[11px] text-white/50 flex-shrink-0">FT:</span>
                          <span className="text-[11px] text-white/60 truncate">{bet.team1}</span>
                          <span className="text-[11px] font-bold text-white flex-shrink-0 whitespace-nowrap">{bet.finalScore.team1} - {bet.finalScore.team2}</span>
                          <span className="text-[11px] text-white/60 truncate">{bet.team2}</span>
              </div>
                      )}
              </div>

                    {/* Tags + Odds + Chevron */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {bet.status ? getStatusBadge(bet) : (
                        bet.isLive ? getLiveTag() : getPendingTag()
                      )}
                      <span className="text-sm font-medium text-white/80 min-w-[45px] text-right">{bet.odds}</span>
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
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
            className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white text-xs focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/50">
          <span>{currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
              <IconChevronLeft className="w-4 h-4" />
            </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
              className="fixed inset-0 z-[70] bg-black/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersPanelOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[80] h-full w-full max-w-[360px] bg-white text-black shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                  <h2 className="text-[26px] font-semibold leading-none">Sort &amp; Filters</h2>
                  <button
                    type="button"
                    onClick={() => setFiltersPanelOpen(false)}
                    className="rounded-md p-1 text-black/60 hover:bg-black/5 hover:text-black transition-colors"
                    aria-label="Close filters"
                  >
                    <IconX className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-6">
                  <div className="space-y-6">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-black/60">Select a Status</p>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm text-black focus:border-black/40 focus:outline-none"
                      >
                        <option>Status</option>
                        <option>Open</option>
                        <option>Settled</option>
                        <option>Won</option>
                        <option>Lost</option>
                      </select>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-black/60">Select a Custom Date Range</p>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-black/45">Date Range</label>
                      <select
                        value={dateRangePreset}
                        onChange={(e) => setDateRangePreset(e.target.value)}
                        className="h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm text-black focus:border-black/40 focus:outline-none"
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
                          className="h-10 rounded-md border border-black/20 bg-white px-2 text-sm text-black focus:border-black/40 focus:outline-none"
                        />
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="h-10 rounded-md border border-black/20 bg-white px-2 text-sm text-black focus:border-black/40 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-black/60">Wager Type</p>
                      <div className="space-y-3">
                        {['SportsBook', 'Spread', 'Spread FB', 'Money Line', 'Total'].map((type) => (
                          <label key={type} className="flex items-center gap-2.5 text-sm text-black/85">
                            <input
                              type="checkbox"
                              checked={wagerTypeFilters.includes(type)}
                              onChange={() => toggleWagerTypeFilter(type)}
                              className="h-4 w-4 rounded-full border border-black/40 text-black focus:ring-0"
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-black/10 p-5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStatus('Status')
                      setDateRangePreset('Last 7 Days')
                      setFromDate('')
                      setToDate('')
                      setWagerTypeFilters([])
                    }}
                    className="h-11 rounded-md border border-black/30 text-sm font-semibold text-black hover:bg-black/5 transition-colors"
                  >
                    CLEAR ALL
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersPanelOpen(false)}
                    className="h-11 rounded-md bg-[#7fbf2f] text-sm font-semibold text-white hover:bg-[#73af2b] transition-colors"
                  >
                    APPLY
                  </button>
                </div>
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
    <div className="px-4 md:px-6 pt-6 pb-8 w-full space-y-4">
      <h2 className="text-lg font-semibold text-white">My Bonus</h2>

      {/* AnimateTabs pill style */}
      <div>
        <AnimateTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AnimateTabsList className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative">
        {['Sports', 'Casino'].map((tab) => (
              <TabsTab
            key={tab}
                value={tab}
                className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none"
              >
            {activeTab === tab && (
              <motion.div
                    layoutId="accountBonusTab"
                    className="absolute inset-0 rounded-2xl -z-10"
                style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
                <span className="relative z-10">{tab}</span>
              </TabsTab>
        ))}
          </AnimateTabsList>
        </AnimateTabs>
      </div>

      {/* Bonus Table */}
      <div className={cn("rounded-lg border border-white/10 overflow-hidden", isMobile && "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 bg-white/[0.03]">
              <TableHead className="text-white/50 text-xs font-medium">Code</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Amount</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Rollover</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Date</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Status</TableHead>
              {!isMobile && <TableHead className="w-[40px]" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonusData.map((bonus) => (
              <React.Fragment key={bonus.id}>
                <TableRow className="border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => setExpandedRow(expandedRow === bonus.id ? null : bonus.id)}>
                  <TableCell className="text-sm text-white">{bonus.code}</TableCell>
                  <TableCell className="text-sm text-white">{bonus.amount}</TableCell>
                  <TableCell className="text-sm text-white">{bonus.rollover}</TableCell>
                  <TableCell className="text-sm text-white/60">{bonus.date}</TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-0.5 text-[11px] font-semibold rounded-full text-white", bonus.statusColor)}>{bonus.status}</span>
                  </TableCell>
                  {!isMobile && (
                    <TableCell><IconChevronDown className={cn("w-4 h-4 text-white/30 transition-transform", expandedRow === bonus.id && "rotate-180")} /></TableCell>
                  )}
                </TableRow>
                {expandedRow === bonus.id && (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={6} className="py-3">
                      <div className="text-xs text-white/50 space-y-1">
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

  return (
    <div className="px-4 md:px-6 pt-6 pb-8 w-full space-y-4">
      <h2 className="text-lg font-semibold text-white">Transactions</h2>
      <div className={cn("rounded-lg border border-white/10 overflow-hidden", isMobile && "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 bg-white/[0.03]">
              <TableHead className="text-white/50 text-xs font-medium">Date</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Type</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Method</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Amount</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Status</TableHead>
              <TableHead className="text-white/50 text-xs font-medium">Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionsData.map((tx) => (
              <TableRow key={tx.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-sm text-white/60">{tx.date}</TableCell>
                <TableCell className="text-sm text-white">{tx.type}</TableCell>
                <TableCell className="text-sm text-white/70">{tx.method}</TableCell>
                <TableCell className={cn("text-sm font-medium", tx.amount.startsWith('+') ? "text-emerald-400" : "text-red-400")}>{tx.amount}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-0.5 text-[11px] font-semibold rounded-full",
                    tx.status === 'COMPLETED' && "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30",
                    tx.status === 'PENDING' && "text-amber-400 bg-amber-500/10 border border-amber-500/30",
                    tx.status === 'CREDITED' && "text-blue-400 bg-blue-500/10 border border-blue-500/30",
                  )}>{tx.status}</span>
                </TableCell>
                <TableCell className="text-xs text-white/40 font-mono">{tx.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Refer a Friend Section
// ═══════════════════════════════════════════════════════════
function ReferFriendContent() {
  const [copied, setCopied] = useState(false)
  const referralCode = 'BOL-CHRIS-2026'
  const referralLink = `https://www.betonline.ag/ref/${referralCode}`

  return (
    <div className="px-4 md:px-6 pt-6 pb-8 w-full space-y-6">
      <h2 className="text-lg font-semibold text-white">Refer a Friend</h2>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center">
            <IconUserPlus className="w-6 h-6 text-white/60" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-white">Earn up to $200 per referral!</h3>
          <p className="text-xs text-white/50 max-w-md">
            Share your unique referral link with friends. When they sign up and make their first deposit, you both earn a bonus!
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-wider">Your Referral Code</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono text-white truncate">{referralLink}</div>
            <button
              onClick={() => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              className={cn(
                "px-3 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5",
                copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
              )}
            >
              {copied ? <IconCheck className="w-3.5 h-3.5" /> : <IconCopy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-white">3</p>
            <p className="text-[10px] text-white/40 mt-0.5">Friends Referred</p>
          </div>
          <div>
            <p className="text-xl font-bold text-emerald-400">$150</p>
            <p className="text-[10px] text-white/40 mt-0.5">Total Earned</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-400">1</p>
            <p className="text-[10px] text-white/40 mt-0.5">Pending</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Payments Section
// ═══════════════════════════════════════════════════════════
function PaymentsContent() {
  const [activeTab, setActiveTab] = useState('Deposit')

  return (
    <div className="px-4 md:px-6 pt-6 pb-8 w-full space-y-4">
      <h2 className="text-lg font-semibold text-white">Payments</h2>

      {/* AnimateTabs pill style */}
      <div>
        <AnimateTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AnimateTabsList className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative">
            {['Deposit', 'Withdraw'].map((tab) => (
              <TabsTab
                key={tab}
                value={tab}
                className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none"
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="accountPaymentTab"
                    className="absolute inset-0 rounded-2xl -z-10"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </TabsTab>
            ))}
          </AnimateTabsList>
        </AnimateTabs>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'Deposit' && (
          <motion.div key="deposit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <p className="text-xs text-white/50">Select your preferred payment method to make a deposit.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Bitcoin', icon: '₿' },
            { label: 'Ethereum', icon: 'Ξ' },
            { label: 'Credit Card', icon: '💳' },
            { label: 'Wire Transfer', icon: '🏦' },
            { label: 'Cashier Check', icon: '📄' },
            { label: 'Person to Person', icon: '🤝' },
          ].map((method) => (
                  <button key={method.label} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-colors">
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-[10px] text-white/70">{method.label}</span>
            </button>
          ))}
        </div>
      </div>
          </motion.div>
        )}
        {activeTab === 'Withdraw' && (
          <motion.div key="withdraw" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/10">
          <div>
                  <span className="text-[10px] text-white/40">Available for Withdrawal</span>
                  <p className="text-lg font-bold text-white mt-0.5">$100,000.00</p>
          </div>
                <IconWallet className="w-6 h-6 text-white/20" strokeWidth={1.5} />
        </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Bitcoin', icon: '₿' },
            { label: 'Wire Transfer', icon: '🏦' },
            { label: 'Cashier Check', icon: '📄' },
            { label: 'Person to Person', icon: '🤝' },
          ].map((method) => (
                  <button key={method.label} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-colors">
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-[10px] text-white/70">{method.label}</span>
            </button>
          ))}
        </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Security Central Section
// ═══════════════════════════════════════════════════════════
function SecurityContent() {
  return (
    <div className="px-4 md:px-6 pt-6 pb-8 w-full space-y-4">
      <h2 className="text-lg font-semibold text-white">Security Central</h2>
      <div className="space-y-2">
        {[
          { icon: IconLock, label: 'Change Password', desc: 'Update your account password' },
          { icon: IconShield, label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
          { icon: IconHistory, label: 'Login History', desc: 'View recent login activity' },
          { icon: IconSettings, label: 'Session Management', desc: 'Manage active sessions' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">{item.label}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{item.desc}</p>
            </div>
            <IconChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
          </div>
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
    <div className="px-4 md:px-6 pt-6 pb-8 w-full space-y-4">
      <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Username', value: 'christopher' },
            { label: 'Email', value: 'chris@example.com' },
            { label: 'Phone', value: '+1 (555) 123-4567' },
            { label: 'Member Since', value: 'January 2023' },
            { label: 'Account Status', value: 'Verified', color: 'text-emerald-400' },
            { label: 'VIP Level', value: 'Gold', color: 'text-amber-400' },
          ].map((item) => (
            <div key={item.label}>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{item.label}</span>
              <p className={cn("text-xs font-medium mt-0.5", item.color || "text-white")}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: IconBell, label: 'Notification Preferences', desc: 'Manage email & push notifications' },
          { icon: IconDownload, label: 'Download My Data', desc: 'Export your account data' },
          { icon: IconShare, label: 'Connected Accounts', desc: 'Manage linked accounts' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">{item.label}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{item.desc}</p>
            </div>
            <IconChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
          </div>
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
    const tabs = ['Overview', 'Level Up', 'Loot Crates', 'Bet & Get', 'Benefits']
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
            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
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
            className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300 backdrop-blur-xl flex items-center"
            style={{
              minWidth: 'max-content',
              width: 'max-content',
              flexShrink: 0,
              marginRight: '16px',
              touchAction: 'pan-x',
              pointerEvents: 'auto'
            }}
          >
            {['Overview', 'Level Up', 'Loot Crates', 'Bet & Get', 'Benefits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setVipActiveTab(tab)}
                className={cn(
                  "relative px-4 py-1 h-9 text-xs font-medium rounded-2xl transition-all duration-300 whitespace-nowrap flex-shrink-0",
                  vipActiveTab === tab
                    ? "text-black bg-[#fef3c7]"
                    : "text-white/70 hover:text-white hover:bg-white/5 bg-transparent"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
            style={{ pointerEvents: 'auto', marginRight: '8px' }}
          >
            <IconChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>

      <div className={cn("px-4 pt-4 overflow-y-auto flex-1 min-h-0", isMobile ? "pb-6" : "pb-2")} style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto', flex: '1 1 auto', minHeight: 0, paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 24px)' : undefined }}>
        {vipActiveTab === 'Overview' && (
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <CardTitle className="text-sm text-white/70 mb-2">Gold To Platinum I</CardTitle>
                <VipTierProgressBar value={45} nextTierLabel="Platinum I" wagerRemaining="$2,750" />
              </CardContent>
            </Card>

            <VipBenefitTiles
              onClaim={(tile) => console.log('VIP claim', tile.id)}
              onTileClick={(tile) => console.log('VIP tile click', tile.id)}
            />

            <RedeemPromoCode />

            {/* Telegram CTA */}
            <a
              href="https://t.me/betonline"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl bg-gradient-to-r from-[#229ED9]/10 to-[#229ED9]/5 border border-[#229ED9]/20 hover:border-[#229ED9]/40 p-4 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#229ED9]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#229ED9]/30 transition-colors">
                <IconBrandTelegram className="w-6 h-6 text-[#229ED9]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-0.5">Join our Telegram</p>
                <p className="text-xs text-white/40 leading-snug">
                  Get exclusive Cash Drop codes, promotions & rewards delivered straight to you.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="px-3 py-1.5 rounded-lg bg-[#229ED9] text-white text-xs font-semibold group-hover:bg-[#1a8bc2] transition-colors">
                  Join
                </div>
              </div>
            </a>

          </div>
        )}

        {vipActiveTab === 'Loot Crates' && (
          <div className="space-y-3">
            <RewardCrates variant="compact" />
          </div>
        )}

        {vipActiveTab === 'Bet & Get' && (
          <div className="space-y-3">
            <BetAndGet />
          </div>
        )}

        {vipActiveTab === 'Level Up' && (
          <div className="space-y-3">
            <LevelUpSpinner />
          </div>
        )}
        
        {vipActiveTab === 'Benefits' && (
          <div className="space-y-3">
            <MyBenefitsAccordion />
          </div>
        )}


        {vipActiveTab === 'Reloads' && <ReloadClaim />}
        {vipActiveTab === 'Cash Drop' && <CashDropCode />}
      </div>
    </div>
  )
}

function AccountPageContent() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { trackNav, trackClick, trackAction, trackSidebar } = useTracking('account')
  const { state: sidebarState, open: sidebarOpen, setOpen, openMobile, setOpenMobile, toggleSidebar } = useSidebar()
  const [activeSection, setActiveSection] = useState<AccountSection>('dashboard')
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [quickLinksOpen, setQuickLinksOpen] = useState(true)
  const [loadingQuickLink, setLoadingQuickLink] = useState<string | null>(null)
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false)
  const lastScrollYRef = useRef(0)
  const [balance, setBalance] = useState(10)
  const [displayBalance, setDisplayBalance] = useState(10)
  useRainBalance(setBalance, setDisplayBalance)
  const pendingBalanceRef = useRef(0)
  const brandPrimary = 'var(--ds-primary, #ee3536)'

  // ─── Drawer state ───
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false)
  const [accountDrawerView, setAccountDrawerView] = useState<'account' | 'notifications'>('account')
  const webInboxUnreadCount = 2
  const [depositDrawerOpen, setDepositDrawerOpen] = useState(false)
  const [vipDrawerOpen, setVipDrawerOpen] = useState(false)
  const [vipActiveTab, setVipActiveTab] = useState('Overview')
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
    trackClick('account-drawer', 'My Account')
    setVipDrawerOpen(false)
    setDepositDrawerOpen(false)
    setAccountDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [trackClick])
  const openVipDrawer = useCallback(() => {
    trackClick('vip-hub', 'Overview')
    setAccountDrawerOpen(false)
    setDepositDrawerOpen(false)
    setVipDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [trackClick])

  // Listen for the global VIP Hub open event so sub-component nav handlers
  // can launch the drawer without needing to thread `openVipDrawer` down
  // through props.
  useEffect(() => {
    const handler = () => openVipDrawer()
    if (typeof window === 'undefined') return
    window.addEventListener('vip:open-drawer', handler)
    return () => window.removeEventListener('vip:open-drawer', handler)
  }, [openVipDrawer])
  const openDepositDrawer = useCallback(() => {
    trackClick('deposit', 'Deposit')
    setAccountDrawerOpen(false)
    setVipDrawerOpen(false)
    setDepositDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [trackClick])

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

  // BetOnline logo SVG
  const bolLogo = (
    <svg viewBox="0 0 640 86" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g id="BETONLINE">
        <path fillRule="evenodd" clipRule="evenodd" d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z" fill={colorTokenMap['betRed/500']?.hex || '#ee3536'} />
        <path d="M120.693 85.7021V0.0993091H178.194V17.4781H140.558V33.6651H176.197V50.2494H140.658V68.0254H180.39V85.7021H120.693Z" fill={colorTokenMap['betRed/500']?.hex || '#ee3536'} />
        <path d="M257.757 8.54042C261.251 5.16397 265.244 2.38337 269.736 0.0993091H185.781V17.776H209.939V85.7021H230.604V17.776H250.37C252.466 14.3995 254.962 11.321 257.757 8.54042Z" fill={colorTokenMap['betRed/500']?.hex || '#ee3536'} />
        <path fillRule="evenodd" clipRule="evenodd" d="M313.761 3.47575C319.151 5.66051 323.843 8.63973 327.737 12.5127C331.63 16.3857 334.625 20.9538 336.821 26.1178C339.017 31.3811 340.115 37.0416 340.115 43.0993C340.115 49.1571 339.017 54.9169 336.821 60.0808C334.625 65.2448 331.63 69.8129 327.737 73.6859C323.843 77.4596 319.151 80.5381 313.761 82.7229C308.27 84.9076 302.28 86 295.891 86C289.403 86 283.413 84.9076 278.022 82.7229C272.631 80.5381 267.939 77.5589 264.046 73.6859C260.253 69.9122 257.158 65.2448 254.962 60.0808C252.766 54.8176 251.667 49.1571 251.667 43.0993C251.667 37.0416 252.766 31.2818 254.962 26.1178C257.158 20.9538 260.153 16.3857 264.046 12.5127C267.939 8.73903 272.631 5.66051 278.022 3.47575C283.513 1.291 289.502 0.198618 295.891 0.198618C302.38 0.198618 308.37 1.291 313.761 3.47575ZM324.642 55.3141C326.139 51.5404 326.838 47.3695 326.838 43.0993C326.838 38.8291 326.04 34.6582 324.642 30.8845C323.244 27.1109 321.148 23.7344 318.453 20.9538C315.757 18.1732 312.563 15.8891 308.769 14.2009C305.076 12.5127 300.783 11.7182 296.091 11.7182C291.399 11.7182 287.206 12.5127 283.413 14.2009C279.719 15.8891 276.425 18.1732 273.73 20.9538C271.134 23.7344 269.038 27.1109 267.54 30.8845C266.043 34.6582 265.344 38.8291 265.344 43.0993C265.344 47.3695 266.043 51.5404 267.54 55.3141C268.938 59.0878 271.034 62.4642 273.73 65.2448C276.425 68.0254 279.619 70.3095 283.413 71.9977C287.107 73.6859 291.399 74.4804 296.091 74.4804C300.783 74.4804 304.976 73.6859 308.769 71.9977C312.463 70.3095 315.757 68.0254 318.453 65.2448C321.048 62.4642 323.145 59.0878 324.642 55.3141Z" fill="white" />
        <path d="M437.847 0.0993091H425.069V85.6028H476.681V74.1824H437.847V0.0993091Z" fill="white" />
        <path d="M484.268 0.0993091H497.046V85.7021H484.268V0.0993091Z" fill="white" />
        <path d="M594.778 74.1824V48.2633H634.909V36.7436H594.778V11.6189H637.804V0.0993091H582V85.6028H640V74.1824H594.778Z" fill="white" />
        <path d="M347.802 0.0993091L405.403 56.903V0.0993091H417.482V85.6028L359.782 29.4942V85.6028H347.802V0.0993091Z" fill="white" />
        <path d="M562.333 57.3002L504.633 0.0993091V85.6028H516.712V29.8915L574.313 85.2055V0.0993091H562.333V57.3002Z" fill="white" />
      </g>
    </svg>
  )

  // Sidebar items — matching BetOnline reference: My Account, Bet History, Transactions, My Bonus, Payments, Refer a Friend, Security Central, Profile Settings
  const sidebarItems = [
    { id: 'dashboard' as const, icon: IconUser, label: 'My Account' },
    { id: 'bet-history' as const, icon: IconTicket, label: 'Bet History' },
    { id: 'transactions' as const, icon: IconCurrencyDollar, label: 'Transactions' },
    { id: 'my-bonus' as const, icon: IconGift, label: 'My Bonus' },
    { id: 'payments' as const, icon: IconCreditCard, label: 'Payments' },
    { id: 'refer' as const, icon: IconUserPlus, label: 'Refer a Friend' },
    { id: 'security' as const, icon: IconShield, label: 'Security Central' },
    { id: 'profile' as const, icon: IconSettings, label: 'Profile Settings' },
  ]

  if (!mounted) {
    return (
      <div className="w-full bg-[#1a1a1a] text-white font-figtree overflow-x-hidden min-h-screen flex items-center justify-center">
        <div className="text-white/70">Loading...</div>
      </div>
    )
  }

  return (
    <div
      data-page-bg
      className="w-full bg-[#1a1a1a] text-white font-figtree overflow-x-hidden min-h-screen"
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
              ...(visibleProducts.vipRewards ? [{ label: 'VIP Rewards', onClick: () => { trackNav('vip-rewards', 'VIP Rewards'); openVipDrawer() } }] : []),
              ...(visibleProducts.casino ? [{ label: 'Promotions', onClick: () => { trackNav('promotions', 'Promotions'); router.push('/promotions') } }] : []),
            ].map((item) => (
              <button
                key={item.label}
                onClick={(e) => { e.stopPropagation(); setLoadingQuickLink(item.label); item.onClick(); setTimeout(() => setLoadingQuickLink(null), 1200) }}
                className="flex-shrink-0 px-3 py-1.5 rounded-small text-xs font-medium transition-colors text-white/70 hover:text-white relative"
              >
                <span className={cn("transition-opacity duration-150", loadingQuickLink === item.label ? "opacity-0" : "opacity-100")}>{item.label}</span>
                {loadingQuickLink === item.label && (
                  <span className="absolute inset-0 flex items-center justify-center"><IconLoader2 className="w-3.5 h-3.5 text-white animate-spin" /></span>
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
          "border-b border-white/10 h-16 flex items-center justify-between z-[101] fixed right-0 transition-[left,background-color] duration-200 ease-linear",
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
        <div className="flex items-center gap-6">
          {/* Hamburger + Logo — mobile only */}
          {isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/5"
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
                  <svg className="h-4 w-4 text-white" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="2.75" width="14" height="2" rx="1" fill="currentColor" />
                    <rect x="1" y="7" width="10" height="2" rx="1" fill="currentColor" />
                    <rect x="1" y="11.25" width="6" height="2" rx="1" fill="currentColor" />
                  </svg>
                )}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
              <div
                className="relative h-8 w-[120px] flex items-center cursor-pointer"
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
                  className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </Button>
                <div className="w-px h-5 bg-white/20" />
              </div>

                {visibleProducts.sports && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-white/5 hover:text-white transition-colors",
                      "text-white/70 cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); trackNav('sports', 'Sports'); router.push('/sports/football') }}
                  >
                    <span className="relative z-10">Sports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}


                {visibleProducts.casino && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-white/5 hover:text-white transition-colors",
                      "text-white/70 cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); trackNav('casino', 'Casino'); router.push('/casino') }}
                  >
                    <span className="relative z-10">Casino</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}


                {visibleProducts.poker && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-white/5 hover:text-white transition-colors",
                      "text-white/70 cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); trackNav('poker', 'Poker'); router.push('/casino?poker=true') }}
                  >
                    <span className="relative z-10">Poker</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}

                {visibleProducts.vipRewards && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-white/5 hover:text-white transition-colors",
                      "text-white/70 cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); trackNav('vip-rewards', 'VIP Rewards'); openVipDrawer() }}
                  >
                    <span className="relative z-10">VIP Rewards</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}

                {visibleProducts.casino && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                      "hover:bg-white/5 hover:text-white transition-colors",
                      "text-white/70 cursor-pointer"
                    )}
                    style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      trackNav('promotions', 'Promotions')
                      setVipDrawerOpen(false)
                      router.push('/promotions')
                    }}
                  >
                    <span className="relative z-10">Promotions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )}

                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                          "hover:bg-white/5 hover:text-white transition-colors",
                          "text-white/70 data-[state=open]:text-white data-[state=open]:bg-white/10"
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
                      className="w-[200px] bg-[#2d2d2d] border-white/10 z-[120]"
                      style={{ zIndex: 120 }}
                    >
                      <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/5">
                        <a href="/esports" className="w-full">Esports</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/5">
                        <a href="#" className="w-full">Racebook</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/5">
                        <a href="#" className="w-full">Contests</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/5">
                        <a href="#" className="w-full">Virtuals</a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          )}
        </div>

        {/* Right side — exact casino pattern: VIP crown, separator, avatar+balance, deposit, chat */}
        <div className={cn("flex items-center", isMobile ? "gap-2" : "gap-3")} style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative' }}>
          {/* VIP Crown Button - Desktop */}
          {!isMobile && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openVipDrawer()
              }}
              className={cn(
                "rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center transition-colors",
                "hover:bg-yellow-400/30 hover:border-yellow-400/40",
                "active:bg-gray-500/20",
                vipDrawerOpen && "bg-yellow-400/30 border-yellow-400/40",
                "h-8 w-8"
              )}
              style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
            >
              <IconCrown className="text-yellow-400 w-4 h-4" />
            </button>
          )}

          {/* Separator - Desktop */}
          {!isMobile && <div className="h-6 w-px bg-white/20" />}

          {/* Balance and Avatar Button */}
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openAccountDrawer()
            }}
            className={cn(
              "flex items-center rounded-small transition-colors group",
              "bg-white/5 hover:bg-white/10",
              "active:bg-gray-500/20",
              accountDrawerOpen && "text-white",
              isMobile ? "gap-1 px-1.5 py-1" : "gap-1.5 px-2 py-1"
            )}
            style={accountDrawerOpen ? { pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer', backgroundColor: brandPrimary } : { pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
          >
            <div className="relative">
              <Avatar className={cn(
                "border border-white/20 group-hover:border-white/40 transition-colors",
                isMobile ? "h-5 w-5" : "h-6 w-6"
              )}>
                <AvatarFallback className="bg-white/10 text-white flex items-center justify-center font-semibold tracking-tight" style={{ fontSize: isMobile ? '9px' : '10px' }}>
                  CH
                </AvatarFallback>
              </Avatar>
              {/* Red dot indicator for notifications */}
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
            </div>
            <span className={cn(
              "font-medium text-white text-right tabular-nums transition-all duration-300",
              isMobile ? "text-[10px] min-w-[60px]" : "text-xs min-w-[70px]"
            )}>
              $<NumberFlow value={displayBalance} format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
            </span>
          </Button>

          {/* VIP Crown Button - Mobile only */}
          {isMobile && (
          <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openVipDrawer()
              }}
              className={cn(
                "rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center transition-colors",
                "hover:bg-yellow-400/30 hover:border-yellow-400/40",
                "active:bg-gray-500/20",
                vipDrawerOpen && "bg-yellow-400/30 border-yellow-400/40",
                "h-8 w-8"
              )}
              style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
          >
              <IconCrown className="text-yellow-400 w-4 h-4" />
          </button>
          )}

          {/* Deposit Button - Desktop only */}
          {!isMobile && (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openDepositDrawer()
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-small transition-colors group",
                "bg-white/5 hover:bg-white/10",
                "active:bg-gray-500/20",
                "text-xs font-semibold text-white cursor-pointer"
              )}
              style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
            >
              <IconWallet className="w-3.5 h-3.5 text-white" />
              <span className="text-white">Wallet</span>
            </Button>
          )}

          {/* Chat Toggle - Desktop only */}
          {!isMobile && <ChatNavToggle />}
        </div>
      </motion.header>

      {/* ═══ Layout: Sidebar + Content ═══ */}
      <div className="flex w-full min-h-screen bg-[#1a1a1a] relative" style={{ marginTop: '64px' }} data-sidebar-full-height>
        {/* Persistent sidebar backdrop — prevents black flash during page transitions */}
        {!isMobile && (
          <div 
            className="fixed top-0 left-0 h-screen z-[101] transition-[width] duration-200 ease-linear border-r border-white/10"
            style={{ 
              width: sidebarOpen ? '16rem' : '3rem',
              backgroundColor: 'var(--ds-sidebar-bg, #2d2d2d)'
            }}
          />
        )}
        {/* Sidebar — full height, above main nav — same as casino/poker */}
        <Sidebar
          collapsible="icon"
          variant="sidebar"
          mobileOverlay
          mobileNoDrag
          mobileBg="#2d2d2d"
          mobileOverlayClassName="!bg-black/30 !backdrop-blur-sm"
          className="!bg-[#2d2d2d] border-r border-white/10 text-white [&>div]:!bg-[#2d2d2d] !h-screen !top-0 !z-[102]"
        >
          {/* Sidebar Header — logo with collapse animation */}
          <SidebarHeader
            className="px-4 h-14 flex items-center flex-shrink-0 overflow-hidden sticky top-0 z-20"
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
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
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
                      <svg viewBox="0 0 114 86" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                        <path fillRule="evenodd" clipRule="evenodd" d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z" fill="#ee3536"/>
              </svg>
                    </motion.div>
                  ) : isMobile ? (
                    <motion.div
                      key="b-lockup-mobile"
                      className="flex items-center justify-center"
                      initial={{ opacity: 0, y: 12, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.6, delay: 0.05 }}
                    >
                      <svg viewBox="0 0 114 86" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                        <path fillRule="evenodd" clipRule="evenodd" d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z" fill="#ee3536"/>
                      </svg>
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
                      {/* Full BETONLINE logo */}
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
              className="sticky top-14 z-20 border-b border-white/5"
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
                  ...(visibleProducts.sports ? [{ label: 'Sports', page: 'sports' as const }] : []),
                  ...(visibleProducts.casino ? [{ label: 'Casino', page: 'casino' as const }] : []),
                  ...(visibleProducts.poker ? [{ label: 'Poker', page: 'poker' as const }] : []),
                  ...(visibleProducts.vipRewards ? [{ label: 'VIP Rewards', page: 'vipRewards' as const }] : []),
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
                      } else if (item.page === 'vipRewards') {
                        openVipDrawer()
                      } else if (item.page === 'promotions') {
                        setVipDrawerOpen(false)
                        router.push('/promotions')
                      }
                    }}
                    className={cn(
                      "flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative",
                      "text-white/35 font-medium hover:text-white/60"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                {/* Other — inline dropdown toggle */}
                <button 
                  onClick={() => setOtherDropdownOpen(!otherDropdownOpen)}
                  className="flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative text-white/35 font-medium hover:text-white/60 flex items-center gap-0.5"
                >
                  Other
                  <IconChevronDown className={cn("w-3 h-3 transition-transform duration-200", otherDropdownOpen && "rotate-180")} />
                </button>
              </div>
            </div>
          )}

          {/* Expandable Other sub-items — outside sticky strip so it renders below */}
          {isMobile && (
            <AnimatePresence initial={false}>
              {otherDropdownOpen && (
                <motion.div
                  key="account-other-dropdown"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden border-b border-white/5"
                  style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)' }}
                >
                  <div className="flex items-center gap-0 px-1 py-1">
                    {[
                      { label: 'Esports', href: '/esports' },
                      { label: 'Racebook', href: '/racebook' },
                      { label: 'Contests', href: '/contests' },
                      { label: 'Virtuals', href: '/virtuals' },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                        className="flex-shrink-0 px-3 py-2 text-[13px] text-white/50 font-medium hover:text-white whitespace-nowrap transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                              "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                            )}
                            style={activeSection === 'dashboard' ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                          >
                            <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", activeSection === 'dashboard' ? "bg-white/20" : "bg-white/10")}>
                              <IconUser strokeWidth={1.5} className="w-4 h-4" />
                            </div>
                            <span>My Account</span>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {sidebarState === 'collapsed' && (
                          <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                            <p>My Account</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <Separator className="bg-white/10 mx-2" />

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
                                  "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                                )}
                                style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                              >
                                <Icon strokeWidth={1.5} className="w-5 h-5" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {sidebarState === 'collapsed' && (
                              <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
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

              <Separator className="bg-white/10 mx-2" />

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
                                  "text-white/70 hover:text-white hover:bg-white/5"
                                )}
                              >
                                <Icon strokeWidth={1.5} className="w-5 h-5" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {sidebarState === 'collapsed' && (
                              <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
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
          className="bg-[#1a1a1a] text-white overflow-x-hidden"
          style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}
        >
          {/* Sub-nav — AnimateTabs pill style, mobile only (desktop uses sidebar) */}
          {isMobile && (
          <motion.div
            className="fixed left-0 right-0 z-[90] bg-[#1a1a1a]/60 backdrop-blur-xl border-b border-white/10 py-3 px-4 overflow-x-auto overflow-y-visible scrollbar-hide"
            initial={false}
            animate={{ top: quickLinksOpen ? 104 : 64 }}
            transition={{ type: "tween", ease: "linear", duration: 0.3 }}
          >
            <div>
              <AnimateTabs value={activeSection} onValueChange={(v) => { trackClick('account-tab', v, { section: 'sub-nav', from: activeSection, to: v }); setActiveSection(v as AccountSection) }} className="w-max">
                <AnimateTabsList className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative">
                  {sidebarItems.map((item) => (
                    <TabsTab
                      key={item.id}
                      value={item.id}
                      className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none whitespace-nowrap"
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
                  onOpenNotifications={openNotificationsDrawer}
                  unreadNotifications={webInboxUnreadCount}
                />
              )}
                {activeSection === 'bet-history' && <BetHistoryContent />}
              {activeSection === 'transactions' && <TransactionsContent />}
              {activeSection === 'my-bonus' && <BonusContent />}
              {activeSection === 'payments' && <PaymentsContent />}
                {activeSection === 'refer' && <ReferFriendContent />}
              {activeSection === 'security' && <SecurityContent />}
              {activeSection === 'profile' && <ProfileContent />}
            </motion.div>
          </AnimatePresence>

          {/* ═══ Global Footer ═══ */}
          <footer className="bg-[#2d2d2d] border-t border-white/10 text-white mt-12 relative z-0">
            <div className="w-full px-6 py-6">
              {/* Quick Links Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Quick Links</h3>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Refer A Friend</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Rules</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Banking</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Affiliates</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Responsible Gaming</a></li>
                  </ul>
                          </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Casino</h3>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    <li><a href="#" className="hover:text-white transition-colors">Play Casino</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blackjack</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Baccarat</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Craps</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Roulette</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Keno</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Slots</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Video Poker</a></li>
                  </ul>
                          </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Sports</h3>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    <li><a href="#" className="hover:text-white transition-colors">Sportsbook</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">NFL Betting Odds</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">NBA Betting Odds</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">MLB Betting Odds</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">NHL Betting Odds</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">NCAAB Betting Odds</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Super Bowl Betting Odds</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Boxing Betting Odds</a></li>
                  </ul>
                        </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Poker</h3>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    <li><a href="#" className="hover:text-white transition-colors">Play Poker</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Texas Holdem</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Omaha Poker</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Racebook</h3>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    <li><a href="#" className="hover:text-white transition-colors">Horse Betting</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Kentucky Derby</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Preakness Stakes</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Belmont Stakes</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Breeders Cup</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Other</h3>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    <li><a href="#" className="hover:text-white transition-colors">Promos</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">News Room</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Why BetOnline</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">BetOnline Vs Competition</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">VIP Rewards</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Bet TV</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Support</h3>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    <li><a href="#" className="hover:text-white transition-colors">Live Chat</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Help Centre</a></li>
                  </ul>
                </div>
              </div>

              <Separator className="bg-white/10 mb-6" />

              {/* Trust & Security Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-base">A TRUSTED & SAFE EXPERIENCE</h3>
                  <IconShield className="w-4 h-4" />
                </div>
                <p className="text-xs text-white/70 mb-4 max-w-2xl">
                  At BetOnline, our company's guiding principle is to establish long-lasting, positive relationships with our customers and within the online gaming community for over 25 years.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {['Bitcoin', 'Ethereum', 'Litecoin', 'USDT', 'USDC', 'BitcoinCash', 'Dogecoin'].map((method) => (
                    <PaymentLogo key={method} method={method} />
                  ))}
                  {['VISA', 'Mastercard', 'AMEX', 'Discover'].map((method) => (
                    <PaymentLogo key={method} method={method} />
                  ))}
                  <SecurityBadge name="Responsible Gaming" iconPath="/banners/partners/responsible gaming.webp" />
                  <SecurityBadge name="SSL Secure" iconPath="/logos/payment/ssl-secure.svg" />
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 border-2 border-white">
                    <span className="text-[10px] font-bold text-white">18+</span>
                    </div>
                  </div>
          </div>

              <Separator className="bg-white/10 mb-6" />

              {/* Partners & Social Media */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-sm">OFFICIAL PARTNERS</h3>
                  <Separator orientation="vertical" className="h-5 bg-white/20" />
                  <div className="flex items-center gap-3">
                    {['laliga', 'lfa', 'matchroom', 'golden boy'].map((partner) => (
                      <div key={partner} className="flex items-center justify-center h-7 opacity-80 hover:opacity-100 transition-opacity">
                        <Image
                          src={`/banners/partners/${partner}.svg`}
                          alt={partner}
                          width={70}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                    <IconBrandFacebook className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                    <IconBrandInstagram className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                    <IconBrandX className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                    <IconBrandYoutube className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                    <IconBrandTiktok className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Timestamp and Copyright */}
              <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/5">
                <div>Copyright ©2024 BetOnline.ag. All rights reserved.</div>
                <div>{currentTime}</div>
              </div>
            </div>
          </footer>
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
            "w-full sm:max-w-md bg-white text-gray-900 flex flex-col",
            "border-l border-gray-200",
            isMobile && "rounded-t-[10px]"
          )}
          style={isMobile ? {
            height: '80vh',
            maxHeight: '80vh',
            top: 'auto',
            bottom: 0,
          } : undefined}
        >
          {isMobile && <DrawerHandle />}
          <DrawerHeader className={cn("flex-shrink-0", isMobile ? "px-4 pt-4 pb-3" : "px-4 pt-4 pb-3")}>
            <div className="flex items-center justify-between gap-3">
              {accountDrawerView === 'notifications' ? (
                <div className="flex items-center gap-3 flex-1">
                  <Button
                    variant="ghost"
                    onClick={() => setAccountDrawerView('account')}
                    className="h-8 w-8 p-0 hover:bg-gray-100 -ml-2"
                  >
                    <IconChevronLeft className="h-5 w-5 text-gray-600" />
                  </Button>
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarFallback className="bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-semibold">
                      ch
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 text-left">ch</div>
                    <div className="text-xs text-gray-500 text-left">b1767721</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                {accountDrawerView === 'notifications' ? null : (
                  <button
                    onClick={() => setAccountDrawerView('notifications')}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
                      "bg-gray-100 hover:bg-gray-200 relative"
                    )}
                  >
                    <IconBell className="h-4 w-4 text-gray-600" />
                    <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
                  </button>
                )}
                {!isMobile && (
                  <DrawerClose asChild>
                    <button className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0">
                      <IconX className="h-4 w-4 text-gray-600" />
                    </button>
                  </DrawerClose>
                )}
              </div>
            </div>
          </DrawerHeader>

          <div className={cn("flex-1 overflow-y-auto", isMobile ? "px-4 pt-4 pb-4" : "px-4 pt-6 pb-4")}>
            {accountDrawerView === 'account' ? (
              <>
                {/* Balance Information */}
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg px-3 py-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Available Balance</span>
                      <span className="text-sm font-semibold text-gray-900">
                        $<NumberFlow value={displayBalance} format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Free Bet</span>
                      <span className="text-sm font-semibold text-gray-900">$0.00</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200 mb-3" />

                {/* Deposit and Withdraw */}
                <div className="space-y-0.5 w-full mb-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-10 px-3"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      openDepositDrawer()
                    }}
                  >
                    <IconCreditCard className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="flex-1 text-left text-gray-900">Deposit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-10 px-3"
                  >
                    <IconArrowRight className="w-5 h-5 mr-3 text-gray-700 rotate-180" />
                    <span className="flex-1 text-left text-gray-900">Withdraw</span>
                  </Button>
                </div>

                <Separator className="bg-gray-200 mb-6" />

                {/* Navigation List */}
                <div className="space-y-1 w-full mb-8">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3 min-w-0"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('dashboard')
                    }}
                  >
                    <IconUser className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="flex-1 text-left text-gray-900">My Account</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3 min-w-0"
                    onClick={() => {
                      setAccountDrawerView('notifications')
                    }}
                  >
                    <IconBell className="w-5 h-5 mr-3 text-gray-700 flex-shrink-0" />
                    <span className="flex-1 text-left text-gray-900">Notifications</span>
                    {webInboxUnreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                        {webInboxUnreadCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3 min-w-0"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('bet-history')
                    }}
                  >
                    <IconFileText className="w-5 h-5 mr-3 text-gray-700 flex-shrink-0" />
                    <span className="flex-1 text-left text-gray-900">Pending Bets</span>
                    <span className="text-sm text-gray-600 ml-auto flex items-center gap-1.5">
                      <span className="bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">4</span>
                      $40.00
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('my-bonus')
                    }}
                  >
                    <IconGift className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="flex-1 text-left text-gray-900">My Bonus</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('transactions')
                    }}
                  >
                    <IconCurrencyDollar className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="flex-1 text-left text-gray-900">Transactions History</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('bet-history')
                    }}
                  >
                    <IconTicket className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="flex-1 text-left text-gray-900">Bet History</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      setActiveSection('refer')
                    }}
                  >
                    <IconUserPlus className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="flex-1 text-left text-gray-900">Refer a Friend</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      openVipDrawer()
                    }}
                  >
                    <IconCrown className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="flex-1 text-left text-gray-900">VIP Rewards</span>
                  </Button>
                </div>

                <Separator className={cn("bg-gray-200", isMobile ? "my-4" : "my-5")} />

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-600 h-10 px-2 min-w-0"
                >
                  <span className="text-sm">Log out</span>
                </Button>
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
            "bg-[#1a1a1a] text-white flex flex-col relative",
            "w-full sm:max-w-md border-l border-white/10 overflow-hidden",
            isMobile && "rounded-t-[10px]"
          )}
          style={isMobile ? {
            height: '80vh',
            maxHeight: '80vh',
            top: 'auto',
            bottom: 0,
          } : { display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}
        >
          {isMobile && <DrawerHandle variant="light" />}
          {!isMobile && (
            <div className="relative px-4 pt-4 pb-2 flex-shrink-0 flex items-center justify-between z-50">
              <h2 className="text-base font-semibold text-white">VIP Hub</h2>
              <DrawerClose asChild>
                <button className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
                  <IconX className="h-4 w-4 text-white/70" />
                </button>
              </DrawerClose>
            </div>
          )}
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
            className="fixed bottom-6 left-1/2 z-[300] flex max-w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-white shadow-2xl"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#059669]">
                <IconCheck className="h-4 w-4 text-white" />
              </div>
              <span className="min-w-0 text-sm font-medium">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/[0.06] text-white/55 transition-colors hover:bg-white/[0.12] hover:text-white"
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
    <Suspense fallback={<div className="w-full bg-[#1a1a1a] min-h-screen" />}>
      <SidebarProvider>
        <AccountPageContent />
      </SidebarProvider>
    </Suspense>
  )
}
