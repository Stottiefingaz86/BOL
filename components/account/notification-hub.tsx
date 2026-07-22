"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  IconBallFootball,
  IconBellRinging,
  IconCrown,
  IconCurrencyDollar,
  IconDice,
  IconDots,
  IconGift,
  IconSettings,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

type NotificationItem = {
  id: string
  title: string
  description: string
  timeLabel: string
  unread: boolean
  type?: "default" | "vip-progress" | "vip-cash" | "feature-cta" | "reward-cta"
  progressLabel?: string
  progressValue?: number
  ctaLabel?: string
  ctaAction?: "claim_reward" | "open_vip_benefits" | "launch_game_of_week" | "open_poker" | "open_mystery_wheel"
}

const STORAGE_KEY = "bol-notification-hub-v3"
const PREFERENCES_STORAGE_KEY = "bol-notification-preferences-v1"

type CampaignKey = "casino" | "sports" | "poker" | "vip" | "promotions"
type ChannelKey = "push" | "email" | "sms"

type NotificationPreferences = {
  channels: Record<ChannelKey, boolean>
  campaigns: Record<CampaignKey, boolean>
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  channels: {
    push: true,
    email: true,
    sms: true,
  },
  campaigns: {
    casino: true,
    sports: true,
    poker: true,
    vip: true,
    promotions: true,
  },
}

const CHANNELS: { key: ChannelKey; label: string }[] = [
  { key: "push", label: "Push" },
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
]

const CAMPAIGNS: { key: CampaignKey; label: string }[] = [
  { key: "casino", label: "Casino" },
  { key: "sports", label: "Sports" },
  { key: "poker", label: "Poker" },
  { key: "vip", label: "VIP" },
  { key: "promotions", label: "Promotions" },
]

function getCampaignForItem(item: NotificationItem): CampaignKey {
  const text = `${item.title} ${item.description}`.toLowerCase()
  if (text.includes("poker")) return "poker"
  if (text.includes("vip") || item.type === "vip-progress" || item.type === "vip-cash") return "vip"
  if (text.includes("sport") || text.includes("bet")) return "sports"
  if (text.includes("casino") || text.includes("spin") || text.includes("slot")) return "casino"
  return "promotions"
}

function parsePreferences(value: string | null): NotificationPreferences {
  if (!value) return DEFAULT_PREFERENCES
  try {
    const parsed = JSON.parse(value) as Partial<NotificationPreferences>
    return {
      channels: {
        push: parsed.channels?.push ?? DEFAULT_PREFERENCES.channels.push,
        email: parsed.channels?.email ?? DEFAULT_PREFERENCES.channels.email,
        sms: parsed.channels?.sms ?? DEFAULT_PREFERENCES.channels.sms,
      },
      campaigns: {
        casino: parsed.campaigns?.casino ?? DEFAULT_PREFERENCES.campaigns.casino,
        sports: parsed.campaigns?.sports ?? DEFAULT_PREFERENCES.campaigns.sports,
        poker: parsed.campaigns?.poker ?? DEFAULT_PREFERENCES.campaigns.poker,
        vip: parsed.campaigns?.vip ?? DEFAULT_PREFERENCES.campaigns.vip,
        promotions: parsed.campaigns?.promotions ?? DEFAULT_PREFERENCES.campaigns.promotions,
      },
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

function resolveProgressDefaults(item: NotificationItem): { progressValue: number; progressLabel: string } {
  if (typeof item.progressValue === "number" && item.progressLabel) {
    return { progressValue: item.progressValue, progressLabel: item.progressLabel }
  }

  if (item.title.toLowerCase().includes("can't stop now")) {
    return { progressValue: 94, progressLabel: "Diamond I to Black II" }
  }
  if (item.title.toLowerCase().includes("awesome")) {
    return { progressValue: 82, progressLabel: "Gold to Platinum I" }
  }
  return { progressValue: 62, progressLabel: "Gold to Platinum I" }
}

function hydrateNotificationTemplates(item: NotificationItem): NotificationItem {
  const hasProgressToken =
    /\{\{\s*CustomerVIPLevelProgress\s*\}\}/i.test(item.title) ||
    /\{\{\s*CustomerVIPLevelProgress\s*\}\}/i.test(item.description)

  const defaults = resolveProgressDefaults(item)
  const progressValue =
    typeof item.progressValue === "number" ? item.progressValue : defaults.progressValue
  const progressLabel = item.progressLabel ?? defaults.progressLabel
  const currentLevel = progressLabel.split(" to ")[0] ?? "Gold"
  const nextLevel = progressLabel.split(" to ")[1] ?? "Platinum I"

  const replaceTokens = (value: string) =>
    value
      .replace(/\{\{\s*CustomerVIPLevelProgress\s*\}\}/g, String(progressValue))
      .replace(/\{\{\s*CustomerVIPLevelNext\s*\}\}/g, nextLevel)
      .replace(/\{\{\s*Level\s*\}\}/g, currentLevel)
      .replace(/\$\{\{\s*Amount1\s*\}\}/g, "250")
      .replace(/\$\{\{\s*Amount\s*\}\}/g, "250")
      .replace(/\{\{\s*Amount\s*\}\}/g, "250")
      .replace(/\{\{\s*CashFreeBet\s*\}\}/g, "Cash Bonus")
      .replace(/\{\{\s*PromoTitle\s*\}\}/g, "VIP Reward")
      .replace(/\{\{\s*rank\s*\}\}/g, "3")
      .replace(/\{\{\s*prize\s*\}\}/g, "500")

  return {
    ...item,
    title: replaceTokens(item.title),
    description: replaceTokens(item.description),
    type: hasProgressToken ? "vip-progress" : item.type,
    progressValue: hasProgressToken ? progressValue : item.progressValue,
    progressLabel: hasProgressToken ? progressLabel : item.progressLabel,
  }
}

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Your Casino Reward Awaits!",
    description:
      "Click below to claim now. No deposit required, no hidden terms, and no rollover. Your Free Cash expires in 5 days.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-2",
    title: "You've scored a Free Bet in our Sportsbook",
    description:
      "Claim it now. No deposit required, no hidden terms, and no rollover requirements. Your Free Bet expires in 5 days.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-3",
    title: "New to Sports?",
    description: "Your entry to the action is one click away. Claim your Free Bet and start betting.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-4",
    title: "New to Casino?",
    description: "Your adventure starts now. Redeem your free cash boost with no strings attached.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-5",
    title: "Collect Your Poker Tournament Tickets",
    description:
      "1) Open Poker, 2) Cashier > Promo Code, 3) Enter WINDFALLS, 4) Redeem from Cashier > View Tickets.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "View tickets",
    ctaAction: "open_poker",
  },
  {
    id: "n-6",
    title: "Collect Your Courtesy Racebook Bet",
    description:
      "We've credited a $5 courtesy bet. Pick your track, back your horse, and cheer it home to the finish line.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-7",
    title: "Countdown Started - Don't Miss Out!",
    description: "Free funds were added to your account with no strings attached. Redeem now.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-8",
    title: "Your Exclusive Reward is Ready to Claim",
    description:
      "Claim now. No deposit required, no hidden terms, no rollover. Your Free Casino Cash expires in 5 days.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-9",
    title: "New to Poker? Claim These Tickets",
    description:
      "Visit Poker, hit Download/Play Online, then Cashier > Promo Code and enter POKERNOW. Click View Tickets.",
    timeLabel: "Aug 07, 2025",
    unread: false,
    ctaLabel: "View tickets",
    ctaAction: "open_poker",
  },
  {
    id: "n-10",
    title: "Free Bet at the Sportsbook",
    description: "Keep the action going! Your account has been awarded a Free Bet for your next wager.",
    timeLabel: "Sep 17, 2025",
    unread: false,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-11",
    title: "Free Cash at the Casino",
    description: "Keep the excitement alive! Your account has been awarded Free Cash for your next play.",
    timeLabel: "Sep 17, 2025",
    unread: false,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-12",
    title: "Your Reward is Waiting!",
    description: "You haven't redeemed your bonus yet. Claim it before it expires.",
    timeLabel: "Sep 17, 2025",
    unread: false,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-13",
    title: "Your Reward is About to Expire",
    description: "Your bonus remains unclaimed. Use it before it's gone.",
    timeLabel: "Sep 17, 2025",
    unread: false,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-14",
    title: "Congratulations!",
    description:
      "Welcome to {{Level}} VIP Status! Your exclusive Level Up Cash Bonus, with no rollover requirements, is now available.",
    timeLabel: "Nov 22, 2024",
    unread: false,
    type: "vip-cash",
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-15",
    title: "Congratulations!",
    description:
      "Welcome to {{Level}} VIP Status. You now have access to your own personal VIP Host.",
    timeLabel: "Nov 22, 2024",
    unread: false,
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-16",
    title: "VIP Progress",
    description: "Congrats on advancing toward Platinum I with 62% progress.",
    timeLabel: "Apr 11, 2025",
    unread: false,
    type: "vip-progress",
    progressLabel: "Gold to Platinum I",
    progressValue: 62,
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-17",
    title: "Awesome!",
    description: "You've reached 82% progress toward Platinum I VIP status.",
    timeLabel: "Apr 11, 2025",
    unread: false,
    type: "vip-progress",
    progressLabel: "Gold to Platinum I",
    progressValue: 82,
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-18",
    title: "Can't Stop Now!",
    description: "You are so close at 94%! Hurry to unlock Black II rewards.",
    timeLabel: "Apr 11, 2025",
    unread: false,
    type: "vip-progress",
    progressLabel: "Diamond I to Black II",
    progressValue: 94,
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-19",
    title: "Daily Cash Race Winner!",
    description: "You've claimed the #{{rank}} spot and won ${{prize}} in Cash!",
    timeLabel: "Jun 24, 2024",
    unread: false,
  },
  {
    id: "n-20",
    title: "Game of the Week is live! 🎮",
    description: "Jump into this week's featured casino title and test your luck.",
    timeLabel: "Today",
    unread: false,
    type: "feature-cta",
    ctaLabel: "Launch game",
    ctaAction: "launch_game_of_week",
  },
  {
    id: "n-21",
    title: "Claim your level-up reward",
    description: "Your VIP level-up reward is ready. Claim now to move your balance up instantly.",
    timeLabel: "Today",
    unread: false,
    type: "reward-cta",
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-22",
    title: "Collect Your Poker Tournament Tickets",
    description: "Enjoy an exclusive promo code that unlocks free tournament tickets!",
    timeLabel: "Aug 07, 2025",
    unread: false,
    ctaLabel: "View tickets",
    ctaAction: "open_poker",
  },
  {
    id: "n-23",
    title: "Reward Successfully Claimed",
    description:
      "${{Amount}} ${{CashFreeBet}} has been credited to your account as part of the promotion.",
    timeLabel: "Aug 27, 2024",
    unread: false,
  },
  {
    id: "n-24",
    title: "20 Free Spins Added",
    description: "You have been given 20 free spins on a casino game.",
    timeLabel: "Today",
    unread: true,
    type: "feature-cta",
    ctaLabel: "Play now",
    ctaAction: "launch_game_of_week",
  },
  {
    id: "n-25",
    title: "On the 1st Day of Christmas",
    description: "Your $25 cash reward is ready to claim.",
    timeLabel: "Today",
    unread: true,
    type: "reward-cta",
    ctaLabel: "Claim $25",
    ctaAction: "claim_reward",
  },
]

function ensureRequiredNotifications(items: NotificationItem[]): NotificationItem[] {
  const freeSpins = SEED_NOTIFICATIONS.find((item) => item.id === "n-24")
  const christmasStreak = SEED_NOTIFICATIONS.find((item) => item.id === "n-25")
  const withoutRequired = items.filter((item) => item.id !== "n-24" && item.id !== "n-25" && item.id !== "n-26")
  const required: NotificationItem[] = []
  if (freeSpins) required.push(hydrateNotificationTemplates(freeSpins))
  if (christmasStreak) required.push(hydrateNotificationTemplates(christmasStreak))
  return [...required, ...withoutRequired]
}

export function NotificationHub() {
  const isMobile = useIsMobile()
  const [tab, setTab] = useState<"all" | "unread">("all")
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [mysteryWheelNotificationId, setMysteryWheelNotificationId] = useState<string | null>(null)
  const [claimAlertMessage, setClaimAlertMessage] = useState<string | null>(null)
  const [items, setItems] = useState<NotificationItem[]>(() =>
    ensureRequiredNotifications(SEED_NOTIFICATIONS.map(hydrateNotificationTemplates)),
  )
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as NotificationItem[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        setItems(ensureRequiredNotifications(parsed.map(hydrateNotificationTemplates)))
      }
    } catch {
      // Ignore malformed local storage.
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const parsed = parsePreferences(window.localStorage.getItem(PREFERENCES_STORAGE_KEY))
    setPreferences(parsed)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
    window.dispatchEvent(
      new CustomEvent("notification:preferences-updated", {
        detail: preferences,
      }),
    )
  }, [preferences])

  const campaignCounts = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          const key = getCampaignForItem(item)
          acc[key] += 1
          return acc
        },
        { casino: 0, sports: 0, poker: 0, vip: 0, promotions: 0 } as Record<CampaignKey, number>,
      ),
    [items],
  )

  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items])
  const filteredItems = useMemo(
    () => (tab === "unread" ? items.filter((item) => item.unread) : items),
    [items, tab],
  )
  const groupedItems = useMemo(() => {
    const groups = {
      today: [] as NotificationItem[],
      yesterday: [] as NotificationItem[],
      last7: [] as NotificationItem[],
    }

    filteredItems.forEach((item) => {
      const time = item.timeLabel.toLowerCase()
      if (
        time.includes("today") ||
        time.includes("just now") ||
        time.includes("min ago") ||
        time.includes("hour ago")
      ) {
        groups.today.push(item)
      } else if (time.includes("yesterday")) {
        groups.yesterday.push(item)
      } else {
        groups.last7.push(item)
      }
    })

    return [
      { label: "Today", items: groups.today },
      { label: "Yesterday", items: groups.yesterday },
      { label: "Last 7 Days", items: groups.last7 },
    ].filter((group) => group.items.length > 0)
  }, [filteredItems])

  const toggleChannelPreference = (key: ChannelKey) => {
    setPreferences((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [key]: !prev.channels[key],
      },
    }))
  }

  const toggleCampaignPreference = (key: CampaignKey) => {
    setPreferences((prev) => ({
      ...prev,
      campaigns: {
        ...prev.campaigns,
        [key]: !prev.campaigns[key],
      },
    }))
  }

  const openVipBenefits = () => {
    if (typeof window === "undefined") return
    window.dispatchEvent(new CustomEvent("notification:open-vip-benefits"))
  }

  const launchGameOfWeek = () => {
    if (typeof window === "undefined") return
    window.dispatchEvent(
      new CustomEvent("notification:launch-game-of-week", {
        detail: {
          game: {
            title: "Game of the Week",
            image: "/banners/casino/casino_banner1.svg",
            provider: "Dragon Gaming",
            features: ["Weekly featured title", "Bonus rounds enabled"],
          },
        },
      }),
    )
  }

  const claimReward = (id: string) => {
    setItems((prev) => {
      const source = prev.find((item) => item.id === id)
      const amountFromCta = source?.ctaLabel?.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/)?.[1]
      const amountFromDescription = source?.description.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/)?.[1]
      const amount = Number(amountFromCta ?? amountFromDescription ?? "250")

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("notification:claim-reward", {
            detail: { amount },
          }),
        )
      }

      const isChristmasReward = source?.id === "n-25" || source?.title.toLowerCase().includes("1st day of christmas")
      setClaimAlertMessage(`Reward claimed! +$${amount.toFixed(2)} added to your balance.`)
      window.setTimeout(() => setClaimAlertMessage(null), 2200)

      return [
        {
          id: `claimed-${Date.now()}`,
          title: isChristmasReward ? "Christmas Reward Successfully Claimed" : "Reward Successfully Claimed",
          description: `$${amount.toFixed(2)} has been credited to your account as part of the promotion.`,
          timeLabel: "just now",
          unread: true,
        },
        ...prev.filter((item) => item.id !== id),
      ]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id))
  }

  const notificationCtaClass =
    "mt-3 h-9 rounded-small bg-[var(--ds-primary,#ee3536)] px-4 text-xs font-semibold text-white hover:bg-[var(--ds-primary-hover,#d92d2f)]"

  const resolveCta = (
    item: NotificationItem,
  ): { label: string; action: NonNullable<NotificationItem["ctaAction"]> } | null => {
    if (item.ctaLabel && item.ctaAction) {
      return { label: item.ctaLabel, action: item.ctaAction }
    }
    if (item.type === "vip-progress" || item.type === "vip-cash") {
      return { label: "Check my benefits", action: "open_vip_benefits" }
    }
    if (item.type === "feature-cta") {
      return { label: "Launch game", action: "launch_game_of_week" }
    }
    if (item.type === "reward-cta") {
      return { label: "Claim reward", action: "claim_reward" }
    }
    if (item.title.toLowerCase().includes("poker tournament tickets")) {
      return { label: "View tickets", action: "open_poker" }
    }
    return null
  }

  const runCta = (item: NotificationItem, action: NonNullable<NotificationItem["ctaAction"]>) => {
    if (action === "claim_reward") {
      claimReward(item.id)
      return
    }
    if (action === "open_vip_benefits") {
      openVipBenefits()
      return
    }
    if (action === "launch_game_of_week") {
      launchGameOfWeek()
      return
    }
    if (action === "open_poker") {
      if (typeof window !== "undefined") window.location.href = "/poker"
      return
    }
    if (action === "open_mystery_wheel") {
      setMysteryWheelNotificationId(item.id)
    }
  }

  const markAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    )
  }

  const renderAvatar = (item: NotificationItem) => {
    const text = `${item.title} ${item.description}`.toLowerCase()
    if (item.type === "vip-progress" || item.type === "vip-cash" || text.includes("platinum") || text.includes("vip")) {
      return (
        <div className="h-10 w-10 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-hover)] flex items-center justify-center">
          <IconCrown className="h-5 w-5 text-[#c4ad30]" />
        </div>
      )
    }
    if (text.includes("deposit") || text.includes("bitcoin")) {
      return (
        <div className="h-10 w-10 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-hover)] flex items-center justify-center">
          <IconCurrencyDollar className="h-5 w-5 text-[var(--ds-fg-muted)]" />
        </div>
      )
    }
    if (text.includes("free spin") || text.includes("spin")) {
      return (
        <div className="h-10 w-10 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-hover)] flex items-center justify-center">
          <IconDice className="h-5 w-5 text-[var(--ds-fg-muted)]" />
        </div>
      )
    }
    if (text.includes("sport") || text.includes("bet")) {
      return (
        <div className="h-10 w-10 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-hover)] flex items-center justify-center">
          <IconBallFootball className="h-5 w-5 text-[var(--ds-fg-muted)]" />
        </div>
      )
    }
    if (text.includes("reward") || text.includes("bonus")) {
      return (
        <div className="h-10 w-10 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-hover)] flex items-center justify-center">
          <IconGift className="h-5 w-5 text-[var(--ds-fg-muted)]" />
        </div>
      )
    }
    return (
      <div className="h-10 w-10 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-hover)] flex items-center justify-center">
        <IconBellRinging className="h-5 w-5 text-[var(--ds-fg-muted)]" />
      </div>
    )
  }

  return (
    <div className="mb-2">
      <AnimatePresence>
        {claimAlertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="mb-3 rounded-small border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300"
          >
            {claimAlertMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setPreferencesOpen((prev) => !prev)}
            className={cn(
              "h-8 w-8 shrink-0 rounded-full border border-[var(--ds-border)] bg-[var(--ds-control-bg)] text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg)]",
              preferencesOpen && "border-[var(--ds-primary,#ee3536)] text-[var(--ds-primary,#ee3536)]",
            )}
            aria-label="Notification preferences"
            title="Notification preferences"
          >
            <IconSettings className="h-4 w-4" />
          </Button>
          <div className="inline-flex w-fit max-w-full items-center rounded-full bg-[var(--ds-control-hover)] p-1">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={cn(
              "inline-flex h-8 min-w-[96px] items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors appearance-none focus:outline-none",
              tab === "all"
                ? "bg-[var(--ds-primary,#ee3536)] text-white shadow-sm"
                : "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]",
            )}
          >
            <span>All</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("unread")}
            className={cn(
              "inline-flex h-8 min-w-[96px] items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors appearance-none focus:outline-none",
              tab === "unread"
                ? "bg-[var(--ds-primary,#ee3536)] text-white shadow-sm"
                : "text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)]",
            )}
          >
            <span>Unread</span>
            <span className={cn(
              "inline-flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11px] leading-none",
              tab === "unread" ? "bg-[var(--ds-surface-muted)] text-[var(--ds-fg)]" : "bg-[var(--ds-control-hover)] text-[var(--ds-fg-muted)]"
            )}>
              {unreadCount}
            </span>
          </button>
          </div>
        </div>
        {preferencesOpen && (
          <div className="rounded-small border border-[var(--ds-border)] bg-[var(--ds-control-bg)] p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--ds-fg)]">Notification preferences</p>
              <p className="text-xs text-[var(--ds-fg-subtle)]">Manage channels and campaign topics</p>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-small bg-[var(--ds-overlay)] p-3.5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ds-fg-subtle)]">Channels</p>
                <div className="space-y-2">
                  {CHANNELS.map((channel) => (
                    <div key={channel.key} className="flex items-center justify-between gap-3 py-0.5">
                      <span className="text-sm text-[var(--ds-fg-muted)]">{channel.label}</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={preferences.channels[channel.key]}
                        onClick={() => toggleChannelPreference(channel.key)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                          preferences.channels[channel.key] ? "bg-[var(--ds-primary,#ee3536)]" : "bg-[var(--ds-surface-muted)]",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                            preferences.channels[channel.key] ? "translate-x-5" : "translate-x-0.5",
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-small bg-[var(--ds-overlay)] p-3.5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ds-fg-subtle)]">Campaigns</p>
                <div className="space-y-2">
                  {CAMPAIGNS.map((campaign) => (
                    <div key={campaign.key} className="flex items-center justify-between gap-3 py-0.5">
                      <span className="min-w-0 text-sm text-[var(--ds-fg-muted)]">
                        {campaign.label}
                        <span className="ml-1 whitespace-nowrap text-xs text-[var(--ds-fg-subtle)]">({campaignCounts[campaign.key]})</span>
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={preferences.campaigns[campaign.key]}
                        onClick={() => toggleCampaignPreference(campaign.key)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                          preferences.campaigns[campaign.key] ? "bg-[var(--ds-primary,#ee3536)]" : "bg-[var(--ds-surface-muted)]",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                            preferences.campaigns[campaign.key] ? "translate-x-5" : "translate-x-0.5",
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-visible">
        {groupedItems.map((group) => (
          <section key={group.label} className="mb-4">
            <h4 className="mb-1 text-[15px] font-semibold leading-6 text-[var(--ds-fg-subtle)]">{group.label}</h4>
            <div className="overflow-hidden rounded-small border border-[var(--ds-control-border)] bg-[var(--ds-overlay)]">
              <AnimatePresence initial={false}>
                {group.items.map((item) => {
                  const cta = resolveCta(item)
                  return (
                    <motion.div
                      key={item.id}
                      layout="position"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className={cn(
                        "group relative border-b border-[var(--ds-border)] last:border-b-0 transition-colors duration-200 hover:bg-[var(--ds-control-bg)]/70",
                        isMobile
                          ? (activeMenuId === item.id ? "overflow-visible" : "overflow-hidden")
                          : "overflow-visible",
                        activeMenuId === item.id && "z-30"
                      )}
                      onTouchStart={(e) => {
                        if (!isMobile) return
                        const touch = e.touches[0]
                        const el = e.currentTarget
                        el.dataset.startX = touch.clientX.toString()
                        el.dataset.startY = touch.clientY.toString()
                        el.dataset.swiping = "0"
                        el.dataset.translateX = "0"
                        setActiveMenuId(null)
                      }}
                      onTouchMove={(e) => {
                        if (!isMobile) return
                        const el = e.currentTarget
                        const startX = parseFloat(el.dataset.startX || "0")
                        const startY = parseFloat(el.dataset.startY || "0")
                        const touch = e.touches[0]
                        const dx = touch.clientX - startX
                        const dy = touch.clientY - startY
                        const swiping = el.dataset.swiping || "0"
                        const inner = el.querySelector("[data-notification-inner]") as HTMLElement | null
                        const reveal = el.querySelector("[data-notification-remove]") as HTMLElement | null
                        if (!inner || !reveal) return

                        // Lock to vertical scroll unless we detect a clear horizontal swipe.
                        if (swiping === "0") {
                          if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx) * 1.2) {
                            el.dataset.swiping = "vertical"
                            return
                          }
                          if (dx < -10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
                            el.dataset.swiping = "1"
                          }
                        }

                        if (el.dataset.swiping === "1") {
                          e.preventDefault()
                          const clamped = Math.max(Math.min(dx, 0), -92)
                          el.dataset.translateX = String(clamped)
                          inner.style.transform = `translateX(${clamped}px)`
                          inner.style.transition = "none"
                          reveal.style.opacity = `${Math.min(1, Math.abs(clamped) / 40)}`
                        }
                      }}
                      onTouchEnd={(e) => {
                        if (!isMobile) return
                        const el = e.currentTarget
                        const swiping = el.dataset.swiping || "0"
                        const translatedX = parseFloat(el.dataset.translateX || "0")
                        const inner = el.querySelector("[data-notification-inner]") as HTMLElement | null
                        const reveal = el.querySelector("[data-notification-remove]") as HTMLElement | null
                        if (!inner || !reveal) return

                        if (swiping === "1" && translatedX < -58) {
                          inner.style.transition = "transform 0.18s ease-out"
                          inner.style.transform = "translateX(-100%)"
                          window.setTimeout(() => removeItem(item.id), 180)
                        } else {
                          inner.style.transition = "transform 0.18s ease-out"
                          inner.style.transform = "translateX(0)"
                          reveal.style.opacity = "0"
                        }
                        el.dataset.swiping = "0"
                        el.dataset.translateX = "0"
                      }}
                      onTouchCancel={(e) => {
                        if (!isMobile) return
                        const el = e.currentTarget
                        const inner = el.querySelector("[data-notification-inner]") as HTMLElement | null
                        const reveal = el.querySelector("[data-notification-remove]") as HTMLElement | null
                        if (!inner || !reveal) return
                        inner.style.transition = "transform 0.18s ease-out"
                        inner.style.transform = "translateX(0)"
                        reveal.style.opacity = "0"
                        el.dataset.swiping = "0"
                        el.dataset.translateX = "0"
                      }}
                    >
                      <div
                        data-notification-remove
                        className="pointer-events-none absolute right-0 top-2 bottom-2 flex w-24 items-center justify-center rounded-small bg-red-500 text-white opacity-0 transition-opacity"
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-wide">Delete</span>
                      </div>

                      <div data-notification-inner className="relative z-10 w-full bg-transparent px-3 py-4 transition-colors duration-200 group-hover:bg-[var(--ds-overlay)]">
                      <button
                        type="button"
                        className="absolute right-0 top-4 h-8 w-8 rounded-full flex items-center justify-center text-[var(--ds-fg-subtle)] hover:bg-[var(--ds-control-hover)] hover:text-[var(--ds-fg-muted)]"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuId((prev) => (prev === item.id ? null : item.id))
                        }}
                        aria-label="More actions"
                      >
                        <IconDots className="h-4 w-4" />
                      </button>
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 top-12 z-[90] w-56 rounded-small border border-[var(--ds-border)] bg-[var(--ds-surface-raised)] p-2 shadow-lg">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-small px-3 py-2 text-left text-[15px] font-medium text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                            onClick={() => {
                              markAsRead(item.id)
                              setActiveMenuId(null)
                            }}
                          >
                            <span>Mark as read</span>
                            {!item.unread && <span className="text-[#0f6fff]">✓</span>}
                          </button>
                          <button
                            type="button"
                            className="mt-1 w-full rounded-small px-3 py-2 text-left text-[15px] font-medium text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                            onClick={() => {
                              removeItem(item.id)
                              setActiveMenuId(null)
                            }}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="mt-1 w-full rounded-small px-3 py-2 text-left text-[15px] font-medium text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                            onClick={() => {
                              setPreferencesOpen(true)
                              setActiveMenuId(null)
                            }}
                          >
                            Turn off notifications
                          </button>
                        </div>
                      )}

                      <div className="flex items-start gap-3 pr-9">
                        {renderAvatar(item)}
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-[var(--ds-fg)] leading-snug">{item.title}</p>
                          <p className="mt-1 text-[13px] leading-[1.4] text-[var(--ds-fg-muted)]">{item.description}</p>

                          {item.type === "vip-progress" && (
                            <div className="mt-3 rounded-small bg-[var(--ds-control-hover)] p-3.5">
                              <div className="mb-2 text-sm font-semibold text-[var(--ds-fg-muted)]">
                                {item.progressLabel ?? "Gold to Platinum I"}
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress value={item.progressValue ?? 45} className="h-2 bg-[var(--ds-control-hover)] [&>div]:bg-[#c4ad30]" />
                                <span className="text-sm font-semibold text-[var(--ds-fg-muted)]">{item.progressValue ?? 45}%</span>
                              </div>
                            </div>
                          )}

                          {cta && (
                            <Button
                              variant="ghost"
                              onClick={() => runCta(item, cta.action)}
                              className={notificationCtaClass}
                            >
                              {cta.label}
                            </Button>
                          )}

                          <p className="mt-2 text-xs text-[var(--ds-fg-subtle)]">{item.timeLabel}</p>
                        </div>
                      </div>
                      {item.unread && <div className="absolute right-2 top-11 h-2.5 w-2.5 rounded-full bg-[#ee3536]" />}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </section>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="mt-8 rounded-small border border-dashed border-[var(--ds-border)] bg-[var(--ds-control-bg)] p-6 text-center">
          <IconBellRinging className="mx-auto mb-2 h-5 w-5 text-[var(--ds-fg-subtle)]" />
          <p className="text-sm font-medium text-[var(--ds-fg-muted)]">No notifications</p>
          <p className="mt-1 text-xs text-[var(--ds-fg-subtle)]">You are all caught up.</p>
        </div>
      )}

      <AnimatePresence>
        {mysteryWheelNotificationId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10060] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setMysteryWheelNotificationId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-sm rounded-small border border-[var(--ds-border)] bg-[var(--ds-page-bg)] p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-base font-semibold text-[var(--ds-fg)]">Mystery Wheel</p>
              <p className="mt-1 text-sm text-[var(--ds-fg-muted)]">
                Spin now to reveal your 5-day streak reward.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="h-9 rounded-small border border-[var(--ds-border-strong)] bg-[var(--ds-control-bg)] px-4 text-sm font-semibold text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)]"
                  onClick={() => setMysteryWheelNotificationId(null)}
                >
                  Close
                </Button>
                <Button
                  className="h-9 rounded-small bg-[var(--ds-primary,#ee3536)] px-4 text-sm font-semibold text-white hover:bg-[var(--ds-primary-hover,#d92d2f)]"
                  onClick={() => {
                    setMysteryWheelNotificationId(null)
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("notification:open-mystery-wheel"))
                    }
                  }}
                >
                  Spin now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

