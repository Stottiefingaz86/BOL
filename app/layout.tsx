import type { Metadata, Viewport } from 'next'
import { Figtree } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import GlobalChatWrapper from '@/components/chat/global-chat-wrapper'
import { AuthSessionSync } from '@/components/auth/auth-session-sync'
import { AuthModal } from '@/components/auth/auth-modal'
import GlobalBetslip from '@/components/betslip/global-betslip'
import { DesignCustomizer } from '@/components/design-customizer'
import { AnimationInspector } from '@/components/dev/animation-inspector'
import { PreventOverscroll } from '@/components/prevent-overscroll'
import EsportsLinkFix from '@/components/navigation/esports-link-fix'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'AI Agency Studio',
  description: 'Game-like creative agency interface',
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <head>
        {/* Figma MCP capture script — only loads on dev to support the
            "Export to Figma" flow. The script self-activates only when the
            URL contains a `#figmacapture=...` hash, so it's a no-op during
            normal dev work. Stripped from production builds. */}
        {process.env.NODE_ENV === 'development' && (
          <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
        )}
      </head>
      <body style={{ fontFamily: 'var(--font-figtree), sans-serif' }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme">
          <AuthSessionSync />
          <AuthModal />
          <EsportsLinkFix />
          <PreventOverscroll />
          <GlobalChatWrapper>
            {children}
          </GlobalChatWrapper>
          <GlobalBetslip />
          <DesignCustomizer />
          <AnimationInspector />
          <Toaster position="top-left" />
        </ThemeProvider>
      </body>
    </html>
  )
}
