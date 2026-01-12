"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Catalog redirect page
 * Redirects to products or recipes based on URL params
 */
export default function AdminCatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const refreshParam = searchParams.get('refresh');
    
    if (tabParam === 'recipes') {
      // Redirect to recipes with refresh param
      if (refreshParam) {
        router.replace(`/admin/catalog/recipes-list?refresh=${refreshParam}`);
      } else {
        router.replace('/admin/catalog/recipes-list');
      }
    } else {
      // Default: redirect to products
      router.replace('/admin/catalog/products');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
