'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { promoPathForSection, promoSlugToSection } from '@/lib/promotions-routes'

/** Minimal shape from `useRouter()` — only what deep-link handlers need. */
type CasinoRouterLike = {
  replace: (href: string, options?: { scroll?: boolean }) => void
}

type PromotionsPathEffectsProps = {
  setShowPoker: (v: boolean) => void
  setShowSports: (v: boolean) => void
  setShowVipRewards: (v: boolean) => void
  setVipDrawerOpen: (v: boolean) => void
  setInitialVipSidebarItem: (v: string | null) => void
  setVipActiveSidebarItem: (v: string) => void
}

/**
 * Opens Promotions when the real route is `/promotions` (no Suspense — runs before paint).
 * Keep this outside the search-params Suspense boundary.
 */
export function CasinoPromotionsPathEffects({
  setShowPoker,
  setShowSports,
  setShowVipRewards,
  setVipDrawerOpen,
  setInitialVipSidebarItem,
  setVipActiveSidebarItem,
}: PromotionsPathEffectsProps) {
  const pathname = usePathname()
  const appliedPathRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    if (pathname !== '/promotions' && !pathname.startsWith('/promotions/')) {
      appliedPathRef.current = null
      return
    }
    // Only apply on route entry / section change — don't re-force after in-place Casino leave
    if (appliedPathRef.current === pathname) return
    appliedPathRef.current = pathname

    setShowPoker(false)
    setShowSports(false)
    setShowVipRewards(true)
    setVipDrawerOpen(false)

    const slug = pathname.split('/')[2]
    if (slug) {
      const section = promoSlugToSection(slug)
      if (section) {
        setInitialVipSidebarItem(section)
        setVipActiveSidebarItem(section)
      }
    } else {
      setVipActiveSidebarItem('Promos')
    }
    window.scrollTo(0, 0)
  }, [
    pathname,
    setInitialVipSidebarItem,
    setShowPoker,
    setShowSports,
    setShowVipRewards,
    setVipActiveSidebarItem,
    setVipDrawerOpen,
  ])

  return null
}

export type CasinoSearchParamsEffectsProps = {
  router: CasinoRouterLike
  openVipDrawer: () => void
  setVipDrawerOpen: (v: boolean) => void
  setShowPoker: (v: boolean) => void
  setShowSports: (v: boolean) => void
  setShowVipRewards: (v: boolean) => void
  setShowAllGames: (v: boolean) => void
  setSelectedCategory: (v: string) => void
  setSelectedVendor: (v: string) => void
  setActiveSubNav: (val: string) => void
  setInitialVipSidebarItem: (v: string | null) => void
  setVipActiveSidebarItem: (v: string) => void
  setHubFocusMode: (v: boolean) => void
  setPromosActiveTab?: (v: string) => void
}

/**
 * Reads `useSearchParams()` in isolation (wrapped in nested `<Suspense>` on the casino page)
 * so the rest of `/casino` can render immediately. Parent-level Suspense + top-level
 * `useSearchParams()` can otherwise keep the entire page stuck on its fallback (“Loading…”).
 */
export function CasinoSearchParamsEffects({
  router,
  openVipDrawer,
  setVipDrawerOpen,
  setShowPoker,
  setShowSports,
  setShowVipRewards,
  setShowAllGames,
  setSelectedCategory,
  setSelectedVendor,
  setActiveSubNav,
  setInitialVipSidebarItem,
  setVipActiveSidebarItem,
  setHubFocusMode,
  setPromosActiveTab,
}: CasinoSearchParamsEffectsProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('hubFocus') === 'true') {
      setHubFocusMode(true)
    }

    const vipRewardsPageParam = searchParams.get('vipRewardsPage')
    if (vipRewardsPageParam === 'true') {
      setShowPoker(false)
      setShowSports(false)
      setShowVipRewards(true)
      const promoSectionParam = searchParams.get('section')
      const promoTabParam = searchParams.get('promoTab')
      // Cash Races removed from Promotions — open VIP Hub Daily Races instead
      if (promoSectionParam === 'Cash Races') {
        setShowPoker(false)
        setShowSports(false)
        setShowVipRewards(false)
        window.scrollTo(0, 0)
        router.replace('/casino', { scroll: false })
        requestAnimationFrame(() => {
          window.dispatchEvent(
            new CustomEvent('vip:open-drawer', { detail: { tab: 'Daily Races' } })
          )
        })
        return
      }
      if (promoSectionParam) {
        setInitialVipSidebarItem(promoSectionParam)
      }
      if (
        promoTabParam &&
        ['Deposit Bonus', 'Sports', 'Casino', 'Poker'].includes(promoTabParam)
      ) {
        setPromosActiveTab?.(promoTabParam)
      }
      window.scrollTo(0, 0)

      const openHub = searchParams.get('vip') === 'true'
      if (!openHub) {
        setVipDrawerOpen(false)
      }

      // Soft-clean the query into a promotions path — no `/casino?…` flash, no remount.
      const nextPath = promoPathForSection(promoSectionParam || 'Promos')
      if (`${window.location.pathname}${window.location.search}` !== nextPath) {
        window.history.replaceState(null, '', nextPath)
      }

      if (openHub) {
        const hubSection = searchParams.get('hubSection') ?? 'Overview'
        requestAnimationFrame(() => {
          openVipDrawer()
          setVipActiveSidebarItem(hubSection)
        })
      }
    } else {
      const vipParam = searchParams.get('vip')
      if (vipParam === 'true') {
        openVipDrawer()
        const sectionParam = searchParams.get('section')
        if (sectionParam) {
          setVipActiveSidebarItem(sectionParam)
        }
      }
    }

    const pokerParam = searchParams.get('poker')
    if (pokerParam === 'true') {
      setShowPoker(true)
      setShowSports(false)
      setShowVipRewards(false)
      // Clear the query so it can't re-force Poker after the user leaves
      router.replace('/casino', { scroll: false })
    }

    const tabParam = searchParams.get('tab')
    if (tabParam === 'live') {
      setActiveSubNav('Live')
      setShowAllGames(false)
      setSelectedCategory('')
      setSelectedVendor('')
      setShowSports(false)
      setShowVipRewards(false)
      setShowPoker(false)
      router.replace('/casino', { scroll: false })
    }
  }, [
    searchParams,
    router,
    openVipDrawer,
    setActiveSubNav,
    setInitialVipSidebarItem,
    setSelectedCategory,
    setSelectedVendor,
    setShowAllGames,
    setShowPoker,
    setShowSports,
    setShowVipRewards,
    setVipActiveSidebarItem,
    setVipDrawerOpen,
    setHubFocusMode,
    setPromosActiveTab,
  ])

  useEffect(() => {
    const focus = searchParams.get('focus')
    if (focus !== 'originals') return

    setShowSports(false)
    setShowVipRewards(false)
    setShowPoker(false)
    setShowAllGames(false)
    setSelectedCategory('')
    setSelectedVendor('')
    setActiveSubNav('Lobby')

    router.replace('/casino', { scroll: false })

    const timeoutId = window.setTimeout(() => {
      document.getElementById('casino-originals-carousel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 450)

    return () => window.clearTimeout(timeoutId)
  }, [
    searchParams,
    router,
    setActiveSubNav,
    setSelectedCategory,
    setSelectedVendor,
    setShowAllGames,
    setShowPoker,
    setShowSports,
    setShowVipRewards,
  ])

  return null
}
