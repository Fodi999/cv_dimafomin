"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Public Header - Minimal navigation for landing pages
 * 
 * Shows on: /, /about, /pricing
 * Menu: Logo, Academy, AI, Login
 * 
 * No burger menu, no user-specific items.
 * Simple horizontal navigation.
 */
export default function PublicHeader() {
  const { openAuthModal } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-40 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-sm tracking-tight hover:opacity-80 transition group"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg"
          >
            <BrainCircuit className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className="text-gray-900 dark:text-white text-sm font-bold">
              Modern
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Food Academy
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/academy"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Академія
          </Link>
          <Link
            href="/assistant"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            AI Асистент
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Ціни
          </Link>
        </nav>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openAuthModal("login")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Увійти</span>
        </motion.button>
      </div>
    </header>
  );
}
