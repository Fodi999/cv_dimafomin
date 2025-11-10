"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import {
  BarChart3,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Проверка прав доступа
  useEffect(() => {
    console.log("🔐 AdminLayout: Checking access");
    console.log("  isLoading:", isLoading);
    console.log("  user:", user);
    console.log("  user.role:", user?.role);
    console.log("  is admin?", user?.role === "admin");
    
    if (!isLoading) {
      if (!user) {
        console.warn("❌ AdminLayout: No user, redirecting to /");
        router.push("/");
      } else if (user.role !== "admin") {
        console.warn("❌ AdminLayout: User is not admin, role is:", user.role, "redirecting to /");
        router.push("/");
      } else {
        console.log("✅ AdminLayout: Access granted, user is admin");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Проверка доступа администратора...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center text-foreground max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold mb-2">Доступ запрещен</h1>
          <p className="text-foreground/60 mb-6">
            Эта страница доступна только для администраторов.
          </p>
          {user && (
            <div className="bg-secondary/20 rounded-lg p-4 mb-6 border border-secondary/40">
              <p className="text-sm text-foreground/60">Ваша роль:</p>
              <p className="text-lg font-bold text-accent">
                {user.role.toUpperCase()}
              </p>
            </div>
          )}
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  const navItems = [
    {
      label: "Статистика",
      href: "/admin",
      icon: BarChart3,
    },
    {
      label: "Пользователи",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Заказы",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Настройки",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col shadow-sm`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  A
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  Admin
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-secondary/20 rounded-lg transition-colors text-foreground/60"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/20 hover:text-primary border border-transparent hover:border-secondary/40 transition-colors group text-foreground/80"
              >
                <Icon className="w-5 h-5 flex-shrink-0 text-primary" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-border bg-secondary/10 p-4 space-y-3">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="text-foreground/60">Администратор</p>
              <p className="font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-foreground/50">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Выход</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚙️</div>
              <div>
                <div className="text-xs font-semibold text-primary">АДМИН-ПАНЕЛЬ</div>
                <h2 className="text-2xl font-bold text-foreground">
                  Dashboard
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-foreground/60">
                {new Date().toLocaleDateString("uk-UA", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <button
                onClick={() => router.push("/")}
                className="p-2 hover:bg-secondary/20 rounded-lg transition-colors text-foreground/60 hover:text-foreground"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
