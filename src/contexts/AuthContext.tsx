/**
 * Context для управления авторизацией
 * 
 * ✅ Практики:
 * 1. Проверка токена только в useEffect (после маунта)
 * 2. Хранение токена ТОЛЬКО в localStorage (не в state)
 * 3. Использование window.location для редиректов (избегаем HMR проблем)
 * 4. Миграция старых ключей при загрузке
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { getToken, getRole, getUser, setAuth, logout as logoutUtil, checkAuth as checkAuthUtil } from '../utils/auth';
import { getApiUrl } from '../utils/api-url';
import { migrateStorageKeys } from '../utils/storage-migration';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'admin' | 'user' | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Флаг чтобы избежать дублирующихся инициализаций
  const initRef = useRef(false);

  /**
   * Проверка авторизации при загрузке приложения
   * Вызывается только один раз благодаря useRef
   */
  useEffect(() => {
    // Избежать двойного вызова в Strict Mode (React 18)
    if (initRef.current) return;
    initRef.current = true;

    const initAuth = async () => {
      console.log('[AuthContext] Инициализация авторизации...');

      // МИГРАЦИЯ: Перенести старые ключи в новые (если они есть)
      migrateStorageKeys();

      const storedToken = getToken();
      const storedRole = getRole();

      // Если нет токена - авторизация не требуется
      if (!storedToken || !storedRole) {
        console.log('[AuthContext] Токен не найден');
        setIsLoading(false);
        return;
      }

      try {
        // ✅ Получить user данные из localStorage (были сохранены при логине)
        const storedUser = getUser();
        
        if (storedUser) {
          console.log('[AuthContext] ✅ User найден в localStorage:', storedUser);
          setUser(storedUser);
          setToken(storedToken);
          setRole(storedRole as 'admin' | 'user');
          console.log('[AuthContext] Авторизация восстановлена:', storedUser);
        } else {
          // Fallback: попытаться парсить из JWT если user не в localStorage
          console.log('[AuthContext] ⚠️ User не найден в localStorage, парсим JWT...');
          const userData = await checkAuthUtil();
          if (userData) {
            setUser(userData);
            setToken(storedToken);
            setRole(storedRole as 'admin' | 'user');
            console.log('[AuthContext] Авторизация восстановлена из JWT:', userData);
          } else {
            console.log('[AuthContext] ❌ Не удалось восстановить user data');
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('[AuthContext] Ошибка при проверке авторизации:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); // Пустой массив - вызовется только один раз

  /**
   * Логин с Go бэкенда
   * Использует /api/auth/login эндпоинт
   * 
   * ✅ Использует window.location для редиректа (избегаем HMR проблем)
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('═══════════════════════════════════════════════════');
      console.log('[AuthContext] 🔐 НАЧАЛО ВХОДА');
      console.log('═══════════════════════════════════════════════════');
      console.log('[AuthContext] 📧 Email:', email);
      console.log('[AuthContext] 🔑 Password: ***');
      console.log('[AuthContext] ⏳ isLoading установлен в true');

      // Построить правильный URL (без дублирующихся /api)
      const loginUrl = getApiUrl('/auth/login');
      console.log('[AuthContext] 🌐 Login URL:', loginUrl);

      console.log('[AuthContext] 📤 Отправляем запрос к серверу...');
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('[AuthContext] 📥 Получен ответ от сервера');
      console.log('[AuthContext] 📊 HTTP статус:', response.status);

      if (!response.ok) {
        console.error('[AuthContext] ❌ Ошибка: HTTP', response.status);
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || errorData.message || `HTTP ${response.status}`;
        console.error('[AuthContext] 📋 Сообщение об ошибке:', errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('[AuthContext] ✅ Успешный вход!');
      console.log('[AuthContext] 🎁 Данные ответа:', data);

      // ✅ ИСПРАВЛЕНИЕ: Сервер возвращает {data: {...}, success: true}
      // Нужно извлечь token и user из data.data
      const payload = data.data || data;
      console.log('[AuthContext] 📦 Извлеченный payload:', payload);

      // Сохранить данные авторизации в localStorage
      if (payload.token && payload.user) {
        console.log('═══════════════════════════════════════════════════');
        console.log('[AuthContext] 💾 СОХРАНЕНИЕ ДАННЫХ');
        console.log('═══════════════════════════════════════════════════');

        console.log('[AuthContext] 👤 User ID:', payload.user.id);
        console.log('[AuthContext] 📧 User Email:', payload.user.email);
        console.log('[AuthContext] 👤 User Name:', payload.user.name);
        console.log('[AuthContext] 🔐 User Role:', payload.user.role);
        console.log('[AuthContext] 🔑 Token (первые 20 символов):', payload.token.substring(0, 20) + '...');

        // Сохраняем через setAuth утилиту
        setAuth(payload.token, payload.user.role, payload.user);
        console.log('[AuthContext] ✅ setAuth() вызван - данные сохранены в localStorage');

        // Проверяем что сохранилось в localStorage
        const verifyToken = localStorage.getItem('token');
        const verifyRole = localStorage.getItem('role');
        const verifyUser = localStorage.getItem('user');
        console.log('[AuthContext] 🔍 Проверка localStorage:');
        console.log('[AuthContext]   - token существует:', !!verifyToken);
        console.log('[AuthContext]   - role:', verifyRole);
        console.log('[AuthContext]   - user существует:', !!verifyUser);

        // Обновляем state
        setUser(payload.user);
        console.log('[AuthContext] ✅ setUser() вызван');
        
        setToken(payload.token);
        console.log('[AuthContext] ✅ setToken() вызван');
        
        setRole(payload.user.role);
        console.log('[AuthContext] ✅ setRole() вызван');
        
        setIsLoading(false);
        console.log('[AuthContext] ✅ isLoading установлен в false');

        // Определяем куда редиректить
        console.log('═══════════════════════════════════════════════════');
        console.log('[AuthContext] 🚀 РЕДИРЕКТ');
        console.log('═══════════════════════════════════════════════════');
        console.log('[AuthContext] 🎯 User Role:', payload.user.role);

        // ✅ Используем window.location вместо router.push для избежания HMR проблем
        if (payload.user.role === 'admin') {
          console.log('[AuthContext] 👑 Пользователь - АДМИН');
          console.log('[AuthContext] 🔄 Редирект на /admin/dashboard');
          console.log('[AuthContext] 📍 window.location.href установлен');
          if (typeof window !== 'undefined') {
            console.log('[AuthContext] ⏳ Перезагрузка страницы...');
            window.location.href = '/admin/dashboard';
          }
        } else {
          console.log('[AuthContext] 👥 Пользователь - ОБЫЧНЫЙ ЮЗЕР');
          console.log('[AuthContext] 🔄 Редирект на /profile/dashboard');
          console.log('[AuthContext] 📍 window.location.href установлен');
          if (typeof window !== 'undefined') {
            console.log('[AuthContext] ⏳ Перезагрузка страницы...');
            window.location.href = '/profile/dashboard';
          }
        }
      } else {
        console.error('[AuthContext] ❌ Ошибка: token или user не найдены в ответе');
        console.error('[AuthContext] � Структура payload:', payload);
        console.error('[AuthContext] �📦 Полный ответ:', data);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('═══════════════════════════════════════════════════');
      console.error('[AuthContext] ❌ КРИТИЧЕСКАЯ ОШИБКА ПРИ ВХОДЕ');
      console.error('═══════════════════════════════════════════════════');
      console.error('[AuthContext] 📌 Сообщение об ошибке:', error.message);
      console.error('[AuthContext] 🔗 Stack trace:', error.stack);
      setIsLoading(false);
      console.log('[AuthContext] ✅ isLoading установлен в false (ошибка)');
      throw error;
    }
  }, []);

  /**
   * Логаут
   * 
   * ✅ Использует window.location для редиректа
   */
  const logout = useCallback(() => {
    console.log('[AuthContext] Выход из аккаунта');
    setUser(null);
    setToken(null);
    setRole(null);
    logoutUtil(); // Очищает localStorage и редиректит на /login
  }, []);

  /**
   * Проверить авторизацию
   */
  const checkAuth = useCallback(async (): Promise<User | null> => {
    try {
      const userData = await checkAuthUtil();
      if (userData) {
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('[AuthContext] Ошибка при проверке авторизации:', error);
      return null;
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    role,
    isLoading,
    isAuthenticated: !!token && !!role && !!user,
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

