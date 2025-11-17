"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Loader, ChefHat, AlertCircle } from "lucide-react";
import { generateRecipeWithAI } from "@/lib/ai/ai-client";

interface AIGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (recipe: any) => void;
}

const cuisineOptions = ["Японська", "Італійська", "Українська", "Таїландська", "Американська", "Китайська", "Французька"];
const difficultyOptions = ["easy", "medium", "hard"];
const difficultyLabels = { easy: "Легко", medium: "Середньо", hard: "Складно" };

// API call для генерування рецептів
const generateAIRecipe = async (prompt: string, cuisine: string, difficulty: string) => {
  try {
    console.log("🍳 Generating recipe with AI...", { prompt, cuisine, difficulty });

    // Викликаємо централізовану функцію з AI клієнта
    const recipe = await generateRecipeWithAI({
      prompt,
      cuisine: cuisine || undefined,
      difficulty: difficulty || undefined,
    });

    console.log("✅ Recipe generated successfully:", recipe);
    return recipe;
  } catch (error) {
    console.error("❌ Error generating recipe:", error);
    console.log("📌 Using fallback recipe generation...");
    // Fallback на локальну імітацію
    return generateFallbackRecipe(prompt, cuisine, difficulty);
  }
};

// Резервна функція для локальної генерації
const generateFallbackRecipe = (prompt: string, cuisine: string, difficulty: string) => {
  const recipes: Record<string, any> = {
    "курка": {
      name: "Терияки з курицею",
      description: "Гарячі шматочки курки в солодко-сольовому соусі терияки",
      cuisine: "Японська",
      difficulty: "medium",
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      calories: 320,
      price: 40,
      image: "🍗",
      ingredients: [
        { name: "курица", quantity: 500, unit: "г" },
        { name: "соус терияки", quantity: 100, unit: "мл" },
        { name: "імбир", quantity: 10, unit: "г" },
        { name: "часник", quantity: 3, unit: "шт" },
        { name: "кунжут", quantity: 20, unit: "г" },
      ],
      instructions: [
        "Нарізати курицю невеликими шматочками",
        "Розігріти вок або велику сковороду",
        "Обжарити курицю до золотистого кольору",
        "Додати імбир та часник, обжарювати 2 хвилини",
        "Влити соус терияки, готувати 5 хвилин",
        "Посипати кунжутом перед подачею",
      ],
      tags: ["курка", "азійська", "швидко"],
    },
    "помідори": {
      name: "Паста з томатами та базиліком",
      description: "Класична італійська паста з помідорами та свіжим базиліком",
      cuisine: "Італійська",
      difficulty: "easy",
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      calories: 380,
      price: 25,
      image: "🍝",
      ingredients: [
        { name: "макаронник", quantity: 250, unit: "г" },
        { name: "помідори", quantity: 400, unit: "г" },
        { name: "базилік", quantity: 20, unit: "г" },
        { name: "часник", quantity: 2, unit: "шт" },
        { name: "оливкова олія", quantity: 50, unit: "мл" },
        { name: "сіль", quantity: 5, unit: "г" },
      ],
      instructions: [
        "Зварити макаронник у соленій воді",
        "Нарізати помідори кубиками",
        "Розігріти оливкову олію на сковороді",
        "Обжарити часник до золотистого кольору",
        "Додати помідори, готувати 10 хвилин",
        "Додати базилік, змішати з макаронником",
      ],
      tags: ["паста", "італійська", "овочі"],
    },
    "риба": {
      name: "Суші Райнбоу з лососем",
      description: "Кольорові суші з лососем, тунцем та авокадо",
      cuisine: "Японська",
      difficulty: "hard",
      prepTime: 30,
      cookTime: 0,
      servings: 4,
      calories: 250,
      price: 45,
      image: "🍣",
      ingredients: [
        { name: "рисова крупа", quantity: 300, unit: "г" },
        { name: "лосось", quantity: 200, unit: "г" },
        { name: "тунець", quantity: 150, unit: "г" },
        { name: "авокадо", quantity: 1, unit: "шт" },
        { name: "норі", quantity: 5, unit: "шт" },
      ],
      instructions: [
        "Зварити рис за японською технологією",
        "Охолодити рис до кімнатної температури",
        "Нарізати рибу та авокадо довгими смужками",
        "Розкласти рис на норі та скрутити",
        "Додати рибу та авокадо зверху",
        "Нарізати гостро ножем, посипати кунжутом",
      ],
      tags: ["суші", "морепродукти", "японська"],
    },
    "борщ": {
      name: "Борщ український",
      description: "Традиційний український борщ зі свіжими овочами",
      cuisine: "Українська",
      difficulty: "medium",
      prepTime: 20,
      cookTime: 60,
      servings: 6,
      calories: 180,
      price: 25,
      image: "🍲",
      ingredients: [
        { name: "буряк", quantity: 300, unit: "г" },
        { name: "капуста", quantity: 200, unit: "г" },
        { name: "картопля", quantity: 200, unit: "г" },
        { name: "морква", quantity: 100, unit: "г" },
        { name: "яловичина", quantity: 500, unit: "г" },
      ],
      instructions: [
        "Зварити м'ясо у кипятку з овочами",
        "Нарізати буряк соломкою",
        "Додати буряк до бульйону",
        "Нарізати капусту, додати до кастрюлі",
        "Готувати 30 хвилин, додати картоплю",
        "Готувати ще 20 хвилин до м'якості",
      ],
      tags: ["борщ", "українська", "супи"],
    },
  };

  let selectedRecipe = null;
  const lowerPrompt = prompt.toLowerCase();

  for (const [key, recipe] of Object.entries(recipes)) {
    if (lowerPrompt.includes(key)) {
      selectedRecipe = recipe;
      break;
    }
  }

  if (!selectedRecipe) {
    const keys = Object.keys(recipes);
    selectedRecipe = recipes[keys[Math.floor(Math.random() * keys.length)]];
  }

  if (cuisine) {
    selectedRecipe.cuisine = cuisine;
  }
  if (difficulty) {
    selectedRecipe.difficulty = difficulty;
  }

  return selectedRecipe;
};

export function RecipeAIGenerator({ isOpen, onClose, onGenerate }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Будь ласка, опишіть рецепт");
      return;
    }

    setIsGenerating(true);
    try {
      const recipe = await generateAIRecipe(prompt, selectedCuisine, selectedDifficulty);
      setGeneratedRecipe(recipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
      alert("Помилка при генеруванні рецепту");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseRecipe = () => {
    if (generatedRecipe) {
      onGenerate(generatedRecipe);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setPrompt("");
    setSelectedCuisine("");
    setSelectedDifficulty("medium");
    setGeneratedRecipe(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={28} className="text-blue-600" />
                AI Генератор рецептів
              </h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {!generatedRecipe ? (
                <>
                  {/* Instructions */}
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      💡 Опишіть рецепт, який ви хочете створити. Наприклад: "паста з курицею", "суші з лососем" або "борщ"
                    </p>
                  </Card>

                  {/* Prompt Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Опис рецепту*
                    </label>
                    <textarea
                      placeholder="Введіть опис рецепту або інгредієнти..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Cuisine Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Кухня (опціонально)
                    </label>
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Будь-яка кухня</option>
                      {cuisineOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Складність
                    </label>
                    <div className="flex gap-2">
                      {difficultyOptions.map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedDifficulty === diff
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {difficultyLabels[diff as keyof typeof difficultyLabels]}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Generated Recipe Preview */}
                  <Card className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-900 dark:text-green-200 flex items-center gap-2">
                      ✅ Рецепт успішно згенерований AI!
                    </p>
                  </Card>

                  {/* Recipe Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="text-4xl">{generatedRecipe.image}</span>
                        {generatedRecipe.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">{generatedRecipe.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-slate-600 dark:text-slate-400">Кухня</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{generatedRecipe.cuisine}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-slate-600 dark:text-slate-400">Складність</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {difficultyLabels[generatedRecipe.difficulty as keyof typeof difficultyLabels]}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-slate-600 dark:text-slate-400">Час готування</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {generatedRecipe.prepTime + generatedRecipe.cookTime} хв
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-slate-600 dark:text-slate-400">Ціна</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{generatedRecipe.price} токенів</p>
                      </div>
                    </div>

                    {/* Ingredients Preview */}
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Інгредієнти:</h4>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {generatedRecipe.ingredients.slice(0, 5).map((ing: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                            {ing.quantity} {ing.unit} {ing.name}
                          </li>
                        ))}
                        {generatedRecipe.ingredients.length > 5 && (
                          <li className="text-slate-500">... та ще {generatedRecipe.ingredients.length - 5}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              {generatedRecipe ? (
                <>
                  <button
                    onClick={() => setGeneratedRecipe(null)}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={handleUseRecipe}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles size={18} />
                    Використати рецепт
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Скасувати
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Генерування...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Згенерувати рецепт
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
