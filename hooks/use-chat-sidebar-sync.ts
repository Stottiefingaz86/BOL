import { useEffect, useRef } from "react"
import { useChatStore } from "@/lib/store/chatStore"
import { useSidebar } from "@/components/ui/sidebar"

/**
 * Hook to synchronize chat panel and sidebar state.
 * Rule: If chat opens → collapse sidebar. If sidebar expands → close chat.
 * Must be used inside a SidebarProvider.
 */
export function useChatSidebarSync() {
  const { isOpen: chatOpen, setIsOpen: setChatOpen } = useChatStore()
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar()
  const lastAction = useRef<'chat' | 'sidebar' | null>(null)

  // When chat opens, collapse the sidebar
  useEffect(() => {
    if (chatOpen && sidebarOpen) {
      lastAction.current = 'chat'
      setSidebarOpen(false)
    }
  }, [chatOpen, sidebarOpen, setSidebarOpen])

  // When sidebar expands, close the chat
  useEffect(() => {
    if (sidebarOpen && chatOpen && lastAction.current !== 'chat') {
      lastAction.current = 'sidebar'
      setChatOpen(false)
    }
  }, [sidebarOpen, chatOpen, setChatOpen])

  // Reset the last action ref after state settles
  useEffect(() => {
    const timer = setTimeout(() => {
      lastAction.current = null
    }, 100)
    return () => clearTimeout(timer)
  }, [chatOpen, sidebarOpen])

  return { chatOpen, sidebarOpen }
}
