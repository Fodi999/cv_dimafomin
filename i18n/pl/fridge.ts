/**
 * Fridge translations (PL)
 * Холодильник, продукты, сроки годности
 */

export const fridge = {
  // Page title
  title: "Lodówka",
  subtitle: "Zarządzaj składnikami i datami ważności",
  backButton: "Wróć",
  
  // Stats
  stats: {
    products: "Produkty",
    fridgeValue: "Wartość lodówki",
    lossRisk: "Ryzyko straty",
    quickUse: "Produkty do szybkiego użycia",
    noPrices: "Brak cen",
  },
  
  // Categories
  categories: {
    title: "Przeglądaj produkty według kategorii",
    all: "Wszystkie",
    meat: "Mięso",
    dairy: "Nabiał",
    vegetables: "Warzywa",
    fruits: "Owoce",
    other: "Inne",
  },
  
  // Item properties
  item: {
    quantity: "Ilość",
    pricePerKg: "Cena/kg",
    pricePerL: "Cena/l",
    totalCost: "Koszt całości",
    expiryDate: "Data ważności",
    addedDate: "Dodano",
    noExpiryDate: "Brak daty",
    stable: "stabilna",
  },
  
  // Item status
  status: {
    expired: "Przeterminowane",
    critical: "Zużyj wkrótce",
    fresh: "Świeże",
    unknown: "Nieznany status",
    dontUse: "Nie używaj",
    useNow: "Użyj teraz",
    daysLeft: "Zostało {days} dzień",
    daysLeftPlural: "Zostało {days} dni",
    stillDays: "Jeszcze {days} dzień",
    stillDaysPlural: "Jeszcze {days} dni",
  },
  
  // Warnings
  warnings: {
    quickUseTitle: "⚠️ Produkty wymagające szybkiego użycia",
    quickUseMessage: "Produkty za {amount} PLN wkrótce się zepsują. AI może zaproponować, co z nich ugotować.",
    hint: "Wskazówka: Produkty z krótkim terminem ważności będą oznaczone ostrzeżeniem — AI zaproponuje, co ugotować w pierwszej kolejności.",
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
    addProduct: "Dodaj produkt",
    editProduct: "Edytuj produkt",
    deleteProduct: "Usuń produkt",
    updatePrice: "Zaktualizuj cenę",
    updateQuantity: "Zaktualizuj ilość",
    viewPriceHistory: "Zobacz historię cen",
    generateRecipe: "Wygeneruj przepis z AI",
  },
  
  // Messages
  messages: {
    loading: "Ładowanie produktów...",
    error: "Błąd ładowania produktów",
    empty: "Twoja lodówka jest pusta",
    addSuccess: "✅ Produkt dodany do lodówki!",
    deleteSuccess: "Produkt usunięty",
    updateSuccess: "Produkt zaktualizowany",
  },
  
  // Form
  form: {
    productName: "Nazwa produktu",
    category: "Kategoria",
    quantity: "Ilość",
    unit: "Jednostka",
    price: "Cena",
    expiryDate: "Data ważności",
    optional: "Opcjonalnie",
    save: "Zapisz",
    cancel: "Anuluj",
  },
} as const;
