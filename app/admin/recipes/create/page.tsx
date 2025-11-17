"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChefHat,
  X,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Youtube,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { 
  japaneseTemplates, 
  italianTemplates, 
  ukrainianTemplates, 
  thaiTemplates, 
  americanTemplates, 
  chineseTemplates, 
  frenchTemplates,
  RecipeTemplate 
} from "@/lib/recipe-templates";

interface RecipeFormData {
  id?: string;
  name: string;
  description: string;
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  price: number;
  youtubeUrl: string;
  images: string[];
  ingredients: Array<{ id: string; name: string; quantity: number; unit: string }>;
  instructions: string[];
  tags: string[];
  status: "draft" | "published";
}

export default function RecipeCreatePage() {
  const router = useRouter();
  const steps = ["Назва та опис", "Фото", "Відео"];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [recipeData, setRecipeData] = useState<RecipeFormData>({
    name: "",
    description: "",
    cuisine: "japanese",
    difficulty: "easy",
    prepTime: 30,
    cookTime: 30,
    servings: 2,
    calories: 500,
    price: 199,
    youtubeUrl: "",
    images: [],
    ingredients: [],
    instructions: [],
    tags: [],
    status: "draft",
  });

  // Helper functions
  const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYoutubeEmbedUrl = (url: string): string | null => {
    const videoId = extractYoutubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const validateYoutubeUrl = (url: string): boolean => {
    return /^(https?:\/\/)?(www\.)?youtube\.com|youtu\.be/.test(url);
  };

  const generateRecipe = async () => {
    setIsGenerating(true);
    const allTemplates = [
      ...japaneseTemplates,
      ...italianTemplates,
      ...ukrainianTemplates,
      ...thaiTemplates,
      ...americanTemplates,
      ...chineseTemplates,
      ...frenchTemplates,
    ];

    const randomTemplate = allTemplates[Math.floor(Math.random() * allTemplates.length)];

    setTimeout(() => {
      setRecipeData((prev) => ({
        ...prev,
        name: randomTemplate.name,
        description: randomTemplate.description,
        cuisine: randomTemplate.cuisine,
        difficulty: randomTemplate.difficulty,
        prepTime: randomTemplate.prepTime,
        cookTime: randomTemplate.cookTime,
        servings: randomTemplate.servings,
        calories: randomTemplate.calories,
        price: randomTemplate.price,
        ingredients: randomTemplate.ingredients.map((ing: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
        })),
        instructions: randomTemplate.instructions,
        tags: randomTemplate.tags,
        images: prev.images,
        youtubeUrl: prev.youtubeUrl,
      }));
      setIsGenerating(false);
      setCurrentStep(1);
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = (event.target as FileReader)?.result;
        if (result && typeof result === "string") {
          setRecipeData((prev) => ({
            ...prev,
            images: [...prev.images, result],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setRecipeData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setShowPreview(true);
  };

  const publishRecipe = () => {
    const newRecipe = {
      id: Date.now().toString(),
      ...recipeData,
      status: "draft" as const,
    };

    try {
      const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
      recipes.unshift({
        id: newRecipe.id,
        name: newRecipe.name,
        description: newRecipe.description,
        image: recipeData.images?.[0] || "🍳",
        cuisine: newRecipe.cuisine,
        difficulty: newRecipe.difficulty,
        prepTime: newRecipe.prepTime,
        cookTime: newRecipe.cookTime,
        servings: newRecipe.servings,
        calories: newRecipe.calories,
        price: newRecipe.price,
        rating: 0,
        reviews: 0,
        status: newRecipe.status,
        author: "Chef Dmitro",
        tags: newRecipe.tags,
        views: 0,
        purchases: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        youtubeUrl: newRecipe.youtubeUrl,
      });
      localStorage.setItem("recipes", JSON.stringify(recipes));

      const recipeDetails = JSON.parse(sessionStorage.getItem("recipeDetails") || "{}");
      recipeDetails[newRecipe.id] = {
        ingredients: newRecipe.ingredients,
        instructions: newRecipe.instructions,
        images: newRecipe.images,
      };
      sessionStorage.setItem("recipeDetails", JSON.stringify(recipeDetails));

      alert(
        `✅ Рецепт "${newRecipe.name}" успішно опублікований!\n\nДодано:\n- Фото: ${newRecipe.images.length}\n- Відео: ${newRecipe.youtubeUrl ? "Так" : "Ні"}`
      );
      router.push("/admin/recipes");
    } catch (error) {
      console.error("Помилка збереження рецепту:", error);
      alert("Помилка при збереженні рецепту");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950 overflow-hidden">
      {/* Decorative blur elements */}
      <div className="fixed -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sky-200 to-cyan-200 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-sky-200 to-cyan-200 rounded-full blur-3xl opacity-5 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col overflow-hidden px-4 md:px-8 py-4">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <Link href="/admin/recipes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors mb-3"
            >
              <ArrowLeft size={18} />
              Назад
            </motion.button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <ChefHat size={36} className="text-purple-600" />
            Створення нового рецепту
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Легко створи рецепт в 3 кроки
          </p>
        </div>

        {/* Main 2-Column Layout: Form (Left) + Live Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-0">
          {/* LEFT COLUMN - FORM (2/3 width) */}
          <div className="lg:col-span-2 overflow-hidden h-full flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pr-4 pb-4 space-y-8">
            
            {/* Steps Indicator - Horizontal Progress */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 pt-2 pb-6 -mx-4 px-4">
              {/* Progress bar */}
              <div className="flex items-center justify-between gap-3 mb-6">
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-1 flex flex-col items-center"
                  >
                    {/* Step circle */}
                    <motion.button
                      onClick={() => setCurrentStep(idx)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-all ${
                        currentStep === idx
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                          : currentStep > idx
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {currentStep > idx ? <Check size={20} /> : idx + 1}
                    </motion.button>

                    {/* Step name */}
                    <p className={`text-xs font-semibold text-center line-clamp-2 ${
                      currentStep === idx
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400"
                    }`}>
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Connection lines */}
              <div className="relative h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Step description */}
              <motion.div
                key={`desc-${currentStep}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Крок {currentStep + 1} з {steps.length}
                </p>
              </motion.div>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {/* STEP 0: Name & Description */}
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800/50 space-y-6">
                    <div className="mb-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <ChefHat size={28} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Назва та опис рецепту
                          </h2>
                          <p className="text-base text-slate-600 dark:text-slate-400">
                            Розповідай про свій рецепт. Введи назву, яка привернула б увагу, та гарний опис.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Name input */}
                    <div>
                      <Input
                        type="text"
                        placeholder="Назва рецепту (наприклад: Суші-ролл Спайсі)"
                        value={recipeData.name}
                        onChange={(e) =>
                          setRecipeData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="text-lg font-semibold"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <textarea
                        placeholder="Опис рецепту (збалансований та смачний...)"
                        value={recipeData.description}
                        onChange={(e) =>
                          setRecipeData((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                        rows={4}
                      />
                    </div>

                    {/* Generate button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateRecipe}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            ✨
                          </motion.span>
                          Генерую рецепт...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          Сгенерувати рецепт
                        </>
                      )}
                    </motion.button>
                  </Card>
                </motion.div>
              )}

              {/* STEP 1: Photos */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800/50 space-y-6">
                    <div className="mb-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                            <Upload size={28} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Завантажте фото рецепту
                          </h2>
                          <p className="text-base text-slate-600 dark:text-slate-400">
                            Якісні фото роблять рецепт привабливішим. Рекомендуємо мінімум 2-3 фото.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Upload area */}
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <Upload size={48} className="mx-auto mb-3 text-slate-400" />
                      <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        Нажміть або перетягніть фото
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        PNG, JPG або WebP (макс. 5 МБ)
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </motion.label>

                    {/* Image gallery */}
                    {recipeData.images.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                          Завантажені фото ({recipeData.images.length})
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {recipeData.images.map((image, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group"
                            >
                              <img
                                src={image}
                                alt={`Фото ${idx + 1}`}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={18} />
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {/* STEP 2: YouTube */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-red-950/20 dark:to-rose-950/20 border border-red-200 dark:border-red-800/50 space-y-6">
                    <div className="mb-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 text-white">
                            <Youtube size={28} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Додайте YouTube видео
                          </h2>
                          <p className="text-base text-slate-600 dark:text-slate-400">
                            Відео допомагає дивакам розуміти процес готування. Вставте посилання з YouTube.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* YouTube URL input */}
                    <div>
                      <Input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={recipeData.youtubeUrl}
                        onChange={(e) =>
                          setRecipeData((prev) => ({ ...prev, youtubeUrl: e.target.value }))
                        }
                        className="text-base"
                      />
                    </div>

                    {/* YouTube preview */}
                    {recipeData.youtubeUrl && validateYoutubeUrl(recipeData.youtubeUrl) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Превью видео:
                        </p>
                        <div className="relative w-full rounded-lg overflow-hidden bg-slate-900 aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={getYoutubeEmbedUrl(recipeData.youtubeUrl) || ""}
                            title="YouTube video preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="border-0"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Summary */}
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        📋 Підсумок рецепту
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Назва:</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {recipeData.name || "Не задана"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Опис:</p>
                          <p className="font-medium text-slate-900 dark:text-white line-clamp-1">
                            {recipeData.description || "Не задано"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Фото:</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {recipeData.images.length} завантажено
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Відео:</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {recipeData.youtubeUrl ? "Додано" : "Не додано"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="sticky bottom-0 z-20 bg-white dark:bg-slate-900 flex items-center justify-between px-0 py-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={18} />
                Назад
              </motion.button>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                Крок {currentStep + 1} з {steps.length}
              </div>

              {currentStep < steps.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  Далі
                  <ArrowRight size={18} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors shadow-lg"
                >
                  <Check size={18} />
                  Опублікувати рецепт
                </motion.button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - LIVE PREVIEW (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1 h-full overflow-hidden min-h-0"
          >
            <div className="h-full overflow-y-auto pr-4">
              <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                  <h3 className="text-sm font-bold">🍳 LIVE PREVIEW</h3>
                  <p className="text-xs opacity-90">Макет рецепту</p>
                </div>

                {/* Recipe Card */}
                <div className="p-5 space-y-4">
                  {/* Image */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                    {recipeData.images.length > 0 ? (
                      <img
                        src={recipeData.images[0]}
                        alt={recipeData.name || "Рецепт"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl animate-pulse">🍳</span>
                    )}
                  </div>

                  {/* Title */}
                  <div className="min-h-[60px]">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-3">
                      {recipeData.name || "📝 Введіть назву"}
                    </h2>
                  </div>

                  {/* Description */}
                  {recipeData.description ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {recipeData.description}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                      📝 Опис з'явиться тут...
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800 text-center cursor-default"
                    >
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        ⏱️ Приготування
                      </p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {recipeData.prepTime > 0 ? `${recipeData.prepTime}` : "?"}мин
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800 text-center cursor-default"
                    >
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                        🔥 Варка
                      </p>
                      <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {recipeData.cookTime > 0 ? `${recipeData.cookTime}` : "?"}мин
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800 text-center cursor-default"
                    >
                      <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        👥 Порції
                      </p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        {recipeData.servings > 0 ? `${recipeData.servings}` : "?"}
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800 text-center cursor-default"
                    >
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                        💰 Ціна
                      </p>
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                        {recipeData.price > 0 ? `${recipeData.price}₴` : "?"}
                      </p>
                    </motion.div>
                  </div>

                  {/* Tags */}
                  {recipeData.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {recipeData.tags.slice(0, 4).map((tag, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                      {recipeData.tags.length > 4 && (
                        <span className="text-xs text-slate-500 dark:text-slate-500 pt-1">
                          +{recipeData.tags.length - 4}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500">🏷️ Теги...</p>
                  )}

                  {/* Media Status */}
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <motion.div
                      animate={{
                        backgroundColor: recipeData.images.length > 0
                          ? "rgb(34, 197, 94)"
                          : "rgb(148, 163, 184)"
                      }}
                      transition={{ duration: 0.3 }}
                      className="p-2 rounded-lg text-white text-xs font-semibold text-center"
                    >
                      📸 {recipeData.images.length} фото
                    </motion.div>

                    <motion.div
                      animate={{
                        backgroundColor: recipeData.youtubeUrl
                          ? "rgb(220, 38, 38)"
                          : "rgb(148, 163, 184)"
                      }}
                      transition={{ duration: 0.3 }}
                      className="p-2 rounded-lg text-white text-xs font-semibold text-center"
                    >
                      🎬 {recipeData.youtubeUrl ? "Відео додано" : "Немає відео"}
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span>🍽️ {recipeData.cuisine || "Кухня"}</span>
                    <span>⭐ {recipeData.difficulty || "Рівень"}</span>
                  </div>

                  {/* Status indicator */}
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <p className="text-xs text-center font-semibold text-blue-700 dark:text-blue-400">
                      ✏️ Редагування...
                    </p>
                  </motion.div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Превью рецепту
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Main Image */}
                {recipeData.images.length > 0 ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                    <img
                      src={recipeData.images[0]}
                      alt={recipeData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                    <p className="text-4xl">🍳</p>
                  </div>
                )}

                {/* Title & Description */}
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {recipeData.name}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {recipeData.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                      ⏱️ Час приготування
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {recipeData.prepTime} хв
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">
                      🔥 Час варки
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {recipeData.cookTime} хв
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                      👥 Порцій
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {recipeData.servings}
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                      💰 Ціна
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {recipeData.price}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {recipeData.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Теги:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recipeData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPreview(false)}
                    className="flex-1 px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Редагувати
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={publishRecipe}
                    className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Опублікувати
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
