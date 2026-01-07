"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChefHat, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Рецепти
              </CardTitle>
              <CardDescription>
                Управління каталогом рецептів ({meta?.total || 0} рецептів)
              </CardDescription>
            </div>
            <Link href="/admin/recipes/create">
              <Button size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Створити рецепт
              </Button>
            </Link>
          </div>
        </CardHeader>

        
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Пошук рецепту..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
              />
            </div>

            <Select
              value={filters.cuisine || "all"}
              onValueChange={(value) => updateFilters({ cuisine: value === "all" ? "" : value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Всі кухні" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі кухні</SelectItem>
                <SelectItem value="main">Основні страви</SelectItem>
                <SelectItem value="salad">Салати</SelectItem>
                <SelectItem value="soup">Супи</SelectItem>
                <SelectItem value="dessert">Десерти</SelectItem>
                <SelectItem value="snack">Закуски</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.difficulty || "all"}
              onValueChange={(value) => updateFilters({ difficulty: value === "all" ? "" : value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Всі складності" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі складності</SelectItem>
                <SelectItem value="easy">Легкий</SelectItem>
                <SelectItem value="medium">Середній</SelectItem>
                <SelectItem value="hard">Складний</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilters({ status: value === "all" ? "" : value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Всі статуси" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі статуси</SelectItem>
                <SelectItem value="draft">Чернетка</SelectItem>
                <SelectItem value="published">Опубліковано</SelectItem>
                <SelectItem value="archived">Архів</SelectItem>
              </SelectContent>
            </Select>
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
            <div className="text-sm text-muted-foreground text-center">
              Показано: {Array.isArray(recipes) ? recipes.length : 0} з {meta.total}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipe View Dialog */}
      <RecipeViewDialog
        recipe={recipeToView}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  );
}
