'use client'

import { useEffect, useRef, useState } from 'react'
import { IconLoader2, IconMicrophone, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerStopFilled, IconRefresh, IconTrash } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { uploadAudio } from '../audio-storage'

/* Minimal typings for the (prefixed) Web Speech API. */
type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

interface VoiceAnswerProps {
  /** Storage path (without extension) for the clip. */
  storagePath: string
  /** Live transcript → parent's text answer. */
  onTranscript: (text: string) => void
  /** Uploaded (or inline) audio URL, or null when cleared. */
  onAudio: (url: string | null) => void
  onUploadingChange?: (uploading: boolean) => void
  className?: string
}

type State = 'idle' | 'recording' | 'uploading' | 'done' | 'unsupported'

/**
 * Mic option for a text question. Records (MediaRecorder) with a live waveform, transcribes
 * live where the browser supports it, then lets the tester play back, retake or delete.
 */
export function VoiceAnswer({ storagePath, onTranscript, onAudio, onUploadingChange, className }: VoiceAnswerProps) {
  const [state, setState] = useState<State>('idle')
  const [seconds, setSeconds] = useState(0)
  const [localUrl, setLocalUrl] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recogRef = useRef<SpeechRecognitionLike | null>(null)
  const finalRef = useRef('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const durationRef = useRef(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined')) setState('unsupported')
    return () => {
      teardown()
      if (localUrl) URL.revokeObjectURL(localUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const teardown = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    recogRef.current?.stop()
    recogRef.current = null
    const rec = recorderRef.current
    if (rec && rec.state !== 'inactive') rec.stop()
    rec?.stream.getTracks().forEach((t) => t.stop())
    void audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
  }

  const start = async () => {
    try {
      // Retake: drop the previous clip first.
      if (localUrl) {
        URL.revokeObjectURL(localUrl)
        setLocalUrl(null)
        onAudio(null)
        onTranscript('')
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : ''
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
      chunksRef.current = []
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        void audioCtxRef.current?.close().catch(() => {})
        audioCtxRef.current = null
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
        if (!blob.size) {
          setState('idle')
          return
        }
        setLocalUrl(URL.createObjectURL(blob))
        setState('uploading')
        onUploadingChange?.(true)
        const ext = blob.type.includes('mp4') ? 'm4a' : 'webm'
        try {
          const url = await uploadAudio(blob, `${storagePath}.${ext}`)
          onAudio(url)
          setState('done')
        } catch {
          setState('done') // keep local playback even if upload failed
        } finally {
          onUploadingChange?.(false)
        }
      }
      recorderRef.current = rec
      rec.start()

      // Analyser for the live waveform
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (Ctx) {
        const ctx = new Ctx()
        const src = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        src.connect(analyser)
        audioCtxRef.current = ctx
        analyserRef.current = analyser
      }

      // Live transcription (Chrome / Safari / Edge). Silently skipped elsewhere.
      const Ctor = getRecognition()
      if (Ctor) {
        const r = new Ctor()
        r.lang = navigator.language || 'en-US'
        r.continuous = true
        r.interimResults = true
        finalRef.current = ''
        r.onresult = (e) => {
          let interim = ''
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const res = e.results[i]
            if (res.isFinal) finalRef.current += `${res[0].transcript} `
            else interim += res[0].transcript
          }
          onTranscript(`${finalRef.current}${interim}`.trim())
        }
        r.onerror = () => {}
        try {
          r.start()
          recogRef.current = r
        } catch {
          /* ignore */
        }
      }

      setSeconds(0)
      durationRef.current = 0
      timerRef.current = setInterval(() => {
        durationRef.current += 1
        setSeconds(durationRef.current)
      }, 1000)
      setState('recording')
    } catch {
      setState('unsupported')
    }
  }

  const analyserRef = useRef<AnalyserNode | null>(null)

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    recogRef.current?.stop()
    recogRef.current = null
    recorderRef.current?.stop()
    analyserRef.current = null
  }

  const clear = () => {
    if (localUrl) URL.revokeObjectURL(localUrl)
    setLocalUrl(null)
    onAudio(null)
    onTranscript('')
    setState('idle')
  }

  if (state === 'unsupported') return null

  return (
    <div className={cn('text-xs', className)}>
      {state === 'idle' && (
        <button
          type="button"
          onClick={start}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 px-3 font-medium text-white/70 hover:border-[#7c5cff] hover:text-white"
        >
          <IconMicrophone className="size-3.5" />
          Speak instead
        </button>
      )}

      {state === 'recording' && (
        <div className="flex items-center gap-2 rounded-xl border border-[#7c5cff]/50 bg-[#7c5cff]/10 p-2">
          <span className="relative ml-1 flex size-2.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6b6b]/70" />
            <span className="relative size-2.5 rounded-full bg-[#ff6b6b]" />
          </span>
          <Waveform analyserRef={analyserRef} className="h-8 min-w-0 flex-1" />
          <span className="w-9 shrink-0 text-right tabular-nums text-white/70">{fmt(seconds)}</span>
          <button type="button" onClick={stop} aria-label="Stop recording" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#7c5cff] text-white hover:bg-[#6b4cf0]">
            <IconPlayerStopFilled className="size-3.5" />
          </button>
        </div>
      )}

      {(state === 'uploading' || state === 'done') && localUrl && (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2">
          <Playback src={localUrl} seconds={seconds} />
          {state === 'uploading' ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-white/50">
              <IconLoader2 className="size-3.5 animate-spin" />
              Saving
            </span>
          ) : (
            <>
              <button type="button" onClick={start} title="Retake" aria-label="Retake" className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white">
                <IconRefresh className="size-4" />
              </button>
              <button type="button" onClick={clear} title="Delete" aria-label="Delete recording" className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-[#ff6b6b]">
                <IconTrash className="size-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Live waveform ────────────────────────────────────────────

function Waveform({ analyserRef, className }: { analyserRef: React.MutableRefObject<AnalyserNode | null>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Rolling bar history so the wave scrolls left as you speak.
  const historyRef = useRef<number[]>([])

  useEffect(() => {
    let raf = 0
    const draw = () => {
      const canvas = canvasRef.current
      const analyser = analyserRef.current
      if (canvas) {
        const dpr = window.devicePixelRatio || 1
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr
          canvas.height = h * dpr
        }
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.clearRect(0, 0, w, h)
          // Sample current loudness
          let level = 0
          if (analyser) {
            const data = new Uint8Array(analyser.fftSize)
            analyser.getByteTimeDomainData(data)
            let sum = 0
            for (let i = 0; i < data.length; i++) {
              const v = (data[i] - 128) / 128
              sum += v * v
            }
            level = Math.min(1, Math.sqrt(sum / data.length) * 3.2)
          }
          const barW = 3
          const gap = 2
          const bars = Math.floor(w / (barW + gap))
          const hist = historyRef.current
          hist.push(level)
          while (hist.length > bars) hist.shift()
          ctx.fillStyle = '#b7a8ff'
          for (let i = 0; i < hist.length; i++) {
            const bh = Math.max(2, hist[i] * h)
            const x = w - (hist.length - i) * (barW + gap)
            ctx.globalAlpha = 0.45 + 0.55 * (i / hist.length)
            roundRect(ctx, x, (h - bh) / 2, barW, bh, 1.5)
          }
          ctx.globalAlpha = 1
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [analyserRef])

  return <canvas ref={canvasRef} className={cn('block w-full', className)} aria-hidden />
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  ctx.fill()
}

// ─── Playback ─────────────────────────────────────────────────

function Playback({ src, seconds }: { src: string; seconds: number }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => {
      const d = Number.isFinite(a.duration) && a.duration > 0 ? a.duration : seconds || 1
      setProgress(Math.min(1, a.currentTime / d))
    }
    const onEnd = () => {
      setPlaying(false)
      setProgress(0)
    }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('ended', onEnd)
    }
  }, [seconds])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      void a.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current
    if (!a) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    const d = Number.isFinite(a.duration) && a.duration > 0 ? a.duration : seconds
    a.currentTime = ratio * d
    setProgress(ratio)
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play recording'} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#7c5cff] text-white hover:bg-[#6b4cf0]">
        {playing ? <IconPlayerPauseFilled className="size-3.5" /> : <IconPlayerPlayFilled className="size-3.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-[11px] text-white/60">
          <span className="inline-flex items-center gap-1 text-[#b7a8ff]">
            <IconMicrophone className="size-3" />
            Voice answer
          </span>
          <span className="tabular-nums">{fmt(seconds)}</span>
        </div>
        <div className="mt-1 h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/10" onClick={seek} role="slider" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} tabIndex={-1}>
          <div className="h-full rounded-full bg-[#b7a8ff]" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
