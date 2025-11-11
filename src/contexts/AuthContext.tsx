/**
 * Context для управления авторизацией
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, User, UserRole } from '../types';
import { login as apiLogin, logout as apiLogout, getStoredToken, getStoredRole } from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Проверка авторизации при загрузке компонента
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Проверить, есть ли сохраненный токен и роль
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const storedToken = getStoredToken();
      const storedRole = getStoredRole() as UserRole | null;

      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);

        // Пытаемся загрузить данные пользователя
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // При ошибке очищаем все данные
      setUser(null);
      setToken(null);
      setRole(null);
      apiLogout();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Логин
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiLogin(email, password);

      setToken(response.token);
      setRole(response.role);

      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Логаут
   */
  const logout = () => {
    apiLogout();
    setUser(null);
    setToken(null);
    setRole(null);
  };

  const value: AuthContextType = {
    user,
    token,
    role,
    isLoading,
    isAuthenticated: !!token && !!role,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Хук для использования AuthContext
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен быть использован внутри AuthProvider');
  }
  return context;
}
