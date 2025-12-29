/**
 * Fridge translations (PL)
 * Холодильник  // Item status
  status: {
    expired: "Przeterminowane",
    critical: "Zużyj wkrótce",
    fresh: "Świeże",
    unknown: "Nieznany status",
    dontUse: "Nie używaj",
    useNow: "Użyj teraz",
    lastDay: "Ostatni dzień",
    daysLeft: "Zostało {{days}} dzień",
    daysLeftPlural: "Zostało {{days}} dni",
    stillDays: "Jeszcze {{days}} dzień",
    stillDaysPlural: "Jeszcze {{days}} dni",
  },роки годности
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
    bread: "Pieczywo",
    drinks: "Napoje",
    fish: "Ryby",
    other: "Inne",
    
    // 🔥 Backend category mapping
    "Mięso": "Mięso",
    "Nabiał": "Nabiał",
    "Warzywa": "Warzywa",
    "Owoce": "Owoce",
    "Pieczywo": "Pieczywo",
    "Napoje": "Napoje",
    "Ryby": "Ryby",
    "Inne": "Inne",
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
    invalidDate: "Nieprawidłowa data",
    dateError: "Błąd daty",
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
    deleteSuccess: "✅ Produkt usunięty!",
    updateSuccess: "Produkt zaktualizowany",
    priceUpdated: "✅ Cena zaktualizowana!",
    quantityUpdated: "✅ Ilość zaktualizowana!",
    deleteError: "Błąd podczas usuwania produktu",
    priceError: "Błąd podczas aktualizacji ceny",
    quantityError: "Błąd podczas aktualizacji ilości",
    authRequired: "Wymagana autoryzacja",
    authRequiredDesc: "Zaloguj się, aby zarządzać swoją lodówką",
    loginButton: "Zaloguj się",
  },
  
  // Form
  form: {
    productName: "Nazwa produktu",
    productLabel: "Produkt",
    searchPlaceholder: "Szukaj produktu (np. mleko, jajka)...",
    selectedProduct: "Wybrany produkt",
    unit: "Jednostka",
    expiryDate: "Data ważności",
    expiryInDays: "{{days}} dni",
    category: "Kategoria",
    quantity: "Ilość",
    quantityPlaceholder: "np. 500 {{unit}}",
    selectProductFirst: "Najpierw wybierz produkt",
    priceLabel: "Cena",
    priceRecommended: "(polecane - do obliczeń oszczędności)",
    pricePlaceholder: "np. 50",
    pricePerLabel: "PLN za",
    priceWarning: "Bez ceny nie pokażemy ile oszczędzasz w przepisach. Dodaj cenę, aby zobaczyć realne oszczędności!",
    selectProduct: "Wybierz produkt z listy",
    invalidQuantity: "Podaj prawidłową ilość (większą niż 0)",
    addError: "Błąd podczas dodawania produktu",
    adding: "Dodawanie...",
    addButton: "Dodaj do lodówki",
    optional: "Opcjonalnie",
    save: "Zapisz",
    cancel: "Anuluj",
    addToFridgeTitle: "Dodaj produkt do lodówki",
    addToFridgeDesc: "Wyszukaj produkt i podaj ilość. Backend automatycznie obliczy termin ważności.",
    updatePriceTitle: "Dodaj cenę produktu",
    updatePriceDesc: "Podaj cenę za wybraną jednostkę. System automatycznie obliczy całkowitą wartość.",
    updateQuantityTitle: "Zmień ilość produktu",
    updateQuantityDesc: "Zaktualizuj ilość produktu. Cena całkowita zostanie przeliczona automatycznie.",
  },
  
  // Flow CTAs
  flow: {
    whatNext: "Co teraz? 🎯",
    checkRecipes: "Sprawdź, co możesz ugotować",
    askAI: "Zapytaj AI, co zrobić",
  },
  
  // Empty state
  emptyState: {
    title: "Dodaj produkty, aby:",
    reason1: "AI mogło zaproponować przepisy",
    reason2: "wykorzystać produkty przed końcem terminu",
    reason3: "nie kupować tego, czego już masz",
  },
  
  emptyCategory: "Brak produktów w kategorii {{category}}",
} as const;
