'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Loader2, AlertCircle, Filter, CheckCircle, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SavedRecipeCard, { type SavedRecipe } from '@/components/recipes/SavedRecipeCard';
import { recipeMatchingApi } from '@/lib/api';
import { generateUUID } from '@/lib/uuid';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/common/Toast';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { authFetch, isTokenValid } from '@/lib/auth-interceptor';

export default function SavedRecipesPage() {
  console.log('🟢 SavedRecipesPage component rendered');
  
  const router = useRouter();
  const { openAuthModal, isAuthenticated } = useAuth();
  const toast = useToast();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'almost' | 'missing'>('all');
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    recipeId: string | null;
    recipeName: string;
  }>({
    isOpen: false,
    recipeId: null,
    recipeName: '',
  });

  // Check if user is authenticated on mount and after login
  useEffect(() => {
    console.log('🔍 SavedRecipesPage - checking auth, isAuthenticated:', isAuthenticated);
    
    if (typeof window !== 'undefined') {
      const hasValidToken = isTokenValid();
      
      if (!hasValidToken || !isAuthenticated) {
        console.warn('⚠️ Token invalid or not authenticated - showing auth message');
        setNeedsAuth(true);
        setLoading(false);
        
        if (!hasValidToken) {
          toast.warning('Sesja wygasła', 'Zaloguj się ponownie');
          setTimeout(() => openAuthModal('login'), 500);
        }
        return;
      }
      
      // Token is valid AND user is authenticated - load recipes
      console.log('✅ User authenticated - loading recipes');
      setNeedsAuth(false);
      loadSavedRecipes();
    }
  }, [isAuthenticated]); // 🔧 Перезагружаем когда меняется isAuthenticated

  const loadSavedRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Loading saved recipes with authFetch...');

      // Use authFetch - automatically handles 401 and auth headers
      const response = await authFetch('/api/user/recipes/saved');

      if (!response.ok) {
        throw new Error('Nie udało się załadować przepisów');
      }

      const data = await response.json();
      console.log('📥 Saved recipes data:', data);

      if (data.success && data.data) {
        // ✅ Backend returns: { success: true, data: { recipes: [...], count: N } }
        const backendRecipes = data.data.recipes ?? [];
        
        // 🔧 Transform backend structure to frontend format
        const transformedRecipes = backendRecipes.map((item: any) => ({
          id: item.id || item.recipe?.id,
          recipeId: item.recipe?.id || item.recipeId,
          recipeName: item.recipe?.localName || item.recipeName || 'Bez nazwy',
          recipeCountry: item.recipe?.country || item.recipeCountry || 'Nieznany',
          recipeDifficulty: item.recipe?.difficulty || item.recipeDifficulty || 'medium',
          recipeTimeMinutes: item.recipe?.timeMinutes || item.recipeTimeMinutes || 0,
          recipeServings: item.servings || item.recipeServings || 0,
          savedAt: item.savedAt || new Date().toISOString(),
          cookedCount: item.cookCount || item.cookedCount || 0,
          lastCookedAt: item.cookedAt || item.lastCookedAt || null,
          canCookNow: item.canCookNow ?? false,
          missingIngredientsCount: item.missingIngredientsCount || 0,
          usedIngredientsValue: item.usedIngredientsValue,
          missingIngredientsCost: item.missingIngredientsCost,
          totalWasteSaved: item.totalWasteSaved,
        }));
        
        setRecipes(transformedRecipes);
        console.log(`✅ Loaded ${transformedRecipes.length} saved recipes`);
        
        if (transformedRecipes.length === 0) {
          toast.info('Brak zapisanych przepisów', 'Zacznij zapisywać przepisy z AI Asystenta!');
        }
      }
    } catch (err: any) {
      console.error('❌ Failed to load saved recipes:', err);
      setError(err.message || 'Wystąpił błąd podczas ładowania');
      toast.error('Błąd ładowania', err.message || 'Nie udało się załadować przepisów');
    } finally {
      setLoading(false);
    }
  };

  // Handle cooking a recipe with error handling
  const handleCook = useCallback(async (recipeId: string, skipConfirmation: boolean = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Wymagana autoryzacja', 'Zaloguj się, aby ugotować przepis');
      openAuthModal('login');
      return;
    }

    // Find recipe to check if already cooked
    const recipe = recipes.find(r => r.recipeId === recipeId);
    
    // If already cooked and no confirmation yet, show modal
    if (recipe?.lastCookedAt && !skipConfirmation) {
      setConfirmModal({
        isOpen: true,
        recipeId: recipeId,
        recipeName: recipe.recipeName,
      });
      return;
    }

    try {
      console.log('👨‍🍳 Cooking saved recipe:', recipeId);

      const result = await recipeMatchingApi.cookRecipe(
        recipeId,
        { 
          idempotencyKey: generateUUID(), 
          servingsMultiplier: 1 
        },
        token
      );

      if (result.success) {
        // Success toast with economy info
        const usedValue = result.economySnapshot.usedValue.toFixed(2);
        const savedValue = result.economySnapshot.wasteRiskSaved.toFixed(2);
        const currency = result.economySnapshot.currency;
        const ingredientsCount = result.ingredientsUsed.length;

        toast.success(
          'Smacznego! 🍽️',
          `Wykorzystano ${ingredientsCount} ${ingredientsCount === 1 ? 'składnik' : 'składników'} (${usedValue} ${currency}). Uratowano ${savedValue} ${currency}!`,
          7000
        );

        // Reload recipes to update cookedCount
        await loadSavedRecipes();
      }
    } catch (err: any) {
      console.error('❌ Failed to cook recipe:', err);

      // Handle specific error cases with appropriate toasts
      if (err.status === 409) {
        // Already cooked - but this shouldn't happen now since we check before
        toast.warning(
          'Już ugotowane',
          'Ten przepis został już oznaczony jako ugotowany dzisiaj',
          5000
        );
      } else if (err.status === 400) {
        // Insufficient ingredients or validation error
        const message = err.message || 'Nie masz wystarczająco składników w lodówce';
        toast.error(
          'Brak składników',
          message,
          6000
        );
      } else if (err.status === 404) {
        toast.error('Przepis nie znaleziony', 'Nie można znaleźć tego przepisu w katalogu');
      } else {
        toast.error(
          'Nie udało się ugotować',
          err.message || 'Spróbuj ponownie za chwilę'
        );
      }
    }
  }, [toast, router, recipes]);

  // Handle confirmation modal - cook recipe after user confirms
  const handleConfirmCook = useCallback(() => {
    if (confirmModal.recipeId) {
      handleCook(confirmModal.recipeId, true); // Skip confirmation this time
    }
    setConfirmModal({ isOpen: false, recipeId: null, recipeName: '' });
  }, [confirmModal.recipeId, handleCook]);

  // Handle deleting a recipe
  const handleDelete = useCallback(async (recipeId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Wymagana autoryzacja', 'Zaloguj się, aby usunąć przepis');
      return;
    }

    // Optimistic update - remove from UI immediately
    setRecipes(prev => prev.filter(r => r.recipeId !== recipeId));

    try {
      console.log('🗑️ Deleting saved recipe:', recipeId);

      const response = await fetch(`/api/user/recipes/saved/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Usunięto z zapisanych', 'Przepis został usunięty z Twoich zapisanych');
      } else {
        throw new Error(data.message || 'Nie udało się usunąć przepisu');
      }
    } catch (err: any) {
      console.error('❌ Failed to delete recipe:', err);
      toast.error('Nie udało się usunąć', err.message || 'Spróbuj ponownie');
      
      // Rollback - reload recipes on error
      await loadSavedRecipes();
    }
  }, [toast]);

  // 🎯 Filter and sort recipes
  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      switch (activeFilter) {
        case 'ready':
          return recipe.canCookNow === true;
        case 'almost':
          return !recipe.canCookNow && (recipe.missingIngredientsCount ?? 0) <= 2;
        case 'missing':
          return (recipe.missingIngredientsCount ?? 0) > 2;
        case 'all':
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // 📊 Sort by readiness (ready first, then by missing count)
      const aReady = a.canCookNow ? 1 : 0;
      const bReady = b.canCookNow ? 1 : 0;
      
      if (aReady !== bReady) {
        return bReady - aReady; // Ready recipes first
      }
      
      // If both ready or both not ready, sort by missing ingredients count
      const aMissing = a.missingIngredientsCount ?? 999;
      const bMissing = b.missingIngredientsCount ?? 999;
      return aMissing - bMissing; // Fewer missing first
    });

  // Count recipes in each filter category
  const filterCounts = {
    all: recipes.length,
    ready: recipes.filter(r => r.canCookNow === true).length,
    almost: recipes.filter(r => !r.canCookNow && (r.missingIngredientsCount ?? 0) <= 2).length,
    missing: recipes.filter(r => (r.missingIngredientsCount ?? 0) > 2).length,
  };


  // Show auth required message
  if (needsAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4">
        <div className="max-w-7xl mx-auto pt-[80px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center space-y-6 max-w-md">
              <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Star className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Wymagana autoryzacja
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Zaloguj się, aby zobaczyć swoje zapisane przepisy
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('login')}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
              >
                Zaloguj się
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4">
        <div className="max-w-7xl mx-auto pt-[80px]">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-400">Ładowanie zapisanych przepisów...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4">
        <div className="max-w-7xl mx-auto pt-[80px]">
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4">
      <div className="max-w-7xl mx-auto pt-[80px] space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Moja kuchnia
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Twoje przepisy gotowe do ugotowania
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        {recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 justify-center"
          >
            {/* All */}
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Wszystkie</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeFilter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {filterCounts.all}
              </span>
            </button>

            {/* Ready */}
            <button
              onClick={() => setActiveFilter('ready')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'ready'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Gotowe</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeFilter === 'ready'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {filterCounts.ready}
              </span>
            </button>

            {/* Almost ready */}
            <button
              onClick={() => setActiveFilter('almost')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'almost'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Prawie gotowe</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeFilter === 'almost'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {filterCounts.almost}
              </span>
            </button>

            {/* Missing ingredients */}
            <button
              onClick={() => setActiveFilter('missing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'missing'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Wymaga zakupów</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeFilter === 'missing'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {filterCounts.missing}
              </span>
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {recipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-12 text-center"
          >
            <Star className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nie masz zapisanych przepisów
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Zacznij zapisywać przepisy, które Ci się podobają
            </p>
            <button
              onClick={() => router.push('/assistant')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
            >
              <Search className="w-5 h-5 inline-block mr-2" />
              Znajdź przepisy
            </button>
          </motion.div>
        )}

        {/* Recipes Grid */}
        {recipes.length > 0 && (
          <>
            {/* No results for current filter */}
            {filteredAndSortedRecipes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-12 text-center"
              >
                <Filter className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Brak przepisów w tej kategorii
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Spróbuj zmienić filtr lub dodaj więcej przepisów
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
                >
                  Pokaż wszystkie
                </button>
              </motion.div>
            )}

            {/* Recipes Grid */}
            {filteredAndSortedRecipes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAndSortedRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SavedRecipeCard
                      recipe={recipe}
                      onCook={handleCook}
                      onDelete={handleDelete}
                      isLoading={loading}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Count Badge */}
        {recipes.length > 0 && filteredAndSortedRecipes.length > 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {activeFilter === 'all' ? (
              <>Masz {recipes.length} {recipes.length === 1 ? 'zapisany przepis' : 'zapisanych przepisów'}</>
            ) : (
              <>Wyświetlono {filteredAndSortedRecipes.length} z {recipes.length} przepisów</>
            )}
          </div>
        )}
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      
      {/* Confirmation Modal for already cooked recipes */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, recipeId: null, recipeName: '' })}
        onConfirm={handleConfirmCook}
        title="Już gotowałeś ten przepis"
        message={`Przepis "${confirmModal.recipeName}" został już ugotowany wcześniej. Czy chcesz ugotować go ponownie?`}
        confirmText="Ugotuj ponownie"
        cancelText="Anuluj"
        type="warning"
      />
    </div>
  );
}
