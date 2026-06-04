'use client'

import { cn } from '@/lib/utils'

type VipHubScrollBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  isMobile?: boolean
}

export function VipHubScrollBody({
  className,
  children,
  isMobile,
  style,
  ...props
}: VipHubScrollBodyProps) {
  return (
    <div
      className={cn('relative flex-1 min-h-0 overflow-y-auto px-4 pt-4', isMobile ? 'pb-6' : 'pb-2', className)}
      style={{
        WebkitOverflowScrolling: 'touch',
        overflowY: 'auto',
        flex: '1 1 auto',
        minHeight: 0,
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 24px)' : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
