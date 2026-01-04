"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const { openAuthModal, logout } = useAuth();

  // Проверка прав доступа администратора
  useEffect(() => {
    console.log("[AdminLayout] 🔐 Access check:", {
      isLoading,
      hasUser: !!user,
      userEmail: user?.email,
      userRole: user?.role,
      roleType: typeof user?.role,
      isAdmin: user?.role === "admin",
      pathname,
    });

    if (!isLoading) {
      if (!user) {
        console.warn("[AdminLayout] ❌ No user - opening auth modal");
        openAuthModal("login"); // 🔧 Открываем модалку вместо редиректа
      } else if (user.role !== "admin") {
        // 🚧 DEV MODE: Allow specific users in development
        const isDev = process.env.NODE_ENV === "development";
        const allowedDevEmails = ["admin@example.com", "dima@example.com"];
        const isAllowedDevUser = isDev && allowedDevEmails.includes(user.email);

        if (isAllowedDevUser) {
          console.warn("[AdminLayout] ⚠️ DEV MODE: Allowing non-admin user:", user.email);
          return; // Allow access in dev mode
        }

        console.warn("[AdminLayout] ❌ User is not admin:", {
          email: user.email,
          role: user.role,
          expected: "admin",
        });
        router.push("/");
      } else {
        console.log("[AdminLayout] ✅ Admin access granted");
      }
    }
  }, [user, isLoading, router, openAuthModal, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-sky-600 dark:text-sky-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Проверка доступу...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    // 🚧 DEV MODE: Allow specific users in development
    const isDev = process.env.NODE_ENV === "development";
    const allowedDevEmails = ["admin@example.com", "dima@example.com"];
    const isAllowedDevUser = isDev && user && allowedDevEmails.includes(user.email);

    if (!isAllowedDevUser) {
      return null;
    }
  }

  return (
    <SidebarProvider>
      <AdminSidebar onLogout={logout} />
      <SidebarInset>
        <div className="min-h-screen w-full relative bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950 flex flex-col">
          {/* Background gradient elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-cyan-500/5 dark:via-sky-500/10 dark:to-cyan-500/10 pointer-events-none -z-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none -z-10" />
          
          {/* Header with Sidebar Trigger */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </header>
          
          {/* Content Area */}
          {pathname.includes('/create') ? (
            // Full screen mode for create pages
            <div className="flex-1 w-full overflow-y-auto p-6">
              {children}
            </div>
          ) : (
            // Standard mode for list pages
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-auto">
              {children}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
