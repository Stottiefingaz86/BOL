'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  IconArrowRight,
  IconBallFootball,
  IconCherry,
  IconLock,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  SpotlightOverlay,
  useCursorSpotlight,
} from '@/components/ui/cursor-spotlight'
import { cn } from '@/lib/utils'

/** BetOnline Originals — clear game art for the Casino card */
const CASINO_TILES = [
  '/games/originals/plink.png',
  '/games/originals/blackjack.png',
  '/games/originals/dice.png',
  '/games/originals/diamonds.png',
  '/games/originals/mines.png',
  '/games/originals/keno.png',
  '/games/originals/limbo.png',
  '/games/originals/wheel.png',
  '/games/originals/hilo.png',
]

const USP_ITEMS = [
  {
    icon: '/banners/partners/crypto.svg',
    title: 'Deposit with Crypto',
    subtitle: 'Fast, easy & reliable',
  },
  {
    icon: '/banners/partners/vip-rewards.svg',
    title: 'VIP Rewards',
    subtitle: 'Level up bonuses, boosts & more',
  },
  {
    icon: '/banners/partners/bettingicons-coloured.svg',
    title: 'Bet Big',
    subtitle: 'High limits and re-bet functionality',
  },
  {
    icon: '/banners/partners/live-betting.svg',
    title: 'Fastest Payouts',
    subtitle: 'Payouts within minutes',
  },
  {
    icon: 'lock' as const,
    title: 'Safe & Secure',
    subtitle: 'Trusted & protected',
  },
]

function HeroUspBar() {
  return (
    <div className="relative z-10 border-t border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
      <div className="flex gap-1 overflow-x-auto px-3 py-3 scrollbar-hide md:grid md:grid-cols-5 md:gap-0 md:overflow-visible md:px-4 md:py-3.5 lg:px-6">
        {USP_ITEMS.map((item) => (
          <div
            key={item.title}
            className="group flex min-w-[200px] shrink-0 cursor-default items-center gap-2.5 px-2 py-1 md:min-w-0 md:px-3"
          >
            <div className="flex-shrink-0">
              {item.icon === 'lock' ? (
                <IconLock
                  size={28}
                  className="text-white/60 transition-colors duration-300 group-hover:text-[#ee3536]"
                />
              ) : (
                <Image
                  src={item.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase leading-tight text-white">
                {item.title}
              </p>
              <p className="truncate text-[10px] uppercase leading-tight text-white/55">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SPORTS_TILES = [
  { src: '/banners/sports_league/MLB.svg', label: 'MLB' },
  { src: '/banners/sports_league/NHL.svg', label: 'NHL' },
  { src: '/banners/sports_league/champions.svg', label: 'UCL' },
  { src: '/banners/sports_league/NFL.svg', label: 'NFL', featured: true },
  { src: '/banners/sports_league/nba.svg', label: 'NBA', featured: true },
  { src: '/banners/sports_league/prem.svg', label: 'EPL' },
  { src: '/sports_icons/mma.svg', label: 'MMA' },
  { src: '/banners/sports_league/mls.svg', label: 'MLS' },
  { src: '/banners/sports_league/laliga.svg', label: 'La Liga' },
]

function SportsTileGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 grid w-[150%] grid-cols-3 gap-2"
        style={{
          transform: 'translate(-50%, -50%) rotate(-10deg) skewX(-5deg)',
        }}
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
    </div>
  )
}

/** Simple angled shelf of Originals — full game cards, clearly visible */
function CasinoOriginalsShelf() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      <div
        className="absolute left-1/2 top-[46%] grid w-[155%] grid-cols-4 gap-1.5"
        style={{
          transform: 'translate(-50%, -50%) rotate(-9deg) scale(0.88)',
        }}
      >
        {[...CASINO_TILES, ...CASINO_TILES.slice(0, 7)].map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/15 bg-[#111] shadow-lg shadow-black/50"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover object-[center_32%]"
              sizes="80px"
              unoptimized
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
    </div>
  )
}

function DestinationCard({
  href,
  title,
  icon,
  children,
}: {
  href: string
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const router = useRouter()
  const { ref, handleMouseMove, handleMouseLeave, spotlightSurfaceStyle } =
    useCursorSpotlight()

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          router.push(href)
        }
      }}
      className="group relative isolate flex min-h-[200px] flex-1 cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414] text-left transition-colors duration-200 hover:border-white/20 md:min-h-[240px]"
      style={{ clipPath: 'inset(0 round 1rem)' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 origin-center transition-transform duration-500 ease-out group-hover:scale-[1.05]">
          {children}
        </div>
      </div>

      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={spotlightSurfaceStyle}
        className="relative z-[2] mt-auto flex items-center justify-between overflow-hidden border-t border-white/15 bg-black/55 px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
      >
        <SpotlightOverlay radiusPx={120} mixPercent={16} />
        <span className="relative z-[1] flex items-center gap-2 text-sm font-semibold text-white md:text-[15px]">
          {icon}
          {title}
        </span>
        <IconArrowRight className="relative z-[1] h-4 w-4 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </div>
  )
}

export interface HomeHeroProps {
  onRegister?: () => void
  onLogin?: () => void
  isLoggedIn?: boolean
  className?: string
}

export function HomeHero({
  onRegister,
  onLogin,
  isLoggedIn = false,
  className,
}: HomeHeroProps) {
  const router = useRouter()

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/[0.08]',
        className
      )}
    >
      <div className="absolute inset-0 bg-[#1a1a1a]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/banners/new_home.png"
          alt=""
          fill
          priority
          className="scale-110 object-cover object-[center_82%] blur-[2.5px] opacity-75"
          sizes="100vw"
          unoptimized
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, rgba(26,26,26,0.72) 0%, rgba(26,26,26,0.35) 40%, rgba(26,26,26,0.25) 60%, rgba(26,26,26,0.5) 100%),
            linear-gradient(180deg, rgba(26,26,26,0.35) 0%, transparent 28%, transparent 72%, rgba(26,26,26,0.45) 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '160px 160px',
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col gap-8 px-4 py-8 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-10 lg:gap-10 lg:px-10">
        <div className="flex w-full shrink-0 flex-col items-center gap-5 text-center md:w-auto md:max-w-[320px] md:items-start md:text-left">
          <h1 className="flex flex-col gap-1.5">
            <span className="block text-[44px] font-bold leading-[0.95] tracking-tight text-white sm:text-[52px] md:text-[56px] lg:text-[64px]">
              Bet On.
            </span>
            <span className="block text-[28px] font-bold tracking-tight text-white sm:text-[34px] md:text-[38px] lg:text-[42px]">
              BetOnline
            </span>
          </h1>

          {!isLoggedIn ? (
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button
                onClick={onRegister}
                className="h-11 rounded-lg border-0 bg-[#ee3536] px-5 text-sm font-semibold text-white hover:bg-[#d42f30]"
              >
                Register
                <IconArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <span className="text-sm text-white/45">Or</span>
              <Button
                variant="ghost"
                onClick={onLogin}
                className="h-11 rounded-lg border border-white/20 bg-white/[0.04] px-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                Login
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => router.push('/casino')}
              className="h-11 w-fit rounded-lg border-0 bg-[#ee3536] px-5 text-sm font-semibold text-white hover:bg-[#d42f30]"
            >
              Play Now
              <IconArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:w-[min(100%,520px)] md:ml-auto md:w-[520px] lg:w-[560px]">
          <DestinationCard
            href="/casino"
            title="Casino"
            icon={<IconCherry className="h-4 w-4" strokeWidth={2} />}
          >
            <CasinoOriginalsShelf />
          </DestinationCard>

          <DestinationCard
            href="/sports/football"
            title="Sportsbook"
            icon={<IconBallFootball className="h-4 w-4" strokeWidth={2} />}
          >
            <SportsTileGrid>
              {SPORTS_TILES.map((tile) => (
                <div
                  key={tile.label}
                  className={cn(
                    'relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-lg shadow-black/40',
                    tile.featured && 'from-[#222] to-[#141414]'
                  )}
                >
                  <Image
                    src={tile.src}
                    alt=""
                    width={tile.featured ? 48 : 34}
                    height={tile.featured ? 48 : 34}
                    className={cn(
                      'object-contain',
                      tile.featured ? 'h-11 w-11' : 'h-8 w-8 opacity-85',
                      // Dark league marks (e.g. Champions League) need invert on dark tiles
                      (tile.label === 'UCL') && 'brightness-0 invert'
                    )}
                    unoptimized
                  />
                  <span
                    className={cn(
                      'font-semibold uppercase tracking-wide',
                      tile.featured
                        ? 'text-[10px] text-white/85'
                        : 'text-[9px] text-white/55'
                    )}
                  >
                    {tile.label}
                  </span>
                </div>
              ))}
            </SportsTileGrid>
          </DestinationCard>
        </div>
      </div>

      <HeroUspBar />
    </section>
  )
}
