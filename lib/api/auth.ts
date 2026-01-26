/**
 * Auth API Client
 * 
 * Использует Next.js API routes (/api/auth/*) которые проксируют к backend
 * Контракт API 2026:
 * - POST /api/auth/login → { data: { access_token, refresh_token, user } }
 * - GET /api/auth/me → { data: { id, email, role, status } }
 */

import { authFetch } from "./authFetch";

export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user?: {
      id: string;
      email: string;
      role: string;
      status?: string;
    };
  };
  meta?: any; // ✅ Backend может возвращать meta
}

export interface MeResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
  };
  message?: string;
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  console.log("🔐 [Auth API] Attempting login with email:", email);
  
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "LOGIN_FAILED" }));
    console.error("❌ [Auth API] Login failed:", errorData);
    throw new Error(errorData.error || errorData.message || "LOGIN_FAILED");
  }

  const data = await response.json();
  
  // 🔍 Детальное логирование структуры ответа
  console.log("🔍 [Auth API] Login response structure:", {
    success: data.success,
    hasData: !!data.data,
    dataKeys: data.data ? Object.keys(data.data) : [],
    hasAccessToken: !!data.data?.access_token,
    hasToken: !!data.data?.token,
    topLevelKeys: Object.keys(data),
  });
  
  // ✅ Валидация ответа
  if (!data.success) {
    console.error("❌ [Auth API] Login response indicates failure:", data);
    throw new Error(data.error || data.message || "LOGIN_FAILED");
  }
  
  // ✅ Проверка наличия токена (пробуем разные варианты)
  const accessToken = data.data?.access_token || data.data?.token || data.access_token || data.token;
  const refreshToken = data.data?.refresh_token || data.data?.refreshToken || data.refresh_token;
  
  if (!accessToken) {
    console.error("❌ [Auth API] No access_token in response:", data);
    console.error("❌ [Auth API] Tried: data.data.access_token, data.data.token, data.access_token, data.token");
    throw new Error("No access_token received");
  }
  
  const tokenLength = accessToken.length;
  if (tokenLength < 50) {
    console.error(`❌ [Auth API] Token seems invalid (too short: ${tokenLength}):`, accessToken.substring(0, 20));
    throw new Error("Invalid token format");
  }
  
  console.log(`✅ [Auth API] Login successful, token length: ${tokenLength}`);
  
  // Нормализуем структуру ответа
  return {
    success: true,
    data: {
      access_token: accessToken,
      refresh_token: refreshToken || "",
      user: data.data?.user || data.user,
    },
    meta: data.meta,
  };
}

/**
 * Register user
 * POST /api/auth/register
 */
export async function register(
  email: string,
  password: string,
  name?: string
): Promise<RegisterResponse> {
  console.log("📝 [Auth API] Attempting registration with email:", email);
  
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "REGISTER_FAILED" }));
    console.error("❌ [Auth API] Registration failed:", errorData);
    throw new Error(errorData.error || errorData.message || "REGISTER_FAILED");
  }

  const data = await response.json();
  console.log("✅ [Auth API] Registration successful");
  return data;
}

/**
 * Get current user
 * GET /api/auth/me
 */
export async function me(): Promise<MeResponse> {
  console.log("👤 [Auth API] Fetching current user");
  
  const response = await authFetch("/api/auth/me");

  if (!response.ok) {
    console.error("❌ [Auth API] Failed to fetch user:", response.status);
    throw new Error("ME_FAILED");
  }

  const data = await response.json();
  console.log("✅ [Auth API] User fetched successfully");
  return data;
}

/**
 * Logout user
 * POST /api/auth/logout (if exists) or just clear tokens
 */
export async function logout(): Promise<void> {
  console.log("🚪 [Auth API] Logging out");
  
  // Try backend logout if endpoint exists
  try {
    let token: string | null = null;
    
    if (typeof window !== "undefined") {
      token = localStorage.getItem("access_token");
      
      // ✅ Проверка: если токен "undefined" (строка), очищаем его
      if (token === "undefined" || token === "null") {
        console.warn("[Auth API] ⚠️ Found string 'undefined' or 'null' in localStorage during logout");
        token = null;
      }
    }
    
    if (token && typeof token === "string" && token.length > 0) {
      const response = await authFetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        console.log("✅ [Auth API] Backend logout successful");
      }
    }
  } catch (error) {
    console.warn("⚠️ [Auth API] Backend logout failed, clearing local tokens only");
  }
  
  // Always clear local tokens
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token"); // Legacy
    localStorage.removeItem("role"); // Legacy
  }
  
  console.log("✅ [Auth API] Logout complete");
}

/**
 * Auth API object (for backwards compatibility)
 */
export const authApi = {
  login,
  register,
  me,
  logout,
};
