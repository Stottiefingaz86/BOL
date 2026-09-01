'use client'

import { useEffect, useRef, useState } from 'react'
import { formatJackpotAmount, formatJackpotCompact } from '@/lib/jackpot/constants'
import { useJackpotStore, type MustDropType } from '@/lib/store/jackpotStore'

export const MUST_DROP_TIME_ACCENT = '#7dd3fc'
export const MUST_DROP_VALUE_ACCENT = '#fcd34d'

export const MUST_DROP_TIME_INFO =
  'A shared pool that is guaranteed to drop before the countdown ends. Any opted-in player on a qualifying spin can win it when it drops.'
export const MUST_DROP_VALUE_INFO =
  'A shared pool that is guaranteed to drop before it reaches the listed amount. Opted-in players can win it on a qualifying spin when the must-drop hits.'

/** Time-based must-drop enters “heating up” in the final hour. */
export const MUST_DROP_HEAT_THRESHOLD_MS = 60 * 60 * 1000

/** Final seconds — countdown switches to 5…1 and pot drains. */
export const MUST_DROP_FINALE_MS = 5000

export const MUST_DROP_HEAT_ACCENT = '#fb923c'

const PREVIEW_HEAT_MS = 42 * 60 * 1000 + 18 * 1000

const HIDDEN_MUST_DROP = {
  isVisible: false as const,
  type: 'time' as const satisfies MustDropType,
  amount: 0,
  displayAmount: 0,
  accent: MUST_DROP_TIME_ACCENT,
  tone: 'time' as const,
  info: MUST_DROP_TIME_INFO,
  detailShort: '',
  detailLong: '',
  sublabel: '',
  countdown: '',
  isHeatingUp: false,
  isCritical: false,
  isFinale: false,
  heatFade: 0,
  remainingMs: 0,
  finaleSeconds: 0,
  heatPreview: false,
  isExiting: false,
  amountFlowDuration: 550,
}

function useCountdownParts(deadline: number, tickMs: number, enabled: boolean) {
  const [remaining, setRemaining] = useState(() =>
    enabled ? Math.max(0, deadline - Date.now()) : 0
  )

  useEffect(() => {
    if (!enabled) {
      setRemaining(0)
      return
    }
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()))
    tick()
    const id = setInterval(tick, tickMs)
    return () => clearInterval(id)
  }, [deadline, tickMs, enabled])

  return remaining
}

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

export function useActiveMustDrop() {
  const type = useJackpotStore((s) => s.activeMustDropType)
  const mustDropLaunched = useJackpotStore((s) => s.mustDropLaunched)
  const mustDropExiting = useJackpotStore((s) => s.mustDropExiting)
  const mustDropDrained = useJackpotStore((s) => s.mustDropDrained)
  const heatPreview = useJackpotStore((s) => s.mustDropHeatPreview)
  const finalePreview = useJackpotStore((s) => s.mustDropFinalePreview)
  const mustDropAmount = useJackpotStore((s) => s.mustDropAmount)
  const mustDropFinaleStartAmount = useJackpotStore((s) => s.mustDropFinaleStartAmount)
  const mustDropDeadline = useJackpotStore((s) => s.mustDropDeadline)
  const beginMustDropExit = useJackpotStore((s) => s.beginMustDropExit)
  const valueAmount = useJackpotStore((s) => s.valueMustDropAmount)
  const valueThreshold = useJackpotStore((s) => s.valueMustDropThreshold)

  const [previewRemaining, setPreviewRemaining] = useState(PREVIEW_HEAT_MS)
  const exitTriggeredRef = useRef(false)

  const active = mustDropLaunched && type === 'time' && !mustDropExiting
  const previewMode = active && heatPreview

  useEffect(() => {
    if (!mustDropLaunched) {
      exitTriggeredRef.current = false
    }
  }, [mustDropLaunched])

  useEffect(() => {
    if (!previewMode) return
    setPreviewRemaining(finalePreview ? MUST_DROP_FINALE_MS : PREVIEW_HEAT_MS)
    exitTriggeredRef.current = false
  }, [previewMode, finalePreview])

  useEffect(() => {
    if (!previewMode) return
    const tickMs = finalePreview ? 100 : 1000
    const id = setInterval(() => {
      setPreviewRemaining((ms) => {
        const step = finalePreview ? 100 : 1000
        if (ms <= step) {
          if (finalePreview && !exitTriggeredRef.current) {
            exitTriggeredRef.current = true
            beginMustDropExit()
          }
          return 0
        }
        return ms - step
      })
    }, tickMs)
    return () => clearInterval(id)
  }, [previewMode, finalePreview, beginMustDropExit])

  const liveTickMs =
    active &&
    !previewMode &&
    !mustDropDrained &&
    mustDropDeadline - Date.now() > 0 &&
    mustDropDeadline - Date.now() <= MUST_DROP_FINALE_MS
      ? 100
      : 1000
  const liveRemaining = useCountdownParts(
    mustDropDeadline,
    liveTickMs,
    active && !previewMode && !mustDropDrained
  )

  useEffect(() => {
    if (previewMode || mustDropDrained || mustDropExiting || !active) return
    if (liveRemaining > 0) return
    if (!exitTriggeredRef.current) {
      exitTriggeredRef.current = true
      beginMustDropExit()
    }
  }, [
    active,
    beginMustDropExit,
    liveRemaining,
    mustDropDrained,
    mustDropExiting,
    previewMode,
  ])

  const effectiveRemaining = mustDropDrained || mustDropExiting
    ? 0
    : previewMode
      ? previewRemaining
      : liveRemaining

  const isFinale =
    !mustDropDrained &&
    !mustDropExiting &&
    active &&
    effectiveRemaining > 0 &&
    effectiveRemaining <= MUST_DROP_FINALE_MS &&
    (previewMode ? finalePreview : effectiveRemaining <= MUST_DROP_HEAT_THRESHOLD_MS)

  if (!mustDropLaunched) {
    return HIDDEN_MUST_DROP
  }

  if (mustDropExiting) {
    return {
      isVisible: true as const,
      isExiting: true as const,
      type: 'time' as const satisfies MustDropType,
      amount: 0,
      displayAmount: 0,
      accent: MUST_DROP_TIME_ACCENT,
      tone: 'time' as const,
      info: MUST_DROP_TIME_INFO,
      detailShort: 'in 00:00:00',
      detailLong: 'In 00:00:00',
      sublabel: 'in 00:00:00',
      countdown: '00:00:00',
      isHeatingUp: false,
      isCritical: false,
      isFinale: false,
      heatFade: 0,
      remainingMs: 0,
      finaleSeconds: 0,
      heatPreview: false,
      amountFlowDuration: 0,
    }
  }

  const ph = Math.floor(effectiveRemaining / 3600000)
  const pm = Math.floor((effectiveRemaining % 3600000) / 60000)
  const ps = Math.floor((effectiveRemaining % 60000) / 1000)
  const countdown = `${pad2(ph)}:${pad2(pm)}:${pad2(ps)}`

  const isHeatingUp =
    type === 'time' &&
    effectiveRemaining > 0 &&
    (previewMode || effectiveRemaining <= MUST_DROP_HEAT_THRESHOLD_MS)

  const isCritical =
    type === 'time' &&
    effectiveRemaining > 0 &&
    (isFinale || effectiveRemaining <= 15 * 60 * 1000)

  const drainRatio = isFinale
    ? Math.max(0, Math.min(1, effectiveRemaining / MUST_DROP_FINALE_MS))
    : 0

  const displayAmount = mustDropDrained
    ? 0
    : isFinale
      ? +(mustDropFinaleStartAmount * drainRatio).toFixed(2)
      : mustDropAmount

  const heatFade = isFinale ? drainRatio : isHeatingUp ? 1 : 0

  const finaleSeconds = isFinale ? Math.max(0, Math.ceil(effectiveRemaining / 1000)) : 0
  const finaleCountdown = `00:00:${pad2(finaleSeconds)}`
  const detailShort = isFinale ? `in ${finaleCountdown}` : `in ${countdown}`
  const detailLong = isFinale ? `In ${finaleCountdown}` : `In ${countdown}`

  if (type === 'value') {
    return {
      isVisible: true as const,
      type: 'value' as const satisfies MustDropType,
      amount: valueAmount,
      displayAmount: valueAmount,
      accent: MUST_DROP_VALUE_ACCENT,
      tone: 'value' as const,
      info: MUST_DROP_VALUE_INFO,
      detailShort: `before ${formatJackpotCompact(valueThreshold)}`,
      detailLong: `Before ${formatJackpotAmount(valueThreshold)}`,
      sublabel: `before ${formatJackpotCompact(valueThreshold)}`,
      isHeatingUp: false,
      isCritical: false,
      isFinale: false,
      heatFade: 0,
      remainingMs: 0,
      finaleSeconds: 0,
      heatPreview: false,
      isExiting: false,
      amountFlowDuration: 550,
    }
  }

  return {
    isVisible: true as const,
    isExiting: false as const,
    type: 'time' as const satisfies MustDropType,
    amount: displayAmount,
    displayAmount,
    accent: isHeatingUp ? MUST_DROP_HEAT_ACCENT : MUST_DROP_TIME_ACCENT,
    tone: 'time' as const,
    info: MUST_DROP_TIME_INFO,
    detailShort,
    detailLong,
    sublabel: detailShort,
    countdown,
    isHeatingUp,
    isCritical,
    isFinale,
    heatFade,
    remainingMs: effectiveRemaining,
    finaleSeconds,
    heatPreview,
    amountFlowDuration: isFinale ? 100 : 550,
  }
}
