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
    loss: "{amount} PLN potерь",
    averageLoss: "Średnia potеря: {amount} PLN",
    noLosses: "Brak strat w tym okresie",
  },
  
  // Card
  card: {
    reason: "Przyczyna",
    quantity: "Ilość",
    loss: "Potеря",
    added: "Dodano",
    expired: "Wygasło",
    context: "Kontekst",
    contextFridge: "Холодильник",
  },
  
  // Reasons
  reason: {
    expired: "Истёк срок годности",
    spoiled: "Produkt się zepsuł",
    forgotten: "Produkt został zapomniany",
    other: "Inna przyczyna",
  },
  
  // Messages
  messages: {
    loading: "Ładowanie historii...",
    error: "Błąd ładowania danych",
    empty: "Historia jest pusta",
    emptyDescription: "Produkty, które wygasły, pojawią się tutaj.",
  },
  
  // Filters
  filters: {
    period: "Okres",
    days7: "7 dni",
    days30: "30 dni",
    days90: "90 dni",
    all: "Wszystko",
  },
  
  // Charts (optional)
  charts: {
    byDay: "Straty według dni",
    byWeek: "Straty według tygodni",
    topLosses: "Top-3 najdroższych strat",
  },
} as const;
