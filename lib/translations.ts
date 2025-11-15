export type Language = 'pl';

export const translations = {
  pl: {
    // ==================== NAVIGATION ====================
    nav: {
      home: 'Główna',
      academy: 'Akademia',
      market: 'Rynek',
      fridge: 'Moja Lodówka',
      profile: 'Profil',
      login: 'Zaloguj się',
      logout: 'Wyloguj się',
      search: 'Szukaj...',
      leaderboard: 'Ranking',
      community: 'Społeczność',
    },

    // ==================== HERO SECTION ====================
    hero: {
      title: 'Nowoczesna Kuchnia i Doskonałe Smaków Zestawienia',
      subtitle: 'Od Dima Fomin',
      tagline: 'Zdobądź kompletne umiejętności kulinarne od mistrza',
      description: 'Akademia dla tych, którzy chcą nauczyć się nowoczesnej kuchni i Food Pairing od profesjonalisty z 20+ latami doświadczenia.',
      ctaPrimary: 'Rozpocznij Bezpłatnie',
      ctaSecondary: 'Przejrzyj Akademię',
      badge: 'Nowoczesna kuchnia i idealne zestawienia smaków od Dima Fomin',
      earnTokens: 'Zarabiaj ChefTokens',
      // Main heading lines
      headingLine1: 'Ucz się.',
      headingLine2: 'Gotuj.',
      headingLine3: 'Rozwijaj smak.',
      headingLine4: 'Zarabiaj ',
      headingLine4Continuation: 'ChefTokens.',
      // Platform description
      platformDescription: 'Platforma nowoczesnej kuchni, autorskich receptur i smaków.',
      aiMentorDescription: 'Twój personalny asystent AI pomoże tworzyć potrawy restauracyjne, dobierać idealne pary \"przystawka + napój\" i odkrywać receptury za ChefTokens.',
      // CTA buttons
      startLearning: 'Rozpocznij naukę',
      startDialog: 'Rozpocznij dialog',
      // Stats
      stats: {
        recipes: '50+',
        recipesLabel: 'Gotowych przepisów',
        students: '1000+',
        studentsLabel: 'Uczniów',
        support: '24/7',
        supportLabel: 'Pomoc AI',
      },
    },

    // ==================== ABOUT SECTION ====================
    about: {
      title: 'O Akademii',
      intro: 'Twój nauczyciel:',
      name: 'Dima Fomin',
      imageAlt: 'Dima Fomin - Szef Kuchni i Założyciel Modern Food Academy',
      whoIsDimaTitle: 'KTO TO DIMA FOMIN',
      whoIsDimaDesc: 'Mistrz kuchni z 20+ latami doświadczenia pracujący w najlepszych restauracjach świata. Specjalizuje się w nowoczesnych technikach kulinnych i Food Pairing.',
      
      paragraph1: 'Witaj w Modern Food Academy, gdzie dzielę się swoim doświadczeniem zdobytym w najlepszych restauracjach na całym świecie. Przez ponad 20 lat pracowałem w Polsce, Niemczech, Francji, Kanadzie i innych krajach, opracowując autorskie receptury i szkoląc zespoły kucharzy.',
      paragraph2: 'Każdy kurs łączy tradycję z nooczesnością, wiedzę z praktyką. Nauczę Cię nie tylko technik, ale także filozofii - precyzji, harmonii i poszanowania dla produktu. Pomogę Ci zrozumieć, dlaczego każdy ruch ma znaczenie i jak zbudować swój unikatowy styl w kuchni.',
      paragraph3: 'Specjalizuję się w opracowywaniu nowych produktów, tworzeniu kart technologicznych, szkoleniu personelu i Food Pairing. Teraz chcę przekazać tę wiedzę Tobie - niezależnie od tego, czy zaczynasz swoją przygodę, czy doskonalisz swoje umiejętności.',
      
      quote: 'Moja filozofia: poszanowanie tradycji, pasja do innowacji i dążenie do doskonałości. Wierzę, że każdy może nauczyć się tworzyć autentyczną nowoczesną kuchnię - wystarczy odpowiedni mentor, zaangażowanie i cierpliwość.',
    },

    // ==================== SECTIONS (AcademyAbout content) ====================
    sections: {
      about: {
        projectTitle: 'O projekcie',
        projectDescription: 'Modern Food Academy — platforma nowoczesnej kuchni, receptur i Food Pairing od szefa Dima Fomin. Tutaj uczysz się nowoczesnych receptur, kombinacji „zakąska + napój", rozwijasz smak i otwierasz receptury za ChefTokens za pomocą osobistego asystenta AI.',
        
        aiMentorTitle: 'KTO JEST AI DIMA FOMIN',
        aiMentorSubtitle: 'Cyfrowy mentor z doświadczeniem szefa',
        aiMentorDesc: 'AI Dima Fomin — cyfrowy asystent kulinarny oparty na doświadczeniu i podejściu szefa. Uczy przez żywy dialog, pomaga tworzyć nowoczesne receptury, analizuje zdjęcia twoich prac, dobiera kombinacje smaków i wyjaśnia techniki gotowania jak prawdziwy profesjonalista.',
        
        mentorTraits: [
          { title: 'Doświadczenie', desc: 'Wiedza opiera się na wieloletnim doświadczeniu szefa w nowoczesnej kuchni, serwowaniu i kombinacjach smaków.' },
          { title: 'Filozofia', desc: 'Każda odpowiedź przekazuje autorski styl, smak i podejście szefa do nowoczesnej sztuki kulinarnej.' },
          { title: 'Metoda nauczania', desc: 'Obучenie opiera się na dialogu, praktyce i analizie prawdziwych dań — bez suchej teorii.' },
        ],

        learningTitle: 'Jak przebiega nauka',
        learningSubtitle: 'Wybierz wygodny format — od żywego dialogu do analizy twoich dań i kombinacji smaków.',
        
        learningMethods: [
          { title: 'Czat-dialogi', desc: 'Zadawaj dowolne pytania o nowoczesną kuchnię, receptury i kombinacje — AI odpowiada natychmiast.' },
          { title: 'Analiza zdjęć', desc: 'Wyślij zdjęcie dania — AI oceni podanie, teksturę, technikę i zaproponuje ulepszenia.' },
          { title: 'Dobór video', desc: 'AI dobiera materiały edukacyjne i filmy pasujące do twojego celu, dania lub techniki.' },
          { title: 'Osobiste wskazówki', desc: 'System dostosowuje się do twojego poziomu, stylu gotowania i preferencji smakowych.' },
          { title: 'Pomoc podczas gotowania', desc: 'Otrzymuj rady w czasie rzeczywistym bezpośrednio w kuchni — krok po kroku.' },
          { title: 'Płatność tokenami', desc: 'Każde zapytanie do AI i dodatkowe funkcje opłacane są ChefTokens.' },
        ],

        capabilitiesTitle: 'Możliwości mentora AI',
        capabilitiesSubtitle: 'Wszystko, co robi AI Dima Fomin, aby ulepszyć twoje umiejętności nowoczesnej kuchni i kombinacji smaków.',
        
        capabilities: [
          { title: 'Generowanie receptur', desc: 'AI tworzy nowoczesne receptury i pairing-kombinacje na podstawie twoich produktów i preferencji.' },
          { title: 'Krok po kroku', desc: 'Wyjaśnia proces dania prostymi działaniami: od przygotowania do serwowania.' },
          { title: 'Analiza po zdjęciu', desc: 'Ocenia podanie, teksturę, prażenie, kolor i daje rekomendacje, jak ulepszyć technikę.' },
          { title: 'Dobór osobisty', desc: 'Dobiera dania i receptury do twojego poziomu, stylu gotowania i celów nauki.' },
          { title: 'Pomoc w czasie rzeczywistym', desc: 'Towarzyszy podczas gotowania: odpowiada na pytania, podpowiada, co robić dalej.' },
          { title: 'Dostępność 24/7 i adaptacja', desc: 'Zawsze dostępny, poznaje twój styl i dostosowuje się do twoich preferencji smakowych.' },
        ],

        ctaTitle: 'Nowoczesna kuchnia od zera',
        ctaSubtitle: 'Nauka od podstawowych technik do poziomu restauracyjnego',
        ctaDescription: 'Mentor AI poprowadzi cię od wyboru produktów do tworzenia nowoczesnych dań i doskonałych kombinacji smaków — przez dialog, analizę i osobiste wskazówki.',
        ctaButton: 'Rozpocznij naukę z AI',
      },
    },

    // ==================== ACADEMY ====================
    academy: {
      hero: {
        title: 'Akademia Kulinarna i Food Pairing',
        subtitle: 'od Dima Fomin',
      },
      
      direction: {
        title: 'Gdzie Chcesz Iść?',
        courses: {
          title: 'Kursy',
          description: 'Ucz się nowoczesnej kuchni krok po kroku'
        },
        community: {
          title: 'Społeczność',
          description: 'Dziel się recepturami i doświadczeniami'
        },
        leaderboard: {
          title: 'Ranking',
          description: 'Konkuruj z innymi i zyskuj nagrody'
        }
      },

      advantages: [
        {
          title: '⭐ Nauczanie od Mistrza',
          description: 'Nauka od szefa z 20+ latami doświadczenia międzynarodowego'
        },
        {
          title: '⭐ Praktyczne Umiejętności',
          description: 'Każdy kurs skupia się na rzeczywistych technikach kulinnych'
        },
        {
          title: '⭐ Food Pairing Focus',
          description: 'Naucz się doskonałych kombinacji smaków jak profesjonalista'
        },
        {
          title: '⭐ AI Asystent',
          description: 'Personalizowana pomoc dostępna 24/7 dla Twoich pytań'
        },
        {
          title: '⭐ ChefTokens System',
          description: 'Zarabiaj tokeny za naukę i wymieniaj je na kursy'
        },
        {
          title: '⭐ Certyfikaty',
          description: 'Otrzymaj certyfikat z każdego ukończonego kursu'
        }
      ],

      dashboard: {
        title: 'Mój Dashboard',
        completedCourses: 'Ukończone Kursy',
        activeCourses: 'Aktywne Kursy',
        startLearning: 'Rozpocznij Naukę',
        chefTokens: 'ChefTokens',
      },

      community: {
        title: 'Społeczność',
        createPost: 'Stwórz Post',
      },

      leaderboard: {
        title: 'Ranking',
      },

      profile: {
        title: 'Profil',
      }
    },

    // ==================== MARKET ====================
    market: {
      title: 'Kupuj Receptury za ChefTokens',
      subtitle: 'Преміальні рецепти, техніки та pairing-комбінації від Dima Fomin. Вибирайте страви, відкривайте інструкції та використовуйте ChefTokens для покупки.',
      search: 'Szukaj Receptur…',
      
      difficulty: {
        all: 'Wszystkie Poziomy',
        beginner: 'Początkujący',
        intermediate: 'Średniozaawansowany',
        advanced: 'Zaawansowany'
      },

      recipe: {
        buy: 'Kup',
        students: 'Studentów',
      }
    },

    // ==================== FRIDGE ====================
    fridge: {
      title: 'Moja Lodówka',
      subtitle: 'Zarządzaj swoimi produktami, kontroluj świeżość i planuj gotowanie.',
      search: 'Szukaj Produktów…',
      
      empty: {
        title: 'Lodówka Pusta',
        description: 'Dodaj pierwszy produkt, aby rozpocząć.'
      },

      categories: {
        protein: 'Białka',
        vegetable: 'Warzywa',
        condiment: 'Przyprawy',
        other: 'Inne'
      },

      tip: {
        title: 'Porada:',
        description: 'Śledzić daty przydatności twoich produktów. Produkty, których termin zbliża się do końca, będą oznaczone ostrzeżeniem.'
      }
    },

    // ==================== AUTH ====================
    auth: {
      loginTitle: 'Zaloguj się',
      loginSubtitle: 'Zaloguj się do swojego konta',
      registerTitle: 'Zarejestruj się',
      registerSubtitle: 'Utwórz nowe konto',
      email: 'Email',
      emailPlaceholder: 'twoj@email.com',
      password: 'Hasło',
      confirmPassword: 'Potwierdź hasło',
      name: 'Imię i Nazwisko',
      namePlaceholder: 'Jan Kowalski',
      loginButton: 'Zaloguj się',
      registerButton: 'Zarejestruj się',
      loading: 'Ładowanie...',
      loginTab: 'Zaloguj się',
      registerTab: 'Zarejestruj się',
      rememberMe: 'Zapamiętaj mnie',
      forgotPassword: 'Zapomniałeś hasła?',
      noAccount: 'Nie masz konta?',
      registerNow: 'Zarejestruj się',
      haveAccount: 'Masz już konto?',
      loginNow: 'Zaloguj się',
    },

    // ==================== SKILLS ====================
    skills: {
      title: 'Umiejętności',
      subtitle: 'Moje specjalizacje',
      proficiencyLevel: 'Poziom',
      competencyDetails: 'Szczegóły',
      items: [
        { title: '', description: '' },
      ],
    },

    // ==================== EXPERIENCE ====================
    experience: {
      title: 'Moja ścieżka',
      subtitle: 'Jak tutaj trafiłem',
      journeyIntro: '',
      finalPath: '',
      pathSteps: ' → ',
      ctaText: '',
      ctaButton: '',
      steps: [],
    },

    // ==================== PORTFOLIO ====================
    portfolio: {
      title: 'Portfolio',
      subtitle: 'Moje projekty',
      closeButton: 'Zamknij',
      items: [],
      descriptions: [],
    },

    // ==================== FOOTER ====================
    footer: {
      title: 'Modern Food Academy / by Dima Fomin',
      subtitle: 'Twój AI-nauczyciel nowoczesnej kuchni i Food Pairing',
      copyright: '© 2025 Modern Food Academy. Wszelkie prawa zastrzeżone. | by Dima Fomin',
      keywords: 'Nowoczesna kuchnia, Food Pairing, Akademia kulinarna',
      madeWith: 'Stworzone z',
      forPassion: 'pasją do kuchni',
    },

    // ==================== COMMON LABELS & BUTTONS ====================
    common: {
      buy: 'Kup',
      search: 'Szukaj...',
      notFound: 'Nie znaleziono',
      tryAgain: 'Spróbuj ponownie',
      loading: 'Ładowanie...',
      students: 'Studentów',
      level: 'Poziom:',
      emptyState: 'Brak elementów',
    },

    // ==================== CONTACT ====================
    contact: {
      title: 'Skontaktuj się',
      subtitle: 'Chcę się z Tobą połączyć',
      formTitle: 'Wyślij wiadomość',
      responseTime: 'Odpowiadamy w ciągu 24 godzin',
      successMessage: 'Dziękujemy! Twoja wiadomość została wysłana.',
      nameLabel: 'Imię',
      namePlaceholder: 'Jan Kowalski',
      emailLabel: 'Email',
      emailPlaceholder: 'twoj@email.com',
      messageLabel: 'Wiadomość',
      messagePlaceholder: 'Twoja wiadomość...',
      sendButton: 'Wyślij',
      sending: 'Wysyłanie...',
      requestTypeLabel: 'Typ zapytania',
      requestTypePlaceholder: 'Wybierz typ',
      requestTypes: { learning: 'Nauka', partnership: 'Współpraca', other: 'Inne' },
      connectTitle: 'Nasze Kanały Kontaktu',
      connectSubtitle: 'Połącz się ze mną przez:',
      instagram: 'Instagram',
      email: 'Email',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      whatsappAction: 'Napisz na WhatsApp',
      telegramAction: 'Napisz na Telegram',
    },

    // ==================== GENERAL ====================
    general: {
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
    }
  },
} as const;

export type Translations = typeof translations[Language];
