"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Settings,
  Activity,
  BarChart3,
  Clock,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  recentOrders: any[];
}

export default function AdminPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1234,
    totalOrders: 567,
    totalRevenue: 45000,
    activeUsers: 234,
    recentOrders: [
      { id: 1001, userName: "John Doe", amount: 199.99, status: "completed", time: "2 часа назад" },
      { id: 1002, userName: "Jane Smith", amount: 89.99, status: "pending", time: "30 минут назад" },
      { id: 1003, userName: "Mike Johnson", amount: 249.99, status: "completed", time: "1 час назад" },
    ],
  });
  const [loading, setLoading] = useState(false);

  const statCards = [
    {
      label: "Всего пользователей",
      value: stats.totalUsers,
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Активные заказы",
      value: stats.totalOrders,
      change: "+23%",
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Доход (месяц)",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`,
      change: "+18%",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Активные сейчас",
      value: stats.activeUsers,
      change: "+5%",
      icon: Activity,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Добро пожаловать, {user?.name}! 👋
            </h1>
            <p className="text-slate-300">
              Обзор системы и ключевые показатели производительности
            </p>
          </div>
          <div className="text-5xl opacity-20">⚙️</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.bg} rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-200 p-6`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-600 text-sm font-semibold mb-1">
                    {card.label}
                  </p>
                  <p className="text-4xl font-bold text-slate-900 mb-2">
                    {card.value}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    {card.change} за месяц
                  </p>
                </div>
                <div className={`bg-gradient-to-br ${card.color} p-4 rounded-lg shadow-md`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Последние заказы
            </h2>
            <Link
              href="/admin/orders"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              Все заказы →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    Заказ #{order.id}
                  </p>
                  <p className="text-sm text-slate-600">{order.userName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${order.amount}</p>
                  <p className="text-xs text-slate-500">{order.time}</p>
                </div>
                <div className="ml-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status === "completed" ? "Завершён" : "В ожидании"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Статус системы</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">API</span>
                <span className="flex items-center text-green-600 font-semibold">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">База данных</span>
                <span className="flex items-center text-green-600 font-semibold">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Сервер</span>
                <span className="flex items-center text-green-600 font-semibold">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold mb-3 text-lg">Ваш аккаунт</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="opacity-75">Роль</p>
                <p className="font-semibold">👑 Администратор</p>
              </div>
              <div>
                <p className="opacity-75">Email</p>
                <p className="font-semibold break-all">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/users"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-xl transition-shadow border border-blue-400/50"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">Пользователи</h3>
          <p className="text-sm text-blue-100">
            Управление учётными записями
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-xl transition-shadow border border-green-400/50"
        >
          <ShoppingCart className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">Заказы</h3>
          <p className="text-sm text-green-100">
            Отслеживание и управление
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-xl transition-shadow border border-purple-400/50"
        >
          <Settings className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">Настройки</h3>
          <p className="text-sm text-purple-100">
            Конфигурация системы
          </p>
        </Link>
      </div>
    </div>
  );
}
