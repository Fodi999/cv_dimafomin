"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle, CheckCircle, RefreshCw, Copy, Trash2 } from "lucide-react";

export default function AdminDiagnosticsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Gather all diagnostic information
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    let decodedToken: any = null;
    let tokenError = null;

    // Try to decode JWT
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          decodedToken = JSON.parse(atob(parts[1]));
        } else {
          tokenError = "Invalid token format (not 3 parts)";
        }
      } catch (e) {
        tokenError = `Failed to decode: ${e instanceof Error ? e.message : "unknown error"}`;
      }
    }

    const adminCheckResult = user?.role === "admin";
    const isAdminLayoutAccessible = adminCheckResult && !isLoading;

    setDiagnostics({
      timestamp: new Date().toLocaleString(),
      localStorage: {
        token: token ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}` : null,
        tokenLength: token?.length || 0,
        userId: userId,
      },
      userContext: {
        isLoading,
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              level: user.level,
              xp: user.xp,
              chefTokens: user.chefTokens,
            }
          : null,
      },
      jwtToken: {
        valid: !tokenError && !!decodedToken,
        error: tokenError,
        decoded: decodedToken
          ? {
              sub: decodedToken.sub,
              email: decodedToken.email,
              name: decodedToken.name,
              role: decodedToken.role,
              iat: new Date(decodedToken.iat * 1000).toLocaleString(),
              exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : null,
              // Show all keys in token
              allKeys: Object.keys(decodedToken),
            }
          : null,
      },
      adminAccess: {
        userExists: !!user,
        userRole: user?.role,
        isAdmin: adminCheckResult,
        isLoadingDone: !isLoading,
        canAccessAdmin: isAdminLayoutAccessible,
      },
      checks: {
        "✅ Token in localStorage": !!token,
        "✅ UserId in localStorage": !!userId,
        "✅ User loaded in context": !!user,
        "✅ Auth loading complete": !isLoading,
        "✅ User role is admin": user?.role === "admin",
        "✅ Admin panel accessible": isAdminLayoutAccessible,
      },
    });
  }, [user, isLoading]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Диагностика загружается...</p>
        </div>
      </div>
    );
  }

  const canAccessAdmin = diagnostics.adminAccess?.canAccessAdmin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Диагностика Админ Панели
          </h1>
          <p className="text-gray-300">Полная информация о доступе и авторизации</p>
        </div>

        {/* Status Summary */}
        <div className={`border rounded-xl p-6 ${
          canAccessAdmin
            ? "bg-green-900/20 border-green-700"
            : "bg-red-900/20 border-red-700"
        }`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
            {canAccessAdmin ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-green-400">✅ Доступ в админ панель: РАЗРЕШЕН</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-red-400" />
                <span className="text-red-400">❌ Доступ в админ панель: ЗАПРЕЩЕН</span>
              </>
            )}
          </h2>

          {canAccessAdmin && (
            <div className="space-y-3">
              <p className="text-green-300 mb-4">Вы можете перейти в админ панель!</p>
              <button
                onClick={() => router.push("/admin")}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                → Перейти в админ панель
              </button>
            </div>
          )}

          {!canAccessAdmin && (
            <div className="space-y-3 text-red-300">
              <div className="bg-red-900/30 rounded p-3">
                <p className="font-semibold mb-2">Проблемы:</p>
                <ul className="space-y-1 text-sm">
                  {!diagnostics.localStorage?.token && <li>• ❌ Нет токена в localStorage</li>}
                  {!diagnostics.localStorage?.userId && <li>• ❌ Нет userId в localStorage</li>}
                  {!diagnostics.userContext?.user && <li>• ❌ Пользователь не загружен</li>}
                  {diagnostics.userContext?.isLoading && <li>• ⏳ Еще загружается</li>}
                  {diagnostics.userContext?.user && diagnostics.userContext.user.role !== "admin" && (
                    <li>• ❌ Роль: {diagnostics.userContext.user.role} (нужна admin)</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Checks */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">📋 Проверки</h3>
          <div className="space-y-2">
            {Object.entries(diagnostics.checks || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
                <span className="text-sm">{key}</span>
                <span className={value ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                  {value ? "✅" : "❌"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Access Details */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">🔐 Доступ в админ панель</h3>
          <div className="space-y-2 bg-gray-900/50 p-4 rounded">
            <div className="flex justify-between">
              <span className="text-gray-400">Пользователь существует:</span>
              <span className={diagnostics.adminAccess?.userExists ? "text-green-400" : "text-red-400"}>
                {diagnostics.adminAccess?.userExists ? "✅ Да" : "❌ Нет"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Роль пользователя:</span>
              <span className={`font-semibold ${
                diagnostics.adminAccess?.userRole === "admin" ? "text-green-400" : "text-yellow-400"
              }`}>
                {diagnostics.adminAccess?.userRole?.toUpperCase() || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Является ли админом:</span>
              <span className={diagnostics.adminAccess?.isAdmin ? "text-green-400" : "text-red-400"}>
                {diagnostics.adminAccess?.isAdmin ? "✅ Да" : "❌ Нет"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Загрузка завершена:</span>
              <span className={diagnostics.adminAccess?.isLoadingDone ? "text-green-400" : "text-yellow-400"}>
                {diagnostics.adminAccess?.isLoadingDone ? "✅ Да" : "⏳ Загружается"}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
              <span className="text-gray-400 font-bold">Может войти в админ:</span>
              <span className={`text-lg font-bold ${
                diagnostics.adminAccess?.canAccessAdmin ? "text-green-400" : "text-red-400"
              }`}>
                {diagnostics.adminAccess?.canAccessAdmin ? "✅ ДА" : "❌ НЕТ"}
              </span>
            </div>
          </div>
        </div>

        {/* User Context Data */}
        {diagnostics.userContext?.user && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">👤 Данные пользователя</h3>
            <div className="space-y-2 bg-gray-900/50 p-4 rounded text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">ID:</span>
                <span className="font-mono text-cyan-400">{diagnostics.userContext.user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span>{diagnostics.userContext.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span>{diagnostics.userContext.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role:</span>
                <span className={`font-bold ${
                  diagnostics.userContext.user.role === "admin" ? "text-green-400" : "text-yellow-400"
                }`}>
                  {diagnostics.userContext.user.role.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Level:</span>
                <span>{diagnostics.userContext.user.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">XP:</span>
                <span>{diagnostics.userContext.user.xp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Chef Tokens:</span>
                <span>{diagnostics.userContext.user.chefTokens}</span>
              </div>
            </div>
          </div>
        )}

        {/* JWT Token Data */}
        {diagnostics.jwtToken?.decoded && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">🔑 JWT Token (декодирован)</h3>
            <div className="space-y-2 bg-gray-900/50 p-4 rounded text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Valid:</span>
                <span className="text-green-400">✅ Yes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span>{diagnostics.jwtToken.decoded.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span>{diagnostics.jwtToken.decoded.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role (из токена):</span>
                <span className={`font-bold ${
                  diagnostics.jwtToken.decoded.role === "admin" ? "text-green-400" : "text-yellow-400"
                }`}>
                  {diagnostics.jwtToken.decoded.role?.toUpperCase() || "undefined"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issued At:</span>
                <span className="text-xs">{diagnostics.jwtToken.decoded.iat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expires At:</span>
                <span className="text-xs">{diagnostics.jwtToken.decoded.exp || "Never"}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Все поля в токене:</p>
                <p className="text-xs text-cyan-400 font-mono break-words">
                  {diagnostics.jwtToken.decoded.allKeys?.join(", ") || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {diagnostics.jwtToken?.error && (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-red-400">⚠️ JWT Token Error</h3>
            <p className="text-red-300">{diagnostics.jwtToken.error}</p>
          </div>
        )}

        {/* Raw JSON */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            📄 Сырые данные (JSON)
            <button
              onClick={copyToClipboard}
              className="ml-auto px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Скопировано!" : "Копировать"}
            </button>
          </h3>
          <pre className="bg-gray-900/50 p-4 rounded overflow-x-auto text-xs text-gray-300">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/admin")}
            disabled={!canAccessAdmin}
            className={`px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              canAccessAdmin
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            <Shield className="w-5 h-5" />
            Admin Panel
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors"
          >
            Профиль
          </button>
          <button
            onClick={clearStorage}
            className="px-4 py-3 bg-red-700 hover:bg-red-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Выход
          </button>
        </div>
      </div>
    </div>
  );
}
