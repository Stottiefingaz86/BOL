import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Agency Studio',
  description: 'Game-like creative agency interface',
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
