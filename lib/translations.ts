export type Language = 'pl' | 'ua';

export const translations = {
  pl: {
    // Navigation
    nav: {
      home: 'Główna',
      about: 'O mnie',
      portfolio: 'Portfolio',
      skills: 'Umiejętności',
      experience: 'Doświadczenie',
      contact: 'Kontakt',
    },
    // Hero Section
    hero: {
      title: 'Dima Fomin — Szef Kuchni / Sushi Chef',
      subtitle: 'Otwieram nową gastronomię online — sztuka sushi od podstaw.',
      description: 'Tworzę sushi z pasją, precyzją i autentycznym smakiem Japonii.',
      ctaPrimary: 'Skontaktuj się',
      ctaSecondary: 'Zobacz Portfolio',
    },
    // About Section
    about: {
      title: 'O mnie',
      imageAlt: 'Dima Fomin przy pracy',
      intro: 'Jestem',
      name: 'Dima Fomin',
      paragraph1: 'profesjonalnym szefem kuchni z ponad 20-letnim doświadczeniem w tworzeniu autentycznych japońskich potraw i pracy w najlepszych restauracjach świata.',
      paragraph2: 'Moją pasję do sztuki kulinarnej rozwijałem pracując w renomowanych restauracjach w Polsce, Litwie, Estonii, Niemczech, Francji i Kanadzie, gdzie doskonaliłem techniki tradycyjne i nowoczesne podejście do prezentacji.',
      paragraph3: 'Każde danie, które tworzę, to połączenie precyzji, świeżości składników i estetyki. Jestem celowy, towarzyski, odporny na stres i pomysłowy. Specjalizuję się w opracowywaniu nowych produktów i szkoleniu zespołów.',
      quote: 'Moja filozofia: szacunek do tradycji, pasja do innowacji i niekończąca się dążenie do doskonałości w każdym kawałku. Wiem dużo o produktach i nieustannie się rozwijam.',
    },
    // Portfolio Section
    portfolio: {
      title: 'Portfolio',
      subtitle: 'Odkryj moje najlepsze kreacje - każde danie opowiada swoją historię',
      closeButton: 'Zamknij',
      items: [
        '01. Signature Roll',
        '02. Premium Selection',
        '03. Fresh Nigiri',
        '04. Maki Selection',
        '05. Artistic Presentation',
        '06. Chef\'s Special',
        '07. Gourmet Creation',
        '08. Deluxe Platter',
        '09. Premium Set',
        '10. Specialty Rolls',
        '11. Sushi Art',
        '12. Traditional Style',
        '13. Modern Fusion',
        '14. Elegant Presentation',
        '15. Masterpiece',
        '16. Creative Design',
        '17. Beautiful Plating',
        '18. Exquisite Taste',
      ],
    },
    // Skills Section
    skills: {
      title: 'Umiejętności',
      subtitle: 'Profesjonalne kompetencje kulinarne i zarządcze',
      viewDetails: 'Zobacz szczegóły',
      hideDetails: 'Ukryj szczegóły',
      proficiencyLevel: 'Poziom biegłości',
      competencyDetails: 'Szczegóły kompetencji',
      items: [
        {
          title: 'Nigiri & Sashimi',
          description: 'Mistrzowska obróbka ryb i tradycyjne techniki krojenia',
        },
        {
          title: 'Maki & Uramaki',
          description: 'Kreatywne rolowanie i innowacyjne kombinacje smaków',
        },
        {
          title: 'Prezentacja',
          description: 'Artystyczna aranżacja i estetyka japońska',
        },
        {
          title: 'Bezpieczeństwo żywności (HACCP)',
          description: 'Higiena, kontrola jakości i utrzymanie najwyższych standardów bezpieczeństwa',
        },
        {
          title: 'Szkolenie personelu',
          description: 'Prowadzenie szkoleń, wdrażanie nowych pracowników i nauczanie prawidłowej pracy z produktami',
        },
        {
          title: 'Tworzenie aplikacji i stron dla gastronomii',
          description: 'Projektowanie nowoczesnych stron i systemów dla restauracji, usprawniających komunikację i zamówienia',
        },
        {
          title: 'Tworzenie kart technologicznych',
          description: 'Opracowywanie receptur, gramatur, procesów produkcyjnych i dokumentacji HACCP',
        },
        {
          title: 'Zarządzanie kuchnią',
          description: 'Organizacja pracy zespołu, planowanie menu i optymalizacja procesów w kuchni',
        },
        {
          title: 'Kuchnia Fusion',
          description: 'Nowoczesne interpretacje i autorskie kreacje inspirowane kuchniami świata',
        },
      ],
    },
    // Experience Section
    experience: {
      title: 'Doświadczenie',
      subtitle: 'Międzynarodowa kariera w najlepszych restauracjach świata',
      items: [
        {
          company: 'Boulangerie Patisserie WAWEL',
          position: 'Kucharz',
          location: 'Montreal, Canada',
          period: 'Grudzień 2022 - Sierpień 2023',
          description: 'Praca w prestiżowej piekarni i cukierni. Przygotowanie wypieków i deserów według tradycyjnych receptur.',
        },
        {
          company: 'Bar Charlemagne',
          position: 'Kucharz - Owoce morza',
          location: 'Agde, Francja',
          period: 'Czerwiec 2022 - Listopad 2022',
          description: 'Specjalizacja w przygotowywaniu świeżych owoców morza. Praca z najwyższej jakości produktami w restauracji nad morzem.',
        },
        {
          company: 'FISH in HOUSE',
          position: 'Szef Kuchni',
          location: 'Dniepr, Ukraina',
          period: 'Czerwiec 2018 - Czerwiec 2022',
          description: 'Opracowywanie nowych produktów, kontrola jakości, zwiększanie trwałości produktów. Zakup urządzeń do procesów produkcyjnych, szkolenie personelu, HACCP, konfigurowanie procesów produkcyjnych.',
        },
        {
          company: 'Miód Malina',
          position: 'Kucharz',
          location: 'Zgorzelec, Polska',
          period: 'Maj 2017 - Maj 2018',
          description: 'Praca w autorskiej restauracji polskiej. Przygotowanie tradycyjnych i nowoczesnych dań kuchni polskiej.',
        },
        {
          company: 'Restauracje międzynarodowe',
          position: 'Kucharz',
          location: 'Litwa, Estonia, Niemcy',
          period: '2003 - 2017',
          description: 'Doświadczenie w różnych krajach europejskich. Praca z różnorodnymi kuchniami i kulturami kulinarnymi. Ukończenie szkoły zawodowej z wyróżnieniem.',
        },
      ],
    },
    // Contact Section
    contact: {
      title: 'Kontakt',
      subtitle: 'Szukasz doświadczonego kucharza? Skontaktuj się ze mną już dziś!',
      formTitle: 'Wyślij wiadomość',
      successMessage: '✓ Dziękuję za wiadomość! Skontaktuję się z Tobą wkrótce.',
      nameLabel: 'Twoje imię i nazwisko *',
      namePlaceholder: 'np. Anna Nowak',
      emailLabel: 'Twój email *',
      emailPlaceholder: 'twoj.email@restauracja.pl',
      messageLabel: 'Twoja wiadomość *',
      messagePlaceholder: 'Cześć Dima! Szukamy doświadczonego sushi chefa do naszej restauracji w...',
      sendButton: 'Wyślij wiadomość',
      sending: 'Wysyłanie...',
      connectTitle: 'Połącz się ze mną',
      connectSubtitle: 'Jestem otwarty na nowe możliwości współpracy w Polsce. Skontaktuj się ze mną przez preferowany kanał komunikacji.',
      instagram: 'Instagram',
      email: 'Email',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      whatsappAction: 'Napisz na WhatsApp',
      telegramAction: 'Napisz na Telegram',
    },
    // Footer
    footer: {
      title: 'Dima Fomin',
      subtitle: 'Professional Chef 🇵🇱',
      copyright: 'Wszelkie prawa zastrzeżone.',
      madeWith: 'Stworzone z',
      forPassion: 'dla pasji kulinarnej',
      keywords: 'Sushi Chef Polska | Sushi Master Warszawa | Praca Sushi Chef | Professional Japanese Chef Poland',
    },
  },
  ua: {
    // Navigation
    nav: {
      home: 'Головна',
      about: 'Про мене',
      portfolio: 'Портфоліо',
      skills: 'Навички',
      experience: 'Досвід',
      contact: 'Контакт',
    },
    // Hero Section
    hero: {
      title: 'Діма Фомін — Шеф-кухар / Суші-шеф',
      subtitle: 'Відкриваю нову онлайн-гастрономію — мистецтво суші з нуля.',
      description: 'Створюю суші з пристрастю, точністю та автентичним смаком Японії.',
      ctaPrimary: 'Зв\'яжіться зі мною',
      ctaSecondary: 'Дивитись портфоліо',
    },
    // About Section
    about: {
      title: 'Про мене',
      imageAlt: 'Діма Фомін за роботою',
      intro: 'Я',
      name: 'Діма Фомін',
      paragraph1: 'професійний шеф-кухар з понад 20-річним досвідом у створенні автентичних японських страв та роботі в найкращих ресторанах світу.',
      paragraph2: 'Свою пристрасть до кулінарного мистецтва я розвивав, працюючи в престижних ресторанах у Польщі, Литві, Естонії, Німеччині, Франції та Канаді, де вдосконалював традиційні техніки та сучасний підхід до презентації.',
      paragraph3: 'Кожна страва, яку я створюю, — це поєднання точності, свіжості інгредієнтів та естетики. Я цілеспрямований, товариський, стресостійкий та винахідливий. Спеціалізуюсь на розробці нових продуктів та навчанні команд.',
      quote: 'Моя філософія: повага до традицій, пристрасть до інновацій та безперервне прагнення до досконалості в кожному шматочку. Я багато знаю про продукти і постійно розвиваюся.',
    },
    // Portfolio Section
    portfolio: {
      title: 'Портфоліо',
      subtitle: 'Відкрийте мої найкращі творіння - кожна страва розповідає свою історію',
      closeButton: 'Закрити',
      items: [
        '01. Фірмовий рол',
        '02. Преміум-добірка',
        '03. Свіжі нігірі',
        '04. Добірка макі',
        '05. Артистична подача',
        '06. Спеціально від шефа',
        '07. Гурманське творіння',
        '08. Делюкс-плато',
        '09. Преміум-сет',
        '10. Фірмові роли',
        '11. Мистецтво суші',
        '12. Традиційний стиль',
        '13. Сучасна фузія',
        '14. Елегантна подача',
        '15. Шедевр',
        '16. Креативний дизайн',
        '17. Красива подача',
        '18. Вишуканий смак',
      ],
    },
    // Skills Section
    skills: {
      title: 'Навички',
      subtitle: 'Професійні кулінарні та управлінські компетенції',
      viewDetails: 'Дивитись деталі',
      hideDetails: 'Сховати деталі',
      proficiencyLevel: 'Рівень володіння',
      competencyDetails: 'Деталі компетенції',
      items: [
        {
          title: 'Нігірі та Сашимі',
          description: 'Майстерна обробка риби та традиційні техніки нарізання',
        },
        {
          title: 'Макі та Урамакі',
          description: 'Креативне скручування та інноваційні смакові комбінації',
        },
        {
          title: 'Презентація',
          description: 'Художня композиція та японська естетика',
        },
        {
          title: 'Безпека харчування (HACCP)',
          description: 'Гігієна, контроль якості та дотримання найвищих стандартів безпеки',
        },
        {
          title: 'Навчання персоналу',
          description: 'Проведення тренінгів, впровадження нових співробітників та навчання правильній роботі з продуктами',
        },
        {
          title: 'Створення застосунків і сайтів для гастрономії',
          description: 'Проектування сучасних сайтів і систем для ресторанів, що покращують комунікацію та замовлення',
        },
        {
          title: 'Створення технологічних карт',
          description: 'Розробка рецептур, вагових норм, виробничих процесів та документації HACCP',
        },
        {
          title: 'Управління кухнею',
          description: 'Організація роботи команди, планування меню та оптимізація процесів на кухні',
        },
        {
          title: 'Кухня Фьюжн',
          description: 'Сучасні інтерпретації та авторські креації, натхненні кухнями світу',
        },
      ],
    },
    // Experience Section
    experience: {
      title: 'Досвід',
      subtitle: 'Міжнародна кар\'єра в найкращих ресторанах світу',
      items: [
        {
          company: 'Boulangerie Patisserie WAWEL',
          position: 'Кухар',
          location: 'Монреаль, Канада',
          period: 'Грудень 2022 - Серпень 2023',
          description: 'Робота в престижній пекарні та кондитерській. Приготування випічки та десертів за традиційними рецептами.',
        },
        {
          company: 'Bar Charlemagne',
          position: 'Кухар - Морепродукти',
          location: 'Агд, Франція',
          period: 'Червень 2022 - Листопад 2022',
          description: 'Спеціалізація на приготуванні свіжих морепродуктів. Робота з продуктами найвищої якості в ресторані біля моря.',
        },
        {
          company: 'FISH in HOUSE',
          position: 'Шеф-кухар',
          location: 'Дніпро, Україна',
          period: 'Червень 2018 - Червень 2022',
          description: 'Розробка нових продуктів, контроль якості, підвищення терміну зберігання продуктів. Закупівля обладнання для виробничих процесів, навчання персоналу, HACCP, налаштування виробничих процесів.',
        },
        {
          company: 'Miód Malina',
          position: 'Кухар',
          location: 'Згожелець, Польща',
          period: 'Травень 2017 - Травень 2018',
          description: 'Робота в авторському польському ресторані. Приготування традиційних та сучасних страв польської кухні.',
        },
        {
          company: 'Міжнародні ресторани',
          position: 'Кухар',
          location: 'Литва, Естонія, Німеччина',
          period: '2003 - 2017',
          description: 'Досвід роботи в різних європейських країнах. Робота з різноманітними кухнями та кулінарними культурами. Закінчення професійної школи з відзнакою.',
        },
      ],
    },
    // Contact Section
    contact: {
      title: 'Контакт',
      subtitle: 'Шукаєте досвідченого кухаря? Зв\'яжіться зі мною вже сьогодні!',
      formTitle: 'Надіслати повідомлення',
      successMessage: '✓ Дякую за повідомлення! Я зв\'яжуся з вами найближчим часом.',
      nameLabel: 'Ваше ім\'я та прізвище *',
      namePlaceholder: 'напр. Анна Ковальська',
      emailLabel: 'Ваш email *',
      emailPlaceholder: 'vash.email@restoran.pl',
      messageLabel: 'Ваше повідомлення *',
      messagePlaceholder: 'Привіт, Діма! Ми шукаємо досвідченого суші-шефа для нашого ресторану в...',
      sendButton: 'Надіслати повідомлення',
      sending: 'Відправка...',
      connectTitle: 'Зв\'яжіться зі мною',
      connectSubtitle: 'Я відкритий до нових можливостей співпраці в Польщі. Зв\'яжіться зі мною через зручний канал комунікації.',
      instagram: 'Instagram',
      email: 'Email',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      whatsappAction: 'Написати в WhatsApp',
      telegramAction: 'Написати в Telegram',
    },
    // Footer
    footer: {
      title: 'Діма Фомін',
      subtitle: 'Професійний кухар 🇵🇱',
      copyright: 'Усі права захищені.',
      madeWith: 'Створено з',
      forPassion: 'для кулінарної пристрасті',
      keywords: 'Суші-шеф Польща | Суші-майстер Варшава | Робота Суші-шеф | Професійний японський кухар Польща',
    },
  },
} as const;

export type Translations = typeof translations[Language];
