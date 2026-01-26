"use client";

import { motion } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CustomerAction {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  variant?: 'primary' | 'secondary';
  reward?: string;
}

interface CustomerActionsProps {
  actions: CustomerAction[];
}

/**
 * ⚡ Recommended Actions - CUSTOMER VERSION
 * 
 * Conversion-блок, не просто информация.
 * 
 * ✅ ПРАВИЛЬНО:
 * - Сделать первый повторный заказ
 * - Оценить блюдо и получить +50 XP
 * - Попробовать блюдо со скидкой
 * 
 * ❌ НЕ:
 * - Проверить холодильник
 * - Добавить продукты
 * - Контролировать себестоимость
 */
export function CustomerActions({ actions }: CustomerActionsProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-amber-500/20 rounded-lg">
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <h3 className="text-sm font-bold text-white">
          ⚡ Рекомендуемые действия
        </h3>
      </div>

      {/* Actions List */}
      <div className="space-y-2">
        {actions.map((action, index) => {
          const isPrimary = action.variant === 'primary';
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              onClick={() => router.push(action.href)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg border transition-all
                hover:scale-[1.02] active:scale-[0.98]
                ${isPrimary 
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 hover:border-amber-400/60' 
                  : 'bg-gray-800/60 border-gray-700/50 hover:border-gray-600/60'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                p-2 rounded-lg flex-shrink-0
                ${isPrimary 
                  ? 'bg-amber-500/20' 
                  : 'bg-gray-700/50'
                }
              `}>
                {action.icon}
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className={`
                    text-sm font-semibold
                    ${isPrimary ? 'text-amber-200' : 'text-white'}
                  `}>
                    {action.title}
                  </h4>
                  {action.reward && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                      {action.reward}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {action.description}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className={`
                w-4 h-4 flex-shrink-0
                ${isPrimary ? 'text-amber-400' : 'text-gray-500'}
              `} />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
