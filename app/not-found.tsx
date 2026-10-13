import type { Metadata } from 'next'
import { NotFoundPage } from '@/components/not-found-page'

export const metadata: Metadata = {
  title: 'Page not found | BetOnline',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return <NotFoundPage />
}
