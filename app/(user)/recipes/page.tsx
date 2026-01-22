"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MenuRecipeCard } from "@/components/recipes/MenuRecipeCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, ChefHat, ArrowLeft, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { menuApi, TodayMenuItem } from "@/lib/api/menu";
import { toast } from "sonner";

export default function RecipesPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { token } = useAuth();
  
  const [menu, setMenu] = useState<TodayMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Tab navigation: 'menu' | 'cooking' | 'history'
  const [activeTab, setActiveTab] = useState<'menu' | 'cooking' | 'history'>('menu');

  useEffect(() => {
    if (token) {
      loadTodayMenu();
    }
  }, [token, language]);

  // 👂 Listen for recipe-saved event from assistant page
  useEffect(() => {
    const handleRecipeSaved = () => {
      console.log("📢 [page] recipe-saved event received");
      loadTodayMenu();
    };

    window.addEventListener('recipe-saved', handleRecipeSaved);
    return () => window.removeEventListener('recipe-saved', handleRecipeSaved);
  }, [token]);

  async function loadTodayMenu() {
    if (!token) {
      setError("Пожалуйста, войдите в систему");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("🍽️ [page] Loading today's menu...");
      const response = await menuApi.getToday(token, language);
      
      console.log("✅ [page] RAW response from menuApi:", {
        isArray: Array.isArray(response),
        length: Array.isArray(response) ? response.length : 'NOT_ARRAY',
        data: response,
      });
      
      // Ensure we have an array
      const menuItems = Array.isArray(response) ? response : [];
      
      console.log("📊 [page] Menu items after filtering:", {
        menu: menuItems.filter(i => i.status === "menu").length,
        cooking: menuItems.filter(i => i.status === "cooking").length,
        history: menuItems.filter(i => i.status === "history").length,
        total: menuItems.length,
      });
      
      // Set full menu array (component will filter)
      setMenu(menuItems);
    } catch (err: any) {
      console.error("❌ [page] Failed to load today's menu:", err);
      setError(err.message || "Не удалось загрузить меню");
    } finally {
      setLoading(false);
    }
  }

  const planned = menu.filter(i => i.status === "menu");
  const cooking = menu.filter(i => i.status === "cooking");
  const completed = menu.filter(i => i.status === "history");

  async function handleStartCooking(itemId: string) {
    if (!token) return;
    
    try {
      setActionLoading(itemId);
      console.log("🔵 Starting to cook item:", itemId);
      
      await menuApi.startCooking(itemId, token);
      toast.success("✅ Начали готовить!");
      
      // Reload menu
      await loadTodayMenu();
    } catch (err: any) {
      console.error("❌ Failed to start cooking:", err);
      toast.error("❌ Ошибка: " + (err.message || "Не удалось начать готовку"));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCompleteCooking(itemId: string) {
    if (!token) return;
    
    try {
      setActionLoading(itemId);
      console.log("✅ Completing item:", itemId);
      
      await menuApi.completeCooking(itemId, token);
      toast.success("🎉 Отлично! Блюдо готово!");
      
      // Reload menu
      await loadTodayMenu();
    } catch (err: any) {
      console.error("❌ Failed to complete cooking:", err);
      toast.error("❌ Ошибка: " + (err.message || "Не удалось завершить готовку"));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateServings(itemId: string, servings: number) {
    if (!token) return;
    
    try {
      setActionLoading(itemId);
      console.log("🍴 Updating servings for item:", itemId, "to", servings);
      
      await menuApi.updateServings(itemId, servings, token);
      toast.success("✅ Количество порций обновлено!");
      
      // Reload menu
      await loadTodayMenu();
    } catch (err: any) {
      console.error("❌ Failed to update servings:", err);
      toast.error("❌ Ошибка: " + (err.message || "Не удалось обновить порции"));
    } finally {
      setActionLoading(null);
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Tab stats
  const menuCount = menu.filter(i => i.status === "menu").length;
  const cookingCount = menu.filter(i => i.status === "cooking").length;
  const historyCount = menu.filter(i => i.status === "history").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between mb-4">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t?.common?.back || "Назад"}</span>
          </button>
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Kitchen Dashboard</h1>
          </div>
          <div className="w-20" />
        </div>

        {/* Tab Navigation */}
        {!loading && menu.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 flex gap-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'menu'
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              📋 В меню <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{menuCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('cooking')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'cooking'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              🍳 Готовится <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{cookingCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'history'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              ✅ История <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{historyCount}</span>
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Загружаю ваше меню на день...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={() => loadTodayMenu()}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {!loading && !error && menu.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg font-semibold">Ваше меню пусто</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Добавьте рецепты в меню, чтобы начать готовить</p>
            <button 
              onClick={() => router.push("/assistant")} 
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              🤖 Перейти к ассистенту
            </button>
          </div>
        )}

        {!loading && !error && menu.length > 0 && (
          <>
            {/* 📋 МЕНЮ TAB */}
            {activeTab === 'menu' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    Сегодняшнее меню
                  </h2>
                  {menuCount === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Нет блюд в меню</p>
                      <button 
                        onClick={() => router.push("/assistant")} 
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                      >
                        Добавить рецепт
                      </button>
                    </div>
                  ) : (
                    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {menu.filter(i => i.status === "menu").map((menuItem) => (
                        <motion.div key={menuItem.id} variants={item}>
                          <MenuRecipeCard
                            item={menuItem}
                            status="menu"
                            onStartCooking={() => handleStartCooking(menuItem.id)}
                            onComplete={() => {}}
                            onUpdateServings={(servings) => handleUpdateServings(menuItem.id, servings)}
                            isLoading={actionLoading === menuItem.id}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 🍳 ГОТОВИТСЯ TAB */}
            {activeTab === 'cooking' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
                    Активная готовка
                  </h2>
                  {cookingCount === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Нет активных блюд</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Нажмите "Готовить" на блюде из меню</p>
                    </div>
                  ) : (
                    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {menu.filter(i => i.status === "cooking").map((menuItem) => (
                        <motion.div key={menuItem.id} variants={item}>
                          <MenuRecipeCard
                            item={menuItem}
                            status="cooking"
                            onStartCooking={() => {}}
                            onComplete={() => handleCompleteCooking(menuItem.id)}
                            onUpdateServings={() => {}}
                            isLoading={actionLoading === menuItem.id}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ✅ ИСТОРИЯ TAB */}
            {activeTab === 'history' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                    Приготовлено сегодня
                  </h2>
                  {historyCount === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">История пуста</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Завершённые блюда будут показаны здесь</p>
                    </div>
                  ) : (
                    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {menu.filter(i => i.status === "history").map((menuItem) => (
                        <motion.div key={menuItem.id} variants={item}>
                          <MenuRecipeCard
                            item={menuItem}
                            status="history"
                            onStartCooking={() => {}}
                            onComplete={() => {}}
                            onUpdateServings={() => {}}
                            isLoading={false}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
