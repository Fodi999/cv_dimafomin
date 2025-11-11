/**
 * Storage Migration Utility
 * Автоматически мигрирует старые ключи в новые при загрузке приложения
 * 
 * Старые ключи: authToken, userId
 * Новые ключи: token, role, user
 */

/**
 * Декодировать JWT для получения роли из payload
 */
function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

/**
 * Мигрировать старые ключи localStorage в новые
 */
export function migrateStorageKeys(): void {
  if (typeof window === 'undefined') return;

  try {
    const oldToken = localStorage.getItem('authToken');
    const oldUserId = localStorage.getItem('userId');
    
    // Проверяем есть ли уже новые ключи
    const newToken = localStorage.getItem('token');
    const newUser = localStorage.getItem('user');
    
    // Если старые ключи есть, но новых нет - мигрируем
    if (oldToken && !newToken) {
      console.log('[StorageMigration] Migrating authToken → token');
      localStorage.setItem('token', oldToken);
      
      // Попробовать получить роль из JWT
      const decoded = decodeToken(oldToken);
      if (decoded?.role) {
        console.log('[StorageMigration] Extracted role from token:', decoded.role);
        localStorage.setItem('role', decoded.role);
      } else {
        console.log('[StorageMigration] Role not found in token, using default: student');
        localStorage.setItem('role', 'student');
      }
    }
    
    if (oldUserId && !newUser) {
      console.log('[StorageMigration] Migrating userId → user');
      
      // Получить существующий JSON user если он есть
      const existingUser = localStorage.getItem('user');
      if (!existingUser) {
        // Создать minimal user object
        const userObj = {
          id: oldUserId,
          name: 'User',
          email: '',
          role: localStorage.getItem('role') || 'student',
        };
        localStorage.setItem('user', JSON.stringify(userObj));
      }
    }
    
    // Удаляем старые ключи (опционально - можно оставить для back-compat)
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    
    console.log('[StorageMigration] Migration complete');
  } catch (error) {
    console.error('[StorageMigration] Error during migration:', error);
  }
}

/**
 * Проверить есть ли валидная авторизация в новых ключах
 */
export function hasValidAuth(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const user = localStorage.getItem('user');
  
  return !!token && !!role && !!user;
}

/**
 * Очистить все ключи авторизации (старые и новые)
 */
export function clearAllAuth(): void {
  if (typeof window === 'undefined') return;
  
  // Новые ключи
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  
  // Старые ключи (на случай если остались)
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  
  console.log('[StorageMigration] All auth keys cleared');
}
