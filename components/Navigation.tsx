"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, LogIn, User, Sparkles } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import AuthModal from "@/components/auth/AuthModal";

export default function Navigation() {
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Desktop Navigation Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-800/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="text-gray-900 dark:text-white text-sm font-bold">
                Seafood
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Academy</span>
            </div>
          </Link>

          {/* Nav Links - Center */}
          <nav className="flex items-center gap-8 flex-1 justify-center">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Головна
            </Link>
            <Link
              href="/academy"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith("/academy")
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Академія
            </Link>
            <Link
              href="/market"
              className={`text-sm font-medium transition-colors ${
                pathname === "/market"
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Маркет
            </Link>
            <Link
              href="/chat/create-chat"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith("/chat")
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              AI-наставник
            </Link>
          </nav>

          {/* Auth Buttons - Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-sm font-medium transition-all"
                  >
                    <User className="w-4 h-4" />
                    {user.name}
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Вихід
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-sm font-medium transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Увійти
                </motion.button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="hidden md:block h-16" />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
