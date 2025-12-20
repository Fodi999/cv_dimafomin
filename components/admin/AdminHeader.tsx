"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, LogOut, ChevronDown, Menu, X, Home, BookOpen, ShoppingBag, BrainCircuit, Sparkles, Refrigerator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface AdminHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: Array<{ id: string; label: string; icon?: any }>;
}

export function AdminHeader({ activeTab = "dashboard", onTabChange, tabs }: AdminHeaderProps) {
  const { user } = useUser();
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закрыть мобильное меню при смене URL
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  // Закрыть мобильное меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMobileMenu(false);
    };

    if (showMobileMenu) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  const defaultTabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "users", label: "👥 Користувачі" },
    { id: "orders", label: "🛒 Замовлення" },
    { id: "tokens", label: "🪙 Токіни" },
    { id: "settings", label: "⚙️ Налаштування" },
  ];

  const tabsToShow = tabs || defaultTabs;
  const adminName = user?.name || "Адміністратор";
  const adminEmail = user?.email || "admin@example.com";
  const adminAvatar = user?.avatar || null;

  if (!isMounted) return null;

  const adminNavLinks = [
    { id: "dashboard", label: "📊 Dashboard", href: "/admin/dashboard" },
    { id: "users", label: "👥 Користувачі", href: "/admin/users" },
    { id: "orders", label: "🛒 Замовлення", href: "/admin/orders" },
    { id: "tokens", label: "🪙 Токіни", href: "/admin/token-bank" },
    { id: "settings", label: "⚙️ Налаштування", href: "/admin/settings" },
  ];

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 shadow-md border-b-2 border-purple-600 dark:border-purple-500">
      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-900 dark:to-purple-800 border-b border-purple-700 dark:border-purple-600">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Burger Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg hover:bg-purple-500 transition-colors"
          >
            <AnimatePresence mode="wait">
              {showMobileMenu ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-white">
            <Sparkles className="w-5 h-5" />
            <span>Адмін</span>
          </Link>

          {/* Avatar */}
          <div className="relative w-10 h-10">
            {user?.avatar ? (
              <Image src={user.avatar} alt={user.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-600 dark:bg-purple-700 flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {(user?.name || "A")
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("")}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileMenu(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30" />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-900 z-40 shadow-xl overflow-y-auto">
              <div className="p-6 flex flex-col h-full">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Адмін Меню</h2>
                
                {/* Admin Navigation Links */}
                <nav className="space-y-2 flex-1">
                  {adminNavLinks.map((link) => (
                    <motion.div
                      key={link.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onTabChange?.(link.id);
                        router.push(link.href);
                        setShowMobileMenu(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
                        activeTab === link.id
                          ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-l-4 border-purple-600"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-4 border-transparent"
                      }`}
                    >
                      <span className="text-lg">{link.label.split(" ")[0]}</span>
                      <span className="font-medium text-sm">{link.label.slice(2)}</span>
                    </motion.div>
                  ))}
                </nav>

                {/* Divider */}
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

                {/* Profile Section in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt={user.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover border-2 border-purple-600" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                        {(user?.name || "A")
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word.charAt(0).toUpperCase())
                          .join("")}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowMobileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Вихід
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Admin Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {adminAvatar ? (
                <Image
                  src={adminAvatar}
                  alt={adminName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-600"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                  {adminName
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>

            {/* Profile Info */}
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                {adminName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {adminEmail}
              </p>
            </div>
          </div>

          {/* Right: Menu */}
          <div className="relative ml-auto flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium text-slate-700 dark:text-slate-300"
            >
              <span className="hidden sm:inline text-sm">🛡️ Адмін</span>
              <span className="sm:hidden">🛡️</span>
              <ChevronDown className={`w-4 h-4 transition ${showMenu ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Navigate to settings
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Параметри профіля</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Вихід</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - More Visible */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-slate-800 dark:to-slate-800/50 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-2 scrollbar-hide">
            {tabsToShow.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-t-lg transition ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border-b-2 border-purple-600"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
