/**
 * User Roles & Permissions Utilities
 * 
 * Централизованная система проверки ролей для frontend
 */

// ============= TYPES =============

export type UserRole = 'admin' | 'super_admin' | 'editor' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

// ============= ROLE CHECKS =============

/**
 * Admin roles - полный доступ к admin панели
 */
const ADMIN_ROLES: UserRole[] = ['admin', 'super_admin'];

/**
 * Super admin only - критичные операции
 */
const SUPER_ADMIN_ROLES: UserRole[] = ['super_admin'];

/**
 * Roles that can edit content
 */
const EDITOR_ROLES: UserRole[] = ['admin', 'super_admin', 'editor'];

// ============= HELPER FUNCTIONS =============

/**
 * Проверка: имеет ли пользователь доступ к admin панели
 */
export const isAdminRole = (role?: string): boolean => {
  if (!role) return false;
  return ADMIN_ROLES.includes(role as UserRole);
};

/**
 * Проверка: super admin
 */
export const isSuperAdminRole = (role?: string): boolean => {
  if (!role) return false;
  return SUPER_ADMIN_ROLES.includes(role as UserRole);
};

/**
 * Проверка: может ли редактировать контент
 */
export const isEditorRole = (role?: string): boolean => {
  if (!role) return false;
  return EDITOR_ROLES.includes(role as UserRole);
};

/**
 * Проверка: обычный пользователь (не admin)
 */
export const isRegularUser = (role?: string): boolean => {
  if (!role) return true;
  return role === 'user' || role === 'guest';
};

// ============= PERMISSIONS =============

/**
 * Проверка разрешений для конкретных действий
 */
export const can = {
  /**
   * Управление пользователями
   */
  manageUsers: (role?: string) => isSuperAdminRole(role),
  
  /**
   * Управление рецептами (CRUD)
   */
  manageRecipes: (role?: string) => isAdminRole(role),
  
  /**
   * Управление ингредиентами
   */
  manageIngredients: (role?: string) => isAdminRole(role),
  
  /**
   * Просмотр статистики
   */
  viewStats: (role?: string) => isAdminRole(role),
  
  /**
   * Доступ к admin панели
   */
  accessAdmin: (role?: string) => isAdminRole(role),
  
  /**
   * Изменение настроек системы
   */
  changeSettings: (role?: string) => isSuperAdminRole(role),
  
  /**
   * Управление токенами
   */
  manageTokens: (role?: string) => isSuperAdminRole(role),
};

// ============= ROLE LABELS =============

/**
 * Человекочитаемые названия ролей
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  user: 'User',
  guest: 'Guest',
};

/**
 * Цвета для badge ролей
 */
export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  editor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  user: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  guest: 'bg-gray-100 text-gray-500 dark:bg-gray-900/30 dark:text-gray-500',
};

// ============= DEV HELPERS =============

/**
 * Dev-only bypass (не работает в production)
 */
export const isDevEnvironment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Проверка с dev-bypass (только для development)
 */
export const isAdminWithDevBypass = (role?: string): boolean => {
  // В development разрешаем без роли (для тестирования)
  if (isDevEnvironment() && !role) {
    console.warn('[DEV] Admin access granted without role check');
    return true;
  }
  
  // В production строгая проверка
  return isAdminRole(role);
};
