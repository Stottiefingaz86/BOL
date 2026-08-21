import { cn } from '@/lib/utils'

/** Compact “New” tag for header / product nav labels. */
export function NavNewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-[3px] bg-white px-1 py-[2px] text-[9px] font-bold uppercase leading-none tracking-wide !text-[var(--ds-primary,#ee3536)]',
        className
      )}
    >
      New
    </span>
  )
}
