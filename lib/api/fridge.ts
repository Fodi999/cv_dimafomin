import { apiFetch } from './base';
import type { AddFridgeItemData } from '../types';
import { enrichFridgeItem } from '../fridgeUtils';

/**
 * ✅ NO CATEGORY MAPPING
 * Backend sends categoryKey as-is: "fish", "egg", "grain", "condiment", etc.
 * Frontend uses the same keys for filtering
 * Translation happens via i18n: t.fridge.categories[categoryKey]
 * 
 * ❌ REMOVED: mapBackendCategoryToFrontend()
 * ❌ REMOVED: getCategoryFromName()
 * 
 * Architecture: categoryKey = stable backend identifier, NOT translated label
 */

export const fridgeApi = {
  /**
   * GET /api/catalog/ingredients/search?query=ml
   * Поиск ингредиентов для autocomplete
   */
  searchIngredients: async (query: string, token: string, language?: string) => {
    if (!query || query.trim().length < 1) {
      return { count: 0, items: [] };
    }
    try {
      const params = new URLSearchParams({ query: query.trim() });
      const response = await apiFetch<{ count: number; items: any[] }>(`/catalog/ingredients/search?${params}`, { token, language });
      
      // ✅ NO MAPPING - return backend data as-is
      return response;
    } catch (err: any) {
      console.warn("Ingredients search error:", err);
      return { count: 0, items: [] };
    }
  },

  /**
   * GET /api/fridge/items
   * Получить содержимое холодильника пользователя
   */
  getItems: async (token: string) => {
    try {
      const response = await apiFetch<any>("/fridge/items", { token });
      
      // Backend returns full ingredient object with categoryKey
      if (response?.items && Array.isArray(response.items)) {
        
        const normalizedItems = response.items.map((item: any, index: number) => {
          // ✅ Backend returns full ingredient object with translations
          const ingredient = item.ingredient || {
            id: item.ingredientId || item.ingredient_id,
            name: item.name, // fallback for old format
            category: item.category || 'other',
          };
          
          // 🔍 DEBUG: Log categoryKey from backend
          if (process.env.NODE_ENV === "development") {
            console.log(`[fridgeApi.getItems] 🔑 Item ${index + 1}:`, {
              name: ingredient.name,
              categoryKey: ingredient.category, // ✅ This is the stable key
            });
          }
          
          // Backend returns totalPrice, currency, pricePerUnit
          const totalPrice = item.totalPrice || item.total_price;
          const pricePerUnit = item.pricePerUnit || item.price_per_unit;
          const currency = item.currency || 'PLN';
          
          // expiresAt should be provided by backend now
          const expiresAt = item.expiresAt || item.expires_at;
          
          // ✅ Backend может вернуть quantityTotal и quantityRemaining
          const quantityTotal = item.quantityTotal || item.quantity_total || item.quantity;
          const quantityRemaining = item.quantityRemaining || item.quantity_remaining || item.quantity;
          
          const baseItem = {
            id: item.id,
            ingredient: {
              id: ingredient.id,
              name: ingredient.name,
              namePl: ingredient.name_pl,
              nameEn: ingredient.name_en,
              nameRu: ingredient.name_ru,
              category: ingredient.category, // ✅ Keep backend key as-is (fish, egg, grain, etc.)
              key: ingredient.key, // Language-independent ingredient key
            },
            quantity: item.quantity,
            quantityTotal,      // ✅ How much was purchased
            quantityRemaining,  // ✅ How much is left
            unit: item.unit,
            arrivedAt: item.arrivedAt || item.arrived_at,
            expiresAt: expiresAt,
            daysLeft: item.daysLeft || item.days_left || 0,
            status: item.status || 'ok',
            totalPrice: totalPrice,
            currency: currency,
            pricePerUnit: pricePerUnit,
          };
          
          // ✅ Enrich with calculated fields (freshness, currentValue, usagePercent)
          return enrichFridgeItem(baseItem);
        });
        
        return { items: normalizedItems };
      }
      
      return response;
    } catch (err: any) {
      if (err.status === 404) {
        console.warn("Fridge endpoint not available (404)");
        return { items: [] };
      }
      throw err;
    }
  },

  /**
   * POST /api/fridge/items
   * Добавить продукт в холодильник
   */
  addItem: async (data: AddFridgeItemData, token: string) => {
    return apiFetch("/fridge/items", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE /api/fridge/items/{id}
   * Удалить продукт из холодильника
   */
  deleteItem: async (id: string, token: string) => {
    return apiFetch(`/fridge/items/${id}`, {
      method: "DELETE",
      token,
    });
  },

  /**
   * POST /api/fridge/items/{id}/price
   * Добавить price-event для продукта (event sourcing)
   */
  addPrice: async (id: string, data: { pricePerUnit: number; currency: string; source: string }, token: string) => {
    return apiFetch(`/fridge/items/${id}/price`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/fridge/items/{id}/price/history
   * Получить историю изменения цен продукта
   */
  getPriceHistory: async (id: string, token: string) => {
    return apiFetch<{ history: Array<{ pricePerUnit: number; currency: string; source: string; createdAt: string }> }>(
      `/fridge/items/${id}/price/history`,
      {
        method: "GET",
        token,
      }
    );
  },

  /**
   * PATCH /api/fridge/items/{id}
   * Обновить количество продукта
   */
  updateItemQuantity: async (id: string, data: { quantity: number }, token: string) => {
    return apiFetch(`/fridge/items/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/fridge/deduct
   * Списать ингредиенты из холодильника (кнопка "Zrobione")
   */
  deductIngredients: async (ingredients: Array<{ name: string; quantity?: number; unit?: string }>, token: string) => {
    return apiFetch<{
      success: boolean;
      message: string;
      deducted: any[];
      remaining: any[];
      totalValue?: number;
    }>("/fridge/deduct", {
      method: "POST",
      token,
      body: JSON.stringify({ ingredients }),
    });
  },

  /**
   * Batch добавление ингредиентов (для "Dodaj brakujące do lodówki")
   * Использует /api/fridge/search + /api/fridge/items для каждого ингредиента
   */
  addIngredientsBatch: async (
    ingredients: Array<{ name: string; quantity: number; unit: string; category?: string }>,
    token: string
  ): Promise<{ success: boolean; added: number; failed: number }> => {
    let added = 0;
    let failed = 0;

    for (const ing of ingredients) {
      try {
        // 1. Найти ingredient_id по имени
        const searchResult = await fridgeApi.searchIngredients(ing.name, token);
        
        if (searchResult.count > 0) {
          const ingredientId = searchResult.items[0].id;
          
          // 2. Добавить в fridge
          await fridgeApi.addItem({
            ingredientId,
            quantity: ing.quantity,
            unit: ing.unit,
          }, token);
          
          added++;
        } else {
          console.warn(`Ingredient not found: ${ing.name}`);
          failed++;
        }
      } catch (error) {
        console.error(`Failed to add ${ing.name}:`, error);
        failed++;
      }
    }

    return { success: added > 0, added, failed };
  },
};
