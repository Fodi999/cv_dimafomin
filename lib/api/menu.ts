import { apiFetch } from './base';

export type MenuItemStatus = "menu" | "cooking" | "history";

export interface RecipeInfo {
  id: string;
  title: string;
  canonical_name: string;
  image_url: string;
  cook_time: number;
  servings: number;
}

export interface TodayMenuItem {
  id: string;
  servings: number;
  status: MenuItemStatus;
  planned_for: string;
  created_at: string;
  started_cooking_at?: string;
  completed_at?: string;
  recipe: RecipeInfo;
}

class MenuApi {
  /**
   * Get today's menu for the user
   * 
   * Backend returns: MenuItem[]
   * (plain array, not wrapped in object)
   */
  async getToday(token: string, language: string = 'en'): Promise<TodayMenuItem[]> {
    try {
      console.log('🍽️ [menuApi] Fetching today menu...');
      
      // Backend returns array directly: MenuItem[]
      const data = await apiFetch<TodayMenuItem[]>('/menu/today', {
        method: 'GET',
        token,
        language,
      });

      console.log('✅ [menuApi] Raw response from backend:', {
        isArray: Array.isArray(data),
        length: Array.isArray(data) ? data.length : 'not-array',
        firstItem: Array.isArray(data) && data.length > 0 ? {
          id: data[0]?.id,
          status: data[0]?.status,
          recipe: data[0]?.recipe?.title,
        } : 'empty',
      });

      // If response is already an array, return it
      if (Array.isArray(data)) {
        return data;
      }

      // Fallback for wrapped response (shouldn't happen)
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ [menuApi] Error fetching today menu:', error);
      throw error;
    }
  }

  /**
   * Start cooking a menu item
   */
  async startCooking(itemId: string, token: string): Promise<TodayMenuItem> {
    try {
      const data = await apiFetch<{ item: TodayMenuItem }>(`/menu/${itemId}/start`, {
        method: 'POST',
        token,
      });

      return data.item;
    } catch (error) {
      console.error('❌ Error starting to cook:', error);
      throw error;
    }
  }

  /**
   * Mark menu item as completed
   */
  async completeCooking(itemId: string, token: string): Promise<TodayMenuItem> {
    try {
      const data = await apiFetch<{ item: TodayMenuItem }>(`/menu/${itemId}/complete`, {
        method: 'POST',
        token,
      });

      return data.item;
    } catch (error) {
      console.error('❌ Error completing cooking:', error);
      throw error;
    }
  }

  /**
   * Update servings for a menu item
   */
  async updateServings(
    itemId: string,
    servings: number,
    token: string
  ): Promise<TodayMenuItem> {
    try {
      const data = await apiFetch<{ item: TodayMenuItem }>(`/menu/${itemId}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ servings }),
      });

      return data.item;
    } catch (error) {
      console.error('❌ Error updating servings:', error);
      throw error;
    }
  }
}

export const menuApi = new MenuApi();
