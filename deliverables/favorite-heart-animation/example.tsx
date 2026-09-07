'use client'

/**
 * Minimal game-tile favourite demo (matches /casino-favourite_animation).
 * Import CSS once: `import './twitter-heart-sprite.css'`
 * Put sprite at: `public/animations/twitter-heart-sprite.png`
 */

import { useState } from 'react'
import { GameTileFavoriteButton } from './game-tile-favorite-button'

export function ExampleFavoriteTile() {
  const [favorited, setFavorited] = useState(false)

  return (
    <div className="relative h-[220px] w-[160px] overflow-hidden rounded-xl bg-[#1a1a1a]">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-[#1a1a1a] to-black" />
      <GameTileFavoriteButton
        favorited={favorited}
        onToggle={() => setFavorited((v) => !v)}
        variant="tile"
      />
      <div className="absolute bottom-3 left-3 right-3 text-[13px] font-semibold text-white">
        Example Game
      </div>
    </div>
  )
}
