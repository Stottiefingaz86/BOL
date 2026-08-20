'use client'

import { VipCrownNavButton } from '@/components/vip/vip-crown-nav-button'
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
import { VipTierProgressCard } from '@/components/vip/vip-tier-progress-card'
import { DailySpinCard } from '@/components/promotions/daily-spin-card'
import { ReferAFriendPage } from '@/components/promotions/refer-a-friend-page'
import { ContestsPage } from '@/components/promotions/contests-page'
import { MyBonusPage } from '@/components/promotions/my-bonus-page'
import { SiteFooter } from '@/components/site-footer'
import { requestLogin } from '@/lib/auth-session'
import { launchPokerApp } from '@/lib/poker-app/launch'
import { DailyRacesTimer, NumberFlowCountdown } from '@/components/daily-races-timer'
import { SidebarPromos } from '@/components/sidebar-promos'
import { QuickDepositDrawer } from '@/components/deposit/quick-deposit-drawer'
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background'
import { CasinoActivityPanel } from '@/components/casino/casino-activity-panel'
import { Top10GamesCarousel } from '@/components/casino/top-10-games-carousel'
import { SeasonalEventGamesBlock } from '@/components/casino/seasonal-event-games-block'
import { GameTilePlayOverlay } from '@/components/casino/game-tile-play-overlay'
import { CasinoPromoBanner } from '@/components/casino/casino-promo-banner'
import { CasinoFavoritesProvider, useCasinoFavorites } from '@/components/casino/casino-favorites'
import { GameTileFavoriteButton } from '@/components/casino/game-tile-favorite-button'
import { CasinoSearchParamsEffects } from '@/components/casino/casino-search-params-effects'
import { promoPathForSection } from '@/lib/promotions-routes'
import {
  JackpotActivityFeed,
  JackpotNetworkBadge,
  GameLauncherJackpotRow,
  JackpotLauncherDropdown,
  JackpotWheelBonus,
  useJackpotTicker,
  useJackpotPreviewGameCount,
} from '@/components/casino/jackpot'
import { JACKPOT_ELIGIBLE_GAME_LIMIT, JACKPOT_TICKER_TIERS } from '@/lib/jackpot/constants'
import { getJackpotNetworkTier, isJackpotNetworkGame } from '@/lib/jackpot/game-network'
import { useJackpotStore } from '@/lib/store/jackpotStore'

import { useState, useEffect, useRef, useCallback, useMemo, useId, Suspense } from 'react'
import { useChatStore } from '@/lib/store/chatStore'
import type { ProductToggles } from '@/components/design-customizer'
import React from 'react'
import { createPortal } from 'react-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTracking } from '@/hooks/use-tracking'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { playSound, fadeOutSound, preloadJackpotWheelAudio, preloadJackpotWinHandoffAudio } from '@/lib/sounds'
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
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  IconFileText, 
  IconCurrencyDollar, 
  IconGift, 
  IconCreditCard, 
  IconUserPlus, 
  IconShield,
  IconLock,
  IconSettings,
  IconCrown,
  IconLogin2,
  IconLogout,
  IconDice,
  IconArrowsShuffle,
  IconHeart,
  IconStar,
  IconFlame,
  IconDeviceGamepad2,
  IconCards,
  IconDots,
  IconTrophy,
  IconHelpCircle,
  IconPlayerPlay,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
  IconLiveView,
  IconSearch,
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
  IconVideo,
  IconBroadcast,
  IconSparkles,
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
  IconSearch as IconSearchNew,
  IconCheck,
  IconLoader2,
  IconFilter,
  IconBell,
  IconTicket,
  IconClock,
  IconCoins,
  IconDownload,
  IconMaximize,
  IconStopwatch,
  IconRosetteFilled,
  IconUsers,
  IconArrowsSort,
  IconRefresh
, IconBrandTelegram, IconBrandApple, IconBrandWindows, IconBrandAndroid, IconDeviceDesktop} from '@tabler/icons-react'
import { colorTokenMap } from '@/lib/agent/designSystem'
import { JackpotOverlay } from '@/components/casino/jackpot-overlay'
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
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  skipNextMobileSidebarOpenAnimation,
  handoffMobileSidebarToNextPage,
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
import { SpotlightOverlay, useCursorSpotlight } from '@/components/ui/cursor-spotlight'
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
import {
  Tour,
  TourArrow,
  TourClose,
  TourDescription,
  TourFooter,
  TourHeader,
  TourNext,
  TourPortal,
  TourPrev,
  TourSkip,
  TourSpotlight,
  TourSpotlightRing,
  TourStep,
  TourStepCounter,
  TourTitle,
} from '@/components/ui/tour'
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
import { cn } from '@/lib/utils'
import { MobileOtherNavLinks } from '@/components/navigation/mobile-other-nav-links'
import { MobileSidebarMenuSkeleton } from '@/components/navigation/mobile-sidebar-menu-skeleton'
import DynamicIsland from '@/components/dynamic-island'
import ChatNavToggle from '@/components/chat/chat-nav-toggle'
// DesignCustomizer now lives in app/layout.tsx globally
import {
  IconButton,
  type IconButtonProps,
} from '@/components/animate-ui/components/buttons/icon'
import { Heart } from 'lucide-react'
import { UsageBasedPricing } from '@/components/billingsdk/usage-based-pricing'
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
import { NotificationHub } from '@/components/account/notification-hub'
import { AccountDrawerIdentity } from '@/components/account/account-drawer-identity'
import { AccountDrawerHeaderActions } from '@/components/account/account-drawer-header-actions'

// Helper function to get vendor icon path
const getVendorIconPath = (vendorName: string): string => {
  // Map vendor names to actual file names in vendot_logos folder
  const vendorFileMap: Record<string, string> = {
    'Dragon Gaming': 'Dragon gaming.svg',
    'BetSoft': 'betsoft.svg',
    '5 Clover': '5clover.svg',
    '777Jacks': '777jacks.svg',
    'Arrow\'s Edge': 'arrows edge.svg',
    'Blaze': 'blaze.svg',
    'DeckFresh': 'deckfresh.svg',
    'DGS Casino Solutions': 'dgs.svg',
    'Emerald Gate': 'emerald gate.svg',
    'FDBJ': 'fdbj.svg',
    'FDRL': 'deckfresh.svg',
    'Felix': 'felix.svg',
    'FreshDeck': 'deckfresh.svg',
    'GLS': 'gls.svg',
    'i3 Soft': 'i3soft.svg',
    'KA Gaming': 'kagaming.svg',
    'Lucky': 'lucky.svg',
    'Mascot Gaming': 'mascotgaming.svg',
    'Nucleus': 'nucleus.svg',
    'Onlyplay': 'onlyplay.svg',
    'Originals': 'orginals.svg',
    'Popiplay': 'popiplay.svg',
    'Qora': 'qora.svg',
    'Red Sparrow': 'red sparrow.svg',
    'Revolver Gaming': 'revolver.svg',
    'Rival': 'rival.svg',
    'Spinthron': 'spinthon.svg',
    'Twain': 'twain.svg',
    'VIG': 'vig.svg',
    'Wingo': 'wingo.svg',
    'BetOnline': 'orginals.svg',
  }
  
  // Check if we have a direct mapping
  if (vendorFileMap[vendorName]) {
    return `/vendot_logos/${vendorFileMap[vendorName]}`
  }
  
  // Fallback: try to construct filename from vendor name
  const normalizedName = vendorName
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
  
  return `/vendot_logos/${normalizedName}.svg`
}

// Available square tile images
/** New square slot art only — carousels cycle these (no legacy /games/square) */
const squareTileImages = [
  '/casino_slots_tiles/slot-39.png',
  '/casino_slots_tiles/slot-40.png',
  '/casino_slots_tiles/slot-41.png',
  '/casino_slots_tiles/slot-42.png',
  '/casino_slots_tiles/slot-43.png',
  '/casino_slots_tiles/slot-44.png',
  '/casino_slots_tiles/slot-45.png',
  '/casino_slots_tiles/slot-46.png',
  '/casino_slots_tiles/slot-47.png',
  '/casino_slots_tiles/slot-48.png',
  '/casino_slots_tiles/slot-49.png',
  '/casino_slots_tiles/slot-50.png',
  '/casino_slots_tiles/slot-51.png',
]

/** Square 1:1 slot art — gentle zoom on hover like other game carousels */
const slotTileImgClass =
  'object-cover object-center transition-transform duration-300 group-hover:scale-105'

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
  { id: 3, title: 'LIVE BETONLINE ROUETTE', provider: 'VIG', tag: '$25 - $100', image: '/walk/image 3.png' },
  { id: 4, title: 'HOOKED ON FISHING', provider: 'Betsoft', tag: 'Hot', image: '/walk/image 4.png' },
  { id: 5, title: 'MEGACRUSH HOLD&WIN', provider: 'Betsoft', tag: 'Early', image: '/walk/image 1.png' },
  { id: 6, title: 'MR MAMMOTH', provider: 'Betsoft', tag: null, image: '/walk/image 2.png' },
  { id: 7, title: 'ORIGINAL DICE', provider: 'BetOnline', tag: null, image: '/walk/image 3.png' },
]

const popularGames = [
  { id: 8, title: 'Gold Nugget™ Rush', provider: 'Betsoft', tag: '+ New', image: '/walk/image 1.png' },
  { id: 9, title: 'Stake the BANK', provider: 'Betsoft', tag: 'Exclusive', image: '/walk/image 2.png' },
  { id: 10, title: 'VIP BLACKJACK', provider: 'Fresh Deck', tag: '$350 - $500', image: '/walk/image 3.png' },
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
  // Map game tag to MetaTag type
  const metaTag: MetaTag = game.tag === 'Hot' ? 'Hot' : game.tag === 'Early' ? 'Early' : game.tag === 'Exclusive' ? 'Exclusive' : game.tag === '+ New' ? 'New' : getMetaTag(game.id)
  return (
    <div className="relative group cursor-pointer flex-shrink-0">
      <div className="relative w-[160px] aspect-[4/5] rounded-small overflow-hidden bg-gray-200">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className={slotTileImgClass}
          sizes="160px"
        />
        <GameTagBadge tag={metaTag} vendor={getTileVendor(game.id)} />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-2">
          <div className="text-[var(--ds-fg)] text-xs font-bold truncate leading-tight mb-0.5">{game.title}</div>
          <div className="text-[var(--ds-fg-muted)] text-[10px] truncate">{game.provider}</div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconInfoCircle className="w-4 h-4 text-[var(--ds-fg)] drop-shadow-lg" strokeWidth={2} />
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
function LazyGameTile({ index, columnIndex, rowIndex, onTileClick, isMobile = false, showJackpotNetworkTag = false }: { index: number; columnIndex: number; rowIndex: number; onTileClick?: (game: { title: string; image: string; provider?: string; features?: string[] }) => void; isMobile?: boolean; showJackpotNetworkTag?: boolean }) {
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

  const tag = getMetaTag(index)
  const tileVendor = getTileVendor(index)
  const jackpotTier = showJackpotNetworkTag ? getJackpotNetworkTier(index) : null

  // Use regular div on mobile to avoid layout animation issues - no state, no animations
  if (isMobile) {
    return (
      <div className="w-full aspect-square">
        <div 
          className="w-full h-full rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group"
        >
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`Game ${index + 1}`}
              fill
              className={slotTileImgClass}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
              priority={index < 12} // Only prioritize first row
            />
          )}
          <GameTagBadge tag={tag} vendor={tileVendor} />
          {jackpotTier && (
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 -translate-x-1/2">
              <JackpotNetworkBadge tier={jackpotTier} />
            </div>
          )}
          <GameTilePlayOverlay
            favoriteTitle={gameTitle}
            onLaunch={() => {
              onTileClick?.({
                title: gameTitle,
                image: imageSrc,
                provider,
                features: gameFeatures,
              })
            }}
          />
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
          className="w-full h-full rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group"
        >
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`Game ${index + 1}`}
              fill
              className={slotTileImgClass}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
            />
          )}
          <GameTagBadge tag={tag} vendor={tileVendor} />
          {jackpotTier && (
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 -translate-x-1/2">
              <JackpotNetworkBadge tier={jackpotTier} />
            </div>
          )}
          <GameTilePlayOverlay
            favoriteTitle={gameTitle}
            onLaunch={() => {
              onTileClick?.({
                title: gameTitle,
                image: imageSrc,
                provider,
                features: gameFeatures,
              })
            }}
          />
        </div>
      ) : (
        <div className="w-full h-full rounded-small bg-[var(--ds-control-bg)] animate-pulse" />
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

// Vendor Icon Component with fallback
function VendorIcon({ vendor }: { vendor: string }) {
  const [imageError, setImageError] = useState(false)
  const iconPath = getVendorIconPath(vendor)
  
  if (imageError) {
    return <div className="w-5 h-5 rounded-full bg-[var(--ds-control-hover)] flex-shrink-0" />
  }
  
  return (
    <div className="w-5 h-5 flex-shrink-0 relative flex items-center justify-center overflow-hidden">
      <Image
        src={iconPath}
        alt={`${vendor} logo`}
        width={20}
        height={20}
        className="object-contain"
        style={{ 
          width: '20px',
          height: '20px',
          maxWidth: '20px',
          maxHeight: '20px',
          objectPosition: 'center'
        }}
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  )
}

// Real vendor names from the carousel (used for random assignment on tiles)
const tileVendors = [
  'Dragon Gaming', 'BetSoft', '5 Clover', '777Jacks', 'Arrow\'s Edge',
  'Blaze', 'DeckFresh', 'Emerald Gate', 'Felix', 'KA Gaming',
  'Lucky', 'Mascot Gaming', 'Nucleus', 'Onlyplay', 'Popiplay',
  'Qora', 'Red Sparrow', 'Revolver Gaming', 'Rival', 'Twain',
  'VIG', 'Wingo',
]

// Get a vendor deterministically by index
function getTileVendor(index: number): string {
  return tileVendors[((index * 7 + 5) % tileVendors.length)]
}

// Meta tags for casino tiles
const metaTags = ['Early', 'Hot', 'Exclusive', 'New'] as const
type MetaTag = typeof metaTags[number] | 'Original'

// Deterministic tag assignment based on index (consistent across renders)
function getMetaTag(index: number, isOriginals: boolean = false): MetaTag {
  if (isOriginals) return 'Original'
  // Use a simple hash to deterministically assign tags
  const tagIndex = ((index * 7 + 3) % 4)
  return metaTags[tagIndex]
}

// Tag icon for each meta tag
function TagIcon({ tag, className }: { tag: MetaTag; className?: string }) {
  switch (tag) {
    case 'Early': return <IconStopwatch className={cn("w-3 h-3", className)} strokeWidth={2.5} />
    case 'Hot': return <IconFlame className={cn("w-3 h-3", className)} strokeWidth={2.5} />
    case 'Exclusive': return <IconRosetteFilled className={cn("w-3 h-3", className)} />
    case 'New': return <IconSparkles className={cn("w-3 h-3", className)} strokeWidth={2.5} />
    case 'Original': return <span className={cn("text-[9px] font-black leading-none", className)}>B</span>
    default: return null
  }
}

// Tag style config: background fill + border color + icon/text color
function getTagConfig(tag: MetaTag): { bg: string; border: string; text: string; iconColor: string } {
  switch (tag) {
    case 'Early': return { bg: 'bg-emerald-900/80', border: 'border-emerald-500/60', text: 'text-white', iconColor: 'text-emerald-400' }
    case 'Hot': return { bg: 'bg-red-950/80', border: 'border-red-500/60', text: 'text-white', iconColor: 'text-red-400' }
    case 'Exclusive': return { bg: 'bg-indigo-950/80', border: 'border-indigo-400/60', text: 'text-[var(--ds-fg)]', iconColor: 'text-indigo-300' }
    case 'New': return { bg: 'bg-yellow-900/80', border: 'border-yellow-500/60', text: 'text-[var(--ds-fg)]', iconColor: 'text-yellow-400' }
    case 'Original': return { bg: 'bg-white/15', border: 'border-white/25', text: 'text-white/90', iconColor: 'text-[var(--ds-fg-muted)]' }
    default: return { bg: 'bg-[var(--ds-control-hover)]', border: 'border-white/20', text: 'text-[var(--ds-fg)]', iconColor: 'text-[var(--ds-fg)]' }
  }
}

// Vendor badge small icon
function VendorBadge({ vendor }: { vendor: string }) {
  const [imageError, setImageError] = useState(false)
  const iconPath = getVendorIconPath(vendor)
  
  return (
    <div className="w-4 h-4 rounded-[3px] bg-black/50 backdrop-blur-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
      {!imageError ? (
        <Image
          src={iconPath}
          alt={vendor}
          width={12}
          height={12}
          className="object-contain"
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <span className="text-[8px] font-bold text-[var(--ds-fg-muted)] leading-none">
          {vendor.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

// Game Tag Badge - matches the design reference exactly
function GameTagBadge({ tag, vendor }: { tag: MetaTag; vendor: string }) {
  const config = getTagConfig(tag)
  
  return (
    <div className="pointer-events-none absolute top-1.5 left-1.5 z-30 flex items-center gap-1">
      <VendorBadge vendor={vendor} />
      <div className={cn(
        "flex items-center gap-0.5 px-1.5 py-[3px] rounded-full border backdrop-blur-sm",
        config.bg,
        config.border
      )}>
        <TagIcon tag={tag} className={config.iconColor} />
        <span className={cn("text-[9px] font-semibold leading-none", config.text)}>
          {tag}
        </span>
      </div>
    </div>
  )
}

// ============ LIVE CASINO TILE COMPONENT ============

// Live casino background images by game type
const liveBlackjackImages = [
  '/games/BLACKJACK_SQAURE.png',
  '/games/BLACKJACK_SQAURE.png',
  '/games/BLACKJACK_SQAURE.png',
]
const liveBlackjackRectImages = [
  '/games/BLACKJACK RECTANGLE.png',
  '/games/BLACKJACK RECTANGLE.png',
]
const liveBlackjackTallImages = [
  '/games/BLACKJACK_TALL.png',
  '/games/BLACKJACK_TALL.png',
]
const liveRouletteSquareImages = [
  '/games/roulette_square.png',
  '/games/roulette_square.png',
]
const liveRouletteRectImages = [
  '/games/roulette_square.png',
  '/games/roulette_square.png',
]
const liveRouletteTallImages = [
  '/games/roulette_tall.png',
  '/games/roulette_tall.png',
]
const liveBaccaratRectImages = [
  '/games/baccartae_rectangle.png',
  '/games/baccartae_rectangle.png',
]
const liveBaccaratTallImages = [
  '/games/baccartae_rectangle.png',
  '/games/baccartae_rectangle.png',
]
const liveBaccaratSquareImages = [
  '/games/baccartae_rectangle.png',
  '/games/baccartae_rectangle.png',
]

type LiveGameType = 'blackjack' | 'roulette' | 'baccarat' | 'poker'
type LiveTileShape = 'square' | 'rectangle' | 'tall'

// Roulette number color helper
const ROULETTE_REDS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
function rouletteColor(num: number) {
  if (num === 0) return "bg-emerald-600"
  if (ROULETTE_REDS.includes(num)) return "bg-red-600"
  return "bg-zinc-700"
}

// All possible roulette numbers for random generation
const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i)

// Animated Roulette history: colored number circles with live updates
function RouletteHistory({ results: initialResults }: { results: number[] }) {
  const [items, setItems] = useState(() => initialResults.map((num, i) => ({ id: i, num })))
  const nextId = useRef(initialResults.length)

  useEffect(() => {
    // Random interval between 3-8 seconds per tile
    const delay = 3000 + Math.random() * 5000
    const interval = setInterval(() => {
      const newNum = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)]
      nextId.current += 1
      setItems(prev => {
        const next = [{ id: nextId.current, num: newNum }, ...prev]
        return next.slice(0, 5) // keep 5 visible
      })
    }, delay)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-0.5 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0, opacity: 0, width: 0 }}
            animate={{ scale: 1, opacity: 1, width: 14 }}
            exit={{ scale: 0, opacity: 0, width: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
            className={cn(
              "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-semibold text-[var(--ds-fg)] flex-shrink-0",
              rouletteColor(item.num)
            )}
          >
            {item.num}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Baccarat result options
const BACCARAT_OPTIONS = ['B', 'B', 'P', 'B', 'P', 'T', 'P', 'B']

// Animated Baccarat history: B/P/T circles with live updates
function BaccaratHistory({ results: initialResults }: { results: string[] }) {
  const [items, setItems] = useState(() => initialResults.map((r, i) => ({ id: i, result: r })))
  const nextId = useRef(initialResults.length)

  useEffect(() => {
    const delay = 3000 + Math.random() * 5000
    const interval = setInterval(() => {
      const newResult = BACCARAT_OPTIONS[Math.floor(Math.random() * BACCARAT_OPTIONS.length)]
      nextId.current += 1
      setItems(prev => {
        const next = [{ id: nextId.current, result: newResult }, ...prev]
        return next.slice(0, 5)
      })
    }, delay)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-0.5 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0, opacity: 0, width: 0 }}
            animate={{ scale: 1, opacity: 1, width: 14 }}
            exit={{ scale: 0, opacity: 0, width: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
            className={cn(
              "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-semibold text-[var(--ds-fg)] flex-shrink-0",
              item.result === 'B' ? "bg-red-600" :
              item.result === 'P' ? "bg-blue-600" :
              "bg-emerald-600"
            )}
          >
            {item.result}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Blackjack seat indicator
function BlackjackSeats({ occupied, total }: { occupied: number; total: number }) {
  return (
    <div className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
      <IconUser className="w-3 h-3 text-[var(--ds-fg-muted)]" />
      <span className="text-[10px] font-semibold text-[var(--ds-fg)]">{occupied}/{total}</span>
    </div>
  )
}

// Generate deterministic roulette results
function getRouletteResults(index: number): number[] {
  const base = [8, 20, 13, 0, 10, 32, 5, 19, 36, 2, 14, 7, 28, 11, 3, 26, 15, 4, 22, 17]
  const offset = (index * 3) % base.length
  return [base[(offset) % base.length], base[(offset+1) % base.length], base[(offset+2) % base.length], base[(offset+3) % base.length], base[(offset+4) % base.length]]
}

// Generate deterministic baccarat results
function getBaccaratResults(index: number): string[] {
  const base = ['B', 'B', 'P', 'B', 'P', 'T', 'P', 'B', 'B', 'P', 'B', 'P']
  const offset = (index * 2) % base.length
  return [base[(offset) % base.length], base[(offset+1) % base.length], base[(offset+2) % base.length], base[(offset+3) % base.length], base[(offset+4) % base.length]]
}

// Get live image by game type and shape
function getLiveImage(gameType: LiveGameType, shape: LiveTileShape, index: number): string {
  switch (gameType) {
    case 'blackjack':
      if (shape === 'tall') return liveBlackjackTallImages[index % liveBlackjackTallImages.length]
      if (shape === 'rectangle') return liveBlackjackRectImages[index % liveBlackjackRectImages.length]
      return liveBlackjackImages[index % liveBlackjackImages.length]
    case 'roulette':
      if (shape === 'tall') return liveRouletteTallImages[index % liveRouletteTallImages.length]
      if (shape === 'rectangle') return liveRouletteRectImages[index % liveRouletteRectImages.length]
      return liveRouletteSquareImages[index % liveRouletteSquareImages.length]
    case 'baccarat':
      if (shape === 'tall') return liveBaccaratTallImages[index % liveBaccaratTallImages.length]
      if (shape === 'square') return liveBaccaratSquareImages[index % liveBaccaratSquareImages.length]
      return liveBaccaratRectImages[index % liveBaccaratRectImages.length]
    case 'poker':
      // Same tall live art as blackjack — poker tables shouldn’t be square either
      if (shape === 'tall') return liveBlackjackTallImages[index % liveBlackjackTallImages.length]
      if (shape === 'rectangle') return liveBlackjackRectImages[index % liveBlackjackRectImages.length]
      return liveBlackjackImages[index % liveBlackjackImages.length]
    default:
      return liveBlackjackImages[0]
  }
}

// Live vendor helpers
const liveVendors = [
  { name: 'VIG', logo: '/vendot_logos/vig.svg' },
  { name: 'Fresh Deck', logo: '/vendot_logos/deckfresh.svg' },
]
function getLiveVendor(index: number) {
  return liveVendors[index % liveVendors.length]
}

// Main Live Casino Tile Component
function LiveCasinoTile({ 
  gameType, 
  shape = 'tall',
  title, 
  subtitle,
  bettingRange, 
  index, 
  brandPrimary,
  seats,
  onClick,
  className,
  style,
}: { 
  gameType: LiveGameType
  shape?: LiveTileShape
  title: string
  subtitle?: string
  bettingRange: string
  index: number
  brandPrimary: string
  seats?: { occupied: number; total: number }
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}) {
  const imageSrc = getLiveImage(gameType, shape, index)
  const vendor = getLiveVendor(index)
  const sizeClass =
    shape === 'rectangle'
      ? 'w-[240px] h-[160px]'
      : shape === 'square'
        ? 'w-[160px] h-[160px]'
        : 'w-[160px] h-[280px]'
  const imageSizes = shape === 'rectangle' ? '240px' : '160px'
  
  return (
    <div 
      data-content-item 
      className={cn(
        'rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0',
        sizeClass,
        className
      )}
      style={style}
    >
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes={imageSizes}
      />
      
      {/* Dark gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
      
      {/* Limit Tag - glass pill with record dot */}
      <div className="pointer-events-none absolute top-2 left-2 z-[2] flex items-center gap-1 bg-[var(--ds-control-hover)] backdrop-blur-md rounded-full px-2 py-0.5 border border-white/15">
        <div className="relative w-1.5 h-1.5 flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          <div className="relative w-1.5 h-1.5 rounded-full bg-red-500" />
        </div>
        <span className="text-[var(--ds-fg)] text-[10px] font-medium">{bettingRange}</span>
      </div>
      
      {/* Content at bottom — under play overlay so hover scrim covers title */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] p-2.5">
        {/* Game Title */}
        <div className="mb-1.5">
          {subtitle && (
            <div className="text-[var(--ds-fg-muted)] text-[10px] font-medium uppercase tracking-wider mb-0.5">{subtitle}</div>
          )}
          <div className="text-[var(--ds-fg)] font-bold text-sm leading-tight">{title}</div>
        </div>
        
        {/* History Tracker / Seats — under title, as before */}
        <div className="mb-2">
          {gameType === 'roulette' && (
            <RouletteHistory results={getRouletteResults(index)} />
          )}
          {gameType === 'baccarat' && (
            <BaccaratHistory results={getBaccaratResults(index)} />
          )}
          {gameType === 'blackjack' && seats && (
            <BlackjackSeats occupied={seats.occupied} total={seats.total} />
          )}
          {gameType === 'poker' && seats && (
            <BlackjackSeats occupied={seats.occupied} total={seats.total} />
          )}
        </div>
        
        {/* Vendor & Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm overflow-hidden flex items-center justify-center">
              <Image
                src={vendor.logo}
                alt={vendor.name}
                width={14}
                height={14}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-[var(--ds-fg-subtle)] text-[10px] font-medium">{vendor.name}</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-[var(--ds-control-hover)] flex items-center justify-center">
            <IconInfoCircle className="w-3.5 h-3.5 text-[var(--ds-fg-muted)]" strokeWidth={2} />
          </div>
        </div>
      </div>
      
      <GameTilePlayOverlay className="z-30" favoriteTitle={title} onLaunch={() => onClick?.()} />
    </div>
  )
}

/** Transparent square CTA — muted until hover; spinner stays centered on click */
function PlayRandomTile({ onLaunch }: { onLaunch: () => void }) {
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = () => {
    if (loading) return
    setLoading(true)
    timerRef.current = setTimeout(() => {
      onLaunch()
      timerRef.current = setTimeout(() => setLoading(false), 400)
    }, 850)
  }

  return (
    <button
      type="button"
      data-content-item
      aria-label={loading ? 'Loading random game' : 'Play Random'}
      aria-busy={loading}
      disabled={loading}
      className={cn(
        'group relative flex h-[160px] w-[160px] flex-shrink-0 cursor-pointer flex-col items-center overflow-hidden rounded-small border bg-transparent px-2 pb-3 pt-4 transition-colors duration-200 disabled:cursor-wait',
        'border-white/15 text-[var(--ds-fg-muted)]',
        'hover:border-white/40 hover:text-[var(--ds-fg)]',
        loading && 'border-white/40 text-[var(--ds-fg)]'
      )}
      onClick={handleClick}
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 tile-shimmer" />
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center">
        {loading ? (
          <IconLoader2 className="h-10 w-10 animate-spin" strokeWidth={1.5} />
        ) : (
          <IconArrowsShuffle className="h-10 w-10" strokeWidth={1.5} />
        )}
      </div>
      <span className="relative z-10 shrink-0 text-xs font-semibold">
        {loading ? 'Loading…' : 'Play Random'}
      </span>
    </button>
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
        <h2 className="text-2xl md:text-4xl font-bold text-[var(--ds-fg)] mb-2 md:mb-3 tracking-tight">The Levels</h2>
        <p className="text-xs md:text-sm text-[var(--ds-fg-muted)] max-w-2xl mx-auto leading-relaxed">
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
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-[var(--ds-page-bg)] border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                        isActive ? 'border-white scale-110' : 'border-white/30'
                      }`}>
                        <IconCrown className={`w-3.5 h-3.5 md:w-5 md:h-5 ${tier.iconColor}`} />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[var(--ds-surface-raised)] border-white/20 text-[var(--ds-fg)]">
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
          <CarouselContent className="ml-4 md:ml-6 pr-4 md:pr-6">
            {allLevels.map((level, index) => (
              <CarouselItem key={index} className="pl-0 pr-3 md:pr-4 basis-auto flex-shrink-0">
                <Card className="bg-[var(--ds-control-bg)] border-[var(--ds-border)] relative flex-shrink-0 overflow-hidden w-[180px] md:w-[240px] min-h-[260px] md:min-h-[320px]">
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
                    <div className={`text-base md:text-lg font-semibold mb-0.5 md:mb-1 ${level.isActive ? 'text-[var(--ds-fg)]' : 'text-[var(--ds-fg-subtle)]'}`}>
                      {level.wager}
                    </div>
                    <div className={`text-xs md:text-sm mb-3 md:mb-4 ${level.isActive ? 'text-[var(--ds-fg-muted)]' : 'text-[var(--ds-fg-subtle)]'}`}>
                      Wager Amount
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm ${level.isActive ? 'text-[var(--ds-fg)]' : 'text-[var(--ds-fg-subtle)]'}`}>
                          <div className={`h-3.5 w-3.5 md:h-4 md:w-4 rounded-full flex items-center justify-center flex-shrink-0 ${level.isActive ? 'bg-white/20' : 'bg-[var(--ds-control-hover)]'}`}>
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
            className="!left-2 !top-1/2 !-translate-y-1/2 !-translate-x-0 !absolute text-[var(--ds-fg)] border-white/20 hover:bg-[var(--ds-control-hover)] bg-[var(--ds-page-bg)]/80 z-30 !visible !opacity-100 !flex h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center p-0"
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
            className="!right-2 !top-1/2 !-translate-y-1/2 !-translate-x-0 !absolute text-[var(--ds-fg)] border-white/20 hover:bg-[var(--ds-control-hover)] bg-[var(--ds-page-bg)]/80 z-30 !visible !opacity-100 !flex h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center p-0"
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

// Cash Races Page Component
function CashRacesPage({ brandPrimary, setVipDrawerOpen, setShowVipRewards, setVipActiveTab, setVipActiveSidebarItem, previousPageState, setPreviousPageState, setActiveSubNav }: { brandPrimary: string; setVipDrawerOpen?: (open: boolean) => void; setShowVipRewards?: (show: boolean) => void; setVipActiveTab?: (tab: string) => void; setVipActiveSidebarItem?: (item: string) => void; previousPageState?: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null; setPreviousPageState?: (state: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null) => void; setActiveSubNav?: (nav: string) => void }) {
  const isMobile = useIsMobile()
  const [activeRaceTab, setActiveRaceTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily')
  
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
    <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
      <div className="w-full px-3 md:px-6 pt-6 md:pt-8 pb-8">
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
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] hover:bg-gray-200 dark:hover:bg-[var(--ds-control-bg)] transition-colors duration-300 text-gray-800 dark:text-[var(--ds-fg-muted)] hover:text-black dark:hover:text-[var(--ds-fg)]"
              aria-label="Go back"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--ds-fg)]">Cash Races</h1>
        </div>
        
        {/* Sub Nav Tabs */}
        <div className="mb-6">
          <AnimateTabs value={activeRaceTab} onValueChange={(value) => setActiveRaceTab(value as 'Daily' | 'Weekly' | 'Monthly')} className="w-full">
            <AnimateTabsList className="bg-[var(--ds-control-bg)] dark:bg-[var(--ds-control-bg)] bg-gray-100/80 dark:bg-[var(--ds-control-bg)] p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300">
              {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                <TabsTab
                  key={tab}
                  value={tab} 
                  className="relative z-10 text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] hover:bg-gray-200 dark:hover:bg-[var(--ds-control-bg)] rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white dark:data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5"
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
        {activeRaceTab !== 'Daily' ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[var(--ds-fg)] mb-2">Coming Soon</h2>
              <p className="text-[var(--ds-fg-muted)] text-sm">{activeRaceTab} races will be available soon!</p>
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
            <Card className="bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-raised)] border-[var(--ds-border)] dark:border-[var(--ds-border)]">
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
                    <h1 className="text-2xl font-bold text-[var(--ds-fg)] mb-1">$25,000 Race</h1>
                    <p className="text-[var(--ds-fg-muted)] text-sm">Daily Races Every 24 Hours</p>
                  </div>
                </div>
                
                {/* Description */}
                <div className="text-[var(--ds-fg-muted)] text-sm mb-4 space-y-3">
                  <p>
                    Feel the excitement at BetOnline, where $25,000 in cash is up for grabs every 24 hours!
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
            <Card className="bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-raised)] border-[var(--ds-border)] dark:border-[var(--ds-border)]">
              <CardContent className="p-4">
                {/* Time Remaining Section */}
                <div className="mb-4">
                  <div className="text-[var(--ds-fg-muted)] text-xs mb-2">Time Remaining:</div>
                  <div className="scale-75 origin-left">
                    <DailyRacesTimer />
                  </div>
                </div>
                
                {/* User's Current Status - Using Daily Race Card Components */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-raised)] rounded-small p-2.5 border border-[var(--ds-border)] dark:border-[var(--ds-border)] transition-colors duration-300">
                      <div className="text-gray-800 dark:text-[var(--ds-fg)] font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                      <div className="text-gray-600 dark:text-[var(--ds-fg-subtle)] text-[10px] transition-colors duration-300">Position</div>
                    </div>
                    <div className="bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-raised)] rounded-small p-2.5 border border-[var(--ds-border)] dark:border-[var(--ds-border)] transition-colors duration-300">
                      <div className="text-gray-800 dark:text-[var(--ds-fg)] font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                      <div className="text-gray-600 dark:text-[var(--ds-fg-subtle)] text-[10px] transition-colors duration-300">Wagered</div>
                    </div>
                    <div className="bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-raised)] rounded-small p-2.5 border border-[var(--ds-border)] dark:border-[var(--ds-border)] transition-colors duration-300">
                      <div className="text-gray-800 dark:text-[var(--ds-fg)] font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                      <div className="text-gray-600 dark:text-[var(--ds-fg-subtle)] text-[10px] transition-colors duration-300">Current Prize</div>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column: Leaderboard */}
          <div>
            <div className="bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-raised)] border border-[var(--ds-border)] dark:border-[var(--ds-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--ds-border)]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[var(--ds-fg-muted)]">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[var(--ds-fg-muted)]">Nickname</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[var(--ds-fg-muted)]">Wagered</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[var(--ds-fg-muted)]">Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry) => (
                      <tr key={entry.rank} className="border-b border-[var(--ds-border)] hover:bg-[var(--ds-control-hover)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {entry.medal === 'gold' && <IconTrophy className="w-5 h-5 text-yellow-400" />}
                            {entry.medal === 'silver' && <IconTrophy className="w-5 h-5 text-gray-400" />}
                            {entry.medal === 'bronze' && <IconTrophy className="w-5 h-5 text-orange-400" />}
                            {!entry.medal && <span className="text-[var(--ds-fg-muted)] text-sm">{entry.rank}th</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[var(--ds-fg)]">{entry.nickname}</td>
                        <td className="py-3 px-4 text-right text-[var(--ds-fg)]">{entry.betMade}</td>
                        <td className="py-3 px-4 text-right text-[var(--ds-fg)] font-semibold">{entry.prize}</td>
                      </tr>
                    ))}
                    {/* User's Position Row */}
                    <tr className="border-t-2 border-white/20 bg-[var(--ds-control-bg)]">
                      <td className="py-3 px-4">
                        <span className="text-[var(--ds-fg)] text-sm font-semibold">{userPosition.rank}th</span>
                      </td>
                      <td className="py-3 px-4 text-[var(--ds-fg)] font-semibold">{userPosition.nickname}</td>
                      <td className="py-3 px-4 text-right text-[var(--ds-fg)] font-semibold">{userPosition.betMade}</td>
                      <td className="py-3 px-4 text-right text-[var(--ds-fg)] font-semibold">{userPosition.prize}</td>
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
          <h3 className="text-lg font-semibold text-[var(--ds-fg)] mb-4">Terms & Conditions</h3>
          <div className="bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-raised)] border border-[var(--ds-border)] dark:border-[var(--ds-border)] rounded-lg p-6">
            <ul className="text-[var(--ds-fg-muted)] text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>All players will automatically start their climb up the leaderboard after placing their first qualifying bet</li>
              <li>Each Daily Cash Race will start and end at 12:00 am ET every 24 hours, 7 days a week</li>
              <li>Only bets in the Sportsbook, Casino, Casino in Poker, Racebook or Esports will qualify</li>
              <li>Any bets placed in Poker or Craps will not qualify</li>
              <li>The $25,000 prize pool will be shared amongst the top 250 racers</li>
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
const PROMO_TABS = ['Deposit Bonus', 'Sports', 'Casino', 'Poker'] as const
type PromoTab = (typeof PROMO_TABS)[number]

const ALL_PROMOS: Array<{
  id: string
  title: string
  description: string
  category: PromoTab
}> = [
  {
    id: 'dep-1',
    title: '100% Deposit Match',
    description: 'Double your first deposit up to $1,000. Bonus funds credited instantly after deposit.',
    category: 'Deposit Bonus',
  },
  {
    id: 'dep-2',
    title: 'Reload Bonus 50%',
    description: 'Get 50% back on your next deposit this week. Available once every 7 days.',
    category: 'Deposit Bonus',
  },
  {
    id: 'dep-3',
    title: 'Weekend Deposit Boost',
    description: 'Extra 25% on deposits Saturday–Sunday. Minimum deposit $25.',
    category: 'Deposit Bonus',
  },
  {
    id: 'dep-4',
    title: 'High Roller Match',
    description: 'Deposit $500+ and unlock an enhanced match rate with faster unlock terms.',
    category: 'Deposit Bonus',
  },
  {
    id: 'sp-1',
    title: 'Risk-Free Bet $50',
    description: 'Place a sports wager — if it loses, get a free bet back up to $50.',
    category: 'Sports',
  },
  {
    id: 'sp-2',
    title: 'Odds Boost Daily',
    description: 'Boosted odds on featured games every day. Look for the boost badge.',
    category: 'Sports',
  },
  {
    id: 'sp-3',
    title: 'Parlay Insurance',
    description: 'Miss one leg on a 4+ team parlay and still get a free bet consolation.',
    category: 'Sports',
  },
  {
    id: 'sp-4',
    title: 'Same Game Parlay Bonus',
    description: 'Extra profit boost when you build same-game parlays on NFL and NBA.',
    category: 'Sports',
  },
  {
    id: 'cas-1',
    title: '50 Free Spins',
    description: 'Free spins on selected slots. Wagering applies to winnings only.',
    category: 'Casino',
  },
  {
    id: 'cas-2',
    title: 'Casino Cashback 10%',
    description: 'Weekly cashback on net casino losses. Credited every Monday.',
    category: 'Casino',
  },
  {
    id: 'cas-3',
    title: 'Live Dealer Reload',
    description: 'Bonus for live blackjack and roulette play this weekend.',
    category: 'Casino',
  },
  {
    id: 'cas-4',
    title: 'Slots Tournament Entry',
    description: 'Free entry into this week’s slots race with a $2,500 prize pool.',
    category: 'Casino',
  },
  {
    id: 'pok-1',
    title: 'Poker Freeroll Ticket',
    description: 'Claim a freeroll seat and play for cash prizes with no buy-in.',
    category: 'Poker',
  },
  {
    id: 'pok-2',
    title: 'Rakeback Boost',
    description: 'Extra rakeback for 7 days when you opt into this poker promo.',
    category: 'Poker',
  },
  {
    id: 'pok-3',
    title: 'Sit & Go Ticket Pack',
    description: 'Three Sit & Go tickets to get you into the action quickly.',
    category: 'Poker',
  },
  {
    id: 'pok-4',
    title: 'Poker Deposit Match',
    description: 'Match bonus for poker play — transferable to cash games and tournaments.',
    category: 'Poker',
  },
]

function PromosPage({
  brandPrimary,
  setVipDrawerOpen,
  setShowVipRewards,
  setVipActiveTab,
  setVipActiveSidebarItem,
  activeTab: controlledActiveTab,
  onActiveTabChange,
}: {
  brandPrimary: string
  setVipDrawerOpen?: (open: boolean) => void
  setShowVipRewards?: (show: boolean) => void
  setVipActiveTab?: (tab: string) => void
  setVipActiveSidebarItem?: (item: string) => void
  /** Controlled sub-nav tab (Deposit Bonus / Sports / Casino / Poker) */
  activeTab?: string
  onActiveTabChange?: (tab: string) => void
}) {
  const isMobile = useIsMobile()
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState('Deposit Bonus')
  const activeTab = controlledActiveTab ?? uncontrolledActiveTab
  const setActiveTab = onActiveTabChange ?? setUncontrolledActiveTab

  const filteredPromos = useMemo(
    () => ALL_PROMOS.filter((promo) => promo.category === activeTab),
    [activeTab]
  )

  return (
    <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
      {/* Banner Carousel - Full Width with Arrows */}
      <div className="pt-6 md:pt-8 mb-6 md:mb-8">
          <Carousel className="w-full relative overflow-visible" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
          {!isMobile && (
            <>
              <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20" />
              <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20" />
            </>
          )}
          <CarouselContent className="ml-3 md:ml-6 pr-3 md:pr-6">
            {/* VIP Hub — same card as casino lobby carousel */}
            <CarouselItem className="pl-0 basis-auto flex-shrink-0">
              <Card
                className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-0 bg-[#eeeeee] shadow-none transition-colors dark:bg-white/[0.06]"
                style={{ width: '300px', height: '164px' }}
                onClick={() => {
                  setVipActiveTab?.('VIP')
                  setVipDrawerOpen?.(true)
                }}
              >
                <CardContent className="relative z-10 flex h-full min-h-0 flex-col p-4">
                  <div className="flex shrink-0 items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold leading-tight text-[#1a1a1a] dark:text-white">
                      VIP Hub
                    </CardTitle>
                    <IconLogin2
                      className="mt-0.5 h-4 w-4 shrink-0 text-black/40 dark:text-white/45"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col justify-center">
                    <VipTierProgressCard
                      fromTier="Bronze"
                      toTier="Silver"
                      percent={25}
                      className="border-0 bg-transparent p-0 shadow-none"
                    />
                  </div>
                </CardContent>
                <span className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full dark:via-white/15" />
              </Card>
            </CarouselItem>

            {/* Daily Races — same card as casino lobby carousel */}
            <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
              <Card
                className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-0 bg-[#eeeeee] shadow-none transition-colors dark:bg-white/[0.06]"
                style={{ width: '300px', height: '164px' }}
                onClick={() => {
                  setVipActiveTab?.('Daily Races')
                  setVipDrawerOpen?.(true)
                }}
              >
                <CardContent className="relative z-10 flex h-full min-h-0 flex-col justify-between p-4">
                  <div className="flex shrink-0 items-start justify-between gap-2">
                    <CardTitle className="mb-0 text-base font-bold leading-tight text-[#1a1a1a] dark:text-white">
                      Daily Races
                    </CardTitle>
                    <DailyRacesTimer
                      className="text-base font-bold tabular-nums text-[#1a1a1a] dark:text-white"
                      colonClassName="text-black/40 dark:text-white/50"
                    />
                  </div>
                  <div className="grid w-full grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white px-2.5 py-2.5 dark:bg-white/[0.08]">
                      <div className="text-sm font-bold tabular-nums text-[#1a1a1a] dark:text-white">3rd</div>
                      <div className="mt-0.5 text-[11px] font-medium text-black/45 dark:text-white/50">Position</div>
                    </div>
                    <div className="rounded-xl bg-white px-2.5 py-2.5 dark:bg-white/[0.08]">
                      <div className="text-sm font-bold tabular-nums text-[#1a1a1a] dark:text-white">$80.000</div>
                      <div className="mt-0.5 text-[11px] font-medium text-black/45 dark:text-white/50">Wagered</div>
                    </div>
                    <div className="rounded-xl bg-white px-2.5 py-2.5 dark:bg-white/[0.08]">
                      <div className="text-sm font-bold tabular-nums text-[#1a1a1a] dark:text-white">$160.000</div>
                      <div className="mt-0.5 text-[11px] font-medium text-black/45 dark:text-white/50">Current Prize</div>
                    </div>
                  </div>
                </CardContent>
                <span className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full dark:via-white/15" />
              </Card>
            </CarouselItem>

            {[
              {
                src: '/banners/casino/casino_banner1.svg',
                alt: 'Contests',
                target: 'Contests' as const,
                label: 'Contests',
              },
              {
                src: '/banners/casino/casino_banner2.svg',
                alt: 'My Bonus',
                target: 'My Bonus' as const,
                label: 'My Bonus',
              },
              {
                src: '/banners/casino/casino_banner 3.svg',
                alt: 'Refer A Friend',
                target: 'Refer A Friend' as const,
                label: 'Refer A Friend',
              },
              { src: '/banners/casino/casino_banner4.svg', alt: 'Casino Banner 4' },
              { src: '/banners/casino/casino_Banner5.svg', alt: 'Casino Banner 5' },
            ].map((banner, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                <Card
                  role={banner.target ? 'button' : undefined}
                  tabIndex={banner.target ? 0 : undefined}
                  onClick={() => {
                    if (banner.target) setVipActiveSidebarItem?.(banner.target)
                  }}
                  onKeyDown={(e) => {
                    if (!banner.target) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setVipActiveSidebarItem?.(banner.target)
                    }
                  }}
                  className={cn(
                    'border-0 relative overflow-hidden flex-shrink-0 rounded-small',
                    banner.target
                      ? 'cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-primary,#ee3536)]'
                      : 'cursor-default'
                  )}
                  style={{ width: '340px', height: '164px' }}
                >
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    width={340}
                    height={164}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                  {banner.label && (
                    <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                      {banner.label}
                    </span>
                  )}
                </Card>
              </CarouselItem>
            ))}
            </CarouselContent>
          </Carousel>
        </div>
      {/* Match casino/poker content gutters — full width, no max-w-7xl pinch */}
      <div className="w-full px-3 md:px-6 pb-8">

        {/* Promos Section */}
        <div className="w-full">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--ds-fg)] mb-4 md:mb-6">All Promotions</h1>

          {/* Tabs - Using AnimateTabs like Casino */}
          <div className="mb-6">
            <AnimateTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <AnimateTabsList className="bg-[var(--ds-control-bg)] dark:bg-[var(--ds-control-bg)] bg-gray-100/80 dark:bg-[var(--ds-control-bg)] p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300">
                {PROMO_TABS.map((tab) => (
                  <TabsTab 
                    key={tab}
                    value={tab} 
                    className="relative z-10 text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] hover:bg-gray-200 dark:hover:bg-[var(--ds-control-bg)] rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white dark:data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5"
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

          {/* Promo Cards Grid — filtered by active category */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {filteredPromos.length === 0 ? (
                <div className="col-span-full rounded-xl border border-white/[0.05] bg-white/[0.03] px-6 py-12 text-center">
                  <p className="text-sm text-[var(--ds-fg-muted)]">
                    No promotions in {activeTab} right now.
                  </p>
                </div>
              ) : (
                filteredPromos.map((promo, index) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04, ease: 'easeOut' }}
                  >
                    <Card className="h-full overflow-hidden border-[var(--ds-promo-card-border)] bg-[var(--ds-promo-card-bg)] text-[var(--ds-promo-card-fg)]">
                      <div className="relative h-48 w-full overflow-hidden bg-white/5">
                        <div className="tile-shimmer absolute inset-0" />
                      </div>
                      <CardContent className="p-4">
                        <CardTitle className="mb-2 text-lg font-semibold text-white">
                          {promo.title}
                        </CardTitle>
                        <p className="mb-4 line-clamp-3 text-sm text-white/65">{promo.description}</p>
                        <Button
                          variant="ghost"
                          className="w-full rounded-md border border-white/20 bg-transparent text-white shadow-none hover:border-white/30 hover:bg-white/10 hover:text-white"
                        >
                          MORE INFO
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SidebarInset>
  )
}

function VipSectionWireframe({ title }: { title: string }) {
  return (
    <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)] min-h-[60vh]">
      <div className="px-4 md:px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="rounded-xl border-2 border-dashed border-white/25 bg-white/[0.03] p-8 md:p-12">
          <div className="space-y-4">
            <div className="h-8 w-48 rounded-md bg-[var(--ds-control-hover)]" />
            <div className="h-4 w-full max-w-md rounded-md bg-[var(--ds-control-bg)]" />
            <div className="h-4 w-[80%] max-w-sm rounded-md bg-[var(--ds-control-bg)]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="h-32 rounded-lg border border-dashed border-white/15 bg-white/[0.02]" />
              <div className="h-32 rounded-lg border border-dashed border-white/15 bg-white/[0.02]" />
            </div>
            <p className="text-sm text-[var(--ds-fg-subtle)] pt-2">
              {title} — wireframe. Full design coming soon.
            </p>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

// VIP Rewards Page Component
function VIPRewardsPage({ brandPrimary, setVipDrawerOpen, setVipActiveTab, setShowVipRewards, initialVipSidebarItem, setInitialVipSidebarItem, previousPageState, setPreviousPageState, setActiveSubNav, quickLinksOpen, onNavigate, vipActiveSidebarItem, setVipActiveSidebarItem, promosActiveTab, setPromosActiveTab }: { brandPrimary: string; setVipDrawerOpen: (open: boolean) => void; setVipActiveTab: (tab: string) => void; setShowVipRewards: (show: boolean) => void; initialVipSidebarItem?: string | null; setInitialVipSidebarItem?: (item: string | null) => void; previousPageState?: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null; setPreviousPageState?: (state: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null) => void; setActiveSubNav?: (nav: string) => void; quickLinksOpen?: boolean; onNavigate?: (page: 'home' | 'sports' | 'casino' | 'liveCasino' | 'poker' | 'vipRewards') => void; vipActiveSidebarItem?: string; setVipActiveSidebarItem?: (item: string) => void; promosActiveTab?: string; setPromosActiveTab?: (tab: string) => void }) {
  const router = useRouter()
  // vipActiveSidebarItem and setVipActiveSidebarItem come from props

  
  return (
    <div className="min-h-screen bg-[var(--ds-page-bg)]">
      
      {/* Mobile VIP section tabs removed — navigate via sidebar / promo banners */}
      
      {vipActiveSidebarItem === 'My Bonus' ? (
        <MyBonusPage brandPrimary={brandPrimary} setShowVipRewards={setShowVipRewards} />
      ) : vipActiveSidebarItem === 'Promos' ? (
        <PromosPage 
          brandPrimary={brandPrimary} 
          setVipDrawerOpen={setVipDrawerOpen}
          setShowVipRewards={setShowVipRewards}
          setVipActiveTab={setVipActiveTab}
          setVipActiveSidebarItem={setVipActiveSidebarItem}
          activeTab={promosActiveTab}
          onActiveTabChange={setPromosActiveTab}
        />
      ) : vipActiveSidebarItem === 'Refer A Friend' ? (
        <ReferAFriendPage />
      ) : vipActiveSidebarItem === 'Contests' ? (
        <ContestsPage />
      ) : (
        <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
        {/* Hero Image */}
        <div className="w-full relative">
          <img 
            src="/banners/sports_league/Hero.png" 
            alt="Promotions" 
            className="w-full h-auto object-cover max-h-[200px] md:max-h-none"
            style={{ display: 'block' }}
          />
        </div>
        
        <div className="px-4 md:px-6 pt-6 md:pt-8 pb-8 max-w-7xl mx-auto flex flex-col items-center w-full">
          {/* Cards from Casino Banner - Centered */}
          <div className="mb-8 w-full flex justify-center mt-4 md:mt-8">
            <div className="flex flex-col gap-3 w-full max-w-[720px]">
              <h1 className="text-xl md:text-2xl font-bold text-[var(--ds-fg)]">Hi, CH</h1>
              <div className="flex flex-col md:flex-row gap-3">
              {/* VIP Rewards Card - Wider */}
              <Card className="flex-shrink-0 w-full border border-[var(--ds-promo-card-border)] bg-[var(--ds-promo-card-bg)] text-[var(--ds-promo-card-fg)] transition-colors duration-300 md:w-[300px]" style={{ minHeight: '140px' }}>
                <CardContent className="p-4">
                  <CardTitle className="text-sm font-semibold text-white mb-4 transition-colors duration-300">Gold To Platinum I</CardTitle>
                  <VipTierProgressBar value={45} nextTierLabel="Platinum I" wagerRemaining="$2,750" />
                </CardContent>
              </Card>
              
              {/* Daily Races Card - Wider */}
              <Card className="flex-shrink-0 w-full border border-amber-400/35 bg-[var(--ds-promo-card-bg)] bg-gradient-to-br from-amber-400/[0.12] to-transparent text-[var(--ds-promo-card-fg)] transition-colors duration-300 md:w-[300px]" style={{ minHeight: '140px' }}>
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
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--ds-fg)]">The Rewards</h2>
            </div>
            <p className="text-[var(--ds-fg-muted)] mb-12 max-w-3xl mx-auto text-center">
              At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
            </p>
            
            {/* Reward Cards - Single Card with Separators */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-[var(--ds-control-bg)] border-[var(--ds-border)]">
                <CardContent className="p-6">
                  {/* Reloads */}
                  <div className="pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[var(--ds-fg)]">Reloads</h3>
                    </div>
                    <p className="text-[var(--ds-fg-muted)] text-sm mb-4">
                      At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-white/20"
                        onClick={() => {
                          setVipDrawerOpen(true)
                          setVipActiveTab('Reloads')
                        }}
                      >
                        Open
                      </Button>
                      <Button variant="ghost" className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-white/20">
                        Learn More
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-[var(--ds-control-hover)] my-6" />

                  {/* Cash Drop Codes */}
                  <div className="pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[var(--ds-fg)]">Cash Drop Codes</h3>
                    </div>
                    <p className="text-[var(--ds-fg-muted)] text-sm mb-4">
                      At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-white/20"
                        onClick={() => {
                          setVipDrawerOpen(true)
                          setVipActiveTab('Cash Drop')
                        }}
                      >
                        Open
                      </Button>
                      <Button variant="ghost" className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-white/20">
                        Learn More
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-[var(--ds-control-hover)] my-6" />

                  {/* Bet & Get */}
                  <div className="pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[var(--ds-fg)]">Bet & Get</h3>
                    </div>
                    <p className="text-[var(--ds-fg-muted)] text-sm mb-4">
                      At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-white/20"
                        onClick={() => {
                          setVipDrawerOpen(true)
                          setVipActiveTab('Bet & Get')
                        }}
                      >
                        Open
                      </Button>
                      <Button variant="ghost" className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-white/20">
                        Learn More
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-[var(--ds-control-hover)] my-6" />

                  {/* Cash Boosts */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[var(--ds-fg)]">Cash Boosts</h3>
                    </div>
                    <p className="text-[var(--ds-fg-muted)] text-sm mb-4">
                      At BetOnline, you can start raking in the rewards as soon as you sign up. Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-white/20"
                        onClick={() => {
                          setVipDrawerOpen(true)
                          setVipActiveTab('VIP')
                        }}
                      >
                        Open
                      </Button>
                      <Button variant="ghost" className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-white/20">
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
      <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)] !min-h-0">
        <SiteFooter />
      </SidebarInset>
    </div>
  )
}

// Sports Page Component
function SportsPage({ activeTab, onTabChange, onBack, brandPrimary, brandPrimaryHover, onSearchClick }: { activeTab: string; onTabChange: (tab: string) => void; onBack: () => void; brandPrimary: string; brandPrimaryHover: string; onSearchClick: () => void }) {
  const router = useRouter()
  const { state: sidebarState, toggleSidebar, setOpenMobile } = useSidebar()
  const isMobile = useIsMobile()
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
  const [eventOrderBy, setEventOrderBy] = useState<string>('Popularity')
  const [selectedLeague, setSelectedLeague] = useState<number>(1) // Default to Premier League (id: 1)
  
  // Sportsbook settings state
  const [sportsbookSettingsOpen, setSportsbookSettingsOpen] = useState(false)
  const [oddsFormat, setOddsFormat] = useState<'American' | 'Fractional' | 'Decimal'>('American')
  const [betslipOddsSetting, setBetslipOddsSetting] = useState<'dont_accept' | 'higher' | 'any'>('higher')
  const [showBetConfirmation, setShowBetConfirmation] = useState(false)
  
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
                          ? "bg-[#8fd790] text-[var(--ds-fg)] hover:bg-[#7fc780] cursor-pointer" 
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
    <div className="flex w-full min-h-screen bg-[var(--ds-page-bg)]">
      {/* Sports Sidebar — full height, same as poker */}
      <Sidebar 
        collapsible="icon"
        variant="sidebar"
        mobileOverlay
        mobileNoDrag
        mobileBg="#2d2d2d"
        mobileOverlayClassName="!bg-black/30 !backdrop-blur-sm"
        className="!bg-[var(--ds-surface-raised)] border-r border-[var(--ds-border)] text-[var(--ds-fg)] [&>div]:!bg-[var(--ds-surface-raised)] !h-screen !top-0 !z-[102]"
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
                  <div className="h-5 w-[110px] flex-shrink-0">
                    <svg viewBox="0 0 640 86" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <g id="BETONLINE"><path fillRule="evenodd" clipRule="evenodd" d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z" fill="#ee3536"/><path d="M120.693 85.7021V0.0993091H178.194V17.4781H140.558V33.6651H176.197V50.2494H140.658V68.0254H180.39V85.7021H120.693Z" fill="#ee3536"/><path d="M257.757 8.54042C261.251 5.16397 265.244 2.38337 269.736 0.0993091H185.781V17.776H209.939V85.7021H230.604V17.776H250.37C252.466 14.3995 254.962 11.321 257.757 8.54042Z" fill="#ee3536"/><path fillRule="evenodd" clipRule="evenodd" d="M313.761 3.47575C319.151 5.66051 323.843 8.63973 327.737 12.5127C331.63 16.3857 334.625 20.9538 336.821 26.1178C339.017 31.3811 340.115 37.0416 340.115 43.0993C340.115 49.1571 339.017 54.9169 336.821 60.0808C334.625 65.2448 331.63 69.8129 327.737 73.6859C323.843 77.4596 319.151 80.5381 313.761 82.7229C308.27 84.9076 302.28 86 295.891 86C289.403 86 283.413 84.9076 278.022 82.7229C272.631 80.5381 267.939 77.5589 264.046 73.6859C260.253 69.9122 257.158 65.2448 254.962 60.0808C252.766 54.8176 251.667 49.1571 251.667 43.0993C251.667 37.0416 252.766 31.2818 254.962 26.1178C257.158 20.9538 260.153 16.3857 264.046 12.5127C267.939 8.73903 272.631 5.66051 278.022 3.47575C283.513 1.291 289.502 0.198618 295.891 0.198618C302.38 0.198618 308.37 1.291 313.761 3.47575ZM324.642 55.3141C326.139 51.5404 326.838 47.3695 326.838 43.0993C326.838 38.8291 326.04 34.6582 324.642 30.8845C323.244 27.1109 321.148 23.7344 318.453 20.9538C315.757 18.1732 312.563 15.8891 308.769 14.2009C305.076 12.5127 300.783 11.7182 296.091 11.7182C291.399 11.7182 287.206 12.5127 283.413 14.2009C279.719 15.8891 276.425 18.1732 273.73 20.9538C271.134 23.7344 269.038 27.1109 267.54 30.8845C266.043 34.6582 265.344 38.8291 265.344 43.0993C265.344 47.3695 266.043 51.5404 267.54 55.3141C268.938 59.0878 271.034 62.4642 273.73 65.2448C276.425 68.0254 279.619 70.3095 283.413 71.9977C287.107 73.6859 291.399 74.4804 296.091 74.4804C300.783 74.4804 304.976 73.6859 308.769 71.9977C312.463 70.3095 315.757 68.0254 318.453 65.2448C321.048 62.4642 323.145 59.0878 324.642 55.3141Z" fill="white"/><path d="M437.847 0.0993091H425.069V85.6028H476.681V74.1824H437.847V0.0993091Z" fill="white"/><path d="M484.268 0.0993091H497.046V85.7021H484.268V0.0993091Z" fill="white"/><path d="M594.778 74.1824V48.2633H634.909V36.7436H594.778V11.6189H637.804V0.0993091H582V85.6028H640V74.1824H594.778Z" fill="white"/><path d="M347.802 0.0993091L405.403 56.903V0.0993091H417.482V85.6028L359.782 29.4942V85.6028H347.802V0.0993091Z" fill="white"/><path d="M562.333 57.3002L504.633 0.0993091V85.6028H516.712V29.8915L574.313 85.2055V0.0993091H562.333V57.3002Z" fill="white"/></g>
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </SidebarHeader>

        {/* Quick Links — mobile only */}
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
                { label: 'Home', page: 'home' },
                { label: 'Sports', page: 'sports' },
                { label: 'Casino', page: 'casino' },
                { label: 'Poker', page: 'poker' },
                { label: 'VIP Rewards', page: 'vipRewards' },
              ].map((item) => {
                const isCurrentPage = item.page === 'sports'
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setOpenMobile(false)
                      if (item.page === 'home') onBack()
                      else if (item.page !== 'sports') onBack()
                    }}
                    className={cn(
                      "flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative",
                      isCurrentPage ? "text-[var(--ds-fg)] font-bold" : "text-white/35 font-medium hover:text-[var(--ds-fg-muted)]"
                    )}
                  >
                    {item.label}
                    {isCurrentPage && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <SidebarContent className="overflow-y-auto flex flex-col">
          <TooltipProvider>

            <SidebarGroup>
              <SidebarGroupLabel className="px-2 py-1 text-xs text-[var(--ds-fg-subtle)]">FEATURES</SidebarGroupLabel>
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
                                "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                              )}
                              style={item.active ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
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
            
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 py-1 text-xs text-[var(--ds-fg-subtle)]">SPORTS</SidebarGroupLabel>
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
                                    "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                  )}
                                  style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
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
                                <TooltipContent side="right" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
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
                                                className="pl-8 text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer flex items-center justify-between"
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
                                                            className="pl-12 text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer flex items-center justify-between"
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
                                              className="pl-8 text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer flex items-center justify-between"
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
                                  "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                )}
                                style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                              >
                                <Icon strokeWidth={1.5} className="w-5 h-5" />
                                <span>{sport.label}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {sidebarState === 'collapsed' && (
                              <TooltipContent side="right" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
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
                            "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]",
                            sportsbookSettingsOpen && "bg-[var(--ds-control-bg)] text-[var(--ds-fg)]"
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
                        <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", sportsbookSettingsOpen ? "bg-white/20" : "bg-[var(--ds-control-hover)]")}>
                          <IconSettings strokeWidth={1.5} className="w-4 h-4" />
                        </div>
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {sidebarState === 'collapsed' && (
                      <TooltipContent side="right" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
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

      {/* Settings Modal */}
      {sportsbookSettingsOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10002] flex items-center justify-center pt-[10px] md:pt-0" onClick={() => setSportsbookSettingsOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div 
            className="relative w-[85vw] max-w-sm bg-[var(--ds-surface-raised)] border border-[var(--ds-border)] rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-[var(--ds-border)]">
              <div className="flex items-center gap-2">
                <IconSettings strokeWidth={1.5} className="w-4 h-4 text-[var(--ds-fg-muted)]" />
                <span className="text-sm font-semibold text-[var(--ds-fg)]">Settings</span>
              </div>
              <button onClick={() => setSportsbookSettingsOpen(false)} className="p-1 rounded-md text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {/* Odds Format */}
            <div className="p-3 border-b border-[var(--ds-border)]">
              <p className="text-xs text-[var(--ds-fg-subtle)] font-medium mb-2 uppercase tracking-wider">Odds Format</p>
              <div className="space-y-0.5">
                {(['American', 'Fractional', 'Decimal'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setOddsFormat(format)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-md text-sm transition-colors flex items-center gap-2",
                      oddsFormat === format
                        ? "text-[var(--ds-fg)] bg-[var(--ds-control-bg)]"
                        : "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
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
            <div className="p-3 border-b border-[var(--ds-border)]">
              <p className="text-xs text-[var(--ds-fg-subtle)] font-medium mb-2 uppercase tracking-wider">Betslip Settings</p>
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
                        ? "text-[var(--ds-fg)] bg-[var(--ds-control-bg)]"
                        : "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
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
                <span className="text-sm text-[var(--ds-fg-muted)] ml-3">Show Confirmation</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* Main Content */}
      <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]" style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}>
        <div className="px-6 py-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onBack()
              }} 
              className="p-1 hover:bg-[var(--ds-control-bg)] rounded cursor-pointer transition-colors"
            >
              <IconChevronLeft className="w-4 h-4 text-[var(--ds-fg-muted)]" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <button 
              className="text-sm text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] flex items-center gap-1 cursor-pointer transition-colors"
            >
              Soccer
              <IconChevronDown className="w-3 h-3" />
            </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: Football')}
                >
                  Football
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: Basketball')}
                >
                  Basketball
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: Baseball')}
                >
                  Baseball
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: Golf')}
                >
                  Golf
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: Tennis')}
                >
                  Tennis
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-[var(--ds-fg-subtle)]">/</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <button 
              className="text-sm text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] flex items-center gap-1 cursor-pointer transition-colors"
            >
              England
              <IconChevronDown className="w-3 h-3" />
            </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: Spain')}
                >
                  Spain
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: Italy')}
                >
                  Italy
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: USA')}
                >
                  USA
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-[var(--ds-fg-subtle)]">/</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <button 
              className="text-sm text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] flex items-center gap-1 cursor-pointer transition-colors"
            >
              Premier League
              <IconChevronDown className="w-3 h-3" />
            </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: Championship')}
                >
                  Championship
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: League 1')}
                >
                  League 1
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: League 2')}
                >
                  League 2
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                  onClick={() => console.log('Selected: FA Cup')}
                >
                  FA Cup
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
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
                    <IconTrophy className="w-6 h-6 text-[var(--ds-fg)]" />
                  )
                })()}
              </div>
              <div>
                <h1 className="text-lg font-bold text-[var(--ds-fg)]">Premier League</h1>
              </div>
              <div className="ml-auto">
                <Button 
                  variant="ghost" 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('View All clicked')
                  }}
                  className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)] text-xs cursor-pointer"
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
                  <div className="bg-[var(--ds-control-bg)] p-0.5 h-auto gap-0.5 rounded-3xl border-0 flex items-center transition-colors duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onSearchClick()
                      }}
                      className="bg-transparent text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 ease-in-out"
                    >
                      <IconSearch className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                {/* Text Tabs - Middle */}
                <AnimateTabs value={activeTab} onValueChange={(value) => { 
                  onTabChange(value)
                }} className="flex-1">
                  <AnimateTabsList className="bg-[var(--ds-control-bg)] p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300">
                    {['Events', 'Outrights', 'Boosts', 'Specials', 'All Leagues'].map((tab) => (
                      <TabsTab 
                        key={tab}
                        value={tab} 
                        className="relative z-10 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none"
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
                
                {/* Events Filter - Right Side */}
                <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
                  <span className="text-xs text-[var(--ds-fg-subtle)] whitespace-nowrap">Events ordered by: {eventOrderBy}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer"
                      >
                        <IconFilter className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      sideOffset={5}
                      className="w-[180px] bg-[var(--ds-surface-raised)] border-[var(--ds-border)] z-[120]"
                      style={{ zIndex: 120 }}
                    >
                      {eventOrderOptions.map((option) => (
                        <DropdownMenuItem 
                          key={option.value}
                          onClick={() => setEventOrderBy(option.value)}
                          className={cn(
                            "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] cursor-pointer",
                            eventOrderBy === option.value && "bg-[var(--ds-control-hover)] text-[var(--ds-fg)]"
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
                          : "bg-[var(--ds-control-bg)] border-[var(--ds-border)] hover:bg-[var(--ds-control-hover)]",
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
                          <league.icon className="w-8 h-8 text-[var(--ds-fg-muted)]" />
                        )}
                      </div>
                    </button>
                  )
                })}
                {/* Scroll indicator */}
                <button className="flex-shrink-0 w-20 h-20 bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-small hover:bg-[var(--ds-control-hover)] transition-colors flex items-center justify-center cursor-pointer ml-2 md:ml-4">
                  <IconChevronRight className="w-5 h-5 text-[var(--ds-fg-muted)]" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Top Events Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--ds-fg-muted)]">TOP EVENTS</h2>
              <Button 
                variant="ghost" 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('View All clicked for Top Events')
                }}
                className="text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] cursor-pointer"
              >
                View All
              </Button>
            </div>
            <div className="relative -mx-6" style={{ overflow: 'visible', position: 'relative', width: 'calc(100% + 3rem)', maxWidth: 'none', boxSizing: 'border-box', minWidth: 0 }}>
              <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                <CarouselContent className="ml-6 mr-0">
                  {/* First event - Manchester City vs Liverpool (Live) */}
                  <CarouselItem className="pl-0 pr-0 basis-auto flex-shrink-0">
                    <div className="w-[320px] bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(238, 53, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
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
                          <span className="text-[10px] text-[var(--ds-fg)]">Premier League | England</span>
                  </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-[#ee3536] px-1.5 py-0.5 rounded-full">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <span className="text-[10px] font-semibold text-[var(--ds-fg)]">LIVE</span>
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
                          <span className="text-xs font-semibold text-[var(--ds-fg)] truncate">Manchester City</span>
                        </div>
                        
                        {/* Score */}
                        <div className="flex items-center justify-center mx-3 flex-shrink-0">
                          <div className="text-base font-bold text-[var(--ds-fg)] leading-none">4 - 0</div>
                        </div>
                        
                        {/* Team 2 - Liverpool */}
                        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                          <span className="text-xs font-semibold text-[var(--ds-fg)] truncate">Liverpool</span>
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
                            "bg-[var(--ds-control-hover)] text-[var(--ds-fg)] rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                            isBetSelected(4, 'Moneyline', 'MCI') && "bg-red-500"
                          )}
                      onMouseEnter={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'MCI')) {
                        e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                            }
                      }}
                      onMouseLeave={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'MCI')) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                      }}
                    >
                          <div className="text-[10px] text-[var(--ds-fg-muted)] leading-none mb-0.5">MCI</div>
                          <div className="text-xs font-bold leading-none">+350</div>
                    </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(4, 'Manchester City v Liverpool', 'Moneyline', 'Tie', '+350')
                          }}
                          className={cn(
                            "bg-[var(--ds-control-hover)] text-[var(--ds-fg)] rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                            isBetSelected(4, 'Moneyline', 'Tie') && "bg-red-500"
                          )}
                          onMouseEnter={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'Tie')) {
                              e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'Tie')) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <div className="text-[10px] text-[var(--ds-fg-muted)] leading-none mb-0.5">Tie</div>
                          <div className="text-xs font-bold leading-none">+350</div>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(4, 'Manchester City v Liverpool', 'Moneyline', 'LIV', '+350')
                          }}
                          className={cn(
                            "bg-[var(--ds-control-hover)] text-[var(--ds-fg)] rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                            isBetSelected(4, 'Moneyline', 'LIV') && "bg-red-500"
                          )}
                          onMouseEnter={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'LIV')) {
                              e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBetSelected(4, 'Moneyline', 'LIV')) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <div className="text-[10px] text-[var(--ds-fg-muted)] leading-none mb-0.5">LIV</div>
                          <div className="text-xs font-bold leading-none">+350</div>
                    </button>
                  </div>
                      
                      {/* Popularity Bar */}
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-[var(--ds-fg-subtle)] text-center mb-1">Moneyline</div>
                        <div className="flex h-1.5 bg-[var(--ds-control-hover)] rounded-full overflow-hidden">
                          <div className="bg-[#ee3536] h-full" style={{ width: '94%' }}></div>
                          <div className="bg-white h-full" style={{ width: '6%' }}></div>
                </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[var(--ds-fg-subtle)]">94% MCI</span>
                          <span className="text-[var(--ds-fg-subtle)]">6% LIV</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                  
                  {/* Other events - duplicate for carousel */}
                  {[4, 5, 6].map((eventId) => (
                    <CarouselItem key={eventId} className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                      <div className="w-[320px] bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(238, 53, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
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
                            <span className="text-[10px] text-[var(--ds-fg)]">Premier League | England</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 bg-[#ee3536] px-1.5 py-0.5 rounded-full">
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                              <span className="text-[10px] font-semibold text-[var(--ds-fg)]">LIVE</span>
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
                            <span className="text-xs font-semibold text-[var(--ds-fg)] truncate">Manchester City</span>
                          </div>
                          
                          {/* Score */}
                          <div className="flex items-center justify-center mx-3 flex-shrink-0">
                            <div className="text-base font-bold text-[var(--ds-fg)] leading-none">4 - 0</div>
                          </div>
                          
                          {/* Team 2 - Liverpool */}
                          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                            <span className="text-xs font-semibold text-[var(--ds-fg)] truncate">Liverpool</span>
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
                              "bg-[var(--ds-control-hover)] text-[var(--ds-fg)] rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(eventId, 'Moneyline', 'MCI') && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'MCI')) {
                                e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'MCI')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-[var(--ds-fg-muted)] leading-none mb-0.5">MCI</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addBetToSlip(eventId, 'Manchester City v Liverpool', 'Moneyline', 'Tie', '+350')
                            }}
                            className={cn(
                              "bg-[var(--ds-control-hover)] text-[var(--ds-fg)] rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(eventId, 'Moneyline', 'Tie') && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'Tie')) {
                                e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'Tie')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-[var(--ds-fg-muted)] leading-none mb-0.5">Tie</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addBetToSlip(eventId, 'Manchester City v Liverpool', 'Moneyline', 'LIV', '+350')
                            }}
                            className={cn(
                              "bg-[var(--ds-control-hover)] text-[var(--ds-fg)] rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                              isBetSelected(eventId, 'Moneyline', 'LIV') && "bg-red-500"
                            )}
                            onMouseEnter={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'LIV')) {
                                e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBetSelected(eventId, 'Moneyline', 'LIV')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            <div className="text-[10px] text-[var(--ds-fg-muted)] leading-none mb-0.5">LIV</div>
                            <div className="text-xs font-bold leading-none">+350</div>
                          </button>
                        </div>
                        
                        {/* Popularity Bar */}
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-[var(--ds-fg-subtle)] text-center mb-1">Moneyline</div>
                          <div className="flex h-1.5 bg-[var(--ds-control-hover)] rounded-full overflow-hidden">
                            <div className="bg-[#ee3536] h-full" style={{ width: '94%' }}></div>
                            <div className="bg-white h-full" style={{ width: '6%' }}></div>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[var(--ds-fg-subtle)]">94% MCI</span>
                            <span className="text-[var(--ds-fg-subtle)]">6% LIV</span>
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
              <h2 className="text-sm font-semibold text-[var(--ds-fg-muted)]">LIVE</h2>
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
                  
                  return <span className="text-[10px] text-[var(--ds-fg-muted)]">{formattedTime}</span>
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
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20 flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
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
                                <div className="text-[10px] text-[var(--ds-fg-subtle)] mb-1.5 leading-none text-center whitespace-nowrap px-1">{market.title}</div>
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
                                          "text-[var(--ds-fg)] rounded-small w-[68px] h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2 flex-shrink-0",
                                          isSelected 
                                            ? "bg-red-500 hover:bg-red-600" 
                                            : "bg-[var(--ds-control-hover)] hover:bg-white/20"
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
                                        <div className="text-[10px] text-[var(--ds-fg-muted)] leading-none mb-0.5 truncate w-full text-center">{option.label}</div>
                                        <div className="text-xs font-bold leading-none">{option.odds}</div>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                              {/* Vertical Divider */}
                              {marketIndex < event.markets.length - 1 && (
                                <div className="w-px h-[32px] bg-[var(--ds-control-hover)] mx-2 flex-shrink-0" />
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
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20 flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  )
                }
                
                return (
                  <div key={event.id} className="bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-small" style={{ overflow: 'visible' }}>
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
                            <IconTrophy className="w-4 h-4 text-[var(--ds-fg-muted)]" />
                          )
                        })()}
                        <span className="text-xs text-[var(--ds-fg-muted)]">{event.league}</span>
                        <span className="text-xs text-[var(--ds-fg-subtle)]">|</span>
                        <span className="text-xs text-[var(--ds-fg-muted)]">{event.country}</span>
                        <span className="text-xs text-[var(--ds-fg-subtle)]">,</span>
                        <span className="text-xs text-[var(--ds-fg-muted)]">Soccer</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Watch Live clicked for event:', event.id)
                        }}
                        className="text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] transition-colors cursor-pointer"
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
                          <span className="text-[10px] text-[var(--ds-fg-muted)]">1st half</span>
                        </div>
                      )}
                      
                      {/* Teams - Fixed width for alignment */}
                      <div className="flex flex-col gap-1 min-w-0 flex-shrink-0 justify-center w-[140px]">
                        <div className="text-sm font-semibold text-[var(--ds-fg)] truncate leading-tight">{event.team1}</div>
                        <div className="text-sm font-semibold text-[var(--ds-fg)] truncate leading-tight">{event.team2}</div>
                      </div>
                      
                      {/* Score - Fixed width container for alignment across all events */}
                      {event.score && (
                        <div className="flex flex-col items-center justify-center gap-0.5 flex-shrink-0 w-[40px] mx-4">
                          <div className="bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-small px-1.5 py-1.5 w-full">
                            <div className="text-sm font-bold text-[var(--ds-fg)] leading-tight text-center">{event.score.team1}</div>
                            <div className="h-px w-full bg-white/20 my-0.5"></div>
                            <div className="text-sm font-bold text-[var(--ds-fg)] leading-tight text-center">{event.score.team2}</div>
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
              <h2 className="text-sm font-semibold text-[var(--ds-fg-muted)]">TOP BET BOOSTS</h2>
              <Button 
                variant="ghost" 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('View All clicked for Top Bet Boosts')
                }}
                className="text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] cursor-pointer"
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
                      <div className="w-[320px] bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(31, 238, 245, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
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
                            <span className="text-[10px] text-[var(--ds-fg)]">Premier League | England, Soccer</span>
                  </div>
                          <span className="text-[10px] text-[var(--ds-fg)]">{boost.time}</span>
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
                            className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] text-sm font-bold px-4 py-2.5 rounded-small flex-1 transition-colors cursor-pointer"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
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
                            className="bg-[var(--ds-control-hover)] text-[var(--ds-fg)] text-sm font-bold px-4 py-2.5 rounded-small flex-1 transition-colors cursor-pointer"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ds-primary').trim() || '#ee3536'
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
                          <IconInfoCircle className="w-3.5 h-3.5 text-[var(--ds-fg-subtle)] flex-shrink-0 mt-0.5" />
                          <span className="text-[10px] text-[var(--ds-fg-subtle)] leading-tight">
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
            <h2 className="text-sm font-semibold text-[var(--ds-fg-muted)] mb-4">UPCOMING</h2>
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
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20 flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
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
                                <div className="text-[10px] text-[var(--ds-fg-subtle)] mb-1.5 leading-none text-center whitespace-nowrap px-1">{market.title}</div>
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
                                          "text-[var(--ds-fg)] rounded-small w-[68px] h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2 flex-shrink-0",
                                          isSelected 
                                            ? "bg-red-500 hover:bg-red-600" 
                                            : "bg-[var(--ds-control-hover)] hover:bg-white/20"
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
                                        <div className="text-[10px] text-[var(--ds-fg-muted)] leading-none mb-0.5 truncate w-full text-center">{option.label}</div>
                                        <div className="text-xs font-bold leading-none">{option.odds}</div>
                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                              {/* Vertical Divider */}
                              {marketIndex < event.markets.length - 1 && (
                                <div className="w-px h-[32px] bg-[var(--ds-control-hover)] mx-2 flex-shrink-0" />
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
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20 flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
                          style={{ pointerEvents: 'auto' }}
                      >
                          <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                      </button>
                      )}
                    </div>
                  )
                }
                
                return (
                  <div key={event.id} className="bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-small" style={{ overflow: 'visible' }}>
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
                            <IconTrophy className="w-4 h-4 text-[var(--ds-fg-muted)]" />
                          )
                        })()}
                        <span className="text-xs text-[var(--ds-fg-muted)]">{event.league}</span>
                        <span className="text-xs text-[var(--ds-fg-subtle)]">|</span>
                        <span className="text-xs text-[var(--ds-fg-muted)]">{event.country}</span>
                        <span className="text-xs text-[var(--ds-fg-subtle)]">,</span>
                        <span className="text-xs text-[var(--ds-fg-muted)]">Soccer</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Watch Live clicked for event:', event.id)
                        }}
                        className="text-xs text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] transition-colors cursor-pointer"
                      >
                        Watch Live
                      </button>
                    </div>
                    
                    {/* Main Content Row - Single row with Status, Teams, Markets (no score) */}
                    <div className="px-3 py-3 flex items-center gap-4" style={{ overflow: 'visible' }}>
                      {/* Status/Time Badge - Starting in */}
                      <div className="flex flex-col items-start justify-center gap-1 flex-shrink-0 w-[100px]">
                        <div className="flex items-center gap-1 bg-[var(--ds-control-hover)] border border-white/20 rounded px-1.5 py-0.5 whitespace-nowrap">
                          <span className="text-[10px] font-semibold text-[var(--ds-fg-muted)]">Starting in</span>
                  </div>
                        <span className="text-[10px] text-[var(--ds-fg-muted)]">{event.time}</span>
                </div>
                      
                      {/* Teams - Fixed width for alignment */}
                      <div className="flex flex-col gap-1 min-w-0 flex-shrink-0 justify-center w-[140px]">
                        <div className="text-sm font-semibold text-[var(--ds-fg)] truncate leading-tight">{event.team1}</div>
                        <div className="text-sm font-semibold text-[var(--ds-fg)] truncate leading-tight">{event.team2}</div>
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
        
        <SiteFooter />
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
            className="bg-[var(--ds-control-bg)] dark:bg-[var(--ds-control-bg)] bg-gray-100/80 dark:bg-[var(--ds-control-bg)] p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300 backdrop-blur-xl flex items-center"
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
                    : "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] bg-transparent"
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

        

        
        
                </VipHubScrollBody>
                </div>
  )
}

// Tournament data for casino section
const cashTournamentsData = [
  {
    id: 1,
    name: 'Gold Nugget Rush',
    image: '/games/square/goldNuggetRush.png',
    provider: 'Betsoft',
    prizePool: '$15,000',
    gameType: 'Most Points Won',
    rounds: 'Time Based',
    gameId: 14274,
    startDate: new Date('2026-02-09T00:00:00'),
    endDate: new Date('2026-02-16T00:00:00'),
    tag: 'Exclusive' as const,
    betRange: '$0.20 - $10.00',
    leaderboard: [
      { rank: 1, user: 'CryptoKing99', points: 48720, prize: '$5,000' },
      { rank: 2, user: 'SlotMaster', points: 41350, prize: '$3,000' },
      { rank: 3, user: 'LuckyDraw22', points: 38900, prize: '$2,000' },
      { rank: 4, user: 'SpinWizard', points: 35100, prize: '$1,500' },
      { rank: 5, user: 'BetHunter', points: 31200, prize: '$1,000' },
      { rank: 6, user: 'GoldRush_X', points: 28450, prize: '$500' },
      { rank: 7, user: 'NuggetFan', points: 25800, prize: '$500' },
      { rank: 8, user: 'You', points: 22100, prize: '$500', isMe: true },
      { rank: 9, user: 'ReelKing', points: 19700, prize: '$500' },
      { rank: 10, user: 'JackpotJoe', points: 17300, prize: '$500' },
    ],
  },
  {
    id: 2,
    name: 'MEGACRUSH HOLD&WIN',
    image: '/games/square/megacrush.png',
    provider: 'Betsoft',
    prizePool: '$10,000',
    gameType: 'Highest Single Win',
    rounds: 'Spin Based',
    gameId: 15832,
    startDate: new Date('2026-02-12T00:00:00'),
    endDate: new Date('2026-02-18T06:00:00'),
    tag: 'Hot' as const,
    betRange: '$0.50 - $25.00',
    leaderboard: [
      { rank: 1, user: 'MegaWinner', points: 8540, prize: '$3,000' },
      { rank: 2, user: 'CrushPro', points: 7120, prize: '$2,000' },
      { rank: 3, user: 'HoldNWin', points: 6800, prize: '$1,500' },
      { rank: 4, user: 'You', points: 5430, prize: '$1,000', isMe: true },
      { rank: 5, user: 'SlotChamp', points: 4900, prize: '$750' },
      { rank: 6, user: 'BetMax99', points: 4200, prize: '$500' },
      { rank: 7, user: 'SpinElite', points: 3650, prize: '$400' },
      { rank: 8, user: 'WinStreak', points: 3100, prize: '$350' },
      { rank: 9, user: 'RollerHi', points: 2800, prize: '$300' },
      { rank: 10, user: 'CashFlow', points: 2400, prize: '$200' },
    ],
  },
  {
    id: 3,
    name: 'Hooked on Fishing',
    image: '/games/square/hookedOnFishing.png',
    provider: 'Betsoft',
    prizePool: '$25,000',
    gameType: 'Most Points Won',
    rounds: 'Time Based',
    gameId: 16501,
    startDate: new Date('2026-02-10T00:00:00'),
    endDate: new Date('2026-02-20T00:00:00'),
    tag: 'New' as const,
    betRange: '$0.10 - $5.00',
    leaderboard: [
      { rank: 1, user: 'FishKing', points: 92400, prize: '$8,000' },
      { rank: 2, user: 'ReelMaster', points: 85300, prize: '$5,000' },
      { rank: 3, user: 'BigCatch22', points: 78100, prize: '$3,000' },
      { rank: 4, user: 'HookLine', points: 71200, prize: '$2,000' },
      { rank: 5, user: 'DeepSea', points: 65000, prize: '$1,500' },
      { rank: 6, user: 'TideRunner', points: 58700, prize: '$1,000' },
      { rank: 7, user: 'AquaBet', points: 52400, prize: '$1,000' },
      { rank: 8, user: 'WaveRider', points: 46100, prize: '$1,000' },
      { rank: 9, user: 'OceanGold', points: 39800, prize: '$1,000' },
      { rank: 10, user: 'You', points: 33500, prize: '$1,500', isMe: true },
    ],
  },
  {
    id: 4,
    name: 'Mr Mammoth',
    image: '/games/square/mrMammoth.png',
    provider: 'Betsoft',
    prizePool: '$8,000',
    gameType: 'Biggest Win Multiplier',
    rounds: 'Spin Based',
    gameId: 13847,
    startDate: new Date('2026-02-14T00:00:00'),
    endDate: new Date('2026-02-19T12:00:00'),
    tag: 'Exclusive' as const,
    betRange: '$1.00 - $50.00',
    leaderboard: [
      { rank: 1, user: 'MammothMax', points: 1250, prize: '$3,000' },
      { rank: 2, user: 'IceAgeWin', points: 1080, prize: '$2,000' },
      { rank: 3, user: 'You', points: 940, prize: '$1,200', isMe: true },
      { rank: 4, user: 'TuskRider', points: 870, prize: '$800' },
      { rank: 5, user: 'FrostBet', points: 710, prize: '$500' },
      { rank: 6, user: 'GlacierGold', points: 640, prize: '$500' },
    ],
  },
  {
    id: 5,
    name: 'Cocktail Wheel',
    image: '/games/square/cocktailWheel.png',
    provider: 'Betsoft',
    prizePool: '$12,000',
    gameType: 'Most Points Won',
    rounds: 'Time Based',
    gameId: 17203,
    startDate: new Date('2026-02-11T00:00:00'),
    endDate: new Date('2026-02-17T14:00:00'),
    tag: 'Early' as const,
    betRange: '$0.25 - $15.00',
    leaderboard: [
      { rank: 1, user: 'MixMaster', points: 54200, prize: '$4,000' },
      { rank: 2, user: 'ShakerPro', points: 47800, prize: '$2,500' },
      { rank: 3, user: 'CocktailKing', points: 41300, prize: '$1,800' },
      { rank: 4, user: 'SpinShaker', points: 35600, prize: '$1,200' },
      { rank: 5, user: 'You', points: 29400, prize: '$800', isMe: true },
      { rank: 6, user: 'WheelDeal', points: 24100, prize: '$500' },
      { rank: 7, user: 'BarStar', points: 19800, prize: '$400' },
      { rank: 8, user: 'DrinkWin', points: 15500, prize: '$300' },
      { rank: 9, user: 'MartiniMax', points: 11200, prize: '$300' },
      { rank: 10, user: 'OliveGold', points: 7800, prize: '$200' },
    ],
  },
  {
    id: 6,
    name: 'Take The Bank',
    image: '/games/square/takeTheBank.png',
    provider: 'Betsoft',
    prizePool: '$5,000',
    gameType: 'Highest Single Win',
    rounds: 'Spin Based',
    gameId: 12956,
    startDate: new Date('2026-02-14T00:00:00'),
    endDate: new Date('2026-02-21T08:00:00'),
    tag: 'Hot' as const,
    betRange: '$0.50 - $20.00',
    leaderboard: [
      { rank: 1, user: 'BankRobber', points: 4200, prize: '$2,000' },
      { rank: 2, user: 'VaultBreak', points: 3650, prize: '$1,200' },
      { rank: 3, user: 'HeistPro', points: 3100, prize: '$800' },
      { rank: 4, user: 'SafeCrack', points: 2700, prize: '$500' },
      { rank: 5, user: 'You', points: 2300, prize: '$500', isMe: true },
    ],
  },
]

const freerollTournamentsData = [
  {
    id: 101,
    name: 'Gold Nugget Rush',
    image: '/games/square/goldNuggetRush2.png',
    provider: 'Betsoft',
    prizePool: '$1,000',
    gameType: 'Most Points Won',
    rounds: 'Time Based',
    gameId: 14275,
    startDate: new Date('2026-02-10T00:00:00'),
    endDate: new Date('2026-02-17T00:00:00'),
    tag: 'New' as const,
    betRange: '$0.10 - $1.00',
    leaderboard: [
      { rank: 1, user: 'FreeSpinner', points: 32100, prize: '$300' },
      { rank: 2, user: 'NoCostKing', points: 28700, prize: '$200' },
      { rank: 3, user: 'GoldFree', points: 25300, prize: '$150' },
      { rank: 4, user: 'RollMaster', points: 22400, prize: '$100' },
      { rank: 5, user: 'You', points: 19800, prize: '$75', isMe: true },
      { rank: 6, user: 'LuckySpin', points: 16500, prize: '$50' },
      { rank: 7, user: 'ZeroCost', points: 13200, prize: '$50' },
      { rank: 8, user: 'FreeBet99', points: 10100, prize: '$25' },
      { rank: 9, user: 'BonusHunt', points: 7400, prize: '$25' },
      { rank: 10, user: 'WinFree', points: 4900, prize: '$25' },
    ],
  },
  {
    id: 102,
    name: 'Hooked on Fishing',
    image: '/games/square/hookedOnFishing.png',
    provider: 'Betsoft',
    prizePool: '$500',
    gameType: 'Most Points Won',
    rounds: 'Spin Based',
    gameId: 16502,
    startDate: new Date('2026-02-13T00:00:00'),
    endDate: new Date('2026-02-15T00:00:00'),
    tag: 'Hot' as const,
    betRange: '$0.05 - $0.50',
    leaderboard: [
      { rank: 1, user: 'FreeFish', points: 8200, prize: '$150' },
      { rank: 2, user: 'CastAway', points: 7100, prize: '$100' },
      { rank: 3, user: 'You', points: 6300, prize: '$75', isMe: true },
      { rank: 4, user: 'ReelFree', points: 5400, prize: '$50' },
      { rank: 5, user: 'HookFree', points: 4600, prize: '$50' },
      { rank: 6, user: 'TideFree', points: 3800, prize: '$25' },
      { rank: 7, user: 'WaveFree', points: 3000, prize: '$25' },
      { rank: 8, user: 'SeaFree', points: 2200, prize: '$25' },
    ],
  },
  {
    id: 103,
    name: 'MEGACRUSH HOLD&WIN',
    image: '/games/square/megacrush.png',
    provider: 'Betsoft',
    prizePool: '$2,500',
    gameType: 'Biggest Win Multiplier',
    rounds: 'Time Based',
    gameId: 15833,
    startDate: new Date('2026-02-08T00:00:00'),
    endDate: new Date('2026-02-18T00:00:00'),
    tag: 'Exclusive' as const,
    betRange: '$0.10 - $2.00',
    leaderboard: [
      { rank: 1, user: 'CrushFree', points: 52300, prize: '$750' },
      { rank: 2, user: 'MegaFree', points: 46100, prize: '$500' },
      { rank: 3, user: 'HoldFree', points: 40200, prize: '$350' },
      { rank: 4, user: 'WinFreeX', points: 34800, prize: '$250' },
      { rank: 5, user: 'FreeSpin88', points: 29400, prize: '$200' },
      { rank: 6, user: 'You', points: 24100, prize: '$150', isMe: true },
      { rank: 7, user: 'BonusFree', points: 19300, prize: '$100' },
      { rank: 8, user: 'NoPayWin', points: 14600, prize: '$75' },
      { rank: 9, user: 'FreeRoller', points: 10200, prize: '$75' },
      { rank: 10, user: 'ZeroBet', points: 6100, prize: '$50' },
    ],
  },
  {
    id: 104,
    name: 'Mr Mammoth',
    image: '/games/square/mrMammoth.png',
    provider: 'Betsoft',
    prizePool: '$750',
    gameType: 'Highest Single Win',
    rounds: 'Spin Based',
    gameId: 13848,
    startDate: new Date('2026-02-12T00:00:00'),
    endDate: new Date('2026-02-16T04:00:00'),
    tag: 'Early' as const,
    betRange: '$0.05 - $1.00',
    leaderboard: [
      { rank: 1, user: 'MammothFree', points: 5800, prize: '$225' },
      { rank: 2, user: 'IceFree', points: 4900, prize: '$150' },
      { rank: 3, user: 'FrostFree', points: 4100, prize: '$100' },
      { rank: 4, user: 'You', points: 3400, prize: '$75', isMe: true },
      { rank: 5, user: 'TuskFree', points: 2700, prize: '$50' },
      { rank: 6, user: 'FreezeBet', points: 2100, prize: '$50' },
      { rank: 7, user: 'ColdSpin', points: 1500, prize: '$50' },
      { rank: 8, user: 'SnowWin', points: 900, prize: '$50' },
    ],
  },
]

// Countdown timer component for tournament cards — NumberFlow style like Daily Races
function TournamentCountdown({ endDate }: { endDate: Date }) {
  const [d, setD] = useState(0)
  const [h, setH] = useState(0)
  const [m, setM] = useState(0)
  const [s, setS] = useState(0)
  useEffect(() => {
    const tick = () => {
      const diff = endDate.getTime() - Date.now()
      if (diff <= 0) { setD(0); setH(0); setM(0); setS(0); return }
      setD(Math.floor(diff / (1000 * 60 * 60 * 24)))
      setH(Math.floor((diff / (1000 * 60 * 60)) % 24))
      setM(Math.floor((diff / (1000 * 60)) % 60))
      setS(Math.floor((diff / 1000) % 60))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endDate])
  const isExpired = d === 0 && h === 0 && m === 0 && s === 0
  if (isExpired) return <span className="text-xs font-semibold text-red-400">Ended</span>
  return (
    <div className="text-xs font-semibold text-[var(--ds-fg-muted)] flex items-center tabular-nums">
      <NumberFlow value={d} format={{ minimumIntegerDigits: 2 }} /><span className="text-white/20 mx-0.5">:</span>
      <NumberFlow value={h} format={{ minimumIntegerDigits: 2 }} /><span className="text-white/20 mx-0.5">:</span>
      <NumberFlow value={m} format={{ minimumIntegerDigits: 2 }} /><span className="text-white/20 mx-0.5">:</span>
      <NumberFlow value={s} format={{ minimumIntegerDigits: 2 }} />
              </div>
  )
}

// =====================================================
// POKER LANDING PAGE COMPONENT
// =====================================================
type PokerNavigateOptions = { promoTab?: string }

function PokerLandingPage({ brandPrimary, quickLinksOpen, onNavigate, menuLoading = false, hideSidebar = false }: { brandPrimary: string; quickLinksOpen?: boolean; onNavigate?: (page: 'home' | 'sports' | 'casino' | 'liveCasino' | 'poker' | 'vipRewards', options?: PokerNavigateOptions) => void; menuLoading?: boolean; hideSidebar?: boolean }) {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { state: sidebarState, toggleSidebar, setOpenMobile } = useSidebar()
  const [activeSidebarItem, setActiveSidebarItem] = useState('Start')
  const {
    ref: heroSpotlightRef,
    handleMouseMove: handleHeroMouseMove,
    handleMouseLeave: handleHeroMouseLeave,
    spotlightSurfaceStyle: heroSpotlightStyle,
  } = useCursorSpotlight()

  // Top "PLAY NOW" feature items (like sports FEATURES)
  const pokerPlayNow = [
    { icon: IconPlayerPlay, label: 'Play Online', sectionId: 'poker-hero' },
    { icon: IconDownload, label: 'Download', sectionId: 'poker-download' },
  ]

  // Main POKER nav — deep links into one-pager sections
  const pokerNavItems = [
    { icon: IconCards, label: 'Start', sectionId: 'poker-hero' },
    { icon: IconSparkles, label: 'Features', sectionId: 'poker-features' },
    { icon: IconRocket, label: 'Getting Started', sectionId: 'poker-getting-started' },
    { icon: IconShield, label: 'Integrity', sectionId: 'poker-integrity' },
    { icon: IconGift, label: 'Promotions', external: true as const },
  ]

  const scrollToSection = (sectionId: string, label: string) => {
    if (label === 'Play Online') {
      setActiveSidebarItem('Start')
      launchPokerApp()
      if (isMobile) setOpenMobile(false)
      return
    }
    setActiveSidebarItem(label)
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (isMobile) setOpenMobile(false)
  }

  // Keep left nav in sync with the section currently in view
  useEffect(() => {
    const sections = [
      { id: 'poker-hero', label: 'Start' },
      { id: 'poker-features', label: 'Features' },
      { id: 'poker-getting-started', label: 'Getting Started' },
      { id: 'poker-integrity', label: 'Integrity' },
      { id: 'poker-download', label: 'Download' },
    ] as const

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let bestId: string | null = null
        let bestRatio = 0
        for (const { id } of sections) {
          const ratio = ratios.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }
        if (!bestId || bestRatio <= 0) return
        const match = sections.find((s) => s.id === bestId)
        if (match) setActiveSidebarItem(match.label)
      },
      {
        // Activate when a section crosses the upper-middle band of the viewport
        rootMargin: '-15% 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    for (const { id } of sections) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const gettingStartedSteps = [
    {
      title: 'Create Account',
      description:
        'Select Create Account from the poker software or Join Now on the website and follow the on screen instructions.',
      cta: 'Sign Up Now',
    },
    {
      title: 'Deposit and Claim Bonus',
      description:
        'When the cashier loads enter your preferred deposit method and amount along with your chosen Poker Promotional Code.',
      cta: 'Deposit Promotions',
    },
    {
      title: 'Login to the Poker App',
      description:
        'Download and install the poker software or click Play Now to use the HTML version, then login with your newly created account.',
      cta: 'Download Now',
    },
    {
      title: 'Create Nickname',
      description:
        'Select your preferred nickname. This is how you will be seen at the poker tables and cannot be changed, so choose carefully.',
      cta: 'Play Online',
    },
    {
      title: 'Transfer Funds and Play!',
      description:
        'Click on Cashier and transfer your funds to your poker wallet, select your game of choice, and good luck at the tables.',
      cta: 'How to Transfer',
    },
  ]

  const integrityTopics = [
    {
      title: 'Combatting Bot Usage',
      body: 'Automated programs have no place at our tables. We continuously monitor play patterns to detect and remove bots.',
    },
    {
      title: 'Preventing Collusion',
      body: 'Secret cooperation between players is actively surveilled. Suspicious rings are investigated and actioned.',
    },
    {
      title: 'Tournament Integrity Checks',
      body: 'Major tournament results are reviewed so prize pools go to players who earned them fairly.',
    },
    {
      title: 'Addressing Multi-Accounting',
      body: 'We detect and address players attempting to gain an edge through multiple accounts.',
    },
    {
      title: 'Seating Scripts: Ensuring Equal Opportunity',
      body: 'Automated table-joining scripts are monitored and blocked so every player gets a fair shot at open seats.',
    },
    {
      title: 'Empowering Players through Reporting',
      body: (
        <>
          See something off? Report it to{' '}
          <a
            href="mailto:gameintegrity@chicopokernetwork.com"
            className="text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
          >
            gameintegrity@chicopokernetwork.com
          </a>
          .
        </>
      ),
    },
  ]

  const topFeatures = [
    {
      title: 'All-In Cash Out',
      description: 'Purchase the equity of your hand at any point before the river and protect your winning hands.',
      image: '/banners/poker/all in cash out.png',
    },
    {
      title: 'Throwables',
      description: 'Fun interactive way to express yourself at the tables.',
      image: '/banners/poker/throwables.webp',
    },
    {
      title: 'Straddle',
      description: 'Bigger pots and a competitive edge in cash games.',
      image: '/banners/poker/straddle.png',
    },
    {
      title: 'Bomb Pot Discard',
      description: 'Five-handed bomb pot discard for players who love big pots and bold plays.',
      image: '/banners/poker/bomb_pots.png',
    },
    {
      title: 'Heads-Up Display',
      description: 'Key table stats in an easy-to-use HUD overlay.',
      image: '/banners/poker/heads up.webp',
    },
    {
      title: 'Triple Threat Tournaments',
      description: 'Three ways to cash in every game.',
      image: '/banners/poker/tripple threat.png',
    },
  ] as const

  return (
    <div className="flex w-full min-h-screen bg-[var(--ds-page-bg)]" data-sidebar-full-height>
      {/* Poker Sidebar — desktop only when parent keeps mobile drawer mounted */}
      {!hideSidebar && (
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        mobileOverlay
        mobileNoDrag
        mobileBg="#2d2d2d"
        mobileOverlayClassName="!bg-black/30 !backdrop-blur-sm"
        className="!bg-[var(--ds-surface-raised)] border-r border-[var(--ds-border)] text-[var(--ds-fg)] [&>div]:!bg-[var(--ds-surface-raised)] !h-screen !top-0 !z-[102]"
      >
        {/* Sidebar Header — sticky, clean */}
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
              ].map((item) => {
                const isCurrentPage = item.page === 'poker'
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      // Keep drawer open when switching products; only leave for Sports route.
                      if (item.page === 'sports') {
                        handoffMobileSidebarToNextPage()
                        router.push('/sports/football')
                        return
                      }
                      if (item.page === 'home') {
                        setOpenMobile(false)
                        router.push('/')
                        return
                      }
                      if (onNavigate) {
                        onNavigate(item.page as any)
                      }
                    }}
                    className={cn(
                      "flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative",
                      isCurrentPage 
                        ? "text-[var(--ds-fg)] font-bold" 
                        : "text-white/35 font-medium hover:text-[var(--ds-fg-muted)]"
                    )}
                  >
                    {item.label}
                    {isCurrentPage && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }} />
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
            {menuLoading ? (
              <MobileSidebarMenuSkeleton />
            ) : (
            <>
            <SidebarPromos
              collapsed={sidebarState === 'collapsed' && !isMobile}
            />
            <Separator className="bg-[var(--ds-control-hover)] mx-2 group-data-[collapsible=icon]:hidden" />
            {/* Poker Menu section — square icon style like sports FEATURES */}
            <SidebarGroup className="mt-3">
              {isMobile && <SidebarGroupLabel className="px-2 py-1 text-xs text-[var(--ds-fg-subtle)]">POKER MENU</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {pokerPlayNow.map((item, index) => {
                    const Icon = item.icon
                    // Play Online is a CTA only — never show as the active nav item
                    const isActive =
                      item.label !== 'Play Online' && activeSidebarItem === item.label
                    return (
                      <SidebarMenuItem key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                scrollToSection(item.sectionId, item.label)
                              }}
                              className={cn(
                                "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                "data-[active=true]:text-white data-[active=true]:font-medium",
                                "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                              )}
                              style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                            >
                              <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", isActive ? "bg-white/20" : "bg-[var(--ds-control-hover)]")}>
                                <Icon strokeWidth={1.5} className="w-4 h-4" />
                </div>
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

            <Separator className="bg-[var(--ds-control-hover)] mx-2" />

            {/* POKER nav items */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {pokerNavItems.map((item, index) => {
                    const Icon = item.icon
                    const isExternal = 'external' in item && item.external
                    const isActive = !isExternal && activeSidebarItem === item.label
                    return (
                      <SidebarMenuItem key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (isExternal) {
                                  if (isMobile) setOpenMobile(false)
                                  // Deep-link into Promotions → Poker sub-nav
                                  onNavigate?.('vipRewards', { promoTab: 'Poker' })
                                  return
                                }
                                if ('sectionId' in item && item.sectionId) {
                                  scrollToSection(item.sectionId, item.label)
                                }
                              }}
                              className={cn(
                                "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                isExternal
                                  ? "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                  : "data-[active=true]:text-white data-[active=true]:font-medium data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                              )}
                              style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                            >
                              <Icon strokeWidth={1.5} className="w-5 h-5" />
                              <span className={cn(isExternal && 'flex-1 text-left')}>{item.label}</span>
                              {isExternal ? (
                                <IconLogin2
                                  strokeWidth={1.5}
                                  className="ml-auto h-4 w-4 shrink-0 opacity-50"
                                />
                              ) : null}
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
            </>
            )}
          </TooltipProvider>
          {/* Spacer for Safari bottom bar on mobile */}
          {isMobile && <div className="flex-shrink-0 h-24" />}
        </SidebarContent>
      </Sidebar>
      )}

      {/* Main Content */}
      <SidebarInset className="bg-[var(--ds-page-bg)] text-[var(--ds-fg)]" style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}>
        <div className="flex flex-col">

          {/* HERO — Figma app-integration-10: inset card, pl/py 56, art flush right/bottom */}
          <section id="poker-hero" className="relative scroll-mt-20 w-full px-3 pt-4 pb-8 sm:px-4 md:px-7 md:pt-8 md:pb-12">
            <div
              ref={heroSpotlightRef}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              style={heroSpotlightStyle}
              className="relative w-full overflow-hidden rounded-2xl bg-[#222] md:rounded-3xl"
            >
              <SpotlightOverlay radiusPx={320} mixPercent={22} />
              <div className="relative z-[2] flex min-h-0 flex-col md:min-h-[470px] md:flex-row md:items-stretch">
                {/* Copy + CTAs */}
                <div className="relative z-10 flex w-full flex-col gap-6 px-4 py-8 text-center sm:px-6 md:w-[min(100%,560px)] md:shrink-0 md:items-start md:gap-6 md:py-14 md:pl-14 md:pr-0 md:text-left">
                  <h1 className="w-full text-[1.75rem] font-bold leading-tight text-white sm:text-3xl md:text-[48px] md:leading-[1.15]">
                    <span className="block">The BetOnline</span>
                    <span className="block">Poker Platform</span>
                  </h1>
                  <p className="mx-auto max-w-md text-sm leading-6 text-white/60 md:mx-0 md:max-w-none md:text-base">
                    Play online or download the BetOnline poker app today, available on iOS, PC, and Android.
                  </p>

                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:w-auto md:justify-start">
                    <Button
                      className="h-10 w-full rounded-lg border-0 px-6 text-sm font-medium text-white sm:w-auto"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                      onClick={() => launchPokerApp()}
                    >
                      Play Online
                    </Button>
                  </div>

                  <Separator className="hidden w-full bg-white/[0.08] md:block" />

                  <div className="flex w-full flex-row gap-2 md:gap-3">
                    {[
                      { src: '/banners/poker/platforms/apple.svg', label: 'iOS', alt: 'Apple' },
                      { src: '/banners/poker/platforms/windows.svg', label: 'Windows', alt: 'Windows' },
                      { src: '/banners/poker/platforms/android.svg', label: 'Android', alt: 'Android' },
                    ].map((platform) => (
                      <button
                        key={platform.label}
                        type="button"
                        className="inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-2 py-2 text-left transition-colors hover:bg-white/[0.08] sm:gap-2 sm:px-3 sm:py-2.5 md:flex-none"
                      >
                        <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden sm:size-8">
                          <Image
                            src={platform.src}
                            alt={platform.alt}
                            width={32}
                            height={32}
                            className="size-full object-contain"
                            unoptimized
                          />
                        </span>
                        <span className="min-w-0 leading-none">
                          <span className="block truncate text-[9px] leading-[12px] text-white/60 sm:text-[10px] sm:leading-[14px]">
                            Download for
                          </span>
                          <span className="block truncate text-xs font-semibold leading-4 text-white sm:text-sm sm:leading-5">
                            {platform.label}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Art — mobile stacked; desktop fills right side, flush to edges */}
                <div className="relative aspect-[5/4] w-full md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[min(58%,720px)]">
                  <Image
                    src="/banners/poker/pro-blocks/marketing-ui/app-integration/block-heading/Container.png"
                    alt="BetOnline Poker"
                    fill
                    className="object-contain object-bottom md:object-contain md:object-right-bottom"
                    priority
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                </div>
              </div>
            </div>
          </section>


          {/* OUR TOP FEATURES — Bento grid */}
          <section id="poker-features" className="scroll-mt-20 py-12 bg-white/[0.02]">
            <div className="px-4 md:px-6 text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--ds-fg)] mb-2">Our Top Features</h2>
              <p className="text-sm text-[var(--ds-fg-subtle)] max-w-lg mx-auto">
                Some of the features available. Play Now or Download our poker software to try them out.
              </p>
            </div>
            <div className="mx-auto w-full px-3 md:px-6">
              <div className="mx-auto grid w-full max-w-full grid-cols-1 gap-3 sm:w-fit sm:grid-cols-2 sm:justify-items-center md:grid-cols-3 md:gap-4">
                {topFeatures.map((feature) => (
                  <article
                    key={feature.title}
                    className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141414] transition-colors duration-200 hover:border-white/[0.1] hover:bg-[#1e1e1e] sm:w-[260px] md:w-[300px]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#101010]">
                      <div className="absolute inset-0 -right-[20px]">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-cover object-right transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 260px, 300px"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent transition-colors duration-200 group-hover:from-[#1e1e1e] group-hover:via-[#1e1e1e]/25" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-1.5 p-4 pt-3 sm:p-5">
                      <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-white/55 line-clamp-3">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* GETTING STARTED */}
          <section id="poker-getting-started" className="scroll-mt-20 px-4 md:px-6 py-12">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--ds-fg)] mb-2">Getting Started</h2>
                <p className="text-sm text-[var(--ds-fg-subtle)] max-w-xl mx-auto">
                  Five quick steps from sign-up to your first hand at the tables.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {gettingStartedSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex flex-col gap-4 rounded-xl bg-[var(--ds-overlay)] px-4 py-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5"
                  >
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-[var(--ds-fg)]">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--ds-fg-subtle)]">{step.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="h-10 shrink-0 rounded-small border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-[var(--ds-fg)] hover:bg-white/[0.08] sm:self-center"
                      onClick={() => {
                        if (step.cta === 'Sign Up Now') requestLogin()
                        if (step.cta === 'Download Now') scrollToSection('poker-download', 'Download')
                        if (step.cta === 'Play Online') launchPokerApp()
                      }}
                    >
                      {step.cta}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* GAME INTEGRITY */}
          <section id="poker-integrity" className="scroll-mt-20 px-4 md:px-6 py-12 bg-white/[0.02]">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--ds-fg)] mb-2">
                  Ensuring a Fair and Trustworthy Poker Experience
                </h2>
                <p className="text-sm text-[var(--ds-fg-subtle)] max-w-2xl mx-auto">
                  Our Game Integrity team protects every table so you can focus on the cards in front of you.
                </p>
              </div>

              <div className="relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#1a1a1a]">
                <Image
                  src="/banners/poker/poker_topimage.jpg"
                  alt="BetOnline poker gameplay"
                  fill
                  className="object-cover object-center opacity-90"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl text-white shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                  aria-label="Play integrity video"
                >
                  <IconPlayerPlay className="size-7 fill-white" strokeWidth={0} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                {integrityTopics.map((topic) => (
                  <div key={topic.title} className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold text-[var(--ds-fg)]">{topic.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--ds-fg-subtle)]">{topic.body}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm leading-relaxed text-[var(--ds-fg-subtle)] text-center max-w-3xl mx-auto">
                From bots and collusion to multi-accounting and seating scripts, our integrity systems work around the clock so every pot is earned the right way.
              </p>

              <div className="mt-8 flex justify-center">
                <Button className="text-white font-semibold text-sm px-10 py-3 h-11 rounded-small" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>
                  Poker Help Center
                </Button>
              </div>
            </div>
          </section>

          {/* DOWNLOAD SECTION */}
          <section id="poker-download" className="scroll-mt-20 px-4 md:px-6 py-12">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--ds-fg)] mb-3">Download Our Poker App</h2>
              <p className="text-sm text-[var(--ds-fg-subtle)] mb-8 max-w-lg mx-auto">
                Available on all major platforms. Get the best poker experience on any device.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { src: '/banners/poker/platforms/apple.svg', label: 'iOS', sublabel: 'App Store' },
                  { src: '/banners/poker/platforms/windows.svg', label: 'Windows', sublabel: 'Desktop' },
                  { src: '/banners/poker/platforms/android.svg', label: 'Android', sublabel: 'Google Play' },
                ].map((platform) => (
                  <button
                    key={platform.label}
                    type="button"
                    className="flex items-center gap-3 rounded-lg bg-[var(--ds-overlay)] px-5 py-3 transition-colors hover:bg-white/[0.08]"
                  >
                    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden">
                      <Image
                        src={platform.src}
                        alt={platform.label}
                        width={32}
                        height={32}
                        className="h-full w-full object-contain"
                        unoptimized
                      />
                    </span>
                    <div className="text-left">
                      <div className="text-[10px] text-[var(--ds-fg-subtle)] uppercase tracking-wide">{platform.sublabel}</div>
                      <div className="text-sm font-semibold text-[var(--ds-fg)]">{platform.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <SiteFooter className="mt-0" />

        </div>
      </SidebarInset>
    </div>
  )
}

function NavTestPageContent() {
  const CASINO_FEATURE_TOUR_KEY = 'bol-casino-feature-tour-v1'
  const isMobile = useIsMobile()
  const router = useRouter()
  useJackpotTicker()
  const jackpotFeedInsertAt = useJackpotPreviewGameCount(isMobile)
  const jackpotOptedIn = useJackpotStore((s) => s.optedIn)
  const { trackNav, trackClick, trackAction, trackSidebar, trackPageView } = useTracking('casino')
  const [activeFilter, setActiveFilter] = useState('Lobby')
  const [activeSubNav, _setActiveSubNav] = useState('Lobby')
  // Wrapper: fire page_view for sub-nav so journey map shows Casino → Slots → Live etc.
  const setActiveSubNav = useCallback((val: string) => {
    _setActiveSubNav((prev: string) => {
      if (val && val !== prev) {
        // Map sub-nav to a trackable page_view target
        const target = `casino/${val.toLowerCase().replace(/\s+/g, '-')}`
        trackPageView(target, val)
      }
      return val
    })
  }, [trackPageView])
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
  const [casinoFeatureTourOpen, setCasinoFeatureTourOpen] = useState(false)

  useEffect(() => {
    const handleProfitBoostOptInToggled = (evt: Event) => {
      const detail = (evt as CustomEvent<{ optedIn?: boolean }>).detail
      if (!detail?.optedIn) return
      playSound('button-click')
      toast.info('Profit Boost opted in. Odds boost activates after $50 risk on Premier League.', {
        id: 'bol-profit-boost-optin',
        duration: 2200,
      })
    }
    window.addEventListener('profit-boost-optin-toggled', handleProfitBoostOptInToggled as EventListener)
    return () => window.removeEventListener('profit-boost-optin-toggled', handleProfitBoostOptInToggled as EventListener)
  }, [])

  
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false)
  const [vipDrawerOpen, setVipDrawerOpen] = useState(false)
  const [hubFocusMode, setHubFocusMode] = useState(false)
  const [accountDrawerView, setAccountDrawerView] = useState<'account' | 'notifications'>('account')
  const webInboxUnreadCount = 2

  const completeCasinoFeatureTour = useCallback(() => {
    setCasinoFeatureTourOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CASINO_FEATURE_TOUR_KEY, 'seen')
    }
  }, [CASINO_FEATURE_TOUR_KEY])

  const handleCasinoTourOpenChange = useCallback((open: boolean) => {
    setCasinoFeatureTourOpen(open)
    if (!open && typeof window !== 'undefined') {
      window.localStorage.setItem(CASINO_FEATURE_TOUR_KEY, 'seen')
    }
  }, [CASINO_FEATURE_TOUR_KEY])

  // ─── Product visibility (from Design Customizer brand toggles) ───
  const ALL_ON: ProductToggles = { sports: true, liveBetting: true, casino: true, liveCasino: true, poker: true, vipRewards: true }
  const [visibleProducts, setVisibleProducts] = useState<ProductToggles>(ALL_ON)

  useEffect(() => {
    // Load persisted product visibility for the current active brand
    try {
      const brandId = localStorage.getItem('__ds-active-brand') || 'betonline'
      const overrides = JSON.parse(localStorage.getItem('__ds-brand-products') || '{}')
      if (overrides[brandId]) {
        setVisibleProducts(overrides[brandId])
      }
    } catch { /* ignore */ }

    // Listen for live product toggle changes from the Design Customizer
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as ProductToggles
      if (detail) setVisibleProducts(detail)
    }
    window.addEventListener('brand:products-changed', handler)
    return () => window.removeEventListener('brand:products-changed', handler)
  }, [])

  // Mutual exclusion helpers — only one drawer open at a time
  const openAccountDrawer = useCallback(() => {
    if (accountDrawerOpen) {
      setAccountDrawerOpen(false)
      return
    }
    trackClick('account-drawer', 'My Account')
    trackPageView('account-drawer', 'My Account Drawer')
    setVipDrawerOpen(false)
    setDepositDrawerOpen(false)
    setAccountDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [accountDrawerOpen, trackClick, trackPageView])
  const openVipDrawer = useCallback(() => {
    if (vipDrawerOpen) {
      setVipDrawerOpen(false)
      return
    }
    trackClick('vip-hub', 'VIP')
    trackPageView('vip-hub', 'VIP Hub Drawer')
    setAccountDrawerOpen(false)
    setDepositDrawerOpen(false)
    setVipDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [vipDrawerOpen, trackClick, trackPageView])

  // Listen for the global VIP Hub open event so sub-component nav handlers
  // can launch the drawer without needing to thread `openVipDrawer` down
  // through props.
  useEffect(() => {
    const handler = (evt: Event) => {
      const detail = (evt as CustomEvent<{ tab?: string; focusRewardId?: string }>).detail
      const keepOpen = Boolean(detail?.tab || detail?.focusRewardId)
      setVipDrawerOpen((open) => {
        if (open && !keepOpen) return false
        queueMicrotask(() => {
          setAccountDrawerOpen(false)
          setDepositDrawerOpen(false)
          useChatStore.getState().setIsOpen(false)
          if (detail?.tab) setVipActiveTab(detail.tab)
          else if (detail?.focusRewardId) setVipActiveTab('VIP')
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
    trackPageView('deposit-drawer', 'Deposit Drawer')
    setAccountDrawerOpen(false)
    setVipDrawerOpen(false)
    setDepositDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [depositDrawerOpen, trackClick, trackPageView])

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


  const [vipActiveTab, setVipActiveTab] = useState('VIP')
  const vipTabsContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollVipLeft, setCanScrollVipLeft] = useState(false)
  const [canScrollVipRight, setCanScrollVipRight] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [showAllGames, setShowAllGames] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedVendor, setSelectedVendor] = useState<string>('')
  const [showSports, setShowSports] = useState(false) // Always false for casino page
  const [showVipRewards, _setShowVipRewards] = useState(false)
  const [showPoker, _setShowPoker] = useState(false)
  // Wrapper setters that fire page_view events for session flow tracking
  const setShowVipRewards = useCallback((val: boolean) => {
    _setShowVipRewards(val)
    if (val) trackPageView('promotions', 'Promotions')
  }, [trackPageView])
  const setShowPoker = useCallback((val: boolean) => {
    _setShowPoker(val)
    if (val) trackPageView('poker', 'Poker')
  }, [trackPageView])
  const [tournamentTab, setTournamentTab] = useState<'cash' | 'freeroll'>('cash')
  const [tournamentExpandedCard, setTournamentExpandedCard] = useState<number | null>(null)
  const [leaderboardTournament, setLeaderboardTournament] = useState<typeof cashTournamentsData[0] | null>(null)
  const [initialVipSidebarItem, setInitialVipSidebarItem] = useState<string | null>(null)
  const [vipActiveSidebarItem, setVipActiveSidebarItem] = useState<string>('Promos')
  /** Promos page category sub-nav: Deposit Bonus | Sports | Casino | Poker */
  const [promosActiveTab, setPromosActiveTab] = useState('Deposit Bonus')
  
  // Sync initialVipSidebarItem -> vipActiveSidebarItem
  useEffect(() => {
    if (initialVipSidebarItem) {
      // Cash Races removed from Promotions nav
      const next =
        initialVipSidebarItem === 'Cash Races' ? 'Promos' : initialVipSidebarItem
      setVipActiveSidebarItem?.(next)
      setTimeout(() => setInitialVipSidebarItem(null), 100)
    }
  }, [initialVipSidebarItem])

  // Migrate any stale Cash Races / Challenges / Raffles selection off Promotions
  useEffect(() => {
    if (
      vipActiveSidebarItem === 'Cash Races' ||
      vipActiveSidebarItem === 'Challenges' ||
      vipActiveSidebarItem === 'Raffles'
    ) {
      setVipActiveSidebarItem('Promos')
    }
  }, [vipActiveSidebarItem])
  const [previousPageState, setPreviousPageState] = useState<{ showSports: boolean; showVipRewards: boolean; showPoker?: boolean; activeSubNav?: string } | null>(null)
  const [sportsActiveTab, setSportsActiveTab] = useState('Events')
  
  // Carousel API states for Live Casino sections
  const [blackjackCarouselApi, setBlackjackCarouselApi] = useState<CarouselApi>()
  const [blackjackCanScrollPrev, setBlackjackCanScrollPrev] = useState(false)
  const [blackjackCanScrollNext, setBlackjackCanScrollNext] = useState(false)
  const [blackjackCurrentIndex, setBlackjackCurrentIndex] = useState(0)
  
  const [rouletteCarouselApi, setRouletteCarouselApi] = useState<CarouselApi>()
  const [rouletteCanScrollPrev, setRouletteCanScrollPrev] = useState(false)
  const [rouletteCanScrollNext, setRouletteCanScrollNext] = useState(false)
  const [rouletteCurrentIndex, setRouletteCurrentIndex] = useState(0)
  
  const [baccaratCarouselApi, setBaccaratCarouselApi] = useState<CarouselApi>()
  const [baccaratCanScrollPrev, setBaccaratCanScrollPrev] = useState(false)
  const [baccaratCanScrollNext, setBaccaratCanScrollNext] = useState(false)
  const [baccaratCurrentIndex, setBaccaratCurrentIndex] = useState(0)
  
  const [slotsCarouselApi, setSlotsCarouselApi] = useState<CarouselApi>()
  const [slotsCanScrollPrev, setSlotsCanScrollPrev] = useState(false)
  const [slotsCanScrollNext, setSlotsCanScrollNext] = useState(false)
  const [slotsCurrentIndex, setSlotsCurrentIndex] = useState(0)
  
  const [originalsCarouselApi, setOriginalsCarouselApi] = useState<CarouselApi>()
  const [originalsCanScrollPrev, setOriginalsCanScrollPrev] = useState(false)
  const [originalsCanScrollNext, setOriginalsCanScrollNext] = useState(false)
  const [originalsCurrentIndex, setOriginalsCurrentIndex] = useState(0)
  
  const [casinoPokerCarouselApi, setCasinoPokerCarouselApi] = useState<CarouselApi>()
  const [casinoPokerCanScrollPrev, setCasinoPokerCanScrollPrev] = useState(false)
  const [casinoPokerCanScrollNext, setCasinoPokerCanScrollNext] = useState(false)
  const [casinoPokerCurrentIndex, setCasinoPokerCurrentIndex] = useState(0)
  
  const [vipCarouselApi, setVipCarouselApi] = useState<CarouselApi>()
  const [vipCanScrollPrev, setVipCanScrollPrev] = useState(false)
  const [vipCanScrollNext, setVipCanScrollNext] = useState(false)
  
  // Lobby tab carousels
  const [forYouBlackjackCarouselApi, setForYouBlackjackCarouselApi] = useState<CarouselApi>()
  const [forYouBlackjackCanScrollPrev, setForYouBlackjackCanScrollPrev] = useState(false)
  const [forYouBlackjackCanScrollNext, setForYouBlackjackCanScrollNext] = useState(false)
  const [forYouBlackjackCurrentIndex, setForYouBlackjackCurrentIndex] = useState(0)

  const [forYouSlotsCarouselApi, setForYouSlotsCarouselApi] = useState<CarouselApi>()
  const [forYouSlotsCanScrollPrev, setForYouSlotsCanScrollPrev] = useState(false)
  const [forYouSlotsCanScrollNext, setForYouSlotsCanScrollNext] = useState(false)
  const [forYouSlotsCurrentIndex, setForYouSlotsCurrentIndex] = useState(0)
  
  const [forYouBaccaratCarouselApi, setForYouBaccaratCarouselApi] = useState<CarouselApi>()
  const [forYouBaccaratCanScrollPrev, setForYouBaccaratCanScrollPrev] = useState(false)
  const [forYouBaccaratCanScrollNext, setForYouBaccaratCanScrollNext] = useState(false)
  const [forYouBaccaratCurrentIndex, setForYouBaccaratCurrentIndex] = useState(0)

  const [popularCarouselApi, setPopularCarouselApi] = useState<CarouselApi>()
  const [popularCanScrollPrev, setPopularCanScrollPrev] = useState(false)
  const [popularCanScrollNext, setPopularCanScrollNext] = useState(false)

  const [exclusivesCarouselApi, setExclusivesCarouselApi] = useState<CarouselApi>()
  const [exclusivesCanScrollPrev, setExclusivesCanScrollPrev] = useState(false)
  const [exclusivesCanScrollNext, setExclusivesCanScrollNext] = useState(false)

  const [crashCarouselApi, setCrashCarouselApi] = useState<CarouselApi>()
  const [crashCanScrollPrev, setCrashCanScrollPrev] = useState(false)
  const [crashCanScrollNext, setCrashCanScrollNext] = useState(false)

  const [instantCarouselApi, setInstantCarouselApi] = useState<CarouselApi>()
  const [instantCanScrollPrev, setInstantCanScrollPrev] = useState(false)
  const [instantCanScrollNext, setInstantCanScrollNext] = useState(false)

  const [tournamentCarouselApi, setTournamentCarouselApi] = useState<CarouselApi>()
  const [tournamentCanScrollPrev, setTournamentCanScrollPrev] = useState(false)
  const [tournamentCanScrollNext, setTournamentCanScrollNext] = useState(false)
  
  // Set up carousel scroll state watchers
  useEffect(() => {
    if (!blackjackCarouselApi) return
    setBlackjackCanScrollPrev(blackjackCarouselApi.canScrollPrev())
    setBlackjackCanScrollNext(blackjackCarouselApi.canScrollNext())
    setBlackjackCurrentIndex(blackjackCarouselApi.selectedScrollSnap())
    blackjackCarouselApi.on('select', () => {
      setBlackjackCanScrollPrev(blackjackCarouselApi.canScrollPrev())
      setBlackjackCanScrollNext(blackjackCarouselApi.canScrollNext())
      setBlackjackCurrentIndex(blackjackCarouselApi.selectedScrollSnap())
    })
  }, [blackjackCarouselApi])
  
  useEffect(() => {
    if (!rouletteCarouselApi) return
    setRouletteCanScrollPrev(rouletteCarouselApi.canScrollPrev())
    setRouletteCanScrollNext(rouletteCarouselApi.canScrollNext())
    setRouletteCurrentIndex(rouletteCarouselApi.selectedScrollSnap())
    rouletteCarouselApi.on('select', () => {
      setRouletteCanScrollPrev(rouletteCarouselApi.canScrollPrev())
      setRouletteCanScrollNext(rouletteCarouselApi.canScrollNext())
      setRouletteCurrentIndex(rouletteCarouselApi.selectedScrollSnap())
    })
  }, [rouletteCarouselApi])
  
  useEffect(() => {
    if (!baccaratCarouselApi) return
    setBaccaratCanScrollPrev(baccaratCarouselApi.canScrollPrev())
    setBaccaratCanScrollNext(baccaratCarouselApi.canScrollNext())
    setBaccaratCurrentIndex(baccaratCarouselApi.selectedScrollSnap())
    baccaratCarouselApi.on('select', () => {
      setBaccaratCanScrollPrev(baccaratCarouselApi.canScrollPrev())
      setBaccaratCanScrollNext(baccaratCarouselApi.canScrollNext())
      setBaccaratCurrentIndex(baccaratCarouselApi.selectedScrollSnap())
    })
  }, [baccaratCarouselApi])
  
  useEffect(() => {
    if (!slotsCarouselApi) return
    setSlotsCanScrollPrev(slotsCarouselApi.canScrollPrev())
    setSlotsCanScrollNext(slotsCarouselApi.canScrollNext())
    setSlotsCurrentIndex(slotsCarouselApi.selectedScrollSnap())
    slotsCarouselApi.on('select', () => {
      setSlotsCanScrollPrev(slotsCarouselApi.canScrollPrev())
      setSlotsCanScrollNext(slotsCarouselApi.canScrollNext())
      setSlotsCurrentIndex(slotsCarouselApi.selectedScrollSnap())
    })
  }, [slotsCarouselApi])
  
  useEffect(() => {
    if (!originalsCarouselApi) return
    setOriginalsCanScrollPrev(originalsCarouselApi.canScrollPrev())
    setOriginalsCanScrollNext(originalsCarouselApi.canScrollNext())
    setOriginalsCurrentIndex(originalsCarouselApi.selectedScrollSnap())
    originalsCarouselApi.on('select', () => {
      setOriginalsCanScrollPrev(originalsCarouselApi.canScrollPrev())
      setOriginalsCanScrollNext(originalsCarouselApi.canScrollNext())
      setOriginalsCurrentIndex(originalsCarouselApi.selectedScrollSnap())
    })
  }, [originalsCarouselApi])
  
  useEffect(() => {
    if (!casinoPokerCarouselApi) return
    setCasinoPokerCanScrollPrev(casinoPokerCarouselApi.canScrollPrev())
    setCasinoPokerCanScrollNext(casinoPokerCarouselApi.canScrollNext())
    setCasinoPokerCurrentIndex(casinoPokerCarouselApi.selectedScrollSnap())
    casinoPokerCarouselApi.on('select', () => {
      setCasinoPokerCanScrollPrev(casinoPokerCarouselApi.canScrollPrev())
      setCasinoPokerCanScrollNext(casinoPokerCarouselApi.canScrollNext())
      setCasinoPokerCurrentIndex(casinoPokerCarouselApi.selectedScrollSnap())
    })
  }, [casinoPokerCarouselApi])
  
  useEffect(() => {
    if (!vipCarouselApi) return
    setVipCanScrollPrev(vipCarouselApi.canScrollPrev())
    setVipCanScrollNext(vipCarouselApi.canScrollNext())
    vipCarouselApi.on('select', () => {
      setVipCanScrollPrev(vipCarouselApi.canScrollPrev())
      setVipCanScrollNext(vipCarouselApi.canScrollNext())
    })
  }, [vipCarouselApi])
  
  useEffect(() => {
    if (!forYouBlackjackCarouselApi) return
    setForYouBlackjackCanScrollPrev(forYouBlackjackCarouselApi.canScrollPrev())
    setForYouBlackjackCanScrollNext(forYouBlackjackCarouselApi.canScrollNext())
    setForYouBlackjackCurrentIndex(forYouBlackjackCarouselApi.selectedScrollSnap())
    forYouBlackjackCarouselApi.on('select', () => {
      setForYouBlackjackCanScrollPrev(forYouBlackjackCarouselApi.canScrollPrev())
      setForYouBlackjackCanScrollNext(forYouBlackjackCarouselApi.canScrollNext())
      setForYouBlackjackCurrentIndex(forYouBlackjackCarouselApi.selectedScrollSnap())
    })
  }, [forYouBlackjackCarouselApi])
  
  useEffect(() => {
    if (!forYouSlotsCarouselApi) return
    setForYouSlotsCanScrollPrev(forYouSlotsCarouselApi.canScrollPrev())
    setForYouSlotsCanScrollNext(forYouSlotsCarouselApi.canScrollNext())
    setForYouSlotsCurrentIndex(forYouSlotsCarouselApi.selectedScrollSnap())
    forYouSlotsCarouselApi.on('select', () => {
      setForYouSlotsCanScrollPrev(forYouSlotsCarouselApi.canScrollPrev())
      setForYouSlotsCanScrollNext(forYouSlotsCarouselApi.canScrollNext())
      setForYouSlotsCurrentIndex(forYouSlotsCarouselApi.selectedScrollSnap())
    })
  }, [forYouSlotsCarouselApi])
  
  useEffect(() => {
    if (!forYouBaccaratCarouselApi) return
    setForYouBaccaratCanScrollPrev(forYouBaccaratCarouselApi.canScrollPrev())
    setForYouBaccaratCanScrollNext(forYouBaccaratCarouselApi.canScrollNext())
    setForYouBaccaratCurrentIndex(forYouBaccaratCarouselApi.selectedScrollSnap())
    forYouBaccaratCarouselApi.on('select', () => {
      setForYouBaccaratCanScrollPrev(forYouBaccaratCarouselApi.canScrollPrev())
      setForYouBaccaratCanScrollNext(forYouBaccaratCarouselApi.canScrollNext())
      setForYouBaccaratCurrentIndex(forYouBaccaratCarouselApi.selectedScrollSnap())
    })
  }, [forYouBaccaratCarouselApi])

  useEffect(() => {
    if (!popularCarouselApi) return
    setPopularCanScrollPrev(popularCarouselApi.canScrollPrev())
    setPopularCanScrollNext(popularCarouselApi.canScrollNext())
    popularCarouselApi.on('select', () => {
      setPopularCanScrollPrev(popularCarouselApi.canScrollPrev())
      setPopularCanScrollNext(popularCarouselApi.canScrollNext())
    })
  }, [popularCarouselApi])

  useEffect(() => {
    if (!exclusivesCarouselApi) return
    setExclusivesCanScrollPrev(exclusivesCarouselApi.canScrollPrev())
    setExclusivesCanScrollNext(exclusivesCarouselApi.canScrollNext())
    exclusivesCarouselApi.on('select', () => {
      setExclusivesCanScrollPrev(exclusivesCarouselApi.canScrollPrev())
      setExclusivesCanScrollNext(exclusivesCarouselApi.canScrollNext())
    })
  }, [exclusivesCarouselApi])

  useEffect(() => {
    if (!crashCarouselApi) return
    setCrashCanScrollPrev(crashCarouselApi.canScrollPrev())
    setCrashCanScrollNext(crashCarouselApi.canScrollNext())
    crashCarouselApi.on('select', () => {
      setCrashCanScrollPrev(crashCarouselApi.canScrollPrev())
      setCrashCanScrollNext(crashCarouselApi.canScrollNext())
    })
  }, [crashCarouselApi])

  useEffect(() => {
    if (!instantCarouselApi) return
    setInstantCanScrollPrev(instantCarouselApi.canScrollPrev())
    setInstantCanScrollNext(instantCarouselApi.canScrollNext())
    instantCarouselApi.on('select', () => {
      setInstantCanScrollPrev(instantCarouselApi.canScrollPrev())
      setInstantCanScrollNext(instantCarouselApi.canScrollNext())
    })
  }, [instantCarouselApi])

  useEffect(() => {
    if (!tournamentCarouselApi) return
    setTournamentCanScrollPrev(tournamentCarouselApi.canScrollPrev())
    setTournamentCanScrollNext(tournamentCarouselApi.canScrollNext())
    tournamentCarouselApi.on('select', () => {
      setTournamentCanScrollPrev(tournamentCarouselApi.canScrollPrev())
      setTournamentCanScrollNext(tournamentCarouselApi.canScrollNext())
    })
  }, [tournamentCarouselApi])

  // Activity table state
  const [casinoActivityTab, setCasinoActivityTab] = useState<'All Bets' | 'Jackpot Winners' | 'Daily Race'>('All Bets')

  useEffect(() => {
    if (activeSubNav === 'Jackpots') {
      setCasinoActivityTab('Jackpot Winners')
    }
  }, [activeSubNav])

  const [casinoActivityFeed, setCasinoActivityFeed] = useState<Array<{
    id: string
    type: 'casino'
    event: string
    user: string
    vipLevel: string
    betAmount: string
    multiplier: string
    payout: string
    isWin: boolean
    gameImage?: string
  }>>([])
  const casinoActivityFeedPausedRef = useRef(false)

  // Daily Race countdown
  const [casinoRaceHours, setCasinoRaceHours] = useState(6)
  const [casinoRaceMinutes, setCasinoRaceMinutes] = useState(54)
  const [casinoRaceSeconds, setCasinoRaceSeconds] = useState(31)

  useEffect(() => {
    const interval = setInterval(() => {
      setCasinoRaceSeconds((s) => {
        if (s === 0) {
          setCasinoRaceMinutes((m) => {
            if (m === 0) {
              setCasinoRaceHours((h) => (h === 0 ? 23 : h - 1))
              return 59
            }
            return m - 1
          })
          return 59
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const activityVipLevels = [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum I',
    'Platinum II',
    'Platinum III',
    'Diamond',
    'Elite I',
    'Elite II',
    'Elite III',
    'Black I',
    'Black II',
    'Black III',
    'Obsidian',
  ] as const

  const casinoRaceLeaderboardData = [
    { rank: 1, nickname: 'Hidden', vipLevel: 'Obsidian', wagered: '$100,005.00', prize: '25%', medal: 'gold' as const },
    { rank: 2, nickname: 'Hidden', vipLevel: 'Black II', wagered: '$12,000.00', prize: '18%', medal: 'silver' as const },
    { rank: 3, nickname: 'Hidden', vipLevel: 'Elite III', wagered: '$8,000.00', prize: '16%', medal: 'bronze' as const },
    { rank: 4, nickname: 'Hidden', vipLevel: 'Elite I', wagered: '$6,000.00', prize: '12%' },
    { rank: 5, nickname: 'Hidden', vipLevel: 'Platinum III', wagered: '$5,865.00', prize: '10%' },
    { rank: 6, nickname: 'Hidden', vipLevel: 'Platinum I', wagered: '$4,986.34', prize: '8%' },
    { rank: 7, nickname: 'Hidden', vipLevel: 'Gold', wagered: '$4,503.05', prize: '5%' },
    { rank: 8, nickname: 'Hidden', vipLevel: 'Silver', wagered: '$4,163.80', prize: '3%' },
    { rank: 9, nickname: 'Hidden', vipLevel: 'Bronze', wagered: '$3,123.05', prize: '2%' },
    { rank: 10, nickname: 'Hidden', vipLevel: 'Black I', wagered: '$2,305.07', prize: '1%' },
  ]

  const casinoUserRacePosition = {
    rank: 5708,
    nickname: 'You',
    wagered: '$1,250.00',
    prize: '0.1%'
  }

  const casinoJackpotWinnersData = [
    { id: 'jp1', user: 'Hidden', vipLevel: 'Elite II', game: 'Mega Moolah', amount: '$250,000.00', date: 'Jul 18, 2026', tier: 'mega' as const, gameImage: squareTileImages[3] },
    { id: 'jp2', user: 'Hidden', vipLevel: 'Black III', game: 'Sweet Bonanza', amount: '$87,432.50', date: 'Jul 14, 2026', tier: 'major' as const, gameImage: squareTileImages[7] },
    { id: 'jp3', user: 'Hidden', vipLevel: 'Obsidian', game: 'Gates of Olympus', amount: '$45,120.00', date: 'Jul 9, 2026', tier: 'major' as const, gameImage: squareTileImages[1] },
    { id: 'jp4', user: 'Hidden', vipLevel: 'Platinum II', game: 'Book of Dead', amount: '$8,420.00', date: 'Jun 28, 2026', tier: 'minor' as const, gameImage: squareTileImages[1] },
    { id: 'jp5', user: 'Hidden', vipLevel: 'Gold', game: 'Starburst', amount: '$1,284.75', date: 'Jun 21, 2026', tier: 'mini' as const, gameImage: squareTileImages[0] },
    { id: 'jp6', user: 'Hidden', vipLevel: 'Elite I', game: "Gonzo's Quest", amount: '$19,450.00', date: 'Jun 12, 2026', tier: 'minor' as const, gameImage: squareTileImages[2] },
    { id: 'jp7', user: 'Hidden', vipLevel: 'Black I', game: 'Razor Shark', amount: '$612,890.00', date: 'May 30, 2026', tier: 'mega' as const, gameImage: squareTileImages[5] },
    { id: 'jp8', user: 'Hidden', vipLevel: 'Diamond', game: 'Big Bass Bonanza', amount: '$3,105.50', date: 'May 18, 2026', tier: 'mini' as const, gameImage: squareTileImages[6] },
    { id: 'jp9', user: 'Hidden', vipLevel: 'Silver', game: 'Dead or Alive', amount: '$72,500.00', date: 'May 4, 2026', tier: 'major' as const, gameImage: squareTileImages[4] },
    { id: 'jp10', user: 'Hidden', vipLevel: 'Bronze', game: 'Mega Moolah', amount: '$6,880.25', date: 'Apr 22, 2026', tier: 'minor' as const, gameImage: squareTileImages[3] },
  ]

  const generateCasinoActivity = useCallback(() => {
    const casinoGames = [
      { name: 'Starburst', image: squareTileImages[0] },
      { name: 'Book of Dead', image: squareTileImages[1] },
      { name: "Gonzo's Quest", image: squareTileImages[2] },
      { name: 'Mega Moolah', image: squareTileImages[3] },
      { name: 'Dead or Alive', image: squareTileImages[4] },
      { name: 'Razor Shark', image: squareTileImages[5] },
      { name: 'Big Bass Bonanza', image: squareTileImages[6] },
      { name: 'Sweet Bonanza', image: squareTileImages[7] },
    ]

    const eventData = casinoGames[Math.floor(Math.random() * casinoGames.length)]
    const vipLevel = activityVipLevels[Math.floor(Math.random() * activityVipLevels.length)]

    const betNum = Math.random() * 5000 + 10

    const isWin = Math.random() > 0.35
    const multiplierNum = isWin
      ? Math.random() * 8 + 0.5
      : Math.random() * 0.95
    const payoutNum = isWin
      ? betNum * multiplierNum
      : -betNum

    const formatMoney = (n: number) =>
      `$${Math.abs(n).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`

    return {
      id: `casino-${Date.now()}-${Math.random()}`,
      type: 'casino' as const,
      event: eventData.name,
      user: 'Hidden',
      vipLevel,
      betAmount: formatMoney(betNum),
      multiplier: `${multiplierNum.toFixed(2)}x`,
      payout: isWin ? formatMoney(payoutNum) : `-${formatMoney(payoutNum)}`,
      isWin,
      gameImage: eventData.image,
    }
  }, [])

  useEffect(() => {
    const initialFeed = Array.from({ length: 6 }, () => generateCasinoActivity())
    setCasinoActivityFeed(initialFeed)

    let timeoutId: ReturnType<typeof setTimeout>
    let cancelled = false

    // ~0.55–1.1s cadence with jitter — pauses on hover for clicks
    const scheduleNext = () => {
      const delay = 550 + Math.random() * 550
      timeoutId = setTimeout(() => {
        if (cancelled) return
        if (!casinoActivityFeedPausedRef.current) {
          setCasinoActivityFeed((prev) => {
            const newActivity = generateCasinoActivity()
            return [newActivity, ...prev.slice(0, 5)]
          })
        }
        scheduleNext()
      }, delay)
    }

    scheduleNext()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [casinoActivityTab, generateCasinoActivity])

  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const {
    favoritedGames,
    toggle: toggleGameFavorite,
    hashTitle: hashGameTitle,
  } = useCasinoFavorites()
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const [advNewestGames, setAdvNewestGames] = useState(false)
  const [advMostPopular, setAdvMostPopular] = useState(false)
  const [advGameTypes, setAdvGameTypes] = useState<Set<string>>(new Set())
  const [advProviders, setAdvProviders] = useState<Set<string>>(new Set())
  const [advSortBy, setAdvSortBy] = useState('a-z')
  const [advGameTypeOpen, setAdvGameTypeOpen] = useState(true)
  const [advProviderOpen, setAdvProviderOpen] = useState(false)
  const ADV_SORT_OPTIONS = [
    { value: 'a-z', label: 'A-Z (Ascending)' },
    { value: 'z-a', label: 'Z-A (Descending)' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'latest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'hot', label: 'Hot' },
  ] as const
  const ADV_GAME_TYPES = [
    'Keno',
    'Scratch',
    'Slots',
    'Table',
    'Tournament',
    'Video Poker',
    'Casual',
    'Virtual Sports',
    'Lottery',
  ] as const
  const ADV_PROVIDERS = [
    '5 Clover',
    '777Jacks',
    "Arrow's Edge",
    'BetSoft',
    'Blaze',
    'DGS Casino Solutions',
    'Dragon Gaming',
    'Emerald Gate',
    'FDRL',
    'Felix',
    'KA Gaming',
    'Lucky',
    'Mascot Gaming',
    'Nucleus',
    'Onlyplay',
    'Popiplay',
    'Qora',
    'Red Sparrow',
    'Revolver Gaming',
    'Rival',
    'Twain',
    'VIG',
    'Wingo',
  ] as const
  const advFilterCount =
    (advNewestGames ? 1 : 0) +
    (advMostPopular ? 1 : 0) +
    advGameTypes.size +
    advProviders.size
  const toggleAdvSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }
  const clearAdvancedFilters = () => {
    setAdvNewestGames(false)
    setAdvMostPopular(false)
    setAdvGameTypes(new Set())
    setAdvProviders(new Set())
    setAdvSortBy('a-z')
  }
  const [selectedGame, setSelectedGame] = useState<{ title: string; image: string; provider?: string; features?: string[] } | null>(null)
  useEffect(() => {
    if (selectedGame) {
      trackPageView('game-launch', `Game: ${selectedGame.title}`)
      trackAction('game-launch', selectedGame.title, { provider: selectedGame.provider || 'unknown', category: activeSubNav, section: 'casino' })
    }
  }, [selectedGame]) // eslint-disable-line react-hooks/exhaustive-deps
  // Deep tracking: vendor filter changes
  useEffect(() => { if (selectedVendor) trackAction('casino-vendor-filter', selectedVendor, { section: 'vendor-select' }) }, [selectedVendor]) // eslint-disable-line react-hooks/exhaustive-deps
  // Deep tracking: game sort/filter changes
  useEffect(() => { if (gameSortFilter !== 'popular') trackAction('casino-sort-change', gameSortFilter, { category: activeSubNav }) }, [gameSortFilter]) // eslint-disable-line react-hooks/exhaustive-deps
  // Deep tracking: favorite toggle
  const prevFavoritedRef = useRef<Set<number>>(new Set())
  useEffect(() => {
    if (favoritedGames.size > prevFavoritedRef.current.size) {
      const newFav = [...favoritedGames].find(id => !prevFavoritedRef.current.has(id))
      if (newFav !== undefined) trackAction('casino-favorite-game', `Game #${newFav}`, { section: 'casino' })
    } else if (favoritedGames.size < prevFavoritedRef.current.size) {
      const removedFav = [...prevFavoritedRef.current].find(id => !favoritedGames.has(id))
      if (removedFav !== undefined) trackAction('casino-unfavorite-game', `Game #${removedFav}`, { section: 'casino' })
    }
    prevFavoritedRef.current = new Set(favoritedGames)
  }, [favoritedGames]) // eslint-disable-line react-hooks/exhaustive-deps
  const [gameLauncherMenuOpen, setGameLauncherMenuOpen] = useState(false)
  const [gameLauncherJackpotsVisible, setGameLauncherJackpotsVisible] = useState(true)
  const [similarGamesDrawerOpen, setSimilarGamesDrawerOpen] = useState(false)
  const [gameImageLoaded, setGameImageLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [showJackpot, setShowJackpot] = useState(false)
  const [showJackpotWheel, setShowJackpotWheel] = useState(false)
  const [jackpotWinTier, setJackpotWinTier] = useState<'mini' | 'minor' | 'major' | 'mega'>('mega')
  const jackpotTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameLauncherMenuRef = useRef<HTMLDivElement>(null)
  const gameImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onOpenVipBenefits = () => {
      openVipDrawer()
      setVipActiveTab('VIP')
    }
    const onLaunchGameOfWeek = (evt: Event) => {
      const detail = (evt as CustomEvent<{ game?: { title: string; image: string; provider?: string; features?: string[] } }>).detail
      if (detail?.game) {
        setSelectedGame(detail.game)
        return
      }
      setSelectedGame({
        title: 'Game of the Week',
        image: '/banners/casino/casino_banner1.svg',
        provider: 'Dragon Gaming',
        features: ['Weekly featured title', 'Bonus rounds enabled'],
      })
    }
    const onClaimReward = (evt: Event) => {
      const amount = (evt as CustomEvent<{ amount?: number }>).detail?.amount ?? 250
      setBalance((prev) => prev + amount)
      setDisplayBalance((prev) => prev + amount)
      // Legacy in-page "Reward claimed!" toast removed — the global sonner
      // toast (top-left) is the single source of truth for this confirmation.
    }

    window.addEventListener('notification:open-vip-benefits', onOpenVipBenefits)
    window.addEventListener('notification:launch-game-of-week', onLaunchGameOfWeek as EventListener)
    window.addEventListener('notification:claim-reward', onClaimReward as EventListener)
    return () => {
      window.removeEventListener('notification:open-vip-benefits', onOpenVipBenefits)
      window.removeEventListener('notification:launch-game-of-week', onLaunchGameOfWeek as EventListener)
      window.removeEventListener('notification:claim-reward', onClaimReward as EventListener)
    }
  }, [openVipDrawer])
  
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
  
  // Helper lives in casino-favorites context
  const [selectedBrand, setSelectedBrand] = useState<'betonline' | 'wildcasino' | 'superslots'>('betonline')
  
  // Close menu when game launcher closes and reset image loaded state
  useEffect(() => {
    if (!selectedGame) {
      fadeOutSound('jackpot-bg', 1200)
      setGameLauncherMenuOpen(false)
      setGameLauncherJackpotsVisible(true)
      setGameImageLoaded(false)
      setIsFullscreen(false)
      setShowJackpot(false)
      setShowJackpotWheel(false)
      if (jackpotTimerRef.current) {
        clearTimeout(jackpotTimerRef.current)
        jackpotTimerRef.current = null
      }
      // Animate any pending balance (e.g. jackpot winnings) now that launcher is closed
      const pendingAmount = pendingBalanceRef.current
      if (pendingAmount > 0) {
        pendingBalanceRef.current = 0
        setTimeout(() => {
          setBalance(prev => {
            const newBal = +(prev + pendingAmount).toFixed(2)
            setDisplayBalance(currentDisplay => {
              const start = currentDisplay
              const end = newBal
              const duration = 2000
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
        }, 400)
      }
    } else {
      // Reset image loaded state when new game is selected
      setGameImageLoaded(false)
      setIsFullscreen(false)
      setShowJackpot(false)
      setShowJackpotWheel(false)
    }
  }, [selectedGame])

  // Hide win overlay when opting out of jackpot play
  useEffect(() => {
    if (!jackpotOptedIn) {
      setShowJackpot(false)
      setShowJackpotWheel(false)
    }
  }, [jackpotOptedIn])

  // Buffer wheel sounds while the game loads — playback starts when the wheel opens.
  useEffect(() => {
    if (!gameImageLoaded || !jackpotOptedIn) return
    preloadJackpotWheelAudio(0.42)
    preloadJackpotWinHandoffAudio()
  }, [gameImageLoaded, jackpotOptedIn])

  // Demo win after game loads (only if already opted in at load time)
  useEffect(() => {
    if (!gameImageLoaded || !selectedGame || !jackpotOptedIn) return
    jackpotTimerRef.current = setTimeout(() => {
      if (useJackpotStore.getState().optedIn) {
        setShowJackpotWheel(true)
      }
    }, 5000)
    return () => {
      if (jackpotTimerRef.current) {
        clearTimeout(jackpotTimerRef.current)
        jackpotTimerRef.current = null
      }
    }
  }, [gameImageLoaded, selectedGame, jackpotOptedIn])
  
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
  
  // Close menu when clicking outside (menu is portaled to body)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (gameLauncherMenuRef.current?.contains(target)) return
      if ((target as Element).closest?.('[data-game-launcher-menu]')) return
      setGameLauncherMenuOpen(false)
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
  const isChatOpen = useChatStore(state => state.isOpen)
  const [sidebarMenuLoading, setSidebarMenuLoading] = useState(false)
  const [pokerActiveSidebarItem, setPokerActiveSidebarItem] = useState('Start')

  /** Keep mobile drawer open across Casino/Poker/Promotions; briefly skeleton the menu. */
  const startMobileProductSwitch = () => {
    if (isMobile && openMobile) {
      skipNextMobileSidebarOpenAnimation()
      setSidebarMenuLoading(true)
    }
  }

  useEffect(() => {
    if (!sidebarMenuLoading) return
    const t = window.setTimeout(() => setSidebarMenuLoading(false), 320)
    return () => window.clearTimeout(t)
  }, [sidebarMenuLoading, showPoker, showVipRewards])

  // Debug: Log drawer state changes
  useEffect(() => {
    console.log('depositDrawerOpen state changed to:', depositDrawerOpen)
  }, [depositDrawerOpen])

  // Sync URL when VIP Rewards / Promotions section is shown
  const originalPathRef = useRef(typeof window !== 'undefined' ? window.location.pathname : '/casino')
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPromotionsPath = window.location.pathname === '/promotions' || window.location.pathname.startsWith('/promotions/')
    if (showVipRewards) {
      if (!onPromotionsPath) {
        originalPathRef.current = window.location.pathname
      }
      const nextPath = promoPathForSection(vipActiveSidebarItem)
      if (window.location.pathname !== nextPath) {
        window.history.replaceState(null, '', nextPath)
      }
    } else if (onPromotionsPath) {
      window.history.replaceState(null, '', originalPathRef.current || '/casino')
    }
  }, [showVipRewards, vipActiveSidebarItem])

  // Sync URL when Poker page is shown/hidden
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (showPoker) {
      if (window.location.pathname !== '/poker') {
        originalPathRef.current = window.location.pathname
      }
      window.history.replaceState(null, '', '/poker')
    } else {
      if (window.location.pathname === '/poker') {
        window.history.replaceState(null, '', originalPathRef.current || '/casino')
      }
    }
  }, [showPoker])

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
    if (hubFocusMode && !open) {
      return
    }

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
  }, [hubFocusMode, isMobile])

  useEffect(() => {
    if (!hubFocusMode || !vipDrawerOpen) return

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
    }
  }, [hubFocusMode, vipDrawerOpen])

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
          <span className="text-[var(--ds-fg)] font-bold text-lg tracking-wide">WILD CASINO</span>
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
          <span className="text-[var(--ds-fg)] font-bold text-lg tracking-wide">SUPER SLOTS</span>
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
  
  // Use CSS variables set by DesignCustomizer, with safe fallbacks
  const brandPrimary = 'var(--ds-primary, #ee3536)'
  const brandPrimaryHover = 'var(--ds-primary-hover, #dc2a2f)'

  // Remove blur effect from content items - rely only on sub-nav's backdrop-blur for glass effect
  // The backdrop-blur on the sub-nav will naturally blur content behind it

  // Mobile: Quick links scroll handler - show when scrolling up, hide when scrolling down
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const prevScrollY = lastScrollYRef.current
      
      if (currentScrollY < 10) {
        // Show at top
        setQuickLinksOpen(true)
      } else if (currentScrollY < prevScrollY) {
        // Show when scrolling up
        setQuickLinksOpen(true)
      } else if (currentScrollY > prevScrollY && currentScrollY > 50) {
        // Hide when scrolling down (after 50px)
        setQuickLinksOpen(false)
      }
      
      lastScrollYRef.current = currentScrollY
    }

    // Trigger immediately on mount so quick links show when at top
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Client-side clock fill (avoid SSR time in initial HTML)
  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    )
  }, [])

  useEffect(() => {
    if (isMobile || showSports || showVipRewards || showPoker) return
    if (typeof window === 'undefined') return

    const hasSeenTour = window.localStorage.getItem(CASINO_FEATURE_TOUR_KEY) === 'seen'
    if (hasSeenTour) return

    const timeout = window.setTimeout(() => {
      setCasinoFeatureTourOpen(true)
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [isMobile, showSports, showVipRewards, showPoker, CASINO_FEATURE_TOUR_KEY])

  const casinoTopItems = [
    { icon: IconHeart, label: 'My Favorites' },
    { icon: IconArrowsShuffle, label: 'Play Random' },
    { icon: null, label: 'Last Game Played', image: '/banners/casino/casino_banner1.svg', gameName: 'Golden Fortune' },
  ]

  const pokerPlayNowItems = [
    { icon: IconPlayerPlay, label: 'Play Online', sectionId: 'poker-hero' },
    { icon: IconDownload, label: 'Download', sectionId: 'poker-download' },
  ]

  const pokerNavMenuItems = [
    { icon: IconCards, label: 'Start', sectionId: 'poker-hero' },
    { icon: IconSparkles, label: 'Features', sectionId: 'poker-features' },
    { icon: IconRocket, label: 'Getting Started', sectionId: 'poker-getting-started' },
    { icon: IconShield, label: 'Integrity', sectionId: 'poker-integrity' },
    { icon: IconGift, label: 'Promotions', external: true as const },
  ]

  const scrollToPokerSection = (sectionId: string, label: string) => {
    if (label === 'Play Online') {
      setPokerActiveSidebarItem('Start')
      launchPokerApp()
      if (isMobile) setOpenMobile(false)
      return
    }
    setPokerActiveSidebarItem(label)
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (isMobile) setOpenMobile(false)
  }

  // Shared casino sidebar (mobile poker): sync active item to the section in view
  useEffect(() => {
    if (!showPoker) return

    const sections = [
      { id: 'poker-hero', label: 'Start' },
      { id: 'poker-features', label: 'Features' },
      { id: 'poker-getting-started', label: 'Getting Started' },
      { id: 'poker-integrity', label: 'Integrity' },
      { id: 'poker-download', label: 'Download' },
    ] as const

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let bestId: string | null = null
        let bestRatio = 0
        for (const { id } of sections) {
          const ratio = ratios.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }
        if (!bestId || bestRatio <= 0) return
        const match = sections.find((s) => s.id === bestId)
        if (match) setPokerActiveSidebarItem(match.label)
      },
      {
        rootMargin: '-15% 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    for (const { id } of sections) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [showPoker])

  const sidebarMenuItems = [
    { icon: IconFlame, label: 'Popular Games' },
    { icon: IconDeviceGamepad2, label: 'Slots' },
    { icon: IconCards, label: 'Blackjack' },
    { icon: IconVideo, label: 'Video Poker' },
    { icon: IconDots, label: 'Specialty Games' },
    { icon: IconCards, label: 'Table Games' },
    { icon: IconBroadcast, label: 'Live Casino' },
    { icon: IconTrophy, label: 'Tournaments' },
  ]

  const gameFilters = ['Lobby', 'Bonus Buys', 'Megaways', 'Slots', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'New', 'Exclusive']

  return (
    <div 
      data-page-bg
      className="w-full text-gray-900 dark:text-[var(--ds-fg)] font-figtree overflow-x-hidden min-h-screen transition-colors duration-300" 
      style={{ 
        width: '100%', 
        maxWidth: '100vw', 
        boxSizing: 'border-box',
        backgroundColor: 'var(--ds-page-bg, #1a1a1a)',
        '--brand-primary': brandPrimary,
        '--brand-primary-hover': brandPrimaryHover,
      } as React.CSSProperties}
    >
      <Suspense fallback={null}>
        <CasinoSearchParamsEffects
          router={router}
          openVipDrawer={openVipDrawer}
          setVipDrawerOpen={setVipDrawerOpen}
          setShowPoker={setShowPoker}
          setShowSports={setShowSports}
          setShowVipRewards={setShowVipRewards}
          setShowAllGames={setShowAllGames}
          setSelectedCategory={setSelectedCategory}
          setSelectedVendor={setSelectedVendor}
          setActiveSubNav={setActiveSubNav}
          setInitialVipSidebarItem={setInitialVipSidebarItem}
          setVipActiveSidebarItem={setVipActiveSidebarItem}
          setHubFocusMode={setHubFocusMode}
          setPromosActiveTab={setPromosActiveTab}
        />
      </Suspense>
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
          <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-[var(--ds-border)]">
                {[
                  { label: 'Home', product: null, onClick: () => { trackNav('home', 'Home'); trackPageView('home', 'Home'); setOpenMobile(false); router.push('/'); setQuickLinksOpen(false); } },
                  { label: 'Sports', product: 'sports' as const, onClick: () => { trackNav('sports', 'Sports'); trackPageView('sports', 'Sports'); handoffMobileSidebarToNextPage(); router.push('/sports/football'); setQuickLinksOpen(false); } },
                  { label: 'Casino', product: 'casino' as const, onClick: () => { trackNav('casino', 'Casino'); trackPageView('casino', 'Casino'); setShowSports(false); setShowVipRewards(false); setShowPoker(false); setActiveSubNav('Lobby'); setQuickLinksOpen(false); } },
                  { label: 'Poker', product: 'poker' as const, onClick: () => { trackNav('poker', 'Poker'); setShowPoker(true); setShowSports(false); setShowVipRewards(false); setQuickLinksOpen(false); } },
                  { label: 'Promotions', product: null, onClick: () => { trackNav('promotions', 'Promotions'); router.push('/promotions'); setQuickLinksOpen(false); } },
                ].filter(item => !item.product || visibleProducts[item.product]).map((item) => (
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
                      (item.label === 'Casino' && !showSports && !showPoker && !showVipRewards && activeSubNav !== 'Live') ||
                      (item.label === 'Sports' && showSports) ||
                      (item.label === 'Poker' && showPoker) ||
                      (item.label === 'Promotions' && showVipRewards)
                        ? "text-[var(--ds-fg)]"
                        : "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]"
                    )}
                  >
                    <span className={cn("transition-opacity duration-150", loadingQuickLink === item.label ? "opacity-0" : "opacity-100")}>{item.label}</span>
                    {loadingQuickLink === item.label && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <IconLoader2 className="w-3.5 h-3.5 text-[var(--ds-fg)] animate-spin" />
                      </span>
                    )}
                  </button>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex flex-shrink-0 items-center gap-0.5 rounded-small px-3 py-1.5 text-xs font-medium text-[var(--ds-fg-muted)] transition-colors hover:text-[var(--ds-fg)] data-[state=open]:text-[var(--ds-fg)]"
                    >
                      Other
                      <IconChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={6}
                    className="z-[200] w-[200px] border-[var(--ds-border)] bg-[var(--ds-surface-raised)]"
                  >
                    {[
                      { label: 'Contests', href: '/promotions/contests' },
                      { label: 'Esports', href: '/esports' },
                      { label: 'Racebook', href: '/racebook' },
                      { label: 'VIP Rewards', href: '/casino?vipRewardsPage=true' },
                    ].map((item) => (
                      <DropdownMenuItem
                        key={item.label}
                        className="text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
                        onSelect={() => {
                          setQuickLinksOpen(false)
                          router.push(item.href)
                        }}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
          </div>
        </motion.div>
      )}

      {/* Header - Sticky at top (hidden while full-screen search is open) */}
      <motion.header 
        data-nav-header
        className={cn(
          "border-b border-[var(--ds-border)] h-16 flex items-center justify-between z-[101] fixed right-0 transition-[left,background-color] duration-200 ease-linear",
          isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6"),
          isMobile && quickLinksOpen && "border-t-0",
          searchOverlayOpen && "invisible pointer-events-none"
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
          pointerEvents: searchOverlayOpen ? 'none' : 'auto',
          zIndex: searchOverlayOpen ? 0 : 101,
          position: 'fixed',
          boxShadow: '0 -200px 0 0 var(--ds-nav-bg, #2D2E2C)',
        }}
        aria-hidden={searchOverlayOpen}
      >
          <div className={cn('flex items-center', isMobile ? 'gap-1.5' : 'gap-6')}>
            {/* Hamburger + Logo — mobile only (desktop has sidebar logo) */}
            {isMobile && (
              <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0"
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
              <nav className="flex-1 flex items-center z-[110] -ml-1 overflow-visible" style={{ pointerEvents: 'auto' }}>
                <SidebarMenu className="flex flex-row items-center gap-2">
                  {/* Sidebar collapse toggle — always visible on desktop */}
                  <div className="flex shrink-0 items-center gap-1.5 mr-1">
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
                  {visibleProducts.sports && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                        "text-[var(--ds-fg-muted)] cursor-pointer",
                        showSports && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handoffMobileSidebarToNextPage()
                        router.push('/sports/football')
                      }}
                      data-active={showSports}
                    >
                      {showSports && (
                        <motion.div
                          layoutId="casinoNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Sports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  )}
                  
                  
                  {visibleProducts.casino && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                        "text-[var(--ds-fg-muted)] cursor-pointer",
                        !showSports && !showVipRewards && !showPoker && activeSubNav !== 'Live' && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      data-active={!showSports && !showVipRewards && !showPoker && activeSubNav !== 'Live'}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowSports(false)
                        setShowVipRewards(false)
                        setShowPoker(false)
                        setActiveSubNav('Lobby')
                        setShowAllGames(false)
                        setSelectedCategory('')
                        setSelectedVendor('')
                        window.scrollTo(0, 0)
                      }}
                    >
                      {!showSports && !showVipRewards && !showPoker && activeSubNav !== 'Live' && (
                        <motion.div
                          layoutId="casinoNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Casino</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  )}
                  
                  
                  {visibleProducts.poker && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                        "text-[var(--ds-fg-muted)] cursor-pointer",
                        showPoker && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      data-active={showPoker}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                          setShowPoker(true)
                          setShowSports(false)
                          setShowVipRewards(false)
                          window.scrollTo(0, 0)
                      }}
                    >
                      {showPoker && (
                        <motion.div
                          layoutId="casinoNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
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
                        "text-[var(--ds-fg-muted)] cursor-pointer",
                        showVipRewards && "!text-white"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        trackNav('promotions', 'Promotions')
                        setVipDrawerOpen(false)
                        router.push('/promotions')
                      }}
                      data-active={showVipRewards}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    >
                      {showVipRewards && (
                        <motion.div
                          layoutId="casinoNavPill"
                          layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
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
                            "hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors",
                            "data-[active=true]:bg-[var(--ds-control-hover)] data-[active=true]:text-[var(--ds-fg)]",
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
                        className="z-[200] w-[200px] border-[var(--ds-border)] bg-[var(--ds-surface-raised)]"
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
          
          <HeaderUserControls
            isLoggedIn
            balance={displayBalance}
            currencySymbol={currentBrand.symbol}
            vipDrawerOpen={vipDrawerOpen}
            onOpenAccount={openAccountDrawer}
            onOpenVip={openVipDrawer}
            onOpenDeposit={openDepositDrawer}
          />
        </motion.header>

        {/* Deposit Drawer - Rendered outside header to avoid conflicts */}
        <QuickDepositDrawer
          open={depositDrawerOpen}
          onOpenChange={handleDepositDrawerOpenChange}
          isMobile={isMobile}
          elevateAboveGameLauncher={!!selectedGame}
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
          onTrackDeposit={({ amount, method }) => {
            trackAction('deposit-complete', `Deposit $${amount}`, {
              amount,
              method,
              section: 'deposit-drawer',
            })
          }}
          onPlayNow={() => {
            setShowDepositConfirmation(false)
            setDepositDrawerOpen(false)
            setDepositStep('started')
            setStepLoading({
              started: false,
              processing: false,
              almost: false,
              complete: false,
            })
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
                const currentBalance = Math.round(
                  startBalance + (endBalance - startBalance) * easeOutCubic,
                )
                setDisplayBalance(currentBalance)
                if (progress < 1) {
                  requestAnimationFrame(animate)
                } else {
                  const message = `Deposit of ${currentBrand.symbol}${depositAmount.toFixed(2)} was successful`
                  playSound('button-click')
                  toast.success(message, { duration: 3000 })
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
            {/* Prod-matching vertical divide: logo column | header/nav */}
            <div
              aria-hidden
              data-sidebar-rail
              className="transition-[left] duration-200 ease-linear"
              style={{ left: sidebarOpen ? 'calc(16rem - 1px)' : 'calc(3rem - 1px)' }}
            />
            </>
          )}
          {/* Sidebar — full height; stay mounted on mobile for Poker so the drawer does not re-animate */}
          {!showSports && !(showPoker && !isMobile) && (
          <Sidebar 
            collapsible="icon"
            variant="sidebar"
            mobileOverlay
            mobileNoDrag
            mobileBg="#2d2d2d"
            mobileOverlayClassName="!bg-black/30 !backdrop-blur-sm"
            className="!bg-[#2d2d2d] !border-r-0 text-white [&>div]:!bg-[#2d2d2d] !h-screen !top-0 !z-[102]"
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
                {/* Close button — right side (mobile only) */}
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
                      key="b-lockup-casino-desktop"
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
                      key="b-lockup-casino-mobile"
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
                      key="full-logo-casino"
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.05 } }}
                      transition={{ duration: 0.1 }}
                    >
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
                    ...(visibleProducts.sports ? [{ label: 'Sports', page: 'sports' as const }] : []),
                    ...(visibleProducts.casino ? [{ label: 'Casino', page: 'casino' as const }] : []),
                    ...(visibleProducts.poker ? [{ label: 'Poker', page: 'poker' as const }] : []),
                    ...(visibleProducts.casino ? [{ label: 'Promotions', page: 'promotions' as const }] : []),
                  ].map((item) => {
                    const isCurrentPage =
                      (item.page === 'casino' && !showSports && !showVipRewards && !showPoker && activeSubNav !== 'Live') ||
                      (item.page === 'poker' && showPoker) ||
                      (item.page === 'promotions' && showVipRewards)
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.page === 'sports') {
                            handoffMobileSidebarToNextPage()
                            router.push('/sports/football')
                            return
                          }
                          if (item.page === 'home') {
                            setOpenMobile(false)
                            router.push('/')
                            return
                          }
                          startMobileProductSwitch()
                          if (item.page === 'casino') {
                            setShowSports(false)
                            setShowVipRewards(false)
                            setShowPoker(false)
                            setActiveSubNav('Lobby')
                            setShowAllGames(false)
                            setSelectedCategory('')
                            setSelectedVendor('')
                            window.scrollTo(0, 0)
                          } else if (item.page === 'poker') {
                            trackNav('poker', 'Poker')
                            setShowPoker(true)
                            setShowSports(false)
                            setShowVipRewards(false)
                            window.scrollTo(0, 0)
                          } else if (item.page === 'promotions') {
                            trackNav('promotions', 'Promotions')
                            setShowPoker(false)
                            setShowSports(false)
                            setShowVipRewards(true)
                            window.scrollTo(0, 0)
                          }
                        }}
                        className={cn(
                          "flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative",
                          isCurrentPage 
                            ? "text-[var(--ds-fg)] font-bold" 
                            : "text-white/35 font-medium hover:text-[var(--ds-fg-muted)]"
                        )}
                      >
                        {item.label}
                        {isCurrentPage && (
                          <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }} />
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
                {sidebarMenuLoading ? (
                  <MobileSidebarMenuSkeleton />
                ) : showVipRewards ? (
                  <>
                    <SidebarPromos
                      collapsed={sidebarState === 'collapsed' && !isMobile}
                    />
                    <Separator className="bg-[var(--ds-control-hover)] mx-2 group-data-[collapsible=icon]:hidden" />
                    {/* VIP Rewards sidebar items */}
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {[
                            { id: 'Promos', icon: IconSparkles, label: 'All Promotions' },
                            { id: 'My Bonus', icon: IconGift, label: 'My Bonus' },
                            { id: 'Contests', icon: IconTrophy, label: 'Contests' },
                            { id: 'Refer A Friend', icon: IconUserPlus, label: 'Refer A Friend' },
                            { id: 'VIP Hub', icon: IconCrown, label: 'VIP Hub' },
                            { type: 'separator' as const },
                            { id: 'Get Telegram', icon: IconDownload, label: 'Get Telegram' },
                          ].map((item: any, index: number) => {
                            if (item.type === 'separator') {
                              return (
                                <React.Fragment key={`vip-sep-${index}`}>
                                  <Separator className="bg-[var(--ds-control-hover)] my-2" />
                                </React.Fragment>
                              )
                            }
                            if (!item.icon || !item.id) return null
                            const Icon = item.icon
                            const itemId = item.id
                            const isActive = vipActiveSidebarItem === itemId
                            if (itemId === 'VIP Hub') {
                              return (
                                <SidebarMenuItem key={itemId}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <SidebarMenuButton
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          if (isMobile) setOpenMobile(false)
                                          openVipDrawer()
                                        }}
                                        className={cn(
                                          'w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer',
                                          'text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]'
                                        )}
                                      >
                                        <Icon strokeWidth={1.5} className="w-5 h-5" />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        <IconLogin2
                                          strokeWidth={1.5}
                                          className="ml-auto h-4 w-4 shrink-0 opacity-50"
                                        />
                                      </SidebarMenuButton>
                                    </TooltipTrigger>
                                    {sidebarState === 'collapsed' && (
                                      <TooltipContent
                                        side="right"
                                        className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]"
                                      >
                                        <p>{item.label}</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </SidebarMenuItem>
                              )
                            }
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
                                              <p className="text-xs font-semibold text-[var(--ds-fg)] leading-tight">Join our Telegram</p>
                                              <p className="text-[11px] text-[var(--ds-fg-subtle)] leading-snug truncate">Codes, promos & rewards</p>
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
                                      <TooltipContent side="right" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
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
                                        if (isMobile) setOpenMobile(false)
                                        setVipActiveSidebarItem(itemId)
                                      }}
                                      className={cn(
                                        "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                        "data-[active=true]:text-white data-[active=true]:font-medium",
                                        "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                      )}
                                      style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                                    >
                                      <Icon strokeWidth={1.5} className="w-5 h-5" />
                                      <span className="flex-1">{item.label}</span>
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
                  </>
                ) : showPoker ? (
                  <>
                    <SidebarPromos
                      collapsed={sidebarState === 'collapsed' && !isMobile}
                    />
                    <Separator className="bg-[var(--ds-control-hover)] mx-2 group-data-[collapsible=icon]:hidden" />
                    <SidebarGroup className="mt-3">
                      {isMobile && <SidebarGroupLabel className="px-2 py-1 text-xs text-[var(--ds-fg-subtle)]">POKER MENU</SidebarGroupLabel>}
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {pokerPlayNowItems.map((item, index) => {
                            const Icon = item.icon
                            // Play Online is a CTA only — never show as the active nav item
                            const isActive =
                              item.label !== 'Play Online' &&
                              pokerActiveSidebarItem === item.label
                            return (
                              <SidebarMenuItem key={index}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <SidebarMenuButton
                                      isActive={isActive}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        scrollToPokerSection(item.sectionId, item.label)
                                      }}
                                      className={cn(
                                        "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                        "data-[active=true]:text-white data-[active=true]:font-medium",
                                        "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                      )}
                                      style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                                    >
                                      <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", isActive ? "bg-white/20" : "bg-[var(--ds-control-hover)]")}>
                                        <Icon strokeWidth={1.5} className="w-4 h-4" />
                                      </div>
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
                    <Separator className="bg-[var(--ds-control-hover)] mx-2" />
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {pokerNavMenuItems.map((item, index) => {
                            const Icon = item.icon
                            const isExternal = 'external' in item && item.external
                            const isActive =
                              !isExternal && pokerActiveSidebarItem === item.label
                            return (
                              <SidebarMenuItem key={index}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <SidebarMenuButton
                                      isActive={isActive}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        if (isExternal) {
                                          if (isMobile) setOpenMobile(false)
                                          // Deep-link into Promotions → Poker sub-nav
                                          setVipActiveSidebarItem('Promos')
                                          setPromosActiveTab('Poker')
                                          setShowPoker(false)
                                          setShowSports(false)
                                          setShowVipRewards(true)
                                          return
                                        }
                                        if ('sectionId' in item && item.sectionId) {
                                          scrollToPokerSection(item.sectionId, item.label)
                                        }
                                      }}
                                      className={cn(
                                        "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                        isExternal
                                          ? "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                          : "data-[active=true]:text-white data-[active=true]:font-medium data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                      )}
                                      style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                                    >
                                      <Icon strokeWidth={1.5} className="w-5 h-5" />
                                      <span className={cn(isExternal && 'flex-1 text-left')}>{item.label}</span>
                                      {isExternal ? (
                                        <IconLogin2
                                          strokeWidth={1.5}
                                          className="ml-auto h-4 w-4 shrink-0 opacity-50"
                                        />
                                      ) : null}
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
                  </>
                ) : (
                  <>
                {/* Promotions stack — TEST: dropped at the top of the casino
                    sidebar to evaluate the live-promo pattern. Removable by
                    deleting this block + the SidebarPromos import. */}
                <SidebarPromos
                  collapsed={sidebarState === 'collapsed' && !isMobile}
                />
                <Separator className="bg-[var(--ds-control-hover)] mx-2 group-data-[collapsible=icon]:hidden" />
                {/* Featured top items — square icon style like poker */}
                <SidebarGroup className="mt-3">
                  {isMobile && <SidebarGroupLabel className="px-2 py-1 text-xs text-[var(--ds-fg-subtle)]">CASINO MENU</SidebarGroupLabel>}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {casinoTopItems.map((item, index) => {
                        const Icon = item.icon
                        const isActive = (item.label === 'My Favorites' && selectedCategory === 'Favorites')
                        return (
                          <SidebarMenuItem key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  isActive={isActive}
                                  data-tour-target={item.label === 'Play Random'
                                    ? 'casino-play-random'
                                    : item.label === 'Last Game Played'
                                      ? 'casino-last-played'
                                      : undefined}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (isMobile) setOpenMobile(false)
                                    setActiveIconTab('search')
                                    if (item.label === 'My Favorites') {
                                      setActiveSubNav('Lobby')
                                      setSelectedCategory('Favorites')
                                      setSelectedVendor('')
                                      setShowAllGames(true)
                                      setShowSports(false)
                                    } else if (item.label === 'Play Random') {
                                      // Launch a random game
                                      const randomIndex = Math.floor(Math.random() * squareTileImages.length)
                                      const gameNames = ['Gold Nugget Rush', 'Mega Fortune', 'Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers']
                                      setSelectedGame({
                                        title: gameNames[randomIndex % gameNames.length],
                                        image: squareTileImages[randomIndex],
                                        provider: 'Evolution Gaming',
                                        features: ['Random Pick!', 'Surprise Game Feature']
                                      })
                                    } else if (item.label === 'Last Game Played') {
                                      // Launch last played game
                                      setSelectedGame({
                                        title: 'Golden Fortune',
                                        image: '/banners/casino/casino_banner1.svg',
                                        provider: 'Dragon Gaming',
                                        features: ['Exploding Wilds Every 10 Spins!', 'Free Spins with Up to 10 Wilds on Every Spin!']
                                      })
                                    }
                                  }}
                                  className={cn(
                                    "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                    "data-[active=true]:text-white data-[active=true]:font-medium",
                                    "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                                  )}
                                  style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                                >
                                  {item.image ? (
                                    <div className="w-7 h-7 rounded-md flex-shrink-0 overflow-hidden bg-[var(--ds-control-hover)]">
                                      <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", isActive ? "bg-white/20" : "bg-[var(--ds-control-hover)]")}>
                                      {Icon && <Icon strokeWidth={1.5} className="w-4 h-4" />}
                                    </div>
                                  )}
                                  {(sidebarState !== 'collapsed' || isMobile) && (
                                    item.gameName ? (
                                      <div className="flex flex-col leading-tight">
                                        <span>{item.label}</span>
                                        <span className="text-[11px] text-[var(--ds-fg-subtle)] font-normal">{item.gameName}</span>
                                      </div>
                                    ) : (
                                      <span>{item.label}</span>
                                    )
                                  )}
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              {sidebarState === 'collapsed' && (
                                <TooltipContent side="right" className="bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
                                  <p>{item.label}</p>
                                  {item.gameName && <p className="text-xs text-[var(--ds-fg-subtle)]">{item.gameName}</p>}
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

                {/* Regular casino menu items */}
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {sidebarMenuItems.map((item, index) => {
                        const Icon = item.icon
                        const isActive = selectedCategory === item.label || 
                             (item.label === 'Slots' && selectedCategory === 'Slots') ||
                             (item.label === 'Blackjack' && (selectedCategory === 'Blackjack' || selectedCategory === 'BlackJack')) ||
                             (item.label === 'Video Poker' && selectedCategory === 'Video Poker') ||
                             (item.label === 'Specialty Games' && selectedCategory === 'Specialty') ||
                             (item.label === 'Table Games' && selectedCategory === 'Table Games') ||
                             (item.label === 'Popular Games' && selectedCategory === 'Popular') ||
                             (item.label === 'Live Casino' && activeSubNav === 'Live' && !selectedCategory) ||
                             (item.label === 'Tournaments' && selectedCategory === 'Tournaments')
                        return (
                          <React.Fragment key={index}>
                            <SidebarMenuItem>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    isActive={isActive}
                                    style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                                    className={cn(
                                      "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                                      "data-[active=true]:text-white data-[active=true]:font-medium",
                                      "data-[active=false]:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]",
                                      isActive && '[&[data-active=true]]:!bg-[var(--brand-primary)]'
                                    )}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      trackSidebar(`casino-sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`, item.label)
                                      trackAction('casino-category-select', item.label, { section: 'sidebar', category: item.label })
                                      
                                      if (isMobile) {
                                        setOpenMobile(false)
                                      }
                                      
                                      setActiveIconTab('search')
                                      if (item.label === 'My Favorites') {
                                        setActiveSubNav('Lobby')
                                        setSelectedCategory('Favorites')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      } else if (item.label === 'Popular Games') {
                                        setActiveSubNav('Lobby')
                                        setSelectedCategory('Popular')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      } else if (item.label === 'Slots') {
                                        setActiveSubNav('Slots')
                                        setSelectedCategory('Slots')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      } else if (item.label === 'Blackjack') {
                                        setActiveSubNav('Blackjack')
                                        setSelectedCategory('BlackJack')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      } else if (item.label === 'Video Poker') {
                                        setActiveSubNav('')
                                        setSelectedCategory('Video Poker')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      } else if (item.label === 'Specialty Games') {
                                        setActiveSubNav('Lobby')
                                        setSelectedCategory('Specialty')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                      } else if (item.label === 'Table Games') {
                                        setActiveSubNav('Lobby')
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
                                        setActiveSubNav('Lobby')
                                        setSelectedCategory('Tournaments')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                        setTournamentTab('cash')
                                        setTournamentExpandedCard(null)
                                      } else if (item.label === 'Loyalty Hub') {
                                        openVipDrawer()
                                        setShowSports(false)
                                      } else if (item.label === 'Banking') {
                                        openDepositDrawer()
                                        setShowSports(false)
                                      } else if (item.label === 'Need Help') {
                                        console.log('Need Help clicked')
                                        setShowSports(false)
                                      }
                                    }}
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
                          </React.Fragment>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                  </>
                )}
              </TooltipProvider>
              {/* Spacer for Safari bottom bar on mobile */}
              {isMobile && <div className="flex-shrink-0 h-24" />}
            </SidebarContent>
          </Sidebar>
          )}
          {/* VIP Sidebar removed — VIP items now rendered inside the main sidebar above */}


          {/* Main Content - Empty for now */}
          <SidebarInset 
            className="min-h-0 bg-[var(--ds-page-bg)] text-[var(--ds-fg)] transition-colors duration-700"
            style={{
              width: 'auto', 
              flex: '1 1 0%', 
              minWidth: 0, 
              maxWidth: 'none'
            }}
          >
            {/* Icon Tabs (Left) and Text Tabs (Right) - Fixed Sub Nav - Hide on Sports, VIP Rewards, and Poker */}
            {!showSports && !showVipRewards && !showPoker && (
            <motion.div 
              data-sub-nav
              className={cn(
                "fixed z-[90] bg-white dark:bg-[var(--ds-page-bg)]/60 dark:backdrop-blur-xl border-b border-gray-200 dark:border-[var(--ds-border)] py-3 shadow-sm",
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
                right: isChatOpen ? '340px' : 0,
                transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.2s ease-out'
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
                        <div className="bg-[var(--ds-control-bg)] dark:bg-[var(--ds-control-bg)] bg-gray-100/80 dark:bg-[var(--ds-control-bg)] p-0.5 h-auto gap-0.5 rounded-3xl border-0 flex items-center transition-colors duration-300">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSearchOverlayOpen(true)
                            }}
                            className="bg-transparent text-gray-800 dark:text-[var(--ds-fg-muted)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-gray-200/80 dark:hover:bg-[var(--ds-control-bg)] rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 ease-in-out"
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
                            }}
                            className={cn(
                              "bg-transparent rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 ease-in-out",
                              activeIconTab === 'favorite'
                                ? "text-pink-500 dark:text-pink-500 bg-gray-200/80 dark:bg-[var(--ds-control-hover)]"
                                : "text-gray-800 dark:text-[var(--ds-fg-muted)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-gray-200/80 dark:hover:bg-[var(--ds-control-bg)]"
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
                      const subNavItems = ['Lobby', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New']
                      if (selectedVendor) return ''
                      if (selectedCategory && !subNavItems.includes(selectedCategory)) return ''
                      return activeSubNav
                    })()} onValueChange={(value) => { 
                      trackClick('casino-category', `${value}`, { section: 'sub-nav', from: activeSubNav, to: value })
                      setActiveSubNav(value)
                      setActiveIconTab('search') // Reset icon tab when navigating to other pages
                      if (value === 'Lobby' || value === 'Live') {
                        setShowAllGames(false)
                        setSelectedCategory('')
                        setSelectedVendor('')
                      } else {
                        setSelectedCategory(value)
                        setSelectedVendor('')
                        setShowAllGames(true)
                        setActiveSubNav(value)
                      }
                      
                      // Scroll the clicked tab into view on mobile
                      if (isMobile && subNavScrollRef.current) {
                        const tabIndex = ['Lobby', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New'].indexOf(value)
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
                        "bg-[var(--ds-control-bg)] dark:bg-[var(--ds-control-bg)] bg-gray-100/80 dark:bg-[var(--ds-control-bg)] p-0.5 h-auto gap-1 rounded-3xl border-0 relative transition-colors duration-300",
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
                        {['Lobby', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New'].map((tab, index) => (
                          <TabsTab 
                            key={tab}
                            value={tab}
                            data-tab-item
                            className={cn(
                              "relative z-10 text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] hover:bg-gray-200 dark:hover:bg-[var(--ds-control-bg)] rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out data-[state=active]:text-white dark:data-[state=active]:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent active:outline-none flex items-center gap-1.5 flex-shrink-0",
                              isMobile && index === 0 && "scroll-snap-start",
                              isMobile && index === ['Lobby', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New'].length - 1 && "scroll-snap-end mr-12"
                            )}
                          >
                            {(() => {
                              // Don't highlight if viewing vendor or category not in sub nav menu
                              const subNavItems = ['Lobby', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New']
                              if (selectedVendor) return false
                              if (selectedCategory && !subNavItems.includes(selectedCategory)) return false
                              return activeSubNav === tab
                            })() && (
                              <motion.div
                                layoutId="activeTab"
                                layout="position"
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
            
            {/* Spacer to account for fixed sub-nav height - Only show when not on Sports, VIP Rewards, or Poker */}
            {!showSports && !showVipRewards && !showPoker && (
              <motion.div 
                initial={false}
                animate={isMobile ? {
                  height: quickLinksOpen ? '155px' : '100px',
                } : {
                  height: '115px',
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
                  key="promotions-page"
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
                    setShowVipRewards={setShowVipRewards}
                    initialVipSidebarItem={initialVipSidebarItem}
                    setInitialVipSidebarItem={setInitialVipSidebarItem}
                    previousPageState={previousPageState}
                    setPreviousPageState={setPreviousPageState}
                    setActiveSubNav={setActiveSubNav}
                    quickLinksOpen={quickLinksOpen}
                      vipActiveSidebarItem={vipActiveSidebarItem}
                      setVipActiveSidebarItem={setVipActiveSidebarItem}
                    promosActiveTab={promosActiveTab}
                    setPromosActiveTab={setPromosActiveTab}
                    onNavigate={(page) => {
                      if (page === 'home') {
                        setOpenMobile(false)
                        router.push('/')
                        return
                      }
                      startMobileProductSwitch()
                      if (page === 'casino') { setShowSports(false); setShowVipRewards(false); setShowPoker(false); setActiveSubNav('Lobby'); }
                      else if (page === 'liveCasino') { setShowSports(false); setShowVipRewards(false); setShowPoker(false); setActiveSubNav('Live'); }
                      else if (page === 'poker') { setShowPoker(true); setShowSports(false); setShowVipRewards(false); }
                      else if (page === 'vipRewards') { setShowPoker(false); setShowSports(false); setShowVipRewards(true); }
                    }}
                  />
                </motion.div>
              ) : showPoker ? (
                <div key="poker-page">
                  {/* Spacer for poker page — accounts for fixed header + quick links on mobile */}
                  <motion.div
                    initial={false}
                    animate={isMobile ? {
                      height: quickLinksOpen ? '40px' : '0px'
                    } : {
                      height: '0px'
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
                  <PokerLandingPage 
                    brandPrimary={brandPrimary || '#ee3536'}
                    quickLinksOpen={quickLinksOpen}
                    menuLoading={sidebarMenuLoading}
                    hideSidebar={isMobile}
                    onNavigate={(page, options) => {
                      if (page === 'home') {
                        setOpenMobile(false)
                        router.push('/')
                        return
                      }
                      startMobileProductSwitch()
                      if (page === 'casino') { setShowSports(false); setShowVipRewards(false); setShowPoker(false); setActiveSubNav('Lobby'); window.scrollTo(0, 0); }
                      else if (page === 'liveCasino') { setShowSports(false); setShowVipRewards(false); setShowPoker(false); setActiveSubNav('Live'); window.scrollTo(0, 0); }
                      else if (page === 'poker') { setShowPoker(true); setShowSports(false); setShowVipRewards(false); window.scrollTo(0, 0); }
                      else if (page === 'vipRewards') {
                        setShowPoker(false)
                        setShowSports(false)
                        setVipActiveSidebarItem('Promos')
                        if (options?.promoTab) setPromosActiveTab(options.promoTab)
                        setShowVipRewards(true)
                        window.scrollTo(0, 0)
                      }
                    }}
                  />
                </div>
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
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="relative min-h-[50vh]"
                >
            {/* Banner Carousel - Static, below tabs, only show on "Lobby" page */}
            {activeSubNav === 'Lobby' && !showAllGames && (
              <div 
                ref={bannerRef} 
                data-content-item 
                className={cn(
                  "pl-0 pr-0 pb-8 relative z-0 overflow-visible",
                  isMobile ? "pt-0" : "pt-0"
                )}
                style={isMobile ? { 
                  marginTop: '-72px',
                  paddingTop: 0
                } : {
                  marginTop: '-66px',
                  paddingTop: 0
                }}
              >
                  <Carousel className="w-full relative overflow-visible" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                    {!isMobile && (
                      <>
                        <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20" />
                        <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20" />
                      </>
                    )}
                    <CarouselContent className="ml-0 pr-4 md:pr-6">
                      {/* VIP Hub card — same progress block as hub drawer; fixed carousel size */}
                      <CarouselItem className={cn(
                        "pr-0 basis-auto flex-shrink-0",
                        isMobile ? "pl-3" : "pl-6"
                      )}>
                        <Card 
                          className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-0 bg-[#eeeeee] shadow-none transition-colors dark:bg-white/[0.06]" 
                          style={{ width: '300px', height: '164px' }}
                          onClick={() => {
                            openVipDrawer()
                          }}
                        >
                          <CardContent className="relative z-10 flex h-full min-h-0 flex-col p-4">
                            <div className="flex shrink-0 items-start justify-between gap-2">
                              <CardTitle className="text-base font-bold leading-tight text-[#1a1a1a] dark:text-white">
                                VIP Hub
                              </CardTitle>
                              <IconLogin2
                                className="mt-0.5 h-4 w-4 shrink-0 text-black/40 dark:text-white/45"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </div>
                            <div className="flex min-h-0 flex-1 flex-col justify-center">
                              <VipTierProgressCard
                                fromTier="Bronze"
                                toTier="Silver"
                                percent={25}
                                className="border-0 bg-transparent p-0 shadow-none"
                              />
                            </div>
                          </CardContent>
                          <span className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full dark:via-white/15" />
                        </Card>
                      </CarouselItem>
                      
                      {/* Daily Races Card — Figma light banner tile */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <Card 
                          className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-0 bg-[#eeeeee] shadow-none transition-colors dark:bg-white/[0.06]" 
                          style={{ width: '300px', height: '164px' }}
                          onClick={() => {
                            setVipActiveTab('Daily Races')
                            setAccountDrawerOpen(false)
                            setDepositDrawerOpen(false)
                            setVipDrawerOpen(true)
                            useChatStore.getState().setIsOpen(false)
                          }}
                        >
                          <CardContent className="relative z-10 flex h-full min-h-0 flex-col justify-between p-4">
                            <div className="flex shrink-0 items-start justify-between gap-2">
                              <CardTitle className="mb-0 text-base font-bold leading-tight text-[#1a1a1a] dark:text-white">
                                Daily Races
                              </CardTitle>
                              <DailyRacesTimer
                                className="text-base font-bold tabular-nums text-[#1a1a1a] dark:text-white"
                                colonClassName="text-black/40 dark:text-white/50"
                              />
                            </div>
                            <div className="grid w-full grid-cols-3 gap-2">
                              <div className="rounded-xl bg-white px-2.5 py-2.5 dark:bg-white/[0.08]">
                                <div className="text-sm font-bold tabular-nums text-[#1a1a1a] dark:text-white">3rd</div>
                                <div className="mt-0.5 text-[11px] font-medium text-black/45 dark:text-white/50">Position</div>
                              </div>
                              <div className="rounded-xl bg-white px-2.5 py-2.5 dark:bg-white/[0.08]">
                                <div className="text-sm font-bold tabular-nums text-[#1a1a1a] dark:text-white">$80.000</div>
                                <div className="mt-0.5 text-[11px] font-medium text-black/45 dark:text-white/50">Wagered</div>
                              </div>
                              <div className="rounded-xl bg-white px-2.5 py-2.5 dark:bg-white/[0.08]">
                                <div className="text-sm font-bold tabular-nums text-[#1a1a1a] dark:text-white">$160.000</div>
                                <div className="mt-0.5 text-[11px] font-medium text-black/45 dark:text-white/50">Current Prize</div>
                              </div>
                            </div>
                          </CardContent>
                          <span className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full dark:via-white/15" />
                        </Card>
                      </CarouselItem>
                      
                      {/* Casino Banner 1 */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <CasinoPromoBanner src="/banners/casino/casino_banner1.svg" />
                      </CarouselItem>
                      
                      {/* Casino Banner 2 */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <CasinoPromoBanner src="/banners/casino/casino_banner2.svg" />
                      </CarouselItem>
                      
                      {/* Casino Banner 3 */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <CasinoPromoBanner src="/banners/casino/casino_banner 3.svg" />
                      </CarouselItem>
                      
                      {/* Casino Banner 4 */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <CasinoPromoBanner src="/banners/casino/casino_banner4.svg" />
                      </CarouselItem>
                      
                      {/* Casino Banner 5 */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <CasinoPromoBanner src="/banners/casino/casino_Banner5.svg" />
                      </CarouselItem>
                    </CarouselContent>
                  </Carousel>
                </div>
              )}

              {/* Tab Panels */}
              <div 
                ref={contentRef}
                className={cn(
                  'relative z-0',
                  isMobile && activeSubNav === 'Lobby' && !showAllGames
                    ? 'mt-2'
                    : isMobile
                      ? '-mt-2'
                      : 'mt-0'
                )}
                style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}
              >
                  <AnimatePresence mode="sync" initial={false}>
                    {showAllGames ? (
                      <motion.div
                        key={`all-games-${activeSubNav || selectedCategory || 'grid'}`}
                        initial={false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.2,
                          ease: 'easeOut',
                        }}
                        className="w-full"
                        style={{
                          width: '100%',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                          minWidth: 0,
                        }}
                      >
                        <div
                          className={cn(
                            'mb-6 flex items-center justify-between',
                            isMobile ? 'px-3' : 'px-6'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {/* Back button - show when viewing vendor, category not in sub nav menu, or favorites page */}
                            {(() => {
                              const subNavItems = ['Lobby', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New']
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
                                    setActiveSubNav('Lobby')
                                    setActiveIconTab('search')
                                  }}
                                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] hover:bg-gray-200 dark:hover:bg-[var(--ds-control-bg)] transition-colors duration-300 text-gray-800 dark:text-[var(--ds-fg-muted)] hover:text-black dark:hover:text-[var(--ds-fg)]"
                                  aria-label="Go back"
                                >
                                  <IconChevronLeft className="w-5 h-5" />
                                </button>
                              ) : null
                            })()}

                        <motion.h2 
                              className="text-2xl font-bold text-black dark:text-[var(--ds-fg)] transition-colors duration-300 flex-shrink-0"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {activeIconTab === 'favorite' || selectedCategory === 'Favorites'
                            ? 'Favorites'
                            : (selectedVendor || selectedCategory || activeSubNav) === 'Jackpots'
                              ? 'Jackpot Games'
                              : (selectedVendor || selectedCategory || activeSubNav)}
                        </motion.h2>
                            
                            {/* Show selected filter */}
                            {(selectedVendor || selectedCategory || activeSubNav) !== 'Lobby' && (selectedVendor || selectedCategory || activeSubNav) !== 'Live' && gameSortFilter !== 'popular' && (
                              <span className="text-sm text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] px-3 py-1 rounded-lg bg-[var(--ds-control-bg)] dark:bg-[var(--ds-control-bg)] border border-[var(--ds-border)] dark:border-[var(--ds-border)]">
                                {gameSortFilter === 'hot' ? 'Hot' : 
                                 gameSortFilter === 'latest' ? 'Latest' : 
                                 gameSortFilter === 'oldest' ? 'Oldest' : 
                                 gameSortFilter === 'a-z' ? 'A-Z' : 
                                 gameSortFilter === 'z-a' ? 'Z-A' : ''}
                              </span>
                            )}
                          </div>
                          
                          {/* Filter Icon - Only show on sub pages (not Lobby, Live, or Tournaments) */}
                          {(selectedVendor || selectedCategory || activeSubNav) !== 'Lobby' && (selectedVendor || selectedCategory || activeSubNav) !== 'Live' && selectedCategory !== 'Tournaments' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="bg-gray-200 dark:bg-[var(--ds-control-bg)] hover:bg-gray-300 dark:hover:bg-[var(--ds-control-hover)] rounded-full p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 text-gray-800 dark:text-[var(--ds-fg-muted)] hover:text-black dark:hover:text-[var(--ds-fg)]"
                                >
                                  <IconFilter className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)]">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('popular')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'popular' && "bg-[var(--ds-control-hover)]"
                                  )}
                                >
                                  Popular
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('hot')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'hot' && "bg-[var(--ds-control-hover)]"
                                  )}
                                >
                                  Hot
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('latest')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'latest' && "bg-[var(--ds-control-hover)]"
                                  )}
                                >
                                  Latest
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('oldest')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'oldest' && "bg-[var(--ds-control-hover)]"
                                  )}
                                >
                                  Oldest
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('a-z')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'a-z' && "bg-[var(--ds-control-hover)]"
                                  )}
                                >
                                  A-Z
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setGameSortFilter('z-a')}
                                  className={cn(
                                    "cursor-pointer",
                                    gameSortFilter === 'z-a' && "bg-[var(--ds-control-hover)]"
                                  )}
                                >
                                  Z-A
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="cursor-pointer">
                                    Vendors
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className="w-56 bg-[var(--ds-surface-raised)] border-[var(--ds-border)] text-[var(--ds-fg)] max-h-[400px] overflow-y-auto">
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
                                          trackAction('casino-vendor-filter', vendor, { section: 'vendor-dropdown' })
                                          setSelectedVendor(vendor)
                                          setSelectedCategory('')
                                          setShowAllGames(true)
                                          setActiveSubNav('')
                                          setActiveIconTab('search') // Reset icon tab when selecting vendor
                                          setGameSortFilter('popular')
                                        }}
                                        className={cn(
                                          "cursor-pointer",
                                          selectedVendor === vendor && "bg-[var(--ds-control-hover)]"
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
                              <Carousel setApi={setSlotsCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                                {!isMobile && (
                                  <>
                                    <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20" />
                                    <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20" />
                                  </>
                                )}
                                <CarouselContent className="ml-0 pr-4 md:pr-6" style={{ overflow: 'visible' }}>
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
                                        className="group relative bg-gray-100/80 dark:bg-[var(--ds-control-bg)] border border-gray-200 dark:border-[var(--ds-border)] rounded-lg px-3 py-2.5 text-xs font-medium text-gray-800 dark:text-[var(--ds-fg-muted)] hover:bg-gray-200/80 dark:hover:bg-[var(--ds-control-hover)] hover:text-black dark:hover:text-[var(--ds-fg)] transition-all duration-300 whitespace-nowrap overflow-hidden flex items-center gap-2"
                                        onClick={() => {
                                          setSelectedVendor(vendor)
                                          setSelectedCategory('')
                                          setShowAllGames(true)
                                          setActiveSubNav('')
                                          setActiveIconTab('search') // Reset icon tab when selecting vendor
                                        }}
                                      >
                                        {/* Vendor Icon */}
                                        <VendorIcon vendor={vendor} />
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
                        
                        {/* ============ TOURNAMENTS CONTENT ============ */}
                        {selectedCategory === 'Tournaments' && (
                          <div className="px-6 pb-8">
                            {/* Info Banner */}
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--ds-control-border)] mb-6">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--ds-control-bg)] flex items-center justify-center">
                                <IconBell className="w-4 h-4 text-[var(--ds-fg-subtle)]" />
                              </div>
                              <p className="text-sm text-[var(--ds-fg-muted)]">
                                {tournamentTab === 'cash' 
                                  ? 'Cash Tournaments are played with real money. No entry fee required!'
                                  : 'Freeroll Tournaments are free to enter. No entry fee required!'}
                              </p>
                            </div>

                            {/* Cash / Free Rolls Tabs */}
                            <div className="flex items-center gap-2 mb-8">
                              <button
                                onClick={() => { setTournamentTab('cash'); setTournamentExpandedCard(null) }}
                                className={cn(
                                  "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                                  tournamentTab === 'cash'
                                    ? "text-[var(--ds-fg)]"
                                    : "bg-[var(--ds-overlay)] text-[var(--ds-fg-subtle)] hover:bg-white/[0.08] hover:text-[var(--ds-fg-muted)]"
                                )}
                                style={tournamentTab === 'cash' ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                              >
                                Cash
                              </button>
                              <button
                                onClick={() => { setTournamentTab('freeroll'); setTournamentExpandedCard(null) }}
                                className={cn(
                                  "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                                  tournamentTab === 'freeroll'
                                    ? "text-[var(--ds-fg)]"
                                    : "bg-[var(--ds-overlay)] text-[var(--ds-fg-subtle)] hover:bg-white/[0.08] hover:text-[var(--ds-fg-muted)]"
                                )}
                                style={tournamentTab === 'freeroll' ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                              >
                                Free Rolls
                              </button>
                            </div>

                            {/* Tournament Cards Grid */}
                            <div 
                              className="grid gap-3"
                              style={{ gridTemplateColumns: isMobile ? '1fr' : `repeat(auto-fill, minmax(210px, 1fr))` }}
                            >
                              {(tournamentTab === 'cash' ? cashTournamentsData : freerollTournamentsData).map((tournament, tIdx) => (
                                <motion.div
                                  key={tournament.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: tIdx * 0.06, type: "spring", bounce: 0.2 }}
                                  whileHover={{ y: -4 }}
                                  className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--ds-page-bg)] border border-[var(--ds-control-border)] hover:border-white/[0.12] transition-all duration-300"
                                >
                                  {/* Image */}
                                  <div className="relative h-28 w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-black/40 to-transparent z-10" />
                                    <Image src={tournament.image} alt={tournament.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
                                    {/* Overlaid name + prize */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                      <h3 className="text-[13px] font-bold text-[var(--ds-fg)] leading-tight truncate">{tournament.name}</h3>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <IconTrophy className="w-3 h-3 text-yellow-400" />
                                        <span className="text-xs font-bold text-yellow-400">{tournament.prizePool}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Countdown under image */}
                                  <div className="px-3 pt-2">
                                    <TournamentCountdown endDate={tournament.endDate} />
                                  </div>

                                  {/* Details */}
                                  <div className="px-3 pt-2.5 pb-3 flex flex-col gap-2 flex-1">
                                    {/* Info rows */}
                                    <div className="space-y-1">
                                      {[
                                        { icon: <IconStopwatch className="w-3 h-3 shrink-0 text-[var(--ds-fg-subtle)]" />, label: 'Type', value: tournament.gameType },
                                        { icon: <IconRefresh className="w-3 h-3 shrink-0 text-[var(--ds-fg-subtle)]" />, label: 'Rounds', value: tournament.rounds },
                                        { icon: <IconArrowsSort className="w-3 h-3 shrink-0 text-[var(--ds-fg-subtle)]" />, label: 'Bets', value: tournament.betRange },
                                        { icon: <IconClock className="w-3 h-3 shrink-0 text-[var(--ds-fg-subtle)]" />, label: 'Period', value: `${tournament.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${tournament.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, noTruncate: true },
                                      ].map((row: { icon: React.ReactNode; label: string; value: string; bold?: boolean; noTruncate?: boolean }) => (
                                        <div key={row.label} className="flex items-center gap-1.5 text-[11px] min-w-0">
                                          {row.icon}
                                          <span className="text-[var(--ds-fg-subtle)] shrink-0">{row.label}</span>
                                          <span className={cn("ml-auto text-right", row.noTruncate ? "text-[10px]" : "truncate", row.bold ? "font-semibold text-[var(--ds-fg)]" : "font-medium text-[var(--ds-fg-muted)]")}>{row.value}</span>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="flex-1" />

                                    {/* Divider */}
                                    <div className="w-full border-t border-[var(--ds-control-border)] my-0.5" />

                                    {/* Bottom: leaderboard + play */}
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setLeaderboardTournament(tournament) }}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--ds-control-bg)] hover:bg-white/[0.1] transition-colors"
                                      >
                                        <IconTrophy className="w-3.5 h-3.5 text-[var(--ds-fg)]" />
                                        {tournament.leaderboard.find(e => e.isMe) && (
                                          <span className="text-[10px] font-bold text-[var(--ds-fg-muted)]">
                                            #{tournament.leaderboard.find(e => e.isMe)?.rank}
                                          </span>
                                        )}
                                      </button>
                                      <div className="flex-1" />
                                      <button 
                                        onClick={() => setSelectedGame({ title: tournament.name, image: tournament.image, provider: tournament.provider, features: [`${tournament.gameType}`, `${tournament.rounds}`, `Prize Pool: ${tournament.prizePool}`] })}
                                        className="flex-1 py-1.5 rounded-md text-xs font-bold text-[var(--ds-fg)] text-center transition-all duration-200 hover:brightness-110 active:scale-95"
                                        style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                                      >
                                        Play
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ============ TOURNAMENT LEADERBOARD MODAL (portaled to body) ============ */}
                        {typeof document !== 'undefined' && createPortal(
                          <AnimatePresence>
                            {leaderboardTournament && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                                style={{ pointerEvents: 'auto' }}
                                onClick={() => setLeaderboardTournament(null)}
                              >
                                <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                                  transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="relative w-full max-w-md rounded-2xl bg-[#1e1e1e] border border-white/[0.08] overflow-hidden shadow-2xl"
                                >
                                  {/* Header */}
                                  <div className="relative p-5 pb-4">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-neutral-800">
                                          <Image src={leaderboardTournament.image} alt="" fill className="object-cover" sizes="40px" />
                                        </div>
                                        <div>
                                          <h3 className="text-base font-bold text-[var(--ds-fg)]">{leaderboardTournament.name}</h3>
                                          <p className="text-xs text-[var(--ds-fg-subtle)]">Game ID: {leaderboardTournament.gameId} • {leaderboardTournament.gameType}</p>
                                        </div>
                                      </div>
                                      <button 
                                        onClick={() => setLeaderboardTournament(null)} 
                                        className="w-8 h-8 rounded-lg bg-[var(--ds-control-bg)] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
                                      >
                                        <IconX className="w-4 h-4 text-[var(--ds-fg-muted)]" />
                                      </button>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2">
                                      <IconTrophy className="w-4 h-4 text-yellow-400" />
                                      <span className="text-sm font-semibold text-yellow-400">{leaderboardTournament.prizePool} Prize Pool</span>
                                      <span className="text-white/20 mx-1">•</span>
                                      <span className="text-xs text-[var(--ds-fg-subtle)]">{leaderboardTournament.rounds}</span>
                                    </div>
                                  </div>

                                  {/* Column Headers */}
                                  <div className="flex items-center px-5 py-2 text-[10px] uppercase tracking-wider text-white/30 border-t border-[var(--ds-control-border)]">
                                    <span className="w-10 text-center">#</span>
                                    <span className="flex-1">Player</span>
                                    <span className="w-20 text-right">Points</span>
                                    <span className="w-20 text-right">Prize</span>
                                  </div>

                                  {/* Leaderboard Rows */}
                                  <div className="max-h-[360px] overflow-y-auto">
                                    {leaderboardTournament.leaderboard.map((entry, idx) => (
                                      <motion.div
                                        key={entry.rank}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className={cn(
                                          "flex items-center px-5 py-3 border-b border-white/[0.04] transition-colors",
                                          entry.isMe 
                                            ? "bg-[var(--ds-control-bg)]" 
                                            : "hover:bg-white/[0.02]"
                                        )}
                                        style={entry.isMe ? { borderLeft: '3px solid var(--ds-primary, #ee3536)' } : undefined}
                                      >
                                        <span className={cn(
                                          "w-10 text-center text-sm font-bold",
                                          entry.rank === 1 && "text-yellow-400",
                                          entry.rank === 2 && "text-gray-300",
                                          entry.rank === 3 && "text-amber-600",
                                          entry.rank > 3 && !entry.isMe && "text-[var(--ds-fg-subtle)]",
                                          entry.isMe && "text-[var(--ds-fg)]"
                                        )}>
                                          {entry.rank <= 3 ? (
                                            <IconTrophy className={cn(
                                              "w-4 h-4 mx-auto",
                                              entry.rank === 1 && "text-yellow-400",
                                              entry.rank === 2 && "text-gray-300",
                                              entry.rank === 3 && "text-amber-600"
                                            )} />
                                          ) : entry.rank}
                                        </span>
                                        <span className={cn(
                                          "flex-1 text-sm font-medium",
                                          entry.isMe ? "text-[var(--ds-fg)] font-bold" : "text-[var(--ds-fg-muted)]"
                                        )}>
                                          {entry.user}
                                          {entry.isMe && (
                                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--ds-primary, #ee3536) 15%, transparent)', color: 'var(--ds-primary, #ee3536)' }}>
                                              YOU
                                            </span>
                                          )}
                                        </span>
                                        <span className={cn(
                                          "w-20 text-right text-sm tabular-nums",
                                          entry.isMe ? "text-[var(--ds-fg)] font-bold" : "text-[var(--ds-fg-subtle)]"
                                        )}>
                                          {entry.points.toLocaleString()}
                                        </span>
                                        <span className={cn(
                                          "w-20 text-right text-sm font-semibold",
                                          entry.isMe ? "text-emerald-400" : "text-emerald-400/70"
                                        )}>
                                          {entry.prize}
                                        </span>
                                      </motion.div>
                                    ))}
                                  </div>

                                  {/* Footer with your position summary */}
                                  {leaderboardTournament.leaderboard.find(e => e.isMe) && (
                                    <div className="p-4 border-t border-white/[0.08] bg-white/[0.02]">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--ds-primary, #ee3536) 12%, transparent)' }}>
                                            <span className="text-xs font-bold" style={{ color: 'var(--ds-primary, #ee3536)' }}>
                                              #{leaderboardTournament.leaderboard.find(e => e.isMe)?.rank}
                                            </span>
                                          </div>
                                          <div>
                                            <p className="text-xs font-semibold text-[var(--ds-fg)]">Your Position</p>
                                            <p className="text-[10px] text-[var(--ds-fg-subtle)]">{leaderboardTournament.leaderboard.find(e => e.isMe)?.points.toLocaleString()} points</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xs text-[var(--ds-fg-subtle)]">Current Prize</p>
                                          <p className="text-sm font-bold text-emerald-400">{leaderboardTournament.leaderboard.find(e => e.isMe)?.prize}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>,
                          document.body
                        )}


                        {selectedCategory !== 'Tournaments' && (() => {
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

                          if (activeSubNav === 'Jackpots' && showAllGames) {
                            sortedGames = sortedGames
                              .filter((g) => isJackpotNetworkGame(g.index))
                              .slice(0, JACKPOT_ELIGIBLE_GAME_LIMIT)
                          }
                          
                          const categoryKey = selectedCategory || activeSubNav
                          const maxCols = 8 // Maximum columns for largest screens
                          const isJackpotsGrid =
                            activeSubNav === 'Jackpots' && showAllGames
                          const gridClassName =
                            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4 px-6'

                          const renderGameTile = (
                            game: (typeof sortedGames)[number],
                            displayIndex: number
                          ) => {
                            const columnIndex = displayIndex % maxCols
                            const stableKey = `${categoryKey}-${game.index}`
                            return (
                              <LazyGameTile
                                key={stableKey}
                                index={game.index}
                                columnIndex={columnIndex}
                                rowIndex={Math.floor(displayIndex / maxCols)}
                                onTileClick={setSelectedGame}
                                isMobile={isMobile}
                                showJackpotNetworkTag={activeSubNav === 'Jackpots'}
                              />
                            )
                          }

                          const renderSkeletons = (tileCount: number) => {
                            if (isJackpotsGrid) return []
                            const itemsInLastRow = tileCount % maxCols
                            const skeletonCount =
                              itemsInLastRow > 0 ? maxCols - itemsInLastRow : 0
                            return Array.from({ length: skeletonCount }).map(
                              (_, index) => (
                                <div
                                  key={`skeleton-${categoryKey}-${index}`}
                                  className="w-full aspect-square"
                                >
                                  <Skeleton className="w-full h-full rounded-small bg-[var(--ds-control-hover)] dark:bg-[var(--ds-control-hover)]" />
                                </div>
                              )
                            )
                          }

                          if (selectedCategory === 'Table Games') {
                            const tableSections: { id: string; title: string; names: string[]; offset: number }[] = [
                              {
                                id: 'blackjack',
                                title: 'Blackjack',
                                offset: 40,
                                names: [
                                  'Blackjack Classic',
                                  'VIP Blackjack',
                                  'European Blackjack',
                                  'American Blackjack',
                                  'Perfect Pairs',
                                  '21+3 Blackjack',
                                  'Blackjack Surrender',
                                  'Blackjack Switch',
                                  'Double Exposure',
                                  'Blackjack Pro',
                                  'Speed Blackjack',
                                  'Infinite Blackjack',
                                ],
                              },
                              {
                                id: 'roulette',
                                title: 'Roulette',
                                offset: 52,
                                names: [
                                  'European Roulette',
                                  'American Roulette',
                                  'French Roulette',
                                  'Speed Roulette',
                                  'Multi-Wheel Roulette',
                                  'VIP Roulette',
                                  'Mini Roulette',
                                  'Double Ball Roulette',
                                  'Auto Roulette',
                                  'Mega Roulette',
                                  'Lightning Roulette',
                                  'Premium Roulette',
                                ],
                              },
                              {
                                id: 'other',
                                title: 'Other Table Games',
                                offset: 64,
                                names: [
                                  'Craps',
                                  'Sic Bo',
                                  'Keno',
                                  'Bingo',
                                  'War',
                                  'Red Dog',
                                  'Casino War',
                                  'Fan Tan',
                                  'Andar Bahar',
                                  'Teen Patti',
                                  'Hi-Lo',
                                  'Dice Duel',
                                ],
                              },
                              {
                                id: 'baccarat',
                                title: 'Baccarat',
                                offset: 76,
                                names: [
                                  'VIP Baccarat',
                                  'Speed Baccarat',
                                  'Baccarat Squeeze',
                                  'No Commission Baccarat',
                                  'Dragon Tiger',
                                  'Golden Baccarat',
                                  'Punto Banco',
                                  'Control Squeeze',
                                  'Mini Baccarat',
                                  'Baccarat Pro',
                                ],
                              },
                              {
                                id: 'poker',
                                title: 'Casino Poker',
                                offset: 86,
                                names: [
                                  "Texas Hold'em",
                                  'Caribbean Stud',
                                  'Three Card Poker',
                                  "Casino Hold'em",
                                  'Ultimate Texas',
                                  'Pai Gow Poker',
                                  'Let It Ride',
                                  'Mississippi Stud',
                                  'Oasis Poker',
                                  'Side Bet City',
                                ],
                              },
                            ]

                            const renderTableSlotTile = (
                              title: string,
                              index: number,
                              key: string
                            ) => {
                              const imageSrc =
                                squareTileImages[index % squareTileImages.length]
                              const provider = getTileVendor(index)
                              const features = [
                                'Classic Table Game',
                                'Multiple Betting Options',
                                'Fast Play',
                              ]
                              const openGame = () =>
                                setSelectedGame({
                                  title,
                                  image: imageSrc,
                                  provider,
                                  features,
                                })

                              return (
                                <div
                                  key={key}
                                  className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-small bg-[var(--ds-control-bg)] transition-all duration-300 hover:bg-[var(--ds-control-hover)]"
                                  onClick={openGame}
                                >
                                  <Image
                                    src={imageSrc}
                                    alt={title}
                                    fill
                                    className={slotTileImgClass}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                                  />
                                  <GameTagBadge
                                    tag={getMetaTag(index)}
                                    vendor={provider}
                                  />
                                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                                    <div className="truncate text-xs font-bold leading-tight text-[var(--ds-fg)]">
                                      {title}
                                    </div>
                                  </div>
                                  <GameTilePlayOverlay favoriteTitle={title} onLaunch={openGame} />
                                </div>
                              )
                            }

                            return (
                              <div className="flex w-full flex-col gap-10 pb-8">
                                {tableSections.map((section) => (
                                  <section key={section.id}>
                                    <h2 className="mb-4 px-6 text-lg font-semibold text-black dark:text-[var(--ds-fg)]">
                                      {section.title} ({section.names.length})
                                    </h2>
                                    <div className={cn(gridClassName)}>
                                      {section.names.map((title, index) =>
                                        renderTableSlotTile(
                                          title,
                                          section.offset + index,
                                          `tg-${section.id}-${index}`
                                        )
                                      )}
                                    </div>
                                  </section>
                                ))}
                              </div>
                            )
                          }

                          if (isJackpotsGrid) {
                            const insertAt = Math.min(
                              jackpotFeedInsertAt,
                              sortedGames.length
                            )
                            const firstGames = sortedGames.slice(0, insertAt)
                            const restGames = sortedGames.slice(insertAt)

                            return (
                              <div className="flex flex-col gap-4 w-full">
                                <div
                                  className={gridClassName}
                                  style={
                                    isMobile ? { willChange: 'auto' } : undefined
                                  }
                                >
                                  {firstGames.map((game, i) =>
                                    renderGameTile(game, i)
                                  )}
                                  {renderSkeletons(firstGames.length)}
                                </div>
                                <div className="px-6 w-full min-w-0">
                                  <JackpotActivityFeed
                                    compact
                                    maxItems={6}
                                    className="w-full"
                                  />
                                </div>
                                <div
                                  className={gridClassName}
                                  style={
                                    isMobile ? { willChange: 'auto' } : undefined
                                  }
                                >
                                  {restGames.map((game, i) =>
                                    renderGameTile(game, insertAt + i)
                                  )}
                                  {renderSkeletons(restGames.length)}
                                </div>
                              </div>
                            )
                          }

                          const gameTiles = sortedGames.map((game, displayIndex) =>
                            renderGameTile(game, displayIndex)
                          )

                          if (isMobile) {
                            return (
                              <div
                                className={gridClassName}
                                style={{ willChange: 'auto' }}
                              >
                                {gameTiles}
                                {renderSkeletons(gameTiles.length)}
                              </div>
                            )
                          }

                          return (
                            <div className={gridClassName}>
                              {gameTiles}
                              {renderSkeletons(gameTiles.length)}
                            </div>
                          )
                        })()}

                      </motion.div>
                    ) : activeSubNav === 'Live' ? (
                      <motion.div
                        key="live"
                        initial={false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
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
                            isMobile ? "px-3" : "px-6"
                          )} style={{ width: '100%', maxWidth: '100%', overflow: 'visible', boxSizing: 'border-box', display: 'flex', minWidth: 0 }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>Blackjack (52)</h2>
                            <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                              style={{ flex: '0 0 auto', flexShrink: 0, visibility: 'visible', opacity: 1, display: 'inline-flex', whiteSpace: 'nowrap' }}
                              onClick={() => {
                                setSelectedCategory('Blackjack')
                                setSelectedVendor('')
                                setShowAllGames(true)
                                setActiveSubNav('Live')
                              }}
                            >
                              All Games
                            </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (blackjackCarouselApi) {
                                        const currentIndex = blackjackCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        blackjackCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!blackjackCarouselApi || !blackjackCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (blackjackCarouselApi) {
                                        const currentIndex = blackjackCarouselApi.selectedScrollSnap()
                                        const slideCount = blackjackCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        blackjackCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!blackjackCarouselApi || !blackjackCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setBlackjackCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const bjNames = ['Classic Blackjack', 'VIP Blackjack', 'Speed Blackjack', 'Blackjack Party', 'Lightning Blackjack', 'Infinite Blackjack', 'Blackjack VIP', 'Perfect Pairs', 'European Blackjack', 'Double Exposure']
                                  const bjLimits = ['$25 - $500', '$350 - $5,000', '$100 - $1,000', '$50 - $250', '$25 - $100', '$10 - $500', '$500 - $5,000', '$25 - $250', '$50 - $500', '$100 - $2,000']
                                  const bjSeats = [{o:2,t:7},{o:4,t:6},{o:5,t:7},{o:3,t:6},{o:6,t:7},{o:1,t:7},{o:4,t:7},{o:3,t:6},{o:5,t:7},{o:2,t:6}]
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-3"
                                    )}>
                                      <LiveCasinoTile
                                        gameType="blackjack"
                                        shape="rectangle"
                                        title={bjNames[index % bjNames.length]}
                                        subtitle="Live BetOnline"
                                        bettingRange={bjLimits[index % bjLimits.length]}
                                        index={index}
                                        brandPrimary={brandPrimary}
                                        seats={{ occupied: bjSeats[index % bjSeats.length].o, total: bjSeats[index % bjSeats.length].t }}
                                        onClick={() => {
                                          setSelectedGame({
                                            title: bjNames[index % bjNames.length],
                                            image: getLiveImage('blackjack', 'rectangle', index),
                                            provider: getLiveVendor(index).name,
                                            features: ['Live Dealer Experience', 'High Stakes Betting', 'Multiple Table Options']
                                          })
                                        }}
                                      />
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        
                        {/* Roulette Section - Tall Tiles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Roulette (34)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Roulette')
                                  setShowAllGames(true)
                                  setActiveSubNav('Live')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (rouletteCarouselApi) {
                                        const currentIndex = rouletteCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        rouletteCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!rouletteCarouselApi || !rouletteCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (rouletteCarouselApi) {
                                        const currentIndex = rouletteCarouselApi.selectedScrollSnap()
                                        const slideCount = rouletteCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        rouletteCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!rouletteCarouselApi || !rouletteCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setRouletteCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const rouletteNames = ['Live Roulette', 'Speed Roulette', 'Lightning Roulette', 'Auto Roulette', 'VIP Roulette', 'French Roulette', 'European Roulette', 'Mega Roulette', 'Double Ball', 'Immersive Roulette']
                                  const rouletteLimits = ['$25 - $100', '$10 - $500', '$50 - $1,000', '$1 - $100', '$100 - $5,000', '$25 - $250', '$5 - $500', '$50 - $2,000', '$25 - $500', '$10 - $1,000']
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-3"
                                    )}>
                                      <LiveCasinoTile
                                        gameType="roulette"
                                        shape="tall"
                                        title={rouletteNames[index % rouletteNames.length]}
                                        subtitle="Live BetOnline"
                                        bettingRange={rouletteLimits[index % rouletteLimits.length]}
                                        index={index}
                                        brandPrimary={brandPrimary}
                                        onClick={() => {
                                          setSelectedGame({
                                            title: rouletteNames[index % rouletteNames.length],
                                            image: getLiveImage('roulette', 'tall', index),
                                            provider: getLiveVendor(index).name,
                                            features: ['Live Casino Experience', 'Real-Time Gameplay', 'Professional Dealers']
                                          })
                                        }}
                                      />
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        
                        {/* Baccarat Section - Rectangle Tiles Carousel */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Baccarat (23)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Baccarat')
                                  setShowAllGames(true)
                                  setActiveSubNav('Live')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => {
                                      if (baccaratCarouselApi) {
                                        const currentIndex = baccaratCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        baccaratCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!baccaratCarouselApi || !baccaratCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (baccaratCarouselApi) {
                                        const currentIndex = baccaratCarouselApi.selectedScrollSnap()
                                        const slideCount = baccaratCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        baccaratCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!baccaratCarouselApi || !baccaratCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setBaccaratCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 8 }).map((_, index) => {
                                  const baccaratNames = ['VIP Baccarat', 'Auto Baccarat', 'Speed Baccarat', 'Lightning Baccarat', 'Baccarat Squeeze', 'No Commission', 'Dragon Tiger', 'Golden Baccarat']
                                  const baccaratLimits = ['$350 - $5,000', '$1 - $12,500', '$25 - $100', '$50 - $1,000', '$5 - $500', '$10 - $1,000', '$25 - $250', '$100 - $5,000']
                                return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-3"
                                    )}>
                                      <LiveCasinoTile
                                        gameType="baccarat"
                                        shape="rectangle"
                                        title={baccaratNames[index % baccaratNames.length]}
                                        subtitle="Live BetOnline"
                                        bettingRange={baccaratLimits[index % baccaratLimits.length]}
                                        index={index}
                                        brandPrimary={brandPrimary}
                                        onClick={() => {
                                          setSelectedGame({
                                            title: baccaratNames[index % baccaratNames.length],
                                            image: getLiveImage('baccarat', 'rectangle', index),
                                            provider: getLiveVendor(index).name,
                                            features: ['Live Dealer Experience', 'High Stakes Betting', 'Multiple Table Options']
                                          })
                                        }}
                                      />
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                                  </div>
                                    </div>
                        
                        {/* VIP Tables Section - Tall tiles (match Originals) */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>VIP Tables (18)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('VIP')
                                  setShowAllGames(true)
                                  setActiveSubNav('Live')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (vipCarouselApi) {
                                        const currentIndex = vipCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        vipCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!vipCarouselApi || !vipCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (vipCarouselApi) {
                                        const currentIndex = vipCarouselApi.selectedScrollSnap()
                                        const slideCount = vipCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        vipCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!vipCarouselApi || !vipCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                                  </div>
                                  </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setVipCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const vipNames = ['VIP Blackjack Elite', 'VIP Roulette', 'VIP Baccarat', 'VIP Speed BJ', 'VIP Lightning', 'VIP Unlimited BJ', 'VIP Auto Roulette', 'VIP Dragon Tiger', 'VIP Squeeze', 'VIP Gold BJ']
                                  const vipLimits = ['$500 - $10,000', '$350 - $5,000', '$1,000 - $25,000', '$250 - $5,000', '$500 - $15,000', '$100 - $5,000', '$500 - $10,000', '$250 - $7,500', '$1,000 - $20,000', '$350 - $5,000']
                                  const vipTypes: LiveGameType[] = ['blackjack', 'roulette', 'baccarat', 'blackjack', 'roulette', 'blackjack', 'roulette', 'baccarat', 'blackjack', 'roulette']
                                  const type = vipTypes[index % vipTypes.length]
                                return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-3"
                                    )}>
                                      <LiveCasinoTile
                                        gameType={type}
                                        shape="tall"
                                        title={vipNames[index % vipNames.length]}
                                        subtitle="VIP Live"
                                        bettingRange={vipLimits[index % vipLimits.length]}
                                        index={index + 30}
                                        brandPrimary={brandPrimary}
                                        seats={type === 'blackjack' || type === 'poker' ? { occupied: 3 + (index % 4), total: 7 } : undefined}
                                        onClick={() => {
                                          setSelectedGame({
                                            title: vipNames[index % vipNames.length],
                                            image: getLiveImage(type, 'tall', index + 30),
                                            provider: getLiveVendor(index + 30).name,
                                            features: ['VIP Experience', 'High Stakes', 'Exclusive Tables']
                                          })
                                        }}
                                      />
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        
                        {/* Casino Poker Section */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Casino Poker (26)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Casino Poker')
                                  setShowAllGames(true)
                                  setActiveSubNav('Live')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (casinoPokerCarouselApi) {
                                        const currentIndex = casinoPokerCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        casinoPokerCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!casinoPokerCarouselApi || !casinoPokerCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (casinoPokerCarouselApi) {
                                        const currentIndex = casinoPokerCarouselApi.selectedScrollSnap()
                                        const slideCount = casinoPokerCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        casinoPokerCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!casinoPokerCarouselApi || !casinoPokerCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setCasinoPokerCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const pokerNames = ['Texas Hold\'em', 'Caribbean Stud', 'Three Card Poker', 'Casino Hold\'em', 'Ultimate Texas', 'Pai Gow Poker', 'Let It Ride', 'Mississippi Stud', 'Oasis Poker', 'Side Bet City']
                                  const pokerLimits = ['$25 - $500', '$50 - $1,000', '$10 - $250', '$100 - $2,000', '$25 - $500', '$5 - $100', '$50 - $250', '$25 - $1,000', '$10 - $500', '$50 - $2,000']
                                  const pokerSeats = [{o:3,t:6},{o:5,t:8},{o:2,t:6},{o:4,t:8},{o:6,t:8},{o:1,t:6},{o:3,t:8},{o:5,t:6},{o:2,t:7},{o:4,t:7}]
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-3"
                                    )}>
                                      <LiveCasinoTile
                                        gameType="poker"
                                        shape="tall"
                                        title={pokerNames[index % pokerNames.length]}
                                        subtitle="Live BetOnline"
                                        bettingRange={pokerLimits[index % pokerLimits.length]}
                                        index={index}
                                        brandPrimary={brandPrimary}
                                        seats={{ occupied: pokerSeats[index % pokerSeats.length].o, total: pokerSeats[index % pokerSeats.length].t }}
                                        onClick={() => {
                                          setSelectedGame({
                                            title: pokerNames[index % pokerNames.length],
                                            image: getLiveImage('poker', 'tall', index),
                                            provider: getLiveVendor(index).name,
                                            features: ['Live Poker Tables', 'Tournament Play', 'Cash Game Options']
                                          })
                                        }}
                                      />
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
                        key="for-you-home"
                        initial={false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut"
                        }}
                        className="flex flex-col gap-6 relative"
                        style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0, overflow: 'visible' }}
                      >
                        {/* Game Category Carousels */}
                        <div className="space-y-8 relative" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0, overflow: 'visible' }}>

                        <>
                        {/* New Games Section - Square Tiles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>New Games (128)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                            <Button
                              variant="ghost"
                              className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                              onClick={() => {
                                  setSelectedCategory('Slots')
                                  setSelectedVendor('')
                                setShowAllGames(true)
                                  setActiveSubNav('Slots')
                              }}
                            >
                              All Games
                            </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (forYouSlotsCarouselApi) {
                                        const currentIndex = forYouSlotsCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        forYouSlotsCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!forYouSlotsCarouselApi || !forYouSlotsCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (forYouSlotsCarouselApi) {
                                        const currentIndex = forYouSlotsCarouselApi.selectedScrollSnap()
                                        const slideCount = forYouSlotsCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        forYouSlotsCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!forYouSlotsCarouselApi || !forYouSlotsCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setForYouSlotsCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const imageSrc = squareTileImages[index % squareTileImages.length]
                                  const slotNames = ['Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers', 'Mega Moolah', 'Bonanza']
                                  const slotTag = getMetaTag(index + 20)
                                  const slotVendor = getTileVendor(index + 20)
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[160px] rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={`Game ${index + 1}`}
                                            fill
                                            className={slotTileImgClass}
                                            sizes="160px"
                                          />
                                        )}
                                        <GameTagBadge tag={slotTag} vendor={slotVendor} />
                                                                                <GameTilePlayOverlay
                                          favoriteTitle={slotNames[index % slotNames.length]}
                                          onLaunch={() => {
                                          setSelectedGame({
                                            title: slotNames[index % slotNames.length],
                                            image: imageSrc,
                                            provider: slotVendor,
                                            features: ['High RTP', 'Free Spins Feature', 'Bonus Rounds Available']
                                          })
                                        }}
                                        />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        
                        {/* Originals Section - Tall Rectangles (moved above Blackjack) */}
                        <div id="casino-originals-carousel" className="scroll-mt-28 md:scroll-mt-32">
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Originals (26)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Originals')
                                  setShowAllGames(true)
                                  setActiveSubNav('Originals')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (originalsCarouselApi) {
                                        const currentIndex = originalsCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        originalsCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!originalsCarouselApi || !originalsCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (originalsCarouselApi) {
                                        const currentIndex = originalsCarouselApi.selectedScrollSnap()
                                        const slideCount = originalsCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        originalsCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!originalsCarouselApi || !originalsCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setOriginalsCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {originalsTileImages.map((imageSrc, index) => {
                                  const gameNames = ['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker']
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[280px] rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                      >
                                        <Image
                                          src={imageSrc}
                                          alt={`${gameNames[index] || `Originals Game ${index + 1}`}`}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                                          sizes="160px"
                                          onError={(e) => {
                                            e.currentTarget.src = squareTileImages[index % squareTileImages.length]
                                          }}
                                        />
                                        <GameTagBadge tag="Original" vendor="Originals" />
                                        <div className="pointer-events-none absolute bottom-2 right-2 z-30 opacity-0 transition-opacity group-hover:opacity-100">
                                          <IconInfoCircle className="w-4 h-4 text-[var(--ds-fg)] drop-shadow-lg" strokeWidth={2} />
                                        </div>
                                        <GameTilePlayOverlay
                                          favoriteTitle={['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker'][index] || `Originals Game ${index + 1}`}
                                          onLaunch={() => {
                                            const originalGameNames = ['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker']
                                            setSelectedGame({
                                              title: originalGameNames[index] || `Originals Game ${index + 1}`,
                                              image: imageSrc,
                                              provider: 'BetOnline',
                                              features: ['Original Game', 'Unique Gameplay', 'Exclusive to BetOnline']
                                            })
                                          }}
                                        />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Top 10 This Week — above Blackjack */}
                        <Top10GamesCarousel
                          onSelectGame={(g) => setSelectedGame(g)}
                        />

                        {/* BlackJack Section - Square Tiles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ width: '100%', maxWidth: '100%', overflow: 'visible', boxSizing: 'border-box', display: 'flex', minWidth: 0 }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>BlackJack (52)</h2>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                              style={{ flex: '0 0 auto', flexShrink: 0, visibility: 'visible', opacity: 1, display: 'inline-flex', whiteSpace: 'nowrap' }}
                                onClick={() => {
                                setSelectedCategory('BlackJack')
                                  setShowAllGames(true)
                                setActiveSubNav('Lobby')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (forYouBlackjackCarouselApi) {
                                        const currentIndex = forYouBlackjackCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        forYouBlackjackCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!forYouBlackjackCarouselApi || !forYouBlackjackCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (forYouBlackjackCarouselApi) {
                                        const currentIndex = forYouBlackjackCarouselApi.selectedScrollSnap()
                                        const slideCount = forYouBlackjackCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        forYouBlackjackCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!forYouBlackjackCarouselApi || !forYouBlackjackCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setForYouBlackjackCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const gameNames = ['Blackjack Classic', 'VIP Blackjack', 'European Blackjack', 'American Blackjack', 'Perfect Pairs', '21+3 Blackjack', 'Blackjack Surrender', 'Blackjack Switch', 'Double Exposure', 'Blackjack Pro']
                                  const bjLimits = ['$25 - $500', '$100 - $1,000', '$10 - $250', '$50 - $500', '$25 - $100', '$5 - $250', '$100 - $5,000', '$25 - $500', '$50 - $1,000', '$10 - $500']
                                  const bjSeats = [{o:3,t:7},{o:5,t:7},{o:2,t:6},{o:4,t:7},{o:6,t:7},{o:1,t:6},{o:4,t:7},{o:3,t:6},{o:5,t:7},{o:2,t:7}]
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-3"
                                    )}>
                                      <LiveCasinoTile
                                        gameType="blackjack"
                                        shape="rectangle"
                                        title={gameNames[index % gameNames.length]}
                                        subtitle="Live BetOnline"
                                        bettingRange={bjLimits[index % bjLimits.length]}
                                        index={index + 10}
                                        brandPrimary={brandPrimary}
                                        seats={{ occupied: bjSeats[index % bjSeats.length].o, total: bjSeats[index % bjSeats.length].t }}
                                        onClick={() => {
                                          setSelectedGame({
                                            title: gameNames[index % gameNames.length],
                                            image: getLiveImage('blackjack', 'rectangle', index + 10),
                                            provider: getLiveVendor(index).name,
                                            features: ['Classic Card Game', 'Multiple Betting Options', 'Live Dealer Available']
                                          })
                                        }}
                                      />
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Vendors Carousel */}
                        {activeSubNav === 'Lobby' && !showAllGames && (
                          <div 
                            className="relative w-full mt-6 mb-10 overflow-visible"
                            style={{ overflow: 'visible' }}
                          >
                            <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                              <Carousel className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                                {!isMobile && (
                                  <>
                                    <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20" />
                                    <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] z-20" />
                                  </>
                                )}
                                <CarouselContent className="ml-0 pr-4 md:pr-6" style={{ overflow: 'visible' }}>
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
                                        className="group relative bg-gray-100/80 dark:bg-[var(--ds-control-bg)] border border-gray-200 dark:border-[var(--ds-border)] rounded-lg px-3 py-2.5 text-xs font-medium text-gray-800 dark:text-[var(--ds-fg-muted)] hover:bg-gray-200/80 dark:hover:bg-[var(--ds-control-hover)] hover:text-black dark:hover:text-[var(--ds-fg)] transition-all duration-300 whitespace-nowrap overflow-hidden flex items-center gap-2"
                                        onClick={() => {
                                          setSelectedVendor(vendor)
                                          setSelectedCategory('')
                                          setShowAllGames(true)
                                          setActiveSubNav('')
                                          setActiveIconTab('search') // Reset icon tab when selecting vendor
                                        }}
                                      >
                                        {/* Vendor Icon */}
                                        <VendorIcon vendor={vendor} />
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

                        {/* Recently Played — below vendors */}
                        <div>
                          <div
                            className={cn(
                              'mb-6 flex items-center justify-between relative z-10',
                              isMobile ? 'px-3' : 'px-6'
                            )}
                          >
                            <h2 className="min-w-0 flex-1 truncate text-lg font-semibold text-black transition-colors duration-300 dark:text-[var(--ds-fg)]">
                              Recently Played (4)
                            </h2>
                          </div>
                          <div
                            className="relative"
                            style={{
                              overflow: 'visible',
                              position: 'relative',
                              width: '100%',
                              maxWidth: '100%',
                              boxSizing: 'border-box',
                              minWidth: 0,
                            }}
                          >
                            <Carousel
                              className="relative w-full"
                              style={{
                                overflow: 'visible',
                                position: 'relative',
                                width: '100%',
                                maxWidth: '100%',
                                minWidth: 0,
                              }}
                              opts={{
                                dragFree: true,
                                containScroll: 'trimSnaps',
                                duration: 15,
                              }}
                            >
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {[
                                  {
                                    title: 'Gemhalla Xtreme',
                                    image: squareTileImages[0],
                                  },
                                  {
                                    title: 'Money Maker',
                                    image: squareTileImages[10],
                                  },
                                  {
                                    title: 'Heart of Tiki',
                                    image: squareTileImages[7],
                                  },
                                  {
                                    title: 'Fiesta Clusters',
                                    image: squareTileImages[12],
                                  },
                                ].map((game, index) => {
                                  const tag = getMetaTag(index + 30)
                                  const vendor = getTileVendor(index + 30)
                                  return (
                                    <CarouselItem
                                      key={`recently-played-${index}`}
                                      className={cn(
                                        'basis-auto flex-shrink-0 pr-0',
                                        index === 0
                                          ? isMobile
                                            ? 'pl-3'
                                            : 'pl-6'
                                          : 'pl-2 md:pl-4'
                                      )}
                                    >
                                      <div
                                        data-content-item
                                        className="group relative h-[160px] w-[160px] flex-shrink-0 cursor-pointer overflow-hidden rounded-small bg-[var(--ds-control-bg)] transition-all duration-300 hover:bg-[var(--ds-control-hover)]"
                                      >
                                        <Image
                                          src={game.image}
                                          alt={game.title}
                                          fill
                                          className={slotTileImgClass}
                                          sizes="160px"
                                        />
                                        <GameTagBadge tag={tag} vendor={vendor} />
                                        <GameTilePlayOverlay
                                          favoriteTitle={game.title}
                                          onLaunch={() =>
                                            setSelectedGame({
                                              title: game.title,
                                              image: game.image,
                                              provider: vendor,
                                              features: [
                                                'Recently Played',
                                                'Quick Resume',
                                                'Continue Where You Left Off',
                                              ],
                                            })
                                          }
                                        />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                                <CarouselItem
                                  key="recently-played-random"
                                  className="basis-auto flex-shrink-0 pr-0 pl-2 md:pl-4"
                                >
                                  <PlayRandomTile
                                    onLaunch={() => {
                                      const randomIndex = Math.floor(
                                        Math.random() * squareTileImages.length
                                      )
                                      const gameNames = [
                                        'Gold Nugget Rush',
                                        'Mega Fortune',
                                        'Starburst',
                                        'Book of Dead',
                                        "Gonzo's Quest",
                                        'Dead or Alive',
                                        'Immortal Romance',
                                        'Thunderstruck',
                                        'Avalon',
                                        'Blood Suckers',
                                      ]
                                      setSelectedGame({
                                        title: gameNames[randomIndex % gameNames.length],
                                        image: squareTileImages[randomIndex],
                                        provider: 'Evolution Gaming',
                                        features: [
                                          'Random Pick!',
                                          'Surprise Game Feature',
                                        ],
                                      })
                                    }}
                                  />
                                </CarouselItem>
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Activity Section */}
                        <CasinoActivityPanel
                          isMobile={isMobile}
                          heading={activeSubNav === 'Jackpots' ? 'Jackpot activity' : 'Activity'}
                          tabLayoutId="casinoActivityTab"
                          casinoActivityTab={casinoActivityTab}
                          onCasinoActivityTabChange={setCasinoActivityTab}
                          casinoRaceHours={casinoRaceHours}
                          casinoRaceMinutes={casinoRaceMinutes}
                          casinoRaceSeconds={casinoRaceSeconds}
                          casinoRaceLeaderboardData={casinoRaceLeaderboardData}
                          casinoUserRacePosition={casinoUserRacePosition}
                          casinoJackpotWinnersData={casinoJackpotWinnersData}
                          casinoActivityFeed={casinoActivityFeed}
                          onSelectGame={(g) => setSelectedGame(g)}
                          onLiveFeedHoverChange={(hovering) => {
                            casinoActivityFeedPausedRef.current = hovering
                          }}
                        />

                        {activeSubNav !== 'Jackpots' && (
                        <>
                        {/* Most Popular Section - Square Tiles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Most Popular (64)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Popular')
                                  setShowAllGames(true)
                                  setActiveSubNav('Lobby')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (popularCarouselApi) { popularCarouselApi.scrollTo(Math.max(0, popularCarouselApi.selectedScrollSnap() - 2)) } }} disabled={!popularCarouselApi || !popularCanScrollPrev}><IconChevronLeft className="h-4 w-4" strokeWidth={2} /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (popularCarouselApi) { popularCarouselApi.scrollTo(Math.min(popularCarouselApi.scrollSnapList().length - 1, popularCarouselApi.selectedScrollSnap() + 2)) } }} disabled={!popularCarouselApi || !popularCanScrollNext}><IconChevronRight className="h-4 w-4" strokeWidth={2} /></Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setPopularCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 12 }).map((_, index) => {
                                  const imageSrc = squareTileImages[(index + 5) % squareTileImages.length]
                                  const popularNames = ['Sweet Bonanza', 'Gates of Olympus', 'Sugar Rush', 'Big Bass Splash', 'Fruit Party', 'Wolf Gold', 'The Dog House', 'Starlight Princess', 'Buffalo King', 'Gems Bonanza', 'Money Train', 'Crystal Caverns']
                                  const popularTag = getMetaTag(index + 50)
                                  const popularVendor = getTileVendor(index + 50)
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[160px] rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={popularNames[index % popularNames.length]}
                                            fill
                                            className={slotTileImgClass}
                                            sizes="160px"
                                          />
                                        )}
                                        <GameTagBadge tag={popularTag} vendor={popularVendor} />
                                                                                <GameTilePlayOverlay
                                          favoriteTitle={popularNames[index % popularNames.length]}
                                          onLaunch={() => {
                                          setSelectedGame({
                                            title: popularNames[index % popularNames.length],
                                            image: imageSrc,
                                            provider: popularVendor,
                                            features: ['Top Rated', 'High RTP', 'Fan Favorite']
                                          })
                                        }}
                                        />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Baccarat Section - Rectangle Tiles Carousel */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Baccarat (23)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Baccarat')
                                  setShowAllGames(true)
                                  setActiveSubNav('Lobby')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (forYouBaccaratCarouselApi) {
                                        const currentIndex = forYouBaccaratCarouselApi.selectedScrollSnap()
                                        const targetIndex = Math.max(0, currentIndex - 2)
                                        forYouBaccaratCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!forYouBaccaratCarouselApi || !forYouBaccaratCanScrollPrev}
                                  >
                                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                      if (forYouBaccaratCarouselApi) {
                                        const currentIndex = forYouBaccaratCarouselApi.selectedScrollSnap()
                                        const slideCount = forYouBaccaratCarouselApi.scrollSnapList().length
                                        const targetIndex = Math.min(slideCount - 1, currentIndex + 2)
                                        forYouBaccaratCarouselApi.scrollTo(targetIndex)
                                      }
                                    }}
                                    disabled={!forYouBaccaratCarouselApi || !forYouBaccaratCanScrollNext}
                                  >
                                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setForYouBaccaratCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 8 }).map((_, index) => {
                                  const baccaratNames = ['Baccarat Classic', 'Punto Banco', 'Baccarat Squeeze', 'Speed Baccarat', 'Lightning Baccarat', 'Baccarat Control Squeeze', 'VIP Baccarat', 'Dragon Tiger']
                                  const baccaratLimits = ['$1 - $12,500', '$25 - $100', '$5 - $500', '$10 - $1,000', '$50 - $5,000', '$1 - $250', '$100 - $10,000', '$25 - $250']
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-3"
                                    )}>
                                      <LiveCasinoTile
                                        gameType="baccarat"
                                        shape="rectangle"
                                        title={baccaratNames[index % baccaratNames.length]}
                                        subtitle="Live BetOnline"
                                        bettingRange={baccaratLimits[index % baccaratLimits.length]}
                                        index={index + 20}
                                        brandPrimary={brandPrimary}
                                        onClick={() => {
                                          setSelectedGame({
                                            title: baccaratNames[index % baccaratNames.length],
                                            image: getLiveImage('baccarat', 'rectangle', index + 20),
                                            provider: getLiveVendor(index).name,
                                            features: ['Live Dealer', 'Multiple Side Bets', 'High Stakes Available']
                                          })
                                        }}
                                      />
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Exclusives Section - Square Tiles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Exclusives (32)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Exclusives')
                                  setShowAllGames(true)
                                  setActiveSubNav('Lobby')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (exclusivesCarouselApi) { exclusivesCarouselApi.scrollTo(Math.max(0, exclusivesCarouselApi.selectedScrollSnap() - 2)) } }} disabled={!exclusivesCarouselApi || !exclusivesCanScrollPrev}><IconChevronLeft className="h-4 w-4" strokeWidth={2} /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (exclusivesCarouselApi) { exclusivesCarouselApi.scrollTo(Math.min(exclusivesCarouselApi.scrollSnapList().length - 1, exclusivesCarouselApi.selectedScrollSnap() + 2)) } }} disabled={!exclusivesCarouselApi || !exclusivesCanScrollNext}><IconChevronRight className="h-4 w-4" strokeWidth={2} /></Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setExclusivesCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const imageSrc = squareTileImages[(index + 8) % squareTileImages.length]
                                  const exclusiveNames = ['Golden Dragon', 'Royal Fortune', 'Diamond Heist', 'Mystic Gems', 'Pirate\'s Bounty', 'Phoenix Rising', 'Aztec Treasure', 'Neon Nights', 'Cosmic Cash', 'Wild Safari']
                                  const exclusiveVendor = getTileVendor(index + 60)
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[160px] rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={exclusiveNames[index % exclusiveNames.length]}
                                            fill
                                            className={slotTileImgClass}
                                            sizes="160px"
                                          />
                                        )}
                                        <GameTagBadge tag="Exclusive" vendor={exclusiveVendor} />
                                                                                <GameTilePlayOverlay
                                          favoriteTitle={exclusiveNames[index % exclusiveNames.length]}
                                          onLaunch={() => {
                                          setSelectedGame({
                                            title: exclusiveNames[index % exclusiveNames.length],
                                            image: imageSrc,
                                            provider: exclusiveVendor,
                                            features: ['Exclusive to BetOnline', 'Unique Features', 'Special Bonuses']
                                          })
                                        }}
                                        />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Seasonal event feature — switcher for Halloween / Christmas / Superbowl / Easter */}
                        <SeasonalEventGamesBlock
                          tileImages={squareTileImages}
                          onBrowseAll={(eventId) => {
                            const category =
                              eventId === 'halloween'
                                ? 'Halloween'
                                : eventId === 'christmas'
                                  ? 'Christmas'
                                  : eventId === 'superbowl'
                                    ? 'Superbowl'
                                    : 'Easter'
                            setSelectedCategory(category)
                            setShowAllGames(true)
                            setActiveSubNav('Lobby')
                          }}
                          onSelectGame={(g) => setSelectedGame(g)}
                        />

                        {/* Crash Games Section - Square Tiles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Crash Games (18)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Crash')
                                  setShowAllGames(true)
                                  setActiveSubNav('Lobby')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (crashCarouselApi) { crashCarouselApi.scrollTo(Math.max(0, crashCarouselApi.selectedScrollSnap() - 2)) } }} disabled={!crashCarouselApi || !crashCanScrollPrev}><IconChevronLeft className="h-4 w-4" strokeWidth={2} /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (crashCarouselApi) { crashCarouselApi.scrollTo(Math.min(crashCarouselApi.scrollSnapList().length - 1, crashCarouselApi.selectedScrollSnap() + 2)) } }} disabled={!crashCarouselApi || !crashCanScrollNext}><IconChevronRight className="h-4 w-4" strokeWidth={2} /></Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setCrashCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const imageSrc = squareTileImages[(index + 12) % squareTileImages.length]
                                  const crashNames = ['Aviator', 'Spaceman', 'JetX', 'Cash or Crash', 'Rocket Blast', 'Sky High', 'Moon Rider', 'Turbo Crash', 'Lucky Jet', 'Cosmic Crash']
                                  const crashTag = getMetaTag(index + 70)
                                  const crashVendor = getTileVendor(index + 70)
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[160px] rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={crashNames[index % crashNames.length]}
                                            fill
                                            className={slotTileImgClass}
                                            sizes="160px"
                                          />
                                        )}
                                        <GameTagBadge tag={crashTag} vendor={crashVendor} />
                                                                                <GameTilePlayOverlay
                                          favoriteTitle={crashNames[index % crashNames.length]}
                                          onLaunch={() => {
                                          setSelectedGame({
                                            title: crashNames[index % crashNames.length],
                                            image: imageSrc,
                                            provider: crashVendor,
                                            features: ['Crash Gameplay', 'Multiplier Rewards', 'Fast-Paced Action']
                                          })
                                        }}
                                        />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Cash Tournaments Carousel */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-4 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Cash Tournaments ({cashTournamentsData.length})</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Tournaments')
                                  setShowAllGames(true)
                                  setActiveSubNav('Lobby')
                                }}
                              >
                                View All
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (tournamentCarouselApi) { tournamentCarouselApi.scrollTo(Math.max(0, tournamentCarouselApi.selectedScrollSnap() - 1)) } }} disabled={!tournamentCarouselApi || !tournamentCanScrollPrev}><IconChevronLeft className="h-4 w-4" strokeWidth={2} /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (tournamentCarouselApi) { tournamentCarouselApi.scrollTo(Math.min(tournamentCarouselApi.scrollSnapList().length - 1, tournamentCarouselApi.selectedScrollSnap() + 1)) } }} disabled={!tournamentCarouselApi || !tournamentCanScrollNext}><IconChevronRight className="h-4 w-4" strokeWidth={2} /></Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setTournamentCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {cashTournamentsData.map((tournament, tIdx) => (
                                  <CarouselItem key={tournament.id} className={cn(
                                    "pr-0 basis-auto flex-shrink-0",
                                    tIdx === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                  )}>
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.4, delay: tIdx * 0.06, type: "spring", bounce: 0.2 }}
                                      whileHover={{ y: -4 }}
                                      className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--ds-page-bg)] border border-[var(--ds-control-border)] hover:border-white/[0.12] transition-all duration-300"
                                      style={{ width: isMobile ? '260px' : '280px' }}
                                    >
                                      {/* Image */}
                                      <div className="relative h-28 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-black/40 to-transparent z-10" />
                                        <Image src={tournament.image} alt={tournament.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="280px" />
                                        <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                          <h3 className="text-[13px] font-bold text-[var(--ds-fg)] leading-tight truncate">{tournament.name}</h3>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <IconTrophy className="w-3 h-3 text-yellow-400" />
                                            <span className="text-xs font-bold text-yellow-400">{tournament.prizePool}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Countdown */}
                                      <div className="px-3 pt-2">
                                        <TournamentCountdown endDate={tournament.endDate} />
                                      </div>

                                      {/* Details */}
                                      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-2 flex-1">
                                        <div className="space-y-1">
                                          {[
                                            { icon: <IconStopwatch className="w-3 h-3 shrink-0 text-[var(--ds-fg-subtle)]" />, label: 'Type', value: tournament.gameType },
                                            { icon: <IconRefresh className="w-3 h-3 shrink-0 text-[var(--ds-fg-subtle)]" />, label: 'Rounds', value: tournament.rounds },
                                            { icon: <IconArrowsSort className="w-3 h-3 shrink-0 text-[var(--ds-fg-subtle)]" />, label: 'Bets', value: tournament.betRange },
                                          ].map((row: { icon: React.ReactNode; label: string; value: string; bold?: boolean }) => (
                                            <div key={row.label} className="flex items-center gap-1.5 text-[11px] min-w-0">
                                              {row.icon}
                                              <span className="text-[var(--ds-fg-subtle)] shrink-0">{row.label}</span>
                                              <span className={cn("ml-auto text-right truncate", row.bold ? "font-semibold text-[var(--ds-fg)]" : "font-medium text-[var(--ds-fg-muted)]")}>{row.value}</span>
                                            </div>
                                          ))}
                                        </div>

                                        <div className="flex-1" />

                                        <div className="w-full border-t border-[var(--ds-control-border)] my-0.5" />

                                        <div className="flex items-center gap-2">
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); setLeaderboardTournament(tournament) }}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--ds-control-bg)] hover:bg-white/[0.1] transition-colors"
                                          >
                                            <IconTrophy className="w-3.5 h-3.5 text-[var(--ds-fg)]" />
                                            {tournament.leaderboard.find(e => e.isMe) && (
                                              <span className="text-[10px] font-bold text-[var(--ds-fg-muted)]">
                                                #{tournament.leaderboard.find(e => e.isMe)?.rank}
                                              </span>
                                            )}
                                          </button>
                                          <div className="flex-1" />
                                          <button 
                                            onClick={() => setSelectedGame({ title: tournament.name, image: tournament.image, provider: tournament.provider, features: [`${tournament.gameType}`, `${tournament.rounds}`, `Prize Pool: ${tournament.prizePool}`] })}
                                            className="flex-1 py-1.5 rounded-md text-xs font-bold text-[var(--ds-fg)] text-center transition-all duration-200 hover:brightness-110 active:scale-95"
                                            style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                                          >
                                            Play
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>

                        {/* Instant Wins Section - Square Tiles */}
                        <div>
                          <div className={cn(
                            "flex items-center justify-between mb-6 relative z-10",
                            isMobile ? "px-3" : "px-6"
                          )} style={{ maxWidth: '100%', width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
                            <h2 className="text-lg font-semibold text-black dark:text-[var(--ds-fg)] flex-shrink-0 min-w-0 transition-colors duration-300" style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Instant Wins (24)</h2>
                            <div className="flex items-center gap-2 relative z-10 flex-shrink-0 ml-2" style={{ visibility: 'visible', opacity: 1, display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>
                              <Button
                                variant="ghost"
                                className="text-[var(--ds-fg-muted)] dark:text-[var(--ds-fg-muted)] text-gray-900 dark:text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] dark:hover:text-[var(--ds-fg)] hover:text-black dark:hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] dark:hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 dark:border-white/20 border-gray-300 dark:border-white/20 rounded-small relative z-10 whitespace-nowrap transition-colors duration-300"
                                style={{ visibility: 'visible', opacity: 1, display: 'inline-flex', flexShrink: 0, whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  setSelectedCategory('Instant Wins')
                                  setShowAllGames(true)
                                  setActiveSubNav('Lobby')
                                }}
                              >
                                All Games
                              </Button>
                              {!isMobile && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (instantCarouselApi) { instantCarouselApi.scrollTo(Math.max(0, instantCarouselApi.selectedScrollSnap() - 2)) } }} disabled={!instantCarouselApi || !instantCanScrollPrev}><IconChevronLeft className="h-4 w-4" strokeWidth={2} /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { if (instantCarouselApi) { instantCarouselApi.scrollTo(Math.min(instantCarouselApi.scrollSnapList().length - 1, instantCarouselApi.selectedScrollSnap() + 2)) } }} disabled={!instantCarouselApi || !instantCanScrollNext}><IconChevronRight className="h-4 w-4" strokeWidth={2} /></Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                            <Carousel setApi={setInstantCarouselApi} className="w-full relative" style={{ overflow: 'visible', position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0 }} opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                              <CarouselContent className="ml-0 pr-4 md:pr-6">
                                {Array.from({ length: 10 }).map((_, index) => {
                                  const imageSrc = squareTileImages[(index + 15) % squareTileImages.length]
                                  const instantNames = ['Scratch & Win', 'Lucky Numbers', 'Gold Rush', 'Cash Spin', 'Diamond Pick', 'Fortune Wheel', 'Treasure Hunt', 'Lucky Stars', 'Instant Millions', 'Quick Hit']
                                  const instantTag = getMetaTag(index + 90)
                                  const instantVendor = getTileVendor(index + 90)
                                  return (
                                    <CarouselItem key={index} className={cn(
                                      "pr-0 basis-auto flex-shrink-0",
                                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                                    )}>
                                      <div 
                                        data-content-item 
                                        className="w-[160px] h-[160px] rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                                        
                                      >
                                        {imageSrc && (
                                          <Image
                                            src={imageSrc}
                                            alt={instantNames[index % instantNames.length]}
                                            fill
                                            className={slotTileImgClass}
                                            sizes="160px"
                                          />
                                        )}
                                        <GameTagBadge tag={instantTag} vendor={instantVendor} />
                                                                                <GameTilePlayOverlay
                                          favoriteTitle={instantNames[index % instantNames.length]}
                                          onLaunch={() => {
                                          setSelectedGame({
                                            title: instantNames[index % instantNames.length],
                                            image: imageSrc,
                                            provider: instantVendor,
                                            features: ['Instant Results', 'Quick Gameplay', 'Guaranteed Prizes']
                                          })
                                        }}
                                        />
                                      </div>
                                    </CarouselItem>
                                  )
                                })}
                              </CarouselContent>
                            </Carousel>
                          </div>
                        </div>
                        </>
                        )}
                        </>
                      </div>
                    </motion.div>
                    )}
                  </AnimatePresence>
              </div>
                </motion.div>
            )}
            </AnimatePresence>
              
              {/* Footer - responsive to sidebar state, hidden on VIP/Sports/Poker pages which have their own layouts */}
              {!showVipRewards && !showSports && !showPoker && (
                <SiteFooter />
              )}
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
            
            <div className={cn("flex-1 overflow-y-auto", isMobile ? "px-4 pt-4 pb-3" : "px-4 pt-6 pb-3")}>
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
                      {webInboxUnreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                          {webInboxUnreadCount}
                        </span>
                      )}
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
                        router.push('/sports?mybets=pending')
                      }}
                    >
                      <IconFileText className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)] flex-shrink-0" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Pending Bets</span>
                      <span className="ml-auto flex items-center gap-1.5 text-sm text-[var(--ds-fg-muted)]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ds-control-hover)] text-[10px] font-bold text-[var(--ds-fg-muted)]">
                          4
                        </span>
                        $40.00
                      </span>
                </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                      onClick={() => {
                        setAccountDrawerOpen(false)
                        router.push('/account?section=transactions')
                      }}
                    >
                      <IconCurrencyDollar className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Transactions History</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                      onClick={() => {
                        setAccountDrawerOpen(false)
                        router.push('/account?section=bet-history')
                      }}
                    >
                      <IconTicket className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Bet History</span>
                    </Button>

                    <Separator className={cn("bg-[var(--ds-control-hover)]", isMobile ? "my-3" : "my-4")} />
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                      onClick={() => {
                        setAccountDrawerOpen(false)
                        router.push('/promotions/my-bonus')
                      }}
                    >
                      <IconGift className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">My Bonus</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                      onClick={() => {
                        setAccountDrawerOpen(false)
                        router.push('/promotions/refer-a-friend')
                      }}
                    >
                      <IconUserPlus className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Refer a Friend</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-12 px-3"
                      onClick={() => {
                        setAccountDrawerOpen(false)
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
                      onClick={() => {
                        setAccountDrawerOpen(false)
                        router.push('/')
                      }}
                    >
                      <IconLogout className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                      <span className="flex-1 text-left text-[var(--ds-fg)]">Log Out</span>
                    </Button>
              </div>
                </>
              ) : (
                <>
                  <NotificationHub />
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
          dismissible={!hubFocusMode}
        >
          <DrawerContent 
            showOverlay={isMobile || hubFocusMode}
            overlayClassName={hubFocusMode ? 'bg-black/80 backdrop-blur-md' : undefined}
            onOverlayClick={hubFocusMode ? () => {} : undefined}
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

        {/* Search Overlay — portaled so it stacks above the fixed nav header (z-101) */}
        {typeof document !== 'undefined' && createPortal(
        <AnimatePresence mode="wait">
          {searchOverlayOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100100] overflow-y-auto"
              data-casino-search-overlay
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSearchOverlayOpen(false)
                  setSearchQuery('')
                  setActiveSubNav('Lobby')
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
                className="min-h-screen bg-[var(--ds-page-bg)] text-[var(--ds-fg)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search Header — fully opaque, no glass */}
                <div className="sticky top-0 z-50 isolate border-b border-[var(--ds-border)] bg-[var(--ds-page-bg)] px-4 py-4 md:px-6">
                  <div className="mx-auto max-w-7xl">
                    <div className="flex items-center gap-3">
                      <div className="relative min-w-0 flex-1">
                        <IconSearchNew className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--ds-fg-subtle)]" />
                        <input
                          type="text"
                          placeholder="Search games"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-11 w-full rounded-xl border border-[var(--ds-border)] bg-[var(--ds-control-bg)] pl-11 pr-10 text-sm text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)] focus:border-white/20 focus:outline-none"
                          autoFocus
                        />
                        {searchQuery ? (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--ds-fg-subtle)] transition-colors hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]"
                            aria-label="Clear search"
                          >
                            <IconX className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSearchOverlayOpen(false)
                          setSearchQuery('')
                          setAdvancedSearchOpen(false)
                          setActiveSubNav('Lobby')
                          setShowAllGames(false)
                          setSelectedCategory('')
                          setSelectedVendor('')
                          setSelectedGame(null)
                          setTimeout(() => {
                            const mainContent = document.querySelector('[data-content-item]')
                            if (mainContent) {
                              ;(mainContent as HTMLElement).focus()
                            }
                          }, 100)
                        }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-border)] bg-[var(--ds-control-bg)] text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]"
                        aria-label="Close search"
                      >
                        <IconX className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setAdvancedSearchOpen(true)
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[var(--ds-control-bg)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-control-hover)]"
                      >
                        <IconFilter className="h-3.5 w-3.5 text-[var(--ds-fg-muted)]" />
                        Advanced search
                        <IconChevronDown className="h-3.5 w-3.5 text-[var(--ds-fg-muted)]" />
                      </button>
                      <span className="text-xs text-[var(--ds-fg-subtle)]">
                        {advFilterCount === 0
                          ? 'No filters applied'
                          : `${advFilterCount} filter${advFilterCount === 1 ? '' : 's'} applied`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                <div className="relative z-0 mx-auto max-w-7xl px-4 py-6 md:px-6">
                  {(() => {
                    const searchGames = Array.from({ length: 24 }).map((_, index) => {
                      const titles = [
                        'Starburst',
                        'Book of Dead',
                        "Gonzo's Quest",
                        'Dead or Alive',
                        'Immortal Romance',
                        'Thunderstruck',
                        'Avalon',
                        'Blood Suckers',
                        'Mega Moolah',
                        'Bonanza',
                        'Razor Shark',
                        'Sweet Bonanza',
                        'Gates of Olympus',
                        'Big Bass Bonanza',
                        'The Dog House',
                        'Wolf Gold',
                        'Fire Strike',
                        'Chilli Heat',
                        'Reactoonz',
                        'Jammin Jars',
                        'Fruit Shop',
                        'Legacy of Dead',
                        'Money Train 2',
                        'Wanted Dead or a Wild',
                      ]
                      const title = titles[index % titles.length]
                      const provider = getTileVendor(index + 40)
                      return {
                        id: index,
                        title,
                        provider,
                        image: squareTileImages[index % squareTileImages.length],
                        tag: getMetaTag(index + 40),
                      }
                    })
                    const q = searchQuery.trim().toLowerCase()
                    const filtered = q
                      ? searchGames.filter(
                          (g) =>
                            g.title.toLowerCase().includes(q) ||
                            g.provider.toLowerCase().includes(q)
                        )
                      : searchGames
                    const heading = q
                      ? filtered.length
                        ? `Results for “${searchQuery.trim()}”`
                        : `No results for “${searchQuery.trim()}”`
                      : 'Recommended games'

                    return (
                      <>
                        <div className="mb-4 flex items-end justify-between gap-3">
                          <h3 className="text-lg font-semibold text-[var(--ds-fg)]">{heading}</h3>
                          {filtered.length > 0 && (
                            <span className="text-xs text-[var(--ds-fg-subtle)]">
                              {filtered.length} game{filtered.length === 1 ? '' : 's'}
                            </span>
                          )}
                        </div>

                        {filtered.length === 0 ? (
                          <div className="rounded-xl border border-[var(--ds-border)] bg-[var(--ds-control-bg)]/50 px-6 py-16 text-center">
                            <p className="text-sm text-[var(--ds-fg-muted)]">
                              Try a different name or clear your search.
                            </p>
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              className="mt-4 text-sm font-medium text-[var(--ds-fg)] underline-offset-2 hover:underline"
                            >
                              Clear search
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
                            {filtered.map((game) => (
                              <div
                                key={game.id}
                                className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-small bg-[var(--ds-control-bg)] transition-all duration-300 hover:bg-[var(--ds-control-hover)]"
                              >
                                <Image
                                  src={game.image}
                                  alt={game.title}
                                  fill
                                  className={slotTileImgClass}
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                                />
                                <GameTagBadge tag={game.tag} vendor={game.provider} />
                                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 tile-shimmer" />
                                <GameTilePlayOverlay
                                  favoriteTitle={game.title}
                                  onLaunch={() => {
                                    setSelectedGame({
                                      title: game.title,
                                      image: game.image,
                                      provider: game.provider,
                                      features: [
                                        'High RTP',
                                        'Free Spins Feature',
                                        'Bonus Rounds Available',
                                      ],
                                    })
                                    setSearchOverlayOpen(false)
                                    setSearchQuery('')
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
        )}

        {/* Game Detail Full Screen Overlay */}
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100010] flex flex-col bg-[var(--ds-page-bg)]"
            >
              {/* Top chrome: header stack + game body (flex — no fixed overlap) */}
              {!isFullscreen && isMobile && isLandscape ? (
                <motion.div
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-[100020] mx-3 mt-3 shrink-0 overflow-visible rounded-xl border border-[var(--ds-border)] bg-[var(--ds-page-bg)]/90 backdrop-blur-xl"
                >
                  <div
                    className={cn(
                      'grid h-9 min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-1 px-2',
                      gameLauncherJackpotsVisible && 'border-b border-[var(--ds-border)]'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGame(null)
                        setGameLauncherMenuOpen(false)
                        setIsFullscreen(false)
                      }}
                      className="relative z-10 flex h-7 shrink-0 items-center gap-1 rounded-full border border-white/15 bg-black/40 px-2 text-[10px] font-medium text-[var(--ds-fg)]"
                    >
                      <IconChevronLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      Lobby
                    </button>
                    <h2
                      className="min-w-0 overflow-hidden truncate px-1 text-left text-[11px] font-semibold text-[var(--ds-fg)]"
                      title={selectedGame.title}
                    >
                      {selectedGame.title}
                    </h2>
                    <div className="relative z-10 flex shrink-0 items-center gap-1 justify-self-end">
                    <JackpotLauncherDropdown
                      layout="header"
                      tickerVisible={gameLauncherJackpotsVisible}
                      onTickerToggle={() =>
                        setGameLauncherJackpotsVisible((v) => !v)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGame(null)
                        setGameLauncherMenuOpen(false)
                        setIsFullscreen(false)
                      }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-[var(--ds-control-hover)]"
                      aria-label="Close game"
                    >
                      <IconX className="h-4 w-4 text-[var(--ds-fg-muted)]" />
                    </button>
                    </div>
                  </div>
                  <GameLauncherJackpotRow visible={gameLauncherJackpotsVisible} />
                </motion.div>
              ) : !isFullscreen ? (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                  className={cn(
                    'relative z-[100020] shrink-0 overflow-visible rounded-2xl border border-[var(--ds-border)] backdrop-blur-xl',
                    isMobile ? 'mx-3 mt-3' : 'mx-4 mt-4'
                  )}
                  style={{
                    backgroundColor: 'rgba(26, 26, 26, 0.6)',
                  }}
                >
                  <div
                    className={cn(
                      'relative h-10 w-full min-w-0 overflow-visible px-2',
                      gameLauncherJackpotsVisible && 'border-b border-[var(--ds-border)]',
                      isMobile
                        ? 'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-1'
                        : 'flex items-center gap-1.5 md:gap-2 md:px-2.5'
                    )}
                  >
                    <div className="relative z-[100030] shrink-0" ref={gameLauncherMenuRef}>
                      <button
                        onClick={() => setGameLauncherMenuOpen(!gameLauncherMenuOpen)}
                        className="p-1.5 hover:bg-[var(--ds-control-hover)] rounded-full transition-colors"
                      >
                        {/* Custom Staggered Hamburger Icon */}
                        <svg
                          className="w-4 h-4 text-[var(--ds-fg)]"
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
                      
                      {/* Dropdown Menu — portaled so parent backdrop-blur can't glass it */}
                      {typeof document !== 'undefined' &&
                        createPortal(
                          <AnimatePresence>
                            {gameLauncherMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="fixed z-[100060] w-56 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                                data-game-launcher-menu
                                style={{
                                  backgroundColor: '#2d2d2d',
                                  top:
                                    (gameLauncherMenuRef.current?.getBoundingClientRect().bottom ?? 64) +
                                    8,
                                  left:
                                    gameLauncherMenuRef.current?.getBoundingClientRect().left ?? 16,
                                }}
                              >
                            <div className="py-2">
                              {isMobile && (
                                <GameTileFavoriteButton
                                  variant="menu"
                                  favorited={favoritedGames.has(
                                    hashGameTitle(selectedGame.title)
                                  )}
                                  onToggle={() => {
                                    const wasFav = favoritedGames.has(
                                      hashGameTitle(selectedGame.title)
                                    )
                                    toggleGameFavorite(selectedGame.title)
                                    // Let the like burst play before closing the menu
                                    window.setTimeout(
                                      () => setGameLauncherMenuOpen(false),
                                      wasFav ? 0 : 850
                                    )
                                  }}
                                />
                              )}
                              <button
                                onClick={() => {
                                  setGameLauncherMenuOpen(false)
                                  setAccountDrawerOpen(false)
                                  setVipDrawerOpen(false)
                                  useChatStore.getState().setIsOpen(false)
                                  trackClick('deposit', 'Deposit')
                                  trackPageView('deposit-drawer', 'Deposit Drawer')
                                  setDepositDrawerOpen(true)
                                }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm"
                              >
                                Quick Deposit
                  </button>
                              <button
                                onClick={() => {
                                  setGameLauncherMenuOpen(false)
                                  setSimilarGamesDrawerOpen(true)
                                }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm"
                              >
                                More Games Like This
                  </button>
                            </div>
                            
                            {/* VIP Progress Bar */}
                            <div className="px-4 py-3 border-t border-white/10 bg-white/[0.04]">
                              <div className="text-xs text-white/60 mb-2">Gold To Platinum I</div>
                              <VipTierProgressBar value={45} variant="compact" showOriginalsNote={false} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>,
                          document.body
                        )}
                    </div>

                    {isMobile ? (
                      <h2
                        className="min-w-0 overflow-hidden truncate px-1 text-left text-xs font-semibold text-[var(--ds-fg)]"
                        title={selectedGame.title}
                      >
                        {selectedGame.title}
                      </h2>
                    ) : (
                      <h2
                        className="pointer-events-none absolute left-1/2 top-1/2 z-0 max-w-[calc(100%-14rem)] -translate-x-1/2 -translate-y-1/2 truncate text-center text-sm font-semibold text-[var(--ds-fg)]"
                        title={selectedGame.title}
                      >
                        {selectedGame.title}
                      </h2>
                    )}

                    <div
                      className={cn(
                        'relative z-10 flex shrink-0 items-center gap-1',
                        !isMobile && 'ml-auto'
                      )}
                    >
                    <JackpotLauncherDropdown
                      layout="header"
                      tickerVisible={gameLauncherJackpotsVisible}
                      onTickerToggle={() =>
                        setGameLauncherJackpotsVisible((v) => !v)
                      }
                    />
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
                          className="p-1.5 hover:bg-[var(--ds-control-hover)] rounded-full transition-colors"
                        >
                          <IconMaximize className="w-4 h-4 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]" />
                        </button>
                      )}
                      {!isMobile && (
                      <GameTileFavoriteButton
                        variant="toolbar"
                        favorited={favoritedGames.has(
                          hashGameTitle(selectedGame.title)
                        )}
                        onToggle={() => toggleGameFavorite(selectedGame.title)}
                      />
                      )}
                      <button
                        onClick={() => {
                          setSelectedGame(null)
                          setGameLauncherMenuOpen(false)
                          setIsFullscreen(false)
                        }}
                        className="p-1.5 hover:bg-[var(--ds-control-hover)] rounded-full transition-colors"
                >
                  <IconX className="w-4 h-4 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]" />
                </button>
                    </div>
                  </div>
                  <GameLauncherJackpotRow visible={gameLauncherJackpotsVisible} />
              </motion.div>
              ) : null}

              {/* Game viewport — fills space below header */}
              <div
                className={cn(
                  'relative min-h-0 flex-1',
                  !isFullscreen && (isMobile ? 'mx-3 mb-3 mt-2' : 'mx-4 mb-4 mt-2')
                )}
                style={{ zIndex: 1 }}
              >
                <AnimatePresence mode="wait">
                  {!gameImageLoaded ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-full flex-col items-center justify-center gap-4"
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
                    className="text-[var(--ds-fg-muted)] text-sm"
                  >
                    Loading game...
                  </motion.p>
                  {selectedGame.provider && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-[var(--ds-fg-subtle)] text-xs"
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
                        'absolute inset-0 overflow-hidden',
                        isFullscreen ? 'rounded-none' : 'rounded-2xl'
                      )}
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

                {showJackpotWheel && gameImageLoaded && !isMobile && (
                  <JackpotWheelBonus
                    onWipeStart={(tier) => {
                      setJackpotWinTier(tier)
                      setShowJackpot(true)
                    }}
                    onComplete={() => {
                      setShowJackpotWheel(false)
                    }}
                  />
                )}
              </div>

              {showJackpotWheel && gameImageLoaded && isMobile && (
                <JackpotWheelBonus
                  onWipeStart={(tier) => {
                    setJackpotWinTier(tier)
                    setShowJackpot(true)
                  }}
                  onComplete={() => {
                    setShowJackpotWheel(false)
                  }}
                />
              )}

              {/* Jackpot Win Overlay */}
              <JackpotOverlay
                visible={showJackpot}
                tier={jackpotWinTier}
                gameName={selectedGame.title}
                onClose={() => {
                  setShowJackpot(false)
                  setShowJackpotWheel(false)
                  pendingBalanceRef.current += useJackpotStore.getState().lastWinAmount
                }}
                onShareToChat={() => {
                  setShowJackpot(false)
                  setShowJackpotWheel(false)
                  const winAmount = useJackpotStore.getState().lastWinAmount
                  pendingBalanceRef.current += winAmount
                  const tierLabel =
                    JACKPOT_TICKER_TIERS.find((t) => t.id === jackpotWinTier)?.label ?? 'Mega'
                  const chatStore = useChatStore.getState()
                  chatStore.setIsOpen(true)
                  chatStore.shareBetToChat([{
                    eventName: `🎰 JACKPOT WIN on ${selectedGame.title}`,
                    selection: `${tierLabel} Jackpot`,
                    odds: '💰',
                    stake: winAmount,
                  }])
                }}
              />

              {similarGamesDrawerOpen && (
                <div
                  className="pointer-events-none absolute inset-0 z-[100035] bg-black/60 backdrop-blur-xl"
                  aria-hidden
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Similar Games Drawer */}
        <Drawer open={similarGamesDrawerOpen} onOpenChange={setSimilarGamesDrawerOpen} direction={isMobile ? "bottom" : "right"} shouldScaleBackground={false}>
          <DrawerContent 
            showOverlay={selectedGame ? true : isMobile}
            overlayClassName={
              selectedGame
                ? 'game-launcher-similar-games-overlay !z-[100040] !inset-0 !top-0 !bottom-0 !h-auto'
                : undefined
            }
            data-similar-games-drawer
            className={cn(
            "bg-[var(--ds-page-bg)] text-[var(--ds-fg)] flex flex-col relative similar-games-drawer",
            "w-full sm:max-w-2xl border-l border-[var(--ds-border)] overflow-hidden",
            selectedGame && "!top-0 !bottom-0 !mt-0 !mb-0 !h-full !max-h-[100dvh] !rounded-none",
            isMobile && !selectedGame && "rounded-t-[10px]"
            )}
            style={{
              zIndex: selectedGame ? 100050 : undefined,
              ...(selectedGame
                ? {
                    top: 0,
                    bottom: 0,
                    height: '100dvh',
                    maxHeight: '100dvh',
                    margin: 0,
                    borderRadius: 0,
                  }
                : isMobile
                  ? {
                      height: '90vh',
                      maxHeight: '90vh',
                      top: 'auto',
                      bottom: 0,
                    }
                  : {}),
            }}
          >
            {isMobile && <DrawerHandle variant="light" />}
            <DrawerHeader className="pb-4 sticky top-0 z-50 backdrop-blur-xl border-b border-[var(--ds-border)]" style={{ backgroundColor: 'rgba(26, 26, 26, 0.8)' }}>
              <div className="flex items-center justify-between">
                <div className="pt-2">
                  <DrawerTitle className="text-[var(--ds-fg)] text-xl font-bold">More Games Like This</DrawerTitle>
                  <DrawerDescription className="text-[var(--ds-fg-muted)] text-sm mt-1">
                    Similar games you might enjoy
                  </DrawerDescription>
                </div>
                <DrawerClose asChild>
                  <button className="rounded-full bg-[var(--ds-control-hover)] hover:bg-white/20 p-2 transition-colors">
                    <IconX className="h-4 w-4 text-[var(--ds-fg)]" />
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
                      className="w-full aspect-square rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group"
                    >
                      {imageSrc && (
                        <Image
                          src={imageSrc}
                          alt={gameName}
                          fill
                          className={slotTileImgClass}
                          sizes="(max-width: 640px) 50vw, 50vw"
                        />
                      )}
                      
                      <GameTilePlayOverlay
                        favoriteTitle={gameName}
                        onLaunch={() => {
                        setSelectedGame({
                          title: gameName,
                          image: imageSrc,
                          provider: provider,
                          features: ['High RTP', 'Free Spins Feature', 'Bonus Rounds Available']
                        })
                        setSimilarGamesDrawerOpen(false)
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Advanced Search — custom portal (Vaul nested dialog is blocked by search overlay) */}
        {typeof document !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              {advancedSearchOpen && (
                <motion.div
                  key="adv-search-root"
                  className="fixed inset-0 z-[100200]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <button
                    type="button"
                    aria-label="Close filters"
                    className="absolute inset-0 bg-black/55"
                    onClick={() => setAdvancedSearchOpen(false)}
                  />
                  <motion.aside
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="adv-search-title"
                    initial={
                      isMobile
                        ? { y: '100%' }
                        : { x: '100%' }
                    }
                    animate={isMobile ? { y: 0 } : { x: 0 }}
                    exit={isMobile ? { y: '100%' } : { x: '100%' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                    className={cn(
                      'absolute flex flex-col border-[var(--ds-border)] bg-[var(--ds-page-bg)] text-[var(--ds-fg)] shadow-2xl',
                      isMobile
                        ? 'inset-x-0 bottom-0 max-h-[90vh] rounded-t-[12px] border-t'
                        : 'inset-y-0 right-0 w-full max-w-md border-l'
                    )}
                  >
                    {isMobile && (
                      <div className="flex justify-center pt-2">
                        <div className="h-1 w-10 rounded-full bg-white/20" />
                      </div>
                    )}

                    <div className="flex shrink-0 items-center gap-2 border-b border-[var(--ds-border)] px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setAdvancedSearchOpen(false)}
                        className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-control-hover)]"
                        aria-label="Close filters"
                      >
                        <IconChevronLeft className="h-5 w-5" strokeWidth={2} />
                      </button>
                      <div className="min-w-0 text-left">
                        <h2
                          id="adv-search-title"
                          className="text-base font-semibold text-[var(--ds-fg)]"
                        >
                          Filter & sort by
                        </h2>
                        <p className="text-xs text-[var(--ds-fg-subtle)]">
                          Narrow games by type and provider
                        </p>
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                      <p className="mb-2 px-0.5 text-sm font-medium text-[var(--ds-fg-muted)]">
                        Filter by
                      </p>
                      <div className="overflow-hidden rounded-xl bg-[var(--ds-overlay)]">
                        <label className="flex cursor-pointer items-center gap-3 border-b border-[var(--ds-border)] px-3.5 py-3.5 transition-colors hover:bg-white/[0.03]">
                          <Checkbox
                            checked={advNewestGames}
                            onCheckedChange={(v) => setAdvNewestGames(v === true)}
                            className="border-white/25 data-[state=checked]:border-[var(--ds-primary,#ee3536)] data-[state=checked]:bg-[var(--ds-primary,#ee3536)]"
                          />
                          <span className="text-sm font-medium text-[var(--ds-fg)]">
                            Newest Games
                          </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 border-b border-[var(--ds-border)] px-3.5 py-3.5 transition-colors hover:bg-white/[0.03]">
                          <Checkbox
                            checked={advMostPopular}
                            onCheckedChange={(v) => setAdvMostPopular(v === true)}
                            className="border-white/25 data-[state=checked]:border-[var(--ds-primary,#ee3536)] data-[state=checked]:bg-[var(--ds-primary,#ee3536)]"
                          />
                          <span className="text-sm font-medium text-[var(--ds-fg)]">
                            Most Popular
                          </span>
                        </label>

                        <div className="border-b border-[var(--ds-border)]">
                          <button
                            type="button"
                            onClick={() => setAdvGameTypeOpen((v) => !v)}
                            className="flex w-full items-center justify-between px-3.5 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
                          >
                            <span className="flex items-center gap-2 text-sm font-medium text-[var(--ds-fg)]">
                              Game Type
                              {advGameTypes.size > 0 && (
                                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/70">
                                  {advGameTypes.size}
                                </span>
                              )}
                            </span>
                            <span className="text-lg leading-none text-[var(--ds-fg-muted)]">
                              {advGameTypeOpen ? '−' : '+'}
                            </span>
                          </button>
                          {advGameTypeOpen && (
                            <div className="space-y-1 px-3.5 pb-3">
                              {ADV_GAME_TYPES.map((type) => (
                                <label
                                  key={type}
                                  className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-white/[0.03]"
                                >
                                  <Checkbox
                                    checked={advGameTypes.has(type)}
                                    onCheckedChange={() =>
                                      toggleAdvSet(setAdvGameTypes, type)
                                    }
                                    className="border-white/25 data-[state=checked]:border-[var(--ds-primary,#ee3536)] data-[state=checked]:bg-[var(--ds-primary,#ee3536)]"
                                  />
                                  <span className="text-sm text-[var(--ds-fg-muted)]">
                                    {type}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => setAdvProviderOpen((v) => !v)}
                            className="flex w-full items-center justify-between px-3.5 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
                          >
                            <span className="flex items-center gap-2 text-sm font-medium text-[var(--ds-fg)]">
                              Game Provider
                              {advProviders.size > 0 && (
                                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/70">
                                  {advProviders.size}
                                </span>
                              )}
                            </span>
                            <span className="text-lg leading-none text-[var(--ds-fg-muted)]">
                              {advProviderOpen ? '−' : '+'}
                            </span>
                          </button>
                          {advProviderOpen && (
                            <div className="max-h-[40vh] space-y-1 overflow-y-auto px-3.5 pb-3 pr-2">
                              {ADV_PROVIDERS.map((provider) => (
                                <label
                                  key={provider}
                                  className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-white/[0.03]"
                                >
                                  <Checkbox
                                    checked={advProviders.has(provider)}
                                    onCheckedChange={() =>
                                      toggleAdvSet(setAdvProviders, provider)
                                    }
                                    className="border-white/25 data-[state=checked]:border-[var(--ds-primary,#ee3536)] data-[state=checked]:bg-[var(--ds-primary,#ee3536)]"
                                  />
                                  <span className="text-sm text-[var(--ds-fg-muted)]">
                                    {provider}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative mt-5">
                        <label
                          htmlFor="adv-sort-by"
                          className="absolute -top-2 left-3 z-10 bg-[var(--ds-page-bg)] px-1 text-xs text-[var(--ds-fg-muted)]"
                        >
                          Sort by
                        </label>
                        <Select value={advSortBy} onValueChange={setAdvSortBy}>
                          <SelectTrigger
                            id="adv-sort-by"
                            className="h-12 w-full rounded-lg border-white/15 bg-transparent text-sm text-[var(--ds-fg)] focus:ring-0 focus:ring-offset-0"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[100300] border-[var(--ds-border)] bg-[var(--ds-page-bg)] text-[var(--ds-fg)]">
                            {ADV_SORT_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="focus:bg-white/10 focus:text-[var(--ds-fg)]"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="shrink-0 border-t border-[var(--ds-border)] bg-[var(--ds-page-bg)] px-4 py-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={clearAdvancedFilters}
                          className="h-11 rounded-lg border border-white/15 bg-transparent text-xs font-bold uppercase tracking-wider text-[var(--ds-fg)] transition-colors hover:bg-white/[0.04]"
                        >
                          Clear all
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGameSortFilter(advSortBy)
                            setAdvancedSearchOpen(false)
                          }}
                          className="h-11 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-[filter] hover:brightness-110"
                          style={{
                            backgroundColor: 'var(--ds-primary, #ee3536)',
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </motion.aside>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}

      {!isMobile && !showSports && !showVipRewards && !showPoker && (
        <Tour
          open={casinoFeatureTourOpen}
          onOpenChange={handleCasinoTourOpenChange}
          onComplete={completeCasinoFeatureTour}
          onSkip={completeCasinoFeatureTour}
          sideOffset={12}
          spotlightPadding={8}
          className="pointer-events-none"
        >
          <TourPortal>
            <TourSpotlight className="z-[10040] bg-black/75" />
            <TourSpotlightRing className="z-[10041] rounded-small border-white/25 ring-white/25" />

            <TourStep
              target='[data-tour-target="casino-play-random"]'
              side="right"
              className="z-[10042] pointer-events-auto w-[340px] border-white/15 bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] shadow-2xl"
            >
              <TourArrow className="fill-[#2d2d2d] stroke-white/15" />
              <TourClose className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]" />
              <TourHeader className="space-y-1">
                <TourStepCounter className="text-[11px] uppercase tracking-wide text-[var(--ds-fg-subtle)]" />
                <TourTitle className="text-base font-semibold text-[var(--ds-fg)]">Play Random</TourTitle>
                <TourDescription className="text-sm text-[var(--ds-fg-muted)]">
                  Jump into a surprise game instantly to discover new titles faster.
                </TourDescription>
              </TourHeader>
              <TourFooter className="mt-2 !flex-row items-center justify-between gap-2">
                <TourSkip variant="ghost" className="border-white/15 bg-transparent text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]">
                  Skip Tour
                </TourSkip>
                <TourNext className="!bg-[var(--ds-primary,#ee3536)] !text-white hover:!bg-[var(--ds-primary-hover,#d92d2f)] hover:!text-white">
                  Next
                </TourNext>
              </TourFooter>
            </TourStep>

            <TourStep
              target='[data-tour-target="casino-last-played"]'
              side="right"
              className="z-[10042] pointer-events-auto w-[340px] border-white/15 bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] shadow-2xl"
            >
              <TourArrow className="fill-[#2d2d2d] stroke-white/15" />
              <TourClose className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]" />
              <TourHeader className="space-y-1">
                <TourStepCounter className="text-[11px] uppercase tracking-wide text-[var(--ds-fg-subtle)]" />
                <TourTitle className="text-base font-semibold text-[var(--ds-fg)]">Last Game Played</TourTitle>
                <TourDescription className="text-sm text-[var(--ds-fg-muted)]">
                  Return to your most recent game in one tap and continue your session.
                </TourDescription>
              </TourHeader>
              <TourFooter className="mt-2 !flex-row items-center justify-between gap-2">
                <TourPrev variant="ghost" className="border-white/15 bg-transparent text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]">
                  Back
                </TourPrev>
                <TourNext className="!bg-[var(--ds-primary,#ee3536)] !text-white hover:!bg-[var(--ds-primary-hover,#d92d2f)] hover:!text-white">
                  Done
                </TourNext>
              </TourFooter>
            </TourStep>
          </TourPortal>
        </Tour>
      )}

      {/* Mobile: Dynamic Island Search - Bottom of screen (hidden during game launcher) */}
      {isMobile && !selectedGame && (
        <DynamicIsland
          onSearchClick={() => setSearchOverlayOpen(true)}
          onFavoriteClick={() => {
            setActiveIconTab('favorite')
            setActiveSubNav('Lobby')
            setSelectedCategory('Favorites')
            setSelectedVendor('')
            setShowAllGames(true)
          }}
          isSearchActive={searchOverlayOpen}
          isFavoriteActive={activeIconTab === 'favorite' || selectedCategory === 'Favorites'}
          showChat={false}
          showSearch={!showVipRewards && !showPoker}
          showFavorites={!showVipRewards && !showPoker}
          customItems={
            showVipRewards
              ? [
                  {
                    id: 'Promos',
                    label: 'Promos',
                    icon: IconSparkles,
                    active: vipActiveSidebarItem === 'Promos',
                    onClick: () => {
                      setVipActiveSidebarItem('Promos')
                      window.scrollTo(0, 0)
                    },
                  },
                  {
                    id: 'My Bonus',
                    label: 'My Bonus',
                    icon: IconGift,
                    active: vipActiveSidebarItem === 'My Bonus',
                    onClick: () => {
                      setVipActiveSidebarItem('My Bonus')
                      window.scrollTo(0, 0)
                    },
                  },
                  {
                    id: 'Contests',
                    label: 'Contests',
                    icon: IconTrophy,
                    active: vipActiveSidebarItem === 'Contests',
                    onClick: () => {
                      setVipActiveSidebarItem('Contests')
                      window.scrollTo(0, 0)
                    },
                  },
                  {
                    id: 'Refer A Friend',
                    label: 'Refer',
                    icon: IconUserPlus,
                    active: vipActiveSidebarItem === 'Refer A Friend',
                    onClick: () => {
                      setVipActiveSidebarItem('Refer A Friend')
                      window.scrollTo(0, 0)
                    },
                  },
                ]
              : showPoker
                ? [
                    {
                      id: 'Play Online',
                      label: 'Play Online',
                      icon: IconPlayerPlay,
                      active: pokerActiveSidebarItem === 'Start',
                      onClick: () => {
                        setPokerActiveSidebarItem('Start')
                        launchPokerApp()
                      },
                    },
                    {
                      id: 'Download',
                      label: 'Download',
                      icon: IconDownload,
                      active: pokerActiveSidebarItem === 'Download',
                      onClick: () => {
                        setPokerActiveSidebarItem('Download')
                        document
                          .getElementById('poker-download')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      },
                    },
                    {
                      id: 'Promos',
                      label: 'Promos',
                      icon: IconGift,
                      onClick: () => {
                        setVipActiveSidebarItem('Promos')
                        setPromosActiveTab('Poker')
                        setShowPoker(false)
                        setShowSports(false)
                        setShowVipRewards(true)
                        window.scrollTo(0, 0)
                      },
                    },
                  ]
                : undefined
          }
        />
      )}

    </div>
  )
}

export default function CasinoPage() {
  return (
    <CasinoFavoritesProvider>
      <SidebarProvider defaultOpen={false}>
        <NavTestPageContent />
      </SidebarProvider>
    </CasinoFavoritesProvider>
  )
}
