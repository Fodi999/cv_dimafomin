/**
 * Recipe Create Form - Example Component
 * Demonstrates canonicalName pattern usage
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeCreate } from '@/hooks/useRecipeCreate';
import { useLanguage } from '@/contexts/LanguageContext';
import type { RecipeCreateRequest } from '@/lib/types/recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function RecipeCreateForm() {
  const router = useRouter();
  const { language } = useLanguage();
  
  const { createRecipe, creating } = useRecipeCreate({
    onSuccess: (recipe) => {
      console.log('✅ Recipe created with canonicalName:', recipe.canonicalName);
      router.push(`/recipes/${recipe.canonicalName}`);
    }
  });
  
  // Form state
  const [formData, setFormData] = useState({
    localName: '',
    namePl: '',
    nameEn: '',
    nameRu: '',
    descriptionPl: '',
    descriptionEn: '',
    descriptionRu: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    timeMinutes: 30,
    servings: 2,
    category: 'main',
    country: 'PL',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.localName) {
      alert('Local name is required');
      return;
    }
    
    const request: RecipeCreateRequest = {
      localName: formData.localName,
      namePl: formData.namePl || undefined,
      nameEn: formData.nameEn || undefined,
      nameRu: formData.nameRu || undefined,
      descriptionPl: formData.descriptionPl || undefined,
      descriptionEn: formData.descriptionEn || undefined,
      descriptionRu: formData.descriptionRu || undefined,
      difficulty: formData.difficulty,
      timeMinutes: formData.timeMinutes,
      servings: formData.servings,
      category: formData.category || undefined,
      country: formData.country || undefined,
      ingredients: [], // TODO: Add ingredients form
      steps: [],       // TODO: Add steps form
    };
    
    await createRecipe(request);
  };
  
  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Recipe</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Local Name (Required)
              </label>
              <Input
                value={formData.localName}
                onChange={(e) => setFormData({ ...formData, localName: e.target.value })}
                placeholder="e.g., Яичница, Jajecznica"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Backend will generate English canonicalName automatically
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Polish Name
                </label>
                <Input
                  value={formData.namePl}
                  onChange={(e) => setFormData({ ...formData, namePl: e.target.value })}
                  placeholder="Jajecznica"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  English Name
                </label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Scrambled Eggs"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Russian Name
                </label>
                <Input
                  value={formData.nameRu}
                  onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                  placeholder="Яичница"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Descriptions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Descriptions</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Polish Description
              </label>
              <Textarea
                value={formData.descriptionPl}
                onChange={(e) => setFormData({ ...formData, descriptionPl: e.target.value })}
                placeholder="Prosta jajecznica na maśle..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                English Description
              </label>
              <Textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                placeholder="Simple scrambled eggs with butter..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Russian Description
              </label>
              <Textarea
                value={formData.descriptionRu}
                onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                placeholder="Простая яичница на масле..."
                rows={3}
              />
            </div>
          </div>
        </div>
        
        {/* Metrics */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recipe Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  difficulty: e.target.value as 'easy' | 'medium' | 'hard' 
                })}
                className="w-full p-2 border rounded"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="main">Main Course</option>
                <option value="breakfast">Breakfast</option>
                <option value="salad">Salad</option>
                <option value="soup">Soup</option>
                <option value="dessert">Dessert</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Cooking Time (minutes)
              </label>
              <Input
                type="number"
                value={formData.timeMinutes}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  timeMinutes: parseInt(e.target.value) || 0 
                })}
                min={1}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Servings
              </label>
              <Input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  servings: parseInt(e.target.value) || 1 
                })}
                min={1}
              />
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={creating}
            className="flex-1"
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Recipe'
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={creating}
          >
            Cancel
          </Button>
        </div>
        
        {/* Info */}
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Backend will automatically generate a unique{' '}
            <code className="bg-background px-1 rounded">canonicalName</code> in English.
            For example: "Яичница" → "scrambled_eggs"
          </p>
        </div>
      </form>
    </Card>
  );
}
