"use client";

import { ChefHat, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

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
}

export function ChatHeader({
  title,
  chatHistory = [],
  sessionId,
  onLoadChat,
  onDeleteChat,
  onNewChat,
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

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-sky-200 dark:border-slate-800 px-4 py-3">
      <div className="flex items-center gap-2">
        {/* Chef Icon & Title */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-sm flex-shrink-0">
          <ChefHat className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex-shrink-0">
          {title}
        </h1>

        {/* History Tabs with Scroll */}
        {chatHistory.length > 0 && (
          <>
            <div className="w-px h-6 bg-sky-200 dark:bg-slate-700 mx-2 flex-shrink-0" />
            
            {/* Scroll Buttons */}
            {canScrollLeft && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll("left")}
                className="p-1 hover:bg-sky-100 dark:hover:bg-slate-800 rounded-lg transition flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </motion.button>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              onLoad={checkScroll}
              className="flex-1 overflow-x-hidden flex items-center gap-2"
            >
              {onNewChat && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNewChat}
                  className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-lg transition whitespace-nowrap flex-shrink-0"
                >
                  ✨ Новая
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
                  className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded-lg transition flex-shrink-0 ${
                    sessionId === chat.id
                      ? "bg-sky-500 text-white shadow-lg"
                      : "bg-sky-100/50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-sky-200/50 dark:hover:bg-slate-700"
                  }`}
                  title="ПКМ для удаления"
                >
                  {chat.preview.substring(0, 15)}...
                </motion.button>
              ))}
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll("right")}
                className="p-1 hover:bg-sky-100 dark:hover:bg-slate-800 rounded-lg transition flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </motion.button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
