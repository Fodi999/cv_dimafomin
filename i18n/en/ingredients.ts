/**
 * Ingredients translations (EN)
 * Ingredient name translations
 * 
 * Structure: "ingredient.slug": "English Name"
 * Backend returns i18n_key, frontend translates
 */

export const ingredients = {
  // Vegetables
  "ingredient.cucumber": "Cucumber",
  "ingredient.onion": "Onion",
  "ingredient.tomato": "Tomato",
  "ingredient.carrot": "Carrot",
  "ingredient.potato": "Potato",
  "ingredient.lettuce": "Lettuce",
  "ingredient.bell_pepper": "Bell Pepper",
  "ingredient.garlic": "Garlic",
  "ingredient.cabbage": "Cabbage",
  "ingredient.beetroot": "Beetroot",
  
  // Meat
  "ingredient.chicken": "Chicken",
  "ingredient.beef": "Beef",
  "ingredient.pork": "Pork",
  "ingredient.turkey": "Turkey",
  "ingredient.lamb": "Lamb",
  
  // Fish
  "ingredient.salmon": "Salmon",
  "ingredient.tuna": "Tuna",
  "ingredient.cod": "Cod",
  "ingredient.herring": "Herring",
  
  // Dairy
  "ingredient.milk": "Milk",
  "ingredient.cheese": "Cheese",
  "ingredient.butter": "Butter",
  "ingredient.yogurt": "Yogurt",
  "ingredient.cream": "Cream",
  "ingredient.eggs": "Eggs",
  
  // Fruits
  "ingredient.apple": "Apple",
  "ingredient.banana": "Banana",
  "ingredient.orange": "Orange",
  "ingredient.strawberry": "Strawberry",
  "ingredient.lemon": "Lemon",
  
  // Grains & Pasta
  "ingredient.rice": "Rice",
  "ingredient.pasta": "Pasta",
  "ingredient.bread": "Bread",
  "ingredient.flour": "Flour",
  
  // Condiments & Spices
  "ingredient.salt": "Salt",
  "ingredient.black_pepper": "Black Pepper",
  "ingredient.cayenne_pepper": "Cayenne Pepper",
  "ingredient.fish_sauce": "Fish Sauce",
  "ingredient.soy_sauce": "Soy Sauce",
  "ingredient.olive_oil": "Olive Oil",
  "ingredient.sugar": "Sugar",
  "ingredient.honey": "Honey",
  
  // Fallback
  unknown: "Unknown ingredient",
} as const;
