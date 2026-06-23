'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion'
import {
  JACKPOT_TICKER_TIERS,
  type JackpotTickerTierConfig,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import { playJackpotBgMusic, playSound, playWheelHighlightTick, preloadWheelHighlightTicks, setJackpotBgVolume } from '@/lib/sounds'
import { cn } from '@/lib/utils'

const SEGMENTS_PER_TIER = 2
const SEGMENT_COUNT = JACKPOT_TICKER_TIERS.length * SEGMENTS_PER_TIER
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT
// Slower, fewer rotations so the logos are readable as they pass the pointer.
const SPIN_DURATION_MS = 10800
const EXTRA_SPINS = 4
/** Over the final N segments the ticks escalate (louder + higher) for excitement. */
const EXCITE_SEGMENTS = 9
/** Spin progress at which the camera begins pushing in on the top pointer zone. */
const CLOSE_IN_AT = 0.6
/** Hold on the winning segment before the hand-off wipe. */
const LANDED_HOLD_MS = 2800
/** Left-to-right wipe duration revealing the jackpot win screen underneath. */
const WIPE_DURATION_MS = 920
/** Desktop zoom pushes into the top arc; mobile uses much lower scale so the
    wheel stays inside the viewport instead of clipping off-screen. */
const DESKTOP_WHEEL_LAYOUT = {
  introScale: 0.82,
  zoomScale: 2.75,
  closeScale: 3.1,
  introY: '0%',
  zoomY: '40%',
  closeY: '46%',
  wheelSizeClass: 'h-[min(92vw,420px)] w-[min(92vw,420px)]',
  pointerClass: 'h-[72px] w-[80px]',
} as const

const MOBILE_WHEEL_LAYOUT = {
  introScale: 0.72,
  // FanDuel-style: wheel centre sits on the bottom edge, only the top arc shows.
  zoomScale: 3,
  closeScale: 3.15,
  introY: '0%',
  zoomY: '44%',
  closeY: '44%',
  wheelSizeClass: 'h-[min(100vw,420px)] w-[min(100vw,420px)]',
  pointerClass: 'h-[58px] w-[64px]',
} as const

const WHEEL_CX = 200
const WHEEL_CY = 200

/** Vivid, saturated FanDuel-style palette per tier (no pastels). */
const SEGMENT_PALETTE: Record<
  JackpotTickerTierId,
  { hub: string; mid: string; rim: string; neon: string }
> = {
  mini: { hub: '#053b30', mid: '#0d9488', rim: '#2dd4bf', neon: '#5eead4' },
  minor: { hub: '#10215c', mid: '#1d4ed8', rim: '#3b82f6', neon: '#7dd3fc' },
  major: { hub: '#3b0d68', mid: '#7c3aed', rim: '#b026d3', neon: '#f0abfc' },
  mega: { hub: '#6b2406', mid: '#ea580c', rim: '#f59e0b', neon: '#fcd34d' },
}

type WheelPhase = 'intro' | 'zoom' | 'spin' | 'landed' | 'wipe'

type WheelSegment = {
  index: number
  tier: JackpotTickerTierConfig
  shade: number
}

function buildSegments(): WheelSegment[] {
  const segments: WheelSegment[] = []
  let index = 0
  // Interleave by shade first so the copies of each tier are spaced evenly
  // around the wheel (e.g. the two Mini slices end up directly opposite each
  // other) rather than sitting next to each other.
  for (let shade = 0; shade < SEGMENTS_PER_TIER; shade++) {
    for (const tier of JACKPOT_TICKER_TIERS) {
      segments.push({ index: index++, tier, shade })
    }
  }
  return segments
}

const WHEEL_SEGMENTS = buildSegments()

/** Toggle segment highlight via DOM — avoids React re-renders on every tick. */
function applyWheelSegmentHighlight(
  svgRoot: SVGSVGElement | null,
  prevIndex: number | null,
  nextIndex: number | null,
  isMobile: boolean
) {
  const setLit = (idx: number, lit: boolean) => {
    const g = svgRoot?.querySelector(`[data-seg="${idx}"]`)
    if (g) {
      g.querySelector('.seg-mute')?.setAttribute('opacity', lit ? '0' : '0.46')
      g.querySelector('.seg-logo')?.setAttribute('opacity', lit ? '1' : '0.5')
    }
    // Overlay layer (drawn above all base slices) carries the bright lit edge.
    const top = svgRoot?.querySelector(`[data-seg-top="${idx}"]`)
    if (top) {
      top.querySelector('.seg-sheen')?.setAttribute('opacity', lit ? '1' : '0')
      const edge = top.querySelector('.seg-edge-top')
      if (edge) {
        edge.setAttribute('stroke-opacity', lit ? '0.95' : '0')
        if (lit && !isMobile) {
          edge.setAttribute('filter', 'url(#litGlow)')
        } else {
          edge.removeAttribute('filter')
        }
      }
    }
  }
  if (prevIndex != null && prevIndex !== nextIndex) setLit(prevIndex, false)
  if (nextIndex != null) setLit(nextIndex, true)
}

function applyHubTierLogo(hubImage: HTMLImageElement | null, segmentIndex: number | null) {
  if (!hubImage || segmentIndex == null) return
  const tier = WHEEL_SEGMENTS[segmentIndex]?.tier
  if (!tier) return
  hubImage.src = `/jackpot/${tier.id}_reel.svg`
}

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360
}

function pickWinTier(): JackpotTickerTierId {
  const r = Math.random()
  if (r < 0.45) return 'mega'
  if (r < 0.72) return 'major'
  if (r < 0.88) return 'minor'
  return 'mini'
}

function rotationToLandOnSegment(segmentIndex: number): number {
  // Land with the pointer on the segment centre so it reads cleanly.
  const offsetFromTop = segmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE * 0.5
  return EXTRA_SPINS * 360 + normalizeAngle(360 - offsetFromTop)
}

/** Which segment sits under the fixed top pointer at this wheel rotation. */
function segmentAtPointer(rotationDeg: number): number {
  const offsetFromTop = normalizeAngle(-rotationDeg)
  return Math.floor(offsetFromTop / SEGMENT_ANGLE) % SEGMENT_COUNT
}

/**
 * One single, continuous spin curve — no phases, no restarts (that was the jank).
 *
 *  • A short smooth spin-up (quarter-sine) so the wheel flicks up to speed.
 *  • Then a decelerating tail that slows MORE the closer it gets to the stop.
 *    The end velocity ∝ (1-p)^(n-1), so with n > 2 the final couple of
 *    segments crawl in — the gaps between ticks stretch out dramatically.
 *    That long, drawn-out creep is the anticipation.
 *
 * Velocity is matched at the hand-off (peak velocity on both sides), so the
 * motion never stutters. n=2 would be plain constant friction; we use a higher
 * power for a much longer, more suspenseful slow-down at the very end.
 */
const SPIN_ACCEL_FRAC = 0.1
const SPIN_DECEL_POW = 2.5
const SPIN_TWO_OVER_PI = 2 / Math.PI
// Peak velocity, chosen so accel + decel distances sum to exactly 1, while the
// velocity is continuous across the hand-off (decel start velocity == peak).
const SPIN_DECEL_SPAN = 1 - SPIN_ACCEL_FRAC
const SPIN_PEAK_V =
  SPIN_DECEL_POW /
  (SPIN_DECEL_SPAN + SPIN_DECEL_POW * SPIN_ACCEL_FRAC * SPIN_TWO_OVER_PI)
const SPIN_ACCEL_DIST = SPIN_PEAK_V * SPIN_ACCEL_FRAC * SPIN_TWO_OVER_PI
const SPIN_DECEL_DIST = 1 - SPIN_ACCEL_DIST

function spinEase(t: number): number {
  if (t >= 1) return 1
  if (t <= 0) return 0
  if (t < SPIN_ACCEL_FRAC) {
    // Quarter-sine spin-up: velocity 0 → peak.
    return (
      SPIN_PEAK_V *
      SPIN_ACCEL_FRAC *
      SPIN_TWO_OVER_PI *
      (1 - Math.cos((Math.PI / 2) * (t / SPIN_ACCEL_FRAC)))
    )
  }
  // Power decel: position = 1 - (1-p)^n, velocity tapers off ever more gently.
  const p = (t - SPIN_ACCEL_FRAC) / SPIN_DECEL_SPAN
  return SPIN_ACCEL_DIST + SPIN_DECEL_DIST * (1 - Math.pow(1 - p, SPIN_DECEL_POW))
}

function adjustHex(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.max(0, (n >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function segmentLabelPosition(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  midAngle: number
) {
  const labelR = innerR + (outerR - innerR) * 0.62
  return polarToCartesian(cx, cy, labelR, midAngle)
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeSegment(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(cx, cy, outerR, startAngle)
  const endOuter = polarToCartesian(cx, cy, outerR, endAngle)
  const startInner = polarToCartesian(cx, cy, innerR, endAngle)
  const endInner = polarToCartesian(cx, cy, innerR, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ')
}

function FanDuelBackground({
  phase,
  isMobile,
  containerRef,
}: {
  phase: WheelPhase
  isMobile: boolean
  containerRef?: RefObject<HTMLDivElement>
}) {
  const showStars = phase === 'spin' || phase === 'landed' || phase === 'wipe'
  const spotlightY = isMobile && phase !== 'intro' ? '72%' : '46%'

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 95% at 50% 40%, #18102a 0%, #0e0818 50%, #06040c 100%)',
        }}
      />

      {showStars && <ShootingStarsCanvas containerRef={containerRef} />}

      {/* Soft static spotlight behind the wheel — no pulsing or sunburst */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          top: spotlightY,
          width: isMobile ? '88%' : '64%',
          height: isMobile ? '46%' : '50%',
          background:
            'radial-gradient(circle, rgba(109,40,217,0.18) 0%, rgba(56,189,248,0.05) 42%, transparent 72%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" />
    </div>
  )
}

/** Diagonal streaks across the full viewport — ambient bg, not centred on the wheel. */
function ShootingStarsCanvas({
  containerRef,
}: {
  containerRef?: RefObject<HTMLDivElement>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef?.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let cssW = 0
    let cssH = 0
    let raf = 0
    let lastSpawn = 0

    type Particle = {
      x: number
      y: number
      vx: number
      vy: number
      length: number
      thickness: number
      alpha: number
      fadeRate: number
      color: string
      glow: string
    }

    let particles: Particle[] = []
    const colors = ['#ffffff', '#c4b5fd', '#67e8f9', '#a78bfa']
    const glows = ['255,255,255', '196,181,253', '103,232,249', '167,139,250']

    const resize = () => {
      const rect = container.getBoundingClientRect()
      cssW = rect.width
      cssH = rect.height
      canvas.width = cssW * dpr
      canvas.height = cssH * dpr
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = () => {
      const count = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * colors.length)
        const angle = ((38 + Math.random() * 22) * Math.PI) / 180
        const speed = 3.5 + Math.random() * 4.5
        const bucket = Math.random()
        const length =
          bucket < 0.55
            ? 36 + Math.random() * 40
            : bucket < 0.85
              ? 72 + Math.random() * 55
              : 120 + Math.random() * 70
        particles.push({
          x: Math.random() * cssW * 1.15 - cssW * 0.08,
          y: -40 - Math.random() * cssH * 0.35,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length,
          thickness: 1 + Math.random() * 1.8,
          alpha: 0.22 + Math.random() * 0.32,
          fadeRate: 0.006 + Math.random() * 0.009,
          color: colors[idx]!,
          glow: glows[idx]!,
        })
      }
    }

    const tick = (now: number) => {
      ctx.clearRect(0, 0, cssW, cssH)

      if (now - lastSpawn > 90) {
        spawn()
        lastSpawn = now
      }

      for (const p of particles) {
        const mag = Math.hypot(p.vx, p.vy) || 1
        const nx = p.vx / mag
        const ny = p.vy / mag
        const sx = p.x - nx * p.length
        const sy = p.y - ny * p.length
        const ex = p.x
        const ey = p.y

        const grad = ctx.createLinearGradient(sx, sy, ex, ey)
        grad.addColorStop(0, `rgba(${p.glow}, 0)`)
        grad.addColorStop(0.55, p.color)
        grad.addColorStop(1, `rgba(${p.glow}, 0)`)

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.strokeStyle = grad
        ctx.lineWidth = p.thickness
        ctx.lineCap = 'round'
        ctx.shadowBlur = 5
        ctx.shadowColor = `rgba(${p.glow}, 0.45)`
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
        ctx.stroke()
        ctx.restore()

        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.fadeRate
      }

      particles = particles.filter(
        (p) =>
          p.alpha > 0 &&
          p.x > -120 &&
          p.x < cssW + 120 &&
          p.y > -120 &&
          p.y < cssH + 120
      )

      raf = requestAnimationFrame(tick)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles = []
    }
  }, [containerRef])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    />
  )
}

function WheelPointer({
  active,
  pointerClass,
  showPinMount = true,
}: {
  active: boolean
  pointerClass: string
  showPinMount?: boolean
}) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-40 -translate-x-1/2 -translate-y-1">
      <motion.div
        className="absolute left-1/2 top-[52px] h-14 w-24 -translate-x-1/2 rounded-full blur-2xl"
        animate={{
          opacity: active ? 0.9 : 0.25,
          scale: active ? 1.15 : 0.85,
        }}
        transition={{ duration: 0.12 }}
        style={{
          background:
            'radial-gradient(circle, rgba(238,53,54,0.6) 0%, rgba(238,53,54,0.2) 50%, transparent 72%)',
        }}
      />

      <svg
        viewBox="0 0 80 72"
        className={cn('relative drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]', pointerClass)}
        aria-hidden
      >
        <defs>
          <linearGradient id="flapMetal" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3e" />
            <stop offset="45%" stopColor="#1c1c1f" />
            <stop offset="100%" stopColor="#0a0a0b" />
          </linearGradient>
          <linearGradient id="flapGem" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="55%" stopColor="#ee3536" />
            <stop offset="100%" stopColor="#a51f20" />
          </linearGradient>
          <filter id="flapGlow">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#ee3536" floodOpacity="0.55" />
          </filter>
        </defs>
        {showPinMount && (
          <rect x="30" y="4" width="20" height="10" rx="3" fill="#1c1c1f" stroke="#000000" strokeWidth="1" />
        )}
        {/* Flapper — apex points DOWN into the wheel (black bezel) */}
        <polygon
          points="40,66 12,16 68,16"
          fill="url(#flapMetal)"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#flapGlow)"
        />
        {/* Inset red gem */}
        <polygon points="40,56 22,22 58,22" fill="url(#flapGem)" />
        {/* Subtle top sheen on the gem */}
        <polygon points="40,33 30,23 50,23" fill="#ffffff" opacity="0.22" />
      </svg>
    </div>
  )
}

function IntroTitleOverlay({ phase }: { phase: WheelPhase }) {
  const merging = phase === 'zoom'

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      initial={false}
      animate={{
        scale: merging ? 0.14 : 1,
        opacity: merging ? 0 : 1,
      }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex flex-col items-center text-center">
        <img
          src="/jackpot/jackpot_wheel_logo.svg"
          alt="Jackpot Wheel"
          className="w-[clamp(11rem,42vw,17rem)] max-w-none select-none"
          draggable={false}
          style={{ filter: 'drop-shadow(0 0 22px rgba(56,189,248,0.45))' }}
        />
      </div>
    </motion.div>
  )
}

function WheelSvg({
  rotation,
  highlightedIndex,
  phase,
  wheelSizeClass,
  isMobile = false,
  wheelGroupRef,
  wheelSvgRef,
}: {
  rotation: number
  highlightedIndex: number | null
  phase: WheelPhase
  wheelSizeClass: string
  isMobile?: boolean
  wheelGroupRef?: RefObject<SVGGElement>
  wheelSvgRef?: RefObject<SVGSVGElement>
}) {
  const cx = WHEEL_CX
  const cy = WHEEL_CY
  const outerR = 178
  // Segments run all the way to the centre so the glass hub (an HTML
  // backdrop-blur disc rendered on top) has real colour to refract behind it.
  const segInnerR = 0
  // Reference radius used purely to keep the tier labels in their usual ring.
  const labelInnerR = 58
  const showHighlight = phase === 'spin' || phase === 'landed' || phase === 'wipe'
  // Tier wordmark logo (public/jackpot/<tier>_reel.svg), native 170×121.
  const logoH = isMobile ? 64 : 56
  const logoW = (logoH * 170) / 121
  // Logos only belong on the actual reel — hidden on the intro/zoom screens.
  const showLogos = phase === 'spin' || phase === 'landed' || phase === 'wipe'

  return (
    <svg ref={wheelSvgRef} viewBox="0 0 400 400" className={cn('max-w-none', wheelSizeClass)}>
      <defs>
        <filter id="segGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.55" />
        </filter>
        <linearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="18%" stopColor="#67e8f9" stopOpacity="1" />
          <stop offset="38%" stopColor="#c084fc" stopOpacity="1" />
          <stop offset="58%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="78%" stopColor="#38bdf8" stopOpacity="1" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.35" />
        </linearGradient>

        <linearGradient id="rimGradientAlt" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#a5f3fc" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#f0abfc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>

        {/* Subtle glossy top crescent — light, so it never washes colours to pastel */}
        <radialGradient id="wheelSheen" cx="50%" cy="14%" r="52%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Lit-segment sheen — a clean bright bloom from the outer rim that
            fades inward, so the active slice reads as illuminated, not painted. */}
        <radialGradient id="litSheen" cx="50%" cy="6%" r="92%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="32%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Soft white glow for the lit slice's edge. */}
        <filter id="litGlow" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Deep hub → vivid neon rim gradient per tier shade. Stays fully
            saturated (no white blend) for the FanDuel neon slice look. */}
        {JACKPOT_TICKER_TIERS.map((tier) => {
          const p = SEGMENT_PALETTE[tier.id]
          return [0, 1].map((shade) => (
            <radialGradient
              key={`${tier.id}-${shade}`}
              id={`segGrad-${tier.id}-${shade}`}
              gradientUnits="userSpaceOnUse"
              cx="200"
              cy="200"
              r="178"
            >
              <stop offset="0%" stopColor={adjustHex(p.hub, shade === 0 ? 0 : -10)} />
              <stop offset="40%" stopColor={adjustHex(p.mid, shade === 0 ? 0 : -14)} />
              <stop offset="84%" stopColor={p.rim} />
              <stop offset="100%" stopColor={p.neon} />
            </radialGradient>
          ))
        })}
      </defs>

      <g filter={isMobile ? undefined : 'url(#wheelShadow)'}>
        <circle cx={cx} cy={cy} r={outerR + 12} fill="#0c0616" />

        {/* Animated outer rim */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR + 10}
          fill="none"
          stroke="url(#rimGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.95"
        />
        <circle
          cx={cx}
          cy={cy}
          r={outerR + 10}
          fill="none"
          stroke="url(#rimGradientAlt)"
          strokeWidth="1.5"
          strokeDasharray="10 18 6 22"
          strokeLinecap="round"
          opacity="0.75"
        />
        <circle
          cx={cx}
          cy={cy}
          r={outerR + 5}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />

        <g
          ref={wheelGroupRef}
          transform={`rotate(${rotation} ${cx} ${cy})`}
          style={{ willChange: 'transform' }}
        >
          {WHEEL_SEGMENTS.map((seg) => {
            const start = seg.index * SEGMENT_ANGLE - 90
            const end = start + SEGMENT_ANGLE
            const midAngle = start + SEGMENT_ANGLE / 2
            const label = segmentLabelPosition(cx, cy, labelInnerR, outerR, midAngle)
            const isUnderPointer =
              showHighlight && highlightedIndex != null && highlightedIndex === seg.index
            const isWinner = (phase === 'landed' || phase === 'wipe') && isUnderPointer
            const segmentPath = describeSegment(cx, cy, outerR, segInnerR, start, end)
            const fillId = `segGrad-${seg.tier.id}-${seg.shade % 2}`
            const neon = SEGMENT_PALETTE[seg.tier.id].neon

            return (
              <g key={seg.index} data-seg={seg.index} data-neon={neon}>
                {/* Vivid, fully-saturated base slice */}
                <path
                  d={segmentPath}
                  fill={`url(#${fillId})`}
                  stroke="rgba(6,2,12,0.7)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {showHighlight && (
                  <path
                    className="seg-mute"
                    d={segmentPath}
                    fill="#05010a"
                    fillOpacity="0.46"
                    stroke="none"
                    opacity={isUnderPointer ? 0 : 0.46}
                  />
                )}
                {/* Neon resting edge — stays neon; the bright white lit edge is
                    drawn in the overlay pass below so it sits ON TOP of neighbours. */}
                <path
                  d={segmentPath}
                  fill="none"
                  stroke={neon}
                  strokeOpacity="0.55"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                {/* Tier wordmark logo — oriented radially so the winning slice
                    reads upright at the top pointer when it lands. */}
                {showLogos && (
                  <image
                    className="seg-logo"
                    href={`/jackpot/${seg.tier.id}_reel.svg`}
                    x={label.x - logoW / 2}
                    y={label.y - logoH / 2}
                    width={logoW}
                    height={logoH}
                    transform={`rotate(${midAngle + 90} ${label.x} ${label.y})`}
                    opacity={isUnderPointer ? 1 : showHighlight ? 0.5 : 0.9}
                    style={{
                      pointerEvents: 'none',
                      filter: isUnderPointer
                        ? 'drop-shadow(0 0 6px rgba(255,255,255,0.55))'
                        : undefined,
                    }}
                  />
                )}
              </g>
            )
          })}

          {/* Overlay pass — lit sheen + bright white edge for the active slice,
              drawn after every base slice so the highlight is never clipped by
              the neighbouring segments. */}
          {showHighlight &&
            WHEEL_SEGMENTS.map((seg) => {
              const start = seg.index * SEGMENT_ANGLE - 90
              const end = start + SEGMENT_ANGLE
              const isUnderPointer =
                highlightedIndex != null && highlightedIndex === seg.index
              const isWinner = (phase === 'landed' || phase === 'wipe') && isUnderPointer
              const segmentPath = describeSegment(cx, cy, outerR, segInnerR, start, end)
              return (
                <g key={`top-${seg.index}`} data-seg-top={seg.index}>
                  <path
                    className="seg-sheen"
                    d={segmentPath}
                    fill="url(#litSheen)"
                    stroke="none"
                    opacity={isUnderPointer ? 1 : 0}
                  />
                  {isWinner && (
                    <path
                      className="seg-winner-fill jackpot-winner-fill"
                      d={segmentPath}
                      fill="#ffffff"
                      stroke="none"
                    />
                  )}
                  <path
                    className="seg-edge-top"
                    d={segmentPath}
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity={isUnderPointer ? 0.95 : 0}
                    strokeWidth={isWinner ? 4 : 3}
                    strokeLinejoin="round"
                    filter={isUnderPointer && !isMobile ? 'url(#litGlow)' : undefined}
                  />
                  {isWinner && (
                    <path
                      className="seg-winner-edge jackpot-winner-edge"
                      d={segmentPath}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                  )}
                </g>
              )
            })}
        </g>

        {/* Unified glossy sheen — fixed light from the top, doesn't rotate */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="url(#wheelSheen)"
          stroke="none"
          style={{ pointerEvents: 'none' }}
        />

      </g>
    </svg>
  )
}

export interface JackpotWheelBonusProps {
  onComplete: (tier: JackpotTickerTierId) => void
  /** Fired when the wipe begins — mount the win overlay underneath before the wheel peels away. */
  onWipeStart?: (tier: JackpotTickerTierId) => void
  winTier?: JackpotTickerTierId
  className?: string
}

export function JackpotWheelBonus({
  onComplete,
  onWipeStart,
  winTier: winTierProp,
  className,
}: JackpotWheelBonusProps) {
  const [phase, setPhase] = useState<WheelPhase>('intro')
  const [rotation, setRotation] = useState(0)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [pointerActive, setPointerActive] = useState(false)
  const completedRef = useRef(false)
  const spinRafRef = useRef<number | null>(null)
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastLitIndexRef = useRef<number | null>(null)
  const wheelGroupRef = useRef<SVGGElement>(null)
  const wheelSvgRef = useRef<SVGSVGElement>(null)
  const hubImageRef = useRef<HTMLImageElement>(null)
  const bgContainerRef = useRef<HTMLDivElement>(null)
  const closingInStartedRef = useRef(false)
  const isMobile = useIsMobile()
  const layout = isMobile ? MOBILE_WHEEL_LAYOUT : DESKTOP_WHEEL_LAYOUT
  const wheelScaleMV = useMotionValue<number>(layout.introScale)
  const wheelYMV = useMotionValue<string>(layout.introY)
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  const applyWheelRotation = useCallback((deg: number) => {
    wheelGroupRef.current?.setAttribute(
      'transform',
      `rotate(${deg} ${WHEEL_CX} ${WHEEL_CY})`
    )
  }, [])

  const winTier = useMemo(() => winTierProp ?? pickWinTier(), [winTierProp])

  const winningSegmentIndex = useMemo(() => {
    // Segments are interleaved by shade, so the shade-0 copy of a tier sits at
    // the tier's own index (its second copy is one full tier-set further round).
    const tierIndex = JACKPOT_TICKER_TIERS.findIndex((t) => t.id === winTier)
    if (tierIndex < 0) return 0
    return tierIndex
  }, [winTier])

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete(winTier)
  }, [onComplete, winTier])

  useEffect(() => {
    if (phase !== 'zoom') return
    const l = layoutRef.current
    animate(wheelScaleMV, l.zoomScale, { duration: 1, ease: [0.22, 1, 0.36, 1] })
    animate(wheelYMV, l.zoomY, { duration: 1, ease: [0.22, 1, 0.36, 1] })
  }, [phase, wheelScaleMV, wheelYMV])

  useEffect(() => {
    preloadWheelHighlightTicks()
    playSound('jackpot-intro', { volume: 0.85 })
    playJackpotBgMusic({ volume: 0.38 })

    const introTimer = setTimeout(() => {
      setPhase('zoom')
      setPointerActive(true)
      setHighlightedIndex(segmentAtPointer(0))
    }, 2400)
    const zoomTimer = setTimeout(() => setPhase('spin'), 3300)

    return () => {
      clearTimeout(introTimer)
      clearTimeout(zoomTimer)
      // Only cleared on full unmount — NOT on the spin→landed phase change,
      // otherwise the hand-off to the win screen would get cancelled.
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current)
      if (spinRafRef.current) cancelAnimationFrame(spinRafRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'spin') return

    closingInStartedRef.current = false

    // Gentle, steady duck so the ticks cut through — never raised again.
    setJackpotBgVolume(0.28)

    const targetRotation = rotationToLandOnSegment(winningSegmentIndex)
    const startRotation = rotation
    const totalTravel = targetRotation - startRotation
    const startTime = performance.now()
    lastLitIndexRef.current = segmentAtPointer(startRotation)
    applyWheelRotation(startRotation)
    applyWheelSegmentHighlight(
      wheelSvgRef.current,
      null,
      lastLitIndexRef.current,
      isMobile
    )
    applyHubTierLogo(hubImageRef.current, lastLitIndexRef.current)

    // Tick the instant a new segment lights up — computed from the same value
    // that drives the highlight, in the same frame, so sound + light are locked.
    const playLightTick = (segmentsRemaining: number, progress: number) => {
      if (segmentsRemaining > EXCITE_SEGMENTS) {
        playWheelHighlightTick(0, {
          volume: 0.08 + progress * 0.32,
          basePitch: 0.95,
          pitchStep: 0,
          maxPitch: 1,
        })
        return
      }
      const linear = (EXCITE_SEGMENTS - segmentsRemaining) / EXCITE_SEGMENTS
      const intensity = linear * linear
      playWheelHighlightTick(0, {
        volume: Math.min(1, 0.55 + intensity * 0.45),
        basePitch: 0.95 + intensity * 1.65,
        pitchStep: 0,
        maxPitch: 2.7,
      })
    }

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / SPIN_DURATION_MS)
      const current = startRotation + totalTravel * spinEase(t)

      // Slow camera push-in once we're into the decel tail.
      if (t >= CLOSE_IN_AT && !closingInStartedRef.current) {
        closingInStartedRef.current = true
        const l = layoutRef.current
        animate(wheelScaleMV, l.closeScale, {
          duration: 4.6,
          ease: [0.33, 0, 0.15, 1],
        })
        animate(wheelYMV, l.closeY, { duration: 4.6, ease: [0.33, 0, 0.15, 1] })
      }

      // Drive rotation via DOM ref — avoids 60fps React re-renders of the heavy
      // SVG which freezes real mobile devices.
      applyWheelRotation(current)

      const litIndex = segmentAtPointer(current)

      // Same gate as the visual light-up → the click fires exactly with it.
      if (litIndex !== lastLitIndexRef.current) {
        const prev = lastLitIndexRef.current
        lastLitIndexRef.current = litIndex
        applyWheelSegmentHighlight(wheelSvgRef.current, prev, litIndex, isMobile)
        applyHubTierLogo(hubImageRef.current, litIndex)
        const segmentsRemaining = Math.max(
          0,
          Math.round((targetRotation - current) / SEGMENT_ANGLE)
        )
        playLightTick(segmentsRemaining, t)
      }

      if (t < 1) {
        spinRafRef.current = requestAnimationFrame(tick)
        return
      }

      applyWheelRotation(targetRotation)
      setRotation(targetRotation)
      if (winningSegmentIndex !== lastLitIndexRef.current) {
        lastLitIndexRef.current = winningSegmentIndex
        playLightTick(0, 1)
      }
      setHighlightedIndex(winningSegmentIndex)
      setPhase('landed')
      playSound('final-selection-win', { volume: 0.95 })
      // Hold on the winner, then wipe away to reveal the jackpot win screen below.
      finishTimerRef.current = setTimeout(() => {
        setPhase('wipe')
        onWipeStart?.(winTier)
        finishTimerRef.current = setTimeout(finish, WIPE_DURATION_MS)
      }, LANDED_HOLD_MS)
    }

    spinRafRef.current = requestAnimationFrame(tick)
    return () => {
      if (spinRafRef.current) cancelAnimationFrame(spinRafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, winningSegmentIndex, applyWheelRotation])

  const zoomed = phase !== 'intro'
  const showPointer = phase === 'zoom' || phase === 'spin' || phase === 'landed' || phase === 'wipe'
  const hubRevealed = phase !== 'intro'
  // Hub (with the live tier reel logo) is shown on both desktop and mobile.
  const hubTier =
    highlightedIndex != null ? WHEEL_SEGMENTS[highlightedIndex]?.tier ?? null : null
  const hubAccent = hubTier?.accent ?? '#ffffff'
  const hubLanded = phase === 'landed' || phase === 'wipe'
  // FanDuel mobile: pin wheel centre to the bottom edge so only the top half is visible.
  const mobileHalfWheel = isMobile && zoomed

  return (
    <motion.div
      className={cn(
        'absolute inset-0 z-[100010] overflow-hidden',
        isMobile ? 'rounded-none' : 'rounded-2xl',
        className
      )}
      initial={false}
      animate={{
        clipPath:
          phase === 'wipe' ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)',
      }}
      transition={{
        duration: phase === 'wipe' ? WIPE_DURATION_MS / 1000 : 0,
        ease: [0.45, 0, 0.15, 1],
      }}
      style={{ willChange: phase === 'wipe' ? 'clip-path' : undefined }}
    >
      <FanDuelBackground phase={phase} isMobile={isMobile} containerRef={bgContainerRef} />

      <div
        className={cn(
          'absolute inset-0 z-10 overflow-hidden',
          !mobileHalfWheel && 'flex items-center justify-center'
        )}
      >
        <motion.div
          className={cn(
            'relative flex items-center justify-center',
            mobileHalfWheel && 'absolute bottom-0 left-1/2'
          )}
          style={{
            scale: wheelScaleMV,
            y: wheelYMV,
            x: mobileHalfWheel ? '-50%' : 0,
            transformOrigin: mobileHalfWheel ? '50% 50%' : undefined,
          }}
        >
          {showPointer && (
            <WheelPointer
              active={pointerActive}
              pointerClass={layout.pointerClass}
              showPinMount={!isMobile}
            />
          )}

          <WheelSvg
            rotation={rotation}
            highlightedIndex={highlightedIndex}
            phase={phase}
            wheelSizeClass={layout.wheelSizeClass}
            isMobile={isMobile}
            wheelGroupRef={wheelGroupRef}
            wheelSvgRef={wheelSvgRef}
          />

          {/* Real glass hub — a frosted disc that blurs the wheel segments behind it */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-[6] -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '31.5%',
              aspectRatio: '1 / 1',
              opacity: hubRevealed ? 1 : 0,
              transition: 'opacity 0.7s ease 0.2s',
            }}
          >
            {/* Frosted disc: mostly-dark glass with a hint of the slices blurred behind */}
            <div
              className="absolute inset-0 overflow-hidden rounded-full"
              style={{
                backdropFilter: 'blur(9px) saturate(1.15) brightness(0.8)',
                WebkitBackdropFilter: 'blur(9px) saturate(1.15) brightness(0.8)',
                background:
                  'linear-gradient(160deg, rgba(18,21,29,0.78) 0%, rgba(7,9,13,0.9) 100%)',
                boxShadow:
                  'inset 0 1px 1px rgba(255,255,255,0.32), inset 0 -12px 26px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.5)',
              }}
            >
              {/* Soft top reflection on the glass surface */}
              <div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)',
                }}
              />
            </div>
            {/* Winner ring flash once the wheel has landed */}
            {hubLanded && hubTier && (
              <div
                className="jackpot-hub-ring absolute inset-[2%] rounded-full"
                style={{ border: `2.5px solid ${hubAccent}` }}
              />
            )}
            {/* Live tier reel logo, crisp on top of the glass */}
            {hubTier && (
              <img
                ref={hubImageRef}
                src={`/jackpot/${hubTier.id}_reel.svg`}
                alt=""
                draggable={false}
                className="absolute left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
                style={{
                  // On mobile the hub centre sits on the bottom edge (half-wheel),
                  // so lift the logo into the visible top arc instead of the centre.
                  top: isMobile ? '34%' : '50%',
                  width: hubLanded ? '64%' : '57%',
                  opacity: hubLanded ? 1 : 0.9,
                  transition: 'width 0.3s ease, opacity 0.3s ease',
                  filter: hubLanded
                    ? `drop-shadow(0 0 12px ${hubAccent}cc) brightness(1.12)`
                    : 'brightness(1.06)',
                }}
              />
            )}
          </div>

          {(phase === 'intro' || phase === 'zoom') && <IntroTitleOverlay phase={phase} />}

          {phase === 'intro' && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[29%] w-[29%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
              style={{
                background:
                  'radial-gradient(circle, rgba(103,232,249,0.12) 0%, rgba(88,28,135,0.08) 55%, transparent 75%)',
              }}
            />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {(phase === 'landed' || phase === 'wipe') && highlightedIndex != null && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 26,
              delay: 0.12,
            }}
            className="pointer-events-none absolute inset-x-0 bottom-[10%] z-20 flex justify-center px-4"
          >
            <div
              className="rounded-2xl border px-7 py-4 text-center backdrop-blur-xl"
              style={{
                borderColor: `${WHEEL_SEGMENTS[highlightedIndex].tier.accent}aa`,
                backgroundColor: 'rgba(8,4,16,0.94)',
                boxShadow: `0 0 48px ${WHEEL_SEGMENTS[highlightedIndex].tier.accent}66, 0 12px 40px rgba(0,0,0,0.55)`,
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85">
                You won
              </p>
              <p
                className="text-2xl font-bold tracking-wide"
                style={{
                  color: WHEEL_SEGMENTS[highlightedIndex].tier.accent,
                  textShadow: `0 0 28px ${WHEEL_SEGMENTS[highlightedIndex].tier.accent}88`,
                }}
              >
                {WHEEL_SEGMENTS[highlightedIndex].tier.label} Jackpot
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wipe leading edge — soft light sweep, not a colour flash */}
      {phase === 'wipe' && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 z-[100030] w-[3px]"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)',
            boxShadow:
              '0 0 28px 10px rgba(167,139,250,0.35), 0 0 56px 18px rgba(255,255,255,0.08)',
          }}
          initial={{ left: '0%' }}
          animate={{ left: '100%' }}
          transition={{
            duration: WIPE_DURATION_MS / 1000,
            ease: [0.45, 0, 0.15, 1],
          }}
        />
      )}
    </motion.div>
  )
}
