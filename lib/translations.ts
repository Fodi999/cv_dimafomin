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
        badge: 'Akademia kulinarna i Food Pairing od Dima Fomin',
        mainTitle: 'Ucz się gotować styl, rozwijaj technikę i zarabiaj ChefTokens za postęp.',
        mainDescription: 'Modern Food Academy — to przestrzeń, gdzie receptury, nauka i technologia łączą się w jeden system. AI-mentor działa jako osobisty konsultant szefa: podpowiada kroki, pomaga ulepszać podanie i dobiera odpowiednie napoje do każdego dania.',
        startButton: 'Rozpocznij Naukę',
        aiButton: 'Przejdź do AI-mentora',
        readyTitle: 'Gotowy Zacząć?',
        readyDescription: 'Dołącz do akademii i rozwijaj się profesjonalnym tempem.',
        moreButton: 'Dowiedz się więcej',
      },
      
      direction: {
        title: 'Wybierz Kierunek Nauki',
        description: 'Kursy, zadania, analizy prac i indywidualne rekomendacje — wszystko w jednym miejscu.',
        courses: {
          title: 'Kursy',
          description: 'Od podstawowych technik do zaawansowanych receptur.',
          link: '/academy/courses',
        },
        community: {
          title: 'Społeczność',
          description: 'Dziel się doświadczeniem i inspiruj się wzajemnie.',
          link: '/academy/community',
        },
        leaderboard: {
          title: 'Ranking',
          description: 'Rozwijaj się w mistrzostwo i zarabiaj ChefTokens.',
          link: '/academy/leaderboard',
        }
      },

      advantages: {
        title: '⭐ Korzyści Modern Food Academy',
        items: [
          {
            title: 'Struktura i praktyka',
            description: 'Każdy kurs to logiczny program z lekcjami, zadaniami i feedback\'iem.'
          },
          {
            title: 'Indywidualne porady AI',
            description: 'AI-mentor dostosowuje się do Twojego poziomu i celów.'
          },
          {
            title: 'ChefTokens za postęp',
            description: 'Zdobywaj tokeny za lekcje i używaj je do dostępu do receptur i premium-treści.'
          },
          {
            title: 'Aktywna społeczność',
            description: 'Wymieniaj się pomysłami, dziel się daniami i inspiruj się razem.'
          },
          {
            title: 'Przezroczysty ścieżka wzrostu',
            description: 'Statystyka osobista, poziomy, osiągnięcia — wszystko wspiera Twój postęp.'
          },
          {
            title: 'Autorskie Podejście Dima Fomin',
            description: 'Metodyka opiera się na doświadczeniu szefa i pracy z technikami, podaniem i połączeniami smaków.'
          }
        ]
      },

      stats: {
        recipes: '50+',
        recipesLabel: 'Profesjonalnych Receptur',
        students: '1000+',
        studentsLabel: 'Aktywnych Uczniów',
        support: '24/7',
        supportLabel: 'Pomoc AI-Mentora',
      },

      dashboard: {
        title: 'Mój Dashboard',
        completedCourses: 'Ukończone Kursy',
        activeCourses: 'Aktywne Kursy',
        startLearning: 'Rozpocznij Naukę',
        chefTokens: 'ChefTokens',
        earnMore: 'Zarabiaj Więcej',
      },

      community: {
        title: 'Społeczność',
        createPost: 'Stwórz Post',
        description: 'Dziel się swoją kreatywnością i doświadczeniem',
      },

      leaderboard: {
        title: 'Ranking',
        description: 'Najlepsi uczniowie',
        rank: 'Miejsce',
        chefName: 'Szef',
        points: 'Punkty',
        tokens: 'Tokeny',
      },

      profile: {
        title: 'Profil',
        statsLabel: 'Statystyki',
        progress: 'Postęp',
        level: 'Poziom',
        totalPoints: 'Łącznie Punktów',
        totalTokens: 'Łącznie Tokenów',
      },

      courses: {
        title: 'Kursy',
        pageTitle: 'Kursy Nowoczesnej Kuchni',
        subtitle: 'Opanuj Techniki Nowoczesnej Kuchni i Sztukę Połączeń Smaków od Szefa Dima Fomin',
        filter: 'Filtruj',
        all: 'Wszystkie',
        beginner: 'Początkujący',
        intermediate: 'Średniozaawansowany',
        advanced: 'Zaawansowany',
        enroll: 'Zapisz się',
        enrolled: 'Zapisany',
        duration: 'Czas Trwania',
        students: 'Uczniów',
        rating: 'Ocena',
        lessons: 'Lekcji',
        completed: 'Ukończone',
        progress: 'Postęp',
        
        // Specific courses
        course1: {
          title: '⭐ Nowoczesna Kuchnia: Podstawy',
          description: 'Naucz się pracować z produktami, krojeniem, obróbką termiczną i podaniem. Od pierwszych kroków — do nowoczesnego stylu gotowania.',
          duration: '4 godziny',
          price: '250',
          level: 'Początkujący',
          rating: '4.9',
        },
        
        course2: {
          title: '⭐ Food Pairing: Podstawy Połączeń Smaków',
          description: 'Studium równowagi smaków, tekstury, temperatury i naucz się łączyć potrawy z koktajlami i napojami. Stwórz swoje pierwsze pary „zakąska + napój".',
          duration: '3 godziny',
          price: '180',
          level: 'Średniozaawansowany',
          rating: '4.8',
        },
        
        course3: {
          title: '⭐ Nowoczesne Techniki i Potrawy Autorskie',
          description: 'Masterclass Nowoczesnych Technik: Marynowanie, Emulsje, Fuzja-Techniki, Podanie i Praca z Teksturą. Idealnie dla tych, którzy chcą gotować w stylu premium-restauracji.',
          duration: '5 godzin',
          price: '420',
          level: 'Zaawansowany',
          rating: '5',
        },
      }
    },

    // ==================== MARKET ====================
    market: {
      title: 'Kupuj Przepisy za ChefTokens',
      subtitle: 'Premiumowe receptury, techniki i pairing-kombinacje od Dima Fomin. Wybieraj potrawy, odkrywaj instrukcje i używaj ChefTokens do zakupów.',
      search: 'Szukaj Przepisów…',
      
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
      login: {
        title: 'Zaloguj się',
        subtitle: 'Zaloguj się do swojego konta i kontynuuj naukę',
        welcome: 'Witaj!',
        email: 'Email',
        emailPlaceholder: 'twoj@email.com',
        password: 'Hasło',
        passwordPlaceholder: '••••••••',
        rememberMe: 'Zapamiętaj mnie',
        forgotPassword: 'Zapomniałeś hasła?',
        loginButton: 'Zaloguj się',
        loading: 'Zalogowanie...',
        noAccount: 'Nie masz konta?',
        registerLink: 'Zarejestruj się',
        error: 'Błąd logowania',
        required: 'Pole wymagane',
        invalidEmail: 'Podaj prawidłowy adres email',
        loginFailed: 'Błąd logowania. Sprawdź email i hasło.',
        backToHome: '← Wróć na stronę główną',
      },

      register: {
        title: 'Zarejestruj się',
        subtitle: 'Stwórz nowe konto i zacznij swoją przygodę kulinarną',
        welcome: 'Dołącz do nas!',
        name: 'Imię i Nazwisko',
        namePlaceholder: 'Jan Kowalski',
        email: 'Email',
        emailPlaceholder: 'twoj@email.com',
        password: 'Hasło',
        passwordPlaceholder: '••••••••',
        confirmPassword: 'Potwierdź Hasło',
        confirmPasswordPlaceholder: '••••••••',
        registerButton: 'Zarejestruj się',
        loading: 'Rejestracja...',
        haveAccount: 'Masz już konto?',
        loginLink: 'Zaloguj się',
        passwordStrength: {
          weak: 'Słabe',
          medium: 'Średnie',
          strong: 'Silne',
        },
        passwordRequirements: 'Wymagania do hasła:',
        minChars: 'Minimum 8 znaków',
        uppercase: 'Wielka litera (A-Z)',
        number: 'Cyfra (0-9)',
        passwordsMatch: 'Hasła są identyczne',
        passwordsDontMatch: 'Hasła nie są identyczne',
        error: 'Błąd rejestracji',
        required: 'Pole wymagane',
        invalidEmail: 'Podaj prawidłowy adres email',
        nameTooShort: 'Imię musi mieć co najmniej 2 znaki',
        passwordTooShort: 'Hasło musi mieć co najmniej 8 znaków',
        registrationFailed: 'Błąd rejestracji. Spróbuj ponownie.',
        backToHome: '← Wróć na stronę główną',
      },

      // Common auth fields
      email: 'Email',
      emailPlaceholder: 'twoj@email.com',
      password: 'Hasło',
      passwordPlaceholder: '••••••••',
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

    // ==================== PROFILE ====================
    profile: {
      title: 'Mój Profil',
      tabs: {
        posts: 'Posty',
        saved: 'Zapisane',
        wallet: 'Portfel',
        settings: 'Ustawienia',
      },
      stats: {
        followers: 'Obserwujących',
        following: 'Obserwujesz',
        posts: 'Posty',
        recipes: 'Receptury',
        level: 'Poziom',
        experience: 'Doświadczenie',
        chefTokens: 'ChefTokens',
        totalPoints: 'Łączne Punkty',
      },
      actions: {
        editProfile: 'Edytuj Profil',
        logout: 'Wyloguj się',
        settings: 'Ustawienia',
      },
      header: {
        user: 'Użytkownik',
      },
      courses: {
        title: 'Moje Kursy',
        enrolled: 'Jesteś zapisany na',
        course: 'kurs(y)',
      },
      tokens: {
        title: 'Chef Tokens',
        generalBalance: 'Saldo Ogólne',
        earned: 'Zarobiono',
        spent: 'Wydano',
        pending: 'W oczekiwaniu',
      },
      transactions: {
        title: 'Ostatnie Transakcje',
        recipesPurchase: 'Zakup receptury',
        courseCompletion: 'Ukończenie kursu',
        referralBonus: 'Bonus za polecenie',
      },
      noPosts: 'Brak postów',
      noSavedPosts: 'Brak zapisanych postów',
      loadingProfile: 'Ładowanie profilu...',
      errorLoading: 'Błąd ładowania profilu',
      myRecipes: 'Moje Przepisy',
      achievements: 'Osiągnięcia',
      badges: 'Odznaki',
      bio: 'O sobie',
      location: 'Lokalizacja',
      joinDate: 'Dołączył',
    },

    // ==================== ADMIN ====================
    admin: {
      title: 'Panel Administracyjny',
      dashboard: 'Dashboard',
      usersMenu: 'Użytkownicy',
      recipesMenu: 'Przepisy',
      coursesMenu: 'Kursy',
      stats: 'Statystyki',
      settings: 'Ustawienia',
      
      overview: {
        totalUsers: 'Całkowito Użytkowników',
        activeUsers: 'Aktywnych Dzisiaj',
        totalRecipes: 'Całkowito Przepisów',
        totalCourses: 'Całkowito Kursów',
        revenue: 'Przychód',
      },

      usersSection: {
        title: 'Zarządzaj Użytkownikami',
        addUser: 'Dodaj Użytkownika',
        name: 'Imię',
        email: 'Email',
        role: 'Rola',
        status: 'Status',
        actions: 'Akcje',
        active: 'Aktywny',
        inactive: 'Nieaktywny',
        admin: 'Admin',
        instructor: 'Instruktor',
        user: 'Użytkownik',
        delete: 'Usuń',
        edit: 'Edytuj',
        confirmDelete: 'Potwierdź Usunięcie',
      },

      recipesSection: {
        title: 'Zarządzaj Przepisami',
        addRecipe: 'Dodaj Przepis',
        name: 'Nazwa',
        difficulty: 'Trudność',
        price: 'Cena',
        rating: 'Ocena',
        author: 'Autor',
        published: 'Opublikowany',
        actions: 'Akcje',
      },

      coursesSection: {
        title: 'Zarządzaj Kursami',
        addCourse: 'Dodaj Kurs',
        name: 'Nazwa',
        level: 'Poziom',
        duration: 'Czas Trwania',
        students: 'Uczniów',
        price: 'Cena',
        status: 'Status',
      },
    },

    // ==================== FOOTER ====================
    footer: {
      title: 'Modern Food Academy',
      byAuthor: 'by Dima Fomin',
      description: 'Twój AI-nastawnik po nowoczesnej kuchni i Food Pairing. Ucz się od szefa, rozwijaj smak, otwieraj przepisy.',
      copyright: '© 2025 Modern Food Academy. Wszystkie prawa zastrzeżone. | by Dima Fomin',
      
      navigation: {
        title: 'Nawigacja',
        home: 'Główna',
        academy: 'Akademia',
        market: 'Rynek',
        fridge: 'Moja Lodówka',
        profile: 'Profil',
        chat: 'AI Mentor',
      },
      
      resources: {
        title: 'Zasoby',
        documentation: 'Dokumentacja',
        guides: 'Przewodniki',
        faq: 'FAQ',
        support: 'Pomoc',
      },
      
      contact: {
        title: 'Kontakty',
        location: 'Gdańsk, Polska',
        email: 'Email',
        phone: 'Telefon',
      },
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
      welcome: 'Witaj!',
      backHome: '← Wróć na stronę główną',
      or: 'lub',
      loading_text: 'Ładowanie...',
      error_text: 'Błąd',
      success_text: 'Sukces',
      yes: 'Tak',
      no: 'Nie',
      confirm: 'Potwierdź',
      cancel: 'Anuluj',
      save: 'Zapisz',
      delete: 'Usuń',
      edit: 'Edytuj',
      add: 'Dodaj',
      close: 'Zamknij',
      submit: 'Wyślij',
      continue: 'Kontynuuj',
      next: 'Dalej',
      back: 'Wróć',
      skip: 'Pomiń',
    },

    // ==================== CHEF TOKENS ====================
    tokens: {
      title: 'ChefTokens — Twoja Wewnętrzna Kuchenna Waluta',
      description: 'ChefTokens — to Waluta Nauki i Zakupów w Modern Food Academy. Używaj jej, aby otwierać Nowoczesne Przepisy, Tutoriale Wideo, Pairing-Kombinacje i Uzyskiwać Pomoc AI-Mentora.',
      
      earn: {
        title: 'Zarabiaj',
        description: 'Przechodzą lekcje, Zaangażuj się w Naukę — Zdobądź ChefTokens za Aktywność.',
      },
      
      spend: {
        title: 'Wydawaj Mądrze',
        description: 'Kup Przepisy Autorskie, Nowoczesne Przepisy, Kursy i Analizy Połączeń Smaków.',
      },
      
      aiPayment: {
        title: 'Płatność za Zapytania AI',
        description: 'Rozszerzone Funkcje AI-Mentora Pobierają Małą Liczbę Tokenów.',
      },
      
      exchange: {
        title: 'Wymieniaj',
        description: 'Dostęp do Ekskluzywnych Przepisów, Masterclass\'ów i Osobistych Rekomendacji.',
      },
      
      stats: {
        inCirculation: 'ChefTokens w Obiegu',
        activeUsers: 'Aktywnych Użytkowników',
        aiAvailability: 'Dostępność AI-Mentora',
      },
    },
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

    // ==================== AI CHAT / MENTOR ====================
    chat: {
      preview: {
        title: 'Podgląd AI-Mentora',
        subtitle: 'Porozmawiaj z AI-Mentorem',
        description: 'Otrzymuj porady w czasie rzeczywistym, generuj przepisy, połączenia smaków i doskonalisz swoją umiejętność',
        aiMentorName: 'Dima Fomin AI',
        status: 'Online teraz',
        statusInitials: 'DF',
        greeting: 'Cześć! Chcesz nauczyć się gotować nowoczesne przepisy i dobierać idealne połączenia „zakąska + napój"?',
        greetingTime: '12:45',
        userQuestion: 'Jak przygotować stylowe danie we współczesnym formacie?',
        userQuestionTime: '12:46',
        mentorResponse: 'Powiem Ci o równowadze smaków, teksturze, podaniu i właściwym połączeniu z napojем. Gotowy zacząć?',
        mentorResponseTime: '12:47',
        inputPlaceholder: 'Wpisz pytanie...',
        sendButton: 'Wyślij',
      },
      
      messages: {
        title: 'Rozmowy z AI',
        empty: 'Brak rozmów',
        newChat: 'Nowa Rozmowa',
        loadingMessages: 'Ładowanie wiadomości...',
        sendMessage: 'Wyślij Wiadomość',
        typing: 'Pisze...',
      },

      sidebar: {
        title: 'Historia Rozmów',
        newChat: 'Nowa Rozmowa',
        clear: 'Wyczyść Historia',
        settings: 'Ustawienia',
      },

      features: {
        recipeGeneration: 'Generowanie Przepisów',
        flavorPairing: 'Połączenia Smaków',
        realTimeAdvice: 'Porady w Czasie Rzeczywistym',
        photoAnalysis: 'Analiza Zdjęć Dań',
        techniqueTips: 'Wskazówki Techniczne',
        personalizedRecommendations: 'Rekomendacje Spersonalizowane',
      },

      tips: {
        title: 'Wskazówki',
        askAboutTechniques: 'Zapytaj o techniki kulinarne',
        generateRecipes: 'Generuj nowe przepisy',
        analyzeDishes: 'Analizuj swoje dania',
        learnPairing: 'Ucz się połączeń smaków',
      },
    },

    // ==================== PORTFOLIO ====================
    portfolio: {
      items: [
        'Signature Roll',
        'Premium Selection',
        'Fresh Nigiri',
        'Maki Selection',
        'Artistic Presentation',
        'Chef\'s Special',
        'Gourmet Creation',
        'Deluxe Platter',
        'Premium Set',
        'Specialty Rolls',
        'Sushi Art',
        'Traditional Style',
        'Modern Fusion',
      ],
      descriptions: [
        'Signature Roll - najlepsze dzieło szefa',
        'Premium Selection - wybór najlepszych składników',
        'Fresh Nigiri - świeża rybka każdego dnia',
        'Maki Selection - rolki w różnych kombinacjach',
        'Artistic Presentation - sztuka na talerzu',
        'Chef\'s Special - specjalna propozycja szefa',
        'Gourmet Creation - kulinarne arcydzieło',
        'Deluxe Platter - luksusowe oprawianie',
        'Premium Set - zestaw premium do domu',
        'Specialty Rolls - specjalne rolki',
        'Sushi Art - sushi jako forma sztuki',
        'Traditional Style - tradycyjny styl przygotowania',
        'Modern Fusion - nowoczesne połączenia',
      ],
      closeButton: 'Zamknij',
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
