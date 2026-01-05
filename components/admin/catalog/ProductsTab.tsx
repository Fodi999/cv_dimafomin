"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Продукти</CardTitle>
              <CardDescription>
                Управління каталогом інгредієнтів ({meta?.total || 0} продуктів)
              </CardDescription>
            </div>
            <Button onClick={handleCreateProduct} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Додати продукт
            </Button>
          </div>
        </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Пошук продукту..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
            />
          </div>

          <Select
            value={filters.category || "all"}
            onValueChange={(value) => updateFilters({ category: value === "all" ? "" : value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Всі категорії" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі категорії</SelectItem>
              <SelectItem value="vegetables">Овочі</SelectItem>
              <SelectItem value="fruits">Фрукти</SelectItem>
              <SelectItem value="meat">М'ясо</SelectItem>
              <SelectItem value="fish">Риба</SelectItem>
              <SelectItem value="dairy">Молочні</SelectItem>
              <SelectItem value="grains">Зернові</SelectItem>
              <SelectItem value="spices">Спеції</SelectItem>
              <SelectItem value="other">Інше</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {/* Table */}
      <IngredientsTable
        ingredients={Array.isArray(ingredients) ? ingredients : []}
        isLoading={isLoading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Count */}
      {meta && (
        <div className="text-sm text-muted-foreground text-center">
          Показано: {ingredients.length} з {meta.total}
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
