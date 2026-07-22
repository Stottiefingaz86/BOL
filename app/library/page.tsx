'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconArrowLeft,
  IconSearch,
  IconCopy,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconExternalLink,
  IconBallFootball,
  IconMessageCircle2,
  IconTicket,
  IconHeart,
  IconPalette,
  IconBolt,
  IconCloudRain,
  IconDeviceGamepad2,
  IconLayoutGrid,
  IconGripVertical,
  IconResize,
  IconCode,
  IconEye,
  IconFilter,
  IconDice,
  IconUsers,
  IconBackspace,
  IconShare,
  IconGift,
  IconBrandTelegram,
  IconX,
  IconTrophy,
  IconCircleCheck,
  IconCurrencyDollar,
  IconMinus,
  IconMaximize,
  IconUpload,
  IconTrash,
  IconCrown,
  IconWallet,
  IconLayoutDashboard,
  IconLifebuoy,
  IconInfoCircle,
  IconStar,
  IconPlayerPlay,
  IconCards,
  IconMenu2,
  IconLoader2,
  IconBallBasketball,
  IconBallAmericanFootball,
  IconBallTennis,
  IconSettings,
  IconFlame,
  IconHome,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS } from '@/lib/sidebar-footer-nav'
import NumberFlow from '@number-flow/react'

// ── Real component imports (wrapped in try/catch safe wrappers) ──
// NOTE: These components are used in previews. If any crash during
// hydration the whole page goes blank, so we use lazy safe wrappers.
import dynamic from 'next/dynamic'

const StreakCounter = dynamic(() => import('@/components/vip/streak-counter').then(m => ({ default: m.StreakCounter })), { ssr: false })
const CashDropCode = dynamic(() => import('@/components/vip/cash-drop-code').then(m => ({ default: m.CashDropCode })), { ssr: false })
const ReloadClaim = dynamic(() => import('@/components/vip/reload-claim').then(m => ({ default: m.ReloadClaim })), { ssr: false })
const BetAndGet = dynamic(() => import('@/components/vip/bet-and-get').then(m => ({ default: m.BetAndGet })), { ssr: false })
const RainBackground = dynamic(() => import('@/components/rain-background').then(m => ({ default: m.RainBackground })), { ssr: false })
const InteractiveGridBackground = dynamic(() => import('@/components/interactive-grid-background').then(m => ({ default: m.InteractiveGridBackground })), { ssr: false })
const BetslipNumberPad = dynamic(() => import('@/components/betslip/number-pad').then(m => ({ default: m.BetslipNumberPad })), { ssr: false })

// ── AnimatedPillTabsPreview (static recreation) ─────────
function AnimatedPillTabsPreview() {
  const [active, setActive] = useState('For You')
  const tabs = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Live', 'Jackpots']
  return (
    <div className="w-full">
      <div className="inline-flex bg-white/5 p-0.5 h-auto gap-1 rounded-3xl relative items-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              'relative z-10 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out flex items-center gap-1.5 whitespace-nowrap cursor-pointer',
              active === tab ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
            )}
          >
            {active === tab && (
              <motion.div
                layoutId="libraryActiveTab"
                className="absolute inset-0 rounded-2xl -z-10"
                style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── FamilyDrawerPreview (interactive bottom-sheet demo) ──
function FamilyDrawerPreview() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'default' | 'confirm'>('default')
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[320px] mx-auto rounded-xl border border-white/10 overflow-hidden"
      style={{ height: 320, backgroundColor: 'var(--ds-page-bg, #111)' }}
    >
      {/* Page behind the drawer */}
      <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-3">
        <p className="text-[10px] text-white/30 text-center">Page content behind the drawer</p>
        <button
          onClick={() => { setOpen(true); setView('default') }}
          className="px-4 py-2 rounded-full text-xs font-medium text-white cursor-pointer"
          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
        >
          Open Drawer
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 bg-black/40 z-10 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setOpen(false); setView('default') }}
          />
        )}
      </AnimatePresence>

      {/* Bottom-sheet drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 bottom-0 z-20 rounded-t-[10px]"
            style={{ backgroundColor: 'var(--ds-card-bg, #1a1a1a)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 80 || info.velocity.y > 300) {
                setOpen(false)
                setView('default')
              }
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              {view === 'default' ? (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 space-y-3"
                >
                  <h3 className="text-sm font-semibold text-white mt-1">Place your bet</h3>
                  <p className="text-[11px] text-white/50">Liverpool ML · -150</p>
                  <div className="h-9 rounded-lg bg-white/5 border border-white/10 flex items-center px-3">
                    <span className="text-xs text-white/30">$</span>
                    <span className="text-xs text-white ml-1">10.00</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setOpen(false); setView('default') }}
                      className="flex-1 h-9 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setView('confirm')}
                      className="flex-1 h-9 rounded-lg text-[11px] text-white font-medium cursor-pointer"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    >
                      Place Bet
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mt-2" style={{ backgroundColor: '#97c43c' }}>
                    <IconCheck className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-white">Bet Placed!</p>
                  <p className="text-[10px] text-white/40">Liverpool ML · $10.00</p>
                  <button
                    onClick={() => { setOpen(false); setView('default') }}
                    className="w-full h-9 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/50 font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── AccountDrawerPreview (interactive right-slide demo) ──
function AccountDrawerPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto rounded-xl border border-white/10 overflow-hidden"
      style={{ height: 300, backgroundColor: 'var(--ds-page-bg, #111)' }}
    >
      {/* Page behind */}
      <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-3">
        <p className="text-[10px] text-white/30 text-center">Main page content</p>
        <button
          onClick={() => setOpen(true)}
          className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
        >
          <span className="text-xs font-semibold text-white">CH</span>
        </button>
        <p className="text-[9px] text-white/20">Tap avatar to open</p>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 bg-black/40 z-10 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Right-side drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-0 bottom-0 right-0 z-20 w-[220px] bg-white text-gray-900 border-l border-gray-200 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.5 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 60 || info.velocity.x > 200) setOpen(false)
            }}
          >
            {/* Header */}
            <div className="px-3 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-gray-600">CH</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900">Chris H.</div>
                <div className="text-[9px] text-gray-400">b1767721</div>
              </div>
              <button onClick={() => setOpen(false)} className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <IconX className="w-3 h-3 text-gray-500" />
              </button>
            </div>

            {/* Balance */}
            <div className="px-3 py-2.5 border-b border-gray-50">
              <div className="text-[9px] text-gray-400 uppercase tracking-wide">Balance</div>
              <div className="text-base font-bold text-gray-900">$1,234.56</div>
            </div>

            {/* Menu items */}
            <div className="flex-1 px-2 py-2 space-y-0.5 overflow-auto">
              {['My Bets', 'Deposit', 'Withdraw', 'Transactions', 'Bonus', 'Settings'].map((item) => (
                <div key={item} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="text-[11px] text-gray-700 font-medium">{item}</span>
                  <IconChevronRight className="w-3 h-3 ml-auto text-gray-300" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2.5 border-t border-gray-100">
              <button className="w-full h-8 rounded-lg bg-gray-100 text-[10px] font-medium text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── SideNavDrawerPreview (interactive left-slide demo) ───
function SideNavDrawerPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto rounded-xl border border-white/10 overflow-hidden"
      style={{ height: 300, backgroundColor: 'var(--ds-page-bg, #111)' }}
    >
      {/* Page behind */}
      <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-3">
        <p className="text-[10px] text-white/30 text-center">Main page content</p>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-[11px] text-white/70 font-medium cursor-pointer hover:bg-white/15 transition-colors"
        >
          <IconLayoutGrid className="w-3.5 h-3.5" /> Menu
        </button>
        <p className="text-[9px] text-white/20">Tap to open · Drag to dismiss</p>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 bg-black/40 z-10 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Left-side nav drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-0 bottom-0 left-0 z-20 w-[200px] flex flex-col border-r border-white/10"
            style={{ backgroundColor: 'var(--ds-sidebar-bg, #2d2d2d)' }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.5, right: 0 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x < -60 || info.velocity.x < -200) setOpen(false)
            }}
          >
            {/* Sports nav items */}
            <div className="flex-1 px-2 py-3 space-y-0.5 overflow-auto">
              {[
                { icon: '/sports_icons/soccer.svg', label: 'Soccer', active: true },
                { icon: '/sports_icons/Basketball.svg', label: 'Basketball', active: false },
                { icon: '/sports_icons/football.svg', label: 'Football', active: false },
                { icon: '/sports_icons/tennis.svg', label: 'Tennis', active: false },
                { icon: '/sports_icons/Hockey.svg', label: 'Hockey', active: false },
                { icon: '/sports_icons/mma.svg', label: 'MMA', active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all',
                    item.active ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  style={item.active ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                >
                  <img src={item.icon} alt={item.label} className="w-4 h-4 object-contain" />
                  <span>{item.label}</span>
                  <IconChevronRight className={cn('w-3 h-3 ml-auto', item.active ? 'text-white/60' : 'text-white/20')} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── SubNavGlassPreview (interactive AnimateTabs recreation) ─────────
function SubNavGlassPreview() {
  const [active, setActive] = useState('For You')
  const tabs = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New']
  return (
    <div className="w-full rounded-lg overflow-hidden">
      <div
        className="backdrop-blur-xl border-b border-white/10 py-3 px-4"
        style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)' }}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <div className="inline-flex bg-white/5 p-0.5 h-auto gap-1 rounded-3xl relative items-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={cn(
                  'relative z-10 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out flex items-center gap-1.5 whitespace-nowrap cursor-pointer',
                  active === tab ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {active === tab && (
                  <motion.div
                    layoutId="libSubNavTab"
                    className="absolute inset-0 rounded-2xl -z-10"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── QuickLinksPreview (interactive mobile quick links bar) ─────────
function QuickLinksPreview() {
  const [open, setOpen] = useState(true)
  const items = [
    { label: 'Home', isPrimary: true },
    { label: 'Sports' },
    { label: 'Live Betting' },
    { label: 'Casino' },
    { label: 'Live Casino' },
    { label: 'Poker' },
    { label: 'VIP Rewards' },
    { label: 'Other' },
  ]

  return (
    <div className="w-full rounded-lg overflow-hidden border border-white/10">
      <motion.div
        initial={false}
        animate={{ height: open ? 40 : 0 }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.3 }}
        className="overflow-hidden"
        style={{ backgroundColor: 'var(--ds-nav-bg, #2D2E2C)', opacity: 1, visibility: 'visible' }}
      >
        <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-white/10">
          {items.map((item) => (
            <button
              key={item.label}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-small text-xs font-medium transition-colors relative whitespace-nowrap cursor-pointer',
                item.isPrimary ? 'text-white' : 'text-white/70 hover:text-white'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-center py-2 border-t border-white/5" style={{ backgroundColor: 'var(--ds-page-bg, #1a1a1a)' }}>
        <button
          onClick={() => setOpen(!open)}
          className="text-[10px] text-white/30 hover:text-white/50 transition-colors cursor-pointer"
        >
          {open ? '↑ scroll down to hide' : '↓ scroll up to show'}
        </button>
      </div>
    </div>
  )
}

function SportsSubNavPreview() {
  const [activeSport, setActiveSport] = useState('Soccer')
  const [loadingNav, setLoadingNav] = useState<string | null>(null)
  const sports = [
    { icon: '/sports_icons/my-feed.svg', label: 'My Feed' },
    { icon: '/sports_icons/soccer.svg', label: 'Soccer' },
    { icon: '/sports_icons/Basketball.svg', label: 'Basketball' },
    { icon: '/sports_icons/football.svg', label: 'Football' },
    { icon: '/sports_icons/tennis.svg', label: 'Tennis' },
    { icon: '/sports_icons/Hockey.svg', label: 'Hockey' },
    { icon: '/sports_icons/mma.svg', label: 'MMA' },
    { icon: '/sports_icons/baseball.svg', label: 'Baseball' },
    { icon: '/sports_icons/table_tennis.svg', label: 'Table Tennis' },
  ]

  return (
    <div className="w-full rounded-lg" style={{ backgroundColor: 'var(--ds-nav-bg, #2D2E2C)' }}>
      <div className="pt-3 pb-4 px-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {sports.map((sport) => {
            const isActive = sport.label === activeSport
            return (
              <button
                key={sport.label}
                type="button"
                onClick={() => {
                  setLoadingNav(sport.label)
                  setTimeout(() => {
                    setActiveSport(sport.label)
                    setLoadingNav(null)
                  }, 500)
                }}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1.5 rounded-small transition-all duration-300 cursor-pointer flex-shrink-0 relative',
                  loadingNav === sport.label && 'opacity-40',
                  'hover:bg-white/5 active:bg-white/15',
                  isActive && 'bg-white/10'
                )}
                style={{ position: 'relative', overflow: 'visible' }}
              >
                <img
                  src={sport.icon}
                  alt={sport.label}
                  width={20}
                  height={20}
                  className={cn(
                    'object-contain transition-opacity duration-300 pointer-events-none',
                    isActive ? 'opacity-100' : 'opacity-70'
                  )}
                  decoding="sync"
                />
                <span
                  className={cn(
                    'text-[10px] font-medium whitespace-nowrap transition-colors duration-300 pointer-events-none',
                    isActive ? 'text-white' : 'text-white/70'
                  )}
                >
                  {sport.label}
                </span>
                {loadingNav === sport.label && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <IconLoader2 className="w-4 h-4 animate-spin text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'absolute left-1/2 -translate-x-1/2 -bottom-2 h-0.5 rounded-full transition-all duration-300 ease-in-out z-10',
                    isActive ? 'w-8 opacity-100' : 'w-0 opacity-0'
                  )}
                  style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : {}}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── MainNavPreview (interactive header nav — exact match to casino/poker/sports) ─────────
function MainNavPreview() {
  const [active, setActive] = useState('Casino')
  const [otherOpen, setOtherOpen] = useState(false)
  const navItems = ['Sports', 'Live Betting', 'Casino', 'Live Casino', 'Poker', 'VIP Rewards']
  // Items that get the animated pill (layoutId shared)
  const pillItems = ['Sports', 'Casino', 'Live Casino', 'Poker', 'VIP Rewards']
  return (
    <div className="w-full rounded-lg overflow-hidden border border-white/10 relative">
      <div
        className="border-b border-white/10 h-16 flex items-center justify-between px-4"
        style={{ backgroundColor: 'var(--ds-nav-bg, #2D2E2C)' }}
      >
        {/* Left — sidebar toggle + nav pills + "Other" dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 mr-1 flex-shrink-0">
            <button className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
            <div className="w-px h-5 bg-white/20" />
          </div>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={cn(
                'relative h-10 px-4 py-2 rounded-small text-sm font-medium transition-colors cursor-pointer overflow-visible flex-shrink-0',
                active === item ? 'text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              {active === item && pillItems.includes(item) && (
                <motion.div
                  layoutId="libMainNavPill"
                  layout="position"
                  className="absolute inset-0 rounded-small -z-10"
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{item}</span>
            </button>
          ))}
          {/* Other dropdown */}
          <button
            onClick={() => setOtherOpen(!otherOpen)}
            className="relative h-10 px-4 py-2 rounded-small text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0"
          >
            Other
            <IconChevronDown className={cn('h-3 w-3 transition-transform duration-200', otherOpen && 'rotate-180')} />
          </button>
        </div>
        {/* Right — VIP crown, separator, avatar+balance, DEPOSIT, chat */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          {/* VIP Crown */}
          <button className="h-8 w-8 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center hover:bg-yellow-400/30 hover:border-yellow-400/40 transition-colors cursor-pointer">
            <IconCrown className="text-yellow-400 w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-white/20" />
          {/* Avatar + Balance */}
          <button className="flex items-center gap-1.5 px-2 py-1 rounded-small bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="relative">
              <div className="h-6 w-6 rounded-full bg-white/10 border border-white/20 group-hover:border-white/40 flex items-center justify-center transition-colors">
                <span className="text-[10px] font-semibold text-white">CH</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
            </div>
            <span className="text-xs font-medium text-white tabular-nums">$10.00</span>
          </button>
          {/* Wallet */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-small bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-xs font-semibold text-white">
            <IconWallet className="w-3.5 h-3.5 text-white" />
            Wallet
          </button>
          {/* Chat toggle */}
          <button className="h-8 w-8 rounded-small bg-white/5 flex items-center justify-center border border-transparent hover:bg-white/10 transition-colors cursor-pointer relative">
            <IconMessageCircle2 className="w-4 h-4 text-white/70" strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#2d2d2d] animate-pulse" />
          </button>
        </div>
      </div>
      {/* "Other" dropdown panel */}
      <AnimatePresence initial={false}>
        {otherOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="overflow-hidden"
            style={{ backgroundColor: 'var(--ds-nav-bg, #2D2E2C)' }}
          >
            <div className="px-4 py-2 flex flex-col border-t border-white/5">
              {['Esports', 'Racebook', 'Contests', 'Virtuals'].map((item) => (
                <button key={item} className="text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-small transition-colors cursor-pointer">
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── SubNavWithIconsPreview (casino sub-nav with search + favorite) ─────────
function SubNavWithIconsPreview() {
  const [active, setActive] = useState('For You')
  const [iconTab, setIconTab] = useState<'search' | 'favorite'>('search')
  const tabs = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Blackjack', 'Live', 'Jackpots', 'Early', 'Staff Picks', 'Exclusive', 'New']
  return (
    <div className="w-full rounded-lg overflow-hidden">
      <div
        className="backdrop-blur-xl border-b border-white/10 py-3 px-4"
        style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)' }}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {/* Icon tabs — search + favourite */}
          <div className="flex-shrink-0">
            <div className="bg-white/5 p-0.5 h-auto gap-0.5 rounded-3xl border-0 flex items-center">
              <button
                onClick={() => { setIconTab('search'); setActive('For You') }}
                className={cn(
                  'rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer',
                  iconTab === 'search' && active === ''
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <IconSearch className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setIconTab('favorite'); setActive('') }}
                className={cn(
                  'rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer',
                  iconTab === 'favorite'
                    ? 'text-pink-500 bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <IconHeart className={cn('w-3.5 h-3.5 transition-colors', iconTab === 'favorite' && 'fill-pink-500 text-pink-500')} />
              </button>
            </div>
          </div>
          {/* AnimateTabs pills */}
          <div className="inline-flex bg-white/5 p-0.5 h-auto gap-1 rounded-3xl relative items-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActive(tab); setIconTab('search') }}
                className={cn(
                  'relative z-10 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out flex items-center gap-1.5 whitespace-nowrap cursor-pointer',
                  active === tab ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {active === tab && (
                  <motion.div
                    layoutId="libSubNavIconsTab"
                    className="absolute inset-0 rounded-2xl -z-10"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SidebarNavPreview (interactive — desktop + mobile) ─────────
function SidebarNavPreview() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('My Favorites')
  const [mobileOtherOpen, setMobileOtherOpen] = useState(false)
  const [activeQuickLink, setActiveQuickLink] = useState('Casino')

  // Casino sidebar items
  const casinoTop = [
    { icon: IconHeart, label: 'My Favorites' },
    { icon: IconPlayerPlay, label: 'Last Game Played', sub: 'Golden Fortune' },
    { icon: IconDice, label: 'Play Random' },
  ]
  const casinoMenu = [
    { icon: IconStar, label: 'Popular Games' },
    { icon: IconCards, label: 'Slots' },
    { icon: IconLayoutGrid, label: 'Blackjack' },
    { icon: IconDeviceGamepad2, label: 'Video Poker' },
    { icon: IconFlame, label: 'Table Games' },
    { icon: IconBolt, label: 'Live Casino' },
  ]
  const bottomItems = [...DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS]
  const quickLinks = ['Home', 'Sports', 'Live Betting', 'Casino', 'Live Casino', 'Poker', 'VIP Rewards']
  const otherLinks = ['Esports', 'Racebook', 'Contests', 'Virtuals']

  // Sidebar width
  const sidebarW = viewMode === 'mobile' ? '280px' : collapsed ? '48px' : '256px'

  return (
    <div className="w-full">
      {/* Toggle desktop/mobile */}
      <div className="flex items-center gap-2 mb-3">
        {(['desktop', 'mobile'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => { setViewMode(mode); if (mode === 'mobile') setCollapsed(false) }}
            className={cn(
              'px-3 py-1.5 rounded-small text-xs font-medium transition-colors cursor-pointer',
              viewMode === mode ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            )}
          >
            {mode === 'desktop' ? 'Desktop' : 'Mobile'}
          </button>
        ))}
        {viewMode === 'desktop' && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto px-3 py-1.5 rounded-small text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        )}
      </div>

      <div className="flex rounded-lg overflow-hidden border border-white/10" style={{ backgroundColor: '#1a1a1a' }}>
        {/* Sidebar */}
        <motion.div
          animate={{ width: sidebarW }}
          transition={{ duration: 0.2, ease: 'linear' }}
          className="flex-shrink-0 border-r border-white/10 flex flex-col overflow-hidden"
          style={{ backgroundColor: '#2d2d2d', height: '480px' }}
        >
          {/* Sidebar Header — logo + close (mobile) */}
          <div className="h-14 px-4 flex items-center flex-shrink-0 relative" style={{ backgroundColor: viewMode === 'mobile' ? '#2d2d2d' : 'rgba(45,45,45,0.75)' }}>
            <div className="relative w-full h-full flex items-center justify-center">
              {viewMode === 'mobile' && (
                <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </button>
              )}
              {collapsed && viewMode === 'desktop' ? (
                <span className="text-white font-bold text-sm">B</span>
              ) : (
                <div className="h-5 w-[110px] flex items-center">
                  <svg viewBox="0 0 120 20" className="h-5 w-[110px] text-white">
                    <text x="0" y="15" fill="currentColor" fontSize="14" fontWeight="700" fontFamily="system-ui">BETONLINE</text>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Quick Links — horizontal scrolling strip */}
          {viewMode === 'mobile' && (
            <>
              <div className="border-b border-white/5" style={{ backgroundColor: 'rgba(45,45,45,0.92)' }}>
                <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide px-1">
                  {quickLinks.map(item => {
                    const isCurrent = item === activeQuickLink
                    return (
                      <button
                        key={item}
                        onClick={() => setActiveQuickLink(item)}
                        className={cn(
                          'flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors relative cursor-pointer',
                          isCurrent ? 'text-white font-bold' : 'text-white/35 font-medium hover:text-white/60'
                        )}
                      >
                        {item}
                        {isCurrent && (
                          <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }} />
                        )}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setMobileOtherOpen(!mobileOtherOpen)}
                    className="flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap text-white/35 font-medium hover:text-white/60 flex items-center gap-0.5 cursor-pointer"
                  >
                    Other
                    <IconChevronDown className={cn('w-3 h-3 transition-transform duration-200', mobileOtherOpen && 'rotate-180')} />
                  </button>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {mobileOtherOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden border-b border-white/5"
                    style={{ backgroundColor: 'rgba(45,45,45,0.95)' }}
                  >
                    <div className="flex items-center gap-0 px-1 py-1">
                      {otherLinks.map(item => (
                        <button key={item} className="flex-shrink-0 px-3 py-2 text-[13px] text-white/50 font-medium hover:text-white whitespace-nowrap transition-colors cursor-pointer">{item}</button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-1.5 space-y-0.5">
            {/* Featured top items (square icon style) */}
            <div className="space-y-0.5">
              {viewMode === 'mobile' && <div className="px-2 py-1 text-[10px] text-white/40 font-medium uppercase tracking-wider">Casino Menu</div>}
              {casinoTop.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveItem(item.label)}
                    className={cn(
                      'w-full flex items-center gap-2.5 rounded-small text-sm font-medium transition-all cursor-pointer',
                      collapsed && viewMode === 'desktop' ? 'px-1.5 py-2 justify-center' : 'px-3 py-2.5',
                      activeItem === item.label ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                    )}
                    style={activeItem === item.label ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                  >
                    <div className={cn('w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0', activeItem === item.label ? 'bg-white/20' : 'bg-white/10')}>
                      <Icon strokeWidth={1.5} className="w-4 h-4" />
                    </div>
                    {(!collapsed || viewMode === 'mobile') && (
                      item.sub ? (
                        <div className="flex flex-col leading-tight">
                          <span>{item.label}</span>
                          <span className="text-[11px] text-white/40 font-normal">{item.sub}</span>
                        </div>
                      ) : <span>{item.label}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Separator */}
            <div className="border-b border-white/10 mx-1 my-2" />

            {/* Menu items */}
            {casinoMenu.map(item => {
              const Icon = item.icon
              const isActive = activeItem === item.label
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveItem(item.label)}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-small text-sm font-medium transition-all cursor-pointer',
                    collapsed && viewMode === 'desktop' ? 'px-1.5 py-2 justify-center' : 'px-3 py-2.5',
                    isActive ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                  style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                >
                  <Icon strokeWidth={1.5} className="w-5 h-5 flex-shrink-0" />
                  {(!collapsed || viewMode === 'mobile') && <span>{item.label}</span>}
                </button>
              )
            })}

            {/* Spacer */}
            <div className="flex-1 min-h-[24px]" />
          </div>

          {/* Bottom — VIP Hub, Promotions, Wallet, Need Help */}
          <div className="border-t border-white/10 py-2 px-1.5 space-y-0.5 flex-shrink-0">
            {bottomItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-small text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer',
                    collapsed && viewMode === 'desktop' ? 'px-1.5 py-2 justify-center' : 'px-3 py-2.5'
                  )}
                >
                  <Icon strokeWidth={1.5} className="w-5 h-5 flex-shrink-0" />
                  {(!collapsed || viewMode === 'mobile') && <span>{item.label}</span>}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Content placeholder */}
        <div className="flex-1 p-6 flex items-center justify-center min-w-0">
          <span className="text-white/20 text-sm">Page Content</span>
        </div>
      </div>
    </div>
  )
}

// ── SportsbarNavPreview (sports sidebar with expandable items) ─────────
function SportsSidebarPreview() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('My Feed')
  const sidebarW = collapsed ? '84px' : '320px'

  const features = [
    { icon: IconHome, label: 'Home' },
    { icon: IconTicket, label: 'My Bets' },
    { icon: IconHeart, label: 'My Feed' },
    { icon: IconBolt, label: 'Live Betting' },
    { icon: IconTrophy, label: 'World Cup Hub' },
    { icon: IconPlayerPlay, label: 'Odds Boosters' },
    { icon: '/sports_icons/Same Game Parlays.svg', label: 'Same Game Parlays' },
    { icon: '/sports_icons/megaparlays.svg', label: 'Mega Parlays' },
  ]

  const topSports = [
    { icon: '/sports_icons/baseball.svg', label: 'Baseball' },
    { icon: '/sports_icons/Basketball.svg', label: 'Basketball' },
    { icon: '/sports_icons/football.svg', label: 'Football' },
    { icon: '/sports_icons/soccer.svg', label: 'Soccer' },
    { icon: '/sports_icons/baseball.svg', label: 'Baseball' },
    { icon: '/sports_icons/Basketball.svg', label: 'Basketball' },
    { icon: '/sports_icons/Hockey.svg', label: 'Hockey' },
    { icon: '/sports_icons/football.svg', label: 'Football' },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setCollapsed(false)}
          className={cn('px-3 py-1.5 rounded-small text-xs font-medium transition-colors cursor-pointer', !collapsed ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5')}
        >
          Expanded
        </button>
        <button
          onClick={() => setCollapsed(true)}
          className={cn('px-3 py-1.5 rounded-small text-xs font-medium transition-colors cursor-pointer', collapsed ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5')}
        >
          Collapsed
        </button>
      </div>

      <div className="rounded-lg overflow-hidden border border-white/10" style={{ backgroundColor: '#1a1a1a' }}>
        <motion.div
          animate={{ width: sidebarW }}
          transition={{ duration: 0.2, ease: 'linear' }}
          className="border-r border-white/10 flex flex-col overflow-hidden"
          style={{ backgroundColor: '#2d2d2d', height: '560px' }}
        >
          <div className={cn('h-16 px-4 flex items-center flex-shrink-0', collapsed ? 'justify-center' : 'justify-center')}>
            {collapsed ? (
              <span className="text-[#ee3536] font-bold text-6xl leading-none -mt-1">B</span>
            ) : (
              <div className="h-8 w-[190px] flex items-center justify-center">
                <svg viewBox="0 0 210 30" className="h-8 w-[190px]">
                  <text x="0" y="22" fill="#ee3536" fontSize="18" fontWeight="700" fontFamily="system-ui">BET</text>
                  <text x="58" y="22" fill="#f3f3f3" fontSize="18" fontWeight="700" fontFamily="system-ui">ONLINE</text>
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3">
            <button
              onClick={() => setActiveItem('Settings')}
              className={cn(
                'w-full flex items-center gap-3 rounded-small text-sm font-medium transition-all cursor-pointer text-white/80 hover:text-white hover:bg-white/5',
                collapsed ? 'justify-center py-3 px-0 mb-2' : 'px-3 py-2.5 mb-2'
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <IconSettings className="w-5 h-5" />
              </div>
              {!collapsed && <span className="text-2xl/none text-white/80">{'Settings'.replace('Settings', 'Settings')}</span>}
            </button>

            {!collapsed && (
              <div className="px-1 pb-2 pt-1 text-[11px] text-white/45 font-medium uppercase tracking-wide">Features</div>
            )}

            <div className="space-y-1 mb-2">
              {features.map((item) => {
                const isActive = activeItem === item.label
                const Icon = typeof item.icon === 'string' ? null : item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveItem(item.label)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-small text-sm font-medium transition-all cursor-pointer',
                      collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
                      isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      {Icon ? <Icon strokeWidth={1.6} className="w-5 h-5" /> : <img src={item.icon as string} alt={item.label} className="w-5 h-5 object-contain" />}
                    </div>
                    {!collapsed && <span className="text-[20px] leading-none">{item.label}</span>}
                  </button>
                )
              })}
            </div>

            <div className="border-b border-white/10 mx-1 my-3" />

            <button
              className={cn(
                'w-full flex items-center gap-3 rounded-small text-sm font-medium text-white/75 hover:text-white hover:bg-white/5 transition-all cursor-pointer',
                collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <IconTrophy strokeWidth={1.6} className="w-5 h-5" />
              </div>
              {!collapsed && (
                <>
                  <span className="text-[20px] leading-none">Top Leagues</span>
                  <IconChevronRight className="w-5 h-5 ml-auto text-white/60" />
                </>
              )}
            </button>

            <div className="border-b border-white/10 mx-1 my-3" />

            {!collapsed && (
              <div className="px-1 pb-2 pt-1 text-[11px] text-white/45 font-medium uppercase tracking-wide">Top Sports</div>
            )}

            <div className="space-y-1">
              {topSports.map((sport, idx) => (
                <button
                  key={`${sport.label}-${idx}`}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-small text-sm font-medium text-white/75 hover:text-white hover:bg-white/5 transition-all cursor-pointer',
                    collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
                  )}
                >
                  <img src={sport.icon} alt={sport.label} className="w-6 h-6 object-contain shrink-0" />
                  {!collapsed && <span className="text-[20px] leading-none">{sport.label}</span>}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── CasinoTilesPreview (different tile types) ──────────────
function CasinoTilesPreview() {
  const [viewType, setViewType] = useState<'square' | 'rectangle' | 'live'>('square')

  // Tag configs
  const tags = [
    { label: 'Hot', bg: 'bg-red-950/80', border: 'border-red-500/60', icon: '🔥', text: 'text-red-400' },
    { label: 'Early', bg: 'bg-emerald-900/80', border: 'border-emerald-500/60', icon: '⏱', text: 'text-emerald-400' },
    { label: 'Exclusive', bg: 'bg-indigo-950/80', border: 'border-indigo-400/60', icon: '✦', text: 'text-indigo-300' },
    { label: 'New', bg: 'bg-yellow-900/80', border: 'border-yellow-500/60', icon: '✨', text: 'text-yellow-400' },
    { label: 'Original', bg: 'bg-white/15', border: 'border-white/25', icon: 'B', text: 'text-white/80' },
  ]

  const games = [
    { title: 'Gold Nugget Rush', vendor: 'Dragon Gaming', tag: 0 },
    { title: 'Mega Fortune', vendor: 'BetSoft', tag: 1 },
    { title: 'Starburst', vendor: 'Nucleus', tag: 2 },
    { title: 'Book of Dead', vendor: 'Rival', tag: 3 },
    { title: 'Dead or Alive', vendor: 'Felix', tag: 4 },
  ]

  const liveGames = [
    { title: 'Roulette VIP', subtitle: 'LIVE ROULETTE', range: '$25 - $5,000', history: [0, 32, 15, 3, 26, 12, 8] },
    { title: 'Lightning Blackjack', subtitle: 'LIVE BLACKJACK', range: '$10 - $2,500', seats: { occupied: 5, total: 7 } },
    { title: 'Baccarat Squeeze', subtitle: 'LIVE BACCARAT', range: '$50 - $10,000', history: ['P', 'B', 'B', 'P', 'B', 'P'] },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        {(['square', 'rectangle', 'live'] as const).map(type => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            className={cn(
              'px-3 py-1.5 rounded-small text-xs font-medium transition-colors cursor-pointer capitalize',
              viewType === type ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            )}
          >
            {type === 'live' ? 'Live Casino' : type === 'rectangle' ? 'Portrait (4:5)' : 'Square Grid'}
          </button>
        ))}
      </div>

      {viewType === 'square' && (
        <div className="grid grid-cols-5 gap-2">
          {games.map((game, i) => {
            const tag = tags[game.tag]
            return (
              <div key={i} className="relative group cursor-pointer">
                <div className="w-full aspect-square rounded-small overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  {/* Tag badge */}
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
                    <div className="w-5 h-5 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
                      <span className="text-[8px]">D</span>
                    </div>
                    <div className={cn('flex items-center gap-0.5 px-1.5 py-[3px] rounded-full border backdrop-blur-sm', tag.bg, tag.border)}>
                      <span className={cn('text-[8px]', tag.text)}>{tag.icon}</span>
                      <span className={cn('text-[9px] font-semibold leading-none text-white')}>{tag.label}</span>
                    </div>
                  </div>
                  {/* Hover shimmer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewType === 'rectangle' && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {games.map((game, i) => {
            const tag = tags[game.tag]
            return (
              <div key={i} className="relative group cursor-pointer flex-shrink-0">
                <div className="relative w-[120px] aspect-[4/5] rounded-small overflow-hidden bg-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  {/* Tag badge */}
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
                    <div className={cn('flex items-center gap-0.5 px-1.5 py-[3px] rounded-full border backdrop-blur-sm', tag.bg, tag.border)}>
                      <span className={cn('text-[8px]', tag.text)}>{tag.icon}</span>
                      <span className={cn('text-[9px] font-semibold leading-none text-white')}>{tag.label}</span>
                    </div>
                  </div>
                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-2">
                    <div className="text-white text-[10px] font-bold truncate leading-tight mb-0.5">{game.title}</div>
                    <div className="text-white/70 text-[8px] truncate">{game.vendor}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewType === 'live' && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {liveGames.map((game, i) => (
            <div key={i} className="relative group cursor-pointer flex-shrink-0 rounded-small overflow-hidden bg-white/5 hover:bg-white/10 transition-all" style={{ width: '200px', height: '220px' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              {/* Live pill */}
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/15">
                <div className="relative w-1.5 h-1.5"><div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" /><div className="relative w-1.5 h-1.5 rounded-full bg-red-500" /></div>
                <span className="text-white text-[10px] font-medium">{game.range}</span>
              </div>
              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
                <div className="text-white/60 text-[10px] font-medium uppercase tracking-wider mb-0.5">{game.subtitle}</div>
                <div className="text-white font-bold text-sm leading-tight mb-2">{game.title}</div>
                {/* History or seats */}
                {game.history && Array.isArray(game.history) && typeof game.history[0] === 'number' && (
                  <div className="flex gap-0.5 mb-2">
                    {(game.history as number[]).map((n, j) => (
                      <div key={j} className={cn('w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center',
                        n === 0 ? 'bg-emerald-600 text-white' : n <= 18 ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'
                      )}>{n}</div>
                    ))}
                  </div>
                )}
                {game.seats && (
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: game.seats.total }).map((_, j) => (
                      <div key={j} className={cn('w-4 h-4 rounded-sm', j < game.seats!.occupied ? 'bg-white/30' : 'bg-white/10 border border-dashed border-white/20')} />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-sm bg-white/10" />
                  <span className="text-white/50 text-[10px] font-medium">Evolution</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── VendorCarouselPreview ──────────────────────────────────
function VendorCarouselPreview() {
  const vendors = ['Dragon Gaming', 'BetSoft', '5 Clover', 'Arrow\'s Edge', 'Blaze', 'DeckFresh', 'Felix', 'KA Gaming', 'Nucleus', 'Rival']
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 pb-1">
        {vendors.map((vendor, i) => (
          <button
            key={vendor}
            className="group relative bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 whitespace-nowrap overflow-hidden flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white/50">{vendor.charAt(0)}</span>
            </div>
            <span className="relative z-10">{vendor}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── GameLauncherPreview ────────────────────────────────────
function GameLauncherPreview() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full rounded-lg overflow-hidden border border-white/10" style={{ backgroundColor: '#1a1a1a', height: '320px' }}>
      {/* Top bar */}
      <div className="h-10 px-3 flex items-center justify-between relative rounded-t-lg border-b border-white/10" style={{ backgroundColor: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(16px)' }}>
        {/* Hamburger */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="7" x2="20" y2="7" /><line x1="6" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="18" y2="17" />
            </svg>
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-48 bg-[#2d2d2d]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="py-2">
                  <button className="w-full px-4 py-2.5 text-left text-white hover:bg-white/10 transition-colors text-sm cursor-pointer">Quick Deposit</button>
                  <button className="w-full px-4 py-2.5 text-left text-white hover:bg-white/10 transition-colors text-sm cursor-pointer">More Games Like This</button>
                </div>
                <div className="px-4 py-3 border-t border-white/10 bg-white/5">
                  <div className="text-xs text-white/70 mb-2">Gold To Platinum I</div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '45%', background: 'linear-gradient(to right, #d4af37, #f5d061)' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Game name center */}
        <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white max-w-[50%] truncate">Gold Nugget Rush</h2>
        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <IconMaximize className="w-4 h-4 text-white/70" />
          </button>
          <button onClick={() => setFavorited(!favorited)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <IconHeart className={cn('w-4 h-4 transition-colors', favorited ? 'text-pink-500 fill-pink-500' : 'text-white/70')} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <IconX className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
      {/* Game area */}
      <div className="h-[280px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full" />
              <p className="text-white/70 text-xs">Loading game...</p>
              <p className="text-white/50 text-[10px]">Dragon Gaming</p>
            </motion.div>
          ) : (
            <motion.div key="loaded" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full bg-white/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-xl bg-white/10 mx-auto mb-3 flex items-center justify-center">
                  <IconDeviceGamepad2 className="w-10 h-10 text-white/30" />
                </div>
                <p className="text-white/40 text-xs">Game viewport</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── SportsOfferingsPreview (Live + Upcoming) ───────────────
function SportsOfferingsPreview() {
  const [tab, setTab] = useState<'live' | 'upcoming'>('live')
  const [selectedOdds, setSelectedOdds] = useState<string[]>([])

  const toggleOdds = (id: string) => {
    setSelectedOdds((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]))
  }

  const liveEvents = [
    {
      id: 'l1',
      league: 'Premier League',
      country: 'England',
      sportLabel: 'Soccer',
      sport: '/sports_icons/soccer.svg',
      team1: 'Liverpool',
      team2: 'Arsenal',
      score1: 2,
      score2: 1,
      period: '2H',
      time: "67'",
      markets: [{ label: 'LIV', odds: '+120' }, { label: 'Draw', odds: '+230' }, { label: 'ARS', odds: '+250' }],
    },
    {
      id: 'l2',
      league: 'NBA',
      country: 'USA',
      sportLabel: 'Basketball',
      sport: '/sports_icons/Basketball.svg',
      team1: 'Lakers',
      team2: 'Celtics',
      score1: 94,
      score2: 89,
      period: 'Q4',
      time: '4:12',
      markets: [{ label: 'LAL -3.5', odds: '-110' }, { label: 'BOS +3.5', odds: '-110' }, { label: 'O 221.5', odds: '-105' }],
    },
  ]
  const upcomingEvents = [
    {
      id: 'u1',
      league: 'NFL',
      country: 'USA',
      sportLabel: 'Football',
      sport: '/sports_icons/football.svg',
      team1: 'Chiefs',
      team2: 'Bills',
      time: 'Today 20:00',
      markets: [{ label: 'KC -3.5', odds: '-110' }, { label: 'BUF +3.5', odds: '-110' }, { label: 'O 51.5', odds: '-110' }],
    },
    {
      id: 'u2',
      league: 'La Liga',
      country: 'Spain',
      sportLabel: 'Soccer',
      sport: '/sports_icons/soccer.svg',
      team1: 'Real Madrid',
      team2: 'Barcelona',
      time: 'Tomorrow 21:00',
      markets: [{ label: 'RMA', odds: '+180' }, { label: 'Draw', odds: '+220' }, { label: 'BAR', odds: '+150' }],
    },
  ]

  const rows = tab === 'live' ? liveEvents : upcomingEvents

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setTab('live')}
          className={cn('px-3 py-1.5 rounded-small text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5', tab === 'live' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5')}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ee3536] animate-pulse" />
          Live
        </button>
        <button
          onClick={() => setTab('upcoming')}
          className={cn('px-3 py-1.5 rounded-small text-xs font-medium transition-colors cursor-pointer', tab === 'upcoming' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5')}
        >
          Upcoming
        </button>
      </div>

      <div className="space-y-1.5">
        {rows.map((event) => (
          <div key={event.id} className="bg-white/5 border border-white/10 rounded-small overflow-hidden">
            <div className="px-2.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <img src={event.sport} alt="" className="w-3 h-3 object-contain" />
                <span className="text-[9px] text-white/70">{event.league}</span>
                <span className="text-[9px] text-white/50">|</span>
                <span className="text-[9px] text-white/70">{event.country}</span>
                <span className="text-[9px] text-white/50">,</span>
                <span className="text-[9px] text-white/70">{event.sportLabel}</span>
              </div>
              <button className="text-[10px] text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <IconPlayerPlay className="w-3 h-3" />
                Watch
              </button>
            </div>

            <div className="px-2.5 py-2 flex items-center gap-2" style={{ overflow: 'visible', alignItems: 'center' }}>
              {tab === 'live' ? (
                <div className="flex flex-col items-start justify-center gap-0.5 flex-shrink-0 w-[50px]">
                  <div className="flex items-center gap-0.5 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5 whitespace-nowrap">
                    <div className="w-1 h-1 bg-[#ee3536] rounded-full animate-pulse" />
                    <span className="text-[8px] font-semibold text-[#ee3536]">LIVE</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[8px] font-bold text-white/70">
                      {'period' in event && typeof event.period === 'string' ? event.period : ''}
                    </span>
                    <span className="text-[8px] text-white/60">{event.time}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start justify-center gap-0.5 flex-shrink-0 w-[50px]">
                  <div className="text-[8px] text-white/60 font-semibold">PRE</div>
                  <div className="text-[8px] text-white/60">{(event as { time: string }).time}</div>
                </div>
              )}

              <div className="flex flex-col gap-1 min-w-0 w-[200px] flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="text-[11px] font-semibold text-white truncate leading-tight">{event.team1}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="text-[11px] font-semibold text-white truncate leading-tight">{event.team2}</div>
                </div>
              </div>

              {tab === 'live' && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <div className="border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-white/5 border-white/10">
                      <span className="text-[10px] font-bold text-white leading-none">
                        {'score1' in event && typeof event.score1 === 'number' ? event.score1 : ''}
                      </span>
                    </div>
                    <div className="border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-white/5 border-white/10">
                      <span className="text-[10px] font-bold text-white leading-none">
                        {'score2' in event && typeof event.score2 === 'number' ? event.score2 : ''}
                      </span>
                    </div>
                  </div>
                  <IconChevronRight className="w-3.5 h-3.5 text-white/50 hover:text-white transition-colors cursor-pointer flex-shrink-0" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {event.markets.map((m, j) => {
                  const oddsId = `${event.id}-${j}`
                  const isSelected = selectedOdds.includes(oddsId)
                  return (
                    <button
                      key={j}
                      onClick={() => toggleOdds(oddsId)}
                      className={cn(
                        'flex flex-col items-center px-2 py-1.5 rounded-small border text-[10px] font-medium transition-all flex-shrink-0 cursor-pointer min-w-[68px]',
                        isSelected
                          ? 'border-transparent text-white'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                      )}
                      style={isSelected ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                    >
                      <span className="text-[8px] text-white/50 mb-0.5">{m.label}</span>
                      <span className="font-bold">{m.odds}</span>
                    </button>
                  )
                })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SportsTopEventsCardsPreview() {
  const [selected, setSelected] = useState<string | null>(null)
  const events = [
    {
      id: 'te1',
      league: 'NFL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      team1: 'Kansas City Chiefs',
      team2: 'Buffalo Bills',
      team1Code: 'KC',
      team2Code: 'BUF',
      score1: 1,
      score2: 0,
      time: "Q2 7'",
      team1Percent: 58,
      team2Percent: 42,
      odds: ['+350', '+350', '+350'],
    },
    {
      id: 'te2',
      league: 'NFL',
      country: 'USA',
      leagueIcon: '/banners/sports_league/NFL.svg',
      team1: 'Dallas Cowboys',
      team2: 'Philadelphia Eagles',
      team1Code: 'DAL',
      team2Code: 'PHI',
      score1: 2,
      score2: 1,
      time: "Q4 2'",
      team1Percent: 45,
      team2Percent: 55,
      odds: ['+280', '+260', '+320'],
    },
  ]

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      {events.map((e) => (
        <div
          key={e.id}
          className="w-[320px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0"
          style={{ background: 'linear-gradient(to bottom, rgba(238, 53, 54, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <img src={e.leagueIcon} alt={e.league} width={16} height={16} className="object-contain" />
              <span className="text-[10px] text-white">{e.league} | {e.country}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5 whitespace-nowrap">
                <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse" />
                <span className="text-[9px] font-semibold text-[#ee3536]">LIVE</span>
              </div>
              <span className="text-[10px] text-[#ee3536]">{e.time}</span>
            </div>
          </div>

          <div className="flex items-center mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-semibold text-white truncate">{e.team1}</span>
            </div>
            <div className="flex items-center justify-center mx-3 flex-shrink-0 gap-1">
              <div className="border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-white/5 border-white/10">
                <span className="text-[10px] font-bold text-white leading-none">{e.score1}</span>
              </div>
              <span className="text-base font-bold text-white leading-none">-</span>
              <div className="border rounded-small px-1.5 py-1.5 w-[28px] h-[28px] flex items-center justify-center bg-white/5 border-white/10">
                <span className="text-[10px] font-bold text-white leading-none">{e.score2}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
              <span className="text-xs font-semibold text-white truncate">{e.team2}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[e.team1Code, 'Tie', e.team2Code].map((label, idx) => {
              const id = `${e.id}-${idx}`
              const active = selected === id
              return (
                <button
                  key={id}
                  onClick={() => setSelected(active ? null : id)}
                  className={cn(
                    'bg-white/10 rounded-small py-2 border transition-colors',
                    active ? 'border-[#ee3536] bg-[#ee3536]/15' : 'border-white/10 hover:bg-white/15'
                  )}
                >
                  <div className="text-[10px] text-white/65 leading-none mb-1">{label}</div>
                  <div className="text-sm font-bold text-white leading-none">{e.odds[idx]}</div>
                </button>
              )
            })}
          </div>

          <div className="text-center text-[10px] text-white/60 mb-1.5">Moneyline</div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-1.5">
            <div className="h-full bg-[#ff3b3f]" style={{ width: `${e.team1Percent}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/60">
            <span>{e.team1Percent}% {e.team1Code}</span>
            <span>{e.team2Percent}% {e.team2Code}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function SameGameParlayCardsPreview() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      {[
        {
          id: 1,
          match: 'Chiefs vs Bills',
          league: 'NFL',
          leagueIcon: '/banners/sports_league/NFL.svg',
          country: 'USA',
          time: 'SUN 1:00PM',
          legs: ['Chiefs To Win', 'Mahomes 300+ Pass Yds', 'Over 49.5 Points'],
          combinedOdds: '+750',
        },
        {
          id: 2,
          match: 'Arsenal vs Chelsea',
          league: 'Premier League',
          leagueIcon: '/banners/sports_league/prem.svg',
          country: 'England',
          time: 'TODAY 3:00PM',
          legs: ['Arsenal To Win', 'Over 2.5 Goals', 'Both Teams To Score'],
          combinedOdds: '+850',
        },
      ].map((parlay) => (
        <div
          key={parlay.id}
          className="w-[340px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.3) 50%, rgba(255, 255, 255, 0.03) 100%)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <img src={parlay.leagueIcon} alt={parlay.league} width={16} height={16} className="object-contain" />
              <span className="text-[10px] text-white">{parlay.league} | {parlay.country}, Football</span>
            </div>
            <span className="text-[10px] text-white/70">{parlay.time}</span>
          </div>

          <div className="text-sm font-semibold text-white/90 leading-tight mb-3">{parlay.match}</div>

          <div className="relative mb-3 ml-[3px]">
            <div className="absolute left-[2.5px] top-[5px] bottom-[5px] w-[1px] bg-white/20" />
            <div className="space-y-2">
              {parlay.legs.map((leg, legIndex) => (
                <div key={legIndex} className="flex items-center gap-2.5 relative">
                  <div className="w-[6px] h-[6px] rounded-full bg-emerald-400 flex-shrink-0 relative z-10 ring-2 ring-emerald-400/20" />
                  <span className="text-[11px] text-white/80">{leg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">{parlay.legs.length}-Leg Parlay</span>
            <button
              onClick={() => setSelectedId((prev) => (prev === parlay.id ? null : parlay.id))}
              className={cn(
                'rounded-small h-[34px] flex items-center justify-center px-4 transition-colors cursor-pointer border',
                selectedId === parlay.id ? 'border-transparent text-white' : 'bg-white/10 hover:bg-white/20 border-transparent text-white'
              )}
              style={selectedId === parlay.id ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
            >
              <span className="text-xs font-bold text-white leading-none">{parlay.combinedOdds}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function BetBoostCardsPreview() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      {[
        { id: 1, marketName: 'Haaland To Score From A Header Vs Wolves', isLive: true, liveTime: "H2 70'", wasOdds: '+350', boostedOdds: '+450' },
        { id: 2, marketName: 'Vinicius Jr To Score 2+ Goals Vs Sevilla', isLive: false, time: 'TODAY 10:30PM', wasOdds: '+280', boostedOdds: '+350' },
      ].map((b) => (
        <div
          key={b.id}
          className="w-[340px] bg-white/5 border border-white/10 rounded-small p-3 relative overflow-hidden flex-shrink-0"
          style={{ background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <img src="/banners/sports_league/prem.svg" alt="Premier League" width={16} height={16} className="object-contain" />
              <span className="text-[10px] text-white">Premier League | England, Soccer</span>
            </div>
            {b.isLive ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5 whitespace-nowrap">
                  <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse" />
                  <span className="text-[9px] font-semibold text-[#ee3536]">LIVE</span>
                </div>
                <span className="text-[10px] text-[#ee3536]">{b.liveTime}</span>
              </div>
            ) : (
              <span className="text-[10px] text-white">{b.time}</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="text-sm font-semibold text-white/90 leading-tight flex-1" style={{ lineHeight: '1.3', maxWidth: '200px' }}>
              {b.marketName}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div>
                <div className="text-[10px] text-white/50 mb-1 text-center">Was</div>
                <button disabled className="bg-white/10 text-white/50 rounded-small h-[38px] flex items-center justify-center px-3 border border-white/20 cursor-not-allowed opacity-60">
                  <span className="text-[10px] text-white/50 leading-none line-through">{b.wasOdds}</span>
                </button>
              </div>
              <div>
                <div className="text-[10px] text-white/50 mb-1 text-center">Boosted</div>
                <button
                  onClick={() => setSelectedId((prev) => (prev === b.id ? null : b.id))}
                  className={cn(
                    'rounded-small h-[38px] flex items-center justify-center px-3 border transition-colors cursor-pointer',
                    selectedId === b.id ? 'border-transparent text-white' : 'bg-white/10 border-white/20 text-white'
                  )}
                  style={selectedId === b.id ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                >
                  <span className="text-[10px] font-bold text-white leading-none">{b.boostedOdds}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <IconInfoCircle className="w-3.5 h-3.5 text-white/50 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-white/50 leading-tight">
              Player Must Play. If No TD&apos;s Are Scored Wager Will Be Graded As A Loss
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── BalanceAnimationPreview ─────────────────────────────────
function BalanceAnimationPreview() {
  const [balance, setBalance] = useState(100.00)
  const [isAnimating, setIsAnimating] = useState(false)

  const simulateDeposit = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const amounts = [25, 50, 100, 250, 500]
    const amount = amounts[Math.floor(Math.random() * amounts.length)]
    setBalance(prev => +(prev + amount).toFixed(2))
    setTimeout(() => setIsAnimating(false), 800)
  }

  const simulateWin = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const amount = +(Math.random() * 500 + 10).toFixed(2)
    setBalance(prev => +(prev + amount).toFixed(2))
    setTimeout(() => setIsAnimating(false), 800)
  }

  const simulateBet = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const amount = +(Math.random() * 50 + 5).toFixed(2)
    setBalance(prev => Math.max(0, +(prev - amount).toFixed(2)))
    setTimeout(() => setIsAnimating(false), 800)
  }

  const reset = () => {
    setBalance(100.00)
  }

  return (
    <div className="w-full space-y-4">
      {/* Main balance display — mimics the nav header style */}
      <div className="flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 rounded-small px-5 py-3 flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[11px] font-semibold text-white">
              CH
            </div>
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#1a1a1a]" />
          </div>
          {/* Balance */}
          <div className="text-right">
            <div className="text-[10px] text-white/40 mb-0.5">Available Balance</div>
            <div className="text-xl font-bold text-white tabular-nums flex items-center gap-0.5">
              $<NumberFlow
                value={balance}
                format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compact nav-bar style version */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 bg-white/5 rounded-small px-2.5 py-1.5 border border-white/10">
          <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[9px] font-semibold text-white">CH</div>
          <span className="text-xs font-medium text-white tabular-nums min-w-[70px] text-right">
            $<NumberFlow value={balance} format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
          </span>
        </div>
        <div className="bg-[#ee3536] rounded-small px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1.5">
          <IconWallet className="w-3.5 h-3.5" />
          Wallet
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={simulateDeposit}
          disabled={isAnimating}
          className={cn(
            'px-3 py-1.5 rounded-small text-[11px] font-semibold transition-all cursor-pointer',
            'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30',
            isAnimating && 'opacity-50 cursor-not-allowed'
          )}
        >
          + Deposit
        </button>
        <button
          onClick={simulateWin}
          disabled={isAnimating}
          className={cn(
            'px-3 py-1.5 rounded-small text-[11px] font-semibold transition-all cursor-pointer',
            'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30',
            isAnimating && 'opacity-50 cursor-not-allowed'
          )}
        >
          🎰 Win
        </button>
        <button
          onClick={simulateBet}
          disabled={isAnimating}
          className={cn(
            'px-3 py-1.5 rounded-small text-[11px] font-semibold transition-all cursor-pointer',
            'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30',
            isAnimating && 'opacity-50 cursor-not-allowed'
          )}
        >
          − Place Bet
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-small text-[11px] font-medium text-white/40 hover:text-white/60 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      <p className="text-center text-[10px] text-white/30">Click actions to see NumberFlow animate the balance up & down</p>
    </div>
  )
}

// ── Error Boundary ────────────────────────────────────────
class LibraryErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 rounded-xl border border-red-500/30 bg-red-500/10 m-4">
          <h3 className="text-red-400 font-bold text-lg mb-2">Component Render Error</h3>
          <pre className="text-red-300 text-xs whitespace-pre-wrap">{this.state.error.message}</pre>
          <pre className="text-red-300/60 text-[10px] mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Types ──────────────────────────────────────────────────
interface ComponentEntry {
  id: string
  name: string
  description: string
  category: 'atoms' | 'components' | 'blocks'
  tags: string[]
  filePath: string
  preview: React.ReactNode
  codeSnippet: string
}

const LIVE_SOURCE_PATHS = new Set([
  'app/page.tsx',
  'app/casino/page.tsx',
  'app/sports/page.tsx',
  'app/sports/soccer/premier-league/page.tsx',
  'components/dynamic-island.tsx',
  'components/chat/chat-nav-toggle.tsx',
  'components/chat/chat-header.tsx',
  'components/chat/chat-rain-banner.tsx',
  'components/chat/chat-panel.tsx',
  'components/vip/streak-counter.tsx',
  'components/vip/reload-claim.tsx',
  'components/vip/cash-drop-code.tsx',
  'components/vip/bet-and-get.tsx',
  'components/animate-ui/components/base/tabs.tsx',
  'components/betslip/number-pad.tsx',
  'components/betslip/global-betslip.tsx',
  'components/design-customizer.tsx',
  'components/rain-background.tsx',
  'components/interactive-grid-background.tsx',
  'components/sports-tracker-widget.tsx',
  'components/casino/jackpot-overlay.tsx',
  'components/ui/drawer.tsx',
  'components/ui/sidebar.tsx',
  'components/ui/family-drawer.tsx',
  'hooks/use-rain-balance.ts',
])

const AUDITED_ENTRY_IDS = new Set([
  'quick-links',
  'sub-nav-sports',
  'sidebar-sports',
  'betslip',
  'chat-panel',
  'sports-live-upcoming',
  'sports-top-events-cards',
  'sports-sgp-cards',
  'sports-bet-boost-cards',
])

function extractSourcePaths(filePath: string) {
  const matches = filePath.match(/[A-Za-z0-9_/-]+\.(?:tsx|ts|jsx|js)/g) ?? []
  return Array.from(new Set(matches))
}

function isEntrySourceVerified(entry: ComponentEntry) {
  const paths = extractSourcePaths(entry.filePath)
  return paths.some((path) => LIVE_SOURCE_PATHS.has(path))
}

function isEntryAudited(entry: ComponentEntry) {
  return AUDITED_ENTRY_IDS.has(entry.id)
}

// ── Code Block with Copy ─────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden bg-[#0d0d0d]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
        <span className="text-[11px] font-mono text-white/40">{filename}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors"
        >
          {copied ? (
            <>
              <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <IconCopy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono text-white/70 max-h-[400px] overflow-y-auto custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ── Component Card ──────────────────────────────────────
function ComponentCard({ entry }: { entry: ComponentEntry }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const verified = isEntrySourceVerified(entry)
  const audited = isEntryAudited(entry)
  const sourcePaths = extractSourcePaths(entry.filePath)

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden hover:border-white/[0.15] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">{entry.name}</h3>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 uppercase tracking-wider font-medium shrink-0">
              {entry.category}
            </span>
            <span
              className={cn(
                'text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium shrink-0',
                verified
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              )}
            >
              {verified ? 'Live Source' : 'Needs Review'}
            </span>
            <span
              className={cn(
                'text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium shrink-0',
                audited
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/10 text-white/60 border border-white/20'
              )}
            >
              {audited ? 'Audited' : 'Unreviewed'}
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5 line-clamp-1">{entry.description}</p>
        </div>
        <div className="flex items-center gap-1.5 ml-3">
          {/* Preview / Code toggle */}
          <div className="flex items-center h-7 rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden">
            <button
              onClick={() => setView('preview')}
              className={cn(
                'flex items-center gap-1 px-2 h-full text-[10px] font-medium transition-all',
                view === 'preview' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              )}
            >
              <IconEye className="w-3 h-3" />
              Preview
            </button>
            <div className="w-px h-3.5 bg-white/10" />
            <button
              onClick={() => setView('code')}
              className={cn(
                'flex items-center gap-1 px-2 h-full text-[10px] font-medium transition-all',
                view === 'code' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              )}
            >
              <IconCode className="w-3 h-3" />
              Code
            </button>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              <IconChevronDown className="w-4 h-4 text-white/40" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="px-4 py-2 flex items-center gap-1.5 flex-wrap border-b border-white/[0.04]">
        {entry.tags.map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-white/30 font-mono">
            {tag}
          </span>
        ))}
        <span className="text-[9px] text-white/20 ml-auto font-mono">
          {sourcePaths.join(' + ') || entry.filePath}
        </span>
      </div>

      {/* Preview area (always visible) */}
      <div className="p-4">
        {view === 'preview' ? (
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4 min-h-[80px] max-h-[500px] overflow-y-auto overflow-x-hidden custom-scrollbar flex items-start justify-center">
            <div className="w-full overflow-visible">
              {entry.preview}
            </div>
          </div>
        ) : (
          <CodeBlock code={entry.codeSnippet} filename={entry.filePath} />
        )}
      </div>

      {/* Expandable full code */}
      <AnimatePresence>
        {isOpen && view === 'preview' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <CodeBlock code={entry.codeSnippet} filename={entry.filePath} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type PreviewBet = {
  id: string
  title: string
  market: string
  event: string
  odds: string
  stake: number
}

function BetslipAnimatedPreview() {
  const betPool: PreviewBet[] = [
    { id: 'b1', title: 'Liverpool ML', market: 'Money Line', event: 'Liverpool vs Arsenal', odds: '-150', stake: 5 },
    { id: 'b2', title: 'Over 2.5 Goals', market: 'Total Goals', event: 'Liverpool vs Arsenal', odds: '+120', stake: 5 },
    { id: 'b3', title: 'Both Teams To Score', market: 'Match Props', event: 'Chelsea vs Spurs', odds: '+110', stake: 5 },
    { id: 'b4', title: 'Under 3.5 Goals', market: 'Total Goals', event: 'City vs Newcastle', odds: '-105', stake: 5 },
  ]
  const [bets, setBets] = useState<PreviewBet[]>([betPool[0], betPool[1]])

  const removeBet = (id: string) => setBets((prev) => prev.filter((b) => b.id !== id))
  const removeAll = () => setBets([])
  const addBet = () => {
    const available = betPool.find((b) => !bets.some((active) => active.id === b.id))
    if (available) setBets((prev) => [...prev, available])
  }

  const totalStake = bets.reduce((sum, b) => sum + b.stake, 0)
  const potentialWin = bets.reduce((sum, b) => {
    const american = Number(b.odds)
    const dec = american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1
    return sum + b.stake * dec
  }, 0)

  return (
    <div className="w-full max-w-[320px] mx-auto rounded-xl border border-black/10 overflow-hidden bg-white shadow-lg">
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-black/5" style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'saturate(180%) blur(20px)' }}>
        <div className="flex items-center gap-2">
          <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-md">
            <span className="text-xs font-semibold text-white leading-none">{bets.length}</span>
          </div>
          <h2 className="text-sm font-semibold text-black/90">Betslip</h2>
        </div>
        <button className="text-[10px] font-semibold uppercase tracking-wide text-black/60 flex items-center gap-1 px-2.5 py-1 rounded-md border border-black/20">
          <IconChevronDown className="w-3 h-3" /> MINIMIZE
        </button>
      </div>

      <div className="px-2 pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[10px] font-medium text-black/50 uppercase tracking-wide">{bets.length} Selections</div>
          <div className="flex items-center gap-1">
            <button
              onClick={addBet}
              disabled={bets.length >= betPool.length}
              className="text-[10px] font-medium text-black/70 uppercase tracking-wide px-2 py-0.5 rounded border border-black/15 disabled:opacity-40"
            >
              + Add
            </button>
            <button
              onClick={removeAll}
              disabled={bets.length === 0}
              className="text-[10px] font-medium text-red-400 uppercase tracking-wide px-2 py-0.5 rounded border border-red-200 inline-flex items-center gap-1 disabled:opacity-40"
            >
              <IconTrash size={12} /> Remove All
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {bets.map((bet) => (
            <motion.div
              key={bet.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-start gap-2.5 py-2.5 px-2.5 bg-[#f5f5f5] rounded-lg border border-black/[0.04] mb-1.5"
            >
              <button onClick={() => removeBet(bet.id)} className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center">
                <IconX className="w-3 h-3 text-black/50" strokeWidth={2.5} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-black mb-0.5 truncate leading-tight">{bet.title}</div>
                <div className="text-[10px] text-black/50 mb-0.5 leading-tight">{bet.market}</div>
                <div className="text-[10px] text-black/40 truncate leading-tight">{bet.event}</div>
              </div>
              <div className="flex-shrink-0 bg-black/[0.06] rounded-md px-2 py-1">
                <span className="text-[11px] font-semibold text-black/80 whitespace-nowrap">{bet.odds}</span>
              </div>
              <div className="flex-shrink-0 w-[80px]">
                <div className="border border-black/10 rounded-lg h-[34px] flex items-center justify-end px-2 relative bg-white">
                  <span className="absolute left-2 text-xs text-black/50">$</span>
                  <span className="text-black font-medium text-sm pl-4 text-right">{bet.stake.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="px-2 pb-2.5">
        <div className="flex items-center justify-between px-2 py-2 text-[11px]">
          <span className="text-black/50">Total Stake</span>
          <span className="text-black font-semibold">${totalStake.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between px-2 pb-2 text-[11px]">
          <span className="text-black/50">Potential Win</span>
          <span className="font-semibold" style={{ color: '#059669' }}>${potentialWin.toFixed(2)}</span>
        </div>
        <button className="w-full py-3 rounded-lg text-white text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: '#059669' }}>
          Place ${totalStake.toFixed(2)} Bet
        </button>
      </div>
    </div>
  )
}

// ── Component Registry ──────────────────────────────────
const LIBRARY: ComponentEntry[] = [

  // ═══════════════════════════════════════════════════════
  // COMPONENTS
  // ═══════════════════════════════════════════════════════

  {
    id: 'sub-nav-sports',
    name: 'Sports Sub Nav',
    description: 'Horizontal sports icon tabs with live red underline active state and press preloader spinner behavior.',
    category: 'components',
    tags: ['navigation', 'sub-nav', 'sports', 'tabs', 'horizontal-scroll', 'icons'],
    filePath: 'app/sports/page.tsx (inline)',
    preview: <SportsSubNavPreview />,
    codeSnippet: `{/* Sports Sub Nav — horizontal scrollable icons with active underline */}
<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
  {[
    { icon: '/sports_icons/soccer.svg', label: 'Soccer' },
    { icon: '/sports_icons/Basketball.svg', label: 'Basketball' },
    { icon: '/sports_icons/football.svg', label: 'Football' },
    // ... more sports
  ].map((sport) => {
    const isActive = sport.label === activeSport
    return (
      <button
        key={sport.label}
        onClick={() => setActiveSport(sport.label)}
        className={cn(
          "flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1.5",
          "rounded-small transition-all duration-300 cursor-pointer flex-shrink-0 relative",
          "hover:bg-white/5 active:bg-white/15",
          isActive && "bg-white/10"
        )}
      >
        <img src={sport.icon} alt={sport.label} width={20} height={20}
          className={cn("object-contain", isActive ? "opacity-100" : "opacity-70")} />
        <span className={cn("text-[10px] font-medium whitespace-nowrap",
          isActive ? "text-white" : "text-white/70")}>
          {sport.label}
        </span>
        {loadingNav === sport.label && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <IconLoader2 className="w-4 h-4 animate-spin text-white" />
          </div>
        )}
        {/* Red underline indicator */}
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 -bottom-2 h-0.5 rounded-full",
          "transition-all duration-300 ease-in-out",
          isActive ? "w-8 opacity-100" : "w-0 opacity-0"
        )} style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : {}} />
      </button>
    )
  })}
</div>`,
  },
  {
    id: 'sub-nav-glass',
    name: 'Sub Nav (Glass Sticky)',
    description: 'Fixed glass-blur sub-navigation bar with AnimateTabs. Animated pill slides between tabs using framer-motion spring animation. Sits below the header, adjusts with sidebar state.',
    category: 'components',
    tags: ['navigation', 'sub-nav', 'glass', 'blur', 'sticky', 'backdrop-filter', 'framer-motion', 'animated-tabs', 'spring'],
    filePath: 'app/casino/page.tsx (AnimateTabs + motion.div)',
    preview: <SubNavGlassPreview />,
    codeSnippet: `import { AnimateTabs, AnimateTabsList, TabsTab } from '@/components/ui/animate-tabs'
import { motion } from 'framer-motion'

{/* Sticky Sub Nav — glass blur + AnimateTabs with spring-animated pill */}
<motion.div
  data-sub-nav
                className={cn(
    "fixed z-[100] backdrop-blur-xl border-b border-white/10 py-3 shadow-sm",
    isMobile ? "left-0 right-0" : "px-6"
  )}
  initial={false}
  animate={{ top: isMobile ? (quickLinksOpen ? 104 : 64) : 64 }}
  transition={{ type: "tween", ease: "linear", duration: 0.3 }}
  style={isMobile ? {
    left: 0, right: 0, width: '100vw',
  } : {
    top: 64,
    left: sidebarState === 'collapsed' ? '3rem' : '16rem',
    right: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
  }}
>
  <div className="overflow-x-auto scrollbar-hide px-3">
    <AnimateTabs value={activeSubNav} onValueChange={setActiveSubNav} className="w-max">
      <AnimateTabsList className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0">
        {['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Live', 'Jackpots'].map((tab) => (
          <TabsTab
            key={tab}
            value={tab}
            className="relative z-10 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors whitespace-nowrap"
          >
            {activeSubNav === tab && (
              <motion.div
                layoutId="activeTab"
                layout="position"
                className="absolute inset-0 rounded-2xl -z-10"
                style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </TabsTab>
        ))}
      </AnimateTabsList>
    </AnimateTabs>
          </div>
</motion.div>

// Features:
// • AnimateTabs with spring-animated pill (stiffness: 400, damping: 40)
// • Glassmorphism: bg rgba(26,26,26,0.6) + backdrop-blur-xl
// • Responsive: adjusts left offset based on sidebar state
// • Mobile: animated top position based on quickLinksOpen state
// • Scrollable tabs with overflow-x-auto`,
  },
  {
    id: 'sub-nav-casino',
    name: 'Sub Nav (Casino — Search + Favorites)',
    description: 'Casino sub-navigation with icon buttons (search & favorite) alongside AnimateTabs. Favorite button turns pink when active with filled heart. Used on desktop casino for filtering games.',
    category: 'components',
    tags: ['navigation', 'sub-nav', 'casino', 'search', 'favorite', 'heart', 'animated-tabs', 'framer-motion', 'spring', 'icons'],
    filePath: 'app/casino/page.tsx (inline in CasinoPageContent)',
    preview: <SubNavWithIconsPreview />,
    codeSnippet: `import { AnimateTabs, AnimateTabsList, TabsTab } from '@/components/ui/animate-tabs'
import { motion } from 'framer-motion'
import { IconSearch, IconHeart } from '@tabler/icons-react'

{/* Casino Sub Nav — icon buttons + AnimateTabs */}
<motion.div
  data-sub-nav
  className="fixed z-[100] backdrop-blur-xl border-b border-white/10 py-3 px-6"
  style={{
    top: 64,
    left: sidebarState === 'collapsed' ? '3rem' : '16rem',
    right: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
  }}
>
  <div className="flex items-center gap-1.5">
    {/* Icon Tabs — search + favorite (desktop only) */}
    {!isMobile && (
      <div className="flex-shrink-0">
        <div className="bg-white/5 p-0.5 gap-0.5 rounded-3xl flex items-center">
      <button
            onClick={() => setSearchOverlayOpen(true)}
            className="text-white/70 hover:text-white hover:bg-white/5
              rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center
              transition-all duration-300"
          >
            <IconSearch className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setActiveIconTab('favorite')
              setSelectedCategory('Favorites')
            }}
        className={cn(
              "rounded-2xl p-1.5 h-9 w-9 flex items-center justify-center transition-all",
              activeIconTab === 'favorite'
                ? "text-pink-500 bg-white/10"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            <IconHeart className={cn(
              "w-3.5 h-3.5",
              activeIconTab === 'favorite' && "fill-pink-500 text-pink-500"
            )} />
      </button>
        </div>
      </div>
    )}

    {/* Text Tabs — AnimateTabs with spring pill */}
    <AnimateTabs value={activeSubNav} onValueChange={setActiveSubNav}>
      <AnimateTabsList className="bg-white/5 p-0.5 gap-1 rounded-3xl">
        {['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Live', ...].map(tab => (
          <TabsTab key={tab} value={tab}
            className="relative z-10 text-white/70 hover:text-white
              rounded-2xl px-4 py-1 h-9 text-xs font-medium whitespace-nowrap"
          >
            {activeSubNav === tab && (
              <motion.div
                layoutId="activeTab" layout="position"
                className="absolute inset-0 rounded-2xl -z-10"
                style={{ backgroundColor: 'var(--ds-primary)' }}
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </TabsTab>
        ))}
      </AnimateTabsList>
    </AnimateTabs>
  </div>
</motion.div>

// Features:
// • Search icon opens search overlay
// • Favorite icon toggles pink filled state + filters to Favorites
// • Clicking a text tab resets icon tab to default
// • Spring-animated pill shared with text tabs
// • Desktop only: icons hidden on mobile (Dynamic Island has search/fav)`,
  },
  {
    id: 'quick-links',
    name: 'Quick Links (Mobile)',
    description: 'Mobile-only product quick links bar that sits above the main header. Animates open/closed based on scroll direction. Mirrors current live nav item order and behavior.',
    category: 'components',
    tags: ['navigation', 'quick-links', 'mobile', 'scroll', 'animation', 'framer-motion', 'dropdown'],
    filePath: 'app/page.tsx (inline in HomePageContent)',
    preview: <QuickLinksPreview />,
    codeSnippet: `import { motion, AnimatePresence } from 'framer-motion'

// State
const [quickLinksOpen, setQuickLinksOpen] = useState(false)
const [otherDropdownOpen, setOtherDropdownOpen] = useState(false)
const lastScrollYRef = useRef(0)

// Scroll handler — show on scroll up, hide on scroll down
useEffect(() => {
  const handleScroll = () => {
    const y = window.scrollY
    if (y > 80 && y > lastScrollYRef.current + 8) {
      setQuickLinksOpen(false)
    } else if (y < lastScrollYRef.current - 8) {
      setQuickLinksOpen(true)
    }
    lastScrollYRef.current = y
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

{/* Quick Links Bar — fixed above header, height animates 0↔40 */}
{isMobile && (
  <motion.div
    initial={false}
    animate={{ height: quickLinksOpen ? 40 : 0 }}
    transition={{ type: "tween", ease: "linear", duration: 0.3 }}
    className="fixed left-0 right-0 overflow-hidden z-[100]"
    style={{
      top: 0,
      pointerEvents: quickLinksOpen ? 'auto' : 'none',
      backgroundColor: 'var(--ds-nav-bg, #2D2E2C)',
      boxShadow: '0 -200px 0 0 var(--ds-nav-bg, #2D2E2C)',
    }}
  >
    <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {[
        { label: 'Home', product: null },
        { label: 'Sports', product: 'sports' },
        { label: 'Casino', product: 'casino' },
        { label: 'Poker', product: 'poker' },      ].filter(i => !i.product || visibleProducts[i.product]).map((item) => (
          <button
            key={item.label}
          onClick={() => item.onClick()}
            className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-small text-xs font-medium",
            isActive ? "text-white" : "text-white/70 hover:text-white"
          )}
        >
          {item.label}
          </button>
        ))}
      <button onClick={() => setOtherDropdownOpen(!otherDropdownOpen)}
        className="flex items-center gap-0.5 text-xs text-white/70">
        Other <IconChevronDown className={cn("w-3 h-3", otherDropdownOpen && "rotate-180")} />
      </button>
      </div>
  </motion.div>
)}

{/* "Other" dropdown — slides open below quick links */}
<AnimatePresence initial={false}>
  {otherDropdownOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden border-b border-white/5"
    >
      {['Esports', 'Racebook', 'Contests', 'Virtuals'].map(item => (
        <a key={item} className="px-3 py-2 text-[13px] text-white/50">{item}</a>
      ))}
    </motion.div>
  )}
</AnimatePresence>

// Features:
// • Scroll-aware: shows on scroll up, hides on scroll down
// • Height animation 0↔40px with framer-motion tween
// • Pushes main header down when open (header top: quickLinksOpen ? 40 : 0)
// • "Other" dropdown with AnimatePresence expand/collapse
// • boxShadow trick fills area above the bar with nav-bg color`,
  },
  {
    id: 'main-nav-header',
    name: 'Main Navigation (Header)',
    description: 'Global header bar used on casino, poker, sports, account. Left: sidebar toggle, divider, animated nav pills (Sports, Live Betting, Casino, Live Casino, Poker, VIP Rewards) with shared layoutId spring pill, "Other" dropdown. Right: VIP crown (gold), divider, avatar with red notification dot + balance (NumberFlow), DEPOSIT button with wallet icon, ChatNavToggle.',
    category: 'components',
    tags: ['navigation', 'header', 'nav-pills', 'animated', 'framer-motion', 'spring', 'layoutId', 'balance', 'vip', 'chat', 'deposit', 'crown', 'wallet', 'dropdown'],
    filePath: 'app/sports/soccer/premier-league/page.tsx (inline in SportsPage)',
    preview: <MainNavPreview />,
    codeSnippet: `import { motion, AnimatePresence } from 'framer-motion'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'
import { ChatNavToggle } from '@/components/chat/chat-nav-toggle'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import NumberFlow from '@number-flow/react'
import { IconCrown, IconWallet, IconChevronDown } from '@tabler/icons-react'

{/* Header — fixed, adjusts left for sidebar */}
<motion.header
  className={cn(
    "border-b border-white/10 h-16 flex items-center justify-between z-[101]",
    "fixed right-0 transition-[left] duration-200 ease-linear",
    isMobile ? "left-0 px-3" : (sidebarOpen ? "left-[16rem] px-6" : "left-[3rem] px-6")
  )}
  animate={{ top: isMobile ? (quickLinksOpen ? 40 : 0) : 0 }}
  style={{ backgroundColor: 'var(--ds-nav-bg, #2D2E2C)' }}
>
  {/* Left — sidebar toggle + nav pills + "Other" dropdown */}
  <div className="flex items-center gap-6">
    {!isMobile && (
      <nav className="flex-1 flex items-center z-[110] -ml-1">
        <SidebarMenu className="flex flex-row items-center gap-2">
          {/* Sidebar collapse toggle */}
          <div className="flex items-center gap-1.5 mr-1">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}
              className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
              <SidebarIcon />
            </Button>
            <div className="w-px h-5 bg-white/20" />
          </div>

          {/* Nav pills — animated with shared layoutId */}
          {['Sports', 'Live Betting', 'Casino', 'Live Casino', 'Poker', 'VIP Rewards'].map(item => (
            <SidebarMenuItem key={item}>
              <SidebarMenuButton
                onClick={() => navigate(item)}
                className={cn(
                  "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium",
                  "justify-center relative overflow-visible",
                  isActive(item) ? "!text-white" : "text-white/70 hover:bg-white/5"
                )}
              >
                {isActive(item) && (
                  <motion.div
                    layoutId="casinoNavPill" layout="position"
                    className="absolute inset-0 rounded-small"
                    style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* "Other" dropdown — Esports, Racebook, Contests, Virtuals */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10 px-4 py-2 rounded-small text-sm font-medium text-white/70 hover:bg-white/5">
                  <span className="flex items-center gap-1">Other <IconChevronDown className="h-3 w-3" /></span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={5} className="w-[200px] bg-[#2d2d2d] border-white/10 z-[120]">
                {['Esports', 'Racebook', 'Contests', 'Virtuals'].map(item => (
                  <DropdownMenuItem key={item} className="text-white/70 hover:text-white hover:bg-white/5">
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </nav>
    )}
  </div>

  {/* Right — VIP crown, divider, avatar+balance, DEPOSIT, chat */}
  <div className={cn("flex items-center", isMobile ? "gap-2" : "gap-3")}>
    {/* VIP Crown — gold circle */}
    <button onClick={openVipDrawer}
      className="h-8 w-8 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center hover:bg-yellow-400/30">
      <IconCrown className="text-yellow-400 w-4 h-4" />
    </button>

    {!isMobile && <div className="h-6 w-px bg-white/20" />}

    {/* Avatar + Balance — opens account drawer */}
    <Button variant="ghost" onClick={openAccountDrawer}
      className="flex items-center gap-1.5 px-2 py-1 rounded-small bg-white/5 hover:bg-white/10 group">
      <div className="relative">
        <Avatar className="h-6 w-6 border border-white/20 group-hover:border-white/40">
          <AvatarFallback className="bg-white/10 text-white text-[10px] font-semibold">CH</AvatarFallback>
        </Avatar>
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
      </div>
      <span className="text-xs font-medium text-white tabular-nums min-w-[70px] text-right">
        $ <NumberFlow value={displayBalance} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
      </span>
    </Button>

    {/* Wallet — desktop only */}
    {!isMobile && (
      <Button variant="ghost" onClick={openDepositDrawer}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-small bg-white/5 hover:bg-white/10 text-xs font-semibold text-white">
        <IconWallet className="w-3.5 h-3.5 text-white" />
        Wallet
      </Button>
    )}

    {/* Chat toggle — desktop only */}
    {!isMobile && <ChatNavToggle />}
  </div>
</motion.header>

// Features:
// • Nav pills: shared layoutId "casinoNavPill" for spring-animated sliding
// • Spring animation: stiffness 400, damping 40
// • Responsive: left offset adjusts for sidebar collapsed/expanded
// • Mobile: hamburger + logo replaces nav pills, top adjusts for quick links
// • VIP crown (gold circle) opens VIP Hub drawer
// • Avatar has red notification dot indicator
// • Balance uses NumberFlow for animated number transitions
// • DEPOSIT button with IconWallet — desktop only
// • "Other" dropdown with Esports, Racebook, Contests, Virtuals
// • Chat toggle integrates with global chatStore — desktop only`,
  },
  {
    id: 'sidebar-casino',
    name: 'Sidebar Navigation (Casino)',
    description: 'Casino sidebar with featured items (square icon style: My Favorites, Last Game Played, Play Random), separator, regular menu items (Popular Games, Slots, Blackjack, etc.), and bottom section (Loyalty Hub, Banking, Need Help). Supports desktop collapsed, expanded, and mobile sheet modes. Mobile includes horizontal scrolling quick links strip with active underline and "Other" dropdown, plus panel close icon in header.',
    category: 'blocks',
    tags: ['sidebar', 'navigation', 'collapsible', 'menu', 'casino', 'mobile', 'tooltip', 'animated', 'square-icon'],
    filePath: 'app/casino/page.tsx (inline in CasinoPageContent)',
    preview: <SidebarNavPreview />,
    codeSnippet: `import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarHeader, SidebarProvider, useSidebar,
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { AnimatePresence, motion } from 'framer-motion'

<Sidebar collapsible="icon" mobileOverlay mobileBg="#2d2d2d"
  className="!bg-[#2d2d2d] border-r border-white/10 text-white !h-screen !top-0 !z-[102]">

  {/* Header — logo with AnimatePresence for collapsed/expanded/mobile transitions */}
  <SidebarHeader className="px-4 h-14 flex items-center sticky top-0 z-20"
    style={{ backgroundColor: 'rgba(45, 45, 45, 0.75)', backdropFilter: 'blur(16px)' }}>
    <AnimatePresence mode="wait">
      {sidebarState === 'collapsed' && !isMobile ? (
        <motion.div key="collapsed" /* small "B" icon */ />
      ) : isMobile ? (
        <motion.div key="mobile" /* close button + logo */ />
      ) : (
        <motion.div key="expanded" /* full BETONLINE logo */ />
      )}
    </AnimatePresence>
  </SidebarHeader>

  {/* Mobile — horizontal scrolling quick links strip */}
  {isMobile && (
    <div className="sticky top-14 z-20 border-b border-white/5"
      style={{ backgroundColor: 'rgba(45, 45, 45, 0.92)', backdropFilter: 'blur(16px)' }}>
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide px-1">
        {quickLinks.map(item => (
          <button key={item.label}
            className={cn("flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap relative",
              isCurrentPage ? "text-white font-bold" : "text-white/35 font-medium hover:text-white/60")}>
            {item.label}
            {isCurrentPage && <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
              style={{ backgroundColor: 'var(--ds-primary)' }} />}
          </button>
        ))}
        <button className="text-[13px] text-white/35 flex items-center gap-0.5">
          Other <IconChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  )}

  <SidebarContent className="overflow-y-auto flex flex-col">
    <TooltipProvider>
      {/* Featured top items — square icon style */}
      <SidebarGroup className="mt-3">
        {isMobile && <SidebarGroupLabel>CASINO MENU</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {casinoTopItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton isActive={isActive}
                      style={isActive ? { backgroundColor: 'var(--ds-primary)' } : undefined}
                      className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm">
                      <div className={cn("w-7 h-7 rounded-md flex items-center justify-center",
                        isActive ? "bg-white/20" : "bg-white/10")}>
                        <Icon strokeWidth={1.5} className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {sidebarState === 'collapsed' && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <Separator className="bg-white/10 mx-2" />

      {/* Regular menu items */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarMenuItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton isActive={isActive}
                  style={isActive ? { backgroundColor: 'var(--ds-primary)' } : undefined}
                  className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm">
                  <Icon strokeWidth={1.5} className="w-5 h-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <div className="flex-1" />
      <Separator className="bg-white/10 mx-2" />

      {/* Bottom — VIP Hub, Promotions, Wallet, Need Help */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton className="text-white/70 hover:text-white hover:bg-white/5">
                  <Icon strokeWidth={1.5} className="w-5 h-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </TooltipProvider>
  </SidebarContent>
</Sidebar>

// Structure:
// • Header: AnimatePresence — collapsed "B" | mobile panel-close icon (right) + logo | expanded full logo
// • Mobile: Horizontal scrolling quick links strip with active underline + "Other" dropdown
// • Featured items: square 7x7 icon + label, active = primary bg + white/20 icon bg
// • Separator
// • Regular items: 5x5 icon + label, active = primary bg
// • flex-1 spacer pushes bottom section down
// • Separator
// • Bottom: Loyalty Hub, Banking, Need Help (always text-white/70)
// • Collapsed desktop: icons only, tooltips on hover`,
  },
  {
    id: 'sidebar-sports',
    name: 'Sidebar Navigation (Sports)',
    description: 'Sports sidebar with FEATURES section (My Bets, Same Game Parlays, Settings — square icon style), TOP SPORTS with expandable sub-items (animated with framer-motion), A-Z sports list, Top Leagues accordion, and bottom section. Supports desktop collapsed/expanded and mobile sheet. Mobile includes horizontal scrolling quick links strip with active underline and "Other" dropdown.',
    category: 'blocks',
    tags: ['sidebar', 'navigation', 'collapsible', 'menu', 'sports', 'expandable', 'accordion', 'tooltip', 'mobile', 'animated'],
    filePath: 'app/sports/page.tsx (SportsPage)',
    preview: <SportsSidebarPreview />,
    codeSnippet: `import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem,
  SidebarMenuSubButton, SidebarHeader, SidebarProvider,
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AnimatePresence, motion } from 'framer-motion'

<Sidebar collapsible="icon" mobileOverlay mobileBg="#2d2d2d"
  className="!bg-[#2d2d2d] border-r border-white/10 text-white !h-screen !top-0 !z-[102]">

  {/* Header — same AnimatePresence pattern as casino */}
  <SidebarHeader />

  {/* Mobile — horizontal scrolling quick links strip (same as casino) */}
  {isMobile && (
    <div className="sticky top-14 z-20 border-b border-white/5"
      style={{ backgroundColor: 'rgba(45, 45, 45, 0.92)', backdropFilter: 'blur(16px)' }}>
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide px-1">
        {quickLinks.map(item => (
          <button key={item.label} className="flex-shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap relative">
            {item.label}
          </button>
        ))}
        <button className="text-[13px] text-white/35 flex items-center gap-0.5">
          Other <IconChevronDown />
        </button>
      </div>
    </div>
  )}

  <SidebarContent className="overflow-y-auto flex flex-col">
    <TooltipProvider>
      {/* FEATURES section — square icon style */}
      <SidebarGroup>
        <SidebarGroupLabel className="px-2 py-1 text-xs text-white/50">FEATURES</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {sportsFeatures.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton isActive={isActive}
                  style={isActive ? { backgroundColor: 'var(--ds-primary)' } : undefined}
                  className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm">
                  <div className={cn("w-7 h-7 rounded-md flex items-center justify-center",
                    isActive ? "bg-white/20" : "bg-white/10")}>
                    <Icon strokeWidth={1.5} className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <div className="border-b border-white/10 mx-3 my-1" />

      {/* TOP SPORTS — expandable with animated sub-items */}
      <SidebarGroup>
        <SidebarGroupLabel className="px-2 py-1 text-xs text-white/50">TOP SPORTS</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {sportsCategories.map(sport => (
              <SidebarMenuItem key={sport.label}>
                <SidebarMenuButton isActive={isActive}
                  onClick={() => toggleSport(sport.label)}
                  style={isActive ? { backgroundColor: 'var(--ds-primary)' } : undefined}>
                      <img src={sport.icon} alt={sport.label} className="w-5 h-5 object-contain" />
                      <span>{sport.label}</span>
                  {sport.expandable && (
                    <IconChevronRight className={cn(
                      "w-4 h-4 ml-auto transition-transform duration-300",
                      isExpanded && "rotate-90"
                    )} />
                  )}
                    </SidebarMenuButton>

                {/* Animated sub-items */}
                <AnimatePresence>
                  {isExpanded && sport.subItems && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <SidebarMenuSub>
                        {sport.subItems.map(sub => (
                          <SidebarMenuSubItem key={sub.label}>
                            <SidebarMenuSubButton className="pl-8 text-xs text-white/70">
                              {sub.label}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <div className="border-b border-white/10 mx-3 my-1" />

      {/* A-Z Sports — flat list */}
      <SidebarGroup>
        <SidebarGroupLabel>A-Z</SidebarGroupLabel>
        {/* ... flat sport buttons ... */}
      </SidebarGroup>

      <div className="flex-1" />
      <Separator className="bg-white/10 mx-2" />

      {/* Bottom — Loyalty Hub, Banking, Need Help */}
      {/* Same pattern as casino sidebar */}
    </TooltipProvider>
    </SidebarContent>
  </Sidebar>

// Structure:
// • FEATURES: square 7x7 icon style (My Bets, Same Game Parlays, Settings)
// • Separator
// • TOP SPORTS: expandable items with AnimatePresence animated sub-menus
//   — sport icons from /sports_icons/*.svg, ChevronRight rotates on expand
//   — Sub-items use SidebarMenuSub / SidebarMenuSubButton (pl-8)
// • Separator
// • A-Z: flat alphabetical sport list
// • flex-1 spacer
// • Separator
// • Bottom: Loyalty Hub, Banking, Need Help`,
  },
  {
    id: 'dynamic-island',
    name: 'Dynamic Island',
    description: 'Floating bottom nav bar — search, favorites, betslip (with count badge), and chat. Auto-hides on scroll down, appears on scroll up. Portal-based for z-index safety.',
    category: 'components',
    tags: ['navigation', 'mobile', 'bottom-nav', 'floating', 'animation', 'framer-motion', 'portal'],
    filePath: 'components/dynamic-island.tsx',
    preview: (
      <div className="flex flex-col items-center gap-3">
        {/* Actual rendered appearance */}
        <div className="flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-full backdrop-blur-2xl border border-white/20 shadow-2xl" style={{ backgroundColor: 'rgba(45,45,45,0.6)' }}>
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <IconSearch className="w-[18px] h-[18px] text-white/70" strokeWidth={1.8} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <IconHeart className="w-[18px] h-[18px] text-white/70" strokeWidth={1.8} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
            <IconTicket className="w-[18px] h-[18px] text-white/70" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-white text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>3</span>
          </button>
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
            <IconMessageCircle2 className="w-[18px] h-[18px] text-white/70" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#2d2d2d] animate-pulse" />
          </button>
        </div>
        <span className="text-[9px] text-white/20">Hides on scroll ↓ · Appears on scroll ↑</span>
      </div>
    ),
    codeSnippet: `import DynamicIsland from '@/components/dynamic-island'

// Props:
// - onSearchClick, onFavoriteClick, onBetslipClick, onChatClick
// - isSearchActive, isFavoriteActive, isChatActive
// - betCount: number
// - showBetslip, showChat, showSearch, showFavorites: boolean

<DynamicIsland
  showBetslip={true}
  betCount={3}
  onSearchClick={() => setSearchOpen(true)}
  onBetslipClick={() => setBetslipOpen(true)}
/>

// Features:
// • Auto-hides on scroll down, reappears on scroll up
// • Rendered via React Portal (#dynamic-island-portal)
// • Integrates with global chatStore and betslipStore
// • Spring-animated entrance/exit via framer-motion
// • Betslip badge count from global or local state`,
  },
  {
    id: 'chat-nav-toggle',
    name: 'Chat Nav Toggle',
    description: 'Header button that toggles the global chat panel. Shows a green online pulse dot when chat is closed, red tint when open.',
    category: 'atoms',
    tags: ['button', 'chat', 'toggle', 'header', 'indicator', 'pulse'],
    filePath: 'components/chat/chat-nav-toggle.tsx',
    preview: (
      <div className="flex items-center gap-4">
        {/* Closed state */}
        <div className="flex flex-col items-center gap-1.5">
          <button className="flex items-center justify-center rounded-small h-[32px] w-[32px] bg-white/5 hover:bg-white/10 border border-transparent transition-colors relative cursor-pointer">
            <IconMessageCircle2 className="w-4 h-4 text-white/70" strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#2d2d2d] animate-pulse" />
          </button>
          <span className="text-[9px] text-white/30">Closed</span>
        </div>
        {/* Open state */}
        <div className="flex flex-col items-center gap-1.5">
          <button className="flex items-center justify-center rounded-small h-[32px] w-[32px] bg-[#ee3536]/20 border border-[#ee3536]/40 hover:bg-[#ee3536]/30 transition-colors cursor-pointer">
            <IconMessageCircle2 className="w-4 h-4 text-[#ee3536]" strokeWidth={2} />
          </button>
          <span className="text-[9px] text-white/30">Open</span>
        </div>
      </div>
    ),
    codeSnippet: `import ChatNavToggle from '@/components/chat/chat-nav-toggle'

// Sits in the main nav header next to DEPOSIT button.
// Toggles the global chat panel via useChatStore.
<ChatNavToggle />

// States:
// • Closed: bg-white/5, green pulse dot (online indicator)
// • Open: bg-[#ee3536]/20, red border, red icon
// Uses rounded-small (design token)`,
  },
  {
    id: 'chat-header',
    name: 'Chat Room Header',
    description: 'Segmented room toggle (Sports Chat / Casino Chat) with online user count, user list toggle, and close button.',
    category: 'components',
    tags: ['chat', 'header', 'segmented-control', 'toggle', 'room-switch'],
    filePath: 'components/chat/chat-header.tsx',
    preview: (
      <div className="w-full border-b border-white/10">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            {/* Segmented toggle — exact match to real component */}
            <div className="flex items-center h-7 rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden">
              <button className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium bg-white/10 text-white transition-all duration-150">
                <IconBallFootball className="w-3.5 h-3.5" strokeWidth={1.8} />
                Sports Chat
              </button>
              <div className="w-px h-3.5 bg-white/10 flex-shrink-0" />
              <button className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium text-white/40 hover:text-white/60 transition-all duration-150">
                <IconDice className="w-3.5 h-3.5" strokeWidth={1.8} />
                Casino Chat
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              1.2K
            </span>
            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors">
              <IconUsers className="w-3.5 h-3.5 text-white/40" strokeWidth={1.8} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors">
              <IconX className="w-3.5 h-3.5 text-white/40" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `import ChatHeader from '@/components/chat/chat-header'

// Used inside ChatPanel. Integrates with useChatStore for room switching.
<ChatHeader onClose={() => setIsOpen(false)} />

// Sub-components:
// • Segmented toggle: Sports Chat (IconBallFootball) / Casino Chat (IconDice)
// • Online user count with green dot indicator
// • User list toggle button (IconUsers)
// • Close button (IconX)`,
  },
  {
    id: 'chat-rain-banner',
    name: 'Chat Rain Banner',
    description: 'Animated rain event banner — appears above chat input with countdown, join button, participant count, and animated rain drops.',
    category: 'components',
    tags: ['chat', 'rain', 'banner', 'animation', 'countdown', 'social'],
    filePath: 'components/chat/chat-rain-banner.tsx',
    preview: (
      <div className="w-full max-w-[340px]">
        <div className="mx-2 rounded-xl overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 shadow-lg shadow-blue-500/10">
          <div className="relative px-3 py-2.5">
            {/* Rain drops decoration — matches real component */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 bg-blue-400/40 rounded-full"
                  style={{
                    height: `${8 + Math.random() * 12}px`,
                    left: `${3 + i * 10}%`,
                    top: '-10px',
                    animation: `rain-drop ${0.8 + Math.random() * 0.6}s linear infinite`,
                    animationDelay: `${Math.random() * 1}s`,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2.5 relative z-10">
              <IconCloudRain className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-blue-300">💧 Rain Event!</div>
                <div className="text-[10px] text-blue-300/60">$50.00 · 0:42 remaining · 12 joined</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[10px] font-semibold shrink-0 hover:bg-blue-600 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `import ChatRainBanner from '@/components/chat/chat-rain-banner'

// Sits above the chat input. Self-manages via useChatStore.
<ChatRainBanner />

// Features:
// • Spring-animated entrance/exit (framer-motion)
// • Live countdown timer
// • Join button (one-click)
// • Animated rain drop decoration
// • Auto-resets on new rain events
// • Gradient: from-blue-500/15 to-cyan-500/15`,
  },

  // ── VIP Components (Real Imports) ──────────────────────

  {
    id: 'streak-counter',
    name: 'Streak Counter',
    description: 'Weekly login streak tracker with animated day pills, fire emoji, share button, and claimable reward. Uses framer-motion.',
    category: 'components',
    tags: ['vip', 'gamification', 'streak', 'reward', 'animation', 'framer-motion'],
    filePath: 'components/vip/streak-counter.tsx',
    preview: (
      <div className="w-full max-w-[340px] mx-auto">
        <StreakCounter
          streakDays={25}
          completedDays={[0, 1, 2, 3]}
          currentDayIndex={4}
          canClaimReward={false}
          rewardAmount={10}
        />
      </div>
    ),
    codeSnippet: `import { StreakCounter } from '@/components/vip/streak-counter'

<StreakCounter
  streakDays={25}
  completedDays={[0, 1, 2, 3]}
  currentDayIndex={4}
  canClaimReward={false}
  rewardAmount={10}
  onClaimReward={() => console.log('Claimed!')}
  onShare={() => console.log('Shared!')}
/>

// Props:
// streakDays: number — total consecutive days
// completedDays: number[] — indices of completed days (0=Mon, 6=Sun)
// currentDayIndex: number — which day is "today"
// canClaimReward: boolean — shows claim button when all 7 days done
// rewardAmount: number — dollar amount for weekly reward`,
  },
  {
    id: 'reload-claim',
    name: 'Reload Claim',
    description: 'VIP reload bonus card with live countdown timer (days/hours/minutes/seconds), day tracker with check marks, and claim button.',
    category: 'components',
    tags: ['vip', 'reload', 'countdown', 'timer', 'reward', 'claim'],
    filePath: 'components/vip/reload-claim.tsx',
    preview: (
      <div className="w-full max-w-[380px] mx-auto">
        <ReloadClaim
          reloadAmount={25.00}
          totalDays={5}
          completedDays={2}
          expiresAt="02/28/2026, 8:00 PM ET"
        />
      </div>
    ),
    codeSnippet: `import { ReloadClaim } from '@/components/vip/reload-claim'

<ReloadClaim
  reloadAmount={25.00}
  totalDays={5}
  completedDays={2}
  expiresAt="02/28/2026, 8:00 PM ET"
  onClaim={() => console.log('Claimed!')}
/>

// Props:
// reloadAmount: number — dollar amount to claim
// totalDays: number — total days required
// completedDays: number — how many days completed
// expiresAt: string — expiration date string
// onClaim: () => void — callback on claim`,
  },
  {
    id: 'cash-drop-code',
    name: 'Cash Drop Code',
    description: 'Promo code entry card with input field, claim button, success state, and Telegram join CTA. Uses framer-motion for animated states.',
    category: 'components',
    tags: ['vip', 'cash-drop', 'code-entry', 'reward', 'telegram', 'promo'],
    filePath: 'components/vip/cash-drop-code.tsx',
    preview: (
      <div className="w-full max-w-[380px] mx-auto">
        <CashDropCode telegramUrl="https://t.me/betonline" />
      </div>
    ),
    codeSnippet: `import { CashDropCode } from '@/components/vip/cash-drop-code'

<CashDropCode
  onClaim={(code) => console.log('Code:', code)}
  telegramUrl="https://t.me/betonline"
/>

// Features:
// • Text input with uppercase transform
// • Claim Now button (disabled when empty, gold when ready)
// • Animated success state with checkmark
// • Terms & Conditions link
// • Telegram join CTA card with gradient border`,
  },
  {
    id: 'bet-and-get',
    name: 'Bet & Get Missions',
    description: 'Mission-style reward cards with banner skeletons, progress bars, claim buttons, sub-tab filter (All / In Progress), and animated sorting.',
    category: 'blocks',
    tags: ['vip', 'missions', 'rewards', 'progress', 'gamification', 'framer-motion'],
    filePath: 'components/vip/bet-and-get.tsx',
    preview: (
      <div className="w-full max-w-[420px] mx-auto">
        <BetAndGet />
      </div>
    ),
    codeSnippet: `import { BetAndGet } from '@/components/vip/bet-and-get'

<BetAndGet />

// Self-contained component with built-in mission data.
// Mission states: not_started, in_progress, completed
// Each card shows:
// • Banner skeleton with shimmer animation
// • Title + description
// • Task with progress icon (IconCircleCheck)
// • Animated progress bar (gold, framer-motion)
// • Claim button (red when claimable, grey when locked)
// • Terms & Conditions link
// Sub-tabs: "All" / "In Progress" with animated underline indicator`,
  },

  // ── Animated Pill Tabs (Sub Nav) ────────────────────────

  {
    id: 'animate-tabs',
    name: 'Animated Pill Tabs',
    description: 'Radix-based tab bar with spring-animated pill indicator that slides between tabs. Brand-themed active background. Used across Sports, Casino, Promos, My Bonus, and more.',
    category: 'components',
    tags: ['tabs', 'sub-nav', 'navigation', 'animated', 'pill', 'spring', 'framer-motion', 'radix'],
    filePath: 'components/animate-ui/components/base/tabs.tsx',
    preview: (
      <AnimatedPillTabsPreview />
    ),
    codeSnippet: `import {
  Tabs as AnimateTabs,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import { motion } from 'framer-motion'

const [active, setActive] = useState('For You')
const tabs = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Live']

<AnimateTabs value={active} onValueChange={setActive} className="w-full">
  <AnimateTabsList className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative">
    {tabs.map((tab) => (
      <TabsTab
        key={tab}
        value={tab}
        className="relative z-10 text-white/70 hover:text-white rounded-2xl px-4 py-1 h-9 text-xs font-medium data-[state=active]:text-white"
      >
        {active === tab && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-2xl -z-10"
            style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          />
        )}
        <span className="relative z-10">{tab}</span>
      </TabsTab>
    ))}
  </AnimateTabsList>
</AnimateTabs>

// Features:
// • Spring-animated pill (layoutId) slides between active tabs
// • Brand-themed: uses var(--ds-primary) for pill color
// • Rounded pill style (rounded-3xl container, rounded-2xl pills)
// • Works with Radix Tabs — keyboard-accessible
// • Used everywhere: page sub-nav, promos, bonus, race tabs`,
  },

  // ── Betslip ────────────────────────────────────────────

  {
    id: 'number-pad',
    name: 'Betslip Number Pad',
    description: 'iOS-style mobile number pad with quick-amount buttons ($5-$100). Uses onTouchEnd to prevent focus stealing. Light glass background.',
    category: 'components',
    tags: ['number-pad', 'mobile', 'input', 'touch', 'betslip', 'ios-style'],
    filePath: 'components/betslip/number-pad.tsx',
    preview: (
      <div className="w-full max-w-[300px] mx-auto rounded-lg overflow-hidden">
        <BetslipNumberPad
          onDigit={() => {}}
          onBackspace={() => {}}
          onDone={() => {}}
          onQuickAmount={() => {}}
        />
      </div>
    ),
    codeSnippet: `import { BetslipNumberPad } from '@/components/betslip/number-pad'

<BetslipNumberPad
  onDigit={(digit) => appendDigit(digit)}
  onBackspace={() => deleteLastDigit()}
  onDone={() => closeKeyboard()}
  onQuickAmount={(amount) => setStake(amount)}
/>

// Quick amounts: $5, $10, $25, $50, $100
// Uses onTouchEnd (not onClick) to prevent focus-stealing on mobile
// Glass background: rgba(255,255,255,0.78) + backdrop-blur-40px
// Prevents drag events from propagating (data-vaul-no-drag)`,
  },
  {
    id: 'betslip',
    name: 'Global Betslip',
    description: 'Family Drawer-based betslip with multi-bet support, parlay builder, custom number pad, and animated add/remove transitions for selections.',
    category: 'blocks',
    tags: ['betslip', 'drawer', 'family-drawer', 'betting', 'parlay', 'mobile'],
    filePath: 'components/betslip/global-betslip.tsx',
    preview: <BetslipAnimatedPreview />,
    codeSnippet: `import GlobalBetslip from '@/components/betslip/global-betslip'
import { BetslipNumberPad } from '@/components/betslip/number-pad'

// Mounted at layout level — available on all pages.
// Uses Family Drawer pattern with animated view transitions.
<GlobalBetslip />

// Features:
// • Multi-bet (single + parlay) support
// • Custom mobile number pad (BetslipNumberPad)
// • Animated confirmation view
// • Animated add/remove selection transitions (AnimatePresence + layout)
// • Integrated with global betslipStore (Zustand)
// • Auto-hides on sports pages (sports has local betslip)
// • Listens for bet:copy-to-slip events from chat
// • Green accent for "Place Bet" CTA: var(--ds-accent-green)`,
  },

  // ── Chat Panel ─────────────────────────────────────────

  {
    id: 'chat-panel',
    name: 'Chat Panel',
    description: 'Full-featured chat with desktop (fixed side panel, 340px) and mobile (slide-up drawer with drag-to-dismiss). Includes messages, rain banner, user profiles, tip modal.',
    category: 'blocks',
    tags: ['chat', 'panel', 'drawer', 'desktop', 'mobile', 'messages', 'social', 'portal'],
    filePath: 'components/chat/chat-panel.tsx',
    preview: (
      <div className="w-full max-w-[340px] mx-auto rounded-lg border border-white/10 overflow-hidden" style={{ backgroundColor: 'var(--ds-page-bg, #1a1a1a)' }}>
        {/* Header — matches ChatHeader exactly */}
        <div className="flex-shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center h-7 rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden">
                <button className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium bg-white/10 text-white">
                  <IconBallFootball className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Sports Chat
                </button>
                <div className="w-px h-3.5 bg-white/10" />
                <button className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium text-white/40">
                  <IconDice className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Casino Chat
                </button>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 1.2K
            </span>
          </div>
        </div>
        {/* Messages */}
        <div className="p-3 space-y-2.5 max-h-[200px] overflow-y-auto">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0" style={{ backgroundColor: '#2a2a2a' }}>J</div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/80 font-semibold">Jake92</span>
                <span className="text-[8px] px-1 py-0.5 rounded border border-[#cd7f32]/40 bg-[#cd7f32]/15 text-[#e0aa6b]">Bronze</span>
              </div>
              <p className="text-[11px] text-white/60 mt-0.5">Big win on the parlay! 🎉</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0" style={{ backgroundColor: '#2a2a2a' }}>S</div>
            <div>
              <span className="text-[10px] text-white/80 font-semibold">Sarah_VIP</span>
              <p className="text-[11px] text-white/60 mt-0.5">Anyone watching the Liverpool game?</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0" style={{ backgroundColor: '#2a2a2a' }}>M</div>
            <div>
              <span className="text-[10px] text-white/80 font-semibold">Mike_Bets</span>
              <p className="text-[11px] text-white/60 mt-0.5">Just hit a 5-leg parlay 💰💰</p>
            </div>
          </div>
        </div>
        {/* Input */}
        <div className="px-3 py-2 border-t border-white/10">
          <div className="h-8 rounded-lg bg-white/5 border border-white/10 flex items-center px-3">
            <span className="text-[11px] text-white/30">Type a message...</span>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `import ChatPanel from '@/components/chat/chat-panel'

// Auto-detects desktop (side panel) vs mobile (slide-up drawer).
// Rendered via GlobalChatWrapper for portal-based positioning.
<ChatPanel />

// Sub-components:
// • ChatHeader — room toggle + online count
// • ChatMessage — individual messages with user badges (VIP, MOD, etc.)
// • ChatInput — message input with emoji/GIF
// • ChatRainBanner — animated rain event join banner
// • ChatTipModal — user tipping overlay
// • ChatUserProfile — user profile drawer
// • ChatUserList — scrollable user directory

// Desktop: fixed right panel, 340px wide, full viewport height
// Mobile: slide-up drawer with drag-to-dismiss (framer-motion)`,
  },

  // ── Brand Switcher ─────────────────────────────────────

  {
    id: 'brand-switcher',
    name: 'Brand Switcher (Design Customizer)',
    description: 'Floating FAB that opens a popover with brand theme selection, product toggles per brand, JSON import, and "Our Library" CTA.',
    category: 'components',
    tags: ['brand', 'theme', 'switcher', 'customizer', 'design-tokens', 'fab', 'json-import'],
    filePath: 'components/design-customizer.tsx',
    preview: (
      <div className="flex items-center gap-4">
        {/* FAB */}
        <button className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl border border-white/20" style={{ backgroundColor: 'var(--ds-nav-bg, #1c1c1e)' }}>
          <IconPalette className="w-5 h-5 text-white/80" />
        </button>
        {/* Popover preview */}
        <div className="rounded-xl border border-white/10 p-3 w-52" style={{ backgroundColor: 'var(--ds-nav-bg, #1c1c1e)' }}>
          {[
            { name: 'BetOnline', color: '#ee3536', active: true },
            { name: 'Wild Casino', color: '#2faf16', active: false },
            { name: 'Super Slots', color: '#ffdf00', active: false },
          ].map((b) => (
            <div key={b.name} className={cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] transition-all',
              b.active ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5'
            )}>
              <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: b.color }} />
              {b.name}
              {b.active && <IconCheck className="w-3 h-3 ml-auto text-white/60" />}
            </div>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2 space-y-1.5">
            <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 text-[10px] text-white/40 hover:bg-white/10 transition-colors">
              <IconUpload className="w-3 h-3" /> Upload JSON
            </button>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `import { DesignCustomizer, BRANDS } from '@/components/design-customizer'

// Mounted in layout.tsx — always available as floating FAB.
<DesignCustomizer />

// Brand tokens applied as CSS variables:
// --ds-primary, --ds-primary-hover, --ds-nav-bg,
// --ds-page-bg, --ds-sidebar-bg, --ds-card-bg,
// --ds-accent-green, --ds-primary-text

// JSON import format:
{
  "primary": "#ee3536",
  "primaryHover": "#dc2a2f",
  "navBg": "#2D2E2C",
  "pageBg": "#1a1a1a",
  "sidebarBg": "#2d2d2d",
  "cardBg": "#2d2d2d",
  "accentGreen": "#97c43c",
  "primaryTextBlack": false
}

// Features:
// • Brand list with live color preview dots
// • Per-brand product toggles (Sports, Casino, Poker, etc.)
// • JSON file upload to create custom brand tokens
// • "Our Library" CTA — navigates to /library
// • Persists selection to localStorage`,
  },

  // ── Backgrounds ────────────────────────────────────────

  {
    id: 'rain-background',
    name: 'Rain Background',
    description: 'Canvas-based animated rain with 3 depth layers, configurable intensity/angle/color, optional lightning flashes, fog, and vignette.',
    category: 'components',
    tags: ['background', 'animation', 'canvas', 'rain', 'effect', 'atmosphere', 'lightning'],
    filePath: 'components/rain-background.tsx',
    preview: (
      <div className="w-full rounded-lg overflow-hidden">
        <RainBackground
          className="h-40 w-full"
          count={100}
          intensity={1.2}
          angle={10}
          lightning={true}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-white/50 font-medium">Canvas rain with lightning</span>
          </div>
        </RainBackground>
      </div>
    ),
    codeSnippet: `import { RainBackground } from '@/components/rain-background'

<RainBackground
  count={150}        // base raindrop count
  intensity={1.2}    // rain intensity multiplier
  angle={5}          // degrees from vertical
  color="#ffffff"     // raindrop color
  lightning={true}    // enable lightning flashes
  className="h-screen w-full"
>
  {children}
</RainBackground>

// Features:
// • 3 depth layers (back, mid, front) with different speeds/opacity
// • ResizeObserver for responsive canvas
// • Lightning flashes on random intervals (3-8s)
// • Fog/mist gradient at bottom
// • Vignette radial overlay
// • Gradient background: #0c1018 → #1a1f2e → #151922`,
  },
  {
    id: 'interactive-grid',
    name: 'Interactive Grid Background',
    description: 'Canvas dot grid that highlights around the mouse cursor. Dots grow and change color based on proximity.',
    category: 'components',
    tags: ['background', 'canvas', 'interactive', 'grid', 'dots', 'hover', 'cursor'],
    filePath: 'components/interactive-grid-background.tsx',
    preview: (
      <div className="w-full rounded-lg overflow-hidden border border-white/10">
        <InteractiveGridBackground
          className="h-40 w-full"
          gridGap={30}
          dotSize={1.5}
          color="#737373"
          highlightColor="#FFFF00"
          radius={200}
        >
          <div className="flex items-center justify-center h-40">
            <span className="text-sm text-white/50 font-medium">Move cursor to highlight dots</span>
          </div>
        </InteractiveGridBackground>
      </div>
    ),
    codeSnippet: `import { InteractiveGridBackground } from '@/components/interactive-grid-background'

<InteractiveGridBackground
  gridGap={40}
  dotSize={1.5}
  color="#737373"       // base dot color
  highlightColor="#FFFF00" // highlight color near cursor
  radius={300}          // highlight radius in px
  className="h-screen w-full"
>
  {children}
</InteractiveGridBackground>

// Features:
// • Canvas-based rendering for performance
// • Dots grow and brighten near cursor
// • Color transitions from base → highlight color
// • Responsive via window resize listener
// • 30% base opacity for subtle background`,
  },

  // ── Sports Tracker ─────────────────────────────────────

  {
    id: 'sports-tracker-widget',
    name: 'Sports Tracker Widget',
    description: 'Draggable, dockable live sports tracker with STATSCORE integration. Multi-widget dock panel with animated reordering and resizable width.',
    category: 'blocks',
    tags: ['sports', 'tracker', 'widget', 'draggable', 'dockable', 'statscore', 'live', 'framer-motion'],
    filePath: 'components/sports-tracker-widget.tsx',
    preview: (
      <div className="flex items-center gap-4">
        {/* Floating widget */}
        <div className="w-64 rounded-lg border border-white/10 overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--ds-page-bg, #222222)' }}>
          <div className="px-3 py-2 flex items-center justify-between border-b border-white/10" style={{ background: 'color-mix(in srgb, var(--ds-page-bg, #222222) 85%, black)' }}>
            <div className="flex items-center gap-2">
              <IconGripVertical className="w-3 h-3 text-white/30 cursor-grab" />
              <span className="text-[10px] font-medium text-white/70">Liverpool vs Arsenal</span>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
                <IconMinus className="w-3 h-3 text-white/40" />
              </button>
              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
                <IconMaximize className="w-3 h-3 text-white/40" />
              </button>
              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
                <IconX className="w-3 h-3 text-white/40" />
              </button>
            </div>
          </div>
          <div className="p-4 flex items-center justify-center h-20">
            <div className="text-center">
              <div className="text-[10px] text-white/40 mb-1">Premier League · Live</div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-white font-medium">LIV</span>
                <span className="text-xl font-bold text-white tabular-nums">2 - 1</span>
                <span className="text-[11px] text-white font-medium">ARS</span>
              </div>
              <div className="text-[9px] mt-1" style={{ color: 'var(--ds-accent-green, #97c43c)' }}>67&apos;</div>
            </div>
          </div>
        </div>
        {/* Dock indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-1.5 h-12 rounded-full bg-white/10 relative">
            <div className="absolute inset-x-0 top-0 h-1/2 rounded-full" style={{ backgroundColor: 'var(--ds-primary, #ee3536)', opacity: 0.4 }} />
          </div>
          <span className="text-[8px] text-white/20 whitespace-nowrap">Drag → Dock</span>
        </div>
      </div>
    ),
    codeSnippet: `import { SportsTrackerWidget } from '@/components/sports-tracker-widget'
import { useWidgetDockStore } from '@/lib/store/widgetDockStore'

// Open a widget:
const { openWidget } = useWidgetDockStore()
openWidget({
  id: 12345,
  team1: 'Liverpool',
  team2: 'Arsenal',
  league: 'Premier League',
  country: 'England',
  isLive: true,
  statscoreEventId: 6188732,
  statscoreConfigId: '60dc694d4321eaff1879f0cf',
})

// Renders globally via WidgetDockManager (in GlobalChatWrapper).
// Features:
// • Draggable floating widgets (framer-motion drag)
// • Snap-to-dock with ghost preview (dashed outline)
// • Multi-widget dock panel (resizable width 220-500px)
// • Animated reordering via Reorder.Group
// • STATSCORE LivescorePro integration
// • Dock slides left of chat when chat is open
// • Zustand store: widgetDockStore`,
  },

  // ── Jackpot Overlay ────────────────────────────────────

  {
    id: 'jackpot-overlay',
    name: 'Jackpot Overlay',
    description: 'Full-screen jackpot celebration with gold rain (canvas), confetti burst, spinning odometer digits, and share-to-chat / close CTAs.',
    category: 'blocks',
    tags: ['casino', 'jackpot', 'overlay', 'confetti', 'animation', 'odometer', 'gold-rain'],
    filePath: 'components/casino/jackpot-overlay.tsx',
    preview: (
      <div className="w-full rounded-lg overflow-hidden border border-amber-500/20 relative" style={{ background: 'linear-gradient(to bottom, #1a0800, #0a0400)', height: '200px' }}>
        {/* Simulated gold particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute w-1.5 h-2 rounded-sm animate-pulse" style={{
              backgroundColor: ['#FFD700', '#FFA500', '#FFDF00', '#DAA520'][i % 4],
              left: `${8 + i * 8}%`,
              top: `${10 + Math.sin(i) * 30}%`,
              opacity: 0.3,
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center">
            <IconTrophy className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/40">Jackpot Winner</h2>
          <div className="text-3xl font-bold text-white tabular-nums">$250,000.00</div>
          <p className="text-[10px] text-white/40">Won on <span className="text-white/70 font-medium">Mega Fortune</span></p>
          <div className="flex items-center gap-2 mt-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-[10px] font-semibold">
              <IconShare className="w-3 h-3" /> Share to Chat
            </button>
            <button className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <IconX className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
        </div>
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[200px] h-[200px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(238,53,54,0.05) 50%, transparent 70%)' }} />
        </div>
      </div>
    ),
    codeSnippet: `import { JackpotOverlay } from '@/components/casino/jackpot-overlay'

<JackpotOverlay
  visible={showJackpot}
  onClose={() => setShowJackpot(false)}
  onShareToChat={() => shareWinToChat()}
  gameName="Mega Fortune"
/>

// Animation sequence:
// Phase 1 (0.4s): Start digit spinning
// Phase 2 (0.6-1.8s): Scale up progressively
// Phase 3 (3.0s): Land digits + confetti burst
// Phase 4 (3.4s): Show Share/Close CTAs

// Features:
// • GoldRain — canvas particle animation
// • SpinDigit — odometer-style spinning columns
// • canvas-confetti — multi-burst celebration
// • Radial glow pulse on landing
// • Full-screen z-[99999] overlay`,
  },

  // ── Family Drawer ──────────────────────────────────────

  {
    id: 'account-drawer',
    name: 'Account Drawer',
    description: 'Right-side sliding drawer for user account details. White-themed with avatar, balance, and navigation menu. Swipe right to dismiss on mobile. Drag to interact.',
    category: 'components',
    tags: ['drawer', 'account', 'profile', 'slide', 'drag', 'mobile', 'vaul'],
    filePath: 'components/ui/drawer.tsx + app/page.tsx',
    preview: <AccountDrawerPreview />,
    codeSnippet: `import { Drawer, DrawerContent, DrawerHandle, DrawerHeader, DrawerClose } from '@/components/ui/drawer'

<Drawer
  open={accountDrawerOpen}
  onOpenChange={setAccountDrawerOpen}
  direction={isMobile ? "bottom" : "right"}
  shouldScaleBackground={false}
>
  <DrawerContent
    showOverlay={isMobile}
    className="w-full sm:max-w-md bg-[#1a1a1a] text-white flex flex-col border-l border-white/10"
  >
    {isMobile && <DrawerHandle variant="dark" />}
    <DrawerHeader>
      <Avatar /> <span>Username</span>
    </DrawerHeader>
    {/* Balance, menu items, sign out */}
  </DrawerContent>
</Drawer>

// Features:
// • Mobile: slides up from bottom with drag handle
// • Desktop: slides in from right
// • Multi-view: account → notifications → settings
// • Uses vaul drawer primitives
// • White-themed for contrast with dark app`,
  },

  // ── Side Nav Drawer ──────────────────────────────────────

  {
    id: 'side-nav-drawer',
    name: 'Side Nav Drawer',
    description: 'Left-side mobile navigation drawer with sport categories. Uses vaul drawer with drag-to-dismiss. Brand-themed active states. Drag left to dismiss.',
    category: 'components',
    tags: ['drawer', 'sidebar', 'navigation', 'mobile', 'slide', 'drag', 'vaul', 'sports'],
    filePath: 'components/ui/sidebar.tsx',
    preview: <SideNavDrawerPreview />,
    codeSnippet: `import { Sidebar, SidebarContent, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { Drawer, DrawerContent } from '@/components/ui/drawer'

// On mobile, the Sidebar component automatically becomes a left-slide drawer:
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarContent>
      {/* Sport categories with icons */}
      {sportsCategories.map((sport) => (
        <SidebarMenuButton
          isActive={activeSport === sport.label}
          style={isActive ? { backgroundColor: 'var(--ds-primary)' } : undefined}
        >
          <img src={sport.icon} />
          <span>{sport.label}</span>
        </SidebarMenuButton>
      ))}
    </SidebarContent>
  </Sidebar>
</SidebarProvider>

// Features:
// • Mobile: vaul drawer slides from left, drag to dismiss
// • Desktop: collapsible sidebar with tooltip icons
// • Brand-themed active states
// • Expandable sub-menus per sport
// • Shadow + backdrop for mobile overlay`,
  },

  // ── Family Drawer ────────────────────────────────────────

  {
    id: 'family-drawer',
    name: 'Family Drawer',
    description: 'Multi-view animated drawer system. Mobile uses vaul snap points, desktop uses panel mode. Views transition with shared layout animations. Try dragging the drawer down to dismiss.',
    category: 'components',
    tags: ['drawer', 'modal', 'mobile', 'vaul', 'animation', 'multi-view', 'drag'],
    filePath: 'components/ui/family-drawer.tsx',
    preview: <FamilyDrawerPreview />,
    codeSnippet: `import {
  FamilyDrawerRoot,
  FamilyDrawerContent,
  FamilyDrawerAnimatedWrapper,
  FamilyDrawerAnimatedContent,
  FamilyDrawerViewContent,
  useFamilyDrawer,
  type ViewsRegistry,
} from '@/components/ui/family-drawer'

// Register views:
const views: ViewsRegistry = {
  default: DefaultView,
  confirmation: ConfirmView,
}

// Usage:
<FamilyDrawerRoot views={views} open={isOpen}>
  <FamilyDrawerContent>
    <FamilyDrawerAnimatedWrapper>
      <FamilyDrawerAnimatedContent>
        <FamilyDrawerViewContent />
      </FamilyDrawerAnimatedContent>
    </FamilyDrawerAnimatedWrapper>
  </FamilyDrawerContent>
</FamilyDrawerRoot>

// Switch views inside any child:
const { switchView } = useFamilyDrawer()
switchView('confirmation')

// Features:
// • Auto-sizes to content
// • Shared layout animation between views
// • Mobile: vaul drawer with snap points
// • Desktop: centered panel/modal`,
  },

  // ── Casino Tile Types ───────────────────────────────────
  {
    id: 'casino-tile-types',
    name: 'Casino Tile Types',
    description: 'Three tile variants: Square grid tiles with tag badges (Hot, Early, Exclusive, New, Original), portrait 4:5 ratio tiles with bottom info overlay, and Live Casino tiles with live indicator, roulette history / seat tracker, and vendor badge. All tiles have hover shimmer effects and consistent rounded-small corners.',
    category: 'components',
    tags: ['casino', 'tile', 'game', 'card', 'live', 'badge', 'grid', 'carousel'],
    filePath: 'app/casino/page.tsx (GameTile, LazyGameTile, LiveCasinoTile)',
    preview: <CasinoTilesPreview />,
    codeSnippet: `// ─ Square GameTile ─
<div className="relative group cursor-pointer">
  <div className="w-full aspect-square rounded-small overflow-hidden bg-white/5">
    <Image src={game.image} alt={game.title} fill className="object-cover" />
    {/* Tag badges — top-left */}
    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
      <VendorBadge vendor={game.provider} />
      <GameTagBadge tag={game.tag} />   {/* Hot | Early | Exclusive | New | Original */}
    </div>
    {/* Hover overlay */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
  </div>
</div>

// ─ Portrait LazyGameTile (4:5) ─
<div className="relative w-[160px] aspect-[4/5] rounded-small overflow-hidden bg-white/5">
  <Image src={game.image} alt={game.title} fill className="object-cover" />
  <GameTagBadge tag={game.tag} />
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-2">
    <div className="text-white text-xs font-bold truncate">{game.title}</div>
    <div className="text-white/70 text-[10px]">{game.provider}</div>
  </div>
</div>

// ─ LiveCasinoTile ─
<div className="relative rounded-small overflow-hidden bg-white/5" style={{ width: '200px', height: '220px' }}>
  <Image src={game.image} alt={game.title} fill className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
  {/* Live pill */}
  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/15">
    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
    <span className="text-white text-[10px] font-medium">$25 - $5,000</span>
  </div>
  {/* Bottom */}
  <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
    <div className="text-white/60 text-[10px] uppercase tracking-wider">LIVE ROULETTE</div>
    <div className="text-white font-bold text-sm">{game.title}</div>
    {/* Roulette history numbers */}
    <div className="flex gap-0.5 my-1.5">
      {history.map(n => (
        <div className={cn('w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center',
          n === 0 ? 'bg-emerald-600' : n <= 18 ? 'bg-red-600' : 'bg-gray-800'
        )}>{n}</div>
      ))}
    </div>
    <VendorBadge vendor="Evolution" />
  </div>
</div>`,
  },

  // ── Vendor Carousel ─────────────────────────────────────
  {
    id: 'vendor-carousel',
    name: 'Vendor Carousel',
    description: 'Horizontally scrollable vendor pills showing provider logo + name. Each pill has a glass-morphism hover effect with a sweep shimmer animation. Used in casino to filter games by software vendor (Dragon Gaming, BetSoft, Nucleus, Rival, etc.).',
    category: 'components',
    tags: ['casino', 'vendor', 'carousel', 'filter', 'pill', 'provider', 'scroll'],
    filePath: 'app/casino/page.tsx (vendor carousel section)',
    preview: <VendorCarouselPreview />,
    codeSnippet: `// Vendor carousel — horizontal scrollable pills
<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
  {vendors.map(vendor => (
    <button
      key={vendor.id}
      onClick={() => setActiveVendor(vendor.id)}
      className={cn(
        'group relative bg-white/5 border border-white/10 rounded-lg px-3 py-2.5',
        'text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white',
        'transition-all duration-300 whitespace-nowrap overflow-hidden',
        'flex items-center gap-2 flex-shrink-0',
        activeVendor === vendor.id && 'bg-white/10 text-white border-white/20'
      )}
    >
      {/* Vendor icon */}
      <div className="w-5 h-5 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0">
        <Image src={vendor.logo} alt="" width={14} height={14} className="object-contain" />
      </div>
      <span className="relative z-10">{vendor.name}</span>
      {/* Hover sweep */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
        transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-0" />
    </button>
  ))}
</div>

// Vendor data shape:
const vendors = [
  { id: 'dragon', name: 'Dragon Gaming', logo: '/vendors/dragon.svg' },
  { id: 'betsoft', name: 'BetSoft', logo: '/vendors/betsoft.svg' },
  // ...
]`,
  },

  // ── Game Launcher ───────────────────────────────────────
  {
    id: 'game-launcher',
    name: 'Game Launcher',
    description: 'Full-screen overlay for launching casino games. Features a top bar with hamburger menu (quick deposit, more games, VIP progress), centered game title, fullscreen toggle, favorite button, and close button. Includes animated loading state with spinner and provider name. Menu panel slides down with framer-motion.',
    category: 'blocks',
    tags: ['casino', 'game', 'launcher', 'overlay', 'fullscreen', 'loading', 'menu', 'favorite'],
    filePath: 'app/casino/page.tsx (game launcher overlay)',
    preview: <GameLauncherPreview />,
    codeSnippet: `// Game Launcher Overlay — covers entire viewport
<AnimatePresence>
  {gameLauncherOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#1a1a1a] flex flex-col"
    >
      {/* ─ Top Bar ─ */}
      <div className="h-12 px-4 flex items-center justify-between relative
        bg-[rgba(26,26,26,0.6)] backdrop-blur-2xl border-b border-white/10">
        {/* Hamburger menu */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-white/10 rounded-full">
          <IconMenu2 className="w-5 h-5 text-white" />
        </button>
        {/* Game name — centered */}
        <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white">{game.title}</h2>
        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button onClick={toggleFullscreen}><IconMaximize className="w-5 h-5 text-white/70" /></button>
          <button onClick={toggleFavorite}>
            <IconHeart className={cn('w-5 h-5', favorited ? 'text-pink-500 fill-pink-500' : 'text-white/70')} />
          </button>
          <button onClick={closeLauncher}><IconX className="w-5 h-5 text-white/70" /></button>
        </div>
      </div>

      {/* ─ Menu Panel ─ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-4 w-56 bg-[#2d2d2d]/95 backdrop-blur-xl border border-white/10 rounded-xl z-50">
            <div className="py-2">
              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10">Quick Deposit</button>
              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10">More Games Like This</button>
            </div>
            <div className="px-4 py-3 border-t border-white/10 bg-white/5">
              <p className="text-xs text-white/70 mb-2">Gold To Platinum I</p>
              <VIPProgressBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─ Game Viewport ─ */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <motion.div animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full" />
              <p className="text-white/70 text-sm">Loading game...</p>
              <p className="text-white/50 text-xs">{game.provider}</p>
            </motion.div>
          ) : (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0">
              <iframe src={game.url} className="w-full h-full border-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )}
</AnimatePresence>`,
  },

  // ── Sports Live & Upcoming Events ──────────────────────
  {
    id: 'sports-live-upcoming',
    name: 'Sports Live & Upcoming Events',
    description: 'Current sports events list style with Live/Upcoming tabs, in-play chips, compact score column, and selectable odds tiles.',
    category: 'blocks',
    tags: ['sports', 'live', 'upcoming', 'events', 'betting', 'odds', 'markets', 'score', 'in-play'],
    filePath: 'app/sports/page.tsx (events list section)',
    preview: <SportsOfferingsPreview />,
    codeSnippet: `// Sports Live & Upcoming Events
const [tab, setTab] = useState<'live' | 'upcoming'>('live')

{/* Tab switcher */}
<div className="flex items-center gap-2 mb-3">
  <button onClick={() => setTab('live')}
    className={cn('px-3 py-1.5 rounded-small text-xs font-medium',
      tab === 'live' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white')}>
    🔴 Live
  </button>
  <button onClick={() => setTab('upcoming')}
    className={cn('px-3 py-1.5 rounded-small text-xs font-medium',
      tab === 'upcoming' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white')}>
    Upcoming
  </button>
</div>

{/* Event card */}
<div className="bg-white/5 border border-white/10 rounded-small">
  {/* League header */}
  <div className="px-2.5 py-1.5 flex items-center gap-2 bg-white/[0.02]">
    <img src={sportIconMap[event.sport]} className="w-3.5 h-3.5" />
    <span className="text-[10px] text-white/60 font-medium">{event.league}</span>
    {event.isLive && (
      <div className="ml-auto flex items-center gap-1">
        <div className="bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5">
          <div className="w-1 h-1 bg-[#ee3536] rounded-full animate-pulse" />
          <span className="text-[8px] font-semibold text-[#ee3536]">LIVE</span>
        </div>
        <span className="text-[8px] text-white/50">{event.period} {event.time}</span>
      </div>
    )}
  </div>

  {/* Scores + Teams + Markets */}
  <div className="px-2.5 py-2 flex items-center gap-3">
    {/* Live scores */}
    {event.isLive && (
      <div className="flex flex-col items-center gap-0.5 w-10">
        <span className="text-xs font-bold text-white">{event.score1}</span>
        <span className="text-xs font-bold text-white">{event.score2}</span>
      </div>
    )}
    {/* Team names */}
    <div className="flex flex-col gap-1 w-[140px]">
      <span className="text-[11px] font-semibold text-white truncate">{event.team1}</span>
      <span className="text-[11px] font-semibold text-white truncate">{event.team2}</span>
    </div>
    {/* Markets carousel */}
    <MarketsCarousel markets={event.markets} onSelect={addToBetslip} />
  </div>
</div>`,
  },
  {
    id: 'sports-top-events-cards',
    name: 'Sports Top Events Cards',
    description: 'Top events card list with compact league headers, team rows, and quick-select odds buttons.',
    category: 'blocks',
    tags: ['sports', 'top-events', 'cards', 'odds', 'markets'],
    filePath: 'app/sports/page.tsx (Top Events section)',
    preview: <SportsTopEventsCardsPreview />,
    codeSnippet: `// Sports Top Events Cards
<section>
  <h2>Top Events</h2>
  {events.map((event) => (
    <EventCard key={event.id}>
      <TeamRows />
      <OddsButtons />
    </EventCard>
  ))}
</section>`,
  },
  {
    id: 'sports-sgp-cards',
    name: 'Sports Same Game Parlay Cards',
    description: 'Card-style SGP offers showing match, combined leg summary, and combined odds CTA.',
    category: 'blocks',
    tags: ['sports', 'same-game-parlay', 'sgp', 'cards', 'odds'],
    filePath: 'app/sports/page.tsx (Same Game Parlays section)',
    preview: <SameGameParlayCardsPreview />,
    codeSnippet: `// Same Game Parlay Card
<Card>
  <Badge>Same Game Parlay</Badge>
  <MatchTitle />
  <LegSummary />
  <CombinedOdds />
  <Button>Add SGP</Button>
</Card>`,
  },
  {
    id: 'sports-bet-boost-cards',
    name: 'Sports Bet Boost Cards',
    description: 'Boost card treatment with yellow boost badge, original odds crossed out, and boosted odds as primary.',
    category: 'blocks',
    tags: ['sports', 'bet-boost', 'boosted-odds', 'cards'],
    filePath: 'app/sports/page.tsx (Top Bet Boosts section)',
    preview: <BetBoostCardsPreview />,
    codeSnippet: `// Bet Boost Card
<Card>
  <BoostBadge />
  <MarketLabel />
  <SelectionTitle />
  <Odds from={originalOdds} to={boostedOdds} />
  <Button>Add Boost</Button>
</Card>`,
  },

  // ── Balance Animation (NumberFlow) ─────────────────────
  {
    id: 'balance-animation',
    name: 'Balance Animation (NumberFlow)',
    description: 'Animated balance display using @number-flow/react. Shows the balance rolling up/down with spring physics when deposits, wins, or bets occur. Used in the main navigation header (avatar + balance pill) and account drawers. Supports formatted currency output with minimumFractionDigits. Also integrates with the useRainBalance hook which listens for rain:win custom events from the chat to animate balance changes with ease-out cubic easing.',
    category: 'atoms',
    tags: ['balance', 'animation', 'number', 'numberflow', 'currency', 'header', 'nav', 'spring'],
    filePath: 'app/casino/page.tsx (nav header), hooks/use-rain-balance.ts',
    preview: <BalanceAnimationPreview />,
    codeSnippet: `import NumberFlow from "@number-flow/react"

// ─ In the nav header (avatar + balance pill) ─
<Button className="flex items-center gap-1.5 bg-white/5 rounded-small px-2 py-1">
  <Avatar className="h-6 w-6 border border-white/20">
    <AvatarFallback className="bg-white/10 text-white text-[10px] font-semibold">CH</AvatarFallback>
  </Avatar>
  <span className="text-xs font-medium text-white tabular-nums min-w-[70px] text-right">
    {currentBrand.symbol}
    <NumberFlow
      value={displayBalance}
      format={{ notation: 'standard', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
    />
  </span>
</Button>

// ─ useRainBalance hook (hooks/use-rain-balance.ts) ─
// Listens for rain:win events from chat and animates the balance change
import { useRainBalance } from '@/hooks/use-rain-balance'

const [balance, setBalance] = useState(100)
const [displayBalance, setDisplayBalance] = useState(100)
useRainBalance(setBalance, setDisplayBalance)

// The hook animates displayBalance from current → new using
// requestAnimationFrame with cubic ease-out over 600ms

// ─ NumberFlow format options ─
<NumberFlow
  value={amount}
  format={{
    notation: 'standard',        // 'compact' for 1.2K style
    minimumFractionDigits: 2,    // always show cents
    maximumFractionDigits: 2,
  }}
/>

// ─ Also used in VIP Progress, Daily Races Timer, Total Rewards ─
<NumberFlow value={Math.round(animatedValue)} />%  // VIP progress percentage

// Timer countdown:
<NumberFlow value={hours} />:<NumberFlow value={minutes} />:<NumberFlow value={seconds} />

// Total rewards claimed:
$<NumberFlow value={shouldAnimate ? 673.28 : 0}
  format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />`,
  },
]

// ── Category Config ─────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All', icon: IconLayoutGrid },
  { id: 'atoms', label: 'Atoms', icon: IconBolt },
  { id: 'components', label: 'Components', icon: IconCode },
  { id: 'blocks', label: 'Blocks', icon: IconFilter },
] as const

// ── Right Sidebar Data ──────────────────────────────────
const SHADCN_COMPONENTS = [
  { name: 'Accordion', file: 'accordion.tsx', description: 'Vertically collapsing content sections', radix: true },
  { name: 'Avatar', file: 'avatar.tsx', description: 'Circular user/entity image with fallback', radix: true },
  { name: 'Badge', file: 'badge.tsx', description: 'Status/label indicator pill', radix: false },
  { name: 'Button', file: 'button.tsx', description: '6 variants: default, destructive, outline, secondary, ghost, link', radix: false },
  { name: 'Card', file: 'card.tsx', description: 'Container with header, content, footer, title, description', radix: false },
  { name: 'Carousel', file: 'carousel.tsx', description: 'Embla-powered horizontal carousel with prev/next', radix: false },
  { name: 'Checkbox', file: 'checkbox.tsx', description: 'Toggle checkbox with indeterminate state', radix: true },
  { name: 'Dotted Glow BG', file: 'dotted-glow-background.tsx', description: 'Animated dotted background with radial glow', radix: false },
  { name: 'Drawer', file: 'drawer.tsx', description: 'Vaul-powered bottom sheet / side panel', radix: false },
  { name: 'Dropdown Menu', file: 'dropdown-menu.tsx', description: 'Contextual action menu with sub-menus', radix: true },
  { name: 'Empty State', file: 'empty.tsx', description: 'Placeholder for empty data views', radix: false },
  { name: 'Family Drawer', file: 'family-drawer.tsx', description: 'Multi-view drawer with shared layout animations', radix: false },
  { name: 'Input', file: 'input.tsx', description: 'Text input field with focus ring', radix: false },
  { name: 'Label', file: 'label.tsx', description: 'Accessible form label', radix: true },
  { name: 'Navigation Menu', file: 'navigation-menu.tsx', description: 'Top-level site navigation with dropdowns', radix: true },
  { name: 'Pagination', file: 'pagination.tsx', description: 'Page navigation with prev/next/ellipsis', radix: false },
  { name: 'Popover', file: 'popover.tsx', description: 'Floating content anchored to trigger', radix: true },
  { name: 'Progress', file: 'progress.tsx', description: 'Horizontal progress bar indicator', radix: true },
  { name: 'Select', file: 'select.tsx', description: 'Dropdown select with search and groups', radix: true },
  { name: 'Separator', file: 'separator.tsx', description: 'Horizontal or vertical divider line', radix: true },
  { name: 'Sheet', file: 'sheet.tsx', description: 'Slide-in panel from any edge', radix: true },
  { name: 'Sidebar', file: 'sidebar.tsx', description: 'Collapsible sidebar with icon mode, mobile sheet, tooltip', radix: false },
  { name: 'Skeleton', file: 'skeleton.tsx', description: 'Loading placeholder with pulse animation', radix: false },
  { name: 'Sonner (Toast)', file: 'sonner.tsx', description: 'Toast notification system', radix: false },
  { name: 'Table', file: 'table.tsx', description: 'Data table with header, body, footer, caption', radix: false },
  { name: 'Tabs', file: 'tabs.tsx', description: 'Tabbed content switcher', radix: true },
  { name: 'Toggle', file: 'toggle.tsx', description: 'Pressable on/off toggle button', radix: true },
  { name: 'Tooltip', file: 'tooltip.tsx', description: 'Hover/focus content tooltip', radix: true },
]

const CUSTOM_COMPONENTS = [
  { name: 'AnimateTabs', path: 'components/animate-ui/', description: 'Framer-motion animated tab switcher with spring physics' },
  { name: 'ChatNavToggle', path: 'components/chat/chat-nav-toggle.tsx', description: 'Chat panel toggle with unread dot' },
  { name: 'ChatPanel', path: 'components/chat/chat-panel.tsx', description: 'Full chat panel with messages, input, user list' },
  { name: 'GlobalBetslip', path: 'components/betslip/global-betslip.tsx', description: 'Bottom betslip with number pad and stake input' },
  { name: 'DesignCustomizer', path: 'components/design-customizer.tsx', description: 'Runtime theme/brand switching panel' },
  { name: 'StreakCounter', path: 'components/vip/streak-counter.tsx', description: 'Animated daily login streak tracker' },
  { name: 'BetAndGet', path: 'components/vip/bet-and-get.tsx', description: 'Wagering bonus reward card' },
  { name: 'ReloadClaim', path: 'components/vip/reload-claim.tsx', description: 'Deposit reload bonus claim card' },
  { name: 'CashDropCode', path: 'components/vip/cash-drop-code.tsx', description: 'Cash drop redemption code input' },
  { name: 'JackpotOverlay', path: 'components/casino/jackpot-overlay.tsx', description: 'Progressive jackpot overlay display' },
  { name: 'SportsTracker', path: 'components/sports-tracker-widget.tsx', description: 'Live sports tracking widget' },
  { name: 'NumberFlow', path: '@number-flow/react', description: 'Animated number transitions with spring physics' },
]

const DESIGN_TOKENS = {
  font: {
    family: 'Figtree',
    variable: '--font-figtree',
    weights: ['300 Light', '400 Regular', '500 Medium', '600 SemiBold', '700 Bold', '800 ExtraBold', '900 Black'],
    source: 'Google Fonts (next/font)',
    tailwind: 'font-figtree',
  },
  colors: {
    brand: [
      { token: '--ds-primary', value: '#ee3536', label: 'Primary (BetOnline Red)' },
      { token: '--ds-nav-bg', value: '#2D2E2C', label: 'Navigation BG' },
      { token: '--ds-sidebar-bg', value: '#2d2d2d', label: 'Sidebar BG' },
      { token: '--ds-page-bg', value: '#0a0a0a', label: 'Page BG' },
    ],
    semantic: [
      { token: '--background', value: '#0a0a0a / #ffffff', label: 'Background' },
      { token: '--foreground', value: '#ffffff / #0a0a0a', label: 'Foreground' },
      { token: '--card', value: 'hsl(0 0% 3.9%)', label: 'Card' },
      { token: '--primary', value: 'hsl(0 0% 98%)', label: 'Primary' },
      { token: '--muted', value: 'hsl(0 0% 14.9%)', label: 'Muted' },
      { token: '--accent', value: 'hsl(0 0% 14.9%)', label: 'Accent' },
      { token: '--destructive', value: 'hsl(0 62.8% 30.6%)', label: 'Destructive' },
    ],
  },
  radius: { small: '6px' },
  spacing: '4px base unit',
}

const KEY_DEPENDENCIES = [
  { name: 'Next.js', version: '14.x', type: 'Framework' },
  { name: 'React', version: '18.x', type: 'Framework' },
  { name: 'Tailwind CSS', version: '3.x', type: 'Styling' },
  { name: 'Framer Motion', version: '11.x', type: 'Animation' },
  { name: 'Radix UI', version: 'latest', type: 'Primitives' },
  { name: 'shadcn/ui', version: 'default', type: 'Components' },
  { name: 'Tabler Icons', version: '3.x', type: 'Icons' },
  { name: 'Lucide React', version: '0.56x', type: 'Icons' },
  { name: 'Embla Carousel', version: '8.x', type: 'Carousel' },
  { name: 'Vaul', version: '1.x', type: 'Drawer' },
  { name: 'Zustand', version: '4.x', type: 'State' },
  { name: 'NumberFlow', version: '0.5.x', type: 'Animation' },
  { name: 'Sonner', version: '2.x', type: 'Toast' },
  { name: 'CVA', version: '0.7.x', type: 'Variants' },
]

// ── RightSidebar ────────────────────────────────────────
function RightSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    shadcn: true,
    custom: false,
    tokens: false,
    deps: false,
  })
  const [sidebarSearch, setSidebarSearch] = useState('')

  const toggle = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))

  const filteredShadcn = SHADCN_COMPONENTS.filter(c =>
    !sidebarSearch || c.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || c.description.toLowerCase().includes(sidebarSearch.toLowerCase())
  )
  const filteredCustom = CUSTOM_COMPONENTS.filter(c =>
    !sidebarSearch || c.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || c.description.toLowerCase().includes(sidebarSearch.toLowerCase())
  )

  return (
    <aside className="w-[280px] flex-shrink-0 border-l border-white/[0.06] bg-[#0a0a0a]/60 backdrop-blur-sm overflow-y-auto scrollbar-hide sticky top-[65px]" style={{ height: 'calc(100vh - 65px)' }}>
      {/* Sidebar header */}
      <div className="px-3 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
            <IconCode className="w-3 h-3 text-white/60" />
          </div>
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Design System</span>
        </div>
        <div className="relative">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="Filter..."
            className="w-full h-7 pl-8 pr-3 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* ── shadcn/ui Components ── */}
      <div className="border-b border-white/[0.06]">
        <button onClick={() => toggle('shadcn')} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white/60">S</span>
            </div>
            <span className="text-[11px] font-semibold text-white/70">shadcn/ui</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40">{filteredShadcn.length}</span>
          </div>
          <IconChevronDown className={cn('w-3 h-3 text-white/40 transition-transform duration-200', openSections.shadcn && 'rotate-180')} />
        </button>
        <AnimatePresence initial={false}>
          {openSections.shadcn && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-2 pb-2 space-y-0.5">
                {filteredShadcn.map(comp => (
                  <div key={comp.file} className="group flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors cursor-default">
                    <div className="w-1 h-1 rounded-full bg-white/20 mt-1.5 flex-shrink-0 group-hover:bg-white/40" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">{comp.name}</span>
                        {comp.radix && (
                          <span className="text-[8px] px-1 py-[1px] rounded bg-blue-500/15 border border-blue-500/25 text-blue-400/80 font-medium leading-none">Radix</span>
                        )}
                      </div>
                      <p className="text-[9px] text-white/35 leading-tight mt-0.5">{comp.description}</p>
                    </div>
                  </div>
                ))}
                {filteredShadcn.length === 0 && <p className="text-[10px] text-white/30 px-2 py-2">No matches</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Custom Components ── */}
      <div className="border-b border-white/[0.06]">
        <button onClick={() => toggle('custom')} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500/15 flex items-center justify-center">
              <span className="text-[8px] font-bold text-emerald-400/80">C</span>
            </div>
            <span className="text-[11px] font-semibold text-white/70">Custom Components</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40">{filteredCustom.length}</span>
          </div>
          <IconChevronDown className={cn('w-3 h-3 text-white/40 transition-transform duration-200', openSections.custom && 'rotate-180')} />
        </button>
        <AnimatePresence initial={false}>
          {openSections.custom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-2 pb-2 space-y-0.5">
                {filteredCustom.map(comp => (
                  <div key={comp.name} className="group flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors cursor-default">
                    <div className="w-1 h-1 rounded-full bg-emerald-500/30 mt-1.5 flex-shrink-0 group-hover:bg-emerald-400/50" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">{comp.name}</span>
                      <p className="text-[9px] text-white/35 leading-tight mt-0.5">{comp.description}</p>
                      <p className="text-[8px] text-white/25 font-mono mt-0.5 truncate">{comp.path}</p>
                    </div>
                  </div>
                ))}
                {filteredCustom.length === 0 && <p className="text-[10px] text-white/30 px-2 py-2">No matches</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Typography & Tokens ── */}
      <div className="border-b border-white/[0.06]">
        <button onClick={() => toggle('tokens')} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500/15 flex items-center justify-center">
              <IconPalette className="w-2.5 h-2.5 text-purple-400/80" />
            </div>
            <span className="text-[11px] font-semibold text-white/70">Tokens & Typography</span>
          </div>
          <IconChevronDown className={cn('w-3 h-3 text-white/40 transition-transform duration-200', openSections.tokens && 'rotate-180')} />
        </button>
        <AnimatePresence initial={false}>
          {openSections.tokens && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-4">
                {/* Font */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Font</span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-figtree)' }}>Figtree</span>
                      <span className="text-[9px] text-white/40 font-mono">var(--font-figtree)</span>
                    </div>
                    <p className="text-[9px] text-white/40 mb-2.5">Google Fonts · next/font · Tailwind: <code className="text-[9px] px-1 py-0.5 bg-white/[0.06] rounded text-white/60">font-figtree</code></p>
                    <div className="space-y-1">
                      {DESIGN_TOKENS.font.weights.map(w => {
                        const [num, name] = w.split(' ')
                        return (
                          <div key={w} className="flex items-center justify-between">
                            <span className="text-[11px] text-white/70" style={{ fontFamily: 'var(--font-figtree)', fontWeight: parseInt(num) }}>{name}</span>
                            <span className="text-[9px] text-white/30 font-mono">{num}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-white/[0.06]">
                      <p className="text-[11px] text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-figtree)' }}>
                        The quick brown fox jumps over the lazy dog. 0123456789
                      </p>
                    </div>
                  </div>
                </div>

                {/* Brand colors */}
                <div>
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2 block">Brand Colors</span>
                  <div className="space-y-1.5">
                    {DESIGN_TOKENS.colors.brand.map(c => (
                      <div key={c.token} className="flex items-center gap-2.5 group">
                        <div className="w-5 h-5 rounded-sm border border-white/10 flex-shrink-0" style={{ backgroundColor: c.value }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-white/70 group-hover:text-white transition-colors">{c.label}</div>
                          <div className="text-[8px] text-white/30 font-mono truncate">{c.token}: {c.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semantic colors */}
                <div>
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2 block">Semantic Colors (Dark)</span>
                  <div className="space-y-1">
                    {DESIGN_TOKENS.colors.semantic.map(c => (
                      <div key={c.token} className="flex items-center gap-2.5 group">
                        <div className="w-4 h-4 rounded-sm border border-white/10 flex-shrink-0" style={{ backgroundColor: c.value.startsWith('hsl') ? c.value : c.value.split(' / ')[0] }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-white/60">{c.label}</div>
                          <div className="text-[8px] text-white/25 font-mono truncate">{c.token}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radius & spacing */}
                <div>
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2 block">Radius & Spacing</span>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-center">
                      <div className="w-8 h-8 rounded-small bg-white/10 border border-white/20 mx-auto mb-1" />
                      <div className="text-[9px] text-white/50">rounded-small</div>
                      <div className="text-[8px] text-white/30 font-mono">6px</div>
                    </div>
                    <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-center">
                      <div className="flex items-end gap-[4px] justify-center h-8 mb-1">
                        <div className="w-2 h-2 bg-white/20 rounded-[1px]" />
                        <div className="w-2 h-4 bg-white/20 rounded-[1px]" />
                        <div className="w-2 h-6 bg-white/20 rounded-[1px]" />
                        <div className="w-2 h-8 bg-white/20 rounded-[1px]" />
                      </div>
                      <div className="text-[9px] text-white/50">Base unit</div>
                      <div className="text-[8px] text-white/30 font-mono">4px</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Dependencies ── */}
      <div>
        <button onClick={() => toggle('deps')} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500/15 flex items-center justify-center">
              <span className="text-[8px] font-bold text-amber-400/80">⚡</span>
            </div>
            <span className="text-[11px] font-semibold text-white/70">Dependencies</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40">{KEY_DEPENDENCIES.length}</span>
          </div>
          <IconChevronDown className={cn('w-3 h-3 text-white/40 transition-transform duration-200', openSections.deps && 'rotate-180')} />
        </button>
        <AnimatePresence initial={false}>
          {openSections.deps && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-2 pb-3 space-y-0.5">
                {KEY_DEPENDENCIES.map(dep => (
                  <div key={dep.name} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-500/30 group-hover:bg-amber-400/50" />
                      <span className="text-[11px] text-white/70 group-hover:text-white transition-colors">{dep.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] px-1 py-[1px] rounded bg-white/[0.06] text-white/40">{dep.type}</span>
                      <span className="text-[9px] text-white/30 font-mono">{dep.version}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/[0.06] mt-auto">
        <div className="text-[9px] text-white/25 space-y-1">
          <p>shadcn/ui · style: default · baseColor: neutral</p>
          <p>Registries: animate-ui, billingsdk, limeplay, aceternity</p>
          <p className="font-mono">components.json → @/components/ui</p>
        </div>
      </div>
    </aside>
  )
}

// ── Page Component ──────────────────────────────────────
export default function LibraryPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const strictSourceMode = true

  const verifiedLibrary = LIBRARY.filter(isEntrySourceVerified)
  const auditedLibrary = LIBRARY.filter((entry) => isEntrySourceVerified(entry) && isEntryAudited(entry))

  const filtered = LIBRARY.filter((entry) => {
    const matchesCategory = activeCategory === 'all' || entry.category === activeCategory
    const matchesSearch =
      !search ||
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchesGovernance = !strictSourceMode || (isEntrySourceVerified(entry) && isEntryAudited(entry))
    return matchesCategory && matchesSearch && matchesGovernance
  })

  // Strip any lingering chat/dock padding from the library page
  useEffect(() => {
    const html = document.documentElement
    const hadChat = html.classList.contains('chat-open')
    const hadDock = html.classList.contains('dock-open')
    html.classList.remove('chat-open', 'dock-open')
    document.body.style.paddingRight = '0px'
    return () => {
      // Restore on leave if they were active
      if (hadChat) html.classList.add('chat-open')
      if (hadDock) html.classList.add('dock-open')
    }
  }, [])

  const atomCount = auditedLibrary.filter((e) => e.category === 'atoms').length
  const componentCount = auditedLibrary.filter((e) => e.category === 'components').length
  const blockCount = auditedLibrary.filter((e) => e.category === 'blocks').length
  const hiddenPendingAuditCount = LIBRARY.length - auditedLibrary.length

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ds-page-bg, #0a0a0a)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#0a0a0a]/80">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <IconArrowLeft className="w-5 h-5 text-white/60" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Our Library</h1>
              <p className="text-[11px] text-white/40">
                {auditedLibrary.length} audited live-source · {atomCount} atoms · {componentCount} components · {blockCount} blocks
              </p>
            </div>
          </div>

          {/* Search + governance */}
          <div className="flex items-center gap-2">
            <div className="h-9 px-3 rounded-lg border text-[11px] font-medium transition-colors border-cyan-500/40 bg-cyan-500/10 text-cyan-300 flex items-center">
              Audit-Locked: ON
            </div>
          <div className="relative w-72">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search components..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
            />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main content */}
        <div className="flex-1 min-w-0 px-6 py-8">
        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
                {cat.id !== 'all' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] ml-1">
                    {cat.id === 'atoms' ? atomCount : cat.id === 'components' ? componentCount : blockCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {strictSourceMode && (
          <div className="mb-5 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-[11px] text-cyan-200">
            Audit-Locked mode is active: {hiddenPendingAuditCount} entries are hidden until reviewed and source-matched.
          </div>
        )}

        {/* Results */}
        <LibraryErrorBoundary>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ComponentCard entry={entry} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-white/30 text-sm">No components match your search.</p>
            </div>
          )}
        </div>
        </LibraryErrorBoundary>
        </div>

        {/* Right sidebar — design system reference */}
        <RightSidebar />
      </div>
    </div>
  )
}
