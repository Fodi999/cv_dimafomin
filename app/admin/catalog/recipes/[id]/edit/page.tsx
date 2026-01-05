"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/admin/catalog/recipes/RecipeForm";
import { mapRecipeToForm, RecipeFormData } from "@/lib/recipes/types";
import { useAuth } from "@/contexts/AuthContext";

/**
 * 🍱 Professional Recipe Edit Page
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe || !formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {error || 'Рецепт не знайдено'}
            </p>
            <Link href="/admin/catalog">
              <Button>Повернутися до каталогу</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gray-50 dark:bg-gray-950 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/catalog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад до каталогу
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {recipe.title || recipe.localName || recipe.canonicalName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Режим редагування
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeForm 
          mode="edit" 
          initialData={formData} 
          recipeId={recipeId}
        />
      </div>
    </div>
  );
}
