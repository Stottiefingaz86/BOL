/**
 * Promo offer catalog + CMS-shaped detail content.
 * Swap `getPromoOfferBySlug` for a CMS fetch when the content team wires Sanity/Contentful/etc.
 */

export type PromoTab = 'Deposit Bonus' | 'Sports' | 'Casino' | 'Poker'

export type PromoOfferCard = {
  id: string
  slug: string
  title: string
  description: string
  category: PromoTab
}

export type PromoOfferDetail = PromoOfferCard & {
  productLabel: string
  heroTitle: string
  intro: string
  ctaLabel: string
  /** Top hero banner — CMS image URL when wired */
  bannerImage: string
  sections: Array<{ heading: string; body: string }>
  terms: string[]
}

/** Desktop LP rotator (1920×352) — used as CMS top-banner stand-in */
export const DEFAULT_PROMO_BANNER =
  '/banners/n_BOL_Casino_LP_Rotator_D_1920x352_W7_100294_8f6365f9fc.jpg'

export const ALL_PROMO_OFFERS: PromoOfferCard[] = [
  {
    id: 'dep-1',
    slug: '100-percent-deposit-match',
    title: '100% Deposit Match',
    description:
      'Double your first deposit up to $1,000. Bonus funds credited instantly after deposit.',
    category: 'Deposit Bonus',
  },
  {
    id: 'dep-2',
    slug: 'reload-bonus-50',
    title: 'Reload Bonus 50%',
    description:
      'Get 50% back on your next deposit this week. Available once every 7 days.',
    category: 'Deposit Bonus',
  },
  {
    id: 'dep-3',
    slug: 'weekend-deposit-boost',
    title: 'Weekend Deposit Boost',
    description: 'Extra 25% on deposits Saturday–Sunday. Minimum deposit $25.',
    category: 'Deposit Bonus',
  },
  {
    id: 'dep-4',
    slug: 'high-roller-match',
    title: 'High Roller Match',
    description:
      'Deposit $500+ and unlock an enhanced match rate with faster unlock terms.',
    category: 'Deposit Bonus',
  },
  {
    id: 'sp-1',
    slug: 'risk-free-bet-50',
    title: 'Risk-Free Bet $50',
    description: 'Place a sports wager — if it loses, get a free bet back up to $50.',
    category: 'Sports',
  },
  {
    id: 'sp-2',
    slug: 'odds-boost-daily',
    title: 'Odds Boost Daily',
    description: 'Boosted odds on featured games every day. Look for the boost badge.',
    category: 'Sports',
  },
  {
    id: 'sp-3',
    slug: 'parlay-insurance',
    title: 'Parlay Insurance',
    description: 'Miss one leg on a 4+ team parlay and still get a free bet consolation.',
    category: 'Sports',
  },
  {
    id: 'sp-4',
    slug: 'same-game-parlay-bonus',
    title: 'Same Game Parlay Bonus',
    description: 'Extra profit boost when you build same-game parlays on NFL and NBA.',
    category: 'Sports',
  },
  {
    id: 'cas-1',
    slug: '50-free-spins',
    title: '50 Free Spins',
    description: 'Free spins on selected slots. Wagering applies to winnings only.',
    category: 'Casino',
  },
  {
    id: 'cas-2',
    slug: 'casino-cashback-10',
    title: 'Casino Cashback 10%',
    description: 'Weekly cashback on net casino losses. Credited every Monday.',
    category: 'Casino',
  },
  {
    id: 'cas-3',
    slug: 'live-dealer-reload',
    title: 'Live Dealer Reload',
    description: 'Bonus for live blackjack and roulette play this weekend.',
    category: 'Casino',
  },
  {
    id: 'cas-4',
    slug: 'slots-tournament-entry',
    title: 'Slots Tournament Entry',
    description: 'Free entry into this week’s slots race with a $2,500 prize pool.',
    category: 'Casino',
  },
  {
    id: 'pok-1',
    slug: 'poker-freeroll-ticket',
    title: 'Poker Freeroll Ticket',
    description: 'Claim a freeroll seat and play for cash prizes with no buy-in.',
    category: 'Poker',
  },
  {
    id: 'pok-2',
    slug: 'rakeback-boost',
    title: 'Rakeback Boost',
    description: 'Extra rakeback for 7 days when you opt into this poker promo.',
    category: 'Poker',
  },
  {
    id: 'pok-3',
    slug: 'sit-and-go-ticket-pack',
    title: 'Sit & Go Ticket Pack',
    description: 'Three Sit & Go tickets to get you into the action quickly.',
    category: 'Poker',
  },
  {
    id: 'pok-4',
    slug: 'poker-deposit-match',
    title: 'Poker Deposit Match',
    description:
      'Match bonus for poker play — transferable to cash games and tournaments.',
    category: 'Poker',
  },
]

const FIGMA_LOREM_INTRO =
  'Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam qui modi reprehenderit rem inventore Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam. Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam qui modi reprehenderit rem inventore Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullamLorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam qui modi reprehenderit rem inventore Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam.'

const FIGMA_LOREM_SHORT =
  'Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam qui modi reprehenderit rem inventore Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam'

const FIGMA_LOREM_LONG =
  'Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam qui modi reprehenderit rem inventore Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam. Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam qui modi reprehenderit rem inventore Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullamLorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam qui modi reprehenderit rem inventore Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam.'

const FIGMA_TERM =
  'Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam qui modi reprehenderit rem inventore Lorem ipsum dolor sit amet. Ut consequatur laboriosam non velit doloribus aut velit ullam'

const DEFAULT_TERMS = [
  FIGMA_TERM,
  FIGMA_TERM,
  FIGMA_TERM,
  FIGMA_TERM,
  FIGMA_TERM,
  FIGMA_TERM,
]

function buildDetail(card: PromoOfferCard): PromoOfferDetail {
  return {
    ...card,
    productLabel: 'Product',
    // CMS placeholder copy from Figma Landing-page-SEO
    heroTitle: 'H1 Lorem ipsum dolor sit amet. Ut consequatur laboriosam no',
    intro: FIGMA_LOREM_INTRO,
    ctaLabel: 'Button',
    bannerImage: DEFAULT_PROMO_BANNER,
    sections: [
      {
        heading: 'H2 Lorem ipsum dolor sit amet (Subtitle)',
        body: FIGMA_LOREM_SHORT,
      },
      {
        heading: 'H2 Lorem ipsum dolor sit amet (Subtitle)',
        body: FIGMA_LOREM_LONG,
      },
    ],
    terms: DEFAULT_TERMS,
  }
}

const DETAIL_BY_SLUG: Record<string, PromoOfferDetail> = Object.fromEntries(
  ALL_PROMO_OFFERS.map((card) => [card.slug, buildDetail(card)])
)

export function getPromoOfferBySlug(slug: string): PromoOfferDetail | null {
  return DETAIL_BY_SLUG[slug] ?? null
}

export function promoOfferPath(slug: string): string {
  return `/promotions/${slug}`
}

/** True when path segment is a CMS promo offer (not my-bonus / contests / etc.) */
export function isPromoOfferSlug(slug: string): boolean {
  return getPromoOfferBySlug(slug) != null
}

/** Extract CMS offer slug from `/promotions/:slug` (null for sections / list). */
export function getPromoOfferSlugFromPath(pathname: string | null | undefined): string | null {
  if (!pathname) return null
  const match = pathname.match(/^\/promotions\/([^/]+)\/?$/)
  if (!match) return null
  const slug = match[1]
  // Reserved section routes stay as shell sections, not offer pages
  if (
    slug === 'my-bonus' ||
    slug === 'bonus' ||
    slug === 'contests' ||
    slug === 'refer-a-friend' ||
    slug === 'refer' ||
    slug === 'raf' ||
    slug === 'promos' ||
    slug === 'all' ||
    slug === 'offer'
  ) {
    return null
  }
  return isPromoOfferSlug(slug) ? slug : null
}
