'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import {
  AUTH_SESSION_CHANGED_EVENT,
  readAuthLoggedIn,
  writeAuthLoggedIn,
} from '@/lib/auth-session'

function subscribeAuthSession(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => onStoreChange()
  window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

/**
 * Demo auth:
 * - Home (`/`) follows localStorage so Join can flip to logged-in in place.
 * - Every other route stays logged in for product demos.
 */
export function useAuthSession() {
  const pathname = usePathname()
  const storedLoggedIn = useSyncExternalStore(
    subscribeAuthSession,
    readAuthLoggedIn,
    () => false
  )
  const isLoggedIn = pathname !== '/' || storedLoggedIn

  const setLoggedIn = useCallback((loggedIn: boolean) => {
    writeAuthLoggedIn(loggedIn)
  }, [])

  const logout = useCallback(() => {
    writeAuthLoggedIn(false)
  }, [])

  return { isLoggedIn, setLoggedIn, logout }
}
