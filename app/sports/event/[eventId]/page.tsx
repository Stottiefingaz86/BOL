'use client'

import { useParams, useRouter } from 'next/navigation'
import { EventPage } from '@/components/sports/event-page'
import { findEventById } from '@/components/sports/mock-data'
import { SportsShell } from '@/components/sports/sports-shell'

/** /sports/event/:eventId — markets + locked match tracker, inside the shared sports chrome. */
export default function SportsEventPage() {
  const router = useRouter()
  const params = useParams<{ eventId: string }>()
  const match = findEventById(decodeURIComponent(params.eventId))

  return (
    <SportsShell
      activeSport={match?.league.sport ?? 'home'}
      activeFeature="home"
      onSelectSport={(id) => router.push(id === 'home' ? '/sports' : `/sports?sport=${id}`)}
      onSelectFeature={(id) => router.push(id === 'home' ? '/sports' : `/sports?feature=${id}`)}
      hideFooter
    >
      {match ? (
        <EventPage event={match.event} league={match.league} />
      ) : (
        <div className="px-6 py-16 text-center">
          <p className="text-sm text-[var(--ds-fg-muted)]">This event is no longer available.</p>
          <button
            type="button"
            onClick={() => router.push('/sports')}
            className="mt-4 rounded-small border border-white/20 px-3 py-1.5 text-xs text-[var(--ds-fg-muted)] hover:bg-[var(--ds-control-bg)] hover:text-[var(--ds-fg)]"
          >
            Back to Sports
          </button>
        </div>
      )}
    </SportsShell>
  )
}
