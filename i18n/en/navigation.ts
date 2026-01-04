/**
 * Navigation translations (EN)
 * Навигация, меню
 */

export const navigation = {
  // Categories
  categories: {
    start: "Start",
    kitchen: "Kitchen (CORE)",
    development: "Development",
    economy: "Economy",
    profile: "Profile",
  },

  // Menu items
  menu: {
    home: {
      label: "Home",
      description: "Overview of features and values",
    },
    fridge: {
      label: "Fridge",
      description: "Manage ingredients and dates",
      badge: "Core",
    },
    cooking: {
      label: "Cooking",
      description: "Recipe catalog and inspiration",
    },
    assistant: {
      label: "AI Assistant",
      description: "Smart kitchen help",
      badge: "AI",
    },
    myRecipes: {
      label: "My Recipes",
      description: "Your favorite recipes collection",
    },
    academy: {
      label: "Academy",
      description: "Courses, learning and skill development",
    },
    tokens: {
      label: "Tokens",
      description: "Your conscious kitchen currency",
    },
    profile: {
      label: "My Profile",
      description: "Settings and statistics",
    },
  },

  // Legacy (для обратной совместимости)
  home: "Home",
  academy: "Academy",
  recipes: "Recipes",
  fridge: "My Fridge",
  market: "Market",
  profile: "Profile",
  settings: "Settings",
  admin: "Admin",
  chat: "AI Chat",
  wallet: "Wallet",
  logout: "Log out",
  login: "Log in",
  register: "Sign up",
} as const;
