/**
 * ✅ 2026: Resolve user route based on role and status
 * 
 * ПРАВИЛО: Фронтенд НЕ решает, он РЕАГИРУЕТ
 * 
 * Эта функция определяет маршрут на основе:
 * 1. Статуса пользователя (приоритет 1)
 * 2. Роли пользователя (приоритет 2)
 * 
 * Логика ИДЕНТИЧНА backend middleware
 */

import type { User } from "@/contexts/AuthContext";

export function resolveUserRoute(user: User): string {
  // 1️⃣ Проверка статуса (приоритет 1)
  if (user.status !== "active") {
    return "/account/status";
  }

  // 2️⃣ Роутинг по роли (приоритет 2)
  switch (user.role) {
    case "super_admin":
    case "admin":
      return "/admin/dashboard";

    case "home_chef":
    case "chef_staff":
      // TODO: Создать /chef/dashboard
      // Временно редиректим на marketplace
      return "/marketplace";

    case "customer":
    default:
      return "/marketplace";
  }
}

/**
 * ✅ 2026: Check if route is accessible for user
 * 
 * Используется для защиты маршрутов
 */
export function canAccessRoute(user: User, route: string): boolean {
  // Неактивные пользователи могут видеть только /account/status
  if (user.status !== "active") {
    return route === "/account/status";
  }

  // Публичные маршруты доступны всем
  const publicRoutes = ["/marketplace", "/", "/account/status"];
  if (publicRoutes.includes(route)) {
    return true;
  }

  // Admin маршруты
  if (route.startsWith("/admin")) {
    return user.role === "admin" || user.role === "super_admin";
  }

  // Chef маршруты
  if (route.startsWith("/chef")) {
    return (
      user.role === "home_chef" ||
      user.role === "chef_staff" ||
      user.role === "admin" ||
      user.role === "super_admin"
    );
  }

  // Все остальные маршруты доступны активным пользователям
  return true;
}

/**
 * ✅ 2026: Get status route for user
 * 
 * Возвращает маршрут для страницы статуса или null если статус active
 */
export function getStatusRoute(status: User["status"]): string | null {
  if (status !== "active") {
    return "/account/status";
  }
  return null;
}
