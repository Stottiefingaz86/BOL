"use client"

import { useRef, useEffect } from "react"
import { useChatStore } from "@/lib/store/chatStore"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import { IconMessageCircle2 } from "@tabler/icons-react"

import ChatHeader from "./chat-header"
import ChatMessage from "./chat-message"
import ChatInput from "./chat-input"
import ChatUserList from "./chat-user-list"
import ChatRainBanner from "./chat-rain-banner"
import ChatTipModal from "./chat-tip-modal"

// Drawer imports removed — mobile chat now uses framer-motion slide-up

// ─── Desktop Chat Panel ──────────────────────────────────
// Sidebar toggle logic is handled via useChatSidebarSync hook (see below)
function DesktopChatPanel() {
  const { isOpen, setIsOpen, toggleChat, activeRoom, casinoMessages, sportsMessages, casinoOnlineCount, sportsOnlineCount, openTipModal, setActiveRain } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = activeRoom === 'casino' ? casinoMessages : sportsMessages
  const onlineCount = activeRoom === 'casino' ? casinoOnlineCount : sportsOnlineCount

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Trigger a demo rain event after 15 seconds of being open
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      setActiveRain({
        id: 'rain-demo',
        amount: 500,
        currency: 'USD',
        countdown: 30,
        participants: [],
        isActive: true,
        triggeredBy: 'CryptoWhale',
      })
    }, 15000)
    return () => clearTimeout(timer)
  }, [isOpen, setActiveRain])

  return (
    <>
      {/* Floating toggle button - always visible on desktop when chat is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2d2d2d] border border-white/15 text-white shadow-2xl hover:bg-[#363636] hover:border-white/25 transition-colors cursor-pointer group"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
          >
            <div className="relative">
              <IconMessageCircle2 className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#2d2d2d] animate-pulse" />
            </div>
            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Chat</span>
            <span className="text-[11px] text-white/40 font-medium tabular-nums">{onlineCount.toLocaleString()}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-shrink-0 h-screen sticky top-0 border-l border-white/10 bg-[#222222] overflow-hidden"
            style={{ minWidth: 0 }}
          >
            <div className="flex flex-col h-full w-[340px]">
              {/* Header */}
              <ChatHeader onClose={() => setIsOpen(false)} />

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                {/* Rain Banner */}
                <ChatRainBanner />

                {/* Messages */}
                <div className="py-1">
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      onUserClick={(u) => {
                        if (u.id !== 'current-user') {
                          openTipModal({
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
                <ChatUserList onUserClick={(u) => openTipModal(u)} />
              </div>

              {/* Input */}
              <ChatInput />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Mobile Chat Panel (slide-up) ────────────────────────
function MobileChatDrawer() {
  const { isOpen, setIsOpen, activeRoom, casinoMessages, sportsMessages, openTipModal, setActiveRain } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = activeRoom === 'casino' ? casinoMessages : sportsMessages

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }, [messages, isOpen])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Demo rain
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      setActiveRain({
        id: 'rain-demo',
        amount: 500,
        currency: 'USD',
        countdown: 30,
        participants: [],
        isActive: true,
        triggeredBy: 'CryptoWhale',
      })
    }, 15000)
    return () => clearTimeout(timer)
  }, [isOpen, setActiveRain])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-up panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[9999] h-[85vh] max-h-[85vh] bg-[#222222] rounded-t-[12px] border-t border-white/10 flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Drag handle */}
            <div className="flex w-full items-center justify-center pt-3 pb-2 flex-shrink-0">
              <div className="h-1.5 w-[100px] rounded-full bg-white/40" />
            </div>

            {/* Header */}
            <ChatHeader onClose={() => setIsOpen(false)} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto relative">
              <ChatRainBanner />
              <div className="py-1">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onUserClick={(u) => {
                      if (u.id !== 'current-user') {
                        openTipModal({
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

              <ChatUserList onUserClick={(u) => openTipModal(u)} />
            </div>

            {/* Input */}
            <ChatInput />
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
      <ChatTipModal />
    </>
  )
}

// Also export individual components for flexible usage
export { DesktopChatPanel, MobileChatDrawer }
