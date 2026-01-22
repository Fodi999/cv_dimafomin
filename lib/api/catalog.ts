/**
 * Recipe Catalog API
 * Получение каталога всех рецептов из базы
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

export interface CatalogRecipe {
  id: string;
  canonicalName: string;
  title: string;
  imageUrl?: string;
  servings?: number;
  cookTime?: number;
  difficulty?: string;
  category?: string;
  country?: string;
  canCookNow?: boolean; // ✅ Можно ли приготовить сейчас (все ингредиенты есть)
  matchPercent?: number; // ✅ Процент совпадения с холодильником
}

export interface CatalogResponse {
  recipes: CatalogRecipe[];
  total: number;
}

/**
 * Получить каталог всех рецептов с локализацией И проверкой холодильника
 * 
 * @param token - JWT token
 * @param lang - Язык (ru, pl, en)
 * @param limit - Количество рецептов (по умолчанию 100)
 */
export async function fetchRecipeCatalog(
  token: string | null,
  lang: string = 'ru',
  limit: number = 100
): Promise<CatalogResponse> {
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    // ✅ Use /recipe-recommendations instead of /recipes to get fridge match data
    const response = await fetch(
      `${API_BASE}/recipe-recommendations?lang=${lang}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.statusText}`);
    }

    const json = await response.json();
    
    console.log('📚 Catalog response:', json);
    
    // Transform backend format to catalog format
    // Note: /recipe-recommendations returns recipes directly, not inside data object
    const recipesArray = json.recipes || json.data?.recipes || [];
    const recipes: CatalogRecipe[] = recipesArray.map((r: any) => ({
      id: r.id,
      canonicalName: r.canonical_name,
      title: r.title,
      imageUrl: r.image_url,
      servings: r.servings,
      cookTime: r.cook_time,
      difficulty: r.difficulty || 'easy',
      category: r.category,
      country: r.country,
      canCookNow: r.match_status === 'ready', // ✅ Backend indicates all ingredients available
      matchPercent: r.match_percent || 0, // ✅ Match percentage
    }));

    return {
      recipes,
      total: json.total_matches || json.data?.count || recipes.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch recipe catalog:', error);
    throw error;
  }
}

/**
 * Recipe Details Interface
 */
export interface RecipeDetails {
  id: string;
  canonicalName: string;
  title: string;
  imageUrl?: string;
  servings: number;
  cookTime: number;
  timeMinutes: number; // Alias for cookTime
  difficulty: string;
  category: string;
  country: string;
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    inFridge?: boolean;
    fridgeQuantity?: number;
  }[];
  steps: string[];
  instructions: string[]; // Alias for steps
  tags?: string[];
  isSaved?: boolean;
}

/**
 * Получить детали конкретного рецепта
 * 
 * @param canonicalName - Каноническое имя рецепта (например: fried-eggs)
 * @param token - JWT token
 * @param lang - Язык (ru, pl, en)
 */
export async function fetchRecipeDetails(
  canonicalName: string,
  token: string | null,
  lang: string = 'ru'
): Promise<RecipeDetails> {
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    console.log(`🔍 Fetching recipe details with fridge check: ${canonicalName}, lang: ${lang}`);
    
    // ✅ Use /recipe-recommendations/{canonical_name} instead of /recipes/{canonical_name}
    // This endpoint checks user's fridge and returns inFridge status for each ingredient
    const response = await fetch(
      `${API_BASE}/recipe-recommendations/${canonicalName}?lang=${lang}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Рецепт не найден');
      }
      if (response.status === 401) {
        // Check if token is expired
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error && errorData.error.includes('expired')) {
          throw new Error('Token expired');
        }
        throw new Error('Требуется авторизация');
      }
      throw new Error(`Failed to fetch recipe: ${response.statusText}`);
    }

    const r = await response.json();
    
    // Check if response has error (expired token case)
    if (r.error) {
      if (r.error.includes('expired') || r.error.includes('Invalid')) {
        throw new Error('Token expired');
      }
      throw new Error(r.error);
    }
    
    console.log('📥 Recipe details with fridge check:', r);
    
    // Combine available and missing ingredients with proper inFridge flag
    const allIngredients = [
      ...(r.available_ingredients || []).map((ing: any) => ({
        id: ing.id,
        name: ing.display_name,
        quantity: ing.quantity,
        unit: ing.unit,
        inFridge: true,
        fridgeQuantity: ing.fridge_quantity || ing.quantity,
      })),
      ...(r.missing_ingredients || []).map((ing: any) => ({
        id: ing.id,
        name: ing.display_name,
        quantity: ing.quantity,
        unit: ing.unit,
        inFridge: false,
        fridgeQuantity: 0,
      })),
    ];
    
    // Transform backend format
    const recipe: RecipeDetails = {
      id: r.id,
      canonicalName: r.canonical_name,
      title: r.title,
      imageUrl: r.image_url,
      servings: r.servings || 1,
      cookTime: r.cook_time || 0,
      timeMinutes: r.cook_time || 0,
      difficulty: r.difficulty || 'easy',
      category: r.category || 'main',
      country: r.country || 'international',
      ingredients: allIngredients,
      steps: r.steps || [],
      instructions: r.steps || [],
      tags: r.tags || [],
      isSaved: r.is_saved || false,
    };

    return recipe;
  } catch (error) {
    console.error('❌ Failed to fetch recipe details:', error);
    throw error;
  }
}
