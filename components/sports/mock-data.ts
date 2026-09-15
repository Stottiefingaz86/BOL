export type SportId =
  | 'home'
  | 'football'
  | 'soccer'
  | 'basketball'
  | 'baseball'
  | 'hockey'
  | 'tennis'
  | 'mma'
  | 'golf'
  | 'racing'

export type MarketFilter = 'events' | 'outrights' | 'leagues'

export interface SportChip {
  id: SportId
  label: string
  icon: string
}

export interface PopularEvent {
  id: string
  /** The SportsEvent this card opens (`/sports/event/:eventId`). */
  eventId: string
  league: string
  leagueIcon: string
  country: string
  clock: string
  isLive: boolean
  home: { name: string; code: string; logo: string; score: number; percent: number }
  away: { name: string; code: string; logo: string; score: number; percent: number }
  marketLabel: string
}

export interface OddsCell {
  id: string
  /** Line / selection shown above the price, e.g. "+6.5", "O 158", "SEA", "1" */
  line?: string
  odds: string
}

/** One market column: label above a vertical stack of selections (one per participant). */
export interface MarketColumn {
  id: string
  name: string
  cells: OddsCell[]
}

export interface SportsEvent {
  id: string
  leagueId: string
  clock: string
  /** Secondary line under the clock for pre-match, e.g. "8:00pm" */
  clockSub?: string
  isLive: boolean
  home: { name: string; code: string; logo: string; score?: number }
  away: { name: string; code: string; logo: string; score?: number }
  markets: MarketColumn[]
}

export interface LeagueGroup {
  id: string
  title: string
  subtitle: string
  icon: string
  sport: SportId
  events: SportsEvent[]
}

export interface PromoBanner {
  id: string
  title: string
  subtitle: string
  cta: string
  image: string
  tone: 'red' | 'dark' | 'gold'
}

export const SPORT_CHIPS: SportChip[] = [
  { id: 'home', label: 'Sports Home', icon: '/sports_icons/all sports.svg' },
  { id: 'football', label: 'Football', icon: '/sports_icons/football.svg' },
  { id: 'soccer', label: 'Soccer', icon: '/sports_icons/soccer.svg' },
  { id: 'basketball', label: 'Basketball', icon: '/sports_icons/Basketball.svg' },
  { id: 'baseball', label: 'Baseball', icon: '/sports_icons/baseball.svg' },
  { id: 'hockey', label: 'Hockey', icon: '/sports_icons/Hockey.svg' },
  { id: 'tennis', label: 'Tennis', icon: '/sports_icons/tennis.svg' },
  { id: 'mma', label: 'MMA', icon: '/sports_icons/mma.svg' },
  { id: 'golf', label: 'Golf', icon: '/sports_icons/Golf.svg' },
  { id: 'racing', label: 'Racing', icon: '/sports_icons/Horse-Racing-101.svg' },
]

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'spins',
    title: '100 Free Spins',
    subtitle: 'On your first deposit today',
    cta: 'Claim Now',
    image: '/banners/freespins.png',
    tone: 'red',
  },
  {
    id: 'reload',
    title: 'Weekly Reload',
    subtitle: 'Boost every deposit this week',
    cta: 'Get Bonus',
    image: '/banners/weekly.png',
    tone: 'dark',
  },
  {
    id: 'claim',
    title: 'Daily Cash Drop',
    subtitle: 'Enter your code before it expires',
    cta: 'Enter Code',
    image: '/banners/claim.png',
    tone: 'gold',
  },
]

const nfl = (slug: string) => `https://a.espncdn.com/i/teamlogos/nfl/500/${slug}.png`
const ncaa = (id: number) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`


/** Full American-football market set matching the Figma desktop row. */
function footballMarkets(
  id: string,
  homeCode: string,
  awayCode: string,
  spread: string,
  total: string,
  mlHome: string,
  mlAway: string
): MarketColumn[] {
  const neg = spread.startsWith('-') ? spread : `-${spread.replace('+', '')}`
  const pos = spread.startsWith('+') ? spread : `+${spread.replace('-', '')}`
  const col = (key: string, name: string, cells: [string, string, string, string]): MarketColumn => ({
    id: `${id}-${key}`,
    name,
    cells: [
      { id: `${id}-${key}-h`, line: cells[0], odds: cells[1] },
      { id: `${id}-${key}-a`, line: cells[2], odds: cells[3] },
    ],
  })
  return [
    col('spread', 'Spread', [pos, '-110', neg, '-110']),
    col('ml', 'Moneyline', [homeCode, mlHome, awayCode, mlAway]),
    col('total', 'Total', [`O ${total}`, '-115', `U ${total}`, '-105']),
    col('1h-spread', '1st Half Spread', ['+3.5', '-115', '-3.5', '-105']),
    col('1h-ml', '1st Half Moneyline', [homeCode, '-110', awayCode, '+120']),
    col('1h-total', '1st Half Total', ['O 79.5', '-110', 'U 79.5', '-105']),
    col('1q-spread', '1st Quarter Spread', ['+1.5', '-115', '-1.5', '-115']),
    col('1q-total', '1st Quarter Total', ['O 40', '-120', 'U 40', '-120']),
    col('team-total-h', 'Team Total Home', ['O 24.5', '-120', 'U 24.5', '-120']),
    col('team-total-a', 'Team Total Away', ['O 21.5', '-120', 'U 21.5', '-120']),
  ]
}

export const FOOTBALL_LEAGUES: LeagueGroup[] = [
  {
    id: 'nfl',
    title: 'NFL',
    subtitle: 'USA',
    icon: '/banners/sports_league/NFL.svg',
    sport: 'football',
    events: [
      {
        id: 'nfl-1',
        leagueId: 'nfl',
        clock: 'Q2, 5:02',
        isLive: true,
        home: { name: 'Seattle Seahawks', code: 'SEA', logo: nfl('sea'), score: 15 },
        away: { name: 'New England Patriots', code: 'NE', logo: nfl('ne'), score: 4 },
        markets: footballMarkets('nfl-1', 'SEA', 'NE', '+6.5', '158', '-110', '+350'),
      },
      {
        id: 'nfl-2',
        leagueId: 'nfl',
        clock: 'Q1, 9:32',
        isLive: true,
        home: { name: 'Los Angeles Rams', code: 'LAR', logo: nfl('lar'), score: 10 },
        away: { name: 'San Francisco 49ers', code: 'SF', logo: nfl('sf'), score: 8 },
        markets: footballMarkets('nfl-2', 'LAR', 'SF', '+6.5', '158', '-110', '+350'),
      },
      {
        id: 'nfl-3',
        leagueId: 'nfl',
        clock: 'Q1, 8:44',
        isLive: true,
        home: { name: 'Tennessee Titans', code: 'TEN', logo: nfl('ten'), score: 5 },
        away: { name: 'Philadelphia Eagles', code: 'PHI', logo: nfl('phi'), score: 4 },
        markets: footballMarkets('nfl-3', 'TEN', 'PHI', '+6.5', '158', '-110', '+350'),
      },
      {
        id: 'nfl-4',
        leagueId: 'nfl',
        clock: '9:30pm',
        isLive: false,
        home: { name: 'Detroit Lions', code: 'DET', logo: nfl('det') },
        away: { name: 'New Orleans Saints', code: 'NO', logo: nfl('no') },
        markets: footballMarkets('nfl-4', 'DET', 'NO', '+6.5', '158', '-110', '+350'),
      },
      {
        id: 'nfl-5',
        leagueId: 'nfl',
        clock: 'Saturday',
        clockSub: '8:00pm',
        isLive: false,
        home: { name: 'Cincinnati Bengals', code: 'CIN', logo: nfl('cin') },
        away: { name: 'Tampa Bay Buccaneers', code: 'TB', logo: nfl('tb') },
        markets: footballMarkets('nfl-5', 'CIN', 'TB', '+6.5', '158', '-110', '+350'),
      },
    ],
  },
  {
    id: 'ncaa',
    title: 'NCAA',
    subtitle: 'USA',
    icon: '/banners/sports_league/NFL.svg',
    sport: 'football',
    events: [
      {
        id: 'ncaa-1',
        leagueId: 'ncaa',
        clock: 'Q2, 5:55',
        isLive: true,
        home: { name: 'Missouri Tigers', code: 'MIS', logo: ncaa(142), score: 8 },
        away: { name: 'Arkansas Pine Bluff Golden Lions', code: 'ARK', logo: ncaa(2029), score: 10 },
        markets: footballMarkets('ncaa-1', 'MIS', 'ARK', '+6.5', '158', '-110', '+350'),
      },
    ],
  },
]

/** Basketball market set — same two-row layout as football. */
function basketballMarkets(
  id: string,
  homeCode: string,
  awayCode: string,
  spread: string,
  total: string,
  mlHome: string,
  mlAway: string
): MarketColumn[] {
  const neg = spread.startsWith('-') ? spread : `-${spread.replace('+', '')}`
  const pos = spread.startsWith('+') ? spread : `+${spread.replace('-', '')}`
  const col = (key: string, name: string, cells: [string, string, string, string]): MarketColumn => ({
    id: `${id}-${key}`,
    name,
    cells: [
      { id: `${id}-${key}-h`, line: cells[0], odds: cells[1] },
      { id: `${id}-${key}-a`, line: cells[2], odds: cells[3] },
    ],
  })
  return [
    col('spread', 'Spread', [pos, '-110', neg, '-110']),
    col('ml', 'Moneyline', [homeCode, mlHome, awayCode, mlAway]),
    col('total', 'Total', [`O ${total}`, '-110', `U ${total}`, '-110']),
    col('1h-spread', '1st Half Spread', ['+2.5', '-110', '-2.5', '-110']),
    col('1h-ml', '1st Half Moneyline', [homeCode, '+105', awayCode, '-125']),
    col('1h-total', '1st Half Total', ['O 112.5', '-110', 'U 112.5', '-110']),
    col('1q-spread', '1st Quarter Spread', ['+1.5', '-110', '-1.5', '-110']),
    col('1q-total', '1st Quarter Total', ['O 56.5', '-110', 'U 56.5', '-110']),
    col('team-total-h', 'Team Total Home', ['O 112.5', '-115', 'U 112.5', '-105']),
    col('team-total-a', 'Team Total Away', ['O 110.5', '-115', 'U 110.5', '-105']),
  ]
}

const nba = (slug: string) => `https://a.espncdn.com/i/teamlogos/nba/500/${slug}.png`

export const BASKETBALL_LEAGUES: LeagueGroup[] = [
  {
    id: 'nba',
    title: 'NBA',
    subtitle: 'USA',
    icon: '/banners/sports_league/nba.svg',
    sport: 'basketball',
    events: [
      {
        id: 'nba-1',
        leagueId: 'nba',
        clock: 'Q3, 7:41',
        isLive: true,
        home: { name: 'Boston Celtics', code: 'BOS', logo: nba('bos'), score: 78 },
        away: { name: 'Los Angeles Lakers', code: 'LAL', logo: nba('lal'), score: 72 },
        markets: basketballMarkets('nba-1', 'BOS', 'LAL', '-4.5', '224.5', '-190', '+160'),
      },
      {
        id: 'nba-2',
        leagueId: 'nba',
        clock: 'Q2, 2:15',
        isLive: true,
        home: { name: 'Golden State Warriors', code: 'GSW', logo: nba('gs'), score: 51 },
        away: { name: 'Denver Nuggets', code: 'DEN', logo: nba('den'), score: 55 },
        markets: basketballMarkets('nba-2', 'GSW', 'DEN', '+1.5', '231.5', '+100', '-120'),
      },
      {
        id: 'nba-3',
        leagueId: 'nba',
        clock: '7:30pm',
        isLive: false,
        home: { name: 'Milwaukee Bucks', code: 'MIL', logo: nba('mil') },
        away: { name: 'Miami Heat', code: 'MIA', logo: nba('mia') },
        markets: basketballMarkets('nba-3', 'MIL', 'MIA', '-6.5', '219.5', '-260', '+210'),
      },
      {
        id: 'nba-4',
        leagueId: 'nba',
        clock: 'Tomorrow',
        clockSub: '8:00pm',
        isLive: false,
        home: { name: 'New York Knicks', code: 'NYK', logo: nba('ny') },
        away: { name: 'Philadelphia 76ers', code: 'PHI', logo: nba('phi') },
        markets: basketballMarkets('nba-4', 'NYK', 'PHI', '-2.5', '215.5', '-140', '+120'),
      },
    ],
  },
]

export const ALL_LEAGUES: LeagueGroup[] = [...FOOTBALL_LEAGUES, ...BASKETBALL_LEAGUES]

export function findEventById(id: string): { event: SportsEvent; league: LeagueGroup } | null {
  for (const league of ALL_LEAGUES) {
    const event = league.events.find((e) => e.id === id)
    if (event) return { event, league }
  }
  return null
}

/** Implied win probability (%) from American moneyline odds. */
function impliedPercent(odds: string): number {
  const n = parseFloat(odds)
  if (Number.isNaN(n) || n === 0) return 50
  const p = n > 0 ? 100 / (n + 100) : -n / (-n + 100)
  return Math.round(p * 100)
}

function toPopular(event: SportsEvent, league: LeagueGroup): PopularEvent {
  const ml = event.markets.find((m) => /^moneyline$/i.test(m.name))
  const homePct = impliedPercent(ml?.cells[0]?.odds ?? '-110')
  return {
    id: `pop-${event.id}`,
    eventId: event.id,
    league: league.title,
    leagueIcon: league.icon,
    country: league.subtitle,
    clock: event.clock,
    isLive: event.isLive,
    home: { ...event.home, score: event.home.score ?? 0, percent: homePct },
    away: { ...event.away, score: event.away.score ?? 0, percent: 100 - homePct },
    marketLabel: 'Moneyline',
  }
}

/** Popular Events rail — the live events across all leagues, so every card opens a real event page. */
export const POPULAR_EVENTS: PopularEvent[] = ALL_LEAGUES.flatMap((league) =>
  league.events.filter((e) => e.isLive).map((e) => toPopular(e, league))
)
