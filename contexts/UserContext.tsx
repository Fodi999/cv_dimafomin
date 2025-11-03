"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { generateUUID } from "@/lib/uuid";

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
      if (token) {
        // TODO: Validate token with API
        // const userData = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        // setUser(await userData.json());
        
        // Mock user for now
        setUser({
          id: "ef03cd81-71fd-429f-bb5f-8be5c9172ca8", // Dima Fomin UUID
          name: "Dima Fomin",
          email: "fodi85999@gmail.com",
          avatar: "DF",
          role: "instructor",
        });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: API call to backend
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      // localStorage.setItem("authToken", data.token);
      // 
      // IMPORTANT: When implementing real API:
      // - Get userId from backend response: data.user.id (UUID format)
      // - Store token in localStorage for subsequent API calls
      // - Use getUserIdFromToken() to extract userId from JWT if needed
      
      // Check if user data exists in localStorage (from registration)
      const storedUserData = localStorage.getItem("userData");
      let mockUser: User;
      
      if (storedUserData) {
        mockUser = JSON.parse(storedUserData);
      } else {
        mockUser = {
          id: "ef03cd81-71fd-429f-bb5f-8be5c9172ca8", // Dima Fomin UUID
          name: "Dima Fomin",
          email: email,
          avatar: "DF",
          role: "instructor",
        };
      }
      
      localStorage.setItem("authToken", "mock-token-12345");
      setUser(mockUser);
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
      // TODO: API call to backend
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   body: JSON.stringify({ name, email, password }),
      // });
      // const data = await response.json();
      // localStorage.setItem("authToken", data.token);
      // 
      // IMPORTANT: When implementing real API:
      // - Backend will generate UUID and return user object with id
      // - Don't generate UUID on frontend - use backend's UUID
      // - Save full user object from response: setUser(data.user)
      
      // Create new user from registration data (MOCK - remove when API ready)
      const newUser: User = {
        id: generateUUID(), // Generate unique UUID for new user
        name: name,
        email: email,
        avatar: name.charAt(0).toUpperCase() + (name.split(' ')[1]?.charAt(0).toUpperCase() || ''),
        role: "student",
      };
      
      localStorage.setItem("authToken", "mock-token-" + Date.now());
      localStorage.setItem("userData", JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // TODO: API call
      // const response = await fetch('/api/user/profile', {
      //   method: 'PATCH',
      //   body: JSON.stringify(data),
      //   headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      // });
      
      // Update user locally
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      // Save to localStorage for persistence
      localStorage.setItem("userData", JSON.stringify(updatedUser));
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
      // TODO: Upload to Cloudinary or your storage
      // const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await fetch('/api/upload/avatar', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const { url } = await response.json();
      
      // Mock: Create object URL for preview
      const avatarUrl = URL.createObjectURL(file);
      
      // Update user avatar
      if (user) {
        const updatedUser = { ...user, avatar: avatarUrl };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
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
