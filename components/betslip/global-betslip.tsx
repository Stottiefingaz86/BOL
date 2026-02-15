"use client"

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import { useBetslipStore, BetItem } from "@/lib/store/betslipStore"
import { useChatStore } from "@/lib/store/chatStore"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  FamilyDrawerRoot,
  FamilyDrawerContent,
  FamilyDrawerAnimatedWrapper,
  FamilyDrawerAnimatedContent,
  FamilyDrawerViewContent,
  useFamilyDrawer,
  type ViewsRegistry,
} from "@/components/ui/family-drawer"
import {
  IconX,
  IconChevronUp,
  IconChevronDown,
  IconChevronRight,
  IconCheck,
  IconMessageCircle2,
} from "@tabler/icons-react"
import { BetslipNumberPad } from "@/components/betslip/number-pad"

// ─── Helpers ──────────────────────────────────────────────
function oddsToDecimal(oddsStr: string): number {
  const cleaned = oddsStr.replace('+', '').trim()
  const oddsValue = parseFloat(cleaned)
  if (isNaN(oddsValue)) return 2
  if (oddsStr.startsWith('+') || (oddsValue < 2.0 && oddsValue > 0)) {
    return oddsValue / 100 + 1
  }
  return oddsValue
}

// ─── View Switcher (lives inside drawer context) ─────────
function BetslipViewSwitcher() {
  const { setView } = useFamilyDrawer()
  const showConfirmation = useBetslipStore((s) => s.showConfirmation)

  useEffect(() => {
    setView(showConfirmation ? 'confirmation' : 'default')
  }, [showConfirmation, setView])

  return null
}

// ─── Confirmation View (same as sports) ──────────────────
function BetslipConfirmationView() {
  const { setView } = useFamilyDrawer()
  const { pendingBets, setShowConfirmation, clearAll, setMyBetsAlertCount, setBets, setOpen, setManuallyClosed, setPlacedBets } = useBetslipStore()
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)

  return (
    <div className="flex flex-col w-full bg-white" style={{ maxHeight: 'inherit', overflow: 'auto' }}>
      <div className="flex flex-col items-center justify-center px-6 py-6">
        {/* Success Icon */}
        <div className="mb-4">
          <div className="w-16 h-16 rounded-full bg-[#8BC34A] flex items-center justify-center">
            <IconCheck className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Message */}
        <h3 className="text-lg font-semibold text-black text-center mb-6">
          Bet Placed Successfully
        </h3>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-sm mb-6">
          <button
            onClick={() => {
              setView('default')
              setShowConfirmation(false)
              clearAll()
              setMyBetsAlertCount(0)
            }}
            className="w-full py-3 px-4 border border-black/10 rounded text-sm font-medium text-black hover:bg-black/5 transition-colors"
          >
            GO TO MY BETS
          </button>
          <button
            onClick={() => {
              setView('default')
              setShowConfirmation(false)
              clearAll()
            }}
            className="w-full py-3 px-4 bg-red-500 rounded text-sm font-medium text-white hover:bg-red-600 transition-colors"
          >
            DONE
          </button>
          {(() => {
            return (
              <button
                disabled={sharing || shared}
                onClick={() => {
                  if (pendingBets.length > 0 && !sharing && !shared) {
                    setSharing(true)
                    setTimeout(() => {
                      const { shareBetToChat } = useChatStore.getState()
                      shareBetToChat(pendingBets.map((b) => ({
                        eventName: b.eventName,
                        selection: b.selection,
                        odds: b.odds,
                        stake: b.stake,
                      })))
                      setSharing(false)
                      setShared(true)
                    }, 1200)
                  }
                }}
                className={cn(
                  "w-full py-3 px-4 rounded text-sm font-medium transition-all flex items-center justify-center gap-2",
                  shared
                    ? "border border-emerald-500/50 bg-emerald-500/20 text-emerald-600 cursor-default"
                    : sharing
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 cursor-wait opacity-80"
                    : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                )}
              >
                {sharing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                    SHARING...
                  </>
                ) : shared ? (
                  <>
                    <IconCheck className="w-4 h-4" />
                    SHARED TO CHAT ✓
                  </>
                ) : (
                  <>
                    <IconMessageCircle2 className="w-4 h-4" />
                    SHARE TO CHAT
                  </>
                )}
              </button>
            )
          })()}
        </div>

        {/* Re-use Selections */}
        <div className="text-center pt-4 border-t border-black/10 w-full max-w-sm">
          <p className="text-xs text-black/50 mb-2 leading-tight">
            Once this window is closed, your betslip will be cleared, or you can
          </p>
          <button
            onClick={() => {
              if (pendingBets.length > 0) {
                setPlacedBets((prev) => {
                  const newList = [...prev]
                  newList.splice(-pendingBets.length)
                  return newList
                })
                setMyBetsAlertCount((prev) => Math.max(0, prev - pendingBets.length))
                setBets([...pendingBets])
              }
              setView('default')
              setShowConfirmation(false)
            }}
            className="text-sm font-medium text-black hover:text-black/70 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            RE-USE SELECTIONS
            <IconChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Default Betslip View (same as sports) ───────────────
function BetslipDefaultView() {
  const isMobile = useIsMobile()
  const {
    bets,
    isMinimized,
    removeBet,
    updateBetStake,
    clearAll,
    setOpen,
    setMinimized,
    setManuallyClosed,
    setShowConfirmation,
    setPendingBets,
    setPlacedBets,
    setMyBetsAlertCount,
  } = useBetslipStore()

  const currencySymbol = '$'
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [localStakes, setLocalStakes] = useState<Record<string, string>>({})
  const [localParlayStake, setLocalParlayStake] = useState<string>('')
  const inputRefs = useRef<Record<string, HTMLInputElement>>({})
  const focusedInputRef = useRef<string | null>(null)
  const [numpadTarget, _setNumpadTarget] = useState<string | null>(null)
  const numpadTargetRef = useRef<string | null>(null)
  const setNumpadTarget = (val: string | null) => { numpadTargetRef.current = val; _setNumpadTarget(val) }

  // Custom number pad handlers – use refs + state updaters to avoid stale closures
  const handleNumpadDigit = useCallback((digit: string) => {
    const target = numpadTargetRef.current
    if (!target) return
    if (target === 'parlay') {
      setLocalParlayStake(prev => {
        const next = prev + digit
        if (/^\d*\.?\d{0,2}$/.test(next)) {
          setParlayStake(parseFloat(next) || 0)
          return next
        }
        return prev
      })
    } else {
      setLocalStakes(prev => {
        const current = prev[target] || ''
        const next = current + digit
        if (/^\d*\.?\d{0,2}$/.test(next)) {
          updateBetStake(target, parseFloat(next) || 0)
          return { ...prev, [target]: next }
        }
        return prev
      })
    }
  }, [])

  const handleNumpadBackspace = useCallback(() => {
    const target = numpadTargetRef.current
    if (!target) return
    if (target === 'parlay') {
      setLocalParlayStake(prev => {
        const next = prev.slice(0, -1)
        setParlayStake(parseFloat(next) || 0)
        return next
      })
    } else {
      setLocalStakes(prev => {
        const next = (prev[target] || '').slice(0, -1)
        updateBetStake(target, parseFloat(next) || 0)
        return { ...prev, [target]: next }
      })
    }
  }, [])

  const handleNumpadDone = useCallback(() => {
    const target = numpadTargetRef.current
    if (!target) return
    if (target === 'parlay') {
      setLocalParlayStake('')
    } else {
      setLocalStakes(prev => { const n = { ...prev }; delete n[target]; return n })
    }
    setNumpadTarget(null)
  }, [])

  const handleQuickAmount = useCallback((amount: number) => {
    const target = numpadTargetRef.current
    if (!target) return
    const str = amount.toString()
    if (target === 'parlay') {
      setLocalParlayStake(str)
      setParlayStake(amount)
    } else {
      setLocalStakes(prev => ({ ...prev, [target]: str }))
      updateBetStake(target, amount)
    }
  }, [])
  const [parlayStake, setParlayStake] = useState(0)

  // Multi-game parlay detection
  const uniqueEventIds = useMemo(() => new Set(bets.map((b) => b.eventId)), [bets])
  const hasMultipleGames = uniqueEventIds.size > 1
  const hasParlay = bets.length > 1

  // Odds calculations
  const straightStake = bets.reduce((sum, b) => sum + b.stake, 0)
  const parlayOddsMultiplier = hasParlay
    ? bets.reduce((product, b) => product * oddsToDecimal(b.odds), 1)
    : 0
  const parlayOdds = parlayOddsMultiplier > 0 ? `+${((parlayOddsMultiplier - 1) * 100).toFixed(0)}` : '+0'
  const parlayPotentialWin = parlayStake * parlayOddsMultiplier - parlayStake
  const totalStake = straightStake + parlayStake
  const totalPotentialWin = bets.reduce((sum, bet) => {
    const dec = oddsToDecimal(bet.odds)
    return sum + (bet.stake * dec - bet.stake)
  }, 0) + parlayPotentialWin

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => setIsScrolled(container.scrollTop > 0)
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // When numpad opens, scroll the targeted input into view
  useEffect(() => {
    if (!isMobile || !numpadTarget) return
    const container = scrollContainerRef.current
    if (!container) return
    const timer = setTimeout(() => {
      const inputEl = numpadTarget === 'parlay'
        ? container.querySelector('input[data-vaul-no-drag]')
        : inputRefs.current[numpadTarget]
      if (!inputEl) return
      const cr = container.getBoundingClientRect()
      const ir = inputEl.getBoundingClientRect()
      if (ir.bottom > cr.bottom - 10) {
        container.scrollBy({ top: ir.bottom - cr.bottom + 30, behavior: 'smooth' })
      } else if (ir.top < cr.top + 10) {
        container.scrollBy({ top: ir.top - cr.top - 30, behavior: 'smooth' })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [isMobile, numpadTarget])

  // Minimized state (desktop only)
  if (isMinimized && !isMobile) {
    return (
      <div className="px-4 py-2 flex items-center justify-between border-b border-black/5">
        <div className="flex items-center gap-2">
          {bets.length > 0 && (
            <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded">
              <span className="text-xs font-semibold text-white leading-none">{bets.length}</span>
            </div>
          )}
          <span className="text-sm font-semibold text-black">Betslip</span>
          {totalStake > 0 && (
            <span className="text-xs text-black/60">{currencySymbol}{totalStake.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setMinimized(false)
          }}
          className="text-[10px] font-semibold uppercase tracking-wide text-black/60 hover:text-black/80 flex items-center gap-1 px-2.5 py-1 rounded-md border border-black/20 hover:border-black/30 transition-colors"
        >
          <IconChevronUp className="w-3 h-3" />
          SHOW
        </button>
      </div>
    )
  }

  // Expanded state
  return (
    <div className="flex flex-col w-full" style={{ display: 'flex', flexDirection: 'column', maxHeight: isMobile ? 'calc(100vh - 200px)' : 'calc(100vh - 170px)' }}>
      {/* Drag Handle - Mobile Only */}
      {isMobile && (
        <div className="flex justify-center pt-2 pb-0.5 shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 bg-black/20 rounded-full" />
        </div>
      )}
      {/* Header */}
      <div className={cn("px-3 py-2.5 flex items-center justify-between border-b border-black/5 transition-all", isScrolled && "bg-white/95 backdrop-blur-sm")} style={{ flexShrink: 0, zIndex: 15, backgroundColor: isScrolled ? 'rgba(255,255,255,0.95)' : 'white' }}>
        <div className="flex items-center gap-2">
          {bets.length > 0 && (
            <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-md">
              <span className="text-xs font-semibold text-white leading-none">{bets.length}</span>
            </div>
          )}
          <h2 className="text-sm font-semibold text-black/90">Betslip</h2>
        </div>
        {bets.length > 0 && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (isMobile) {
                setOpen(false)
                setManuallyClosed(true)
              } else {
                setMinimized(true)
              }
            }}
            className="text-[10px] font-semibold uppercase tracking-wide text-black/60 hover:text-black/80 flex items-center gap-1 px-2.5 py-1 rounded-md border border-black/20 hover:border-black/30 transition-colors"
          >
            <IconChevronDown className="w-3 h-3" /> MINIMIZE
          </button>
        )}
      </div>

      {/* Empty state */}
      {bets.length === 0 ? (
        <div className="px-4 py-12 text-center flex-1 min-h-0 flex flex-col items-center justify-center" style={{ flex: '1 1 auto', minHeight: 0 }}>
          <p className="text-sm text-black/70">Your betslip is empty</p>
          <p className="text-xs mt-2 text-black/50">Select odds to add bets</p>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen(false)
              setMinimized(false)
              if (isMobile) setManuallyClosed(true)
            }}
            className="mt-6 px-4 py-2 text-xs font-medium text-black/70 hover:text-black border border-black/10 rounded hover:bg-black/5 transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          data-vaul-no-drag=""
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'auto' }}
        >
          {/* Straight Bets */}
          {bets.length > 0 && (
            <div className="px-2" style={{ minHeight: 'fit-content' }}>
              <div className="flex items-center justify-between mb-1.5 pt-2">
                <div className="text-[10px] font-medium text-black/50 uppercase tracking-wide">
                  {hasMultipleGames ? `${bets.length} Selections` : 'Straight Bet'}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    clearAll()
                  }}
                  className="text-[10px] font-medium text-black/50 hover:text-black/70 uppercase tracking-wide"
                >
                  Remove All
                </button>
              </div>
              {[...bets].reverse().map((bet) => {
                const decimalMultiplier = oddsToDecimal(bet.odds)
                const currentStake = localStakes[bet.id] !== undefined
                  ? (localStakes[bet.id] === '' || localStakes[bet.id] === '.' ? 0 : parseFloat(localStakes[bet.id]) || 0)
                  : bet.stake
                const toWin = currentStake * decimalMultiplier - currentStake

                return (
                  <div key={bet.id} className="flex items-start gap-2 py-2 px-2 -mx-2 border-b border-black/5 last:border-b-0 bg-[#f5f5f5] rounded">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeBet(bet.id) }}
                      className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center hover:bg-black/5 rounded"
                    >
                      <IconX className="w-3 h-3 text-black/50" strokeWidth={2.5} />
                    </button>
                    <div className="flex-1 min-w-0 pr-1.5">
                      <div className="text-xs font-medium text-black mb-0.5 truncate leading-tight">{bet.selection}</div>
                      <div className="text-[10px] text-black/50 mb-0.5 leading-tight">{bet.marketTitle}</div>
                      <div className="text-[10px] text-black/40 truncate leading-tight">{bet.eventName}</div>
                    </div>
                    <div className="flex-shrink-0 text-xs font-medium text-black mr-1.5 w-10 text-right">{bet.odds}</div>
                    <div className="flex-shrink-0 w-[100px] min-w-[100px]">
                      <div className={cn("border rounded-lg h-[38px] flex items-center justify-end px-2 relative bg-white focus-within:border-[#8BC34A] focus-within:ring-1 focus-within:ring-[#8BC34A]/30 transition-all", numpadTarget === bet.id ? "border-[#8BC34A] ring-1 ring-[#8BC34A]/30" : "border-black/10")}>
                        <span className="absolute left-2 text-xs text-black/50 z-10">$</span>
                        <input
                          data-vaul-no-drag=""
                          ref={(el) => { if (el) inputRefs.current[bet.id] = el }}
                          type="text"
                          inputMode={isMobile ? "none" : "decimal"}
                          readOnly={isMobile}
                          enterKeyHint={isMobile ? undefined : "done"}
                          autoComplete="off"
                          autoCorrect="off"
                          onPointerDown={(e) => {
                            if (isMobile) { e.preventDefault(); e.stopPropagation() }
                          }}
                          onClick={() => {
                            if (isMobile) {
                              setNumpadTarget(bet.id)
                              if (localStakes[bet.id] === undefined) {
                                setLocalStakes((prev) => ({ ...prev, [bet.id]: bet.stake === 0 ? '' : bet.stake.toString() }))
                              }
                            }
                          }}
                          value={localStakes[bet.id] !== undefined ? localStakes[bet.id] : (bet.stake > 0 ? bet.stake.toString() : '')}
                          onChange={(e) => {
                            if (isMobile) return
                            const val = e.target.value.replace(/[^0-9.]/g, '')
                            if (val === '' || val === '.' || /^\d*\.?\d*$/.test(val)) {
                              setLocalStakes((prev) => ({ ...prev, [bet.id]: val }))
                            }
                          }}
                          onFocus={(e) => {
                            if (isMobile) {
                              setNumpadTarget(bet.id)
                              if (localStakes[bet.id] === undefined) {
                                setLocalStakes((prev) => ({ ...prev, [bet.id]: bet.stake === 0 ? '' : bet.stake.toString() }))
                              }
                              e.target.blur()
                              return
                            }
                            focusedInputRef.current = bet.id
                            if (localStakes[bet.id] === undefined) {
                              setLocalStakes((prev) => ({ ...prev, [bet.id]: bet.stake === 0 ? '' : bet.stake.toString() }))
                            }
                            e.target.select()
                          }}
                          onBlur={(e) => {
                            if (isMobile && numpadTargetRef.current) return
                            if (focusedInputRef.current === bet.id) focusedInputRef.current = null
                            const val = e.target.value
                            const num = val === '' || val === '.' ? 0 : parseFloat(val)
                            const finalVal = isNaN(num) || num < 0 ? 0 : num
                            updateBetStake(bet.id, finalVal)
                            setLocalStakes((prev) => { const next = { ...prev }; delete next[bet.id]; return next })
                          }}
                          onWheel={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                          onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
                          className="border-0 bg-transparent h-full p-0 pl-5 pr-1 text-right focus-visible:outline-none focus-visible:ring-0 text-black font-medium w-full overflow-visible placeholder:text-black/30 placeholder:font-normal"
                          placeholder="0.00"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' as any, minWidth: 0, fontSize: '16px' }}
                        />
                      </div>
                      <div className="text-[9px] text-black/50 text-right mt-0.5 leading-tight">
                        To Win {currencySymbol}{toWin.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Parlay Section */}
          {hasParlay && (() => {
            const currentParlayStake = localParlayStake !== ''
              ? (localParlayStake === '.' ? 0 : parseFloat(localParlayStake) || 0)
              : parlayStake
            const currentParlayPotentialWin = currentParlayStake * parlayOddsMultiplier - currentParlayStake

            return (
              <div className="px-2 pt-2">
                <div className="bg-[#f5f5f5] rounded px-2 py-2 -mx-2">
                  <div className="text-[10px] font-medium text-black/50 uppercase tracking-wide mb-1.5">
                    {bets.length}-Pick Parlay
                  </div>
                  <div className="flex items-start gap-2 py-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-black">{bets.length} Legs</div>
                    </div>
                    <div className="flex-shrink-0 text-xs font-medium text-black mr-1.5">{parlayOdds}</div>
                    <div className="flex-shrink-0 w-[100px] min-w-[100px]">
                      <div className={cn("border rounded-lg h-[38px] flex items-center justify-end px-2 relative bg-white focus-within:border-[#8BC34A] focus-within:ring-1 focus-within:ring-[#8BC34A]/30 transition-all", numpadTarget === 'parlay' ? "border-[#8BC34A] ring-1 ring-[#8BC34A]/30" : "border-black/10")}>
                        <span className="absolute left-2 text-xs text-black/50 z-10">$</span>
                        <input
                          data-vaul-no-drag=""
                          type="text"
                          inputMode={isMobile ? "none" : "decimal"}
                          readOnly={isMobile}
                          enterKeyHint={isMobile ? undefined : "done"}
                          autoComplete="off"
                          autoCorrect="off"
                          onPointerDown={(e) => {
                            if (isMobile) { e.preventDefault(); e.stopPropagation() }
                          }}
                          onClick={() => {
                            if (isMobile) {
                              setNumpadTarget('parlay')
                              if (localParlayStake === '') setLocalParlayStake(parlayStake > 0 ? parlayStake.toString() : '')
                            }
                          }}
                          value={localParlayStake !== '' ? localParlayStake : (parlayStake > 0 ? parlayStake.toString() : '')}
                          onChange={(e) => {
                            if (isMobile) return
                            const val = e.target.value.replace(/[^0-9.]/g, '')
                            if (val === '' || val === '.' || /^\d*\.?\d*$/.test(val)) setLocalParlayStake(val)
                          }}
                          onFocus={(e) => {
                            if (isMobile) {
                              setNumpadTarget('parlay')
                              if (localParlayStake === '') setLocalParlayStake(parlayStake > 0 ? parlayStake.toString() : '')
                              e.target.blur()
                              return
                            }
                            focusedInputRef.current = 'parlay'
                            e.target.select()
                          }}
                          onBlur={(e) => {
                            if (isMobile && numpadTargetRef.current) return
                            if (focusedInputRef.current === 'parlay') focusedInputRef.current = null
                            const val = e.target.value
                            const num = val === '' || val === '.' ? 0 : parseFloat(val)
                            setParlayStake(isNaN(num) || num < 0 ? 0 : num)
                            setLocalParlayStake('')
                          }}
                          onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
                          className="border-0 bg-transparent h-full p-0 pl-5 pr-1 text-right focus-visible:outline-none focus-visible:ring-0 text-black font-medium w-full overflow-visible placeholder:text-black/30 placeholder:font-normal"
                          placeholder="0.00"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' as any, minWidth: 0, fontSize: '16px' }}
                        />
                      </div>
                      <div className="text-[9px] text-black/50 text-right mt-0.5 leading-tight">
                        To Win {currencySymbol}{currentParlayPotentialWin.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Place Bet Button - always visible above keyboard */}
      {bets.length > 0 && (
        <div className="px-3 pt-2 pb-2 border-t border-white/10 shrink-0" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'saturate(180%) blur(30px)', WebkitBackdropFilter: 'saturate(180%) blur(30px)' }}>
          <button
            onClick={() => {
              if (bets.length === 0 || totalStake === 0) return
              const betsToPlace = [...bets]
              const newPlacedBets = betsToPlace.map((bet) => ({ ...bet, placedAt: new Date() }))
              setPlacedBets((prev) => [...prev, ...newPlacedBets])
              setMyBetsAlertCount((prev) => prev + betsToPlace.length)
              setPendingBets(betsToPlace)
              setShowConfirmation(true)
            }}
            disabled={totalStake === 0}
            className={cn(
              "w-full py-3 rounded-lg transition-all flex flex-col items-center justify-center font-medium shadow-sm",
              totalStake > 0 ? "bg-[#8BC34A] text-white hover:bg-[#7CB342] active:scale-[0.98]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <span className="text-xs font-medium uppercase tracking-wide">
              PLACE {currencySymbol}{totalStake.toFixed(2)} BET
            </span>
            <span className={cn("text-[10px] mt-0.5", totalStake > 0 ? "text-white/90" : "text-gray-400")}>
              To Win {currencySymbol}{totalPotentialWin.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Custom Number Pad - Mobile Only - Below Place Bet */}
      {isMobile && numpadTarget && (
        <BetslipNumberPad
          onDigit={handleNumpadDigit}
          onBackspace={handleNumpadBackspace}
          onDone={handleNumpadDone}
          onQuickAmount={handleQuickAmount}
        />
      )}
    </div>
  )
}

// ─── Main Global Betslip Component ───────────────────────
// Uses the exact same FamilyDrawer pattern as sports pages.
// Mounted at the layout level (layout.tsx) so it's always available.
export default function GlobalBetslip() {
  const isMobile = useIsMobile()
  const {
    bets,
    isOpen,
    isMinimized,
    showConfirmation,
    setOpen,
    setMinimized,
    setManuallyClosed,
    setBets,
  } = useBetslipStore()

  // Only render after mount to avoid SSR "document is not defined" from vaul
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // On sports pages, sport pages have their own local betslip — hide the global one entirely.
  // usePathname() updates on ALL navigations (client-side and browser back/forward),
  // unlike popstate which only fires on browser history navigation.
  const pathname = usePathname()
  const isSportsPage = pathname?.startsWith('/sports') ?? false

  // Close global betslip if we navigate to sports (prevent stale open state)
  useEffect(() => {
    if (isSportsPage && isOpen) {
      setOpen(false)
    }
  }, [isSportsPage])

  // Listen for bet:copy-to-slip events (from chat "copy to betslip" button)
  useEffect(() => {
    const handleCopyBet = (e: Event) => {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/sports')) return
      const detail = (e as CustomEvent).detail as { legs: { event: string; selection: string; odds: string }[] } | undefined
      if (!detail?.legs?.length) return
      const newBets: BetItem[] = detail.legs.map((leg, i) => ({
        id: `chat-copy-${Date.now()}-${i}`,
        eventId: Date.now() + i,
        eventName: leg.event,
        marketTitle: 'Match Result',
        selection: leg.selection,
        odds: leg.odds,
        stake: 0,
      }))
      setBets(newBets)
      setOpen(true)
      setMinimized(false)
    }
    window.addEventListener('bet:copy-to-slip', handleCopyBet)
    return () => window.removeEventListener('bet:copy-to-slip', handleCopyBet)
  }, [setBets, setOpen, setMinimized])

  // Build views registry (must be before any early return to keep hook order stable)
  const betslipViews: ViewsRegistry = useMemo(() => ({
    default: BetslipDefaultView,
    confirmation: BetslipConfirmationView,
  }), [])

  // Don't render on sports pages — they have their own local betslip
  // Don't render on server — vaul needs document
  if (!mounted || isSportsPage) return null

  return (
    <FamilyDrawerRoot
      views={betslipViews}
      open={isOpen}
      defaultView={showConfirmation ? 'confirmation' : 'default'}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(false)
          setMinimized(false)
          useBetslipStore.getState().setShowConfirmation(false)
          if (isMobile) setManuallyClosed(true)
          // CRITICAL: Restore body scroll after closing betslip
          requestAnimationFrame(() => {
            document.body.style.removeProperty('overflow')
            document.body.style.removeProperty('pointer-events')
            document.documentElement.style.removeProperty('overflow')
          })
        } else {
          setOpen(true)
          if (isMobile) setManuallyClosed(false)
        }
      }}
    >
      <FamilyDrawerContent className="bg-white rounded-t-[7px] shadow-2xl">
        <FamilyDrawerAnimatedWrapper
          key={`betslip-${bets.length}-${isMinimized}`}
          className="px-0 py-0"
        >
          <FamilyDrawerAnimatedContent>
            <BetslipViewSwitcher />
            <FamilyDrawerViewContent />
          </FamilyDrawerAnimatedContent>
        </FamilyDrawerAnimatedWrapper>
      </FamilyDrawerContent>
    </FamilyDrawerRoot>
  )
}
