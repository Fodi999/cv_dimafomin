"use client";

import { motion } from "framer-motion";
import { Star, Users, Coins, Check, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MarketRecipe } from "@/hooks/useMarketRecipes";
import Image from "next/image";

interface MarketRecipeCardProps {
  recipe: MarketRecipe;
  onBuy?: (recipe: MarketRecipe) => void;
  onOpen?: (recipe: MarketRecipe) => void;
  isAdded?: boolean;
}

export function MarketRecipeCard({
  recipe,
  onBuy,
  onOpen,
  isAdded = false,
}: MarketRecipeCardProps) {
  const { t } = useLanguage();

  const levelLabel = t.market.difficulty[recipe.level] || recipe.level;

  const handleAction = () => {
    if (recipe.owned && onOpen) {
      onOpen(recipe);
    } else if (!recipe.owned && onBuy) {
      onBuy(recipe);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group cursor-pointer h-full"
    >
      <div className="bg-gradient-to-br from-sky-500/10 to-cyan-500/10 rounded-2xl overflow-hidden border border-sky-300/40 hover:border-sky-300/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden h-56">
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={400}
            height={224}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Owned badge */}
          {recipe.owned && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-green-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              {t.market.owned}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
            {recipe.title}
          </h3>

          {/* Description (if available) */}
          {recipe.description && (
            <p className="text-gray-300 text-sm mb-4 flex-grow leading-relaxed line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="space-y-2 mb-4 pb-4 border-t border-sky-300/30 pt-4">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{recipe.rating.toFixed(1)}</span>
              <span className="text-gray-400">•</span>
              <Users className="w-4 h-4 text-sky-400" />
              <span>{recipe.reviews}</span>
            </div>
            <div className="text-gray-400 text-sm">
              Poziom: <span className="text-white font-medium">{levelLabel}</span>
            </div>
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-sky-400" />
              <span className="font-bold text-lg text-white">{recipe.priceCT} CT</span>
            </div>
            
            {isAdded ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Dodano
              </motion.div>
            ) : recipe.owned ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAction}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                {t.market.open}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAction}
                className="px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {t.market.buy}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
