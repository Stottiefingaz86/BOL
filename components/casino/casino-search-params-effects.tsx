'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/** Minimal shape from `useRouter()` — only what deep-link handlers need. */
type CasinoRouterLike = {
  replace: (href: string, options?: { scroll?: boolean }) => void
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
      if (promoSectionParam) {
        setInitialVipSidebarItem(promoSectionParam)
      }
      window.scrollTo(0, 0)

      const openHub = searchParams.get('vip') === 'true'
      if (!openHub) {
        setVipDrawerOpen(false)
      }

      router.replace('/casino', { scroll: false })

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
    }

    const tabParam = searchParams.get('tab')
    if (tabParam === 'live') {
      setActiveSubNav('Live')
      setShowAllGames(false)
      setSelectedCategory('')
      setSelectedVendor('')
      setShowSports(false)
      setShowVipRewards(false)
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
    setActiveSubNav('For You')

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
