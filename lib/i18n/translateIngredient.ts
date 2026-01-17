/**
 * Ingredient Name Translation Helper
 * Помощник для перевода названий ингредиентов
 * 
 * Backend возвращает canonical_name + i18n_key (slug)
 * Frontend переводит через словарь
 */

import type { Dictionary } from "@/lib/i18n/types";
import type { CatalogIngredient } from "@/lib/types";

/**
 * Get localized ingredient name from backend response
 * 
 * ✅ Backend отправляет:
 *    - name: уже локализованное название (для текущего языка пользователя)
 *    - name_en, name_pl, name_ru: все переводы (для динамического переключения)
 * 
 * 🔄 Frontend использует:
 *    - name_ru / name_pl / name_en для ДИНАМИЧЕСКОГО переключения языка
 *    - Фоллбэк на name (уже локализованное backend'ом)
 * 
 * @param ingredient - Ingredient object with name, namePl, nameEn, nameRu fields
 * @param language - Current language (pl, en, ru)
 * @returns Localized name based on current language
 */
export function getLocalizedIngredientName(
  ingredient: CatalogIngredient | { name: string; namePl?: string; nameEn?: string; nameRu?: string },
  language: string
): string {
  // 🌍 Динамическое переключение языка на frontend
  switch (language) {
    case 'ru':
      return ingredient.nameRu || ingredient.name;
    case 'en':
      return ingredient.nameEn || ingredient.name;
    case 'pl':
    default:
      return ingredient.namePl || ingredient.name;
  }
}

/**
 * Переводит название ингредиента
 * @param ingredientName - Каноническое имя (fallback)
 * @param i18nKey - Ключ для перевода (slug)
 * @param t - Словарь переводов
 * @returns Переведенное название или fallback
 */
export function translateIngredient(
  ingredientName: string,
  i18nKey: string | undefined | null,
  t: Dictionary | undefined
): string {
  // Если нет словаря, возвращаем каноническое имя
  if (!t || !t.ingredients) {
    return ingredientName;
  }

  // Если есть i18n_key, пытаемся перевести
  if (i18nKey && i18nKey in t.ingredients) {
    return t.ingredients[i18nKey as keyof typeof t.ingredients] as string;
  }

  // Fallback на каноническое имя
  return ingredientName;
}

/**
 * Создает slug из названия ингредиента для backward compatibility
 * Временная функция до тех пор, пока backend не вернет i18n_key
 */
export function generateIngredientSlug(name: string): string {
  const slugMap: Record<string, string> = {
    "Ogórek": "ingredient.cucumber",
    "Cebula": "ingredient.onion",
    "Pomidor": "ingredient.tomato",
    "Marchew": "ingredient.carrot",
    "Ziemniak": "ingredient.potato",
    "Sałata": "ingredient.lettuce",
    "Papryka": "ingredient.bell_pepper",
    "Czosnek": "ingredient.garlic",
    "Kapusta": "ingredient.cabbage",
    "Burak": "ingredient.beetroot",
    "Kurczak": "ingredient.chicken",
    "Wołowina": "ingredient.beef",
    "Wieprzowina": "ingredient.pork",
    "Indyk": "ingredient.turkey",
    "Jagnięcina": "ingredient.lamb",
    "Łosoś": "ingredient.salmon",
    "Tuńczyk": "ingredient.tuna",
    "Dorsz": "ingredient.cod",
    "Śledź": "ingredient.herring",
    "Mleko": "ingredient.milk",
    "Ser": "ingredient.cheese",
    "Masło": "ingredient.butter",
    "Jogurt": "ingredient.yogurt",
    "Śmietana": "ingredient.cream",
    "Jaja": "ingredient.eggs",
    "Jabłko": "ingredient.apple",
    "Banan": "ingredient.banana",
    "Pomarańcza": "ingredient.orange",
    "Truskawka": "ingredient.strawberry",
    "Cytryna": "ingredient.lemon",
    "Ryż": "ingredient.rice",
    "Makaron": "ingredient.pasta",
    "Chleb": "ingredient.bread",
    "Mąka": "ingredient.flour",
    "Sól": "ingredient.salt",
    "Pieprz": "ingredient.black_pepper",
    "Pieprz cayenne": "ingredient.cayenne_pepper",
    "Sos rybny": "ingredient.fish_sauce",
    "Sos sojowy": "ingredient.soy_sauce",
    "Oliwa z oliwek": "ingredient.olive_oil",
    "Cukier": "ingredient.sugar",
    "Miód": "ingredient.honey",
  };

  return slugMap[name] || name;
}
