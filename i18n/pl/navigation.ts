/**
 * Navigation translations (PL)
 * Меню, навигация, ссылки
 */

export const navigation = {
  // Categories
  categories: {
    start: "Start",
    kitchen: "Kuchnia (CORE)",
    development: "Rozwój",
    economy: "Ekonomia",
    profile: "Profil",
  },

  // Menu items
  menu: {
    home: {
      label: "Strona główna",
      description: "Przegląd wartości i funkcji",
    },
    fridge: {
      label: "Lodówka",
      description: "Zarządzaj składnikami i datami",
      badge: "Core",
    },
    cooking: {
      label: "Gotowanie",
      description: "Katalog przepisów i inspiracji",
    },
    assistant: {
      label: "AI Asystent",
      description: "Inteligentna pomoc w kuchni",
      badge: "AI",
    },
    myRecipes: {
      label: "Moje przepisy",
      description: "Twoja kolekcja ulubionych przepisów",
    },
    academy: {
      label: "Akademia",
      description: "Kursy, nauka i rozwój umiejętności",
    },
    tokens: {
      label: "Tokens",
      description: "Twoja waluta świadomej kuchni",
    },
    profile: {
      label: "Mój profil",
      description: "Ustawienia i statystyki",
    },
  },

  // Legacy (для обратной совместимости)
  home: "Strona główna",
  academy: "Akademia",
  recipes: "Przepisy",
  fridge: "Lodówka",
  market: "Market",
  profile: "Profil",
  assistant: "Asystent AI",
  admin: "Admin",
  settings: "Ustawienia",
  logout: "Wyloguj",
  login: "Zaloguj się",
  register: "Zarejestruj się",
} as const;
