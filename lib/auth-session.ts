export const AUTH_STORAGE_KEY = 'bol-auth-logged-in'
export const AUTH_PENDING_LOGIN_KEY = 'bol-pending-login'
export const AUTH_OPEN_WALLET_AFTER_SIGNUP_KEY = 'bol-open-wallet-after-signup'
export const AUTH_SESSION_CHANGED_EVENT = 'auth:session-changed'
export const AUTH_REQUEST_LOGIN_EVENT = 'auth:request-login'
export const AUTH_REQUEST_REGISTER_EVENT = 'auth:request-register'
export const AUTH_OPEN_WALLET_AFTER_SIGNUP_EVENT = 'auth:open-wallet-after-signup'

export function readAuthLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function writeAuthLoggedIn(loggedIn: boolean) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, loggedIn ? 'true' : 'false')
  } catch {
    // ignore storage failures
  }
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_CHANGED_EVENT, { detail: { loggedIn } })
  )
}

export function requestLogin() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(AUTH_PENDING_LOGIN_KEY, 'true')
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(AUTH_REQUEST_LOGIN_EVENT))
}

export function requestRegister() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(AUTH_REQUEST_REGISTER_EVENT))
}

export function consumePendingLogin(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const pending = sessionStorage.getItem(AUTH_PENDING_LOGIN_KEY) === 'true'
    if (pending) sessionStorage.removeItem(AUTH_PENDING_LOGIN_KEY)
    return pending
  } catch {
    return false
  }
}

/** After first signup only — open wallet hub on the current page. */
export function markOpenWalletAfterSignup() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(AUTH_OPEN_WALLET_AFTER_SIGNUP_KEY, 'true')
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(AUTH_OPEN_WALLET_AFTER_SIGNUP_EVENT))
}

export function consumeOpenWalletAfterSignup(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const pending = sessionStorage.getItem(AUTH_OPEN_WALLET_AFTER_SIGNUP_KEY) === 'true'
    if (pending) sessionStorage.removeItem(AUTH_OPEN_WALLET_AFTER_SIGNUP_KEY)
    return pending
  } catch {
    return false
  }
}
