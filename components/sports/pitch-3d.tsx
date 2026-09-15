'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type Pitch3DSport = 'football' | 'basketball' | 'soccer'

interface Pitch3DProps {
  sport?: Pitch3DSport
  /** Team colours tint the two halves of the crowd. */
  homeColor?: string
  awayColor?: string
  clock?: string
  /** Chip in the top-left corner ("Play by play", "Scorers"...). */
  label?: string
  /** Callout attached to the ball marker (player / play). */
  eventLabel?: string
  /** Possession / control split, 0-100 for home. */
  homePercent?: number
  isLive?: boolean
  height?: number
  className?: string
}

/** Where the ball can be (field coordinates, 0-100 both axes). Cycled through while live. */
const BALL_PATH: Array<{ x: number; y: number; label?: string }> = [
  { x: 62, y: 38, label: 'Snap' },
  { x: 55, y: 52, label: 'Rush' },
  { x: 71, y: 30, label: 'Pass' },
  { x: 40, y: 45, label: 'Turnover' },
  { x: 33, y: 60, label: 'Rush' },
  { x: 48, y: 41, label: 'Snap' },
]

const BRAND = 'PropShopX'

/**
 * Stadium-style 3D tracker: crowd + LED boards behind a perspective field, with an animated
 * ball marker, callout and possession wedge. Pure CSS/SVG — no external widget needed.
 */
export function Pitch3D({
  sport = 'soccer',
  homeColor = '#2fbf71',
  awayColor = '#ee3536',
  clock,
  label = 'Play by play',
  eventLabel,
  homePercent = 50,
  isLive = true,
  height = 240,
  className,
}: Pitch3DProps) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!isLive) return
    const t = setInterval(() => setStep((s) => (s + 1) % BALL_PATH.length), 3200)
    return () => clearInterval(t)
  }, [isLive])
  const ball = BALL_PATH[step]
  const callout = eventLabel ?? ball.label

  return (
    <div
      className={cn('relative w-full select-none overflow-hidden bg-[var(--ds-page-bg,#222222)]', className)}
      style={{ height }}
      aria-label="Match tracker field"
      role="img"
    >
      {/* Backdrop — plain page surface; just a faint shadow where the boards meet it */}
      <div className="absolute inset-x-0 top-0 h-[62%] bg-[var(--ds-page-bg,#222222)]">
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-black/25" />
      </div>

      {/* Perspective scene */}
      <div className="absolute inset-0" style={{ perspective: 620, perspectiveOrigin: '50% 30%' }}>
        {/* LED board along the far edge of the field */}
        <div
          className="absolute inset-x-0 top-[33%] flex h-[5.5%] min-h-[14px] items-center overflow-hidden whitespace-nowrap bg-[#1a1a1a] text-[9px] font-extrabold uppercase tracking-wider"
          style={{ boxShadow: '0 3px 10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)' }}
        >
          <div className="flex w-max animate-[pitch-marquee_24s_linear_infinite] items-center">
            {Array.from({ length: 2 }).map((_, half) => (
              <div key={half} className="flex items-center gap-10 pr-10">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="text-[#ee3536]">Prop</span>
                    <span className="text-white/80">ShopX</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Field */}
        <div
          className="absolute left-[-14%] right-[-14%] top-[38.5%] bottom-[-38%] origin-top"
          style={{ transform: 'rotateX(52deg)', transformStyle: 'preserve-3d' }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[3px] shadow-[0_-10px_40px_rgba(0,0,0,0.7)]">
            <FieldSvg sport={sport} homeColor={homeColor} awayColor={awayColor} ball={ball} homePercent={homePercent} />

            {/* Ball marker + callout, positioned in field space */}
            <motion.div
              className="absolute"
              animate={{ left: `${ball.x}%`, top: `${ball.y}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative flex flex-col items-center">
                {callout && (
                  <motion.div
                    key={callout + step}
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mb-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-black shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    style={{ transform: 'scaleY(1.6)', transformOrigin: 'bottom center' }}
                  >
                    {callout}
                    <span className="absolute left-1/2 top-full size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
                  </motion.div>
                )}
                <span className="block size-2.5 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.6)]" />
                <span className="absolute top-2 h-2.5 w-2.5 rounded-full bg-black/40 blur-[2px]" />
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Foreground vignette so the near edge fades into the panel */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--ds-page-bg,#222222)] to-transparent" />

      {/* Top chrome */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <span className="relative flex size-2.5 items-center justify-center rounded-[3px] border border-white/60">
            <span className="size-1 rounded-full bg-[#00ffa5]" />
          </span>
          {label}
        </span>
        {clock && (
          <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded-b-md bg-black/80 px-3 py-1 text-sm font-bold tabular-nums text-[#7dffb3] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            {clock}
          </span>
        )}
      </div>

    </div>
  )
}

// ─── Field drawings ───────────────────────────────────────────

function FieldSvg({
  sport,
  homeColor,
  awayColor,
  ball,
  homePercent,
}: {
  sport: Pitch3DSport
  homeColor: string
  awayColor: string
  ball: { x: number; y: number }
  homePercent: number
}) {
  if (sport === 'basketball') return <CourtSvg homeColor={homeColor} awayColor={awayColor} ball={ball} />
  if (sport === 'football') return <GridironSvg ball={ball} />
  return <SoccerSvg ball={ball} homePercent={homePercent} />
}

const LINE = 'rgba(255,255,255,0.75)'

function Stripes({ count, dark, light }: { count: number; dark: string; light: string }) {
  const w = 100 / count
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <rect key={i} x={i * w} y={0} width={w} height={100} fill={i % 2 ? dark : light} />
      ))}
    </>
  )
}

function ControlWedge({ ball, color }: { ball: { x: number; y: number }; color: string }) {
  // Lit "area of play" wedge fanning out from the ball towards the goal it's attacking
  const dir = ball.x >= 50 ? 1 : -1
  const tipX = ball.x
  const farX = ball.x + dir * 22
  return (
    <motion.polygon
      animate={{ points: `${tipX},${ball.y} ${farX},${ball.y - 26} ${farX},${ball.y + 26}` }}
      transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      fill={color}
      opacity={0.22}
    />
  )
}

function SoccerSvg({ ball, homePercent }: { ball: { x: number; y: number }; homePercent: number }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <Stripes count={12} dark="#2f8f3a" light="#3aa447" />
      <ControlWedge ball={ball} color="#c9ffb3" />
      <g fill="none" stroke={LINE} strokeWidth={0.6} vectorEffect="non-scaling-stroke">
        <rect x={3} y={4} width={94} height={92} />
        <line x1={50} y1={4} x2={50} y2={96} />
        <ellipse cx={50} cy={50} rx={9} ry={14} />
        <rect x={3} y={22} width={16} height={56} />
        <rect x={3} y={36} width={6} height={28} />
        <rect x={81} y={22} width={16} height={56} />
        <rect x={91} y={36} width={6} height={28} />
      </g>
      <circle cx={50} cy={50} r={0.8} fill={LINE} />
      {/* possession glow on the dominant half */}
      <rect x={homePercent >= 50 ? 3 : 50} y={4} width={47} height={92} fill="white" opacity={0.03} />
    </svg>
  )
}

function GridironSvg({ ball }: { ball: { x: number; y: number } }) {
  const yards = Array.from({ length: 11 }, (_, i) => 10 + i * 8) // 10..90
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <Stripes count={12} dark="#2f8f3a" light="#3aa447" />
      {/* End zones */}
      <rect x={0} y={0} width={10} height={100} fill="#1f4f9a" opacity={0.85} />
      <rect x={90} y={0} width={10} height={100} fill="#a11d1d" opacity={0.85} />
      <ControlWedge ball={ball} color="#ffe9a8" />
      <g stroke={LINE} strokeWidth={0.5} vectorEffect="non-scaling-stroke">
        <rect x={10} y={3} width={80} height={94} fill="none" />
        {yards.map((x) => (
          <line key={x} x1={x} y1={3} x2={x} y2={97} />
        ))}
        {/* hash marks */}
        {yards.map((x) => (
          <g key={`h${x}`}>
            <line x1={x - 2} y1={38} x2={x + 2} y2={38} />
            <line x1={x - 2} y1={62} x2={x + 2} y2={62} />
          </g>
        ))}
      </g>
      {/* yard numbers */}
      <g fill={LINE} fontSize={4.5} fontWeight={700} textAnchor="middle" opacity={0.85}>
        {[
          [18, '10'],
          [26, '20'],
          [34, '30'],
          [42, '40'],
          [50, '50'],
          [58, '40'],
          [66, '30'],
          [74, '20'],
          [82, '10'],
        ].map(([x, t]) => (
          <text key={x} x={x} y={20}>
            {t}
          </text>
        ))}
      </g>
      {/* line of scrimmage + first down */}
      <motion.line
        animate={{ x1: ball.x, x2: ball.x }}
        y1={3}
        y2={97}
        stroke="#4aa3ff"
        strokeWidth={0.8}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      />
      <motion.line
        animate={{ x1: ball.x + 8, x2: ball.x + 8 }}
        y1={3}
        y2={97}
        stroke="#ffd83d"
        strokeWidth={0.8}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      />
    </svg>
  )
}

function CourtSvg({ homeColor, awayColor, ball }: { homeColor: string; awayColor: string; ball: { x: number; y: number } }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <rect x={0} y={0} width={100} height={100} fill="#c98a4b" />
      <rect x={0} y={0} width={100} height={100} fill="url(#wood)" />
      <defs>
        <pattern id="wood" width={100} height={4} patternUnits="userSpaceOnUse">
          <rect width={100} height={4} fill="transparent" />
          <line x1={0} y1={0.5} x2={100} y2={0.5} stroke="rgba(0,0,0,0.12)" strokeWidth={0.4} />
        </pattern>
      </defs>
      {/* paint */}
      <rect x={3} y={30} width={19} height={40} fill={homeColor} opacity={0.35} />
      <rect x={78} y={30} width={19} height={40} fill={awayColor} opacity={0.35} />
      <ControlWedge ball={ball} color="#fff3d6" />
      <g fill="none" stroke={LINE} strokeWidth={0.6} vectorEffect="non-scaling-stroke">
        <rect x={3} y={4} width={94} height={92} />
        <line x1={50} y1={4} x2={50} y2={96} />
        <ellipse cx={50} cy={50} rx={6} ry={10} />
        <rect x={3} y={30} width={19} height={40} />
        <rect x={78} y={30} width={19} height={40} />
        <path d="M 3 12 L 14 12 A 20 40 0 0 1 14 88 L 3 88" />
        <path d="M 97 12 L 86 12 A 20 40 0 0 0 86 88 L 97 88" />
        <ellipse cx={22} cy={50} rx={3} ry={6} />
        <ellipse cx={78} cy={50} rx={3} ry={6} />
      </g>
      {/* hoops */}
      <ellipse cx={7} cy={50} rx={1} ry={2} fill="none" stroke="#ff7a1a" strokeWidth={0.8} />
      <ellipse cx={93} cy={50} rx={1} ry={2} fill="none" stroke="#ff7a1a" strokeWidth={0.8} />
    </svg>
  )
}
