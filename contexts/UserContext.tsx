"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "instructor" | "admin";
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
          id: "1",
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
      // TODO: API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      
      // Mock response
      const mockUser: User = {
        id: "1",
        name: "Dima Fomin",
        email: email,
        avatar: "DF",
        role: "instructor",
      };
      
      localStorage.setItem("authToken", "mock-token-12345");
      setUser(mockUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
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
