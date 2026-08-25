/** Sidebar section ids used by the casino Promotions shell */
export type PromoSidebarSection =
  | 'Promos'
  | 'My Bonus'
  | 'Contests'
  | 'Refer A Friend'

const SECTION_TO_SLUG: Record<PromoSidebarSection, string | null> = {
  Promos: null,
  'My Bonus': 'my-bonus',
  Contests: 'contests',
  'Refer A Friend': 'refer-a-friend',
}

const SLUG_TO_SECTION: Record<string, PromoSidebarSection> = {
  all: 'Promos',
  promos: 'Promos',
  'my-bonus': 'My Bonus',
  bonus: 'My Bonus',
  contests: 'Contests',
  'refer-a-friend': 'Refer A Friend',
  refer: 'Refer A Friend',
  raf: 'Refer A Friend',
}

export function promoSectionToSlug(section: string): string | null {
  return SECTION_TO_SLUG[section as PromoSidebarSection] ?? null
}

export function promoSlugToSection(slug: string): PromoSidebarSection | null {
  const key = slug.trim().toLowerCase()
  return SLUG_TO_SECTION[key] ?? null
}

/** Path for deep links / URL sync while Promotions is open */
export function promoPathForSection(section: string): string {
  const slug = promoSectionToSlug(section)
  return slug ? `/promotions/${slug}` : '/promotions'
}

export const PROMO_SECTION_PATHS = {
  all: '/promotions',
  myBonus: '/promotions/my-bonus',
  contests: '/promotions/contests',
  referAFriend: '/promotions/refer-a-friend',
  /** CMS promo detail: `/promotions/:slug` */
  offer: (slug: string) => `/promotions/${slug}`,
} as const
