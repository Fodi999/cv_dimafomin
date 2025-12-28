/**
 * Russian translations - Market domain
 * Русские переводы - домен Рынок рецептов
 */

export const market = {
  // Hero section
  title: "Рынок Рецептов",
  subtitle: "Откройте для себя и купите авторские рецепты от лучших поваров",
  searchPlaceholder: "Поиск рецептов...",
  
  // Filters
  filters: {
    all: "Все",
    difficulty: "Уровень сложности",
    cuisine: "Кухня",
    dietary: "Диета",
    time: "Время приготовления"
  },
  
  // Recipe card
  card: {
    buy: "Купить сейчас",
    preview: "Предпросмотр",
    author: "Автор",
    difficulty: "Сложность",
    time: "Время",
    servings: "Порций",
    price: "Цена",
    chefTokens: "ChefTokens"
  },
  
  // Common
  loading: "Загрузка...",
  error: "Ошибка загрузки рецептов",
  noResults: "Рецепты не найдены",
  
  // Purchase
  purchase: {
    success: "Рецепт куплен!",
    error: "Ошибка покупки",
    insufficient: "Недостаточно ChefTokens"
  }
} as const;
