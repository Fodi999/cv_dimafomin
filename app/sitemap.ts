import { MetadataRoute } from "next";

/**
 * Sitemap Configuration 2025
 * 
 * 🎯 CANONICAL DOMAIN: https://dima-fomin.pl
 * 
 * Google will index:
 * - Main page (PL by default)
 * - /pl (Polish)
 * - /ua (Ukrainian)
 * 
 * Submit to Google Search Console:
 * https://dima-fomin.pl/sitemap.xml
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const CANONICAL_DOMAIN = "https://dima-fomin.pl";

  return [
    {
      url: CANONICAL_DOMAIN,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          pl: `${CANONICAL_DOMAIN}/pl`,
          uk: `${CANONICAL_DOMAIN}/ua`,
        },
      },
    },
    {
      url: `${CANONICAL_DOMAIN}/pl`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${CANONICAL_DOMAIN}/ua`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
