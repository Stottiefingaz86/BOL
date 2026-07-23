"use client"

import NumberFlow from "@number-flow/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const ORIGINALS_DEEP_LINK = "/casino?focus=originals"

export type VipTierProgressBarProps = {
  /** Raw progress toward the next tier, 0–100. */
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

  const compact = variant === "compact"
  /** Match VIP hub card: solid crown gold (not amber→orange gradient) */
  const barH = compact ? "h-1.5" : "h-2"
  const barFill = compact
    ? { backgroundColor: "#EAAF6D" }
    : undefined
  const showWagerRight = Boolean(wagerRemaining)
  const roundedPercent = Math.round(animatedPercent)

  return (
    <div
      className={cn(
        "mt-3 w-full",
        bannerTile && compact && "flex min-h-0 flex-1 flex-col gap-2",
        className
      )}
    >
      <div
        className={cn(
          "min-w-0",
          bannerTile && compact && "shrink-0",
          !compact && "flex-1"
        )}
      >
        <div className={cn("flex min-w-0 items-center", compact ? "gap-2" : "gap-2.5")}>
          <div
            className={cn(
              "relative min-w-0 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-[var(--ds-control-hover)]",
              barH
            )}
          >
            <motion.div
              className={cn(
                "h-full rounded-full",
                !compact && "bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500"
              )}
              style={barFill}
              initial={false}
              animate={{ width: `${animatedPercent}%` }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            />
          </div>
          <span
            className={cn(
              "shrink-0 font-medium tabular-nums text-[var(--ds-fg-muted)]",
              compact ? "text-[10px]" : "text-xs"
            )}
          >
            <NumberFlow value={roundedPercent} />%
          </span>
        </div>

        {showWagerRight ? (
          <div
            className={cn(
              compact ? "mt-1.5" : "mt-2",
              "text-white/65",
              compact ? "text-[10px]" : "text-[11px]"
            )}
          >
            <span className="leading-none">
              Until {nextTierLabel}:{" "}
              <span className="font-medium tabular-nums text-[var(--ds-fg-muted)]">
                {wagerRemaining}
              </span>
            </span>
          </div>
        ) : null}
      </div>

      {showOriginalsNote ? (
        <div
          className={cn(
            bannerTile && compact
              ? "border-t border-[var(--ds-border)] pt-2"
              : cn(
                  "mt-2 border-t border-[var(--ds-border)] pt-3",
                  compact ? "text-[10px]" : "text-[11px]"
                )
          )}
        >
          <p
            className={cn(
              "text-[var(--ds-fg-subtle)]",
              bannerTile && compact ? "text-[10px] leading-snug" : "leading-snug"
            )}
          >
            Playing{" "}
            <Link
              href={ORIGINALS_DEEP_LINK}
              className="font-medium text-[var(--ds-fg)] underline-offset-2 hover:underline"
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
