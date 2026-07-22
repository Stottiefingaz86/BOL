'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface AccountDrawerThemeToggleProps {
  className?: string
}

/** Compact sun/moon control — toggles light ↔ dark (no system). */
export function AccountDrawerThemeToggle({ className }: AccountDrawerThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = !mounted || resolvedTheme !== 'light'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
        'border border-[var(--ds-control-border)] bg-[var(--ds-control-bg)] text-[var(--ds-fg-muted)]',
        'transition-[filter,background-color] hover:brightness-110 hover:bg-[var(--ds-control-hover)]',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <IconSun className="size-4" stroke={1.75} />
      ) : (
        <IconMoon className="size-4" stroke={1.75} />
      )}
    </button>
  )
}
