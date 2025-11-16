"use client";

import { motion } from "framer-motion";
import { X, Heart, MessageCircle, Share2, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface RecipeModalData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    level?: number;
  };
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cookingTime?: number;
  servings?: number;
  ingredients: string[];
  steps: string[];
  likes?: number;
  comments?: number;
  category?: string;
  rating?: number;
  tokensEarned?: number;
}

interface RecipeModalContentProps {
  recipe: RecipeModalData;
  onClose?: () => void;
  nextRecipeId?: string;
  prevRecipeId?: string;
}

export function RecipeModalContent({
  recipe,
  onClose,
  nextRecipeId,
  prevRecipeId,
}: RecipeModalContentProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(recipe.likes || 0);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900";
      case "advanced":
        return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900";
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-900";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "Początkujący";
      case "intermediate":
        return "Średniozaawansowany";
      case "advanced":
        return "Zaawansowany";
      default:
        return "Poziom";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex items-center justify-center"
    >
      {/* Close Button - Top Right */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all"
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* Main Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Side - Image & Actions */}
        <div className="relative bg-gradient-to-br from-sky-500/20 to-cyan-500/20 dark:from-sky-950 dark:to-cyan-950 flex flex-col">
          {/* Image Section */}
          <div className="relative flex-1 min-h-[300px] md:min-h-[500px] overflow-hidden group">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Title & Author Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2">
                {recipe.title}
              </h2>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                {recipe.author.avatar && (
                  <img
                    src={recipe.author.avatar}
                    alt={recipe.author.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                )}
                <div>
                  <p className="font-semibold">{recipe.author.name}</p>
                  {recipe.author.level && (
                    <p className="text-xs text-white/70">Level {recipe.author.level}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar - Below Image */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                liked
                  ? "bg-red-500/20 text-red-600 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{likes}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">{recipe.comments || 0}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-medium">Share</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSaved(!saved)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                saved
                  ? "bg-sky-500/20 text-sky-600 dark:text-sky-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">Save</span>
            </motion.button>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col p-4 md:p-6 space-y-6 md:max-h-[90vh] md:overflow-y-auto">
          {/* Recipe Info Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.difficulty && (
              <div
                className={`px-3 py-1.5 rounded-full border text-xs font-medium ${getDifficultyColor(
                  recipe.difficulty
                )}`}
              >
                {getDifficultyLabel(recipe.difficulty)}
              </div>
            )}

            {recipe.cookingTime && (
              <div className="px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                ⏱️ {recipe.cookingTime} min
              </div>
            )}

            {recipe.servings && (
              <div className="px-3 py-1.5 rounded-full border border-green-200 dark:border-green-900 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                🍽️ {recipe.servings} porcji
              </div>
            )}

            {recipe.tokensEarned && (
              <div className="px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-900 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                💰 +{recipe.tokensEarned} ChefTokens
              </div>
            )}
          </div>

          {/* Description */}
          {recipe.description && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Opis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {recipe.description}
              </p>
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              🥘 Składniki ({recipe.ingredients.length})
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="text-xs font-bold text-sky-500 mt-0.5 min-w-[20px]">
                    ✓
                  </span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              👨‍🍳 Kroki ({recipe.steps.length})
            </h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 pt-0.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Rating (if available) */}
          {recipe.rating && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(recipe.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-700"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {recipe.rating.toFixed(1)} / 5
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {prevRecipeId && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push(`/recipes/${prevRecipeId}`)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {nextRecipeId && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push(`/recipes/${nextRecipeId}`)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </motion.div>
  );
}
