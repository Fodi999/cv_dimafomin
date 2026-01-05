"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CountryAutocomplete } from "../meta/CountryAutocomplete";
import { CuisineAutocomplete } from "../meta/CuisineAutocomplete";
import { CategorySelect } from "../meta/CategorySelect";
import { DifficultySelect } from "../meta/DifficultySelect";
import { useAuth } from "@/contexts/AuthContext";
import { RecipeFormData, mapFormToApi, validateRecipeForm } from "@/lib/recipes/types";

/**
 * Минималистичная форма создания рецепта
 * 
 * Принцип: только базовая информация
 * Ingredients + Steps добавляются после создания
 */
export function CreateRecipeCard() {
  const router = useRouter();
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Minimal form state
  const [formData, setFormData] = useState<RecipeFormData>({
    localName: '',
    canonicalName: '',
    descriptionPl: '',
    countryCode: '',
    cuisineId: '',
    categoryId: '',
    difficulty: 'medium',
    status: 'draft',
    timeMinutes: 30,
    servings: 4,
    ingredients: [],
    steps: [],
    translations: {},
    origin: { country: '', region: '' },
    nutritionProfile: {},
    source: { type: 'original' },
  });

  const handleChange = <K extends keyof RecipeFormData>(
    field: K,
    value: RecipeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const errors = validateRecipeForm(formData, 'create');
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    if (!token) {
      toast.error('Ви не авторизовані');
      return;
    }

    setIsSaving(true);
    try {
      const payload = mapFormToApi(formData);

      // Add temporary step (backend requirement)
      if (payload.steps.length === 0) {
        payload.steps = [
          {
            order: 1,
            description: 'Тимчасовий крок. Буде замінено при редагуванні.',
            duration: null,
          }
        ];
      }

      const response = await fetch('/api/admin/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create recipe');
      }

      const data = await response.json();
      const recipeData = data.data || data;
      const newRecipeId = recipeData.id || recipeData._id || recipeData.recipeId;

      if (!newRecipeId) {
        toast.error('Рецепт створено, але не отримано ID');
        router.push('/admin/catalog');
        return;
      }

      toast.success('Рецепт створено! Переходимо до редагування...');

      setTimeout(() => {
        router.push(`/admin/catalog/recipes/${newRecipeId}/edit?tab=content`);
      }, 800);
    } catch (error: any) {
      console.error('Error creating recipe:', error);
      toast.error(error.message || 'Помилка при створенні рецепта');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Створити рецепт</CardTitle>
          <CardDescription>
            Мінімальна інформація. Інгредієнти та кроки можна додати після створення.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* Назва рецепта */}
          <div className="grid gap-2">
            <Label htmlFor="localName">Назва рецепта *</Label>
            <Input
              id="localName"
              value={formData.localName}
              onChange={(e) => handleChange('localName', e.target.value)}
              placeholder="Pierogi ruskie"
              required
            />
          </div>

          {/* Canonical Name */}
          <div className="grid gap-2">
            <Label htmlFor="canonicalName">Canonical Name *</Label>
            <Input
              id="canonicalName"
              value={formData.canonicalName}
              onChange={(e) => handleChange('canonicalName', e.target.value)}
              placeholder="pierogi-ruskie"
              required
            />
            <p className="text-xs text-gray-500">
              URL-friendly назва (латиниця, дефіси)
            </p>
          </div>

          {/* Country + Cuisine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Країна *</Label>
              <CountryAutocomplete
                value={formData.countryCode || ''}
                onChange={(code) => handleChange('countryCode', code)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Кухня *</Label>
              <CuisineAutocomplete
                value={formData.cuisineId || ''}
                onChange={(cuisineId) => handleChange('cuisineId', cuisineId)}
                countryCode={formData.countryCode}
                required
              />
            </div>
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Категорія</Label>
              <CategorySelect
                value={formData.categoryId || ''}
                onChange={(categoryId) => handleChange('categoryId', categoryId)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Складність *</Label>
              <DifficultySelect
                value={formData.difficulty}
                onChange={(value: any) => handleChange('difficulty', value)}
                required
              />
            </div>
          </div>

          {/* Time + Servings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="timeMinutes">Час приготування (хв) *</Label>
              <Input
                id="timeMinutes"
                type="number"
                value={formData.timeMinutes}
                onChange={(e) => handleChange('timeMinutes', parseInt(e.target.value) || 0)}
                min="1"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="servings">Порцій *</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => handleChange('servings', parseInt(e.target.value) || 0)}
                min="1"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Опис *</Label>
            <Textarea
              id="description"
              value={formData.descriptionPl || ''}
              onChange={(e) => handleChange('descriptionPl', e.target.value)}
              placeholder="Tradycyjne polskie danie z ziemniakami i serem..."
              rows={4}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/catalog')}
            disabled={isSaving}
          >
            Скасувати
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Створення...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Створити рецепт
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
