// ChatMessage.tsx - Component for displaying individual chat messages

import { motion } from "framer-motion";
import { ChefHat, User } from "lucide-react";
import { animations, gradients } from "@/lib/design-tokens";

interface ChatMessageProps {
  role: "ai" | "user";
  content: string;
  timestamp: number;
  index: number;
}

export function ChatMessage({ role, content, timestamp, index }: ChatMessageProps) {
  return (
    <motion.div
      key={`${timestamp}-${index}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-3 ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      {role === "ai" && (
        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${gradients.primary} flex items-center justify-center shadow-md`}>
          <ChefHat className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] p-4 rounded-2xl leading-relaxed ${
          role === "ai"
            ? "bg-white dark:bg-gray-900 shadow-md border border-sky-100 dark:border-sky-900/30 text-gray-800 dark:text-gray-200"
            : "bg-sky-50 dark:bg-sky-950/30 text-gray-800 dark:text-gray-200 shadow-sm border border-sky-200/50 dark:border-sky-800/50"
        }`}
      >
        {role === "ai" && (
          <div className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
            Шеф Діма
          </div>
        )}
        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-[1.6]">{content}</div>
      </div>

      {role === "user" && (
        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${gradients.primary} flex items-center justify-center shadow-md`}>
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-full ${gradients.primary} flex items-center justify-center shadow-md`}>
        <ChefHat className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white dark:bg-gray-900 shadow-md border border-sky-100 dark:border-sky-900/30 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Шеф Діма друкує</span>
          <div className="flex gap-1">
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-sky-400 dark:bg-sky-500 rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-sky-400 dark:bg-sky-500 rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-sky-400 dark:bg-sky-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
