'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { IconPalette, IconX, IconCheck, IconPencil, IconArrowLeft, IconUpload, IconBook2, IconMap2, IconBrandFigma, IconMovie } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { useRouter } from 'next/navigation'
import { PAGE_BRAND_LOGO } from '@/lib/page-brand-logos'

// ── Product definitions ───────────────────────────────────────────
export const ALL_PRODUCTS = [
  { key: 'sports', label: 'Sports' },
  { key: 'liveBetting', label: 'Live Betting' },
  { key: 'casino', label: 'Casino' },
  { key: 'liveCasino', label: 'Live Casino' },
  { key: 'poker', label: 'Poker' },
  { key: 'vipRewards', label: 'VIP Rewards' },
] as const

export type ProductKey = typeof ALL_PRODUCTS[number]['key']
export type ProductToggles = Record<ProductKey, boolean>

// ── Brand definitions ──────────────────────────────────────────────
export interface BrandTokens {
  id: string
  name: string
  primary: string
  primaryHover: string
  navBg: string
  pageBg: string
  sidebarBg: string
  cardBg: string
  accentGreen: string
  /** Force black text on primary-bg buttons (e.g. yellow brands) */
  primaryTextBlack?: boolean
  logo: React.ReactNode
  /** Path to logo SVG in /public for DOM-based logo swap */
  logoSrc?: string
  /** Path to lockup/collapsed logo SVG in /public */
  lockupSrc?: string
  lockup?: React.ReactNode
  /** Which products this brand offers */
  products: ProductToggles
}

const ALL_PRODUCTS_ON: ProductToggles = {
  sports: true,
  liveBetting: true,
  casino: true,
  liveCasino: true,
  poker: true,
  vipRewards: true,
}

export const BRANDS: BrandTokens[] = [
  {
    id: 'betonline',
    name: 'Brand A',
    primary: '#ee3536',
    primaryHover: '#dc2a2f',
    navBg: '#2D2E2C',
    pageBg: '#1a1a1a',
    sidebarBg: '#2d2d2d',
    cardBg: '#2d2d2d',
    accentGreen: '#8fd790',
    logo: PAGE_BRAND_LOGO,
    products: { ...ALL_PRODUCTS_ON },
  },
  {
    id: 'vip',
    name: 'VIP',
    primary: '#242020',
    primaryHover: '#1b1818',
    navBg: '#1b1919',
    pageBg: '#1a1a1a',
    sidebarBg: '#1b1919',
    cardBg: '#201d1d',
    accentGreen: '#8fd790',
    logo: PAGE_BRAND_LOGO,
    products: { ...ALL_PRODUCTS_ON },
  },
  {
    id: 'wildcasino',
    name: 'Brand B',
    primary: '#2faf16',
    primaryHover: '#23a109',
    navBg: '#0e160c',
    pageBg: '#051100',
    sidebarBg: '#121d0d',
    cardBg: '#0d150b',
    accentGreen: '#ffa800',
    logo: PAGE_BRAND_LOGO,
    products: {
      sports: false,
      liveBetting: false,
      casino: true,
      liveCasino: true,
      poker: false,
      vipRewards: true,
    },
  },
  {
    id: 'superslots',
    name: 'Brand C',
    primary: '#ffdf00',
    primaryHover: '#fecc00',
    navBg: '#51005c',
    pageBg: '#180039',
    sidebarBg: '#3c115a',
    cardBg: '#5f2166',
    accentGreen: '#539cff',
    primaryTextBlack: true,
    logo: PAGE_BRAND_LOGO,
    products: {
      sports: false,
      liveBetting: false,
      casino: true,
      liveCasino: true,
      poker: false,
      vipRewards: true,
    },
  },
  {
    id: 'sportsbetting',
    name: 'Brand D',
    primary: '#0096ff',
    primaryHover: '#0087f6',
    navBg: '#031679',
    pageBg: '#030d26',
    sidebarBg: '#031679',
    cardBg: '#020e4a',
    accentGreen: '#fdc100',
    logo: PAGE_BRAND_LOGO,
    products: {
      sports: true,
      liveBetting: true,
      casino: true,
      liveCasino: true,
      poker: true,
      vipRewards: true,
    },
  },
  {
    id: 'tigergaming',
    name: 'Brand E',
    primary: '#f8991d',
    primaryHover: '#f48e1b',
    navBg: '#2d2e2c',
    pageBg: '#212121',
    sidebarBg: '#2d2e2c',
    cardBg: '#2d2e2c',
    accentGreen: '#28dfb3',
    logo: PAGE_BRAND_LOGO,
    products: {
      sports: true,
      liveBetting: true,
      casino: true,
      liveCasino: true,
      poker: true,
      vipRewards: false,
    },
  },
]

// ── localStorage helpers ──────────────────────────────────────────
const LS_KEY = '__ds-brand-products'
const LS_BRAND_KEY = '__ds-active-brand'

function loadProductOverrides(): Record<string, ProductToggles> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveProductOverrides(data: Record<string, ProductToggles>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

function loadActiveBrandId(): string {
  if (typeof window === 'undefined') return 'betonline'
  try {
    return localStorage.getItem(LS_BRAND_KEY) || 'betonline'
  } catch { return 'betonline' }
}

function saveActiveBrandId(id: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_BRAND_KEY, id)
}

// ── Injected stylesheet builder ────────────────────────────────────
const STYLE_ID = '__ds-brand-override'

function buildOverrideCSS(b: BrandTokens): string {
  const isVipBrand = b.id === 'vip'
  // Use white-opacity layers for surfaces instead of solid greys
  // This makes cards/sidebars adapt naturally to any brand background
  const surface5 = isVipBrand ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.05)'     // subtle card/sidebar bg
  const surface8 = isVipBrand ? 'rgba(255, 255, 255, 0.065)' : 'rgba(255, 255, 255, 0.08)'    // slightly elevated surfaces
  const surface10 = isVipBrand ? 'rgba(255, 255, 255, 0.085)' : 'rgba(255, 255, 255, 0.10)'   // interactive/hover surfaces
  const surface15 = isVipBrand ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.15)'    // emphasized surfaces
  const surface3 = isVipBrand ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.03)'     // very subtle (chat, footer)
  const borderWhite8 = isVipBrand ? 'rgba(255, 255, 255, 0.022)' : 'rgba(255, 255, 255, 0.08)'
  const borderWhite12 = isVipBrand ? 'rgba(255, 255, 255, 0.035)' : 'rgba(255, 255, 255, 0.12)'
  // Only Super Slots needs black text on its yellow primary
  const primaryTextColor = b.primaryTextBlack ? '#000000' : '#ffffff'

  return `
/* ─── Design System Brand Override ─── */

/* NAV BG — solid brand color for the main header */
.bg-\\[\\#2D2E2C\\],
.dark\\:bg-\\[\\#2D2E2C\\]:is(.dark *),
.bg-\\[\\#2d2e2c\\],
.dark\\:bg-\\[\\#2d2e2c\\]:is(.dark *) {
  background-color: ${b.navBg} !important;
}

/* SIDEBAR / CARD BG — white opacity over page bg */
.bg-\\[\\#2d2d2d\\],
.\\!bg-\\[\\#2d2d2d\\],
.dark\\:bg-\\[\\#2d2d2d\\]:is(.dark *),
.dark\\:\\!bg-\\[\\#2d2d2d\\]:is(.dark *),
[class*="bg-[#2d2d2d]"] {
  background-color: ${surface5} !important;
}
[class*="\\[\\&\\>div\\]\\:\\!bg-\\[\\#2d2d2d\\]"] > div {
  background-color: ${surface5} !important;
}

/* PAGE BG — solid brand background */
.bg-\\[\\#1a1a1a\\],
.dark\\:bg-\\[\\#1a1a1a\\]:is(.dark *),
[class*="bg-[#1a1a1a]"] {
  background-color: ${b.pageBg} !important;
}
[data-page-bg],
.bg-\\[\\#1a1a1a\\].text-white {
  background-color: ${b.pageBg} !important;
}

/* PRIMARY COLOR: #ee3536  — exclude LIVE-tag pulse dots (animate-pulse) */
.bg-\\[\\#ee3536\\]:not(.animate-pulse),
.\\!bg-\\[\\#ee3536\\]:not(.animate-pulse) {
  background-color: ${b.primary} !important;
}
.hover\\:bg-\\[\\#d42e2f\\]:hover,
.hover\\:bg-\\[\\#ee3536\\]\\/90:hover {
  background-color: ${b.primaryHover} !important;
}
/* NOTE: .text-[#ee3536] and .border-[#ee3536] are intentionally NOT overridden —
   they are only used for LIVE tags and live-event times, which must always stay red. */

/* ── Text contrast: ONLY on elements with primary as BACKGROUND ── */
/* Tailwind bg class buttons */
button.bg-\\[\\#ee3536\\],
button.\\!bg-\\[\\#ee3536\\],
a.bg-\\[\\#ee3536\\],
a.\\!bg-\\[\\#ee3536\\] {
  color: ${primaryTextColor} !important;
}

/* Active sub-nav pill (the pill bg is a child div, text is a sibling span) */
[data-state="active"][data-tab-item] {
  color: ${primaryTextColor} !important;
}

/* Active tabs with data-active on the button itself */
button[data-active="true"] {
  color: ${primaryTextColor} !important;
}

/* CSS var primary — set text color variable */
:root, .dark {
  --ds-primary-text: ${primaryTextColor};
}

/* Surface colors — white opacity layers */
.dark\\:bg-white\\/5:is(.dark *):not(button):not(span):not(a) {
  background-color: ${surface5} !important;
}
.dark\\:bg-white\\/10:is(.dark *):not(button):not(span):not(a) {
  background-color: ${surface10} !important;
}
.bg-white\\/5 {
  background-color: ${surface5} !important;
}
.bg-white\\/10 {
  background-color: ${surface10} !important;
}

/* Sub-nav / filter bar override — brand bg with transparency */
.bg-\\[\\#1a1a1a\\]\\/90,
.dark\\:bg-\\[\\#1a1a1a\\]\\/90:is(.dark *) {
  background-color: ${b.pageBg}e6 !important;
}
.bg-\\[\\#2D2E2C\\]\\/90,
.bg-\\[\\#2d2d2d\\]\\/90 {
  background-color: ${b.navBg}e6 !important;
}

/* Carousel arrow backgrounds */
.bg-\\[\\#1a1a1a\\]\\/90 {
  background-color: ${b.pageBg}e6 !important;
}

/* Gradient overrides */
.from-\\[\\#1a1a1a\\] {
  --tw-gradient-from: ${b.pageBg} !important;
}
.to-\\[\\#1a1a1a\\] {
  --tw-gradient-to: ${b.pageBg} !important;
}

/* Chat panel bg — very subtle white layer */
.bg-\\[\\#222222\\] {
  background-color: ${surface3} !important;
}
[class*="bg-[#222222]"] {
  background-color: ${surface3} !important;
}

/* Border overrides — white opacity borders */
.border-\\[\\#222222\\] {
  border-color: ${borderWhite8} !important;
}
.border-\\[\\#2d2d2d\\],
.border-\\[\\#1a1a1a\\] {
  border-color: ${borderWhite8} !important;
}
.border-white\\/5 {
  border-color: ${surface8} !important;
}
.border-white\\/10 {
  border-color: ${borderWhite8} !important;
}
.border-white\\/20 {
  border-color: ${borderWhite12} !important;
}
.border-white\\/\\[0\\.06\\] {
  border-color: ${borderWhite8} !important;
}
.border-white\\/\\[0\\.08\\] {
  border-color: ${borderWhite8} !important;
}
.border-white\\/\\[0\\.12\\] {
  border-color: ${borderWhite12} !important;
}
.border-white\\/\\[0\\.15\\] {
  border-color: ${borderWhite12} !important;
}

/* Footer / bottom sections */
.bg-\\[\\#222\\],
.bg-\\[\\#252525\\],
.bg-\\[\\#333\\] {
  background-color: ${surface5} !important;
}

/* Tooltip / popover overrides */
.bg-\\[\\#2d2d2d\\] {
  background-color: ${surface8} !important;
}

/* Sidebar outer + inner wrappers — use brand sidebar token */
.group.peer > div.fixed,
.group.peer > div[style] {
  background-color: ${b.sidebarBg} !important;
}
[class*="--ds-sidebar-bg"] {
  background-color: ${b.sidebarBg} !important;
}
[class*="\\[\\&\\>div\\]\\:\\!bg-\\[var\\(--ds-sidebar-bg"] > div {
  background-color: ${b.sidebarBg} !important;
}

/* Mobile sidebar drawer override */
[data-sidebar="sidebar"] {
  background-color: ${b.sidebarBg} !important;
  backdrop-filter: none !important;
}
[data-sidebar="header"] {
  background-color: ${b.sidebarBg} !important;
}
[data-mobile="true"] {
  background-color: ${b.sidebarBg} !important;
}
[data-state="collapsed"][data-collapsible="icon"] [data-sidebar="header"] {
  background-color: ${b.sidebarBg} !important;
}

/* Sidebar outer wrappers */
.group\\/sidebar-wrapper {
  --sidebar-width-bg: ${b.sidebarBg};
}

/* Override shadcn CSS variables */
:root, .dark {
  --sidebar-background: ${hexToHSL(b.sidebarBg)} !important;
  --sidebar-accent: ${hexToHSL(b.pageBg)} !important;
  --ds-surface-5: ${surface5};
  --ds-surface-8: ${surface8};
  --ds-surface-10: ${surface10};
  --ds-surface-15: ${surface15};
}

.bg-sidebar {
  background-color: ${b.sidebarBg} !important;
}

/* Sub-nav backdrop-blur */
[class*="backdrop-blur"]:not([data-customizer]):not([data-customizer-fab]):not([data-customizer] *) {
  background-color: ${b.pageBg}cc !important;
}

/* Override inline style backgrounds for nav */
[style*="background-color: rgb(45, 46, 44)"],
[style*="background-color: #2D2E2C"],
[style*="background-color:#2D2E2C"],
[style*="background-color: #2d2e2c"],
[style*="background-color:#2d2e2c"] {
  background-color: ${b.navBg} !important;
}

/* Override inline style backgrounds for sidebar/cards */
[style*="background-color: rgb(45, 45, 45)"],
[style*="background-color: #2d2d2d"],
[style*="background-color:#2d2d2d"],
[style*="background-color: rgba(45, 45, 45"],
[style*="background-color:rgba(45, 45, 45"] {
  background-color: ${b.sidebarBg} !important;
}

/* Override inline style backgrounds for page bg */
[style*="background-color: rgb(26, 26, 26)"],
[style*="background-color: #1a1a1a"],
[style*="background-color:#1a1a1a"] {
  background-color: ${b.pageBg} !important;
}

/* Protect customizer UI from overrides */
[data-customizer-fab],
[data-customizer-fab] * {
  /* do not override */
}
${isVipBrand ? `
/* VIP logo treatment — solid off-black with subtle luxury pulse */
[data-custom-brand-logo],
[data-custom-brand-lockup] {
  /* black source logo -> invert to light, then dim to premium off-black/charcoal */
  filter: invert(1) brightness(0.34) saturate(55%) contrast(1.08) !important;
  opacity: 0.9 !important;
  mix-blend-mode: normal !important;
  animation: vipLogoSheen 6s cubic-bezier(0.4, 0, 0.2, 1) infinite !important;
  will-change: filter, opacity, transform !important;
  transform-origin: center center !important;
}
[data-custom-brand-lockup] {
  /* Collapsed rail lockup needs to read stronger */
  transform: scale(1.28) !important;
}
[data-custom-brand-logo-glare],
[data-custom-brand-lockup-glare] {
  position: absolute !important;
  inset: -25% -40% !important;
  pointer-events: none !important;
  background: linear-gradient(
    115deg,
    rgba(255, 255, 255, 0) 35%,
    rgba(228, 214, 160, 0.18) 48%,
    rgba(255, 255, 255, 0) 62%
  ) !important;
  transform: translateX(-160%) skewX(-18deg) !important;
  mix-blend-mode: screen !important;
  animation: vipLogoSwish 4.8s ease-in-out infinite !important;
}

@keyframes vipLogoSheen {
  0%, 100% {
    opacity: 0.86;
    filter: invert(1) brightness(0.3) saturate(50%) contrast(1.05) drop-shadow(0 0 0 rgba(214, 196, 140, 0));
    transform: translateX(0) scale(1);
  }
  18% {
    opacity: 0.9;
    filter: invert(1) brightness(0.38) saturate(62%) contrast(1.1) drop-shadow(0 0 2px rgba(214, 196, 140, 0.14));
    transform: translateX(0.2px) scale(1.002);
  }
  30% {
    opacity: 0.96;
    filter: invert(1) brightness(0.56) saturate(82%) contrast(1.16) drop-shadow(0 0 9px rgba(214, 196, 140, 0.28));
    transform: translateX(0.9px) scale(1.008);
  }
  40% {
    opacity: 0.99;
    filter: invert(1) brightness(0.7) saturate(110%) contrast(1.22) drop-shadow(0 0 14px rgba(214, 196, 140, 0.36));
    transform: translateX(1.2px) scale(1.01);
  }
  52% {
    opacity: 0.92;
    filter: invert(1) brightness(0.46) saturate(70%) contrast(1.12) drop-shadow(0 0 5px rgba(214, 196, 140, 0.18));
    transform: translateX(0.4px) scale(1.004);
  }
  68% {
    opacity: 0.88;
    filter: invert(1) brightness(0.35) saturate(56%) contrast(1.07) drop-shadow(0 0 0 rgba(214, 196, 140, 0));
    transform: translateX(0) scale(1);
  }
}
@keyframes vipLogoSwish {
  0%, 58%, 100% {
    transform: translateX(-160%) skewX(-18deg);
    opacity: 0;
  }
  64% {
    opacity: 0.35;
  }
  78% {
    transform: translateX(170%) skewX(-18deg);
    opacity: 0.7;
  }
  86% {
    opacity: 0;
  }
}

/* VIP divider softening — enforce low-contrast separators globally */
.border-r.border-white\\/10,
.border-l.border-white\\/10,
.border-t.border-white\\/10,
.border-b.border-white\\/10,
[class*="border-r"][class*="border-white\\/10"],
[class*="border-l"][class*="border-white\\/10"],
[class*="border-t"][class*="border-white\\/10"],
[class*="border-b"][class*="border-white\\/10"] {
  border-color: rgba(255, 255, 255, 0.014) !important;
}

/* Critical: force the actual sidebar split line to be soft on all layouts */
[data-sidebar="sidebar"],
.group\\/sidebar-wrapper [data-sidebar="sidebar"],
.group\\/sidebar-wrapper > div,
.group.peer > div.fixed {
  border-right-color: rgba(255, 255, 255, 0.014) !important;
}

/* VIP overlays/popovers/drawers — keep them solid so they don't blend into content */
[data-radix-popper-content-wrapper] [class*="bg-[#2d2d2d]"],
[data-radix-popper-content-wrapper] [class*="bg-[#1a1a1a]"],
[data-radix-popper-content-wrapper] .bg-popover,
[data-radix-popper-content-wrapper] [role="menu"],
[data-vaul-drawer] [class*="bg-[#2d2d2d]"],
[data-vaul-drawer] [class*="bg-[#1a1a1a]"],
[role="dialog"][class*="bg-[#2d2d2d]"],
[role="dialog"][class*="bg-[#1a1a1a]"] {
  background-color: rgba(24, 22, 22, 0.96) !important;
  backdrop-filter: blur(12px) !important;
}
` : ''}
`
}

/** Convert hex to HSL string for CSS variables (shadcn format: "H S% L%") */
function hexToHSL(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16) / 255
  const g = parseInt(h.substring(2, 4), 16) / 255
  const b = parseInt(h.substring(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let hue = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: hue = ((b - r) / d + 2) / 6; break
      case b: hue = ((r - g) / d + 4) / 6; break
    }
  }
  return `${Math.round(hue * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/** Return true if a hex colour is "light" (needs dark text for contrast) */
function isLightColor(hex: string): boolean {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16) / 255
  const g = parseInt(h.substring(2, 4), 16) / 255
  const b = parseInt(h.substring(4, 6), 16) / 255
  // Relative luminance (WCAG)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum > 0.4
}

/** Lighten or darken a hex colour by a ratio (-1 to 1) */
function lighten(hex: string, ratio: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)

  const adjust = (c: number) => {
    if (ratio > 0) return Math.min(255, Math.round(c + (255 - c) * ratio))
    return Math.max(0, Math.round(c * (1 + ratio)))
  }

  const rr = adjust(r).toString(16).padStart(2, '0')
  const gg = adjust(g).toString(16).padStart(2, '0')
  const bb = adjust(b).toString(16).padStart(2, '0')
  return `#${rr}${gg}${bb}`
}

function injectOverrideStyles(brand: BrandTokens) {
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = STYLE_ID
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = buildOverrideCSS(brand)
}

function removeOverrideStyles() {
  const el = document.getElementById(STYLE_ID)
  if (el) el.remove()
}

/** Logo swap disabled — all brands use neutral placeholder boxes in the UI. */
function swapLogos(_logoSrc?: string, _lockupSrc?: string, _addVipEffect = false) {
  document.querySelectorAll('[data-custom-brand-logo]').forEach(el => el.remove())
  document.querySelectorAll('[data-custom-brand-lockup]').forEach(el => el.remove())
  document.querySelectorAll('[data-custom-brand-logo-glare]').forEach(el => el.remove())
  document.querySelectorAll('[data-custom-brand-lockup-glare]').forEach(el => el.remove())
  document.querySelectorAll('[data-original-logo-hidden]').forEach(el => {
    ;(el as HTMLElement).style.display = ''
    el.removeAttribute('data-original-logo-hidden')
  })
  document.querySelectorAll('[data-original-lockup-hidden]').forEach(el => {
    ;(el as HTMLElement).style.display = ''
    el.removeAttribute('data-original-lockup-hidden')
  })
}

/** Hide/show nav items based on product toggles */
function applyProductVisibility(products: ProductToggles) {
  // Dispatch a custom event that pages can listen to
  window.dispatchEvent(new CustomEvent('brand:products-changed', { detail: products }))
}

// ── Component ──────────────────────────────────────────────────────

interface DesignCustomizerProps {
  onBrandChange?: (brand: BrandTokens) => void
  currentBrandId?: string
}

export function DesignCustomizer({ onBrandChange, currentBrandId = 'betonline' }: DesignCustomizerProps) {
  const isMobile = useIsMobile()
  const router = useRouter()
  const pathname = usePathname()
  const isMaintenancePage = pathname === '/live-betting'
  const isLibraryPage = pathname?.startsWith('/library')
  const isPokerApp = pathname?.startsWith('/poker-app')
  const isIsolatedSurface = isLibraryPage || isPokerApp
  const [isOpen, setIsOpen] = useState(false)
  const [activeBrandId, setActiveBrandId] = useState(currentBrandId)
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null)
  const [productOverrides, setProductOverrides] = useState<Record<string, ProductToggles>>({})
  const [figmaCopied, setFigmaCopied] = useState(false)
  const hasRestoredRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Copy a ready-to-paste Cursor agent prompt that exports the page the user
  // is currently viewing into the configured Figma file. The Figma MCP tools
  // run in the agent's context, not the browser, so the button hands off
  // intent rather than making the API call itself.
  const FIGMA_FILE_KEY = 'boqNQ8t96bxwiuggNNj62b'
  const FIGMA_NODE_ID = '0:1'
  const handleExportToFigma = useCallback(async () => {
    if (typeof window === 'undefined') return
    const path = pathname || '/'
    const targetUrl = `${window.location.origin}${path}`
    const prompt = `Export ${targetUrl} into Figma file ${FIGMA_FILE_KEY} (node ${FIGMA_NODE_ID}). Use design-system components from the file's library where they match shadcn components in the codebase, and fall back to layered shapes/text only when no DS component matches.`
    try {
      await navigator.clipboard.writeText(prompt)
      setFigmaCopied(true)
      window.setTimeout(() => setFigmaCopied(false), 2200)
    } catch {
      // Clipboard API blocked — fall back to a temporary textarea so the
      // prompt still ends up on the user's clipboard on older browsers.
      const ta = document.createElement('textarea')
      ta.value = prompt
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
      setFigmaCopied(true)
      window.setTimeout(() => setFigmaCopied(false), 2200)
    }
  }, [pathname])

  // Load saved product overrides and active brand from localStorage on mount
  useEffect(() => {
    setProductOverrides(loadProductOverrides())

    // Restore persisted brand selection on page load/navigation
    const savedBrandId = loadActiveBrandId()
    if (savedBrandId && savedBrandId !== 'betonline' && !hasRestoredRef.current) {
      hasRestoredRef.current = true
      const brand = BRANDS.find(b => b.id === savedBrandId)
      if (brand) {
        setActiveBrandId(brand.id)
        // Apply the brand after a tick to ensure DOM is ready
        requestAnimationFrame(() => {
          injectOverrideStyles(brand)
          swapLogos(brand.logoSrc, brand.lockupSrc, brand.id === 'vip')

          const root = document.documentElement
          root.style.setProperty('--ds-primary', brand.primary)
          root.style.setProperty('--ds-primary-hover', brand.primaryHover)
          root.style.setProperty('--ds-nav-bg', brand.navBg)
          root.style.setProperty('--ds-page-bg', brand.pageBg)
          root.style.setProperty('--ds-sidebar-bg', brand.sidebarBg)
          root.style.setProperty('--ds-card-bg', brand.cardBg)
          root.style.setProperty('--ds-accent-green', brand.accentGreen)
          root.style.setProperty('--sidebar-background', hexToHSL(brand.sidebarBg))
          // Legacy variable names used by pages
          root.style.setProperty('--brand-primary', brand.primary)
          root.style.setProperty('--brand-primary-hover', brand.primaryHover)
          // Text contrast for light primary colors
          root.style.setProperty('--ds-primary-text', brand.primaryTextBlack ? '#000000' : '#ffffff')

          // Direct DOM overrides for inline-styled elements
          document.querySelectorAll('[data-nav-header]').forEach(el => {
            (el as HTMLElement).style.backgroundColor = brand.navBg
          })
          document.querySelectorAll('[data-page-bg]').forEach(el => {
            (el as HTMLElement).style.backgroundColor = brand.pageBg
          })
          document.querySelectorAll('[data-sidebar="sidebar"]').forEach(el => {
            (el as HTMLElement).style.backgroundColor = brand.sidebarBg
          })
          document.querySelectorAll('[data-sidebar="header"]').forEach(el => {
            (el as HTMLElement).style.backgroundColor = brand.sidebarBg
          })
          document.querySelectorAll('[data-mobile="true"]').forEach(el => {
            (el as HTMLElement).style.backgroundColor = brand.sidebarBg
          })
          document.querySelectorAll('.group.peer > div').forEach(el => {
            const htmlEl = el as HTMLElement
            if (htmlEl.style.backgroundColor || htmlEl.classList.contains('fixed')) {
              htmlEl.style.backgroundColor = ''  // let CSS injection handle it
            }
          })

          // Walk all elements with inline bg set to known old values
          const newColors: Record<string, string> = {
            'rgb(45, 46, 44)': brand.navBg,
            'rgb(45, 45, 45)': '',       // clear — CSS injection uses white opacity
            'rgb(26, 26, 26)': brand.pageBg,
            'rgb(238, 53, 54)': brand.primary,
            'rgb(34, 34, 34)': '',       // clear — CSS injection uses white opacity
          }
          document.querySelectorAll('[style]').forEach(el => {
            const htmlEl = el as HTMLElement
            if (htmlEl.closest('[data-customizer]') || htmlEl.closest('[data-customizer-fab]')) return
            const bg = htmlEl.style.backgroundColor
            if (bg && bg in newColors) {
              const newVal = newColors[bg]
              if (newVal) {
                htmlEl.style.backgroundColor = newVal
              } else {
                htmlEl.style.backgroundColor = ''  // clear so CSS injection takes over
              }
            }
          })

          // Apply product visibility
          const overrides = loadProductOverrides()
          const products = overrides[brand.id] ?? brand.products
          applyProductVisibility(products)

          onBrandChange?.(brand)
        })
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Clean up override styles on unmount
  useEffect(() => {
    return () => {
      removeOverrideStyles()
      swapLogos(undefined)
    }
  }, [])

  // MutationObserver: auto-swap any new Brand A SVGs that appear after navigation
  useEffect(() => {
    const brand = BRANDS.find(b => b.id === activeBrandId)
    if (!brand || activeBrandId === 'betonline' || !brand.logoSrc) return

    const logoSrc = brand.logoSrc
    const lockupSrc = brand.lockupSrc

    const swapSvg = (svg: Element, src: string, dataAttrHidden: string, dataAttrCustom: string, alt: string) => {
      const parent = svg.parentElement
      if (!parent) return
      parent.style.position = parent.style.position || 'relative'
      parent.style.overflow = 'hidden'
      ;(svg as HTMLElement).style.display = 'none'
      svg.setAttribute(dataAttrHidden, 'true')
      const img = document.createElement('img')
      img.src = src
      img.alt = alt
      img.style.height = '100%'
      img.style.width = '100%'
      img.style.objectFit = 'contain'
      img.style.objectPosition = 'center'
      img.setAttribute(dataAttrCustom, 'true')
      parent.appendChild(img)
      if (brand.id === 'vip') {
        const glare = document.createElement('span')
        glare.setAttribute(
          dataAttrCustom === 'data-custom-brand-lockup'
            ? 'data-custom-brand-lockup-glare'
            : 'data-custom-brand-logo-glare',
          'true'
        )
        parent.appendChild(glare)
      }
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue

          // Swap full logos (viewBox="0 0 640 86")
          const fullLogos = node.matches?.('svg[viewBox="0 0 640 86"]')
            ? [node]
            : Array.from(node.querySelectorAll?.('svg[viewBox="0 0 640 86"]') ?? [])
          for (const svg of fullLogos) {
            if (svg.hasAttribute('data-original-logo-hidden')) continue
            swapSvg(svg, logoSrc, 'data-original-logo-hidden', 'data-custom-brand-logo', 'Brand Logo')
          }

          // Swap lockup logos (viewBox="0 0 114 86")
          if (lockupSrc) {
            const lockups = node.matches?.('svg[viewBox="0 0 114 86"]')
              ? [node]
              : Array.from(node.querySelectorAll?.('svg[viewBox="0 0 114 86"]') ?? [])
            for (const svg of lockups) {
              if (svg.hasAttribute('data-original-lockup-hidden')) continue
              swapSvg(svg, lockupSrc, 'data-original-lockup-hidden', 'data-custom-brand-lockup', 'Brand Lockup')
            }
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Also do an immediate sweep in case the DOM already has un-swapped logos
    requestAnimationFrame(() => swapLogos(logoSrc, lockupSrc, brand.id === 'vip'))

    return () => observer.disconnect()
  }, [activeBrandId])

  /** Get the effective product toggles for a brand (localStorage override > default) */
  const getProducts = useCallback((brandId: string): ProductToggles => {
    const brand = BRANDS.find(b => b.id === brandId)
    const defaults = brand?.products ?? ALL_PRODUCTS_ON
    return productOverrides[brandId] ?? defaults
  }, [productOverrides])

  const activeBrand = BRANDS.find(b => b.id === activeBrandId) || BRANDS[0]
  const editingBrand = editingBrandId ? BRANDS.find(b => b.id === editingBrandId) : null

  const selectBrand = useCallback((brand: BrandTokens) => {
    setActiveBrandId(brand.id)
    saveActiveBrandId(brand.id)
    onBrandChange?.(brand)

    if (brand.id === 'betonline') {
      removeOverrideStyles()
      swapLogos(undefined)
      // Reset all direct DOM overrides
      document.querySelectorAll('[data-nav-header]').forEach(el => {
        (el as HTMLElement).style.backgroundColor = ''
      })
      document.querySelectorAll('[data-page-bg]').forEach(el => {
        (el as HTMLElement).style.backgroundColor = ''
      })
      document.querySelectorAll('[data-sidebar="sidebar"]').forEach(el => {
        (el as HTMLElement).style.backgroundColor = ''
      })
      document.querySelectorAll('[data-mobile="true"]').forEach(el => {
        (el as HTMLElement).style.backgroundColor = ''
      })
      // Reset CSS variables
      const root = document.documentElement
      root.style.removeProperty('--ds-primary')
      root.style.removeProperty('--ds-primary-hover')
      root.style.removeProperty('--ds-nav-bg')
      root.style.removeProperty('--ds-page-bg')
      root.style.removeProperty('--ds-sidebar-bg')
      root.style.removeProperty('--ds-card-bg')
      root.style.removeProperty('--ds-accent-green')
      root.style.removeProperty('--sidebar-background')
      root.style.removeProperty('--brand-primary')
      root.style.removeProperty('--brand-primary-hover')
      root.style.removeProperty('--ds-primary-text')
    } else {
      injectOverrideStyles(brand)
      swapLogos(brand.logoSrc, brand.lockupSrc, brand.id === 'vip')
    }

    // Set CSS variables on :root (both --ds-* and legacy --brand-* for compatibility)
    const root = document.documentElement
    root.style.setProperty('--ds-primary', brand.primary)
    root.style.setProperty('--ds-primary-hover', brand.primaryHover)
    root.style.setProperty('--ds-nav-bg', brand.navBg)
    root.style.setProperty('--ds-page-bg', brand.pageBg)
    root.style.setProperty('--ds-sidebar-bg', brand.sidebarBg)
    root.style.setProperty('--ds-card-bg', brand.cardBg)
    root.style.setProperty('--ds-accent-green', brand.accentGreen)
    root.style.setProperty('--sidebar-background', hexToHSL(brand.sidebarBg))
    // Legacy variable names used by pages
    root.style.setProperty('--brand-primary', brand.primary)
    root.style.setProperty('--brand-primary-hover', brand.primaryHover)
    // Text contrast for light primary colors
    root.style.setProperty('--ds-primary-text', brand.primaryTextBlack ? '#000000' : '#ffffff')

    // Direct DOM overrides for inline-styled elements
    document.querySelectorAll('[data-nav-header]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = brand.navBg
    })
    document.querySelectorAll('[data-page-bg]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = brand.pageBg
    })
    document.querySelectorAll('[data-sidebar="sidebar"]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = brand.sidebarBg
    })
    document.querySelectorAll('[data-sidebar="header"]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = brand.sidebarBg
    })
    document.querySelectorAll('[data-mobile="true"]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = brand.sidebarBg
    })
    document.querySelectorAll('.group.peer > div').forEach(el => {
      const htmlEl = el as HTMLElement
      if (htmlEl.style.backgroundColor || htmlEl.classList.contains('fixed')) {
        htmlEl.style.backgroundColor = ''  // let CSS injection handle it
      }
    })

    // Walk all elements with inline bg set to known old values
    const newColors: Record<string, string> = {
      'rgb(45, 46, 44)': brand.navBg,       // #2D2E2C — main nav
      'rgb(45, 45, 45)': '',                // #2d2d2d — clear, CSS injection uses white opacity
      'rgb(26, 26, 26)': brand.pageBg,      // #1a1a1a — page bg
      'rgb(238, 53, 54)': brand.primary,     // #ee3536 — primary
      'rgb(34, 34, 34)': '',                // #222222 — clear, CSS injection uses white opacity
    }
    document.querySelectorAll('[style]').forEach(el => {
      const htmlEl = el as HTMLElement
      if (htmlEl.closest('[data-customizer]') || htmlEl.closest('[data-customizer-fab]')) return
      const bg = htmlEl.style.backgroundColor
      if (bg && bg in newColors) {
        const newVal = newColors[bg]
        if (newVal) {
          htmlEl.style.backgroundColor = newVal
        } else {
          htmlEl.style.backgroundColor = ''  // clear so CSS injection takes over
        }
      }
    })

    // Sidebar uses brand pageBg directly (cards inside use white-opacity from CSS injection)
    document.querySelectorAll('[data-mobile="true"]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = brand.pageBg
    })
    document.querySelectorAll('[data-sidebar="sidebar"]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = brand.pageBg
    })

    // Apply product visibility
    const products = productOverrides[brand.id] ?? brand.products
    applyProductVisibility(products)
  }, [onBrandChange, productOverrides])

  const toggleProduct = useCallback((brandId: string, productKey: ProductKey) => {
    setProductOverrides(prev => {
      const brand = BRANDS.find(b => b.id === brandId)
      const current = prev[brandId] ?? brand?.products ?? ALL_PRODUCTS_ON
      const updated = { ...current, [productKey]: !current[productKey] }
      const next = { ...prev, [brandId]: updated }
      saveProductOverrides(next)

      // If this is the active brand, apply immediately
      if (brandId === activeBrandId) {
        applyProductVisibility(updated)
      }

      return next
    })
  }, [activeBrandId])

  // ── JSON brand import handler ──
  const handleJsonImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string)
        // Expect an object with BrandTokens-shaped color fields
        const root = document.documentElement
        if (json.primary) root.style.setProperty('--ds-primary', json.primary)
        if (json.primaryHover) root.style.setProperty('--ds-primary-hover', json.primaryHover)
        if (json.navBg) root.style.setProperty('--ds-nav-bg', json.navBg)
        if (json.pageBg) root.style.setProperty('--ds-page-bg', json.pageBg)
        if (json.sidebarBg) root.style.setProperty('--ds-sidebar-bg', json.sidebarBg)
        if (json.cardBg) root.style.setProperty('--ds-card-bg', json.cardBg)
        if (json.accentGreen) root.style.setProperty('--ds-accent-green', json.accentGreen)
        if (json.primaryTextBlack !== undefined) {
          root.style.setProperty('--ds-primary-text', json.primaryTextBlack ? '#000000' : '#ffffff')
        }
        // Store in localStorage so it persists
        localStorage.setItem('__brand_json_override', JSON.stringify(json))
      } catch {
        console.error('Invalid JSON brand file')
      }
    }
    reader.readAsText(file)
    // Reset so the same file can be re-uploaded
    e.target.value = ''
  }, [])

  // Don't render on mobile
  if (isMobile || isMaintenancePage || isIsolatedSurface) return null

  return (
    <>
      {/* ── FAB Bubble ─────────────────────────── */}
      <motion.button
        onClick={() => { setIsOpen(!isOpen); setEditingBrandId(null) }}
        className={cn(
          "fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-full shadow-lg cursor-pointer transition-colors duration-200",
          isOpen
            ? "bg-white/10 backdrop-blur-xl border border-white/20 px-4 h-10"
            : "bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 w-11 h-11 justify-center"
        )}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={isOpen ? {} : undefined}
        data-customizer-fab
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }} className="flex items-center gap-2">
              <IconX className="w-4 h-4 text-white/60" />
              <span className="text-[11px] text-white/60 font-medium">Close</span>
            </motion.div>
          ) : (
            <motion.div key="palette" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}>
              <IconPalette className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Popover ────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-customizer
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed bottom-[72px] right-6 z-[200] w-[300px] rounded-xl border shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#1c1c1e', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <AnimatePresence mode="wait">
              {editingBrand ? (
                /* ── Edit Products View ─────────── */
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Edit header */}
                  <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                      onClick={() => setEditingBrandId(null)}
                      className="p-1 rounded-md hover:bg-white/10 transition-colors"
                    >
                      <IconArrowLeft className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
                    </button>
                    <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: editingBrand.primary }} />
                    <span className="text-xs font-semibold" style={{ color: '#fff' }}>{editingBrand.name}</span>
                    <span className="text-[10px] ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>Products</span>
                  </div>

                  {/* Product toggles */}
                  <div className="px-3 py-2.5 space-y-1">
                    {ALL_PRODUCTS.map((product) => {
                      const products = getProducts(editingBrand.id)
                      const isOn = products[product.key]
                      return (
                        <button
                          key={product.key}
                          onClick={() => toggleProduct(editingBrand.id, product.key)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150"
                          style={{
                            backgroundColor: isOn ? 'rgba(255,255,255,0.05)' : 'transparent',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isOn ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isOn ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                        >
                          <span className="text-xs" style={{ color: isOn ? '#fff' : 'rgba(255,255,255,0.35)' }}>
                            {product.label}
                          </span>

                          {/* Toggle switch */}
                          <div
                            className="relative w-8 h-[18px] rounded-full transition-colors duration-200"
                            style={{
                              backgroundColor: isOn ? editingBrand.primary : 'rgba(255,255,255,0.12)',
                            }}
                          >
                            <div
                              className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all duration-200"
                              style={{
                                left: isOn ? '15px' : '2px',
                              }}
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      Saved to localStorage
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* ── Brand List View ──────────── */
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Header */}
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Brand Switcher</p>
                  </div>

                  {/* Current brand display */}
                  <div className="px-4 pt-3 pb-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: activeBrand.primary, border: '2px solid rgba(255,255,255,0.2)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#fff' }}>{activeBrand.name}</p>
                        <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{activeBrand.primary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Brand list */}
                  <div className="px-3 pb-3">
                    <div className="space-y-1">
                      {BRANDS.map((brand) => {
                        const isActive = brand.id === activeBrandId
                        const products = getProducts(brand.id)
                        const enabledCount = Object.values(products).filter(Boolean).length
                        return (
                          <div
                            key={brand.id}
                            className="flex items-center gap-1"
                          >
                            {/* Brand select button */}
                            <button
                              onClick={() => selectBrand(brand)}
                              className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150"
                              style={{
                                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                              }}
                              onMouseEnter={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.backgroundColor = 'transparent'
                                  e.currentTarget.style.borderColor = 'transparent'
                                }
                              }}
                            >
                              {/* Colour dot cluster */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: brand.primary }} />
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brand.navBg, opacity: 0.6 }} />
                              </div>

                              {/* Name + product count */}
                              <div className="flex-1 min-w-0">
                                <span className="text-xs block truncate" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: isActive ? 500 : 400 }}>
                                  {brand.name}
                                </span>
                                <span className="text-[9px] block" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                  {enabledCount}/{ALL_PRODUCTS.length} products
                                </span>
                              </div>

                              {/* Active check */}
                              {isActive && (
                                <IconCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }} />
                              )}
                            </button>

                            {/* Edit button */}
                            <button
                              onClick={() => setEditingBrandId(brand.id)}
                              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                              title={`Edit ${brand.name} products`}
                            >
                              <IconPencil className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.3)' }} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* JSON Upload + Our Library */}
                  <div className="px-3 pb-2 pt-1 space-y-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Upload JSON brand */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={handleJsonImport}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150 hover:bg-white/5 border border-transparent hover:border-white/10"
                    >
                      <IconUpload className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                      <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Import Brand JSON
                      </span>
                    </button>

                    {/* Journey Map CTA */}
                    <button
                      onClick={() => { setIsOpen(false); router.push('/journey-map') }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150 hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20"
                    >
                      <IconMap2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />
                      <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Journey Map
                      </span>
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-white/10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        NEW
                      </span>
                    </button>

                    {/* Our Library CTA */}
                    <button
                      onClick={() => { setIsOpen(false); router.push('/library') }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150 hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20"
                    >
                      <IconBook2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />
                      <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Our Library
                      </span>
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-white/10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        NEW
                      </span>
                    </button>

                    {/* Animation extract — right-click any component */}
                    <button
                      onClick={() => {
                        const api = (window as unknown as {
                          __bolAnimationInspector?: { setEnabled: (v: boolean) => void }
                        }).__bolAnimationInspector
                        const currentlyOn = window.localStorage.getItem('bol:animation-inspector') !== '0'
                        api?.setEnabled(!currentlyOn)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150 hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20"
                    >
                      <IconMovie className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />
                      <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Animation extract
                      </span>
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-white/10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        ⌥+click
                      </span>
                    </button>

                    {/* Export current page to Figma — copies a ready-to-paste
                        prompt for the Cursor agent (the Figma MCP runs in the
                        agent context, not the browser). */}
                    <button
                      onClick={handleExportToFigma}
                      aria-label="Export current page to Figma"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150 hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20"
                    >
                      {figmaCopied ? (
                        <IconCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8fd790' }} />
                      ) : (
                        <IconBrandFigma className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />
                      )}
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: figmaCopied ? '#8fd790' : 'rgba(255,255,255,0.6)' }}
                      >
                        {figmaCopied ? 'Prompt copied — paste in Cursor' : 'Export to Figma'}
                      </span>
                      {!figmaCopied && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-white/10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          NEW
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>Local preview only</span>
                    <div className="flex items-center gap-1">
                      {[activeBrand.primary, activeBrand.navBg, activeBrand.pageBg, activeBrand.sidebarBg].map((c, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
