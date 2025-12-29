/**
 * Ingredients translations (RU)
 * Переводы названий ингредиентов
 * 
 * Структура: "ingredient.slug": "Русское название"
 * Backend возвращает i18n_key, frontend переводит
 */

export const ingredients = {
  // Vegetables (Овощи)
  "ingredient.cucumber": "Огурец",
  "ingredient.onion": "Лук",
  "ingredient.tomato": "Помидор",
  "ingredient.carrot": "Морковь",
  "ingredient.potato": "Картофель",
  "ingredient.lettuce": "Салат",
  "ingredient.bell_pepper": "Болгарский перец",
  "ingredient.garlic": "Чеснок",
  "ingredient.cabbage": "Капуста",
  "ingredient.beetroot": "Свёкла",
  
  // Meat (Мясо)
  "ingredient.chicken": "Курица",
  "ingredient.beef": "Говядина",
  "ingredient.pork": "Свинина",
  "ingredient.turkey": "Индейка",
  "ingredient.lamb": "Баранина",
  
  // Fish (Рыба)
  "ingredient.salmon": "Лосось",
  "ingredient.tuna": "Тунец",
  "ingredient.cod": "Треска",
  "ingredient.herring": "Сельдь",
  
  // Dairy (Молочные продукты)
  "ingredient.milk": "Молоко",
  "ingredient.cheese": "Сыр",
  "ingredient.butter": "Масло",
  "ingredient.yogurt": "Йогурт",
  "ingredient.cream": "Сливки",
  "ingredient.eggs": "Яйца",
  
  // Fruits (Фрукты)
  "ingredient.apple": "Яблоко",
  "ingredient.banana": "Банан",
  "ingredient.orange": "Апельсин",
  "ingredient.strawberry": "Клубника",
  "ingredient.lemon": "Лимон",
  
  // Grains & Pasta (Крупы и макароны)
  "ingredient.rice": "Рис",
  "ingredient.pasta": "Паста",
  "ingredient.bread": "Хлеб",
  "ingredient.flour": "Мука",
  
  // Condiments & Spices (Приправы и специи)
  "ingredient.salt": "Соль",
  "ingredient.black_pepper": "Чёрный перец",
  "ingredient.cayenne_pepper": "Перец кайенский",
  "ingredient.fish_sauce": "Рыбный соус",
  "ingredient.soy_sauce": "Соевый соус",
  "ingredient.olive_oil": "Оливковое масло",
  "ingredient.sugar": "Сахар",
  "ingredient.honey": "Мёд",
  
  // Fallback
  unknown: "Неизвестный ингредиент",
} as const;
