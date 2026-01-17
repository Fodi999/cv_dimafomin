"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string>; // 🆕 Возвращает redirect URL
  register: (name: string, email: string, password: string) => Promise<string>; // 🆕 Возвращает redirect URL
  logout: () => void;
  setAuthData: (token: string, role: string) => void;
  // 🆕 Global modal control
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  // 🆕 Helper to get redirect URL based on role
  getRedirectUrl: (userRole: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  // 🆕 Global modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  // 🔑 Initialize auth from localStorage (ONCE on mount)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
      console.log("[AuthContext] ✅ Restored from localStorage");
    } else {
      console.log("[AuthContext] ℹ️ No auth data found");
    }
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("[AuthContext] 📥 Login response:", data);
      
      // Backend returns { success, data: { token, user: { role, ... } } }
      if (!data.success || !data.data?.token || !data.data?.user) {
        console.error("[AuthContext] ❌ Invalid login response:", data);
        throw new Error(data.message || "Invalid response format");
      }

      const { token, user } = data.data;
      
      // 🔥 Декодировать JWT для получения sub (user ID)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.sub) {
          localStorage.setItem("userId", payload.sub);
          console.log("[AuthContext] ✅ User ID from sub:", payload.sub);
        } else {
          console.warn("[AuthContext] ⚠️ Token missing 'sub' - userId not saved");
        }
      } catch (e) {
        console.error("[AuthContext] ❌ Failed to decode JWT:", e);
      }
      
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      // 🆕 Save to cookies (для middleware)
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`; // 7 days
      document.cookie = `role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
      
      // Update state
      setToken(token);
      setRole(user.role);
      
      console.log("[AuthContext] ✅ Login successful, role:", user.role);
      
      // 🆕 Return redirect URL based on role
      return getRedirectUrl(user.role);
    } catch (error) {
      console.error("[AuthContext] ❌ Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<string> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("[AuthContext] 📥 Register response:", data);
      
      // Backend returns { success, data: { token, user: { role, ... } } }
      if (!data.success || !data.data?.token || !data.data?.user) {
        console.error("[AuthContext] ❌ Invalid register response:", data);
        throw new Error(data.message || "Invalid response format");
      }

      const { token, user } = data.data;
      
      // 🔥 Декодировать JWT для получения sub (user ID)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.sub) {
          localStorage.setItem("userId", payload.sub);
          console.log("[AuthContext] ✅ User ID from sub:", payload.sub);
        } else {
          console.warn("[AuthContext] ⚠️ Token missing 'sub' - userId not saved");
        }
      } catch (e) {
        console.error("[AuthContext] ❌ Failed to decode JWT:", e);
      }
      
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      // 🆕 Save to cookies (для middleware)
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`; // 7 days
      document.cookie = `role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
      
      // Update state
      setToken(token);
      setRole(user.role);
      
      console.log("[AuthContext] ✅ Registration successful, role:", user.role);
      
      // 🆕 Return redirect URL based on role
      return getRedirectUrl(user.role);
    } catch (error) {
      console.error("[AuthContext] ❌ Registration error:", error);
      throw error;
    }
  };

  // 🆕 Helper function: определяет URL редиректа в зависимости от роли
  const getRedirectUrl = (userRole: string): string => {
    // Admin и Superadmin → admin panel
    if (userRole === "admin" || userRole === "super_admin" || userRole === "superadmin") {
      console.log("[AuthContext] 🔐 Admin detected, redirecting to /admin/dashboard");
      return "/admin/dashboard";
    }
    
    // Обычные пользователи → свой профиль
    console.log("[AuthContext] 👤 Regular user, redirecting to /profile");
    return "/profile";
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");  // 🔥 Очистить userId из sub
    
    // 🆕 Clear cookies
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    
    // Clear state
    setToken(null);
    setRole(null);
    
    console.log("[AuthContext] 🚪 Logged out");
  };

  const setAuthData = (newToken: string, newRole: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  // 🆕 Global modal control functions
  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const value: AuthContextType = {
    token,
    role,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    setAuthData,
    getRedirectUrl, // 🆕 Expose helper function
    // Modal control
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
