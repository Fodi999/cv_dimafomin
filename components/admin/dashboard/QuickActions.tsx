"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, TrendingDown, Wallet, Bot, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Quick Actions - Быстрые действия
 * 
 * Задачи владельца, а не админ-функции:
 * - Перейти в склад
 * - Проверить списания сегодня
 * - Посмотреть рекомендации
 * - Открыть экономику
 */

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

export function QuickActions() {
  const { t } = useLanguage();

  const actions: QuickAction[] = [
    {
      label: "Перейти в склад",
      href: "/admin/ingredients",
      icon: <Package className="w-4 h-4" />,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Проверить списания сегодня",
      href: "/admin/losses?days=1",
      icon: <TrendingDown className="w-4 h-4" />,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Посмотреть рекомендации",
      href: "/admin/assistant",
      icon: <Bot className="w-4 h-4" />,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Открыть экономику",
      href: "/admin/economy",
      icon: <Wallet className="w-4 h-4" />,
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Быстрые действия
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Решить проблему быстро
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {actions.map((action, idx) => (
            <Link key={idx} href={action.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className={action.color}>
                  {action.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {action.label}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
