// ChatMessage.tsx - Component for displaying individual chat messages

import { motion } from "framer-motion";
import { ChefHat, User } from "lucide-react";

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
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] p-4 rounded-2xl leading-relaxed ${
          role === "ai"
            ? "bg-white shadow-md border border-orange-50 text-gray-800"
            : "bg-orange-50 text-gray-800 shadow-sm"
        }`}
      >
        {role === "ai" && (
          <div className="font-bold text-gray-900 mb-2 text-sm">
            Шеф Діма
          </div>
        )}
        <div className="whitespace-pre-wrap text-[#444] leading-[1.6]">{content}</div>
      </div>

      {role === "user" && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
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
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
        <ChefHat className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white shadow-md border border-orange-50 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm font-medium">Шеф Діма друкує</span>
          <div className="flex gap-1">
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-orange-400 rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-orange-400 rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-orange-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
