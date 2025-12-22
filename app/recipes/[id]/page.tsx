'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ChefHat, 
  Star,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-interceptor';

interface RecipeDetails {
  id: string;
  localName: string;
  canonicalName: string;
  country: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeMinutes: number;
  servings: number;
  category: string;
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    inFridge: boolean;
    fridgeQuantity?: number;
  }[];
  instructions: string[];
  tags: string[];
  isSaved?: boolean;
}

const difficultyConfig = {
  easy: { label: 'Łatwy', color: 'text-green-600', bgColor: 'bg-green-50' },
  medium: { label: 'Średni', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  hard: { label: 'Trudny', color: 'text-red-600', bgColor: 'bg-red-50' },
};

export default function RecipeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;
    loadRecipeDetails();
  }, [recipeId]);

  const loadRecipeDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Loading recipe details for ID:', recipeId);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // ✅ Fetch from backend API with Authorization header
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Sending request with auth token');
      } else {
        console.log('⚠️ No token found - sending public request');
      }

      const response = await fetch(`/api/recipes/${recipeId}`, {
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Wymagana autoryzacja. Zaloguj się, aby zobaczyć szczegóły przepisu.');
        }
        throw new Error('Nie udało się załadować przepisu');
      }

      const data = await response.json();
      console.log('📥 Recipe data received:', data);

      if (data.success && data.data) {
        const backendRecipe = data.data;
        
        // Transform backend response to frontend format
        const transformedRecipe: RecipeDetails = {
          id: backendRecipe.id,
          localName: backendRecipe.localName || backendRecipe.canonicalName,
          canonicalName: backendRecipe.canonicalName,
          country: backendRecipe.country || 'Unknown',
          difficulty: backendRecipe.difficulty || 'medium',
          timeMinutes: backendRecipe.timeMinutes || 0,
          servings: backendRecipe.servings || 0,
          category: backendRecipe.category || 'main',
          ingredients: (backendRecipe.ingredients || []).map((ing: any) => ({
            id: ing.id,
            name: ing.ingredient?.name || ing.name || 'Unknown',
            quantity: ing.quantity || 0,
            unit: ing.unit || '',
            inFridge: ing.inFridge || false,
            fridgeQuantity: ing.fridgeQuantity || 0,
          })),
          instructions: backendRecipe.instructions || [
            'Instrukcje będą dostępne wkrótce.',
          ],
          tags: backendRecipe.tags || [],
          isSaved: backendRecipe.isSaved || false,
        };

        setRecipe(transformedRecipe);
        console.log('✅ Recipe loaded:', transformedRecipe.localName);
        console.log('📦 Full recipe object:', transformedRecipe);
      } else {
        throw new Error('Nieprawidłowa odpowiedź z serwera');
      }
    } catch (err: any) {
      console.error('❌ Failed to load recipe details:', err);
      setError(err.message || 'Nie udało się załadować przepisu');
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log render state
  console.log('🎨 Rendering RecipeDetailsPage:', { loading, error, hasRecipe: !!recipe, recipeName: recipe?.localName });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4">
        <div className="max-w-4xl mx-auto pt-[80px]">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-400">Ładowanie przepisu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4">
        <div className="max-w-4xl mx-auto pt-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-200 mb-1">
                  Błąd ładowania
                </p>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {error}
                </p>
                <button
                  onClick={() => router.back()}
                  className="mt-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                >
                  Wróć
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4">
        <div className="max-w-4xl mx-auto pt-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-200 mb-1">
                  Błąd ładowania
                </p>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {error || 'Nie znaleziono przepisu'}
                </p>
                <button
                  onClick={() => router.back()}
                  className="mt-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                >
                  Wróć
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const difficulty = difficultyConfig[recipe.difficulty];
  const ingredientsInFridge = recipe.ingredients.filter(i => i.inFridge).length;
  const missingIngredients = recipe.ingredients.filter(i => !i.inFridge).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4">
      <div className="max-w-4xl mx-auto pt-[80px] space-y-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Wróć</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {recipe.localName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{recipe.canonicalName}</p>
            </div>
            {recipe.isSaved && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-medium">
                <Star className="w-4 h-4" />
                Zapisany
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              🌍 {recipe.country}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
              <Clock className="w-4 h-4" />
              {recipe.timeMinutes} min
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
              <Users className="w-4 h-4" />
              {recipe.servings} porcje
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${difficulty.bgColor} ${difficulty.color}`}>
              <ChefHat className="w-4 h-4" />
              {difficulty.label}
            </span>
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Składniki
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                {ingredientsInFridge} w lodówce
              </span>
              {missingIngredients > 0 && (
                <span className="flex items-center gap-1 text-orange-600">
                  <XCircle className="w-4 h-4" />
                  {missingIngredients} brakuje
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {recipe.ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  ingredient.inFridge
                    ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                    : 'bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {ingredient.inFridge ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-600" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {ingredient.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-700 dark:text-gray-300">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                  {ingredient.inFridge && ingredient.fridgeQuantity && (
                    <span className="block text-xs text-gray-500">
                      (masz: {ingredient.fridgeQuantity} {ingredient.unit})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {missingIngredients > 0 && (
            <button
              className="mt-4 w-full px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Dodaj brakujące do zakupów
            </button>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Sposób przygotowania
          </h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="flex-1 text-gray-700 dark:text-gray-300 pt-1">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 sticky bottom-4"
        >
          <button
            className={`flex-1 px-6 py-4 rounded-lg ${
              missingIngredients === 0
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
            } text-white font-medium shadow-lg transition-all flex items-center justify-center gap-2`}
          >
            <ChefHat className="w-5 h-5" />
            {missingIngredients === 0 ? '🍳 Ugotuj' : '⚠️ Brakuje składników'}
          </button>
          {!recipe.isSaved && (
            <button
              className="px-6 py-4 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium shadow-lg transition-all flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Zapisz
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
