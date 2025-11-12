"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AdminSidebarProps {
  currentPage?: "dashboard" | "users" | "orders";
  onLogout?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Панель", icon: LayoutDashboard, href: "/admin/dashboard" },
  { id: "users", label: "Пользователи", icon: Users, href: "/admin/users" },
  { id: "orders", label: "Заказы", icon: ShoppingCart, href: "/admin/orders" },
  { id: "analytics", label: "Аналитика", icon: BarChart3, href: "/admin/analytics" },
  { id: "settings", label: "Настройки", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar({
  currentPage = "dashboard",
  onLogout,
}: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gray-900 dark:text-white" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="lg:translate-x-0 fixed lg:static left-0 top-0 w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white shadow-xl overflow-y-auto z-30"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <Link href="/admin/dashboard">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              🔧 Admin
            </h2>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-600 rounded-lg -z-10"
                    />
                  )}
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Выход
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
        />
      )}
    </>
  );
}
