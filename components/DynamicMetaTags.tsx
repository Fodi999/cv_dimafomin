"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dima-fomin.pl";

export default function DynamicMetaTags() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update document lang attribute
    document.documentElement.lang = language === "pl" ? "pl" : "uk";

    // Update canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const langPath = language === "pl" ? "/pl" : "/ua";
    
    if (canonicalLink) {
      canonicalLink.setAttribute("href", `${SITE_URL}${langPath}`);
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = `${SITE_URL}${langPath}`;
      document.head.appendChild(link);
    }

    // Update Open Graph locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute("content", language === "pl" ? "pl_PL" : "uk_UA");
    } else {
      ogLocale = document.createElement("meta");
      ogLocale.setAttribute("property", "og:locale");
      ogLocale.setAttribute("content", language === "pl" ? "pl_PL" : "uk_UA");
      document.head.appendChild(ogLocale);
    }

    // Update Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", `${SITE_URL}${langPath}`);
    } else {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      ogUrl.setAttribute("content", `${SITE_URL}${langPath}`);
      document.head.appendChild(ogUrl);
    }
  }, [language]);

  return null;
}
