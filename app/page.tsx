/**
 * ✅ Home Page - Server Component with SSR
 * 
 * SEO Strategy:
 * 1. Server-side i18n → Google sees translated content immediately
 * 2. Metadata API → Perfect meta tags in HTML
 * 3. Pure SSR → No "use client", full indexability
 * 4. Client components → Only for interactive parts (StatsCounter)
 * 
 * What Google sees:
 * <h1>Welcome to ChefOS</h1> ← In initial HTML! ✅
 * <h2>Think like a professional chef.</h2> ← Indexed! ✅
 * <p>AI helps you make decisions...</p> ← Crawlable! ✅
 */

import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import DynamicMetaTags from "@/components/DynamicMetaTags";
import StructuredData from "@/components/StructuredData";
import DevelopmentModal from "@/components/DevelopmentModal";
import HomeContent from "@/components/home/HomeContent";
import { getServerLanguage } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/getDictionary";

// ✅ SSR Metadata for SEO (Google sees this immediately)
export const metadata: Metadata = {
  title: "Dmitrij Fomin - Full-Stack Developer & AI Chef Assistant Creator",
  description: "Full-stack developer specializing in React, Next.js, TypeScript, and AI-powered cooking assistants. Building ChefOS - an intelligent recipe platform.",
  keywords: [
    "Dmitrij Fomin",
    "Full-Stack Developer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "AI Assistant",
    "ChefOS",
    "Recipe Platform",
    "Web Development",
    "Poland Developer"
  ],
  authors: [{ name: "Dmitrij Fomin" }],
  openGraph: {
    title: "Dmitrij Fomin - Full-Stack Developer",
    description: "Full-stack developer specializing in React, Next.js, TypeScript, and AI-powered cooking assistants.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["pl_PL", "ru_RU"],
  },
};

// ✅ Async Server Component - loads translations server-side
export default async function HomePage() {
  // 🌍 Get user language from cookies (server-side)
  const lang = await getServerLanguage();
  
  // 📖 Load dictionary server-side (lazy loaded per language)
  const dict = await getDictionary(lang);
  
  // 🎯 SEO content is now in props → Google can index it!
  return (
    <>
      <DynamicMetaTags />
      <StructuredData />
      <DevelopmentModal />
      
      {/* Navigation */}
      <PublicHeader />
      
      {/* 
        ✅ Client component receives server-side translated content
        Google sees the content in initial HTML (SSR)
        StatsCounter is client-side (interactive), but non-SEO content
      */}
      <HomeContent
        title={dict.home.hero.title}
        subtitle={dict.home.hero.subtitle}
        description={dict.home.hero.description}
        details={dict.home.hero.details}
      />
    </>
  );
}
