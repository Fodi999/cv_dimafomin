"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const { openAuthModal } = useAuth();

  // Проверка прав доступа администратора
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        openAuthModal("login"); // 🔧 Открываем модалку вместо редиректа
      } else if (user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, isLoading, router, openAuthModal]);

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
    return null;
  }

  return (
    <div className="min-h-screen w-screen relative bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950 flex flex-col overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-cyan-500/5 dark:via-sky-500/10 dark:to-cyan-500/10 pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none -z-10" />
      
      {/* NavigationBurger already rendered in root layout - no need to duplicate! */}
      
      {/* Content Area - з відступом від fixed NavigationBurger (pt-16 = 64px) */}
      {pathname.includes('/create') ? (
        // Full screen mode for create pages - теперь может скроллиться
        <div className="relative z-10 flex-1 w-full overflow-y-auto pt-16">
          {children}
        </div>
      ) : (
        // Standard mode for list pages
        <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 overflow-auto">
          {children}
        </div>
      )}
    </div>
  );
}
