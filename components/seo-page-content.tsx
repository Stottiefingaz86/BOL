'use client'

import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { useTheme } from 'next-themes'
import { IconChevronDown } from '@tabler/icons-react'
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
  /** Optional flat sections list; when set, overrides left/right concatenation */
  sections?: SeoSection[]
  defaultOpen?: boolean
  /** Collapsed preview height before See More */
  collapsedHeight?: number
  /**
   * Visual appearance.
   * - `auto` follows the site theme
   * - `light` / `dark` force a surface regardless of theme
   */
  appearance?: 'auto' | 'light' | 'dark'
}

function InlineLink({
  href = '#',
  children,
  light,
}: {
  href?: string
  children: ReactNode
  light: boolean
}) {
  return (
    <a
      href={href}
      className={cn(
        'underline underline-offset-[3px] transition-colors',
        light
          ? 'text-zinc-900 decoration-zinc-900/35 hover:decoration-zinc-900'
          : 'text-white decoration-white/50 hover:decoration-white'
      )}
    >
      {children}
    </a>
  )
}

function slugifyHeading(heading: string, index: number): string {
  const base = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return base || `section-${index + 1}`
}

function defaultLeftSections(brandName: string, brandUrl: string, light: boolean): SeoSection[] {
  return [
    {
      heading: `${brandName} Casino Games: Play Slots, Live Casino & Table Games Online`,
      body: (
        <>
          <p>
            Looking for a trusted place to play online casino games?{' '}
            <InlineLink href="/" light={light}>
              {brandUrl}
            </InlineLink>{' '}
            brings together thousands of slots, live dealer tables, and classic casino favorites in
            one lobby. From progressive jackpots to high-volatility video slots, blackjack,
            roulette, baccarat, and craps, everything is built for fast discovery on desktop and
            mobile.
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
            Our{' '}
            <InlineLink href="/casino" light={light}>
              casino lobby
            </InlineLink>{' '}
            covers slots from top studios plus blackjack, roulette, baccarat, keno, and video poker.
            Live casino tables stream professional dealers so you get floor-game atmosphere without
            leaving home.
          </p>
          <p>
            Prefer sports? Switch into the{' '}
            <InlineLink href="/sports" light={light}>
              sportsbook
            </InlineLink>{' '}
            for NFL, NBA, MLB, NHL, soccer, MMA, and live in-play markets, then come back to casino
            for a different pace of play.
          </p>
        </>
      ),
    },
  ]
}

function defaultRightSections(brandName: string, brandUrl: string, light: boolean): SeoSection[] {
  return [
    {
      heading: `Bonus features, themes & games on ${brandName}`,
      body: (
        <>
          <p>Explore casino categories packed with bonus rounds, free spins, and feature-rich titles:</p>
          <ul
            className={cn(
              'list-disc space-y-1.5 pl-5',
              light ? 'marker:text-zinc-400' : 'marker:text-white/40'
            )}
          >
            <li>Progressive jackpot slots and branded video slots with free-spin features</li>
            <li>
              Live{' '}
              <InlineLink href="/casino" light={light}>
                blackjack
              </InlineLink>
              , roulette, and baccarat tables
            </li>
            <li>Classic table games including craps, keno, and video poker</li>
            <li>Sportsbook and casino cross-play with shared wallet and VIP progression</li>
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
            <InlineLink href="/responsible-gaming" light={light}>
              responsible gaming guidelines
            </InlineLink>
            :
          </p>
          <ul
            className={cn(
              'list-disc space-y-1.5 pl-5',
              light ? 'marker:text-zinc-400' : 'marker:text-white/40'
            )}
          >
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

type TocItem = { id: string; label: string }

function TocNav({
  items,
  light,
  className,
  showTitle = true,
  onNavigate,
}: {
  items: TocItem[]
  light: boolean
  className?: string
  showTitle?: boolean
  onNavigate?: () => void
}) {
  if (items.length === 0) return null

  return (
    <nav aria-label="On this page" className={className}>
      {showTitle ? (
        <p
          className={cn(
            'mb-3 text-xs font-semibold uppercase tracking-wide',
            light ? 'text-zinc-500' : 'text-white/45'
          )}
        >
          On this page
        </p>
      ) : null}
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            <a
              href={`#${item.id}`}
              title={item.label}
              onClick={onNavigate}
              className={cn(
                'block truncate text-sm leading-5 transition-colors',
                light
                  ? 'text-zinc-600 hover:text-zinc-900'
                  : 'text-white/55 hover:text-white'
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function MobileToc({
  items,
  light,
  onNavigate,
}: {
  items: TocItem[]
  light: boolean
  onNavigate?: () => void
}) {
  if (items.length === 0) return null

  return (
    <details
      className={cn(
        'group rounded-xl border lg:hidden',
        light ? 'border-zinc-300/80 bg-white/40' : 'border-white/10 bg-white/[0.03]'
      )}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 text-sm font-medium',
          light ? 'text-zinc-900' : 'text-white',
          '[&::-webkit-details-marker]:hidden'
        )}
      >
        <span>On this page</span>
        <IconChevronDown
          className={cn(
            'size-4 shrink-0 transition-transform group-open:rotate-180',
            light ? 'text-zinc-500' : 'text-white/45'
          )}
          aria-hidden
        />
      </summary>
      <div
        className={cn(
          'border-t px-3.5 py-3',
          light ? 'border-zinc-300/80' : 'border-white/10'
        )}
      >
        <TocNav items={items} light={light} showTitle={false} onNavigate={onNavigate} />
      </div>
    </details>
  )
}

export function SeoPageContent({
  className,
  brandName = 'BetOnline',
  brandUrl = 'BetOnline.ag',
  leftSections,
  rightSections,
  sections: sectionsProp,
  defaultOpen = false,
  collapsedHeight = 240,
  appearance = 'auto',
}: SeoPageContentProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [mounted, setMounted] = useState(false)
  const panelId = useId()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const light =
    appearance === 'light' ||
    (appearance === 'auto' && mounted && resolvedTheme === 'light')

  const left = leftSections ?? defaultLeftSections(brandName, brandUrl, light)
  const right = rightSections ?? defaultRightSections(brandName, brandUrl, light)
  const sections = sectionsProp ?? [...left, ...right]

  const tocItems = useMemo<TocItem[]>(() => {
    const used = new Set<string>()
    return sections.flatMap((section, index) => {
      if (!section.heading) return []
      let id = slugifyHeading(section.heading, index)
      if (used.has(id)) id = `${id}-${index + 1}`
      used.add(id)
      return [{ id, label: section.heading }]
    })
  }, [sections])

  const tocByIndex = useMemo(() => {
    const map = new Map<number, string>()
    let tocIndex = 0
    sections.forEach((section, index) => {
      if (!section.heading) return
      map.set(index, tocItems[tocIndex]?.id ?? slugifyHeading(section.heading, index))
      tocIndex += 1
    })
    return map
  }, [sections, tocItems])

  return (
    <section className={cn('w-full px-4 pb-5 pt-2 sm:px-6', className)}>
      <div
        className={cn(
          'relative rounded-2xl',
          !open && 'overflow-hidden',
          light
            ? 'border border-zinc-300/80 bg-[#ececec] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)]'
            : 'border border-white/[0.08] bg-[#1e1e1e] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]'
        )}
      >
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0',
            light
              ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,transparent_42%)]'
              : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,transparent_42%)]'
          )}
        />
        <div
          id={panelId}
          className={cn(
            'relative transition-[max-height] duration-500 ease-in-out',
            !open &&
              '[mask-image:linear-gradient(to_bottom,black_0%,black_42%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_42%,transparent_100%)]'
          )}
          style={{ maxHeight: open ? 6000 : collapsedHeight }}
        >
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(12rem,3fr)] lg:gap-10 xl:gap-14">
              {/* 70% — single content column */}
              <div className="min-w-0">
                {sections.map((section, index) => {
                  const headingId = tocByIndex.get(index)
                  const isFirst = index === 0

                  return (
                    <div
                      key={`${section.heading ?? 'block'}-${index}`}
                      className={cn('flex flex-col gap-3', index > 0 && 'mt-7')}
                    >
                      {section.heading ? (
                        <h2
                          id={headingId}
                          className={cn(
                            'scroll-mt-24 text-lg font-semibold leading-snug tracking-tight sm:text-xl',
                            light ? 'text-zinc-900' : 'text-white'
                          )}
                        >
                          {section.heading}
                        </h2>
                      ) : null}

                      {/* Mobile: collapsed TOC directly under the main heading */}
                      {isFirst ? (
                        <MobileToc
                          items={tocItems}
                          light={light}
                          onNavigate={() => setOpen(true)}
                        />
                      ) : null}

                      <div
                        className={cn(
                          'space-y-3 text-[13px] leading-[1.65] sm:text-sm',
                          light
                            ? 'text-zinc-600 [&_a]:text-zinc-900'
                            : 'text-white/55 [&_a]:text-white'
                        )}
                      >
                        {section.body}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 30% — desktop TOC */}
              <aside className="hidden min-w-0 lg:block">
                <div className="sticky top-24">
                  <TocNav
                    items={tocItems}
                    light={light}
                    onNavigate={() => setOpen(true)}
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'relative z-10 flex justify-center',
            open ? 'pb-6 pt-1' : 'absolute inset-x-0 bottom-3'
          )}
        >
          {!open ? (
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent',
                light ? 'from-[#ececec] via-[#ececec]/60' : 'from-[#1e1e1e] via-[#1e1e1e]/55'
              )}
            />
          ) : null}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              'relative inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium backdrop-blur-sm transition-colors',
              light
                ? 'border-zinc-400/70 bg-[#ececec]/95 text-zinc-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] hover:border-zinc-500 hover:bg-[#e4e4e4]'
                : 'border-white/20 bg-[#1e1e1e]/95 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/35 hover:bg-[#252525]'
            )}
          >
            {open ? 'See Less' : 'See More'}
          </button>
        </div>
      </div>
    </section>
  )
}
