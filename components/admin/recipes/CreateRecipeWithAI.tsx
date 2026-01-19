/**
 * AI-assisted recipe creation form
 * Minimal input → AI generates full recipe
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Eye, Check, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { IngredientAutocomplete } from "@/components/admin/recipes/IngredientAutocomplete";
import { WeightInput } from "@/components/admin/recipes/WeightInput";
import { useAIRecipe } from "@/hooks/useAIRecipe";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIRecipeIngredient } from "@/lib/api/recipes-ai.api";
import { resolveIngredient } from "@/lib/api/ingredients.api";

interface RecipeIngredientRow {
  id: string; // temp ID for React key
  ingredientId: string;
  name: string;
  quantity: number; // Changed from amount to match backend
  unit: string;
  searchValue: string;
}

type RecipeAIMode = 'edit' | 'preview' | 'saving';

interface RecipeConflict {
  message: string;
  suggestions: {
    ru: string[];
    en: string[];
    pl: string[];
  };
}

interface CreateRecipeWithAIProps {
  recipeId?: string; // For edit mode
}

export function CreateRecipeWithAI({ recipeId }: CreateRecipeWithAIProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { loading, previewing, preview, previewRecipe, saveRecipe, clearPreview } = useAIRecipe();
  const isEditMode = !!recipeId;

  const [mode, setMode] = useState<RecipeAIMode>('edit');
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [title, setTitle] = useState("");
  const [cookingText, setCookingText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredientRow[]>([
    { id: crypto.randomUUID(), ingredientId: "", name: "", quantity: 0, unit: "g", searchValue: "" }
  ]);
  const [creatingIngredient, setCreatingIngredient] = useState(false);
  const [conflict, setConflict] = useState<RecipeConflict | null>(null);
  const [conflictLang, setConflictLang] = useState<'ru' | 'en' | 'pl'>('ru');

  // Load recipe data for edit mode
  useEffect(() => {
    if (isEditMode && recipeId) {
      setLoadingRecipe(true);
      const token = localStorage.getItem('token');
      
      // Use Next.js API route that proxies to backend
      fetch(`/api/admin/recipes/${recipeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to load recipe');
          return res.json();
        })
        .then(response => {
          console.log('🔍 [Edit Mode] Raw API response:', response);
          
          // Extract recipe data (API wraps it in { data: { ... } })
          const data = response.data || response;
          console.log('📦 [Edit Mode] Recipe data:', data);
          
          // Pre-fill form with existing recipe data
          const recipeTitle = data.title || data.localName || data.canonicalName || '';
          console.log('📝 [Edit Mode] Setting title:', recipeTitle);
          setTitle(recipeTitle);
          
          // Build cooking text from steps
          if (data.stepsRu && Array.isArray(data.stepsRu) && data.stepsRu.length > 0) {
            const stepsText = data.stepsRu.map((step: any) => step.text).join(' ');
            console.log('📋 [Edit Mode] Setting cooking text from stepsRu:', stepsText.substring(0, 100) + '...');
            setCookingText(stepsText);
          } else if (data.cookingText) {
            console.log('📋 [Edit Mode] Setting cooking text from cookingText:', data.cookingText.substring(0, 100) + '...');
            setCookingText(data.cookingText);
          }
          
          // Load ingredients
          if (data.ingredients && data.ingredients.length > 0) {
            console.log('🥕 [Edit Mode] Loading ingredients:', data.ingredients.length);
            const loadedIngredients = data.ingredients.map((ing: any) => ({
              id: crypto.randomUUID(),
              ingredientId: ing.ingredient?.id || ing.ingredientId || '',
              name: ing.ingredient?.nameRu || ing.ingredient?.namePl || ing.ingredient?.nameEn || ing.name || '',
              quantity: ing.quantity || ing.amount || 0,
              unit: ing.unit || 'g',
              searchValue: '',
            }));
            console.log('✅ [Edit Mode] Ingredients loaded:', loadedIngredients);
            setIngredients(loadedIngredients);
          }
          
          // Load image
          if (data.imageUrl) {
            console.log('🖼️ [Edit Mode] Setting image preview:', data.imageUrl);
            setImagePreview(data.imageUrl);
          }
          
          toast.success('Рецепт завантажено для редагування');
        })
        .catch(error => {
          console.error('Error loading recipe:', error);
          toast.error('Помилка завантаження рецепту');
        })
        .finally(() => {
          setLoadingRecipe(false);
        });
    }
  }, [isEditMode, recipeId]);

  // Add ingredient row
  const addIngredientRow = useCallback(() => {
    setIngredients(prev => [
      ...prev,
      { id: crypto.randomUUID(), ingredientId: "", name: "", quantity: 0, unit: "g", searchValue: "" }
    ]);
  }, []);

  // Remove ingredient row
  const removeIngredientRow = useCallback((id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  }, []);

  // Update ingredient
  const updateIngredient = useCallback((id: string, field: keyof RecipeIngredientRow, value: any) => {
    // DEBUG: Log quantity updates
    if (field === 'quantity') {
      console.log(`[DEBUG] updateIngredient quantity: ${value} (type: ${typeof value})`);
    }
    
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

    const validIngredients = ingredients.filter(ing => ing.ingredientId && ing.quantity > 0);
    if (validIngredients.length === 0) {
      toast.error("Добавьте хотя бы один продукт с весом");
      return false;
    }

    if (!cookingText.trim()) {
      toast.error("Опишите процесс приготовления");
      return false;
    }

    return true;
  }, [title, ingredients, cookingText]);

  // Handle image file selection
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error("Nieprawidłowy format. Tylko JPEG, PNG, WEBP");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Plik zbyt duży. Maksymalnie 5MB");
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Remove image
  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  // Preview with AI
  const handlePreview = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const validIngredients: AIRecipeIngredient[] = ingredients
        .filter(ing => ing.ingredientId && ing.quantity > 0)
        .map(ing => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit
        }));

      await previewRecipe({
        title: title.trim(),
        ingredients: validIngredients,
        rawCookingText: cookingText.trim(),
        language: language  // Add user's language preference
      });

      setMode('preview'); // Switch to preview mode
      toast.success("Превью готово!");
    } catch (error: any) {
      toast.error(error.message || "Не удалось создать превью");
    }
  }, [title, ingredients, cookingText, validateForm, previewRecipe]);

  // Edit preview
  const handleEdit = useCallback(() => {
    setMode('edit');
    clearPreview();
  }, [clearPreview]);

  // Create recipe (only after preview)
  const handleCreate = useCallback(async (customTitle?: string) => {
    console.log("🚀 [handleCreate] Starting recipe creation/edit:", {
      isEditMode,
      recipeId,
      hasImageFile: !!imageFile,
      imageFileName: imageFile?.name,
      imageFileSize: imageFile?.size,
      imageFileType: imageFile?.type,
    });

    // If no preview, must preview first
    if (!preview) {
      toast.error("Сначала создайте превью с AI");
      return;
    }

    setMode('saving');

    try {
      // Use preview data to save recipe (with optional custom title)
      const recipePayload = {
        recipeId: recipeId || undefined, // ✅ НОВОЕ: Передаем ID для редактирования
        title: customTitle || preview.title,
        language: preview.language || language,
        description: preview.description || preview.summary || '',
        servings: preview.servings,
        time_minutes: preview.time_minutes || preview.time || 0,
        difficulty: (preview.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
        calories: preview.nutrition?.calories || preview.calories || 0,
        portionWeightGrams: preview.totalWeight || 0, // ✅ ADD: Send portion weight from AI calculation
        ingredients: preview.ingredients || [],
        steps: (preview.steps || []).map(step => ({
          order: step.order,
          text: step.text,
          time: step.time || 0 // Ensure time is always a number
        }))
      };
      
      console.log('📤 [handleCreate] Payload to save:', {
        hasRecipeId: !!recipePayload.recipeId,
        recipeId: recipePayload.recipeId,
        title: recipePayload.title,
        ingredientsCount: recipePayload.ingredients.length,
      });
      
      const result = await saveRecipe(recipePayload);

      const savedRecipeId = result.id;

      // Upload image if provided
      if (imageFile && savedRecipeId) {
        try {
          console.log("🖼️ [Image Upload] Starting upload:", {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type,
            recipeId: savedRecipeId,
          });

          const formData = new FormData();
          formData.append("file", imageFile); // ✅ Backend expects "file", not "image"

          // Log FormData contents
          console.log("📦 [FormData] Contents:");
          for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size}b)` : value);
          }

          const token = localStorage.getItem("token");
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          
          console.log("🚀 [Image Upload] Sending to:", `${apiUrl}/api/admin/recipes/${savedRecipeId}/image`);
          
          const uploadResponse = await fetch(`${apiUrl}/api/admin/recipes/${savedRecipeId}/image`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          console.log("📨 [Image Upload] Response status:", uploadResponse.status);

          if (uploadResponse.ok) {
            const data = await uploadResponse.json();
            console.log("✅ [Image Upload] Success:", data);
            toast.success("Изображение загружено!");
          } else {
            const errorText = await uploadResponse.text();
            console.error("❌ [Image Upload] Failed:", errorText);
            toast.warning("Рецепт создан, но изображение не загружено");
          }
        } catch (imageError) {
          console.error("Image upload error:", imageError);
          toast.warning("Рецепт создан, но изображение не загружено");
        }
      }

      toast.success(`✅ Рецепт "${result.title || customTitle || preview.title}" ${isEditMode ? 'успішно оновлено' : 'успешно создан'}!`);
      
      // Clear conflict if any
      setConflict(null);
      
      // Redirect to recipes catalog page
      setTimeout(() => {
        router.push('/admin/catalog/recipes-list?refresh=' + Date.now());
      }, 1500);
    } catch (error: any) {
      // DEBUG: Log full error to see structure
      console.log('[handleCreate] ❌ Error caught:', error);
      console.log('[handleCreate] Error code:', error.code);
      console.log('[handleCreate] Error suggestions:', error.suggestions);
      
      // Handle 409 conflict (with or without suggestions)
      if (error.code === 'RECIPE_NAME_EXISTS' || error.message?.includes('already exists')) {
        setConflict({
          message: error.message || 'Рецепт с таким названием уже существует',
          suggestions: error.suggestions || {} // Empty object if no suggestions
        });
        setConflictLang(language as 'ru' | 'en' | 'pl');
        setMode('preview'); // Return to preview to show conflict dialog
        toast.error("Название уже существует. Измените название вручную.");
        return;
      }
      
      toast.error(error.message || "Не удалось создать рецепт");
      setMode('preview'); // Return to preview on error
    }
  }, [preview, language, saveRecipe, router, isEditMode, recipeId, imageFile]);

  return (
    <div className="space-y-6">
      {/* Loading state */}
      {loadingRecipe && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Завантаження рецепту...</p>
          </CardContent>
        </Card>
      )}

      {/* Form - visible in edit mode */}
      {!loadingRecipe && mode === 'edit' && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Редагувати рецепт' : 'Создать рецепт с AI'}</CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Оновіть дані — AI покращить деталі, кроки та калорії'
                : 'Введите минимум данных — AI создаст полный рецепт с шагами, временем и калориями'
              }
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
                  <WeightInput
                    value={ing.quantity}
                    onChange={(numericValue) => updateIngredient(ing.id, 'quantity', numericValue)}
                    unit={ing.unit}
                    placeholder="150"
                    className="w-28"
                    min={0}
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
            <Label htmlFor="cookingText">Процесс приготовления *</Label>
            <Textarea
              id="cookingText"
              placeholder="Marinate salmon in teriyaki sauce, grill it, boil rice, serve together..."
              value={cookingText}
              onChange={(e) => setCookingText(e.target.value)}
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Опишите технологию одним текстом. AI разобьет на шаги и добавит детали.
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="recipeImage">Изображение рецепта (опционально)</Label>
            <div className="space-y-3">
              {/* Preview or Placeholder */}
              <div className="relative aspect-[4/3] max-w-md bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleImageRemove}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">Нет изображения</p>
                  </div>
                )}
              </div>

              {/* File Input */}
              {!imageFile && (
                <>
                  <input
                    id="recipeImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('recipeImage')?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Выбрать изображение
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, WEBP. Максимум 5MB
                  </p>
                </>
              )}
            </div>
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
              onClick={() => handleCreate()}
              disabled={loading || previewing || !preview}
              title={!preview ? "Сначала создайте превью с AI" : ""}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Збереження...' : 'Создание...'}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Зберегти зміни' : 'Утвердить и создать'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Conflict Dialog - show when name already exists */}
      {conflict && mode === 'preview' && (
        <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-amber-700 dark:text-amber-400">
              ⚠️ Название уже существует
            </CardTitle>
            <CardDescription>
              {conflict.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Show suggestions if available */}
            {conflict.suggestions && Object.keys(conflict.suggestions).length > 0 && 
             conflict.suggestions[conflictLang] && conflict.suggestions[conflictLang].length > 0 ? (
              <div className="space-y-2">
                <Label>Выберите альтернативное название:</Label>
                <div className="space-y-2">
                  {conflict.suggestions[conflictLang].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleCreate(suggestion)}
                      className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 
                               hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20
                               transition-all transform hover:translate-x-1"
                    >
                      <span className="font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* No suggestions available - show manual edit message */
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 Измените название рецепта и попробуйте снова, или отмените создание.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setConflict(null);
                  setMode('edit');
                }}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                variant="outline"
                onClick={() => setConflict(null)}
                className="flex-1"
              >
                Изменить вручную
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview - visible in preview and saving modes */}
      {(mode === 'preview' || mode === 'saving') && preview && !conflict && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>Превью рецепта</CardTitle>
            <CardDescription>
              AI сгенерировал полный рецепт на основе ваших данных
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                <img
                  src={imagePreview}
                  alt={preview.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  📷 Изображение добавлено
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg">{preview.title}</h3>
              {preview.canonicalName && (
                <p className="text-sm text-muted-foreground">{preview.canonicalName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Порций:</span>
                <p className="font-medium">{preview.servings}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Время:</span>
                <p className="font-medium">{preview.time_minutes || preview.time} мин</p>
              </div>
              {preview.difficulty && (
                <div>
                  <span className="text-muted-foreground">Сложность:</span>
                  <p className="font-medium">{preview.difficulty}</p>
                </div>
              )}
              {preview.nutrition && (
                <div>
                  <span className="text-muted-foreground">Калории:</span>
                  <p className="font-medium">{preview.nutrition.calories} ккал</p>
                </div>
              )}
              {preview.totalWeight && (
                <div>
                  <span className="text-muted-foreground">Общий вес:</span>
                  <p className="font-medium">{preview.totalWeight} г</p>
                </div>
              )}
            </div>

            {(preview.summary || preview.description) && (
              <div>
                <h4 className="font-semibold mb-2">Описание</h4>
                <p className="text-sm text-muted-foreground">
                  {preview.summary || preview.description}
                </p>
              </div>
            )}

            {preview.ingredients && preview.ingredients.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Ингредиенты ({preview.ingredients.length})</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {preview.ingredients.map((ing, index) => (
                    <li key={index}>
                      <span className="font-medium">{ing.name}</span>
                      {' — '}
                      <span>{ing.amount} {ing.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Шаги ({preview.steps.length})</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                {preview.steps.map((step, index) => (
                  <li key={index} className="leading-relaxed">
                    <span>{step.text}</span>
                    {step.time && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ⏱️ {step.time} мин
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4 border-t flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={mode === 'saving'}
              >
                ✏️ Изменить
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleCreate()}
                disabled={mode === 'saving'}
              >
                {mode === 'saving' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {isEditMode ? 'Зберегти зміни' : 'Утвердить и создать'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
