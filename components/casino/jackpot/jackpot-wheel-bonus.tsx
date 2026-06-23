'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  JACKPOT_TICKER_TIERS,
  type JackpotTickerTierConfig,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'
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

type WheelPhase = 'intro' | 'zoom' | 'spin' | 'landed'

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

function FanDuelBackground({ phase }: { phase: WheelPhase }) {
  const spinning = phase === 'spin' || phase === 'landed'

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#12081f]" />

      {/* Soft colour orbs */}
      <div
        className="absolute left-1/2 top-[42%] h-[70%] w-[90%] -translate-x-1/2 rounded-full opacity-80 blur-[80px]"
        style={{
          background:
            'radial-gradient(circle, rgba(56,189,248,0.45) 0%, rgba(109,40,217,0.35) 42%, transparent 72%)',
        }}
      />
      <div
        className="absolute -left-[10%] top-[10%] h-[55%] w-[55%] rounded-full opacity-60 blur-[70px]"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.35), transparent 70%)' }}
      />
      <div
        className="absolute -right-[8%] top-[18%] h-[50%] w-[50%] rounded-full opacity-55 blur-[70px]"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)' }}
      />

      {/* Rotating sunburst */}
      <motion.div
        className="absolute left-1/2 top-[46%] h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: spinning ? 360 : 0 }}
        transition={
          spinning
            ? { duration: 22, repeat: Infinity, ease: 'linear' }
            : { duration: 0.4 }
        }
        style={{
          background: `repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(255,255,255,0.09) 0deg 6deg,
            transparent 6deg 18deg
          )`,
          maskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 38%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 50%, black 0%, black 38%, transparent 72%)',
        }}
      />

      {/* Light rays */}
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-[46%] h-[85%] w-[3px] origin-top -translate-x-1/2 opacity-[0.14]"
          style={{
            transform: `translateX(-50%) rotate(${i * 22.5}deg)`,
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(167,139,250,0.15) 45%, transparent)',
          }}
        />
      ))}

      {/* Centre bloom behind wheel */}
      <div
        className="absolute left-1/2 top-[46%] h-[55%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[40px]"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.28) 0%, rgba(168,85,247,0.18) 35%, transparent 68%)',
        }}
      />

      {/* Sparkles */}
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${8 + ((i * 17) % 84)}%`,
            top: `${6 + ((i * 23) % 78)}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            filter: 'blur(0.5px)',
            opacity: 0.15 + (i % 5) * 0.08,
          }}
          animate={{ opacity: [0.12, 0.45, 0.12], scale: [1, 1.35, 1] }}
          transition={{
            duration: 2.2 + (i % 4) * 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0618]/20 via-transparent to-[#0a0512]/80" />
    </div>
  )
}

function WheelPointer({ active }: { active: boolean }) {
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
        className="relative h-[72px] w-[80px] drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
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
        {/* Pin housing at top */}
        <rect x="30" y="4" width="20" height="10" rx="3" fill="#1c1c1f" stroke="#000000" strokeWidth="1" />
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
      <div className="flex flex-col items-center text-center">
        <p
          className="text-[clamp(1.6rem,6.5vw,2.75rem)] font-black uppercase leading-none tracking-[0.05em]"
          style={{
            color: '#7dd3fc',
            WebkitTextStroke: '2px rgba(15,23,42,0.9)',
            paintOrder: 'stroke fill',
            filter: 'drop-shadow(0 0 18px rgba(56,189,248,0.55))',
          }}
        >
          Jackpot
        </p>
        <p
          className="mt-1 text-[clamp(1.75rem,7vw,3rem)] font-black uppercase leading-none tracking-[0.07em]"
          style={{
            color: '#e9d5ff',
            WebkitTextStroke: '2px rgba(15,23,42,0.9)',
            paintOrder: 'stroke fill',
            filter: 'drop-shadow(0 0 22px rgba(168,85,247,0.45))',
          }}
        >
          Wheel
        </p>
      </div>
    </motion.div>
  )
}

function WheelSvg({
  rotation,
  highlightedIndex,
  phase,
  hubRevealed,
}: {
  rotation: number
  highlightedIndex: number | null
  phase: WheelPhase
  hubRevealed: boolean
}) {
  const cx = 200
  const cy = 200
  const outerR = 178
  const innerR = 58
  const showHighlight = phase === 'spin' || phase === 'landed'
  // Tier wordmark logo (public/jackpot/<tier>_reel.svg), native 170×121.
  const logoH = 56
  const logoW = (logoH * 170) / 121
  // Logos only belong on the actual reel — hidden on the intro/zoom screens.
  const showLogos = phase === 'spin' || phase === 'landed'
  // BetOnline B lettermark in the hub, native viewBox 169.323×128.
  const hubLogoH = 24
  const hubLogoW = (hubLogoH * 169.323) / 128

  return (
    <svg viewBox="0 0 400 400" className="h-[min(92vw,420px)] w-[min(92vw,420px)] max-w-none">
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
        <radialGradient id="hubGlow" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#3a3d44" />
          <stop offset="60%" stopColor="#2a2c31" />
          <stop offset="100%" stopColor="#191a1d" />
        </radialGradient>

        <linearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="18%" stopColor="#67e8f9" stopOpacity="1" />
          <stop offset="38%" stopColor="#c084fc" stopOpacity="1" />
          <stop offset="58%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="78%" stopColor="#38bdf8" stopOpacity="1" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.35" />
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="0 0.5 0.5"
            to="360 0.5 0.5"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </linearGradient>

        <linearGradient id="rimGradientAlt" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#a5f3fc" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#f0abfc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="360 0.5 0.5"
            to="0 0.5 0.5"
            dur="5s"
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

      <g filter="url(#wheelShadow)">
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
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`360 ${cx} ${cy}`}
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={cx}
          cy={cy}
          r={outerR + 5}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />

        <g transform={`rotate(${rotation} ${cx} ${cy})`}>
          {WHEEL_SEGMENTS.map((seg) => {
            const start = seg.index * SEGMENT_ANGLE - 90
            const end = start + SEGMENT_ANGLE
            const midAngle = start + SEGMENT_ANGLE / 2
            const label = segmentLabelPosition(cx, cy, innerR, outerR, midAngle)
            const isUnderPointer =
              showHighlight && highlightedIndex != null && highlightedIndex === seg.index
            const segmentPath = describeSegment(cx, cy, outerR, innerR, start, end)
            const fillId = `segGrad-${seg.tier.id}-${seg.shade % 2}`
            const neon = SEGMENT_PALETTE[seg.tier.id].neon

            return (
              <g key={seg.index}>
                {/* Vivid, fully-saturated base slice */}
                <path
                  d={segmentPath}
                  fill={`url(#${fillId})`}
                  stroke="rgba(6,2,12,0.7)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Mute every slice that ISN'T under the pointer so the lit one
                    reads as a bright moving spotlight as the wheel turns. */}
                {showHighlight && !isUnderPointer && (
                  <path
                    d={segmentPath}
                    fill="#05010a"
                    fillOpacity="0.46"
                    stroke="none"
                  />
                )}
                {/* Polished light-up: a clean sheen bloom from the rim for the
                    slice under the pointer. */}
                {isUnderPointer && (
                  <path
                    d={segmentPath}
                    fill="url(#litSheen)"
                    stroke="none"
                  />
                )}
                {/* Neon edge outline (FanDuel-style glowing slice borders).
                    Painted last so the lit slice keeps a crisp bright edge. */}
                <path
                  d={segmentPath}
                  fill="none"
                  stroke={isUnderPointer ? '#ffffff' : neon}
                  strokeOpacity={isUnderPointer ? 0.95 : 0.55}
                  strokeWidth={isUnderPointer ? 3 : 1.4}
                  strokeLinejoin="round"
                  filter={isUnderPointer ? 'url(#litGlow)' : undefined}
                />
                {/* Tier wordmark logo — oriented radially so the winning slice
                    reads upright at the top pointer when it lands. */}
                {showLogos && (
                  <image
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

        <g opacity={hubRevealed ? 1 : 0} style={{ transition: 'opacity 0.7s ease 0.2s' }}>
          <circle cx={cx} cy={cy} r={innerR + 5} fill="#101113" stroke="rgba(255,255,255,0.1)" />
          <circle
            cx={cx}
            cy={cy}
            r={innerR - 4}
            fill="url(#hubGlow)"
            stroke="rgba(255,255,255,0.08)"
          />
          {/* Brand the hub with the BetOnline B lettermark. The lettermark's
              swoosh extends left of the B, so the glyph sits right of the box
              centre — nudge left so the B reads visually centred. */}
          <image
            href="/logos/BetOnline/lettermark/primary.svg"
            x={cx - hubLogoW / 2 - hubLogoW * 0.16}
            y={cy - hubLogoH / 2}
            width={hubLogoW}
            height={hubLogoH}
            style={{
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 7px rgba(238,53,54,0.55))',
            }}
          />
        </g>
      </g>
    </svg>
  )
}

export interface JackpotWheelBonusProps {
  onComplete: (tier: JackpotTickerTierId) => void
  winTier?: JackpotTickerTierId
  className?: string
}

export function JackpotWheelBonus({
  onComplete,
  winTier: winTierProp,
  className,
}: JackpotWheelBonusProps) {
  const [phase, setPhase] = useState<WheelPhase>('intro')
  const [rotation, setRotation] = useState(0)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [pointerActive, setPointerActive] = useState(false)
  // Camera push-in on the top pointer zone as the wheel slows to a crawl.
  const [closingIn, setClosingIn] = useState(false)
  const completedRef = useRef(false)
  const spinRafRef = useRef<number | null>(null)
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastLitIndexRef = useRef<number | null>(null)

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
    preloadWheelHighlightTicks()
    playSound('jackpot-intro', { volume: 0.85 })
    playJackpotBgMusic({ volume: 0.38 })

    const introTimer = setTimeout(() => {
      setPhase('zoom')
      setPointerActive(true)
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

    // Gentle, steady duck so the ticks cut through — never raised again.
    setJackpotBgVolume(0.28)

    const targetRotation = rotationToLandOnSegment(winningSegmentIndex)
    const startRotation = rotation
    const totalTravel = targetRotation - startRotation
    const startTime = performance.now()
    lastLitIndexRef.current = segmentAtPointer(startRotation)

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

      // Start the slow camera push-in once we're into the decel tail.
      if (t >= CLOSE_IN_AT) setClosingIn(true)

      const litIndex = segmentAtPointer(current)
      setRotation(current)
      setHighlightedIndex(litIndex)
      setPointerActive(true)

      // Same gate as the visual light-up → the click fires exactly with it.
      if (litIndex !== lastLitIndexRef.current) {
        lastLitIndexRef.current = litIndex
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

      setRotation(targetRotation)
      if (winningSegmentIndex !== lastLitIndexRef.current) {
        lastLitIndexRef.current = winningSegmentIndex
        playLightTick(0, 1)
      }
      setHighlightedIndex(winningSegmentIndex)
      setPhase('landed')
      playSound('jackpot-final-segment', { volume: 0.95 })
      // Stored in a ref so the phase-change cleanup below can't cancel it.
      finishTimerRef.current = setTimeout(finish, 1600)
    }

    spinRafRef.current = requestAnimationFrame(tick)
    return () => {
      if (spinRafRef.current) cancelAnimationFrame(spinRafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, winningSegmentIndex])

  const zoomed = phase !== 'intro'
  const showPointer = phase === 'zoom' || phase === 'spin' || phase === 'landed'
  const hubRevealed = phase !== 'intro'

  return (
    <div
      className={cn(
        'absolute inset-0 z-[100010] overflow-hidden rounded-2xl',
        className
      )}
    >
      <FanDuelBackground phase={phase} />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative flex items-center justify-center"
          initial={false}
          animate={{
            scale: closingIn ? 3.1 : zoomed ? 2.75 : 0.82,
            y: closingIn ? '46%' : zoomed ? '40%' : '0%',
          }}
          transition={
            closingIn
              ? { duration: 4.6, ease: [0.33, 0, 0.15, 1] }
              : { duration: 1, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {showPointer && <WheelPointer active={pointerActive} />}

          <WheelSvg
            rotation={rotation}
            highlightedIndex={highlightedIndex}
            phase={phase}
            hubRevealed={hubRevealed}
          />

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
        {phase === 'landed' && highlightedIndex != null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="pointer-events-none absolute inset-x-0 bottom-[10%] z-20 flex justify-center px-4"
          >
            <div
              className="rounded-2xl border px-6 py-3 text-center backdrop-blur-xl"
              style={{
                borderColor: `${WHEEL_SEGMENTS[highlightedIndex].tier.accent}66`,
                backgroundColor: 'rgba(12,6,24,0.72)',
                boxShadow: `0 0 40px ${WHEEL_SEGMENTS[highlightedIndex].tier.accent}44, 0 8px 32px rgba(0,0,0,0.45)`,
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
                You won
              </p>
              <p
                className="text-2xl font-bold tracking-wide"
                style={{
                  color: WHEEL_SEGMENTS[highlightedIndex].tier.accent,
                  textShadow: `0 0 24px ${WHEEL_SEGMENTS[highlightedIndex].tier.accent}66`,
                }}
              >
                {WHEEL_SEGMENTS[highlightedIndex].tier.label} Jackpot
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition flash — holds, then blooms to white right as the wheel
          hands off to the jackpot win animation, masking the swap. */}
      {phase === 'landed' && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[100020]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1] }}
          transition={{ duration: 1.6, times: [0, 0.72, 1], ease: 'easeIn' }}
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #ffffff 0%, #fde68a 45%, #fbbf24 100%)',
          }}
        />
      )}
    </div>
  )
}
