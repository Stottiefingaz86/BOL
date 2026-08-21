import { redirect } from 'next/navigation'

type SearchParams = Record<string, string | string[] | undefined>

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

/**
 * `/promotions` is a deep-link entry that lands on the casino Promotions shell.
 * Server redirect avoids the old client hop: /promotions → spinner → /casino?… → /casino.
 */
export default async function PromotionsRedirect({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const section = first(sp.section)
  const vip = first(sp.vip)
  const hubSection = first(sp.hubSection)
  const promoTab = first(sp.promoTab)

  if (section === 'Contests') redirect('/promotions/contests')
  if (section === 'My Bonus') redirect('/promotions/my-bonus')
  if (section === 'Refer A Friend') redirect('/promotions/refer-a-friend')

  const params = new URLSearchParams({ vipRewardsPage: 'true' })
  if (section) params.set('section', section)
  if (vip === 'true') params.set('vip', 'true')
  if (hubSection) params.set('hubSection', hubSection)
  if (promoTab) params.set('promoTab', promoTab)
  redirect(`/casino?${params.toString()}`)
}
