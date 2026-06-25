'use client'

import { VipHubScrollBody } from '@/components/vip/vip-hub-scroll-body'
import { VipCrownNavButton } from '@/components/vip/vip-crown-nav-button'
import { AuthLoginBridge } from '@/components/auth/auth-login-bridge'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useRainBalance } from '@/hooks/use-rain-balance'
import { ReferralCodeField } from '@/components/auth/referral-code-field'
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

// Home page - uses global header, Top Events carousel, hero banner, no sidebar
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useChatStore } from '@/lib/store/chatStore'
import { useBetslipStore } from '@/lib/store/betslipStore'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTracking } from '@/hooks/use-tracking'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
  IconInfoCircle,
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
  IconBallFootball,
  IconTrophy,
  IconLock,
  IconFlame,
  IconSparkles,
  IconStopwatch,
  IconDice,
  IconLifebuoy,
  IconEye,
  IconEyeOff,
  IconKey,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
import { Checkbox } from '@/components/ui/checkbox'
import ChatNavToggle from '@/components/chat/chat-nav-toggle'
import DynamicIsland from '@/components/dynamic-island'
import { JackpotOverlay } from '@/components/casino/jackpot-overlay'
import { JackpotWheelBonus } from '@/components/casino/jackpot/jackpot-wheel-bonus'
import { fadeOutSound, preloadJackpotWheelAudio, preloadJackpotWinHandoffAudio } from '@/lib/sounds'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { NotificationHub } from '@/components/account/notification-hub'

/** Sign-up country (USA / CAN share +1); `iso` is stored on the form. */
const AUTH_COUNTRY_OPTIONS = [
  { iso: 'US', dial: '+1', label: 'United States' },
  { iso: 'CA', dial: '+1', label: 'Canada' },
] as const

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
    'BetOnline': 'orginals.svg',
  }
  
  if (vendorFileMap[vendorName]) {
    return `/vendot_logos/${vendorFileMap[vendorName]}`
  }
  
  const normalizedName = vendorName.toLowerCase().replace(/\s+/g, ' ').trim()
  return `/vendot_logos/${normalizedName}.svg`
}

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
    case 'Original': return <span className={cn("text-[9px] font-black leading-none", className)}>B</span>
    default: return null
  }
}

// Tag style config
function getTagConfig(tag: MetaTag): { bg: string; border: string; text: string; iconColor: string } {
  switch (tag) {
    case 'Early': return { bg: 'bg-emerald-900/80', border: 'border-emerald-500/60', text: 'text-white', iconColor: 'text-emerald-400' }
    case 'Hot': return { bg: 'bg-red-950/80', border: 'border-red-500/60', text: 'text-white', iconColor: 'text-red-400' }
    case 'Exclusive': return { bg: 'bg-indigo-950/80', border: 'border-indigo-400/60', text: 'text-white', iconColor: 'text-indigo-300' }
    case 'New': return { bg: 'bg-yellow-900/80', border: 'border-yellow-500/60', text: 'text-white', iconColor: 'text-yellow-400' }
    case 'Original': return { bg: 'bg-white/15', border: 'border-white/25', text: 'text-white/90', iconColor: 'text-white/80' }
    default: return { bg: 'bg-white/10', border: 'border-white/20', text: 'text-white', iconColor: 'text-white' }
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
        <span className="text-[8px] font-bold text-white/80 leading-none">
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
        <span className="text-xs font-semibold text-white/70">{method}</span>
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
  const [imageError, setImageError] = useState(false)
  const iconPath = getVendorIconPath(vendor)
  
  if (imageError) {
    return <div className="w-5 h-5 rounded-full bg-white/10 flex-shrink-0" />
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
                <CardTitle className="text-sm text-white/70 mb-2">Diamond I to Diamond II</CardTitle>
                <VipTierProgressBar value={45} nextTierLabel="Platinum I" wagerRemaining="$2,750" />
              </CardContent>
            </Card>

            <DailySpinCard />
            <VipBenefitTiles
              onClaim={(tile) => console.log('VIP claim', tile.id)}
              onTileClick={(tile) => console.log('VIP tile click', tile.id)}
            />

            <RedeemPromoCode />
            
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
  const [accountDrawerView, setAccountDrawerView] = useState<'account' | 'notifications' | 'createAccount' | 'createAccountConfirmation' | 'login'>('account')
  const webInboxUnreadCount = 2
  const [createAccountForm, setCreateAccountForm] = useState({
    fullName: '',
    email: '',
    password: '',
    countryIso: 'US' as 'US' | 'CA',
    phone: '',
    dob: '',
  })
  const [createAccountAlias, setCreateAccountAlias] = useState('')
  const [createAccountTouched, setCreateAccountTouched] = useState(false)
  const [createAccountPasswordVisible, setCreateAccountPasswordVisible] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [referralExpanded, setReferralExpanded] = useState(false)
  const authCountryTriggerRef = useRef<HTMLButtonElement>(null)
  const authCountryListRef = useRef<HTMLDivElement>(null)
  const [authCountryMenuOpen, setAuthCountryMenuOpen] = useState(false)
  const [authCountryMenuRect, setAuthCountryMenuRect] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', keepLoggedIn: false })
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false)
  const [createAccountDob, setCreateAccountDob] = useState({ day: '', month: '', year: '' })
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

  const createAccountErrors = {
    fullName: createAccountForm.fullName.trim().length >= 2 ? '' : 'Please enter a username',
    email: /\S+@\S+\.\S+/.test(createAccountForm.email.trim()) ? '' : 'Please enter a valid email',
    password: createAccountForm.password.trim().length >= 6 ? '' : 'Use at least 6 characters',
    phone: createAccountForm.phone.trim().length >= 7 ? '' : 'Please enter a valid phone number',
    dob: createAccountForm.dob.trim().length > 0 ? '' : 'Please add your date of birth',
  }
  const createAccountDobDayNum = Number(createAccountDob.day)
  const createAccountDobMonthNum = Number(createAccountDob.month)
  const createAccountDobYearNum = Number(createAccountDob.year)
  const currentYear = new Date().getFullYear()
  const isCreateAccountDobValid = createAccountDob.day.length === 2
    && createAccountDob.month.length === 2
    && createAccountDob.year.length === 4
    && createAccountDobDayNum >= 1
    && createAccountDobDayNum <= 31
    && createAccountDobMonthNum >= 1
    && createAccountDobMonthNum <= 12
    && createAccountDobYearNum >= 1900
    && createAccountDobYearNum <= currentYear
  createAccountErrors.dob = isCreateAccountDobValid ? '' : 'Please add a valid date of birth'
  const createAccountInputClass = "h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827]"
  const createAccountSelectClass = "h-11 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827]"

  const isAuthDrawerView =
    accountDrawerView === 'login' ||
    accountDrawerView === 'createAccount' ||
    accountDrawerView === 'createAccountConfirmation'
  const authFieldClass =
    "h-11 w-full rounded-lg border border-white/12 bg-[#1a1a1a] px-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/22 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#1a1a1a] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]"
  const authSelectTriggerClass =
    "h-11 w-full rounded-lg border border-white/12 bg-[#1a1a1a] px-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/22 flex items-center justify-between"
  const authCardClass = "rounded-xl border border-white/10 bg-[#1f1f1f] p-4 space-y-3"
  const authPrimaryBtnClass =
    "w-full h-12 rounded-lg font-semibold text-white bg-gradient-to-r from-[#ee3536] to-[#c42a2a] hover:opacity-95 shadow-md shadow-black/20 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
  const canSubmitLogin = loginForm.identifier.trim().length > 0 && loginForm.password.trim().length >= 6
  const selectedAuthCountry =
    AUTH_COUNTRY_OPTIONS.find((o) => o.iso === createAccountForm.countryIso) ?? AUTH_COUNTRY_OPTIONS[0]
  const isCreateAccountStepValid = Object.values(createAccountErrors).every((value) => value === '')

  const updateAuthCountryMenuRect = useCallback(() => {
    const el = authCountryTriggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setAuthCountryMenuRect({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 200) })
  }, [])

  useLayoutEffect(() => {
    if (!authCountryMenuOpen) {
      setAuthCountryMenuRect(null)
      return
    }
    updateAuthCountryMenuRect()
    window.addEventListener('resize', updateAuthCountryMenuRect)
    return () => window.removeEventListener('resize', updateAuthCountryMenuRect)
  }, [authCountryMenuOpen, updateAuthCountryMenuRect])

  useEffect(() => {
    if (!authCountryMenuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (authCountryTriggerRef.current?.contains(t)) return
      if (authCountryListRef.current?.contains(t)) return
      setAuthCountryMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [authCountryMenuOpen])

  useEffect(() => {
    if (!authCountryMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAuthCountryMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [authCountryMenuOpen])

  useEffect(() => {
    if (!accountDrawerOpen || accountDrawerView !== 'createAccount') {
      setAuthCountryMenuOpen(false)
    }
  }, [accountDrawerOpen, accountDrawerView])

  /** Reset drawer tab after close so reopen defaults to account — delayed to match Vaul exit so we don’t flash white (auth → account theme) mid-animation. */
  useEffect(() => {
    if (accountDrawerOpen) return
    const id = window.setTimeout(() => setAccountDrawerView('account'), 320)
    return () => clearTimeout(id)
  }, [accountDrawerOpen])

  // Mutual exclusion helpers — only one drawer open at a time
  const openAccountDrawer = useCallback(() => {
    trackClick('account-drawer', 'My Account')
    setVipDrawerOpen(false)
    setDepositDrawerOpen(false)
    setAccountDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [trackClick])
  const openAccountLogin = useCallback(() => {
    openAccountDrawer()
    setAccountDrawerView('login')
  }, [openAccountDrawer])
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
    trackClick('deposit', 'Deposit')
    setAccountDrawerOpen(false)
    setVipDrawerOpen(false)
    setDepositDrawerOpen(true)
    useChatStore.getState().setIsOpen(false)
  }, [trackClick])

  const handleLoginWithPasskey = useCallback(async () => {
    const finish = () => {
      setIsUserLoggedIn(true)
      setAccountDrawerOpen(false)
      setAccountDrawerView('account')
    }
    if (
      typeof window !== 'undefined' &&
      typeof PublicKeyCredential !== 'undefined' &&
      typeof navigator.credentials?.get === 'function'
    ) {
      try {
        const challenge = new Uint8Array(32)
        crypto.getRandomValues(challenge)
        const rpId = window.location.hostname.replace(/^www\./, '')
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge,
            rpId,
            timeout: 60_000,
            userVerification: 'preferred',
            allowCredentials: [],
          },
        })
        if (credential) {
          finish()
          return
        }
      } catch {
        // User dismissed, no passkey, or invalid session — prototype still completes sign-in
      }
    }
    finish()
  }, [])

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
      setVipActiveTab('Overview')
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
  const [gameImageLoaded, setGameImageLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [similarGamesDrawerOpen, setSimilarGamesDrawerOpen] = useState(false)
  const [favoritedGames, setFavoritedGames] = useState<Set<number>>(new Set())
  const [showJackpot, setShowJackpot] = useState(false)
  const [showJackpotWheel, setShowJackpotWheel] = useState(false)
  const [jackpotWinTier, setJackpotWinTier] = useState<'mini' | 'minor' | 'major' | 'mega'>('mega')
  const jackpotTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameLauncherMenuRef = useRef<HTMLDivElement>(null)
  const gameImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onOpenVipBenefits = () => {
      openVipDrawer()
      setVipActiveTab('Overview')
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
  const [vendorsCarouselApi, setVendorsCarouselApi] = useState<CarouselApi>()
  
  // Top Events scores state
  const [topEventsScores, setTopEventsScores] = useState<Record<number, { team1: number; team2: number; animating?: { team: number; from: number; to: number } }>>({})
  
  // Activity Leaderboard state
  const [activityTab, setActivityTab] = useState<'All Bets' | 'Jackpot Winners' | 'High Rollers' | 'Daily Race'>('All Bets')
  const [activityFeed, setActivityFeed] = useState<Array<{
    id: string
    type: 'sports' | 'casino'
    event: string
    user: string
    time: string
    odds?: string
    betAmount: string
    winAmount?: string
    icon: 'football' | 'basketball' | 'tennis' | 'esports' | 'casino'
    gameImage?: string
  }>>([])
  
  // Race Leaderboard data
  const raceLeaderboardData = [
    { rank: 1, nickname: 'Hidden', wagered: '$100,005.00', prize: '25%', medal: 'gold' as const },
    { rank: 2, nickname: 'Player_5130165', wagered: '$12,000.00', prize: '18%', medal: 'silver' as const },
    { rank: 3, nickname: 'Hidden', wagered: '$8,000.00', prize: '16%', medal: 'bronze' as const },
    { rank: 4, nickname: 'Hidden', wagered: '$6,000.00', prize: '12%' },
    { rank: 5, nickname: 'Hidden', wagered: '$5,865.00', prize: '10%' },
    { rank: 6, nickname: 'Hidden', wagered: '$4,986.34', prize: '8%' },
    { rank: 7, nickname: 'Hidden', wagered: '$4,503.05', prize: '5%' },
    { rank: 8, nickname: 'Hidden', wagered: '$4,163.80', prize: '3%' },
    { rank: 9, nickname: 'Hidden', wagered: '$3,123.05', prize: '2%' },
    { rank: 10, nickname: 'Hidden', wagered: '$2,305.07', prize: '1%' },
  ]
  
  const userRacePosition = {
    rank: 5708,
    nickname: 'You',
    wagered: '$1,250.00',
    prize: '0.1%'
  }
  
  // Jackpot Winners data
  const jackpotWinnersData = [
    { id: 'jp1', user: 'LuckyBet', game: 'Mega Moolah', amount: '$250,000.00', time: '2 hrs ago', gameImage: squareTileImages[3] },
    { id: 'jp2', user: 'Hidden', game: 'Sweet Bonanza', amount: '$87,432.50', time: '5 hrs ago', gameImage: squareTileImages[7] },
    { id: 'jp3', user: 'CasinoKing', game: 'Gates of Olympus', amount: '$45,120.00', time: '8 hrs ago', gameImage: squareTileImages[1] },
    { id: 'jp4', user: 'Hidden', game: 'Book of Dead', amount: '$32,750.00', time: '12 hrs ago', gameImage: squareTileImages[1] },
    { id: 'jp5', user: 'GamerX', game: 'Starburst', amount: '$28,900.75', time: '1 day ago', gameImage: squareTileImages[0] },
    { id: 'jp6', user: 'Hidden', game: "Gonzo's Quest", amount: '$19,450.00', time: '1 day ago', gameImage: squareTileImages[2] },
    { id: 'jp7', user: 'HighRoller', game: 'Razor Shark', amount: '$15,230.00', time: '2 days ago', gameImage: squareTileImages[5] },
    { id: 'jp8', user: 'Hidden', game: 'Big Bass Bonanza', amount: '$12,800.50', time: '2 days ago', gameImage: squareTileImages[6] },
    { id: 'jp9', user: 'Player1', game: 'Dead or Alive', amount: '$9,500.00', time: '3 days ago', gameImage: squareTileImages[4] },
    { id: 'jp10', user: 'Hidden', game: 'Mega Moolah', amount: '$8,120.25', time: '3 days ago', gameImage: squareTileImages[3] },
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
    const users = ['Gurvinderdeo', 'Eruyarr4545', 'JadrankaB', 'VUDEMMADHU', 'Dzikiti123', 'Player1', 'GamerX', 'LuckyBet', 'HighRoller', 'CasinoKing']
    const casinoGames = [
      { name: 'Starburst', icon: 'casino' as const, image: squareTileImages[0] },
      { name: 'Book of Dead', icon: 'casino' as const, image: squareTileImages[1] },
      { name: 'Gonzo\'s Quest', icon: 'casino' as const, image: squareTileImages[2] },
      { name: 'Mega Moolah', icon: 'casino' as const, image: squareTileImages[3] },
      { name: 'Dead or Alive', icon: 'casino' as const, image: squareTileImages[4] },
      { name: 'Razor Shark', icon: 'casino' as const, image: squareTileImages[5] },
      { name: 'Big Bass Bonanza', icon: 'casino' as const, image: squareTileImages[6] },
      { name: 'Sweet Bonanza', icon: 'casino' as const, image: squareTileImages[7] },
    ]
    
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    
    const eventData = casinoGames[Math.floor(Math.random() * casinoGames.length)]
    
    const user = users[Math.floor(Math.random() * users.length)]
    const isHidden = Math.random() < 0.6 // 60% chance of being hidden
    const displayUser = isHidden ? 'Hidden' : user
    
    const betAmount = activityTab === 'High Rollers' 
      ? (Math.random() * 15000 + 1000).toFixed(2)
      : (Math.random() * 5000 + 10).toFixed(2)
    
    // For casino games, calculate win amount (60% chance of winning)
    const winAmount = Math.random() > 0.4
      ? (parseFloat(betAmount) * (Math.random() * 5 + 1)).toFixed(2)
      : undefined
    
    return {
      id: `casino-${Date.now()}-${Math.random()}`,
      type: 'casino' as const,
      event: eventData.name,
      user: displayUser,
      time: timeStr,
      odds: undefined,
      betAmount: `$${parseFloat(betAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      winAmount: winAmount ? `$${parseFloat(winAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : undefined,
      icon: eventData.icon,
      gameImage: eventData.image
    }
  }, [activityTab])
  
  // Initialize and update activity feed
  useEffect(() => {
    // Initialize with 6 items
    const initialFeed = Array.from({ length: 6 }, () => generateActivity())
    setActivityFeed(initialFeed)
    
    // Add new activity every 3-5 seconds, keep only 6 visible
    const interval = setInterval(() => {
      setActivityFeed(prev => {
        const newActivity = generateActivity()
        return [newActivity, ...prev.slice(0, 5)] // Keep max 6 items
      })
    }, Math.random() * 2000 + 3000) // 3-5 seconds
    
    return () => clearInterval(interval)
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
    if (!gameImageLoaded || !selectedGame) return
    preloadJackpotWheelAudio(0.42)
    preloadJackpotWinHandoffAudio()
  }, [gameImageLoaded, selectedGame])

  // Jackpot overlay — show 5 seconds after game image loads
  useEffect(() => {
    if (gameImageLoaded && selectedGame) {
      jackpotTimerRef.current = setTimeout(() => {
        setShowJackpotWheel(true)
      }, 5000)
    }
    return () => {
      if (jackpotTimerRef.current) {
        clearTimeout(jackpotTimerRef.current)
        jackpotTimerRef.current = null
      }
    }
  }, [gameImageLoaded, selectedGame])

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
    name: 'BetOnline',
    symbol: '$',
    logo: (
      <svg viewBox="0 0 640 86" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <g id="BETONLINE">
          <path fillRule="evenodd" clipRule="evenodd" d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z" fill={brandPrimary}/>
          <path d="M120.693 85.7021V0.0993091H178.194V17.4781H140.558V33.6651H176.197V50.2494H140.658V68.0254H180.39V85.7021H120.693Z" fill={brandPrimary}/>
          <path d="M257.757 8.54042C261.251 5.16397 265.244 2.38337 269.736 0.0993091H185.781V17.776H209.939V85.7021H230.604V17.776H250.37C252.466 14.3995 254.962 11.321 257.757 8.54042Z" fill={brandPrimary}/>
          <path fillRule="evenodd" clipRule="evenodd" d="M313.761 3.47575C319.151 5.66051 323.843 8.63973 327.737 12.5127C331.63 16.3857 334.625 20.9538 336.821 26.1178C339.017 31.3811 340.115 37.0416 340.115 43.0993C340.115 49.1571 339.017 54.9169 336.821 60.0808C334.625 65.2448 331.63 69.8129 327.737 73.6859C323.843 77.4596 319.151 80.5381 313.761 82.7229C308.27 84.9076 302.28 86 295.891 86C289.403 86 283.413 84.9076 278.022 82.7229C272.631 80.5381 267.939 77.5589 264.046 73.6859C260.253 69.9122 257.158 65.2448 254.962 60.0808C252.766 54.8176 251.667 49.1571 251.667 43.0993C251.667 37.0416 252.766 31.2818 254.962 26.1178C257.158 20.9538 260.153 16.3857 264.046 12.5127C267.939 8.73903 272.631 5.66051 278.022 3.47575C283.513 1.291 289.502 0.198618 295.891 0.198618C302.38 0.198618 308.37 1.291 313.761 3.47575ZM324.642 55.3141C326.139 51.5404 326.838 47.3695 326.838 43.0993C326.838 38.8291 326.04 34.6582 324.642 30.8845C323.244 27.1109 321.148 23.7344 318.453 20.9538C315.757 18.1732 312.563 15.8891 308.769 14.2009C305.076 12.5127 300.783 11.7182 296.091 11.7182C291.399 11.7182 287.206 12.5127 283.413 14.2009C279.719 15.8891 276.425 18.1732 273.73 20.9538C271.134 23.7344 269.038 27.1109 267.54 30.8845C266.043 34.6582 265.344 38.8291 265.344 43.0993C265.344 47.3695 266.043 51.5404 267.54 55.3141C268.938 59.0878 271.034 62.4642 273.73 65.2448C276.425 68.0254 279.619 70.3095 283.413 71.9977C287.107 73.6859 291.399 74.4804 296.091 74.4804C300.783 74.4804 304.976 73.6859 308.769 71.9977C312.463 70.3095 315.757 68.0254 318.453 65.2448C321.048 62.4642 323.145 59.0878 324.642 55.3141Z" fill="white"/>
          <path d="M437.847 0.0993091H425.069V85.6028H476.681V74.1824H437.847V0.0993091Z" fill="white"/>
          <path d="M484.268 0.0993091H497.046V85.7021H484.268V0.0993091Z" fill="white"/>
          <path d="M594.778 74.1824V48.2633H634.909V36.7436H594.778V11.6189H637.804V0.0993091H582V85.6028H640V74.1824H594.778Z" fill="white"/>
          <path d="M347.802 0.0993091L405.403 56.903V0.0993091H417.482V85.6028L359.782 29.4942V85.6028H347.802V0.0993091Z" fill="white"/>
          <path d="M562.333 57.3002L504.633 0.0993091V85.6028H516.712V29.8915L574.313 85.2055V0.0993091H562.333V57.3002Z" fill="white"/>
        </g>
      </svg>
    )
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
      className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white font-figtree overflow-x-hidden min-h-screen transition-colors duration-300" 
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
      {isMobile && (
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
          <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-white/10">
            {[
              { label: 'Home', onClick: () => { setQuickLinksOpen(false); } },
              { label: 'Sports', onClick: () => { trackNav('sports', 'Sports'); router.push('/sports/football'); setQuickLinksOpen(false); } },
              { label: 'Casino', onClick: () => { trackNav('casino', 'Casino'); router.push('/casino'); setQuickLinksOpen(false); } },
              { label: 'Poker', onClick: () => { trackNav('poker', 'Poker'); router.push('/casino?poker=true'); setQuickLinksOpen(false); } },
              { label: 'Promotions', onClick: () => { trackNav('promotions', 'Promotions'); router.push('/promotions'); setQuickLinksOpen(false); } },
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
                  item.label === 'Home'
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

      {/* Global Header - Same as casino page */}
      <motion.header 
        data-nav-header
        className={cn(
          "bg-[#2D2E2C] dark:bg-[#2D2E2C] border-b border-white/10 h-16 flex items-center justify-between z-[101] fixed left-0 right-0",
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
                    className="h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-white/5 hover:text-white transition-colors text-white/70 cursor-pointer"
                    onClick={() => { trackNav('sports', 'Sports'); router.push('/sports/football') }}
                  >
                    Sports
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-white/5 hover:text-white transition-colors text-white/70 cursor-pointer"
                    onClick={() => { trackNav('casino', 'Casino'); router.push('/casino') }}
                  >
                    Casino
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-white/5 hover:text-white transition-colors text-white/70 cursor-pointer"
                    onClick={() => { trackNav('poker', 'Poker'); router.push('/casino?poker=true') }}
                  >
                    Poker
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-white/5 hover:text-white transition-colors text-white/70 cursor-pointer"
                    onClick={() => { trackNav('promotions', 'Promotions'); router.push('/promotions') }}
                  >
                    Promotions
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        className="h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center hover:bg-white/5 hover:text-white transition-colors text-white/70 data-[state=open]:text-white data-[state=open]:bg-white/10"
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
        
        <div className={cn("flex items-center", isMobile ? "gap-2" : "gap-3")} style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative' }}>
          {/* VIP Crown Button - Desktop */}
          {!isMobile && (
            <VipCrownNavButton active={vipDrawerOpen} onClick={openVipDrawer} />
          )}
          
          {/* Separator - Hide on mobile */}
          {!isMobile && (
            <div className="h-6 w-px bg-white/20" />
          )}
          
          {isUserLoggedIn ? (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openAccountDrawer()
              }}
              className={cn(
                "flex items-center rounded-small transition-colors group bg-white/5 hover:bg-white/10",
                isMobile ? "gap-1 px-1.5 py-1" : "gap-1.5 px-2 py-1"
              )}
              style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
            >
              <Avatar className={cn("border border-white/20 group-hover:border-white/40 transition-colors", isMobile ? "h-5 w-5" : "h-6 w-6")}>
                <AvatarFallback className="bg-white/10 text-white flex items-center justify-center font-semibold tracking-tight" style={{ fontSize: isMobile ? '9px' : '10px' }}>
                  CH
                </AvatarFallback>
              </Avatar>
              <span className={cn("font-medium text-white text-right tabular-nums transition-all duration-300", isMobile ? "text-[10px] min-w-[60px]" : "text-xs min-w-[70px]")}>
                {currentBrand.symbol}
                <NumberFlow value={displayBalance} format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
              </span>
            </Button>
          ) : (
            <div className={cn("flex items-center", isMobile ? "gap-1.5" : "gap-2")}>
              <Button
                variant="ghost"
                onClick={() => {
                  openAccountDrawer()
                  setAccountDrawerView('login')
                }}
                className={cn(
                  "rounded-small border border-white/45 bg-transparent text-white font-semibold hover:bg-white/10",
                  isMobile ? "h-8 px-2.5 text-[11px]" : "h-9 px-3 text-xs"
                )}
              >
                Login
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  openAccountDrawer()
                  setAccountDrawerView('createAccount')
                }}
                className={cn(
                  "rounded-small border border-emerald-600 bg-emerald-600 text-white font-semibold hover:bg-emerald-500 hover:border-emerald-500",
                  isMobile ? "h-8 px-2.5 text-[11px]" : "h-9 px-3 text-xs"
                )}
              >
                Create Account
              </Button>
            </div>
          )}
          
          {/* VIP Crown Button - Mobile */}
          {isMobile && (
            <VipCrownNavButton active={vipDrawerOpen} onClick={openVipDrawer} />
          )}
          
          {/* Deposit Button - Desktop only */}
          {!isMobile && isUserLoggedIn && (
            <Button
              variant="ghost"
              onClick={openDepositDrawer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-small transition-colors group bg-white/5 hover:bg-white/10 text-xs font-semibold text-white cursor-pointer"
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

      {/* Main Content - No Sidebar */}
      <div className="bg-[#1a1a1a] text-white" style={{ width: '100%', minWidth: 0, maxWidth: 'none' }}>
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

        {/* Hero Banner Section */}
        {isMobile ? (
          /* Mobile: Casino-style SVG banner carousel */
          <div className="py-4 px-3">
            <Carousel className="w-full" opts={{ align: 'start', loop: false, duration: 15 }}>
              <CarouselContent className="-ml-2">
                {([
                  { src: '/banners/mobile bannerBanner.svg', alt: 'Flaame Banner', href: 'https://www.flaame.co/' },
                  { src: '/banners/casino/casino_banner1.svg', alt: 'Casino Banner 1', href: '' },
                  { src: '/banners/casino/casino_banner2.svg', alt: 'Casino Banner 2', href: '' },
                  { src: '/banners/casino/casino_banner 3.svg', alt: 'Casino Banner 3', href: '' },
                  { src: '/banners/casino/casino_banner4.svg', alt: 'Casino Banner 4', href: '' },
                  { src: '/banners/casino/casino_Banner5.svg', alt: 'Casino Banner 5', href: '' },
                ]).map((banner, i) => (
                  <CarouselItem key={i} className="pl-2 basis-auto flex-shrink-0">
                    <Card 
                      className="border-0 relative overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity rounded-xl" 
                      style={{ width: '300px', height: '148px' }}
                      onClick={() => { if (banner.href) window.open(banner.href, '_blank') }}
                    >
                      <Image
                        src={banner.src}
                        alt={banner.alt}
                        width={300}
                        height={148}
                        className="object-cover w-full h-full"
                        unoptimized
                        priority
                      />
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ) : (
          /* Desktop: Full-width banner carousel */
          <div className="py-4 md:py-6 px-6">
            <Carousel className="w-full relative" opts={{ align: 'start', loop: false, duration: 15 }}>
              <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
              <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
              <CarouselContent className="ml-0 mr-0">
                {/* Banner 1 - Originals */}
                <CarouselItem className="basis-full flex-shrink-0 pl-0 pr-0">
                  <div className="relative w-full cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-2xl pr-4" style={{ aspectRatio: '4/1', minHeight: '200px' }}>
                    <Image
                      src="/banners/ori.svg"
                      alt="Originals Banner"
                      fill
                      className="object-cover"
                      priority
                      quality={100}
                      unoptimized
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
                {/* Banner 2 */}
                <CarouselItem className="basis-full flex-shrink-0 pl-0 pr-0">
                  <div className="relative w-full cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-2xl pr-4" style={{ aspectRatio: '4/1', minHeight: '200px' }}>
                    <Image
                      src="/banners/banner1.svg"
                      alt="Hero Banner"
                      fill
                      className="object-cover"
                      priority
                      quality={100}
                      unoptimized
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
                {/* Banner 3 */}
                <CarouselItem className="basis-full flex-shrink-0 pl-0 pr-0">
                  <div className="relative w-full overflow-hidden rounded-2xl pr-4" style={{ aspectRatio: '4/1', minHeight: '200px' }}>
                    <Image
                      src="/banners/banner12.svg"
                      alt="Banner 2"
                      fill
                      className="object-cover"
                      priority
                      quality={100}
                      unoptimized
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
                {/* Banner 4 - Bracket */}
                <CarouselItem className="basis-full flex-shrink-0 pl-0 pr-0">
                  <div className="relative w-full cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-2xl pr-4" style={{ aspectRatio: '4/1', minHeight: '200px' }}>
                    <Image
                      src="/banners/bracket.svg"
                      alt="Bracket Banner"
                      fill
                      className="object-cover"
                      priority
                      quality={100}
                      unoptimized
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
                {/* Banner 5 */}
                <CarouselItem className="basis-full flex-shrink-0 pl-0 pr-0">
                  <div className="relative w-full cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-2xl pr-4" style={{ aspectRatio: '4/1', minHeight: '200px' }}>
                    <Image
                      src="/banners/partners/banner4.svg"
                      alt="Banner 5"
                      fill
                      className="object-cover"
                      priority
                      quality={100}
                      unoptimized
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        )}

        {/* Top Sports Carousel */}
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2 
              className="text-lg font-semibold text-white cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => router.push('/sports/football')}
            >
              Top Sports
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small"
                onClick={() => router.push('/sports/football')}
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
                    className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
              <CarouselContent className={cn(isMobile ? "ml-3 mr-0" : "ml-6 mr-0")}>
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
                      <div className="w-[320px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(238, 53, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
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
                            <Image 
                              src={event.team1Logo}
                              alt={event.team1}
                              width={20}
                              height={20}
                              className="object-contain flex-shrink-0"
                              quality={100}
                              unoptimized
                            />
                            <span className="text-xs font-semibold text-white truncate">{event.team1}</span>
                          </div>
                          
                          {/* Score */}
                          <div className="flex items-center justify-center mx-3 flex-shrink-0 gap-1">
                            <div className="border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-white/5 border-white/10">
                              <span className="text-[10px] font-bold text-white leading-none">{currentScore.team1}</span>
                            </div>
                            <span className="text-base font-bold text-white leading-none">-</span>
                            <div className="border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-white/5 border-white/10">
                              <span className="text-[10px] font-bold text-white leading-none">{currentScore.team2}</span>
                            </div>
                          </div>
                          
                          {/* Team 2 */}
                          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                            <span className="text-xs font-semibold text-white truncate">{event.team2}</span>
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
                                    : "bg-white/10 text-white hover:bg-[#ee3536]"
                                )}
                              >
                                <div className={cn("text-[10px] leading-none mb-0.5", selected ? "text-white/90" : "text-white/70")}>{btn.label}</div>
                                <div className="text-xs font-bold leading-none">{btn.odds}</div>
                              </button>
                            )
                          })}
                        </div>
                        
                        {/* Popularity Bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#ee3536] rounded-full" style={{ width: `${event.team1Percent}%` }} />
                          </div>
                          <span className="text-[9px] text-white/70">{event.team1Percent}% {event.team1Code}</span>
                          <span className="text-[9px] text-white/70">{event.team2Percent}% {event.team2Code}</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
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

        {/* Slots Carousel Section */}
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2 className="text-lg font-semibold text-white">New Games (128)</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small"
                onClick={() => router.push('/casino')}
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
                    className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
              <CarouselContent className={cn(isMobile ? "ml-3 mr-0" : "ml-6 mr-0")}>
                {Array.from({ length: 10 }).map((_, index) => {
                  const imageSrc = squareTileImages[index % squareTileImages.length]
                  const slotNames = ['Starburst', 'Book of Dead', 'Gonzo\'s Quest', 'Dead or Alive', 'Immortal Romance', 'Thunderstruck', 'Avalon', 'Blood Suckers', 'Mega Moolah', 'Bonanza']
                  const slotVendor = getTileVendor(index + 20)
                  return (
                    <CarouselItem key={index} className={cn("pr-0 basis-auto flex-shrink-0", index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4")}>
                      <div 
                        className="w-[160px] h-[160px] rounded-small bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                        onClick={() => {
                          setSelectedGame({
                            title: slotNames[index % slotNames.length],
                            image: imageSrc,
                            provider: slotVendor,
                            features: ['High RTP', 'Free Spins Feature', 'Bonus Rounds Available']
                          })
                        }}
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
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        {/* Originals Carousel Section */}
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2 className="text-lg font-semibold text-white">Originals (26)</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small"
                onClick={() => router.push('/casino')}
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
                    className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
              <CarouselContent className={cn(isMobile ? "ml-3 mr-0" : "ml-6 mr-0")}>
                {originalsTileImages.map((imageSrc, index) => {
                  const gameNames = ['Plinko', 'Blackjack', 'Dice', 'Diamonds', 'Mines', 'Keno', 'Limbo', 'Wheel', 'Hilo', 'Video Poker']
                  return (
                    <CarouselItem key={index} className={cn("pr-0 basis-auto flex-shrink-0", index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4")}>
                      <div 
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
                          alt={gameNames[index] || `Originals Game ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="160px"
                        />
                        <GameTagBadge tag="Original" vendor="Originals" />
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconInfoCircle className="w-4 h-4 text-white drop-shadow-lg" strokeWidth={2} />
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

        {/* Vendors Carousel Section */}
        <div className="mb-6">
          <div className={cn("flex items-center justify-between mb-4", isMobile ? "px-3" : "px-6")}>
            <h2 className="text-lg font-semibold text-white">Vendors</h2>
          </div>
          <div className={cn("relative", isMobile ? "-mx-3" : "-mx-6")}>
            <Carousel setApi={setVendorsCarouselApi} className="w-full relative" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
              {!isMobile && (
                <>
                  <CarouselPrevious className="!left-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                  <CarouselNext className="!right-2 !-translate-x-0 h-8 w-8 rounded-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white z-20" />
                </>
              )}
              <CarouselContent className={cn(isMobile ? "ml-3 mr-0" : "ml-6 mr-0")}>
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
                      className="group relative bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs font-medium text-gray-800 dark:text-white/70 hover:bg-gray-200/80 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all duration-300 whitespace-nowrap overflow-hidden flex items-center gap-2"
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

        {/* Why BetOnline Section - Updated with left-aligned text and trust image */}
        <div className={cn("mb-6", isMobile ? "px-3" : "px-6")}>
          <h2 className="text-lg font-semibold text-white mb-4">Why BetOnline?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Compare Our Competitors Card */}
            <Card className="group relative bg-gradient-to-br from-[#3a2a1f]/30 to-[#2d1f16]/30 backdrop-blur-sm border-white/10 rounded-small overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3a2a1f]/20 to-transparent pointer-events-none" />
              <CardContent className="p-4 relative z-10">
                <div className="mb-4">
                  <div className="text-white font-semibold text-sm mb-0.5 leading-tight">COMPARE OUR</div>
                  <div className="text-white font-semibold text-sm leading-tight">COMPETITORS</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/20 text-white/70 hover:text-white hover:bg-transparent hover:border-white/30 text-xs h-7 px-3"
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
            <Card className="group relative bg-gradient-to-br from-[#1f2a1f]/30 to-[#162116]/30 backdrop-blur-sm border-white/10 rounded-small overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1f2a1f]/20 to-transparent pointer-events-none" />
              <CardContent className="p-4 relative z-10">
                <div className="mb-4">
                  <div className="text-white font-semibold text-sm mb-0.5 leading-tight">TRUSTED BY</div>
                  <div className="text-white font-semibold text-sm leading-tight">MILLIONS</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/20 text-white/70 hover:text-white hover:bg-transparent hover:border-white/30 text-xs h-7 px-3"
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
            <Card className="group relative bg-gradient-to-br from-[#2a241f]/30 to-[#1f1a16]/30 backdrop-blur-sm border-white/10 rounded-small overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a241f]/20 to-transparent pointer-events-none" />
              <CardContent className="p-4 relative z-10">
                <div className="mb-4">
                  <div className="text-white font-semibold text-sm mb-0.5 leading-tight">VIP REWARDS</div>
                  <div className="text-white font-semibold text-sm leading-tight">PROGRAM</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/20 text-white/70 hover:text-white hover:bg-transparent hover:border-white/30 text-xs h-7 px-3"
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
          
          {/* USP Section - Single Block with Separators */}
          <div className="mt-6 flex justify-center">
            {isMobile ? (
              /* Mobile Carousel */
              <Carousel className="w-full relative" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
                <CarouselContent className="ml-0 mr-0">
                  {[
                    { icon: '/banners/partners/crypto.svg', title: 'DEPOSIT WITH CRYPTO', subtitle: 'FAST, EASY & RELIABLE' },
                    { icon: '/banners/partners/vip-rewards.svg', title: 'VIP REWARDS', subtitle: 'LEVEL UP BONUSES, BOOSTS & MORE' },
                    { icon: '/banners/partners/bettingicons-coloured.svg', title: 'BET BIG', subtitle: 'HIGH LIMITS AND RE-BET FUNCTIONALITY' },
                    { icon: '/banners/partners/live-betting.svg', title: 'FASTEST PAYOUTS', subtitle: 'PAYOUTS WITHIN MINUTES' },
                    { icon: 'lock', title: 'SAFE & SECURE', subtitle: 'TRUSTED & PROTECTED' },
                  ].map((item, index) => (
                    <CarouselItem key={index} className={cn("pr-2 basis-auto flex-shrink-0", index === 0 ? "pl-0" : "pl-2")}>
                      <div className="p-3 min-w-[280px] group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {item.icon === 'lock' ? (
                              <IconLock size={32} className="text-white/60 group-hover:text-[#dc2626] transition-all duration-300" />
                            ) : (
                              <Image
                                src={item.icon}
                                alt={item.title}
                                width={32}
                                height={32}
                                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                unoptimized
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-xs mb-0.5 uppercase leading-tight">{item.title}</h3>
                            <p className="text-white/60 text-[10px] uppercase leading-tight">{item.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              /* Desktop - Single Block with Small Separators */
              <div className="inline-flex">
                <div className="grid grid-cols-5">
                  {/* Deposit With Crypto */}
                  <div className="p-3 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src="/banners/partners/crypto.svg"
                          alt="Crypto"
                          width={32}
                          height={32}
                          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xs mb-0.5 uppercase leading-tight">DEPOSIT WITH CRYPTO</h3>
                        <p className="text-white/60 text-[10px] uppercase leading-tight">FAST, EASY & RELIABLE</p>
                      </div>
                    </div>
                  </div>

                  {/* VIP Rewards */}
                  <div className="p-3 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src="/banners/partners/vip-rewards.svg"
                          alt="VIP Rewards"
                          width={32}
                          height={32}
                          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xs mb-0.5 uppercase leading-tight">VIP REWARDS</h3>
                        <p className="text-white/60 text-[10px] uppercase leading-tight">LEVEL UP BONUSES, BOOSTS & MORE</p>
                      </div>
                    </div>
                  </div>

                  {/* Bet Big */}
                  <div className="p-3 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src="/banners/partners/bettingicons-coloured.svg"
                          alt="Bet Big"
                          width={32}
                          height={32}
                          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xs mb-0.5 uppercase leading-tight">BET BIG</h3>
                        <p className="text-white/60 text-[10px] uppercase leading-tight">HIGH LIMITS AND RE-BET FUNCTIONALITY</p>
                      </div>
                    </div>
                  </div>

                  {/* Fastest Payouts */}
                  <div className="p-3 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src="/banners/partners/live-betting.svg"
                          alt="Fast Payouts"
                          width={32}
                          height={32}
                          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xs mb-0.5 uppercase leading-tight">FASTEST PAYOUTS</h3>
                        <p className="text-white/60 text-[10px] uppercase leading-tight">PAYOUTS WITHIN MINUTES</p>
                      </div>
                    </div>
                  </div>

                  {/* Safe & Secure */}
                  <div className="p-3 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <IconLock size={32} className="text-white/60 group-hover:text-[#dc2626] transition-all duration-300" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xs mb-0.5 uppercase leading-tight">SAFE & SECURE</h3>
                        <p className="text-white/60 text-[10px] uppercase leading-tight">TRUSTED & PROTECTED</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Section */}
        <div className={cn("mb-6", isMobile ? "px-3" : "px-6")}>
          <Separator className="mb-6 bg-white/10" />
          <h2 className="text-lg font-semibold text-white mb-4">Activity</h2>
          
          {/* Tabs - Sub Nav Style */}
          <div className="mb-4 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="bg-white/5 dark:bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 backdrop-blur-xl inline-flex w-max">
              {['All Bets', 'Jackpot Winners', 'High Rollers', 'Daily Race'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivityTab(tab as 'All Bets' | 'Jackpot Winners' | 'High Rollers' | 'Daily Race')}
                  className={cn(
                    "relative px-4 py-1 h-9 text-xs font-medium rounded-2xl transition-all duration-300 whitespace-nowrap flex-shrink-0",
                    activityTab === tab
                      ? "text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5 dark:hover:bg-white/5 bg-transparent"
                  )}
                >
                  {activityTab === tab && (
                    <motion.div
                      layoutId="activityTab"
                      className="absolute inset-0 rounded-2xl -z-10"
                      style={{ backgroundColor: '#ee3536' }}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 40
                      }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed Table or Race Leaderboard */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-small overflow-hidden">
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                {activityTab === 'Daily Race' ? (
                  // Daily Race Table
                  <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] border border-white/10 dark:border-white/10 rounded-lg overflow-hidden">
                    {/* Ends in countdown */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <span className="text-white/70 text-xs">Ends in</span>
                      <div className="text-sm font-bold text-white flex items-center gap-1 tabular-nums">
                        <NumberFlow value={raceHours} />
                        <span className="mx-1">:</span>
                        <NumberFlow value={raceMinutes} />
                        <span className="mx-1">:</span>
                        <NumberFlow value={raceSeconds} />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-xs font-medium text-white/70">Rank</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-white/70">Nickname</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-white/70">Wagered</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-white/70">Prize</th>
                          </tr>
                        </thead>
                        <tbody>
                          {raceLeaderboardData.map((entry) => (
                            <tr key={entry.rank} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {entry.medal === 'gold' && <IconTrophy className="w-5 h-5 text-yellow-400" />}
                                  {entry.medal === 'silver' && <IconTrophy className="w-5 h-5 text-gray-400" />}
                                  {entry.medal === 'bronze' && <IconTrophy className="w-5 h-5 text-orange-400" />}
                                  {!entry.medal && <span className="text-white/70 text-sm">{entry.rank}th</span>}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-white text-sm">{entry.nickname}</td>
                              <td className="py-3 px-4 text-right text-white text-sm">{entry.wagered}</td>
                              <td className="py-3 px-4 text-right text-white text-sm font-semibold">{entry.prize}</td>
                            </tr>
                          ))}
                          {/* User's Position Row */}
                          <tr className="border-t-2 border-white/20 bg-white/5">
                            <td className="py-3 px-4">
                              <span className="text-white text-sm font-semibold">{userRacePosition.rank}th</span>
                            </td>
                            <td className="py-3 px-4 text-white text-sm font-semibold">{userRacePosition.nickname}</td>
                            <td className="py-3 px-4 text-right text-white text-sm font-semibold">{userRacePosition.wagered}</td>
                            <td className="py-3 px-4 text-right text-white text-sm font-semibold">{userRacePosition.prize}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : activityTab === 'Jackpot Winners' ? (
                  // Jackpot Winners Table
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/70 font-medium text-xs">Game</TableHead>
                        <TableHead className="text-white/70 font-medium text-xs">User</TableHead>
                        <TableHead className="text-white/70 font-medium text-xs">Time</TableHead>
                        <TableHead className="text-white/70 font-medium text-xs">Jackpot Won</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jackpotWinnersData.map((winner, index) => (
                        <TableRow
                          key={winner.id}
                          className={cn(
                            "border-b border-white/10 hover:bg-white/5 transition-colors",
                            index === 0 && "bg-amber-500/5"
                          )}
                        >
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {winner.gameImage ? (
                                <div className="flex-shrink-0 w-10 h-10 rounded-small overflow-hidden">
                                  <Image
                                    src={winner.gameImage}
                                    alt={winner.game}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                    quality={75}
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <IconDeviceGamepad2 className="w-4 h-4 text-white/70" />
                              )}
                              <span
                                className="text-white text-sm truncate max-w-[200px] cursor-pointer hover:text-white/80 transition-colors"
                                onClick={() => {
                                  if (winner.gameImage) {
                                    setSelectedGame({
                                      title: winner.game,
                                      image: winner.gameImage
                                    })
                                  }
                                }}
                              >
                                {winner.game}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <span className={cn(
                              "text-sm",
                              winner.user === 'Hidden' ? "text-white/50" : "text-white"
                            )}>
                              {winner.user}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <span className="text-white/60 text-sm">{winner.time}</span>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <IconTrophy className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-amber-400 text-sm font-semibold">{winner.amount}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  // Activity Feed Table
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/70 font-medium text-xs">Game</TableHead>
                        <TableHead className="text-white/70 font-medium text-xs">User</TableHead>
                        <TableHead className="text-white/70 font-medium text-xs">Time</TableHead>
                        <TableHead className="text-white/70 font-medium text-xs">Bet Amount</TableHead>
                        <TableHead className="text-white/70 font-medium text-xs">Win Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    <AnimatePresence mode="popLayout">
                      {activityFeed.map((activity, index) => {
                        return (
                          <motion.tr
                            key={activity.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={cn(
                              "border-b border-white/10 hover:bg-white/5 transition-colors",
                              index === 0 && "bg-white/5"
                            )}
                          >
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {activity.gameImage ? (
                                  <div className="flex-shrink-0 w-10 h-10 rounded-small overflow-hidden">
                                    <Image
                                      src={activity.gameImage}
                                      alt={activity.event}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                      quality={75}
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <IconDeviceGamepad2 className="w-4 h-4 text-white/70" />
                                )}
                                <span 
                                  className="text-white text-sm truncate max-w-[200px] cursor-pointer hover:text-white/80 transition-colors"
                                  onClick={() => {
                                    if (activity.gameImage) {
                                      setSelectedGame({
                                        title: activity.event,
                                        image: activity.gameImage
                                      })
                                    }
                                  }}
                                >
                                  {activity.event}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <span className={cn(
                                "text-sm",
                                activity.user === 'Hidden' ? "text-white/50" : "text-white"
                              )}>
                                {activity.user}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <span className="text-white/60 text-sm">{activity.time}</span>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <IconCoins className="w-3.5 h-3.5 text-green-400" />
                                <span className="text-white text-sm font-medium">{activity.betAmount}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {activity.winAmount ? (
                                <span className="text-green-400 text-sm font-medium">{activity.winAmount}</span>
                              ) : (
                                <span className="text-white/30 text-sm">-</span>
                              )}
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Launcher - Full Screen Overlay */}
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
                                  setGameLauncherMenuOpen(false)
                                  openDepositDrawer()
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

                    {/* Game Name - Center */}
                    <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white max-w-[50%] truncate px-2">
                      {selectedGame.title}
                    </h2>

                    {/* Right Icons - Fullscreen, Favorite and Close */}
                    <div className="flex items-center gap-1">
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
                      <button 
                        onClick={() => {
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

              {/* Content Area - Loading then Game Image */}
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
              </div>

              {showJackpotWheel && gameImageLoaded && (
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
              "bg-[#1a1a1a] text-white flex flex-col relative",
              "w-full sm:max-w-2xl border-l border-white/10 overflow-hidden",
              isMobile && "rounded-t-[10px]"
            )}
            style={isMobile ? {
              height: '80vh',
              maxHeight: '80vh',
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
                      onClick={() => {
                        setSelectedGame({
                          title: gameName,
                          image: imageSrc,
                          provider: tileVendor,
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
                      <GameTagBadge tag={getMetaTag(index)} vendor={tileVendor} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tile-shimmer" />
                    </div>
                  )
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Footer - Same as casino page */}
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
              <div>
                Copyright ©2024 BetOnline.ag. All rights reserved.
              </div>
              <div>
                {currentTime}
              </div>
            </div>
          </div>
        </footer>

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
              "w-full sm:max-w-md flex flex-col",
              isAuthDrawerView
                ? "bg-[#262626] text-white border-l border-white/10"
                : "bg-white text-gray-900 border-l border-gray-200",
              isMobile && "rounded-t-[10px]"
            )}
            style={isMobile ? {
              height: '100dvh',
              maxHeight: '100dvh',
              top: 0,
              bottom: 'auto',
            } : undefined}
          >
            {isMobile && <DrawerHandle />}
            <DrawerHeader className={cn("flex-shrink-0", isMobile ? "px-4 pt-4 pb-2" : "px-4 pt-5 pb-3")}>
              {accountDrawerView === 'notifications' ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-1 items-center gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => setAccountDrawerView('account')}
                      className="h-8 w-8 p-0 hover:bg-gray-100 -ml-2"
                    >
                      <IconChevronLeft className="h-5 w-5 text-gray-600" />
                    </Button>
                    <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isMobile && (
                      <DrawerClose asChild>
                        <button className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                          <IconX className="h-4 w-4 text-gray-600" />
                        </button>
                      </DrawerClose>
                    )}
                  </div>
                </div>
              ) : accountDrawerView === 'createAccount' || accountDrawerView === 'login' ? (
                <div className="w-full space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 pr-2">
                      <h2 className="text-lg font-bold leading-tight text-white">
                        {accountDrawerView === 'createAccount' ? 'Create account' : 'Log in'}
                      </h2>
                      <p className="mt-1 text-xs leading-relaxed text-white/50">
                        {accountDrawerView === 'createAccount'
                          ? 'Join BetOnline in seconds and unlock welcome bonuses.'
                          : 'Welcome back — sign in to pick up where you left off.'}
                      </p>
                    </div>
                    <DrawerClose asChild>
                      <button
                        type="button"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Close"
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    </DrawerClose>
                  </div>
                  <div className="flex rounded-full bg-black/35 p-0.5 ring-1 ring-white/10">
                    <button
                      type="button"
                      onClick={() => setAccountDrawerView('createAccount')}
                      className={cn(
                        'flex-1 rounded-full py-2 text-center text-xs font-semibold transition-colors',
                        accountDrawerView === 'createAccount'
                          ? 'bg-white/15 text-white shadow-sm'
                          : 'text-white/45 hover:text-white/70'
                      )}
                    >
                      Create account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountDrawerView('login')}
                      className={cn(
                        'flex-1 rounded-full py-2 text-center text-xs font-semibold transition-colors',
                        accountDrawerView === 'login'
                          ? 'bg-white/15 text-white shadow-sm'
                          : 'text-white/45 hover:text-white/70'
                      )}
                    >
                      Login
                    </button>
                  </div>
                </div>
              ) : accountDrawerView === 'createAccountConfirmation' ? (
                <div className="flex w-full items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-white">Confirm your email</h2>
                  <DrawerClose asChild>
                    <button
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors hover:bg-white/10"
                      aria-label="Close"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </DrawerClose>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  {isUserLoggedIn ? (
                    <div className="flex flex-1 items-center gap-3">
                      <Avatar className="h-10 w-10 border border-gray-200">
                        <AvatarFallback className="flex items-center justify-center bg-gray-100 text-sm font-semibold text-gray-600">
                          CH
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="text-left text-sm font-medium text-gray-900">CH</div>
                        <div className="text-left text-xs text-gray-500">b1767721</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center gap-3">
                      <Avatar className="h-10 w-10 border border-gray-200">
                        <AvatarFallback className="flex items-center justify-center bg-gray-100 text-sm font-semibold text-gray-600">
                          G
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="text-left text-sm font-medium text-gray-900">Guest</div>
                        <div className="text-left text-xs text-gray-500">Not signed in</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {accountDrawerView === 'account' && isUserLoggedIn ? (
                      <button
                        onClick={() => setAccountDrawerView('notifications')}
                        className={cn(
                          'relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors',
                          'bg-gray-100 hover:bg-gray-200'
                        )}
                      >
                        <IconBell className="h-4 w-4 text-gray-600" />
                        <div className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                      </button>
                    ) : null}
                    {!isMobile && (
                      <DrawerClose asChild>
                        <button className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                          <IconX className="h-4 w-4 text-gray-600" />
                        </button>
                      </DrawerClose>
                    )}
                  </div>
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
                        router.push('/account')
                      }}
                    >
                      <IconUser className="w-5 h-5 mr-3 text-gray-700" />
                      <span className="flex-1 text-left text-gray-900">My Account</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3 min-w-0"
                      onClick={() => setAccountDrawerView('notifications')}
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
                      onClick={() => {
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
                      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">You are logged out</p>
                        <p className="mt-1 text-xs text-gray-600">Log back in or create an account to place bets and access your wallet.</p>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => setAccountDrawerView('login')}
                          className="h-10 rounded-lg border border-gray-300 bg-white !text-gray-900 hover:bg-gray-100 hover:!text-gray-900"
                        >
                          Login
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setAccountDrawerView('createAccount')}
                          className="h-10 rounded-lg border-0 bg-gradient-to-r from-[#ee3536] to-[#c42a2a] text-white shadow-sm hover:opacity-95"
                        >
                          Create account
                        </Button>
                      </div>

                      <Separator className="bg-gray-200 mb-3" />

                      <div className="space-y-1 w-full mb-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-11 px-3"
                          onClick={() => {
                            setAccountDrawerOpen(false)
                            openDepositDrawer()
                          }}
                        >
                          <IconWallet className="w-5 h-5 mr-3 text-gray-700" />
                          <span className="flex-1 text-left text-gray-900">Banking</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-11 px-3"
                        >
                          <IconLifebuoy className="w-5 h-5 mr-3 text-gray-700" />
                          <span className="flex-1 text-left text-gray-900">Help Center</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-11 px-3"
                          onClick={() => {
                            openVipDrawer()
                          }}
                        >
                          <IconCrown className="w-5 h-5 mr-3 text-gray-700" />
                          <span className="flex-1 text-left text-gray-900">VIP Rewards</span>
                        </Button>
                      </div>
                    </>
                  )}
                </>
              ) : accountDrawerView === 'login' ? (
                <div className="space-y-4">
                  <div className={authCardClass}>
                    <input
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, identifier: e.target.value }))}
                      placeholder="Email or account number"
                      autoComplete="username"
                      className={authFieldClass}
                      aria-label="Email or account number"
                    />
                    <div className="relative">
                      <input
                        type={loginPasswordVisible ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Password"
                        autoComplete="current-password"
                        className={`${authFieldClass} pr-10`}
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setLoginPasswordVisible((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        aria-label={loginPasswordVisible ? 'Hide password' : 'Show password'}
                      >
                        {loginPasswordVisible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={loginForm.keepLoggedIn}
                          onCheckedChange={(checked) => setLoginForm((prev) => ({ ...prev, keepLoggedIn: checked === true }))}
                          className="h-5 w-5 rounded-[4px] border-white/25 bg-[#1a1a1a] data-[state=checked]:border-[#ee3536] data-[state=checked]:bg-[#ee3536]"
                        />
                        <span className="text-sm text-white/70">Keep me logged in</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="text-white/40 hover:text-white/65">
                              <IconInfoCircle className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="center"
                            side="top"
                            className="w-[300px] border border-white/10 bg-[#2a2a2a] p-4 text-white/90 shadow-xl"
                          >
                            <p className="text-sm leading-relaxed">
                              Choosing <span className="font-semibold text-white">&quot;Keep me logged in&quot;</span> reduces how often you&apos;re asked to sign in on this device.
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-white/75">
                              Use this only on personal devices, not shared or public ones.
                            </p>
                          </PopoverContent>
                        </Popover>
                      </label>
                      <button type="button" className="text-xs font-semibold text-[#ee3536] hover:text-[#ff5a5a]">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canSubmitLogin}
                    className={authPrimaryBtnClass}
                    onClick={() => {
                      setIsUserLoggedIn(true)
                      setAccountDrawerOpen(false)
                      setAccountDrawerView('account')
                    }}
                  >
                    Log in
                  </button>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#262626] px-3 text-[11px] font-medium uppercase tracking-wide text-white/40">
                        Or
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/12 bg-[#1a1a1a] text-sm font-medium text-white/90 hover:bg-white/5"
                    onClick={() => void handleLoginWithPasskey()}
                  >
                    <IconKey className="h-4 w-4" aria-hidden />
                    Sign in with passkey
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-xs font-medium text-white/55 hover:text-white/80"
                      onClick={() => setAccountDrawerView('createAccount')}
                    >
                      Don&apos;t have an account?{' '}
                      <span className="font-semibold text-[#ee3536]">Create one</span>
                    </button>
                  </div>
                </div>
              ) : accountDrawerView === 'createAccount' ? (
                <div className="space-y-4">
                  <div className={authCardClass}>
                    <input
                      type="email"
                      value={createAccountForm.email}
                      onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Email address"
                      autoComplete="email"
                      className={authFieldClass}
                      aria-label="Email address"
                    />
                    {createAccountTouched && createAccountErrors.email && (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.email}</p>
                    )}
                    <input
                      value={createAccountForm.fullName}
                      onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Username"
                      autoComplete="username"
                      className={authFieldClass}
                      aria-label="Username"
                    />
                    {createAccountTouched && createAccountErrors.fullName && (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.fullName}</p>
                    )}
                    <div className="relative">
                      <input
                        type={createAccountPasswordVisible ? 'text' : 'password'}
                        value={createAccountForm.password}
                        onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Create password"
                        autoComplete="new-password"
                        className={`${authFieldClass} pr-10`}
                        aria-label="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setCreateAccountPasswordVisible((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        aria-label={createAccountPasswordVisible ? 'Hide password' : 'Show password'}
                      >
                        {createAccountPasswordVisible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                      </button>
                    </div>
                    {createAccountTouched && createAccountErrors.password && (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.password}</p>
                    )}
                    <ReferralCodeField
                      value={referralCode}
                      onChange={setReferralCode}
                      expanded={referralExpanded}
                      onToggle={() => setReferralExpanded((v) => !v)}
                      inputClassName={authFieldClass}
                    />
                    <div className="grid grid-cols-[auto_1fr] gap-2">
                      <button
                        ref={authCountryTriggerRef}
                        type="button"
                        onClick={() => {
                          setAuthCountryMenuOpen((o) => !o)
                        }}
                        aria-expanded={authCountryMenuOpen}
                        aria-haspopup="listbox"
                        title={selectedAuthCountry.label}
                        className={cn(
                          authSelectTriggerClass,
                          'h-11 min-w-[3.25rem] shrink-0 gap-2 px-3',
                        )}
                        aria-label={`Dial code ${selectedAuthCountry.dial}, ${selectedAuthCountry.label}`}
                      >
                        <span className="text-sm font-semibold tabular-nums text-white">
                          {selectedAuthCountry.dial}
                        </span>
                        <IconChevronDown
                          className={cn(
                            'h-4 w-4 shrink-0 text-white/45 transition-transform',
                            authCountryMenuOpen && 'rotate-180',
                          )}
                        />
                      </button>
                      {authCountryMenuOpen && authCountryMenuRect && typeof document !== 'undefined'
                        ? createPortal(
                            <div
                              ref={authCountryListRef}
                              role="listbox"
                              aria-label="Select country"
                              className="fixed z-[100000] overflow-hidden rounded-lg border border-white/10 bg-[#2a2a2a] py-1 shadow-xl ring-1 ring-black/40"
                              style={{
                                top: authCountryMenuRect.top,
                                left: authCountryMenuRect.left,
                                minWidth: authCountryMenuRect.width,
                              }}
                            >
                              {AUTH_COUNTRY_OPTIONS.map((opt) => (
                                <button
                                  key={opt.iso}
                                  type="button"
                                  role="option"
                                  aria-selected={createAccountForm.countryIso === opt.iso}
                                  className={cn(
                                    'flex w-full px-3 py-2.5 text-left text-sm text-white hover:bg-white/10',
                                    createAccountForm.countryIso === opt.iso && 'bg-white/5',
                                  )}
                                  onClick={() => {
                                    setCreateAccountForm((prev) => ({ ...prev, countryIso: opt.iso }))
                                    setAuthCountryMenuOpen(false)
                                  }}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>,
                            document.body,
                          )
                        : null}
                      <input
                        type="tel"
                        value={createAccountForm.phone}
                        onChange={(e) => setCreateAccountForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Mobile number"
                        autoComplete="tel"
                        className={authFieldClass}
                        aria-label="Mobile number"
                      />
                    </div>
                    {createAccountTouched && createAccountErrors.phone && (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.phone}</p>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="relative">
                        <select
                          value={createAccountDob.day}
                          onChange={(e) => setCreateAccountDob((prev) => ({ ...prev, day: e.target.value }))}
                          className={`${authFieldClass} appearance-none pr-8 text-white/80`}
                          aria-label="Day of birth"
                        >
                          <option value="">DD</option>
                          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      </div>
                      <div className="relative">
                        <select
                          value={createAccountDob.month}
                          onChange={(e) => setCreateAccountDob((prev) => ({ ...prev, month: e.target.value }))}
                          className={`${authFieldClass} appearance-none pr-8 text-white/80`}
                          aria-label="Month of birth"
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      </div>
                      <div className="relative">
                        <select
                          value={createAccountDob.year}
                          onChange={(e) => setCreateAccountDob((prev) => ({ ...prev, year: e.target.value }))}
                          className={`${authFieldClass} appearance-none pr-8 text-white/80`}
                          aria-label="Year of birth"
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 100 }, (_, i) => currentYear - 18 - i).map((y) => (
                            <option key={y} value={String(y)}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      </div>
                    </div>
                    {createAccountTouched && createAccountErrors.dob && (
                      <p className="text-xs text-[#ee3536]">{createAccountErrors.dob}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCreateAccountTouched(true)
                      if (!isCreateAccountStepValid) return
                      setAccountDrawerView('createAccountConfirmation')
                    }}
                    disabled={!isCreateAccountStepValid}
                    className={authPrimaryBtnClass}
                  >
                    Create account
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-xs font-medium text-white/55 hover:text-white/80"
                      onClick={() => setAccountDrawerView('login')}
                    >
                      Already have an account?{' '}
                      <span className="font-semibold text-[#ee3536]">Log in</span>
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-3 text-white/45">
                        <div className="flex items-center gap-1.5">
                          <IconShield className="h-3.5 w-3.5 text-emerald-400/90" />
                          <span className="text-xs font-medium">Safe &amp; secure</span>
                        </div>
                        <div className="h-3.5 w-px bg-white/15" />
                        <div className="flex items-center gap-1.5">
                          <IconLock className="h-3.5 w-3.5 text-[#ee3536]/80" />
                          <span className="text-xs font-medium">Trusted</span>
                        </div>
                      </div>
                      <p className="text-center text-xs text-white/35">Your details are encrypted and protected.</p>
                    </div>
                  </div>
                </div>
              ) : accountDrawerView === 'createAccountConfirmation' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-[#ee3536]" />
                    <div className="h-1.5 flex-1 rounded-full bg-[#ee3536]" />
                  </div>
                  <div className="text-xs text-white/45">Step 2 of 2: Verify your email</div>

                  <div className="rounded-xl border border-white/10 bg-[#1f1f1f] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600">
                        <IconCheck className="h-3.5 w-3.5 text-white" />
                      </span>
                      <p className="text-sm font-semibold text-white">Account created</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      We sent an activation email to{' '}
                      <span className="font-medium text-white">{createAccountForm.email || 'your email'}</span>. Open it to
                      activate your account and start betting.
                    </p>
                    <div className="mt-4 space-y-1.5">
                      <label className="text-xs font-medium text-white/50">Alias / nickname (optional)</label>
                      <input
                        value={createAccountAlias}
                        onChange={(e) => setCreateAccountAlias(e.target.value)}
                        placeholder="How should we display your name?"
                        className={authFieldClass}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountDrawerView('account')
                      setCreateAccountTouched(false)
                      setCreateAccountPasswordVisible(false)
                      setCreateAccountDob({ day: '', month: '', year: '' })
                      setCreateAccountAlias('')
                      setCreateAccountForm({
                        fullName: '',
                        email: '',
                        password: '',
                        countryIso: 'US',
                        phone: '',
                        dob: '',
                      })
                      setReferralCode('')
                      setReferralExpanded(false)
                    }}
                    className={authPrimaryBtnClass}
                  >
                    Done
                  </button>
                </div>
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
          showSearch={false}
          showFavorites={false}
        />
      )}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <SidebarProvider>
      <HomePageContent />
    </SidebarProvider>
  )
}
