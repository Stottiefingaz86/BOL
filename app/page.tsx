'use client'

import { VipHubScrollBody } from '@/components/vip/vip-hub-scroll-body'
import { SiteFooter } from '@/components/site-footer'
import { VipCrownNavButton } from '@/components/vip/vip-crown-nav-button'
import { AuthLoginBridge } from '@/components/auth/auth-login-bridge'
import { requestLogin, requestRegister } from '@/lib/auth-session'
import { useAuthSession } from '@/hooks/use-auth-session'
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
import { HomeHero } from '@/components/home/home-hero'
import { VipTablesSection } from '@/components/home/vip-tables-section'
import { VipRewardsFlipCarousel } from '@/components/home/vip-rewards-flip-carousel'
import { HeaderUserControls } from '@/components/navigation/header-user-controls'
import { NavNewBadge } from '@/components/navigation/nav-new-badge'
import { CasinoActivityPanel } from '@/components/casino/casino-activity-panel'
import { GameTilePlayOverlay } from '@/components/casino/game-tile-play-overlay'
import { CasinoFavoritesProvider, useCasinoFavorites } from '@/components/casino/casino-favorites'
import { GameTileFavoriteButton } from '@/components/casino/game-tile-favorite-button'

// Home page - uses global header, Top Events carousel, hero banner, no sidebar
import { useState, useEffect, useRef, useCallback } from 'react'
import { useChatStore } from '@/lib/store/chatStore'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTracking } from '@/hooks/use-tracking'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/sonner'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  IconShield,
  IconChevronLeft,
  IconChevronRight,
  IconMenu2,
  IconX,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
  IconWallet,
  IconUser,
  IconCrown,
  IconChevronDown,
  IconHeart,
  IconMaximize,
  IconLoader2,
  IconClock,
  IconCoins,
  IconBolt,
  IconStar,
  IconStarFilled,
  IconBell,
  IconCreditCard,
  IconArrowRight,
  IconFileText,
  IconGift,
  IconCurrencyDollar,
  IconUserPlus,
  IconTicket,
  IconCheck,
  IconDeviceGamepad2,
  IconBallAmericanFootball,
  IconTrophy,
  IconLock,
  IconFlame,
  IconSparkles,
  IconStopwatch,
  IconCherry,
  IconLifebuoy,
  IconRosetteFilled,
} from '@tabler/icons-react'
import { colorTokenMap } from '@/lib/agent/designSystem'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import NumberFlow from "@number-flow/react"
import {
  Tabs as AnimateTabs,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerHandle,
} from '@/components/ui/drawer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { QuickDepositDrawer } from '@/components/deposit/quick-deposit-drawer'
import { Input } from '@/components/ui/input'
import ChatNavToggle from '@/components/chat/chat-nav-toggle'
import DynamicIsland from '@/components/dynamic-island'
import { JackpotOverlay } from '@/components/casino/jackpot-overlay'
import { JackpotWheelBonus } from '@/components/casino/jackpot/jackpot-wheel-bonus'
import {
  GameLauncherJackpotRow,
  JackpotLauncherDropdown,
  useJackpotTicker,
} from '@/components/casino/jackpot'
import { fadeOutSound, preloadJackpotWheelAudio, preloadJackpotWinHandoffAudio } from '@/lib/sounds'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { NotificationHub } from '@/components/account/notification-hub'
import { AccountDrawerIdentity } from '@/components/account/account-drawer-identity'
import { AccountDrawerHeaderActions } from '@/components/account/account-drawer-header-actions'
import { BrandTagIconPlaceholder, BrandVendorPlaceholder, isBrandVendor, OriginalsTileBrandCover } from '@/components/brand/brand-logo-placeholder'
import { PAGE_BRAND_LOGO } from '@/lib/page-brand-logos'

// Helper function to get vendor icon path
const getVendorIconPath = (vendorName: string): string => {
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
    'House': 'orginals.svg',
  }
  
  if (vendorFileMap[vendorName]) {
    return `/vendot_logos/${vendorFileMap[vendorName]}`
  }
  
  const normalizedName = vendorName.toLowerCase().replace(/\s+/g, ' ').trim()
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

const TRENDING_SPORTS = [
  { name: 'Football', icon: '/sports_icons/football.svg', href: '/sports/football/nfl', image: '/banners/homepage_trending/football.png' },
  { name: 'Basketball', icon: '/sports_icons/Basketball.svg', href: '/sports/basketball/nba', image: '/banners/homepage_trending/basketball.png' },
  { name: 'Baseball', icon: '/sports_icons/baseball.svg', href: '/sports/baseball/mlb', image: '/banners/homepage_trending/baseball.png' },
  { name: 'Hockey', icon: '/sports_icons/Hockey.svg', href: '/sports/hockey/nhl', image: '/banners/homepage_trending/hocky.png' },
  { name: 'Soccer', icon: '/sports_icons/soccer.svg', href: '/sports/soccer', image: '/banners/homepage_trending/soccer.png' },
  { name: 'Tennis', icon: '/sports_icons/tennis.svg', href: '/sports/tennis', image: '/banners/homepage_trending/tennis.png' },
  { name: 'MMA', icon: '/sports_icons/mma.svg', href: '/sports/mma', image: '/banners/homepage_trending/mma.png' },
  { name: 'Golf', icon: '/sports_icons/Golf.svg', href: '/sports/football', image: '/banners/homepage_trending/golf.png' },
  { name: 'Boxing', icon: '/sports_icons/mma.svg', href: '/sports/mma' },
  { name: 'Rugby', icon: '/sports_icons/rugby.svg', href: '/sports/rugby' },
  { name: 'Cricket', icon: '/sports_icons/Cricket.svg', href: '/sports/football' },
  { name: 'Volleyball', icon: '/sports_icons/volley.svg', href: '/sports/volleyball' },
  { name: 'Lacrosse', icon: '/sports_icons/lacrosse.svg', href: '/sports/lacrosse' },
  { name: 'Pool', icon: '/sports_icons/pool.svg', href: '/sports/pool' },
  { name: 'Table Tennis', icon: '/sports_icons/table_tennis.svg', href: '/sports/table-tennis' },
  { name: 'Horse Racing', icon: '/sports_icons/Horse-Racing-101.svg', href: '/sports/football' },
  { name: 'All Sports', icon: '/sports_icons/all sports.svg', href: '/sports' },
]

type TrendingSport = (typeof TRENDING_SPORTS)[number]

/** Press → spinner overlay (same mock as casino promo banners), then navigate. */
function TrendingSportTile({
  sport,
  onNavigate,
}: {
  sport: TrendingSport
  onNavigate: (href: string) => void
}) {
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
      onNavigate(sport.href)
      timerRef.current = setTimeout(() => setLoading(false), 400)
    }, 1200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={loading ? `Loading ${sport.name}` : sport.name}
      aria-busy={loading}
      disabled={loading}
      className="group relative flex h-[160px] w-[260px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] text-left transition-[border-color,transform] duration-300 hover:border-white/20 hover:-translate-y-0.5 disabled:pointer-events-none"
    >
      <div
        className={cn(
          'tile-shimmer pointer-events-none absolute inset-0 z-20 transition-opacity duration-300',
          loading ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-200',
          loading && 'opacity-40'
        )}
      >
        {sport.image ? (
          <Image
            src={sport.image}
            alt=""
            fill
            className="object-cover object-right transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="260px"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/[0.03]">
            <Image
              src={sport.icon}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 object-contain opacity-80"
              unoptimized
            />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(26,26,26,0.72) 0%, rgba(26,26,26,0.35) 38%, transparent 62%)',
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between gap-2 p-3.5 pr-[42%]">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-white/5">
          <Image
            src={sport.icon}
            alt=""
            width={16}
            height={16}
            className="object-contain"
            unoptimized
          />
        </div>
        <h3 className="truncate text-[15px] font-semibold leading-snug text-white">
          {sport.name}
        </h3>
      </div>

      <div
        className={cn(
          'absolute inset-0 z-30 flex items-center justify-center bg-black/55 transition-opacity duration-200',
          loading ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {loading ? (
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <IconLoader2 className="h-6 w-6 animate-spin" strokeWidth={2.25} aria-hidden />
          </span>
        ) : null}
      </div>
    </button>
  )
}

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

// Deterministic tag assignment based on index
function getMetaTag(index: number, isOriginals: boolean = false): MetaTag {
  if (isOriginals) return 'Original'
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
    case 'Original': return <BrandTagIconPlaceholder />
    default: return null
  }
}

// Tag style config
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
  if (isBrandVendor(vendor)) {
    return <BrandVendorPlaceholder className="size-4" />
  }

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

// Game Tag Badge - matches the design reference
function GameTagBadge({ tag, vendor }: { tag: MetaTag; vendor: string }) {
  const config = getTagConfig(tag)
  
  return (
    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
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

// Payment Logo Component
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

// Security Badge Component
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

// Vendor Icon Component
function VendorIcon({ vendor }: { vendor: string }) {
  if (isBrandVendor(vendor)) {
    return <BrandVendorPlaceholder className="size-5" />
  }

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
  onBoostClaimed,
  profitBoostOptedIn,
  setProfitBoostOptedIn
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
  profitBoostOptedIn: boolean
  setProfitBoostOptedIn: (updater: boolean | ((prev: boolean) => boolean)) => void
}) {
  const isMobile = useIsMobile()
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
    
    const timeoutId = setTimeout(() => {
      checkScroll()
    }, 100)
    
    const handleScroll = () => {
      checkScroll()
    }
    
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
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
      
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

function HomePageContent() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { trackNav, trackClick, trackAction, trackSidebar } = useTracking('home')
  
  // Global betslip store for adding bets from homepage Top Sports
  const globalBets = useBetslipStore((s) => s.bets)
  const globalAddBet = useBetslipStore((s) => s.addBet)
  const globalRemoveBet = useBetslipStore((s) => s.removeBet)
  const setGlobalBetslipOpen = useBetslipStore((s) => s.setOpen)
  const setGlobalBetslipMinimized = useBetslipStore((s) => s.setMinimized)
  const [quickLinksOpen, setQuickLinksOpen] = useState(false)
  const [loadingQuickLink, setLoadingQuickLink] = useState<string | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [balance, setBalance] = useState(10)
  const [displayBalance, setDisplayBalance] = useState(10)
  useRainBalance(setBalance, setDisplayBalance)
  const pendingBalanceRef = useRef(0)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [vipDrawerOpen, setVipDrawerOpen] = useState(false)
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false)
  const [accountDrawerView, setAccountDrawerView] = useState<'account' | 'notifications'>('account')
  const webInboxUnreadCount = 2
  const { isLoggedIn: isUserLoggedIn, setLoggedIn: setIsUserLoggedIn, logout } = useAuthSession()
  const [depositDrawerOpen, setDepositDrawerOpen] = useState(false)
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
    complete: false
  })

  /** Reset drawer tab after close so reopen defaults to account — delayed to match Vaul exit so we don’t flash white (auth → account theme) mid-animation. */
  useEffect(() => {
    if (accountDrawerOpen) return
    const id = window.setTimeout(() => setAccountDrawerView('account'), 320)
    return () => clearTimeout(id)
  }, [accountDrawerOpen])

  // Mutual exclusion helpers — only one drawer open at a time
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
  const openAccountLogin = useCallback(() => {
    setVipDrawerOpen(false)
    setDepositDrawerOpen(false)
    setAccountDrawerOpen(false)
    useChatStore.getState().setIsOpen(false)
    requestLogin()
  }, [])
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
  // through props. Toggle when already open so crown clicks don't re-play open.
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

  // Sub-component nav handlers across the app navigate to `/?vip=open` when
  // they want to launch the VIP Hub but can't reach the local `openVipDrawer`
  // helper from their scope. Listen for that param on mount, open the drawer,
  // then strip the param from the URL so a refresh doesn't keep re-opening it.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('vip') === 'open') {
      openVipDrawer()
      params.delete('vip')
      const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`
      window.history.replaceState(null, '', next)
    }
  }, [openVipDrawer])
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

  // Panel exclusivity: when chat opens, close all drawers + collapse sidebar
  useEffect(() => {
    const handleChatOpened = () => {
      setAccountDrawerOpen(false)
      setVipDrawerOpen(false)
      setDepositDrawerOpen(false)
      setOpen(false)
      setSidebarOpenMobile(false)
    }
    window.addEventListener('panel:chat-opened', handleChatOpened)
    return () => window.removeEventListener('panel:chat-opened', handleChatOpened)
  }, [])

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

  const vipTabsContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollVipLeft, setCanScrollVipLeft] = useState(false)
  const [canScrollVipRight, setCanScrollVipRight] = useState(false)
  const [claimedBoosts, setClaimedBoosts] = useState<Set<string>>(new Set())
  const [boostProcessing, setBoostProcessing] = useState<string | null>(null)
  const [boostClaimMessage, setBoostClaimMessage] = useState<{ amount: number } | null>(null)
  const { state: sidebarState, toggleSidebar, open: sidebarOpen, setOpen, openMobile: sidebarOpenMobile, setOpenMobile: setSidebarOpenMobile } = useSidebar()
  
  const handleBoostClaimed = useCallback((amount: number) => {
    setDisplayBalance(prev => prev + amount)
  }, [])
  
  const handleVipDrawerOpenChange = useCallback((open: boolean) => {
    setVipDrawerOpen(open)
    if (!open) {
      setVipActiveTab('VIP')
    } else {
      setAccountDrawerOpen(false)
      setDepositDrawerOpen(false)
    }
  }, [])

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
  
  // Game launcher states
  const [selectedGame, setSelectedGame] = useState<{ title: string; image: string; provider?: string; features?: string[] } | null>(null)
  const [gameLauncherMenuOpen, setGameLauncherMenuOpen] = useState(false)
  const [gameLauncherJackpotsVisible, setGameLauncherJackpotsVisible] = useState(true)
  const [gameImageLoaded, setGameImageLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [similarGamesDrawerOpen, setSimilarGamesDrawerOpen] = useState(false)
  const {
    favoritedGames,
    toggle: toggleGameFavorite,
    hashTitle: hashGameTitle,
  } = useCasinoFavorites()
  const [showJackpot, setShowJackpot] = useState(false)
  const [showJackpotWheel, setShowJackpotWheel] = useState(false)
  const [jackpotWinTier, setJackpotWinTier] = useState<'mini' | 'minor' | 'major' | 'mega'>('mega')
  const jackpotTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameLauncherMenuRef = useRef<HTMLDivElement>(null)
  const gameImageRef = useRef<HTMLDivElement>(null)
  const jackpotOptedIn = useJackpotStore((s) => s.optedIn)

  useJackpotTicker()

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
  
  
  // Carousel API states
  const [topEventsCarouselApi, setTopEventsCarouselApi] = useState<CarouselApi>()
  const [topEventsCanScrollPrev, setTopEventsCanScrollPrev] = useState(false)
  const [topEventsCanScrollNext, setTopEventsCanScrollNext] = useState(false)
  const [slotsCarouselApi, setSlotsCarouselApi] = useState<CarouselApi>()
  const [slotsCanScrollPrev, setSlotsCanScrollPrev] = useState(false)
  const [slotsCanScrollNext, setSlotsCanScrollNext] = useState(false)
  const [originalsCarouselApi, setOriginalsCarouselApi] = useState<CarouselApi>()
  const [originalsCanScrollPrev, setOriginalsCanScrollPrev] = useState(false)
  const [originalsCanScrollNext, setOriginalsCanScrollNext] = useState(false)
  const [trendingSportsCarouselApi, setTrendingSportsCarouselApi] = useState<CarouselApi>()
  const [trendingSportsCanScrollPrev, setTrendingSportsCanScrollPrev] = useState(false)
  const [trendingSportsCanScrollNext, setTrendingSportsCanScrollNext] = useState(false)
  const [vendorsCarouselApi, setVendorsCarouselApi] = useState<CarouselApi>()
  
  // Top Events scores state
  const [topEventsScores, setTopEventsScores] = useState<Record<number, { team1: number; team2: number; animating?: { team: number; from: number; to: number } }>>({})
  
  // Homepage section toggles — set true to restore without deleting markup
  const SHOW_TOP_SPORTS = false
  const SHOW_WHY_BETONLINE = false

  // Activity Leaderboard state
  const [activityTab, setActivityTab] = useState<'All Bets' | 'Jackpot Winners' | 'Daily Race'>('All Bets')
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
  const [activityFeed, setActivityFeed] = useState<Array<{
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
  
  // Race Leaderboard data
  const raceLeaderboardData = [
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
  
  const userRacePosition = {
    rank: 5708,
    nickname: 'You',
    wagered: '$1,250.00',
    prize: '0.1%'
  }
  
  // Jackpot Winners data
  const jackpotWinnersData = [
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

  // Daily Race countdown timer state
  const [raceHours, setRaceHours] = useState(6)
  const [raceMinutes, setRaceMinutes] = useState(54)
  const [raceSeconds, setRaceSeconds] = useState(31)

  useEffect(() => {
    const interval = setInterval(() => {
      setRaceSeconds((s) => {
        if (s === 0) {
          setRaceMinutes((m) => {
            if (m === 0) {
              setRaceHours((h) => (h === 0 ? 23 : h - 1))
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
  
  // Generate mock activity data - casino only
  const generateActivity = useCallback(() => {
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
    const payoutNum = isWin ? betNum * multiplierNum : -betNum

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
  
  const activityFeedPausedRef = useRef(false)

  // Initialize and update activity feed
  useEffect(() => {
    const initialFeed = Array.from({ length: 6 }, () => generateActivity())
    setActivityFeed(initialFeed)

    let timeoutId: ReturnType<typeof setTimeout>
    let cancelled = false

    const scheduleNext = () => {
      const delay = 550 + Math.random() * 550
      timeoutId = setTimeout(() => {
        if (cancelled) return
        if (!activityFeedPausedRef.current) {
          setActivityFeed((prev) => {
            const newActivity = generateActivity()
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
  }, [activityTab, generateActivity])
  
  // Set up carousel scroll state watchers
  useEffect(() => {
    if (!topEventsCarouselApi) return
    setTopEventsCanScrollPrev(topEventsCarouselApi.canScrollPrev())
    setTopEventsCanScrollNext(topEventsCarouselApi.canScrollNext())
    topEventsCarouselApi.on('select', () => {
      setTopEventsCanScrollPrev(topEventsCarouselApi.canScrollPrev())
      setTopEventsCanScrollNext(topEventsCarouselApi.canScrollNext())
    })
  }, [topEventsCarouselApi])
  
  useEffect(() => {
    if (!slotsCarouselApi) return
    setSlotsCanScrollPrev(slotsCarouselApi.canScrollPrev())
    setSlotsCanScrollNext(slotsCarouselApi.canScrollNext())
    slotsCarouselApi.on('select', () => {
      setSlotsCanScrollPrev(slotsCarouselApi.canScrollPrev())
      setSlotsCanScrollNext(slotsCarouselApi.canScrollNext())
    })
  }, [slotsCarouselApi])
  
  useEffect(() => {
    if (!originalsCarouselApi) return
    setOriginalsCanScrollPrev(originalsCarouselApi.canScrollPrev())
    setOriginalsCanScrollNext(originalsCarouselApi.canScrollNext())
    originalsCarouselApi.on('select', () => {
      setOriginalsCanScrollPrev(originalsCarouselApi.canScrollPrev())
      setOriginalsCanScrollNext(originalsCarouselApi.canScrollNext())
    })
  }, [originalsCarouselApi])

  useEffect(() => {
    if (!trendingSportsCarouselApi) return
    setTrendingSportsCanScrollPrev(trendingSportsCarouselApi.canScrollPrev())
    setTrendingSportsCanScrollNext(trendingSportsCarouselApi.canScrollNext())
    trendingSportsCarouselApi.on('select', () => {
      setTrendingSportsCanScrollPrev(trendingSportsCarouselApi.canScrollPrev())
      setTrendingSportsCanScrollNext(trendingSportsCarouselApi.canScrollNext())
    })
  }, [trendingSportsCarouselApi])

  // Mobile: Quick links scroll handler
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        setQuickLinksOpen(true)
      } else if (currentScrollY < lastScrollY) {
        setQuickLinksOpen(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setQuickLinksOpen(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, lastScrollY])

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

  // Close menu when game launcher closes and reset image loaded state
  useEffect(() => {
    if (!selectedGame) {
      fadeOutSound('jackpot-bg', 1200)
      setGameLauncherMenuOpen(false)
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

  // Preload jackpot bed while the game loads — ready before the wheel appears.
  useEffect(() => {
    if (!gameImageLoaded || !selectedGame || !jackpotOptedIn) return
    preloadJackpotWheelAudio(0.42)
    preloadJackpotWinHandoffAudio()
  }, [gameImageLoaded, selectedGame, jackpotOptedIn])

  // Jackpot overlay — show 5 seconds after game image loads (only when opted in)
  useEffect(() => {
    if (!gameImageLoaded || !selectedGame || !jackpotOptedIn) return
    jackpotTimerRef.current = setTimeout(() => {
      setShowJackpotWheel(true)
    }, 5000)
    return () => {
      if (jackpotTimerRef.current) {
        clearTimeout(jackpotTimerRef.current)
        jackpotTimerRef.current = null
      }
    }
  }, [gameImageLoaded, selectedGame, jackpotOptedIn])

  useEffect(() => {
    if (!jackpotOptedIn) {
      setShowJackpot(false)
      setShowJackpotWheel(false)
    }
  }, [jackpotOptedIn])

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

  // Helper to add/remove bets from global betslip (toggle behavior)
  const handleTopSportsBet = useCallback((eventId: number, eventName: string, selection: string, odds: string) => {
    const existingBet = globalBets.find(bet => bet.eventId === eventId && bet.marketTitle === 'Moneyline' && bet.selection === selection)

    if (existingBet) {
      // Remove the bet (store handles closing betslip if empty)
      globalRemoveBet(existingBet.id)
    } else {
      // Add new bet
      globalAddBet({
        id: `${eventId}-Moneyline-${selection}-${Date.now()}`,
        eventId,
        eventName,
        marketTitle: 'Moneyline',
        selection,
        odds,
        stake: 0,
      })
      setGlobalBetslipOpen(true)
      setGlobalBetslipMinimized(false)
    }
  }, [globalBets, globalAddBet, globalRemoveBet, setGlobalBetslipOpen, setGlobalBetslipMinimized])

  // Check if a specific bet is selected in the global betslip
  const isTopSportsBetSelected = useCallback((eventId: number, selection: string) => {
    return globalBets.some(bet => bet.eventId === eventId && bet.marketTitle === 'Moneyline' && bet.selection === selection)
  }, [globalBets])

  // Brand configuration
  const brandPrimary = colorTokenMap['betRed/500']?.hex || '#ee3536'
  const brandPrimaryHover = colorTokenMap['betRed/700']?.hex || '#dc2a2f'
  
  const currentBrand = {
    name: 'Brand A',
    symbol: '$',
    logo: PAGE_BRAND_LOGO
  }

  // Top Sports data - Mix of Premier League, NFL, MLB, NHL
  const topEventsData = [
    // Premier League
    { id: 4, team1: 'Arsenal', team2: 'Chelsea', score: '1 - 0', team1Code: 'ARS', team2Code: 'CHE', team1Percent: 65, team2Percent: 35, time: 'H1 23\'', league: 'Premier League', leagueIcon: '/banners/sports_league/prem.svg', country: 'England', team1Logo: '/team/Arsenal FC.png', team2Logo: '/team/Chelsea FC.png', odds: { team1: '+150', tie: '+280', team2: '+180' } },
    // NFL
    { id: 5, team1: 'Kansas City Chiefs', team2: 'Buffalo Bills', score: '24 - 17', team1Code: 'KC', team2Code: 'BUF', team1Percent: 62, team2Percent: 38, time: 'Q3 8\'', league: 'NFL', leagueIcon: '/banners/sports_league/NFL.svg', country: 'USA', team1Logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png', team2Logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png', odds: { team1: '-165', tie: '+850', team2: '+140' } },
    // NHL
    { id: 6, team1: 'Toronto Maple Leafs', team2: 'Montreal Canadiens', score: '3 - 2', team1Code: 'TOR', team2Code: 'MTL', team1Percent: 55, team2Percent: 45, time: 'P2 8:22', league: 'NHL', leagueIcon: '/banners/sports_league/NHL.svg', country: 'USA/Canada', team1Logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/tor.png', team2Logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/mtl.png', odds: { team1: '-130', tie: '+320', team2: '+110' } },
    // Premier League
    { id: 7, team1: 'Liverpool', team2: 'Manchester City', score: '2 - 1', team1Code: 'LIV', team2Code: 'MCI', team1Percent: 58, team2Percent: 42, time: 'H2 67\'', league: 'Premier League', leagueIcon: '/banners/sports_league/prem.svg', country: 'England', team1Logo: '/team/Liverpool FC.png', team2Logo: '/team/Manchester City.png', odds: { team1: '+120', tie: '+260', team2: '+200' } },
    // MLB
    { id: 8, team1: 'New York Yankees', team2: 'Boston Red Sox', score: '4 - 2', team1Code: 'NYY', team2Code: 'BOS', team1Percent: 60, team2Percent: 40, time: 'T5', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA', team1Logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png', team2Logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png', odds: { team1: '-140', tie: '+950', team2: '+120' } },
    // NFL
    { id: 9, team1: 'Dallas Cowboys', team2: 'Philadelphia Eagles', score: '31 - 28', team1Code: 'DAL', team2Code: 'PHI', team1Percent: 55, team2Percent: 45, time: 'Q4 2\'', league: 'NFL', leagueIcon: '/banners/sports_league/NFL.svg', country: 'USA', team1Logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png', team2Logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png', odds: { team1: '+110', tie: '+750', team2: '-130' } },
    // NHL
    { id: 10, team1: 'Boston Bruins', team2: 'New York Rangers', score: '4 - 1', team1Code: 'BOS', team2Code: 'NYR', team1Percent: 68, team2Percent: 32, time: 'P3 4:15', league: 'NHL', leagueIcon: '/banners/sports_league/NHL.svg', country: 'USA', team1Logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/bos.png', team2Logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/nyr.png', odds: { team1: '-200', tie: '+380', team2: '+170' } },
    // Premier League
    { id: 11, team1: 'Tottenham', team2: 'Newcastle', score: '2 - 1', team1Code: 'TOT', team2Code: 'NEW', team1Percent: 72, team2Percent: 28, time: 'H2 67\'', league: 'Premier League', leagueIcon: '/banners/sports_league/prem.svg', country: 'England', team1Logo: '/team/Tottenham Hotspur.png', team2Logo: '/team/Newcastle United.png', odds: { team1: '-110', tie: '+300', team2: '+250' } },
    // MLB
    { id: 12, team1: 'Los Angeles Dodgers', team2: 'San Francisco Giants', score: '5 - 3', team1Code: 'LAD', team2Code: 'SF', team1Percent: 65, team2Percent: 35, time: 'B7', league: 'MLB', leagueIcon: '/banners/sports_league/MLB.svg', country: 'USA', team1Logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/lad.png', team2Logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sf.png', odds: { team1: '-175', tie: '+900', team2: '+155' } },
    // NFL
    { id: 13, team1: 'San Francisco 49ers', team2: 'Seattle Seahawks', score: '21 - 14', team1Code: 'SF', team2Code: 'SEA', team1Percent: 68, team2Percent: 32, time: 'Q2 12\'', league: 'NFL', leagueIcon: '/banners/sports_league/NFL.svg', country: 'USA', team1Logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png', team2Logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', odds: { team1: '-150', tie: '+800', team2: '+130' } },
  ]

  return (
    <div 
      className="w-full bg-[var(--ds-page-bg)] text-[var(--ds-fg)] font-figtree overflow-x-clip min-h-screen transition-colors duration-300" 
      style={{ 
        width: '100%', 
        maxWidth: '100vw', 
        boxSizing: 'border-box',
        flex: '1 1 0%',
        minWidth: 0,
        alignSelf: 'stretch',
        '--brand-primary': brandPrimary,
        '--brand-primary-hover': brandPrimaryHover,
      } as React.CSSProperties}
    >
      <AuthLoginBridge onRequestLogin={openAccountLogin} />
      {/* Mobile: Quick Links - Above main menu */}
      {isMobile && !selectedGame && (
        <motion.div
          initial={false}
          animate={{
            height: quickLinksOpen ? 40 : 0
          }}
          transition={{
            type: "tween",
            ease: "linear",
            duration: 0.3
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
              { label: 'Home', onClick: () => { setQuickLinksOpen(false); } },
              { label: 'Sports', onClick: () => { trackNav('sports', 'Sports'); router.push('/sports/football'); setQuickLinksOpen(false); } },
              { label: 'Casino', onClick: () => { trackNav('casino', 'Casino'); router.push('/casino'); setQuickLinksOpen(false); } },
              { label: 'Poker', onClick: () => { trackNav('poker', 'Poker'); router.push('/casino?poker=true'); setQuickLinksOpen(false); } },
              { label: 'Promotions', onClick: () => { trackNav('promotions', 'Promotions'); router.push('/casino?vipRewardsPage=true'); setQuickLinksOpen(false); } },
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
                  item.label === 'Home'
                    ? "text-[var(--ds-fg)]"
                    : "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]"
                )}
              >
                <span className={cn("inline-flex items-center gap-1 transition-opacity duration-150", loadingQuickLink === item.label ? "opacity-0" : "opacity-100")}>
                  {item.label}
                  {item.label === 'Promotions' && <NavNewBadge />}
                </span>
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

      {/* Global Header - Same as casino page (hidden while game launcher is open) */}
      {!selectedGame && (
      <motion.header 
        data-nav-header
        className={cn(
          "bg-[#2D2E2C] dark:bg-[#2D2E2C] border-b border-[var(--ds-border)] h-16 flex items-center justify-between z-[101] fixed left-0 right-0",
          isMobile ? "px-3" : "px-6",
          isMobile && quickLinksOpen && "border-t-0"
        )}
        initial={false}
        animate={{
          top: isMobile ? (quickLinksOpen ? 40 : 0) : 0
        }}
        transition={{
          type: "tween",
          ease: "linear",
          duration: 0.3
        }}
        style={{ 
          pointerEvents: 'auto',
          top: isMobile ? (quickLinksOpen ? 40 : 0) : 0,
          zIndex: 101,
          position: 'fixed',
          backgroundColor: 'var(--ds-nav-bg, #2D2E2C)',
          boxShadow: '0 -200px 0 0 var(--ds-nav-bg, #2D2E2C)',
        }}
      >
        <div className="mx-auto flex h-full w-full min-w-0 items-center justify-between 2xl:max-w-[1600px] min-[1920px]:max-w-[1720px] min-[2200px]:max-w-[1840px]">
        <div className="flex items-center gap-6">
          <div 
            className="relative h-8 w-[120px] flex items-center cursor-pointer"
            onClick={() => {
              router.push('/')
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
                    className="h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors text-[var(--ds-fg-muted)] cursor-pointer"
                    onClick={() => { trackNav('sports', 'Sports'); router.push('/sports/football') }}
                  >
                    Sports
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors text-[var(--ds-fg-muted)] cursor-pointer"
                    onClick={() => { trackNav('casino', 'Casino'); router.push('/casino') }}
                  >
                    Casino
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors text-[var(--ds-fg-muted)] cursor-pointer"
                    onClick={() => { trackNav('poker', 'Poker'); router.push('/casino?poker=true') }}
                  >
                    Poker
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors text-[var(--ds-fg-muted)] cursor-pointer"
                    onClick={() => { trackNav('promotions', 'Promotions'); router.push('/casino?vipRewardsPage=true') }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      Promotions
                      <NavNewBadge />
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        className="h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] transition-colors text-[var(--ds-fg-muted)] data-[state=open]:text-[var(--ds-fg)] data-[state=open]:bg-[var(--ds-control-hover)]"
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
          isLoggedIn={isUserLoggedIn}
          balance={displayBalance}
          currencySymbol={currentBrand.symbol}
          vipDrawerOpen={vipDrawerOpen}
          onOpenAccount={openAccountDrawer}
          onOpenVip={openVipDrawer}
          onOpenDeposit={openDepositDrawer}
          onLogin={() => {
            setAccountDrawerOpen(false)
            requestLogin()
          }}
          onRegister={() => {
            setAccountDrawerOpen(false)
            requestRegister()
          }}
        />
        </div>
      </motion.header>
      )}

      {/* Main Content - No Sidebar; constrain width on ultra-wide screens */}
      <div
        className="mx-auto w-full min-w-0 bg-[var(--ds-page-bg)] text-[var(--ds-fg)] 2xl:max-w-[1600px] min-[1920px]:max-w-[1720px] min-[2200px]:max-w-[1840px]"
      >
        {/* Spacer for fixed header */}
        <motion.div 
          initial={false}
          animate={{
            height: isMobile ? (quickLinksOpen ? '104px' : '64px') : '64px'
          }}
          transition={{
            type: "tween",
            ease: "linear",
            duration: 0.3
          }}
          style={{ overflow: 'hidden' }}
        />

        {/* Hero — simplified Casino / Sports destinations */}
        <div className={cn(isMobile ? 'px-3 py-4' : 'px-6 py-4 md:py-6')}>
          <HomeHero
            isLoggedIn={isUserLoggedIn}
            onRegister={() => {
              setAccountDrawerOpen(false)
              requestRegister()
            }}
            onLogin={() => {
              setAccountDrawerOpen(false)
              requestLogin()
            }}
          />
        </div>

        {/* Top Sports Carousel — hidden while simplifying homepage; set SHOW_TOP_SPORTS = true to restore */}
        {SHOW_TOP_SPORTS && (
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2 
              className="text-lg font-semibold text-[var(--ds-fg)] cursor-pointer hover:text-[var(--ds-fg-muted)] transition-colors"
              onClick={() => router.push('/sports/football')}
            >
              Top Sports
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small"
                onClick={() => router.push('/sports/football')}
              >
                View All
              </Button>
              {!isMobile && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (topEventsCarouselApi) {
                        const currentIndex = topEventsCarouselApi.selectedScrollSnap()
                        topEventsCarouselApi.scrollTo(Math.max(0, currentIndex - 1))
                      }
                    }}
                    disabled={!topEventsCarouselApi || !topEventsCanScrollPrev}
                  >
                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (topEventsCarouselApi) {
                        const currentIndex = topEventsCarouselApi.selectedScrollSnap()
                        const slideCount = topEventsCarouselApi.scrollSnapList().length
                        topEventsCarouselApi.scrollTo(Math.min(slideCount - 1, currentIndex + 1))
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
          <div className={cn("relative", isMobile ? "-mx-3" : "-mx-6")}>
            <Carousel setApi={setTopEventsCarouselApi} className="w-full relative" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
              <CarouselContent className={cn(isMobile ? "ml-3 pr-3" : "ml-6 pr-6")}>
                {topEventsData.map((event, index) => {
                  const parseScore = (scoreStr: string) => {
                    const parts = scoreStr.split(' - ')
                    return {
                      team1: parseInt(parts[0]) || 0,
                      team2: parseInt(parts[1]) || 0
                    }
                  }
                  const initialScore = parseScore(event.score)
                  const currentScore = topEventsScores[event.id] || initialScore

  return (
                    <CarouselItem key={event.id} className={cn("pr-0 basis-auto flex-shrink-0", index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4")}>
                      <div className="w-[320px] bg-[var(--ds-control-bg)] border border-[var(--ds-border)] rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(238, 53, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                        {/* Header: League info and Live status */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <Image 
                              src={event.leagueIcon} 
                              alt={event.league}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                            <span className="text-[10px] text-[var(--ds-fg)]">{event.league} | {event.country}</span>
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
                            <Image 
                              src={event.team1Logo}
                              alt={event.team1}
                              width={20}
                              height={20}
                              className="object-contain flex-shrink-0"
                              quality={100}
                              unoptimized
                            />
                            <span className="text-xs font-semibold text-[var(--ds-fg)] truncate">{event.team1}</span>
                          </div>
                          
                          {/* Score */}
                          <div className="flex items-center justify-center mx-3 flex-shrink-0 gap-1">
                            <div className="border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-[var(--ds-control-bg)] border-[var(--ds-border)]">
                              <span className="text-[10px] font-bold text-[var(--ds-fg)] leading-none">{currentScore.team1}</span>
                            </div>
                            <span className="text-base font-bold text-[var(--ds-fg)] leading-none">-</span>
                            <div className="border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-[var(--ds-control-bg)] border-[var(--ds-border)]">
                              <span className="text-[10px] font-bold text-[var(--ds-fg)] leading-none">{currentScore.team2}</span>
                            </div>
                          </div>
                          
                          {/* Team 2 */}
                          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                            <span className="text-xs font-semibold text-[var(--ds-fg)] truncate">{event.team2}</span>
                            <Image 
                              src={event.team2Logo}
                              alt={event.team2}
                              width={20}
                              height={20}
                              className="object-contain flex-shrink-0"
                              quality={100}
                              unoptimized
                            />
                          </div>
                        </div>
                        
                        {/* Moneyline Betting Buttons */}
                        <div className="flex items-center gap-1.5 mb-3">
                          {[
                            { label: event.team1Code, selection: event.team1, odds: event.odds.team1 },
                            { label: 'Tie', selection: 'Tie', odds: event.odds.tie },
                            { label: event.team2Code, selection: event.team2, odds: event.odds.team2 },
                          ].map((btn) => {
                            const selected = isTopSportsBetSelected(event.id, btn.selection)
                            return (
                              <button
                                key={btn.label}
                                onClick={() => handleTopSportsBet(event.id, `${event.team1} vs ${event.team2}`, btn.selection, btn.odds)}
                                className={cn(
                                  "rounded-small flex-1 h-[38px] flex flex-col items-center justify-center transition-colors cursor-pointer px-2",
                                  selected
                                    ? "bg-[#ee3536] text-white"
                                    : "bg-[var(--ds-control-hover)] text-[var(--ds-fg)] hover:bg-[#ee3536] hover:text-white"
                                )}
                              >
                                <div className={cn("text-[10px] leading-none mb-0.5", selected ? "text-white/90" : "text-[var(--ds-fg-muted)]")}>{btn.label}</div>
                                <div className="text-xs font-bold leading-none">{btn.odds}</div>
                              </button>
                            )
                          })}
                        </div>
                        
                        {/* Popularity Bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[var(--ds-control-hover)] rounded-full overflow-hidden">
                            <div className="h-full bg-[#ee3536] rounded-full" style={{ width: `${event.team1Percent}%` }} />
                          </div>
                          <span className="text-[9px] text-[var(--ds-fg-muted)]">{event.team1Percent}% {event.team1Code}</span>
                          <span className="text-[9px] text-[var(--ds-fg-muted)]">{event.team2Percent}% {event.team2Code}</span>
                          <div className="flex-1 h-1.5 bg-[var(--ds-control-hover)] rounded-full overflow-hidden">
                            <div className="h-full bg-white/30 rounded-full ml-auto" style={{ width: `${event.team2Percent}%` }} />
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        )}

        {/* Slots Carousel Section */}
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2 className="text-lg font-semibold text-[var(--ds-fg)]">New Games (128)</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small"
                onClick={() => router.push('/casino')}
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
                      if (slotsCarouselApi) {
                        const currentIndex = slotsCarouselApi.selectedScrollSnap()
                        slotsCarouselApi.scrollTo(Math.max(0, currentIndex - 2))
                      }
                    }}
                    disabled={!slotsCarouselApi || !slotsCanScrollPrev}
                  >
                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (slotsCarouselApi) {
                        const currentIndex = slotsCarouselApi.selectedScrollSnap()
                        const slideCount = slotsCarouselApi.scrollSnapList().length
                        slotsCarouselApi.scrollTo(Math.min(slideCount - 1, currentIndex + 2))
                      }
                    }}
                    disabled={!slotsCarouselApi || !slotsCanScrollNext}
                  >
                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className={cn("relative", isMobile ? "-mx-3" : "-mx-6")}>
            <Carousel setApi={setSlotsCarouselApi} className="w-full relative" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
              <CarouselContent className={cn(isMobile ? "ml-3 pr-3" : "ml-6 pr-6")}>
                {Array.from({ length: 10 }).map((_, index) => {
                  const imageSrc = squareTileImages[index % squareTileImages.length]
                  const slotNames = ['Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers', 'Mega Moolah', 'Bonanza']
                  const slotVendor = getTileVendor(index + 20)
                  return (
                    <CarouselItem key={index} className={cn("pr-0 basis-auto flex-shrink-0", index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4")}>
                      <div 
                        className="w-[160px] h-[160px] rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                      >
                        {imageSrc && (
                          <Image
                            src={imageSrc}
                            alt={`Slot Game ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="160px"
                          />
                        )}
                        <GameTagBadge tag={getMetaTag(index + 20)} vendor={slotVendor} />
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
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

        {/* Trending Sports */}
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2
              className="text-lg font-semibold text-[var(--ds-fg)] cursor-pointer hover:text-[var(--ds-fg-muted)] transition-colors"
              onClick={() => router.push('/sports/football')}
            >
              Trending Sports
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small"
                onClick={() => router.push('/sports/football')}
              >
                See More
              </Button>
              {!isMobile && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (trendingSportsCarouselApi) {
                        const currentIndex = trendingSportsCarouselApi.selectedScrollSnap()
                        trendingSportsCarouselApi.scrollTo(Math.max(0, currentIndex - 2))
                      }
                    }}
                    disabled={!trendingSportsCarouselApi || !trendingSportsCanScrollPrev}
                  >
                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-small bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] text-[var(--ds-fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (trendingSportsCarouselApi) {
                        const currentIndex = trendingSportsCarouselApi.selectedScrollSnap()
                        const slideCount = trendingSportsCarouselApi.scrollSnapList().length
                        trendingSportsCarouselApi.scrollTo(Math.min(slideCount - 1, currentIndex + 2))
                      }
                    }}
                    disabled={!trendingSportsCarouselApi || !trendingSportsCanScrollNext}
                  >
                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className={cn("relative", isMobile ? "-mx-3" : "-mx-6")}>
            <Carousel
              setApi={setTrendingSportsCarouselApi}
              className="w-full relative"
              opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
            >
              <CarouselContent className={cn(isMobile ? "ml-3 pr-3" : "ml-6 pr-6")}>
                {TRENDING_SPORTS.map((sport, index) => (
                  <CarouselItem
                    key={`contest-${sport.name}`}
                    className={cn(
                      "pr-0 basis-auto flex-shrink-0",
                      index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                    )}
                  >
                    <TrendingSportTile
                      sport={sport}
                      onNavigate={(href) => router.push(href)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        {/* Originals Carousel Section */}
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2 className="text-lg font-semibold text-[var(--ds-fg)]">Originals (26)</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small"
                onClick={() => router.push('/casino')}
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
                        originalsCarouselApi.scrollTo(Math.max(0, currentIndex - 2))
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
                        originalsCarouselApi.scrollTo(Math.min(slideCount - 1, currentIndex + 2))
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
          <div className={cn("relative", isMobile ? "-mx-3" : "-mx-6")}>
            <Carousel setApi={setOriginalsCarouselApi} className="w-full relative" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
              <CarouselContent className={cn(isMobile ? "ml-3 pr-3" : "ml-6 pr-6")}>
                {originalsTileImages.map((imageSrc, index) => {
                  const gameNames = ['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker']
                  return (
                    <CarouselItem key={index} className={cn("pr-0 basis-auto flex-shrink-0", index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4")}>
                      <div 
                        className="w-[160px] h-[280px] rounded-small bg-[var(--ds-control-bg)] hover:bg-[var(--ds-control-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                      >
                        <Image
                          src={imageSrc}
                          alt={gameNames[index] || `Originals Game ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="160px"
                        />
                        <OriginalsTileBrandCover />
                        <GameTagBadge tag="Original" vendor="Originals" />
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                        <GameTilePlayOverlay
                          favoriteTitle={['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker'][index] || `Originals Game ${index + 1}`}
                          onLaunch={() => {
                            const originalGameNames = ['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker']
                            setSelectedGame({
                              title: originalGameNames[index] || `Originals Game ${index + 1}`,
                              image: imageSrc,
                              provider: 'House',
                              features: ['Original Game', 'Unique Gameplay', 'Platform exclusive']
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

        {/* Top 10 → Activity → Live Casino */}
        <VipTablesSection
          onSelectGame={setSelectedGame}
          betweenSections={
            <CasinoActivityPanel
              isMobile={isMobile}
              heading="Activity"
              tabLayoutId="homeActivityTab"
              casinoActivityTab={activityTab}
              onCasinoActivityTabChange={setActivityTab}
              casinoRaceHours={raceHours}
              casinoRaceMinutes={raceMinutes}
              casinoRaceSeconds={raceSeconds}
              casinoRaceLeaderboardData={raceLeaderboardData}
              casinoUserRacePosition={userRacePosition}
              casinoJackpotWinnersData={jackpotWinnersData}
              casinoActivityFeed={activityFeed}
              onSelectGame={(g) => setSelectedGame(g)}
              onLiveFeedHoverChange={(hovering) => {
                activityFeedPausedRef.current = hovering
              }}
            />
          }
        />

        {/* Vendors Carousel Section */}
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2 className="text-lg font-semibold text-[var(--ds-fg)]">Vendors</h2>
          </div>
          <div className={cn("relative", isMobile ? "-mx-3" : "-mx-6")}>
            <Carousel setApi={setVendorsCarouselApi} className="w-full relative" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
              {!isMobile && (
                <>
                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] hover:border-[var(--ds-border-strong)] text-[var(--ds-fg)] z-20 data-carousel-nav" />
                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[var(--ds-surface)] backdrop-blur-sm border border-[var(--ds-border-strong)] hover:bg-[var(--ds-surface-raised)] hover:border-[var(--ds-border-strong)] text-[var(--ds-fg)] z-20 data-carousel-nav" />
                </>
              )}
              <CarouselContent className={cn(isMobile ? "ml-3 pr-3" : "ml-6 pr-6")}>
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
                  <CarouselItem key={vendor} className={cn("pr-0 basis-auto flex-shrink-0", index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4")}>
                    <button
                      className="group relative bg-gray-100/80 dark:bg-[var(--ds-control-bg)] border border-gray-200 dark:border-[var(--ds-border)] rounded-lg px-3 py-2.5 text-xs font-medium text-gray-800 dark:text-[var(--ds-fg-muted)] hover:bg-gray-200/80 dark:hover:bg-[var(--ds-control-hover)] hover:text-black dark:hover:text-[var(--ds-fg)] transition-all duration-300 whitespace-nowrap overflow-hidden flex items-center gap-2"
                      onClick={() => router.push('/casino')}
                    >
                      <VendorIcon vendor={vendor} />
                      <span className="relative z-10">{vendor}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        {/* Concept A VIP promo — hidden while Concept B flip cards is active */}
        {/* <VipRewardsPromo onExplore={openVipDrawer} /> */}

        {/* VIP Rewards concept B — Figma flip-card carousel */}
        <VipRewardsFlipCarousel onExplore={openVipDrawer} />

        {/* Why us — hidden while simplifying homepage; set SHOW_WHY_BETONLINE = true to restore */}
        {SHOW_WHY_BETONLINE && (
        <div className={cn("mb-6", isMobile ? "px-3" : "px-6")}>
          <h2 className="text-lg font-semibold text-[var(--ds-fg)] mb-4">Why us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Compare Our Competitors Card */}
            <Card className="group relative bg-gradient-to-br from-[#3a2a1f]/30 to-[#2d1f16]/30 backdrop-blur-sm border-[var(--ds-border)] rounded-small overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3a2a1f]/20 to-transparent pointer-events-none" />
              <CardContent className="p-4 relative z-10">
                <div className="mb-4">
                  <div className="text-[var(--ds-fg)] font-semibold text-sm mb-0.5 leading-tight">COMPARE OUR</div>
                  <div className="text-[var(--ds-fg)] font-semibold text-sm leading-tight">COMPETITORS</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/20 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-transparent hover:border-white/30 text-xs h-7 px-3"
                  onClick={() => router.push('/casino')}
                >
                  SEE THE DIFFERENCE
                </Button>
              </CardContent>
              {/* Competitors Image */}
              <div className="absolute right-0 bottom-0 opacity-40 pointer-events-none">
                <Image
                  src="/banners/partners/cometitors.png"
                  alt="Competitors"
                  width={120}
                  height={80}
                  className="object-contain"
                  quality={100}
                  unoptimized
                />
              </div>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
            </Card>
            
            {/* Trusted By Millions Card */}
            <Card className="group relative bg-gradient-to-br from-[#1f2a1f]/30 to-[#162116]/30 backdrop-blur-sm border-[var(--ds-border)] rounded-small overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1f2a1f]/20 to-transparent pointer-events-none" />
              <CardContent className="p-4 relative z-10">
                <div className="mb-4">
                  <div className="text-[var(--ds-fg)] font-semibold text-sm mb-0.5 leading-tight">TRUSTED BY</div>
                  <div className="text-[var(--ds-fg)] font-semibold text-sm leading-tight">MILLIONS</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/20 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-transparent hover:border-white/30 text-xs h-7 px-3"
                  onClick={() => router.push('/casino')}
                >
                  FIND OUT MORE
                </Button>
              </CardContent>
              {/* Trust Image */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
                <Image
                  src="/banners/partners/trust.png"
                  alt="Trust"
                  width={140}
                  height={90}
                  className="object-contain"
                  quality={100}
                  unoptimized
                />
              </div>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
            </Card>
            
            {/* VIP Rewards Program Card */}
            <Card className="group relative bg-gradient-to-br from-[#2a241f]/30 to-[#1f1a16]/30 backdrop-blur-sm border-[var(--ds-border)] rounded-small overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a241f]/20 to-transparent pointer-events-none" />
              <CardContent className="p-4 relative z-10">
                <div className="mb-4">
                  <div className="text-[var(--ds-fg)] font-semibold text-sm mb-0.5 leading-tight">VIP REWARDS</div>
                  <div className="text-[var(--ds-fg)] font-semibold text-sm leading-tight">PROGRAM</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/20 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-transparent hover:border-white/30 text-xs h-7 px-3"
                  onClick={() => router.push('/casino?vip=true')}
                >
                  BECOME A VIP
                </Button>
              </CardContent>
              {/* VIP Why Image */}
              <div className="absolute right-0 bottom-0 opacity-50 pointer-events-none">
                <Image
                  src="/banners/partners/vip_why.png"
                  alt="VIP Crowns"
                  width={280}
                  height={180}
                  className="object-contain"
                  quality={100}
                  unoptimized
                />
              </div>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
            </Card>
          </div>
          
        </div>
        )}

        {/* Game Launcher - Full Screen Overlay */}
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100010] flex flex-col bg-[var(--ds-page-bg)]"
            >
              {/* Top chrome — matches casino launcher (jackpot toggle + ticker) */}
              {!isFullscreen && !(isMobile && isLandscape) && (
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

                      <AnimatePresence>
                        {gameLauncherMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 z-[100060] w-56 overflow-hidden rounded-xl border border-white/10 bg-[#2d2d2d] shadow-2xl"
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
                                  openDepositDrawer()
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10"
                              >
                                Quick Deposit
                              </button>
                              <button
                                onClick={() => {
                                  setSimilarGamesDrawerOpen(true)
                                  setGameLauncherMenuOpen(false)
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10"
                              >
                                More Games Like This
                              </button>
                            </div>
                            <div className="border-t border-white/10 bg-white/[0.04] px-4 py-3">
                              <div className="mb-2 text-xs text-white/60">Gold To Platinum I</div>
                              <VipTierProgressBar value={45} variant="compact" showOriginalsNote={false} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                                ;(gameImageRef.current as any).webkitRequestFullscreen()
                              } else if ((gameImageRef.current as any).msRequestFullscreen) {
                                ;(gameImageRef.current as any).msRequestFullscreen()
                              }
                              setIsFullscreen(true)
                            } else {
                              if (document.exitFullscreen) {
                                document.exitFullscreen()
                              } else if ((document as any).webkitExitFullscreen) {
                                ;(document as any).webkitExitFullscreen()
                              } else if ((document as any).msExitFullscreen) {
                                ;(document as any).msExitFullscreen()
                              }
                              setIsFullscreen(false)
                            }
                          }}
                          className="rounded-full p-1.5 transition-colors hover:bg-[var(--ds-control-hover)]"
                        >
                          <IconMaximize className="h-4 w-4 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]" />
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
                        className="rounded-full p-1.5 transition-colors hover:bg-[var(--ds-control-hover)]"
                      >
                        <IconX className="h-4 w-4 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]" />
                      </button>
                    </div>
                  </div>
                  <GameLauncherJackpotRow visible={gameLauncherJackpotsVisible} />
                </motion.div>
              )}

              {/* Content Area - Loading then Game Image */}
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
                          src={selectedGame.image}
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
                      src={selectedGame.image}
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
                  const chatStore = useChatStore.getState()
                  chatStore.setIsOpen(true)
                  chatStore.shareBetToChat([{
                    eventName: `🎰 JACKPOT WIN on ${selectedGame.title}`,
                    selection: `${jackpotWinTier.charAt(0).toUpperCase()}${jackpotWinTier.slice(1)} Jackpot`,
                    odds: '💰',
                    stake: winAmount,
                  }])
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Similar Games Drawer */}
        <Drawer open={similarGamesDrawerOpen} onOpenChange={setSimilarGamesDrawerOpen} direction={isMobile ? "bottom" : "right"} shouldScaleBackground={false}>
          <DrawerContent 
            showOverlay={isMobile}
            className={cn(
              "bg-[var(--ds-page-bg)] text-white flex flex-col relative",
              "w-full sm:max-w-2xl border-l border-white/10 overflow-hidden",
              isMobile && "rounded-t-[10px]"
            )}
            style={isMobile ? {
              height: '90vh',
              maxHeight: '90vh',
              top: 'auto',
              bottom: 0,
            } : undefined}
          >
            {isMobile && <DrawerHandle variant="light" />}
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
                  const imageSrc = squareTileImages[index % squareTileImages.length]
                  const gameName = gameNames[index % gameNames.length]
                  const tileVendor = getTileVendor(index)
                  
                  return (
                    <div
                      key={index}
                      className="w-full aspect-square rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group"
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
                      <GameTagBadge tag={getMetaTag(index)} vendor={tileVendor} />
                      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                      <GameTilePlayOverlay
                        favoriteTitle={gameName}
                        onLaunch={() => {
                          setSelectedGame({
                            title: gameName,
                            image: imageSrc,
                            provider: tileVendor,
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

        {/* Account Details Drawer */}
        <Drawer 
          open={accountDrawerOpen} 
          onOpenChange={(open) => {
            setAccountDrawerOpen(open)
            if (open) {
              setVipDrawerOpen(false)
              setDepositDrawerOpen(false)
            }
          }}
          direction={isMobile ? "bottom" : "right"}
          shouldScaleBackground={false}
        >
          <DrawerContent 
            showOverlay={isMobile}
            className={cn(
              "w-full sm:max-w-md flex flex-col bg-[var(--ds-page-bg)] text-[var(--ds-fg)] border-l border-[var(--ds-border)]",
              isMobile && "rounded-t-[10px]"
            )}
            style={isMobile ? {
              height: '100dvh',
              maxHeight: '100dvh',
              top: 0,
              bottom: 'auto',
            } : undefined}
          >
            {isMobile && <DrawerHandle variant="dark" />}
            <DrawerHeader className={cn("flex-shrink-0", isMobile ? "px-4 pt-4 pb-2" : "px-4 pt-5 pb-3")}>
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
                    loggedIn={isUserLoggedIn}
                    name="CH"
                    accountId="b1767721"
                  />
                  <AccountDrawerHeaderActions
                    onBeforeNavigate={() => setAccountDrawerOpen(false)}
                  />
                </div>
              )}
            </DrawerHeader>
            
            <div
              className={cn("flex-1 overflow-y-auto overscroll-contain", isMobile ? "px-4 pt-4 pb-4" : "px-4 pt-6 pb-4")}
              style={isMobile ? { WebkitOverflowScrolling: 'touch', paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' } : undefined}
            >
              {accountDrawerView === 'account' ? (
                <>
                  {isUserLoggedIn ? (
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
                        <span className="text-sm font-semibold text-[#EAAF6D]">Gold · 62%</span>
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
                  <div className="space-y-1 w-full mb-8">
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
                      <span className="text-sm text-[var(--ds-fg-muted)] ml-auto flex items-center gap-1.5">
                        <span className="bg-amber-500 text-[var(--ds-fg)] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">4</span>
                        $40.00
                      </span>
                    </Button>
                    
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
                  </div>
                  
                  <Separator className={cn("bg-[var(--ds-control-hover)]", isMobile ? "my-4" : "my-5")} />
                  
                  {/* Logout Button */}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg-muted)] h-10 px-2 min-w-0"
                    onClick={() => {
                      logout()
                      setAccountDrawerView('account')
                    }}
                  >
                    <span className="text-sm">Log out</span>
                  </Button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-control-bg)] px-4 py-4">
                        <p className="text-sm font-semibold text-[var(--ds-fg)]">You are logged out</p>
                        <p className="mt-1 text-xs text-[var(--ds-fg-muted)]">Log back in or create an account to place bets and access your wallet.</p>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setAccountDrawerOpen(false)
                            requestLogin()
                          }}
                          className="h-10 rounded-lg border border-white/20 bg-transparent !text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)] hover:!text-[var(--ds-fg)]"
                        >
                          Login
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setAccountDrawerOpen(false)
                            requestRegister()
                          }}
                          className="h-10 rounded-lg border-0 bg-gradient-to-r from-[#ee3536] to-[#c42a2a] text-white shadow-sm hover:opacity-95"
                        >
                          Create account
                        </Button>
                      </div>

                      <Separator className="bg-[var(--ds-control-hover)] mb-3" />

                      <div className="space-y-1 w-full mb-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-11 px-3"
                          onClick={() => {
                            setAccountDrawerOpen(false)
                            openDepositDrawer()
                          }}
                        >
                          <IconWallet className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                          <span className="flex-1 text-left text-[var(--ds-fg)]">Banking</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-11 px-3"
                        >
                          <IconLifebuoy className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                          <span className="flex-1 text-left text-[var(--ds-fg)]">Help Center</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)] h-11 px-3"
                          onClick={() => {
                            openVipDrawer()
                          }}
                        >
                          <IconCrown className="w-5 h-5 mr-3 text-[var(--ds-fg-muted)]" />
                          <span className="flex-1 text-left text-[var(--ds-fg)]">VIP Hub</span>
                        </Button>
                      </div>
                    </>
                  )}
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
            {isMobile && <DrawerHandle variant="dark" />}
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
              profitBoostOptedIn={profitBoostOptedIn}
              setProfitBoostOptedIn={setProfitBoostOptedIn}
            />
          </DrawerContent>
        </Drawer>

        {/* Deposit Drawer */}
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
                  toast.success(message, { duration: 3000 })
                }
              }
              requestAnimationFrame(animate)
            }, 300)
          }}
        />

      {/* Mobile: Dynamic Island Dock - Bottom of screen (hidden during game launcher) */}
      {isMobile && !selectedGame && (
        <DynamicIsland
          showChat={false}
          showSearch={false}
          showFavorites={false}
          customItems={[
            {
              id: 'Casino',
              label: 'Casino',
              icon: IconCherry,
              onClick: () => {
                trackNav('casino', 'Casino')
                router.push('/casino')
              },
            },
            {
              id: 'Sports',
              label: 'Sports',
              icon: IconBallAmericanFootball,
              onClick: () => {
                trackNav('sports', 'Sports')
                router.push('/sports/football')
              },
            },
          ]}
        />
      )}
      </div>

      {/* Full-bleed footer — sits outside the ultra-wide content max-width */}
      <SiteFooter />
    </div>
  )
}

export default function HomePage() {
  return (
    <CasinoFavoritesProvider>
      <SidebarProvider>
        <HomePageContent />
      </SidebarProvider>
    </CasinoFavoritesProvider>
  )
}
