"use client";

import { motion } from "framer-motion";
import { Users, ShoppingCart, Coins, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalUsers?: number;
  activeUsers?: number;
  totalOrders?: number;
  totalTokensEarned?: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  color,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  color: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ translateY: -4 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">{Icon}</div>
      {change && (
        <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
          {change}
        </span>
      )}
    </div>
    <p className="text-white/70 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

export function DashboardStats({
  totalUsers = 0,
  activeUsers = 0,
  totalOrders = 0,
  totalTokensEarned = 0,
}: DashboardStatsProps) {
  const activeUserPercent = totalUsers > 0 
    ? Math.round((activeUsers / totalUsers) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="Всего пользователей"
        value={totalUsers.toLocaleString()}
        change={`${activeUserPercent}% активны`}
        color="from-blue-500 to-cyan-500"
        index={0}
      />
      <StatCard
        icon={<ShoppingCart className="w-6 h-6" />}
        label="Всего заказов"
        value={totalOrders.toLocaleString()}
        change={"+12% этот месяц"}
        color="from-emerald-500 to-teal-500"
        index={1}
      />
      <StatCard
        icon={<Coins className="w-6 h-6" />}
        label="Выдано токенов"
        value={totalTokensEarned.toLocaleString()}
        change={"+8% эта неделя"}
        color="from-orange-500 to-red-500"
        index={2}
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="Выручка"
        value="$45,231"
        change={"+23% YoY"}
        color="from-purple-500 to-pink-500"
        index={3}
      />
    </div>
  );
}
