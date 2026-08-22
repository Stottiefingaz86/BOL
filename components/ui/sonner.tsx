'use client'

import type { ExternalToast } from 'sonner'
import { Toaster as Sonner, toast as sonnerToast } from 'sonner'
import { useTheme } from 'next-themes'
import { AppToast, type AppToastVariant } from '@/components/ui/app-toast'

type ToasterProps = React.ComponentProps<typeof Sonner>

export const DEFAULT_TOAST_DURATION = 5000

function showAppToast(
  variant: AppToastVariant,
  message: React.ReactNode,
  data?: ExternalToast
) {
  const duration = data?.duration ?? DEFAULT_TOAST_DURATION
  const { description, ...sonnerData } = data ?? {}
  const resolvedDescription =
    typeof description === 'function' ? description() : description

  return sonnerToast.custom(
    (id) => (
      <AppToast
        id={id}
        variant={variant}
        message={message}
        description={resolvedDescription}
        duration={duration}
      />
    ),
    // description is rendered inside AppToast — omit from sonner or it duplicates below
    { ...sonnerData, duration, description: undefined }
  )
}

type ToastFn = ((
  message: React.ReactNode,
  data?: ExternalToast
) => string | number) & {
  success: (message: React.ReactNode, data?: ExternalToast) => string | number
  error: (message: React.ReactNode, data?: ExternalToast) => string | number
  info: (message: React.ReactNode, data?: ExternalToast) => string | number
  warning: (message: React.ReactNode, data?: ExternalToast) => string | number
  message: (message: React.ReactNode, data?: ExternalToast) => string | number
  loading: typeof sonnerToast.loading
  promise: typeof sonnerToast.promise
  custom: typeof sonnerToast.custom
  dismiss: typeof sonnerToast.dismiss
}

/** App toasts — Promo26 Lumen sonner with countdown progress bar. */
export const toast: ToastFn = Object.assign(
  (message: React.ReactNode, data?: ExternalToast) =>
    showAppToast('message', message, data),
  {
    success: (message: React.ReactNode, data?: ExternalToast) =>
      showAppToast('success', message, data),
    error: (message: React.ReactNode, data?: ExternalToast) =>
      showAppToast('error', message, data),
    info: (message: React.ReactNode, data?: ExternalToast) =>
      showAppToast('info', message, data),
    warning: (message: React.ReactNode, data?: ExternalToast) =>
      showAppToast('warning', message, data),
    message: (message: React.ReactNode, data?: ExternalToast) =>
      showAppToast('message', message, data),
    loading: sonnerToast.loading,
    promise: sonnerToast.promise,
    custom: sonnerToast.custom,
    dismiss: sonnerToast.dismiss,
  }
)

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      closeButton={false}
      duration={DEFAULT_TOAST_DURATION}
      offset={{
        top: 'calc(var(--ds-nav-height, 64px) + var(--ds-toast-gap-below-nav, 12px))',
        left: 20,
      }}
      gap={12}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: '!p-0 !bg-transparent !border-0 !shadow-none !w-auto',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
