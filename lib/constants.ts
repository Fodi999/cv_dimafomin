// Recipe Categories
export const RECIPE_CATEGORIES = [
  { value: "sushi", label: "🍣 Суші", emoji: "🍣" },
  { value: "rolls", label: "🍱 Роли", emoji: "🍱" },
  { value: "nigiri", label: "🍙 Нігірі", emoji: "🍙" },
  { value: "sashimi", label: "🐟 Сашімі", emoji: "🐟" },
  { value: "tempura", label: "🍤 Темпура", emoji: "🍤" },
  { value: "ramen", label: "🍜 Рамен", emoji: "🍜" },
  { value: "donburi", label: "🍚 Донбурі", emoji: "🍚" },
  { value: "udon", label: "🥢 Удон", emoji: "🥢" },
  { value: "appetizers", label: "🥟 Закуски", emoji: "🥟" },
  { value: "desserts", label: "🍰 Десерти", emoji: "🍰" },
  { value: "drinks", label: "🍵 Напої", emoji: "🍵" },
  { value: "other", label: "🌟 Інше", emoji: "🌟" },
] as const;

// Recipe Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Початковий", color: "green" },
  { value: "intermediate", label: "Середній", color: "yellow" },
  { value: "advanced", label: "Просунутий", color: "red" },
] as const;

// Get category label by value
export function getCategoryLabel(value: string): string {
  const category = RECIPE_CATEGORIES.find(cat => cat.value === value);
  return category?.label || value;
}

// Get category emoji by value
export function getCategoryEmoji(value: string): string {
  const category = RECIPE_CATEGORIES.find(cat => cat.value === value);
  return category?.emoji || "🍽️";
}

// Get difficulty label by value
export function getDifficultyLabel(value: string): string {
  const difficulty = DIFFICULTY_LEVELS.find(diff => diff.value === value);
  return difficulty?.label || value;
}

// Get difficulty color by value
export function getDifficultyColor(value: string): string {
  const difficulty = DIFFICULTY_LEVELS.find(diff => diff.value === value);
  return difficulty?.color || "gray";
}
