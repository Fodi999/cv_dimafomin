"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { ProfileData } from "@/lib/types";

interface User {
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
  role: "student" | "instructor" | "admin" | "superadmin" | "home_chef"; // 🆕 Добавили superadmin
  level?: number;
  xp?: number;
  chefTokens?: number;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  deductTokens: (amount: number, reason: string) => Promise<{ success: boolean; newBalance?: number; error?: string }>;
  addTokens: (amount: number, reason: string) => Promise<{ success: boolean; newBalance?: number; error?: string }>;
  refreshBalance: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const auth = useAuth(); // 🔑 Depend on AuthContext
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // ✅ 2026: Use AuthContext user data (no /api/user/profile calls)
  // КРИТИЧНО: Обновляется КАЖДЫЙ РАЗ при изменении auth.user (для reloadMe())
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user) {
      // Not authenticated - clear user
      setUser(null);
      setProfileLoaded(false);
      return;
    }

    console.log("[UserContext] 🔄 AuthContext.user changed, syncing data");

    // Map AuthContext user to UserContext format
    // AuthContext provides: id, email, role, status
    // UserContext extends with: name, avatar, level, xp, chefTokens, etc.
    const authUser = auth.user;
    
    // Try to load cached extended data from localStorage
    const cachedUser = typeof window !== "undefined" 
      ? localStorage.getItem("user") 
      : null;
    
    let extendedData = {};
    if (cachedUser) {
      try {
        extendedData = JSON.parse(cachedUser);
      } catch (e) {
        console.warn("[UserContext] Failed to parse cached user data");
      }
    }

    setUser({
      id: authUser.id,
      email: authUser.email,
      name: (extendedData as any).name || authUser.email.split('@')[0], // Fallback to email username
      avatar: (extendedData as any).avatar || null,
      role: authUser.role as any, // ✅ 2026: Напрямую из AuthContext
      level: (extendedData as any).level,
      xp: (extendedData as any).xp,
      chefTokens: (extendedData as any).chefTokens,
      bio: (extendedData as any).bio,
      location: (extendedData as any).location,
      phone: (extendedData as any).phone,
      instagram: (extendedData as any).instagram,
      telegram: (extendedData as any).telegram,
      whatsapp: (extendedData as any).whatsapp,
    });

    setProfileLoaded(true);
    setIsLoading(false);
    
    console.log("[UserContext] ✅ User data synced from AuthContext:", {
      id: authUser.id,
      email: authUser.email,
      role: authUser.role,
      status: authUser.status,
    });
  }, [auth.user]); // ✅ Зависимость ТОЛЬКО от auth.user

  const fetchProfile = async () => {
    // 2026: No longer fetches from /api/user/profile
    // Uses AuthContext data instead
    console.log("[UserContext] ⚠️ fetchProfile() called but deprecated - using AuthContext data");
    setIsLoading(false);
  };

  const refreshProfile = async () => {
    // 2026: Refresh from AuthContext instead of API
    console.log("[UserContext] ⚠️ refreshProfile() called - AuthContext handles refresh automatically");
    setProfileLoaded(false);
    // AuthContext will trigger useEffect which will sync data
  };

  const updateProfile = async (data: Partial<User>) => {
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
    
    if (data.success && user) {
      setUser({ ...user, chefTokens: data.newBalance });
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
    
    if (data.success && user) {
      setUser({ ...user, chefTokens: data.newBalance });
    }

    return data;
  };

  const refreshBalance = async () => {
    await refreshProfile();
  };

  const value: UserContextType = {
    user,
    isLoading,
    refreshProfile,
    updateProfile,
    deductTokens,
    addTokens,
    refreshBalance,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
