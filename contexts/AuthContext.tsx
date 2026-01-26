"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as AuthAPI from "@/lib/api/auth";
import { routeByRole, routeByStatus, type UserRole, type UserStatus } from "@/lib/auth/routeByRole";
import { getAccessToken, saveAccessToken, clearTokens } from "@/lib/auth/token-utils";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string>; // Returns redirect URL
  signUp: (email: string, password: string, name?: string) => Promise<string | null>; // Returns redirect URL or null (check email)
  signOut: () => void;
  reloadMe: () => Promise<void>; // ✅ 2026: Перезагрузка user из /api/auth/me
  // Legacy compatibility
  login: (email: string, password: string) => Promise<string>; // Alias for signIn
  register: (name: string, email: string, password: string) => Promise<string>; // Alias for signUp
  logout: () => void; // Alias for signOut
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  // Global modal control
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  getRedirectUrl: (userRole: string) => string;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Global modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  /**
   * Load current user from /api/auth/me
   */
  const loadMe = async () => {
    try {
      // ✅ Безопасно получаем токен (с автоматической валидацией)
      const accessToken = getAccessToken();
      
      if (!accessToken) {
        console.log("[AuthContext] No valid access_token found");
        setUser(null);
        return;
      }
      
      console.log(`[AuthContext] ✅ Valid token found (length: ${accessToken.length})`);

      console.log("[AuthContext] Loading user from /api/auth/me");
      const res = await AuthAPI.me();
      
      if (res.success && res.data) {
        const userData: User = {
          id: res.data.id,
          email: res.data.email,
          role: res.data.role as UserRole,
          status: (res.data.status || "active") as UserStatus,
        };
        
        setUser(userData);
        console.log("[AuthContext] ✅ User loaded:", userData);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("[AuthContext] ❌ Failed to load user:", error);
      // Clear tokens on error
      clearTokens();
      setUser(null);
    }
  };

  // Load user on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadMe();
      setLoading(false);
    })();
  }, []);

  /**
   * Sign in user
   */
  const signIn = async (email: string, password: string): Promise<string> => {
    console.log("[AuthContext] 🔐 Signing in:", email);
    
    const res = await AuthAPI.login(email, password);
    
    if (!res.success || !res.data) {
      throw new Error("Login failed");
    }

    // ✅ Сохраняем токены с валидацией
    const accessToken = res.data.access_token;
    const refreshToken = res.data.refresh_token;
    
    if (!accessToken || typeof accessToken !== "string" || accessToken.length < 50) {
      console.error("[AuthContext] ❌ Invalid access_token received:", accessToken);
      throw new Error("Invalid token received from server");
    }
    
    // ✅ Сохраняем токен через утилиту (с валидацией)
    if (!saveAccessToken(accessToken)) {
      throw new Error("Failed to save token");
    }
    
    // Сохраняем refresh token отдельно
    if (refreshToken && typeof refreshToken === "string") {
      localStorage.setItem("refresh_token", refreshToken);
    }
    
    // Save to cookies (для middleware)
    document.cookie = `token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    
    // Load user data
    if (res.data.user) {
      const userData: User = {
        id: res.data.user.id,
        email: res.data.user.email,
        role: res.data.user.role as UserRole,
        status: (res.data.user.status || "active") as UserStatus,
      };
      setUser(userData);
      
      // ✅ 2026: НЕ сохраняем роль в localStorage (источник правды - только /api/auth/me)
      // Legacy cookies для обратной совместимости (будут удалены позже)
      document.cookie = `role=${userData.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
      
      console.log("[AuthContext] ✅ Sign in successful, user:", userData);
      
      // Check status first
      const statusRoute = routeByStatus(userData.status);
      if (statusRoute) {
        return statusRoute;
      }
      
      // Return route by role
      return routeByRole(userData.role);
    } else {
      // If user not in response, fetch it
      await loadMe();
      if (user) {
        const statusRoute = routeByStatus(user.status);
        if (statusRoute) return statusRoute;
        return routeByRole(user.role);
      }
      return "/marketplace"; // Fallback
    }
  };

  /**
   * Sign up user
   * Returns redirect URL or null (if email verification needed)
   */
  const signUp = async (
    email: string,
    password: string,
    name?: string
  ): Promise<string | null> => {
    console.log("[AuthContext] 📝 Signing up:", email);
    
    const res = await AuthAPI.register(email, password, name);
    
    if (!res.success) {
      throw new Error("Registration failed");
    }

    // Scenario A: Email verification required
    // Backend doesn't return tokens, user needs to verify email
    if (!res.data || !res.data.id) {
      console.log("[AuthContext] 📧 Registration successful, email verification required");
      return null; // Signal to show "check email" message
    }

    // Scenario B: Auto-login after registration
    // Backend returns tokens, auto-login user
    if (res.data.id) {
      // Try to login automatically
      try {
        const loginRes = await AuthAPI.login(email, password);
        if (loginRes.success && loginRes.data) {
          localStorage.setItem("access_token", loginRes.data.access_token);
          localStorage.setItem("refresh_token", loginRes.data.refresh_token);
          localStorage.setItem("token", loginRes.data.access_token); // Legacy
          
          if (loginRes.data.user) {
            const userData: User = {
              id: loginRes.data.user.id,
              email: loginRes.data.user.email,
              role: loginRes.data.user.role as UserRole,
              status: (loginRes.data.user.status || "active") as UserStatus,
            };
            setUser(userData);
            // ✅ 2026: НЕ сохраняем роль в localStorage
            
            const statusRoute = routeByStatus(userData.status);
            if (statusRoute) return statusRoute;
            return routeByRole(userData.role);
          }
        }
      } catch (error) {
        console.warn("[AuthContext] Auto-login failed, user needs to login manually");
        return null; // User needs to login manually
      }
    }

    return null; // Default: show "check email" message
  };

  /**
   * ✅ 2026: Reload user from /api/auth/me
   * 
   * КРИТИЧНО: Вызывается после любых изменений:
   * - После изменения роли админом
   * - После изменения статуса
   * - После обновления профиля
   * - При возврате фокуса (опционально)
   */
  const reloadMe = async () => {
    console.log("[AuthContext] 🔄 Reloading user from /api/auth/me");
    await loadMe();
  };

  /**
   * Sign out user
   */
  const signOut = () => {
    console.log("[AuthContext] 🚪 Signing out");
    
    // Call backend logout if available
    AuthAPI.logout().catch(() => {
      // Ignore errors, just clear local tokens
    });
    
    // Clear all tokens через утилиту
    clearTokens();
    
    // Clear additional legacy items
    if (typeof window !== "undefined") {
      localStorage.removeItem("user"); // Legacy
      localStorage.removeItem("userId"); // Legacy
      localStorage.removeItem("role"); // ✅ 2026: Удаляем role (не должен храниться)
      
      // Clear cookies
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "role=; path=/; max-age=0";
    }
    
    setUser(null);
    console.log("[AuthContext] ✅ Sign out complete");
  };

  /**
   * Get redirect URL by role (legacy compatibility)
   */
  const getRedirectUrl = (userRole: string): string => {
    return routeByRole(userRole as UserRole);
  };

  /**
   * Global modal control
   */
  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // ✅ 2026: Мемоизируем token и role
  const token = typeof window !== "undefined" 
    ? (localStorage.getItem("access_token") || localStorage.getItem("token"))
    : null;
  
  // ✅ 2026: Роль ТОЛЬКО из user (НЕ из localStorage!)
  const role = user?.role || null;

  const value: AuthState = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    reloadMe, // ✅ 2026: Публичный метод перезагрузки
    // Legacy compatibility aliases
    login: signIn,
    register: async (name: string, email: string, password: string) => {
      const result = await signUp(email, password, name);
      return result || "/login"; // Return login page if email verification needed
    },
    logout: signOut,
    token,
    role,
    isAuthenticated: !!user,
    // Modal control
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    getRedirectUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
