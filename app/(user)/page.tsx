"use client";

import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Refrigerator,
  ChefHat,
  BrainCircuit,
  Star,
  GraduationCap,
  Coins,
  TrendingUp,
  Award,
  Store,
  AlertTriangle,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";

/**
 * User Dashboard
 * 
 * Главная страница пользовательского приложения.
 * Показывает:
 * - Приветствие
 * - Быстрый доступ к основным функциям
 * - Статистика (уровень, XP, токены)
 */
export default function AppDashboard() {
  const { user } = useUser();
  const { t } = useLanguage();

  const quickActions = [
    {
      title: "Холодильник",
      description: "Управляй продуктами и датами",
      icon: Refrigerator,
      href: "/fridge",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Рецепты",
      description: "Каталог и вдохновение",
      icon: ChefHat,
      href: "/recipes",
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "AI Ассистент",
      description: "Розумна кухонна допомога",
      icon: BrainCircuit,
      href: "/assistant",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Мої рецепти",
      description: "Твоя колекція улюблених",
      icon: Star,
      href: "/recipes/saved",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Маркет",
      description: "Купуй та продавай рецепти",
      icon: Store,
      href: "/market",
      color: "from-rose-500 to-pink-500",
    },
    {
      title: "Академія",
      description: "Курси та навчання",
      icon: GraduationCap,
      href: "/academy",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Токени",
      description: "Валюта свідомої кухні",
      icon: Coins,
      href: "/tokens",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Втрати",
      description: "Аналіз витрат продуктів",
      icon: AlertTriangle,
      href: "/losses",
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Профіль",
      description: "Налаштування та статистика",
      icon: UserIcon,
      href: "/profile",
      color: "from-gray-500 to-slate-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Приветствие */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Привіт, {user?.name || "Chef"}! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Вітаємо у твоєму кухонному просторі
        </p>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-sky-200 dark:border-sky-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-medium text-sky-900 dark:text-sky-100">
              Рівень
            </span>
          </div>
          <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">
            {user?.level || 1}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Досвід (XP)
            </span>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {user?.xp || 0}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
              ChefTokens
            </span>
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {user?.chefTokens || 0}
          </p>
        </motion.div>
      </div>

      {/* Быстрые действия */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Швидкий доступ
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link
              href={action.href}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all hover:border-transparent hover:shadow-xl hover:scale-105">
                {/* Gradient background на hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} mb-4`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
