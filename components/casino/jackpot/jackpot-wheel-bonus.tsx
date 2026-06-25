'use client'

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { fireConfetti } from '@/lib/confetti'
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion'
import {
  JACKPOT_FINAL_SEGMENT_MAX_MS,
  JACKPOT_TICKER_TIERS,
  JACKPOT_TRANSITION_FADE_MS,
  JACKPOT_TRANSITION_MAX_MS,
  JACKPOT_POST_FLASH_BEAT_MS,
  JACKPOT_WINNER_FLASH_MS,
  JACKPOT_WINNER_PULSE_COUNT,
  JACKPOT_WINNER_PULSE_MS,
  type JackpotTickerTierConfig,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  afterSound,
  ensureJackpotWheelSpinMusic,
  ensureWheelTickBuffersReady,
  fadeOutSound,
  playSpinNowSound,
  playSound,
  preloadJackpotWheelAudio,
  preloadJackpotWinHandoffAudio,
  playWheelHighlightTick,
  preloadWheelHighlightTicks,
  resumeWheelTickAudio,
  startJackpotIntroAudio,
  stopSound,
  stopWheelHighlightTicks,
  swapJackpotBedForWheelSpin,
  unlockAudioPlayback,
} from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SEGMENTS_PER_TIER = 2
const SEGMENT_COUNT = JACKPOT_TICKER_TIERS.length * SEGMENTS_PER_TIER
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT
// Continuous spin — visible slow crawl at the end (high decel power freezes visually).
const SPIN_DURATION_MS = 44000
const EXTRA_SPINS = 6
/** Last N segment crossings: louder + higher pitch each step — the anticipation run. */
const EXCITE_SEGMENTS = 10
/** Land mid-slice so the wheel comes to rest dead-centre under the pointer. */
const LAND_SEGMENT_FRACTION = 0.5
/** Begin the final centre nudge once the winning slice is close enough. */
const LAND_SNAP_TOLERANCE_DEG = SEGMENT_ANGLE * 0.32
/** Spring settle into dead centre — smooth ease, no overshoot (avoids segment flicker). */
const LAND_SETTLE_MS = 520
/** Camera push-in as the wheel enters the slow tail. */
const CLOSE_IN_AT = 0.4
/** final-segment → transition → overlay → wipe */
const WIPE_DURATION_MS = 920
const JACKPOT_BG_VOLUME = 0.30
const JACKPOT_WHEEL_SPIN_VOLUME = 0.38
/** Desktop zoom pushes into the top arc; mobile uses much lower scale so the
    wheel stays inside the viewport instead of clipping off-screen. */
const DESKTOP_WHEEL_LAYOUT = {
  introScale: 0.82,
  zoomScale: 2.65,
  closeScale: 2.88,
  introY: '0%',
  zoomY: '40%',
  closeY: '46%',
  wheelSizeClass: 'h-[min(92vw,420px)] w-[min(92vw,420px)]',
  pointerClass: 'h-[72px] w-[80px]',
} as const

const MOBILE_WHEEL_LAYOUT = {
  introScale: 0.72,
  // Intro: full wheel centred. After Spin: centre pinned to bottom edge (top arc only).
  zoomScale: 2.85,
  closeScale: 2.92,
  introY: '0%',
  zoomY: '50%',
  closeY: '50%',
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
        edge.setAttribute('stroke-opacity', lit ? '0.58' : '0')
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
  // Land in the middle of the slice so the wheel rests dead-centre under the pointer.
  const offsetFromTop =
    segmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE * LAND_SEGMENT_FRACTION
  return EXTRA_SPINS * 360 + normalizeAngle(360 - offsetFromTop)
}

/** Which segment sits under the fixed top pointer at this wheel rotation. */
function segmentAtPointer(rotationDeg: number): number {
  const offsetFromTop = normalizeAngle(-rotationDeg)
  return Math.floor(offsetFromTop / SEGMENT_ANGLE) % SEGMENT_COUNT
}

/**
 * Single continuous ease — velocity never resets mid-spin.
 *
 *  • Quarter-sine launch (~20% time) — soft takeoff, C¹-continuous into decel.
 *  • One long decel (~80% time) with power n ≈ 2.75:
 *      keeps meaningful velocity through the last ~10 segment crossings.
 */
const SPIN_ACCEL_FRAC = 0.20
const SPIN_DECEL_POW = 2.75
const SPIN_TWO_OVER_PI = 2 / Math.PI
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
    return (
      SPIN_PEAK_V *
      SPIN_ACCEL_FRAC *
      SPIN_TWO_OVER_PI *
      (1 - Math.cos((Math.PI / 2) * (t / SPIN_ACCEL_FRAC)))
    )
  }
  const p = (t - SPIN_ACCEL_FRAC) / SPIN_DECEL_SPAN
  return SPIN_ACCEL_DIST + SPIN_DECEL_DIST * (1 - Math.pow(1 - p, SPIN_DECEL_POW))
}

/** Smooth decel into centre — no overshoot (overshoot caused segment/tick flicker). */
function easeOutCubic(t: number): number {
  if (t >= 1) return 1
  if (t <= 0) return 0
  return 1 - Math.pow(1 - t, 3)
}

/** Segments left before the wheel reaches target — stable, no early rounding. */
function segmentsUntilStop(currentRotation: number, targetRotation: number): number {
  const remainingDeg = Math.max(0, targetRotation - currentRotation)
  if (remainingDeg <= 0.5) return 0
  return Math.ceil(remainingDeg / SEGMENT_ANGLE - 1e-4)
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
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  if (innerR <= 0) {
    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${cx} ${cy}`,
      'Z',
    ].join(' ')
  }
  const startInner = polarToCartesian(cx, cy, innerR, endAngle)
  const endInner = polarToCartesian(cx, cy, innerR, startAngle)
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
}: {
  phase: WheelPhase
  isMobile: boolean
}) {
  const spotlightY = isMobile && phase !== 'intro' ? '72%' : '46%'

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 95% at 50% 40%, #18102a 0%, #0e0818 50%, #06040c 100%)',
        }}
      />

      {/* Soft static spotlight — hidden on intro so the wheel + logo stay clean */}
      {phase !== 'intro' && (
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
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" />
    </div>
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
    <div
      className={cn(
        'pointer-events-none absolute left-1/2 top-0 z-40 -translate-x-1/2',
        showPinMount ? '-translate-y-2' : '-translate-y-5'
      )}
    >
      <motion.div
        className={cn(
          'absolute left-1/2 h-14 w-24 -translate-x-1/2 rounded-full blur-2xl',
          showPinMount ? 'top-[52px]' : 'top-[38px]'
        )}
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
        viewBox={showPinMount ? '0 0 80 72' : '0 13 80 59'}
        className={cn('relative block drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]', pointerClass)}
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

function IntroConfetti({ active }: { active: boolean }) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!active || firedRef.current) return
    firedRef.current = true

    const colors = ['#FFD700', '#FFDF00', '#F5E6A3', '#D4AF37', '#FFF8DC', '#ffffff', '#FFA500', '#E8C547']
    const defaults = {
      ticks: 220,
      gravity: 0.72,
      scalar: 1.35,
      colors,
    }

    // Full-width ceiling burst across the entire viewport.
    ;[0.06, 0.2, 0.35, 0.5, 0.65, 0.8, 0.94].forEach((x) => {
      fireConfetti({
        ...defaults,
        particleCount: 52,
        spread: 115,
        startVelocity: 50,
        origin: { x, y: 0.22 },
      })
    })

    // Big centre bloom behind the wheel.
    fireConfetti({
      ...defaults,
      particleCount: 150,
      spread: 360,
      startVelocity: 54,
      scalar: 1.5,
      origin: { x: 0.5, y: 0.4 },
    })

    const sideTimer = setTimeout(() => {
      fireConfetti({
        ...defaults,
        particleCount: 95,
        angle: 62,
        spread: 90,
        startVelocity: 60,
        scalar: 1.4,
        origin: { x: 0, y: 0.58 },
      })
      fireConfetti({
        ...defaults,
        particleCount: 95,
        angle: 118,
        spread: 90,
        startVelocity: 60,
        scalar: 1.4,
        origin: { x: 1, y: 0.58 },
      })
    }, 160)

    // Sustained full-screen gold rain.
    let rainCount = 0
    const rainInterval = setInterval(() => {
      fireConfetti({
        ...defaults,
        particleCount: 48,
        spread: 160,
        startVelocity: 36,
        scalar: 1.25,
        origin: { x: Math.random(), y: 0.02 },
      })
      rainCount += 1
      if (rainCount >= 12) clearInterval(rainInterval)
    }, 380)

    return () => {
      clearTimeout(sideTimer)
      clearInterval(rainInterval)
    }
  }, [active])

  return null
}

function WheelSvg({
  highlightedIndex,
  phase,
  wheelSizeClass,
  isMobile = false,
  wheelGroupRef,
  wheelSvgRef,
}: {
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
  // Full pie slices to the centre — no donut hole or hub competing with segments.
  const segInnerR = 0
  const labelInnerR = 78
  const showHighlight = phase === 'spin' || phase === 'landed' || phase === 'wipe'
  // Only during spin — landed/wipe use React state so the winner slice stays lit.
  const domDrivenHighlight = phase === 'spin'
  // Tier wordmark logo (public/jackpot/<tier>_reel.svg), native 170×121.
  const logoH = isMobile ? 64 : 56
  const logoW = (logoH * 170) / 121
  // Hidden on the intro/front screen; they fade in as the wheel zooms big.
  const showLogos = phase === 'zoom' || phase === 'spin' || phase === 'landed' || phase === 'wipe'
  const logosEntering = phase === 'zoom'

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
        <linearGradient
          id="rimGradient"
          gradientUnits="userSpaceOnUse"
          x1="200"
          y1="22"
          x2="200"
          y2="378"
        >
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="18%" stopColor="#67e8f9" stopOpacity="1" />
          <stop offset="38%" stopColor="#c084fc" stopOpacity="1" />
          <stop offset="58%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="78%" stopColor="#38bdf8" stopOpacity="1" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.35" />
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="0 200 200"
            to="360 200 200"
            dur="10s"
            repeatCount="indefinite"
          />
        </linearGradient>

        <linearGradient
          id="rimGradientAlt"
          gradientUnits="userSpaceOnUse"
          x1="378"
          y1="200"
          x2="22"
          y2="200"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#a5f3fc" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#f0abfc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="360 200 200"
            to="0 200 200"
            dur="14s"
            repeatCount="indefinite"
          />
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
          <feGaussianBlur stdDeviation="5.5" result="b" />
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

        {/* Animated outer rim — gradients rotate around the wheel */}
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
          className="jackpot-rim-dash"
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

        <g ref={wheelGroupRef} style={{ willChange: 'transform' }}>
          {WHEEL_SEGMENTS.map((seg) => {
            const start = seg.index * SEGMENT_ANGLE - 90
            const end = start + SEGMENT_ANGLE
            const midAngle = start + SEGMENT_ANGLE / 2
            const label = segmentLabelPosition(cx, cy, labelInnerR, outerR, midAngle)
            const isWinner =
              (phase === 'landed' || phase === 'wipe') &&
              highlightedIndex != null &&
              highlightedIndex === seg.index
            const isWinnerFlash = phase === 'landed' && isWinner
            const isUnderPointer =
              !domDrivenHighlight &&
              showHighlight &&
              highlightedIndex != null &&
              highlightedIndex === seg.index &&
              !isWinnerFlash
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
                    opacity={domDrivenHighlight ? 0.46 : isUnderPointer ? 0 : 0.46}
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
                    opacity={
                      domDrivenHighlight ? 0.5 : isUnderPointer ? 1 : showHighlight ? 0.5 : 0.9
                    }
                    style={{
                      pointerEvents: 'none',
                      animation: logosEntering
                        ? 'seg-logo-in 0.6s ease-out both'
                        : undefined,
                      filter:
                        !domDrivenHighlight && isUnderPointer
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
              const isWinner =
                (phase === 'landed' || phase === 'wipe') &&
                highlightedIndex != null &&
                highlightedIndex === seg.index
              const isWinnerFlash = phase === 'landed' && isWinner
              const isUnderPointer =
                !domDrivenHighlight &&
                highlightedIndex != null &&
                highlightedIndex === seg.index &&
                !isWinnerFlash
              const segmentPath = describeSegment(cx, cy, outerR, segInnerR, start, end)
              return (
                <g key={`top-${seg.index}`} data-seg-top={seg.index}>
                  <path
                    className={cn('seg-sheen', isWinnerFlash && 'jackpot-winner-sheen-burst')}
                    d={segmentPath}
                    fill="url(#litSheen)"
                    stroke="none"
                    opacity={domDrivenHighlight ? 0 : isWinnerFlash ? undefined : isUnderPointer ? 1 : 0}
                  />
                  {isWinner && (
                    <path
                      className={cn(
                        'seg-winner-fill',
                        phase === 'landed'
                          ? 'jackpot-winner-flash-burst'
                          : 'jackpot-winner-fill'
                      )}
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
                    strokeOpacity={
                      domDrivenHighlight || isWinnerFlash ? 0 : isUnderPointer ? 0.58 : 0
                    }
                    strokeWidth={isWinner ? 3 : 2.5}
                    strokeLinejoin="round"
                    filter={
                      !domDrivenHighlight && isUnderPointer && !isMobile
                        ? 'url(#litGlow)'
                        : undefined
                    }
                  />
                  {isWinner && (
                    <path
                      className={cn(
                        'seg-winner-edge',
                        phase === 'landed'
                          ? 'jackpot-winner-edge-burst'
                          : 'jackpot-winner-edge'
                      )}
                      d={segmentPath}
                      fill="none"
                      stroke="#ffffff"
                      strokeOpacity={0.55}
                      strokeWidth="3"
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

const MemoWheelSvg = memo(WheelSvg, (prev, next) => {
  if (prev.phase === 'spin' && next.phase === 'spin') {
    return (
      prev.isMobile === next.isMobile && prev.wheelSizeClass === next.wheelSizeClass
    )
  }
  return (
    prev.highlightedIndex === next.highlightedIndex &&
    prev.phase === next.phase &&
    prev.isMobile === next.isMobile &&
    prev.wheelSizeClass === next.wheelSizeClass
  )
})

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
  const startedRef = useRef(false)
  const spinStartedRef = useRef(false)
  const spinRafRef = useRef<number | null>(null)
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const zoomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handoffCancelRef = useRef<(() => void) | null>(null)
  const lastLitIndexRef = useRef<number | null>(null)
  const lastFrameRotationRef = useRef(0)
  const rotationDegRef = useRef(0)
  const wheelGroupRef = useRef<SVGGElement>(null)
  const wheelSvgRef = useRef<SVGSVGElement>(null)
  const closingInStartedRef = useRef(false)
  const isMobile = useIsMobile()
  const layout = isMobile ? MOBILE_WHEEL_LAYOUT : DESKTOP_WHEEL_LAYOUT
  const wheelScaleMV = useMotionValue<number>(layout.introScale)
  const wheelYMV = useMotionValue<string>(layout.introY)
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  const applyWheelRotation = useCallback((deg: number) => {
    rotationDegRef.current = deg
    wheelGroupRef.current?.setAttribute(
      'transform',
      `rotate(${deg} ${WHEEL_CX} ${WHEEL_CY})`
    )
  }, [])

  // React re-renders can wipe SVG transform attrs — re-apply after each commit.
  useLayoutEffect(() => {
    if (phase === 'spin' || phase === 'landed' || phase === 'wipe') {
      applyWheelRotation(rotationDegRef.current)
    }
  })

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

  // Preload only on mount; start music when this screen appears.
  useLayoutEffect(() => {
    preloadWheelHighlightTicks()
    void ensureWheelTickBuffersReady()
    preloadJackpotWinHandoffAudio()
    preloadJackpotWheelAudio(JACKPOT_BG_VOLUME)
    startJackpotIntroAudio(JACKPOT_BG_VOLUME)
    stopWheelHighlightTicks()
    applyWheelRotation(0)
  }, [applyWheelRotation])

  useEffect(() => {
    return () => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current)
      if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current)
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current)
      handoffCancelRef.current?.()
      handoffCancelRef.current = null
      if (spinRafRef.current) cancelAnimationFrame(spinRafRef.current)
      stopSound('jackpot-bg')
      stopSound('jackpot-wheel-spin')
      stopSound('jackpot-transition')
      stopWheelHighlightTicks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Spin CTA on all devices: tap unlocks audio, then zoom → spin.
  const handleStartSpin = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true
    playSpinNowSound(0.85)
    unlockAudioPlayback()
    resumeWheelTickAudio()
    void ensureWheelTickBuffersReady()
    stopWheelHighlightTicks()
    stopSound('jackpot-transition')
    swapJackpotBedForWheelSpin(JACKPOT_WHEEL_SPIN_VOLUME, 500)
    setPhase('zoom')
    setPointerActive(true)
    setHighlightedIndex(segmentAtPointer(0))
    zoomTimerRef.current = setTimeout(() => setPhase('spin'), 1500)
  }, [])

  useEffect(() => {
    if (phase !== 'spin') return
    // Guard against ever starting a second spin loop (which would double up the
    // highlight ticks / desync the sound). The wheel only spins once.
    if (spinStartedRef.current) return
    spinStartedRef.current = true

    closingInStartedRef.current = false

    // Wheel bed loops from Spin tap through land — intro bg already swapped out.
    ensureJackpotWheelSpinMusic(JACKPOT_WHEEL_SPIN_VOLUME)
    resumeWheelTickAudio()
    stopWheelHighlightTicks()

    const targetRotation = rotationToLandOnSegment(winningSegmentIndex)
    const startRotation = rotation
    const totalTravel = targetRotation - startRotation
    const totalCrossings = Math.max(1, Math.ceil(totalTravel / SEGMENT_ANGLE))
    const startTime = performance.now()

    lastLitIndexRef.current = segmentAtPointer(startRotation)
    lastFrameRotationRef.current = startRotation
    rotationDegRef.current = startRotation
    applyWheelRotation(startRotation)
    applyWheelSegmentHighlight(
      wheelSvgRef.current,
      null,
      lastLitIndexRef.current,
      isMobile
    )

    let exciteStep = 0

    /** Tick in the same RAF frame as the segment light-up — sound + highlight stay locked. */
    const playLightTick = (segmentsRemaining: number) => {
      const progress = 1 - segmentsRemaining / totalCrossings

      if (segmentsRemaining > EXCITE_SEGMENTS) {
        exciteStep = 0
        playWheelHighlightTick(0, {
          variant: 'spin',
          volume: 0.14 + progress * 0.36,
          playbackRate: 0.72 + progress * 0.22,
        })
        return
      }

      const step = exciteStep
      exciteStep = Math.min(exciteStep + 1, EXCITE_SEGMENTS)
      const rise = step / Math.max(1, EXCITE_SEGMENTS - 1)

      playWheelHighlightTick(step, {
        variant: 'anticipation',
        volume: 0.58 + rise * 0.42,
        playbackRate: 0.92 + rise * 1.12,
      })
    }

    let spinComplete = false
    let settling = false
    let settleFromRotation = 0
    let settleStartTime = 0

    const finishWinHandoff = () => {
      if (spinComplete) return
      spinComplete = true
      if (spinRafRef.current) {
        cancelAnimationFrame(spinRafRef.current)
        spinRafRef.current = null
      }

      applyWheelRotation(targetRotation)
      setRotation(targetRotation)
      if (winningSegmentIndex !== lastLitIndexRef.current) {
        lastLitIndexRef.current = winningSegmentIndex
        applyWheelSegmentHighlight(
          wheelSvgRef.current,
          null,
          winningSegmentIndex,
          isMobile
        )
      }

      flushSync(() => {
        setHighlightedIndex(winningSegmentIndex)
        setPhase('landed')
      })

      fadeOutSound('jackpot-wheel-spin', 500)
      stopWheelHighlightTicks()

      handoffCancelRef.current?.()
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current)

      const winnerPulseTimers: ReturnType<typeof setTimeout>[] = []
      for (let i = 0; i < JACKPOT_WINNER_PULSE_COUNT; i++) {
        winnerPulseTimers.push(
          setTimeout(() => {
            playSound('jackpot-final-segment', { volume: 0.88 })
            playSound('final-selection-win', { volume: 0.9 })
          }, i * JACKPOT_WINNER_PULSE_MS)
        )
      }

      handoffCancelRef.current = () => {
        for (const t of winnerPulseTimers) clearTimeout(t)
        if (finishTimerRef.current) clearTimeout(finishTimerRef.current)
      }

      // Winner segment pulses 3×, then riser + overlay mount, then wipe.
      finishTimerRef.current = setTimeout(() => {
        onWipeStart?.(winTier)

        let cancelTransition: (() => void) | null = null
        let riserFadeTimer: ReturnType<typeof setTimeout> | null = null
        const prevCancel = handoffCancelRef.current
        handoffCancelRef.current = () => {
          prevCancel?.()
          cancelTransition?.()
          if (riserFadeTimer) clearTimeout(riserFadeTimer)
        }

        const transitionAudio = playSound('jackpot-transition', { volume: 0.48 })
        const riserFadeAt = Math.max(
          0,
          JACKPOT_TRANSITION_MAX_MS - JACKPOT_TRANSITION_FADE_MS
        )
        riserFadeTimer = setTimeout(
          () => fadeOutSound('jackpot-transition', JACKPOT_TRANSITION_FADE_MS),
          riserFadeAt
        )
        cancelTransition = afterSound(
          transitionAudio,
          JACKPOT_TRANSITION_MAX_MS,
          () => {
            stopSound('jackpot-transition')
          }
        )

        finishTimerRef.current = setTimeout(() => {
          setPhase('wipe')
          finishTimerRef.current = setTimeout(finish, WIPE_DURATION_MS)
        }, JACKPOT_POST_FLASH_BEAT_MS)
      }, JACKPOT_WINNER_FLASH_MS)
    }

    const beginLandSettle = (fromRotation: number) => {
      if (spinComplete || settling) return
      settling = true
      settleFromRotation = fromRotation
      settleStartTime = performance.now()
    }

    const tick = (now: number) => {
      if (settling) {
        const settleT = Math.min(1, (now - settleStartTime) / LAND_SETTLE_MS)
        const settled =
          settleFromRotation +
          (targetRotation - settleFromRotation) * easeOutCubic(settleT)
        applyWheelRotation(settled)

        if (settleT < 1) {
          spinRafRef.current = requestAnimationFrame(tick)
          return
        }

        finishWinHandoff()
        return
      }

      const elapsed = now - startTime
      const t = Math.min(1, elapsed / SPIN_DURATION_MS)
      const current = startRotation + totalTravel * spinEase(t)

      // Slow camera push-in once we're into the decel tail.
      if (t >= CLOSE_IN_AT && !closingInStartedRef.current) {
        closingInStartedRef.current = true
        const l = layoutRef.current
        animate(wheelScaleMV, l.closeScale, {
          duration: 12,
          ease: [0.33, 0, 0.15, 1],
        })
        animate(wheelYMV, l.closeY, { duration: 12, ease: [0.33, 0, 0.15, 1] })
      }

      applyWheelRotation(current)

      const prevRot = lastFrameRotationRef.current
      const prevIndex = segmentAtPointer(prevRot)
      const litIndex = segmentAtPointer(current)

      if (litIndex !== prevIndex) {
        const prev = lastLitIndexRef.current
        lastLitIndexRef.current = litIndex
        // Audio first — Web Audio starts in the same turn; highlight paints on the next composite.
        playLightTick(segmentsUntilStop(current, targetRotation))
        applyWheelSegmentHighlight(wheelSvgRef.current, prev, litIndex, isMobile)
      }

      lastFrameRotationRef.current = current

      const remainingDeg = Math.max(0, targetRotation - current)
      const onWinner = litIndex === winningSegmentIndex
      const centredEnough = remainingDeg <= LAND_SNAP_TOLERANCE_DEG

      if (onWinner && centredEnough) {
        beginLandSettle(current)
        spinRafRef.current = requestAnimationFrame(tick)
        return
      }

      if (t < 1) {
        spinRafRef.current = requestAnimationFrame(tick)
        return
      }

      beginLandSettle(current)
      spinRafRef.current = requestAnimationFrame(tick)
    }

    spinRafRef.current = requestAnimationFrame(tick)

    return () => {
      if (spinRafRef.current) cancelAnimationFrame(spinRafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, winningSegmentIndex, applyWheelRotation])

  const zoomed = phase !== 'intro'
  const showPointer = phase === 'zoom' || phase === 'spin' || phase === 'landed' || phase === 'wipe'
  // Mobile half-wheel: bottom-pinned centre only after Spin — intro stays centred.
  const mobileBottomWheel = isMobile && zoomed

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
      <FanDuelBackground phase={phase} isMobile={isMobile} />
      <IntroConfetti active={phase === 'intro'} />

      {/* Gold flash — 3 pulses on the winner before handoff */}
      <AnimatePresence>
        {phase === 'landed' && (
          <motion.div
            initial={{ opacity: 0.95 }}
            animate={{ opacity: [0.95, 0.4, 0.95, 0.4, 0.95, 0.4, 0.25] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: JACKPOT_WINNER_FLASH_MS / 1000,
              times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 1],
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute inset-0 z-[15]"
            style={{
              background:
                'radial-gradient(circle at 50% 38%, rgba(255,215,0,0.48) 0%, rgba(212,175,55,0.16) 42%, transparent 68%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Jackpot logo on the intro/front screen — centred over the wheel, fades
          out cleanly the moment the player taps Spin to Win. */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src="/jackpot/jackpot_wheel_logo.svg"
              alt="Jackpot Wheel"
              className="w-[clamp(9rem,34vw,13rem)] max-w-none select-none"
              draggable={false}
              initial={{ scale: 0.92 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.35 },
              }}
              style={{ marginTop: isMobile ? '-4%' : 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          'absolute inset-0 z-10 overflow-hidden',
          !mobileBottomWheel && 'flex items-center justify-center'
        )}
      >
        <motion.div
          className={cn(
            'relative flex items-center justify-center',
            mobileBottomWheel && 'absolute bottom-0 left-1/2'
          )}
          style={{
            scale: wheelScaleMV,
            y: wheelYMV,
            x: mobileBottomWheel ? '-50%' : 0,
            transformOrigin: mobileBottomWheel ? '50% 50%' : undefined,
          }}
        >
          {showPointer && (
            <WheelPointer
              active={pointerActive}
              pointerClass={layout.pointerClass}
              showPinMount={!isMobile}
            />
          )}

          {phase === 'intro' ? (
            <motion.div
              role="button"
              tabIndex={0}
              aria-label="Spin to Win"
              onClick={handleStartSpin}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleStartSpin()
                }
              }}
              className="relative cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              animate={{ scale: [1, 1.035, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <MemoWheelSvg
                highlightedIndex={highlightedIndex}
                phase={phase}
                wheelSizeClass={layout.wheelSizeClass}
                isMobile={isMobile}
                wheelGroupRef={wheelGroupRef}
                wheelSvgRef={wheelSvgRef}
              />
            </motion.div>
          ) : (
            <div className="relative">
              <MemoWheelSvg
                highlightedIndex={highlightedIndex}
                phase={phase}
                wheelSizeClass={layout.wheelSizeClass}
                isMobile={isMobile}
                wheelGroupRef={wheelGroupRef}
                wheelSvgRef={wheelSvgRef}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Spin CTA — all devices; tap unlocks audio and starts the wheel */}
      {phase === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-[7%] z-[30] flex justify-center px-6"
        >
          <Button
            onClick={handleStartSpin}
            className="pointer-events-auto h-12 w-full max-w-xs rounded-small text-base font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
          >
            Spin to Win
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {phase === 'wipe' && highlightedIndex != null && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 28,
            }}
            className="pointer-events-none absolute inset-x-0 bottom-[10%] z-20 flex justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="rounded-2xl border px-8 py-5 text-center backdrop-blur-xl jackpot-landed-card"
              style={{
                borderColor: `${WHEEL_SEGMENTS[highlightedIndex].tier.accent}cc`,
                backgroundColor: 'rgba(8,4,16,0.96)',
                boxShadow: `0 0 64px ${WHEEL_SEGMENTS[highlightedIndex].tier.accent}88, 0 16px 48px rgba(0,0,0,0.6)`,
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-amber-200/95">
                Winner
              </p>
              <p
                className="mt-1 text-3xl font-bold tracking-wide sm:text-4xl"
                style={{
                  color: WHEEL_SEGMENTS[highlightedIndex].tier.accent,
                  textShadow: `0 0 36px ${WHEEL_SEGMENTS[highlightedIndex].tier.accent}aa`,
                }}
              >
                {WHEEL_SEGMENTS[highlightedIndex].tier.label} Jackpot
              </p>
            </motion.div>
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
