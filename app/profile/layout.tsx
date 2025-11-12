"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ProtectedProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // ✅ Проверяем токен СРАЗУ при монтировании, один раз
    if (hasCheckedAuth) return;

    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("[ProfileLayout] No token found, redirecting to /login");
      setHasCheckedAuth(true);
      // Используем replace чтобы не создавать history entry
      router.replace("/login");
      return;
    }

    console.log("[ProfileLayout] Token found, allowing access");
    setIsAuthorized(true);
    setHasCheckedAuth(true);
  }, [hasCheckedAuth]); // ✅ Только hasCheckedAuth, НЕ router!

  // ⏳ Пока проверяем - показываем loading
  if (!hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  // ❌ Если не авторизован - ничего не рендерим (уже редирект вызван)
  if (!isAuthorized) {
    return null;
  }

  // ✅ Если авторизован - рендерим дети
  return <>{children}</>;
}

export default ProtectedProfileLayout;
