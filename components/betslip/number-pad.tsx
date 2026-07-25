'use client'

import { IconBackspace, IconCheck } from '@tabler/icons-react'
import { useCallback, useRef, useState } from 'react'

interface BetslipNumberPadProps {
  onDigit: (digit: string) => void
  onBackspace: () => void
  onDone: () => void
  onQuickAmount: (amount: number) => void
}

const quickAmounts = [5, 10, 25, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000]

export function BetslipNumberPad({
  onDigit,
  onBackspace,
  onDone,
  onQuickAmount,
}: BetslipNumberPadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const makeTapHandler = useCallback(
    (action: () => void) => ({
      onTouchEnd: (e: React.TouchEvent) => {
        e.preventDefault()
        e.stopPropagation()
        action()
      },
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        action()
      },
    }),
    []
  )

  const handleQuickAmountTap = useCallback(
    (amount: number) => {
      setSelectedAmount(amount)
      onQuickAmount(amount)
    },
    [onQuickAmount]
  )

  return (
    <div
      className="shrink-0 w-full pt-2"
      style={{
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
      }}
      data-vaul-no-drag=""
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Quick Stake Amounts — Swipeable Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-1.5 mb-2 px-3 overflow-x-auto scrollbar-hide"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x proximity',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            {...makeTapHandler(() => handleQuickAmountTap(amount))}
            className={`shrink-0 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors select-none touch-manipulation ${
              selectedAmount === amount
                ? 'bg-[#8fd790] text-[#0a0a0a]'
                : 'text-black/70 bg-black/[0.05] active:bg-black/[0.12]'
            }`}
            style={{ scrollSnapAlign: 'start' }}
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Digit Grid */}
      <div className="grid grid-cols-3 gap-1.5 px-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
          <button
            key={key}
            type="button"
            {...makeTapHandler(() => onDigit(key))}
            className="py-3 rounded-xl text-[20px] font-medium text-black/90 bg-black/[0.04] active:bg-black/[0.12] transition-colors select-none touch-manipulation"
          >
            {key}
          </button>
        ))}
        {/* Bottom row: Backspace, 0, Done */}
        <button
          type="button"
          {...makeTapHandler(onBackspace)}
          className="py-3 rounded-xl text-black/50 bg-black/[0.04] active:bg-black/[0.12] transition-colors flex items-center justify-center select-none touch-manipulation"
        >
          <IconBackspace className="w-5 h-5" />
        </button>
        <button
          type="button"
          {...makeTapHandler(() => onDigit('0'))}
          className="py-3 rounded-xl text-[20px] font-medium text-black/90 bg-black/[0.04] active:bg-black/[0.12] transition-colors select-none touch-manipulation"
        >
          0
        </button>
        <button
          type="button"
          {...makeTapHandler(onDone)}
          className="py-3 rounded-xl text-black/50 bg-black/[0.04] active:bg-black/[0.12] transition-colors flex items-center justify-center select-none touch-manipulation"
        >
          <IconCheck className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
