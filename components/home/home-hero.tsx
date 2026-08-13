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

const SPORTS_BENTO = [
  { src: '/banners/sports_league/NFL.svg', label: 'NFL', span: 'lg' as const },
  { src: '/banners/sports_league/nba.svg', label: 'NBA', span: 'lg' as const },
  { src: '/banners/sports_league/NHL.svg', label: 'NHL', span: 'sm' as const },
  { src: '/banners/sports_league/prem.svg', label: 'EPL', span: 'sm' as const },
  { src: '/banners/sports_league/mls.svg', label: 'MLS', span: 'sm' as const },
  { src: '/banners/sports_league/laliga.svg', label: 'La Liga', span: 'sm' as const },
]

/**
 * 2-row bento that fits the card height:
 * NFL + NBA large on top, four leagues along the bottom.
 * Logo-only — labels were clipping in short cells.
 */
function SportsBentoShelf() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[inherit]" aria-hidden>
      {/* Soft field tint so the tile doesn’t read as black-on-black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(34,120,70,0.22) 0%, transparent 55%), linear-gradient(160deg, #243028 0%, #1a1f1c 45%, #151815 100%)',
        }}
      />
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-2 p-3 pb-3.5">
        {SPORTS_BENTO.map((tile) => (
          <div
            key={tile.label}
            className={cn(
              'relative flex min-h-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-white/[0.12] to-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
              tile.span === 'lg' && 'col-span-2'
            )}
          >
            <Image
              src={tile.src}
              alt=""
              width={80}
              height={80}
              className={cn(
                'object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]',
                tile.span === 'lg' ? 'h-[58%] w-[58%] max-h-[4.5rem] max-w-[4.5rem]' : 'h-[52%] w-[52%] max-h-10 max-w-10'
              )}
              unoptimized
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#1a4a32] via-[#1a4a32]/70 to-transparent" />
    </div>
  )
}

/** Simple angled shelf of Originals — full game cards, clearly visible */
function CasinoOriginalsShelf() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[inherit]" aria-hidden>
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#1a3a5c] via-[#1a3a5c]/75 to-transparent" />
    </div>
  )
}

function DestinationCard({
  href,
  title,
  icon,
  band = 'neutral',
  children,
}: {
  href: string
  title: string
  icon: React.ReactNode
  band?: 'neutral' | 'casino' | 'sports'
  children: React.ReactNode
}) {
  const router = useRouter()
  const { ref, handleMouseMove, handleMouseLeave, spotlightSurfaceStyle } =
    useCursorSpotlight()

  const bandClass =
    band === 'casino'
      ? 'border-t border-blue-400/25 bg-[#1a3a5c]'
      : band === 'sports'
        ? 'border-t border-emerald-400/25 bg-[#1a4a32]'
        : 'border-t border-white/[0.06] bg-[#141414]'

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
      className="group relative isolate flex min-h-[168px] flex-1 cursor-pointer flex-col overflow-clip rounded-2xl border border-white/[0.08] text-left transition-colors duration-200 hover:border-white/20 sm:min-h-[200px] md:min-h-[240px]"
      style={{
        clipPath: 'inset(0 round 1rem)',
        backgroundColor: 'rgba(20, 20, 20, 0.85)',
      }}
    >
      <div className="absolute inset-0 overflow-clip rounded-2xl">
        <div className="absolute inset-0 origin-center transition-transform duration-500 ease-out group-hover:scale-[1.05]">
          {children}
        </div>
      </div>

      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={spotlightSurfaceStyle}
        className={cn(
          'relative z-[2] mt-auto flex items-center justify-between overflow-hidden px-3 py-2.5 sm:px-4 sm:py-3',
          bandClass
        )}
      >
        <SpotlightOverlay radiusPx={120} mixPercent={16} />
        <span className="relative z-[1] flex items-center gap-1.5 text-[13px] font-semibold text-white sm:gap-2 sm:text-sm md:text-[15px]">
          {icon}
          {title}
        </span>
        <IconArrowRight className="relative z-[1] h-4 w-4 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </div>
  )
}

function HeroAtmosphere() {
  const embers = [
    { left: '10%', delay: '0s', duration: '8s', size: 2, drift: '-10px' },
    { left: '22%', delay: '1.8s', duration: '9s', size: 2, drift: '8px' },
    { left: '36%', delay: '3.2s', duration: '7.5s', size: 1.5, drift: '-6px' },
    { left: '16%', delay: '4.4s', duration: '8.5s', size: 2, drift: '10px' },
  ]

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-clip"
      aria-hidden
    >
      {/* Quiet brand wash — parked low-left so it doesn't sit under the headline */}
      <div
        className="absolute -left-[10%] bottom-[-20%] h-[70%] w-[55%]"
        style={{
          background:
            'radial-gradient(ellipse at 40% 60%, rgba(238,53,54,0.22) 0%, rgba(238,53,54,0.08) 40%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />
      <div
        className="absolute left-0 top-0 h-full w-[45%]"
        style={{
          background:
            'linear-gradient(105deg, rgba(238,53,54,0.1) 0%, transparent 55%)',
        }}
      />

      {/* Soft rising embers */}
      <div className="absolute inset-x-0 bottom-0 top-[45%] max-w-[50%]">
        {embers.map((ember, i) => (
          <span
            key={i}
            className="hero-ember absolute bottom-[6%] rounded-full"
            style={{
              left: ember.left,
              width: ember.size,
              height: ember.size,
              background: 'rgba(255, 100, 100, 0.55)',
              boxShadow: `0 0 ${ember.size * 2}px rgba(238,53,54,0.35)`,
              ['--ember-drift' as string]: ember.drift,
              animation: `hero-ember-rise ${ember.duration} linear infinite`,
              animationDelay: ember.delay,
            }}
          />
        ))}
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
        'relative overflow-clip rounded-2xl border border-white/[0.08]',
        className
      )}
    >
      <div className="absolute inset-0 bg-[#121212]" />
      <div className="pointer-events-none absolute inset-0 overflow-clip">
        <Image
          src="/banners/new_home.png"
          alt=""
          fill
          priority
          className="scale-110 object-cover object-[center_82%] blur-[3px] opacity-55"
          sizes="100vw"
          unoptimized
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 70% at 12% 70%, rgba(238,53,54,0.12) 0%, transparent 65%),
            linear-gradient(90deg, rgba(18,18,18,0.65) 0%, rgba(18,18,18,0.4) 42%, rgba(18,18,18,0.55) 100%),
            linear-gradient(180deg, rgba(18,18,18,0.45) 0%, transparent 28%, transparent 72%, rgba(18,18,18,0.55) 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '160px 160px',
        }}
        aria-hidden
      />

      <HeroAtmosphere />

      <div className="relative z-10 flex flex-col gap-8 px-4 py-8 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-10 lg:gap-10 lg:px-10">
        <div className="flex w-full shrink-0 flex-col items-center gap-5 text-center md:w-auto md:max-w-[460px] md:items-start md:text-left lg:max-w-[520px]">
          <div className="flex flex-col gap-3">
            <h1
              className="block text-[48px] font-black uppercase leading-[0.9] tracking-[-0.03em] text-white sm:text-[56px] md:text-[64px] lg:text-[76px]"
              style={{
                fontFamily:
                  'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif',
              }}
            >
              Built for{' '}
              <span
                className="text-[#ee3536]"
                style={{
                  textShadow:
                    '0 1px 0 rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.45)',
                }}
              >
                Winners.
              </span>
            </h1>
            <p className="max-w-[22rem] text-[15px] leading-snug text-white/70 sm:text-base md:max-w-none">
              Cash Rewards. Instant Withdrawals.
              <br />
              Real Human Support.
            </p>
          </div>

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

        <div className="flex w-full shrink-0 flex-row gap-2 sm:gap-3 sm:w-[min(100%,520px)] md:ml-auto md:w-[520px] lg:w-[560px]">
          <DestinationCard
            href="/casino"
            title="Casino"
            band="casino"
            icon={<IconCherry className="h-4 w-4" strokeWidth={2} />}
          >
            <CasinoOriginalsShelf />
          </DestinationCard>

          <DestinationCard
            href="/sports/football"
            title="Sports"
            band="sports"
            icon={<IconBallFootball className="h-4 w-4" strokeWidth={2} />}
          >
            <SportsBentoShelf />
          </DestinationCard>
        </div>
      </div>

      <HeroUspBar />
    </section>
  )
}
