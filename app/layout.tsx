import type { Metadata, Viewport } from 'next'
import { Figtree } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import GlobalChatWrapper from '@/components/chat/global-chat-wrapper'
import GlobalBetslip from '@/components/betslip/global-betslip'
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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#0a0a0a' },
  ],
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
      <body style={{ fontFamily: 'var(--font-figtree), sans-serif' }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme">
          <GlobalChatWrapper>
            {children}
          </GlobalChatWrapper>
          <GlobalBetslip />
        </ThemeProvider>
      </body>
    </html>
  )
}
