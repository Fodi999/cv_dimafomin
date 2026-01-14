"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  LogOut,
  Refrigerator,
  Star,
  ChefHat,
  BrainCircuit,
  User as UserIcon,
  Settings,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotificationBell } from "@/components/NotificationBell";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  category?: string;
  categoryLabel?: string;
}

/**
 * User Navigation
 * 
 * Меню для авторизованных пользователей (не админов).
 * Показывается на страницах /app/*
 * 
 * Разделы:
 * - Кухня: Холодильник, Рецепти, AI Асистент, Мої рецепти
 * - Профіль: Налаштування та статистика
 */
export default function UserNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

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
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // 📍 Меню пользователя (без админских пунктов!)
  const navLinks: NavLink[] = [
    // ===== КУХНЯ =====
    {
      label: t?.navigation?.menu?.fridge?.label || "Fridge",
      href: "/fridge",
      icon: <Refrigerator className="w-5 h-5" />,
      description: t?.navigation?.menu?.fridge?.description || "Manage products and expiration dates",
      category: t?.navigation?.categories?.kitchen || "Kitchen",
      categoryLabel: `🍳 ${t?.navigation?.categories?.kitchen || "Kitchen"}`,
    },
    {
      label: t?.navigation?.menu?.cooking?.label || "Recipes",
      href: "/recipes",
      icon: <ChefHat className="w-5 h-5" />,
      description: t?.navigation?.menu?.cooking?.description || "Recipe catalog and inspiration",
      category: t?.navigation?.categories?.kitchen || "Kitchen",
    },
    {
      label: t?.navigation?.menu?.assistant?.label || "AI Assistant",
      href: "/assistant",
      icon: <BrainCircuit className="w-5 h-5" />,
      description: t?.navigation?.menu?.assistant?.description || "Smart kitchen help",
      category: t?.navigation?.categories?.kitchen || "Kitchen",
    },
    {
      label: t?.navigation?.menu?.myRecipes?.label || "My Recipes",
      href: "/recipes/saved",
      icon: <Star className="w-5 h-5" />,
      description: t?.navigation?.menu?.myRecipes?.description || "Your favorite collection",
      category: t?.navigation?.categories?.kitchen || "Kitchen",
    },

    // ===== ПРОФІЛЬ =====
    {
      label: t?.navigation?.menu?.profile?.label || "My Profile",
      href: "/profile",
      icon: <UserIcon className="w-5 h-5" />,
      description: t?.navigation?.menu?.profile?.description || "Settings and statistics",
      category: t?.navigation?.categories?.profile || "Profile",
      categoryLabel: `👤 ${t?.navigation?.menu?.profile?.label || "Profile"}`,
    },
  ];

  const isActive = (href: string): boolean => {
    // Точний матч або початок шляху
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ========== STICKY TOP BAR ========== */}
      <header className="fixed top-0 left-0 w-full h-16 z-40 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-800/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-start gap-3">
          {/* Burger Button */}
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

          {/* Logo */}
          <Link
            href="/fridge"
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
                ChefOS
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Food Academy</span>
            </div>
          </Link>

          {/* Right Side Icons */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* ========== OVERLAY ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* ========== SIDEBAR ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* User Info */}
              {user && (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Рівень</p>
                      <p className="font-bold text-sky-600 dark:text-sky-400">{user.level || 1}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">XP</p>
                      <p className="font-bold text-purple-600 dark:text-purple-400">{user.xp || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Токени</p>
                      <p className="font-bold text-amber-600 dark:text-amber-400">{user.chefTokens || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links - UNIFIED STYLE */}
              <nav className="space-y-0.5">
                {navLinks.map((link, idx) => {
                  const active = isActive(link.href);
                  
                  // Category divider (не перша ітерація + зміна категорії)
                  const showCategoryDivider =
                    idx > 0 &&
                    link.category &&
                    navLinks[idx - 1].category !== link.category;

                  return (
                    <div key={idx}>
                      {/* Category Divider */}
                      {showCategoryDivider && link.categoryLabel && (
                        <div className="my-4 px-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {link.categoryLabel}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                          </div>
                        </div>
                      )}
                      
                      {/* First element category label */}
                      {idx === 0 && link.categoryLabel && (
                        <div className="mb-3 px-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {link.categoryLabel}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                          </div>
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <motion.div
                          whileHover={{ x: 8 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleLinkClick(link.href)}
                          className={`relative flex flex-col px-3 py-2 rounded-lg transition-all cursor-pointer group ${
                            active
                              ? "bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-600 dark:text-sky-400 border-l-4 border-sky-500"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/50 border-l-4 border-transparent"
                          }`}
                        >
                          {/* Main row: icon + label */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`${
                                active
                                  ? "text-sky-600 dark:text-sky-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {link.icon}
                            </span>
                            <span className="font-medium text-[13px] flex-1">{link.label}</span>
                            
                            {/* Active indicator */}
                            {active && (
                              <motion.div
                                layoutId="active-user-indicator"
                                className="w-1.5 h-1.5 rounded-full bg-sky-500"
                                transition={{ type: "spring", damping: 20 }}
                              />
                            )}
                          </div>
                          
                          {/* Description */}
                          {link.description && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: idx * 0.05 + 0.1 }}
                              className={`text-[10px] mt-0.5 ml-7 leading-tight ${
                                active
                                  ? "text-sky-500/80 dark:text-sky-400/80"
                                  : "text-gray-500 dark:text-gray-500"
                              }`}
                            >
                              {link.description}
                            </motion.p>
                          )}
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Вийти</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
