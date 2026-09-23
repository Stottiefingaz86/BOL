'use client'

import { Suspense, useCallback, useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuthSession } from '@/hooks/use-auth-session'
import { getCampaign, getLiveCampaign } from './campaign-storage'
import { payloadMatches, useResearchEvent, type ResearchEventDetail } from './research-events'
import { useResearchStore } from './research-store'
import type { Campaign, CompletionRule } from './types'
import { IntakeModal } from './overlay/intake-modal'
import { TaskWidget } from './overlay/task-widget'

/**
 * Mount once at the app root. Invisible until a URL carries
 *   `?research=live`        → the one live campaign (tester link)
 *   `?research=<campaignId>` → a specific campaign, drafts included (preview link)
 *   `?research=off`          → exit
 * State persists in localStorage so the overlay follows the tester across every route.
 */
export function ResearchProvider() {
  return (
    <Suspense fallback={null}>
      <ResearchProviderInner />
    </Suspense>
  )
}

function ResearchProviderInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const param = searchParams.get('research')

  const campaign = useResearchStore((s) => s.campaign)
  const phase = useResearchStore((s) => s.phase)
  const activate = useResearchStore((s) => s.activate)
  const deactivate = useResearchStore((s) => s.deactivate)
  const recordPath = useResearchStore((s) => s.recordPath)

  // Activate / deactivate from the URL, then strip the param so it doesn't leak into shared links.
  useEffect(() => {
    if (!param) return
    let cancelled = false
    const run = async () => {
      if (param === 'off' || param === '0') deactivate()
      else {
        const c = param === 'live' || param === '1' ? await getLiveCampaign() : await getCampaign(param)
        if (!cancelled && c) activate(c)
      }
      if (cancelled) return
      const next = new URLSearchParams(searchParams.toString())
      next.delete('research')
      router.replace(next.toString() ? `${pathname}?${next}` : pathname)
    }
    void run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param])

  // Path trail per task
  useEffect(() => {
    recordPath(pathname)
  }, [pathname, recordPath])

  if (!campaign || phase === 'idle') return null
  // Researcher pages (campaign list / editor / results) never show the tester overlay.
  if (pathname.startsWith('/research')) return null
  return <ActiveOverlay campaign={campaign} pathname={pathname} />
}

function ActiveOverlay({ campaign, pathname }: { campaign: Campaign; pathname: string }) {
  const router = useRouter()
  const phase = useResearchStore((s) => s.phase)
  const taskIndex = useResearchStore((s) => s.taskIndex)
  const taskStartedAt = useResearchStore((s) => s.taskStartedAt)
  const beginSession = useResearchStore((s) => s.beginSession)
  const completeTask = useResearchStore((s) => s.completeTask)
  const deactivate = useResearchStore((s) => s.deactivate)
  const { isLoggedIn } = useAuthSession()

  const task = campaign.tasks[taskIndex]
  const rule: CompletionRule = task?.complete ?? { type: 'manual' }

  // Auto-detection is only armed once the task has been visible for a moment,
  // so a state that was already true doesn't instantly complete the task.
  const armedRef = useRef(false)
  useEffect(() => {
    armedRef.current = false
    const t = setTimeout(() => {
      armedRef.current = true
    }, 800)
    return () => clearTimeout(t)
  }, [taskIndex, taskStartedAt])

  // Rule: auth
  const initialAuth = useRef(isLoggedIn)
  useEffect(() => {
    initialAuth.current = isLoggedIn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex])
  useEffect(() => {
    if (phase !== 'task' || rule.type !== 'auth') return
    if (!armedRef.current) return
    if (isLoggedIn === rule.loggedIn && initialAuth.current !== rule.loggedIn) completeTask('completed', true)
  }, [isLoggedIn, phase, rule, completeTask])

  // Rule: route
  useEffect(() => {
    if (phase !== 'task' || rule.type !== 'route') return
    const hit = rule.regex ? new RegExp(rule.match).test(pathname) : pathname.startsWith(rule.match)
    if (hit && armedRef.current) completeTask('completed', true)
  }, [pathname, phase, rule, completeTask])

  // Rule: event
  const onEvent = useCallback(
    (e: ResearchEventDetail) => {
      if (phase !== 'task' || rule.type !== 'event') return
      if (e.name !== rule.name) return
      if (!payloadMatches(e.payload, rule.match)) return
      completeTask('completed', true)
    },
    [phase, rule, completeTask]
  )
  useResearchEvent(onEvent)

  const exit = () => deactivate()

  if (phase === 'intake') {
    return (
      <IntakeModal
        campaign={campaign}
        onCancel={exit}
        onStart={(tester, ip) => {
          beginSession(tester, ip)
          if (campaign.startPath && pathname !== campaign.startPath) router.push(campaign.startPath)
        }}
      />
    )
  }

  return <TaskWidget campaign={campaign} onExit={exit} />
}
