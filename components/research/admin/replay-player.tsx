'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { IconLoader2, IconMaximize, IconMinimize, IconPlayerPauseFilled, IconPlayerPlayFilled, IconRotate } from '@tabler/icons-react'
import 'rrweb/dist/style.css'
import { cn } from '@/lib/utils'
import { loadReplayChunk } from '../session-recorder'

type Replayer = import('rrweb').Replayer

const SPEEDS = [1, 2, 4, 8] as const

/**
 * Session replay for one task. Drives rrweb's Replayer directly with our own controls —
 * scrub bar, play/pause, speed, fullscreen — styled like the rest of the research admin.
 * Loads when scrolled into view and paints the first frame paused.
 */
export function ReplayPlayer({ url, label }: { url: string; label?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const replayerRef = useRef<Replayer | null>(null)
  const rafRef = useRef<number | null>(null)
  const recorded = useRef({ width: 1440, height: 900 })

  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1)
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  // Fit the recorded viewport inside the stage.
  const fit = useCallback(() => {
    const stage = stageRef.current
    const mount = mountRef.current
    if (!stage || !mount) return
    const { width, height } = recorded.current
    const isFs = document.fullscreenElement === wrapRef.current
    const availW = stage.clientWidth
    const availH = isFs ? window.innerHeight - 56 : Infinity
    const scale = Math.min(availW / width, availH / height)
    const wrapper = mount.querySelector<HTMLElement>('.replayer-wrapper')
    if (wrapper) {
      wrapper.style.transform = `scale(${scale})`
      wrapper.style.transformOrigin = 'top left'
    }
    mount.style.width = `${width * scale}px`
    mount.style.height = `${height * scale}px`
  }, [])

  const stopTicking = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }
  const tick = useCallback(() => {
    const r = replayerRef.current
    if (!r) return
    setCurrent(Math.min(r.getCurrentTime(), r.getMetaData().totalTime))
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const load = useCallback(async () => {
    setState('loading')
    const events = await loadReplayChunk(url)
    if (!events || events.length < 2 || !mountRef.current) {
      setState('error')
      return
    }
    const { Replayer } = await import('rrweb')
    if (!mountRef.current) return
    mountRef.current.innerHTML = ''
    const meta = events.find((e) => e.type === 4) as { data?: { width: number; height: number } } | undefined
    if (meta?.data) recorded.current = { width: meta.data.width, height: meta.data.height }

    const r = new Replayer(events, {
      root: mountRef.current,
      speed: 1,
      skipInactive: true,
      mouseTail: false,
      showWarning: false,
      showDebug: false,
      UNSAFE_replayCanvas: false,
    })
    r.on('resize', (d) => {
      const dim = d as { width: number; height: number }
      recorded.current = dim
      fit()
    })
    r.on('finish', () => {
      setPlaying(false)
      setFinished(true)
      stopTicking()
      setCurrent(r.getMetaData().totalTime)
    })
    replayerRef.current = r
    setTotal(r.getMetaData().totalTime)
    r.pause(0) // paint first frame
    fit()
    setState('ready')
  }, [url, fit])

  // Lazy-load when visible; tear down on unmount.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          void load()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    const ro = new ResizeObserver(() => fit())
    ro.observe(el)
    const onFs = () => {
      setFullscreen(document.fullscreenElement === wrapRef.current)
      requestAnimationFrame(fit)
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => {
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('fullscreenchange', onFs)
      stopTicking()
      replayerRef.current?.destroy()
      replayerRef.current = null
    }
  }, [load, fit])

  const play = (from?: number) => {
    const r = replayerRef.current
    if (!r) return
    r.play(from ?? (finished ? 0 : current))
    setFinished(false)
    setPlaying(true)
    stopTicking()
    rafRef.current = requestAnimationFrame(tick)
  }
  const pause = () => {
    const r = replayerRef.current
    if (!r) return
    r.pause()
    setPlaying(false)
    stopTicking()
    setCurrent(r.getCurrentTime())
  }
  const seek = (ms: number) => {
    const r = replayerRef.current
    if (!r) return
    const t = Math.max(0, Math.min(ms, total))
    setFinished(false)
    if (playing) {
      r.play(t)
    } else {
      r.pause(t)
      setCurrent(t)
    }
  }
  const changeSpeed = (s: (typeof SPEEDS)[number]) => {
    setSpeed(s)
    replayerRef.current?.setConfig({ speed: s })
  }
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void wrapRef.current?.requestFullscreen()
  }

  const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    seek(((e.clientX - rect.left) / rect.width) * total)
  }

  const pct = total ? (current / total) * 100 : 0

  return (
    <div ref={wrapRef} className={cn('research-replay mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#0b0a14]', fullscreen && 'flex h-full flex-col justify-center border-0 rounded-none')}>
      {/* Stage */}
      <div ref={stageRef} className="relative w-full bg-black" onClick={() => state === 'ready' && (playing ? pause() : play())}>
        <div ref={mountRef} className="relative mx-auto overflow-hidden" />
        {state === 'loading' && (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-white/45">
            <IconLoader2 className="size-4 animate-spin" />
            Loading replay…
          </div>
        )}
        {state === 'error' && <p className="py-10 text-center text-xs text-white/45">Replay unavailable (not uploaded, or recorded on another device).</p>}
        {state === 'ready' && !playing && (
          <button
            type="button"
            aria-label={finished ? 'Replay' : 'Play'}
            className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#7c5cff] text-white shadow-[0_8px_30px_rgba(124,92,255,0.45)] transition-transform hover:scale-105"
          >
            {finished ? <IconRotate className="size-6" /> : <IconPlayerPlayFilled className="size-6 translate-x-0.5" />}
          </button>
        )}
      </div>

      {/* Controls */}
      {state === 'ready' && (
        <div className="select-none px-3 pb-2.5 pt-2">
          {/* Scrubber */}
          <div className="group relative h-4 cursor-pointer" onClick={onScrub} role="slider" aria-valuemin={0} aria-valuemax={total} aria-valuenow={current} tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') seek(current + 5000)
              if (e.key === 'ArrowLeft') seek(current - 5000)
              if (e.key === ' ') {
                e.preventDefault()
                playing ? pause() : play()
              }
            }}
          >
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10 transition-[height] group-hover:h-1.5">
              <div className="h-full rounded-full bg-[#7c5cff]" style={{ width: `${pct}%` }} />
            </div>
            <div className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-2 ring-[#7c5cff] opacity-0 transition-opacity group-hover:opacity-100" style={{ left: `${pct}%` }} />
          </div>

          <div className="mt-1 flex items-center gap-3">
            <button type="button" onClick={() => (playing ? pause() : play())} aria-label={playing ? 'Pause' : 'Play'} className="flex size-7 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white">
              {playing ? <IconPlayerPauseFilled className="size-4" /> : <IconPlayerPlayFilled className="size-4" />}
            </button>
            <span className="text-xs tabular-nums text-white/70">
              {fmt(current)} <span className="text-white/30">/</span> {fmt(total)}
            </span>
            {label && <span className="hidden text-[11px] uppercase tracking-wide text-white/30 sm:inline">{label}</span>}
            <div className="ml-auto flex items-center gap-0.5 rounded-md bg-white/[0.05] p-0.5">
              {SPEEDS.map((s) => (
                <button key={s} type="button" onClick={() => changeSpeed(s)} className={cn('h-6 min-w-[30px] rounded px-1.5 text-[11px] font-medium tabular-nums transition-colors', speed === s ? 'bg-[#7c5cff] text-white' : 'text-white/55 hover:text-white')}>
                  {s}×
                </button>
              ))}
            </div>
            <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} className="flex size-7 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white">
              {fullscreen ? <IconMinimize className="size-4" /> : <IconMaximize className="size-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
