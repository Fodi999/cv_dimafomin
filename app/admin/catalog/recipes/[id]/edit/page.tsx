"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/admin/catalog/recipes/RecipeForm";
import { mapRecipeToForm, RecipeFormData } from "@/lib/recipes/types";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Professional Recipe Edit Page
 * 
 * Uses universal RecipeForm component in 'edit' mode
 */
export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  const { token } = useAuth();
  
  const [recipe, setRecipe] = useState<any>(null);
  const [formData, setFormData] = useState<RecipeFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipe directly by ID
  useEffect(() => {
    async function fetchRecipe() {
      if (!token) {
        setError('Не авторизовано');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/recipes/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Не вдалося завантажити рецепт');
        }

        const data = await response.json();
        setRecipe(data);
        setFormData(mapRecipeToForm(data));
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Помилка завантаження рецепта');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId, token]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-muted-foreground">Завантаження рецепта...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe || !formData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-muted-foreground">
            {error || 'Рецепт не знайдено'}
          </p>
          <Link href="/admin/catalog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Повернутися до каталогу
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Link href="/admin/catalog">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Каталог
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight mt-2">
            {recipe.title || recipe.localName || recipe.canonicalName}
          </h2>
          <p className="text-muted-foreground">
            Редагування рецепта
          </p>
        </div>
      </div>

      {/* Universal Form */}
      <RecipeForm 
        mode="edit" 
        initialData={formData} 
        recipeId={recipeId}
      />
    </div>
  );
}
