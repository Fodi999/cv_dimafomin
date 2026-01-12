/**
 * Admin Navigation Schema - Professional SaaS Structure
 * 
 * Clean, business-focused admin navigation (7 core sections):
 * 1. Dashboard - System overview, KPIs
 * 2. Users - User management, roles, activity log
 * 3. Content - Recipes, ingredients, courses, localization
 * 4. AI - Scenarios, prompts, cost limits
 * 5. Economy - Token treasury, transactions, bonuses/penalties
 * 6. Integrations - API keys, webhooks, external services
 * 7. Settings - General config, feature flags, security
 * 
 * Key principles:
 * - 7 sections max (optimal cognitive load)
 * - No duplicates
 * - Business-focused language
 * - Max 2 levels deep
 * - RBAC + Feature flags support
 */

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Brain,
  Wallet,
  Plug,
  Settings,
  ChefHat,
  Carrot,
  Languages,
  Shield,
  Activity,
  TrendingUp,
  Gift,
  Key,
  Webhook,
  Cloud,
  Flag,
  Lock,
  Zap,
  type LucideIcon,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type AdminRole = "admin" | "superadmin" | "moderator" | "support";

export type FeatureFlag = 
  | "integrations"
  | "advanced_ai"
  | "economy_management";

export interface NavigationItem {
  id: string;
  label: {
    en: string;
    ru: string;
    pl: string;
  };
  icon: LucideIcon;
  href: string;
  badge?: string;
  requiredRoles?: AdminRole[];
  requiredFeatures?: FeatureFlag[];
}

export interface NavigationSection {
  id: string;
  label: {
    en: string;
    ru: string;
    pl: string;
  };
  items: NavigationItem[];
  requiredRoles?: AdminRole[];
  requiredFeatures?: FeatureFlag[];
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION SCHEMA - 7 CORE SECTIONS
// ═══════════════════════════════════════════════════════════

export const adminNavigationSchema: NavigationSection[] = [
  
  // ───────────────────────────────────────────────────────
  // 📊 1. DASHBOARD
  // ───────────────────────────────────────────────────────
  {
    id: "dashboard",
    label: {
      en: "Dashboard",
      ru: "Панель управления",
      pl: "Panel sterowania",
    },
    items: [
      {
        id: "dashboard",
        label: {
          en: "Dashboard",
          ru: "Панель управления",
          pl: "Panel sterowania",
        },
        icon: LayoutDashboard,
        href: "/admin/dashboard",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // 👥 2. USERS (Пользователи)
  // ───────────────────────────────────────────────────────
  {
    id: "users",
    label: {
      en: "Users",
      ru: "Пользователи",
      pl: "Użytkownicy",
    },
    items: [
      {
        id: "users",
        label: {
          en: "Users",
          ru: "Пользователи",
          pl: "Użytkownicy",
        },
        icon: Users,
        href: "/admin/users",
      },
      {
        id: "roles",
        label: {
          en: "Roles & Access",
          ru: "Роли и доступы",
          pl: "Role i dostępy",
        },
        icon: Shield,
        href: "/admin/users/roles",
        requiredRoles: ["admin", "superadmin"],
      },
      {
        id: "activity",
        label: {
          en: "Activity Log",
          ru: "Журнал активности",
          pl: "Dziennik aktywności",
        },
        icon: Activity,
        href: "/admin/activity-log",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // 🍽️ 3. CONTENT (Каталог: продукты и рецепты раздельно)
  // ───────────────────────────────────────────────────────
  {
    id: "content",
    label: {
      en: "Content",
      ru: "Контент",
      pl: "Zawartość",
    },
    items: [
      {
        id: "catalog-products",
        label: {
          en: "Products Catalog",
          ru: "Каталог продуктов",
          pl: "Katalog produktów",
        },
        icon: Carrot,
        href: "/admin/catalog/products",
      },
      {
        id: "catalog-recipes",
        label: {
          en: "Recipes Catalog",
          ru: "Каталог рецептов",
          pl: "Katalog przepisów",
        },
        icon: ChefHat,
        href: "/admin/catalog/recipes-list",
      },
      {
        id: "courses",
        label: {
          en: "Courses",
          ru: "Курсы",
          pl: "Kursy",
        },
        icon: BookOpen,
        href: "/admin/courses",
      },
      {
        id: "localization",
        label: {
          en: "Localization",
          ru: "Локализация",
          pl: "Lokalizacja",
        },
        icon: Languages,
        href: "/admin/localization",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // 🤖 4. AI
  // ───────────────────────────────────────────────────────
  {
    id: "ai",
    label: {
      en: "AI",
      ru: "AI",
      pl: "AI",
    },
    items: [
      {
        id: "ai-scenarios",
        label: {
          en: "Scenarios",
          ru: "Сценарии",
          pl: "Scenariusze",
        },
        icon: Brain,
        href: "/admin/ai-scenarios",
      },
      {
        id: "prompts",
        label: {
          en: "Prompts",
          ru: "Промпты",
          pl: "Prompty",
        },
        icon: Zap,
        href: "/admin/prompts",
      },
      {
        id: "ai-limits",
        label: {
          en: "Limits & Cost",
          ru: "Лимиты и стоимость",
          pl: "Limity i koszt",
        },
        icon: TrendingUp,
        href: "/admin/ai-limits",
        requiredFeatures: ["advanced_ai"],
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // 💰 5. ECONOMY (Экономика)
  // ───────────────────────────────────────────────────────
  {
    id: "economy",
    label: {
      en: "Economy",
      ru: "Экономика",
      pl: "Ekonomia",
    },
    items: [
      {
        id: "treasury",
        label: {
          en: "Token Treasury",
          ru: "Казна токенов",
          pl: "Skarbiec tokenów",
        },
        icon: Wallet,
        href: "/admin/token-bank",
      },
      {
        id: "transactions",
        label: {
          en: "Transactions",
          ru: "Транзакции",
          pl: "Transakcje",
        },
        icon: TrendingUp,
        href: "/admin/transactions",
      },
      {
        id: "bonuses",
        label: {
          en: "Bonuses & Penalties",
          ru: "Бонусы и штрафы",
          pl: "Bonusy i kary",
        },
        icon: Gift,
        href: "/admin/rewards",
      },
    ],
    requiredFeatures: ["economy_management"],
  },

  // ───────────────────────────────────────────────────────
  // 🔌 6. INTEGRATIONS (Интеграции)
  // ───────────────────────────────────────────────────────
  {
    id: "integrations",
    label: {
      en: "Integrations",
      ru: "Интеграции",
      pl: "Integracje",
    },
    items: [
      {
        id: "api-keys",
        label: {
          en: "API Keys",
          ru: "API ключи",
          pl: "Klucze API",
        },
        icon: Key,
        href: "/admin/integrations/api-keys",
      },
      {
        id: "webhooks",
        label: {
          en: "Webhooks",
          ru: "Вебхуки",
          pl: "Webhooki",
        },
        icon: Webhook,
        href: "/admin/integrations/webhooks",
      },
      {
        id: "services",
        label: {
          en: "External Services",
          ru: "Внешние сервисы",
          pl: "Usługi zewnętrzne",
        },
        icon: Cloud,
        href: "/admin/integrations/services",
      },
    ],
    requiredFeatures: ["integrations"],
  },

  // ───────────────────────────────────────────────────────
  // ⚙️ 7. SETTINGS (Настройки)
  // ───────────────────────────────────────────────────────
  {
    id: "settings",
    label: {
      en: "Settings",
      ru: "Настройки",
      pl: "Ustawienia",
    },
    items: [
      {
        id: "general",
        label: {
          en: "General",
          ru: "Общие",
          pl: "Ogólne",
        },
        icon: Settings,
        href: "/admin/settings",
      },
      {
        id: "features",
        label: {
          en: "Feature Flags",
          ru: "Флаги функций",
          pl: "Flagi funkcji",
        },
        icon: Flag,
        href: "/admin/settings/features",
        requiredRoles: ["superadmin"],
      },
      {
        id: "security",
        label: {
          en: "Security",
          ru: "Безопасность",
          pl: "Bezpieczeństwo",
        },
        icon: Lock,
        href: "/admin/settings/security",
        requiredRoles: ["admin", "superadmin"],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Filter navigation by role and feature flags
 */
export function filterNavigation(
  schema: NavigationSection[],
  userRole: AdminRole,
  enabledFeatures: FeatureFlag[]
): NavigationSection[] {
  return schema
    .filter((section) => {
      // Check section-level role requirements
      if (section.requiredRoles && !section.requiredRoles.includes(userRole)) {
        return false;
      }
      
      // Check section-level feature requirements
      if (section.requiredFeatures && 
          !section.requiredFeatures.some(f => enabledFeatures.includes(f))) {
        return false;
      }
      
      return true;
    })
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // Check item-level role requirements
        if (item.requiredRoles && !item.requiredRoles.includes(userRole)) {
          return false;
        }
        
        // Check item-level feature requirements
        if (item.requiredFeatures && 
            !item.requiredFeatures.some(f => enabledFeatures.includes(f))) {
          return false;
        }
        
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0); // Remove empty sections
}

/**
 * Get localized label
 */
export function getLocalizedLabel(
  item: NavigationItem | NavigationSection,
  language: "en" | "ru" | "pl"
): string {
  return item.label[language] || item.label.en;
}

/**
 * Find navigation item by ID
 */
export function findNavigationItem(
  schema: NavigationSection[],
  itemId: string
): NavigationItem | undefined {
  for (const section of schema) {
    const found = section.items.find((item) => item.id === itemId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Get breadcrumbs for current path
 */
export function getBreadcrumbs(
  schema: NavigationSection[],
  pathname: string,
  language: "en" | "ru" | "pl" = "en"
): Array<{ label: string; href: string }> {
  const breadcrumbs: Array<{ label: string; href: string }> = [];
  
  for (const section of schema) {
    for (const item of section.items) {
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        breadcrumbs.push({
          label: getLocalizedLabel(section, language),
          href: "#",
        });
        breadcrumbs.push({
          label: getLocalizedLabel(item, language),
          href: item.href,
        });
        return breadcrumbs;
      }
    }
  }
  
  return breadcrumbs;
}
