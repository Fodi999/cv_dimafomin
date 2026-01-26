"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/SessionContext";
import {
  adminNavigationSchema,
  filterNavigation,
  getLocalizedLabel,
  type AdminRole,
  type FeatureFlag,
} from "@/lib/admin/navigation-schema";

interface AdminSidebarProps {
  onLogout?: () => void;
}

/**
 * Профессиональный Admin Sidebar с:
 * - Role-based access control (RBAC)
 * - Feature flags
 * - Multilingual support
 * - Секционированная навигация
 */
export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { user } = useUser();

  // Определяем роль пользователя
  const userRole: AdminRole = (user?.role as AdminRole) || "admin";

  // Feature flags (можно вынести в Context или Settings)
  const enabledFeatures: FeatureFlag[] = [
    // "operations", // Раскомментировать когда будет e-commerce
    // "integrations", // Раскомментировать когда будут интеграции
    // "ai_logs", // Раскомментировать для логов AI
  ];

  // Фильтруем навигацию по роли и фичам
  const navigation = filterNavigation(
    adminNavigationSchema,
    userRole,
    enabledFeatures
  );

  // Маппинг языка для навигации
  const navLanguage =
    language === "ru" ? "ru" : language === "pl" ? "pl" : "en";

  return (
    <Sidebar className="border-r">
      {/* Logo */}
      <SidebarHeader className="border-b p-4">
        <Link href="/admin/dashboard">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            🔧 Admin Panel
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {userRole === "superadmin" ? "Superadmin" : "Administrator"}
          </p>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.id}>
            <SidebarGroupLabel>
              {getLocalizedLabel(section, navLanguage)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
                          <span>{getLocalizedLabel(item, navLanguage)}</span>
                          {item.badge && (
                            <span className="ml-auto bg-sky-600 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4">
        <Button onClick={onLogout} variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          {navLanguage === "ru"
            ? "Выход"
            : navLanguage === "pl"
            ? "Wyloguj"
            : "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
