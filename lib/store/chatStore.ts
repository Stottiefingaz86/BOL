import { create } from 'zustand'

// ─── Types ───────────────────────────────────────────────
export type ChatRoom = 'casino' | 'sports'

export interface ChatUser {
  id: string
  username: string
  avatar?: string
  badge?: 'vip' | 'mod' | 'high-roller' | null
  vipLevel?: number
  isOnline: boolean
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar?: string
  badge?: 'vip' | 'mod' | 'high-roller' | null
  content: string
  timestamp: Date
  type: 'message' | 'tip' | 'rain' | 'bet-share' | 'system'
  mentions?: string[]
  reactions?: { emoji: string; count: number; userIds: string[] }[]
  // Tip-specific
  tipAmount?: number
  tipRecipient?: string
  // Bet share specific
  betSlip?: {
    type: 'single' | 'parlay'
    legs: { event: string; selection: string; odds: string }[]
    combinedOdds?: string
    potentialWin?: string
  }
}

export interface RainEvent {
  id: string
  amount: number
  currency: string
  countdown: number // seconds remaining
  participants: string[]
  isActive: boolean
  triggeredBy: 'system' | 'admin' | string
}

export interface TipState {
  isOpen: boolean
  targetUser: ChatUser | null
}

// ─── Store ───────────────────────────────────────────────
interface ChatState {
  // Panel state
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleChat: () => void

  // Active room
  activeRoom: ChatRoom
  setActiveRoom: (room: ChatRoom) => void

  // Messages per room
  casinoMessages: ChatMessage[]
  sportsMessages: ChatMessage[]
  addMessage: (room: ChatRoom, message: ChatMessage) => void

  // Online users per room
  casinoUsers: ChatUser[]
  sportsUsers: ChatUser[]
  setUsers: (room: ChatRoom, users: ChatUser[]) => void

  // Online count
  casinoOnlineCount: number
  sportsOnlineCount: number

  // User list panel
  showUserList: boolean
  setShowUserList: (show: boolean) => void

  // Rain
  activeRain: RainEvent | null
  setActiveRain: (rain: RainEvent | null) => void
  joinRain: (userId: string) => void

  // Tipping
  tipState: TipState
  openTipModal: (user: ChatUser) => void
  closeTipModal: () => void

  // Current user input
  inputMessage: string
  setInputMessage: (msg: string) => void

  // Emoji picker
  showEmojiPicker: boolean
  setShowEmojiPicker: (show: boolean) => void
}

// ─── Mock data for demo ──────────────────────────────────
const mockUsers: ChatUser[] = [
  { id: '1', username: 'HighRoller_Mike', badge: 'vip', vipLevel: 8, isOnline: true },
  { id: '2', username: 'Mod_Sarah', badge: 'mod', isOnline: true },
  { id: '3', username: 'LuckySpinner', badge: null, isOnline: true },
  { id: '4', username: 'BlackjackPro', badge: 'high-roller', isOnline: true },
  { id: '5', username: 'RouletteQueen', badge: null, isOnline: true },
  { id: '6', username: 'CardCounter88', badge: null, isOnline: true },
  { id: '7', username: 'SlotMachineKing', badge: 'vip', vipLevel: 3, isOnline: true },
  { id: '8', username: 'BetMaster2026', badge: null, isOnline: true },
  { id: '9', username: 'AceOfSpades', badge: 'vip', vipLevel: 5, isOnline: true },
  { id: '10', username: 'WinStreak99', badge: null, isOnline: false },
  { id: '11', username: 'PokerFace_Joe', badge: 'high-roller', isOnline: true },
  { id: '12', username: 'CryptoWhale', badge: 'vip', vipLevel: 10, isOnline: true },
]

const mockCasinoMessages: ChatMessage[] = [
  {
    id: 'cm1',
    userId: '1',
    username: 'HighRoller_Mike',
    badge: 'vip',
    content: 'Hey @LuckySpinner, great win on the slots! How much was it? 🎰',
    timestamp: new Date(Date.now() - 300000),
    type: 'message',
    mentions: ['LuckySpinner'],
  },
  {
    id: 'cm2',
    userId: '3',
    username: 'LuckySpinner',
    content: 'Thanks Mike! Just hit the major jackpot — 500x! Feeling lucky tonight 🔥',
    timestamp: new Date(Date.now() - 240000),
    type: 'message',
  },
  {
    id: 'cm3',
    userId: '2',
    username: 'Mod_Sarah',
    badge: 'mod',
    content: 'Reminder everyone: Please keep the chat respectful and follow community guidelines.',
    timestamp: new Date(Date.now() - 200000),
    type: 'message',
  },
  {
    id: 'cm4',
    userId: '4',
    username: 'BlackjackPro',
    badge: 'high-roller',
    content: 'Any open seats at the high stakes blackjack table?',
    timestamp: new Date(Date.now() - 160000),
    type: 'message',
  },
  {
    id: 'cm5',
    userId: '1',
    username: 'HighRoller_Mike',
    badge: 'vip',
    content: '',
    timestamp: new Date(Date.now() - 120000),
    type: 'tip',
    tipAmount: 25,
    tipRecipient: 'LuckySpinner',
  },
  {
    id: 'cm6',
    userId: '5',
    username: 'RouletteQueen',
    content: '@Mod_Sarah is the tournament schedule updated for the weekend?',
    timestamp: new Date(Date.now() - 80000),
    type: 'message',
    mentions: ['Mod_Sarah'],
  },
  {
    id: 'cm7',
    userId: '7',
    username: 'SlotMachineKing',
    badge: 'vip',
    content: 'Just won $2,500 on Gonzo\'s Quest! This slot is on fire today 🔥🔥',
    timestamp: new Date(Date.now() - 60000),
    type: 'message',
  },
  {
    id: 'cm8',
    userId: '12',
    username: 'CryptoWhale',
    badge: 'vip',
    content: 'Making it rain! 💰🌧️',
    timestamp: new Date(Date.now() - 40000),
    type: 'rain',
  },
  {
    id: 'cm9',
    userId: '9',
    username: 'AceOfSpades',
    badge: 'vip',
    content: 'GG everyone! The live blackjack table was insane tonight',
    timestamp: new Date(Date.now() - 20000),
    type: 'message',
  },
  {
    id: 'cm10',
    userId: '6',
    username: 'CardCounter88',
    content: 'Who\'s playing the new Pragmatic Play slot? The RTP looks solid',
    timestamp: new Date(Date.now() - 10000),
    type: 'message',
  },
]

const mockSportsMessages: ChatMessage[] = [
  {
    id: 'sm1',
    userId: '8',
    username: 'BetMaster2026',
    content: 'Chiefs -3.5 looking solid tonight. Who\'s riding with me? 🏈',
    timestamp: new Date(Date.now() - 350000),
    type: 'message',
  },
  {
    id: 'sm2',
    userId: '11',
    username: 'PokerFace_Joe',
    badge: 'high-roller',
    content: '',
    timestamp: new Date(Date.now() - 300000),
    type: 'bet-share',
    betSlip: {
      type: 'parlay',
      legs: [
        { event: 'KC Chiefs vs BUF Bills', selection: 'Chiefs -3.5', odds: '-110' },
        { event: 'KC Chiefs vs BUF Bills', selection: 'Over 47.5', odds: '-105' },
        { event: 'LAL Lakers vs BOS Celtics', selection: 'Lakers ML', odds: '-140' },
      ],
      combinedOdds: '+650',
      potentialWin: '$750',
    },
  },
  {
    id: 'sm3',
    userId: '1',
    username: 'HighRoller_Mike',
    badge: 'vip',
    content: 'That parlay is spicy 🌶️ I\'m tailing!',
    timestamp: new Date(Date.now() - 260000),
    type: 'message',
  },
  {
    id: 'sm4',
    userId: '2',
    username: 'Mod_Sarah',
    badge: 'mod',
    content: 'Great picks today! Remember to bet responsibly.',
    timestamp: new Date(Date.now() - 200000),
    type: 'message',
  },
  {
    id: 'sm5',
    userId: '4',
    username: 'BlackjackPro',
    badge: 'high-roller',
    content: 'Arsenal vs Man City should be a banger. Taking Arsenal ML at +250 🎯',
    timestamp: new Date(Date.now() - 150000),
    type: 'message',
  },
  {
    id: 'sm6',
    userId: '3',
    username: 'LuckySpinner',
    content: 'Anyone watching the Lakers game? LeBron dropping 40 tonight for sure',
    timestamp: new Date(Date.now() - 100000),
    type: 'message',
  },
  {
    id: 'sm7',
    userId: '9',
    username: 'AceOfSpades',
    badge: 'vip',
    content: '@BetMaster2026 nice call on the Chiefs! Already up 14-3 ✅',
    timestamp: new Date(Date.now() - 50000),
    type: 'message',
    mentions: ['BetMaster2026'],
  },
  {
    id: 'sm8',
    userId: '8',
    username: 'BetMaster2026',
    content: 'Let\'s goooo! 💰 Leg 1 of the parlay looking good',
    timestamp: new Date(Date.now() - 30000),
    type: 'message',
  },
]

// ─── Create Store ────────────────────────────────────────
export const useChatStore = create<ChatState>((set, get) => ({
  // Panel state
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  // Active room
  activeRoom: 'sports',
  setActiveRoom: (room) => set({ activeRoom: room }),

  // Messages
  casinoMessages: mockCasinoMessages,
  sportsMessages: mockSportsMessages,
  addMessage: (room, message) =>
    set((state) => {
      if (room === 'casino') {
        return { casinoMessages: [...state.casinoMessages, message] }
      }
      return { sportsMessages: [...state.sportsMessages, message] }
    }),

  // Users
  casinoUsers: mockUsers,
  sportsUsers: mockUsers.filter((_, i) => i !== 2 && i !== 9),
  setUsers: (room, users) =>
    set(room === 'casino' ? { casinoUsers: users } : { sportsUsers: users }),

  // Online count
  casinoOnlineCount: 12847,
  sportsOnlineCount: 8432,

  // User list
  showUserList: false,
  setShowUserList: (show) => set({ showUserList: show }),

  // Rain
  activeRain: null,
  setActiveRain: (rain) => set({ activeRain: rain }),
  joinRain: (userId) =>
    set((state) => {
      if (!state.activeRain) return {}
      return {
        activeRain: {
          ...state.activeRain,
          participants: [...state.activeRain.participants, userId],
        },
      }
    }),

  // Tipping
  tipState: { isOpen: false, targetUser: null },
  openTipModal: (user) => set({ tipState: { isOpen: true, targetUser: user } }),
  closeTipModal: () => set({ tipState: { isOpen: false, targetUser: null } }),

  // Input
  inputMessage: '',
  setInputMessage: (msg) => set({ inputMessage: msg }),

  // Emoji
  showEmojiPicker: false,
  setShowEmojiPicker: (show) => set({ showEmojiPicker: show }),
}))
