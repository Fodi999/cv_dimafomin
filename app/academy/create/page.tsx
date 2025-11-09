"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Upload, Loader2, Plus, Trash2, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreateRecipePostData, IngredientData } from "@/lib/types";
import { RECIPE_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants";
import { getNutritionInfo } from "@/lib/nutrition-data";

export default function CreateRecipePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const community = (t.academy as any)?.community;

  const [formData, setFormData] = useState<CreateRecipePostData>({
    title: "",
    description: "",
    imageUrl: "",
    ingredients: [{ name: "", brutto: undefined, netto: undefined, unit: "г" }],
    steps: [""],
    category: "",
    difficulty: "beginner",
    cookingTime: undefined,
    servings: undefined,
  });

  const [aiPrompt, setAiPrompt] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingNutrition, setLoadingNutrition] = useState<{ [key: number]: boolean }>({});

  // Fetch ingredient nutrition
  const fetchIngredientNutrition = async (index: number, ingredientName: string, weight?: number) => {
    if (!ingredientName.trim()) return;

    setLoadingNutrition(prev => ({ ...prev, [index]: true }));

    try {
      const { aiApi } = await import("@/lib/api");
      const token = localStorage.getItem("token");
      let nutritionData: any = null;

      try {
        nutritionData = await aiApi.getIngredientNutrition(ingredientName, weight, token || undefined);
      } catch (error) {
        console.log("Backend nutrition failed, using local database");
        nutritionData = getNutritionInfo(ingredientName, weight || 100);
      }

      if (nutritionData) {
        setFormData(prev => ({
          ...prev,
          ingredients: prev.ingredients.map((item, i) => {
            if (i === index) {
              const ingredient = typeof item === 'string' ? { name: item } : item;
              return {
                ...ingredient,
                calories: nutritionData.calories,
                protein: nutritionData.protein,
                fat: nutritionData.fat,
                carbs: nutritionData.carbs,
                totalCalories: nutritionData.totalCalories,
              } as IngredientData;
            }
            return item;
          }),
        }));
      }
    } catch (error) {
      console.error("Error fetching nutrition:", error);
    } finally {
      setLoadingNutrition(prev => ({ ...prev, [index]: false }));
    }
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, завантажте зображення");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Максимальний розмір файлу - 5MB");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const { uploadApi } = await import("@/lib/api");
      const token = localStorage.getItem("token");
      const result = await uploadApi.uploadImageFile(file, token || undefined);
      
      setFormData((prev) => ({ ...prev, imageUrl: result.url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Помилка завантаження фото. Спробуйте ще раз.");
    } finally {
      setUploading(false);
    }
  };

  // AI Generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert("Опишіть, яку страву ви хочете приготувати");
      return;
    }

    setGeneratingAI(true);

    try {
      const { aiApi } = await import("@/lib/api");
      const token = localStorage.getItem("token");
      
      const response: any = await aiApi.generateRecipe({
        title: aiPrompt,
        language: "ua",
      }, token || undefined);

      console.log("AI Response:", response);

      if (response && (response.data || response.title)) {
        let generatedRecipe = response.data || response;
        
        console.log("Generated Recipe before parsing:", generatedRecipe);

        // Try to parse JSON from description field
        if (typeof generatedRecipe.description === "string" && generatedRecipe.description.trim().startsWith("{")) {
          try {
            // Try to complete broken JSON by adding closing braces
            let jsonStr = generatedRecipe.description.trim();
            
            // Count opening and closing braces
            const openBraces = (jsonStr.match(/{/g) || []).length;
            const closeBraces = (jsonStr.match(/}/g) || []).length;
            const openBrackets = (jsonStr.match(/\[/g) || []).length;
            const closeBrackets = (jsonStr.match(/]/g) || []).length;
            
            // Add missing closing braces/brackets
            for (let i = 0; i < openBrackets - closeBrackets; i++) {
              jsonStr += ']';
            }
            for (let i = 0; i < openBraces - closeBraces; i++) {
              jsonStr += '}';
            }
            
            console.log("Attempting to parse JSON:", jsonStr.substring(0, 200) + "...");
            const parsed = JSON.parse(jsonStr);
            
            // ВАЖЛИВО: Заміняємо весь generatedRecipe на parsed дані
            generatedRecipe = parsed;
            console.log("Successfully parsed AI JSON:", parsed);
          } catch (e) {
            console.warn("Failed to parse AI JSON:", e);
            console.log("JSON string that failed:", generatedRecipe.description.substring(0, 500));
          }
        }

        console.log("Final generated recipe:", generatedRecipe);
        console.log("Ingredients array:", generatedRecipe.ingredients);
        console.log("Steps array:", generatedRecipe.steps);

        const mappedIngredients = generatedRecipe.ingredients?.map((ing: any) => {
          console.log("Mapping ingredient:", ing);
          return {
            name: ing.name,
            brutto: ing.gross || ing.grossWeight || ing.brutto || ing.amount,
            netto: ing.net || ing.netWeight || ing.netto || ing.amount,
            unit: ing.unit || "г",
            calories: ing.calories,
            protein: ing.protein,
            fat: ing.fat || ing.fats,
            carbs: ing.carbs,
            cost: ing.cost,
          };
        }) || [{ name: "", brutto: undefined, netto: undefined, unit: "г" }];

        console.log("Mapped ingredients:", mappedIngredients);

        const newFormData = {
          title: generatedRecipe.title || aiPrompt,
          description: generatedRecipe.description || "",
          imageUrl: formData.imageUrl,
          category: generatedRecipe.category || "",
          difficulty: generatedRecipe.difficulty || "beginner",
          cookingTime: generatedRecipe.time || generatedRecipe.cookingTime,
          servings: generatedRecipe.portions || generatedRecipe.servings,
          ingredients: mappedIngredients,
          steps: generatedRecipe.steps || [""],
          grossWeight: generatedRecipe.grossWeight,
          netWeight: generatedRecipe.netWeight,
          calories: generatedRecipe.calories,
          protein: generatedRecipe.protein,
          fats: generatedRecipe.fats,
          carbs: generatedRecipe.carbs,
          yield: generatedRecipe.yield,
          cost: generatedRecipe.cost,
          tokensReward: generatedRecipe.tokensReward,
        };

        console.log("Setting form data to:", newFormData);
        setFormData(newFormData);

        alert("✨ Рецепт згенеровано! Перевірте та відредагуйте за потреби.");

        // Auto-fetch nutrition for all ingredients after state update
        if (mappedIngredients && mappedIngredients.length > 0) {
          console.log("Auto-fetching nutrition for ingredients...");
          
          // Use setTimeout to ensure state is updated
          setTimeout(() => {
            mappedIngredients.forEach((ing: any, index: number) => {
              if (ing.name && ing.name.trim()) {
                const weight = ing.netto || ing.brutto || 100;
                console.log(`Fetching nutrition for ${ing.name} (${weight}g) at index ${index}`);
                fetchIngredientNutrition(index, ing.name, weight);
              }
            });
          }, 1000); // Increased delay
        }
      }
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      alert(`Помилка генерації: ${error.message || "Спробуйте пізніше"}`);
    } finally {
      setGeneratingAI(false);
    }
  };

  // Ingredient management
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", brutto: undefined, netto: undefined, unit: "г" }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, field: keyof IngredientData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => {
        if (i === index) {
          const ingredient = typeof item === 'string' ? { name: item } : item;
          const updated = { ...ingredient, [field]: value } as IngredientData;
          
          if (field === 'name' && typeof value === 'string' && value.trim()) {
            const weight = updated.netto || updated.brutto;
            setTimeout(() => fetchIngredientNutrition(index, value, weight), 500);
          } else if ((field === 'netto' || field === 'brutto') && updated.name) {
            const weight = typeof value === 'number' ? value : undefined;
            setTimeout(() => fetchIngredientNutrition(index, updated.name, weight), 500);
          }
          
          return updated;
        }
        return item;
      }),
    }));
  };

  // Steps management
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, ""],
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((item, i) => (i === index ? value : item)),
    }));
  };

  // Submit
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Додайте назву страви");
      return;
    }

    const validIngredients = formData.ingredients.filter(i => {
      const name = typeof i === 'string' ? i.trim() : i.name?.trim();
      return name && name.length > 0;
    });

    if (validIngredients.length === 0) {
      alert("Додайте хоча б один інгредієнт");
      return;
    }

    setSubmitting(true);

    try {
      const { academyApi } = await import("@/lib/api");
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Увійдіть для публікації рецепта");
        router.push("/");
        return;
      }

      // Calculate totals
      let totalCalories = 0;
      let totalProtein = 0;
      let totalFat = 0;
      let totalCarbs = 0;
      let totalCost = 0;
      let totalGrossWeight = 0;
      let totalNetWeight = 0;

      formData.ingredients.forEach((ing) => {
        if (typeof ing !== 'string') {
          totalCalories += ing.totalCalories || ing.calories || 0;
          totalProtein += ing.protein || 0;
          totalFat += ing.fat || 0;
          totalCarbs += ing.carbs || 0;
          totalCost += ing.cost || 0;
          totalGrossWeight += ing.brutto || 0;
          totalNetWeight += ing.netto || 0;
        }
      });

      const tokensReward = 10 + 
        (formData.ingredients.length > 5 ? 5 : 0) +
        (formData.steps.length > 3 ? 5 : 0) +
        (formData.difficulty === 'intermediate' ? 5 : 0) +
        (formData.difficulty === 'advanced' ? 10 : 0);

      const postData = {
        ...formData,
        grossWeight: totalGrossWeight,
        netWeight: totalNetWeight,
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein * 10) / 10,
        fats: Math.round(totalFat * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        yield: totalNetWeight,
        cost: Math.round(totalCost * 100) / 100,
        tokensReward,
      };

      await academyApi.createPost(postData, token);
      
      alert("✅ Рецепт успішно опубліковано!");
      router.push("/create-chat");
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Помилка публікації. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate totals for display
  const totalStats = formData.ingredients.reduce((acc, ing) => {
    if (typeof ing !== 'string') {
      return {
        calories: acc.calories + (ing.totalCalories || ing.calories || 0),
        protein: acc.protein + (ing.protein || 0),
        fat: acc.fat + (ing.fat || 0),
        carbs: acc.carbs + (ing.carbs || 0),
        cost: acc.cost + (ing.cost || 0),
        grossWeight: acc.grossWeight + (ing.brutto || 0),
        netWeight: acc.netWeight + (ing.netto || 0),
      };
    }
    return acc;
  }, { calories: 0, protein: 0, fat: 0, carbs: 0, cost: 0, grossWeight: 0, netWeight: 0 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Створити рецепт</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* AI Assistant Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-2xl"
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">✨ Шеф-Асистент Діма Фомін</h2>
              <p className="text-white/90 text-xs sm:text-sm mt-1 hidden sm:block">
                Опишіть страву — AI створить повний рецепт за секунди
              </p>
            </div>
          </div>

          {!generatingAI ? (
            <div className="space-y-3 sm:space-y-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Наприклад: Роли Філадельфія з лососем 🍣"
                className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl sm:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/50 resize-none text-base sm:text-lg"
                rows={3}
              />

              <Button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim()}
                className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 sm:py-6 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg transition-all"
              >
                <Sparkles className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Згенерувати рецепт
              </Button>

              <p className="text-xs sm:text-sm text-white/80 text-center">
                AI автоматично заповнить назву, опис, інгредієнти, кроки, калорії та вартість
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 sm:space-y-6 py-2 sm:py-4"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-3 sm:mb-4"
                >
                  <Sparkles className="w-12 h-12 sm:w-16 sm:h-16" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">🤖 AI готує ваш рецепт...</h3>
                <p className="text-white/90 text-xs sm:text-sm">Зачекайте кілька секунд</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: "🍣", text: "Аналіз інгредієнтів", delay: 0 },
                  { icon: "🔥", text: "Розрахунок калорій", delay: 0.5 },
                  { icon: "💰", text: "Обчислення токенів", delay: 1 },
                  { icon: "📝", text: "Створення кроків", delay: 1.5 },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step.delay }}
                    className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: step.delay }}
                      className="text-2xl sm:text-3xl"
                    >
                      {step.icon}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">{step.text}</p>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: step.delay }}
                        className="h-1 bg-white/50 rounded-full mt-1 sm:mt-2"
                      />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center text-xs sm:text-sm text-white/70 mt-2 sm:mt-4">
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨ Магія кулінарії в процесі...
                </motion.p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
        >
          {/* Success message after AI generation */}
          {formData.title && formData.description && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-green-900">
                ✅ Рецепт згенеровано! Перевірте та відредагуйте за потреби
              </p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              📸 Фото страви
            </label>
            
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-purple-400 transition-colors bg-gray-50 hover:bg-purple-50">
                <div className="flex flex-col items-center justify-center">
                  {uploading ? (
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-3" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  )}
                  <p className="mb-2 text-sm text-gray-600 font-medium">
                    Клікніть для завантаження
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                <button
                  onClick={() => {
                    setImagePreview("");
                    setFormData(prev => ({ ...prev, imageUrl: "" }));
                  }}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                📝 Назва страви *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="напр. Роли Філадельфія"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                🎯 Категорія
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
              >
                <option value="">Оберіть категорію</option>
                {RECIPE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              📄 Опис страви
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Розкажіть про свою страву..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
              rows={3}
            />
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                ⚡ Складність
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                ⏱️ Час (хв)
              </label>
              <input
                type="number"
                value={formData.cookingTime || ""}
                onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || undefined })}
                placeholder="30"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                🍽️ Порцій
              </label>
              <input
                type="number"
                value={formData.servings || ""}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || undefined })}
                placeholder="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-gray-900">
                🥬 Інгредієнти
              </label>
              <Button
                onClick={addIngredient}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Додати
              </Button>
            </div>

            <div className="space-y-3">
              {formData.ingredients.map((ing, index) => {
                const ingredient = typeof ing === 'string' ? { name: ing } : ing;
                return (
                  <div key={index} className="grid grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-xl">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="Назва інгредієнта"
                      className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={ingredient.brutto || ""}
                      onChange={(e) => updateIngredient(index, 'brutto', parseFloat(e.target.value) || undefined)}
                      placeholder="Брутто"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={ingredient.netto || ""}
                      onChange={(e) => updateIngredient(index, 'netto', parseFloat(e.target.value) || undefined)}
                      placeholder="Нетто"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={ingredient.unit || ""}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      placeholder="г"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={ingredient.cost || ""}
                      onChange={(e) => updateIngredient(index, 'cost', parseFloat(e.target.value) || undefined)}
                      placeholder="₴"
                      className="col-span-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:outline-none"
                    />
                    <button
                      onClick={() => removeIngredient(index)}
                      className="col-span-1 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {ingredient.calories && (
                      <div className="col-span-12 text-xs text-gray-600 px-2">
                        💡 {Math.round(ingredient.totalCalories || ingredient.calories || 0)} kcal, 
                        Б: {(ingredient.protein || 0).toFixed(1)}г, 
                        Ж: {(ingredient.fat || 0).toFixed(1)}г, 
                        В: {(ingredient.carbs || 0).toFixed(1)}г
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4">
            <h4 className="text-sm font-bold text-blue-900 mb-3">📊 Загальна харчова цінність</h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{Math.round(totalStats.calories)}</p>
                <p className="text-xs text-gray-600">Калорії</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{totalStats.protein.toFixed(1)}г</p>
                <p className="text-xs text-gray-600">Білки</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{totalStats.fat.toFixed(1)}г</p>
                <p className="text-xs text-gray-600">Жири</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{totalStats.carbs.toFixed(1)}г</p>
                <p className="text-xs text-gray-600">Вуглеводи</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center mt-3 pt-3 border-t border-blue-200">
              <div>
                <p className="text-lg font-bold text-purple-600">{totalStats.grossWeight.toFixed(0)}г</p>
                <p className="text-xs text-gray-600">Брутто</p>
              </div>
              <div>
                <p className="text-lg font-bold text-indigo-600">{totalStats.netWeight.toFixed(0)}г</p>
                <p className="text-xs text-gray-600">Нетто</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{totalStats.cost.toFixed(2)} ₴</p>
                <p className="text-xs text-gray-600">Вартість</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-gray-900">
                👨‍🍳 Кроки приготування
              </label>
              <Button
                onClick={addStep}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Додати крок
              </Button>
            </div>

            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm mt-2">
                    {index + 1}
                  </div>
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Крок ${index + 1}...`}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
                    rows={2}
                  />
                  <button
                    onClick={() => removeStep(index)}
                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tokens Info */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-900">
                  💰 Заробіть ChefTokens!
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Базова нагорода: 10 CT + бонуси за складність та деталі
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-600">
                  {10 + 
                    (formData.ingredients.length > 5 ? 5 : 0) +
                    (formData.steps.length > 3 ? 5 : 0) +
                    (formData.difficulty === 'intermediate' ? 5 : 0) +
                    (formData.difficulty === 'advanced' ? 10 : 0)
                  } CT
                </p>
                <p className="text-xs text-amber-700">За цей рецепт</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !formData.title.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-6 text-lg rounded-2xl shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Публікую...
                </>
              ) : (
                <>
                  <ChefHat className="mr-3 h-6 w-6" />
                  Опублікувати рецепт
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
