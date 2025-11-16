"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, ShoppingCart, DollarSign, Eye, ArrowUp } from "lucide-react";
import { AdminProfileEditPanel } from "@/components/admin/AdminProfileEditPanel";

// Simple Chart Components (Recharts alternative using basic SVG)
const SimpleLineChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const width = 300;
  const height = 150;
  const padding = 20;
  const points = data.map((value, i) => ({
    x: padding + (i * (width - 2 * padding)) / (data.length - 1),
    y: height - padding - (value / max) * (height - 2 * padding),
  }));

  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
      <path d={pathData} stroke="#9333ea" strokeWidth="2" fill="none" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#9333ea" />
      ))}
    </svg>
  );
};

const SimpleBarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value));
  const width = 300;
  const height = 200;
  const barWidth = (width - 40) / data.length;
  const padding = 20;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
      {data.map((item, i) => {
        const barHeight = (item.value / max) * (height - padding * 2);
        const x = padding + i * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth * 0.8} height={barHeight} fill="#3b82f6" rx="4" />
            <text x={x + barWidth * 0.4} y={height - 5} textAnchor="middle" fontSize="12" fill="#64748b">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const SimplePieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 60;
  const cx = 100;
  const cy = 100;

  let currentAngle = -90;
  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { pathData, color: item.color };
  });

  return (
    <svg width="100%" height={200} viewBox="0 0 200 200" className="w-full">
      {slices.map((slice, i) => (
        <path key={i} d={slice.pathData} fill={slice.color} />
      ))}
      <circle cx={cx} cy={cy} r="30" fill="white" />
    </svg>
  );
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("7days");

  const stats = [
    {
      title: "Всього замовлень",
      value: "2,451",
      change: "+12.5%",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Дохід",
      value: "$12,540",
      change: "+8.2%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Користувачів",
      value: "3,847",
      change: "+5.1%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Переглядів",
      value: "48,291",
      change: "+24.3%",
      icon: Eye,
      color: "text-amber-600",
    },
  ];

  const chartData = {
    revenue: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
    orders: [65, 59, 80, 81, 56, 55, 40],
    users: [12, 19, 3, 5, 2, 3, 8],
  };

  const monthlyRevenue = [
    { label: "Jan", value: 4000 },
    { label: "Feb", value: 3000 },
    { label: "Mar", value: 5000 },
    { label: "Apr", value: 4500 },
    { label: "May", value: 6000 },
    { label: "Jun", value: 5500 },
  ];

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  const userDistribution = [
    { label: "Free", value: 2000, color: "#64748b" },
    { label: "Premium", value: 1200, color: "#3b82f6" },
    { label: "Admin", value: 100, color: "#9333ea" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Панель керування
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Ласкаво просимо назад! Ось огляд вашої системи.
          </p>
        </div>
        <div className="flex gap-2">
          {["24hours", "7days", "30days"].map((range) => (
            <Button
              key={range}
              onClick={() => setDateRange(range)}
              variant={dateRange === range ? "default" : "outline"}
              size="sm"
              className={dateRange === range ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
            >
              {range === "24hours" ? "24 години" : range === "7days" ? "7 днів" : "30 днів"}
            </Button>
          ))}
        </div>
      </div>

      {/* Admin Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
                <span className="text-4xl font-bold">ДА</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Дмитро Авраменко
                </h2>
                <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                  🔑 Адміністратор
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                dmitro@sushichef.com
              </p>
              
              {/* Profile Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Роль</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">Адміністратор</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Статус</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">🟢 Активний</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Приєднався</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">15 січня 2024</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Останній вхід</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">Сьогодні, 14:32</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <Button 
                  onClick={() => setIsProfileEditOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Редагувати профіль
                </Button>
                <Button variant="outline">
                  Налаштування безпеки
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.color.replace("text", "bg").replace("-600", "-100")} dark:${stat.color.replace("text", "bg").replace("-600", "-900/30")}`}>
                    <Icon size={24} className={stat.color} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                    <ArrowUp size={14} />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Дохід по дням
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Тренд доходу за останні 7 днів
              </p>
            </div>
            <SimpleLineChart data={chartData.revenue} />
          </Card>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Замовлення по дням
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Кількість замовлень за останні 7 днів
              </p>
            </div>
            <SimpleLineChart data={chartData.orders} />
          </Card>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Місячний дохід
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Дохід по місяцях за останні пів року
              </p>
            </div>
            <SimpleBarChart data={monthlyRevenue} />
          </Card>
        </motion.div>

        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Розподіл користувачів
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                По типам підписки
              </p>
            </div>
            <SimplePieChart data={userDistribution} />
            <div className="flex gap-4 text-sm">
              {userDistribution.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.label}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Останні замовлення
          </h3>
          <div className="space-y-3">
            {[
              { id: "#ORD-2451", customer: "Іван Петров", amount: "$45.99", status: "Завершено" },
              { id: "#ORD-2450", customer: "Марія Сидорова", amount: "$32.50", status: "В обробці" },
              { id: "#ORD-2449", customer: "Алексей Иванов", amount: "$78.25", status: "В ожиданні" },
            ].map((order, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{order.id}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">{order.amount}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Profile Edit Panel */}
      <AdminProfileEditPanel
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
      />
    </motion.div>
  );
}
