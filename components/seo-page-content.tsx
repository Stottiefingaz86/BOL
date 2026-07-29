'use client'

import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type SeoSection = {
  heading?: string
  body: ReactNode
}

export type SeoPageContentProps = {
  className?: string
  /** Kept for page-level overrides; primary H2 comes from leftSections[0].heading */
  title?: string
  subtitle?: string
  brandName?: string
  brandUrl?: string
  leftSections?: SeoSection[]
  rightSections?: SeoSection[]
  defaultOpen?: boolean
  /** Collapsed preview height before See More */
  collapsedHeight?: number
}

function InlineLink({ href = '#', children }: { href?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-white underline decoration-white/50 underline-offset-[3px] transition-colors hover:decoration-white"
    >
      {children}
    </a>
  )
}

function defaultLeftSections(brandName: string, brandUrl: string): SeoSection[] {
  return [
    {
      heading: `${brandName} Casino Games: Play Slots, Live Casino & Table Games Online`,
      body: (
        <>
          <p>
            Looking for a trusted place to play online casino games?{' '}
            <InlineLink href="/">{brandUrl}</InlineLink> brings together thousands of slots, live
            dealer tables, and classic casino favorites in one lobby. From progressive jackpots to
            high-volatility video slots, blackjack, roulette, baccarat, and craps, everything is
            built for fast discovery on desktop and mobile.
          </p>
          <p>
            New and returning players can jump straight into popular titles, filter by category, or
            open live casino rooms with real dealers streaming in real time. Crypto and local
            payment options make deposits simple, so you spend less time funding and more time
            playing.
          </p>
        </>
      ),
    },
    {
      heading: `What makes ${brandName} different?`,
      body: (
        <p>
          {brandName} pairs a full sportsbook with a deep casino product, VIP rewards, and 24/7
          support. Competitive odds, transparent banking, and promotions built around real play give
          you a complete wagering experience, not a stripped-down casino clone.
        </p>
      ),
    },
    {
      heading: 'Live casino, slots, and table games explained',
      body: (
        <>
          <p>
            Our <InlineLink href="/casino">casino lobby</InlineLink> covers slots from top studios
            plus blackjack, roulette, baccarat, keno, and video poker. Live casino tables stream
            professional dealers so you get floor-game atmosphere without leaving home.
          </p>
          <p>
            Prefer sports? Switch into the <InlineLink href="/sports">sportsbook</InlineLink> for
            NFL, NBA, MLB, NHL, soccer, MMA, and live in-play markets, then come back to casino for
            a different pace of play.
          </p>
        </>
      ),
    },
  ]
}

function defaultRightSections(brandName: string, brandUrl: string): SeoSection[] {
  return [
    {
      heading: `Bonus features, themes & games on ${brandName}`,
      body: (
        <>
          <p>Explore casino categories packed with bonus rounds, free spins, and feature-rich titles:</p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-white/40">
            <li>
              Progressive jackpot slots and branded video slots with free-spin features
            </li>
            <li>
              Live <InlineLink href="/casino">blackjack</InlineLink>, roulette, and baccarat tables
            </li>
            <li>Classic table games including craps, keno, and video poker</li>
            <li>
              Sportsbook and casino cross-play with shared wallet and VIP progression
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: 'Responsible gambling tools on your account',
      body: (
        <>
          <p>
            Stay in control with tools aligned to our{' '}
            <InlineLink href="/responsible-gaming">responsible gaming guidelines</InlineLink>:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-white/40">
            <li>Loss limits</li>
            <li>Wager limits</li>
            <li>Deposit limits</li>
            <li>Cooling-off periods</li>
            <li>Break in play</li>
            <li>Self-exclusion</li>
          </ul>
          <p>Need help adjusting limits? Contact live support anytime from your account.</p>
        </>
      ),
    },
    {
      heading: `Deposits and withdrawals on ${brandName}`,
      body: (
        <p>
          Fund your wallet with cards, bank options, and popular cryptocurrencies. Withdrawals move
          through the same secure banking flow, with clear status updates so you always know where
          your money stands on {brandUrl}.
        </p>
      ),
    },
    {
      heading: 'Sports betting odds and live markets',
      body: (
        <p>
          Bet pre-match or in-play across major leagues and props. Deep markets, live scoring, and
          same-wallet casino play make {brandName} a one-stop destination for sports and casino.
        </p>
      ),
    },
  ]
}

function SeoColumn({
  sections,
  startAsH2 = false,
}: {
  sections: SeoSection[]
  startAsH2?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      {sections.map((section, index) => {
        const Tag = startAsH2 && index === 0 ? 'h2' : 'h3'
        return (
          <div key={`${section.heading ?? 'block'}-${index}`} className="flex flex-col gap-3">
            {section.heading ? (
              <Tag className="text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                {section.heading}
              </Tag>
            ) : null}
            <div className="space-y-3 text-[13px] leading-[1.65] text-white/55 sm:text-sm [&_a]:text-white">
              {section.body}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function SeoPageContent({
  className,
  brandName = 'BetOnline',
  brandUrl = 'BetOnline.ag',
  leftSections,
  rightSections,
  defaultOpen = false,
  collapsedHeight = 220,
}: SeoPageContentProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const left = leftSections ?? defaultLeftSections(brandName, brandUrl)
  const right = rightSections ?? defaultRightSections(brandName, brandUrl)

  return (
    <section className={cn('w-full px-4 pb-4 pt-2 sm:px-6', className)}>
      <div className="relative overflow-hidden rounded-xl bg-[#252525]">
        <div
          id={panelId}
          className="relative transition-[max-height] duration-500 ease-in-out"
          style={{ maxHeight: open ? 4000 : collapsedHeight }}
        >
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
              <SeoColumn sections={left} startAsH2 />
              <SeoColumn sections={right} />
            </div>
          </div>

          {!open ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#252525] via-[#252525]/90 to-transparent"
            />
          ) : null}
        </div>

        <div
          className={cn(
            'relative z-10 flex justify-center',
            open ? 'pb-6 pt-1' : 'absolute inset-x-0 bottom-4'
          )}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 items-center justify-center rounded-md border border-white/25 bg-[#252525] px-4 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)] transition-colors hover:border-white/40 hover:bg-[#2c2c2c]"
          >
            {open ? 'See Less' : 'See More'}
          </button>
        </div>
      </div>
    </section>
  )
}
