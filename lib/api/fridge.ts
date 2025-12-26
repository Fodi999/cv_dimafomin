import { apiFetch } from './base';
import type { AddFridgeItemData } from '../types';

/**
 * Mapping Backend категорий (EN) → Frontend категорий (PL)
 */
const mapBackendCategoryToFrontend = (backendCategory?: string): string => {
  if (!backendCategory) return 'Inne';
  
  const mapping: Record<string, string> = {
    'protein': 'Mięso',       // Kurczak, Wołowina, etc.
    'dairy': 'Nabiał',        // Mleko, Ser, Jogurt
    'vegetable': 'Warzywa',   // ← Singular form
    'vegetables': 'Warzywa',  // Pomidory, Ogórki
    'fruit': 'Owoce',         // ← Singular form
    'fruits': 'Owoce',        // Jabłka, Banany
    'grain': 'Pieczywo',      // ← Singular form
    'grains': 'Pieczywo',     // Chleb, Bułki
    'beverage': 'Napoje',     // ← Singular form
    'beverages': 'Napoje',    // Woda, Sok
    'seafood': 'Ryby',        // Łosoś, Tuńczyk
    'other': 'Inne',          // Pozostałe
  };
  
  return mapping[backendCategory.toLowerCase()] || 'Inne';
};

/**
 * Fallback: Określenie kategorii po nazwie (jeśli backend не zwrócił)
 */
const getCategoryFromName = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('mleko') || lowerName.includes('milk') || lowerName.includes('jogurt') || lowerName.includes('ser')) {
    return 'Nabiał';
  }
  if (lowerName.includes('mięso') || lowerName.includes('kurczak') || lowerName.includes('wołowina')) {
    return 'Mięso';
  }
  if (lowerName.includes('chleb') || lowerName.includes('bułka') || lowerName.includes('bagietka')) {
    return 'Pieczywo';
  }
  if (lowerName.includes('jabłko') || lowerName.includes('banan') || lowerName.includes('pomarańcz')) {
    return 'Owoce';
  }
  if (lowerName.includes('pomidor') || lowerName.includes('ogórek') || lowerName.includes('sałata')) {
    return 'Warzywa';
  }
  return 'Inne';
};

export const fridgeApi = {
  /**
   * GET /api/catalog/ingredients/search?query=ml
   * Поиск ингредиентов для autocomplete
   */
  searchIngredients: async (query: string, token: string) => {
    if (!query || query.trim().length < 1) {
      return { count: 0, items: [] };
    }
    try {
      const params = new URLSearchParams({ query: query.trim() });
      const response = await apiFetch<{ count: number; items: any[] }>(`/catalog/ingredients/search?${params}`, { token });
      console.log('[fridgeApi.searchIngredients] 📥 Response from apiFetch:', response);
      
      // Нормализация категорий в результатах поиска
      if (response?.items && Array.isArray(response.items)) {
        const normalizedItems = response.items.map((item: any) => ({
          ...item,
          category: mapBackendCategoryToFrontend(item.category),
        }));
        
        console.log('[fridgeApi.searchIngredients] 🔄 Normalized categories:', normalizedItems.map(i => ({ name: i.name, category: i.category })));
        
        return { count: response.count || normalizedItems.length, items: normalizedItems };
      }
      
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
      console.log('[fridgeApi.getItems] 📡 Calling apiFetch...');
      const response = await apiFetch<any>("/fridge/items", { token });
      console.log('[fridgeApi.getItems] 📥 Response from apiFetch:', response);
      
      // Нормализация: Backend возвращает плоскую структуру, UI ожидает вложенную
      if (response?.items && Array.isArray(response.items)) {
        console.log('[fridgeApi.getItems] 📋 Raw item sample:', response.items[0]);
        console.log('[fridgeApi.getItems] 📋 FULL RAW RESPONSE:', JSON.stringify(response, null, 2));
        
        const normalizedItems = response.items.map((item: any) => {
          console.log('[fridgeApi.getItems] 🔍 Processing item:', {
            id: item.id,
            name: item.name,
            backendCategory: item.category,
            ingredientId: item.ingredientId || item.ingredient_id,
            totalPrice: item.totalPrice || item.total_price,
            pricePerUnit: item.pricePerUnit || item.price_per_unit,
          });
          
          // Приоритет: 1) Backend category (mapped), 2) Ingredient category (mapped), 3) Name-based detection
          const backendCat = item.category || item.ingredient?.category;
          const normalizedCategory = backendCat 
            ? mapBackendCategoryToFrontend(backendCat)
            : getCategoryFromName(item.name || '');
          
          console.log('[fridgeApi.getItems] 📂 Category mapping:', {
            backend: backendCat,
            frontend: normalizedCategory,
          });
          
          // Backend should return totalPrice, currency, pricePerUnit
          const totalPrice = item.totalPrice || item.total_price;
          const pricePerUnit = item.pricePerUnit || item.price_per_unit;
          const currency = item.currency || 'PLN';
          
          // Вычисляем expiresAt из arrivedAt + daysLeft (если бэкенд не отправил)
          let expiresAt = item.expiresAt || item.expires_at;
          if (!expiresAt && (item.arrivedAt || item.arrived_at) && (item.daysLeft !== undefined || item.days_left !== undefined)) {
            const arrivedDate = new Date(item.arrivedAt || item.arrived_at);
            const daysLeft = item.daysLeft ?? item.days_left ?? 0;
            const expiresDate = new Date(arrivedDate);
            expiresDate.setDate(expiresDate.getDate() + daysLeft);
            expiresAt = expiresDate.toISOString();
          }
          
          return {
            id: item.id,
            ingredient: {
              name: item.name || item.ingredient?.name || 'Unknown',
              category: normalizedCategory,
            },
            quantity: item.quantity,
            unit: item.unit,
            arrivedAt: item.arrivedAt || item.arrived_at,
            expiresAt: expiresAt,
            daysLeft: item.daysLeft || item.days_left || 0,
            status: item.status || 'ok',
            totalPrice: totalPrice,
            currency: currency,
            pricePerUnit: pricePerUnit,
          };
        });
        
        console.log('[fridgeApi.getItems] 🔄 Normalized items:', normalizedItems);
        console.log('[fridgeApi.getItems] 🎯 Returning:', { items: normalizedItems });
        
        return { items: normalizedItems };
      }
      
      console.log('[fridgeApi.getItems] 🎯 Returning:', response);
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
