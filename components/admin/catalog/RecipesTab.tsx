"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminRecipes, useAdminRecipeActions, Recipe } from "@/hooks/useAdminRecipes";
import { RecipesTable } from "@/components/admin/catalog/recipes/RecipesTable";
import { RecipeViewDialog } from "@/components/admin/catalog/recipes/RecipeViewDialog";
import Link from "next/link";

/**
 * Recipes Tab - Manages recipes catalog
 * Only loads data when tab is active
 */
export function RecipesTab() {
  const router = useRouter();
  const { 
    recipes, 
    meta, 
    isLoading, 
    filters, 
    updateFilters,
    refetch 
  } = useAdminRecipes();
  const { deleteRecipe } = useAdminRecipeActions();
  const [recipeToView, setRecipeToView] = useState<Recipe | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewRecipe = (recipe: Recipe) => {
    setRecipeToView(recipe);
    setIsViewDialogOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    router.push(`/admin/catalog/recipes/${recipe.id}/edit`);
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    if (confirm(`Видалити рецепт "${recipe.title}"?`)) {
      const success = await deleteRecipe(recipe.id);
      if (success) {
        refetch();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link href="/admin/recipes/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Додати рецепт
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="🔍 Пошук рецепту..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
        />

        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={filters.cuisine}
          onChange={(e) => updateFilters({ cuisine: e.target.value, page: 1 })}
        >
          <option value="">Всі кухні</option>
          <option value="main">🍽️ Основні страви</option>
          <option value="salad">🥗 Салати</option>
          <option value="soup">🍲 Супи</option>
          <option value="dessert">🍰 Десерти</option>
          <option value="snack">🍿 Закуски</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={filters.difficulty}
          onChange={(e) => updateFilters({ difficulty: e.target.value, page: 1 })}
        >
          <option value="">Всі складності</option>
          <option value="easy">✅ Легкий</option>
          <option value="medium">⚠️ Середній</option>
          <option value="hard">🔥 Складний</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value, page: 1 })}
        >
          <option value="">Всі статуси</option>
          <option value="draft">📝 Чернетка</option>
          <option value="published">✅ Опубліковано</option>
          <option value="archived">📦 Архів</option>
        </select>
      </div>

      {/* Recipes Table */}
      <RecipesTable
        recipes={Array.isArray(recipes) ? recipes : []}
        isLoading={isLoading}
        onView={handleViewRecipe}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipe}
      />

      {/* Count */}
      {meta && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Показано: {Array.isArray(recipes) ? recipes.length : 0} з {meta.total}
        </div>
      )}

      {/* Recipe View Dialog */}
      <RecipeViewDialog
        recipe={recipeToView}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  );
}
