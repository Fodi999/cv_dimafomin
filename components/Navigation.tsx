"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  LogOut,
  Home,
  BookOpen,
  FileText,
  Gem,
  ShoppingBag,
  User,
  MessageSquare,
  Brain,
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [tokenBalance] = useState(1250);

  const navLinks: NavLink[] = [
    { label: "Главная", href: "/", icon: <Home className="w-4 h-4" /> },
    { label: "Академия", href: "/academy", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Курсы", href: "/academy/feed", icon: <FileText className="w-4 h-4" /> },
    { label: "Маркет", href: "/market", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Профиль", href: "/profile", icon: <User className="w-4 h-4" /> },
  ];

  const isActive = (href: string): boolean => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Navigation - Uber-AI стиль */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-b border-white/10 transition-all duration-500 dark:bg-neutral-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-lg tracking-tight hover:opacity-80 transition group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <Brain className="w-5 h-5 text-sky-400" />
              <div className="flex flex-col leading-none">
                <span className="text-neutral-900 dark:text-white">Seafood</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Academy</span>
              </div>
            </motion.div>
          </Link>

          {/* Основные ссылки - скрыто на мобилке */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all relative group ${
                    isActive(link.href)
                      ? "text-sky-500 dark:text-sky-400"
                      : "text-neutral-700 dark:text-neutral-200 hover:text-sky-500 dark:hover:text-sky-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.icon && <span className="text-base">{link.icon}</span>}
                    {link.label}
                  </span>

                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-sky-500 to-teal-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className="absolute inset-0 rounded-lg bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </motion.button>
              </Link>
            ))}

            {/* Кнопка AI Mentor - выделена */}
            <Link href="/create-chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Спросить AI</span>
              </motion.button>
            </Link>
          </div>

          {/* Правая панель */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Языковой переключатель */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-200 dark:hover:bg-sky-900/60 transition"
            >
              UA
            </motion.button>

            {/* Токены виджет */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-1.5 text-sm text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition border border-sky-200/50 dark:border-sky-800/50"
            >
              <Gem className="w-4 h-4" />
              <span className="font-semibold">{tokenBalance}</span>
            </motion.div>

            {/* Avatar */}
            <Link href="/profile">
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%230EA5E9'/%3E%3Ctext x='20' y='24' font-size='18' font-weight='bold' fill='white' text-anchor='middle'%3EDF%3C/text%3E%3C/svg%3E"
                alt="Avatar"
                className="w-8 h-8 rounded-full border-2 border-sky-400 shadow-sm hover:shadow-md transition cursor-pointer"
              />
            </Link>
          </div>

          {/* Мобильное меню */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
              >
                <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
              </motion.button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Меню</h2>
              </div>

              <div className="space-y-1 p-4">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={link.href}>
                      <motion.button
                        onClick={() => setIsOpen(false)}
                        whileHover={{ x: 4 }}
                        whileTap={{ x: 2 }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                          isActive(link.href)
                            ? "bg-sky-500 text-white font-semibold shadow-md"
                            : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {link.icon && <span className="text-lg">{link.icon}</span>}
                        <span>{link.label}</span>
                        {isActive(link.href) && <span className="ml-auto w-2 h-2 rounded-full bg-white" />}
                      </motion.button>
                    </Link>
                  </motion.div>
                ))}

                {/* AI Mentor в мобильном меню */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <Link href="/create-chat">
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      whileHover={{ x: 4 }}
                      whileTap={{ x: 2 }}
                      className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 text-white font-semibold shadow-md hover:shadow-lg transition flex items-center gap-3 mt-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Спросить AI</span>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-800 mx-4 my-4" />

              <div className="p-4 space-y-4">
                {/* Токены в мобильном */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200/50 dark:border-sky-800/50"
                >
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">ChefTokens</p>
                  <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{tokenBalance}</p>
                  </div>
                </motion.div>

                {/* Языковой переключатель в мобильном */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2.5 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-sm font-semibold hover:bg-sky-200 dark:hover:bg-sky-900/60 transition"
                >
                  Українська
                </motion.button>

                {/* Выход */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Выход
                </motion.button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer для контента */}
      <div className="h-16" />
    </>
  );
}
