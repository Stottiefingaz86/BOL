"use client"

import { useRef, useEffect } from "react"
import { useChatStore } from "@/lib/store/chatStore"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

import ChatHeader from "./chat-header"
import ChatMessage from "./chat-message"
import ChatInput from "./chat-input"
import ChatUserList from "./chat-user-list"
import ChatRainBanner from "./chat-rain-banner"
import ChatTipModal from "./chat-tip-modal"

import {
  Drawer,
  DrawerContent,
  DrawerHandle,
} from "@/components/ui/drawer"

// ─── Desktop Chat Panel ──────────────────────────────────
// Sidebar toggle logic is handled via useChatSidebarSync hook (see below)
function DesktopChatPanel() {
  const { isOpen, setIsOpen, activeRoom, casinoMessages, sportsMessages, openTipModal, setActiveRain } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = activeRoom === 'casino' ? casinoMessages : sportsMessages

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
  )
}

// ─── Mobile Chat Drawer ──────────────────────────────────
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
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      direction="bottom"
    >
      <DrawerContent
        className="bg-[#222222] border-white/10 h-[85vh] max-h-[85vh]"
        showOverlay={true}
      >
        <DrawerHandle variant="dark" />
        <div className="flex flex-col flex-1 overflow-hidden">
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
        </div>
      </DrawerContent>
    </Drawer>
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
