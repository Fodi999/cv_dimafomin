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
      // ✅ Keep URL as is - no need to change it
      // Clean URL by removing search params only
      window.history.replaceState({}, '', '/admin/catalog/recipes-list');
    }
  }, [searchParams]);

  return (
    <div className="w-full">
      <RecipesTab key={refreshKey} />
    </div>
  );
}
