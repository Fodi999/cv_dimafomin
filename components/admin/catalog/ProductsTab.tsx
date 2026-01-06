"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIngredients, useIngredientActions, Ingredient } from "@/hooks/useIngredients";
import { IngredientsTable } from "@/components/admin/catalog/ingredients/IngredientsTable";
import { IngredientsFilters, type CategoryFilter } from "@/components/admin/catalog/ingredients/IngredientsFilters";
import { IngredientFormModal } from "@/components/admin/catalog/ingredients/IngredientFormModal";
import { IngredientDeleteDialog } from "@/components/admin/catalog/ingredients/IngredientDeleteDialog";
import { AddIngredientDialog } from "@/components/admin/catalog/ingredients/AddIngredientDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Products Tab - Manages ingredients catalog
 * Features:
 * - Search by name (any language) with 300ms debounce
 * - Filter by category
 * - Pagination
 * - Create/Edit/Delete ingredients with AI translation
 */
export function ProductsTab() {
  const { t } = useLanguage();
  const [localSearch, setLocalSearch] = useState("");
  const [localCategory, setLocalCategory] = useState<CategoryFilter>("all");
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

  // Ensure ingredients is always an array
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  console.log('[ProductsTab] Debug:', {
    ingredients: safeIngredients,
    ingredientsLength: safeIngredients.length,
    isLoading,
    meta,
  });

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.admin.catalog.products.title}</CardTitle>
              <CardDescription>
                {t.admin.catalog.products.subtitle} ({meta?.total || 0} {t.admin.catalog.products.table.recipes})
              </CardDescription>
            </div>
            <AddIngredientDialog onCreated={refetch} />
          </div>
        </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <IngredientsFilters
          searchQuery={localSearch}
          onSearchChange={(value) => {
            setLocalSearch(value);
            updateFilters({ page: 1 }); // Reset to page 1 on search
          }}
          categoryFilter={localCategory}
          onCategoryChange={(value) => {
            setLocalCategory(value);
            updateFilters({ 
              category: value === "all" ? "all" : value,
              page: 1 
            });
          }}
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
          {t.common.showing}: {ingredients.length} {t.common.of} {meta.total}
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

      {ingredientToDelete && (
        <IngredientDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDeleteProduct}
          ingredientName={ingredientToDelete.name}
          usageCount={ingredientToDelete.usageCount}
        />
      )}
    </div>
  );
}
