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
      
      console.log("🔍 checkAuth: token exists?", !!token, "userId exists?", !!userId);
      
      // If we have a valid token, try to use it regardless of userId format
      if (token && userId) {
        console.log("✅ Found token and userId, attempting to restore session");
        console.log("📍 userId:", userId);
        try {
          // Get user profile from backend
          const profileData: ProfileData = await academyApi.getProfile(userId, token);
          console.log("🔍 Profile data from backend:", JSON.stringify(profileData, null, 2));
          
          const userRole = profileData.role || "student";
          console.log("📋 User role from profile (checkAuth):", userRole);
          
          setUser({
            id: userId,
            name: profileData.name || "User",
            email: profileData.email || "",
            avatar: profileData.avatarUrl,
            role: userRole as "student" | "instructor" | "admin",
            level: profileData.level,
            xp: profileData.xp,
            chefTokens: profileData.chefTokens,
          });
        } catch (error: any) {
          console.error("❌ Failed to fetch user profile:", error);
          console.warn("⚠️ Backend error fetching profile, trying to use JWT token data");
          
          // ALWAYS try to extract user info from JWT token as fallback
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const decoded = JSON.parse(atob(tokenParts[1]));
              const userRole = decoded.role || "student";
              console.log("📋 User role from JWT token (fallback):", userRole);
              console.log("🔑 Full JWT decoded:", JSON.stringify(decoded, null, 2));
              
              setUser({
                id: userId,
                name: decoded.name || "User",
                email: decoded.email || decoded.sub || "",
                role: userRole as "student" | "instructor" | "admin",
                level: decoded.level || 1,
                xp: decoded.xp || 0,
                chefTokens: decoded.chefTokens || 0,
              });
              console.log("✅ Successfully restored user from JWT token");
            } else {
              throw new Error("Invalid token format");
            }
          } catch (tokenError) {
            console.error("❌ Could not decode JWT:", tokenError);
            console.warn("⚠️ Using minimal user data with student role as fallback");
            // Final fallback: minimal user data
            setUser({
              id: userId,
              name: "User",
              email: "",
              role: "student",
              level: 1,
              xp: 0,
              chefTokens: 0,
            });
          }
          
          // Only clear token on auth errors (401, 403)
          if (error?.status === 401 || error?.status === 403) {
            console.error("🔐 Auth error detected, clearing authentication");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");
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
      
      // Store token and userId
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userId", userId);
      
      // If user data is included in login response, use it directly
      if (response.user) {
        const userRole = response.user.role || "student";
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
        
        const userRole = profileData.role || "student";
        console.log("📋 User role from profile:", userRole);
        console.log("🔍 Full profile data:", JSON.stringify(profileData, null, 2));
        
        setUser({
          id: userId,
          name: profileData.name || "User",
          email: profileData.email || email,
          avatar: profileData.avatarUrl,
          role: userRole as "student" | "instructor" | "admin",
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
      
      // Store token and userId
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userId", userId);
      
      // If user data is included in register response, use it directly
      if (response.user) {
        const userRole = response.user.role || "student";
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
        
        const userRole = profileData.role || "student";
        console.log("📋 User role from profile:", userRole);
        
        setUser({
          id: userId,
          name: profileData.name || name,
          email: profileData.email || email,
          avatar: profileData.avatarUrl,
          role: userRole as "student" | "instructor" | "admin",
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
    if (!user) {
      console.error("❌ UserContext: No user available");
      return;
    }
    
    console.log("🔄 UserContext: updateProfile called with data:", data);
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
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
