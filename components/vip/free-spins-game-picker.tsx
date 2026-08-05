'use client'

import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { IconSparkles, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export type FreeSpinGameOption = {
  id: string
  name: string
  image: string
  provider?: string
}

/** Eligible free-spin titles — picker shows the first 6 in a scrollable list. */
export const FREE_SPIN_GAME_OPTIONS: FreeSpinGameOption[] = [
  {
    id: 'gold-nugget-rush',
    name: 'Gold Nugget Rush',
    image: '/games/square/goldNuggetRush.png',
    provider: 'Slots',
  },
  {
    id: 'original-plinko',
    name: 'Original Plinko',
    image: '/games/originals/plink.png',
    provider: 'Originals',
  },
  {
    id: 'mega-crush',
    name: 'Mega Crush',
    image: '/games/square/megacrush.png',
    provider: 'Slots',
  },
  {
    id: 'hooked-on-fishing',
    name: 'Hooked on Fishing',
    image: '/games/square/hookedOnFishing.png',
    provider: 'Slots',
  },
  {
    id: 'mr-mammoth',
    name: 'Mr Mammoth',
    image: '/games/square/mrMammoth.png',
    provider: 'Slots',
  },
  {
    id: 'take-the-bank',
    name: 'Take the Bank',
    image: '/games/square/takeTheBank.png',
    provider: 'Slots',
  },
]

const VISIBLE_GAMES = 6

type FreeSpinsGamePickerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  spinsLeft?: number
  onSelect: (game: FreeSpinGameOption) => void
}

export function FreeSpinsGamePicker({
  open,
  onOpenChange,
  spinsLeft,
  onSelect,
}: FreeSpinsGamePickerProps) {
  const games = FREE_SPIN_GAME_OPTIONS.slice(0, VISIBLE_GAMES)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal
        container={typeof document !== 'undefined' ? document.body : undefined}
      >
        <Dialog.Overlay
          className="fixed inset-0 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ zIndex: 100010 }}
        />
        <div
          className="fixed inset-0 flex items-center justify-center p-3 pointer-events-none"
          style={{ zIndex: 100011 }}
        >
          <Dialog.Content
            className="pointer-events-auto flex w-full max-w-[400px] max-h-[min(90vh,560px)] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] text-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            style={{ zIndex: 100011 }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
              <Dialog.Title className="flex items-center gap-2 text-sm font-semibold">
                <IconSparkles className="h-4 w-4 text-white/70" strokeWidth={2} />
                Choose Game
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <IconX className="h-4 w-4" strokeWidth={2} />
                </button>
              </Dialog.Close>
            </div>

            <div className="shrink-0 px-4 pt-3 pb-2">
              <Dialog.Description className="text-xs text-white/50">
                Pick where to play your free spins
                {typeof spinsLeft === 'number' ? (
                  <>
                    {' '}
                    ·{' '}
                    <span className="font-medium text-white/75 tabular-nums">
                      {spinsLeft} left
                    </span>
                  </>
                ) : null}
              </Dialog.Description>
              <p className="mt-3 text-sm font-semibold text-white">
                Recommended games
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
              <ul className="flex flex-col">
                {games.map((game, index) => (
                  <li key={game.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(game)}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left',
                        'transition-colors hover:bg-white/[0.05]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-primary,#ee3536)]/40'
                      )}
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#111]">
                        <Image
                          src={game.image}
                          alt={game.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          sizes="48px"
                          unoptimized
                        />
                      </div>
                      <div
                        className={cn(
                          'min-w-0 flex-1 py-0.5',
                          index < games.length - 1 &&
                            'border-b border-white/[0.08]'
                        )}
                      >
                        <p className="truncate text-[13px] font-medium text-white">
                          {game.name}
                        </p>
                        {game.provider ? (
                          <p className="mt-0.5 truncate text-[12px] text-white/45">
                            {game.provider}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default FreeSpinsGamePicker
