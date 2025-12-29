/**
 * Profile translations (PL)
 * Профиль пользователя, настройки, здоровье
 */

export const profile = {
  // Profile Page (Dashboard)
  page: {
    title: "Profil",
    backButton: "Назад",
    subtitle: "💼 Twoje centrum zarządzania kuchnią",
    loading: "Ładowanie profilu...",
    notLoggedIn: "Musisz być zalogowany, aby zobaczyć profil",
    loginButton: "Zaloguj się",
    editProfile: "Edytuj profil",
    editShort: "Edytuj",
    settings: "Ustawienia",
    settingsShort: "Settings",
  },

  // KPI Cards (Hero Metrics)
  kpi: {
    savedMoney: {
      label: "💰 Oszczędzono",
      thisMonth: "W tym miesiącu",
      currency: "PLN",
    },
    cookedRecipes: {
      label: "Ugotowane",
      unit: "przepisów",
    },
    fridgeItems: {
      label: "W lodówce",
      unit: "produktów",
    },
    chefTokens: {
      label: "ChefTokens",
      unit: "CT",
    },
  },

  // Progress & Level
  progress: {
    level: "Poziom",
    levelNumber: "Poziom {level}",
    xpProgress: "{current} / {max} XP",
    toNextLevel: "{percent}% do następnego poziomu",
  },

  // Weekly Budget
  budget: {
    title: "Budżet tygodnia",
    spent: "{spent} / {total} PLN",
    remaining: "✅ Świetnie! Pozostało {amount} PLN",
    overBudget: "⚠️ Przekroczono budżet o {amount} PLN",
  },

  // Tabs
  tabs: {
    overview: "Przegląd",
    stats: "Statystyki",
    resources: "Zasoby",
  },

  // Overview Tab
  overview: {
    lastActions: "Ostatnie działania",
    noActions: "Brak ostatnich działań",
    whatNext: "Co dalej?",
  },

  // Activity Types
  activities: {
    dishCooked: "Ugotowano: {dish}",
    productAdded: "Dodano: {product}",
    recipesSaved: "Zapisano przepis: {recipe}",
    courseCompleted: "Ukończono kurs: {course}",
  },

  // Collective Insight (AI-mediated social layer)
  collectiveInsight: {
    title: "🧠 Jak myślą inni kucharze na Twoim etapie",
    subtitle: "Anonimowe obserwacje oparte na decyzjach innych użytkowników",
    footer: "Agregowane anonimowo z działań społeczności",
    insights: [
      "Wielu użytkowników na poziomie 1 skupia się teraz bardziej na zarządzaniu lodówką niż na nowych przepisach.",
      "Często pojawia się potrzeba uproszczenia technik zamiast ich komplikowania.",
      "To dobry moment, aby zacząć kontrolować koszt bez utraty smaku.",
    ],
  },

  // Profile Header
  header: {
    title: "Profil",
    subtitle: "Zarządzaj swoim kontem i ustawieniami",
    editProfile: "Edytuj profil",
    viewPublicProfile: "Zobacz profil publiczny",
  },

  // Profile Info
  info: {
    name: "Imię",
    email: "Email",
    phone: "Telefon",
    bio: "O mnie",
    bioPlaceholder: "Opowiedz coś o sobie...",
    location: "Lokalizacja",
    locationPlaceholder: "Miasto, kraj",
    website: "Strona internetowa",
    websitePlaceholder: "https://twoja-strona.com",
    joined: "Dołączył",
    save: "Zapisz zmiany",
    cancel: "Anuluj",
  },

  // Avatar
  avatar: {
    upload: "Prześlij zdjęcie",
    change: "Zmień zdjęcie",
    remove: "Usuń zdjęcie",
    uploading: "Przesyłanie...",
    uploadSuccess: "Zdjęcie zostało przesłane",
    uploadError: "Błąd przesyłania zdjęcia",
    maxSize: "Maksymalny rozmiar: 5MB",
    allowedFormats: "Dozwolone formaty: JPG, PNG, GIF",
  },

  // Settings
  settings: {
    title: "Ustawienia",
    subtitle: "Proste ustawienia. Inteligentne działanie.",
    backButton: "Назад",
    loading: "Ładowanie ustawień...",
    saving: "Zapisywanie...",
    
    // Sections
    sections: {
      core: {
        label: "Podstawowe",
        description: "Język, czas, jednostki",
      },
      ai: {
        label: "AI & Mentor",
        description: "Styl asystenta",
      },
      notifications: {
        label: "Powiadomienia",
        description: "Ważne przypomnienia",
      },
    },
    
    general: {
      title: "Ogólne",
      language: "Język",
      languageDescription: "Wpływa na: UI, teksty, AI-odpowiedzi, podpowiedzi, błędy",
      timeFormat: "Format czasu",
      timeFormatDescription: "Wybierz format wyświetlania czasu",
      timeFormat12h: "12-godzinny",
      timeFormat24h: "24-godzinny",
      units: "Jednostki",
      unitsDescription: "Ważne dla przepisów i AI",
      unitsMetric: "Metryczne (g, ml)",
      unitsKitchen: "Kuchenne (szklanki, łyżki)",
      theme: "Motyw",
      themeDescription: "Wybierz jasny lub ciemny motyw",
      light: "Jasny",
      dark: "Ciemny",
      system: "Systemowy",
      timezone: "Strefa czasowa",
      timezoneDescription: "Wybierz swoją strefę czasową",
      autoSave: "Zmiany są zapisywane automatycznie i stosowane natychmiast",
    },

    notifications: {
      title: "Powiadomienia",
      emailNotifications: "Powiadomienia email",
      emailNotificationsDescription: "Otrzymuj aktualizacje na email",
      pushNotifications: "Powiadomienia push",
      pushNotificationsDescription: "Otrzymuj powiadomienia w przeglądarce",
      courseUpdates: "Aktualizacje kursów",
      courseUpdatesDescription: "Powiadomienia o nowych kursach i materiałach",
      marketingEmails: "Emaile marketingowe",
      marketingEmailsDescription: "Otrzymuj wiadomości o promocjach i nowościach",
    },

    privacy: {
      title: "Prywatność",
      publicProfile: "Profil publiczny",
      publicProfileDescription: "Twój profil będzie widoczny dla innych użytkowników",
      showEmail: "Pokaż email",
      showEmailDescription: "Twój email będzie widoczny w profilu publicznym",
      showActivity: "Pokaż aktywność",
      showActivityDescription: "Twoja aktywność będzie widoczna dla innych",
    },

    security: {
      title: "Bezpieczeństwo",
      changePassword: "Zmień hasło",
      currentPassword: "Obecne hasło",
      newPassword: "Nowe hasło",
      confirmPassword: "Potwierdź hasło",
      twoFactor: "Uwierzytelnianie dwuskładnikowe",
      twoFactorDescription: "Dodatkowa warstwa bezpieczeństwa dla twojego konta",
      enable: "Włącz",
      disable: "Wyłącz",
      sessions: "Aktywne sesje",
      sessionsDescription: "Zarządzaj urządzeniami zalogowanymi do twojego konta",
      logoutAll: "Wyloguj wszystkie urządzenia",
    },

    danger: {
      title: "Strefa niebezpieczna",
      deleteAccount: "Usuń konto",
      deleteAccountDescription: "Trwale usuń swoje konto i wszystkie dane",
      deleteButton: "Usuń konto",
      deleteConfirm: "Czy na pewno chcesz usunąć konto?",
      deleteWarning: "Ta akcja jest nieodwracalna. Wszystkie twoje dane zostaną trwale usunięte.",
      typeToConfirm: "Wpisz 'DELETE', aby potwierdzić",
    },
  },

  // Health Data
  health: {
    title: "Dane zdrowotne",
    subtitle: "Pomóż nam personalizować rekomendacje żywieniowe",
    
    basic: {
      title: "Podstawowe informacje",
      age: "Wiek",
      agePlaceholder: "Twój wiek",
      gender: "Płeć",
      male: "Mężczyzna",
      female: "Kobieta",
      other: "Inna",
      preferNotToSay: "Wolę nie mówić",
      height: "Wzrost",
      heightPlaceholder: "cm",
      weight: "Waga",
      weightPlaceholder: "kg",
    },

    activity: {
      title: "Poziom aktywności",
      sedentary: "Siedzący tryb życia",
      sedentaryDescription: "Brak lub minimalna aktywność fizyczna",
      light: "Lekka aktywność",
      lightDescription: "Ćwiczenia 1-3 razy w tygodniu",
      moderate: "Umiarkowana aktywność",
      moderateDescription: "Ćwiczenia 3-5 razy w tygodniu",
      active: "Aktywny",
      activeDescription: "Ćwiczenia 6-7 razy w tygodniu",
      veryActive: "Bardzo aktywny",
      veryActiveDescription: "Intensywne ćwiczenia codziennie",
    },

    goals: {
      title: "Cele żywieniowe",
      loseWeight: "Zrzucić wagę",
      maintainWeight: "Utrzymać wagę",
      gainWeight: "Przybrać na wadze",
      buildMuscle: "Zbudować mięśnie",
      improveHealth: "Poprawić zdrowie",
      other: "Inne",
    },

    dietary: {
      title: "Preferencje żywieniowe",
      vegetarian: "Wegetarianin",
      vegan: "Weganin",
      pescatarian: "Pescatarianin",
      glutenFree: "Bezglutenowe",
      dairyFree: "Bez nabiału",
      nutFree: "Bez orzechów",
      halal: "Halal",
      kosher: "Koszerny",
      other: "Inne",
    },

    allergies: {
      title: "Alergie i nietolerancje",
      placeholder: "Wymień swoje alergie oddzielone przecinkami",
      common: "Popularne alergeny",
      peanuts: "Orzeszki ziemne",
      treeNuts: "Orzechy",
      milk: "Mleko",
      eggs: "Jajka",
      fish: "Ryby",
      shellfish: "Skorupiaki",
      soy: "Soja",
      wheat: "Pszenica",
      sesame: "Sezam",
    },
  },

  // Stats
  stats: {
    title: "Statystyki",
    recipesCreated: "Utworzone przepisy",
    recipesShared: "Udostępnione przepisy",
    coursesCompleted: "Ukończone kursy",
    tokensEarned: "Zdobyte tokeny",
    totalPoints: "Łącznie punktów",
    rank: "Ranga",
    achievements: "Osiągnięcia",
    badges: "Odznaki",
    
    // Stats Tab Charts & Data
    budgetChart: {
      title: "Budżet (ostatnie 4 tygodnie)",
      spent: "Wydano",
      budget: "Budżet",
      week: "Tydz {number}",
    },
    wasteChart: {
      title: "Marnotrawstwo jedzenia",
      trend: "Trend:",
      trendDown: "Maleje ✓",
      trendUp: "Rośnie",
      trendStable: "Stabilny",
    },
    cookedVsConsumed: {
      title: "Ugotowane vs Zjedzone",
      cooked: "Ugotowano",
      consumed: "Zjedzone",
      efficiency: "{percent}% efektywności",
    },
    categoryChart: {
      title: "Wydatki według kategorii",
    },
    waste: {
      title: "Marnowanie produktów",
      great: "Świetny wynik! 🎉",
      good: "Dobra praca 👍",
      canImprove: "Możesz lepiej ♻️",
      wastedProducts: "produktów zmarnowanych",
    },
    topRecipes: {
      title: "Najczęściej gotowane",
      cooked: "{count}× ugotowano",
      noData: "Brak danych",
    },
    topCategories: {
      title: "Kategorie z największym wydatkiem",
      noData: "Brak danych",
    },
  },

  // Messages
  messages: {
    updateSuccess: "Profil został zaktualizowany",
    updateError: "Błąd aktualizacji profilu",
    passwordChangeSuccess: "Hasło zostało zmienione",
    passwordChangeError: "Błąd zmiany hasła",
    deleteSuccess: "Konto zostało usunięte",
    deleteError: "Błąd usuwania konta",
    uploadSuccess: "Zdjęcie zostało przesłane",
    uploadError: "Błąd przesyłania zdjęcia",
  },
} as const;
