"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface RecipeFormData {
  name: string;
  description: string;
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  price: number;
  youtubeUrl: string;
  images: string[];
  tags: string[];
}

export default function RecipeCreatePage() {
  const router = useRouter();
  const steps = ["Назва та опис", "Фото", "Відео"];

  const [currentStep, setCurrentStep] = useState(0);
  const [recipeData, setRecipeData] = useState<RecipeFormData>({
    name: "",
    description: "",
    cuisine: "japanese",
    difficulty: "easy",
    prepTime: 30,
    cookTime: 30,
    servings: 2,
    price: 199,
    youtubeUrl: "",
    images: [],
    tags: [],
  });

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
    console.log("Recipe submitted:", recipeData);
    router.push("/admin/recipes");
  };

  return (
    <div className="w-full h-full bg-white dark:bg-slate-950 overflow-auto">
      {/* Main Container */}
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/admin/recipes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={16} />
              Назад до рецептів
            </motion.button>
          </Link>

          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Створення нового рецепту
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Легко створи рецепт в 3 кроки: назва та опис → фото → відео
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="space-y-8">
          {/* Progress Steps */}
          <div className="flex items-end justify-between gap-4">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* Circle */}
                <motion.button
                  onClick={() => setCurrentStep(idx)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all mb-3 ${
                    currentStep === idx
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                      : currentStep > idx
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {currentStep > idx ? <Check size={20} /> : idx + 1}
                </motion.button>

                {/* Label */}
                <p className={`text-xs font-medium text-center ${
                  currentStep === idx
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400"
                }`}>
                  {step}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-slate-900 dark:bg-white"
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Step 1: Name & Description */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Назва та опис рецепту
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Розповідай про свій рецепт. Введи назву, яка привернула б увагу, та гарний опис.
                    </p>
                  </div>

                  <div className="space-y-6 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-white">
                        Назва рецепту
                      </label>
                      <input
                        type="text"
                        placeholder="Суші-ролл Спайсі"
                        value={recipeData.name}
                        onChange={(e) =>
                          setRecipeData({ ...recipeData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-lg font-semibold"
                      />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-white">
                        Опис рецепту
                      </label>
                      <textarea
                        placeholder="Збалансований та смачний..."
                        value={recipeData.description}
                        onChange={(e) =>
                          setRecipeData({ ...recipeData, description: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Photos */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Завантажте фото рецепту
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Якісні фото роблять рецепт привабливішим. Рекомендуємо 2-3 фото.
                    </p>
                  </div>

                  <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
                    <div className="text-4xl">📸</div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Клацніть або перетягніть фото
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        PNG, JPG або WebP (макс. 5 МБ)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {recipeData.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {recipeData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="aspect-video rounded-xl bg-slate-200 dark:bg-slate-800"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Video */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Додайте YouTube відео
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Відео допомагає глядачам розуміти процес готування.
                    </p>
                  </div>

                  <div className="space-y-6 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-white">
                        YouTube посилання
                      </label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={recipeData.youtubeUrl}
                        onChange={(e) =>
                          setRecipeData({ ...recipeData, youtubeUrl: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                      />
                    </div>

                    {recipeData.youtubeUrl && (
                      <div className="aspect-video rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎬</div>
                          <p className="text-sm text-slate-400">Превью відео</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="sticky top-20"
            >
              <div className="space-y-2 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Превью
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 space-y-6 shadow-sm">
                {/* Image Preview */}
                <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                  {recipeData.images.length > 0 ? (
                    <div className="text-sm text-slate-600">Фото</div>
                  ) : (
                    <span className="text-3xl">🍳</span>
                  )}
                </div>

                {/* Title Preview */}
                <div className="min-h-[56px]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                    {recipeData.name || "Введіть назву..."}
                  </h3>
                </div>

                {/* Description Preview */}
                {recipeData.description ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {recipeData.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                    Опис появиться тут...
                  </p>
                )}

                {/* Stats Grid */}
                <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">⏱️</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {recipeData.prepTime}м
                      </p>
                    </div>
                    <div className="rounded-lg p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">🔥</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {recipeData.cookTime}м
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">👥</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {recipeData.servings}
                      </p>
                    </div>
                    <div className="rounded-lg p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">💰</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {recipeData.price}₴
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    📸 {recipeData.images.length} фото
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-2">
                    🎬 {recipeData.youtubeUrl ? "Відео додано" : "Немає відео"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between gap-4 pt-12 border-t border-slate-200 dark:border-slate-800">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={18} />
            Назад
          </motion.button>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Крок {currentStep + 1} з {steps.length}
          </p>

          {currentStep < steps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Далі
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 dark:bg-green-600 text-white font-medium hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
            >
              <Check size={18} />
              Опублікувати
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
