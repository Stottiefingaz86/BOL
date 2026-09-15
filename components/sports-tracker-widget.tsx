'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion'
import {
  IconX,
  IconGripVertical,
  IconMinus,
  IconMaximize,
  IconArrowBarRight,
  IconArrowsMaximize,
} from '@tabler/icons-react'
import { Pitch3D } from '@/components/sports/pitch-3d'
import { useIsMobile } from '@/hooks/use-mobile'
import { useChatStore } from '@/lib/store/chatStore'
import {
  useWidgetDockStore,
  TrackerEventData,
  WidgetInstance,
} from '@/lib/store/widgetDockStore'

// ─── Constants ─────────────────────────────────────────────
const SUB_NAV_HEIGHT = 44
const HEADER_HEIGHT = 64
const SAFE_PADDING = 8
const SNAP_THRESHOLD = 100 // px from right edge to trigger dock
const WIDGET_HEADER_HEIGHT = 40
const RESIZE_HANDLE_HEIGHT = 10
const MIN_DOCK_WIDGET_HEIGHT = 100

// STATSCORE Widget SDK — loaded from local (license header removed)
const STATSCORE_SDK_URL = '/scripts/statscore-widget.js'

// ═════════════════════════════════════════════════════════════
// 1. TrackerWidgetContent — shared inner content
// ═════════════════════════════════════════════════════════════

interface TrackerContentProps {
  event: TrackerEventData
  maxHeight?: number | string
  isCompact?: boolean // docked mode: tighter spacing
  /** Skip the competition line + scoreboard (when the host page already shows the score). */
  hideScoreboard?: boolean
}

function TeamCrest({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="w-6 h-6 object-contain" />
      ) : (
        <span className="text-xs font-bold text-white/70">{name.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  )
}

export function TrackerWidgetContent({
  event,
  maxHeight,
  isCompact = false,
  hideScoreboard = false,
}: TrackerContentProps) {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('Live')
  const statscoreContainerRef = useRef<HTMLDivElement>(null)
  const [statscoreStatus, setStatscoreStatus] = useState<
    'idle' | 'loading' | 'loaded' | 'error'
  >('idle')
  const widgetInstanceRef = useRef<any>(null)

  const hasStatscoreConfig = !!(
    event?.statscoreEventId && event?.statscoreConfigId
  )
  const tabs = ['Live', 'Lineups', 'H2H', 'Incidents', 'Stats', 'Standings']
  const widgetBg = 'var(--ds-page-bg, #222222)'
  const widgetBgDarker =
    'color-mix(in srgb, var(--ds-page-bg, #222222) 85%, black)'

  // STATSCORE Widget SDK — programmatic initialization
  useEffect(() => {
    if (!event?.statscoreEventId || !event?.statscoreConfigId) return
    const el = statscoreContainerRef.current
    if (!el) return

    let destroyed = false
    setStatscoreStatus('loading')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    w.STATSCOREWidgets = w.STATSCOREWidgets || {}
    w.STATSCOREWidgets.onLoadCallbacks = w.STATSCOREWidgets.onLoadCallbacks || []

    const initWidget = () => {
      if (destroyed) return
      if (!w.STATSCOREWidgets?.Widget) {
        setStatscoreStatus('error')
        return
      }
      try {
        const instance = new w.STATSCOREWidgets.Widget(
          el,
          event.statscoreConfigId,
          { eventId: String(event.statscoreEventId) },
          { autoMount: true, loader: { enabled: true, size: 50, color1: '#ee3536', color2: '#333' } }
        )
        widgetInstanceRef.current = instance
        instance.on('load', () => { if (!destroyed) setStatscoreStatus('loaded') })
        instance.on('mount', () => { if (!destroyed) setStatscoreStatus('loaded') })
        instance.on('error', () => { if (!destroyed) setStatscoreStatus('error') })
      } catch (err) {
        console.error('STATSCORE Widget init error:', err)
        if (!destroyed) setStatscoreStatus('error')
      }
    }

    // If SDK is already loaded, init immediately
    if (w.STATSCOREWidgets?.Widget) {
      initWidget()
    } else {
      // Queue callback for when SDK finishes loading
      w.STATSCOREWidgets.onLoadCallbacks.push((err: any) => {
        if (err) { if (!destroyed) setStatscoreStatus('error'); return }
        initWidget()
      })

      // Load the SDK script if not already present
      if (!document.getElementById('statscore-sdk-script')) {
        const script = document.createElement('script')
        script.id = 'statscore-sdk-script'
        script.src = STATSCORE_SDK_URL
        script.async = true
        script.onerror = () => { if (!destroyed) setStatscoreStatus('error') }
        document.body.appendChild(script)
      }
    }

    return () => {
      destroyed = true
      try { widgetInstanceRef.current?.destroy?.() } catch (_) { /* noop */ }
      widgetInstanceRef.current = null
    }
  }, [event?.statscoreEventId, event?.statscoreConfigId])

  // If the STATSCORE SDK fails (domain not whitelisted / expired event) fall through to the static tracker
  if (hasStatscoreConfig && statscoreStatus !== 'error') {
    return (
      <div
        className="relative"
        style={{ backgroundColor: widgetBg, maxHeight, overflow: maxHeight ? 'auto' : undefined }}
      >
        {/* STATSCORE SDK mounts directly into this element */}
        <div
          ref={statscoreContainerRef}
          className="statscore-widget-root"
          style={{ width: '100%', minHeight: isMobile ? 280 : 380 }}
        />
      </div>
    )
  }

  // Static fallback content
  return (
    <div
      className="overflow-y-auto"
      style={{ backgroundColor: widgetBg, maxHeight }}
    >
      {!hideScoreboard && (
        <>
        {/* Competition Info */}
        <div
          className="flex items-center justify-between px-3 py-1.5 border-b border-white/5"
          style={{ backgroundColor: widgetBgDarker }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded-sm bg-white/10 flex items-center justify-center">
              <span className="text-[6px]">🏴</span>
            </div>
            <span className="text-[10px] text-white/60">
              {event.country}, {event.league}
            </span>
          </div>
          <span className="text-[10px] text-white/40">
            {new Date().toLocaleDateString('en-GB')}{' '}
            {new Date().toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Scoreboard */}
        <div className="px-4 py-3" style={{ backgroundColor: widgetBg }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TeamCrest name={event.team1} logo={event.team1Logo} />
              <span className="text-sm font-medium text-white truncate">
                {event.team1}
              </span>
            </div>
            <div className="flex flex-col items-center mx-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tabular-nums">
                  {event.score?.team1 ?? 0}
                </span>
                <span className="text-lg text-white/30">:</span>
                <span className="text-2xl font-bold text-white tabular-nums">
                  {event.score?.team2 ?? 0}
                </span>
              </div>
              {event.isLive && (
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-[#ee3536]">
                    {event.minute || "45'"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className="text-sm font-medium text-white truncate text-right">
                {event.team2}
              </span>
              <TeamCrest name={event.team2} logo={event.team2Logo} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#00ffa5] font-semibold">1</span>
              <span className="text-[10px] text-white/40">⚽</span>
              <span className="text-[10px] text-[#ff00ed] font-semibold">3</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#00ffa5] font-semibold">2</span>
              <span className="text-[10px] text-white/40">🟨</span>
              <span className="text-[10px] text-[#ff00ed] font-semibold">1</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#00ffa5] font-semibold">0</span>
              <span className="text-[10px] text-white/40">🟥</span>
              <span className="text-[10px] text-[#ff00ed] font-semibold">0</span>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Timeline */}
      <div className="px-3 py-2" style={{ backgroundColor: widgetBgDarker }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#00ffa5]" />
            <span className="text-[9px] text-white/50">
              {event.team1Code ?? event.team1.substring(0, 3).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ff00ed]" />
            <span className="text-[9px] text-white/50">
              {event.team2Code ?? event.team2.substring(0, 3).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00ffa5]/30 to-[#00ffa5]/10 rounded-full"
            style={{ width: '50%' }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/60"
            style={{ left: '50%' }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[8px] text-white/30">0&apos;</span>
          <span className="text-[8px] text-white/30">45&apos;</span>
          <span className="text-[8px] text-white/30">90&apos;</span>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center border-b border-white/10 overflow-x-auto scrollbar-hide"
        style={{ backgroundColor: widgetBgDarker }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-[10px] font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab
                ? 'text-[#00ffa5]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ffa5]" />
            )}
          </button>
        ))}
      </div>

      {/* Live Pitch — stadium-style 3D field */}
      {activeTab === 'Live' && (
        <div className="relative overflow-hidden">
          <Pitch3D
            sport={event.sport ?? 'soccer'}
            clock={event.minute}
            isLive={event.isLive}
            homePercent={45}
            label="Play by play"
            height={isCompact ? 200 : isMobile ? 220 : 250}
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-[10px] font-semibold text-[#00ffa5]">
              45%
            </span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden flex">
              <div
                className="bg-[#00ffa5]/60 h-full"
                style={{ width: '45%' }}
              />
              <div
                className="bg-[#ff00ed]/60 h-full"
                style={{ width: '55%' }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[#ff00ed]">
              55%
            </span>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'Stats' && (
        <div className="px-3 py-2 space-y-2">
          {[
            { label: 'Ball Possession', home: 45, away: 55 },
            { label: 'Shots on Target', home: 3, away: 7 },
            { label: 'Shots', home: 8, away: 14 },
            { label: 'Corners', home: 1, away: 3 },
            { label: 'Fouls', home: 8, away: 6 },
            { label: 'Offsides', home: 1, away: 2 },
          ].map((stat) => (
            <div key={stat.label} className="space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-[#00ffa5] tabular-nums">
                  {stat.home}
                  {stat.label === 'Ball Possession' ? '%' : ''}
                </span>
                <span className="text-[9px] text-white/50">{stat.label}</span>
                <span className="text-[10px] font-semibold text-[#ff00ed] tabular-nums">
                  {stat.away}
                  {stat.label === 'Ball Possession' ? '%' : ''}
                </span>
              </div>
              <div className="flex gap-0.5 h-1">
                <div className="flex-1 bg-white/5 rounded-full overflow-hidden flex justify-end">
                  <div
                    className="bg-[#00ffa5]/50 h-full rounded-full"
                    style={{
                      width: `${
                        (stat.home / (stat.home + stat.away)) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#ff00ed]/50 h-full rounded-full"
                    style={{
                      width: `${
                        (stat.away / (stat.home + stat.away)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'Incidents' && (
        <div className="px-3 py-2 space-y-1.5">
          {[
            { time: "12'", type: '⚽', player: 'Cunha', team: 'home' },
            { time: "23'", type: '⚽', player: 'Saka', team: 'away' },
            { time: "34'", type: '🟨', player: 'Lemina', team: 'home' },
            { time: "41'", type: '⚽', player: 'Havertz', team: 'away' },
            { time: "45'", type: '🟨', player: 'Strand Larsen', team: 'home' },
            { time: "52'", type: '⚽', player: 'Neto', team: 'home' },
            { time: "67'", type: '🟨', player: 'Rice', team: 'away' },
          ].map((incident, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-2 py-1 rounded ${
                incident.team === 'home' ? 'bg-[#00ffa5]/5' : 'bg-[#ff00ed]/5'
              }`}
            >
              <span className="text-[10px] text-white/40 w-6 text-right tabular-nums">
                {incident.time}
              </span>
              <span className="text-xs">{incident.type}</span>
              <span className="text-[11px] text-white/80">
                {incident.player}
              </span>
              <div
                className={`w-1.5 h-1.5 rounded-full ml-auto ${
                  incident.team === 'home' ? 'bg-[#00ffa5]' : 'bg-[#ff00ed]'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Lineups' && (
        <div className="px-3 py-2">
          <div className="text-center text-[10px] text-white/40 py-4">
            Lineups will be available closer to kick-off
          </div>
        </div>
      )}

      {activeTab === 'H2H' && (
        <div className="px-3 py-2 space-y-1.5">
          <p className="text-[10px] text-white/50 mb-2">Last 5 meetings</p>
          {[
            {
              date: '18/02/26',
              home: event.team1,
              away: event.team2,
              score: '2-2',
            },
            {
              date: '04/11/25',
              home: event.team2,
              away: event.team1,
              score: '3-0',
            },
            {
              date: '20/04/25',
              home: event.team1,
              away: event.team2,
              score: '0-1',
            },
            {
              date: '02/12/24',
              home: event.team2,
              away: event.team1,
              score: '2-1',
            },
            {
              date: '20/04/24',
              home: event.team1,
              away: event.team2,
              score: '2-0',
            },
          ].map((match, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2 py-1.5 bg-white/[0.02] rounded"
            >
              <span className="text-[9px] text-white/30 w-14">
                {match.date}
              </span>
              <span className="text-[10px] text-white/70 flex-1 text-right truncate">
                {match.home}
              </span>
              <span className="text-[10px] font-bold text-white px-2 bg-white/5 rounded">
                {match.score}
              </span>
              <span className="text-[10px] text-white/70 flex-1 truncate">
                {match.away}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Standings' && (
        <div className="px-3 py-2">
          <div className="text-center text-[10px] text-white/40 py-4">
            Standings data loading...
          </div>
        </div>
      )}

      <div
        className="flex items-center justify-center py-1.5 border-t border-white/5"
        style={{ backgroundColor: widgetBg }}
      >
        <span className="text-[8px] text-white/20 tracking-wider uppercase">
          Powered by STATSCORE
        </span>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// 2. WidgetDockPanel — right-side panel for docked widgets
// ═════════════════════════════════════════════════════════════

function DockedWidgetCard({ widget }: { widget: WidgetInstance }) {
  const { closeWidget, toggleMinimize, undockWidget, resizeWidget } =
    useWidgetDockStore()
  const dragControls = useDragControls()
  const resizeRef = useRef({
    isResizing: false,
    startY: 0,
    startHeight: 0,
  })

  const widgetBg = 'var(--ds-page-bg, #222222)'
  const contentHeight = widget.isMinimized
    ? 0
    : widget.dockedHeight - WIDGET_HEADER_HEIGHT - RESIZE_HANDLE_HEIGHT

  // ── Resize ──
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      resizeRef.current = {
        isResizing: true,
        startY: e.clientY,
        startHeight: widget.dockedHeight,
      }
      const handleMove = (e: MouseEvent) => {
        if (!resizeRef.current.isResizing) return
        const dy = e.clientY - resizeRef.current.startY
        const maxH = window.innerHeight * 0.5
        resizeWidget(
          widget.id,
          Math.max(
            MIN_DOCK_WIDGET_HEIGHT,
            Math.min(maxH, resizeRef.current.startHeight + dy)
          )
        )
      }
      const handleUp = () => {
        resizeRef.current.isResizing = false
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleUp)
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleUp)
    },
    [widget.dockedHeight, widget.id, resizeWidget]
  )

  return (
    <Reorder.Item
      value={widget.id}
      as="div"
      dragControls={dragControls}
      dragListener={false}
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        zIndex: 10,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="border-b border-white/10"
      style={{ backgroundColor: widgetBg }}
    >
      {/* Header — drag handle */}
      <div
        className="flex items-center justify-between px-3 cursor-grab active:cursor-grabbing select-none border-b border-white/5"
        style={{
          height: WIDGET_HEADER_HEIGHT,
          backgroundColor: widgetBg,
        }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <IconGripVertical className="w-4 h-4 text-white/30 flex-shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            {widget.data.isLive && (
              <div className="flex items-center gap-1 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5">
                <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-[#ee3536] uppercase">
                  Live
                </span>
              </div>
            )}
            <span className="text-[11px] font-medium text-white truncate">
              {widget.data.team1} vs {widget.data.team2}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-1 flex-shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => undockWidget(widget.id)}
            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Undock — make floating"
          >
            <IconArrowsMaximize className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleMinimize(widget.id)}
            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            {widget.isMinimized ? (
              <IconMaximize className="w-3.5 h-3.5" />
            ) : (
              <IconMinus className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => closeWidget(widget.id)}
            className="p-1 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
          >
            <IconX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!widget.isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: contentHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <TrackerWidgetContent
              event={widget.data}
              maxHeight={contentHeight}
              isCompact
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resize handle */}
      <div
        className="flex items-center justify-center cursor-row-resize select-none group hover:bg-white/5 transition-colors"
        style={{ height: RESIZE_HANDLE_HEIGHT }}
        onMouseDown={handleResizeMouseDown}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="w-8 h-1 rounded-full bg-white/15 group-hover:bg-white/30 transition-colors" />
      </div>
    </Reorder.Item>
  )
}

export function WidgetDockPanel() {
  const isMobile = useIsMobile()
  const isChatOpen = useChatStore((s) => s.isOpen)
  const widgets = useWidgetDockStore((s) => s.widgets)
  const dockOrder = useWidgetDockStore((s) => s.dockOrder)
  const setDockOrder = useWidgetDockStore((s) => s.setDockOrder)
  const dockWidth = useWidgetDockStore((s) => s.dockWidth)
  const setDockWidth = useWidgetDockStore((s) => s.setDockWidth)

  const dockedWidgets = dockOrder
    .map((id) => widgets.find((w) => w.id === id))
    .filter((w): w is WidgetInstance => w !== undefined && w.isDocked)

  const hasDocked = dockedWidgets.length > 0
  const dockedIds = dockedWidgets.map((w) => w.id)

  // When chat is open, slide dock to the left of chat
  const CHAT_PANEL_WIDTH = 340
  const rightOffset = isChatOpen ? CHAT_PANEL_WIDTH : 0

  // ── Width resize via left edge ──
  const widthResizeRef = useRef({ active: false, startX: 0, startWidth: 0 })
  const handleWidthResizeDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      widthResizeRef.current = { active: true, startX: e.clientX, startWidth: dockWidth }
      const onMove = (ev: MouseEvent) => {
        if (!widthResizeRef.current.active) return
        // Dragging left → wider, dragging right → narrower
        const dx = widthResizeRef.current.startX - ev.clientX
        setDockWidth(widthResizeRef.current.startWidth + dx)
      }
      const onUp = () => {
        widthResizeRef.current.active = false
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [dockWidth, setDockWidth]
  )

  // Sync CSS variable for globals.css layout rules
  useEffect(() => {
    document.documentElement.style.setProperty('--dock-panel-width', `${dockWidth}px`)
    return () => { document.documentElement.style.removeProperty('--dock-panel-width') }
  }, [dockWidth])

  if (isMobile || !hasDocked) return null

  return (
    <motion.div
      initial={{ x: dockWidth }}
      animate={{ x: 0 }}
      exit={{ x: dockWidth }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed z-[201] border-l border-white/10 overflow-y-auto"
      style={{
        right: rightOffset,
        top: HEADER_HEIGHT,
        width: dockWidth,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        backgroundColor: 'var(--ds-page-bg, #222222)',
        pointerEvents: 'auto',
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Left-edge width resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-10 group hover:bg-white/10 transition-colors"
        onMouseDown={handleWidthResizeDown}
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/10 group-hover:bg-white/30 transition-colors" />
      </div>

      <Reorder.Group
        as="div"
        axis="y"
        values={dockedIds}
        onReorder={(newOrder) => setDockOrder(newOrder)}
      >
        {dockedWidgets.map((widget) => (
          <DockedWidgetCard key={widget.id} widget={widget} />
        ))}
      </Reorder.Group>
    </motion.div>
  )
}

// ═════════════════════════════════════════════════════════════
// 3. FloatingTrackerWidget — single draggable floating widget
// ═════════════════════════════════════════════════════════════

function FloatingTrackerWidget({
  widget,
  offsetIndex,
  sidebarWidth = 0,
}: {
  widget: WidgetInstance
  offsetIndex: number
  sidebarWidth?: number
}) {
  const isMobile = useIsMobile()
  const isChatOpen = useChatStore((s) => s.isOpen)
  const { closeWidget, dockWidget, toggleMinimize } = useWidgetDockStore()
  const dockWidth = useWidgetDockStore((s) => s.dockWidth)
  const dockedWidgets = useWidgetDockStore((s) =>
    s.dockOrder.filter((id) => s.widgets.find((w) => w.id === id && w.isDocked))
  )
  // Total height of already-docked widgets — for ghost positioning
  const dockedTotalHeight = useWidgetDockStore((s) =>
    s.dockOrder.reduce((sum, id) => {
      const w = s.widgets.find((w) => w.id === id && w.isDocked)
      if (!w) return sum
      if (w.isMinimized) return sum + WIDGET_HEADER_HEIGHT + RESIZE_HANDLE_HEIGHT
      return sum + w.dockedHeight
    }, 0)
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  })

  const NORMAL_WIDTH = isMobile ? 340 : 420
  const WIDGET_HEIGHT_COLLAPSED = 40
  const CHAT_PANEL_WIDTH = 340

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [initialized, setInitialized] = useState(false)
  const [showSnapGhost, setShowSnapGhost] = useState(false)

  // ── Has a dock panel? ──
  const hasDockPanel = dockedWidgets.length > 0

  // Total right-side reserved space (dock + chat can both be open)
  const getRightReserved = useCallback(() => {
    if (isMobile) return 0
    let reserved = 0
    if (isChatOpen) reserved += CHAT_PANEL_WIDTH
    if (hasDockPanel) reserved += dockWidth
    return reserved
  }, [isMobile, isChatOpen, hasDockPanel, dockWidth])

  // Initialize position — place to the left of right panels, stagger vertically
  useEffect(() => {
    if (!initialized) {
      const effectiveSidebarWidth = isMobile ? 0 : sidebarWidth
      const rightReserved = getRightReserved()
      const x = Math.max(
        effectiveSidebarWidth + SAFE_PADDING,
        window.innerWidth - NORMAL_WIDTH - SAFE_PADDING - rightReserved
      )
      const y =
        HEADER_HEIGHT +
        SUB_NAV_HEIGHT +
        SAFE_PADDING +
        (isMobile ? 40 : 0) +
        offsetIndex * (WIDGET_HEADER_HEIGHT + 10)
      setPosition({ x, y })
      setInitialized(true)
    }
  }, [initialized, isMobile, sidebarWidth, getRightReserved, NORMAL_WIDTH, offsetIndex])

  // When panels open/close while already floating, nudge widget so it doesn't overlap
  const prevReservedRef = useRef(getRightReserved())
  useEffect(() => {
    if (!initialized) return
    const rightReserved = getRightReserved()
    if (rightReserved !== prevReservedRef.current) {
      prevReservedRef.current = rightReserved
      const maxX = window.innerWidth - NORMAL_WIDTH - SAFE_PADDING - rightReserved
      if (position.x > maxX) {
        setPosition((p) => ({ ...p, x: Math.max(SAFE_PADDING, maxX) }))
      }
    }
  }, [getRightReserved, initialized, position.x, NORMAL_WIDTH])

  // Constrain + snap detection
  const constrainPosition = useCallback(
    (
      x: number,
      y: number,
      shouldSnap = false
    ): { x: number; y: number; snapped: boolean } => {
      const effectiveSidebarWidth = isMobile ? 0 : sidebarWidth
      const rightReserved = getRightReserved()
      const minX = effectiveSidebarWidth + SAFE_PADDING
      const minY = HEADER_HEIGHT + SAFE_PADDING
      const maxX =
        window.innerWidth - NORMAL_WIDTH - SAFE_PADDING - rightReserved
      const maxY = window.innerHeight - WIDGET_HEIGHT_COLLAPSED - SAFE_PADDING

      const newX = Math.max(minX, Math.min(maxX, x))
      const newY = Math.max(minY, Math.min(maxY, y))
      let snapped = false

      if (shouldSnap && !isMobile) {
        // Snap when near right edge (to the left of existing panels)
        const rightEdge = window.innerWidth - rightReserved
        const widgetRightEdge = newX + NORMAL_WIDTH
        if (widgetRightEdge >= rightEdge - SNAP_THRESHOLD) {
          snapped = true
        }
      }

      return { x: newX, y: newY, snapped }
    },
    [isMobile, sidebarWidth, NORMAL_WIDTH, getRightReserved]
  )

  // Mouse drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        offsetX: position.x,
        offsetY: position.y,
      }
      const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current.isDragging) return
        const result = constrainPosition(
          dragRef.current.offsetX + (e.clientX - dragRef.current.startX),
          dragRef.current.offsetY + (e.clientY - dragRef.current.startY),
          true
        )
        setPosition({ x: result.x, y: result.y })
        setShowSnapGhost(result.snapped)
      }
      const handleMouseUp = (e: MouseEvent) => {
        dragRef.current.isDragging = false
        const result = constrainPosition(
          dragRef.current.offsetX + (e.clientX - dragRef.current.startX),
          dragRef.current.offsetY + (e.clientY - dragRef.current.startY),
          true
        )
        if (result.snapped) {
          dockWidget(widget.id)
        }
        setShowSnapGhost(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [position, constrainPosition, dockWidget, widget.id]
  )

  // Touch drag
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      dragRef.current = {
        isDragging: true,
        startX: touch.clientX,
        startY: touch.clientY,
        offsetX: position.x,
        offsetY: position.y,
      }
      const handleTouchMove = (e: TouchEvent) => {
        if (!dragRef.current.isDragging) return
        e.preventDefault()
        const t = e.touches[0]
        const result = constrainPosition(
          dragRef.current.offsetX + (t.clientX - dragRef.current.startX),
          dragRef.current.offsetY + (t.clientY - dragRef.current.startY),
          true
        )
        setPosition({ x: result.x, y: result.y })
        setShowSnapGhost(result.snapped)
      }
      const handleTouchEnd = (e: TouchEvent) => {
        dragRef.current.isDragging = false
        const t = e.changedTouches[0]
        const result = constrainPosition(
          dragRef.current.offsetX + (t.clientX - dragRef.current.startX),
          dragRef.current.offsetY + (t.clientY - dragRef.current.startY),
          true
        )
        if (result.snapped) {
          dockWidget(widget.id)
        }
        setShowSnapGhost(false)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handleTouchEnd)
    },
    [position, constrainPosition, dockWidget, widget.id]
  )

  const event = widget.data
  const widgetBg = 'var(--ds-page-bg, #222222)'

  return (
    <>
      {/* Snap ghost — appears below any already-docked widgets, to the left of chat */}
      <AnimatePresence>
        {showSnapGhost && !isMobile && (
          <motion.div
            key={`snap-ghost-${widget.id}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[201] pointer-events-none"
            style={{
              right: isChatOpen ? CHAT_PANEL_WIDTH : 0,
              top: HEADER_HEIGHT + dockedTotalHeight,
              width: dockWidth,
              height: 300,
              border: '2px dashed rgba(255,255,255,0.3)',
              borderRadius: '0px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2 opacity-70">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <IconArrowBarRight className="w-5 h-5 text-white/40" />
                </div>
                <span className="text-[11px] text-white/40 font-medium">
                  Release to dock
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating widget */}
      <motion.div
        ref={containerRef}
        key={`float-${widget.id}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed z-[93] shadow-2xl shadow-black/50 overflow-hidden rounded-lg"
        style={{
          left: position.x,
          top: position.y,
          width: NORMAL_WIDTH,
          maxHeight: widget.isMinimized
            ? WIDGET_HEIGHT_COLLAPSED
            : isMobile
            ? '60vh'
            : '70vh',
          willChange: 'transform',
          pointerEvents: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
          style={{ backgroundColor: widgetBg }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex items-center gap-2 min-w-0">
            <IconGripVertical className="w-4 h-4 text-white/30 flex-shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              {event.isLive && (
                <div className="flex items-center gap-1 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5">
                  <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse" />
                  <span className="text-[8px] font-bold text-[#ee3536] uppercase">
                    Live
                  </span>
                </div>
              )}
              <span className="text-[11px] font-medium text-white truncate">
                {event.team1} vs {event.team2}
              </span>
            </div>
          </div>
          <div
            className="flex items-center gap-1 flex-shrink-0"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                dockWidget(widget.id)
              }}
              className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title="Dock to right panel"
            >
              <IconArrowBarRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleMinimize(widget.id)
              }}
              className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              {widget.isMinimized ? (
                <IconMaximize className="w-3.5 h-3.5" />
              ) : (
                <IconMinus className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeWidget(widget.id)
              }}
              className="p-1 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
            >
              <IconX className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!widget.isMinimized && (
          <TrackerWidgetContent
            event={event}
            maxHeight={isMobile ? 'calc(60vh - 52px)' : 'calc(70vh - 52px)'}
          />
        )}
      </motion.div>
    </>
  )
}

// ═════════════════════════════════════════════════════════════
// 4. WidgetDockManager — global orchestrator
// ═════════════════════════════════════════════════════════════

export function WidgetDockManager({ sidebarWidth = 0 }: { sidebarWidth?: number }) {
  const widgets = useWidgetDockStore((s) => s.widgets)
  const dockOrder = useWidgetDockStore((s) => s.dockOrder)

  const floatingWidgets = widgets.filter((w) => !w.isDocked)
  const hasDockedWidgets = dockOrder.some((id) =>
    widgets.find((w) => w.id === id && w.isDocked)
  )

  // Toggle .dock-open on <html> so CSS can shift page content
  useEffect(() => {
    const html = document.documentElement
    if (hasDockedWidgets) {
      html.classList.add('dock-open')
    } else {
      html.classList.remove('dock-open')
    }
    return () => html.classList.remove('dock-open')
  }, [hasDockedWidgets])

  return (
    <>
      {/* Dock panel */}
      <AnimatePresence>
        {hasDockedWidgets && <WidgetDockPanel />}
      </AnimatePresence>

      {/* Floating widgets */}
      <AnimatePresence>
        {floatingWidgets.map((widget, i) => (
          <FloatingTrackerWidget
            key={widget.id}
            widget={widget}
            offsetIndex={i}
            sidebarWidth={sidebarWidth}
          />
        ))}
      </AnimatePresence>
    </>
  )
}

// ═════════════════════════════════════════════════════════════
// 5. SportsTrackerWidget — backward-compatible bridge
//    Sport pages render this with a single event; it registers
//    with the global store so WidgetDockManager handles display.
// ═════════════════════════════════════════════════════════════

interface SportsTrackerWidgetProps {
  event: TrackerEventData | null
  onClose: () => void
  sidebarWidth?: number
}

export function SportsTrackerWidget({
  event,
  onClose,
  sidebarWidth: _sidebarWidth,
}: SportsTrackerWidgetProps) {
  const openWidget = useWidgetDockStore((s) => s.openWidget)
  const closeWidget = useWidgetDockStore((s) => s.closeWidget)
  const widgets = useWidgetDockStore((s) => s.widgets)
  const prevEventRef = useRef<number | null>(null)

  // When the page sets a new event, register it with the store
  useEffect(() => {
    if (event) {
      openWidget(event)
      prevEventRef.current = event.id
    }
  }, [event?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // When the page clears the event (sets null), close the widget
  useEffect(() => {
    if (!event && prevEventRef.current !== null) {
      closeWidget(String(prevEventRef.current))
      prevEventRef.current = null
    }
  }, [event, closeWidget])

  // Sync back: if widget was closed from the dock, notify the page
  useEffect(() => {
    if (!event) return
    const widgetId = String(event.id)
    const widgetExists = widgets.some((w) => w.id === widgetId)
    if (!widgetExists) {
      onClose()
      prevEventRef.current = null
    }
  }, [widgets, event, onClose])

  // Bridge component renders nothing — WidgetDockManager handles display
  return null
}
