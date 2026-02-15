'use client'

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { IconShare, IconX, IconTrophy } from '@tabler/icons-react'

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

    const colors = ['#FFD700', '#FFA500', '#FFDF00', '#DAA520', '#FFB347', '#E8B923']

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.setTransform(2, 0, 0, 2, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
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

// Single spinning digit column — spins through many full rotations then lands
function SpinDigit({ target, delay, spinning }: { target: number; delay: number; spinning: boolean }) {
  const digitHeight = 1.15 // em per digit
  // Each digit spins through 3 full cycles (0-9) + lands on target
  const fullRotations = 3
  const totalTravel = (fullRotations * 10 + target) * digitHeight

  // Build a long strip: repeated 0-9 sets + final landing digits
  const digits = useMemo(() => {
    const arr: number[] = []
    for (let r = 0; r < fullRotations + 1; r++) {
      for (let d = 0; d < 10; d++) {
        arr.push(d)
      }
    }
    // Add the final target at the end
    for (let d = 0; d <= target; d++) {
      arr.push(d)
    }
    return arr
  }, [target])

  return (
    <span
      className="inline-block overflow-hidden relative"
      style={{ height: `${digitHeight}em`, width: '0.6em' }}
    >
      <motion.span
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={spinning ? { y: `-${totalTravel}em` } : { y: 0 }}
        transition={spinning ? {
          delay,
          duration: 1.6 + delay * 0.5,
          ease: [0.2, 0.8, 0.2, 1], // fast start, dramatic deceleration
        } : { duration: 0 }}
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

// Full odometer display — $250,000.00
function OdometerAmount({ spinning, scale }: { spinning: boolean; scale: number }) {
  // $250,000.00
  const chars: Array<{ type: 'digit'; value: number } | { type: 'static'; value: string }> = [
    { type: 'static', value: '$' },
    { type: 'digit', value: 2 },
    { type: 'digit', value: 5 },
    { type: 'digit', value: 0 },
    { type: 'static', value: ',' },
    { type: 'digit', value: 0 },
    { type: 'digit', value: 0 },
    { type: 'digit', value: 0 },
    { type: 'static', value: '.' },
    { type: 'digit', value: 0 },
    { type: 'digit', value: 0 },
  ]

  let digitIndex = 0

  return (
    <motion.div
      className="flex items-baseline justify-center font-bold text-white tabular-nums select-none w-full overflow-hidden"
      animate={{ scale }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        fontSize: 'clamp(1.6rem, 7.5vw, 5rem)',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
      }}
    >
      {chars.map((c, i) => {
        if (c.type === 'digit') {
          const idx = digitIndex++
          // Stagger: leftmost digit has most delay (lands last), rightmost lands first
          // Total digits = 8, so delay goes from 0.7 for first to 0 for last
          const totalDigits = 8
          const staggerDelay = ((totalDigits - 1 - idx) / (totalDigits - 1)) * 0.6
          return (
            <SpinDigit
              key={i}
              target={c.value}
              delay={staggerDelay}
              spinning={spinning}
            />
          )
        }
        return (
          <StaticChar
            key={i}
            char={c.value}
            delay={digitIndex / 8}
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
}

export function JackpotOverlay({ visible, onClose, onShareToChat, gameName = 'Mega Fortune' }: JackpotOverlayProps) {
  const [spinning, setSpinning] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [landed, setLanded] = useState(false)
  const [scale, setScale] = useState(0.6)
  const confettiFired = useRef(false)

  const fireConfetti = useCallback(() => {
    if (confettiFired.current) return
    confettiFired.current = true
    const defaults = { startVelocity: 40, spread: 360, ticks: 100, zIndex: 100000, colors: ['#FFD700', '#FFA500', '#FFDF00', '#DAA520', '#fff', '#ee3536'] }
    confetti({ ...defaults, particleCount: 100, origin: { x: 0.5, y: 0.35 } })
    setTimeout(() => confetti({ ...defaults, particleCount: 50, origin: { x: 0.2, y: 0.45 } }), 200)
    setTimeout(() => confetti({ ...defaults, particleCount: 50, origin: { x: 0.8, y: 0.45 } }), 400)
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 30, angle: 60, origin: { x: 0, y: 0.6 } })
      confetti({ ...defaults, particleCount: 30, angle: 120, origin: { x: 1, y: 0.6 } })
    }, 600)
    // Extra burst
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 60, startVelocity: 55, origin: { x: 0.5, y: 0.5 } })
    }, 900)
  }, [])

  useEffect(() => {
    if (!visible) {
      setSpinning(false)
      setShowCTA(false)
      setLanded(false)
      setScale(0.6)
      confettiFired.current = false
      return
    }

    // Phase 1: Start spinning after intro (0.4s)
    const t1 = setTimeout(() => {
      setSpinning(true)
    }, 400)

    // Phase 2: Scale up as digits spin (staggered)
    const t2 = setTimeout(() => setScale(0.75), 600)
    const t3 = setTimeout(() => setScale(0.9), 1200)
    const t4 = setTimeout(() => setScale(1.0), 1800)

    // Phase 3: All digits landed — final scale + confetti (around 3s total)
    const t5 = setTimeout(() => {
      setScale(1.05)
      setLanded(true)
      fireConfetti()
    }, 3000)

    // Phase 4: Show CTAs
    const t6 = setTimeout(() => {
      setScale(1.0)
      setShowCTA(true)
    }, 3400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
    }
  }, [visible, fireConfetti])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Gold rain */}
          <GoldRain />

          {/* Radial glow — pulses on land */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
            <motion.div
              animate={{
                scale: landed ? 2.5 : spinning ? 1.5 : 0.5,
                opacity: landed ? 0.45 : spinning ? 0.25 : 0.05,
              }}
              transition={{ duration: landed ? 0.5 : 1, ease: 'easeOut' }}
              className="w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, rgba(238,53,54,0.1) 50%, transparent 70%)' }}
            />
          </div>

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 180, damping: 18 }}
            className="relative z-10 flex flex-col items-center gap-5 px-4 max-w-xl w-full"
          >
            {/* Trophy */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm overflow-hidden">
                <img src="/banners/yay.gif" alt="Jackpot!" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* JACKPOT label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-white/40">
                Jackpot Winner
              </h2>
            </motion.div>

            {/* Odometer spinning digits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-full"
            >
              <OdometerAmount spinning={spinning} scale={scale} />
            </motion.div>

            {/* Landed flash */}
            <AnimatePresence>
              {landed && (
                <motion.div
                  initial={{ opacity: 0.8, scaleX: 0 }}
                  animate={{ opacity: 0, scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-64 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                />
              )}
            </AnimatePresence>

            {/* Game name */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: spinning ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-white/40 text-sm text-center"
            >
              Won on <span className="text-white/70 font-medium">{gameName}</span>
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
