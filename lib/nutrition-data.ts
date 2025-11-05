// Local nutrition database for common Japanese cuisine ingredients
// Values per 100g

export const NUTRITION_DATABASE: Record<string, {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}> = {
  // Rice and Grains
  'рис': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28.2 },
  'рис для суші': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28.2 },
  'рисовий оцет': { calories: 18, protein: 0, fat: 0, carbs: 4.3 },
  
  // Fish and Seafood
  'лосось': { calories: 208, protein: 20, fat: 13, carbs: 0 },
  'тунець': { calories: 144, protein: 23, fat: 5, carbs: 0 },
  'креветка': { calories: 99, protein: 24, fat: 0.3, carbs: 0.2 },
  'креветки': { calories: 99, protein: 24, fat: 0.3, carbs: 0.2 },
  'краб': { calories: 97, protein: 19, fat: 1.5, carbs: 0 },
  'вугор': { calories: 184, protein: 18.4, fat: 11.7, carbs: 0 },
  'ікра': { calories: 252, protein: 24.6, fat: 17.9, carbs: 4 },
  'восьминіг': { calories: 82, protein: 14.9, fat: 1, carbs: 2.2 },
  
  // Vegetables
  'огірок': { calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6 },
  'авокадо': { calories: 160, protein: 2, fat: 14.7, carbs: 8.5 },
  'морква': { calories: 41, protein: 0.9, fat: 0.2, carbs: 9.6 },
  'імбир': { calories: 80, protein: 1.8, fat: 0.8, carbs: 17.8 },
  'васабі': { calories: 109, protein: 4.8, fat: 0.6, carbs: 23.5 },
  'дайкон': { calories: 18, protein: 0.6, fat: 0.1, carbs: 4.1 },
  'зелена цибуля': { calories: 32, protein: 1.8, fat: 0.2, carbs: 7.3 },
  
  // Nori and seaweed
  'норі': { calories: 35, protein: 5.8, fat: 0.3, carbs: 5.1 },
  'водорості': { calories: 45, protein: 6, fat: 0.6, carbs: 8.3 },
  
  // Sauces and condiments
  'соєвий соус': { calories: 53, protein: 5.6, fat: 0.1, carbs: 4.9 },
  'майонез': { calories: 680, protein: 1.1, fat: 75, carbs: 2.6 },
  'спайсі соус': { calories: 400, protein: 1, fat: 42, carbs: 5 },
  'унагі соус': { calories: 90, protein: 1.5, fat: 0.2, carbs: 21 },
  'кунжут': { calories: 573, protein: 17.7, fat: 49.7, carbs: 23.4 },
  'кунжутна олія': { calories: 884, protein: 0, fat: 100, carbs: 0 },
  
  // Tempura ingredients
  'борошно': { calories: 364, protein: 10.3, fat: 1, carbs: 76.3 },
  'яйце': { calories: 155, protein: 12.7, fat: 10.6, carbs: 1.1 },
  'яйця': { calories: 155, protein: 12.7, fat: 10.6, carbs: 1.1 },
  
  // Tofu and soy products
  'тофу': { calories: 76, protein: 8, fat: 4.8, carbs: 1.9 },
  
  // Other
  'сир вершковий': { calories: 342, protein: 5.5, fat: 34.2, carbs: 3.5 },
  'філадельфія сир': { calories: 342, protein: 5.5, fat: 34.2, carbs: 3.5 },
  'масло': { calories: 717, protein: 0.6, fat: 81, carbs: 0.8 },
  'цукор': { calories: 387, protein: 0, fat: 0, carbs: 99.8 },
  'сіль': { calories: 0, protein: 0, fat: 0, carbs: 0 },
  'вода': { calories: 0, protein: 0, fat: 0, carbs: 0 },
};

/**
 * Get nutrition info for an ingredient
 * @param name - ingredient name (Ukrainian)
 * @param weight - weight in grams
 * @returns nutrition data
 */
export function getNutritionInfo(name: string, weight?: number) {
  const normalizedName = name.toLowerCase().trim();
  
  // Try exact match
  let nutritionPer100g = NUTRITION_DATABASE[normalizedName];
  
  // If no exact match, try partial match
  if (!nutritionPer100g) {
    const partialMatch = Object.keys(NUTRITION_DATABASE).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );
    if (partialMatch) {
      nutritionPer100g = NUTRITION_DATABASE[partialMatch];
    }
  }
  
  if (!nutritionPer100g) {
    return null;
  }
  
  // Calculate total calories based on weight
  const result = {
    ...nutritionPer100g,
    totalCalories: weight ? (nutritionPer100g.calories * weight) / 100 : undefined,
  };
  
  return result;
}

/**
 * Search for ingredient in database
 */
export function searchIngredient(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  return Object.keys(NUTRITION_DATABASE).filter(name =>
    name.includes(normalizedQuery)
  );
}
