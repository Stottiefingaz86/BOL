'use client'
import { useRainBalance } from '@/hooks/use-rain-balance'

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
, IconMessageCircle2} from '@tabler/icons-react'
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
import DynamicIsland from '@/components/dynamic-island'
import ChatNavToggle from '@/components/chat/chat-nav-toggle'
import { useChatStore } from '@/lib/store/chatStore'
import {
  IconButton,
  type IconButtonProps,
} from '@/components/animate-ui/components/buttons/icon'
import { Heart } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
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
          width={80}
          height={30}
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

// VIP Progress Bar Component
function VIPProgressBar({ value = 45 }: { value?: number }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            // Animate progress bar from 0 to target value
            const duration = 1500 // 1.5 seconds
            const startTime = Date.now()
            const startValue = 0
            const endValue = value

            const animate = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / duration, 1)
              // Ease out cubic for smooth animation
              const eased = 1 - Math.pow(1 - progress, 3)
              const currentValue = startValue + (endValue - startValue) * eased
              setAnimatedValue(currentValue)

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setAnimatedValue(endValue)
              }
            }

            requestAnimationFrame(animate)
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
  }, [value, isVisible])

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      <div className="relative flex-1 h-2.5 bg-white/10 dark:bg-white/10 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden transition-colors duration-300" style={{ maxWidth: '75%' }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)'
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${animatedValue}%` }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
      <motion.div
        className="text-xs text-gray-700 dark:text-white/70 whitespace-nowrap transition-colors duration-300"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <NumberFlow value={Math.round(animatedValue)} />%
      </motion.div>
    </div>
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
    <div className="mb-12 w-full flex justify-center" ref={containerRef}>
      <Card className="bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 transition-colors duration-300" style={{ width: '700px', height: '140px' }}>
        <CardContent className="p-6 flex flex-col justify-center items-center h-full text-center">
          <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-4 transition-colors duration-300">Total Rewards Claimed</CardTitle>
          <div className="text-5xl font-bold text-white dark:text-white text-gray-900 dark:text-white transition-colors duration-300">
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
    <div className="mb-12 w-full mt-12 flex flex-col items-center">
      {/* Title and Subtitle */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">The Levels</h2>
        <p className="text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
          At BetOnline, you can start raking in the rewards as soon as you sign up.
          <br />
          Through leveling up, your gaming experience will only get better with bigger rewards and benefits.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative mb-8 w-full px-4">
        <div className="h-px bg-white/20 absolute top-1/2 left-4 right-4 -translate-y-1/2"></div>
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
                      <div className={`w-8 h-8 rounded-full bg-[#1a1a1a] border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                        isActive ? 'border-white scale-110' : 'border-white/30'
                      }`}>
                        <IconCrown className={`w-5 h-5 ${tier.iconColor}`} />
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

      {/* Carousel */}
      <div className="relative w-full overflow-visible px-0 flex justify-center">
        <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: false, dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
          <CarouselContent className="!ml-0 -mr-0">
            {allLevels.map((level, index) => {
              const isFirst = index === 0
              const isLast = index === allLevels.length - 1
              const isAtStart = current === 0
              const isAtEnd = current === allLevels.length - 1
              
              // Add left padding to first card only when at start
              // Add right padding to last card only when at end
              // Add more space between cards
              const leftPadding = isFirst && isAtStart ? "pl-6" : "pl-0"
              const rightPadding = isLast && isAtEnd ? "pr-6" : "pr-0"
              const cardSpacing = index === 0 ? "" : "ml-6"
              
              return (
              <CarouselItem key={index} className={`${leftPadding} ${rightPadding} ${cardSpacing} basis-auto flex-shrink-0`}>
                <Card className="bg-white/5 border-white/10 relative flex-shrink-0 overflow-hidden" style={{ width: '240px', minHeight: '320px' }}>
                  {level.isActive && (
                    <div className="absolute inset-0 opacity-100 pointer-events-none rounded-lg tile-shimmer" />
                  )}
                  <CardContent className="p-4 relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <IconCrown className={`w-5 h-5 ${level.iconColor}`} />
                      <span className={`text-xs font-semibold ${level.bgColor} ${level.textColor} px-2 py-1 rounded`}>
                        {level.name}
                      </span>
                    </div>
                    <div className={`text-lg font-semibold mb-1 ${level.isActive ? 'text-white' : 'text-white/50'}`}>
                      {level.wager}
                    </div>
                    <div className={`text-sm mb-4 ${level.isActive ? 'text-white/70' : 'text-white/50'}`}>
                      Wager Amount
                    </div>
                    <div className="space-y-2">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className={`flex items-center gap-2 text-sm ${level.isActive ? 'text-white' : 'text-white/50'}`}>
                          <div className={`h-4 w-4 rounded-full flex items-center justify-center ${level.isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              )
            })}
          </CarouselContent>
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

// Daily Races Timer Component
function DailyRacesTimer() {
  const [hours, setHours] = useState(6)
  const [minutes, setMinutes] = useState(54)
  const [seconds, setSeconds] = useState(31)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s === 0) {
          setMinutes((m) => {
            if (m === 0) {
              setHours((h) => (h === 0 ? 23 : h - 1))
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

  return (
    <div className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-1 tabular-nums transition-colors duration-300">
      <NumberFlow value={hours} />
      <span className="mx-1">:</span>
      <NumberFlow value={minutes} />
      <span className="mx-1">:</span>
      <NumberFlow value={seconds} />
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <SidebarInset className="bg-[#1a1a1a] text-white overflow-y-auto">
      <div className="px-6 pt-8 pb-8 max-w-7xl mx-auto w-full">
        {/* Banner Carousel - Reusing Casino Banner with Arrows */}
        <div className="mb-8 -mx-6">
          <Carousel className="w-full relative overflow-visible" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
            <CarouselContent className="ml-6 -mr-2 md:-mr-4">
            {/* VIP Rewards Card */}
            <CarouselItem className="pl-0 pr-3 basis-auto flex-shrink-0">
              <Card 
                className="group relative bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300 cursor-pointer overflow-hidden" 
                style={{ width: '200px', height: '140px' }}
                onClick={() => {
                  if (setVipDrawerOpen) {
                    setVipDrawerOpen(true)
                  }
                }}
              >
                <CardContent className="p-4 relative z-10">
                  <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-4 transition-colors duration-300">VIP Rewards</CardTitle>
                  <div className="text-xs text-gray-600 dark:text-white/50 mb-2 transition-colors duration-300">Gold To Platinum I</div>
                  <VIPProgressBar value={45} />
                </CardContent>
                {/* Sweep effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
              </Card>
            </CarouselItem>
            
            {/* Daily Races Card */}
            <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
              <Card 
                className="group relative bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300 cursor-pointer overflow-hidden" 
                style={{ width: '300px', height: '140px' }}
                onClick={() => {
                  // Save current page state before navigating
                  if (setPreviousPageState) {
                    setPreviousPageState({
                      showSports: false,
                      showVipRewards: true,
                      activeSubNav: undefined
                    })
                  }
                  if (setShowVipRewards) {
                    setShowVipRewards(true)
                  }
                  if (setVipActiveSidebarItem) {
                    setVipActiveSidebarItem('Cash Races')
                  }
                  // Scroll to top when navigating to new page
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-0 transition-colors duration-300">Daily Races</CardTitle>
                    <div className="text-right">
                      <DailyRacesTimer />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Position</div>
                    </div>
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Wagered</div>
                    </div>
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Current Prize</div>
                    </div>
                  </div>
                </CardContent>
                {/* Sweep effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
              </Card>
            </CarouselItem>
            
            {/* Weekly Game Banner */}
            <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
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
            <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
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
            <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
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
              <CarouselItem key={`banner-placeholder-${index}`} className="pl-3 pr-3 basis-auto flex-shrink-0">
                <Card className="border-0 relative overflow-hidden flex-shrink-0" style={{ width: '320px', height: '140px' }}>
                  <Skeleton className="w-full h-full rounded-small bg-white/10 dark:bg-white/10" />
                </Card>
              </CarouselItem>
            ))}
            </CarouselContent>
          </Carousel>
        </div>
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
                  } else {
                    // If we came from VIP Rewards Overview, go back to Overview
                    if (setVipActiveSidebarItem) {
                      setVipActiveSidebarItem('Overview')
                    }
                  }
                  if (setPreviousPageState) {
                    setPreviousPageState(null)
                  }
                  // Scroll to top when going back
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/5 transition-colors duration-300 text-gray-800 dark:text-white/70 hover:text-black dark:hover:text-white"
              aria-label="Go back"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-white">Cash Races</h1>
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
                      width={64}
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
                    <DailyRacesTimer />
                  </div>
                </div>
                
                {/* User's Current Status - Using Daily Race Card Components */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Position</div>
                    </div>
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Wagered</div>
                    </div>
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Current Prize</div>
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
    <SidebarInset className="bg-[#1a1a1a] text-white overflow-y-auto">
      <div className="px-6 pt-8 pb-8 max-w-7xl mx-auto w-full">
        {/* Banner Carousel - Reusing Casino Banner with Arrows */}
        <div className="mb-8 -mx-6">
          <Carousel className="w-full relative overflow-visible" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
            <CarouselContent className="ml-6 -mr-2 md:-mr-4">
              {/* VIP Rewards Card */}
              <CarouselItem className="pl-0 pr-3 basis-auto flex-shrink-0">
                <Card 
                  className="group relative bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300 cursor-pointer overflow-hidden" 
                  style={{ width: '200px', height: '140px' }}
                  onClick={() => {
                    if (setVipDrawerOpen) {
                      setVipDrawerOpen(true)
                    }
                  }}
                >
                  <CardContent className="p-4 relative z-10">
                    <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-4 transition-colors duration-300">VIP Rewards</CardTitle>
                    <div className="text-xs text-gray-600 dark:text-white/50 mb-2 transition-colors duration-300">Gold To Platinum I</div>
                    <VIPProgressBar value={45} />
                  </CardContent>
                  {/* Sweep effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                </Card>
              </CarouselItem>
              
              {/* Daily Races Card */}
              <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
                <Card 
                  className="group relative bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300 cursor-pointer overflow-hidden" 
                  style={{ width: '300px', height: '140px' }}
                  onClick={() => {
                    if (setShowVipRewards) {
                      setShowVipRewards(true)
                    }
                    if (setVipActiveSidebarItem) {
                      setVipActiveSidebarItem('Cash Races')
                    }
                  }}
                >
                  <CardContent className="p-4 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-0 transition-colors duration-300">Daily Races</CardTitle>
                      <div className="text-right">
                        <DailyRacesTimer />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                        <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                        <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Position</div>
                      </div>
                      <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                        <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                        <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Wagered</div>
                      </div>
                      <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                        <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                        <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Current Prize</div>
                      </div>
                    </div>
                  </CardContent>
                  {/* Sweep effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                </Card>
              </CarouselItem>
              
              {/* Weekly Game Banner */}
              <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
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
              <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
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
            </CarouselContent>
          </Carousel>
        </div>

        {/* Promos Section */}
        <div className="w-full">
          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-6">Promos</h1>

          {/* Tabs - Using AnimateTabs like Casino */}
          <div className="mb-6">
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
          <div className="grid grid-cols-4 gap-4">
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
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    style={{ backgroundColor: brandPrimary }}
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

// My Bonus Page Component
function MyBonusPage({ brandPrimary }: { brandPrimary: string }) {
  const id = useId()
  const [activeTab, setActiveTab] = useState('Sports')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
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
  ])

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
    <SidebarInset className="bg-[#1a1a1a] text-white overflow-y-auto">
      <div className="px-6 pt-8 pb-8 max-w-7xl mx-auto w-full">
        {/* Banner Carousel - Reusing Casino Banner with Arrows */}
        <div className="mb-8 -mx-6">
          <Carousel className="w-full relative overflow-visible" opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}>
            <CarouselContent className="ml-6 -mr-2 md:-mr-4">
              {/* VIP Rewards Card */}
              <CarouselItem className="pl-0 pr-3 basis-auto flex-shrink-0">
                  <Card className="bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300" style={{ width: '200px', height: '140px' }}>
                  <CardContent className="p-4">
                    <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-4 transition-colors duration-300">VIP Rewards</CardTitle>
                    <div className="text-xs text-gray-600 dark:text-white/50 mb-2 transition-colors duration-300">Gold To Platinum I</div>
                    <VIPProgressBar value={45} />
                  </CardContent>
                </Card>
              </CarouselItem>
              
              {/* Daily Races Card */}
              <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
                <Card className="bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300" style={{ width: '300px', height: '140px' }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-0 transition-colors duration-300">Daily Races</CardTitle>
                      <div className="text-right">
                        <DailyRacesTimer />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                        <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                        <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Position</div>
                      </div>
                      <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                        <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                        <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Wagered</div>
                      </div>
                      <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                        <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                        <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Current Prize</div>
                      </div>
                    </div>
                  </CardContent>
                  {/* Sweep effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                </Card>
              </CarouselItem>
              
              {/* Weekly Game Banner */}
              <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
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
              <CarouselItem className="pl-3 pr-3 basis-auto flex-shrink-0">
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
            </CarouselContent>
          </Carousel>
        </div>

        {/* My Bonus Section */}
        <div className="w-full">
          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-6">My Bonus</h1>

          {/* Tabs - Using AnimateTabs like Casino */}
          <div className="mb-6">
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

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Filter by code or amount */}
              <div className="relative">
                <Input
                  id={`${id}-input`}
                  ref={inputRef}
                  className={cn(
                    "peer min-w-60 ps-9 bg-white/5 border-white/10 text-white placeholder:text-white/50",
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
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
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
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
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
          </div>

          {/* Table */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-4">
            <Table className="table-fixed">
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
      </div>
    </SidebarInset>
  )
}

// VIP Rewards Page Component
function VIPRewardsPage({ brandPrimary, setVipDrawerOpen, setVipActiveTab, setShowToast, setToastMessage, setToastAction, setShowVipRewards, setIsPageTransitioning, initialVipSidebarItem, setInitialVipSidebarItem, previousPageState, setPreviousPageState, setActiveSubNav }: { brandPrimary: string; setVipDrawerOpen: (open: boolean) => void; setVipActiveTab: (tab: string) => void; setShowToast: (show: boolean) => void; setToastMessage: (message: string) => void; setToastAction: (action: { label: string; onClick: () => void } | null) => void; setShowVipRewards: (show: boolean) => void; setIsPageTransitioning: (transitioning: boolean) => void; initialVipSidebarItem?: string | null; setInitialVipSidebarItem?: (item: string | null) => void; previousPageState?: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null; setPreviousPageState?: (state: { showSports: boolean; showVipRewards: boolean; activeSubNav?: string } | null) => void; setActiveSubNav?: (nav: string) => void }) {
  const { state: sidebarState } = useSidebar()
  const [vipActiveSidebarItem, setVipActiveSidebarItem] = useState(initialVipSidebarItem || 'Overview')
  const [hasShownToast, setHasShownToast] = useState(false)
  
  // Update sidebar item when initialVipSidebarItem changes
  useEffect(() => {
    if (initialVipSidebarItem) {
      setVipActiveSidebarItem(initialVipSidebarItem)
      // Reset after setting to allow normal navigation
      if (setInitialVipSidebarItem) {
        setTimeout(() => {
          setInitialVipSidebarItem(null)
        }, 100)
      }
    }
  }, [initialVipSidebarItem, setInitialVipSidebarItem])
  
  // Show toast when VIP Rewards page is first shown
  useEffect(() => {
    if (!hasShownToast) {
      setToastMessage('You have a cash boost available')
      setToastAction({
        label: 'View',
        onClick: () => {
          setVipDrawerOpen(true)
          setVipActiveTab('VIP Hub')
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
  
  return (
    <div className="flex w-full min-h-screen bg-[#1a1a1a]">
      {/* VIP Rewards Sidebar */}
      <Sidebar 
        collapsible="icon"
        variant="sidebar"
        className="!bg-[#2d2d2d] border-r border-white/10 text-white [&>div]:!bg-[#2d2d2d]"
      >
        <SidebarContent className="overflow-y-auto">
          <TooltipProvider>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Menu Items */}
                  {[
              { id: 'Overview', icon: IconLayoutDashboard, label: 'VIP Dashboard' },
              { id: 'My Bonus', icon: IconGift, label: 'My Bonus' },
              { id: 'Promos', icon: IconSparkles, label: 'Promos' },
              { id: 'Cash Races', icon: IconClock, label: 'Cash Races' },
              { id: 'Contests', icon: IconTrophy, label: 'Contests' },
              { id: 'Refer A Friend', icon: IconUserPlus, label: 'Refer A Friend' },
              { type: 'separator' },
              { id: 'Reloads', icon: IconCoins, label: 'Reloads', linkTo: 'reloads' },
              { id: 'Cash Drop', icon: IconCoins, label: 'Cash Drop', linkTo: 'draw' },
              { id: 'Bet & Get', icon: IconCoins, label: 'Bet & Get', linkTo: 'draw' },
              { type: 'separator' },
              { id: 'Get Telegram', icon: IconDownload, label: 'Get Telegram' },
            ].map((item, index) => {
              if (item.type === 'separator') {
                return (
                  <React.Fragment key={`separator-${index}`}>
                    <Separator className="bg-white/10 my-2" />
                  </React.Fragment>
                )
              }
              if (item.type === 'title') {
                return (
                  <div key={`title-${index}`} className="px-3 py-2 mb-1">
                    <div className="text-white/60 text-xs font-medium">{item.label}</div>
                  </div>
                )
              }
              if (!item.icon || !item.id) return null
              const Icon = item.icon
              const itemId = item.id
              const isActive = vipActiveSidebarItem === itemId
              return (
                <SidebarMenuItem key={itemId}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (item.linkTo) {
                            // Deep link to VIP hub drawer
                            if (item.linkTo === 'reloads') {
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
                            // Navigate to appropriate page based on item
                            if (itemId === 'Overview') {
                              // VIP Dashboard links to main VIP Rewards page
                              setVipActiveSidebarItem('Overview')
                            } else if (itemId === 'My Bonus') {
                              // My Bonus links to My Bonus page
                              setVipActiveSidebarItem('My Bonus')
                            } else {
                              setVipActiveSidebarItem(itemId)
                            }
                          }
                        }}
                        className={cn(
                          "w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer",
                          "data-[active=true]:text-white data-[active=true]:font-medium",
                          "data-[active=false]:text-white/70 hover:text-white hover:bg-white/5"
                        )}
                        style={isActive ? { backgroundColor: brandPrimary } : undefined}
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
          </TooltipProvider>
        </SidebarContent>
      </Sidebar>
      
      {vipActiveSidebarItem === 'My Bonus' ? (
        <MyBonusPage brandPrimary={brandPrimary} />
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
        <SidebarInset className="bg-[#1a1a1a] text-white overflow-y-auto">
        {/* Hero Image */}
        <div className="w-full relative">
          <img 
            src="/banners/sports_league/Hero.png" 
            alt="VIP Rewards Hero" 
            className="w-full h-auto object-cover"
            style={{ display: 'block' }}
          />
        </div>
        
        <div className="px-6 pt-8 pb-8 max-w-7xl mx-auto flex flex-col items-center w-full">
          {/* Cards from Casino Banner - Centered */}
          <div className="mb-4 w-full flex justify-center items-center mt-8">
            <div className="flex items-center gap-3">
              {/* VIP Rewards Card - Wider */}
              <Card className="bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300" style={{ width: '280px', height: '140px' }}>
                <CardContent className="p-4">
                  <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-4 transition-colors duration-300">Gold To Platinum I</CardTitle>
                  <VIPProgressBar value={45} />
                  <div className="text-xs text-gray-600 dark:text-white/50 mt-2 transition-colors duration-300">Updated 24/25/2024, 8:00 PM ET</div>
                </CardContent>
              </Card>
              
              {/* Daily Races Card - Wider */}
              <Card className="bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300" style={{ width: '420px', height: '140px' }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-0 transition-colors duration-300">Daily Races</CardTitle>
                    <div className="text-right">
                      <DailyRacesTimer />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Position</div>
                    </div>
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Wagered</div>
                    </div>
                    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                      <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                      <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Current Prize</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Total Rewards Claimed - Same width as VIP Rewards + Daily Races combined (700px) */}
          <TotalRewardsCard />

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
              <h2 className="text-3xl font-bold text-white">The Rewards</h2>
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
                          setVipActiveTab('VIP Hub')
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
    </div>
  )
}

// Sports Page Component
function SportsPage({ activeTab, onTabChange, onBack, brandPrimary, brandPrimaryHover, onSearchClick, betslipOpen, setBetslipOpen, bets, setBets, setShowToast, setToastMessage, setToastAction, placedBets, setPlacedBets, myBetsAlertCount, setMyBetsAlertCount, betslipManuallyClosed, setBetslipManuallyClosed, activeSport, setActiveSport }: { activeTab: string; onTabChange: (tab: string) => void; onBack: () => void; brandPrimary: string; brandPrimaryHover: string; onSearchClick: () => void; betslipOpen: boolean; setBetslipOpen: (open: boolean) => void; bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>; setBets: (bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }> | ((prev: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>) => Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>)) => void; setShowToast: (show: boolean) => void; setToastMessage: (message: string) => void; setToastAction: (action: { label: string; onClick: () => void } | null) => void; placedBets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>; setPlacedBets: (bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }> | ((prev: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>) => Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>)) => void; myBetsAlertCount: number; setMyBetsAlertCount: (count: number | ((prev: number) => number)) => void; betslipManuallyClosed: boolean; setBetslipManuallyClosed: (closed: boolean) => void; activeSport: string; setActiveSport: (sport: string) => void }) {
  const { state: sidebarState, toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()
  const router = useRouter()
  const [loadingItem, setLoadingItem] = useState<string | null>(null)
  const [loadingLeague, setLoadingLeague] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showShareTicket, setShowShareTicket] = useState(false)
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
  const [expandedSports, setExpandedSports] = useState<string[]>(['Pool'])
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
  
  // Pool breadcrumb state
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedSoccerLeague, setSelectedSoccerLeague] = useState<string | null>(null)

  // Pool countries and leagues mapping
  const soccerCountries = [
    { name: 'World', code: 'US', leagues: ['WPA', 'Mosconi Cup', 'US Open', 'World Pool Masters'] },
  ]

  // Pool leagues carousel state
  const [soccerLeaguesCarouselApi, setSoccerLeaguesCarouselApi] = useState<CarouselApi>()
  const [soccerLeaguesCanScrollPrev, setSoccerLeaguesCanScrollPrev] = useState(false)
  const [soccerLeaguesCanScrollNext, setSoccerLeaguesCanScrollNext] = useState(false)

  // Top pool leagues for carousel
  const topSoccerLeagues = [
    { id: 1, name: 'WPA', country: 'World', icon: '/banners/sports_league/NFL.svg' },
    { id: 2, name: 'Mosconi Cup', country: 'World', icon: '/banners/sports_league/NFL.svg' },
    { id: 3, name: 'US Open', country: 'USA', icon: '/banners/sports_league/NFL.svg' },
    { id: 4, name: 'World Pool Masters', country: 'World', icon: '/banners/sports_league/NFL.svg' },
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
    { icon: '/sports_icons/my-feed.svg', label: 'My Feed', href: '/sports/my-feed' },
    { icon: IconBolt, label: 'Live Betting' },
    { icon: '/sports_icons/World-Cup-2022.svg', label: 'World Cup Hub', active: false },
    { icon: IconRocket, label: 'Odds Boosters' },
    { icon: '/sports_icons/Same Game Parlays.svg', label: 'Same Game Parlays' },
    { icon: '/sports_icons/Mega Parlays.svg', label: 'Mega Parlays' },
  ]
  
  const sportsCategories: Array<{ icon: any; label: string; href?: string; active?: boolean; expandable?: boolean; subItems?: Array<{ icon?: any; label: string; badge?: any; subItems?: Array<{ icon?: any; label: string; badge?: any }> }> }> = [
    { icon: '/sports_icons/baseball.svg', label: 'Baseball', href: '/sports/baseball' },
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
    { id: 1, name: 'WPA World Championship', country: 'World', icon: IconTrophy },
    { id: 2, name: 'Mosconi Cup', country: 'World', icon: IconTrophy },
    { id: 3, name: 'US Open Pool', country: 'USA', icon: IconTrophy },
    { id: 4, name: 'World Pool Masters', country: 'World', icon: IconTrophy },
  ]
  
  // Sample event data with betting markets - Mixed soccer leagues
  const liveEvents = [
    { 
      id: 1, 
      league: 'Mosconi Cup', 
      country: 'World',
      leagueIcon: '/sports_icons/pool.svg',
      startTime: 'Rack 7', 
      elapsedSeconds: 2400,
      isLive: true,
      team1: 'Team USA', 
      team2: 'Team Europe', 
      score: { team1: 4, team2: 3 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'USA', odds: '-150' }, { label: 'EUR', odds: '+130' }] },
        { title: 'Spread', options: [{ label: 'USA -3.5', odds: '-110' }, { label: 'EUR +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 45.5', odds: '-110' }, { label: 'U 45.5', odds: '-110' }] },
      ]
    },
    { 
      id: 2, 
      league: 'WPA World Championship', 
      country: 'World',
      leagueIcon: '/sports_icons/pool.svg',
      startTime: 'Rack 5', 
      elapsedSeconds: 1800,
      isLive: true,
      team1: 'Shane Van Boening', 
      team2: 'Francisco Sanchez Ruiz', 
      score: { team1: 3, team2: 2 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'SVB', odds: '-150' }, { label: 'FSR', odds: '+130' }] },
        { title: 'Spread', options: [{ label: 'SVB -3.5', odds: '-110' }, { label: 'FSR +3.5', odds: '-110' }] },
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
      id: 3, 
      league: 'WPA World Championship', 
      country: 'World',
      leagueIcon: '/sports_icons/pool.svg',
      time: 'Today 15:00', 
      team1: 'Jayson Shaw', 
      team2: 'Joshua Filler', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'SHA', odds: '-180' }, { label: 'FIL', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'SHA -4.5', odds: '-110' }, { label: 'FIL +4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 48.5', odds: '-105' }, { label: 'U 48.5', odds: '-115' }] },
      ]
    },
    { 
      id: 4, 
      league: 'US Open Pool', 
      country: 'USA',
      leagueIcon: '/sports_icons/pool.svg',
      time: 'Tomorrow 12:00', 
      team1: 'Fedor Gorst', 
      team2: 'Ko Pin Yi', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'GOR', odds: '-180' }, { label: 'KPY', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'GOR -4.5', odds: '-110' }, { label: 'KPY +4.5', odds: '-110' }] },
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

  // Betslip Views - Clean, simple design
  const BetslipDefaultView = () => {
    const currencySymbol = '$'
    const [isScrolled, setIsScrolled] = useState(false)
    const [nudgeKey, setNudgeKey] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const previousBetsLengthRef = useRef(bets.length)
    // Local state for input values to prevent losing focus
    const [localStakes, setLocalStakes] = useState<Record<string, string>>({})
    const [localParlayStake, setLocalParlayStake] = useState<string>('')
    const inputRefs = useRef<Record<string, HTMLInputElement>>({})
    const focusedInputRef = useRef<string | null>(null)
    const scrollLockRafRef = useRef<number | null>(null)
    const savedScrollPositionRef = useRef<{ x: number; y: number } | null>(null)
    
    // Restore focus if input was focused before re-render
    useEffect(() => {
      if (focusedInputRef.current) {
        const input = inputRefs.current[focusedInputRef.current]
        if (input && document.activeElement !== input) {
          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            input.focus()
            // Restore cursor position if possible
            const length = input.value.length
            input.setSelectionRange(length, length)
          }, 0)
        }
      }
    }, [localStakes])
    
    useEffect(() => {
      const container = scrollContainerRef.current
      if (!container) return
      
      const handleScroll = () => {
        setIsScrolled(container.scrollTop > 0)
      }
      
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }, [])

    // Ensure scroll starts at top when bets change or drawer opens
    useEffect(() => {
      if (bets.length > 0 && betslipOpen && !betslipMinimized) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          const container = scrollContainerRef.current
          if (container) {
            // Reset scroll to top to ensure first bet is visible
            container.scrollTop = 0
          }
        })
      }
    }, [bets.length, betslipOpen, betslipMinimized])

    // Track bets length changes separately
    useEffect(() => {
      const prevLength = previousBetsLengthRef.current
      const newLength = bets.length
      
      // Only trigger if length actually increased
      if (newLength > prevLength) {
        console.log('🎯 Bets increased!', prevLength, '->', newLength, 'minimized:', betslipMinimized, 'mobile:', isMobile)
        
        // Trigger animation if minimized
        if (betslipMinimized && !isMobile) {
          console.log('✅✅✅ TRIGGERING NUDGE ANIMATION!')
          setNudgeKey(prev => {
            const newKey = prev + 1
            console.log('🎬 Incrementing nudge key to:', newKey)
            return newKey
          })
        }
      }
      
      // Update ref for next comparison
      previousBetsLengthRef.current = newLength
    }, [bets.length, betslipMinimized, isMobile])

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
              <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded">
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
            className="text-[10px] font-semibold uppercase tracking-wide text-black/70 hover:text-black flex items-center gap-1"
          >
            <IconChevronUp className="w-3 h-3" />
            SHOW
          </button>
        </motion.div>
      )
    }
    // Expanded state
    return (
      <div className="relative flex flex-col w-full" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative', 
          height: '100%',
          maxHeight: '100%',
          minHeight: 0,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Header - Always visible at top - Glass effect when scrolled */}
        <div className={cn("px-2 py-1.5 flex items-center justify-between border-b border-black/5 transition-all", isScrolled && "bg-white/95 backdrop-blur-sm")} style={{ flexShrink: 0, flexGrow: 0, zIndex: 15, backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white' }}>
                <div className="flex items-center gap-2">
                  {bets.length > 0 && (
              <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded">
                <span className="text-xs font-semibold text-white leading-none">{bets.length}</span>
                    </div>
                  )}
            <h2 className="text-sm font-medium text-black/90">Betslip</h2>
                </div>
                {bets.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                if (isMobile) {
                  setBetslipOpen(false)
                  // Mark as manually closed so it won't auto-open again
                  setBetslipManuallyClosed(true)
                } else {
                  setBetslipMinimized(true)
                }
              }}
              className="text-[10px] font-semibold uppercase tracking-wide text-black/70 hover:text-black flex items-center gap-1"
            >
              {isMobile ? (
                <>
                  <IconX className="w-3 h-3" />
                  CLOSE
                </>
              ) : (
                <>
                  <IconChevronDown className="w-3 h-3" />
                  MINIMIZE
                </>
              )}
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
            className="overscroll-contain" 
            style={{ 
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto', 
              overflowX: 'hidden', 
              WebkitOverflowScrolling: 'touch', 
              position: 'relative', 
              zIndex: 1,
              paddingBottom: '70px' // Space for the fixed button
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
                      className="text-[10px] font-medium text-black/50 hover:text-black/70 uppercase tracking-wide"
                    >
                      Remove All
                  </button>
              </div>
                  {/* New bets appear at top (reversed array order) */}
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
                  <div
                    key={bet.id}
                    className="flex items-start gap-2 py-2 px-2 -mx-2 border-b border-black/5 last:border-b-0 bg-[#f5f5f5] rounded"
                  >
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
                      <div className="text-xs font-medium text-black mb-0.5 truncate leading-tight">{bet.selection}</div>
                      <div className="text-[10px] text-black/50 mb-0.5 leading-tight">{bet.marketTitle}</div>
                      {event && (
                        <div className="text-[10px] text-black/40 truncate leading-tight">{event.team1} v {event.team2}</div>
                      )}
                    </div>

                      {/* Odds - Smaller, right-aligned */}
                    <div className="flex-shrink-0 text-xs font-medium text-black mr-1.5 w-10 text-right">
                          {bet.odds}
                        </div>

                    {/* Stake Input - Smaller, tighter */}
                    <div className="flex-shrink-0 w-[110px] min-w-[110px]">
                      <div className="border border-black/5 rounded h-[36px] flex items-center justify-end px-1.5 relative bg-white">
                          <span className="absolute left-1.5 text-xs text-black/50 z-10">$</span>
                          <input
                            ref={(el) => {
                              if (el) inputRefs.current[bet.id] = el
                            }}
                            type="text"
                            inputMode="decimal"
                            value={localStakes[bet.id] !== undefined ? localStakes[bet.id] : (bet.stake > 0 ? bet.stake.toString() : '')}
                            onChange={(e) => {
                              // Prevent any scroll during typing
                              if (savedScrollPositionRef.current) {
                                window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                              }
                              
                              const val = e.target.value.replace(/[^0-9.]/g, '')
                              // Allow decimals: allow empty, single dot, or valid decimal number
                              if (val === '' || val === '.' || /^\d*\.?\d*$/.test(val)) {
                                // Only update local state - don't update bet.stake to prevent re-renders
                                // "To Win" will update in real-time because it uses localStakes[bet.id]
                                setLocalStakes(prev => ({ ...prev, [bet.id]: val }))
                                
                                // Re-lock scroll after state update
                                requestAnimationFrame(() => {
                                  if (savedScrollPositionRef.current) {
                                    window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                                  }
                                })
                              }
                            }}
                            onFocus={(e) => {
                              // Track which input is focused
                              focusedInputRef.current = bet.id
                              // Initialize local state if not set - start empty
                              if (localStakes[bet.id] === undefined) {
                                setLocalStakes(prev => ({ ...prev, [bet.id]: bet.stake === 0 ? '' : bet.stake.toString() }))
                              }
                              // Select all text for easy replacement
                              e.target.select()
                              
                              // Store current window scroll position in ref so it persists through re-renders
                              savedScrollPositionRef.current = {
                                x: window.scrollX,
                                y: window.scrollY
                              }
                              const input = e.target as HTMLInputElement
                              
                              // Prevent page scrolling by locking scroll position
                              const lockScroll = () => {
                                if (focusedInputRef.current === bet.id && savedScrollPositionRef.current) {
                                  if (window.scrollY !== savedScrollPositionRef.current.y || window.scrollX !== savedScrollPositionRef.current.x) {
                                    window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                                  }
                                }
                              }
                              
                              // Lock scroll position - use requestAnimationFrame for better performance
                              // Clear any existing scroll lock
                              if (scrollLockRafRef.current !== null) {
                                cancelAnimationFrame(scrollLockRafRef.current)
                              }
                              
                              const lockScrollLoop = () => {
                                if (focusedInputRef.current === bet.id) {
                                  lockScroll()
                                  scrollLockRafRef.current = requestAnimationFrame(lockScrollLoop)
                                } else {
                                  scrollLockRafRef.current = null
                                }
                              }
                              scrollLockRafRef.current = requestAnimationFrame(lockScrollLoop)
                              
                              // Only scroll within betslip container if needed
                              const scrollContainer = scrollContainerRef.current
                              if (scrollContainer) {
                                requestAnimationFrame(() => {
                                  const inputRect = input.getBoundingClientRect()
                                  const containerRect = scrollContainer.getBoundingClientRect()
                                  
                                  if (inputRect.top < containerRect.top || inputRect.bottom > containerRect.bottom) {
                                    const inputOffsetTop = input.offsetTop - scrollContainer.offsetTop
                                    scrollContainer.scrollTo({
                                      top: inputOffsetTop - 10,
                                      behavior: 'smooth'
                                    })
                                  }
                                })
                              }
                            }}
                            onBlur={(e) => {
                              // Clear focused input ref
                              if (focusedInputRef.current === bet.id) {
                                focusedInputRef.current = null
                              }
                              
                              // Stop scroll lock
                              if (scrollLockRafRef.current !== null) {
                                cancelAnimationFrame(scrollLockRafRef.current)
                                scrollLockRafRef.current = null
                              }
                              
                              // Restore scroll position one final time
                              if (savedScrollPositionRef.current) {
                                window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                                savedScrollPositionRef.current = null
                              }
                              
                              const val = e.target.value
                              const num = val === '' || val === '.' ? 0 : parseFloat(val)
                              const finalVal = isNaN(num) || num < 0 ? 0 : num
                              // Update the bet stake
                              updateBetStake(bet.id, finalVal)
                              // Clear local state so it will show the actual saved value
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
                            className="border-0 bg-transparent text-xs h-full p-0 pl-4 pr-6 text-right focus-visible:outline-none focus-visible:ring-0 text-black w-full overflow-visible placeholder:text-black/40"
                            placeholder="Enter Risk"
                            style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', minWidth: 0 }}
                          />
                        <div className="absolute right-0.5 top-0.5 bottom-0.5 flex flex-col gap-0.5 z-10 pointer-events-none">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              updateBetStake(bet.id, (bet.stake || 0) + 1)
                            }}
                            className="w-2.5 h-2.5 flex items-center justify-center hover:bg-black/5 rounded pointer-events-auto"
                          >
                            <IconChevronUp className="w-2 h-2 text-black/40" strokeWidth={3} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                              e.stopPropagation()
                              updateBetStake(bet.id, Math.max(0, (bet.stake || 0) - 1))
                            }}
                            className="w-2.5 h-2.5 flex items-center justify-center hover:bg-black/5 rounded pointer-events-auto"
                          >
                            <IconChevronDown className="w-2 h-2 text-black/40" strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                      <div className="text-[9px] text-black/50 text-right mt-0.5 leading-tight">
                        To Win {currencySymbol}{toWin.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )
              })}
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
                  <div className="flex-shrink-0 w-[110px] min-w-[110px]">
                    <div className="border border-black/15 rounded h-[36px] flex items-center justify-end px-1.5 relative bg-white">
                      <span className="absolute left-1.5 text-xs text-black/50 z-10">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={localParlayStake !== '' ? localParlayStake : (parlayStake > 0 ? parlayStake.toString() : '')}
                        onChange={(e) => {
                          // Prevent any scroll during typing
                          if (savedScrollPositionRef.current) {
                            window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                          }
                          
                          const val = e.target.value.replace(/[^0-9.]/g, '')
                          // Allow decimals: allow empty, single dot, or valid decimal number
                          if (val === '' || val === '.' || /^\d*\.?\d*$/.test(val)) {
                            // Only update local state - don't update parlayStake to prevent re-renders
                            // "To Win" will update in real-time because it uses localParlayStake
                            setLocalParlayStake(val)
                            
                            // Re-lock scroll after state update
                            requestAnimationFrame(() => {
                              if (savedScrollPositionRef.current) {
                                window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                              }
                            })
                          }
                        }}
                        onFocus={(e) => {
                          // Track that parlay input is focused
                          focusedInputRef.current = 'parlay'
                          // Initialize local state if not set - start empty
                          if (localParlayStake === '') {
                            setLocalParlayStake('')
                          }
                          // Select all text for easy replacement
                          e.target.select()
                          
                          // Store current window scroll position in ref so it persists through re-renders
                          savedScrollPositionRef.current = {
                            x: window.scrollX,
                            y: window.scrollY
                          }
                          const input = e.target as HTMLInputElement
                          
                          // Prevent page scrolling by locking scroll position
                          const lockScroll = () => {
                            if (focusedInputRef.current === 'parlay' && savedScrollPositionRef.current) {
                              if (window.scrollY !== savedScrollPositionRef.current.y || window.scrollX !== savedScrollPositionRef.current.x) {
                                window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                              }
                            }
                          }
                          
                          // Lock scroll position - use requestAnimationFrame for better performance
                          // Clear any existing scroll lock
                          if (scrollLockRafRef.current !== null) {
                            cancelAnimationFrame(scrollLockRafRef.current)
                          }
                          
                          const lockScrollLoop = () => {
                            if (focusedInputRef.current === 'parlay') {
                              lockScroll()
                              scrollLockRafRef.current = requestAnimationFrame(lockScrollLoop)
                            } else {
                              scrollLockRafRef.current = null
                            }
                          }
                          scrollLockRafRef.current = requestAnimationFrame(lockScrollLoop)
                          
                          // Only scroll within betslip container if needed
                          const scrollContainer = scrollContainerRef.current
                          if (scrollContainer) {
                            requestAnimationFrame(() => {
                              const inputRect = input.getBoundingClientRect()
                              const containerRect = scrollContainer.getBoundingClientRect()
                              
                              if (inputRect.top < containerRect.top || inputRect.bottom > containerRect.bottom) {
                                const inputOffsetTop = input.offsetTop - scrollContainer.offsetTop
                                scrollContainer.scrollTo({
                                  top: inputOffsetTop - 10,
                                  behavior: 'smooth'
                                })
                              }
                            })
                          }
                        }}
                        onBlur={(e) => {
                          // Clear focused input ref
                          if (focusedInputRef.current === 'parlay') {
                            focusedInputRef.current = null
                          }
                          
                          // Stop scroll lock
                          if (scrollLockRafRef.current !== null) {
                            cancelAnimationFrame(scrollLockRafRef.current)
                            scrollLockRafRef.current = null
                          }
                          
                          // Restore scroll position one final time
                          if (savedScrollPositionRef.current) {
                            window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                            savedScrollPositionRef.current = null
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
                        className="border-0 bg-transparent text-xs h-full p-0 pl-4 pr-6 text-right focus-visible:outline-none focus-visible:ring-0 text-black w-full overflow-visible placeholder:text-black/40"
                        placeholder="Enter Risk"
                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', minWidth: 0 }}
                      />
                      <div className="absolute right-0.5 top-0.5 bottom-0.5 flex flex-col gap-0.5 z-10 pointer-events-none">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            setParlayStake((prev) => prev + 1)
                              }}
                          className="w-2.5 h-2.5 flex items-center justify-center hover:bg-black/5 rounded pointer-events-auto"
                            >
                          <IconChevronUp className="w-2 h-2 text-black/40" strokeWidth={3} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            setParlayStake((prev) => Math.max(0, prev - 1))
                              }}
                          className="w-2.5 h-2.5 flex items-center justify-center hover:bg-black/5 rounded pointer-events-auto"
                            >
                          <IconChevronDown className="w-2 h-2 text-black/40" strokeWidth={3} />
                            </button>
                          </div>
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
                
        {/* Summary and Place Bet - Always visible at bottom, fixed position */}
                {bets.length > 0 && (
          <div className="px-2 pt-2 pb-2 border-t border-black/5 bg-white backdrop-blur-sm" style={{ height: '70px', flexShrink: 0, position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', zIndex: 30, backgroundColor: 'white' }}>
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
                            console.log('Navigate to My Bets')
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
                  "w-full py-2 rounded transition-colors flex flex-col items-center justify-center",
                        totalStake > 0 
                    ? "bg-[#8BC34A] text-white hover:bg-[#7CB342]" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
      <div className="flex flex-col w-full h-full bg-white" style={{ minHeight: '400px' }}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {/* Success Icon */}
          <div className="mb-4">
            <div className="w-16 h-16 rounded-full bg-[#8BC34A] flex items-center justify-center">
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
                setBetslipOpen(false)
                setMyBetsAlertCount(0)
                setBetslipManuallyClosed(false)
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
    default: BetslipDefaultView,
    confirmation: BetslipConfirmationView,
  }

  return (
    <div className="flex w-full min-h-screen bg-[#1a1a1a]">
      {/* Sports Sidebar using shadcn component */}
      <Sidebar 
        collapsible="icon"
        variant="sidebar"
        className="!bg-[#2d2d2d] border-r border-white/10 text-white [&>div]:!bg-[#2d2d2d]"
      >
        <SidebarContent className="overflow-y-auto">
          <TooltipProvider>
            {/* Settings Icon - Show when collapsed */}
            {sidebarState === 'collapsed' && (
              <div className="p-2 border-b border-white/10">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('Settings clicked')
                      }}
                      className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 cursor-pointer w-full"
                    >
                      <IconSettings className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            
          {/* Time + Odds Format - Hide when collapsed */}
          {sidebarState !== 'collapsed' && (
          <div className="p-2 border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <select className="flex-1 bg-white/5 border border-white/10 rounded-small px-2 py-1.5 text-xs text-white/70">
                <option>Starting in</option>
              </select>
              <select className="flex-1 bg-white/5 border border-white/10 rounded-small px-2 py-1.5 text-xs text-white/70">
                <option>American</option>
              </select>
            </div>
          </div>
          )}
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
                              isActive={item.active}
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
                              style={item.active ? { backgroundColor: brandPrimary } : undefined}
                            >
                              <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", item.active ? "bg-white/20" : "bg-white/10")}>
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
                                  style={isActive ? { backgroundColor: brandPrimary } : undefined}
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
                                style={isActive ? { backgroundColor: brandPrimary } : undefined}
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

          </TooltipProvider>
        </SidebarContent>
      </Sidebar>
      
      {/* Main Content */}
      <SidebarInset className="bg-[#1a1a1a] text-white overflow-x-hidden" style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}>
        <div className={cn("pt-0 pb-4 overflow-x-hidden", isMobile ? "px-1" : "px-5")}>
          {/* Breadcrumbs - Pool > Select Country > Select League */}
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
            {/* Pool */}
            <button 
              onClick={() => {
                setSelectedCountry(null)
                setSelectedSoccerLeague(null)
              }}
              className="text-sm text-white font-medium hover:text-white/80 cursor-pointer transition-colors"
            >
              Pool
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
                        router.push(`/sports/pool/${leagueSlug}`)
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
                            router.push(`/sports/pool/${leagueSlug}`)
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
                    router.push('/sports/pool/wpa')
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
                  {/* Dynamic Top Events - Pool */}
                  {([
                    { id: 4, team1: 'Shane Van Boening', team2: 'Francisco Sanchez Ruiz', score: '7 - 5', team1Code: 'SVB', team2Code: 'FSR', team1Percent: 62, team2Percent: 38, time: 'R13', league: 'WPA', leagueIcon: '/sports_icons/pool.svg', country: 'World Championship' },
                    { id: 5, team1: 'Joshua Filler', team2: 'Eklent Kaci', score: '8 - 6', team1Code: 'FIL', team2Code: 'KAC', team1Percent: 58, team2Percent: 42, time: 'R15', league: 'WPA', leagueIcon: '/sports_icons/pool.svg', country: 'World Championship' },
                    { id: 6, team1: 'Fedor Gorst', team2: 'Jayson Shaw', score: '5 - 5', team1Code: 'GOR', team2Code: 'SHA', team1Percent: 52, team2Percent: 48, time: 'R11', league: 'Mosconi Cup', leagueIcon: '/sports_icons/pool.svg', country: 'International' },
                    { id: 7, team1: 'Ko Pin Yi', team2: 'Carlo Biado', score: '9 - 7', team1Code: 'KO', team2Code: 'BIA', team1Percent: 55, team2Percent: 45, time: 'R17', league: 'WPA', leagueIcon: '/sports_icons/pool.svg', country: 'World Championship' },
                    { id: 8, team1: 'USA', team2: 'Europe', score: '6 - 4', team1Code: 'USA', team2Code: 'EUR', team1Percent: 60, team2Percent: 40, time: 'R11', league: 'Mosconi Cup', leagueIcon: '/sports_icons/pool.svg', country: 'International' },
                    { id: 9, team1: 'Albin Ouschan', team2: 'David Alcaide', score: '4 - 6', team1Code: 'OUS', team2Code: 'ALC', team1Percent: 42, team2Percent: 58, time: 'R11', league: 'World Pool Masters', leagueIcon: '/sports_icons/pool.svg', country: 'International' },
                    { id: 10, team1: 'Dennis Orcollo', team2: 'Johann Chua', score: '7 - 3', team1Code: 'ORC', team2Code: 'CHU', team1Percent: 72, team2Percent: 28, time: 'R11', league: 'US Open', leagueIcon: '/sports_icons/pool.svg', country: 'USA' },
                    { id: 11, team1: 'Francisco Bustamante', team2: 'Alex Pagulayan', score: '6 - 6', team1Code: 'BUS', team2Code: 'PAG', team1Percent: 50, team2Percent: 50, time: 'R13', league: 'WPA', leagueIcon: '/sports_icons/pool.svg', country: 'World Championship' },
                    { id: 12, team1: 'Chris Melling', team2: 'Skyler Woodward', score: '8 - 5', team1Code: 'MEL', team2Code: 'WOO', team1Percent: 65, team2Percent: 35, time: 'R14', league: 'US Open', leagueIcon: '/sports_icons/pool.svg', country: 'USA' },
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
                              const nbaBadgeMap: { [key: string]: string } = {
                                'Los Angeles Lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
                                'Boston Celtics': 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
                                'Golden State Warriors': 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
                                'Phoenix Suns': 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
                                'Milwaukee Bucks': 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
                                'Philadelphia 76ers': 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
                                'Denver Nuggets': 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
                                'Dallas Mavericks': 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
                                'Miami Heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
                                'New York Knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
                                'Memphis Grizzlies': 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png',
                                'Cleveland Cavaliers': 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
                                'Sacramento Kings': 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png',
                                'Minnesota Timberwolves': 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
                                'Brooklyn Nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
                                'Chicago Bulls': 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
                                'Oklahoma City Thunder': 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
                                'Houston Rockets': 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
                                'Atlanta Hawks': 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
                                'Toronto Raptors': 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
                                'Indiana Pacers': 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png',
                                'San Antonio Spurs': 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
                                'Portland Trail Blazers': 'https://a.espncdn.com/i/teamlogos/nba/500/por.png',
                                'New Orleans Pelicans': 'https://a.espncdn.com/i/teamlogos/nba/500/no.png',
                                'Charlotte Hornets': 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
                                'Orlando Magic': 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
                                'Detroit Pistons': 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
                                'Utah Jazz': 'https://a.espncdn.com/i/teamlogos/nba/500/utah.png',
                                'Washington Wizards': 'https://a.espncdn.com/i/teamlogos/nba/500/wsh.png',
                                'Los Angeles Clippers': 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png',
                              }
                              const nflBadgeMap: { [key: string]: string } = {
                                'Kansas City Chiefs': 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
                                'Buffalo Bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
                                'Dallas Cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
                                'Philadelphia Eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
                                'San Francisco 49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
                                'Seattle Seahawks': 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
                                'Miami Dolphins': 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
                                'New York Jets': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
                                'Baltimore Ravens': 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
                                'Cincinnati Bengals': 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
                                'Los Angeles Rams': 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
                                'Arizona Cardinals': 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
                                'Green Bay Packers': 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
                                'Chicago Bears': 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
                                'Pittsburgh Steelers': 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',
                                'Cleveland Browns': 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
                                'Denver Broncos': 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
                                'Las Vegas Raiders': 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
                              }
                              const soccerBadgeMap: { [key: string]: string } = {
                                'Arsenal': '/team/Arsenal FC.png', 'Chelsea': '/team/Chelsea FC.png',
                                'Real Madrid': '/team/Spain - LaLiga/Real Madrid.png', 'Barcelona': '/team/Spain - LaLiga/FC Barcelona.png',
                                'Juventus': '/team/Italy - Serie A/Juventus FC.png', 'AC Milan': '/team/Italy - Serie A/AC Milan.png',
                                'Tottenham': '/team/Tottenham Hotspur.png', 'Newcastle': '/team/Newcastle United.png',
                                'Inter Milan': '/team/Italy - Serie A/Inter Milan.png', 'Napoli': '/team/Italy - Serie A/SSC Napoli.png',
                                'Atletico Madrid': '/team/Spain - LaLiga/Atlético de Madrid.png', 'Sevilla': '/team/Spain - LaLiga/Sevilla FC.png',
                                'AS Roma': '/team/Italy - Serie A/AS Roma.png', 'Lazio': '/team/Italy - Serie A/SS Lazio.png',
                                'Manchester United': '/team/Manchester United.png', 'Aston Villa': '/team/Aston Villa.png',
                                'Real Sociedad': '/team/Spain - LaLiga/Real Sociedad.png', 'Villarreal': '/team/Spain - LaLiga/Villarreal CF.png',
                              }
                              const rugbyFlagMap: { [key: string]: string } = {
                                'New Zealand': 'https://flagcdn.com/w80/nz.png', 'South Africa': 'https://flagcdn.com/w80/za.png',
                                'Australia': 'https://flagcdn.com/w80/au.png', 'England': 'https://flagcdn.com/w80/gb-eng.png',
                                'France': 'https://flagcdn.com/w80/fr.png', 'Ireland': 'https://flagcdn.com/w80/ie.png',
                                'Japan': 'https://flagcdn.com/w80/jp.png', 'Argentina': 'https://flagcdn.com/w80/ar.png',
                                'Wales': 'https://flagcdn.com/w80/gb-wls.png', 'Scotland': 'https://flagcdn.com/w80/gb-sct.png',
                                'Italy': 'https://flagcdn.com/w80/it.png',
                              }
                              const logo = nbaBadgeMap[event.team1] || nflBadgeMap[event.team1] || soccerBadgeMap[event.team1] || ('team1Logo' in event ? (event as any).team1Logo : null) || rugbyFlagMap[event.team1]
                              if (logo) return <img src={logo} alt={event.team1} width={20} height={20} className="object-contain flex-shrink-0 rounded-full" decoding="sync" />
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
                              const nbaBadgeMap: { [key: string]: string } = {
                                'Los Angeles Lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
                                'Boston Celtics': 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
                                'Golden State Warriors': 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
                                'Phoenix Suns': 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
                                'Milwaukee Bucks': 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
                                'Philadelphia 76ers': 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
                                'Denver Nuggets': 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
                                'Dallas Mavericks': 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
                                'Miami Heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
                                'New York Knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
                                'Memphis Grizzlies': 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png',
                                'Cleveland Cavaliers': 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
                                'Sacramento Kings': 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png',
                                'Minnesota Timberwolves': 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
                                'Brooklyn Nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
                                'Chicago Bulls': 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
                                'Oklahoma City Thunder': 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
                                'Houston Rockets': 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
                                'Atlanta Hawks': 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
                                'Toronto Raptors': 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
                                'Indiana Pacers': 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png',
                                'San Antonio Spurs': 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
                                'Portland Trail Blazers': 'https://a.espncdn.com/i/teamlogos/nba/500/por.png',
                                'New Orleans Pelicans': 'https://a.espncdn.com/i/teamlogos/nba/500/no.png',
                                'Charlotte Hornets': 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
                                'Orlando Magic': 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
                                'Detroit Pistons': 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
                                'Utah Jazz': 'https://a.espncdn.com/i/teamlogos/nba/500/utah.png',
                                'Washington Wizards': 'https://a.espncdn.com/i/teamlogos/nba/500/wsh.png',
                                'Los Angeles Clippers': 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png',
                              }
                              const nflBadgeMap: { [key: string]: string } = {
                                'Kansas City Chiefs': 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
                                'Buffalo Bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
                                'Dallas Cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
                                'Philadelphia Eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
                                'San Francisco 49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
                                'Seattle Seahawks': 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
                                'Miami Dolphins': 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
                                'New York Jets': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
                                'Baltimore Ravens': 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
                                'Cincinnati Bengals': 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
                                'Los Angeles Rams': 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
                                'Arizona Cardinals': 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
                                'Green Bay Packers': 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
                                'Chicago Bears': 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
                                'Pittsburgh Steelers': 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',
                                'Cleveland Browns': 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
                                'Denver Broncos': 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
                                'Las Vegas Raiders': 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
                              }
                              const soccerBadgeMap: { [key: string]: string } = {
                                'Arsenal': '/team/Arsenal FC.png', 'Chelsea': '/team/Chelsea FC.png',
                                'Real Madrid': '/team/Spain - LaLiga/Real Madrid.png', 'Barcelona': '/team/Spain - LaLiga/FC Barcelona.png',
                                'Juventus': '/team/Italy - Serie A/Juventus FC.png', 'AC Milan': '/team/Italy - Serie A/AC Milan.png',
                                'Tottenham': '/team/Tottenham Hotspur.png', 'Newcastle': '/team/Newcastle United.png',
                                'Inter Milan': '/team/Italy - Serie A/Inter Milan.png', 'Napoli': '/team/Italy - Serie A/SSC Napoli.png',
                                'Atletico Madrid': '/team/Spain - LaLiga/Atlético de Madrid.png', 'Sevilla': '/team/Spain - LaLiga/Sevilla FC.png',
                                'AS Roma': '/team/Italy - Serie A/AS Roma.png', 'Lazio': '/team/Italy - Serie A/SS Lazio.png',
                                'Manchester United': '/team/Manchester United.png', 'Aston Villa': '/team/Aston Villa.png',
                                'Real Sociedad': '/team/Spain - LaLiga/Real Sociedad.png', 'Villarreal': '/team/Spain - LaLiga/Villarreal CF.png',
                              }
                              const rugbyFlagMap: { [key: string]: string } = {
                                'New Zealand': 'https://flagcdn.com/w80/nz.png', 'South Africa': 'https://flagcdn.com/w80/za.png',
                                'Australia': 'https://flagcdn.com/w80/au.png', 'England': 'https://flagcdn.com/w80/gb-eng.png',
                                'France': 'https://flagcdn.com/w80/fr.png', 'Ireland': 'https://flagcdn.com/w80/ie.png',
                                'Japan': 'https://flagcdn.com/w80/jp.png', 'Argentina': 'https://flagcdn.com/w80/ar.png',
                                'Wales': 'https://flagcdn.com/w80/gb-wls.png', 'Scotland': 'https://flagcdn.com/w80/gb-sct.png',
                                'Italy': 'https://flagcdn.com/w80/it.png',
                              }
                              const logo = nbaBadgeMap[event.team2] || nflBadgeMap[event.team2] || soccerBadgeMap[event.team2] || ('team2Logo' in event ? (event as any).team2Logo : null) || rugbyFlagMap[event.team2]
                              if (logo) return <img src={logo} alt={event.team2} width={20} height={20} className="object-contain flex-shrink-0 rounded-full" decoding="sync" />
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
                                e.currentTarget.style.backgroundColor = brandPrimary
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
                                e.currentTarget.style.backgroundColor = brandPrimary
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
                                e.currentTarget.style.backgroundColor = brandPrimary
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
                  overscrollBehavior: 'contain',
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
                                            // Remove any existing bet for this market first
                                            setBets(prev => prev.filter(bet => 
                                              !(bet.eventId === event.id && bet.marketTitle === market.title)
                                            ))
                                            // Add the new bet
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
                          console.log('Watch clicked for event:', event.id)
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
                    router.push('/sports/pool/wpa')
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
                    
                    { id: 1, marketName: 'Van Boening Win 11-5 Or Better vs Shaw', isLive: true, liveTime: 'R8', wasOdds: '+350', boostedOdds: '+475', league: 'US Open Pool', leagueIcon: '/sports_icons/pool.svg', country: 'USA' },
                    { id: 2, marketName: 'Filler Break & Run In 3+ Racks vs Gorst', isLive: false, time: 'TODAY 3:00PM', wasOdds: '+400', boostedOdds: '+550', league: 'World Pool Masters', leagueIcon: '/sports_icons/pool.svg', country: 'International' },
                    { id: 3, marketName: 'USA Win Mosconi Cup 11-7 Or Better', isLive: false, time: 'FRI 7:00PM', wasOdds: '+300', boostedOdds: '+420', league: 'Mosconi Cup', leagueIcon: '/sports_icons/pool.svg', country: 'International' },
                    { id: 4, marketName: 'Ko Pin Yi Win From Hill-Hill vs Ouschan', isLive: true, liveTime: 'R6', wasOdds: '+500', boostedOdds: '+680', league: 'WPA World Championship', leagueIcon: '/sports_icons/pool.svg', country: 'International' },
                  ]).map((boost, index) => (
                    <CarouselItem key={boost.id} className={index === 0 ? "pl-0 pr-0 basis-auto flex-shrink-0" : "pl-2 md:pl-4 basis-auto flex-shrink-0"}>
                      <div className="w-[340px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                        {/* Header: League info and Time/Live Status */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <img 
                              src={"/sports_icons/pool.svg"} 
                              alt="Pool"
                              width={16}
                              height={16}
                              className="object-contain"
                              decoding="sync"
                            />
                            <span className="text-[10px] text-white">Pool | Global</span>
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
                                style={bets.some(b => b.eventId === boost.id + 90000) ? { backgroundColor: brandPrimary } : undefined}
                      onMouseEnter={(e) => {
                        if (!bets.some(b => b.eventId === boost.id + 90000)) e.currentTarget.style.backgroundColor = brandPrimary
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
                    { id: 1, match: 'SVB vs Filler', league: 'WPA', leagueIcon: '/sports_icons/pool.svg', country: 'World', time: 'TODAY 7:00PM', legs: ['SVB To Win', 'Over 12.5 Racks', 'SVB Break And Run'], combinedOdds: '+850' },
                    { id: 2, match: 'Ko vs Gorst', league: 'WPA', leagueIcon: '/sports_icons/pool.svg', country: 'World', time: 'TOMORROW 8:00PM', legs: ['Ko To Win', 'Under 15.5 Racks', 'Ko 3+ Breaks'], combinedOdds: '+700' },
                    { id: 3, match: 'Shaw vs Alcaide', league: 'Mosconi Cup', leagueIcon: '/sports_icons/pool.svg', country: 'World', time: 'SAT 6:00PM', legs: ['Shaw To Win', 'Over 10.5 Racks', 'Shaw 2+ Safety Wins'], combinedOdds: '+650' },
                    { id: 4, match: 'Ouschan vs Fisher', league: 'WPA', leagueIcon: '/sports_icons/pool.svg', country: 'World', time: 'FRI 9:00PM', legs: ['Ouschan To Win', 'In Final Rack', 'Over 14.5 Racks'], combinedOdds: '+1100' },
                    { id: 5, match: 'Woodward vs Kazakis', league: 'US Open', leagueIcon: '/sports_icons/pool.svg', country: 'USA', time: 'SUN 5:00PM', legs: ['Woodward To Win', 'Under 13.5 Racks', 'Woodward Break Run'], combinedOdds: '+900' }
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
                          <span className="text-[10px] text-white">{parlay.league} | {parlay.country}, Pool</span>
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
                          style={bets.some(b => b.eventId === parlay.id + 80000) ? { backgroundColor: brandPrimary } : undefined}
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
                                            // Remove any existing bet for this market first
                                            setBets(prev => prev.filter(bet => 
                                              !(bet.eventId === event.id && bet.marketTitle === market.title)
                                            ))
                                            // Add the new bet
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
        
        {/* Footer - responsive to sidebar state */}
        <footer className="bg-[#2d2d2d] border-t border-white/10 text-white mt-12 relative z-0">
          <div className="w-full px-6 py-6">
            {/* Quick Links Section - More compact */}
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

            {/* Trust & Security Section - More compact */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-base">A TRUSTED & SAFE EXPERIENCE</h3>
                <IconShield className="w-4 h-4" />
              </div>
              <p className="text-xs text-white/70 mb-4 max-w-2xl">
                At BetOnline, our company's guiding principle is to establish long-lasting, positive relationships with our customers and within the online gaming community for over 25 years.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {/* Crypto payment method logos */}
                {['Bitcoin', 'Ethereum', 'Litecoin', 'USDT', 'USDC', 'BitcoinCash', 'Dogecoin'].map((method) => (
                  <PaymentLogo key={method} method={method} />
                ))}
                {/* Traditional payment method logos */}
                {['VISA', 'Mastercard', 'AMEX', 'Discover'].map((method) => (
                  <PaymentLogo key={method} method={method} />
                ))}
                {/* Security badges */}
                <SecurityBadge name="Responsible Gaming" iconPath="/banners/partners/responsible gaming.webp" />
                <SecurityBadge name="SSL Secure" iconPath="/logos/payment/ssl-secure.svg" />
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 border-2 border-white">
                  <span className="text-[10px] font-bold text-white">18+</span>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10 mb-6" />

            {/* Partners & Social Media - More compact */}
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
                {/* Social media icons using Button components */}
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
                {typeof currentTime !== 'undefined' ? currentTime : ''}
              </div>
            </div>
          </div>
        </footer>
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
            // On mobile, mark as manually closed so it won't auto-open again
            // This happens whenever user closes betslip, regardless of bet count
            if (isMobile) {
              setBetslipManuallyClosed(true)
            }
          } else if (open) {
            setBetslipOpen(true)
            // When user manually opens, reset the flag
            if (isMobile) {
              setBetslipManuallyClosed(false)
            }
          }
        }}
      >
        <FamilyDrawerContent 
          className="bg-white rounded-t-2xl"
        >
          <FamilyDrawerAnimatedWrapper 
            key={`betslip-${bets.length}-${betslipMinimized}`}
            className="px-0 py-0"
          >
            <FamilyDrawerAnimatedContent>
              <BetslipViewSwitcher />
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

    const tabs = ['VIP Hub', 'Cash Boost', 'Bet & Get', 'Reloads', 'Cash Drop']
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
            {['VIP Hub', 'Cash Boost', 'Bet & Get', 'Reloads', 'Cash Drop'].map((tab, index) => (
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
      
      <div className={cn("px-4 pt-4 overflow-y-auto flex-1 min-h-0", isMobile ? "pb-6" : "pb-2")} style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto', flex: '1 1 auto', minHeight: 0, paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 24px)' : undefined }}>
        {vipActiveTab === 'VIP Hub' && (
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <CardTitle className="text-sm text-white/70 mb-2">Gold To Platinum I</CardTitle>
                <VIPProgressBar value={45} />
                <div className="text-xs text-white/50 mt-2">Updated 24/25/2024, 8:00 PM ET</div>
              </CardContent>
            </Card>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Benefits</h3>
              <Accordion type="single" defaultValue="Gold" collapsible className="w-full">
                <AccordionItem value="Bronze" className={cn("border-white/10", "opacity-50")}>
                  <AccordionTrigger value="Bronze" className="text-white/50 hover:text-white/70">
                    <div className="flex items-center gap-3">
                      <IconCrown className="w-5 h-5 text-amber-600" />
                      <span className="line-through">Bronze</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent value="Bronze">
                    <div className="space-y-3 pt-2">
                      <div className="text-lg font-semibold text-white/50">$0</div>
                      <div className="text-sm text-white/50">Wager Amount</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Daily Cash Race</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="text-xs text-white/50 font-medium">Complete</div>
                        <Button variant="ghost" className="mt-2 text-white/70 hover:text-white hover:bg-white/5">
                          VIP Rewards
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="Silver" className={cn("border-white/10", "opacity-50")}>
                  <AccordionTrigger value="Silver" className="text-white/50 hover:text-white/70">
                    <div className="flex items-center gap-3">
                      <IconCrown className="w-5 h-5 text-gray-400" />
                      <span className="line-through">Silver</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent value="Silver">
                    <div className="space-y-3 pt-2">
                      <div className="text-lg font-semibold text-white/50">$10K</div>
                      <div className="text-sm text-white/50">Wager Amount</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Daily Cash Race</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Birthday Rewards</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="text-xs text-white/50 font-medium">Complete</div>
                        <Button variant="ghost" className="mt-2 text-white/70 hover:text-white hover:bg-white/5">
                          VIP Rewards
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="Gold" className="border-white/10 relative">
                  <motion.div
                    className="absolute inset-0 bg-white/5 pointer-events-none"
                    animate={{
                      opacity: [0, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <AccordionTrigger value="Gold" className="text-white hover:text-white relative z-10">
                    <div className="flex items-center gap-3">
                      <IconCrown className="w-5 h-5 text-yellow-400" />
                      <span>Gold</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent value="Gold">
                    <div className="space-y-3 pt-2">
                      <div className="text-lg font-semibold text-white">$50K</div>
                      <div className="text-sm text-white/70">Wager Amount</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Daily Cash Race</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Birthday Rewards</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Weekly Cash Boost</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Monthly Cash Boost</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Level Up Bonuses</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="Platinum" className="border-white/10">
                  <AccordionTrigger value="Platinum" className="text-white hover:text-white">
                    <div className="flex items-center gap-3">
                      <IconCrown className="w-5 h-5 text-cyan-400" />
                      <span>Platinum I - III</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent value="Platinum">
                    <div className="space-y-3 pt-2">
                      <div className="text-lg font-semibold text-white">$100K - 500K</div>
                      <div className="text-sm text-white/70">Wager Amount</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Daily Cash Race</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Birthday Rewards</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Weekly Cash Boost</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Monthly Cash Boost</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Level Up Bonuses</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="Diamond" className="border-white/10">
                  <AccordionTrigger value="Diamond" className="text-white hover:text-white">
                    <div className="flex items-center gap-3">
                      <IconCrown className="w-5 h-5 text-emerald-400" />
                      <span>Diamond I - III</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent value="Diamond">
                    <div className="space-y-3 pt-2">
                      <div className="text-lg font-semibold text-white">$1M - 5M</div>
                      <div className="text-sm text-white/70">Wager Amount</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>All Platinum I - III Benefits</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Monthly Cash Boost</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Level Up Bonuses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Prioritized Withdrawals</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Dedicated VIP Team</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="Elite" className="border-white/10">
                  <AccordionTrigger value="Elite" className="text-white hover:text-white">
                    <div className="flex items-center gap-3">
                      <IconCrown className="w-5 h-5 text-purple-400" />
                      <span>Elite I - III</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent value="Elite">
                    <div className="space-y-3 pt-2">
                      <div className="text-lg font-semibold text-white">$100M - 500M</div>
                      <div className="text-sm text-white/70">Wager Amount</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>All Diamond I - III Benefits</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Free Crypto Withdrawals</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Reduced Deposit Fees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Exclusive Refer-A-Friend</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Dedicated VIP Team</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="Black" className="border-white/10">
                  <AccordionTrigger value="Black" className="text-white hover:text-white">
                    <div className="flex items-center gap-3">
                      <IconCrown className="w-5 h-5 text-gray-800" />
                      <span>Black I - III</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent value="Black">
                    <div className="space-y-3 pt-2">
                      <div className="text-lg font-semibold text-white">$100M+</div>
                      <div className="text-sm text-white/70">Wager Amount</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>All Elite I - III Benefits</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Reduced Deposit Fees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Exclusive Refer-A-Friend</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Tailored Gifts & Rewards</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Dedicated VIP Team</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="Obsidian" className="border-white/10">
                  <AccordionTrigger value="Obsidian" className="text-white hover:text-white">
                    <div className="flex items-center gap-3">
                      <IconCrown className="w-5 h-5 text-purple-900" />
                      <span>Obsidian I - III</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent value="Obsidian">
                    <div className="space-y-3 pt-2">
                      <div className="text-lg font-semibold text-white">$1B+</div>
                      <div className="text-sm text-white/70">Wager Amount</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>All Black I - III Benefits</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Reduced Deposit Fees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Exclusive Refer-A-Friend</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Tailored Gifts & Rewards</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <IconCheck className="h-3 w-3" />
                          </div>
                          <span>Dedicated VIP Team</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
        
        {vipActiveTab === 'Cash Boost' && (
          <div className="space-y-3">
            {boostClaimMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <IconCheck className="w-5 h-5 text-green-400" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">
                    ${boostClaimMessage.amount.toFixed(2)} have been claimed and added to your balance
                  </div>
                </div>
              </motion.div>
            )}
            {claimedBoosts.has('weekly') && claimedBoosts.has('monthly') ? (
              <Card className="bg-white/3 border-white/5">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-6">
                      <IconCrown className="w-10 h-10 text-white/40" strokeWidth={1.5} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-white/70 text-sm leading-relaxed">
                        Keep on playing and check back for any cash<br />
                        boost rewards.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {!claimedBoosts.has('weekly') && (
                  <div className="bg-white/5 rounded-small p-4 border border-white/10 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <IconCoins className="w-5 h-5 text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white">$15.00</div>
                      <div className="text-sm text-white/70">Weekly Cash Boost</div>
                    </div>
                    <Button 
                      variant="ghost"
                      className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-4 py-2 h-8 border border-white/20"
                      onClick={() => {
                        setBoostProcessing('weekly')
                        setTimeout(() => {
                          setClaimedBoosts(prev => new Set([...prev, 'weekly']))
                          setBoostProcessing(null)
                          setBoostClaimMessage({ amount: 15 })
                          onBoostClaimed(15)
                          setTimeout(() => {
                            setBoostClaimMessage(null)
                          }, 3000)
                        }, 1500)
                      }}
                      disabled={boostProcessing !== null}
                    >
                      {boostProcessing === 'weekly' ? (
                        <div className="flex items-center gap-2">
                          <IconLoader2 className="w-3 h-3 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'CLAIM'
                      )}
                    </Button>
                  </div>
                )}
                {!claimedBoosts.has('monthly') && (
                  <div className="bg-white/5 rounded-small p-4 border border-white/10 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <IconCoins className="w-5 h-5 text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white">$20.00</div>
                      <div className="text-sm text-white/70">Monthly Cash Boost</div>
                    </div>
                    <Button 
                      variant="ghost"
                      className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-4 py-2 h-8 border border-white/20"
                      onClick={() => {
                        setBoostProcessing('monthly')
                        setTimeout(() => {
                          setClaimedBoosts(prev => new Set([...prev, 'monthly']))
                          setBoostProcessing(null)
                          setBoostClaimMessage({ amount: 20 })
                          onBoostClaimed(20)
                          setTimeout(() => {
                            setBoostClaimMessage(null)
                          }, 3000)
                        }, 1500)
                      }}
                      disabled={boostProcessing !== null}
                    >
                      {boostProcessing === 'monthly' ? (
                        <div className="flex items-center gap-2">
                          <IconLoader2 className="w-3 h-3 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'CLAIM'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {vipActiveTab === 'Bet & Get' && (
          <Card className="bg-white/3 border-white/5">
            <CardContent className={cn(isMobile ? "p-4" : "p-8")}>
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-6">
                  <IconGift className="w-10 h-10 text-white/40" strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white/70 text-sm leading-relaxed">
                    Bet & Get promotions will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {vipActiveTab === 'Reloads' && (
          <Card className="bg-white/3 border-white/5">
            <CardContent className={cn(isMobile ? "p-4" : "p-8")}>
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-6">
                  <IconCreditCard className="w-10 h-10 text-white/40" strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white/70 text-sm leading-relaxed">
                    Reload bonuses will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {vipActiveTab === 'Cash Drop' && (
          <Card className="bg-white/3 border-white/5">
            <CardContent className={cn(isMobile ? "p-4" : "p-8")}>
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-6">
                  <IconCurrencyDollar className="w-10 h-10 text-white/40" strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white/70 text-sm leading-relaxed">
                    Cash Drop rewards will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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
  
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false)
  const [vipDrawerOpen, setVipDrawerOpen] = useState(false)
  const [accountDrawerView, setAccountDrawerView] = useState<'account' | 'notifications'>('account')

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


  const [vipActiveTab, setVipActiveTab] = useState('VIP Hub')
  const [betslipOpen, setBetslipOpen] = useState(false)
  const [betslipMinimized, setBetslipMinimized] = useState(false)
  const [betslipManuallyClosed, setBetslipManuallyClosed] = useState(false)
  const [activeSport, setActiveSport] = useState<string>('Pool') // Track active sport type
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
  const [initialVipSidebarItem, setInitialVipSidebarItem] = useState<string | null>(null)
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
    // Balance will be updated and animated when drawer closes
    // This callback is just for tracking purposes
  }, [])

  const handleVipDrawerOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      // Drawer is closing, check if there are claimed boosts to process
      const claimedAmount = Array.from(claimedBoosts).reduce((total, boostId) => {
        if (boostId === 'weekly') return total + 15
        if (boostId === 'monthly') return total + 20
        return total
      }, 0)
      
      if (claimedAmount > 0) {
        // Wait a bit for drawer to close, then update and animate balance
        setTimeout(() => {
          // Update the actual balance
          const newBalance = balance + claimedAmount
          setBalance(newBalance)
          
          // Animate the balance roll-up
          const startBalance = displayBalance
          const endBalance = newBalance
          const duration = 1000
          const startTime = Date.now()
          
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOutCubic = 1 - Math.pow(1 - progress, 3)
            const currentBalance = startBalance + (endBalance - startBalance) * easeOutCubic
            setDisplayBalance(currentBalance)
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setDisplayBalance(endBalance)
            }
          }
          requestAnimationFrame(animate)
        }, 300)
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
  }, [claimedBoosts, balance, displayBalance, isMobile])

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
  const brandPrimary = (currentBrand?.primaryColor) || '#ee3536'
  const brandPrimaryHover = (currentBrand?.primaryHover) || '#dc2a2f'

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
    { icon: IconCrown, label: 'Loyalty Hub' },
    { icon: IconBuilding, label: 'Banking' },
    { icon: IconLifebuoy, label: 'Need Help' },
  ]

  const gameFilters = ['For You', 'Bonus Buys', 'Megaways', 'Slots', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'New', 'Exclusive']

  return (
    <div 
      className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white font-figtree overflow-x-hidden min-h-screen transition-colors duration-300" 
      style={{ 
        width: '100%', 
        maxWidth: '100vw', 
        boxSizing: 'border-box',
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
          className="fixed left-0 right-0 bg-[#2d2d2d] overflow-hidden z-[100]"
          style={{ 
            top: 0, 
            pointerEvents: quickLinksOpen ? 'auto' : 'none',
            opacity: 1,
            visibility: 'visible'
          }}
        >
          <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-white/10">
                {[
                  { label: 'Home', onClick: () => { router.push('/casino'); setQuickLinksOpen(false); } },
                  { label: 'Sports', onClick: () => { setShowSports(true); setShowVipRewards(false); setQuickLinksOpen(false); } },
                  { label: 'Live Betting', onClick: () => { window.location.href = '/live-betting'; setQuickLinksOpen(false); } },
                  { label: 'Casino', onClick: () => { router.push('/casino'); setQuickLinksOpen(false); } },
                  { label: 'Live Casino', onClick: () => { router.push('/casino'); setQuickLinksOpen(false); } },
                  { label: 'Poker', onClick: () => { window.location.href = '/poker'; setQuickLinksOpen(false); } },
                  { label: 'VIP Rewards', onClick: () => { setShowVipRewards(true); setQuickLinksOpen(false); } },
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
                      (item.label === 'VIP Rewards' && showVipRewards)
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
        className={cn(
          "bg-[#2D2E2C] dark:bg-[#2D2E2C] border-b border-white/10 h-16 flex items-center justify-between z-[101] fixed left-0 right-0",
          isMobile ? "px-3" : "px-6",
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
          pointerEvents: 'auto',
          top: isMobile ? (quickLinksOpen ? 40 : 0) : 0,
          zIndex: 101,
          position: 'fixed'
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
                  <IconMenu2 className="h-4 w-4" strokeWidth={1.5} />
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
                  <IconMenu2 className="h-4 w-4" strokeWidth={1.5} />
                )}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            )}
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
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showSports 
                          ? "!bg-[#ee3536] !text-white" 
                          : "bg-transparent"
                      )}
                      style={{ 
                        pointerEvents: 'auto',
                        backgroundColor: showSports ? (brandPrimary || '#ee3536') : undefined
                      } as React.CSSProperties}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsPageTransitioning(true)
                        setTimeout(() => {
                        setShowSports(true)
                        setShowVipRewards(false)
                          setTimeout(() => {
                            setIsPageTransitioning(false)
                          }, 200)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }, 150)
                      }}
                      data-active={showSports}
                    >
                      Sports
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "data-[active=true]:bg-white/10 data-[active=true]:text-white",
                        "text-white/70 active:bg-white/10 cursor-pointer"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.location.href = '/live-betting'
                      }}
                    >
                      Live Betting
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        !showSports && !showVipRewards && activeSubNav !== 'Live'
                          ? "!bg-[#ee3536] !text-white" 
                          : "bg-transparent"
                      )}
                      style={{ 
                        pointerEvents: 'auto',
                        backgroundColor: !showSports && !showVipRewards && activeSubNav !== 'Live' ? (brandPrimary || '#ee3536') : undefined
                      } as React.CSSProperties}
                      data-active={!showSports && !showVipRewards && activeSubNav !== 'Live'}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsPageTransitioning(true)
                        setTimeout(() => {
                        router.push('/casino')
                          setTimeout(() => {
                            setIsPageTransitioning(false)
                          }, 200)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        }, 150)
                      }}
                    >
                      Casino
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        !showSports && !showVipRewards && activeSubNav === 'Live'
                          ? "!bg-[#ee3536] !text-white" 
                          : "bg-transparent"
                      )}
                      style={{ 
                        pointerEvents: 'auto',
                        backgroundColor: !showSports && !showVipRewards && activeSubNav === 'Live' ? (brandPrimary || '#ee3536') : undefined
                      } as React.CSSProperties}
                      data-active={!showSports && !showVipRewards && activeSubNav === 'Live'}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsPageTransitioning(true)
                        setTimeout(() => {
                          setShowSports(false)
                          setShowVipRewards(false)
                          setActiveSubNav('Live')
                          setShowAllGames(false)
                          setSelectedCategory('')
                          setSelectedVendor('')
                          setSelectedVendor('')
                          setTimeout(() => {
                            setIsPageTransitioning(false)
                          }, 200)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }, 150)
                      }}
                    >
                      Live Casino
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
                        window.location.href = '/poker'
                      }}
                    >
                      Poker
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "data-[active=true]:bg-white/10 data-[active=true]:text-white",
                        "text-white/70 active:bg-white/10 cursor-pointer"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsPageTransitioning(true)
                        setTimeout(() => {
                          setShowVipRewards(true)
                          setShowSports(false)
                          setIsPageTransitioning(false)
                        }, 200)
                      }}
                      data-active={showVipRewards}
                      style={{ 
                        pointerEvents: 'auto',
                        backgroundColor: showVipRewards ? (brandPrimary || '#ee3536') : undefined
                      } as React.CSSProperties}
                    >
                      VIP Rewards
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
            {/* Theme Toggle Button - Hidden for now */}
            {false && !isMobile && (
              <div style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative' }}>
                <ModeToggle />
              </div>
            )}
            
            {/* VIP Crown Button - After theme toggle on desktop, after balance on mobile */}
            {!isMobile ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('VIP button clicked')
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
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('VIP button clicked')
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
                <span className="text-white">DEPOSIT</span>
              </Button>
            )}

            {/* Chat Toggle - Desktop only, right of deposit */}
            {!isMobile && <ChatNavToggle />}
          </div>
        </motion.header>

        {/* Sports Sub Nav - Sticky with glass effect */}
        {showSports && (
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
                    router.push("/casino")
                  }}
                  className="flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1.5 rounded-small transition-colors hover:bg-white/5 cursor-pointer relative"
                >
                  <div className="relative">
                  <IconTicket className="w-5 h-5 text-white/70" />
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
                  <span className="text-[10px] text-white/70 font-medium">My Bets</span>
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
                  const isActive = sport.label === 'Pool'
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
                        style={isActive ? { backgroundColor: brandPrimary || '#ee3536' } : {}}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Deposit Drawer - Rendered outside header to avoid conflicts */}
        <Drawer open={depositDrawerOpen} onOpenChange={handleDepositDrawerOpenChange} direction={isMobile ? "bottom" : "right"} shouldScaleBackground={false}>
          <DrawerContent 
                showOverlay={isMobile}
                className={cn(
                  "bg-white text-gray-900 flex flex-col relative",
                  "w-full sm:max-w-md border-l border-gray-200 overflow-hidden",
                  isMobile && "rounded-t-[10px]"
                )}
                style={isMobile ? {
                  height: '80vh',
                  maxHeight: '80vh',
                  top: 'auto',
                  bottom: 0,
                } : { display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}
              >
                {isMobile && <DrawerHandle variant="dark" />}
            
                {!isMobile && (
              <DrawerHeader className="relative flex-shrink-0 px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Quick Deposit</h2>
                  <DrawerClose asChild>
                    <button className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0">
                      <IconX className="h-4 w-4 text-gray-600" />
                    </button>
                  </DrawerClose>
              </div>
            </DrawerHeader>
            )}
            <div className={cn("w-full overflow-y-auto flex-1 min-h-0", isMobile ? "px-4 pt-4 pb-6" : "px-4 pt-4 pb-4")} style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto', flex: '1 1 auto', minHeight: 0, paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 20px)' : undefined }}>
              {!showDepositConfirmation ? (
              <>
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className={cn(isMobile ? "p-4" : "p-5")}>
                  {/* Saved Methods Dropdown */}
                  <div className={cn(isMobile ? "mb-4" : "mb-5")}>
                    <div className={cn("flex items-center justify-between", isMobile ? "mb-3" : "mb-3")}>
                      <label className="block text-sm font-semibold text-gray-900">
                        Saved Methods
                      </label>
                      <button
                        onClick={() => {
                          console.log("Add new deposit method clicked");
                          // Handle adding new deposit method
                        }}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        + Add Method
                      </button>
                    </div>
                    <div className="relative">
                      <div className="relative">
                        <select
                          value={selectedPaymentMethod}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 appearance-none cursor-pointer hover:border-gray-300 transition-all shadow-sm pr-12"
                        >
                          <option value="bitcoin">Bitcoin</option>
                          <option value="card1">Mastercard **** 0740</option>
                          <option value="card2">Visa **** 5234</option>
                          <option value="card3">American Express **** 1234</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <IconChevronDown className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className={cn("bg-gray-200", isMobile ? "my-4" : "my-5")} />

                  {/* Deposit Amount */}
                  <div>
                    {!useManualAmount ? (
                      <>
                        <UsageBasedPricing
                          className="w-full"
                          min={25}
                          max={10000}
                          snapTo={25}
                          currency={currentBrand.symbol}
                          basePrice={0}
                          includedCredits={0}
                          value={depositAmount}
                          onChange={setDepositAmount}
                          onChangeEnd={(v) => {
                            console.log("Deposit amount committed:", v);
                            setDepositAmount(v);
                          }}
                          title=""
                          subtitle=""
                        />
                        <div className="flex items-center justify-end mt-3">
                          <button
                            onClick={() => setUseManualAmount(true)}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            + Add Manual Amount
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={cn("space-y-3", isMobile && "space-y-2")}>
                        <div>
                          <label className={cn("block font-semibold text-gray-900 mb-2", isMobile ? "text-xs" : "text-sm")}>
                            Deposit Amount
                          </label>
                          <Input
                            type="number"
                            min={25}
                            max={10000}
                            step={0.01}
                            value={depositAmount}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (value >= 25 && value <= 10000) {
                                setDepositAmount(value);
                              } else if (value > 10000) {
                                setDepositAmount(10000);
                              } else if (value < 25 && e.target.value !== '') {
                                setDepositAmount(25);
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseFloat(e.target.value) || 25;
                              if (value < 25) {
                                setDepositAmount(25);
                              } else if (value > 10000) {
                                setDepositAmount(10000);
                              } else {
                                setDepositAmount(value);
                              }
                            }}
                            className={cn(
                              "w-full bg-white border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 hover:border-gray-300 transition-all",
                              isMobile ? "px-3 py-2.5 text-sm" : "px-4 py-3 text-base"
                            )}
                            placeholder="Enter amount (25 - 10,000)"
                          />
                          <p className={cn("text-gray-500 mt-1.5", isMobile ? "text-[10px]" : "text-xs")}>
                            Min. {currentBrand.symbol}25 / Max. {currentBrand.symbol}10,000
                          </p>
                        </div>
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setUseManualAmount(false)}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Use Slider
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className={cn("bg-gray-200", isMobile ? "my-6" : "my-8")} />

                  {/* Deposit Summary */}
                  <div>
                    <div className={cn("bg-gray-50 rounded-lg", isMobile ? "space-y-2 p-3" : "space-y-2 p-4")}>
                      <div className={cn("flex justify-between", isMobile ? "text-xs" : "text-sm")}>
                        <span className="text-gray-600">Deposit Amount:</span>
                        <span className="text-gray-900 font-medium">{currentBrand.symbol}{depositAmount.toFixed(2)}</span>
                      </div>
                      <div className={cn("flex justify-between", isMobile ? "text-xs" : "text-sm")}>
                        <span className="text-gray-600">Fee (9.75%):</span>
                        <span className="text-gray-900 font-medium">{currentBrand.symbol}{(depositAmount * 0.0975).toFixed(2)}</span>
                      </div>
                      <div className={cn("flex justify-between pt-1.5 border-t border-gray-200", isMobile ? "text-sm" : "text-base")}>
                        <span className="text-gray-900 font-semibold">Total Amount:</span>
                        <span className="text-gray-900 font-bold">{currentBrand.symbol}{(depositAmount + depositAmount * 0.0975).toFixed(2)}</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        console.log("Deposit: Proceed with amount:", depositAmount);
                        // Show loading state
                        setIsDepositLoading(true)
                        
                        // Generate transaction ID
                        const txId = Math.floor(Math.random() * 10000000).toString()
                        setTransactionId(txId)
                        
                        // After 1 second, show confirmation screen and start stepper
                        setTimeout(() => {
                          setIsDepositLoading(false)
                          setShowDepositConfirmation(true)
                          
                          // Start with loading state for 'started'
                          setStepLoading({started: true, processing: false, almost: false, complete: false})
                          setTimeout(() => {
                            setDepositStep('started')
                            setStepLoading({started: false, processing: true, almost: false, complete: false})
                            setTimeout(() => {
                              setDepositStep('processing')
                              setStepLoading({started: false, processing: false, almost: true, complete: false})
                              setTimeout(() => {
                                setDepositStep('almost')
                                setStepLoading({started: false, processing: false, almost: false, complete: true})
                                setTimeout(() => {
                                  setDepositStep('complete')
                                  setStepLoading({started: false, processing: false, almost: false, complete: false})
                                }, 800)
                              }, 1500)
                            }, 800)
                          }, 500)
                        }, 1000)
                      }}
                      disabled={depositAmount < 25 || depositAmount > 10000 || isDepositLoading}
                      className={cn("w-full bg-[#8BC34A] text-white hover:bg-[#7CB342] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-md font-semibold transition-colors cursor-pointer", isMobile ? "h-11 mt-4 text-sm" : "h-12 mt-4")}
                      style={{ pointerEvents: 'auto', zIndex: 10 }}
                    >
                      {isDepositLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <IconLoader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        `DEPOSIT ${currentBrand.symbol}${depositAmount > 0 ? depositAmount.toFixed(2) : "0.00"}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Section */}
              <div className={cn("border-t border-gray-200", isMobile ? "mt-4 pt-4" : "mt-5 pt-5 pb-4")} style={isMobile ? { paddingBottom: '0px', marginBottom: 0 } : undefined}>
                <div className={cn("flex flex-col items-center", isMobile ? "gap-2" : "gap-2.5")}>
                  {/* Security Badges */}
                  <div className={cn("flex items-center", isMobile ? "gap-2" : "gap-3")}>
                    <div className={cn("flex items-center text-gray-600", isMobile ? "gap-1" : "gap-1.5")}>
                      <IconShield className={cn("text-green-600", isMobile ? "w-3 h-3" : "w-3.5 h-3.5")} />
                      <span className={cn("font-medium", isMobile ? "text-[10px]" : "text-xs")}>SSL Encrypted</span>
                    </div>
                    <div className={cn("bg-gray-300", isMobile ? "w-px h-2.5" : "w-px h-3.5")} />
                    <div className={cn("flex items-center text-gray-600", isMobile ? "gap-1" : "gap-1.5")}>
                      <IconLock className={cn("text-blue-600", isMobile ? "w-3 h-3" : "w-3.5 h-3.5")} />
                      <span className={cn("font-medium", isMobile ? "text-[10px]" : "text-xs")}>Secure Payment</span>
                    </div>
                  </div>

                  {/* Trust Statement */}
                  <p className={cn("text-gray-500 text-center max-w-sm leading-tight", isMobile ? "text-[10px]" : "text-xs")}>
                    Your payment information is secure and encrypted. We never store your full card details.
                  </p>
                </div>
              </div>
              </>
              ) : (
                /* Deposit Confirmation Screen */
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900">Your deposit is on the way...</h2>
                    <p className="text-gray-500 text-sm">Transaction ID: {transactionId}</p>
                  </div>

                  {/* Deposit Details Card */}
                  <Card className="bg-gray-50 border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Deposit Amount</span>
                          <span className="text-lg font-semibold text-gray-900">{currentBrand.symbol}{depositAmount.toFixed(2)}</span>
                        </div>
                        <Separator className="bg-gray-200" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Payment Method</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedPaymentMethod === 'bitcoin' ? 'Bitcoin' : 
                             selectedPaymentMethod === 'card1' ? 'Mastercard **** 0740' :
                             selectedPaymentMethod === 'card2' ? 'Visa **** 5234' :
                             selectedPaymentMethod === 'card3' ? 'American Express **** 1234' : selectedPaymentMethod}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                    
                    {/* Stepper Progress Card */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-4">
                        <div className="relative">
                          <div className="flex items-start justify-between px-1">
                            {/* Started Step */}
                            <div className="flex flex-col items-center flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                depositStep === 'started' || depositStep === 'processing' || depositStep === 'almost' || depositStep === 'complete'
                                  ? 'bg-[#8BC34A] shadow-sm' : 'bg-gray-200 border-2 border-gray-300'
                              }`}>
                                {stepLoading.started ? (
                                  <IconLoader2 className="w-4 h-4 text-white animate-spin" />
                                ) : depositStep === 'started' || depositStep === 'processing' || depositStep === 'almost' || depositStep === 'complete' ? (
                                  <IconCheck className="w-5 h-5 text-white" />
                                ) : null}
                              </div>
                              <span className="text-gray-900 text-xs font-medium whitespace-nowrap">Started</span>
                            </div>
                            
                            {/* Connector Line */}
                            <div className={`flex-1 h-1 mt-5 mx-2 transition-all rounded-full ${
                              depositStep === 'processing' || depositStep === 'almost' || depositStep === 'complete'
                                ? 'bg-[#8BC34A]' : 'bg-gray-200'
                            }`} />
                            
                            {/* Processing Step */}
                            <div className="flex flex-col items-center flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                depositStep === 'processing'
                                  ? 'bg-white border-2 border-gray-300 shadow-sm' 
                                  : depositStep === 'almost' || depositStep === 'complete'
                                  ? 'bg-[#8BC34A] shadow-sm'
                                  : 'bg-gray-200 border-2 border-gray-300'
                              }`}>
                                {stepLoading.processing ? (
                                  <IconLoader2 className="w-4 h-4 text-gray-900 animate-spin" />
                                ) : depositStep === 'processing' ? (
                                  <IconLoader2 className="w-4 h-4 text-gray-900 animate-spin" />
                                ) : depositStep === 'almost' || depositStep === 'complete' ? (
                                  <IconCheck className="w-5 h-5 text-white" />
                                ) : (
                                  <span className="text-gray-400 text-xs font-bold">B</span>
                                )}
                              </div>
                              <span className={`text-xs font-medium whitespace-nowrap ${
                                depositStep === 'processing' || depositStep === 'almost' || depositStep === 'complete'
                                  ? 'text-gray-900' : 'text-gray-500'
                              }`}>Processing</span>
                            </div>
                            
                            {/* Connector Line */}
                            <div className={`flex-1 h-1 mt-5 mx-2 transition-all rounded-full ${
                              depositStep === 'almost' || depositStep === 'complete'
                                ? 'bg-[#8BC34A]' : 'bg-gray-200'
                            }`} />
                            
                            {/* Almost Done Step */}
                            <div className="flex flex-col items-center flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                depositStep === 'almost' || depositStep === 'complete'
                                  ? 'bg-[#8BC34A] shadow-sm' : 'bg-gray-200 border-2 border-gray-300'
                              }`}>
                                {stepLoading.almost ? (
                                  <IconLoader2 className="w-4 h-4 text-white animate-spin" />
                                ) : depositStep === 'almost' || depositStep === 'complete' ? (
                                  <IconCheck className="w-5 h-5 text-white" />
                                ) : null}
                              </div>
                              <span className={`text-xs font-medium whitespace-nowrap ${
                                depositStep === 'almost' || depositStep === 'complete'
                                  ? 'text-gray-900' : 'text-gray-500'
                              }`}>Almost Done</span>
                            </div>
                            
                            {/* Connector Line */}
                            <div className={`flex-1 h-1 mt-5 mx-2 transition-all rounded-full ${
                              depositStep === 'complete'
                                ? 'bg-[#8BC34A]' : 'bg-gray-200'
                            }`} />
                            
                            {/* Complete Step */}
                            <div className="flex flex-col items-center flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                depositStep === 'complete'
                                  ? 'bg-[#8BC34A] shadow-sm' : 'bg-gray-200 border-2 border-gray-300'
                              }`}>
                                {stepLoading.complete ? (
                                  <IconLoader2 className="w-4 h-4 text-white animate-spin" />
                                ) : depositStep === 'complete' ? (
                                  <IconCheck className="w-5 h-5 text-white" />
                                ) : null}
                              </div>
                              <span className={`text-xs font-medium whitespace-nowrap ${
                                depositStep === 'complete'
                                  ? 'text-gray-900' : 'text-gray-500'
                              }`}>Complete</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Play Now Button */}
                    {depositStep === 'complete' && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          // Close drawer first
                          setShowDepositConfirmation(false)
                          setDepositDrawerOpen(false)
                          setDepositStep('started')
                          setStepLoading({started: false, processing: false, almost: false, complete: false})
                          
                          // Wait for drawer to close, then animate balance
                          setTimeout(() => {
                            // Update balance and animate roll-up
                            const newBalance = balance + depositAmount
                            setBalance(newBalance)
                            
                            // Animate the balance roll-up
                            const startBalance = displayBalance
                            const endBalance = newBalance
                            const duration = 1000 // 1 second
                            const startTime = Date.now()
                            
                            const animate = () => {
                              const elapsed = Date.now() - startTime
                              const progress = Math.min(elapsed / duration, 1)
                              // Easing function for smooth animation
                              const easeOutCubic = 1 - Math.pow(1 - progress, 3)
                              const currentBalance = Math.round(startBalance + (endBalance - startBalance) * easeOutCubic)
                              setDisplayBalance(currentBalance)
                              
                              if (progress < 1) {
                                requestAnimationFrame(animate)
                              } else {
                                // Show toast after animation completes
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
                          }, 300) // Small delay to ensure drawer is closed
                        }}
                        className="w-full h-11 mt-4 border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 rounded-md font-semibold transition-colors"
                      >
                        Play Now
                      </Button>
                    )}
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>

        {/* Content area with sidebar and main content - starts below header */}
        <div className="flex relative" style={{ marginTop: '64px' }}>
          {/* Sidebar using shadcn component - positioned under header - Hide on Sports and VIP Rewards */}
          {!showSports && !showVipRewards && (
          <Sidebar 
            collapsible="icon"
            variant="sidebar"
            className="!bg-[#2d2d2d] dark:!bg-[#2d2d2d] border-r border-white/10 text-white [&>div]:!bg-[#2d2d2d] dark:[&>div]:!bg-[#2d2d2d]"
          >
            <SidebarContent className="overflow-y-auto">
              <TooltipProvider>
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
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
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
                                        setIsPageTransitioning(true)
                                        setTimeout(() => {
                                          setShowSports(true)
                                          setShowVipRewards(false)
                                          setQuickLinksOpen(false)
                                          setTimeout(() => {
                                            setIsPageTransitioning(false)
                                          }, 200)
                                          window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }, 150)
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
                                        window.location.href = '/live-betting'
                                        setQuickLinksOpen(false)
                                      }}
                                    >
                                      Live Betting
                                    </button>
                                    <button
                                      className="w-full flex items-center justify-start px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowQuickLinksMenu(false)
                                        setOpenMobile(false)
                                        setIsPageTransitioning(true)
                                        setTimeout(() => {
                                          setShowSports(false)
                                          setShowVipRewards(false)
                                          setActiveSubNav('For You')
                                          setQuickLinksOpen(false)
                                          setTimeout(() => {
                                            setIsPageTransitioning(false)
                                          }, 200)
                                          window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }, 150)
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
                                        setIsPageTransitioning(true)
                                        setTimeout(() => {
                                          setShowSports(false)
                                          setShowVipRewards(false)
                                          setActiveSubNav('Live')
                                          setShowAllGames(false)
                                          setSelectedCategory('')
                                          setSelectedVendor('')
                                          setQuickLinksOpen(false)
                                          setTimeout(() => {
                                            setIsPageTransitioning(false)
                                          }, 200)
                                          window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }, 150)
                                      }}
                                    >
                                      Live Casino
                                    </button>
                                    <button
                                      className="w-full flex items-center justify-start px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowQuickLinksMenu(false)
                                        setOpenMobile(false)
                                        window.location.href = '/poker'
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
                                        setShowVipRewards(true)
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
                        const showSeparatorAbove = item.label === 'Loyalty Hub'
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
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                        setShowSports(false)
                                      } else if (item.label === 'Popular Games') {
                                        setActiveSubNav('For You')
                                        setSelectedCategory('Popular')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                        setShowSports(false)
                                      } else if (item.label === 'Slots') {
                                        setActiveSubNav('Slots')
                                        setSelectedCategory('Slots')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                      } else if (item.label === 'Blackjack') {
                                        setActiveSubNav('Blackjack')
                                        setSelectedCategory('BlackJack')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                      } else if (item.label === 'Video Poker') {
                                        setActiveSubNav('') // Clear activeSubNav when selecting items not in sub nav
                                        setSelectedCategory('Video Poker')
                                        setSelectedVendor('')
                                        setShowAllGames(true)
                                        setShowSports(false)
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
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
                                      } else if (item.label === 'Loyalty Hub') {
                                        openVipDrawer()
                                        setShowSports(false)
                                      } else if (item.label === 'Banking') {
                                        openDepositDrawer()
                                        setShowSports(false)
                                      } else if (item.label === 'Need Help') {
                                        // Handle need help - could open a help modal or navigate
                                        console.log('Need Help clicked')
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
              viewTransitionName: 'content-area'
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
                              window.scrollTo({ top: 0, behavior: 'smooth' })
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
                        window.scrollTo({ top: 0, behavior: 'smooth' })
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
                                layoutId="activeTab"
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
            
            {/* Spacer to account for fixed header and sub-nav height */}
            <motion.div 
              initial={false}
              animate={isMobile ? {
                height: showSports 
                  ? (quickLinksOpen ? '144px' : '104px') // 64px header + 40px quick links (when open) + 40px sports sub nav = 144px, or 64px header + 40px sports sub nav = 104px
                  : (quickLinksOpen ? '155px' : '100px') // 64px header + 40px quick links (when open) + 57px sub nav - 6px = 155px, or 64px header + 57px sub nav - 21px = 100px (reduced gap for both states)
              } : {
                height: showSports ? '104px' : '115px' // 64px header + 40px sports sub nav = 104px, or 64px header + 57px sub nav - 6px = 115px (reduced gap for desktop)
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
            <AnimatePresence mode="wait" initial={false}>
              {isPageTransitioning ? (
                <motion.div
                  key="sports-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <SidebarInset className="bg-[#1a1a1a] text-white">
                    <div className="px-6 py-4">
                      {/* Breadcrumbs Skeleton */}
                      <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-6 w-6 rounded bg-white/5" />
                        <Skeleton className="h-4 w-20 rounded bg-white/5" />
                        <Skeleton className="h-4 w-1 rounded bg-white/5" />
                        <Skeleton className="h-4 w-16 rounded bg-white/5" />
                        <Skeleton className="h-4 w-1 rounded bg-white/5" />
                        <Skeleton className="h-4 w-24 rounded bg-white/5" />
                      </div>
                      
                      {/* League Header Skeleton */}
                      <Skeleton className="h-14 w-full rounded-lg mb-4 bg-white/5" />
                      
                      {/* League Cards Carousel Skeleton */}
                      <div className="mb-8">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-14 w-14 rounded-small flex-shrink-0 bg-white/5" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Top Events Carousel Skeleton */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <Skeleton className="h-5 w-24 rounded bg-white/5" />
                          <Skeleton className="h-4 w-16 rounded bg-white/5" />
                        </div>
                        <div className="flex items-center gap-3 overflow-hidden">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-[200px] w-[320px] rounded-small flex-shrink-0 bg-white/5" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Live Section Skeleton */}
                      <div className="mb-8">
                        <Skeleton className="h-5 w-16 rounded mb-4 bg-white/5" />
                        <div className="space-y-2">
                          {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-small bg-white/5" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Upcoming Section Skeleton */}
                      <div className="mb-8">
                        <Skeleton className="h-5 w-20 rounded mb-4 bg-white/5" />
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-small bg-white/5" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Top Bet Boosts Skeleton */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <Skeleton className="h-5 w-32 rounded bg-white/5" />
                          <Skeleton className="h-4 w-16 rounded bg-white/5" />
                        </div>
                        <div className="flex items-center gap-3 overflow-hidden">
                          {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-[140px] w-[320px] rounded-small flex-shrink-0 bg-white/5" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </SidebarInset>
                </motion.div>
              ) : showVipRewards ? (
                <motion.div
                  key="vip-rewards-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
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
                  />
                </motion.div>
              ) : showSports ? (
                <motion.div
                  key="sports-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
              />
                </motion.div>
              ) : isPageTransitioning ? (
                <motion.div
                  key="casino-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <SidebarInset className="bg-[#1a1a1a] text-white">
                    <div className="px-6 py-4">
                      {/* Banner Carousel Skeleton */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-[140px] w-[320px] rounded-small flex-shrink-0 bg-white/5" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Game Sections Skeleton */}
                      <div className="space-y-8">
                        {[1, 2, 3].map((section) => (
                          <div key={section}>
                            <div className="flex items-center justify-between mb-4">
                              <Skeleton className="h-6 w-48 rounded bg-white/5" />
                              <Skeleton className="h-8 w-24 rounded bg-white/5" />
                            </div>
                            <div className="flex items-center gap-3 overflow-hidden">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-[160px] w-[160px] rounded-small flex-shrink-0 bg-white/5" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SidebarInset>
                </motion.div>
              ) : (
                <motion.div
                  key="casino-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
                          className="group relative bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300 cursor-pointer overflow-hidden" 
                          style={{ width: '200px', height: '140px' }}
                          onClick={() => {
                            openVipDrawer()
                          }}
                        >
                          <CardContent className="p-4 relative z-10">
                            <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-4 transition-colors duration-300">VIP Rewards</CardTitle>
                            <div className="text-xs text-gray-600 dark:text-white/50 mb-2 transition-colors duration-300">Gold To Platinum I</div>
                            <VIPProgressBar value={45} />
                          </CardContent>
                          {/* Sweep effect */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                        </Card>
                      </CarouselItem>
                      
                      {/* Daily Races Card */}
                      <CarouselItem className="pl-2 md:pl-4 basis-auto flex-shrink-0">
                        <Card 
                          className="group relative bg-white/5 dark:bg-white/5 bg-gray-100 dark:bg-white/5 border-white/10 dark:border-white/10 border-gray-200 dark:border-white/10 flex-shrink-0 transition-colors duration-300 cursor-pointer overflow-hidden" 
                          style={{ width: '300px', height: '140px' }}
                          onClick={() => {
                            // Save current page state before navigating
                            setPreviousPageState({
                              showSports: false,
                              showVipRewards: false,
                              activeSubNav: activeSubNav
                            })
                            setInitialVipSidebarItem('Cash Races')
                            setShowVipRewards(true)
                            // Scroll to top when navigating to new page
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                        >
                          <CardContent className="p-4 relative z-10">
                            <div className="flex items-start justify-between mb-4">
                              <CardTitle className="text-sm text-white/70 dark:text-white/70 text-gray-800 dark:text-white/70 mb-0 transition-colors duration-300">Daily Races</CardTitle>
                              <div className="text-right">
                                <DailyRacesTimer />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                                <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">3rd</div>
                                <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Position</div>
                              </div>
                              <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                                <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$80.000</div>
                                <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Wagered</div>
                              </div>
                              <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-small p-2.5 border border-white/10 dark:border-white/10 transition-colors duration-300">
                                <div className="text-gray-800 dark:text-white font-semibold mb-0.5 transition-colors duration-300">$160.000</div>
                                <div className="text-gray-600 dark:text-white/50 text-[10px] transition-colors duration-300">Current Prize</div>
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
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                                          window.scrollTo({ top: 0, behavior: 'smooth' })
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
                                          window.scrollTo({ top: 0, behavior: 'smooth' })
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
                            isMobile ? "px-3" : "px-6"
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
                                window.scrollTo({ top: 0, behavior: 'smooth' })
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
                            isMobile ? "px-3" : "px-6"
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
                            isMobile ? "px-3" : "px-6"
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
                            isMobile ? "px-3" : "px-6"
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
                            isMobile ? "px-3" : "px-6"
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
                            isMobile ? "px-3" : "px-6"
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
                            isMobile ? "px-3" : "px-6"
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
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
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
                                          window.scrollTo({ top: 0, behavior: 'smooth' })
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
                              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
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
                            isMobile ? "px-3" : "px-6"
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
                    >
                      <IconUser className="w-5 h-5 mr-3 text-gray-700" />
                      <span className="flex-1 text-left text-gray-900">My Account</span>
                </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-12 px-3 min-w-0"
                    >
                      <IconFileText className="w-5 h-5 mr-3 text-gray-700 flex-shrink-0" />
                      <span className="flex-1 text-left text-gray-900">Pending Bets</span>
                      <span className="text-sm text-gray-600 ml-auto">$0.00</span>
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
                              <VIPProgressBar value={45} />
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  backgroundColor: '#8BC34A', 
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
  return (
    <SidebarProvider>
      <NavTestPageContent />
    </SidebarProvider>
  )
}
