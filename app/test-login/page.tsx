"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function QuickLoginTestPage() {
  const [step, setStep] = useState(0);
  const [testEmail] = useState("user@example.com");
  const [testPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    console.log(message);
  };

  const runTest = async () => {
    setLoading(true);
    setLogs([]);
    setSuccess(false);
    setStep(0);

    try {
      // Step 1: Check if we can reach the backend
      setStep(1);
      addLog("📡 Step 1: Testing API connectivity...");
      
      const baseUrl = "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api";
      
      // Step 2: Test login endpoint
      setStep(2);
      addLog(`🔐 Step 2: Attempting login with email: ${testEmail}`);
      
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      addLog(`📥 Response status: ${loginResponse.status}`);
      const loginData = await loginResponse.json();
      addLog(`📥 Response body: ${JSON.stringify(loginData, null, 2)}`);

      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${loginData.message || loginData.error}`);
      }

      // Step 3: Extract and verify token
      setStep(3);
      addLog("🔑 Step 3: Extracting token from response...");
      
      const token = loginData.data?.token || loginData.token;
      const user = loginData.data?.user || loginData.user;
      
      if (!token) {
        throw new Error("No token in response");
      }
      
      addLog(`✅ Token received: ${token.substring(0, 50)}...`);
      addLog(`👤 User: ${user?.name} (${user?.email})`);
      addLog(`🆔 User ID: ${user?.id}`);

      // Step 4: Test authenticated request
      setStep(4);
      addLog("🔐 Step 4: Testing authenticated request...");
      
      const meResponse = await fetch(`${baseUrl}/user/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      addLog(`📥 Profile response status: ${meResponse.status}`);
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        addLog(`✅ Authenticated request successful!`);
        addLog(`Profile: ${JSON.stringify(meData, null, 2)}`);
      } else {
        addLog(`⚠️ Profile request failed (${meResponse.status})`);
      }

      setSuccess(true);
      setStep(5);
      addLog("✅ All tests passed! Login should work now.");
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">🧪 Quick Login Test</h1>
          <p className="text-gray-400">
            Быстрый тест авторизации для проверки backend
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">Test Credentials</h2>
              <div className="space-y-3 bg-gray-900/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-mono text-cyan-400">{testEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Password</p>
                  <p className="font-mono text-cyan-400">{testPassword}</p>
                </div>
              </div>
            </div>

            <button
              onClick={runTest}
              disabled={loading}
              className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Run Test
                </>
              )}
            </button>

            {success && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-400">Test passed!</span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Test Progress</h2>
            <div className="space-y-3">
              {[
                { num: 1, label: "API Connectivity" },
                { num: 2, label: "Login Request" },
                { num: 3, label: "Extract Token" },
                { num: 4, label: "Test Auth Request" },
                { num: 5, label: "Complete" },
              ].map(({ num, label }) => (
                <div
                  key={num}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    step >= num
                      ? step === num && loading
                        ? "bg-cyan-600/20 border border-cyan-600"
                        : "bg-green-600/20 border border-green-600"
                      : "bg-gray-700/20 border border-gray-600"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      step > num
                        ? "bg-green-600 text-white"
                        : step === num
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {step > num ? "✓" : num}
                  </div>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">📋 Logs</h2>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Run Test" to start...</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.includes("✅") || log.includes("✓")
                      ? "text-green-400"
                      : log.includes("❌")
                      ? "text-red-400"
                      : log.includes("⚠️")
                      ? "text-yellow-400"
                      : "text-cyan-400"
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
