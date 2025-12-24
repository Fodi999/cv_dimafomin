"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
  className?: string;
}

/**
 * Universal back navigation button
 * Uses router.back() to return to previous page (AI, Recipes, Academy, etc.)
 * Falls back to provided href if no history
 */
export function BackButton({ 
  label = "Wróć", 
  fallbackHref = "/recipes",
  className = ""
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Try to go back in history
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback if no history (direct link)
      router.push(fallbackHref);
    }
  };

  return (
    <motion.button
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBack}
      className={`
        flex items-center gap-2 
        text-gray-300 hover:text-white 
        transition-colors duration-200
        ${className}
      `}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}
