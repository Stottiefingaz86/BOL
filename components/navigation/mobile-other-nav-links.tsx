'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconChevronDown } from '@tabler/icons-react'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const OTHER_LINKS = [
  { label: 'Contests', href: '/promotions?section=Contests' },
  { label: 'Esports', href: '/esports' },
  { label: 'Racebook', href: '/racebook' },
  { label: 'VIP Rewards', href: '/casino?vipRewardsPage=true' },
] as const

/**
 * Mobile sidebar quick-link "Other" control.
 * Expands Contests / Esports / Racebook / VIP Rewards to the left of the toggle
 * in the same row (no portaled dropdown, no trailing-off-screen list).
 */
export function MobileOtherNavLinks({
  variant = 'ds',
}: {
  variant?: 'ds' | 'white'
}) {
  const router = useRouter()
  const { setOpenMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const firstLinkRef = useRef<HTMLButtonElement>(null)

  const mute =
    variant === 'white'
      ? 'text-white/35 hover:text-white/60'
      : 'text-white/35 hover:text-[var(--ds-fg-muted)]'
  const active =
    variant === 'white' ? 'text-white' : 'text-[var(--ds-fg)]'
  const linkMute =
    variant === 'white'
      ? 'text-white/50 hover:text-white'
      : 'text-white/50 hover:text-[var(--ds-fg)]'

  useEffect(() => {
    if (!open) return
    // Bring the new links into view on the left of the strip
    firstLinkRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    })
  }, [open])

  return (
    <>
      {open
        ? OTHER_LINKS.map((item, index) => (
            <button
              key={item.label}
              ref={index === 0 ? firstLinkRef : undefined}
              type="button"
              onClick={() => {
                setOpenMobile(false)
                setOpen(false)
                router.push(item.href)
              }}
              className={cn(
                'flex-shrink-0 px-3 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors',
                linkMute,
              )}
            >
              {item.label}
            </button>
          ))
        : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex flex-shrink-0 items-center gap-0.5 px-3 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors',
          open ? active : mute,
        )}
        aria-expanded={open}
      >
        {open ? 'Less' : 'Other'}
        <IconChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
    </>
  )
}
