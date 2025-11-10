"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

export default function AdminLoginPage() {
  const { login, isLoading: authLoading } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin_password_123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setLogs([]);

    addLog(`🚀 Начинаем логин...`);
    addLog(`📧 Email: ${email}`);
    addLog(`🔑 Password: ${password.substring(0, 1)}${"*".repeat(password.length - 2)}${password.substring(password.length - 1)}`);

    try {
      addLog("📤 Отправляем запрос на backend...");
      await login(email, password);

      addLog("✅ Логин успешен!");
      setSuccess(true);

      setTimeout(() => {
        addLog("🔄 Переходим в админ панель...");
        router.push("/admin-check");
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";
      addLog(`❌ Ошибка логина: ${message}`);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Логин в Админ Аккаунт
          </h1>
          <p className="text-gray-300">
            Используйте учетные данные: admin@example.com / admin_password_123
          </p>
        </div>

        {success ? (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-green-400">
              <CheckCircle className="w-6 h-6" />
              ✅ Успешный логин!
            </h2>
            <p className="text-green-300 mb-6">
              Вы залогинены как {email}. Переходим в админ панель...
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleLogin} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || authLoading}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || authLoading}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || authLoading}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isLoading || authLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-cyan-600 hover:bg-cyan-700"
                  }`}
                >
                  {isLoading || authLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Войти в админ аккаунт
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-6 h-6" />
                  ❌ Ошибка
                </h3>
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </>
        )}

        {/* Logs */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">📋 Логи ({logs.length})</h3>
          <div className="bg-gray-900/50 rounded-lg p-4 max-h-80 overflow-y-auto font-mono text-xs text-gray-300 space-y-1">
            {logs.length === 0 ? (
              <p className="text-gray-500">Логи появятся после попытки входа...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-gray-400">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/admin-check")}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            📊 Проверка доступа
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            🏠 На главную
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-xl p-4">
          <h4 className="text-sm font-bold text-blue-300 mb-2">ℹ️ Как это работает:</h4>
          <ol className="text-sm text-blue-200 space-y-1">
            <li>1. Введите email: admin@example.com</li>
            <li>2. Введите пароль: admin_password_123</li>
            <li>3. Кликните "Войти в админ аккаунт"</li>
            <li>4. Backend вернет JWT с role: "admin"</li>
            <li>5. Frontend сохранит роль в UserContext</li>
            <li>6. Админ панель станет доступна</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
