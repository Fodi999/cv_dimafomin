"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, Users, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gradients } from "@/lib/design-tokens";
import Image from "next/image";
import Link from "next/link";

/**
 * RecipeCard для Marketplace
 * 
 * Карточка рецепта в маркетплейсе для покупки за ChefTokens.
 * Показывает цену, рейтинг, количество студентов, уровень сложности.
 * 
 * @usage Используется на странице /market для листинга рецептов
 * @features
 * - Price in ChefTokens (монетизация)
 * - Rating (⭐) & students count
 * - Buy button → purchase flow
 * - Compact design для grid layout
 * - Навигация на /market/[id]
 * 
 * @see components/assistant/RecipeCard.tsx - для AI-рекомендаций
 * @see components/recipes/RecipeCard.tsx - для общего списка
 */
interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  studentsCount: number;
  image: string;
  author: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export default function RecipeCard({
  id,
  title,
  description,
  price,
  rating,
  studentsCount,
  image,
  author,
  difficulty,
}: RecipeCardProps) {
  const difficultyColors = {
    beginner: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
    intermediate: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
    advanced: "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400",
  };

  const difficultyLabels = {
    beginner: "Початківець",
    intermediate: "Середній",
    advanced: "Професіонал",
  };

  return (
    <Link href={`/market/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-md hover:shadow-2xl dark:hover:shadow-sky-500/20 overflow-hidden group cursor-pointer border-2 border-transparent hover:border-sky-400/30 dark:hover:border-sky-600/30 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 right-4">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${difficultyColors[difficulty]} shadow-lg`}
            >
              {difficultyLabels[difficulty]}
            </motion.span>
          </div>

          {/* Price badge on hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-xl font-bold text-sky-600 dark:text-sky-400">{price} zł</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-4 font-medium">
            <ChefHat className="w-4 h-4" />
            <span>{author}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-700 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{studentsCount}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{price} zł</span>
            </div>
            <Button
              size="sm"
              className={`${gradients.primary} text-white hover:shadow-lg dark:hover:shadow-sky-500/30 hover:scale-105 transition-all duration-300`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Купити
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
