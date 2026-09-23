'use client'

import { useEffect } from 'react'

/**
 * Tiny event bus between the host app and the research overlay.
 *
 * Host app: `emitResearchEvent('deposit:completed', { method: 'bitcoin', amount: 50 })`
 * Overlay:  listens and matches against the active task's completion rule.
 *
 * Calls are no-ops when the overlay isn't mounted, so they're safe to leave in product code.
 */
export const RESEARCH_EVENT = 'research:event'

export interface ResearchEventDetail {
  name: string
  payload: Record<string, unknown>
  ts: number
}

export function emitResearchEvent(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<ResearchEventDetail>(RESEARCH_EVENT, { detail: { name, payload, ts: Date.now() } })
  )
}

export function useResearchEvent(handler: (e: ResearchEventDetail) => void) {
  useEffect(() => {
    const listener = (ev: Event) => handler((ev as CustomEvent<ResearchEventDetail>).detail)
    window.addEventListener(RESEARCH_EVENT, listener)
    return () => window.removeEventListener(RESEARCH_EVENT, listener)
  }, [handler])
}

/** Shallow subset match: every key in `match` must equal the payload value (case-insensitive for strings). */
export function payloadMatches(
  payload: Record<string, unknown>,
  match?: Record<string, string | number | boolean>
): boolean {
  if (!match) return true
  return Object.entries(match).every(([k, v]) => {
    const actual = payload[k]
    if (typeof v === 'string' && typeof actual === 'string') return actual.trim().toLowerCase() === v.trim().toLowerCase()
    return actual === v
  })
}
