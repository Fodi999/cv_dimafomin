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
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useUser } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  adminNavigationSchema,
  filterNavigation,
  getLocalizedLabel,
  type AdminRole,
  type FeatureFlag,
  type NavigationLevel,
  type NavigationAccent,
  type NavigationSection,
  type NavigationItem,
} from "@/lib/admin/navigation-schema";

/**
 * Admin Navigation - 2026 Hierarchical Design
 * 
 * 3 визуальных уровня:
 * - PRIMARY: Ключевые разделы (деньги, контроль) - выделены цветом
 * - SECONDARY: Операционные - обычный стиль
 * - SYSTEM: Системные - минимальный вес
 * 
 * Features:
 * - Сворачиваемые группы (localStorage)
 * - Убраны дублирующие заголовки
 * - Mobile-first (только PRIMARY по умолчанию)
 */

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { logout } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showAllSections, setShowAllSections] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasLossesToday, setHasLossesToday] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowAllSections(true); // Desktop: всегда показываем все
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    // Загружаем состояние сворачивания из localStorage
    const saved = localStorage.getItem("admin-nav-collapsed");
    if (saved) {
      try {
        setCollapsedSections(new Set(JSON.parse(saved)));
      } catch (e) {
        // Ignore
      }
    }
    // Desktop: показываем все секции по умолчанию
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setShowAllSections(true);
    }

    // Проверяем наличие потерь сегодня (для индикатора на "Списания")
    const checkLossesToday = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setHasLossesToday(false);
          return;
        }
        
        // Используем Next.js proxy route
        const response = await fetch(`/api/history/losses?days=1`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setHasLossesToday((data.events?.length || 0) > 0);
        } else {
          setHasLossesToday(false);
        }
      } catch (e) {
        // Ignore - не критично для UX, не показываем индикатор при ошибке
        setHasLossesToday(false);
      }
    };
    
    checkLossesToday();
    
    // Обновляем проверку каждые 5 минут
    const interval = setInterval(checkLossesToday, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = (href: string) => {
    console.log('[AdminNavigation] 🔗 Clicked link:', href);
    console.log('[AdminNavigation] 📍 Current pathname:', pathname);
    console.log('[AdminNavigation] 🎯 Navigating to:', href);
    setIsOpen(false);
    try {
      router.push(href);
      // Double check after navigation
      setTimeout(() => {
        console.log('[AdminNavigation] ✅ Navigation completed. Expected:', href);
      }, 100);
    } catch (error) {
      console.error('[AdminNavigation] ❌ Navigation error:', error);
      // Fallback to window.location if router.push fails
      window.location.href = href;
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
    localStorage.setItem("admin-nav-collapsed", JSON.stringify(Array.from(newCollapsed)));
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

  // Разделяем на уровни
  const primarySections = navigation.filter(s => s.level === "primary" || !s.level);
  const secondarySections = navigation.filter(s => s.level === "secondary");
  const systemSections = navigation.filter(s => s.level === "system");

  const isActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const getAccentColors = (accent?: NavigationAccent) => {
    switch (accent) {
      case "danger":
        return {
          icon: "text-red-600 dark:text-red-400",
          border: "border-red-500",
          bg: "bg-red-500/10 dark:bg-red-500/20",
        };
      case "success":
        return {
          icon: "text-green-600 dark:text-green-400",
          border: "border-green-500",
          bg: "bg-green-500/10 dark:bg-green-500/20",
        };
      case "purple":
        return {
          icon: "text-purple-600 dark:text-purple-400",
          border: "border-purple-500",
          bg: "bg-purple-500/10 dark:bg-purple-500/20",
        };
      default:
        return {
          icon: "text-orange-600 dark:text-orange-400",
          border: "border-orange-500",
          bg: "bg-orange-500/10 dark:bg-orange-500/20",
        };
    }
  };

  const renderSection = (section: NavigationSection, level: NavigationLevel) => {
    const isCollapsed = collapsedSections.has(section.id);
    const canCollapse = section.collapsible && section.items.length > 1;
    const sectionLabel = getLocalizedLabel(section, navLanguage);

    return (
      <div key={section.id} className="space-y-1">
        {/* Заголовок группы (только для collapsible групп с несколькими элементами) */}
        {section.collapsible && section.items.length > 1 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSection(section.id);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <span>{sectionLabel}</span>
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </button>
        )}

        {/* Элементы группы */}
        <AnimatePresence>
          {(!section.collapsible || !isCollapsed || section.items.length === 1) && (
            <motion.div
              initial={section.collapsible && section.items.length > 1 ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-0.5"
            >
              {section.items.map((item) => {
                const active = isActive(item.href);
                const itemLevel = item.level || section.level || "secondary";
                const accentColors = itemLevel === "primary" && item.accent
                  ? getAccentColors(item.accent)
                  : null;

                const Icon = item.icon;
                const isLosses = item.id === "losses";
                const showLossesBadge = isLosses && hasLossesToday && !active;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: itemLevel === "primary" ? 4 : 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLinkClick(item.href);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleLinkClick(item.href);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      active
                        ? accentColors
                          ? `${accentColors.bg} ${accentColors.icon}`
                          : itemLevel === "primary"
                          ? "bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : itemLevel === "primary"
                        ? "text-gray-900 dark:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                        : itemLevel === "secondary"
                        ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/30 dark:hover:bg-gray-800/30"
                    } ${
                      itemLevel === "primary" ? "pl-4" : ""
                    }`}
                  >
                    {/* Тонкий цветной border слева для PRIMARY (всегда видимый) */}
                    {itemLevel === "primary" && (
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full ${
                          active
                            ? accentColors
                              ? accentColors.border.replace("border-", "bg-")
                              : "bg-orange-500"
                            : accentColors
                            ? accentColors.border.replace("border-", "bg-").replace("-500", "-400/60")
                            : "bg-orange-400/40"
                        }`}
                      />
                    )}

                    {/* Активный индикатор (только для primary, более яркий) */}
                    {active && itemLevel === "primary" && (
                      <motion.div
                        layoutId="active-admin-indicator"
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full ${
                          accentColors?.border || "bg-orange-500"
                        }`}
                        style={{
                          background: accentColors?.border
                            ? undefined
                            : "linear-gradient(to bottom, rgb(249 115 22), rgb(239 68 68))",
                        }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      />
                    )}

                    {/* Иконка - более яркая для PRIMARY */}
                    <div
                      className={`flex-shrink-0 transition-colors ${
                        active && accentColors
                          ? accentColors.icon
                          : active && itemLevel === "primary"
                          ? "text-orange-600 dark:text-orange-400"
                          : itemLevel === "primary"
                          ? accentColors
                            ? accentColors.icon.replace("-600", "-500").replace("-400", "-500")
                            : "text-orange-500 dark:text-orange-400"
                          : itemLevel === "secondary"
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      <Icon className={`${itemLevel === "primary" ? "w-5 h-5" : "w-5 h-5"}`} />
                    </div>

                    {/* Лейбл - больший font-weight для PRIMARY */}
                    <span
                      className={`flex-1 text-sm ${
                        itemLevel === "primary"
                          ? "font-semibold"
                          : itemLevel === "secondary"
                          ? "font-medium"
                          : "font-normal text-xs"
                      }`}
                    >
                      {getLocalizedLabel(item, navLanguage)}
                    </span>

                    {/* Badge для "Списания" если есть потери сегодня (не активный) */}
                    {showLossesBadge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-red-500"
                      />
                    )}

                    {/* Стрелка для активного primary */}
                    {active && itemLevel === "primary" && (
                      <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={accentColors?.icon || "text-orange-600 dark:text-orange-400"}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ========== HEADER ========== */}
      <header className="fixed top-0 left-0 w-full h-16 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Burger + Logo */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/50 transition-all duration-200"
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
                    <X className="w-5 h-5 text-gray-900 dark:text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-gray-900 dark:text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Logo */}
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 font-bold hover:opacity-80 transition-opacity group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow"
              >
                <Shield className="w-5 h-5 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  ChefOS Admin
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  {userRole === "superadmin" ? "Superadmin" : "Administrator"}
                </span>
              </div>
            </Link>
          </div>

          {/* Right: User Info (Desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          )}
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* ========== SIDEBAR ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-800/50 z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Admin Info */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="pb-6 border-b border-gray-200/50 dark:border-gray-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      {/* Статус online (зеленая точка) */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-950 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            {userRole === "superadmin" ? "Superadmin" : "Admin"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PRIMARY Sections - Всегда видимы */}
              <div className="space-y-2">
                {primarySections.map((section) => renderSection(section, "primary"))}
              </div>

              {/* SECONDARY Sections */}
              <AnimatePresence>
                {showAllSections && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-4 border-t border-gray-200/50 dark:border-gray-800/50"
                  >
                    {secondarySections.map((section) => renderSection(section, "secondary"))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SYSTEM Sections */}
              <AnimatePresence>
                {showAllSections && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-4 border-t border-gray-200/50 dark:border-gray-800/50"
                  >
                    {systemSections.map((section) => renderSection(section, "system"))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile: Кнопка "Все разделы" */}
              {isMobile && (secondarySections.length > 0 || systemSections.length > 0) && (
                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                  <button
                    onClick={() => setShowAllSections(!showAllSections)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {showAllSections ? "Скрыть разделы" : "Все разделы"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showAllSections ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              )}

              {/* Logout */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-6 border-t border-gray-200/50 dark:border-gray-800/50"
              >
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                >
                  <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="font-medium text-sm">
                    {navLanguage === "ru" ? "Выход" : navLanguage === "pl" ? "Wyloguj" : "Logout"}
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
