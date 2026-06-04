'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AUTH_REQUEST_LOGIN_EVENT } from '@/lib/auth-session'

/**
 * When VIP "Log in" is clicked on pages without a local account drawer,
 * redirect to home where AuthLoginBridge opens the login view.
 */
export function GlobalAuthLoginFallback() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => {
      if (document.documentElement.dataset.authLoginBridge === 'true') return
      if (pathname === '/') return
      router.push('/')
    }

    window.addEventListener(AUTH_REQUEST_LOGIN_EVENT, handler)
    return () => window.removeEventListener(AUTH_REQUEST_LOGIN_EVENT, handler)
  }, [pathname, router])

  return null
}
