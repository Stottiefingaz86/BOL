'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconArrowLeft,
  IconHome,
  IconBallFootball,
  IconDeviceGamepad2,
  IconWallet,
  IconCrown,
  IconChevronRight,
  IconChevronDown,
  IconCards,
  IconClick,
  IconTrophy,
  IconUser,
  IconCheck,
  IconPlayerPlay,
  IconBolt,
  IconTicket,
  IconArrowRight,
  IconCurrencyDollar,
  IconCircleCheck,
  IconFlame,
  IconTrash,
  IconCamera,
  IconClock,
  IconEye,
  IconSearch,
  IconX,
  IconRefresh,
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconBrowser,
  IconReceipt,
  IconStar,
  IconDiamond,
  IconPlayCard,
  IconTarget,
  IconUsers,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useTrackingStore, type FlowSnapshot, type FlowEdge, type PageStat, type TrackingEvent, type DateRange, type DateRangeFilter, type DeviceInfo, filterEventsByDateRange, computePageStats, computeFlowEdges, computeTopActions, computeSessionFlows } from '@/lib/store/trackingStore'

// ─── Page color & icon map ───────────────────────────────────────────

const PAGE_META: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  // ── Core pages ──
  home:             { color: '#6366f1', icon: IconHome,             label: 'Home' },
  casino:           { color: '#a855f7', icon: IconDeviceGamepad2,   label: 'Casino' },
  sports:           { color: '#22c55e', icon: IconBallFootball,     label: 'Sports' },
  account:          { color: '#06b6d4', icon: IconUser,             label: 'Account' },
  poker:            { color: '#f97316', icon: IconCards,             label: 'Poker' },
  'vip-rewards':    { color: '#fbbf24', icon: IconCrown,            label: 'VIP Rewards' },
  'live-betting':   { color: '#ef4444', icon: IconFlame,            label: 'Live Betting' },
  'live-casino':    { color: '#ef4444', icon: IconFlame,            label: 'Live Casino' },
  deposit:          { color: '#ee3536', icon: IconWallet,           label: 'Deposit' },
  'deposit-drawer': { color: '#ee3536', icon: IconWallet,           label: 'Deposit' },
  'vip-hub':        { color: '#fbbf24', icon: IconCrown,            label: 'Overview' },
  'account-drawer': { color: '#06b6d4', icon: IconUser,             label: 'My Account' },
  'game-launch':    { color: '#a855f7', icon: IconDeviceGamepad2,   label: 'Game' },
  library:          { color: '#8b5cf6', icon: IconEye,              label: 'Library' },
  'journey-map':    { color: '#ec4899', icon: IconClick,            label: 'Journey Map' },
  // ── Casino sub-nav ──
  'casino/for-you':     { color: '#a855f7', icon: IconStar,              label: 'For You' },
  'casino/slots':       { color: '#a855f7', icon: IconDeviceGamepad2,    label: 'Slots' },
  'casino/bonus-buys':  { color: '#a855f7', icon: IconDiamond,           label: 'Bonus Buys' },
  'casino/megaways':    { color: '#a855f7', icon: IconBolt,              label: 'Megaways' },
  'casino/originals':   { color: '#a855f7', icon: IconStar,              label: 'Originals' },
  'casino/blackjack':   { color: '#a855f7', icon: IconPlayCard,          label: 'Blackjack' },
  'casino/live':        { color: '#ef4444', icon: IconFlame,             label: 'Live Casino' },
  'casino/jackpots':    { color: '#fbbf24', icon: IconCrown,             label: 'Jackpots' },
  'casino/new':         { color: '#22c55e', icon: IconBolt,              label: 'New Games' },
  'casino/early':       { color: '#a855f7', icon: IconEye,               label: 'Early Access' },
  'casino/staff-picks': { color: '#a855f7', icon: IconStar,              label: 'Staff Picks' },
  'casino/exclusive':   { color: '#fbbf24', icon: IconDiamond,           label: 'Exclusive' },
  // ── Sports sub-nav ──
  'my-bets':            { color: '#06b6d4', icon: IconReceipt,           label: 'My Bets' },
  'bet-placed':         { color: '#22c55e', icon: IconCheck,             label: 'Bet Placed' },
  'sports/events':      { color: '#22c55e', icon: IconBallFootball,      label: 'Events' },
  'sports/live':        { color: '#ef4444', icon: IconFlame,             label: 'Live' },
  'sports/promos':      { color: '#fbbf24', icon: IconTicket,            label: 'Promos' },
  'sports/boosts':      { color: '#f97316', icon: IconBolt,              label: 'Boosts' },
}

// ── Smart page meta lookup — handles exact matches and prefix/parent fallbacks ──
function getPageMeta(page: string) {
  // Exact match
  if (PAGE_META[page]) return PAGE_META[page]
  // For dynamic sport sub-pages like "sports/football" — capitalize and use sports color
  if (page.startsWith('sports/')) {
    const sportName = page.split('/')[1]
    const label = sportName.charAt(0).toUpperCase() + sportName.slice(1).replace(/-/g, ' ')
    return { color: '#22c55e', icon: IconBallFootball, label }
  }
  // For dynamic casino sub-pages not in the map
  if (page.startsWith('casino/')) {
    const subName = page.split('/')[1]
    const label = subName.charAt(0).toUpperCase() + subName.slice(1).replace(/-/g, ' ')
    return { color: '#a855f7', icon: IconDeviceGamepad2, label }
  }
  return { color: '#64748b', icon: IconCircleCheck, label: page }
}

// ─── Relative time helper ────────────────────────────────────────────

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Clustered Flow Diagram — parent nodes with orbiting sub-pages ────

// Define which pages belong to which cluster
function getCluster(page: string): string {
  if (page === 'casino' || page === 'game-launch' || page === 'live-casino' || page.startsWith('casino/')) return 'casino'
  if (page === 'sports' || page === 'my-bets' || page === 'bet-placed' || page === 'live-betting' || page.startsWith('sports/')) return 'sports'
  if (page === 'account' || page === 'account-drawer') return 'account'
  if (page === 'deposit' || page === 'deposit-drawer') return 'deposit'
  if (page === 'vip-rewards' || page === 'vip-hub') return 'vip'
  return page // standalone (home, poker, library, etc.)
}

// The "parent" page for each cluster (the big node)
const CLUSTER_PARENTS: Record<string, string> = {
  casino: 'casino',
  sports: 'sports',
  account: 'account',
  deposit: 'deposit',
  vip: 'vip-rewards',
}

function LiveFlowDiagram({
  flowEdges,
  pageStats,
}: {
  flowEdges: FlowEdge[]
  pageStats: PageStat[]
  events: TrackingEvent[]
}) {
  const canvasW = 900
  const canvasH = 560
  const [hovered, setHovered] = useState<string | null>(null)
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const totalViews = pageStats.reduce((s, p) => s + p.views, 0)

  // Build clusters from actual data
  const { clusters, clusterList, standalonePages } = useMemo(() => {
    const clusterMap = new Map<string, { parent: string; children: string[]; totalViews: number }>()
    const standalone: string[] = []

    for (const ps of pageStats) {
      const cluster = getCluster(ps.page)
      const parent = CLUSTER_PARENTS[cluster]

      if (parent) {
        if (!clusterMap.has(cluster)) {
          clusterMap.set(cluster, { parent, children: [], totalViews: 0 })
        }
        const c = clusterMap.get(cluster)!
        c.totalViews += ps.views
        if (ps.page !== parent) {
          c.children.push(ps.page)
        }
      } else {
        standalone.push(ps.page)
      }
    }
    return {
      clusters: clusterMap,
      clusterList: Array.from(clusterMap.entries()),
      standalonePages: standalone,
    }
  }, [pageStats])

  // Aggregate inter-cluster edges
  const { interEdges, intraEdges } = useMemo(() => {
    const inter = new Map<string, { from: string; to: string; count: number }>()
    const intra: FlowEdge[] = []

    for (const edge of flowEdges) {
      const fromCluster = getCluster(edge.from)
      const toCluster = getCluster(edge.to)

      if (fromCluster === toCluster) {
        intra.push(edge)
      } else {
        const fromParent = CLUSTER_PARENTS[fromCluster] || edge.from
        const toParent = CLUSTER_PARENTS[toCluster] || edge.to
        const key = `${fromParent}→${toParent}`
        const existing = inter.get(key)
        if (existing) existing.count += edge.count
        else inter.set(key, { from: fromParent, to: toParent, count: edge.count })
      }
    }
    return { interEdges: Array.from(inter.values()), intraEdges: intra }
  }, [flowEdges])

  const maxInterEdge = Math.max(1, ...interEdges.map((e) => e.count))

  // Compute parent orb radii — compact, capped so they don't dominate
  const parentOrbRadius = useMemo(() => {
    const radii: Record<string, number> = {}
    for (const [id, cluster] of clusterList) {
      const childCount = cluster.children.length
      // Compact scaling: starts at 40, grows slowly, hard cap at 90
      radii[cluster.parent] = childCount > 0
        ? Math.min(90, 40 + childCount * 4)
        : 24
    }
    return radii
  }, [clusterList])

  // Position top-level nodes (parents + standalones)
  // Children are positioned INSIDE the parent circle
  const allNodes = useMemo(() => {
    const topLevel = [
      ...clusterList.map(([, c]) => c.parent),
      ...standalonePages,
    ]

    const cx = canvasW / 2
    const cy = canvasH / 2
    const positions: Record<string, {
      x: number; y: number; isChild: boolean
      cluster: string | null; size: number; orbRadius?: number
    }> = {}

    // Home at center, others in a ring
    const homeIdx = topLevel.indexOf('home')
    const outerRadius = Math.min(cx - 100, cy - 90)

    if (homeIdx >= 0) {
      positions['home'] = { x: cx, y: cy, isChild: false, cluster: null, size: 28 }
      const others = topLevel.filter((p) => p !== 'home')
      others.forEach((page, i) => {
        const angle = ((2 * Math.PI) / others.length) * i - Math.PI / 2
        const orb = parentOrbRadius[page] || 22
        positions[page] = {
          x: cx + Math.cos(angle) * outerRadius,
          y: cy + Math.sin(angle) * outerRadius,
          isChild: false,
          cluster: getCluster(page) !== page ? getCluster(page) : null,
          size: orb, // size = the orb radius for parents
          orbRadius: orb,
        }
      })
    } else {
      topLevel.forEach((page, i) => {
        const angle = ((2 * Math.PI) / topLevel.length) * i - Math.PI / 2
        const orb = parentOrbRadius[page] || 22
        positions[page] = {
          x: cx + Math.cos(angle) * outerRadius,
          y: cy + Math.sin(angle) * outerRadius,
          isChild: false,
          cluster: null,
          size: orb,
          orbRadius: orb,
        }
      })
    }

    // Position children INSIDE their parent — tight ring
    for (const [clusterId, cluster] of clusterList) {
      const parentPos = positions[cluster.parent]
      if (!parentPos || cluster.children.length === 0) continue

      const orbR = parentPos.orbRadius || 50
      // Children orbit at ~65% of orb radius so they stay well inside
      const childRingR = orbR * 0.6

      cluster.children.forEach((child, i) => {
        const angle = ((2 * Math.PI) / cluster.children.length) * i - Math.PI / 2
        // Small fixed size for children — just dots with labels
        const childSize = 5 + Math.min(3, ((pageStats.find((s) => s.page === child)?.views || 0) / Math.max(1, totalViews)) * 20)

        positions[child] = {
          x: parentPos.x + Math.cos(angle) * childRingR,
          y: parentPos.y + Math.sin(angle) * childRingR,
          isChild: true,
          cluster: clusterId,
          size: childSize,
        }
      })
    }

    return positions
  }, [clusterList, standalonePages, pageStats, totalViews, parentOrbRadius])

  // Draggable positions
  const [positions, setPositions] = useState(allNodes)
  useEffect(() => { setPositions(allNodes) }, [allNodes])

  const handleMouseDown = useCallback((page: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragging.current = page
    const pos = positions[page]
    if (!pos || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = canvasW / rect.width
    const scaleY = canvasH / rect.height
    dragOffset.current = { x: e.clientX * scaleX - pos.x, y: e.clientY * scaleY - pos.y }
  }, [positions])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = canvasW / rect.width
    const scaleY = canvasH / rect.height
    let nx = e.clientX * scaleX - dragOffset.current.x
    let ny = e.clientY * scaleY - dragOffset.current.y

    setPositions((prev) => {
      const draggedPage = dragging.current!
      const node = prev[draggedPage]
      if (!node) return prev

      // ── Child being dragged: constrain inside parent orb ──
      if (node.isChild && node.cluster) {
        const parentPage = CLUSTER_PARENTS[node.cluster]
        const parentPos = prev[parentPage]
        if (parentPos) {
          const orbR = parentPos.orbRadius || 50
          const maxChildR = orbR - node.size - 3
          const dx = nx - parentPos.x
          const dy = ny - parentPos.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > maxChildR) {
            nx = parentPos.x + (dx / dist) * maxChildR
            ny = parentPos.y + (dy / dist) * maxChildR
          }
        }
        return { ...prev, [draggedPage]: { ...node, x: nx, y: ny } }
      }

      // ── Parent / standalone being dragged ──
      nx = Math.max(80, Math.min(canvasW - 80, nx))
      ny = Math.max(80, Math.min(canvasH - 80, ny))
      const deltaX = nx - node.x
      const deltaY = ny - node.y

      // Move the parent itself
      const updated: typeof prev = {
        ...prev,
        [draggedPage]: { ...node, x: nx, y: ny },
      }

      // If this is a cluster parent, move ALL children by the same delta
      const clusterId = getCluster(draggedPage)
      if (clusters.has(clusterId)) {
        const cluster = clusters.get(clusterId)!
        for (const childPage of cluster.children) {
          const childPos = prev[childPage]
          if (childPos) {
            updated[childPage] = {
              ...childPos,
              x: childPos.x + deltaX,
              y: childPos.y + deltaY,
            }
          }
        }
      }

      return updated
    })
  }, [clusters])

  const handleMouseUp = useCallback(() => { dragging.current = null }, [])

  if (pageStats.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] p-12 text-center" style={{ backgroundColor: '#1a1a1a' }}>
        <IconClick className="w-10 h-10 text-white/15 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white/40 mb-1">No Flow Data Yet</h3>
        <p className="text-xs text-white/30 max-w-sm mx-auto">
          Browse the site to start tracking — the flow map builds itself from your real navigation.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-emerald-500/10 overflow-hidden relative" style={{ backgroundColor: '#1a1a1a', animation: 'live-border-glow 4s ease-in-out infinite' }}>
      {/* Scanning line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden live-scan-line z-10" />
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold text-white">Live Flow Map</h3>
            <p className="text-[10px] text-white/25 mt-0.5">
              {clusterList.length + standalonePages.length} nodes · {interEdges.length} cross-flows · click cluster to expand · drag to rearrange
            </p>
          </div>
        </div>
        {expandedCluster && (
          <button
            onClick={() => setExpandedCluster(null)}
            className="text-[9px] px-2 py-1 rounded-md bg-white/[0.06] text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        )}
      </div>

      {/* Canvas */}
      <div className="relative" style={{ cursor: dragging.current ? 'grabbing' : 'default' }}>
        <style>{`
          @keyframes tentacleFlow { to { stroke-dashoffset: -20; } }
          @keyframes orbPulse { 0%, 100% { opacity: 0.04; } 50% { opacity: 0.08; } }
          @keyframes childFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
        `}</style>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <filter id="edgeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Node glows */}
            {Object.keys(positions).map((page) => {
              const clId = getCluster(page)
              const parentPage = CLUSTER_PARENTS[clId] || page
              const color = getPageMeta(parentPage).color
              return (
                <radialGradient key={`ng-${page}`} id={`ng-${page}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
              )
            })}
          </defs>

          {/* ── Inter-cluster edges (aggregated parent→parent) ── */}
          {interEdges.map((edge) => {
            const from = positions[edge.from]
            const to = positions[edge.to]
            if (!from || !to) return null
            const edgeKey = `inter-${edge.from}-${edge.to}`
            const isHovered = hovered === edge.from || hovered === edge.to
            const thickness = 1 + (edge.count / maxInterEdge) * 3.5
            const dx = to.x - from.x
            const dy = to.y - from.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            // Start/end at edge of orb (not center)
            const fromR = from.orbRadius || from.size || 22
            const toR = to.orbRadius || to.size || 22
            const fromX = from.x + (dx / (dist || 1)) * fromR
            const fromY = from.y + (dy / (dist || 1)) * fromR
            const toX = to.x - (dx / (dist || 1)) * toR
            const toY = to.y - (dy / (dist || 1)) * toR
            const curve = dist * 0.2
            const nx = -dy / (dist || 1)
            const ny2 = dx / (dist || 1)
            const wobble = Math.sin(edge.count * 1.3) * 8
            const cpx1 = fromX + (toX - fromX) * 0.35 + nx * (curve * 0.2 + wobble)
            const cpy1 = fromY + (toY - fromY) * 0.35 + ny2 * (curve * 0.2 + wobble)
            const cpx2 = fromX + (toX - fromX) * 0.65 - nx * (curve * 0.15 - wobble * 0.5)
            const cpy2 = fromY + (toY - fromY) * 0.65 - ny2 * (curve * 0.15 - wobble * 0.5)
            const d = `M ${fromX} ${fromY} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${toX} ${toY}`
            const speed = Math.max(1.5, 4 - (edge.count / maxInterEdge) * 2.5)
            const fromMeta = getPageMeta(edge.from)

            return (
              <g key={edgeKey}>
                <path d={d} fill="none" stroke={fromMeta.color} strokeWidth={thickness * 2.5} strokeLinecap="round" opacity={isHovered ? 0.08 : 0.02} style={{ filter: 'url(#edgeGlow)' }} />
                <path
                  d={d} fill="none"
                  stroke={isHovered ? 'rgba(255,255,255,0.35)' : `${fromMeta.color}40`}
                  strokeWidth={thickness}
                  strokeDasharray={`${4 + thickness} ${3 + thickness * 0.5}`}
                  strokeLinecap="round"
                  opacity={isHovered ? 0.65 : 0.2}
                  style={{ animation: `tentacleFlow ${speed}s linear infinite`, transition: 'opacity 0.3s' }}
                />
                {isHovered && (
                  <g>
                    <rect x={(fromX + toX) / 2 - 14} y={(fromY + toY) / 2 - 9} width="28" height="18" rx="4" fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    <text x={(fromX + toX) / 2} y={(fromY + toY) / 2 + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui">{edge.count}×</text>
                  </g>
                )}
              </g>
            )
          })}

          {/* ── Parent orb backgrounds (the big circles that contain children) ── */}
          {clusterList.map(([id, cluster]) => {
            const parentPos = positions[cluster.parent]
            if (!parentPos || cluster.children.length === 0) return null
            const meta = getPageMeta(cluster.parent)
            const orbR = parentPos.orbRadius || 50
            const isExpanded = expandedCluster === id
            const isHov = hovered === cluster.parent

            return (
              <g key={`orb-${id}`}>
                {/* Outer glow */}
                <circle cx={parentPos.x} cy={parentPos.y} r={orbR + 8} fill="none" stroke={meta.color} strokeWidth="0.3" opacity={isHov || isExpanded ? 0.3 : 0.08}>
                  <animate attributeName="opacity" values={isHov ? '0.2;0.4;0.2' : '0.05;0.1;0.05'} dur="3s" repeatCount="indefinite" />
                </circle>
                {/* Main orb — semi-transparent fill */}
                <circle
                  cx={parentPos.x} cy={parentPos.y} r={orbR}
                  fill={`${meta.color}${isExpanded ? '0a' : '06'}`}
                  stroke={meta.color}
                  strokeWidth={isHov || isExpanded ? 1.5 : 0.8}
                  opacity={isHov || isExpanded ? 0.6 : 0.3}
                  style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                />
              </g>
            )
          })}

          {/* ── Intra-cluster edges (always visible inside the orb) ── */}
          {intraEdges.map((edge) => {
            const from = positions[edge.from]
            const to = positions[edge.to]
            if (!from || !to) return null
            const cluster = getCluster(edge.from)
            const parentColor = getPageMeta(CLUSTER_PARENTS[cluster] || edge.from).color
            const isHov = hovered === CLUSTER_PARENTS[cluster] || expandedCluster === cluster
            const d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`

            return (
              <path
                key={`intra-${edge.from}-${edge.to}`}
                d={d} fill="none"
                stroke={parentColor}
                strokeWidth="0.5"
                strokeDasharray="1.5 2"
                strokeLinecap="round"
                opacity={isHov ? 0.3 : 0.12}
                style={{ animation: 'tentacleFlow 3s linear infinite', transition: 'opacity 0.3s' }}
              />
            )
          })}

          {/* ── All nodes — parents first (so children render on top) ── */}
          {/* Render non-children first */}
          {Object.entries(positions)
            .sort(([, a], [, b]) => (a.isChild ? 1 : 0) - (b.isChild ? 1 : 0))
            .map(([page, pos]) => {
            const clId = getCluster(page)
            const parentPage = CLUSTER_PARENTS[clId] || page
            const parentColor = getPageMeta(parentPage).color
            const meta = getPageMeta(page)
            const stat = pageStats.find((s) => s.page === page)
            const views = stat?.views || 0
            const viewPct = totalViews > 0 ? Math.round((views / totalViews) * 100) : 0
            const isHov = hovered === page
            const isChild = pos.isChild
            const nodeSize = isChild ? pos.size : (pos.orbRadius ? 16 : pos.size) // parent "center dot" is smaller than orb
            const nodeColor = parentColor

            // Children always visible inside their parent orb
            const childVisible = true

            // For parents with children, the "node" is the center label (orb is drawn above)
            const hasOrb = !isChild && clusters.has(clId) && clusters.get(clId)!.children.length > 0

            return (
              <g
                key={page}
                onMouseDown={(e) => handleMouseDown(page, e)}
                onMouseEnter={() => setHovered(page)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (hasOrb) {
                    setExpandedCluster(expandedCluster === clId ? null : clId)
                  }
                }}
                style={{ cursor: isChild ? 'grab' : hasOrb ? 'pointer' : 'grab' }}
                opacity={childVisible ? 1 : 0}
              >
                {/* Child node circle */}
                {isChild && (
                  <>
                    <circle cx={pos.x} cy={pos.y} r={nodeSize + 2} fill={`url(#ng-${page})`} />
                    <circle
                      cx={pos.x} cy={pos.y} r={nodeSize}
                      fill={`${nodeColor}18`}
                      stroke={nodeColor}
                      strokeWidth={isHov ? 1.2 : 0.5}
                      style={{ transition: 'stroke-width 0.2s' }}
                    />
                    <text
                      x={pos.x} y={pos.y + 1}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize={Math.max(4.5, nodeSize * 0.7)} fontWeight="700" fontFamily="system-ui" opacity="0.85"
                    >
                      {views}
                    </text>
                    <text
                      x={pos.x} y={pos.y + nodeSize + 6}
                      textAnchor="middle" fill={isHov ? nodeColor : 'rgba(255,255,255,0.4)'}
                      fontSize="5.5" fontWeight="600" fontFamily="system-ui"
                      style={{ transition: 'fill 0.2s' }}
                    >
                      {meta.label}
                    </text>
                  </>
                )}

                {/* Parent node (center of orb OR standalone) */}
                {!isChild && (
                  <>
                    {!hasOrb && (
                      <>
                        <circle cx={pos.x} cy={pos.y} r={nodeSize + 8} fill={`url(#ng-${page})`}>
                          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle
                          cx={pos.x} cy={pos.y} r={nodeSize}
                          fill={`${nodeColor}08`}
                          stroke={nodeColor}
                          strokeWidth={isHov ? 2 : 1.2}
                          style={{ transition: 'stroke-width 0.2s' }}
                        />
                        <circle cx={pos.x} cy={pos.y} r={nodeSize * 0.35} fill={nodeColor} opacity={isHov ? 0.5 : 0.25}>
                          <animate attributeName="opacity" values={isHov ? '0.4;0.7;0.4' : '0.15;0.3;0.15'} dur="2.5s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    {/* View count + label for parent */}
                    <text
                      x={pos.x} y={hasOrb ? pos.y - 4 : pos.y + 1}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize={hasOrb ? '16' : Math.max(9, nodeSize * 0.5)}
                      fontWeight="900" fontFamily="system-ui" opacity="0.9"
                    >
                      {views}
                    </text>
                    <text
                      x={pos.x} y={hasOrb ? pos.y + 10 : pos.y + nodeSize + 12}
                      textAnchor="middle"
                      fill={isHov ? nodeColor : 'rgba(255,255,255,0.65)'}
                      fontSize={hasOrb ? '10' : '9'} fontWeight="700" fontFamily="system-ui"
                      style={{ transition: 'fill 0.2s' }}
                    >
                      {meta.label}
                    </text>
                    {/* Percentage */}
                    <text
                      x={pos.x}
                      y={hasOrb ? pos.y + 20 : pos.y + nodeSize + 22}
                      textAnchor="middle" fill="rgba(255,255,255,0.25)"
                      fontSize="7" fontFamily="system-ui"
                    >
                      {viewPct}%
                    </text>
                    {/* Expand hint badge */}
                    {hasOrb && (
                      <g>
                        <circle
                          cx={pos.x + (pos.orbRadius || 50) * 0.65}
                          cy={pos.y - (pos.orbRadius || 50) * 0.65}
                          r="8" fill={nodeColor} opacity="0.85"
                        />
                        <text
                          x={pos.x + (pos.orbRadius || 50) * 0.65}
                          y={pos.y - (pos.orbRadius || 50) * 0.65 + 1}
                          textAnchor="middle" dominantBaseline="middle"
                          fill="white" fontSize="6.5" fontWeight="800" fontFamily="system-ui"
                        >
                          {clusters.get(clId)!.children.length}
                        </text>
                      </g>
                    )}
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4 text-[9px] text-white/25">
        <span>Click cluster to expand inner pages</span>
        <span>·</span>
        <span>Drag child nodes inside their parent</span>
        <span>·</span>
        <span>Hover for flow counts</span>
      </div>
    </div>
  )
}

// ─── Deep Activity Feed (granular event-level timeline) ──────────────

const ACTION_TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  'game-launch': { label: 'Game Opened', color: '#a855f7', icon: '🎮' },
  'casino-category-select': { label: 'Category', color: '#6366f1', icon: '📂' },
  'casino-vendor-filter': { label: 'Vendor Filter', color: '#3b82f6', icon: '🏷️' },
  'casino-sort-change': { label: 'Sort Changed', color: '#64748b', icon: '↕️' },
  'casino-favorite-game': { label: 'Favorited', color: '#f59e0b', icon: '⭐' },
  'casino-unfavorite-game': { label: 'Unfavorited', color: '#64748b', icon: '☆' },
  'bet-select': { label: 'Bet Selected', color: '#22c55e', icon: '🎯' },
  'bet-deselect': { label: 'Bet Removed', color: '#ef4444', icon: '✕' },
  'place-bet': { label: 'Bet Placed', color: '#10b981', icon: '💰' },
  'sport-select': { label: 'Sport Selected', color: '#f97316', icon: '🏈' },
  'sport-view': { label: 'Sport Viewed', color: '#f97316', icon: '👁️' },
  'league-select': { label: 'League Selected', color: '#eab308', icon: '🏆' },
  'event-expand': { label: 'Match Expanded', color: '#8b5cf6', icon: '📊' },
  'deposit-complete': { label: 'Deposit', color: '#22c55e', icon: '💳' },
  'account-section': { label: 'Account Tab', color: '#6366f1', icon: '👤' },
  'sub-page-view': { label: 'Sub-Page', color: '#64748b', icon: '📄' },
}

function DeepActivityFeed({ events }: { events: TrackingEvent[] }) {
  const [filter, setFilter] = useState<string>('all')
  const deepEvents = useMemo(() => {
    return events
      .filter(e => e.type === 'action' && e.target !== 'vip-rewards' && e.target !== 'poker')
      .reverse()
  }, [events])

  const filtered = useMemo(() => {
    if (filter === 'all') return deepEvents.slice(0, 30)
    return deepEvents.filter(e => e.page === filter).slice(0, 30)
  }, [deepEvents, filter])

  const pages = useMemo(() => {
    const set = new Set(deepEvents.map(e => e.page))
    return ['all', ...Array.from(set)]
  }, [deepEvents])

  if (deepEvents.length === 0) return null

  return (
    <div className="rounded-xl border border-emerald-500/10 overflow-hidden relative" style={{ backgroundColor: '#1a1a1a', animation: 'live-border-glow 4s ease-in-out infinite' }}>
      {/* Scanning line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden live-scan-line z-10" />
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <div>
            <h3 className="text-[11px] font-semibold text-white">Deep Activity Feed</h3>
            <p className="text-[10px] text-white/25 mt-0.5">{deepEvents.length} actions tracked · games, bets, categories, vendors</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {pages.map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`text-[9px] px-2 py-0.5 rounded-full transition-colors ${
                filter === p
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/30 hover:text-white/50 hover:bg-white/5'
              }`}
            >
              {p === 'all' ? 'All' : getPageMeta(p).label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 max-h-[320px] overflow-y-auto scrollbar-hide">
        <div className="space-y-0 divide-y divide-white/5">
          {filtered.map((event, i) => {
            const info = ACTION_TYPE_LABELS[event.target] || { label: event.target, color: '#64748b', icon: '·' }
            const pageMeta = getPageMeta(event.page)
            const time = new Date(event.ts)
            const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`
            const metaStr = event.meta ? Object.entries(event.meta)
              .filter(([k]) => !['section'].includes(k))
              .map(([k, v]) => `${k}: ${v}`)
              .join(' · ') : ''

            return (
              <motion.div
                key={`${event.id}-${i}`}
                className="flex items-start gap-2 py-1.5"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                {/* Time */}
                <span className="text-[9px] text-white/20 tabular-nums flex-shrink-0 w-12 pt-0.5">{timeStr}</span>
                
                {/* Icon + type badge */}
                <div className="flex-shrink-0 flex items-center gap-1">
                  <span className="text-[10px]">{info.icon}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${info.color}15`, color: info.color }}>
                    {info.label}
                  </span>
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <span className="text-[10px] text-white/70 block truncate">{event.label || event.target}</span>
                  {metaStr && <span className="text-[8px] text-white/25 block truncate">{metaStr}</span>}
                </div>

                {/* Page context */}
                <div className="flex-shrink-0 flex items-center gap-1 pt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pageMeta.color }} />
                  <span className="text-[9px] text-white/25">{pageMeta.label}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Session Flow Trail ──────────────────────────────────────────────

/** Simple inline trail for snapshot previews (max 3 trails, compact) */
function SessionFlowTrail({ flow, index }: { flow: string[]; index: number }) {
  const first = getPageMeta(flow[0])
  const last = getPageMeta(flow[flow.length - 1])
  const FirstIcon = first.icon
  const LastIcon = last.icon
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="text-[9px] text-white/25 font-mono">#{index + 1}</span>
      <div className="flex items-center gap-1">
        <FirstIcon className="w-3 h-3" style={{ color: first.color }} />
        <span className="text-[10px] font-medium" style={{ color: first.color }}>{first.label}</span>
      </div>
      <span className="text-[9px] text-white/20">→ {flow.length - 2 > 0 ? `${flow.length - 2} more →` : '→'}</span>
      <div className="flex items-center gap-1">
        <LastIcon className="w-3 h-3" style={{ color: last.color }} />
        <span className="text-[10px] font-medium" style={{ color: last.color }}>{last.label}</span>
      </div>
    </div>
  )
}

/** Group identical session flows, sort by frequency */
function useGroupedFlows(sessionFlows: string[][]) {
  return useMemo(() => {
    const map = new Map<string, { flow: string[]; count: number }>()
    for (const flow of sessionFlows) {
      const key = flow.join('→')
      const existing = map.get(key)
      if (existing) existing.count++
      else map.set(key, { flow, count: 1 })
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [sessionFlows])
}

function SessionTrailsPanel({ sessionFlows }: { sessionFlows: string[][] }) {
  const grouped = useGroupedFlows(sessionFlows)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const maxCount = Math.max(1, ...grouped.map((g) => g.count))
  const visible = showAll ? grouped : grouped.slice(0, 8)
  const hiddenCount = grouped.length - 8

  if (grouped.length === 0) {
    return <p className="text-[10px] text-white/25 text-center py-4">Navigate 2+ pages</p>
  }

  return (
    <div className="space-y-1">
      {visible.map((group) => {
        const key = group.flow.join('→')
        const isExpanded = expanded === key
        const first = getPageMeta(group.flow[0])
        const last = getPageMeta(group.flow[group.flow.length - 1])
        const FirstIcon = first.icon
        const LastIcon = last.icon
        const barWidth = Math.max(8, (group.count / maxCount) * 100)

        return (
          <div key={key}>
            {/* Compact summary row */}
            <button
              onClick={() => setExpanded(isExpanded ? null : key)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group text-left"
            >
              {/* Rank / count badge */}
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.04] flex-shrink-0">
                <span className="text-[10px] font-bold text-white/50 tabular-nums">{group.count}×</span>
              </div>

              {/* First → Last summary */}
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <FirstIcon className="w-3 h-3" style={{ color: first.color }} />
                  <span className="text-[10px] font-medium text-white/70 truncate max-w-[60px]">{first.label}</span>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <span className="text-[9px] text-white/20">···</span>
                  <span className="text-[9px] text-white/25 tabular-nums">{group.flow.length}</span>
                  <span className="text-[9px] text-white/20">···</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <LastIcon className="w-3 h-3" style={{ color: last.color }} />
                  <span className="text-[10px] font-medium text-white/70 truncate max-w-[60px]">{last.label}</span>
                </div>
              </div>

              {/* Frequency bar */}
              <div className="w-16 h-3 rounded-full bg-white/[0.04] overflow-hidden flex-shrink-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: `${last.color}60` }}
                />
              </div>

              {/* Expand chevron */}
              <IconChevronDown
                className={cn(
                  'w-3 h-3 text-white/20 transition-transform flex-shrink-0',
                  isExpanded && 'rotate-180'
                )}
              />
            </button>

            {/* Expanded: full trail */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-1 flex-wrap px-2 py-2 ml-8 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    {group.flow.map((page, i) => {
                      const meta = getPageMeta(page)
                      const Icon = meta.icon
                      return (
                        <React.Fragment key={`${page}-${i}`}>
                          {i > 0 && <IconChevronRight className="w-2.5 h-2.5 text-white/15 flex-shrink-0" />}
                          <div
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium flex-shrink-0"
                            style={{
                              backgroundColor: `${meta.color}12`,
                              color: meta.color,
                              border: `1px solid ${meta.color}20`,
                            }}
                          >
                            <Icon className="w-2.5 h-2.5" />
                            {meta.label}
                          </div>
                        </React.Fragment>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Show more / less */}
      {grouped.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center py-1.5 text-[10px] font-medium text-white/30 hover:text-white/50 transition-colors cursor-pointer"
        >
          {showAll ? 'Show less' : `Show ${hiddenCount} more path${hiddenCount !== 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}

// ─── Page Stats Table ────────────────────────────────────────────────

function PageStatsTable({ stats }: { stats: PageStat[] }) {
  if (stats.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-white/30">No page views recorded yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-white/40 font-medium">Page</th>
            <th className="text-right py-2 px-3 text-white/40 font-medium">Views</th>
            <th className="text-right py-2 px-3 text-white/40 font-medium hidden md:table-cell">First Seen</th>
            <th className="text-right py-2 px-3 text-white/40 font-medium">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => {
            const meta = getPageMeta(stat.page)
            const Icon = meta.icon
            return (
              <tr key={stat.page} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${meta.color}20` }}
                    >
                      <Icon className="w-3 h-3" style={{ color: meta.color }} />
                    </div>
                    <span className="text-white font-medium">{meta.label}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right">
                  <span className="text-white font-semibold">{stat.views}</span>
                </td>
                <td className="py-2 px-3 text-right text-white/40 hidden md:table-cell">{formatDate(stat.firstSeen)}</td>
                <td className="py-2 px-3 text-right text-white/40">{timeAgo(stat.lastSeen)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Top Actions Table ───────────────────────────────────────────────

function TopActionsTable({ actions }: { actions: { label: string; count: number; type: string }[] }) {
  if (actions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-white/30">No actions tracked yet</p>
      </div>
    )
  }

  const typeColors: Record<string, string> = {
    nav_click: '#6366f1',
    cta_click: '#22c55e',
    action: '#f59e0b',
    sidebar_click: '#a855f7',
  }

  const maxCount = Math.max(1, ...actions.map((a) => a.count))

  return (
    <div className="space-y-1.5">
      {actions.slice(0, 15).map((action, i) => (
        <div key={action.label} className="flex items-center gap-2 group">
          <span className="text-[10px] text-white/20 font-mono w-4 text-right">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white font-medium truncate">{action.label}</span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${typeColors[action.type] || '#64748b'}20`,
                  color: typeColors[action.type] || '#64748b',
                }}
              >
                {action.type.replace('_', ' ')}
              </span>
            </div>
            {/* Bar */}
            <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: typeColors[action.type] || '#64748b' }}
                initial={{ width: 0 }}
                animate={{ width: `${(action.count / maxCount) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
              />
            </div>
          </div>
          <span className="text-xs text-white/50 font-semibold tabular-nums w-6 text-right">{action.count}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Event Log ───────────────────────────────────────────────────────

function EventLog() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const events = useTrackingStore((s) => s.events)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredEvents = useMemo(() => {
    if (!mounted) return []
    let result = [...events].reverse()
    if (filter !== 'all') {
      result = result.filter((e) => e.type === filter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.page.toLowerCase().includes(q) ||
          e.target.toLowerCase().includes(q) ||
          (e.label || '').toLowerCase().includes(q)
      )
    }
    return result.slice(0, 100)
  }, [events, filter, search, mounted])

  if (!mounted) return null

  const typeColors: Record<string, string> = {
    page_view: '#6366f1',
    nav_click: '#22c55e',
    cta_click: '#f59e0b',
    action: '#ef4444',
    sidebar_click: '#a855f7',
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {['all', 'page_view', 'nav_click', 'cta_click', 'action', 'sidebar_click'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
              filter === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
            )}
          >
            {t === 'all' ? 'All' : t.replace('_', ' ')}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="h-7 pl-7 pr-2 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/20 w-[160px]"
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-white/30">No events found</p>
        </div>
      ) : (
        <div className="space-y-0.5 max-h-[400px] overflow-y-auto scrollbar-hide">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.02] group"
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: typeColors[event.type] || '#64748b' }}
              />
              <span className="text-[10px] text-white/25 font-mono flex-shrink-0 w-14">
                {new Date(event.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                style={{
                  backgroundColor: `${typeColors[event.type] || '#64748b'}15`,
                  color: typeColors[event.type] || '#64748b',
                }}
              >
                {event.type.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-white/60 flex-shrink-0">{getPageMeta(event.page).label}</span>
              <IconChevronRight className="w-3 h-3 text-white/15 flex-shrink-0" />
              <span className="text-[11px] text-white font-medium truncate">{event.label || event.target}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-white/25">
          Showing {filteredEvents.length} of {events.length} events
        </span>
      </div>
    </div>
  )
}

// ─── Snapshot Card ───────────────────────────────────────────────────

function SnapshotCard({
  snapshot,
  isComparing,
  onToggleCompare,
  onDelete,
}: {
  snapshot: FlowSnapshot
  isComparing: boolean
  onToggleCompare: () => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden transition-colors',
        isComparing ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10'
      )}
      style={{ backgroundColor: isComparing ? undefined : '#1a1a1a' }}
    >
      <div className="p-3 flex items-center gap-3">
        <button
          onClick={onToggleCompare}
          className={cn(
            'w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer',
            isComparing
              ? 'bg-indigo-500 border-indigo-500'
              : 'border-white/20 hover:border-white/40'
          )}
        >
          {isComparing && <IconCheck className="w-3 h-3 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-white truncate">{snapshot.name}</h4>
          <p className="text-[10px] text-white/40 mt-0.5">
            {formatDate(snapshot.savedAt)} · {snapshot.totalEvents} events · {snapshot.flowEdges.length} flows
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <motion.div animate={{ rotate: expanded ? 90 : 0 }}>
              <IconChevronRight className="w-3.5 h-3.5" />
            </motion.div>
          </button>
          <button
            onClick={onDelete}
            className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <IconTrash className="w-3 h-3" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              {/* Mini flow diagram */}
              <LiveFlowDiagram
                flowEdges={snapshot.flowEdges}
                pageStats={snapshot.pageStats}
                events={[]}
              />

              {/* Top pages */}
              <div>
                <h5 className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-1.5">Top Pages</h5>
                <div className="space-y-1">
                  {snapshot.pageStats.slice(0, 5).map((stat) => {
                    const meta = getPageMeta(stat.page)
                    return (
                      <div key={stat.page} className="flex items-center justify-between">
                        <span className="text-[11px] text-white/60" style={{ color: meta.color }}>{meta.label}</span>
                        <span className="text-[11px] text-white/40">{stat.views} views</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top flows */}
              <div>
                <h5 className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-1.5">Top Flows</h5>
                <div className="space-y-1">
                  {snapshot.flowEdges.slice(0, 5).map((edge, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px]">
                      <span style={{ color: getPageMeta(edge.from).color }}>{getPageMeta(edge.from).label}</span>
                      <IconArrowRight className="w-3 h-3 text-white/20" />
                      <span style={{ color: getPageMeta(edge.to).color }}>{getPageMeta(edge.to).label}</span>
                      <span className="text-white/30 ml-auto">{edge.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session trails */}
              {snapshot.sessionFlows.length > 0 && (
                <div>
                  <h5 className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-1.5">Session Trails</h5>
                  {snapshot.sessionFlows.slice(0, 3).map((flow, i) => (
                    <SessionFlowTrail key={i} flow={flow} index={i} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Comparison View ─────────────────────────────────────────────────

function ComparisonView({
  current,
  snapshot,
}: {
  current: { pageStats: PageStat[]; flowEdges: FlowEdge[]; topActions: { label: string; count: number; type: string }[] }
  snapshot: FlowSnapshot
}) {
  // Build comparison data
  const allPages = useMemo(() => {
    const set = new Set<string>()
    current.pageStats.forEach((s) => set.add(s.page))
    snapshot.pageStats.forEach((s) => set.add(s.page))
    return Array.from(set)
  }, [current.pageStats, snapshot.pageStats])

  return (
    <div className="rounded-2xl border border-indigo-500/30 overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="p-4 border-b border-white/5 flex items-center gap-3">
        <IconCalendar className="w-4 h-4 text-indigo-400" />
        <div>
          <h3 className="text-sm font-semibold text-white">Comparing: Now vs &ldquo;{snapshot.name}&rdquo;</h3>
          <p className="text-[11px] text-white/40 mt-0.5">
            Saved {formatDate(snapshot.savedAt)} · {snapshot.totalEvents} events at time of snapshot
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-white/40 font-medium">Page</th>
                <th className="text-right py-2 px-3 text-white/40 font-medium">Now</th>
                <th className="text-right py-2 px-3 text-white/40 font-medium">Then</th>
                <th className="text-right py-2 px-3 text-white/40 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {allPages.map((page) => {
                const meta = getPageMeta(page)
                const nowViews = current.pageStats.find((s) => s.page === page)?.views || 0
                const thenViews = snapshot.pageStats.find((s) => s.page === page)?.views || 0
                const diff = nowViews - thenViews
                const pct = thenViews > 0 ? ((diff / thenViews) * 100).toFixed(0) : nowViews > 0 ? '+∞' : '—'

                return (
                  <tr key={page} className="border-b border-white/5">
                    <td className="py-2 px-3">
                      <span className="font-medium" style={{ color: meta.color }}>{meta.label}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-white font-semibold">{nowViews}</td>
                    <td className="py-2 px-3 text-right text-white/50">{thenViews}</td>
                    <td className="py-2 px-3 text-right">
                      <span
                        className={cn(
                          'flex items-center gap-0.5 justify-end font-semibold',
                          diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-white/30'
                        )}
                      >
                        {diff > 0 && <IconArrowUp className="w-3 h-3" />}
                        {diff < 0 && <IconArrowDown className="w-3 h-3" />}
                        {diff !== 0 ? `${diff > 0 ? '+' : ''}${diff}` : '—'}
                        {typeof pct === 'string' && pct !== '—' && (
                          <span className="text-[10px] opacity-60 ml-0.5">({pct}%)</span>
                        )}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Flow comparison */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-2">Current Top Flows</h4>
            {current.flowEdges.slice(0, 5).map((edge, i) => (
              <div key={i} className="flex items-center gap-1 text-[11px] py-0.5">
                <span style={{ color: getPageMeta(edge.from).color }}>{getPageMeta(edge.from).label}</span>
                <IconArrowRight className="w-3 h-3 text-white/20" />
                <span style={{ color: getPageMeta(edge.to).color }}>{getPageMeta(edge.to).label}</span>
                <span className="text-white/30 ml-auto">{edge.count}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-2">Snapshot Top Flows</h4>
            {snapshot.flowEdges.slice(0, 5).map((edge, i) => (
              <div key={i} className="flex items-center gap-1 text-[11px] py-0.5">
                <span style={{ color: getPageMeta(edge.from).color }}>{getPageMeta(edge.from).label}</span>
                <IconArrowRight className="w-3 h-3 text-white/20" />
                <span style={{ color: getPageMeta(edge.to).color }}>{getPageMeta(edge.to).label}</span>
                <span className="text-white/30 ml-auto">{edge.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Activity Timeline (mini bar chart) ──────────────────────────────

function ActivityTimeline() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const getTimelineByHour = useTrackingStore((s) => s.getTimelineByHour)
  const timeline = mounted ? getTimelineByHour() : []

  if (timeline.length === 0) return null

  const maxCount = Math.max(1, ...timeline.map((t) => t.count))

  return (
    <div className="rounded-xl border border-white/[0.06] p-4" style={{ backgroundColor: '#1a1a1a' }}>
      <h3 className="text-[11px] font-semibold text-white mb-3">Activity Timeline</h3>
      <div className="flex items-end gap-[2px] h-20">
        {timeline.map((t, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5 group relative h-full">
            <motion.div
              className="w-full rounded-sm min-h-[2px]"
              style={{ backgroundColor: '#6366f1' }}
              initial={{ height: 0 }}
              animate={{ height: `${(t.count / maxCount) * 100}%` }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
            />
            {/* Tooltip on hover */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
              <div className="bg-black/90 rounded px-1.5 py-0.5 text-[9px] text-white whitespace-nowrap">
                {t.hour}: {t.count}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[9px] text-white/25">{timeline[0]?.hour}</span>
        <span className="text-[9px] text-white/25">{timeline[timeline.length - 1]?.hour}</span>
      </div>
    </div>
  )
}

// ─── Quick Stats ─────────────────────────────────────────────────────

function QuickStats({ events, pageStats, flowEdges, sessionFlows, uniqueUsers }: {
  events: TrackingEvent[]
  pageStats: PageStat[]
  flowEdges: FlowEdge[]
  sessionFlows: string[][]
  uniqueUsers: number
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const stats = [
    { label: 'Total Events', value: mounted ? events.length.toLocaleString() : '–', icon: IconBolt, color: '#6366f1' },
    { label: 'Unique Users', value: mounted ? String(uniqueUsers) : '–', icon: IconUsers, color: '#06b6d4' },
    { label: 'Pages Tracked', value: mounted ? String(pageStats.length) : '–', icon: IconHome, color: '#22c55e' },
    { label: 'Flow Paths', value: mounted ? String(flowEdges.length) : '–', icon: IconArrowRight, color: '#f59e0b' },
    { label: 'Sessions', value: mounted ? String(sessionFlows.length) : '–', icon: IconClock, color: '#ee3536' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="rounded-xl border border-white/[0.06] p-3 flex items-center gap-3"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <Icon strokeWidth={1.5} className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-[10px] text-white/40 font-medium">{stat.label}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Site Architecture Map — all possible user flows ─────────────────

interface SiteNode {
  id: string
  label: string
  color: string
  icon: React.ElementType
  children?: string[]     // IDs of pages reachable from this node
  actions?: string[]      // key actions available on this page
}

const SITE_MAP: SiteNode[] = [
  { id: 'home', label: 'Home', color: '#6366f1', icon: IconHome, children: ['casino', 'sports', 'poker', 'vip-rewards', 'live-betting', 'account', 'deposit'], actions: ['View hero banners', 'Quick links nav', 'Featured content'] },
  { id: 'casino', label: 'Casino', color: '#a855f7', icon: IconDeviceGamepad2, children: ['home', 'sports', 'poker', 'vip-rewards', 'account', 'deposit', 'game-launcher'], actions: ['Browse games', 'Filter by category', 'Filter by vendor', 'Favourite a game', 'Open game launcher'] },
  { id: 'game-launcher', label: 'Game Launcher', color: '#c084fc', icon: IconPlayerPlay, children: ['casino'], actions: ['Play game', 'Fullscreen', 'Favourite', 'Back to casino'] },
  { id: 'sports', label: 'Sports', color: '#22c55e', icon: IconBallFootball, children: ['home', 'casino', 'poker', 'vip-rewards', 'account', 'deposit', 'my-bets'], actions: ['Browse events', 'Select odds', 'Place bet', 'View live scores', 'Change sport/league'] },
  { id: 'my-bets', label: 'My Bets', color: '#4ade80', icon: IconTicket, children: ['sports', 'account'], actions: ['View pending bets', 'Cash out', 'Share to chat'] },
  { id: 'live-betting', label: 'Live Betting', color: '#ef4444', icon: IconFlame, children: ['home', 'sports', 'casino', 'account', 'deposit'], actions: ['Watch live events', 'In-play betting', 'Live scores'] },
  { id: 'poker', label: 'Poker', color: '#f97316', icon: IconCards, children: ['home', 'casino', 'sports', 'vip-rewards', 'account', 'deposit'], actions: ['View tournaments', 'Download client', 'View promotions'] },
  { id: 'vip-rewards', label: 'VIP Rewards', color: '#fbbf24', icon: IconCrown, children: ['home', 'casino', 'sports', 'account', 'deposit'], actions: ['View VIP level', 'Claim rewards', 'Browse boosts', 'Daily races'] },
  { id: 'account', label: 'My Account', color: '#06b6d4', icon: IconUser, children: ['home', 'casino', 'sports', 'poker', 'vip-rewards', 'deposit'], actions: ['Dashboard', 'Bet History', 'Transactions', 'My Bonus', 'Settings'] },
  { id: 'deposit', label: 'Deposit', color: '#ee3536', icon: IconWallet, children: ['home', 'casino', 'sports', 'account'], actions: ['Select amount', 'Choose method', 'Confirm deposit'] },
]

function SiteJourneyMap() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Pages that link TO the selected node (incoming)
  const incomingPages = useMemo(() => {
    if (!selectedNode) return []
    return SITE_MAP.filter((n) => n.children?.includes(selectedNode))
  }, [selectedNode])

  // Group pages by tier for the visual layout
  const homePage = SITE_MAP.find((n) => n.id === 'home')!
  const mainProducts = SITE_MAP.filter((n) => ['casino', 'sports', 'live-betting', 'poker', 'vip-rewards'].includes(n.id))
  const subPages = SITE_MAP.filter((n) => ['game-launcher', 'my-bets', 'account', 'deposit'].includes(n.id))

  const selectedSiteNode = SITE_MAP.find((n) => n.id === selectedNode)

  // Check if a page is connected to selected/hovered
  const isConnected = (nodeId: string) => {
    const target = hoveredNode || selectedNode
    if (!target) return false
    const targetNode = SITE_MAP.find((n) => n.id === target)
    return targetNode?.children?.includes(nodeId) || SITE_MAP.find((n) => n.id === nodeId)?.children?.includes(target) || false
  }

  const totalEdges = SITE_MAP.reduce((sum, n) => sum + (n.children?.length || 0), 0)

  return (
    <div className="space-y-4">
      {/* Site Architecture Map */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="px-4 py-3 border-b border-white/5">
          <h3 className="text-xs font-semibold text-white">Site Architecture — Where Users Can Go</h3>
          <p className="text-[10px] text-white/30 mt-0.5">{SITE_MAP.length} pages · {totalEdges} navigation links · Click any page to see its connections</p>
        </div>

        <div className="p-5">
          {/* Tier 1: Home */}
          <div className="flex justify-center mb-3">
            <SiteMapNode
              node={homePage}
              isSelected={selectedNode === homePage.id}
              isHovered={hoveredNode === homePage.id}
              isConnected={isConnected(homePage.id)}
              anySelected={!!selectedNode || !!hoveredNode}
              onClick={() => setSelectedNode(selectedNode === homePage.id ? null : homePage.id)}
              onHover={setHoveredNode}
              size="large"
            />
          </div>

          {/* Connector lines Home → Products */}
          <div className="flex justify-center mb-1">
            <div className="flex items-end gap-6 md:gap-10">
              {mainProducts.map((_, i) => (
                <div key={i} className="w-[1px] h-5" style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.3), rgba(255,255,255,0.06))' }} />
              ))}
            </div>
          </div>

          {/* Label */}
          <div className="text-center mb-2">
            <span className="text-[9px] text-white/20 uppercase tracking-widest font-medium">Main Products</span>
          </div>

          {/* Tier 2: Main Products */}
          <div className="flex justify-center gap-3 md:gap-5 flex-wrap mb-4">
            {mainProducts.map((node) => (
              <SiteMapNode
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                isHovered={hoveredNode === node.id}
                isConnected={isConnected(node.id)}
                anySelected={!!selectedNode || !!hoveredNode}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                onHover={setHoveredNode}
                size="medium"
              />
            ))}
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-1">
            <div className="w-[1px] h-4 bg-white/[0.06]" />
          </div>

          {/* Label */}
          <div className="text-center mb-2">
            <span className="text-[9px] text-white/20 uppercase tracking-widest font-medium">Sub Pages & Actions</span>
          </div>

          {/* Tier 3: Sub Pages */}
          <div className="flex justify-center gap-3 md:gap-5 flex-wrap">
            {subPages.map((node) => (
              <SiteMapNode
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                isHovered={hoveredNode === node.id}
                isConnected={isConnected(node.id)}
                anySelected={!!selectedNode || !!hoveredNode}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                onHover={setHoveredNode}
                size="medium"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Selected Page Detail Panel */}
      <AnimatePresence>
        {selectedSiteNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#1a1a1a', borderColor: `${selectedSiteNode.color}20` }}>
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedSiteNode.color}15`, border: `1px solid ${selectedSiteNode.color}30` }}
                  >
                    <selectedSiteNode.icon className="w-4 h-4" style={{ color: selectedSiteNode.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{selectedSiteNode.label}</h3>
                    <p className="text-[10px] text-white/30">
                      {selectedSiteNode.children?.length || 0} outgoing · {incomingPages.length} incoming links
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-white/30 hover:text-white/60 cursor-pointer p-1">
                  <IconX className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* What users can DO on this page */}
                {selectedSiteNode.actions && (
                  <div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider font-semibold mb-2">What users can do here</div>
                    <div className="space-y-1">
                      {selectedSiteNode.actions.map((action) => (
                        <div key={action} className="flex items-center gap-2 py-1.5 px-2.5 rounded-md bg-white/[0.02] border border-white/[0.04]">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: selectedSiteNode.color, opacity: 0.6 }} />
                          <span className="text-[11px] text-white/60">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Where users can GO from here */}
                {selectedSiteNode.children && selectedSiteNode.children.length > 0 && (
                  <div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider font-semibold mb-2">Can navigate to →</div>
                    <div className="space-y-0.5">
                      {selectedSiteNode.children.map((childId) => {
                        const child = SITE_MAP.find((n) => n.id === childId)
                        if (!child) return null
                        return (
                          <button
                            key={childId}
                            onClick={() => setSelectedNode(childId)}
                            className="w-full flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                          >
                            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: `${child.color}12`, border: `1px solid ${child.color}20` }}>
                              <child.icon className="w-3 h-3" style={{ color: child.color }} />
                            </div>
                            <span className="text-[11px] text-white/60 font-medium flex-1">{child.label}</span>
                            <IconChevronRight className="w-3 h-3 text-white/15" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Where users can COME FROM to get here */}
                {incomingPages.length > 0 && (
                  <div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider font-semibold mb-2">← Accessible from</div>
                    <div className="space-y-0.5">
                      {incomingPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => setSelectedNode(page.id)}
                          className="w-full flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                        >
                          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: `${page.color}12`, border: `1px solid ${page.color}20` }}>
                            <page.icon className="w-3 h-3" style={{ color: page.color }} />
                          </div>
                          <span className="text-[11px] text-white/60 font-medium flex-1">{page.label}</span>
                          <IconChevronRight className="w-3 h-3 text-white/15" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SiteMapNode({ node, isSelected, isHovered, isConnected, anySelected, onClick, onHover, size }: {
  node: SiteNode
  isSelected: boolean
  isHovered: boolean
  isConnected: boolean
  anySelected: boolean
  onClick: () => void
  onHover: (id: string | null) => void
  size: 'large' | 'medium'
}) {
  const Icon = node.icon
  const isHighlighted = isSelected || isHovered || isConnected
  const isDimmed = anySelected && !isHighlighted

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-xl transition-all duration-200 cursor-pointer',
        size === 'large' ? 'px-5 py-3' : 'px-3 py-2.5',
        isSelected ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]',
      )}
      style={{
        border: isSelected ? `1px solid ${node.color}40` : '1px solid transparent',
        opacity: isDimmed ? 0.3 : 1,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
        {/* Glow ring on select/hover */}
        {isHighlighted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 rounded-xl"
            style={{
              boxShadow: `0 0 20px ${node.color}20`,
              transform: 'scale(1.4)',
            }}
          />
        )}
        <div
          className={cn(
            'rounded-xl flex items-center justify-center transition-all duration-200',
            size === 'large' ? 'w-12 h-12' : 'w-10 h-10',
          )}
          style={{
            backgroundColor: isHighlighted ? `${node.color}18` : `${node.color}08`,
            border: `1.5px solid ${isHighlighted ? node.color : `${node.color}25`}`,
          }}
        >
          <Icon
            className={size === 'large' ? 'w-5 h-5' : 'w-4 h-4'}
            style={{ color: node.color, opacity: isHighlighted ? 1 : 0.6 }}
          />
        </div>
      </div>
      <span
        className={cn(
          'font-semibold transition-colors duration-200 text-center leading-tight',
          size === 'large' ? 'text-[11px]' : 'text-[10px]',
        )}
        style={{ color: isHighlighted ? node.color : 'rgba(255,255,255,0.5)' }}
      >
        {node.label}
      </span>
      <span className="text-[8px] text-white/20">{node.children?.length || 0} links</span>
    </motion.button>
  )
}

// ─── Journey Health Analysis — Live insights comparing predicted vs actual ────

function JourneyHealthAnalysis({ flowEdges, pageStats, events, sessionFlows }: {
  flowEdges: FlowEdge[]
  pageStats: PageStat[]
  events: TrackingEvent[]
  sessionFlows: string[][]
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const analysis = useMemo(() => {
    if (!mounted || events.length === 0) return null

    const totalViews = pageStats.reduce((s, p) => s + p.views, 0)
    const totalFlows = flowEdges.reduce((s, e) => s + e.count, 0)

    // Most common journeys (top session flow patterns)
    const flowPatterns = new Map<string, number>()
    sessionFlows.forEach((flow) => {
      const key = flow.join(' → ')
      flowPatterns.set(key, (flowPatterns.get(key) || 0) + 1)
    })
    const topPatterns = Array.from(flowPatterns.entries())
      .map(([path, count]) => ({ path, pages: path.split(' → '), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Dead routes — predicted destinations with 0 visits
    const visitedPages = new Set(pageStats.map((s) => s.page))
    const predictedPages = new Set(DESIGNED_JOURNEYS.flatMap((j) => j.steps.map((s) => s.page)))
    const deadRoutes = Array.from(predictedPages).filter((p) => !visitedPages.has(p))

    // Underperforming flows — predicted but low traffic
    const predictedEdges = DESIGNED_JOURNEYS.flatMap((j) => {
      const edges: { from: string; to: string; journey: string }[] = []
      for (let i = 0; i < j.steps.length - 1; i++) {
        const fromPage = j.steps[i].page
        const toPage = j.steps[i + 1].page
        if (fromPage !== toPage) {
          edges.push({ from: fromPage, to: toPage, journey: j.title })
        }
      }
      return edges
    })
    const underperforming = predictedEdges
      .map((pe) => {
        const actual = flowEdges.find((fe) => fe.from === pe.from && fe.to === pe.to)
        return { ...pe, actualCount: actual?.count || 0 }
      })
      .filter((pe) => pe.actualCount === 0)

    // Unexpected popular flows — not in any predicted journey but high traffic
    const predictedEdgeSet = new Set(predictedEdges.map((e) => `${e.from}-${e.to}`))
    const unexpectedFlows = flowEdges
      .filter((fe) => !predictedEdgeSet.has(`${fe.from}-${fe.to}`))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Bounce pages — pages where users visit but never navigate away
    const exitPages = pageStats
      .map((stat) => {
        const outEdges = flowEdges.filter((e) => e.from === stat.page)
        const totalOut = outEdges.reduce((s, e) => s + e.count, 0)
        const bounceRate = stat.views > 0 ? Math.round(((stat.views - totalOut) / stat.views) * 100) : 0
        return { page: stat.page, views: stat.views, bounceRate }
      })
      .filter((p) => p.bounceRate > 50 && p.views > 1)
      .sort((a, b) => b.bounceRate - a.bounceRate)
      .slice(0, 5)

    // Journey completion estimate
    const journeyScores = DESIGNED_JOURNEYS.map((j) => {
      const uniquePages = [...new Set(j.steps.map((s) => s.page))]
      const visited = uniquePages.filter((p) => visitedPages.has(p)).length
      const pct = Math.round((visited / uniquePages.length) * 100)
      return { id: j.id, title: j.title, color: j.color, icon: j.icon, pct, visited, total: uniquePages.length }
    })

    return {
      totalViews, totalFlows, topPatterns, deadRoutes, underperforming, unexpectedFlows, exitPages, journeyScores,
    }
  }, [mounted, events, pageStats, flowEdges, sessionFlows])

  if (!analysis) {
    return (
      <div className="rounded-xl border border-white/[0.06] p-8 text-center" style={{ backgroundColor: '#1a1a1a' }}>
        <IconBolt className="w-8 h-8 text-white/10 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-white/40 mb-1">No Data Yet</h3>
        <p className="text-xs text-white/25 max-w-xs mx-auto">Browse the site to start tracking. Insights will appear once we have enough data to analyse.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Journey Health Scorecards */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="px-4 py-3 border-b border-white/5">
          <h3 className="text-xs font-semibold text-white">Journey Health</h3>
          <p className="text-[10px] text-white/30 mt-0.5">How well predicted journeys match actual user behaviour</p>
        </div>
        <div className="p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {analysis.journeyScores.map((j) => {
            const Icon = j.icon
            const healthColor = j.pct >= 80 ? '#22c55e' : j.pct >= 50 ? '#f59e0b' : j.pct > 0 ? '#ef4444' : '#64748b'
            return (
              <div key={j.id} className="rounded-lg p-3" style={{ backgroundColor: '#222' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: `${j.color}15` }}>
                    <Icon className="w-3 h-3" style={{ color: j.color }} />
                  </div>
                  <span className="text-[10px] font-semibold text-white/70 truncate flex-1">{j.title.replace('Play ', '').replace('Make a ', '').replace('Place a ', '').replace('Manage ', '').replace('Claim a ', '')}</span>
                </div>
                <div className="flex items-end gap-1 mb-1.5">
                  <span className="text-lg font-bold tabular-nums" style={{ color: healthColor }}>{j.pct}%</span>
                  <span className="text-[9px] text-white/25 mb-0.5">coverage</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${j.pct}%`, backgroundColor: healthColor }} />
                </div>
                <p className="text-[8px] text-white/20 mt-1.5">{j.visited}/{j.total} pages visited</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Two-column: Most Common Journeys + Unexpected Flows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Most Common Real Journeys */}
        <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-[11px] font-semibold text-white flex items-center gap-1.5">
              <IconTrophy className="w-3 h-3 text-amber-400" /> Most Common Journeys
            </h3>
            <p className="text-[9px] text-white/25 mt-0.5">Real user session paths, ranked by frequency</p>
          </div>
          <div className="p-3 space-y-1">
            {analysis.topPatterns.length === 0 ? (
              <p className="text-[10px] text-white/25 text-center py-4">Need more sessions</p>
            ) : (
              analysis.topPatterns.map((pattern, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <span className="text-[10px] text-white/15 font-mono w-4 text-right">{i + 1}</span>
                  <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
                    {pattern.pages.map((page, pi) => {
                      const meta = getPageMeta(page)
                      return (
                        <React.Fragment key={pi}>
                          {pi > 0 && <IconChevronRight className="w-2.5 h-2.5 text-white/15 flex-shrink-0" />}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: `${meta.color}15` }}>
                              <meta.icon className="w-2.5 h-2.5" style={{ color: meta.color }} />
                            </div>
                            <span className="text-[10px] text-white/60 font-medium">{meta.label}</span>
                          </div>
                        </React.Fragment>
                      )
                    })}
                  </div>
                  <span className="text-[10px] font-bold text-white tabular-nums flex-shrink-0">{pattern.count}×</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Unexpected / Unplanned Flows */}
        <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-[11px] font-semibold text-white flex items-center gap-1.5">
              <IconBolt className="w-3 h-3 text-indigo-400" /> Unexpected Flows
            </h3>
            <p className="text-[9px] text-white/25 mt-0.5">Popular transitions not in any predicted journey</p>
          </div>
          <div className="p-3 space-y-1">
            {analysis.unexpectedFlows.length === 0 ? (
              <p className="text-[10px] text-white/25 text-center py-4">All flows match predictions</p>
            ) : (
              analysis.unexpectedFlows.map((flow, i) => {
                const fromMeta = getPageMeta(flow.from)
                const toMeta = getPageMeta(flow.to)
                return (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: `${fromMeta.color}12` }}>
                        <fromMeta.icon className="w-2.5 h-2.5" style={{ color: fromMeta.color }} />
                      </div>
                      <span className="text-[10px] text-white/60">{fromMeta.label}</span>
                    </div>
                    <IconChevronRight className="w-3 h-3 text-white/15" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: `${toMeta.color}12` }}>
                        <toMeta.icon className="w-2.5 h-2.5" style={{ color: toMeta.color }} />
                      </div>
                      <span className="text-[10px] text-white/60">{toMeta.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 tabular-nums ml-auto">{flow.count}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Two-column: Dead Routes + High Bounce */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Dead Routes / Missing Flows */}
        <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-[11px] font-semibold text-white flex items-center gap-1.5">
              <IconX className="w-3 h-3 text-red-400" /> Dead Routes
            </h3>
            <p className="text-[9px] text-white/25 mt-0.5">Predicted transitions that never happened</p>
          </div>
          <div className="p-3">
            {analysis.underperforming.length === 0 && analysis.deadRoutes.length === 0 ? (
              <p className="text-[10px] text-emerald-400/60 text-center py-4 flex items-center justify-center gap-1.5">
                <IconCheck className="w-3 h-3" /> All predicted routes are being used
              </p>
            ) : (
              <div className="space-y-1">
                {analysis.deadRoutes.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[9px] text-white/20 uppercase tracking-wider font-medium">Unvisited Pages</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {analysis.deadRoutes.map((page) => {
                        const meta = getPageMeta(page)
                        return (
                          <span key={page} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ backgroundColor: `${meta.color}10`, color: meta.color, border: `1px solid ${meta.color}20` }}>
                            <meta.icon className="w-2.5 h-2.5" /> {meta.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
                {analysis.underperforming.map((route, i) => {
                  const fromMeta = getPageMeta(route.from)
                  const toMeta = getPageMeta(route.to)
                  return (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/[0.03]">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: `${fromMeta.color}12` }}>
                          <fromMeta.icon className="w-2.5 h-2.5" style={{ color: fromMeta.color }} />
                        </div>
                        <span className="text-[10px] text-white/50">{fromMeta.label}</span>
                      </div>
                      <IconChevronRight className="w-3 h-3 text-red-400/30" />
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: `${toMeta.color}12` }}>
                          <toMeta.icon className="w-2.5 h-2.5" style={{ color: toMeta.color }} />
                        </div>
                        <span className="text-[10px] text-white/50">{toMeta.label}</span>
                      </div>
                      <span className="text-[9px] text-red-400/60 ml-auto">{route.journey}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* High Bounce Pages */}
        <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-[11px] font-semibold text-white flex items-center gap-1.5">
              <IconArrowDown className="w-3 h-3 text-amber-400" /> High Bounce Pages
            </h3>
            <p className="text-[9px] text-white/25 mt-0.5">Pages where users stop navigating — potential drop-off points</p>
          </div>
          <div className="p-3 space-y-1">
            {analysis.exitPages.length === 0 ? (
              <p className="text-[10px] text-emerald-400/60 text-center py-4 flex items-center justify-center gap-1.5">
                <IconCheck className="w-3 h-3" /> No concerning bounce rates
              </p>
            ) : (
              analysis.exitPages.map((page, i) => {
                const meta = getPageMeta(page.page)
                const barColor = page.bounceRate > 80 ? '#ef4444' : page.bounceRate > 60 ? '#f59e0b' : '#22c55e'
                return (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: `${meta.color}12` }}>
                      <meta.icon className="w-3 h-3" style={{ color: meta.color }} />
                    </div>
                    <span className="text-[10px] text-white/60 font-medium w-20 truncate">{meta.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${page.bounceRate}%`, backgroundColor: barColor }} />
                    </div>
                    <span className="text-[10px] font-bold tabular-nums w-10 text-right" style={{ color: barColor }}>{page.bounceRate}%</span>
                    <span className="text-[9px] text-white/20 w-12 text-right">{page.views} views</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Designed Journey Flows ──────────────────────────────────────────

interface JourneyStep {
  page: string
  action: string
  detail: string
}

interface DesignedJourney {
  id: string
  title: string
  description: string
  color: string
  icon: React.ElementType
  steps: JourneyStep[]
}

const DESIGNED_JOURNEYS: DesignedJourney[] = [
  {
    id: 'casino-play',
    title: 'Play a Casino Game',
    description: 'User discovers and plays a casino game from the home page',
    color: '#a855f7',
    icon: IconDeviceGamepad2,
    steps: [
      { page: 'home', action: 'Land on Home', detail: 'User arrives at the home page' },
      { page: 'home', action: 'Click Casino', detail: 'Taps "Casino" in the main navigation' },
      { page: 'casino', action: 'Browse Games', detail: 'Scrolls through game tiles, uses filters' },
      { page: 'casino', action: 'Select a Game', detail: 'Clicks on a game tile to open the launcher' },
      { page: 'casino', action: 'Play Game', detail: 'Game loads in the full-screen launcher' },
    ],
  },
  {
    id: 'sports-bet',
    title: 'Place a Sports Bet',
    description: 'User navigates to sports and places a bet on a match',
    color: '#22c55e',
    icon: IconBallFootball,
    steps: [
      { page: 'home', action: 'Land on Home', detail: 'User arrives at the home page' },
      { page: 'home', action: 'Click Sports', detail: 'Taps "Sports" in the main navigation' },
      { page: 'sports', action: 'Browse Matches', detail: 'Views live & upcoming events' },
      { page: 'sports', action: 'Select Odds', detail: 'Taps on odds to add to betslip' },
      { page: 'sports', action: 'Open Betslip', detail: 'Reviews selections, enters stake' },
      { page: 'sports', action: 'Place Bet', detail: 'Confirms and places the bet' },
    ],
  },
  {
    id: 'deposit',
    title: 'Make a Deposit',
    description: 'User deposits funds into their account',
    color: '#ee3536',
    icon: IconWallet,
    steps: [
      { page: 'home', action: 'Land on Home', detail: 'User arrives at the home page' },
      { page: 'home', action: 'Click Wallet', detail: 'Taps the Wallet button in the header' },
      { page: 'deposit', action: 'Select Amount', detail: 'Chooses a preset or enters custom amount' },
      { page: 'deposit', action: 'Choose Payment', detail: 'Selects payment method (card, crypto, etc.)' },
      { page: 'deposit', action: 'Confirm', detail: 'Reviews and confirms the deposit' },
      { page: 'deposit', action: 'Deposit Complete', detail: 'Funds added, balance updated' },
    ],
  },
  {
    id: 'vip-claim',
    title: 'Claim a VIP Reward',
    description: 'User opens the VIP Hub and claims a reward',
    color: '#fbbf24',
    icon: IconCrown,
    steps: [
      { page: 'home', action: 'Land on Home', detail: 'User arrives at the home page' },
      { page: 'home', action: 'Click VIP Crown', detail: 'Taps the VIP crown icon in the header' },
      { page: 'vip-hub', action: 'View Rewards', detail: 'VIP Hub drawer opens, shows available rewards' },
      { page: 'vip-hub', action: 'Browse Boosts', detail: 'Scrolls through reload, cashback, free bet offers' },
      { page: 'vip-hub', action: 'Claim Reward', detail: 'Taps "Claim" on a reward — toast confirms' },
    ],
  },
  {
    id: 'account-manage',
    title: 'Manage Account',
    description: 'User checks their account, views bet history',
    color: '#06b6d4',
    icon: IconUser,
    steps: [
      { page: 'home', action: 'Land on Home', detail: 'User arrives at the home page' },
      { page: 'home', action: 'Click Avatar', detail: 'Taps their avatar in the header' },
      { page: 'account', action: 'View Dashboard', detail: 'Sees account overview, balance, VIP status' },
      { page: 'account', action: 'Check Bet History', detail: 'Navigates to bet history in sidebar' },
      { page: 'account', action: 'Filter & Review', detail: 'Filters bets, expands details' },
    ],
  },
  {
    id: 'poker-play',
    title: 'Play Poker',
    description: 'User navigates to the poker section and downloads the client',
    color: '#f97316',
    icon: IconCards,
    steps: [
      { page: 'home', action: 'Land on Home', detail: 'User arrives at the home page' },
      { page: 'home', action: 'Click Poker', detail: 'Taps "Poker" in the main navigation' },
      { page: 'poker', action: 'View Poker Page', detail: 'Sees the poker hero, tournaments, promotions' },
      { page: 'poker', action: 'Download Client', detail: 'Clicks "Download" to get the poker app' },
      { page: 'poker', action: 'Launch Poker', detail: 'Opens the desktop or mobile poker client' },
    ],
  },
]

/** Compute accuracy of a predicted journey against live session data */
function useJourneyAccuracy(journey: DesignedJourney) {
  const getSessionFlows = useTrackingStore((s) => s.getSessionFlows)
  const getPostActionFunnel = useTrackingStore((s) => s.getPostActionFunnel)
  const getFlowEdges = useTrackingStore((s) => s.getFlowEdges)
  const events = useTrackingStore((s) => s.events)

  return useMemo(() => {
    const sessions = getSessionFlows()
    const flowEdges = getFlowEdges()

    // Extract unique page sequence from predicted steps
    const predictedPages: string[] = []
    for (const step of journey.steps) {
      if (predictedPages[predictedPages.length - 1] !== step.page) {
        predictedPages.push(step.page)
      }
    }

    if (sessions.length === 0 || predictedPages.length < 2) {
      return {
        matchRate: 0,
        sessionsMatching: 0,
        totalSessions: sessions.length,
        hasData: events.length > 0,
        stepAccuracy: predictedPages.map((p) => ({ page: p, predicted: true, actualPct: 0, actualNext: [] as { page: string; pct: number }[] })),
        actualAlternatives: [] as { from: string; toActual: string; toPredicted: string; actualPct: number }[],
        avgStepsActual: 0,
      }
    }

    // How many sessions follow the predicted page sequence (in order, not necessarily adjacent)?
    let matchCount = 0
    for (const session of sessions) {
      let pi = 0
      for (const page of session) {
        if (page === predictedPages[pi]) {
          pi++
          if (pi >= predictedPages.length) break
        }
      }
      if (pi >= predictedPages.length) matchCount++
    }
    const matchRate = sessions.length > 0 ? Math.round((matchCount / sessions.length) * 100) : 0

    // Per-step: what % of sessions that reach step N also reach step N+1?
    const stepAccuracy = predictedPages.map((page, i) => {
      if (i === 0) {
        // How many sessions start with or include this page?
        const reachedCount = sessions.filter((s) => s.includes(page)).length
        return {
          page,
          predicted: true,
          actualPct: sessions.length > 0 ? Math.round((reachedCount / sessions.length) * 100) : 0,
          actualNext: [] as { page: string; pct: number }[],
        }
      }

      const prevPage = predictedPages[i - 1]
      // Sessions that have prevPage — where do they go next?
      const sessionsWithPrev = sessions.filter((s) => s.includes(prevPage))
      const nextPageCounts = new Map<string, number>()
      for (const session of sessionsWithPrev) {
        const idx = session.indexOf(prevPage)
        if (idx < session.length - 1) {
          const next = session[idx + 1]
          nextPageCounts.set(next, (nextPageCounts.get(next) || 0) + 1)
        }
      }

      const totalNext = Array.from(nextPageCounts.values()).reduce((s, v) => s + v, 0)
      const goToPredicted = nextPageCounts.get(page) || 0
      const actualPct = totalNext > 0 ? Math.round((goToPredicted / totalNext) * 100) : 0

      // What do they actually do instead?
      const actualNext = Array.from(nextPageCounts.entries())
        .map(([p, count]) => ({ page: p, pct: totalNext > 0 ? Math.round((count / totalNext) * 100) : 0 }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 4)

      return { page, predicted: true, actualPct, actualNext }
    })

    // Find deviations: where users go somewhere different than predicted
    const actualAlternatives: { from: string; toActual: string; toPredicted: string; actualPct: number }[] = []
    for (let i = 1; i < predictedPages.length; i++) {
      const accuracy = stepAccuracy[i]
      if (accuracy.actualNext.length > 0 && accuracy.actualNext[0].page !== predictedPages[i]) {
        actualAlternatives.push({
          from: predictedPages[i - 1],
          toActual: accuracy.actualNext[0].page,
          toPredicted: predictedPages[i],
          actualPct: accuracy.actualNext[0].pct,
        })
      }
    }

    // Avg steps in sessions matching this journey's start page
    const relevantSessions = sessions.filter((s) => s.includes(predictedPages[0]) && s.includes(predictedPages[predictedPages.length - 1]))
    const avgStepsActual = relevantSessions.length > 0
      ? Math.round((relevantSessions.reduce((sum, s) => sum + s.length, 0) / relevantSessions.length) * 10) / 10
      : 0

    return {
      matchRate,
      sessionsMatching: matchCount,
      totalSessions: sessions.length,
      hasData: events.length > 0,
      stepAccuracy,
      actualAlternatives,
      avgStepsActual,
    }
  }, [journey, getSessionFlows, getPostActionFunnel, getFlowEdges, events])
}

function PredictedJourneyCard({ journey, index }: { journey: DesignedJourney; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = journey.icon
  const accuracy = useJourneyAccuracy(journey)

  // Unique page sequence
  const predictedPages: string[] = []
  for (const step of journey.steps) {
    if (predictedPages[predictedPages.length - 1] !== step.page) {
      predictedPages.push(step.page)
    }
  }

  const accuracyColor = accuracy.matchRate >= 60 ? '#22c55e' : accuracy.matchRate >= 30 ? '#f59e0b' : accuracy.matchRate > 0 ? '#ef4444' : '#64748b'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-lg border border-white/[0.06] overflow-hidden"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2.5 flex items-center gap-2.5 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${journey.color}12`, border: `1px solid ${journey.color}20` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: journey.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[12px] font-semibold text-white leading-tight">{journey.title}</h3>
          <p className="text-[9px] text-white/25 mt-0.5">{journey.steps.length} predicted steps</p>
        </div>
        {/* Accuracy badge */}
        {accuracy.hasData ? (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-md flex-shrink-0"
            style={{ backgroundColor: `${accuracyColor}12`, border: `1px solid ${accuracyColor}25` }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accuracyColor }} />
            <span className="text-[10px] font-bold tabular-nums" style={{ color: accuracyColor }}>
              {accuracy.matchRate}%
            </span>
          </div>
        ) : (
          <span className="text-[9px] text-white/20 flex-shrink-0">No data</span>
        )}
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <IconChevronRight className="w-3 h-3 text-white/20" />
        </motion.div>
      </button>

      {/* Collapsed: inline step pills */}
      {!expanded && (
        <div className="px-3 pb-2.5 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {journey.steps.map((step, i) => {
            const meta = getPageMeta(step.page)
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <svg width="12" height="6" className="flex-shrink-0 text-white/10">
                    <line x1="0" y1="3" x2="8" y2="3" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" />
                    <polygon points="8,1 12,3 8,5" fill="currentColor" />
                  </svg>
                )}
                <span
                  className="flex-shrink-0 text-[9px] font-medium px-1.5 py-[2px] rounded"
                  style={{ backgroundColor: `${meta.color}10`, color: `${meta.color}aa` }}
                >
                  {step.action.split(' ').slice(-1)[0]}
                </span>
              </React.Fragment>
            )
          })}
        </div>
      )}

      {/* Expanded: predicted vs actual */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 space-y-3">
              <p className="text-[10px] text-white/30">{journey.description}</p>

              {/* Stats row */}
              {accuracy.hasData && (
                <div className="flex items-center gap-3 p-2 rounded-md bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-center flex-1">
                    <div className="text-sm font-bold tabular-nums" style={{ color: accuracyColor }}>{accuracy.matchRate}%</div>
                    <div className="text-[8px] text-white/25 uppercase">Match Rate</div>
                  </div>
                  <div className="w-px h-6 bg-white/[0.06]" />
                  <div className="text-center flex-1">
                    <div className="text-sm font-bold text-white tabular-nums">{accuracy.sessionsMatching}/{accuracy.totalSessions}</div>
                    <div className="text-[8px] text-white/25 uppercase">Sessions</div>
                  </div>
                  <div className="w-px h-6 bg-white/[0.06]" />
                  <div className="text-center flex-1">
                    <div className="text-sm font-bold text-white tabular-nums">{predictedPages.length}</div>
                    <div className="text-[8px] text-white/25 uppercase">Predicted</div>
                  </div>
                  {accuracy.avgStepsActual > 0 && (
                    <>
                      <div className="w-px h-6 bg-white/[0.06]" />
                      <div className="text-center flex-1">
                        <div className="text-sm font-bold text-white tabular-nums">{accuracy.avgStepsActual}</div>
                        <div className="text-[8px] text-white/25 uppercase">Avg Actual</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step-by-step with accuracy */}
              <div className="relative pl-5">
                <div className="absolute left-[7px] top-2 bottom-2">
                  <svg width="2" height="100%" className="overflow-visible">
                    <line x1="1" y1="0" x2="1" y2="100%" stroke={`${journey.color}30`} strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                </div>

                {journey.steps.map((step, i) => {
                  const stepMeta = getPageMeta(step.page)
                  const StepIcon = stepMeta.icon
                  const isLast = i === journey.steps.length - 1

                  // Find the accuracy for this page transition
                  const pageIdx = predictedPages.indexOf(step.page)
                  const stepAcc = pageIdx >= 0 ? accuracy.stepAccuracy[pageIdx] : null

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.04 }}
                      className="relative flex items-start gap-2.5 pb-3 last:pb-0"
                    >
                      <div className="absolute -left-5 top-0.5">
                        <div
                          className="w-[16px] h-[16px] rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: isLast ? journey.color : `${journey.color}20`,
                            border: `1.5px solid ${isLast ? journey.color : `${journey.color}40`}`,
                          }}
                        >
                          {isLast ? (
                            <IconCheck className="w-2.5 h-2.5 text-white" />
                          ) : (
                            <StepIcon className="w-2 h-2" style={{ color: journey.color }} />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-white">{step.action}</span>
                          <span
                            className="text-[8px] px-1 py-[1px] rounded font-medium"
                            style={{ backgroundColor: `${stepMeta.color}10`, color: `${stepMeta.color}90` }}
                          >
                            {stepMeta.label}
                          </span>
                          {/* Accuracy indicator for this transition */}
                          {stepAcc && stepAcc.actualPct > 0 && i > 0 && (
                            <span
                              className="text-[8px] px-1 py-[1px] rounded font-bold tabular-nums"
                              style={{
                                backgroundColor: stepAcc.actualPct >= 50 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                                color: stepAcc.actualPct >= 50 ? '#22c55e' : '#f59e0b',
                              }}
                            >
                              {stepAcc.actualPct}% follow this
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/25 mt-0.5 leading-relaxed">{step.detail}</p>

                        {/* What users actually do instead */}
                        {stepAcc && stepAcc.actualNext.length > 1 && i > 0 && (
                          <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                            <span className="text-[8px] text-white/20">Actually:</span>
                            {stepAcc.actualNext.map((alt) => {
                              const altMeta = getPageMeta(alt.page)
                              const isCorrect = alt.page === step.page
                              return (
                                <span
                                  key={alt.page}
                                  className="text-[8px] px-1 py-[1px] rounded font-medium"
                                  style={{
                                    backgroundColor: isCorrect ? `${altMeta.color}10` : 'rgba(255,255,255,0.03)',
                                    color: isCorrect ? altMeta.color : 'rgba(255,255,255,0.35)',
                                    border: isCorrect ? `1px solid ${altMeta.color}25` : '1px solid rgba(255,255,255,0.06)',
                                  }}
                                >
                                  {altMeta.label} {alt.pct}%
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Deviations */}
              {accuracy.actualAlternatives.length > 0 && (
                <div className="p-2 rounded-md bg-amber-500/[0.04] border border-amber-500/10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[9px] font-semibold text-amber-400/80 uppercase tracking-wider">Deviations Detected</span>
                  </div>
                  {accuracy.actualAlternatives.map((alt, i) => (
                    <div key={i} className="flex items-center gap-1 text-[10px] py-0.5">
                      <span className="text-white/40">From</span>
                      <span style={{ color: getPageMeta(alt.from).color }}>{getPageMeta(alt.from).label}</span>
                      <span className="text-white/20">→</span>
                      <span className="text-amber-400 font-medium">{getPageMeta(alt.toActual).label} ({alt.actualPct}%)</span>
                      <span className="text-white/20">instead of</span>
                      <span className="text-white/30 line-through">{getPageMeta(alt.toPredicted).label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}


// ─── vs Actual: side-by-side comparison per journey ──────────────────

function VsActualCard({ journey }: { journey: DesignedJourney }) {
  const accuracy = useJourneyAccuracy(journey)
  const Icon = journey.icon

  // Unique predicted page sequence
  const predictedPages: string[] = []
  for (const step of journey.steps) {
    if (predictedPages[predictedPages.length - 1] !== step.page) predictedPages.push(step.page)
  }

  const accuracyColor = accuracy.matchRate >= 60 ? '#22c55e' : accuracy.matchRate >= 30 ? '#f59e0b' : accuracy.matchRate > 0 ? '#ef4444' : '#64748b'

  return (
    <div className="rounded-lg border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Journey header */}
      <div className="px-3 py-2.5 border-b border-white/5 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${journey.color}12`, border: `1px solid ${journey.color}20` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: journey.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[12px] font-semibold text-white">{journey.title}</h3>
          <p className="text-[9px] text-white/25">{journey.description}</p>
        </div>
        {accuracy.hasData ? (
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-md flex-shrink-0"
            style={{ backgroundColor: `${accuracyColor}12`, border: `1px solid ${accuracyColor}25` }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accuracyColor }} />
            <span className="text-[11px] font-bold tabular-nums" style={{ color: accuracyColor }}>
              {accuracy.matchRate}% match
            </span>
          </div>
        ) : (
          <span className="text-[9px] text-white/20 bg-white/5 px-2 py-1 rounded-md flex-shrink-0">No data</span>
        )}
      </div>

      {/* Side-by-side: Predicted vs Actual */}
      <div className="grid grid-cols-2 divide-x divide-white/5">
        {/* Left: Predicted */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: journey.color }} />
            <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wider">Predicted</span>
          </div>
          <div className="space-y-0">
            {journey.steps.map((step, i) => {
              const meta = getPageMeta(step.page)
              return (
                <div key={i} className="flex items-start gap-2 py-1">
                  <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                    <div
                      className="w-[14px] h-[14px] rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{ backgroundColor: `${journey.color}15`, color: journey.color, border: `1px solid ${journey.color}30` }}
                    >
                      {i + 1}
                    </div>
                    {i < journey.steps.length - 1 && (
                      <svg width="2" height="14" className="my-0.5">
                        <line x1="1" y1="0" x2="1" y2="14" stroke={`${journey.color}25`} strokeWidth="1" strokeDasharray="2 2" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-white/80 font-medium leading-tight">{step.action}</div>
                    <span className="text-[8px] px-1 py-[1px] rounded mt-0.5 inline-block" style={{ backgroundColor: `${meta.color}10`, color: `${meta.color}80` }}>
                      {meta.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Actual */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wider">Actual</span>
            {!accuracy.hasData && <span className="text-[8px] text-white/15 italic ml-1">waiting for data...</span>}
          </div>
          {accuracy.hasData ? (
            <div className="space-y-0">
              {accuracy.stepAccuracy.map((step, i) => {
                const meta = getPageMeta(step.page)
                const isMatch = step.actualPct >= 50
                const topActual = step.actualNext.length > 0 ? step.actualNext[0] : null
                const actualDiffers = topActual && topActual.page !== step.page && i > 0

                return (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                      <div
                        className="w-[14px] h-[14px] rounded-full flex items-center justify-center text-[8px] font-bold"
                        style={{
                          backgroundColor: i === 0 ? `${meta.color}15` : isMatch ? 'rgba(34,197,94,0.1)' : actualDiffers ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)',
                          color: i === 0 ? meta.color : isMatch ? '#22c55e' : actualDiffers ? '#f59e0b' : 'rgba(255,255,255,0.3)',
                          border: `1px solid ${i === 0 ? `${meta.color}30` : isMatch ? 'rgba(34,197,94,0.2)' : actualDiffers ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {i + 1}
                      </div>
                      {i < accuracy.stepAccuracy.length - 1 && (
                        <svg width="2" height="14" className="my-0.5">
                          <line x1="1" y1="0" x2="1" y2="14" stroke={isMatch ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'} strokeWidth="1" strokeDasharray="2 2" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {i === 0 ? (
                        <>
                          <div className="text-[10px] text-white/80 font-medium leading-tight">{meta.label}</div>
                          <span className="text-[8px] text-white/25">{step.actualPct}% of sessions</span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-medium leading-tight ${isMatch ? 'text-emerald-400/90' : actualDiffers ? 'text-amber-400/90' : 'text-white/40'}`}>
                              {isMatch ? meta.label : actualDiffers ? getPageMeta(topActual!.page).label : meta.label}
                            </span>
                            <span className="text-[9px] font-bold tabular-nums" style={{ color: isMatch ? '#22c55e' : actualDiffers ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}>
                              {(actualDiffers ? topActual!.pct : step.actualPct)}%
                            </span>
                          </div>
                          {actualDiffers && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[8px] text-white/15">predicted:</span>
                              <span className="text-[8px] text-white/25 line-through">{meta.label}</span>
                              <span className="text-[8px] text-white/15">({step.actualPct}%)</span>
                            </div>
                          )}
                          {!actualDiffers && step.actualNext.length > 1 && (
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              {step.actualNext.filter(a => a.page !== step.page).slice(0, 2).map(alt => (
                                <span key={alt.page} className="text-[8px] text-white/20">
                                  also: {getPageMeta(alt.page).label} {alt.pct}%
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-[10px] text-white/20">Browse the site to generate live data</p>
              <p className="text-[8px] text-white/10 mt-1">Actions will appear here in real-time</p>
            </div>
          )}
        </div>
      </div>

      {/* Deviations summary */}
      {accuracy.actualAlternatives.length > 0 && (
        <div className="px-3 pb-3">
          <div className="p-2 rounded-md bg-amber-500/[0.04] border border-amber-500/10">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[9px] font-semibold text-amber-400/80 uppercase tracking-wider">Deviations</span>
            </div>
            <div className="space-y-0.5">
              {accuracy.actualAlternatives.map((alt, i) => (
                <div key={i} className="flex items-center gap-1 text-[9px]">
                  <span style={{ color: getPageMeta(alt.from).color }}>{getPageMeta(alt.from).label}</span>
                  <span className="text-white/15">→</span>
                  <span className="text-amber-400 font-medium">{getPageMeta(alt.toActual).label}</span>
                  <span className="text-amber-400/50 tabular-nums">{alt.actualPct}%</span>
                  <span className="text-white/15">not</span>
                  <span className="text-white/25 line-through">{getPageMeta(alt.toPredicted).label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function VsActualTab() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const events = useTrackingStore((s) => s.events)
  const hasData = mounted && events.length > 0
  const getSessionFlows = useTrackingStore((s) => s.getSessionFlows)
  const sessions = mounted ? getSessionFlows() : []

  return (
    <div className="space-y-3">
      {/* Summary banner */}
      <div className="rounded-xl border border-white/[0.06] p-4 flex items-center gap-4" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
          <IconArrowRight className="w-5 h-5 text-white/50" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">Predicted vs Actual</h3>
          <p className="text-[10px] text-white/30 mt-0.5">
            {hasData
              ? `Comparing ${DESIGNED_JOURNEYS.length} predicted flows against ${events.length} tracked events across ${sessions.length} sessions`
              : 'Browse the site to generate live comparison data'}
          </p>
        </div>
        {hasData && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-emerald-400/60">Live</span>
          </div>
        )}
      </div>

      {/* Side-by-side cards for each journey */}
      <div className="space-y-3">
        {DESIGNED_JOURNEYS.map((journey) => (
          <VsActualCard key={journey.id} journey={journey} />
        ))}
      </div>

      {/* Legend */}
      <div className="rounded-lg border border-white/[0.04] p-3 flex items-center gap-4 flex-wrap" style={{ backgroundColor: '#1a1a1a' }}>
        <span className="text-[9px] text-white/30 font-medium uppercase tracking-wider">Key:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-white/40">Matches prediction (≥50%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] text-white/40">Deviates from prediction</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-[10px] text-white/40">No data / waiting</span>
        </div>
      </div>
    </div>
  )
}

// ─── Predicted Flow Canvas — Draggable nodes with fluid tentacle connections ──

function PredictedFlowVisualizer({ hasData }: { hasData: boolean }) {
  const [activeJourney, setActiveJourney] = useState<string>(DESIGNED_JOURNEYS[0].id)
  const [animatingStep, setAnimatingStep] = useState(0)

  const journey = DESIGNED_JOURNEYS.find((j) => j.id === activeJourney)!

  // Auto-animate through steps of the selected journey
  useEffect(() => {
    setAnimatingStep(0)
    const timer = setInterval(() => {
      setAnimatingStep((prev) => {
        if (prev >= journey.steps.length - 1) return 0
        return prev + 1
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [activeJourney, journey.steps.length])

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-xs font-semibold text-white">Predicted User Journeys</h3>
        <p className="text-[10px] text-white/30 mt-0.5">Select a journey to see the expected step-by-step flow. Each shows the path we predict users will take.</p>
      </div>

      {/* Journey selector — horizontal tabs */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {DESIGNED_JOURNEYS.map((j) => {
          const Icon = j.icon
          const isActive = j.id === activeJourney
          return (
            <button
              key={j.id}
              onClick={() => setActiveJourney(j.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all cursor-pointer flex-shrink-0',
                isActive
                  ? 'bg-white/[0.06] shadow-sm'
                  : 'hover:bg-white/[0.03]'
              )}
              style={isActive ? { border: `1px solid ${j.color}30` } : { border: '1px solid transparent' }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${j.color}${isActive ? '20' : '0a'}`, border: `1px solid ${j.color}${isActive ? '40' : '15'}` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: j.color, opacity: isActive ? 1 : 0.5 }} />
              </div>
              <div className="min-w-0">
                <div className={cn('text-[11px] font-semibold truncate', isActive ? 'text-white' : 'text-white/50')}>{j.title}</div>
                <div className="text-[9px] text-white/25">{j.steps.length} steps</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active journey — animated step-by-step flow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeJourney}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-5"
        >
          {/* Description */}
          <p className="text-[11px] text-white/40 mb-5">{journey.description}</p>

          {/* Step-by-step horizontal flow */}
          <div className="flex items-start gap-0 overflow-x-auto scrollbar-hide pb-2">
            <style>{`
              @keyframes flowPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
              @keyframes tentacleFlow { to { stroke-dashoffset: -20; } }
            `}</style>
            {journey.steps.map((step, i) => {
              const stepMeta = getPageMeta(step.page)
              const StepIcon = stepMeta.icon
              const isAnimating = i <= animatingStep
              const isCurrent = i === animatingStep
              const isLast = i === journey.steps.length - 1

              return (
                <React.Fragment key={i}>
                  {/* Step node */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isAnimating ? 1 : 0.35,
                      scale: isCurrent ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex flex-col items-center flex-shrink-0"
                    style={{ width: 90 }}
                  >
                    {/* Step number */}
                    <div
                      className="text-[8px] font-bold mb-1.5 tabular-nums"
                      style={{ color: isAnimating ? journey.color : 'rgba(255,255,255,0.2)' }}
                    >
                      STEP {i + 1}
                    </div>

                    {/* Icon circle */}
                    <div className="relative mb-2">
                      {isCurrent && (
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: `${journey.color}10`,
                            boxShadow: `0 0 20px ${journey.color}20`,
                            animation: 'flowPulse 1.5s ease-in-out infinite',
                            transform: 'scale(1.6)',
                          }}
                        />
                      )}
                      <div
                        className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: isAnimating ? `${stepMeta.color}15` : 'rgba(255,255,255,0.03)',
                          border: `1.5px solid ${isAnimating ? stepMeta.color : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: isCurrent ? `0 0 12px ${stepMeta.color}30` : 'none',
                        }}
                      >
                        {isLast ? (
                          <IconCheck className="w-4 h-4" style={{ color: isAnimating ? journey.color : 'rgba(255,255,255,0.2)' }} />
                        ) : (
                          <StepIcon className="w-4 h-4" style={{ color: isAnimating ? stepMeta.color : 'rgba(255,255,255,0.2)' }} />
                        )}
                      </div>
                    </div>

                    {/* Action text */}
                    <div
                      className="text-[10px] font-semibold text-center leading-tight mb-0.5 transition-colors duration-300"
                      style={{ color: isAnimating ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}
                    >
                      {step.action}
                    </div>

                    {/* Page badge */}
                    <div
                      className="text-[8px] px-1.5 py-0.5 rounded font-medium transition-colors duration-300"
                      style={{
                        backgroundColor: isAnimating ? `${stepMeta.color}12` : 'transparent',
                        color: isAnimating ? `${stepMeta.color}` : 'rgba(255,255,255,0.15)',
                      }}
                    >
                      {stepMeta.label}
                    </div>

                    {/* Detail on hover */}
                    <div className="text-[8px] text-white/20 text-center mt-1 leading-tight max-w-[80px]">
                      {step.detail}
                    </div>
                  </motion.div>

                  {/* Connector arrow between steps */}
                  {!isLast && (
                    <div className="flex items-center flex-shrink-0 mt-[42px] mx-0.5">
                      <svg width="32" height="12" viewBox="0 0 32 12" className="flex-shrink-0">
                        <line
                          x1="0" y1="6" x2="24" y2="6"
                          stroke={isAnimating ? journey.color : 'rgba(255,255,255,0.08)'}
                          strokeWidth="1.5"
                          strokeDasharray="3 2"
                          strokeLinecap="round"
                          style={isAnimating ? { animation: 'tentacleFlow 1.5s linear infinite' } : undefined}
                        />
                        <polygon
                          points="24,3 30,6 24,9"
                          fill={isAnimating ? journey.color : 'rgba(255,255,255,0.08)'}
                          style={{ transition: 'fill 0.3s' }}
                        />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Step progress bar */}
          <div className="mt-4 flex items-center gap-1">
            {journey.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setAnimatingStep(i)}
                className="flex-1 h-1 rounded-full cursor-pointer transition-all duration-300"
                style={{
                  backgroundColor: i <= animatingStep ? journey.color : 'rgba(255,255,255,0.06)',
                  opacity: i === animatingStep ? 1 : i < animatingStep ? 0.5 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Live data comparison hint */}
          {hasData && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Switch to <strong className="text-white/50">&quot;vs Actual&quot;</strong> to see how this prediction compares to real user data
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Live Journey Visualizer — same step-by-step view but from real data ────

function ScrollableStepFlow({ children, totalSteps }: { children: React.ReactNode; totalSteps: number }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect() }
  }, [checkScroll, totalSteps])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -270 : 270, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Left fade + arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-start pl-1 cursor-pointer"
          style={{ background: 'linear-gradient(to right, #1a1a1a 30%, transparent)' }}
        >
          <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center hover:bg-white/[0.12] transition-colors">
            <IconChevronRight className="w-3.5 h-3.5 text-white/60 rotate-180" />
          </div>
        </button>
      )}

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex items-start gap-0 overflow-x-auto scrollbar-hide pb-2"
      >
        {children}
      </div>

      {/* Right fade + arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-end pr-1 cursor-pointer"
          style={{ background: 'linear-gradient(to left, #1a1a1a 30%, transparent)' }}
        >
          <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center hover:bg-white/[0.12] transition-colors">
            <IconChevronRight className="w-3.5 h-3.5 text-white/60" />
          </div>
        </button>
      )}

      {/* Step counter hint */}
      {(canScrollLeft || canScrollRight) && (
        <div className="absolute bottom-0 right-2 text-[8px] text-white/20">
          {totalSteps} steps total — scroll →
        </div>
      )}
    </div>
  )
}

function JourneySelector({
  liveJourneys,
  activeIndex,
  onSelect,
}: {
  liveJourneys: { id: string; flow: string[]; count: number; color: string }[]
  activeIndex: number
  onSelect: (i: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect() }
  }, [checkScroll, liveJourneys.length])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  return (
    <div className="relative border-b border-white/5">
      {/* Left fade + arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 flex items-center justify-start pl-1 cursor-pointer"
          style={{ background: 'linear-gradient(to right, #1a1a1a 40%, transparent)' }}
        >
          <IconChevronRight className="w-4 h-4 text-white/50 rotate-180" />
        </button>
      )}

      {/* Scrollable journey tabs */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide"
      >
        {liveJourneys.map((j, i) => {
          const firstMeta = getPageMeta(j.flow[0])
          const lastMeta = getPageMeta(j.flow[j.flow.length - 1])
          const Icon = lastMeta.icon
          const isActive = i === activeIndex
          return (
            <button
              key={j.id}
              onClick={() => onSelect(i)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all cursor-pointer flex-shrink-0',
                isActive ? 'bg-white/[0.06] shadow-sm' : 'hover:bg-white/[0.03]'
              )}
              style={isActive ? { border: `1px solid ${j.color}30` } : { border: '1px solid transparent' }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${j.color}${isActive ? '20' : '0a'}`, border: `1px solid ${j.color}${isActive ? '40' : '15'}` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: j.color, opacity: isActive ? 1 : 0.5 }} />
              </div>
              <div className="min-w-0">
                <div className={cn('text-[10px] font-semibold truncate max-w-[140px]', isActive ? 'text-white' : 'text-white/50')}>
                  {firstMeta.label} → {lastMeta.label}
                </div>
                <div className="text-[9px] text-white/25 flex items-center gap-1.5">
                  <span>{j.flow.length} steps</span>
                  <span>·</span>
                  <span>{j.count}× seen</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Right fade + arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 flex items-center justify-end pr-1 cursor-pointer"
          style={{ background: 'linear-gradient(to left, #1a1a1a 40%, transparent)' }}
        >
          <IconChevronRight className="w-4 h-4 text-white/50" />
        </button>
      )}
    </div>
  )
}

function LiveJourneyVisualizer({ sessionFlows, events }: { sessionFlows: string[][]; events: TrackingEvent[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animatingStep, setAnimatingStep] = useState(0)

  // Build journey objects from real session flows
  const liveJourneys = useMemo(() => {
    if (sessionFlows.length === 0) return []

    // Dedupe + rank by frequency
    const flowMap = new Map<string, { flow: string[]; count: number; lastSeen: string }>()
    for (const flow of sessionFlows) {
      const key = flow.join(' → ')
      const existing = flowMap.get(key)
      if (existing) {
        existing.count++
      } else {
        // Find last event timestamp for this flow
        const lastPage = flow[flow.length - 1]
        const lastEvent = [...events].reverse().find((e) => e.type === 'page_view' && e.target === lastPage)
        flowMap.set(key, { flow, count: 1, lastSeen: lastEvent?.ts || new Date().toISOString() })
      }
    }

    return Array.from(flowMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((entry, i) => {
        const meta = getPageMeta(entry.flow[entry.flow.length - 1])
        return {
          id: `live-${i}`,
          flow: entry.flow,
          count: entry.count,
          lastSeen: entry.lastSeen,
          color: meta.color,
          label: entry.flow.join(' → '),
        }
      })
  }, [sessionFlows, events])

  const activeJourney = liveJourneys[activeIndex] || null

  // Auto-animate through steps
  useEffect(() => {
    if (!activeJourney) return
    setAnimatingStep(0)
    const timer = setInterval(() => {
      setAnimatingStep((prev) => {
        if (prev >= activeJourney.flow.length - 1) return 0
        return prev + 1
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [activeIndex, activeJourney])

  if (liveJourneys.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] p-8 text-center" style={{ backgroundColor: '#1a1a1a' }}>
        <IconClick className="w-8 h-8 text-white/15 mx-auto mb-3" />
        <p className="text-xs text-white/30 font-medium">No journeys recorded yet</p>
        <p className="text-[10px] text-white/20 mt-1">Navigate between pages on the site to see real user journeys appear here</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-emerald-500/10 overflow-hidden relative" style={{ backgroundColor: '#1a1a1a', animation: 'live-border-glow 4s ease-in-out infinite' }}>
      {/* Scanning line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden live-scan-line" />

      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-white">Real User Journeys</h3>
          <p className="text-[10px] text-white/30 mt-0.5">
            Built from live tracking data — {liveJourneys.length} unique journey{liveJourneys.length !== 1 ? 's' : ''} recorded across {sessionFlows.length} session{sessionFlows.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[9px] font-semibold text-emerald-400/70 uppercase tracking-wider">Listening</span>
        </div>
      </div>

      {/* Journey selector — scrollable with arrow buttons */}
      <JourneySelector
        liveJourneys={liveJourneys}
        activeIndex={activeIndex}
        onSelect={(i) => { setActiveIndex(i); setAnimatingStep(0) }}
      />

      {/* Active journey — animated step-by-step */}
      {activeJourney && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeJourney.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-5"
          >
            {/* Journey meta */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1 text-[10px] text-white/40">
                <span className="text-white/60 font-semibold">{activeJourney.count} session{activeJourney.count !== 1 ? 's' : ''}</span> followed this path
              </div>
              <span className="text-white/10">·</span>
              <div className="text-[10px] text-white/30">Last seen {timeAgo(activeJourney.lastSeen)}</div>
            </div>

            {/* Step-by-step horizontal flow */}
            <ScrollableStepFlow totalSteps={activeJourney.flow.length}>
              <style>{`
                @keyframes flowPulseLive { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
                @keyframes tentacleFlowLive { to { stroke-dashoffset: -20; } }
              `}</style>
              {activeJourney.flow.map((page, i) => {
                const stepMeta = getPageMeta(page)
                const StepIcon = stepMeta.icon
                const isAnimating = i <= animatingStep
                const isCurrent = i === animatingStep
                const isLast = i === activeJourney.flow.length - 1

                return (
                  <React.Fragment key={i}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: isAnimating ? 1 : 0.35,
                        scale: isCurrent ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex flex-col items-center flex-shrink-0"
                      style={{ width: 90 }}
                    >
                      {/* Step number */}
                      <div
                        className="text-[8px] font-bold mb-1.5 tabular-nums"
                        style={{ color: isAnimating ? activeJourney.color : 'rgba(255,255,255,0.2)' }}
                      >
                        STEP {i + 1}
                      </div>

                      {/* Icon circle */}
                      <div className="relative mb-2">
                        {isCurrent && (
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: `${activeJourney.color}10`,
                              boxShadow: `0 0 20px ${activeJourney.color}20`,
                              animation: 'flowPulseLive 1.5s ease-in-out infinite',
                              transform: 'scale(1.6)',
                            }}
                          />
                        )}
                        <div
                          className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: isAnimating ? `${stepMeta.color}15` : 'rgba(255,255,255,0.03)',
                            border: `1.5px solid ${isAnimating ? stepMeta.color : 'rgba(255,255,255,0.08)'}`,
                            boxShadow: isCurrent ? `0 0 12px ${stepMeta.color}30` : 'none',
                          }}
                        >
                          <StepIcon className="w-4 h-4" style={{ color: isAnimating ? stepMeta.color : 'rgba(255,255,255,0.2)' }} />
                        </div>
                      </div>

                      {/* Page name */}
                      <div
                        className="text-[10px] font-semibold text-center leading-tight mb-0.5 transition-colors duration-300"
                        style={{ color: isAnimating ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}
                      >
                        {stepMeta.label}
                      </div>

                      {/* Page badge */}
                      <div
                        className="text-[8px] px-1.5 py-0.5 rounded font-medium transition-colors duration-300"
                        style={{
                          backgroundColor: isAnimating ? `${stepMeta.color}12` : 'transparent',
                          color: isAnimating ? stepMeta.color : 'rgba(255,255,255,0.15)',
                        }}
                      >
                        {page}
                      </div>
                    </motion.div>

                    {/* Connector arrow */}
                    {!isLast && (
                      <div className="flex items-center flex-shrink-0 mt-[42px] mx-0.5">
                        <svg width="32" height="12" viewBox="0 0 32 12" className="flex-shrink-0">
                          <line
                            x1="0" y1="6" x2="24" y2="6"
                            stroke={isAnimating ? activeJourney.color : 'rgba(255,255,255,0.08)'}
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                            strokeLinecap="round"
                            style={isAnimating ? { animation: 'tentacleFlowLive 1.5s linear infinite' } : undefined}
                          />
                          <polygon
                            points="24,3 30,6 24,9"
                            fill={isAnimating ? activeJourney.color : 'rgba(255,255,255,0.08)'}
                            style={{ transition: 'fill 0.3s' }}
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </ScrollableStepFlow>

            {/* Step progress bar */}
            <div className="mt-4 flex items-center gap-1">
              {activeJourney.flow.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAnimatingStep(i)}
                  className="flex-1 h-1 rounded-full cursor-pointer transition-all duration-300"
                  style={{
                    backgroundColor: i <= animatingStep ? activeJourney.color : 'rgba(255,255,255,0.06)',
                    opacity: i === animatingStep ? 1 : i < animatingStep ? 0.5 : 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

function PredictedFlowsTab() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const events = useTrackingStore((s) => s.events)
  const hasData = mounted && events.length > 0
  const [subTab, setSubTab] = useState<'predicted' | 'vs-actual'>('predicted')

  return (
    <div className="space-y-4">
      {/* Sub-tab toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06] w-fit">
        <button
          onClick={() => setSubTab('predicted')}
          className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
            subTab === 'predicted'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
          }`}
        >
          Predicted Flows
        </button>
        <button
          onClick={() => setSubTab('vs-actual')}
          className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
            subTab === 'vs-actual'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
          }`}
        >
          vs Actual
          {hasData && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'predicted' ? (
          <motion.div
            key="predicted"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Interactive Journey Visualizer */}
            <PredictedFlowVisualizer hasData={hasData} />

            {/* Journey cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {DESIGNED_JOURNEYS.map((journey, i) => (
                <PredictedJourneyCard key={journey.id} journey={journey} index={i} />
              ))}
            </div>

            {/* Legend */}
            {hasData && (
              <div className="rounded-lg border border-white/[0.04] p-3 flex items-center gap-4 flex-wrap" style={{ backgroundColor: '#1a1a1a' }}>
                <span className="text-[9px] text-white/30 font-medium uppercase tracking-wider">Key:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-white/40">≥60% match = accurate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-white/40">30-59% match = partial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-[10px] text-white/40">&lt;30% match = inaccurate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="text-[10px] text-white/40">No data</span>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="vs-actual"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <VsActualTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main page tabs ──────────────────────────────────────────────────

// ─── Device & Browser Stats Panel ─────────────────────────────────────

function DeviceBrowserStats() {
  const getDeviceStats = useTrackingStore((s) => s.getDeviceStats)
  const getSessionDetails = useTrackingStore((s) => s.getSessionDetails)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const stats = mounted ? getDeviceStats() : null
  const sessions = mounted ? getSessionDetails() : []
  const totalSessions = sessions.length

  if (!stats || totalSessions === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="flex items-center gap-2 mb-2">
          <IconDeviceMobile className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold text-white">Device & Browser Analytics</h3>
        </div>
        <p className="text-[10px] text-white/25 text-center py-4">Browse the site to generate device data</p>
      </div>
    )
  }

  const deviceColors: Record<string, string> = { mobile: '#f97316', tablet: '#a855f7', desktop: '#22c55e' }
  const browserColors: Record<string, string> = { Chrome: '#4285F4', 'Chrome (iOS)': '#4285F4', Safari: '#06b6d4', Firefox: '#f97316', 'Firefox (iOS)': '#f97316', Edge: '#22c55e', 'Edge (iOS)': '#22c55e', Opera: '#ef4444', 'Samsung Internet': '#6366f1', Brave: '#f97316', unknown: '#64748b' }
  const osColors: Record<string, string> = { iOS: '#64748b', iPadOS: '#a855f7', Android: '#22c55e', Windows: '#4285F4', macOS: '#a855f7', ChromeOS: '#f97316', Linux: '#f97316', unknown: '#64748b' }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Device + Browser + OS Breakdown */}
      <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="flex items-center gap-2 mb-1">
          <IconDeviceMobile className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold text-white">Device & Browser</h3>
        </div>
        <p className="text-[10px] text-white/30 mb-4">{totalSessions} session{totalSessions !== 1 ? 's' : ''} tracked</p>

        {/* Device type bar */}
        <div className="mb-4">
          <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">Device Type</div>
          <div className="flex items-center gap-1 h-6 rounded-lg overflow-hidden bg-white/[0.03]">
            {stats.devices.map((d) => (
              <motion.div
                key={d.name}
                initial={{ width: 0 }}
                animate={{ width: `${d.pct}%` }}
                transition={{ duration: 0.5 }}
                className="h-full flex items-center justify-center text-[9px] font-bold text-white/90"
                style={{ backgroundColor: deviceColors[d.name] || '#64748b', minWidth: d.pct > 5 ? undefined : 0 }}
                title={`${d.name}: ${d.pct}%`}
              >
                {d.pct > 10 && `${d.name} ${d.pct}%`}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2">
            {stats.devices.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: deviceColors[d.name] || '#64748b' }} />
                <span className="text-[10px] text-white/50 capitalize">{d.name}</span>
                <span className="text-[10px] text-white/70 font-semibold">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Browser breakdown */}
        <div className="mb-4">
          <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">Browser</div>
          <div className="space-y-1.5">
            {stats.browsers.map((b) => (
              <div key={b.name} className="flex items-center gap-2">
                <IconBrowser className="w-3 h-3" style={{ color: browserColors[b.name] || '#64748b' }} />
                <span className="text-[11px] text-white font-medium w-16">{b.name}</span>
                <div className="flex-1 h-4 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.pct}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: browserColors[b.name] || '#64748b' }}
                  />
                </div>
                <span className="text-[10px] text-white/50 tabular-nums w-12 text-right">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* OS breakdown */}
        <div>
          <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">Operating System</div>
          <div className="space-y-1.5">
            {stats.os.map((o) => (
              <div key={o.name} className="flex items-center gap-2">
                <IconDeviceDesktop className="w-3 h-3" style={{ color: osColors[o.name] || '#64748b' }} />
                <span className="text-[11px] text-white font-medium w-16">{o.name}</span>
                <div className="flex-1 h-4 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${o.pct}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: osColors[o.name] || '#64748b' }}
                  />
                </div>
                <span className="text-[10px] text-white/50 tabular-nums w-12 text-right">{o.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="flex items-center gap-2 mb-1">
          <IconClock className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold text-white">Session Details</h3>
        </div>
        <p className="text-[10px] text-white/30 mb-4">Per-session breakdown with device, pages visited, and duration</p>

        <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
          {sessions.slice(0, 20).map((sess, i) => {
            const durationStr = sess.durationMs < 60000
              ? `${Math.round(sess.durationMs / 1000)}s`
              : `${Math.round(sess.durationMs / 60000)}m`
            const deviceIcon = sess.device?.device === 'mobile' ? '📱' : sess.device?.device === 'tablet' ? '📱' : '🖥️'
            return (
              <motion.div
                key={sess.sessionId}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg p-3 bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{deviceIcon}</span>
                    <span className="text-[10px] text-white/50 font-mono">{sess.sessionId.slice(0, 16)}…</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30">{sess.eventCount} events</span>
                    <span className="text-[10px] text-white/50 font-semibold">{durationStr}</span>
                  </div>
                </div>
                {/* Device info */}
                {sess.device && (
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/50">{sess.device.browser}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/50">{sess.device.os}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/50">{sess.device.device}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/30">{sess.device.screenWidth}×{sess.device.screenHeight}</span>
                  </div>
                )}
                {/* Pages visited */}
                <div className="flex items-center gap-1 flex-wrap">
                  {sess.pages.map((page, pi) => {
                    const meta = getPageMeta(page)
                    return (
                      <React.Fragment key={pi}>
                        {pi > 0 && <span className="text-[8px] text-white/15">›</span>}
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </React.Fragment>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

type Tab = 'sitemap' | 'journeys' | 'map' | 'insights' | 'data' | 'history'

// ─── Date Range Selector ─────────────────────────────────────────────

const DATE_RANGE_OPTIONS: { id: DateRange; label: string }[] = [
  { id: 'last-1h', label: 'Last Hour' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last-7d', label: 'Last 7 Days' },
  { id: 'last-30d', label: 'Last 30 Days' },
  { id: 'all', label: 'All Time' },
]

function DateRangeSelector({ value, onChange, eventCount, totalCount }: {
  value: DateRangeFilter
  onChange: (filter: DateRangeFilter) => void
  eventCount: number
  totalCount: number
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        {DATE_RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange({ range: opt.id })}
            className={cn(
              'px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap',
              value.range === opt.id
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/35 hover:text-white/55 hover:bg-white/[0.03]'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {value.range !== 'all' && (
        <span className="text-[9px] text-white/25 tabular-nums flex-shrink-0">
          {eventCount} of {totalCount} events
        </span>
      )}
    </div>
  )
}

function UserOverviewPanel({
  userOverview,
  selectedUserId,
  onSelectUser,
}: {
  userOverview: ReturnType<typeof useTrackingStore.getState>['getUserOverview'] extends () => infer R ? R : never
  selectedUserId: string | null
  onSelectUser: (userId: string | null) => void
}) {
  const [showAll, setShowAll] = useState(false)
  const displayedUsers = showAll ? userOverview.users : userOverview.users.slice(0, 8)

  if (userOverview.totalUniqueUsers === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="flex items-center gap-2 mb-1">
          <IconUsers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold text-white">Users</h3>
        </div>
        <p className="text-[10px] text-white/25 text-center py-4">No user data yet. Navigate the site to generate tracking data.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconUsers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold text-white">Users</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold">{userOverview.totalUniqueUsers}</span>
        </div>
        {selectedUserId && (
          <button
            onClick={() => onSelectUser(null)}
            className="text-[9px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20"
          >
            ✕ Clear Filter
          </button>
        )}
      </div>
      <p className="text-[10px] text-white/30 mb-3">Each device/browser gets a persistent user ID. Click a user to filter all data to their sessions.</p>

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto scrollbar-hide">
        {displayedUsers.map((user) => {
          const isSelected = selectedUserId === user.userId
          const deviceEmoji = user.device?.device === 'mobile' ? '📱' : user.device?.device === 'tablet' ? '📱' : '💻'
          const shortId = user.userId.replace('user_', '').slice(0, 12)

          return (
            <button
              key={user.userId}
              onClick={() => onSelectUser(isSelected ? null : user.userId)}
              className={cn(
                'w-full text-left p-3 rounded-lg transition-all cursor-pointer border',
                isSelected
                  ? 'bg-cyan-500/[0.08] border-cyan-500/20'
                  : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08]'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{deviceEmoji}</span>
                    <span className={cn('text-[11px] font-semibold font-mono', isSelected ? 'text-cyan-400' : 'text-white/70')}>
                      {shortId}
                    </span>
                    {user.device && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/35 font-medium">
                        {user.device.browser} · {user.device.os}
                      </span>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-[9px] text-white/40">
                    <span><strong className="text-white/55">{user.sessionCount}</strong> session{user.sessionCount !== 1 ? 's' : ''}</span>
                    <span><strong className="text-white/55">{user.totalPageViews}</strong> page views</span>
                    <span><strong className="text-white/55">{user.pagesVisited.length}</strong> unique pages</span>
                    <span><strong className="text-white/55">{user.totalEvents}</strong> events</span>
                  </div>

                  {/* Top pages pills */}
                  {user.topPages.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {user.topPages.slice(0, 4).map((tp) => {
                        const meta = getPageMeta(tp.page)
                        return (
                          <span
                            key={tp.page}
                            className="text-[8px] px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: `${meta.color}12`, color: meta.color, border: `1px solid ${meta.color}20` }}
                          >
                            {meta.label} ({tp.views})
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Time info */}
                <div className="text-right flex-shrink-0">
                  <div className="text-[9px] text-white/25">Last seen</div>
                  <div className="text-[10px] text-white/50 font-medium">{timeAgo(user.lastSeen)}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {userOverview.users.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center py-2 mt-2 text-[10px] text-white/40 hover:text-white/60 transition-colors cursor-pointer"
        >
          {showAll ? 'Show less' : `Show ${userOverview.users.length - 8} more users`}
        </button>
      )}
    </div>
  )
}

function FrustrationCard({
  fs,
  emoji,
  color,
  bg,
  border,
  hasDetail,
}: {
  fs: ReturnType<typeof useTrackingStore.getState>['getFrustrationScores'] extends () => (infer R)[] ? R : never
  emoji: string
  color: string
  bg: string
  border: string
  hasDetail: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      {/* Clickable header */}
      <button
        onClick={() => hasDetail && setExpanded(!expanded)}
        className={cn(
          'w-full p-3 text-left transition-colors',
          hasDetail && 'cursor-pointer hover:bg-white/[0.03]'
        )}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-white capitalize">{fs.page}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{emoji}</span>
            {hasDetail && (
              <IconChevronDown
                className={cn('w-3 h-3 text-white/30 transition-transform duration-200', expanded && 'rotate-180')}
              />
            )}
          </div>
        </div>
        {/* Score bar */}
        <div className="w-full h-1.5 rounded-full bg-white/[0.06] mb-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fs.score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold tabular-nums" style={{ color }}>{fs.score}/100</span>
          <span className="text-[8px] text-white/25 capitalize">{fs.label}</span>
        </div>
        {/* Summary pills */}
        {hasDetail && (
          <div className="mt-2 pt-2 border-t border-white/[0.04] flex flex-wrap gap-1.5">
            {fs.rageClicks > 0 && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-medium">
                {fs.rageClicks} rage
              </span>
            )}
            {fs.loops > 0 && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                {fs.loops} loops
              </span>
            )}
            {fs.uTurns > 0 && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-medium">
                {fs.uTurns} U-turns
              </span>
            )}
            {fs.deadClicks > 0 && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium">
                {fs.deadClicks} dead
              </span>
            )}
            {!expanded && <span className="text-[8px] text-white/20 ml-auto">tap for details →</span>}
          </div>
        )}
      </button>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {expanded && hasDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              <div className="h-px bg-white/[0.06]" />

              {/* Rage click targets */}
              {fs.rageClickDetails.length > 0 && (
                <div>
                  <div className="text-[9px] text-red-400/70 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span>🖱️</span> Rage Click Targets
                  </div>
                  <div className="space-y-1">
                    {fs.rageClickDetails.map((rc, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-red-500/[0.06] border border-red-500/10">
                        <div className="w-4 h-4 rounded flex items-center justify-center bg-red-500/15 flex-shrink-0">
                          <span className="text-[8px] text-red-400 font-bold">{rc.count}</span>
                        </div>
                        <span className="text-[10px] text-white/70 font-medium flex-1 min-w-0 truncate">&quot;{rc.target}&quot;</span>
                        <span className={cn(
                          'text-[7px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0',
                          rc.severity === 'extreme' ? 'bg-red-500/15 text-red-400' :
                          rc.severity === 'moderate' ? 'bg-orange-500/15 text-orange-400' :
                          'bg-amber-500/15 text-amber-400'
                        )}>
                          {rc.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dead click targets */}
              {fs.deadClickDetails.length > 0 && (
                <div>
                  <div className="text-[9px] text-purple-400/70 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span>💀</span> Dead Click Targets
                  </div>
                  <div className="space-y-1">
                    {fs.deadClickDetails.map((dc, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-purple-500/[0.06] border border-purple-500/10">
                        <div className="w-4 h-4 rounded flex items-center justify-center bg-purple-500/15 flex-shrink-0">
                          <span className="text-[8px] text-purple-400 font-bold">{dc.count}</span>
                        </div>
                        <span className="text-[10px] text-white/70 font-medium flex-1 min-w-0 truncate">&quot;{dc.target}&quot;</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* U-turn details */}
              {fs.uTurnDetails.length > 0 && (
                <div>
                  <div className="text-[9px] text-orange-400/70 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span>↩️</span> U-Turn Routes
                  </div>
                  <div className="space-y-1">
                    {fs.uTurnDetails.map((ut, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-orange-500/[0.06] border border-orange-500/10">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <span className="text-[10px] font-medium capitalize" style={{ color: getPageMeta(ut.from).color }}>
                            {getPageMeta(ut.from).label}
                          </span>
                          <span className="text-[9px] text-white/20">→</span>
                          <span className="text-[10px] font-medium capitalize" style={{ color: getPageMeta(ut.to).color }}>
                            {getPageMeta(ut.to).label}
                          </span>
                          <span className="text-[9px] text-white/20">→ back</span>
                        </div>
                        <span className="text-[9px] text-orange-400/70 font-semibold flex-shrink-0">{ut.count}×</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loop details */}
              {fs.loopDetails.length > 0 && (
                <div>
                  <div className="text-[9px] text-amber-400/70 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span>🔄</span> Navigation Loops
                  </div>
                  <div className="space-y-1">
                    {fs.loopDetails.map((lp, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-amber-500/[0.06] border border-amber-500/10">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          {lp.pages.map((p, pi) => (
                            <React.Fragment key={pi}>
                              {pi > 0 && <span className="text-[9px] text-amber-400/40">↔</span>}
                              <span className="text-[10px] font-medium capitalize" style={{ color: getPageMeta(p).color }}>
                                {getPageMeta(p).label}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                        <span className="text-[9px] text-amber-400/70 font-semibold flex-shrink-0">{lp.occurrences}×</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function JourneyMapPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('sitemap')
  const [liveMapView, setLiveMapView] = useState<'journeys' | 'diagram' | 'activity'>('journeys')
  const [snapshotName, setSnapshotName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [comparingSnapshotId, setComparingSnapshotId] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({ range: 'all' })
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [, setRefreshTick] = useState(0) // forces re-render for "ago" text
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null) // null = all users

  // Hydration guard — store is persisted in localStorage so SSR has empty state
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  // Auto-refresh the "last updated" label every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => setRefreshTick((t) => t + 1), 15_000)
    return () => clearInterval(interval)
  }, [])

  // Update lastRefreshed when events change
  const eventCount = useTrackingStore((s) => s.events.length)
  useEffect(() => {
    if (eventCount > 0) setLastRefreshed(new Date())
  }, [eventCount])

  // Bi-directional Supabase sync on mount:
  // 1. Push local events → Supabase (so this device's data is in the cloud)
  // 2. Pull remote events → local store (so other devices' data is visible here)
  const [supabaseSynced, setSupabaseSynced] = useState(false)
  useEffect(() => {
    if (!hydrated || supabaseSynced) return
    setSupabaseSynced(true)

    import('@/lib/supabase/tracking').then(async ({ syncLocalEventsToSupabase, fetchAllRemoteEvents }) => {
      // Push local → Supabase
      const localEvents = useTrackingStore.getState().events
      if (localEvents.length > 0) {
        const pushed = await syncLocalEventsToSupabase(localEvents)
        if (pushed > 0) console.log(`[Tracking] Pushed ${pushed} local events to Supabase`)
      }

      // Pull Supabase → local (merges in events from other devices/sessions)
      const remoteEvents = await fetchAllRemoteEvents()
      if (remoteEvents.length > 0) {
        useTrackingStore.getState().mergeRemoteEvents(remoteEvents)
        console.log(`[Tracking] Merged ${remoteEvents.length} remote events from Supabase`)
        setLastRefreshed(new Date())
      }
    }).catch(() => { /* Supabase not configured */ })
  }, [hydrated, supabaseSynced])

  // Store
  const allEvents = useTrackingStore((s) => s.events)
  const isTracking = useTrackingStore((s) => s.isTracking)
  const setTracking = useTrackingStore((s) => s.setTracking)
  const clearEvents = useTrackingStore((s) => s.clearEvents)
  const snapshots = useTrackingStore((s) => s.snapshots)
  const saveSnapshot = useTrackingStore((s) => s.saveSnapshot)
  const deleteSnapshot = useTrackingStore((s) => s.deleteSnapshot)
  const getPostActionFunnel = useTrackingStore((s) => s.getPostActionFunnel)
  const getCrossProductBehavior = useTrackingStore((s) => s.getCrossProductBehavior)
  const getPageStickiness = useTrackingStore((s) => s.getPageStickiness)
  const getAutoInsights = useTrackingStore((s) => s.getAutoInsights)
  const getFunnelDropoff = useTrackingStore((s) => s.getFunnelDropoff)
  const getRageClicks = useTrackingStore((s) => s.getRageClicks)
  const getNavigationLoops = useTrackingStore((s) => s.getNavigationLoops)
  const getDeadClicks = useTrackingStore((s) => s.getDeadClicks)
  const getUTurns = useTrackingStore((s) => s.getUTurns)
  const getFrustrationScores = useTrackingStore((s) => s.getFrustrationScores)
  const getUserOverview = useTrackingStore((s) => s.getUserOverview)

  // User overview (always computed from all events, not filtered)
  const userOverview = useMemo(() => hydrated ? getUserOverview() : { totalUniqueUsers: 0, users: [] }, [hydrated, allEvents, getUserOverview])

  // Apply date range filter + optional user filter to events
  const events = useMemo(() => {
    if (!hydrated) return []
    let filtered = filterEventsByDateRange(allEvents, dateFilter)
    if (selectedUserId) {
      filtered = filtered.filter((e) => e.userId === selectedUserId)
    }
    return filtered
  }, [hydrated, allEvents, dateFilter, selectedUserId])

  // Compute filtered stats from filtered events
  const pageStats = useMemo(() => hydrated ? computePageStats(events) : [], [hydrated, events])
  const flowEdges = useMemo(() => hydrated ? computeFlowEdges(events) : [], [hydrated, events])
  const topActions = useMemo(() => hydrated ? computeTopActions(events) : [], [hydrated, events])
  const sessionFlows = useMemo(() => hydrated ? computeSessionFlows(events) : [], [hydrated, events])

  // These still use store-level computed (operate on all events for global insights)
  const crossProduct = hydrated ? getCrossProductBehavior() : []
  const stickiness = hydrated ? getPageStickiness() : []
  const autoInsights = hydrated ? getAutoInsights() : []
  const rageClicks = hydrated ? getRageClicks() : []
  const navLoops = hydrated ? getNavigationLoops() : []
  const deadClicks = hydrated ? getDeadClicks() : []
  const uTurns = hydrated ? getUTurns() : []
  const frustrationScores = hydrated ? getFrustrationScores() : []
  const [selectedFunnelPage, setSelectedFunnelPage] = useState<string>('home')

  const comparingSnapshot = snapshots.find((s) => s.id === comparingSnapshotId) || null

  const handleSaveSnapshot = () => {
    const name = snapshotName.trim() || `Snapshot ${new Date().toLocaleDateString()}`
    saveSnapshot(name)
    setSnapshotName('')
    setShowSaveInput(false)
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'sitemap', label: 'Site Map', icon: IconHome },
    { id: 'journeys', label: 'Predicted Flows', icon: IconArrowRight },
    { id: 'map', label: 'Live Map', icon: IconClick },
    { id: 'insights', label: 'Insights', icon: IconBolt },
    { id: 'data', label: 'Raw Data', icon: IconEye },
    { id: 'history', label: 'History', icon: IconClock },
  ]

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: 'var(--ds-page-bg, #1a1a1a)' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/10" style={{ backgroundColor: 'var(--ds-nav-bg, #2D2E2C)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <IconArrowLeft className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-white/10" />
            <h1 className="text-sm font-semibold text-white">Journey Map</h1>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/40 font-medium">LIVE TRACKING</span>
            {/* Tracking indicator */}
            <div className="flex items-center gap-1.5 ml-2">
              <div className={cn('w-2 h-2 rounded-full', isTracking ? 'bg-emerald-400 animate-pulse' : 'bg-red-400')} />
              <span className="text-[10px] text-white/40">{isTracking ? 'Tracking' : 'Paused'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTracking(!isTracking)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                isTracking ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
              )}
            >
              {isTracking ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => setShowSaveInput(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1"
            >
              <IconCamera className="w-3.5 h-3.5" /> Save Snapshot
            </button>
            <button
              onClick={() => router.push('/library')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border border-white/10"
            >
              Library →
            </button>
          </div>
        </div>
      </div>

      {/* Save snapshot modal */}
      <AnimatePresence>
        {showSaveInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowSaveInput(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 p-5"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <h3 className="text-sm font-semibold text-white mb-1">Save Snapshot</h3>
              <p className="text-[11px] text-white/40 mb-4">
                Save the current flow data so you can compare it later to see how user journeys change.
              </p>
              <input
                autoFocus
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveSnapshot()}
                placeholder={`Snapshot ${new Date().toLocaleDateString()}`}
                className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 mb-3"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSaveInput(false)}
                  className="flex-1 h-9 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSnapshot}
                  className="flex-1 h-9 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                >
                  Save
                </button>
              </div>
              <p className="text-[10px] text-white/25 mt-3 text-center">
                {events.length} events · {pageStats.length} pages · {flowEdges.length} flows will be captured
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Title + Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-1">User Journey Map</h1>
          <p className="text-sm text-white/45 max-w-2xl leading-relaxed">
            <strong className="text-white/60">Site Map</strong> shows every possible path through the site.{' '}
            <strong className="text-white/60">Predicted Flows</strong> define our expected user journeys.{' '}
            <strong className="text-white/60">Live Map</strong> proves it all with real tracking data — revealing the most common journeys, dead routes, and areas for improvement.
          </p>
        </motion.div>

        <div className="mb-6">
          <QuickStats events={events} pageStats={pageStats} flowEdges={flowEdges} sessionFlows={sessionFlows} uniqueUsers={userOverview.totalUniqueUsers} />
        </div>

        {/* Global Date Range Filter + User Filter */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <DateRangeSelector value={dateFilter} onChange={setDateFilter} eventCount={events.length} totalCount={allEvents.length} />

          {/* User filter */}
          {userOverview.totalUniqueUsers > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                <IconUsers className="w-3.5 h-3.5" />
                <span className="font-semibold text-white/60">{userOverview.totalUniqueUsers}</span>
                <span>unique user{userOverview.totalUniqueUsers !== 1 ? 's' : ''}</span>
              </div>
              <select
                value={selectedUserId || ''}
                onChange={(e) => setSelectedUserId(e.target.value || null)}
                className="h-7 px-2 rounded-md bg-white/[0.05] border border-white/10 text-[10px] text-white/70 outline-none focus:border-white/20 cursor-pointer appearance-none"
                style={{ minWidth: 140 }}
              >
                <option value="">All Users</option>
                {userOverview.users.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.device?.device === 'mobile' ? '📱' : u.device?.device === 'tablet' ? '📱' : '💻'}{' '}
                    {u.userId.slice(0, 15)}… ({u.sessionCount} session{u.sessionCount !== 1 ? 's' : ''})
                  </option>
                ))}
              </select>
              {selectedUserId && (
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="text-[9px] text-white/30 hover:text-white/60 transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active user filter banner */}
        {selectedUserId && (() => {
          const user = userOverview.users.find((u) => u.userId === selectedUserId)
          if (!user) return null
          const deviceEmoji = user.device?.device === 'mobile' ? '📱' : user.device?.device === 'tablet' ? '📱' : '💻'
          return (
            <div className="mb-4 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-cyan-500/[0.06] border border-cyan-500/15">
              <span className="text-sm">{deviceEmoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-semibold text-cyan-400">Viewing single user:</span>
                <span className="text-[11px] text-white/60 ml-1.5 font-mono">{selectedUserId.replace('user_', '').slice(0, 12)}</span>
                <span className="text-[10px] text-white/30 ml-2">
                  {user.device?.browser} · {user.device?.os} · {user.sessionCount} session{user.sessionCount !== 1 ? 's' : ''} · {user.totalEvents} events
                </span>
              </div>
              <button
                onClick={() => setSelectedUserId(null)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 font-medium"
              >
                Show All Users
              </button>
            </div>
          )
        })()}

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-white/10 pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors relative cursor-pointer',
                  activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/60'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.id === 'map' && activeTab === 'map' && (
                  <span className="flex items-center gap-1 ml-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                  </span>
                )}
                {tab.id === 'history' && snapshots.length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">
                    {snapshots.length}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="journey-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                  />
                )}
              </button>
            )
          })}

          <div className="flex-1" />

          {/* Clear data */}
          <button
            onClick={() => {
              if (window.confirm('Clear all tracking data? This cannot be undone.')) {
                clearEvents()
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-white/30 hover:text-red-400 transition-colors cursor-pointer"
          >
            <IconTrash className="w-3 h-3" /> Clear Data
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'sitemap' && (
            <motion.div
              key="sitemap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <SiteJourneyMap />

              {/* Journey Health Analysis */}
              <JourneyHealthAnalysis
                flowEdges={flowEdges}
                pageStats={pageStats}
                events={hydrated ? events : []}
                sessionFlows={sessionFlows}
              />
            </motion.div>
          )}

          {activeTab === 'journeys' && (
            <motion.div
              key="journeys"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PredictedFlowsTab />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Live status bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* View toggle */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06] w-fit">
                    <button
                      onClick={() => setLiveMapView('journeys')}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        liveMapView === 'journeys'
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                      }`}
                    >
                      Journey Steps
                    </button>
                    <button
                      onClick={() => setLiveMapView('diagram')}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        liveMapView === 'diagram'
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                      }`}
                    >
                      Flow Diagram
                    </button>
                    <button
                      onClick={() => setLiveMapView('activity')}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        liveMapView === 'activity'
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                      }`}
                    >
                      Activity Feed
                    </button>
                  </div>
                </div>

                {/* Live indicator + last updated + refresh */}
                <div className="flex items-center gap-3">
                  {/* Live badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                  </div>

                  {/* Last updated */}
                  <div className="flex items-center gap-1.5 text-[10px] text-white/35">
                    <IconClock className="w-3 h-3" />
                    <span>Updated {timeAgo(lastRefreshed.toISOString())}</span>
                  </div>

                  {/* Refresh button — pulls latest from Supabase */}
                  <button
                    onClick={() => {
                      setLastRefreshed(new Date())
                      import('@/lib/supabase/tracking').then(async ({ fetchAllRemoteEvents }) => {
                        const remoteEvents = await fetchAllRemoteEvents()
                        if (remoteEvents.length > 0) {
                          useTrackingStore.getState().mergeRemoteEvents(remoteEvents)
                          setLastRefreshed(new Date())
                        }
                      }).catch(() => {})
                    }}
                    className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/40 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 transition-all cursor-pointer"
                  >
                    <IconRefresh className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Comparison banner */}
              {comparingSnapshot && (
                <ComparisonView
                  current={{ pageStats, flowEdges, topActions }}
                  snapshot={comparingSnapshot}
                />
              )}

              <AnimatePresence mode="wait">
                {liveMapView === 'journeys' && (
                  <motion.div key="lv-journeys" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                    <LiveJourneyVisualizer sessionFlows={sessionFlows} events={hydrated ? events : []} />
                  </motion.div>
                )}

                {liveMapView === 'diagram' && (
                  <motion.div key="lv-diagram" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                    <LiveFlowDiagram
                      flowEdges={flowEdges}
                      pageStats={pageStats}
                      events={hydrated ? events : []}
                    />
                  </motion.div>
                )}

                {liveMapView === 'activity' && (
                  <motion.div key="lv-activity" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                    <DeepActivityFeed events={hydrated ? events : []} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Activity + Sessions + Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <ActivityTimeline />

                {/* Session Trails — grouped by frequency */}
                <div className="rounded-xl border border-white/[0.06] p-4 flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-semibold text-white">Top Journeys</h3>
                    <span className="text-[9px] text-white/25">{sessionFlows.length} session{sessionFlows.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-hide max-h-[400px]">
                    <SessionTrailsPanel sessionFlows={sessionFlows} />
                  </div>
                </div>

                {/* Top Actions */}
                <div className="rounded-xl border border-white/[0.06] p-4 flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-semibold text-white">Top Actions</h3>
                    <span className="text-[9px] text-white/25">{topActions.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <TopActionsTable actions={topActions} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Actionable Insights */}
              <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center gap-2 mb-2">
                  <IconBolt className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-semibold text-white">Actionable Insights</h3>
                </div>
                <p className="text-[10px] text-white/30 mb-5">Auto-generated from real tracking data. Each insight is rated, explained, and includes a recommendation.</p>

                <div className="space-y-3">
                  {autoInsights.map((insight, idx) => {
                    const sentimentConfig = {
                      good: { label: 'Healthy', icon: '✓', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.15)', accent: '#22c55e', labelBg: 'rgba(34,197,94,0.12)' },
                      bad: { label: 'Pain Point', icon: '!', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', accent: '#ef4444', labelBg: 'rgba(239,68,68,0.12)' },
                      opportunity: { label: 'Opportunity', icon: '→', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)', accent: '#f59e0b', labelBg: 'rgba(245,158,11,0.12)' },
                      neutral: { label: 'Info', icon: 'i', bg: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.12)', accent: '#6366f1', labelBg: 'rgba(99,102,241,0.1)' },
                    }
                    const sent = sentimentConfig[insight.sentiment || 'neutral']
                    const severityConfig = {
                      high: { label: 'High Priority', color: '#ef4444' },
                      medium: { label: 'Medium', color: '#f59e0b' },
                      low: { label: 'Low', color: '#64748b' },
                    }
                    const sev = severityConfig[insight.severity || 'low']

                    return (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                        className="rounded-lg overflow-hidden"
                        style={{ backgroundColor: sent.bg, border: `1px solid ${sent.border}` }}
                      >
                        {/* Header row */}
                        <div className="px-3.5 py-2.5 flex items-start gap-2.5">
                          {/* Sentiment icon */}
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                            style={{ backgroundColor: sent.labelBg, color: sent.accent }}
                          >
                            {sent.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Tags row */}
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: sent.labelBg, color: sent.accent }}
                              >
                                {sent.label}
                              </span>
                              {insight.severity && insight.severity !== 'low' && (
                                <span
                                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: `${sev.color}15`, color: sev.color }}
                                >
                                  {sev.label}
                                </span>
                              )}
                            </div>

                            {/* Main text */}
                            <p className="text-[12px] text-white/85 leading-relaxed font-medium">{insight.text}</p>

                            {/* Recommendation */}
                            {insight.recommendation && (
                              <div className="mt-2 flex gap-2 items-start">
                                <div className="text-[9px] text-white/25 font-semibold uppercase tracking-wider mt-0.5 flex-shrink-0">💡</div>
                                <p className="text-[11px] text-white/50 leading-relaxed">{insight.recommendation}</p>
                              </div>
                            )}
                          </div>

                          {/* Metric */}
                          {insight.metric && (
                            <div className="flex-shrink-0 text-right">
                              <span className="text-sm font-bold tabular-nums" style={{ color: sent.accent }}>{insight.metric}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Frustration Signals — Hotjar-style */}
              <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">😤</span>
                  <h3 className="text-xs font-semibold text-white">Frustration Signals</h3>
                </div>
                <p className="text-[10px] text-white/30 mb-5">Detects rage clicks, navigation loops, U-turns, and dead clicks — like Hotjar frustration scoring.</p>

                {/* Page Frustration Scores */}
                {frustrationScores.length > 0 ? (
                  <div className="space-y-5">
                    {/* Score overview */}
                    <div>
                      <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2.5">Page Frustration Scores</div>
                      <div className="space-y-2">
                        {frustrationScores.map((fs) => {
                          const emojiMap = { happy: '😊', neutral: '😐', frustrated: '😣', rage: '🤬' }
                          const colorMap = { happy: '#22c55e', neutral: '#64748b', frustrated: '#f59e0b', rage: '#ef4444' }
                          const bgMap = { happy: 'rgba(34,197,94,0.06)', neutral: 'rgba(255,255,255,0.02)', frustrated: 'rgba(245,158,11,0.06)', rage: 'rgba(239,68,68,0.08)' }
                          const borderMap = { happy: 'rgba(34,197,94,0.15)', neutral: 'rgba(255,255,255,0.06)', frustrated: 'rgba(245,158,11,0.15)', rage: 'rgba(239,68,68,0.2)' }
                          const hasDetail = fs.rageClicks > 0 || fs.loops > 0 || fs.uTurns > 0 || fs.deadClicks > 0
                          return (
                            <FrustrationCard
                              key={fs.page}
                              fs={fs}
                              emoji={emojiMap[fs.label]}
                              color={colorMap[fs.label]}
                              bg={bgMap[fs.label]}
                              border={borderMap[fs.label]}
                              hasDetail={hasDetail}
                            />
                          )
                        })}
                      </div>
                    </div>

                    {/* Rage Clicks detail */}
                    {rageClicks.length > 0 && (
                      <div>
                        <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">
                          🖱️ Rage Clicks <span className="text-red-400 normal-case">({rageClicks.length} detected)</span>
                        </div>
                        <p className="text-[10px] text-white/25 mb-2">Users clicking rapidly on the same element — indicates something isn&apos;t responding or is confusing.</p>
                        <div className="space-y-1.5">
                          {rageClicks.slice(0, 5).map((rc, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-red-500/[0.04] border border-red-500/10">
                              <div className="w-4 h-4 rounded flex items-center justify-center bg-red-500/15 flex-shrink-0">
                                <span className="text-[8px] text-red-400 font-bold">{rc.count}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] text-white/70 font-medium">&quot;{rc.target}&quot;</span>
                                <span className="text-[10px] text-white/30 ml-1.5">on {rc.page}</span>
                              </div>
                              <span className={cn(
                                'text-[8px] font-bold uppercase px-1.5 py-0.5 rounded',
                                rc.severity === 'extreme' ? 'bg-red-500/15 text-red-400' :
                                rc.severity === 'moderate' ? 'bg-orange-500/15 text-orange-400' :
                                'bg-amber-500/15 text-amber-400'
                              )}>
                                {rc.severity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation Loops detail */}
                    {navLoops.length > 0 && (
                      <div>
                        <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">
                          🔄 Navigation Loops <span className="text-amber-400 normal-case">({navLoops.length} detected)</span>
                        </div>
                        <p className="text-[10px] text-white/25 mb-2">Users going back and forth between the same pages — suggests confusion or inability to find something.</p>
                        <div className="space-y-1.5">
                          {navLoops.slice(0, 5).map((loop, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-amber-500/[0.04] border border-amber-500/10">
                              <div className="flex items-center gap-1 flex-1 min-w-0">
                                {loop.pages.map((p, pi) => (
                                  <React.Fragment key={pi}>
                                    {pi > 0 && <span className="text-[10px] text-amber-400/50">↔</span>}
                                    <span className="text-[11px] font-medium capitalize" style={{ color: getPageMeta(p).color }}>
                                      {getPageMeta(p).label}
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                              <span className="text-[10px] text-white/40 tabular-nums flex-shrink-0">{loop.occurrences}× avg {loop.avgLoopLength} steps</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* U-Turns detail */}
                    {uTurns.length > 0 && (
                      <div>
                        <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">
                          ↩️ U-Turns <span className="text-orange-400 normal-case">({uTurns.length} detected)</span>
                        </div>
                        <p className="text-[10px] text-white/25 mb-2">User visits a page then immediately navigates back — the destination didn&apos;t meet their expectations.</p>
                        <div className="space-y-1.5">
                          {uTurns.slice(0, 5).map((ut, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-orange-500/[0.04] border border-orange-500/10">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="text-[11px] font-medium capitalize" style={{ color: getPageMeta(ut.from).color }}>{getPageMeta(ut.from).label}</span>
                                <span className="text-[10px] text-white/20">→</span>
                                <span className="text-[11px] font-medium capitalize" style={{ color: getPageMeta(ut.to).color }}>{getPageMeta(ut.to).label}</span>
                                <span className="text-[10px] text-white/20">→ back</span>
                              </div>
                              <span className="text-[10px] text-white/40 tabular-nums flex-shrink-0">{ut.count}× ({ut.pctOfTraffic}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dead Clicks detail */}
                    {deadClicks.length > 0 && (
                      <div>
                        <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">
                          💀 Dead Clicks <span className="text-purple-400 normal-case">({deadClicks.length} detected)</span>
                        </div>
                        <p className="text-[10px] text-white/25 mb-2">Clicks that don&apos;t lead to any action or navigation — suggests unresponsive or misleading elements.</p>
                        <div className="space-y-1.5">
                          {deadClicks.slice(0, 5).map((dc, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-purple-500/[0.04] border border-purple-500/10">
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] text-white/70 font-medium">&quot;{dc.target}&quot;</span>
                                <span className="text-[10px] text-white/30 ml-1.5">on {dc.page}</span>
                              </div>
                              <span className="text-[10px] text-purple-400 tabular-nums flex-shrink-0">{dc.count} dead clicks</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No frustration detected */}
                    {rageClicks.length === 0 && navLoops.length === 0 && uTurns.length === 0 && deadClicks.length === 0 && (
                      <div className="text-center py-6">
                        <div className="text-2xl mb-2">😊</div>
                        <p className="text-[12px] text-white/50 font-medium">No frustration signals detected</p>
                        <p className="text-[10px] text-white/25 mt-1">Browse the site more to generate data. Rage clicks, loops, and U-turns will appear here when detected.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="text-[12px] text-white/50 font-medium">No data yet</p>
                    <p className="text-[10px] text-white/25 mt-1">Browse the site to generate tracking data for frustration analysis.</p>
                  </div>
                )}
              </div>

              {/* Post-Action Funnels */}
              <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center gap-2 mb-1">
                  <IconArrowRight className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-semibold text-white">Post-Action Funnels</h3>
                </div>
                <p className="text-[11px] text-white/35 mb-4">After a user does X, where do they go next?</p>

                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {['home', 'casino', 'sports', 'deposit', 'vip-hub', 'account', 'poker'].map((page) => {
                    const meta = getPageMeta(page)
                    const Icon = meta.icon
                    return (
                      <button
                        key={page}
                        onClick={() => setSelectedFunnelPage(page)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer',
                          selectedFunnelPage === page
                            ? 'text-white'
                            : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                        )}
                        style={selectedFunnelPage === page ? {
                          backgroundColor: `${meta.color}20`,
                          border: `1px solid ${meta.color}40`,
                          color: meta.color,
                        } : { border: '1px solid transparent' }}
                      >
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </button>
                    )
                  })}
                </div>

                {(() => {
                  const funnel = getPostActionFunnel(selectedFunnelPage)
                  if (funnel.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-xs text-white/30">No data yet for where users go after visiting {getPageMeta(selectedFunnelPage).label}.</p>
                        <p className="text-[10px] text-white/20 mt-1">Browse the site more to generate this data.</p>
                      </div>
                    )
                  }
                  const total = funnel.reduce((s, f) => s + f.count, 0)
                  return (
                    <div className="space-y-3">
                      {/* Visual funnel bar */}
                      <div className="h-8 rounded-lg overflow-hidden flex">
                        {funnel.map((item, i) => {
                          const meta = getPageMeta(item.target)
                          return (
                            <motion.div
                              key={item.target}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.pct}%` }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className="h-full flex items-center justify-center relative group"
                              style={{ backgroundColor: meta.color, minWidth: item.pct > 5 ? 'auto' : '20px' }}
                            >
                              {item.pct > 12 && (
                                <span className="text-[10px] font-bold text-white/90">{item.pct}%</span>
                              )}
                              {/* Tooltip */}
                              <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                                <div className="bg-black/95 rounded-md px-2 py-1 text-[10px] text-white whitespace-nowrap border border-white/10">
                                  {meta.label}: {item.pct}% ({item.count}/{total})
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>

                      {/* Legend + detail */}
                      <div className="space-y-1.5">
                        {funnel.map((item, i) => {
                          const meta = getPageMeta(item.target)
                          const Icon = meta.icon
                          return (
                            <div key={item.target} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: meta.color }} />
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <Icon className="w-3 h-3" style={{ color: meta.color }} />
                                <span className="text-xs text-white font-medium">{meta.label}</span>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-xs text-white/50 tabular-nums">{item.count} users</span>
                                <span className="text-xs font-bold tabular-nums" style={{ color: meta.color }}>{item.pct}%</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Cross-Product Behavior */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconTrophy className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-semibold text-white">Cross-Product Behavior</h3>
                  </div>
                  <p className="text-[11px] text-white/35 mb-4">Users who visit A also visit B in the same session</p>

                  {crossProduct.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-white/30">Visit multiple sections in one session to see overlap data</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {crossProduct.slice(0, 8).map((pair, i) => {
                        const metaA = getPageMeta(pair.pageA)
                        const metaB = getPageMeta(pair.pageB)
                        return (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                              <span className="text-[11px] font-medium" style={{ color: metaA.color }}>{metaA.label}</span>
                              <span className="text-[10px] text-white/20">↔</span>
                              <span className="text-[11px] font-medium" style={{ color: metaB.color }}>{metaB.label}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] text-white/30">{pair.sessions} sessions</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${metaA.color}15`, color: metaA.color }}>
                                  {pair.pctOfA}%
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${metaB.color}15`, color: metaB.color }}>
                                  {pair.pctOfB}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Page Stickiness */}
                <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconFlame className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-semibold text-white">Page Stickiness</h3>
                  </div>
                  <p className="text-[11px] text-white/35 mb-4">How engaged are users on each page?</p>

                  {stickiness.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-white/30">No stickiness data yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stickiness.slice(0, 8).map((item) => {
                        const meta = getPageMeta(item.page)
                        const Icon = meta.icon
                        const timeStr = item.avgTimeMs < 60000
                          ? `${Math.round(item.avgTimeMs / 1000)}s`
                          : `${Math.round(item.avgTimeMs / 60000)}m`
                        return (
                          <div key={item.page} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                            <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${meta.color}15` }}>
                              <Icon className="w-3 h-3" style={{ color: meta.color }} />
                            </div>
                            <span className="text-[11px] text-white font-medium flex-1 min-w-0">{meta.label}</span>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-center">
                                <div className="text-[11px] text-white font-semibold tabular-nums">{item.avgActions}</div>
                                <div className="text-[8px] text-white/25 uppercase">actions</div>
                              </div>
                              <div className="text-center">
                                <div className="text-[11px] text-white font-semibold tabular-nums">{timeStr}</div>
                                <div className="text-[8px] text-white/25 uppercase">avg time</div>
                              </div>
                              <div className="text-center">
                                <div className={cn('text-[11px] font-semibold tabular-nums', item.bounceRate > 50 ? 'text-red-400' : 'text-emerald-400')}>{item.bounceRate}%</div>
                                <div className="text-[8px] text-white/25 uppercase">bounce</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Device & Browser Stats */}
              <DeviceBrowserStats />

              {/* User Overview */}
              <UserOverviewPanel
                userOverview={userOverview}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />

              {/* Funnel Drop-Off */}
              <div className="rounded-xl border border-white/[0.06] p-5" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center gap-2 mb-1">
                  <IconChevronDown className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-semibold text-white">Funnel Drop-Off</h3>
                </div>
                <p className="text-[11px] text-white/35 mb-4">
                  From <span style={{ color: getPageMeta(selectedFunnelPage).color }}>{getPageMeta(selectedFunnelPage).label}</span>, what % of users reach each page?
                </p>

                {(() => {
                  const dropoff = getFunnelDropoff(selectedFunnelPage)
                  if (dropoff.length === 0) {
                    return (
                      <div className="text-center py-6">
                        <p className="text-xs text-white/30">Not enough session data. Visit {getPageMeta(selectedFunnelPage).label} then navigate to other pages.</p>
                      </div>
                    )
                  }
                  return (
                    <div className="space-y-1.5">
                      {dropoff.map((item, i) => {
                        const meta = getPageMeta(item.page)
                        const Icon = meta.icon
                        return (
                          <div key={item.page} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${meta.color}15` }}>
                              <Icon className="w-3 h-3" style={{ color: meta.color }} />
                            </div>
                            <span className="text-[11px] text-white font-medium w-20 flex-shrink-0">{meta.label}</span>
                            <div className="flex-1 h-5 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: `${meta.color}80` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.pct}%` }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                              />
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[11px] text-white/40 tabular-nums">{item.reached} users</span>
                              <span className="text-[11px] font-bold tabular-nums" style={{ color: meta.color }}>{item.pct}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl border border-white/10 p-4" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-white">Event Log</h3>
                  <span className="text-[10px] text-white/30">{events.length} events captured</span>
                </div>
                <EventLog />
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Saved Snapshots</h3>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    Compare how user flows have changed over time. Check a snapshot to compare it with live data.
                  </p>
                </div>
                <button
                  onClick={() => setShowSaveInput(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <IconCamera className="w-3.5 h-3.5" /> Save Current
                </button>
              </div>

              {snapshots.length === 0 ? (
                <div className="rounded-xl border border-white/10 p-12 text-center" style={{ backgroundColor: '#1a1a1a' }}>
                  <IconCamera className="w-10 h-10 text-white/15 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-white/40 mb-1">No Snapshots Yet</h3>
                  <p className="text-xs text-white/30 max-w-sm mx-auto">
                    Save a snapshot of the current flow data, then continue browsing. Save another snapshot later
                    to compare how user journeys have changed.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {comparingSnapshotId && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] text-indigo-400 font-medium">Comparing with live data</span>
                      <button
                        onClick={() => setComparingSnapshotId(null)}
                        className="text-[11px] text-white/40 hover:text-white cursor-pointer flex items-center gap-0.5"
                      >
                        <IconX className="w-3 h-3" /> Clear
                      </button>
                    </div>
                  )}
                  {snapshots.map((snapshot) => (
                    <SnapshotCard
                      key={snapshot.id}
                      snapshot={snapshot}
                      isComparing={comparingSnapshotId === snapshot.id}
                      onToggleCompare={() =>
                        setComparingSnapshotId(
                          comparingSnapshotId === snapshot.id ? null : snapshot.id
                        )
                      }
                      onDelete={() => deleteSnapshot(snapshot.id)}
                    />
                  ))}
                </div>
              )}

              {/* Show comparison on this tab too if active */}
              {comparingSnapshot && (
                <ComparisonView
                  current={{ pageStats, flowEdges, topActions }}
                  snapshot={comparingSnapshot}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-white/20 font-mono uppercase tracking-wider">Brand A UX Journey Map — Live Tracking</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </div>
  )
}
