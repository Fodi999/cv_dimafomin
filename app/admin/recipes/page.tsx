"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChefHat,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { RecipeWizard } from "@/components/admin/RecipeWizard";
import { RecipeEditModal } from "@/components/admin/RecipeEditModal";
import { RecipePreviewCard } from "@/components/admin/RecipePreviewCard";
import { RecipeAIGenerator } from "@/components/admin/RecipeAIGenerator";
import { RecipeDetailsModal } from "@/components/admin/RecipeDetailsModal";

interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  price: number;
  rating: number;
  reviews: number;
  status: "draft" | "published" | "archived";
  author: string;
  tags: string[];
  views: number;
  purchases: number;
  revenue: number;
  createdAt: Date;
  updatedAt: Date;
  ingredients?: Array<{ name: string; quantity: number; unit: string }>;
  instructions?: string[];
  youtubeUrl?: string;
  images?: string[];
}

const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Суші Райнбоу",
    description: "Кольорові суші з лососем, тунцем та авокадо",
    image: "🍣",
    cuisine: "Японська",
    difficulty: "hard",
    prepTime: 30,
    cookTime: 0,
    servings: 4,
    calories: 250,
    price: 45,
    rating: 4.8,
    reviews: 127,
    status: "published",
    author: "Chef Dmitro",
    tags: ["суші", "морепродукти", "азійська"],
    views: 3240,
    purchases: 89,
    revenue: 4005,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
    images: ["🍣", "🍚", "🥒"],
    youtubeUrl: "https://www.youtube.com/watch?v=nKDFZ5lx2oU",
    ingredients: [
      { name: "Рис для суші", quantity: 300, unit: "г" },
      { name: "Лосось", quantity: 150, unit: "г" },
      { name: "Тунець", quantity: 150, unit: "г" },
      { name: "Авокадо", quantity: 1, unit: "шт" },
      { name: "Норі (водорості)", quantity: 5, unit: "листів" },
    ],
    instructions: [
      "Приготуйте рис для суші та дайте йому охолодитися",
      "Нарізаньте рибу та авокадо на смуги",
      "Покладіть норі блискучою стороною вниз на циновку",
      "Розподіліть 2 ложки рису на норі та покладіть інгредієнти",
      "Скрутіть рулет за допомогою циновки та нарізаньте на частини",
    ],
  },
  {
    id: "2",
    name: "Паста Карбонара",
    description: "Класична італійська паста з беконом та сирним соусом",
    image: "🍝",
    cuisine: "Італійська",
    difficulty: "medium",
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 520,
    price: 35,
    rating: 4.6,
    reviews: 98,
    status: "published",
    author: "Chef Dmitro",
    tags: ["паста", "італійська", "молочні"],
    views: 2150,
    purchases: 72,
    revenue: 2520,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-14"),
    images: ["🍝", "🥚", "🥓"],
    youtubeUrl: "https://www.youtube.com/watch?v=3AAdKl1UYZs",
    ingredients: [
      { name: "Спагетті", quantity: 400, unit: "г" },
      { name: "Бекон", quantity: 200, unit: "г" },
      { name: "Яйця", quantity: 3, unit: "шт" },
      { name: "Пармезан", quantity: 100, unit: "г" },
      { name: "Чорний перець", quantity: 5, unit: "г" },
    ],
    instructions: [
      "Варіть спагетті у підсолену воду до готівності",
      "Нарізаний бекон обжарте на сковороді до хрумкавості",
      "Змішайте яйця з тертим пармезаном та перцем",
      "Змішайте гарячу пасту з беконом та соусом з яйця",
      "Подавайте негайно, прикрасивши пармезаном",
    ],
  },
  {
    id: "3",
    name: "Борщ українській",
    description: "Традиційний український борщ зі свіжими овочами",
    image: "🍲",
    cuisine: "Українська",
    difficulty: "medium",
    prepTime: 20,
    cookTime: 60,
    servings: 6,
    calories: 180,
    price: 25,
    rating: 4.9,
    reviews: 156,
    status: "published",
    author: "Chef Dmitro",
    tags: ["борщ", "українська", "овочі"],
    views: 4500,
    purchases: 156,
    revenue: 3900,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "4",
    name: "Том Ям з морепродуктами",
    description: "Гарячий та кислий суп з креветками та грибами",
    image: "🥘",
    cuisine: "Таїландська",
    difficulty: "hard",
    prepTime: 25,
    cookTime: 30,
    servings: 4,
    calories: 200,
    price: 50,
    rating: 4.7,
    reviews: 103,
    status: "published",
    author: "Chef Dmitro",
    tags: ["суп", "морепродукти", "таїландська"],
    views: 2800,
    purchases: 68,
    revenue: 3400,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "5",
    name: "Сирний пирог",
    description: "Ніжний чізкейк з лимонним соусом",
    image: "🍰",
    cuisine: "Американська",
    difficulty: "medium",
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    calories: 380,
    price: 30,
    rating: 4.5,
    reviews: 72,
    status: "draft",
    author: "Chef Dmitro",
    tags: ["десерт", "сир", "американська"],
    views: 450,
    purchases: 12,
    revenue: 360,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-16"),
  },
];

const difficultyConfig = {
  easy: { label: "Легко", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  medium: { label: "Середньо", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" },
  hard: { label: "Складно", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" },
};

const statusConfig = {
  draft: { label: "Чернетка", color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
  published: { label: "Опубліковано", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  archived: { label: "Архівовано", color: "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300" },
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState(mockRecipes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRecipeForDetails, setSelectedRecipeForDetails] = useState<Recipe | null>(null); // 🔧 Новое состояние для панели деталей

  // 🔧 Допоміжна функція для очистки localStorage від старих даних
  const clearOldStorageData = () => {
    try {
      // Видаляємо старе ім'я ключа якщо воно існує
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        // Видаляємо всі ключи крім "recipes" (або дозволених ключів)
        if (key !== "recipes" && key !== "token" && !key.startsWith("chat_") && key !== "recipePhotos") {
          localStorage.removeItem(key);
        }
      });
      console.log("🧹 Старі дані видалені з localStorage");
    } catch (error) {
      console.error("Помилка при очистці localStorage:", error);
    }
  };

  // 🔧 Функція для збереження фото окремо (в sessionStorage - швидше та безпечніше)
  const savePhotosToSession = (recipes: Recipe[]) => {
    try {
      const photosData = recipes.reduce((acc, recipe) => {
        if (recipe.images && recipe.images.length > 0) {
          acc[recipe.id] = recipe.images;
        }
        return acc;
      }, {} as Record<string, string[]>);
      
      sessionStorage.setItem("recipePhotos", JSON.stringify(photosData));
      console.log("📸 Фото збережені в sessionStorage");
    } catch (error) {
      console.error("⚠️ Помилка збереження фото:", error);
    }
  };

  // 🔧 Функція для завантаження фото з sessionStorage
  const loadPhotosFromSession = (recipes: Recipe[]) => {
    try {
      const photosJson = sessionStorage.getItem("recipePhotos");
      if (photosJson) {
        const photosData = JSON.parse(photosJson);
        return recipes.map(recipe => ({
          ...recipe,
          images: photosData[recipe.id] || recipe.images || [],
        }));
      }
    } catch (error) {
      console.error("⚠️ Помилка завантаження фото:", error);
    }
    return recipes;
  };

  // Загружаем рецепты из localStorage при первой загрузке
  useEffect(() => {
    // Спочатку очищуємо старі дані
    clearOldStorageData();

    const savedRecipes = localStorage.getItem("recipes");
    if (savedRecipes) {
      try {
        const parsedRecipes = JSON.parse(savedRecipes);
        // 🔧 Конвертируем ISO строки обратно в Date объекты
        let recipesWithDates = parsedRecipes.map((recipe: any) => ({
          ...recipe,
          createdAt: new Date(recipe.createdAt),
          updatedAt: new Date(recipe.updatedAt),
          // 🔧 Додаємо порожні масиви для інгредієнтів та інструкцій (RAM-only)
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          images: recipe.images || [],
        }));
        
        // 🔧 Завантажуємо фото з sessionStorage
        recipesWithDates = loadPhotosFromSession(recipesWithDates);
        
        setRecipes(recipesWithDates);
        setFilteredRecipes(recipesWithDates);
        console.log(`✅ Завантажено ${recipesWithDates.length} рецептів з localStorage`);
      } catch (error) {
        console.error("Помилка при завантаженні рецептів:", error);
        // Якщо помилка при парсингу - очищуємо дані
        localStorage.removeItem("recipes");
        setRecipes(mockRecipes);
        setFilteredRecipes(mockRecipes);
      }
    } else {
      setRecipes(mockRecipes);
      setFilteredRecipes(mockRecipes);
    }
  }, []);

  // Извлекаем уникальные кухни и статусы
  const cuisines = [...new Set(recipes.map((r) => r.cuisine))];
  const statuses = ["draft", "published", "archived"];

  // Фильтрация рецептов
  const filterRecipes = () => {
    let filtered = recipes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCuisine) {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine);
    }

    if (selectedStatus) {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    setFilteredRecipes(filtered);
  };

  // Обновляем фильтрацию при изменении параметров
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCuisineFilter = (cuisine: string) => {
    setSelectedCuisine(cuisine === selectedCuisine ? "" : cuisine);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status === selectedStatus ? "" : status);
  };

  const handleCreateRecipe = (recipeData: any) => {
    const newRecipe: Recipe = {
      id: String(Date.now()), // Используем timestamp для уникального ID
      name: recipeData.name,
      description: recipeData.description,
      image: recipeData.images?.[0] || "🍳",
      cuisine: recipeData.cuisine,
      difficulty: recipeData.difficulty,
      prepTime: recipeData.prepTime || 15,
      cookTime: recipeData.cookTime || 20,
      servings: recipeData.servings || 4,
      calories: recipeData.calories || 300,
      price: recipeData.price || 25,
      rating: 0,
      reviews: 0,
      status: recipeData.status || "draft",
      author: "Chef Dmitro",
      tags: recipeData.tags || [],
      views: 0,
      purchases: 0,
      revenue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      youtubeUrl: recipeData.youtubeUrl || "",
      images: recipeData.images || [],
    };
    
    const updatedRecipes = [newRecipe, ...recipes];
    
    // 🔧 Збережем фото в sessionStorage (швидко доступно протягом сесії)
    savePhotosToSession(updatedRecipes);
    
    // 🔧 Оптимізуємо дані для localStorage - зберігаємо тільки мінімум (no photos, ingredients, instructions)
    const recipesToSave = updatedRecipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      image: recipe.image,
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      calories: recipe.calories,
      price: recipe.price,
      rating: recipe.rating,
      reviews: recipe.reviews,
      status: recipe.status,
      author: recipe.author,
      tags: recipe.tags,
      views: recipe.views,
      purchases: recipe.purchases,
      revenue: recipe.revenue,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
      youtubeUrl: recipe.youtubeUrl || "",
      // ❌ НЕ зберігаємо: images, ingredients, instructions (зберігаються тільки в RAM)
    }));
    
    try {
      localStorage.setItem("recipes", JSON.stringify(recipesToSave));
      console.log("✅ Новий рецепт створений:", newRecipe.name);
      console.log("📸 Фото в пам'яті:", newRecipe.images?.length || 0, "шт");
      console.log("🥘 Інгредієнти:", newRecipe.ingredients?.length || 0, "шт");
      console.log("📝 Кроки:", newRecipe.instructions?.length || 0, "шт");
      console.log("💾 Збережено в localStorage (~1KB без медіа)");
    } catch (error) {
      console.error("⚠️ Помилка збереження в localStorage (перша спроба):", error);
      
      // ПЛАН B: Спробуємо зберегти тільки останні 15 рецептів
      console.log("📊 Спроба B: Зберігаємо останні 15 рецептів...");
      const limitedRecipes = recipesToSave.slice(0, 15);
      try {
        localStorage.setItem("recipes", JSON.stringify(limitedRecipes));
        console.log("✅ План B успішний - збережено 15 рецептів");
      } catch (fallbackError) {
        // ПЛАН C: Спробуємо зберегти тільки останні 5 рецептів
        console.error("❌ План B не вдався:", fallbackError);
        console.log("📊 Спроба C: Зберігаємо останні 5 рецептів...");
        const minimalRecipes = recipesToSave.slice(0, 5);
        try {
          localStorage.setItem("recipes", JSON.stringify(minimalRecipes));
          console.log("✅ План C успішний - збережено 5 рецептів");
        } catch (criticalError) {
          // ПЛАН D: Очищаємо всю localStorage та зберігаємо заново
          console.error("❌ План C не вдався:", criticalError);
          console.log("🔴 ПЛАН D: Очищуємо localStorage повністю...");
          try {
            localStorage.clear();
            console.log("🧹 localStorage очищена");
            // Спробуємо зберегти всі рецепти заново
            localStorage.setItem("recipes", JSON.stringify(recipesToSave));
            console.log("✅ План D успішний - рецепти збережені після очистки");
          } catch (finalError) {
            console.error("❌ КРИТИЧНА ПОМИЛКА: Не вдалося зберегти рецепти:", finalError);
            // Дозволяємо додатку працювати в RAM-only режимі
            alert("⚠️ Не вдалося зберегти рецепти на диск, але вони зберігаються в пам'яті браузера. Після перезавантаження сторінки дані будуть втрачені.");
          }
        }
      }
    }
    
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes); // 🔧 Показываем новый рецепт сразу
    setShowCreateModal(false);
    setShowAIGenerator(false);
    
    // Показать успешное сообщение
    alert(`✅ Рецепт "${newRecipe.name}" успішно створений!\n\nДодано:\n- Інгредієнтів: ${newRecipe.ingredients?.length || 0}\n- Кроків: ${newRecipe.instructions?.length || 0}\n- Фото: ${recipeData.images?.length || 0}\n\n💾 Збережено в localStorage`);
  };

  const handleEditRecipe = (recipeData: any) => {
    if (editingRecipe) {
      const updatedRecipes = recipes.map((r) =>
        r.id === editingRecipe.id ? { ...r, ...recipeData, updatedAt: new Date() } : r
      );
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);
      
      // 🔧 Збережем фото в sessionStorage
      savePhotosToSession(updatedRecipes);
      
      // 🔧 Оптимізуємо для localStorage - мінімум даних
      const recipesToSave = updatedRecipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        image: recipe.image,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        calories: recipe.calories,
        price: recipe.price,
        rating: recipe.rating,
        reviews: recipe.reviews,
        status: recipe.status,
        author: recipe.author,
        tags: recipe.tags,
        views: recipe.views,
        purchases: recipe.purchases,
        revenue: recipe.revenue,
        createdAt: recipe.createdAt.toISOString(),
        updatedAt: recipe.updatedAt.toISOString(),
        youtubeUrl: recipe.youtubeUrl || "",
      }));
      
      try {
        localStorage.setItem("recipes", JSON.stringify(recipesToSave));
        console.log("✏️ Рецепт обновлен и зохранен в localStorage");
      } catch (error) {
        console.error("⚠️ Помилка збереження при редагуванні:", error);
        // Fallback: спробуємо зберегти останні 15 рецептів
        const limitedRecipes = recipesToSave.slice(0, 15);
        try {
          localStorage.setItem("recipes", JSON.stringify(limitedRecipes));
          console.log("⚠️ Збережено скорочену версію (15 рецептів)");
        } catch (fallbackError) {
          console.error("❌ Не вдалося зберегти сокращену версію:", fallbackError);
          localStorage.clear();
          localStorage.setItem("recipes", JSON.stringify(limitedRecipes.slice(0, 5)));
          console.log("⚠️ Очищена localStorage, збережено 5 рецептів");
        }
      }
      
      setShowEditModal(false);
      setEditingRecipe(null);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    if (confirm("Ви впевнені, що хочете видалити цей рецепт?")) {
      const updatedRecipes = recipes.filter((r) => r.id !== id);
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);
      
      // 🔧 Збережем фото в sessionStorage
      savePhotosToSession(updatedRecipes);
      
      // 🔧 Оптимізуємо для localStorage - мінімум даних
      const recipesToSave = updatedRecipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        image: recipe.image,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        calories: recipe.calories,
        price: recipe.price,
        rating: recipe.rating,
        reviews: recipe.reviews,
        status: recipe.status,
        author: recipe.author,
        tags: recipe.tags,
        views: recipe.views,
        purchases: recipe.purchases,
        revenue: recipe.revenue,
        createdAt: recipe.createdAt.toISOString(),
        updatedAt: recipe.updatedAt.toISOString(),
        youtubeUrl: recipe.youtubeUrl || "",
      }));
      
      try {
        localStorage.setItem("recipes", JSON.stringify(recipesToSave));
        console.log("🗑️ Рецепт видален и зохранен в localStorage");
      } catch (error) {
        console.error("⚠️ Помилка збереження при видаленні:", error);
        // Fallback: спробуємо зберегти останні 15 рецептів
        const limitedRecipes = recipesToSave.slice(0, 15);
        try {
          localStorage.setItem("recipes", JSON.stringify(limitedRecipes));
          console.log("⚠️ Збережено скорочену версію (15 рецептів)");
        } catch (fallbackError) {
          console.error("❌ Не вдалося зберегти сокращену версію:", fallbackError);
          localStorage.clear();
          localStorage.setItem("recipes", JSON.stringify(limitedRecipes.slice(0, 5)));
          console.log("⚠️ Очищена localStorage, збережено 5 рецептів");
        }
      }
    }
  };

  const handleEditClick = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowEditModal(true);
  };

  // Обновляем фильтры каждый раз когда изменяется search, cuisine или status
  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedCuisine, selectedStatus]);

  // Статистика
  const totalRecipes = recipes.length;
  const publishedCount = recipes.filter((r) => r.status === "published").length;
  const totalRevenue = recipes.reduce((sum, r) => sum + r.revenue, 0);
  const totalPurchases = recipes.reduce((sum, r) => sum + r.purchases, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <ChefHat size={32} className="text-purple-600" />
            Керування рецептами
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Vytворюйте та керуйте рецептами для маркетплейсу
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAIGenerator(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors"
          >
            <Sparkles size={20} />
            AI Генератор
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg transition-colors"
          >
            <Plus size={20} />
            Новий рецепт
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 space-y-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Всього рецептів</span>
            <ChefHat size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalRecipes}</p>
        </Card>

        <Card className="p-6 space-y-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Опубліковано</span>
            <Eye size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{publishedCount}</p>
        </Card>

        <Card className="p-6 space-y-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Усього покупок</span>
            <Users size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalPurchases}</p>
        </Card>

        <Card className="p-6 space-y-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Усього доходу</span>
            <DollarSign size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalRevenue}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Пошук рецептів за назвою, описом або тегами..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Cuisine Filters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Filter size={16} />
            Кухня
          </h3>
          <div className="flex flex-wrap gap-2">
            {cuisines.map((cuisine) => (
              <motion.button
                key={cuisine}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCuisineFilter(cuisine)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCuisine === cuisine
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cuisine}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Статус</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedStatus === status
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {statusConfig[status as keyof typeof statusConfig].label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Вид:</span>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              viewMode === "grid"
                ? "bg-purple-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            Сітка
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-purple-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            Список
          </button>
        </div>
      </Card>

      {/* Recipes Grid or List */}
      {filteredRecipes.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, idx) => (
              <RecipePreviewCard
                key={recipe.id}
                recipe={recipe}
                onEdit={handleEditClick}
                onDelete={handleDeleteRecipe}
                onShowDetails={setSelectedRecipeForDetails}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecipes.map((recipe, idx) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    {/* Image/Icon */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl">
                      {recipe.image}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">{recipe.name}</h3>
                        <Badge className={statusConfig[recipe.status].color}>
                          {statusConfig[recipe.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{recipe.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {recipe.prepTime + recipe.cookTime}хв
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={14} /> {recipe.rating} ({recipe.reviews})
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} /> {recipe.price} токенів
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClick(recipe)}
                        className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors"
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
        >
          <ChefHat size={48} className="text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Рецептів не знайдено</h3>
          <p className="text-slate-600 dark:text-slate-400 text-center">
            Спробуйте змінити фільтри або створіть новий рецепт
          </p>
        </motion.div>
      )}

      {/* Modals */}
      <RecipeAIGenerator
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onGenerate={handleCreateRecipe}
      />

      <RecipeWizard
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRecipe}
      />

      {editingRecipe && (
        <RecipeEditModal
          isOpen={showEditModal}
          recipe={editingRecipe}
          onClose={() => {
            setShowEditModal(false);
            setEditingRecipe(null);
          }}
          onSubmit={handleEditRecipe}
        />
      )}

      {/* 🔧 Глобальная панель деталей */}
      {selectedRecipeForDetails && (
        <RecipeDetailsModal
          isOpen={!!selectedRecipeForDetails}
          recipe={selectedRecipeForDetails}
          onClose={() => setSelectedRecipeForDetails(null)}
        />
      )}
    </motion.div>
  );
}
