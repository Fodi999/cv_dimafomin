import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "user" | "admin" | "premium";
  status: "active" | "blocked" | "pending"; // 🔥 Обновлено: убрали inactive, добавили pending
  joinedAt: string;
  lastActiveAt: string;
  phone?: string;
  stats?: {
    ordersCount?: number;
    totalSpent?: number;
  };
}

export interface AdminUserDetails extends AdminUser {
  locale: "uk" | "pl" | "ru" | "en";
  timezone: string;
  stats: {
    ordersCount: number;
    totalSpent: number;
    recipesCreated: number;
    aiRequests: number;
  };
}

export interface UsersStats {
  total: number;
  active_today: number;
  blocked: number;
  premium?: number; // undefined если 0
  by_role?: {
    admin: number;
    home_chef: number;
    pro_chef: number;
    investor: number;
  };
  error?: string;
}

export interface UsersResponse {
  meta: {
    total: number;
    activeToday: number;
    blocked: number;
    premium: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  users: AdminUser[]; // ✅ Изменили с items на users
}

export interface UsersFilters {
  search: string;
  role: "all" | "user" | "admin" | "superadmin"; // 🔥 Реальные роли
  status: "all" | "active" | "blocked" | "pending"; // 🔥 Реальные статусы
  page: number;
  limit: number;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<UsersResponse["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<UsersFilters>({
    search: "",
    role: "all",
    status: "all",
    page: 1,
    limit: 20,
  });

  const buildQueryString = useCallback((filters: UsersFilters) => {
    const params = new URLSearchParams();

    params.append("page", filters.page.toString());
    params.append("limit", filters.limit.toString());

    if (filters.search) {
      params.append("search", filters.search);
    }
    
    // 🔄 Маппинг ролей: Frontend → Backend
    // Frontend: user, admin, superadmin
    // Backend: home_chef, admin, super_admin, investor
    if (filters.role !== "all") {
      let backendRole: string = filters.role;
      
      console.log(`🔄 [Role Mapping] Frontend role: "${filters.role}"`);
      
      // Маппинг
      if (filters.role === "user") {
        backendRole = "home_chef"; // 🔥 user → home_chef
        console.log(`✅ [Role Mapping] Mapped: "user" → "home_chef"`);
      } else if (filters.role === "superadmin") {
        backendRole = "super_admin"; // 🔥 superadmin → super_admin (с подчеркиванием!)
        console.log(`✅ [Role Mapping] Mapped: "superadmin" → "super_admin"`);
      } else {
        console.log(`✅ [Role Mapping] No mapping needed: "${filters.role}"`);
      }
      
      console.log(`📤 [Role Mapping] Sending to backend: "${backendRole}"`);
      params.append("role", backendRole);
    }
    
    if (filters.status !== "all") {
      params.append("status", filters.status);
    }

    return params.toString();
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryString = buildQueryString(filters);
      const url = `/api/admin/users?${queryString}`;
      
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');
      
      console.log("🔍 [useAdminUsers] Fetching:", url);
      console.log("🔑 [useAdminUsers] Token present:", !!token);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("📥 [useAdminUsers] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [useAdminUsers] Error response:", errorText);
        throw new Error("Failed to fetch users");
      }

      const responseData = await response.json();
      
      // 🔍 DEBUG: Логируем полный ответ
      console.log("🔍 [useAdminUsers] Full response data:", responseData);
      
      // 🔥 FIX: Бэкенд возвращает {success: true, data: {...}, meta: {...}}
      // Нужно извлечь данные из responseData.data
      const backendData = responseData.data || responseData;
      console.log("🔍 [useAdminUsers] Backend data:", backendData);
      
      // ✅ Используем правильное поле (users из data)
      const users = backendData.users || [];
      const meta = responseData.meta || backendData.meta || {};
      
      console.log("✅ [useAdminUsers] Data received:", {
        usersCount: users.length,
        meta: meta,
      });
      
      setUsers(users);
      setMeta(meta);
    } catch (error) {
      console.error("❌ [useAdminUsers] Error fetching users:", error);
      toast.error("Помилка завантаження користувачів");
    } finally {
      setIsLoading(false);
    }
  }, [filters, buildQueryString]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateFilters = useCallback((newFilters: Partial<UsersFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.search !== undefined ? 1 : prev.page, // Reset page on search
    }));
  }, []);

  const refetch = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    meta,
    isLoading,
    filters,
    updateFilters,
    refetch,
  };
}

export function useAdminUserDetails(userId: string | null) {
  const [user, setUser] = useState<AdminUserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`/api/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const responseData = await response.json();
        
        // 🔥 FIX: Извлекаем данные из обертки прокси
        const userData = responseData.data || responseData;
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Помилка завантаження деталей користувача");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return { user, isLoading };
}

export function useAdminUserActions() {
  const changeRole = async (
    userId: string,
    newRole: AdminUser["role"],
  ): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to change role");
      }

      toast.success("Роль успішно змінено");
      return true;
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error(
        error instanceof Error ? error.message : "Помилка зміни ролі",
      );
      return false;
    }
  };

  const changeStatus = async (
    userId: string,
    newStatus: AdminUser["status"],
    reason?: string,
  ): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to change status");
      }

      const statusText = {
        active: "активовано",
        blocked: "заблоковано",
        pending: "переведено в очікування",
      };
      toast.success(`Користувача ${statusText[newStatus]}`);
      return true;
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error(
        error instanceof Error ? error.message : "Помилка зміни статусу",
      );
      return false;
    }
  };

  return { changeRole, changeStatus };
}

/**
 * 🗑️ Хук для удаления пользователя (только super_admin!)
 */
export function useAdminDeleteUser() {
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Токен не знайдено");
        return false;
      }

      console.log(`🗑️ [Delete User] Attempting to delete user: ${userId}`);

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`📥 [Delete User] Response status: ${response.status}`);

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ [Delete User] Backend error:", error);
        
        // Специальное сообщение для 403
        if (response.status === 403) {
          throw new Error("⚠️ Тільки супер-адміністратор може видаляти користувачів");
        }
        
        throw new Error(error.error?.message || "Failed to delete user");
      }

      const data = await response.json();
      console.log("✅ [Delete User] Success:", data);

      toast.success("Користувача успішно видалено");
      return true;
    } catch (error) {
      console.error("❌ [Delete User] Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Помилка видалення користувача",
      );
      return false;
    }
  };

  return { deleteUser };
}

export function useAdminUsersStats() {
  const [stats, setStats] = useState<UsersStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("🔍 [useAdminUsersStats] Fetching stats...");
      
      const token = localStorage.getItem('token');
      
      const response = await fetch("/api/admin/users/stats", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("📥 [useAdminUsersStats] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [useAdminUsersStats] Error response:", errorText);
        throw new Error("Failed to fetch stats");
      }

      const data: UsersStats = await response.json();
      console.log("✅ [useAdminUsersStats] Stats received:", data);
      setStats(data);
    } catch (error) {
      console.error("❌ [useAdminUsersStats] Error fetching stats:", error);
      toast.error("Помилка завантаження статистики");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, isLoading, refetch: fetchStats };
}
