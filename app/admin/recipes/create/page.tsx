"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-auto">
      {/* Main Container - v0.dev style */}
      <div className="mx-auto max-w-2xl px-6 py-24 space-y-16">
        {/* ===== HEADER BLOCK ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Link href="/admin/recipes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <ArrowLeft size={16} />
              Назад
            </motion.button>
          </Link>

          <div className="space-y-3">
            <h1 className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Створення нового рецепту
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl">
              Легко створи рецепт в 3 кроки: назва та опис → фото → відео
            </p>
          </div>
        </motion.div>

        {/* ===== WORKFLOW STEPS (v0-style stepper) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Step Circles */}
          <div className="flex justify-between items-end gap-3">
            {steps.map((step, idx) => {
              const isActive = currentStep === idx;
              const isCompleted = currentStep > idx;

              return (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center flex-1 group"
                >
                  {/* Circle */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      boxShadow: isActive
                        ? "0 0 0 8px rgba(15, 23, 42, 0.1)"
                        : "none",
                    }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center justify-center w-14 h-14 rounded-full font-bold text-base mb-4 transition-all border-2 ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                        ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900"
                        : "bg-transparent border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check size={24} /> : idx + 1}
                  </motion.div>

                  {/* Label */}
                  <p
                    className={`text-xs font-semibold text-center transition-colors ${
                      isActive
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {step}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-slate-900 dark:bg-white"
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* ===== MAIN CONTENT GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT: Form Card */}
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            {/* ===== STEP 1: NAME & DESCRIPTION ===== */}
            {currentStep === 0 && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Назва та опис рецепту
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                    Розповідай про свій рецепт. Введи назву, яка привернула б увагу, та гарний опис.
                  </p>
                </div>

                {/* Form Card Container */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* Name Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Назва рецепту
                    </label>
                    <input
                      type="text"
                      placeholder="Суші-ролл Спайсі"
                      value={recipeData.name}
                      onChange={(e) =>
                        setRecipeData({ ...recipeData, name: e.target.value })
                      }
                      className="w-full px-4 py-3.5 text-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Опис рецепту
                    </label>
                    <textarea
                      placeholder="Збалансований та смачний..."
                      value={recipeData.description}
                      onChange={(e) =>
                        setRecipeData({ ...recipeData, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ===== STEP 2: PHOTOS ===== */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Завантажте фото рецепту
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    Якісні фото роблять рецепт привабливішим. Рекомендуємо 2–3 фото.
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-12 text-center space-y-4 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                  <div className="text-5xl">📸</div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {recipeData.images.map((_, idx) => (
                      <div
                        key={idx}
                        className="aspect-video rounded-xl bg-slate-200 dark:bg-slate-700"
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {/* ===== STEP 3: VIDEO ===== */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Додайте YouTube відео
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    Відео допомагає глядачам розуміти процес готування.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 space-y-6 shadow-sm">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      YouTube посилання
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={recipeData.youtubeUrl}
                      onChange={(e) =>
                        setRecipeData({ ...recipeData, youtubeUrl: e.target.value })
                      }
                      className="w-full px-4 py-3.5 text-base rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>

                  {recipeData.youtubeUrl && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="aspect-video rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-2">🎬</div>
                        <p className="text-sm text-slate-400">Превью відео</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT: Live Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              {/* Preview Label */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  🍳 Превью
                </p>
              </div>

              {/* Preview Card - v0 premium style */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Image Preview */}
                <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-4xl">
                  {recipeData.images.length > 0 ? "📸" : "🍳"}
                </div>

                {/* Title Preview */}
                <div className="min-h-[56px]">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                    {recipeData.name || "Введіть назву..."}
                  </h3>
                </div>

                {/* Description Preview */}
                {recipeData.description ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {recipeData.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                    Опис появиться тут...
                  </p>
                )}

                {/* Stats Grid - 2x2 */}
                <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                        ⏱️ Приготування
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {recipeData.prepTime}м
                      </p>
                    </div>
                    <div className="rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                        🔥 Варка
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {recipeData.cookTime}м
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                        👥 Порції
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {recipeData.servings}
                      </p>
                    </div>
                    <div className="rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                        💰 Ціна
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {recipeData.price}₴
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags / Status */}
                <div className="space-y-2 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    🏷️ Теги...
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      📸 {recipeData.images.length} фото
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      🎬 {recipeData.youtubeUrl ? "Відео додано" : "Немає відео"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== FOOTER NAVIGATION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between gap-4 pt-12 border-t border-slate-200 dark:border-slate-800"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={18} />
            Назад
          </motion.button>

          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Крок {currentStep + 1} з {steps.length}
          </p>

          {currentStep < steps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
            >
              Далі
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-all"
            >
              <Check size={18} />
              Опублікувати
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
