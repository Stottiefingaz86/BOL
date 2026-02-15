"use client"

import { useRef, useEffect, useState, useMemo, useCallback } from "react"
import { useChatStore } from "@/lib/store/chatStore"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence, useMotionValue, useDragControls, PanInfo } from "framer-motion"

import ChatHeader from "./chat-header"
import ChatMessage from "./chat-message"
import ChatInput from "./chat-input"
import ChatUserList from "./chat-user-list"
import ChatRainBanner from "./chat-rain-banner"
import ChatTipModal from "./chat-tip-modal"
import ChatUserProfile from "./chat-user-profile"

// ─── Desktop Chat Panel ──────────────────────────────────
function DesktopChatPanel() {
  const { isOpen, setIsOpen, activeRoom, casinoMessages, sportsMessages, openUserProfile } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef(true)
  const hasInitScrolled = useRef(false)

  // Show messages for the active room only
  const messages = useMemo(() => {
    const roomMessages = activeRoom === 'casino' ? casinoMessages : sportsMessages
    return [...roomMessages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }, [activeRoom, casinoMessages, sportsMessages])

  // Track whether user is scrolled near the bottom
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isNearBottomRef.current = distanceFromBottom < 80
  }, [])

  // Only auto-scroll if user is already near the bottom (or on first open)
  useEffect(() => {
    if (!isOpen) {
      hasInitScrolled.current = false
      return
    }
    // On first open, jump to bottom instantly
    if (!hasInitScrolled.current) {
      hasInitScrolled.current = true
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
      })
      return
    }
    // On new messages, only scroll if user is near the bottom
    if (isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 340 }}
          animate={{ x: 0 }}
          exit={{ x: 340 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-[64px] right-0 bottom-0 w-[340px] z-[200] border-l border-white/10 bg-[#222222] overflow-hidden"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex flex-col h-full w-[340px]">
            {/* Header */}
            <ChatHeader onClose={() => setIsOpen(false)} />

            {/* Messages Area — isolated scroll container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              data-chat-scroll
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative custom-scrollbar"
              style={{ overscrollBehavior: 'contain' }}
            >
              {/* Messages */}
              <div className="py-1">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onUserClick={(u) => {
                      if (u.id !== 'current-user') {
                        openUserProfile({
                          id: u.id || '',
                          username: u.username || '',
                          badge: u.badge,
                          isOnline: true,
                        })
                      }
                    }}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* User List Overlay */}
              <ChatUserList onUserClick={(u) => openUserProfile(u)} />
            </div>

            {/* Rain Banner — above input so it's always visible */}
            <ChatRainBanner />

            {/* Input */}
            <ChatInput />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Mobile Chat Panel (slide-up drawer with drag-to-dismiss) ─────
function MobileChatDrawer() {
  const isOpen = useChatStore((s) => s.isOpen)
  const setIsOpen = useChatStore((s) => s.setIsOpen)
  const openUserProfile = useChatStore((s) => s.openUserProfile)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollYRef = useRef(0)
  const isNearBottomRef = useRef(true)
  const hasInitScrolled = useRef(false)

  // Drag-to-dismiss
  const dragY = useMotionValue(0)
  const dragControls = useDragControls()

  const activeRoom = useChatStore((s) => s.activeRoom)

  // Only subscribe to messages when the drawer is open to avoid
  // unnecessary re-renders from the chat simulator
  const casinoMessages = useChatStore((s) => isOpen ? s.casinoMessages : [])
  const sportsMessages = useChatStore((s) => isOpen ? s.sportsMessages : [])

  // Show messages for the active room only, limited to last 60 on mobile
  const messages = useMemo(() => {
    if (!isOpen) return []
    const roomMessages = activeRoom === 'casino' ? casinoMessages : sportsMessages
    const sorted = [...roomMessages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    return sorted.slice(-60)
  }, [activeRoom, casinoMessages, sportsMessages, isOpen])

  // Track whether user is scrolled near the bottom
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isNearBottomRef.current = distanceFromBottom < 80
  }, [])

  // Only auto-scroll if user is near bottom or on first open
  useEffect(() => {
    if (!isOpen || messages.length === 0) {
      hasInitScrolled.current = false
      return
    }
    if (!hasInitScrolled.current) {
      hasInitScrolled.current = true
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
      }, 150)
      return () => clearTimeout(timer)
    }
    if (isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return

    scrollYRef.current = window.scrollY

    const originalStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      overflow: document.body.style.overflow,
      width: document.body.style.width,
    }

    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.position = originalStyles.position
      document.body.style.top = originalStyles.top
      document.body.style.left = originalStyles.left
      document.body.style.right = originalStyles.right
      document.body.style.width = originalStyles.width
      document.body.style.overflow = originalStyles.overflow
      window.scrollTo(0, scrollYRef.current)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const handleUserClick = useCallback((u: { id?: string; username?: string; badge?: 'vip' | 'mod' | 'high-roller' | null }) => {
    if (u.id !== 'current-user') {
      openUserProfile({
        id: u.id || '',
        username: u.username || '',
        badge: u.badge,
        isOnline: true,
      })
    }
  }, [openUserProfile])

  // Drag-to-dismiss: if user drags down past threshold, close (lowered thresholds for easier dismissal)
  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 60 || info.velocity.y > 300) {
      handleClose()
    }
  }, [handleClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — tapping closes chat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xl"
            style={{ pointerEvents: 'auto' }}
            onClick={handleClose}
          />

          {/* Slide-up drawer with drag-to-dismiss */}
          <motion.div
            ref={panelRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            style={{
              y: dragY,
              height: '92dvh',
              maxHeight: '92dvh',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              pointerEvents: 'auto',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[9999] bg-[#222222] rounded-t-[16px] border-t border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle — swipe down to close (only this area triggers drag) */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex w-full items-center justify-center pt-4 pb-3 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
              aria-label="Drag to close chat"
              onClick={handleClose}
            >
              <div className="h-1.5 w-[100px] rounded-full bg-white/40" />
            </div>

            {/* Header with close X */}
            <ChatHeader onClose={handleClose} />

            {/* Messages — isolated scroll container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              data-chat-scroll
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative"
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            >
              <div className="py-1">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onUserClick={handleUserClick}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <ChatUserList onUserClick={(u) => openUserProfile(u)} />
            </div>

            {/* Rain Banner — above input so it's always visible */}
            <ChatRainBanner />

            {/* Input — sits above safe area */}
            <div style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
              <ChatInput />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Main Export: auto-detects desktop vs mobile ─────────
export default function ChatPanel() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? <MobileChatDrawer /> : <DesktopChatPanel />}
      <ChatUserProfile />
      <ChatTipModal />
    </>
  )
}

// Also export individual components for flexible usage
export { DesktopChatPanel, MobileChatDrawer }
