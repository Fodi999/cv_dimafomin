"use client";

import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, Sparkles, Clock } from "lucide-react";

interface ChatHistoryItem {
  id: string;
  timestamp: number;
  preview: string;
}

interface ChatHistorySidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatHistory: ChatHistoryItem[];
  sessionId: string | null;
  onLoadChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatHistorySidebar({
  open,
  onOpenChange,
  chatHistory,
  sessionId,
  onLoadChat,
  onDeleteChat,
  onNewChat,
}: ChatHistorySidebarProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Щойно";
    if (diffMins < 60) return `${diffMins} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    if (diffDays === 1) return "Вчора";
    if (diffDays < 7) return `${diffDays} дн тому`;
    
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-[85vw] sm:w-96 overflow-hidden bg-white dark:bg-slate-900 border-l border-sky-200 dark:border-slate-800 p-0 flex flex-col"
      >
        <SheetHeader className="border-b border-sky-200 dark:border-slate-800 px-4 sm:px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageSquare className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span className="text-gray-800 dark:text-gray-100">Історія розмов</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-4 sm:px-6 py-4">
          {/* New Chat Button */}
          <Button
            onClick={() => {
              onNewChat();
              onOpenChange(false);
            }}
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-md transition-all mb-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Нова розмова
          </Button>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto -mx-2 px-2">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Немає збережених розмов
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((chat) => {
                  const isActive = sessionId === chat.id;
                  return (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600 shadow-md'
                          : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/50 dark:hover:bg-sky-950/30'
                      }`}
                      onClick={() => {
                        onLoadChat(chat.id);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium line-clamp-2 mb-1 ${
                            isActive 
                              ? 'text-sky-700 dark:text-sky-300' 
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {chat.preview || "Нова розмова"}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatDate(chat.timestamp)}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Видалити цю розмову?")) {
                              onDeleteChat(chat.id);
                            }
                          }}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
