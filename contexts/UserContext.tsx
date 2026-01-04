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
  role: "student" | "instructor" | "admin" | "home_chef";
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

  // 🔄 Fetch profile when authenticated
  useEffect(() => {
    if (!auth.isAuthenticated) {
      // Not authenticated - clear user
      setUser(null);
      return;
    }

    if (user) {
      // Already loaded - don't fetch again
      console.log("[UserContext] ℹ️ Profile already loaded, skipping");
      return;
    }

    fetchProfile();
  }, [auth.isAuthenticated]); // Only depend on isAuthenticated

  const fetchProfile = async () => {
    if (!auth.token) return;

    setIsLoading(true);
    console.log("[UserContext] 📥 Fetching profile from database...");

    try {
      const response = await fetch(`/api/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("[UserContext] ⚠️ Token expired (401/403), logging out");
          auth.logout();
          return;
        }
        throw new Error(`Profile fetch failed: ${response.status}`);
      }

      const profileData = await response.json();
      const userData = profileData.data || profileData;

      // 🔍 DEBUG: Check user role
      console.log("[UserContext] 🔍 User data from backend:", {
        email: userData.email,
        role: userData.role,
        hasRole: !!userData.role,
        roleType: typeof userData.role,
      });

      setUser({
        id: userData.id || userData.userId,
        email: userData.email,
        name: userData.name || null,
        avatar: userData.avatar || null,
        role: userData.role,
        level: userData.level,
        xp: userData.xp,
        chefTokens: userData.chefTokens,
        bio: userData.bio,
        location: userData.location,
        phone: userData.phone,
        instagram: userData.instagram,
        telegram: userData.telegram,
        whatsapp: userData.whatsapp,
      });

      // Cache in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("[UserContext] ✅ Profile loaded successfully with role:", userData.role || "NO ROLE");
    } catch (error) {
      console.error("[UserContext] ❌ Profile fetch error:", error);
      
      // Fallback to localStorage cache
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser);
          setUser(userData);
          console.log("[UserContext] 📦 Using cached profile");
        } catch (e) {
          console.error("[UserContext] ❌ Failed to parse cached user");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    setUser(null); // Clear current user to trigger re-fetch
    await fetchProfile();
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
