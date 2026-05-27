export interface JackpotWinner {
  id: string
  username: string
  tier: string
  amount: number
  game: string
  ago: string
}

export interface MustDropWinner {
  id: string
  username: string
  game: string
  amount: number
  droppedAt: string
}

export const RECENT_JACKPOT_WINNERS: JackpotWinner[] = [
  { id: '1', username: 'Mike***', tier: 'Major', amount: 48250.15, game: 'Gold Nugget Rush', ago: '12m ago' },
  { id: '2', username: 'Sarah***', tier: 'Mini', amount: 1284.5, game: 'Starburst', ago: '28m ago' },
  { id: '3', username: 'BigWin***', tier: 'Mega', amount: 284750.9, game: 'Mega Fortune', ago: '1h ago' },
  { id: '4', username: 'Lucky7***', tier: 'Minor', amount: 8420.88, game: 'Sweet Bonanza', ago: '2h ago' },
  { id: '5', username: 'Ace***', tier: 'Network', amount: 1245890.25, game: 'Gates of Olympus', ago: '4h ago' },
]

export const MUST_DROP_RECENT: MustDropWinner[] = [
  {
    id: '1',
    username: 'crypto_jay',
    game: 'Midas Mega Reels',
    amount: 6240.8,
    droppedAt: 'Yesterday · 23:47 UTC',
  },
  {
    id: '2',
    username: 'slot_queen',
    game: 'Gold Nugget Rush',
    amount: 5892.15,
    droppedAt: 'Yesterday · 21:12 UTC',
  },
  {
    id: '3',
    username: 'highroller99',
    game: 'Sweet Bonanza',
    amount: 7120.0,
    droppedAt: '2 days ago · 22:05 UTC',
  },
  {
    id: '4',
    username: 'lucky_spin',
    game: 'Gonzo\'s Quest',
    amount: 4550.25,
    droppedAt: '3 days ago · 23:58 UTC',
  },
  {
    id: '5',
    username: 'mega_fan',
    game: 'Starburst',
    amount: 6780.5,
    droppedAt: '4 days ago · 20:34 UTC',
  },
]
