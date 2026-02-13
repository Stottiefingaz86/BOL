'use client'

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
  IconShare,
  IconFileSpreadsheet,
  IconLayoutList,
  IconLayoutRows,
} from '@tabler/icons-react'
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
                        {typeof item.icon === 'string' ? <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" /> : <IconComp strokeWidth={1.5} className="w-5 h-5" />}
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
function SportsPage({ activeTab, onTabChange, onBack, brandPrimary, brandPrimaryHover, onSearchClick, betslipOpen, setBetslipOpen, bets, setBets, setShowToast, setToastMessage, setToastAction, placedBets, setPlacedBets, myBetsAlertCount, setMyBetsAlertCount, betslipManuallyClosed, setBetslipManuallyClosed, activeSport, setActiveSport }: { activeTab: string; onTabChange: (tab: string) => void; onBack: () => void; brandPrimary: string; brandPrimaryHover: string; onSearchClick: () => void; betslipOpen: boolean; setBetslipOpen: (open: boolean) => void; bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>; setBets: (bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }> | ((prev: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>) => Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number }>)) => void; setShowToast: (show: boolean) => void; setToastMessage: (message: string) => void; setToastAction: (action: { label: string; onClick: () => void } | null) => void; placedBets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>; setPlacedBets: (bets: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }> | ((prev: Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>) => Array<{ id: string; eventId: number; eventName: string; marketTitle: string; selection: string; odds: string; stake: number; placedAt: Date }>)) => void; myBetsAlertCount: number; setMyBetsAlertCount: (count: number | ((prev: number) => number)) => void; betslipManuallyClosed: boolean; setBetslipManuallyClosed: (closed: boolean) => void; activeSport: 'Soccer' | 'Football' | null; setActiveSport: (sport: 'Soccer' | 'Football' | null) => void }) {
  const { state: sidebarState, toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()
  const router = useRouter()
  const [loadingItem, setLoadingItem] = useState<string | null>(null)
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
  const [eventOrderBy, setEventOrderBy] = useState<string>('Popularity')
  const [selectedLeague, setSelectedLeague] = useState<number>(1) // Default to Premier League (id: 1)
  
  // Soccer breadcrumb state
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedSoccerLeague, setSelectedSoccerLeague] = useState<string | null>(null)

  // Soccer countries and leagues mapping
  const soccerCountries = [
    { name: 'England', code: 'GB', leagues: ['Premier League', 'Championship', 'League 1', 'League 2', 'FA Cup'] },
    { name: 'Spain', code: 'ES', leagues: ['La Liga', 'Segunda División', 'Copa del Rey'] },
    { name: 'Italy', code: 'IT', leagues: ['Serie A', 'Serie B', 'Coppa Italia'] },
    { name: 'Germany', code: 'DE', leagues: ['Bundesliga', '2. Bundesliga', 'DFB Pokal'] },
    { name: 'France', code: 'FR', leagues: ['Ligue 1', 'Ligue 2', 'Coupe de France'] },
    { name: 'USA', code: 'US', leagues: ['MLS', 'USL Championship', 'US Open Cup'] },
    { name: 'Europe', code: 'EU', leagues: ['Champions League', 'Europa League', 'Conference League'] },
    { name: 'South America', code: 'BR', leagues: ['Copa America', 'Copa Libertadores', 'Copa Sudamericana'] },
    { name: 'Brazil', code: 'BR', leagues: ['Brasileirão', 'Copa do Brasil'] },
    { name: 'Argentina', code: 'AR', leagues: ['Liga Profesional', 'Copa Argentina'] },
  ]

  // Soccer leagues carousel state
  const [soccerLeaguesCarouselApi, setSoccerLeaguesCarouselApi] = useState<CarouselApi>()
  const [soccerLeaguesCanScrollPrev, setSoccerLeaguesCanScrollPrev] = useState(false)
  const [soccerLeaguesCanScrollNext, setSoccerLeaguesCanScrollNext] = useState(false)

  // Top soccer leagues for carousel
  const topSoccerLeagues = [
    { id: 1, name: 'Premier League', country: 'England', icon: '/banners/sports_league/prem.svg' },
    { id: 2, name: 'La Liga', country: 'Spain', icon: '/banners/sports_league/laliga.svg' },
    { id: 3, name: 'Champions League', country: 'Europe', icon: '/banners/sports_league/champions.svg' },
    { id: 4, name: 'MLS', country: 'USA', icon: '/banners/sports_league/mls.svg' },
    { id: 5, name: 'Copa America', country: 'South America', icon: '/banners/sports_league/copa.svg' },
    { id: 6, name: 'Serie A', country: 'Italy', icon: '/team/Italy - Serie A/serie A.svg' },
    { id: 7, name: 'Bundesliga', country: 'Germany', icon: '/banners/sports_league/prem.svg' },
    { id: 8, name: 'Ligue 1', country: 'France', icon: '/banners/sports_league/prem.svg' },
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
  
  // Onboarding staging state — selections before committing with "Create Feed"
  const [onboardingSelections, setOnboardingSelections] = useState<string[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  
  // View mode: compact (default) or pro (spreadsheet-like)
  const [viewMode, setViewMode] = useState<'compact' | 'pro'>('compact')
  
  // Pro view period selector per league (e.g. 'Game', '1H', '1Q', etc.)
  const [proPeriod, setProPeriod] = useState<{ [leagueSlug: string]: string }>({})
  
  useEffect(() => {
    const stored = localStorage.getItem('favoriteLeagues')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFavoriteLeagues(parsed)
        // Seed onboarding selections so stale favorites show as pre-checked
        if (parsed.length > 0) setOnboardingSelections(parsed)
      } catch {}
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
    { icon: '/sports_icons/my-feed.svg', label: 'My Feed', href: '/sports/my-feed', active: true },
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
    { id: 1, name: 'Premier League', country: 'England', icon: '/banners/sports_league/prem.svg' },
    { id: 2, name: 'La Liga', country: 'Spain', icon: '/banners/sports_league/laliga.svg' },
    { id: 3, name: 'MLS', country: 'USA', icon: '/banners/sports_league/mls.svg' },
    { id: 4, name: 'Champions League', country: 'Europe', icon: '/banners/sports_league/champions.svg' },
    { id: 5, name: 'Copa America', country: 'South America', icon: '/banners/sports_league/copa.svg' },
    { id: 12, name: 'NFL', country: 'USA', icon: '/banners/sports_league/NFL.svg' },
    { id: 13, name: 'NBA', country: 'USA', icon: '/banners/sports_league/nba.svg' },
    { id: 14, name: 'MLB', country: 'USA', icon: '/banners/sports_league/MLB.svg' },
    { id: 15, name: 'NHL', country: 'USA', icon: '/banners/sports_league/NHL.svg' },
    { id: 16, name: 'ATP', country: 'World', icon: '/banners/sports_league/ATP.svg' },
    { id: 17, name: 'F1', country: 'World', icon: '/banners/sports_league/f1.svg' },
    { id: 6, name: 'Serie A', country: 'Italy', icon: IconTrophy },
    { id: 7, name: 'Bundesliga', country: 'Germany', icon: IconTrophy },
    { id: 8, name: 'Ligue 1', country: 'France', icon: IconTrophy },
    { id: 9, name: 'Championship', country: 'England', icon: IconTrophy },
    { id: 10, name: 'FA Cup', country: 'England', icon: IconTrophy },
    { id: 11, name: 'League One', country: 'England', icon: IconTrophy },
  ]
  
  // Sample event data with betting markets - Mixed soccer leagues
  const liveEvents = [
    { 
      id: 1, 
      league: 'Premier League', 
      country: 'England',
      leagueIcon: '/banners/sports_league/prem.svg',
      startTime: 'H1', 
      elapsedSeconds: 540,
      isLive: true,
      team1: 'Liverpool', 
      team2: 'Bournemouth', 
      score: { team1: 2, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'LIV', odds: '-150' }, { label: 'Tie', odds: '+280' }, { label: 'BOU', odds: '+350' }] },
        { title: 'Spread', options: [{ label: 'LIV -1.5', odds: '+120' }, { label: 'BOU +1.5', odds: '-140' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
        { title: '1H Moneyline', options: [{ label: 'LIV', odds: '-120' }, { label: 'Tie', odds: '+260' }, { label: 'BOU', odds: '+400' }] },
        { title: '1H Spread', options: [{ label: 'LIV -0.5', odds: '+100' }, { label: 'BOU +0.5', odds: '-120' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-130' }, { label: 'U 1.5', odds: '+110' }] },
      ]
    },
    { 
      id: 201, 
      league: 'Premier League', 
      country: 'England',
      leagueIcon: '/banners/sports_league/prem.svg',
      startTime: 'H2', 
      elapsedSeconds: 3600,
      isLive: true,
      team1: 'Arsenal', 
      team2: 'Chelsea', 
      score: { team1: 1, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'ARS', odds: '+110' }, { label: 'Tie', odds: '+240' }, { label: 'CHE', odds: '+250' }] },
        { title: 'Spread', options: [{ label: 'ARS -0.5', odds: '-120' }, { label: 'CHE +0.5', odds: '+100' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-105' }, { label: 'U 2.5', odds: '-115' }] },
        { title: '1H Moneyline', options: [{ label: 'ARS', odds: '+130' }, { label: 'Tie', odds: '+220' }, { label: 'CHE', odds: '+230' }] },
        { title: '1H Spread', options: [{ label: 'ARS -0.5', odds: '-110' }, { label: 'CHE +0.5', odds: '-110' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-130' }, { label: 'U 1.5', odds: '+110' }] },
      ]
    },
    { 
      id: 202, 
      league: 'Premier League', 
      country: 'England',
      leagueIcon: '/banners/sports_league/prem.svg',
      startTime: 'H1', 
      elapsedSeconds: 1200,
      isLive: true,
      team1: 'Tottenham', 
      team2: 'Newcastle', 
      score: { team1: 0, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'TOT', odds: '+160' }, { label: 'Tie', odds: '+260' }, { label: 'NEW', odds: '+180' }] },
        { title: 'Spread', options: [{ label: 'TOT -0.5', odds: '+130' }, { label: 'NEW +0.5', odds: '-150' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
        { title: '1H Moneyline', options: [{ label: 'TOT', odds: '+180' }, { label: 'Tie', odds: '+240' }, { label: 'NEW', odds: '+170' }] },
        { title: '1H Spread', options: [{ label: 'TOT -0.5', odds: '+120' }, { label: 'NEW +0.5', odds: '-140' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-120' }, { label: 'U 1.5', odds: '+100' }] },
      ]
    },
    { 
      id: 2, 
      league: 'La Liga', 
      country: 'Spain',
      leagueIcon: '/banners/sports_league/laliga.svg',
      startTime: 'H2', 
      elapsedSeconds: 4020,
      isLive: true,
      team1: 'Real Madrid', 
      team2: 'Barcelona', 
      score: { team1: 2, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'RMA', odds: '+110' }, { label: 'Tie', odds: '+260' }, { label: 'BAR', odds: '+220' }] },
        { title: 'Spread', options: [{ label: 'RMA -0.5', odds: '-130' }, { label: 'BAR +0.5', odds: '+110' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '+100' }, { label: 'U 3.5', odds: '-120' }] },
        { title: '1H Moneyline', options: [{ label: 'RMA', odds: '+130' }, { label: 'Tie', odds: '+240' }, { label: 'BAR', odds: '+200' }] },
        { title: '1H Spread', options: [{ label: 'RMA -0.5', odds: '-110' }, { label: 'BAR +0.5', odds: '-110' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-140' }, { label: 'U 1.5', odds: '+120' }] },
      ]
    },
    { 
      id: 3, 
      league: 'Serie A', 
      country: 'Italy',
      leagueIcon: '/team/Italy - Serie A/serie A.svg',
      startTime: 'H1', 
      elapsedSeconds: 1380,
      isLive: true,
      team1: 'Juventus', 
      team2: 'AC Milan', 
      score: { team1: 1, team2: 2 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'JUV', odds: '+180' }, { label: 'Tie', odds: '+250' }, { label: 'MIL', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'JUV -0.5', odds: '+140' }, { label: 'MIL +0.5', odds: '-160' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '+110' }, { label: 'U 3.5', odds: '-130' }] },
        { title: '1H Moneyline', options: [{ label: 'JUV', odds: '+200' }, { label: 'Tie', odds: '+230' }, { label: 'MIL', odds: '+150' }] },
        { title: '1H Spread', options: [{ label: 'JUV -0.5', odds: '+130' }, { label: 'MIL +0.5', odds: '-150' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-120' }, { label: 'U 1.5', odds: '+100' }] },
      ]
    },
    // NFL Live Events
    { 
      id: 101, 
      league: 'NFL', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q2', 
      elapsedSeconds: 420,
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
      ]
    },
    { 
      id: 102, 
      league: 'NFL', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q4', 
      elapsedSeconds: 2280,
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
      ]
    },
    { 
      id: 103, 
      league: 'NFL', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q1', 
      elapsedSeconds: 60,
      isLive: true,
      team1: 'Detroit Lions', 
      team2: 'Miami Dolphins', 
      score: { team1: 0, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'DET', odds: '+110' }, { label: 'MIA', odds: '+130' }] },
        { title: 'Total', options: [{ label: 'O 47.5', odds: '-110' }, { label: 'U 47.5', odds: '-110' }] },
        { title: 'Spread', options: [{ label: 'DET -1.5', odds: '-110' }, { label: 'MIA +1.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'DET', odds: '+115' }, { label: 'MIA', odds: '+135' }] },
      ]
    },
    // Champions League Live
    {
      id: 301,
      league: 'Champions League',
      country: 'Europe',
      leagueIcon: '/banners/sports_league/champions.svg',
      startTime: 'H1',
      elapsedSeconds: 1800,
      isLive: true,
      team1: 'Barcelona',
      team2: 'AC Milan',
      score: { team1: 2, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'BAR', odds: '-300' }, { label: 'Tie', odds: '+400' }, { label: 'MIL', odds: '+700' }] },
        { title: 'Spread', options: [{ label: 'BAR -1.5', odds: '-110' }, { label: 'MIL +1.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '-120' }, { label: 'U 3.5', odds: '+100' }] },
        { title: '1H Moneyline', options: [{ label: 'BAR', odds: '-250' }, { label: 'Tie', odds: '+350' }, { label: 'MIL', odds: '+600' }] },
        { title: '1H Spread', options: [{ label: 'BAR -0.5', odds: '-160' }, { label: 'MIL +0.5', odds: '+140' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-140' }, { label: 'U 1.5', odds: '+120' }] },
      ]
    },
    // MLS Live
    {
      id: 302,
      league: 'MLS',
      country: 'USA',
      leagueIcon: '/banners/sports_league/mls.svg',
      startTime: 'H2',
      elapsedSeconds: 3900,
      isLive: true,
      team1: 'Inter Miami',
      team2: 'LA Galaxy',
      score: { team1: 1, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'MIA', odds: '+140' }, { label: 'Tie', odds: '+230' }, { label: 'LAG', odds: '+200' }] },
        { title: 'Spread', options: [{ label: 'MIA -0.5', odds: '+110' }, { label: 'LAG +0.5', odds: '-130' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
        { title: '1H Moneyline', options: [{ label: 'MIA', odds: '+160' }, { label: 'Tie', odds: '+210' }, { label: 'LAG', odds: '+210' }] },
        { title: '1H Spread', options: [{ label: 'MIA -0.5', odds: '+120' }, { label: 'LAG +0.5', odds: '-140' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-120' }, { label: 'U 1.5', odds: '+100' }] },
      ]
    },
    // Bundesliga Live
    {
      id: 303,
      league: 'Bundesliga',
      country: 'Germany',
      leagueIcon: '/banners/sports_league/prem.svg',
      startTime: 'H1',
      elapsedSeconds: 900,
      isLive: true,
      team1: 'Bayern Munich',
      team2: 'Borussia Dortmund',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'BAY', odds: '-180' }, { label: 'Tie', odds: '+300' }, { label: 'BVB', odds: '+420' }] },
        { title: 'Spread', options: [{ label: 'BAY -1.5', odds: '+110' }, { label: 'BVB +1.5', odds: '-130' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '-115' }, { label: 'U 3.5', odds: '-105' }] },
        { title: '1H Moneyline', options: [{ label: 'BAY', odds: '-150' }, { label: 'Tie', odds: '+280' }, { label: 'BVB', odds: '+380' }] },
        { title: '1H Spread', options: [{ label: 'BAY -0.5', odds: '-120' }, { label: 'BVB +0.5', odds: '+100' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-130' }, { label: 'U 1.5', odds: '+110' }] },
      ]
    },
    {
      id: 304,
      league: 'Bundesliga',
      country: 'Germany',
      leagueIcon: '/banners/sports_league/prem.svg',
      startTime: 'H2',
      elapsedSeconds: 4200,
      isLive: true,
      team1: 'RB Leipzig',
      team2: 'Bayer Leverkusen',
      score: { team1: 2, team2: 2 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'RBL', odds: '+150' }, { label: 'Tie', odds: '+220' }, { label: 'LEV', odds: '+200' }] },
        { title: 'Spread', options: [{ label: 'RBL -0.5', odds: '+120' }, { label: 'LEV +0.5', odds: '-140' }] },
        { title: 'Total', options: [{ label: 'O 4.5', odds: '-105' }, { label: 'U 4.5', odds: '-115' }] },
        { title: '1H Moneyline', options: [{ label: 'RBL', odds: '+170' }, { label: 'Tie', odds: '+210' }, { label: 'LEV', odds: '+190' }] },
        { title: '1H Spread', options: [{ label: 'RBL -0.5', odds: '+130' }, { label: 'LEV +0.5', odds: '-150' }] },
        { title: '1H Total', options: [{ label: 'O 2.5', odds: '-130' }, { label: 'U 2.5', odds: '+110' }] },
      ]
    },
    // NBA Live
    {
      id: 401,
      league: 'NBA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/nba.svg',
      startTime: 'Q3',
      elapsedSeconds: 1440,
      isLive: true,
      team1: 'LA Lakers',
      team2: 'Boston Celtics',
      score: { team1: 78, team2: 82 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'LAL', odds: '+140' }, { label: 'BOS', odds: '-160' }] },
        { title: 'Spread', options: [{ label: 'LAL +3.5', odds: '-110' }, { label: 'BOS -3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 218.5', odds: '-110' }, { label: 'U 218.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'LAL', odds: '+150' }, { label: 'BOS', odds: '-170' }] },
        { title: 'Q3 Spread', options: [{ label: 'LAL +1.5', odds: '-110' }, { label: 'BOS -1.5', odds: '-110' }] },
      ]
    },
    {
      id: 402,
      league: 'NBA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/nba.svg',
      startTime: 'Q2',
      elapsedSeconds: 720,
      isLive: true,
      team1: 'Golden State Warriors',
      team2: 'Milwaukee Bucks',
      score: { team1: 52, team2: 48 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'GSW', odds: '-130' }, { label: 'MIL', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'GSW -2.5', odds: '-110' }, { label: 'MIL +2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 224.5', odds: '-110' }, { label: 'U 224.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'GSW', odds: '-120' }, { label: 'MIL', odds: '+100' }] },
        { title: 'Q2 Spread', options: [{ label: 'GSW -1.5', odds: '-105' }, { label: 'MIL +1.5', odds: '-115' }] },
      ]
    },
    // MLB Live
    {
      id: 501,
      league: 'MLB',
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      startTime: 'T5',
      elapsedSeconds: 0,
      isLive: true,
      team1: 'NY Yankees',
      team2: 'LA Dodgers',
      score: { team1: 3, team2: 4 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'NYY', odds: '+130' }, { label: 'LAD', odds: '-150' }] },
        { title: 'Spread', options: [{ label: 'NYY +1.5', odds: '-180' }, { label: 'LAD -1.5', odds: '+155' }] },
        { title: 'Total', options: [{ label: 'O 8.5', odds: '-110' }, { label: 'U 8.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'NYY', odds: '+140' }, { label: 'LAD', odds: '-160' }] },
      ]
    },
    {
      id: 502,
      league: 'MLB',
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      startTime: 'T3',
      elapsedSeconds: 0,
      isLive: true,
      team1: 'Houston Astros',
      team2: 'Atlanta Braves',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'HOU', odds: '-140' }, { label: 'ATL', odds: '+120' }] },
        { title: 'Spread', options: [{ label: 'HOU -1.5', odds: '+130' }, { label: 'ATL +1.5', odds: '-150' }] },
        { title: 'Total', options: [{ label: 'O 7.5', odds: '-105' }, { label: 'U 7.5', odds: '-115' }] },
        { title: 'First Half Moneyline', options: [{ label: 'HOU', odds: '-130' }, { label: 'ATL', odds: '+110' }] },
      ]
    },
    // NHL Live
    {
      id: 601,
      league: 'NHL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NHL.svg',
      startTime: 'P2',
      elapsedSeconds: 1200,
      isLive: true,
      team1: 'Toronto Maple Leafs',
      team2: 'Montreal Canadiens',
      score: { team1: 2, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'TOR', odds: '-150' }, { label: 'MTL', odds: '+130' }] },
        { title: 'Spread', options: [{ label: 'TOR -1.5', odds: '+150' }, { label: 'MTL +1.5', odds: '-170' }] },
        { title: 'Total', options: [{ label: 'O 5.5', odds: '-110' }, { label: 'U 5.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'TOR', odds: '-140' }, { label: 'MTL', odds: '+120' }] },
      ]
    },
    {
      id: 602,
      league: 'NHL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NHL.svg',
      startTime: 'P1',
      elapsedSeconds: 600,
      isLive: true,
      team1: 'Edmonton Oilers',
      team2: 'Colorado Avalanche',
      score: { team1: 0, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'EDM', odds: '+110' }, { label: 'COL', odds: '-130' }] },
        { title: 'Spread', options: [{ label: 'EDM +1.5', odds: '-200' }, { label: 'COL -1.5', odds: '+170' }] },
        { title: 'Total', options: [{ label: 'O 6.5', odds: '+100' }, { label: 'U 6.5', odds: '-120' }] },
        { title: 'First Half Moneyline', options: [{ label: 'EDM', odds: '+120' }, { label: 'COL', odds: '-140' }] },
      ]
    },
    // NCAAF Live
    {
      id: 701,
      league: 'NCAAF',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q3',
      elapsedSeconds: 1500,
      isLive: true,
      team1: 'Alabama Crimson Tide',
      team2: 'Georgia Bulldogs',
      score: { team1: 21, team2: 17 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'ALA', odds: '+130' }, { label: 'UGA', odds: '-150' }] },
        { title: 'Spread', options: [{ label: 'ALA +3.5', odds: '-110' }, { label: 'UGA -3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 52.5', odds: '-110' }, { label: 'U 52.5', odds: '-110' }] },
      ]
    },
    {
      id: 702,
      league: 'NCAAF',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q2',
      elapsedSeconds: 720,
      isLive: true,
      team1: 'Ohio State Buckeyes',
      team2: 'Michigan Wolverines',
      score: { team1: 14, team2: 10 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'OSU', odds: '-120' }, { label: 'MICH', odds: '+100' }] },
        { title: 'Spread', options: [{ label: 'OSU -2.5', odds: '-110' }, { label: 'MICH +2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 48.5', odds: '-110' }, { label: 'U 48.5', odds: '-110' }] },
      ]
    },
    // CFL Live
    {
      id: 711,
      league: 'CFL',
      country: 'Canada',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q3',
      elapsedSeconds: 1800,
      isLive: true,
      team1: 'Toronto Argonauts',
      team2: 'BC Lions',
      score: { team1: 17, team2: 14 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'TOR', odds: '-130' }, { label: 'BC', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'TOR -2.5', odds: '-110' }, { label: 'BC +2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 44.5', odds: '-110' }, { label: 'U 44.5', odds: '-110' }] },
      ]
    },
    // XFL Live
    {
      id: 721,
      league: 'XFL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q2',
      elapsedSeconds: 900,
      isLive: true,
      team1: 'Houston Roughnecks',
      team2: 'St. Louis Battlehawks',
      score: { team1: 10, team2: 7 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'HOU', odds: '-140' }, { label: 'STL', odds: '+120' }] },
        { title: 'Spread', options: [{ label: 'HOU -3.5', odds: '-110' }, { label: 'STL +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 41.5', odds: '-110' }, { label: 'U 41.5', odds: '-110' }] },
      ]
    },
    // USFL Live
    {
      id: 731,
      league: 'USFL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q1',
      elapsedSeconds: 300,
      isLive: true,
      team1: 'Birmingham Stallions',
      team2: 'Michigan Panthers',
      score: { team1: 3, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'BIR', odds: '-160' }, { label: 'MIC', odds: '+140' }] },
        { title: 'Spread', options: [{ label: 'BIR -4.5', odds: '-110' }, { label: 'MIC +4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 38.5', odds: '-110' }, { label: 'U 38.5', odds: '-110' }] },
      ]
    },
    // WNBA Live
    {
      id: 741,
      league: 'WNBA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/nba.svg',
      startTime: 'Q3',
      elapsedSeconds: 1200,
      isLive: true,
      team1: 'Las Vegas Aces',
      team2: 'New York Liberty',
      score: { team1: 56, team2: 52 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'LVA', odds: '-140' }, { label: 'NYL', odds: '+120' }] },
        { title: 'Spread', options: [{ label: 'LVA -3.5', odds: '-110' }, { label: 'NYL +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 168.5', odds: '-110' }, { label: 'U 168.5', odds: '-110' }] },
      ]
    },
    // NCAAB Live
    {
      id: 751,
      league: 'NCAAB',
      country: 'USA',
      leagueIcon: '/banners/sports_league/nba.svg',
      startTime: 'H2',
      elapsedSeconds: 1500,
      isLive: true,
      team1: 'Duke Blue Devils',
      team2: 'UNC Tar Heels',
      score: { team1: 62, team2: 58 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'DUKE', odds: '-150' }, { label: 'UNC', odds: '+130' }] },
        { title: 'Spread', options: [{ label: 'DUKE -3.5', odds: '-110' }, { label: 'UNC +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 148.5', odds: '-110' }, { label: 'U 148.5', odds: '-110' }] },
      ]
    },
    // EuroLeague Live
    {
      id: 761,
      league: 'EuroLeague',
      country: 'Europe',
      leagueIcon: '/banners/sports_league/nba.svg',
      startTime: 'Q3',
      elapsedSeconds: 1200,
      isLive: true,
      team1: 'Real Madrid',
      team2: 'FC Barcelona',
      score: { team1: 58, team2: 55 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'RMA', odds: '-130' }, { label: 'BAR', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'RMA -2.5', odds: '-110' }, { label: 'BAR +2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 158.5', odds: '-110' }, { label: 'U 158.5', odds: '-110' }] },
      ]
    },
    // NPB Live
    {
      id: 771,
      league: 'NPB',
      country: 'Japan',
      leagueIcon: '/banners/sports_league/MLB.svg',
      startTime: 'T6',
      elapsedSeconds: 0,
      isLive: true,
      team1: 'Yomiuri Giants',
      team2: 'Hanshin Tigers',
      score: { team1: 3, team2: 2 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'YOM', odds: '-130' }, { label: 'HAN', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'YOM -1.5', odds: '+140' }, { label: 'HAN +1.5', odds: '-160' }] },
        { title: 'Total', options: [{ label: 'O 7.5', odds: '-110' }, { label: 'U 7.5', odds: '-110' }] },
      ]
    },
    // KBO Live
    {
      id: 781,
      league: 'KBO',
      country: 'South Korea',
      leagueIcon: '/banners/sports_league/MLB.svg',
      startTime: 'T4',
      elapsedSeconds: 0,
      isLive: true,
      team1: 'Samsung Lions',
      team2: 'KIA Tigers',
      score: { team1: 2, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'SAM', odds: '+110' }, { label: 'KIA', odds: '-130' }] },
        { title: 'Spread', options: [{ label: 'SAM +1.5', odds: '-180' }, { label: 'KIA -1.5', odds: '+155' }] },
        { title: 'Total', options: [{ label: 'O 8.5', odds: '-110' }, { label: 'U 8.5', odds: '-110' }] },
      ]
    },
    // Copa America Live
    {
      id: 791,
      league: 'Copa America',
      country: 'South America',
      leagueIcon: '/banners/sports_league/copa.svg',
      startTime: 'H2',
      elapsedSeconds: 3600,
      isLive: true,
      team1: 'Argentina',
      team2: 'Brazil',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'ARG', odds: '-120' }, { label: 'Tie', odds: '+260' }, { label: 'BRA', odds: '+280' }] },
        { title: 'Spread', options: [{ label: 'ARG -0.5', odds: '-110' }, { label: 'BRA +0.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+100' }, { label: 'U 2.5', odds: '-120' }] },
      ]
    },
    // Ligue 1 Live
    {
      id: 801,
      league: 'Ligue 1',
      country: 'France',
      leagueIcon: '/banners/sports_league/prem.svg',
      startTime: 'H1',
      elapsedSeconds: 1200,
      isLive: true,
      team1: 'PSG',
      team2: 'Marseille',
      score: { team1: 2, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'PSG', odds: '-250' }, { label: 'Tie', odds: '+350' }, { label: 'OM', odds: '+600' }] },
        { title: 'Spread', options: [{ label: 'PSG -1.5', odds: '-120' }, { label: 'OM +1.5', odds: '+100' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // UFC Live
    {
      id: 811,
      league: 'UFC',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'R3',
      elapsedSeconds: 600,
      isLive: true,
      team1: 'Jon Jones',
      team2: 'Stipe Miocic',
      score: { team1: 2, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Jones', odds: '-300' }, { label: 'Miocic', odds: '+250' }] },
        { title: 'Method', options: [{ label: 'KO/TKO', odds: '+150' }, { label: 'Decision', odds: '-130' }] },
        { title: 'Total Rounds', options: [{ label: 'O 2.5', odds: '-140' }, { label: 'U 2.5', odds: '+120' }] },
      ]
    },
    // Bellator Live
    {
      id: 821,
      league: 'Bellator',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'R2',
      elapsedSeconds: 300,
      isLive: true,
      team1: 'Patricio Pitbull',
      team2: 'AJ McKee',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Pitbull', odds: '+140' }, { label: 'McKee', odds: '-160' }] },
        { title: 'Method', options: [{ label: 'KO/TKO', odds: '+200' }, { label: 'Decision', odds: '-110' }] },
        { title: 'Total Rounds', options: [{ label: 'O 2.5', odds: '-120' }, { label: 'U 2.5', odds: '+100' }] },
      ]
    },
    // PFL Live
    {
      id: 831,
      league: 'PFL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'R1',
      elapsedSeconds: 120,
      isLive: true,
      team1: 'Kayla Harrison',
      team2: 'Larissa Pacheco',
      score: { team1: 0, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Harrison', odds: '-200' }, { label: 'Pacheco', odds: '+170' }] },
        { title: 'Method', options: [{ label: 'KO/TKO', odds: '+250' }, { label: 'Decision', odds: '-150' }] },
        { title: 'Total Rounds', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
      ]
    },
    // ATP Tour Live
    {
      id: 841,
      league: 'ATP Tour',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      startTime: 'Set 2',
      elapsedSeconds: 3600,
      isLive: true,
      team1: 'Novak Djokovic',
      team2: 'Carlos Alcaraz',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Djokovic', odds: '+120' }, { label: 'Alcaraz', odds: '-140' }] },
        { title: 'Set Spread', options: [{ label: 'Djokovic +1.5', odds: '-200' }, { label: 'Alcaraz -1.5', odds: '+170' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // WTA Tour Live
    {
      id: 851,
      league: 'WTA Tour',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      startTime: 'Set 1',
      elapsedSeconds: 1800,
      isLive: true,
      team1: 'Iga Swiatek',
      team2: 'Aryna Sabalenka',
      score: { team1: 0, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Swiatek', odds: '-130' }, { label: 'Sabalenka', odds: '+110' }] },
        { title: 'Set Spread', options: [{ label: 'Swiatek -1.5', odds: '+140' }, { label: 'Sabalenka +1.5', odds: '-160' }] },
        { title: 'Total Sets', options: [{ label: 'O 2.5', odds: '+130' }, { label: 'U 2.5', odds: '-150' }] },
      ]
    },
    // Six Nations Live
    {
      id: 861,
      league: 'Six Nations',
      country: 'Europe',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'H2',
      elapsedSeconds: 2400,
      isLive: true,
      team1: 'England',
      team2: 'Ireland',
      score: { team1: 14, team2: 21 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'ENG', odds: '+200' }, { label: 'IRE', odds: '-240' }] },
        { title: 'Spread', options: [{ label: 'ENG +7.5', odds: '-110' }, { label: 'IRE -7.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 42.5', odds: '-110' }, { label: 'U 42.5', odds: '-110' }] },
      ]
    },
    // Super Rugby Live
    {
      id: 871,
      league: 'Super Rugby',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'H1',
      elapsedSeconds: 1200,
      isLive: true,
      team1: 'Crusaders',
      team2: 'Blues',
      score: { team1: 10, team2: 7 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'CRU', odds: '-130' }, { label: 'BLU', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'CRU -3.5', odds: '-110' }, { label: 'BLU +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 45.5', odds: '-110' }, { label: 'U 45.5', odds: '-110' }] },
      ]
    },
    // Grand Slams Live
    {
      id: 881,
      league: 'Grand Slams',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      startTime: 'Set 3',
      elapsedSeconds: 5400,
      isLive: true,
      team1: 'Jannik Sinner',
      team2: 'Alexander Zverev',
      score: { team1: 1, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Sinner', odds: '-160' }, { label: 'Zverev', odds: '+140' }] },
        { title: 'Set Spread', options: [{ label: 'Sinner -1.5', odds: '+100' }, { label: 'Zverev +1.5', odds: '-120' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-130' }, { label: 'U 3.5', odds: '+110' }] },
      ]
    },
    // Davis Cup Live
    {
      id: 891,
      league: 'Davis Cup',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      startTime: 'Set 2',
      elapsedSeconds: 3000,
      isLive: true,
      team1: 'Italy',
      team2: 'Spain',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'ITA', odds: '-150' }, { label: 'ESP', odds: '+130' }] },
        { title: 'Set Spread', options: [{ label: 'ITA -1.5', odds: '+110' }, { label: 'ESP +1.5', odds: '-130' }] },
        { title: 'Total Sets', options: [{ label: 'O 2.5', odds: '+120' }, { label: 'U 2.5', odds: '-140' }] },
      ]
    },
    // ITF Live
    {
      id: 901,
      league: 'ITF',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      startTime: 'Set 1',
      elapsedSeconds: 900,
      isLive: true,
      team1: 'Player A',
      team2: 'Player B',
      score: { team1: 0, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Pl. A', odds: '-120' }, { label: 'Pl. B', odds: '+100' }] },
        { title: 'Total Sets', options: [{ label: 'O 2.5', odds: '+140' }, { label: 'U 2.5', odds: '-160' }] },
      ]
    },
    // WTT Champions Live
    {
      id: 911,
      league: 'WTT Champions',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'G4',
      elapsedSeconds: 1200,
      isLive: true,
      team1: 'Fan Zhendong',
      team2: 'Ma Long',
      score: { team1: 2, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Fan', odds: '-140' }, { label: 'Ma', odds: '+120' }] },
        { title: 'Total Games', options: [{ label: 'O 4.5', odds: '-110' }, { label: 'U 4.5', odds: '-110' }] },
      ]
    },
    // ITTF World Tour Live
    {
      id: 921,
      league: 'ITTF World Tour',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'G3',
      elapsedSeconds: 900,
      isLive: true,
      team1: 'Wang Chuqin',
      team2: 'Lin Yun-Ju',
      score: { team1: 1, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Wang', odds: '-130' }, { label: 'Lin', odds: '+110' }] },
        { title: 'Total Games', options: [{ label: 'O 4.5', odds: '-120' }, { label: 'U 4.5', odds: '+100' }] },
      ]
    },
    // T2 Diamond Live
    {
      id: 931,
      league: 'T2 Diamond',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'G2',
      elapsedSeconds: 600,
      isLive: true,
      team1: 'Tomokazu Harimoto',
      team2: 'Hugo Calderano',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Harimoto', odds: '-160' }, { label: 'Calderano', odds: '+140' }] },
        { title: 'Total Games', options: [{ label: 'O 4.5', odds: '+100' }, { label: 'U 4.5', odds: '-120' }] },
      ]
    },
    // FIVB Live
    {
      id: 941,
      league: 'FIVB',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Set 3',
      elapsedSeconds: 3600,
      isLive: true,
      team1: 'Brazil',
      team2: 'Poland',
      score: { team1: 1, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'BRA', odds: '-120' }, { label: 'POL', odds: '+100' }] },
        { title: 'Set Spread', options: [{ label: 'BRA -1.5', odds: '+130' }, { label: 'POL +1.5', odds: '-150' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // CEV Live
    {
      id: 951,
      league: 'CEV',
      country: 'Europe',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Set 2',
      elapsedSeconds: 2400,
      isLive: true,
      team1: 'Italy',
      team2: 'Serbia',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'ITA', odds: '-150' }, { label: 'SRB', odds: '+130' }] },
        { title: 'Set Spread', options: [{ label: 'ITA -1.5', odds: '-110' }, { label: 'SRB +1.5', odds: '-110' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '+110' }, { label: 'U 3.5', odds: '-130' }] },
      ]
    },
    // Serie A1 Live
    {
      id: 961,
      league: 'Serie A1',
      country: 'Italy',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Set 3',
      elapsedSeconds: 3000,
      isLive: true,
      team1: 'Perugia',
      team2: 'Trentino',
      score: { team1: 2, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'PER', odds: '-250' }, { label: 'TRE', odds: '+210' }] },
        { title: 'Set Spread', options: [{ label: 'PER -2.5', odds: '+100' }, { label: 'TRE +2.5', odds: '-120' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '+130' }, { label: 'U 3.5', odds: '-150' }] },
      ]
    },
    // Superliga Live
    {
      id: 971,
      league: 'Superliga',
      country: 'Brazil',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Set 2',
      elapsedSeconds: 1800,
      isLive: true,
      team1: 'Sada Cruzeiro',
      team2: 'Funvic Taubate',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'CRU', odds: '-180' }, { label: 'TAU', odds: '+160' }] },
        { title: 'Set Spread', options: [{ label: 'CRU -1.5', odds: '-120' }, { label: 'TAU +1.5', odds: '+100' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // LFA Live
    {
      id: 981,
      league: 'LFA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'R2',
      elapsedSeconds: 300,
      isLive: true,
      team1: 'Fighter A',
      team2: 'Fighter B',
      score: { team1: 1, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Fig. A', odds: '-140' }, { label: 'Fig. B', odds: '+120' }] },
        { title: 'Total Rounds', options: [{ label: 'O 2.5', odds: '-120' }, { label: 'U 2.5', odds: '+100' }] },
      ]
    },
    // ONE Championship Live
    {
      id: 991,
      league: 'ONE Championship',
      country: 'Asia',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'R3',
      elapsedSeconds: 600,
      isLive: true,
      team1: 'Stamp Fairtex',
      team2: 'Angela Lee',
      score: { team1: 2, team2: 0 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Stamp', odds: '-200' }, { label: 'Lee', odds: '+170' }] },
        { title: 'Total Rounds', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // Premiership (Rugby) Live
    {
      id: 1001,
      league: 'Premiership',
      country: 'England',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'H2',
      elapsedSeconds: 3000,
      isLive: true,
      team1: 'Saracens',
      team2: 'Harlequins',
      score: { team1: 21, team2: 14 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'SAR', odds: '-160' }, { label: 'HAR', odds: '+140' }] },
        { title: 'Spread', options: [{ label: 'SAR -5.5', odds: '-110' }, { label: 'HAR +5.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 40.5', odds: '-110' }, { label: 'U 40.5', odds: '-110' }] },
      ]
    },
    // Top 14 Live
    {
      id: 1011,
      league: 'Top 14',
      country: 'France',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'H1',
      elapsedSeconds: 1500,
      isLive: true,
      team1: 'Toulouse',
      team2: 'La Rochelle',
      score: { team1: 14, team2: 7 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'TOU', odds: '-180' }, { label: 'LR', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'TOU -7.5', odds: '-110' }, { label: 'LR +7.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 38.5', odds: '-110' }, { label: 'U 38.5', odds: '-110' }] },
      ]
    },
    // Rugby World Cup Live
    {
      id: 1021,
      league: 'Rugby World Cup',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'H2',
      elapsedSeconds: 3600,
      isLive: true,
      team1: 'New Zealand',
      team2: 'South Africa',
      score: { team1: 17, team2: 21 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'NZL', odds: '+150' }, { label: 'RSA', odds: '-170' }] },
        { title: 'Spread', options: [{ label: 'NZL +3.5', odds: '-110' }, { label: 'RSA -3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 44.5', odds: '-110' }, { label: 'U 44.5', odds: '-110' }] },
      ]
    },
    // PLL Live
    {
      id: 1031,
      league: 'PLL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q3',
      elapsedSeconds: 1500,
      isLive: true,
      team1: 'Waterdogs LC',
      team2: 'Chaos LC',
      score: { team1: 8, team2: 6 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'WAT', odds: '-150' }, { label: 'CHA', odds: '+130' }] },
        { title: 'Spread', options: [{ label: 'WAT -2.5', odds: '-110' }, { label: 'CHA +2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 20.5', odds: '-110' }, { label: 'U 20.5', odds: '-110' }] },
      ]
    },
    // NLL Live
    {
      id: 1041,
      league: 'NLL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q2',
      elapsedSeconds: 720,
      isLive: true,
      team1: 'Buffalo Bandits',
      team2: 'Toronto Rock',
      score: { team1: 5, team2: 4 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'BUF', odds: '-130' }, { label: 'TOR', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'BUF -1.5', odds: '-110' }, { label: 'TOR +1.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 22.5', odds: '-110' }, { label: 'U 22.5', odds: '-110' }] },
      ]
    },
    // NCAA (Lacrosse) Live
    {
      id: 1051,
      league: 'NCAA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q3',
      elapsedSeconds: 1200,
      isLive: true,
      team1: 'Virginia Cavaliers',
      team2: 'Maryland Terrapins',
      score: { team1: 7, team2: 5 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'UVA', odds: '-160' }, { label: 'UMD', odds: '+140' }] },
        { title: 'Spread', options: [{ label: 'UVA -2.5', odds: '-110' }, { label: 'UMD +2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 18.5', odds: '-110' }, { label: 'U 18.5', odds: '-110' }] },
      ]
    },
    // World Championship (Lacrosse) Live
    {
      id: 1061,
      league: 'World Championship',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Q2',
      elapsedSeconds: 900,
      isLive: true,
      team1: 'USA',
      team2: 'Canada',
      score: { team1: 4, team2: 3 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'USA', odds: '-130' }, { label: 'CAN', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'USA -1.5', odds: '-110' }, { label: 'CAN +1.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 16.5', odds: '-110' }, { label: 'U 16.5', odds: '-110' }] },
      ]
    },
    // WPA Live
    {
      id: 1071,
      league: 'WPA',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'R3',
      elapsedSeconds: 0,
      isLive: true,
      team1: 'Shane Van Boening',
      team2: 'Francisco Sanchez Ruiz',
      score: { team1: 5, team2: 4 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'SVB', odds: '-150' }, { label: 'FSR', odds: '+130' }] },
        { title: 'Total Racks', options: [{ label: 'O 9.5', odds: '-110' }, { label: 'U 9.5', odds: '-110' }] },
      ]
    },
    // Mosconi Cup Live
    {
      id: 1081,
      league: 'Mosconi Cup',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'Match 3',
      elapsedSeconds: 0,
      isLive: true,
      team1: 'Team Europe',
      team2: 'Team USA',
      score: { team1: 2, team2: 1 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'EUR', odds: '-130' }, { label: 'USA', odds: '+110' }] },
        { title: 'Total Matches', options: [{ label: 'O 8.5', odds: '-120' }, { label: 'U 8.5', odds: '+100' }] },
      ]
    },
    // US Open (Pool) Live
    {
      id: 1091,
      league: 'US Open',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'QF',
      elapsedSeconds: 0,
      isLive: true,
      team1: 'Jayson Shaw',
      team2: 'Oscar Dominguez',
      score: { team1: 7, team2: 5 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Shaw', odds: '-170' }, { label: 'Dominguez', odds: '+150' }] },
        { title: 'Total Racks', options: [{ label: 'O 12.5', odds: '-110' }, { label: 'U 12.5', odds: '-110' }] },
      ]
    },
    // World Pool Masters Live
    {
      id: 1101,
      league: 'World Pool Masters',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      startTime: 'SF',
      elapsedSeconds: 0,
      isLive: true,
      team1: 'Albin Ouschan',
      team2: 'Joshua Filler',
      score: { team1: 4, team2: 3 },
      markets: [
        { title: 'Moneyline', options: [{ label: 'Ouschan', odds: '+110' }, { label: 'Filler', odds: '-130' }] },
        { title: 'Total Racks', options: [{ label: 'O 8.5', odds: '-110' }, { label: 'U 8.5', odds: '-110' }] },
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
      league: 'Premier League', 
      country: 'England',
      leagueIcon: '/banners/sports_league/prem.svg',
      time: 'Today 15:00', 
      team1: 'Manchester City', 
      team2: 'Aston Villa', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'MCI', odds: '-250' }, { label: 'Tie', odds: '+350' }, { label: 'AVL', odds: '+600' }] },
        { title: 'Spread', options: [{ label: 'MCI -1.5', odds: '-110' }, { label: 'AVL +1.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 3.5', odds: '-120' }, { label: 'U 3.5', odds: '+100' }] },
        { title: '1H Moneyline', options: [{ label: 'MCI', odds: '-200' }, { label: 'Tie', odds: '+300' }, { label: 'AVL', odds: '+500' }] },
        { title: '1H Spread', options: [{ label: 'MCI -0.5', odds: '-130' }, { label: 'AVL +0.5', odds: '+110' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-140' }, { label: 'U 1.5', odds: '+120' }] },
      ]
    },
    { 
      id: 203, 
      league: 'Premier League', 
      country: 'England',
      leagueIcon: '/banners/sports_league/prem.svg',
      time: 'Today 17:30', 
      team1: 'Manchester United', 
      team2: 'Brighton', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'MUN', odds: '+120' }, { label: 'Tie', odds: '+250' }, { label: 'BHA', odds: '+230' }] },
        { title: 'Spread', options: [{ label: 'MUN -0.5', odds: '-110' }, { label: 'BHA +0.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-115' }, { label: 'U 2.5', odds: '-105' }] },
        { title: '1H Moneyline', options: [{ label: 'MUN', odds: '+140' }, { label: 'Tie', odds: '+230' }, { label: 'BHA', odds: '+240' }] },
        { title: '1H Spread', options: [{ label: 'MUN -0.5', odds: '-105' }, { label: 'BHA +0.5', odds: '-115' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-125' }, { label: 'U 1.5', odds: '+105' }] },
      ]
    },
    { 
      id: 204, 
      league: 'Premier League', 
      country: 'England',
      leagueIcon: '/banners/sports_league/prem.svg',
      time: 'Tomorrow 12:30', 
      team1: 'West Ham', 
      team2: 'Crystal Palace', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'WHU', odds: '+140' }, { label: 'Tie', odds: '+240' }, { label: 'CRY', odds: '+210' }] },
        { title: 'Spread', options: [{ label: 'WHU -0.5', odds: '+110' }, { label: 'CRY +0.5', odds: '-130' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
        { title: '1H Moneyline', options: [{ label: 'WHU', odds: '+160' }, { label: 'Tie', odds: '+220' }, { label: 'CRY', odds: '+220' }] },
        { title: '1H Spread', options: [{ label: 'WHU -0.5', odds: '+120' }, { label: 'CRY +0.5', odds: '-140' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-130' }, { label: 'U 1.5', odds: '+110' }] },
      ]
    },
    { 
      id: 205, 
      league: 'Premier League', 
      country: 'England',
      leagueIcon: '/banners/sports_league/prem.svg',
      time: 'Tomorrow 15:00', 
      team1: 'Everton', 
      team2: 'Wolves', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'EVE', odds: '+150' }, { label: 'Tie', odds: '+230' }, { label: 'WOL', odds: '+200' }] },
        { title: 'Spread', options: [{ label: 'EVE -0.5', odds: '+120' }, { label: 'WOL +0.5', odds: '-140' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+100' }, { label: 'U 2.5', odds: '-120' }] },
        { title: '1H Moneyline', options: [{ label: 'EVE', odds: '+170' }, { label: 'Tie', odds: '+210' }, { label: 'WOL', odds: '+210' }] },
        { title: '1H Spread', options: [{ label: 'EVE -0.5', odds: '+130' }, { label: 'WOL +0.5', odds: '-150' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-120' }, { label: 'U 1.5', odds: '+100' }] },
      ]
    },
    { 
      id: 5, 
      league: 'La Liga', 
      country: 'Spain',
      leagueIcon: '/banners/sports_league/laliga.svg',
      time: 'Today 15:00', 
      team1: 'Atletico Madrid', 
      team2: 'Sevilla', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'ATM', odds: '-170' }, { label: 'Tie', odds: '+290' }, { label: 'SEV', odds: '+400' }] },
        { title: 'Spread', options: [{ label: 'ATM -1.5', odds: '+120' }, { label: 'SEV +1.5', odds: '-140' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
        { title: '1H Moneyline', options: [{ label: 'ATM', odds: '-140' }, { label: 'Tie', odds: '+270' }, { label: 'SEV', odds: '+350' }] },
        { title: '1H Spread', options: [{ label: 'ATM -0.5', odds: '-110' }, { label: 'SEV +0.5', odds: '-110' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-130' }, { label: 'U 1.5', odds: '+110' }] },
      ]
    },
    { 
      id: 6, 
      league: 'Champions League', 
      country: 'Europe',
      leagueIcon: '/banners/sports_league/champions.svg',
      time: 'Today 17:30', 
      team1: 'Real Madrid', 
      team2: 'Manchester City', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'RMA', odds: '+130' }, { label: 'Tie', odds: '+240' }, { label: 'MCI', odds: '+200' }] },
        { title: 'Spread', options: [{ label: 'RMA -0.5', odds: '+110' }, { label: 'MCI +0.5', odds: '-130' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-120' }, { label: 'U 2.5', odds: '+100' }] },
        { title: '1H Moneyline', options: [{ label: 'RMA', odds: '+150' }, { label: 'Tie', odds: '+220' }, { label: 'MCI', odds: '+220' }] },
        { title: '1H Spread', options: [{ label: 'RMA -0.5', odds: '+120' }, { label: 'MCI +0.5', odds: '-140' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-130' }, { label: 'U 1.5', odds: '+110' }] },
      ]
    },
    { 
      id: 7, 
      league: 'Serie A', 
      country: 'Italy',
      leagueIcon: '/team/Italy - Serie A/serie A.svg',
      time: 'Today 17:30', 
      team1: 'Inter Milan', 
      team2: 'Napoli', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'INT', odds: '-130' }, { label: 'Tie', odds: '+260' }, { label: 'NAP', odds: '+320' }] },
        { title: 'Spread', options: [{ label: 'INT -0.5', odds: '-120' }, { label: 'NAP +0.5', odds: '+100' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-105' }, { label: 'U 2.5', odds: '-115' }] },
        { title: '1H Moneyline', options: [{ label: 'INT', odds: '-110' }, { label: 'Tie', odds: '+240' }, { label: 'NAP', odds: '+300' }] },
        { title: '1H Spread', options: [{ label: 'INT -0.5', odds: '-110' }, { label: 'NAP +0.5', odds: '-110' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-130' }, { label: 'U 1.5', odds: '+110' }] },
      ]
    },
    { 
      id: 8, 
      league: 'MLS', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/mls.svg',
      time: 'Today 20:00', 
      team1: 'Inter Miami', 
      team2: 'LA Galaxy', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'MIA', odds: '-110' }, { label: 'Tie', odds: '+260' }, { label: 'LAG', odds: '+280' }] },
        { title: 'Spread', options: [{ label: 'MIA -0.5', odds: '-105' }, { label: 'LAG +0.5', odds: '-115' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-115' }, { label: 'U 2.5', odds: '-105' }] },
        { title: '1H Moneyline', options: [{ label: 'MIA', odds: '+100' }, { label: 'Tie', odds: '+240' }, { label: 'LAG', odds: '+260' }] },
        { title: '1H Spread', options: [{ label: 'MIA -0.5', odds: '+100' }, { label: 'LAG +0.5', odds: '-120' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-130' }, { label: 'U 1.5', odds: '+110' }] },
      ]
    },
    // NFL Upcoming Events
    { 
      id: 104, 
      league: 'NFL', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Today 10:30 PM', 
      team1: 'Seattle Seahawks', 
      team2: 'Kansas City Chiefs', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'SEA', odds: '+160' }, { label: 'KC', odds: '+140' }] },
        { title: 'Total', options: [{ label: 'O 46.5', odds: '-110' }, { label: 'U 46.5', odds: '-110' }] },
        { title: 'Spread', options: [{ label: 'SEA +3.5', odds: '-110' }, { label: 'KC -3.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'SEA', odds: '+170' }, { label: 'KC', odds: '+150' }] },
      ]
    },
    { 
      id: 105, 
      league: 'NFL', 
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'In 59min', 
      team1: 'Indianapolis Colts', 
      team2: 'Green Bay Packers', 
      markets: [
        { title: 'Moneyline', options: [{ label: 'IND', odds: '+145' }, { label: 'GB', odds: '+125' }] },
        { title: 'Total', options: [{ label: 'O 44.5', odds: '-110' }, { label: 'U 44.5', odds: '-110' }] },
        { title: 'Spread', options: [{ label: 'IND +2.5', odds: '-110' }, { label: 'GB -2.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'IND', odds: '+155' }, { label: 'GB', odds: '+135' }] },
      ]
    },
    // Bundesliga Upcoming
    {
      id: 305,
      league: 'Bundesliga',
      country: 'Germany',
      leagueIcon: '/banners/sports_league/prem.svg',
      time: 'Tomorrow 14:30',
      team1: 'Eintracht Frankfurt',
      team2: 'Wolfsburg',
      markets: [
        { title: 'Moneyline', options: [{ label: 'SGE', odds: '-120' }, { label: 'Tie', odds: '+260' }, { label: 'WOB', odds: '+310' }] },
        { title: 'Spread', options: [{ label: 'SGE -0.5', odds: '-110' }, { label: 'WOB +0.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-115' }, { label: 'U 2.5', odds: '-105' }] },
        { title: '1H Moneyline', options: [{ label: 'SGE', odds: '-100' }, { label: 'Tie', odds: '+240' }, { label: 'WOB', odds: '+290' }] },
        { title: '1H Spread', options: [{ label: 'SGE -0.5', odds: '+100' }, { label: 'WOB +0.5', odds: '-120' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-120' }, { label: 'U 1.5', odds: '+100' }] },
      ]
    },
    {
      id: 306,
      league: 'Bundesliga',
      country: 'Germany',
      leagueIcon: '/banners/sports_league/prem.svg',
      time: 'Tomorrow 17:00',
      team1: 'Freiburg',
      team2: 'Stuttgart',
      markets: [
        { title: 'Moneyline', options: [{ label: 'FRE', odds: '+160' }, { label: 'Tie', odds: '+240' }, { label: 'STU', odds: '+190' }] },
        { title: 'Spread', options: [{ label: 'FRE +0.5', odds: '-130' }, { label: 'STU -0.5', odds: '+110' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
        { title: '1H Moneyline', options: [{ label: 'FRE', odds: '+180' }, { label: 'Tie', odds: '+220' }, { label: 'STU', odds: '+200' }] },
        { title: '1H Spread', options: [{ label: 'FRE +0.5', odds: '-120' }, { label: 'STU -0.5', odds: '+100' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-125' }, { label: 'U 1.5', odds: '+105' }] },
      ]
    },
    // NBA Upcoming
    {
      id: 403,
      league: 'NBA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/nba.svg',
      time: 'Today 9:00 PM',
      team1: 'Phoenix Suns',
      team2: 'Denver Nuggets',
      markets: [
        { title: 'Moneyline', options: [{ label: 'PHX', odds: '+150' }, { label: 'DEN', odds: '-170' }] },
        { title: 'Spread', options: [{ label: 'PHX +4.5', odds: '-110' }, { label: 'DEN -4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 226.5', odds: '-110' }, { label: 'U 226.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'PHX', odds: '+160' }, { label: 'DEN', odds: '-180' }] },
      ]
    },
    {
      id: 404,
      league: 'NBA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/nba.svg',
      time: 'Tomorrow 7:30 PM',
      team1: 'Dallas Mavericks',
      team2: 'Miami Heat',
      markets: [
        { title: 'Moneyline', options: [{ label: 'DAL', odds: '-140' }, { label: 'MIA', odds: '+120' }] },
        { title: 'Spread', options: [{ label: 'DAL -3.5', odds: '-110' }, { label: 'MIA +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 215.5', odds: '-110' }, { label: 'U 215.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'DAL', odds: '-130' }, { label: 'MIA', odds: '+110' }] },
      ]
    },
    // MLB Upcoming
    {
      id: 503,
      league: 'MLB',
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      time: 'Today 7:10 PM',
      team1: 'Chicago Cubs',
      team2: 'San Francisco Giants',
      markets: [
        { title: 'Moneyline', options: [{ label: 'CHC', odds: '+110' }, { label: 'SF', odds: '-130' }] },
        { title: 'Spread', options: [{ label: 'CHC +1.5', odds: '-160' }, { label: 'SF -1.5', odds: '+140' }] },
        { title: 'Total', options: [{ label: 'O 8.5', odds: '-105' }, { label: 'U 8.5', odds: '-115' }] },
        { title: 'First Half Moneyline', options: [{ label: 'CHC', odds: '+120' }, { label: 'SF', odds: '-140' }] },
      ]
    },
    {
      id: 504,
      league: 'MLB',
      country: 'USA',
      leagueIcon: '/banners/sports_league/MLB.svg',
      time: 'Tomorrow 1:05 PM',
      team1: 'Boston Red Sox',
      team2: 'Philadelphia Phillies',
      markets: [
        { title: 'Moneyline', options: [{ label: 'BOS', odds: '+135' }, { label: 'PHI', odds: '-155' }] },
        { title: 'Spread', options: [{ label: 'BOS +1.5', odds: '-170' }, { label: 'PHI -1.5', odds: '+145' }] },
        { title: 'Total', options: [{ label: 'O 9.5', odds: '-110' }, { label: 'U 9.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'BOS', odds: '+145' }, { label: 'PHI', odds: '-165' }] },
      ]
    },
    // NHL Upcoming
    {
      id: 603,
      league: 'NHL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NHL.svg',
      time: 'Today 8:00 PM',
      team1: 'NY Rangers',
      team2: 'Tampa Bay Lightning',
      markets: [
        { title: 'Moneyline', options: [{ label: 'NYR', odds: '-130' }, { label: 'TBL', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'NYR -1.5', odds: '+160' }, { label: 'TBL +1.5', odds: '-180' }] },
        { title: 'Total', options: [{ label: 'O 6.5', odds: '-105' }, { label: 'U 6.5', odds: '-115' }] },
        { title: 'First Half Moneyline', options: [{ label: 'NYR', odds: '-120' }, { label: 'TBL', odds: '+100' }] },
      ]
    },
    {
      id: 604,
      league: 'NHL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NHL.svg',
      time: 'Tomorrow 7:00 PM',
      team1: 'Vegas Golden Knights',
      team2: 'Carolina Hurricanes',
      markets: [
        { title: 'Moneyline', options: [{ label: 'VGK', odds: '+105' }, { label: 'CAR', odds: '-125' }] },
        { title: 'Spread', options: [{ label: 'VGK +1.5', odds: '-190' }, { label: 'CAR -1.5', odds: '+165' }] },
        { title: 'Total', options: [{ label: 'O 5.5', odds: '-110' }, { label: 'U 5.5', odds: '-110' }] },
        { title: 'First Half Moneyline', options: [{ label: 'VGK', odds: '+115' }, { label: 'CAR', odds: '-135' }] },
      ]
    },
    // Champions League Upcoming
    {
      id: 307,
      league: 'Champions League',
      country: 'Europe',
      leagueIcon: '/banners/sports_league/champions.svg',
      time: 'Tomorrow 20:00',
      team1: 'Liverpool',
      team2: 'Inter Milan',
      markets: [
        { title: 'Moneyline', options: [{ label: 'LIV', odds: '-130' }, { label: 'Tie', odds: '+260' }, { label: 'INT', odds: '+320' }] },
        { title: 'Spread', options: [{ label: 'LIV -0.5', odds: '-120' }, { label: 'INT +0.5', odds: '+100' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
        { title: '1H Moneyline', options: [{ label: 'LIV', odds: '-110' }, { label: 'Tie', odds: '+240' }, { label: 'INT', odds: '+300' }] },
        { title: '1H Spread', options: [{ label: 'LIV -0.5', odds: '-110' }, { label: 'INT +0.5', odds: '-110' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-125' }, { label: 'U 1.5', odds: '+105' }] },
      ]
    },
    // MLS Upcoming (additional)
    {
      id: 308,
      league: 'MLS',
      country: 'USA',
      leagueIcon: '/banners/sports_league/mls.svg',
      time: 'Tomorrow 19:30',
      team1: 'NYCFC',
      team2: 'Atlanta United',
      markets: [
        { title: 'Moneyline', options: [{ label: 'NYC', odds: '+120' }, { label: 'Tie', odds: '+240' }, { label: 'ATL', odds: '+230' }] },
        { title: 'Spread', options: [{ label: 'NYC -0.5', odds: '+100' }, { label: 'ATL +0.5', odds: '-120' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
        { title: '1H Moneyline', options: [{ label: 'NYC', odds: '+140' }, { label: 'Tie', odds: '+220' }, { label: 'ATL', odds: '+240' }] },
        { title: '1H Spread', options: [{ label: 'NYC -0.5', odds: '+110' }, { label: 'ATL +0.5', odds: '-130' }] },
        { title: '1H Total', options: [{ label: 'O 1.5', odds: '-120' }, { label: 'U 1.5', odds: '+100' }] },
      ]
    },
    // NCAAF Upcoming
    {
      id: 710,
      league: 'NCAAF',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 15:30',
      team1: 'Texas Longhorns',
      team2: 'Oklahoma Sooners',
      markets: [
        { title: 'Moneyline', options: [{ label: 'TEX', odds: '-140' }, { label: 'OU', odds: '+120' }] },
        { title: 'Spread', options: [{ label: 'TEX -3.5', odds: '-110' }, { label: 'OU +3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 56.5', odds: '-110' }, { label: 'U 56.5', odds: '-110' }] },
      ]
    },
    // CFL Upcoming
    {
      id: 712,
      league: 'CFL',
      country: 'Canada',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 19:00',
      team1: 'Winnipeg Blue Bombers',
      team2: 'Montreal Alouettes',
      markets: [
        { title: 'Moneyline', options: [{ label: 'WPG', odds: '+110' }, { label: 'MTL', odds: '-130' }] },
        { title: 'Spread', options: [{ label: 'WPG +2.5', odds: '-110' }, { label: 'MTL -2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 46.5', odds: '-110' }, { label: 'U 46.5', odds: '-110' }] },
      ]
    },
    // XFL Upcoming
    {
      id: 722,
      league: 'XFL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Sunday 14:00',
      team1: 'Arlington Renegades',
      team2: 'DC Defenders',
      markets: [
        { title: 'Moneyline', options: [{ label: 'ARL', odds: '+130' }, { label: 'DC', odds: '-150' }] },
        { title: 'Spread', options: [{ label: 'ARL +3.5', odds: '-110' }, { label: 'DC -3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 39.5', odds: '-110' }, { label: 'U 39.5', odds: '-110' }] },
      ]
    },
    // USFL Upcoming
    {
      id: 732,
      league: 'USFL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Sunday 16:00',
      team1: 'Memphis Showboats',
      team2: 'Houston Gamblers',
      markets: [
        { title: 'Moneyline', options: [{ label: 'MEM', odds: '-120' }, { label: 'HOU', odds: '+100' }] },
        { title: 'Spread', options: [{ label: 'MEM -2.5', odds: '-110' }, { label: 'HOU +2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 42.5', odds: '-110' }, { label: 'U 42.5', odds: '-110' }] },
      ]
    },
    // WNBA Upcoming
    {
      id: 742,
      league: 'WNBA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/nba.svg',
      time: 'Tomorrow 19:30',
      team1: 'Seattle Storm',
      team2: 'Connecticut Sun',
      markets: [
        { title: 'Moneyline', options: [{ label: 'SEA', odds: '+120' }, { label: 'CON', odds: '-140' }] },
        { title: 'Spread', options: [{ label: 'SEA +3.5', odds: '-110' }, { label: 'CON -3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 162.5', odds: '-110' }, { label: 'U 162.5', odds: '-110' }] },
      ]
    },
    // NCAAB Upcoming
    {
      id: 752,
      league: 'NCAAB',
      country: 'USA',
      leagueIcon: '/banners/sports_league/nba.svg',
      time: 'Tomorrow 21:00',
      team1: 'Kansas Jayhawks',
      team2: 'Kentucky Wildcats',
      markets: [
        { title: 'Moneyline', options: [{ label: 'KU', odds: '-130' }, { label: 'UK', odds: '+110' }] },
        { title: 'Spread', options: [{ label: 'KU -2.5', odds: '-110' }, { label: 'UK +2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 146.5', odds: '-110' }, { label: 'U 146.5', odds: '-110' }] },
      ]
    },
    // EuroLeague Upcoming
    {
      id: 762,
      league: 'EuroLeague',
      country: 'Europe',
      leagueIcon: '/banners/sports_league/nba.svg',
      time: 'Tomorrow 20:00',
      team1: 'Olympiacos',
      team2: 'Panathinaikos',
      markets: [
        { title: 'Moneyline', options: [{ label: 'OLY', odds: '+110' }, { label: 'PAN', odds: '-130' }] },
        { title: 'Spread', options: [{ label: 'OLY +2.5', odds: '-110' }, { label: 'PAN -2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 158.5', odds: '-110' }, { label: 'U 158.5', odds: '-110' }] },
      ]
    },
    // NPB Upcoming
    {
      id: 772,
      league: 'NPB',
      country: 'Japan',
      leagueIcon: '/banners/sports_league/MLB.svg',
      time: 'Tomorrow 05:00',
      team1: 'Fukuoka SoftBank Hawks',
      team2: 'Seibu Lions',
      markets: [
        { title: 'Moneyline', options: [{ label: 'SBH', odds: '-160' }, { label: 'SEI', odds: '+140' }] },
        { title: 'Spread', options: [{ label: 'SBH -1.5', odds: '+110' }, { label: 'SEI +1.5', odds: '-130' }] },
        { title: 'Total', options: [{ label: 'O 7.5', odds: '-110' }, { label: 'U 7.5', odds: '-110' }] },
      ]
    },
    // KBO Upcoming
    {
      id: 782,
      league: 'KBO',
      country: 'South Korea',
      leagueIcon: '/banners/sports_league/MLB.svg',
      time: 'Tomorrow 04:30',
      team1: 'LG Twins',
      team2: 'Doosan Bears',
      markets: [
        { title: 'Moneyline', options: [{ label: 'LG', odds: '-140' }, { label: 'DOO', odds: '+120' }] },
        { title: 'Spread', options: [{ label: 'LG -1.5', odds: '+130' }, { label: 'DOO +1.5', odds: '-150' }] },
        { title: 'Total', options: [{ label: 'O 8.5', odds: '-110' }, { label: 'U 8.5', odds: '-110' }] },
      ]
    },
    // Copa America Upcoming
    {
      id: 792,
      league: 'Copa America',
      country: 'South America',
      leagueIcon: '/banners/sports_league/copa.svg',
      time: 'Tomorrow 20:00',
      team1: 'Uruguay',
      team2: 'Colombia',
      markets: [
        { title: 'Moneyline', options: [{ label: 'URU', odds: '-110' }, { label: 'Tie', odds: '+240' }, { label: 'COL', odds: '+280' }] },
        { title: 'Spread', options: [{ label: 'URU -0.5', odds: '+100' }, { label: 'COL +0.5', odds: '-120' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '+100' }, { label: 'U 2.5', odds: '-120' }] },
      ]
    },
    // Ligue 1 Upcoming
    {
      id: 802,
      league: 'Ligue 1',
      country: 'France',
      leagueIcon: '/banners/sports_league/prem.svg',
      time: 'Saturday 21:00',
      team1: 'Lyon',
      team2: 'Monaco',
      markets: [
        { title: 'Moneyline', options: [{ label: 'LYO', odds: '+180' }, { label: 'Tie', odds: '+240' }, { label: 'MON', odds: '+150' }] },
        { title: 'Spread', options: [{ label: 'LYO +0.5', odds: '-130' }, { label: 'MON -0.5', odds: '+110' }] },
        { title: 'Total', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
      ]
    },
    // UFC Upcoming
    {
      id: 812,
      league: 'UFC',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 22:00',
      team1: 'Islam Makhachev',
      team2: 'Charles Oliveira',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Makhachev', odds: '-200' }, { label: 'Oliveira', odds: '+170' }] },
        { title: 'Method', options: [{ label: 'KO/TKO', odds: '+200' }, { label: 'Submission', odds: '+150' }] },
        { title: 'Total Rounds', options: [{ label: 'O 3.5', odds: '-130' }, { label: 'U 3.5', odds: '+110' }] },
      ]
    },
    // Bellator Upcoming
    {
      id: 822,
      league: 'Bellator',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Friday 21:00',
      team1: 'Usman Nurmagomedov',
      team2: 'Benson Henderson',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Nurm.', odds: '-250' }, { label: 'Henderson', odds: '+210' }] },
        { title: 'Total Rounds', options: [{ label: 'O 2.5', odds: '-130' }, { label: 'U 2.5', odds: '+110' }] },
      ]
    },
    // PFL Upcoming
    {
      id: 832,
      league: 'PFL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Friday 19:00',
      team1: 'Ray Cooper III',
      team2: 'Magomed Magomedkerimov',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Cooper', odds: '+140' }, { label: 'Magomed.', odds: '-160' }] },
        { title: 'Total Rounds', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
      ]
    },
    // ATP Tour Upcoming
    {
      id: 842,
      league: 'ATP Tour',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      time: 'Tomorrow 13:00',
      team1: 'Daniil Medvedev',
      team2: 'Stefanos Tsitsipas',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Med.', odds: '-130' }, { label: 'Tsit.', odds: '+110' }] },
        { title: 'Set Spread', options: [{ label: 'Med. -1.5', odds: '+130' }, { label: 'Tsit. +1.5', odds: '-150' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '+100' }, { label: 'U 3.5', odds: '-120' }] },
      ]
    },
    // WTA Tour Upcoming
    {
      id: 852,
      league: 'WTA Tour',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      time: 'Tomorrow 11:00',
      team1: 'Coco Gauff',
      team2: 'Elena Rybakina',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Gauff', odds: '+110' }, { label: 'Rybakina', odds: '-130' }] },
        { title: 'Set Spread', options: [{ label: 'Gauff +1.5', odds: '-180' }, { label: 'Ryb. -1.5', odds: '+155' }] },
        { title: 'Total Sets', options: [{ label: 'O 2.5', odds: '+120' }, { label: 'U 2.5', odds: '-140' }] },
      ]
    },
    // Grand Slams Upcoming
    {
      id: 882,
      league: 'Grand Slams',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      time: 'Saturday 09:00',
      team1: 'Carlos Alcaraz',
      team2: 'Daniil Medvedev',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Alcaraz', odds: '-160' }, { label: 'Med.', odds: '+140' }] },
        { title: 'Set Spread', options: [{ label: 'Alcaraz -1.5', odds: '+100' }, { label: 'Med. +1.5', odds: '-120' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-120' }, { label: 'U 3.5', odds: '+100' }] },
      ]
    },
    // Davis Cup Upcoming
    {
      id: 892,
      league: 'Davis Cup',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      time: 'Saturday 14:00',
      team1: 'Australia',
      team2: 'Canada',
      markets: [
        { title: 'Moneyline', options: [{ label: 'AUS', odds: '-120' }, { label: 'CAN', odds: '+100' }] },
        { title: 'Total Matches', options: [{ label: 'O 3.5', odds: '+120' }, { label: 'U 3.5', odds: '-140' }] },
      ]
    },
    // ITF Upcoming
    {
      id: 902,
      league: 'ITF',
      country: 'World',
      leagueIcon: '/banners/sports_league/ATP.svg',
      time: 'Tomorrow 10:00',
      team1: 'Player C',
      team2: 'Player D',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Pl. C', odds: '-110' }, { label: 'Pl. D', odds: '-110' }] },
        { title: 'Total Sets', options: [{ label: 'O 2.5', odds: '+130' }, { label: 'U 2.5', odds: '-150' }] },
      ]
    },
    // Six Nations Upcoming
    {
      id: 862,
      league: 'Six Nations',
      country: 'Europe',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 14:15',
      team1: 'France',
      team2: 'Wales',
      markets: [
        { title: 'Moneyline', options: [{ label: 'FRA', odds: '-300' }, { label: 'WAL', odds: '+250' }] },
        { title: 'Spread', options: [{ label: 'FRA -10.5', odds: '-110' }, { label: 'WAL +10.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 38.5', odds: '-110' }, { label: 'U 38.5', odds: '-110' }] },
      ]
    },
    // Super Rugby Upcoming
    {
      id: 872,
      league: 'Super Rugby',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Friday 07:05',
      team1: 'Hurricanes',
      team2: 'Chiefs',
      markets: [
        { title: 'Moneyline', options: [{ label: 'HUR', odds: '+140' }, { label: 'CHI', odds: '-160' }] },
        { title: 'Spread', options: [{ label: 'HUR +4.5', odds: '-110' }, { label: 'CHI -4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 48.5', odds: '-110' }, { label: 'U 48.5', odds: '-110' }] },
      ]
    },
    // Premiership (Rugby) Upcoming
    {
      id: 1002,
      league: 'Premiership',
      country: 'England',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 15:00',
      team1: 'Leicester Tigers',
      team2: 'Bath Rugby',
      markets: [
        { title: 'Moneyline', options: [{ label: 'LEI', odds: '+120' }, { label: 'BAT', odds: '-140' }] },
        { title: 'Spread', options: [{ label: 'LEI +3.5', odds: '-110' }, { label: 'BAT -3.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 42.5', odds: '-110' }, { label: 'U 42.5', odds: '-110' }] },
      ]
    },
    // Top 14 Upcoming
    {
      id: 1012,
      league: 'Top 14',
      country: 'France',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 21:05',
      team1: 'Racing 92',
      team2: 'Stade Francais',
      markets: [
        { title: 'Moneyline', options: [{ label: 'R92', odds: '-180' }, { label: 'STF', odds: '+160' }] },
        { title: 'Spread', options: [{ label: 'R92 -6.5', odds: '-110' }, { label: 'STF +6.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 40.5', odds: '-110' }, { label: 'U 40.5', odds: '-110' }] },
      ]
    },
    // Rugby World Cup Upcoming
    {
      id: 1022,
      league: 'Rugby World Cup',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 17:00',
      team1: 'Australia',
      team2: 'France',
      markets: [
        { title: 'Moneyline', options: [{ label: 'AUS', odds: '+180' }, { label: 'FRA', odds: '-200' }] },
        { title: 'Spread', options: [{ label: 'AUS +5.5', odds: '-110' }, { label: 'FRA -5.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 40.5', odds: '-110' }, { label: 'U 40.5', odds: '-110' }] },
      ]
    },
    // WTT Champions Upcoming
    {
      id: 912,
      league: 'WTT Champions',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Tomorrow 06:00',
      team1: 'Liang Jingkun',
      team2: 'Dimitrij Ovtcharov',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Liang', odds: '-180' }, { label: 'Ovtcharov', odds: '+160' }] },
        { title: 'Total Games', options: [{ label: 'O 4.5', odds: '-110' }, { label: 'U 4.5', odds: '-110' }] },
      ]
    },
    // ITTF World Tour Upcoming
    {
      id: 922,
      league: 'ITTF World Tour',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Tomorrow 07:00',
      team1: 'Tomokazu Harimoto',
      team2: 'Hugo Calderano',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Harimoto', odds: '-150' }, { label: 'Calderano', odds: '+130' }] },
        { title: 'Total Games', options: [{ label: 'O 4.5', odds: '+100' }, { label: 'U 4.5', odds: '-120' }] },
      ]
    },
    // T2 Diamond Upcoming
    {
      id: 932,
      league: 'T2 Diamond',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Friday 08:00',
      team1: 'Wang Chuqin',
      team2: 'Fan Zhendong',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Wang', odds: '+120' }, { label: 'Fan', odds: '-140' }] },
        { title: 'Total Games', options: [{ label: 'O 4.5', odds: '-110' }, { label: 'U 4.5', odds: '-110' }] },
      ]
    },
    // FIVB Upcoming
    {
      id: 942,
      league: 'FIVB',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 12:00',
      team1: 'France',
      team2: 'Italy',
      markets: [
        { title: 'Moneyline', options: [{ label: 'FRA', odds: '+130' }, { label: 'ITA', odds: '-150' }] },
        { title: 'Set Spread', options: [{ label: 'FRA +1.5', odds: '-180' }, { label: 'ITA -1.5', odds: '+155' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // CEV Upcoming
    {
      id: 952,
      league: 'CEV',
      country: 'Europe',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 18:00',
      team1: 'Poland',
      team2: 'Turkey',
      markets: [
        { title: 'Moneyline', options: [{ label: 'POL', odds: '-130' }, { label: 'TUR', odds: '+110' }] },
        { title: 'Set Spread', options: [{ label: 'POL -1.5', odds: '+100' }, { label: 'TUR +1.5', odds: '-120' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // Serie A1 Upcoming
    {
      id: 962,
      league: 'Serie A1',
      country: 'Italy',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Sunday 17:00',
      team1: 'Modena',
      team2: 'Civitanova',
      markets: [
        { title: 'Moneyline', options: [{ label: 'MOD', odds: '+140' }, { label: 'CIV', odds: '-160' }] },
        { title: 'Set Spread', options: [{ label: 'MOD +1.5', odds: '-150' }, { label: 'CIV -1.5', odds: '+130' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // Superliga Upcoming
    {
      id: 972,
      league: 'Superliga',
      country: 'Brazil',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 22:00',
      team1: 'Minas',
      team2: 'SESI',
      markets: [
        { title: 'Moneyline', options: [{ label: 'MIN', odds: '-120' }, { label: 'SESI', odds: '+100' }] },
        { title: 'Set Spread', options: [{ label: 'MIN -1.5', odds: '+110' }, { label: 'SESI +1.5', odds: '-130' }] },
        { title: 'Total Sets', options: [{ label: 'O 3.5', odds: '-110' }, { label: 'U 3.5', odds: '-110' }] },
      ]
    },
    // LFA Upcoming
    {
      id: 982,
      league: 'LFA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Friday 20:00',
      team1: 'Fighter C',
      team2: 'Fighter D',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Fig. C', odds: '-130' }, { label: 'Fig. D', odds: '+110' }] },
        { title: 'Total Rounds', options: [{ label: 'O 2.5', odds: '-110' }, { label: 'U 2.5', odds: '-110' }] },
      ]
    },
    // ONE Championship Upcoming
    {
      id: 992,
      league: 'ONE Championship',
      country: 'Asia',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Friday 08:30',
      team1: 'Christian Lee',
      team2: 'Ok Rae Yoon',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Lee', odds: '-180' }, { label: 'Yoon', odds: '+160' }] },
        { title: 'Total Rounds', options: [{ label: 'O 3.5', odds: '-120' }, { label: 'U 3.5', odds: '+100' }] },
      ]
    },
    // PLL Upcoming
    {
      id: 1032,
      league: 'PLL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 13:00',
      team1: 'Archers LC',
      team2: 'Atlas LC',
      markets: [
        { title: 'Moneyline', options: [{ label: 'ARC', odds: '+110' }, { label: 'ATL', odds: '-130' }] },
        { title: 'Spread', options: [{ label: 'ARC +1.5', odds: '-110' }, { label: 'ATL -1.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 22.5', odds: '-110' }, { label: 'U 22.5', odds: '-110' }] },
      ]
    },
    // NLL Upcoming
    {
      id: 1042,
      league: 'NLL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 19:00',
      team1: 'Philadelphia Wings',
      team2: 'Georgia Swarm',
      markets: [
        { title: 'Moneyline', options: [{ label: 'PHI', odds: '+130' }, { label: 'GEO', odds: '-150' }] },
        { title: 'Spread', options: [{ label: 'PHI +2.5', odds: '-110' }, { label: 'GEO -2.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 24.5', odds: '-110' }, { label: 'U 24.5', odds: '-110' }] },
      ]
    },
    // NCAA (Lacrosse) Upcoming
    {
      id: 1052,
      league: 'NCAA',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 12:00',
      team1: 'Duke Blue Devils',
      team2: 'Syracuse Orange',
      markets: [
        { title: 'Moneyline', options: [{ label: 'DUKE', odds: '-140' }, { label: 'SYR', odds: '+120' }] },
        { title: 'Spread', options: [{ label: 'DUKE -1.5', odds: '-110' }, { label: 'SYR +1.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 20.5', odds: '-110' }, { label: 'U 20.5', odds: '-110' }] },
      ]
    },
    // World Championship (Lacrosse) Upcoming
    {
      id: 1062,
      league: 'World Championship',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Sunday 15:00',
      team1: 'Australia',
      team2: 'Japan',
      markets: [
        { title: 'Moneyline', options: [{ label: 'AUS', odds: '-250' }, { label: 'JPN', odds: '+210' }] },
        { title: 'Spread', options: [{ label: 'AUS -4.5', odds: '-110' }, { label: 'JPN +4.5', odds: '-110' }] },
        { title: 'Total', options: [{ label: 'O 18.5', odds: '-110' }, { label: 'U 18.5', odds: '-110' }] },
      ]
    },
    // WPA Upcoming
    {
      id: 1072,
      league: 'WPA',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Sunday 12:00',
      team1: 'Efren Reyes',
      team2: 'Earl Strickland',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Reyes', odds: '-140' }, { label: 'Strickland', odds: '+120' }] },
        { title: 'Total Racks', options: [{ label: 'O 10.5', odds: '-110' }, { label: 'U 10.5', odds: '-110' }] },
      ]
    },
    // Mosconi Cup Upcoming
    {
      id: 1082,
      league: 'Mosconi Cup',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 20:00',
      team1: 'Team USA',
      team2: 'Team Europe',
      markets: [
        { title: 'Moneyline', options: [{ label: 'USA', odds: '+140' }, { label: 'EUR', odds: '-160' }] },
        { title: 'Total Matches', options: [{ label: 'O 9.5', odds: '-110' }, { label: 'U 9.5', odds: '-110' }] },
      ]
    },
    // US Open (Pool) Upcoming
    {
      id: 1092,
      league: 'US Open',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Saturday 15:00',
      team1: 'Mike Dechaine',
      team2: 'Skyler Woodward',
      markets: [
        { title: 'Moneyline', options: [{ label: 'Dechaine', odds: '+110' }, { label: 'Woodward', odds: '-130' }] },
        { title: 'Total Racks', options: [{ label: 'O 11.5', odds: '-110' }, { label: 'U 11.5', odds: '-110' }] },
      ]
    },
    // World Pool Masters Upcoming
    {
      id: 1102,
      league: 'World Pool Masters',
      country: 'World',
      leagueIcon: '/banners/sports_league/NFL.svg',
      time: 'Sunday 14:00',
      team1: 'Shane Van Boening',
      team2: 'Jayson Shaw',
      markets: [
        { title: 'Moneyline', options: [{ label: 'SVB', odds: '-120' }, { label: 'Shaw', odds: '+100' }] },
        { title: 'Total Racks', options: [{ label: 'O 9.5', odds: '-110' }, { label: 'U 9.5', odds: '-110' }] },
      ]
    },
  ]

  // Filter events based on active sport - My Feed shows all events
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
            >
              DONE
            </button>
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
                                {typeof item.icon === 'string' ? <img src={item.icon} alt={item.label} className="w-4 h-4 object-contain" /> : <IconComp strokeWidth={1.5} className="w-4 h-4" />}
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
                                  {typeof sport.icon === 'string' ? <img src={sport.icon} alt={sport.label} className="w-5 h-5 object-contain" /> : <IconComp strokeWidth={1.5} className="w-5 h-5" />}
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
                                {typeof sport.icon === 'string' ? <img src={sport.icon} alt={sport.label} className="w-5 h-5 object-contain" /> : <IconComp strokeWidth={1.5} className="w-5 h-5" />}
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
                              {typeof sport.icon === 'string' ? <img src={sport.icon} alt={sport.label} className="w-5 h-5 object-contain" /> : <IconComp strokeWidth={1.5} className="w-5 h-5" />}
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
      <SidebarInset className="bg-[#1a1a1a] text-white overflow-x-clip" style={{ width: 'auto', flex: '1 1 0%', minWidth: 0, maxWidth: '100%' }}>
        <div className={cn("pt-0 pb-4", isMobile ? "px-1" : "px-5")}>
          {/* My Feed - Breadcrumbs */}
          <div className="flex items-center gap-2 mb-4 -mt-1 overflow-visible">
            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push('/sports')
              }} 
              className="p-1 hover:bg-white/5 rounded cursor-pointer transition-colors"
            >
              <IconChevronLeft className="w-4 h-4 text-white/70" />
            </button>
            <span className="text-sm text-white/70">Sports</span>
            <span className="text-white/50">/</span>
            <div className="flex items-center gap-1.5">
              <IconHeart className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span className="text-sm text-white font-medium">My Feed</span>
            </div>
            {!showOnboarding && (() => {
              const leagueMatchMap: { [slug: string]: string } = {
                'premier-league': 'Premier League', 'la-liga': 'La Liga', 'champions-league': 'Champions League',
                'mls': 'MLS', 'serie-a': 'Serie A', 'bundesliga': 'Bundesliga',
                'nfl': 'NFL', 'nba': 'NBA', 'mlb': 'MLB', 'nhl': 'NHL',
                'ncaaf': 'NCAAF', 'cfl': 'CFL', 'xfl': 'XFL', 'usfl': 'USFL',
                'wnba': 'WNBA', 'ncaab': 'NCAAB', 'euroleague': 'EuroLeague',
                'npb': 'NPB', 'kbo': 'KBO',
                'copa-america': 'Copa America', 'ligue-1': 'Ligue 1',
                'ufc': 'UFC', 'bellator': 'Bellator', 'pfl': 'PFL', 'lfa': 'LFA', 'one-championship': 'ONE Championship',
                'atp-tour': 'ATP Tour', 'wta-tour': 'WTA Tour', 'grand-slams': 'Grand Slams', 'davis-cup': 'Davis Cup', 'itf': 'ITF',
                'wtt-champions': 'WTT Champions', 'ittf-world-tour': 'ITTF World Tour', 't2-diamond': 'T2 Diamond',
                'fivb': 'FIVB', 'cev': 'CEV', 'serie-a1': 'Serie A1', 'superliga': 'Superliga',
                'six-nations': 'Six Nations', 'super-rugby': 'Super Rugby', 'premiership': 'Premiership', 'top-14': 'Top 14', 'rugby-world-cup': 'Rugby World Cup',
                'pll': 'PLL', 'nll': 'NLL', 'ncaa': 'NCAA', 'world-championship': 'World Championship',
                'wpa': 'WPA', 'mosconi-cup': 'Mosconi Cup', 'us-open': 'US Open', 'world-pool-masters': 'World Pool Masters',
              }
              const activeCount = favoriteLeagues.filter(slug => {
                const match = leagueMatchMap[slug]
                if (!match) return false
                return liveEvents.some(e => e.league === match) || upcomingEvents.some(e => e.league === match)
              }).length
              return activeCount > 0 ? (
                <span className="text-white/40 text-xs ml-2">({activeCount} league{activeCount !== 1 ? 's' : ''})</span>
              ) : null
            })()}
            
            {/* Desktop only: View toggle + Export (hidden during onboarding) */}
            <div className={cn(
              "hidden md:flex items-center gap-2 ml-auto overflow-visible",
              (favoriteLeagues.length === 0 || showOnboarding) && "!hidden"
            )}>
              {/* Normal Mode / Pro Mode toggle */}
              <div className="flex items-center gap-1 overflow-visible">
                <button
                  onClick={() => setViewMode('compact')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                    viewMode === 'compact'
                      ? "bg-white/10 text-white shadow-sm border border-white/20"
                      : "text-white/50 hover:text-white/70 hover:bg-white/5"
                  )}
                >
                  <IconLayoutRows className="w-3.5 h-3.5" />
                  Normal Mode
                </button>
                <button
                  onClick={() => setViewMode('pro')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                    viewMode === 'pro'
                      ? "bg-white/10 text-white shadow-sm border border-white/20"
                      : "text-white/50 hover:text-white/70 hover:bg-white/5"
                  )}
                >
                  <IconLayoutList className="w-3.5 h-3.5" />
                  Pro Mode
                </button>
              </div>

              {/* Export button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200">
                    <IconFileSpreadsheet className="w-3.5 h-3.5" />
                    Export
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#2d2d2d] border-white/10 min-w-[140px]">
                  <DropdownMenuItem
                    onClick={() => {
                      // Export to CSV
                      const rows: string[] = ['League,Event,Type,Time,Team 1,Team 2,Score,Market,Selection,Odds']
                      
                      const allLeagueData = [
                        { slug: 'premier-league', name: 'Premier League', leagueMatch: 'Premier League' },
                        { slug: 'la-liga', name: 'La Liga', leagueMatch: 'La Liga' },
                        { slug: 'champions-league', name: 'Champions League', leagueMatch: 'Champions League' },
                        { slug: 'mls', name: 'MLS', leagueMatch: 'MLS' },
                        { slug: 'serie-a', name: 'Serie A', leagueMatch: 'Serie A' },
                        { slug: 'bundesliga', name: 'Bundesliga', leagueMatch: 'Bundesliga' },
                        { slug: 'nfl', name: 'NFL', leagueMatch: 'NFL' },
                        { slug: 'nba', name: 'NBA', leagueMatch: 'NBA' },
                        { slug: 'mlb', name: 'MLB', leagueMatch: 'MLB' },
                        { slug: 'nhl', name: 'NHL', leagueMatch: 'NHL' },
                        { slug: 'ncaaf', name: 'NCAAF', leagueMatch: 'NCAAF' },
                        { slug: 'cfl', name: 'CFL', leagueMatch: 'CFL' },
                        { slug: 'xfl', name: 'XFL', leagueMatch: 'XFL' },
                        { slug: 'usfl', name: 'USFL', leagueMatch: 'USFL' },
                        { slug: 'wnba', name: 'WNBA', leagueMatch: 'WNBA' },
                        { slug: 'ncaab', name: 'NCAAB', leagueMatch: 'NCAAB' },
                        { slug: 'euroleague', name: 'EuroLeague', leagueMatch: 'EuroLeague' },
                        { slug: 'npb', name: 'NPB', leagueMatch: 'NPB' },
                        { slug: 'kbo', name: 'KBO', leagueMatch: 'KBO' },
                        { slug: 'copa-america', name: 'Copa America', leagueMatch: 'Copa America' },
                        { slug: 'ligue-1', name: 'Ligue 1', leagueMatch: 'Ligue 1' },
                        { slug: 'ufc', name: 'UFC', leagueMatch: 'UFC' },
                        { slug: 'bellator', name: 'Bellator', leagueMatch: 'Bellator' },
                        { slug: 'pfl', name: 'PFL', leagueMatch: 'PFL' },
                        { slug: 'lfa', name: 'LFA', leagueMatch: 'LFA' },
                        { slug: 'one-championship', name: 'ONE Championship', leagueMatch: 'ONE Championship' },
                        { slug: 'atp-tour', name: 'ATP Tour', leagueMatch: 'ATP Tour' },
                        { slug: 'wta-tour', name: 'WTA Tour', leagueMatch: 'WTA Tour' },
                        { slug: 'grand-slams', name: 'Grand Slams', leagueMatch: 'Grand Slams' },
                        { slug: 'davis-cup', name: 'Davis Cup', leagueMatch: 'Davis Cup' },
                        { slug: 'itf', name: 'ITF', leagueMatch: 'ITF' },
                        { slug: 'wtt-champions', name: 'WTT Champions', leagueMatch: 'WTT Champions' },
                        { slug: 'ittf-world-tour', name: 'ITTF World Tour', leagueMatch: 'ITTF World Tour' },
                        { slug: 't2-diamond', name: 'T2 Diamond', leagueMatch: 'T2 Diamond' },
                        { slug: 'fivb', name: 'FIVB', leagueMatch: 'FIVB' },
                        { slug: 'cev', name: 'CEV', leagueMatch: 'CEV' },
                        { slug: 'serie-a1', name: 'Serie A1', leagueMatch: 'Serie A1' },
                        { slug: 'superliga', name: 'Superliga', leagueMatch: 'Superliga' },
                        { slug: 'six-nations', name: 'Six Nations', leagueMatch: 'Six Nations' },
                        { slug: 'super-rugby', name: 'Super Rugby', leagueMatch: 'Super Rugby' },
                        { slug: 'premiership', name: 'Premiership', leagueMatch: 'Premiership' },
                        { slug: 'top-14', name: 'Top 14', leagueMatch: 'Top 14' },
                        { slug: 'rugby-world-cup', name: 'Rugby World Cup', leagueMatch: 'Rugby World Cup' },
                        { slug: 'pll', name: 'PLL', leagueMatch: 'PLL' },
                        { slug: 'nll', name: 'NLL', leagueMatch: 'NLL' },
                        { slug: 'ncaa', name: 'NCAA', leagueMatch: 'NCAA' },
                        { slug: 'world-championship', name: 'World Championship', leagueMatch: 'World Championship' },
                        { slug: 'wpa', name: 'WPA', leagueMatch: 'WPA' },
                        { slug: 'mosconi-cup', name: 'Mosconi Cup', leagueMatch: 'Mosconi Cup' },
                        { slug: 'us-open', name: 'US Open', leagueMatch: 'US Open' },
                        { slug: 'world-pool-masters', name: 'World Pool Masters', leagueMatch: 'World Pool Masters' },
                      ]

                      favoriteLeagues.forEach(slug => {
                        const league = allLeagueData.find(l => l.slug === slug)
                        if (!league) return

                        // Live events
                        liveEvents.filter(e => e.league === league.leagueMatch).forEach(event => {
                          const score = liveScores[event.id] || event.score
                          const scoreStr = score ? `${score.team1} - ${score.team2}` : ''
                          event.markets.forEach(market => {
                            market.options.forEach(opt => {
                              rows.push(`"${league.name}","${event.team1} vs ${event.team2}","Live","${event.startTime}","${event.team1}","${event.team2}","${scoreStr}","${market.title}","${opt.label}","${opt.odds}"`)
                            })
                          })
                        })

                        // Upcoming events
                        upcomingEvents.filter(e => e.league === league.leagueMatch).forEach(event => {
                          event.markets.forEach(market => {
                            market.options.forEach(opt => {
                              rows.push(`"${league.name}","${event.team1} vs ${event.team2}","Upcoming","${event.time}","${event.team1}","${event.team2}","","${market.title}","${opt.label}","${opt.odds}"`)
                            })
                          })
                        })
                      })

                      const csv = rows.join('\n')
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `my-feed-${new Date().toISOString().split('T')[0]}.csv`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer text-xs"
                  >
                    <IconFileSpreadsheet className="w-4 h-4 mr-2" />
                    Export CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      // Export to Excel (TSV with .xls extension for Excel compatibility)
                      const rows: string[] = ['League\tEvent\tType\tTime\tTeam 1\tTeam 2\tScore\tMarket\tSelection\tOdds']
                      
                      const allLeagueData = [
                        { slug: 'premier-league', name: 'Premier League', leagueMatch: 'Premier League' },
                        { slug: 'la-liga', name: 'La Liga', leagueMatch: 'La Liga' },
                        { slug: 'champions-league', name: 'Champions League', leagueMatch: 'Champions League' },
                        { slug: 'mls', name: 'MLS', leagueMatch: 'MLS' },
                        { slug: 'serie-a', name: 'Serie A', leagueMatch: 'Serie A' },
                        { slug: 'bundesliga', name: 'Bundesliga', leagueMatch: 'Bundesliga' },
                        { slug: 'nfl', name: 'NFL', leagueMatch: 'NFL' },
                        { slug: 'nba', name: 'NBA', leagueMatch: 'NBA' },
                        { slug: 'mlb', name: 'MLB', leagueMatch: 'MLB' },
                        { slug: 'nhl', name: 'NHL', leagueMatch: 'NHL' },
                        { slug: 'ncaaf', name: 'NCAAF', leagueMatch: 'NCAAF' },
                        { slug: 'cfl', name: 'CFL', leagueMatch: 'CFL' },
                        { slug: 'xfl', name: 'XFL', leagueMatch: 'XFL' },
                        { slug: 'usfl', name: 'USFL', leagueMatch: 'USFL' },
                        { slug: 'wnba', name: 'WNBA', leagueMatch: 'WNBA' },
                        { slug: 'ncaab', name: 'NCAAB', leagueMatch: 'NCAAB' },
                        { slug: 'euroleague', name: 'EuroLeague', leagueMatch: 'EuroLeague' },
                        { slug: 'npb', name: 'NPB', leagueMatch: 'NPB' },
                        { slug: 'kbo', name: 'KBO', leagueMatch: 'KBO' },
                        { slug: 'copa-america', name: 'Copa America', leagueMatch: 'Copa America' },
                        { slug: 'ligue-1', name: 'Ligue 1', leagueMatch: 'Ligue 1' },
                        { slug: 'ufc', name: 'UFC', leagueMatch: 'UFC' },
                        { slug: 'bellator', name: 'Bellator', leagueMatch: 'Bellator' },
                        { slug: 'pfl', name: 'PFL', leagueMatch: 'PFL' },
                        { slug: 'lfa', name: 'LFA', leagueMatch: 'LFA' },
                        { slug: 'one-championship', name: 'ONE Championship', leagueMatch: 'ONE Championship' },
                        { slug: 'atp-tour', name: 'ATP Tour', leagueMatch: 'ATP Tour' },
                        { slug: 'wta-tour', name: 'WTA Tour', leagueMatch: 'WTA Tour' },
                        { slug: 'grand-slams', name: 'Grand Slams', leagueMatch: 'Grand Slams' },
                        { slug: 'davis-cup', name: 'Davis Cup', leagueMatch: 'Davis Cup' },
                        { slug: 'itf', name: 'ITF', leagueMatch: 'ITF' },
                        { slug: 'wtt-champions', name: 'WTT Champions', leagueMatch: 'WTT Champions' },
                        { slug: 'ittf-world-tour', name: 'ITTF World Tour', leagueMatch: 'ITTF World Tour' },
                        { slug: 't2-diamond', name: 'T2 Diamond', leagueMatch: 'T2 Diamond' },
                        { slug: 'fivb', name: 'FIVB', leagueMatch: 'FIVB' },
                        { slug: 'cev', name: 'CEV', leagueMatch: 'CEV' },
                        { slug: 'serie-a1', name: 'Serie A1', leagueMatch: 'Serie A1' },
                        { slug: 'superliga', name: 'Superliga', leagueMatch: 'Superliga' },
                        { slug: 'six-nations', name: 'Six Nations', leagueMatch: 'Six Nations' },
                        { slug: 'super-rugby', name: 'Super Rugby', leagueMatch: 'Super Rugby' },
                        { slug: 'premiership', name: 'Premiership', leagueMatch: 'Premiership' },
                        { slug: 'top-14', name: 'Top 14', leagueMatch: 'Top 14' },
                        { slug: 'rugby-world-cup', name: 'Rugby World Cup', leagueMatch: 'Rugby World Cup' },
                        { slug: 'pll', name: 'PLL', leagueMatch: 'PLL' },
                        { slug: 'nll', name: 'NLL', leagueMatch: 'NLL' },
                        { slug: 'ncaa', name: 'NCAA', leagueMatch: 'NCAA' },
                        { slug: 'world-championship', name: 'World Championship', leagueMatch: 'World Championship' },
                        { slug: 'wpa', name: 'WPA', leagueMatch: 'WPA' },
                        { slug: 'mosconi-cup', name: 'Mosconi Cup', leagueMatch: 'Mosconi Cup' },
                        { slug: 'us-open', name: 'US Open', leagueMatch: 'US Open' },
                        { slug: 'world-pool-masters', name: 'World Pool Masters', leagueMatch: 'World Pool Masters' },
                      ]

                      favoriteLeagues.forEach(slug => {
                        const league = allLeagueData.find(l => l.slug === slug)
                        if (!league) return

                        liveEvents.filter(e => e.league === league.leagueMatch).forEach(event => {
                          const score = liveScores[event.id] || event.score
                          const scoreStr = score ? `${score.team1} - ${score.team2}` : ''
                          event.markets.forEach(market => {
                            market.options.forEach(opt => {
                              rows.push(`${league.name}\t${event.team1} vs ${event.team2}\tLive\t${event.startTime}\t${event.team1}\t${event.team2}\t${scoreStr}\t${market.title}\t${opt.label}\t${opt.odds}`)
                            })
                          })
                        })

                        upcomingEvents.filter(e => e.league === league.leagueMatch).forEach(event => {
                          event.markets.forEach(market => {
                            market.options.forEach(opt => {
                              rows.push(`${league.name}\t${event.team1} vs ${event.team2}\tUpcoming\t${event.time}\t${event.team1}\t${event.team2}\t\t${market.title}\t${opt.label}\t${opt.odds}`)
                            })
                          })
                        })
                      })

                      const tsv = rows.join('\n')
                      const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `my-feed-${new Date().toISOString().split('T')[0]}.xls`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer text-xs"
                  >
                    <IconDownload className="w-4 h-4 mr-2" />
                    Export Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Onboarding state when no favorites (or no leagues with events) */}
          {(() => {
            // Check if any favorited league actually has events
            const leagueMatchMap: { [slug: string]: string } = {
              'premier-league': 'Premier League', 'la-liga': 'La Liga', 'champions-league': 'Champions League',
              'mls': 'MLS', 'serie-a': 'Serie A', 'bundesliga': 'Bundesliga',
              'nfl': 'NFL', 'nba': 'NBA', 'mlb': 'MLB', 'nhl': 'NHL',
              'ncaaf': 'NCAAF', 'cfl': 'CFL', 'xfl': 'XFL', 'usfl': 'USFL',
              'wnba': 'WNBA', 'ncaab': 'NCAAB', 'euroleague': 'EuroLeague',
              'npb': 'NPB', 'kbo': 'KBO',
              'copa-america': 'Copa America', 'ligue-1': 'Ligue 1',
              'ufc': 'UFC', 'bellator': 'Bellator', 'pfl': 'PFL', 'lfa': 'LFA', 'one-championship': 'ONE Championship',
              'atp-tour': 'ATP Tour', 'wta-tour': 'WTA Tour', 'grand-slams': 'Grand Slams', 'davis-cup': 'Davis Cup', 'itf': 'ITF',
              'wtt-champions': 'WTT Champions', 'ittf-world-tour': 'ITTF World Tour', 't2-diamond': 'T2 Diamond',
              'fivb': 'FIVB', 'cev': 'CEV', 'serie-a1': 'Serie A1', 'superliga': 'Superliga',
              'six-nations': 'Six Nations', 'super-rugby': 'Super Rugby', 'premiership': 'Premiership', 'top-14': 'Top 14', 'rugby-world-cup': 'Rugby World Cup',
              'pll': 'PLL', 'nll': 'NLL', 'ncaa': 'NCAA', 'world-championship': 'World Championship',
              'wpa': 'WPA', 'mosconi-cup': 'Mosconi Cup', 'us-open': 'US Open', 'world-pool-masters': 'World Pool Masters',
            }
            const hasAnyEvents = favoriteLeagues.some(slug => {
              const match = leagueMatchMap[slug]
              if (!match) return false
              return liveEvents.some(e => e.league === match) || upcomingEvents.some(e => e.league === match)
            })
            const shouldShowOnboarding = (favoriteLeagues.length === 0 || !hasAnyEvents) || showOnboarding
            if (!shouldShowOnboarding) return null

            const onboardingLeagues = [
              { slug: 'premier-league', name: 'Premier League', icon: '/banners/sports_league/prem.svg', sport: 'Soccer' },
              { slug: 'la-liga', name: 'La Liga', icon: '/banners/sports_league/laliga.svg', sport: 'Soccer' },
              { slug: 'champions-league', name: 'Champions League', icon: '/banners/sports_league/champions.svg', sport: 'Soccer' },
              { slug: 'mls', name: 'MLS', icon: '/banners/sports_league/mls.svg', sport: 'Soccer' },
              { slug: 'serie-a', name: 'Serie A', icon: '/banners/sports_league/prem.svg', sport: 'Soccer' },
              { slug: 'bundesliga', name: 'Bundesliga', icon: '/banners/sports_league/prem.svg', sport: 'Soccer' },
              { slug: 'nfl', name: 'NFL', icon: '/banners/sports_league/NFL.svg', sport: 'Football' },
              { slug: 'nba', name: 'NBA', icon: '/banners/sports_league/nba.svg', sport: 'Basketball' },
              { slug: 'mlb', name: 'MLB', icon: '/banners/sports_league/MLB.svg', sport: 'Baseball' },
              { slug: 'nhl', name: 'NHL', icon: '/banners/sports_league/NHL.svg', sport: 'Hockey' },
              { slug: 'ufc', name: 'UFC', icon: '/sports_icons/mma.svg', sport: 'MMA' },
              { slug: 'atp-tour', name: 'ATP Tour', icon: '/banners/sports_league/ATP.svg', sport: 'Tennis' },
              { slug: 'six-nations', name: 'Six Nations', icon: '/sports_icons/rugby.svg', sport: 'Rugby' },
              { slug: 'ncaaf', name: 'NCAAF', icon: '/banners/sports_league/NFL.svg', sport: 'Football' },
              { slug: 'ligue-1', name: 'Ligue 1', icon: '/banners/sports_league/prem.svg', sport: 'Soccer' },
            ]

            const toggleOnboardingSelection = (slug: string) => {
              setOnboardingSelections(prev => 
                prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
              )
            }

            const commitSelections = () => {
              if (onboardingSelections.length === 0) return
              setFavoriteLeagues(onboardingSelections)
              localStorage.setItem('favoriteLeagues', JSON.stringify(onboardingSelections))
              setOnboardingSelections([])
              setShowOnboarding(false)
            }

            return (
              <div className="flex flex-col items-center pt-8 pb-12">
                {/* Hero section */}
                <div className="relative mb-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-500/20 flex items-center justify-center mb-5 mx-auto">
                    <IconHeart className="w-10 h-10 text-pink-500" strokeWidth={1.5} />
              </div>
                  <h2 className="text-xl font-bold text-white mb-2">Build Your Feed</h2>
                  <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed">
                    Select the leagues you want to follow. All your favourite leagues will appear here in one personalised feed.
                  </p>
                </div>

                {/* League selection grid */}
                <div className="w-full max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {onboardingLeagues.map((league) => {
                      const isSelected = onboardingSelections.includes(league.slug)
                      return (
                        <button
                          key={league.slug}
                          onClick={() => toggleOnboardingSelection(league.slug)}
                          className={cn(
                            "group relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200",
                            isSelected
                              ? "bg-pink-500/10 border-pink-500/30 shadow-lg shadow-pink-500/5"
                              : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                          )}
                        >
                          {/* Check indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                              <IconCheck className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          )}
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                            isSelected ? "bg-white/10" : "bg-white/5 group-hover:bg-white/10"
                          )}>
                            <img src={league.icon} alt={league.name} width={28} height={28} className="object-contain" decoding="sync" />
                          </div>
                          <div className="text-center">
                            <span className={cn(
                              "text-xs font-semibold transition-colors block",
                              isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                            )}>
                              {league.name}
                            </span>
                            <span className="text-[10px] text-white/30 mt-0.5 block">{league.sport}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Create Feed CTA */}
                <div className="mt-8 flex flex-col items-center gap-3">
                  <button
                    onClick={commitSelections}
                    disabled={onboardingSelections.length === 0}
                    className={cn(
                      "px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                      onboardingSelections.length > 0
                        ? "bg-[#e63e3e] hover:bg-[#d13636] text-white shadow-lg shadow-red-500/20 cursor-pointer"
                        : "bg-white/5 text-white/20 cursor-not-allowed"
                    )}
                  >
                    {onboardingSelections.length === 0
                      ? 'Select leagues to continue'
                      : `Create Feed (${onboardingSelections.length} league${onboardingSelections.length !== 1 ? 's' : ''})`
                    }
                  </button>

                  {/* Cancel if editing existing feed */}
                  {favoriteLeagues.length > 0 && hasAnyEvents && showOnboarding && (
                    <button
                      onClick={() => {
                        setOnboardingSelections([])
                        setShowOnboarding(false)
                      }}
                      className="text-white/30 hover:text-white/50 text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Subtle hint */}
                <p className="text-white/30 text-xs mt-6 flex items-center gap-1.5">
                  <IconHeart className="w-3 h-3" />
                  You can also favourite leagues from any league page
                </p>
              </div>
            )
          })()}
          
          {/* League Content Sections */}
          {favoriteLeagues.length > 0 && (() => {
            const allLeagueData = [
              { slug: 'premier-league', name: 'Premier League', icon: '/banners/sports_league/prem.svg', country: 'England', gradient: 'linear-gradient(135deg, #3d1053 0%, #6b1d6e 50%, #38003c 100%)', leagueMatch: 'Premier League' },
              { slug: 'la-liga', name: 'La Liga', icon: '/banners/sports_league/laliga.svg', country: 'Spain', gradient: 'linear-gradient(135deg, #ee3524 0%, #d42e1f 50%, #b8251a 100%)', leagueMatch: 'La Liga' },
              { slug: 'champions-league', name: 'Champions League', icon: '/banners/sports_league/champions.svg', country: 'Europe', gradient: 'linear-gradient(135deg, #091442 0%, #1a237e 50%, #0d1b5e 100%)', leagueMatch: 'Champions League' },
              { slug: 'mls', name: 'MLS', icon: '/banners/sports_league/mls.svg', country: 'USA', gradient: 'linear-gradient(135deg, #1a2a1a 0%, #2d5a2d 50%, #1a3a1a 100%)', leagueMatch: 'MLS' },
              { slug: 'serie-a', name: 'Serie A', icon: '/banners/sports_league/prem.svg', country: 'Italy', gradient: 'linear-gradient(135deg, #024494 0%, #0353a4 50%, #002f6c 100%)', leagueMatch: 'Serie A' },
              { slug: 'bundesliga', name: 'Bundesliga', icon: '/banners/sports_league/prem.svg', country: 'Germany', gradient: 'linear-gradient(135deg, #c4161c 0%, #e3001b 50%, #a0131a 100%)', leagueMatch: 'Bundesliga' },
              { slug: 'nfl', name: 'NFL', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #002244 0%, #013369 50%, #001a33 100%)', leagueMatch: 'NFL' },
              { slug: 'nba', name: 'NBA', icon: '/banners/sports_league/nba.svg', country: 'USA', gradient: 'linear-gradient(135deg, #1d428a 0%, #c8102e 50%, #1d428a 100%)', leagueMatch: 'NBA' },
              { slug: 'mlb', name: 'MLB', icon: '/banners/sports_league/MLB.svg', country: 'USA', gradient: 'linear-gradient(135deg, #002d72 0%, #0a3d8f 50%, #001f4e 100%)', leagueMatch: 'MLB' },
              { slug: 'nhl', name: 'NHL', icon: '/banners/sports_league/NHL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #111111 100%)', leagueMatch: 'NHL' },
              { slug: 'ncaaf', name: 'NCAAF', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #8B0000 0%, #b22222 50%, #660000 100%)', leagueMatch: 'NCAAF' },
              { slug: 'cfl', name: 'CFL', icon: '/banners/sports_league/NFL.svg', country: 'Canada', gradient: 'linear-gradient(135deg, #c41e3a 0%, #e6273e 50%, #a0182e 100%)', leagueMatch: 'CFL' },
              { slug: 'xfl', name: 'XFL', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', leagueMatch: 'XFL' },
              { slug: 'usfl', name: 'USFL', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #002855 0%, #003f7f 50%, #001d3d 100%)', leagueMatch: 'USFL' },
              { slug: 'wnba', name: 'WNBA', icon: '/banners/sports_league/nba.svg', country: 'USA', gradient: 'linear-gradient(135deg, #ff6800 0%, #ff8c00 50%, #cc5500 100%)', leagueMatch: 'WNBA' },
              { slug: 'ncaab', name: 'NCAAB', icon: '/banners/sports_league/nba.svg', country: 'USA', gradient: 'linear-gradient(135deg, #1a3c5e 0%, #2a5f8f 50%, #0f2440 100%)', leagueMatch: 'NCAAB' },
              { slug: 'euroleague', name: 'EuroLeague', icon: '/banners/sports_league/nba.svg', country: 'Europe', gradient: 'linear-gradient(135deg, #ff5722 0%, #e64a19 50%, #bf360c 100%)', leagueMatch: 'EuroLeague' },
              { slug: 'npb', name: 'NPB', icon: '/banners/sports_league/MLB.svg', country: 'Japan', gradient: 'linear-gradient(135deg, #c41e3a 0%, #8b0000 50%, #5c0a0a 100%)', leagueMatch: 'NPB' },
              { slug: 'kbo', name: 'KBO', icon: '/banners/sports_league/MLB.svg', country: 'South Korea', gradient: 'linear-gradient(135deg, #003b5c 0%, #005a8c 50%, #00293f 100%)', leagueMatch: 'KBO' },
              { slug: 'copa-america', name: 'Copa America', icon: '/banners/sports_league/copa.svg', country: 'South America', gradient: 'linear-gradient(135deg, #1b4f72 0%, #2980b9 50%, #154360 100%)', leagueMatch: 'Copa America' },
              { slug: 'ligue-1', name: 'Ligue 1', icon: '/banners/sports_league/prem.svg', country: 'France', gradient: 'linear-gradient(135deg, #003049 0%, #0a4c73 50%, #001f30 100%)', leagueMatch: 'Ligue 1' },
              { slug: 'ufc', name: 'UFC', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #c41e3a 0%, #8b0000 50%, #5c0a0a 100%)', leagueMatch: 'UFC' },
              { slug: 'bellator', name: 'Bellator', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #444444 50%, #0d0d0d 100%)', leagueMatch: 'Bellator' },
              { slug: 'pfl', name: 'PFL', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #003366 0%, #004d99 50%, #002244 100%)', leagueMatch: 'PFL' },
              { slug: 'lfa', name: 'LFA', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #2d2d2d 0%, #4a4a4a 50%, #1a1a1a 100%)', leagueMatch: 'LFA' },
              { slug: 'one-championship', name: 'ONE Championship', icon: '/banners/sports_league/NFL.svg', country: 'Asia', gradient: 'linear-gradient(135deg, #b8860b 0%, #daa520 50%, #8b6508 100%)', leagueMatch: 'ONE Championship' },
              { slug: 'atp-tour', name: 'ATP Tour', icon: '/banners/sports_league/ATP.svg', country: 'World', gradient: 'linear-gradient(135deg, #003893 0%, #004db3 50%, #002766 100%)', leagueMatch: 'ATP Tour' },
              { slug: 'wta-tour', name: 'WTA Tour', icon: '/banners/sports_league/ATP.svg', country: 'World', gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #4a148c 100%)', leagueMatch: 'WTA Tour' },
              { slug: 'grand-slams', name: 'Grand Slams', icon: '/banners/sports_league/ATP.svg', country: 'World', gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #0d3311 100%)', leagueMatch: 'Grand Slams' },
              { slug: 'davis-cup', name: 'Davis Cup', icon: '/banners/sports_league/ATP.svg', country: 'World', gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #0d1250 100%)', leagueMatch: 'Davis Cup' },
              { slug: 'itf', name: 'ITF', icon: '/banners/sports_league/ATP.svg', country: 'World', gradient: 'linear-gradient(135deg, #37474f 0%, #546e7a 50%, #263238 100%)', leagueMatch: 'ITF' },
              { slug: 'wtt-champions', name: 'WTT Champions', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #e65100 0%, #f57c00 50%, #bf360c 100%)', leagueMatch: 'WTT Champions' },
              { slug: 'ittf-world-tour', name: 'ITTF World Tour', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #006064 0%, #00838f 50%, #004d40 100%)', leagueMatch: 'ITTF World Tour' },
              { slug: 't2-diamond', name: 'T2 Diamond', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #4e342e 0%, #6d4c41 50%, #3e2723 100%)', leagueMatch: 'T2 Diamond' },
              { slug: 'fivb', name: 'FIVB', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #f9a825 0%, #fbc02d 50%, #c79100 100%)', leagueMatch: 'FIVB' },
              { slug: 'cev', name: 'CEV', icon: '/banners/sports_league/NFL.svg', country: 'Europe', gradient: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)', leagueMatch: 'CEV' },
              { slug: 'serie-a1', name: 'Serie A1', icon: '/banners/sports_league/NFL.svg', country: 'Italy', gradient: 'linear-gradient(135deg, #024494 0%, #0353a4 50%, #002f6c 100%)', leagueMatch: 'Serie A1' },
              { slug: 'superliga', name: 'Superliga', icon: '/banners/sports_league/NFL.svg', country: 'Brazil', gradient: 'linear-gradient(135deg, #009c3b 0%, #00b843 50%, #007a2e 100%)', leagueMatch: 'Superliga' },
              { slug: 'six-nations', name: 'Six Nations', icon: '/banners/sports_league/NFL.svg', country: 'Europe', gradient: 'linear-gradient(135deg, #2e7d32 0%, #43a047 50%, #1b5e20 100%)', leagueMatch: 'Six Nations' },
              { slug: 'super-rugby', name: 'Super Rugby', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #311b92 0%, #4527a0 50%, #1a0a5c 100%)', leagueMatch: 'Super Rugby' },
              { slug: 'premiership', name: 'Premiership', icon: '/banners/sports_league/NFL.svg', country: 'England', gradient: 'linear-gradient(135deg, #3d1053 0%, #6b1d6e 50%, #2a0a3a 100%)', leagueMatch: 'Premiership' },
              { slug: 'top-14', name: 'Top 14', icon: '/banners/sports_league/NFL.svg', country: 'France', gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #08306b 100%)', leagueMatch: 'Top 14' },
              { slug: 'rugby-world-cup', name: 'Rugby World Cup', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #b8860b 0%, #daa520 50%, #8b6508 100%)', leagueMatch: 'Rugby World Cup' },
              { slug: 'pll', name: 'PLL', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #0d1250 100%)', leagueMatch: 'PLL' },
              { slug: 'nll', name: 'NLL', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 50%, #cc5900 100%)', leagueMatch: 'NLL' },
              { slug: 'ncaa', name: 'NCAA', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #08306b 100%)', leagueMatch: 'NCAA' },
              { slug: 'world-championship', name: 'World Championship', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #004d40 0%, #00695c 50%, #003329 100%)', leagueMatch: 'World Championship' },
              { slug: 'wpa', name: 'WPA', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #111111 100%)', leagueMatch: 'WPA' },
              { slug: 'mosconi-cup', name: 'Mosconi Cup', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #880e4f 0%, #ad1457 50%, #6a0a3d 100%)', leagueMatch: 'Mosconi Cup' },
              { slug: 'us-open', name: 'US Open', icon: '/banners/sports_league/NFL.svg', country: 'USA', gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #0d3311 100%)', leagueMatch: 'US Open' },
              { slug: 'world-pool-masters', name: 'World Pool Masters', icon: '/banners/sports_league/NFL.svg', country: 'World', gradient: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #38006b 100%)', leagueMatch: 'World Pool Masters' },
            ]

            // PRO VIEW - Board-style layout split by league
            if (viewMode === 'pro') {
              const americanSports = ['NFL', 'NBA', 'MLB', 'NHL']

              // Team logo helper for Pro mode
              const getProTeamLogo = (teamName: string): string | null => {
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
                  'Real Madrid': '/team/Spain - LaLiga/Real Madrid.png',
                  'Barcelona': '/team/Spain - LaLiga/FC Barcelona.png',
                  'Atletico Madrid': '/team/Spain - LaLiga/Atlético de Madrid.png',
                  'Sevilla': '/team/Spain - LaLiga/Sevilla FC.png',
                  'Juventus': '/team/Italy - Serie A/Juventus FC.png',
                  'AC Milan': '/team/Italy - Serie A/AC Milan.png',
                  'Inter Milan': '/team/Italy - Serie A/Inter Milan.png',
                  'Napoli': '/team/Italy - Serie A/SSC Napoli.png',
                  'Inter Miami': '/team/Liverpool FC.png',
                  'LA Galaxy': '/team/Manchester City.png',
                }
                return teamLogoMap[teamName] || null
              }

              // NFL team code helper for react-nfl-logos
              const getNFLCode = (teamName: string): string | null => {
                const map: { [key: string]: string } = {
                  'Alanta Falcons': 'ATL', 'Tennessee Titans': 'TEN', 'Seattle Seahawks': 'SEA',
                  'Kansas City Chiefs': 'KC', 'Indianapolis Colts': 'IND', 'Green Bay Packers': 'GB',
                  'Minnesota Vikings': 'MIN', 'New England Patriots': 'NE', 'Detroit Lions': 'DET',
                  'Miami Dolphins': 'MIA',
                }
                return map[teamName] || null
              }

              // Team badge component for Pro view
              const ProTeamBadge = ({ teamName, league }: { teamName: string; league: string }) => {
                if (americanSports.includes(league)) {
                  const code = getNFLCode(teamName)
                  if (code) {
                    const NFLComponent = (NFLIcons as any)[code]
                    if (NFLComponent) {
                      return <NFLComponent size={16} className="flex-shrink-0" />
                    }
                  }
                  return <div className="w-4 h-4 rounded-full bg-white/10 flex-shrink-0" />
                }
                const logoPath = getProTeamLogo(teamName)
                if (logoPath) {
                  return <img src={logoPath} alt={teamName} width={16} height={16} className="object-contain flex-shrink-0" decoding="sync" />
                }
                return <div className="w-4 h-4 rounded-full bg-white/10 flex-shrink-0" />
              }

              // Period options per sport type
              const getPeriodOptions = (isAmerican: boolean) => {
                if (isAmerican) {
                  return [
                    { key: 'Game', label: 'Game' },
                    { key: '1H', label: '1st Half' },
                    { key: '1Q', label: '1Q' },
                    { key: '2Q', label: '2Q' },
                    { key: '3Q', label: '3Q' },
                    { key: '4Q', label: '4Q' },
                  ]
                }
                return [
                  { key: 'Game', label: 'Game' },
                  { key: '1H', label: '1st Half' },
                ]
              }

              // Get market titles based on period and sport
              const getMarketTitles = (period: string, isAmerican: boolean) => {
                if (period === 'Game') {
                  return { moneyline: 'Moneyline', spread: 'Spread', total: 'Total' }
                }
                if (period === '1H') {
                  return isAmerican
                    ? { moneyline: 'First Half Moneyline', spread: 'First Half Spread', total: 'First Half Total' }
                    : { moneyline: '1H Moneyline', spread: '1H Spread', total: '1H Total' }
                }
                // Quarter periods (NFL)
                return { moneyline: `${period} Moneyline`, spread: `${period} Spread`, total: `${period} Total` }
              }

              // Reorder helper
              const moveLeague = (slug: string, direction: 'up' | 'down') => {
                setFavoriteLeagues(prev => {
                  const idx = prev.indexOf(slug)
                  if (idx === -1) return prev
                  const newIdx = direction === 'up' ? idx - 1 : idx + 1
                  if (newIdx < 0 || newIdx >= prev.length) return prev
                  const next = [...prev]
                  ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
                  localStorage.setItem('favoriteLeagues', JSON.stringify(next))
                  return next
                })
              }

              return (
                <div className="space-y-6 mb-8">
                  {favoriteLeagues.map((slug, leagueIndex) => {
                    const league = allLeagueData.find(l => l.slug === slug)
                    if (!league) return null

                    const leagueLive = liveEvents.filter(e => e.league === league.leagueMatch)
                    const leagueUpcoming = upcomingEvents.filter(e => e.league === league.leagueMatch)
                    if (leagueLive.length === 0 && leagueUpcoming.length === 0) return null

                    const allEvents = [
                      ...leagueLive.map(e => ({ ...e, type: 'Live' as const, time: e.startTime || '' })),
                      ...leagueUpcoming.map(e => ({ ...e, type: 'Upcoming' as const, time: (e as any).time || '' })),
                    ]
                    const isAmerican = americanSports.includes(league.leagueMatch)
                    const hasDraw = !isAmerican
                    const currentPeriod = proPeriod[slug] || 'Game'
                    const periodOptions = getPeriodOptions(isAmerican)
                    const marketTitles = getMarketTitles(currentPeriod, isAmerican)
                    const isFirst = leagueIndex === 0
                    const isLast = leagueIndex === favoriteLeagues.length - 1

                    return (
                      <div key={slug}>
                        {/* League Header with Period Selector + Reorder + Unfavorite */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] rounded-t-lg border border-white/10 border-b-0">
                          {/* Reorder arrows */}
                          <div className="flex flex-col gap-0 -my-1">
                            <button
                              onClick={() => moveLeague(slug, 'up')}
                              disabled={isFirst}
                              className={cn(
                                "p-0.5 rounded transition-colors",
                                isFirst ? "text-white/10 cursor-not-allowed" : "text-white/30 hover:text-white/70 hover:bg-white/10"
                              )}
                              title="Move up"
                            >
                              <IconChevronUp className="w-3 h-3" strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => moveLeague(slug, 'down')}
                              disabled={isLast}
                              className={cn(
                                "p-0.5 rounded transition-colors",
                                isLast ? "text-white/10 cursor-not-allowed" : "text-white/30 hover:text-white/70 hover:bg-white/10"
                              )}
                              title="Move down"
                            >
                              <IconChevronDown className="w-3 h-3" strokeWidth={2.5} />
                            </button>
                          </div>

                          <img src={league.icon} alt={league.name} width={18} height={18} className="object-contain" decoding="sync" />
                          <span className="text-sm font-semibold text-white">{league.name}</span>
                          <span className="text-[10px] text-white/40 ml-0.5">{allEvents.length} game{allEvents.length !== 1 ? 's' : ''}</span>

                          {/* Period Selector Tabs */}
                          <div className="flex items-center gap-0.5 ml-auto bg-white/[0.04] rounded-md p-0.5">
                            {periodOptions.map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() => setProPeriod(prev => ({ ...prev, [slug]: opt.key }))}
                                className={cn(
                                  "px-2 py-1 rounded text-[10px] font-medium transition-all duration-200",
                                  currentPeriod === opt.key
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                                )}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>

                          {/* Unfavorite button */}
                          <button
                            onClick={() => toggleFavoriteLeague(slug)}
                            className="p-1 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                            title="Remove from favorites"
                          >
                            <IconX className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        </div>

                        {/* Board Table */}
                        <div className="overflow-x-auto rounded-b-lg border border-white/10">
                    <table className="w-full text-left">
                          <thead>
                              <tr className="bg-white/[0.06] border-b border-white/10">
                                <th className="px-3 py-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider w-[80px]"></th>
                                <th className="px-3 py-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Team</th>
                                <th className="px-3 py-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider text-center" colSpan={2}>Spread</th>
                                <th className="px-3 py-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider text-center">Money Line</th>
                                {hasDraw && (
                                  <th className="px-3 py-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider text-center">Draw</th>
                                )}
                                <th className="px-3 py-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider text-center" colSpan={2}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                              {allEvents.map((event, idx) => {
                                // Get markets based on selected period
                                const moneyline = event.markets.find(m => m.title === marketTitles.moneyline)
                                  || (currentPeriod !== 'Game' ? null : null)
                                const spread = event.markets.find(m => m.title === marketTitles.spread)
                                  || (currentPeriod !== 'Game' ? null : null)
                                const total = event.markets.find(m => m.title === marketTitles.total)
                                  || (currentPeriod !== 'Game' ? null : null)
                                const score = event.type === 'Live' ? (liveScores[event.id] || (event as any).score) : null
                                const eventName = `${event.team1} vs ${event.team2}`

                              return (
                                  <React.Fragment key={`${event.id}-${idx}`}>
                                    {/* Team 1 Row */}
                                    <tr className={cn(
                                      "border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors",
                                      idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                                    )}>
                                      {/* Time / Status cell - spans 2 rows */}
                                      <td className="px-3 py-1.5 align-top border-r border-white/[0.06]" rowSpan={2}>
                                        <div className="flex flex-col items-start gap-0.5">
                                {event.type === 'Live' ? (
                                            <>
                                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">
                                                <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                    LIVE
                                  </span>
                                              <span className="text-[10px] text-white/40 font-medium">{event.time}</span>
                                              {score && (
                                                <span className="text-[11px] font-bold text-white mt-0.5">{score.team1} - {score.team2}</span>
                                              )}
                                            </>
                                ) : (
                                            <span className="text-[10px] text-white/40 font-medium leading-tight">{event.time}</span>
                                )}
                                        </div>
                              </td>
                                      {/* Team 1 Name with Badge */}
                                      <td className="px-3 py-1.5">
                          <div className="flex items-center gap-1.5">
                                          <ProTeamBadge teamName={event.team1} league={league.leagueMatch} />
                                          <span className="text-xs text-white font-medium">{event.team1}</span>
                          </div>
                              </td>
                                      {/* Team 1 Spread */}
                                      <td className="px-1 py-1.5 text-center" colSpan={2}>
                                        {spread?.options[0] ? (
                                          <button
                                            onClick={() => addBetToSlip(event.id, eventName, marketTitles.spread, spread.options[0].label, spread.options[0].odds)}
                                            className={cn(
                                              "inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all min-w-[80px] justify-center",
                                              isBetSelected(event.id, marketTitles.spread, spread.options[0].label)
                                                ? "bg-[#e63e3e] text-white"
                                                : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                            )}
                                          >
                                            <span className="text-white/50">{spread.options[0].label.split(' ').pop()}</span>
                                            <span>{spread.options[0].odds}</span>
                                          </button>
                                        ) : (
                                          <span className="text-[10px] text-white/20">—</span>
                                )}
                              </td>
                                      {/* Team 1 ML */}
                                      <td className="px-1 py-1.5 text-center">
                                        {moneyline?.options[0] ? (
                                  <button 
                                            onClick={() => addBetToSlip(event.id, eventName, marketTitles.moneyline, moneyline.options[0].label, moneyline.options[0].odds)}
                          className={cn(
                                              "px-2 py-1 rounded text-[11px] font-semibold transition-all min-w-[56px]",
                                              isBetSelected(event.id, marketTitles.moneyline, moneyline.options[0].label)
                                        ? "bg-[#e63e3e] text-white"
                                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                    )}
                                  >
                                    {moneyline.options[0].odds}
                                  </button>
                                        ) : (
                                          <span className="text-[10px] text-white/20">—</span>
                                )}
                              </td>
                                      {/* Draw - only for soccer (merged cell spanning 2 rows) */}
                                      {hasDraw && (
                                        <td className="px-1 py-1.5 text-center" rowSpan={2}>
                                          {moneyline?.options.find(o => o.label === 'Tie') ? (
                                  <button 
                                              onClick={() => {
                                                const tie = moneyline.options.find(o => o.label === 'Tie')!
                                                addBetToSlip(event.id, eventName, marketTitles.moneyline, tie.label, tie.odds)
                                              }}
                          className={cn(
                                                "px-2 py-1 rounded text-[11px] font-semibold transition-all min-w-[56px]",
                                                isBetSelected(event.id, marketTitles.moneyline, 'Tie')
                                        ? "bg-[#e63e3e] text-white"
                                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                    )}
                                  >
                                              {moneyline.options.find(o => o.label === 'Tie')!.odds}
                                  </button>
                                          ) : (
                                            <span className="text-[10px] text-white/20">—</span>
                                )}
                              </td>
                                      )}
                                      {/* Team 1 Total (Over) */}
                                      <td className="px-1 py-1.5 text-center" colSpan={2}>
                                        {total?.options[0] ? (
                          <button 
                                            onClick={() => addBetToSlip(event.id, eventName, marketTitles.total, total.options[0].label, total.options[0].odds)}
                            className={cn(
                                              "inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all min-w-[80px] justify-center",
                                              isBetSelected(event.id, marketTitles.total, total.options[0].label)
                                        ? "bg-[#e63e3e] text-white"
                                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                    )}
                                  >
                                            <span className="text-white/50">{total.options[0].label.replace(/^(O|U)\s*/, 'O ')}</span>
                                            <span>{total.options[0].odds}</span>
                          </button>
                                        ) : (
                                          <span className="text-[10px] text-white/20">—</span>
                                )}
                              </td>
                                    </tr>

                                    {/* Team 2 Row */}
                                    <tr className={cn(
                                      "border-b border-white/10 hover:bg-white/[0.03] transition-colors",
                                      idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                                    )}>
                                      {/* Team 2 Name with Badge */}
                                      <td className="px-3 py-1.5">
                                        <div className="flex items-center gap-1.5">
                                          <ProTeamBadge teamName={event.team2} league={league.leagueMatch} />
                                          <span className="text-xs text-white font-medium">{event.team2}</span>
                                        </div>
                                      </td>
                                      {/* Team 2 Spread */}
                                      <td className="px-1 py-1.5 text-center" colSpan={2}>
                                        {spread?.options[1] ? (
                          <button 
                                            onClick={() => addBetToSlip(event.id, eventName, marketTitles.spread, spread.options[1].label, spread.options[1].odds)}
                            className={cn(
                                              "inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all min-w-[80px] justify-center",
                                              isBetSelected(event.id, marketTitles.spread, spread.options[1].label)
                                          ? "bg-[#e63e3e] text-white"
                                          : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                      )}
                                    >
                                            <span className="text-white/50">{spread.options[1].label.split(' ').pop()}</span>
                                            <span>{spread.options[1].odds}</span>
                          </button>
                                        ) : (
                                          <span className="text-[10px] text-white/20">—</span>
                                        )}
                                      </td>
                                      {/* Team 2 ML */}
                                      <td className="px-1 py-1.5 text-center">
                                        {(() => {
                                          const awayML = hasDraw
                                            ? moneyline?.options[2] || moneyline?.options.find(o => o.label !== 'Tie' && o !== moneyline?.options[0])
                                            : moneyline?.options[1]
                                          return awayML ? (
                          <button 
                                              onClick={() => addBetToSlip(event.id, eventName, marketTitles.moneyline, awayML.label, awayML.odds)}
                            className={cn(
                                                "px-2 py-1 rounded text-[11px] font-semibold transition-all min-w-[56px]",
                                                isBetSelected(event.id, marketTitles.moneyline, awayML.label)
                                            ? "bg-[#e63e3e] text-white"
                                            : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                        )}
                                      >
                                              {awayML.odds}
                          </button>
                                          ) : (
                                            <span className="text-[10px] text-white/20">—</span>
                                          )
                                        })()}
                                      </td>
                                      {/* Draw cell is rowSpan from team1 row for soccer */}
                                      {/* Team 2 Total (Under) */}
                                      <td className="px-1 py-1.5 text-center" colSpan={2}>
                                        {total?.options[1] ? (
                                          <button
                                            onClick={() => addBetToSlip(event.id, eventName, marketTitles.total, total.options[1].label, total.options[1].odds)}
                                            className={cn(
                                              "inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all min-w-[80px] justify-center",
                                              isBetSelected(event.id, marketTitles.total, total.options[1].label)
                                                ? "bg-[#e63e3e] text-white"
                                                : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                            )}
                                          >
                                            <span className="text-white/50">{total.options[1].label.replace(/^(O|U)\s*/, 'U ')}</span>
                                            <span>{total.options[1].odds}</span>
                                          </button>
                                        ) : (
                                          <span className="text-[10px] text-white/20">—</span>
                                )}
                              </td>
                            </tr>
                                  </React.Fragment>
                          )
                        })}
                      </tbody>
                    </table>
                          </div>
                      </div>
                    )
                  })}
                          </div>
              )
            }

            // COMPACT VIEW - Default card layout
            return (<>
            {favoriteLeagues.map((slug, leagueIdx) => {
              const league = allLeagueData.find(l => l.slug === slug)
              if (!league) return null

              const leagueLiveEvents = liveEvents.filter(e => e.league === league.leagueMatch)
              const leagueUpcomingEvents = upcomingEvents.filter(e => e.league === league.leagueMatch)

              return (
                <div key={slug}>
                  {/* League Banner */}
                  <div className="relative mb-4 rounded-lg overflow-hidden h-14" style={{ background: league.gradient }}>
                    <div className="relative h-14 flex items-center px-4 gap-4 z-[20]">
                      <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                        <img src={league.icon} alt={league.name} width={24} height={24} className="object-contain" decoding="sync" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{league.name}</h2>
            </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={(e) => {
                  e.stopPropagation()
                            toggleFavoriteLeague(slug)
                          }}
                          className="flex items-center justify-center p-1.5 hover:bg-white/10 rounded-full transition-colors"
                          title="Remove from My Feed"
                        >
                          <IconHeart className={cn(
                            "w-5 h-5 transition-all duration-300",
                            "text-pink-500 fill-pink-500 scale-110"
                          )} />
                        </button>
              </div>
            </div>
          </div>
          
          {/* Live Events Section - Exactly matching Figma layout */}
          {leagueLiveEvents.length > 0 && <div className="mb-8">
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
              {leagueLiveEvents.map((event) => {
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
                  const initials = teamName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
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
                              src={leagueData.icon as string} 
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
          </div>}
          
          {/* Upcoming Events */}
          {leagueUpcomingEvents.length > 0 && <div className="mb-8">
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
              {leagueUpcomingEvents.map((event) => {
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
                  const initials = teamName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
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
                              src={leagueData.icon as string} 
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
          </div>}

                  {/* Separator below each league */}
                  <div className="border-t border-white/10 my-6" />
              </div>
              )
            })}
            </>)
          })()}

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
  }, [])
  const openVipDrawer = useCallback(() => {
    setAccountDrawerOpen(false)
    setDepositDrawerOpen(false)
    setVipDrawerOpen(true)
  }, [])
  const openDepositDrawer = useCallback(() => {
    setAccountDrawerOpen(false)
    setVipDrawerOpen(false)
    setDepositDrawerOpen(true)
  }, [])
  const [vipActiveTab, setVipActiveTab] = useState('VIP Hub')
  const [betslipOpen, setBetslipOpen] = useState(false)
  const [betslipMinimized, setBetslipMinimized] = useState(false)
  const [betslipManuallyClosed, setBetslipManuallyClosed] = useState(false)
  const [activeSport, setActiveSport] = useState<'Soccer' | 'Football' | null>(null) // Track active sport type - null on My Feed page
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
  const { state: sidebarState, open: sidebarOpen, openMobile, setOpenMobile, toggleSidebar } = useSidebar()
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
                onClick={toggleSidebar}
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
          </div>
        </motion.header>

        {/* Sports Sub Nav - Sticky with glass effect */}
        {showSports && (
          <motion.div
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
                  const isActive = sport.label === 'My Feed' ? activeSport === null : sport.label === activeSport
                  return (
                    <button
                      key={sport.label}
                      type="button"
                      onClick={() => {
                        // Navigate to sport page or change active sport
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
                        setActiveSport(sport.label as 'Soccer' | 'Football')
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
                  isMobile 
                    ? "w-full border-t border-gray-200 rounded-t-[10px] !mt-0 !mb-0 !bottom-0 !h-[80vh] !max-h-[80vh]"
                    : "w-full sm:max-w-md border-l border-gray-200 overflow-hidden"
                )}
                style={isMobile ? {
                  height: '80vh',
                  maxHeight: '80vh',
                  top: 'auto',
                  bottom: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                } : {
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {isMobile && <DrawerHandle variant="light" />}
            
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
                                    {typeof item.icon === 'string' ? <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" /> : <IconComp strokeWidth={1.5} className="w-5 h-5" />}
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
                  router.push('/sports')
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
              isMobile 
                ? "border-t border-gray-200 rounded-t-[10px] !h-[80vh] !max-h-[80vh]"
                : "border-l border-gray-200"
            )}
            style={isMobile ? {
              height: '80vh',
              maxHeight: '80vh',
              top: 'auto',
              bottom: 0,
            } : undefined}
          >
            {isMobile && <DrawerHandle variant="light" />}
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
              isMobile 
                ? "w-full border-t border-white/10 rounded-t-[10px] !mt-0 !mb-0 !bottom-0 !h-[80vh] !max-h-[80vh] overflow-hidden"
                : "w-full sm:max-w-md border-l border-white/10 overflow-hidden"
            )}
            style={isMobile ? {
              height: '80vh',
              maxHeight: '80vh',
              top: 'auto',
              bottom: 0,
              marginTop: 0,
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            } : {
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {isMobile && <DrawerHandle variant="dark" />}
            
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
              isMobile 
                ? "w-full border-t border-white/10 rounded-t-[10px] !mt-0 !mb-0 !bottom-0 !h-[80vh] !max-h-[80vh] overflow-hidden"
                : "w-full sm:max-w-2xl border-l border-white/10 overflow-hidden"
            )}
            style={isMobile ? {
              height: '80vh',
              maxHeight: '80vh',
              top: 'auto',
              bottom: 0,
            } : undefined}
          >
            {isMobile && <DrawerHandle variant="dark" />}
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
        <Drawer open={advancedSearchOpen} onOpenChange={setAdvancedSearchOpen} direction="right" shouldScaleBackground={false}>
          <DrawerContent className="w-full sm:max-w-md bg-[#2d2d2d] border-l border-white/10 text-white z-[210] relative">
            {isMobile && <DrawerHandle variant="dark" />}
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
