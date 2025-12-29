/**
 * Ingredients translations (PL)
 * Переводы названий ингредиентов
 * 
 * Структура: "ingredient.slug": "Lokalne Imię"
 * Backend возвращает i18n_key, frontend переводит
 */

export const ingredients = {
  // Vegetables (Warzywa)
  "ingredient.cucumber": "Ogórek",
  "ingredient.onion": "Cebula",
  "ingredient.tomato": "Pomidor",
  "ingredient.carrot": "Marchew",
  "ingredient.potato": "Ziemniak",
  "ingredient.lettuce": "Sałata",
  "ingredient.bell_pepper": "Papryka",
  "ingredient.garlic": "Czosnek",
  "ingredient.cabbage": "Kapusta",
  "ingredient.beetroot": "Burak",
  
  // Meat (Mięso)
  "ingredient.chicken": "Kurczak",
  "ingredient.beef": "Wołowina",
  "ingredient.pork": "Wieprzowina",
  "ingredient.turkey": "Indyk",
  "ingredient.lamb": "Jagnięcina",
  
  // Fish (Ryby)
  "ingredient.salmon": "Łosoś",
  "ingredient.tuna": "Tuńczyk",
  "ingredient.cod": "Dorsz",
  "ingredient.herring": "Śledź",
  
  // Dairy (Nabiał)
  "ingredient.milk": "Mleko",
  "ingredient.cheese": "Ser",
  "ingredient.butter": "Masło",
  "ingredient.yogurt": "Jogurt",
  "ingredient.cream": "Śmietana",
  "ingredient.eggs": "Jaja",
  
  // Fruits (Owoce)
  "ingredient.apple": "Jabłko",
  "ingredient.banana": "Banan",
  "ingredient.orange": "Pomarańcza",
  "ingredient.strawberry": "Truskawka",
  "ingredient.lemon": "Cytryna",
  
  // Grains & Pasta (Zboża i Makarony)
  "ingredient.rice": "Ryż",
  "ingredient.pasta": "Makaron",
  "ingredient.bread": "Chleb",
  "ingredient.flour": "Mąka",
  
  // Condiments & Spices (Przyprawy i Dodatki)
  "ingredient.salt": "Sól",
  "ingredient.black_pepper": "Pieprz czarny",
  "ingredient.cayenne_pepper": "Pieprz cayenne",
  "ingredient.fish_sauce": "Sos rybny",
  "ingredient.soy_sauce": "Sos sojowy",
  "ingredient.olive_oil": "Oliwa z oliwek",
  "ingredient.sugar": "Cukier",
  "ingredient.honey": "Miód",
  
  // Fallback
  unknown: "Nieznany składnik",
} as const;
