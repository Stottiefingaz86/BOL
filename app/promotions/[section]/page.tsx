'use client'

import { Suspense, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { promoSlugToSection } from '@/lib/promotions-routes'

function PromotionsSectionRedirectInner() {
  const router = useRouter()
  const params = useParams<{ section: string }>()
  const searchParams = useSearchParams()

  useEffect(() => {
    const slug = typeof params.section === 'string' ? params.section : ''
    const mapped = promoSlugToSection(slug)
    if (!mapped) {
      router.replace('/promotions')
      return
    }

    const vip = searchParams.get('vip')
    const hubSection = searchParams.get('hubSection')
    const promoTab = searchParams.get('promoTab')
    const qs = new URLSearchParams({ vipRewardsPage: 'true', section: mapped })
    if (vip === 'true') qs.set('vip', 'true')
    if (hubSection) qs.set('hubSection', hubSection)
    if (promoTab) qs.set('promoTab', promoTab)
    router.replace(`/casino?${qs.toString()}`)
  }, [params.section, router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white/30" />
    </div>
  )
}

export default function PromotionsSectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white/30" />
        </div>
      }
    >
      <PromotionsSectionRedirectInner />
    </Suspense>
  )
}
