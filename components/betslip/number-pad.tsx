'use client'

import { IconBackspace, IconCheck } from '@tabler/icons-react'
import { useCallback } from 'react'

interface BetslipNumberPadProps {
  onDigit: (digit: string) => void
  onBackspace: () => void
  onDone: () => void
  onQuickAmount: (amount: number) => void
}

const quickAmounts = [5, 10, 25, 50, 100]

export function BetslipNumberPad({
  onDigit,
  onBackspace,
  onDone,
  onQuickAmount,
}: BetslipNumberPadProps) {
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

  return (
    <div
      className="shrink-0 w-full px-3 pt-2"
      style={{
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
      }}
      data-vaul-no-drag=""
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Quick Stake Amounts */}
      <div className="flex gap-1.5 mb-2">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            {...makeTapHandler(() => onQuickAmount(amount))}
            className="flex-1 py-2 rounded-lg text-[13px] font-semibold text-black/70 bg-black/[0.05] active:bg-black/[0.12] transition-colors select-none touch-manipulation"
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Digit Grid */}
      <div className="grid grid-cols-3 gap-1.5">
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
