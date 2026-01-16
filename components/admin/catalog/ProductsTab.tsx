"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIngredients, useIngredientActions, Ingredient } from "@/hooks/useIngredients";
import { IngredientsTable } from "@/components/admin/catalog/ingredients/IngredientsTable";
import { IngredientsFilters, type CategoryFilter, type SortOption } from "@/components/admin/catalog/ingredients/IngredientsFilters";
import { IngredientFormModal } from "@/components/admin/catalog/ingredients/IngredientFormModal";
import { IngredientDeleteDialog } from "@/components/admin/catalog/ingredients/IngredientDeleteDialog";
import { AddIngredientDialog } from "@/components/admin/catalog/ingredients/AddIngredientDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Products Tab - Manages ingredients catalog
 * Features:
 * - Search by name (any language) with 300ms debounce
 * - Filter by culinary category (meat, fish, egg, etc.)
 * - Pagination
 * - Create/Edit/Delete ingredients with AI translation
 */
export function ProductsTab() {
  const { t } = useLanguage();
  const [localSearch, setLocalSearch] = useState("");
  const [localCategory, setLocalCategory] = useState<CategoryFilter>("all");
  const [localSort, setLocalSort] = useState<SortOption>("newest"); // ✅ Default: newest first
  const debouncedSearch = useDebounce(localSearch, 300);
  
  const { ingredients, meta, isLoading, filters, updateFilters, refetch } = useIngredients();
  const { updateIngredient, deleteIngredient } = useIngredientActions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);

  // Apply debounced search to filters
  useEffect(() => {
    updateFilters({ 
      search: debouncedSearch,
      page: 1 
    });
  }, [debouncedSearch]);

  // Apply category filter
  useEffect(() => {
    updateFilters({ 
      category: localCategory === "all" ? "all" : localCategory,
      page: 1 
    });
  }, [localCategory]);

  // Apply sort option
  useEffect(() => {
    updateFilters({ 
      sort: localSort,
      page: 1 
    });
  }, [localSort]);

  // Ensure ingredients is always an array
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  const handleCreateProduct = () => {
    setEditingIngredient(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (data: Partial<Ingredient>) => {
    if (editingIngredient) {
      const success = await updateIngredient(editingIngredient.id, data);
      if (success) {
        setIsFormOpen(false);
        refetch();
      }
    }
    // Note: Create is handled by AddIngredientDialog component
  };

  const handleDeleteProduct = (ingredient: Ingredient) => {
    setIngredientToDelete(ingredient);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!ingredientToDelete) return;
    const success = await deleteIngredient(ingredientToDelete.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setIngredientToDelete(null);
      refetch();
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg">{t.admin.catalog.products.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t.admin.catalog.products.subtitle} ({meta?.total || 0} {t.admin.catalog.products.table.products})
              </CardDescription>
            </div>
            <AddIngredientDialog onCreated={refetch} />
          </div>
        </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
        {/* Filters */}
        <IngredientsFilters
          searchQuery={localSearch}
          onSearchChange={setLocalSearch}
          categoryFilter={localCategory}
          onCategoryChange={setLocalCategory}
          sortBy={localSort}
          onSortChange={setLocalSort}
        />

        {/* Table */}
        <IngredientsTable
          ingredients={safeIngredients}
          isLoading={isLoading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

      {/* Count */}
      {meta && (
        <div className="text-sm text-muted-foreground text-center">
          {t.common.showing}: {safeIngredients.length} {t.common.of} {meta.total}
        </div>
      )}
      </CardContent>
    </Card>

      {/* Modals */}
      <IngredientFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        ingredient={editingIngredient}
        onSave={handleSaveProduct}
      />

      <IngredientDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDeleteProduct}
        ingredient={ingredientToDelete}
      />
    </div>
  );
}
