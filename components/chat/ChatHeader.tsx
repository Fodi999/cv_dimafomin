"use client";

import { ChefHat, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  title: string;
  onOpenHistory?: () => void;
  historyCount?: number;
}

export function ChatHeader({
  title,
  onOpenHistory,
  historyCount = 0,
}: ChatHeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-sky-200 dark:border-slate-800 px-2 sm:px-4 py-0">
      <div className="flex items-center justify-between gap-2 h-10 sm:h-12">
        {/* Left: Chef Icon & Title */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">
            {title}
          </h1>
        </div>

        {/* Right: History Button */}
        {onOpenHistory && (
          <Button
            onClick={onOpenHistory}
            variant="outline"
            size="sm"
            className="relative border-sky-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:border-sky-300 dark:hover:border-sky-600"
          >
            <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-2">Історія</span>
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
