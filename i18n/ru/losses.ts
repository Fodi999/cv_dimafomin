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
    totalLoss: "Всего потерь",
    avgLoss: "Средняя потеря: {amount} PLN",
    loss: "{amount} PLN потерь",
    averageLoss: "Средняя потеря: {amount} PLN",
    noLosses: "Нет потерь за этот период",
  },

  // List section
  list: {
    title: "Утилизированные продукты",
    subtitle: "Хронологический журнал событий утилизации",
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

  // Event details
  event: {
    reason: "Причина",
    quantity: "Количество",
    loss: "Потеря",
    added: "Добавлено",
    expired: "Просрочено",
    context: "Контекст",
  },

  // Reasons
  reason: {
    expired: "Истёк срок годности",
    spoiled: "Продукт испортился",
    forgotten: "Продукт был забыт",
    damaged: "Продукт повреждён",
    mistake: "Ошибка",
    other: "Другая причина",
  },

  // Reasons (для getReasonLabel)
  reasons: {
    expired: "Истёк срок годности",
    damaged: "Продукт повреждён",
    spoiled: "Продукт испортился",
    mistake: "Ошибка",
  },

  // Messages
  messages: {
    loading: "Загрузка истории...",
    error: "Ошибка загрузки данных",
    empty: "История пуста",
    emptyDescription: "Просроченные продукты появятся здесь.",
  },

  // Empty state
  empty: {
    title: "Нет зафиксированных потерь",
    description: "За последние {days} дней не было утилизаций",
  },

  // Filters
  filters: {
    period: "Период",
    days7: "7 дней",
    days30: "30 дней",
    days90: "90 дней",
    all: "Всё",
  },

  // Actions
  actions: {
    refresh: "Обновить",
    export: "Экспортировать",
  },
  
  // Charts (optional)
  charts: {
    byDay: "Потери по дням",
    byWeek: "Потери по неделям",
    topLosses: "Топ-3 самых дорогих потерь",
  },
} as const;
