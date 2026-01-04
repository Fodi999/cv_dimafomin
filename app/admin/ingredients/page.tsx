"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIngredients, useIngredientActions, Ingredient } from "@/hooks/useIngredients";
import { IngredientsTable } from "@/components/admin/ingredients/IngredientsTable";
import { IngredientsFilters } from "@/components/admin/ingredients/IngredientsFilters";
import { IngredientFormModal } from "@/components/admin/ingredients/IngredientFormModal";
import { IngredientDeleteDialog } from "@/components/admin/ingredients/IngredientDeleteDialog";

/**
 * 🥬 Admin Ingredients Page
 * Единый каталог продуктов для всей системы
 */
export default function AdminIngredientsPage() {
  const { ingredients, meta, isLoading, filters, updateFilters, refetch } = useIngredients();
  const { createIngredient, updateIngredient, deleteIngredient } = useIngredientActions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);

  const handleCreate = () => {
    setEditingIngredient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsFormOpen(true);
  };

  const handleSave = async (data: Omit<Ingredient, "id">) => {
    let success = false;

    if (editingIngredient) {
      // Update existing
      success = await updateIngredient(editingIngredient.id, data);
    } else {
      // Create new
      success = await createIngredient(data);
    }

    if (success) {
      setIsFormOpen(false);
      setEditingIngredient(null);
      refetch();
    }
  };

  const handleDelete = (ingredient: Ingredient) => {
    setIngredientToDelete(ingredient);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!ingredientToDelete) return;

    const success = await deleteIngredient(ingredientToDelete.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setIngredientToDelete(null);
      refetch();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Інгредієнти
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Керуйте базою продуктів системи
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Новий інгредієнт
        </Button>
      </div>

      {/* Filters */}
      <IngredientsFilters
        searchQuery={filters.search}
        onSearchChange={(value) => updateFilters({ search: value, page: 1 })}
        categoryFilter={filters.category}
        onCategoryChange={(value) => updateFilters({ category: value, page: 1 })}
      />

      {/* Table */}
      <IngredientsTable
        ingredients={ingredients}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination Info */}
      {meta && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Показано {ingredients.length} з {meta.total} інгредієнтів
        </div>
      )}

      {/* Form Modal */}
      <IngredientFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        ingredient={editingIngredient}
        onSave={handleSave}
      />

      {/* Delete Dialog */}
      {ingredientToDelete && (
        <IngredientDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          ingredientName={ingredientToDelete.name}
          usageCount={ingredientToDelete.usageCount}
        />
      )}
    </div>
  );
}
