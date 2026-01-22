"use client";

import { motion } from "framer-motion";
import { Clock, Users, ChefHat, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CatalogRecipe } from "@/lib/api/catalog";

interface CatalogRecipeCardProps {
  recipe: CatalogRecipe;
}

export default function CatalogRecipeCard({ recipe }: CatalogRecipeCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => router.push(`/recipes/${recipe.canonicalName}`)}
      className="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-gray-300 dark:text-gray-700" />
          </div>
        )}
        
        {/* Can Cook Now Badge */}
        {recipe.canCookNow && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-semibold shadow-lg">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Можно готовить!</span>
          </div>
        )}
        
        {/* Match Percent Badge (if not 100%) */}
        {!recipe.canCookNow && recipe.matchPercent !== undefined && recipe.matchPercent > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-semibold shadow-lg">
            {recipe.matchPercent}% совпадение
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {recipe.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {recipe.cookTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime} мин</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} порц.</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
