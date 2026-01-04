/**
 * Admin Navigation Schema
 * 
 * Профессиональная структура админ-панели:
 * - Dashboard: Обзор системы, KPI, мониторинг
 * - Users: Управление пользователями, роли, доступы
 * - Content: Рецепты, ингредиенты, категории, локализация
 * - AI & Logic: Сценарии AI, промпты, логи
 * - Economy: Токены, транзакции, награды
 * - Operations: Заказы, платежи, подписки
 * - Integrations: API, вебхуки, внешние сервисы
 * - Settings: Конфигурация системы
 */

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Brain,
  Wallet,
  ShoppingCart,
  Plug,
  Settings,
  ChefHat,
  Carrot,
  Languages,
  Shield,
  MessageSquare,
  FileText,
  TrendingUp,
  Activity,
  CreditCard,
  Package,
  Key,
  Webhook,
  Flag,
  Lock,
  type LucideIcon,
} from "lucide-react";

/**
 * Типы ролей для доступа к разделам
 */
export type AdminRole = "admin" | "superadmin" | "moderator" | "support";

/**
 * Feature flags для условного отображения разделов
 */
export type FeatureFlag = 
  | "operations"
  | "integrations" 
  | "ai_logs"
  | "advanced_settings";

/**
 * Элемент навигации
 */
export interface NavigationItem {
  id: string;
  label: {
    en: string;
    ru: string;
    pl: string;
  };
  icon: LucideIcon;
  href: string;
  badge?: string; // Для отображения счетчиков
  requiredRoles?: AdminRole[]; // Если не указано - доступно всем админам
  requiredFeatures?: FeatureFlag[]; // Требуемые feature flags
  children?: NavigationItem[];
}

/**
 * Секция навигации (группа разделов)
 */
export interface NavigationSection {
  id: string;
  label: {
    en: string;
    ru: string;
    pl: string;
  };
  items: NavigationItem[];
  requiredRoles?: AdminRole[];
  requiredFeatures?: FeatureFlag[]; // Feature flags для секции
}

/**
 * Полная схема админ-навигации
 */
export const adminNavigationSchema: NavigationSection[] = [
  // ═══════════════════════════════════════════════════════════
  // 🏠 DASHBOARD - Главная панель
  // ═══════════════════════════════════════════════════════════
  {
    id: "dashboard",
    label: {
      en: "Overview",
      ru: "Обзор",
      pl: "Przegląd",
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

  // ═══════════════════════════════════════════════════════════
  // 👥 USERS - Управление пользователями
  // ═══════════════════════════════════════════════════════════
  {
    id: "users",
    label: {
      en: "Users",
      ru: "Пользователи",
      pl: "Użytkownicy",
    },
    items: [
      {
        id: "users-list",
        label: {
          en: "All Users",
          ru: "Все пользователи",
          pl: "Wszyscy użytkownicy",
        },
        icon: Users,
        href: "/admin/users",
      },
      {
        id: "roles",
        label: {
          en: "Roles & Permissions",
          ru: "Роли и доступы",
          pl: "Role i uprawnienia",
        },
        icon: Shield,
        href: "/admin/users/roles",
        requiredRoles: ["admin", "superadmin"],
      },
      {
        id: "user-activity",
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

  // ═══════════════════════════════════════════════════════════
  // 🍽️ CONTENT - Управление контентом
  // ═══════════════════════════════════════════════════════════
  {
    id: "content",
    label: {
      en: "Content",
      ru: "Контент",
      pl: "Zawartość",
    },
    items: [
      {
        id: "recipes",
        label: {
          en: "Recipes",
          ru: "Рецепты",
          pl: "Przepisy",
        },
        icon: ChefHat,
        href: "/admin/recipes",
      },
      {
        id: "ingredients",
        label: {
          en: "Ingredients",
          ru: "Ингредиенты",
          pl: "Składniki",
        },
        icon: Carrot,
        href: "/admin/ingredients",
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
        requiredRoles: ["admin", "superadmin"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 🧠 AI & LOGIC - Управление AI и бизнес-логикой
  // ═══════════════════════════════════════════════════════════
  {
    id: "ai",
    label: {
      en: "AI & Logic",
      ru: "AI и логика",
      pl: "AI i logika",
    },
    items: [
      {
        id: "ai-scenarios",
        label: {
          en: "AI Scenarios",
          ru: "Сценарии AI",
          pl: "Scenariusze AI",
        },
        icon: Brain,
        href: "/admin/ai/scenarios",
        requiredRoles: ["admin", "superadmin"],
      },
      {
        id: "prompts",
        label: {
          en: "Prompt Templates",
          ru: "Шаблоны промптов",
          pl: "Szablony promptów",
        },
        icon: MessageSquare,
        href: "/admin/ai/prompts",
        requiredRoles: ["admin", "superadmin"],
      },
      {
        id: "ai-logs",
        label: {
          en: "AI Logs",
          ru: "Логи AI",
          pl: "Logi AI",
        },
        icon: FileText,
        href: "/admin/ai/logs",
        requiredRoles: ["admin", "superadmin"],
        requiredFeatures: ["ai_logs"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 💰 ECONOMY - Экономика и токены
  // ═══════════════════════════════════════════════════════════
  {
    id: "economy",
    label: {
      en: "Economy",
      ru: "Экономика",
      pl: "Ekonomia",
    },
    items: [
      {
        id: "token-bank",
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
        id: "rewards",
        label: {
          en: "Rewards & Penalties",
          ru: "Награды и штрафы",
          pl: "Nagrody i kary",
        },
        icon: CreditCard,
        href: "/admin/rewards",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 📦 OPERATIONS - Операции и заказы
  // ═══════════════════════════════════════════════════════════
  {
    id: "operations",
    label: {
      en: "Operations",
      ru: "Операции",
      pl: "Operacje",
    },
    requiredFeatures: ["operations"],
    items: [
      {
        id: "orders",
        label: {
          en: "Orders",
          ru: "Заказы",
          pl: "Zamówienia",
        },
        icon: ShoppingCart,
        href: "/admin/orders",
      },
      {
        id: "payments",
        label: {
          en: "Payments",
          ru: "Платежи",
          pl: "Płatności",
        },
        icon: CreditCard,
        href: "/admin/payments",
      },
      {
        id: "subscriptions",
        label: {
          en: "Subscriptions",
          ru: "Подписки",
          pl: "Subskrypcje",
        },
        icon: Package,
        href: "/admin/subscriptions",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 🔌 INTEGRATIONS - Интеграции
  // ═══════════════════════════════════════════════════════════
  {
    id: "integrations",
    label: {
      en: "Integrations",
      ru: "Интеграции",
      pl: "Integracje",
    },
    requiredRoles: ["admin", "superadmin"],
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
        id: "external-services",
        label: {
          en: "External Services",
          ru: "Внешние сервисы",
          pl: "Usługi zewnętrzne",
        },
        icon: Plug,
        href: "/admin/integrations",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ⚙️ SETTINGS - Настройки системы
  // ═══════════════════════════════════════════════════════════
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
          en: "General Settings",
          ru: "Основные настройки",
          pl: "Ustawienia ogólne",
        },
        icon: Settings,
        href: "/admin/settings",
      },
      {
        id: "feature-flags",
        label: {
          en: "Feature Flags",
          ru: "Флаги функций",
          pl: "Flagi funkcji",
        },
        icon: Flag,
        href: "/admin/settings/features",
        requiredRoles: ["admin", "superadmin"],
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
        requiredRoles: ["superadmin"],
      },
    ],
  },
];

/**
 * Получить локализованный label
 */
export function getLocalizedLabel(
  item: NavigationItem | NavigationSection,
  language: "en" | "ru" | "pl" = "en"
): string {
  return item.label[language] || item.label.en;
}

/**
 * Проверить доступ к разделу по роли
 */
export function hasAccess(
  item: NavigationItem | NavigationSection,
  userRole: AdminRole
): boolean {
  if (!item.requiredRoles || item.requiredRoles.length === 0) {
    return true; // Доступно всем админам
  }
  return item.requiredRoles.includes(userRole);
}

/**
 * Проверить доступ по feature flags
 */
export function hasFeature(
  item: NavigationItem | NavigationSection,
  enabledFeatures: FeatureFlag[]
): boolean {
  if (!item.requiredFeatures || item.requiredFeatures.length === 0) {
    return true;
  }
  return item.requiredFeatures.every((flag: FeatureFlag) => enabledFeatures.includes(flag));
}

/**
 * Фильтровать навигацию по роли и feature flags
 */
export function filterNavigation(
  navigation: NavigationSection[],
  userRole: AdminRole,
  enabledFeatures: FeatureFlag[] = []
): NavigationSection[] {
  return navigation
    .filter((section) => hasAccess(section, userRole) && hasFeature(section, enabledFeatures))
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => hasAccess(item, userRole) && hasFeature(item, enabledFeatures)
      ),
    }))
    .filter((section) => section.items.length > 0);
}
