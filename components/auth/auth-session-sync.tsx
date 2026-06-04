'use client'

import { useEffect } from 'react'
import { useAuthSession } from '@/hooks/use-auth-session'

/** Keeps `html.bol-logged-out` in sync for global VIP / drawer styling. */
export function AuthSessionSync() {
  const { isLoggedIn } = useAuthSession()

  useEffect(() => {
    document.documentElement.classList.toggle('bol-logged-out', !isLoggedIn)
    return () => {
      document.documentElement.classList.remove('bol-logged-out')
    }
  }, [isLoggedIn])

  return null
}
