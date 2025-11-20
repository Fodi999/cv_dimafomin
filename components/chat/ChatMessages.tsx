"use client";

import { motion } from "framer-motion";
import { ChefHat, User, Save, Refrigerator, CalendarDays } from "lucide-react";

interface Message {
  role: "ai" | "user";
  content: string;
  timestamp: number;
  suggestedActions?: string[];
}

interface ChatMessagesProps {
  messages: Message[];
  isThinking: boolean;
  chefName: string;
  userAvatar?: string;
  userName?: string;
  onSuggestedAction?: (action: string) => void;
}

export function ChatMessages({ messages, isThinking, chefName, userAvatar, userName, onSuggestedAction }: ChatMessagesProps) {
  return (
    <>
      {messages.map((msg, index) => (
        <motion.div
          key={`${msg.timestamp}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "ai" && (
            <div className="flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-md">
              <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          )}

          <div
            className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl leading-relaxed text-sm sm:text-base ${
              msg.role === "ai"
                ? "bg-white dark:bg-slate-800/70 shadow-md border border-sky-100 dark:border-sky-700/30 text-gray-800 dark:text-gray-100"
                : "bg-gradient-to-r from-sky-500/20 to-cyan-500/20 dark:from-sky-600/30 dark:to-cyan-600/30 text-gray-800 dark:text-gray-100 shadow-sm border border-sky-200 dark:border-sky-600/50"
            }`}
          >
            {msg.role === "ai" && (
              <div className="font-bold text-sky-600 dark:text-sky-400 mb-1.5 sm:mb-2 text-xs sm:text-sm">{chefName}</div>
            )}
            <div className="whitespace-pre-wrap leading-[1.6]">
              {msg.content}
            </div>
            
            {/* ===== SUGGESTED ACTIONS ===== */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-sky-200 dark:border-sky-700/30 flex flex-wrap gap-1.5 sm:gap-2">
                {msg.suggestedActions.map((action) => {
                  const actionConfig: Record<string, { label: string; icon: typeof Save }> = {
                    save_recipe: { label: "Сохранить рецепт", icon: Save },
                    save_ingredients_to_fridge: { label: "В холодильник", icon: Refrigerator },
                    generate_meal_plan: { label: "План питания", icon: CalendarDays },
                  };
                  
                  const config = actionConfig[action] || { label: action, icon: Save };
                  const Icon = config.icon;
                  
                  return (
                    <motion.button
                      key={action}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSuggestedAction?.(action)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium bg-sky-500/20 hover:bg-sky-500/30 dark:bg-sky-900/40 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-300/50 dark:border-sky-700/50 transition-all flex items-center gap-1"
                    >
                      <Icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{config.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {msg.role === "user" && (
            <div className="flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full shadow-md flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}

      {isThinking && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 sm:gap-3"
        >
          <div className="flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-md">
            <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="bg-white dark:bg-slate-800/70 shadow-md border border-sky-100 dark:border-sky-700/30 p-3 sm:p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-medium">{chefName} пишет</span>
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((delay) => (
                  <motion.span
                    key={delay}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay }}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-400 dark:bg-sky-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
