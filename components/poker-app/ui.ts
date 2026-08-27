import { cn } from '@/lib/utils'

/** Site design-system surfaces (matches Brand A dark theme) */
export const pokerPanel =
  'rounded-lg border border-white/[0.06] bg-[var(--ds-surface-inset,#252525)]'

export const pokerHairline = 'border-white/[0.06]'

export const pokerInset =
  'rounded-md border border-white/[0.06] bg-black/25'

/** Primary CTA — same red as site Play Online / nav active */
export function pokerBtnAction(className?: string) {
  return cn(
    'inline-flex h-8 items-center justify-center rounded-lg px-3 text-[13px] font-medium text-white transition-colors',
    'bg-[var(--ds-primary,#ee3536)] hover:brightness-110',
    'outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-primary,#ee3536)]/40',
    className
  )
}

export function pokerBtnGhost(className?: string) {
  return cn(
    'inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-[13px] font-medium text-[var(--ds-fg-muted)] transition-colors',
    'hover:bg-white/[0.05] hover:text-[var(--ds-fg)]',
    'outline-none focus-visible:ring-2 focus-visible:ring-white/15',
    className
  )
}

export function pokerBtnOutline(className?: string) {
  return cn(
    'inline-flex h-8 items-center justify-center rounded-lg border border-white/12 bg-transparent px-3 text-[13px] font-medium text-[var(--ds-fg)] transition-colors',
    'hover:border-white/20 hover:bg-white/[0.04]',
    'outline-none focus-visible:ring-2 focus-visible:ring-white/15',
    className
  )
}

export function pokerBtnPrimary(className?: string) {
  return pokerBtnAction(className)
}

export function statusTone(status: string) {
  switch (status) {
    case 'register':
      return 'text-[var(--ds-primary,#ee3536)]'
    case 'late':
      return 'text-[var(--ds-fg-muted)]'
    case 'running':
      return 'text-[var(--ds-fg-subtle)]'
    case 'announced':
      return 'text-[var(--ds-fg-subtle)]'
    default:
      return 'text-[var(--ds-fg-muted)]'
  }
}

export function statusLabel(status: string) {
  switch (status) {
    case 'register':
      return 'Register'
    case 'late':
      return 'Late reg'
    case 'running':
      return 'Running'
    case 'announced':
      return 'Announced'
    default:
      return status
  }
}

export const pokerSurface = pokerPanel
export const pokerSurfaceRaised =
  'rounded-lg border border-white/[0.06] bg-[var(--ds-surface-raised,#2d2d2d)]'

/** Soft card glow — white ambient + optional primary tint */
export const pokerGlowCard =
  'rounded-lg border border-white/[0.06] bg-[var(--ds-surface-inset,#252525)] shadow-[0_0_24px_-6px_rgba(255,255,255,0.06)] transition-[box-shadow,border-color] hover:border-white/[0.1] hover:shadow-[0_0_28px_-4px_rgba(255,255,255,0.09)]'

export const pokerGlowAccent =
  'rounded-lg border border-[var(--ds-primary,#ee3536)]/25 bg-[var(--ds-surface-inset,#252525)] shadow-[0_0_28px_-4px_rgba(238,53,54,0.22)] transition-[box-shadow,border-color] hover:border-[var(--ds-primary,#ee3536)]/40 hover:shadow-[0_0_36px_-2px_rgba(238,53,54,0.3)]'
