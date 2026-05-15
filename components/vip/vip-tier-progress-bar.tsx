"use client"

import NumberFlow from "@number-flow/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

const SEGMENT_COUNT = 5

/**
 * Visual flex weights for each tier transition. Lower tiers are quick to grind
 * through; the climb to the top tier should feel like a long road. The widths
 * communicate effort-required at a glance — segment 0→1 is short, segment 4→5
 * is the longest. Using a roughly geometric ramp (≈ ×1.5 per step) so the
 * difference reads clearly without the last bar swallowing the whole row.
 */
const SEGMENT_WEIGHTS = [1, 1.5, 2.25, 3.4, 5.1] as const
const TOTAL_WEIGHT = SEGMENT_WEIGHTS.reduce((s, w) => s + w, 0)

/** Per-segment fill 0–1 so the combined bar visually matches `percent` (0–100) left-to-right. */
function linearSegmentFillsFromPercent(percent: number): number[] {
  const p = Math.min(100, Math.max(0, percent)) / 100
  const target = p * TOTAL_WEIGHT
  const fills: number[] = []
  let consumed = 0
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    const segStart = consumed
    const segEnd = segStart + SEGMENT_WEIGHTS[i]
    const overlap = Math.max(0, Math.min(target, segEnd) - segStart)
    fills.push(SEGMENT_WEIGHTS[i] > 0 ? Math.min(1, overlap / SEGMENT_WEIGHTS[i]) : 0)
    consumed = segEnd
  }
  return fills
}

const ORIGINALS_DEEP_LINK = "/casino?focus=originals"

export type VipTierProgressBarProps = {
  /** Raw progress toward the next tier, 0–100 (single % in “Your progress”). */
  value?: number
  /** Show Originals bonus copy under the bar. */
  showOriginalsNote?: boolean
  /** Compact layout for small cards / carousels. */
  variant?: "default" | "compact"
  /**
   * Remaining wager to reach the next tier (e.g. "$2,750").
   * When set, shows “Until {nextTierLabel}: …” on the right of the stats row.
   */
  wagerRemaining?: string
  /** Next tier name for the wager line (e.g. "Platinum I"). */
  nextTierLabel?: string
  /** Extra-tight Originals footer for narrow carousel tiles (use with `variant="compact"`). */
  bannerTile?: boolean
  className?: string
}

export function VipTierProgressBar({
  value = 0,
  showOriginalsNote = true,
  variant = "default",
  wagerRemaining,
  nextTierLabel = "next tier",
  bannerTile = false,
  className,
}: VipTierProgressBarProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0)

  useEffect(() => {
    const duration = 1400
    const start = performance.now()
    const from = 0
    const to = Math.min(100, Math.max(0, value))

    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setAnimatedPercent(from + (to - from) * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])

  const fills = useMemo(
    () => linearSegmentFillsFromPercent(animatedPercent),
    [animatedPercent],
  )

  const compact = variant === "compact"
  // Pill heights: thin enough to feel modern but still readable inside a 300px
  // banner card. h-1 read as anemic in carousel tiles.
  const segH = compact ? "h-1.5" : "h-2"
  const gap = compact ? "gap-1.5" : "gap-2"
  const showWagerRight = Boolean(wagerRemaining)

  return (
    <div
      className={cn(
        "w-full mt-3",
        // In banner tiles we previously used `justify-between` so the
        // Originals note got pinned to the floor of the 164px card. That
        // produced a yawning gap between the wager line and the divider.
        // Stacking naturally with a small gap reads as one cohesive block
        // and lets the bottom of the card breathe.
        bannerTile && compact && "flex min-h-0 flex-1 flex-col gap-2",
        className,
      )}
    >
      <div
        className={cn(
          bannerTile && compact && "shrink-0",
          "min-w-0",
          !compact && "flex-1",
        )}
      >
        <div
          className={cn(
            "min-w-0",
            compact ? "space-y-0.5" : "space-y-1",
          )}
        >
          <div className={cn("flex min-w-0 flex-1", gap)}>
            {fills.map((fill, i) => (
              <div
                key={i}
                className={cn(
                  "relative min-w-0 overflow-hidden rounded-full bg-white/10",
                  segH,
                )}
                style={{ flex: SEGMENT_WEIGHTS[i] }}
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-600"
                  style={{ boxShadow: "0 0 6px rgba(251, 191, 36, 0.35)" }}
                  initial={false}
                  animate={{ width: `${fill * 100}%` }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                />
              </div>
            ))}
          </div>
          {/* Tier markers — each label sits inside the column matching its bar
              so the numbers always line up with the segment edges, even with
              variable-width bars. The last column also paints "5" at its right
              edge to mark the end of the journey. */}
          <div
            className={cn(
              "flex font-medium tabular-nums text-white/40",
              gap,
              compact ? "text-[9px]" : "text-[10px]",
            )}
          >
            {SEGMENT_WEIGHTS.map((w, i) => (
              <div
                key={i}
                className="flex justify-between leading-none"
                style={{ flex: w }}
              >
                <span>{i}</span>
                {i === SEGMENT_WEIGHTS.length - 1 && (
                  <span>{i + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className={cn(
            compact ? "mt-1.5" : "mt-2",
            "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-white/65",
            compact ? "text-[10px]" : "text-[11px]",
          )}
        >
          <span className="leading-none">
            Your progress:{" "}
            <span className="font-medium tabular-nums text-white/70">
              <NumberFlow value={Math.round(animatedPercent)} />%
            </span>
          </span>
          {showWagerRight ? (
            <span className="leading-none text-right">
              Until {nextTierLabel}:{" "}
              <span className="font-medium tabular-nums text-white/70">
                {wagerRemaining}
              </span>
            </span>
          ) : null}
        </div>
      </div>

      {showOriginalsNote ? (
        <div
          className={cn(
            bannerTile && compact
              ? "border-t border-white/10 pt-2"
              : cn(
                  "mt-2 border-t border-white/10 pt-3",
                  compact ? "text-[10px]" : "text-[11px]",
                ),
          )}
        >
          <p
            className={cn(
              "text-white/50",
              bannerTile && compact
                ? "text-[10px] leading-snug"
                : "leading-snug",
            )}
          >
            Playing{" "}
            <Link
              href={ORIGINALS_DEEP_LINK}
              className="font-medium text-white underline-offset-2 hover:underline"
            >
              Originals
            </Link>{" "}
            Casino games count 25% more toward your level progress.
          </p>
        </div>
      ) : null}
    </div>
  )
}
