"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Shield,
  BrainCircuit,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  adminNavigationSchema,
  filterNavigation,
  getLocalizedLabel,
  type AdminRole,
  type FeatureFlag,
} from "@/lib/admin/navigation-schema";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  category?: string;
  categoryLabel?: string;
}

/**
 * Admin Navigation - UNIFIED STYLE
 * 
 * Меню для администраторов с:
 * - Burger menu + overlay
 * - Role-based access control
 * - Категорированная навигация
 * - Единый стиль с User/Landing навигацией
 */
export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { logout } = useAuth();
  const { language } = useLanguage();
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

  // Escape to close
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

  // Get admin navigation based on role
  const userRole: AdminRole = (user?.role as AdminRole) || "admin";
  const enabledFeatures: FeatureFlag[] = [];
  
  const navigation = filterNavigation(
    adminNavigationSchema,
    userRole,
    enabledFeatures
  );

  const navLanguage = language === "ru" ? "ru" : language === "pl" ? "pl" : "en";

  // Transform schema to flat array with categories
  const navLinks: NavItem[] = [];
  navigation.forEach((section) => {
    const categoryLabel = getLocalizedLabel(section, navLanguage);
    
    section.items.forEach((item, idx) => {
      const Icon = item.icon;
      navLinks.push({
        label: getLocalizedLabel(item, navLanguage),
        href: item.href,
        icon: <Icon className="w-5 h-5" />,
        category: section.id,
        categoryLabel: idx === 0 ? categoryLabel : undefined,
      });
    });
  });

  const isActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ========== HEADER ========== */}
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
            href="/admin/dashboard"
            className="flex items-center gap-2 font-bold text-sm tracking-tight hover:opacity-80 transition group"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg"
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="text-gray-900 dark:text-white text-sm font-bold">
                Admin Panel
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {userRole === "superadmin" ? "Superadmin" : "Administrator"}
              </span>
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
              {/* Admin Info */}
              {user && (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {userRole === "superadmin" ? "SUPERADMIN" : "ADMIN"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links - UNIFIED STYLE */}
              <nav className="space-y-0.5">
                {navLinks.map((link, idx) => {
                  const active = isActive(link.href);

                  return (
                    <div key={idx}>
                      {/* Category Label (only for first in category) */}
                      {link.categoryLabel && (
                        <div className="mb-3 px-3 mt-4 first:mt-0">
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
                          className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer group ${
                            active
                              ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600 dark:text-red-400 border-l-4 border-red-500"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/50 border-l-4 border-transparent"
                          }`}
                        >
                          <span
                            className={`${
                              active
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {link.icon}
                          </span>
                          <span className="font-medium text-[13px] flex-1">{link.label}</span>

                          {/* Active indicator */}
                          {active && (
                            <motion.div
                              layoutId="active-admin-indicator"
                              className="w-1.5 h-1.5 rounded-full bg-red-500"
                              transition={{ type: "spring", damping: 20 }}
                            />
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
                  <span className="font-medium">
                    {navLanguage === "ru" ? "Выход" : navLanguage === "pl" ? "Wyloguj" : "Logout"}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
