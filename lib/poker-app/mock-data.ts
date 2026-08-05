export type PokerTab = 'lobby' | 'cash' | 'tourneys' | 'sng' | 'windfalls'

export type PromoTile = {
  id: string
  title: string
  subtitle?: string
  value?: string
  tone?: 'default' | 'accent' | 'muted'
}

export type QuickSeat = {
  id: string
  label: string
  stakes: string
  game: string
  buyIn: number
  badge?: string
  action: 'join' | 'register'
}

export type FeaturedEvent = {
  id: string
  title: string
  game: string
  startsIn: string
  buyIn: string
}

export type CashRow = {
  id: string
  max: 2 | 6 | 8 | 9
  game: string
  stakes: string
  players: number
  featured?: boolean
}

export type TourneyRow = {
  id: string
  start: string
  game: string
  name: string
  buyIn: string
  players: string
  prize: string
  status: 'register' | 'running' | 'late' | 'announced'
}

export type SngRow = {
  id: string
  name: string
  game: string
  buyIn: string
  seats: string
  status: string
}

export type WindfallCard = {
  id: string
  game: string
  buyIn: string
  winUpTo: string
  seated: string
}

export const LOBBY_PROMOS: PromoTile[] = [
  { id: '1', title: 'Bad Beat Jackpot', subtitle: 'NLHE $50', value: '$18,033', tone: 'accent' },
  { id: '2', title: 'My Missions', subtitle: 'Complete & earn', tone: 'default' },
  { id: '3', title: 'Community', subtitle: 'Join Telegram', tone: 'muted' },
  { id: '4', title: 'Rakeback', subtitle: 'Cash back on rake', tone: 'muted' },
  { id: '5', title: 'Welcome Package', subtitle: 'New player offer', tone: 'default' },
  { id: '6', title: 'Refer-A-Friend', subtitle: 'Earn 10% commission', tone: 'muted' },
]

export const QUICK_SEATS: QuickSeat[] = [
  {
    id: 'qs1',
    label: '6 MAX',
    stakes: '$0.05 / $0.10',
    game: "No Limit Hold'em",
    buyIn: 10,
    badge: 'Boost',
    action: 'join',
  },
  {
    id: 'qs2',
    label: '6 MAX',
    stakes: '$0.10 / $0.25',
    game: "No Limit Hold'em",
    buyIn: 25,
    action: 'join',
  },
  {
    id: 'qs3',
    label: '9 MAX',
    stakes: '$0.25 / $0.50',
    game: "No Limit Hold'em",
    buyIn: 50,
    badge: 'Jackpots',
    action: 'join',
  },
  {
    id: 'qs4',
    label: '6 MAX',
    stakes: '$0.50 / $1',
    game: '5-Card Omaha',
    buyIn: 100,
    badge: '5-Card',
    action: 'join',
  },
  {
    id: 'qs5',
    label: 'SNG',
    stakes: '$5 + $0.50',
    game: 'Mystery Bounty',
    buyIn: 5.5,
    action: 'register',
  },
]

export const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    id: 'fe1',
    title: '$100,000 GTD Main Event',
    game: "NL Hold'em",
    startsIn: '5d 7h',
    buyIn: '$55',
  },
  {
    id: 'fe2',
    title: 'Sunday Showdown PKO',
    game: "NL Hold'em",
    startsIn: '2d 14h',
    buyIn: '$22',
  },
  {
    id: 'fe3',
    title: 'Casino $5,000 GTD Freeroll',
    game: "NL Hold'em",
    startsIn: '14h 7m',
    buyIn: 'Ticket',
  },
  {
    id: 'fe4',
    title: 'Night Owl $10K GTD',
    game: 'PL Omaha',
    startsIn: '1d 3h',
    buyIn: '$33',
  },
]

export const CASH_ROWS: CashRow[] = [
  { id: 'c1', max: 6, game: "NL Hold'em", stakes: '$0.05 / $0.10', players: 15, featured: true },
  { id: 'c2', max: 6, game: "NL Hold'em", stakes: '$0.10 / $0.25', players: 22 },
  { id: 'c3', max: 9, game: "NL Hold'em", stakes: '$0.25 / $0.50', players: 31 },
  { id: 'c4', max: 6, game: "NL Hold'em", stakes: '$0.50 / $1', players: 18 },
  { id: 'c5', max: 8, game: 'PL Omaha', stakes: '$0.10 / $0.25', players: 9 },
  { id: 'c6', max: 6, game: 'PL Omaha', stakes: '$0.25 / $0.50', players: 12 },
  { id: 'c7', max: 2, game: "NL Hold'em", stakes: '$1 / $2', players: 4 },
  { id: 'c8', max: 6, game: "NL Hold'em", stakes: '$2 / $4', players: 8 },
]

export const TOURNEY_ROWS: TourneyRow[] = [
  {
    id: 't1',
    start: 'Today 18:00',
    game: "NL Hold'em",
    name: 'Casino $5,000 GTD Freeroll',
    buyIn: 'Ticket',
    players: '412 / 1,000',
    prize: '$5,000',
    status: 'register',
  },
  {
    id: 't2',
    start: 'Today 20:00',
    game: "NL Hold'em",
    name: 'Sunday Showdown PKO',
    buyIn: '$22',
    players: '186 / ∞',
    prize: '$25,000',
    status: 'register',
  },
  {
    id: 't3',
    start: 'Sat 15:00',
    game: "NL Hold'em",
    name: '$100,000 GTD Main Event',
    buyIn: '$55',
    players: '942 / ∞',
    prize: '$100,000',
    status: 'announced',
  },
  {
    id: 't4',
    start: 'Running',
    game: 'PL Omaha',
    name: 'Night Owl $10K GTD',
    buyIn: '$33',
    players: '128',
    prize: '$10,240',
    status: 'running',
  },
  {
    id: 't5',
    start: 'Running',
    game: "NL Hold'em",
    name: 'Bounty Maximizer $50',
    buyIn: '$55',
    players: '64',
    prize: '$8,800',
    status: 'late',
  },
  {
    id: 't6',
    start: 'Tomorrow 12:00',
    game: "NL Hold'em",
    name: 'Satellite to Main Event',
    buyIn: '$5.50',
    players: '48 / 90',
    prize: '3 seats',
    status: 'register',
  },
]

export const SNG_ROWS: SngRow[] = [
  {
    id: 's1',
    name: '8-Bomb — $0.25',
    game: "NL Hold'em",
    buyIn: '$0.25',
    seats: '6 / 8',
    status: 'Waiting for 2',
  },
  {
    id: 's2',
    name: 'Mystery Bounty — $0.25',
    game: "NL Hold'em",
    buyIn: '$0.25',
    seats: '2 / 3',
    status: 'Waiting for 1',
  },
  {
    id: 's3',
    name: 'Turbo Hyper — $1',
    game: "NL Hold'em",
    buyIn: '$1',
    seats: '4 / 6',
    status: 'Waiting for 2',
  },
  {
    id: 's4',
    name: 'Omaha Bomb — $3',
    game: 'PL Omaha',
    buyIn: '$3',
    seats: '1 / 6',
    status: 'Waiting for 5',
  },
]

export const WINDFALL_CARDS: WindfallCard[] = [
  { id: 'w1', game: "NL Hold'em", buyIn: '$0.25', winUpTo: '$10K', seated: '1 / 3' },
  { id: 'w2', game: "NL Hold'em", buyIn: '$1', winUpTo: '$25K', seated: '0 / 3' },
  { id: 'w3', game: "NL Hold'em", buyIn: '$3', winUpTo: '$40K', seated: '2 / 3' },
  { id: 'w4', game: "NL Hold'em", buyIn: '$5', winUpTo: '$60K', seated: '1 / 3' },
  { id: 'w5', game: "NL Hold'em", buyIn: '$15', winUpTo: '$100K', seated: '0 / 3' },
  { id: 'w6', game: 'CF Pineapple OH', buyIn: '$1', winUpTo: '$25K', seated: '0 / 3' },
  { id: 'w7', game: 'CF Pineapple OH', buyIn: '$3', winUpTo: '$40K', seated: '1 / 3' },
  { id: 'w8', game: "NL Hold'em", buyIn: '$25', winUpTo: '$150K', seated: '0 / 3' },
]

export const LOBBY_STATS = {
  players: 752,
  tables: 55,
  tournaments: 60,
}

export type LobbyBanner = {
  id: string
  eyebrow: string
  title: string
  body: string
  cta: string
  /** CSS background for the slide */
  wash: string
}

export const LOBBY_BANNERS: LobbyBanner[] = [
  {
    id: 'raf',
    eyebrow: 'Refer-A-Friend',
    title: 'Get an extra $25 cash',
    body: 'Plus 50% up to $100 cash when friends join and play.',
    cta: 'Learn more',
    wash: 'radial-gradient(ellipse at 15% 0%, rgba(238,53,54,0.35), transparent 55%), linear-gradient(135deg, #222 0%, #1a1a1a 100%)',
  },
  {
    id: 'mystery',
    eyebrow: 'Jackpot',
    title: 'Mystery Bounty Maximizer',
    body: 'Progressive bounty pools on eligible Sit & Go and cash games.',
    cta: 'View games',
    wash: 'radial-gradient(ellipse at 80% 20%, rgba(238,53,54,0.22), transparent 50%), linear-gradient(135deg, #252525 0%, #1a1a1a 100%)',
  },
  {
    id: 'main',
    eyebrow: 'Featured',
    title: '$100,000 GTD Main Event',
    body: 'Sunday series flagship. Satellites running all week.',
    cta: 'Register',
    wash: 'radial-gradient(ellipse at 40% 100%, rgba(255,255,255,0.08), transparent 45%), linear-gradient(135deg, #2a2222 0%, #1a1a1a 100%)',
  },
  {
    id: 'missions',
    eyebrow: 'Missions',
    title: 'Complete missions. Earn rewards.',
    body: 'Daily and weekly challenges with cash and ticket prizes.',
    cta: 'Open missions',
    wash: 'radial-gradient(ellipse at 0% 50%, rgba(238,53,54,0.18), transparent 50%), linear-gradient(135deg, #222 0%, #1a1a1a 100%)',
  },
]
