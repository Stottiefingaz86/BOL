'use client'

import { VipCrownNavButton } from '@/components/vip/vip-crown-nav-button'
import { SiteFooter } from '@/components/site-footer'
import { HeaderUserControls } from '@/components/navigation/header-user-controls'

import { VipHubScrollBody } from '@/components/vip/vip-hub-scroll-body'
import { useRainBalance } from '@/hooks/use-rain-balance'
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
import { VipTierProgressBar } from '@/components/vip/vip-tier-progress-bar'
import { DailySpinCard } from '@/components/promotions/daily-spin-card'
import { SidebarPromos } from '@/components/sidebar-promos'
import { DailyRacesTimer } from '@/components/daily-races-timer'

import { useState, useEffect, useRef, useCallback, useMemo, useId } from 'react'
import React from 'react'
import { createPortal } from 'react-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import { usePathname, useRouter } from 'next/navigation'
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon
} from "lucide-react"
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import Image from 'next/image'
import * as NFLIcons from 'react-nfl-logos'
import * as MLBIcons from 'react-mlb-logos'
import * as NHLIcons from 'react-nhl-logos'
import { 
  IconLayoutDashboard, 
  IconFileText, 
  IconCurrencyDollar, 
  IconGift, 
  IconCreditCard, 
  IconUserPlus, 
  IconShield,
  IconLock,
  IconSettings,
  IconCrown,
  IconLogout,
  IconDice,
  IconHeart,
  IconStar,
  IconFlame,
  IconDeviceGamepad2,
  IconCards,
  IconDots,
  IconTrophy,
  IconBuilding,
  IconHelpCircle,
  IconPlayerPlay,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
  IconLiveView,
  IconSearch,
  IconPlayerPlay as IconPlay,
  IconX,
  IconMenu2,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
  IconWallet,
  IconUser,
  IconUserCircle,
  IconLifebuoy,
  IconVideo,
  IconBroadcast,
  IconSparkles,
  IconGhost,
  IconHome,
  IconBolt,
  IconRocket,
  IconWorld,
  IconBallFootball,
  IconBallAmericanFootball,
  IconBallTennis,
  IconBallVolleyball,
  IconBallBaseball,
  IconSword,
  IconGolf,
  IconHorse,
  IconFlag2,
  IconList,
  IconLayoutGrid,
  IconStack,
  IconSearch as IconSearchNew,
  IconArrowRight,
  IconCheck,
  IconLoader2,
  IconFilter,
  IconBell,
  IconTicket,
  IconClock,
  IconCoins,
  IconDownload,
  IconExternalLink,
  IconMaximize,
  IconShare
, IconMessageCircle2, IconTrash, IconBrandTelegram, IconRefresh, IconParachute, IconTargetArrow, IconConfetti} from '@tabler/icons-react'
import { SportsTrackerWidget } from '@/components/sports-tracker-widget'
import { colorTokenMap } from '@/lib/agent/designSystem'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tabs as AnimateTabs,
  TabsPanel,
  TabsPanels,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { LinearMediaPlayer } from '@/components/linear-player/components/media-player'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import NumberFlow from "@number-flow/react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerHandle,
} from '@/components/ui/drawer'
import { InteractiveGridBackground } from '@/components/interactive-grid-background'
import { RainBackground } from '@/components/rain-background'
import { cn } from '@/lib/utils'
import { DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS, SIDEBAR_FOOTER_NEED_HELP, SIDEBAR_FOOTER_PROMOTIONS, SIDEBAR_FOOTER_VIP_HUB, SIDEBAR_FOOTER_WALLET } from '@/lib/sidebar-footer-nav'
import DynamicIsland from '@/components/dynamic-island'
import ChatNavToggle from '@/components/chat/chat-nav-toggle'
import { useChatStore } from '@/lib/store/chatStore'
import {
  IconButton,
  type IconButtonProps,
} from '@/components/animate-ui/components/buttons/icon'
import { Heart } from 'lucide-react'
import { QuickDepositDrawer } from '@/components/deposit/quick-deposit-drawer'
import {
  FamilyDrawerAnimatedContent,
  FamilyDrawerAnimatedWrapper,
  FamilyDrawerButton,
  FamilyDrawerClose,
  FamilyDrawerContent,
  FamilyDrawerRoot,
  FamilyDrawerSecondaryButton,
  FamilyDrawerViewContent,
  useFamilyDrawer,
  type ViewsRegistry,
} from '@/components/ui/family-drawer'
import { BetslipNumberPad } from '@/components/betslip/number-pad'
import { AccountDrawerIdentity } from '@/components/account/account-drawer-identity'
import { AccountDrawerHeaderActions } from '@/components/account/account-drawer-header-actions'

// Available square tile images
const squareTileImages = [
  '/games/square/goldNuggetRush.png',
  '/games/square/megacrush.png',
  '/games/square/goldNuggetRush2.png',
  '/games/square/mrMammoth.png',
  '/games/square/cocktailWheel.png',
  '/games/square/takeTheBank.png',
  '/games/square/hookedOnFishing.png',
  '/games/square/roulette.png',
  '/games/square/blackjack.png',
  '/games/square/baccarat.png',
  '/games/square/game8.png',
  '/games/square/game17.png',
  '/games/square/game18.png',
  '/games/square/game20.png',
  '/games/square/game21.png',
]

// Originals tile images (tall rectangles)
const originalsTileImages = [
  '/games/originals/plink.png',
  '/games/originals/blackjack.png',
  '/games/originals/dice.png',
  '/games/originals/diamonds.png',
  '/games/originals/mines.png',
  '/games/originals/keno.png',
  '/games/originals/limbo.png',
  '/games/originals/wheel.png',
  '/games/originals/hilo.png',
  '/games/originals/video_poker.png',
]

// Mock game data
const mostPlayedGames = [
  { id: 1, title: 'MEGACRUSH HOLD&WIN', provider: 'Betsoft', tag: 'Early', image: '/walk/image 1.png' },
  { id: 2, title: 'MR MAMMOTH', provider: 'Betsoft', tag: null, image: '/walk/image 2.png' },
  { id: 3, title: 'LIVE BETONLINE ROUETTE', provider: 'Dragon Gaming', tag: '$25 - $100', image: '/walk/image 3.png' },
  { id: 4, title: 'HOOKED ON FISHING', provider: 'Betsoft', tag: 'Hot', image: '/walk/image 4.png' },
  { id: 5, title: 'MEGACRUSH HOLD&WIN', provider: 'Betsoft', tag: 'Early', image: '/walk/image 1.png' },
  { id: 6, title: 'MR MAMMOTH', provider: 'Betsoft', tag: null, image: '/walk/image 2.png' },
  { id: 7, title: 'ORIGINAL DICE', provider: 'BetOnline', tag: null, image: '/walk/image 3.png' },
]

const popularGames = [
  { id: 8, title: 'Gold Nugget™ Rush', provider: 'Betsoft', tag: '+ New', image: '/walk/image 1.png' },
  { id: 9, title: 'Stake the BANK', provider: 'Betsoft', tag: 'Exclusive', image: '/walk/image 2.png' },
  { id: 10, title: 'VIP BLACKJACK', provider: 'Dragon Gaming', tag: '$350 - $500', image: '/walk/image 3.png' },
  { id: 11, title: 'MEGACRUSH HOLD&WIN', provider: 'Betsoft', tag: 'Early', image: '/walk/image 4.png' },
]

const originalsGames = [
  { id: 12, title: 'ORIGINAL PLINKO', provider: 'BetOnline', tag: null, image: '/walk/image 1.png' },
  { id: 13, title: 'ORIGINAL BLACKJACK', provider: 'BetOnline', tag: null, image: '/walk/image 2.png' },
  { id: 14, title: 'ORIGINAL DICE', provider: 'BetOnline', tag: null, image: '/walk/image 3.png' },
  { id: 15, title: 'ORIGINAL DIAMONDS', provider: 'BetOnline', tag: null, image: '/walk/image 4.png' },
  { id: 16, title: 'ORIGINAL MINES', provider: 'BetOnline', tag: null, image: '/walk/image 1.png' },
  { id: 17, title: 'ORIGINAL KENO', provider: 'BetOnline', tag: null, image: '/walk/image 2.png' },
  { id: 18, title: 'ORIGINAL LIMBO', provider: 'BetOnline', tag: '900x', image: '/walk/image 3.png' },
]

const liveCasinoGames = [
  { id: 19, title: 'VIP BLACKJACK', provider: 'Live Dealer', tag: '$350 - $500', image: '/walk/image 1.png' },
  { id: 20, title: 'LIVE BETONLINE ROUETTE', provider: 'Live Dealer', tag: '$25 - $100', image: '/walk/image 2.png' },
  { id: 21, title: 'SUBTITLE TITLE', provider: 'Live Dealer', tag: null, image: '/walk/image 3.png' },
  { id: 22, title: 'AUTO BACCARAT', provider: 'Live Dealer', tag: '$1 - $12.500', image: '/walk/image 4.png' },
  { id: 23, title: 'LIVE BETONLINE ROUETTE', provider: 'Live Dealer', tag: '$25 - $100', image: '/walk/image 1.png' },
]

function GameTile({ game }: { game: typeof mostPlayedGames[0] }) {
  return (
    <div className="relative group cursor-pointer flex-shrink-0">
      <div className="relative w-[160px] aspect-[4/5] rounded-small overflow-hidden bg-gray-200">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="160px"
        />
        {game.tag && (
          <div className={cn(
            "absolute top-2 left-2 px-2 py-0.5 rounded-small text-[10px] font-bold uppercase",
            game.tag === 'Hot' && "bg-red-500 text-white",
            game.tag === '+ New' && "bg-green-500 text-white",
            game.tag === 'Early' && "bg-blue-500 text-white",
            game.tag === 'Exclusive' && "bg-purple-500 text-white",
            game.tag?.startsWith('$') && "bg-yellow-500 text-black",
            !game.tag.match(/^(Hot|\+ New|Early|Exclusive|\$)/) && "bg-white/90 text-black"
          )}>
            {game.tag}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-2">
          <div className="text-white text-xs font-bold truncate leading-tight mb-0.5">{game.title}</div>
          <div className="text-white/70 text-[10px] truncate">{game.provider}</div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconInfoCircle className="w-4 h-4 text-white drop-shadow-lg" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}

// Payment Logo Component with fallback
function PaymentLogo({ method, className }: { method: string; className?: string }) {
  const [imageError, setImageError] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  // Normalize method name for file lookup
  const normalizedMethod = method.toLowerCase().replace(/\s+/g, '')
  // Try SVG first, then PNG as fallback
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
        <IconShield className="w-6 h-6 text-green-500" />
      )}
    </div>
  )
}

function GameSection({ title, games }: { title: string; games: typeof mostPlayedGames }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 h-8 px-3">
            All Games
            <IconChevronRight className="ml-1 w-4 h-4" />
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-gray-900">
              <IconChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-gray-900">
              <IconChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {games.map((game) => (
          <GameTile key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

// Lazy loaded game tile component with staggered animation
function LazyGameTile({ index, columnIndex, rowIndex, onTileClick, isMobile = false }: { index: number; columnIndex: number; rowIndex: number; onTileClick?: (game: { title: string; image: string; provider?: string; features?: string[] }) => void; isMobile?: boolean }) {
  const [isVisible, setIsVisible] = useState(false)
  const tileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // On mobile, set visible immediately to avoid observer issues
    if (isMobile) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '100px' }
    )

    if (tileRef.current) {
      observer.observe(tileRef.current)
    }

    return () => {
      if (tileRef.current) {
        observer.unobserve(tileRef.current)
      }
      observer.disconnect()
    }
  }, [isMobile])

  // Calculate delay based on tile index (one by one)
  // Each tile gets a small delay, creating a sequential loading effect
  const delay = (columnIndex + rowIndex * 6) * 0.03

  const imageSrc = squareTileImages[index % squareTileImages.length]
  const gameNames = ['Gold Nugget Rush', 'Mega Fortune', 'Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers']
  const gameTitle = gameNames[index % gameNames.length]
  const providers = ['Pragmatic Play', 'NetEnt', 'Microgaming', 'BetSoft', 'Evolution Gaming']
  const provider = providers[index % providers.length]
  const features = [
    ['Exploding Wilds Every 10 Spins!', 'Free Spins with Up to 10 Wilds on Every Spin!'],
    ['Mega Jackpot Feature', 'Progressive Bonus Rounds'],
    ['Avalanche Reels', 'Multiplier Wilds'],
    ['Ancient Egyptian Theme', 'Free Spins with Expanding Symbols'],
    ['Falling Symbols', 'Free Fall Feature'],
    ['Wild West Adventure', 'High Volatility Action'],
    ['Vampire Romance', '243 Ways to Win'],
    ['Norse Mythology', 'Thunder Feature'],
    ['Medieval Quest', 'Bonus Buy Option'],
    ['Vampire Slayer', 'Blood Bonus Feature']
  ]
  const gameFeatures = features[index % features.length]

  // Use regular div on mobile to avoid layout animation issues - no state, no animations
  if (isMobile) {
    return (
      <div className="w-full aspect-square">
        <div 
          className="w-full h-full rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group"
          onClick={() => {
            if (onTileClick) {
              onTileClick({
                title: gameTitle,
                image: imageSrc,
                provider,
                features: gameFeatures
              })
            }
          }}
        >
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`Game ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
              priority={index < 12} // Only prioritize first row
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={tileRef}
      className="w-full aspect-square"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{
        opacity: { duration: 0.3, delay: delay },
        scale: { duration: 0.3, delay: delay, ease: "easeOut" }
      }}
    >
      {isVisible ? (
        <div 
          className="w-full h-full rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group"
          onClick={() => {
            if (onTileClick) {
              onTileClick({
                title: gameTitle,
                image: imageSrc,
                provider,
                features: gameFeatures
              })
            }
          }}
        >
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`Game ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
            />
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
        </div>
      ) : (
        <div className="w-full h-full rounded-small bg-white/5 animate-pulse" />
      )}
    </motion.div>
  )
}

// Total Rewards Claimed Card Component
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

// Levels Carousel Component with Timeline
function LevelsCarousel() {
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


  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  
  // All level cards
  const allLevels = [
    {
      name: 'Bronze',
      tier: 'Bronze',
      color: 'amber',
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-600/20',
      textColor: 'text-amber-600',
      wager: '$0.00',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Monthly Cash Boost']
    },
    {
      name: 'Silver',
      tier: 'Silver',
      color: 'gray',
      iconColor: 'text-gray-400',
      bgColor: 'bg-gray-400/20',
      textColor: 'text-gray-400',
      wager: '$10K',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses']
    },
    {
      name: 'Gold',
      tier: 'Gold',
      color: 'yellow',
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      textColor: 'text-yellow-400',
      wager: '$50K',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses'],
      isActive: true
    },
    {
      name: 'Platinum I',
      tier: 'Platinum',
      color: 'cyan',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-400/20',
      textColor: 'text-cyan-400',
      wager: '$100K',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses']
    },
    {
      name: 'Platinum II',
      tier: 'Platinum',
      color: 'cyan',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-400/20',
      textColor: 'text-cyan-400',
      wager: '$250K',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses']
    },
    {
      name: 'Platinum III',
      tier: 'Platinum',
      color: 'cyan',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-400/20',
      textColor: 'text-cyan-400',
      wager: '$500K',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses']
    },
    {
      name: 'Diamond I',
      tier: 'Diamond',
      color: 'blue',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      textColor: 'text-blue-400',
      wager: '$750K',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events']
    },
    {
      name: 'Diamond II',
      tier: 'Diamond',
      color: 'blue',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      textColor: 'text-blue-400',
      wager: '$1M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events']
    },
    {
      name: 'Diamond III',
      tier: 'Diamond',
      color: 'blue',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      textColor: 'text-blue-400',
      wager: '$1.5M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events']
    },
    {
      name: 'Elite I',
      tier: 'Elite',
      color: 'purple',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      textColor: 'text-purple-400',
      wager: '$2M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager']
    },
    {
      name: 'Elite II',
      tier: 'Elite',
      color: 'purple',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      textColor: 'text-purple-400',
      wager: '$2.5M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager']
    },
    {
      name: 'Elite III',
      tier: 'Elite',
      color: 'purple',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      textColor: 'text-purple-400',
      wager: '$3M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager']
    },
    {
      name: 'Black I',
      tier: 'Black',
      color: 'slate',
      iconColor: 'text-slate-400',
      bgColor: 'bg-slate-400/20',
      textColor: 'text-slate-400',
      wager: '$3.5M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager', 'VIP Concierge']
    },
    {
      name: 'Black II',
      tier: 'Black',
      color: 'slate',
      iconColor: 'text-slate-400',
      bgColor: 'bg-slate-400/20',
      textColor: 'text-slate-400',
      wager: '$4M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager', 'VIP Concierge']
    },
    {
      name: 'Black III',
      tier: 'Black',
      color: 'slate',
      iconColor: 'text-slate-400',
      bgColor: 'bg-slate-400/20',
      textColor: 'text-slate-400',
      wager: '$5M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager', 'VIP Concierge']
    },
    {
      name: 'Obsidian I',
      tier: 'Obsidian',
      color: 'violet',
      iconColor: 'text-violet-400',
      bgColor: 'bg-violet-400/20',
      textColor: 'text-violet-400',
      wager: '$6M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager', 'VIP Concierge', 'Private Events']
    },
    {
      name: 'Obsidian II',
      tier: 'Obsidian',
      color: 'violet',
      iconColor: 'text-violet-400',
      bgColor: 'bg-violet-400/20',
      textColor: 'text-violet-400',
      wager: '$7.5M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager', 'VIP Concierge', 'Private Events']
    },
    {
      name: 'Obsidian III',
      tier: 'Obsidian',
      color: 'violet',
      iconColor: 'text-violet-400',
      bgColor: 'bg-violet-400/20',
      textColor: 'text-violet-400',
      wager: '$10M',
      benefits: ['Daily Cash Race', 'Birthday Rewards', 'Weekly Cash Boost', 'Monthly Cash Boost', 'Level Up Bonuses', 'Exclusive Events', 'Personal Account Manager', 'VIP Concierge', 'Private Events']
    }
  ]

  // Timeline tiers (one crown per tier)
  const tiers = [
    { name: 'Bronze', color: 'amber', iconColor: 'text-amber-600' },
    { name: 'Silver', color: 'gray', iconColor: 'text-gray-400' },
    { name: 'Gold', color: 'yellow', iconColor: 'text-yellow-400' },
    { name: 'Platinum', color: 'cyan', iconColor: 'text-cyan-400' },
    { name: 'Diamond', color: 'blue', iconColor: 'text-blue-400' },
    { name: 'Elite', color: 'purple', iconColor: 'text-purple-400' },
    { name: 'Black', color: 'slate', iconColor: 'text-slate-400' },
    { name: 'Obsidian', color: 'violet', iconColor: 'text-violet-400' }
  ]

  // Get the current tier based on the current card
  const getCurrentTier = () => {
    if (current < allLevels.length) {
      return allLevels[current].tier
    }
    return 'Bronze'
  }

  // Find first index of a tier
  const getTierFirstIndex = (tierName: string) => {
    return allLevels.findIndex(level => level.tier === tierName)
  }

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    })
  }, [api])

  return (
    <div className="mb-8 md:mb-12 w-full mt-8 md:mt-12 flex flex-col items-center">
      {/* Title and Subtitle */}
      <div className="text-center mb-5 md:mb-8 px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 tracking-tight">The Levels</h2>
        <p className="text-xs md:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
          At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative mb-5 md:mb-8 w-full px-3 md:px-4">
        <div className="h-px bg-white/20 absolute top-1/2 left-3 right-3 md:left-4 md:right-4 -translate-y-1/2"></div>
        <TooltipProvider>
          <div className="flex justify-between relative z-10 px-0">
            {tiers.map((tier, index) => {
              const tierFirstIndex = getTierFirstIndex(tier.name)
              const currentTier = getCurrentTier()
              const isActive = currentTier === tier.name
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div 
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => {
                        if (api && tierFirstIndex !== -1) {
                          api.scrollTo(tierFirstIndex)
                        }
                      }}
                    >
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#1a1a1a] border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                        isActive ? 'border-white scale-110' : 'border-white/30'
                      }`}>
                        <IconCrown className={`w-3.5 h-3.5 md:w-5 md:h-5 ${tier.iconColor}`} />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#2d2d2d] border-white/20 text-white">
                    <p>{tier.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Carousel — full width like other site carousels */}
      <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] -mx-4 md:-mx-6 overflow-visible">
        <Carousel setApi={setApi} className="w-full relative overflow-visible" opts={{ align: 'start', loop: false, dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
          <CarouselContent className="ml-4 md:ml-6 -mr-2 md:-mr-4">
            {allLevels.map((level, index) => (
              <CarouselItem key={index} className="pl-0 pr-3 md:pr-4 basis-auto flex-shrink-0">
                <Card className="bg-white/5 border-white/10 relative flex-shrink-0 overflow-hidden w-[180px] md:w-[240px] min-h-[260px] md:min-h-[320px]">
                  {level.isActive && (
                    <div className="absolute inset-0 opacity-100 pointer-events-none rounded-lg tile-shimmer" />
                  )}
                  <CardContent className="p-3 md:p-4 relative z-10">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                      <IconCrown className={`w-4 h-4 md:w-5 md:h-5 ${level.iconColor}`} />
                      <span className={`text-[10px] md:text-xs font-semibold ${level.bgColor} ${level.textColor} px-1.5 md:px-2 py-0.5 md:py-1 rounded`}>
                        {level.name}
                      </span>
                    </div>
                    <div className={`text-base md:text-lg font-semibold mb-0.5 md:mb-1 ${level.isActive ? 'text-white' : 'text-white/50'}`}>
                      {level.wager}
                    </div>
                    <div className={`text-xs md:text-sm mb-3 md:mb-4 ${level.isActive ? 'text-white/70' : 'text-white/50'}`}>
                      Wager Amount
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm ${level.isActive ? 'text-white' : 'text-white/50'}`}>
                          <div className={`h-3.5 w-3.5 md:h-4 md:w-4 rounded-full flex items-center justify-center flex-shrink-0 ${level.isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                            <IconCheck className="h-2.5 w-2.5 md:h-3 md:w-3" />
                          </div>
                          <span className="truncate">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Arrows — desktop only */}
          {!isMobile && (
            <>
              <Button
                onClick={() => {
                  if (api) {
                    const currentIndex = api.selectedScrollSnap()
                    const targetIndex = Math.max(0, currentIndex - 1)
                    api.scrollTo(targetIndex)
                  }
                }}
                className="!left-2 !top-1/2 !-translate-y-1/2 !-translate-x-0 !absolute text-white border-white/20 hover:bg-white/10 bg-[#1a1a1a]/80 z-30 !visible !opacity-100 !flex h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center p-0"
                variant="outline"
                size="icon"
                disabled={!api || !canScrollPrev}
              >
                <IconChevronLeft className="h-4 w-4 m-0" strokeWidth={1.5} />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                onClick={() => {
                  if (api) {
                    const currentIndex = api.selectedScrollSnap()
                    const slideCount = api.scrollSnapList().length
                    const targetIndex = Math.min(slideCount - 1, currentIndex + 1)
                    api.scrollTo(targetIndex)
                  }
                }}
                className="!right-2 !top-1/2 !-translate-y-1/2 !-translate-x-0 !absolute text-white border-white/20 hover:bg-white/10 bg-[#1a1a1a]/80 z-30 !visible !opacity-100 !flex h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center p-0"
                variant="outline"
                size="icon"
                disabled={!api || !canScrollNext}
              >
                <IconChevronRight className="h-4 w-4 m-0" strokeWidth={1.5} />
                <span className="sr-only">Next slide</span>
              </Button>
            </>
          )}
        </Carousel>
      </div>
    </div>
  )
}

// Scroll Video Player Component
function ScrollVideoPlayer() {
  const videoRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [scale, setScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false)
  const [viewportSize, setViewportSize] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return

      const rect = videoRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const videoTop = rect.top
      const videoHeight = rect.height
      const videoCenter = videoTop + videoHeight / 2
      const viewportCenter = windowHeight / 2

      // Calculate distance from viewport center
      const distanceFromCenter = Math.abs(videoCenter - viewportCenter)
      const maxDistance = windowHeight * 0.8 // Wider range for smoother transition
      
      // Calculate scroll progress (1 when centered, 0 when far away)
      // This creates a bell curve effect - grows as it approaches center, shrinks as it moves away
      const scrollProgress = Math.max(0, Math.min(1, 1 - (distanceFromCenter / maxDistance)))
      
      // Scale from 1 to 1.3 (smaller growth, not fullscreen)
      const newScale = 1 + (scrollProgress * 0.3)
      setScale(newScale)
      
      // Never go fullscreen
      setIsFullscreen(false)
      
      // Auto-play when near center using Vimeo API
      if (scrollProgress > 0.7 && iframeRef.current && !hasStartedPlaying) {
        try {
          // Use Vimeo Player API to play
          const iframe = iframeRef.current
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(JSON.stringify({ method: 'play' }), 'https://player.vimeo.com')
          }
        } catch (e) {
          // Vimeo API might not be ready, that's okay
        }
        setHasStartedPlaying(true)
      }
    }

    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
      handleScroll()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    handleResize() // Initial check
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [hasStartedPlaying])

  // Extract Vimeo video ID from URL
  const vimeoId = "1125227832"
  // Build Vimeo embed URL with autoplay parameter that will be controlled by scroll
  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=0&loop=0&muted=0&controls=1&responsive=1`

  // Calculate dimensions based on scale, maintaining 16:9 aspect ratio
  const baseWidth = 800
  const baseHeight = 450 // 16:9 aspect ratio
  const scaledWidth = baseWidth * scale
  const scaledHeight = baseHeight * scale
  
  // When fullscreen, use viewport dimensions but maintain aspect ratio
  const maxWidth = viewportSize.width
  const maxHeight = viewportSize.height
  
  // Calculate final dimensions maintaining aspect ratio
  // Never go fullscreen, just scale smoothly
  const finalWidth = scaledWidth
  const finalHeight = scaledHeight

  return (
    <div 
      ref={videoRef}
      className="relative w-full my-12 overflow-visible flex justify-center items-center"
      style={{
        height: 'auto',
        minHeight: '400px'
      }}
    >
      <div
        className="relative"
        style={{
          width: `${finalWidth}px`,
          height: `${finalHeight}px`,
          aspectRatio: '16/9',
          willChange: 'width, height',
          transition: 'width 0.1s ease-out, height 0.1s ease-out'
        }}
      >
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            src={vimeoEmbedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              pointerEvents: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Bonus data type
type BonusItem = {
  id: string;
  code: string;
  amount: string;
  rollover: string;
  date: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'COMPLETE';
  statusColor: string;
};

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<BonusItem> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.code} ${row.original.amount}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<BonusItem> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

// Cash Races Page Component
function CashRacesPage({ brandPrimary, setVipDrawerOpen, setShowVipRewards, setVipActiveTab, setVipActiveSidebarItem, previousPageState, setPreviousPageState, setActiveSubNav }: { brandPrimary: string; setVipDrawerOpen?: (open: boolean) => void; setShowVipRewards?: (show: boolean) => void; setVipActiveTab?: (tab: string) => void; setVipActiveSidebarItem?: (item: string) => void; previousPageState?: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null; setPreviousPageState?: (state: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null) => void; setActiveSubNav?: (nav: string) => void }) {
  const isMobile = useIsMobile()
  const [activeRaceTab, setActiveRaceTab] = useState<'Daily Cash Race' | 'Sprint'>('Daily Cash Race')
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  const leaderboardData = [
    { rank: 1, nickname: 'Hidden', betMade: '$100,005.00', prize: '25%', medal: 'gold' },
    { rank: 2, nickname: 'Player_5130165', betMade: '$12,000.00', prize: '18%', medal: 'silver' },
    { rank: 3, nickname: 'Hidden', betMade: '$8,000.00', prize: '16%', medal: 'bronze' },
    { rank: 4, nickname: 'Hidden', betMade: '$6,000.00', prize: '12%' },
    { rank: 5, nickname: 'Hidden', betMade: '$5,865.00', prize: '10%' },
    { rank: 6, nickname: 'Hidden', betMade: '$4,986.34', prize: '8%' },
    { rank: 7, nickname: 'Hidden', betMade: '$4,503.05', prize: '5%' },
    { rank: 8, nickname: 'Hidden', betMade: '$4,163.80', prize: '3%' },
    { rank: 9, nickname: 'Hidden', betMade: '$3,123.05', prize: '2%' },
    { rank: 10, nickname: 'Hidden', betMade: '$2,305.07', prize: '1%' },
  ]
  
  // User's position data
  const userPosition = {
    rank: 5708,
    nickname: 'You',
    betMade: '$1,250.00',
    prize: '0.1%'
  }
  
  return (
    <SidebarInset className="bg-[#1a1a1a] text-white">
      {/* Banner Carousel - Full Width with Arrows */}
      <div className="pt-6 md:pt-8 mb-6 md:mb-8">
        <Carousel className="w-full relative overflow-visible" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
          {!isMobile && (
            <>
              <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
              <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
            </>
          )}
          <CarouselContent className="ml-4 md:ml-6 -mr-2 md:-mr-4">
            {[
              { src: '/banners/casino/casino_banner1.svg', alt: 'Casino Banner 1' },
              { src: '/banners/casino/casino_banner2.svg', alt: 'Casino Banner 2' },
              { src: '/banners/casino/casino_banner 3.svg', alt: 'Casino Banner 3' },
              { src: '/banners/casino/casino_banner4.svg', alt: 'Casino Banner 4' },
              { src: '/banners/casino/casino_Banner5.svg', alt: 'Casino Banner 5' },
            ].map((banner, index) => (
              <CarouselItem key={index} className={`${index === 0 ? 'pl-0' : 'pl-2 md:pl-4'} basis-auto flex-shrink-0`}>
                <Card className="border-0 relative overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity rounded-small" style={{ width: '340px', height: '164px' }}>
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    width={340}
                    height={164}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="px-4 md:px-6 pb-8 max-w-7xl mx-auto w-full">
        {/* Cash Races Title with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          {previousPageState && (
            <button
              onClick={() => {
                if (setPreviousPageState && previousPageState) {
                  // Restore previous page state
                  if (previousPageState.showVipRewards === false && !previousPageState.showSports) {
                    // If we came from casino page, go back to casino
                    if (setShowVipRewards) {
                      setShowVipRewards(false)
                    }
                    // Restore activeSubNav if it was saved
                    if (previousPageState.activeSubNav && setActiveSubNav) {
                      setActiveSubNav(previousPageState.activeSubNav)
                    }
                  } else if (previousPageState.showSports) {
                    if (setShowVipRewards) {
                      setShowVipRewards(false)
                    }
                  } else {
                    if (setVipActiveSidebarItem) {
                      setVipActiveSidebarItem('Promos')
                    }
                  }
                  if (setPreviousPageState) {
                    setPreviousPageState(null)
                  }
                  // Scroll to top when going back
                  window.scrollTo(0, 0)
                }
              }}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/5 transition-colors duration-300 text-gray-800 dark:text-white/70 hover:text-black dark:hover:text-white"
              aria-label="Go back"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white">Cash Races</h1>
        </div>
        
        {/* Sub Nav Tabs */}
        <div className="mb-6">
          <AnimateTabs value={activeRaceTab} onValueChange={(value) => setActiveRaceTab(value as 'Daily Cash Race' | 'Sprint')} className="w-full">
            <AnimateTabsList className="bg-white/5 dark:bg-white/5 bg-gray-100/80 dark:bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300">
              {['Daily Cash Race', 'Sprint'].map((tab) => (
                <TabsTab
                  key={tab}
                  value={tab} 
                  className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5"
                >
                  {activeRaceTab === tab && (
                    <motion.div
                      layoutId="activeRaceTab"
                      className="absolute inset-0 rounded-2xl -z-10"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 40
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </TabsTab>
              ))}
            </AnimateTabsList>
          </AnimateTabs>
        </div>
        
        {/* Content based on active tab */}
        {activeRaceTab === 'Sprint' ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
              <p className="text-white/70 text-sm">Sprint races will be available soon!</p>
            </div>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6 mb-8 items-start",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
            {/* Left Column: Daily Race Info Card and Stats Card */}
            <div className="flex flex-col gap-6">
            {/* Info Card */}
            <Card className="bg-[#2d2d2d] dark:bg-[#2d2d2d] border-white/10 dark:border-white/10">
              <CardContent className="p-6">
                {/* Race Title and Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/banners/n_BOL_Promo_Card_720x454_83480_Daily_Cash_48afc09a78.jpg"
                      alt="Daily Cash Race"
                      width={52}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">$15,000 Race</h1>
                    <p className="text-white/70 text-sm">Daily Races Every 24 Hours</p>
                  </div>
                </div>
                
                {/* Description */}
                <div className="text-white/70 text-sm mb-4 space-y-3">
                  <p>
                    Feel the excitement at BetOnline, where $15,000 in cash is up for grabs every 24 hours!
                  </p>
                  <p>
                    Indulge in all your favorites across the Sportsbook, Casino, Casino in Poker, Racebook or Esports and with each bet, climb our Daily Race Leaderboard. Everyone qualifies, so kick off your journey and monitor your progress today. Once you start wagering, you're automatically enrolled in the race!
                  </p>
                  <p>
                    When time runs out, the top 250 racers will collect prizes instantly deposited into their accounts as cash.
                  </p>
                  <p>
                    Race ahead now and remember: the more you play the, the bigger the rewards!
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card: Time Remaining and Position */}
            <Card className="bg-[#2d2d2d] dark:bg-[#2d2d2d] border-white/10 dark:border-white/10">
              <CardContent className="p-4">
                {/* Time Remaining Section */}
                <div className="mb-4">
                  <div className="text-white/70 text-xs mb-2">Time Remaining:</div>
                  <div className="scale-75 origin-left">
                    <DailyRacesTimer
                      className="text-xl font-bold text-amber-200 tabular-nums"
                      colonClassName="text-amber-400/70"
                    />
                  </div>
                </div>
                
                {/* User's Current Status - Using Daily Race Card Components */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-small border border-amber-400/25 bg-amber-500/[0.08] p-2.5 transition-colors duration-300 dark:border-amber-400/30">
                      <div className="text-amber-100 font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                      <div className="text-[10px] text-amber-200/70 transition-colors duration-300">Position</div>
                    </div>
                    <div className="rounded-small border border-amber-400/25 bg-amber-500/[0.08] p-2.5 transition-colors duration-300 dark:border-amber-400/30">
                      <div className="text-amber-100 font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                      <div className="text-[10px] text-amber-200/70 transition-colors duration-300">Wagered</div>
                    </div>
                    <div className="rounded-small border border-amber-400/35 bg-amber-500/[0.12] p-2.5 dark:border-amber-400/40 transition-colors duration-300">
                      <div className="text-amber-50 font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                      <div className="text-[10px] text-amber-200/80 transition-colors duration-300">Current Prize</div>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column: Leaderboard */}
          <div>
            <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] border border-white/10 dark:border-white/10 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Nickname</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/70">Wagered</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/70">Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry) => (
                      <tr key={entry.rank} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {entry.medal === 'gold' && <IconTrophy className="w-5 h-5 text-yellow-400" />}
                            {entry.medal === 'silver' && <IconTrophy className="w-5 h-5 text-gray-400" />}
                            {entry.medal === 'bronze' && <IconTrophy className="w-5 h-5 text-orange-400" />}
                            {!entry.medal && <span className="text-white/70 text-sm">{entry.rank}th</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{entry.nickname}</td>
                        <td className="py-3 px-4 text-right text-white">{entry.betMade}</td>
                        <td className="py-3 px-4 text-right text-white font-semibold">{entry.prize}</td>
                      </tr>
                    ))}
                    {/* User's Position Row */}
                    <tr className="border-t-2 border-white/20 bg-white/5">
                      <td className="py-3 px-4">
                        <span className="text-white text-sm font-semibold">{userPosition.rank}th</span>
                      </td>
                      <td className="py-3 px-4 text-white font-semibold">{userPosition.nickname}</td>
                      <td className="py-3 px-4 text-right text-white font-semibold">{userPosition.betMade}</td>
                      <td className="py-3 px-4 text-right text-white font-semibold">{userPosition.prize}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        )}
        
        {/* Terms & Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Terms & Conditions</h3>
          <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] border border-white/10 dark:border-white/10 rounded-lg p-6">
            <ul className="text-white/70 text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>All players will automatically start their climb up the leaderboard after placing their first qualifying bet</li>
              <li>Each Daily Cash Race will start and end at 12:00 am ET every 24 hours, 7 days a week</li>
              <li>Only bets in the Sportsbook, Casino, Casino in Poker, Racebook or Esports will qualify</li>
              <li>Any bets placed in Poker or Craps will not qualify</li>
              <li>The $15,000 prize pool will be shared amongst the top 250 racers</li>
              <li>Winning players will receive their cash prize after 12:00 am ET daily</li>
              <li>If there is a tie then the prize will be shared between the tied players</li>
              <li>All prizes are issued as cash with no rollover or further restrictions</li>
            </ul>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

// Promos Page Component
function PromosPage({ brandPrimary, setVipDrawerOpen, setShowVipRewards, setVipActiveTab, setVipActiveSidebarItem }: { brandPrimary: string; setVipDrawerOpen?: (open: boolean) => void; setShowVipRewards?: (show: boolean) => void; setVipActiveTab?: (tab: string) => void; setVipActiveSidebarItem?: (item: string) => void }) {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('Deposit Bonus')

  const promoData = [
    { id: '1', title: '50 Free Spins', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp.' },
    { id: '2', title: 'Tittle', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp.' },
    { id: '3', title: 'Tittle', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp.' },
    { id: '4', title: 'Tittle', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp.' },
    { id: '5', title: '50 Free Spins', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp.' },
    { id: '6', title: 'Tittle', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp.' },
    { id: '7', title: 'Tittle', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp.' },
    { id: '8', title: 'Tittle', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp.' },
  ]

  return (
    <SidebarInset className="bg-[#1a1a1a] text-white">
      {/* Banner Carousel - Full Width with Arrows */}
      <div className="pt-6 md:pt-8 mb-6 md:mb-8">
        <Carousel className="w-full relative overflow-visible" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
          {!isMobile && (
            <>
              <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
              <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
            </>
          )}
          <CarouselContent className="ml-4 md:ml-6 -mr-2 md:-mr-4">
            {[
              { src: '/banners/casino/casino_banner1.svg', alt: 'Casino Banner 1' },
              { src: '/banners/casino/casino_banner2.svg', alt: 'Casino Banner 2' },
              { src: '/banners/casino/casino_banner 3.svg', alt: 'Casino Banner 3' },
              { src: '/banners/casino/casino_banner4.svg', alt: 'Casino Banner 4' },
              { src: '/banners/casino/casino_Banner5.svg', alt: 'Casino Banner 5' },
            ].map((banner, index) => (
              <CarouselItem key={index} className={`${index === 0 ? 'pl-0' : 'pl-2 md:pl-4'} basis-auto flex-shrink-0`}>
                <Card className="border-0 relative overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity rounded-small" style={{ width: '340px', height: '164px' }}>
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    width={340}
                    height={164}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="px-4 md:px-6 pb-8 max-w-7xl mx-auto w-full">

        {/* Promos Section */}
        <div className="w-full">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Promos</h1>

          {/* Tabs - Using AnimateTabs like Casino */}
          <div className="mb-4 md:mb-6">
            <AnimateTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <AnimateTabsList className="bg-white/5 dark:bg-white/5 bg-gray-100/80 dark:bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300">
                {['Deposit Bonus', 'Sports', 'Casino', 'Poker'].map((tab) => (
                  <TabsTab 
                    key={tab}
                    value={tab} 
                    className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5"
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activePromosTab"
                        className="absolute inset-0 rounded-2xl -z-10"
                        style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 40
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </TabsTab>
                ))}
              </AnimateTabsList>
            </AnimateTabs>
          </div>

          {/* Promo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoData.map((promo) => (
              <Card key={promo.id} className="bg-white/5 border-white/10 overflow-hidden">
                {/* Image Placeholder with Glare Animation */}
                <div className="w-full h-48 bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 tile-shimmer"></div>
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold text-white mb-2">{promo.title}</CardTitle>
                  <p className="text-sm text-white/70 mb-4 line-clamp-3">{promo.description}</p>
                  <Button
                    variant="ghost"
                    className="w-full rounded-md border border-white/20 bg-transparent text-white shadow-none hover:bg-white/[0.06] hover:text-white hover:border-white/30"
                  >
                    MORE INFO
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

// Casino Bonus data type
type CasinoBonusItem = {
  id: string;
  name: string;
  action: 'PLAY NOW' | 'PICK A GAME';
  code: string;
  bonusFunds: string;
  expiryDate: string;
  rollover: string;
  freeSpins: number;
  initialBonusAmount: string;
  lockedCashFund: string;
  awardedDate: string;
  availableOn: string;
};

// My Bonus Page Component
function MyBonusPage({ brandPrimary, setShowVipRewards }: { brandPrimary: string; setShowVipRewards?: (show: boolean) => void }) {
  const id = useId()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('Sports')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [expandedCasinoRow, setExpandedCasinoRow] = useState<string | null>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const inputRef = useRef<HTMLInputElement>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  // Bonus data
  const [data, setData] = useState<BonusItem[]>([
    { id: '1', code: '1000Happy', amount: '$4.00', rollover: '$0.00', date: '11/04/2014', status: 'ACTIVE', statusColor: 'bg-green-500' },
    { id: '2', code: 'No Promo Code', amount: '$5.00', rollover: '$0.00', date: '11/04/2014', status: 'EXPIRED', statusColor: 'bg-orange-500' },
    { id: '3', code: 'No Promo Code', amount: '$5.00', rollover: '$0.00', date: '11/04/2014', status: 'EXPIRED', statusColor: 'bg-orange-500' },
    { id: '4', code: 'Sports2025', amount: '$10.00', rollover: '$8.00', date: '11/04/2014', status: 'CANCELLED', statusColor: 'bg-gray-400' },
    { id: '5', code: '1000Happy', amount: '$4.00', rollover: '$0.00', date: '11/04/2014', status: 'COMPLETE', statusColor: 'bg-blue-500' },
    { id: '6', code: '1000Happy', amount: '$4.00', rollover: '$0.00', date: '11/04/2014', status: 'ACTIVE', statusColor: 'bg-green-500' },
    { id: '7', code: 'No Promo Code', amount: '$5.00', rollover: '$0.00', date: '11/04/2014', status: 'EXPIRED', statusColor: 'bg-orange-500' },
    { id: '8', code: 'Sports2025', amount: '$10.00', rollover: '$8.00', date: '11/04/2014', status: 'CANCELLED', statusColor: 'bg-gray-400' },
    { id: '9', code: '1000Happy', amount: '$4.00', rollover: '$0.00', date: '11/04/2014', status: 'COMPLETE', statusColor: 'bg-blue-500' },
    { id: '10', code: '1000Happy', amount: '$4.00', rollover: '$0.00', date: '11/04/2014', status: 'COMPLETE', statusColor: 'bg-blue-500' },
  ])

  // Casino Bonus data
  const [casinoBonusPage, setCasinoBonusPage] = useState(0)
  const casinoBonusRowsPerPage = 10
  const casinoBonuses: CasinoBonusItem[] = [
    { id: 'c1', name: 'Free Spins', action: 'PICK A GAME', code: '1888100', bonusFunds: '$100.00', expiryDate: 'May 25, 2024', rollover: '$0.00/$500.00', freeSpins: 5, initialBonusAmount: '$100.00', lockedCashFund: '$0.00', awardedDate: 'May 10, 2024', availableOn: 'Select a game to apply the free spins bonus.' },
    { id: 'c2', name: 'Mystery Game', action: 'PICK A GAME', code: '453339004567', bonusFunds: '$5.00', expiryDate: 'Aug 20, 2024', rollover: '$364.76/$500.00', freeSpins: 200, initialBonusAmount: '$5.00', lockedCashFund: '$0.00', awardedDate: 'Jun 01, 2024', availableOn: 'Select a game to apply the bonus.' },
    { id: 'c3', name: 'Free Spins', action: 'PICK A GAME', code: '1888100', bonusFunds: '$100.00', expiryDate: 'May 25, 2024', rollover: '$0.00/$500.00', freeSpins: 5, initialBonusAmount: '$100.00', lockedCashFund: '$0.00', awardedDate: 'May 10, 2024', availableOn: 'Select a game to apply the free spins bonus.' },
    { id: 'c4', name: 'Mystery Game', action: 'PICK A GAME', code: '453339004567', bonusFunds: '$5.00', expiryDate: 'Aug 20, 2024', rollover: '$364.76/$500.00', freeSpins: 200, initialBonusAmount: '$5.00', lockedCashFund: '$0.00', awardedDate: 'Jul 15, 2024', availableOn: 'Select a game to apply the bonus.' },
    { id: 'c5', name: 'Free Spins', action: 'PICK A GAME', code: '1888100', bonusFunds: '$100.00', expiryDate: 'May 25, 2024', rollover: '$0.00/$500.00', freeSpins: 5, initialBonusAmount: '$100.00', lockedCashFund: '$0.00', awardedDate: 'May 10, 2024', availableOn: 'Select a game to apply the free spins bonus.' },
    { id: 'c6', name: 'Blackjack Bonus', action: 'PLAY NOW', code: '1888100', bonusFunds: '$50.00', expiryDate: 'Jun 15, 2024', rollover: '$0.00/$250.00', freeSpins: 0, initialBonusAmount: '$50.00', lockedCashFund: '$0.00', awardedDate: 'May 20, 2024', availableOn: 'Blackjack' },
    { id: 'c7', name: 'Free Spins', action: 'PICK A GAME', code: '1888100', bonusFunds: '$100.00', expiryDate: 'May 25, 2024', rollover: '$0.00/$500.00', freeSpins: 5, initialBonusAmount: '$100.00', lockedCashFund: '$0.00', awardedDate: 'Sep 05, 2024', availableOn: 'Select a game to apply the free spins bonus.' },
    { id: 'c8', name: 'Mystery Game', action: 'PICK A GAME', code: '453339004567', bonusFunds: '$5.00', expiryDate: 'Aug 20, 2024', rollover: '$364.76/$500.00', freeSpins: 200, initialBonusAmount: '$5.00', lockedCashFund: '$0.00', awardedDate: 'Oct 01, 2024', availableOn: 'Select a game to apply the bonus.' },
    { id: 'c9', name: 'Slots Bonus', action: 'PLAY NOW', code: '453339004567', bonusFunds: '$25.00', expiryDate: 'Sep 30, 2024', rollover: '$0.00/$125.00', freeSpins: 50, initialBonusAmount: '$25.00', lockedCashFund: '$0.00', awardedDate: 'Oct 15, 2024', availableOn: 'Golden Dragon Slots' },
    { id: 'c10', name: 'Mystery Game', action: 'PICK A GAME', code: '453339004567', bonusFunds: '$5.00', expiryDate: 'Aug 20, 2024', rollover: '$364.76/$500.00', freeSpins: 200, initialBonusAmount: '$5.00', lockedCashFund: '$0.00', awardedDate: 'Nov 01, 2024', availableOn: 'Select a game to apply the bonus.' },
    { id: 'c11', name: 'Mystery Game', action: 'PICK A GAME', code: '453339004567', bonusFunds: '$5.00', expiryDate: 'Aug 20, 2024', rollover: '$364.76/$500.00', freeSpins: 200, initialBonusAmount: '$5.00', lockedCashFund: '$0.00', awardedDate: 'Nov 15, 2024', availableOn: 'Select a game to apply the bonus.' },
    { id: 'c12', name: 'Roulette Bonus', action: 'PLAY NOW', code: '453339004567', bonusFunds: '$30.00', expiryDate: 'Dec 01, 2024', rollover: '$0.00/$150.00', freeSpins: 0, initialBonusAmount: '$30.00', lockedCashFund: '$0.00', awardedDate: 'Dec 01, 2024', availableOn: 'European Roulette' },
    { id: 'c13', name: 'Mystery Game', action: 'PICK A GAME', code: '453339004567', bonusFunds: '$5.00', expiryDate: 'Aug 20, 2024', rollover: '$364.76/$500.00', freeSpins: 200, initialBonusAmount: '$5.00', lockedCashFund: '$0.00', awardedDate: 'Dec 15, 2024', availableOn: 'Select a game to apply the bonus.' },
  ]
  const casinoBonusTotalPages = Math.ceil(casinoBonuses.length / casinoBonusRowsPerPage)
  const casinoBonusPaginated = casinoBonuses.slice(casinoBonusPage * casinoBonusRowsPerPage, (casinoBonusPage + 1) * casinoBonusRowsPerPage)

  const columns: ColumnDef<BonusItem>[] = useMemo(() => [
    {
      header: "Code",
      accessorKey: "code",
      cell: ({ row }) => <div className="text-white/80 text-sm">{row.getValue("code")}</div>,
      size: 180,
      filterFn: multiColumnFilterFn,
      enableHiding: false
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => <div className="text-white/80 text-sm">{row.getValue("amount")}</div>,
      size: 120
    },
    {
      header: "Rollover",
      accessorKey: "rollover",
      cell: ({ row }) => <div className="text-white/80 text-sm">{row.getValue("rollover")}</div>,
      size: 120
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => <div className="text-white/80 text-sm">{row.getValue("date")}</div>,
      size: 120
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusColors: Record<string, { text: string; border: string; bg: string }> = {
          'ACTIVE': { text: 'text-green-400/70', border: 'border-green-400/30', bg: 'bg-green-500/5' },
          'EXPIRED': { text: 'text-orange-400/70', border: 'border-orange-400/30', bg: 'bg-orange-500/5' },
          'CANCELLED': { text: 'text-gray-400/70', border: 'border-gray-400/30', bg: 'bg-gray-400/5' },
          'COMPLETE': { text: 'text-blue-400/70', border: 'border-blue-400/30', bg: 'bg-blue-500/5' },
        }
        const colors = statusColors[status] || statusColors['ACTIVE']
        return (
          <span className={cn("px-2 py-0.5 rounded text-[11px] font-normal border", colors.text, colors.border, colors.bg)}>
            {status}
          </span>
        )
      },
      size: 120,
      filterFn: statusFilterFn
    },
    {
      id: "actions",
      header: () => <span className="sr-only">More</span>,
      cell: () => null,
      size: 60,
      enableHiding: false
    }
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility
    }
  })

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("status");
    if (!statusColumn) return [];
    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
    return values.sort();
  }, [table.getColumn("status")?.getFacetedUniqueValues()]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("status");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn("status")?.getFacetedUniqueValues()]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("status")?.getFilterValue()]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("status")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <SidebarInset className="bg-[#1a1a1a] text-white">
      <div className="px-4 md:px-6 pt-6 md:pt-8 pb-8 max-w-7xl mx-auto w-full">

        {/* My Bonus Section */}
        <div className="w-full">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">My Bonus</h1>

          {/* Tabs - Using AnimateTabs like Casino */}
          <div className="mb-4 md:mb-6">
            <AnimateTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <AnimateTabsList className="bg-white/5 dark:bg-white/5 bg-gray-100/80 dark:bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300">
                {['Sports', 'Casino'].map((tab) => (
                  <TabsTab 
                    key={tab}
                    value={tab} 
                    className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5"
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeBonusTab"
                        className="absolute inset-0 rounded-2xl -z-10"
                        style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 40
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </TabsTab>
                ))}
              </AnimateTabsList>
            </AnimateTabs>
          </div>

          {/* Sports Tab Content */}
          {activeTab === 'Sports' && (
            <>
              {/* Filters */}
              {isMobile ? (
            /* Mobile: ADD FILTER bar */
            <Popover>
              <div className="flex items-center gap-3 mb-4">
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase tracking-wide">
                    <IconFilter className="w-4 h-4 text-white/50" />
                    Add Filter
                  </button>
                </PopoverTrigger>
                <div className="h-5 w-px bg-white/10" />
                <span className="text-sm text-white/40">
                  {selectedStatuses.length > 0 ? `${selectedStatuses.length} filter${selectedStatuses.length > 1 ? 's' : ''} applied` : 'No filters applied'}
                </span>
              </div>
              <PopoverContent className="w-auto min-w-36 p-3 bg-[#2d2d2d] border-white/10" align="start">
                <div className="space-y-3">
                  <div className="text-white/70 text-xs font-medium">Filter by Status</div>
                  <div className="space-y-3">
                    {uniqueStatusValues.map((value, i) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-m-${i}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
                          className="border-white/20"
                        />
                        <Label
                          htmlFor={`${id}-m-${i}`}
                          className="flex grow justify-between gap-2 font-normal text-white">
                          {value}{" "}
                          <span className="text-white/50 ms-2 text-xs">
                            {statusCounts.get(value)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            /* Desktop: Full filter bar */
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Filter by code or amount */}
              <div className="relative">
                <Input
                  id={`${id}-input`}
                  ref={inputRef}
                  className={cn(
                    "peer min-w-60 ps-9 bg-white/5 border-white/10 text-white placeholder:text-white/50 text-sm",
                    Boolean(table.getColumn("code")?.getFilterValue()) && "pe-9"
                  )}
                  value={(table.getColumn("code")?.getFilterValue() ?? "") as string}
                  onChange={(e) => table.getColumn("code")?.setFilterValue(e.target.value)}
                  placeholder="Filter by code or amount..."
                  type="text"
                  aria-label="Filter by code or amount"
                />
                <div className="text-white/50 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <ListFilterIcon size={16} aria-hidden="true" />
                </div>
                {Boolean(table.getColumn("code")?.getFilterValue()) && (
                  <button
                    className="text-white/50 hover:text-white focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Clear filter"
                    onClick={() => {
                      table.getColumn("code")?.setFilterValue("");
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}>
                    <CircleXIcon size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              {/* Filter by status */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-9 px-3 text-xs">
                    <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                    Status
                    {selectedStatuses.length > 0 && (
                      <span className="bg-white/10 text-white/70 -me-1 inline-flex h-5 max-h-full items-center rounded border border-white/20 px-1 font-[inherit] text-[0.625rem] font-medium">
                        {selectedStatuses.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto min-w-36 p-3 bg-[#2d2d2d] border-white/10" align="start">
                  <div className="space-y-3">
                    <div className="text-white/70 text-xs font-medium">Filters</div>
                    <div className="space-y-3">
                      {uniqueStatusValues.map((value, i) => (
                        <div key={value} className="flex items-center gap-2">
                          <Checkbox
                            id={`${id}-${i}`}
                            checked={selectedStatuses.includes(value)}
                            onCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
                            className="border-white/20"
                          />
                          <Label
                            htmlFor={`${id}-${i}`}
                            className="flex grow justify-between gap-2 font-normal text-white">
                            {value}{" "}
                            <span className="text-white/50 ms-2 text-xs">
                              {statusCounts.get(value)}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {/* Toggle columns visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-9 px-3 text-xs">
                    <Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#2d2d2d] border-white/10">
                  <DropdownMenuLabel className="text-white">Toggle columns</DropdownMenuLabel>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize text-white"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                          onSelect={(event) => event.preventDefault()}>
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile: Card-based list */}
          {isMobile ? (
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-4">
              {/* Header row */}
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <span className="flex-1 text-sm font-medium text-white/60">Code</span>
                <span className="w-[100px] text-sm font-medium text-white/60">Date</span>
                <span className="w-[100px] text-sm font-medium text-white/60 text-center">Status</span>
                <span className="w-8" />
              </div>
              {/* Data rows */}
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const item = row.original
                  const statusColors: Record<string, { text: string; border: string }> = {
                    'ACTIVE': { text: 'text-green-500', border: 'border-green-500/50' },
                    'EXPIRED': { text: 'text-orange-400', border: 'border-orange-400/50' },
                    'CANCELLED': { text: 'text-white/50', border: 'border-white/20' },
                    'COMPLETE': { text: 'text-blue-400', border: 'border-blue-400/50' },
                  }
                  const colors = statusColors[item.status] || statusColors['ACTIVE']
                  return (
                    <React.Fragment key={row.id}>
                      <button
                        onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                        className="flex items-center w-full px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="flex-1 text-sm font-semibold text-white truncate pr-2">{item.code}</span>
                        <span className="w-[100px] text-sm text-white/70 shrink-0">{item.date}</span>
                        <span className="w-[100px] flex justify-center shrink-0">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", colors.text, colors.border)}>
                            {item.status}
                          </span>
                        </span>
                        <span className="w-8 flex justify-center shrink-0">
                          <IconChevronDown 
                            className={cn(
                              "w-4 h-4 text-white/40 transition-transform",
                              expandedRow === row.id && "rotate-180"
                            )} 
                          />
                        </span>
                      </button>
                      {expandedRow === row.id && (
                        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-white/40 text-xs">Amount</span>
                              <p className="text-white font-medium">{item.amount}</p>
                            </div>
                            <div>
                              <span className="text-white/40 text-xs">Rollover</span>
                              <p className="text-white font-medium">{item.rollover}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <div className="px-4 py-8 text-center text-white/40 text-sm">No results.</div>
              )}
            </div>
          ) : (
            /* Desktop: Full table */
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <Table className="table-fixed min-w-[540px]">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="hover:bg-transparent border-white/10">
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              key={header.id}
                              style={{ width: `${header.getSize()}px` }}
                              className="h-11 text-white/60 text-xs font-normal">
                              {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                <div
                                  className={cn(
                                    header.column.getCanSort() &&
                                      "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                                  )}
                                  onClick={header.column.getToggleSortingHandler()}
                                  onKeyDown={(e) => {
                                    if (
                                      header.column.getCanSort() &&
                                      (e.key === "Enter" || e.key === " ")
                                    ) {
                                      e.preventDefault();
                                      header.column.getToggleSortingHandler()?.(e);
                                    }
                                  }}
                                  tabIndex={header.column.getCanSort() ? 0 : undefined}>
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                  {{
                                    asc: (
                                      <ChevronUpIcon
                                        className="shrink-0 opacity-60 text-white"
                                        size={16}
                                        aria-hidden="true"
                                      />
                                    ),
                                    desc: (
                                      <ChevronDownIcon
                                        className="shrink-0 opacity-60 text-white"
                                        size={16}
                                        aria-hidden="true"
                                      />
                                    )
                                  }[header.column.getIsSorted() as string] ?? null}
                                </div>
                              ) : (
                                flexRender(header.column.columnDef.header, header.getContext())
                              )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <React.Fragment key={row.id}>
                          <TableRow className="border-white/10 hover:bg-white/5">
                            {row.getVisibleCells().map((cell) => {
                              // Skip rendering the actions cell in the main row
                              if (cell.column.id === "actions") {
                                return null
                              }
                              return (
                                <TableCell key={cell.id}>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              )
                            })}
                            <TableCell className="w-[60px]">
                              <button
                                onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                                className="flex items-center justify-center w-full h-full"
                              >
                                <IconChevronDown 
                                  className={cn(
                                    "w-4 h-4 text-white/70 transition-transform",
                                    expandedRow === row.id && "rotate-180"
                                  )} 
                                />
                              </button>
                            </TableCell>
                          </TableRow>
                          {expandedRow === row.id && (
                            <TableRow className="border-white/10">
                              <TableCell colSpan={columns.length} className="py-4 bg-white/5">
                                <div className="space-y-2 pl-4">
                                  <div className="text-sm text-white/70">
                                    <strong className="text-white">Bonus Details:</strong> Additional information about this bonus will appear here.
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center text-white/70">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
            </>
          )}

                    {/* Casino Tab Content */}
          {activeTab === 'Casino' && (
            <>
              {/* Mobile: Single container table-style (matches Sports tab) */}
              <div className="md:hidden bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-4">
                {/* Header row */}
                <div className="flex items-center px-4 py-3 border-b border-white/10">
                  <span className="flex-1 text-sm font-medium text-white/60">Name</span>
                  <span className="w-[120px] text-sm font-medium text-white/60 text-right pr-6">Action</span>
                  <span className="w-8" />
                </div>
                {/* Data rows */}
                {casinoBonusPaginated.length > 0 ? (
                  casinoBonusPaginated.map((bonus) => (
                    <React.Fragment key={bonus.id}>
                      <button
                        onClick={() => setExpandedCasinoRow(expandedCasinoRow === bonus.id ? null : bonus.id)}
                        className="flex items-center w-full px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="flex-1 text-sm font-semibold text-white truncate pr-2">{bonus.name}</span>
                        <span className="w-[120px] flex justify-end pr-2 shrink-0">
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              if (bonus.action === 'PICK A GAME' && setShowVipRewards) {
                                setShowVipRewards(false)
                              }
                            }}
                            className="px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wide transition-colors bg-[#ee3536] hover:bg-[#d42e2f] text-white whitespace-nowrap cursor-pointer"
                          >
                            {bonus.action}
                          </span>
                        </span>
                        <span className="w-8 flex justify-center shrink-0">
                          <IconChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", expandedCasinoRow === bonus.id && "rotate-180")} />
                        </span>
                      </button>
                      {expandedCasinoRow === bonus.id && (
                        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                          <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                            <div>
                              <span className="text-white/40 text-xs">Code</span>
                              <p className="text-white font-medium">{bonus.code}</p>
                            </div>
                            <div>
                              <span className="text-white/40 text-xs">Bonus Fund</span>
                              <p className="text-white font-medium">{bonus.bonusFunds}</p>
                            </div>
                            <div>
                              <span className="text-white/40 text-xs">Free Spins</span>
                              <p className="text-white font-medium">{bonus.freeSpins}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-white/40 text-xs">Expiry Date</span>
                              <p className="text-white font-medium">{bonus.expiryDate}</p>
                            </div>
                            <div>
                              <span className="text-white/40 text-xs">Rollover</span>
                              <p className="text-white font-medium">{bonus.rollover}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-white/40 text-sm">No results.</div>
                )}
              </div>

              {/* Desktop: Full data table in same wrapper style as Sports tab */}
              <div className="hidden md:block bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-4">
                <div className="overflow-x-auto">
                  <Table className="table-fixed min-w-[800px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-white/10">
                        <TableHead className="text-white/60 text-xs font-normal h-11 w-[140px]">Name</TableHead>
                        <TableHead className="text-white/60 text-xs font-normal h-11 w-[140px]">Code</TableHead>
                        <TableHead className="text-white/60 text-xs font-normal h-11 w-[100px]">Bonus Fund</TableHead>
                        <TableHead className="text-white/60 text-xs font-normal h-11 w-[110px]">Expiry Date</TableHead>
                        <TableHead className="text-white/60 text-xs font-normal h-11 w-[120px]">Rollover</TableHead>
                        <TableHead className="text-white/60 text-xs font-normal h-11 w-[80px]">Free Spins</TableHead>
                        <TableHead className="text-white/60 text-xs font-normal h-11 w-[130px]">Action</TableHead>
                        <TableHead className="text-white/60 text-xs font-normal h-11 w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {casinoBonusPaginated.map((bonus) => (
                        <React.Fragment key={bonus.id}>
                          <TableRow className="border-white/10 hover:bg-white/5">
                            <TableCell className="text-sm text-white">{bonus.name}</TableCell>
                            <TableCell className="text-sm text-white">{bonus.code}</TableCell>
                            <TableCell className="text-sm text-white">{bonus.bonusFunds}</TableCell>
                            <TableCell className="text-sm text-white">{bonus.expiryDate}</TableCell>
                            <TableCell className="text-sm text-white">{bonus.rollover}</TableCell>
                            <TableCell className="text-sm text-white">{bonus.freeSpins}</TableCell>
                            <TableCell>
                              <button
                                onClick={() => {
                                  if (bonus.action === 'PICK A GAME' && setShowVipRewards) {
                                    setShowVipRewards(false)
                                  }
                                }}
                                className="px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wide transition-colors bg-[#ee3536] hover:bg-[#d42e2f] text-white whitespace-nowrap"
                              >
                                {bonus.action}
                              </button>
                            </TableCell>
                            <TableCell className="w-[60px]">
                              <button
                                onClick={() => setExpandedCasinoRow(expandedCasinoRow === bonus.id ? null : bonus.id)}
                                className="flex items-center justify-center w-full h-full"
                              >
                                <IconChevronDown className={cn("w-4 h-4 text-white/70 transition-transform", expandedCasinoRow === bonus.id && "rotate-180")} />
                              </button>
                            </TableCell>
                          </TableRow>
                          {expandedCasinoRow === bonus.id && (
                            <TableRow className="border-white/10">
                              <TableCell colSpan={8} className="py-4 bg-white/5">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pl-4">
                                  <div><span className="text-white/40 block text-xs mb-0.5">Initial Bonus Amount</span><span className="text-white">{bonus.initialBonusAmount}</span></div>
                                  <div><span className="text-white/40 block text-xs mb-0.5">Locked Cash Fund</span><span className="text-white">{bonus.lockedCashFund}</span></div>
                                  <div><span className="text-white/40 block text-xs mb-0.5">Awarded Date</span><span className="text-white">{bonus.awardedDate}</span></div>
                                  <div><span className="text-white/40 block text-xs mb-0.5">Available On</span><span className="text-white">{bonus.availableOn}</span></div>
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

              {/* Pagination */}
              {casinoBonuses.length > casinoBonusRowsPerPage && (
                <div className="flex items-center justify-end gap-4 mt-4 text-sm text-white/60">
                  <span>Page: {casinoBonusRowsPerPage}</span>
                  <span>{casinoBonusPage * casinoBonusRowsPerPage + 1}-{Math.min((casinoBonusPage + 1) * casinoBonusRowsPerPage, casinoBonuses.length)} of {casinoBonuses.length}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCasinoBonusPage(Math.max(0, casinoBonusPage - 1))}
                      disabled={casinoBonusPage === 0}
                      className={cn("p-1 rounded hover:bg-white/10 transition-colors", casinoBonusPage === 0 && "opacity-30 cursor-not-allowed")}
                    >
                      <IconChevronLeft className="w-4 h-4 text-white/60" />
                    </button>
                    <button
                      onClick={() => setCasinoBonusPage(Math.min(casinoBonusTotalPages - 1, casinoBonusPage + 1))}
                      disabled={casinoBonusPage >= casinoBonusTotalPages - 1}
                      className={cn("p-1 rounded hover:bg-white/10 transition-colors", casinoBonusPage >= casinoBonusTotalPages - 1 && "opacity-30 cursor-not-allowed")}
                    >
                      <IconChevronRight className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}

// VIP Rewards Page Component
function VIPRewardsPage({ brandPrimary, setVipDrawerOpen, setVipActiveTab, setShowToast, setToastMessage, setToastAction, setShowVipRewards, setIsPageTransitioning, initialVipSidebarItem, setInitialVipSidebarItem, previousPageState, setPreviousPageState, setActiveSubNav, quickLinksOpen, vipActiveSidebarItem, setVipActiveSidebarItem }: { brandPrimary: string; setVipDrawerOpen: (open: boolean) => void; setVipActiveTab: (tab: string) => void; setShowToast: (show: boolean) => void; setToastMessage: (message: string) => void; setToastAction: (action: { label: string; onClick: () => void } | null) => void; setShowVipRewards: (show: boolean) => void; setIsPageTransitioning: (transitioning: boolean) => void; initialVipSidebarItem?: string | null; setInitialVipSidebarItem?: (item: string | null) => void; previousPageState?: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null; setPreviousPageState?: (state: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null) => void; setActiveSubNav?: (nav: string) => void; quickLinksOpen?: boolean; vipActiveSidebarItem?: string; setVipActiveSidebarItem?: (item: string) => void }) {
  // vipActiveSidebarItem and setVipActiveSidebarItem come from props

  
  const isMobileVip = useIsMobile()
  
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Mobile VIP Navigation — fixed below header like casino sub nav */}
      {isMobileVip && (
        <motion.div 
          className="md:hidden fixed left-0 right-0 z-[90] bg-[#1a1a1a]/60 backdrop-blur-xl border-b border-white/10"
          initial={false}
          animate={{ top: quickLinksOpen ? 104 : 64 }}
          transition={{ type: "tween", ease: "linear", duration: 0.3 }}
          style={{ top: quickLinksOpen ? 104 : 64 }}
        >
          <div className="overflow-x-auto scrollbar-hide px-3 py-2" style={{ WebkitOverflowScrolling: 'touch' }}>
            <AnimateTabs value={vipActiveSidebarItem} onValueChange={(value) => setVipActiveSidebarItem?.(value)} className="w-max">
              <AnimateTabsList className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300">
                {[
                  { id: 'Overview', label: 'Dashboard' },
                  { id: 'My Bonus', label: 'My Bonus' },
                  { id: 'Promos', label: 'Promos' },
                  { id: 'Cash Races', label: 'Cash Races' },
                  { id: 'Contests', label: 'Contests' },
                  { id: 'Refer A Friend', label: 'Refer' },
                ].map((item) => (
                  <TabsTab
                    key={item.id}
                    value={item.id}
                    className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none whitespace-nowrap"
                  >
                    {vipActiveSidebarItem === item.id && (
                      <motion.div
                        layoutId="activeVipMobileTab"
                        className="absolute inset-0 rounded-2xl -z-10"
                        style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 40
                        }}
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
      {/* Spacer for fixed mobile VIP sub nav */}
      {isMobileVip && <div className="md:hidden h-[44px]" />}
      
      {vipActiveSidebarItem === 'My Bonus' ? (
        <MyBonusPage brandPrimary={brandPrimary} setShowVipRewards={setShowVipRewards} />
      ) : vipActiveSidebarItem === 'Promos' ? (
        <PromosPage 
          brandPrimary={brandPrimary} 
          setVipDrawerOpen={setVipDrawerOpen}
          setShowVipRewards={setShowVipRewards}
          setVipActiveTab={setVipActiveTab}
          setVipActiveSidebarItem={setVipActiveSidebarItem}
        />
      ) : vipActiveSidebarItem === 'Cash Races' ? (
        <CashRacesPage 
          brandPrimary={brandPrimary}
          setVipDrawerOpen={setVipDrawerOpen}
          setShowVipRewards={setShowVipRewards}
          setVipActiveTab={setVipActiveTab}
          setVipActiveSidebarItem={setVipActiveSidebarItem}
          previousPageState={previousPageState}
          setPreviousPageState={setPreviousPageState}
          setActiveSubNav={setActiveSubNav}
        />
      ) : (
        <SidebarInset className="bg-[#1a1a1a] text-white">
        {/* Hero Image */}
        <div className="w-full relative">
          <img 
            src="/banners/sports_league/Hero.png" 
            alt="VIP Rewards Hero" 
            className="w-full h-auto object-cover max-h-[200px] md:max-h-none"
            style={{ display: 'block' }}
          />
        </div>
        
        <div className="px-4 md:px-6 pt-6 md:pt-8 pb-8 max-w-7xl mx-auto flex flex-col items-center w-full">
          {/* Cards from Casino Banner - Centered */}
          <div className="mb-8 w-full flex justify-center mt-4 md:mt-8">
            <div className="flex flex-col gap-3 w-full max-w-[720px]">
              <h1 className="text-xl md:text-2xl font-bold text-white">Hi, CH</h1>
              <div className="flex flex-col md:flex-row gap-3">
              {/* VIP Rewards Card - Wider */}
              <Card className="flex-shrink-0 w-full border border-gray-200 bg-gray-100 bg-white/5 transition-colors duration-300 dark:border-white/10 dark:bg-white/5 md:w-[300px]" style={{ minHeight: '140px' }}>
                <CardContent className="p-4">
                  <CardTitle className="text-sm font-semibold text-white dark:text-white mb-4 transition-colors duration-300">Gold To Platinum I</CardTitle>
                  <VipTierProgressBar value={45} nextTierLabel="Platinum I" wagerRemaining="$2,750" />
                </CardContent>
              </Card>
              
              {/* Daily Races Card - Wider */}
              <Card className="flex-shrink-0 w-full border border-amber-400/30 bg-gradient-to-br from-amber-500/[0.12] to-transparent bg-white/5 transition-colors duration-300 dark:border-amber-400/35 dark:from-amber-400/[0.08] dark:bg-white/5 md:w-[300px]" style={{ minHeight: '140px' }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(245, 158, 11, 0.12)' }}
                      >
                        <IconTrophy
                          strokeWidth={1.8}
                          className="w-4 h-4 text-amber-400"
                        />
                      </div>
                      <CardTitle className="mb-0 text-sm font-semibold text-amber-100 transition-colors duration-300 dark:text-amber-100 leading-tight">
                        $25K Daily Race
                      </CardTitle>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <DailyRacesTimer
                        className="text-xl font-bold text-amber-600 tabular-nums dark:text-amber-200"
                        colonClassName="text-amber-500/70 dark:text-amber-300/80"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-small border border-amber-400/25 bg-amber-500/[0.08] p-2.5 transition-colors duration-300 dark:border-amber-400/30">
                      <div className="text-amber-100 font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                      <div className="text-[10px] text-amber-200/70 transition-colors duration-300">Position</div>
                    </div>
                    <div className="rounded-small border border-amber-400/25 bg-amber-500/[0.08] p-2.5 transition-colors duration-300 dark:border-amber-400/30">
                      <div className="text-amber-100 font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                      <div className="text-[10px] text-amber-200/70 transition-colors duration-300">Wagered</div>
                    </div>
                    <div className="rounded-small border border-amber-400/35 bg-amber-500/[0.12] p-2.5 transition-colors duration-300 dark:border-amber-400/40">
                      <div className="text-amber-50 font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                      <div className="text-[10px] text-amber-200/80 transition-colors duration-300">Current Prize</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <TotalRewardsCard />
                <div className="flex-1 min-w-0">
                </div>
              </div>
            </div>
          </div>
          {/* The Levels Section */}
          <LevelsCarousel />

          {/* The Rewards Section */}
          <div className="w-full mb-12">
            {/* Header with Image */}
            <div className="flex flex-col items-center mb-4">
              {/* Rewards Image */}
              <div className="mb-4 inline-block">
                <img 
                  src="/banners/sports_league/rewrds image.png" 
                  alt="Rewards" 
                  className="h-auto"
                  style={{ width: '240px', height: 'auto', display: 'block' }}
                />
              </div>
              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-white">The Rewards</h2>
            </div>
            <p className="text-white/70 mb-12 max-w-3xl mx-auto text-center">
              At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
            </p>
            
            {/* Reward Cards - Single Card with Separators */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  {/* Reloads */}
                  <div className="pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">Reloads</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="bg-white/10 text-white hover:bg-white/20"
                        onClick={() => {
                          setVipDrawerOpen(true)
                          setVipActiveTab('Reloads')
                        }}
                      >
                        Open
                      </Button>
                      <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                        Learn More
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-white/10 my-6" />

                  {/* Cash Drop Codes */}
                  <div className="pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">Cash Drop Codes</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="bg-white/10 text-white hover:bg-white/20"
                        onClick={() => {
                          setVipDrawerOpen(true)
                          setVipActiveTab('Cash Drop')
                        }}
                      >
                        Open
                      </Button>
                      <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                        Learn More
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-white/10 my-6" />

                  {/* Bet & Get */}
                  <div className="pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">Bet & Get</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="bg-white/10 text-white hover:bg-white/20"
                        onClick={() => {
                          setVipDrawerOpen(true)
                          setVipActiveTab('Bet & Get')
                        }}
                      >
                        Open
                      </Button>
                      <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                        Learn More
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-white/10 my-6" />

                  {/* Cash Boosts */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">Cash Boosts</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="bg-white/10 text-white hover:bg-white/20"
                        onClick={() => {
                          setVipDrawerOpen(true)
                          setVipActiveTab('VIP')
                        }}
                      >
                        Open
                      </Button>
                      <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>

      )}
      {/* VIP Footer - inside sidebar layout so it respects the sidebar width */}
      <SidebarInset className="bg-[#1a1a1a] text-white !min-h-0">
        <SiteFooter />
      </SidebarInset>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════
// My Bets / Bet History Component
// ═══════════════════════════════════════════════════════════

// Sample bet data for the bet history UI — enhanced with live/pending/cashout detail
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

function MyBetsContent({ onBack, brandPrimary, initialFilter }: { onBack: () => void; brandPrimary: string; initialFilter?: 'all' | 'cash_out' | 'in_play' | 'pending' | 'graded' }) {
  const isMobile = useIsMobile()
  const [activeFilter, setActiveFilter] = useState<'all' | 'cash_out' | 'in_play' | 'pending' | 'graded'>(initialFilter || 'all')
  const [expandedBetId, setExpandedBetId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // React to initialFilter changes (e.g., deep-linking from Pending Bets)
  React.useEffect(() => {
    if (initialFilter) {
      setActiveFilter(initialFilter)
      setCurrentPage(1)
      setExpandedBetId(null)
    }
  }, [initialFilter])


  const filterTabs = [
    { key: 'all' as const, label: 'All', count: sampleBets.length },
    { key: 'cash_out' as const, label: 'Cash Out', count: sampleBets.filter(b => b.cashOutValue || b.status === 'cashed_out').length },
    { key: 'in_play' as const, label: 'In-Play', count: sampleBets.filter(b => b.isLive && !b.status).length },
    { key: 'pending' as const, label: 'Pending', count: sampleBets.filter(b => !b.status && !b.isLive).length },
    { key: 'graded' as const, label: 'Graded', count: null },
  ]

  // Filter bets based on active filter
  const filteredBets = sampleBets.filter(bet => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'cash_out') return bet.cashOutValue || bet.status === 'cashed_out'
    if (activeFilter === 'in_play') return bet.isLive && !bet.status
    if (activeFilter === 'pending') return !bet.status && !bet.isLive
    if (activeFilter === 'graded') return bet.status === 'won' || bet.status === 'lost' || bet.status === 'void' || bet.status === 'cashed_out'
    return true
  })

  const totalPages = Math.ceil(filteredBets.length / rowsPerPage)
  const paginatedBets = filteredBets.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

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

  // Compute potential returns from odds
  const getPotentialReturns = (amount: number, odds: string) => {
    const oddsNum = parseInt(odds)
    if (oddsNum > 0) return amount + (amount * oddsNum / 100)
    return amount + (amount * 100 / Math.abs(oddsNum))
  }

  // Share bet to chat helper
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

  // Render expanded bet detail (betslip-style card)
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
          {/* Bet selection detail — betslip format */}
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

          {/* Live Scoreboard */}
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

          {/* Final Score — for graded bets (won/lost/cashed_out) */}
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

          {/* Cash Out Button */}
          {!bet.status && bet.cashOutValue && (
            <div className="px-4 mb-2">
              <button className="w-full sm:w-auto py-2.5 sm:py-1.5 px-4 rounded-md text-xs sm:text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-200">
                CASH OUT {'$'}{bet.cashOutValue.toFixed(2)}
              </button>
            </div>
          )}

          {/* Risk / Potential Returns / Bet ID */}
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

          {/* Share to Chat */}
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
    <div className={cn("pb-4", isMobile ? "px-3" : "px-5")}>
      {/* Header — tighter margin */}
      <div className="flex items-center gap-3 pt-1 mb-2">
        <button 
          onClick={onBack}
          className="p-1 hover:bg-white/5 rounded-md cursor-pointer transition-colors"
        >
          <IconChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <h1 className="text-lg font-bold text-white">Bet History</h1>
        <IconInfoCircle className="w-4 h-4 text-white/40 cursor-pointer hover:text-white/60 transition-colors" />
      </div>

      {/* Sub-Nav Tabs — animated pill style matching site sub-navs */}
      <div className={cn("mb-5", isMobile && "overflow-x-auto scrollbar-hide -mx-2 px-2")}>
        <div className="bg-white/5 p-0.5 rounded-3xl inline-flex items-center gap-1" style={isMobile ? { minWidth: 'max-content' } : undefined}>
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveFilter(tab.key); setCurrentPage(1); setExpandedBetId(null) }}
              className={cn(
                "relative px-4 py-1.5 h-8 text-xs font-medium rounded-2xl whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 z-10 transition-colors duration-200",
                activeFilter === tab.key
                  ? "text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {activeFilter === tab.key && (
                <motion.div
                  layoutId="activeMyBetsTab"
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{ backgroundColor: brandPrimary || '#ee3536' }}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40
                  }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.count !== null && (
                <span className={cn(
                  "relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                  activeFilter === tab.key ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add Filter */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <button className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors">
          <IconFilter className="w-4 h-4" />
          <span className="font-medium">ADD FILTER</span>
        </button>
        <span className="text-white/30">|</span>
        <span className="text-white/40">No filters applied</span>
      </div>

      {/* Content: Bet List with inline accordion */}
      <div>
        {/* Bet List */}
        <div className="flex-1 min-w-0">
          <div className="border border-white/10 rounded-lg overflow-hidden">
            {paginatedBets.map((bet, index) => {
              const isExpanded = expandedBetId === bet.id
              return (
                <div key={bet.id} className={cn(index !== 0 && "border-t border-white/5")}>
                  {/* Collapsed Row */}
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
                      {/* Matchup + league for non-parlay */}
                      {bet.type !== 'parlay' && bet.team1 && bet.team2 && (
                        <div className="text-[11px] text-white/40 mt-0.5 truncate">
                          {bet.team1} v {bet.team2} · {bet.league}
                        </div>
                      )}
                      {/* Live score inline */}
                      {bet.isLive && bet.liveInfo && bet.type !== 'parlay' && (
                        <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                          <span className="text-[11px] text-white/60 truncate">{bet.team1}</span>
                          <span className="text-[11px] font-bold text-white flex-shrink-0 whitespace-nowrap">{bet.liveInfo.score.team1} - {bet.liveInfo.score.team2}</span>
                          <span className="text-[11px] text-white/60 truncate">{bet.team2}</span>
                          <span className="text-[10px] text-white/40 ml-auto flex-shrink-0 whitespace-nowrap">{bet.liveInfo.period} {bet.liveInfo.time}</span>
                        </div>
                      )}
                      {/* Final score for graded bets */}
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

                  {/* Expanded Detail (accordion) */}
                  <AnimatePresence>
                    {isExpanded && renderExpandedBet(bet)}
                  </AnimatePresence>
                </div>
              )
            })}
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
  )
}

// Sports Page Component
function SportsPage({ activeTab, onTabChange, onBack, brandPrimary, brandPrimaryHover, onSearchClick, betslipOpen, setBetslipOpen, bets, setBets, setShowToast, setToastMessage, setToastAction, placedBets, setPlacedBets, myBetsAlertCount, setMyBetsAlertCount, betslipManuallyClosed, setBetslipManuallyClosed, activeSport, setActiveSport, showMyBets, setShowMyBets, myBetsInitialFilter }: { activeTab: string; onTabChange: (tab: string) => void; onBack: () => void; brandPrimary: string; brandPrimaryHover: string; onSearchClick: () => void; betslipOpen: boolean; setBetslipOpen: (open: boolean) => void; bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>; setBets: (bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }> | ((prev: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>) => Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>)) => void; setShowToast: (show: boolean) => void; setToastMessage: (message: string) => void; setToastAction: (action: { label: string; onClick: () => void } | null) => void; placedBets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>; setPlacedBets: (bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }> | ((prev: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>) => Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>)) => void; myBetsAlertCount: number; setMyBetsAlertCount: (count: number | ((prev: number) => number)) => void; betslipManuallyClosed: boolean; setBetslipManuallyClosed: (closed: boolean) => void; activeSport: string; setActiveSport: (sport: string) => void; showMyBets?: boolean; setShowMyBets?: (show: boolean) => void; myBetsInitialFilter?: 'all' | 'cash_out' | 'in_play' | 'pending' | 'graded' }) {
  const { state: sidebarState, toggleSidebar, setOpenMobile } = useSidebar()
  const isMobile = useIsMobile()
  const router = useRouter()
  const [loadingItem, setLoadingItem] = useState<string | null>(null)
  const [loadingLeague, setLoadingLeague] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showShareTicket, setShowShareTicket] = useState(false)

  // Tracker widget state
  const [trackerEvent, setTrackerEvent] = useState<{
    id: number; team1: string; team2: string; league: string; country: string;
    score?: { team1: number; team2: number }; minute?: string; isLive?: boolean; statscoreEventId?: number; statscoreConfigId?: string
  } | null>(null)
  const sidebarPixelWidth = isMobile ? 0 : (sidebarState === 'expanded' ? 256 : 48)
  const [pendingBets, setPendingBets] = useState<Array<{
    id: string
    eventId: number
    eventName: string
    marketTitle: string
    selection: string
    odds: string
    stake: number
  }>>([])

  // Listen for bet confirmation event from betslip (backup - not used since we set directly now)
  useEffect(() => {
    const handleShowConfirmation = (e: CustomEvent) => {
      // Only handle if confirmation is not already showing to prevent flashing
      if (!showConfirmation) {
        setPendingBets(e.detail.bets || [])
        setShowConfirmation(true)
      }
    }
    window.addEventListener('showBetConfirmation' as any, handleShowConfirmation as EventListener)
    return () => {
      window.removeEventListener('showBetConfirmation' as any, handleShowConfirmation as EventListener)
    }
  }, [showConfirmation])

  // Ensure background remains clickable when betslip is open
  useEffect(() => {
    if (betslipOpen) {
      // Remove any overlays
      const removeOverlays = () => {
        const overlays = document.querySelectorAll('[data-vaul-overlay]')
        overlays.forEach((overlay) => {
          const el = overlay as HTMLElement
          if (el.parentNode) {
            el.remove()
          }
        })
      }
      
      // Force wrapper to be non-interactive
      const makeWrapperNonInteractive = () => {
        const wrappers = document.querySelectorAll('[data-vaul-drawer-wrapper]')
        wrappers.forEach((wrapper) => {
          const el = wrapper as HTMLElement
          el.style.setProperty('pointer-events', 'none', 'important')
          el.style.setProperty('background', 'transparent', 'important')
          
          // Make all children non-interactive except drawer content
          Array.from(el.children).forEach((child) => {
            const childEl = child as HTMLElement
            if (!childEl.hasAttribute('data-vaul-drawer-direction')) {
              childEl.style.setProperty('pointer-events', 'none', 'important')
            } else {
              childEl.style.setProperty('pointer-events', 'auto', 'important')
            }
          })
        })
      }
      
      // Ensure body/html allow clicks
      const enableBodyClicks = () => {
        document.body.style.setProperty('pointer-events', 'auto', 'important')
        document.documentElement.style.setProperty('pointer-events', 'auto', 'important')
      }
      
      // Run immediately
      removeOverlays()
      makeWrapperNonInteractive()
      enableBodyClicks()
      
      // Run again after a short delay to catch any dynamically created elements
      const timeout = setTimeout(() => {
        removeOverlays()
        makeWrapperNonInteractive()
        enableBodyClicks()
      }, 100)
      
      // Use MutationObserver to catch any new overlays/wrappers
      const observer = new MutationObserver(() => {
        removeOverlays()
        makeWrapperNonInteractive()
      })
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-vaul-overlay', 'data-vaul-drawer-wrapper', 'style']
      })
      
      return () => {
        clearTimeout(timeout)
        observer.disconnect()
        // Restore body styles
        document.body.style.removeProperty('pointer-events')
        document.documentElement.style.removeProperty('pointer-events')
      }
    }
  }, [betslipOpen])
  const subNavScrollRef = useRef<HTMLDivElement>(null)
  const [expandedSports, setExpandedSports] = useState<string[]>(['Baseball'])
  const [currentTime, setCurrentTime] = useState<string>('')
  
  useEffect(() => {
    setCurrentTime(new Date().toLocaleString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }))
  }, [])
  const [eventOrderBy, setEventOrderBy] = useState<string>('Popularity')
  const [selectedLeague, setSelectedLeague] = useState<number>(1) // Default to Premier League (id: 1)

  // Sportsbook settings state
  const [sportsbookSettingsOpen, setSportsbookSettingsOpen] = useState(false)
  const [oddsFormat, setOddsFormat] = useState<'American' | 'Fractional' | 'Decimal'>('American')
  const [betslipOddsSetting, setBetslipOddsSetting] = useState<'dont_accept' | 'higher' | 'any'>('higher')
  const [showBetConfirmation, setShowBetConfirmation] = useState(false)

  // Mobile sidebar quick links
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false)

  
  // Baseball breadcrumb state
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedSoccerLeague, setSelectedSoccerLeague] = useState<string | null>(null)

  // Baseball countries and leagues mapping
  const soccerCountries = [
    { name: 'USA', code: 'US', leagues: ['MLB', 'AAA', 'AA'] },
    { name: 'Japan', code: 'JP', leagues: ['NPB'] },
    { name: 'South Korea', code: 'KR', leagues: ['KBO'] },
  ]

  // Baseball leagues carousel state
  const [soccerLeaguesCarouselApi, setSoccerLeaguesCarouselApi] = useState<CarouselApi>()
  const [soccerLeaguesCanScrollPrev, setSoccerLeaguesCanScrollPrev] = useState(false)
  const [soccerLeaguesCanScrollNext, setSoccerLeaguesCanScrollNext] = useState(false)

  // Top baseball leagues for carousel
  const topSoccerLeagues = [
    { id: 1, name: 'MLB', country: 'USA', icon: '/banners/sports_league/MLB.svg' },
    { id: 2, name: 'NPB', country: 'Japan', icon: '/banners/sports_league/MLB.svg' },
    { id: 3, name: 'KBO', country: 'South Korea', icon: '/banners/sports_league/MLB.svg' },
  ]

  // Slots carousel state
  const [sportsSlotsCarouselApi, setSportsSlotsCarouselApi] = useState<CarouselApi>()
  const [sportsSlotsCanScrollPrev, setSportsSlotsCanScrollPrev] = useState(false)
  const [sportsSlotsCanScrollNext, setSportsSlotsCanScrollNext] = useState(false)
  
  // Top Events carousel state
  const [topEventsCarouselApi, setTopEventsCarouselApi] = useState<CarouselApi>()
  const [topEventsCanScrollPrev, setTopEventsCanScrollPrev] = useState(false)
  const [topEventsCanScrollNext, setTopEventsCanScrollNext] = useState(false)
  
  // Premier League table expand state
  const [premierLeagueTableExpanded, setPremierLeagueTableExpanded] = useState(false)
  const [premierLeagueActiveTab, setPremierLeagueActiveTab] = useState<'Table' | 'Fixtures' | 'Results' | 'Stats'>('Table')
  
  // Favorite leagues state (persisted in localStorage)
  const [favoriteLeagues, setFavoriteLeagues] = useState<string[]>([])
  
  useEffect(() => {
    const stored = localStorage.getItem('favoriteLeagues')
    if (stored) {
      try { setFavoriteLeagues(JSON.parse(stored)) } catch {}
    }
  }, [])
  
  const toggleFavoriteLeague = (leagueSlug: string) => {
    setFavoriteLeagues(prev => {
      const next = prev.includes(leagueSlug) 
        ? prev.filter(s => s !== leagueSlug)
        : [...prev, leagueSlug]
      localStorage.setItem('favoriteLeagues', JSON.stringify(next))
      return next
    })
  }
  
  // Total market price selection state - key: `${eventId}-${marketIndex}`, value: selected price
  const [totalMarketPrices, setTotalMarketPrices] = useState<{ [key: string]: string }>({})
  
  // Top Bet Boosts carousel state
  const [topBetBoostsCarouselApi, setTopBetBoostsCarouselApi] = useState<CarouselApi>()
  const [topBetBoostsCanScrollPrev, setTopBetBoostsCanScrollPrev] = useState(false)
  const [topBetBoostsCanScrollNext, setTopBetBoostsCanScrollNext] = useState(false)

  // Same Game Parlays carousel state
  const [sgpCarouselApi, setSgpCarouselApi] = useState<CarouselApi>()
  const [sgpCanScrollPrev, setSgpCanScrollPrev] = useState(false)
  const [sgpCanScrollNext, setSgpCanScrollNext] = useState(false)
  
  // Live scores state for animation - initialized after liveEvents is defined
  const [liveScores, setLiveScores] = useState<{ [key: number]: { team1: number, team2: number, animating?: { team: 1 | 2, from: number, to: number } } }>({})
  
  // Top Events scores state for animation
  const [topEventsScores, setTopEventsScores] = useState<{ [key: number]: { team1: number, team2: number, animating?: { team: 1 | 2, from: number, to: number } } }>({})

  // Random score updates with realistic spacing - will be set up after liveEvents is defined (see useEffect below)
  
  // Update slots carousel scroll state
  useEffect(() => {
    if (!sportsSlotsCarouselApi) return
    setSportsSlotsCanScrollPrev(sportsSlotsCarouselApi.canScrollPrev())
    setSportsSlotsCanScrollNext(sportsSlotsCarouselApi.canScrollNext())
    sportsSlotsCarouselApi.on('select', () => {
      setSportsSlotsCanScrollPrev(sportsSlotsCarouselApi.canScrollPrev())
      setSportsSlotsCanScrollNext(sportsSlotsCarouselApi.canScrollNext())
    })
  }, [sportsSlotsCarouselApi])
  
  // Update top events carousel scroll state
  useEffect(() => {
    if (!topEventsCarouselApi) return
    setTopEventsCanScrollPrev(topEventsCarouselApi.canScrollPrev())
    setTopEventsCanScrollNext(topEventsCarouselApi.canScrollNext())
    topEventsCarouselApi.on('select', () => {
      setTopEventsCanScrollPrev(topEventsCarouselApi.canScrollPrev())
      setTopEventsCanScrollNext(topEventsCarouselApi.canScrollNext())
    })
  }, [topEventsCarouselApi])
  
  // Update top bet boosts carousel scroll state
  useEffect(() => {
    if (!topBetBoostsCarouselApi) return
    setTopBetBoostsCanScrollPrev(topBetBoostsCarouselApi.canScrollPrev())
    setTopBetBoostsCanScrollNext(topBetBoostsCarouselApi.canScrollNext())
    topBetBoostsCarouselApi.on('select', () => {
      setTopBetBoostsCanScrollPrev(topBetBoostsCarouselApi.canScrollPrev())
      setTopBetBoostsCanScrollNext(topBetBoostsCarouselApi.canScrollNext())
    })
  }, [topBetBoostsCarouselApi])
  
  // Update SGP carousel scroll state
  useEffect(() => {
    if (!sgpCarouselApi) return
    setSgpCanScrollPrev(sgpCarouselApi.canScrollPrev())
    setSgpCanScrollNext(sgpCarouselApi.canScrollNext())
    sgpCarouselApi.on('select', () => {
      setSgpCanScrollPrev(sgpCarouselApi.canScrollPrev())
      setSgpCanScrollNext(sgpCarouselApi.canScrollNext())
    })
  }, [sgpCarouselApi])
  
  const sportsTabs = ['Events', 'Outrights', 'Boosts', 'Specials', 'All Leagues']
  
  const eventOrderOptions = [
    { value: 'Popularity', label: 'Popularity' },
    { value: 'Starting in', label: 'Starting in' },
    { value: 'Live', label: 'Live' },
    { value: 'Upcoming', label: 'Upcoming' },
  ]
  
  // Sports sidebar menu items
  const sportsFeatures = [
    { icon: IconHome, label: 'Home' },
    { icon: IconTicket, label: 'My Bets', action: 'myBets' },
    { icon: '/sports_icons/my-feed.svg', label: 'My Feed', href: '/sports/my-feed' },
    { icon: IconBolt, label: 'Live Betting' },
    { icon: '/sports_icons/World-Cup-2022.svg', label: 'World Cup Hub', active: false },
    { icon: IconRocket, label: 'Odds Boosters' },
    { icon: '/sports_icons/Same Game Parlays.svg', label: 'Same Game Parlays' },
    { icon: '/sports_icons/Mega Parlays.svg', label: 'Mega Parlays' },
  ]
  
  const sportsCategories: Array<{ icon: any; label: string; href?: string; active?: boolean; expandable?: boolean; subItems?: Array<{ icon?: any; label: string; badge?: any; subItems?: Array<{ icon?: any; label: string; badge?: any }> }> }> = [
    { icon: '/sports_icons/baseball.svg', label: 'Baseball', active: true, href: '/sports/baseball' },
    { icon: '/sports_icons/Basketball.svg', label: 'Basketball', href: '/sports/basketball' },
    { icon: '/sports_icons/football.svg', label: 'Football', href: '/sports/football' },
    { icon: '/sports_icons/soccer.svg', label: 'Soccer', href: '/sports/soccer' },
  ]

  const topLeaguesList = [
    { icon: '/banners/sports_league/NFL.svg', label: 'NFL', sport: 'Football', href: '/sports/football/nfl' },
    { icon: '/banners/sports_league/nba.svg', label: 'NBA', sport: 'Basketball', href: '/sports/basketball/nba' },
    { icon: '/banners/sports_league/MLB.svg', label: 'MLB', sport: 'Baseball', href: '/sports/baseball/mlb' },
    { icon: '/banners/sports_league/NHL.svg', label: 'NHL', sport: 'Hockey', href: '/sports/hockey/nhl' },
    { icon: '/banners/sports_league/prem.svg', label: 'Premier League', sport: 'Soccer', href: '/sports/soccer/premier-league' },
    { icon: '/banners/sports_league/laliga.svg', label: 'La Liga', sport: 'Soccer', href: '/sports/soccer/la-liga' },
    { icon: '/banners/sports_league/champions.svg', label: 'Champions League', sport: 'Soccer', href: '/sports/soccer/champions-league' },
    { icon: '/banners/sports_league/mls.svg', label: 'MLS', sport: 'Soccer', href: '/sports/soccer/mls' },
    { icon: '/banners/sports_league/ATP.svg', label: 'ATP Tour', sport: 'Tennis', href: '/sports/tennis/atp' },
    { icon: '/banners/sports_league/f1.svg', label: 'Formula 1', sport: 'Auto Racing', href: '/sports/football/nfl' },
  ]

  const azSports: Array<{ icon: any; label: string; href: string }> = [
    { icon: '/sports_icons/baseball.svg', label: 'Baseball', href: '/sports/baseball' },
    { icon: '/sports_icons/Basketball.svg', label: 'Basketball', href: '/sports/basketball' },
    { icon: '/sports_icons/mma.svg', label: 'Boxing', href: '/sports/mma' },
    { icon: '/sports_icons/football.svg', label: 'Football', href: '/sports/football' },
    { icon: '/sports_icons/Golf.svg', label: 'Golf', href: '/sports/pool' },
    { icon: '/sports_icons/Hockey.svg', label: 'Hockey', href: '/sports/hockey' },
    { icon: '/sports_icons/Horse-Racing-101.svg', label: 'Horse Racing', href: '/sports/pool' },
    { icon: '/sports_icons/lacrosse.svg', label: 'Lacrosse', href: '/sports/lacrosse' },
    { icon: '/sports_icons/mma.svg', label: 'MMA', href: '/sports/mma' },
    { icon: '/sports_icons/pool.svg', label: 'Pool', href: '/sports/pool' },
    { icon: '/sports_icons/rugby.svg', label: 'Rugby League', href: '/sports/rugby' },
    { icon: '/sports_icons/rugby.svg', label: 'Rugby Union', href: '/sports/rugby' },
    { icon: '/sports_icons/soccer.svg', label: 'Soccer', href: '/sports/soccer' },
    { icon: '/sports_icons/table_tennis.svg', label: 'Table Tennis', href: '/sports/table-tennis' },
    { icon: '/sports_icons/tennis.svg', label: 'Tennis', href: '/sports/tennis' },
    { icon: '/sports_icons/volley.svg', label: 'Volleyball', href: '/sports/volleyball' },
  ]

  const toggleSport = (sport: string) => {
    setExpandedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    )
  }
  
  const toggleSubSport = (parent: string, child: string) => {
    const key = `${parent}-${child}`
    setExpandedSports(prev => 
      prev.includes(key) 
        ? prev.filter(s => s !== key)
        : [...prev, key]
    )
  }
  
  const handleFeatureClick = (label: string, href?: string) => {
    if (label === 'My Bets') {
      setShowMyBets?.(true)
      if (isMobile) setOpenMobile(false)
      return
    }
    if (label === 'Home' && showMyBets) {
      setShowMyBets?.(false)
      return
    }
    if (href) {
      setLoadingItem(label)
      router.push(href)
      return
    }
    console.log('Feature clicked:', label)
  }
  
  const handleSportClick = (label: string, href?: string) => {
    if (href) {
      setLoadingItem(label)
      router.push(href)
      return
    }
    console.log('Sport clicked:', label)
  }
  
  // League data for carousel
  const leagues = [
    { id: 1, name: 'MLB', country: 'USA', icon: '/banners/sports_league/MLB.svg' },
    { id: 2, name: 'NPB', country: 'Japan', icon: IconTrophy },
    { id: 3, name: 'KBO', country: 'South Korea', icon: IconTrophy },
  ]
  
  // Sample event data with betting markets - Mixed soccer leagues
  const liveEvents = [
    { 
      id: 1, 
      league: 'MLB', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      startTime: '5th', 
      elapsedSeconds: 5400,
      isLive: true,
      team1: 'New York Yankees', 
      team2: 'Boston Red Sox', 
      score: { team1: 3, team2: 2 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'NYY', odds: '-150' }, { label: 'BOS', odds: '+130' }] },
        { title: 'Spread', options: [{ label: 'NYY -3.5', odds: '-110' }, { label: 'BOS +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 45.5', odds: '-110' }, { label: 'U 45.5', odds: '-110' }] },
      ]
    },
    { 
      id: 2, 
      league: 'MLB', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      startTime: '7th', 
      elapsedSeconds: 7200,
      isLive: true,
      team1: 'Los Angeles Dodgers', 
      team2: 'San Francisco Giants', 
      score: { team1: 5, team2: 4 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'LAD', odds: '-150' }, { label: 'SF', odds: '+130' }] },
        { title: 'Spread', options: [{ label: 'LAD -3.5', odds: '-110' }, { label: 'SF +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 45.5', odds: '-110' }, { label: 'U 45.5', odds: '-110' }] },
      ]
    },
    { 
      id: 3, 
      league: 'MLB', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      startTime: '3rd', 
      elapsedSeconds: 3600,
      isLive: true,
      team1: 'Houston Astros', 
      team2: 'Texas Rangers', 
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'HOU', odds: '-150' }, { label: 'TEX', odds: '+130' }] },
        { title: 'Spread', options: [{ label: 'HOU -3.5', odds: '-110' }, { label: 'TEX +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 45.5', odds: '-110' }, { label: 'U 45.5', odds: '-110' }] },
      ]
    },
  ]
  
  // Initialize live scores and set up random score updates after liveEvents is defined
  useEffect(() => {
    if (Object.keys(liveScores).length === 0) {
      const initial: { [key: number]: { team1: number, team2: number } } = {}
      liveEvents.forEach(event => {
        if (event.score) {
          initial[event.id] = { team1: event.score.team1, team2: event.score.team2 }
        }
      })
      if (Object.keys(initial).length > 0) {
        setLiveScores(initial)
      }
    }
    
    // Initialize Top Events scores
    if (Object.keys(topEventsScores).length === 0) {
      const topEventsData = [
        { id: 4, score: '1 - 0' },
        { id: 5, score: '2 - 1' },
        { id: 6, score: '1 - 2' },
        { id: 7, score: '2 - 1' },
        { id: 8, score: '2 - 0' },
        { id: 9, score: '1 - 1' },
        { id: 10, score: '0 - 1' },
        { id: 11, score: '0 - 1' },
        { id: 12, score: '3 - 0' },
      ]
      
      const initial: { [key: number]: { team1: number, team2: number } } = {}
      topEventsData.forEach(event => {
        const parts = event.score.split(' - ')
        initial[event.id] = { 
          team1: parseInt(parts[0]) || 0, 
          team2: parseInt(parts[1]) || 0 
        }
      })
      if (Object.keys(initial).length > 0) {
        setTopEventsScores(initial)
      }
    }

    // Set up random score updates
    if (liveEvents.length === 0) return

    const timeoutIds: NodeJS.Timeout[] = []

    // Make Liverpool score immediately (id: 1, team1)
    const liverpoolEvent = liveEvents.find(e => e.id === 1)
    if (liverpoolEvent && liverpoolEvent.score) {
      const liverpoolTimeout = setTimeout(() => {
        setLiveScores(prev => {
          // Ensure we have the initial score
          const currentScore = prev[1] || { team1: liverpoolEvent.score!.team1, team2: liverpoolEvent.score!.team2 }
          
          return {
            ...prev,
            [1]: {
              team1: currentScore.team1 + 1,
              team2: currentScore.team2,
              animating: {
                team: 1,
                from: currentScore.team1,
                to: currentScore.team1 + 1
              }
            }
          }
        })

        // Clear animation after animation completes
        setTimeout(() => {
          setLiveScores(prev => {
            if (!prev[1]) return prev
            const updated = { ...prev[1] }
            delete updated.animating
            return { ...prev, [1]: updated }
          })
        }, 800)
      }, 2000) // 2 seconds after page load (reduced from 3)
      timeoutIds.push(liverpoolTimeout)
    }
    
    // Make a Top Events team score (randomly select one)
    const topEventsTimeout = setTimeout(() => {
      const topEventsIds = [4, 5, 6, 7, 8, 9, 10, 11, 12]
      const randomId = topEventsIds[Math.floor(Math.random() * topEventsIds.length)]
      
      setTopEventsScores(prev => {
        const currentScore = prev[randomId] || { team1: 0, team2: 0 }
        const scoringTeam = Math.random() < 0.5 ? 1 : 2
        
        return {
          ...prev,
          [randomId]: {
            team1: scoringTeam === 1 ? currentScore.team1 + 1 : currentScore.team1,
            team2: scoringTeam === 2 ? currentScore.team2 + 1 : currentScore.team2,
            animating: {
              team: scoringTeam,
              from: scoringTeam === 1 ? currentScore.team1 : currentScore.team2,
              to: scoringTeam === 1 ? currentScore.team1 + 1 : currentScore.team2 + 1
            }
          }
        }
      })
      
      // Clear animation after animation completes
      setTimeout(() => {
        setTopEventsScores(prev => {
          const updated = { ...prev[randomId] }
          delete updated.animating
          return { ...prev, [randomId]: updated }
        })
      }, 800)
    }, 5000) // 5 seconds after page load
    timeoutIds.push(topEventsTimeout)

    const updateScore = () => {
      // Random delay between 8-15 seconds for testing (reduced from 45-120)
      const delay = 8000 + Math.random() * 7000
      
      const timeoutId = setTimeout(() => {
        // Randomly select an event
        const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)]
        if (!randomEvent.score) {
          updateScore()
          return
        }

        setLiveScores(prev => {
          const currentScore = prev[randomEvent.id] || { team1: randomEvent.score!.team1, team2: randomEvent.score!.team2 }
          
          // Randomly select which team scores (60% chance team1, 40% team2)
          const scoringTeam = Math.random() < 0.6 ? 1 : 2
          
          return {
            ...prev,
            [randomEvent.id]: {
              team1: scoringTeam === 1 ? currentScore.team1 + 1 : currentScore.team1,
              team2: scoringTeam === 2 ? currentScore.team2 + 1 : currentScore.team2,
              animating: {
                team: scoringTeam,
                from: scoringTeam === 1 ? currentScore.team1 : currentScore.team2,
                to: scoringTeam === 1 ? currentScore.team1 + 1 : currentScore.team2 + 1
              }
            }
          }
        })

        // Clear animation after animation completes
        const clearTimeoutId = setTimeout(() => {
          setLiveScores(prev => {
            const updated = { ...prev[randomEvent.id] }
            delete updated.animating
            return { ...prev, [randomEvent.id]: updated }
          })
        }, 800)
        timeoutIds.push(clearTimeoutId)

        // Schedule next update
        updateScore()
      }, delay)
      timeoutIds.push(timeoutId)
    }
    
    // Update Top Events scores randomly
    const updateTopEventsScore = () => {
      // Random delay between 10-18 seconds for Top Events
      const delay = 10000 + Math.random() * 8000
      
      const timeoutId = setTimeout(() => {
        const topEventsIds = [4, 5, 6, 7, 8, 9, 10, 11, 12]
        const randomId = topEventsIds[Math.floor(Math.random() * topEventsIds.length)]
        
        setTopEventsScores(prev => {
          const currentScore = prev[randomId] || { team1: 0, team2: 0 }
          const scoringTeam = Math.random() < 0.5 ? 1 : 2
          
          return {
            ...prev,
            [randomId]: {
              team1: scoringTeam === 1 ? currentScore.team1 + 1 : currentScore.team1,
              team2: scoringTeam === 2 ? currentScore.team2 + 1 : currentScore.team2,
              animating: {
                team: scoringTeam,
                from: scoringTeam === 1 ? currentScore.team1 : currentScore.team2,
                to: scoringTeam === 1 ? currentScore.team1 + 1 : currentScore.team2 + 1
              }
            }
          }
        })
        
        // Clear animation after animation completes
        const clearTimeoutId = setTimeout(() => {
          setTopEventsScores(prev => {
            const updated = { ...prev[randomId] }
            delete updated.animating
            return { ...prev, [randomId]: updated }
          })
        }, 800)
        timeoutIds.push(clearTimeoutId)
        
        // Schedule next update
        updateTopEventsScore()
      }, delay)
      timeoutIds.push(timeoutId)
    }

    // Start first random update after initial delay (5-10 seconds for testing)
    const initialDelay = 5000 + Math.random() * 5000
    const initialTimeoutId = setTimeout(updateScore, initialDelay)
    timeoutIds.push(initialTimeoutId)
    
    // Start Top Events score updates after initial delay (8-12 seconds)
    const topEventsInitialDelay = 8000 + Math.random() * 4000
    const topEventsInitialTimeoutId = setTimeout(updateTopEventsScore, topEventsInitialDelay)
    timeoutIds.push(topEventsInitialTimeoutId)

    return () => {
      timeoutIds.forEach(id => clearTimeout(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const upcomingEvents = [
    { 
      id: 4, 
      league: 'MLB', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      time: 'Today 19:05', 
      team1: 'Chicago Cubs', 
      team2: 'St. Louis Cardinals', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'CHC', odds: '-180' }, { label: 'STL', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'CHC -4.5', odds: '-110' }, { label: 'STL +4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 48.5', odds: '-105' }, { label: 'U 48.5', odds: '-115' }] },
      ]
    },
    { 
      id: 5, 
      league: 'MLB', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      time: 'Today 19:10', 
      team1: 'Atlanta Braves', 
      team2: 'New York Mets', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'ATL', odds: '-180' }, { label: 'NYM', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'ATL -4.5', odds: '-110' }, { label: 'NYM +4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 48.5', odds: '-105' }, { label: 'U 48.5', odds: '-115' }] },
      ]
    },
    { 
      id: 6, 
      league: 'NPB', 
      country: 'Japan',
      leagueIcon: '/banners/sports_league/MLB.svg',
      time: 'Tomorrow 10:00', 
      team1: 'Yomiuri Giants', 
      team2: 'Tokyo Yakult Swallows', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'YOM', odds: '-180' }, { label: 'TYS', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'YOM -4.5', odds: '-110' }, { label: 'TYS +4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 48.5', odds: '-105' }, { label: 'U 48.5', odds: '-115' }] },
      ]
    },
    { 
      id: 7, 
      league: 'KBO', 
      country: 'South Korea',
      leagueIcon: '/banners/sports_league/MLB.svg',
      time: 'Tomorrow 11:30', 
      team1: 'Samsung Lions', 
      team2: 'KIA Tigers', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'SAM', odds: '-180' }, { label: 'KIA', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'SAM -4.5', odds: '-110' }, { label: 'KIA +4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 48.5', odds: '-105' }, { label: 'U 48.5', odds: '-115' }] },
      ]
    },
  ]

  // NFL events (Football) - Live
  const nflLiveEvents = [
    { 
      id: 101, 
      league: 'NFL', 
      country: 'USA',
      sport: 'Football',
      startTime: 'Q2', 
      elapsedSeconds: 420, // 7 minutes = 420 seconds
      isLive: true,
      team1: 'Alanta Falcons', 
      team2: 'Tennessee Titans', 
      score: { team1: 10, team2: 9 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'ATL', odds: '+150' }, { label: 'TEN', odds: '+180' }] },
        { title: 'Total', options: [{ label: 'O 45.5', odds: '-110' }, { label: 'U 45.5', odds: '-110' }] },
        { title: 'Spread', options: [{ label: 'ATL -3.5', odds: '-110' }, { label: 'TEN +3.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'ATL', odds: '+140' }, { label: 'TEN', odds: '+160' }] },
        { title: 'Q1 Spread', options: [{ label: 'ATL -0.5', odds: '-105' }, { label: 'TEN +0.5', odds: '-115' }] },
        { title: 'Team B Win', options: [{ label: 'ATL', odds: '+150' }, { label: 'TEN', odds: '+180' }] },
        { title: 'Half-Time Score', options: [{ label: 'O 21.5', odds: '-110' }, { label: 'U 21.5', odds: '-110' }] },
        { title: 'Player A Touchdowns', options: [{ label: 'O 0.5', odds: '+120' }, { label: 'U 0.5', odds: '-150' }] },
      ]
    },
    { 
      id: 102, 
      league: 'NFL', 
      country: 'USA',
      sport: 'Football',
      startTime: 'Q4', 
      elapsedSeconds: 2280, // 38 minutes = 2280 seconds
      isLive: true,
      team1: 'Minnesota Vikings', 
      team2: 'New England Patriots', 
      score: { team1: 34, team2: 28 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'MIN', odds: '+120' }, { label: 'NE', odds: '+140' }] },
        { title: 'Total', options: [{ label: 'O 48.5', odds: '-110' }, { label: 'U 48.5', odds: '-110' }] },
        { title: 'Spread', options: [{ label: 'MIN -2.5', odds: '-110' }, { label: 'NE +2.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'MIN', odds: '+130' }, { label: 'NE', odds: '+150' }] },
        { title: 'Q4 Spread', options: [{ label: 'MIN -1.5', odds: '-105' }, { label: 'NE +1.5', odds: '-115' }] },
        { title: 'Team B Win', options: [{ label: 'MIN', odds: '+120' }, { label: 'NE', odds: '+140' }] },
        { title: 'Half-Time Score', options: [{ label: 'O 24.5', odds: '-110' }, { label: 'U 24.5', odds: '-110' }] },
        { title: 'Player A Touchdowns', options: [{ label: 'O 1.5', odds: '+150' }, { label: 'U 1.5', odds: '-180' }] },
      ]
    },
    { 
      id: 103, 
      league: 'NFL', 
      country: 'USA',
      sport: 'Football',
      startTime: 'Q1', 
      elapsedSeconds: 60, // 1 minute = 60 seconds
      isLive: true,
      team1: 'Detroit Lions', 
      team2: 'Miami Dolphins', 
      score: { team1: 0, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'DET', odds: '+110' }, { label: 'MIA', odds: '+130' }] },
        { title: 'Total', options: [{ label: 'O 47.5', odds: '-110' }, { label: 'U 47.5', odds: '-110' }] },
        { title: 'Spread', options: [{ label: 'DET -1.5', odds: '-110' }, { label: 'MIA +1.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'DET', odds: '+115' }, { label: 'MIA', odds: '+135' }] },
        { title: 'Q1 Spread', options: [{ label: 'DET -0.5', odds: '-105' }, { label: 'MIA +0.5', odds: '-115' }] },
        { title: 'Team B Win', options: [{ label: 'DET', odds: '+110' }, { label: 'MIA', odds: '+130' }] },
        { title: 'Half-Time Score', options: [{ label: 'O 23.5', odds: '-110' }, { label: 'U 23.5', odds: '-110' }] },
        { title: 'Player A Touchdowns', options: [{ label: 'O 0.5', odds: '+110' }, { label: 'U 0.5', odds: '-140' }] },
      ]
    },
  ]

  // NFL events (Football) - Upcoming
  const nflUpcomingEvents = [
    { 
      id: 104, 
      league: 'NFL', 
      country: 'USA',
      sport: 'Football',
      time: 'Today 10:30 PM', 
      team1: 'Seattle Seahawks', 
      team2: 'Kansas City Chiefs', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'SEA', odds: '+160' }, { label: 'KC', odds: '+140' }] },
        { title: 'Total', options: [{ label: 'O 46.5', odds: '-110' }, { label: 'U 46.5', odds: '-110' }] },
        { title: 'Spread', options: [{ label: 'SEA +3.5', odds: '-110' }, { label: 'KC -3.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'SEA', odds: '+170' }, { label: 'KC', odds: '+150' }] },
        { title: 'Q1 Spread', options: [{ label: 'SEA +0.5', odds: '-105' }, { label: 'KC -0.5', odds: '-115' }] },
        { title: 'Team B Win', options: [{ label: 'SEA', odds: '+160' }, { label: 'KC', odds: '+140' }] },
        { title: 'Half-Time Score', options: [{ label: 'O 23.5', odds: '-110' }, { label: 'U 23.5', odds: '-110' }] },
        { title: 'Player A Touchdowns', options: [{ label: 'O 0.5', odds: '+125' }, { label: 'U 0.5', odds: '-155' }] },
      ]
    },
    { 
      id: 105, 
      league: 'NFL', 
      country: 'USA',
      sport: 'Football',
      time: 'In 59min', 
      team1: 'Indianapolis Colts', 
      team2: 'Green Bay Packers', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'IND', odds: '+145' }, { label: 'GB', odds: '+125' }] },
        { title: 'Total', options: [{ label: 'O 44.5', odds: '-110' }, { label: 'U 44.5', odds: '-110' }] },
        { title: 'Spread', options: [{ label: 'IND +2.5', odds: '-110' }, { label: 'GB -2.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'IND', odds: '+155' }, { label: 'GB', odds: '+135' }] },
        { title: 'Q1 Spread', options: [{ label: 'IND +0.5', odds: '-105' }, { label: 'GB -0.5', odds: '-115' }] },
        { title: 'Team B Win', options: [{ label: 'IND', odds: '+145' }, { label: 'GB', odds: '+125' }] },
        { title: 'Half-Time Score', options: [{ label: 'O 22.5', odds: '-110' }, { label: 'U 22.5', odds: '-110' }] },
        { title: 'Player A Touchdowns', options: [{ label: 'O 0.5', odds: '+115' }, { label: 'U 0.5', odds: '-145' }] },
      ]
    },
  ]

  // Filter events based on active sport - Soccer page shows all soccer events
  const filteredLiveEvents = liveEvents
  const filteredUpcomingEvents = upcomingEvents

  // Helper function to check if a bet is selected
  const isBetSelected = (eventId: number, marketTitle: string, selection: string) => {
    return bets.some(bet => 
      bet.eventId === eventId && 
      bet.marketTitle === marketTitle && 
      bet.selection === selection
    )
  }

  // State for minimizing betslip
  const [betslipMinimized, setBetslipMinimized] = useState(false)
  
  // Helper function to remove bet from betslip - instant removal
  const removeBet = useCallback((betId: string) => {
    // Remove immediately - no delay
    setBets(prev => {
      const newBets = prev.filter(bet => bet.id !== betId)
      // Close drawer if no bets left
      if (newBets.length === 0) {
        setBetslipOpen(false)
        setBetslipMinimized(false)
      }
      return newBets
    })
  }, [setBets, setBetslipOpen])
  
  // Helper function to add/remove bet from betslip (toggle behavior) - instant response
  const addBetToSlip = useCallback((eventId: number, eventName: string, marketTitle: string, selection: string, odds: string) => {
    setBets(prev => {
    // Check if this exact bet already exists
      const existingBetIndex = prev.findIndex(bet => 
      bet.eventId === eventId && 
      bet.marketTitle === marketTitle && 
      bet.selection === selection
    )
    
      if (existingBetIndex !== -1) {
        // Remove it immediately - no delay
        const newBets = prev.filter((_, index) => index !== existingBetIndex)
        // Close drawer if no bets left
        if (newBets.length === 0) {
          setBetslipOpen(false)
          setBetslipMinimized(false)
        }
        return newBets
      }
      
      // Add new bet immediately
    const newBet = {
      id: `${eventId}-${marketTitle}-${selection}-${Date.now()}`,
      eventId,
      eventName,
      marketTitle,
      selection,
      odds,
        stake: 0
    }
      
      // Open betslip if closed, but preserve minimized state if already open
      // On mobile, only auto-open on the FIRST bet (when betslip was never manually closed)
      // After user closes betslip on mobile, don't auto-open again - bets go to dock
      if (!betslipOpen) {
        if (!isMobile) {
          // Desktop: always open if closed
    setBetslipOpen(true)
          setBetslipMinimized(false)
        } else if (!betslipManuallyClosed) {
          // Mobile: only auto-open if user hasn't manually closed it yet
          setBetslipOpen(true)
          setBetslipMinimized(false)
        }
        // If betslipManuallyClosed is true on mobile, don't auto-open - bets go to dock
      }
      // If already open (whether minimized or expanded), don't change the state
      // This preserves the minimized state when adding bets
      
      return [...prev, newBet]
    })
  }, [setBets, setBetslipOpen, betslipOpen, betslipMinimized, isMobile, betslipManuallyClosed])

  // Helper function to update bet stake
  const updateBetStake = (betId: string, stake: number) => {
    setBets(prev => prev.map(bet => bet.id === betId ? { ...bet, stake } : bet))
  }

  // Group bets by event (game) to identify straights vs parlay
  const betsByEvent = useMemo(() => {
    return bets.reduce((acc, bet) => {
      if (!acc[bet.eventId]) {
        acc[bet.eventId] = []
      }
      acc[bet.eventId].push(bet)
      return acc
    }, {} as Record<number, typeof bets>)
  }, [bets])

  const uniqueEvents = Object.keys(betsByEvent).length
  const hasMultipleGames = uniqueEvents > 1
  const hasParlay = hasMultipleGames && bets.length > 1

  // Calculate straight bets (one per game, or multiple if same game)
  const straightBets = Object.values(betsByEvent).flat()
  const straightStake = straightBets.reduce((sum, bet) => sum + bet.stake, 0)
  
  // Helper function to convert odds to decimal multiplier
  const oddsToDecimal = (oddsStr: string): number => {
    const cleaned = oddsStr.replace('+', '').trim()
    const oddsValue = parseFloat(cleaned)
    
    // If odds are >= 2.0, assume decimal format (e.g., 3.25, 2.10)
    // If odds are < 2.0 or start with +, assume American format (e.g., +350, +150)
    if (oddsStr.startsWith('+') || (oddsValue < 2.0 && oddsValue > 0)) {
      // American odds: +350 means bet $100 to win $350
      return oddsValue / 100 + 1
    } else {
      // Decimal odds: 3.25 means bet $1 to win $3.25 total
      return oddsValue
    }
  }
  
  // Calculate parlay (only if multiple games)
  const [parlayStake, setParlayStake] = useState(0)
  const calculateParlayOdds = () => {
    if (!hasParlay) return 0
    const oddsMultiplier = bets.reduce((product, bet) => {
      return product * oddsToDecimal(bet.odds)
    }, 1)
    return oddsMultiplier
  }
  const parlayOddsMultiplier = calculateParlayOdds()
  const parlayOdds = parlayOddsMultiplier > 0 ? `+${((parlayOddsMultiplier - 1) * 100).toFixed(0)}` : '+0'
  const parlayPotentialWin = parlayStake * parlayOddsMultiplier - parlayStake

  // Calculate total stake (straights + parlay)
  const totalStake = straightStake + parlayStake
  const totalPotentialWin = bets.reduce((sum, bet) => {
    const decimalMultiplier = oddsToDecimal(bet.odds)
    const toWin = bet.stake * decimalMultiplier - bet.stake
    return sum + toWin
  }, 0) + parlayPotentialWin

  // ── Betslip state hoisted to parent so it survives view re-renders ──
  const currencySymbol = '$'
  const [bsIsScrolled, setBsIsScrolled] = useState(false)
  const [nudgeKey, setNudgeKey] = useState(0)
  const bsScrollContainerRef = useRef<HTMLDivElement>(null)
  const previousBetsLengthRef = useRef(bets.length)
  const [localStakes, setLocalStakes] = useState<Record<string, string>>({})
  const [localParlayStake, setLocalParlayStake] = useState<string>('')
  const [numpadTarget, _setNumpadTarget] = useState<string | null>(null)
  const numpadTargetRef = useRef<string | null>(null)
  const setNumpadTarget = (val: string | null) => { numpadTargetRef.current = val; _setNumpadTarget(val) }
  const inputRefs = useRef<Record<string, HTMLInputElement>>({})
  const focusedInputRef = useRef<string | null>(null)

  // ── Betslip numpad handlers (parent scope so they survive re-renders) ──
  const handleNumpadDigit = useCallback((digit: string) => {
    const target = numpadTargetRef.current
    if (!target) return
    if (target === 'parlay') {
      setLocalParlayStake(prev => {
        const next = prev + digit
        if (/^\d*\.?\d{0,2}$/.test(next)) {
          setParlayStake(parseFloat(next) || 0)
          return next
        }
        return prev
      })
    } else {
      setLocalStakes(prev => {
        const current = prev[target] || ''
        const next = current + digit
        if (/^\d*\.?\d{0,2}$/.test(next)) {
          updateBetStake(target, parseFloat(next) || 0)
          return { ...prev, [target]: next }
        }
        return prev
      })
    }
  }, [])

  const handleNumpadBackspace = useCallback(() => {
    const target = numpadTargetRef.current
    if (!target) return
    if (target === 'parlay') {
      setLocalParlayStake(prev => {
        const next = prev.slice(0, -1)
        setParlayStake(parseFloat(next) || 0)
        return next
      })
    } else {
      setLocalStakes(prev => {
        const next = (prev[target] || '').slice(0, -1)
        updateBetStake(target, parseFloat(next) || 0)
        return { ...prev, [target]: next }
      })
    }
  }, [])

  const handleNumpadDone = useCallback(() => {
    const target = numpadTargetRef.current
    if (!target) return
    if (target === 'parlay') {
      setLocalParlayStake('')
    } else {
      setLocalStakes(prev => { const n = { ...prev }; delete n[target]; return n })
    }
    setNumpadTarget(null)
  }, [])

  const handleQuickAmount = useCallback((amount: number) => {
    const target = numpadTargetRef.current
    if (!target) return
    const str = amount.toString()
    if (target === 'parlay') {
      setLocalParlayStake(str)
      setParlayStake(amount)
    } else {
      setLocalStakes(prev => ({ ...prev, [target]: str }))
      updateBetStake(target, amount)
    }
  }, [])

  // ── Betslip effects (parent scope so they don't re-run on view remount) ──
  useEffect(() => {
    const container = bsScrollContainerRef.current
    if (!container) return
    const handleScroll = () => setBsIsScrolled(container.scrollTop > 0)
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [betslipOpen])

  useEffect(() => {
    if (!isMobile || !numpadTarget) return
    const container = bsScrollContainerRef.current
    if (!container) return
    const timer = setTimeout(() => {
      const inputEl = numpadTarget === 'parlay'
        ? container.querySelector('input[data-vaul-no-drag]')
        : inputRefs.current[numpadTarget]
      if (!inputEl) return
      const cr = container.getBoundingClientRect()
      const ir = inputEl.getBoundingClientRect()
      if (ir.bottom > cr.bottom - 10) {
        container.scrollBy({ top: ir.bottom - cr.bottom + 30, behavior: 'smooth' })
      } else if (ir.top < cr.top + 10) {
        container.scrollBy({ top: ir.top - cr.top - 30, behavior: 'smooth' })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [isMobile, numpadTarget])

  useEffect(() => {
    const prevLength = previousBetsLengthRef.current
    const newLength = bets.length
    if (newLength > prevLength && betslipMinimized && !isMobile) {
      setNudgeKey(prev => prev + 1)
    }
    previousBetsLengthRef.current = newLength
  }, [bets.length, betslipMinimized, isMobile])

  // Betslip Views — pure render function (called directly, NOT as <Component/>)
  const renderBetslipDefault = () => {
    const isScrolled = bsIsScrolled
    const scrollContainerRef = bsScrollContainerRef

    // On mobile, don't show minimized state - just close
    // Minimized state - just header bar (desktop only)
    if (betslipMinimized && !isMobile) {
      return (
        <motion.div 
          key={`minimized-nudge-${nudgeKey}`}
          className="px-4 py-2 flex items-center justify-between border-b border-black/5"
          initial={{ y: 0 }}
          animate={nudgeKey > 0 ? {
            y: [0, -12, 0],
          } : {
            y: 0
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.5, 1]
          }}
          onAnimationStart={() => console.log('🎬 Drawer nudge animation started! Key:', nudgeKey)}
          onAnimationComplete={() => console.log('✅ Drawer nudge completed!')}
        >
          <div className="flex items-center gap-2">
            {bets.length > 0 && (
              <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-md">
                <span className="text-xs font-semibold text-white leading-none">{bets.length}</span>
              </div>
            )}
            <span className="text-sm font-semibold text-black">Betslip</span>
            {totalStake > 0 && (
              <span className="text-xs text-black/60">{currencySymbol}{totalStake.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setBetslipMinimized(false)
            }}
            className="text-[10px] font-semibold uppercase tracking-wide text-black/60 hover:text-black/80 flex items-center gap-1 px-2.5 py-1 rounded-md border border-black/20 hover:border-black/30 transition-colors"
          >
            <IconChevronUp className="w-3 h-3" />
            SHOW
          </button>
        </motion.div>
      )
    }
    // Expanded state
    return (
      <div className="flex flex-col w-full" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          maxHeight: isMobile
            ? ('calc(100dvh - 80px)')
            : 'calc(100vh - 170px)',
        }}
      >
        {/* Drag Handle - Mobile Only */}
        {isMobile && (
          <div className="flex justify-center pt-2 pb-0.5 shrink-0 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1 bg-black/20 rounded-full" />
          </div>
        )}
        {/* Header - Always visible at top - Glass effect when scrolled */}
        <div className="px-3 py-2.5 flex items-center justify-between border-b border-black/5" style={{ flexShrink: 0, flexGrow: 0, zIndex: 15, background: 'rgba(255,255,255,0.82)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}>
                <div className="flex items-center gap-2">
                  {bets.length > 0 && (
              <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-md">
                <span className="text-xs font-semibold text-white leading-none">{bets.length}</span>
                    </div>
                  )}
            <h2 className="text-sm font-semibold text-black/90">Betslip</h2>
                </div>
                {bets.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                if (isMobile) {
                  setBetslipOpen(false)
                  setBetslipManuallyClosed(true)
                } else {
                  setBetslipMinimized(true)
                }
              }}
              className="text-[10px] font-semibold uppercase tracking-wide text-black/60 hover:text-black/80 flex items-center gap-1 px-2.5 py-1 rounded-md border border-black/20 hover:border-black/30 transition-colors"
            >
              <IconChevronDown className="w-3 h-3" />
                  MINIMIZE
                  </button>
                )}
            </div>

        {/* Middle Section - Scrollable when content exceeds available space */}
            {bets.length === 0 ? (
          <div className="px-4 py-12 text-center flex-1 min-h-0 flex flex-col items-center justify-center" style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
            <div>
              <p className="text-sm text-black/70">Your betslip is empty</p>
              <p className="text-xs mt-2 text-black/50">Select odds to add bets</p>
                    </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setBetslipOpen(false)
                setBetslipMinimized(false)
                // On mobile, mark as manually closed
                if (isMobile) {
                  setBetslipManuallyClosed(true)
                }
              }}
              className="mt-6 px-4 py-2 text-xs font-medium text-black/70 hover:text-black border border-black/10 rounded hover:bg-black/5 transition-colors"
            >
              Close
            </button>
              </div>
            ) : (
          <div 
            ref={scrollContainerRef} 
            data-vaul-no-drag=""
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{ 
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto', 
              overflowX: 'hidden', 
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              overscrollBehavior: 'auto',
            }}
          >
              {/* Straight Bets - Scrollable list in middle section - Tighter, cleaner design */}
                {bets.length > 0 && (
                <div className="px-2" style={{ minHeight: 'fit-content' }}>
                  <div className="flex items-center justify-between mb-1.5 pt-2">
                    <div className="text-[10px] font-medium text-black/50 uppercase tracking-wide">
                      {hasMultipleGames ? `${bets.length} Selections` : 'Straight Bet'}
                    </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                        // Clear all bets - this will trigger re-render and clear highlighting
                        setBets([])
                        setParlayStake(0)
                        setLocalParlayStake('')
                        setLocalStakes({})
                        setNumpadTarget(null)
                        setBetslipOpen(false)
                        setBetslipMinimized(false)
                        // Reset manually closed flag so next first bet will open betslip
                        setBetslipManuallyClosed(false)
                        // Clear any inline styles from hover handlers on all odds buttons
                        // This ensures the red highlighting is cleared immediately
                        requestAnimationFrame(() => {
                          const oddsButtons = document.querySelectorAll('button[data-event-id]')
                          oddsButtons.forEach((button) => {
                            const el = button as HTMLElement
                            // Clear inline background color to let className take over
                            el.style.backgroundColor = ''
                          })
                        })
                      }}
                      className="text-[10px] font-medium text-red-400 hover:text-red-500 uppercase tracking-wide px-2 py-0.5 rounded border border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      Remove All
                  </button>
              </div>
                  {/* New bets appear at top (reversed array order) */}
                  <AnimatePresence initial={false}>
                  {[...bets].reverse().map((bet, index) => {
                const event = liveEvents.find(e => e.id === bet.eventId) || upcomingEvents.find(e => e.id === bet.eventId)
                // Helper to convert odds to decimal multiplier
                const oddsToDecimal = (oddsStr: string): number => {
                  const cleaned = oddsStr.replace('+', '').trim()
                  const oddsValue = parseFloat(cleaned)
                  if (oddsStr.startsWith('+') || (oddsValue < 2.0 && oddsValue > 0)) {
                    return oddsValue / 100 + 1
                  } else {
                    return oddsValue
                  }
                }
                const decimalMultiplier = oddsToDecimal(bet.odds)
                // Use local stake value if typing, otherwise use bet.stake
                const currentStake = localStakes[bet.id] !== undefined 
                  ? (localStakes[bet.id] === '' || localStakes[bet.id] === '.' ? 0 : parseFloat(localStakes[bet.id]) || 0)
                  : bet.stake
                const toWin = currentStake * decimalMultiplier - currentStake

                return (
                  <motion.div
                    key={bet.id}
                    initial={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto', marginBottom: 6, transition: { type: 'spring', stiffness: 500, damping: 35, mass: 0.8 } }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
                    className="relative overflow-hidden rounded-lg"
                    onTouchStart={(e) => {
                      const touch = e.touches[0]
                      const el = e.currentTarget
                      el.dataset.startX = touch.clientX.toString()
                      el.dataset.startY = touch.clientY.toString()
                      el.dataset.swiping = 'false'
                    }}
                    onTouchMove={(e) => {
                      const el = e.currentTarget
                      const startX = parseFloat(el.dataset.startX || '0')
                      const startY = parseFloat(el.dataset.startY || '0')
                      const touch = e.touches[0]
                      const dx = touch.clientX - startX
                      const dy = touch.clientY - startY
                      // Only activate horizontal swipe if more horizontal than vertical
                      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                        el.dataset.swiping = 'true'
                        e.stopPropagation()
                        const inner = el.querySelector('[data-bet-inner]') as HTMLElement
                        const reveal = el.querySelector('[data-bet-remove]') as HTMLElement
                        if (inner && dx < 0) {
                          const clamped = Math.max(dx, -100)
                          inner.style.transform = `translateX(${clamped}px)`
                          inner.style.transition = 'none'
                          if (reveal) reveal.style.opacity = `${Math.min(1, Math.abs(dx) / 60)}`
                        }
                      }
                    }}
                    onTouchEnd={(e) => {
                      const el = e.currentTarget
                      const startX = parseFloat(el.dataset.startX || '0')
                      const touch = e.changedTouches[0]
                      const dx = touch.clientX - startX
                      const inner = el.querySelector('[data-bet-inner]') as HTMLElement
                      const reveal = el.querySelector('[data-bet-remove]') as HTMLElement
                      if (inner) {
                        if (dx < -70) {
                          // Swipe far enough — remove the bet
                          inner.style.transition = 'transform 0.2s ease-out'
                          inner.style.transform = 'translateX(-100%)'
                          setTimeout(() => removeBet(bet.id), 200)
                        } else {
                          // Snap back
                          inner.style.transition = 'transform 0.2s ease-out'
                          inner.style.transform = 'translateX(0)'
                          if (reveal) { reveal.style.transition = 'opacity 0.2s'; reveal.style.opacity = '0' }
                        }
                      }
                    }}
                  >
                    {/* Red delete reveal behind */}
                    {isMobile && (
                      <div data-bet-remove="" className="absolute inset-0 flex items-center justify-end px-4 bg-red-500 rounded" style={{ opacity: 0 }}>
                        <IconTrash className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div data-bet-inner="" className="flex items-start gap-2.5 py-2.5 px-2.5 bg-[#f5f5f5] rounded-lg border border-black/[0.04] relative" style={{ zIndex: 1 }}>
                    {/* Remove Button - Smaller, more subtle */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeBet(bet.id)
                      }}
                      className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center hover:bg-black/5 rounded"
                    >
                      <IconX className="w-3 h-3 text-black/50" strokeWidth={2.5} />
                    </button>

                    {/* Bet Info - Tighter spacing */}
                    <div className="flex-1 min-w-0 pr-1.5">
                      {bet.marketTitle === 'Same Game Parlay' ? (
                        <>
                          <div className="text-[10px] font-semibold text-black/60 uppercase tracking-wide mb-0.5 leading-tight">SGP · {bet.selection.split(' + ').length} Legs</div>
                          <div className="text-[10px] text-black/40 mb-1.5 leading-tight">{bet.eventName}</div>
                          <div className="relative ml-[2px] mb-0.5">
                            <div className="absolute left-[2px] top-[4px] bottom-[4px] w-[1px] bg-black/15" />
                            <div className="space-y-1.5">
                              {bet.selection.split(' + ').map((leg: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 relative">
                                  <div className="w-[5px] h-[5px] rounded-full bg-emerald-500 flex-shrink-0 relative z-10 ring-1 ring-emerald-500/20" />
                                  <span className="text-[11px] text-black/70 leading-tight">{leg}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : bet.marketTitle === 'Bet Boost' ? (
                        <>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide leading-tight">⚡ BOOST{bet.selection.includes(' & ') ? ` · ${bet.selection.split(' & ').length} Legs` : ''}</span>
                          </div>
                          {bet.selection.includes(' & ') ? (
                            <>
                              <div className="text-[10px] text-black/40 mb-1.5 leading-tight">{bet.eventName}</div>
                              <div className="relative ml-[2px] mb-0.5">
                                <div className="absolute left-[2px] top-[4px] bottom-[4px] w-[1px] bg-amber-300/40" />
                                <div className="space-y-1.5">
                                  {bet.selection.split(' & ').map((leg: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 relative">
                                      <div className="w-[5px] h-[5px] rounded-full bg-amber-500 flex-shrink-0 relative z-10 ring-1 ring-amber-500/20" />
                                      <span className="text-[11px] text-black/70 leading-tight">{leg.trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-xs font-medium text-black mb-0.5 truncate leading-tight">{bet.selection}</div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="text-xs font-medium text-black mb-0.5 truncate leading-tight">{bet.selection}</div>
                          <div className="text-[10px] text-black/50 mb-0.5 leading-tight">{bet.marketTitle}</div>
                          {event && (
                            <>
                              <div className="text-[10px] text-black/40 truncate leading-tight">{event.team1} v {event.team2}</div>
                              {('isLive' in event) && (event as any).isLive && liveScores[bet.eventId] && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <div className="flex items-center gap-0.5 bg-red-500/10 border border-red-500/20 rounded px-1 py-[1px]">
                                    <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-bold text-red-500 uppercase">Live</span>
                                  </div>
                                  <span className="text-[10px] font-semibold text-black/70">{liveScores[bet.eventId].team1} - {liveScores[bet.eventId].team2}</span>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>

                      {/* Odds badge */}
                    <div className="flex-shrink-0 bg-black/[0.06] rounded-md px-2 py-1 mr-1">
                          <span className="text-[11px] font-semibold text-black/80 whitespace-nowrap">{bet.odds}</span>
                        </div>

                    {/* Stake Input - Smaller, tighter */}
                    <div className="flex-shrink-0 w-[100px] min-w-[100px]">
                      <div className={cn("border rounded-lg h-[38px] flex items-center justify-end px-2 relative bg-white focus-within:border-[#97c43c] focus-within:ring-1 focus-within:ring-[#97c43c]/30 transition-all", numpadTarget === bet.id ? "border-[#97c43c] ring-1 ring-[#97c43c]/30" : "border-black/10")}>
                          <span className="absolute left-2 text-xs text-black/50 z-10">$</span>
                          <input
                            data-vaul-no-drag=""
                            ref={(el) => {
                              if (el) inputRefs.current[bet.id] = el
                            }}
                            type="text"
                            inputMode={isMobile ? "none" : "decimal"}
                            enterKeyHint={isMobile ? undefined : "done"}
                            autoComplete="off"
                            autoCorrect="off"
                            readOnly={isMobile}
                            onClick={() => {
                              if (isMobile) {
                                setNumpadTarget(bet.id)
                                if (localStakes[bet.id] === undefined) {
                                  setLocalStakes(prev => ({ ...prev, [bet.id]: bet.stake === 0 ? '' : bet.stake.toString() }))
                                }
                              }
                            }}
                            value={localStakes[bet.id] !== undefined ? localStakes[bet.id] : (bet.stake > 0 ? bet.stake.toString() : '')}
                            onChange={(e) => {
                              if (isMobile) return
                              const val = e.target.value.replace(/[^0-9.]/g, '')
                              if (val === '' || val === '.' || /^\d*\.?\d*$/.test(val)) {
                                setLocalStakes(prev => ({ ...prev, [bet.id]: val }))
                              }
                            }}
                            onPointerDown={(e) => {
                              if (isMobile) { e.preventDefault(); e.stopPropagation() }
                            }}
                            onFocus={(e) => {
                              if (isMobile) {
                                setNumpadTarget(bet.id)
                                if (localStakes[bet.id] === undefined) {
                                  setLocalStakes(prev => ({ ...prev, [bet.id]: bet.stake === 0 ? '' : bet.stake.toString() }))
                                }
                                e.target.blur()
                                return
                              }
                              focusedInputRef.current = bet.id
                              if (localStakes[bet.id] === undefined) {
                                setLocalStakes(prev => ({ ...prev, [bet.id]: bet.stake === 0 ? '' : bet.stake.toString() }))
                              }
                              e.target.select()
                            }}
                            onBlur={(e) => {
                              if (isMobile && numpadTargetRef.current) return
                              if (focusedInputRef.current === bet.id) {
                                focusedInputRef.current = null
                              }
                              const val = e.target.value
                              const num = val === '' || val === '.' ? 0 : parseFloat(val)
                              const finalVal = isNaN(num) || num < 0 ? 0 : num
                              updateBetStake(bet.id, finalVal)
                              setLocalStakes(prev => {
                                const next = { ...prev }
                                delete next[bet.id]
                                return next
                              })
                            }}
                            onWheel={(e) => {
                              e.stopPropagation()
                            }}
                            onTouchMove={(e) => {
                              e.stopPropagation()
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation()
                              // Prevent Enter from causing page scroll
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                e.currentTarget.blur()
                              }
                            }}
                            className="border-0 bg-transparent h-full p-0 pl-5 pr-1 text-right focus-visible:outline-none focus-visible:ring-0 text-black font-medium w-full overflow-visible placeholder:text-black/30 placeholder:font-normal"
                            placeholder="0.00"
                            style={{ fontSize: '16px', WebkitAppearance: 'none', MozAppearance: 'textfield' as any, minWidth: 0 }}
                          />

                      </div>
                      <div className="text-[9px] text-black/50 text-right mt-0.5 leading-tight">
                        To Win {currencySymbol}{toWin.toFixed(2)}
                      </div>
                    </div>
                    </div>
                  </motion.div>
                )
              })}
                  </AnimatePresence>
                </div>
              )}

              {/* Parlay Section - Only show if multiple games - Light grey card */}
              {hasParlay && (() => {
                // Use local parlay stake value if typing, otherwise use parlayStake
                const currentParlayStake = localParlayStake !== '' 
                  ? (localParlayStake === '.' ? 0 : parseFloat(localParlayStake) || 0)
                  : parlayStake
                const currentParlayPotentialWin = currentParlayStake * parlayOddsMultiplier - currentParlayStake
                
                return (
                <div className="px-2 pt-2">
                <div className="bg-[#f5f5f5] rounded px-2 py-2 -mx-2">
                <div className="text-[10px] font-medium text-black/50 uppercase tracking-wide mb-1.5">
                  {bets.length}-Pick Parlay
                </div>
                <div className="flex items-start gap-2 py-2">
                  {/* Parlay Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-black">
                      {bets.length} Legs
                    </div>
                  </div>

                  {/* Parlay Odds */}
                  <div className="flex-shrink-0 text-xs font-medium text-black mr-1.5">
                    {parlayOdds}
                  </div>

                  {/* Parlay Stake Input - Smaller */}
                  <div className="flex-shrink-0 w-[100px] min-w-[100px]">
                    <div className={cn("border rounded-lg h-[38px] flex items-center justify-end px-2 relative bg-white focus-within:border-[#97c43c] focus-within:ring-1 focus-within:ring-[#97c43c]/30 transition-all", numpadTarget === 'parlay' ? "border-[#97c43c] ring-1 ring-[#97c43c]/30" : "border-black/10")}>
                      <span className="absolute left-2 text-xs text-black/50 z-10">$</span>
                      <input
                        type="text"
                        inputMode={isMobile ? "none" : "decimal"}
                        enterKeyHint={isMobile ? undefined : "done"}
                        autoComplete="off"
                        autoCorrect="off"
                        readOnly={isMobile}
                        value={localParlayStake !== '' ? localParlayStake : (parlayStake > 0 ? parlayStake.toString() : '')}
                        onChange={(e) => {
                          if (isMobile) return
                          const val = e.target.value.replace(/[^0-9.]/g, '')
                          if (val === '' || val === '.' || /^\d*\.?\d*$/.test(val)) {
                            setLocalParlayStake(val)
                          }
                        }}
                        onPointerDown={(e) => {
                          if (isMobile) { e.preventDefault(); e.stopPropagation() }
                        }}
                        onClick={() => {
                          if (isMobile) {
                            setNumpadTarget('parlay')
                            if (localParlayStake === '') setLocalParlayStake(parlayStake > 0 ? parlayStake.toString() : '')
                          }
                        }}
                        onFocus={(e) => {
                          if (isMobile) {
                            setNumpadTarget('parlay')
                            if (localParlayStake === '') setLocalParlayStake(parlayStake > 0 ? parlayStake.toString() : '')
                            e.target.blur()
                            return
                          }
                          focusedInputRef.current = 'parlay'
                          if (localParlayStake === '') {
                            setLocalParlayStake('')
                          }
                          e.target.select()
                        }}
                        onBlur={(e) => {
                          if (isMobile && numpadTargetRef.current) return
                          if (focusedInputRef.current === 'parlay') {
                            focusedInputRef.current = null
                          }
                          const val = e.target.value
                          const num = val === '' || val === '.' ? 0 : parseFloat(val)
                          const finalVal = isNaN(num) || num < 0 ? 0 : num
                          setParlayStake(finalVal)
                          // Clear local state to sync with actual value
                          setLocalParlayStake('')
                        }}
                        onWheel={(e) => {
                          e.stopPropagation()
                        }}
                        onTouchMove={(e) => {
                          e.stopPropagation()
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation()
                          // Prevent Enter from causing page scroll
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            e.currentTarget.blur()
                          }
                        }}
                        className="border-0 bg-transparent h-full p-0 pl-5 pr-1 text-right focus-visible:outline-none focus-visible:ring-0 text-black font-medium w-full overflow-visible placeholder:text-black/30 placeholder:font-normal"
                        placeholder="0.00"
                        style={{ fontSize: '16px', WebkitAppearance: 'none', MozAppearance: 'textfield' as any, minWidth: 0 }}
                      />

                        </div>
                    <div className="text-[9px] text-black/50 text-right mt-0.5 leading-tight">
                      To Win {currencySymbol}{currentParlayPotentialWin.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                )
              })()}
          </div>
        )}
                
        {/* Summary and Place Bet - Always visible above keyboard */}
                {bets.length > 0 && (
          <div className="px-3 pt-2 pb-2 border-t border-white/10 shrink-0" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'saturate(180%) blur(30px)', WebkitBackdropFilter: 'saturate(180%) blur(30px)' }}>
                    <button
                      onClick={() => {
                        if (bets.length === 0 || totalStake === 0) return
                        
                        // Store bets for confirmation modal
                        const betsToPlace = [...bets]
                        
                        // Immediately place bets to My Bets
                        const newPlacedBets = betsToPlace.map(bet => ({
                          ...bet,
                          placedAt: new Date()
                        }))
                        setPlacedBets(prev => [...prev, ...newPlacedBets])
                        
                        // Increment alert count for My Bets tab immediately
                        setMyBetsAlertCount(prev => prev + betsToPlace.length)
                        
                        // Show notification immediately
                        setToastMessage(`Bet placed! ${betsToPlace.length} ${betsToPlace.length === 1 ? 'selection' : 'selections'} for ${currencySymbol}${totalStake.toFixed(2)}`)
                        setToastAction({
                          label: 'View My Bets',
                          onClick: () => {
                            setMyBetsAlertCount(0)
                            setShowMyBets?.(true)
                          }
                        })
                        setShowToast(true)
                        setTimeout(() => setShowToast(false), 3000)
                        
                        // Switch to confirmation view - keep drawer open
                        setPendingBets(betsToPlace)
                        setShowConfirmation(true)
                      }}
                      disabled={totalStake === 0}
                      className={cn(
                  "w-full py-3 rounded-lg transition-all flex flex-col items-center justify-center font-medium shadow-sm",
                        totalStake > 0 
                    ? "bg-[#97c43c] text-white hover:bg-[#7fa832] active:scale-[0.98]" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <span className="text-xs font-medium uppercase tracking-wide">
                        PLACE {currencySymbol}{totalStake.toFixed(2)} BET
                      </span>
                      <span className={cn(
                        "text-[10px] mt-0.5",
                        totalStake > 0 ? "text-white/90" : "text-gray-400"
                      )}>
                        To Win {currencySymbol}{totalPotentialWin.toFixed(2)}
                      </span>
                    </button>
                  </div>
                )}

        {/* Custom Number Pad - Mobile Only - Below Place Bet */}
        {isMobile && numpadTarget && (
          <BetslipNumberPad
            onDigit={handleNumpadDigit}
            onBackspace={handleNumpadBackspace}
            onDone={handleNumpadDone}
            onQuickAmount={handleQuickAmount}
          />
        )}

      </div>
    )
  }

  // View Switcher Component - Must be inside drawer context
  const BetslipViewSwitcher = () => {
    const { setView } = useFamilyDrawer()
    
    useEffect(() => {
      if (showConfirmation) {
        setView('confirmation')
      } else {
        setView('default')
      }
    }, [showConfirmation, setView])
    
    return null
  }

  // Confirmation View - Separate screen in betslip drawer
  const BetslipConfirmationView = () => {
    const { setView } = useFamilyDrawer()
    
    return (
      <div className="flex flex-col w-full bg-white" style={{ maxHeight: 'inherit', overflow: 'auto' }}>
        <div className="flex flex-col items-center justify-center px-6 py-6">
          {/* Success Icon */}
          <div className="mb-4">
            <div className="w-16 h-16 rounded-full bg-[#97c43c] flex items-center justify-center">
              <IconCheck className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>
          
          {/* Message */}
          <h3 className="text-lg font-semibold text-black text-center mb-6">
            Bet Placed Successfully
          </h3>
          
          {/* Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-sm mb-6">
            <button
              onClick={() => {
                setView('default')
                setShowConfirmation(false)
                setBets([])
                setParlayStake(0)
                setLocalParlayStake('')
                setLocalStakes({})
                setNumpadTarget(null)
                setBetslipOpen(false)
                setMyBetsAlertCount(0)
                setBetslipManuallyClosed(false)
                setShowMyBets?.(true)
              }}
              className="w-full py-3 px-4 border border-black/10 rounded text-sm font-medium text-black hover:bg-black/5 transition-colors"
            >
              GO TO MY BETS
            </button>
            <button
              onClick={() => {
                setView('default')
                setShowConfirmation(false)
                setBets([])
                setParlayStake(0)
                setLocalParlayStake('')
                setLocalStakes({})
                setNumpadTarget(null)
                setBetslipOpen(false)
                setBetslipManuallyClosed(false)
              }}
              className="w-full py-3 px-4 bg-red-500 rounded text-sm font-medium text-white hover:bg-red-600 transition-colors"
            >              DONE
            </button>
            {(() => {
              const [sharing, setSharing] = React.useState(false)
              const [shared, setShared] = React.useState(false)
              return (
                <button
                  disabled={sharing || shared}
                  onClick={() => {
                    if (pendingBets.length > 0 && !sharing && !shared) {
                      setSharing(true)
                      setTimeout(() => {
                        const { shareBetToChat } = useChatStore.getState()
                        shareBetToChat(pendingBets.map(b => ({
                          eventName: b.eventName,
                          selection: b.selection,
                          odds: b.odds,
                          stake: b.stake,
                        })))
                        setSharing(false)
                        setShared(true)
                      }, 1200)
                    }
                  }}
                  className={cn(
                    "w-full py-3 px-4 rounded text-sm font-medium transition-all flex items-center justify-center gap-2",
                    shared
                      ? "border border-emerald-500/50 bg-emerald-500/20 text-emerald-600 cursor-default"
                      : sharing
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 cursor-wait opacity-80"
                      : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                  )}
                >
                  {sharing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                      SHARING...
                    </>
                  ) : shared ? (
                    <>
                      <IconCheck className="w-4 h-4" />
                      SHARED TO CHAT ✓
                    </>
                  ) : (
                    <>
                      <IconMessageCircle2 className="w-4 h-4" />
                      SHARE TO CHAT
                    </>
                  )}
                </button>
              )
            })()}
          </div>
          
          {/* Re-use Selections */}
          <div className="text-center pt-4 border-t border-black/10 w-full max-w-sm">
            <p className="text-xs text-black/50 mb-2 leading-tight">
              Once this window is closed, your betslip will be cleared, or you can
            </p>
            <button
              onClick={() => {
                if (pendingBets.length > 0) {
                  setPlacedBets(prev => {
                    const newList = [...prev]
                    newList.splice(-pendingBets.length)
                    return newList
                  })
                  setMyBetsAlertCount(prev => Math.max(0, prev - pendingBets.length))
                  setBets([...pendingBets])
                }
                setView('default')
                setShowConfirmation(false)
              }}
              className="text-sm font-medium text-black hover:text-black/70 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              RE-USE SELECTIONS
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
          
        </div>
      </div>
    )
  }

  const betslipViews: ViewsRegistry = {
    default: () => <>{renderBetslipDefault()}</>,
    confirmation: BetslipConfirmationView,
  }

  return (
    <div className="flex w-full min-h-screen bg-[#1a1a1a]">
      {/* Sports Sidebar using shadcn component */}
      <Sidebar 
        collapsible="icon"
        variant="sidebar"
        mobileOverlay
        mobileNoDrag
        mobileBg="#2d2d2d"
        mobileOverlayClassName="!bg-black/30 !backdrop-blur-sm"
        className="!bg-[#2d2d2d] !border-r-0 text-white [&>div]:!bg-[#2d2d2d] !h-screen !top-0 !z-[102]"
      >
        {/* Sidebar Header — sticky, clean (both mobile and desktop) */}
        <SidebarHeader 
          className="px-4 h-16 flex items-center flex-shrink-0 overflow-hidden sticky top-0 z-20"
          style={{
            backdropFilter: isMobile ? 'none' : 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: isMobile ? 'none' : 'blur(16px) saturate(180%)',
            backgroundColor: isMobile ? '#2d2d2d' : 'rgba(45, 45, 45, 0.75)',
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button — right side (absolute so logo stays centred) */}
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
                  key="b-lockup-sports-desktop"
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
                  key="b-lockup-sports-mobile"
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
                  key="full-logo-sports"
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Full BETONLINE logo */}
                  <div className="h-5 w-[110px] flex-shrink-0">
                    <svg viewBox="0 0 640 86" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <g id="BETONLINE">
                        <path fillRule="evenodd" clipRule="evenodd" d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z" fill="#ee3536"/>
                        <path d="M120.693 85.7021V0.0993091H178.194V17.4781H140.558V33.6651H176.197V50.2494H140.658V68.0254H180.39V85.7021H120.693Z" fill="#ee3536"/>
                        <path d="M257.757 8.54042C261.251 5.16397 265.244 2.38337 269.736 0.0993091H185.781V17.776H209.939V85.7021H230.604V17.776H250.37C252.466 14.3995 254.962 11.321 257.757 8.54042Z" fill="#ee3536"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M313.761 3.47575C319.151 5.66051 323.843 8.63973 327.737 12.5127C331.63 16.3857 334.625 20.9538 336.821 26.1178C339.017 31.3811 340.115 37.0416 340.115 43.0993C340.115 49.1571 339.017 54.9169 336.821 60.0808C334.625 65.2448 331.63 69.8129 327.737 73.6859C323.843 77.4596 319.151 80.5381 313.761 82.7229C308.27 84.9076 302.28 86 295.891 86C289.403 86 283.413 84.9076 278.022 82.7229C272.631 80.5381 267.939 77.5589 264.046 73.6859C260.253 69.9122 257.158 65.2448 254.962 60.0808C252.766 54.8176 251.667 49.1571 251.667 43.0993C251.667 37.0416 252.766 31.2818 254.962 26.1178C257.158 20.9538 260.153 16.3857 264.046 12.5127C267.939 8.73903 272.631 5.66051 278.022 3.47575C283.513 1.291 289.502 0.198618 295.891 0.198618C302.38 0.198618 308.37 1.291 313.761 3.47575ZM324.642 55.3141C326.139 51.5404 326.838 47.3695 326.838 43.0993C326.838 38.8291 326.04 34.6582 324.642 30.8845C323.244 27.1109 321.148 23.7344 318.453 20.9538C315.757 18.1732 312.563 15.8891 308.769 14.2009C305.076 12.5127 300.783 11.7182 296.091 11.7182C291.399 11.7182 287.206 12.5127 283.413 14.2009C279.719 15.8891 276.425 18.1732 273.73 20.9538C271.134 23.7344 269.038 27.1109 267.54 30.8845C266.043 34.6582 265.344 38.8291 265.344 43.0993C265.344 47.3695 266.043 51.5404 267.54 55.3141C268.938 59.0878 271.034 62.4642 273.73 65.2448C276.425 68.0254 279.619 70.3095 283.413 71.9977C287.107 73.6859 291.399 74.4804 296.091 74.4804C300.783 74.4804 304.976 73.6859 308.769 71.9977C312.463 70.3095 315.757 68.0254 318.453 65.2448C321.048 62.4642 323.145 59.0878 324.642 55.3141Z" fill="white"/>
                        <path d="M437.847 0.0993091H425.069V85.6028H476.681V74.1824H437.847V0.0993091Z" fill="white"/>
                        <path d="M484.268 0.0993091H497.046V85.7021H484.268V0.0993091Z" fill="white"/>
                        <path d="M594.778 74.1824V48.2633H634.909V36.7436H594.778V11.6189H637.804V0.0993091H582V85.6028H640V74.1824H594.778Z" fill="white"/>
                        <path d="M347.802 0.0993091L405.403 56.903V0.0993091H417.482V85.6028L359.782 29.4942V85.6028H347.802V0.0993091Z" fill="white"/>
                        <path d="M562.333 57.3002L504.633 0.0993091V85.6028H516.712V29.8915L574.313 85.2055V0.0993091H562.333V57.3002Z" fill="white"/>
                      </g>
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </SidebarHeader>

        {/* Quick Links — mobile only, below logo, sticky */}
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
                { label: 'Sports', page: 'sports' as const },
                { label: 'Casino', page: 'casino' as const },
                { label: 'Poker', page: 'poker' as const },
                { label: 'VIP Rewards', page: 'vipRewards' as const },
                { label: 'Promotions', page: 'promotions' as const },
              ].map((item) => {
                const isCurrentPage =
                  item.page === 'sports' ||
                  false
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setOpenMobile(false)
                      if (item.page === 'home') {
                        router.push('/')
                      } else if (item.page === 'sports') {
                        // Already on sports
                      } else if (item.page === 'casino') {
                        router.push('/casino')
                      } else if (item.page === 'poker') {
                        router.push('/casino?poker=true')
                      } else if (item.page === 'vipRewards') {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('vip:open-drawer'))
                        }
                      } else if (item.page === 'promotions') {
                        router.push('/promotions')
                      }
                    }}
                    className={cn(
                      "flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative",
                      isCurrentPage 
                        ? "text-white font-bold" 
                        : "text-white/35 font-medium hover:text-white/60"
                    )}
                  >
                    {item.label}
                    {isCurrentPage && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }} />
                    )}
                  </button>
                )
              })}
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
                key="sports-other-dropdown"
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

        <SidebarContent className="overflow-y-auto overflow-x-hidden flex flex-col">
          <TooltipProvider>
                <SidebarPromos
                  collapsed={sidebarState === 'collapsed' && !isMobile}
                />
                <Separator className="bg-white/10 mx-2 group-data-[collapsible=icon]:hidden" />

            <SidebarGroup>
              <SidebarGroupLabel className="px-2 py-1 text-xs text-white/50">FEATURES</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sportsFeatures.map((item, index) => {
                    const IconComp = typeof item.icon === 'string' ? null : item.icon
                    return (
                      <SidebarMenuItem key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              isActive={item.label === 'My Bets' ? showMyBets : item.active}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleFeatureClick(item.label, (item as any).href)
                              }}
                              className={cn(
                                "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                "data-[active=true]:text-white data-[active=true]:font-medium",
                                "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5",
                              )}
                              style={(item.label === 'My Bets' ? showMyBets : item.active) ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                            >
                              <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", (item.label === 'My Bets' ? showMyBets : item.active) ? "bg-white/20" : "bg-white/10")}>
                                {typeof item.icon === 'string' ? <img src={item.icon} alt={item.label} className="w-4 h-4 object-contain" style={(item.label === 'Same Game Parlays' || (item.label === 'My Feed' && item.active)) ? { filter: 'brightness(0) invert(1)' } : undefined} /> : IconComp ? <IconComp strokeWidth={1.5} className="w-4 h-4" /> : null}
                              </div>
                              <span className="flex items-center gap-1.5">{item.label}{loadingItem === item.label && <IconLoader2 className="w-3 h-3 animate-spin" />}</span>
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

            <div className="border-b border-white/10 mx-3 my-1" />

            {/* Top Leagues Accordion */}
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
                            toggleSport('TopLeagues')
                          }}
                          className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                        >
                          <IconTrophy strokeWidth={1.5} className="w-5 h-5" />
                          <span>Top Leagues</span>
                          <IconChevronRight className={cn(
                            "w-4 h-4 ml-auto transition-transform duration-300",
                            expandedSports.includes('TopLeagues') && "rotate-90"
                          )} />
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {sidebarState === 'collapsed' && (
                        <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                          <p>Top Leagues</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <AnimatePresence>
                      {expandedSports.includes('TopLeagues') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <SidebarMenuSub>
                            {topLeaguesList.map((league, idx) => (
                              <SidebarMenuSubItem key={idx}>
                                <SidebarMenuSubButton
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    router.push(league.href)
                                  }}
                                  className="pl-4 text-xs text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <img src={league.icon} alt={league.label} width={16} height={16} className="object-contain" decoding="sync" />
                                    <span>{league.label}</span>
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

            <div className="border-b border-white/10 mx-3 my-1" />

            <SidebarGroup>
              <SidebarGroupLabel className="px-2 py-1 text-xs text-white/50">TOP SPORTS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sportsCategories.map((sport, index) => {
                    const IconComp = typeof sport.icon === 'string' ? null : sport.icon
                    const isActive = sport.active === true
                    const isExpanded = sport.expandable && expandedSports.includes(sport.label)
                    return (
                      <SidebarMenuItem key={index} className={sport.expandable ? "group/collapsible" : ""}>
                        {sport.expandable ? (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  isActive={isActive}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toggleSport(sport.label)
                                  }}
                                  className={cn(
                                    "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                    "data-[active=true]:text-white data-[active=true]:font-medium",
                                    "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                                  )}
                                  style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                                >
                                  {typeof sport.icon === 'string' ? <img src={sport.icon} alt={sport.label} className="w-5 h-5 object-contain" /> : IconComp ? <IconComp strokeWidth={1.5} className="w-5 h-5" /> : null}
                                  <span className="flex items-center gap-1.5">{sport.label}{loadingItem === sport.label && <IconLoader2 className="w-3 h-3 animate-spin" />}</span>
                                  <IconChevronRight className={cn(
                                    "w-4 h-4 ml-auto transition-transform duration-300",
                                    isExpanded && "rotate-90"
                                  )} />
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              {sidebarState === 'collapsed' && (
                                <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                                  <p>{sport.label}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                            <AnimatePresence>
                              {isExpanded && sport.subItems && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <SidebarMenuSub>
                                    {sport.subItems.map((subItem, subIndex) => {
                                      const hasSubItems = subItem.subItems && subItem.subItems.length > 0
                                      const isSubExpanded = hasSubItems && expandedSports.includes(`${sport.label}-${subItem.label}`)
                                      return (
                                      <SidebarMenuSubItem key={subIndex}>
                                          {hasSubItems ? (
                                            <>
                                        <SidebarMenuSubButton 
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                                  toggleSubSport(sport.label, subItem.label)
                                          }}
                                                className="pl-8 text-xs text-white/70 hover:text-white hover:bg-white/5 cursor-pointer flex items-center justify-between"
                                        >
                                                <div className="flex items-center gap-2">
                                                  {subItem.icon && <subItem.icon className="w-3 h-3" />}
                                          {subItem.label}
                                                </div>
                                                <IconChevronRight className={cn(
                                                  "w-3 h-3 transition-transform duration-300",
                                                  isSubExpanded && "rotate-90"
                                                )} />
                                              </SidebarMenuSubButton>
                                              <AnimatePresence>
                                                {isSubExpanded && subItem.subItems && (
                                                  <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                  >
                                                    <SidebarMenuSub>
                                                      {subItem.subItems.map((subSubItem, subSubIndex) => (
                                                        <SidebarMenuSubItem key={subSubIndex}>
                                                          <SidebarMenuSubButton 
                                                            onClick={(e) => {
                                                              e.preventDefault()
                                                              e.stopPropagation()
                                                              console.log('Sub-sub-item clicked:', subSubItem.label)
                                                            }}
                                                            className="pl-12 text-xs text-white/70 hover:text-white hover:bg-white/5 cursor-pointer flex items-center justify-between"
                                                          >
                                                            {subSubItem.label}
                                                            {subSubItem.badge && <subSubItem.badge className="w-3 h-3 text-yellow-400" />}
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                                    </SidebarMenuSub>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </>
                                          ) : (
                                            <SidebarMenuSubButton 
                                              onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                console.log('Sub-item clicked:', subItem.label)
                                              }}
                                              className="pl-8 text-xs text-white/70 hover:text-white hover:bg-white/5 cursor-pointer flex items-center justify-between"
                                            >
                                              <div className="flex items-center gap-2">
                                                {subItem.icon && <subItem.icon className="w-3 h-3" />}
                                                {subItem.label}
                                              </div>
                                              {subItem.badge && <subItem.badge className="w-3 h-3 text-yellow-400" />}
                                            </SidebarMenuSubButton>
                                          )}
                                        </SidebarMenuSubItem>
                                      )
                                    })}
                                  </SidebarMenuSub>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                isActive={isActive}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleSportClick(sport.label, (sport as any).href)
                                }}
                                className={cn(
                                  "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                  "data-[active=true]:text-white data-[active=true]:font-medium",
                                  "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                                )}
                                style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                              >
                                {typeof sport.icon === 'string' ? <img src={sport.icon} alt={sport.label} className="w-5 h-5 object-contain" /> : IconComp ? <IconComp strokeWidth={1.5} className="w-5 h-5" /> : null}
                                <span className="flex items-center gap-1.5">{sport.label}{loadingItem === sport.label && <IconLoader2 className="w-3 h-3 animate-spin" />}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {sidebarState === 'collapsed' && (
                              <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                                <p>{sport.label}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        )}
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="border-b border-white/10 mx-3 my-1" />

            {/* A-Z Sports */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 py-1 text-xs text-white/50">A-Z</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {azSports.map((sport, index) => {
                    const IconComp = typeof sport.icon === 'string' ? null : sport.icon
                    return (
                      <SidebarMenuItem key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setLoadingItem(sport.label)
                                router.push(sport.href)
                              }}
                              className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                            >
                              {typeof sport.icon === 'string' ? <img src={sport.icon} alt={sport.label} className="w-5 h-5 object-contain" /> : IconComp ? <IconComp strokeWidth={1.5} className="w-5 h-5" /> : null}
                              <span className="flex items-center gap-1.5">{sport.label}{loadingItem === sport.label && <IconLoader2 className="w-3 h-3 animate-spin" />}</span>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          {sidebarState === 'collapsed' && (
                            <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
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


          {/* Settings */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                          "text-white/70 hover:text-white hover:bg-white/5",
                          sportsbookSettingsOpen && "bg-white/5 text-white"
                        )}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false)
                            setTimeout(() => setSportsbookSettingsOpen(true), 300)
                          } else {
                            setSportsbookSettingsOpen(true)
                          }
                        }}
                      >
                        <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", sportsbookSettingsOpen ? "bg-white/20" : "bg-white/10")}>
                          <IconSettings strokeWidth={1.5} className="w-4 h-4" />
                        </div>
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {sidebarState === 'collapsed' && (
                      <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                        <p>Settings</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          </TooltipProvider>
        </SidebarContent>
      </Sidebar>

      {/* Settings Modal */}
      {sportsbookSettingsOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10002] flex items-center justify-center pt-[10px] md:pt-0" onClick={() => setSportsbookSettingsOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div 
            className="relative w-[85vw] max-w-sm bg-[#2d2d2d] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <IconSettings strokeWidth={1.5} className="w-4 h-4 text-white/70" />
                <span className="text-sm font-semibold text-white">Settings</span>
              </div>
              <button onClick={() => setSportsbookSettingsOpen(false)} className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {/* Odds Format */}
            <div className="p-3 border-b border-white/10">
              <p className="text-xs text-white/50 font-medium mb-2 uppercase tracking-wider">Odds Format</p>
              <div className="space-y-0.5">
                {(['American', 'Fractional', 'Decimal'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setOddsFormat(format)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-md text-sm transition-colors flex items-center gap-2",
                      oddsFormat === format
                        ? "text-white bg-white/5"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="w-4 flex-shrink-0">
                      {oddsFormat === format && <IconCheck className="w-3.5 h-3.5" />}
                    </span>
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Betslip Settings */}
            <div className="p-3 border-b border-white/10">
              <p className="text-xs text-white/50 font-medium mb-2 uppercase tracking-wider">Betslip Settings</p>
              <div className="space-y-0.5">
                {([
                  { value: 'dont_accept' as const, label: "Don't accept odds changes" },
                  { value: 'higher' as const, label: 'Accept higher odds' },
                  { value: 'any' as const, label: 'Accept any odds' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setBetslipOddsSetting(option.value)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-md text-sm transition-colors flex items-center gap-2",
                      betslipOddsSetting === option.value
                        ? "text-white bg-white/5"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="w-4 flex-shrink-0">
                      {betslipOddsSetting === option.value && <IconCheck className="w-3.5 h-3.5" />}
                    </span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Show Confirmation Toggle */}
            <div className="p-3">
              <button
                onClick={() => setShowBetConfirmation(!showBetConfirmation)}
                className="w-full flex items-center justify-between py-1"
              >
                <div
                  className={cn(
                    "relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0",
                    showBetConfirmation ? "bg-[var(--ds-primary,#ee3536)]" : "bg-white/20"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                      showBetConfirmation ? "translate-x-[22px]" : "translate-x-[3px]"
                    )}
                  />
                </div>
                <span className="text-sm text-white/70 ml-3">Show Confirmation</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* Main Content */}
      <SidebarInset className="bg-[#1a1a1a] text-white overflow-x-hidden" style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}>
        {showMyBets ? (
          <MyBetsContent 
            onBack={() => setShowMyBets?.(false)} 
            brandPrimary={brandPrimary}
            initialFilter={myBetsInitialFilter}
          />
        ) : (
        <div className={cn("pt-0 pb-4 overflow-x-hidden", isMobile ? "px-1" : "px-5")}>
          {/* Breadcrumbs - Baseball > Select Country > Select League */}
          <div className="flex items-center gap-2 mb-4 -mt-1">
            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onBack()
              }} 
              className="p-1 hover:bg-white/5 rounded cursor-pointer transition-colors"
            >
              <IconChevronLeft className="w-4 h-4 text-white/70" />
            </button>
            {/* Baseball */}
            <button 
              onClick={() => {
                setSelectedCountry(null)
                setSelectedSoccerLeague(null)
              }}
              className="text-sm text-white font-medium hover:text-white/80 cursor-pointer transition-colors"
            >
              Baseball
            </button>
            <span className="text-white/50">/</span>
            {/* Select Country */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="text-sm text-white/70 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {selectedCountry && (
                    <img 
                      src={`/flags/${soccerCountries.find(c => c.name === selectedCountry)?.code}.svg`} 
                      alt={selectedCountry} 
                      width={16} 
                      height={11} 
                      className="rounded-[2px] flex-shrink-0 object-cover"
                      decoding="sync"
                    />
                  )}
                  {selectedCountry || 'Select Country'}
                  <IconChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#2d2d2d] border-white/10 text-white max-h-[300px] overflow-y-auto">
                {soccerCountries.map((country) => (
                  <DropdownMenuItem 
                    key={country.name}
                    className={cn(
                      "hover:bg-white/5 cursor-pointer flex items-center gap-2",
                      selectedCountry === country.name ? "text-white bg-white/10" : "text-white/70 hover:text-white"
                    )}
                    onClick={() => {
                      setSelectedCountry(country.name)
                      setSelectedSoccerLeague(null)
                    }}
                  >
                    <img 
                      src={`/flags/${country.code}.svg`} 
                      alt={country.name} 
                      width={20} 
                      height={14} 
                      className="rounded-sm flex-shrink-0 object-cover"
                      decoding="sync"
                    />
                    {country.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-white/50">/</span>
            {/* Select League - disabled until country is selected */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={!selectedCountry}>
                <button 
                  className={cn(
                    "text-sm flex items-center gap-1 transition-colors",
                    selectedCountry 
                      ? "text-white/70 hover:text-white cursor-pointer" 
                      : "text-white/30 cursor-not-allowed"
                  )}
                >
                  {selectedSoccerLeague || 'Select League'}
                  <IconChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              {selectedCountry && (
                <DropdownMenuContent align="start" className="bg-[#2d2d2d] border-white/10 text-white">
                  {soccerCountries.find(c => c.name === selectedCountry)?.leagues.map((league) => (
                    <DropdownMenuItem 
                      key={league}
                      className={cn(
                        "hover:bg-white/5 cursor-pointer",
                        selectedSoccerLeague === league ? "text-white bg-white/10" : "text-white/70 hover:text-white"
                      )}
                      onClick={() => {
                        setSelectedSoccerLeague(league)
                        // Navigate to the league page
                        const leagueSlug = league.toLowerCase().replace(/\s+/g, '-')
                        router.push(`/sports/baseball/${leagueSlug}`)
                      }}
                    >
                      {league}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
          
          {/* Top Soccer Leagues Carousel */}
          <div className="mb-6">
            <div className="relative -mx-6" style={{ overflow: 'visible', position: 'relative', width: 'calc(100% + 3rem)', maxWidth: 'none' }}>
              <Carousel 
                setApi={(api) => {
                  setSoccerLeaguesCarouselApi(api)
                  if (api) {
                    api.on('select', () => {
                      setSoccerLeaguesCanScrollPrev(api.canScrollPrev())
                      setSoccerLeaguesCanScrollNext(api.canScrollNext())
                    })
                    api.on('init', () => {
                      setSoccerLeaguesCanScrollPrev(api.canScrollPrev())
                      setSoccerLeaguesCanScrollNext(api.canScrollNext())
                    })
                  }
                }}
                className="w-full relative" 
                opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
              >
                <CarouselContent className="ml-6 mr-0">
                  {topSoccerLeagues.map((league) => (
                    <CarouselItem key={league.id} className="pl-2 md:pl-3 basis-auto flex-shrink-0">
                      <div className="flex items-center gap-1 group/league">
                        <div
                          onClick={() => {
                            // Find matching country
                            const country = soccerCountries.find(c => c.leagues.includes(league.name))
                            if (country) {
                              setSelectedCountry(country.name)
                              setSelectedSoccerLeague(league.name)
                            }
                            const leagueSlug = league.name.toLowerCase().replace(/\s+/g, '-')
                            setLoadingLeague(league.name)
                            router.push(`/sports/baseball/${leagueSlug}`)
                          }}
                          className={cn("flex items-center gap-2.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all cursor-pointer", loadingLeague === league.name && "opacity-50 pointer-events-none")}
                        >
                          <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                            <img src={league.icon} alt={league.name} width={18} height={18} className="object-contain" decoding="sync" />
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-semibold text-white whitespace-nowrap flex items-center gap-1.5">{loadingLeague === league.name ? <><IconLoader2 className="w-3 h-3 animate-spin" /><span className="text-white/50">{league.name}</span></> : league.name}</div>
                            <div className="text-[10px] text-white/50">{league.country}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const slug = league.name.toLowerCase().replace(/\s+/g, '-')
                              toggleFavoriteLeague(slug)
                            }}
                            className={cn(
                              "ml-1 p-1 hover:bg-white/10 rounded-full transition-all",
                              favoriteLeagues.includes(league.name.toLowerCase().replace(/\s+/g, '-'))
                                ? "opacity-100"
                                : "opacity-100 md:opacity-0 md:group-hover/league:opacity-100"
                            )}
                            title={favoriteLeagues.includes(league.name.toLowerCase().replace(/\s+/g, '-')) ? 'Remove from My Feed' : 'Add to My Feed'}
                          >
                            <IconHeart 
                              className={cn(
                                "w-3.5 h-3.5 transition-all",
                                favoriteLeagues.includes(league.name.toLowerCase().replace(/\s+/g, '-'))
                                  ? "text-pink-500 fill-pink-500" 
                                  : "text-white/40"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          
            {/* Premier League Table - Removed for Soccer overview page */}
            <AnimatePresence>
              {false && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {/* Tabs Navigation */}
                  <div className="relative z-[10] border-b border-white/20 px-6">
                    <div className="flex gap-1">
                      {(['Table', 'Fixtures', 'Results', 'Stats'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setPremierLeagueActiveTab(tab)}
                          className={`px-4 py-3 text-xs font-semibold transition-colors relative ${
                            premierLeagueActiveTab === tab
                              ? 'text-white'
                              : 'text-white/60 hover:text-white/80'
                          }`}
                        >
                          {tab}
                          {premierLeagueActiveTab === tab && (
                            <motion.div
                              layoutId="premierLeagueTabIndicator"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                            />
                          )}
                        </button>
                      ))}
            </div>
            </div>
            
                  {/* Tab Content */}
                  <div className="relative z-[10] p-6">
                    {/* Table Tab */}
                    {premierLeagueActiveTab === 'Table' && (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-white/20">
                              <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">Pos</th>
                              <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">Team</th>
                              <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">{activeSport === 'Football' ? 'GP' : 'Pl'}</th>
                              <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">W</th>
                              {activeSport === 'Football' ? (
                                <>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">L</th>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">T</th>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">PF</th>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">PA</th>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">PD</th>
                                </>
                              ) : (
                                <>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">D</th>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">L</th>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">GF</th>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">GA</th>
                                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">GD</th>
                                </>
                              )}
                              <th className="text-center py-3 px-4 text-xs font-semibold text-white/70">Pts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(activeSport === 'Football' ? [
                              { pos: 1, team: 'Kansas City Chiefs', teamCode: 'KC', gp: 5, w: 5, l: 0, t: 0, pf: 142, pa: 98, pd: 44, pts: 10 },
                              { pos: 2, team: 'Buffalo Bills', teamCode: 'BUF', gp: 5, w: 4, l: 1, t: 0, pf: 135, pa: 89, pd: 46, pts: 8 },
                              { pos: 3, team: 'Dallas Cowboys', teamCode: 'DAL', gp: 5, w: 4, l: 1, t: 0, pf: 128, pa: 95, pd: 33, pts: 8 },
                              { pos: 4, team: 'San Francisco 49ers', teamCode: 'SF', gp: 5, w: 4, l: 1, t: 0, pf: 131, pa: 102, pd: 29, pts: 8 },
                              { pos: 5, team: 'Miami Dolphins', teamCode: 'MIA', gp: 5, w: 3, l: 2, t: 0, pf: 118, pa: 105, pd: 13, pts: 6 },
                              { pos: 6, team: 'Baltimore Ravens', teamCode: 'BAL', gp: 5, w: 3, l: 2, t: 0, pf: 125, pa: 112, pd: 13, pts: 6 },
                              { pos: 7, team: 'Philadelphia Eagles', teamCode: 'PHI', gp: 5, w: 3, l: 2, t: 0, pf: 122, pa: 108, pd: 14, pts: 6 },
                              { pos: 8, team: 'Seattle Seahawks', teamCode: 'SEA', gp: 5, w: 3, l: 2, t: 0, pf: 115, pa: 110, pd: 5, pts: 6 },
                              { pos: 9, team: 'Cincinnati Bengals', teamCode: 'CIN', gp: 5, w: 2, l: 3, t: 0, pf: 108, pa: 115, pd: -7, pts: 4 },
                              { pos: 10, team: 'New York Jets', teamCode: 'NYJ', gp: 5, w: 2, l: 3, t: 0, pf: 98, pa: 118, pd: -20, pts: 4 },
                              { pos: 11, team: 'Los Angeles Rams', teamCode: 'LAR', gp: 5, w: 2, l: 3, t: 0, pf: 105, pa: 122, pd: -17, pts: 4 },
                              { pos: 12, team: 'Arizona Cardinals', teamCode: 'ARI', gp: 5, w: 2, l: 3, t: 0, pf: 102, pa: 125, pd: -23, pts: 4 },
                              { pos: 13, team: 'Green Bay Packers', teamCode: 'GB', gp: 5, w: 2, l: 3, t: 0, pf: 95, pa: 128, pd: -33, pts: 4 },
                              { pos: 14, team: 'Chicago Bears', teamCode: 'CHI', gp: 5, w: 1, l: 4, t: 0, pf: 88, pa: 135, pd: -47, pts: 2 },
                              { pos: 15, team: 'Pittsburgh Steelers', teamCode: 'PIT', gp: 5, w: 1, l: 4, t: 0, pf: 85, pa: 142, pd: -57, pts: 2 },
                              { pos: 16, team: 'Cleveland Browns', teamCode: 'CLE', gp: 5, w: 1, l: 4, t: 0, pf: 82, pa: 148, pd: -66, pts: 2 },
                              { pos: 17, team: 'Denver Broncos', teamCode: 'DEN', gp: 5, w: 1, l: 4, t: 0, pf: 78, pa: 152, pd: -74, pts: 2 },
                              { pos: 18, team: 'Las Vegas Raiders', teamCode: 'LV', gp: 5, w: 0, l: 5, t: 0, pf: 75, pa: 158, pd: -83, pts: 0 },
                            ] : [
                              { pos: 1, team: 'Liverpool', pl: 4, w: 4, d: 0, l: 0, gf: 9, ga: 4, gd: 5, pts: 12 },
                              { pos: 2, team: 'Arsenal', pl: 4, w: 3, d: 0, l: 1, gf: 9, ga: 1, gd: 8, pts: 9 },
                              { pos: 3, team: 'Tottenham', pl: 4, w: 3, d: 0, l: 1, gf: 8, ga: 1, gd: 7, pts: 9 },
                              { pos: 4, team: 'Bournemouth', pl: 4, w: 3, d: 0, l: 1, gf: 6, ga: 5, gd: 1, pts: 9 },
                              { pos: 5, team: 'Chelsea', pl: 4, w: 2, d: 2, l: 0, gf: 9, ga: 3, gd: 6, pts: 8 },
                              { pos: 6, team: 'Everton', pl: 4, w: 2, d: 1, l: 1, gf: 5, ga: 3, gd: 2, pts: 7 },
                              { pos: 7, team: 'Sunderland', pl: 4, w: 2, d: 1, l: 1, gf: 5, ga: 3, gd: 2, pts: 7 },
                              { pos: 8, team: 'Manchester City', pl: 4, w: 2, d: 0, l: 2, gf: 8, ga: 4, gd: 4, pts: 6 },
                              { pos: 9, team: 'Crystal Palace', pl: 4, w: 1, d: 3, l: 0, gf: 4, ga: 1, gd: 3, pts: 6 },
                              { pos: 10, team: 'Newcastle', pl: 4, w: 1, d: 2, l: 1, gf: 3, ga: 3, gd: 0, pts: 5 },
                              { pos: 11, team: 'Fulham', pl: 4, w: 1, d: 2, l: 1, gf: 3, ga: 4, gd: -1, pts: 5 },
                              { pos: 12, team: 'Brentford', pl: 4, w: 1, d: 1, l: 2, gf: 5, ga: 7, gd: -2, pts: 4 },
                              { pos: 13, team: 'Brighton', pl: 4, w: 1, d: 1, l: 2, gf: 4, ga: 6, gd: -2, pts: 4 },
                              { pos: 14, team: 'Manchester United', pl: 4, w: 1, d: 1, l: 2, gf: 4, ga: 7, gd: -3, pts: 4 },
                              { pos: 15, team: 'Nottingham Forest', pl: 4, w: 1, d: 1, l: 2, gf: 4, ga: 8, gd: -4, pts: 4 },
                              { pos: 16, team: 'Leeds United', pl: 4, w: 1, d: 1, l: 2, gf: 1, ga: 6, gd: -5, pts: 4 },
                              { pos: 17, team: 'Burnley', pl: 4, w: 1, d: 0, l: 3, gf: 4, ga: 7, gd: -3, pts: 3 },
                              { pos: 18, team: 'West Ham United', pl: 4, w: 1, d: 0, l: 3, gf: 4, ga: 11, gd: -7, pts: 3 },
                              { pos: 19, team: 'Aston Villa', pl: 4, w: 0, d: 2, l: 2, gf: 2, ga: 6, gd: -4, pts: 2 },
                              { pos: 20, team: 'Wolves', pl: 4, w: 0, d: 0, l: 4, gf: 2, ga: 9, gd: -7, pts: 0 },
                            ]).map((row) => {
                              const getTeamLogo = (teamName: string, teamCode?: string) => {
                                if (activeSport === 'Football' && teamCode) {
                                  const TeamIcon = (NFLIcons as any)[teamCode]
                                  return TeamIcon ? <TeamIcon size={20} /> : null
                                } else {
                                  const teamLogoMap: { [key: string]: string } = {
                                    'Liverpool': '/team/Liverpool FC.png',
                                    'Arsenal': '/team/Arsenal FC.png',
                                    'Tottenham': '/team/Tottenham Hotspur.png',
                                    'Bournemouth': '/team/AFC Bournemouth.png',
                                    'Chelsea': '/team/Chelsea FC.png',
                                    'Everton': '/team/Everton FC.png',
                                    'Sunderland': '/team/Sunderland AFC.png',
                                    'Manchester City': '/team/Manchester City.png',
                                    'Crystal Palace': '/team/Crystal Palace.png',
                                    'Newcastle': '/team/Newcastle United.png',
                                    'Fulham': '/team/Fulham FC.png',
                                    'Brentford': '/team/Brentford FC.png',
                                    'Brighton': '/team/Brighton & Hove Albion.png',
                                    'Manchester United': '/team/Manchester United.png',
                                    'Nottingham Forest': '/team/Nottingham Forest FC.png',
                                    'Leeds United': '/team/Leeds United.png',
                                    'Burnley': '/team/Burnley FC.png',
                                    'West Ham United': '/team/West Ham United.png',
                                    'Aston Villa': '/team/Aston Villa.png',
                                    'Wolves': '/team/Wolverhampton Wanderers.png',
                                  }
                                  const logoPath = teamLogoMap[teamName]
                                  return logoPath ? (
                          <img 
                                      src={logoPath}
                                      alt={teamName}
                                      width={20}
                                      height={20}
                            className="object-contain"
                            decoding="sync"
                            onError={(e) => { const t = e.currentTarget; t.style.display = 'none'; const s = document.createElement('div'); s.className = 'w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0'; s.innerHTML = '<span class="text-[8px] font-bold text-white">' + teamName.split(' ').map((w: string) => w[0]).join('').slice(0, 3) + '</span>'; t.parentElement?.insertBefore(s, t); }}
                          />
                                  ) : null
                                }
                              }
                              
                              return (
                                <tr key={row.pos} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                  <td className="py-3 px-4 text-xs font-bold text-white">{row.pos}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      {getTeamLogo(row.team, (row as any).teamCode)}
                                      <span className="text-xs font-semibold text-white">{row.team}</span>
                  </div>
                                  </td>
                                  <td className="py-3 px-4 text-center text-xs text-white/70">{activeSport === 'Football' ? (row as any).gp : (row as any).pl}</td>
                                  <td className="py-3 px-4 text-center text-xs text-white/70">{row.w}</td>
                                  {activeSport === 'Football' ? (
                                    <>
                                      <td className="py-3 px-4 text-center text-xs text-white/70">{(row as any).l}</td>
                                      <td className="py-3 px-4 text-center text-xs text-white/70">{(row as any).t}</td>
                                      <td className="py-3 px-4 text-center text-xs text-white/70">{(row as any).pf}</td>
                                      <td className="py-3 px-4 text-center text-xs text-white/70">{(row as any).pa}</td>
                                      <td className="py-3 px-4 text-center text-xs font-semibold text-white">{(row as any).pd > 0 ? `+${(row as any).pd}` : (row as any).pd}</td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="py-3 px-4 text-center text-xs text-white/70">{(row as any).d}</td>
                                      <td className="py-3 px-4 text-center text-xs text-white/70">{(row as any).l}</td>
                                      <td className="py-3 px-4 text-center text-xs text-white/70">{(row as any).gf}</td>
                                      <td className="py-3 px-4 text-center text-xs text-white/70">{(row as any).ga}</td>
                                      <td className="py-3 px-4 text-center text-xs font-semibold text-white">{(row as any).gd > 0 ? `+${(row as any).gd}` : (row as any).gd}</td>
                                    </>
                                  )}
                                  <td className="py-3 px-4 text-center text-xs font-bold text-white">{row.pts}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                  </div>
                    )}

                    {/* Fixtures Tab */}
                    {premierLeagueActiveTab === 'Fixtures' && (
                      <div className="space-y-3">
                        <div className="text-center py-8 text-white/60 text-sm">
                          Upcoming fixtures will be displayed here
                        </div>
                        {/* Placeholder fixtures */}
                        {[
                          { home: 'Liverpool', away: 'Arsenal', date: 'Sat, Feb 10', time: '15:00' },
                          { home: 'Manchester City', away: 'Chelsea', date: 'Sat, Feb 10', time: '17:30' },
                          { home: 'Tottenham', away: 'Newcastle', date: 'Sun, Feb 11', time: '14:00' },
                        ].map((fixture, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-right flex-1">
                                <div className="text-sm font-semibold text-white">{fixture.home}</div>
                      </div>
                              <div className="text-xs text-white/60 px-4">
                                <div>{fixture.date}</div>
                                <div>{fixture.time}</div>
                        </div>
                              <div className="text-left flex-1">
                                <div className="text-sm font-semibold text-white">{fixture.away}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Results Tab */}
                    {premierLeagueActiveTab === 'Results' && (
                      <div className="space-y-3">
                        <div className="text-center py-8 text-white/60 text-sm">
                          Recent results will be displayed here
                        </div>
                        {/* Placeholder results */}
                        {[
                          { home: 'Liverpool', homeScore: 2, awayScore: 1, away: 'Arsenal', date: 'Sat, Feb 3' },
                          { home: 'Manchester City', homeScore: 3, awayScore: 0, away: 'Chelsea', date: 'Sat, Feb 3' },
                          { home: 'Tottenham', homeScore: 1, awayScore: 1, away: 'Newcastle', date: 'Sun, Feb 4' },
                        ].map((result, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-right flex-1">
                                <div className="text-sm font-semibold text-white">{result.home}</div>
                              </div>
                              <div className="text-sm font-bold text-white px-4">
                                {result.homeScore} - {result.awayScore}
                              </div>
                              <div className="text-left flex-1">
                                <div className="text-sm font-semibold text-white">{result.away}</div>
                              </div>
                              <div className="text-xs text-white/60 ml-4">
                                {result.date}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stats Tab */}
                    {premierLeagueActiveTab === 'Stats' && (
                      <div className="space-y-4">
                        <div className="text-center py-8 text-white/60 text-sm">
                          League statistics will be displayed here
                        </div>
                        {/* Placeholder stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-xs text-white/60 mb-2">Top Scorer</div>
                            <div className="text-sm font-semibold text-white">Mohamed Salah</div>
                            <div className="text-xs text-white/60 mt-1">9 goals</div>
                      </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-xs text-white/60 mb-2">Most Assists</div>
                            <div className="text-sm font-semibold text-white">Kevin De Bruyne</div>
                            <div className="text-xs text-white/60 mt-1">6 assists</div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-xs text-white/60 mb-2">Clean Sheets</div>
                            <div className="text-sm font-semibold text-white">Arsenal</div>
                            <div className="text-xs text-white/60 mt-1">3 clean sheets</div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-xs text-white/60 mb-2">Avg Goals/Game</div>
                            <div className="text-sm font-semibold text-white">2.5</div>
                            <div className="text-xs text-white/60 mt-1">80 goals in 32 games</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          
          {/* Top Events Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white pl-2">Top Events</h2>
              <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                  className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small whitespace-nowrap transition-colors duration-300"
                  onClick={() => {
                    router.push('/sports/baseball/mlb')
                  }}
              >
                View All
              </Button>
                {!isMobile && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (topEventsCarouselApi) {
                          const currentIndex = topEventsCarouselApi.selectedScrollSnap()
                          const targetIndex = Math.max(0, currentIndex - 2)
                          topEventsCarouselApi.scrollTo(targetIndex)
                        }
                      }}
                      disabled={!topEventsCarouselApi || !topEventsCanScrollPrev}
                    >
                      <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (topEventsCarouselApi) {
                          const currentIndex = topEventsCarouselApi.selectedScrollSnap()
                          const slideCount = topEventsCarouselApi.scrollSnapList().length
                          const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                          topEventsCarouselApi.scrollTo(targetIndex)
                        }
                      }}
                      disabled={!topEventsCarouselApi || !topEventsCanScrollNext}
                    >
                      <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </>
                )}
                  </div>
                </div>
            
            <div className="relative -mx-6" style={{ overflow: 'visible', position: 'relative', width: 'calc(100% + 3rem)', maxWidth: 'none', boxSizing: 'border-box', minWidth: 0 }}>
              <Carousel setApi={setTopEventsCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                <CarouselContent className="ml-6 mr-0">
                  {/* Dynamic Top Events - Baseball */}
                  {([
                    { id: 4, team1: 'New York Yankees', team2: 'Boston Red Sox', score: '3 - 2', team1Code: 'NYY', team2Code: 'BOS', team1Percent: 55, team2Percent: 45, time: 'T5', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 5, team1: 'Los Angeles Dodgers', team2: 'San Francisco Giants', score: '4 - 1', team1Code: 'LAD', team2Code: 'SF', team1Percent: 68, team2Percent: 32, time: 'B6', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 6, team1: 'Houston Astros', team2: 'Texas Rangers', score: '2 - 2', team1Code: 'HOU', team2Code: 'TEX', team1Percent: 52, team2Percent: 48, time: 'T4', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 7, team1: 'Atlanta Braves', team2: 'Philadelphia Phillies', score: '5 - 3', team1Code: 'ATL', team2Code: 'PHI', team1Percent: 62, team2Percent: 38, time: 'B7', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 8, team1: 'Chicago Cubs', team2: 'St. Louis Cardinals', score: '1 - 0', team1Code: 'CHC', team2Code: 'STL', team1Percent: 58, team2Percent: 42, time: 'T3', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 9, team1: 'San Diego Padres', team2: 'Arizona Diamondbacks', score: '6 - 4', team1Code: 'SD', team2Code: 'ARI', team1Percent: 65, team2Percent: 35, time: 'B8', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 10, team1: 'Cleveland Guardians', team2: 'Detroit Tigers', score: '3 - 1', team1Code: 'CLE', team2Code: 'DET', team1Percent: 60, team2Percent: 40, time: 'T6', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 11, team1: 'Seattle Mariners', team2: 'Oakland Athletics', score: '2 - 0', team1Code: 'SEA', team2Code: 'OAK', team1Percent: 72, team2Percent: 28, time: 'B5', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 12, team1: 'Minnesota Twins', team2: 'Chicago White Sox', score: '7 - 3', team1Code: 'MIN', team2Code: 'CWS', team1Percent: 78, team2Percent: 22, time: 'T8', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                  ]).map((event) => (
                    <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                      <div className="w-[320px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(238, 53, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                        {/* Header: League info and Live status */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <img 
                              src={event.leagueIcon} 
                              alt={event.league}
                              width={16}
                              height={16}
                              className="object-contain"
                              decoding="sync"
                            />
                            <span className="text-[10px] text-white">{event.league} | {event.country}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5 whitespace-nowrap">
                              <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse"></div>
                              <span className="text-[9px] font-semibold text-[#ee3536]">LIVE</span>
                            </div>
                            <span className="text-[10px] text-[#ee3536]">{event.time}</span>
                          </div>
                        </div>
                        
                        {/* Teams and Score */}
                        <div className="flex items-center mb-3">
                          {/* Team 1 */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {(() => {
                              const mlbCodeMap: { [key: string]: string } = {
                                'Arizona Diamondbacks': 'ARI', 'Atlanta Braves': 'ATL', 'Baltimore Orioles': 'BAL',
                                'Boston Red Sox': 'BOS', 'Chicago Cubs': 'CHC', 'Chicago White Sox': 'CHW',
                                'Cincinnati Reds': 'CIN', 'Cleveland Guardians': 'CLE', 'Colorado Rockies': 'COL',
                                'Detroit Tigers': 'DET', 'Houston Astros': 'HOU', 'Kansas City Royals': 'KAN',
                                'Los Angeles Angels': 'LAA', 'Los Angeles Dodgers': 'LAD', 'Miami Marlins': 'MIA',
                                'Milwaukee Brewers': 'MIL', 'Minnesota Twins': 'MIN', 'New York Mets': 'NYM',
                                'New York Yankees': 'NYY', 'Oakland Athletics': 'OAK', 'Philadelphia Phillies': 'PHI',
                                'Pittsburgh Pirates': 'PIT', 'San Diego Padres': 'SD', 'San Francisco Giants': 'SF',
                                'Seattle Mariners': 'SEA', 'St. Louis Cardinals': 'STL', 'Tampa Bay Rays': 'TB',
                                'Texas Rangers': 'TEX', 'Toronto Blue Jays': 'TOR', 'Washington Nationals': 'WAS',
                              }
                              const mlbCode = mlbCodeMap[event.team1]
                              if (mlbCode) {
                                const MLBIcon = (MLBIcons as any)[mlbCode]
                                if (MLBIcon) return <MLBIcon size={20} />
                              }
                              return <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><span className="text-[8px] font-bold text-white">{event.team1Code}</span></div>
                            })()}
                            <span className="text-xs font-semibold text-white truncate">{event.team1}</span>
                          </div>
                          
                          {/* Score */}
                          {(() => {
                            // Parse score string (e.g., "1 - 0" or "2 - 1")
                            const parseScore = (scoreStr: string) => {
                              const parts = scoreStr.split(' - ')
                              return {
                                team1: parseInt(parts[0]) || 0,
                                team2: parseInt(parts[1]) || 0
                              }
                            }
                            
                            const initialScore = parseScore(event.score)
                            const currentScore = topEventsScores[event.id] || initialScore
                            const isAnimatingTeam1 = currentScore?.animating?.team === 1
                            const isAnimatingTeam2 = currentScore?.animating?.team === 2
                            
                            // Animated Score Component for Top Events
                            const TopEventsAnimatedScore = ({ value, isAnimating, from, to }: { value: number, isAnimating?: boolean, from?: number, to?: number }) => {
                              const [displayValue, setDisplayValue] = useState(value)
                              
                              useEffect(() => {
                                if (isAnimating && from !== undefined && to !== undefined) {
                                  // Animate the value smoothly using requestAnimationFrame
                                  const startValue = from
                                  const endValue = to
                                  const duration = 800
                                  const startTime = Date.now()
                                  
                                  const animate = () => {
                                    const elapsed = Date.now() - startTime
                                    const progress = Math.min(elapsed / duration, 1)
                                    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
                                    const currentValue = Math.round(startValue + (endValue - startValue) * easeOutCubic)
                                    setDisplayValue(currentValue)
                                    
                                    if (progress < 1) {
                                      requestAnimationFrame(animate)
                                    } else {
                                      setDisplayValue(endValue)
                                    }
                                  }
                                  requestAnimationFrame(animate)
                                } else {
                                  setDisplayValue(value)
                                }
                              }, [value, isAnimating, from, to])
                              
                              // Use NumberFlow with the animated displayValue
                              return (
                                <motion.div
                                  key={displayValue}
                                  initial={isAnimating ? { scale: 1.2 } : false}
                                  animate={isAnimating ? { scale: 1 } : {}}
                                  transition={{ duration: 0.4, ease: 'easeOut' }}
                                  className="text-[10px] font-bold text-white leading-none"
                                >
                                  <NumberFlow value={displayValue} />
                                </motion.div>
                              )
                            }
                            
                            return (
                              <div className="flex items-center justify-center mx-3 flex-shrink-0 gap-1">
                                <motion.div 
                          className={cn(
                                    "border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-white/5 border-white/10 transition-all duration-500",
                                    isAnimatingTeam1 
                                      ? "bg-green-500/30 border-green-500/50 shadow-lg shadow-green-500/20" 
                                      : ""
                                  )}
                                  animate={isAnimatingTeam1 ? { 
                                    scale: [1, 1.1, 1],
                                    boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0)"]
                                  } : {}}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                >
                                  <TopEventsAnimatedScore 
                                    value={currentScore.team1} 
                                    isAnimating={isAnimatingTeam1}
                                    from={currentScore.animating?.team === 1 ? currentScore.animating.from : undefined}
                                    to={currentScore.animating?.team === 1 ? currentScore.animating.to : undefined}
                                  />
                                </motion.div>
                                <span className="text-base font-bold text-white leading-none">-</span>
                                <motion.div 
                          className={cn(
                                    "border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-white/5 border-white/10 transition-all duration-500",
                                    isAnimatingTeam2 
                                      ? "bg-green-500/30 border-green-500/50 shadow-lg shadow-green-500/20" 
                                      : ""
                                  )}
                                  animate={isAnimatingTeam2 ? { 
                                    scale: [1, 1.1, 1],
                                    boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0)"]
                                  } : {}}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                >
                                  <TopEventsAnimatedScore 
                                    value={currentScore.team2} 
                                    isAnimating={isAnimatingTeam2}
                                    from={currentScore.animating?.team === 2 ? currentScore.animating.from : undefined}
                                    to={currentScore.animating?.team === 2 ? currentScore.animating.to : undefined}
                                  />
                                </motion.div>
                          </div>
                            )
                          })()}
                          
                          {/* Team 2 */}
                          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                            <span className="text-xs font-semibold text-white truncate">{event.team2}</span>
                            {(() => {
                              const mlbCodeMap: { [key: string]: string } = {
                                'Arizona Diamondbacks': 'ARI', 'Atlanta Braves': 'ATL', 'Baltimore Orioles': 'BAL',
                                'Boston Red Sox': 'BOS', 'Chicago Cubs': 'CHC', 'Chicago White Sox': 'CHW',
                                'Cincinnati Reds': 'CIN', 'Cleveland Guardians': 'CLE', 'Colorado Rockies': 'COL',
                                'Detroit Tigers': 'DET', 'Houston Astros': 'HOU', 'Kansas City Royals': 'KAN',
                                'Los Angeles Angels': 'LAA', 'Los Angeles Dodgers': 'LAD', 'Miami Marlins': 'MIA',
                                'Milwaukee Brewers': 'MIL', 'Minnesota Twins': 'MIN', 'New York Mets': 'NYM',
                                'New York Yankees': 'NYY', 'Oakland Athletics': 'OAK', 'Philadelphia Phillies': 'PHI',
                                'Pittsburgh Pirates': 'PIT', 'San Diego Padres': 'SD', 'San Francisco Giants': 'SF',
                                'Seattle Mariners': 'SEA', 'St. Louis Cardinals': 'STL', 'Tampa Bay Rays': 'TB',
                                'Texas Rangers': 'TEX', 'Toronto Blue Jays': 'TOR', 'Washington Nationals': 'WAS',
                              }
                              const mlbCode = mlbCodeMap[event.team2]
                              if (mlbCode) {
                                const MLBIcon = (MLBIcons as any)[mlbCode]
                                if (MLBIcon) return <MLBIcon size={20} />
                              }
                              return <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><span className="text-[8px] font-bold text-white">{event.team2Code}</span></div>
                            })()}
                          </div>
                        </div>
                        
                        {/* Moneyline Betting Buttons */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <button 
                            data-event-id={event.id}
                            data-event-name={`${event.team1} v ${event.team2}`}
                            data-market-title="Moneyline"
                            data-selection={event.team1Code}
                            data-odds="+350"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addBetToSlip(event.id, `${event.team1} v ${event.team2}`, 'Moneyline', event.team1Code, '+350')
                            }}
                            className={cn(
                              "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(event.id, 'Moneyline', event.team1Code) && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(event.id, 'Moneyline', event.team1Code)) {
                                e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(event.id, 'Moneyline', event.team1Code)) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-white/70 leading-none mb-0.5">{event.team1Code}</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                          <button 
                            data-event-id={event.id}
                            data-event-name={`${event.team1} v ${event.team2}`}
                            data-market-title="Moneyline"
                            data-selection="Tie"
                            data-odds="+350"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addBetToSlip(event.id, `${event.team1} v ${event.team2}`, 'Moneyline', 'Tie', '+350')
                            }}
                            className={cn(
                              "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(event.id, 'Moneyline', 'Tie') && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(event.id, 'Moneyline', 'Tie')) {
                                e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(event.id, 'Moneyline', 'Tie')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-white/70 leading-none mb-0.5">Tie</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                          <button 
                            data-event-id={event.id}
                            data-event-name={`${event.team1} v ${event.team2}`}
                            data-market-title="Moneyline"
                            data-selection={event.team2Code}
                            data-odds="+350"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addBetToSlip(event.id, `${event.team1} v ${event.team2}`, 'Moneyline', event.team2Code, '+350')
                            }}
                            className={cn(
                              "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(event.id, 'Moneyline', event.team2Code) && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(event.id, 'Moneyline', event.team2Code)) {
                                e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(event.id, 'Moneyline', event.team2Code)) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-white/70 leading-none mb-0.5">{event.team2Code}</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                        </div>
                        
                        {/* Popularity Bar */}
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-white/50 text-center mb-1">Moneyline</div>
                          <div className="flex h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="bg-[#ee3536] h-full" style={{ width: `${event.team1Percent}%` }}></div>
                            <div className="bg-white h-full" style={{ width: `${event.team2Percent}%` }}></div>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-white/50">{event.team1Percent}% {event.team1Code}</span>
                            <span className="text-white/50">{event.team2Percent}% {event.team2Code}</span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            
            {/* Sports Sub Nav Tabs - Under Event Cards */}
            <div className="mt-8 mb-4 overflow-x-hidden" style={{ width: '100%', maxWidth: '100%' }}>
              <div 
                ref={subNavScrollRef}
                className={cn(
                  "flex items-center gap-1.5",
                  isMobile && "overflow-x-auto scrollbar-hide"
                )}
                onScroll={(e) => {
                  // Prevent scroll from bubbling up
                  e.stopPropagation()
                }}
                onTouchMove={(e) => {
                  // Prevent touch scroll from affecting page
                  if (subNavScrollRef.current) {
                    const container = subNavScrollRef.current
                    const { scrollLeft, scrollWidth, offsetWidth } = container
                    const isAtStart = scrollLeft <= 0
                    const isAtEnd = scrollLeft >= scrollWidth - offsetWidth - 1
                    
                    // If we're at the edges, prevent default to stop page scroll
                    if (isAtStart || isAtEnd) {
                      const touch = e.touches[0]
                      const deltaX = touch.clientX - (container as any).lastTouchX || 0
                      ;(container as any).lastTouchX = touch.clientX
                      
                      if ((isAtStart && deltaX > 0) || (isAtEnd && deltaX < 0)) {
                        e.preventDefault()
                      }
                    }
                  }
                }}
                style={isMobile ? {
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-x',
                  overscrollBehaviorX: 'contain',
                  overscrollBehavior: 'auto',
                  scrollSnapType: 'x mandatory',
                  width: '100%',
                  maxWidth: '100%',
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  isolation: 'isolate'
                } : {}}
              >
                  {/* Text Tabs - Full Width */}
                  <AnimateTabs value={activeTab} onValueChange={(value) => { 
                    onTabChange(value)
                    // Scroll the clicked tab into view on mobile
                    if (isMobile && subNavScrollRef.current) {
                      const tabIndex = ['Events', 'Outrights', 'Boosts', 'Specials', 'All Leagues'].indexOf(value)
                      if (tabIndex !== -1) {
                        const tabs = subNavScrollRef.current.querySelectorAll('[data-tab-item]')
                        const targetTab = tabs[tabIndex] as HTMLElement
                        if (targetTab && subNavScrollRef.current) {
                          setTimeout(() => {
                            const container = subNavScrollRef.current!
                            const tabLeft = targetTab.offsetLeft
                            const tabWidth = targetTab.offsetWidth
                            const containerWidth = container.offsetWidth
                            const scrollLeft = container.scrollLeft
                            const tabRight = tabLeft + tabWidth
                            const containerRight = scrollLeft + containerWidth
                            
                            // Calculate scroll position to center the tab
                            let newScrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2)
                            // Ensure we don't scroll beyond bounds
                            newScrollLeft = Math.max(0, Math.min(newScrollLeft, container.scrollWidth - containerWidth))
                            
                            container.scrollTo({ 
                              left: newScrollLeft, 
                              behavior: 'smooth' 
                            })
                          }, 100)
                        }
                      }
                    }
                  }} className="w-full">
                    <AnimateTabsList className={cn(
                      "bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300",
                      isMobile && "flex-nowrap"
                    )}
                    style={isMobile ? {
                      minWidth: 'max-content',
                      width: 'max-content',
                      flexShrink: 0,
                      marginLeft: '12px',
                      paddingLeft: 0,
                      paddingRight: 0,
                      maxWidth: 'none'
                    } : {}}
                    >
                      {['Events', 'Outrights', 'Boosts', 'Specials', 'All Leagues'].map((tab, index) => (
                        <TabsTab 
                          key={tab}
                          value={tab}
                          data-tab-item
                          className={cn(
                            "relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none",
                            isMobile && index === ['Events', 'Outrights', 'Boosts', 'Specials', 'All Leagues'].length - 1 && "scroll-snap-end mr-12"
                          )}
                        >
                          {activeTab === tab && (
                            <motion.div
                              layoutId="activeSportsTab"
                              className="absolute inset-0 rounded-2xl -z-10"
                              style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 40
                              }}
                            />
                          )}
                          <span className="relative z-10">{tab}</span>
                        </TabsTab>
                      ))}
                    </AnimateTabsList>
                  </AnimateTabs>
              </div>
            </div>
          </div>
          
          {/* Live Events Section - Exactly matching Figma layout */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white pl-2">Live</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 border border-white/20 rounded-small cursor-pointer transition-colors duration-300"
                  >
                    <IconFilter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={5}
                  className="w-[180px] bg-[#2d2d2d] border-white/10 z-[120]"
                  style={{ zIndex: 120 }}
                >
                  {eventOrderOptions.map((option) => (
                    <DropdownMenuItem 
                      key={option.value}
                      onClick={() => setEventOrderBy(option.value)}
                      className={cn(
                        "text-white/70 hover:text-white hover:bg-white/5 cursor-pointer",
                        eventOrderBy === option.value && "bg-white/10 text-white"
                      )}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-1.5">
              {filteredLiveEvents.map((event) => {
                const currentScore = liveScores[event.id] || (event.score ? { team1: event.score.team1, team2: event.score.team2 } : null)
                const isAnimatingTeam1 = currentScore?.animating?.team === 1
                const isAnimatingTeam2 = currentScore?.animating?.team === 2

                // Timer component for each event
                const MatchTimer = () => {
                  const [elapsedTime, setElapsedTime] = useState(event.elapsedSeconds || 0)
                  
                  useEffect(() => {
                    if (!event.isLive) return
                    
                    const interval = setInterval(() => {
                      setElapsedTime(prev => prev + 1)
                    }, 1000)
                    
                    return () => clearInterval(interval)
                  }, [event.isLive])
                  
                  // Soccer format: H1, H2 with minutes
                  const minutes = Math.floor(elapsedTime / 60)
                  const seconds = elapsedTime % 60
                  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                  return <span className="text-[9px] text-white/70">{formattedTime}</span>
                }

                // Animated Score Component with NumberFlow and green flash
                const AnimatedScore = ({ value, isAnimating, from, to }: { value: number, isAnimating?: boolean, from?: number, to?: number }) => {
                  const [displayValue, setDisplayValue] = useState(value)
                  
                  useEffect(() => {
                    if (isAnimating && from !== undefined && to !== undefined) {
                      // Animate the value smoothly using requestAnimationFrame
                      const startValue = from
                      const endValue = to
                      const duration = 800
                      const startTime = Date.now()
                      
                      const animate = () => {
                        const elapsed = Date.now() - startTime
                        const progress = Math.min(elapsed / duration, 1)
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
                        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutCubic)
                        setDisplayValue(currentValue)
                        
                        if (progress < 1) {
                          requestAnimationFrame(animate)
                        } else {
                          setDisplayValue(endValue)
                        }
                      }
                      requestAnimationFrame(animate)
                    } else {
                      setDisplayValue(value)
                    }
                  }, [value, isAnimating, from, to])
                  
                  // Use NumberFlow with the animated displayValue
                  return (
                    <motion.div
                      key={displayValue}
                      initial={isAnimating ? { scale: 1.2 } : false}
                      animate={isAnimating ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="text-xs font-bold text-white leading-tight text-center"
                    >
                      <NumberFlow value={displayValue} />
                    </motion.div>
                  )
                }
                
                // Helper function to get NFL team code
                const getNFLTeamCode = (teamName: string): string | null => {
                  const nflTeamMap: { [key: string]: string } = {
                    'Alanta Falcons': 'ATL',
                    'Tennessee Titans': 'TEN',
                    'Seattle Seahawks': 'SEA',
                    'Kansas City Chiefs': 'KC',
                    'Indianapolis Colts': 'IND',
                    'Green Bay Packers': 'GB',
                    'Minnesota Vikings': 'MIN',
                    'New England Patriots': 'NE',
                    'Detroit Lions': 'DET',
                    'Miami Dolphins': 'MIA',
                  }
                  return nflTeamMap[teamName] || null
                }
                
                // Helper function to get team logo path (for soccer teams - all leagues)
                const getTeamLogoPath = (teamName: string): string | null => {
                  const teamLogoMap: { [key: string]: string } = {
                    'Liverpool': '/team/Liverpool FC.png',
                    'Bournemouth': '/team/AFC Bournemouth.png',
                    'Arsenal': '/team/Arsenal FC.png',
                    'Chelsea': '/team/Chelsea FC.png',
                    'Tottenham': '/team/Tottenham Hotspur.png',
                    'Newcastle': '/team/Newcastle United.png',
                    'Manchester City': '/team/Manchester City.png',
                    'Manchester United': '/team/Manchester United.png',
                    'Aston Villa': '/team/Aston Villa.png',
                    'Brighton': '/team/Brighton & Hove Albion.png',
                    'Brentford': '/team/Brentford FC.png',
                    'Burnley': '/team/Burnley FC.png',
                    'Crystal Palace': '/team/Crystal Palace.png',
                    'Everton': '/team/Everton FC.png',
                    'Fulham': '/team/Fulham FC.png',
                    'Leeds': '/team/Leeds United.png',
                    'Nottingham Forest': '/team/Nottingham Forest.png',
                    'West Ham': '/team/West Ham United.png',
                    'Wolves': '/team/Wolverhampton Wanderers.png',
                    'Wolverhampton': '/team/Wolverhampton Wanderers.png',
                    'Real Madrid': '/team/Spain - LaLiga/Real Madrid.png',
                    'Barcelona': '/team/Spain - LaLiga/FC Barcelona.png',
                    'Atletico Madrid': '/team/Spain - LaLiga/Atlético de Madrid.png',
                    'Sevilla': '/team/Spain - LaLiga/Sevilla FC.png',
                    'Real Sociedad': '/team/Spain - LaLiga/Real Sociedad.png',
                    'Villarreal': '/team/Spain - LaLiga/Villarreal CF.png',
                    'Juventus': '/team/Italy - Serie A/Juventus FC.png',
                    'AC Milan': '/team/Italy - Serie A/AC Milan.png',
                    'Inter Milan': '/team/Italy - Serie A/Inter Milan.png',
                    'Napoli': '/team/Italy - Serie A/SSC Napoli.png',
                    'AS Roma': '/team/Italy - Serie A/AS Roma.png',
                    'Lazio': '/team/Italy - Serie A/SS Lazio.png',
                    'Atalanta': '/team/Italy - Serie A/Atalanta BC.png',
                    'Fiorentina': '/team/Italy - Serie A/ACF Fiorentina.png',
                    'Inter Miami': '/team/Liverpool FC.png',
                    'LA Galaxy': '/team/Manchester City.png',
                  }
                  return teamLogoMap[teamName] || null
                }
                
                // Helper component to render team logo
                const TeamLogoComponent = ({ teamName, size = 12 }: { teamName: string; size?: number }) => {

                  const mlbCodeMap: { [key: string]: string } = {
                    'Arizona Diamondbacks': 'ARI', 'Atlanta Braves': 'ATL', 'Baltimore Orioles': 'BAL',
                    'Boston Red Sox': 'BOS', 'Chicago Cubs': 'CHC', 'Chicago White Sox': 'CHW',
                    'Cincinnati Reds': 'CIN', 'Cleveland Guardians': 'CLE', 'Colorado Rockies': 'COL',
                    'Detroit Tigers': 'DET', 'Houston Astros': 'HOU', 'Kansas City Royals': 'KAN',
                    'Los Angeles Angels': 'LAA', 'Los Angeles Dodgers': 'LAD', 'Miami Marlins': 'MIA',
                    'Milwaukee Brewers': 'MIL', 'Minnesota Twins': 'MIN', 'New York Mets': 'NYM',
                    'New York Yankees': 'NYY', 'Oakland Athletics': 'OAK', 'Philadelphia Phillies': 'PHI',
                    'Pittsburgh Pirates': 'PIT', 'San Diego Padres': 'SD', 'San Francisco Giants': 'SF',
                    'Seattle Mariners': 'SEA', 'St. Louis Cardinals': 'STL', 'Tampa Bay Rays': 'TB',
                    'Texas Rangers': 'TEX', 'Toronto Blue Jays': 'TOR', 'Washington Nationals': 'WAS',
                  }
                  const mlbCode = mlbCodeMap[teamName]
                  if (mlbCode) {
                    const MLBIcon = (MLBIcons as any)[mlbCode]
                    if (MLBIcon) return <MLBIcon size={size} />
                  }
                  const nhlCodeMap: { [key: string]: string } = {
                    'Anaheim Ducks': 'ANA', 'Arizona Coyotes': 'ARI', 'Boston Bruins': 'BOS',
                    'Buffalo Sabres': 'BUF', 'Carolina Hurricanes': 'CAR', 'Columbus Blue Jackets': 'CBJ',
                    'Calgary Flames': 'CGY', 'Chicago Blackhawks': 'CHI', 'Colorado Avalanche': 'COL',
                    'Dallas Stars': 'DAL', 'Detroit Red Wings': 'DET', 'Edmonton Oilers': 'EDM',
                    'Florida Panthers': 'FLA', 'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'MIN',
                    'Montreal Canadiens': 'MTL', 'New Jersey Devils': 'NJD', 'Nashville Predators': 'NSH',
                    'New York Islanders': 'NYI', 'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT',
                    'Philadelphia Flyers': 'PHI', 'Pittsburgh Penguins': 'PIT', 'Seattle Kraken': 'SEA',
                    'San Jose Sharks': 'SJS', 'St. Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL',
                    'Toronto Maple Leafs': 'TOR', 'Utah Hockey Club': 'UTA', 'Vancouver Canucks': 'VAN',
                    'Vegas Golden Knights': 'VGK', 'Winnipeg Jets': 'WPG', 'Washington Capitals': 'WSH',
                  }
                  const nhlCode = nhlCodeMap[teamName]
                  if (nhlCode) {
                    const NHLIcon = (NHLIcons as any)[nhlCode]
                    if (NHLIcon) return <NHLIcon size={size} />
                  }
                  const rugbyFlagMap: { [key: string]: string } = {
                    'New Zealand': 'https://flagcdn.com/w80/nz.png',
                    'South Africa': 'https://flagcdn.com/w80/za.png',
                    'Australia': 'https://flagcdn.com/w80/au.png',
                    'England': 'https://flagcdn.com/w80/gb-eng.png',
                    'France': 'https://flagcdn.com/w80/fr.png',
                    'Ireland': 'https://flagcdn.com/w80/ie.png',
                    'Japan': 'https://flagcdn.com/w80/jp.png',
                    'Argentina': 'https://flagcdn.com/w80/ar.png',
                    'Wales': 'https://flagcdn.com/w80/gb-wls.png',
                    'Scotland': 'https://flagcdn.com/w80/gb-sct.png',
                    'Fiji': 'https://flagcdn.com/w80/fj.png',
                    'Samoa': 'https://flagcdn.com/w80/ws.png',
                    'Italy': 'https://flagcdn.com/w80/it.png',
                    'Tonga': 'https://flagcdn.com/w80/to.png',
                    'Georgia': 'https://flagcdn.com/w80/ge.png',
                    'Uruguay': 'https://flagcdn.com/w80/uy.png',
                    'Canada': 'https://flagcdn.com/w80/ca.png',
                    'Namibia': 'https://flagcdn.com/w80/na.png',
                    'Romania': 'https://flagcdn.com/w80/ro.png',
                    'Portugal': 'https://flagcdn.com/w80/pt.png',
                    'Spain': 'https://flagcdn.com/w80/es.png',
                    'USA': 'https://flagcdn.com/w80/us.png',
                    'Chile': 'https://flagcdn.com/w80/cl.png',
                    'Kenya': 'https://flagcdn.com/w80/ke.png',
                    'Hong Kong': 'https://flagcdn.com/w80/hk.png',
                    'Russia': 'https://flagcdn.com/w80/ru.png',
                  }
                  const flagUrl = rugbyFlagMap[teamName]
                  if (flagUrl) {
                    return <img src={flagUrl} alt={teamName} width={size} height={size} className="object-cover flex-shrink-0 rounded-full" style={{ width: size, height: size }} decoding="async" onError={(e) => { const t = e.currentTarget; t.style.display = 'none'; const s = document.createElement('div'); s.className = 'rounded-full bg-white/20 flex items-center justify-center flex-shrink-0'; s.style.width = size + 'px'; s.style.height = size + 'px'; const initials = teamName.split(' ').map((w: string) => w[0]).join('').slice(0, 3).toUpperCase(); s.innerHTML = '<span style="font-size:' + Math.max(size * 0.35, 5) + 'px;line-height:1" class="font-bold text-white/80">' + initials + '</span>'; if (t.parentElement) t.parentElement.insertBefore(s, t); }} />
                  }
                  const badgeMap: { [key: string]: string } = {
    'Alanta Falcons': 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
    'Atlanta Falcons': 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
    'Tennessee Titans': 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png',
    'Minnesota Vikings': 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',
    'New England Patriots': 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png',
    'Detroit Lions': 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
    'Miami Dolphins': 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
    'Seattle Seahawks': 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
    'Kansas City Chiefs': 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
    'Indianapolis Colts': 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
    'Green Bay Packers': 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
    'Buffalo Bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
    'Denver Broncos': 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
    'Las Vegas Raiders': 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
    'Chicago Bears': 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
    'Dallas Cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
    'Philadelphia Eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
    'San Francisco 49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
    'Los Angeles Rams': 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
    'Arizona Cardinals': 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
    'New York Giants': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
    'New York Jets': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
    'Washington Commanders': 'https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png',
    'Pittsburgh Steelers': 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',
    'Baltimore Ravens': 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
    'Cincinnati Bengals': 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
    'Cleveland Browns': 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
    'Houston Texans': 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png',
    'Jacksonville Jaguars': 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png',
    'Los Angeles Chargers': 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png',
    'Carolina Panthers': 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png',
    'New Orleans Saints': 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png',
    'Tampa Bay Buccaneers': 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png',
    'Los Angeles Lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    'Boston Celtics': 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
    'Golden State Warriors': 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
    'Milwaukee Bucks': 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
    'Phoenix Suns': 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
    'Denver Nuggets': 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
    'Philadelphia 76ers': 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
    'Brooklyn Nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
    'Miami Heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
    'New York Knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
    'Dallas Mavericks': 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
    'Memphis Grizzlies': 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png',
    'Cleveland Cavaliers': 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
    'Sacramento Kings': 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png',
    'Oklahoma City Thunder': 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
    'Minnesota Timberwolves': 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
    'New Orleans Pelicans': 'https://a.espncdn.com/i/teamlogos/nba/500/no.png',
    'Atlanta Hawks': 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
    'Toronto Raptors': 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
    'Chicago Bulls': 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
    'Indiana Pacers': 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png',
    'LA Clippers': 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png',
    'Portland Trail Blazers': 'https://a.espncdn.com/i/teamlogos/nba/500/por.png',
    'Houston Rockets': 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
    'Charlotte Hornets': 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
    'San Antonio Spurs': 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
    'Utah Jazz': 'https://a.espncdn.com/i/teamlogos/nba/500/utah.png',
    'Orlando Magic': 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
    'Detroit Pistons': 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
    'Washington Wizards': 'https://a.espncdn.com/i/teamlogos/nba/500/wsh.png',
  }
                  const logoPath = badgeMap[teamName]
                  const initials = teamName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
                  if (logoPath) {
                    return <img src={logoPath} alt={teamName} width={size} height={size} className="object-contain flex-shrink-0 rounded-full" decoding="sync" onError={(e) => { const t = e.currentTarget; t.style.display = 'none'; const s = document.createElement('div'); s.className = 'rounded-full bg-white/20 flex items-center justify-center flex-shrink-0'; s.style.width = size + 'px'; s.style.height = size + 'px'; s.innerHTML = '<span style="font-size:' + Math.max(size * 0.35, 5) + 'px;line-height:1" class="font-bold text-white/80">' + initials + '</span>'; if (t.parentElement) t.parentElement.insertBefore(s, t); }} />
                  }
                  return <div className="rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}><span style={{ fontSize: Math.max(size * 0.35, 5), lineHeight: 1 }} className="font-bold text-white/80">{initials}</span></div>
                }
                
                // Markets carousel - with arrows on desktop
                const MarketsCarousel = () => {
                  const containerRef = useRef<HTMLDivElement>(null)
                  const [canScrollLeft, setCanScrollLeft] = useState(false)
                  const [canScrollRight, setCanScrollRight] = useState(false)
                  
                  const checkScroll = useCallback(() => {
                    if (containerRef.current) {
                      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
                      setCanScrollLeft(scrollLeft > 0)
                      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
                    }
                  }, [])
                  
                  useEffect(() => {
                    checkScroll()
                    const container = containerRef.current
                    if (container) {
                      container.addEventListener('scroll', checkScroll)
                      window.addEventListener('resize', checkScroll)
                    return () => {
                        container.removeEventListener('scroll', checkScroll)
                        window.removeEventListener('resize', checkScroll)
                      }
                    }
                  }, [checkScroll])
                  
                  const scrollLeft = () => {
                    if (containerRef.current) {
                      containerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
                    }
                  }
                  
                  const scrollRight = () => {
                    if (containerRef.current) {
                      containerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
                    }
                  }
                  
                  return (
                    <div className="w-full relative" style={{ overflow: 'visible' }}>
                      {/* Left Arrow - Desktop Only */}
                      {!isMobile && canScrollLeft && (
                        <button
                          onClick={scrollLeft}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 border border-white/30 rounded-full p-1.5 flex items-center justify-center transition-colors shadow-lg"
                          style={{ marginLeft: '-24px' }}
                        >
                          <IconChevronLeft className="w-4 h-4 text-white" />
                        </button>
                      )}
                      
                      {/* Scrollable Markets Container - Full width of card, no clipping */}
                      <div 
                        ref={containerRef}
                        className="w-full overflow-x-auto scrollbar-hide flex items-center gap-0 relative"
                        style={{ 
                          scrollBehavior: 'smooth',
                          WebkitOverflowScrolling: 'touch',
                          touchAction: 'pan-x',
                          paddingLeft: isMobile ? '10px' : (canScrollLeft ? '32px' : '10px'),
                          paddingRight: isMobile ? '10px' : (canScrollRight ? '32px' : '10px')
                        }}
                      >
                        <div className="flex items-center gap-0" style={{ width: 'max-content' }}>
                          {event.markets.map((market, marketIndex) => (
                            <React.Fragment key={marketIndex}>
                              <div className="flex flex-col items-center flex-shrink-0">
                                {/* Market Title - Centered */}
                                <div className="text-[10px] text-white/50 mb-1.5 leading-none text-center whitespace-nowrap px-1">{market.title}</div>
                                {/* Market Options - 2 rows for Football/NFL, 1 row for Soccer */}
                                {activeSport === 'Football' ? (
                                  <div className="flex flex-col gap-1">
                                    {/* For Football: Top button = Team 1, Bottom button = Team 2 */}
                                    {market.options.slice(0, 2).map((option, optionIndex) => {
                                      // Ensure first option is team1, second is team2
                                      const isTeam1 = optionIndex === 0
                                      const isTeam2 = optionIndex === 1
                                      const isSelected = isBetSelected(event.id, market.title, option.label)
                                      return (
                                        <button
                                          key={`${event.id}-${market.title}-${option.label}-${optionIndex}`}
                                          data-event-id={event.id}
                                          data-event-name={`${event.team1} v ${event.team2}`}
                                          data-market-title={market.title}
                                          data-selection={option.label}
                                          data-odds={option.odds}
                                          data-team={isTeam1 ? 'team1' : 'team2'}
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            const eventName = `${event.team1} v ${event.team2}`
                                            if (isSelected) {
                                              // Deselect: remove this bet from the betslip
                                              setBets(prev => prev.filter(bet => 
                                                !(bet.eventId === event.id && bet.marketTitle === market.title && bet.selection === option.label)
                                              ))
                                            } else {
                                              // Select new option: remove any existing bet for this market first, then add
                                              setBets(prev => prev.filter(bet => 
                                                !(bet.eventId === event.id && bet.marketTitle === market.title)
                                              ))
                                              addBetToSlip(event.id, eventName, market.title, option.label, option.odds)
                                            }
                                          }}
                                          className={cn(
                                            "text-white rounded-small w-[68px] h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2 flex-shrink-0",
                                            isSelected 
                                              ? "bg-red-500 hover:bg-red-600" 
                                              : "bg-white/10 hover:bg-white/20"
                                          )}
                                          onMouseEnter={(e) => {
                                            if (!isSelected) {
                                              e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (!isSelected) {
                                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                                            }
                                          }}
                                        >
                                          <div className="text-[10px] text-white/70 leading-none mb-0.5 truncate w-full text-center">{option.label}</div>
                                          <div className="text-xs font-bold leading-none">{option.odds}</div>
                                        </button>
                                      )
                                    })}
                                  </div>
                                ) : (
                                <div className="flex gap-1 h-[38px] items-center">
                                  {market.options.map((option, optionIndex) => {
                                    const isSelected = isBetSelected(event.id, market.title, option.label)
                                    return (
                                      <button
                                        key={optionIndex}
                                          data-event-id={event.id}
                                          data-event-name={`${event.team1} v ${event.team2}`}
                                          data-market-title={market.title}
                                          data-selection={option.label}
                                          data-odds={option.odds}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          const eventName = `${event.team1} v ${event.team2}`
                                          addBetToSlip(event.id, eventName, market.title, option.label, option.odds)
                                        }}
                                        className={cn(
                                          "text-white rounded-small w-[68px] h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2 flex-shrink-0",
                                          isSelected 
                                            ? "bg-red-500 hover:bg-red-600" 
                                            : "bg-white/10 hover:bg-white/20"
                                        )}
                                        onMouseEnter={(e) => {
                                          if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                                          }
                                        }}
                                      >
                                        <div className="text-[10px] text-white/70 leading-none mb-0.5 truncate w-full text-center">{option.label}</div>
                                        <div className="text-xs font-bold leading-none">{option.odds}</div>
                                      </button>
                                    )
                                  })}
                                </div>
                                )}
                              </div>
                              {/* Vertical Divider */}
                              {marketIndex < event.markets.length - 1 && (
                                <div className="w-px h-[38px] bg-white/10 mx-2 flex-shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right Arrow - Desktop Only */}
                      {!isMobile && canScrollRight && (
                        <button
                          onClick={scrollRight}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 border border-white/30 rounded-full p-1.5 flex items-center justify-center transition-colors shadow-lg"
                          style={{ marginRight: '-24px' }}
                        >
                          <IconChevronRight className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  )
                }
                
                return (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-small" style={{ overflow: 'visible', width: '100%' }}>
                    {/* Header Section - League | Country, Soccer */}
                    <div className="px-2.5 py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {(() => {
                          const leagueIconPath = (event as any).leagueIcon
                          if (leagueIconPath) {
                            return (
                              <img 
                                src={leagueIconPath} 
                                alt={event.league}
                                width={12}
                                height={12}
                                className="object-contain"
                                decoding="sync"
                              />
                            )
                          }
                          const leagueData = leagues.find(l => l.name === event.league)
                          const isSvgPath = leagueData && typeof leagueData.icon === 'string'
                          return isSvgPath ? (
                            <img 
                              src={leagueData.icon as unknown as string} 
                              alt={event.league}
                              width={12}
                              height={12}
                              className="object-contain"
                              decoding="sync"
                            />
                          ) : (
                            <IconTrophy className="w-3 h-3 text-white/70" />
                          )
                        })()}
                        <span className="text-[9px] text-white/70">{event.league}</span>
                        <span className="text-[9px] text-white/50">|</span>
                        <span className="text-[9px] text-white/70">{event.country}</span>
                        <span className="text-[9px] text-white/50">,</span>
                        <span className="text-[9px] text-white/70">Soccer</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setTrackerEvent({ id: event.id, team1: event.team1, team2: event.team2, league: event.league, country: event.country, score: event.score, minute: event.isLive ? "45'" : undefined, isLive: event.isLive, statscoreEventId: 6188732, statscoreConfigId: '60dc694d4321eaff1879f0cf' })
                        }}
                        className="text-[10px] text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <IconVideo className="w-3 h-3" />
                        Watch
                      </button>
                    </div>
                    
                    {/* Main Content Row - Status, Teams, Score, Markets (Desktop) or just Status, Teams, Score (Mobile) */}
                    <div className="px-2.5 py-2 flex items-center gap-2" style={{ overflow: 'visible', alignItems: 'center' }}>
                      {/* Status/Time Badge - Smaller */}
                      {event.isLive && (
                        <div className="flex flex-col items-start justify-center gap-0.5 flex-shrink-0 w-[50px]">
                          <div className="flex items-center gap-0.5 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5 whitespace-nowrap">
                            <div className="w-1 h-1 bg-[#ee3536] rounded-full animate-pulse"></div>
                            <span className="text-[8px] font-semibold text-[#ee3536]">LIVE</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <span className="text-[8px] font-bold text-white/70">1h</span>
                          <MatchTimer />
                          </div>
                        </div>
                      )}
                      
                      {/* Teams - Fixed width for alignment with logos */}
                      <div className={cn("flex flex-col gap-1 min-w-0 justify-center", isMobile ? "flex-1" : "w-[200px] flex-shrink-0")}>
                        <div className="flex items-center gap-1.5">
                          <TeamLogoComponent teamName={event.team1} size={12} />
                          <div className="text-[11px] font-semibold text-white truncate leading-tight">{event.team1}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TeamLogoComponent teamName={event.team2} size={12} />
                          <div className="text-[11px] font-semibold text-white truncate leading-tight">{event.team2}</div>
                        </div>
                      </div>
                      
                      {/* Score - Fixed width container for alignment across all events */}
                      {currentScore && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            <motion.div 
                              className={cn(
                                "border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center transition-all duration-500",
                                isAnimatingTeam1 
                                  ? "bg-green-500/30 border-green-500/50 shadow-lg shadow-green-500/20" 
                                  : "bg-white/5 border-white/10"
                              )}
                              animate={isAnimatingTeam1 ? { 
                                scale: [1, 1.05, 1],
                                boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0)"]
                              } : {}}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                              <AnimatedScore 
                                value={currentScore.team1} 
                                isAnimating={isAnimatingTeam1}
                                from={currentScore.animating?.team === 1 ? currentScore.animating.from : undefined}
                                to={currentScore.animating?.team === 1 ? currentScore.animating.to : undefined}
                              />
                            </motion.div>
                            <motion.div 
                              className={cn(
                                "border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center transition-all duration-500",
                                isAnimatingTeam2 
                                  ? "bg-green-500/30 border-green-500/50 shadow-lg shadow-green-500/20" 
                                  : "bg-white/5 border-white/10"
                              )}
                              animate={isAnimatingTeam2 ? { 
                                scale: [1, 1.05, 1],
                                boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0)"]
                              } : {}}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                              <AnimatedScore 
                                value={currentScore.team2} 
                                isAnimating={isAnimatingTeam2}
                                from={currentScore.animating?.team === 2 ? currentScore.animating.from : undefined}
                                to={currentScore.animating?.team === 2 ? currentScore.animating.to : undefined}
                              />
                            </motion.div>
                          </div>
                          <IconChevronRight className="w-3.5 h-3.5 text-white/50 hover:text-white transition-colors cursor-pointer flex-shrink-0" />
                        </div>
                      )}
                      
                      {/* Betting Markets - Desktop: Inline with teams */}
                      {!isMobile && (
                        <div className="flex-1 relative min-w-0" style={{ overflow: 'visible' }}>
                      <MarketsCarousel />
                    </div>
                      )}
                    </div>
                    
                    {/* Betting Markets - Mobile: Under team names */}
                    {isMobile && (
                      <div className="w-full pb-2" style={{ overflow: 'visible' }}>
                        <MarketsCarousel />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Top Bet Boosts Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white pl-2">Top Bet Boosts</h2>
              <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                  className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small whitespace-nowrap transition-colors duration-300"
                  onClick={() => {
                    router.push('/sports/baseball/mlb')
                  }}
              >
                View All
              </Button>
                {!isMobile && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (topBetBoostsCarouselApi) {
                          const currentIndex = topBetBoostsCarouselApi.selectedScrollSnap()
                          const targetIndex = Math.max(0, currentIndex - 2)
                          topBetBoostsCarouselApi.scrollTo(targetIndex)
                        }
                      }}
                      disabled={!topBetBoostsCarouselApi || !topBetBoostsCanScrollPrev}
                    >
                      <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (topBetBoostsCarouselApi) {
                          const currentIndex = topBetBoostsCarouselApi.selectedScrollSnap()
                          const slideCount = topBetBoostsCarouselApi.scrollSnapList().length
                          const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                          topBetBoostsCarouselApi.scrollTo(targetIndex)
                        }
                      }}
                      disabled={!topBetBoostsCarouselApi || !topBetBoostsCanScrollNext}
                    >
                      <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="relative -mx-6" style={{ overflow: 'visible', position: 'relative', width: 'calc(100% + 3rem)', maxWidth: 'none', boxSizing: 'border-box', minWidth: 0 }}>
              <Carousel setApi={setTopBetBoostsCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                <CarouselContent className="ml-6 mr-0">
                  {/* Bet Boost Cards */}
                  {([
                    
                    { id: 1, marketName: 'Ohtani 2+ Home Runs vs Padres', isLive: true, liveTime: 'T5', wasOdds: '+500', boostedOdds: '+650', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 2, marketName: 'Judge To Hit Grand Slam vs Red Sox', isLive: false, time: 'TODAY 7:05PM', wasOdds: '+800', boostedOdds: '+1000', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 3, marketName: 'Acuna Jr 3+ Hits & Stolen Base vs Mets', isLive: false, time: 'TODAY 4:10PM', wasOdds: '+350', boostedOdds: '+475', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                    { id: 4, marketName: 'Cole 10+ Strikeouts vs Astros', isLive: true, liveTime: 'T7', wasOdds: '+300', boostedOdds: '+420', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA' },
                  ]).map((boost, index) => (
                    <CarouselItem key={boost.id} className={index === 0 ? "pl-0 pr-0 basis-auto flex-shrink-0" : "pl-2 md:pl-4 basis-auto flex-shrink-0"}>
                      <div className="w-[340px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                        {/* Header: League info and Time/Live Status */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <img 
                              src={"/sports_icons/baseball.svg"} 
                              alt="Baseball"
                              width={16}
                              height={16}
                              className="object-contain"
                              decoding="sync"
                            />
                            <span className="text-[10px] text-white">Baseball | USA</span>
                  </div>
                          {boost.isLive ? (
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-0.5 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5 whitespace-nowrap">
                                <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-semibold text-[#ee3536]">LIVE</span>
                              </div>
                              <span className="text-[10px] text-[#ee3536]">{boost.time}</span>
                            </div>
                          ) : (
                          <span className="text-[10px] text-white">{boost.time}</span>
                          )}
                  </div>
                        
                        {/* Market Name with Odds on the Right */}
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div className="text-sm font-semibold text-white/90 leading-tight flex-1" style={{ lineHeight: '1.3', maxWidth: '200px' }}>
                          {boost.marketName}
                        </div>
                          {/* Odds Side by Side */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Was Odds */}
                            <div>
                              <div className="text-[10px] text-white/50 mb-1 text-center">Was</div>
                    <button 
                                disabled
                                className="bg-white/10 text-white/50 rounded-small h-[38px] flex items-center justify-center px-3 border border-white/20 cursor-not-allowed opacity-60"
                              >
                                <span className="text-[10px] text-white/50 leading-none line-through">{boost.wasOdds}</span>
                    </button>
                            </div>
                            {/* Boosted Odds */}
                            <div>
                              <div className="text-[10px] text-white/50 mb-1 text-center">Boosted</div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addBetToSlip(boost.id + 90000, boost.marketName, 'Bet Boost', boost.marketName, boost.boostedOdds)
                      }}
                                className={cn(
                                  "rounded-small h-[38px] flex items-center justify-center px-3 border transition-colors cursor-pointer",
                                  bets.some(b => b.eventId === boost.id + 90000) 
                                    ? "border-transparent text-white" 
                                    : "bg-white/10 border-white/20 text-white"
                                )}
                                style={bets.some(b => b.eventId === boost.id + 90000) ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                      onMouseEnter={(e) => {
                        if (!bets.some(b => b.eventId === boost.id + 90000)) e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                      }}
                      onMouseLeave={(e) => {
                        if (!bets.some(b => b.eventId === boost.id + 90000)) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                                <span className="text-[10px] font-bold text-white leading-none">{boost.boostedOdds}</span>
                    </button>
                            </div>
                          </div>
                  </div>
                        
                        {/* Information Disclaimer */}
                        <div className="flex items-start gap-1.5">
                          <IconInfoCircle className="w-3.5 h-3.5 text-white/50 flex-shrink-0 mt-0.5" />
                          <span className="text-[10px] text-white/50 leading-tight">
                            Player Must Play. If No TD's Are Scored Wager Will Be Graded As A Loss
                          </span>
                </div>
                      </div>
                    </CarouselItem>
              ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          

          {/* Same Game Parlays Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white pl-2">Same Game Parlays</h2>
              <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                  className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small whitespace-nowrap transition-colors duration-300"
              >
                View All
              </Button>
                {!isMobile && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (sgpCarouselApi) {
                          const currentIndex = sgpCarouselApi.selectedScrollSnap()
                          const targetIndex = Math.max(0, currentIndex - 2)
                          sgpCarouselApi.scrollTo(targetIndex)
                        }
                      }}
                      disabled={!sgpCarouselApi || !sgpCanScrollPrev}
                    >
                      <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (sgpCarouselApi) {
                          const currentIndex = sgpCarouselApi.selectedScrollSnap()
                          const slideCount = sgpCarouselApi.scrollSnapList().length
                          const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                          sgpCarouselApi.scrollTo(targetIndex)
                        }
                      }}
                      disabled={!sgpCarouselApi || !sgpCanScrollNext}
                    >
                      <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="relative -mx-6" style={{ overflow: 'visible', position: 'relative', width: 'calc(100% + 3rem)', maxWidth: 'none', boxSizing: 'border-box', minWidth: 0 }}>
              <Carousel setApi={setSgpCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                <CarouselContent className="ml-6 mr-0">
                  {/* SGP Cards */}
                  {([
                    { id: 1, match: 'Yankees vs Red Sox', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA', time: 'TODAY 7:05PM', legs: ['Yankees To Win', 'Over 8.5 Runs', 'Judge To Hit HR'], combinedOdds: '+950' },
                    { id: 2, match: 'Dodgers vs Giants', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA', time: 'TODAY 10:10PM', legs: ['Dodgers -1.5', 'Ohtani 2+ Hits', 'Over 7.5 Runs'], combinedOdds: '+800' },
                    { id: 3, match: 'Astros vs Rangers', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA', time: 'TOMORROW 8:05PM', legs: ['Astros To Win', 'Alvarez To Hit HR', 'Under 9.5 Runs'], combinedOdds: '+1100' },
                    { id: 4, match: 'Braves vs Phillies', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA', time: 'SAT 4:05PM', legs: ['Both Teams 3+ Runs', 'Over 8.5 Runs', 'Acuna 2+ Hits'], combinedOdds: '+750' },
                    { id: 5, match: 'Cubs vs Cardinals', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA', time: 'SUN 2:15PM', legs: ['Cubs To Win', 'Over 7.5 Runs', 'Under 12.5 Runs'], combinedOdds: '+600' }
                  ]).map((parlay, index) => (
                    <CarouselItem key={parlay.id} className={index === 0 ? "pl-0 pr-0 basis-auto flex-shrink-0" : "pl-2 md:pl-4 basis-auto flex-shrink-0"}>
                    <div className="w-[340px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.3) 50%, rgba(255, 255, 255, 0.03) 100%)' }}>
                      {/* Header: League info and Time */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <img 
                            src={parlay.leagueIcon} 
                            alt={parlay.league}
                            width={16}
                            height={16}
                            className="object-contain"
                            decoding="sync"
                          />
                          <span className="text-[10px] text-white">{parlay.league} | {parlay.country}, Baseball</span>
                        </div>
                        <span className="text-[10px] text-white/70">{parlay.time}</span>
                      </div>

                      {/* Match Name */}
                      <div className="text-sm font-semibold text-white/90 leading-tight mb-3">
                        {parlay.match}
                      </div>

                      {/* Parlay Legs with connecting line */}
                      <div className="relative mb-3 ml-[3px]">
                        {/* Vertical connecting line */}
                        <div className="absolute left-[2.5px] top-[5px] bottom-[5px] w-[1px] bg-white/20" />
                        <div className="space-y-2">
                          {parlay.legs.map((leg: string, legIndex: number) => (
                            <div key={legIndex} className="flex items-center gap-2.5 relative">
                              <div className="w-[6px] h-[6px] rounded-full bg-emerald-400 flex-shrink-0 relative z-10 ring-2 ring-emerald-400/20" />
                              <span className="text-[11px] text-white/80">{leg}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Combined Odds Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50">{parlay.legs.length}-Leg Parlay</span>
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(parlay.id + 80000, parlay.match, 'Same Game Parlay', parlay.legs.join(' + '), parlay.combinedOdds)
                          }}
                          className={cn(
                            "rounded-small h-[34px] flex items-center justify-center px-4 transition-colors cursor-pointer border",
                            bets.some(b => b.eventId === parlay.id + 80000) 
                              ? "border-transparent text-white" 
                              : "bg-white/10 hover:bg-white/20 border-transparent text-white"
                          )}
                          style={bets.some(b => b.eventId === parlay.id + 80000) ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                        >
                          <span className="text-xs font-bold text-white leading-none">{parlay.combinedOdds}</span>
                        </button>
                      </div>
                    </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white pl-2">Upcoming</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 border border-white/20 rounded-small cursor-pointer transition-colors duration-300"
                  >
                    <IconFilter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={5}
                  className="w-[180px] bg-[#2d2d2d] border-white/10 z-[120]"
                  style={{ zIndex: 120 }}
                >
                  {eventOrderOptions.map((option) => (
                    <DropdownMenuItem 
                      key={option.value}
                      onClick={() => setEventOrderBy(option.value)}
                      className={cn(
                        "text-white/70 hover:text-white hover:bg-white/5 cursor-pointer",
                        eventOrderBy === option.value && "bg-white/10 text-white"
                      )}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              {filteredUpcomingEvents.map((event) => {
                // Helper function to get NFL team code
                const getNFLTeamCode = (teamName: string): string | null => {
                  const nflTeamMap: { [key: string]: string } = {
                    'Alanta Falcons': 'ATL',
                    'Tennessee Titans': 'TEN',
                    'Seattle Seahawks': 'SEA',
                    'Kansas City Chiefs': 'KC',
                    'Indianapolis Colts': 'IND',
                    'Green Bay Packers': 'GB',
                    'Minnesota Vikings': 'MIN',
                    'New England Patriots': 'NE',
                    'Detroit Lions': 'DET',
                    'Miami Dolphins': 'MIA',
                  }
                  return nflTeamMap[teamName] || null
                }
                
                // Helper function to get team logo path (for soccer teams - all leagues)
                const getTeamLogoPath = (teamName: string): string | null => {
                  const teamLogoMap: { [key: string]: string } = {
                    'Liverpool': '/team/Liverpool FC.png',
                    'Bournemouth': '/team/AFC Bournemouth.png',
                    'Arsenal': '/team/Arsenal FC.png',
                    'Chelsea': '/team/Chelsea FC.png',
                    'Tottenham': '/team/Tottenham Hotspur.png',
                    'Newcastle': '/team/Newcastle United.png',
                    'Manchester City': '/team/Manchester City.png',
                    'Manchester United': '/team/Manchester United.png',
                    'Aston Villa': '/team/Aston Villa.png',
                    'Brighton': '/team/Brighton & Hove Albion.png',
                    'Brentford': '/team/Brentford FC.png',
                    'Burnley': '/team/Burnley FC.png',
                    'Crystal Palace': '/team/Crystal Palace.png',
                    'Everton': '/team/Everton FC.png',
                    'Fulham': '/team/Fulham FC.png',
                    'Leeds': '/team/Leeds United.png',
                    'Nottingham Forest': '/team/Nottingham Forest.png',
                    'West Ham': '/team/West Ham United.png',
                    'Wolves': '/team/Wolverhampton Wanderers.png',
                    'Wolverhampton': '/team/Wolverhampton Wanderers.png',
                    'Real Madrid': '/team/Spain - LaLiga/Real Madrid.png',
                    'Barcelona': '/team/Spain - LaLiga/FC Barcelona.png',
                    'Atletico Madrid': '/team/Spain - LaLiga/Atlético de Madrid.png',
                    'Sevilla': '/team/Spain - LaLiga/Sevilla FC.png',
                    'Real Sociedad': '/team/Spain - LaLiga/Real Sociedad.png',
                    'Villarreal': '/team/Spain - LaLiga/Villarreal CF.png',
                    'Juventus': '/team/Italy - Serie A/Juventus FC.png',
                    'AC Milan': '/team/Italy - Serie A/AC Milan.png',
                    'Inter Milan': '/team/Italy - Serie A/Inter Milan.png',
                    'Napoli': '/team/Italy - Serie A/SSC Napoli.png',
                    'AS Roma': '/team/Italy - Serie A/AS Roma.png',
                    'Lazio': '/team/Italy - Serie A/SS Lazio.png',
                    'Atalanta': '/team/Italy - Serie A/Atalanta BC.png',
                    'Fiorentina': '/team/Italy - Serie A/ACF Fiorentina.png',
                    'Inter Miami': '/team/Liverpool FC.png',
                    'LA Galaxy': '/team/Manchester City.png',
                  }
                  return teamLogoMap[teamName] || null
                }
                
                // Helper component to render team logo
                const TeamLogoComponent = ({ teamName, size = 12 }: { teamName: string; size?: number }) => {

                  const mlbCodeMap: { [key: string]: string } = {
                    'Arizona Diamondbacks': 'ARI', 'Atlanta Braves': 'ATL', 'Baltimore Orioles': 'BAL',
                    'Boston Red Sox': 'BOS', 'Chicago Cubs': 'CHC', 'Chicago White Sox': 'CHW',
                    'Cincinnati Reds': 'CIN', 'Cleveland Guardians': 'CLE', 'Colorado Rockies': 'COL',
                    'Detroit Tigers': 'DET', 'Houston Astros': 'HOU', 'Kansas City Royals': 'KAN',
                    'Los Angeles Angels': 'LAA', 'Los Angeles Dodgers': 'LAD', 'Miami Marlins': 'MIA',
                    'Milwaukee Brewers': 'MIL', 'Minnesota Twins': 'MIN', 'New York Mets': 'NYM',
                    'New York Yankees': 'NYY', 'Oakland Athletics': 'OAK', 'Philadelphia Phillies': 'PHI',
                    'Pittsburgh Pirates': 'PIT', 'San Diego Padres': 'SD', 'San Francisco Giants': 'SF',
                    'Seattle Mariners': 'SEA', 'St. Louis Cardinals': 'STL', 'Tampa Bay Rays': 'TB',
                    'Texas Rangers': 'TEX', 'Toronto Blue Jays': 'TOR', 'Washington Nationals': 'WAS',
                  }
                  const mlbCode = mlbCodeMap[teamName]
                  if (mlbCode) {
                    const MLBIcon = (MLBIcons as any)[mlbCode]
                    if (MLBIcon) return <MLBIcon size={size} />
                  }
                  const nhlCodeMap: { [key: string]: string } = {
                    'Anaheim Ducks': 'ANA', 'Arizona Coyotes': 'ARI', 'Boston Bruins': 'BOS',
                    'Buffalo Sabres': 'BUF', 'Carolina Hurricanes': 'CAR', 'Columbus Blue Jackets': 'CBJ',
                    'Calgary Flames': 'CGY', 'Chicago Blackhawks': 'CHI', 'Colorado Avalanche': 'COL',
                    'Dallas Stars': 'DAL', 'Detroit Red Wings': 'DET', 'Edmonton Oilers': 'EDM',
                    'Florida Panthers': 'FLA', 'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'MIN',
                    'Montreal Canadiens': 'MTL', 'New Jersey Devils': 'NJD', 'Nashville Predators': 'NSH',
                    'New York Islanders': 'NYI', 'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT',
                    'Philadelphia Flyers': 'PHI', 'Pittsburgh Penguins': 'PIT', 'Seattle Kraken': 'SEA',
                    'San Jose Sharks': 'SJS', 'St. Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL',
                    'Toronto Maple Leafs': 'TOR', 'Utah Hockey Club': 'UTA', 'Vancouver Canucks': 'VAN',
                    'Vegas Golden Knights': 'VGK', 'Winnipeg Jets': 'WPG', 'Washington Capitals': 'WSH',
                  }
                  const nhlCode = nhlCodeMap[teamName]
                  if (nhlCode) {
                    const NHLIcon = (NHLIcons as any)[nhlCode]
                    if (NHLIcon) return <NHLIcon size={size} />
                  }
                  const rugbyFlagMap: { [key: string]: string } = {
                    'New Zealand': 'https://flagcdn.com/w80/nz.png',
                    'South Africa': 'https://flagcdn.com/w80/za.png',
                    'Australia': 'https://flagcdn.com/w80/au.png',
                    'England': 'https://flagcdn.com/w80/gb-eng.png',
                    'France': 'https://flagcdn.com/w80/fr.png',
                    'Ireland': 'https://flagcdn.com/w80/ie.png',
                    'Japan': 'https://flagcdn.com/w80/jp.png',
                    'Argentina': 'https://flagcdn.com/w80/ar.png',
                    'Wales': 'https://flagcdn.com/w80/gb-wls.png',
                    'Scotland': 'https://flagcdn.com/w80/gb-sct.png',
                    'Fiji': 'https://flagcdn.com/w80/fj.png',
                    'Samoa': 'https://flagcdn.com/w80/ws.png',
                    'Italy': 'https://flagcdn.com/w80/it.png',
                    'Tonga': 'https://flagcdn.com/w80/to.png',
                    'Georgia': 'https://flagcdn.com/w80/ge.png',
                    'Uruguay': 'https://flagcdn.com/w80/uy.png',
                    'Canada': 'https://flagcdn.com/w80/ca.png',
                    'Namibia': 'https://flagcdn.com/w80/na.png',
                    'Romania': 'https://flagcdn.com/w80/ro.png',
                    'Portugal': 'https://flagcdn.com/w80/pt.png',
                    'Spain': 'https://flagcdn.com/w80/es.png',
                    'USA': 'https://flagcdn.com/w80/us.png',
                    'Chile': 'https://flagcdn.com/w80/cl.png',
                    'Kenya': 'https://flagcdn.com/w80/ke.png',
                    'Hong Kong': 'https://flagcdn.com/w80/hk.png',
                    'Russia': 'https://flagcdn.com/w80/ru.png',
                  }
                  const flagUrl = rugbyFlagMap[teamName]
                  if (flagUrl) {
                    return <img src={flagUrl} alt={teamName} width={size} height={size} className="object-cover flex-shrink-0 rounded-full" style={{ width: size, height: size }} decoding="async" onError={(e) => { const t = e.currentTarget; t.style.display = 'none'; const s = document.createElement('div'); s.className = 'rounded-full bg-white/20 flex items-center justify-center flex-shrink-0'; s.style.width = size + 'px'; s.style.height = size + 'px'; const initials = teamName.split(' ').map((w: string) => w[0]).join('').slice(0, 3).toUpperCase(); s.innerHTML = '<span style="font-size:' + Math.max(size * 0.35, 5) + 'px;line-height:1" class="font-bold text-white/80">' + initials + '</span>'; if (t.parentElement) t.parentElement.insertBefore(s, t); }} />
                  }
                  const badgeMap: { [key: string]: string } = {
    'Alanta Falcons': 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
    'Atlanta Falcons': 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
    'Tennessee Titans': 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png',
    'Minnesota Vikings': 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',
    'New England Patriots': 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png',
    'Detroit Lions': 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
    'Miami Dolphins': 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
    'Seattle Seahawks': 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
    'Kansas City Chiefs': 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
    'Indianapolis Colts': 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
    'Green Bay Packers': 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
    'Buffalo Bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
    'Denver Broncos': 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
    'Las Vegas Raiders': 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
    'Chicago Bears': 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
    'Dallas Cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
    'Philadelphia Eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
    'San Francisco 49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
    'Los Angeles Rams': 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
    'Arizona Cardinals': 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
    'New York Giants': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
    'New York Jets': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
    'Washington Commanders': 'https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png',
    'Pittsburgh Steelers': 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',
    'Baltimore Ravens': 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
    'Cincinnati Bengals': 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
    'Cleveland Browns': 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
    'Houston Texans': 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png',
    'Jacksonville Jaguars': 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png',
    'Los Angeles Chargers': 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png',
    'Carolina Panthers': 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png',
    'New Orleans Saints': 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png',
    'Tampa Bay Buccaneers': 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png',
    'Los Angeles Lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    'Boston Celtics': 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
    'Golden State Warriors': 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
    'Milwaukee Bucks': 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
    'Phoenix Suns': 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
    'Denver Nuggets': 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
    'Philadelphia 76ers': 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
    'Brooklyn Nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
    'Miami Heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
    'New York Knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
    'Dallas Mavericks': 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
    'Memphis Grizzlies': 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png',
    'Cleveland Cavaliers': 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
    'Sacramento Kings': 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png',
    'Oklahoma City Thunder': 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
    'Minnesota Timberwolves': 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
    'New Orleans Pelicans': 'https://a.espncdn.com/i/teamlogos/nba/500/no.png',
    'Atlanta Hawks': 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
    'Toronto Raptors': 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
    'Chicago Bulls': 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
    'Indiana Pacers': 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png',
    'LA Clippers': 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png',
    'Portland Trail Blazers': 'https://a.espncdn.com/i/teamlogos/nba/500/por.png',
    'Houston Rockets': 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
    'Charlotte Hornets': 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
    'San Antonio Spurs': 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
    'Utah Jazz': 'https://a.espncdn.com/i/teamlogos/nba/500/utah.png',
    'Orlando Magic': 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
    'Detroit Pistons': 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
    'Washington Wizards': 'https://a.espncdn.com/i/teamlogos/nba/500/wsh.png',
  }
                  const logoPath = badgeMap[teamName]
                  const initials = teamName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
                  if (logoPath) {
                    return <img src={logoPath} alt={teamName} width={size} height={size} className="object-contain flex-shrink-0 rounded-full" decoding="sync" onError={(e) => { const t = e.currentTarget; t.style.display = 'none'; const s = document.createElement('div'); s.className = 'rounded-full bg-white/20 flex items-center justify-center flex-shrink-0'; s.style.width = size + 'px'; s.style.height = size + 'px'; s.innerHTML = '<span style="font-size:' + Math.max(size * 0.35, 5) + 'px;line-height:1" class="font-bold text-white/80">' + initials + '</span>'; if (t.parentElement) t.parentElement.insertBefore(s, t); }} />
                  }
                  return <div className="rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}><span style={{ fontSize: Math.max(size * 0.35, 5), lineHeight: 1 }} className="font-bold text-white/80">{initials}</span></div>
                }
                
                // Markets carousel - with arrows on desktop
                const MarketsCarousel = () => {
                  const containerRef = useRef<HTMLDivElement>(null)
                  const [canScrollLeft, setCanScrollLeft] = useState(false)
                  const [canScrollRight, setCanScrollRight] = useState(false)
                  
                  const checkScroll = useCallback(() => {
                    if (containerRef.current) {
                      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
                      setCanScrollLeft(scrollLeft > 0)
                      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
                    }
                  }, [])
                  
                  useEffect(() => {
                    checkScroll()
                    const container = containerRef.current
                    if (container) {
                      container.addEventListener('scroll', checkScroll)
                      window.addEventListener('resize', checkScroll)
                    return () => {
                        container.removeEventListener('scroll', checkScroll)
                        window.removeEventListener('resize', checkScroll)
                      }
                    }
                  }, [checkScroll])
                  
                  const scrollLeft = () => {
                    if (containerRef.current) {
                      containerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
                    }
                  }
                  
                  const scrollRight = () => {
                    if (containerRef.current) {
                      containerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
                    }
                  }
                  
                  return (
                    <div className="w-full relative" style={{ overflow: 'visible' }}>
                      {/* Left Arrow - Desktop Only */}
                      {!isMobile && canScrollLeft && (
                      <button 
                          onClick={scrollLeft}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 border border-white/30 rounded-full p-1.5 flex items-center justify-center transition-colors shadow-lg"
                          style={{ marginLeft: '-24px' }}
                        >
                          <IconChevronLeft className="w-4 h-4 text-white" />
                        </button>
                      )}
                      
                      {/* Scrollable Markets Container - Full width of card, no clipping */}
                      <div 
                        ref={containerRef}
                        className="w-full overflow-x-auto scrollbar-hide flex items-center gap-0 relative"
                        style={{ 
                          scrollBehavior: 'smooth',
                          WebkitOverflowScrolling: 'touch',
                          touchAction: 'pan-x',
                          paddingLeft: isMobile ? '10px' : (canScrollLeft ? '32px' : '10px'),
                          paddingRight: isMobile ? '10px' : (canScrollRight ? '32px' : '10px')
                        }}
                      >
                        <div className="flex items-center gap-0" style={{ width: 'max-content' }}>
                          {event.markets.map((market, marketIndex) => (
                            <React.Fragment key={marketIndex}>
                              <div className="flex flex-col items-center flex-shrink-0">
                                {/* Market Title - Centered */}
                                <div className="text-[10px] text-white/50 mb-1.5 leading-none text-center whitespace-nowrap px-1">{market.title}</div>
                                {/* Market Options - 2 rows for Football/NFL, 1 row for Soccer */}
                                {activeSport === 'Football' ? (
                                  <div className="flex flex-col gap-1">
                                    {/* For Football: Top button = Team 1, Bottom button = Team 2 */}
                                    {market.options.slice(0, 2).map((option, optionIndex) => {
                                      // Ensure first option is team1, second is team2
                                      const isTeam1 = optionIndex === 0
                                      const isTeam2 = optionIndex === 1
                                      const isSelected = isBetSelected(event.id, market.title, option.label)
                                      return (
                                        <button
                                          key={`${event.id}-${market.title}-${option.label}-${optionIndex}`}
                                          data-event-id={event.id}
                                          data-event-name={`${event.team1} v ${event.team2}`}
                                          data-market-title={market.title}
                                          data-selection={option.label}
                                          data-odds={option.odds}
                                          data-team={isTeam1 ? 'team1' : 'team2'}
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            const eventName = `${event.team1} v ${event.team2}`
                                            if (isSelected) {
                                              // Deselect: remove this bet from the betslip
                                              setBets(prev => prev.filter(bet => 
                                                !(bet.eventId === event.id && bet.marketTitle === market.title && bet.selection === option.label)
                                              ))
                                            } else {
                                              // Select new option: remove any existing bet for this market first, then add
                                              setBets(prev => prev.filter(bet => 
                                                !(bet.eventId === event.id && bet.marketTitle === market.title)
                                              ))
                                              addBetToSlip(event.id, eventName, market.title, option.label, option.odds)
                                            }
                                          }}
                                          className={cn(
                                            "text-white rounded-small w-[68px] h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2 flex-shrink-0",
                                            isSelected 
                                              ? "bg-red-500 hover:bg-red-600" 
                                              : "bg-white/10 hover:bg-white/20"
                                          )}
                                          onMouseEnter={(e) => {
                                            if (!isSelected) {
                                              e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (!isSelected) {
                                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                                            }
                                          }}
                                        >
                                          <div className="text-[10px] text-white/70 leading-none mb-0.5 truncate w-full text-center">{option.label}</div>
                                          <div className="text-xs font-bold leading-none">{option.odds}</div>
                                        </button>
                                      )
                                    })}
                                  </div>
                                ) : (
                                <div className="flex gap-1 h-[38px] items-center">
                                  {market.options.map((option, optionIndex) => {
                                    const isSelected = isBetSelected(event.id, market.title, option.label)
                                    return (
                                      <button
                                        key={optionIndex}
                                          data-event-id={event.id}
                                          data-event-name={`${event.team1} v ${event.team2}`}
                                          data-market-title={market.title}
                                          data-selection={option.label}
                                          data-odds={option.odds}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          const eventName = `${event.team1} v ${event.team2}`
                                          addBetToSlip(event.id, eventName, market.title, option.label, option.odds)
                                        }}
                                        className={cn(
                                          "text-white rounded-small w-[68px] h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2 flex-shrink-0",
                                          isSelected 
                                            ? "bg-red-500 hover:bg-red-600" 
                                            : "bg-white/10 hover:bg-white/20"
                                        )}
                        onMouseEnter={(e) => {
                                          if (!isSelected) {
                          e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                                          }
                        }}
                        onMouseLeave={(e) => {
                                          if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                                          }
                        }}
                      >
                                        <div className="text-[10px] text-white/70 leading-none mb-0.5 truncate w-full text-center">{option.label}</div>
                                        <div className="text-xs font-bold leading-none">{option.odds}</div>
                      </button>
                                    )
                                  })}
                                </div>
                                )}
                              </div>
                              {/* Vertical Divider */}
                              {marketIndex < event.markets.length - 1 && (
                                <div className="w-px h-[38px] bg-white/10 mx-2 flex-shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right Arrow - Desktop Only */}
                      {!isMobile && canScrollRight && (
                      <button 
                          onClick={scrollRight}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 border border-white/30 rounded-full p-1.5 flex items-center justify-center transition-colors shadow-lg"
                          style={{ marginRight: '-24px' }}
                        >
                          <IconChevronRight className="w-4 h-4 text-white" />
                      </button>
                      )}
                    </div>
                  )
                }
                
                // Parse time to get minutes
                const parseTimeToMinutes = (timeStr: string): string => {
                  // If time is like "Today 15:00", extract and calculate minutes until that time
                  // For now, just return a simple format like "12min"
                  if (timeStr.includes('Today')) {
                    // Extract time and calculate minutes
                    const timeMatch = timeStr.match(/(\d{2}):(\d{2})/)
                    if (timeMatch) {
                      const [_, hours, minutes] = timeMatch
                      const now = new Date()
                      const eventTime = new Date()
                      eventTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
                      if (eventTime < now) {
                        eventTime.setDate(eventTime.getDate() + 1)
                      }
                      const diffMs = eventTime.getTime() - now.getTime()
                      const diffMins = Math.floor(diffMs / 60000)
                      return `${diffMins}min`
                    }
                  }
                  return timeStr
                }
                
                return (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-small" style={{ overflow: 'visible', width: '100%' }}>
                    {/* Header Section - Premier League | England, Soccer */}
                    <div className="px-2.5 py-1.5 flex items-center justify-between" style={{ alignItems: 'center' }}>
                      <div className="flex items-center gap-1">
                        {(() => {
                          const leagueData = leagues.find(l => l.name === event.league)
                          const isSvgPath = leagueData && typeof leagueData.icon === 'string'
                          return isSvgPath ? (
                            <img 
                              src={leagueData.icon as unknown as string} 
                              alt={event.league}
                              width={12}
                              height={12}
                              className="object-contain"
                              decoding="sync"
                            />
                          ) : (
                            <IconTrophy className="w-3 h-3 text-white/70" />
                          )
                        })()}
                        <span className="text-[9px] text-white/70">{event.league}</span>
                        <span className="text-[9px] text-white/50">|</span>
                        <span className="text-[9px] text-white/70">{event.country}</span>
                        <span className="text-[9px] text-white/50">,</span>
                        <span className="text-[9px] text-white/70">Soccer</span>
                      </div>
                    </div>
                    
                    {/* Main Content Row - Status, Teams, Markets (Desktop) or just Status, Teams (Mobile) */}
                    <div className="px-2.5 py-2 flex items-center gap-2" style={{ overflow: 'visible', alignItems: 'center' }}>
                      {/* Status/Time Badge - UPCOMING */}
                      <div className="flex flex-col items-start justify-center gap-0.5 flex-shrink-0 w-[50px]">
                        <div className="flex items-center gap-0.5 bg-green-500/20 border border-green-500/50 rounded px-1 py-0.5 whitespace-nowrap">
                          <span className="text-[8px] font-semibold text-green-400">UPCOMING</span>
                  </div>
                        <span className="text-[8px] text-white/70">{parseTimeToMinutes(event.time)}</span>
                </div>
                      
                      {/* Teams - Fixed width for alignment with logos */}
                      <div className={cn("flex flex-col gap-1 min-w-0 justify-center", isMobile ? "flex-1" : "w-[200px] flex-shrink-0")}>
                        <div className="flex items-center gap-1.5">
                          <TeamLogoComponent teamName={event.team1} size={12} />
                          <div className="text-[11px] font-semibold text-white truncate leading-tight">{event.team1}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TeamLogoComponent teamName={event.team2} size={12} />
                          <div className="text-[11px] font-semibold text-white truncate leading-tight">{event.team2}</div>
                        </div>
                      </div>
                      
                      {/* Betting Markets - Desktop: Inline with teams */}
                      {!isMobile && (
                        <div className="flex-1 relative min-w-0" style={{ overflow: 'visible' }}>
                      <MarketsCarousel />
                    </div>
                      )}
                    </div>
                    
                    {/* Betting Markets - Mobile: Under team names */}
                    {isMobile && (
                      <div className="w-full pb-2" style={{ overflow: 'visible' }}>
                        <MarketsCarousel />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Slots Carousel Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white pl-2">Slots (128)</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small whitespace-nowrap transition-colors duration-300"
                  onClick={() => {
                    router.push('/casino?category=Slots')
                  }}
                >
                  All Games
                </Button>
                {!isMobile && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (sportsSlotsCarouselApi) {
                          const currentIndex = sportsSlotsCarouselApi.selectedScrollSnap()
                          const targetIndex = Math.max(0, currentIndex - 2)
                          sportsSlotsCarouselApi.scrollTo(targetIndex)
                        }
                      }}
                      disabled={!sportsSlotsCarouselApi || !sportsSlotsCanScrollPrev}
                    >
                      <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (sportsSlotsCarouselApi) {
                          const currentIndex = sportsSlotsCarouselApi.selectedScrollSnap()
                          const slideCount = sportsSlotsCarouselApi.scrollSnapList().length
                          const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                          sportsSlotsCarouselApi.scrollTo(targetIndex)
                        }
                      }}
                      disabled={!sportsSlotsCarouselApi || !sportsSlotsCanScrollNext}
                    >
                      <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="relative -mx-6" style={{ overflow: 'visible', position: 'relative', width: 'calc(100% + 3rem)', maxWidth: 'none', boxSizing: 'border-box', minWidth: 0 }}>
              <Carousel setApi={setSportsSlotsCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                <CarouselContent className="ml-6 mr-0">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const imageSrc = squareTileImages[index % squareTileImages.length]
                    return (
                      <CarouselItem key={index} className={index === 0 ? "pl-0 pr-0 basis-auto flex-shrink-0" : "pl-2 md:pl-4 basis-auto flex-shrink-0"}>
                        <div 
                          data-content-item 
                          className="w-[160px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                        >
                          {imageSrc && (
                            <Image
                              src={imageSrc}
                              alt={`Game ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="160px"
                            />
                          )}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                        </div>
                      </CarouselItem>
                    )
                  })}
                  
                  {/* Placeholder Slots tiles to fill gaps on large screens */}
                  {Array.from({ length: 20 }).map((_, index) => (
                    <CarouselItem key={`slots-placeholder-${index}`} className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                      <div className="w-[160px] h-[160px] rounded-small flex-shrink-0">
                        <Skeleton className="w-full h-full rounded-small bg-white/10 dark:bg-white/10" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
        )}
        
        {/* Footer - responsive to sidebar state */}
        <SiteFooter />
      </SidebarInset>
      {/* Betslip Drawer - Floating from bottom, grows upward */}
      <FamilyDrawerRoot 
        views={betslipViews} 
        open={betslipOpen}
        defaultView={showConfirmation ? 'confirmation' : 'default'}
        onOpenChange={(open) => {
          if (!open) {
            setBetslipOpen(false)
            setBetslipMinimized(false)
            setShowConfirmation(false)
            // Restore body scroll when betslip closes
            document.body.style.overflow = 'auto'
            document.body.style.position = ''
            document.body.style.touchAction = ''
            if (isMobile) {
              setBetslipManuallyClosed(true)
            }
          } else if (open) {
            setBetslipOpen(true)
            if (isMobile) {
              setBetslipManuallyClosed(false)
            }
          }
        }}
      >
        <FamilyDrawerContent 
          className="bg-white rounded-t-[7px] shadow-2xl"
        >
          <FamilyDrawerAnimatedWrapper 
            key={`betslip-${betslipMinimized}`}
            className="px-0 py-0"
          >
            <FamilyDrawerAnimatedContent>
              <BetslipViewSwitcher />
              {showConfirmation ? <BetslipConfirmationView /> : renderBetslipDefault()}
            </FamilyDrawerAnimatedContent>
          </FamilyDrawerAnimatedWrapper>
        </FamilyDrawerContent>
      </FamilyDrawerRoot>

      {/* Draggable Sports Tracker Widget */}
      <SportsTrackerWidget
        event={trackerEvent}
        onClose={() => setTrackerEvent(null)}
        sidebarWidth={sidebarPixelWidth}
      />

    </div>
  )
}

// VIP Drawer Content Component
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
    
    // Initial check with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
    checkScroll()
    }, 100)
    
    // Check on scroll
    const handleScroll = () => {
      checkScroll()
    }
    
    // Check on resize
    const handleResize = () => {
      checkScroll()
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timeoutId)
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [vipDrawerOpen, checkScroll, vipTabsContainerRef])

  // Scroll to active tab when it changes
  useEffect(() => {
    if (!vipDrawerOpen) return
    
    const container = vipTabsContainerRef.current
    if (!container) return

    const tabs = ['VIP', 'Benefits', 'Daily Races', 'Bet & Get', 'Cash Drop Codes']
    const activeIndex = tabs.indexOf(vipActiveTab)
    
    if (activeIndex === -1) return

    // Find the active tab button
    const tabButtons = container.querySelectorAll('button')
    const activeButton = tabButtons[activeIndex]
    
    if (activeButton) {
      // Calculate scroll position to center the active tab
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      const scrollLeft = container.scrollLeft
      const buttonLeft = buttonRect.left - containerRect.left + scrollLeft
      const buttonWidth = buttonRect.width
      const containerWidth = containerRect.width
      
      // Center the button in the container
      const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2)
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
      
      // Update scroll state after animation
      setTimeout(() => {
        checkScroll()
      }, 500)
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
      {/* Tab Carousel with background like casino sub nav */}
      <div className={cn("pt-2 pb-3 relative z-10 flex-shrink-0 overflow-visible", isMobile ? "pl-3 pr-0" : "pl-4 pr-0")}>
        {/* Left Arrow - Desktop Only */}
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
            className="bg-white/5 dark:bg-white/5 bg-gray-100/80 dark:bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300 backdrop-blur-xl flex items-center"
            style={{
              minWidth: 'max-content',
              width: 'max-content',
              flexShrink: 0,
              marginLeft: isMobile ? '0px' : '0px',
              marginRight: '16px',
              paddingLeft: 0,
              paddingRight: 0,
              touchAction: 'pan-x',
              pointerEvents: 'auto'
            }}
          >
            {['VIP', 'Benefits', 'Daily Races', 'Bet & Get', 'Cash Drop Codes'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => setVipActiveTab(tab)}
                className={cn(
                  "relative px-4 py-1 h-9 text-xs font-medium rounded-2xl transition-all duration-300 whitespace-nowrap flex-shrink-0",
                  vipActiveTab === tab
                    ? "text-black bg-[#fef3c7]"
                    : "text-white/70 hover:text-white hover:bg-white/5 dark:hover:bg-white/5 bg-transparent"
                )}
                style={{
                  scrollSnapAlign: 'start',
                  touchAction: 'manipulation'
                }}
              >
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Right Arrow - Desktop Only */}
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

        
        

        
        
      </VipHubScrollBody>
    </div>
  )
}

function NavTestPageContent() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const [loadingNav, setLoadingNav] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState('For You')
  const [activeSubNav, setActiveSubNav] = useState('For You')
  const [gameSortFilter, setGameSortFilter] = useState<string>('popular')
  const [activeIconTab, setActiveIconTab] = useState('search')
  const [quickLinksOpen, setQuickLinksOpen] = useState(false)
  const [loadingQuickLink, setLoadingQuickLink] = useState<string | null>(null)
  const lastScrollYRef = useRef(0)
  const [depositDrawerOpen, setDepositDrawerOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState(25)
  const [useManualAmount, setUseManualAmount] = useState(false)
  const [selectedCard, setSelectedCard] = useState('Mastercard **** 0740')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bitcoin')
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false)
  const [depositStep, setDepositStep] = useState<'started' | 'processing' | 'almost' | 'complete'>('started')
  const [transactionId, setTransactionId] = useState<string>('')
  const [isDepositLoading, setIsDepositLoading] = useState(false)
  const [balance, setBalance] = useState(10)
  const [displayBalance, setDisplayBalance] = useState(10)
  useRainBalance(setBalance, setDisplayBalance)
  const pendingBalanceRef = useRef(0)
  const [claimedBoosts, setClaimedBoosts] = useState<Set<string>>(new Set())
  const [boostProcessing, setBoostProcessing] = useState<string | null>(null)
  const [boostClaimMessage, setBoostClaimMessage] = useState<{ amount: number } | null>(null)
  const [stepLoading, setStepLoading] = useState<{started: boolean, processing: boolean, almost: boolean, complete: boolean}>({
    started: false,
    processing: false,
    almost: false,
    complete: false
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null)

  useEffect(() => {
    const handleProfitBoostOptInToggled = (evt: Event) => {
      const detail = (evt as CustomEvent<{ optedIn?: boolean }>).detail
      if (!detail?.optedIn) return
      setToastMessage('Profit Boost opted in. Odds boost activates after $50 risk on Premier League.')
      setToastAction(null)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2200)
    }
    window.addEventListener('profit-boost-optin-toggled', handleProfitBoostOptInToggled as EventListener)
    return () => window.removeEventListener('profit-boost-optin-toggled', handleProfitBoostOptInToggled as EventListener)
  }, [setShowToast, setToastMessage, setToastAction])

  
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false)
  const [vipDrawerOpen, setVipDrawerOpen] = useState(false)
  const [accountDrawerView, setAccountDrawerView] = useState<'account' | 'notifications'>('account')

  // Mutual exclusion helpers — only one drawer open at a time
  const openAccountDrawer = useCallback(() => {
    if (accountDrawerOpen) {
      setAccountDrawerOpen(false)
      return
    }
    setVipDrawerOpen(false)
    setDepositDrawerOpen(false)
    setAccountDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [accountDrawerOpen])
  const openVipDrawer = useCallback(() => {
    if (vipDrawerOpen) {
      setVipDrawerOpen(false)
      return
    }
    setAccountDrawerOpen(false)
    setDepositDrawerOpen(false)
    setVipDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [vipDrawerOpen])

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
    setAccountDrawerOpen(false)
    setVipDrawerOpen(false)
    setDepositDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [depositDrawerOpen])

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

  // Copy parlay from chat to betslip
  useEffect(() => {
    const handleCopyBet = (e: Event) => {
      const detail = (e as CustomEvent).detail as { legs: { event: string; selection: string; odds: string }[] } | undefined
      if (!detail?.legs?.length) return
      // Build new bets from the parlay legs
      const newBets = detail.legs.map((leg, i) => ({
        id: `chat-copy-${Date.now()}-${i}`,
        eventId: Date.now() + i,
        eventName: leg.event,
        marketTitle: 'Match Result',
        selection: leg.selection,
        odds: leg.odds,
        stake: 0,
      }))
      setBets(newBets)
      setBetslipOpen(true)
      setBetslipMinimized(false)
    }
    window.addEventListener('bet:copy-to-slip', handleCopyBet)
    return () => window.removeEventListener('bet:copy-to-slip', handleCopyBet)
  }, [])


  const [vipActiveTab, setVipActiveTab] = useState('VIP')
  const [betslipOpen, setBetslipOpen] = useState(false)
  const [betslipMinimized, setBetslipMinimized] = useState(false)
  const [betslipManuallyClosed, setBetslipManuallyClosed] = useState(false)
  const [activeSport, setActiveSport] = useState<string>('Baseball') // Track active sport type
  const [bets, setBets] = useState<Array<{
    id: string
    eventId: number
    eventName: string
    marketTitle: string
    selection: string
    odds: string
    stake: number
  }>>([])
  const [placedBets, setPlacedBets] = useState<Array<{
    id: string
    eventId: number
    eventName: string
    marketTitle: string
    selection: string
    odds: string
    stake: number
    placedAt: Date
  }>>([])
  const [myBetsAlertCount, setMyBetsAlertCount] = useState(0)
  const vipTabsContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollVipLeft, setCanScrollVipLeft] = useState(false)
  const [canScrollVipRight, setCanScrollVipRight] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [showAllGames, setShowAllGames] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedVendor, setSelectedVendor] = useState<string>('')
  const [showSports, setShowSports] = useState(true) // Always true for sports page
  const [showVipRewards, setShowVipRewards] = useState(false)
  const [showMyBets, setShowMyBets] = useState(false)
  const [myBetsInitialFilter, setMyBetsInitialFilter] = useState<'all' | 'cash_out' | 'in_play' | 'pending' | 'graded'>('all')
  const [initialVipSidebarItem, setInitialVipSidebarItem] = useState<string | null>(null)
  const [vipActiveSidebarItem, setVipActiveSidebarItem] = useState<string>('Overview')
  
  // Sync initialVipSidebarItem -> vipActiveSidebarItem
  useEffect(() => {
    if (initialVipSidebarItem) {
      setVipActiveSidebarItem?.(initialVipSidebarItem)
      setTimeout(() => setInitialVipSidebarItem(null), 100)
    }
  }, [initialVipSidebarItem])
  const [previousPageState, setPreviousPageState] = useState<{ showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null>(null)
  const [sportsActiveTab, setSportsActiveTab] = useState('Events')
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'card' | 'pack'>('card')
  const [favoritedGames, setFavoritedGames] = useState<Set<number>>(new Set())
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<{ title: string; image: string; provider?: string; features?: string[] } | null>(null)
  const [gameLauncherMenuOpen, setGameLauncherMenuOpen] = useState(false)
  const [similarGamesDrawerOpen, setSimilarGamesDrawerOpen] = useState(false)
  const [gameImageLoaded, setGameImageLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const gameLauncherMenuRef = useRef<HTMLDivElement>(null)
  const gameImageRef = useRef<HTMLDivElement>(null)
  
  // Detect landscape orientation on mobile
  useEffect(() => {
    if (!isMobile) return
    
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
    
    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [isMobile])
  
  // Helper function to hash game title to a number for favoritedGames Set
  const hashGameTitle = (title: string): number => {
    let hash = 0
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }
  const [selectedBrand, setSelectedBrand] = useState<'betonline' | 'wildcasino' | 'superslots'>('betonline')
  
  // Close menu when game launcher closes and reset image loaded state
  useEffect(() => {
    if (!selectedGame) {
      setGameLauncherMenuOpen(false)
      setGameImageLoaded(false)
      setIsFullscreen(false)
    } else {
      // Reset image loaded state when new game is selected
      setGameImageLoaded(false)
      setIsFullscreen(false)
    }
  }, [selectedGame])
  
  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).msFullscreenElement))
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gameLauncherMenuRef.current && !gameLauncherMenuRef.current.contains(event.target as Node)) {
        setGameLauncherMenuOpen(false)
      }
    }
    
    if (gameLauncherMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [gameLauncherMenuOpen])
  const bannerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const subNavScrollRef = useRef<HTMLDivElement>(null)
  const [isContentUnderNav, setIsContentUnderNav] = useState(false)
  const { state: sidebarState, open: sidebarOpen, setOpen, openMobile, setOpenMobile, toggleSidebar } = useSidebar()
  const [showQuickLinksMenu, setShowQuickLinksMenu] = useState(false)
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false)

  // Debug: Log drawer state changes
  useEffect(() => {
    console.log('depositDrawerOpen state changed to:', depositDrawerOpen)
  }, [depositDrawerOpen])

  // Sync URL when VIP Rewards page is shown/hidden
  const originalPathRef = useRef(typeof window !== 'undefined' ? window.location.pathname : '/sports/football')
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (showVipRewards) {
      // Save current path before switching
      if (window.location.pathname !== '/vip-rewards') {
        originalPathRef.current = window.location.pathname
      }
      window.history.replaceState(null, '', '/vip-rewards')
    } else {
      // Restore previous path when leaving VIP
      if (window.location.pathname === '/vip-rewards') {
        window.history.replaceState(null, '', originalPathRef.current || '/sports/football')
      }
    }
  }, [showVipRewards])

  const handleDepositDrawerOpenChange = React.useCallback((open: boolean) => {
    setDepositDrawerOpen(open)
    if (!open) {
      // Reset confirmation state when drawer closes
      setShowDepositConfirmation(false)
      setDepositStep('started')
      setTransactionId('')
      setIsDepositLoading(false)
      setStepLoading({started: false, processing: false, almost: false, complete: false})
    } else {
      // Close other drawers when deposit drawer opens
      if (isMobile) {
        setAccountDrawerOpen(false)
        setVipDrawerOpen(false)
      }
    }
  }, [isMobile])

  const handleBoostClaimed = React.useCallback((amount: number) => {
    // Track pending balance increase — will animate when drawer closes
    pendingBalanceRef.current += amount
  }, [])

  const handleVipDrawerOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      // Drawer is closing — animate any pending balance from claimed boosts
      const pendingAmount = pendingBalanceRef.current
      if (pendingAmount > 0) {
        pendingBalanceRef.current = 0
        // Wait for drawer close animation, then roll up balance
        setTimeout(() => {
          setBalance(prev => {
            const newBal = +(prev + pendingAmount).toFixed(2)
            setDisplayBalance(currentDisplay => {
              const start = currentDisplay
              const end = newBal
              const duration = 1500
              const startTime = performance.now()
              const animate = (now: number) => {
                const elapsed = now - startTime
                const progress = Math.min(elapsed / duration, 1)
                const eased = 1 - Math.pow(1 - progress, 3)
                setDisplayBalance(+(start + (end - start) * eased).toFixed(2))
                if (progress < 1) requestAnimationFrame(animate)
              }
              requestAnimationFrame(animate)
              return currentDisplay
            })
            return newBal
          })
        }, 500)
      }
      
      // Reset boost states
      setBoostProcessing(null)
      setBoostClaimMessage(null)
    } else {
      // Close other drawers when VIP drawer opens
      if (isMobile) {
        setAccountDrawerOpen(false)
        setDepositDrawerOpen(false)
      }
    }
    setVipDrawerOpen(open)
  }, [isMobile])

  // Brand configurations using design system tokens
  const brands = {
    betonline: { 
      name: 'BetOnline', 
      token: 'USD', 
      symbol: '$',
      primaryColor: colorTokenMap['betRed/500']?.hex || '#ee3536',
      primaryHover: colorTokenMap['betRed/700']?.hex || '#dc2a2f',
      logo: (
        <svg viewBox="0 0 640 86" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <g id="BETONLINE">
            <path fillRule="evenodd" clipRule="evenodd" d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z" fill={colorTokenMap['betRed/500']?.hex || '#ee3536'}/>
            <path d="M120.693 85.7021V0.0993091H178.194V17.4781H140.558V33.6651H176.197V50.2494H140.658V68.0254H180.39V85.7021H120.693Z" fill={colorTokenMap['betRed/500']?.hex || '#ee3536'}/>
            <path d="M257.757 8.54042C261.251 5.16397 265.244 2.38337 269.736 0.0993091H185.781V17.776H209.939V85.7021H230.604V17.776H250.37C252.466 14.3995 254.962 11.321 257.757 8.54042Z" fill={colorTokenMap['betRed/500']?.hex || '#ee3536'}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M313.761 3.47575C319.151 5.66051 323.843 8.63973 327.737 12.5127C331.63 16.3857 334.625 20.9538 336.821 26.1178C339.017 31.3811 340.115 37.0416 340.115 43.0993C340.115 49.1571 339.017 54.9169 336.821 60.0808C334.625 65.2448 331.63 69.8129 327.737 73.6859C323.843 77.4596 319.151 80.5381 313.761 82.7229C308.27 84.9076 302.28 86 295.891 86C289.403 86 283.413 84.9076 278.022 82.7229C272.631 80.5381 267.939 77.5589 264.046 73.6859C260.253 69.9122 257.158 65.2448 254.962 60.0808C252.766 54.8176 251.667 49.1571 251.667 43.0993C251.667 37.0416 252.766 31.2818 254.962 26.1178C257.158 20.9538 260.153 16.3857 264.046 12.5127C267.939 8.73903 272.631 5.66051 278.022 3.47575C283.513 1.291 289.502 0.198618 295.891 0.198618C302.38 0.198618 308.37 1.291 313.761 3.47575ZM324.642 55.3141C326.139 51.5404 326.838 47.3695 326.838 43.0993C326.838 38.8291 326.04 34.6582 324.642 30.8845C323.244 27.1109 321.148 23.7344 318.453 20.9538C315.757 18.1732 312.563 15.8891 308.769 14.2009C305.076 12.5127 300.783 11.7182 296.091 11.7182C291.399 11.7182 287.206 12.5127 283.413 14.2009C279.719 15.8891 276.425 18.1732 273.73 20.9538C271.134 23.7344 269.038 27.1109 267.54 30.8845C266.043 34.6582 265.344 38.8291 265.344 43.0993C265.344 47.3695 266.043 51.5404 267.54 55.3141C268.938 59.0878 271.034 62.4642 273.73 65.2448C276.425 68.0254 279.619 70.3095 283.413 71.9977C287.107 73.6859 291.399 74.4804 296.091 74.4804C300.783 74.4804 304.976 73.6859 308.769 71.9977C312.463 70.3095 315.757 68.0254 318.453 65.2448C321.048 62.4642 323.145 59.0878 324.642 55.3141Z" fill="white"/>
            <path d="M437.847 0.0993091H425.069V85.6028H476.681V74.1824H437.847V0.0993091Z" fill="white"/>
            <path d="M484.268 0.0993091H497.046V85.7021H484.268V0.0993091Z" fill="white"/>
            <path d="M594.778 74.1824V48.2633H634.909V36.7436H594.778V11.6189H637.804V0.0993091H582V85.6028H640V74.1824H594.778Z" fill="white"/>
            <path d="M347.802 0.0993091L405.403 56.903V0.0993091H417.482V85.6028L359.782 29.4942V85.6028H347.802V0.0993091Z" fill="white"/>
            <path d="M562.333 57.3002L504.633 0.0993091V85.6028H516.712V29.8915L574.313 85.2055V0.0993091H562.333V57.3002Z" fill="white"/>
          </g>
        </svg>
      )
    },
    wildcasino: { 
      name: 'Wild Casino', 
      token: 'WC', 
      symbol: 'WC',
      primaryColor: colorTokenMap['WildNeonGreen 2/500']?.hex || '#6cea75',
      primaryHover: colorTokenMap['WildNeonGreen 2/700']?.hex || '#56c65f',
      logo: (
        <div className="flex items-center justify-center h-full">
          <span className="text-white font-bold text-lg tracking-wide">WILD CASINO</span>
        </div>
      )
    },
    superslots: { 
      name: 'Super Slots', 
      token: 'SS', 
      symbol: 'SS',
      primaryColor: colorTokenMap['Supercyan/500']?.hex || '#63fffb',
      primaryHover: colorTokenMap['Supercyan/700']?.hex || '#18e9e6',
      logo: (
        <div className="flex items-center justify-center h-full">
          <span className="text-white font-bold text-lg tracking-wide">SUPER SLOTS</span>
        </div>
      )
    }
  }

  // Safely get current brand with fallback
  let currentBrand
  try {
    currentBrand = brands[selectedBrand] || brands.betonline
  } catch (e) {
    currentBrand = brands.betonline
  }
  
  // Use brand colors instead of design tokens with safe fallbacks
  const brandPrimary = 'var(--ds-primary, #ee3536)'
  const brandPrimaryHover = 'var(--ds-primary-hover, #dc2a2f)'

  // Remove blur effect from content items - rely only on sub-nav's backdrop-blur for glass effect
  // The backdrop-blur on the sub-nav will naturally blur content behind it

  // Mobile: Quick links scroll handler - show when scrolling up, hide when scrolling down
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        // Show at top
        setQuickLinksOpen(true)
      } else if (currentScrollY < lastScrollYRef.current) {
        // Show when scrolling up
        setQuickLinksOpen(true)
      } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 50) {
        // Hide when scrolling down (after 50px)
        setQuickLinksOpen(false)
      }
      
      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Ensure component is mounted before showing animations
  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date().toLocaleString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }))
  }, [])

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="w-full bg-[#1a1a1a] text-white font-figtree overflow-x-hidden min-h-screen flex items-center justify-center">
        <div className="text-white/70">Loading...</div>
      </div>
    )
  }

  const sidebarMenuItems = [
    { icon: IconHeart, label: 'My Favorites' },
    { icon: IconFlame, label: 'Popular Games' },
    { icon: IconDeviceGamepad2, label: 'Slots' },
    { icon: IconCards, label: 'Blackjack' },
    { icon: IconVideo, label: 'Video Poker' },
    { icon: IconDots, label: 'Specialty Games' },
    { icon: IconCards, label: 'Table Games' },
    { icon: IconBroadcast, label: 'Live Casino' },
    { icon: IconTrophy, label: 'Tournaments' },
  ]

  const gameFilters = ['For You', 'Bonus Buys', 'Megaways', 'Slots', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'New', 'Exclusive']

  return (
    <div 
      data-page-bg
      className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white font-figtree overflow-x-hidden min-h-screen transition-colors duration-300" 
      style={{ 
        width: '100%', 
        maxWidth: '100vw', 
        boxSizing: 'border-box',
        backgroundColor: 'var(--ds-page-bg, #1a1a1a)',
        '--brand-primary': brandPrimary,
        '--brand-primary-hover': brandPrimaryHover,
      } as React.CSSProperties}
    >
      {/* Mobile: Quick Links - Above main menu, pushes it down when open */}
      {isMobile && (
        <motion.div
          initial={false}
          animate={{
            height: quickLinksOpen ? 40 : 0
          }}
              transition={isMobile ? {
                type: "tween",
                ease: "linear",
                duration: 0.3
              } : {
                type: "tween",
                ease: "easeOut",
                duration: 0.2
              }}
          className="fixed left-0 right-0 overflow-hidden z-[100]"
          style={{ 
            top: 0, 
            pointerEvents: quickLinksOpen ? 'auto' : 'none',
            opacity: 1,
            visibility: 'visible',
            backgroundColor: 'var(--ds-nav-bg, #2D2E2C)',
          }}
        >
          <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-white/10">
                {[
                  { label: 'Home', onClick: () => { router.push('/'); setQuickLinksOpen(false); } },
                  { label: 'Sports', onClick: () => { setShowSports(true); setShowVipRewards(false); setQuickLinksOpen(false); } },
                  { label: 'Casino', onClick: () => { router.push('/casino'); setQuickLinksOpen(false); } },
                  { label: 'Poker', onClick: () => { router.push('/casino?poker=true'); setQuickLinksOpen(false); } },
                  { label: 'Promotions', onClick: () => { router.push('/promotions'); setQuickLinksOpen(false); } },
                  { label: 'Other', onClick: () => { setQuickLinksOpen(false); } },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={(e) => {
                      e.stopPropagation()
                      setLoadingQuickLink(item.label)
                      item.onClick()
                      setTimeout(() => setLoadingQuickLink(null), 1200)
                    }}
                    className={cn(
                      "flex-shrink-0 px-3 py-1.5 rounded-small text-xs font-medium transition-colors relative",
                      (item.label === 'Casino' && !showSports && !showVipRewards) ||
                      (item.label === 'Sports' && showSports) ||
                      (item.label === 'Promotions' && showVipRewards)
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    <span className={cn("transition-opacity duration-150", loadingQuickLink === item.label ? "opacity-0" : "opacity-100")}>{item.label}</span>
                    {loadingQuickLink === item.label && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <IconLoader2 className="w-3.5 h-3.5 text-white animate-spin" />
                      </span>
                    )}
                  </button>
                ))}
          </div>
        </motion.div>
      )}

      {/* Header - Sticky at top, always visible - Always grey in both themes */}
      <motion.header 
        data-nav-header
        className={cn(
          "bg-[#2D2E2C] dark:bg-[#2D2E2C] border-b border-white/10 h-16 flex items-center justify-between z-[101] fixed right-0",
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
          top: isMobile ? (quickLinksOpen ? 40 : 0) : 0,
          zIndex: 101,
          position: 'fixed',
          boxShadow: '0 -200px 0 0 var(--ds-nav-bg, #2D2E2C)',
        }}
      >
          <div className="flex items-center gap-6">
            {/* Hamburger + Logo — mobile only (desktop has sidebar logo) */}
            {isMobile && (
              <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/5"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
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
                onClick={() => {
                  router.push('/')
                }}
              >
                {currentBrand.logo}
              </div>
              </>
            )}
            
            {/* Navigation Menu - Desktop only */}
            {!isMobile && (
              <nav className="flex-1 flex items-center z-[110] -ml-1" style={{ pointerEvents: 'auto' }}>
                <SidebarMenu className="flex flex-row items-center gap-2">
                  {/* Sidebar collapse toggle — always visible on desktop */}
                  <div className="flex items-center gap-1.5 mr-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (sidebarState === 'collapsed') {
                          useChatStore.getState().setIsOpen(false)
                        }
                        toggleSidebar()
                      }}
                      className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                      </svg>
                    </Button>
                    <div className="w-px h-5 shrink-0 bg-white/25" aria-hidden />
                  </div>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showSports && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowSports(true)
                        setShowVipRewards(false)
                        window.scrollTo(0, 0)
                      }}
                      data-active={showSports}
                    >
                      {showSports && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Sports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        !showSports && !showVipRewards && activeSubNav !== 'Live' && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      data-active={!showSports && !showVipRewards && activeSubNav !== 'Live'}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push('/casino')
                      }}
                    >
                      {!showSports && !showVipRewards && activeSubNav !== 'Live' && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Casino</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "data-[active=true]:bg-white/10 data-[active=true]:text-white",
                        "text-white/70 active:bg-white/10 cursor-pointer"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push('/casino?poker=true')
                      }}
                    >
                      Poker
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showVipRewards && "!text-white"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setVipDrawerOpen(false)
                        router.push('/promotions')
                      }}
                      data-active={showVipRewards}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    >
                      {showVipRewards && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Promotions</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                            "hover:bg-white/5 hover:text-white transition-colors",
                            "data-[active=true]:bg-white/10 data-[active=true]:text-white",
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
                          <a href="#" className="w-full">Esports</a>
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
          
          <div className={cn(
            "flex items-center",
            isMobile ? "gap-2" : "gap-3"
          )} style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative' }}>
            <HeaderUserControls
              isLoggedIn
              balance={displayBalance}
              currencySymbol={currentBrand.symbol}
              vipDrawerOpen={vipDrawerOpen}
              onOpenAccount={openAccountDrawer}
              onOpenVip={openVipDrawer}
              onOpenDeposit={openDepositDrawer}
            />
</div>
        </motion.header>

        {/* Sports Sub Nav - Sticky with glass effect — hide during page transitions (e.g. sports→VIP) */}
        {showSports && !isPageTransitioning && (
          <motion.div
            data-sub-nav
            className={cn(
              "fixed z-[100] bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-xl border-b border-white/10 py-3 shadow-sm",
              isMobile ? "left-0 right-0" : "px-6"
            )}
            initial={false}
            animate={{
              top: isMobile ? (quickLinksOpen ? 104 : 64) : 64
            }}
            transition={isMobile ? {
              type: "tween",
              ease: "linear",
              duration: 0.3
            } : {
              type: "tween",
              ease: "easeOut",
              duration: 0.2
            }}
            style={isMobile ? { 
              top: quickLinksOpen ? 104 : 64,
              left: 0,
              right: 0,
              width: '100vw',
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: 0,
              paddingRight: 0,
              borderTop: 'none'
            } : {
              top: 64,
              left: sidebarState === 'collapsed' ? '3rem' : '16rem',
              right: 0
            }}
          >
            <div className="flex items-center gap-1.5">
              {/* Search Icon - Desktop Only, Left of My Bets */}
              {!isMobile && (
                <div className="flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSearchOverlayOpen(true)                    }}
                    className="flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1.5 rounded-small transition-colors hover:bg-white/5 cursor-pointer"
                    style={{ pointerEvents: 'auto', zIndex: 10 }}
                  >
                    <IconSearch className="w-5 h-5 text-white/70" />
                    <span className="text-[10px] text-white/70 font-medium">Search</span>
                  </button>
                </div>
              )}
              
              {/* My Bets Button - Always visible, doesn't scroll */}
              <div className="flex-shrink-0 relative">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Clear alert when My Bets is clicked
                    setMyBetsAlertCount(0)
                    setMyBetsInitialFilter('all')
                    setShowMyBets(true); window.scrollTo(0, 0)
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1.5 rounded-small transition-all duration-300 cursor-pointer relative",
                    showMyBets ? "bg-white/10" : "hover:bg-white/5",
                    isMobile && "pb-3"
                  )}
                  style={{ position: 'relative', overflow: 'visible' }}
                >
                  <div className="relative">
                  <IconTicket className={cn("w-5 h-5 transition-opacity duration-300", showMyBets ? "opacity-100 text-white" : "opacity-70 text-white/70")} />
                    {myBetsAlertCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
                      >
                        <span className="text-[8px] font-bold text-white leading-none">
                          {myBetsAlertCount > 9 ? '9+' : myBetsAlertCount}
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <span className={cn("text-[10px] font-medium transition-colors duration-300", showMyBets ? "text-white" : "text-white/70")}>My Bets</span>
                  {/* Red underline indicator */}
                  <div 
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ease-in-out z-10",
                      showMyBets ? "w-8 opacity-100" : "w-0 opacity-0",
                      isMobile ? "bottom-0" : "-bottom-2"
                    )}
                    style={showMyBets ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : {}}
                  />
                </button>
              </div>

              {/* Sports Icons - Scrollable */}
              <div 
                className={cn(
                  "flex items-center gap-1.5 flex-1 min-w-0",
                  isMobile && "overflow-x-auto scrollbar-hide"
                )}
                style={{
                  ...(isMobile ? {
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-x',
                    overscrollBehaviorX: 'contain',
                    scrollSnapType: 'x mandatory',
                    width: '100%',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    marginLeft: 0,
                    marginRight: 0,
                    boxSizing: 'border-box',
                    position: 'relative',
                    overflowX: 'auto',
                    overflowY: 'visible' // Changed from 'hidden' to 'visible' to show the red line
                  } : {
                    paddingLeft: '8px',
                    overflow: 'visible'
                  }),
                  pointerEvents: 'auto' as const
                } as React.CSSProperties}
              >
                {[
                  { icon: '/sports_icons/my-feed.svg', label: 'My Feed' },
                  { icon: '/sports_icons/baseball.svg', label: 'Baseball' },
                  { icon: '/sports_icons/soccer.svg', label: 'Soccer' },
                  { icon: '/sports_icons/tennis.svg', label: 'Tennis' },
                  { icon: '/sports_icons/table_tennis.svg', label: 'Table Tennis' },
                  { icon: '/sports_icons/football.svg', label: 'Football' },
                  { icon: '/sports_icons/volley.svg', label: 'Volleyball' },
                  { icon: '/sports_icons/mma.svg', label: 'MMA' },
                  { icon: '/sports_icons/rugby.svg', label: 'Rugby' },
                  { icon: '/sports_icons/Hockey.svg', label: 'Hockey' },
                  { icon: '/sports_icons/Basketball.svg', label: 'Basketball' },
                  { icon: '/sports_icons/pool.svg', label: 'Pool' },
                  { icon: '/sports_icons/lacrosse.svg', label: 'Lacrosse' },
                ].map((sport, index) => {
                  const isActive = sport.label === 'Baseball' && !showMyBets
                  return (
                    <button
                      key={sport.label}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        
                        const sportRoutes: Record<string, string> = {
                          'My Feed': '/sports/my-feed',
                          'Baseball': '/sports/baseball',
                          'Soccer': '/sports/soccer',
                          'Tennis': '/sports/tennis',
                          'Table Tennis': '/sports/table-tennis',
                          'Football': '/sports/football',
                          'Volleyball': '/sports/volleyball',
                          'MMA': '/sports/mma',
                          'Rugby': '/sports/rugby',
                          'Hockey': '/sports/hockey',
                          'Basketball': '/sports/basketball',
                          'Pool': '/sports/pool',
                          'Lacrosse': '/sports/lacrosse',
                        }
                        const route = sportRoutes[sport.label]
                        if (route) {
                          setLoadingNav(sport.label)
                          router.push(route)
                          return
                        }
                        router.push(`/sports?sport=${encodeURIComponent(sport.label)}`)
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1.5 rounded-small transition-all duration-300 cursor-pointer flex-shrink-0 relative", loadingNav === sport.label && "opacity-40",
                        "hover:bg-white/5 active:bg-white/15",
                        isActive && "bg-white/10",
                        isMobile && "pb-3" // Add extra padding bottom on mobile to accommodate the red line
                      )}
                      style={{
                        position: 'relative',
                        overflow: 'visible',
                        zIndex: isActive ? 10 : 1,
                        pointerEvents: 'auto',
                        userSelect: 'none',
                        WebkitUserSelect: 'none'
                      } as React.CSSProperties}
                    >
                      <img
                        src={sport.icon}
                        alt={sport.label}
                        width={20}
                        height={20}
                        className={cn(
                          "object-contain transition-opacity duration-300 pointer-events-none",
                          isActive ? "opacity-100" : "opacity-70"
                        )}
                        style={{ pointerEvents: 'none' }}
                        decoding="sync"
                        onError={(e) => {
                          console.error('Failed to load icon:', sport.icon)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <span 
                        className={cn(
                          "text-[10px] font-medium whitespace-nowrap transition-colors duration-300 pointer-events-none",
                          isActive ? "text-white" : "text-white/70"
                        )}
                        style={{ pointerEvents: 'none' }}
                      >
                        {sport.label}
                      </span>
                      {loadingNav === sport.label && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <IconLoader2 className="w-4 h-4 animate-spin text-white" />
                        </div>
                      )}
                      <div 
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ease-in-out z-10",
                          isActive ? "w-8 opacity-100" : "w-0 opacity-0",
                          isMobile ? "bottom-0" : "-bottom-2"
                        )}
                        style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : {}}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Deposit Drawer - Rendered outside header to avoid conflicts */}
        <QuickDepositDrawer
          open={depositDrawerOpen}
          onOpenChange={handleDepositDrawerOpenChange}
          isMobile={isMobile}
          currencySymbol={currentBrand.symbol}
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
                  const message = `Deposit of ${currentBrand.symbol}${depositAmount.toFixed(2)} was successful`
                  console.log('Showing toast:', message)
                  setToastMessage(message)
                  setShowToast(true)
                  setTimeout(() => {
                    console.log('Hiding toast')
                    setShowToast(false)
                  }, 3000)
                }
              }
              requestAnimationFrame(animate)
            }, 300)
          }}
        />

        {/* Content area with sidebar and main content - starts below header */}
        <div className="flex relative" style={{ marginTop: '64px' }}>
          {/* Persistent sidebar backdrop — prevents black flash during page transitions */}
          {!isMobile && (
            <>
            <div 
              className="fixed top-0 left-0 h-screen z-[101] transition-[width] duration-200 ease-linear"
              style={{ 
                width: sidebarOpen ? '16rem' : '3rem',
                backgroundColor: '#2d2d2d'
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
          {/* Sidebar using shadcn component - positioned under header - Hide on Sports and VIP Rewards */}
          {!showSports && !showVipRewards && (
          <Sidebar 
            collapsible="icon"
            variant="sidebar"
            className="!bg-[#2d2d2d] dark:!bg-[#2d2d2d] border-r border-white/10 text-white [&>div]:!bg-[#2d2d2d] dark:[&>div]:!bg-[#2d2d2d]"
          >
            <SidebarContent className="overflow-y-auto overflow-x-hidden flex flex-col">
              <TooltipProvider>
                <SidebarPromos
                  collapsed={sidebarState === 'collapsed' && !isMobile}
                />
                <Separator className="bg-white/10 mx-2 group-data-[collapsible=icon]:hidden" />
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {/* Casino Title with Animated Quick Links Menu - Mobile only */}
                      {isMobile && (
                        <AnimatePresence mode="wait">
                          {!showQuickLinksMenu ? (
                            <motion.div
                              key="casino-menu"
                              initial={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -30, scale: 0.95 }}
                              transition={{ 
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1]
                              }}
                            >
                              <SidebarMenuItem>
                                <div className="px-3 py-3 border-b border-white/10 mb-2">
                                  <button 
                                    type="button"
                                    className="w-full flex items-center justify-between text-white hover:text-white/80 transition-colors cursor-pointer"
                                    style={{ fontSize: '1.25rem', fontWeight: 700 }}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setShowQuickLinksMenu(true)
                                    }}
                                  >
                                    <span>Casino</span>
                                    <IconChevronRight className="h-5 w-5" />
                                  </button>
                                </div>
                              </SidebarMenuItem>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="quick-links-menu"
                              initial={{ opacity: 0, x: 30, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: 30, scale: 0.95 }}
                              transition={{ 
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1]
                              }}
                            >
                              <SidebarMenuItem>
                                <div className="px-3 py-3 border-b border-white/10 mb-2">
                                  <button 
                                    type="button"
                                    className="w-full flex items-center justify-start gap-2 text-white hover:text-white/80 transition-colors cursor-pointer mb-3"
                                    style={{ fontSize: '1.25rem', fontWeight: 700 }}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setShowQuickLinksMenu(false)
                                    }}
                                  >
                                    <IconChevronLeft className="h-5 w-5" />
                                    <span>Back</span>
                                  </button>
                                  <div className="space-y-1">
                                    <button
                                      className="w-full flex items-center justify-start px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowQuickLinksMenu(false)
                                        setOpenMobile(false)
                                        router.push('/casino')
                                        setQuickLinksOpen(false)
                                        window.scrollTo(0, 0)
                                      }}
                                    >
                                      Home
                                    </button>
                                    <button
                                      className="w-full flex items-center justify-start px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowQuickLinksMenu(false)
                                        setOpenMobile(false)
                                        setShowSports(true)
                                          setShowVipRewards(false)
                                          setQuickLinksOpen(false)
                                          window.scrollTo(0, 0)
                                      }}
                                    >
                                      Sports
                                    </button>
                                    <button
                                      className="w-full flex items-center justify-start px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowQuickLinksMenu(false)
                                        setOpenMobile(false)
                                        setShowSports(false)
                                          setShowVipRewards(false)
                                          setActiveSubNav('For You')
                                          setQuickLinksOpen(false)
                                          window.scrollTo(0, 0)
                                      }}
                                    >
                                      Casino
                                    </button>
                                    <button
                                      className="w-full flex items-center justify-start px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowQuickLinksMenu(false)
                                        setOpenMobile(false)
                                        router.push('/casino?poker=true')
                                        setQuickLinksOpen(false)
                                      }}
                                    >
                                      Poker
                                    </button>
                                    <button
                                      className="w-full flex items-center justify-start px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowQuickLinksMenu(false)
                                        setOpenMobile(false)
                                        openVipDrawer()
                                        setShowSports(false)
                                        setQuickLinksOpen(false)
                                      }}
                                    >
                                      VIP Rewards
                                    </button>
                                    <div style={{ position: 'relative', zIndex: 10006 }}>
                                      <DropdownMenu open={otherDropdownOpen} onOpenChange={setOtherDropdownOpen} modal={false}>
                                        <DropdownMenuTrigger asChild>
                                          <button
                                            type="button"
                                            className="w-full flex items-center justify-between px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm cursor-pointer"
                                            style={{ pointerEvents: 'auto' }}
                                            onClick={(e) => {
                                              e.preventDefault()
                                              e.stopPropagation()
                                              setOtherDropdownOpen(!otherDropdownOpen)
                                            }}
                                          >
                                            <span>Other</span>
                                            <IconChevronDown className="h-4 w-4" />
                                          </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent 
                                          align="start" 
                                          className="bg-[#2D2E2C] border-white/10 text-white min-w-[160px]"
                                          side="right"
                                          sideOffset={8}
                                          alignOffset={-8}
                                          style={{ zIndex: 10007 }}
                                          onCloseAutoFocus={(e) => e.preventDefault()}
                                        >
                                          <DropdownMenuItem
                                            className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                                            onSelect={(e) => {
                                              e.preventDefault()
                                              setOtherDropdownOpen(false)
                                              setShowQuickLinksMenu(false)
                                              setOpenMobile(false)
                                              setQuickLinksOpen(false)
                                            }}
                                          >
                                            Option 1
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                                            onSelect={(e) => {
                                              e.preventDefault()
                                              setOtherDropdownOpen(false)
                                              setShowQuickLinksMenu(false)
                                              setOpenMobile(false)
                                              setQuickLinksOpen(false)
                                            }}
                                          >
                                            Option 2
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                                            onSelect={(e) => {
                                              e.preventDefault()
                                              setOtherDropdownOpen(false)
                                              setShowQuickLinksMenu(false)
                                              setOpenMobile(false)
                                              setQuickLinksOpen(false)
                                            }}
                                          >
                                            Option 3
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              </SidebarMenuItem>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                      
                      {!showQuickLinksMenu && sidebarMenuItems.map((item, index) => {
                        const Icon = item.icon
                        const showSeparatorAbove = false
                        // Determine if this menu item is active based on selectedCategory only
                        // Note: activeSubNav is for sub nav tabs, not side menu highlighting
                        const isActive = selectedCategory === item.label || 
                             (item.label === 'Slots' && selectedCategory === 'Slots') ||
                             (item.label === 'Blackjack' && (selectedCategory === 'Blackjack' || selectedCategory === 'BlackJack')) ||
                             (item.label === 'Video Poker' && selectedCategory === 'Video Poker') ||
                             (item.label === 'Specialty Games' && selectedCategory === 'Specialty') ||
                             (item.label === 'Table Games' && selectedCategory === 'Table Games') ||
                             (item.label === 'My Favorites' && selectedCategory === 'Favorites') ||
                             (item.label === 'Popular Games' && selectedCategory === 'Popular') ||
                             (item.label === 'Live Casino' && activeSubNav === 'Live' && !selectedCategory)
                        return (
                          <React.Fragment key={index}>
                            {showSeparatorAbove && (
                              <Separator className="bg-white/10 my-2" />
                            )}
                            <SidebarMenuItem>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    isActive={isActive}
                                    style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                                    className={cn(
                                      "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                      "data-[active=true]:text-white data-[active=true]:font-medium",
                                      "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5",
                                      isActive && '[&[data-active=true]]:!bg-[var(--brand-primary)]'
                                    )}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      console.log('Sidebar menu clicked:', item.label)
                                      
                                      // Close sidebar when selecting an item - ONLY on mobile
                                      if (isMobile) {
                                        setOpenMobile(false)
                                      }
                                      // On desktop, keep sidebar state as is (open stays open, closed stays closed)
                                      
                                      // Add navigation logic here
                                      setActiveIconTab('search') // Reset icon tab when navigating to other pages
                                      if (item.label === 'My Favorites') {
                                        setActiveSubNav('For You')
                                        setSelectedCategory('Favorites')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        window.scrollTo(0, 0)
                                        setShowSports(false)
                                      } else if (item.label === 'Popular Games') {
                                        setActiveSubNav('For You')
                                        setSelectedCategory('Popular')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        window.scrollTo(0, 0)
                                        setShowSports(false)
                                      } else if (item.label === 'Slots') {
                                        setActiveSubNav('Slots')
                                        setSelectedCategory('Slots')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                        window.scrollTo(0, 0)
                                      } else if (item.label === 'Blackjack') {
                                        setActiveSubNav('Blackjack')
                                        setSelectedCategory('BlackJack')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                        window.scrollTo(0, 0)
                                      } else if (item.label === 'Video Poker') {
                                        setActiveSubNav('') // Clear activeSubNav when selecting items not in sub nav
                                        setSelectedCategory('Video Poker')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                        window.scrollTo(0, 0)
                                      } else if (item.label === 'Specialty Games') {
                                        setActiveSubNav('For You')
                                        setSelectedCategory('Specialty')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      } else if (item.label === 'Table Games') {
                                        setActiveSubNav('For You')
                                        setSelectedCategory('Table Games')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      } else if (item.label === 'Live Casino') {
                                        setActiveSubNav('Live')
                                        setShowAllGames(false)
                                        setSelectedCategory('')
                          setSelectedVendor('')
                                        setShowSports(false)
                                      } else if (item.label === 'Tournaments') {
                                        setActiveSubNav('For You')
                                        setSelectedCategory('Tournaments')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      }
                                    }}
                                  >
                                    <Icon strokeWidth={1.5} className="w-5 h-5" />
                                    <span className="flex items-center gap-1.5">{item.label}</span>
                                  </SidebarMenuButton>
                                </TooltipTrigger>
                                {sidebarState === 'collapsed' && (
                                  <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                                    <p>{item.label}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </SidebarMenuItem>
                          </React.Fragment>
                        )
                      })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <div className="flex-1 min-h-0" />
              <Separator className="bg-white/10 mx-2" />
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <SidebarMenuItem key={`sidebar-footer-${index}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (isMobile) setOpenMobile(false)
                                  if (item.label === SIDEBAR_FOOTER_VIP_HUB) {
                                    window.dispatchEvent(new CustomEvent('vip:open-drawer'))
                                  } else if (item.label === SIDEBAR_FOOTER_PROMOTIONS) {
                                    router.push('/promotions')
                                  } else if (item.label === SIDEBAR_FOOTER_WALLET) {
                                    openDepositDrawer()
                                  } else if (item.label === SIDEBAR_FOOTER_NEED_HELP) {
                                    console.log('Need Help clicked')
                                  }
                                }}
                                className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer text-white/70 hover:text-white hover:bg-white/5"
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
            </SidebarContent>
          </Sidebar>
          )}
          {/* VIP Sidebar - shown in outer sidebar context when VIP is active */}
          {!showSports && showVipRewards && (
          <Sidebar 
            collapsible="icon"
            variant="sidebar"
            className="!bg-[#2d2d2d] dark:!bg-[#2d2d2d] border-r border-white/10 text-white [&>div]:!bg-[#2d2d2d] dark:[&>div]:!bg-[#2d2d2d]"
          >
            <SidebarContent className="overflow-y-auto overflow-x-hidden flex flex-col">
              <TooltipProvider>
                <SidebarPromos
                  collapsed={sidebarState === 'collapsed' && !isMobile}
                />
                <Separator className="bg-white/10 mx-2 group-data-[collapsible=icon]:hidden" />
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {[
                        { id: 'Overview', icon: IconLayoutDashboard, label: 'VIP Dashboard' },
                        { id: 'My Bonus', icon: IconGift, label: 'My Bonus' },
                        { id: 'Promos', icon: IconRocket, label: 'Promos' },
                        { id: 'Cash Races', icon: IconClock, label: 'Cash Races' },
                        { id: 'Contests', icon: IconTrophy, label: 'Contests' },
                        { id: 'Challenges', icon: IconFlame, label: 'Challenges' },
                        { id: 'Raffles', icon: IconTicket, label: 'Raffles' },
                        { id: 'Refer A Friend', icon: IconUserPlus, label: 'Refer A Friend' },
                        { type: 'separator' as const },
                        { id: 'Loot Crates', icon: IconConfetti, label: 'Loot Crates', linkTo: 'rewardcrates' },
                            { id: 'Cash Boost', icon: IconBolt, label: 'Cash Boost', linkTo: 'cashboost' },
                        { id: 'Reloads', icon: IconRefresh, label: 'Reloads', linkTo: 'reloads' },
                        { id: 'Cash Drop', icon: IconParachute, label: 'Cash Drop', linkTo: 'draw' },
                        { id: 'Bet & Get', icon: IconTargetArrow, label: 'Bet & Get', linkTo: 'draw' },
                        { type: 'separator' as const },
                        { id: 'Get Telegram', icon: IconDownload, label: 'Get Telegram' },
                      ].map((item: any, index: number) => {
                        if (item.type === 'separator') {
                          return (
                            <React.Fragment key={`vip-sep-${index}`}>
                              <Separator className="bg-white/10 my-2" />
                            </React.Fragment>
                          )
                        }
                        if (!item.icon || !item.id) return null
                        const Icon = item.icon
                        const itemId = item.id
                        const isActive = vipActiveSidebarItem === itemId

                        if (itemId === 'Get Telegram') {
                          const isCollapsed = sidebarState === 'collapsed' && !isMobile
                          return (
                            <SidebarMenuItem key={itemId}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a
                                    href="https://t.me/betonline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                      "group flex items-center rounded-xl bg-gradient-to-r from-[#229ED9]/10 to-[#229ED9]/5 border border-[#229ED9]/20 hover:border-[#229ED9]/40 transition-all",
                                      isCollapsed ? "justify-center w-9 h-9 mx-auto p-0" : "gap-3 px-2.5 py-2"
                                    )}
                                  >
                                    <div className={cn(
                                      "rounded-lg bg-[#229ED9]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#229ED9]/30 transition-colors",
                                      isCollapsed ? "w-7 h-7" : "w-9 h-9"
                                    )}>
                                      <IconBrandTelegram className={cn(isCollapsed ? "w-4 h-4" : "w-5 h-5", "text-[#229ED9]")} />
                                    </div>
                                    {!isCollapsed && (
                                      <>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold text-white leading-tight">Join our Telegram</p>
                                          <p className="text-[11px] text-white/40 leading-snug truncate">Codes, promos & rewards</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                          <div className="px-2 py-1 rounded-md bg-[#229ED9] text-white text-[11px] font-semibold group-hover:bg-[#1a8bc2] transition-colors">
                                            Join
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </a>
                                </TooltipTrigger>
                                {isCollapsed && (
                                  <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                                    <p>Join our Telegram</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </SidebarMenuItem>
                          )
                        }
                        return (
                          <SidebarMenuItem key={itemId}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  isActive={isActive}
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (item.linkTo) {
                                      if (item.linkTo === 'rewardcrates') {
                                            setVipDrawerOpen(true)
                                            setVipActiveTab('Loot Crates')
                                          } else if (item.linkTo === 'cashboost') {
                                        setVipDrawerOpen(true)
                                        setVipActiveTab('Cash Boost')
                                      } else if (item.linkTo === 'reloads') {
                                        setVipDrawerOpen(true)
                                        setVipActiveTab('Reloads')
                                      } else if (item.linkTo === 'draw') {
                                        setVipDrawerOpen(true)
                                        if (itemId === 'Cash Drop') {
                                          setVipActiveTab('Cash Drop')
                                        } else if (itemId === 'Bet & Get') {
                                          setVipActiveTab('Bet & Get')
                                        }
                                      }
                                    } else {
                                      setVipActiveSidebarItem(itemId)
                                    }
                                  }}
                                  className={cn(
                                    "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                    "data-[active=true]:text-white data-[active=true]:font-medium",
                                    "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                                  )}
                                  style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                                >
                                  <Icon strokeWidth={1.5} className="w-5 h-5" />
                                  <span className="flex-1">{item.label}</span>
                                  {item.linkTo && (
                                    <IconExternalLink className="w-4 h-4 text-white/50" />
                                  )}
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
                <div className="flex-1" />
                <Separator className="bg-white/10 mx-2" />
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <SidebarMenuItem key={`vip-bottom-${index}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (isMobile) setOpenMobile(false)
                                    if (item.label === SIDEBAR_FOOTER_VIP_HUB) {
                                      window.dispatchEvent(new CustomEvent('vip:open-drawer'))
                                    } else if (item.label === SIDEBAR_FOOTER_PROMOTIONS) {
                                      router.push('/promotions')
                                    } else if (item.label === SIDEBAR_FOOTER_WALLET) {
                                      openDepositDrawer()
                                    } else if (item.label === SIDEBAR_FOOTER_NEED_HELP) {
                                      console.log('Need Help clicked')
                                    }
                                  }}
                                  className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer text-white/70 hover:text-white hover:bg-white/5"
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
            </SidebarContent>
          </Sidebar>
          )}


          {/* Main Content - Empty for now */}
          <SidebarInset 
            className="bg-[#1a1a1a] dark:bg-[#1a1a1a] bg-white dark:bg-[#1a1a1a] text-white dark:text-white text-gray-900 dark:text-white transition-colors duration-700" 
            style={{ 
              width: 'auto', 
              flex: '1 1 0%', 
              minWidth: 0, 
              maxWidth: 'none',
            }}
          >
            {/* Icon Tabs (Left) and Text Tabs (Right) - Fixed Sub Nav - Hide on Sports and VIP Rewards */}
            {!showSports && !showVipRewards && (
            <motion.div 
              data-sub-nav
              className={cn(
                "fixed z-[90] bg-white dark:bg-[#1a1a1a]/60 dark:backdrop-blur-xl border-b border-gray-200 dark:border-white/10 py-3 shadow-sm",
                isMobile ? "left-0 right-0 overflow-hidden" : "px-6"
              )}
              initial={false}
              animate={{
                top: isMobile ? (quickLinksOpen ? 104 : 64) : 64
              }}
              transition={isMobile ? {
                type: "tween",
                ease: "linear",
                duration: 0.3
              } : {
                type: "tween",
                ease: "easeOut",
                duration: 0.2
              }}
              style={isMobile ? { 
                top: quickLinksOpen ? 104 : 64,
                left: 0,
                right: 0,
                width: '100vw',
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 0,
                paddingRight: 0,
                borderTop: 'none'
              } : {
                top: 64,
                left: sidebarState === 'collapsed' ? '3rem' : '16rem',
                right: 0
              }}
            >
                <div 
                  ref={subNavScrollRef}
                  className={cn(
                    "flex items-center gap-1.5",
                    isMobile && "overflow-x-auto scrollbar-hide"
                  )}
                  style={isMobile ? {
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-x',
                    overscrollBehaviorX: 'auto',
                    scrollSnapType: 'x mandatory',
                    width: '100vw',
                    minWidth: '100vw',
                    maxWidth: '100vw',
                    paddingLeft: 0,
                    paddingRight: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    boxSizing: 'border-box',
                    position: 'relative',
                    left: 0,
                    transform: 'translateX(0)',
                    overflowX: 'auto',
                    overflowY: 'hidden'
                  } : {}}
                >
                    {/* Icon Tabs - Left Side (Desktop Only) */}
                    {!isMobile && (
                      <div className="flex-shrink-0">
                        <div className="bg-white/5 dark:bg-white/5 bg-gray-100/80 dark:bg-white/5 p-0.5 h-auto gap-0.5 rounded-3xl border-0 flex items-center transition-colors duration-300">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSearchOverlayOpen(true)
                            }}
                            className="bg-transparent text-gray-800 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-gray-200/80 dark:hover:bg-white/5 rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 ease-in-out"
                          >
                            <IconSearch className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveIconTab('favorite')
                              setShowAllGames(true)
                              setSelectedCategory('Favorites')
                              setSelectedVendor('')
                              setActiveSubNav('')
                              window.scrollTo(0, 0)
                            }}
                            className={cn(
                              "bg-transparent rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 ease-in-out",
                              activeIconTab === 'favorite'
                                ? "text-pink-500 dark:text-pink-500 bg-gray-200/80 dark:bg-white/10"
                                : "text-gray-800 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-gray-200/80 dark:hover:bg-white/5"
                            )}
                          >
                            <IconHeart 
                              className={cn(
                                "w-3.5 h-3.5 transition-colors",
                                activeIconTab === 'favorite' && "fill-pink-500 text-pink-500"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Text Tabs - Full Width */}
                    <AnimateTabs value={(() => {
                      // Don't highlight any tab if viewing vendor or category not in sub nav menu
                      const subNavItems = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New']
                      if (selectedVendor) return ''
                      if (selectedCategory && !subNavItems.includes(selectedCategory)) return ''
                      return activeSubNav
                    })()} onValueChange={(value) => { 
                      setActiveSubNav(value)
                      setActiveIconTab('search') // Reset icon tab when navigating to other pages
                      if (value === 'For You' || value === 'Live') {
                        setShowAllGames(false)
                        setSelectedCategory('')
                        setSelectedVendor('')
                      } else {
                        setSelectedCategory(value)
                        setSelectedVendor('')
                        setShowAllGames(true)
                        setActiveSubNav(value)
                        window.scrollTo(0, 0)
                      }
                      
                      // Scroll the clicked tab into view on mobile
                      if (isMobile && subNavScrollRef.current) {
                        const tabIndex = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New'].indexOf(value)
                        if (tabIndex !== -1) {
                          const tabs = subNavScrollRef.current.querySelectorAll('[data-tab-item]')
                          const targetTab = tabs[tabIndex] as HTMLElement
                          if (targetTab) {
                            setTimeout(() => {
                              targetTab.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'nearest',
                                inline: 'center'
                              })
                            }, 100)
                          }
                        }
                      }
                    }} className="w-full">
                      <AnimateTabsList className={cn(
                        "bg-white/5 dark:bg-white/5 bg-gray-100/80 dark:bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300",
                        isMobile && "flex-nowrap"
                      )}
                      style={isMobile ? {
                        minWidth: 'max-content',
                        width: 'max-content',
                        flexShrink: 0,
                        marginLeft: '12px',
                        paddingLeft: 0,
                        paddingRight: 0
                      } : {}}
                      >
                        {['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New'].map((tab, index) => (
                          <TabsTab 
                            key={tab}
                            value={tab}
                            data-tab-item
                            className={cn(
                              "relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5 flex-shrink-0",
                              isMobile && index === 0 && "scroll-snap-start",
                              isMobile && index === ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New'].length - 1 && "scroll-snap-end mr-12"
                            )}
                          >
                            {(() => {
                              // Don't highlight if viewing vendor or category not in sub nav menu
                              const subNavItems = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New']
                              if (selectedVendor) return false
                              if (selectedCategory && !subNavItems.includes(selectedCategory)) return false
                              return activeSubNav === tab
                            })() && (
                              <motion.div
                                layoutId="activeTab" layout="position"
                                className="absolute inset-0 rounded-2xl -z-10"
                                style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                                initial={false}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 40
                                }}
                              />
                            )}
                            <span className="relative z-10 whitespace-nowrap">{tab}</span>
                          </TabsTab>
                        ))}
                      </AnimateTabsList>
                    </AnimateTabs>
                  </div>
            </motion.div>
            )}
            
            {/* Spacer to account for fixed header and sub-nav height */}
            <motion.div 
              initial={false}
              animate={isMobile ? {
                height: showVipRewards
                  ? '0px' // VIP: no spacer needed, VIPRewardsPage handles its own layout
                  : showSports 
                    ? (quickLinksOpen ? '144px' : '104px') // Sports: 64px header + 40px quick links (when open) + 40px sports sub nav = 144px
                    : (quickLinksOpen ? '155px' : '100px') // Casino: 64px header + 40px quick links (when open) + 57px sub nav - 6px = 155px
              } : {
                height: showVipRewards ? '0px' : showSports ? '104px' : '115px' // VIP: just header, Sports: header + sports sub nav, Casino: header + casino sub nav
              }}
              transition={isMobile ? {
                type: "tween",
                ease: "linear",
                duration: 0.3
              } : {
                type: "tween",
                ease: "easeOut",
                duration: 0.2
              }}
              style={{ overflow: 'hidden' }}
            />
            
            {/* Sports Page */}
            <AnimatePresence mode="popLayout" initial={false}>
              {showVipRewards ? (
                <motion.div
                  key="vip-rewards-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Spacer for VIP page — accounts for fixed header + quick links on mobile */}
                  <motion.div 
                    initial={false}
                    animate={isMobile ? {
                      height: quickLinksOpen ? '40px' : '0px'
                    } : {
                      height: '0px'
                    }}
                    transition={{
                      type: "tween",
                      ease: "linear",
                      duration: 0.3
                    }}
                    style={{ overflow: 'hidden' }}
                  />
                  <VIPRewardsPage 
                    brandPrimary={brandPrimary || '#ee3536'} 
                    setVipDrawerOpen={setVipDrawerOpen}
                    setVipActiveTab={setVipActiveTab}
                    setShowToast={setShowToast}
                    setToastMessage={setToastMessage}
                    setToastAction={setToastAction}
                    setShowVipRewards={setShowVipRewards}
                    setIsPageTransitioning={setIsPageTransitioning}
                    initialVipSidebarItem={initialVipSidebarItem}
                    setInitialVipSidebarItem={setInitialVipSidebarItem}
                    previousPageState={previousPageState}
                    setPreviousPageState={setPreviousPageState}
                    setActiveSubNav={setActiveSubNav}
                    quickLinksOpen={quickLinksOpen}
                    vipActiveSidebarItem={vipActiveSidebarItem}
                    setVipActiveSidebarItem={setVipActiveSidebarItem}
                  />
                </motion.div>
              ) : showSports ? (
                <motion.div
                  key="sports-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
              <SportsPage 
                activeTab={sportsActiveTab}
                onTabChange={setSportsActiveTab}
                onBack={() => {
                  router.push('/casino')
                }}
                brandPrimary={brandPrimary}
                brandPrimaryHover={brandPrimaryHover}
                onSearchClick={() => setSearchOverlayOpen(true)}
                betslipOpen={betslipOpen}
                setBetslipOpen={setBetslipOpen}
                bets={bets}
                setBets={setBets}
                setShowToast={setShowToast}
                setToastMessage={setToastMessage}
                setToastAction={setToastAction}
                placedBets={placedBets}
                setPlacedBets={setPlacedBets}
                myBetsAlertCount={myBetsAlertCount}
                setMyBetsAlertCount={setMyBetsAlertCount}
                betslipManuallyClosed={betslipManuallyClosed}
                setBetslipManuallyClosed={setBetslipManuallyClosed}
                activeSport={activeSport}
                setActiveSport={setActiveSport}
                showMyBets={showMyBets}
                setShowMyBets={setShowMyBets}
                myBetsInitialFilter={myBetsInitialFilter}
              />
                </motion.div>
              ) : (
                <motion.div
                  key="casino-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
              <>
            {/* Banner Carousel - Static, below tabs, only show on "For You" page */}
            {activeSubNav === 'For You' && !showAllGames && (
              <div 
                ref={bannerRef} 
                data-content-item 
                className={cn(
                  "pl-0 pr-0 pb-4 relative z-0 overflow-visible",
                  isMobile ? "pt-0" : "pt-0"
                )}
                style={isMobile ? { 
                  marginTop: '-12px',
                  paddingTop: 0
                } : {
                  marginTop: '-6px',
                  paddingTop: 0
                }}
              >
                  <Carousel className="w-full relative overflow-visible" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                    {!isMobile && (
                      <>
                        <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                        <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                      </>
                    )}
                    <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                      {/* VIP Rewards Card */}
                      <CarouselItem className={cn(
                        "pr-0 basis-auto flex-shrink-0",
                        isMobile ? "pl-3" : "pl-6"
                      )}>
                        <Card 
                          className="group relative flex-shrink-0 cursor-pointer overflow-hidden border border-gray-200 bg-gray-100 bg-white/5 transition-colors duration-300 dark:border-white/10 dark:bg-white/5" 
                          style={{ width: '300px', height: '164px' }}
                          onClick={() => {
                            openVipDrawer()
                          }}
                        >
                          <CardContent className="relative z-10 flex h-full min-h-0 flex-col p-3">
                            <CardTitle className="shrink-0 mb-0 text-xs font-semibold text-white dark:text-white transition-colors duration-300 leading-tight">
                              Gold To Platinum I
                            </CardTitle>
                            <div className="mt-3 flex min-h-0 flex-1 flex-col">
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
                          {/* Sweep effect */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                        </Card>
                      </CarouselItem>
                      
                      {/* Daily Races Card */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <Card 
                          className="group relative flex-shrink-0 cursor-pointer overflow-hidden border border-amber-400/30 bg-gradient-to-br from-amber-500/[0.12] to-transparent bg-white/5 dark:border-amber-400/35 dark:from-amber-400/[0.08] dark:bg-white/5" 
                          style={{ width: '300px', height: '164px' }}
                          onClick={() => {
                            // Save current page state before navigating
                            setPreviousPageState({
                              showSports: true,
                              showVipRewards: false,
                              activeSubNav: activeSubNav,
                            })
                            setVipActiveSidebarItem('Cash Races')
                            setShowVipRewards(true)
                            setVipDrawerOpen(false)
                            window.scrollTo(0, 0)
                          }}
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
                                <CardTitle className="mb-0 text-sm font-semibold text-amber-100 transition-colors duration-300 dark:text-amber-100 leading-tight">
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
                              <div className="rounded-small border border-amber-400/25 bg-amber-500/[0.08] p-2.5 dark:border-amber-400/30 transition-colors duration-300">
                                <div className="text-amber-100 font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                                <div className="text-[10px] text-amber-200/70 transition-colors duration-300">Position</div>
                              </div>
                              <div className="rounded-small border border-amber-400/25 bg-amber-500/[0.08] p-2.5 transition-colors duration-300 dark:border-amber-400/30">
                                <div className="text-amber-100 font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                                <div className="text-[10px] text-amber-200/70 transition-colors duration-300">Wagered</div>
                              </div>
                              <div className="rounded-small border border-amber-400/35 bg-amber-500/[0.12] p-2.5 dark:border-amber-400/40 transition-colors duration-300">
                                <div className="text-amber-50 font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                                <div className="text-[10px] text-amber-200/80 transition-colors duration-300">Current Prize</div>
                              </div>
                              </div>
                            </div>
                          </CardContent>
                          {/* Sweep effect */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                        </Card>
                      </CarouselItem>
                      
                      {/* Weekly Game Banner */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <Card className="border-0 relative overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity" style={{ width: '320px', height: '140px' }}>
                          <Image
                            src="/banners/weekly.png"
                            alt="Weekly Game Banner"
                            width={320}
                            height={140}
                            className="object-contain dark:brightness-100 brightness-75 dark:contrast-100 contrast-110"
                            priority
                            unoptimized
                            quality={100}
                            style={{ imageRendering: 'crisp-edges' }}
                          />
                        </Card>
                      </CarouselItem>
                      
                      {/* Originals Banner */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <Card className="border-0 relative overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity" style={{ width: '320px', height: '140px' }}>
                          <Image
                            src="/banners/orginals.png"
                            alt="Originals Banner"
                            width={320}
                            height={140}
                            className="object-contain dark:brightness-100 brightness-75 dark:contrast-100 contrast-110"
                            priority
                            unoptimized
                            quality={100}
                            style={{ imageRendering: 'crisp-edges' }}
                          />
                        </Card>
                      </CarouselItem>
                      
                      {/* Free Spins Banner */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <Card className="border-0 relative overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity" style={{ width: '320px', height: '140px' }}>
                          <Image
                            src="/banners/freespins.png"
                            alt="Free Spins Banner"
                            width={320}
                            height={140}
                            className="object-contain dark:brightness-100 brightness-75 dark:contrast-100 contrast-110"
                            priority
                            unoptimized
                            quality={100}
                            style={{ imageRendering: 'crisp-edges' }}
                          />
                        </Card>
                      </CarouselItem>
                      
                      {/* Placeholder Banners to fill gaps on large screens */}
                      {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={`banner-placeholder-${index}`} className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                          <Card className="border-0 relative overflow-hidden flex-shrink-0" style={{ width: '320px', height: '140px' }}>
                            <Skeleton className="w-full h-full rounded-small bg-white/10 dark:bg-white/10" />
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              )}
              
              {/* Tab Panels */}
              <div 
                ref={contentRef}
                className={cn(
                  "relative z-0",
                  isMobile ? "-mt-2" : "mt-0"
                )}
                style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}
              >
                  <AnimatePresence mode="wait" initial={false}>
                    {showAllGames ? (
                      <div className="">
                        <div className="flex items-center justify-between mb-6 px-6">
                          <div className="flex items-center gap-3">
                            {/* Back button - show when viewing vendor, category not in sub nav menu, or favorites page */}
                            {(() => {
                              const subNavItems = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New']
                              const isVendorPage = !!selectedVendor
                              const isCategoryNotInMenu = selectedCategory && !subNavItems.includes(selectedCategory)
                              const isFavoritesPage = activeIconTab === 'favorite' || selectedCategory === 'Favorites'
                              const showBackButton = isVendorPage || isCategoryNotInMenu || isFavoritesPage
                              
                              return showBackButton ? (
                                <button
                                  onClick={() => {
                                    setSelectedVendor('')
                                    setSelectedCategory('')
                                    setShowAllGames(false)
                                    setActiveSubNav('For You')
                                    setActiveIconTab('search')
                                    window.scrollTo(0, 0)
                                  }}
                                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/5 transition-colors duration-300 text-gray-800 dark:text-white/70 hover:text-black dark:hover:text-white"
                                  aria-label="Go back"
                                >
                                  <IconChevronLeft className="w-5 h-5" />
                                </button>
                              ) : null
                            })()}
                            
                        <motion.h2 
                              className="text-2xl font-bold text-black dark:text-white transition-colors duration-300"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {activeIconTab === 'favorite' || selectedCategory === 'Favorites' ? 'Favorites' : (selectedVendor || selectedCategory || activeSubNav)}
                        </motion.h2>
                            
                            {/* Show selected filter */}
                            {(selectedVendor || selectedCategory || activeSubNav) !== 'For You' && (selectedVendor || selectedCategory || activeSubNav) !== 'Live' && gameSortFilter !== 'popular' && (
                              <span className="text-sm text-white/60 dark:text-white/60 px-3 py-1 rounded-lg bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10">
                                {gameSortFilter === 'hot' ? 'Hot' : 
                                 gameSortFilter === 'latest' ? 'Latest' : 
                                 gameSortFilter === 'oldest' ? 'Oldest' : 
                                 gameSortFilter === 'a-z' ? 'A-Z' : 
                                 gameSortFilter === 'z-a' ? 'Z-A' : ''}
                              </span>
                            )}
                          </div>
                          
                          {/* Filter Icon - Only show on sub pages (not For You or Live) */}
                          {(selectedVendor || selectedCategory || activeSubNav) !== 'For You' && (selectedVendor || selectedCategory || activeSubNav) !== 'Live' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 rounded-full p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 text-gray-800 dark:text-white/70 hover:text-black dark:hover:text-white"
                                >
                                  <IconFilter className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-[#2d2d2d] border-white/10 text-white">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('popular')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'popular' && "bg-white/10"
                                  )}
                                >
                                  Popular
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('hot')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'hot' && "bg-white/10"
                                  )}
                                >
                                  Hot
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('latest')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'latest' && "bg-white/10"
                                  )}
                                >
                                  Latest
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('oldest')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'oldest' && "bg-white/10"
                                  )}
                                >
                                  Oldest
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('a-z')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'a-z' && "bg-white/10"
                                  )}
                                >
                                  A-Z
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('z-a')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'z-a' && "bg-white/10"
                                  )}
                                >
                                  Z-A
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="cursor-pointer">
                                    Vendors
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className="w-56 bg-[#2d2d2d] border-white/10 text-white max-h-[400px] overflow-y-auto">
                                    {[
                                      'Dragon Gaming',
                                      'BetSoft',
                                      '5 Clover',
                                      '777Jacks',
                                      'Arrow\'s Edge',
                                      'Blaze',
                                      'DeckFresh',
                                      'DGS Casino Solutions',
                                      'Emerald Gate',
                                      'FDBJ',
                                      'FDRL',
                                      'Felix',
                                      'FreshDeck',
                                      'GLS',
                                      'i3 Soft',
                                      'KA Gaming',
                                      'Lucky',
                                      'Mascot Gaming',
                                      'Nucleus',
                                      'Onlyplay',
                                      'Originals',
                                      'Popiplay',
                                      'Qora',
                                      'Red Sparrow',
                                      'Revolver Gaming',
                                      'Rival',
                                      'Spinthron',
                                      'Twain',
                                      'VIG',
                                      'Wingo',
                                    ].map((vendor) => (
                                      <DropdownMenuItem
                                        key={vendor}
                                        onClick={() => {
                                          setSelectedVendor(vendor)
                                          setSelectedCategory('')
                                          setShowAllGames(true)
                                          setActiveSubNav('')
                                          setActiveIconTab('search') // Reset icon tab when selecting vendor
                                          setGameSortFilter('popular')
                                          window.scrollTo(0, 0)
                                        }}
                                        className={cn(
                                          "cursor-pointer",
                                          selectedVendor === vendor && "bg-white/10"
                                        )}
                                      >
                                        {vendor}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        {/* Vendors Carousel - Under Title on Slots Page */}
                        {(activeSubNav === 'Slots' || selectedCategory === 'Slots') && showAllGames && (
                          <div 
                            className="relative w-full mt-6 mb-10 overflow-visible"
                            style={{ overflow: 'visible' }}
                          >
                            <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                              <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                                {!isMobile && (
                                  <>
                                    <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                    <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  </>
                                )}
                                <CarouselContent className="ml-0 -mr-2 md:-mr-4" style={{ overflow: 'visible' }}>
                                    {[
                                      'Dragon Gaming',
                                      'BetSoft',
                                      '5 Clover',
                                      '777Jacks',
                                      'Arrow\'s Edge',
                                      'Blaze',
                                      'DeckFresh',
                                      'DGS Casino Solutions',
                                      'Emerald Gate',
                                      'FDBJ',
                                      'FDRL',
                                      'Felix',
                                      'FreshDeck',
                                      'GLS',
                                      'i3 Soft',
                                      'KA Gaming',
                                      'Lucky',
                                      'Mascot Gaming',
                                      'Nucleus',
                                      'Onlyplay',
                                      'Originals',
                                      'Popiplay',
                                      'Qora',
                                      'Red Sparrow',
                                      'Revolver Gaming',
                                      'Rival',
                                      'Spinthron',
                                      'Twain',
                                      'VIG',
                                      'Wingo',
                                    ].map((vendor, index) => (
                                    <CarouselItem key={vendor} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <button
                                        className="group relative bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs font-medium text-gray-800 dark:text-white/70 hover:bg-gray-200/80 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all duration-300 whitespace-nowrap overflow-hidden flex items-center gap-2"
                                        onClick={() => {
                                          setSelectedVendor(vendor)
                                          setSelectedCategory('')
                                          setShowAllGames(true)
                                          setActiveSubNav('')
                                          setActiveIconTab('search') // Reset icon tab when selecting vendor
                                          window.scrollTo(0, 0)
                                        }}
                                      >
                                        {/* Placeholder/Skeleton Icon */}
                                        <Skeleton className="w-5 h-5 rounded-full bg-gray-400 dark:bg-white/10 flex-shrink-0" />
                                        <span className="relative z-10">{vendor}</span>
                                        {/* Sweep effect */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                                      </button>
                                    </CarouselItem>
                                    ))}
                                </CarouselContent>
                              </Carousel>
                            </div>
                          </div>
                        )}
                        
                        {(() => {
                          // Generate game data with sortable properties - memoized to prevent regeneration on scroll
                          const gameNames = ['Gold Nugget Rush', 'Mega Fortune', 'Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers', 'Mega Moolah', 'Bonanza', 'Razor Shark', 'Sweet Bonanza', 'Gates of Olympus', 'Big Bass Bonanza', 'The Dog House', 'Wolf Gold', 'Fire Strike', 'Chilli Heat']
                          // Increase total games to ensure we always have enough tiles to fill the grid (8 columns max, so generate enough for many full rows)
                          const totalGames = 240
                          
                          // Seeded random function for consistent values
                          const seededRandom = (seed: number) => {
                            const x = Math.sin(seed) * 10000
                            return x - Math.floor(x)
                          }
                          
                          // Create game data array with stable random values based on index
                          const games = Array.from({ length: totalGames }).map((_, index) => {
                            const name = gameNames[index % gameNames.length]
                            const categoryKey = selectedCategory || activeSubNav
                            const seed = index * 1000 + categoryKey.length // Stable seed based on index and category
                            return {
                              index,
                              name,
                              popularity: Math.floor(seededRandom(seed) * 1000) + (index < 10 ? 500 : 0), // First 10 are more popular
                              hotScore: Math.floor(seededRandom(seed + 1) * 100) + (index < 5 ? 50 : 0), // First 5 are hotter
                              dateAdded: new Date(2024, 0, 1 + (index % 365)), // Spread over a year
                              nameLower: name.toLowerCase()
                            }
                          })
                          
                          // Sort based on selected filter
                          let sortedGames = [...games]
                          switch (gameSortFilter) {
                            case 'popular':
                              sortedGames.sort((a, b) => b.popularity - a.popularity)
                              break
                            case 'hot':
                              sortedGames.sort((a, b) => b.hotScore - a.hotScore)
                              break
                            case 'latest':
                              sortedGames.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())
                              break
                            case 'oldest':
                              sortedGames.sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime())
                              break
                            case 'a-z':
                              sortedGames.sort((a, b) => a.nameLower.localeCompare(b.nameLower))
                              break
                            case 'z-a':
                              sortedGames.sort((a, b) => b.nameLower.localeCompare(a.nameLower))
                              break
                          }
                          
                          const categoryKey = selectedCategory || activeSubNav
                          const maxCols = 8 // Maximum columns for largest screens
                          const gameTiles = sortedGames.map((game, displayIndex) => {
                            const columnIndex = displayIndex % maxCols
                            // Use stable key that doesn't change during scroll
                            const stableKey = `${categoryKey}-${game.index}`
                            return (
                              <LazyGameTile 
                                key={stableKey} 
                                index={game.index} 
                                columnIndex={columnIndex}
                                rowIndex={Math.floor(displayIndex / maxCols)}
                                onTileClick={setSelectedGame}
                                isMobile={isMobile}
                              />
                            )
                          })

                          // Calculate how many skeleton boxes needed to fill the last row
                          // Add skeletons to fill incomplete rows and prevent gaps
                          const totalTiles = gameTiles.length
                          const itemsInLastRow = totalTiles % maxCols
                          const skeletonCount = itemsInLastRow > 0 ? maxCols - itemsInLastRow : 0
                          const skeletonBoxes = Array.from({ length: skeletonCount }).map((_, index) => (
                            <div key={`skeleton-${categoryKey}-${index}`} className="w-full aspect-square">
                              <Skeleton 
                                className="w-full h-full rounded-small bg-white/10 dark:bg-white/10" 
                              />
                        </div>
                          ))

                          // On mobile, use memoized static div to prevent re-renders during scroll
                          if (isMobile) {
                            return (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4 px-6" style={{ willChange: 'auto' }}>
                                {gameTiles}
                                {skeletonBoxes}
                        </div>
                            )
                          }
                          
                          return (
                            <div 
                              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4 px-6"
                            >
                              {gameTiles}
                              {skeletonBoxes}
                            </div>
                          )
                        })()}
                      </div>
                    ) : activeSubNav === 'Live' ? (
                      <motion.div
                        key="live"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut"
                        }}
                        className="flex flex-col gap-6 relative"
                        style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0, overflow: 'visible' }}
                      >
                        {/* Live Game Category Carousels */}
                        <div className="space-y-8 relative" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0, overflow: 'visible' }}>
                        {/* Blackjack Section */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
                          )} style={{ width: '100%', maxWidth: '100%', overflow: 'visible', boxSizing: 'border-box', display: 'flex', minWidth: 0 }}>
                            <h2 className="text-lg font-semibold text-black dark:text-white transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>Blackjack (52)</h2>
                            <Button
                              variant="ghost"
                              className="text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                              style={{ flex: '0 0 auto', flexShrink: 0, visibility: 'visible', opacity: 1, display: 'inline-flex', whiteSpace: 'nowrap' }}
                              onClick={() => {
                                setSelectedCategory('Blackjack')
                                setSelectedVendor('')
                                setShowAllGames(true)
                                setActiveSubNav('Live')
                                window.scrollTo(0, 0)
                              }}
                            >
                              All Games
                            </Button>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              {!isMobile && (
                                <>
                                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                </>
                              )}
                              <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                                {Array.from({ length: 7 }).map((_, index) => {
                                  const imageSrc = squareTileImages[index % squareTileImages.length]
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[240px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        onClick={() => {
                                          setSelectedGame({
                                            title: 'VIP BLACKJACK',
                                            image: imageSrc,
                                            provider: 'Dragon Gaming',
                                            features: ['Live Dealer Experience', 'High Stakes Betting', 'Multiple Table Options']
                                          })
                                        }}
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={`VIP BLACKJACK ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="240px"
                                          />
                                        )}
                                        {/* Red Betting Range Tag */}
                                        <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>
                                          $350 - $500
                                        </div>
                                        {/* Game Title */}
                                        <div className="absolute bottom-12 left-2 right-2">
                                          <div className="text-white font-semibold text-sm mb-1">VIP BLACKJACK</div>
                                          <div className="flex items-center gap-1.5 text-white/70 text-xs">
                                            <IconUser className="w-3 h-3" />
                                            <span>4/6</span>
                                          </div>
                                        </div>
                                        {/* Provider & Info */}
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                          <div className="text-white/60 text-[10px] font-medium">Dragon Gaming</div>
                                          <IconInfoCircle className="w-4 h-4 text-white/70" strokeWidth={2} />
                                        </div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        
                        {/* Roulette Section */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-white flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Roulette (34)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Roulette')
                                  setShowAllGames(true)
                                  setActiveSubNav('Live')
                                }}
                              >
                                All Games
                              </Button>
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              {!isMobile && (
                                <>
                                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                </>
                              )}
                              <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                                {Array.from({ length: 8 }).map((_, index) => {
                                  const imageSrc = squareTileImages[index % squareTileImages.length]
                                  const isBaccarat = index % 2 === 0
                                  const gameTitle = isBaccarat ? 'AUTO BACCARAT' : 'LIVE BETONLINE ROUETTE'
                                  const bettingRange = isBaccarat ? '$1 - $12.500' : '$25 - $100'
                                  const gameInfo = isBaccarat ? 'B B B P P' : '8 20 13 0 10'
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[240px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        onClick={() => {
                                          setSelectedGame({
                                            title: gameTitle,
                                            image: imageSrc,
                                            provider: 'Dragon Gaming',
                                            features: ['Live Casino Experience', 'Real-Time Gameplay', 'Professional Dealers']
                                          })
                                        }}
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={gameTitle}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="240px"
                                          />
                                        )}
                                        {/* Red Betting Range Tag */}
                                        <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>
                                          {bettingRange}
                                        </div>
                                        {/* Game Title */}
                                        <div className="absolute bottom-12 left-2 right-2">
                                          <div className="text-white font-semibold text-sm mb-1">{gameTitle}</div>
                                          <div className="text-white/70 text-xs">{gameInfo}</div>
                                        </div>
                                        {/* Provider & Info */}
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                          <div className="text-white/60 text-[10px] font-medium">Dragon Gaming</div>
                                          <IconInfoCircle className="w-4 h-4 text-white/70" strokeWidth={2} />
                                        </div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        
                        {/* Baccarat Section - Grid Layout with Large Tile */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-white flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Baccarat (23)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Baccarat')
                                  setShowAllGames(true)
                                  setActiveSubNav('Live')
                                }}
                              >
                                All Games
                              </Button>
                            </div>
                          </div>
                          <div className="relative px-6" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <div className="grid grid-cols-4 gap-2" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
                              {/* Large VIP BLACKJACK Tile - Spans 2 rows */}
                              <div className="row-span-2">
                                    <div 
                                      data-content-item 
                                      className="w-full h-full rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0" 
                                      style={{ minHeight: '320px' }}
                                      onClick={() => {
                                        setSelectedGame({
                                          title: 'VIP BLACKJACK',
                                          image: squareTileImages[0],
                                          provider: 'Dragon Gaming',
                                          features: ['Live Dealer Experience', 'High Stakes Betting', 'Multiple Table Options']
                                        })
                                      }}
                                    >
                                  {squareTileImages[0] && (
                                    <Image
                                      src={squareTileImages[0]}
                                      alt="VIP BLACKJACK"
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                  )}
                                  {/* Red Betting Range Tag */}
                                  <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>
                                    $350 - $500
                                  </div>
                                  {/* Game Title */}
                                  <div className="absolute bottom-12 left-2 right-2">
                                    <div className="text-white font-semibold text-sm mb-1">VIP BLACKJACK</div>
                                    <div className="flex items-center gap-1.5 text-white/70 text-xs">
                                      <IconUser className="w-3 h-3" />
                                      <span>4/6</span>
                                    </div>
                                  </div>
                                  {/* Provider & Info */}
                                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                    <div className="text-white/60 text-[10px] font-medium">Dragon Gaming</div>
                                    <IconInfoCircle className="w-4 h-4 text-white/70" strokeWidth={2} />
                                  </div>
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                </div>
                              </div>
                              
                              {/* Smaller Tiles Grid */}
                              {Array.from({ length: 7 }).map((_, index) => {
                                const imageSrc = squareTileImages[(index + 1) % squareTileImages.length]
                                const isBaccarat = index % 2 === 0
                                const gameTitle = isBaccarat ? 'AUTO BACCARAT' : 'LIVE BETONLINE ROUETTE'
                                const bettingRange = isBaccarat ? '$1 - $12.500' : '$25 - $100'
                                const gameInfo = isBaccarat ? 'B B B P P' : '8 20 13 0 10'
                                return (
                                  <div key={index} className="aspect-square">
                                    <div 
                                      data-content-item 
                                      className="w-full h-full rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                      onClick={() => {
                                        setSelectedGame({
                                          title: gameTitle,
                                          image: imageSrc,
                                          provider: 'Dragon Gaming',
                                          features: ['Live Casino Experience', 'Real-Time Gameplay', 'Professional Dealers']
                                        })
                                      }}
                                    >
                                      {imageSrc && (
                                        <Image
                                          src={imageSrc}
                                          alt={gameTitle}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                                          sizes="(max-width: 768px) 25vw, 20vw"
                                        />
                                      )}
                                      {/* Red Betting Range Tag */}
                                      <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>
                                        {bettingRange}
                                      </div>
                                      {/* Game Title */}
                                      <div className="absolute bottom-12 left-2 right-2">
                                        <div className="text-white font-semibold text-xs mb-1">{gameTitle}</div>
                                        <div className="text-white/70 text-[10px]">{gameInfo}</div>
                                      </div>
                                      {/* Provider & Info */}
                                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                        <div className="text-white/60 text-[10px] font-medium">Dragon Gaming</div>
                                        <IconInfoCircle className="w-3.5 h-3.5 text-white/70" strokeWidth={2} />
                                      </div>
                                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                        
                        {/* Casino Poker Section */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-white flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Casino Poker (26)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Casino Poker')
                                  setShowAllGames(true)
                                  setActiveSubNav('Live')
                                }}
                              >
                                All Games
                              </Button>
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              {!isMobile && (
                                <>
                                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                </>
                              )}
                              <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                                {Array.from({ length: 8 }).map((_, index) => {
                                  const imageSrc = squareTileImages[index % squareTileImages.length]
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        onClick={() => {
                                          const pokerNames = ['Texas Hold\'em', 'Omaha Poker', 'Seven Card Stud', 'Razz', 'HORSE', 'Pineapple', 'Crazy Pineapple', 'Dealer\'s Choice']
                                          setSelectedGame({
                                            title: pokerNames[index % pokerNames.length],
                                            image: imageSrc,
                                            provider: 'Dragon Gaming',
                                            features: ['Live Poker Tables', 'Tournament Play', 'Cash Game Options']
                                          })
                                        }}
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={`Casino Poker ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="160px"
                                          />
                                        )}
                                        {/* Red Betting Range Tag */}
                                        <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>
                                          $25 - $100
                                        </div>
                                        {/* Provider & Info */}
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                          <div className="text-white/60 text-[10px] font-medium">Dragon Gaming</div>
                                          <IconInfoCircle className="w-4 h-4 text-white/70" strokeWidth={2} />
                                        </div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    ) : (
                      <motion.div
                        key={activeSubNav}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut"
                        }}
                        className="flex flex-col gap-6 relative"
                        style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0, overflow: 'visible' }}
                      >
                        {/* Game Category Carousels */}
                        <div className="space-y-8 relative" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0, overflow: 'visible' }}>
                        {/* BlackJack Section - Wide Rectangles (same height as squares) */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
                          )} style={{ width: '100%', maxWidth: '100%', overflow: 'visible', boxSizing: 'border-box', display: 'flex', minWidth: 0 }}>
                            <h2 className="text-lg font-semibold text-black dark:text-white transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>BlackJack (52)</h2>
                            <Button
                              variant="ghost"
                              className="text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                              style={{ flex: '0 0 auto', flexShrink: 0, visibility: 'visible', opacity: 1, display: 'inline-flex', whiteSpace: 'nowrap' }}
                              onClick={() => {
                                setSelectedCategory('BlackJack')
                                setShowAllGames(true)
                                setActiveSubNav('For You')
                              }}
                            >
                              All Games
                            </Button>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              {!isMobile && (
                                <>
                                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                </>
                              )}
                              <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const imageSrc = squareTileImages[index % squareTileImages.length]
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[240px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        onClick={() => {
                                          const gameNames = ['BlackJack Classic', 'VIP BlackJack', 'European BlackJack', 'American BlackJack', 'Perfect Pairs', '21+3 BlackJack', 'BlackJack Surrender', 'BlackJack Switch', 'Double Exposure', 'BlackJack Pro']
                                          const providers = ['BetSoft', 'Evolution Gaming', 'Pragmatic Play', 'NetEnt', 'Microgaming']
                                          setSelectedGame({
                                            title: gameNames[index % gameNames.length],
                                            image: imageSrc,
                                            provider: providers[index % providers.length],
                                            features: ['Classic Card Game', 'Multiple Betting Options', 'Live Dealer Available']
                                          })
                                        }}
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={`Game ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="240px"
                                          />
                                        )}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                                
                                {/* Placeholder Blackjack tiles to fill gaps on large screens */}
                                {Array.from({ length: 8 }).map((_, index) => (
                                  <CarouselItem key={`blackjack-placeholder-${index}`} className={cn(
                                    "pr-0 basis-auto flex-shrink-0",
                                    "pl-2 md:pl-4"
                                  )}>
                                    <div className="w-[240px] h-[160px] rounded-small flex-shrink-0">
                                      <Skeleton className="w-full h-full rounded-small bg-white/10 dark:bg-white/10" />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        
                        {/* Originals Section - Tall Rectangles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-white flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Originals (26)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Originals')
                                  setShowAllGames(true)
                                  setActiveSubNav('For You')
                                }}
                              >
                                All Games
                              </Button>
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              {!isMobile && (
                                <>
                                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                </>
                              )}
                              <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                                {originalsTileImages.map((imageSrc, index) => {
                                  const gameNames = ['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker']
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[280px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        onClick={() => {
                                          const originalGameNames = ['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker']
                                          setSelectedGame({
                                            title: originalGameNames[index] || `Originals Game ${index + 1}`,
                                            image: imageSrc,
                                            provider: 'BetOnline',
                                            features: ['Original Game', 'Unique Gameplay', 'Exclusive to BetOnline']
                                          })
                                        }}
                                      >
                                        <Image
                                          src={imageSrc}
                                          alt={`${gameNames[index] || `Originals Game ${index + 1}`}`}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                                          sizes="160px"
                                          onError={(e) => {
                                            // Fallback to a placeholder if image doesn't exist
                                            e.currentTarget.src = squareTileImages[index % squareTileImages.length]
                                          }}
                                        />
                                        {/* Info Icon - Bottom Right */}
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <IconInfoCircle className="w-4 h-4 text-white drop-shadow-lg" strokeWidth={2} />
                                        </div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                                
                                {/* Placeholder Originals to fill gaps on large screens */}
                                {Array.from({ length: 8 }).map((_, index) => (
                                  <CarouselItem key={`originals-placeholder-${index}`} className={cn(
                                    "pr-0 basis-auto flex-shrink-0",
                                    originalsTileImages.length === 0 && index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                  )}>
                                    <div className="w-[160px] h-[280px] rounded-small flex-shrink-0">
                                      <Skeleton className="w-full h-full rounded-small bg-white/10 dark:bg-white/10" />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        
                        {/* Slots Section - Square Tiles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-white flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Slots (128)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Slots')
                                  setSelectedVendor('')
                                  setShowAllGames(true)
                                  setActiveSubNav('For You')
                                  window.scrollTo(0, 0)
                                }}
                              >
                                All Games
                              </Button>
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              {!isMobile && (
                                <>
                                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                </>
                              )}
                              <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const imageSrc = squareTileImages[index % squareTileImages.length]
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        onClick={() => {
                                          const slotNames = ['Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers', 'Mega Moolah', 'Bonanza']
                                          const providers = ['NetEnt', 'Pragmatic Play', 'Microgaming', 'BetSoft', 'Evolution Gaming']
                                          setSelectedGame({
                                            title: slotNames[index % slotNames.length],
                                            image: imageSrc,
                                            provider: providers[index % providers.length],
                                            features: ['High RTP', 'Free Spins Feature', 'Bonus Rounds Available']
                                          })
                                        }}
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={`Game ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="160px"
                                          />
                                        )}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                                
                                {/* Placeholder Slots tiles to fill gaps on large screens */}
                                {Array.from({ length: 20 }).map((_, index) => (
                                  <CarouselItem key={`slots-placeholder-${index}`} className={cn(
                                    "pr-0 basis-auto flex-shrink-0",
                                    "pl-2 md:pl-4"
                                  )}>
                                    <div className="w-[160px] h-[160px] rounded-small flex-shrink-0">
                                      <Skeleton className="w-full h-full rounded-small bg-white/10 dark:bg-white/10" />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Vendors Carousel - Under Slots Title */}
                        {activeSubNav === 'For You' && !showAllGames && (
                          <div 
                            className="relative w-full mt-6 mb-10 overflow-visible"
                            style={{ overflow: 'visible' }}
                          >
                            <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                              <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                                {!isMobile && (
                                  <>
                                    <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                    <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  </>
                                )}
                                <CarouselContent className="ml-0 -mr-2 md:-mr-4" style={{ overflow: 'visible' }}>
                                    {[
                                      'Dragon Gaming',
                                      'BetSoft',
                                      '5 Clover',
                                      '777Jacks',
                                      'Arrow\'s Edge',
                                      'Blaze',
                                      'DeckFresh',
                                      'DGS Casino Solutions',
                                      'Emerald Gate',
                                      'FDBJ',
                                      'FDRL',
                                      'Felix',
                                      'FreshDeck',
                                      'GLS',
                                      'i3 Soft',
                                      'KA Gaming',
                                      'Lucky',
                                      'Mascot Gaming',
                                      'Nucleus',
                                      'Onlyplay',
                                      'Originals',
                                      'Popiplay',
                                      'Qora',
                                      'Red Sparrow',
                                      'Revolver Gaming',
                                      'Rival',
                                      'Spinthron',
                                      'Twain',
                                      'VIG',
                                      'Wingo',
                                    ].map((vendor, index) => (
                                    <CarouselItem key={vendor} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <button
                                        className="group relative bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs font-medium text-gray-800 dark:text-white/70 hover:bg-gray-200/80 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all duration-300 whitespace-nowrap overflow-hidden flex items-center gap-2"
                                        onClick={() => {
                                          setSelectedVendor(vendor)
                                          setSelectedCategory('')
                                          setShowAllGames(true)
                                          setActiveSubNav('')
                                          setActiveIconTab('search') // Reset icon tab when selecting vendor
                                          window.scrollTo(0, 0)
                                        }}
                                      >
                                        {/* Placeholder/Skeleton Icon */}
                                        <Skeleton className="w-5 h-5 rounded-full bg-gray-400 dark:bg-white/10 flex-shrink-0" />
                                        <span className="relative z-10">{vendor}</span>
                                        {/* Sweep effect */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                                      </button>
                                    </CarouselItem>
                                    ))}
                                </CarouselContent>
                              </Carousel>
                            </div>
                          </div>
                        )}
                        
                        {/* Feature Section - Rain Background */}
                        <div className={cn(
                          "relative w-full rounded-lg overflow-hidden mb-8",
                          isMobile ? "mx-3" : "-mx-6"
                        )}>
                          <RainBackground 
                            className="rounded-lg min-h-[400px]"
                            count={150}
                            intensity={1}
                            angle={15}
                            color="rgba(174, 194, 224, 0.5)"
                            lightning={true}
                          >
                            <div className={cn(
                              "relative z-10",
                              isMobile ? "p-8" : "pt-8 pb-8 pr-8 pl-14"
                            )}>
                              {/* Tag */}
                              <div className="mb-2">
                                <span className="inline-block bg-orange-600/80 text-white text-xs font-semibold px-3 py-1 rounded-small">
                                  Halloween
                                </span>
                              </div>
                              
                              {/* Title */}
                              <h2 className="text-4xl md:text-3xl font-bold text-white mb-3">
                                HALLOWEEN GAMES
                              </h2>
                              
                              {/* Description */}
                              <p className="text-white/90 text-sm md:text-base max-w-2xl mb-6">
                                Get spooky with our collection of Halloween-themed games! Spin the reels and win big with haunted slots and eerie jackpots.
                              </p>
                              
                              {/* Action Button */}
                              <div className="flex items-center gap-3 mb-6 pointer-events-auto">
                                <Button
                                  variant="ghost"
                                  className="text-white/70 hover:text-white hover:bg-white/5 text-sm px-6 py-2.5 border border-white/20 rounded-small flex items-center gap-2"
                                  onClick={() => {
                                    setSelectedCategory('Halloween')
                                    setShowAllGames(true)
                                    setActiveSubNav('For You')
                                  }}
                                >
                                  <IconGhost className="w-4 h-4" />
                                  All Games
                                </Button>
                              </div>
                              
                              {/* Game Tiles */}
                              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 pointer-events-auto">
                                {Array.from({ length: 15 }).map((_, index) => {
                                  const imageSrc = squareTileImages[index % squareTileImages.length]
                                  return (
                                    <div key={index} className="flex-shrink-0">
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[160px] rounded-small bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group border border-white/20"
                                        style={{ 
                                          '--hover-bg': `${brandPrimary}33`,
                                        } as React.CSSProperties}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = `${getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'}33`
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                                        }}
                                        onClick={() => {
                                          const halloweenNames = ['Spooky Slots', 'Haunted Mansion', 'Witch\'s Brew', 'Pumpkin Jack', 'Ghostly Reels', 'Trick or Treat']
                                          const providers = ['BetSoft', 'Pragmatic Play', 'NetEnt', 'Microgaming']
                                          setSelectedGame({
                                            title: halloweenNames[index % halloweenNames.length],
                                            image: imageSrc,
                                            provider: providers[index % providers.length],
                                            features: ['Halloween Theme', 'Spooky Bonus Features', 'Special Halloween Promotions']
                                          })
                                        }}
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={`Halloween Game ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="160px"
                                          />
                                        )}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'color-mix(in srgb, var(--ds-primary, #ee3536) 10%, transparent)' }} />
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </RainBackground>
                        </div>
                        
                        {/* Baccarat Section - Mixed: Rectangles and Squares */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-white flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Baccarat (23)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Baccarat')
                                  setShowAllGames(true)
                                  setActiveSubNav('For You')
                                }}
                              >
                                All Games
                              </Button>
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              {!isMobile && (
                                <>
                                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                                </>
                              )}
                              <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  // Only first tile is rectangle, rest are squares
                                  const isRectangle = index === 0
                                  const imageSrc = squareTileImages[index % squareTileImages.length]
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className={isRectangle ? "w-[240px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0" : "w-[160px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"}
                                        onClick={() => {
                                          const baccaratNames = ['Baccarat Classic', 'Punto Banco', 'Baccarat Squeeze', 'Speed Baccarat', 'Lightning Baccarat', 'Baccarat Control Squeeze', 'VIP Baccarat', 'Baccarat Dragon Bonus', 'Baccarat Side Bets', 'Baccarat Super 6']
                                          const providers = ['Evolution Gaming', 'Pragmatic Play', 'BetSoft', 'Dragon Gaming']
                                          setSelectedGame({
                                            title: baccaratNames[index % baccaratNames.length],
                                            image: imageSrc,
                                            provider: providers[index % providers.length],
                                            features: ['Live Dealer', 'Multiple Side Bets', 'High Stakes Available']
                                          })
                                        }}
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={`Baccarat Game ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes={isRectangle ? "240px" : "160px"}
                                          />
                                        )}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    )}
                  </AnimatePresence>
              </div>
              </>
                </motion.div>
            )}
            </AnimatePresence>
          </SidebarInset>
        </div>

        {/* Account Details Drawer */}
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
              height: '80vh',
              maxHeight: '80vh',
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
                  {/* Balance Information */}
                  <div className="mb-4">
                    <div className="rounded-lg bg-[var(--ds-control-bg)] px-3 py-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--ds-fg-muted)]">Available Balance</span>
                        <span className="text-sm font-semibold text-[var(--ds-fg)]">
                  {currentBrand.symbol}
                  <NumberFlow value={displayBalance} format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                        </span>
                </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--ds-fg-muted)]">Free Bet</span>
                        <span className="text-sm font-semibold text-[var(--ds-fg)]">$0.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--ds-fg-muted)]">Level</span>
                        <span className="text-sm font-semibold text-[var(--ds-fg-muted)]">Gold · 62</span>
                      </div>
                    </div>
              </div>
              
                  <Separator className="bg-[var(--ds-control-hover)] mb-3" />
                  
                  {/* Notifications */}
                  <div className="space-y-0.5 w-full mb-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-10 px-3"
                      onClick={() => setAccountDrawerView('notifications')}
                    >
                      <IconBell className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)] flex-shrink-0" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Notifications</span>
                    </Button>
                  </div>
                  
                  <Separator className="bg-[var(--ds-control-hover)] mb-6" />
                  
                  {/* Navigation List */}
                  <div className="space-y-1 w-full">

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3 min-w-0"
                    onClick={() => {
                      setAccountDrawerOpen(false)
                      router.push('/account')
                    }}
                    >
                      <IconUser className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">My Account</span>
                </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3 min-w-0"
                      onClick={() => {
                        setAccountDrawerOpen(false)
                        setMyBetsInitialFilter('pending')
                        setShowMyBets(true); window.scrollTo(0, 0)
                        if (!showSports) {
                          setShowSports(true)
                          setShowVipRewards(false)
                        }
                      }}
                    >
                      <IconFileText className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)] flex-shrink-0" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Pending Bets</span>
                      <span className="ml-auto flex items-center gap-1.5 text-sm text-[var(--ds-fg-muted)]">
                        {sampleBets.filter(b => !b.status && !b.isLive).length > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ds-control-hover)] text-[10px] font-bold text-[var(--ds-fg-muted)]">{sampleBets.filter(b => !b.status && !b.isLive).length}</span>
                        )}
                        ${sampleBets.filter(b => !b.status && !b.isLive).reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
                      </span>
                </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                    >
                      <IconCurrencyDollar className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Transactions History</span>
                </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                    >
                      <IconTicket className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Bet History</span>
                    </Button>

                    <Separator className={cn("bg-[var(--ds-control-hover)]", isMobile ? "my-3" : "my-4")} />


                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                    >
                      <IconGift className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">My Bonus</span>
                </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                    >
                      <IconUserPlus className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Refer a Friend</span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                      onClick={() => {
                        openVipDrawer()
                      }}
                    >
                      <IconCrown className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">VIP Hub</span>
                </Button>

                    <Separator className="my-2 bg-[var(--ds-control-hover)]" />

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                    >
                      <IconLogout className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Log Out</span>
                    </Button>
              </div>
                </>
              ) : (
                <>
                  {/* Notifications Page */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)]"
                      >
                        View All
                      </Button>
                </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--ds-fg)] font-medium">New Promotion Available!</p>
                          <p className="text-xs text-[var(--ds-fg-subtle)] mt-1">Claim your free spins now!</p>
                          <p className="text-xs text-white/45 mt-1">2 hours ago</p>
                </div>
              </div>
                      <div className="flex items-start gap-3 p-3 rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--ds-fg)] font-medium">Your Bet has been settled!</p>
                          <p className="text-xs text-[var(--ds-fg-subtle)] mt-1">Check your winnings now!</p>
                          <p className="text-xs text-white/45 mt-1">5 hours ago</p>
                </div>
                </div>
                      <div className="flex items-start gap-3 p-3 rounded-small hover:bg-[var(--ds-control-hover)] cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-transparent mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--ds-fg)] font-medium">Weekly summary</p>
                          <p className="text-xs text-[var(--ds-fg-subtle)] mt-1">View your weekly betting activity</p>
                          <p className="text-xs text-white/45 mt-1">1 day ago</p>
              </div>
              </div>
                      <div className="flex items-start gap-3 p-3 rounded-small hover:bg-[var(--ds-control-hover)] cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-transparent mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--ds-fg)] font-medium">Bet settled</p>
                          <p className="text-xs text-[var(--ds-fg-subtle)] mt-1">Your bet on Liverpool has been settled</p>
                          <p className="text-xs text-white/45 mt-1">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-small hover:bg-[var(--ds-control-hover)] cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-transparent mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--ds-fg)] font-medium">New bonus code available</p>
                          <p className="text-xs text-[var(--ds-fg-subtle)] mt-1">Use code BONUS50 for 50% match</p>
                          <p className="text-xs text-white/45 mt-1">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>

        {/* VIP Rewards Drawer */}
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
            <div className="relative z-50 flex flex-shrink-0 items-center gap-2 px-4 pb-2 pt-4">
              <DrawerClose asChild>
                <button
                  type="button"
                  className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                  aria-label="Back"
                >
                  <IconChevronLeft className="h-5 w-5" stroke={2} />
                </button>
              </DrawerClose>
              <h2 className="text-base font-semibold text-white">VIP Hub</h2>
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

        {/* Search Overlay */}
        <AnimatePresence mode="wait">
          {searchOverlayOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] overflow-y-auto"
              style={{ pointerEvents: 'auto', zIndex: 200 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSearchOverlayOpen(false)
                  setSearchQuery('')
                  setActiveSubNav('For You')
                  setShowAllGames(false)
                  setSelectedCategory('')
                  setSelectedGame(null)
                }
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="min-h-screen bg-[#1a1a1a] text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search Header */}
                <div className="sticky top-0 bg-[#1a1a1a]/60 backdrop-blur-xl border-b border-white/10 z-10 px-6 py-4">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-end mb-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSearchOverlayOpen(false)
                          setSearchQuery('')
                          setActiveSubNav('For You')
                          setShowAllGames(false)
                          setSelectedCategory('')
                          setSelectedVendor('')
                          setSelectedGame(null)
                          // Force focus back to main content
                          setTimeout(() => {
                            const mainContent = document.querySelector('[data-content-item]')
                            if (mainContent) {
                              (mainContent as HTMLElement).focus()
                            }
                          }, 100)
                        }}
                        className="p-2 hover:bg-white/10 rounded-small transition-colors"
                      >
                        <IconX className="w-6 h-6 text-white/70 hover:text-white" />
                      </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                          <IconSearchNew className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && searchQuery) {
                                // Handle search
                                console.log('Searching for:', searchQuery)
                              }
                            }}
                            className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-small text-white placeholder:text-white/50 focus:outline-none focus:border-white/20"
                            autoFocus
                          />
                          {searchQuery ? (
                            <button
                              onClick={() => {
                                // Handle search
                                console.log('Searching for:', searchQuery)
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded transition-colors"
                              title="Search"
                            >
                              <IconArrowRight className="w-5 h-5 text-white/70 hover:text-white" />
                            </button>
                          ) : (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <kbd className="px-2 py-1 text-xs font-semibold text-white/50 bg-white/5 border border-white/10 rounded">↵</kbd>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setAdvancedSearchOpen(true)}
                          className="text-white/70 hover:text-white flex items-center gap-1 text-sm"
                        >
                          <IconChevronDown className="w-4 h-4" />
                          ADVANCED SEARCH
                        </button>
                        <span className="text-sm text-white/50">No filters applied</span>
                      </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex p-1 bg-white/5 rounded-full w-fit border border-white/10">
                        <ViewTab
                          active={viewMode === 'list'}
                          onClick={() => setViewMode('list')}
                          icon={IconList}
                          label="List"
                          brandPrimary={brandPrimary}
                        />
                        <ViewTab
                          active={viewMode === 'card'}
                          onClick={() => setViewMode('card')}
                          icon={IconLayoutGrid}
                          label="Card"
                          brandPrimary={brandPrimary}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                <div className="max-w-7xl mx-auto px-6 py-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Recommended games</h3>
                  <LayoutGroup>
                    <motion.div
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                        mass: 1
                      }}
                      className={cn(
                        "w-full relative",
                        viewMode === 'list' && "flex flex-col gap-4",
                        viewMode === 'card' && "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
                        viewMode === 'pack' && "h-64 flex items-center justify-center mt-8"
                      )}
                    >
                      {Array.from({ length: 22 }).map((_, index) => {
                        const imageSrc = squareTileImages[index % squareTileImages.length]
                        // Mix of different game types
                        const gameType = index % 3
                        const isGoldNugget = gameType === 0
                        const isPlinko = gameType === 1
                        const isSubtitle = gameType === 2
                        
                        return (
                          <motion.div
                            key={index}
                            layout
                            className={cn(
                              "relative flex items-center z-10 group cursor-pointer",
                              viewMode === 'list' && "flex-row gap-4 w-full",
                              viewMode === 'card' && "flex-col gap-3 w-full items-start",
                              viewMode === 'pack' && "absolute w-56 h-56 items-center justify-center"
                            )}
                            style={{
                              zIndex: viewMode === 'pack' ? 22 - index : 1,
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                              opacity: 1, 
                              ...(viewMode === 'pack' ? {
                                rotate: index === 0 ? -12 : index === 1 ? 6 : -6,
                                x: index === 0 ? -25 : index === 1 ? 25 : 0,
                                y: index === 0 ? -5 : index === 1 ? 5 : 0,
                              } : {
                                rotate: 0,
                                x: 0,
                                y: 0,
                              })
                            }}
                            transition={{ 
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                              mass: 1,
                              delay: index * 0.02
                            }}
                            onClick={() => {
                              const gameTitle = isGoldNugget ? 'Gold Nugget Rush' : isPlinko ? 'Original Plinko' : 'Subtitle Title'
                              const provider = isPlinko ? 'BETONLINE' : 'Dragon Gaming'
                              const features = isGoldNugget 
                                ? ['Exploding Wilds Every 10 Spins!', 'Free Spins with Up to 10 Wilds on Every Spin!']
                                : isPlinko
                                ? ['Classic Plinko Action', 'Multiple Betting Ranges']
                                : ['Live Casino Experience', 'Real-Time Gameplay']
                              setSelectedGame({
                                title: gameTitle,
                                image: imageSrc,
                                provider,
                                features
                              })
                            }}
                          >
                            <motion.div
                              layout
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 30,
                                mass: 1
                              }}
                              className={cn(
                                "relative overflow-hidden shrink-0 bg-white/5 border border-white/10",
                                viewMode === 'list' && "w-16 h-16 rounded-small",
                                viewMode === 'card' && "w-full aspect-square rounded-small",
                                viewMode === 'pack' && "w-full h-full rounded-lg"
                              )}
                            >
                              {imageSrc && (
                                <Image
                                  src={imageSrc}
                                  alt={`Game ${index + 1}`}
                                  fill
                                  className={cn(
                                    "object-cover group-hover:scale-105 transition-transform duration-300",
                                    viewMode === 'list' && "rounded-small",
                                    viewMode === 'card' && "rounded-small",
                                    viewMode === 'pack' && "rounded-lg"
                                  )}
                                  sizes={viewMode === 'list' ? "64px" : viewMode === 'card' ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" : "224px"}
                                />
                              )}
                              
                              {/* Top Left Tags */}
                              {viewMode !== 'list' && (
                                <>
                                  {isGoldNugget && (
                                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                                      HOT
                                    </div>
                                  )}
                                  {(isPlinko || isSubtitle) && (
                                    <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>
                                      $25-$100
                                    </div>
                                  )}
                                  {isPlinko && (
                                    <div className="absolute top-2 left-12 bg-blue-500 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                                      B
                                    </div>
                                  )}
                                </>
                              )}
                              
                              {/* Game Title Overlay - Only for card and pack views */}
                              {viewMode !== 'list' && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3">
                                  {isGoldNugget && (
                                    <>
                                      <div className="text-white font-semibold text-sm mb-1">Gold Nugget Rush</div>
                                      {/* Bottom Icons */}
                                      <div className="flex items-center gap-2 text-white/70 text-xs">
                                        <IconUser className="w-3 h-3" />
                                        <IconPlay className="w-3 h-3" />
                                        <IconStar className="w-3 h-3" />
                                        <IconCurrencyDollar className="w-3 h-3" />
                                      </div>
                                    </>
                                  )}
                                  {isPlinko && (
                                    <>
                                      <div className="text-white font-semibold text-xs mb-1">ORIGINAL PLINKO</div>
                                      <div className="text-white/60 text-[10px]">BETONLINE</div>
                                    </>
                                  )}
                                  {isSubtitle && (
                                    <>
                                      <div className="text-white font-semibold text-xs mb-1">SUBTITLE TITLE</div>
                                      <div className="flex items-center gap-1 text-white/70 text-[10px]">
                                        <IconUser className="w-3 h-3" />
                                        <span>8</span>
                                        <span>20</span>
                                        <span>13</span>
                                        <span>0</span>
                                        <span>11</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                            </motion.div>

                            {/* List View Info */}
                            <AnimatePresence mode="popLayout" initial={false}>
                              {viewMode === 'list' && (
                                <motion.div
                                  key={`${index}-info`}
                                  layout
                                  initial={{
                                    opacity: 0,
                                    scale: 0.9,
                                    filter: "blur(4px)",
                                  }}
                                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                  exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                                  transition={{ duration: 0.1, ease: "linear" }}
                                  className="flex flex-1 justify-between items-center min-w-0"
                                >
                                  <div className="flex flex-col gap-0.5 min-w-0">
                                    <h3 className="font-medium text-[15px] text-white leading-tight truncate">
                                      {isGoldNugget ? 'Gold Nugget Rush' : isPlinko ? 'Original Plinko' : 'Subtitle Title'}
                                    </h3>
                                    <div className="text-white/70 font-medium text-xs flex items-center gap-1.5">
                                      <span className="truncate">
                                        {isGoldNugget ? 'Slots' : isPlinko ? 'Originals' : 'Live Casino'}
                                      </span>
                                    </div>
                                  </div>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setFavoritedGames(prev => {
                                        const newSet = new Set(prev)
                                        if (newSet.has(index)) {
                                          newSet.delete(index)
                                        } else {
                                          newSet.add(index)
                                        }
                                        return newSet
                                      })
                                    }}
                                    className="flex items-center justify-center p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0 ml-2"
                                  >
                                    <IconHeart 
                                      className={cn(
                                        "w-4 h-4 transition-colors",
                                        favoritedGames.has(index) 
                                          ? "text-pink-500 fill-pink-500" 
                                          : "text-white/70"
                                      )}
                                    />
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {viewMode === 'list' && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute -bottom-2 left-20 right-0 h-px bg-white/10"
                              />
                            )}
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  </LayoutGroup>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Detail Full Screen Overlay */}
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-[#1a1a1a]"
            >
              {/* Rounded Glass Top Bar - Hidden in mobile landscape */}
              {!(isMobile && isLandscape) && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                  className={cn(
                    "fixed top-4 left-4 right-4 z-50 rounded-2xl backdrop-blur-xl border border-white/10",
                    isMobile ? "h-10" : "h-12"
                  )}
                  style={{
                    backgroundColor: 'rgba(26, 26, 26, 0.6)',
                  }}
                >
                  <div className="flex items-center justify-between h-full px-3 relative">
                    {/* Hamburger Menu - Left */}
                    <div className="relative" ref={gameLauncherMenuRef}>
                      <button
                        onClick={() => setGameLauncherMenuOpen(!gameLauncherMenuOpen)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      >
                        {/* Custom Staggered Hamburger Icon */}
                        <svg
                          className="w-4 h-4 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="4" y1="7" x2="20" y2="7" />
                          <line x1="6" y1="12" x2="20" y2="12" />
                          <line x1="4" y1="17" x2="18" y2="17" />
                        </svg>
                  </button>
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {gameLauncherMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-[#2d2d2d]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                          >
                            <div className="py-2">
                              <button
                                onClick={() => {
                                  openDepositDrawer()
                                  setGameLauncherMenuOpen(false)
                                }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm"
                              >
                                Quick Deposit
                  </button>
                              <button
                                onClick={() => {
                                  setSimilarGamesDrawerOpen(true)
                                  setGameLauncherMenuOpen(false)
                                }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm"
                              >
                                More Games Like This
                  </button>
                            </div>
                            
                            {/* VIP Progress Bar */}
                            <div className="px-4 py-3 border-t border-white/10 bg-white/5">
                              <div className="text-xs text-white/70 mb-2">Gold To Platinum I</div>
                              <VipTierProgressBar value={45} variant="compact" showOriginalsNote={false} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                </div>

                {/* Game Name - Center (absolutely positioned) */}
                    <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white max-w-[50%] truncate px-2">
                  {selectedGame.title}
                </h2>

                    {/* Right Icons - Fullscreen (desktop only), Favorite and Close */}
                    <div className="flex items-center gap-1">
                      {!isMobile && (
                <button
                          onClick={() => {
                            if (!gameImageRef.current) return
                            
                            if (!isFullscreen) {
                              if (gameImageRef.current.requestFullscreen) {
                                gameImageRef.current.requestFullscreen()
                              } else if ((gameImageRef.current as any).webkitRequestFullscreen) {
                                (gameImageRef.current as any).webkitRequestFullscreen()
                              } else if ((gameImageRef.current as any).msRequestFullscreen) {
                                (gameImageRef.current as any).msRequestFullscreen()
                              }
                              setIsFullscreen(true)
                            } else {
                              if (document.exitFullscreen) {
                                document.exitFullscreen()
                              } else if ((document as any).webkitExitFullscreen) {
                                (document as any).webkitExitFullscreen()
                              } else if ((document as any).msExitFullscreen) {
                                (document as any).msExitFullscreen()
                              }
                              setIsFullscreen(false)
                            }
                          }}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <IconMaximize className="w-4 h-4 text-white/70 hover:text-white" />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          // Toggle favorite
                          const gameId = hashGameTitle(selectedGame.title)
                          const newFavorited = new Set(favoritedGames)
                          if (newFavorited.has(gameId)) {
                            newFavorited.delete(gameId)
                          } else {
                            newFavorited.add(gameId)
                          }
                          setFavoritedGames(newFavorited)
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <IconHeart 
                          className={cn(
                            "w-4 h-4 transition-colors",
                            favoritedGames.has(hashGameTitle(selectedGame.title))
                              ? "text-pink-500 fill-pink-500"
                              : "text-white/70"
                          )}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGame(null)
                          setGameLauncherMenuOpen(false)
                          setIsFullscreen(false)
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <IconX className="w-4 h-4 text-white/70 hover:text-white" />
                </button>
                    </div>
                  </div>
              </motion.div>
              )}

              {/* Content Area - Loading then Game Image (Desktop only) */}
              <div className={cn("h-full flex items-center justify-center", isMobile ? "pt-20" : "pt-24")} style={{ zIndex: 1 }}>
                <AnimatePresence mode="wait">
                  {!gameImageLoaded ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center gap-4"
                    >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full"
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/70 text-sm"
                  >
                    Loading game...
                  </motion.p>
                  {selectedGame.provider && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/50 text-xs"
                    >
                      {selectedGame.provider}
                    </motion.p>
                  )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="game-image"
                      ref={gameImageRef}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "fixed rounded-2xl overflow-hidden",
                        isFullscreen || (isMobile && isLandscape) 
                          ? "inset-0 rounded-none" 
                          : "top-4 left-4 right-4"
                      )}
                      style={isFullscreen || (isMobile && isLandscape) ? {} : { 
                        top: isMobile ? '68px' : '80px',
                        height: isMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 100px)',
                        maxHeight: isMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 100px)'
                      }}
                    >
                      {selectedGame.image && (
                        <Image
                          src="/games/square/hookedOnFishing.png"
                          alt={selectedGame.title}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Preload image */}
                {selectedGame.image && !gameImageLoaded && (
                  <div className="absolute inset-0 opacity-0 pointer-events-none">
                    <img
                      src="/games/square/hookedOnFishing.png"
                      alt=""
                      onLoad={() => {
                        setTimeout(() => {
                          setGameImageLoaded(true)
                        }, 500)
                      }}
                      className="w-full h-full object-contain"
                    />
                </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Similar Games Drawer */}
        <Drawer open={similarGamesDrawerOpen} onOpenChange={setSimilarGamesDrawerOpen} direction={isMobile ? "bottom" : "right"} shouldScaleBackground={false}>
          <DrawerContent 
            showOverlay={isMobile}
            className={cn(
              "bg-[var(--ds-page-bg)] text-[var(--ds-fg)] flex flex-col relative",
              "w-full sm:max-w-2xl border-l border-white/10 overflow-hidden"
            )}
            style={isMobile ? {
              height: '80vh',
              maxHeight: '80vh',
              top: 'auto',
              bottom: 0,
            } : undefined}
          >
            {isMobile && <DrawerHandle />}
            <DrawerHeader className="pb-4 sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(26, 26, 26, 0.8)' }}>
              <div className="flex items-center justify-between">
                <div className="pt-2">
                  <DrawerTitle className="text-white text-xl font-bold">More Games Like This</DrawerTitle>
                  <DrawerDescription className="text-white/70 text-sm mt-1">
                    Similar games you might enjoy
                  </DrawerDescription>
                </div>
                <DrawerClose asChild>
                  <button className="rounded-full bg-white/10 hover:bg-white/20 p-2 transition-colors">
                    <IconX className="h-4 w-4 text-white" />
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-6 -mt-4 pt-4">
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Array.from({ length: 30 }).map((_, index) => {
                  const gameNames = ['Gold Nugget Rush', 'Mega Fortune', 'Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers', 'Mega Moolah', 'Bonanza', 'Razor Shark', 'Sweet Bonanza', 'Gates of Olympus', 'Big Bass Bonanza', 'The Dog House', 'Wolf Gold', 'Fire Strike', 'Chilli Heat', 'Gold Nugget Rush', 'Mega Fortune', 'Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers']
                  const providers = ['NetEnt', 'Pragmatic Play', 'Microgaming', 'BetSoft', 'Evolution Gaming']
                  const imageSrc = squareTileImages[index % squareTileImages.length]
                  const gameName = gameNames[index % gameNames.length]
                  const provider = providers[index % providers.length]
                  
                  return (
                    <div
                      key={index}
                      className="w-full aspect-square rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group"
                      onClick={() => {
                        setSelectedGame({
                          title: gameName,
                          image: imageSrc,
                          provider: provider,
                          features: ['High RTP', 'Free Spins Feature', 'Bonus Rounds Available']
                        })
                        setSimilarGamesDrawerOpen(false)
                      }}
                    >
                      {imageSrc && (
                        <Image
                          src={imageSrc}
                          alt={gameName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, 50vw"
                        />
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                    </div>
                  )
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Advanced Search Side Drawer */}
        <Drawer open={advancedSearchOpen} onOpenChange={setAdvancedSearchOpen} direction={isMobile ? "bottom" : "right"} shouldScaleBackground={false}>
          <DrawerContent className="w-full sm:max-w-md bg-[#2d2d2d] border-l border-white/10 text-white z-[210] relative">
            <DrawerHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-white text-2xl">Advanced Search</DrawerTitle>
                  <DrawerDescription className="text-white/70">
                    Filter games by category, provider, and more
                  </DrawerDescription>
                </div>
                <DrawerClose asChild>
                  <button className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
                    <IconX className="h-4 w-4 text-white" />
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="mt-6 space-y-6">
              {/* Filter sections will go here */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white">Category</h3>
                  <div className="space-y-2">
                    {['Slots', 'Blackjack', 'Roulette', 'Baccarat', 'Live Casino', 'Video Poker'].map((category) => (
                      <label key={category} className="flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white">Provider</h3>
                  <div className="space-y-2">
                    {['BetOnline', 'Dragon Gaming', 'Evolution', 'Pragmatic Play'].map((provider) => (
                      <label key={provider} className="flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" />
                        <span>{provider}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

      {/* Toast Notification - Rendered via Portal */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {showToast && (
            <motion.div
              data-toast-notification
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ 
                position: 'fixed',
                top: '80px',
                right: '24px',
                left: 'auto',
                bottom: 'auto',
                zIndex: 999999,
                pointerEvents: 'auto',
                backgroundColor: '#2d2d2d',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '8px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                maxWidth: '384px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  backgroundColor: '#97c43c', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconCheck className="w-3 h-3 text-white" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'white', flex: 1 }}>{toastMessage}</span>
                {toastAction && (
                  <Button
                    onClick={() => {
                      toastAction.onClick()
                      setShowToast(false)
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 h-8 ml-2"
                    size="sm"
                  >
                    View
                  </Button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowToast(false)
                  setToastAction(null)
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/[0.06] text-white/55 transition-colors hover:bg-white/[0.12] hover:text-white"
                aria-label="Dismiss notification"
              >
                <IconX className="h-4 w-4" strokeWidth={2} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Mobile: Dynamic Island Search - Bottom of screen */}
      {/* Hide dock when betslip is open */}
      {isMobile && !betslipOpen && (
        <DynamicIsland
          onSearchClick={() => setSearchOverlayOpen(true)}
          onBetslipClick={() => {
            setBetslipOpen(true)
            setBetslipMinimized(false)
            // Reset manually closed flag when user clicks dock button
            setBetslipManuallyClosed(false)
          }}
          showBetslip={true}
          betCount={bets.length}
          isSearchActive={searchOverlayOpen}
          showSearch={!showVipRewards}
          showFavorites={!showVipRewards}
            />
      )}
    </div>
  )
}

// View Tab Component for Search Overlay
function ViewTab({
  active,
  onClick,
  icon: Icon,
  label,
  brandPrimary,
}: {
  active: boolean
  onClick: () => void
  icon: any
  label: string
  brandPrimary: string
}) {
  const snappySpring = {
    type: "spring" as const,
    stiffness: 350,
    damping: 30,
    mass: 1
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 text-xs font-normal uppercase transition-all rounded-full outline-none",
        active
          ? "text-white"
          : "text-white/50 hover:text-white hover:bg-white/5"
      )}
    >
      {active && (
        <motion.div
          layoutId="active-view-tab"
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
          transition={snappySpring}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <Icon
          size={16}
          className={cn(
            "transition-transform duration-300",
            active && "scale-110"
          )}
        />
        {label}
      </span>
    </button>
  )
}

export default function NavTestPage() {
  return (
    <SidebarProvider>
      <NavTestPageContent />
    </SidebarProvider>
  )
}
