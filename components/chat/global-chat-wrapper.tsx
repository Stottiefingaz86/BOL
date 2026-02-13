"use client"

import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import ChatPanel from "@/components/chat/chat-panel"
import GlobalBetslip from "@/components/betslip/global-betslip"
import { useChatStore } from "@/lib/store/chatStore"
import { useIsMobile } from "@/hooks/use-mobile"
import { startChatSimulator, stopChatSimulator } from "@/lib/chat-simulator"

/**
 * Global chat wrapper — renders the ChatPanel on every page via a portal.
 * Uses a dedicated portal container (#chat-portal-root) to avoid CSS conflicts
 * with body > div { position: relative !important } in globals.css.
 * On desktop, shifts the page content to the left when the chat is open.
 * On mobile, the chat is a slide-up overlay (no content shift needed).
 */
export default function GlobalChatWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useChatStore()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)
  const hasInitialized = useRef(false)

  // Create a dedicated portal container on mount
  useEffect(() => {
    setMounted(true)
    let el = document.getElementById('chat-portal-root')
    if (!el) {
      el = document.createElement('div')
      el.id = 'chat-portal-root'
      document.body.appendChild(el)
    }
    setPortalEl(el)
    return () => {
      // Don't remove on cleanup — it persists across navigations
    }
  }, [])

  // Close chat on mobile — runs whenever isMobile changes so it catches the
  // delayed media-query result (useIsMobile starts as false then becomes true)
  useEffect(() => {
    if (mounted && isMobile && !hasInitialized.current) {
      hasInitialized.current = true
      if (isOpen) {
        setIsOpen(false)
      }
    }
  }, [mounted, isMobile, isOpen, setIsOpen])

  // Start the chat activity simulator once on mount
  useEffect(() => {
    if (mounted) {
      startChatSimulator()
      return () => stopChatSimulator()
    }
  }, [mounted])

  // Toggle .chat-open on <html> so CSS can shift all fixed + flow elements
  useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    if (!isMobile && isOpen) {
      html.classList.add('chat-open')
    } else {
      html.classList.remove('chat-open')
    }
    return () => {
      html.classList.remove('chat-open')
    }
  }, [mounted, isMobile, isOpen])

  return (
    <>
      {children}
      {portalEl && createPortal(
        <>
          <ChatPanel />
          <GlobalBetslip />
        </>,
        portalEl
      )}
    </>
  )
}
