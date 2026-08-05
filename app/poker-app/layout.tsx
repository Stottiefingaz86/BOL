import React from 'react'

/**
 * Poker client runs in its own window — no site nav, chat, or betslip chrome.
 * Explicit exception to the page-shell consistency rule (application surface).
 */
export default function PokerAppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
