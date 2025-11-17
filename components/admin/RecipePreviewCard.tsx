"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Star, TrendingUp, Clock, DollarSign, Flame, Play, Plus } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  price: number;
  rating: number;
  reviews: number;
  status: "draft" | "published" | "archived";
  author: string;
  tags: string[];
  views: number;
  purchases: number;
  revenue: number;
  createdAt: Date;
  updatedAt: Date;
  ingredients?: Array<{ name: string; quantity: number; unit: string }>;
  instructions?: string[];
  youtubeUrl?: string;
  images?: string[];
}

interface RecipePreviewCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onShowDetails: (recipe: Recipe) => void; // 🔧 Новый callback для открытия панели
}

const difficultyConfig = {
  easy: { label: "Легко", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", icon: "🟢" },
  medium: { label: "Середньо", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400", icon: "🟡" },
  hard: { label: "Складно", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", icon: "🔴" },
};

const statusConfig = {
  draft: { label: "Чернетка", color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300", icon: "📝" },
  published: { label: "Опубліковано", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", icon: "✅" },
  archived: { label: "Архівовано", color: "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300", icon: "🗂️" },
};

export function RecipePreviewCard({ recipe, onEdit, onDelete, onShowDetails }: RecipePreviewCardProps) {
  // 🔧 Удаляем локальный state для showDetails
  
  const totalTime = recipe.prepTime + recipe.cookTime;
  const diffConfig = difficultyConfig[recipe.difficulty];
  const statConfig = statusConfig[recipe.status];

  // Перевірка чи це base64 фото або емодзі
  const isImageData = recipe.image.startsWith('data:');
  const isEmoji = !isImageData && recipe.image.length <= 2;
  
  // Отримуємо масив фото
  const photos = recipe.images && recipe.images.length > 0 ? recipe.images : [];
  const hasYoutube = recipe.youtubeUrl && recipe.youtubeUrl.length > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
        {/* Header with image/icon and badges */}
        <div className="relative bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 h-32 flex items-center justify-center overflow-hidden">
          {isImageData ? (
            <img 
              src={recipe.image} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={isEmoji ? "text-5xl" : "text-2xl text-center px-2"}>
              {recipe.image}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex gap-2 flex-wrap justify-start">
            <Badge className={diffConfig.color}>{diffConfig.label}</Badge>
            <Badge className={statConfig.color}>{statConfig.label}</Badge>
          </div>

          {/* Status indicator */}
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-white shadow-lg"></div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col space-y-3">
          {/* Name */}
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight">
              {recipe.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{recipe.cuisine}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 flex-1">
            {recipe.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <Clock size={14} />
              <span>{totalTime}хв</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <Flame size={14} />
              <span>{recipe.calories} ккал</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <Star size={14} className="text-yellow-500" />
              <span>{recipe.rating} ({recipe.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <DollarSign size={14} className="text-green-600" />
              <span>{recipe.price} токенів</span>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="space-y-2 py-3 bg-slate-50 dark:bg-slate-800 px-3 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Eye size={12} />
                Переглядів:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{recipe.views}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <TrendingUp size={12} />
                Покупок:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{recipe.purchases}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Доход:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{recipe.revenue} токенів</span>
            </div>
          </div>
        </div>

        {/* Photos indicator */}
        {photos.length > 0 && (
          <div className="px-4 pt-2 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <Plus size={12} className="text-blue-500" />
            <span>{photos.length} фото</span>
          </div>
        )}
        
        {/* Video indicator */}
        {hasYoutube && (
          <div className="px-4 pb-2 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <Play size={12} className="text-red-500" />
            <span>Є відео</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onShowDetails(recipe)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
          >
            <Eye size={16} />
            Деталі
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(recipe)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors"
          >
            <Edit size={16} />
            Редагувати
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(recipe.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium text-sm transition-colors"
          >
            <Trash2 size={16} />
            Видалити
          </motion.button>
        </div>
      </Card>
    </motion.div>
    </>
  );
}
