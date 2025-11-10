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
} from "lucide-react";
import { academyApi } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  recentOrders: any[];
}

export default function AdminPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No authentication token");
          return;
        }

        // Загружаем статистику с бэкенда
        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-4">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Всего пользователей",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-primary",
    },
    {
      label: "Заказы",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-accent",
    },
    {
      label: "Доход",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-secondary",
    },
    {
      label: "Активные пользователи",
      value: stats?.activeUsers || 0,
      icon: Activity,
      color: "bg-primary",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Добро пожаловать, {user?.name}! 👋
        </h1>
        <p className="text-foreground/60">
          Обзор вашей админ панели и ключевые метрики
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-foreground/60 text-sm font-medium">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Последние заказы
        </h2>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground/70">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground/70">
                    Пользователь
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground/70">
                    Сумма
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground/70">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 hover:bg-secondary/10 transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground">
                      #{order.id}
                    </td>
                    <td className="py-3 px-4 text-foreground/80">
                      {order.userName}
                    </td>
                    <td className="py-3 px-4 text-foreground/80">
                      ${order.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-primary/10 text-primary"
                            : order.status === "pending"
                            ? "bg-secondary/30 text-foreground"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-foreground/60 text-center py-8">
            Нет заказов
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/users"
          className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground hover:shadow-lg transition-shadow"
        >
          <Users className="w-8 h-8 mb-2" />
          <h3 className="font-semibold mb-1">Управление пользователями</h3>
          <p className="text-sm text-primary-foreground/80">
            Просмотр и редактирование пользователей
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-gradient-to-br from-accent to-accent/80 rounded-xl p-6 text-accent-foreground hover:shadow-lg transition-shadow"
        >
          <ShoppingCart className="w-8 h-8 mb-2" />
          <h3 className="font-semibold mb-1">Управление заказами</h3>
          <p className="text-sm text-accent-foreground/80">
            Отслеживание и обновление статуса заказов
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-6 text-foreground hover:shadow-lg transition-shadow"
        >
          <Settings className="w-8 h-8 mb-2" />
          <h3 className="font-semibold mb-1">Настройки</h3>
          <p className="text-sm text-foreground/80">
            Конфигурация и параметры системы
          </p>
        </Link>
      </div>
    </div>
  );
}
