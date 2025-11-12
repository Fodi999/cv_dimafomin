"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  currentPage?: "dashboard" | "users" | "orders";
  onLogout?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Панель", icon: LayoutDashboard, href: "/admin/dashboard" },
  { id: "users", label: "Пользователи", icon: Users, href: "/admin/users" },
  { id: "orders", label: "Заказы", icon: ShoppingCart, href: "/admin/orders" },
  { id: "analytics", label: "Аналитика", icon: BarChart3, href: "/admin/analytics" },
  { id: "settings", label: "Настройки", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar({
  currentPage = "dashboard",
  onLogout,
}: AdminSidebarProps) {
  return (
    <Sidebar className="border-r">
      {/* Logo */}
      <SidebarHeader className="border-b p-4">
        <Link href="/admin/dashboard">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            🔧 Admin
          </h2>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={isActive ? "bg-sky-100 dark:bg-sky-950" : ""}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4">
        <Button
          onClick={onLogout}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выход
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
