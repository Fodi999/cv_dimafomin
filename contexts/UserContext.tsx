"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  useEffect(() => {
    // Check for stored auth token on mount
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      
      // Validate UUID format (simple check)
      const isValidUUID = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      
      if (!isValidUUID) {
        console.warn("⚠️ Invalid userId format in localStorage, clearing auth data");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        setIsLoading(false);
        return;
      }
      
      if (token && userId) {
        try {
          // Get user profile from backend
          const profileData: ProfileData = await academyApi.getProfile(userId, token);
          
          setUser({
            id: userId,
            name: profileData.name || "User",
            email: profileData.email || "",
            avatar: profileData.avatarUrl,
            role: "student",
            level: profileData.level,
            xp: profileData.xp,
            chefTokens: profileData.chefTokens,
          });
        } catch (error: any) {
          console.error("Failed to fetch user profile:", error);
          
          // Handle server errors (500, 404, etc.) - create minimal user from stored data
          if (error?.status === 500 || error?.status === 404) {
            console.warn("⚠️ Using minimal user data from localStorage");
            // Keep user authenticated but with minimal data
            setUser({
              id: userId,
              name: "User",
              email: "",
              role: "student",
              level: 1,
              xp: 0,
              chefTokens: 0,
            });
          } else {
            // Only clear token on auth errors (401, 403)
            if (error?.status === 401 || error?.status === 403) {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userId");
            }
          }
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
      
      // Store token and userId
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userId", userId);
      
      // If user data is included in login response, use it directly
      if (response.user) {
        setUser({
          id: userId,
          name: response.user.name || "User",
          email: response.user.email || email,
          avatar: response.user.avatarUrl,
          role: "student",
          level: response.user.level,
          xp: response.user.xp,
          chefTokens: response.user.chefTokens,
        });
      } else {
        // Otherwise fetch user profile
        const profileData: ProfileData = await academyApi.getProfile(userId, response.token);
        
        setUser({
          id: userId,
          name: profileData.name || "User",
          email: profileData.email || email,
          avatar: profileData.avatarUrl,
          role: "student",
          level: profileData.level,
          xp: profileData.xp,
          chefTokens: profileData.chefTokens,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
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
      
      // Store token and userId
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userId", userId);
      
      // If user data is included in register response, use it directly
      if (response.user) {
        setUser({
          id: userId,
          name: response.user.name || name,
          email: response.user.email || email,
          avatar: response.user.avatarUrl,
          role: "student",
          level: response.user.level,
          xp: response.user.xp,
          chefTokens: response.user.chefTokens,
        });
      } else {
        // Otherwise fetch user profile
        const profileData: ProfileData = await academyApi.getProfile(userId, response.token);
        
        setUser({
          id: userId,
          name: profileData.name || name,
          email: profileData.email || email,
          avatar: profileData.avatarUrl,
          role: "student",
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
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token");
      
      // Transform 'avatar' to 'avatarUrl' for backend API
      const apiData: any = { ...data };
      if ('avatar' in apiData) {
        apiData.avatarUrl = apiData.avatar;
        delete apiData.avatar;
      }
      
      // API call to update profile
      await academyApi.updateProfile(user.id, apiData, token);
      
      // Update user locally
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    } catch (error) {
      console.error("Update profile failed:", error);
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
