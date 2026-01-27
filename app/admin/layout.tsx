"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";
import AdminNavigation from "@/components/layout/AdminNavigation";
import AuthModal from "@/components/auth/AuthModal";

/**
 * 🔐 ADMIN LAYOUT - ChefOS Architecture 2026
 * 
 * Guard: только super_admin
 * Layout: профессиональный SaaS dashboard с красивой навигацией
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // ✅ Если админ залогинен - скрываем форму входа
    if (session && session.role === 'super_admin') {
      setShowAuthModal(false);
    } else {
      setShowAuthModal(true);
    }
  }, [session, isLoading]);

  // 🔄 Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  // 🔐 Not admin - show login form
  if (!session || session.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Только для администраторов</p>
          </div>
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialTab="login"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* 🎨 Admin Navigation - sticky header */}
      <AdminNavigation />
      
      {/* 📄 Content - with top margin for fixed header */}
      <main className="w-full pt-16">
        {children}
      </main>
    </div>
  );
}
