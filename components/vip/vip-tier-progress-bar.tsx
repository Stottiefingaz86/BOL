"use client"

import NumberFlow from "@number-flow/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

const SEGMENT_COUNT = 5

/** Per-segment fill 0–1 so the combined bar visually matches `percent` (0–100) left-to-right. */
function linearSegmentFillsFromPercent(percent: number): number[] {
  const p = Math.min(100, Math.max(0, percent)) / 100
  const fills: number[] = []
  const span = 1 / SEGMENT_COUNT
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    const segStart = i * span
    const segEnd = segStart + span
    const overlap = Math.max(0, Math.min(p, segEnd) - segStart)
    fills.push(span > 0 ? Math.min(1, overlap / span) : 0)
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
  const segH = compact ? "h-2" : "h-2.5"
  const gap = compact ? "gap-1.5" : "gap-2.5"
  const showWagerRight = Boolean(wagerRemaining)

  return (
    <div
      className={cn(
        "w-full mt-3",
        bannerTile &&
          compact &&
          "flex min-h-0 flex-1 flex-col justify-between gap-0",
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
                  "relative min-w-0 flex-1 overflow-hidden rounded-full bg-white/10",
                  segH,
                )}
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
          <div
            className={cn(
              "flex justify-between font-medium tabular-nums text-white/40",
              compact ? "text-[9px] px-px" : "text-[10px] px-0.5",
            )}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <span key={n}>{n}</span>
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
              ? "mt-auto border-t border-white/10 pt-1.5 pb-0"
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
                ? "text-[9px] leading-tight"
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
