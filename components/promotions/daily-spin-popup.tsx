'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, animate } from 'framer-motion'
import confetti from 'canvas-confetti'
import { IconX } from '@tabler/icons-react'

// ─────────────────────────────────────────────────────────────────────────────
// Wheel configuration
// ─────────────────────────────────────────────────────────────────────────────

interface SpinPrize {
  /** Primary on-slice label, e.g. "$50" or "20" */
  label: string
  /** Optional secondary line under the primary label, e.g. "FREE SPINS" */
  sublabel?: string
  /** Numeric value used for the claim payload */
  value: number
  /** Reward type — drives win-screen copy and the no-prize "Unlucky" branch */
  kind: 'cash' | 'spins' | 'none'
  /** Slice background color */
  color: string
  /** Probability weight — higher = more likely. Big prizes get small weights. */
  weight: number
}

// 8 slices, brand-aligned premium palette. Pulled from
// `lib/agent/designSystem.ts`:
//   - betRed/700 #dc2a2f  → deepened to a rich wine claret
//   - betNavy/700 #104e62 → deepened to midnight teal
//   - vipColors/gold #c4af3e + Loyalty Gold #c5a047 → muted antique gold
//   - true onyx for the "dark" wedges
// Bright Tailwind values like `#facc15`, `#dc2434`, `#3a8caa` were too
// "primary-school crayon"; these read as enamel jewellery instead.
interface PrizeColor {
  /** Inner gradient stop (toward hub) — the "brighter" face of the slice. */
  inner: string
  /** Outer gradient stop (toward rim) — the "deeper" face of the slice. */
  outer: string
  /** Family label used as the SVG <radialGradient> id suffix. */
  family: 'claret' | 'onyx' | 'gold' | 'midnight'
  /** Solid colour used for confetti & halo accent (always readable on black). */
  accent: string
  /** Recommended foreground for prize labels on this slice. */
  ink: 'light' | 'dark'
}

const PALETTE: Record<'claret' | 'onyx' | 'gold' | 'midnight', PrizeColor> = {
  // Deep wine — the brand red, dropped two steps down for a casino-table feel.
  claret:   { inner: '#9a1322', outer: '#3a0510', family: 'claret',   accent: '#ee3536', ink: 'light' },
  // True onyx with a faint warm undertone so it doesn't look like a hole.
  onyx:     { inner: '#23252b', outer: '#08090b', family: 'onyx',     accent: '#c5a047', ink: 'light' },
  // Brand loyalty gold — antique, muted. No more lemon-yellow.
  gold:     { inner: '#c5a047', outer: '#5e4612', family: 'gold',     accent: '#dbc448', ink: 'dark' },
  // Deep midnight teal — derived from betNavy/700, dropped further so it
  // reads as evening rather than a primary blue.
  midnight: { inner: '#1d4a5e', outer: '#06212e', family: 'midnight', accent: '#5cd0ff', ink: 'light' },
}

interface PrizeWithColor extends Omit<SpinPrize, 'color'> {
  color: PrizeColor
}

// Prize order is rendered around the wheel starting at 12 o'clock and going
// clockwise. Weights bias the random pick toward the lower-tier outcomes so
// the headline prizes still feel like a rare hit.
const PRIZES: PrizeWithColor[] = [
  { label: 'Unlucky',                       value: 0,    kind: 'none',  color: PALETTE.onyx,     weight: 30 },
  { label: '$2',                            value: 2,    kind: 'cash',  color: PALETTE.claret,   weight: 22 },
  { label: '$5',                            value: 5,    kind: 'cash',  color: PALETTE.midnight, weight: 18 },
  { label: '20',  sublabel: 'FREE SPINS',   value: 20,   kind: 'spins', color: PALETTE.gold,     weight: 5  },
  { label: '100', sublabel: 'FREE SPINS',   value: 100,  kind: 'spins', color: PALETTE.claret,   weight: 1  },
  { label: '$20',                           value: 20,   kind: 'cash',  color: PALETTE.onyx,     weight: 8  },
  { label: '$50',                           value: 50,   kind: 'cash',  color: PALETTE.gold,     weight: 2  },
  { label: '5',   sublabel: 'FREE SPINS',   value: 5,    kind: 'spins', color: PALETTE.midnight, weight: 14 },
]

const SEGMENT_COUNT = PRIZES.length
const SEGMENT_DEG = 360 / SEGMENT_COUNT
const WHEEL_RADIUS = 220
const WHEEL_INNER_RADIUS = 60

// Spin animation timing (kept here so the handler and the wheel SVG agree).
// Longer + heavily back-loaded ease so the wheel slows progressively and
// gently creeps to land on the winning slice.
const SPIN_DURATION_MS = 6800
const SPIN_BASE_TURNS = 8
const SPIN_EASE: [number, number, number, number] = [0.08, 0.55, 0.05, 1]

// Returns the always-readable accent colour for confetti / win halos —
// onyx is too dark to bloom on a black backdrop, so it borrows champagne gold
// instead. Every other slice already ships its own visible accent.
function accentFor(color: PrizeColor): string {
  return color.accent
}

// Human-readable prize string used in the title + claim button. Kept separate
// from the on-slice label because slice space is tight (we use abbreviated
// "20 / FREE SPINS" stacks there) but the win screen has room to breathe.
function formatPrize(p: PrizeWithColor): string {
  if (p.kind === 'spins') return `${p.value} Free Spins`
  if (p.kind === 'cash') return p.label
  return p.label
}

function pickWeightedIndex(): number {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight
    if (r <= 0) return i
  }
  return PRIZES.length - 1
}

// SVG wedge path for a slice centered at angle = i * SEGMENT_DEG (top = 0deg).
function wedgePath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180
  const x1o = cx + rOuter * Math.cos(toRad(startDeg))
  const y1o = cy + rOuter * Math.sin(toRad(startDeg))
  const x2o = cx + rOuter * Math.cos(toRad(endDeg))
  const y2o = cy + rOuter * Math.sin(toRad(endDeg))
  const x1i = cx + rInner * Math.cos(toRad(startDeg))
  const y1i = cy + rInner * Math.sin(toRad(startDeg))
  const x2i = cx + rInner * Math.cos(toRad(endDeg))
  const y2i = cy + rInner * Math.sin(toRad(endDeg))
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1
  return [
    `M ${x1i} ${y1i}`,
    `L ${x1o} ${y1o}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x2i} ${y2i}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x1i} ${y1i}`,
    'Z',
  ].join(' ')
}

// ─────────────────────────────────────────────────────────────────────────────
// Wheel (SVG)
// ─────────────────────────────────────────────────────────────────────────────

interface WheelProps {
  rotation: number
  spinning: boolean
  /** Whether to show the wobbling pointer at the top */
  showPointer?: boolean
}

function WheelSVG({ rotation, spinning, showPointer = true }: WheelProps) {
  // Animate the SVG `transform` ATTRIBUTE imperatively. SVG attribute
  // transforms pivot around (0,0) in user-space by default — exactly the
  // wheel's centre — so we sidestep the CSS `transform-box`/`transform-origin`
  // issues that prevented `motion.g` from rotating reliably across browsers.
  const wheelGroupRef = useRef<SVGGElement>(null)
  const currentRotationRef = useRef(0)

  useEffect(() => {
    const el = wheelGroupRef.current
    if (!el) return

    if (!spinning) {
      // Snap to 0 (or whatever the latest committed value is) on reset.
      el.setAttribute('transform', `rotate(${rotation})`)
      currentRotationRef.current = rotation
      return
    }

    const start = currentRotationRef.current
    const controls = animate(start, rotation, {
      duration: SPIN_DURATION_MS / 1000,
      ease: SPIN_EASE,
      onUpdate: (latest) => {
        el.setAttribute('transform', `rotate(${latest})`)
        currentRotationRef.current = latest
      },
    })

    return () => controls.stop()
  }, [rotation, spinning])

  const slices = useMemo(() => {
    return PRIZES.map((prize, i) => {
      const startDeg = i * SEGMENT_DEG - SEGMENT_DEG / 2
      const endDeg = i * SEGMENT_DEG + SEGMENT_DEG / 2
      return {
        prize,
        path: wedgePath(0, 0, WHEEL_RADIUS, WHEEL_INNER_RADIUS, startDeg, endDeg),
        labelAngle: i * SEGMENT_DEG,
      }
    })
  }, [])

  // Total view radius (wheel + thin rim + ambient shadow). No studs, no LED
  // strip, no skeuomorphic ornaments — the previous design tried to be
  // "premium" by piling decoration on top of decoration. Modern wheels read
  // as a single confident shape.
  const VIEW = WHEEL_RADIUS + 36

  return (
    <svg
      viewBox={`-${VIEW} -${VIEW} ${VIEW * 2} ${VIEW * 2}`}
      className="block w-full h-full"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Single subtle inner highlight — a faint white wash near the centre
            so flat slices catch a hint of light without becoming gradient
            paintings. Modern wheels are flat; this is the one concession. */}
        <radialGradient id="innerWash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ─── Wheel body — rotates via SVG transform attribute (imperative) ─── */}
      <g ref={wheelGroupRef} transform={`rotate(${currentRotationRef.current})`}>
        {/* Flat slice fills. No per-family radial gradients, no shading
            tricks — just two confident brand colours alternating. The whole
            "polished enamel" idea was reading as Photoshop layer styles. */}
        {slices.map((s, i) => {
          const isAccent = i % 2 === 0
          return (
            <path
              key={`slice-${i}`}
              d={s.path}
              fill={isAccent ? '#ee3536' : '#16171b'}
              stroke="#0a0b0e"
              strokeWidth={1}
            />
          )
        })}

        {/* Subtle inner wash so the centre catches a touch of warm light */}
        <circle cx={0} cy={0} r={WHEEL_RADIUS} fill="url(#innerWash)" pointerEvents="none" />

        {/* Labels — solid white, single weight, no stroke, no shadow stack.
            Slices with a sublabel ("FREE SPINS") render the count big with
            the descriptor stacked underneath. Long single-line labels like
            "Unlucky" downscale automatically. */}
        {slices.map((s, i) => {
          const labelRadius = (WHEEL_RADIUS + WHEEL_INNER_RADIUS) / 2 + 18
          const hasSub = !!s.prize.sublabel
          const labelLen = s.prize.label.length
          const primarySize = hasSub
            ? 30
            : labelLen > 5
              ? 18
              : labelLen > 3
                ? 22
                : 26
          return (
            <g key={`label-${i}`} transform={`rotate(${s.labelAngle})`}>
              <text
                x={0}
                y={-labelRadius - (hasSub ? 6 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize={primarySize}
                fontWeight={700}
                style={{
                  fontFamily: 'var(--font-figtree), sans-serif',
                  letterSpacing: '-0.01em',
                }}
              >
                {s.prize.label}
              </text>
              {hasSub && (
                <text
                  x={0}
                  y={-labelRadius + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.85)"
                  fontSize={9}
                  fontWeight={600}
                  style={{
                    fontFamily: 'var(--font-figtree), sans-serif',
                    letterSpacing: '0.12em',
                  }}
                >
                  {s.prize.sublabel}
                </text>
              )}
            </g>
          )
        })}
      </g>

      {/* ─── Outer rim ─── A single hairline ring framing the slice band.
          No bevels, no piping, no studs — clean geometric border. */}
      <circle
        cx={0}
        cy={0}
        r={WHEEL_RADIUS + 6}
        fill="none"
        stroke="#262628"
        strokeWidth={12}
      />
      <circle
        cx={0}
        cy={0}
        r={WHEEL_RADIUS + 12.5}
        fill="none"
        stroke="#0a0b0e"
        strokeWidth={1}
      />
      <circle
        cx={0}
        cy={0}
        r={WHEEL_RADIUS - 0.5}
        fill="none"
        stroke="#0a0b0e"
        strokeWidth={1}
      />

      {/* ─── Center cap — solid dark disc behind the SPIN button. Gives the
          rotating spokes a clean stop without the gold-sparkle hub disc. */}
      <circle cx={0} cy={0} r={WHEEL_INNER_RADIUS + 6} fill="#0a0b0e" />
      <circle cx={0} cy={0} r={WHEEL_INNER_RADIUS + 5} fill="#16171b" />

      {/* ─── Pointer at the very top of the wheel ─── */}
      {showPointer && (
        <PointerSVG spinning={spinning} />
      )}
    </svg>
  )
}

// Pointer: a sleek champagne-gold arrow blade mounted on a slim metal stem,
// pinned to the top edge of the rim. Rotates around its mounting point —
// driven by an imperative `requestAnimationFrame` loop on the SVG `rotate`
// attribute, NOT framer-motion. The previous framer-motion + `transformBox`
// trick was unreliable on SVG `<g>` and the wobble simply didn't fire on most
// browsers (which is what the user noticed).
function PointerSVG({ spinning }: { spinning: boolean }) {
  const ref = useRef<SVGGElement>(null)

  // Pivot lives at the very top of the rim where the pointer attaches. We
  // rotate around (0, PIVOT_Y) using SVG's `rotate(angle cx cy)` syntax so
  // the swing pivots from the mount, not from the centre of the bounding box.
  const PIVOT_Y = -(WHEEL_RADIUS + 4)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!spinning) {
      // Idle: gentle continuous bob via a slow sine wave so the pointer never
      // looks frozen. Keeps the wheel feeling alive.
      let raf = 0
      const start = performance.now()
      const tick = (now: number) => {
        const t = (now - start) / 1000
        const bobAngle = Math.sin(t * 1.4) * 1.4
        el.setAttribute('transform', `rotate(${bobAngle} 0 ${PIVOT_Y})`)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }

    // Spinning: peg-click ratchet. Triangle wave with a sharp lead-in so each
    // swing lands like the pointer was just kicked by a divider going past.
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 1000
      // ~7Hz oscillation, ±9° peak — clearly visible without being silly.
      const phase = (t * 7) % 1
      // Sawtooth-ish wave: quick recoil, slower return-to-rest.
      const sweep = phase < 0.35 ? -1 + (phase / 0.35) * 1.2 : 0.2 - ((phase - 0.35) / 0.65) * 1.2
      const angle = sweep * 9
      el.setAttribute('transform', `rotate(${angle} 0 ${PIVOT_Y})`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      // Snap back to neutral so the next idle bob starts clean.
      el.setAttribute('transform', `rotate(0 0 ${PIVOT_Y})`)
    }
  }, [spinning, PIVOT_Y])

  // Geometry — minimal flat triangle pointing inward at 12 o'clock.
  // Sits just inside the rim so it reads as part of the wheel chrome, not
  // a separate ornament. No gem, no dome, no metal gradient.
  const TIP_Y = -(WHEEL_RADIUS - 4)
  const BASE_Y = -(WHEEL_RADIUS + 14)
  const HALF_W = 11

  const trianglePath = [
    `M ${-HALF_W} ${BASE_Y}`,
    `L 0 ${TIP_Y}`,
    `L ${HALF_W} ${BASE_Y}`,
    'Z',
  ].join(' ')

  return (
    <g ref={ref} transform={`rotate(0 0 ${PIVOT_Y})`}>
      <path
        d={trianglePath}
        fill="#ffffff"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.55))' }}
      />
    </g>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Ambient backdrop — a soft brand-red glow pulse anchored behind the wheel
// plus a few slow-drifting white particles in the card. Deliberately dim and
// low-frequency so it feels like atmosphere, not decoration.
// ─────────────────────────────────────────────────────────────────────────────

function AmbientBackdrop({ active }: { active: boolean }) {
  // Particle positions are randomised once per mount so each session feels
  // organic, but the count is small (12) and motion is slow so the eye reads
  // them as ambient depth rather than a falling-particle effect.
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 2,
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 6,
      drift: -8 - Math.random() * 12, // upward drift in %
    }))
  }, [])

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Centre glow — a slow pulsing brand-red radial bloom anchored behind
          the wheel. Sits low in the alpha range so it feels like the room
          lighting, not a spotlight. */}
      <motion.div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: '120%',
          aspectRatio: '1 / 1',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(238,53,54,0.18) 0%, rgba(238,53,54,0.08) 35%, rgba(238,53,54,0) 65%)',
          filter: 'blur(12px)',
        }}
        animate={
          active
            ? { opacity: [0.55, 0.9, 0.55], scale: [0.95, 1.05, 0.95] }
            : { opacity: 0.55, scale: 1 }
        }
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Drifting particles — white at low alpha, slow upward drift, gentle
          twinkle. No gold, no colour, no streak trails. */}
      {particles.map((p) => (
        <motion.span
          key={p.i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'rgba(255,255,255,0.55)',
            boxShadow: '0 0 4px rgba(255,255,255,0.35)',
          }}
          animate={{
            y: [`0%`, `${p.drift}%`],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Popup
// ─────────────────────────────────────────────────────────────────────────────

interface DailySpinPopupProps {
  visible: boolean
  onClose: () => void
  /** Called with the prize once the user claims after a spin. */
  onClaim?: (prize: PrizeWithColor) => void
}

type Phase = 'idle' | 'spinning' | 'won'

export function DailySpinPopup({ visible, onClose, onClaim }: DailySpinPopupProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [rotation, setRotation] = useState(0)
  const [winningIndex, setWinningIndex] = useState<number | null>(null)
  const confettiFiredRef = useRef(false)

  // Reset everything when the popup is closed
  useEffect(() => {
    if (!visible) {
      setPhase('idle')
      setRotation(0)
      setWinningIndex(null)
      confettiFiredRef.current = false
    }
  }, [visible])

  const fireConfetti = useCallback((accentColor: string) => {
    if (confettiFiredRef.current) return
    confettiFiredRef.current = true

    // Mix the prize's slice color into the palette so the confetti feels
    // tied to what the user actually won.
    const colors = [
      '#FFD700',
      '#FFDF00',
      '#FACC15',
      '#FFA500',
      '#ffffff',
      accentColor,
      accentColor,
    ]

    // Star + sparkle emoji shapes alongside the standard square/circle for a
    // glittery, "magical" feel.
    // canvas-confetti's `shapeFromText` returns a Shape object that can be
    // mixed into the `shapes` array.
    let starShape: unknown = 'square'
    let sparkleShape: unknown = 'circle'
    try {
      starShape = (confetti as unknown as {
        shapeFromText: (opts: { text: string; scalar?: number }) => unknown
      }).shapeFromText({ text: '⭐', scalar: 2 })
      sparkleShape = (confetti as unknown as {
        shapeFromText: (opts: { text: string; scalar?: number }) => unknown
      }).shapeFromText({ text: '✨', scalar: 2 })
    } catch {
      // older versions — fall back to default shapes silently
    }
    const shapes = ['square', 'circle', starShape, sparkleShape] as never[]

    const defaults = {
      spread: 360,
      ticks: 160,
      zIndex: 100000,
      colors,
      shapes,
    }

    // Big initial center burst — the "WIN!" hit
    confetti({
      ...defaults,
      particleCount: 160,
      startVelocity: 50,
      scalar: 1.3,
      origin: { x: 0.5, y: 0.42 },
    })

    // Side cannons firing inward
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 70,
        angle: 60,
        startVelocity: 60,
        spread: 70,
        origin: { x: 0, y: 0.65 },
      })
      confetti({
        ...defaults,
        particleCount: 70,
        angle: 120,
        startVelocity: 60,
        spread: 70,
        origin: { x: 1, y: 0.65 },
      })
    }, 200)

    // Slow, big star rain from above
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 60,
        startVelocity: 35,
        scalar: 1.7,
        gravity: 0.7,
        origin: { x: 0.5, y: 0.25 },
      })
    }, 500)

    // Wide sparkle wave
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 90,
        startVelocity: 32,
        scalar: 1.1,
        gravity: 0.55,
        origin: { x: 0.5, y: 0.45 },
      })
    }, 900)

    // Final accent-colored pop
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 80,
        startVelocity: 65,
        scalar: 1.4,
        colors: [accentColor, '#FFD700', '#ffffff'],
        origin: { x: 0.5, y: 0.5 },
      })
    }, 1400)

    // Lingering sparkle drift
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        startVelocity: 20,
        scalar: 1.6,
        gravity: 0.4,
        ticks: 220,
        origin: { x: 0.5, y: 0.3 },
      })
    }, 2100)
  }, [])

  const handleSpin = useCallback(() => {
    if (phase !== 'idle') return
    const winIdx = pickWeightedIndex()
    setWinningIndex(winIdx)
    // Rotate clockwise by N full turns + offset so segment `winIdx` ends up at
    // the top pointer. Segment center is at i * SEGMENT_DEG (top = 0). Rotation
    // is clockwise positive, so to bring segment i to the top we need
    // rotation ≡ -i*SEGMENT_DEG (mod 360). Add some randomness within the slice
    // (±30% of slice width) to feel non-deterministic.
    const slack = (Math.random() - 0.5) * SEGMENT_DEG * 0.6
    const target = SPIN_BASE_TURNS * 360 - winIdx * SEGMENT_DEG + slack
    setPhase('spinning')
    setRotation(target)

    // Fire the win effects shortly after the wheel finishes its slow creep.
    // Skip the confetti for the "Unlucky" slice — celebrating a no-prize
    // result feels wrong.
    setTimeout(() => {
      setPhase('won')
      if (PRIZES[winIdx].kind !== 'none') {
        fireConfetti(accentFor(PRIZES[winIdx].color))
      }
    }, SPIN_DURATION_MS + 120)
  }, [phase, fireConfetti])

  const winningPrize = winningIndex != null ? PRIZES[winningIndex] : null

  const handleClaim = useCallback(() => {
    if (winningPrize) onClaim?.(winningPrize)
    onClose()
  }, [winningPrize, onClaim, onClose])

  // Portal target — only available client-side. The popup MUST escape any
  // ancestor stacking context (the VIP drawer uses CSS transforms for its
  // slide animation, which traps fixed-positioned children no matter how
  // high z-index gets). Mounting at <body> is the cleanest fix.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  useEffect(() => {
    if (typeof document !== 'undefined') setPortalTarget(document.body)
  }, [])

  const tree = (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ pointerEvents: 'auto' }}
          role="dialog"
          aria-modal="true"
          aria-label="Daily spin"
        >
          {/* Backdrop — translucent dim with a soft blur so the page stays
              legible behind the wheel without competing for attention. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={phase === 'idle' ? onClose : undefined}
          />

          {/* ─── Card / dialog ─── Clean dark surface, subtle white border.
              No gold rim, no warm bloom. Modern flat. */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10 flex flex-col items-center w-[min(94vw,460px)] rounded-[24px] px-3 pt-7 pb-6 overflow-hidden sm:px-4"
            style={{
              background: '#0c0d10',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient backdrop — slow brand-red glow + drifting particles.
                Sits at z-index 0 so all foreground content layers above it. */}
            <AmbientBackdrop active={phase !== 'spinning'} />

            {/* Win flash — a single subtle brand-red glow pulse from the
                centre of the wheel. No rays, no sparkles, no white blast.
                Skipped when the result is "Unlucky". */}
            <AnimatePresence>
              {phase === 'won' && winningPrize?.kind !== 'none' && (
                <motion.div
                  key="win-flash"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: [0, 0.45, 0], scale: [0.7, 1.2, 1.4] }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 pointer-events-none"
                  style={{
                    zIndex: 30,
                    width: '90%',
                    aspectRatio: '1 / 1',
                    transform: 'translate(-50%, -50%)',
                    background:
                      'radial-gradient(circle, rgba(238,53,54,0.55) 0%, rgba(238,53,54,0) 60%)',
                    filter: 'blur(8px)',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Close button — pinned to card */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.08] text-white/60 hover:text-white flex items-center justify-center transition-all active:scale-95"
              style={{ zIndex: 40 }}
            >
              <IconX className="w-4 h-4" />
            </button>

            <div className="relative w-full flex flex-col items-center pt-2" style={{ zIndex: 1 }}>
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-white text-3xl sm:text-4xl font-bold text-center tracking-tight"
              style={{ fontFamily: 'var(--font-figtree), sans-serif' }}
            >
              {phase === 'won' && winningPrize ? (
                <motion.span
                  className="inline-block"
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.36, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {winningPrize.kind === 'none' ? (
                    <>So close.</>
                  ) : (
                    <>
                      You won{' '}
                      <span style={{ color: '#ee3536' }}>
                        {formatPrize(winningPrize)}
                      </span>
                    </>
                  )}
                </motion.span>
              ) : (
                <>Daily spin</>
              )}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.4 }}
              className="text-white/55 text-sm text-center mt-2 mb-5"
            >
              {phase === 'won' && winningPrize?.kind === 'none'
                ? 'No prize this time — try again tomorrow.'
                : phase === 'won'
                  ? winningPrize?.kind === 'spins'
                    ? 'Free spins added to your account.'
                    : 'Claim your reward — credited straight to your balance.'
                  : 'One free spin every day. Tap the button to play.'}
            </motion.p>

            {/* Wheel — pointer is rendered inside the SVG so it stays
                pixel-perfect centred on the wheel at every viewport size. */}
            <div className="relative w-full aspect-square mx-auto" style={{ maxWidth: 420 }}>
              {/* Win halo — colored glow over the winning slice (top of wheel).
                  Suppressed for the no-prize result. */}
              <AnimatePresence>
                {phase === 'won' && winningPrize && winningPrize.kind !== 'none' && (
                  <motion.div
                    key="win-halo"
                    className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                    style={{
                      top: '4%',
                      width: '38%',
                      aspectRatio: '1 / 1',
                      background:
                        'radial-gradient(circle, rgba(238,53,54,0.6) 0%, rgba(238,53,54,0) 65%)',
                      filter: 'blur(4px)',
                      zIndex: 2,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 0.9, 0.7], scale: [0.5, 1.2, 1] }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>

              {/* Wheel (pointer is baked in, fixed at top centre) */}
              <WheelSVG rotation={rotation} spinning={phase === 'spinning'} />

              {/* ─── SPIN button ─── Flat brand-red disc, white sans label.
                  No metal gradient, no embossed shadows, no halo. The
                  whole "polished gold ball" was reading as a Y2K bouncy ball. */}
              <button
                type="button"
                onClick={handleSpin}
                disabled={phase !== 'idle'}
                className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label={phase === 'idle' ? 'Spin the wheel' : phase === 'spinning' ? 'Spinning…' : 'Spin complete'}
                style={{
                  width: '24%',
                  aspectRatio: '1 / 1',
                  cursor: phase === 'idle' ? 'pointer' : 'default',
                }}
              >
                <div
                  className="relative w-full h-full rounded-full flex items-center justify-center select-none transition-all group-active:scale-95 group-hover:brightness-110"
                  style={{
                    background: phase === 'idle' ? '#ee3536' : '#7a1a1c',
                    boxShadow:
                      '0 8px 24px rgba(238,53,54,0.35), 0 0 0 4px rgba(0,0,0,0.55)',
                  }}
                >
                  <span
                    className="font-bold tracking-[0.18em] uppercase text-white"
                    style={{
                      fontSize: 'clamp(11px, 2.4vw, 14px)',
                      fontFamily: 'var(--font-figtree), sans-serif',
                    }}
                  >
                    {phase === 'spinning' ? '...' : 'SPIN'}
                  </span>
                </div>
              </button>
            </div>

            {/* Footer status / claim — idle uses the in-wheel SPIN button, so
                we only render content while spinning or after a win. */}
            <div className="w-full mt-4 flex flex-col items-center gap-3 min-h-[2.5rem]">
              <AnimatePresence mode="wait">
                {phase === 'spinning' && (
                  <motion.div
                    key="cta-spinning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/50 text-sm tracking-wide"
                  >
                    Good luck…
                  </motion.div>
                )}
                {phase === 'won' && winningPrize && (
                  <motion.div
                    key="cta-won"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="w-full flex flex-col items-center"
                  >
                    <button
                      type="button"
                      onClick={handleClaim}
                      className="w-full max-w-xs px-6 py-3 rounded-xl font-semibold text-[15px] tracking-tight transition-colors hover:bg-[rgba(238,53,54,0.08)] active:bg-[rgba(238,53,54,0.14)]"
                      style={{
                        background: 'transparent',
                        color: '#ee3536',
                        border: '1.5px solid #ee3536',
                      }}
                    >
                      {winningPrize.kind === 'none'
                        ? 'Close'
                        : `Claim ${formatPrize(winningPrize)}`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!portalTarget) return null
  return createPortal(tree, portalTarget)
}

export default DailySpinPopup
