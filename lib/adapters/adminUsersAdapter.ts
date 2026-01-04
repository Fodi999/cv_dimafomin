/**
 * Adapter для преобразования backend responses к frontend contract
 * Backend: Go API
 * Frontend: Admin Users Management
 */

interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: "home_chef" | "pro_chef" | "admin";
  createdAt: string;
}

interface BackendUsersResponse {
  users: BackendUser[];
}

interface FrontendUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "user" | "admin" | "premium";
  status: "active" | "blocked" | "inactive";
  joinedAt: string;
  lastActiveAt: string;
  phone?: string;
  stats?: {
    ordersCount?: number;
    totalSpent?: number;
  };
}

interface FrontendUsersResponse {
  meta: {
    total: number;
    activeToday: number;
    blocked: number;
    premium: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  items: FrontendUser[];
}

/**
 * Convert backend role to frontend role
 */
export function adaptRole(
  backendRole: string,
): "user" | "premium" | "admin" {
  switch (backendRole) {
    case "home_chef":
      return "user";
    case "pro_chef":
      return "premium";
    case "admin":
      return "admin";
    default:
      return "user";
  }
}

/**
 * Convert frontend role to backend role
 */
export function adaptRoleToBackend(
  frontendRole: "user" | "premium" | "admin",
): "home_chef" | "pro_chef" | "admin" {
  switch (frontendRole) {
    case "user":
      return "home_chef";
    case "premium":
      return "pro_chef";
    case "admin":
      return "admin";
    default:
      return "home_chef";
  }
}

/**
 * Convert backend users response to frontend format
 */
export function adaptBackendUsersToFrontend(
  backendResponse: BackendUsersResponse,
  page: number = 1,
  limit: number = 20,
): FrontendUsersResponse {
  const users = backendResponse.users || [];

  // Calculate stats
  const total = users.length;
  const premiumCount = users.filter((u) => u.role === "pro_chef").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  // TODO: Get from backend when available
  const activeToday = 0; // Percentage of active users today
  const blocked = 0; // Count of blocked users

  return {
    meta: {
      total: total,
      activeToday: activeToday,
      blocked: blocked,
      premium: premiumCount,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    },
    items: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: undefined, // TODO: Add avatar support in backend
      role: adaptRole(user.role),
      status: "active", // TODO: Add status field in backend
      joinedAt: user.createdAt,
      lastActiveAt: user.createdAt, // Fallback to createdAt
      phone: undefined, // TODO: Add phone field in backend
      stats: {
        ordersCount: 0, // TODO: Add orders count in backend
        totalSpent: 0, // TODO: Add total spent in backend
      },
    })),
  };
}

/**
 * Calculate stats from users array (temporary until backend provides this)
 */
export function calculateStatsFromUsers(users: FrontendUser[]) {
  return {
    total: users.length,
    activeTodayPercent: 0, // TODO: Need lastActiveAt from backend
    blocked: users.filter((u) => u.status === "blocked").length,
    premium: users.filter((u) => u.role === "premium").length,
    growth: {
      total: 0, // TODO: Need historical data
      premium: 0, // TODO: Need historical data
    },
  };
}
