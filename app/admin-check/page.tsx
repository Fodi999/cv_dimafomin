"use client";

import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function AdminAccessCheckPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Логируем информацию о пользователе
    console.log("🔍 Admin Access Check:");
    console.log("User:", user);
    console.log("Is Admin:", user?.role === "admin");
    console.log("Loading:", isLoading);
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Проверка доступа в админ панель
          </h1>
        </div>

        {user ? (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">📋 Информация пользователя</h2>
              <div className="space-y-3 bg-gray-900/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-semibold">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-semibold">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID:</span>
                  <span className="font-mono text-sm text-cyan-400">{user.id}</span>
                </div>
              </div>
            </div>

            {/* Role Check */}
            <div className={`border rounded-xl p-6 ${
              user.role === "admin"
                ? "bg-green-900/20 border-green-700"
                : "bg-yellow-900/20 border-yellow-700"
            }`}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
                {user.role === "admin" ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-green-400">Статус: АДМИН ✅</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <span className="text-yellow-400">Статус: НЕ АДМИН ⚠️</span>
                  </>
                )}
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">Текущая роль:</p>
                  <p className={`text-2xl font-bold ${
                    user.role === "admin" ? "text-green-400" : "text-yellow-400"
                  }`}>
                    {user.role.toUpperCase()}
                  </p>
                </div>

                {user.role === "admin" && (
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                    <p className="text-green-300 mb-4">
                      ✅ Вы имеете доступ к админ панели!
                    </p>
                    <button
                      onClick={() => router.push("/admin")}
                      className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Перейти в админ панель →
                    </button>
                  </div>
                )}

                {user.role !== "admin" && (
                  <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                    <p className="text-yellow-300 mb-4">
                      ⚠️ Ваша роль: <strong>{user.role}</strong>
                    </p>
                    <p className="text-yellow-300 text-sm mb-4">
                      Для доступа в админ панель требуется роль "admin". 
                      Свяжитесь с администратором для изменения роли.
                    </p>
                    <div className="space-y-2 text-sm text-yellow-300">
                      <p>Или проверьте:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>На backend роль пользователя установлена как "admin"</li>
                        <li>Очистите localStorage и залогинитесь заново</li>
                        <li>Проверьте консоль браузера (F12) на ошибки</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              {user.role === "admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Admin
                </button>
              )}
              <button
                onClick={() => router.push("/profile")}
                className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors"
              >
                Профиль
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Главная
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-3 bg-red-700 hover:bg-red-600 rounded-lg font-semibold transition-colors"
              >
                Выход
              </button>
            </div>

            {/* Debugging Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">🔍 Информация для отладки</h3>
              <pre className="bg-gray-900/50 p-4 rounded text-xs text-gray-300 overflow-x-auto">
{JSON.stringify({
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  },
  checks: {
    isAdmin: user.role === "admin",
    isLoading: isLoading,
    hasToken: !!localStorage.getItem("token"),
    hasUserId: !!localStorage.getItem("userId"),
  }
}, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              Не авторизованы
            </h2>
            <p className="text-red-300 mb-6">
              Пожалуйста, войдите в систему.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Вернуться на главную →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
