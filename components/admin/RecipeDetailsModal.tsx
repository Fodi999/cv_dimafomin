"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface RecipeDetailsModalProps {
  isOpen: boolean;
  recipe: {
    id: string;
    name: string;
    description: string;
    cuisine: string;
    difficulty: "easy" | "medium" | "hard";
    prepTime: number;
    cookTime: number;
    servings: number;
    calories: number;
    price: number;
    rating: number;
    reviews: number;
    images?: string[];
    youtubeUrl?: string;
    ingredients?: Ingredient[];
    instructions?: string[];
  };
  onClose: () => void;
}

const difficultyLabels = {
  easy: "Легко",
  medium: "Середньо",
  hard: "Складно",
};

export function RecipeDetailsModal({ isOpen, recipe, onClose }: RecipeDetailsModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const photos = recipe.images && recipe.images.length > 0 ? recipe.images : [];
  const hasYoutube = recipe.youtubeUrl && recipe.youtubeUrl.length > 0;

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  // 🔧 Скроллим вверх при открытии или смене рецепта
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.scrollTop = 0;
      setCurrentPhotoIndex(0); // Сбрасываем индекс фото
    }
  }, [isOpen, recipe.id]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />

          {/* Side Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-screen w-full md:w-1/2 bg-white dark:bg-slate-900 z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">{recipe.name}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Photos Gallery - Optimized for side panel */}
              {photos.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">📸 Фото ({photos.length})</h3>
                  <div className="space-y-2">
                    {/* Main photo */}
                    <div className="relative bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden h-72 flex items-center justify-center">
                      {photos[currentPhotoIndex] && photos[currentPhotoIndex].startsWith("data:") ? (
                        <img
                          src={photos[currentPhotoIndex]}
                          alt={`${recipe.name} - ${currentPhotoIndex + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : photos[currentPhotoIndex] ? (
                        <div className="text-4xl">{photos[currentPhotoIndex]}</div>
                      ) : (
                        <div className="text-4xl">🍳</div>
                      )}

                      {/* Navigation */}
                      {photos.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                            className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={() => setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      {/* Photo counter */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                        {currentPhotoIndex + 1} / {photos.length}
                      </div>
                    </div>

                    {/* Thumbnails */}
                    {photos.length > 1 && (
                      <div className="grid grid-cols-2 gap-2">
                        {photos.map((photo, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPhotoIndex(idx)}
                            className={`w-full aspect-square rounded-md overflow-hidden border transition-all ${
                              currentPhotoIndex === idx
                                ? "border-blue-500 ring-2 ring-blue-400"
                                : "border-slate-300 dark:border-slate-600 hover:border-slate-400"
                            }`}
                          >
                            {photo && photo.startsWith("data:") ? (
                              <img src={photo} alt={`thumb ${idx}`} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-lg">
                                {photo || "🍳"}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video */}
              {hasYoutube && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">🎥 Відео</h3>
                  <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getYoutubeEmbedUrl(recipe.youtubeUrl!) || ""}
                      title={recipe.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {recipe.description && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">📝 Опис</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{recipe.description}</p>
                </div>
              )}

              {/* Ingredients */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">🥘 Інгредієнти</h3>
                  <div className="space-y-1">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-sm text-slate-900 dark:text-white font-medium">{ingredient.name}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {recipe.instructions && recipe.instructions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">👨‍🍳 Приготування</h3>
                  <div className="space-y-2">
                    {recipe.instructions.map((instruction, idx) => (
                      <div key={idx} className="flex gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-900 dark:text-white pt-0.5">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Info */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">ℹ️ Інформація</h3>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Кухня</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{recipe.cuisine}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Складність</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{difficultyLabels[recipe.difficulty]}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Підготовка</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{recipe.prepTime}м</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Варка</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{recipe.cookTime}м</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Порції</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{recipe.servings}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Калорії</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{recipe.calories}ккал</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Ціна</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{recipe.price}т</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Рейтинг</p>
                    <p className="text-slate-900 dark:text-white font-semibold">⭐ {recipe.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
