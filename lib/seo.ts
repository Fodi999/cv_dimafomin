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
