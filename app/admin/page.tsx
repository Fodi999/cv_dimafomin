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
  AlertCircle,
} from "lucide-react";
import { adminApi } from "@/src/lib/admin-api";

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  newUsersThisMonth?: number;
  ordersThisMonth?: number;
}

interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AdminPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[AdminDashboard] Загрузка данных...');

        // Загружаем статистику и заказы параллельно
        const [statsData, ordersData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getRecentOrders(),
        ]);

        console.log('[AdminDashboard] 📊 Статистика:', statsData);
        console.log('[AdminDashboard] 📦 Заказы:', ordersData);

        setStats(statsData);
        setRecentOrders(ordersData);
      } catch (err) {
        console.error('[AdminDashboard] ❌ Ошибка при загрузке:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        
        // Fallback на mock-данные если есть ошибка
        setStats({
          totalUsers: 1234,
          totalOrders: 567,
          totalRevenue: 45000,
          activeUsers: 234,
          newUsersThisMonth: 145,
          ordersThisMonth: 89,
        });
        setRecentOrders([
          { id: '1001', userId: '1', userName: "John Doe", amount: 199.99, status: "completed", createdAt: new Date(Date.now() - 2*60*60*1000).toISOString() },
          { id: '1002', userId: '2', userName: "Jane Smith", amount: 89.99, status: "pending", createdAt: new Date(Date.now() - 30*60*1000).toISOString() },
          { id: '1003', userId: '3', userName: "Mike Johnson", amount: 249.99, status: "completed", createdAt: new Date(Date.now() - 60*60*1000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка данных админ-панели...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <div>
          <p className="font-semibold text-red-900">Ошибка при загрузке данных</p>
          <p className="text-sm text-red-700">{error}</p>
          <p className="text-xs text-red-600 mt-1">Используются тестовые данные</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Всего пользователей",
      value: stats?.totalUsers ?? 0,
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Активные заказы",
      value: stats?.totalOrders ?? 0,
      change: "+23%",
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Доход (месяц)",
      value: `$${((stats?.totalRevenue ?? 0) / 1000).toFixed(0)}K`,
      change: "+18%",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Активные сейчас",
      value: stats?.activeUsers ?? 0,
      change: "+5%",
      icon: Activity,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 md:p-8 text-white border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
              Добро пожаловать, {user?.name}!
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Обзор системы и ключевые показатели
            </p>
          </div>
          <div className="hidden md:block opacity-20">
            <Settings className="w-20 h-20" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.bg} rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200 p-4 sm:p-6`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-1 line-clamp-2">
                    {card.label}
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                    {card.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-green-600">
                    {card.change}
                  </p>
                </div>
                <div className={`bg-gradient-to-br ${card.color} p-3 sm:p-4 rounded-lg shadow-md flex-shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
              Последние заказы
            </h2>
            <Link
              href="/admin/orders"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm whitespace-nowrap"
            >
              Все заказы →
            </Link>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full table-auto border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">Заказ</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap hidden sm:table-cell">Клиент</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">Сумма</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap hidden md:table-cell">Дата</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-center whitespace-nowrap">Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order: AdminOrder) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 py-2 sm:py-3 font-semibold text-slate-900 whitespace-nowrap">
                        #{order.id}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-600 hidden sm:table-cell">
                        {order.userName}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 font-bold text-slate-900">
                        ${(order.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-600 text-xs hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "completed"
                            ? "✓"
                            : order.status === "pending"
                            ? "⏳"
                            : "✗"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 sm:px-4 py-6 sm:py-8 text-center text-slate-500 text-sm">
                      Нет заказов
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Статус системы</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-slate-600">API</span>
                <span className="flex items-center text-green-600 font-semibold text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-slate-600">База данных</span>
                <span className="flex items-center text-green-600 font-semibold text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-slate-600">Сервер</span>
                <span className="flex items-center text-green-600 font-semibold text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-white">
            <h3 className="font-bold mb-2 sm:mb-3 text-base sm:text-lg">Ваш аккаунт</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div>
                <p className="opacity-75 text-xs">Роль</p>
                <p className="font-semibold text-sm sm:text-base">👑 Администратор</p>
              </div>
              <div>
                <p className="opacity-75 text-xs">Email</p>
                <p className="font-semibold break-all text-xs sm:text-sm">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Link
          href="/admin/users"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white hover:shadow-lg transition-shadow border border-blue-400/50"
        >
          <Users className="w-6 sm:w-8 h-6 sm:h-8 mb-2 sm:mb-3" />
          <h3 className="font-bold text-base sm:text-lg mb-1">Пользователи</h3>
          <p className="text-xs sm:text-sm text-blue-100">
            Управление учётными записями
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white hover:shadow-lg transition-shadow border border-green-400/50"
        >
          <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 mb-2 sm:mb-3" />
          <h3 className="font-bold text-base sm:text-lg mb-1">Заказы</h3>
          <p className="text-xs sm:text-sm text-green-100">
            Отслеживание и управление
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white hover:shadow-lg transition-shadow border border-purple-400/50"
        >
          <Settings className="w-6 sm:w-8 h-6 sm:h-8 mb-2 sm:mb-3" />
          <h3 className="font-bold text-base sm:text-lg mb-1">Настройки</h3>
          <p className="text-xs sm:text-sm text-purple-100">
            Конфигурация системы
          </p>
        </Link>
      </div>
    </div>
  );
}
