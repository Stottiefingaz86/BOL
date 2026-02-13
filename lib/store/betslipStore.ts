import { create } from 'zustand'

// ─── Types ───────────────────────────────────────────────
export interface BetItem {
  id: string
  eventId: number
  eventName: string
  marketTitle: string
  selection: string
  odds: string
  stake: number
}

export interface PlacedBet extends BetItem {
  placedAt: Date
}

// ─── Store ───────────────────────────────────────────────
interface BetslipState {
  // Core state
  bets: BetItem[]
  isOpen: boolean
  isMinimized: boolean
  manuallyClosed: boolean
  placedBets: PlacedBet[]
  myBetsAlertCount: number
  showConfirmation: boolean
  pendingBets: BetItem[]

  // Actions
  setBets: (bets: BetItem[] | ((prev: BetItem[]) => BetItem[])) => void
  addBet: (bet: BetItem) => void
  removeBet: (id: string) => void
  updateBetStake: (id: string, stake: number) => void
  clearAll: () => void

  setOpen: (open: boolean) => void
  setMinimized: (minimized: boolean) => void
  setManuallyClosed: (closed: boolean) => void

  setPlacedBets: (bets: PlacedBet[] | ((prev: PlacedBet[]) => PlacedBet[])) => void
  setMyBetsAlertCount: (count: number | ((prev: number) => number)) => void
  setShowConfirmation: (show: boolean) => void
  setPendingBets: (bets: BetItem[]) => void
}

export const useBetslipStore = create<BetslipState>((set, get) => ({
  // Core state
  bets: [],
  isOpen: false,
  isMinimized: false,
  manuallyClosed: false,
  placedBets: [],
  myBetsAlertCount: 0,
  showConfirmation: false,
  pendingBets: [],

  // Actions
  setBets: (betsOrFn) => {
    set((state) => ({
      bets: typeof betsOrFn === 'function' ? betsOrFn(state.bets) : betsOrFn,
    }))
  },

  addBet: (bet) => {
    set((state) => {
      // Prevent duplicate selections
      const exists = state.bets.some((b) => b.id === bet.id)
      if (exists) return {}
      return { bets: [...state.bets, bet] }
    })
  },

  removeBet: (id) => {
    set((state) => {
      const newBets = state.bets.filter((b) => b.id !== id)
      // If no bets left, close the betslip
      if (newBets.length === 0) {
        return { bets: [], isOpen: false, isMinimized: false, manuallyClosed: false }
      }
      return { bets: newBets }
    })
  },

  updateBetStake: (id, stake) => {
    set((state) => ({
      bets: state.bets.map((b) => (b.id === id ? { ...b, stake } : b)),
    }))
  },

  clearAll: () => {
    set({ bets: [], isOpen: false, isMinimized: false, manuallyClosed: false, showConfirmation: false, pendingBets: [] })
  },

  setOpen: (open) => set({ isOpen: open }),
  setMinimized: (minimized) => set({ isMinimized: minimized }),
  setManuallyClosed: (closed) => set({ manuallyClosed: closed }),

  setPlacedBets: (betsOrFn) => {
    set((state) => ({
      placedBets: typeof betsOrFn === 'function' ? betsOrFn(state.placedBets) : betsOrFn,
    }))
  },

  setMyBetsAlertCount: (countOrFn) => {
    set((state) => ({
      myBetsAlertCount: typeof countOrFn === 'function' ? countOrFn(state.myBetsAlertCount) : countOrFn,
    }))
  },

  setShowConfirmation: (show) => set({ showConfirmation: show }),
  setPendingBets: (bets) => set({ pendingBets: bets }),
}))
