"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { Edit2, Shield } from "lucide-react";
import { AdminSearch } from "./AdminSearch";

export function AdminDashboardHeader() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const adminName = user?.name || "Адміністратор";
  const adminEmail = user?.email || "admin@example.com";
  const adminAvatar = user?.avatar || null;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Пошук:", query);
    // TODO: реализовать поиск по пользователям, заказам и т.д.
  };

  return (
    <div className="mb-8">
      {/* Top Section: Avatar + Name + Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            {adminAvatar ? (
              <Image
                src={adminAvatar}
                alt={adminName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-3 border-purple-600 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg border-3 border-purple-600">
                {adminName
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("")}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white dark:border-slate-900 shadow-md"></div>
          </div>

          {/* Name and Email */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {adminName}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{adminEmail}</p>
            <div className="flex items-center gap-1 mt-2">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Адміністратор</span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-lg"
        >
          <Edit2 className="w-4 h-4" />
          <span>Редагувати</span>
        </motion.button>
      </div>

      {/* Welcome Text */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-lg p-6 border border-purple-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Панель адміністратора
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Вітаємо! Тут ви можете керувати користувачами, замовленнями та статистикою.
        </p>

        {/* Search Bar */}
        <AdminSearch 
          onSearch={handleSearch}
          onClear={() => setSearchQuery("")}
        />
      </div>
    </div>
  );
}
