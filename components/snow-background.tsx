'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface SnowBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Base flake count */
  count?: number
}

type Flake = {
  x: number
  y: number
  r: number
  speed: number
  drift: number
  opacity: number
  wobble: number
  wobbleSpeed: number
}

/**
 * Soft falling snow backdrop for seasonal Christmas blocks.
 */
export function SnowBackground({
  className,
  children,
  count = 90,
}: SnowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let animationId = 0
    let flakes: Flake[] = []

    const createFlake = (scatter = false): Flake => ({
      x: Math.random() * (width || 1),
      y: scatter ? Math.random() * (height || 1) : -Math.random() * 40,
      r: 0.8 + Math.random() * 2.6,
      speed: 0.35 + Math.random() * 1.1,
      drift: -0.35 + Math.random() * 0.7,
      opacity: 0.25 + Math.random() * 0.55,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.025,
    })

    const resize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      flakes = Array.from({ length: count }, () => createFlake(true))
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      for (const flake of flakes) {
        flake.wobble += flake.wobbleSpeed
        flake.y += flake.speed
        flake.x += flake.drift + Math.sin(flake.wobble) * 0.35

        if (flake.y > height + 8) {
          flake.y = -6
          flake.x = Math.random() * width
        }
        if (flake.x < -8) flake.x = width + 6
        if (flake.x > width + 8) flake.x = -6

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${flake.opacity})`
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2)
        ctx.fill()

        // Soft glow on larger flakes
        if (flake.r > 2) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(220,240,255,${flake.opacity * 0.35})`
          ctx.arc(flake.x, flake.y, flake.r * 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      ro.disconnect()
    }
  }, [count])

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{
        background:
          'linear-gradient(160deg, #0b1a24 0%, #143047 38%, #1a3d32 72%, #0f241c 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />

      {/* Cool mist near the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            'linear-gradient(to top, rgba(12, 28, 36, 0.75) 0%, transparent 100%)',
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, transparent 42%, rgba(6,12,18,0.55) 100%)',
        }}
        aria-hidden
      />

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  )
}
