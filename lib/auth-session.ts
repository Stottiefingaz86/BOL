export const AUTH_STORAGE_KEY = 'bol-auth-logged-in'
export const AUTH_PENDING_LOGIN_KEY = 'bol-pending-login'
export const AUTH_SESSION_CHANGED_EVENT = 'auth:session-changed'
export const AUTH_REQUEST_LOGIN_EVENT = 'auth:request-login'

export function readAuthLoggedIn(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored === null ? true : stored === 'true'
  } catch {
    return true
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
