// config/meta.ts - Конфігурація метаданих та SEO

export const META_CONFIG = {
  // Основна інформація про сайт
  site: {
    name: "Dima Fomin - Sushi Chef",
    shortName: "Dima Fomin",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dima-fomin.pl",
    domain: "dima-fomin.pl",
    email: "contact@dima-fomin.pl",
    phone: "+48 123 456 789",
  },

  // Соціальні мережі
  social: {
    instagram: "https://instagram.com/fodifood",
    telegram: "https://t.me/fodi999",
    whatsapp: "https://wa.me/48123456789",
    youtube: "https://youtube.com/@dimafomin",
    facebook: "https://facebook.com/dimafomin",
  },

  // Дефолтні зображення
  images: {
    defaultOg: "/preview.jpg",
    logo: "/icon-512x512.png",
    favicon: "/icon-192x192.svg",
    apple: "/icon-180x180.png",
  },

  // Теги верифікації
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
  },

  // Аналітика та трекінг
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID || "",
    facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
    yandexMetrikaId: process.env.NEXT_PUBLIC_YM_ID || "",
  },

  // PWA конфігурація
  pwa: {
    themeColor: "#F97316", // orange-500
    backgroundColor: "#FFFFFF",
    display: "standalone",
    orientation: "portrait",
  },

  // Robots.txt налаштування
  robots: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dima-fomin.pl"}/sitemap.xml`,
  },
};

// Функція для отримання повного URL
export function getAbsoluteUrl(path: string = ""): string {
  const baseUrl = META_CONFIG.site.url;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

// Функція для отримання URL зображення
export function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return getAbsoluteUrl(imagePath);
}

// Функція для генерації canonical URL
export function getCanonicalUrl(path: string, language?: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const langPrefix = language && language !== "pl" ? `/${language}` : "";
  return getAbsoluteUrl(`${langPrefix}${cleanPath}`);
}

// Структуровані дані для організації
export const ORGANIZATION_LD_JSON = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: META_CONFIG.site.name,
  url: META_CONFIG.site.url,
  logo: getImageUrl(META_CONFIG.images.logo),
  sameAs: Object.values(META_CONFIG.social).filter(Boolean),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: META_CONFIG.site.phone,
    contactType: "customer service",
    email: META_CONFIG.site.email,
  },
};

// Структуровані дані для WebSite
export const WEBSITE_LD_JSON = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: META_CONFIG.site.name,
  url: META_CONFIG.site.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${META_CONFIG.site.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// Шаблони для автогенерації title
export const TITLE_TEMPLATES = {
  default: (title: string) => `${title} | ${META_CONFIG.site.name}`,
  recipe: (title: string) => `${title} - Рецепт | ${META_CONFIG.site.shortName}`,
  profile: (name: string) => `${name} - Профіль | ${META_CONFIG.site.shortName}`,
  academy: (title: string) => `${title} | Академія Суші`,
  market: (title: string) => `${title} | Маркетплейс Рецептів`,
  chat: () => `AI Шеф-Помічник | ${META_CONFIG.site.shortName}`,
};

// Шаблони для автогенерації description
export const DESCRIPTION_TEMPLATES = {
  recipe: (recipeName: string, author?: string, time?: number) =>
    `Дізнайтеся як приготувати ${recipeName}${author ? ` від ${author}` : ""}. ${time ? `Час приготування: ${time} хв. ` : ""}Покроковий рецепт з фото та інструкціями.`,
  
  profile: (userName: string, postCount?: number) =>
    `Профіль ${userName} в Академії Суші. ${postCount ? `${postCount} публікацій. ` : ""}Рецепти, курси та досягнення.`,
  
  course: (courseName: string, duration?: string) =>
    `Курс "${courseName}"${duration ? ` - ${duration}` : ""}. Навчайтеся кулінарії онлайн, отримуйте сертифікати та токени.`,
};
