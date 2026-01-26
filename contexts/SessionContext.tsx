"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth, type User as AuthUser } from "./AuthContext";

/**
 * 🔐 SESSION CONTEXT - ChefOS Architecture 2026
 * 
 * ✅ ПРАВИЛО 2026: Единственный источник данных — AuthContext
 * ❌ НЕ ВЫЧИСЛЯЕТ роли
 * ❌ НЕ ВЫЗЫВАЕТ /api/user/profile
 * ✅ Только проецирует состояние из AuthContext
 * 
 * SessionContext добавляет:
 * - Расширенные данные профиля (name, avatar, tokens)
 * - Управление токенами (deduct/add)
 * - Обновление профиля
 */

export type UserRole = AuthUser["role"]; // ✅ Используем типы из AuthContext
export type AppMode = 'admin' | 'customer' | 'chef';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  role: UserRole;
  level?: number;
  xp?: number;
  chefTokens?: number;
}

interface Session {
  userId: string;
  role: UserRole;
  mode: AppMode;
  user: SessionUser;
}

interface SessionContextType {
  session: Session | null;
  user: SessionUser | null; // Для обратной совместимости
  isLoading: boolean;
  isAdmin: boolean; // Helper для быстрой проверки
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<SessionUser>) => Promise<void>;
  deductTokens: (amount: number, reason: string) => Promise<{ success: boolean; newBalance?: number; error?: string }>;
  addTokens: (amount: number, reason: string) => Promise<{ success: boolean; newBalance?: number; error?: string }>;
  refreshBalance: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // ✅ 2026: Sync with AuthContext (no API calls)
  // КРИТИЧНО: Обновляется КАЖДЫЙ РАЗ при изменении auth.user (для reloadMe())
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user) {
      setSession(null);
      setProfileLoaded(false);
      return;
    }

    // ✅ 2026: ВСЕГДА обновляем session при изменении auth.user
    // Убрали проверку profileLoaded - это важно для reloadMe()
    console.log("[SessionContext] 🔄 AuthContext.user changed, updating session");
    createSessionFromAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]); // ✅ Зависимость ТОЛЬКО от auth.user

  /**
   * ✅ 2026: Create session from AuthContext (no API calls, no role mapping)
   * 
   * ПРАВИЛО: НЕ ВЫЧИСЛЯЕМ роли, только читаем из AuthContext
   */
  const createSessionFromAuth = () => {
    if (!auth.user) return;

    setIsLoading(true);
    console.log("[SessionContext] 📥 Creating session from AuthContext");

    try {
      // ✅ Берем роль напрямую из AuthContext (единственный источник правды)
      const authUser = auth.user;
      
      // Try to load extended data from localStorage cache
      const cachedUser = typeof window !== "undefined" 
        ? localStorage.getItem("user") 
        : null;
      
      let extendedData: any = {};
      if (cachedUser) {
        try {
          extendedData = JSON.parse(cachedUser);
        } catch (e) {
          console.warn("[SessionContext] Failed to parse cached user data");
        }
      }

      const user: SessionUser = {
        id: authUser.id,
        email: authUser.email,
        name: extendedData.name || null,
        avatar: extendedData.avatar || null,
        role: authUser.role, // ✅ Напрямую из AuthContext, без вычислений
        level: extendedData.level,
        xp: extendedData.xp,
        chefTokens: extendedData.chefTokens,
        bio: extendedData.bio,
        location: extendedData.location,
        phone: extendedData.phone,
        instagram: extendedData.instagram,
        telegram: extendedData.telegram,
        whatsapp: extendedData.whatsapp,
      };

      // ✅ Determine mode based on role (только чтение, не вычисление)
      let mode: AppMode = 'customer'; // default
      if (authUser.role === 'super_admin' || authUser.role === 'admin') {
        mode = 'admin';
      } else if (authUser.role === 'home_chef' || authUser.role === 'chef_staff') {
        mode = 'chef';
      }

      const newSession: Session = {
        userId: user.id,
        role: authUser.role, // ✅ Напрямую из AuthContext
        mode,
        user,
      };

      setSession(newSession);
      console.log("[SessionContext] ✅ Session created from AuthContext:", { 
        mode, 
        role: authUser.role,
        email: authUser.email 
      });
      
      setProfileLoaded(true);
    } catch (error) {
      console.error("[SessionContext] ❌ Session creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    // ✅ 2026: Refresh from AuthContext
    console.log("[SessionContext] 🔄 Refreshing session from AuthContext");
    setProfileLoaded(false);
    // AuthContext will trigger useEffect which will recreate session
  };

  const updateProfile = async (data: Partial<SessionUser>) => {
    if (!auth.token) throw new Error("Not authenticated");

    const response = await fetch(`/api/user/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Profile update failed");
    }

    await refreshProfile();
  };

  const deductTokens = async (amount: number, reason: string) => {
    if (!auth.token) throw new Error("Not authenticated");

    const response = await fetch(`/api/user/tokens/deduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ amount, reason }),
    });

    const data = await response.json();
    
    if (data.success && session) {
      const updatedUser = { ...session.user, chefTokens: data.newBalance };
      setSession({ ...session, user: updatedUser });
    }

    return data;
  };

  const addTokens = async (amount: number, reason: string) => {
    if (!auth.token) throw new Error("Not authenticated");

    const response = await fetch(`/api/user/tokens/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ amount, reason }),
    });

    const data = await response.json();
    
    if (data.success && session) {
      const updatedUser = { ...session.user, chefTokens: data.newBalance };
      setSession({ ...session, user: updatedUser });
    }

    return data;
  };

  const refreshBalance = async () => {
    await refreshProfile();
  };

  const value: SessionContextType = {
    session,
    user: session?.user || null, // Для обратной совместимости
    isLoading,
    isAdmin: session?.mode === 'admin',
    refreshProfile,
    updateProfile,
    deductTokens,
    addTokens,
    refreshBalance,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

// 🔄 Alias для обратной совместимости
export const useUser = useSession;
