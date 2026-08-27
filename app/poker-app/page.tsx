import type { Metadata } from 'next'
import { PokerAppShell } from '@/components/poker-app/poker-app-shell'

export const metadata: Metadata = {
  title: 'Brand A Poker',
  description: 'Brand A Poker client',
}

/** Standalone poker application window — intentional exception to site page shell. */
export default function PokerAppPage() {
  return <PokerAppShell />
}
