'use client'

import { useEffect } from 'react'
import { emitResearchEvent } from './research-events'

/**
 * PROJECT-SPECIFIC adapter. Re-emits this app's DOM events as research events so
 * tasks can auto-complete (e.g. "open the VIP hub").
 *
 * When porting the overlay to another project, replace the contents of this file.
 */
export function ResearchHostBridges() {
  useEffect(() => {
    const onVip = () => emitResearchEvent('vip:opened')
    window.addEventListener('vip:open-drawer', onVip)
    return () => window.removeEventListener('vip:open-drawer', onVip)
  }, [])
  return null
}
