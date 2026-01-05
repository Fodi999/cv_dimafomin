"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Save, X, FileText, Globe, ChefHat, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IngredientsEditor } from "./IngredientsEditor";
import { StepsEditor } from "./StepsEditor";
import { CountryAutocomplete } from "../meta/CountryAutocomplete";
import { CuisineAutocomplete } from "../meta/CuisineAutocomplete";
import { CategorySelect } from "../meta/CategorySelect";
import { DifficultySelect } from "../meta/DifficultySelect";
import { useAuth } from "@/contexts/AuthContext";
import { 
  RecipeFormData, 
  RecipeMode, 
  mapFormToApi, 
  validateRecipeForm 
} from "@/lib/recipes/types";

interface RecipeFormProps {
  mode: RecipeMode;
  initialData: RecipeFormData;
  recipeId?: string; // Required for edit mode
}

export function RecipeForm({ mode, initialData, recipeId }: RecipeFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [formData, setFormData] = useState<RecipeFormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'basic');

  // Update tab from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleChange = <K extends keyof RecipeFormData>(
    field: K,
    value: RecipeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleNestedChange = (
    parent: 'translations',
    field: keyof RecipeFormData['translations'],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleOriginChange = (
    field: keyof NonNullable<RecipeFormData['origin']>,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      origin: {
        ...(prev.origin || { country: '', region: '' }),
        [field]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate (pass mode to enable conditional validation)
    const errors = validateRecipeForm(formData, mode);
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    // Check authentication
    if (!token) {
      toast.error('Ви не авторизовані. Будь ласка, увійдіть в систему.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = mapFormToApi(formData);
      
      // ✨ В режимі create додаємо тимчасовий крок, бо backend вимагає steps
      if (mode === 'create' && payload.steps.length === 0) {
        payload.steps = [
          {
            order: 1,  // Backend expects 'order', not 'stepNumber'
            description: 'Тимчасовий крок. Буде замінено при редагуванні.',
            duration: null,
          }
        ];
      }
      
      console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));
      
      if (mode === 'create') {
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
          console.error('❌ Backend error:', errorData);
          throw new Error(errorData.error || 'Failed to create recipe');
        }
        
        const data = await response.json();
        console.log('✅ Recipe created, backend response:', data);
        
        // Backend wraps response in { data: {...}, status: 'success' }
        const recipeData = data.data || data;
        const newRecipeId = recipeData.id || recipeData._id || recipeData.recipeId;
        
        if (!newRecipeId) {
          console.error('❌ No recipe ID in response:', data);
          toast.error('Рецепт створено, але не отримано ID');
          router.push('/admin/catalog');
          return;
        }
        
        console.log(`✅ Redirecting to edit page with ID: ${newRecipeId}`);
        toast.success('Рецепт успішно створено! Додайте інгредієнти та кроки');
        
        // Redirect to edit mode with content tab
        router.push(`/admin/catalog/recipes/${newRecipeId}/edit?tab=content`);
      } else {
        if (!recipeId) throw new Error('Recipe ID required for edit mode');
        
        const response = await fetch(`/api/admin/recipes/${recipeId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) throw new Error('Failed to update recipe');
        
        toast.success('Рецепт успішно оновлено');
        router.push('/admin/catalog');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error(mode === 'create' ? 'Помилка при створенні рецепта' : 'Помилка при оновленні рецепта');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('У вас є незбережені зміни. Ви впевнені, що хочете вийти?');
      if (!confirmed) return;
    }
    router.push('/admin/catalog');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="text-sm">
          {isDirty && (
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              • Незбережені зміни
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Скасувати
          </Button>
          <Button type="submit" disabled={isSaving || !isDirty}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Збереження...' : mode === 'create' ? 'Створити рецепт' : 'Зберегти зміни'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-9 p-0.5 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="basic" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm py-1.5">
            <FileText className="w-4 h-4 mr-2" />
            Основне
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm py-1.5">
            <ChefHat className="w-4 h-4 mr-2" />
            Контент
          </TabsTrigger>
          <TabsTrigger value="translations" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm py-1.5">
            <Globe className="w-4 h-4 mr-2" />
            Переклади
          </TabsTrigger>
          <TabsTrigger value="technical" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm py-1.5">
            <Beaker className="w-4 h-4 mr-2" />
            Технічне
          </TabsTrigger>
        </TabsList>

        {/* Tab: Основне */}
        <TabsContent value="basic" className="space-y-6 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Local Name */}
            <div className="space-y-2">
              <Label htmlFor="localName">Назва *</Label>
              <Input
                id="localName"
                value={formData.localName}
                onChange={(e) => handleChange('localName', e.target.value)}
                placeholder="Pierogi Ruskie"
                required
              />
            </div>

            {/* Canonical Name */}
            <div className="space-y-2">
              <Label htmlFor="canonicalName">Canonical Name *</Label>
              <Input
                id="canonicalName"
                value={formData.canonicalName}
                onChange={(e) => handleChange('canonicalName', e.target.value)}
                placeholder="pierogi-ruskie"
                required
              />
            </div>

            {/* Country - Autocomplete */}
            <CountryAutocomplete
              value={formData.countryCode || ''}
              onChange={(code) => handleChange('countryCode', code)}
            />

            {/* Cuisine - Autocomplete (filtered by country) */}
            <CuisineAutocomplete
              value={formData.cuisineId || ''}
              onChange={(cuisineId) => handleChange('cuisineId', cuisineId)}
              countryCode={formData.countryCode}
              required
            />

            {/* Category - Select */}
            <CategorySelect
              value={formData.categoryId || ''}
              onChange={(categoryId) => handleChange('categoryId', categoryId)}
            />

            {/* Difficulty - Select */}
            <DifficultySelect
              value={formData.difficulty}
              onChange={(value: any) => handleChange('difficulty', value)}
              required
            />

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Статус *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Чернетка</SelectItem>
                  <SelectItem value="published">Опубліковано</SelectItem>
                  <SelectItem value="archived">Архів</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="timeMinutes">Час (хвилини) *</Label>
              <Input
                id="timeMinutes"
                type="number"
                value={formData.timeMinutes}
                onChange={(e) => handleChange('timeMinutes', parseInt(e.target.value) || 0)}
                placeholder="30"
                min="1"
                required
              />
            </div>

            {/* Servings */}
            <div className="space-y-2">
              <Label htmlFor="servings">Порції *</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => handleChange('servings', parseInt(e.target.value) || 0)}
                placeholder="4"
                min="1"
                required
              />
            </div>

            {/* Portion Weight */}
            <div className="space-y-2">
              <Label htmlFor="portionWeightGrams">Вага порції (грами)</Label>
              <Input
                id="portionWeightGrams"
                type="number"
                value={formData.portionWeightGrams || ''}
                onChange={(e) => handleChange('portionWeightGrams', parseInt(e.target.value) || undefined)}
                placeholder="200"
              />
            </div>

            {/* Region (optional) */}
            <div className="space-y-2">
              <Label htmlFor="region">Регіон</Label>
              <Input
                id="region"
                value={formData.origin?.region || ''}
                onChange={(e) => handleOriginChange('region', e.target.value)}
                placeholder="Силезія"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Опціонально: специфічний регіон країни
              </p>
            </div>
          </div>

          {/* Description - Base Language Only */}
          <div className="space-y-2">
            <Label htmlFor="description">Опис *</Label>
            <Textarea
              id="description"
              value={formData.descriptionPl || ''}
              onChange={(e) => handleChange('descriptionPl', e.target.value)}
              placeholder="Tradycyjne polskie danie z ziemniakami i serem..."
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Основний опис рецепта. Переклади можна додати у вкладці "Переклади"
            </p>
          </div>
          </div>
        </TabsContent>

        {/* Tab: Контент (Ingredients + Steps) */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            {mode === 'create' ? (
              // Create mode: Show message
              <div className="text-center py-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800">
                <ChefHat className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                  Спочатку створіть рецепт
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Після збереження базової інформації ви зможете додати інгредієнти та кроки
                </p>
              </div>
            ) : (
              // Edit mode: Show editors
              <div className="space-y-8">
                <IngredientsEditor 
                  value={formData.ingredients.map(i => ({
                    ingredientId: i.ingredientId,
                    ingredientName: i.name,
                    amount: i.quantity,
                    unit: i.unit,
                  }))}
                  onChange={(ingredients) => {
                    handleChange('ingredients', ingredients.map(i => ({
                      ingredientId: i.ingredientId,
                      name: i.ingredientName,
                      quantity: i.amount,
                      unit: i.unit,
                    })));
                  }}
                  recipeId={recipeId}
                />
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <StepsEditor 
                    value={formData.steps.map(s => ({
                      stepNumber: s.stepNumber,
                      instructionPl: s.description,
                    }))}
                    onChange={(steps) => {
                      handleChange('steps', steps.map(s => ({
                        stepNumber: s.stepNumber,
                        description: s.instructionPl || '',
                      })));
                    }}
                    recipeId={recipeId}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab: Переклади */}
        <TabsContent value="translations" className="space-y-6 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            {/* Info Banner */}
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Переклади не обов'язкові.</strong> Ви можете додати їх пізніше. 
                Основна мова (польська) вже вказана у вкладці "Основне".
              </p>
            </div>

            {/* Polish Translation */}
            <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                🇵🇱 Polski (базова мова)
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="namePl">Назва</Label>
                <Input
                  id="namePl"
                  value={formData.translations.namePl || ''}
                  onChange={(e) => handleNestedChange('translations', 'namePl', e.target.value)}
                  placeholder="Pierogi ruskie"
                />
              </div>
            </div>

            {/* English Translation */}
            <div className="space-y-4 py-6 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                🇬🇧 English
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="nameEn">Назва</Label>
                <Input
                  id="nameEn"
                  value={formData.translations.nameEn || ''}
                  onChange={(e) => handleNestedChange('translations', 'nameEn', e.target.value)}
                  placeholder="Ruskie Pierogi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Опис</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn || ''}
                  onChange={(e) => handleChange('descriptionEn', e.target.value)}
                  placeholder="Traditional Polish dish with potatoes and cheese..."
                  rows={3}
                />
              </div>
            </div>

            {/* Ukrainian Translation */}
            <div className="space-y-4 py-6 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                🇺🇦 Українська
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="nameUk">Назва</Label>
                <Input
                  id="nameUk"
                  value={formData.translations.nameUk || ''}
                  onChange={(e) => handleNestedChange('translations', 'nameUk', e.target.value)}
                  placeholder="Вареники по-польськи"
                />
              </div>
            </div>

            {/* Russian Translation */}
            <div className="space-y-4 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                🇷🇺 Русский
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="nameRu">Назва</Label>
                <Input
                  id="nameRu"
                  value={formData.translations.nameRu || ''}
                  onChange={(e) => handleNestedChange('translations', 'nameRu', e.target.value)}
                  placeholder="Вареники по-польски"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionRu">Опис</Label>
                <Textarea
                  id="descriptionRu"
                  value={formData.descriptionRu || ''}
                  onChange={(e) => handleChange('descriptionRu', e.target.value)}
                  placeholder="Традиционное польское блюдо с картофелем и сыром..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Технічне */}
        <TabsContent value="technical" className="space-y-4 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <dl className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mode</dt>
                <dd className="text-gray-900 dark:text-white capitalize">{mode}</dd>
              </div>
              {recipeId && (
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recipe ID</dt>
                  <dd className="text-gray-900 dark:text-white">{recipeId}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ingredients Count</dt>
                <dd className="text-gray-900 dark:text-white">{formData.ingredients.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Steps Count</dt>
                <dd className="text-gray-900 dark:text-white">{formData.steps.length}</dd>
              </div>
            </dl>
          </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
