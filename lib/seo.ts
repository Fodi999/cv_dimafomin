import type { Metadata } from "next";
import type { Language } from "./translations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dima-fomin.pl";

export const seoConfig = {
  pl: {
    title: "Dima Fomin — Profesjonalny Sushi Chef w Polsce | Doświadczony Kucharz Gdańsk",
    description:
      "Dima Fomin — profesjonalny sushi chef z ponad 20-letnim doświadczeniem. Tworzę autentyczne japońskie sushi, prowadzę szkolenia kulinarne i projektuję menu dla restauracji w Polsce i Europie.",
    keywords: [
      "sushi chef Polska",
      "sushi master Gdańsk",
      "kucharz japoński",
      "szef kuchni",
      "kurs sushi",
      "sushi Gdańsk",
      "kuchnia japońska Polska",
      "profesjonalny kucharz",
      "szkolenia kulinarne",
      "projektowanie menu",
      "HACCP",
      "Dima Fomin",
    ],
    locale: "pl_PL",
    ogTitle: "Dima Fomin — Profesjonalny Sushi Chef w Polsce",
    ogDescription:
      "Sushi chef z Gdańska, 20+ lat doświadczenia, autorskie menu, szkolenia i kuchnia fusion.",
  },
  ua: {
    title: "Діма Фомін — Професійний суші-шеф у Польщі | Автор сучасної японської кухні",
    description:
      "Діма Фомін — суші-шеф із понад 20-річним досвідом. Створюю авторські суші, навчаю команди та розробляю меню для ресторанів у Польщі, Франції, Канаді та Україні.",
    keywords: [
      "суші шеф Польща",
      "суші майстер Гданськ",
      "японська кухня",
      "професійний кухар",
      "шеф суші",
      "суші тренінги",
      "створення меню",
      "sushi chef Poland",
      "кулінарні тренінги",
      "авторські суші",
      "HACCP",
      "Діма Фомін",
    ],
    locale: "uk_UA",
    ogTitle: "Діма Фомін — Професійний суші-шеф у Польщі",
    ogDescription:
      "20+ років досвіду, автентична японська кухня та сучасні авторські суші.",
  },
};

export function getMetadata(language: Language): Metadata {
  const config = seoConfig[language];
  const langPath = language === "pl" ? "/pl" : "/ua";

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: [{ name: "Dima Fomin" }],
    creator: "Dima Fomin",
    publisher: "Dima Fomin",
    
    alternates: {
      canonical: `${SITE_URL}${langPath}`,
      languages: {
        pl: `${SITE_URL}/pl`,
        uk: `${SITE_URL}/ua`,
        "x-default": SITE_URL,
      },
    },

    openGraph: {
      type: "website",
      locale: config.locale,
      url: `${SITE_URL}${langPath}`,
      title: config.ogTitle,
      description: config.ogDescription,
      siteName: "Dima Fomin - Sushi Chef",
      images: [
        {
          url: `${SITE_URL}/preview.jpg`,
          width: 1200,
          height: 630,
          alt: "Dima Fomin - Professional Sushi Chef",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: config.ogTitle,
      description: config.ogDescription,
      images: [`${SITE_URL}/preview.jpg`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    verification: {
      google: "your-google-verification-code-here",
    },

    manifest: "/manifest.json",

    icons: {
      icon: [
        { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
        { url: "/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      ],
    },
  };
}

// Schema.org structured data for Person
export function getPersonSchema(language: Language) {
  const isPolish = language === "pl";
  const langPath = language === "pl" ? "/pl" : "/ua";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: isPolish ? "Dima Fomin" : "Діма Фомін",
    jobTitle: isPolish ? "Sushi Chef" : "Суші-шеф",
    url: `${SITE_URL}${langPath}`,
    sameAs: [
      "https://instagram.com/fodifood",
      "https://t.me/fodi999",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Dima Fomin Culinary Studio",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: isPolish ? "Gdańsk" : "Гданськ",
      addressCountry: "PL",
    },
    description: isPolish
      ? "Profesjonalny sushi chef z ponad 20-letnim doświadczeniem w Polsce i Europie."
      : "Професійний суші-шеф із Польщі, який створює авторські суші та сучасну японську кухню.",
    knowsAbout: [
      "Sushi",
      "Japanese Cuisine",
      "Culinary Training",
      "Menu Design",
      "HACCP",
      "Food Safety",
    ],
    alumniOf: isPolish
      ? "Profesjonalne szkolenia kulinarne"
      : "Професійні кулінарні тренінги",
  };
}

// Schema.org for BreadcrumbList
export function getBreadcrumbSchema(language: Language) {
  const isPolish = language === "pl";
  const langPath = language === "pl" ? "/pl" : "/ua";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isPolish ? "Strona główna" : "Головна",
        item: `${SITE_URL}${langPath}`,
      },
    ],
  };
}

// ============================================
// AUTO-GENERATED METADATA FOR DYNAMIC PAGES
// ============================================

interface PageMetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

/**
 * Генерує метадані для динамічних сторінок (рецепти, профілі, академія)
 */
export function generatePageMetadata(
  config: PageMetadataConfig,
  language: Language = "pl"
): Metadata {
  const { title, description, keywords = [], image, type = "website", noIndex = false } = config;
  const langPath = language === "pl" ? "/pl" : "/ua";
  const fullTitle = `${title} | Dima Fomin`;

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, ...seoConfig[language].keywords],
    
    alternates: {
      canonical: `${SITE_URL}${langPath}`,
      languages: {
        pl: `${SITE_URL}/pl`,
        uk: `${SITE_URL}/ua`,
        "x-default": SITE_URL,
      },
    },

    openGraph: {
      type,
      locale: seoConfig[language].locale,
      url: `${SITE_URL}${langPath}`,
      title: fullTitle,
      description,
      siteName: "Dima Fomin - Sushi Chef",
      images: image ? [
        {
          url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: image ? [image.startsWith("http") ? image : `${SITE_URL}${image}`] : undefined,
    },

    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Метадані для сторінок академії
 */
export function getAcademyMetadata(language: Language = "pl"): Metadata {
  const config = {
    pl: {
      title: "Академія Сушi | Навчання та рецепти",
      description: "Безкоштовні курси суші, рецепти від професійних шефів, спільнота кулінарів та сертифікати",
      keywords: ["навчання суші", "курси кулінарії", "рецепти онлайн", "академія суші"],
    },
    ua: {
      title: "Академія Сушi | Навчання та рецепти",
      description: "Безкоштовні курси суші, рецепти від професійних шефів, спільнота кулінарів та сертифікати",
      keywords: ["навчання суші", "курси кулінарії", "рецепти онлайн", "академія суші"],
    },
  };

  return generatePageMetadata(config[language], language);
}

/**
 * Метадані для сторінки маркетплейсу
 */
export function getMarketMetadata(language: Language = "pl"): Metadata {
  const config = {
    pl: {
      title: "Маркетплейс Рецептів | Купити та продати рецепти",
      description: "Купуйте унікальні авторські рецепти від професійних шефів. Продавайте свої рецепти та заробляйте токени",
      keywords: ["купити рецепти", "продати рецепти", "маркетплейс кулінарії", "авторські рецепти"],
    },
    ua: {
      title: "Маркетплейс Рецептів | Купити та продати рецепти",
      description: "Купуйте унікальні авторські рецепти від професійних шефів. Продавайте свої рецепти та заробляйте токени",
      keywords: ["купити рецепти", "продати рецепти", "маркетплейс кулінарії", "авторські рецепти"],
    },
  };

  return generatePageMetadata(config[language], language);
}

/**
 * Метадані для сторінки AI чату
 */
export function getChatMetadata(language: Language = "pl"): Metadata {
  const config = {
    pl: {
      title: "AI Шеф-Помічник | Генерація рецептів з AI",
      description: "Створюйте унікальні рецепти за допомогою AI шефа Діми. Завантажте фото страви або опишіть бажання - отримайте деталізований рецепт",
      keywords: ["AI рецепти", "генерація рецептів", "AI шеф", "рецепти онлайн", "чат кулінарія"],
      noIndex: true, // Чат - особиста сторінка, не індексуємо
    },
    ua: {
      title: "AI Шеф-Помічник | Генерація рецептів з AI",
      description: "Створюйте унікальні рецепти за допомогою AI шефа Діми. Завантажте фото страви або опишіть бажання - отримайте деталізований рецепт",
      keywords: ["AI рецепти", "генерація рецептів", "AI шеф", "рецепти онлайн", "чат кулінарія"],
      noIndex: true,
    },
  };

  return generatePageMetadata(config[language], language);
}

/**
 * Метадані для сторінки профілю користувача
 */
export function getProfileMetadata(
  userName?: string,
  language: Language = "pl",
  isOwn: boolean = false
): Metadata {
  const config = {
    pl: {
      title: isOwn ? "Мій Профіль" : `${userName || "Профіль користувача"}`,
      description: isOwn 
        ? "Керуйте своїм профілем, переглядайте токени, публікації та збережені рецепти"
        : `Профіль користувача ${userName || ""}. Публікації, рецепти та активність в академії`,
      noIndex: true, // Профілі не індексуємо для приватності
    },
    ua: {
      title: isOwn ? "Мій Профіль" : `${userName || "Профіль користувача"}`,
      description: isOwn 
        ? "Керуйте своїм профілем, переглядайте токени, публікації та збережені рецепти"
        : `Профіль користувача ${userName || ""}. Публікації, рецепти та активність в академії`,
      noIndex: true,
    },
  };

  return generatePageMetadata(config[language], language);
}

/**
 * Метадані для конкретного рецепту (автогенерація)
 */
export function getRecipeMetadata(
  recipe: {
    title: string;
    description?: string;
    imageUrl?: string;
    author?: string;
    cookingTime?: number;
    difficulty?: string;
  },
  language: Language = "pl"
): Metadata {
  const { title, description, imageUrl, author, cookingTime, difficulty } = recipe;
  
  const fullDescription = description || `Рецепт ${title}${author ? ` від ${author}` : ""}${cookingTime ? `. Час приготування: ${cookingTime} хв` : ""}${difficulty ? `. Складність: ${difficulty}` : ""}`;

  return generatePageMetadata({
    title,
    description: fullDescription,
    keywords: [
      title.toLowerCase(),
      "рецепт",
      difficulty || "",
      author || "",
      "кулінарія",
      "академія суші",
    ].filter(Boolean),
    image: imageUrl,
    type: "article",
  }, language);
}

/**
 * Генерує Schema.org для рецепту
 */
export function getRecipeSchema(recipe: {
  title: string;
  description?: string;
  imageUrl?: string;
  author?: string;
  cookingTime?: number;
  ingredients?: Array<{ name: string; quantity?: string; unit?: string }>;
  steps?: string[];
  servings?: number;
  calories?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.imageUrl ? [recipe.imageUrl] : undefined,
    author: recipe.author ? {
      "@type": "Person",
      name: recipe.author,
    } : undefined,
    prepTime: recipe.cookingTime ? `PT${recipe.cookingTime}M` : undefined,
    recipeIngredient: recipe.ingredients?.map(ing => 
      `${ing.quantity || ""} ${ing.unit || ""} ${ing.name}`.trim()
    ),
    recipeInstructions: recipe.steps?.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
    recipeYield: recipe.servings ? `${recipe.servings} порцій` : undefined,
    nutrition: recipe.calories ? {
      "@type": "NutritionInformation",
      calories: `${recipe.calories} калорій`,
    } : undefined,
  };
}

/**
 * Генерує Schema.org для організації/академії
 */
export function getOrganizationSchema(language: Language = "pl") {
  const isPolish = language === "pl";

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: isPolish ? "Akademia Sushi Dima Fomin" : "Академія Суші Діма Фомін",
    url: `${SITE_URL}/academy`,
    logo: `${SITE_URL}/icon-512x512.png`,
    description: isPolish
      ? "Platforma edukacyjna z kursami sushi, przepisami i szkoleniami kulinarnymi"
      : "Освітня платформа з курсами суші, рецептами та кулінарними тренінгами",
    founder: {
      "@type": "Person",
      name: "Dima Fomin",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gdańsk",
      addressCountry: "PL",
    },
  };
}

/**
 * Метадані за замовчуванням (fallback)
 */
export function getDefaultMetadata(language: Language = "pl"): Metadata {
  return getMetadata(language);
}
