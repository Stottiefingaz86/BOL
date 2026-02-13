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

export interface UserProfileData {
  id: string
  username: string
  avatar?: string
  badge?: 'vip' | 'mod' | 'high-roller' | null
  vipLevel?: number
  isOnline: boolean
  registeredDate: string
  totalWagered: { crypto: string; usd: string }
  stats: {
    messagesSent: number
    tipsGiven: string
    tipsReceived: string
    rainWon: string
  }
  recentActivity: {
    time: string
    content: string
    type: 'message' | 'bet-share' | 'tip' | 'win'
    betDetails?: { game: string; multiplier: string; wager: string; payout: string }
  }[]
  achievements: { name: string; icon: string; color: string }[]
}

export interface ProfileState {
  isOpen: boolean
  user: UserProfileData | null
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

  // User Profile
  profileState: ProfileState
  openUserProfile: (user: ChatUser) => void
  closeUserProfile: () => void

  // Share bet to chat
  shareBetToChat: (bets: { eventName: string; selection: string; odds: string; stake: number }[]) => void

  // Copy parlay from chat to betslip (dispatches event for page to handle)
  copyBetToSlip: (legs: { event: string; selection: string; odds: string }[]) => void

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
    timestamp: new Date(Date.now() - 420000),
    type: 'message',
  },
  {
    id: 'sm-dave-1',
    userId: 'sim-21',
    username: 'DaveMason',
    badge: 'mod',
    content: 'Hold alert: Chiefs line opened at -2.5, now sitting at -3.5. Book moved it a full point — that\'s sharp money pushing it. The public is on KC but the book is comfortable holding here. Be cautious fading the movement 📊',
    timestamp: new Date(Date.now() - 390000),
    type: 'message',
  },
  {
    id: 'sm2',
    userId: '11',
    username: 'PokerFace_Joe',
    badge: 'high-roller',
    content: '',
    timestamp: new Date(Date.now() - 350000),
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
    timestamp: new Date(Date.now() - 320000),
    type: 'message',
  },
  // Previous rain result
  {
    id: 'sm-rain-prev',
    userId: '12',
    username: 'CryptoWhale',
    badge: 'vip',
    content: 'Making it rain! 💰🌧️',
    timestamp: new Date(Date.now() - 280000),
    type: 'rain',
  },
  {
    id: 'sm-rain-result',
    userId: 'system',
    username: 'System',
    content: '🌧️ Rain ended! $1,000 split between 8 users ($125.00 each). Winners: RainCatcher, OddsGuru, NBAJunkie, SlotQueenXO, Mod_Alex, BigBluffDave, GrindMode99, LiveBetLarry 🎉',
    timestamp: new Date(Date.now() - 255000),
    type: 'system',
  },
  {
    id: 'sm-rain-you',
    userId: 'system',
    username: 'System',
    content: '💰 You won $125.00 from the rain! Balance updated.',
    timestamp: new Date(Date.now() - 254000),
    type: 'system',
  },
  {
    id: 'sm-rain-react-1',
    userId: 'sim-12',
    username: 'RainCatcher',
    content: 'thanks for the rain! 🌧️💰',
    timestamp: new Date(Date.now() - 250000),
    type: 'message',
  },
  {
    id: 'sm-rain-react-2',
    userId: 'sim-6',
    username: 'NBAJunkie',
    content: 'yooo I caught the rain! 🙏',
    timestamp: new Date(Date.now() - 245000),
    type: 'message',
  },
  {
    id: 'sm4',
    userId: '2',
    username: 'Mod_Sarah',
    badge: 'mod',
    content: 'Great picks today! Remember to bet responsibly.',
    timestamp: new Date(Date.now() - 220000),
    type: 'message',
  },
  {
    id: 'sm5',
    userId: '4',
    username: 'BlackjackPro',
    badge: 'high-roller',
    content: 'Arsenal vs Man City should be a banger. Taking Arsenal ML at +250 🎯',
    timestamp: new Date(Date.now() - 180000),
    type: 'message',
  },
  {
    id: 'sm-dave-2',
    userId: 'sim-21',
    username: 'DaveMason',
    badge: 'mod',
    content: 'Book is sitting at heavy liability on Arsenal right now. 68% of tickets are on Man City but only 45% of the money. That means sharps are on Arsenal. The +250 is juicy — book knows this could go either way ⚽📈',
    timestamp: new Date(Date.now() - 160000),
    type: 'message',
  },
  {
    id: 'sm-dave-respect',
    userId: 'sim-14',
    username: 'FadeThePublic',
    content: '@DaveMason always with the 🔥 analysis. tailing Arsenal based on that hold breakdown',
    timestamp: new Date(Date.now() - 145000),
    type: 'message',
    mentions: ['DaveMason'],
  },
  {
    id: 'sm6',
    userId: '3',
    username: 'LuckySpinner',
    content: 'Anyone watching the Lakers game? LeBron dropping 40 tonight for sure',
    timestamp: new Date(Date.now() - 120000),
    type: 'message',
  },
  // Another rain result
  {
    id: 'sm-rain-prev-2',
    userId: 'sim-18',
    username: 'WhaleAlert🐋',
    badge: 'vip',
    content: 'Making it rain! 💰🌧️',
    timestamp: new Date(Date.now() - 100000),
    type: 'rain',
  },
  {
    id: 'sm-rain-result-2',
    userId: 'system',
    username: 'System',
    content: '🌧️ Rain ended! $2,000 split between 9 users ($222.22 each). Winners: You, RainCatcher, OddsGuru, NBAJunkie, SlotQueenXO, Mod_Alex, BigBluffDave, GrindMode99, LiveBetLarry 🎉',
    timestamp: new Date(Date.now() - 75000),
    type: 'system',
  },
  {
    id: 'sm-rain-you-2',
    userId: 'system',
    username: 'System',
    content: '💰 You won $222.22 from the rain! Balance updated.',
    timestamp: new Date(Date.now() - 74000),
    type: 'system',
  },
  {
    id: 'sm-rain-react-3',
    userId: 'sim-9',
    username: 'GrindMode99',
    content: 'free money let\'s go 🔥',
    timestamp: new Date(Date.now() - 70000),
    type: 'message',
  },
  {
    id: 'sm-rain-react-4',
    userId: 'sim-7',
    username: 'SlotQueenXO',
    badge: 'vip',
    content: 'appreciate the rain whale 🐋❤️',
    timestamp: new Date(Date.now() - 65000),
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
    id: 'sm-dave-3',
    userId: 'sim-21',
    username: 'DaveMason',
    badge: 'mod',
    content: 'Lakers line just moved from -3.5 to -5 in the last 20 min. Book is clearly trying to balance — public is all over LA. Value might be on the Celtics side now. Watch that number 🧠🏀',
    timestamp: new Date(Date.now() - 35000),
    type: 'message',
  },
  {
    id: 'sm8',
    userId: '8',
    username: 'BetMaster2026',
    content: 'Let\'s goooo! 💰 Leg 1 of the parlay looking good',
    timestamp: new Date(Date.now() - 30000),
    type: 'message',
  },
  {
    id: 'sm-hype-dave',
    userId: 'sim-13',
    username: 'OddsGuru',
    badge: 'high-roller',
    content: '@DaveMason the GOAT of hold analysis. Every time you break down the book I make money 💯🐐',
    timestamp: new Date(Date.now() - 15000),
    type: 'message',
    mentions: ['DaveMason'],
  },
]

// ─── Mock profile generator ─────────────────────────────
const achievementPool = [
  { name: 'Early Adopter', icon: '🛡️', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' },
  { name: 'High Roller', icon: '💰', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30' },
  { name: 'Chat Champion', icon: '🏆', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' },
  { name: 'Rain Maker', icon: '🌧️', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  { name: 'Lucky Streak', icon: '🍀', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
  { name: 'Bet Master', icon: '🎯', color: 'from-red-500/20 to-red-600/10 border-red-500/30' },
  { name: 'Tipping King', icon: '👑', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
  { name: 'Community Star', icon: '⭐', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
]

function generateMockProfile(user: ChatUser): UserProfileData {
  // Deterministic "random" based on user id
  const seed = parseInt(user.id, 10) || 1
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const regMonth = months[seed % 12]
  const regYear = 2020 + (seed % 5)
  const msgCount = 10000 + seed * 7823
  const tipsGiven = (seed * 1.37).toFixed(2)
  const tipsReceived = (seed * 0.89).toFixed(2)
  const rainWon = (seed * 0.23).toFixed(2)
  const wageredCrypto = (seed * 31.12).toFixed(2)
  const wageredUsd = `$${(seed * 875000).toLocaleString()}+`

  // Pick 2-4 achievements deterministically
  const numAchievements = 2 + (seed % 3)
  const achievements = []
  for (let i = 0; i < numAchievements; i++) {
    achievements.push(achievementPool[(seed + i) % achievementPool.length])
  }

  const recentActivity: UserProfileData['recentActivity'] = [
    {
      time: '18:45',
      content: `${user.username}: Just hit a massive jackpot on the new slot! 🚀 Good luck everyone! 🎰`,
      type: 'message',
    },
    {
      time: '18:40',
      content: `${user.username} shared a bet:`,
      type: 'bet-share',
      betDetails: {
        game: "Crypto Fortune",
        multiplier: 'x500',
        wager: '₿0.1',
        payout: '₿50',
      },
    },
    {
      time: '18:32',
      content: `${user.username} tipped LuckySpinner ₿0.05`,
      type: 'tip',
    },
  ]

  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    badge: user.badge,
    vipLevel: user.vipLevel,
    isOnline: user.isOnline,
    registeredDate: `${regMonth} ${10 + (seed % 20)}, ${regYear}`,
    totalWagered: { crypto: `₿${wageredCrypto}`, usd: wageredUsd },
    stats: {
      messagesSent: msgCount,
      tipsGiven: `₿${tipsGiven}`,
      tipsReceived: `₿${tipsReceived}`,
      rainWon: `₿${rainWon}`,
    },
    recentActivity,
    achievements,
  }
}

// ─── Create Store ────────────────────────────────────────
export const useChatStore = create<ChatState>((set, get) => ({
  // Panel state
  isOpen: true,
  setIsOpen: (open) => {
    set({ isOpen: open })
    // Dispatch event so other panels know to close
    if (open && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('panel:chat-opened'))
    }
  },
  toggleChat: () => {
    const wasOpen = get().isOpen
    set({ isOpen: !wasOpen })
    // If we just opened, dispatch event
    if (!wasOpen && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('panel:chat-opened'))
    }
  },

  // Active room
  activeRoom: 'sports',
  setActiveRoom: (room) => set({ activeRoom: room }),

  // Messages
  casinoMessages: mockCasinoMessages,
  sportsMessages: mockSportsMessages,
  addMessage: (room, message) =>
    set((state) => {
      const MAX_MESSAGES = 200
      if (room === 'casino') {
        const msgs = [...state.casinoMessages, message]
        return { casinoMessages: msgs.length > MAX_MESSAGES ? msgs.slice(-MAX_MESSAGES) : msgs }
      }
      const msgs = [...state.sportsMessages, message]
      return { sportsMessages: msgs.length > MAX_MESSAGES ? msgs.slice(-MAX_MESSAGES) : msgs }
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

  // User Profile
  profileState: { isOpen: false, user: null },
  openUserProfile: (user) => {
    const profileData = generateMockProfile(user)
    set({ profileState: { isOpen: true, user: profileData } })
  },
  closeUserProfile: () => set({ profileState: { isOpen: false, user: null } }),

  // Share bet to chat
  shareBetToChat: (bets) => {
    const isParlay = bets.length > 1
    const legs = bets.map((b) => ({
      event: b.eventName,
      selection: b.selection,
      odds: b.odds,
    }))

    // Calculate combined odds for parlay
    let combinedOdds: string | undefined
    let potentialWin: string | undefined
    const totalStake = bets.reduce((s, b) => s + b.stake, 0)

    if (isParlay) {
      const decimalOdds = bets.map((b) => {
        const american = parseFloat(b.odds)
        if (isNaN(american)) return 2
        return american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1
      })
      const multiplied = decimalOdds.reduce((a, b) => a * b, 1)
      const americanCombined =
        multiplied >= 2
          ? `+${Math.round((multiplied - 1) * 100)}`
          : `-${Math.round(100 / (multiplied - 1))}`
      combinedOdds = americanCombined
      potentialWin = `$${(totalStake * multiplied).toFixed(2)}`
    } else if (bets.length === 1) {
      const american = parseFloat(bets[0].odds)
      if (!isNaN(american)) {
        const dec = american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1
        potentialWin = `$${(totalStake * dec).toFixed(2)}`
      }
    }

    const betMsg: ChatMessage = {
      id: `bet-share-${Date.now()}`,
      userId: 'current-user',
      username: 'You',
      content: '',
      timestamp: new Date(),
      type: 'bet-share',
      betSlip: {
        type: isParlay ? 'parlay' : 'single',
        legs,
        combinedOdds,
        potentialWin,
      },
    }

    // Add to sports messages (visible in unified chat)
    set((state) => ({
      sportsMessages: [...state.sportsMessages, betMsg],
      isOpen: true, // Open chat to show the shared bet
    }))
    // Dispatch event so other panels close
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('panel:chat-opened'))
    }
  },

  // Copy parlay from chat to betslip — dispatches a CustomEvent for pages to handle
  copyBetToSlip: (legs) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('bet:copy-to-slip', {
          detail: { legs },
        })
      )
    }
  },

  // Input
  inputMessage: '',
  setInputMessage: (msg) => set({ inputMessage: msg }),

  // Emoji
  showEmojiPicker: false,
  setShowEmojiPicker: (show) => set({ showEmojiPicker: show }),
}))

// ─── Panel exclusivity: close chat when sidebar opens ───
// Listen for the sidebar-opened event and close chat without dispatching
// panel:chat-opened (to avoid infinite event loops).
if (typeof window !== 'undefined') {
  window.addEventListener('panel:sidebar-opened', () => {
    const state = useChatStore.getState()
    if (state.isOpen) {
      // Directly set state — do NOT use setIsOpen() which would dispatch panel:chat-opened
      useChatStore.setState({ isOpen: false })
    }
  })
}
