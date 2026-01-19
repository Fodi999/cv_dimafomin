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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Globe,
  Star,
  BarChart3,
  Calendar,
  Type,
  Eye,
  Clock,
  ArrowDown,
  ArrowUp,
  Pizza,
  Soup,
  Wheat,
  Circle,
  FileEdit,
  CheckCircle,
  Archive,
  Croissant,
  Flame,
  Fish
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
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

/**
 * Helper function to render icon based on icon name
 */
const renderIcon = (iconName?: string, className: string = "h-4 w-4") => {
  if (!iconName) return null;
  
  const iconMap: Record<string, any> = {
    'calendar': Calendar,
    'text': Type,
    'eye': Eye,
    'clock': Clock,
    'arrow-down': ArrowDown,
    'arrow-up': ArrowUp,
    'pizza': Pizza,
    'soup': Soup,
    'wheat': Wheat,
    'croissant': Croissant,
    'flame': Flame,
    'fish': Fish,
    'circle-green': Circle,
    'circle-yellow': Circle,
    'circle-red': Circle,
    'file-edit': FileEdit,
    'check-circle': CheckCircle,
    'archive': Archive
  };
  
  const IconComponent = iconMap[iconName];
  if (!IconComponent) return <span>{iconName}</span>;
  
  // Special styling for colored circles
  let colorClass = '';
  if (iconName === 'circle-green') colorClass = 'text-green-500 fill-green-500';
  if (iconName === 'circle-yellow') colorClass = 'text-yellow-500 fill-yellow-500';
  if (iconName === 'circle-red') colorClass = 'text-red-500 fill-red-500';
  
  return <IconComponent className={`${className} ${colorClass}`} />;
};

/**
 * Recipes Tab - Manages recipes catalog
 * Only loads data when tab is active
 */
export function RecipesTab() {
  const router = useRouter();
  const { t } = useLanguage();
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
  const [isLoadingRecipeDetails, setIsLoadingRecipeDetails] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Count active filters
  const activeFiltersCount = [
    filters.search,
    filters.cuisine && filters.cuisine !== 'all',
    filters.difficulty && filters.difficulty !== 'all',
    filters.status && filters.status !== 'all'
  ].filter(Boolean).length;

  // ✅ FIX: Load full recipe data with ingredients and steps
  const handleViewRecipe = async (recipe: Recipe) => {
    try {
      setIsLoadingRecipeDetails(true);
      setIsViewDialogOpen(true);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token'); // ✅ FIX: Correct key is 'token' not 'auth_token'
      if (!token) {
        console.error('[RecipesTab] No auth token found');
        setRecipeToView(recipe);
        return;
      }
      
      // Fetch full recipe data from detail endpoint
      const response = await fetch(`/api/admin/recipes/${recipe.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        console.error('[RecipesTab] Failed to fetch recipe details:', response.status);
        // Fallback to list data if detail fetch fails
        setRecipeToView(recipe);
        return;
      }
      
      const data = await response.json();
      const fullRecipe = data.data || data;
      
      console.log('[RecipesTab] 📥 Full recipe loaded:', {
        id: fullRecipe.id,
        title: fullRecipe.title,
        ingredientsCount: fullRecipe.ingredients?.length || 0,
        stepsRuCount: fullRecipe.stepsRu?.length || 0,
        hasImageUrl: !!fullRecipe.imageUrl
      });
      
      setRecipeToView(fullRecipe);
    } catch (error) {
      console.error('[RecipesTab] Error loading recipe details:', error);
      // Fallback to list data
      setRecipeToView(recipe);
    } finally {
      setIsLoadingRecipeDetails(false);
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    // Redirect to AI creation page - will be modified to support edit mode
    router.push(`/admin/recipes/create?edit=${recipe.id}`);
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
    <div className="space-y-4">
      {/* Header Card with gradient */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-orange-950/20 dark:via-gray-900 dark:to-red-950/20 border-orange-200 dark:border-orange-900">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
        
        <CardHeader className="relative px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ChefHat className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                  {t.admin.catalog.recipes.pageTitle}
                </span>
              </CardTitle>
              <CardDescription className="text-sm mt-1.5">
                {t.admin.catalog.recipes.pageDescription || 'Керуйте каталогом рецептів'} ({meta?.total || 0})
              </CardDescription>
            </div>
            <Link href="/admin/recipes/create" className="w-full sm:w-auto">
              <Button 
                size="sm" 
                className="gap-2 w-full sm:w-auto h-10 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/30"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">{t.admin.catalog.recipes.createRecipe || 'Створити рецепт'}</span>
              </Button>
            </Link>
          </div>
        </CardHeader>

        {/* Filters Card */}
        <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
          {/* Filters Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-base sm:text-lg font-semibold">
                {t.admin.catalog.recipes.filtersTitle || 'Фільтри та сортування'}
              </h3>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  {activeFiltersCount} {t.admin.catalog.recipes.activeFilters || 'активних'}
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 gap-2 w-full sm:w-auto border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30"
              >
                <X className="h-4 w-4" />
                <span className="text-sm">{t.admin.catalog.recipes.resetFilters || 'Скинути все'}</span>
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              {t.admin.catalog.recipes.search || 'Пошук'}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.admin.catalog.recipes.searchPlaceholder || "Введіть назву рецепту..."}
                className="pl-9 h-10 text-sm"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              {t.admin.catalog.recipes.filterBy || 'Фільтрувати за'}
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Cuisine */}
              <Select
                value={filters.cuisine || "all"}
                onValueChange={(value) => updateFilters({ cuisine: value === "all" ? "" : value, page: 1 })}
                disabled={isLoadingMeta}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder={t.admin.catalog.recipes.allCuisines || "Всі кухні"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t.admin.catalog.recipes.allCuisines || "Всі кухні"}
                    </div>
                  </SelectItem>
                  {filterMeta?.cuisines.map(cuisine => (
                    <SelectItem key={cuisine.value} value={cuisine.value}>
                      <div className="flex items-center gap-2">
                        {renderIcon(cuisine.icon)}
                        {cuisine.label}
                      </div>
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
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder={t.admin.catalog.recipes.allDifficulties || "Всі складності"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {t.admin.catalog.recipes.allDifficulties || "Всі складності"}
                    </div>
                  </SelectItem>
                  {filterMeta?.difficulties.map(diff => (
                    <SelectItem key={diff.value} value={diff.value}>
                      <div className="flex items-center gap-2">
                        {renderIcon(diff.icon)}
                        {diff.label}
                      </div>
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
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder={t.admin.catalog.recipes.allStatuses || "Всі статуси"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      {t.admin.catalog.recipes.allStatuses || "Всі статуси"}
                    </div>
                  </SelectItem>
                  {filterMeta?.statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        {renderIcon(status.icon)}
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              {t.admin.catalog.recipes.sortBy || 'Сортування'}
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Select
                value={filters.sortBy || 'created_at'}
                onValueChange={(value) => updateFilters({ sortBy: value, page: 1 })}
                disabled={isLoadingMeta}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue>
                    {(() => {
                      const selected = filterMeta?.sortOptions.find(opt => opt.value === (filters.sortBy || 'created_at'));
                      return selected ? (
                        <div className="flex items-center gap-2">
                          {renderIcon(selected.icon)}
                          <span>{selected.label}</span>
                        </div>
                      ) : (t.admin.catalog.recipes.sortByLabel || "Сортувати за...");
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filterMeta?.sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {renderIcon(option.icon)}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.sortOrder || 'desc'}
                onValueChange={(value: 'asc' | 'desc') => updateFilters({ sortOrder: value, page: 1 })}
                disabled={isLoadingMeta}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue>
                    {(() => {
                      const selected = filterMeta?.sortOrders.find(opt => opt.value === (filters.sortOrder || 'desc'));
                      return selected ? (
                        <div className="flex items-center gap-2">
                          {renderIcon(selected.icon)}
                          <span>{selected.label}</span>
                        </div>
                      ) : (t.admin.catalog.recipes.sortOrder || "Порядок...");
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filterMeta?.sortOrders.map(order => (
                    <SelectItem key={order.value} value={order.value}>
                      <div className="flex items-center gap-2">
                        {renderIcon(order.icon)}
                        {order.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="gap-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  {t.admin.catalog.recipes.searchLabel || 'Пошук'}: "{filters.search}"
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ search: '', page: 1 })}
                  />
                </Badge>
              )}
              {filters.cuisine && filters.cuisine !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  {t.admin.catalog.recipes.cuisineLabel || 'Кухня'}: {filters.cuisine}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ cuisine: 'all', page: 1 })}
                  />
                </Badge>
              )}
              {filters.difficulty && filters.difficulty !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  {t.admin.catalog.recipes.difficultyLabel || 'Складність'}: {filters.difficulty}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ difficulty: 'all', page: 1 })}
                  />
                </Badge>
              )}
              {filters.status && filters.status !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  {t.admin.catalog.recipes.statusLabel || 'Статус'}: {filters.status}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ status: 'all', page: 1 })}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-0">
          <RecipesTable
            recipes={Array.isArray(recipes) ? recipes : []}
            isLoading={isLoading}
            onView={handleViewRecipe}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
          />

          {/* Pagination & Count */}
          {meta && (
            <div className="border-t bg-gray-50 dark:bg-gray-800/50">
              {/* Stats Row with Items per page selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm text-center sm:text-left">
                  <span className="text-muted-foreground">
                    {t.admin.catalog.recipes.showing || 'Показано'}: <span className="font-medium text-foreground">{Array.isArray(recipes) ? recipes.length : 0}</span> {t.admin.catalog.recipes.of || 'з'} <span className="font-medium text-foreground">{meta.total}</span>
                  </span>
                  {meta.totalPages > 1 && (
                    <>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {t.admin.catalog.recipes.page || 'Сторінка'}: <span className="font-medium text-foreground">{filters.page || 1}</span> {t.admin.catalog.recipes.of || 'з'} <span className="font-medium text-foreground">{meta.totalPages}</span>
                      </span>
                    </>
                  )}
                </div>
                
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t.admin.catalog.recipes.perPage || 'На сторінці'}:
                  </span>
                  <Select
                    value={filters.limit?.toString() || "12"}
                    onValueChange={(value) => updateFilters({ limit: parseInt(value), page: 1 })}
                  >
                    <SelectTrigger className="h-9 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pagination Controls */}
              {meta.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* First Page - Hidden on mobile */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilters({ page: 1 })}
                      disabled={filters.page === 1 || isLoading}
                      className="hidden sm:flex h-9 w-9 p-0"
                      title={t.admin.catalog.recipes.firstPage || "Перша сторінка"}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* Previous Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilters({ page: Math.max(1, (filters.page || 1) - 1) })}
                      disabled={filters.page === 1 || isLoading}
                      className="h-9 px-2 sm:px-3 gap-1 sm:gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">{t.admin.catalog.recipes.previous || 'Назад'}</span>
                    </Button>
                  </div>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {(() => {
                      const currentPage = filters.page || 1;
                      const totalPages = meta.totalPages;
                      const pages: (number | string)[] = [];

                      // Always show first page
                      pages.push(1);

                      if (currentPage > 3) {
                        pages.push('...');
                      }

                      // Show pages around current
                      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                        pages.push(i);
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push('...');
                      }

                      // Always show last page
                      if (totalPages > 1) {
                        pages.push(totalPages);
                      }

                      return pages.map((page, idx) => {
                        if (page === '...') {
                          return (
                            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                              ...
                            </span>
                          );
                        }

                        const pageNum = page as number;
                        const isActive = pageNum === currentPage;

                        return (
                          <Button
                            key={pageNum}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFilters({ page: pageNum })}
                            disabled={isLoading}
                            className={`h-9 w-9 p-0 ${
                              isActive 
                                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700' 
                                : ''
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      });
                    })()}
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Next Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilters({ page: Math.min(meta.totalPages, (filters.page || 1) + 1) })}
                      disabled={filters.page === meta.totalPages || isLoading}
                      className="h-9 px-2 sm:px-3 gap-1 sm:gap-2"
                    >
                      <span className="hidden sm:inline">{t.admin.catalog.recipes.next || 'Вперед'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last Page - Hidden on mobile */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilters({ page: meta.totalPages })}
                      disabled={filters.page === meta.totalPages || isLoading}
                      className="hidden sm:flex h-9 w-9 p-0"
                      title={t.admin.catalog.recipes.lastPage || "Остання сторінка"}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipe View Dialog */}
      <RecipeViewDialog
        recipe={recipeToView}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        isLoading={isLoadingRecipeDetails}
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
