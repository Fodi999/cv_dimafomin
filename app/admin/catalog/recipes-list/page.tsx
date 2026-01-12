"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RecipesTab } from "@/components/admin/catalog/RecipesTab";

/**
 * Recipes Catalog Page
 * Manage recipes catalog with filters and sorting
 */
export default function RecipesCatalogPage() {
  const searchParams = useSearchParams();
  const [refreshKey, setRefreshKey] = useState<number>(0);

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
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recipes Catalog</h1>
        <p className="text-muted-foreground mt-2">
          Manage recipes with AI-powered tools
        </p>
      </div>
      
      <RecipesTab key={refreshKey} />
    </div>
  );
}
