"use client";

import { useState } from "react";
import { Package, ChefHat } from "lucide-react";
import { ProductsTab } from "@/components/admin/catalog/ProductsTab";
import { RecipesTab } from "@/components/admin/catalog/RecipesTab";

type Tab = "products" | "recipes";

/**
 * 📚 Каталог данных (Admin)
 * Единая точка входа для управления базой продуктов и рецептов
 * 
 * Архитектура: каждая вкладка - отдельный компонент с собственным состоянием
 * Это предотвращает render-loops и излишнюю загрузку данных
 */
export default function AdminCatalogPage() {
  const [activeTab, setActiveTab] = useState<Tab>("products");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Каталог данных
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Управління базою продуктів та рецептів
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`
              flex items-center gap-2 px-4 py-2 border-b-2 transition-colors
              ${activeTab === "products"
                ? "border-primary text-primary font-medium"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }
            `}
          >
            <Package className="w-4 h-4" />
            Продукти
          </button>
          <button
            onClick={() => setActiveTab("recipes")}
            className={`
              flex items-center gap-2 px-4 py-2 border-b-2 transition-colors
              ${activeTab === "recipes"
                ? "border-primary text-primary font-medium"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }
            `}
          >
            <ChefHat className="w-4 h-4" />
            Рецепти
          </button>
        </div>
      </div>

      {/* Tab Content - Only render active tab component */}
      {activeTab === "products" && <ProductsTab />}
      {activeTab === "recipes" && <RecipesTab />}
    </div>
  );
}
