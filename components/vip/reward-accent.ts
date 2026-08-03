/** Shared accent colors for VIP reward icons — muted, low-chroma chips. */

import type { CSSProperties } from 'react'

export type RewardAccent = {
  from: string
  to: string
}

/** Soft mid-tones — enough hue to differentiate, not neon. */
const PALETTE: RewardAccent[] = [
  { from: '#3f8f6e', to: '#2d6b52' }, // sage green
  { from: '#7a6bb0', to: '#5a4f88' }, // dusty violet
  { from: '#c4a05a', to: '#9a7a3c' }, // antique gold
  { from: '#c46b76', to: '#9a4552' }, // muted rose
  { from: '#4f8f9c', to: '#3a6d78' }, // slate teal
  { from: '#c4895a', to: '#9a6840' }, // warm amber
  { from: '#5f7eb0', to: '#456088' }, // soft steel blue
  { from: '#a87494', to: '#835a72' }, // dusty mauve
]

/** Stable color by reward label / id */
export function rewardAccentFor(key: string): RewardAccent {
  const normalized = key.trim().toLowerCase()
  const known: Record<string, RewardAccent> = {
    'daily cash race': PALETTE[0],
    'birthday rewards': PALETTE[1],
    reloads: PALETTE[2],
    'bet & get': PALETTE[3],
    'cash drop code': PALETTE[1],
    'cash drops': PALETTE[1],
    'monthly cash boost': PALETTE[5],
    'post-monthly cash boost': PALETTE[6],
    'weekly cash boost': PALETTE[0],
    'level up bonuses': PALETTE[3],
    'level up bonus': PALETTE[3],
    'poker rakeback': PALETTE[7],
    rakeback: PALETTE[7],
    'dedicated vip team': PALETTE[1],
    'prioritized withdrawals': PALETTE[4],
    'free crypto withdrawals': PALETTE[0],
    'reduced deposit fees': PALETTE[5],
    'exclusive refer-a-friend': PALETTE[6],
    'refer-a-friend': PALETTE[6],
    'refer a friend': PALETTE[6],
    'tailored gifts & rewards': PALETTE[3],
    'exclusive events': PALETTE[7],
    'personal account manager': PALETTE[1],
    'vip concierge': PALETTE[2],
    'private events': PALETTE[3],
    'all platinum i - iii benefits': PALETTE[4],
    'all diamond i - iii benefits': PALETTE[0],
    'all elite i - iii benefits': PALETTE[1],
    'all black i - iii benefits': PALETTE[5],
    'instant rakeback': PALETTE[7],
    'weekly boost': PALETTE[0],
    'monthly bonus': PALETTE[5],
    'post-monthly': PALETTE[6],
    'monthly reload': PALETTE[2],
    'post-monthly reload': PALETTE[6],
    'special reload': PALETTE[3],
    'post-monthly boost': PALETTE[6],
    'monthly boost': PALETTE[5],
    'special boost': PALETTE[3],
    'quarterly bonus': PALETTE[4],
    'free bet': PALETTE[0],
    'free spins': PALETTE[1],
    lossback: PALETTE[3],
    'vip bonus': PALETTE[2],
    'weekly-monthly': PALETTE[0],
    'weekly & monthly rewards': PALETTE[0],
    'cash-drops': PALETTE[1],
    'level-up': PALETTE[3],
  }

  if (known[normalized]) return known[normalized]

  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}

export function rewardAccentStyle(key: string): CSSProperties {
  const { from, to } = rewardAccentFor(key)
  return { background: `linear-gradient(165deg, ${from} 0%, ${to} 100%)` }
}
