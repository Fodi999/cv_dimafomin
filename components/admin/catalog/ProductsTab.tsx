"use client";

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIngredients, useIngredientActions, Ingredient } from "@/hooks/useIngredients";
import { IngredientsTable } from "@/components/admin/catalog/ingredients/IngredientsTable";
import { IngredientFormModal } from "@/components/admin/catalog/ingredients/IngredientFormModal";
import { IngredientDeleteDialog } from "@/components/admin/catalog/ingredients/IngredientDeleteDialog";

/**
 * Products Tab - Manages ingredients catalog
 * Only loads data when tab is active
 */
export function ProductsTab() {
  const { ingredients, meta, isLoading, filters, updateFilters, refetch } = useIngredients();
  const { createIngredient, updateIngredient, deleteIngredient } = useIngredientActions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);

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
    } else {
      const success = await createIngredient(data as Omit<Ingredient, "id">);
      if (success) {
        setIsFormOpen(false);
        refetch();
      }
    }
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
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button onClick={handleCreateProduct} className="gap-2">
            <Plus className="w-4 h-4" />
            Додати продукт
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Пошук продукту..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
        />

        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={filters.category}
          onChange={(e) => updateFilters({ category: e.target.value, page: 1 })}
        >
          <option value="">Всі категорії</option>
          <option value="vegetables">🥕 Овочі</option>
          <option value="fruits">🍎 Фрукти</option>
          <option value="meat">🥩 М'ясо</option>
          <option value="fish">🐟 Риба</option>
          <option value="dairy">🥛 Молочні</option>
          <option value="grains">🌾 Зернові</option>
          <option value="spices">🌶️ Спеції</option>
          <option value="other">📦 Інше</option>
        </select>
      </div>

      {/* Table */}
      <IngredientsTable
        ingredients={ingredients}
        isLoading={isLoading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Count */}
      {meta && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Показано: {ingredients.length} з {meta.total}
        </div>
      )}

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
