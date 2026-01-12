/**
 * Admin translations (PL)
 * Административная панель
 */

export const admin = {
  // Dashboard
  dashboard: {
    title: "Panel administracyjny",
    subtitle: "Zarządzaj platformą",
    overview: "Przegląd",
    analytics: "Analityka",
    
    kpi: {
      users: {
        title: "Użytkownicy",
        total: "Łącznie",
        activeToday: "Aktywni dziś",
        growth: "Wzrost",
        viewAll: "Zobacz wszystkich",
      },
      content: {
        title: "Treść",
        recipes: "Przepisy",
        products: "Produkty",
        courses: "Kursy",
        viewAll: "Zobacz katalog",
      },
      ai: {
        title: "AI",
        queries: "Zapytania",
        accuracy: "Dokładność",
        tokens: "Tokeny",
        viewAll: "Statystyki AI",
      },
      system: {
        title: "System",
        uptime: "Uptime",
        errors: "Błędy",
        users: "Użytkownicy",
        viewAll: "Monitoring",
      },
    },
    
    stats: {
      totalUsers: "Łącznie użytkowników",
      activeUsers: "Aktywnych użytkowników",
      totalRecipes: "Łącznie przepisów",
      totalCourses: "Łącznie kursów",
      tokensInCirculation: "Tokenów w obiegu",
      revenue: "Przychód",
    },
    
    actionHub: {
      title: "Szybkie działania",
      users: {
        title: "Użytkownicy",
        viewAll: "Wszyscy użytkownicy",
        roles: "Zarządzanie rolami",
        activity: "Aktywność",
      },
      content: {
        title: "Treść",
        recipes: "Przepisy",
        ingredients: "Składniki",
        courses: "Kursy",
      },
      ai: {
        title: "AI",
        translations: "Tłumaczenia",
        mentor: "Mentor",
        automation: "Automatyzacja",
      },
      system: {
        title: "System",
        settings: "Ustawienia",
        security: "Bezpieczeństwo",
      },
    },
    
    systemNotifications: {
      title: "Powiadomienia systemowe",
      rolesChanged: "Zmieniono role",
      localizationUpdated: "Zaktualizowano lokalizację",
      hoursAgo: "godzin temu",
      hourAgo: "godzinę temu",
    },
    
    quickActions: {
      title: "Szybkie akcje",
      createUser: "Dodaj użytkownika",
      createRecipe: "Dodaj przepis",
      createCourse: "Dodaj kurs",
      sendNotification: "Wyślij powiadomienie",
      viewReports: "Zobacz raporty",
    },
  },

  // Users Management
  users: {
    title: "Użytkownicy",
    subtitle: "Zarządzaj kontami użytkowników",
    search: "Szukaj użytkowników...",
    filter: "Filtruj",
    sort: "Sortuj",
    export: "Eksport użytkowników (TODO: implementacja)",
    notFound: "Użytkownik nie został znaleziony",
    noResults: "Nie znaleziono użytkowników",
    
    kpi: {
      totalUsers: "Łącznie użytkowników",
      activeUsers: "Aktywni użytkownicy",
      premiumUsers: "Premium użytkownicy",
      growth: "Wzrost",
      noPremium: "Brak użytkowników premium",
    },
    
    table: {
      id: "ID",
      name: "Imię",
      email: "Email",
      role: "Rola",
      status: "Status",
      registered: "Zarejestrowany",
      lastActive: "Ostatnia aktywność",
      actions: "Akcje",
      user: "Użytkownik",
    },
    
    roles: {
      admin: "🔑 Administrator",
      moderator: "Moderator",
      premium: "⭐ Premium",
      chef: "Szef kuchni",
      user: "👤 Użytkownik",
      guest: "Gość",
    },
    
    status: {
      all: "Wszystkie",
      active: "Aktywny",
      inactive: "Nieaktywny",
      suspended: "Zawieszony",
      banned: "Zbanowany",
      blocked: "Zablokowany",
      pending: "Oczekujący",
    },
    
    actions: {
      view: "Zobacz",
      edit: "Edytuj",
      editUser: "Edytuj użytkownika",
      viewUser: "Podgląd użytkownika",
      suspend: "Zawieś",
      ban: "Zbanuj",
      delete: "Usuń",
      deleteUser: "Usuń użytkownika?",
      confirmDelete: "Czy na pewno chcesz usunąć użytkownika",
      deleteWarning: "Ta akcja jest nieodwracalna. Usuń tylko jeśli absolutnie konieczne.",
      deleteConsequences: "Wszystkie dane użytkownika zostaną usunięte",
      sendEmail: "Wyślij email",
      resetPassword: "Zresetuj hasło",
      viewActivity: "Zobacz aktywność",
      cancel: "Anuluj",
      save: "Zapisz",
      adminWarning: "⚠️ Uwaga: Nadajesz uprawnienia administratora",
      blockWarning: "⚠️ Uwaga: Użytkownik nie będzie mógł zalogować się do systemu",
    },
  },

  // Recipes Management
  recipes: {
    title: "Przepisy",
    subtitle: "Zarządzaj przepisami",
    pending: "Oczekujące",
    approved: "Zatwierdzone",
    rejected: "Odrzucone",
    reported: "Zgłoszone",
    
    actions: {
      approve: "Zatwierdź",
      reject: "Odrzuć",
      feature: "Wyróżnij",
      unfeature: "Usuń wyróżnienie",
      delete: "Usuń",
      viewReports: "Zobacz zgłoszenia",
    },
  },

  // Courses Management
  courses: {
    title: "Kursy",
    subtitle: "Zarządzaj kursami",
    draft: "Szkice",
    published: "Opublikowane",
    archived: "Zarchiwizowane",
    
    actions: {
      publish: "Opublikuj",
      unpublish: "Cofnij publikację",
      archive: "Archiwizuj",
      delete: "Usuń",
      edit: "Edytuj",
      viewStudents: "Zobacz studentów",
    },
  },

  // Catalog Management
  catalog: {
    title: "Katalog",
    subtitle: "Zarządzaj produktami i przepisami",
    
    products: {
      title: "Produkty",
      subtitle: "Zarządzaj katalogiem składników",
      addProduct: "Dodaj produkt",
      editProduct: "Edytuj produkt",
      deleteProduct: "Usuń produkt",
      noProducts: "Nie znaleziono produktów",
      
      table: {
        name: "Nazwa",
        category: "Kategoria",
        unit: "Jednostka",
        usedIn: "Wykorzystywane",
        actions: "Akcje",
        recipes: "przepisów",
      },
      
      categories: {
        all: "Wszystkie",
        meat: "Mięso",
        fish: "Ryby",
        vegetables: "Warzywa",
        fruits: "Owoce",
        dairy: "Nabiał",
        grains: "Zboża",
        condiment: "Przyprawy",
        spices: "Przyprawy",
        other: "Inne",
      },
      
      form: {
        name: "Nazwa produktu",
        namePlaceholder: "np. Arbuz, Watermelon, Арбуз",
        nameRequired: "Nazwa produktu jest wymagana",
        category: "Kategoria",
        unit: "Jednostka miary",
        description: "Wprowadź nazwę w dowolnym języku. AI automatycznie przetłumaczy.",
        successMessage: "Produkt dodany i przetłumaczony przez AI",
        errorMessage: "Błąd podczas tworzenia produktu",
        save: "Zapisz",
        cancel: "Anuluj",
      },
      
      deleteDialog: {
        title: "Usunąć składnik?",
        titleBlocked: "Nie można usunąć składnika",
        description: "Czy na pewno chcesz usunąć składnik",
        descriptionBlocked: "Składnik {name} jest używany w przepisach i nie może zostać usunięty.",
        warning: "Uwaga!",
        warningMessage: "Ta akcja nie może być cofnięta. Składnik zostanie trwale usunięty.",
        blockedTitle: "Usuwanie zablokowane",
        blockedMessage: "Ten składnik jest używany w <strong>{count} przepisach</strong>. Najpierw usuń go ze wszystkich przepisów lub zaktualizuj przepisy, aby używały innego składnika.",
        cancel: "Anuluj",
        cancelBlocked: "Rozumiem",
        confirm: "Tak, usuń",
      },
    },
    
    recipes: {
      title: "Przepisy",
      subtitle: "Zarządzaj katalogiem przepisów",
      
      deleteDialog: {
        title: "Usunąć przepis?",
        description: "Czy na pewno chcesz usunąć przepis",
        createdAt: "Utworzono:",
        viewsWarning: "Uwaga!",
        viewsMessage: "Ten przepis został wyświetlony {count} razy. Użytkownicy mogą mieć go zapisanego. Po usunięciu przywrócenie przepisu będzie niemożliwe.",
        irreversibleTitle: "Nieodwracalna akcja",
        irreversibleMessage: "Przepis zostanie usunięty na zawsze. Wszystkie dane, w tym składniki, kroki przygotowania i zdjęcia zostaną utracone.",
        cancel: "Anuluj",
        confirm: "Tak, usuń na zawsze",
      },
    },
  },

  // Content Moderation
  moderation: {
    title: "Moderacja",
    subtitle: "Przeglądaj zgłoszone treści",
    reports: "Zgłoszenia",
    pending: "Oczekujące",
    resolved: "Rozwiązane",
    
    reportTypes: {
      spam: "Spam",
      inappropriate: "Nieodpowiednia treść",
      copyright: "Naruszenie praw autorskich",
      misinformation: "Dezinformacja",
      other: "Inne",
    },
    
    actions: {
      review: "Przejrzyj",
      approve: "Zatwierdź",
      remove: "Usuń",
      warn: "Ostrzeż",
      ban: "Zbanuj",
      dismiss: "Odrzuć zgłoszenie",
    },
  },

  // Analytics
  analytics: {
    title: "Analityka",
    subtitle: "Statystyki i raporty",
    
    metrics: {
      pageViews: "Wyświetlenia stron",
      uniqueVisitors: "Unikalni użytkownicy",
      bounceRate: "Współczynnik odrzuceń",
      avgSessionDuration: "Średni czas sesji",
      conversion: "Konwersja",
      retention: "Retencja",
    },
    
    charts: {
      userGrowth: "Wzrost użytkowników",
      recipeCreation: "Utworzone przepisy",
      courseCompletion: "Ukończone kursy",
      tokenUsage: "Użycie tokenów",
      revenue: "Przychód",
    },
    
    periods: {
      today: "Dzisiaj",
      week: "Ten tydzień",
      month: "Ten miesiąc",
      year: "Ten rok",
      custom: "Niestandardowy",
    },
  },

  // Settings
  settings: {
    title: "Ustawienia",
    subtitle: "Zarządzaj parametrami systemu",
    
    tabs: {
      general: "Ogólne",
      email: "Email",
      notifications: "Powiadomienia",
      api: "API",
      security: "Bezpieczeństwo",
    },
    
    general: {
      title: "Ogólne",
      appName: "Nazwa aplikacji",
      appDescription: "Opis aplikacji",
      siteName: "Nazwa strony",
      siteDescription: "Opis strony",
      language: "Język",
      timezone: "Strefa czasowa",
      theme: "Motyw",
      maintenance: "Tryb konserwacji",
    },
    
    features: {
      title: "Funkcje",
      registration: "Rejestracja",
      comments: "Komentarze",
      reviews: "Opinie",
      aiMentor: "AI-Mentor",
      tokens: "ChefTokens",
    },
    
    limits: {
      title: "Limity",
      maxRecipesPerUser: "Maks. przepisów na użytkownika",
      maxFileSize: "Maks. rozmiar pliku",
      maxAIRequests: "Maks. zapytań AI dziennie",
      rateLimit: "Limit żądań",
    },
    
    notifications: {
      title: "Powiadomienia",
      emailNotifications: "Powiadomienia email",
      pushNotifications: "Powiadomienia push",
      adminAlerts: "Alerty dla administratorów",
    },
  },

  // Messages
  messages: {
    userUpdated: "Użytkownik został zaktualizowany",
    userDeleted: "Użytkownik został usunięty",
    recipeApproved: "Przepis został zatwierdzony",
    recipeRejected: "Przepis został odrzucony",
    coursePublished: "Kurs został opublikowany",
    reportResolved: "Zgłoszenie zostało rozwiązane",
    settingsSaved: "Ustawienia zostały zapisane",
    actionFailed: "Akcja nie powiodła się",
    confirmAction: "Czy na pewno chcesz wykonać tę akcję?",
  },
} as const;
