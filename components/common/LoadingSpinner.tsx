// LoadingSpinner.tsx - Компонент для відображення завантаження

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { animations } from "@/lib/design-tokens";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-sky-500 dark:text-sky-400`} />
      </motion.div>
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}
