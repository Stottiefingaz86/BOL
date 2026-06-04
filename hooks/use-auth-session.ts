'use client'

import { useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { writeAuthLoggedIn } from '@/lib/auth-session'

/**
 * Demo auth: home (`/`) is always logged out; every other route is logged in.
 * Derived from the current path so VIP/header stay in sync without localStorage races.
 */
export function useAuthSession() {
  const pathname = usePathname()
  const isLoggedIn = pathname !== '/'

  const setLoggedIn = useCallback((loggedIn: boolean) => {
    writeAuthLoggedIn(loggedIn)
  }, [])

  const logout = useCallback(() => {
    writeAuthLoggedIn(false)
  }, [])

  return { isLoggedIn, setLoggedIn, logout }
}
