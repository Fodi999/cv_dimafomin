"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

/**
 * 🔐 SESSION CONTEXT - ChefOS Architecture 2026
 * 
 * Определяет режим работы приложения:
 * - ADMIN MODE: super_admin (владелец бизнеса)
 * - CUSTOMER MODE: customer (покупатель)
 * 
 * Это НЕ два приложения, а две зоны доступа в одном UI.
 */

export type UserRole = 'super_admin' | 'customer';
export type AppMode = 'admin' | 'customer';

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

  // 🔄 Fetch profile when authenticated
  useEffect(() => {
    if (!auth.isAuthenticated) {
      setSession(null);
      setProfileLoaded(false);
      return;
    }

    if (profileLoaded) {
      console.log("[SessionContext] ℹ️ Profile already loaded, skipping");
      return;
    }

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated]);

  const fetchProfile = async () => {
    if (!auth.token) return;

    setIsLoading(true);
    console.log("[SessionContext] 📥 Fetching profile from database...");

    try {
      const response = await fetch(`/api/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (errorData.error?.code === 'UNAUTHORIZED' || errorData.error?.code === 'FORBIDDEN') {
          console.warn("[SessionContext] ⚠️ Authentication failed, logging out");
          auth.logout();
          return;
        }
        
        throw new Error(`Profile fetch failed: ${errorData.error?.message || response.status}`);
      }

      const profileData = await response.json();
      const userData = profileData.data || profileData;

      console.log("[SessionContext] 🔍 User data from backend:", {
        email: userData.email,
        role: userData.role,
        hasRole: !!userData.role,
      });

      // 🎯 Map backend role to ChefOS roles
      let mappedRole: UserRole = 'customer';
      if (userData.role === 'superadmin' || userData.role === 'super_admin') {
        mappedRole = 'super_admin';
      }

      const user: SessionUser = {
        id: userData.id || userData.userId,
        email: userData.email,
        name: userData.name || null,
        avatar: userData.avatar || null,
        role: mappedRole,
        level: userData.level,
        xp: userData.xp,
        chefTokens: userData.chefTokens,
        bio: userData.bio,
        location: userData.location,
        phone: userData.phone,
        instagram: userData.instagram,
        telegram: userData.telegram,
        whatsapp: userData.whatsapp,
      };

      // 🔐 Determine mode based on role
      const mode: AppMode = mappedRole === 'super_admin' ? 'admin' : 'customer';

      const newSession: Session = {
        userId: user.id,
        role: mappedRole,
        mode,
        user,
      };

      setSession(newSession);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("[SessionContext] ✅ Session created:", { mode, role: mappedRole });
      
      setProfileLoaded(true);
    } catch (error) {
      console.error("[SessionContext] ❌ Profile fetch error:", error);
      
      // Fallback to localStorage cache
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser);
          let mappedRole: UserRole = 'customer';
          if (userData.role === 'superadmin' || userData.role === 'super_admin') {
            mappedRole = 'super_admin';
          }

          const user: SessionUser = {
            id: userData.id || userData.userId,
            email: userData.email,
            name: userData.name || null,
            avatar: userData.avatar || null,
            role: mappedRole,
            level: userData.level,
            xp: userData.xp,
            chefTokens: userData.chefTokens,
            bio: userData.bio,
            location: userData.location,
            phone: userData.phone,
            instagram: userData.instagram,
            telegram: userData.telegram,
            whatsapp: userData.whatsapp,
          };

          const mode: AppMode = mappedRole === 'super_admin' ? 'admin' : 'customer';

          setSession({
            userId: user.id,
            role: mappedRole,
            mode,
            user,
          });
          console.log("[SessionContext] 📦 Using cached profile");
          setProfileLoaded(true);
        } catch (e) {
          console.error("[SessionContext] ❌ Failed to parse cached user");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    setProfileLoaded(false);
    await fetchProfile();
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
