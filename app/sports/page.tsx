'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MyBetsPanel } from '@/components/sports/my-bets-panel'
import { SportsHome } from '@/components/sports/sports-home'
import { SportsShell } from '@/components/sports/sports-shell'
import { type SportsFeatureId } from '@/components/sports/sports-sidebar'
import { SPORT_CHIPS, type SportId } from '@/components/sports/mock-data'

const SPORT_IDS = new Set<string>(SPORT_CHIPS.map((c) => c.id))

function SportsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // `/sports?sport=football` / `/sports?feature=my-bets` deep links (used by the event page chips + back)
  const sportParam = searchParams.get('sport')
  const featureParam = searchParams.get('feature')
  const [activeSport, setActiveSport] = useState<SportId>(
    sportParam && SPORT_IDS.has(sportParam) ? (sportParam as SportId) : 'home'
  )
  const [activeFeature, setActiveFeature] = useState<SportsFeatureId>(
    featureParam === 'my-bets' ? 'my-bets' : 'home'
  )

  // Keep the URL clean once we've consumed the params
  useEffect(() => {
    if (sportParam || featureParam) router.replace('/sports')
  }, [sportParam, featureParam, router])

  return (
    <SportsShell
      activeSport={activeSport}
      activeFeature={activeFeature}
      onSelectSport={(id) => {
        setActiveSport(id)
        setActiveFeature('home')
      }}
      onSelectFeature={(id) => {
        setActiveFeature(id)
        if (id === 'home') setActiveSport('home')
      }}
    >
      {activeFeature === 'my-bets' ? (
        <MyBetsPanel
          onBrowse={() => {
            setActiveFeature('home')
            setActiveSport('home')
          }}
        />
      ) : (
        <SportsHome activeSport={activeSport} onActiveSportChange={setActiveSport} />
      )}
    </SportsShell>
  )
}

export default function SportsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[var(--ds-page-bg)]" />}>
      <SportsPageContent />
    </Suspense>
  )
}
