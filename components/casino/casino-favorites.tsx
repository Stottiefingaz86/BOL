'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

function hashGameTitle(title: string): number {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

type CasinoFavoritesContextValue = {
  favoritedGames: Set<number>
  has: (title: string) => boolean
  toggle: (title: string) => void
  hashTitle: (title: string) => number
}

const CasinoFavoritesContext = createContext<CasinoFavoritesContextValue | null>(
  null
)

export function CasinoFavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritedGames, setFavoritedGames] = useState<Set<number>>(
    () => new Set()
  )

  const has = useCallback(
    (title: string) => favoritedGames.has(hashGameTitle(title)),
    [favoritedGames]
  )

  const toggle = useCallback((title: string) => {
    const id = hashGameTitle(title)
    setFavoritedGames((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      favoritedGames,
      has,
      toggle,
      hashTitle: hashGameTitle,
    }),
    [favoritedGames, has, toggle]
  )

  return (
    <CasinoFavoritesContext.Provider value={value}>
      {children}
    </CasinoFavoritesContext.Provider>
  )
}

export function useCasinoFavorites() {
  const ctx = useContext(CasinoFavoritesContext)
  if (!ctx) {
    throw new Error('useCasinoFavorites must be used within CasinoFavoritesProvider')
  }
  return ctx
}

export function useCasinoFavoritesOptional() {
  return useContext(CasinoFavoritesContext)
}

export { hashGameTitle }
