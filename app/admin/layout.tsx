"use client";

import AdminNavigation from "@/components/layout/AdminNavigation";
import { RequireAuth } from "@/components/auth/RequireAuth";

/**
 * 🔐 ADMIN LAYOUT - ChefOS Architecture 2026
 * 
 * Guard: admin и super_admin
 * Layout: профессиональный SaaS dashboard с красивой навигацией
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth allowRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* 🎨 Admin Navigation - Modern 2026 Design */}
        <AdminNavigation />
        
        {/* 📄 Content - с отступом для header */}
        <main className="w-full pt-16 px-4 sm:px-6 lg:px-8 pb-8">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
