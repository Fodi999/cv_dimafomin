import { MetadataRoute } from "next";

/**
 * Robots.txt Configuration 2025
 * 
 * 🎯 CANONICAL DOMAIN: https://dima-fomin.pl
 * 
 * Dynamic robots.txt generation (Next.js App Router method)
 * Accessible at: https://dima-fomin.pl/robots.txt
 * 
 * Submit sitemap to Google Search Console:
 * https://dima-fomin.pl/sitemap.xml
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // No disallowed paths - all pages should be indexed
    },
    sitemap: "https://dima-fomin.pl/sitemap.xml",
  };
}
