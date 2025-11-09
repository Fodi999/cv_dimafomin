// RecipeCard.tsx - Component for displaying generated recipe with accordion sections

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Users, Flame, ChevronDown, UtensilsCrossed, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

interface RecipeCardProps {
  recipe: {
    title: string;
    description?: string;
    ingredients?: Ingredient[];
    steps?: string[];
    servings?: number;
    timeMinutes?: number;
    difficulty?: string;
    imageUrl?: string;
  };
  recipeImage: string | null;
  expandedSections: {
    ingredients: boolean;
    steps: boolean;
  };
  onToggleSection: (section: 'ingredients' | 'steps') => void;
  onPublish: () => void;
  onModify: () => void;
}

export function RecipeCard({
  recipe,
  recipeImage,
  expandedSections,
  onToggleSection,
  onPublish,
  onModify,
}: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">Рецепт готовий!</h3>
      </div>

      {(recipeImage || recipe.imageUrl) && (
        <div className="mb-5 rounded-xl overflow-hidden shadow-md">
          <Image
            src={recipeImage || recipe.imageUrl || ""}
            alt={recipe.title}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <h4 className="text-2xl font-bold text-gray-900 mb-3">{recipe.title}</h4>
      <p className="text-[#444] leading-[1.6] mb-5">{recipe.description}</p>

      <div className="flex gap-4 text-sm text-gray-600 mb-6 flex-wrap">
        {recipe.servings && (
          <span className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4 text-orange-600" />
            {recipe.servings} порцій
          </span>
        )}
        {recipe.timeMinutes && (
          <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-blue-600" />
            {recipe.timeMinutes} хв
          </span>
        )}
        {recipe.difficulty && (
          <span className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-red-600" />
            {recipe.difficulty}
          </span>
        )}
      </div>

      {/* Ingredients - Accordion */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => onToggleSection('ingredients')}
            className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-orange-600" />
              <h5 className="text-lg font-bold text-gray-900">Інгредієнти</h5>
              <span className="text-sm text-gray-500">
                ({recipe.ingredients.length})
              </span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-600 transition-transform ${
                expandedSections.ingredients ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <AnimatePresence>
            {expandedSections.ingredients && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <ul className="space-y-2 pt-3 px-3">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>
                        <span className="font-medium">{ingredient.name}</span>
                        {ingredient.quantity && (
                          <span className="text-gray-600">
                            {' '}- {ingredient.quantity} {ingredient.unit}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Steps - Accordion */}
      {recipe.steps && recipe.steps.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => onToggleSection('steps')}
            className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              <h5 className="text-lg font-bold text-gray-900">Приготування</h5>
              <span className="text-sm text-gray-500">
                ({recipe.steps.length} кроків)
              </span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-600 transition-transform ${
                expandedSections.steps ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <AnimatePresence>
            {expandedSections.steps && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <ol className="space-y-3 pt-3 px-3">
                  {recipe.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <Button
          onClick={onPublish}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          Опублікувати рецепт
        </Button>
        <Button
          onClick={onModify}
          variant="outline"
          className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all active:scale-95"
        >
          Змінити
        </Button>
      </div>
    </motion.div>
  );
}
