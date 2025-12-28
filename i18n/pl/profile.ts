/**
 * Profile translations (PL)
 * Профиль пользователя, настройки, здоровье
 */

export const profile = {
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
    subtitle: "Zarządzaj preferencjami konta",
    
    general: {
      title: "Ogólne",
      language: "Język",
      languageDescription: "Wybierz preferowany język interfejsu",
      theme: "Motyw",
      themeDescription: "Wybierz jasny lub ciemny motyw",
      light: "Jasny",
      dark: "Ciemny",
      system: "Systemowy",
      timezone: "Strefa czasowa",
      timezoneDescription: "Wybierz swoją strefę czasową",
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
