"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  // Функция для извлечения YouTube ID из URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
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
    console.log("Recipe submitted:", recipeData);
    router.push("/admin/recipes");
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#f3f3f3] dark:bg-slate-950 pt-16 sm:pt-20">
      <div className="mx-auto w-full max-w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/admin/recipes" className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft size={12} />
            Назад
          </Link>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <p>Крок {currentStep + 1}/{steps.length}</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-4 sm:p-6 md:p-8 shadow-lg backdrop-blur dark:border-slate-800/50 dark:bg-slate-900/80 min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
          <div className="mb-6 space-y-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">Recipe Builder</p>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Створення рецепту
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Три кроки, плавні переходи, live preview.
            </p>
          </div>

          {/* Form + preview */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Left column: Stepper + Form */}
            <div className="space-y-4 lg:pr-4">
              {/* Stepper */}
              <div>
                <div className="flex items-center justify-between">
                  {steps.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isDone = idx < currentStep;

                    return (
                      <div key={step} className="flex flex-1 flex-col items-center">
                        <button
                          onClick={() => setCurrentStep(idx)}
                          className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                            isDone
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                              : isActive
                              ? "border border-slate-900 text-slate-900 dark:border-white dark:text-white"
                              : "border border-slate-200 text-slate-400 dark:border-slate-600 dark:text-slate-500"
                          }`}
                        >
                          {isDone ? <Check size={12} /> : idx + 1}
                        </button>
                        <p className={`mt-0.5 text-[9px] sm:text-[10px] font-semibold ${isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 h-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
                  <motion.div
                    className="h-full rounded-full bg-slate-900 dark:bg-white"
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Form content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                {currentStep === 0 && (
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Назва та опис</h2>
                      <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300">Коротко розкажи що готуємо.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                          Назва рецепту
                        </label>
                        <input
                          value={recipeData.name}
                          onChange={(e) => setRecipeData({ ...recipeData, name: e.target.value })}
                          placeholder="Суші-ролл Спайсі"
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition focus:border-slate-900 dark:focus:border-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                          Опис рецепту
                        </label>
                        <textarea
                          value={recipeData.description}
                          onChange={(e) => {
                            setRecipeData({ ...recipeData, description: e.target.value });
                            // Автоматическое расширение textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          onFocus={(e) => {
                            // При фокусе тоже пересчитываем высоту
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          placeholder="Збалансований та смачний..."
                          className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition focus:border-slate-900 dark:focus:border-white overflow-y-auto"
                          style={{ minHeight: '60px', maxHeight: '400px' }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                            Порції
                          </label>
                          <input
                            type="number"
                            value={recipeData.servings}
                            onChange={(e) => setRecipeData({ ...recipeData, servings: parseInt(e.target.value) || 0 })}
                            placeholder="2"
                            min="1"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition focus:border-slate-900 dark:focus:border-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                            Ціна (₴)
                          </label>
                          <input
                            type="number"
                            value={recipeData.price}
                            onChange={(e) => setRecipeData({ ...recipeData, price: parseInt(e.target.value) || 0 })}
                            placeholder="199"
                            min="0"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition focus:border-slate-900 dark:focus:border-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Додай фото</h2>
                      <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300">Завантажте кілька фото (PNG / JPG до 5 МБ).</p>
                    </div>
                    <label className="flex h-24 sm:h-32 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:border-slate-900 dark:hover:border-white cursor-pointer">
                      <span className="text-xl sm:text-2xl">📸</span>
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
                          setRecipeData({ ...recipeData, images: [...recipeData.images, ...previews] });
                        }}
                      />
                    </label>
                    {!!recipeData.images.length && (
                      <div className="grid grid-cols-2 gap-1.5">
                        {recipeData.images.map((img, idx) => (
                          <div key={idx} className="relative overflow-hidden rounded-md border border-slate-200 dark:border-slate-600 group">
                            <img src={img} alt={`preview ${idx + 1}`} className="h-20 sm:h-24 w-full object-cover" />
                            <button
                              onClick={() => {
                                const newImages = recipeData.images.filter((_, i) => i !== idx);
                                setRecipeData({ ...recipeData, images: newImages });
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Видалити"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">YouTube відео</h2>
                      <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300">Вставте посилання на YouTube відео.</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                        Посилання
                      </label>
                      <input
                        value={recipeData.youtubeUrl}
                        onChange={(e) => setRecipeData({ ...recipeData, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition focus:border-slate-900 dark:focus:border-white"
                      />
                    </div>
                    {recipeData.youtubeUrl && getYouTubeVideoId(recipeData.youtubeUrl) && (
                      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(recipeData.youtubeUrl)}`}
                          title="YouTube video preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-600 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ArrowLeft size={12} /> Назад
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 rounded-full bg-slate-900 dark:bg-white px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-slate-100"
                >
                  Далі <ArrowRight size={12} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                >
                  <Check size={12} /> Опублікувати
                </button>
              )}
            </div>
          </div>

          {/* Right column: Preview */}
          <div className="space-y-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/80 p-4 sm:p-5 lg:sticky lg:top-20 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">
              Превью
            </p>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 sm:p-4">
                {(recipeData.images.length > 0 || recipeData.youtubeUrl) ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {recipeData.images.map((image, index) => (
                        <CarouselItem key={`img-${index}`}>
                          <div className="aspect-video rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Recipe preview ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                      {recipeData.youtubeUrl && getYouTubeVideoId(recipeData.youtubeUrl) && (
                        <CarouselItem key="youtube">
                          <div className="aspect-video rounded-md bg-slate-900 overflow-hidden">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${getYouTubeVideoId(recipeData.youtubeUrl)}`}
                              title="YouTube video preview"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                    {(recipeData.images.length + (recipeData.youtubeUrl && getYouTubeVideoId(recipeData.youtubeUrl) ? 1 : 0)) > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                ) : (
                  <div className="aspect-video rounded-md bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                )}
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">
                  {recipeData.name || "Введіть назву..."}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                  {recipeData.description || "Опис появиться тут..."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
                  <div key={stat.label} className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-sm sm:text-base font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span>📸 {recipeData.images.length} фото</span>
                <span>•</span>
                <span>🎬 {recipeData.youtubeUrl ? "відео" : "без відео"}</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
