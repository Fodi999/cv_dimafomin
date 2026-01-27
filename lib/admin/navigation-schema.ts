/**
 * Admin Navigation Schema - Business-Focused Structure
 * 
 * MVP → Scale Navigation (Money-First Approach):
 * 1. Dashboard - Overview, KPIs
 * 2. Menu - Dishes (Products) & Recipes (Tech Cards)
 * 3. Inventory - Warehouse/Stock management
 * 4. Purchases - Procurement, suppliers, costs
 * 5. Orders - Order management
 * 6. Losses - Write-offs, waste tracking
 * 7. Economy - Profit, margins, financial analytics
 * 8. Assistant - AI helper for owner
 * 9. Users - Staff, roles, access control
 * 10. Integrations - Wolt, Glovo, POS, webhooks
 * 11. Activity Log - Audit trail
 * 12. Settings - General business config
 * 
 * Key principles:
 * - Every menu item either makes money or protects money
 * - Business language (not CMS/tech terms)
 * - No duplicates
 * - Actions = buttons, not menu items
 * - Max 2 levels deep
 */

import {
  LayoutDashboard,
  Users,
  Wallet,
  Plug,
  Settings,
  ChefHat,
  UtensilsCrossed,
  Shield,
  Activity,
  TrendingUp,
  ShoppingCart,
  Package,
  ClipboardList,
  TrendingDown,
  Bot,
  BookOpen,
  Plus,
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

export type NavigationLevel = "primary" | "secondary" | "system";
export type NavigationAccent = "danger" | "success" | "warning" | "info" | "purple";

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
  level?: NavigationLevel; // Уровень важности
  accent?: NavigationAccent; // Цветовой акцент для primary
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
  level?: NavigationLevel; // Уровень важности группы
  collapsible?: boolean; // Можно сворачивать
  requiredRoles?: AdminRole[];
  requiredFeatures?: FeatureFlag[];
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION SCHEMA - BUSINESS-FOCUSED (MVP → Scale)
// ═══════════════════════════════════════════════════════════

export const adminNavigationSchema: NavigationSection[] = [
  
  // ───────────────────────────────────────────────────────
  // 📊 1. DASHBOARD (Панель управления)
  // ───────────────────────────────────────────────────────
  {
    id: "dashboard",
    label: {
      en: "Dashboard",
      ru: "Панель управления",
      pl: "Panel sterowania",
    },
    level: "primary",
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
        level: "primary",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // 🔥 ОПЕРАЦИОННОЕ ЯДРО (PRIMARY)
  // ───────────────────────────────────────────────────────
  
  // 📦 Склад (Холодильник) — РЕАЛЬНАЯ ЖИЗНЬ
  {
    id: "inventory",
    label: {
      en: "Inventory (Fridge)",
      ru: "Склад (Холодильник)",
      pl: "Magazyn (Lodówka)",
    },
    level: "primary",
    items: [
      {
        id: "inventory",
        label: {
          en: "Inventory (Fridge)",
          ru: "Склад (Холодильник)",
          pl: "Magazyn (Lodówka)",
        },
        icon: Package,
        href: "/admin/ingredients",
        level: "primary",
      },
      {
        id: "create-dish",
        label: {
          en: "Create Dish",
          ru: "Создать блюдо",
          pl: "Stwórz danie",
        },
        icon: Plus,
        href: "/admin/dishes/new",
        level: "primary",
        accent: "success",
      },
    ],
  },

  // 📉 Списания
  {
    id: "losses",
    label: {
      en: "Losses",
      ru: "Списания",
      pl: "Straty",
    },
    level: "primary",
    items: [
      {
        id: "losses",
        label: {
          en: "Losses",
          ru: "Списания",
          pl: "Straty",
        },
        icon: TrendingDown,
        href: "/admin/losses",
        level: "primary",
        accent: "danger",
      },
    ],
  },

  // 💰 Экономика
  {
    id: "economy",
    label: {
      en: "Economy",
      ru: "Экономика",
      pl: "Ekonomia",
    },
    level: "primary",
    items: [
      {
        id: "economy",
        label: {
          en: "Economy",
          ru: "Экономика",
          pl: "Ekonomia",
        },
        icon: Wallet,
        href: "/admin/economy",
        level: "primary",
        accent: "success",
      },
    ],
  },

  // 🤖 Ассистент
  {
    id: "assistant",
    label: {
      en: "Assistant",
      ru: "Ассистент",
      pl: "Asystent",
    },
    level: "primary",
    items: [
      {
        id: "assistant",
        label: {
          en: "Assistant",
          ru: "Ассистент",
          pl: "Asystent",
        },
        icon: Bot,
        href: "/admin/assistant",
        level: "primary",
        accent: "purple",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // 🏭 ПРОИЗВОДСТВЕННЫЙ ПРОЦЕСС (SECONDARY)
  // ───────────────────────────────────────────────────────
  
  // 📚 Каталог продуктов (ПЕРЕД Рецептами - база данных)
  {
    id: "products-catalog",
    label: {
      en: "Products Catalog",
      ru: "Каталог продуктов",
      pl: "Katalog produktów",
    },
    level: "secondary",
    collapsible: true,
    items: [
      {
        id: "products-catalog",
        label: {
          en: "Products Catalog",
          ru: "Каталог продуктов",
          pl: "Katalog produktów",
        },
        icon: BookOpen,
        href: "/admin/catalog/products",
      },
    ],
  },

  // 👨‍🍳 Рецепты (используют продукты из каталога)
  {
    id: "recipes",
    label: {
      en: "Recipes",
      ru: "Рецепты",
      pl: "Przepisy",
    },
    level: "secondary",
    collapsible: true,
    items: [
      {
        id: "recipes",
        label: {
          en: "Recipes",
          ru: "Рецепты",
          pl: "Przepisy",
        },
        icon: ChefHat,
        href: "/admin/catalog/recipes-list",
      },
    ],
  },

  // 🛒 Закупки
  {
    id: "purchases",
    label: {
      en: "Purchases",
      ru: "Закупки",
      pl: "Zakupy",
    },
    level: "secondary",
    collapsible: true,
    items: [
      {
        id: "purchases",
        label: {
          en: "Purchases",
          ru: "Закупки",
          pl: "Zakupy",
        },
        icon: ShoppingCart,
        href: "/admin/purchases",
      },
    ],
  },

  // 📋 Заказы
  {
    id: "orders",
    label: {
      en: "Orders",
      ru: "Заказы",
      pl: "Zamówienia",
    },
    level: "secondary",
    collapsible: true,
    items: [
      {
        id: "orders",
        label: {
          en: "Orders",
          ru: "Заказы",
          pl: "Zamówienia",
        },
        icon: ClipboardList,
        href: "/admin/orders",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // ⚙️ СИСТЕМА (SYSTEM)
  // ───────────────────────────────────────────────────────
  
  // 👥 Пользователи
  {
    id: "users",
    label: {
      en: "Users",
      ru: "Пользователи",
      pl: "Użytkownicy",
    },
    level: "system",
    collapsible: true,
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
    ],
  },

  // 🔌 Интеграции
  {
    id: "integrations",
    label: {
      en: "Integrations",
      ru: "Интеграции",
      pl: "Integracje",
    },
    level: "system",
    collapsible: true,
    items: [
      {
        id: "integrations",
        label: {
          en: "Integrations",
          ru: "Интеграции",
          pl: "Integracje",
        },
        icon: Plug,
        href: "/admin/integrations",
      },
    ],
  },

  // 📜 Журнал активности
  {
    id: "activity",
    label: {
      en: "Activity Log",
      ru: "Журнал активности",
      pl: "Dziennik aktywności",
    },
    level: "system",
    collapsible: true,
    items: [
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

  // ⚙️ Общие настройки
  {
    id: "settings",
    label: {
      en: "Settings",
      ru: "Настройки",
      pl: "Ustawienia",
    },
    level: "system",
    collapsible: true,
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
