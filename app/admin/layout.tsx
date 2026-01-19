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
    // ✅ Fixed: only check on mount or when loading completes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

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
      <div className="fixed inset-0 pt-16 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Content Area - Allow scroll for pages that need it */}
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
          <div className="min-h-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
