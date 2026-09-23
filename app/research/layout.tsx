import type { ReactNode } from 'react'

export const metadata = { title: 'User research' }

/** Standalone researcher-facing pages — no site chrome. */
export default function ResearchLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#161616] text-white">{children}</div>
}
