'use client'

/**
 * @deprecated Auth login is handled globally by `AuthModal` in the root layout.
 * Kept as a no-op so existing page mounts don't break.
 */
export function AuthLoginBridge(_props: { onRequestLogin?: () => void }) {
  return null
}

export default AuthLoginBridge
