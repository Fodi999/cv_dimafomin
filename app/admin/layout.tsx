"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";
import AdminNavigation from "@/components/layout/AdminNavigation";
import { isAdminRole } from "@/lib/auth/roles";

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
      isAdmin: isAdminRole(user?.role),
      pathname,
    });

    if (!isLoading) {
      if (!user) {
        console.warn("[AdminLayout] ❌ No user - opening auth modal");
        openAuthModal("login");
      } else if (!isAdminRole(user.role)) {
        console.warn("[AdminLayout] ❌ User is not admin:", {
          email: user.email,
          role: user.role,
          expected: "admin or super_admin",
        });
        router.push("/");
      } else {
        console.log("[AdminLayout] ✅ Admin access granted:", user.role);
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

  if (!user || !isAdminRole(user.role)) {
    return null;
  }

  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen w-full relative bg-gray-50 dark:bg-gray-950 flex flex-col">
        {/* Content Area */}
        {pathname.includes('/create') || pathname.includes('/edit') ? (
          // Full screen mode for create/edit pages
          <div className="flex-1 w-full pt-16 overflow-hidden">
            {children}
          </div>
        ) : (
          // Standard mode for list pages with gradient backgrounds
          <>
            {/* Background gradient elements for list pages */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-orange-500/5 dark:via-red-500/10 dark:to-orange-500/10 pointer-events-none -z-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/10 dark:bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none -z-10" />
            
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 py-8 overflow-auto">
              {children}
            </div>
          </>
        )}
      </div>
    </>
  );
}
