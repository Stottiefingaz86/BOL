/** Opens the Brand A Poker client in a sized popup window (not a full tab). */
const POPUP_WIDTH = 1180
const POPUP_HEIGHT = 760
const POPUP_NAME = 'bol-poker'

let pokerPopup: Window | null = null

export function launchPokerApp(path = '/poker-app'): Window | null {
  if (typeof window === 'undefined') return null

  // Reuse an existing popup if we still hold a reference
  if (pokerPopup && !pokerPopup.closed) {
    try {
      pokerPopup.focus()
      pokerPopup.location.href = path
      return pokerPopup
    } catch {
      pokerPopup = null
    }
  }

  const width = Math.min(POPUP_WIDTH, window.screen.availWidth - 48)
  const height = Math.min(POPUP_HEIGHT, window.screen.availHeight - 48)
  const left = Math.max(0, Math.round((window.screen.availWidth - width) / 2))
  const top = Math.max(0, Math.round((window.screen.availHeight - height) / 2))

  // `popup=yes` + explicit width/height are required for Chromium to open a
  // real window instead of a full browser tab. Never call open() without these.
  const features = [
    'popup=yes',
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'menubar=no',
    'toolbar=no',
    'location=no',
    'status=no',
    'resizable=yes',
    'scrollbars=yes',
  ].join(',')

  pokerPopup = window.open(path, POPUP_NAME, features)

  if (!pokerPopup) {
    // Popup blocked — last resort same-tab navigation is worse UX; warn instead
    console.warn('[poker] Popup blocked. Allow popups for this site to open the poker client.')
  }

  return pokerPopup
}
