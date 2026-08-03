'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function PromotionsRedirectInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const section = searchParams.get('section')
    const vip = searchParams.get('vip')
    const hubSection = searchParams.get('hubSection')
    const promoTab = searchParams.get('promoTab')

    // Prefer path slugs when possible (legacy ?section= still works)
    if (section === 'Contests') {
      router.replace('/promotions/contests')
      return
    }
    if (section === 'My Bonus') {
      router.replace('/promotions/my-bonus')
      return
    }
    if (section === 'Refer A Friend') {
      router.replace('/promotions/refer-a-friend')
      return
    }

    const params = new URLSearchParams({ vipRewardsPage: 'true' })
    if (section) params.set('section', section)
    if (vip === 'true') params.set('vip', 'true')
    if (hubSection) params.set('hubSection', hubSection)
    if (promoTab) params.set('promoTab', promoTab)
    router.replace(`/casino?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/30" />
    </div>
  )
}

export default function PromotionsRedirect() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/30" />
        </div>
      }
    >
      <PromotionsRedirectInner />
    </Suspense>
  )
}
