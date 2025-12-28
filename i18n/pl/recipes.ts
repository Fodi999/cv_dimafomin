/**
 * Recipes translations (PL)
 * Рецепты, ингредиенты, инструкции
 */

export const recipes = {
  // Recipe List
  list: {
    title: "Przepisy",
    subtitle: "Odkryj i twórz niesamowite dania",
    search: "Szukaj przepisów...",
    filter: "Filtruj",
    sort: "Sortuj",
    viewGrid: "Widok siatki",
    viewList: "Widok listy",
    noRecipes: "Nie znaleziono przepisów",
    createFirst: "Stwórz swój pierwszy przepis",
  },

  // Filters
  filters: {
    title: "Filtry",
    category: "Kategoria",
    difficultyLabel: "Poziom trudności",
    timeLabel: "Czas przygotowania",
    cuisine: "Kuchnia",
    diet: "Dieta",
    clear: "Wyczyść filtry",
    apply: "Zastosuj",
    
    categories: {
      all: "Wszystkie",
      breakfast: "Śniadanie",
      lunch: "Obiad",
      dinner: "Kolacja",
      dessert: "Deser",
      snack: "Przekąska",
      appetizer: "Przystawka",
      soup: "Zupa",
      salad: "Sałatka",
      beverage: "Napój",
    },

    difficultyOptions: {
      easy: "Łatwy",
      medium: "Średni",
      hard: "Trudny",
    },

    timeOptions: {
      under15: "Do 15 min",
      under30: "Do 30 min",
      under60: "Do 1 godz.",
      over60: "Ponad 1 godz.",
    },
  },

  // Sort
  sort: {
    newest: "Najnowsze",
    oldest: "Najstarsze",
    popular: "Najpopularniejsze",
    rated: "Najwyżej oceniane",
    quickest: "Najszybsze",
  },

  // Recipe Card
  card: {
    new: "Nowe",
    featured: "Wyróżnione",
    premium: "Premium",
    servings: "porcji",
    time: "min",
    difficulty: "Trudność",
    rating: "Ocena",
    reviews: "opinii",
    calories: "kcal",
    viewRecipe: "Zobacz przepis",
    saveRecipe: "Zapisz",
    shareRecipe: "Udostępnij",
    editRecipe: "Edytuj",
    deleteRecipe: "Usuń",
  },

  // Recipe Detail
  detail: {
    backToRecipes: "Powrót do przepisów",
    overview: "Przegląd",
    ingredients: "Składniki",
    instructions: "Instrukcje",
    nutrition: "Wartości odżywcze",
    reviews: "Opinie",
    
    info: {
      prepTime: "Czas przygotowania",
      cookTime: "Czas gotowania",
      totalTime: "Całkowity czas",
      servings: "Porcje",
      difficulty: "Trudność",
      cuisine: "Kuchnia",
      category: "Kategoria",
      author: "Autor",
      published: "Opublikowano",
      updated: "Zaktualizowano",
    },

    actions: {
      print: "Drukuj",
      save: "Zapisz",
      share: "Udostępnij",
      report: "Zgłoś",
      edit: "Edytuj",
      delete: "Usuń",
    },
  },

  // Ingredients
  ingredients: {
    title: "Składniki",
    servings: "porcje",
    adjust: "Dostosuj",
    shopingList: "Lista zakupów",
    addToList: "Dodaj do listy",
    removeFromList: "Usuń z listy",
    checkAll: "Zaznacz wszystko",
    uncheckAll: "Odznacz wszystko",
    
    units: {
      g: "g",
      kg: "kg",
      ml: "ml",
      l: "l",
      tsp: "łyżeczka",
      tbsp: "łyżka",
      cup: "szklanka",
      piece: "szt.",
      pinch: "szczypta",
      taste: "do smaku",
    },
  },

  // Instructions
  instructions: {
    title: "Instrukcje",
    step: "Krok",
    timer: "Timer",
    startTimer: "Uruchom timer",
    stopTimer: "Zatrzymaj timer",
    markComplete: "Oznacz jako zakończone",
    markIncomplete: "Oznacz jako niezakończone",
    previous: "Poprzedni",
    next: "Następny",
    finish: "Zakończ",
  },

  // Nutrition
  nutrition: {
    title: "Wartości odżywcze",
    perServing: "Na porcję",
    calories: "Kalorie",
    protein: "Białko",
    carbs: "Węglowodany",
    fat: "Tłuszcz",
    fiber: "Błonnik",
    sugar: "Cukier",
    sodium: "Sód",
    cholesterol: "Cholesterol",
    vitamins: "Witaminy",
    minerals: "Minerały",
  },

  // Reviews
  reviews: {
    title: "Opinie",
    writeReview: "Napisz opinię",
    rating: "Ocena",
    comment: "Komentarz",
    commentPlaceholder: "Podziel się swoją opinią o tym przepisie...",
    submit: "Wyślij",
    cancel: "Anuluj",
    edit: "Edytuj",
    delete: "Usuń",
    helpful: "Pomocne",
    notHelpful: "Niepomocne",
    report: "Zgłoś",
    noReviews: "Brak opinii",
    beFirst: "Bądź pierwszy, który napisze opinię!",
    
    filter: {
      all: "Wszystkie",
      positive: "Pozytywne",
      critical: "Krytyczne",
      recent: "Najnowsze",
    },
  },

  // Create/Edit Recipe
  form: {
    createTitle: "Stwórz przepis",
    editTitle: "Edytuj przepis",
    
    basic: {
      title: "Podstawowe informacje",
      name: "Nazwa przepisu",
      namePlaceholder: "np. Spaghetti Carbonara",
      description: "Opis",
      descriptionPlaceholder: "Krótki opis przepisu...",
      category: "Kategoria",
      cuisine: "Kuchnia",
      difficulty: "Poziom trudności",
      servings: "Liczba porcji",
      prepTime: "Czas przygotowania (min)",
      cookTime: "Czas gotowania (min)",
    },

    media: {
      title: "Zdjęcia i wideo",
      mainImage: "Główne zdjęcie",
      additionalImages: "Dodatkowe zdjęcia",
      video: "Link do wideo",
      upload: "Prześlij",
      remove: "Usuń",
    },

    ingredients: {
      title: "Składniki",
      add: "Dodaj składnik",
      remove: "Usuń",
      name: "Nazwa",
      amount: "Ilość",
      unit: "Jednostka",
      notes: "Uwagi",
      group: "Grupa",
      addGroup: "Dodaj grupę",
    },

    instructions: {
      title: "Instrukcje",
      add: "Dodaj krok",
      remove: "Usuń",
      step: "Krok",
      description: "Opis",
      image: "Zdjęcie (opcjonalne)",
      timer: "Timer (opcjonalny)",
      timerPlaceholder: "Czas w minutach",
    },

    nutrition: {
      title: "Wartości odżywcze (opcjonalne)",
      calories: "Kalorie",
      protein: "Białko (g)",
      carbs: "Węglowodany (g)",
      fat: "Tłuszcz (g)",
      fiber: "Błonnik (g)",
      sugar: "Cukier (g)",
      sodium: "Sód (mg)",
    },

    tags: {
      title: "Tagi",
      placeholder: "Dodaj tagi oddzielone przecinkami",
      suggestions: "Sugerowane",
    },

    visibility: {
      title: "Widoczność",
      public: "Publiczny",
      publicDescription: "Widoczny dla wszystkich użytkowników",
      private: "Prywatny",
      privateDescription: "Widoczny tylko dla ciebie",
      unlisted: "Niewidoczny",
      unlistedDescription: "Dostępny tylko przez link",
    },

    actions: {
      saveDraft: "Zapisz szkic",
      preview: "Podgląd",
      publish: "Opublikuj",
      update: "Zaktualizuj",
      cancel: "Anuluj",
      delete: "Usuń przepis",
    },
  },

  // Messages
  messages: {
    createSuccess: "Przepis został utworzony",
    createError: "Błąd tworzenia przepisu",
    updateSuccess: "Przepis został zaktualizowany",
    updateError: "Błąd aktualizacji przepisu",
    deleteSuccess: "Przepis został usunięty",
    deleteError: "Błąd usuwania przepisu",
    saveSuccess: "Przepis został zapisany",
    saveError: "Błąd zapisywania przepisu",
    reviewSuccess: "Opinia została dodana",
    reviewError: "Błąd dodawania opinii",
  },
} as const;
