/**
 * Route by Role - 2026
 * 
 * Определяет маршрут редиректа на основе роли пользователя
 */

export type UserRole = "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin";
export type UserStatus = "pending" | "active" | "suspended" | "blocked";

/**
 * Get redirect route based on user role
 */
export function routeByRole(role: UserRole): string {
  if (role === "super_admin" || role === "admin") {
    return "/admin/dashboard";
  }
  
  if (role === "home_chef" || role === "chef_staff") {
    // TODO: Создать /chef/dashboard
    // Временно редиректим на marketplace
    return "/marketplace";
  }
  
  return "/marketplace"; // customer
}

/**
 * Check if user status allows access
 * Returns redirect route if status is not active
 */
export function routeByStatus(status: UserStatus): string | null {
  if (status !== "active") {
    return "/account/status"; // Страница "Account disabled / pending"
  }
  
  return null; // Status is active, no redirect needed
}
