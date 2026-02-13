"use client"

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
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
} from "@/components/ui/family-drawer"
import {
  IconX,
  IconChevronUp,
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react"

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

// ─── Confirmation View ───────────────────────────────────
function BetslipConfirmationView() {
  const { setView } = useFamilyDrawer()
  const { pendingBets, setShowConfirmation, clearAll, setMyBetsAlertCount } = useBetslipStore()
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)

  return (
    <div className="flex flex-col w-full h-full bg-white" style={{ minHeight: '400px' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-4">
          <div className="w-16 h-16 rounded-full bg-[#8BC34A] flex items-center justify-center">
            <IconCheck className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-black text-center mb-6">Bet Placed Successfully</h3>
        <div className="flex flex-col gap-3 w-full max-w-sm mb-6">
          <button
            onClick={() => {
              setView('default')
              setShowConfirmation(false)
              setMyBetsAlertCount(0)
              clearAll()
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
                <span className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                SHARING...
              </>
            ) : shared ? (
              <>
                <IconCheck className="w-4 h-4" />
                SHARED TO CHAT
              </>
            ) : (
              "SHARE TO CHAT"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Default Betslip View ────────────────────────────────
function BetslipDefaultView() {
  const isMobile = useIsMobile()
  const {
    bets,
    isMinimized,
    manuallyClosed,
    isOpen: betslipOpen,
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
  const scrollLockRafRef = useRef<number | null>(null)
  const savedScrollPositionRef = useRef<{ x: number; y: number } | null>(null)
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

  // Restore focus
  useEffect(() => {
    if (focusedInputRef.current) {
      const input = inputRefs.current[focusedInputRef.current]
      if (input && document.activeElement !== input) {
        setTimeout(() => {
          input.focus()
          const length = input.value.length
          input.setSelectionRange(length, length)
        }, 0)
      }
    }
  }, [localStakes])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => setIsScrolled(container.scrollTop > 0)
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

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
          className="text-[10px] font-semibold uppercase tracking-wide text-black/70 hover:text-black flex items-center gap-1"
        >
          <IconChevronUp className="w-3 h-3" />
          SHOW
        </button>
      </div>
    )
  }

  // Expanded state
  return (
    <div className="relative flex flex-col w-full" style={{ display: 'flex', flexDirection: 'column', position: 'relative', height: '100%', maxHeight: '100%', minHeight: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className={cn("px-2 py-1.5 flex items-center justify-between border-b border-black/5 transition-all", isScrolled && "bg-white/95 backdrop-blur-sm")} style={{ flexShrink: 0, zIndex: 15, backgroundColor: isScrolled ? 'rgba(255,255,255,0.95)' : 'white' }}>
        <div className="flex items-center gap-2">
          {bets.length > 0 && (
            <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded">
              <span className="text-xs font-semibold text-white leading-none">{bets.length}</span>
            </div>
          )}
          <h2 className="text-sm font-medium text-black/90">Betslip</h2>
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
            className="text-[10px] font-semibold uppercase tracking-wide text-black/70 hover:text-black flex items-center gap-1"
          >
            {isMobile ? (
              <><IconX className="w-3 h-3" /> CLOSE</>
            ) : (
              <><IconChevronDown className="w-3 h-3" /> MINIMIZE</>
            )}
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
          className="overscroll-contain"
          style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', position: 'relative', zIndex: 1, paddingBottom: '70px' }}
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
                    <div className="flex-shrink-0 w-[110px] min-w-[110px]">
                      <div className="border border-black/5 rounded h-[36px] flex items-center justify-end px-1.5 relative bg-white">
                        <span className="absolute left-1.5 text-xs text-black/50 z-10">$</span>
                        <input
                          ref={(el) => { if (el) inputRefs.current[bet.id] = el }}
                          type="text"
                          inputMode="decimal"
                          value={localStakes[bet.id] !== undefined ? localStakes[bet.id] : (bet.stake > 0 ? bet.stake.toString() : '')}
                          onChange={(e) => {
                            if (savedScrollPositionRef.current) {
                              window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                            }
                            const val = e.target.value.replace(/[^0-9.]/g, '')
                            if (val === '' || val === '.' || /^\d*\.?\d*$/.test(val)) {
                              setLocalStakes((prev) => ({ ...prev, [bet.id]: val }))
                              requestAnimationFrame(() => {
                                if (savedScrollPositionRef.current) window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y)
                              })
                            }
                          }}
                          onFocus={(e) => {
                            focusedInputRef.current = bet.id
                            if (localStakes[bet.id] === undefined) {
                              setLocalStakes((prev) => ({ ...prev, [bet.id]: bet.stake === 0 ? '' : bet.stake.toString() }))
                            }
                            e.target.select()
                            savedScrollPositionRef.current = { x: window.scrollX, y: window.scrollY }
                          }}
                          onBlur={(e) => {
                            if (focusedInputRef.current === bet.id) focusedInputRef.current = null
                            if (scrollLockRafRef.current !== null) { cancelAnimationFrame(scrollLockRafRef.current); scrollLockRafRef.current = null }
                            if (savedScrollPositionRef.current) { window.scrollTo(savedScrollPositionRef.current.x, savedScrollPositionRef.current.y); savedScrollPositionRef.current = null }
                            const val = e.target.value
                            const num = val === '' || val === '.' ? 0 : parseFloat(val)
                            const finalVal = isNaN(num) || num < 0 ? 0 : num
                            updateBetStake(bet.id, finalVal)
                            setLocalStakes((prev) => { const next = { ...prev }; delete next[bet.id]; return next })
                          }}
                          onWheel={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                          onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
                          className="border-0 bg-transparent text-xs h-full p-0 pl-4 pr-6 text-right focus-visible:outline-none focus-visible:ring-0 text-black w-full overflow-visible placeholder:text-black/40"
                          placeholder="Enter Risk"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' as any, minWidth: 0 }}
                        />
                        <div className="absolute right-0.5 top-0.5 bottom-0.5 flex flex-col gap-0.5 z-10 pointer-events-none">
                          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateBetStake(bet.id, (bet.stake || 0) + 1) }} className="w-2.5 h-2.5 flex items-center justify-center hover:bg-black/5 rounded pointer-events-auto">
                            <IconChevronUp className="w-2 h-2 text-black/40" strokeWidth={3} />
                          </button>
                          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateBetStake(bet.id, Math.max(0, (bet.stake || 0) - 1)) }} className="w-2.5 h-2.5 flex items-center justify-center hover:bg-black/5 rounded pointer-events-auto">
                            <IconChevronDown className="w-2 h-2 text-black/40" strokeWidth={3} />
                          </button>
                        </div>
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
                    <div className="flex-shrink-0 w-[110px] min-w-[110px]">
                      <div className="border border-black/15 rounded h-[36px] flex items-center justify-end px-1.5 relative bg-white">
                        <span className="absolute left-1.5 text-xs text-black/50 z-10">$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={localParlayStake !== '' ? localParlayStake : (parlayStake > 0 ? parlayStake.toString() : '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '')
                            if (val === '' || val === '.' || /^\d*\.?\d*$/.test(val)) setLocalParlayStake(val)
                          }}
                          onFocus={(e) => {
                            focusedInputRef.current = 'parlay'
                            e.target.select()
                          }}
                          onBlur={(e) => {
                            if (focusedInputRef.current === 'parlay') focusedInputRef.current = null
                            const val = e.target.value
                            const num = val === '' || val === '.' ? 0 : parseFloat(val)
                            setParlayStake(isNaN(num) || num < 0 ? 0 : num)
                            setLocalParlayStake('')
                          }}
                          onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
                          className="border-0 bg-transparent text-xs h-full p-0 pl-4 pr-6 text-right focus-visible:outline-none focus-visible:ring-0 text-black w-full overflow-visible placeholder:text-black/40"
                          placeholder="Enter Risk"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' as any, minWidth: 0 }}
                        />
                        <div className="absolute right-0.5 top-0.5 bottom-0.5 flex flex-col gap-0.5 z-10 pointer-events-none">
                          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setParlayStake((prev) => prev + 1) }} className="w-2.5 h-2.5 flex items-center justify-center hover:bg-black/5 rounded pointer-events-auto">
                            <IconChevronUp className="w-2 h-2 text-black/40" strokeWidth={3} />
                          </button>
                          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setParlayStake((prev) => Math.max(0, prev - 1)) }} className="w-2.5 h-2.5 flex items-center justify-center hover:bg-black/5 rounded pointer-events-auto">
                            <IconChevronDown className="w-2 h-2 text-black/40" strokeWidth={3} />
                          </button>
                        </div>
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

      {/* Place Bet Button - fixed at bottom */}
      {bets.length > 0 && (
        <div className="px-2 pt-2 pb-2 border-t border-black/5 bg-white backdrop-blur-sm" style={{ height: '70px', flexShrink: 0, position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', zIndex: 30, backgroundColor: 'white' }}>
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
              "w-full py-2 rounded transition-colors flex flex-col items-center justify-center",
              totalStake > 0 ? "bg-[#8BC34A] text-white hover:bg-[#7CB342]" : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
    </div>
  )
}

// ─── Main Global Betslip Component ───────────────────────
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

  // Listen for bet:copy-to-slip events (from chat "copy to betslip" button)
  // On sports pages, the page-specific handler manages this — skip here to avoid double betslips
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

  // Build views registry
  const betslipViews = useMemo(() => ({
    default: BetslipDefaultView,
    confirmation: BetslipConfirmationView,
  }), [])

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
        } else {
          setOpen(true)
          if (isMobile) setManuallyClosed(false)
        }
      }}
    >
      <FamilyDrawerContent className="bg-white rounded-t-2xl">
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
