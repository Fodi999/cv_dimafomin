"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface RecipeCardProps {
  id: string;
  title: string;
  imageUrl: string;
  author: {
    name: string;
    avatar?: string;
  };
  difficulty?: "beginner" | "intermediate" | "advanced";
  likes?: number;
  comments?: number;
  cookingTime?: number;
  category?: string;
}

export function RecipeCard({
  id,
  title,
  imageUrl,
  author,
  difficulty,
  likes = 0,
  comments = 0,
  cookingTime,
  category,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/80";
      case "intermediate":
        return "bg-yellow-500/80";
      case "advanced":
        return "bg-red-500/80";
      default:
        return "bg-gray-500/80";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "Początkujący";
      case "intermediate":
        return "Średni";
      case "advanced":
        return "Zaawansowany";
      default:
        return "Poziom";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) {
      e.preventDefault();
    }
  };

  return (
    <Link href={`/recipes/${id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-md hover:shadow-xl transition-shadow"
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-sky-200 to-cyan-200 dark:from-sky-950 dark:to-cyan-950">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Difficulty Badge */}
          {difficulty && (
            <div
              className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold ${getDifficultyColor(
                difficulty
              )}`}
            >
              {getDifficultyLabel(difficulty)}
            </div>
          )}

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-sky-500/80 text-white text-xs font-semibold">
              {category}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Author Info - Only on Hover */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            )}
            <div className="text-white">
              <p className="text-xs font-semibold line-clamp-1">{author.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-xs mb-3">
            {cookingTime && (
              <span className="flex items-center gap-1">
                <span>⏱️</span>
                <span>{cookingTime} min</span>
              </span>
            )}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  setLiked(!liked);
                }}
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  liked
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                <span>{liked ? likes + 1 : likes}</span>
              </motion.button>

              {/* Comments */}
              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{comments}</span>
              </button>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                setSaved(!saved);
              }}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                saved
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
