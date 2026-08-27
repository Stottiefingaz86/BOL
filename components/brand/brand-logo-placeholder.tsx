import { cn } from '@/lib/utils'

export type BrandLogoVariant = 'full' | 'lockup'

const VARIANT_CLASS: Record<BrandLogoVariant, string> = {
  full: 'h-5 w-[110px]',
  lockup: 'size-7',
}

type BrandLogoPlaceholderProps = {
  variant?: BrandLogoVariant
  className?: string
}

/** Neutral logo placeholder — same dimensions as real brand logos. */
export function BrandLogoPlaceholder({
  variant = 'full',
  className,
}: BrandLogoPlaceholderProps) {
  return (
    <div
      data-brand-logo={variant}
      aria-hidden
      className={cn(
        'flex-shrink-0 rounded-sm border border-white/20 bg-white/10',
        VARIANT_CLASS[variant],
        className,
      )}
    />
  )
}

/** Full-width logo slot used in header brand config. */
export function BrandLogoFull({ className }: { className?: string }) {
  return (
    <div className={cn('h-full w-full', className)}>
      <BrandLogoPlaceholder variant="full" className="h-full w-full" />
    </div>
  )
}

/** Vendors that must not show real brand marks in the UI. */
export function isBrandVendor(vendor: string): boolean {
  const normalized = vendor.trim().toLowerCase()
  return normalized === 'house' || normalized === 'originals' || normalized === 'brand a'
}

/** Small black box used on game tiles instead of brand vendor icons. */
export function BrandVendorPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('flex-shrink-0 rounded-[3px] bg-black', className)}
    />
  )
}

/** Black icon slot inside the Original tag pill. */
export function BrandTagIconPlaceholder({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('block size-2.5 rounded-[2px] bg-black', className)}
    />
  )
}

/** Covers baked-in brand marks on Originals tile artwork. */
export function OriginalsTileBrandCover() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-14 bg-gradient-to-t from-black via-black/95 to-transparent"
    />
  )
}
