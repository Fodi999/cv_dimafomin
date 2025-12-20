"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuthData: (token: string, role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

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

  const login = async (email: string, password: string) => {
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
      
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      // Update state
      setToken(token);
      setRole(user.role);
      
      console.log("[AuthContext] ✅ Login successful, role:", user.role);
    } catch (error) {
      console.error("[AuthContext] ❌ Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
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
      
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      // Update state
      setToken(token);
      setRole(user.role);
      
      console.log("[AuthContext] ✅ Registration successful, role:", user.role);
    } catch (error) {
      console.error("[AuthContext] ❌ Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    
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

  const value: AuthContextType = {
    token,
    role,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    setAuthData,
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
