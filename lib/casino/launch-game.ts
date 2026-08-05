/** Open the casino game launcher overlay (listened for on casino / sports pages). */
export function launchCasinoGame(game: {
  title: string
  image: string
  provider?: string
  features?: string[]
}) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent('vip:close-drawer'))
  window.dispatchEvent(
    new CustomEvent('notification:launch-game-of-week', {
      detail: { game },
    })
  )
}
