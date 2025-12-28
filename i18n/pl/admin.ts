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
    
    stats: {
      totalUsers: "Łącznie użytkowników",
      activeUsers: "Aktywnych użytkowników",
      totalRecipes: "Łącznie przepisów",
      totalCourses: "Łącznie kursów",
      tokensInCirculation: "Tokenów w obiegu",
      revenue: "Przychód",
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
    
    table: {
      id: "ID",
      name: "Imię",
      email: "Email",
      role: "Rola",
      status: "Status",
      registered: "Zarejestrowany",
      lastActive: "Ostatnia aktywność",
      actions: "Akcje",
    },
    
    roles: {
      admin: "Administrator",
      moderator: "Moderator",
      chef: "Szef kuchni",
      user: "Użytkownik",
      guest: "Gość",
    },
    
    status: {
      active: "Aktywny",
      inactive: "Nieaktywny",
      suspended: "Zawieszony",
      banned: "Zbanowany",
    },
    
    actions: {
      view: "Zobacz",
      edit: "Edytuj",
      suspend: "Zawieś",
      ban: "Zbanuj",
      delete: "Usuń",
      sendEmail: "Wyślij email",
      resetPassword: "Zresetuj hasło",
      viewActivity: "Zobacz aktywność",
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
    title: "Ustawienia systemu",
    subtitle: "Konfiguruj platformę",
    
    general: {
      title: "Ogólne",
      siteName: "Nazwa strony",
      siteDescription: "Opis strony",
      language: "Język domyślny",
      timezone: "Strefa czasowa",
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
