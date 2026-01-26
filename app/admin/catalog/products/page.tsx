"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProductsTab } from "@/components/admin/catalog/ProductsTab";

/**
 * Products Catalog Page - Каталог продуктов
 * 
 * Показывает справочник всех продуктов/ингредиентов для меню
 * Отличается от /admin/ingredients (Склад) тем, что это каталог, а не складские запасы
 * 
 * URL: /admin/catalog/products
 */
export default function ProductsCatalogPage() {
  const pathname = usePathname();

  useEffect(() => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('[ProductsCatalogPage] 📚 PAGE: Products Catalog');
    console.log('[ProductsCatalogPage] 🔗 Pathname:', pathname);
    console.log('[ProductsCatalogPage] 🌐 Window location:', typeof window !== 'undefined' ? window.location.href : 'SSR');
    console.log('[ProductsCatalogPage] ✅ Rendering ProductsTab component');
    console.log('[ProductsCatalogPage] 🎯 This is NOT the Warehouse page!');
    console.log('[ProductsCatalogPage] ⚠️ If you see FridgeList, something is wrong!');
    console.log('═══════════════════════════════════════════════════════');
  }, [pathname]);

  // Явная проверка пути
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/catalog/products')) {
    console.error('[ProductsCatalogPage] ❌ WRONG PATH! Expected /admin/catalog/products, got:', window.location.pathname);
  }

  return (
    <div className="w-full" data-page="products-catalog">
      <div style={{ display: 'none' }} data-test="products-catalog-page-loaded">
        Products Catalog Page Loaded
      </div>
      <ProductsTab />
    </div>
  );
}
