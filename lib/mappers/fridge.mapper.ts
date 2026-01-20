/**
 * Fridge Item View Model Mapper
 * Нормализует данные API для UI
 * 
 * ✅ Чистая модель - только необходимые поля
 * ❌ БЕЗ legacy полей (quantity, ingredient.*)
 */

/**
 * View Model для отображения продукта в холодильнике
 */
export interface FridgeItemVM {
  id: string;
  name: string;
  category: string;

  // Количество
  totalAmount: number;      // Сколько купили
  remainingAmount: number;  // Сколько осталось
  unit: 'g' | 'ml' | 'pcs' | string;

  // Цена
  totalPrice: number;       // Цена покупки
  pricePerUnit: number;     // Цена за единицу

  // Даты
  expiresAt: string;
  daysLeft: number;

  // Статус
  freshness: 'fresh' | 'warning' | 'danger';
}

/**
 * Нормализует категорию по названию продукта
 * Временный фикс до исправления на бэкенде
 */
function normalizeCategory(category: string, name: string): string {
  const n = name.toLowerCase();
  
  // Масла (масло = oil, NOT condiment)
  if (n.includes('масло') || n.includes('olej') || n.includes('oil')) {
    return 'oil';
  }
  
  // Соусы
  if (n.includes('соус') || n.includes('sos') || n.includes('sauce')) {
    return 'sauce';
  }
  
  // Соль, перец → специи/приправы
  if (n.includes('соль') || n.includes('sól') || n.includes('salt') ||
      n.includes('перец') || n.includes('pieprz') || n.includes('pepper')) {
    return 'condiment';
  }
  
  return category;
}

/**
 * Маппер: API Response → View Model
 * ✅ Единственный источник правды для UI
 * 
 * @param apiItem - сырые данные от API
 * @returns FridgeItemVM - нормализованные данные для UI
 */
export function mapFridgeItem(apiItem: any): FridgeItemVM {
  // 📦 Количество
  const total = apiItem.quantity ?? apiItem.amount ?? 0;
  const remaining = apiItem.quantityRemaining ?? apiItem.remainingAmount ?? total;
  
  // 💰 Цена
  const totalPrice = apiItem.totalPrice ?? apiItem.priceTotal ?? apiItem.price ?? 0;
  const pricePerUnit = apiItem.pricePerUnit ?? (totalPrice > 0 && total > 0 ? totalPrice / total : 0);
  
  // 📅 Даты
  const daysLeft = apiItem.daysLeft ?? apiItem.days_left ?? 0;
  const expiresAt = apiItem.expiresAt ?? apiItem.expires_at ?? '';
  
  // 🏷️ Категория
  const rawCategory = apiItem.ingredient?.category ?? apiItem.category ?? 'other';
  const category = normalizeCategory(rawCategory, apiItem.ingredient?.name ?? apiItem.name ?? '');
  
  // ⏳ Статус свежести
  const freshness: FridgeItemVM['freshness'] = 
    daysLeft <= 1 ? 'danger' :
    daysLeft <= 3 ? 'warning' :
    'fresh';
  
  return {
    id: apiItem.id,
    name: apiItem.ingredient?.name ?? apiItem.name ?? 'Unknown',
    category,
    
    totalAmount: total,
    remainingAmount: remaining,
    unit: apiItem.unit ?? 'pcs',
    
    totalPrice,
    pricePerUnit,
    
    expiresAt,
    daysLeft,
    
    freshness,
  };
}

/**
 * Маппинг категорий для i18n
 * НЕ бизнес-логика, только словарь!
 */
export const CATEGORY_LABELS_RU: Record<string, string> = {
  meat: 'Мясо',
  protein: 'Мясо',
  dairy: 'Молочные',
  vegetable: 'Овощи',
  vegetables: 'Овощи',
  fruit: 'Фрукты',
  fruits: 'Фрукты',
  bread: 'Выпечка',
  grain: 'Крупы',
  grains: 'Крупы',
  beverage: 'Напитки',
  beverages: 'Напитки',
  drinks: 'Напитки',
  fish: 'Рыба',
  seafood: 'Рыба',
  egg: 'Яйца',
  eggs: 'Яйца',
  oil: 'Масла',
  fat: 'Жиры',
  sauce: 'Соусы',
  condiment: 'Специи',
  seasoning: 'Специи',
  spice: 'Специи',
  other: 'Другое',
};

export const CATEGORY_LABELS_PL: Record<string, string> = {
  meat: 'Mięso',
  protein: 'Mięso',
  dairy: 'Nabiał',
  vegetable: 'Warzywa',
  vegetables: 'Warzywa',
  fruit: 'Owoce',
  fruits: 'Owoce',
  bread: 'Pieczywo',
  grain: 'Zboża',
  grains: 'Zboża',
  beverage: 'Napoje',
  beverages: 'Napoje',
  drinks: 'Napoje',
  fish: 'Ryby',
  seafood: 'Ryby',
  egg: 'Jajka',
  eggs: 'Jajka',
  oil: 'Tłuszcze',
  fat: 'Tłuszcze',
  sauce: 'Sosy',
  condiment: 'Przyprawy',
  seasoning: 'Przyprawy',
  spice: 'Przyprawy',
  other: 'Inne',
};

export const CATEGORY_LABELS_EN: Record<string, string> = {
  meat: 'Meat',
  protein: 'Protein',
  dairy: 'Dairy',
  vegetable: 'Vegetables',
  vegetables: 'Vegetables',
  fruit: 'Fruits',
  fruits: 'Fruits',
  bread: 'Bread',
  grain: 'Grains',
  grains: 'Grains',
  beverage: 'Beverages',
  beverages: 'Beverages',
  drinks: 'Drinks',
  fish: 'Fish',
  seafood: 'Seafood',
  egg: 'Eggs',
  eggs: 'Eggs',
  oil: 'Oils',
  fat: 'Fats',
  sauce: 'Sauces',
  condiment: 'Seasonings',
  seasoning: 'Seasonings',
  spice: 'Spices',
  other: 'Other',
};
