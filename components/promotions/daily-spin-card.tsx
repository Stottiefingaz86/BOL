"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { IconRefresh } from "@tabler/icons-react"
import { VipLoggedOutCta } from "@/components/vip/vip-logged-out-cta"
import { useAuthSession } from "@/hooks/use-auth-session"
import { cn } from "@/lib/utils"

/**
 * The full wheel popup is heavy (canvas-confetti + per-frame canvas) — load it
 * lazily so the VIP drawer Overview tab stays snappy. We intentionally skip
 * SSR because the popup uses framer-motion and confetti, both browser-only.
 */
const DailySpinPopup = dynamic(
  () => import("./daily-spin-popup").then((m) => m.DailySpinPopup),
  { ssr: false },
)

// ─── Brand tokens ──────────────────────────────────────────────────────────
// The card now mirrors the neutral grey/glass surface used by the rest of the
// VIP drawer (matches `bg-white/5 border-white/10` on the progress card). The
// only brand colour on the card is the red Spin CTA + a subtle red glow on
// hover so it reads as the primary action without painting the whole tile.
const BRAND_RED = "#ee3536"           // betRed/500
const BRAND_RED_DARK = "#cf2228"      // betRed/800 — hover state

export type DailySpinCardProps = {
  className?: string
  /** Tighter padding/typography for narrow side panels. */
  compact?: boolean
}

/**
 * Compact "Daily Spin" entry-point that launches the existing wheel popup.
 * Designed to slot in under the VIP tier progress card in side panels and
 * mirror the visual rhythm of the surrounding drawer cards.
 */
export function DailySpinCard({ className, compact = true }: DailySpinCardProps) {
  const [open, setOpen] = useState(false)
  const { isLoggedIn } = useAuthSession()

  return (
    <>
      <div
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 text-left transition-all",
          isLoggedIn && "hover:border-[#ee3536]/40 hover:bg-white/[0.07] hover:shadow-[0_0_24px_rgba(238,53,54,0.18)]",
          compact ? "p-3" : "p-4",
          className,
        )}
      >
        <motion.div
          animate={isLoggedIn ? { rotate: [0, 8, -8, 0] } : { rotate: 0 }}
          transition={{
            duration: 4,
            repeat: isLoggedIn ? Infinity : 0,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1],
          }}
          className={cn(
            "flex flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/70 transition-colors",
            isLoggedIn && "group-hover:bg-[#ee3536]/15 group-hover:text-[#ee3536]",
            compact ? "h-9 w-9" : "h-11 w-11",
          )}
        >
          <IconRefresh
            className={compact ? "h-4 w-4" : "h-5 w-5"}
            strokeWidth={2.4}
          />
        </motion.div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-semibold text-white",
              compact ? "text-xs" : "text-sm",
            )}
          >
            Daily Spin
          </p>
          <p
            className={cn(
              "leading-snug text-white/45",
              compact ? "text-[10px]" : "text-xs",
            )}
          >
            One free spin every day for cash prizes.
          </p>
        </div>

        {isLoggedIn ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "flex-shrink-0 rounded-lg font-semibold uppercase tracking-wide text-white transition-colors",
              compact ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs",
            )}
            style={{
              background: BRAND_RED,
              boxShadow: `0 4px 14px ${BRAND_RED}40`,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = BRAND_RED_DARK
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = BRAND_RED
            }}
            aria-label="Open daily spin"
          >
            Spin
          </button>
        ) : (
          <div className={cn("flex-shrink-0", compact ? "w-[88px]" : "w-[96px]")}>
            <VipLoggedOutCta compact className="!h-auto !py-1.5 !text-[10px] !normal-case !tracking-normal" />
          </div>
        )}
      </div>

      {isLoggedIn && (
        <DailySpinPopup
          visible={open}
          onClose={() => setOpen(false)}
          onClaim={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default DailySpinCard
