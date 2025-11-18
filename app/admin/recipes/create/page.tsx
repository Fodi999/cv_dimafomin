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
  const steps = ["Назва", "Фото", "Відео"];

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
    <div className="min-h-screen w-full overflow-y-auto bg-[#f3f3f3] dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl py-6 px-4 sm:py-8">
        <div className="mb-4 flex items-center gap-3 text-xs sm:text-sm text-slate-500">
          <Link href="/admin/recipes" className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft size={14} />
            Назад
          </Link>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <p>Крок {currentStep + 1}/{steps.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-6 shadow-lg backdrop-blur dark:border-slate-800/50 dark:bg-slate-900/80">
          <div className="mb-6 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Recipe Builder</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Створення рецепту
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Три кроки, плавні переходи, live preview.
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isDone = idx < currentStep;

                return (
                  <div key={step} className="flex flex-1 flex-col items-center">
                    <button
                      onClick={() => setCurrentStep(idx)}
                      className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all ${
                        isDone
                          ? "bg-slate-900 text-white"
                          : isActive
                          ? "border border-slate-900 text-slate-900"
                          : "border border-slate-200 text-slate-400"
                      }`}
                    >
                      {isDone ? <Check size={14} /> : idx + 1}
                    </button>
                    <p className={`mt-1 text-[10px] sm:text-xs font-semibold ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 h-1 rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-slate-900"
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Form + preview */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Назва та опис</h2>
                      <p className="text-xs sm:text-sm text-slate-500">Коротко розкажи що готуємо.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Назва рецепту
                        </label>
                        <input
                          value={recipeData.name}
                          onChange={(e) => setRecipeData({ ...recipeData, name: e.target.value })}
                          placeholder="Суші-ролл Спайсі"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Опис рецепту
                        </label>
                        <textarea
                          rows={3}
                          value={recipeData.description}
                          onChange={(e) => setRecipeData({ ...recipeData, description: e.target.value })}
                          placeholder="Збалансований та смачний..."
                          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Додай фото</h2>
                      <p className="text-xs sm:text-sm text-slate-500">Будь-які PNG / JPG до 5 МБ.</p>
                    </div>
                    <label className="flex h-32 sm:h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-500 transition hover:border-slate-900 cursor-pointer">
                      <span className="text-2xl sm:text-3xl">📸</span>
                      Клацніть або перетягніть фото
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (!files.length) return;
                          const previews = files.map((file) => URL.createObjectURL(file));
                          setRecipeData({ ...recipeData, images: previews });
                        }}
                      />
                    </label>
                    {!!recipeData.images.length && (
                      <div className="grid grid-cols-2 gap-2">
                        {recipeData.images.map((img, idx) => (
                          <div key={idx} className="overflow-hidden rounded-lg border border-slate-200">
                            <img src={img} alt="preview" className="h-24 sm:h-32 w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">YouTube відео</h2>
                      <p className="text-xs sm:text-sm text-slate-500">Опціонально, але підсилює рецепт.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Посилання
                      </label>
                      <input
                        value={recipeData.youtubeUrl}
                        onChange={(e) => setRecipeData({ ...recipeData, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-900"
                      />
                    </div>
                    {recipeData.youtubeUrl && (
                      <div className="flex h-32 sm:h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-900 text-white">
                        <p className="text-xs sm:text-sm opacity-70">Превʼю відео</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                Превью
              </p>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="aspect-video rounded-md bg-gradient-to-br from-slate-200 to-slate-300" />
                  <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 line-clamp-1">
                    {recipeData.name || "Введіть назву..."}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    {recipeData.description || "Опис появиться тут..."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[{
                    label: "⏱️ Приготування",
                    value: `${recipeData.prepTime}м`,
                  }, {
                    label: "🔥 Варка",
                    value: `${recipeData.cookTime}м`,
                  }, {
                    label: "👥 Порції",
                    value: `${recipeData.servings}`,
                  }, {
                    label: "💰 Ціна",
                    value: `${recipeData.price}₴`,
                  }].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-2 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {stat.label}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-slate-900">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-slate-500">
                  📸 {recipeData.images.length} фото • 🎬 {recipeData.youtubeUrl ? "відео" : "без відео"}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-500 transition disabled:opacity-50 hover:bg-slate-50"
            >
              <ArrowLeft size={14} /> Назад
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Далі <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <Check size={14} /> Опублікувати
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
