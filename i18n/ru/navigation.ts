/**
 * Navigation translations (RU)
 */

export const navigation = {
  // Categories
  categories: {
    start: "Старт",
    kitchen: "Кухня (ЯДРО)",
    development: "Развитие",
    economy: "Экономика",
    profile: "Профиль",
  },

  // Menu items
  menu: {
    home: {
      label: "Главная",
      description: "Обзор функций и ценностей",
    },
    fridge: {
      label: "Холодильник",
      description: "Управление продуктами и сроками",
      badge: "Core",
    },
    cooking: {
      label: "Готовка",
      description: "Каталог рецептов и вдохновение",
    },
    assistant: {
      label: "AI Ассистент",
      description: "Умная помощь на кухне",
      badge: "AI",
    },
    myRecipes: {
      label: "Мои рецепты",
      description: "Ваша коллекция любимых рецептов",
    },
    academy: {
      label: "Академия",
      description: "Курсы, обучение и развитие навыков",
    },
    tokens: {
      label: "Токены",
      description: "Ваша валюта осознанной кухни",
    },
    profile: {
      label: "Мой профиль",
      description: "Настройки и статистика",
    },
  },

  // Legacy (для обратной совместимости)
  home: "Главная",
  academy: "Академия",
  recipes: "Рецепты",
  fridge: "Моя Кухня",
  market: "Маркет",
  profile: "Профиль",
  settings: "Настройки",
  admin: "Админ",
  chat: "AI Чат",
  wallet: "Кошелёк",
  logout: "Выйти",
  login: "Войти",
  register: "Регистрация",
} as const;
