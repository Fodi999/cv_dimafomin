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
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initRef = useRef(false);

  useEffect(() => {
    // Избежать двойного вызова в React 18 Strict Mode
    if (initRef.current) return;
    initRef.current = true;

    // Check for stored auth token on mount
    const checkAuth = async () => {
      // Используем НОВЫЕ ключи (из AuthContext)
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");
      
      console.log("🔍 UserContext.checkAuth: token exists?", !!token, "user exists?", !!userJson);
      
      // Если есть токен и данные пользователя - восстановить сессию
      if (token && userJson) {
        console.log("✅ Found token and user, attempting to restore session");
        try {
          const userData = JSON.parse(userJson);
          const userId = userData.id;
          console.log("📍 userId:", userId);
          
          try {
            // Попробовать получить актуальные данные профиля
            const profileData: ProfileData = await academyApi.getProfile(userId, token);
            console.log("🔍 Profile data from backend:", JSON.stringify(profileData, null, 2));
            
            // ✅ ПРИОРИТЕТ РОЛЕЙ: JWT роль (из userData) > профиль роль > default
            // JWT роль более надежна, так как выдается системой авторизации
            const userRole = userData.role || profileData.role || "student";
            console.log("📋 User role (JWT priority):", userRole);
            console.log("   - userData.role (JWT):", userData.role);
            console.log("   - profileData.role (backend):", profileData.role);
            
            setUser({
              id: userId,
              name: profileData.name || userData.name || "User",
              email: profileData.email || userData.email || "",
              avatar: profileData.avatarUrl || userData.avatar,
              role: userRole as "student" | "instructor" | "admin",
              level: profileData.level ?? userData.level,
              xp: profileData.xp ?? userData.xp,
              chefTokens: profileData.chefTokens ?? userData.chefTokens,
            });
          } catch (profileError: any) {
            console.error("❌ Failed to fetch user profile:", profileError);
            console.log("📌 Using stored user data from localStorage instead");
            
            // Fallback: использовать данные что уже есть в localStorage
            setUser({
              id: userId,
              name: userData.name || "User",
              email: userData.email || "",
              avatar: userData.avatar,
              role: userData.role as "student" | "instructor" | "admin",
              level: userData.level,
              xp: userData.xp,
              chefTokens: userData.chefTokens,
            });
            
            // На 401/403 очистить данные
            if (profileError?.status === 401 || profileError?.status === 403) {
              console.error("🔐 Auth error detected, clearing authentication");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("user");
            }
          }
        } catch (error) {
          console.error("❌ UserContext.checkAuth error:", error);
        }
      }
      setIsLoading(false);
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
      
      // If user data is included in login response, use it directly
      if (response.user) {
        console.log("📋 User role from response:", userRole);
        console.log("🔑 Full user data:", JSON.stringify(response.user, null, 2));
        
        setUser({
          id: userId,
          name: response.user.name || "User",
          email: response.user.email || email,
          avatar: response.user.avatarUrl,
          role: userRole as "student" | "instructor" | "admin",
          level: response.user.level,
          xp: response.user.xp,
          chefTokens: response.user.chefTokens,
        });
      } else {
        // Otherwise fetch user profile
        const profileData: ProfileData = await academyApi.getProfile(userId, response.token);
        
        // ✅ ПРИОРИТЕТ РОЛЕЙ: response роль (из JWT) > профиль роль
        const finalRole = userRole || profileData.role || "student";
        console.log("📋 User role (JWT priority):", finalRole);
        console.log("   - response.user.role (JWT):", userRole);
        console.log("   - profileData.role (backend):", profileData.role);
        
        setUser({
          id: userId,
          name: profileData.name || "User",
          email: profileData.email || email,
          avatar: profileData.avatarUrl,
          role: finalRole as "student" | "instructor" | "admin",
          level: profileData.level,
          xp: profileData.xp,
          chefTokens: profileData.chefTokens,
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
      
      // If user data is included in register response, use it directly
      if (response.user) {
        console.log("📋 User role from response:", userRole);
        
        setUser({
          id: userId,
          name: response.user.name || name,
          email: response.user.email || email,
          avatar: response.user.avatarUrl,
          role: userRole as "student" | "instructor" | "admin",
          level: response.user.level,
          xp: response.user.xp,
          chefTokens: response.user.chefTokens,
        });
      } else {
        // Otherwise fetch user profile
        const profileData: ProfileData = await academyApi.getProfile(userId, response.token);
        
        // ✅ ПРИОРИТЕТ РОЛЕЙ: response роль (из JWT) > профиль роль
        const finalRole = userRole || profileData.role || "student";
        console.log("📋 User role (JWT priority):", finalRole);
        console.log("   - response.user.role (JWT):", userRole);
        console.log("   - profileData.role (backend):", profileData.role);
        
        setUser({
          id: userId,
          name: profileData.name || name,
          email: profileData.email || email,
          avatar: profileData.avatarUrl,
          role: finalRole as "student" | "instructor" | "admin",
          level: profileData.level,
          xp: profileData.xp,
          chefTokens: profileData.chefTokens,
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
      const token = localStorage.getItem("authToken");
      
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

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
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
