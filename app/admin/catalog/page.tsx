"use client";

import { Package, ChefHat } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsTab } from "@/components/admin/catalog/ProductsTab";
import { RecipesTab } from "@/components/admin/catalog/RecipesTab";

/**
 * Каталог данных (Admin)
 * Единая точка входа для управления базой продуктов и рецептов
 * 
 * Архитектура: каждая вкладка - отдельный компонент с собственным состоянием
 */
export default function AdminCatalogPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Каталог данных</h2>
          <p className="text-muted-foreground">
            Управління базою продуктів та рецептів
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Продукти
          </TabsTrigger>
          <TabsTrigger value="recipes" className="gap-2">
            <ChefHat className="h-4 w-4" />
            Рецепти
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <ProductsTab />
        </TabsContent>
        
        <TabsContent value="recipes" className="space-y-4">
          <RecipesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
