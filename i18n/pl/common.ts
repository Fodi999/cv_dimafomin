/**
 * Common translations (PL)
 * Общие UI элементы: кнопки, действия, статусы
 */

export const common = {
  // Actions
  save: "Zapisz",
  cancel: "Anuluj",
  delete: "Usuń",
  edit: "Edytuj",
  create: "Utwórz",
  update: "Aktualizuj",
  close: "Zamknij",
  back: "Wróć",
  next: "Dalej",
  previous: "Poprzedni",
  confirm: "Potwierdź",
  submit: "Wyślij",
  search: "Szukaj",
  filter: "Filtruj",
  clear: "Wyczyść",
  select: "Wybierz",
  viewAll: "Zobacz wszystkie",
  viewMore: "Zobacz więcej",
  learnMore: "Dowiedz się więcej",
  getStarted: "Zacznij",
  
  // Status
  loading: "Ładowanie...",
  success: "Sukces",
  error: "Błąd",
  warning: "Ostrzeżenie",
  info: "Informacja",
  
  // Time
  today: "Dziś",
  yesterday: "Wczoraj",
  tomorrow: "Jutro",
  now: "Teraz",
  
  // Common words
  yes: "Tak",
  no: "Nie",
  or: "lub",
  and: "i",
  of: "z",
  in: "w",
  at: "o",
  by: "przez",
  from: "od",
  to: "do",
  
  // Development Modal
  devModal: {
    title: "Strona w budowie",
    message: "Wkrótce otwarcie!",
    follow: "Śledź aktualizacje",
  },
  
  // Notifications
  notifications: {
    title: "Powiadomienia",
    markAllRead: "Oznacz wszystkie jako przeczytane",
    viewAll: "Zobacz wszystkie powiadomienia",
    empty: "Brak powiadomień",
    unread: "Nieprzeczytane",
    
    // Types
    types: {
      ai: "AI",
      fridge: "Lodówka",
      order: "Zamówienie",
      system: "System",
      error: "Błąd",
    },
    
    // Time format
    time: {
      justNow: "Teraz",
      minutesAgo: "{{count}} min temu",
      hoursAgo: "{{count}} godz. temu",
      daysAgo: "{{count}} dni temu",
    },
    
    // Fridge notifications
    fridge: {
      itemAdded: "Produkt dodany",
      itemDeleted: "Produkt usunięty",
      itemExpiring: "Wkrótce straci ważność",
      itemExpired: "Stracił ważność",
      daysLeft: "{{count}} dni pozostało",
      priceAtRisk: "{{price}} PLN zagrożone",
    },
  },
} as const;
