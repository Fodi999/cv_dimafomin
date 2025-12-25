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
  LayoutDashboard,
  Package,
  Users,
  Activity,
  Puzzle,
  Settings,
  Shield,
  LogIn,
  Refrigerator,
  Star,
  GraduationCap,
  Library,
  Store,
  ChefHat,
  Coins,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { NotificationBell } from "@/components/NotificationBell";
import { CartIcon } from "@/components/CartIcon";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string; // 🆕 Добавляем описание
  badge?: string; // 🆕 Добавляем badge (например "Core")
  highlight?: boolean; // 🆕 Для выделения killer-feature
  category?: string; // 🆕 Категория для группировки
  categoryLabel?: string; // 🆕 Видимая метка категории (только для первого элемента группы)
}

export default function NavigationBurger() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { logout, isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal } = useAuth(); // 🔧 Используем global state
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закрыть меню при клике на ссылку
  const handleLinkClick = (href: string) => {
    console.log("🔵 NavigationBurger: Navigating to:", href);
    console.log("🔵 Current pathname:", pathname);
    setIsOpen(false);
    router.push(href);
    console.log("🔵 Router.push called for:", href);
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
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ ПРАВИЛЬНА НАВІГАЦІЯ (фокус на journey користувача)
  // Структура: Home → Lodówka → Gotowanie → AI → Przepisy → Akademia → ChefTokens → Profil
  const navLinks: NavLink[] = [
    // ===== START =====
    {
      label: "Strona główna",
      href: "/",
      icon: <Home className="w-5 h-5" />,
      description: "Przegląd wartości i funkcji",
      category: "Start",
      categoryLabel: "Start",
    },
    
    // ===== KUCHNIA (CORE) =====
    {
      label: "Lodówka",
      href: "/fridge",
      icon: <Refrigerator className="w-5 h-5" />,
      description: "Zarządzaj składnikami i datami",
      badge: "Core",
      category: "Kuchnia",
      categoryLabel: "Kuchnia (CORE)",
    },
    {
      label: "Gotowanie",
      href: "/recipes",
      icon: <ChefHat className="w-5 h-5" />,
      description: "Katalog przepisów i inspiracji",
      category: "Kuchnia",
    },
    {
      label: "AI Asystent",
      href: "/assistant",
      icon: <BrainCircuit className="w-5 h-5" />,
      description: "Inteligentna pomoc w kuchni",
      badge: "AI",
      highlight: true, // 🔥 Killer-feature
      category: "Kuchnia",
    },
    {
      label: "Moje przepisy",
      href: "/recipes/saved",
      icon: <Star className="w-5 h-5" />,
      description: "Twoja kolekcja ulubionych przepisów",
      category: "Kuchnia",
    },
    
    // ===== ROZWÓJ =====
    {
      label: "Akademia",
      href: "/academy",
      icon: <GraduationCap className="w-5 h-5" />,
      description: "Kursy, nauka i rozwój umiejętności",
      category: "Rozwój",
      categoryLabel: "Rozwój",
    },
    
    // ===== ЕКОНОМИЯ =====
    {
      label: "Tokens",
      href: "/tokens",
      icon: <Coins className="w-5 h-5" />,
      description: "Twoja waluta świadomej kuchni",
      category: "Ekonomia",
      categoryLabel: "Ekonomia",
    },
  ];

  const isActive = (href: string): boolean => {
    if (href === "/" && pathname === "/") return true;
    if (href === "/academy" && pathname.startsWith("/academy")) return true;
    if (href === "/assistant" && pathname.startsWith("/assistant")) return true;
    if (href === "/tokens" && pathname === "/tokens") return true;
    if (href === "/market" && pathname === "/market") return true;
    if (href === "/fridge" && pathname === "/fridge") return true;
    if (href === "/recipes" && pathname === "/recipes" && !pathname.startsWith("/recipes/saved")) return true;
    if (href === "/recipes/saved" && pathname.startsWith("/recipes/saved")) return true;
    return false;
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ========== STICKY TOP BAR - ОДИНАКОВАЯ НА ВСЕХ ЭКРАНАХ ========== */}
      <header className="fixed top-0 left-0 w-full h-16 z-40 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-800/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-start gap-3">
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
                Modern
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Food Academy</span>
            </div>
          </Link>

          {/* ===== NOTIFICATIONS + PROFILE - RIGHT SIDE ===== */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <CartIcon />
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
            <div className="p-4 flex flex-col h-full">
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                  Menu
                </h2>
                <div className="h-0.5 w-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full" />
              </div>

              {/* ===== NAVIGATION LINKS ===== */}
              <nav className="space-y-1 flex-1">
                {navLinks.map((link, idx) => {
                  // Show category divider when category changes
                  const prevLink = idx > 0 ? navLinks[idx - 1] : null;
                  const showCategoryDivider = prevLink && prevLink.category !== link.category;
                  
                  return (
                    <div key={link.href}>
                      {/* Category Header (з назвою секції) */}
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
                      
                      {/* Перший елемент теж має categoryLabel */}
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
                            isActive(link.href)
                              ? "bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-600 dark:text-sky-400 border-l-4 border-sky-500"
                              : link.highlight
                              ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-gray-700 dark:text-gray-200 hover:from-amber-500/20 hover:to-orange-500/20 border-l-4 border-amber-500/50"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/50 border-l-4 border-transparent"
                          }`}
                        >
                          {/* Main row: icon + label + badge */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`${
                                isActive(link.href)
                                  ? "text-sky-600 dark:text-sky-400"
                                  : link.highlight
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {link.icon}
                            </span>
                            <span className="font-medium text-[13px] flex-1">{link.label}</span>
                            
                            {/* Badge (Core, AI) */}
                            {link.badge && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.05 + 0.2, type: "spring" }}
                                className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold uppercase rounded-full shadow-sm"
                              >
                                {link.badge}
                              </motion.span>
                            )}
                            
                            {/* Active indicator */}
                            {isActive(link.href) && (
                              <motion.div
                                layoutId="active-indicator"
                                className="w-1.5 h-1.5 rounded-full bg-sky-500"
                                transition={{ type: "spring", damping: 20 }}
                              />
                            )}
                          </div>
                          
                          {/* Description (тільки 2 рядки: назва + опис) */}
                          {link.description && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: idx * 0.05 + 0.1 }}
                              className={`text-[10px] mt-0.5 ml-7 leading-tight ${
                                isActive(link.href)
                                  ? "text-sky-500/80 dark:text-sky-400/80"
                                  : link.highlight
                                  ? "text-amber-600/70 dark:text-amber-400/70"
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

              {/* ===== ADMIN SECTION ===== */}
              {user && user.role === "admin" && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent my-3" />
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
                      <Shield size={14} />
                      Адміністрація
                    </div>
                    <nav className="space-y-0.5">
                      {[
                        { label: "Панель керування", href: "/admin/dashboard", Icon: LayoutDashboard },
                        { label: "Замовлення", href: "/admin/orders", Icon: Package },
                        { label: "Користувачі", href: "/admin/users", Icon: Users },
                        { label: "Рецепти", href: "/admin/recipes", Icon: BookOpen },
                        { label: "Активність", href: "/admin/activity-log", Icon: Activity },
                        { label: "Інтеграції", href: "/admin/integrations", Icon: Puzzle },
                        { label: "Налаштування", href: "/admin/settings", Icon: Settings },
                      ].map((link, idx) => (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                        >
                          <motion.div
                            whileHover={{ x: 8 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLinkClick(link.href)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[13px] ${
                              pathname === link.href
                                ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-l-4 border-purple-500"
                                : "text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 dark:hover:bg-purple-900/20 border-l-4 border-transparent"
                            }`}
                          >
                            <link.Icon size={16} />
                            <span className="font-medium">{link.label}</span>
                            {pathname === link.href && (
                              <motion.div
                                layoutId="admin-active"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500"
                                transition={{ type: "spring", damping: 20 }}
                              />
                            )}
                          </motion.div>
                        </motion.div>
                      ))}
                    </nav>
                  </div>
                </>
              )}

              {/* ===== DIVIDER ===== */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent my-3" />

              {/* ===== SMART PROFILE BUTTON ===== */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                {user ? (
                  // Logged in user - Profile card + Logout
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleLinkClick(user.role === "admin" ? "/admin/dashboard" : "/profile")}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border-2 border-sky-500/50 hover:border-sky-500 cursor-pointer transition-all"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-sky-500/50"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          Mój profil
                        </p>
                      </div>
                      <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                    </motion.div>

                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all font-medium text-[13px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Wyloguj
                    </motion.button>
                  </>
                ) : (
                  // Not logged in - Login + Register buttons
                  <>
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openAuthModal("login")}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium transition-all text-[13px]"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Zaloguj się
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openAuthModal("register")}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 font-medium transition-all text-[13px]"
                    >
                      <User className="w-3.5 h-3.5" />
                      Zarejestruj się
                    </motion.button>
                  </>
                )}
              </motion.div>

              {/* ===== DIVIDER ===== */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent my-3" />

              {/* ===== FOOTER ===== */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-2 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="text-center mb-2">
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 leading-tight">
                    <span className="block font-semibold text-gray-700 dark:text-gray-300 mb-0.5">
                      Wersja AI
                    </span>
                    Dima Fomin v2.0
                  </p>
                </div>

                {/* AI Signature */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Powered by AI Academy</span>
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== AUTH MODAL ========== */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal}
        initialTab={authModalTab}
        onSuccess={() => router.push("/assistant")}
      />
    </>
  );
}
