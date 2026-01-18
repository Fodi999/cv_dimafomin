/**
 * Recipe Creation Examples
 * Real-world usage patterns
 */

import { useRecipeCreate } from '@/hooks/useRecipeCreate';
import { useRouter } from 'next/navigation';
import { getRecipeTitle, getRecipeUrl } from '@/lib/recipe';

// =====================================================
// Example 1: Simple Recipe Creation
// =====================================================

export function Example1_SimpleCreate() {
  const router = useRouter();
  
  const { createRecipe, creating } = useRecipeCreate({
    onSuccess: (recipe) => {
      // Navigate to created recipe
      router.push(getRecipeUrl(recipe)); // /recipes/scrambled_eggs
    }
  });
  
  const handleSubmit = async () => {
    await createRecipe({
      localName: "Яичница",
      namePl: "Jajecznica",
      nameEn: "Scrambled Eggs",
      nameRu: "Яичница",
      difficulty: "easy",
      timeMinutes: 10,
      servings: 2,
      ingredients: [
        {
          ingredientId: "uuid-eggs",
          quantity: 3,
          unit: "шт",
        },
        {
          ingredientId: "uuid-butter",
          quantity: 20,
          unit: "г",
        }
      ],
      steps: [
        {
          stepNumber: 1,
          description: "Взбить яйца в миске",
          duration: 2,
        },
        {
          stepNumber: 2,
          description: "Растопить масло на сковороде",
          duration: 3,
        },
        {
          stepNumber: 3,
          description: "Вылить яйца и жарить 5 минут",
          duration: 5,
        }
      ]
    });
  };
  
  return (
    <button onClick={handleSubmit} disabled={creating}>
      {creating ? 'Creating...' : 'Create Scrambled Eggs'}
    </button>
  );
}

// =====================================================
// Example 2: With Form State
// =====================================================

import { useState, useEffect } from 'react';

export function Example2_WithForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    localName: '',
    difficulty: 'easy' as const,
    timeMinutes: 30,
  });
  
  const { createRecipe, creating, error } = useRecipeCreate({
    onSuccess: (recipe) => {
      console.log('Created:', recipe.canonicalName);
      router.push(`/recipes/${recipe.canonicalName}`);
    },
    onError: (err) => {
      console.error('Failed:', err.message);
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createRecipe({
      localName: formData.localName,
      difficulty: formData.difficulty,
      timeMinutes: formData.timeMinutes,
      servings: 2,
      ingredients: [],
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.localName}
        onChange={(e) => setFormData({ ...formData, localName: e.target.value })}
        placeholder="Recipe name"
      />
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button type="submit" disabled={creating}>
        {creating ? 'Creating...' : 'Create Recipe'}
      </button>
    </form>
  );
}

// =====================================================
// Example 3: Multi-language Form
// =====================================================

import { useLanguage } from '@/contexts/LanguageContext';

export function Example3_Multilingual() {
  const { language } = useLanguage();
  const router = useRouter();
  
  const [names, setNames] = useState({
    pl: '',
    en: '',
    ru: '',
  });
  
  const { createRecipe, creating } = useRecipeCreate({
    onSuccess: (recipe) => {
      const title = getRecipeTitle(recipe, language);
      console.log(`Created: ${title} (${recipe.canonicalName})`);
      router.push(getRecipeUrl(recipe));
    }
  });
  
  const handleSubmit = async () => {
    await createRecipe({
      localName: names[language] || names.en || names.pl,
      namePl: names.pl,
      nameEn: names.en,
      nameRu: names.ru,
      difficulty: "medium",
      timeMinutes: 45,
      servings: 4,
      ingredients: [],
    });
  };
  
  return (
    <div>
      <input
        placeholder="Polish name"
        value={names.pl}
        onChange={(e) => setNames({ ...names, pl: e.target.value })}
      />
      <input
        placeholder="English name"
        value={names.en}
        onChange={(e) => setNames({ ...names, en: e.target.value })}
      />
      <input
        placeholder="Russian name"
        value={names.ru}
        onChange={(e) => setNames({ ...names, ru: e.target.value })}
      />
      
      <button onClick={handleSubmit} disabled={creating}>
        Create
      </button>
    </div>
  );
}

// =====================================================
// Example 4: With AI Generation
// =====================================================

export function Example4_AIGenerated() {
  const router = useRouter();
  const { createRecipe, creating } = useRecipeCreate({
    onSuccess: (recipe) => {
      router.push(`/recipes/${recipe.canonicalName}`);
    }
  });
  
  const generateAndCreate = async (userPrompt: string) => {
    // 1. Generate recipe with AI
    const aiResponse = await fetch('/api/ai/generate-recipe', {
      method: 'POST',
      body: JSON.stringify({ prompt: userPrompt }),
    });
    const aiRecipe = await aiResponse.json();
    
    // 2. Create recipe with AI data
    await createRecipe({
      localName: aiRecipe.name,
      namePl: aiRecipe.translations?.pl,
      nameEn: aiRecipe.translations?.en,
      nameRu: aiRecipe.translations?.ru,
      descriptionEn: aiRecipe.description,
      difficulty: aiRecipe.difficulty,
      timeMinutes: aiRecipe.cookingTime,
      servings: aiRecipe.servings,
      ingredients: aiRecipe.ingredients.map((ing: any) => ({
        ingredientId: ing.id,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      steps: aiRecipe.steps.map((step: any, idx: number) => ({
        stepNumber: idx + 1,
        description: step.text,
        duration: step.duration,
      })),
    });
  };
  
  return (
    <button onClick={() => generateAndCreate("Italian pasta carbonara")}>
      Generate & Create Recipe
    </button>
  );
}

// =====================================================
// Example 5: Batch Creation
// =====================================================

export function Example5_BatchCreate() {
  const { createRecipe, creating } = useRecipeCreate();
  
  const createMultiple = async () => {
    const recipes = [
      { localName: "Яичница", difficulty: "easy" as const, timeMinutes: 10 },
      { localName: "Борщ", difficulty: "medium" as const, timeMinutes: 90 },
      { localName: "Пельмени", difficulty: "hard" as const, timeMinutes: 120 },
    ];
    
    for (const recipe of recipes) {
      const result = await createRecipe({
        ...recipe,
        servings: 2,
        ingredients: [],
      });
      
      if (result) {
        console.log(`✅ Created: ${result.canonicalName}`);
      }
    }
  };
  
  return (
    <button onClick={createMultiple} disabled={creating}>
      Create Multiple Recipes
    </button>
  );
}

// =====================================================
// Example 6: Recipe Display
// =====================================================

import type { Recipe } from '@/lib/recipe';

export function Example6_RecipeCard({ recipe }: { recipe: Recipe }) {
  const { language } = useLanguage();
  
  const title = getRecipeTitle(recipe, language);
  const url = getRecipeUrl(recipe);
  
  return (
    <a href={url}>
      <h3>{title}</h3>
      <p>{recipe.timeMinutes} min · {recipe.difficulty}</p>
      <code className="text-xs text-muted-foreground">
        {recipe.canonicalName}
      </code>
    </a>
  );
}

// =====================================================
// Example 7: Recipe List
// =====================================================

export function Example7_RecipeList() {
  const { language } = useLanguage();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  useEffect(() => {
    async function loadRecipes() {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setRecipes(data.data.recipes);
    }
    loadRecipes();
  }, []);
  
  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.canonicalName}>
          <h3>{getRecipeTitle(recipe, language)}</h3>
          <a href={getRecipeUrl(recipe)}>View Recipe</a>
        </div>
      ))}
    </div>
  );
}
