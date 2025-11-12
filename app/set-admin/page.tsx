"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

export default function SetAdminPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    addLog("🔍 Страница загружена");
    return () => {
      addLog("🔍 Страница закрыта");
    };
  }, []);

  const setAdminRole = async () => {
    if (!user?.id) {
      addLog("❌ Ошибка: ID пользователя не найден");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    addLog(`🚀 Начинаем установку админ роли для ${user.email}...`);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Auth token не найден в localStorage");
      }

      addLog(`📝 Используем token: ${token.substring(0, 20)}...`);
      addLog(`👤 User ID: ${user.id}`);
      addLog(`📧 Email: ${user.email}`);

      // Вариант 1: PUT /user/role
      addLog("📤 Отправляем запрос PUT /user/role...");
      const response1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/user/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: "admin",
          }),
        }
      );

      addLog(`📥 Ответ статус: ${response1.status}`);
      const data1 = await response1.json();
      addLog(`📥 Ответ body: ${JSON.stringify(data1, null, 2)}`);

      if (!response1.ok && response1.status !== 200) {
        addLog("⚠️ Статус не 200, пробуем альтернативный endpoint...");

        // Вариант 2: PATCH /user
        addLog("📤 Отправляем запрос PATCH /user...");
        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/user`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              role: "admin",
            }),
          }
        );

        addLog(`📥 Ответ статус: ${response2.status}`);
        const data2 = await response2.json();
        addLog(`📥 Ответ body: ${JSON.stringify(data2, null, 2)}`);

        if (!response2.ok) {
          throw new Error(`API error: ${response2.status}`);
        }
      }

      addLog("✅ Роль успешно установлена!");
      setSuccess(true);

      // Обновляем локальное хранилище
      setTimeout(() => {
        addLog("🔄 Обновляем профиль...");
        window.location.reload();
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";
      addLog(`❌ Ошибка: ${message}`);
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              Не авторизованы
            </h2>
            <p className="text-red-300 mb-6">Пожалуйста, войдите в систему.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Вернуться на главную →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Установка Админ Роли
          </h1>
          <p className="text-gray-300">
            Установить роль "admin" для пользователя через API
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📋 Информация пользователя</h2>
          <div className="space-y-2 bg-gray-900/50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Role:</span>
              <span className={`font-semibold ${
                user.role === "admin" ? "text-green-400" : "text-yellow-400"
              }`}>
                {user.role.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ID:</span>
              <span className="font-mono text-sm text-cyan-400">{user.id}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {user.role !== "admin" && (
          <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 text-blue-300">
              🔧 Установить Админ Роль через API
            </h3>
            <p className="text-gray-300 mb-6">
              Кликните кнопку ниже, чтобы отправить запрос на backend для установки админ роли.
            </p>
            <button
              onClick={setAdminRole}
              disabled={isProcessing}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                isProcessing
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isProcessing && <RefreshCw className="w-5 h-5 animate-spin" />}
              {isProcessing ? "Обработка..." : "Установить Админ Роль"}
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              ✅ Успех!
            </h3>
            <p className="text-green-300">
              Админ роль установлена! Страница перезагружается...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-6 h-6" />
              ❌ Ошибка
            </h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Logs */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            📋 Логи Операции ({logs.length})
          </h3>
          <div className="bg-gray-900/50 rounded-lg p-4 max-h-80 overflow-y-auto font-mono text-xs text-gray-300 space-y-1">
            {logs.length === 0 ? (
              <p className="text-gray-500">Логи появятся здесь...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-gray-400">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => router.push("/admin-check")}
            className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors"
          >
            ← Проверка доступа
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            Профиль →
          </button>
        </div>
      </div>
    </div>
  );
}
