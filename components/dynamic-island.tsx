"use client";

import { IconSearch, IconHeart, IconTicket, IconMessageCircle2 } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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

  const [scrollVisible, setScrollVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll-based show/hide — independent of chat state
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setScrollVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setScrollVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setScrollVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Dock is visible only when scroll says so AND chat is NOT open
  const isVisible = scrollVisible && !chatActive;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.3
          }}
          className={cn(
            "fixed z-[100] left-1/2",
            className
          )}
          style={{
            bottom: `calc(1rem + env(safe-area-inset-bottom, 0px))`,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            margin: 0,
            padding: 0
          }}
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
      )}
    </AnimatePresence>
  );
}
