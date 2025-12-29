/**
 * Losses translations (PL)
 * История потерь, утилизация продуктов
 */

export const losses = {
  // Page
  title: "Historia strat",
  subtitle: "Analiza ekonomii kuchni",
  backButton: "Wróć",
  
  // Navigation
  nav: {
    label: "Straty",
    description: "Historia utylizacji produktów",
  },
  
  // Summary
  summary: {
    title: "Za ostatnie {days} dni",
    products: "{count} produkt",
    productsPlural: "{count} produktów",
    totalLoss: "Całkowite straty",
    avgLoss: "Średnia strata: {amount} PLN",
    loss: "{amount} PLN strat",
    averageLoss: "Średnia strata: {amount} PLN",
    noLosses: "Brak strat w tym okresie",
  },

  // List section
  list: {
    title: "Zutylizowane produkty",
    subtitle: "Chronologiczny dziennik zdarzeń utylizacji",
  },

  // Card
  card: {
    reason: "Przyczyna",
    quantity: "Ilość",
    loss: "Strata",
    added: "Dodano",
    expired: "Wygasło",
    context: "Kontekst",
    contextFridge: "Lodówka",
  },

  // Event details
  event: {
    reason: "Przyczyna",
    quantity: "Ilość",
    loss: "Strata",
    added: "Dodano",
    expired: "Przeterminowane",
    context: "Kontekst",
  },

  // Reasons
  reason: {
    expired: "Upłynął termin ważności",
    spoiled: "Produkt się zepsuł",
    forgotten: "Produkt został zapomniany",
    damaged: "Produkt uszkodzony",
    mistake: "Pomyłka",
    other: "Inna przyczyna",
  },

  // Reasons (для getReasonLabel)
  reasons: {
    expired: "Upłynął termin ważności",
    damaged: "Produkt uszkodzony",
    spoiled: "Produkt się zepsuł",
    mistake: "Pomyłka",
  },

  // Messages
  messages: {
    loading: "Ładowanie historii...",
    error: "Błąd ładowania danych",
    empty: "Historia jest pusta",
    emptyDescription: "Produkty, które wygasły, pojawią się tutaj.",
  },

  // Empty state
  empty: {
    title: "Brak zarejestrowanych strat",
    description: "Brak utylizacji w ciągu ostatnich {days} dni",
  },

  // Filters
  filters: {
    period: "Okres",
    days7: "7 dni",
    days30: "30 dni",
    days90: "90 dni",
    all: "Wszystko",
  },

  // Actions
  actions: {
    refresh: "Odśwież",
    export: "Eksportuj",
  },
  
  // Charts (optional)
  charts: {
    byDay: "Straty według dni",
    byWeek: "Straty według tygodni",
    topLosses: "Top-3 najdroższych strat",
  },
} as const;
