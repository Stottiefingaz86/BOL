'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  IconChevronDown,
  IconGripVertical,
  IconMaximize,
  IconVolume,
  IconVolumeOff,
} from '@tabler/icons-react'
import { TrackerWidgetContent } from '@/components/sports-tracker-widget'
import type { TrackerEventData } from '@/lib/store/widgetDockStore'
import { cn } from '@/lib/utils'
import type { LeagueGroup, SportsEvent } from './mock-data'

export const DOCK_MIN_WIDTH = 320
export const DOCK_MAX_WIDTH = 760
export const DOCK_DEFAULT_WIDTH = 400
const STORAGE_KEY = 'sports:event-dock-width'
const HEADER_HEIGHT = 64
const WIDGET_HEADER_HEIGHT = 40

/** Placeholder live feed until the real stream provider is wired up. */

export function toTrackerEvent(event: SportsEvent, league: LeagueGroup): TrackerEventData {
  return {
    id: hash(event.id),
    team1: event.home.name,
    team2: event.away.name,
    team1Logo: event.home.logo,
    team2Logo: event.away.logo,
    team1Code: event.home.code,
    team2Code: event.away.code,
    league: league.title,
    country: league.subtitle,
    sport: league.sport === 'basketball' ? 'basketball' : 'football',
    score: { team1: event.home.score ?? 0, team2: event.away.score ?? 0 },
    minute: event.isLive ? event.clock : undefined,
    isLive: event.isLive,
  }
}

/** Persisted, user-resizable width for the desktop dock. */
export function useDockWidth() {
  const [width, setWidth] = useState(DOCK_DEFAULT_WIDTH)
  useEffect(() => {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY))
    if (saved >= DOCK_MIN_WIDTH && saved <= DOCK_MAX_WIDTH) setWidth(saved)
  }, [])
  const update = useCallback((w: number) => {
    const clamped = Math.round(Math.min(DOCK_MAX_WIDTH, Math.max(DOCK_MIN_WIDTH, w)))
    setWidth(clamped)
    window.localStorage.setItem(STORAGE_KEY, String(clamped))
  }, [])
  return [width, update] as const
}

// ─── Dock widgets ─────────────────────────────────────────────

function DockWidget({
  title,
  isLive,
  actions,
  defaultOpen = true,
  children,
}: {
  title: string
  isLive?: boolean
  actions?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/10 bg-[var(--ds-page-bg,#222222)]">
      <div
        className="flex select-none items-center justify-between border-b border-white/5 px-3"
        style={{ height: WIDGET_HEADER_HEIGHT }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <IconGripVertical className="size-4 shrink-0 text-white/30" />
          {isLive && (
            <div className="flex items-center gap-1 rounded border border-[#ee3536]/50 bg-[#ee3536]/20 px-1 py-0.5">
              <div className="size-1.5 animate-pulse rounded-full bg-[#ee3536]" />
              <span className="text-[8px] font-bold uppercase text-[#ee3536]">Live</span>
            </div>
          )}
          <span className="truncate text-[11px] font-medium text-white">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {actions}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Collapse' : 'Expand'}
            className="flex size-6 items-center justify-center rounded text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <IconChevronDown className={cn('size-3.5 transition-transform', !open && '-rotate-90')} />
          </button>
        </div>
      </div>
      {open && children}
    </div>
  )
}

function LiveStreamWidget({ event }: { event: SportsEvent }) {
  const playerRef = useRef<HTMLDivElement>(null!)
  const [muted, setMuted] = useState(true)

  const fullscreen = () => playerRef.current?.requestFullscreen?.()

  return (
    <DockWidget
      title="Live Stream"
      isLive={event.isLive}
      actions={
        <>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="flex size-6 items-center justify-center rounded text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            {muted ? <IconVolumeOff className="size-3.5" /> : <IconVolume className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={fullscreen}
            aria-label="Fullscreen"
            className="flex size-6 items-center justify-center rounded text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <IconMaximize className="size-3.5" />
          </button>
        </>
      }
    >
      <LiveStreamPlayer event={event} containerRef={playerRef} muted={muted} />
    </DockWidget>
  )
}

/**
 * Mock "live" feed.
 * NFL / ESPN-owned YouTube videos (e.g. https://www.youtube.com/watch?v=RYh8_uw45Fw) have embedding
 * disabled by the rights holder ("Video unavailable"), so by default we loop a free-to-use stadium clip
 * (Pexels, public/sports/live-stream.mp4). Set LIVE_STREAM_YOUTUBE_ID to embed a video that allows it.
 */
const LIVE_STREAM_YOUTUBE_ID: string | null = null
const LIVE_STREAM_SRC = '/sports/live-stream.mp4'

/** Bare 16:9 stream + score bug (no widget chrome) — used inside the dock widget and inline on mobile. */
export function LiveStreamPlayer({
  event,
  containerRef,
  muted = true,
  className,
}: {
  event: SportsEvent
  containerRef?: React.RefObject<HTMLDivElement>
  muted?: boolean
  className?: string
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // YouTube: drive mute/unmute through the IFrame API so toggling doesn't reload the video.
  useEffect(() => {
    if (!LIVE_STREAM_YOUTUBE_ID) return
    const win = iframeRef.current?.contentWindow
    if (!win) return
    win.postMessage(JSON.stringify({ event: 'command', func: muted ? 'mute' : 'unMute', args: [] }), '*')
  }, [muted])

  const ytSrc = LIVE_STREAM_YOUTUBE_ID
    ? `https://www.youtube-nocookie.com/embed/${LIVE_STREAM_YOUTUBE_ID}` +
      `?autoplay=1&mute=1&controls=0&loop=1&playlist=${LIVE_STREAM_YOUTUBE_ID}` +
      `&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`
    : null

  return (
    <div ref={containerRef} className={cn('relative aspect-video w-full overflow-hidden bg-black', className)}>
      {ytSrc ? (
        // Oversize the iframe slightly so YouTube's title bar / edges are cropped out
        <iframe
          ref={iframeRef}
          src={ytSrc}
          title="Live stream"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(100%+120px)] w-[calc(100%+2px)] -translate-x-1/2 -translate-y-1/2 border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <video
          src={LIVE_STREAM_SRC}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted={muted}
          loop
          playsInline
        />
      )}
      {/* Score bug */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
        <span>{event.home.code}</span>
        <span className="tabular-nums text-[#f5d300]">
          {event.home.score ?? 0} - {event.away.score ?? 0}
        </span>
        <span>{event.away.code}</span>
        {event.isLive && (
          <>
            <span className="mx-0.5 h-3 w-px bg-white/25" />
            <span className="font-medium text-[#8fd790]">{event.clock}</span>
          </>
        )}
      </div>
    </div>
  )
}

/** Bare match tracker body (no widget chrome). */
export function MatchTrackerBody({
  event,
  league,
  hideScoreboard = false,
}: {
  event: SportsEvent
  league: LeagueGroup
  hideScoreboard?: boolean
}) {
  return <TrackerWidgetContent event={toTrackerEvent(event, league)} hideScoreboard={hideScoreboard} />
}

function MatchTrackerWidget({ event, league }: { event: SportsEvent; league: LeagueGroup }) {
  return (
    <DockWidget title="Match Tracker">
      <TrackerWidgetContent event={toTrackerEvent(event, league)} />
    </DockWidget>
  )
}

/** Stacked dock content — live stream on top, match tracker below. */
export function EventDockContent({ event, league }: { event: SportsEvent; league: LeagueGroup }) {
  return (
    <>
      {event.isLive && <LiveStreamWidget event={event} />}
      <MatchTrackerWidget event={event} league={league} />
    </>
  )
}

// ─── Desktop dock panel ───────────────────────────────────────

interface EventDockProps {
  event: SportsEvent
  league: LeagueGroup
  width: number
  onResize: (width: number) => void
}

/**
 * Right-side dock (same shell as the legacy widget dock): fixed under the header,
 * pushes the page content left via `html.event-dock-open` + `--event-dock-width`,
 * and can be dragged wider/narrower from its left edge.
 */
export function EventDock({ event, league, width, onResize }: EventDockProps) {
  const [dragging, setDragging] = useState(false)
  const startRef = useRef<{ x: number; w: number } | null>(null)

  // Reserve space for the dock (globals.css: body padding, sub-nav right edge, sidebar wrapper max-width).
  // Own class — the legacy WidgetDockManager owns `dock-open` and clears it when it has no widgets.
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('event-dock-open')
    root.style.setProperty('--event-dock-width', `${width}px`)
    return () => {
      root.classList.remove('event-dock-open')
      root.style.removeProperty('--event-dock-width')
    }
  }, [width])

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    startRef.current = { x: e.clientX, w: width }
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !startRef.current) return
    // Dragging left → wider, right → narrower
    onResize(startRef.current.w + (startRef.current.x - e.clientX))
  }
  const endDrag = () => {
    startRef.current = null
    setDragging(false)
  }

  useEffect(() => {
    if (!dragging) return
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    return () => {
      document.body.style.removeProperty('cursor')
      document.body.style.removeProperty('user-select')
    }
  }, [dragging])

  return (
    <aside
      aria-label="Match tracker dock"
      className="fixed right-0 z-[100] overflow-y-auto border-l border-white/10 scrollbar-hide"
      style={{
        top: HEADER_HEIGHT,
        width,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        backgroundColor: 'var(--ds-page-bg, #222222)',
      }}
    >
      {/* Left-edge width resize handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize dock"
        title="Drag to resize"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          'group absolute inset-y-0 left-0 z-10 w-1.5 cursor-col-resize touch-none transition-colors hover:bg-white/10',
          dragging && 'bg-white/10'
        )}
      >
        <div
          className={cn(
            'absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full transition-colors',
            dragging ? 'bg-[var(--ds-primary,#ee3536)]' : 'bg-white/10 group-hover:bg-white/30'
          )}
        />
      </div>

      <EventDockContent event={event} league={league} />
    </aside>
  )
}

function hash(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h)
}
