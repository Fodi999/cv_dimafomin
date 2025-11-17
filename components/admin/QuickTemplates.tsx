"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChefHat, Zap, RefreshCw, X } from "lucide-react";
import { getTemplatesByCuisine, generateRandomRecipe, RecipeTemplate } from "@/lib/recipe-templates";

interface QuickTemplatesProps {
  cuisine: string;
  onSelectTemplate: (template: RecipeTemplate) => void;
  onGenerateRandom: () => void;
}

export function QuickTemplates({ cuisine, onSelectTemplate, onGenerateRandom }: QuickTemplatesProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const templates = getTemplatesByCuisine(cuisine);

  if (!cuisine || templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={() => setShowTemplates(!showTemplates)}
          variant="outline"
          className="flex items-center gap-2 w-full"
        >
          <ChefHat size={18} />
          Швидкі шаблони ({templates.length})
        </Button>
        <Button
          onClick={onGenerateRandom}
          variant="outline"
          className="flex items-center gap-2"
          title="Генерувати випадковий рецепт для тестування"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {templates.map((template, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  onSelectTemplate(template);
                  setShowTemplates(false);
                }}
                className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {template.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {template.difficulty === "easy"
                          ? "Легко"
                          : template.difficulty === "medium"
                            ? "Середньо"
                            : "Складно"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        ⏱️ {template.prepTime + template.cookTime} хв
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        {template.image} {template.ingredients.length} інгредієнтів
                      </span>
                    </div>
                  </div>
                  <Zap size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
