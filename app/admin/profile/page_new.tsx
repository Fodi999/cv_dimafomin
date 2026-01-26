"use client";

import { useState } from "react";
import { useUser } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { 
  Package, 
  ChefHat, 
  DollarSign,
  TrendingUp,
  Settings,
  Users,
  Warehouse
} from "lucide-react";
import { motion } from "framer-motion";
import { ProfileIdentity } from "@/components/profile/ProfileIdentity";
import { BusinessSnapshot } from "@/components/profile/BusinessSnapshot";
import { ProgressIntelligence } from "@/components/profile/ProgressIntelligence";
import { ProfileActions } from "@/components/profile/ProfileActions";

/**
 * Admin Profile - Control Center владельца бизнеса
 * 
 * Структура:
 * 1. Identity - кто ты (super_admin)
 * 2. Business Snapshot - dashboard бизнеса
 * 3. Progress & Intelligence - рост + инсайты
 * 4. Recommended Actions - что делать дальше
 * 
 * БЕЗ settings (это в /admin/settings)
 * БЕЗ social (это B2B, не B2C)
 */
export default function AdminProfile() {
  const { user } = useUser();
  const router = useRouter();

  // Mock data - в реальности из API
  const [businessMetrics] = useState({
    savedMoney: 3420.75,
    savedPercentage: 18,
    ingredientsInStock: 156,
    recipesCreated: 48,
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Вы должны быть авторизованы</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        
        {/* 🧑 Block 1: Identity */}
        <ProfileIdentity
          name={user.name || "Admin"}
          email={user.email || ""}
          avatar={user.avatar}
          role="super_admin"
          level={user.level || 1}
          chefTokens={user.chefTokens || 0}
        />

        {/* 💼 Block 2: Business Snapshot - ADMIN VERSION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-500/20 rounded-lg">
              <Warehouse className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-bold text-white">
              💼 Центр управления бизнесом
            </h3>
          </div>

          {/* PRIMARY - Cost Savings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/40 p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-300/80 font-medium">
                  💰 Оптимизация затрат
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-full">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-300">
                    +{businessMetrics.savedPercentage}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  {businessMetrics.savedMoney.toFixed(2)}
                </span>
                <span className="text-lg text-emerald-300 font-semibold">
                  PLN
                </span>
              </div>
              
              <p className="text-[10px] text-emerald-300/60 mt-1">
                сэкономлено за месяц
              </p>
            </div>
          </motion.div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Ингредиенты
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {businessMetrics.ingredientsInStock}
              </div>
              <p className="text-[9px] text-gray-500 mt-0.5">
                на складе
              </p>
            </motion.div>

            {/* Recipes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="w-4 h-4 text-violet-400" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Рецепты
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {businessMetrics.recipesCreated}
              </div>
              <p className="text-[9px] text-gray-500 mt-0.5">
                создано
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* 📈 Block 3: Progress & Intelligence */}
        <ProgressIntelligence
          level={user.level || 1}
          xp={4800}
          maxXp={10000}
          communityInsights={[
            "Владельцы ресторанов на вашем уровне фокусируются на автоматизации закупок",
            "Средняя оптимизация затрат в вашем сегменте: 15-20%",
            "Лучшее время внедрить контроль себестоимости блюд"
          ]}
        />

        {/* ⚡ Block 4: Recommended Actions - ADMIN VERSION */}
        <ProfileActions
          mode="admin"
          actions={[
            {
              id: '1',
              icon: <Package className="w-4 h-4 text-cyan-400" />,
              title: 'Проверить склад',
              description: 'Обновить цены на 12 ингредиентах',
              href: '/admin/ingredients',
              variant: 'primary'
            },
            {
              id: '2',
              icon: <DollarSign className="w-4 h-4 text-gray-400" />,
              title: 'Проанализировать экономику',
              description: 'Посмотреть отчет по себестоимости',
              href: '/admin/economy',
            },
            {
              id: '3',
              icon: <ChefHat className="w-4 h-4 text-gray-400" />,
              title: 'Создать новый рецепт',
              description: 'Расширить меню с оптимальной маржой',
              href: '/admin/recipes/create',
            },
          ]}
        />

        {/* Settings Link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => router.push('/admin/settings')}
          className="w-full flex items-center justify-center gap-2 p-3 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all text-sm"
        >
          <Settings className="w-4 h-4" />
          <span>Настройки системы</span>
        </motion.button>

      </div>
    </div>
  );
}
