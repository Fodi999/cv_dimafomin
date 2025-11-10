"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  BookOpen,
  ShoppingBag,
  BrainCircuit,
  User,
  Coins,
  Sparkles,
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function NavigationBurger() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [tokenBalance] = useState(1250);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закрыть меню при клике на ссылку
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Закрыть меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks: NavLink[] = [
    {
      label: "Главная",
      href: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Академия",
      href: "/academy",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: "Курсы",
      href: "/academy/courses",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      label: "Маркет",
      href: "/market",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      label: "AI-наставник",
      href: "/chat/create-chat",
      icon: <BrainCircuit className="w-5 h-5" />,
    },
    {
      label: "Профиль",
      href: "/profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string): boolean => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ========== STICKY TOP BAR - ОДИНАКОВАЯ НА ВСЕХ ЭКРАНАХ ========== */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-800/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* ===== LOGO & BRAND - ВИДНО НА ВСЕХ РАЗМЕРАХ ===== */}
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
                Seafood
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Academy</span>
            </div>
          </Link>

          {/* ===== CENTER: TOKEN BALANCE - ВИДНО НА ВСЕХ РАЗМЕРАХ ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/50 dark:border-amber-800/50 rounded-full"
          >
            <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
              {tokenBalance.toLocaleString()}
            </span>
          </motion.div>

          {/* ===== RIGHT: BURGER MENU - ВИДНО НА ВСЕХ РАЗМЕРАХ ===== */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-gray-900 dark:text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* ========== OVERLAY ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* ========== SLIDE-OUT MENU ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-950 z-40 shadow-xl border-r border-gray-200 dark:border-gray-800 overflow-y-auto"
          >
            {/* ===== MENU CONTENT ===== */}
            <div className="p-6 flex flex-col h-full">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Меню
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full" />
              </div>

              {/* ===== NAVIGATION LINKS ===== */}
              <nav className="space-y-2 flex-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={link.href} onClick={handleLinkClick}>
                      <motion.div
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all cursor-pointer ${
                          isActive(link.href)
                            ? "bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-600 dark:text-sky-400 border-l-4 border-sky-500"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/50 border-l-4 border-transparent"
                        }`}
                      >
                        <span
                          className={`${
                            isActive(link.href)
                              ? "text-sky-600 dark:text-sky-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {link.icon}
                        </span>
                        <span className="font-medium text-sm">{link.label}</span>
                        {isActive(link.href) && (
                          <motion.div
                            layoutId="active-indicator"
                            className="ml-auto w-2 h-2 rounded-full bg-sky-500"
                            transition={{ type: "spring", damping: 20 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* ===== DIVIDER ===== */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent my-6" />

              {/* ===== TOKEN BALANCE (Видно везде в меню) ===== */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Баланс токенов
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {tokenBalance.toLocaleString()}
                </div>
              </motion.div>

              {/* ===== FOOTER ===== */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                    <span className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Версия AI
                    </span>
                    Dima Fomin v2.0
                  </p>
                </div>

                {/* AI Signature */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <Sparkles className="w-3 h-3" />
                  <span>Powered by AI Academy</span>
                  <Sparkles className="w-3 h-3" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== SPACER FOR FIXED HEADER ========== */}
      <div className="h-16" />
    </>
  );
}
