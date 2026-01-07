/**
 * AI-assisted recipe creation form
 * Minimal input → AI generates full recipe
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Eye, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { IngredientAutocomplete } from "@/components/admin/recipes/IngredientAutocomplete";
import { useAIRecipe } from "@/hooks/useAIRecipe";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIRecipeIngredient } from "@/lib/api/recipes-ai.api";
import { resolveIngredient } from "@/lib/api/ingredients.api";

interface RecipeIngredientRow {
  id: string; // temp ID for React key
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  searchValue: string;
}

export function CreateRecipeWithAI() {
  const router = useRouter();
  const { language } = useLanguage();
  const { loading, previewing, preview, previewRecipe, createRecipe, clearPreview } = useAIRecipe();

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<RecipeIngredientRow[]>([
    { id: crypto.randomUUID(), ingredientId: "", name: "", amount: 0, unit: "g", searchValue: "" }
  ]);
  const [creatingIngredient, setCreatingIngredient] = useState(false);

  // Add ingredient row
  const addIngredientRow = useCallback(() => {
    setIngredients(prev => [
      ...prev,
      { id: crypto.randomUUID(), ingredientId: "", name: "", amount: 0, unit: "g", searchValue: "" }
    ]);
  }, []);

  // Remove ingredient row
  const removeIngredientRow = useCallback((id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  }, []);

  // Update ingredient
  const updateIngredient = useCallback((id: string, field: keyof RecipeIngredientRow, value: any) => {
    setIngredients(prev => prev.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  }, []);

  // Handle ingredient selection from autocomplete
  const handleIngredientSelect = useCallback((index: number, ingredient: any) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? {
        ...ing,
        ingredientId: ingredient.id,
        name: ingredient.nameRu || ingredient.namePl || ingredient.nameEn || ingredient.name,
        unit: ingredient.unit,
        searchValue: ""
      } : ing
    ));
  }, []);

  // Handle "Create new ingredient" via AI
  const handleCreateNewIngredient = useCallback(async (index: number, input: string) => {
    setCreatingIngredient(true);
    try {
      const result = await resolveIngredient(input);
      
      // Update ingredient row with resolved data
      setIngredients(prev => prev.map((ing, i) => 
        i === index ? {
          ...ing,
          ingredientId: result.ingredient.id,
          name: result.ingredient.nameRu || result.ingredient.namePl || result.ingredient.nameEn || result.ingredient.name,
          unit: result.ingredient.unit,
          searchValue: ""
        } : ing
      ));

      if (result.status === "created") {
        toast.success(`Продукт создан: ${result.ingredient.name}`);
      } else {
        toast.info(`Продукт найден: ${result.ingredient.name}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Не удалось создать продукт");
    } finally {
      setCreatingIngredient(false);
    }
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!title.trim()) {
      toast.error("Введите название рецепта");
      return false;
    }

    const validIngredients = ingredients.filter(ing => ing.ingredientId && ing.amount > 0);
    if (validIngredients.length === 0) {
      toast.error("Добавьте хотя бы один продукт с весом");
      return false;
    }

    if (!instructions.trim()) {
      toast.error("Опишите процесс приготовления");
      return false;
    }

    return true;
  }, [title, ingredients, instructions]);

  // Preview with AI
  const handlePreview = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const validIngredients: AIRecipeIngredient[] = ingredients
        .filter(ing => ing.ingredientId && ing.amount > 0)
        .map(ing => ({
          ingredientId: ing.ingredientId,
          amount: ing.amount,
          unit: ing.unit
        }));

      await previewRecipe({
        title: title.trim(),
        ingredients: validIngredients,
        instructions: instructions.trim()
      });

      toast.success("Превью готово!");
    } catch (error: any) {
      toast.error(error.message || "Не удалось создать превью");
    }
  }, [title, ingredients, instructions, validateForm, previewRecipe]);

  // Create recipe
  const handleCreate = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const validIngredients: AIRecipeIngredient[] = ingredients
        .filter(ing => ing.ingredientId && ing.amount > 0)
        .map(ing => ({
          ingredientId: ing.ingredientId,
          amount: ing.amount,
          unit: ing.unit
        }));

      const result = await createRecipe({
        title: title.trim(),
        ingredients: validIngredients,
        instructions: instructions.trim()
      });

      toast.success("Рецепт создан!");
      router.push(`/admin/catalog/recipes/${result.id}`);
    } catch (error: any) {
      toast.error(error.message || "Не удалось создать рецепт");
    }
  }, [title, ingredients, instructions, validateForm, createRecipe, router]);

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Создать рецепт с AI</CardTitle>
          <CardDescription>
            Введите минимум данных — AI создаст полный рецепт с шагами, временем и калориями
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Название рецепта *</Label>
            <Input
              id="title"
              placeholder="Grilled Salmon with Rice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <Label>Ингредиенты *</Label>
            <div className="space-y-2">
              {ingredients.map((ing, index) => (
                <div key={ing.id} className="flex items-center gap-2">
                  {/* Ingredient search */}
                  <div className="flex-1">
                    {ing.ingredientId ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{ing.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateIngredient(ing.id, 'ingredientId', '')}
                          className="h-6 w-6 p-0 ml-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <IngredientAutocomplete
                        value={ing.searchValue}
                        onChange={(value: string) => updateIngredient(ing.id, 'searchValue', value)}
                        onSelect={(ingredient: any) => handleIngredientSelect(index, ingredient)}
                        onCreateNew={(input: string) => handleCreateNewIngredient(index, input)}
                        language={language}
                      />
                    )}
                  </div>

                  {/* Amount */}
                  <Input
                    type="number"
                    placeholder="150"
                    value={ing.amount || ''}
                    onChange={(e) => updateIngredient(ing.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                    step="1"
                  />

                  {/* Unit */}
                  <Input
                    value={ing.unit}
                    onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                    className="w-16"
                    disabled
                  />

                  {/* Remove */}
                  {ingredients.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeIngredientRow(ing.id)}
                      className="h-10 w-10 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={addIngredientRow}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Добавить продукт
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Процесс приготовления *</Label>
            <Textarea
              id="instructions"
              placeholder="Marinate salmon in teriyaki sauce, grill it, boil rice, serve together..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Опишите технологию одним текстом. AI разобьет на шаги и добавит детали.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={previewing || loading}
            >
              {previewing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание превью...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Превью с AI
                </>
              )}
            </Button>

            <Button
              onClick={handleCreate}
              disabled={loading || previewing}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Создать рецепт
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>Превью рецепта</CardTitle>
            <CardDescription>
              AI сгенерировал полный рецепт на основе ваших данных
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{preview.title}</h3>
              <p className="text-sm text-muted-foreground">{preview.canonicalName}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Порций:</span>
                <p className="font-medium">{preview.servings}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Время:</span>
                <p className="font-medium">{preview.time} мин</p>
              </div>
              <div>
                <span className="text-muted-foreground">Сложность:</span>
                <p className="font-medium">{preview.difficulty}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Калории:</span>
                <p className="font-medium">{preview.nutrition.calories} ккал</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Описание</h4>
              <p className="text-sm text-muted-foreground">{preview.summary}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Шаги ({preview.steps.length})</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {preview.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={clearPreview}
              >
                Закрыть превью
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
