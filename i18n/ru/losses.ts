/**
 * Losses translations (RU)
 * История потерь, утилизация продуктов
 */

export const losses = {
  // Page
  title: "История потерь",
  subtitle: "Анализ экономики кухни",
  backButton: "Назад",
  
  // Navigation
  nav: {
    label: "Потери",
    description: "История утилизации продуктов",
  },
  
  // Summary
  summary: {
    title: "За последние {days} дней",
    products: "{count} продукт",
    productsPlural: "{count} продуктов",
    loss: "{amount} PLN потерь",
    averageLoss: "Средняя потеря: {amount} PLN",
    noLosses: "Нет потерь за этот период",
  },
  
  // Card
  card: {
    reason: "Причина",
    quantity: "Количество",
    loss: "Потеря",
    added: "Добавлено",
    expired: "Истёк срок",
    context: "Контекст",
    contextFridge: "Холодильник",
  },
  
  // Reasons
  reason: {
    expired: "Истёк срок годности",
    spoiled: "Продукт испортился",
    forgotten: "Продукт был забыт",
    other: "Другая причина",
  },
  
  // Messages
  messages: {
    loading: "Загрузка истории...",
    error: "Ошибка загрузки данных",
    empty: "История пуста",
    emptyDescription: "Просроченные продукты появятся здесь.",
  },
  
  // Filters
  filters: {
    period: "Период",
    days7: "7 дней",
    days30: "30 дней",
    days90: "90 дней",
    all: "Всё",
  },
  
  // Charts (optional)
  charts: {
    byDay: "Потери по дням",
    byWeek: "Потери по неделям",
    topLosses: "Топ-3 самых дорогих потерь",
  },
} as const;
