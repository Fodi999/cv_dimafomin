/**
 * ChefTokens translations (PL)
 * Токены, кошелёк, транзакции
 */

export const tokens = {
  // ChefTokens Page (v2)
  page: {
    hero: {
      badge: "Twoja waluta świadomej kuchni",
      title: "ChefTokens — Twoja waluta",
      titleHighlight: "świadomej kuchni",
      description: "ChefTokens pomagają podejmować mądre decyzje: planować, gotować i uczyć się bez chaosu.",
      
      features: {
        control: {
          title: "🔄 Kontrola decyzji, nie \"paywall\"",
          description: "Tokeny uczą planowania, nie blokują dostępu",
        },
        thinking: {
          title: "🧠 Uczysz się myśleć jak kucharz",
          description: "Każda akcja to świadoma decyzja",
        },
        planning: {
          title: "♻️ Mniej marnowania, więcej kontroli",
          description: "Planowanie zamiast chaosu",
        },
      },
    },
    
    yourTokens: {
      title: "Twoje ChefTokens",
      loginPrompt: "Zaloguj się, aby zobaczyć swoje saldo i historię",
    },
    
    howToEarn: {
      title: "Jak zdobywasz ChefTokens",
      subtitle: "ChefTokens nagradzają działanie, nie klikanie.",
      
      methods: {
        cookRecipe: {
          title: "Ugotowanie przepisu",
          description: "Każdy przepis, który zrealizujesz i oznaczysz jako \"ugotowany\"",
          reward: "+5 CT",
        },
        aiDialog: {
          title: "Dialog z AI (zadanie)",
          description: "Ukończenie jednego zadania w dialogu z AI Mentor",
          reward: "+2 CT",
        },
        academyModule: {
          title: "Moduł w Akademii",
          description: "Ukończenie pełnego modułu z wszystkimi zadaniami",
          reward: "+10 CT",
        },
        dishAnalysis: {
          title: "Analiza dania",
          description: "Prześlij zdjęcie i otrzymaj analizę AI",
          reward: "+5 CT",
        },
        completePath: {
          title: "Ukończenie ścieżki",
          description: "Finalizacja całej ścieżki rozwoju w Akademii",
          reward: "+50 CT",
        },
      },
    },
    
    howToSpend: {
      title: "Na co wydajesz ChefTokens",
      subtitle: "Każde użycie tokenów to świadoma decyzja, nie przypadkowy klik.",
      
      options: {
        aiQuestions: {
          title: "Zapytania do AI",
          description: "Zadaj pytanie AI o produkt, technikę lub pairing",
          cost: "1–3 CT",
          unit: "za pytanie",
        },
        premiumRecipes: {
          title: "Premium przepisy",
          description: "Dostęp do zaawansowanych przepisów szefów kuchni",
          cost: "5–15 CT",
          unit: "za przepis",
        },
        advancedPaths: {
          title: "Zaawansowane ścieżki Akademii",
          description: "Odblokuj zaawansowane kursy po ukończeniu podstaw",
          cost: "20–50 CT",
          unit: "za ścieżkę",
        },
        flavorAnalysis: {
          title: "Analizy smaków / pairing",
          description: "Sprawdź, jakie produkty pasują do siebie",
          cost: "3–10 CT",
          unit: "za analizę",
        },
      },
    },
    
    whyItWorks: {
      title: "Dlaczego to działa",
      subtitle: "ChefTokens nie są karą.",
      description: "Są mechanizmem, który:",
      
      benefits: {
        planning: "uczy planowania — zamiast chaosu i impulsywnych decyzji",
        noChao: "ogranicza chaos — każda akcja ma wartość i konsekwencje",
        goodDecisions: "wzmacnia dobre decyzje kuchenne — nagradzamy działanie, nie klikanie",
      },
      
      points: {
        noScrolling: {
          title: "Brak scrollowania bez sensu",
          description: "Każda akcja jest świadoma, nie przypadkowa",
        },
        valueInAction: {
          title: "Każda akcja ma wartość",
          description: "Uczysz się podejmować lepsze decyzje kulinarne",
        },
      },
    },
    
    cta: {
      title: "Gdzie teraz?",
    },
  },
  
  // Wallet (old)
  wallet: {
    title: "Portfel ChefTokens",
    balance: "Saldo",
    available: "Dostępne",
    locked: "Zablokowane",
    pending: "Oczekujące",
    total: "Łącznie",
    
    actions: {
      send: "Wyślij",
      receive: "Odbierz",
      exchange: "Wymień",
      history: "Historia",
    },
  },

  // Transactions
  transactions: {
    title: "Historia transakcji",
    recent: "Ostatnie transakcje",
    all: "Wszystkie transakcje",
    sent: "Wysłane",
    received: "Odebrane",
    pending: "Oczekujące",
    completed: "Zakończone",
    failed: "Niepowodzenie",
    
    type: {
      earn: "Zarobione",
      spend: "Wydane",
      transfer: "Transfer",
      reward: "Nagroda",
      purchase: "Zakup",
      refund: "Zwrot",
    },
    
    details: {
      transactionId: "ID transakcji",
      date: "Data",
      amount: "Kwota",
      status: "Status",
      from: "Od",
      to: "Do",
      description: "Opis",
      fee: "Opłata",
    },
    
    noTransactions: "Brak transakcji",
    loadMore: "Załaduj więcej",
  },

  // Earning
  earning: {
    title: "Zarabiaj tokeny",
    subtitle: "Otrzymuj tokeny za aktywność na platformie",
    
    methods: {
      recipe: {
        title: "Twórz przepisy",
        description: "Otrzymuj tokeny za każdy opublikowany przepis",
        reward: "+10 tokenów",
      },
      share: {
        title: "Dziel się",
        description: "Otrzymuj tokeny, gdy inni używają twoich przepisów",
        reward: "+5 tokenów za użycie",
      },
      review: {
        title: "Recenzuj",
        description: "Pisz wartościowe opinie i otrzymuj tokeny",
        reward: "+2 tokeny za opinię",
      },
      course: {
        title: "Ukończ kursy",
        description: "Zdobywaj tokeny za ukończone moduły kursów",
        reward: "+50 tokenów za kurs",
      },
      daily: {
        title: "Codzienne logowanie",
        description: "Zaloguj się każdego dnia i otrzymaj bonus",
        reward: "+1 token dziennie",
      },
      referral: {
        title: "Zaproś znajomych",
        description: "Otrzymaj tokeny za każdego zaproszonego użytkownika",
        reward: "+100 tokenów za zaproszenie",
      },
    },
  },

  // Spending
  spending: {
    title: "Wydawaj tokeny",
    subtitle: "Wykorzystaj tokeny na zaawansowane funkcje",
    
    options: {
      ai: {
        title: "AI-Mentor",
        description: "Korzystaj z zaawansowanych funkcji AI-mentora",
        cost: "1 token za zapytanie",
      },
      premium: {
        title: "Premium przepisy",
        description: "Odblokuj ekskluzywne przepisy",
        cost: "10-50 tokenów",
      },
      courses: {
        title: "Premium kursy",
        description: "Dostęp do zaawansowanych kursów",
        cost: "100-500 tokenów",
      },
      consultations: {
        title: "Konsultacje",
        description: "Umów się na indywidualną konsultację",
        cost: "200 tokenów za godzinę",
      },
      features: {
        title: "Dodatkowe funkcje",
        description: "Odblokuj nowe możliwości platformy",
        cost: "Różne ceny",
      },
    },
  },

  // Exchange
  exchange: {
    title: "Wymień tokeny",
    subtitle: "Wymień tokeny na nagrody",
    
    from: "Z",
    to: "Na",
    amount: "Kwota",
    amountPlaceholder: "Wpisz kwotę",
    rate: "Kurs wymiany",
    fee: "Opłata",
    youGet: "Otrzymasz",
    exchange: "Wymień",
    cancel: "Anuluj",
    
    rewards: {
      title: "Dostępne nagrody",
      discount: {
        title: "Zniżka 10%",
        description: "Zniżka na premium kursy",
        cost: "50 tokenów",
      },
      recipe: {
        title: "Ekskluzywny przepis",
        description: "Dostęp do premium przepisu",
        cost: "100 tokenów",
      },
      consultation: {
        title: "Konsultacja",
        description: "1 godzina z ekspertem",
        cost: "500 tokenów",
      },
      merchandise: {
        title: "Gadżety",
        description: "Gadżety marki Fodi",
        cost: "1000 tokenów",
      },
    },
  },

  // Treasury
  treasury: {
    title: "Token Treasury",
    subtitle: "Bank ChefTokens",
    totalSupply: "Całkowita podaż",
    inCirculation: "W obiegu",
    locked: "Zablokowane",
    burned: "Spalone",
    updated: "Zaktualizowano",
    loading: "Ładowanie kazny...",
    error: "Błąd ładowania danych kazny",
    description: "ChefTokens to wewnętrzna waluta platformy, która pomaga podejmować świadome decyzje: planujesz zapytania do AI, otwierasz receptury i uczysz się korzystać z wiedzy bez nadmiaru i chaosu.",
  },

  // Messages
  messages: {
    sendSuccess: "Tokeny zostały wysłane",
    sendError: "Błąd wysyłania tokenów",
    receiveSuccess: "Tokeny zostały odebrane",
    exchangeSuccess: "Wymiana zakończona pomyślnie",
    exchangeError: "Błąd wymiany tokenów",
    insufficientBalance: "Niewystarczające saldo",
    transactionPending: "Transakcja w toku...",
    transactionFailed: "Transakcja nie powiodła się",
  },
} as const;
