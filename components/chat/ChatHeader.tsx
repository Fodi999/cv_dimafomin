"use client";

import { ChefHat, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface ChatHistoryItem {
  id: string;
  timestamp: number;
  preview: string;
}

interface ChatHeaderProps {
  title: string;
  chatHistory?: ChatHistoryItem[];
  sessionId?: string | null;
  onLoadChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onNewChat?: () => void;
  tokenButton?: React.ReactNode;
}

export function ChatHeader({
  title,
  chatHistory = [],
  sessionId,
  onLoadChat,
  onDeleteChat,
  onNewChat,
  tokenButton,
}: ChatHeaderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Check scroll on mount and when history changes
  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [chatHistory]);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-sky-200 dark:border-slate-800 px-2 sm:px-4 py-0 overflow-hidden">
      <div className="flex items-center gap-1 sm:gap-1.5 h-10 sm:h-12">
        {/* Chef Icon & Title */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-sm flex-shrink-0">
          <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
        <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 flex-shrink-0 truncate max-w-[80px] sm:max-w-none">
          {title}
        </h1>

        {/* History Tabs with Scroll */}
        {chatHistory.length > 0 && (
          <>
            <div className="w-px h-5 sm:h-6 bg-sky-200 dark:bg-slate-700 mx-1 flex-shrink-0" />
            
            {/* Scroll Buttons - Hidden on very small screens */}
            {canScrollLeft && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll("left")}
                className="hidden sm:block p-0.5 sm:p-1 hover:bg-sky-100 dark:hover:bg-slate-800 rounded-lg transition flex-shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 dark:text-gray-300" />
              </motion.button>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex-1 overflow-x-auto flex items-center gap-1.5 sm:gap-2 scrollbar-hide"
              style={{ 
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {onNewChat && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNewChat}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Новая</span>
                </motion.button>
              )}
              {chatHistory.map((chat) => (
                <motion.button
                  key={chat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onLoadChat?.(chat.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (confirm("Видалити цю розмову?")) {
                      onDeleteChat?.(chat.id);
                    }
                  }}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-medium whitespace-nowrap rounded-lg transition flex-shrink-0 ${
                    sessionId === chat.id
                      ? "bg-sky-500 text-white shadow-lg"
                      : "bg-sky-100/50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-sky-200/50 dark:hover:bg-slate-700"
                  }`}
                  title="ПКМ для удаления"
                >
                  {chat.preview.substring(0, 12)}...
                </motion.button>
              ))}
            </div>

            {/* Right Scroll Button - Hidden on very small screens */}
            {canScrollRight && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll("right")}
                className="hidden sm:block p-0.5 sm:p-1 hover:bg-sky-100 dark:hover:bg-slate-800 rounded-lg transition flex-shrink-0"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 dark:text-gray-300" />
              </motion.button>
            )}
          </>
        )}

        {/* Token Button - Right Side */}
        {tokenButton && (
          <div className="ml-auto flex-shrink-0">
            {tokenButton}
          </div>
        )}
      </div>
    </header>
  );
}
