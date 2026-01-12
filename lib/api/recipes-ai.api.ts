/**
 * AI-assisted recipes API
 * Minimal input → AI generates full recipe
 */

export interface AIRecipeIngredient {
  ingredientId: string;
  quantity: number; // Main field expected by backend
  unit: string;
}

export interface AIRecipeInput {
  title: string;
  ingredients: AIRecipeIngredient[];
  rawCookingText: string; // Single text block - AI will parse into steps
  language?: string; // Optional: user's language preference (ru, pl, en)
}

export interface AIRecipeStep {
  order: number;
  text: string;
  time?: number; // minutes for this step
}

export interface AIRecipePreview {
  title: string;
  language?: string; // Language of the recipe (ru, pl, en)
  canonicalName?: string; // Optional - may not always be returned
  summary?: string; // Optional
  description?: string; // Alternative field name
  steps: AIRecipeStep[]; // Array of step objects with text and time
  servings: number;
  time_minutes?: number; // Backend uses snake_case
  time?: number; // Fallback
  difficulty?: string; // Optional
  totalWeight?: number; // Total weight in grams (calculated from ingredients)
  calories?: number; // Top-level calories (for backward compatibility)
  nutrition?: { // Made optional - backend may not always return it
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients?: Array<{ // Optional
    ingredientId: string;
    name: string;
    amount: number;
    unit: string;
  }>;
}

export interface AIRecipeCreated {
  id: string;
  title: string;
  canonicalName: string;
  // ... full recipe DTO
}

/**
 * Preview recipe with AI
 * POST /api/admin/recipes/preview-ai
 */
export async function previewRecipeWithAI(input: AIRecipeInput): Promise<AIRecipePreview> {
  console.log('[previewRecipeWithAI] 📤 Sending input:', JSON.stringify(input, null, 2));
  
  // Prepare headers with language support
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add Accept-Language header if language is provided
  if (input.language) {
    headers['Accept-Language'] = input.language;
  }
  
  const response = await fetch('/api/admin/recipes/preview-ai', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to preview recipe');
  }

  const data = await response.json();
  
  // DEBUG: Log full backend response to see all fields
  console.log('[previewRecipeWithAI] 📥 Backend response:', JSON.stringify(data, null, 2));
  
  // Handle new ApiResponse format
  let preview = data.data || data;
  
  // Normalize backend response: move top-level calories into nutrition object
  if (preview.calories && !preview.nutrition) {
    preview.nutrition = {
      calories: preview.calories,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  }
  
  // Calculate totalWeight from ingredients (sum of all amounts in grams)
  if (preview.ingredients && preview.ingredients.length > 0) {
    preview.totalWeight = preview.ingredients.reduce((sum: number, ing: any) => {
      // Convert all to grams: ml ≈ g for water-based liquids
      const amountInGrams = ing.unit === 'ml' ? ing.amount : ing.amount;
      return sum + amountInGrams;
    }, 0);
    console.log(`[previewRecipeWithAI] 📊 Calculated totalWeight: ${preview.totalWeight}g from ${preview.ingredients.length} ingredients`);
  }
  
  return preview;
}

/**
 * Create recipe with AI
 * POST /api/admin/recipes/create-ai
 */
export async function createRecipeWithAI(input: AIRecipeInput): Promise<AIRecipeCreated> {
  // Prepare headers with language support
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add Accept-Language header if language is provided
  if (input.language) {
    headers['Accept-Language'] = input.language;
  }
  
  const response = await fetch('/api/admin/recipes/create-ai', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create recipe');
  }

  const data = await response.json();
  
  // Handle new ApiResponse format
  if (data.data) {
    return data.data;
  }
  
  return data;
}

/**
 * Save edited recipe (after user edits AI preview)
 * POST /api/admin/recipes/save
 * 
 * @param recipe - Edited recipe data from preview
 * @returns Created recipe with ID
 */
export interface SaveRecipeRequest {
  title: string;
  language: string;
  description: string;
  servings: number;
  time_minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  ingredients: Array<{
    ingredientId: string;
    name: string;
    amount: number;
    unit: string;
  }>;
  steps: Array<{
    order: number;
    text: string;
    time: number;
  }>;
}

export async function saveRecipe(recipe: SaveRecipeRequest): Promise<AIRecipeCreated> {
  console.log('[saveRecipe] 💾 Saving edited recipe:', recipe.title);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const response = await fetch('/api/admin/recipes/save', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    const errorData = await response.json();
    
    // DEBUG: Log error response to see structure
    console.log('[saveRecipe] ❌ Error response:', JSON.stringify(errorData, null, 2));
    console.log('[saveRecipe] Status:', response.status);
    console.log('[saveRecipe] Error code:', errorData.code);
    console.log('[saveRecipe] Has suggestions:', !!errorData.suggestions);
    
    // Handle 409 conflict with multilingual suggestions
    if (response.status === 409 && errorData.code === 'RECIPE_NAME_EXISTS') {
      const error: any = new Error(errorData.message || 'Recipe name already exists');
      error.code = 'RECIPE_NAME_EXISTS';
      error.suggestions = errorData.suggestions;
      throw error;
    }
    
    throw new Error(errorData.error || 'Failed to save recipe');
  }

  const data = await response.json();
  console.log('[saveRecipe] ✅ Recipe saved with ID:', data.data?.id);
  
  return data.data || data;
}

/**
 * Update existing recipe
 * PUT /api/admin/recipes/{id}
 * 
 * @param recipeId - UUID of the recipe to update
 * @param recipe - Updated recipe data
 * @returns Updated recipe
 */
export async function updateRecipe(
  recipeId: string, 
  recipe: SaveRecipeRequest
): Promise<AIRecipeCreated> {
  console.log('[updateRecipe] 🔄 Updating recipe:', recipeId);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const response = await fetch(`/api/admin/recipes/${recipeId}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update recipe');
  }

  const data = await response.json();
  console.log('[updateRecipe] ✅ Recipe updated');
  
  return data.data || data;
}

/**
 * Get all recipes from backend
 */
export async function getAllRecipes(): Promise<any[]> {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log('[getAllRecipes] 📋 Fetching all recipes...');
  
  const response = await fetch('/api/admin/recipes', {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    console.error('[getAllRecipes] ❌ Failed to fetch recipes');
    throw new Error('Failed to fetch recipes');
  }

  const data = await response.json();
  console.log('[getAllRecipes] ✅ Fetched recipes:', data.data?.length || 0);
  
  return data.data || [];
}
