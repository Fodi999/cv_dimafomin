/**
 * Маппинг категорий и нутриентных групп ингредиентов
 * 
 * ВАЖНО:
 * - category = кулинарная категория (рыба, мясо, овощ) - показывается в UI
 * - nutritionGroup = нутриентная роль (белок, углеводы, жиры) - дополнительная информация
 */

/**
 * Кулинарные категории (category)
 * Используются в основном UI: таблицах, модалках, карточках
 */
export const CATEGORY_LABELS: Record<string, string> = {
  fish: "Рыба",
  meat: "Мясо",
  egg: "Яйца",
  vegetable: "Овощи",
  fruit: "Фрукты",
  dairy: "Молочные продукты",
  grain: "Крупы",
  pasta: "Макароны",
  bread: "Хлеб",
  condiment: "Приправы",
  spice: "Специи",
  herb: "Зелень",
  nut: "Орехи",
  seed: "Семена",
  oil: "Масла",
  sauce: "Соусы",
  beverage: "Напитки",
  sweet: "Сладости",
  legume: "Бобовые",
  cheese: "Сыр",
  seafood: "Морепродукты",
  other: "Другое",
};

/**
 * Нутриентные группы (nutritionGroup)
 * Используются как дополнительная информация в тултипах, аналитике
 */
export const NUTRITION_LABELS: Record<string, string> = {
  protein: "Белок",
  carbohydrate: "Углеводы",
  fat: "Жиры",
  vegetable: "Овощи",
  fruit: "Фрукты",
  dairy: "Молочные",
  other: "Другое",
};

/**
 * Иконки для категорий
 */
export const CATEGORY_ICONS: Record<string, string> = {
  fish: "🐟",
  meat: "🥩",
  egg: "🥚",
  vegetable: "🥬",
  fruit: "🍎",
  dairy: "🥛",
  grain: "🌾",
  pasta: "🍝",
  bread: "🍞",
  condiment: "🧂",
  spice: "🌶️",
  herb: "🌿",
  nut: "🥜",
  seed: "🌻",
  oil: "🫒",
  sauce: "🥫",
  beverage: "🥤",
  sweet: "🍬",
  legume: "🫘",
  cheese: "🧀",
  seafood: "🦐",
  other: "📦",
};

/**
 * Иконки для нутриентных групп
 */
export const NUTRITION_ICONS: Record<string, string> = {
  protein: "💪",
  carbohydrate: "⚡",
  fat: "🥑",
  vegetable: "🥬",
  fruit: "🍎",
  dairy: "🥛",
  other: "📦",
};

/**
 * Получить название категории на русском
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category.toLowerCase()] || category;
}

/**
 * Получить название нутриентной группы на русском
 */
export function getNutritionLabel(nutritionGroup: string): string {
  return NUTRITION_LABELS[nutritionGroup.toLowerCase()] || nutritionGroup;
}

/**
 * Получить иконку категории
 */
export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category.toLowerCase()] || "📦";
}

/**
 * Получить иконку нутриентной группы
 */
export function getNutritionIcon(nutritionGroup: string): string {
  return NUTRITION_ICONS[nutritionGroup.toLowerCase()] || "📦";
}
