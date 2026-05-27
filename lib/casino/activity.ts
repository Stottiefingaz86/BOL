export type CasinoActivityTab =
  | 'All Bets'
  | 'Jackpot Winners'
  | 'High Rollers'
  | 'Daily Race'

export const CASINO_ACTIVITY_TABS: CasinoActivityTab[] = [
  'All Bets',
  'Jackpot Winners',
  'High Rollers',
  'Daily Race',
]

export interface CasinoActivityRow {
  id: string
  game: string
  user: string
  time: string
  betAmount: string
  winAmount?: string
  gameImage: string
}

export const CASINO_ACTIVITY_GAMES: { name: string; image: string }[] = [
  { name: 'Razor Shark', image: '/games/square/takeTheBank.png' },
  { name: 'Book of Dead', image: '/games/square/goldNuggetRush.png' },
  { name: 'Starburst', image: '/games/square/megacrush.png' },
  { name: 'Mega Moolah', image: '/games/square/mrMammoth.png' },
  { name: 'Sweet Bonanza', image: '/games/square/cocktailWheel.png' },
  { name: "Gonzo's Quest", image: '/games/square/goldNuggetRush2.png' },
  { name: 'Big Bass Bonanza', image: '/games/square/hookedOnFishing.png' },
  { name: 'Gold Nugget Rush', image: '/games/square/goldNuggetRush.png' },
  { name: 'Mega Fortune', image: '/games/square/megacrush.png' },
  { name: 'Gates of Olympus', image: '/games/square/game8.png' },
]

const GAME_IMAGE_BY_NAME = new Map(
  CASINO_ACTIVITY_GAMES.map((g) => [g.name.toLowerCase(), g.image])
)

export function gameImageForName(gameName: string): string {
  return (
    GAME_IMAGE_BY_NAME.get(gameName.toLowerCase()) ??
    CASINO_ACTIVITY_GAMES[0].image
  )
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** Static jackpot-winner rows for the Jackpot Winners tab */
export const JACKPOT_ACTIVITY_ROWS: CasinoActivityRow[] = [
  {
    id: 'jp1',
    game: 'Mega Moolah',
    user: 'LuckyBet',
    time: '04:12 PM',
    betAmount: '$2.00',
    winAmount: '$250,000.00',
    gameImage: gameImageForName('Mega Moolah'),
  },
  {
    id: 'jp2',
    game: 'Sweet Bonanza',
    user: 'Hidden',
    time: '03:58 PM',
    betAmount: '$1.50',
    winAmount: '$87,432.50',
    gameImage: gameImageForName('Sweet Bonanza'),
  },
  {
    id: 'jp3',
    game: 'Gates of Olympus',
    user: 'CasinoKing',
    time: '03:41 PM',
    betAmount: '$2.00',
    winAmount: '$45,120.00',
    gameImage: gameImageForName('Gates of Olympus'),
  },
  {
    id: 'jp4',
    game: 'Book of Dead',
    user: 'Hidden',
    time: '03:22 PM',
    betAmount: '$2.00',
    winAmount: '$32,750.00',
    gameImage: gameImageForName('Book of Dead'),
  },
  {
    id: 'jp5',
    game: 'Razor Shark',
    user: 'HighRoller',
    time: '02:55 PM',
    betAmount: '$2.50',
    winAmount: '$15,230.00',
    gameImage: gameImageForName('Razor Shark'),
  },
  {
    id: 'jp6',
    game: 'Starburst',
    user: 'GamerX',
    time: '02:31 PM',
    betAmount: '$1.00',
    winAmount: '$28,900.75',
    gameImage: gameImageForName('Starburst'),
  },
]
