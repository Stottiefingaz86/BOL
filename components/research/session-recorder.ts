'use client'

import type { eventWithTime } from '@rrweb/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { InteractionEvent } from './types'

/**
 * Records what the tester actually does during a task:
 *  - a lightweight interaction log (clicks with readable targets, navigation, scroll depth, typing)
 *  - a full rrweb DOM recording (Hotjar-style replay), uploaded per task as one JSON chunk
 *
 * Both are scoped to a task: `startTask()` resets, `finishTask()` returns the log and uploads the replay.
 * Clicks inside the research overlay (data-research-ignore) are excluded from the interaction log.
 */

export const REPLAY_BUCKET = 'research-replays'
const IDB_NAME = 'research-replays'
const IDB_STORE = 'chunks'

type StopFn = () => void

class SessionRecorder {
  private events: InteractionEvent[] = []
  private rrEvents: eventWithTime[] = []
  private taskStart = 0
  private maxScroll = 0
  private stopRrweb: StopFn | null = null
  private listeners: StopFn[] = []
  private active = false
  private replayEnabled = true

  get isActive() {
    return this.active
  }

  async start(opts: { replay: boolean }) {
    if (this.active) return
    this.active = true
    this.replayEnabled = opts.replay
    this.attachListeners()
    if (opts.replay) await this.startRrweb()
  }

  /** Reset per-task buffers; rrweb keeps running but we take a fresh full snapshot for a clean chunk. */
  startTask() {
    this.taskStart = Date.now()
    this.events = [{ t: 0, type: 'nav', path: location.pathname }]
    this.maxScroll = 0
    this.rrEvents = []
    void this.takeSnapshot()
  }

  /** Returns the task's interaction log and (async) uploads the replay chunk. */
  async finishTask(sessionId: string, taskIndex: number): Promise<{ events: InteractionEvent[]; replayUrl: string | null }> {
    const events = [...this.events]
    const chunk = this.rrEvents
    this.rrEvents = []
    let replayUrl: string | null = null
    if (this.replayEnabled && chunk.length > 1) {
      replayUrl = await uploadReplayChunk(sessionId, taskIndex, chunk)
    }
    return { events, replayUrl }
  }

  stop() {
    this.active = false
    this.listeners.forEach((off) => off())
    this.listeners = []
    this.stopRrweb?.()
    this.stopRrweb = null
    this.rrEvents = []
  }

  // ─── interaction log ────────────────────────────────────────

  private push(e: Omit<InteractionEvent, 't'>) {
    if (!this.active) return
    this.events.push({ t: Date.now() - this.taskStart, ...e })
    if (this.events.length > 500) this.events.splice(1, 50) // cap memory; keep the first nav
  }

  private attachListeners() {
    const onClick = (ev: MouseEvent) => {
      const el = ev.target as HTMLElement | null
      if (!el || el.closest('[data-research-ignore]')) return
      this.push({ type: 'click', target: describe(el), path: location.pathname })
    }
    const onScroll = () => {
      const doc = document.documentElement
      const depth = doc.scrollHeight > doc.clientHeight ? (doc.scrollTop + doc.clientHeight) / doc.scrollHeight : 1
      if (depth > this.maxScroll + 0.1) {
        this.maxScroll = depth
        this.push({ type: 'scroll', value: Math.round(depth * 100) / 100, path: location.pathname })
      }
    }
    let lastInputTarget: string | null = null
    const onInput = (ev: Event) => {
      const el = ev.target as HTMLElement | null
      if (!el || el.closest('[data-research-ignore]')) return
      const t = describe(el)
      if (t === lastInputTarget) return // one entry per field, not per keystroke
      lastInputTarget = t
      this.push({ type: 'input', target: t, path: location.pathname })
    }
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' || ev.key === 'Escape') this.push({ type: 'key', value: ev.key, path: location.pathname })
    }
    // SPA navigation: patch history + listen to popstate
    const onNav = () => this.push({ type: 'nav', path: location.pathname })
    const origPush = history.pushState.bind(history)
    const origReplace = history.replaceState.bind(history)
    let lastPath = location.pathname
    const check = () => {
      if (location.pathname !== lastPath) {
        lastPath = location.pathname
        onNav()
      }
    }
    history.pushState = (...args) => {
      origPush(...args)
      check()
    }
    history.replaceState = (...args) => {
      origReplace(...args)
      check()
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('input', onInput, true)
    document.addEventListener('keydown', onKey, true)
    window.addEventListener('popstate', check)
    this.listeners.push(
      () => document.removeEventListener('click', onClick, true),
      () => window.removeEventListener('scroll', onScroll),
      () => document.removeEventListener('input', onInput, true),
      () => document.removeEventListener('keydown', onKey, true),
      () => window.removeEventListener('popstate', check),
      () => {
        history.pushState = origPush
        history.replaceState = origReplace
      }
    )
  }

  // ─── rrweb ──────────────────────────────────────────────────

  private async startRrweb() {
    try {
      const { record } = await import('rrweb')
      const stop = record({
        emit: (e) => {
          if (!this.active) return
          this.rrEvents.push(e)
          // Hard cap per task (~20k events) so a very long task can't blow memory.
          if (this.rrEvents.length > 20000) this.rrEvents.splice(2, 2000)
        },
        // The research widget itself is recorded too (like Hotjar) so you can see the tester's flow end to end;
        // everything they type — in the widget or the site — is masked.
        maskAllInputs: true,
        maskTextSelector: '[data-research-ignore] textarea, [data-research-ignore] input',
        sampling: { mousemove: 50, scroll: 150, input: 'last' },
        inlineStylesheet: true,
        recordCanvas: false,
        collectFonts: false,
      })
      this.stopRrweb = stop ?? null
    } catch (e) {
      console.warn('[research] replay recording unavailable', e)
      this.replayEnabled = false
    }
  }

  private async takeSnapshot() {
    if (!this.stopRrweb) return
    try {
      const { record } = await import('rrweb')
      record.takeFullSnapshot?.()
    } catch {
      /* ignore */
    }
  }
}

export const sessionRecorder = new SessionRecorder()

/** Readable label for a clicked element, e.g. `button "Join"`, `a /casino "Casino"`, `img "Gemhalla Xtreme"`. */
function describe(el: HTMLElement): string {
  const interactive = el.closest<HTMLElement>('button, a, [role=button], input, select, textarea, [data-track], label, summary') ?? el
  const tag = interactive.tagName.toLowerCase()
  const label =
    interactive.getAttribute('aria-label') ||
    interactive.getAttribute('title') ||
    interactive.getAttribute('data-track') ||
    (interactive as HTMLInputElement).placeholder ||
    interactive.querySelector('img')?.getAttribute('alt') ||
    interactive.textContent?.trim().replace(/\s+/g, ' ').slice(0, 60) ||
    ''
  const href = tag === 'a' ? (interactive as HTMLAnchorElement).getAttribute('href') : null
  return [tag, href, label ? `"${label}"` : null].filter(Boolean).join(' ')
}

// ─── Replay storage ───────────────────────────────────────────

async function uploadReplayChunk(sessionId: string, taskIndex: number, events: eventWithTime[]): Promise<string | null> {
  const path = `${sessionId}/task-${taskIndex}.json`
  const body = JSON.stringify(events)
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.storage.from(REPLAY_BUCKET).upload(path, new Blob([body], { type: 'application/json' }), { upsert: true, contentType: 'application/json' })
    if (!error) {
      const { data } = supabase.storage.from(REPLAY_BUCKET).getPublicUrl(path)
      if (data?.publicUrl) return data.publicUrl
    }
  }
  // Fallback: IndexedDB on this device (admin on the same browser can still play it).
  try {
    await idbPut(path, body)
    return `idb:${path}`
  } catch {
    return null
  }
}

/** Load a chunk by URL (http or idb:). */
export async function loadReplayChunk(url: string): Promise<eventWithTime[] | null> {
  try {
    if (url.startsWith('idb:')) {
      const raw = await idbGet(url.slice(4))
      return raw ? (JSON.parse(raw) as eventWithTime[]) : null
    }
    const res = await fetch(url)
    if (!res.ok) return null
    return (await res.json()) as eventWithTime[]
  } catch {
    return null
  }
}

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}
async function idbPut(key: string, value: string) {
  const db = await openIdb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
async function idbGet(key: string): Promise<string | undefined> {
  const db = await openIdb()
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(key)
    req.onsuccess = () => resolve(req.result as string | undefined)
    req.onerror = () => reject(req.error)
  })
}
