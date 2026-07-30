'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
  IconCrown,
  IconHeadset,
  type Icon,
} from '@tabler/icons-react'
import { SeoPageContent, type SeoPageContentProps } from '@/components/seo-page-content'
import { cn } from '@/lib/utils'

const FOOTER_COLUMNS = [
  {
    title: 'Quick Links',
    links: [
      'About Us',
      'Refer a Friend',
      'Rules',
      'Banking',
      'Privacy Policy',
      'Affiliates',
      'Terms & Conditions',
      'Responsable Games',
    ],
  },
  {
    title: 'Casino',
    links: [
      'Play Casino',
      'Blackjack',
      'Baccarat',
      'Craps',
      'Roulette',
      'Keno',
      'Slots',
      'Video Poker',
    ],
  },
  {
    title: 'Sports',
    links: [
      'Sportsbook',
      'NFL Betting Odds',
      'NBA Betting Odds',
      'MLB Betting Odds',
      'NHL Betting Odds',
      'NCAAB Betting Odds',
      'Super Bowl Betting Odds',
      'Boxing Betting Odds',
    ],
  },
  {
    title: 'Poker',
    links: ['Play Poker', 'Download', 'Texas Holdem', 'Omaha Poker'],
  },
  {
    title: 'Racebook',
    links: [
      'Horse Betting',
      'Kentucky Derby',
      'Preakness Stakes',
      'Belmont Stakes',
      'Breeders Cup',
    ],
  },
  {
    title: 'Other',
    links: [
      'VIP Rewards',
      'News Room',
      'Why BetOnline',
      'BetOnline Vs Competition',
      'Bet TV',
    ],
  },
  {
    title: 'Support',
    links: ['Live Chat', 'Help Center'],
  },
] as const

/** Complete partner tiles from public/banners/footer/partners (bg + logo baked in) */
const PARTNERS = [
  { src: '/banners/footer/partners/laliga.png', alt: 'LaLiga', width: 81, height: 30 },
  { src: '/banners/footer/partners/lfa.png', alt: 'LFA', width: 81, height: 30 },
  { src: '/banners/footer/partners/matchroom.png', alt: 'Matchroom', width: 109, height: 30 },
  { src: '/banners/footer/partners/golden-boy.png', alt: 'Golden Boy', width: 114, height: 30 },
] as const

const SOCIAL: {
  icon: Icon
  alt: string
  href: string
}[] = [
  { icon: IconBrandFacebook, alt: 'Facebook', href: '#' },
  { icon: IconBrandTelegram, alt: 'Telegram', href: '#' },
  {
    icon: IconCrown,
    alt: 'VIP Telegram',
    href: 'https://t.me/BetOnline_VIP_Notices',
  },
  { icon: IconBrandInstagram, alt: 'Instagram', href: '#' },
  { icon: IconBrandX, alt: 'X', href: '#' },
  { icon: IconBrandTiktok, alt: 'TikTok', href: '#' },
  { icon: IconBrandYoutube, alt: 'YouTube', href: '#' },
]

type PaymentTile =
  | { kind: 'tile'; src: string; alt: string; bg: string; iconClass?: string }
  | { kind: 'badge'; src: string; alt: string; width: number }

const PAYMENTS: PaymentTile[] = [
  {
    kind: 'tile',
    src: '/banners/footer/payments/bitcoin.svg',
    alt: 'Bitcoin',
    bg: '#f8931a',
    iconClass: 'size-4',
  },
  {
    kind: 'tile',
    src: '/banners/footer/payments/ethereum.svg',
    alt: 'Ethereum',
    bg: 'rgba(255,255,255,0.77)',
    iconClass: 'h-4 w-3',
  },
  {
    kind: 'tile',
    src: '/banners/footer/payments/litecoin.svg',
    alt: 'Litecoin',
    bg: '#345d9d',
    iconClass: 'size-[18px]',
  },
  {
    kind: 'tile',
    src: '/banners/footer/payments/visa.svg',
    alt: 'Visa',
    bg: 'rgba(255,255,255,0.77)',
    iconClass: 'h-2.5 w-5',
  },
  {
    kind: 'tile',
    src: '/banners/footer/payments/mastercard.svg',
    alt: 'Mastercard',
    bg: 'rgba(255,255,255,0.77)',
    iconClass: 'size-4',
  },
  {
    kind: 'tile',
    src: '/banners/footer/payments/amex.svg',
    alt: 'American Express',
    bg: 'rgba(255,255,255,0.77)',
    iconClass: 'h-2.5 w-6',
  },
  {
    kind: 'tile',
    src: '/banners/footer/payments/discover.png',
    alt: 'Discover',
    bg: 'rgba(255,255,255,0.77)',
    iconClass: 'h-2.5 w-6',
  },
  {
    kind: 'tile',
    src: '/banners/footer/payments/interac.svg',
    alt: 'Interac',
    bg: '#fe1b0b',
    iconClass: 'size-4',
  },
  {
    kind: 'badge',
    src: '/banners/footer/badges/responsible-gaming.png',
    alt: 'Responsible Gambling Trust',
    width: 93,
  },
  {
    kind: 'badge',
    src: '/banners/footer/badges/ssl-secure.png',
    alt: 'Secure SSL Encryption',
    width: 70,
  },
]

export type SiteFooterProps = {
  className?: string
  brandName?: string
  brandUrl?: string
  /** Hide the expandable SEO block above the footer link directory. */
  showSeo?: boolean
  seo?: Omit<SeoPageContentProps, 'brandName' | 'brandUrl'>
  /** Force SEO card light/dark, or follow theme (`auto`). */
  seoAppearance?: SeoPageContentProps['appearance']
}

export function SiteFooter({
  className,
  brandName = 'BetOnline',
  brandUrl = 'BetOnline.ag',
  showSeo = true,
  seo,
  seoAppearance = 'auto',
}: SiteFooterProps) {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const tick = () => {
      setCurrentTime(
        new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).replace(/\s+(AM|PM)/, '$1')
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={cn('relative z-0 mt-10 w-full', className)}>
      {showSeo ? (
        <SeoPageContent
          brandName={brandName}
          brandUrl={brandUrl}
          {...seo}
          appearance={seo?.appearance ?? seoAppearance}
        />
      ) : null}
    <footer
      className="w-full bg-[#2c2c2c] text-white"
    >
      <div className="flex w-full flex-col gap-8 px-6 py-12">
        {/* Link directory — 7 equal columns */}
        <div className="flex w-full flex-wrap gap-6 lg:flex-nowrap lg:gap-6">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex min-w-[120px] flex-1 flex-col gap-3">
              <h3 className="text-sm font-semibold leading-5 text-white/87">{col.title}</h3>
              <ul className="flex flex-col gap-1">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs font-medium leading-4 text-white/60 transition-colors duration-150 hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Need Help + Trust + Partners | Social */}
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex w-full max-w-[593px] flex-col gap-8">
            <button
              type="button"
              className="inline-flex h-9 w-full max-w-[215px] items-center justify-center gap-1.5 rounded-lg bg-[#ee3536] px-2 text-sm font-medium text-white transition-colors hover:brightness-110"
            >
              <IconHeadset className="size-4 shrink-0" stroke={2} aria-hidden />
              Need Help?
            </button>

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <h3 className="text-base font-semibold leading-6 text-white/87">
                  A Trusted & Safe Experience
                </h3>
                <Image
                  src="/banners/footer/badges/shield.svg"
                  alt=""
                  width={26}
                  height={26}
                  className="size-[26px] shrink-0"
                  unoptimized
                />
              </div>
              <p className="max-w-[526px] text-xs leading-[1.47] text-white/87">
                At {brandName} our company&apos;s guiding principle is to establish long-lasting,
                positive relationships with our customers and within the online gaming community for
                over 25+ years.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 py-2">
              <span className="text-xs font-semibold leading-4 text-white/87">Official Partners</span>
              <span className="hidden h-5 w-px shrink-0 bg-white/87 opacity-25 sm:block" aria-hidden />
              <div className="flex flex-wrap items-center gap-3">
                {PARTNERS.map((partner) => (
                  <Image
                    key={partner.alt}
                    src={partner.src}
                    alt={partner.alt}
                    width={partner.width}
                    height={partner.height}
                    className="h-[30px] w-auto shrink-0"
                    style={{ width: partner.width, height: partner.height }}
                    unoptimized
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4 lg:justify-end lg:gap-5">
            {SOCIAL.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.alt}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-white/50 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
                  aria-label={item.alt}
                >
                  <Icon className="size-5" stroke={1.5} aria-hidden />
                </a>
              )
            })}
          </div>
        </div>

        {/* Payments + legal */}
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-[43px]">
          <div className="flex flex-wrap items-center gap-3">
            {PAYMENTS.map((item) =>
              item.kind === 'tile' ? (
                <div
                  key={item.alt}
                  className="relative flex h-[30px] w-10 shrink-0 items-center justify-center overflow-hidden rounded-[2.67px]"
                  style={{ backgroundColor: item.bg }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={24}
                    height={16}
                    className={cn('object-contain', item.iconClass)}
                    unoptimized
                  />
                </div>
              ) : (
                <Image
                  key={item.alt}
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={30}
                  className="h-[30px] w-auto object-contain opacity-90"
                  unoptimized
                />
              )
            )}
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-white/[0.08] bg-white/[0.05] p-0.5">
              <span className="text-[10px] font-bold leading-[15px] text-white/87">18+</span>
            </div>
          </div>

          <div className="flex flex-col gap-0 text-left text-xs leading-[1.47] text-white/60 lg:items-end lg:text-right">
            <div className="font-semibold">{currentTime}</div>
            <div>
              Copyright ©{new Date().getFullYear()} {brandUrl}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  )
}
