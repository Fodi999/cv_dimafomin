'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Loader2, AlertCircle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchRecipeCatalog, type CatalogRecipe } from '@/lib/api/catalog';
import CatalogRecipeCard from '@/components/recipes/CatalogRecipeCard';

export default function RecipeCatalogPage() {
  console.log('🟢 RecipeCatalogPage component rendered');
  
  const router = useRouter();
  const { openAuthModal, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [recipes, setRecipes] = useState<CatalogRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load recipes on mount
  useEffect(() => {
    if (!isAuthenticated) {
      console.warn('⚠️ User not authenticated');
      setLoading(false);
      return;
    }
    
    loadRecipes();
  }, [isAuthenticated]);

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📚 Loading recipe catalog...');
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ru' : 'ru';
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const catalogData = await fetchRecipeCatalog(token, lang, 100);
      
      setRecipes(catalogData.recipes);
      console.log(`✅ Loaded ${catalogData.recipes.length} recipes from catalog`);
    } catch (err: any) {
      console.error('❌ Failed to load recipe catalog:', err);
      setError(err.message || 'Произошла ошибка при загрузке');
      
      if (err.message.includes('Authentication')) {
        setTimeout(() => openAuthModal('login'), 500);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auth required state
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.auth?.authRequired || 'Требуется авторизация'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t.auth?.pleaseLogin || 'Пожалуйста, войдите в систему, чтобы просмотреть каталог рецептов'}
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
          >
            {t.auth?.loginButton || 'Войти'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Каталог рецептов
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Все рецепты из базы • Зеленый бейдж = можно готовить сейчас
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {t.common?.loading || 'Загрузка...'}
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
              {t.common?.error || 'Ошибка'}
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={loadRecipes}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
            >
              {t.common?.retry || 'Попробовать снова'}
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-12 text-center"
          >
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t.recipes?.list?.noRecipes || 'Рецепты не найдены'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t.recipes?.list?.createFirst || 'В каталоге пока нет рецептов'}
            </p>
            <button
              onClick={() => router.push('/assistant')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
            >
              <Search className="w-5 h-5 inline-block mr-2" />
              {t.common?.search || 'Найти рецепты'}
            </button>
          </motion.div>
        )}

        {/* Recipe Grid */}
        {!loading && !error && recipes.length > 0 && (
          <>
            {/* Recipe Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <p className="text-gray-600 dark:text-gray-400">
                {t.common?.total || 'Всего'}: <span className="font-semibold text-gray-900 dark:text-white">{recipes.length}</span> {t.recipes?.list?.recipesCount || 'рецептов'}
              </p>
            </motion.div>

            {/* Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CatalogRecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
