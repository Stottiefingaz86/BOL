import { redirect } from 'next/navigation'
import { promoSlugToSection } from '@/lib/promotions-routes'

type SearchParams = Record<string, string | string[] | undefined>

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

/** Path slug deep links → casino Promotions shell (server redirect, no client spinner). */
export default async function PromotionsSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>
  searchParams: Promise<SearchParams>
}) {
  const { section: slug } = await params
  const sp = await searchParams
  const mapped = promoSlugToSection(slug)
  if (!mapped) redirect('/promotions')

  const vip = first(sp.vip)
  const hubSection = first(sp.hubSection)
  const promoTab = first(sp.promoTab)
  const qs = new URLSearchParams({ vipRewardsPage: 'true', section: mapped })
  if (vip === 'true') qs.set('vip', 'true')
  if (hubSection) qs.set('hubSection', hubSection)
  if (promoTab) qs.set('promoTab', promoTab)
  redirect(`/casino?${qs.toString()}`)
}
