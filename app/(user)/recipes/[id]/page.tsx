'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, ChefHat, Loader2, AlertCircle, Globe, Flame, CheckCircle, XCircle, ShoppingCart, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchRecipeDetails, type RecipeDetails } from '@/lib/api/catalog';
import Image from 'next/image';

const difficultyConfig = {
  easy: { label: 'Легкий', color: 'text-green-600', bgColor: 'bg-green-50' },
  medium: { label: 'Средний', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  hard: { label: 'Сложный', color: 'text-red-600', bgColor: 'bg-red-50' },
};

export default function RecipeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { t } = useLanguage();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!recipeId) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadRecipeDetails();
  }, [recipeId, isAuthenticated]);

  const loadRecipeDetails = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      console.log('🔍 Loading recipe details for:', recipeId, forceRefresh ? '(FORCE REFRESH)' : '');

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ru' : 'ru';
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const recipeData = await fetchRecipeDetails(recipeId, token, lang);
      
      console.log('✅ Recipe loaded with ingredients:', {
        total: recipeData.ingredients.length,
        inFridge: recipeData.ingredients.filter(i => i.inFridge).length,
        missing: recipeData.ingredients.filter(i => !i.inFridge).length,
        ingredients: recipeData.ingredients.map(i => ({
          name: i.name,
          inFridge: i.inFridge,
          quantity: i.quantity,
          unit: i.unit
        }))
      });
      
      setRecipe(recipeData);
    } catch (err: any) {
      console.error('❌ Failed to load recipe details:', err);
      setError(err.message || 'Произошла ошибка при загрузке');
      
      if (err.message.includes('Token expired')) {
        // Clear expired token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setTimeout(() => openAuthModal('login'), 500);
      } else if (err.message.includes('Authentication') || err.message.includes('авторизация')) {
        setTimeout(() => openAuthModal('login'), 500);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.auth?.authRequired || 'Требуется авторизация'}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t.auth?.pleaseLogin || 'Пожалуйста, войдите в систему'}</p>
          <button onClick={() => openAuthModal('login')} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all">{t.auth?.loginButton || 'Войти'}</button>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">{t.common?.loading || 'Загрузка...'}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">{t.common?.error || 'Ошибка'}</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button onClick={() => router.back()} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all">{t.common?.back || 'Назад'}</button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const difficulty = difficultyConfig[recipe.difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium;
  
  // Calculate match statistics
  const totalIngredients = recipe.ingredients.length;
  const availableIngredients = recipe.ingredients.filter(i => i.inFridge).length;
  const missingIngredients = totalIngredients - availableIngredients;
  const matchPercent = totalIngredients > 0 ? Math.round((availableIngredients / totalIngredients) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button and refresh */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>{t.common?.back || 'Назад'}</span>
          </button>
          
          <button 
            onClick={() => loadRecipeDetails(true)} 
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{t.common?.refresh || 'Обновить'}</span>
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {recipe.imageUrl && (
            <div className="relative w-full h-64 sm:h-80">
              <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{recipe.title}</h1>

            {/* Match status badge */}
            {missingIngredients === 0 ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
                <CheckCircle className="w-4 h-4" />
                <span>Все ингредиенты есть! Можно готовить</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>Не хватает {missingIngredients} {missingIngredients === 1 ? 'ингредиент' : missingIngredients < 5 ? 'ингредиента' : 'ингредиентов'}</span>
                <span className="ml-2 font-bold">{matchPercent}% совпадение</span>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5" />
                <span>{recipe.cookTime} мин</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users className="w-5 h-5" />
                <span>{recipe.servings} порций</span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className={`px-2 py-1 rounded ${difficulty.bgColor} ${difficulty.color} text-sm font-medium`}>{difficulty.label}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Globe className="w-5 h-5" />
                <span>{recipe.country}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Flame className="w-5 h-5" />
                <span>{recipe.category}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ингредиенты</h2>
          
          {/* Available ingredients */}
          {recipe.ingredients.filter(i => i.inFridge).length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Из холодильника ({recipe.ingredients.filter(i => i.inFridge).length})
                </h3>
              </div>
              <ul className="space-y-2">
                {recipe.ingredients.filter(i => i.inFridge).map((ingredient, index) => (
                  <motion.li 
                    key={ingredient.id || index} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: index * 0.05 }} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{ingredient.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ingredient.quantity} {ingredient.unit}
                        {ingredient.fridgeQuantity && ingredient.fridgeQuantity > 0 && (
                          <span className="ml-2 text-green-600 dark:text-green-400">
                            (У вас: {ingredient.fridgeQuantity} {ingredient.unit})
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing ingredients */}
          {recipe.ingredients.filter(i => !i.inFridge).length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Нужно купить ({recipe.ingredients.filter(i => !i.inFridge).length})
                  </h3>
                </div>
                <button
                  onClick={() => loadRecipeDetails()}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Обновить</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                💡 После добавления продуктов в холодильник, нажмите "Обновить" чтобы увидеть изменения
              </p>
              <ul className="space-y-2">
                {recipe.ingredients.filter(i => !i.inFridge).map((ingredient, index) => (
                  <motion.li 
                    key={ingredient.id || index} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: index * 0.05 }} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                  >
                    <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{ingredient.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ingredient.quantity} {ingredient.unit}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Инструкции</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <motion.li key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold">{index + 1}</span>
                <p className="flex-1 text-gray-700 dark:text-gray-300 pt-1">{step}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {recipe.tags && recipe.tags.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">#{tag}</span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
