"use client";

import { useUser } from "@/contexts/UserContext";
import { AlertCircle, CheckCircle, User, Shield } from "lucide-react";

export default function DebugUserPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">🔍 Debug - User Status</h1>
          <p className="text-gray-400">
            Проверка текущего пользователя и его прав
          </p>
        </div>

        {/* User Info */}
        {user ? (
          <div className="space-y-6">
            {/* User Details */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-cyan-400" />
                Информация о пользователе
              </h2>

              <div className="space-y-4 bg-gray-900/50 rounded-lg p-4">
                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">ID:</span>
                  <span className="font-mono text-cyan-400">{user.id}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">Имя:</span>
                  <span className="font-semibold">{user.name}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-semibold">{user.email}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">Аватар:</span>
                  <span className="font-mono text-gray-500 text-sm">
                    {user.avatar ? "✅ загружен" : "❌ не загружен"}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">Level:</span>
                  <span className="font-semibold">{user.level || "N/A"}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">XP:</span>
                  <span className="font-semibold">{user.xp || "N/A"}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">Chef Tokens:</span>
                  <span className="font-semibold text-green-400">
                    {user.chefTokens || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-gray-400">Роль:</span>
                  <span className={`font-bold px-3 py-1 rounded-lg ${
                    user.role === "admin"
                      ? "bg-red-600 text-white"
                      : user.role === "instructor"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Access Check */}
            <div className={`border rounded-xl p-6 ${
              user.role === "admin"
                ? "bg-green-900/20 border-green-700"
                : "bg-red-900/20 border-red-700"
            }`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
                {user.role === "admin" ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-green-400">Admin Access Granted</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <span className="text-red-400">Not an Admin</span>
                  </>
                )}
              </h3>

              {user.role === "admin" ? (
                <div className="space-y-3">
                  <p className="text-green-300">
                    ✅ Ваша роль: <strong>admin</strong>
                  </p>
                  <p className="text-green-300">
                    ✅ Вы можете войти в админ панель
                  </p>
                  <a
                    href="/admin"
                    className="inline-block mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                  >
                    Перейти в админ панель →
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-300">
                    ❌ Ваша роль: <strong>{user.role}</strong>
                  </p>
                  <p className="text-red-300">
                    ❌ Для доступа к админ панели требуется роль <strong>admin</strong>
                  </p>
                  <div className="mt-4 p-3 bg-red-900/50 rounded-lg text-sm text-red-300">
                    <p>
                      Для изменения роли на <strong>admin</strong>:
                    </p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Свяжитесь с администратором</li>
                      <li>Или используйте backend API для обновления роли</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/profile"
                className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors text-center"
              >
                📝 Мой профиль
              </a>
              {user.role === "admin" && (
                <a
                  href="/admin"
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors text-center"
                >
                  🔐 Админ панель
                </a>
              )}
              <a
                href="/"
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors text-center"
              >
                🏠 Главная
              </a>
              <a
                href="/create-chat"
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors text-center"
              >
                🤖 AI Чат
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <span className="text-red-400">Not Logged In</span>
            </h2>
            <p className="text-red-300 mb-6">
              Вы не авторизованы. Пожалуйста, войдите в систему.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Вернуться на главную →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
