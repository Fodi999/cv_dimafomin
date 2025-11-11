/**
 * Утилиты для управления JWT токеном и ролью пользователя
 * Все функции безопасны для SSR (проверяют наличие window)
 */

/**
 * Получить JWT токен из localStorage
 * @returns Токен или null если его нет
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

/**
 * Получить роль пользователя из localStorage
 * @returns 'admin' | 'user' | null
 */
export function getRole(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('role');
  } catch {
    return null;
  }
}

/**
 * Получить данные пользователя из localStorage
 * @returns Объект пользователя или null
 */
export function getUser(): any {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/**
 * Очистить данные авторизации и перенаправить на /login
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  try {
    console.log('═══════════════════════════════════════════════════');
    console.log('[logout] 🚪 ЛОГАУТ');
    console.log('═══════════════════════════════════════════════════');
    
    localStorage.removeItem('token');
    console.log('[logout] ✅ Token удалён');

    localStorage.removeItem('role');
    console.log('[logout] ✅ Role удалён');

    localStorage.removeItem('user');
    console.log('[logout] ✅ User удалён');

    console.log('[logout] ✅ Все данные авторизации удалены');
    console.log('[logout] 🔄 Редирект на /login');
  } catch {
    // Ignore errors
    console.error('[logout] ❌ Ошибка при удалении данных');
  }
  window.location.href = '/login';
}

/**
 * Проверить авторизацию и валидность токена
 * Парсит роль из JWT (не требует дополнительного запроса)
 * @returns Данные пользователя или null если токен невалиден
 */
export async function checkAuth(): Promise<any> {
  const token = getToken();

  if (!token) {
    console.log('[checkAuth] ❌ Токен не найден');
    return null;
  }

  console.log('[checkAuth] ✅ Токен найден');
  console.log('[checkAuth] 🔍 Декодирование JWT...');

  try {
    // Парсить роль из JWT (без дополнительного запроса)
    const decoded = decodeToken(token);
    if (!decoded) {
      console.warn('[checkAuth] ⚠️ Не удалось декодировать токен');
      logout();
      return null;
    }

    console.log('[checkAuth] ✅ JWT успешно декодирован');
    console.log('[checkAuth] 📋 Payload:', decoded);

    // Использовать роль из JWT
    const role = decoded.role || getRole();
    if (!role) {
      console.warn('[checkAuth] ⚠️ Роль не найдена в токене');
      logout();
      return null;
    }

    console.log('[checkAuth] 👑 Роль из JWT:', role);

    // Конструировать объект пользователя из JWT
    const user = {
      id: decoded.sub || decoded.id || '',
      email: decoded.email || '',
      name: decoded.name || '',
      role: role,
    };

    console.log('[checkAuth] ✅ Пользователь авторизован из JWT:', user);
    return user;
  } catch (error) {
    console.error('[checkAuth] ❌ Ошибка при проверке авторизации:', error);
    logout();
    return null;
  }
}

/**
 * Сохранить данные авторизации
 * @param token JWT токен
 * @param role Роль пользователя
 * @param user Данные пользователя
 */
export function setAuth(token: string, role: string, user: any): void {
  if (typeof window === 'undefined') return;
  try {
    console.log('[setAuth] 💾 Сохранение данных авторизации...');
    console.log('[setAuth] 🔑 Token (первые 20 символов):', token.substring(0, 20) + '...');
    console.log('[setAuth] 👑 Role:', role);
    console.log('[setAuth] 👤 User:', user);

    localStorage.setItem('token', token);
    console.log('[setAuth] ✅ Token сохранён в localStorage');

    localStorage.setItem('role', role);
    console.log('[setAuth] ✅ Role сохранён в localStorage');

    localStorage.setItem('user', JSON.stringify(user));
    console.log('[setAuth] ✅ User сохранён в localStorage');

    console.log('[setAuth] ✅ Все данные успешно сохранены!');
  } catch {
    console.error('[setAuth] ❌ Ошибка при сохранении данных авторизации');
  }
}

/**
 * Проверить, авторизован ли пользователь
 * @returns true если токен и роль есть в localStorage
 */
export function isAuthenticated(): boolean {
  return !!getToken() && !!getRole();
}

/**
 * Декодировать JWT (если нужна информация из самого токена)
 * @param token JWT токен
 * @returns Decoded payload или null
 */
export function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
}
