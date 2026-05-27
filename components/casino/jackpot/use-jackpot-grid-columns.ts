'use client'

import { useEffect, useState } from 'react'

/** Matches category game grid breakpoints (2–8 columns) */
export function useJackpotGridColumns(isMobile?: boolean) {
  const [columns, setColumns] = useState(isMobile ? 2 : 6)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w >= 1920) setColumns(8)
      else if (w >= 1536) setColumns(7)
      else if (w >= 1280) setColumns(6)
      else if (w >= 1024) setColumns(5)
      else if (w >= 768) setColumns(4)
      else if (w >= 640) setColumns(3)
      else setColumns(2)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [isMobile])

  return columns
}

/** Game tiles shown above the activity feed on the Jackpots tab */
export function useJackpotPreviewGameCount(isMobile?: boolean, rows = 2) {
  const columns = useJackpotGridColumns(isMobile)
  return columns * rows
}
