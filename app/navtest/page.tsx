'use client'

import { VipCrownNavButton } from '@/components/vip/vip-crown-nav-button'

import { VipHubScrollBody } from '@/components/vip/vip-hub-scroll-body'
import { useRainBalance } from '@/hooks/use-rain-balance'
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
import { DailySpinCard } from '@/components/promotions/daily-spin-card'
import { SidebarPromos } from '@/components/sidebar-promos'
import { DailyRacesTimer } from '@/components/daily-races-timer'

import { useState, useEffect, useRef, useCallback, useMemo, useId } from 'react'
import { useChatStore } from '@/lib/store/chatStore'
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
  IconBallBasketball,
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
  IconMaximize
, IconBrandTelegram, IconRefresh, IconParachute, IconTargetArrow, IconMessageCircle2, IconConfetti} from '@tabler/icons-react'
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
  const imagePath = `/logos/payment/${method.toLowerCase()}.png`
  
  return (
    <Card className={`border-white/10 bg-white/5 p-2 rounded-small ${className || ''}`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-center h-8 px-3 min-w-[60px]">
          {!imageError ? (
            <Image
              src={imagePath}
              alt={method}
              width={60}
              height={20}
              className="object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-xs font-semibold text-white/70">{method}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Security Badge Component with fallback
function SecurityBadge({ name, iconPath, className }: { name: string; iconPath: string; className?: string }) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <Card className={`border-white/10 bg-white/5 p-2 rounded-small ${className || ''}`}>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 h-8 px-3">
          {!imageError ? (
            <Image
              src={iconPath}
              alt={name}
              width={16}
              height={16}
              className="object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <IconShield className="w-4 h-4 text-green-500" />
          )}
          <span className="text-xs font-semibold text-white/70">{name}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function GameSection({ title, games }: { title: string; games: typeof mostPlayedGames }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 h-8 px-3">
            ALL GAMES
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
                  className="relative z-10 text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white dark:data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5"
                >
                  {activeRaceTab === tab && (
                    <motion.div
                      layoutId="activeRaceTab"
                      className="absolute inset-0 rounded-2xl -z-10"
                      style={{ backgroundColor: brandPrimary }}
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
                    className="relative z-10 text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white dark:data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5"
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activePromosTab"
                        className="absolute inset-0 rounded-2xl -z-10"
                        style={{ backgroundColor: brandPrimary }}
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
                    className="relative z-10 text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white dark:data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5"
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeBonusTab"
                        className="absolute inset-0 rounded-2xl -z-10"
                        style={{ backgroundColor: brandPrimary }}
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

// VIP Rewards Page Component
function VIPRewardsPage({ brandPrimary, setVipDrawerOpen, setVipActiveTab, setShowToast, setToastMessage, setToastAction, setShowVipRewards, setIsPageTransitioning, initialVipSidebarItem, setInitialVipSidebarItem, previousPageState, setPreviousPageState, setActiveSubNav, quickLinksOpen, vipActiveSidebarItem, setVipActiveSidebarItem }: { brandPrimary: string; setVipDrawerOpen: (open: boolean) => void; setVipActiveTab: (tab: string) => void; setShowToast: (show: boolean) => void; setToastMessage: (message: string) => void; setToastAction: (action: { label: string; onClick: () => void } | null) => void; setShowVipRewards: (show: boolean) => void; setIsPageTransitioning: (transitioning: boolean) => void; initialVipSidebarItem?: string | null; setInitialVipSidebarItem?: (item: string | null) => void; previousPageState?: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null; setPreviousPageState?: (state: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null) => void; setActiveSubNav?: (nav: string) => void; quickLinksOpen?: boolean; vipActiveSidebarItem?: string; setVipActiveSidebarItem?: (item: string) => void }) {
  // vipActiveSidebarItem and setVipActiveSidebarItem come from props
  const [hasShownToast, setHasShownToast] = useState(false)
  

  
  // Show toast when VIP Rewards page is first shown
  useEffect(() => {
    if (!hasShownToast) {
      setToastMessage('You have a cash boost available')
      setToastAction({
        label: 'View',
        onClick: () => {
          setVipDrawerOpen(true)
          setVipActiveTab('Overview')
        }
      })
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        setToastAction(null)
      }, 5000)
      setHasShownToast(true)
    }
  }, [hasShownToast, setShowToast, setToastMessage, setToastAction, setVipDrawerOpen, setVipActiveTab])
  
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
                        style={{ backgroundColor: brandPrimary }}
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
                          setVipActiveTab('Overview')
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
        <footer className="bg-[#2d2d2d] border-t border-white/10 text-white mt-12 relative z-0">
          <div className="w-full px-4 md:px-6 py-6">
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
            <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/5">
              <div>Copyright \u00a92024 BetOnline.ag. All rights reserved.</div>
              <div></div>
            </div>
          </div>
        </footer>
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

function MyBetsContent({ onBack, brandPrimary }: { onBack: () => void; brandPrimary: string }) {
  const isMobile = useIsMobile()
  const [activeFilter, setActiveFilter] = useState<'all' | 'cash_out' | 'in_play' | 'pending' | 'graded'>('all')
  const [expandedBetId, setExpandedBetId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

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
function SportsPage({ activeTab, onTabChange, onBack, brandPrimary, brandPrimaryHover, onSearchClick }: { activeTab: string; onTabChange: (tab: string) => void; onBack: () => void; brandPrimary: string; brandPrimaryHover: string; onSearchClick: () => void }) {
  const { state: sidebarState, toggleSidebar, setOpenMobile } = useSidebar()
  const isMobile = useIsMobile()
  const router = useRouter()
  const [expandedSports, setExpandedSports] = useState<string[]>(['Soccer'])
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
  const [betslipOpen, setBetslipOpen] = useState(false)
  const [bets, setBets] = useState<Array<{
    id: string
    eventId: number
    eventName: string
    marketTitle: string
    selection: string
    odds: string
    stake: number
  }>>([])
  const [showMyBets, setShowMyBets] = useState(false)
  const [eventOrderBy, setEventOrderBy] = useState<string>('Popularity')
  const [selectedLeague, setSelectedLeague] = useState<number>(1) // Default to Premier League (id: 1)

  // Sportsbook settings state
  const [sportsbookSettingsOpen, setSportsbookSettingsOpen] = useState(false)
  const [oddsFormat, setOddsFormat] = useState<'American' | 'Fractional' | 'Decimal'>('American')
  const [betslipOddsSetting, setBetslipOddsSetting] = useState<'dont_accept' | 'higher' | 'any'>('higher')
  const [showBetConfirmation, setShowBetConfirmation] = useState(false)

  // Mobile sidebar quick links
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false)

  
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
    { icon: IconBolt, label: 'Live Betting' },
    { icon: IconWorld, label: 'World Cup Hub', active: false },
    { icon: IconRocket, label: 'Odds Boosters' },
    { icon: IconDice, label: 'Same Game Parlays' },
    { icon: IconTrophy, label: 'Mega Parlays' },
  ]
  
  const sportsCategories = [
    { icon: IconStar, label: 'Favourites' },
    { icon: IconTrophy, label: 'Top Leagues' },
    { icon: IconBallBaseball, label: 'Baseball' },
    { icon: IconBallBasketball, label: 'Basketball' },
    { icon: IconBallAmericanFootball, label: 'Football' },
    { 
      icon: IconBallFootball, 
      label: 'Soccer', 
      active: true,
      expandable: true,
      subItems: [
        { label: 'Go to All Soccer' },
        { label: 'Albania', icon: IconFlag2, badge: IconStar, subItems: [
          { label: '1st Division', badge: IconStar },
          { label: 'Superliga', badge: IconStar },
        ]},
        { label: 'Argentina', icon: IconFlag2 },
        { label: 'Brazil', icon: IconFlag2 },
        { label: 'Denmark', icon: IconFlag2 },
        { label: 'England', icon: IconFlag2 },
        { label: 'France', icon: IconFlag2 },
        { label: 'Germany', icon: IconFlag2 },
        { label: 'Italy', icon: IconFlag2 },
        { label: 'Japan', icon: IconFlag2 },
        { label: 'Malta', icon: IconFlag2 },
        { label: 'Spain', icon: IconFlag2 },
        { label: 'Thailand', icon: IconFlag2 },
        { label: 'Uruguay', icon: IconFlag2 },
        { label: 'USA', icon: IconFlag2 },
        { label: 'Uzbekistan', icon: IconFlag2 },
        { label: 'Vanuatu', icon: IconFlag2 },
        { label: 'Venezuela', icon: IconFlag2 },
        { label: 'Vietnam', icon: IconFlag2 },
        { label: 'International', icon: IconWorld },
        { label: 'Zambia', icon: IconFlag2 },
        { label: 'Zimbabwe', icon: IconFlag2 },
      ]
    },
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
  
  const handleFeatureClick = (label: string) => {
    // Handle feature clicks
    console.log('Feature clicked:', label)
  }
  
  const handleSportClick = (label: string) => {
    // Handle sport category clicks
    console.log('Sport clicked:', label)
  }
  
  // League data for carousel
  const leagues = [
    { id: 1, name: 'Premier League', country: 'England', icon: '/banners/sports_league/prem.svg' },
    { id: 2, name: 'La Liga', country: 'Spain', icon: '/banners/sports_league/laliga.svg' },
    { id: 3, name: 'MLS', country: 'USA', icon: '/banners/sports_league/mls.svg' },
    { id: 4, name: 'Champions League', country: 'Europe', icon: '/banners/sports_league/champions.svg' },
    { id: 5, name: 'Copa America', country: 'South America', icon: '/banners/sports_league/copa.svg' },
    { id: 6, name: 'Serie A', country: 'Italy', icon: IconTrophy },
    { id: 7, name: 'Bundesliga', country: 'Germany', icon: IconTrophy },
    { id: 8, name: 'Ligue 1', country: 'France', icon: IconTrophy },
    { id: 9, name: 'Championship', country: 'England', icon: IconTrophy },
    { id: 10, name: 'FA Cup', country: 'England', icon: IconTrophy },
    { id: 11, name: 'League One', country: 'England', icon: IconTrophy },
  ]
  
  // Sample event data with betting markets
  const liveEvents = [
    { 
      id: 1, 
      league: 'Premier League', 
      country: 'England',
      startTime: 'H1', 
      elapsedSeconds: 540, // 9 minutes = 540 seconds
      isLive: true,
      team1: 'Liverpool', 
      team2: 'Bournemouth', 
      score: { team1: 2, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'LIV', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'BOU', odds: '+350' }] },
        { title: 'Spread', options: [{ label: 'LIV -1.5', odds: '+350' }, { label: 'BOU +1.5', odds: '+350' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '+350' }, { label: 'U 3.5', odds: '+350' }] },
        { title: '1H Moneyline', options: [{ label: 'LIV', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'BOU', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'LIV -0.5', odds: '+350' }, { label: 'BOU +0.5', odds: '+350' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '+350' }, { label: 'U 1.5', odds: '+350' }] },
      ]
    },
    { 
      id: 2, 
      league: 'Premier League', 
      country: 'England',
      startTime: 'H2', 
      elapsedSeconds: 4020, // 67 minutes = 4020 seconds
      isLive: true,
      team1: 'Arsenal', 
      team2: 'Chelsea', 
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'ARS', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'CHE', odds: '+350' }] },
        { title: 'Spread', options: [{ label: 'ARS -0.5', odds: '+350' }, { label: 'CHE +0.5', odds: '+350' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+350' }, { label: 'U 2.5', odds: '+350' }] },
        { title: '1H Moneyline', options: [{ label: 'ARS', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'CHE', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'ARS -0.5', odds: '+350' }, { label: 'CHE +0.5', odds: '+350' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '+350' }, { label: 'U 1.5', odds: '+350' }] },
      ]
    },
    { 
      id: 3, 
      league: 'Premier League', 
      country: 'England',
      startTime: 'H1', 
      elapsedSeconds: 1380, // 23 minutes = 1380 seconds
      isLive: true,
      team1: 'Tottenham', 
      team2: 'Newcastle', 
      score: { team1: 0, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'TOT', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'NEW', odds: '+350' }] },
        { title: 'Spread', options: [{ label: 'TOT -1.5', odds: '+350' }, { label: 'NEW +1.5', odds: '+350' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+350' }, { label: 'U 2.5', odds: '+350' }] },
        { title: '1H Moneyline', options: [{ label: 'TOT', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'NEW', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'TOT -0.5', odds: '+350' }, { label: 'NEW +0.5', odds: '+350' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '+350' }, { label: 'U 1.5', odds: '+350' }] },
      ]
    },
  ]
  
  const upcomingEvents = [
    { 
      id: 4, 
      league: 'Premier League', 
      country: 'England',
      time: 'Today 15:00', 
      team1: 'Manchester City', 
      team2: 'Liverpool', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'MCI', odds: '2.10' }, { label: 'Tie', odds: '3.20' }, { label: 'LIV', odds: '3.50' }] },
        { title: 'Spread', options: [{ label: 'MCI -1.5', odds: '+350' }, { label: 'LIV +1.5', odds: '+350' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '+350' }, { label: 'U 3.5', odds: '+350' }] },
        { title: '1H Moneyline', options: [{ label: 'MCI', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'LIV', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'MCI -0.5', odds: '+350' }, { label: 'LIV +0.5', odds: '+350' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '+350' }, { label: 'U 1.5', odds: '+350' }] },
      ]
    },
    { 
      id: 5, 
      league: 'Premier League', 
      country: 'England',
      time: 'Today 15:00', 
      team1: 'Arsenal', 
      team2: 'Chelsea', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'ARS', odds: '1.85' }, { label: 'Tie', odds: '3.40' }, { label: 'CHE', odds: '4.20' }] },
        { title: 'Spread', options: [{ label: 'ARS -0.5', odds: '+350' }, { label: 'CHE +0.5', odds: '+350' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+350' }, { label: 'U 2.5', odds: '+350' }] },
        { title: '1H Moneyline', options: [{ label: 'ARS', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'CHE', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'ARS -0.5', odds: '+350' }, { label: 'CHE +0.5', odds: '+350' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '+350' }, { label: 'U 1.5', odds: '+350' }] },
      ]
    },
    { 
      id: 6, 
      league: 'Premier League', 
      country: 'England',
      time: 'Today 17:30', 
      team1: 'Tottenham', 
      team2: 'Newcastle', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'TOT', odds: '2.30' }, { label: 'Tie', odds: '3.10' }, { label: 'NEW', odds: '2.90' }] },
        { title: 'Spread', options: [{ label: 'TOT -1.5', odds: '+350' }, { label: 'NEW +1.5', odds: '+350' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+350' }, { label: 'U 2.5', odds: '+350' }] },
        { title: '1H Moneyline', options: [{ label: 'TOT', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'NEW', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'TOT -0.5', odds: '+350' }, { label: 'NEW +0.5', odds: '+350' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '+350' }, { label: 'U 1.5', odds: '+350' }] },
      ]
    },
    { 
      id: 7, 
      league: 'Premier League', 
      country: 'England',
      time: 'Today 17:30', 
      team1: 'Brighton', 
      team2: 'Aston Villa', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'BHA', odds: '2.15' }, { label: 'Tie', odds: '3.30' }, { label: 'AVL', odds: '3.25' }] },
        { title: 'Spread', options: [{ label: 'BHA -0.5', odds: '+350' }, { label: 'AVL +0.5', odds: '+350' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+350' }, { label: 'U 2.5', odds: '+350' }] },
        { title: '1H Moneyline', options: [{ label: 'BHA', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'AVL', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'BHA -0.5', odds: '+350' }, { label: 'AVL +0.5', odds: '+350' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '+350' }, { label: 'U 1.5', odds: '+350' }] },
      ]
    },
    { 
      id: 8, 
      league: 'Premier League', 
      country: 'England',
      time: 'Today 20:00', 
      team1: 'West Ham', 
      team2: 'Crystal Palace', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'WHU', odds: '2.00' }, { label: 'Tie', odds: '3.15' }, { label: 'CRY', odds: '3.60' }] },
        { title: 'Spread', options: [{ label: 'WHU -0.5', odds: '+350' }, { label: 'CRY +0.5', odds: '+350' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+350' }, { label: 'U 2.5', odds: '+350' }] },
        { title: '1H Moneyline', options: [{ label: 'WHU', odds: '+350' }, { label: 'Tie', odds: '+350' }, { label: 'CRY', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'WHU -0.5', odds: '+350' }, { label: 'CRY +0.5', odds: '+350' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '+350' }, { label: 'U 1.5', odds: '+350' }] },
      ]
    },
  ]

  // Helper function to check if a bet is selected
  const isBetSelected = (eventId: number, marketTitle: string, selection: string) => {
    return bets.some(bet => 
      bet.eventId === eventId && 
      bet.marketTitle === marketTitle && 
      bet.selection === selection
    )
  }

  // Helper function to add/remove bet from betslip (toggle behavior)
  const addBetToSlip = (eventId: number, eventName: string, marketTitle: string, selection: string, odds: string) => {
    // Check if this exact bet already exists
    const existingBet = bets.find(bet => 
      bet.eventId === eventId && 
      bet.marketTitle === marketTitle && 
      bet.selection === selection
    )
    
    if (existingBet) {
      // If bet already exists, remove it (toggle off)
      removeBet(existingBet.id)
      return
    }
    
    // Add new bet
    const newBet = {
      id: `${eventId}-${marketTitle}-${selection}-${Date.now()}`,
      eventId,
      eventName,
      marketTitle,
      selection,
      odds,
      stake: 10 // Default stake
    }
    setBets(prev => [...prev, newBet])
    // Open betslip when adding first bet, keep open for additional bets
    setBetslipOpen(true)
    // Expand betslip when adding a new bet
    setBetslipCollapsed(false)
  }

  // State for animating bet removal
  const [removingBetId, setRemovingBetId] = useState<string | null>(null)
  
  // State for collapsing betslip
  const [betslipCollapsed, setBetslipCollapsed] = useState(false)
  
  // Helper function to remove bet from betslip with swipe animation
  const removeBet = (betId: string) => {
    setRemovingBetId(betId)
    // Wait for animation to complete before removing
    setTimeout(() => {
      const newBets = bets.filter(bet => bet.id !== betId)
      setBets(newBets)
      setRemovingBetId(null)
      // Close drawer if no bets left
      if (newBets.length === 0) {
        setBetslipOpen(false)
      }
    }, 300)
  }

  // Helper function to update bet stake
  const updateBetStake = (betId: string, stake: number) => {
    setBets(prev => prev.map(bet => bet.id === betId ? { ...bet, stake } : bet))
  }

  // Calculate total stake and potential winnings
  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0)
  const calculatePotentialWin = () => {
    if (bets.length === 0) return 0
    // For parlay: multiply all odds and stake
    const oddsMultiplier = bets.reduce((product, bet) => {
      const oddsValue = parseFloat(bet.odds.replace('+', ''))
      return product * (oddsValue / 100 + 1)
    }, 1)
    return totalStake * oddsMultiplier - totalStake
  }
  const potentialWin = calculatePotentialWin()

  // Betslip Views
  const BetslipDefaultView = () => {
    const { setView } = useFamilyDrawer()
    const currencySymbol = '$'

    return (
      <>
        {betslipCollapsed ? (
          /* Minimized State - Compact bar only - NO other content */
          <div className="px-3 py-1.5 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {/* Counter Badge */}
              {bets.length > 0 && (
                <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-[2px]">
                  <span className="text-[12px] font-semibold text-white/87 leading-none">{bets.length}</span>
                </div>
              )}
              <span className="text-[12px] font-semibold text-black" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>Selection</span>
            </div>
            <button
              onClick={() => {
                setBetslipCollapsed(false)
              }}
              className="text-[10px] font-semibold uppercase tracking-[0.46px] cursor-pointer hover:opacity-70 transition-opacity px-2 py-1"
              style={{ color: 'rgba(0, 0, 0, 0.87)' }}
            >
              Show
            </button>
          </div>
        ) : (
          <>
            {/* Drag Indicator */}
            <div className="flex justify-center pt-4 pb-1">
              <div className="h-1 w-16 bg-black/20 rounded-full" />
            </div>

            {/* Header with Counter and Collapse/Show */}
            <div className="px-2 pb-2 border-b border-black/12">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {/* Counter Badge */}
                  {bets.length > 0 && (
                    <div className="bg-[#424242] h-4 min-w-[16px] px-1 flex items-center justify-center rounded-[2px]">
                      <span className="text-[12px] font-semibold text-white/87 leading-none">{bets.length}</span>
                    </div>
                  )}
                  <h2 className="text-[14px] font-semibold text-black leading-[18.48px]" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>Selection</h2>
                </div>
                {bets.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Collapse clicked, current state:', betslipCollapsed)
                      setBetslipCollapsed(true)
                      console.log('Set to collapsed')
                    }}
                    className="text-[10px] font-semibold uppercase tracking-[0.46px] cursor-pointer hover:opacity-70 transition-opacity px-1 py-1"
                    style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                  >
                    Collapse
                  </button>
                )}
              </div>
            </div>

            {/* Bets List - Only show when not collapsed */}
            {bets.length === 0 ? (
              <div className="px-2 py-8 text-center">
                <p className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.7)' }}>Your betslip is empty</p>
                <p className="text-xs mt-2" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>Select odds to add bets</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="px-2 py-2 space-y-0 overflow-y-auto scrollbar-hide" style={{ 
                  maxHeight: '60vh',
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none' 
                }}>
                  <AnimatePresence>
                    {[...bets].reverse().map((bet, reversedIndex) => {
                const event = liveEvents.find(e => e.id === bet.eventId) || upcomingEvents.find(e => e.id === bet.eventId)
                // First bet in original order (last in reversed) should have price boost
                const isFirstBet = reversedIndex === bets.length - 1
                const isRemoving = removingBetId === bet.id
                const toWin = bet.stake * (parseFloat(bet.odds.replace('+', '')) / 100 + 1) - bet.stake

                return (
                  <motion.div
                    key={bet.id}
                    initial={{ opacity: 1, x: 0 }}
                    animate={isRemoving ? { opacity: 0, x: '100%' } : { opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex gap-2 items-start min-h-[62px] pr-2 py-2"
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => removeBet(bet.id)}
                      className="pt-1 flex-shrink-0 w-4 h-4 flex items-center justify-center"
                    >
                      <IconX className="w-4 h-4" strokeWidth={2} style={{ color: 'rgba(0, 0, 0, 0.87)' }} />
                    </button>

                    {/* Bet Details */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      {/* Selection Name - Bold */}
                      <div className="text-[12px] font-bold leading-[16px] mb-1 capitalize truncate" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                        {bet.selection}
                      </div>
                      {/* Market Type */}
                      <div className="text-[10px] font-normal leading-[14.7px] mb-1" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                        {bet.marketTitle}
                      </div>
                      {/* Match Name */}
                      {event && (
                        <div className="text-[10px] font-normal leading-normal mb-1" style={{ color: 'rgba(0, 0, 0, 0.57)' }}>
                          {event.team1} @ {event.team2}
                        </div>
                      )}
                      {/* Price Boost Badge - Only for first bet */}
                      {isFirstBet && (
                        <div className="bg-[#ffdf00] flex items-center justify-center gap-0.5 p-0.5 rounded-[2px] inline-flex mt-1">
                          <IconRocket className="w-2 h-2" style={{ color: 'rgba(0, 0, 0, 0.87)' }} />
                          <span className="text-[8px] font-bold leading-[11.76px]" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>Price boost</span>
                        </div>
                      )}
                    </div>

                    {/* Odds and Risk Input */}
                    <div className="flex gap-2 items-start flex-shrink-0">
                      {/* Odds */}
                      <div className="flex items-center justify-center pt-4">
                        <div className="text-[12px] font-bold leading-[16px]" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                          {bet.odds}
                        </div>
                      </div>
                      {/* Risk Input */}
                      <div className="flex flex-col gap-0.5">
                        <div className="bg-white border border-black/12 rounded-[4px] h-[42px] w-[100px] flex items-center justify-end px-2 relative">
                          <Input
                            type="text"
                            inputMode="decimal"
                            value={bet.stake === 0 ? '' : bet.stake.toString()}
                            onChange={(e) => {
                              const inputValue = e.target.value
                              // Allow empty string, numbers, and one decimal point
                              if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
                                const numValue = inputValue === '' ? 0 : parseFloat(inputValue)
                                if (!isNaN(numValue) && numValue >= 0) {
                                  updateBetStake(bet.id, numValue)
                                } else if (inputValue === '') {
                                  updateBetStake(bet.id, 0)
                                }
                              }
                            }}
                            onBlur={(e) => {
                              // Format to 2 decimal places on blur
                              const value = parseFloat(e.target.value) || 0
                              updateBetStake(bet.id, Math.max(0, value))
                            }}
                            onWheel={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const target = e.currentTarget
                              target.blur()
                            }}
                            onFocus={(e) => {
                              e.currentTarget.select()
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                e.preventDefault()
                                const currentValue = bet.stake || 0
                                const step = e.key === 'ArrowUp' ? 1 : -1
                                updateBetStake(bet.id, Math.max(0, currentValue + step))
                              }
                            }}
                            className="border-0 bg-transparent text-[14px] font-normal leading-[24px] tracking-[0.15px] h-full p-0 pr-7 text-right focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                            placeholder="0"
                          />
                          {/* Custom Up/Down Arrows - Smaller and positioned better */}
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                updateBetStake(bet.id, (bet.stake || 0) + 1)
                              }}
                              className="w-3 h-2.5 flex items-center justify-center hover:bg-black/5 rounded transition-colors cursor-pointer"
                              style={{ color: 'rgba(0, 0, 0, 0.38)' }}
                            >
                              <IconChevronUp className="w-2 h-2" strokeWidth={3} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                updateBetStake(bet.id, Math.max(0, (bet.stake || 0) - 1))
                              }}
                              className="w-3 h-2.5 flex items-center justify-center hover:bg-black/5 rounded transition-colors cursor-pointer"
                              style={{ color: 'rgba(0, 0, 0, 0.38)' }}
                            >
                              <IconChevronDown className="w-2 h-2" strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right pr-1">
                          <div className="text-[10px] font-normal leading-[16.6px] tracking-[0.4px]" style={{ color: 'rgba(0, 0, 0, 0.57)' }}>
                            To Win {currencySymbol}{toWin.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
                    })}
                  </AnimatePresence>
                </div>
                
                {/* Place Bet Button - Sticky at bottom, always visible */}
                {bets.length > 0 && (
                  <div className="px-2 pt-3 pb-2 bg-white border-t border-black/12 sticky bottom-0">
                    <button
                      onClick={() => {
                        console.log('Place bet:', bets)
                        // Handle place bet logic
                      }}
                      disabled={totalStake === 0}
                      className={cn(
                        "w-full text-[15px] font-semibold uppercase tracking-[0.46px] py-2 px-[22px] rounded-[4px] transition-colors",
                        totalStake > 0 
                          ? "bg-[#059669] text-white hover:bg-[#10b981] cursor-pointer" 
                          : "bg-[#e0e0e0] text-[#9e9e9e] cursor-not-allowed"
                      )}
                    >
                      PLACE BET
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </>
    )
  }

  const betslipViews: ViewsRegistry = {
    default: BetslipDefaultView,
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
        className="!bg-[#2d2d2d] border-r border-white/10 text-white [&>div]:!bg-[#2d2d2d] !h-screen !top-0 !z-[102]"
      >
        {/* Sidebar Header — sticky, clean (both mobile and desktop) */}
        <SidebarHeader 
          className="px-4 h-14 flex items-center flex-shrink-0 overflow-hidden sticky top-0 z-20"
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
                { label: 'Sports', page: 'sports' as const },
                { label: 'Casino', page: 'casino' as const },
                { label: 'Poker', page: 'poker' as const },
                { label: 'VIP Rewards', page: 'vipRewards' as const },
                { label: 'Promotions', page: 'promotions' as const },
              ].map((item) => {
                const isCurrentPage = item.page === 'sports'
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
                <Separator className="bg-white/10 mx-2" />

            <SidebarGroup>
              <SidebarGroupLabel className="px-2 py-1 text-xs text-white/50">FEATURES</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sportsFeatures.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <SidebarMenuItem key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              isActive={item.active}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleFeatureClick(item.label)
                              }}
                              className={cn(
                                "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                "data-[active=true]:text-white data-[active=true]:font-medium",
                                "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                              )}
                              style={item.active ? { backgroundColor: brandPrimary } : undefined}
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
            
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 py-1 text-xs text-white/50">SPORTS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sportsCategories.map((sport, index) => {
                    const Icon = sport.icon
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
                                  style={isActive ? { backgroundColor: brandPrimary } : undefined}
                                >
                                  <Icon strokeWidth={1.5} className="w-5 h-5" />
                                  <span>{sport.label}</span>
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
                                  handleSportClick(sport.label)
                                }}
                                className={cn(
                                  "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                  "data-[active=true]:text-white data-[active=true]:font-medium",
                                  "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                                )}
                                style={isActive ? { backgroundColor: brandPrimary } : undefined}
                              >
                                <Icon strokeWidth={1.5} className="w-5 h-5" />
                                <span>{sport.label}</span>
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
      <SidebarInset className="bg-[#1a1a1a] text-white" style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}>
        {showMyBets ? (
          <MyBetsContent 
            onBack={() => setShowMyBets?.(false)} 
            brandPrimary={brandPrimary}
          />
        ) : (
        <div className="px-6 py-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <button 
              className="text-sm text-white/70 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              Soccer
              <IconChevronDown className="w-3 h-3" />
            </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#2d2d2d] border-white/10 text-white">
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: Football')}
                >
                  Football
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: Basketball')}
                >
                  Basketball
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: Baseball')}
                >
                  Baseball
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: Golf')}
                >
                  Golf
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: Tennis')}
                >
                  Tennis
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-white/50">/</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <button 
              className="text-sm text-white/70 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              England
              <IconChevronDown className="w-3 h-3" />
            </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#2d2d2d] border-white/10 text-white">
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: Spain')}
                >
                  Spain
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: Italy')}
                >
                  Italy
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: USA')}
                >
                  USA
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-white/50">/</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <button 
              className="text-sm text-white/70 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              Premier League
              <IconChevronDown className="w-3 h-3" />
            </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#2d2d2d] border-white/10 text-white">
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: Championship')}
                >
                  Championship
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: League 1')}
                >
                  League 1
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: League 2')}
                >
                  League 2
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: FA Cup')}
                >
                  FA Cup
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => console.log('Selected: League Cup')}
                >
                  League Cup
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* League Header */}
          <div className="relative h-14 mb-4 rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              <Image 
                src="/banners/sports_league/premier_banner_bg.png"
                alt="Premier League Banner"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-full flex items-center px-4 gap-4">
              <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                {(() => {
                  const leagueData = leagues.find(l => l.name === 'Premier League')
                  const isSvgPath = leagueData && typeof leagueData.icon === 'string'
                  return isSvgPath ? (
                    <Image 
                      src={leagueData.icon as string} 
                      alt="Premier League"
                      width={24}
                      height={20}
                      className="object-contain"
                    />
                  ) : (
                    <IconTrophy className="w-6 h-6 text-white" />
                  )
                })()}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Premier League</h1>
              </div>
              <div className="ml-auto">
                <Button 
                  variant="ghost" 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('View All clicked')
                  }}
                  className="text-white/70 hover:text-white hover:bg-white/10 text-xs cursor-pointer"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sports Sub Nav - Under Premier League Banner */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5">
                {/* Icon Tabs - Left Side - Search */}
                <div className="flex-shrink-0">
                  <div className="bg-white/5 p-0.5 h-auto gap-0.5 rounded-3xl border-0 flex items-center transition-colors duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onSearchClick()
                      }}
                      className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 ease-in-out"
                    >
                      <IconSearch className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                {/* Text Tabs - Middle */}
                <AnimateTabs value={activeTab} onValueChange={(value) => { 
                  onTabChange(value)
                }} className="flex-1">
                  <AnimateTabsList className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300">
                    {['Events', 'Outrights', 'Boosts', 'Specials', 'All Leagues'].map((tab) => (
                      <TabsTab 
                        key={tab}
                        value={tab} 
                        className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none"
                      >
                        {activeTab === tab && (
                          <motion.div
                            layoutId="activeSportsTab"
                            className="absolute inset-0 rounded-2xl -z-10"
                            style={{ backgroundColor: brandPrimary }}
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
                
                {/* Events Filter - Right Side */}
                <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
                  <span className="text-xs text-white/50 whitespace-nowrap">Events ordered by: {eventOrderBy}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
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
              </div>
          </div>
          
          {/* League Cards Carousel */}
          <div className="mb-6 -mx-6">
            <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex" style={{ width: 'max-content' }}>
                {leagues.map((league, index) => {
                  const isSvgPath = typeof league.icon === 'string'
                  const isSelected = selectedLeague === league.id
                  return (
                    <button
                      key={league.id}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-small border transition-colors flex items-center justify-center cursor-pointer",
                        isSelected 
                          ? "bg-white/15 border-white/20" 
                          : "bg-white/5 border-white/10 hover:bg-white/10",
                        index === 0 ? "ml-6 mr-0" : "ml-2 md:ml-4"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedLeague(league.id)
                        console.log('League clicked:', league.name)
                      }}
                    >
                      <div className="w-14 h-14 flex items-center justify-center">
                        {isSvgPath ? (
                          <Image 
                            src={league.icon as string} 
                            alt={league.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <league.icon className="w-8 h-8 text-white/70" />
                        )}
                      </div>
                    </button>
                  )
                })}
                {/* Scroll indicator */}
                <button className="flex-shrink-0 w-20 h-20 bg-white/5 border border-white/10 rounded-small hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer ml-2 md:ml-4">
                  <IconChevronRight className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Top Events Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/70">TOP EVENTS</h2>
              <Button 
                variant="ghost" 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('View All clicked for Top Events')
                }}
                className="text-xs text-white/70 hover:text-white cursor-pointer"
              >
                View All
              </Button>
            </div>
            <div className="relative -mx-6" style={{ overflow: 'visible', position: 'relative', width: 'calc(100% + 3rem)', maxWidth: 'none', boxSizing: 'border-box', minWidth: 0 }}>
              <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                <CarouselContent className="ml-6 mr-0">
                  {/* First event - Manchester City vs Liverpool (Live) */}
                  <CarouselItem className="pl-0 pr-0 basis-auto flex-shrink-0">
                    <div className="w-[320px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(238, 53, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                      {/* Header: League info and Live status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <Image 
                            src="/banners/sports_league/prem.svg" 
                            alt="Premier League"
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                          <span className="text-[10px] text-white">Premier League | England</span>
                  </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-[#ee3536] px-1.5 py-0.5 rounded-full">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <span className="text-[10px] font-semibold text-white">LIVE</span>
                  </div>
                          <span className="text-[10px] text-[#ee3536]">H2 ET 90'+6</span>
                        </div>
                      </div>
                      
                      {/* Teams and Score */}
                      <div className="flex items-center mb-3">
                        {/* Team 1 - Manchester City */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Image 
                            src="/banners/sports_league/man_city.png" 
                            alt="Manchester City"
                            width={24}
                            height={20}
                            className="object-contain flex-shrink-0"
                            quality={100}
                            unoptimized
                          />
                          <span className="text-xs font-semibold text-white truncate">Manchester City</span>
                        </div>
                        
                        {/* Score */}
                        <div className="flex items-center justify-center mx-3 flex-shrink-0">
                          <div className="text-base font-bold text-white leading-none">4 - 0</div>
                        </div>
                        
                        {/* Team 2 - Liverpool */}
                        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                          <span className="text-xs font-semibold text-white truncate">Liverpool</span>
                          <Image 
                            src="/banners/sports_league/liverpool.png" 
                            alt="Liverpool"
                            width={24}
                            height={20}
                            className="object-contain flex-shrink-0"
                            quality={100}
                            unoptimized
                          />
                        </div>
                      </div>
                      
                      {/* Moneyline Betting Buttons */}
                      <div className="flex items-center gap-1.5 mb-3">
                    <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(4, 'Manchester City v Liverpool', 'Moneyline', 'MCI', '+350')
                          }}
                          className={cn(
                            "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                            isBetSelected(4, 'Moneyline', 'MCI') && "bg-red-500"
                          )}
                      onMouseEnter={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'MCI')) {
                        e.currentTarget.style.backgroundColor = brandPrimary
                            }
                      }}
                      onMouseLeave={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'MCI')) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                      }}
                    >
                          <div className="text-[10px] text-white/70 leading-none mb-0.5">MCI</div>
                          <div className="text-xs font-bold leading-none">+350</div>
                    </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(4, 'Manchester City v Liverpool', 'Moneyline', 'Tie', '+350')
                          }}
                          className={cn(
                            "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                            isBetSelected(4, 'Moneyline', 'Tie') && "bg-red-500"
                          )}
                          onMouseEnter={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'Tie')) {
                              e.currentTarget.style.backgroundColor = brandPrimary
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'Tie')) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <div className="text-[10px] text-white/70 leading-none mb-0.5">Tie</div>
                          <div className="text-xs font-bold leading-none">+350</div>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(4, 'Manchester City v Liverpool', 'Moneyline', 'LIV', '+350')
                          }}
                          className={cn(
                            "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                            isBetSelected(4, 'Moneyline', 'LIV') && "bg-red-500"
                          )}
                          onMouseEnter={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'LIV')) {
                              e.currentTarget.style.backgroundColor = brandPrimary
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'LIV')) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <div className="text-[10px] text-white/70 leading-none mb-0.5">LIV</div>
                          <div className="text-xs font-bold leading-none">+350</div>
                    </button>
                  </div>
                      
                      {/* Popularity Bar */}
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-white/50 text-center mb-1">Moneyline</div>
                        <div className="flex h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-[#ee3536] h-full" style={{ width: '94%' }}></div>
                          <div className="bg-white h-full" style={{ width: '6%' }}></div>
                </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-white/50">94% MCI</span>
                          <span className="text-white/50">6% LIV</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                  
                  {/* Other events - duplicate for carousel */}
                  {[4, 5, 6].map((eventId) => (
                    <CarouselItem key={eventId} className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                      <div className="w-[320px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(238, 53, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                        {/* Header: League info and Live status */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <Image 
                              src="/banners/sports_league/prem.svg" 
                              alt="Premier League"
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                            <span className="text-[10px] text-white">Premier League | England</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 bg-[#ee3536] px-1.5 py-0.5 rounded-full">
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                              <span className="text-[10px] font-semibold text-white">LIVE</span>
                            </div>
                            <span className="text-[10px] text-[#ee3536]">H2 ET 90'+6</span>
                          </div>
                        </div>
                        
                        {/* Teams and Score */}
                        <div className="flex items-center mb-3">
                          {/* Team 1 - Manchester City */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Image 
                              src="/banners/sports_league/man_city.png" 
                              alt="Manchester City"
                              width={24}
                              height={20}
                              className="object-contain flex-shrink-0"
                              quality={100}
                              unoptimized
                            />
                            <span className="text-xs font-semibold text-white truncate">Manchester City</span>
                          </div>
                          
                          {/* Score */}
                          <div className="flex items-center justify-center mx-3 flex-shrink-0">
                            <div className="text-base font-bold text-white leading-none">4 - 0</div>
                          </div>
                          
                          {/* Team 2 - Liverpool */}
                          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                            <span className="text-xs font-semibold text-white truncate">Liverpool</span>
                            <Image 
                              src="/banners/sports_league/liverpool.png" 
                              alt="Liverpool"
                              width={24}
                              height={20}
                              className="object-contain flex-shrink-0"
                              quality={100}
                              unoptimized
                            />
                          </div>
                        </div>
                        
                        {/* Moneyline Betting Buttons */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addBetToSlip(eventId, 'Manchester City v Liverpool', 'Moneyline', 'MCI', '+350')
                            }}
                            className={cn(
                              "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(eventId, 'Moneyline', 'MCI') && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'MCI')) {
                                e.currentTarget.style.backgroundColor = brandPrimary
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'MCI')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-white/70 leading-none mb-0.5">MCI</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addBetToSlip(eventId, 'Manchester City v Liverpool', 'Moneyline', 'Tie', '+350')
                            }}
                            className={cn(
                              "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(eventId, 'Moneyline', 'Tie') && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'Tie')) {
                                e.currentTarget.style.backgroundColor = brandPrimary
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'Tie')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-white/70 leading-none mb-0.5">Tie</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addBetToSlip(eventId, 'Manchester City v Liverpool', 'Moneyline', 'LIV', '+350')
                            }}
                            className={cn(
                              "bg-white/10 text-white rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(eventId, 'Moneyline', 'LIV') && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'LIV')) {
                                e.currentTarget.style.backgroundColor = brandPrimary
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'LIV')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-white/70 leading-none mb-0.5">LIV</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                        </div>
                        
                        {/* Popularity Bar */}
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-white/50 text-center mb-1">Moneyline</div>
                          <div className="flex h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="bg-[#ee3536] h-full" style={{ width: '94%' }}></div>
                            <div className="bg-white h-full" style={{ width: '6%' }}></div>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-white/50">94% MCI</span>
                            <span className="text-white/50">6% LIV</span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          
          {/* Live Events Section - Exactly matching Figma layout */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/70">LIVE</h2>
            </div>
            <div className="space-y-2">
              {liveEvents.map((event) => {
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
                  
                  const minutes = Math.floor(elapsedTime / 60)
                  const seconds = elapsedTime % 60
                  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                  
                  return <span className="text-[10px] text-white/70">{formattedTime}</span>
                }
                
                // Scroll state for markets
                const MarketsCarousel = () => {
                  const containerRef = useRef<HTMLDivElement>(null)
                  const [canScrollLeft, setCanScrollLeft] = useState(false)
                  const [canScrollRight, setCanScrollRight] = useState(true)
                  
                  const checkScroll = useCallback(() => {
                    const container = containerRef.current
                    if (!container) return
                    const { scrollLeft, scrollWidth, clientWidth } = container
                    const hasMoreLeft = scrollLeft > 5
                    const hasMoreRight = scrollLeft < scrollWidth - clientWidth - 5
                    setCanScrollLeft(hasMoreLeft)
                    setCanScrollRight(hasMoreRight)
                  }, [])
                  
                  useEffect(() => {
                    const container = containerRef.current
                    if (!container) return
                    
                    // Initial check
                    checkScroll()
                    
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
                    
                    // Also check periodically to catch any missed updates
                    const interval = setInterval(() => {
                      checkScroll()
                    }, 100)
                    
                    return () => {
                      container.removeEventListener('scroll', handleScroll)
                      window.removeEventListener('resize', handleResize)
                      clearInterval(interval)
                    }
                  }, [checkScroll])
                  
                  const scrollLeft = () => {
                    if (containerRef.current) {
                      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
                      // Check immediately and after animation
                      requestAnimationFrame(() => {
                        checkScroll()
                        setTimeout(() => {
                          checkScroll()
                        }, 500)
                      })
                    }
                  }
                  
                  const scrollRight = () => {
                    if (containerRef.current) {
                      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
                      // Check immediately and after animation
                      requestAnimationFrame(() => {
                        checkScroll()
                        setTimeout(() => {
                          checkScroll()
                        }, 500)
                      })
                    }
                  }
                  
                  return (
                    <div className="flex-1 relative min-w-0" style={{ overflow: 'visible' }}>
                      {/* Left Arrow - Positioned at left edge */}
                      {canScrollLeft && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            scrollLeft()
                          }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#2d2d2d]/90 backdrop-blur-sm border border-white/20 hover:bg-[#2d2d2d] hover:border-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                      
                      {/* Scrollable Markets Container with fade gradients */}
                      <div 
                        ref={containerRef}
                        className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-0 min-w-0 relative"
                        style={{ 
                          scrollBehavior: 'smooth',
                          WebkitOverflowScrolling: 'touch',
                          touchAction: 'pan-x'
                        }}
                      >
                        {/* Left fade gradient */}
                        {canScrollLeft && (
                          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1a1a1a]/60 to-transparent pointer-events-none z-10" />
                        )}
                        
                        {/* Right fade gradient */}
                        {canScrollRight && (
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1a1a1a]/60 to-transparent pointer-events-none z-10" />
                        )}
                        
                        <div className="flex items-center gap-0" style={{ width: 'max-content' }}>
                          {event.markets.map((market, marketIndex) => (
                            <React.Fragment key={marketIndex}>
                              <div className="flex flex-col items-center flex-shrink-0">
                                {/* Market Title - Centered */}
                                <div className="text-[10px] text-white/50 mb-1.5 leading-none text-center whitespace-nowrap px-1">{market.title}</div>
                                {/* Market Options - Centered, Fixed width for alignment */}
                                <div className="flex gap-1 h-[38px] items-center">
                                  {market.options.map((option, optionIndex) => {
                                    const isSelected = isBetSelected(event.id, market.title, option.label)
                                    return (
                                      <button
                                        key={optionIndex}
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
                                            e.currentTarget.style.backgroundColor = brandPrimary
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
                              </div>
                              {/* Vertical Divider */}
                              {marketIndex < event.markets.length - 1 && (
                                <div className="w-px h-[32px] bg-white/10 mx-2 flex-shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right Arrow - Positioned at right edge */}
                      {canScrollRight && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            scrollRight()
                          }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#2d2d2d]/90 backdrop-blur-sm border border-white/20 hover:bg-[#2d2d2d] hover:border-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  )
                }
                
                return (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-small" style={{ overflow: 'visible' }}>
                    {/* Header Section - Premier League | England, Soccer */}
                    <div className="px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const leagueData = leagues.find(l => l.name === event.league)
                          const isSvgPath = leagueData && typeof leagueData.icon === 'string'
                          return isSvgPath ? (
                            <Image 
                              src={leagueData.icon as string} 
                              alt={event.league}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          ) : (
                            <IconTrophy className="w-4 h-4 text-white/70" />
                          )
                        })()}
                        <span className="text-xs text-white/70">{event.league}</span>
                        <span className="text-xs text-white/50">|</span>
                        <span className="text-xs text-white/70">{event.country}</span>
                        <span className="text-xs text-white/50">,</span>
                        <span className="text-xs text-white/70">Soccer</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Watch Live clicked for event:', event.id)
                        }}
                        className="text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                      >
                        Watch Live
                      </button>
                    </div>
                    
                    {/* Main Content Row - Single row with Status, Teams, Score, Markets */}
                    <div className="px-3 py-3 flex items-center gap-4" style={{ overflow: 'visible' }}>
                      {/* Status/Time Badge - Smaller */}
                      {event.isLive && (
                        <div className="flex flex-col items-start justify-center gap-1 flex-shrink-0 w-[70px]">
                          <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/50 rounded px-1.5 py-0.5 whitespace-nowrap">
                            <span className="text-[10px] font-semibold text-red-400">LIVE</span>
                          </div>
                          <MatchTimer />
                          <span className="text-[10px] text-white/70">1st half</span>
                        </div>
                      )}
                      
                      {/* Teams - Fixed width for alignment */}
                      <div className="flex flex-col gap-1 min-w-0 flex-shrink-0 justify-center w-[140px]">
                        <div className="text-sm font-semibold text-white truncate leading-tight">{event.team1}</div>
                        <div className="text-sm font-semibold text-white truncate leading-tight">{event.team2}</div>
                      </div>
                      
                      {/* Score - Fixed width container for alignment across all events */}
                      {event.score && (
                        <div className="flex flex-col items-center justify-center gap-0.5 flex-shrink-0 w-[40px] mx-4">
                          <div className="bg-white/5 border border-white/10 rounded-small px-1.5 py-1.5 w-full">
                            <div className="text-sm font-bold text-white leading-tight text-center">{event.score.team1}</div>
                            <div className="h-px w-full bg-white/20 my-0.5"></div>
                            <div className="text-sm font-bold text-white leading-tight text-center">{event.score.team2}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Betting Markets - Scrollable with Carousel Arrows */}
                      <MarketsCarousel />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Top Bet Boosts Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/70">TOP BET BOOSTS</h2>
              <Button 
                variant="ghost" 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('View All clicked for Top Bet Boosts')
                }}
                className="text-xs text-white/70 hover:text-white cursor-pointer"
              >
                View All
              </Button>
            </div>
            <div className="relative -mx-6" style={{ overflow: 'visible', position: 'relative', width: 'calc(100% + 3rem)', maxWidth: 'none', boxSizing: 'border-box', minWidth: 0 }}>
              <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                <CarouselContent className="ml-6 mr-0">
                  {/* Bet Boost Cards */}
                  {[
                    { id: 1, marketName: 'Market Name Here On More Than One Line', time: 'TODAY 10:30PM' },
                    { id: 2, marketName: 'Market Name Here On More Than One Line', time: 'TODAY 10:30PM' },
                    { id: 3, marketName: 'Market Name Here On More Than One Line', time: 'TODAY 10:30PM' },
                    { id: 4, marketName: 'Market Name Here On More Than One Line', time: 'TODAY 10:30PM' },
                  ].map((boost, index) => (
                    <CarouselItem key={boost.id} className={index === 0 ? "pl-0 pr-0 basis-auto flex-shrink-0" : "pl-2 md:pl-4 basis-auto flex-shrink-0"}>
                      <div className="w-[320px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(31, 238, 245, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                        {/* Header: League info and Time */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <Image 
                              src="/banners/sports_league/prem.svg" 
                              alt="Premier League"
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                            <span className="text-[10px] text-white">Premier League | England, Soccer</span>
                  </div>
                          <span className="text-[10px] text-white">{boost.time}</span>
                  </div>
                        
                        {/* Market Name */}
                        <div className="text-sm font-medium text-white/90 mb-3 leading-tight min-h-[2.5rem]">
                          {boost.marketName}
                        </div>
                        
                        {/* Betting Buttons */}
                        <div className="flex items-center gap-2 mb-3">
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                              console.log('Bet Boost clicked:', boost.id)
                      }}
                            className="bg-white/10 text-white text-sm font-bold px-4 py-2.5 rounded-small flex-1 transition-colors cursor-pointer"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = brandPrimary
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                            +350
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                              console.log('Bet Boost clicked:', boost.id)
                      }}
                            className="bg-white/10 text-white text-sm font-bold px-4 py-2.5 rounded-small flex-1 transition-colors cursor-pointer"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = brandPrimary
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                            +350
                    </button>
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
          
          {/* Upcoming Events */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-white/70 mb-4">UPCOMING</h2>
            <div className="space-y-2">
              {upcomingEvents.map((event) => {
                // Scroll state for markets
                const MarketsCarousel = () => {
                  const containerRef = useRef<HTMLDivElement>(null)
                  const [canScrollLeft, setCanScrollLeft] = useState(false)
                  const [canScrollRight, setCanScrollRight] = useState(true)
                  
                  const checkScroll = useCallback(() => {
                    const container = containerRef.current
                    if (!container) return
                    const { scrollLeft, scrollWidth, clientWidth } = container
                    const hasMoreLeft = scrollLeft > 5
                    const hasMoreRight = scrollLeft < scrollWidth - clientWidth - 5
                    setCanScrollLeft(hasMoreLeft)
                    setCanScrollRight(hasMoreRight)
                  }, [])
                  
                  useEffect(() => {
                    const container = containerRef.current
                    if (!container) return
                    
                    // Initial check
                    checkScroll()
                    
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
                    
                    // Also check periodically to catch any missed updates
                    const interval = setInterval(() => {
                      checkScroll()
                    }, 100)
                    
                    return () => {
                      container.removeEventListener('scroll', handleScroll)
                      window.removeEventListener('resize', handleResize)
                      clearInterval(interval)
                    }
                  }, [checkScroll])
                  
                  const scrollLeft = () => {
                    if (containerRef.current) {
                      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
                      // Check immediately and after animation
                      requestAnimationFrame(() => {
                        checkScroll()
                        setTimeout(() => {
                          checkScroll()
                        }, 500)
                      })
                    }
                  }
                  
                  const scrollRight = () => {
                    if (containerRef.current) {
                      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
                      // Check immediately and after animation
                      requestAnimationFrame(() => {
                        checkScroll()
                        setTimeout(() => {
                          checkScroll()
                        }, 500)
                      })
                    }
                  }
                  
                  return (
                    <div className="flex-1 relative min-w-0" style={{ overflow: 'visible' }}>
                      {/* Left Arrow - Positioned at left edge */}
                      {canScrollLeft && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                            scrollLeft()
                          }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#2d2d2d]/90 backdrop-blur-sm border border-white/20 hover:bg-[#2d2d2d] hover:border-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                      
                      {/* Scrollable Markets Container with fade gradients */}
                      <div 
                        ref={containerRef}
                        className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-0 min-w-0 relative"
                        style={{ 
                          scrollBehavior: 'smooth',
                          WebkitOverflowScrolling: 'touch',
                          touchAction: 'pan-x'
                        }}
                      >
                        {/* Left fade gradient */}
                        {canScrollLeft && (
                          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1a1a1a]/60 to-transparent pointer-events-none z-10" />
                        )}
                        
                        {/* Right fade gradient */}
                        {canScrollRight && (
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1a1a1a]/60 to-transparent pointer-events-none z-10" />
                        )}
                        
                        <div className="flex items-center gap-0" style={{ width: 'max-content' }}>
                          {event.markets.map((market, marketIndex) => (
                            <React.Fragment key={marketIndex}>
                              <div className="flex flex-col items-center flex-shrink-0">
                                {/* Market Title - Centered */}
                                <div className="text-[10px] text-white/50 mb-1.5 leading-none text-center whitespace-nowrap px-1">{market.title}</div>
                                {/* Market Options - Centered, Fixed width for alignment */}
                                <div className="flex gap-1 h-[38px] items-center">
                                  {market.options.map((option, optionIndex) => {
                                    const isSelected = isBetSelected(event.id, market.title, option.label)
                                    return (
                                      <button
                                        key={optionIndex}
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
                          e.currentTarget.style.backgroundColor = brandPrimary
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
                              </div>
                              {/* Vertical Divider */}
                              {marketIndex < event.markets.length - 1 && (
                                <div className="w-px h-[32px] bg-white/10 mx-2 flex-shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right Arrow - Positioned at right edge */}
                      {canScrollRight && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                            scrollRight()
                        }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#2d2d2d]/90 backdrop-blur-sm border border-white/20 hover:bg-[#2d2d2d] hover:border-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
                          style={{ pointerEvents: 'auto' }}
                      >
                          <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                      </button>
                      )}
                    </div>
                  )
                }
                
                return (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-small" style={{ overflow: 'visible' }}>
                    {/* Header Section - Premier League | England, Soccer */}
                    <div className="px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const leagueData = leagues.find(l => l.name === event.league)
                          const isSvgPath = leagueData && typeof leagueData.icon === 'string'
                          return isSvgPath ? (
                            <Image 
                              src={leagueData.icon as string} 
                              alt={event.league}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          ) : (
                            <IconTrophy className="w-4 h-4 text-white/70" />
                          )
                        })()}
                        <span className="text-xs text-white/70">{event.league}</span>
                        <span className="text-xs text-white/50">|</span>
                        <span className="text-xs text-white/70">{event.country}</span>
                        <span className="text-xs text-white/50">,</span>
                        <span className="text-xs text-white/70">Soccer</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Watch Live clicked for event:', event.id)
                        }}
                        className="text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                      >
                        Watch Live
                      </button>
                    </div>
                    
                    {/* Main Content Row - Single row with Status, Teams, Markets (no score) */}
                    <div className="px-3 py-3 flex items-center gap-4" style={{ overflow: 'visible' }}>
                      {/* Status/Time Badge - Starting in */}
                      <div className="flex flex-col items-start justify-center gap-1 flex-shrink-0 w-[100px]">
                        <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded px-1.5 py-0.5 whitespace-nowrap">
                          <span className="text-[10px] font-semibold text-white/70">Starting in</span>
                  </div>
                        <span className="text-[10px] text-white/70">{event.time}</span>
                </div>
                      
                      {/* Teams - Fixed width for alignment */}
                      <div className="flex flex-col gap-1 min-w-0 flex-shrink-0 justify-center w-[140px]">
                        <div className="text-sm font-semibold text-white truncate leading-tight">{event.team1}</div>
                        <div className="text-sm font-semibold text-white truncate leading-tight">{event.team2}</div>
                      </div>
                      
                      {/* Betting Markets - Scrollable with Carousel Arrows */}
                      <MarketsCarousel />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        )}
        
        {/* Footer - responsive to sidebar state */}
        <footer className="bg-[#2d2d2d] border-t border-white/10 text-white mt-12 relative z-0">
          <div className="w-full px-6 py-8">
            {/* Quick Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">QUICK LINKS</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Refer A Friend</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Rules</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Banking</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Affiliates</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Responsible Gaming</a></li>
                </ul>
                <div className="mt-4">
                  <Button 
                    className="w-full rounded-small h-10 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                    style={{ backgroundColor: brandPrimary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = brandPrimaryHover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = brandPrimary
                    }}
                  >
                    <IconLifebuoy className="w-4 h-4 mr-2" />
                    NEED HELP?
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Casino</h3>
                <ul className="space-y-2 text-sm text-white/70">
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
                <h3 className="font-semibold mb-4">Sports</h3>
                <ul className="space-y-2 text-sm text-white/70">
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
                <h3 className="font-semibold mb-4">Poker</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">Play Poker</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Texas Holdem</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Omaha Poker</a></li>
                </ul>
                <h3 className="font-semibold mb-4 mt-6">Racebook</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">Horse Betting</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Kentucky Derby</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Preakness Stakes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Belmont Stakes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Breeders Cup</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Other</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">Promos</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">News Room</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Why BetOnline</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">BetOnline Vs Competition</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">VIP Rewards</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Bet TV</a></li>
                </ul>
              </div>
            </div>

            <Separator className="bg-white/10 mb-8" />

            {/* Trust & Security Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-lg">A TRUSTED & SAFE EXPERIENCE</h3>
                <IconShield className="w-5 h-5" />
              </div>
              <p className="text-sm text-white/70 mb-6 max-w-3xl">
                At BetOnline, our company's guiding principle is to establish long-lasting, positive relationships with our customers and within the online gaming community for over 25 years.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {/* Crypto payment method logos */}
                {['Bitcoin', 'Ethereum', 'Litecoin', 'USDT', 'USDC', 'Bitcoin Cash', 'Dogecoin'].map((method) => (
                  <PaymentLogo key={method} method={method} />
                ))}
                {/* Traditional payment method logos */}
                {['VISA', 'Mastercard', 'AMEX', 'Discover', 'MoneyGram'].map((method) => (
                  <PaymentLogo key={method} method={method} />
                ))}
                {/* Security badges */}
                <SecurityBadge name="Responsible Gaming" iconPath="/logos/security/responsible-gaming.png" />
                <SecurityBadge name="SSL Secure" iconPath="/logos/security/ssl-secure.png" />
                <Card className="border-2 border-white bg-red-500 p-2 rounded-full">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-center w-8 h-8">
                      <span className="text-xs font-bold text-white">18+</span>
            </div>
                  </CardContent>
                </Card>
          </div>
        </div>

            <Separator className="bg-white/10 mb-8" />

            {/* Partners & Social Media */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold">OFFICIAL PARTNERS</h3>
                <Separator orientation="vertical" className="h-6 bg-white/20" />
                <div className="flex items-center gap-4 text-white/70">
                  <span>LALIGA</span>
                  <span>LFA</span>
                  <span>matchroom.</span>
                  <span>GOLDEN BOY</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Social media icons using Button components */}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                  <IconBrandFacebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                  <IconBrandInstagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                  <IconBrandX className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                  <IconBrandYoutube className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                  <IconBrandTiktok className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Timestamp and Copyright */}
            <div className="text-center space-y-2">
              <div className="text-xs text-white/50">
                {typeof currentTime !== 'undefined' ? currentTime : ''}
              </div>
              <div className="text-sm text-white/50">
                <p>Copyright ©2024 BetOnline.ag. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </SidebarInset>
      
      {/* Betslip Drawer */}
      <FamilyDrawerRoot 
        views={betslipViews} 
        open={betslipOpen} 
        onOpenChange={(open) => {
          // Only allow closing if there are no bets
          if (!open && bets.length === 0) {
            setBetslipOpen(false)
          } else if (open) {
            setBetslipOpen(true)
          }
        }}
      >
        <FamilyDrawerContent className="bg-white">
          <FamilyDrawerAnimatedWrapper 
            key={`betslip-wrapper-${bets.length}-${betslipCollapsed}`}
            className={betslipCollapsed ? "px-3 py-1.5" : "px-2 pb-2 pt-2.5"}
          >
            <FamilyDrawerAnimatedContent>
              <FamilyDrawerViewContent />
            </FamilyDrawerAnimatedContent>
          </FamilyDrawerAnimatedWrapper>
        </FamilyDrawerContent>
      </FamilyDrawerRoot>
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

    const tabs = ['Overview', 'Level Up', 'Loot Crates', 'Bet & Get', 'Benefits']
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
            {['Overview', 'Level Up', 'Loot Crates', 'Bet & Get', 'Benefits'].map((tab, index) => (
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
        {vipActiveTab === 'Overview' && (
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <CardTitle className="text-sm text-white/70 mb-2">Gold To Platinum I</CardTitle>
                <VipTierProgressBar value={45} nextTierLabel="Platinum I" wagerRemaining="$2,750" />
              </CardContent>
            </Card>

            <DailySpinCard />
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

        
        

        
        
      </VipHubScrollBody>
    </div>
  )
}

function NavTestPageContent() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState('For You')
  const [activeSubNav, setActiveSubNav] = useState('For You')
  const [gameSortFilter, setGameSortFilter] = useState<string>('popular')
  const [activeIconTab, setActiveIconTab] = useState('search')
  const [quickLinksOpen, setQuickLinksOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
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
  const webInboxUnreadCount = 2

  // Mutual exclusion helpers — only one drawer open at a time
  const openAccountDrawer = useCallback(() => {
    setVipDrawerOpen(false)
    setDepositDrawerOpen(false)
    setAccountDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [])
  const openVipDrawer = useCallback(() => {
    setAccountDrawerOpen(false)
    setDepositDrawerOpen(false)
    setVipDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [])

  // Listen for the global VIP Hub open event so sub-component nav handlers
  // can launch the drawer without needing to thread `openVipDrawer` down
  // through props.
  useEffect(() => {
    const handler = () => openVipDrawer()
    if (typeof window === 'undefined') return
    window.addEventListener('vip:open-drawer', handler)
    return () => window.removeEventListener('vip:open-drawer', handler)
  }, [openVipDrawer])

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
    setAccountDrawerOpen(false)
    setVipDrawerOpen(false)
    setDepositDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [])

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

  // Note: Copy parlay from chat to betslip is handled in SportsPage where bets state exists


  const [vipActiveTab, setVipActiveTab] = useState('Overview')
  const vipTabsContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollVipLeft, setCanScrollVipLeft] = useState(false)
  const [canScrollVipRight, setCanScrollVipRight] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [showAllGames, setShowAllGames] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedVendor, setSelectedVendor] = useState<string>('')
  const [showSports, setShowSports] = useState(false)
  const [showVipRewards, setShowVipRewards] = useState(false)
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
      } else if (currentScrollY < lastScrollY) {
        // Show when scrolling up
        setQuickLinksOpen(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Hide when scrolling down (after 50px)
        setQuickLinksOpen(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, lastScrollY])

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
            boxShadow: '0 -200px 0 0 var(--ds-nav-bg, #2D2E2C)',
          }}
        >
          <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-white/10">
                {[
                  { label: 'Home', onClick: () => { setShowSports(false); setShowVipRewards(false); setQuickLinksOpen(false); } },
                  { label: 'Sports', onClick: () => { setShowSports(true); setShowVipRewards(false); setQuickLinksOpen(false); } },
                  { label: 'Casino', onClick: () => { setShowSports(false); setShowVipRewards(false); setActiveSubNav('For You'); setQuickLinksOpen(false); } },
                  { label: 'Poker', onClick: () => { window.location.href = '/casino?poker=true'; setQuickLinksOpen(false); } },
                  { label: 'Promotions', onClick: () => { router.push('/promotions'); setQuickLinksOpen(false); } },
                  { label: 'Other', onClick: () => { setQuickLinksOpen(false); } },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={(e) => {
                      e.stopPropagation()
                      item.onClick()
                    }}
                    className={cn(
                      "flex-shrink-0 px-3 py-1.5 rounded-small text-xs font-medium transition-colors",
                      (item.label === 'Casino' && !showSports && !showVipRewards) ||
                      (item.label === 'Sports' && showSports) ||
                      (item.label === 'Promotions' && showVipRewards)
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    {item.label}
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
            {isMobile ? (
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
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/5"
                onClick={() => {
                  if (sidebarState === 'collapsed') {
                    useChatStore.getState().setIsOpen(false)
                  }
                  toggleSidebar()
                }}
              >
                {sidebarOpen ? (
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
            )}
            <div 
              className="relative h-8 w-[120px] flex items-center cursor-pointer"
              onClick={() => {
                if (isMobile) {
                  setQuickLinksOpen(!quickLinksOpen)
                }
              }}
            >
              {currentBrand.logo}
            </div>
            
            {/* Navigation Menu - Desktop only */}
            {!isMobile && (
              <nav className="flex-1 flex items-center z-[110] ml-6" style={{ pointerEvents: 'auto' }}>
                <SidebarMenu className="flex flex-row items-center gap-2">
                  
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
                          layoutId="navtestNavPill" layout="position"
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
          
          <div className={cn(
            "flex items-center",
            isMobile ? "gap-2" : "gap-3"
          )} style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative' }}>
            {/* VIP Crown Button - After theme toggle on desktop, after balance on mobile */}
            {!isMobile ? (
              <VipCrownNavButton active={vipDrawerOpen} onClick={openVipDrawer} />
            ) : null}
            
            {/* Separator - Hide on mobile */}
            {!isMobile && (
              <div className="h-6 w-px bg-white/20" />
            )}
            
            {/* Balance and Avatar Button */}
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Account button clicked')
                openAccountDrawer()
              }}
              className={cn(
                "flex items-center rounded-small transition-colors group",
                "bg-white/5 hover:bg-white/10",
                "active:bg-gray-500/20",
                accountDrawerOpen && "text-white",
                accountDrawerOpen && { backgroundColor: brandPrimary },
                isMobile ? "gap-1 px-1.5 py-1" : "gap-1.5 px-2 py-1"
              )}
              style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
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
                {currentBrand.symbol}
                <NumberFlow value={displayBalance} format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
              </span>
            </Button>
            
            {/* VIP Crown Button - After balance on mobile only */}
            {isMobile && (
              <VipCrownNavButton active={vipDrawerOpen} onClick={openVipDrawer} />
            )}
            
{/* Deposit Button - Desktop only */}
            {!isMobile && (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Deposit button clicked, setting state to true')
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

            {/* Chat Toggle - Desktop only, right of deposit */}
            {!isMobile && <ChatNavToggle />}
          </div>
        </motion.header>

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
            <div 
              className="fixed top-0 left-0 h-screen z-[101] transition-[width] duration-200 ease-linear border-r border-white/10"
              style={{ 
                width: sidebarOpen ? '16rem' : '3rem',
                backgroundColor: 'var(--ds-sidebar-bg, #2d2d2d)'
              }}
            />
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
                <Separator className="bg-white/10 mx-2" />
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
                                        setShowSports(false)
                                        setShowVipRewards(false)
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
                                    style={isActive ? { backgroundColor: brandPrimary } : undefined}
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
                <Separator className="bg-white/10 mx-2" />
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
                              "relative z-10 text-white/70 dark:text-white/70 text-gray-900 dark:text-white/70 hover:text-white dark:hover:text-white hover:text-black dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white dark:data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5 flex-shrink-0",
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
                                style={{ backgroundColor: brandPrimary }}
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
            
            {/* Spacer to account for fixed sub-nav height - Only show when not on Sports or VIP Rewards */}
            {!showSports && !showVipRewards && (
              <motion.div 
                initial={false}
                animate={isMobile ? {
                  height: quickLinksOpen ? '155px' : '100px' // 64px header + 40px quick links (when open) + 57px sub nav - 6px = 155px, or 64px header + 57px sub nav - 21px = 100px (reduced gap for both states)
                } : {
                  height: '115px' // 64px header + 57px sub nav - 6px (reduced gap for desktop)
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
            )}
            
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
                  setShowSports(false)
                }}
                brandPrimary={brandPrimary}
                brandPrimaryHover={brandPrimaryHover}
                onSearchClick={() => setSearchOverlayOpen(true)}
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
                              showSports: false,
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
                              ALL GAMES
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
                                        <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: brandPrimary }}>
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
                                ALL GAMES
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
                                        <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: brandPrimary }}>
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
                                ALL GAMES
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
                                  <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: brandPrimary }}>
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
                                      <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: brandPrimary }}>
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
                                ALL GAMES
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
                                        <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: brandPrimary }}>
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
                              ALL GAMES
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
                                ALL GAMES
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
                                ALL GAMES
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
                                  ALL GAMES
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
                                          e.currentTarget.style.backgroundColor = `${brandPrimary}33`
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
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `${brandPrimary}1A` }} />
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
                                ALL GAMES
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
              
              {/* Footer - responsive to sidebar state */}
              <footer className="bg-[#2d2d2d] border-t border-white/10 text-white mt-12 relative z-0">
              <div className="w-full px-6 py-8">
                  {/* Quick Links Section */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
                    <div>
                      <h3 className="font-semibold mb-4">QUICK LINKS</h3>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Refer A Friend</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Rules</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Banking</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Affiliates</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Responsible Gaming</a></li>
                      </ul>
                      <div className="mt-4">
                        <Button 
                          className="w-full rounded-small h-10 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                          style={{ backgroundColor: brandPrimary }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = brandPrimaryHover
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = brandPrimary
                          }}
                        >
                          <IconLifebuoy className="w-4 h-4 mr-2" />
                          NEED HELP?
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Casino</h3>
                      <ul className="space-y-2 text-sm text-white/70">
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
                      <h3 className="font-semibold mb-4">Sports</h3>
                      <ul className="space-y-2 text-sm text-white/70">
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
                      <h3 className="font-semibold mb-4">Poker</h3>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li><a href="#" className="hover:text-white transition-colors">Play Poker</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Texas Holdem</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Omaha Poker</a></li>
                      </ul>
                      <h3 className="font-semibold mb-4 mt-6">Racebook</h3>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li><a href="#" className="hover:text-white transition-colors">Horse Betting</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Kentucky Derby</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Preakness Stakes</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Belmont Stakes</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Breeders Cup</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Other</h3>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li><a href="#" className="hover:text-white transition-colors">Promos</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">News Room</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Why BetOnline</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">BetOnline Vs Competition</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">VIP Rewards</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Bet TV</a></li>
                      </ul>
                    </div>
                  </div>

                  <Separator className="bg-white/10 mb-8" />

                  {/* Trust & Security Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="font-semibold text-lg">A TRUSTED & SAFE EXPERIENCE</h3>
                      <IconShield className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/70 mb-6 max-w-3xl">
                      At BetOnline, our company's guiding principle is to establish long-lasting, positive relationships with our customers and within the online gaming community for over 25 years.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Crypto payment method logos */}
                      {['Bitcoin', 'Ethereum', 'Litecoin', 'USDT', 'USDC', 'Bitcoin Cash', 'Dogecoin'].map((method) => (
                        <PaymentLogo key={method} method={method} />
                      ))}
                      {/* Traditional payment method logos */}
                      {['VISA', 'Mastercard', 'AMEX', 'Discover', 'MoneyGram'].map((method) => (
                        <PaymentLogo key={method} method={method} />
                      ))}
                      {/* Security badges */}
                      <SecurityBadge name="Responsible Gaming" iconPath="/logos/security/responsible-gaming.png" />
                      <SecurityBadge name="SSL Secure" iconPath="/logos/security/ssl-secure.png" />
                      <Card className="border-2 border-white bg-red-500 p-2 rounded-full">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-center w-8 h-8">
                            <span className="text-xs font-bold text-white">18+</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator className="bg-white/10 mb-8" />

                  {/* Partners & Social Media */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold">OFFICIAL PARTNERS</h3>
                      <Separator orientation="vertical" className="h-6 bg-white/20" />
                      <div className="flex items-center gap-4 text-white/70">
                        <span>LALIGA</span>
                        <span>LFA</span>
                        <span>matchroom.</span>
                        <span>GOLDEN BOY</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Social media icons using Button components */}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                        <IconBrandFacebook className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                        <IconBrandInstagram className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                        <IconBrandX className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                        <IconBrandYoutube className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 rounded-small">
                        <IconBrandTiktok className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Timestamp and Copyright */}
                  <div className="text-center space-y-2">
                    <div className="text-xs text-white/50">
                      {typeof currentTime !== 'undefined' ? currentTime : ''}
                    </div>
                    <div className="text-sm text-white/50">
                      <p>Copyright ©2024 BetOnline.ag. All rights reserved.</p>
                    </div>
                  </div>
                </div>
              </footer>
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
              "w-full sm:max-w-md bg-white text-gray-900 flex flex-col",
              "border-l border-gray-200"
            )}
            style={isMobile ? {
              height: '80vh',
              maxHeight: '80vh',
              top: 'auto',
              bottom: 0,
            } : undefined}
          >
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
                  {currentBrand.symbol}
                  <NumberFlow value={displayBalance} format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
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
                      router.push('/account')
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
                        router.push('/sports?mybets=pending')
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
                    >
                      <IconGift className="w-5 h-5 mr-3 text-gray-700" />
                      <span className="flex-1 text-left text-gray-900">My Bonus</span>
                </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
                    >
                      <IconCurrencyDollar className="w-5 h-5 mr-3 text-gray-700" />
                      <span className="flex-1 text-left text-gray-900">Transactions History</span>
                </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
                    >
                      <IconTicket className="w-5 h-5 mr-3 text-gray-700" />
                      <span className="flex-1 text-left text-gray-900">Bet History</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
                    >
                      <IconUserPlus className="w-5 h-5 mr-3 text-gray-700" />
                      <span className="flex-1 text-left text-gray-900">Refer a Friend</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3"
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
                <>
                  {/* Notifications Page */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        View All
                      </Button>
                </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 rounded-small bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">New Promotion Available!</p>
                          <p className="text-xs text-gray-500 mt-1">Claim your free spins now!</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
                      <div className="flex items-start gap-3 p-3 rounded-small bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">Your Bet has been settled!</p>
                          <p className="text-xs text-gray-500 mt-1">Check your winnings now!</p>
                          <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>
                </div>
                      <div className="flex items-start gap-3 p-3 rounded-small hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-transparent mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">Weekly summary</p>
                          <p className="text-xs text-gray-500 mt-1">View your weekly betting activity</p>
                          <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
              </div>
                      <div className="flex items-start gap-3 p-3 rounded-small hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-transparent mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">Bet settled</p>
                          <p className="text-xs text-gray-500 mt-1">Your bet on Liverpool has been settled</p>
                          <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-small hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-transparent mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">New bonus code available</p>
                          <p className="text-xs text-gray-500 mt-1">Use code BONUS50 for 50% match</p>
                          <p className="text-xs text-gray-400 mt-1">3 days ago</p>
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
              "bg-[#1a1a1a] text-white flex flex-col relative",
              "w-full sm:max-w-md border-l border-white/10 overflow-hidden"
            )}
            style={{ display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}
          >
            
            {/* Title + Close button for desktop only */}
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

        {/* Search Overlay */}
        <AnimatePresence mode="wait">
          {searchOverlayOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] overflow-y-auto"
              style={{ pointerEvents: 'auto' }}
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
                                    <div className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: brandPrimary }}>
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
              "bg-[#1a1a1a] text-white flex flex-col relative",
              "w-full sm:max-w-2xl border-l border-white/10 overflow-hidden"
            )}
            style={isMobile ? {
              height: '80vh',
              maxHeight: '80vh',
              top: 'auto',
              bottom: 0,
            } : undefined}
          >
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
                <IconGift className="w-4 h-4 text-white flex-shrink-0" />
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
      {isMobile && (
        <DynamicIsland
          onSearchClick={() => setSearchOverlayOpen(true)}
          onFavoriteClick={() => {
            setActiveIconTab('favorite')
            setActiveSubNav('For You')
            setSelectedCategory('Favorites')
            setSelectedVendor('')
            setShowAllGames(true)
            window.scrollTo(0, 0)
          }}
          isSearchActive={searchOverlayOpen}
          isFavoriteActive={activeIconTab === 'favorite' || selectedCategory === 'Favorites'}
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
          style={{ backgroundColor: brandPrimary }}
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
  const isMobile = useIsMobile()
  const pathname = usePathname()
  
  // Check if we're on the mobile route - if so, allow mobile access
  const isMobileRoute = pathname?.startsWith('/mobile') || false

  if (isMobile && !isMobileRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a] text-white p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Not Available on Mobile</h1>
          <p className="text-white/70 mb-6">
            This page is currently only available on desktop devices. Please visit us on a desktop or tablet to access this feature.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => window.location.href = '/mobile'}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Go to Mobile Version
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <NavTestPageContent />
    </SidebarProvider>
  )
}
