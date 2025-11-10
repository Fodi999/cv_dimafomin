"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

const API_URL = "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [currentPassword, setCurrentPassword] = useState("admin_password_123");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
    console.log(msg);
  };

  const handleLogin = async () => {
    setLoading(true);
    setLogs([]);
    setMessage(null);

    try {
      addLog(`🔐 Попытка входа с email: ${email}`);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: currentPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const extractedToken = data.data?.token || data.token;
      const extractedUserId = data.data?.user?.id || data.user?.id;

      addLog(`✅ Вход успешен!`);
      addLog(`🔑 Token: ${extractedToken?.substring(0, 50)}...`);
      addLog(`👤 User ID: ${extractedUserId}`);

      setToken(extractedToken);
      setUserId(extractedUserId);
      setMessage({ type: "success", text: "Login successful!" });
    } catch (error: any) {
      addLog(`❌ Ошибка: ${error.message}`);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSetAdminRole = async () => {
    if (!token || !userId) {
      setMessage({ type: "error", text: "Please login first" });
      return;
    }

    setLoading(true);

    try {
      addLog(`🔄 Попытка установить роль admin для userId: ${userId}`);

      const response = await fetch(`${API_URL}/user/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "admin" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to set admin role");
      }

      addLog(`✅ Роль admin установлена успешно!`);
      setMessage({ type: "success", text: "Admin role set successfully!" });
    } catch (error: any) {
      addLog(`❌ Ошибка: ${error.message}`);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckProfile = async () => {
    if (!token) {
      setMessage({ type: "error", text: "Please login first" });
      return;
    }

    setLoading(true);

    try {
      addLog(`📊 Проверка профиля с токеном`);

      const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      addLog(`✅ Профиль получен:`);
      addLog(JSON.stringify(data, null, 2));

      if (data.data?.role || data.role) {
        const role = data.data?.role || data.role;
        addLog(`👤 Текущая роль: ${role}`);
      }

      setMessage({ type: "success", text: "Profile checked - see logs" });
    } catch (error: any) {
      addLog(`❌ Ошибка: ${error.message}`);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToAdmin = () => {
    window.location.href = "/admin";
  };

  const handleClearStorage = () => {
    localStorage.clear();
    setMessage({ type: "success", text: "LocalStorage cleared" });
    addLog("🧹 LocalStorage очищен");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">🔧 Admin Setup</h1>
          <p className="text-gray-400">
            Установка и проверка прав администратора
          </p>
        </div>

        <div className="space-y-6">
          {/* Login Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Step 1: Login</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="password123"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : "🔐"}
                Login
              </button>
            </div>

            {token && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Authenticated - Token: {token.substring(0, 30)}...
                </p>
              </div>
            )}
          </div>

          {/* Set Admin Role */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Step 2: Set Admin Role</h2>

            <p className="text-gray-300 text-sm mb-4">
              После входа нажмите кнопку ниже, чтобы установить роль администратора.
            </p>

            <button
              onClick={handleSetAdminRole}
              disabled={!token || loading}
              className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : "👑"}
              Set Admin Role
            </button>
          </div>

          {/* Check Profile */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Step 3: Verify</h2>

            <div className="space-y-3">
              <button
                onClick={handleCheckProfile}
                disabled={!token || loading}
                className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
              >
                Check Profile
              </button>

              <button
                onClick={handleGoToAdmin}
                className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
              >
                Go to Admin Panel →
              </button>

              <button
                onClick={handleClearStorage}
                className="w-full px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Clear Local Storage
              </button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-900/20 border border-green-700"
                  : "bg-red-900/20 border border-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>
                {message.text}
              </p>
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h3 className="font-bold mb-3">📋 Logs</h3>
              <div className="bg-black/50 rounded p-3 max-h-64 overflow-y-auto font-mono text-sm space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-cyan-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
