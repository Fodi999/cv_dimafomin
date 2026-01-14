"use client";

import { motion } from "framer-motion";
import { StatsCard } from "../StatsCard";
import type { UserProfile } from "@/lib/profile-types";
import { Award, Zap, BarChart3, TrendingUp, ShoppingBag, Package, Check, Loader2, Trash2 } from "lucide-react";
import { composite } from "@/lib/design-tokens";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface OverviewSectionProps {
  userProfile: UserProfile;
  user: {
    chefTokens?: number;
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  translations: Record<string, string>;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
  retryCount: number;
}

export function OverviewSection({
  userProfile,
  user,
  translations,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
  retryCount,
}: OverviewSectionProps) {
  const { cartItems, removeFromCart, totalPrice } = useCart();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const level = 5;
  const xp = 2450;
  const maxXp = 5000;
  const balance = user?.chefTokens || 0;
  const coursesCount = 3;
  const xpPercent = (xp / maxXp) * 100;

  return (
    <div>
      {/* STATS + PROGRESS */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* STATISTICS + PROGRESS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
        {/* STATISTICS - 4 Cards in 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          <StatsCard
            icon={<Award className="w-8 h-8" />}
            label="Уровень"
            value={level}
            color="purple"
            index={0}
          />
          <StatsCard
            icon={<Zap className="w-8 h-8" />}
            label="Опыт"
            value={`${xp}`}
            change={`/ ${maxXp}`}
            color="orange"
            index={1}
          />
          <StatsCard
            icon={<BarChart3 className="w-8 h-8" />}
            label="Баланс"
            value={balance.toLocaleString()}
            color="green"
            index={2}
          />
          <StatsCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Курсы"
            value={coursesCount}
            color="blue"
            index={3}
          />
        </div>

        {/* PROGRESS BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl p-4 sm:p-5 border border-violet-500/10 transition-all"
          style={{ 
            background: "rgba(139, 92, 246, 0.12)",
            backdropFilter: 'blur(18px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <div>
              <h3 className="font-semibold text-xs text-white/80 uppercase tracking-tight mb-1">
                Прогресс к уровню {level + 1}
              </h3>
              <p className="text-lg sm:text-xl font-bold text-white">
                {xp.toLocaleString()} / {maxXp.toLocaleString()}
              </p>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-violet-300">
              {Math.round(xpPercent)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-700/40 rounded-full overflow-hidden border border-gray-700/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-gradient-to-r from-violet-500 via-violet-600 to-violet-400 rounded-full"
              style={{ boxShadow: '0 0 16px rgba(139, 92, 246, 0.8)' }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Ещё {maxXp - xp} XP до следующего уровня
          </p>
        </motion.div>
        </motion.div>
      </div>

      {/* PURCHASES SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className={`${composite.card.container} ${composite.card.hover} overflow-hidden mt-6 lg:mt-8`}
        id="purchases"
      >
        <div className="px-4 sm:px-6 py-4 border-b border-gray-700/30 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Кошик</h3>
          <span className="ml-auto px-3 py-1 bg-gray-700/50 rounded-full text-sm font-semibold text-gray-300">
            {cartItems.length}
          </span>
        </div>
        <div className="px-4 sm:px-6 py-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-500" />
              <p className="text-gray-400 text-sm">Кошик порожній</p>
              <p className="text-gray-500 text-xs mt-1">Додайте рецепти з Ринку</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="rounded-lg p-3 sm:p-4 border border-gray-700/30 hover:border-blue-500/50 transition-all cursor-pointer hover:bg-gray-800/30 relative group"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Delete Button */}
                    {hoveredItem === item.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors z-10"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </motion.button>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Image */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm sm:text-base line-clamp-2 mb-1.5">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            <span>{item.difficulty}</span>
                          </div>
                          <p className="text-sm sm:text-base font-bold text-blue-300">
                            {item.price} CT
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 sm:p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-white">Всього:</span>
                  <span className="text-2xl font-bold text-blue-300">{totalPrice} CT</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Оформити замовлення
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/market'}
                    className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Продовжити покупки
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
