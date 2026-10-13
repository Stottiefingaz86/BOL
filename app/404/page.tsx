import type { Metadata } from 'next'
import { NotFoundPage } from '@/components/not-found-page'

export const metadata: Metadata = {
  title: 'Page not found | BetOnline',
  robots: { index: false, follow: false },
}

/** Direct `/404` route so the page can be linked to and previewed. */
export default function NotFoundRoute() {
  return <NotFoundPage />
}
