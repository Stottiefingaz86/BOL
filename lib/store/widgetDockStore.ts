import { create } from 'zustand'

// ─── Types ───────────────────────────────────────────────

export interface TrackerEventData {
  id: number
  team1: string
  team2: string
  /** Optional crest / abbreviation shown in the tracker scoreboard (falls back to initials). */
  team1Logo?: string
  team2Logo?: string
  team1Code?: string
  team2Code?: string
  league: string
  country: string
  /** Drives the 3D field drawn in the tracker (defaults to soccer). */
  sport?: 'football' | 'basketball' | 'soccer'
  score?: { team1: number; team2: number }
  minute?: string
  isLive?: boolean
  statscoreEventId?: number
  statscoreConfigId?: string
}

export interface WidgetInstance {
  id: string                // String(event.id)
  data: TrackerEventData
  isDocked: boolean
  isMinimized: boolean
  dockedHeight: number      // height when docked (px)
}

// ─── Store ───────────────────────────────────────────────

interface WidgetDockState {
  widgets: WidgetInstance[]
  dockOrder: string[]       // ordered IDs for docked widgets
  dockWidth: number         // resizable dock panel width (px)

  // Open / close
  openWidget: (data: TrackerEventData) => void
  closeWidget: (id: string) => void

  // Dock / undock
  dockWidget: (id: string) => void
  undockWidget: (id: string) => void

  // Dock management
  setDockOrder: (newOrder: string[]) => void
  setDockWidth: (width: number) => void
  reorderDock: (fromIndex: number, toIndex: number) => void
  resizeWidget: (id: string, height: number) => void
  toggleMinimize: (id: string) => void

  // Update event data (e.g. score change)
  updateWidgetData: (id: string, data: Partial<TrackerEventData>) => void
}

const DEFAULT_DOCK_HEIGHT = 320
const DEFAULT_DOCK_WIDTH = 300
const MIN_DOCK_WIDTH = 220
const MAX_DOCK_WIDTH = 500
const MIN_DOCK_HEIGHT = 100

export const useWidgetDockStore = create<WidgetDockState>((set) => ({
  widgets: [],
  dockOrder: [],
  dockWidth: DEFAULT_DOCK_WIDTH,

  openWidget: (data) => {
    const id = String(data.id)
    set((state) => {
      // If already open, just update data
      const existing = state.widgets.find(w => w.id === id)
      if (existing) {
        return {
          widgets: state.widgets.map(w =>
            w.id === id ? { ...w, data: { ...w.data, ...data } } : w
          ),
        }
      }
      // Add new floating widget
      return {
        widgets: [
          ...state.widgets,
          {
            id,
            data,
            isDocked: false,
            isMinimized: false,
            dockedHeight: DEFAULT_DOCK_HEIGHT,
          },
        ],
      }
    })
  },

  closeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter(w => w.id !== id),
      dockOrder: state.dockOrder.filter(wid => wid !== id),
    })),

  dockWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.map(w =>
        w.id === id ? { ...w, isDocked: true } : w
      ),
      dockOrder: state.dockOrder.includes(id)
        ? state.dockOrder
        : [...state.dockOrder, id],
    })),

  undockWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.map(w =>
        w.id === id ? { ...w, isDocked: false } : w
      ),
      dockOrder: state.dockOrder.filter(wid => wid !== id),
    })),

  setDockOrder: (newOrder) => set({ dockOrder: newOrder }),

  setDockWidth: (width) =>
    set({ dockWidth: Math.max(MIN_DOCK_WIDTH, Math.min(MAX_DOCK_WIDTH, width)) }),

  reorderDock: (fromIndex, toIndex) =>
    set((state) => {
      const order = [...state.dockOrder]
      const [moved] = order.splice(fromIndex, 1)
      order.splice(toIndex, 0, moved)
      return { dockOrder: order }
    }),

  resizeWidget: (id, height) =>
    set((state) => ({
      widgets: state.widgets.map(w =>
        w.id === id
          ? { ...w, dockedHeight: Math.max(MIN_DOCK_HEIGHT, height) }
          : w
      ),
    })),

  toggleMinimize: (id) =>
    set((state) => ({
      widgets: state.widgets.map(w =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    })),

  updateWidgetData: (id, data) =>
    set((state) => ({
      widgets: state.widgets.map(w =>
        w.id === id ? { ...w, data: { ...w.data, ...data } } : w
      ),
    })),
}))
