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
  Settings2,
  Coins,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Проверка прав доступа
  useEffect(() => {
    console.log("🔐 AdminLayout: Checking access");
    console.log("  isLoading:", isLoading);
    console.log("  user:", user);
    console.log("  user.role:", user?.role);
    console.log("  is admin?", user?.role === "admin");
    
    // 🔍 DEBUG: Проверим что в localStorage
    const tokenInStorage = localStorage.getItem("token");
    const roleInStorage = localStorage.getItem("role");
    const userInStorage = localStorage.getItem("user");
    console.log("🔍 LocalStorage Data:");
    console.log("   token:", tokenInStorage?.substring(0, 20) + "...");
    console.log("   role:", roleInStorage);
    console.log("   user:", userInStorage ? JSON.parse(userInStorage) : null);
    
    // ⏱️ Ждем пока контекст полностью загрузится (setTimeout в UserContext гарантирует это)
    if (!isLoading) {
      if (!user) {
        console.warn("❌ AdminLayout: No user found after loading complete");
        console.warn("   Redirecting to /login");
        router.push("/login");
      } else if (user.role !== "admin") {
        console.warn("❌ AdminLayout: User is not admin, role is:", user.role);
        console.warn("   Redirecting to /");
        router.push("/");
      } else {
        console.log("✅ AdminLayout: Access granted, user is admin");
        console.log("   User:", user.name, `(${user.email})`);
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
      label: "Токин-банк",
      href: "/admin/token-bank",
      icon: Coins,
    },
    {
      label: "Настройки",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Backdrop для мобильного меню */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col shadow-sm z-40 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:transition-all`}
      >
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <h1 className="text-lg md:text-xl font-bold text-foreground">
                  Admin
                </h1>
              </div>
            )}
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                if (window.innerWidth < 768) {
                  setMobileMenuOpen(false);
                }
              }}
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
        <nav className="flex-1 px-2 md:px-3 py-4 md:py-6 space-y-1 md:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setMobileMenuOpen(false);
                  }
                }}
                className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-secondary/20 hover:text-primary border border-transparent hover:border-secondary/40 transition-colors group text-foreground/80 text-sm md:text-base"
              >
                <Icon className="w-5 h-5 flex-shrink-0 text-primary" />
                {sidebarOpen && (
                  <span className="text-xs md:text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-border bg-secondary/10 p-3 md:p-4 space-y-2 md:space-y-3">
          {sidebarOpen && (
            <div className="text-xs md:text-sm">
              <p className="text-foreground/60">Администратор</p>
              <p className="font-semibold text-foreground truncate text-sm">{user.name}</p>
              <p className="text-xs text-foreground/50">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 md:px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors text-xs md:text-sm font-medium"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Выход</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-4 md:px-8 py-3 md:py-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-secondary/20 rounded-lg transition-colors text-foreground/60 flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Settings2 className="w-5 md:w-6 h-5 md:h-6 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-primary">АДМИН</div>
                <h2 className="text-lg md:text-2xl font-bold text-foreground truncate">
                  Dashboard
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <div className="text-xs md:text-sm text-foreground/60 hidden sm:block whitespace-nowrap">
                {new Date().toLocaleDateString("ru-RU", {
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
          <div className="p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
