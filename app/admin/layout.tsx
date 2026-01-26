"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";
import AdminNavigation from "@/components/layout/AdminNavigation";

/**
 * 🔐 ADMIN LAYOUT - ChefOS Architecture 2026
 * 
 * Guard: только super_admin
 * Layout: профессиональный SaaS dashboard с красивой навигацией
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return;

    // 🔐 Guard: только super_admin
    if (!session || session.role !== 'super_admin') {
      console.warn("[AdminLayout] ⛔ Access denied - redirecting to customer");
      router.push('/marketplace');
    }
  }, [session, isLoading, router]);

  // 🔄 Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  // 🔐 Not authorized
  if (!session || session.role !== 'super_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* 🎨 Admin Navigation - Modern 2026 Design */}
      <AdminNavigation />
      
      {/* 📄 Content - с отступом для header */}
      <main className="w-full pt-16 px-4 sm:px-6 lg:px-8 pb-8">
        {children}
      </main>
    </div>
  );
}
