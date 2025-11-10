"use client";

import { useState } from "react";
import { Mail, Lock, User, TestTube } from "lucide-react";

const API_URL = "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api";

interface ApiTestResponse {
  status: number;
  success: boolean;
  data?: any;
  error?: any;
  message?: string;
}

export default function ApiTestPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Test User");
  const [testResults, setTestResults] = useState<ApiTestResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (
    method: string,
    endpoint: string,
    body?: any,
    token?: string
  ) => {
    try {
      const headers: any = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      const result: ApiTestResponse = {
        status: response.status,
        success: response.ok,
        data: data,
        message: `${method} ${endpoint}`,
      };

      setTestResults((prev) => [result, ...prev]);
      return result;
    } catch (error: any) {
      const result: ApiTestResponse = {
        status: 0,
        success: false,
        error: error.message,
        message: `${method} ${endpoint}`,
      };

      setTestResults((prev) => [result, ...prev]);
      return null;
    }
  };

  const handleTestRegister = async () => {
    setLoading(true);
    await testEndpoint("POST", "/auth/register", {
      name,
      email,
      password,
    });
    setLoading(false);
  };

  const handleTestLogin = async () => {
    setLoading(true);
    const result = await testEndpoint("POST", "/auth/login", {
      email,
      password,
    });
    setLoading(false);
  };

  const handleClearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <TestTube className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold">🧪 API Test Dashboard</h1>
          </div>
          <p className="text-gray-400">
            Тестируйте backend API endpoints для отладки
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                Credentials
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Test User"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleTestRegister}
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Test Register
              </button>

              <button
                onClick={handleTestLogin}
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Test Login
              </button>

              <button
                onClick={handleClearResults}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Clear Results
              </button>
            </div>

            {/* API Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h3 className="font-semibold mb-2">API Endpoint</h3>
              <p className="text-sm text-gray-400 break-all font-mono">
                {API_URL}
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Test Results</h2>

            {testResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No tests run yet. Click a button to start.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.success
                        ? "bg-green-900/20 border-green-700"
                        : "bg-red-900/20 border-red-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-mono text-sm">{result.message}</p>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          result.success
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {result.status || "ERROR"}
                      </span>
                    </div>

                    {result.success && result.data && (
                      <div className="mt-3 bg-black/30 rounded p-3">
                        <pre className="text-xs text-green-400 overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}

                    {result.error && (
                      <div className="mt-3 bg-black/30 rounded p-3">
                        <p className="text-xs text-red-400">{result.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">📋 Instructions</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-cyan-400">1.</span>
              <span>Введите учетные данные (имя, email, пароль)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-cyan-400">2.</span>
              <span>Нажмите "Test Register" для регистрации нового пользователя</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-cyan-400">3.</span>
              <span>Нажмите "Test Login" для авторизации пользователя</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-cyan-400">4.</span>
              <span>Проверьте результаты справа - это поможет в отладке</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
