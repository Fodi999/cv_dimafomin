"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, AlertCircle } from "lucide-react";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { UsersTable } from "@/components/admin/UsersTable";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api";

// Mock data for admin dashboard
const mockStats = {
  totalUsers: 1542,
  activeUsers: 342,
  totalOrders: 4821,
  totalRevenue: 125430.50,
  pendingOrders: 12,
  averageOrderValue: 26.00,
};

const mockUsers = [
  {
    id: "1",
    name: "Иван Петров",
    email: "ivan@example.com",
    role: "user",
    level: 8,
    xp: 4200,
    chefTokens: 2500,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Мария Сидорова",
    email: "maria@example.com",
    role: "user",
    level: 5,
    xp: 2100,
    chefTokens: 1500,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Алексей Иванов",
    email: "alexey@example.com",
    role: "user",
    level: 12,
    xp: 6800,
    chefTokens: 4200,
    createdAt: "2024-01-05",
  },
];

const mockOrders = [
  {
    id: "ORD-001",
    customerId: "1",
    customerName: "Иван Петров",
    amount: 45.99,
    itemCount: 3,
    status: "completed",
    createdAt: "2024-11-10",
  },
  {
    id: "ORD-002",
    customerId: "2",
    customerName: "Мария Сидорова",
    amount: 32.50,
    itemCount: 2,
    status: "pending",
    createdAt: "2024-11-12",
  },
  {
    id: "ORD-003",
    customerId: "3",
    customerName: "Алексей Иванов",
    amount: 78.25,
    itemCount: 5,
    status: "completed",
    createdAt: "2024-11-11",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        console.log("[AdminDashboard] Проверка роли:", role);

        // ✅ Проверка роли ПЕРЕД началом загрузки данных
        if (role !== "admin") {
          console.log("[AdminDashboard] Не админ, редирект на /");
          setChecked(true);
          setIsAdmin(false);
          setLoading(false);
          router.push("/");
          return;
        }

        // ✅ Роль подтверждена
        setIsAdmin(true);
        setChecked(true);

        if (!token) {
          console.log("[AdminDashboard] Токен не найден");
          setError("Вы не авторизованы");
          setLoading(false);
          return;
        }

        // Попытка загрузить реальные данные с fallback на mock
        const [statsResult, usersResult, ordersResult] = await Promise.all([
          fetch("https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/dashboard", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => {
              if (!res.ok) {
                console.warn(`[AdminDashboard] API returned ${res.status} for dashboard`);
                return null;
              }
              return res.json();
            })
            .catch(err => {
              console.warn("[AdminDashboard] Ошибка загрузки статистики:", err.message);
              return null;
            }),
          fetch("https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => {
              if (!res.ok) {
                console.warn(`[AdminDashboard] API returned ${res.status} for users`);
                return null;
              }
              return res.json();
            })
            .catch(err => {
              console.warn("[AdminDashboard] Ошибка загрузки пользователей:", err.message);
              return null;
            }),
          fetch("https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => {
              if (!res.ok) {
                console.warn(`[AdminDashboard] API returned ${res.status} for orders`);
                return null;
              }
              return res.json();
            })
            .catch(err => {
              console.warn("[AdminDashboard] Ошибка загрузки заказов:", err.message);
              return null;
            }),
        ]);

        // Backend returns: {stats: {...}, tokenStats: {...}}
        // Extract and merge stats from backend response
        const backendStats = statsResult?.stats || statsResult?.data;
        const mergedStats = backendStats ? {
          totalUsers: backendStats.totalUsers || mockStats.totalUsers,
          totalOrders: backendStats.totalOrders || mockStats.totalOrders,
          activeUsers: mockStats.activeUsers,  // Not provided by backend
          totalRevenue: mockStats.totalRevenue,  // Not provided by backend
          pendingOrders: mockStats.pendingOrders,  // Not provided by backend
          averageOrderValue: mockStats.averageOrderValue,  // Not provided by backend
          // Add token stats if available
          ...statsResult?.tokenStats,
        } : mockStats;
        
        setStats(mergedStats);
        setUsers((usersResult?.data && Array.isArray(usersResult?.data)) ? usersResult.data : mockUsers);
        setOrders((ordersResult?.data && Array.isArray(ordersResult?.data)) ? ordersResult.data : mockOrders);
        
        console.log("[AdminDashboard] ✅ Данные загружены:");
        console.log("  - Stats:", backendStats ? "✅ Real data" : "📋 Mock data", backendStats);
        console.log("  - Users:", usersResult?.data ? "✅ Real data" : "📋 Mock data");
        console.log("  - Orders:", ordersResult?.data ? "✅ Real data" : "📋 Mock data");
      } catch (err: any) {
        console.error("Error loading admin data:", err);
        setError(err.message || "Ошибка при загрузке данных");
        // Использовать mock данные на случай ошибки
        setStats(mockStats);
        setUsers(mockUsers);
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading || !checked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-sky-600 dark:text-sky-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // ✅ Если role !== "admin", компонент редиректится
  if (!isAdmin) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-lg p-8 shadow-lg max-w-md text-center border">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Ошибка</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Вернуться на вход
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Панель администратора
        </h1>
        <p className="text-muted-foreground">
          Добро пожаловать! Здесь вы можете управлять пользователями, заказами и статистикой.
        </p>
      </div>

      <div className="mb-12">
        <DashboardStats
          totalUsers={stats?.totalUsers || 0}
          activeUsers={stats?.activeUsers || 0}
          totalOrders={stats?.totalOrders || 0}
          totalTokensEarned={stats?.totalTokensEarned || 0}
        />
      </div>

      <div className="space-y-6">
        <UsersTable users={users} />
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
