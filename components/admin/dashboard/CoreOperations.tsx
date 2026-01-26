"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, TrendingDown, Wallet, Bot, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFridgeLosses } from "@/hooks/useFridgeLosses";

/**
 * Core Operations - Операционное ядро
 * 
 * Карточки для ключевых разделов:
 * - Склад
 * - Списания
 * - Экономика
 * - Ассистент
 * 
 * Использует те же цвета и иконки что и sidebar
 */

interface CoreCardProps {
  title: string;
  href: string;
  icon: React.ReactNode;
  accent: "orange" | "red" | "green" | "purple";
  stats?: {
    label: string;
    value: string | number;
  };
  badge?: string | number;
}

function CoreCard({ title, href, icon, accent, stats, badge }: CoreCardProps) {
  const accentColors = {
    orange: {
      border: "border-orange-500/30",
      bg: "bg-orange-500/5 dark:bg-orange-500/10",
      icon: "text-orange-600 dark:text-orange-400",
      hover: "hover:bg-orange-500/10 dark:hover:bg-orange-500/20",
      borderActive: "border-orange-500",
    },
    red: {
      border: "border-red-500/30",
      bg: "bg-red-500/5 dark:bg-red-500/10",
      icon: "text-red-600 dark:text-red-400",
      hover: "hover:bg-red-500/10 dark:hover:bg-red-500/20",
      borderActive: "border-red-500",
    },
    green: {
      border: "border-green-500/30",
      bg: "bg-green-500/5 dark:bg-green-500/10",
      icon: "text-green-600 dark:text-green-400",
      hover: "hover:bg-green-500/10 dark:hover:bg-green-500/20",
      borderActive: "border-green-500",
    },
    purple: {
      border: "border-purple-500/30",
      bg: "bg-purple-500/5 dark:bg-purple-500/10",
      icon: "text-purple-600 dark:text-purple-400",
      hover: "hover:bg-purple-500/10 dark:hover:bg-purple-500/20",
      borderActive: "border-purple-500",
    },
  };

  const colors = accentColors[accent];

  return (
    <Link href={href} className="block group">
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`relative h-full rounded-xl border-2 ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-200 cursor-pointer overflow-hidden`}
      >
        {/* Акцентная полоса слева */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.borderActive.replace("border-", "bg-")}`} />
        
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${colors.bg} ${colors.icon}`}>
              {icon}
            </div>
            {badge && (
              <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
                {badge}
              </span>
            )}
          </div>
          
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          
          {stats && (
            <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.label}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {stats.value}
                </span>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            <span>Открыть</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </motion.div>
    </Link>
  );
}

export function CoreOperations() {
  const { t } = useLanguage();
  const { losses = [], summary = { totalLoss: 0, products: 0, avgLoss: 0 }, loading, error } = useFridgeLosses(1); // Потери за сегодня
  
  const hasLossesToday = losses.length > 0;
  
  // Безопасное получение значения потерь
  const lossesValue = summary?.totalLoss || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Склад */}
      <CoreCard
        title="Склад"
        href="/admin/ingredients"
        icon={<Package className="w-6 h-6" />}
        accent="orange"
        stats={{
          label: "Ингредиентов",
          value: "—", // TODO: добавить реальные данные
        }}
      />

      {/* Списания */}
      <CoreCard
        title="Списания"
        href="/admin/losses"
        icon={<TrendingDown className="w-6 h-6" />}
        accent="red"
        stats={{
          label: "За сегодня",
          value: loading ? "..." : error ? "—" : `${lossesValue.toFixed(0)} PLN`,
        }}
        badge={hasLossesToday ? losses.length : undefined}
      />

      {/* Экономика */}
      <CoreCard
        title="Экономика"
        href="/admin/economy"
        icon={<Wallet className="w-6 h-6" />}
        accent="green"
        stats={{
          label: "Маржа",
          value: "—", // TODO: добавить реальные данные
        }}
      />

      {/* Ассистент */}
      <CoreCard
        title="Ассистент"
        href="/admin/assistant"
        icon={<Bot className="w-6 h-6" />}
        accent="purple"
        stats={{
          label: "Рекомендаций",
          value: "—", // TODO: добавить реальные данные
        }}
      />
    </div>
  );
}
