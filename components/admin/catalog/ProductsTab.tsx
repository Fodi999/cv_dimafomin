"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIngredients, useIngredientActions, Ingredient } from "@/hooks/useIngredients";
import { IngredientsTable } from "@/components/admin/catalog/ingredients/IngredientsTable";
import { IngredientsFilters, type CategoryFilter, type SortOption } from "@/components/admin/catalog/ingredients/IngredientsFilters";
import { IngredientFormModal } from "@/components/admin/catalog/ingredients/IngredientFormModal";
import { IngredientDeleteDialog } from "@/components/admin/catalog/ingredients/IngredientDeleteDialog";
import { AddIngredientDialog } from "@/components/admin/catalog/ingredients/AddIngredientDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package
} from "lucide-react";

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
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          {t.admin.catalog.products.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Позиции меню, которые видят пользователи в маркетплейсе.
        </p>
      </div>

      {/* Main Card */}
      <Card className="flex-1 flex flex-col overflow-hidden border-2 border-green-500/20 shadow-lg shadow-green-500/10">
        <CardHeader className="p-3 sm:p-4 flex-shrink-0 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-semibold">{t.admin.catalog.products.title}</span>
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{meta?.total || 0}</span>
              </div>
            </div>
            <AddIngredientDialog onCreated={refetch} />
          </div>
        </CardHeader>
      
        <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
          {/* Filters */}
          <div className="p-3 sm:p-6 border-b bg-muted/30 flex-shrink-0">
            <IngredientsFilters
              searchQuery={localSearch}
              onSearchChange={setLocalSearch}
              categoryFilter={localCategory}
              onCategoryChange={setLocalCategory}
              sortBy={localSort}
              onSortChange={setLocalSort}
            />
          </div>

          {/* Table with scroll */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <IngredientsTable
              ingredients={safeIngredients}
              isLoading={isLoading}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex-shrink-0 p-4 border-t bg-muted/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Per Page Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t.admin.recipes.perPage}:</span>
                  <Select
                    value={filters.limit.toString()}
                    onValueChange={(value) => updateFilters({ limit: parseInt(value), page: 1 })}
                  >
                    <SelectTrigger className="w-[100px]">
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

                {/* Page Info & Navigation */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t.admin.recipes.page} {meta.page} {t.common.of} {meta.totalPages}
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateFilters({ page: 1 })}
                    disabled={meta.page === 1}
                    title={t.admin.recipes.firstPage}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateFilters({ page: meta.page - 1 })}
                    disabled={meta.page === 1}
                    title={t.admin.recipes.previous}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages: (number | string)[] = [];
                      const current = meta.page;
                      const total = meta.totalPages;

                      if (total <= 7) {
                        // Show all pages if 7 or less
                        for (let i = 1; i <= total; i++) {
                          pages.push(i);
                        }
                      } else {
                        // Always show first page
                        pages.push(1);

                        if (current > 3) {
                          pages.push('...');
                        }

                        // Show pages around current
                        const start = Math.max(2, current - 1);
                        const end = Math.min(total - 1, current + 1);

                        for (let i = start; i <= end; i++) {
                          pages.push(i);
                        }

                        if (current < total - 2) {
                          pages.push('...');
                        }

                        // Always show last page
                        pages.push(total);
                      }

                      return pages.map((page, index) => {
                        if (page === '...') {
                          return (
                            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                              ...
                            </span>
                          );
                        }

                        return (
                          <Button
                            key={page}
                            variant={page === current ? "default" : "outline"}
                            size="icon"
                            onClick={() => updateFilters({ page: page as number })}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        );
                      });
                    })()}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateFilters({ page: meta.page + 1 })}
                    disabled={meta.page === meta.totalPages}
                    title={t.admin.recipes.next}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateFilters({ page: meta.totalPages })}
                    disabled={meta.page === meta.totalPages}
                    title={t.admin.recipes.lastPage}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
