"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  BookOpen,
  ShoppingBag,
  BrainCircuit,
  User,
  Sparkles,
  LogOut,
  LogIn,
  Refrigerator,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import AuthModal from "@/components/auth/AuthModal";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function NavigationBurger() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закрыть меню при клике на ссылку
  const handleLinkClick = (href: string) => {
    console.log("Navigating to:", href);
    setIsOpen(false);
    router.push(href);
  };

  // Обработчик logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
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
      label: "Головна",
      href: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Академія",
      href: "/academy",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: "Курси",
      href: "/academy/courses",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      label: "AI-наставник",
      href: "/chat/create-chat",
      icon: <BrainCircuit className="w-5 h-5" />,
    },
    {
      label: "Маркет",
      href: "/market",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      label: "Холодильник",
      href: "/fridge",
      icon: <Refrigerator className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string): boolean => {
    if (href === "/" && pathname === "/") return true;
    if (href === "/academy" && pathname.startsWith("/academy")) return true;
    if (href === "/chat/create-chat" && pathname.startsWith("/chat")) return true;
    if (href === "/market" && pathname === "/market") return true;
    if (href === "/fridge" && pathname === "/fridge") return true;
    return false;
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ========== STICKY TOP BAR - ОДИНАКОВАЯ НА ВСЕХ ЭКРАНАХ ========== */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-800/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-start gap-3">
          {/* ===== BURGER BUTTON - LEFT SIDE ===== */}
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

          {/* ===== LOGO - NEXT TO BURGER ===== */}
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
                    <motion.div
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLinkClick(link.href)}
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
                  </motion.div>
                ))}
              </nav>

              {/* ===== DIVIDER ===== */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent my-6" />

              {/* ===== SMART PROFILE BUTTON ===== */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                {user ? (
                  // Logged in user - Profile card + Logout
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleLinkClick(user.role === "admin" ? "/admin/dashboard" : "/profile")}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border-2 border-sky-500/50 hover:border-sky-500 cursor-pointer transition-all"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-sky-500/50"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          Мій профіль
                        </p>
                      </div>
                      <User className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                    </motion.div>

                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all font-medium text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Вихід
                    </motion.button>
                  </>
                ) : (
                  // Not logged in - Login + Register buttons
                  <>
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Увійти
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 font-medium transition-all"
                    >
                      <User className="w-4 h-4" />
                      Реєстрація
                    </motion.button>
                  </>
                )}
              </motion.div>

              {/* ===== DIVIDER ===== */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent my-6" />

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

      {/* ========== AUTH MODAL ========== */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
