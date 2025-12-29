/**
 * Fridge translations (RU)
 * Холодильник, продукты, сроки годности
 */

export const fridge = {
  // Page title
  title: "Холодильник",
  subtitle: "Управление продуктами и сроками годности",
  backButton: "Назад",
  
  // Stats
  stats: {
    products: "Продукты",
    fridgeValue: "Стоимость холодильника",
    lossRisk: "Риск потери",
    quickUse: "Продукты для быстрого использования",
    noPrices: "Нет цен",
  },
  
  // Categories
  categories: {
    title: "Просмотр продуктов по категориям",
    all: "Все",
    meat: "Мясо",
    dairy: "Молочные",
    vegetables: "Овощи",
    fruits: "Фрукты",
    other: "Другое",
  },
  
  // Item properties
  item: {
    quantity: "Количество",
    pricePerKg: "Цена/кг",
    pricePerL: "Цена/л",
    totalCost: "Общая стоимость",
    expiryDate: "Срок годности",
    addedDate: "Добавлено",
    noExpiryDate: "Нет даты",
    stable: "стабильная",
  },
  
  // Item status
  status: {
    expired: "Просрочено",
    critical: "Использовать скоро",
    fresh: "Свежее",
    unknown: "Неизвестный статус",
    dontUse: "Не использовать",
    useNow: "Использовать сейчас",
    daysLeft: "Остался {days} день",
    daysLeftPlural: "Осталось {days} дней",
    stillDays: "Ещё {days} день",
    stillDaysPlural: "Ещё {days} дней",
  },
  
  // Warnings
  warnings: {
    quickUseTitle: "⚠️ Продукты, требующие быстрого использования",
    quickUseMessage: "Продукты на сумму {amount} PLN скоро испортятся. AI может предложить, что из них приготовить.",
    hint: "Подсказка: Продукты с коротким сроком годности будут отмечены предупреждением — AI предложит, что готовить в первую очередь.",
  },
  
  // Losses summary (for fridge page)
  lossesSummary: {
    title: "⚠️ Потери за последние {days} дней",
    products: "продуктов",
    totalLoss: "потерь",
    viewHistory: "Посмотреть историю",
  },
  
  // Actions
  actions: {
    addProduct: "Добавить продукт",
    editProduct: "Редактировать продукт",
    deleteProduct: "Удалить продукт",
    updatePrice: "Обновить цену",
    updateQuantity: "Обновить количество",
    viewPriceHistory: "Посмотреть историю цен",
    generateRecipe: "Сгенерировать рецепт с AI",
  },
  
  // Messages
  messages: {
    loading: "Загрузка продуктов...",
    error: "Ошибка загрузки продуктов",
    empty: "Ваш холодильник пуст",
    addSuccess: "✅ Продукт добавлен в холодильник!",
    deleteSuccess: "Продукт удалён",
    updateSuccess: "Продукт обновлён",
  },
  
  // Form
  form: {
    productName: "Название продукта",
    category: "Категория",
    quantity: "Количество",
    unit: "Единица",
    price: "Цена",
    expiryDate: "Срок годности",
    optional: "Опционально",
    save: "Сохранить",
    cancel: "Отмена",
  },
} as const;
