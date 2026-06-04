'use client'

import { useEffect } from 'react'
import { AUTH_REQUEST_LOGIN_EVENT, consumePendingLogin } from '@/lib/auth-session'

type AuthLoginBridgeProps = {
  onRequestLogin: () => void
}

/**
 * Bridges VIP "Log in" CTAs to the page account drawer.
 * Mount once per page shell that owns account drawer state.
 */
export function AuthLoginBridge({ onRequestLogin }: AuthLoginBridgeProps) {
  useEffect(() => {
    document.documentElement.dataset.authLoginBridge = 'true'
    return () => {
      delete document.documentElement.dataset.authLoginBridge
    }
  }, [])

  useEffect(() => {
    if (consumePendingLogin()) {
      onRequestLogin()
    }

    const handler = () => onRequestLogin()
    window.addEventListener(AUTH_REQUEST_LOGIN_EVENT, handler)
    return () => window.removeEventListener(AUTH_REQUEST_LOGIN_EVENT, handler)
  }, [onRequestLogin])

  return null
}
