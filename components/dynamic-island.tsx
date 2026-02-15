"use client";

import { IconSearch, IconHeart, IconTicket, IconMessageCircle2 } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useChatStore } from "@/lib/store/chatStore";
import { useBetslipStore } from "@/lib/store/betslipStore";

export type DynamicIslandProps = {
  onSearchClick?: () => void;
  onFavoriteClick?: () => void;
  onBetslipClick?: () => void;
  onChatClick?: () => void;
  className?: string;
  isSearchActive?: boolean;
  isFavoriteActive?: boolean;
  isChatActive?: boolean;
  betCount?: number;
  showBetslip?: boolean;
  showChat?: boolean;
  showSearch?: boolean;
  showFavorites?: boolean;
};

export default function DynamicIsland({
  onSearchClick,
  onFavoriteClick,
  onBetslipClick,
  onChatClick,
  className = "",
  isSearchActive = false,
  isFavoriteActive = false,
  isChatActive: isChatActiveProp,
  betCount = 0,
  showBetslip = false,
  showChat = true,
  showSearch = true,
  showFavorites = true,
}: DynamicIslandProps) {
  // Use the global chat store directly — chat is now global
  const chatStore = useChatStore()
  const chatActive = isChatActiveProp ?? chatStore.isOpen
  const handleChatClick = onChatClick ?? (() => chatStore.toggleChat())

  // Global betslip store — shows betslip button on ALL pages when bets exist
  const globalBets = useBetslipStore((s) => s.bets)
  const globalBetslipOpen = useBetslipStore((s) => s.isOpen)
  const globalSetOpen = useBetslipStore((s) => s.setOpen)
  const globalSetMinimized = useBetslipStore((s) => s.setMinimized)

  // Show betslip button if caller says so (sports pages) OR if there are global bets
  const shouldShowBetslip = showBetslip || globalBets.length > 0
  // Bet count: prefer caller's value if provided, otherwise use global
  const effectiveBetCount = showBetslip ? betCount : globalBets.length
  // Click handler: prefer caller's if provided (sports pages), otherwise toggle global betslip
  const handleBetslipClick = onBetslipClick ?? (() => {
    if (globalBetslipOpen) {
      globalSetOpen(false)
    } else {
      globalSetOpen(true)
      globalSetMinimized(false)
    }
  })

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [scrollVisible, setScrollVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Create or find a dedicated portal root for the dock.
  // Uses a MutationObserver to ensure the root stays as a DIRECT child of body.
  // Vaul's drawer library wraps all body children in [data-vaul-drawer-wrapper]
  // and may apply CSS transforms that break position:fixed on mobile Safari.
  useEffect(() => {
    let el = document.getElementById('dock-portal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dock-portal-root';
    }

    // Always ensure it's a direct child of body
    const ensureDirectChildOfBody = () => {
      const dockEl = document.getElementById('dock-portal-root');
      if (dockEl && dockEl.parentElement !== document.body) {
        document.body.appendChild(dockEl);
      }
    };

    document.body.appendChild(el);

    // Watch for DOM changes on body (vaul creating its wrapper moves our element)
    const observer = new MutationObserver(() => {
      // Use rAF to avoid mutating DOM inside the observer callback
      requestAnimationFrame(ensureDirectChildOfBody);
    });
    observer.observe(document.body, { childList: true });

    // Also check after delays since vaul may wrap asynchronously
    const t1 = setTimeout(ensureDirectChildOfBody, 50);
    const t2 = setTimeout(ensureDirectChildOfBody, 200);
    const t3 = setTimeout(ensureDirectChildOfBody, 1000);

    setPortalEl(el);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Scroll-based show/hide — independent of chat state
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastY = lastScrollYRef.current;
      
      if (currentScrollY < 10) {
        setScrollVisible(true);
      } else if (currentScrollY > lastY && currentScrollY > 50) {
        setScrollVisible(true);
      } else if (currentScrollY < lastY) {
        setScrollVisible(false);
      }
      
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dock is visible only when scroll says so AND chat is NOT open
  const isVisible = scrollVisible && !chatActive;

  if (!portalEl) return null;

  // Use a fixed full-width container at the bottom with flexbox centering.
  // This avoids transform-based centering (left-1/2 + translateX(-50%))
  // which breaks position:fixed inside transformed parents on mobile Safari.
  const dock = (
    <AnimatePresence>
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 99990,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3
            }}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#2d2d2d]/60 backdrop-blur-2xl border border-white/20 shadow-2xl">
              {/* Search Button */}
              {showSearch && (
                <button
                  onClick={onSearchClick}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-colors relative",
                    isSearchActive 
                      ? "bg-[#ee3536] active:bg-[#ee3536]/80" 
                      : "bg-white/5 hover:bg-white/10 active:bg-[#ee3536]"
                  )}
                  aria-label="Search"
                >
                  <IconSearch className="w-4 h-4 text-white relative z-10" strokeWidth={2} />
                </button>
              )}

              {/* Chat Button */}
              {showChat && (
                <button
                  onClick={handleChatClick}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-colors relative",
                    chatActive
                      ? "bg-[#ee3536] active:bg-[#ee3536]/80"
                      : "bg-white/5 hover:bg-white/10 active:bg-[#ee3536]"
                  )}
                  aria-label="Chat"
                >
                  <IconMessageCircle2 className="w-4 h-4 text-white relative z-10" strokeWidth={2} />
                  {/* Online pulse indicator */}
                  {!chatActive && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              )}

              {/* Betslip or Favorites Button */}
              {shouldShowBetslip ? (
                <button
                  onClick={handleBetslipClick}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-colors relative",
                    globalBetslipOpen
                      ? "bg-[#ee3536] active:bg-[#ee3536]/80"
                      : "bg-white/5 hover:bg-white/10 active:bg-white/15"
                  )}
                  aria-label="Betslip"
                >
                  <IconTicket 
                    className="w-4 h-4 relative z-10 text-white"
                    strokeWidth={2} 
                  />
                  {effectiveBetCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ee3536] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {effectiveBetCount > 99 ? '99+' : effectiveBetCount}
                    </span>
                  )}
                </button>
              ) : showFavorites ? (
                <button
                  onClick={onFavoriteClick}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-colors relative",
                    isFavoriteActive
                      ? "bg-pink-500/20 hover:bg-pink-500/30 active:bg-pink-500/40"
                      : "bg-white/5 hover:bg-white/10 active:bg-white/15"
                  )}
                  aria-label="Favorites"
                >
                  <IconHeart 
                    className={cn(
                      "w-4 h-4 relative z-10 transition-colors",
                      isFavoriteActive ? "text-pink-500 fill-pink-500" : "text-white"
                    )}
                    strokeWidth={2} 
                  />
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Portal to dedicated #dock-portal-root to escape vaul's drawer-wrapper
  // and any parent transforms that break position:fixed on mobile Safari
  return createPortal(dock, portalEl);
}
