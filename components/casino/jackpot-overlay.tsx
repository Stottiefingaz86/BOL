'use client'

import React, { useEffect, useLayoutEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { IconShare, IconX } from '@tabler/icons-react'
import {
  formatJackpotAmount,
  JACKPOT_TICKER_TIERS,
  JACKPOT_ODOMETER_SPIN_MS,
  JACKPOT_ODOMETER_STAGGER_MS,
  JACKPOT_WIN_COUNTUP_DELAY_MS,
  getJackpotWinCountUpDurationMs,
  jackpotAmountDigitCount,
  type JackpotTickerTierId,
} from '@/lib/jackpot/constants'
import { useJackpotStore } from '@/lib/store/jackpotStore'
import { fadeOutSound, playSound, stopSound } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// Gold particle rain background
function GoldRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Array<{
      x: number; y: number; size: number; speed: number
      opacity: number; rotation: number; rotSpeed: number
      wobble: number; wobbleSpeed: number; color: string
    }> = []

    const colors = ['#FFD700', '#F5E6A3', '#D4AF37', '#E8C547', '#FFF8DC']

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.setTransform(2, 0, 0, 2, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight * -2,
        size: Math.random() * 4 + 1.5,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.15,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 3,
        wobble: Math.random() * 50,
        wobbleSpeed: Math.random() * 0.02 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let time = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      time += 1
      particles.forEach((p) => {
        ctx.save()
        const wobbleX = Math.sin(time * p.wobbleSpeed + p.wobble) * 25
        ctx.translate(p.x + wobbleX, p.y)
        ctx.rotate((p.rotation + time * p.rotSpeed) * (Math.PI / 180))
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
        p.y += p.speed
        if (p.y > canvas.offsetHeight + 20) {
          p.y = -20
          p.x = Math.random() * canvas.offsetWidth
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
  )
}

// Single spinning digit column — equal spin speed per column, stops right → left
function SpinDigit({
  target,
  startDelayMs,
  spinDurationMs,
  spinning,
  digitKey,
}: {
  target: number
  startDelayMs: number
  spinDurationMs: number
  spinning: boolean
  digitKey: string
}) {
  const digitHeight = 1.15
  const fullRotations = 6
  const targetIndex = (fullRotations + 1) * 10 + target
  const totalTravel = targetIndex * digitHeight

  const digits = useMemo(() => {
    const arr: number[] = []
    for (let r = 0; r < fullRotations + 1; r++) {
      for (let d = 0; d < 10; d++) {
        arr.push(d)
      }
    }
    for (let d = 0; d <= target; d++) {
      arr.push(d)
    }
    return arr
  }, [target])

  return (
    <span
      className="inline-block overflow-hidden relative align-bottom"
      style={{ height: `${digitHeight}em`, width: '0.65em' }}
    >
      <motion.span
        key={digitKey}
        className="flex flex-col will-change-transform"
        initial={{ y: 0 }}
        animate={spinning ? { y: `-${totalTravel}em` } : { y: 0 }}
        transition={
          spinning
            ? {
                delay: startDelayMs / 1000,
                duration: spinDurationMs / 1000,
                ease: [0.04, 0.62, 0.1, 1],
              }
            : { duration: 0 }
        }
        style={{ lineHeight: `${digitHeight}em` }}
      >
        {digits.map((n, i) => (
          <span key={i} className="block text-center" style={{ height: `${digitHeight}em` }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

// Static character ($ , .)
function StaticChar({ char, delay, spinning }: { char: string; delay: number; spinning: boolean }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0.3 }}
      animate={{ opacity: spinning ? 1 : 0.3 }}
      transition={{ delay: delay * 0.5, duration: 0.3 }}
    >
      {char}
    </motion.span>
  )
}

type OdometerChar =
  | { type: 'digit'; value: number }
  | { type: 'static'; value: string }

function buildOdometerChars(amount: number): OdometerChar[] {
  const formatted = formatJackpotAmount(amount)
  return formatted.split('').map((char) =>
    /\d/.test(char)
      ? { type: 'digit' as const, value: Number(char) }
      : { type: 'static' as const, value: char }
  )
}

// Full odometer display — each column rolls at the same speed, lands right → left
function OdometerAmount({
  amount,
  spinning,
  scale,
  spinDurationMs,
  staggerMs,
}: {
  amount: number
  spinning: boolean
  scale: number
  spinDurationMs: number
  staggerMs: number
}) {
  const chars = useMemo(() => buildOdometerChars(amount), [amount])
  const digitCount = chars.filter((char) => char.type === 'digit').length
  let digitIndex = 0
  const fontSize =
    digitCount > 9
      ? 'clamp(1.1rem, 4.5vw, 3rem)'
      : digitCount > 7
        ? 'clamp(1.3rem, 6vw, 4rem)'
        : 'clamp(1.6rem, 7.5vw, 5rem)'

  return (
    <motion.div
      className="flex items-baseline justify-center font-bold text-white tabular-nums select-none w-full overflow-hidden"
      animate={{ scale }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        fontSize,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
      }}
    >
      {chars.map((c, i) => {
        if (c.type === 'digit') {
          const idx = digitIndex++
          const startDelayMs =
            digitCount > 1 ? (digitCount - 1 - idx) * staggerMs : 0
          return (
            <SpinDigit
              key={`d-${idx}`}
              digitKey={`d-${idx}-${c.value}`}
              target={c.value}
              startDelayMs={startDelayMs}
              spinDurationMs={spinDurationMs}
              spinning={spinning}
            />
          )
        }
        return (
          <StaticChar
            key={`s-${i}-${c.value}`}
            char={c.value}
            delay={digitIndex / Math.max(digitCount, 1)}
            spinning={spinning}
          />
        )
      })}
    </motion.div>
  )
}

interface JackpotOverlayProps {
  visible: boolean
  onClose: () => void
  onShareToChat: () => void
  gameName?: string
  tier?: JackpotTickerTierId
}

export function JackpotOverlay({
  visible,
  onClose,
  onShareToChat,
  gameName = 'Mega Fortune',
  tier = 'mega',
}: JackpotOverlayProps) {
  const [spinning, setSpinning] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [landed, setLanded] = useState(false)
  const [ambientOn, setAmbientOn] = useState(false)
  const [scale, setScale] = useState(0.45)
  const [shake, setShake] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [winAmount, setWinAmount] = useState(0)
  const confettiFired = useRef(false)
  const wasVisibleRef = useRef(false)
  const startMegaWinRoll = useJackpotStore((s) => s.startMegaWinRoll)
  const cancelMegaWinRoll = useJackpotStore((s) => s.cancelMegaWinRoll)

  const fireConfetti = useCallback(() => {
    if (confettiFired.current) return
    confettiFired.current = true
    const defaults = {
      startVelocity: 52,
      spread: 360,
      ticks: 120,
      zIndex: 100000,
      colors: ['#FFD700', '#F5E6A3', '#D4AF37', '#FFF8DC', '#ffffff'],
    }
    confetti({ ...defaults, particleCount: 160, origin: { x: 0.5, y: 0.32 } })
    setTimeout(() => confetti({ ...defaults, particleCount: 90, origin: { x: 0.15, y: 0.42 } }), 120)
    setTimeout(() => confetti({ ...defaults, particleCount: 90, origin: { x: 0.85, y: 0.42 } }), 240)
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 50, angle: 60, spread: 80, origin: { x: 0, y: 0.55 } })
      confetti({ ...defaults, particleCount: 50, angle: 120, spread: 80, origin: { x: 1, y: 0.55 } })
    }, 400)
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 100, startVelocity: 65, origin: { x: 0.5, y: 0.48 } })
    }, 650)
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 80, startVelocity: 48, scalar: 1.2, origin: { x: 0.5, y: 0.6 } })
    }, 950)
  }, [])

  const tierConfig =
    JACKPOT_TICKER_TIERS.find((t) => t.id === tier) ?? JACKPOT_TICKER_TIERS[3]

  useEffect(() => {
    if (wasVisibleRef.current && !visible) {
      fadeOutSound('jackpot-bg', 1400)
    }
    wasVisibleRef.current = visible
  }, [visible])

  useLayoutEffect(() => {
    if (!visible) {
      stopSound('jackpot-win-screen')
      stopSound('jackpot-numbers')
      setSpinning(false)
      setShowCTA(false)
      setLanded(false)
      setAmbientOn(false)
      setScale(0.45)
      setShake(false)
      setFlashOn(false)
      setWinAmount(0)
      confettiFired.current = false
      cancelMegaWinRoll()
      return
    }

    // Drop wheel bed; win screen carries its own looping bg.
    stopSound('jackpot-bg')
    playSound('jackpot-win-screen', { volume: 0.52, loop: true })

    const ambientTimer = setTimeout(() => setAmbientOn(true), 520)

    const tierAmount = useJackpotStore.getState().tickerAmounts[tier]
    const rollDurationMs = getJackpotWinCountUpDurationMs(jackpotAmountDigitCount(tierAmount))
    setWinAmount(tierAmount)

    if (tier === 'mega') {
      useJackpotStore.setState({ lastWinAmount: tierAmount })
      startMegaWinRoll(rollDurationMs, JACKPOT_WIN_COUNTUP_DELAY_MS)
    } else {
      useJackpotStore.getState().registerJackpotWin(tier)
    }

    const t1 = setTimeout(() => {
      setSpinning(true)
      playSound('jackpot-numbers', { volume: 1, loop: true })
    }, JACKPOT_WIN_COUNTUP_DELAY_MS)

    const t2 = setTimeout(() => setScale(0.72), JACKPOT_WIN_COUNTUP_DELAY_MS + rollDurationMs * 0.08)
    const t3 = setTimeout(() => setScale(0.92), JACKPOT_WIN_COUNTUP_DELAY_MS + rollDurationMs * 0.32)
    const t4 = setTimeout(() => setScale(1.02), JACKPOT_WIN_COUNTUP_DELAY_MS + rollDurationMs * 0.58)

    const winLandAt = JACKPOT_WIN_COUNTUP_DELAY_MS + rollDurationMs
    const t5 = setTimeout(() => {
      stopSound('jackpot-numbers')
      setScale(1.12)
      setLanded(true)
      setShake(true)
      setFlashOn(true)
      playSound('final-selection-win', { volume: 1 })
      fireConfetti()
    }, winLandAt)

    const t6 = setTimeout(() => {
      setScale(1.0)
      setShake(false)
      setFlashOn(false)
      setShowCTA(true)
    }, winLandAt + 1200)

    return () => {
      stopSound('jackpot-win-screen')
      stopSound('jackpot-numbers')
      clearTimeout(ambientTimer)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
    }
  }, [visible, tier, fireConfetti, startMegaWinRoll, cancelMegaWinRoll])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Dark backdrop — no warm tint until ambience kicks in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 bg-[#06040c]/95 backdrop-blur-xl"
          />

          {/* Gold flash on jackpot land */}
          <AnimatePresence>
            {flashOn && (
              <motion.div
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-0 z-[100001]"
                style={{
                  background:
                    'radial-gradient(circle at 50% 42%, rgba(255,215,0,0.45) 0%, rgba(212,175,55,0.12) 40%, transparent 68%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Gold rain — delayed so it doesn't bloom orange under the wheel wipe */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: ambientOn ? 1 : 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <GoldRain />
          </motion.div>

          {/* Warm spotlight — single gold tone */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
            <motion.div
              animate={{
                scale: landed ? 2.5 : spinning ? 1.5 : 0.5,
                opacity: ambientOn ? (landed ? 0.32 : spinning ? 0.16 : 0.04) : 0,
              }}
              transition={{ duration: landed ? 0.5 : 1, ease: 'easeOut' }}
              className="w-[400px] h-[400px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.14) 0%, rgba(255,215,0,0.06) 45%, transparent 72%)',
              }}
            />
          </div>

          {/* Main content — slight delay so it appears as the wipe reveals it */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 32 }}
            animate={{
              scale: shake ? [1, 1.02, 0.99, 1.01, 1] : 1,
              opacity: 1,
              y: 0,
            }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{
              scale: shake
                ? { duration: 0.45, ease: 'easeOut' }
                : { duration: 0.55, delay: 0.28, type: 'spring', stiffness: 180, damping: 18 },
              opacity: { duration: 0.55, delay: 0.28 },
              y: { duration: 0.55, delay: 0.28, type: 'spring', stiffness: 180, damping: 18 },
            }}
            className={cn(
              'relative z-10 flex flex-col items-center gap-5 px-4 max-w-xl w-full',
              shake && 'jackpot-win-shake'
            )}
          >
            {/* Headline — gold kicker + white tier; no tier accent colours */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 16 }}
              animate={{
                scale: landed ? [1, 1.04, 1] : 1,
                opacity: 1,
                y: 0,
              }}
              transition={{
                scale: landed ? { duration: 0.5, repeat: 2, ease: 'easeInOut' } : { delay: 0.15, type: 'spring', stiffness: 260, damping: 14 },
                opacity: { delay: 0.15, type: 'spring', stiffness: 260, damping: 14 },
                y: { delay: 0.15, type: 'spring', stiffness: 260, damping: 14 },
              }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-[#D4AF37]/90 sm:text-xs">
                Jackpot Winner
              </p>
              <p className="text-2xl font-bold uppercase tracking-[0.14em] text-white sm:text-3xl">
                {tierConfig.shortLabel} Jackpot
              </p>
            </motion.div>

            {/* Odometer spinning digits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-full"
            >
              <OdometerAmount
                amount={winAmount}
                spinning={spinning}
                scale={scale}
                spinDurationMs={JACKPOT_ODOMETER_SPIN_MS}
                staggerMs={JACKPOT_ODOMETER_STAGGER_MS}
              />
            </motion.div>

            {/* Landed flash */}
            <AnimatePresence>
              {landed && (
                <>
                  <motion.div
                    initial={{ opacity: 0.9, scaleX: 0 }}
                    animate={{ opacity: 0, scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: [0, 1, 0.85], scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-base font-semibold uppercase tracking-[0.35em] text-white/80 sm:text-lg"
                  >
                    You Won
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Game name */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: spinning ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-white/35 text-sm text-center"
            >
              Won on <span className="text-white/55">{gameName}</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: showCTA ? 1 : 0, y: showCTA ? 0 : 16 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mt-1 w-full max-w-xs"
            >
              <button
                onClick={onShareToChat}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all active:scale-[0.97]"
              >
                <IconShare className="w-4 h-4" />
                Share to Chat
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white/50 hover:text-white transition-all active:scale-[0.97]"
              >
                <IconX className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
