"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconBallFootball,
  IconClock,
  IconDice,
  IconFlame,
  IconGift,
  IconHash,
  IconMessageCircle2,
  IconNews,
  IconPlus,
  IconSearch,
  IconTrendingUp,
  IconUserCircle,
  IconUsersGroup,
  IconArrowBigUp,
  IconArrowBigDown,
} from "@tabler/icons-react"
import {
  addCommunityForumPost,
  COMMUNITY_FORUM_EVENT,
  type CommunityForumPost,
  readCommunityForumPosts,
} from "@/lib/community/forum"
import { useChatStore } from "@/lib/store/chatStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BrandLogoPlaceholder } from '@/components/brand/brand-logo-placeholder'

const topNavItems = [
  { label: "Forum", href: "/community", icon: IconMessageCircle2 },
  { label: "Casino", href: "/casino", icon: IconDice },
  { label: "Sportsbook", href: "/sports/soccer/premier-league", icon: IconBallFootball },
  { label: "Blog", href: "/journey-map", icon: IconNews },
]

const feedTabs = ["Hot", "New", "Top", "Bookmarked"]

const channels = [
  { name: "announcements", count: 22 },
  { name: "rewards-drop", count: 14 },
  { name: "daily-races", count: 31 },
  { name: "casino-tournaments", count: 19 },
  { name: "bet-slips", count: 55 },
  { name: "big-wins", count: 48 },
  { name: "support", count: 8 },
]

const onlineNow = ["DaveMason", "HighRoller_Mike", "OddsQueen", "BigWinBenny", "ParlaySharks", "VladanV"]

const events = [
  "Mon - Challenge Kickoff",
  "Wed - Expert AMA",
  "Fri - Community Fun Thread",
  "Sun - Race Leaderboard Reset",
]
const currentUserName = "Christopher"
const COMMUNITY_BOOKMARKS_KEY = "community_forum_bookmarks_v1"

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function getPostTitle(post: CommunityForumPost) {
  if (post.type === "bet-share") return "Bet Slip Shared"
  const trimmed = post.content.trim()
  if (trimmed.length <= 72) return trimmed
  return `${trimmed.slice(0, 72)}...`
}

function getPostBody(post: CommunityForumPost) {
  if (post.type === "bet-share") return post.content
  if (post.content.length <= 180) return post.content
  return `${post.content.slice(0, 180)}...`
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityForumPost[]>([])
  const [draft, setDraft] = useState("")
  const [activeFeedTab, setActiveFeedTab] = useState("Hot")
  const [channel, setChannel] = useState("announcements")
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([])
  const { setIsOpen, setActiveRoom } = useChatStore()

  useEffect(() => {
    setActiveRoom("sports")
    setIsOpen(true)
    setPosts(readCommunityForumPosts())
    const sync = () => setPosts(readCommunityForumPosts())
    window.addEventListener(COMMUNITY_FORUM_EVENT, sync as EventListener)
    window.addEventListener("storage", sync as EventListener)
    return () => {
      window.removeEventListener(COMMUNITY_FORUM_EVENT, sync as EventListener)
      window.removeEventListener("storage", sync as EventListener)
    }
  }, [setActiveRoom, setIsOpen])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMMUNITY_BOOKMARKS_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as string[]
      if (Array.isArray(parsed)) setBookmarkedPostIds(parsed)
    } catch {}
  }, [])

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [posts]
  )

  const bookmarkedSet = useMemo(() => new Set(bookmarkedPostIds), [bookmarkedPostIds])

  const scorePost = (post: CommunityForumPost) => {
    const managerBonus = post.author.toLowerCase().includes("manager") ? 18 : 0
    const betShareBonus = post.type === "bet-share" ? 12 : 0
    const contentScore = Math.min(28, Math.floor(post.content.length / 14))
    return managerBonus + betShareBonus + contentScore
  }

  const hotScore = (post: CommunityForumPost) => {
    const ageHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60)
    return scorePost(post) + Math.max(0, 36 - ageHours * 2.2)
  }

  const channelFilteredPosts = useMemo(() => {
    const matchesChannel = (post: CommunityForumPost) => {
      const text = `${post.content} ${post.betSlip?.legs.map((leg) => `${leg.event} ${leg.selection}`).join(" ") || ""}`.toLowerCase()
      if (channel === "announcements") return post.author.toLowerCase().includes("manager")
      if (channel === "rewards-drop") return text.includes("reward") || text.includes("vip")
      if (channel === "daily-races") return text.includes("race") || text.includes("leaderboard")
      if (channel === "casino-tournaments") return text.includes("tournament") || text.includes("casino")
      if (channel === "bet-slips") return post.type === "bet-share"
      if (channel === "big-wins") return text.includes("win") || text.includes("cash")
      if (channel === "support") return text.includes("help") || text.includes("support")
      return true
    }
    return sortedPosts.filter(matchesChannel)
  }, [sortedPosts, channel])

  const visiblePosts = useMemo(() => {
    if (activeFeedTab === "New") {
      return [...channelFilteredPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    if (activeFeedTab === "Top") {
      return [...channelFilteredPosts].sort((a, b) => scorePost(b) - scorePost(a))
    }
    if (activeFeedTab === "Bookmarked") {
      return channelFilteredPosts.filter((post) => bookmarkedSet.has(post.id))
    }
    // Hot (default)
    return [...channelFilteredPosts].sort((a, b) => hotScore(b) - hotScore(a))
  }, [activeFeedTab, channelFilteredPosts, bookmarkedSet])

  const trending = useMemo(() => sortedPosts.slice(0, 4), [sortedPosts])

  const submitPost = () => {
    const text = draft.trim()
    if (!text) return
    addCommunityForumPost({
      id: `community-${Date.now()}`,
      author: currentUserName,
      source: "community",
      type: "discussion",
      content: text,
      createdAt: new Date().toISOString(),
    })
    setDraft("")
  }

  const toggleBookmark = (postId: string) => {
    setBookmarkedPostIds((prev) => {
      const next = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      try {
        localStorage.setItem(COMMUNITY_BOOKMARKS_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a] text-white font-figtree">
      <div className="border-b border-white/10 bg-[#2d2d2d]">
        <div className="w-full px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href="/sports/soccer/premier-league"
                className="h-8 w-8 rounded-small border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0"
              >
                <IconArrowLeft className="w-4 h-4 text-white/80" />
              </Link>
              <div className="flex items-center gap-2 min-w-0 shrink-0">
                <BrandLogoPlaceholder variant="full" />
                <span className="text-sm font-semibold text-white/80 whitespace-nowrap">
                  Community
                </span>
              </div>
              <div className="bg-white/5 p-0.5 rounded-3xl hidden md:inline-flex items-center gap-1 ml-2">
                {topNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "px-4 py-1.5 h-8 text-xs font-medium rounded-2xl whitespace-nowrap inline-flex items-center gap-1.5",
                      item.label === "Forum"
                        ? "bg-[#ee3536] text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="h-8 w-8 rounded-small border border-white/20 bg-transparent text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center"
                title="Open Chat"
              >
                <IconMessageCircle2 className="w-4 h-4" />
              </button>
              <div className="h-8 px-3 rounded-small border border-white/20 bg-transparent text-white/85 text-xs font-semibold inline-flex items-center">
                {currentUserName}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-4 h-[calc(100vh-76px)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-4 h-full min-h-0">
          <Card className="border-white/10 bg-[#242424] h-fit lg:h-full lg:overflow-y-auto">
            <CardContent className="p-3.5">
              <div className="mb-3">
                <div className="text-[11px] uppercase tracking-wide text-white/50 mb-1">Channels</div>
                <div className="space-y-1">
                  {channels.map((ch) => (
                    <button
                      key={ch.name}
                      onClick={() => setChannel(ch.name)}
                      className={cn(
                        "w-full rounded-small px-2.5 py-2 text-left text-sm flex items-center justify-between transition-colors",
                        channel === ch.name
                          ? "bg-[#ee3536]/20 text-white border border-[#ee3536]/30"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <IconHash className="w-3.5 h-3.5" />
                        {ch.name}
                      </span>
                      <span className="text-xs text-white/50">{ch.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] uppercase tracking-wide text-white/50 mb-1">
                  Quick Access
                </div>
                <div className="space-y-1 text-sm text-white/70">
                  <p className="inline-flex items-center gap-1.5">
                    <IconGift className="w-3.5 h-3.5 text-amber-300" />
                    Rewards Drops
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <IconTrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                    Trending Threads
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 text-sky-300" />
                    Daily Race Updates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="min-h-0 h-full overflow-y-auto pr-1">
            <Card className="border-white/10 bg-[#232323] mb-3">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-amber-300">
                    <IconFlame className="w-3.5 h-3.5" />
                    Discover Feed
                  </div>
                  <div className="inline-flex items-center gap-1 bg-white/5 p-0.5 rounded-3xl">
                    {feedTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveFeedTab(tab)}
                        className={cn(
                          "h-7 px-3 rounded-2xl text-xs font-semibold inline-flex items-center justify-center leading-none",
                          activeFeedTab === tab
                            ? "bg-[#ee3536] text-white"
                            : "text-white/75 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-small border border-white/10 bg-[#262626] p-3">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Post in #${channel}... share slips, wins, race progress, or questions.`}
                    className="w-full h-20 resize-none bg-transparent outline-none text-sm text-white/90 placeholder:text-white/35"
                    maxLength={600}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-white/50">{visiblePosts.length} live discussions</span>
                    <Button
                      onClick={submitPost}
                      className="h-8 text-xs font-semibold bg-[#ee3536] hover:bg-[#d62e30] text-white"
                    >
                      <IconPlus className="w-3.5 h-3.5 mr-1" />
                      Create Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {visiblePosts.length === 0 && (
                <Card className="border-white/10 bg-[#242424]">
                  <CardContent className="p-5 text-center text-sm text-white/60">
                    No posts in this filter yet.
                  </CardContent>
                </Card>
              )}
              {visiblePosts.map((post) => (
                <Card key={post.id} className="border-white/10 bg-[#242424]">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[56px_minmax(0,1fr)]">
                      <div className="border-r border-white/10 p-2.5 flex flex-col items-center gap-1 bg-[#202020]">
                        <button className="text-white/45 hover:text-white transition-colors">
                          <IconArrowBigUp className="w-5 h-5" />
                        </button>
                        <span className="text-xs font-semibold text-white/70">
                          {post.type === "bet-share" ? "42" : "18"}
                        </span>
                        <button className="text-white/45 hover:text-white transition-colors">
                          <IconArrowBigDown className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-3.5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-[#313131] flex items-center justify-center">
                              <IconUserCircle className="w-4 h-4 text-white/70" />
                            </div>
                            <span className="text-sm font-semibold truncate">{post.author}</span>
                            <span className="text-[10px] uppercase tracking-wide text-white/45">
                              {post.author.toLowerCase().includes("manager") ? "manager" : "member"}
                            </span>
                          </div>
                          <span className="text-[11px] text-white/45 whitespace-nowrap">{formatTime(post.createdAt)}</span>
                        </div>

                        <h3 className="text-base font-semibold mb-1">
                          <Link href={`/community/post/${post.id}`} className="hover:text-[#ee3536] transition-colors">
                            {getPostTitle(post)}
                          </Link>
                        </h3>
                        <p className="text-sm text-white/80">{getPostBody(post)}</p>

                        {post.betSlip && (
                          <div className="mt-2.5 rounded-small border border-emerald-400/30 bg-emerald-500/10 p-2.5">
                            <div className="text-[11px] font-semibold text-emerald-300 mb-1">
                              {post.betSlip.type === "parlay" ? "Parlay Bet Share" : "Single Bet Share"}
                            </div>
                            {post.betSlip.legs.map((leg, i) => (
                              <div key={`${post.id}-${i}`} className="text-xs text-white/85">
                                <span className="text-white/60">{leg.event}:</span> {leg.selection} ({leg.odds})
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-3 text-xs text-white/55">
                          <Link href={`/community/post/${post.id}`} className="hover:text-white transition-colors">
                            Reply
                          </Link>
                          <button className="hover:text-white transition-colors">Share</button>
                          <button
                            onClick={() => toggleBookmark(post.id)}
                            className={cn(
                              "transition-colors",
                              bookmarkedSet.has(post.id) ? "text-amber-300 hover:text-amber-200" : "hover:text-white"
                            )}
                          >
                            {bookmarkedSet.has(post.id) ? "Bookmarked" : "Bookmark"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3 h-fit lg:h-full lg:overflow-y-auto">
            <Card className="border-white/10 bg-[#242424]">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <IconSearch className="w-4 h-4 text-white/65" />
                  <h3 className="text-sm font-semibold">Trending Discussions</h3>
                </div>
                <div className="space-y-2">
                  {trending.map((post) => (
                    <Link
                      key={`trend-${post.id}`}
                      href={`/community/post/${post.id}`}
                      className="w-full text-left rounded-small p-2 bg-white/[0.03] hover:bg-white/[0.07] transition-colors"
                    >
                      <p className="text-sm font-medium truncate">{getPostTitle(post)}</p>
                      <p className="text-xs text-white/55 mt-0.5">by {post.author}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#242424]">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <IconUsersGroup className="w-4 h-4 text-emerald-300" />
                  <h3 className="text-sm font-semibold">Online Now</h3>
                </div>
                <div className="space-y-1.5">
                  {onlineNow.map((name) => (
                    <div key={name} className="text-sm text-white/80 inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#242424]">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <IconClock className="w-4 h-4 text-amber-300" />
                  <h3 className="text-sm font-semibold">Events This Week</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-white/80">
                  {events.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
