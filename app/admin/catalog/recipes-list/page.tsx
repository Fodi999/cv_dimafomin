"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RecipesTab } from "@/components/admin/catalog/RecipesTab";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Recipes Catalog Page
 * Manage recipes catalog with filters and sorting
 */
export default function RecipesCatalogPage() {
  const searchParams = useSearchParams();
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const { t } = useLanguage();

  useEffect(() => {
    // Check for refresh parameter (from recipe creation)
    const refreshParam = searchParams.get('refresh');
    if (refreshParam) {
      setRefreshKey(Date.now());
      // Clean URL without params
      window.history.replaceState({}, '', '/admin/catalog/recipes');
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          {t.admin.catalog.recipes.pageTitle}
        </h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          {t.admin.catalog.recipes.pageSubtitle}
        </p>
      </div>
      
      <RecipesTab key={refreshKey} />
    </div>
  );
}
