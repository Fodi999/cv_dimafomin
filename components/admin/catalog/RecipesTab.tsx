"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ChefHat, 
  Sparkles, 
  X, 
  SlidersHorizontal, 
  Filter, 
  ArrowUpDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminRecipes, useAdminRecipeActions, Recipe } from "@/hooks/useAdminRecipes";
import { useRecipesFilterMeta } from "@/hooks/useRecipesFilterMeta";
import { RecipesTable } from "@/components/admin/catalog/recipes/RecipesTable";
import { RecipeViewDialog } from "@/components/admin/catalog/recipes/RecipeViewDialog";
import { RecipeDeleteDialog } from "@/components/admin/catalog/recipes/RecipeDeleteDialog";
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
  const { filterMeta, isLoading: isLoadingMeta } = useRecipesFilterMeta();
  const { deleteRecipe } = useAdminRecipeActions();
  const [recipeToView, setRecipeToView] = useState<Recipe | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Count active filters
  const activeFiltersCount = [
    filters.search,
    filters.cuisine && filters.cuisine !== 'all',
    filters.difficulty && filters.difficulty !== 'all',
    filters.status && filters.status !== 'all'
  ].filter(Boolean).length;

  const handleViewRecipe = (recipe: Recipe) => {
    setRecipeToView(recipe);
    setIsViewDialogOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    router.push(`/admin/catalog/recipes/${recipe.id}/edit`);
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;
    
    const success = await deleteRecipe(recipeToDelete.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setRecipeToDelete(null);
      refetch();
    }
  };

  const handleResetFilters = () => {
    updateFilters({
      search: '',
      cuisine: 'all',
      difficulty: 'all',
      status: 'all',
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Card>
        <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ChefHat className="h-4 w-4 sm:h-5 sm:w-5" />
                Рецепти
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Управління каталогом рецептів ({meta?.total || 0} рецептів)
              </CardDescription>
            </div>
            <Link href="/admin/recipes/create" className="w-full sm:w-auto">
              <Button size="sm" className="gap-2 w-full sm:w-auto h-9 sm:h-10">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Створити рецепт</span>
              </Button>
            </Link>
          </div>
        </CardHeader>

        
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
          {/* Header: Filters + Reset Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Фільтри та сортування
              </h3>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount} активних
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 gap-2 w-full sm:w-auto"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Скинути все</span>
              </Button>
            )}
          </div>

          {/* Section 1: Search */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
              Пошук
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Введіть назву рецепту..."
                className="pl-8 sm:pl-9 h-9 sm:h-10 text-sm"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
              />
            </div>
          </div>

          {/* Section 2: Filters & Sorting (Responsive layout) */}
          <div className="space-y-3">
            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              Фільтри та сортування
            </label>
            
            {/* Filters - vertical on mobile, grid on desktop */}
            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {/* Cuisine/Category */}
              <Select
                value={filters.cuisine || "all"}
                onValueChange={(value) => updateFilters({ cuisine: value === "all" ? "" : value, page: 1 })}
                disabled={isLoadingMeta}
              >
                <SelectTrigger className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Всі кухні" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🌍 Всі кухні</SelectItem>
                  {filterMeta?.cuisines.map(cuisine => (
                    <SelectItem key={cuisine.value} value={cuisine.value}>
                      {cuisine.icon} {cuisine.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty */}
              <Select
                value={filters.difficulty || "all"}
                onValueChange={(value) => updateFilters({ difficulty: value === "all" ? "" : value, page: 1 })}
                disabled={isLoadingMeta}
              >
                <SelectTrigger className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Всі складності" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">⭐ Всі складності</SelectItem>
                  {filterMeta?.difficulties.map(diff => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.icon} {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status */}
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => updateFilters({ status: value === "all" ? "" : value, page: 1 })}
                disabled={isLoadingMeta}
              >
                <SelectTrigger className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Всі статуси" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">📊 Всі статуси</SelectItem>
                  {filterMeta?.statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.icon} {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Controls - vertical on mobile, 2-col on desktop */}
            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              <Select
                value={filters.sortBy || 'created_at'}
                onValueChange={(value) => updateFilters({ sortBy: value, page: 1 })}
                disabled={isLoadingMeta}
              >
                <SelectTrigger className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Сортувати за..." />
                </SelectTrigger>
                <SelectContent>
                  {filterMeta?.sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.sortOrder || 'desc'}
                onValueChange={(value: 'asc' | 'desc') => updateFilters({ sortOrder: value, page: 1 })}
                disabled={isLoadingMeta}
              >
                <SelectTrigger className="h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Порядок..." />
                </SelectTrigger>
                <SelectContent>
                  {filterMeta?.sortOrders.map(order => (
                    <SelectItem key={order.value} value={order.value}>
                      {order.icon} {order.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Empty space for alignment on desktop */}
              <div className="hidden md:block"></div>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {filters.search && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  Пошук: "{filters.search}"
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ search: '', page: 1 })}
                  />
                </Badge>
              )}
              {filters.cuisine && filters.cuisine !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  Кухня: {filters.cuisine}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ cuisine: 'all', page: 1 })}
                  />
                </Badge>
              )}
              {filters.difficulty && filters.difficulty !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  Складність: {filters.difficulty}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ difficulty: 'all', page: 1 })}
                  />
                </Badge>
              )}
              {filters.status && filters.status !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  Статус: {filters.status}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ status: 'all', page: 1 })}
                  />
                </Badge>
              )}
            </div>
          )}

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
            <div className="text-xs sm:text-sm text-muted-foreground text-center">
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

      {/* Recipe Delete Dialog */}
      <RecipeDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteRecipe}
        recipeTitle={recipeToDelete?.title || ""}
        viewsCount={recipeToDelete?.views || recipeToDelete?.viewsCount || 0}
        createdAt={recipeToDelete?.created_at || recipeToDelete?.createdAt}
      />
    </div>
  );
}
