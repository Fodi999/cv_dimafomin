"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { authApi, academyApi, uploadApi } from "@/lib/api";
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
  role: "student" | "instructor" | "admin";
  level?: number;
  xp?: number;
  chefTokens?: number;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  deductTokens: (amount: number, reason: string) => Promise<{ success: boolean; newBalance?: number; error?: string }>;
  addTokens: (amount: number, reason: string) => Promise<{ success: boolean; newBalance?: number; error?: string }>;
  refreshBalance: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initRef = useRef(false);

  // 🔧 HMR Debug logging
  if (process.env.NODE_ENV === "development") {
    useEffect(() => {
      console.log("[⚙️ HMR] UserContext: Development mode detected, context may reinitialize");
    }, []);
  }

  useEffect(() => {
    // Избежать двойного вызова в React 18 Strict Mode
    if (initRef.current) return;
    initRef.current = true;

    // Check for stored auth token on mount
    const checkAuth = async () => {
      console.log("🔐 [UserContext] checkAuth starting...");
      
      // Читаем токен и роль из localStorage
      const token = localStorage.getItem("token");
      const roleJson = localStorage.getItem("role");
      
      console.log("🔍 UserContext.checkAuth: token exists?", !!token, "role exists?", !!roleJson);
      
      // Если есть токен - ВСЕГДА делаем запрос к БД для свежих данных
      if (token && roleJson) {
        console.log("✅ Found token and role - fetching fresh data from database");
        try {
          const storedRole = roleJson as "student" | "instructor" | "admin";
          
          // � ГЛАВНОЕ: Всегда делаем запрос к БД вместо использования localStorage
          // Это гарантирует что user имеет самые свежие данные
          const response = await fetch(
            "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/profile",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const profileData = await response.json();
          console.log("📥 Fresh profile data from DB:", profileData);

          // Обновляем user с данными из БД
          const userData = profileData.data || profileData;
          const userId = userData.id || userData.userId;
          
          if (!userId) {
            throw new Error("User ID not found in response");
          }

          const userRole = storedRole || userData.role || "student";
          console.log("� Setting user with fresh DB data, role:", userRole);
          
          setUser({
            id: userId,
            name: userData.name || "User",
            email: userData.email || "",
            avatar: userData.avatarUrl || userData.avatar,
            role: userRole,
            level: userData.level,
            xp: userData.xp,
            chefTokens: userData.chefTokens || userData.walletBalance,
          });
          
          console.log("✅ User state set with fresh DB data");
        } catch (error: any) {
          console.error("❌ Failed to fetch fresh profile from DB:", error);
          
          // На 401/403 очистить данные
          if (error?.status === 401 || error?.status === 403) {
            console.error("🔐 Auth error detected, clearing authentication");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            setUser(null);
          } else {
            // Fallback: если ошибка сети, используем localStorage как backup
            console.log("📌 Using localStorage as fallback due to network error");
            const userJson = localStorage.getItem("user");
            if (userJson) {
              try {
                const userData = JSON.parse(userJson);
                setUser({
                  ...userData,
                  role: (roleJson as "student" | "instructor" | "admin") || userData.role,
                });
              } catch (parseError) {
                console.error("❌ Failed to parse cached user data");
                setUser(null);
              }
            }
          }
        }
      } else if (token || localStorage.getItem("user")) {
        // ⚠️ Partial data detected - inconsistent state, clear all
        console.warn("⚠️ Partial auth data detected, clearing");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        setUser(null);
      } else {
        // No auth data - completely normal
        console.log("ℹ️ No auth data found - user is not logged in");
      }
      
      // ⏱️ ВАЖНО: setTimeout(150) гарантирует завершение hydration
      // перед снятием флага isLoading
      setTimeout(() => {
        setIsLoading(false);
        console.log("✅ UserContext.checkAuth complete - isLoading set to false");
      }, 150);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // API call to backend
      const response = await authApi.login(email, password);
      console.log("🔐 Login response received:", JSON.stringify(response, null, 2));
      
      // Extract userId from response (can be in userId or user.id or user.userId)
      const userId = response.userId || response.user?.id || response.user?.userId;
      
      if (!userId) {
        throw new Error("User ID not found in response");
      }
      
      // Validate UUID format
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      
      if (!isValidUUID) {
        console.error("❌ Invalid userId format received from backend:", userId);
        throw new Error("Invalid user ID format received from server");
      }
      
      // Сохраняем в НОВЫЕ ключи (совместимо с AuthContext)
      const userRole = response.user?.role || "student";
      const userObj = {
        id: userId,
        name: response.user?.name || "User",
        email: response.user?.email || email,
        role: userRole,
        level: response.user?.level,
        xp: response.user?.xp,
        chefTokens: response.user?.chefTokens,
      };
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("user", JSON.stringify(userObj));
      
      console.log("💾 Stored auth data with new keys (token, role, user)");
      console.log("📋 User role from response:", userRole);
      
      // 🔥 ВАЖНО: Всегда делаем запрос к backend для получения полного профиля с аватаром
      console.log("� Fetching full profile from backend to get avatar...");
      try {
        const profileData: ProfileData = await academyApi.getProfile(userId, response.token);
        console.log("✅ Full profile from backend:", JSON.stringify(profileData, null, 2));
        
        // ✅ ПРИОРИТЕТ РОЛЕЙ: response роль (из JWT) > профиль роль
        const finalRole = userRole || profileData.role || "student";
        
        const fullUserData = {
          id: userId,
          name: profileData.name || response.user?.name || "User",
          email: profileData.email || response.user?.email || email,
          avatar: profileData.avatarUrl, // ✅ Аватар из полного профиля
          role: finalRole as "student" | "instructor" | "admin",
          level: profileData.level ?? response.user?.level,
          xp: profileData.xp ?? response.user?.xp,
          chefTokens: profileData.chefTokens ?? response.user?.chefTokens,
        };
        
        console.log("🖼️ Avatar URL:", profileData.avatarUrl);
        console.log("📦 Full user object to store:", fullUserData);
        
        // Обновляем localStorage с полными данными
        localStorage.setItem("user", JSON.stringify(fullUserData));
        
        setUser(fullUserData);
      } catch (profileError: any) {
        console.warn("⚠️ Failed to fetch full profile from backend, using login response data:", profileError?.message);
        
        // Fallback: использовать данные из login response
        setUser({
          id: userId,
          name: response.user?.name || "User",
          email: response.user?.email || email,
          avatar: response.user?.avatarUrl, // Может быть undefined
          role: userRole as "student" | "instructor" | "admin",
          level: response.user?.level,
          xp: response.user?.xp,
          chefTokens: response.user?.chefTokens,
        });
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // API call to backend
      const response = await authApi.register(name, email, password);
      
      // Extract userId from response (can be in userId or user.id or user.userId)
      const userId = response.userId || response.user?.id || response.user?.userId;
      
      if (!userId) {
        throw new Error("User ID not found in response");
      }
      
      // Validate UUID format
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      
      if (!isValidUUID) {
        console.error("❌ Invalid userId format received from backend:", userId);
        throw new Error("Invalid user ID format received from server");
      }
      
      // Сохраняем в НОВЫЕ ключи (совместимо с AuthContext)
      const userRole = response.user?.role || "student";
      const userObj = {
        id: userId,
        name: response.user?.name || name,
        email: response.user?.email || email,
        role: userRole,
        level: response.user?.level,
        xp: response.user?.xp,
        chefTokens: response.user?.chefTokens,
      };
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("user", JSON.stringify(userObj));
      
      console.log("💾 Stored auth data with new keys (token, role, user)");
      
      // 🔥 ВАЖНО: ВСЕГДА делаем запрос к backend для получения полного профиля с аватаром
      console.log("📥 Fetching full profile from backend to get avatar...");
      try {
        const profileData: ProfileData = await academyApi.getProfile(userId, response.token);
        console.log("✅ Full profile from backend:", JSON.stringify(profileData, null, 2));
        
        // ✅ ПРИОРИТЕТ РОЛЕЙ: response роль (из JWT) > профиль роль
        const finalRole = userRole || profileData.role || "student";
        
        const fullUserData = {
          id: userId,
          name: profileData.name || response.user?.name || name || "User",
          email: profileData.email || response.user?.email || email,
          avatar: profileData.avatarUrl, // ✅ Аватар из полного профиля
          role: finalRole as "student" | "instructor" | "admin",
          level: profileData.level ?? response.user?.level,
          xp: profileData.xp ?? response.user?.xp,
          chefTokens: profileData.chefTokens ?? response.user?.chefTokens,
        };
        
        console.log("🖼️ Avatar URL:", profileData.avatarUrl);
        console.log("📦 Full user object to store:", fullUserData);
        
        // Обновляем localStorage с полными данными
        localStorage.setItem("user", JSON.stringify(fullUserData));
        
        setUser(fullUserData);
      } catch (profileError: any) {
        console.warn("⚠️ Failed to fetch full profile from backend, using registration response data:", profileError?.message);
        
        // Fallback: использовать данные из registration response
        setUser({
          id: userId,
          name: response.user?.name || name || "User",
          email: response.user?.email || email,
          avatar: response.user?.avatarUrl, // Может быть undefined
          role: userRole as "student" | "instructor" | "admin",
          level: response.user?.level,
          xp: response.user?.xp,
          chefTokens: response.user?.chefTokens,
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Используем НОВЫЕ ключи (совместимо с AuthContext)
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
    console.log("🚪 User logged out, cleared token/role/user");
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      console.error("❌ UserContext: No user available");
      return;
    }
    
    console.log("🔄 UserContext: updateProfile called with data:", data);
    setIsLoading(true);
    try {
      // Используем НОВЫЙ ключ
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");
      
      console.log("🔐 UserContext: auth token found");
      
      // Transform 'avatar' to 'avatarUrl' for backend API
      const apiData: any = { ...data };
      if ('avatar' in apiData) {
        console.log("🖼️ UserContext: transforming avatar to avatarUrl");
        apiData.avatarUrl = apiData.avatar;
        delete apiData.avatar;
      }
      
      console.log("📡 UserContext: sending update to backend with data:", apiData);
      // API call to update profile
      await academyApi.updateProfile(user.id, apiData, token);
      console.log("✅ UserContext: backend update successful");
      
      // Update user locally
      const updatedUser = { ...user, ...data };
      console.log("👤 UserContext: updating local user state:", updatedUser);
      setUser(updatedUser);
      
      // Обновить localStorage с НОВЫМИ ключами
      const userObj = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        level: updatedUser.level,
        xp: updatedUser.xp,
        chefTokens: updatedUser.chefTokens,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      console.log("💾 Updated user in localStorage");
      console.log("✨ UserContext: profile updated successfully");
    } catch (error) {
      console.error("❌ UserContext: Update profile failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Upload to Cloudinary via backend
      const result = await uploadApi.uploadImageFile(file, token || undefined);
      const avatarUrl = result.url;
      
      // Update user avatar
      if (user) {
        await updateProfile({ avatar: avatarUrl });
      }
      
      return avatarUrl;
    } catch (error) {
      console.error("Upload avatar failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ====== TOKEN MANAGEMENT METHODS ======

  /**
   * Deduct tokens from user balance (for AI requests, purchases, etc)
   */
  const deductTokens = async (
    amount: number,
    reason: string
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      console.log(`💸 Deducting ${amount} tokens from user ${user.id} for: ${reason}`);

      const response = await fetch("/api/ai-assistant/deduct-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          amount,
          reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Token deduction failed:", error);
        return {
          success: false,
          error: error.error || error.message || "Failed to deduct tokens",
        };
      }

      const data = await response.json();
      const newBalance = data.data?.newBalance || data.newBalance || 0;

      // Update user balance optimistically
      setUser((prevUser) =>
        prevUser ? { ...prevUser, chefTokens: newBalance } : null
      );

      // Update localStorage
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const userData = JSON.parse(userJson);
        userData.chefTokens = newBalance;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      console.log(`✅ Tokens deducted successfully. New balance: ${newBalance}`);
      return { success: true, newBalance };
    } catch (error: any) {
      console.error("❌ Error deducting tokens:", error);
      return { success: false, error: error.message || "Server error" };
    }
  };

  /**
   * Add tokens to user balance (for earnings, bonuses, etc)
   */
  const addTokens = async (
    amount: number,
    reason: string
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      console.log(`➕ Adding ${amount} tokens to user ${user.id} for: ${reason}`);

      const response = await fetch("/api/ai-assistant/add-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          amount,
          reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Token addition failed:", error);
        return {
          success: false,
          error: error.error || error.message || "Failed to add tokens",
        };
      }

      const data = await response.json();
      const newBalance = data.data?.newBalance || data.newBalance || 0;

      // Update user balance optimistically
      setUser((prevUser) =>
        prevUser ? { ...prevUser, chefTokens: newBalance } : null
      );

      // Update localStorage
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const userData = JSON.parse(userJson);
        userData.chefTokens = newBalance;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      console.log(`✅ Tokens added successfully. New balance: ${newBalance}`);
      return { success: true, newBalance };
    } catch (error: any) {
      console.error("❌ Error adding tokens:", error);
      return { success: false, error: error.message || "Server error" };
    }
  };

  /**
   * Refresh token balance from backend
   */
  const refreshBalance = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      console.log(`🔄 Refreshing balance for user ${user.id}`);

      const response = await fetch(`/api/ai-assistant/get-balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        console.error("❌ Failed to refresh balance");
        return;
      }

      const data = await response.json();
      const newBalance = data.data?.balance || data.balance || 0;

      // Update user balance
      setUser((prevUser) =>
        prevUser ? { ...prevUser, chefTokens: newBalance } : null
      );

      // Update localStorage
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const userData = JSON.parse(userJson);
        userData.chefTokens = newBalance;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      console.log(`✅ Balance refreshed: ${newBalance} CT`);
    } catch (error) {
      console.error("❌ Error refreshing balance:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        deductTokens,
        addTokens,
        refreshBalance,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
