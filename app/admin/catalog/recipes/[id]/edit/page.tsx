"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminRecipes } from "@/hooks/useAdminRecipes";
import { EditRecipeForm } from "@/components/admin/catalog/recipes/EditRecipeForm";

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  
  const { recipes, isLoading, refetch } = useAdminRecipes();
  const recipe = recipes.find((r) => r.id === recipeId);

  useEffect(() => {
    if (recipes.length === 0) {
      refetch();
    }
  }, [recipes.length, refetch]);

  const handleCancel = () => {
    router.push("/admin/catalog");
  };

  if (isLoading && !recipe) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Рецепт не знайдено</p>
          <Button onClick={() => router.push("/admin/catalog")}>
            Повернутися до каталогу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {recipe.localName || recipe.canonicalName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Edit mode
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <EditRecipeForm recipe={recipe} onCancel={handleCancel} />
    </div>
  );
}
