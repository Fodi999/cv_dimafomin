"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyEntry() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950 dark:via-pink-900 dark:to-red-950">
      {/* Content - Centered */}
      <div className="container max-w-3xl mx-auto px-4 text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            {t.journey.screen6.title}
            <br />
            {t.journey.screen6.titleLine2}
          </h1>
        </div>

        {/* CTA */}
        <div className="pt-12">
          <Button
            size="lg"
            onClick={() => window.location.href = '/auth'}
            className="group text-xl px-12 py-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 animate-soft-pulse"
          >
            {t.journey.screen6.cta}
            <LogIn className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
