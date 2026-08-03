'use client'

import { create } from 'zustand'

export const REFERRAL_REWARD_ID = 'refer-a-friend'
export const REFERRAL_INITIAL_CLAIMABLE = 40
export const REFERRAL_COMMISSION_RATE = '10%'

export type ReferralStatus = 'pending' | 'joined'

export type ReferralRow = {
  id: string
  nick: string
  email?: string
  registered: string
  vipLevel: string
  totalDeposits: string
  wagered: string
  claimed: string
  rate: string
  commission: number
  status: ReferralStatus
}

const SEED_REFERRALS: ReferralRow[] = [
  {
    id: 'seed-1',
    nick: '******eff',
    registered: '20/04/2026',
    vipLevel: 'Bronze',
    totalDeposits: '$25.00',
    wagered: '—',
    claimed: '$1.00',
    rate: '10%',
    commission: 0,
    status: 'joined',
  },
  {
    id: 'seed-2',
    nick: '******sso',
    registered: '17/04/2026',
    vipLevel: 'Black I',
    totalDeposits: '$100.00',
    wagered: '$41.01',
    claimed: '$4.00',
    rate: '10%',
    commission: 0.08,
    status: 'joined',
  },
  {
    id: 'seed-3',
    nick: '******a24',
    registered: '11/04/2026',
    vipLevel: 'Elite II',
    totalDeposits: '$150.00',
    wagered: '$41.01',
    claimed: '$5.00',
    rate: '10%',
    commission: 0.2,
    status: 'joined',
  },
  {
    id: 'seed-4',
    nick: '******ily',
    registered: '02/04/2026',
    vipLevel: 'Gold',
    totalDeposits: '$500.00',
    wagered: '$340.50',
    claimed: '$5.00',
    rate: '10%',
    commission: 5,
    status: 'joined',
  },
  {
    id: 'seed-5',
    nick: '******k9r',
    registered: '28/03/2026',
    vipLevel: 'Silver',
    totalDeposits: '$200.00',
    wagered: '$88.40',
    claimed: '$12.00',
    rate: '10%',
    commission: 1.15,
    status: 'joined',
  },
  {
    id: 'seed-6',
    nick: '******mx7',
    registered: '22/03/2026',
    vipLevel: 'Bronze',
    totalDeposits: '$50.00',
    wagered: '$22.10',
    claimed: '$2.00',
    rate: '10%',
    commission: 0.45,
    status: 'joined',
  },
  {
    id: 'seed-7',
    nick: '******tjn',
    registered: '15/03/2026',
    vipLevel: 'Platinum I',
    totalDeposits: '$750.00',
    wagered: '$512.00',
    claimed: '$28.00',
    rate: '10%',
    commission: 8.4,
    status: 'joined',
  },
  {
    id: 'seed-8',
    nick: '******w2p',
    registered: '08/03/2026',
    vipLevel: 'Gold',
    totalDeposits: '$320.00',
    wagered: '$190.25',
    claimed: '$9.50',
    rate: '10%',
    commission: 2.75,
    status: 'joined',
  },
  {
    id: 'seed-9',
    nick: '******qol',
    registered: '01/03/2026',
    vipLevel: 'Silver',
    totalDeposits: '$80.00',
    wagered: '—',
    claimed: '$0.00',
    rate: '10%',
    commission: 0,
    status: 'joined',
  },
  {
    id: 'seed-10',
    nick: '******hz4',
    registered: '20/02/2026',
    vipLevel: 'Elite I',
    totalDeposits: '$1,200.00',
    wagered: '$880.00',
    claimed: '$45.00',
    rate: '10%',
    commission: 12.2,
    status: 'joined',
  },
]

function formatInviteDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  if (!domain) return '******'
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}******@${domain}`
}

type ReferralStore = {
  claimableAmount: number
  referrals: ReferralRow[]
  claimCommission: () => number
  addPendingInvite: (input: {
    firstName: string
    lastName: string
    email: string
  }) => ReferralRow | null
}

export const useReferralStore = create<ReferralStore>((set, get) => ({
  claimableAmount: REFERRAL_INITIAL_CLAIMABLE,
  referrals: SEED_REFERRALS,

  claimCommission: () => {
    const amount = get().claimableAmount
    if (amount <= 0) return 0
    set({ claimableAmount: 0 })
    return amount
  },

  addPendingInvite: ({ firstName, lastName, email }) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return null

    const existing = get().referrals.find(
      (row) => row.email?.toLowerCase() === normalizedEmail && row.status === 'pending'
    )
    if (existing) return null

    const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
    const row: ReferralRow = {
      id: `invite-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nick: displayName || maskEmail(normalizedEmail),
      email: normalizedEmail,
      registered: formatInviteDate(),
      vipLevel: '—',
      totalDeposits: '—',
      wagered: '—',
      claimed: '—',
      rate: REFERRAL_COMMISSION_RATE,
      commission: 0,
      status: 'pending',
    }

    set((state) => ({
      referrals: [row, ...state.referrals],
    }))
    return row
  },
}))
