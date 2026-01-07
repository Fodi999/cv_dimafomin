/**
 * Определяет "возраст" продукта для визуализации в админке
 * @param createdAt - ISO дата создания
 * @returns "today" | "new" (до 7 дней) | "old" (более 7 дней)
 */
export function getProductAge(createdAt: string | Date): "today" | "new" | "old" {
  const created = new Date(createdAt);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays <= 7) return "new";
  return "old";
}

/**
 * Получить локализованный текст бейджа
 */
export function getProductAgeBadgeText(age: "today" | "new" | "old", lang: "pl" | "en" | "ru" = "pl"): string {
  const texts = {
    today: { pl: "Dziś", en: "Today", ru: "Сегодня" },
    new: { pl: "Nowy", en: "New", ru: "Новый" },
    old: { pl: "Stary", en: "Old", ru: "Старый" }
  };
  
  return texts[age][lang];
}

/**
 * Получить CSS класс для подсветки строки
 */
export function getProductAgeRowClass(age: "today" | "new" | "old"): string {
  switch (age) {
    case "today":
      return "bg-emerald-50 dark:bg-emerald-950/20";
    case "new":
      return "bg-blue-50 dark:bg-blue-950/20";
    default:
      return "";
  }
}

/**
 * Отформатировать дату для старых продуктов
 */
export function formatProductDate(createdAt: string | Date, locale: string = "pl-PL"): string {
  return new Date(createdAt).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
