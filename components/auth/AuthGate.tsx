"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const { isLoading: userLoading } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  // 🆕 Public routes that don't need AuthGate
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Wait for auth to stabilize (one tick after mount)
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 🆕 Skip AuthGate for public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // 🛡️ AUTH GATE: Block rendering until auth is ready
  if (!isInitialized || (auth.isAuthenticated && userLoading)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Ładowanie...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
